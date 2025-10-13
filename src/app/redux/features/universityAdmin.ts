import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export type ApplicationStatus = "Pending" | "Under review" | "Accepted" | "Rejected";

export interface Application {
  id: string;
  student: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
  city?: string;
  region?: "Punjab" | "Sindh" | "KPK" | "Balochistan" | "Gilgit-Baltistan" | "ICT" | "AJK";
  program: string;
  university: string;
  submittedAt: string;
  status: ApplicationStatus;
  score?: number;
  documents?: string[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  program: string;
  semester: string;
  instructor: string;
  isActive: boolean;
  maxStudents?: number;
  prerequisites?: string[];
}

export interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  degree: string;
  isOpen: boolean;
  deadline: string;
  requirements: string[];
  courses: string[]; // Course IDs
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Reviewer";
  isActive: boolean;
  lastLogin?: string;
}

export interface UniversitySettings {
  name: string;
  logo?: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  description: string;
}

export interface NotificationSettings {
  notifyApplicantOnStatusChange: boolean;
  notifyReviewerOnAssignment: boolean;
  defaultEmailFrom: string;
  templateSubject: string;
  templateBody: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface IntegrationSettings {
  webhookUrl: string;
  apiKey: string;
  isWebhookActive: boolean;
  lastWebhookTest?: string;
}

export interface ApplicationSettings {
  autoCloseOnDeadline: boolean;
  requiredDocs: { label: string; required: boolean }[];
  reviewDeadline: number; // days
  allowLateApplications: boolean;
}

export interface AnalyticsFilters {
  program: string | "All";
  status: ApplicationStatus | "All";
  region: string | "All";
  gender: string | "All";
  dateRange: string;
  searchQuery: string;
}

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  underReviewApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  totalCourses: number;
  activeCourses: number;
  totalPrograms: number;
  activePrograms: number;
  totalAdmins: number;
  activeAdmins: number;
}

interface UniversityAdminState {
  // Applications
  applications: Application[];
  selectedApplications: string[];
  selectedApplication?: Application; // <— NEW
  applicationFilters: {
    status: ApplicationStatus | "All";
    program: string | "All";
    searchQuery: string;
  };

  // Courses
  courses: Course[];
  selectedCourse?: Course;
  courseFormOpen: boolean;

  // Programs
  programs: Program[];
  selectedProgram?: Program;
  programFormOpen: boolean;

  // Users
  adminUsers: AdminUser[];
  selectedUser?: AdminUser;
  userFormOpen: boolean;

  // Settings
  universitySettings: UniversitySettings;
  notificationSettings: NotificationSettings;
  integrationSettings: IntegrationSettings;
  applicationSettings: ApplicationSettings;

  // Analytics
  analyticsFilters: AnalyticsFilters;

  // Dashboard
  dashboardStats: DashboardStats;

  // UI State
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  // Drawer state
  drawerOpen: boolean;
  drawerContent: 'application' | 'course' | 'program' | 'user' | null;
}

const initialState: UniversityAdminState = {
  applications: [],
  selectedApplications: [],
  selectedApplication: undefined,
  applicationFilters: {
    status: "All",
    program: "All",
    searchQuery: "",
  },

  courses: [],
  selectedCourse: undefined,
  courseFormOpen: false,

  programs: [],
  selectedProgram: undefined,
  programFormOpen: false,

  adminUsers: [],
  selectedUser: undefined,
  userFormOpen: false,

  universitySettings: {
    name: "LUMS",
    address: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    description: "",
  },

  notificationSettings: {
    notifyApplicantOnStatusChange: true,
    notifyReviewerOnAssignment: true,
    defaultEmailFrom: "admissions@lums.edu.pk",
    templateSubject: "Your application status at {{university}}",
    templateBody: "Hello {{student}},\n\nYour application ({{application_id}}) is now '{{status}}'.\n\nRegards,\n{{university}} Admissions",
    emailNotifications: true,
    smsNotifications: false,
  },

  integrationSettings: {
    webhookUrl: "https://hooks.yourdomain.com/pcas/events",
    apiKey: "pk_live_************************",
    isWebhookActive: true,
  },

  applicationSettings: {
    autoCloseOnDeadline: true,
    requiredDocs: [
      { label: "Personal Statement", required: true },
      { label: "High School Transcript", required: true },
      { label: "CNIC / Passport", required: true },
      { label: "Recommendation Letter", required: false },
    ],
    reviewDeadline: 14,
    allowLateApplications: false,
  },

  analyticsFilters: {
    program: "All",
    status: "All",
    region: "All",
    gender: "All",
    dateRange: "30",
    searchQuery: "",
  },

  dashboardStats: {
    totalApplications: 0,
    pendingApplications: 0,
    underReviewApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    totalCourses: 0,
    activeCourses: 0,
    totalPrograms: 0,
    activePrograms: 0,
    totalAdmins: 0,
    activeAdmins: 0,
  },

  isLoading: false,
  error: null,
  successMessage: null,

  drawerOpen: false,
  drawerContent: null,
};

