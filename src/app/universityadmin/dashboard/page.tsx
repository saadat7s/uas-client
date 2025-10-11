"use client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3, Settings, Search, ChevronDown, Calendar as CalendarIcon,
  CheckCircle2, Clock, Eye, User2, FileText, Loader2, X, Download, UploadCloud,
  Trash2, MoreVertical, BadgeCheck, AlertCircle, CheckCircle, XCircle, GraduationCap
} from "lucide-react";

/**
 * PCAS UNIVERSITY ADMIN DASHBOARD (University-side)
 * Route: /university/admin
 * - Applications list + filters
 * - Bulk Accept/Reject
 * - Drawer with AppDetail
 * - KPIs & simple analytics
 * - Sidebar with working links to Analytics/Settings pages
 */

// -----------------------------
// Types
// -----------------------------
export type ApplicationStatus = "Pending" | "Under review" | "Accepted" | "Rejected";
export type AppRow = {
  id: string;
  student: string;
  program: string;
  university: string;
  submittedAt: string; // ISO
  status: ApplicationStatus;
  score?: number;
};

// -----------------------------
// Demo Context + Mock Data
// -----------------------------
const CURRENT_UNI = "LUMS" as const;

const PROGRAMS = [
  "BS Computer Science",
  "BBA",
  "MS Data Science",
  "MBA",
  "BE Electrical",
  "BS Economics",
] as const;

const MOCK_APPS: AppRow[] = Array.from({ length: 124 }).map((_, i) => {
  const statuses: ApplicationStatus[] = ["Pending", "Under review", "Accepted", "Rejected"];
  const status = statuses[i % statuses.length];
  const day = (i % 27) + 1;
  const month = 9; // October (0-indexed in Date)
  const submittedAt = new Date(
    2025, month, day,
    Math.floor(Math.random() * 23),
    Math.floor(Math.random() * 59)
  ).toISOString();
  return {
    id: `APP-${(2000 + i).toString()}`,
    student: ["Ayesha Khan", "Ali Raza", "Sara Ahmed", "Bilal Hussain", "Fatima Noor", "Usman Tariq"][i % 6]!,
    program: PROGRAMS[i % PROGRAMS.length]!,
    university: CURRENT_UNI,
    submittedAt,
    status,
    score: Math.round(Math.random() * 100),
  };
});

// -----------------------------
// Helpers & tokens
// -----------------------------
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");
const cardBase = "bg-white border border-[rgba(14,169,113,.14)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]";
const lightRing = "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-0";

function formatShortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// -----------------------------
// Toast
// -----------------------------
function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 1800);
    return () => clearTimeout(t);
  }, [msg]);
  return { msg, push: (m: string) => setMsg(m) } as const;
}

function Toast({ message }: { message: string | null }) {
  return (
    <div className={cn("fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] transition", message ? "opacity-100" : "opacity-0 pointer-events-none")}>
      <div className="px-4 py-2 rounded-xl bg-[var(--pakistan-green)] text-white shadow-lg border border-[rgba(255,255,255,.15)]">
        {message}
      </div>
    </div>
  );
}

// -----------------------------
// Status Badge
// -----------------------------
function StatusBadge({ status }: { status: ApplicationStatus }) {
  const map: Record<ApplicationStatus, { color: string; Icon: any }> = {
    "Pending": { color: "bg-yellow-50 text-yellow-700 border-yellow-200", Icon: Clock },
    "Under review": { color: "bg-blue-50 text-blue-700 border-blue-200", Icon: Loader2 },
    "Accepted": { color: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: CheckCircle },
    "Rejected": { color: "bg-rose-50 text-rose-700 border-rose-200", Icon: XCircle },
  };
  const { color, Icon } = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-full", color)}>
      <Icon className="size-3.5" /> {status}
    </span>
  );
}

// -----------------------------
// Mini charts
// -----------------------------
function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(1, ...data);
  const points = data.map((v, i) => `${(i / Math.max(1, data.length - 1)) * 100},${100 - (v / max) * 100}`).join(" ");
  return (
    <svg className="w-28 h-12" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
      <polyline fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--pakistan-green-600)]/70" points={points.replace(/(\d+\.\d+),(\d+\.\d+)/g, (_, x, y) => `${x},${(Number(y) / 2).toFixed(2)}`)} />
    </svg>
  );
}

