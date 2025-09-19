import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { RootState, AppDispatch } from '../store';
import type { TypedUseSelectorHook } from 'react-redux';
import { 
  fetchExtracurricular, 
  saveExtracurricular, 
  setExtracurricular,
  updateField,
  clearError,
  markAsClean,
  resetExtracurricular,
  Extracurricular,
  ExtracurricularRequest
} from '../features/extracurricular';

// Create typed versions of the hooks
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useExtracurricular = () => {
  const dispatch = useAppDispatch();
  const extracurricularState = useAppSelector((state) => state.extracurricular);

  // Fetch extracurricular from server
  const loadExtracurricular = useCallback(() => {
    dispatch(fetchExtracurricular());
  }, [dispatch]);

  // Save extracurricular to server
  const saveExtracurricularData = useCallback((data: ExtracurricularRequest) => {
    dispatch(saveExtracurricular(data));
  }, [dispatch]);



  // Set extracurricular data locally
  const setExtracurricularData = useCallback((data: Extracurricular | null) => {
    dispatch(setExtracurricular(data));
  }, [dispatch]);

  // Update specific field locally
  const updateExtracurricularField = useCallback((field: Partial<Extracurricular>) => {
    dispatch(updateField(field));
  }, [dispatch]);

  // Clear error
  const clearExtracurricularError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Mark as clean (saved)
  const markExtracurricularAsClean = useCallback(() => {
    dispatch(markAsClean());
  }, [dispatch]);

  // Reset extracurricular state
  const resetExtracurricularData = useCallback(() => {
    dispatch(resetExtracurricular());
  }, [dispatch]);

  return {
    // State
    extracurricular: extracurricularState.extracurricular,
    isLoading: extracurricularState.isLoading,
    error: extracurricularState.error,
    lastSaved: extracurricularState.lastSaved,
    isDirty: extracurricularState.isDirty,
    
    // Actions
    loadExtracurricular,
    saveExtracurricularData,
    setExtracurricularData,
    updateExtracurricularField,
    clearExtracurricularError,
    markExtracurricularAsClean,
    resetExtracurricularData,
  };
};
