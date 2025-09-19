import axiosInstance, { handleApiError } from '@/lib/axiosInstance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Enums and Types matching server-side User model
export enum UserRole {
  UNDERGRADUATE = 'undergraduate',
  GRADUATE = 'graduate'
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  dob: Date;
  phone: string;
  address: string;
  role: UserRole;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterUserRequest {
  email: string;
  password: string;
  fullName: string;
  dob: string;
  phone: string;
  address: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Server's register response does NOT include a token
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};



// Async thunks for API calls
export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterUserRequest,
  { rejectValue: string }
>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', userData);
      const data = response.data;
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', credentials);
      const data = response.data;

      // Store token in localStorage
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
      }

      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getCurrentUser = createAsyncThunk<
  { user: User },
  void,
  { rejectValue: string }
>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await axiosInstance.get('/api/auth/me');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getUsersByRole = createAsyncThunk<
  { users: User[] },
  UserRole,
  { rejectValue: string }
>(
  'auth/getUsersByRole',
  async (role, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await axiosInstance.get(`/api/auth/users/${role}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      if (token) {
        // Call the logout endpoint to log the event on the server
        await axiosInstance.post('/api/auth/logout');
      }

      // Remove token and all application data from localStorage
      localStorage.removeItem('token');
      // Clear all application data from localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pcas:application:')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      return;
    } catch (error) {
      // Even if the server call fails, we still want to clear local storage
      localStorage.removeItem('token');
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Logout action
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
      localStorage.removeItem('token');
      // Clear all application data from localStorage
      // Clear both old and new format keys
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pcas:application:')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    },
    
    // Clear error action
    clearError: (state) => {
      state.error = null;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Initialize auth from localStorage
    initializeAuth: (state) => {
      const token = localStorage.getItem('token');
      if (token) {
        state.token = token;
        // You might want to validate the token here or call getCurrentUser
      }
    },
  },
  extraReducers: (builder) => {
    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        // Registration does not authenticate the user; require explicit login
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
        state.isAuthenticated = false;
      });

    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      });

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get user data';
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });

    // Get users by role (this doesn't affect main auth state)
    builder
      .addCase(getUsersByRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsersByRole.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getUsersByRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get users';
      });

    // Logout user
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        // Even if logout request fails, clear the auth state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || 'Logout failed';
      });
  },
});

// Export actions
export const { logout, clearError, setLoading, initializeAuth } = authSlice.actions;

// Export async thunks
export { logoutUser };

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;

// Export reducer
export default authSlice.reducer;
