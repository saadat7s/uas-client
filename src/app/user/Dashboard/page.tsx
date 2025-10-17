// app/(dashboard)/page.tsx
"use client"

import Footer from "@/components/Footer"
import Link from "next/link"
import { useAppDispatch } from "@/app/redux/hooks"
import { logoutUser } from "@/app/redux/features/auth"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/redux/hooks"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { canSendApplication, selectPicks, selectCatalog } from "@/app/redux/slices/universitiesSlice"

/** Types removed as static data is used without typings for now */

function SidebarLink({
  href = "#",
  label,
  active = false,
  onClick,
}: {
  href?: string
  label: string
  active?: boolean
  onClick?: () => void
}) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={["sidebar-link", "hover-grey", active ? "active" : ""].join(" ")}
      >
        <span>{label}</span>
      </button>
    )
  }

  return (
    <Link href={href} className={["sidebar-link", "hover-grey", active ? "active" : ""].join(" ")}>
      <span>{label}</span>
    </Link>
  )
}

/** Bigger ticked-circle status icon */
const StatusIcon = ({
  done,
  size = 24,
  className = "",
}: {
  done: boolean
  size?: number
  className?: string
}) => {
  return (
    <span
      aria-hidden
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, color: done ? "var(--emerald)" : "rgba(0,0,0,.4)" }}
    >
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.2" />
        {done && (
          <path
            d="M16.2 9.6l-4.6 4.8-2.3-2.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </span>
  )
}

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const appReady = useSelector((s) => canSendApplication(s))
  const picks = useSelector(selectPicks)
  const catalog = useSelector(selectCatalog)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/user/Login")
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="center-wrap with-mandala with-minar">
        <div className="main-card p-8 text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) return null

  function checkSectionComplete(sectionKey: string): boolean {
    try {
      const storageKey = `pcas:application:${sectionKey}`
      const stored = localStorage.getItem(storageKey)
      if (!stored) return false
      const parsed = JSON.parse(stored)
      return parsed.status === "complete" || parsed.status === "in_progress"
    } catch {
      return false
    }
  }

  const sections = [
    { key: "profile", label: "Profile", completed: checkSectionComplete("profile") },
    { key: "family", label: "Family", completed: checkSectionComplete("family") },
    { key: "education", label: "Education", completed: checkSectionComplete("education") },
    { key: "extracurricular", label: "Extracurricular", completed: checkSectionComplete("extracurricular") },
  ]

  const completedCount = sections.reduce((c, s) => c + (s.completed ? 1 : 0), 0)

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return "Good morning"
    if (h < 18) return "Good afternoon"
    return "Good evening"
  })()

  const deriveInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/)
    const first = parts[0]?.[0] || ""
    const last = parts.length > 1 ? parts[parts.length - 1][0] : ""
    return (first + last).toUpperCase() || "U"
  }

  const displayName = user.fullName
  const displayInitials = deriveInitials(user.fullName)

  const handleSignOut = async () => {
    try {
      await (dispatch as any)(logoutUser()).unwrap()
      router.push("/")
    } catch {
      router.push("/")
    }
  }

  return (
    <>
      <main className="center-wrap with-mandala with-minar" role="main">
        <div className="dashboard-grid">
          {/* LEFT RAIL */}
          <aside className="left-rail">
            <div className="sticky top-6 flex h-[calc(100vh-3rem)] flex-col rounded-2xl p-4 main-card">
              <div className="mb-6 px-1">
                <div className="text-sm font-semibold leading-tight">
                  Your
                  <br />application
                </div>
              </div>

              <nav className="space-y-1">
                <SidebarLink href="/user/Dashboard" label="Dashboard" active />
                <SidebarLink href="/user/MainPages/MyApplication/Profile" label="My PCAS Application" />
                <SidebarLink href="/user/universities/my" label="My universities" />
              </nav>

              <div className="mt-6">
                <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Explore
                </p>

                <nav className="space-y-1">
                  <SidebarLink href="/user/universities/search" label="University search" />
                </nav>
              </div>

              <div className="mt-auto space-y-1">
                <SidebarLink href="/user/settings" label="Settings" />
                <SidebarLink label="Sign out" onClick={handleSignOut} />

                <div
                  className="mt-3 flex items-center gap-3 rounded-xl p-3 text-sm main-card"
                  style={{ width: "100%", margin: 0 }}
                >
                  <div
                    className="grid h-9 w-9 place-items-center rounded-full"
                    style={{ background: "var(--emerald)", color: "white" }}
                  >
                    {displayInitials}
                  </div>

                  <div>
                    <div className="font-medium leading-tight">{displayName}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER RAIL */}
          <section className="center-rail">
            <section className="main-card main-card-lg center-sheet" style={{ margin: 0 }}>
              {/* Greeting */}
              <header className="pb-4 mb-2 center-sheet__header">
                <h1 className="title-primary !text-left !mb-1">
                  {greeting}, {displayName.split(" ")[0]}!
                </h1>

                <p className="title-secondary !text-left">Here’s a snapshot of your application progress.</p>
              </header>

              {/* My PCAS Application */}
              <section className="section-block">
                <div className="section-title">My PCAS Application</div>

                <div className="chips chips--soft">
                  {sections.map((s) => (
                    <Link
                      key={s.key}
                      href={`/user/MainPages/MyApplication/${
                        s.key === "activities" ? "Extracurricular" : s.key.charAt(0).toUpperCase() + s.key.slice(1)
                      }`}
                      className="chip"
                      style={{ padding: "8px 12px" }}
                    >
                      <StatusIcon done={s.completed} size={24} className="mr-2" />
                      {s.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  {completedCount}/{sections.length} sections complete
                </div>
              </section>

              {/* My Universities */}
              <section className="section-block">
                <div className="section-title">My Universities</div>

                <div className="min-w-0">
                  <p className="text-sm text-gray-600">{picks.length} on my list</p>

                  {picks.length > 0 ? (
                    <div className="numbered-list" role="region" aria-label="Numbered university list">
                      <ol className="numbered-list__ol">
                        {picks.map((p, idx) => {
                          const u = catalog[p.uniId]
                          if (!u) return null
                          return (
                            <li key={p.uniId} className="numbered-item">
                              <span className="num-badge">{idx + 1}</span>
                              <div className="item-main">
                                {/* FULL NAME — NO TRUNCATION */}
                                <div className="item-title item-title--wrap">{u.name}</div>
                              </div>

                              <Link href="/user/universities/my" className="item-action">
                                Edit
                              </Link>
                            </li>
                          )
                        })}
                      </ol>
                    </div>
                  ) : (
                    <span className="mt-2 block text-sm text-gray-500">Start by adding from search.</span>
                  )}
                </div>
              </section>

              {/* Deadlines */}
              <section className="section-block section-block--last">
                <div className="section-title">Deadlines</div>

                {picks.length === 0 ? (
                  <p className="text-sm text-gray-600">Add universities to see upcoming deadlines.</p>
                ) : (
                  <div className="deadline-list" role="region" aria-label="Application deadlines">
                    {picks.map((p, i) => {
                      const u = catalog[p.uniId]
                      if (!u) return null

                      const dateLabel = u.deadlineISO ? new Date(u.deadlineISO).toLocaleDateString() : "Not set"

                      return (
                        <article key={i} className="deadline-item">
                          <span className="deadline-dot" aria-hidden />
                          <div className="deadline-main">
                            <div className="deadline-title">{u.name}</div>
                            <div className="deadline-sub">
                              <span className="deadline-date">
                                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                                  <rect
                                    x="3"
                                    y="5"
                                    width="18"
                                    height="16"
                                    rx="3"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  />
                                  <path d="M8 3v4M16 3v4M3 10h18" fill="none" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                {dateLabel}
                              </span>

                              {u.applicationFeePKR && (
                                <span className="deadline-fee">Fee: {Math.round(u.applicationFeePKR / 1000)}k PKR</span>
                              )}
                            </div>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}
              </section>

              {/* ACTIONS AT BOTTOM-RIGHT */}
              <div className="section-actions w-full">
                <Link href="/user/universities/my" className="outline-button whitespace-nowrap">
                  My Universities
                </Link>
                <Link href="/user/universities/search" className="outline-button whitespace-nowrap">
                  Search
                </Link>
                <Link
                  href="/user/checkout"
                  className={`normal-button whitespace-nowrap ${appReady ? "" : "disabled:pointer-events-none opacity-60"}`}
                  aria-disabled={!appReady}
                >
                  Send Application
                </Link>
              </div>
            </section>
          </section>

          {/* RIGHT RAIL */}
          <aside className="right-rail">
            <div className="main-card main-card-sm faq-card">
              <header className="mb-3">
                <div className="text-sm font-semibold opacity-80">Help & support</div>
              </header>

              <div className="faq-search mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21 21l-4.3-4.3" stroke="#0d6b55" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="11" cy="11" r="7" stroke="#0d6b55" strokeWidth="2" />
                </svg>
                <input className="w-full outline-none text-sm" placeholder="Search FAQs" />
              </div>

              <div className="space-y-2">
                <details className="faq-item" open>
                  <summary>How can I add a college to My Colleges?</summary>
                  <div className="faq-body">
                    Select <strong>University search</strong> from the left navigation, find your college, then add it to your list.
                  </div>
                </details>

                <details className="faq-item">
                  <summary>I already submitted, can I change answers?</summary>
                  <div className="faq-body">
                    You can return any time and change your answers in <em>My PCAS Application</em>. Some colleges might lock certain items—check each college section.
                  </div>
                </details>

                <details className="faq-item">
                  <summary>How many colleges can I add?</summary>
                  <div className="faq-body">You may add and apply to up to 20 colleges.</div>
                </details>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  )
}
