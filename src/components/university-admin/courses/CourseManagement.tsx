"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  GraduationCap,
  University,
  Building2,
  Search,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Select,
  Modal,
  EmptyState,
  Badge,
  DataTable,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  LoadingSpinner,
} from "../ui";
import { useCourses } from "@/app/redux/hooks/useUniversityAdmin";
import type { Course } from "@/app/redux/features/universityAdmin";

/**
 * We keep using the existing Course type in the store,
 * but we only *show* the hierarchical fields that matter:
 * - faculty
 * - department
 * - name (the degree/course title)
 * - description (what it has)
 *
 * Internally, we still write back a complete Course object using safe defaults
 * so nothing else in the app breaks.
 */

type Faculty = string;
type Department = string;

const FACULTY_PLACEHOLDER = "Faculty of …";
const DEPT_PLACEHOLDER = "Department of …";

type CourseFormFields = {
  faculty: Faculty;
  department: Department;
  name: string; // Degree/Course title
  description: string; // “what it has”
  isActive: boolean;
};

interface CourseFormProps {
  course?: Course;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fields: CourseFormFields) => void;
  isLoading?: boolean;
}

const CUSTOM_VALUE = "__custom__";

export const CourseForm: React.FC<CourseFormProps> = ({
  course,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  // pull all courses to derive drop-down options
  const { courses } = useCourses();

  // helper to read meta we stashed on Course
  const meta = (c: Course) => ({
    faculty: (c as any)?.faculty as string | undefined,
    department: (c as any)?.department as string | undefined,
  });

  // Build unique faculties list
  const facultyList: string[] = useMemo(() => {
    const s = new Set<string>();
    courses.forEach((c: Course) => {
      const f = meta(c).faculty;
      if (f) s.add(f);
    });
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [courses]);

  // Map faculty -> departments[]
  const departmentsByFaculty: Record<string, string[]> = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    courses.forEach((c: Course) => {
      const { faculty, department } = meta(c);
      if (!faculty || !department) return;
      if (!map[faculty]) map[faculty] = new Set<string>();
      map[faculty].add(department);
    });
    const out: Record<string, string[]> = {};
    Object.keys(map).forEach((f) => {
      out[f] = Array.from(map[f]).sort((a, b) => a.localeCompare(b));
    });
    return out;
  }, [courses]);

  // map existing course -> hierarchical fields (best effort)
  const [fields, setFields] = useState<CourseFormFields>({
    faculty: (course as any)?.faculty ?? "",
    department: (course as any)?.department ?? "",
    name: course?.name ?? "",
    description: course?.description ?? "",
    isActive: course?.isActive ?? true,
  });

  // “Add new …” toggles for selects
  const [customFaculty, setCustomFaculty] = useState<boolean>(false);
  const [customDepartment, setCustomDepartment] = useState<boolean>(false);

  // if faculty changes, keep department valid for that faculty
  useEffect(() => {
    if (!customDepartment && fields.faculty && departmentsByFaculty[fields.faculty]) {
      const list = departmentsByFaculty[fields.faculty];
      if (list.length > 0 && !list.includes(fields.department)) {
        setFields((p) => ({ ...p, department: "" }));
      }
    }
  }, [fields.faculty, customDepartment, departmentsByFaculty, fields.department]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!fields.faculty.trim()) e.faculty = "Faculty is required";
    if (!fields.department.trim()) e.department = "Department is required";
    if (!fields.name.trim()) e.name = "Degree/Course name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(fields);
  };

  const setField =
    <K extends keyof CourseFormFields>(k: K) =>
    (value: CourseFormFields[K]) => {
      setFields((p) => ({ ...p, [k]: value }));
      if (errors[k as string]) setErrors((p) => ({ ...p, [k as string]: "" }));
    };

  // Options for selects
  const facultyOptions = [
    { value: "", label: "Select Faculty…" },
    ...facultyList.map((f) => ({ value: f, label: f })),
    { value: CUSTOM_VALUE, label: "Add new faculty…" },
  ];

  const departmentsForSelected = fields.faculty && departmentsByFaculty[fields.faculty]
    ? departmentsByFaculty[fields.faculty]
    : [];

  const departmentOptions = [
    { value: "", label: "Select Department…" },
    ...departmentsForSelected.map((d) => ({ value: d, label: d })),
    { value: CUSTOM_VALUE, label: "Add new department…" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={course ? "Edit Degree/Course" : "Add Degree/Course"}
      size="lg"
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Faculty (dropdown with "Add new") */}
          <div>
            <Select
              label="Faculty"
              value={customFaculty ? CUSTOM_VALUE : fields.faculty}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const v = e.target.value;
                if (v === CUSTOM_VALUE) {
                  setCustomFaculty(true);
                  if (!fields.faculty) setField("faculty")("");
                  // reset department on new faculty
                  setCustomDepartment(false);
                  setField("department")("");
                } else {
                  setCustomFaculty(false);
                  setField("faculty")(v);
                  // switch department list to this faculty
                  setCustomDepartment(false);
                  setField("department")("");
                }
              }}
              options={facultyOptions}
              error={errors.faculty}
            />
            {customFaculty && (
              <Input
                className="mt-2"
                placeholder={FACULTY_PLACEHOLDER}
                value={fields.faculty}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("faculty")(e.target.value)}
                error={errors.faculty}
              />
            )}
          </div>

          {/* Department (dropdown with "Add new") */}
          <div>
            <Select
              label="Department"
              value={customDepartment ? CUSTOM_VALUE : fields.department}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const v = e.target.value;
                if (v === CUSTOM_VALUE) {
                  setCustomDepartment(true);
                  if (!fields.department) setField("department")("");
                } else {
                  setCustomDepartment(false);
                  setField("department")(v);
                }
              }}
              disabled={!fields.faculty && !customFaculty}
              options={departmentOptions}
              error={errors.department}
            />
            {customDepartment && (
              <Input
                className="mt-2"
                placeholder={DEPT_PLACEHOLDER}
                value={fields.department}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("department")(e.target.value)}
                error={errors.department}
              />
            )}
          </div>

          {/* Degree/Course name (free text) */}
          <Input
            label="Degree/Course name"
            placeholder="e.g., BS Computer Science"
            value={fields.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("name")(e.target.value)}
            error={errors.name}
          />

          {/* Active toggle */}
          <div className="flex items-center gap-2 pt-6">
            <input
              id="active"
              type="checkbox"
              checked={fields.isActive}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("isActive")(e.target.checked)}
              className="rounded border-slate-300 text-[var(--pakistan-green)] focus:ring-[var(--pakistan-green)]"
            />
            <label htmlFor="active" className="text-sm font-medium text-slate-700">
              Active
            </label>
          </div>
        </div>

        {/* What it includes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            What it includes
          </label>
          <textarea
            rows={4}
            value={fields.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setField("description")(e.target.value)}
            placeholder="e.g., Core modules, research project, industry placement, etc."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            {course ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface CourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onAddCourse: () => void;
  isLoading?: boolean;
}

/**
 * Table only shows: Faculty, Department, Degree/Course, Status, Actions.
 * Filters: search (by faculty/department/name) and two dropdowns.
 */
export const CourseList: React.FC<CourseListProps> = ({
  courses,
  onEdit,
  onDelete,
  onAddCourse,
  isLoading = false,
}) => {
  const [q, setQ] = useState("");
  const [faculty, setFaculty] = useState<Faculty | "All">("All");
  const [department, setDepartment] = useState<Department | "All">("All");

  // Extract hierarchical metadata that we saved into each course (via any)
  const meta = (c: Course) => ({
    faculty: (c as any)?.faculty as Faculty | undefined,
    department: (c as any)?.department as Department | undefined,
  });

  const faculties = useMemo<Faculty[]>(
    () =>
      Array.from(
        new Set(
          courses
            .map(meta)
            .map((m) => m.faculty)
            .filter(Boolean) as Faculty[]
        )
      ),
    [courses]
  );

  const departments = useMemo<Department[]>(
    () =>
      Array.from(
        new Set(
          courses
            .map(meta)
            .filter((m) => (faculty === "All" ? true : m.faculty === faculty))
            .map((m) => m.department)
            .filter(Boolean) as Department[]
        )
      ),
    [courses, faculty]
  );

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return courses.filter((c) => {
      const m = meta(c);
      const matchesQ =
        ql === "" ||
        (m.faculty ?? "").toLowerCase().includes(ql) ||
        (m.department ?? "").toLowerCase().includes(ql) ||
        c.name.toLowerCase().includes(ql);

      const matchesFaculty = faculty === "All" || m.faculty === faculty;
      const matchesDept = department === "All" || m.department === department;

      return matchesQ && matchesFaculty && matchesDept;
    });
  }, [courses, q, faculty, department]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={<GraduationCap className="w-12 h-12" />}
        title="No degrees/courses yet"
        description="Create your first degree under a faculty and department."
        action={
          <Button onClick={onAddCourse}>
            <Plus className="w-4 h-4 mr-2" />
            Add Degree/Course
          </Button>
        }
      />
    );
  }

  const facultyOptions = [{ value: "All", label: "All Faculties" }].concat(
    faculties.map((f) => ({ value: f, label: f }))
  );
  const deptOptions = [{ value: "All", label: "All Departments" }].concat(
    departments.map((d) => ({ value: d, label: d }))
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              icon={<Search className="w-4 h-4" />}
              placeholder="Search by faculty, department, or degree…"
              value={q}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
            />
            <Select
              value={faculty}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFaculty(e.target.value as Faculty | "All")
              }
              options={facultyOptions}
            />
            <Select
              value={department}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setDepartment(e.target.value as Department | "All")
              }
              options={deptOptions}
            />
          </div>
        </CardContent>
      </Card>

      <DataTable>
        <TableHeader>
          <TableHeaderCell>
            <div className="flex items-center gap-2">
              <University className="w-4 h-4 text-slate-500" />
              Faculty
            </div>
          </TableHeaderCell>
          <TableHeaderCell>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-500" />
              Department
            </div>
          </TableHeaderCell>
          <TableHeaderCell>Degree/Course</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Actions</TableHeaderCell>
        </TableHeader>
        <TableBody>
          {filtered.map((c) => {
            const m = meta(c);
            return (
              <TableRow key={c.id}>
                <TableCell>{m.faculty ?? "—"}</TableCell>
                <TableCell>{m.department ?? "—"}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-slate-900">{c.name}</div>
                    {c.description && (
                      <div className="text-sm text-slate-500 line-clamp-2">
                        {c.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={c.isActive ? "success" : "default"}>
                    {c.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(c)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(c.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </DataTable>

      {filtered.length === 0 && (
        <EmptyState title="No results" description="Try adjusting your filters or search." />
      )}
    </div>
  );
};

/** Minimal stats row (optional visual context, no counts about students etc.) */
export const CourseStats: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const total = courses.length;
  const active = courses.filter((c) => c.isActive).length;
  const faculties = new Set(courses.map((c) => (c as any)?.faculty).filter(Boolean));
  const departments = new Set(courses.map((c) => (c as any)?.department).filter(Boolean));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Degrees</p>
            <p className="text-2xl font-semibold text-slate-900">{total}</p>
          </div>
          <GraduationCap className="w-8 h-8 text-[var(--pakistan-green)]" />
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Active</p>
            <p className="text-2xl font-semibold text-slate-900">{active}</p>
          </div>
          <Badge variant="success">Live</Badge>
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Faculties</p>
            <p className="text-2xl font-semibold text-slate-900">{faculties.size}</p>
          </div>
          <University className="w-8 h-8 text-slate-500" />
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Departments</p>
            <p className="text-2xl font-semibold text-slate-900">{departments.size}</p>
          </div>
          <Building2 className="w-8 h-8 text-slate-500" />
        </div>
      </Card>
    </div>
  );
};
