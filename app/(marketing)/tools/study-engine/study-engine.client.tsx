"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import SignOutButton from "@/components/auth/sign-out-button";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Filter,
  FlaskConical,
  GraduationCap,
  Info,
  LineChart,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  Lock,
} from "lucide-react";

type EngineTab = "overview" | "subjects" | "internals" | "externals";

type JurisdictionKey =
  | "qce"
  | "vce"
  | "hsc"
  | "wace"
  | "act"
  | "tce"
  | "ntcet"
  | "sace";

type SubjectTier = "tier1" | "tier2" | "tier3";
type ScalingBand = "veryHigh" | "high" | "medium" | "low";
type SubjectArea =
  | "English"
  | "Mathematics"
  | "Science"
  | "Humanities"
  | "Languages"
  | "Technologies"
  | "Arts"
  | "Health"
  | "Cross-disciplinary";
type AssessmentType =
  | "Exam"
  | "Short Response Test"
  | "Extended Response"
  | "Research Investigation"
  | "Scientific Investigation"
  | "Data Analysis"
  | "Practical Report"
  | "Oral Presentation"
  | "Performance"
  | "Portfolio"
  | "Design Project"
  | "Modelling Task"
  | "Major Work"
  | "Folio"
  | "Problem Solving";

type SubjectItem = {
  id: string;
  name: string;
  area: SubjectArea;
  tier: SubjectTier;
  scaling: ScalingBand;
  recommendedForMed?: boolean;
  note?: string;
  commonAssessments: AssessmentType[];
  externalWeight?: number;
  years?: "Year 10" | "Year 11-12" | "Year 10-12";
  examStyle?: string;
};

type JurisdictionConfig = {
  key: JurisdictionKey;
  label: string;
  certificate: string;
  admissionsBody: string;
  shortAssessment: string;
  assessmentBullets: string[];
  scalingBullets: string[];
  medicineBullets: string[];
  localPrograms: string[];
  examWeightingDefault: number;
  internalModelHint: string;
  externalModelHint: string;
  subjectSelectionHint: string;
  subjects: SubjectItem[];
};

type InternalRow = {
  id: string;
  subjectId: string;
  task1: string;
  task2: string;
  task3: string;
  task4: string;
  weighting: string;
  rank: string;
};

type SubjectSortKey = "recommended" | "scaling" | "tier" | "name";

const STORAGE_KEY = "amg-study-engine-v2";

const TABS: {
  key: EngineTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "overview", label: "Strategy Engine", icon: GraduationCap },
  { key: "subjects", label: "Subject Library", icon: Filter },
  { key: "internals", label: "Internals", icon: BarChart3 },
  { key: "externals", label: "Externals", icon: LineChart },
];

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function asNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

function createSubject(
  id: string,
  name: string,
  area: SubjectArea,
  tier: SubjectTier,
  scaling: ScalingBand,
  recommendedForMed: boolean,
  commonAssessments: AssessmentType[],
  note?: string,
  externalWeight?: number,
  examStyle?: string
): SubjectItem {
  return {
    id,
    name,
    area,
    tier,
    scaling,
    recommendedForMed,
    note,
    commonAssessments,
    externalWeight,
    years: "Year 11-12",
    examStyle,
  };
}

function tierMeta(tier: SubjectTier) {
  if (tier === "tier1") {
    return {
      label: "Tier 1",
      tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
      score: 1,
    };
  }
  if (tier === "tier2") {
    return {
      label: "Tier 2",
      tone: "border-sky-200 bg-sky-50 text-sky-700",
      score: 0.72,
    };
  }
  return {
    label: "Tier 3",
    tone: "border-slate-200 bg-slate-50 text-slate-600",
    score: 0.42,
  };
}

function scalingMeta(band: ScalingBand) {
  if (band === "veryHigh") {
    return {
      label: "Very High",
      tone: "border-violet-200 bg-violet-50 text-violet-700",
      score: 1,
    };
  }
  if (band === "high") {
    return {
      label: "High",
      tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
      score: 0.84,
    };
  }
  if (band === "medium") {
    return {
      label: "Medium",
      tone: "border-amber-200 bg-amber-50 text-amber-700",
      score: 0.6,
    };
  }
  return {
    label: "Low",
    tone: "border-slate-200 bg-slate-50 text-slate-600",
    score: 0.36,
  };
}

