import axiosInstance, { handleApiError } from '../axiosInstance';

// Types for application data
export interface ProfileData {
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
}

export interface FamilyData {
  fatherName: string;
  motherName: string;
  fatherOccupation: 'govt' | 'non-govt';
}

export interface EducationData {
  matricGrades: string;
  matricPicName?: string;
  fscGrades: string;
  fscPicName?: string;
  collegeName: string;
}

export interface ExtracurricularData {
  clubs: string;
  certDocName?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

// Profile API functions
export const saveProfile = async (data: ProfileData): Promise<ApiResponse<{ profile: any }>> => {
  try {
    const response = await axiosInstance.post('/api/application/profile', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getProfile = async (): Promise<ApiResponse<{ profile: any }>> => {
  try {
    const response = await axiosInstance.get('/api/application/profile');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Family API functions
export const saveFamily = async (data: FamilyData): Promise<ApiResponse<{ family: any }>> => {
  try {
    const response = await axiosInstance.post('/api/application/family', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getFamily = async (): Promise<ApiResponse<{ family: any }>> => {
  try {
    const response = await axiosInstance.get('/api/application/family');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Education API functions
export const saveEducation = async (data: EducationData): Promise<ApiResponse<{ education: any }>> => {
  try {
    const response = await axiosInstance.post('/api/application/education', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getEducation = async (): Promise<ApiResponse<{ education: any }>> => {
  try {
    const response = await axiosInstance.get('/api/application/education');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Extracurricular API functions
export const saveExtracurricular = async (data: ExtracurricularData): Promise<ApiResponse<{ extracurricular: any }>> => {
  try {
    const response = await axiosInstance.post('/api/application/extracurricular', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getExtracurricular = async (): Promise<ApiResponse<{ extracurricular: any }>> => {
  try {
    const response = await axiosInstance.get('/api/application/extracurricular');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get all application data
export const getAllApplicationData = async (): Promise<ApiResponse<{
  profile?: any;
  family?: any;
  education?: any;
  extracurricular?: any;
}>> => {
  try {
    const response = await axiosInstance.get('/api/application/all');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