function SparklineBig({ series }: { series: number[] }) {
  const max = Math.max(1, ...series);
  const points = series.map((v, i) => `${(i / Math.max(1, series.length - 1)) * 100},${100 - (v / max) * 100}`).join(" ");
  return (
    <svg className="w-full h-28" viewBox="0 0 100 40" preserveAspectRatio="none" aria-label="trend line">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--pakistan-green-600)]/70" points={points.replace(/(\d+\.\d+),(\d+\.\d+)/g, (_, x, y) => `${x},${(Number(y) / 2).toFixed(2)}`)} />
    </svg>
  );
}

function Donut({ items }: { items: { label: string; value: number; color: string }[] }) {
  const total = items.reduce((a, b) => a + b.value, 0) || 1;
  let acc = 0;
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 48 48" className="w-28 h-28" aria-hidden>
      <circle cx="24" cy="24" r={radius} fill="none" stroke="#eef8f4" strokeWidth={10} />
      {items.map((s, idx) => {
        const ratio = s.value / total;
        const dash = ratio * circumference;
        const gap = circumference - dash;
        const dashoffset = (circumference * (acc / total)) + 0.0001;
        acc += s.value;
        return (
          <circle key={idx} cx="24" cy="24" r={radius} fill="none" stroke={s.color} strokeWidth={10} strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-dashoffset} strokeLinecap="round" />
        );
      })}
      <circle cx="24" cy="24" r={11} fill="#fff" />
    </svg>
  );
}

// -----------------------------
// Drawer
// -----------------------------
function Drawer({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: any; title: string }) {
  return (
    <div className={cn("fixed inset-0 z-50 transition", open ? "pointer-events-auto" : "pointer-events-none")}>
      <div onClick={onClose} className={cn("absolute inset-0 bg-black/20 transition-opacity", open ? "opacity-100" : "opacity-0")} />
      <aside className={cn("absolute right-0 top-0 h-full w-full max-w-[560px] bg-white border-l border-[rgba(14,169,113,.18)] shadow-2xl","transition-transform duration-300", open ? "translate-x-0" : "translate-x-full")} role="dialog" aria-modal="true" aria-label={title}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200/70">
          <h3 className="text-lg font-semibold text-[var(--pakistan-green)]">{title}</h3>
          <button onClick={onClose} className={cn("p-2 rounded-full border hover:bg-[var(--mint-100)]", lightRing)} aria-label="Close">
            <X className="size-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">{children}</div>
      </aside>
    </div>
  );
}