function assessmentTone(type: AssessmentType) {
  if (type === "Exam" || type === "Short Response Test") {
    return "border-slate-200 bg-slate-50 text-slate-700";
  }
  if (
    type === "Scientific Investigation" ||
    type === "Practical Report" ||
    type === "Data Analysis"
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (
    type === "Extended Response" ||
    type === "Research Investigation" ||
    type === "Major Work"
  ) {
    return "border-violet-200 bg-violet-50 text-violet-700";
  }
  return "border-sky-200 bg-sky-50 text-sky-700";
}

const COMMON_MED_ASSESSMENTS: AssessmentType[] = [
  "Exam",
  "Scientific Investigation",
  "Data Analysis",
  "Practical Report",
];

const QCE_SUBJECTS: SubjectItem[] = [
  createSubject(
    "qce-english",
    "English",
    "English",
    "tier2",
    "medium",
    true,
    ["Exam", "Extended Response", "Oral Presentation"],
    "Core literacy anchor.",
    25,
    "3 internals + 1 external"
  ),
  createSubject(
    "qce-literature",
    "Literature",
    "English",
    "tier2",
    "medium",
    false,
    ["Extended Response", "Exam", "Oral Presentation"]
  ),
  createSubject(
    "qce-methods",
    "Mathematical Methods",
    "Mathematics",
    "tier1",
    "high",
    true,
    ["Modelling Task", "Exam", "Short Response Test"],
    "Best all-round med maths.",
    50,
    "Mixed internal + external"
  ),
  createSubject(
    "qce-spec",
    "Specialist Mathematics",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Modelling Task", "Exam", "Short Response Test"],
    "Excellent scaler if genuinely strong.",
    50
  ),
  createSubject(
    "qce-general-maths",
    "General Mathematics",
    "Mathematics",
    "tier3",
    "low",
    false,
    ["Modelling Task", "Exam", "Short Response Test"]
  ),
  createSubject(
    "qce-chem",
    "Chemistry",
    "Science",
    "tier1",
    "high",
    true,
    ["Data Analysis", "Scientific Investigation", "Exam", "Practical Report"],
    "Strong med anchor.",
    50
  ),
  createSubject(
    "qce-bio",
    "Biology",
    "Science",
    "tier2",
    "medium",
    true,
    ["Data Analysis", "Scientific Investigation", "Exam", "Practical Report"],
    "Helpful for med context.",
    50
  ),
  createSubject(
    "qce-physics",
    "Physics",
    "Science",
    "tier1",
    "high",
    false,
    ["Data Analysis", "Scientific Investigation", "Exam", "Practical Report"],
    "Great complement to methods and chem.",
    50
  ),
  createSubject(
    "qce-psych",
    "Psychology",
    "Science",
    "tier3",
    "low",
    false,
    ["Data Analysis", "Research Investigation", "Exam"]
  ),
  createSubject(
    "qce-engineering",
    "Engineering",
    "Technologies",
    "tier1",
    "veryHigh",
    false,
    ["Design Project", "Exam", "Problem Solving"],
    "School delivery quality matters a lot.",
    50
  ),
  createSubject(
    "qce-digital",
    "Digital Solutions",
    "Technologies",
    "tier2",
    "medium",
    false,
    ["Design Project", "Exam", "Portfolio"]
  ),
  createSubject(
    "qce-economics",
    "Economics",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Research Investigation", "Exam"]
  ),
  createSubject(
    "qce-legal",
    "Legal Studies",
    "Humanities",
    "tier3",
    "low",
    false,
    ["Extended Response", "Research Investigation", "Exam"]
  ),
  createSubject(
    "qce-modern-history",
    "Modern History",
    "Humanities",
    "tier3",
    "low",
    false,
    ["Extended Response", "Research Investigation", "Exam"]
  ),
  createSubject(
    "qce-french",
    "French",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    "Classic strong-scaling language if already proficient."
  ),
  createSubject(
    "qce-japanese",
    "Japanese",
    "Languages",
    "tier1",
    "high",
    false,
    ["Exam", "Oral Presentation", "Extended Response"]
  ),
  createSubject(
    "qce-chinese",
    "Chinese",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"]
  ),
];

const VCE_SUBJECTS: SubjectItem[] = [
  createSubject(
    "vce-english",
    "English",
    "English",
    "tier2",
    "medium",
    true,
    ["Extended Response", "Oral Presentation", "Exam"],
    "Core compulsory English pathway.",
    50
  ),
  createSubject(
    "vce-englang",
    "English Language",
    "English",
    "tier2",
    "high",
    false,
    ["Extended Response", "Short Response Test", "Exam"],
    "Great for students who think analytically about language.",
    50
  ),
  createSubject(
    "vce-literature",
    "Literature",
    "English",
    "tier2",
    "medium",
    false,
    ["Extended Response", "Oral Presentation", "Exam"],
    "",
    50
  ),
  createSubject(
    "vce-general",
    "General Mathematics",
    "Mathematics",
    "tier3",
    "low",
    false,
    ["Modelling Task", "Short Response Test", "Exam"],
    "",
    50
  ),
  createSubject(
    "vce-methods",
    "Mathematical Methods",
    "Mathematics",
    "tier1",
    "high",
    true,
    ["Modelling Task", "Short Response Test", "Exam"],
    "Strong med maths anchor.",
    50
  ),
  createSubject(
    "vce-spec",
    "Specialist Mathematics",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Modelling Task", "Short Response Test", "Exam"],
    "Very strong scaler when executed well.",
    50
  ),
  createSubject(
    "vce-chem",
    "Chemistry",
    "Science",
    "tier1",
    "high",
    true,
    ["Scientific Investigation", "Practical Report", "Data Analysis", "Exam"],
    "",
    50
  ),
  createSubject(
    "vce-bio",
    "Biology",
    "Science",
    "tier2",
    "medium",
    true,
    ["Scientific Investigation", "Practical Report", "Data Analysis", "Exam"],
    "",
    50
  ),
  createSubject(
    "vce-physics",
    "Physics",
    "Science",
    "tier1",
    "high",
    false,
    ["Scientific Investigation", "Practical Report", "Data Analysis", "Exam"],
    "",
    50
  ),
  createSubject(
    "vce-psych",
    "Psychology",
    "Science",
    "tier3",
    "medium",
    false,
    ["Research Investigation", "Data Analysis", "Exam"],
    "",
    50
  ),
  createSubject(
    "vce-economics",
    "Economics",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Data Analysis", "Exam"],
    "",
    50
  ),
  createSubject(
    "vce-history",
    "History Revolutions",
    "Humanities",
    "tier3",
    "low",
    false,
    ["Extended Response", "Research Investigation", "Exam"],
    "",
    50
  ),
  createSubject(
    "vce-global",
    "Global Politics",
    "Humanities",
    "tier2",
    "medium",
    false,
    ["Extended Response", "Research Investigation", "Exam"],
    "",
    50
  ),
  createSubject(
    "vce-systems",
    "Systems Engineering",
    "Technologies",
    "tier2",
    "high",
    false,
    ["Design Project", "Portfolio", "Exam"],
    "",
    50
  ),
  createSubject(
    "vce-software",
    "Software Development",
    "Technologies",
    "tier2",
    "medium",
    false,
    ["Design Project", "Portfolio", "Exam"],
    "",
    50
  ),
  createSubject(
    "vce-french",
    "French",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    "",
    50
  ),
  createSubject(
    "vce-latin",
    "Latin",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Extended Response"],
    "",
    50
  ),
];

const HSC_SUBJECTS: SubjectItem[] = [
  createSubject(
    "hsc-english-std",
    "English Standard",
    "English",
    "tier3",
    "low",
    false,
    ["Extended Response", "Oral Presentation", "Exam"],
    "",
    50
  ),
  createSubject(
    "hsc-english-adv",
    "English Advanced",
    "English",
    "tier2",
    "medium",
    true,
    ["Extended Response", "Oral Presentation", "Exam"],
    "Safer med-facing English option.",
    50
  ),
  createSubject(
    "hsc-english-ext1",
    "English Extension 1",
    "English",
    "tier2",
    "high",
    false,
    ["Extended Response", "Major Work", "Exam"],
    "",
    50
  ),
  createSubject(
    "hsc-maths-adv",
    "Mathematics Advanced",
    "Mathematics",
    "tier1",
    "high",
    true,
    ["Short Response Test", "Modelling Task", "Exam"],
    "",
    50
  ),
  createSubject(
    "hsc-maths-ext1",
    "Mathematics Extension 1",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Short Response Test", "Modelling Task", "Exam"],
    "",
    50
  ),
  createSubject(
    "hsc-maths-ext2",
    "Mathematics Extension 2",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Short Response Test", "Modelling Task", "Exam"],
    "",
    50
  ),
  createSubject(
    "hsc-chem",
    "Chemistry",
    "Science",
    "tier1",
    "high",
    true,
    ["Scientific Investigation", "Data Analysis", "Exam"],
    "",
    50
  ),
  createSubject(
    "hsc-bio",
    "Biology",
    "Science",
    "tier2",
    "medium",
    true,
    ["Scientific Investigation", "Data Analysis", "Exam"],
    "",
    50
  ),
  createSubject(
    "hsc-physics",
    "Physics",
    "Science",
    "tier1",
    "high",
    false,
    ["Scientific Investigation", "Data Analysis", "Exam"],
    "",
    50
  ),
  createSubject(
    "hsc-science-ext",
    "Science Extension",
    "Science",
    "tier2",
    "high",
    false,
    ["Research Investigation", "Major Work", "Exam"],
    "",
    50
  ),
  createSubject(
    "hsc-economics",
    "Economics",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Data Analysis", "Exam"],
    "",
    50
  ),
  createSubject(
    "hsc-legal",
    "Legal Studies",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Research Investigation", "Exam"],
    "",
    50
  ),
  createSubject(
    "hsc-modern-history",
    "Modern History",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Research Investigation", "Exam"],
    "",
    50
  ),
  createSubject(
    "hsc-society",
    "Society and Culture",
    "Humanities",
    "tier2",
    "medium",
    false,
    ["Research Investigation", "Extended Response", "Exam"],
    "",
    50
  ),
  createSubject(
    "hsc-business",
    "Business Studies",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Data Analysis", "Exam"],
    "",
    50
  ),
  createSubject(
    "hsc-french",
    "French Continuers",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    "",
    50
  ),
  createSubject(
    "hsc-latin",
    "Latin Continuers",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Extended Response"],
    "",
    50
  ),
];

const WACE_SUBJECTS: SubjectItem[] = [
  createSubject(
    "wace-english",
    "English ATAR",
    "English",
    "tier2",
    "medium",
    true,
    ["Extended Response", "Oral Presentation", "Exam"],
    "",
    50
  ),
  createSubject(
    "wace-lit",
    "Literature ATAR",
    "English",
    "tier2",
    "medium",
    false,
    ["Extended Response", "Oral Presentation", "Exam"],
    "",
    50
  ),
  createSubject(
    "wace-apps",
    "Mathematics Applications ATAR",
    "Mathematics",
    "tier3",
    "low",
    false,
    ["Modelling Task", "Short Response Test", "Exam"],
    "",
    50
  ),
  createSubject(
    "wace-methods",
    "Mathematics Methods ATAR",
    "Mathematics",
    "tier1",
    "high",
    true,
    ["Modelling Task", "Short Response Test", "Exam"],
    "",
    50
  ),
  createSubject(
    "wace-spec",
    "Mathematics Specialist ATAR",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Modelling Task", "Short Response Test", "Exam"],
    "",
    50
  ),
  createSubject(
    "wace-chem",
    "Chemistry ATAR",
    "Science",
    "tier1",
    "high",
    true,
    ["Scientific Investigation", "Practical Report", "Exam"],
    "",
    50
  ),
  createSubject(
    "wace-human-bio",
    "Human Biology ATAR",
    "Science",
    "tier2",
    "medium",
    true,
    ["Scientific Investigation", "Data Analysis", "Exam"],
    "",
    50
  ),
  createSubject(
    "wace-physics",
    "Physics ATAR",
    "Science",
    "tier1",
    "high",
    false,
    ["Scientific Investigation", "Practical Report", "Exam"],
    "",
    50
  ),
  createSubject(
    "wace-econ",
    "Economics ATAR",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Data Analysis", "Exam"],
    "",
    50
  ),
  createSubject(
    "wace-modern-history",
    "Modern History ATAR",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Research Investigation", "Exam"],
    "",
    50
  ),
  createSubject(
    "wace-politics-law",
    "Politics and Law ATAR",
    "Humanities",
    "tier2",
    "medium",
    false,
    ["Extended Response", "Research Investigation", "Exam"],
    "",
    50
  ),
  createSubject(
    "wace-french",
    "French ATAR",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    "",
    50
  ),
  createSubject(
    "wace-japanese",
    "Japanese ATAR",
    "Languages",
    "tier1",
    "high",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    "",
    50
  ),
  createSubject(
    "wace-pe",
    "Physical Education Studies ATAR",
    "Health",
    "tier3",
    "low",
    false,
    ["Performance", "Extended Response", "Exam"],
    "",
    50
  ),
];

const ACT_SUBJECTS: SubjectItem[] = [
  createSubject(
    "act-english",
    "English T",
    "English",
    "tier2",
    "medium",
    true,
    ["Extended Response", "Oral Presentation", "Research Investigation"],
    "School-based backbone subject.",
    0,
    "School-based with scaling context"
  ),
  createSubject(
    "act-literature",
    "Literature T",
    "English",
    "tier2",
    "medium",
    false,
    ["Extended Response", "Oral Presentation", "Research Investigation"],
    "",
    0
  ),
  createSubject(
    "act-methods",
    "Mathematical Methods T",
    "Mathematics",
    "tier1",
    "high",
    true,
    ["Modelling Task", "Short Response Test", "Research Investigation"],
    "",
    0
  ),
  createSubject(
    "act-spec",
    "Specialist Mathematics T",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Modelling Task", "Short Response Test", "Research Investigation"],
    "",
    0
  ),
  createSubject(
    "act-chem",
    "Chemistry T",
    "Science",
    "tier1",
    "high",
    true,
    ["Scientific Investigation", "Practical Report", "Data Analysis"],
    "",
    0
  ),
  createSubject(
    "act-bio",
    "Biology T",
    "Science",
    "tier2",
    "medium",
    true,
    ["Scientific Investigation", "Practical Report", "Data Analysis"],
    "",
    0
  ),
  createSubject(
    "act-physics",
    "Physics T",
    "Science",
    "tier1",
    "high",
    false,
    ["Scientific Investigation", "Practical Report", "Data Analysis"],
    "",
    0
  ),
  createSubject(
    "act-econ",
    "Economics T",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Data Analysis", "Research Investigation"],
    "",
    0
  ),
  createSubject(
    "act-history",
    "History T",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Research Investigation", "Oral Presentation"],
    "",
    0
  ),
  createSubject(
    "act-digital",
    "Digital Technologies T",
    "Technologies",
    "tier2",
    "medium",
    false,
    ["Design Project", "Portfolio", "Research Investigation"],
    "",
    0
  ),
  createSubject(
    "act-french",
    "French T",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    "",
    0
  ),
];

const TCE_SUBJECTS: SubjectItem[] = [
  createSubject(
    "tce-english",
    "English Level 3",
    "English",
    "tier2",
    "medium",
    true,
    ["Extended Response", "Oral Presentation", "Exam"],
    "",
    40
  ),
  createSubject(
    "tce-literature",
    "English Literature Level 3",
    "English",
    "tier2",
    "medium",
    false,
    ["Extended Response", "Oral Presentation", "Exam"],
    "",
    40
  ),
  createSubject(
    "tce-methods",
    "Mathematics Methods Foundation Level 4",
    "Mathematics",
    "tier1",
    "high",
    true,
    ["Modelling Task", "Short Response Test", "Exam"],
    "",
    40
  ),
  createSubject(
    "tce-spec",
    "Specialist Mathematics Level 4",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Modelling Task", "Short Response Test", "Exam"],
    "",
    40
  ),
  createSubject(
    "tce-chem",
    "Chemistry Level 3",
    "Science",
    "tier1",
    "high",
    true,
    ["Scientific Investigation", "Practical Report", "Exam"],
    "",
    40
  ),
  createSubject(
    "tce-bio",
    "Biology Level 3",
    "Science",
    "tier2",
    "medium",
    true,
    ["Scientific Investigation", "Practical Report", "Exam"],
    "",
    40
  ),
  createSubject(
    "tce-physics",
    "Physics Level 4",
    "Science",
    "tier1",
    "high",
    false,
    ["Scientific Investigation", "Practical Report", "Exam"],
    "",
    40
  ),
  createSubject(
    "tce-history",
    "History Level 3",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Research Investigation", "Exam"],
    "",
    40
  ),
  createSubject(
    "tce-econ",
    "Economics Level 3",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Data Analysis", "Exam"],
    "",
    40
  ),
  createSubject(
    "tce-french",
    "French Level 3",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    "",
    40
  ),
];

const SACE_SUBJECTS: SubjectItem[] = [
  createSubject(
    "sace-english",
    "English",
    "English",
    "tier2",
    "medium",
    true,
    ["Extended Response", "Oral Presentation", "Exam"],
    "",
    30
  ),
  createSubject(
    "sace-literary",
    "English Literary Studies",
    "English",
    "tier2",
    "medium",
    false,
    ["Extended Response", "Oral Presentation", "Exam"],
    "",
    30
  ),
  createSubject(
    "sace-methods",
    "Mathematical Methods",
    "Mathematics",
    "tier1",
    "high",
    true,
    ["Modelling Task", "Short Response Test", "Exam"],
    "",
    30
  ),
  createSubject(
    "sace-spec",
    "Specialist Mathematics",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Modelling Task", "Short Response Test", "Exam"],
    "",
    30
  ),
  createSubject(
    "sace-chem",
    "Chemistry",
    "Science",
    "tier1",
    "high",
    true,
    ["Scientific Investigation", "Practical Report", "Exam"],
    "",
    30
  ),
  createSubject(
    "sace-bio",
    "Biology",
    "Science",
    "tier2",
    "medium",
    true,
    ["Scientific Investigation", "Practical Report", "Exam"],
    "",
    30
  ),
  createSubject(
    "sace-physics",
    "Physics",
    "Science",
    "tier1",
    "high",
    false,
    ["Scientific Investigation", "Practical Report", "Exam"],
    "",
    30
  ),
  createSubject(
    "sace-economics",
    "Economics",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Data Analysis", "Exam"],
    "",
    30
  ),
  createSubject(
    "sace-history",
    "Modern History",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Research Investigation", "Exam"],
    "",
    30
  ),
  createSubject(
    "sace-research",
    "Research Project",
    "Cross-disciplinary",
    "tier2",
    "medium",
    false,
    ["Research Investigation", "Oral Presentation", "Portfolio"],
    "",
    0
  ),
  createSubject(
    "sace-french",
    "French",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    "",
    30
  ),
];

const NTCET_SUBJECTS: SubjectItem[] = [
  createSubject(
    "ntcet-english",
    "English",
    "English",
    "tier2",
    "medium",
    true,
    ["Extended Response", "Oral Presentation", "Exam"],
    "",
    30
  ),
  createSubject(
    "ntcet-methods",
    "Mathematical Methods",
    "Mathematics",
    "tier1",
    "high",
    true,
    ["Modelling Task", "Short Response Test", "Exam"],
    "",
    30
  ),
  createSubject(
    "ntcet-spec",
    "Specialist Mathematics",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Modelling Task", "Short Response Test", "Exam"],
    "",
    30
  ),
  createSubject(
    "ntcet-chem",
    "Chemistry",
    "Science",
    "tier1",
    "high",
    true,
    ["Scientific Investigation", "Practical Report", "Exam"],
    "",
    30
  ),
  createSubject(
    "ntcet-bio",
    "Biology",
    "Science",
    "tier2",
    "medium",
    true,
    ["Scientific Investigation", "Practical Report", "Exam"],
    "",
    30
  ),
  createSubject(
    "ntcet-physics",
    "Physics",
    "Science",
    "tier1",
    "high",
    false,
    ["Scientific Investigation", "Practical Report", "Exam"],
    "",
    30
  ),
  createSubject(
    "ntcet-economics",
    "Economics",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Data Analysis", "Exam"],
    "",
    30
  ),
  createSubject(
    "ntcet-history",
    "Modern History",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Research Investigation", "Exam"],
    "",
    30
  ),
  createSubject(
    "ntcet-research",
    "Research Project",
    "Cross-disciplinary",
    "tier2",
    "medium",
    false,
    ["Research Investigation", "Oral Presentation", "Portfolio"],
    "",
    0
  ),
  createSubject(
    "ntcet-french",
    "French",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    "",
    30
  ),
];

const JURISDICTIONS: Record<JurisdictionKey, JurisdictionConfig> = {
  qce: {
    key: "qce",
    label: "Queensland (QCE)",
    certificate: "Queensland Certificate of Education",
    admissionsBody: "QTAC",
    shortAssessment:
      "General subjects usually blend internal assessments with an external assessment. Maths and science subjects often feel more exam-sensitive than students first assume.",
    assessmentBullets: [
      "Track internals and externals separately instead of treating the subject as one blur.",
      "Rigorous maths and science usually matter more for med posture than safe-but-flat subject stacks.",
      "The best strategy is strong execution plus good subject architecture.",
    ],
    scalingBullets: [
      "Methods, Specialist, Chemistry and Physics are the cleanest academic spine.",
      "French, Chinese and certain rigorous subjects can become huge upside when genuine strength exists.",
      "Engineering can be excellent, but school delivery quality matters.",
    ],
    medicineBullets: [
      "Chemistry is the strongest science anchor for future flexibility.",
      "Methods is usually the safest maths choice for medicine-facing students.",
      "Biology helps, but should not replace stronger maths when your ceiling is high.",
    ],
    localPrograms: ["UQ", "Griffith", "Bond", "JCU"],
    examWeightingDefault: 25,
    internalModelHint:
      "Prioritise IA stability first. Then use externals as a force multiplier rather than a rescue fantasy.",
    externalModelHint:
      "Some subjects are more external-sensitive than others. Use subject-level exam weight where possible instead of one generic assumption.",
    subjectSelectionHint:
      "Build around chemistry plus a real maths spine, then add biology, physics, language strength or another rigorous complement.",
    subjects: QCE_SUBJECTS,
  },
  vce: {
    key: "vce",
    label: "Victoria (VCE)",
    certificate: "Victorian Certificate of Education",
    admissionsBody: "VTAC",
    shortAssessment:
      "VCE rewards sustained school performance and strong exam execution. SAC drift matters more than many students realise.",
    assessmentBullets: [
      "One volatile SAC-heavy subject can drag a profile more than expected.",
      "A stronger raw score in the right course often beats weak execution in a better scaler.",
      "Track subject stability, not just motivation.",
    ],
    scalingBullets: [
      "Methods and Specialist remain premium ATAR builders.",
      "Chemistry and Physics are reliable med-facing supports.",
      "High-level languages can create genuine upside.",
    ],
    medicineBullets: [
      "Chemistry plus at least one strong maths is the safest posture.",
      "English choice matters because an English pathway is compulsory.",
      "Biology is useful, but not always the best marginal gain subject.",
    ],
    localPrograms: ["Melbourne", "Monash", "Deakin", "La Trobe"],
    examWeightingDefault: 40,
    internalModelHint:
      "Use the internals tab to spot whether your SACs are drifting or whether one subject is sabotaging overall consistency.",
    externalModelHint:
      "Model exam outcomes above and below SAC trend. That is where a lot of VCE volatility lives.",
    subjectSelectionHint:
      "Avoid a pretty-looking mix that lacks enough scaling support or maths flexibility.",
    subjects: VCE_SUBJECTS,
  },
  hsc: {
    key: "hsc",
    label: "New South Wales (HSC)",
    certificate: "Higher School Certificate",
    admissionsBody: "UAC",
    shortAssessment:
      "The HSC rewards both school performance and final exam execution, but subject difficulty, rank context and extension choices all shift the picture.",
    assessmentBullets: [
      "Extension pathways can create serious upside for the right student.",
      "A strong rank profile matters, but exam execution still needs to land.",
      "Do not build a subject stack that looks intellectual but fractures your consistency.",
    ],
    scalingBullets: [
      "Maths Advanced and Extension remain major supports.",
      "Chemistry and Physics keep med posture stronger.",
      "Languages can scale hard when authentic strength exists.",
    ],
    medicineBullets: [
      "Chemistry is still the cleanest science anchor.",
      "At least one serious maths pathway keeps options open.",
      "UCAT and interview strategy still matter alongside school subjects.",
    ],
    localPrograms: ["UNSW", "Sydney", "Western Sydney", "Newcastle / JMP"],
    examWeightingDefault: 50,
    internalModelHint:
      "Track the difference between school-task form and true exam-readiness. Many HSC students confuse those.",
    externalModelHint:
      "Use conservative and optimistic exam scenarios. The final swing matters.",
    subjectSelectionHint:
      "Think in terms of aggregate quality, not just individual course prestige.",
    subjects: HSC_SUBJECTS,
  },
  wace: {
    key: "wace",
    label: "Western Australia (WACE)",
    certificate: "Western Australian Certificate of Education",
    admissionsBody: "TISC",
    shortAssessment:
      "WACE ATAR planning works best when you separate school marks from final exam readiness and stay honest about subject difficulty.",
    assessmentBullets: [
      "Course choice should support a strong ATAR ceiling, not just comfort.",
      "Methods, Specialist, Chemistry and Physics remain the cleanest med-facing spine.",
      "Exam discipline matters a lot in WA.",
    ],
    scalingBullets: [
      "Maths rigour drives a lot of upside.",
      "Languages can be strong where authentic strength exists.",
      "Applications-style safety picks usually reduce ceiling for elite ATAR chasing.",
    ],
    medicineBullets: [
      "Chemistry plus strong maths remains the safest default.",
      "UCAT still matters for most direct-entry pathways.",
      "Human Biology can help contextually, but it is not the whole strategy.",
    ],
    localPrograms: ["UWA", "Curtin", "Notre Dame WA"],
    examWeightingDefault: 50,
    internalModelHint:
      "Use internals to identify whether the real issue is mastery or just exam conversion.",
    externalModelHint:
      "The external swing can move the picture sharply, so test both downside and upside scenarios.",
    subjectSelectionHint:
      "Do not let safe course selection flatten your upside too early.",
    subjects: WACE_SUBJECTS,
  },
  act: {
    key: "act",
    label: "ACT SSC",
    certificate: "ACT Senior Secondary Certificate",
    admissionsBody: "UAC / ACT scaling",
    shortAssessment:
      "The ACT system is more school-based and scaling-aware than classic exam-heavy systems, so consistency becomes even more important.",
    assessmentBullets: [
      "School-based performance is the backbone here.",
      "Course quality and broad academic strength matter.",
      "A soft subject does not automatically protect your ceiling.",
    ],
    scalingBullets: [
      "Methods, Specialist, Chemistry and Physics still make strategic sense.",
      "Languages remain strong for the right student.",
      "Think in terms of robust all-round academic posture.",
    ],
    medicineBullets: [
      "Chemistry plus strong maths is still the safest base.",
      "Written reasoning and academic literacy still matter heavily.",
      "Use internals aggressively in this system.",
    ],
    localPrograms: ["ANU", "Canberra region pathways"],
    examWeightingDefault: 0,
    internalModelHint:
      "Treat the internals layer as the engine room, not just a side panel.",
    externalModelHint:
      "Here the externals modeller acts more like a scaling pressure proxy than a literal subject exam predictor.",
    subjectSelectionHint:
      "Prioritise consistency and genuine academic strength.",
    subjects: ACT_SUBJECTS,
  },
  tce: {
    key: "tce",
    label: "Tasmania (TCE)",
    certificate: "Tasmanian Certificate of Education",
    admissionsBody: "UTAS / interstate pathways",
    shortAssessment:
      "Course level matters. The right academic level and assessment profile are both part of the strategy.",
    assessmentBullets: [
      "Level choice matters, not just subject title.",
      "Internal and external patterns should be tracked separately.",
      "Use the subject mix to keep med options genuinely open.",
    ],
    scalingBullets: [
      "Methods and Specialist style pathways provide stronger upside.",
      "Chemistry and Physics remain strong academic supports.",
      "Languages can add upside if the base is real.",
    ],
    medicineBullets: [
      "Chemistry plus strong maths remains the best default.",
      "Biology helps, but balance matters more than sentiment.",
      "Be careful not to confuse comfortable course level with competitive course level.",
    ],
    localPrograms: ["UTAS", "Interstate pathways"],
    examWeightingDefault: 40,
    internalModelHint:
      "Use internals to monitor consistency across levelled courses.",
    externalModelHint:
      "Some externals are exam-like, others are less straightforward. Model with care.",
    subjectSelectionHint:
      "Optimise for academic strength, not just convenience.",
    subjects: TCE_SUBJECTS,
  },
  ntcet: {
    key: "ntcet",
    label: "Northern Territory (NTCET)",
    certificate: "Northern Territory Certificate of Education and Training",
    admissionsBody: "SATAC / interstate pathways",
    shortAssessment:
      "NTCET strategy is heavily shaped by Stage 2 execution and subject architecture.",
    assessmentBullets: [
      "School assessment remains a major driver.",
      "External components still matter, but they are not the whole story.",
      "Subject strength should support both competitiveness and flexibility.",
    ],
    scalingBullets: [
      "Methods, Specialist, Chemistry and rigorous languages remain strong.",
      "A stable Stage 2 profile matters a lot.",
      "Use the right academic backbone before adding comfort subjects.",
    ],
    medicineBullets: [
      "Chemistry and Mathematical Methods remain the safest med base.",
      "Biology helps, but should not flatten overall rigour.",
      "Track both the school-assessment backbone and external pressure points.",
    ],
    localPrograms: ["Flinders NT pathways", "Interstate SATAC pathways"],
    examWeightingDefault: 30,
    internalModelHint:
      "Track Stage 2 performance very hard. That is where your real story lives.",
    externalModelHint:
      "The external component matters, but not enough to rescue weak school performance.",
    subjectSelectionHint: "Build a clean Stage 2 backbone first.",
    subjects: NTCET_SUBJECTS,
  },
  sace: {
    key: "sace",
    label: "South Australia (SACE)",
    certificate: "South Australian Certificate of Education",
    admissionsBody: "SATAC",
    shortAssessment:
      "SACE strategy works best when you respect school assessment as the bigger lever and treat externals as an amplifier.",
    assessmentBullets: [
      "Stable school assessment matters more than students often think.",
      "External tasks still matter, especially in exam-facing subjects.",
      "Research Project style subjects add a different flavour to the mix.",
    ],
    scalingBullets: [
      "Methods, Specialist, Chemistry and Physics remain the strongest med-facing posture.",
      "Languages can become strong upside when genuine.",
      "A 30% external still matters, but it does not erase weak school performance.",
    ],
    medicineBullets: [
      "Chemistry and Methods remain the cleanest core.",
      "Biology helps, but should complement rather than replace rigour.",
      "Think in terms of Stage 2 posture, not just subject preference.",
    ],
    localPrograms: ["Adelaide", "Flinders"],
    examWeightingDefault: 30,
    internalModelHint:
      "School assessment is usually the bigger lever. Treat it that way.",
    externalModelHint:
      "Use the externals modeller to test sensitivity, not fantasy rescues.",
    subjectSelectionHint:
      "Choose a Stage 2 stack that keeps ceiling and flexibility high.",
    subjects: SACE_SUBJECTS,
  },
};

function computeStateEngine(config: JurisdictionConfig, selectedIds: string[]) {
  const chosen = config.subjects.filter((subject) => selectedIds.includes(subject.id));
  const tier1Count = chosen.filter((subject) => subject.tier === "tier1").length;
  const medAnchors = chosen.filter((subject) => subject.recommendedForMed).length;
  const scalingAdvantage = average(
    chosen.map((subject) => scalingMeta(subject.scaling).score)
  );
  const scienceCount = chosen.filter((subject) => subject.area === "Science").length;
  const mathsCount = chosen.filter((subject) => subject.area === "Mathematics").length;
  const languageCount = chosen.filter((subject) => subject.area === "Languages").length;
  const academicSpread = new Set(chosen.map((subject) => subject.area)).size;

  const readiness =
    chosen.length === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            tier1Count * 16 +
              medAnchors * 12 +
              scalingAdvantage * 28 +
              scienceCount * 6 +
              mathsCount * 10 +
              Math.min(languageCount, 1) * 5 +
              academicSpread * 2
          )
        );

  const chemistrySelected = chosen.some((subject) =>
    subject.name.toLowerCase().includes("chem")
  );
  const methodsLikeSelected = chosen.some(
    (subject) =>
      subject.name.toLowerCase().includes("methods") ||
      subject.name.toLowerCase().includes("advanced") ||
      subject.name.toLowerCase().includes("specialist") ||
      subject.name.toLowerCase().includes("extension")
  );

  let posture = "Thin";
  let postureTone = "border-rose-200 bg-rose-50 text-rose-950";

  if (readiness >= 78) {
    posture = "Competitive Foundation";
    postureTone = "border-emerald-200 bg-emerald-50 text-emerald-950";
  } else if (readiness >= 58) {
    posture = "Promising but Incomplete";
    postureTone = "border-amber-200 bg-amber-50 text-amber-950";
  }

  const pressurePoint =
    !chemistrySelected
      ? "Your current mix is missing chemistry, which usually weakens med flexibility."
      : !methodsLikeSelected
        ? "Your current mix lacks a serious maths spine. That can narrow options and flatten upside."
        : chosen.length < 5
          ? "Your mix still looks under-built. Add the rest of the stack before trusting the read."
          : "The next gains come from execution quality, not just collecting more hard subjects.";

  return {
    chosen,
    tier1Count,
    medAnchors,
    scienceCount,
    mathsCount,
    scalingAdvantagePercent: Math.round(scalingAdvantage * 100),
    readiness,
    posture,
    postureTone,
    chemistrySelected,
    methodsLikeSelected,
    pressurePoint,
  };
}

