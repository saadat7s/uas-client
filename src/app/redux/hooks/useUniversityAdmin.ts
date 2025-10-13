import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { useCallback } from 'react';
import {
  Application,
  Course,
  Program,
  AdminUser,
  UniversitySettings,
  NotificationSettings,
  IntegrationSettings,
  ApplicationSettings,
  AnalyticsFilters,
  DashboardStats,
  ApplicationStatus,
} from '../features/universityAdmin';

// Application hooks
export const useApplications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const applications = useSelector((state: RootState) => state.universityAdmin.applications);
  const selectedApplications = useSelector((state: RootState) => state.universityAdmin.selectedApplications);
  const selectedApplication = useSelector((state: RootState) => state.universityAdmin.selectedApplication); // NEW
  const filters = useSelector((state: RootState) => state.universityAdmin.applicationFilters);

  const setApplications = useCallback((apps: Application[]) => {
    dispatch({ type: 'universityAdmin/setApplications', payload: apps });
  }, [dispatch]);

  const addApplication = useCallback((app: Application) => {
    dispatch({ type: 'universityAdmin/addApplication', payload: app });
  }, [dispatch]);

  const updateApplication = useCallback((id: string, updates: Partial<Application>) => {
    dispatch({ type: 'universityAdmin/updateApplication', payload: { id, updates } });
  }, [dispatch]);

  const updateApplicationStatus = useCallback((id: string, status: ApplicationStatus) => {
    dispatch({ type: 'universityAdmin/updateApplicationStatus', payload: { id, status } });
  }, [dispatch]);

  const bulkUpdateApplicationStatus = useCallback((ids: string[], status: ApplicationStatus) => {
    dispatch({ type: 'universityAdmin/bulkUpdateApplicationStatus', payload: { ids, status } });
  }, [dispatch]);

  const setSelectedApplications = useCallback((ids: string[]) => {
    dispatch({ type: 'universityAdmin/setSelectedApplications', payload: ids });
  }, [dispatch]);

  const toggleApplicationSelection = useCallback((id: string) => {
    dispatch({ type: 'universityAdmin/toggleApplicationSelection', payload: id });
  }, [dispatch]);

  const setSelectedApplication = useCallback((app?: Application) => { // NEW
    dispatch({ type: 'universityAdmin/setSelectedApplication', payload: app });
  }, [dispatch]);

  const setApplicationFilters = useCallback((newFilters: Partial<typeof filters>) => {
    dispatch({ type: 'universityAdmin/setApplicationFilters', payload: newFilters });
  }, [dispatch]);

  return {
    applications,
    selectedApplications,
    selectedApplication,   // NEW
    filters,
    setApplications,
    addApplication,
    updateApplication,
    updateApplicationStatus,
    bulkUpdateApplicationStatus,
    setSelectedApplications,
    toggleApplicationSelection,
    setSelectedApplication, // NEW
    setApplicationFilters,
  };
};

// Course hooks
export const useCourses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const courses = useSelector((state: RootState) => state.universityAdmin.courses);
  const selectedCourse = useSelector((state: RootState) => state.universityAdmin.selectedCourse);
  const courseFormOpen = useSelector((state: RootState) => state.universityAdmin.courseFormOpen);

  const setCourses = useCallback((courses: Course[]) => {
    dispatch({ type: 'universityAdmin/setCourses', payload: courses });
  }, [dispatch]);

  const addCourse = useCallback((course: Course) => {
    dispatch({ type: 'universityAdmin/addCourse', payload: course });
  }, [dispatch]);

  const updateCourse = useCallback((id: string, updates: Partial<Course>) => {
    dispatch({ type: 'universityAdmin/updateCourse', payload: { id, updates } });
  }, [dispatch]);

  const deleteCourse = useCallback((id: string) => {
    dispatch({ type: 'universityAdmin/deleteCourse', payload: id });
  }, [dispatch]);

  const setSelectedCourse = useCallback((course: Course | undefined) => {
    dispatch({ type: 'universityAdmin/setSelectedCourse', payload: course });
  }, [dispatch]);

  const setCourseFormOpen = useCallback((open: boolean) => {
    dispatch({ type: 'universityAdmin/setCourseFormOpen', payload: open });
  }, [dispatch]);

  return {
    courses,
    selectedCourse,
    courseFormOpen,
    setCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    setSelectedCourse,
    setCourseFormOpen,
  };
};

// Program hooks
export const usePrograms = () => {
  const dispatch = useDispatch<AppDispatch>();
  const programs = useSelector((state: RootState) => state.universityAdmin.programs);
  const selectedProgram = useSelector((state: RootState) => state.universityAdmin.selectedProgram);
  const programFormOpen = useSelector((state: RootState) => state.universityAdmin.programFormOpen);

  const setPrograms = useCallback((programs: Program[]) => {
    dispatch({ type: 'universityAdmin/setPrograms', payload: programs });
  }, [dispatch]);

  const addProgram = useCallback((program: Program) => {
    dispatch({ type: 'universityAdmin/addProgram', payload: program });
  }, [dispatch]);

  const updateProgram = useCallback((id: string, updates: Partial<Program>) => {
    dispatch({ type: 'universityAdmin/updateProgram', payload: { id, updates } });
  }, [dispatch]);

  const deleteProgram = useCallback((id: string) => {
    dispatch({ type: 'universityAdmin/deleteProgram', payload: id });
  }, [dispatch]);

  const setSelectedProgram = useCallback((program: Program | undefined) => {
    dispatch({ type: 'universityAdmin/setSelectedProgram', payload: program });
  }, [dispatch]);

  const setProgramFormOpen = useCallback((open: boolean) => {
    dispatch({ type: 'universityAdmin/setProgramFormOpen', payload: open });
  }, [dispatch]);

  return {
    programs,
    selectedProgram,
    programFormOpen,
    setPrograms,
    addProgram,
    updateProgram,
    deleteProgram,
    setSelectedProgram,
    setProgramFormOpen,
  };
};

