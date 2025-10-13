"use client";
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import {
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
  MapPin,
  GraduationCap,
  Download,
  Filter,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Select,
  Input,
  EmptyState,
} from "../ui";
import { Application, ApplicationStatus } from "@/app/redux/features/universityAdmin";
// 👇 import the SAME filters type your hook returns
import type { AnalyticsFilters as AnalyticsFilterState } from "@/app/redux/features/universityAdmin";

/* ----------------------------------------
   Types
----------------------------------------- */

interface AnalyticsFiltersProps {
  filters: AnalyticsFilterState;
  onFiltersChange: (filters: Partial<AnalyticsFilterState>) => void;
  programs: string[];
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

interface CustomTooltipPayloadItem {
  name: string;
  value: number | string;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayloadItem[];
  label?: string;
}

interface ApplicationsChartProps {
  applications: Application[];
}

/* ----------------------------------------
   Filters
----------------------------------------- */

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
  onFiltersChange,
  programs,
}) => {
  const statusOptions = [
    { value: "All", label: "All Status" },
    { value: "Pending", label: "Pending" },
    { value: "Under review", label: "Under Review" },
    { value: "Accepted", label: "Accepted" },
    { value: "Rejected", label: "Rejected" },
  ];

  const regionOptions = [
    { value: "All", label: "All Regions" },
    { value: "Punjab", label: "Punjab" },
    { value: "Sindh", label: "Sindh" },
    { value: "KPK", label: "KPK" },
    { value: "Balochistan", label: "Balochistan" },
    { value: "Gilgit-Baltistan", label: "Gilgit-Baltistan" },
    { value: "ICT", label: "ICT" },
    { value: "AJK", label: "AJK" },
  ];

  const genderOptions = [
    { value: "All", label: "All Genders" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const dateRangeOptions = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 90 days" },
    { value: "365", label: "Last year" },
  ];

  const programOptions = [
    { value: "All", label: "All Programs" },
    ...programs.map((program) => ({ value: program, label: program })),
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          <span className="inline-flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Analytics Filters
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Input
            placeholder="Search..."
            value={filters.searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onFiltersChange({ searchQuery: e.target.value })
            }
          />

          <Select
            value={filters.program}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onFiltersChange({ program: e.target.value as AnalyticsFilterState["program"] })
            }
            options={programOptions}
          />

          <Select
            value={filters.status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onFiltersChange({ status: e.target.value as ApplicationStatus | "All" })
            }
            options={statusOptions}
          />

          <Select
            value={filters.region}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onFiltersChange({ region: e.target.value as AnalyticsFilterState["region"] })
            }
            options={regionOptions}
          />

          <Select
            value={filters.gender}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onFiltersChange({ gender: e.target.value as AnalyticsFilterState["gender"] })
            }
            options={genderOptions}
          />

          <Select
            value={filters.dateRange}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onFiltersChange({ dateRange: e.target.value as AnalyticsFilterState["dateRange"] })
            }
            options={dateRangeOptions}
          />
        </div>
      </CardContent>
    </Card>
  );
};

/* ----------------------------------------
   Chart Card
----------------------------------------- */

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  icon,
  children,
  className = "",
}) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle>
        <span className="inline-flex items-center gap-2">
          {icon}
          {title}
        </span>
      </CardTitle>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </CardHeader>
    <CardContent>
      <div className="h-64 w-full">{children}</div>
    </CardContent>
  </Card>
);

