import axiosInstance, { handleApiError } from '@/lib/axiosInstance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types matching server-side Profile model
export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  address: string;
  primaryLang: 'en' | 'ur';
  citizen: 'PK' | 'Non-PK';
  cnic: string;
  gender: 'Male' | 'Female';
  dob: string; // yyyy-mm-dd format
  maritalStatus: 'Married' | 'Unmarried';
  phone: string;
  photoName?: string;
  photoBytes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  address: string;
  primaryLang: 'en' | 'ur';
  citizen: 'PK' | 'Non-PK';
  cnic: string;
  gender: 'Male' | 'Female';
  dob: string;
  maritalStatus: 'Married' | 'Unmarried';
  phone: string;
  photoName?: string;
  photoBytes?: number;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    profile: Profile;
  };
}

export interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  lastSaved: string | null;
  isDirty: boolean;
}

// Initial state
const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  lastSaved: null,
  isDirty: false,
};

// Async thunks for API calls
export const fetchProfile = createAsyncThunk<
  ProfileResponse,
  void,
  { rejectValue: string }
>(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/application/get-profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const saveProfile = createAsyncThunk<
  ProfileResponse,
  ProfileRequest,
  { rejectValue: string }
>(
  'profile/saveProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/application/create-or-update-profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);



// Profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Set profile data locally
    setProfile: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload;
      state.isDirty = false;
    },
    
    // Update profile field locally
    updateField: (state, action: PayloadAction<Partial<Profile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
        state.isDirty = true;
      }
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Mark as clean (saved)
    markAsClean: (state) => {
      state.isDirty = false;
      state.lastSaved = new Date().toISOString();
    },
    
    // Reset profile state
    resetProfile: (state) => {
      state.profile = null;
      state.isLoading = false;
      state.error = null;
      state.lastSaved = null;
      state.isDirty = false;
    },
    
    // Clear all profile data (for logout)
    clearAllProfileData: (state) => {
      state.profile = null;
      state.isLoading = false;
      state.error = null;
      state.lastSaved = null;
      state.isDirty = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.data.profile;
        state.isDirty = false;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch profile';
      });

    // Save profile
    builder
      .addCase(saveProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.data.profile;
        state.isDirty = false;
        state.lastSaved = new Date().toISOString();
        state.error = null;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to save profile';
      });

  },
});

// Export actions
export const { 
  setProfile, 
  updateField, 
  clearError, 
  setLoading, 
  markAsClean, 
  resetProfile,
  clearAllProfileData
} = profileSlice.actions;

// Selectors
export const selectProfile = (state: { profile: ProfileState }) => state.profile;
export const selectProfileData = (state: { profile: ProfileState }) => state.profile.profile;
export const selectProfileLoading = (state: { profile: ProfileState }) => state.profile.isLoading;
export const selectProfileError = (state: { profile: ProfileState }) => state.profile.error;
export const selectProfileDirty = (state: { profile: ProfileState }) => state.profile.isDirty;
export const selectProfileLastSaved = (state: { profile: ProfileState }) => state.profile.lastSaved;

// Export reducer
export default profileSlice.reducer;