// User hooks
export const useAdminUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const adminUsers = useSelector((state: RootState) => state.universityAdmin.adminUsers);
  const selectedUser = useSelector((state: RootState) => state.universityAdmin.selectedUser);
  const userFormOpen = useSelector((state: RootState) => state.universityAdmin.userFormOpen);

  const setAdminUsers = useCallback((users: AdminUser[]) => {
    dispatch({ type: 'universityAdmin/setAdminUsers', payload: users });
  }, [dispatch]);

  const addAdminUser = useCallback((user: AdminUser) => {
    dispatch({ type: 'universityAdmin/addAdminUser', payload: user });
  }, [dispatch]);

  const updateAdminUser = useCallback((id: string, updates: Partial<AdminUser>) => {
    dispatch({ type: 'universityAdmin/updateAdminUser', payload: { id, updates } });
  }, [dispatch]);

  const deleteAdminUser = useCallback((id: string) => {
    dispatch({ type: 'universityAdmin/deleteAdminUser', payload: id });
  }, [dispatch]);

  const setSelectedUser = useCallback((user: AdminUser | undefined) => {
    dispatch({ type: 'universityAdmin/setSelectedUser', payload: user });
  }, [dispatch]);

  const setUserFormOpen = useCallback((open: boolean) => {
    dispatch({ type: 'universityAdmin/setUserFormOpen', payload: open });
  }, [dispatch]);

  return {
    adminUsers,
    selectedUser,
    userFormOpen,
    setAdminUsers,
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    setSelectedUser,
    setUserFormOpen,
  };
};

// Settings hooks
export const useUniversitySettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const settings = useSelector((state: RootState) => state.universityAdmin.universitySettings);

  const updateSettings = useCallback((updates: Partial<UniversitySettings>) => {
    dispatch({ type: 'universityAdmin/updateUniversitySettings', payload: updates });
  }, [dispatch]);

  return {
    settings,
    updateSettings,
  };
};

export const useNotificationSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const settings = useSelector((state: RootState) => state.universityAdmin.notificationSettings);

  const updateSettings = useCallback((updates: Partial<NotificationSettings>) => {
    dispatch({ type: 'universityAdmin/updateNotificationSettings', payload: updates });
  }, [dispatch]);

  return {
    settings,
    updateSettings,
  };
};

export const useIntegrationSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const settings = useSelector((state: RootState) => state.universityAdmin.integrationSettings);

  const updateSettings = useCallback((updates: Partial<IntegrationSettings>) => {
    dispatch({ type: 'universityAdmin/updateIntegrationSettings', payload: updates });
  }, [dispatch]);

  const regenerateApiKey = useCallback(() => {
    dispatch({ type: 'universityAdmin/regenerateApiKey' });
  }, [dispatch]);

  return {
    settings,
    updateSettings,
    regenerateApiKey,
  };
};

export const useApplicationSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const settings = useSelector((state: RootState) => state.universityAdmin.applicationSettings);

  const updateSettings = useCallback((updates: Partial<ApplicationSettings>) => {
    dispatch({ type: 'universityAdmin/updateApplicationSettings', payload: updates });
  }, [dispatch]);

  return {
    settings,
    updateSettings,
  };
};

// Analytics hooks
export const useAnalytics = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.universityAdmin.analyticsFilters);

  const setFilters = useCallback((filters: Partial<AnalyticsFilters>) => {
    dispatch({ type: 'universityAdmin/setAnalyticsFilters', payload: filters });
  }, [dispatch]);

  return {
    filters,
    setFilters,
  };
};

// Dashboard hooks
export const useDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stats = useSelector((state: RootState) => state.universityAdmin.dashboardStats);

  const updateStats = useCallback(() => {
    dispatch({ type: 'universityAdmin/updateDashboardStats' });
  }, [dispatch]);

  return {
    stats,
    updateStats,
  };
};

// UI hooks
export const useUI = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.universityAdmin.isLoading);
  const error = useSelector((state: RootState) => state.universityAdmin.error);
  const successMessage = useSelector((state: RootState) => state.universityAdmin.successMessage);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'universityAdmin/setLoading', payload: loading });
  }, [dispatch]);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'universityAdmin/setError', payload: error });
  }, [dispatch]);

  const setSuccessMessage = useCallback((message: string | null) => {
    dispatch({ type: 'universityAdmin/setSuccessMessage', payload: message });
  }, [dispatch]);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'universityAdmin/clearMessages' });
  }, [dispatch]);

  return {
    isLoading,
    error,
    successMessage,
    setLoading,
    setError,
    setSuccessMessage,
    clearMessages,
  };
};

// Drawer hooks
export const useDrawer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const drawerOpen = useSelector((state: RootState) => state.universityAdmin.drawerOpen);
  const drawerContent = useSelector((state: RootState) => state.universityAdmin.drawerContent);

  const openDrawer = useCallback((content: typeof drawerContent, data?: any) => {
    dispatch({ type: 'universityAdmin/openDrawer', payload: { content, data } });
  }, [dispatch]);

  const closeDrawer = useCallback(() => {
    dispatch({ type: 'universityAdmin/closeDrawer' });
  }, [dispatch]);

  return {
    drawerOpen,
    drawerContent,
    openDrawer,
    closeDrawer,
  };
};
