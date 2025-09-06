"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type SectionKey = "profile" | "family" | "education" | "extracurricular";

const SECTIONS: { key: SectionKey; label: string; href: string }[] = [
  { key: "profile",        label: "Profile",         href: "/MainPages/MyApplication/Profile" },
  { key: "family",         label: "Family",          href: "/MainPages/MyApplication/Family" },
  { key: "education",      label: "Education",       href: "/MainPages/MyApplication/Education" },
  { key: "extracurricular",label: "Extracurricular", href: "/MainPages/MyApplication/Extracurricular" },
];

function getStored<T>(k: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function LeftRail() {
  const pathname = usePathname();

  // derive completion from localStorage saves for each section
  const [completed, setCompleted] = useState<Record<SectionKey, boolean>>({
    profile: false,
    family: false,
    education: false,
    extracurricular: false,
  });

  useEffect(() => {
    const prof = getStored<{ values: any }>("pcas:application:profile", { values: {} }).values;
    const fam  = getStored<{ values: any }>("pcas:application:family", { values: {} }).values;
    const edu  = getStored<{ values: any }>("pcas:application:education", { values: {} }).values;
    const ext  = getStored<{ values: any }>("pcas:application:extracurricular", { values: {} }).values;

    setCompleted({
      profile:
        !!prof?.firstName?.trim() &&
        !!prof?.lastName?.trim() &&
        !!prof?.address?.trim() &&
        !!prof?.primaryLang &&
        !!prof?.citizen &&
        !!prof?.cnic?.trim() &&
        !!prof?.gender?.trim() &&
        !!prof?.dob &&
        !!prof?.maritalStatus?.trim() &&
        !!prof?.phone?.trim(),
      family:
        !!fam?.fatherName?.trim() && !!fam?.motherName?.trim() && !!fam?.fatherOccupation,
      education:
        !!edu?.matricGrades?.trim() && !!edu?.matricPicName &&
        !!edu?.fscGrades?.trim()   && !!edu?.fscPicName &&
        !!edu?.collegeName?.trim(),
      extracurricular: !!ext?.clubs?.trim(),
    });
  }, []);

  return (
    <aside className="left-rail">
      <div className="sticky top-6 flex h-[calc(100vh-3rem)] flex-col rounded-2xl p-4 main-card">
        <div className="mb-6 px-1">
          <div className="text-sm font-semibold leading-tight">
            Your<br />application
          </div>
        </div>

        <nav className="space-y-1">
          <SidebarLink href="/Dashboard" label="Dashboard" active={pathname === "/Dashboard"} />
          <SidebarLink
            href="/MainPages/Profile"
            label="My Pucas Applications"
            active={pathname?.startsWith("/MainPages/")}
          />
          <SidebarLink href="/colleges" label="My Universities" active={pathname === "/colleges"} />
        </nav>

        {/* NEW: My Common Application section (keeps your rail style) */}
        <div className="mt-4">
          <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            My Common Application
          </p>
          <nav className="space-y-1">
            {SECTIONS.map((s) => (
              <SectionLink
                key={s.key}
                href={s.href}
                label={s.label}
                filled={completed[s.key]}
                active={pathname === s.href}
              />
            ))}
          </nav>
        </div>

        <div className="mt-6">
          <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Explore</p>
          <nav className="space-y-1">
            <SidebarLink href="/search" label="University search" active={pathname === "/search"} />
          </nav>
        </div>

        <div className="mt-auto space-y-1">
          <SidebarLink href="/settings" label="Settings" active={pathname === "/settings"} />
          <SidebarLink href="/signout" label="Sign out" active={pathname === "/signout"} />
          <div
            className="mt-3 flex items-center gap-3 rounded-xl p-3 text-sm main-card"
            style={{ width: "100%", margin: 0 }}
          >
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

function SidebarLink({
  href = "#",
  label,
  active = false,
}: {
  href?: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link href={href} className={["sidebar-link", "hover-grey", active ? "active" : ""].join(" ")}>
      <span>{label}</span>
    </Link>
  );
}

/** Small row with a status dot, matches your rail styling */
function SectionLink({
  href,
  label,
  filled,
  active,
}: {
  href: string;
  label: string;
  filled?: boolean;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "sidebar-link",
        "hover-grey",
        "flex items-center justify-between",
        active ? "active" : "",
      ].join(" ")}
    >
      <span className="flex items-center gap-2">
        <span className={["sidebar-dot", filled ? "filled" : ""].join(" ")} />
        {label}
      </span>
      <span className="sidebar-chevron">›</span>
    </Link>
  );
}
