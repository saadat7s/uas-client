import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { RootState, AppDispatch } from '../store';
import type { TypedUseSelectorHook } from 'react-redux';
import { 
  fetchFamily, 
  saveFamily, 
  setFamily,
  updateField,
  clearError,
  markAsClean,
  resetFamily,
  Family,
  FamilyRequest
} from '../features/family';

// Create typed versions of the hooks
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useFamily = () => {
  const dispatch = useAppDispatch();
  const familyState = useAppSelector((state) => state.family);

  // Fetch family from server
  const loadFamily = useCallback(() => {
    dispatch(fetchFamily());
  }, [dispatch]);

  // Save family to server
  const saveFamilyData = useCallback((data: FamilyRequest) => {
    dispatch(saveFamily(data));
  }, [dispatch]);

  
  // Set family data locally
  const setFamilyData = useCallback((data: Family | null) => {
    dispatch(setFamily(data));
  }, [dispatch]);

  // Update specific field locally
  const updateFamilyField = useCallback((field: Partial<Family>) => {
    dispatch(updateField(field));
  }, [dispatch]);

  // Clear error
  const clearFamilyError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Mark as clean (saved)
  const markFamilyAsClean = useCallback(() => {
    dispatch(markAsClean());
  }, [dispatch]);

  // Reset family state
  const resetFamilyData = useCallback(() => {
    dispatch(resetFamily());
  }, [dispatch]);

  return {
    // State
    family: familyState.family,
    isLoading: familyState.isLoading,
    error: familyState.error,
    lastSaved: familyState.lastSaved,
    isDirty: familyState.isDirty,
    
    // Actions
    loadFamily,
    saveFamilyData,
    setFamilyData,
    updateFamilyField,
    clearFamilyError,
    markFamilyAsClean,
    resetFamilyData,
  };
};
