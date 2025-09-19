import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { RootState, AppDispatch } from '../store';
import type { TypedUseSelectorHook } from 'react-redux';
import { 
  fetchProfile, 
  saveProfile, 
  setProfile,
  updateField,
  clearError,
  markAsClean,
  resetProfile,
  Profile,
  ProfileRequest
} from '../features/profile';

// Create typed versions of the hooks
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useProfile = () => {
  const dispatch = useAppDispatch();
  const profileState = useAppSelector((state) => state.profile);

  // Fetch profile from server
  const loadProfile = useCallback(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Save profile to server
  const saveProfileData = useCallback((data: ProfileRequest) => {
    dispatch(saveProfile(data));
  }, [dispatch]);

  // Set profile data locally
  const setProfileData = useCallback((data: Profile | null) => {
    dispatch(setProfile(data));
  }, [dispatch]);

  // Update specific field locally
  const updateProfileField = useCallback((field: Partial<Profile>) => {
    dispatch(updateField(field));
  }, [dispatch]);

  // Clear error
  const clearProfileError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Mark as clean (saved)
  const markProfileAsClean = useCallback(() => {
    dispatch(markAsClean());
  }, [dispatch]);

  // Reset profile state
  const resetProfileData = useCallback(() => {
    dispatch(resetProfile());
  }, [dispatch]);

  return {
    // State
    profile: profileState.profile,
    isLoading: profileState.isLoading,
    error: profileState.error,
    lastSaved: profileState.lastSaved,
    isDirty: profileState.isDirty,
    
    // Actions
    loadProfile,
    saveProfileData,
    setProfileData,
    updateProfileField,
    clearProfileError,
    markProfileAsClean,
    resetProfileData,
  };
};
