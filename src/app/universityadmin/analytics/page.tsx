"use client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3, PieChart as PieIcon, Calendar as CalendarIcon, ChevronDown,
  ArrowLeft, Download, Filter, Layers, MapPin, Users, BookOpen,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";

// =====================================================
// PCAS UNIVERSITY ANALYTICS (University-side, separate page)
// Route suggestion: /app/university/admin/analytics/page.tsx
// UI/UX upgraded for readability & brand consistency
// =====================================================

type ApplicationStatus = "Pending" | "Under review" | "Accepted" | "Rejected";

type AppRow = {
  id: string;
  student: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  city: string;
  region: "Punjab" | "Sindh" | "KPK" | "Balochistan" | "Gilgit-Baltistan" | "ICT" | "AJK";
  program: string;
  university: string;
  submittedAt: string; // ISO
  status: ApplicationStatus;
};

const CURRENT_UNI = "LUMS" as const;
const PROGRAMS = ["BS Computer Science","BBA","MS Data Science","MBA","BE Electrical","BS Economics"] as const;
const CITIES: Record<string, (typeof PROGRAMS)[number][]> = {
  Lahore: ["BS Computer Science","BBA","MS Data Science"],
  Karachi: ["MBA","BE Electrical","BS Economics"],
  Islamabad: ["BS Computer Science","MBA"],
  Peshawar: ["BBA","BS Economics"],
  Quetta: ["BE Electrical","MBA"],
  Multan: ["BBA","BS Economics"],
  Faisalabad: ["BS Computer Science","BBA"],
  Hyderabad: ["MBA","MS Data Science"],
  Gilgit: ["BS Economics"],
  Muzaffarabad: ["BBA"],
};
const CITY_REGION: Record<string, AppRow["region"]> = {
  Lahore: "Punjab", Faisalabad: "Punjab", Multan: "Punjab",
  Karachi: "Sindh", Hyderabad: "Sindh",
  Islamabad: "ICT", Gilgit: "Gilgit-Baltistan",
  Peshawar: "KPK", Quetta: "Balochistan", Muzaffarabad: "AJK",
};

const STATUSES: ApplicationStatus[] = ["Pending","Under review","Accepted","Rejected"];
const GENDERS = ["Male","Female","Other"] as const;

// Brand-adjacent palette (accessible contrast)
const PALETTE = [
  "#10b981", // emerald 500
  "#059669", // emerald 600
  "#34d399", // emerald 400
  "#60a5fa", // blue 400
  "#2563eb", // blue 600
  "#f59e0b", // amber 500
  "#fbbf24", // amber 400
  "#ef4444", // rose/red 500
  "#a78bfa", // violet 400
  "#14b8a6", // teal 500
];

// ---- Mock dataset (replace with server data) ----
function makeMock(): AppRow[] {
  const rows: AppRow[] = [];
  const cities = Object.keys(CITIES);
  for (let i = 0; i < 520; i++) {
    const city = cities[i % cities.length] as keyof typeof CITY_REGION;
    const program = PROGRAMS[i % PROGRAMS.length];
    const status = STATUSES[i % STATUSES.length];
    const gender = GENDERS[i % GENDERS.length];
    const age = 17 + (i % 14); // 17..30
    const day = (i % 27) + 1;
    const month = 9; // October (0-indexed date constructor)
    rows.push({
      id: `APP-${(3000 + i).toString()}`,
      student: ["Ayesha Khan","Ali Raza","Sara Ahmed","Bilal Hussain","Fatima Noor","Usman Tariq"][i % 6]!,
      age,
      gender: gender as any,
      city,
      region: CITY_REGION[city],
      program,
      university: CURRENT_UNI,
      submittedAt: new Date(2025, month, day, Math.floor(Math.random()*23), Math.floor(Math.random()*59)).toISOString(),
      status,
    });
  }
  return rows;
}

const cardBase = "bg-white border border-[rgba(14,169,113,.14)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]";
const lightRing = "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-0";
const cn = (...c: (string|false|undefined)[]) => c.filter(Boolean).join(" ");

