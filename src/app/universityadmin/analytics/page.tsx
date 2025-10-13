"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AdminLayout, PageHeader } from "@/components/university-admin/layout/AdminLayout";
import {
  AnalyticsFilters,
  AnalyticsExport,
  ApplicationsByRegionChart,
  ApplicationsByProgramChart,
  StatusDistributionChart,
  ApplicationsOverTimeChart,
  GenderDistributionChart,
} from "@/components/university-admin/analytics/AnalyticsCharts";
import { Button, LoadingSpinner } from "@/components/university-admin/ui";
import { useAnalytics, useApplications } from "@/app/redux/hooks/useUniversityAdmin";
import { Application, ApplicationStatus } from "@/app/redux/features/universityAdmin";
import { ArrowLeft, Download, BarChart3 } from "lucide-react";

/* ----------------------------------------
   Mock data
----------------------------------------- */
const generateMockApplications = (): Application[] => {
  const programs = [
    "BS Computer Science",
    "BBA",
    "MS Data Science",
    "MBA",
    "BE Electrical",
    "BS Economics",
  ];
  const statuses: ApplicationStatus[] = ["Pending", "Under review", "Accepted", "Rejected"];
  const students = ["Ayesha Khan", "Ali Raza", "Sara Ahmed", "Bilal Hussain", "Fatima Noor", "Usman Tariq"];
  const cities = [
    "Lahore",
    "Karachi",
    "Islamabad",
    "Peshawar",
    "Quetta",
    "Multan",
    "Faisalabad",
    "Hyderabad",
    "Gilgit",
    "Muzaffarabad",
  ];
  const regions: NonNullable<Application["region"]>[] = [
    "Punjab",
    "Sindh",
    "KPK",
    "Balochistan",
    "Gilgit-Baltistan",
    "ICT",
    "AJK",
  ];
  const genders: NonNullable<Application["gender"]>[] = ["Male", "Female", "Other"];

  return Array.from({ length: 520 }, (_, i) => ({
    id: `APP-${3000 + i}`,
    student: students[i % students.length],
    age: 17 + (i % 14),
    gender: genders[i % genders.length],
    city: cities[i % cities.length],
    region: regions[i % regions.length],
    program: programs[i % programs.length],
    university: "LUMS",
    submittedAt: new Date(
      2025,
      9,
      (i % 27) + 1,
      Math.floor(Math.random() * 23),
      Math.floor(Math.random() * 59)
    ).toISOString(),
    status: statuses[i % statuses.length],
    score: Math.round(Math.random() * 100),
    documents: ["Personal Statement.pdf", "High School Transcript.pdf", "CNIC.pdf"],
  }));
};