// -----------------------------
// Main Component
// -----------------------------
export default function UniversityAdminDashboard() {
  const toast = useToast();

  // State
  const [query, setQuery] = useState("");
  const [statusTab, setStatusTab] = useState<ApplicationStatus | "All">("All");
  const [programTab, setProgramTab] = useState<string | "All">("All");
  const [apps, setApps] = useState<AppRow[]>(MOCK_APPS);
  const [drawer, setDrawer] = useState<{ open: boolean; app?: AppRow }>({ open: false });
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Derived
  const filtered = useMemo(() => {
    return apps.filter((a) =>
      a.university === CURRENT_UNI &&
      (statusTab === "All" || a.status === statusTab) &&
      (programTab === "All" || a.program === programTab) &&
      (query.trim() === "" ||
        a.id.toLowerCase().includes(query.toLowerCase()) ||
        a.student.toLowerCase().includes(query.toLowerCase()) ||
        a.program.toLowerCase().includes(query.toLowerCase()))
    );
  }, [apps, statusTab, programTab, query]);

  const counts = useMemo(() => {
    const base = { total: 0, Pending: 0, "Under review": 0, Accepted: 0, Rejected: 0 } as Record<string, number>;
    for (const a of apps) if (a.university === CURRENT_UNI) { base.total++; base[a.status]++; }
    return base;
  }, [apps]);

  const programsAtUni = useMemo(() => {
    const set = new Set<string>();
    apps.filter(a => a.university === CURRENT_UNI).forEach(a => set.add(a.program));
    return ["All", ...Array.from(set)];
  }, [apps]);

  // Bulk update
  function bulkSetStatus(next: ApplicationStatus) {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    // optimistic update
    setApps((prev) => prev.map((a) => (ids.includes(a.id) ? { ...a, status: next } : a)));
    setSelected(new Set());
    toast.push(`Updated ${ids.length} application${ids.length>1?"s":""} → ${next}`);
  }

  // Single update
  function updateStatus(id: string, next: ApplicationStatus) {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: next } : a)));
    toast.push(`Status updated → ${next}`);
  }

  function openDrawer(app: AppRow) {
    setDrawer({ open: true, app });
  }

  return (
    <div className="min-h-screen flex bg-transparent">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[260px] flex-col gap-2 p-3">
        <div className={cn(cardBase, "p-4 flex items-center gap-3")}>
          <div className="size-10 rounded-xl bg-[var(--mint-100)] border border-[var(--pakistan-green-600)] grid place-items-center">
            <GraduationCap className="size-5 text-[var(--pakistan-green-600)]"/>
          </div>
          <div>
            <div className="text-xs text-slate-500">University Admin</div>
            <div className="text-[var(--pakistan-green)] font-semibold leading-tight">{CURRENT_UNI}</div>
          </div>
        </div>

        {/* Working links */}
        <nav className={cn(cardBase, "p-2 divide-y divide-slate-100 border-[rgba(14,169,113,.14)]")} aria-label="Admin Nav">
          <NavLink icon={FileText} label="Applications" href="/universityadmin/dashboard" />
          <NavLink icon={BarChart3} label="Analytics" href="/universityadmin/analytics" />
          <NavLink icon={Settings} label="Settings" href="/universityadmin/settings" />
        </nav>
        <div className="mt-auto" />
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[var(--pakistan-green)] tracking-tight">Application Tracking – {CURRENT_UNI}</h1>
            <p className="text-slate-600">Review and manage applications to your programs. Update statuses and monitor funnel health.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className={cn("outline-button h-10 px-3", lightRing)}><UploadCloud className="mr-2 size-4"/>Import CSV</button>
            <button className={cn("normal-button h-10 px-3", lightRing)}><Download className="mr-2 size-4"/>Export</button>
          </div>
        </header>

        {/* Filters Row */}
        <div className={cn(cardBase, "p-3 md:p-4 mb-6")}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by ID, student, or program" className={cn("w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200", lightRing)} />
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block">Program</label>
              <div className="flex flex-wrap gap-1.5">
                {programsAtUni.map((p) => (
                  <Chip key={p} label={p} active={p === programTab} onClick={() => setProgramTab(p)} />
                ))}
              </div>
            </div>

            <div className="flex items-end gap-2">
              <button className={cn("w-full h-10 px-3 rounded-xl border bg-white flex items-center justify-between", lightRing)}>
                <div className="flex items-center gap-2 text-slate-700"><CalendarIcon className="size-4"/> Last 30 days</div>
                <ChevronDown className="size-4"/>
              </button>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <KpiCard label="Total applications" value={counts.total} delta={6} series={[4,7,8,9,12,8,6,9,13,12,14,11,10,9]} />
          <KpiCard label="Pending" value={counts["Pending"]} delta={-4} series={[2,1,2,3,2,3,1,2,2,3,2,2,1,2]} />
          <KpiCard label="Under review" value={counts["Under review"]} delta={9} series={[1,2,3,4,4,5,6,5,6,6,7,6,7,7]} />
          <KpiCard label="Accepted" value={counts["Accepted"]} delta={3} series={[0,1,1,1,2,2,2,3,3,3,4,4,4,5]} />
          <KpiCard label="Rejected" value={counts["Rejected"]} delta={0} series={[1,1,1,1,1,1,1,1,1,1,1,1,1,1]} />
        </div>

        {/* Status Tabs + Bulk */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {(["All", "Pending", "Under review", "Accepted", "Rejected"] as const).map((t) => (
            <button key={t} onClick={() => setStatusTab(t as any)} className={cn("px-3 h-9 rounded-full border text-sm font-semibold",
              statusTab === t ? "bg-[var(--mint-100)] border-[var(--pakistan-green-600)] text-[var(--pakistan-green-600)]" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            )}>{t} {t === "All" ? `(${counts.total})` : ""}</button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => bulkSetStatus("Accepted")} className={cn("outline-button h-9 px-3", lightRing)}><BadgeCheck className="size-4 mr-1"/>Bulk accept</button>
            <button onClick={() => bulkSetStatus("Rejected")} className={cn("outline-button h-9 px-3", lightRing)}><Trash2 className="size-4 mr-1"/>Bulk reject</button>
          </div>
        </div>

        {/* Table */}
        <div className={cn(cardBase, "overflow-hidden")}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[var(--mint-100)] text-slate-700">
                <tr className="text-left">
                  <th className="px-3 py-3 w-10">
                    <input
                      aria-label="Select all"
                      type="checkbox"
                      checked={selected.size > 0 && filtered.every((r) => selected.has(r.id))}
                      onChange={(e) => {
                        if (e.target.checked) setSelected(new Set(filtered.map((r) => r.id)));
                        else setSelected(new Set());
                      }}
                    />
                  </th>
                  <th className="px-3 py-3">Application</th>
                  <th className="px-3 py-3">Student</th>
                  <th className="px-3 py-3">Program</th>
                  <th className="px-3 py-3">Submitted</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={row.id} className={cn(i % 2 ? "bg-white" : "bg-white/60", "border-t border-slate-100 hover:bg-[var(--mint-100)]/60 transition")}>
                    <td className="px-3 py-3 align-middle">
                      <input aria-label={`Select ${row.id}`} type="checkbox" checked={selected.has(row.id)} onChange={(e) => {
                        const next = new Set(selected);
                        if (e.target.checked) next.add(row.id); else next.delete(row.id);
                        setSelected(next);
                      }} />
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <button className={cn("text-[var(--pakistan-green-600)] font-semibold hover:underline", lightRing)} onClick={() => openDrawer(row)}>
                        {row.id}
                      </button>
                    </td>
                    <td className="px-3 py-3 align-middle"><div className="flex items-center gap-2"><User2 className="size-4 text-slate-500"/>{row.student}</div></td>
                    <td className="px-3 py-3 align-middle">{row.program}</td>
                    <td className="px-3 py-3 align-middle">{formatShortDate(row.submittedAt)}</td>
                    <td className="px-3 py-3 align-middle"><StatusBadge status={row.status} /></td>
                    <td className="px-3 py-3 align-middle text-right">
                      <div className="inline-flex items-center gap-1">
                        <button className={cn("outline-button h-8 px-2", lightRing)} onClick={() => openDrawer(row)}><Eye className="size-4 mr-1"/>View</button>
                        <button className={cn("outline-button h-8 px-2", lightRing)} onClick={() => updateStatus(row.id, nextStatus(row.status))}><CheckCircle2 className="size-4 mr-1"/>Advance</button>
                        <button className={cn("outline-button h-8 px-2", lightRing)}><MoreVertical className="size-4"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-500">
                      <AlertCircle className="inline size-5 mr-1 -mt-1"/> No applications match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Section */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className={cn(cardBase, "p-4")}>
            <h3 className="font-semibold text-[var(--pakistan-green)] mb-3">Status distribution</h3>
            <div className="flex items-center gap-6">
              <Donut items={[
                { label: "Pending", value: counts["Pending"], color: "#facc15" },
                { label: "Under review", value: counts["Under review"], color: "#60a5fa" },
                { label: "Accepted", value: counts["Accepted"], color: "#10b981" },
                { label: "Rejected", value: counts["Rejected"], color: "#fb7185" },
              ]} />
              <ul className="text-sm space-y-2">
                <Legend color="#facc15" label="Pending" value={counts["Pending"]} />
                <Legend color="#60a5fa" label="Under review" value={counts["Under review"]} />
                <Legend color="#10b981" label="Accepted" value={counts["Accepted"]} />
                <Legend color="#fb7185" label="Rejected" value={counts["Rejected"]} />
              </ul>
            </div>
          </div>

          <div className={cn(cardBase, "p-4")}>
            <h3 className="font-semibold text-[var(--pakistan-green)] mb-3">Daily applications</h3>
            <SparklineBig series={[4,7,8,9,12,8,6,9,13,12,14,11,10,9]} />
          </div>

          <div className={cn(cardBase, "p-4")}>
            <h3 className="font-semibold text-[var(--pakistan-green)] mb-3">Acceptance rate (rolling)</h3>
            <SparklineBig series={[3,4,5,6,7,8,7,8,9,10,9,10,11,11]} />
          </div>
        </section>

        {/* Funnel by program */}
        <section className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {PROGRAMS.map((p) => (
            <ProgramFunnel key={p} title={p} rows={apps.filter(a => a.university===CURRENT_UNI && a.program===p)} />
          ))}
        </section>

        <p className="text-xs text-slate-500 mt-4">Tip: Click an Application ID to open the detail panel and update status. University context is fixed to {CURRENT_UNI} for this route.</p>
      </main>

      {/* Drawer Content */}
      <Drawer open={drawer.open} onClose={() => setDrawer({ open: false })} title={drawer.app ? drawer.app.id : "Application"}>
        {drawer.app && (
          <AppDetail app={drawer.app} onStatus={(s) => updateStatus(drawer.app!.id, s)} />
        )}
      </Drawer>

      <Toast message={toast.msg} />
    </div>
  );
}

// -----------------------------
// Sub-components
// -----------------------------
function NavLink({ icon: Icon, label, href }: { icon: any; label: string; href: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition",
        active ? "bg-[var(--mint-100)] text-[var(--pakistan-green-600)]" : "text-slate-700 hover:bg-slate-50"
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="size-4" /> {label}
    </Link>
  );
}

function Chip({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={cn("px-2.5 h-8 rounded-full border text-xs font-semibold",
      active ? "bg-[var(--mint-100)] border-[var(--pakistan-green-600)] text-[var(--pakistan-green-600)]" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
    )}>{label}</button>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <li className="flex items-center gap-2">
      <span className="inline-block size-3 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
      <span className="ml-auto font-semibold">{value}</span>
    </li>
  );
}

function KpiCard({ label, value, delta, series }: { label: string; value: number | string; delta?: number; series?: number[] }) {
  return (
    <div className={cn(cardBase, "p-4")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-slate-500">{label}</div>
          <div className="text-2xl font-semibold text-[var(--pakistan-green)] mt-1">{value}</div>
          {typeof delta === "number" && (
            <div className={cn("text-xs mt-1 font-medium", delta >= 0 ? "text-emerald-600" : "text-rose-600")}>
              {delta >= 0 ? "+" : ""}{delta}% vs last 7d
            </div>
          )}
        </div>
        <Sparkline data={series ?? []} />
      </div>
    </div>
  );
}

function ProgramFunnel({ title, rows }: { title: string; rows: AppRow[] }) {
  const counts = rows.reduce((acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {} as Record<ApplicationStatus, number>);
  const total = rows.length || 1;
  const pct = (n: number) => Math.round(((n || 0) / total) * 100);
  return (
    <div className={cn(cardBase, "p-4")}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-[var(--pakistan-green)]">{title}</h4>
          <p className="text-xs text-slate-500">{rows.length} applications</p>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {["Pending","Under review","Accepted","Rejected"].map((k) => (
          <div key={k}>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>{k}</span>
              <span>{counts[k as ApplicationStatus] || 0} · {pct(counts[k as ApplicationStatus] || 0)}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={cn("h-full",
                k === "Accepted" ? "bg-emerald-500" :
                k === "Under review" ? "bg-blue-500" :
                k === "Pending" ? "bg-yellow-400" : "bg-rose-500"
              )} style={{ width: `${pct(counts[k as ApplicationStatus] || 0)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppDetail({ app, onStatus }: { app: AppRow; onStatus: (s: ApplicationStatus) => void }) {
  return (
    <div className="space-y-4">
      <section className={cn(cardBase, "p-4")}>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Row label="Application ID" value={app.id} />
          <Row label="University" value={app.university} />
          <Row label="Program" value={app.program} />
          <Row label="Submitted" value={formatShortDate(app.submittedAt)} />
          <Row label="Student" value={app.student} />
          <Row label="Status" value={<StatusBadge status={app.status} />} />
        </div>
      </section>

      <section className={cn(cardBase, "p-4")}>
        <h4 className="font-semibold text-[var(--pakistan-green)] mb-2">Update application status</h4>
        <div className="flex flex-wrap gap-2">
          {(["Pending","Under review","Accepted","Rejected"] as const).map(s => (
            <button key={s} onClick={() => onStatus(s)} className={cn("outline-button h-9 px-3", lightRing)}>{s}</button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">This updates the status in system for this application.</p>
      </section>

      <section className={cn(cardBase, "p-4")}>
        <h4 className="font-semibold text-[var(--pakistan-green)] mb-2">Documents</h4>
        <ul className="text-sm list-disc list-inside text-slate-600">
          <li>Personal Statement.pdf</li>
          <li>High School Transcript.pdf</li>
          <li>CNIC / Passport.pdf</li>
        </ul>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-medium text-slate-800">{value}</div>
    </div>
  );
}

function nextStatus(s: ApplicationStatus): ApplicationStatus {
  if (s === "Pending") return "Under review";
  if (s === "Under review") return "Accepted";
  if (s === "Accepted") return "Accepted";
  return "Rejected";
}
