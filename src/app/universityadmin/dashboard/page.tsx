"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AdminLayout, PageHeader } from "@/components/university-admin/layout/AdminLayout";
import {
  ApplicationFilters,
  ApplicationList,
  ApplicationStats,
  BulkActions,
  ApplicationDetail,
} from "@/components/university-admin/applications/ApplicationManagement";
import {
  CourseStats,
  CourseList,
  CourseForm,
} from "@/components/university-admin/courses/CourseManagement";
import { Button, Toast, LoadingSpinner } from "@/components/university-admin/ui";
import { useApplications, useCourses, useDrawer, useUI } from "@/app/redux/hooks/useUniversityAdmin";
import type { Application, ApplicationStatus, Course } from "@/app/redux/features/universityAdmin";
import { Download, UploadCloud, FileText, BookOpen, Plus } from "lucide-react";

/* ----------------------------
   Mock data
----------------------------- */
const generateMockApplications = (): Application[] => {
  const programs = ["BS Computer Science", "BBA", "MS Data Science", "MBA", "BE Electrical", "BS Economics"];
  const statuses: ApplicationStatus[] = ["Pending", "Under review", "Accepted", "Rejected"];
  const students = ["Ayesha Khan", "Ali Raza", "Sara Ahmed", "Bilal Hussain", "Fatima Noor", "Usman Tariq"];
  const cities = ["Lahore", "Karachi", "Islamabad", "Peshawar", "Quetta", "Multan", "Faisalabad"];
  const regions = ["Punjab", "Sindh", "KPK", "Balochistan", "Gilgit-Baltistan", "ICT", "AJK"];
  const genders = ["Male", "Female", "Other"] as const;

  return Array.from({ length: 150 }, (_, i) => ({
    id: `APP-${2000 + i}`,
    student: students[i % students.length],
    age: 17 + (i % 14),
    gender: genders[i % genders.length] as Application["gender"],
    city: cities[i % cities.length],
    region: regions[i % regions.length] as Application["region"],
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

// seed some example faculties/departments
const seedCourse = (id: number, faculty: string, department: string, name: string, active = true): Course => ({
  id: `course-${id}`,
  name,
  code: `CODE-${id}`,
  description: "Core modules + capstone + industry exposure",
  credits: 0,                 // ignored by UI
  program: name,              // keep program aligned with title so filters elsewhere still work
  semester: "",
  instructor: "",
  isActive: active,
  maxStudents: 0,
  prerequisites: [],
  // we stash hierarchy on the object so the component can read it:
  ...( { faculty, department } as any ),
});

const generateMockCourses = (): Course[] => [
  seedCourse(1, "Faculty of Computer Science", "Department of Computing", "BS Computer Science"),
  seedCourse(2, "Faculty of Computer Science", "Department of AI", "MS Data Science"),
  seedCourse(3, "Suleman Dawood School of Business", "Department of Management", "BBA"),
  seedCourse(4, "Suleman Dawood School of Business", "Department of MBA", "MBA", false),
  seedCourse(5, "School of Humanities & Social Sciences", "Department of Economics", "BS Economics"),
  seedCourse(6, "School of Engineering", "Department of Electrical Engineering", "BE Electrical"),
];

/* ----------------------------
   Page
----------------------------- */
export default function UniversityAdminDashboard() {
  const {
    applications,
    selectedApplications,
    selectedApplication,
    filters,
    setApplications,
    setSelectedApplications,
    toggleApplicationSelection,
    setApplicationFilters,
    updateApplicationStatus,
    bulkUpdateApplicationStatus,
    setSelectedApplication,
  } = useApplications();

  const {
    courses,
    selectedCourse,
    courseFormOpen,
    setCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    setSelectedCourse,
    setCourseFormOpen,
  } = useCourses();

  const { isLoading, error, successMessage, setLoading, setSuccessMessage, clearMessages } = useUI();
  const { drawerOpen, drawerContent, openDrawer, closeDrawer } = useDrawer();

  const [activeTab, setActiveTab] = useState<"applications" | "courses">("applications");

  // Seed data once
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      if (applications.length === 0) setApplications(generateMockApplications());
      if (courses.length === 0) setCourses(generateMockCourses());
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filters
  const filteredApplications: Application[] = useMemo(() => {
    return applications.filter((app: Application) => {
      const matchesStatus = filters.status === "All" || app.status === filters.status;
      const matchesProgram = filters.program === "All" || app.program === filters.program;
      const q = filters.searchQuery.toLowerCase();
      const matchesSearch =
        filters.searchQuery === "" ||
        app.id.toLowerCase().includes(q) ||
        app.student.toLowerCase().includes(q) ||
        app.program.toLowerCase().includes(q);
      return matchesStatus && matchesProgram && matchesSearch;
    });
  }, [applications, filters]);

  const programs = useMemo<string[]>(
    () => Array.from(new Set(applications.map((a: Application) => a.program))),
    [applications]
  );

  // Application handlers
  const handleApplicationSelect = (id: string) => toggleApplicationSelection(id);
  const handleSelectAllApplications = (selected: boolean) => {
    setSelectedApplications(selected ? filteredApplications.map((a) => a.id) : []);
  };

  const handleBulkAccept = () => {
    if (selectedApplications.length === 0) return;
    bulkUpdateApplicationStatus(selectedApplications, "Accepted");
    setSuccessMessage(`Accepted ${selectedApplications.length} applications`);
    setSelectedApplications([]);
  };

  const handleBulkReject = () => {
    if (selectedApplications.length === 0) return;
    bulkUpdateApplicationStatus(selectedApplications, "Rejected");
    setSuccessMessage(`Rejected ${selectedApplications.length} applications`);
    setSelectedApplications([]);
  };

  const handleBulkExport = () => {
    if (selectedApplications.length === 0) return;
    const rows = applications.filter((a: Application) => selectedApplications.includes(a.id));
    const header = ["ID", "Student", "Program", "Status", "Region", "Gender", "Submitted At"];
    const csv = [header.join(","), ...rows.map((a: Application) =>
      [
        a.id,
        a.student,
        a.program,
        a.status,
        a.region ?? "",
        a.gender ?? "",
        a.submittedAt,
      ]
        .map((s) => {
          const v = String(s);
          return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
        })
        .join(",")
    )].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `applications-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setSuccessMessage("Exported selected applications");
  };

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    openDrawer("application", application);
  };

  // Degrees/Courses CRUD (writes hierarchical meta onto the Course object)
  const toCourseFromFields = (f: {
    faculty: string;
    department: string;
    name: string;
    description: string;
    isActive: boolean;
  }): Omit<Course, "id"> & { faculty: string; department: string } => ({
    name: f.name,
    code: `CODE-${Date.now()}`,     // harmless internal default
    description: f.description,
    credits: 0,
    program: f.name,                // keep program aligned with the degree title
    semester: "",
    instructor: "",
    isActive: f.isActive,
    maxStudents: 0,
    prerequisites: [],
    faculty: f.faculty,
    department: f.department,
  });

  const handleAddCourse = () => {
    setSelectedCourse(undefined);
    setCourseFormOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setCourseFormOpen(true);
  };

  const handleDeleteCourse = (courseId: string) => {
    deleteCourse(courseId);
    setSuccessMessage("Degree/Course deleted");
  };

  const handleCourseSubmit = (fields: {
    faculty: string;
    department: string;
    name: string;
    description: string;
    isActive: boolean;
  }) => {
    if (selectedCourse) {
      const payload = toCourseFromFields(fields);
      // keep the meta on the object:
      updateCourse(selectedCourse.id, payload as any);
      setSuccessMessage("Degree/Course updated");
    } else {
      const newCourse: Course = { id: `course-${Date.now()}`, ...(toCourseFromFields(fields) as any) };
      addCourse(newCourse);
      setSuccessMessage("Degree/Course created");
    }
    setCourseFormOpen(false);
    setSelectedCourse(undefined);
  };

  // Import/Export overall
  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("Data exported successfully");
    }, 500);
  };

  const handleImport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("Data imported successfully");
    }, 500);
  };

  // Toast cleanup
  useEffect(() => {
    if (successMessage || error) {
      const t = setTimeout(() => clearMessages(), 2200);
      return () => clearTimeout(t);
    }
  }, [successMessage, error, clearMessages]);

  if (isLoading && applications.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader
        title="University Admin"
        description="Manage applications and degree offerings"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleImport}>
              <UploadCloud className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* Segmented tabs */}
      <nav
        className="mb-6 inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
        role="tablist"
        aria-label="Sections"
      >
        <button
          role="tab"
          aria-selected={activeTab === "applications"}
          onClick={() => setActiveTab("applications")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "applications"
              ? "bg-[var(--pakistan-green)] text-white"
              : "text-slate-700 hover:bg-slate-50"
          }`}
        >
          <FileText className="w-4 h-4 mr-2 inline" />
          Applications ({applications.length})
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "courses"}
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "courses"
              ? "bg-[var(--pakistan-green)] text-white"
              : "text-slate-700 hover:bg-slate-50"
          }`}
        >
          <BookOpen className="w-4 h-4 mr-2 inline" />
          Degrees & Courses ({courses.length})
        </button>
      </nav>

      {activeTab === "applications" && (
        <>
          <ApplicationStats applications={applications} />

          <div className="mb-4">
            <ApplicationFilters
              filters={filters}
              onFiltersChange={setApplicationFilters}
              programs={programs}
            />
          </div>

          <BulkActions
            selectedCount={selectedApplications.length}
            onBulkAccept={handleBulkAccept}
            onBulkReject={handleBulkReject}
            onBulkExport={handleBulkExport}
          />

          <ApplicationList
            applications={filteredApplications}
            selectedApplications={selectedApplications}
            onApplicationSelect={handleApplicationSelect}
            onSelectAll={handleSelectAllApplications}
            onViewApplication={handleViewApplication}
            onUpdateStatus={updateApplicationStatus}
            isLoading={isLoading}
          />
        </>
      )}

      {activeTab === "courses" && (
        <>
          <CourseStats courses={courses} />
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddCourse}>
              <Plus className="w-4 h-4 mr-2" />
              Add Degree/Course
            </Button>
          </div>
          <CourseList
            courses={courses}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
            onAddCourse={handleAddCourse}
            isLoading={isLoading}
          />
        </>
      )}

      {/* Modals/Drawers */}
      <CourseForm
        course={selectedCourse}
        isOpen={courseFormOpen}
        onClose={() => {
          setCourseFormOpen(false);
          setSelectedCourse(undefined);
        }}
        onSubmit={handleCourseSubmit}
        isLoading={isLoading}
      />

      <ApplicationDetail
        application={drawerContent === "application" ? selectedApplication || null : null}
        isOpen={drawerOpen && drawerContent === "application"}
        onClose={() => {
          setSelectedApplication(undefined);
          closeDrawer();
        }}
        onUpdateStatus={updateApplicationStatus}
      />

      <Toast message={successMessage} type="success" />
      <Toast message={error} type="error" />
    </AdminLayout>
  );
}