/* ----------------------------------------
   Tooltip (typed)
----------------------------------------- */

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="font-semibold text-slate-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color || "#94a3b8" }}
            />
            <span className="text-slate-600">{entry.name}:</span>
            <span className="font-semibold text-slate-900">
              {typeof entry.value === "number"
                ? entry.value.toLocaleString()
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/* ----------------------------------------
   Charts
----------------------------------------- */

export const ApplicationsByRegionChart: React.FC<ApplicationsChartProps> = ({ applications }) => {
  const data = useMemo(() => {
    const regionCounts = applications.reduce(
      (acc: Record<string, number>, app: Application) => {
        const region = app.region || "Unknown";
        acc[region] = (acc[region] || 0) + 1;
        return acc;
      },
      {}
    );

    return Object.entries(regionCounts).map(([region, count]) => ({
      region,
      applications: count,
    }));
  }, [applications]);

  const COLORS = ["#10b981", "#059669", "#34d399", "#60a5fa", "#2563eb", "#f59e0b", "#fbbf24", "#ef4444"];

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<MapPin className="w-12 h-12" />}
        title="No data available"
        description="No applications found for the selected filters."
      />
    );
  }

  return (
    <ChartCard
      title="Applications by Region"
      subtitle="Distribution of applications across different regions"
      icon={<MapPin className="w-5 h-5" />}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="region" tick={{ fontSize: 12, fill: "#334155" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#334155" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="applications" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export const ApplicationsByProgramChart: React.FC<ApplicationsChartProps> = ({ applications }) => {
  const data = useMemo(() => {
    const programCounts = applications.reduce(
      (acc: Record<string, number>, app: Application) => {
        acc[app.program] = (acc[app.program] || 0) + 1;
        return acc;
      },
      {}
    );

    return Object.entries(programCounts).map(([program, applications]) => ({
      program,
      applications,
    }));
  }, [applications]);

  const COLORS = ["#10b981", "#059669", "#34d399", "#60a5fa", "#2563eb", "#f59e0b", "#fbbf24", "#ef4444"];

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<GraduationCap className="w-12 h-12" />}
        title="No data available"
        description="No applications found for the selected filters."
      />
    );
  }

  return (
    <ChartCard
      title="Applications by Program"
      subtitle="Distribution of applications across different programs"
      icon={<GraduationCap className="w-5 h-5" />}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="program"
            tick={{ fontSize: 12, fill: "#334155" }}
            axisLine={{ stroke: "#cbd5e1" }}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12, fill: "#334155" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="applications" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export const StatusDistributionChart: React.FC<ApplicationsChartProps> = ({ applications }) => {
  const data = useMemo(() => {
    const statusCounts = applications.reduce(
      (acc: Record<string, number>, app: Application) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      {}
    );

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));
  }, [applications]);

  const COLORS: Record<ApplicationStatus | "Under review" | "Pending" | "Rejected" | "Accepted", string> = {
    Pending: "#f59e0b",
    "Under review": "#60a5fa",
    Accepted: "#10b981",
    Rejected: "#ef4444",
  };

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<PieChartIcon className="w-12 h-12" />}
        title="No data available"
        description="No applications found for the selected filters."
      />
    );
  }

  return (
    <ChartCard
      title="Status Distribution"
      subtitle="Current status of all applications"
      icon={<PieChartIcon className="w-5 h-5" />}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            label={({ status, count }) => `${status}: ${count}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[(entry.status as keyof typeof COLORS)] || "#6b7280"} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export const ApplicationsOverTimeChart: React.FC<ApplicationsChartProps> = ({ applications }) => {
  const data = useMemo(() => {
    const dayCounts = applications.reduce(
      (acc: Record<string, number>, app: Application) => {
        const date = new Date(app.submittedAt);
        const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
          date.getDate()
        ).padStart(2, "0")}`;
        acc[dayKey] = (acc[dayKey] || 0) + 1;
        return acc;
      },
      {}
    );

    return Object.entries(dayCounts)
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
  }, [applications]);

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<TrendingUp className="w-12 h-12" />}
        title="No data available"
        description="No applications found for the selected filters."
      />
    );
  }

  return (
    <ChartCard title="Applications Over Time" subtitle="Daily application submissions" icon={<TrendingUp className="w-5 h-5" />}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="appsAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#334155" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#334155" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="count" stroke="#059669" fill="url(#appsAreaGradient)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  </ChartCard>
  );
};

export const GenderDistributionChart: React.FC<ApplicationsChartProps> = ({ applications }) => {
  const data = useMemo(() => {
    const genderCounts = applications.reduce(
      (acc: Record<string, number>, app: Application) => {
        const gender = app.gender || "Unknown";
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
      },
      {}
    );

    return Object.entries(genderCounts).map(([gender, count]) => ({
      gender,
      count,
    }));
  }, [applications]);

  const COLORS = ["#10b981", "#60a5fa", "#f59e0b", "#ef4444"];

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-12 h-12" />}
        title="No data available"
        description="No applications found for the selected filters."
      />
    );
  }

  return (
    <ChartCard title="Gender Distribution" subtitle="Applications by gender" icon={<Users className="w-5 h-5" />}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="gender"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            label={({ gender, count }) => `${gender}: ${count}`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

/* ----------------------------------------
   Export CTA
----------------------------------------- */

interface AnalyticsExportProps {
  onExport: () => void;
  isLoading?: boolean;
}

export const AnalyticsExport: React.FC<AnalyticsExportProps> = ({ onExport, isLoading = false }) => (
  <div className="flex justify-end mb-6">
    <Button onClick={onExport} loading={isLoading}>
      <Download className="w-4 h-4 mr-2" />
      Export Analytics
    </Button>
  </div>
);
