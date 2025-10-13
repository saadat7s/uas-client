"use client";
import React from "react";
import Link from "next/link";
import {
  LayoutGrid,
  FileText,
  BarChart3,
  Settings as SettingsIcon,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { Button } from "../ui";
import { useUniversitySettings } from "@/app/redux/hooks/useUniversityAdmin";

type Crumb = { label: string; href?: string };

export const PageHeader: React.FC<{
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
}> = ({ title, description, breadcrumbs = [], actions }) => (
  <header className="mb-6">
    {breadcrumbs.length > 0 && (
      <nav className="text-sm text-slate-500 mb-2">
        {breadcrumbs.map((b, i) => (
          <span key={i}>
            {b.href ? (
              <Link className="hover:underline" href={b.href}>
                {b.label}
              </Link>
            ) : (
              <span>{b.label}</span>
            )}
            {i < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
          </span>
        ))}
      </nav>
    )}
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {description && <p className="text-slate-600 mt-1">{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  </header>
);

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // read the live logo + name from settings (updated by Settings page)
  const { settings: uni } = useUniversitySettings();

  return (
    <div className="min-h-screen app-shell-bg">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white z-40">
        <div className="w-full flex flex-col">
          {/* Brand header in sidebar */}
          <div className="h-14 flex items-center px-5 border-b border-slate-200">
            <Link href="/universityadmin/dashboard" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-slate-50 shadow-sm overflow-hidden flex items-center justify-center">
                {uni.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={uni.logo}
                    alt="University Logo"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <LayoutGrid className="w-5 h-5 text-[var(--pakistan-green-600)]" />
                )}
              </div>
              <div>
                <div className="text-sm font-semibold leading-tight">
                  {uni.name || "University Admin"}
                </div>
                <div className="text-[11px] text-slate-500 -mt-0.5">LUMS</div>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="p-3 space-y-1">
            <Link href="/universityadmin/dashboard" className="nav-link">
              <FileText className="w-4 h-4" />
              <span>Applications</span>
            </Link>
            <Link href="/universityadmin/analytics" className="nav-link">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </Link>
            <Link href="/universityadmin/settings" className="nav-link">
              <SettingsIcon className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Sidebar footer */}
          <div className="mt-auto p-4 text-xs text-slate-500">
            <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/60">
              Signed in as <span className="font-medium text-slate-700">Admin User</span>
              <div className="truncate text-slate-500">admin@lums.edu.pk</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:ml-64">
        {/* Top bar (fixed height to remove the gap) */}
        <div className="topbar-glass sticky top-0 z-30 border-b border-slate-200">
          <div className="h-14 px-4 lg:px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* (Optional) mobile menu trigger – you can wire a drawer later */}
              <Button className="lg:hidden" variant="outline" size="sm" aria-label="Open menu">
                <Menu className="w-4 h-4" />
              </Button>
              <span className="text-sm text-slate-500 hidden sm:inline-flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" />
                Use the sidebar to navigate
              </span>
            </div>

            {/* Tiny brand on the right (mobile hint) */}
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-white/70 border border-slate-200 overflow-hidden hidden sm:flex items-center justify-center">
                {uni.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={uni.logo} alt="Logo" className="h-full w-full object-contain" />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