function computeInternals(rows: InternalRow[], subjects: SubjectItem[]) {
  const valid = rows.filter((row) => row.subjectId.trim());

  const items = valid.map((row) => {
    const subject = subjects.find((item) => item.id === row.subjectId);
    const assessments = [
      asNumber(row.task1),
      asNumber(row.task2),
      asNumber(row.task3),
      asNumber(row.task4),
    ].filter((n) => n > 0);
    const avg = average(assessments);
    const spread =
      assessments.length > 1 ? Math.max(...assessments) - Math.min(...assessments) : 0;
    const weighting = asNumber(row.weighting) || 20;
    const weightedImpact = avg * (weighting / 100);

    return {
      ...row,
      subjectName: subject?.name ?? "Unknown",
      avg,
      spread,
      weighting,
      weightedImpact,
      subject,
    };
  });

  const mostVolatile = [...items].sort((a, b) => b.spread - a.spread)[0] || null;
  const highestImpact = [...items].sort((a, b) => b.weightedImpact - a.weightedImpact)[0] || null;
  const weakestAverage = [...items].sort((a, b) => a.avg - b.avg)[0] || null;
  const stableCore = [...items].filter((item) => item.avg >= 85 && item.spread <= 6);
  const overallAverage = items.length ? average(items.map((item) => item.avg)) : 0;

  return {
    items,
    mostVolatile,
    highestImpact,
    weakestAverage,
    stableCore,
    overallAverage: Number(overallAverage.toFixed(1)),
  };
}

