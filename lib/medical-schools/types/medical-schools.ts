export type MedicalSchoolSourceType =
  | "course"
  | "admissions"
  | "news"
  | "pathway"
  | "school";

export type MedicalSchoolSourceSeed = {
  schoolSlug: string;
  schoolName: string;
  sourceType: MedicalSchoolSourceType;
  url: string;
  checkFrequencyHours: number;
};

export type FetchedPage = {
  url: string;
  finalUrl: string;
  status: number;
  contentType: string | null;
  html: string;
};

export type NormalizedPage = {
  title: string | null;
  normalizedText: string;
};

export type DetectedChange = {
  changed: boolean;
  oldHash: string | null;
  newHash: string;
  oldExcerpt: string | null;
  newExcerpt: string;
  summary: string;
  priority: "low" | "medium" | "high";
};