const universityAdminSlice = createSlice({
  name: 'universityAdmin',
  initialState,
  reducers: {
    // Application actions
    setApplications: (state, action: PayloadAction<Application[]>) => {
      state.applications = action.payload;
    },
    addApplication: (state, action: PayloadAction<Application>) => {
      state.applications.push(action.payload);
    },
    updateApplication: (state, action: PayloadAction<{ id: string; updates: Partial<Application> }>) => {
      const index = state.applications.findIndex(app => app.id === action.payload.id);
      if (index !== -1) {
        state.applications[index] = { ...state.applications[index], ...action.payload.updates };
      }
    },
    updateApplicationStatus: (state, action: PayloadAction<{ id: string; status: ApplicationStatus }>) => {
      const application = state.applications.find(app => app.id === action.payload.id);
      if (application) {
        application.status = action.payload.status;
      }
    },
    bulkUpdateApplicationStatus: (state, action: PayloadAction<{ ids: string[]; status: ApplicationStatus }>) => {
      action.payload.ids.forEach(id => {
        const application = state.applications.find(app => app.id === id);
        if (application) {
          application.status = action.payload.status;
        }
      });
    },
    setSelectedApplications: (state, action: PayloadAction<string[]>) => {
      state.selectedApplications = action.payload;
    },
    toggleApplicationSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedApplications.indexOf(id);
      if (index === -1) {
        state.selectedApplications.push(id);
      } else {
        state.selectedApplications.splice(index, 1);
      }
    },
    setSelectedApplication: (state, action: PayloadAction<Application | undefined>) => { // <— NEW
      state.selectedApplication = action.payload;
    },
    setApplicationFilters: (state, action: PayloadAction<Partial<typeof state.applicationFilters>>) => {
      state.applicationFilters = { ...state.applicationFilters, ...action.payload };
    },

    // Course actions
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
    },
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload);
    },
    updateCourse: (state, action: PayloadAction<{ id: string; updates: Partial<Course> }>) => {
      const index = state.courses.findIndex(course => course.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = { ...state.courses[index], ...action.payload.updates };
      }
    },
    deleteCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(course => course.id !== action.payload);
    },
    setSelectedCourse: (state, action: PayloadAction<Course | undefined>) => {
      state.selectedCourse = action.payload;
    },
    setCourseFormOpen: (state, action: PayloadAction<boolean>) => {
      state.courseFormOpen = action.payload;
    },

    // Program actions
    setPrograms: (state, action: PayloadAction<Program[]>) => {
      state.programs = action.payload;
    },
    addProgram: (state, action: PayloadAction<Program>) => {
      state.programs.push(action.payload);
    },
    updateProgram: (state, action: PayloadAction<{ id: string; updates: Partial<Program> }>) => {
      const index = state.programs.findIndex(program => program.id === action.payload.id);
      if (index !== -1) {
        state.programs[index] = { ...state.programs[index], ...action.payload.updates };
      }
    },
    deleteProgram: (state, action: PayloadAction<string>) => {
      state.programs = state.programs.filter(program => program.id !== action.payload);
    },
    setSelectedProgram: (state, action: PayloadAction<Program | undefined>) => {
      state.selectedProgram = action.payload;
    },
    setProgramFormOpen: (state, action: PayloadAction<boolean>) => {
      state.programFormOpen = action.payload;
    },

    // User actions
    setAdminUsers: (state, action: PayloadAction<AdminUser[]>) => {
      state.adminUsers = action.payload;
    },
    addAdminUser: (state, action: PayloadAction<AdminUser>) => {
      state.adminUsers.push(action.payload);
    },
    updateAdminUser: (state, action: PayloadAction<{ id: string; updates: Partial<AdminUser> }>) => {
      const index = state.adminUsers.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.adminUsers[index] = { ...state.adminUsers[index], ...action.payload.updates };
      }
    },
    deleteAdminUser: (state, action: PayloadAction<string>) => {
      state.adminUsers = state.adminUsers.filter(user => user.id !== action.payload);
    },
    setSelectedUser: (state, action: PayloadAction<AdminUser | undefined>) => {
      state.selectedUser = action.payload;
    },
    setUserFormOpen: (state, action: PayloadAction<boolean>) => {
      state.userFormOpen = action.payload;
    },

    // Settings actions
    updateUniversitySettings: (state, action: PayloadAction<Partial<UniversitySettings>>) => {
      state.universitySettings = { ...state.universitySettings, ...action.payload };
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.notificationSettings = { ...state.notificationSettings, ...action.payload };
    },
    updateIntegrationSettings: (state, action: PayloadAction<Partial<IntegrationSettings>>) => {
      state.integrationSettings = { ...state.integrationSettings, ...action.payload };
    },
    updateApplicationSettings: (state, action: PayloadAction<Partial<ApplicationSettings>>) => {
      state.applicationSettings = { ...state.applicationSettings, ...action.payload };
    },
    regenerateApiKey: (state) => {
      const key = `pk_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
      state.integrationSettings.apiKey = key;
    },

    // Analytics actions
    setAnalyticsFilters: (state, action: PayloadAction<Partial<AnalyticsFilters>>) => {
      state.analyticsFilters = { ...state.analyticsFilters, ...action.payload };
    },

    // Dashboard actions
    setDashboardStats: (state, action: PayloadAction<DashboardStats>) => {
      state.dashboardStats = action.payload;
    },
    updateDashboardStats: (state) => {
      const stats = state.dashboardStats;
      stats.totalApplications = state.applications.length;
      stats.pendingApplications = state.applications.filter(app => app.status === "Pending").length;
      stats.underReviewApplications = state.applications.filter(app => app.status === "Under review").length;
      stats.acceptedApplications = state.applications.filter(app => app.status === "Accepted").length;
      stats.rejectedApplications = state.applications.filter(app => app.status === "Rejected").length;
      stats.totalCourses = state.courses.length;
      stats.activeCourses = state.courses.filter(course => course.isActive).length;
      stats.totalPrograms = state.programs.length;
      stats.activePrograms = state.programs.filter(program => program.isOpen).length;
      stats.totalAdmins = state.adminUsers.length;
      stats.activeAdmins = state.adminUsers.filter(user => user.isActive).length;
    },

    // UI actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccessMessage: (state, action: PayloadAction<string | null>) => {
      state.successMessage = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },

    // Drawer actions
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.drawerOpen = action.payload;
    },
    setDrawerContent: (state, action: PayloadAction<typeof state.drawerContent>) => {
      state.drawerContent = action.payload;
    },
    openDrawer: (state, action: PayloadAction<{ content: typeof state.drawerContent; data?: any }>) => {
      state.drawerOpen = true;
      state.drawerContent = action.payload.content;

      // Clear others & set selected item based on content
      state.selectedCourse = undefined;
      state.selectedProgram = undefined;
      state.selectedUser = undefined;
      state.selectedApplication = undefined;

      if (action.payload.content === 'application' && action.payload.data) {
        state.selectedApplication = action.payload.data as Application; // <— NEW
      } else if (action.payload.content === 'course' && action.payload.data) {
        state.selectedCourse = action.payload.data;
      } else if (action.payload.content === 'program' && action.payload.data) {
        state.selectedProgram = action.payload.data;
      } else if (action.payload.content === 'user' && action.payload.data) {
        state.selectedUser = action.payload.data;
      }
    },
    closeDrawer: (state) => {
      state.drawerOpen = false;
      state.drawerContent = null;
      state.selectedApplication = undefined; // <— NEW
      state.selectedCourse = undefined;
      state.selectedProgram = undefined;
      state.selectedUser = undefined;
    },
  },
});

export const {
  setApplications,
  addApplication,
  updateApplication,
  updateApplicationStatus,
  bulkUpdateApplicationStatus,
  setSelectedApplications,
  toggleApplicationSelection,
  setSelectedApplication, // <— NEW
  setApplicationFilters,

  setCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  setSelectedCourse,
  setCourseFormOpen,

  setPrograms,
  addProgram,
  updateProgram,
  deleteProgram,
  setSelectedProgram,
  setProgramFormOpen,

  setAdminUsers,
  addAdminUser,
  updateAdminUser,
  deleteAdminUser,
  setSelectedUser,
  setUserFormOpen,

  updateUniversitySettings,
  updateNotificationSettings,
  updateIntegrationSettings,
  updateApplicationSettings,
  regenerateApiKey,

  setAnalyticsFilters,

  setDashboardStats,
  updateDashboardStats,

  setLoading,
  setError,
  setSuccessMessage,
  clearMessages,

  setDrawerOpen,
  setDrawerContent,
  openDrawer,
  closeDrawer,
} = universityAdminSlice.actions;

export default universityAdminSlice.reducer;
