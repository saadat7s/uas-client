import axios, { AxiosError } from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Response interceptor for error handling
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Token is invalid, remove it
        localStorage.removeItem('token');
      }
      return Promise.reject(error);
    }
  );
  
  // Utility function to handle API errors
  export const handleApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      // Check if it's a validation error with multiple messages
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        return error.response.data.errors.join(', ');
      }
      // Single error message
      return error.response?.data?.message || error.message || 'An error occurred';
    }
    return 'Network error. Please try again.';
  };

export default axiosInstance;