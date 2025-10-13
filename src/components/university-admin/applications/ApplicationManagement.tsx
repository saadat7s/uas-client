"use client";
import React, { useMemo } from "react";
import {
  Eye,
  CheckCircle2,
  Clock,
  Loader2,
  Search,
  Download,
  MoreVertical,
  User2,
  Calendar,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  XCircle as XCircleIcon, // ✅ keep ONE import, use consistently
} from "lucide-react";
import {
  Card,
  Button,
  Input,
  Select,
  Badge,
  DataTable,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  EmptyState,
  LoadingSpinner,
  Drawer,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui";
import { Application, ApplicationStatus } from "@/app/redux/features/universityAdmin";

// -----------------------------
// Types
// -----------------------------
type AppFilters = {
  status: ApplicationStatus | "All";
  program: string | "All";
  searchQuery: string;
};

interface ApplicationFiltersProps {
  filters: AppFilters;
  onFiltersChange: (filters: Partial<AppFilters>) => void; // ✅ fixed typeof issue
  programs: string[];
}

// -----------------------------
// Filters
// -----------------------------
export const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
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

  const programOptions = [
    { value: "All", label: "All Programs" },
    ...programs.map((program) => ({ value: program, label: program })),
  ];

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          icon={<Search className="w-4 h-4" />}
          placeholder="Search by ID, student, or program..."
          value={filters.searchQuery}
          onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
        />
        <Select
          value={filters.status}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onFiltersChange({
              status: e.target.value as ApplicationStatus | "All",
            })
          }
          options={statusOptions}
        />
        <Select
          value={filters.program}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onFiltersChange({ program: e.target.value })
          }
          options={programOptions}
        />
      </div>
    </Card>
  );
};

// -----------------------------
// Status Badge
// -----------------------------
export const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({
  status,
}) => {
  const statusConfig = {
    Pending: {
      variant: "warning" as const,
      icon: <Clock className="w-3 h-3" />,
    },
    "Under review": {
      variant: "info" as const,
      icon: <Loader2 className="w-3 h-3" />,
    },
    Accepted: {
      variant: "success" as const,
      icon: <CheckCircle className="w-3 h-3" />,
    },
    Rejected: {
      variant: "error" as const,
      icon: <XCircleIcon className="w-3 h-3" />,
    },
  } as const;

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} icon={config.icon}>
      {status}
    </Badge>
  );
};

// -----------------------------
// Application List
// -----------------------------
interface ApplicationListProps {
  applications: Application[];
  selectedApplications: string[];
  onApplicationSelect: (id: string) => void;
  onSelectAll: (selected: boolean) => void;
  onViewApplication: (application: Application) => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  isLoading?: boolean;
}

export const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  selectedApplications,
  onApplicationSelect,
  onSelectAll,
  onViewApplication,
  onUpdateStatus,
  isLoading = false,
}) => {
  const allSelected =
    applications.length > 0 &&
    selectedApplications.length === applications.length;
  const someSelected =
    selectedApplications.length > 0 &&
    selectedApplications.length < applications.length;

  const nextStatus = (current: ApplicationStatus): ApplicationStatus => {
    switch (current) {
      case "Pending":
        return "Under review";
      case "Under review":
        return "Accepted";
      case "Accepted":
        return "Accepted";
      case "Rejected":
        return "Rejected";
      default:
        return "Pending";
    }
  };

  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-12 h-12" />}
        title="No applications found"
        description="No applications match your current filters."
      />
    );
  }

  return (
    <DataTable>
      <TableHeader>
        <TableHeaderCell>
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => {
              if (input) input.indeterminate = someSelected;
            }}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="rounded border-slate-300 text-[var(--pakistan-green)] focus:ring-[var(--pakistan-green)]"
          />
        </TableHeaderCell>
        <TableHeaderCell>Application</TableHeaderCell>
        <TableHeaderCell>Student</TableHeaderCell>
        <TableHeaderCell>Program</TableHeaderCell>
        <TableHeaderCell>Submitted</TableHeaderCell>
        <TableHeaderCell>Status</TableHeaderCell>
        <TableHeaderCell>Actions</TableHeaderCell>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <TableRow key={application.id}>
            <TableCell>
              <input
                type="checkbox"
                checked={selectedApplications.includes(application.id)}
                onChange={() => onApplicationSelect(application.id)}
                className="rounded border-slate-300 text-[var(--pakistan-green)] focus:ring-[var(--pakistan-green)]"
              />
            </TableCell>
            <TableCell>
              <button
                onClick={() => onViewApplication(application)}
                className="text-[var(--pakistan-green-600)] font-semibold hover:underline"
              >
                {application.id}
              </button>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <User2 className="w-4 h-4 text-slate-500" />
                <span>{application.student}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-500" />
                <span>{application.program}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>{formatDate(application.submittedAt)}</span>
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={application.status} />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewApplication(application)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onUpdateStatus(application.id, nextStatus(application.status))
                  }
                >
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  );
};

