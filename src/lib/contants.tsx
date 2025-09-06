// lib/application/constants.ts
export type SectionKey =
  | "profile" | "family" | "education" | "testing" | "activities" | "Certificates" | "coursesGrades";

export const SECTION_LABEL: Record<SectionKey, string> = {
  profile: "Profile",
  family: "Family",
  education: "Education",
  testing: "Testing",
  activities: "Activities",
  Certificates: "certificates",
  coursesGrades: "Courses & Grades",
};

export const SUBSECTIONS: Record<SectionKey, string[]> = {
  profile: [
    "Personal Information",
    "Address",
    "Contact Details",
    "Demographics",
    "Language",
  ],
  family: ["Parents/Guardians", "Siblings", "Family Income"],
  education: ["High School", "Colleges & Universities", "Transcripts", "Class Rank",],
  testing: ["SAT/ACT Scores", "AP Scores", "Other Tests"],
  activities: ["Extracurricular Activities", "Work Experience", "Volunteer Work"],
  Certificates: ["Matric/O Levels", "FSC/A levels"],
  coursesGrades: ["Courses & Grades"],
};

export function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
