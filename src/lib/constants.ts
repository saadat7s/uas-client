// Application constants

export type SectionKey = "profile" | "family" | "education" | "extracurricular";

export const SECTION_LABEL: Record<SectionKey, string> = {
  profile: "Profile",
  family: "Family", 
  education: "Education",
  extracurricular: "Extracurricular",
};

export const SUBSECTIONS: Record<SectionKey, string[]> = {
  profile: [
    "Personal Information",
    "Address", 
    "Language",
    "Demographics",
    "Photo & IDs",
    "Contact Details",
  ],
  family: ["Parents/Guardians"],
  education: ["Matric (O-level Equivalence)", "FSC (A-level Equivalence)", "College"],
  extracurricular: ["Clubs", "Certificates"],
};

export function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Application status types
export type ApplicationStatus = 'not_started' | 'in_progress' | 'complete';

// Form validation constants
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 10,
  PASSWORD_MAX_LENGTH: 32,
  PHOTO_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  NAME_MIN_LENGTH: 2,
  ADDRESS_MIN_LENGTH: 10,
} as const;

// UI constants
export const UI_MESSAGES = {
  LOADING: 'Loading...',
  SAVING: 'Saving...',
  SAVED: 'Saved',
  ERROR: 'An error occurred',
  SUCCESS: 'Success',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    USERS_BY_ROLE: '/auth/users',
  },
} as const;
