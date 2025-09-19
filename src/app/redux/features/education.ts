import axiosInstance, { handleApiError } from '@/lib/axiosInstance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types matching server-side Education model
export interface Education {
  id: string;
  userId: string;
  matricGrades: string;
  matricPicName?: string;
  fscGrades: string;
  fscPicName?: string;
  collegeName: string;
  createdAt: string;
  updatedAt: string;
}

export interface EducationRequest {
  matricGrades: string;
  matricPicName?: string;
  fscGrades: string;
  fscPicName?: string;
  collegeName: string;
}

export interface EducationResponse {
  success: boolean;
  message: string;
  data: {
    education: Education;
  };
}

export interface EducationState {
  education: Education | null;
  isLoading: boolean;
  error: string | null;
  lastSaved: string | null;
  isDirty: boolean;
}

// Initial state
const initialState: EducationState = {
  education: null,
  isLoading: false,
  error: null,
  lastSaved: null,
  isDirty: false,
};

// Async thunks for API calls
export const fetchEducation = createAsyncThunk<
  EducationResponse,
  void,
  { rejectValue: string }
>(
  'education/fetchEducation',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/application/get-education');
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const saveEducation = createAsyncThunk<
  EducationResponse,
  EducationRequest,
  { rejectValue: string }
>(
  'education/saveEducation',
  async (educationData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/application/create-or-update-education', educationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Education slice
const educationSlice = createSlice({
  name: 'education',
  initialState,
  reducers: {
    // Set education data locally
    setEducation: (state, action: PayloadAction<Education | null>) => {
      state.education = action.payload;
      state.isDirty = false;
    },
    
    // Update education field locally
    updateField: (state, action: PayloadAction<Partial<Education>>) => {
      if (state.education) {
        state.education = { ...state.education, ...action.payload };
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
    
    // Reset education state
    resetEducation: (state) => {
      state.education = null;
      state.isLoading = false;
      state.error = null;
      state.lastSaved = null;
      state.isDirty = false;
    },
    
    // Clear all education data (for logout)
    clearAllEducationData: (state) => {
      state.education = null;
      state.isLoading = false;
      state.error = null;
      state.lastSaved = null;
      state.isDirty = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch education
    builder
      .addCase(fetchEducation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEducation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.education = action.payload.data.education;
        state.isDirty = false;
        state.error = null;
      })
      .addCase(fetchEducation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch education data';
      });

    // Save education
    builder
      .addCase(saveEducation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveEducation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.education = action.payload.data.education;
        state.isDirty = false;
        state.lastSaved = new Date().toISOString();
        state.error = null;
      })
      .addCase(saveEducation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to save education data';
      });

  },
});

// Export actions
export const { 
  setEducation, 
  updateField, 
  clearError, 
  setLoading, 
  markAsClean, 
  resetEducation,
  clearAllEducationData
} = educationSlice.actions;

// Selectors
export const selectEducation = (state: { education: EducationState }) => state.education;
export const selectEducationData = (state: { education: EducationState }) => state.education.education;
export const selectEducationLoading = (state: { education: EducationState }) => state.education.isLoading;
export const selectEducationError = (state: { education: EducationState }) => state.education.error;
export const selectEducationDirty = (state: { education: EducationState }) => state.education.isDirty;
export const selectEducationLastSaved = (state: { education: EducationState }) => state.education.lastSaved;

// Export reducer
export default educationSlice.reducer;