function computeExternalModel(
  internalAvg: number,
  externalExam: number,
  examWeight: number
) {
  const internalWeight = 100 - examWeight;
  const total =
    internalAvg * (internalWeight / 100) + externalExam * (examWeight / 100);
  const drop5 =
    internalAvg * (internalWeight / 100) +
    Math.max(0, externalExam - 5) * (examWeight / 100);
  const gain5 =
    internalAvg * (internalWeight / 100) +
    Math.min(100, externalExam + 5) * (examWeight / 100);
  const drop10 =
    internalAvg * (internalWeight / 100) +
    Math.max(0, externalExam - 10) * (examWeight / 100);
  const gain10 =
    internalAvg * (internalWeight / 100) +
    Math.min(100, externalExam + 10) * (examWeight / 100);

  return {
    total: Number(total.toFixed(1)),
    drop5: Number(drop5.toFixed(1)),
    gain5: Number(gain5.toFixed(1)),
    drop10: Number(drop10.toFixed(1)),
    gain10: Number(gain10.toFixed(1)),
    deltaDown5: Number((total - drop5).toFixed(1)),
    deltaUp5: Number((gain5 - total).toFixed(1)),
    deltaDown10: Number((total - drop10).toFixed(1)),
    deltaUp10: Number((gain10 - total).toFixed(1)),
  };
}
function Pill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        className
      )}
    >
      {children}
    </span>
  );
}

function SoftCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-3xl border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  eyebrow,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
          {title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{body}</p>
      </div>
    </div>
  );
}

function FeatureGate({
  locked,
  title,
  description,
  ctaHref,
  ctaLabel,
  previewLabel,
  children,
}: {
  locked: boolean;
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  previewLabel: string;
  children: ReactNode;
}) {
  return (
    <section className="relative">
      <div
        className={cx(
          "transition",
          locked ? "pointer-events-none select-none blur-md opacity-35" : ""
        )}
      >
        {children}
      </div>

      {locked ? (
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl">
            <Lock className="mx-auto mb-3 h-6 w-6 text-slate-700" />
            <p className="text-xs uppercase tracking-widest text-slate-500">
              {previewLabel}
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{description}</p>

            <Link
              href={ctaHref}
              className="mt-4 inline-block rounded-xl bg-black px-4 py-2 text-white"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default function StudyEngineClient({
  isPremium,
}: {
  isPremium: boolean;
}) {
  const [activeTab, setActiveTab] = useState<EngineTab>("overview");
  const [jurisdiction, setJurisdiction] = useState<JurisdictionKey>("qce");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [internalRows, setInternalRows] = useState<InternalRow[]>([
    {
      id: createId(),
      subjectId: "",
      task1: "",
      task2: "",
      task3: "",
      task4: "",
      weighting: "20",
      rank: "",
    },
  ]);
  const [externalInternalAverage, setExternalInternalAverage] = useState("85");
  const [externalExamScore, setExternalExamScore] = useState("85");
  const [examWeight, setExamWeight] = useState("25");

  const [subjectSearch, setSubjectSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState<"all" | SubjectArea>("all");
  const [scalingFilter, setScalingFilter] = useState<"all" | ScalingBand>("all");
  const [recommendedOnly, setRecommendedOnly] = useState(false);
  const [subjectSort, setSubjectSort] = useState<SubjectSortKey>("recommended");
  const [selectedLibrarySubjectId, setSelectedLibrarySubjectId] =
    useState<string>("");

  const config = JURISDICTIONS[jurisdiction];

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (parsed.jurisdiction) setJurisdiction(parsed.jurisdiction);
      if (Array.isArray(parsed.selectedSubjects)) {
        setSelectedSubjects(parsed.selectedSubjects);
      }
      if (Array.isArray(parsed.internalRows) && parsed.internalRows.length) {
        setInternalRows(parsed.internalRows);
      }
      if (parsed.externalInternalAverage) {
        setExternalInternalAverage(parsed.externalInternalAverage);
      }
      if (parsed.externalExamScore) {
        setExternalExamScore(parsed.externalExamScore);
      }
      if (parsed.examWeight) setExamWeight(parsed.examWeight);
      if (parsed.subjectSearch) setSubjectSearch(parsed.subjectSearch);
      if (parsed.areaFilter) setAreaFilter(parsed.areaFilter);
      if (parsed.scalingFilter) setScalingFilter(parsed.scalingFilter);
      if (typeof parsed.recommendedOnly === "boolean") {
        setRecommendedOnly(parsed.recommendedOnly);
      }
      if (parsed.subjectSort) setSubjectSort(parsed.subjectSort);
      if (parsed.selectedLibrarySubjectId) {
        setSelectedLibrarySubjectId(parsed.selectedLibrarySubjectId);
      }
    } catch {}
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        jurisdiction,
        selectedSubjects,
        internalRows,
        externalInternalAverage,
        externalExamScore,
        examWeight,
        subjectSearch,
        areaFilter,
        scalingFilter,
        recommendedOnly,
        subjectSort,
        selectedLibrarySubjectId,
      })
    );
  }, [
    jurisdiction,
    selectedSubjects,
    internalRows,
    externalInternalAverage,
    externalExamScore,
    examWeight,
    subjectSearch,
    areaFilter,
    scalingFilter,
    recommendedOnly,
    subjectSort,
    selectedLibrarySubjectId,
  ]);

  useEffect(() => {
    setSelectedSubjects([]);
    setSelectedLibrarySubjectId("");
    setExamWeight(String(config.examWeightingDefault));
    setInternalRows([
      {
        id: createId(),
        subjectId: "",
        task1: "",
        task2: "",
        task3: "",
        task4: "",
        weighting: "20",
        rank: "",
      },
    ]);
  }, [jurisdiction, config.examWeightingDefault]);

  const selectedLibrarySubject =
    config.subjects.find((subject) => subject.id === selectedLibrarySubjectId) ||
    config.subjects[0];

  const filteredSubjects = useMemo(() => {
    const searched = config.subjects.filter((subject) => {
      const matchesSearch =
        !subjectSearch.trim() ||
        subject.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
        subject.area.toLowerCase().includes(subjectSearch.toLowerCase()) ||
        (subject.note ?? "").toLowerCase().includes(subjectSearch.toLowerCase());

      const matchesArea = areaFilter === "all" ? true : subject.area === areaFilter;
      const matchesScaling =
        scalingFilter === "all" ? true : subject.scaling === scalingFilter;
      const matchesRecommended = recommendedOnly ? subject.recommendedForMed : true;

      return (
        matchesSearch &&
        matchesArea &&
        matchesScaling &&
        matchesRecommended
      );
    });

    return [...searched].sort((a, b) => {
      if (subjectSort === "name") return a.name.localeCompare(b.name);
      if (subjectSort === "tier") {
        return tierMeta(b.tier).score - tierMeta(a.tier).score;
      }
      if (subjectSort === "scaling") {
        return scalingMeta(b.scaling).score - scalingMeta(a.scaling).score;
      }
      return Number(Boolean(b.recommendedForMed)) - Number(Boolean(a.recommendedForMed));
    });
  }, [
    config.subjects,
    subjectSearch,
    areaFilter,
    scalingFilter,
    recommendedOnly,
    subjectSort,
  ]);

  const stateEngine = useMemo(
    () => computeStateEngine(config, selectedSubjects),
    [config, selectedSubjects]
  );

  const internalDiagnostics = useMemo(
    () => computeInternals(internalRows, config.subjects),
    [internalRows, config.subjects]
  );

  const externalModel = useMemo(
    () =>
      computeExternalModel(
        asNumber(externalInternalAverage),
        asNumber(externalExamScore),
        asNumber(examWeight)
      ),
    [externalInternalAverage, externalExamScore, examWeight]
  );

  const areaOptions: Array<"all" | SubjectArea> = [
    "all",
    "English",
    "Mathematics",
    "Science",
    "Humanities",
    "Languages",
    "Technologies",
    "Arts",
    "Health",
    "Cross-disciplinary",
  ];

  const toggleSubject = (id: string) => {
    setSelectedSubjects((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id]
    );
  };

  const updateRow = (id: string, field: keyof InternalRow, value: string) => {
    setInternalRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const addInternalRow = () => {
    setInternalRows((current) => [
      ...current,
      {
        id: createId(),
        subjectId: "",
        task1: "",
        task2: "",
        task3: "",
        task4: "",
        weighting: "20",
        rank: "",
      },
    ]);
  };

  const removeInternalRow = (id: string) => {
    setInternalRows((current) =>
      current.length === 1 ? current : current.filter((row) => row.id !== id)
    );
  };

  return (
    <FeatureGate
      locked={!isPremium}
      title="Upgrade to unlock Study Engine"
      description="Access the full subject strategy engine, internals tracker, and external exam sensitivity tools."
      ctaHref="/info/pricing"
      ctaLabel="Upgrade to Pro"
      previewLabel="Study Engine"
    >
      <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50 text-slate-900">
        <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Pill className="border-slate-200 bg-white text-slate-700">
              Study Engine
            </Pill>
            <Pill className="border-violet-200 bg-violet-50 text-violet-700">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Subject strategy, internals and exam sensitivity
            </Pill>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-violet-500 via-sky-500 to-emerald-500" />
            <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-100 blur-3xl" />
            <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-sky-100 blur-3xl" />

            <div className="relative z-10 p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-4xl">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-sky-600 text-white shadow-lg shadow-violet-100">
                      <Activity className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                      ATAR + Subject Intelligence
                    </h1>
                  </div>
                  <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                    A cleaner strategy engine for choosing subjects, tracking
                    assessment stability, and modelling how much externals can move
                    the final picture.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <InfoStat
                    label="Subjects loaded"
                    value={String(config.subjects.length)}
                  />
                  <InfoStat
                    label="Med-relevant options"
                    value={String(
                      config.subjects.filter((s) => s.recommendedForMed).length
                    )}
                  />
                  <InfoStat
                    label="Default external"
                    value={`${config.examWeightingDefault}%`}
                  />
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-2">
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = tab.key === activeTab;

                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={cx(
                          "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                          isActive
                            ? "bg-white text-slate-950 shadow-sm"
                            : "text-slate-600 hover:bg-white hover:text-slate-900"
                        )}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Icon className="h-4 w-4" />
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                  <SoftCard className="p-6 sm:p-7">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      State / curriculum
                    </label>
                    <div className="relative">
                      <select
                        value={jurisdiction}
                        onChange={(event) =>
                          setJurisdiction(event.target.value as JurisdictionKey)
                        }
                        className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-900 outline-none transition focus:border-violet-300"
                      >
                        {Object.values(JURISDICTIONS).map((item) => (
                          <option key={item.key} value={item.key}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </SoftCard>

                  {activeTab === "overview" ? (
                    <>
                      <SoftCard className="p-6 sm:p-7">
                        <SectionTitle
                          icon={GraduationCap}
                          eyebrow="System snapshot"
                          title={`${config.label} — ${config.certificate}`}
                          body={config.shortAssessment}
                        />

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                              Assessment shape
                            </p>
                            <div className="mt-3 space-y-2">
                              {config.assessmentBullets.map((item) => (
                                <div
                                  key={item}
                                  className="flex gap-3 text-sm leading-7 text-slate-700"
                                >
                                  <span className="mt-3 h-1.5 w-1.5 rounded-full bg-violet-500" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                              Optimisation notes
                            </p>
                            <div className="mt-3 space-y-2">
                              {config.scalingBullets.map((item) => (
                                <div
                                  key={item}
                                  className="flex gap-3 text-sm leading-7 text-slate-700"
                                >
                                  <span className="mt-3 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                          <p className="text-sm font-bold text-amber-950">
                            Medicine lens
                          </p>
                          <div className="mt-2 space-y-2">
                            {config.medicineBullets.map((item) => (
                              <div
                                key={item}
                                className="flex gap-3 text-sm leading-7 text-amber-950"
                              >
                                <ArrowRight className="mt-1.5 h-4 w-4 shrink-0 text-amber-700" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </SoftCard>

                      <SoftCard className="p-6 sm:p-7">
                        <SectionTitle
                          icon={Target}
                          eyebrow="Build your stack"
                          title="Select your likely subjects"
                          body={config.subjectSelectionHint}
                        />

                        <div className="mt-5 grid gap-3">
                          {config.subjects.map((item) => {
                            const tier = tierMeta(item.tier);
                            const scaling = scalingMeta(item.scaling);
                            const active = selectedSubjects.includes(item.id);

                            return (
                              <button
                                key={item.id}
                                onClick={() => toggleSubject(item.id)}
                                className={cx(
                                  "rounded-2xl border p-4 text-left transition",
                                  active
                                    ? "border-violet-300 bg-violet-50 shadow-sm"
                                    : "border-slate-200 bg-white hover:bg-slate-50"
                                )}
                              >
                                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                  <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span
                                        className={cx(
                                          "h-4 w-4 rounded-md border",
                                          active
                                            ? "border-violet-600 bg-violet-600"
                                            : "border-slate-300 bg-white"
                                        )}
                                      />
                                      <span className="font-semibold text-slate-950">
                                        {item.name}
                                      </span>
                                      {item.recommendedForMed ? (
                                        <Pill className="border-emerald-200 bg-emerald-50 text-emerald-700">
                                          Med-relevant
                                        </Pill>
                                      ) : null}
                                    </div>
                                    <p className="mt-1 text-sm text-slate-500">
                                      {item.area}
                                      {item.note ? ` · ${item.note}` : ""}
                                    </p>
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    <Pill className={tier.tone}>{tier.label}</Pill>
                                    <Pill className={scaling.tone}>
                                      {scaling.label}
                                    </Pill>
                                    <Pill className="border-slate-200 bg-white text-slate-600">
                                      {item.externalWeight ??
                                        config.examWeightingDefault}
                                      % external
                                    </Pill>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </SoftCard>
                    </>
                  ) : null}

                  {activeTab === "subjects" ? (
                    <>
                      <SoftCard className="p-6 sm:p-7">
                        <SectionTitle
                          icon={SlidersHorizontal}
                          eyebrow="Subject explorer"
                          title="Filter the subject library"
                          body="Use this to compare scaling posture, med relevance, area balance and the kind of assessment load each subject usually creates."
                        />

                        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                          <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                              Search
                            </label>
                            <div className="relative">
                              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                              <input
                                value={subjectSearch}
                                onChange={(e) => setSubjectSearch(e.target.value)}
                                placeholder="Search subject, note or area"
                                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-violet-300"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                              Area
                            </label>
                            <select
                              value={areaFilter}
                              onChange={(e) =>
                                setAreaFilter(e.target.value as "all" | SubjectArea)
                              }
                              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                            >
                              {areaOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option === "all" ? "All areas" : option}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                              Scaling
                            </label>
                            <select
                              value={scalingFilter}
                              onChange={(e) =>
                                setScalingFilter(e.target.value as "all" | ScalingBand)
                              }
                              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                            >
                              <option value="all">All bands</option>
                              <option value="veryHigh">Very High</option>
                              <option value="high">High</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low</option>
                            </select>
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                              Sort by
                            </label>
                            <select
                              value={subjectSort}
                              onChange={(e) =>
                                setSubjectSort(e.target.value as SubjectSortKey)
                              }
                              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                            >
                              <option value="recommended">Med relevance</option>
                              <option value="scaling">Scaling</option>
                              <option value="tier">Tier</option>
                              <option value="name">Name</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <button
                            onClick={() =>
                              setRecommendedOnly((current) => !current)
                            }
                            className={cx(
                              "rounded-full border px-4 py-2 text-sm font-semibold transition",
                              recommendedOnly
                                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            )}
                          >
                            Med-relevant only
                          </button>

                          <Pill className="border-slate-200 bg-slate-50 text-slate-600">
                            {filteredSubjects.length} subject
                            {filteredSubjects.length === 1 ? "" : "s"}
                          </Pill>
                        </div>
                      </SoftCard>

                      <div className="grid gap-6 2xl:grid-cols-[0.9fr_1.1fr]">
                        <SoftCard className="p-4">
                          <div className="mb-3 flex items-center gap-2 text-slate-700">
                            <Filter className="h-4 w-4" />
                            <p className="text-sm font-bold">Filtered results</p>
                          </div>

                          <div className="max-h-180 space-y-3 overflow-y-auto pr-1">
                            {filteredSubjects.map((item) => {
                              const selected = selectedLibrarySubject?.id === item.id;
                              const scaling = scalingMeta(item.scaling);

                              return (
                                <button
                                  key={item.id}
                                  onClick={() => setSelectedLibrarySubjectId(item.id)}
                                  className={cx(
                                    "w-full rounded-2xl border p-4 text-left transition",
                                    selected
                                      ? "border-violet-300 bg-violet-50"
                                      : "border-slate-200 bg-white hover:bg-slate-50"
                                  )}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="font-semibold text-slate-950">
                                        {item.name}
                                      </p>
                                      <p className="mt-1 text-sm text-slate-500">
                                        {item.area}
                                      </p>
                                    </div>
                                    <Pill className={scaling.tone}>
                                      {scaling.label}
                                    </Pill>
                                  </div>

                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <Pill className={tierMeta(item.tier).tone}>
                                      {tierMeta(item.tier).label}
                                    </Pill>
                                    {item.recommendedForMed ? (
                                      <Pill className="border-emerald-200 bg-emerald-50 text-emerald-700">
                                        Med-relevant
                                      </Pill>
                                    ) : null}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </SoftCard>

                        <SoftCard className="p-6 sm:p-7">
                          {selectedLibrarySubject ? (
                            <>
                              <SectionTitle
                                icon={FlaskConical}
                                eyebrow="Subject detail"
                                title={selectedLibrarySubject.name}
                                body={
                                  selectedLibrarySubject.note ||
                                  `${selectedLibrarySubject.name} sits in ${selectedLibrarySubject.area} and is currently classified here as a ${scalingMeta(
                                    selectedLibrarySubject.scaling
                                  ).label.toLowerCase()} scaling option.`
                                }
                              />

                              <div className="mt-5 grid gap-4 md:grid-cols-3">
                                <MetricCard
                                  title="Tier"
                                  value={tierMeta(selectedLibrarySubject.tier).label}
                                  note="Strategic posture in this engine"
                                  tone={tierMeta(selectedLibrarySubject.tier).tone}
                                />
                                <MetricCard
                                  title="Scaling"
                                  value={scalingMeta(selectedLibrarySubject.scaling).label}
                                  note="Relative upside band"
                                  tone={scalingMeta(selectedLibrarySubject.scaling).tone}
                                />
                                <MetricCard
                                  title="External"
                                  value={`${
                                    selectedLibrarySubject.externalWeight ??
                                    config.examWeightingDefault
                                  }%`}
                                  note={
                                    selectedLibrarySubject.examStyle ||
                                    "Default system estimate"
                                  }
                                  tone="border-slate-200 bg-slate-50"
                                />
                              </div>

                              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm font-bold text-slate-950">
                                  Common assessment profile
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {selectedLibrarySubject.commonAssessments.map(
                                    (type) => (
                                      <Pill key={type} className={assessmentTone(type)}>
                                        {type}
                                      </Pill>
                                    )
                                  )}
                                </div>
                              </div>

                              <div className="mt-5 grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                  <p className="text-sm font-bold text-slate-950">
                                    Why it matters
                                  </p>
                                  <p className="mt-2 text-sm leading-7 text-slate-600">
                                    {selectedLibrarySubject.recommendedForMed
                                      ? "This subject contributes directly to a stronger medicine-facing academic profile in this engine."
                                      : "This subject can still be useful, but it is not one of the strongest med-facing anchors in this model."}
                                  </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                  <p className="text-sm font-bold text-slate-950">
                                    Assessment feel
                                  </p>
                                  <p className="mt-2 text-sm leading-7 text-slate-600">
                                    {selectedLibrarySubject.commonAssessments.some((item) =>
                                      COMMON_MED_ASSESSMENTS.includes(item)
                                    )
                                      ? "This subject leans toward analytical or evidence-based assessment patterns."
                                      : "This subject is likely to demand a broader or more stylistically varied assessment approach."}
                                  </p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-slate-500">
                              Select a subject to inspect it.
                            </p>
                          )}
                        </SoftCard>
                      </div>
                    </>
                  ) : null}

                  {activeTab === "internals" ? (
                    <>
                      <SoftCard className="p-6 sm:p-7">
                        <SectionTitle
                          icon={BarChart3}
                          eyebrow="Internals diagnostics"
                          title="Track school-assessment stability"
                          body="Use four task slots so this works more cleanly across states. Leave any unused slot blank."
                        />
                      </SoftCard>

                      <SoftCard className="p-6 sm:p-7">
                        <div className="space-y-3">
                          {internalRows.map((row) => (
                            <div
                              key={row.id}
                              className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                            >
                              <div className="grid gap-3 xl:grid-cols-[1.35fr_repeat(6,minmax(0,1fr))]">
                                <select
                                  value={row.subjectId}
                                  onChange={(e) =>
                                    updateRow(row.id, "subjectId", e.target.value)
                                  }
                                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-300"
                                >
                                  <option value="">Select subject...</option>
                                  {config.subjects.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                                </select>

                                <input
                                  value={row.task1}
                                  onChange={(e) =>
                                    updateRow(row.id, "task1", e.target.value)
                                  }
                                  placeholder="Task 1"
                                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-300"
                                />
                                <input
                                  value={row.task2}
                                  onChange={(e) =>
                                    updateRow(row.id, "task2", e.target.value)
                                  }
                                  placeholder="Task 2"
                                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-300"
                                />
                                <input
                                  value={row.task3}
                                  onChange={(e) =>
                                    updateRow(row.id, "task3", e.target.value)
                                  }
                                  placeholder="Task 3"
                                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-300"
                                />
                                <input
                                  value={row.task4}
                                  onChange={(e) =>
                                    updateRow(row.id, "task4", e.target.value)
                                  }
                                  placeholder="Task 4"
                                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-300"
                                />
                                <input
                                  value={row.weighting}
                                  onChange={(e) =>
                                    updateRow(row.id, "weighting", e.target.value)
                                  }
                                  placeholder="Weighting"
                                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-300"
                                />
                                <div className="flex gap-2">
                                  <input
                                    value={row.rank}
                                    onChange={(e) =>
                                      updateRow(row.id, "rank", e.target.value)
                                    }
                                    placeholder="Rank"
                                    className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-300"
                                  />
                                  <button
                                    onClick={() => removeInternalRow(row.id)}
                                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={addInternalRow}
                          className="mt-4 h-11 w-full rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          + Add another subject
                        </button>
                      </SoftCard>
                    </>
                  ) : null}

                  {activeTab === "externals" ? (
                    <>
                      <SoftCard className="p-6 sm:p-7">
                        <SectionTitle
                          icon={TrendingUp}
                          eyebrow="External sensitivity"
                          title="Model the final swing"
                          body="This shows how much the external component can move the final subject outcome. In school-based systems, use it as a pressure proxy."
                        />
                      </SoftCard>

                      <SoftCard className="p-6 sm:p-7">
                        <div className="grid gap-4">
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                              Internal average (%)
                            </label>
                            <input
                              value={externalInternalAverage}
                              onChange={(e) =>
                                setExternalInternalAverage(e.target.value)
                              }
                              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                              Expected external score (%)
                            </label>
                            <input
                              value={externalExamScore}
                              onChange={(e) => setExternalExamScore(e.target.value)}
                              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                              External weighting ({examWeight}%)
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="60"
                              value={examWeight}
                              onChange={(e) => setExamWeight(e.target.value)}
                              className="w-full"
                            />
                            <div className="mt-1 flex justify-between text-xs text-slate-500">
                              <span>0% internal-heavy</span>
                              <span>60% exam-heavy</span>
                            </div>
                          </div>
                        </div>
                      </SoftCard>
                    </>
                  ) : null}
                </div>

                <div className="space-y-6">
                  <SoftCard className="p-6 sm:p-7">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Local programs
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {config.localPrograms.map((program) => (
                        <Pill
                          key={program}
                          className="border-slate-200 bg-white text-slate-700"
                        >
                          {program}
                        </Pill>
                      ))}
                    </div>
                  </SoftCard>

                  {activeTab === "overview" ? (
                    <>
                      <SoftCard className="p-6 sm:p-7">
                        <div className="mb-4 flex items-center gap-2 text-violet-700">
                          <Target className="h-4 w-4" />
                          <h3 className="text-sm font-bold">Subject posture read</h3>
                        </div>

                        <div className={cx("rounded-2xl border p-4", stateEngine.postureTone)}>
                          <p className="font-bold">{stateEngine.posture}</p>
                          <p className="mt-1 text-sm">
                            Scaling advantage score:{" "}
                            {stateEngine.scalingAdvantagePercent}% of model ceiling
                          </p>
                        </div>

                        <div className="mt-4 h-2 rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-linear-to-r from-violet-500 via-sky-500 to-emerald-500"
                            style={{ width: `${stateEngine.readiness}%` }}
                          />
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <MetricCard
                            title="Tier 1 count"
                            value={String(stateEngine.tier1Count)}
                            note="High-rigour spine"
                            tone="border-emerald-200 bg-emerald-50"
                          />
                          <MetricCard
                            title="Med anchors"
                            value={String(stateEngine.medAnchors)}
                            note="Relevant to medicine posture"
                            tone="border-sky-200 bg-sky-50"
                          />
                          <MetricCard
                            title="Science count"
                            value={String(stateEngine.scienceCount)}
                            note="Breadth in science"
                            tone="border-violet-200 bg-violet-50"
                          />
                          <MetricCard
                            title="Maths count"
                            value={String(stateEngine.mathsCount)}
                            note="Maths backbone"
                            tone="border-amber-200 bg-amber-50"
                          />
                        </div>
                      </SoftCard>

                      <SoftCard className="p-6 sm:p-7">
                        <div className="mb-4 flex items-center gap-2 text-emerald-700">
                          <FlaskConical className="h-4 w-4" />
                          <h3 className="text-sm font-bold">Medicine-facing read</h3>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="font-semibold text-slate-950">
                            Pressure point
                          </p>
                          <p className="mt-2 text-sm leading-7 text-slate-600">
                            {stateEngine.pressurePoint}
                          </p>
                        </div>

                        <div className="mt-4 space-y-2">
                          {stateEngine.chosen.length ? (
                            stateEngine.chosen.slice(0, 8).map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
                              >
                                <div>
                                  <p className="text-sm font-semibold text-slate-950">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {item.area}
                                  </p>
                                </div>
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500">
                              Select subjects to generate a stronger read.
                            </p>
                          )}
                        </div>
                      </SoftCard>

                      <SoftCard className="p-6 sm:p-7">
                        <div className="mb-3 flex items-center gap-2 text-slate-700">
                          <CircleAlert className="h-4 w-4" />
                          <h3 className="text-sm font-bold">Engine note</h3>
                        </div>
                        <p className="text-sm leading-7 text-slate-600">
                          {config.internalModelHint}
                        </p>
                      </SoftCard>
                    </>
                  ) : null}

                  {activeTab === "subjects" ? (
                    <>
                      <SoftCard className="p-6 sm:p-7">
                        <h3 className="text-sm font-bold text-slate-950">
                          Library summary
                        </h3>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <MetricCard
                            title="Very high scaling"
                            value={String(
                              config.subjects.filter((s) => s.scaling === "veryHigh")
                                .length
                            )}
                            note="Top upside band"
                            tone="border-violet-200 bg-violet-50"
                          />
                          <MetricCard
                            title="High scaling"
                            value={String(
                              config.subjects.filter((s) => s.scaling === "high")
                                .length
                            )}
                            note="Strong upside band"
                            tone="border-emerald-200 bg-emerald-50"
                          />
                          <MetricCard
                            title="Med-relevant"
                            value={String(
                              config.subjects.filter((s) => s.recommendedForMed)
                                .length
                            )}
                            note="Useful in medicine-facing planning"
                            tone="border-sky-200 bg-sky-50"
                          />
                          <MetricCard
                            title="Languages"
                            value={String(
                              config.subjects.filter((s) => s.area === "Languages")
                                .length
                            )}
                            note="Potential scaling plays"
                            tone="border-amber-200 bg-amber-50"
                          />
                        </div>
                      </SoftCard>

                      <SoftCard className="p-6 sm:p-7">
                        <p className="text-sm font-semibold text-slate-950">
                          How to use this page
                        </p>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          Start by filtering to med-relevant subjects, then compare the
                          remaining options against your real strengths. After that, add
                          one or two upside plays only if execution is realistic.
                        </p>
                      </SoftCard>
                    </>
                  ) : null}

                  {activeTab === "internals" ? (
                    <>
                      <SoftCard className="p-6 sm:p-7">
                        <h3 className="text-sm font-bold text-slate-950">
                          Diagnostics
                        </h3>
                        <div className="mt-4 grid gap-3">
                          <MetricCard
                            title="Overall average"
                            value={`${internalDiagnostics.overallAverage}%`}
                            note="Across entered subjects"
                            tone="border-violet-200 bg-violet-50"
                          />
                          <MetricCard
                            title="Most volatile"
                            value={internalDiagnostics.mostVolatile?.subjectName || "—"}
                            note={
                              internalDiagnostics.mostVolatile
                                ? `Spread ${internalDiagnostics.mostVolatile.spread.toFixed(
                                    1
                                  )}%`
                                : "Enter more than one task in a subject."
                            }
                            tone="border-rose-200 bg-rose-50"
                          />
                          <MetricCard
                            title="Highest leverage"
                            value={internalDiagnostics.highestImpact?.subjectName || "—"}
                            note={
                              internalDiagnostics.highestImpact
                                ? `Weighted impact ${internalDiagnostics.highestImpact.weightedImpact.toFixed(
                                    1
                                  )}`
                                : "Add weighting and marks."
                            }
                            tone="border-amber-200 bg-amber-50"
                          />
                          <MetricCard
                            title="Lowest average"
                            value={internalDiagnostics.weakestAverage?.subjectName || "—"}
                            note={
                              internalDiagnostics.weakestAverage
                                ? `Average ${internalDiagnostics.weakestAverage.avg.toFixed(
                                    1
                                  )}%`
                                : "No subjects ranked yet."
                            }
                            tone="border-sky-200 bg-sky-50"
                          />
                        </div>
                      </SoftCard>

                      <SoftCard className="p-6 sm:p-7">
                        <p className="text-sm font-semibold text-slate-950">
                          Stable core subjects
                        </p>
                        <div className="mt-3 space-y-2">
                          {internalDiagnostics.stableCore.length ? (
                            internalDiagnostics.stableCore.map((item) => (
                              <div
                                key={item.id}
                                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3"
                              >
                                <p className="text-sm font-semibold text-emerald-950">
                                  {item.subjectName}
                                </p>
                                <p className="text-xs text-emerald-800">
                                  {item.avg.toFixed(1)}% average ·{" "}
                                  {item.spread.toFixed(1)}% spread
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500">
                              No stable core identified yet.
                            </p>
                          )}
                        </div>
                      </SoftCard>

                      <SoftCard className="p-6 sm:p-7">
                        <p className="text-sm font-semibold text-slate-950">
                          Why this matters
                        </p>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          Stable internal subjects are what give you room to attack
                          harder ones. Volatile subjects are where marks leak silently
                          across the year.
                        </p>
                      </SoftCard>
                    </>
                  ) : null}

                  {activeTab === "externals" ? (
                    <>
                      <SoftCard className="p-6 sm:p-7">
                        <h3 className="text-sm font-bold text-slate-950">
                          Impact summary
                        </h3>
                        <div className="mt-4 grid gap-3">
                          <MetricCard
                            title="Projected combined"
                            value={`${externalModel.total}%`}
                            note={`${100 - asNumber(examWeight)}% internal / ${examWeight}% external`}
                            tone="border-violet-200 bg-violet-50"
                          />
                          <MetricCard
                            title="Exam -5%"
                            value={`${externalModel.drop5}%`}
                            note={`Net loss ${externalModel.deltaDown5}%`}
                            tone="border-rose-200 bg-rose-50"
                          />
                          <MetricCard
                            title="Exam +5%"
                            value={`${externalModel.gain5}%`}
                            note={`Net gain ${externalModel.deltaUp5}%`}
                            tone="border-emerald-200 bg-emerald-50"
                          />
                          <MetricCard
                            title="Exam -10%"
                            value={`${externalModel.drop10}%`}
                            note={`Net loss ${externalModel.deltaDown10}%`}
                            tone="border-slate-200 bg-slate-50"
                          />
                          <MetricCard
                            title="Exam +10%"
                            value={`${externalModel.gain10}%`}
                            note={`Net gain ${externalModel.deltaUp10}%`}
                            tone="border-sky-200 bg-sky-50"
                          />
                        </div>
                      </SoftCard>

                      <SoftCard className="p-6 sm:p-7">
                        <p className="text-sm font-semibold text-slate-950">
                          System note
                        </p>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {config.externalModelHint}
                        </p>
                      </SoftCard>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FeatureGate>
  );
}

function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-black tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}

function MetricCard({
  title,
  value,
  note,
  tone,
}: {
  title: string;
  value: string;
  note: string;
  tone: string;
}) {
  return (
    <div className={cx("rounded-2xl border p-4", tone)}>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <p className="mt-1 text-xl font-black tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-600">{note}</p>
    </div>
  );
}