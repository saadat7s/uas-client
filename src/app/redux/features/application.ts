import axiosInstance, { handleApiError } from '@/lib/axiosInstance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from './profile';
import { Family } from './family';
import { Education } from './education';
import { Extracurricular } from './extracurricular';

// Combined application data interface
export interface ApplicationData {
  profile: Profile | null;
  family: Family | null;
  education: Education | null;
  extracurricular: Extracurricular | null;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  data: ApplicationData;
}

export interface ApplicationState {
  data: ApplicationData;
  isLoading: boolean;
  error: string | null;
  lastSynced: string | null;
  isDirty: boolean;
  completionStatus: {
    profile: boolean;
    family: boolean;
    education: boolean;
    extracurricular: boolean;
  };
}

// Initial state
const initialState: ApplicationState = {
  data: {
    profile: null,
    family: null,
    education: null,
    extracurricular: null,
  },
  isLoading: false,
  error: null,
  lastSynced: null,
  isDirty: false,
  completionStatus: {
    profile: false,
    family: false,
    education: false,
    extracurricular: false,
  },
};

// Async thunks for API calls
export const fetchAllApplicationData = createAsyncThunk<
  ApplicationResponse,
  void,
  { rejectValue: string }
>(
  'application/fetchAllApplicationData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/application/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Application slice
const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    // Set application data
    setApplicationData: (state, action: PayloadAction<ApplicationData>) => {
      state.data = action.payload;
      state.isDirty = false;
      state.completionStatus = {
        profile: !!action.payload.profile,
        family: !!action.payload.family,
        education: !!action.payload.education,
        extracurricular: !!action.payload.extracurricular,
      };
    },

    // Update specific section data
    updateSection: <K extends keyof ApplicationData>(
      state: ApplicationState,
      action: PayloadAction<{ section: K; data: ApplicationData[K] }>
    ) => {
      const { section, data } = action.payload;
      state.data[section] = data;
      state.isDirty = true;
      state.completionStatus[section] = !!data;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Mark as clean (synced)
    markAsClean: (state) => {
      state.isDirty = false;
      state.lastSynced = new Date().toISOString();
    },
    
    // Reset application state
    resetApplication: (state) => {
      state.data = {
        profile: null,
        family: null,
        education: null,
        extracurricular: null,
      };
      state.isLoading = false;
      state.error = null;
      state.lastSynced = null;
      state.isDirty = false;
      state.completionStatus = {
        profile: false,
        family: false,
        education: false,
        extracurricular: false,
      };
    },
    
    // Update completion status
    updateCompletionStatus: (state, action: PayloadAction<Partial<ApplicationState['completionStatus']>>) => {
      state.completionStatus = { ...state.completionStatus, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Fetch all application data
    builder
      .addCase(fetchAllApplicationData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllApplicationData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
        state.isDirty = false;
        state.lastSynced = new Date().toISOString();
        state.error = null;
        state.completionStatus = {
          profile: !!action.payload.data.profile,
          family: !!action.payload.data.family,
          education: !!action.payload.data.education,
          extracurricular: !!action.payload.data.extracurricular,
        };
      })
      .addCase(fetchAllApplicationData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch application data';
      });
  },
});

// Export actions
export const { 
  setApplicationData, 
  updateSection, 
  clearError, 
  setLoading, 
  markAsClean, 
  resetApplication,
  updateCompletionStatus
} = applicationSlice.actions;

// Selectors
export const selectApplication = (state: { application: ApplicationState }) => state.application;
export const selectApplicationData = (state: { application: ApplicationState }) => state.application.data;
export const selectApplicationLoading = (state: { application: ApplicationState }) => state.application.isLoading;
export const selectApplicationError = (state: { application: ApplicationState }) => state.application.error;
export const selectApplicationDirty = (state: { application: ApplicationState }) => state.application.isDirty;
export const selectApplicationLastSynced = (state: { application: ApplicationState }) => state.application.lastSynced;
export const selectCompletionStatus = (state: { application: ApplicationState }) => state.application.completionStatus;

// Calculate overall completion percentage
export const selectCompletionPercentage = (state: { application: ApplicationState }) => {
  const status = state.application.completionStatus;
  const completed = Object.values(status).filter(Boolean).length;
  return (completed / Object.keys(status).length) * 100;
};

// Check if specific section is complete
export const selectIsSectionComplete = (section: keyof ApplicationState['completionStatus']) => 
  (state: { application: ApplicationState }) => state.application.completionStatus[section];

// Export reducer
export default applicationSlice.reducer;
