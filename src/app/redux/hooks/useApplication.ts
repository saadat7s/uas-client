import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { RootState, AppDispatch } from '../store';
import type { TypedUseSelectorHook } from 'react-redux';
import { 
  fetchAllApplicationData,
  setApplicationData,
  updateSection,
  clearError,
  markAsClean,
  resetApplication,
  updateCompletionStatus,
  ApplicationData,
  ApplicationState
} from '../features/application';

// Create typed versions of the hooks
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useApplication = () => {
  const dispatch = useAppDispatch();
  const applicationState = useAppSelector((state) => state.application);

  // Fetch all application data from server
  const loadAllData = useCallback(() => {
    dispatch(fetchAllApplicationData());
  }, [dispatch]);

  // Set application data locally
  const setApplicationDataLocal = useCallback((data: ApplicationData) => {
    dispatch(setApplicationData(data));
  }, [dispatch]);

  // Update specific section data
  const updateSectionData = useCallback((section: keyof ApplicationData, data: ApplicationData[keyof ApplicationData]) => {
    dispatch(updateSection({ section, data }));
  }, [dispatch]);

  // Clear error
  const clearApplicationError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Mark as clean (synced)
  const markApplicationAsClean = useCallback(() => {
    dispatch(markAsClean());
  }, [dispatch]);

  // Reset application state
  const resetApplicationData = useCallback(() => {
    dispatch(resetApplication());
  }, [dispatch]);

  // Update completion status
  const updateCompletion = useCallback((status: Partial<ApplicationState['completionStatus']>) => {
    dispatch(updateCompletionStatus(status));
  }, [dispatch]);

  return {
    // State
    data: applicationState.data,
    isLoading: applicationState.isLoading,
    error: applicationState.error,
    lastSynced: applicationState.lastSynced,
    isDirty: applicationState.isDirty,
    completionStatus: applicationState.completionStatus,
    
    // Actions
    loadAllData,
    setApplicationDataLocal,
    updateSectionData,
    clearApplicationError,
    markApplicationAsClean,
    resetApplicationData,
    updateCompletion,
  };
};
