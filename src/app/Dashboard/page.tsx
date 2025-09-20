// app/(dashboard)/page.tsx
"use client"

import Footer from "@/components/Footer";
import Link from "next/link";
import { useAppDispatch } from "@/app/redux/hooks";
import { logoutUser } from "@/app/redux/features/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/redux/hooks";
import { useEffect } from "react";

/** Types removed as static data is used without typings for now */

// Function removed - using static data in component for now

function SidebarLink({ href = "#", label, active = false, onClick }: { href?: string; label: string; active?: boolean; onClick?: () => void }) {
  if (onClick) {
    return (
      <button onClick={onClick} className={["sidebar-link", "hover-grey", active ? "active" : ""].join(" ")}>
        <span>{label}</span>
      </button>
    );
  }
  
  return (
    <Link href={href} className={["sidebar-link", "hover-grey", active ? "active" : ""].join(" ")}>
      <span>{label}</span>
    </Link>
  );
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/Login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="center-wrap with-mandala with-minar">
        <div className="main-card p-8 text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Application sections - these would be fetched from user's application data
  const sections = [
    { key: "profile", label: "Profile", completed: checkSectionComplete("profile") },
    { key: "family", label: "Family", completed: checkSectionComplete("family") },
    { key: "education", label: "Education", completed: checkSectionComplete("education") },
    { key: "extracurricular", label: "Extracurricular", completed: checkSectionComplete("extracurricular") },
  ];

  // User's colleges - would be fetched from user's college applications
  const colleges = { list: [] as Array<{ name: string; status: string }> }; // TODO: Fetch from user's college applications

  // Helper function to check if a section is complete
  function checkSectionComplete(sectionKey: string): boolean {
    try {
      const storageKey = `pcas:application:${sectionKey}`;
      const stored = localStorage.getItem(storageKey);
      if (!stored) return false;
      
      const parsed = JSON.parse(stored);
      return parsed.status === 'complete' || parsed.status === 'in_progress';
    } catch {
      return false;
    }
  }
  
  const completedCount = sections.reduce((count, section) => {
    return count + (section.completed ? 1 : 0);
  }, 0);
  
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  const deriveInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase() || "U";
  };

  const displayName = user.fullName;
  const displayInitials = deriveInitials(user.fullName);

  const handleSignOut = async () => {
    try {
      await dispatch(logoutUser());
      router.push('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails on server, we still redirect to clear the UI
      router.push('/');
    }
  };

  return (
    <>
      <main className="center-wrap with-mandala with-minar" role="main">
        <div className="dashboard-grid">
          {/* LEFT RAIL */}
          <aside className="left-rail">
            <div className="sticky top-6 flex h-[calc(100vh-3rem)] flex-col rounded-2xl p-4 main-card">
              <div className="mb-6 px-1">
                <div className="text-sm font-semibold leading-tight">
                  Your<br />application
                </div>
              </div>

              <nav className="space-y-1">
                <SidebarLink href="/Dashboard" label="Dashboard" active />
                <SidebarLink href="/MainPages/MyApplication/Profile" label="My PCAS Application" />
                <SidebarLink href="/colleges" label="My Colleges" />
              </nav>

              <div className="mt-6">
                <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Explore
                </p>
                <nav className="space-y-1">
                  <SidebarLink href="/search" label="University search" />
                </nav>
              </div>

              <div className="mt-auto space-y-1">
                <SidebarLink href="/settings" label="Settings" />
                <SidebarLink label="Sign out" onClick={handleSignOut} />
                <div className="mt-3 flex items-center gap-3 rounded-xl p-3 text-sm main-card" style={{ width: "100%", margin: 0 }}>
                  <div className="grid h-9 w-9 place-items-center rounded-full" style={{ background: "var(--emerald)", color: "white" }}>
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
            <section className="main-card main-card-lg" style={{ margin: 0 }}>
              {/* Greeting */}
              <header className="pb-4 mb-2 border-b border-black/10">
                <h1 className="title-primary !text-left !mb-1">
                  {greeting}, {displayName.split(" ")[0]}!
                </h1>
                <p className="title-secondary !text-left">
                  Here’s a snapshot of your application progress.
                </p>
              </header>

              {/* My Common Application (chips) */}
              <section className="py-4 border-b border-black/10">
                <h4 className="text-lg font-semibold mb-3">My Common Application</h4>
                <div className="chips">
                  {sections.map((s) => (
                    <Link key={s.key} href={`/MainPages/MyApplication/${s.key === 'activities' ? 'Extracurricular' : s.key.charAt(0).toUpperCase() + s.key.slice(1)}`} className="chip">
                      {/* add a subtle status dot before label */}
                      <span
                        className={[
                          "sidebar-dot",
                          s.completed ? "filled" : "",
                        ].join(" ")}
                        aria-hidden
                        style={{ marginRight: 8 }}
                      />
                      {s.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  {completedCount}/{sections.length} sections complete
                </div>
              </section>

              {/* My Colleges */}
              <section className="py-4 border-b border-black/10">
                <h4 className="text-lg font-semibold mb-3">My Colleges</h4>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">
                      {colleges.list.length} college{colleges.list.length !== 1 ? 's' : ''} on my list
                    </p>
                    <div className="mt-2 h-2 w-56 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full"
                        style={{ width: colleges.list.length > 0 ? `33%` : '0%', background: "var(--emerald)" }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {colleges.list.filter((c) => c.status === "in_progress").length} in progress
                    </p>
                  </div>
                  <Link href="/colleges" className="normal-button whitespace-nowrap">
                    Show colleges
                  </Link>
                </div>
              </section>

              {/* Deadlines */}
              <section className="py-4">
                <h4 className="text-lg font-semibold mb-2">Deadlines</h4>
                <p className="text-sm text-gray-600">
                  To set deadlines, go to the application questions for each college on your list and
                  select a term and admission plan.
                </p>
                <div className="mt-4">
                  <Link href="/colleges" className="outline-button">
                    Go to My Colleges
                  </Link>
                </div>
              </section>
            </section>
          </section>

          {/* RIGHT RAIL */}
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
                  <summary>How can I add a college to My Colleges?</summary>
                  <div className="faq-body">
                    Select <strong>University search</strong> from the left navigation,
                    find your college, then add it to your list.
                  </div>
                </details>
                <details className="faq-item">
                  <summary>I already submitted, can I change answers?</summary>
                  <div className="faq-body">
                    You can return any time and change your answers in <em>My Common Application</em>.
                    Some colleges might lock certain items—check each college section.
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
