// /lib/contants.ts
export type SectionKey = "profile" | "family" | "education" | "extracurricular";

export const SECTION_LABEL: Record<SectionKey, string> = {
  profile: "Profile",
  family: "Family",
  education: "Education",
  extracurricular: "Extracurricular",
};

export const SUBSECTIONS: Record<SectionKey, string[]> = {
  // From your spec/image
  profile: [
    "Personal Information",
    "Address",
    "Language",
    "Demographics",
    "Photo & IDs",       // NEW: shows the picture requirement
    "Contact Details",   // NEW: CNIC, Gender, DOB, Marital, Phone
  ],
  family: ["Parents/Guardians"],
  education: ["Matric (O-level Equivalence)", "FSC (A-level Equivalence)", "College"],
  extracurricular: ["Clubs", "Certificates"],
};

export function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

