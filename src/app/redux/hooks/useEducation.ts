import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { RootState, AppDispatch } from '../store';
import type { TypedUseSelectorHook } from 'react-redux';
import { 
  fetchEducation, 
  saveEducation, 
  setEducation,
  updateField,
  clearError,
  markAsClean,
  resetEducation,
  Education,
  EducationRequest
} from '../features/education';

// Create typed versions of the hooks
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useEducation = () => {
  const dispatch = useAppDispatch();
  const educationState = useAppSelector((state) => state.education);

  // Fetch education from server
  const loadEducation = useCallback(() => {
    dispatch(fetchEducation());
  }, [dispatch]);

  // Save education to server
  const saveEducationData = useCallback((data: EducationRequest) => {
    dispatch(saveEducation(data));
  }, [dispatch]);



  // Set education data locally
  const setEducationData = useCallback((data: Education | null) => {
    dispatch(setEducation(data));
  }, [dispatch]);

  // Update specific field locally
  const updateEducationField = useCallback((field: Partial<Education>) => {
    dispatch(updateField(field));
  }, [dispatch]);

  // Clear error
  const clearEducationError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Mark as clean (saved)
  const markEducationAsClean = useCallback(() => {
    dispatch(markAsClean());
  }, [dispatch]);

  // Reset education state
  const resetEducationData = useCallback(() => {
    dispatch(resetEducation());
  }, [dispatch]);

  return {
    // State
    education: educationState.education,
    isLoading: educationState.isLoading,
    error: educationState.error,
    lastSaved: educationState.lastSaved,
    isDirty: educationState.isDirty,
    
    // Actions
    loadEducation,
    saveEducationData,
    setEducationData,
    updateEducationField,
    clearEducationError,
    markEducationAsClean,
    resetEducationData,
  };
};
