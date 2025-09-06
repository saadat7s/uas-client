// components/application/LeftRail.tsx
import Link from "next/link";

export default function LeftRail() {
  return (
    <aside className="left-rail">
      <div className="sticky top-6 flex h-[calc(100vh-3rem)] flex-col rounded-2xl p-4 main-card">
        <div className="mb-6 px-1">
          <div className="text-sm font-semibold leading-tight">
            Your<br />application
          </div>
        </div>

        <nav className="space-y-1">
          <SidebarLink href="/Dashboard" label="Dashboard" />
          <SidebarLink href="/MainPages/MyApplication/Profile" label="My Pucas Applications" active />
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
              RY
            </div>
            <div>
              <div className="font-medium leading-tight">Raja Yaseen</div>
              <div className="text-xs text-gray-500">CAID 47247138</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ href = "#", label, active = false }: { href?: string; label: string; active?: boolean }) {
  return (
    <Link href={href} className={["sidebar-link", "hover-grey", active ? "active" : ""].join(" ")}>
      <span>{label}</span>
    </Link>
  );
}
