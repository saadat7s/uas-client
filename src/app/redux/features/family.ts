import axiosInstance, { handleApiError } from '@/lib/axiosInstance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types matching server-side Family model
export interface Family {
  id: string;
  userId: string;
  fatherName: string;
  motherName: string;
  fatherOccupation: 'govt' | 'non-govt';
  createdAt: string;
  updatedAt: string;
}

export interface FamilyRequest {
  fatherName: string;
  motherName: string;
  fatherOccupation: 'govt' | 'non-govt';
}

export interface FamilyResponse {
  success: boolean;
  message: string;
  data: {
    family: Family;
  };
}

export interface FamilyState {
  family: Family | null;
  isLoading: boolean;
  error: string | null;
  lastSaved: string | null;
  isDirty: boolean;
}

// Initial state
const initialState: FamilyState = {
  family: null,
  isLoading: false,
  error: null,
  lastSaved: null,
  isDirty: false,
};

// Async thunks for API calls
export const fetchFamily = createAsyncThunk<
  FamilyResponse,
  void,
  { rejectValue: string }
>(
  'family/fetchFamily',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/application/get-family');
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const saveFamily = createAsyncThunk<
  FamilyResponse,
  FamilyRequest,
  { rejectValue: string }
>(
  'family/saveFamily',
  async (familyData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/application/create-or-update-family', familyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);



// Family slice
const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {
    // Set family data locally
    setFamily: (state, action: PayloadAction<Family | null>) => {
      state.family = action.payload;
      state.isDirty = false;
    },
    
    // Update family field locally
    updateField: (state, action: PayloadAction<Partial<Family>>) => {
      if (state.family) {
        state.family = { ...state.family, ...action.payload };
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
    
    // Reset family state
    resetFamily: (state) => {
      state.family = null;
      state.isLoading = false;
      state.error = null;
      state.lastSaved = null;
      state.isDirty = false;
    },
    
    // Clear all family data (for logout)
    clearAllFamilyData: (state) => {
      state.family = null;
      state.isLoading = false;
      state.error = null;
      state.lastSaved = null;
      state.isDirty = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch family
    builder
      .addCase(fetchFamily.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFamily.fulfilled, (state, action) => {
        state.isLoading = false;
        state.family = action.payload.data.family;
        state.isDirty = false;
        state.error = null;
      })
      .addCase(fetchFamily.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch family data';
      });

    // Save family
    builder
      .addCase(saveFamily.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveFamily.fulfilled, (state, action) => {
        state.isLoading = false;
        state.family = action.payload.data.family;
        state.isDirty = false;
        state.lastSaved = new Date().toISOString();
        state.error = null;
      })
      .addCase(saveFamily.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to save family data';
      });

  },
});

// Export actions
export const { 
  setFamily, 
  updateField, 
  clearError, 
  setLoading, 
  markAsClean, 
  resetFamily,
  clearAllFamilyData
} = familySlice.actions;

// Selectors
export const selectFamily = (state: { family: FamilyState }) => state.family;
export const selectFamilyData = (state: { family: FamilyState }) => state.family.family;
export const selectFamilyLoading = (state: { family: FamilyState }) => state.family.isLoading;
export const selectFamilyError = (state: { family: FamilyState }) => state.family.error;
export const selectFamilyDirty = (state: { family: FamilyState }) => state.family.isDirty;
export const selectFamilyLastSaved = (state: { family: FamilyState }) => state.family.lastSaved;

// Export reducer
export default familySlice.reducer;
