import axiosInstance, { handleApiError } from '@/lib/axiosInstance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types matching server-side Extracurricular model
export interface Extracurricular {
  id: string;
  userId: string;
  clubs: string;
  certDocName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExtracurricularRequest {
  clubs: string;
  certDocName?: string;
}

export interface ExtracurricularResponse {
  success: boolean;
  message: string;
  data: {
    extracurricular: Extracurricular;
  };
}

export interface ExtracurricularState {
  extracurricular: Extracurricular | null;
  isLoading: boolean;
  error: string | null;
  lastSaved: string | null;
  isDirty: boolean;
}

// Initial state
const initialState: ExtracurricularState = {
  extracurricular: null,
  isLoading: false,
  error: null,
  lastSaved: null,
  isDirty: false,
};

// Async thunks for API calls
export const fetchExtracurricular = createAsyncThunk<
  ExtracurricularResponse,
  void,
  { rejectValue: string }
>(
  'extracurricular/fetchExtracurricular',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/application/get-extracurricular');
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const saveExtracurricular = createAsyncThunk<
  ExtracurricularResponse,
  ExtracurricularRequest,
  { rejectValue: string }
>(
  'extracurricular/saveExtracurricular',
  async (extracurricularData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/application/create-or-update-extracurricular', extracurricularData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);


// Extracurricular slice
const extracurricularSlice = createSlice({
  name: 'extracurricular',
  initialState,
  reducers: {
    // Set extracurricular data locally
    setExtracurricular: (state, action: PayloadAction<Extracurricular | null>) => {
      state.extracurricular = action.payload;
      state.isDirty = false;
    },
    
    // Update extracurricular field locally
    updateField: (state, action: PayloadAction<Partial<Extracurricular>>) => {
      if (state.extracurricular) {
        state.extracurricular = { ...state.extracurricular, ...action.payload };
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
    
    // Reset extracurricular state
    resetExtracurricular: (state) => {
      state.extracurricular = null;
      state.isLoading = false;
      state.error = null;
      state.lastSaved = null;
      state.isDirty = false;
    },
    
    // Clear all extracurricular data (for logout)
    clearAllExtracurricularData: (state) => {
      state.extracurricular = null;
      state.isLoading = false;
      state.error = null;
      state.lastSaved = null;
      state.isDirty = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch extracurricular
    builder
      .addCase(fetchExtracurricular.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExtracurricular.fulfilled, (state, action) => {
        state.isLoading = false;
        state.extracurricular = action.payload.data.extracurricular;
        state.isDirty = false;
        state.error = null;
      })
      .addCase(fetchExtracurricular.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch extracurricular data';
      });

    // Save extracurricular
    builder
      .addCase(saveExtracurricular.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveExtracurricular.fulfilled, (state, action) => {
        state.isLoading = false;
        state.extracurricular = action.payload.data.extracurricular;
        state.isDirty = false;
        state.lastSaved = new Date().toISOString();
        state.error = null;
      })
      .addCase(saveExtracurricular.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to save extracurricular data';
      });

  },
});

// Export actions
export const { 
  setExtracurricular, 
  updateField, 
  clearError, 
  setLoading, 
  markAsClean, 
  resetExtracurricular,
  clearAllExtracurricularData
} = extracurricularSlice.actions;

// Selectors
export const selectExtracurricular = (state: { extracurricular: ExtracurricularState }) => state.extracurricular;
export const selectExtracurricularData = (state: { extracurricular: ExtracurricularState }) => state.extracurricular.extracurricular;
export const selectExtracurricularLoading = (state: { extracurricular: ExtracurricularState }) => state.extracurricular.isLoading;
export const selectExtracurricularError = (state: { extracurricular: ExtracurricularState }) => state.extracurricular.error;
export const selectExtracurricularDirty = (state: { extracurricular: ExtracurricularState }) => state.extracurricular.isDirty;
export const selectExtracurricularLastSaved = (state: { extracurricular: ExtracurricularState }) => state.extracurricular.lastSaved;

// Export reducer
export default extracurricularSlice.reducer;
