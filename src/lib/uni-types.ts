export type Program = {
    id: string;
    name: string;
    avgSemesterFeePKR: number; // e.g., 100000 means 1 lakh
  };
  
  export type University = {
    id: string;
    name: string;
    city: string;
    province: string;
    established?: number;
    website?: string;
    phone?: string;
    email?: string;
    rating?: number;
    studentsLabel?: string; // "32K+ students"
    badgeRank?: string;     // "#1"
    estBadge?: string;      // "Est. 1951"
    heroImage?: string;     // optional
    blurb?: string;
    applicationFeePKR?: number; // average application fee in PKR
    deadlineISO?: string;       // primary application deadline ISO string
    programsByField: Record<string, Program[]>; // field -> programs
  };
  
  export type UniPick = {
    uniId: string;
    fieldOfStudy?: string;
    rankedProgramIds: string[];   // first, second, third...
  };
  
  export type CheckoutItem = {
    uniId: string;
    programId: string;
    semFeePKR: number;
  };
  
  export type CheckoutSummary = {
    items: CheckoutItem[];
    totalPKR: number;
  };
  