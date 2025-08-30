// app/(dashboard)/page.tsx
import Footer from "@/components/Footer";
import Link from "next/link";

interface Section { key: string; label: string; completed: boolean }
interface CollegeSummary { name: string; status: "in_progress" | "submitted" | "draft" }
interface DashboardData {
  user: { name: string; caid: string; initials: string };
  sections: Section[];
  colleges: { list: CollegeSummary[] };
}

async function getDashboardData(): Promise<DashboardData> {
  // TODO: wire to your API. Fallback keeps the page rendering.
  return {
    user: { name: "Raja Yaseen", caid: "47247138", initials: "RY" },
    sections: [
      { key: "profile", label: "Profile", completed: false },
      { key: "family", label: "Family", completed: false },
      { key: "education", label: "Education", completed: false },
      { key: "testing", label: "Testing", completed: false },
      { key: "activities", label: "Activities", completed: false },
      { key: "writing", label: "Writing", completed: false },
    ],
    colleges: { list: [{ name: "Rollins College", status: "in_progress" }] },
  };
}

function SidebarLink({ href = "#", label, active = false }: { href?: string; label: string; active?: boolean }) {
  return (
    <Link href={href} className={["sidebar-link", "hover-grey", active ? "active" : ""].join(" ")}>
      <span>{label}</span>
    </Link>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <>
      <main className="center-wrap with-mandala with-minar" role="main">
        <div className="dashboard-grid">
          {/* LEFT RAIL */}
          <aside className="left-rail">
            <div className="sticky top-6 flex h-[calc(100vh-3rem)] flex-col rounded-2xl p-4 main-card">
              <div className="mb-6 px-1">
                <div className="text-sm font-semibold leading-tight">Your<br />application</div>
              </div>

              <nav className="space-y-1">
                <SidebarLink href="/" label="Dashboard" active />
                <SidebarLink href="/application" label="My Pucas Applications" />
                <SidebarLink href="/colleges" label="My Universities" />
              </nav>

              <div className="mt-6">
                <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Explore</p>
                <nav className="space-y-1">
                  <SidebarLink href="/search" label="University search" />
                </nav>
              </div>

              <div className="mt-auto space-y-1">
                <SidebarLink href="/settings" label="Settings" />
                <SidebarLink href="/signout" label="Sign out" />
                <div className="mt-3 flex items-center gap-3 rounded-xl p-3 text-sm main-card" style={{ width: "100%", margin: 0 }}>
                  <div className="grid h-9 w-9 place-items-center rounded-full" style={{ background: "var(--emerald)", color: "white" }}>
                    {data.user.initials}
                  </div>
                  <div>
                    <div className="font-medium leading-tight">{data.user.name}</div>
                    <div className="text-xs text-gray-500">CAID {data.user.caid}</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER: Unified card with greeting IN the card */}
          <section className="center-rail">
            <section className="main-card main-card-lg" style={{ margin: 0 }}>
              {/* Header (greeting) */}
              <header className="pb-4 mb-2 border-b border-black/10">
                {/* Override center alignment from .title-primary so it reads like a card header */}
                <h1 className="title-primary !text-left !mb-1">
                  {greeting}, {data.user.name.split(" ")[0]}!
                </h1>
                <p className="title-secondary !text-left">Here’s a snapshot of your application progress.</p>
              </header>

              {/* Section: My PUCAS Application */}
              <section className="py-4 border-b border-black/10">
                <h4 className="text-lg font-semibold mb-3">My PUCAS Application</h4>
                <div className="chips">
                  {data.sections.map((s) => (
                    <Link key={s.key} href={`/application/${s.key}`} className="chip">
                      {s.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  {data.sections.filter((s) => s.completed).length}/{data.sections.length} sections complete
                </div>
              </section>

              {/* Section: My Colleges */}
              <section className="py-4 border-b border-black/10">
                <h4 className="text-lg font-semibold mb-3">My Colleges</h4>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">{data.colleges.list.length} college on my list</p>
                    <div className="mt-2 h-2 w-56 overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full rounded-full" style={{ width: `33%`, background: "var(--emerald)" }} />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {data.colleges.list.filter((c) => c.status === "in_progress").length} in progress
                    </p>
                  </div>
                  <Link href="/colleges" className="normal-button whitespace-nowrap">
                    Show colleges
                  </Link>
                </div>
              </section>

              {/* Section: Deadlines */}
              <section className="py-4">
                <h4 className="text-lg font-semibold mb-2">Deadlines</h4>
                <p className="text-sm text-gray-600">
                  To set deadlines, go to the application questions for each college on your list and select a term and admission
                  plan.
                </p>
                <div className="mt-4">
                  <Link href="/colleges" className="outline-button">
                    Go to My Colleges
                  </Link>
                </div>
              </section>
            </section>
          </section>

          {/* RIGHT: FAQ panel */}
          <aside className="right-rail">
            <div className="main-card main-card-sm faq-card">
              <header className="mb-3">
                <div className="text-sm font-semibold opacity-80">Help & support</div>
              </header>
              <div className="faq-search mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-4.3-4.3" stroke="#0d6b55" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="11" cy="11" r="7" stroke="#0d6b55" strokeWidth="2" />
                </svg>
                <input className="w-full outline-none text-sm" placeholder="Search FAQs" />
              </div>
              <div className="space-y-2">
                <details className="faq-item" open>
                  <summary>How can I add a college to My colleges?</summary>
                  <div className="faq-body">
                    Select <strong>College search</strong> from the left navigation, find your college, then add it to your list.
                  </div>
                </details>
                <details className="faq-item">
                  <summary>I already submitted, can I change answers?</summary>
                  <div className="faq-body">
                    You can return any time and change your answer to any question in <em>My Common Application</em>. Some colleges
                    might lock certain items—check each college section.
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
  );
}