/* ----------------------------------------
   Page
----------------------------------------- */
export default function UniversityAnalyticsPage() {
  const { filters, setFilters } = useAnalytics();
  const { applications, setApplications } = useApplications();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize mock data
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => {
      setApplications(generateMockApplications());
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(t);
  }, [setApplications]);

  // Filter applications (typed)
  const filteredApplications: Application[] = useMemo(() => {
    return applications.filter((app: Application) => {
      const matchesProgram = filters.program === "All" || app.program === filters.program;
      const matchesStatus = filters.status === "All" || app.status === filters.status;
      const matchesRegion = filters.region === "All" || app.region === filters.region;
      const matchesGender = filters.gender === "All" || app.gender === filters.gender;

      const q = filters.searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        app.student.toLowerCase().includes(q) ||
        (app.city ?? "").toLowerCase().includes(q) ||
        app.program.toLowerCase().includes(q);

      const appDate = new Date(app.submittedAt);
      const days = Number(filters.dateRange);
      const matchesDateRange = Number.isFinite(days)
        ? appDate >= new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        : true;

      return (
        matchesProgram &&
        matchesStatus &&
        matchesRegion &&
        matchesGender &&
        matchesSearch &&
        matchesDateRange
      );
    });
  }, [applications, filters]);

  // Unique programs for filter dropdown
  const programs = useMemo<string[]>(
    () => Array.from(new Set(applications.map((app: Application) => app.program))),
    [applications]
  );

  // Export CSV
  const handleExport = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      const header: string[] = ["ID", "Student", "Program", "Status", "Region", "Gender", "Submitted At"];
      const rows: string[][] = filteredApplications.map((app: Application) => [
        String(app.id),
        String(app.student),
        String(app.program),
        String(app.status),
        String(app.region ?? ""),
        String(app.gender ?? ""),
        String(app.submittedAt),
      ]);

      const csv: string = [header, ...rows]
        .map((r: string[]) =>
          r
            .map((cell: string) => (/[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell))
            .join(",")
        )
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, 600);
  };

  if (isLoading && applications.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  // Derived stats
  const acceptanceRate: number =
    filteredApplications.length > 0
      ? Math.round(
          (filteredApplications.filter((a: Application) => a.status === "Accepted").length /
            filteredApplications.length) *
            100
        )
      : 0;

  const pendingReviewCount: number = filteredApplications.filter(
    (a: Application) => a.status === "Pending" || a.status === "Under review"
  ).length;

  const topProgramLabel: string = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredApplications.forEach((a: Application) => {
      counts[a.program] = (counts[a.program] ?? 0) + 1;
    });
    const entries = Object.entries(counts) as [string, number][];
    entries.sort(([, av], [, bv]) => bv - av);
    return entries[0]?.[0] ?? "N/A";
  }, [filteredApplications]);

  return (
    <AdminLayout>
      <PageHeader
        title="Analytics Dashboard"
        description="Comprehensive insights into application trends and patterns"
        breadcrumbs={[
          { label: "Dashboard", href: "/universityadmin/dashboard" },
          { label: "Analytics" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/universityadmin/dashboard">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Button onClick={handleExport} loading={isLoading}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <AnalyticsFilters filters={filters} onFiltersChange={setFilters} programs={programs} />

      {/* One-click export chip/bar */}
      <AnalyticsExport onExport={handleExport} isLoading={isLoading} />

      {/* Charts */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ApplicationsByRegionChart applications={filteredApplications} />
          <ApplicationsByProgramChart applications={filteredApplications} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <StatusDistributionChart applications={filteredApplications} />
          <GenderDistributionChart applications={filteredApplications} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ApplicationsOverTimeChart applications={filteredApplications} />
        </div>
      </div>

      {/* Summary cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Applications</p>
              <p className="text-2xl font-semibold text-slate-900">{filteredApplications.length}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-slate-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Acceptance Rate</p>
              <p className="text-2xl font-semibold text-slate-900">{acceptanceRate}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending Review</p>
              <p className="text-2xl font-semibold text-slate-900">{pendingReviewCount}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Top Program</p>
              <p className="text-lg font-semibold text-slate-900">{topProgramLabel}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Dynamic Insights (typed) */}
      <div className="mt-8 bg-white p-6 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Insights</h3>
        {(() => {
          const startOf = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());
          const now = new Date();
          const today = startOf(now);
          const dayMs = 24 * 60 * 60 * 1000;

          const inLast = (days: number): Application[] =>
            filteredApplications.filter((a: Application) =>
              new Date(a.submittedAt) >= new Date(today.getTime() - days * dayMs)
            );

          const between = (fromDays: number, toDays: number): Application[] => {
            const from = new Date(today.getTime() - fromDays * dayMs);
            const to = new Date(today.getTime() - toDays * dayMs);
            return filteredApplications.filter((a: Application) => {
              const t = new Date(a.submittedAt);
              return t >= to && t < from;
            });
          };

          // totals
          const last30 = inLast(30).length;
          const prev30 = between(60, 30).length;
          const mom: number | null = prev30 ? Math.round(((last30 - prev30) / prev30) * 100) : null;

          // peak hour
          const byHour: number[] = Array.from({ length: 24 }, () => 0);
          filteredApplications.forEach((a: Application) => {
            const h = new Date(a.submittedAt).getHours();
            byHour[h] += 1;
          });
          const peakHour = byHour.indexOf(Math.max(...byHour));
          const hourLabel =
            peakHour === -1 ? "—" : `${((peakHour + 11) % 12) + 1} ${peakHour < 12 ? "AM" : "PM"}`;

          // top weekdays
          const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
          const byDay: Record<string, number> = {};
          filteredApplications.forEach((a: Application) => {
            const d = new Date(a.submittedAt).getDay();
            const n = names[d];
            byDay[n] = (byDay[n] || 0) + 1;
          });
          const topDays =
            Object.entries(byDay)
              .sort(([, av], [, bv]) => bv - av)
              .slice(0, 2)
              .map(([k]) => k)
              .join(" & ") || "—";

          // top region share
          const byRegion: Record<string, number> = {};
          filteredApplications.forEach((a: Application) => {
            const r = a.region ?? "Unknown";
            byRegion[r] = (byRegion[r] || 0) + 1;
          });
          const total = filteredApplications.length;
          const [topRegion, topRegionCount] =
            (Object.entries(byRegion).sort(([, av], [, bv]) => bv - av)[0] ?? ["—", 0]) as [string, number];
          const topRegionShare = total ? Math.round((topRegionCount / total) * 100) : 0;

          // acceptance rate + delta
          const acceptedNow = filteredApplications.filter((x: Application) => x.status === "Accepted").length;
          const rateNow = total ? Math.round((acceptedNow / total) * 100) : 0;
          const prevWindow: Application[] = between(60, 30);
          const prevAcc = prevWindow.filter((x: Application) => x.status === "Accepted").length;
          const ratePrev: number | null = prevWindow.length
            ? Math.round((prevAcc / prevWindow.length) * 100)
            : null;
          const rateDelta: number | null = ratePrev == null ? null : rateNow - ratePrev;

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-sm text-slate-600 mb-1">Applications (last 30 days)</div>
                <div className="text-2xl font-semibold text-slate-900">{last30}</div>
                <div className="text-xs mt-1">
                  {mom == null ? (
                    <span className="text-slate-500">No prior window for comparison</span>
                  ) : mom >= 0 ? (
                    <span className="text-emerald-600">▲ {mom}% MoM</span>
                  ) : (
                    <span className="text-rose-600">▼ {Math.abs(mom)}% MoM</span>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-sm text-slate-600 mb-1">Peak submission time</div>
                <div className="text-2xl font-semibold text-slate-900">{hourLabel}</div>
                <div className="text-xs text-slate-500 mt-1">Top weekdays: {topDays}</div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-sm text-slate-600 mb-1">Top region</div>
                <div className="text-2xl font-semibold text-slate-900">{topRegion}</div>
                <div className="text-xs text-slate-500 mt-1">{topRegionShare}% of filtered applications</div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-sm text-slate-600 mb-1">Acceptance rate</div>
                <div className="text-2xl font-semibold text-slate-900">{rateNow}%</div>
                <div className="text-xs mt-1">
                  {rateDelta == null ? (
                    <span className="text-slate-500">No prior window for comparison</span>
                  ) : rateDelta >= 0 ? (
                    <span className="text-emerald-600">▲ {rateDelta} pts vs. prior 30 days</span>
                  ) : (
                    <span className="text-rose-600">▼ {Math.abs(rateDelta)} pts vs. prior 30 days</span>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <div className="mt-4 text-xs text-slate-500">
        Note: All charts respond to the filters above. Data updates automatically.
      </div>
    </AdminLayout>
  );
}
