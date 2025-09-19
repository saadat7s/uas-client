"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/redux/hooks";
import { useAppDispatch } from "@/app/redux/hooks";
import { logoutUser } from "@/app/redux/features/auth";
import { useRouter } from "next/navigation";

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
  const { user, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();

  // derive completion from localStorage saves for each section
  const [completed, setCompleted] = useState<Record<SectionKey, boolean>>({
    profile: false,
    family: false,
    education: false,
    extracurricular: false,
  });

  useEffect(() => {
    const prof = getStored<{ values: Record<string, unknown> }>("pcas:application:profile", { values: {} }).values;
    const fam  = getStored<{ values: Record<string, unknown> }>("pcas:application:family", { values: {} }).values;
    const edu  = getStored<{ values: Record<string, unknown> }>("pcas:application:education", { values: {} }).values;
    const ext  = getStored<{ values: Record<string, unknown> }>("pcas:application:extracurricular", { values: {} }).values;

    setCompleted({
      profile:
        !!(prof?.firstName as string)?.trim() &&
        !!(prof?.lastName as string)?.trim() &&
        !!(prof?.address as string)?.trim() &&
        !!prof?.primaryLang &&
        !!prof?.citizen &&
        !!(prof?.cnic as string)?.trim() &&
        !!(prof?.gender as string)?.trim() &&
        !!prof?.dob &&
        !!(prof?.maritalStatus as string)?.trim() &&
        !!(prof?.phone as string)?.trim(),
      family:
        !!(fam?.fatherName as string)?.trim() && !!(fam?.motherName as string)?.trim() && !!fam?.fatherOccupation,
      education:
        !!(edu?.matricGrades as string)?.trim() && !!edu?.matricPicName &&
        !!(edu?.fscGrades as string)?.trim()   && !!edu?.fscPicName &&
        !!(edu?.collegeName as string)?.trim(),
      extracurricular: !!(ext?.clubs as string)?.trim(),
    });
  }, []);

  const deriveInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase() || "U";
  };

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
          <SidebarLink 
            label="Sign out" 
            onClick={async () => {
              try {
                await dispatch(logoutUser()).unwrap();
                router.push('/');
              } catch (error) {
                console.error('Logout failed:', error);
                router.push('/');
              }
            }}
          />
          {isAuthenticated && user && (
            <div
              className="mt-3 flex items-center gap-3 rounded-xl p-3 text-sm main-card"
              style={{ width: "100%", margin: 0 }}
            >
              <div className="grid h-9 w-9 place-items-center rounded-full" style={{ background: "var(--emerald)", color: "white" }}>
                {deriveInitials(user.fullName)}
              </div>
              <div>
                <div className="font-medium leading-tight">{user.fullName}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({
  href = "#",
  label,
  active = false,
  onClick,
}: {
  href?: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
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