// -----------------------------
// Bulk Actions
// -----------------------------
export const BulkActions: React.FC<{
  selectedCount: number;
  onBulkAccept: () => void;
  onBulkReject: () => void;
  onBulkExport: () => void;
}> = ({ selectedCount, onBulkAccept, onBulkReject, onBulkExport }) => {
  if (selectedCount === 0) return null;
  return (
    <Card className="mb-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-700">
          {selectedCount} application{selectedCount !== 1 ? "s" : ""} selected
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onBulkAccept}>
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Accept All
          </Button>
          <Button variant="outline" size="sm" onClick={onBulkReject}>
            <XCircleIcon className="w-4 h-4 mr-1" />
            Reject All
          </Button>
          <Button variant="outline" size="sm" onClick={onBulkExport}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>
    </Card>
  );
};

// -----------------------------
// Detail Drawer
// -----------------------------
export const ApplicationDetail: React.FC<{
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
}> = ({ application, isOpen, onClose, onUpdateStatus }) => {
  if (!application) return null;

  const formatFullDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusOptions: ApplicationStatus[] = [
    "Pending",
    "Under review",
    "Accepted",
    "Rejected",
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Application ${application.id}`}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Application ID</p>
                <p className="font-medium">{application.id}</p>
              </div>
              <div>
                <p className="text-slate-500">University</p>
                <p className="font-medium">{application.university}</p>
              </div>
              <div>
                <p className="text-slate-500">Program</p>
                <p className="font-medium">{application.program}</p>
              </div>
              <div>
                <p className="text-slate-500">Submitted</p>
                <p className="font-medium">
                  {formatFullDate(application.submittedAt)}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Student</p>
                <p className="font-medium">{application.student}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <StatusBadge status={application.status} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  variant={status === application.status ? "primary" : "outline"}
                  size="sm"
                  onClick={() => onUpdateStatus(application.id, status)}
                >
                  {status}
                </Button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              This will update the application status and notify the student.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {application.documents && application.documents.length > 0 ? (
                application.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 border border-slate-200 rounded-lg"
                  >
                    <span className="text-sm font-medium">{doc}</span>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">No documents uploaded</div>
              )}
            </div>
          </CardContent>
        </Card>

        {(application.age ||
          application.gender ||
          application.city ||
          application.region) && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {application.age && (
                  <div>
                    <p className="text-slate-500">Age</p>
                    <p className="font-medium">{application.age}</p>
                  </div>
                )}
                {application.gender && (
                  <div>
                    <p className="text-slate-500">Gender</p>
                    <p className="font-medium">{application.gender}</p>
                  </div>
                )}
                {application.city && (
                  <div>
                    <p className="text-slate-500">City</p>
                    <p className="font-medium">{application.city}</p>
                  </div>
                )}
                {application.region && (
                  <div>
                    <p className="text-slate-500">Region</p>
                    <p className="font-medium">{application.region}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Drawer>
  );
};

// -----------------------------
// Stats Row
// -----------------------------
export const ApplicationStats: React.FC<{ applications: Application[] }> = ({
  applications,
}) => {
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => a.status === "Pending").length;
    const underReview = applications.filter((a) => a.status === "Under review")
      .length;
    const accepted = applications.filter((a) => a.status === "Accepted").length;
    const rejected = applications.filter((a) => a.status === "Rejected").length;
    return { total, pending, underReview, accepted, rejected };
  }, [applications]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
          </div>
          <GraduationCap className="w-8 h-8 text-slate-500" />
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Pending</p>
            <p className="text-2xl font-semibold text-slate-900">
              {stats.pending}
            </p>
          </div>
          <Clock className="w-8 h-8 text-yellow-500" />
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Under Review</p>
            <p className="text-2xl font-semibold text-slate-900">
              {stats.underReview}
            </p>
          </div>
          <Loader2 className="w-8 h-8" />
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Accepted</p>
            <p className="text-2xl font-semibold text-slate-900">
              {stats.accepted}
            </p>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Rejected</p>
            <p className="text-2xl font-semibold text-slate-900">
              {stats.rejected}
            </p>
          </div>
          <XCircleIcon className="w-8 h-8 text-red-500" />
        </div>
      </Card>
    </div>
  );
};