export default function UniversityAnalyticsPage() {
  const [rows, setRows] = useState<AppRow[]>(makeMock());
  const [query, setQuery] = useState("");
  const [program, setProgram] = useState<string|"All">("All");
  const [status, setStatus] = useState<ApplicationStatus|"All">("All");
  const [region, setRegion] = useState<AppRow["region"]|"All">("All");
  const [gender, setGender] = useState<typeof GENDERS[number]|"All">("All");

  // Filtered dataset
  const data = useMemo(() => rows.filter(r =>
    r.university === CURRENT_UNI &&
    (program === "All" || r.program === program) &&
    (status === "All" || r.status === status) &&
    (region === "All" || r.region === region) &&
    (gender === "All" || r.gender === gender) &&
    (query.trim() === "" || r.student.toLowerCase().includes(query.toLowerCase()) || r.city.toLowerCase().includes(query.toLowerCase()))
  ), [rows, program, status, region, query, gender]);

  // ----------- Aggregations -----------
  const byRegion = useMemo(() => groupCount(data, r => r.region), [data]);
  const byCity = useMemo(() => topNWithOther(groupCount(data, r => r.city), 8), [data]);
  const byProgram = useMemo(() => groupCount(data, r => r.program), [data]);
  const byGender = useMemo(() => groupCount(data, r => r.gender), [data]);
  const byAgeBucket = useMemo(() => {
    const buckets: Record<string, number> = {};
    for (const r of data) {
      const b = bucketAge(r.age);
      buckets[b] = (buckets[b]||0)+1;
    }
    return dictToArr(buckets, "age");
  }, [data]);
  const byStatusRegion = useMemo(() => stackByKey(data, r=>r.region, r=>r.status), [data]);
  const timeline = useMemo(() => {
    const dayCounts: Record<string, number> = {};
    for (const r of data) {
      const d = new Date(r.submittedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      dayCounts[key] = (dayCounts[key]||0)+1;
    }
    const arr = Object.entries(dayCounts).map(([k,v])=>({ day: k, count: v }));
    return arr.sort((a,b) => new Date(a.day).getTime()-new Date(b.day).getTime());
  }, [data]);

  // CSV export of current filtered dataset
  function exportCSV() {
    const header = ["id","student","age","gender","city","region","program","status","submittedAt"].join(",");
    const lines = data.map(r => [r.id,r.student,r.age,r.gender,r.city,r.region,r.program,r.status,r.submittedAt].join(","));
    const csv = [header,...lines].join("");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `analytics-${CURRENT_UNI}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/universityadmin/dashboard" className={cn("outline-button h-10 px-3", lightRing)}><ArrowLeft className="size-4 mr-2"/>Applications</Link>
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--pakistan-green)] tracking-tight flex items-center gap-2">
          <BarChart3 className="size-6"/> Analytics – {CURRENT_UNI}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={exportCSV} className={cn("normal-button h-10 px-3", lightRing)}><Download className="size-4 mr-2"/>Export CSV</button>
        </div>
      </div>

      {/* Filters */}
      <section className={cn(cardBase, "p-4 mb-6")}> 
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-3">
          <div className="relative xl:col-span-2">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search student or city..." className={cn("w-full h-10 pl-3 pr-3 rounded-xl border border-slate-200", lightRing)} />
          </div>
          <Select label="Program" value={program} onChange={setProgram} options={["All",...PROGRAMS]} />
          <Select label="Status" value={status} onChange={setStatus} options={["All",...STATUSES]} />
          <Select label="Region" value={region} onChange={setRegion} options={["All","Punjab","Sindh","KPK","Balochistan","Gilgit-Baltistan","ICT","AJK"]} />
          <Select label="Gender" value={gender} onChange={setGender} options={["All",...GENDERS]} />
        </div>
      </section>

      {/* First row: region bars, city bars, gender pie */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard title="Applications by Region" subtitle="Which provinces/regions send the most applicants?" icon={<MapPin className="size-4"/>}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={toBarData(byRegion)} margin={{left: 0, right: 10, top: 10, bottom: 0}}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#334155" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#334155" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
              <Tooltip content={<NiceTooltip />} />
              <Bar dataKey="value">
                {toBarData(byRegion).map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Cities (incl. Other)" subtitle="Focus the top contributors and bundle the long tail" icon={<Layers className="size-4"/>}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={toBarData(byCity)} layout="vertical" margin={{left: 20, right: 10, top: 10, bottom: 0}}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#334155" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill: "#334155" }} tickLine={false} axisLine={{ stroke: "#cbd5e1" }} />
              <Tooltip content={<NiceTooltip />} />
              <Bar dataKey="value">
                {toBarData(byCity).map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Gender Split" subtitle="Overall distribution by gender" icon={<Users className="size-4"/>}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={toBarData(byGender)} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
                {toBarData(byGender).map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip content={<NiceTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#334155" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Second row: age, timeline, program distribution */}
      <section className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard title="Age Distribution" subtitle="Bucketed ages for readability" icon={<Users className="size-4"/>}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byAgeBucket} margin={{left: 0, right: 10, top: 10, bottom: 0}}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="age" tick={{ fontSize: 12, fill: "#334155" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#334155" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
              <Tooltip content={<NiceTooltip />} />
              <Bar dataKey="value">
                {byAgeBucket.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Applications Over Time" subtitle="Daily submissions (filtered)" icon={<CalendarIcon className="size-4"/>}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={timeline} margin={{left: 0, right: 10, top: 10, bottom: 0}}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#334155" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#334155" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
              <Tooltip content={<NiceTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#059669" fill="url(#grad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Program Mix" subtitle="Distribution of applications by program" icon={<BookOpen className="size-4"/>}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={toBarData(byProgram)} margin={{left: 0, right: 10, top: 10, bottom: 0}}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#334155" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#334155" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
              <Tooltip content={<NiceTooltip />} />
              <Bar dataKey="value">
                {toBarData(byProgram).map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Third row: stacked by region & status */}
      <section className="mt-4 grid grid-cols-1 gap-4">
        <ChartCard title="Funnel by Region (Status Stacked)" subtitle="Compare status mix across regions" icon={<BarChart3 className="size-4"/>}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={byStatusRegion} margin={{left: 0, right: 10, top: 10, bottom: 0}}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#334155" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#334155" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
              <Tooltip content={<NiceTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#334155" }} />
              <Bar dataKey="Pending" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Under review" stackId="a" fill="#60a5fa" />
              <Bar dataKey="Accepted" stackId="a" fill="#10b981" />
              <Bar dataKey="Rejected" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <p className="text-xs text-slate-500 mt-4">Note: All charts respond to the filters above (program, status, region, gender, search). Replace mock data with your API for production.</p>
    </div>
  );
}

// -------------------- Small UI helpers --------------------
function Select<T extends string>({ label, value, onChange, options }:{ label: string; value: T; onChange: (v:T)=>void; options: readonly T[] | T[] }) {
  return (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e)=>onChange(e.target.value as T)} className={cn("w-full h-10 px-3 rounded-xl border bg-white", "border-slate-200", lightRing)}>
          {options.map((o)=> <option key={String(o)} value={String(o)}>{String(o)}</option>)}
        </select>
        <ChevronDown className="size-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"/>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, icon, children }:{ title: string; subtitle?: string; icon?: any; children: any }) {
  return (
    <div className={cn(cardBase, "p-4")}> 
      <div className="flex items-center gap-2 text-[var(--pakistan-green)] font-semibold">{icon} {title}</div>
      {subtitle && <p className="text-xs text-slate-500 mb-2">{subtitle}</p>}
      <div className="h-[260px] w-full">{children}</div>
    </div>
  );
}

function NiceTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
      {label && <div className="font-semibold text-slate-800 mb-1">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-600">{p.name}:</span>
          <span className="font-semibold text-slate-900">{formatNumber(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// -------------------- Data utils --------------------
function formatNumber(n: number) { return new Intl.NumberFormat().format(n); }

function bucketAge(age: number) {
  if (age < 18) return "<18"; if (age <= 20) return "18–20"; if (age <= 22) return "21–22"; if (age <= 25) return "23–25"; if (age <= 30) return "26–30"; return ">30";
}

function groupCount<T>(arr: T[], key: (x: T) => string) {
  const map: Record<string, number> = {};
  for (const r of arr) { const k = key(r); map[k] = (map[k]||0)+1; }
  return map;
}

function stackByKey<T>(arr: T[], group: (x:T)=>string, series: (x:T)=>string) {
  const rows: Record<string, any> = {};
  for (const r of arr) {
    const g = group(r); const s = series(r);
    rows[g] = rows[g] || { name: g };
    rows[g][s] = (rows[g][s]||0) + 1;
  }
  return Object.values(rows);
}

function dictToArr(d: Record<string, number>, keyName = "name") {
  return Object.entries(d).map(([k,v]) => ({ [keyName]: k, value: v }));
}

function toBarData(d: Record<string, number>) { return dictToArr(d); }

function topN(d: Record<string, number>, n: number) {
  return Object.fromEntries(Object.entries(d).sort((a,b)=>b[1]-a[1]).slice(0,n));
}

function topNWithOther(d: Record<string, number>, n: number) {
  const entries = Object.entries(d).sort((a,b)=>b[1]-a[1]);
  const head = entries.slice(0, n);
  const tail = entries.slice(n);
  const other = tail.reduce((acc, [,v]) => acc+v, 0);
  const obj = Object.fromEntries(head);
  if (other > 0) obj["Other"] = other;
  return obj;
}
