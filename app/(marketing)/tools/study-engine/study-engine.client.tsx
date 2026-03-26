"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
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
  Lock,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  Route,
  Brain,
  ShieldCheck,
  BookOpen,
  Layers3,
  MapPinned,
  Microscope,
  CalendarDays,
  Gauge,
  Check,
} from "lucide-react";

type EngineTab =
  | "overview"
  | "subjects"
  | "internals"
  | "externals"
  | "pathway"
  | "year-planner";

type JurisdictionKey =
  | "qce"
  | "vce"
  | "hsc"
  | "wace"
  | "act"
  | "tce"
  | "ntcet"
  | "sace"
  | "ib";

type YearLevel = "year10" | "year11" | "year12";
type StudyGoal =
  | "medicine"
  | "high-atar"
  | "balanced"
  | "pathway-only"
  | "ib-medicine";
type PathwayMode =
  | "atar-academic"
  | "applied-pathway"
  | "school-based"
  | "multi-year"
  | "ib-diploma";

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
  | "Problem Solving"
  | "Common Internal"
  | "Externally Set Task"
  | "School Assessment"
  | "Practical"
  | "Investigation"
  | "Essay";

type ModerationModel =
  | "statistical-moderation"
  | "endorsement-confirmation"
  | "sample-moderation"
  | "continuous-school-based"
  | "level-based-external"
  | "external-moderation"
  | "school-only";

type SubjectItem = {
  id: string;
  name: string;
  area: SubjectArea;
  tier: SubjectTier;
  scaling: ScalingBand;
  recommendedForMed?: boolean;
  note?: string;
  commonAssessments: AssessmentType[];
  years?: "Year 10" | "Year 11-12" | "Year 10-12";
  stageAvailability?: YearLevel[];
  externalWeight?: number;
  internalWeight?: number;
  examStyle?: string;
  atarEligible?: boolean;
  recommendedYear10?: boolean;
  recommendedYear11?: boolean;
  recommendedYear12?: boolean;
  pathwayTags?: string[];
};

type YearBlueprint = {
  year: YearLevel;
  title: string;
  objective: string;
  priorities: string[];
  avoid: string[];
  metrics: string[];
  callout: string;
};

type JurisdictionAssessmentKernel = {
  year10Role: string;
  year11Role: string;
  year12Role: string;
  internalSummary: string;
  externalSummary: string;
  moderationModel: ModerationModel;
  defaultInternalWeight: number;
  defaultExternalWeight: number;
  atarConstruction: string;
  certificateLogic: string;
  specialRules: string[];
};

type JurisdictionConfig = {
  key: JurisdictionKey;
  label: string;
  certificate: string;
  admissionsBody: string;
  shortAssessment: string;
  internalModelHint: string;
  externalModelHint: string;
  subjectSelectionHint: string;
  pathwayMode: PathwayMode;
  systemTone: string;
  year10Hint: string;
  year11Hint: string;
  year12Hint: string;
  assessmentBullets: string[];
  scalingBullets: string[];
  medicineBullets: string[];
  localPrograms: string[];
  defaultStudyGoal: StudyGoal;
  examWeightingDefault: number;
  kernel: JurisdictionAssessmentKernel;
  yearBlueprints: YearBlueprint[];
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

type SubjectSortKey =
  | "recommended"
  | "scaling"
  | "tier"
  | "name"
  | "external"
  | "balanced";

type StrategyInsightTone = "good" | "warn" | "neutral";

type StrategyInsight = {
  title: string;
  body: string;
  tone: StrategyInsightTone;
};

const STORAGE_KEY = "amg-study-engine-v3";

const TABS: {
  key: EngineTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "overview", label: "Strategy Engine", icon: GraduationCap },
  { key: "pathway", label: "Pathway", icon: Route },
  { key: "year-planner", label: "Year Planner", icon: CalendarDays },
  { key: "subjects", label: "Subject Library", icon: Filter },
  { key: "internals", label: "Internals", icon: BarChart3 },
  { key: "externals", label: "Externals", icon: LineChart },
];

const AREA_OPTIONS: Array<"all" | SubjectArea> = [
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

const YEAR_OPTIONS: { value: YearLevel; label: string }[] = [
  { value: "year10", label: "Year 10" },
  { value: "year11", label: "Year 11" },
  { value: "year12", label: "Year 12" },
];

const GOAL_OPTIONS: { value: StudyGoal; label: string }[] = [
  { value: "medicine", label: "Medicine-focused" },
  { value: "high-atar", label: "High ATAR first" },
  { value: "balanced", label: "Balanced profile" },
  { value: "pathway-only", label: "Keep pathways open" },
  { value: "ib-medicine", label: "IB + medicine" },
];

function cx(...classes: Array<string | false | null | undefined>) {
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
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
  options?: {
    note?: string;
    externalWeight?: number;
    internalWeight?: number;
    examStyle?: string;
    atarEligible?: boolean;
    stageAvailability?: YearLevel[];
    years?: "Year 10" | "Year 11-12" | "Year 10-12";
    recommendedYear10?: boolean;
    recommendedYear11?: boolean;
    recommendedYear12?: boolean;
    pathwayTags?: string[];
  }
): SubjectItem {
  return {
    id,
    name,
    area,
    tier,
    scaling,
    recommendedForMed,
    note: options?.note,
    commonAssessments,
    externalWeight: options?.externalWeight,
    internalWeight: options?.internalWeight,
    examStyle: options?.examStyle,
    atarEligible: options?.atarEligible ?? true,
    stageAvailability: options?.stageAvailability ?? ["year11", "year12"],
    years: options?.years ?? "Year 11-12",
    recommendedYear10: options?.recommendedYear10 ?? false,
    recommendedYear11: options?.recommendedYear11 ?? true,
    recommendedYear12: options?.recommendedYear12 ?? true,
    pathwayTags: options?.pathwayTags ?? [],
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

function yearMeta(year: YearLevel) {
  if (year === "year10") {
    return {
      label: "Year 10",
      tone: "border-sky-200 bg-sky-50 text-sky-700",
      short: "Pathway year",
    };
  }
  if (year === "year11") {
    return {
      label: "Year 11",
      tone: "border-amber-200 bg-amber-50 text-amber-700",
      short: "Build year",
    };
  }
  return {
    label: "Year 12",
    tone: "border-violet-200 bg-violet-50 text-violet-700",
    short: "Execution year",
  };
}

function moderationMeta(model: ModerationModel) {
  switch (model) {
    case "statistical-moderation":
      return {
        label: "Statistical moderation",
        tone: "border-violet-200 bg-violet-50 text-violet-700",
      };
    case "endorsement-confirmation":
      return {
        label: "Endorsement + confirmation",
        tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case "sample-moderation":
      return {
        label: "Sample moderation",
        tone: "border-sky-200 bg-sky-50 text-sky-700",
      };
    case "continuous-school-based":
      return {
        label: "Continuous school-based",
        tone: "border-amber-200 bg-amber-50 text-amber-700",
      };
    case "level-based-external":
      return {
        label: "Level-based external mix",
        tone: "border-indigo-200 bg-indigo-50 text-indigo-700",
      };
    case "external-moderation":
      return {
        label: "External moderation",
        tone: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
      };
    default:
      return {
        label: "School assessed",
        tone: "border-slate-200 bg-slate-50 text-slate-700",
      };
  }
}

function assessmentTone(type: AssessmentType) {
  if (
    type === "Exam" ||
    type === "Short Response Test" ||
    type === "Common Internal" ||
    type === "Externally Set Task"
  ) {
    return "border-slate-200 bg-slate-50 text-slate-700";
  }

  if (
    type === "Scientific Investigation" ||
    type === "Practical Report" ||
    type === "Data Analysis" ||
    type === "Practical" ||
    type === "Investigation"
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (
    type === "Extended Response" ||
    type === "Research Investigation" ||
    type === "Major Work" ||
    type === "Essay"
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
  "Investigation",
];

const YEAR10_MED_FOUNDATIONS = [
  "English",
  "Mathematics",
  "Science",
] as const;

const QCE_SUBJECTS: SubjectItem[] = [
  createSubject(
    "qce-english",
    "English",
    "English",
    "tier2",
    "medium",
    true,
    ["Exam", "Extended Response", "Oral Presentation"],
    {
      note: "Core literacy anchor.",
      externalWeight: 25,
      internalWeight: 75,
      examStyle: "3 IA + 1 EA",
      recommendedYear11: true,
      recommendedYear12: true,
      pathwayTags: ["general", "atar", "literacy"],
    }
  ),
  createSubject(
    "qce-literature",
    "Literature",
    "English",
    "tier2",
    "medium",
    false,
    ["Extended Response", "Exam", "Oral Presentation"],
    {
      externalWeight: 25,
      internalWeight: 75,
      examStyle: "3 IA + 1 EA",
      pathwayTags: ["general", "atar"],
    }
  ),
  createSubject(
    "qce-methods",
    "Mathematical Methods",
    "Mathematics",
    "tier1",
    "high",
    true,
    ["Modelling Task", "Exam", "Short Response Test"],
    {
      note: "Best all-round med maths.",
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "Maths/science 50:50",
      pathwayTags: ["general", "atar", "maths-spine"],
    }
  ),
  createSubject(
    "qce-spec",
    "Specialist Mathematics",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Modelling Task", "Exam", "Short Response Test"],
    {
      note: "Excellent scaler if genuinely strong.",
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "Maths/science 50:50",
      pathwayTags: ["general", "atar", "extension"],
    }
  ),
  createSubject(
    "qce-general-maths",
    "General Mathematics",
    "Mathematics",
    "tier3",
    "low",
    false,
    ["Modelling Task", "Exam", "Short Response Test"],
    {
      externalWeight: 25,
      internalWeight: 75,
      examStyle: "3 IA + 1 EA",
      pathwayTags: ["general", "atar"],
    }
  ),
  createSubject(
    "qce-chem",
    "Chemistry",
    "Science",
    "tier1",
    "high",
    true,
    ["Data Analysis", "Scientific Investigation", "Exam", "Practical Report"],
    {
      note: "Strong med anchor.",
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "Maths/science 50:50",
      pathwayTags: ["general", "atar", "science-anchor"],
    }
  ),
  createSubject(
    "qce-bio",
    "Biology",
    "Science",
    "tier2",
    "medium",
    true,
    ["Data Analysis", "Scientific Investigation", "Exam", "Practical Report"],
    {
      note: "Helpful for med context.",
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "Maths/science 50:50",
      pathwayTags: ["general", "atar", "science-anchor"],
    }
  ),
  createSubject(
    "qce-physics",
    "Physics",
    "Science",
    "tier1",
    "high",
    false,
    ["Data Analysis", "Scientific Investigation", "Exam", "Practical Report"],
    {
      note: "Great complement to methods and chem.",
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "Maths/science 50:50",
      pathwayTags: ["general", "atar", "science-anchor"],
    }
  ),
  createSubject(
    "qce-psych",
    "Psychology",
    "Science",
    "tier3",
    "low",
    false,
    ["Data Analysis", "Research Investigation", "Exam"],
    {
      externalWeight: 25,
      internalWeight: 75,
      examStyle: "3 IA + 1 EA",
      pathwayTags: ["general", "atar"],
    }
  ),
  createSubject(
    "qce-engineering",
    "Engineering",
    "Technologies",
    "tier1",
    "veryHigh",
    false,
    ["Design Project", "Exam", "Problem Solving"],
    {
      note: "School delivery quality matters a lot.",
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "Maths/science-adjacent exam pressure",
      pathwayTags: ["general", "atar", "rigorous"],
    }
  ),
  createSubject(
    "qce-digital",
    "Digital Solutions",
    "Technologies",
    "tier2",
    "medium",
    false,
    ["Design Project", "Exam", "Portfolio"],
    {
      externalWeight: 25,
      internalWeight: 75,
      examStyle: "3 IA + 1 EA",
      pathwayTags: ["general", "atar"],
    }
  ),
  createSubject(
    "qce-economics",
    "Economics",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Research Investigation", "Exam"],
    {
      externalWeight: 25,
      internalWeight: 75,
      examStyle: "3 IA + 1 EA",
      pathwayTags: ["general", "atar"],
    }
  ),
  createSubject(
    "qce-legal",
    "Legal Studies",
    "Humanities",
    "tier3",
    "low",
    false,
    ["Extended Response", "Research Investigation", "Exam"],
    {
      externalWeight: 25,
      internalWeight: 75,
      examStyle: "3 IA + 1 EA",
      pathwayTags: ["general", "atar"],
    }
  ),
  createSubject(
    "qce-modern-history",
    "Modern History",
    "Humanities",
    "tier3",
    "low",
    false,
    ["Extended Response", "Research Investigation", "Exam"],
    {
      externalWeight: 25,
      internalWeight: 75,
      examStyle: "3 IA + 1 EA",
      pathwayTags: ["general", "atar"],
    }
  ),
  createSubject(
    "qce-french",
    "French",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    {
      note: "Classic strong-scaling language if already proficient.",
      externalWeight: 25,
      internalWeight: 75,
      examStyle: "3 IA + 1 EA",
      pathwayTags: ["general", "atar", "language-upside"],
    }
  ),
  createSubject(
    "qce-japanese",
    "Japanese",
    "Languages",
    "tier1",
    "high",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    {
      externalWeight: 25,
      internalWeight: 75,
      examStyle: "3 IA + 1 EA",
      pathwayTags: ["general", "atar", "language-upside"],
    }
  ),
  createSubject(
    "qce-chinese",
    "Chinese",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    {
      externalWeight: 25,
      internalWeight: 75,
      examStyle: "3 IA + 1 EA",
      pathwayTags: ["general", "atar", "language-upside"],
    }
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
    {
      note: "Core compulsory English pathway.",
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "SAC + exam model",
      pathwayTags: ["vce", "atar", "english-group"],
    }
  ),
  createSubject(
    "vce-englang",
    "English Language",
    "English",
    "tier2",
    "high",
    false,
    ["Extended Response", "Short Response Test", "Exam"],
    {
      note: "Great for analytical language thinkers.",
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "SAC + exam model",
      pathwayTags: ["vce", "atar", "english-group"],
    }
  ),
  createSubject(
    "vce-literature",
    "Literature",
    "English",
    "tier2",
    "medium",
    false,
    ["Extended Response", "Oral Presentation", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "SAC + exam model",
      pathwayTags: ["vce", "atar", "english-group"],
    }
  ),
  createSubject(
    "vce-general",
    "General Mathematics",
    "Mathematics",
    "tier3",
    "low",
    false,
    ["Modelling Task", "Short Response Test", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "SAC + exam model",
      pathwayTags: ["vce", "atar"],
    }
  ),
  createSubject(
    "vce-methods",
    "Mathematical Methods",
    "Mathematics",
    "tier1",
    "high",
    true,
    ["Modelling Task", "Short Response Test", "Exam"],
    {
      note: "Strong med maths anchor.",
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "SAC + exam model",
      pathwayTags: ["vce", "atar", "maths-spine"],
    }
  ),
  createSubject(
    "vce-spec",
    "Specialist Mathematics",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Modelling Task", "Short Response Test", "Exam"],
    {
      note: "Very strong scaler when executed well.",
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "SAC + exam model",
      pathwayTags: ["vce", "atar", "extension"],
    }
  ),
  createSubject(
    "vce-chem",
    "Chemistry",
    "Science",
    "tier1",
    "high",
    true,
    ["Scientific Investigation", "Practical Report", "Data Analysis", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "SAC + exam model",
      pathwayTags: ["vce", "atar", "science-anchor"],
    }
  ),
  createSubject(
    "vce-bio",
    "Biology",
    "Science",
    "tier2",
    "medium",
    true,
    ["Scientific Investigation", "Practical Report", "Data Analysis", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "SAC + exam model",
      pathwayTags: ["vce", "atar", "science-anchor"],
    }
  ),
  createSubject(
    "vce-physics",
    "Physics",
    "Science",
    "tier1",
    "high",
    false,
    ["Scientific Investigation", "Practical Report", "Data Analysis", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "SAC + exam model",
      pathwayTags: ["vce", "atar", "science-anchor"],
    }
  ),
  createSubject(
    "vce-psych",
    "Psychology",
    "Science",
    "tier3",
    "medium",
    false,
    ["Research Investigation", "Data Analysis", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "SAC + exam model",
      pathwayTags: ["vce", "atar"],
    }
  ),
  createSubject(
    "vce-global",
    "Global Politics",
    "Humanities",
    "tier2",
    "medium",
    false,
    ["Extended Response", "Research Investigation", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "SAC + exam model",
      pathwayTags: ["vce", "atar"],
    }
  ),
  createSubject(
    "vce-french",
    "French",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "SAC + exam model",
      pathwayTags: ["vce", "atar", "language-upside"],
    }
  ),
  createSubject(
    "vce-latin",
    "Latin",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Extended Response"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "SAC + exam model",
      pathwayTags: ["vce", "atar", "language-upside"],
    }
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
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "School assessment + HSC exam",
      pathwayTags: ["hsc", "atar", "english-group"],
    }
  ),
  createSubject(
    "hsc-english-adv",
    "English Advanced",
    "English",
    "tier2",
    "medium",
    true,
    ["Extended Response", "Oral Presentation", "Exam"],
    {
      note: "Safer med-facing English option.",
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "School assessment + HSC exam",
      pathwayTags: ["hsc", "atar", "english-group"],
    }
  ),
  createSubject(
    "hsc-english-ext1",
    "English Extension 1",
    "English",
    "tier2",
    "high",
    false,
    ["Extended Response", "Major Work", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "School assessment + HSC exam",
      pathwayTags: ["hsc", "atar", "extension"],
    }
  ),
  createSubject(
    "hsc-maths-adv",
    "Mathematics Advanced",
    "Mathematics",
    "tier1",
    "high",
    true,
    ["Short Response Test", "Modelling Task", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "School assessment + HSC exam",
      pathwayTags: ["hsc", "atar", "maths-spine"],
    }
  ),
  createSubject(
    "hsc-maths-ext1",
    "Mathematics Extension 1",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Short Response Test", "Modelling Task", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "School assessment + HSC exam",
      pathwayTags: ["hsc", "atar", "extension"],
    }
  ),
  createSubject(
    "hsc-maths-ext2",
    "Mathematics Extension 2",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Short Response Test", "Modelling Task", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "School assessment + HSC exam",
      pathwayTags: ["hsc", "atar", "extension"],
    }
  ),
  createSubject(
    "hsc-chem",
    "Chemistry",
    "Science",
    "tier1",
    "high",
    true,
    ["Scientific Investigation", "Data Analysis", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "School assessment + HSC exam",
      pathwayTags: ["hsc", "atar", "science-anchor"],
    }
  ),
  createSubject(
    "hsc-bio",
    "Biology",
    "Science",
    "tier2",
    "medium",
    true,
    ["Scientific Investigation", "Data Analysis", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "School assessment + HSC exam",
      pathwayTags: ["hsc", "atar", "science-anchor"],
    }
  ),
  createSubject(
    "hsc-physics",
    "Physics",
    "Science",
    "tier1",
    "high",
    false,
    ["Scientific Investigation", "Data Analysis", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "School assessment + HSC exam",
      pathwayTags: ["hsc", "atar", "science-anchor"],
    }
  ),
  createSubject(
    "hsc-science-ext",
    "Science Extension",
    "Science",
    "tier2",
    "high",
    false,
    ["Research Investigation", "Major Work", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "School assessment + HSC exam",
      pathwayTags: ["hsc", "atar", "extension"],
    }
  ),
  createSubject(
    "hsc-economics",
    "Economics",
    "Humanities",
    "tier3",
    "medium",
    false,
    ["Extended Response", "Data Analysis", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "School assessment + HSC exam",
      pathwayTags: ["hsc", "atar"],
    }
  ),
  createSubject(
    "hsc-french",
    "French Continuers",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "School assessment + HSC exam",
      pathwayTags: ["hsc", "atar", "language-upside"],
    }
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
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "ATAR 50:50 school + exam",
      pathwayTags: ["wace-atar", "english-group"],
    }
  ),
  createSubject(
    "wace-methods",
    "Mathematics Methods ATAR",
    "Mathematics",
    "tier1",
    "high",
    true,
    ["Modelling Task", "Short Response Test", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "ATAR 50:50 school + exam",
      pathwayTags: ["wace-atar", "maths-spine"],
    }
  ),
  createSubject(
    "wace-spec",
    "Mathematics Specialist ATAR",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Modelling Task", "Short Response Test", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "ATAR 50:50 school + exam",
      pathwayTags: ["wace-atar", "extension"],
    }
  ),
  createSubject(
    "wace-chem",
    "Chemistry ATAR",
    "Science",
    "tier1",
    "high",
    true,
    ["Scientific Investigation", "Practical Report", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "ATAR 50:50 school + exam",
      pathwayTags: ["wace-atar", "science-anchor"],
    }
  ),
  createSubject(
    "wace-human-bio",
    "Human Biology ATAR",
    "Science",
    "tier2",
    "medium",
    true,
    ["Scientific Investigation", "Data Analysis", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "ATAR 50:50 school + exam",
      pathwayTags: ["wace-atar", "science-anchor"],
    }
  ),
  createSubject(
    "wace-physics",
    "Physics ATAR",
    "Science",
    "tier1",
    "high",
    false,
    ["Scientific Investigation", "Practical Report", "Exam"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "ATAR 50:50 school + exam",
      pathwayTags: ["wace-atar", "science-anchor"],
    }
  ),
  createSubject(
    "wace-french",
    "French ATAR",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    {
      externalWeight: 50,
      internalWeight: 50,
      examStyle: "ATAR 50:50 school + exam",
      pathwayTags: ["wace-atar", "language-upside"],
    }
  ),
  createSubject(
    "wace-est-general",
    "General Pathway Model",
    "Cross-disciplinary",
    "tier3",
    "low",
    false,
    ["School Assessment", "Externally Set Task"],
    {
      note: "Represents WA General/Foundation courses with EST included in school-based assessment.",
      externalWeight: 0,
      internalWeight: 100,
      examStyle: "EST inside school-based assessment",
      atarEligible: false,
      pathwayTags: ["wace-general", "est"],
    }
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
    {
      note: "School-based backbone subject.",
      externalWeight: 0,
      internalWeight: 100,
      examStyle: "Continuous school-based assessment",
      pathwayTags: ["act", "school-based", "english-group"],
    }
  ),
  createSubject(
    "act-literature",
    "Literature T",
    "English",
    "tier2",
    "medium",
    false,
    ["Extended Response", "Oral Presentation", "Research Investigation"],
    {
      externalWeight: 0,
      internalWeight: 100,
      examStyle: "Continuous school-based assessment",
      pathwayTags: ["act", "school-based", "english-group"],
    }
  ),
  createSubject(
    "act-methods",
    "Mathematical Methods T",
    "Mathematics",
    "tier1",
    "high",
    true,
    ["Modelling Task", "Short Response Test", "Research Investigation"],
    {
      externalWeight: 0,
      internalWeight: 100,
      examStyle: "Continuous school-based assessment",
      pathwayTags: ["act", "school-based", "maths-spine"],
    }
  ),
  createSubject(
    "act-spec",
    "Specialist Mathematics T",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Modelling Task", "Short Response Test", "Research Investigation"],
    {
      externalWeight: 0,
      internalWeight: 100,
      examStyle: "Continuous school-based assessment",
      pathwayTags: ["act", "school-based", "extension"],
    }
  ),
  createSubject(
    "act-chem",
    "Chemistry T",
    "Science",
    "tier1",
    "high",
    true,
    ["Scientific Investigation", "Practical Report", "Data Analysis"],
    {
      externalWeight: 0,
      internalWeight: 100,
      examStyle: "Continuous school-based assessment",
      pathwayTags: ["act", "school-based", "science-anchor"],
    }
  ),
  createSubject(
    "act-bio",
    "Biology T",
    "Science",
    "tier2",
    "medium",
    true,
    ["Scientific Investigation", "Practical Report", "Data Analysis"],
    {
      externalWeight: 0,
      internalWeight: 100,
      examStyle: "Continuous school-based assessment",
      pathwayTags: ["act", "school-based", "science-anchor"],
    }
  ),
  createSubject(
    "act-physics",
    "Physics T",
    "Science",
    "tier1",
    "high",
    false,
    ["Scientific Investigation", "Practical Report", "Data Analysis"],
    {
      externalWeight: 0,
      internalWeight: 100,
      examStyle: "Continuous school-based assessment",
      pathwayTags: ["act", "school-based", "science-anchor"],
    }
  ),
  createSubject(
    "act-french",
    "French T",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    {
      externalWeight: 0,
      internalWeight: 100,
      examStyle: "Continuous school-based assessment",
      pathwayTags: ["act", "school-based", "language-upside"],
    }
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
    {
      externalWeight: 40,
      internalWeight: 60,
      examStyle: "Level 3/4 internal + external",
      pathwayTags: ["tce", "level3", "english-group", "multi-year"],
    }
  ),
  createSubject(
    "tce-literature",
    "English Literature Level 3",
    "English",
    "tier2",
    "medium",
    false,
    ["Extended Response", "Oral Presentation", "Exam"],
    {
      externalWeight: 40,
      internalWeight: 60,
      examStyle: "Level 3/4 internal + external",
      pathwayTags: ["tce", "level3", "english-group", "multi-year"],
    }
  ),
  createSubject(
    "tce-methods",
    "Mathematics Methods Foundation Level 4",
    "Mathematics",
    "tier1",
    "high",
    true,
    ["Modelling Task", "Short Response Test", "Exam"],
    {
      externalWeight: 40,
      internalWeight: 60,
      examStyle: "Level 3/4 internal + external",
      pathwayTags: ["tce", "level4", "maths-spine", "multi-year"],
    }
  ),
  createSubject(
    "tce-spec",
    "Specialist Mathematics Level 4",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Modelling Task", "Short Response Test", "Exam"],
    {
      externalWeight: 40,
      internalWeight: 60,
      examStyle: "Level 3/4 internal + external",
      pathwayTags: ["tce", "level4", "extension", "multi-year"],
    }
  ),
  createSubject(
    "tce-chem",
    "Chemistry Level 3",
    "Science",
    "tier1",
    "high",
    true,
    ["Scientific Investigation", "Practical Report", "Exam"],
    {
      externalWeight: 40,
      internalWeight: 60,
      examStyle: "Level 3/4 internal + external",
      pathwayTags: ["tce", "level3", "science-anchor", "multi-year"],
    }
  ),
  createSubject(
    "tce-bio",
    "Biology Level 3",
    "Science",
    "tier2",
    "medium",
    true,
    ["Scientific Investigation", "Practical Report", "Exam"],
    {
      externalWeight: 40,
      internalWeight: 60,
      examStyle: "Level 3/4 internal + external",
      pathwayTags: ["tce", "level3", "science-anchor", "multi-year"],
    }
  ),
  createSubject(
    "tce-physics",
    "Physics Level 4",
    "Science",
    "tier1",
    "high",
    false,
    ["Scientific Investigation", "Practical Report", "Exam"],
    {
      externalWeight: 40,
      internalWeight: 60,
      examStyle: "Level 3/4 internal + external",
      pathwayTags: ["tce", "level4", "science-anchor", "multi-year"],
    }
  ),
  createSubject(
    "tce-french",
    "French Level 3",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    {
      externalWeight: 40,
      internalWeight: 60,
      examStyle: "Level 3/4 internal + external",
      pathwayTags: ["tce", "level3", "language-upside", "multi-year"],
    }
  ),
  createSubject(
    "tce-foundation-model",
    "Level 1–2 Foundation Pathway Model",
    "Cross-disciplinary",
    "tier3",
    "low",
    false,
    ["School Assessment", "Portfolio"],
    {
      note: "Represents lower-level courses that are internal-only and usually not the engine of a competitive TE build.",
      externalWeight: 0,
      internalWeight: 100,
      examStyle: "Internal-only lower-level course",
      atarEligible: false,
      pathwayTags: ["tce", "level1-2", "pathway"],
    }
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
    {
      externalWeight: 30,
      internalWeight: 70,
      examStyle: "Stage 2 70/30",
      pathwayTags: ["sace", "stage2", "english-group"],
    }
  ),
  createSubject(
    "sace-literary",
    "English Literary Studies",
    "English",
    "tier2",
    "medium",
    false,
    ["Extended Response", "Oral Presentation", "Exam"],
    {
      externalWeight: 30,
      internalWeight: 70,
      examStyle: "Stage 2 70/30",
      pathwayTags: ["sace", "stage2", "english-group"],
    }
  ),
  createSubject(
    "sace-methods",
    "Mathematical Methods",
    "Mathematics",
    "tier1",
    "high",
    true,
    ["Modelling Task", "Short Response Test", "Exam"],
    {
      externalWeight: 30,
      internalWeight: 70,
      examStyle: "Stage 2 70/30",
      pathwayTags: ["sace", "stage2", "maths-spine"],
    }
  ),
  createSubject(
    "sace-spec",
    "Specialist Mathematics",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Modelling Task", "Short Response Test", "Exam"],
    {
      externalWeight: 30,
      internalWeight: 70,
      examStyle: "Stage 2 70/30",
      pathwayTags: ["sace", "stage2", "extension"],
    }
  ),
  createSubject(
    "sace-chem",
    "Chemistry",
    "Science",
    "tier1",
    "high",
    true,
    ["Scientific Investigation", "Practical Report", "Exam"],
    {
      externalWeight: 30,
      internalWeight: 70,
      examStyle: "Stage 2 70/30",
      pathwayTags: ["sace", "stage2", "science-anchor"],
    }
  ),
  createSubject(
    "sace-bio",
    "Biology",
    "Science",
    "tier2",
    "medium",
    true,
    ["Scientific Investigation", "Practical Report", "Exam"],
    {
      externalWeight: 30,
      internalWeight: 70,
      examStyle: "Stage 2 70/30",
      pathwayTags: ["sace", "stage2", "science-anchor"],
    }
  ),
  createSubject(
    "sace-physics",
    "Physics",
    "Science",
    "tier1",
    "high",
    false,
    ["Scientific Investigation", "Practical Report", "Exam"],
    {
      externalWeight: 30,
      internalWeight: 70,
      examStyle: "Stage 2 70/30",
      pathwayTags: ["sace", "stage2", "science-anchor"],
    }
  ),
  createSubject(
    "sace-aif",
    "Activating Identities and Futures",
    "Cross-disciplinary",
    "tier2",
    "medium",
    false,
    ["Research Investigation", "Portfolio", "Oral Presentation"],
    {
      note: "Compulsory Stage 2 feature in the modern SACE structure.",
      externalWeight: 0,
      internalWeight: 100,
      examStyle: "School-assessed compulsory Stage 2 subject",
      pathwayTags: ["sace", "stage2", "compulsory"],
    }
  ),
  createSubject(
    "sace-eif",
    "Exploring Identities and Futures",
    "Cross-disciplinary",
    "tier2",
    "medium",
    false,
    ["Research Investigation", "Portfolio", "Oral Presentation"],
    {
      note: "Year 10/11-facing compulsory Stage 1 building block.",
      externalWeight: 0,
      internalWeight: 100,
      examStyle: "Stage 1 school assessed",
      atarEligible: false,
      stageAvailability: ["year10", "year11"],
      years: "Year 10-12",
      recommendedYear10: true,
      recommendedYear11: true,
      recommendedYear12: false,
      pathwayTags: ["sace", "stage1", "compulsory", "year10"],
    }
  ),
  createSubject(
    "sace-french",
    "French",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    {
      externalWeight: 30,
      internalWeight: 70,
      examStyle: "Stage 2 70/30",
      pathwayTags: ["sace", "stage2", "language-upside"],
    }
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
    {
      externalWeight: 30,
      internalWeight: 70,
      examStyle: "Stage 2 70/30",
      pathwayTags: ["ntcet", "stage2", "english-group"],
    }
  ),
  createSubject(
    "ntcet-methods",
    "Mathematical Methods",
    "Mathematics",
    "tier1",
    "high",
    true,
    ["Modelling Task", "Short Response Test", "Exam"],
    {
      externalWeight: 30,
      internalWeight: 70,
      examStyle: "Stage 2 70/30",
      pathwayTags: ["ntcet", "stage2", "maths-spine"],
    }
  ),
  createSubject(
    "ntcet-spec",
    "Specialist Mathematics",
    "Mathematics",
    "tier1",
    "veryHigh",
    false,
    ["Modelling Task", "Short Response Test", "Exam"],
    {
      externalWeight: 30,
      internalWeight: 70,
      examStyle: "Stage 2 70/30",
      pathwayTags: ["ntcet", "stage2", "extension"],
    }
  ),
  createSubject(
    "ntcet-chem",
    "Chemistry",
    "Science",
    "tier1",
    "high",
    true,
    ["Scientific Investigation", "Practical Report", "Exam"],
    {
      externalWeight: 30,
      internalWeight: 70,
      examStyle: "Stage 2 70/30",
      pathwayTags: ["ntcet", "stage2", "science-anchor"],
    }
  ),
  createSubject(
    "ntcet-bio",
    "Biology",
    "Science",
    "tier2",
    "medium",
    true,
    ["Scientific Investigation", "Practical Report", "Exam"],
    {
      externalWeight: 30,
      internalWeight: 70,
      examStyle: "Stage 2 70/30",
      pathwayTags: ["ntcet", "stage2", "science-anchor"],
    }
  ),
  createSubject(
    "ntcet-physics",
    "Physics",
    "Science",
    "tier1",
    "high",
    false,
    ["Scientific Investigation", "Practical Report", "Exam"],
    {
      externalWeight: 30,
      internalWeight: 70,
      examStyle: "Stage 2 70/30",
      pathwayTags: ["ntcet", "stage2", "science-anchor"],
    }
  ),
  createSubject(
    "ntcet-eif",
    "Exploring Identities and Futures",
    "Cross-disciplinary",
    "tier2",
    "medium",
    false,
    ["Research Investigation", "Portfolio", "Oral Presentation"],
    {
      note: "Compulsory senior-building element in the SACE-aligned NT structure.",
      externalWeight: 0,
      internalWeight: 100,
      examStyle: "Stage 1 school assessed",
      atarEligible: false,
      stageAvailability: ["year10", "year11"],
      years: "Year 10-12",
      recommendedYear10: true,
      recommendedYear11: true,
      recommendedYear12: false,
      pathwayTags: ["ntcet", "stage1", "compulsory", "year10"],
    }
  ),
  createSubject(
    "ntcet-french",
    "French",
    "Languages",
    "tier1",
    "veryHigh",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    {
      externalWeight: 30,
      internalWeight: 70,
      examStyle: "Stage 2 70/30",
      pathwayTags: ["ntcet", "stage2", "language-upside"],
    }
  ),
];

const IB_SUBJECTS: SubjectItem[] = [
  createSubject(
    "ib-english-a",
    "English A",
    "English",
    "tier2",
    "medium",
    true,
    ["Essay", "Oral Presentation", "Exam"],
    {
      note: "Internal assessment plus externally assessed exam structure.",
      externalWeight: 80,
      internalWeight: 20,
      examStyle: "IB internal assessment + external examiners",
      pathwayTags: ["ib", "diploma", "english-group"],
    }
  ),
  createSubject(
    "ib-maths-aa",
    "Mathematics: Analysis and Approaches",
    "Mathematics",
    "tier1",
    "high",
    true,
    ["Exam", "Investigation", "Problem Solving"],
    {
      externalWeight: 80,
      internalWeight: 20,
      examStyle: "IB IA + external exam papers",
      pathwayTags: ["ib", "diploma", "maths-spine"],
    }
  ),
  createSubject(
    "ib-maths-ai",
    "Mathematics: Applications and Interpretation",
    "Mathematics",
    "tier3",
    "medium",
    false,
    ["Exam", "Investigation", "Problem Solving"],
    {
      externalWeight: 80,
      internalWeight: 20,
      examStyle: "IB IA + external exam papers",
      pathwayTags: ["ib", "diploma"],
    }
  ),
  createSubject(
    "ib-chem",
    "Chemistry",
    "Science",
    "tier1",
    "high",
    true,
    ["Practical", "Investigation", "Exam"],
    {
      externalWeight: 80,
      internalWeight: 20,
      examStyle: "IB IA + external exam papers",
      pathwayTags: ["ib", "diploma", "science-anchor"],
    }
  ),
  createSubject(
    "ib-bio",
    "Biology",
    "Science",
    "tier2",
    "medium",
    true,
    ["Practical", "Investigation", "Exam"],
    {
      externalWeight: 80,
      internalWeight: 20,
      examStyle: "IB IA + external exam papers",
      pathwayTags: ["ib", "diploma", "science-anchor"],
    }
  ),
  createSubject(
    "ib-physics",
    "Physics",
    "Science",
    "tier1",
    "high",
    false,
    ["Practical", "Investigation", "Exam"],
    {
      externalWeight: 80,
      internalWeight: 20,
      examStyle: "IB IA + external exam papers",
      pathwayTags: ["ib", "diploma", "science-anchor"],
    }
  ),
  createSubject(
    "ib-french-b",
    "French B",
    "Languages",
    "tier1",
    "high",
    false,
    ["Exam", "Oral Presentation", "Extended Response"],
    {
      externalWeight: 80,
      internalWeight: 20,
      examStyle: "IB IA + external exam papers",
      pathwayTags: ["ib", "diploma", "language-upside"],
    }
  ),
];

function createGenericBlueprints(
  year10: string,
  year11: string,
  year12: string,
  systemCallout: string
): YearBlueprint[] {
  return [
    {
      year: "year10",
      title: "Year 10 Pathway Builder",
      objective: year10,
      priorities: [
        "Lock a realistic maths and science direction early.",
        "Treat consistency, literacy and work habits as the real compounding edge.",
        "Choose Year 11 subjects based on future flexibility, not just comfort.",
      ],
      avoid: [
        "Pretending Year 10 marks are the final story.",
        "Choosing soft options that close doors too early.",
        "Over-optimising scaling before execution habits exist.",
      ],
      metrics: [
        "English stability",
        "Maths confidence",
        "Science strength",
        "Subject decision confidence",
      ],
      callout: systemCallout,
    },
    {
      year: "year11",
      title: "Year 11 Build Year",
      objective: year11,
      priorities: [
        "Stress-test your subject stack before Year 12 pressure peaks.",
        "Identify unstable subjects early and fix them before they become identity.",
        "Build exam conversion habits even in internal-heavy systems.",
      ],
      avoid: [
        "Using Year 11 as a throwaway year.",
        "Keeping a bad subject mix just because it looked smart on paper.",
        "Ignoring ranking, moderation or internal drift.",
      ],
      metrics: [
        "Internal average",
        "Spread/volatility",
        "Subject viability",
        "Exam-readiness trend",
      ],
      callout: systemCallout,
    },
    {
      year: "year12",
      title: "Year 12 Execution Year",
      objective: year12,
      priorities: [
        "Protect your core scoring subjects first.",
        "Use the real weighting structure of your state instead of generic advice.",
        "Model upside and downside around the subjects that move the most.",
      ],
      avoid: [
        "Fantasy rescue thinking.",
        "Letting one unstable subject leak marks all year.",
        "Confusing hard subjects with good outcomes if execution is weak.",
      ],
      metrics: [
        "Weighted projected score",
        "High-leverage subjects",
        "Exam swing sensitivity",
        "Certificate/ATAR readiness",
      ],
      callout: systemCallout,
    },
  ];
}

const JURISDICTIONS: Record<JurisdictionKey, JurisdictionConfig> = {
  qce: {
    key: "qce",
    label: "Queensland (QCE)",
    certificate: "Queensland Certificate of Education",
    admissionsBody: "QTAC",
    shortAssessment:
      "Queensland is one of the cleanest rules-based systems: General subjects usually use 3 internals plus 1 external, while maths and science are more exam-sensitive at 50/50.",
    internalModelHint:
      "Prioritise IA stability first. Then use externals as a force multiplier rather than a rescue fantasy.",
    externalModelHint:
      "General subjects are not all equally exam-sensitive. Maths and science deserve a sharper external model than generic 25% assumptions.",
    subjectSelectionHint:
      "Build around chemistry plus a real maths spine, then add biology, physics, language strength or another rigorous complement.",
    pathwayMode: "atar-academic",
    systemTone: "Structured, explicit and rules-driven.",
    year10Hint:
      "Use Year 10 to choose the right General pathway and protect maths/science momentum.",
    year11Hint:
      "Year 11 counts for QCE progress, subject fit and readiness even though it is not the final ATAR year.",
    year12Hint:
      "Year 12 is where the 3 IA + 1 EA architecture really matters.",
    assessmentBullets: [
      "General subjects are best tracked as internal and external layers, not one blended blur.",
      "Maths and science subjects are more exam-sensitive than many students assume.",
      "Applied subjects should not be confused with the strongest ATAR-med posture.",
    ],
    scalingBullets: [
      "Methods, Specialist, Chemistry and Physics are the cleanest academic spine.",
      "Languages can create serious upside when authentic strength exists.",
      "Biology helps medicine context, but does not replace the value of a strong maths spine.",
    ],
    medicineBullets: [
      "Chemistry is the strongest science anchor for future flexibility.",
      "Methods is usually the safest maths choice for medicine-facing students.",
      "Biology is useful, but should not replace stronger maths when your ceiling is high.",
    ],
    localPrograms: ["UQ", "Griffith", "Bond", "JCU"],
    defaultStudyGoal: "medicine",
    examWeightingDefault: 25,
    kernel: {
      year10Role: "Pathway planning and SET-style subject architecture year.",
      year11Role: "Builds QCE progress and subject-fit, not final ATAR directly.",
      year12Role: "Main summative year with subject-specific IA/EA structure.",
      internalSummary: "General subjects usually have 3 internals; Applied subjects are internal-only.",
      externalSummary: "Most General subjects have 1 external; maths and science are more exam-weighted.",
      moderationModel: "endorsement-confirmation",
      defaultInternalWeight: 75,
      defaultExternalWeight: 25,
      atarConstruction: "English plus five General subjects, or four General plus one Applied/Cert III pattern.",
      certificateLogic: "QCE completion and ATAR eligibility are related but not identical.",
      specialRules: [
        "Maths/science General subjects are typically 50/50.",
        "Applied subjects are usually not the strongest med-facing path.",
        "Essential English/Maths use common internal assessment structures.",
      ],
    },
    yearBlueprints: createGenericBlueprints(
      "Choose a serious General pathway and keep maths/science momentum alive.",
      "Treat Year 11 as a fit-and-foundation year, not a free pass.",
      "Track IA and EA separately because the weighting architecture matters.",
      "QCE rewards students who understand the subject-type rules, not just the subject names."
    ),
    subjects: QCE_SUBJECTS,
  },
  vce: {
    key: "vce",
    label: "Victoria (VCE)",
    certificate: "Victorian Certificate of Education",
    admissionsBody: "VTAC",
    shortAssessment:
      "VCE rewards sustained school performance and strong exam execution. SAC drift matters more than many students realise.",
    internalModelHint:
      "Use the internals tab to spot whether your SACs are drifting or whether one subject is sabotaging overall consistency.",
    externalModelHint:
      "Model exam outcomes above and below SAC trend. That is where a lot of VCE volatility lives.",
    subjectSelectionHint:
      "Avoid a pretty-looking mix that lacks enough scaling support or maths flexibility.",
    pathwayMode: "atar-academic",
    systemTone: "Moderated school performance plus exam conversion.",
    year10Hint:
      "Year 10 should be used to choose between VCE/VM direction and build the right Unit 1–2 launch.",
    year11Hint:
      "Use Units 1–2 to test whether the subject stack is genuinely executable.",
    year12Hint:
      "Unit 3–4 SAC stability plus exam conversion is the whole game.",
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
    defaultStudyGoal: "medicine",
    examWeightingDefault: 50,
    kernel: {
      year10Role: "Pathway and senior-program selection year.",
      year11Role: "Units 1–2 subject-fit and academic build year.",
      year12Role: "Units 3–4 scored assessment year.",
      internalSummary: "SACs and SATs are school-based but statistically moderated.",
      externalSummary: "At least one external assessment in scored VCE studies.",
      moderationModel: "statistical-moderation",
      defaultInternalWeight: 50,
      defaultExternalWeight: 50,
      atarConstruction: "English group + next best three studies + increments.",
      certificateLogic: "VCE and VCE VM are not the same ATAR pathway.",
      specialRules: [
        "Do not mix VCE academic assumptions with VCE VM.",
        "SAC ranking quality matters because the school component is moderated.",
        "GAT context still matters to the system.",
      ],
    },
    yearBlueprints: createGenericBlueprints(
      "Choose the right VCE pathway and avoid drifting into a stack that looks better than it performs.",
      "Use Units 1–2 to identify whether Methods/Chemistry-style anchors are viable.",
      "Protect SAC performance and exam conversion together because both matter.",
      "VCE punishes students who treat SACs like practice instead of part of the score story."
    ),
    subjects: VCE_SUBJECTS,
  },
  hsc: {
    key: "hsc",
    label: "New South Wales (HSC)",
    certificate: "Higher School Certificate",
    admissionsBody: "UAC",
    shortAssessment:
      "The HSC rewards both school performance and final exam execution, but moderated school assessment and best-unit construction mean the architecture matters.",
    internalModelHint:
      "Track the difference between school-task form and true exam-readiness. Many HSC students confuse those.",
    externalModelHint:
      "Use conservative and optimistic exam scenarios. The final swing matters.",
    subjectSelectionHint:
      "Think in terms of aggregate quality, not just individual course prestige.",
    pathwayMode: "atar-academic",
    systemTone: "Moderated school rank plus HSC exam structure.",
    year10Hint:
      "Use Year 10 to build RoSA-era foundations and choose realistic Preliminary subjects.",
    year11Hint:
      "Year 11 is where subject fit and extension viability should be tested hard.",
    year12Hint:
      "Year 12 HSC performance drives the final best-10-unit story.",
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
    defaultStudyGoal: "medicine",
    examWeightingDefault: 50,
    kernel: {
      year10Role: "RoSA-era foundational year with pathway consequences.",
      year11Role: "Preliminary course build year.",
      year12Role: "HSC exam and moderated school assessment year.",
      internalSummary: "School assessments create rank and moderated school assessment contribution.",
      externalSummary: "HSC exams are central to final outcomes and moderation logic.",
      moderationModel: "statistical-moderation",
      defaultInternalWeight: 50,
      defaultExternalWeight: 50,
      atarConstruction: "Best 2 units of English plus best 8 remaining eligible units.",
      certificateLogic: "HSC completion and ATAR calculation are linked through eligible Board Developed units.",
      specialRules: [
        "Best-unit optimisation matters.",
        "Extension choices can raise ceiling but also volatility.",
        "School rank matters because moderation preserves relative standing.",
      ],
    },
    yearBlueprints: createGenericBlueprints(
      "Use Year 10 to protect the path into Preliminary/HSC subjects that keep medicine options open.",
      "Use Preliminary year to test whether your extension or high-rigour stack is sustainable.",
      "Optimise around the best-10-unit model, not just a list of prestigious courses.",
      "The HSC rewards students who understand ranking, moderation and best-unit construction."
    ),
    subjects: HSC_SUBJECTS,
  },
  wace: {
    key: "wace",
    label: "Western Australia (WACE)",
    certificate: "Western Australian Certificate of Education",
    admissionsBody: "TISC",
    shortAssessment:
      "WA needs a split-brain engine: ATAR courses behave like 50/50 school-plus-exam subjects, while General/Foundation pathways include the EST inside school-based assessment.",
    internalModelHint:
      "Use internals to identify whether the real issue is mastery or just exam conversion.",
    externalModelHint:
      "The external swing can move the picture sharply in ATAR courses, but General/Foundation logic should not be modelled the same way.",
    subjectSelectionHint:
      "Do not let safe course selection flatten your upside too early.",
    pathwayMode: "atar-academic",
    systemTone: "Sharp distinction between ATAR and General/Foundation pathways.",
    year10Hint:
      "Use Year 10 to choose the right WACE lane before you accidentally flatten your ceiling.",
    year11Hint:
      "Stress-test whether you are actually an ATAR-course student or a pathway-course student.",
    year12Hint:
      "ATAR subjects need honest 50/50 modelling. General/Foundation needs EST-aware planning.",
    assessmentBullets: [
      "Course choice should support a strong ATAR ceiling, not just comfort.",
      "Methods, Specialist, Chemistry and Physics remain the cleanest med-facing spine.",
      "Exam discipline matters a lot in WA ATAR courses.",
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
    defaultStudyGoal: "medicine",
    examWeightingDefault: 50,
    kernel: {
      year10Role: "WACE pathway selection year.",
      year11Role: "Senior build year with pathway lock-in risk.",
      year12Role: "ATAR exams or General/Foundation EST completion year.",
      internalSummary: "School marks matter in all streams, but pathway type changes their meaning.",
      externalSummary: "ATAR uses final exams; General/Foundation uses EST within school-based assessment.",
      moderationModel: "school-only",
      defaultInternalWeight: 50,
      defaultExternalWeight: 50,
      atarConstruction: "Best four ATAR course results for university entrance patterning.",
      certificateLogic: "WACE completion and ATAR ambition can diverge sharply.",
      specialRules: [
        "EST is not the same as a classic external exam.",
        "ATAR and General pathways need different UX and advice.",
        "Course type should be surfaced visibly in the engine.",
      ],
    },
    yearBlueprints: createGenericBlueprints(
      "Choose the right WACE lane early and do not confuse comfort with competitiveness.",
      "Use Year 11 to test if the ATAR pathway is truly sustainable.",
      "Model ATAR exams honestly and treat General/Foundation as a different assessment world.",
      "WA needs course-type-aware guidance, not one generic statewide model."
    ),
    subjects: WACE_SUBJECTS,
  },
  act: {
    key: "act",
    label: "ACT SSC",
    certificate: "ACT Senior Secondary Certificate",
    admissionsBody: "UAC / ACT scaling",
    shortAssessment:
      "The ACT is a continuous school-based system. This means consistency is not a side issue — it is the core scoring environment.",
    internalModelHint:
      "Treat the internals layer as the engine room, not just a side panel.",
    externalModelHint:
      "Here the externals modeller acts more like a scaling pressure proxy than a literal subject exam predictor.",
    subjectSelectionHint:
      "Prioritise consistency and genuine academic strength.",
    pathwayMode: "school-based",
    systemTone: "Continuous school-based performance with scaling context.",
    year10Hint:
      "Use Year 10 to build the work habits needed for continuous assessment.",
    year11Hint:
      "Every unit matters more in a school-based system than students think.",
    year12Hint:
      "Year 12 is about sustained performance, not last-minute exam rescue.",
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
    defaultStudyGoal: "medicine",
    examWeightingDefault: 0,
    kernel: {
      year10Role: "Pre-senior preparation year.",
      year11Role: "Senior units begin to matter in a continuous system.",
      year12Role: "School-based tertiary record is shaped here.",
      internalSummary: "Assessment is continuous and school-based.",
      externalSummary: "No subject-specific external exams; AST/scaling context sits outside the subject exam model.",
      moderationModel: "continuous-school-based",
      defaultInternalWeight: 100,
      defaultExternalWeight: 0,
      atarConstruction: "Tertiary scores built from school-based T/H courses with ACT scaling context.",
      certificateLogic: "The certificate is school-based and unit-driven rather than classic exam-driven.",
      specialRules: [
        "Do not force ACT students into an exam-countdown UX.",
        "Subject consistency and unit-by-unit tracking matter most.",
        "External model is a proxy here, not a literal subject exam model.",
      ],
    },
    yearBlueprints: createGenericBlueprints(
      "Build the habits needed for a continuous-assessment system.",
      "Use Year 11 to create a durable school-based scoring pattern.",
      "Treat sustained performance as the real differentiator, not last-minute rescue thinking.",
      "ACT students need a consistency dashboard more than an exam dashboard."
    ),
    subjects: ACT_SUBJECTS,
  },
  tce: {
    key: "tce",
    label: "Tasmania (TCE)",
    certificate: "Tasmanian Certificate of Education",
    admissionsBody: "UTAS / interstate pathways",
    shortAssessment:
      "Tasmania is multi-year and level-sensitive. Level 1–2 courses are internal-only, while Level 3–4 courses carry the TE/ATAR weight through mixed internal and external assessment.",
    internalModelHint:
      "Use internals to monitor consistency across levelled courses and across years, not just within a single current cohort.",
    externalModelHint:
      "Some externals are exam-like, others are less straightforward. Model with care and remember that the build can span multiple senior years.",
    subjectSelectionHint:
      "Optimise for academic strength and level selection, not just convenience.",
    pathwayMode: "multi-year",
    systemTone: "Level-based and multi-year rather than purely Year-12-centric.",
    year10Hint:
      "Use Year 10 to understand that level choice later matters just as much as subject title.",
    year11Hint:
      "Year 11 can already become part of the real TE/ATAR story through Level 3/4 choices.",
    year12Hint:
      "Year 12 should be planned as part of a two-year scoring window, not in isolation.",
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
    defaultStudyGoal: "medicine",
    examWeightingDefault: 40,
    kernel: {
      year10Role: "Pre-senior pathway planning year.",
      year11Role: "Potential TE-building year through Level 3/4 course entry.",
      year12Role: "Second major TE-building year, sometimes alongside Year 13 pathways.",
      internalSummary: "Level 1–2 are internal-only; Level 3–4 include internal assessment.",
      externalSummary: "Level 3–4 can include external assessment in multiple forms.",
      moderationModel: "level-based-external",
      defaultInternalWeight: 60,
      defaultExternalWeight: 40,
      atarConstruction: "Best Level 3/4 results across two senior-secondary years feed the TE/ATAR structure.",
      certificateLogic: "TCE completion and TE-building involve levels and multiple years.",
      specialRules: [
        "Do not make Tasmania too Year-12-only.",
        "Course level must be visible in the UI.",
        "Year 11 performance can genuinely matter to TE posture.",
      ],
    },
    yearBlueprints: createGenericBlueprints(
      "Understand early that later level selection will matter just as much as the subject names.",
      "Use Year 11 to start the strongest possible Level 3/4 build if you are ready.",
      "Optimise as a multi-year engine, not just a one-year final sprint.",
      "Tasmanian students need a rolling multi-year view, not a generic single-Year-12 tracker."
    ),
    subjects: TCE_SUBJECTS,
  },
  sace: {
    key: "sace",
    label: "South Australia (SACE)",
    certificate: "South Australian Certificate of Education",
    admissionsBody: "SATAC",
    shortAssessment:
      "SACE works best when the engine respects school assessment as the bigger lever and Stage 2 as the key scoring posture, while still recognising that Year 10 already matters through EIF-style senior structures.",
    internalModelHint:
      "School assessment is usually the bigger lever. Treat it that way.",
    externalModelHint:
      "Use the externals modeller to test sensitivity, not fantasy rescues.",
    subjectSelectionHint:
      "Choose a Stage 2 stack that keeps ceiling and flexibility high.",
    pathwayMode: "atar-academic",
    systemTone: "School-assessment-heavy with a clean Stage 2 structure.",
    year10Hint:
      "Year 10 already matters because senior-certificate logic starts earlier than many students realise.",
    year11Hint:
      "Stage 1 is not the ATAR endpoint, but it is the architecture year.",
    year12Hint:
      "Stage 2 is where the 70/30 posture becomes decisive.",
    assessmentBullets: [
      "Stable school assessment matters more than students often think.",
      "External tasks still matter, especially in exam-facing subjects.",
      "Cross-disciplinary compulsory subjects change the feel of the stack.",
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
    defaultStudyGoal: "medicine",
    examWeightingDefault: 30,
    kernel: {
      year10Role: "Senior-certificate-linked planning year with EIF relevance.",
      year11Role: "Stage 1 school-assessed build year.",
      year12Role: "Stage 2 70/30 assessment year.",
      internalSummary: "Stage 1 is school assessed; Stage 2 remains mostly school assessment.",
      externalSummary: "Stage 2 includes a 30% external component.",
      moderationModel: "sample-moderation",
      defaultInternalWeight: 70,
      defaultExternalWeight: 30,
      atarConstruction: "University aggregate built from best scaled 90 credits.",
      certificateLogic: "Certificate and ATAR logic both rely on Stage 1/2 credit architecture.",
      specialRules: [
        "Year 10 matters more here than in many states.",
        "Stage 2 posture matters more than generic Year 12 advice.",
        "Compulsory cross-disciplinary subjects should be visible in the engine.",
      ],
    },
    yearBlueprints: createGenericBlueprints(
      "Treat Year 10 as an early senior-planning year, not just generic junior school.",
      "Build Stage 1 cleanly because bad structure leaks into Stage 2.",
      "Attack Stage 2 with a 70/30 mindset: school assessment first, externals second.",
      "SACE students need Stage-based guidance, not generic year-level-only guidance."
    ),
    subjects: SACE_SUBJECTS,
  },
  ntcet: {
    key: "ntcet",
    label: "Northern Territory (NTCET)",
    certificate: "Northern Territory Certificate of Education and Training",
    admissionsBody: "SATAC / interstate pathways",
    shortAssessment:
      "NTCET should be treated as an SA/NT shared kernel with NT wording: Stage 1 build, Stage 2 execution, strong school-assessment backbone and a 30% external layer.",
    internalModelHint:
      "Track Stage 2 performance very hard. That is where your real story lives.",
    externalModelHint:
      "The external component matters, but not enough to rescue weak school performance.",
    subjectSelectionHint:
      "Build a clean Stage 2 backbone first.",
    pathwayMode: "atar-academic",
    systemTone: "SACE-aligned senior structure with NT framing.",
    year10Hint:
      "Year 10 should be treated as early senior setup, not just generic foundation.",
    year11Hint:
      "Stage 1 is your structural launch year.",
    year12Hint:
      "Stage 2 is where subject architecture and execution matter most.",
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
    defaultStudyGoal: "medicine",
    examWeightingDefault: 30,
    kernel: {
      year10Role: "Early senior planning year with compulsory structure implications.",
      year11Role: "Stage 1 build year.",
      year12Role: "Stage 2 execution year.",
      internalSummary: "School assessment is the dominant layer.",
      externalSummary: "Stage 2 adds a 30% external component.",
      moderationModel: "sample-moderation",
      defaultInternalWeight: 70,
      defaultExternalWeight: 30,
      atarConstruction: "SATAC-style aggregate pattern via scaled Stage 2 results.",
      certificateLogic: "Certificate structure closely follows the SACE-style senior pattern.",
      specialRules: [
        "NT can share a rules kernel with SA but should retain NT credential wording.",
        "Year 10 and Stage 1 setup should not be hidden.",
        "The external layer should be shown as important but not dominant.",
      ],
    },
    yearBlueprints: createGenericBlueprints(
      "Treat Year 10 as early senior setup rather than something disposable.",
      "Build Stage 1 with a clean, medicine-facing subject architecture.",
      "Use Stage 2 as the real execution year and prioritise school-assessment stability.",
      "NTCET guidance works best when it behaves like a clean SA/NT shared assessment kernel."
    ),
    subjects: NTCET_SUBJECTS,
  },
  ib: {
    key: "ib",
    label: "International Baccalaureate (IB)",
    certificate: "IB Diploma Programme",
    admissionsBody: "State conversion / tertiary rank conversion",
    shortAssessment:
      "IB should be its own stream inside the engine: internal assessments exist, but the system is mostly externally assessed and later converted for Australian tertiary entry.",
    internalModelHint:
      "Track IA quality carefully, but do not forget that IB is still mostly exam-driven.",
    externalModelHint:
      "Your external model should be more exam-heavy than in most Australian state systems.",
    subjectSelectionHint:
      "For medicine-facing students, build around chemistry and a serious maths choice, then add biology or physics based on strength.",
    pathwayMode: "ib-diploma",
    systemTone: "Nationally portable and heavily exam-driven.",
    year10Hint:
      "Use Year 10 to decide whether IB is genuinely the right academic style for you.",
    year11Hint:
      "Year 11 is the launch year for IA discipline and subject architecture.",
    year12Hint:
      "Year 12 is heavily exam-sensitive and should not be treated like a school-heavy local system.",
    assessmentBullets: [
      "Internal assessment exists, but IB is mostly externally assessed.",
      "Subject choice and level choice matter immediately.",
      "The style of assessment is often more globally standardised than state systems.",
    ],
    scalingBullets: [
      "Maths AA, Chemistry and Physics/Biology create strong academic posture.",
      "Language strength can still create upside.",
      "IB should not be forced into a state-style scaling narrative.",
    ],
    medicineBullets: [
      "Chemistry is still a core medicine-facing anchor.",
      "A serious maths subject keeps more options open.",
      "IB should be treated as its own stream, not a bolt-on afterthought.",
    ],
    localPrograms: ["State rank conversion", "Interstate medicine pathways"],
    defaultStudyGoal: "ib-medicine",
    examWeightingDefault: 80,
    kernel: {
      year10Role: "Pre-IB decision year.",
      year11Role: "IB launch year with IA discipline and course architecture.",
      year12Role: "Final exam-heavy Diploma year.",
      internalSummary: "Internal assessments are teacher-marked and externally moderated.",
      externalSummary: "Most course weight sits in external exams marked by IB examiners.",
      moderationModel: "external-moderation",
      defaultInternalWeight: 20,
      defaultExternalWeight: 80,
      atarConstruction: "Converted tertiary rank / notional ATAR style entry logic rather than state raw score logic.",
      certificateLogic: "IB completion and Australian tertiary conversion sit on top of Diploma results.",
      specialRules: [
        "Do not force IB into a state-specific subject architecture.",
        "Keep IA and exam layers visible.",
        "Show it as a separate pathway in the UX.",
      ],
    },
    yearBlueprints: createGenericBlueprints(
      "Decide whether the IB style genuinely suits your strengths before committing.",
      "Use Year 11 to establish IA quality and a strong subject architecture.",
      "Treat Year 12 as heavily exam-sensitive and globally structured.",
      "IB deserves a distinct engine mode rather than being squeezed into a state model."
    ),
    subjects: IB_SUBJECTS,
  },
};

function getGoalMultiplier(goal: StudyGoal) {
  if (goal === "medicine") return 1;
  if (goal === "high-atar") return 0.92;
  if (goal === "balanced") return 0.82;
  if (goal === "pathway-only") return 0.68;
  return 1;
}

function computeStateEngine(
  config: JurisdictionConfig,
  selectedIds: string[],
  currentYear: YearLevel,
  studyGoal: StudyGoal
) {
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
  const examPressure = average(
    chosen.map(
      (subject) => (subject.externalWeight ?? config.examWeightingDefault) / 100
    )
  );
  const atarEligibleCount = chosen.filter((subject) => subject.atarEligible !== false).length;
  const currentYearAligned = chosen.filter((subject) =>
    subject.stageAvailability?.includes(currentYear)
  ).length;

  const chemistrySelected = chosen.some((subject) =>
    subject.name.toLowerCase().includes("chem")
  );
  const methodsLikeSelected = chosen.some((subject) => {
    const lower = subject.name.toLowerCase();
    return (
      lower.includes("methods") ||
      lower.includes("advanced") ||
      lower.includes("specialist") ||
      lower.includes("extension") ||
      lower.includes("analysis and approaches")
    );
  });
  const englishSelected = chosen.some((subject) => subject.area === "English");

  const goalMultiplier = getGoalMultiplier(studyGoal);

  const readinessBase =
    chosen.length === 0
      ? 0
      : tier1Count * 16 +
        medAnchors * 12 +
        scalingAdvantage * 28 +
        scienceCount * 6 +
        mathsCount * 10 +
        Math.min(languageCount, 1) * 5 +
        academicSpread * 2 +
        atarEligibleCount * 2 +
        currentYearAligned * 2;

  const readiness = Math.min(100, Math.round(readinessBase * goalMultiplier));

  let posture = "Thin";
  let postureTone = "border-rose-200 bg-rose-50 text-rose-950";

  if (readiness >= 78) {
    posture = "Competitive Foundation";
    postureTone = "border-emerald-200 bg-emerald-50 text-emerald-950";
  } else if (readiness >= 58) {
    posture = "Promising but Incomplete";
    postureTone = "border-amber-200 bg-amber-50 text-amber-950";
  }

  let pressurePoint =
    !chemistrySelected
      ? "Your current mix is missing chemistry, which usually weakens medicine flexibility."
      : !methodsLikeSelected
        ? "Your current mix lacks a serious maths spine. That can narrow options and flatten upside."
        : chosen.length < 5 && currentYear !== "year10"
          ? "Your mix still looks under-built. Add the rest of the stack before trusting the read."
          : "The next gains come from execution quality, not just collecting more hard subjects.";

  if (currentYear === "year10") {
    pressurePoint = !mathsCount
      ? "For Year 10, the biggest risk is drifting away from a later maths spine too early."
      : !scienceCount
        ? "For Year 10, keep science momentum alive so your Year 11 options stay open."
        : "Year 10 is less about final ATAR math and more about protecting future flexibility.";
  }

  const insights: StrategyInsight[] = [];

  if (!englishSelected && currentYear !== "year10") {
    insights.push({
      title: "English layer missing",
      body: "Your selected stack does not currently show an English pathway, which weakens any realistic ATAR build.",
      tone: "warn",
    });
  }

  if (config.pathwayMode === "school-based") {
    insights.push({
      title: "ACT-style consistency bias",
      body: "This system rewards sustained school performance far more than last-minute external rescue.",
      tone: "neutral",
    });
  }

  if (config.pathwayMode === "multi-year") {
    insights.push({
      title: "Multi-year scoring logic",
      body: "This jurisdiction should be treated as a rolling two-year build, not just a Year 12 sprint.",
      tone: "neutral",
    });
  }

  if (examPressure >= 0.45) {
    insights.push({
      title: "Exam sensitivity is high",
      body: "Your current subject set carries a meaningful external swing, so exam conversion will matter a lot.",
      tone: "warn",
    });
  } else {
    insights.push({
      title: "Internal leverage is strong",
      body: "Your current subject set is relatively school-assessment friendly, so consistency can compound hard.",
      tone: "good",
    });
  }

  if (chemistrySelected && methodsLikeSelected) {
    insights.push({
      title: "Core med spine present",
      body: "You already have the strongest default medicine-facing backbone: chemistry plus a serious maths pathway.",
      tone: "good",
    });
  }

  return {
    chosen,
    tier1Count,
    medAnchors,
    scienceCount,
    mathsCount,
    languageCount,
    academicSpread,
    atarEligibleCount,
    scalingAdvantagePercent: Math.round(scalingAdvantage * 100),
    examPressurePercent: Math.round(examPressure * 100),
    readiness,
    posture,
    postureTone,
    chemistrySelected,
    methodsLikeSelected,
    englishSelected,
    pressurePoint,
    insights,
  };
}

function computeInternals(
  rows: InternalRow[],
  subjects: SubjectItem[],
  currentYear: YearLevel
) {
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
      consistencyScore: clamp(100 - spread * 4, 0, 100),
    };
  });

  const mostVolatile = [...items].sort((a, b) => b.spread - a.spread)[0] || null;
  const highestImpact =
    [...items].sort((a, b) => b.weightedImpact - a.weightedImpact)[0] || null;
  const weakestAverage = [...items].sort((a, b) => a.avg - b.avg)[0] || null;
  const stableCore = [...items].filter((item) => item.avg >= 85 && item.spread <= 6);
  const overallAverage = items.length ? average(items.map((item) => item.avg)) : 0;
  const overallConsistency = items.length
    ? average(items.map((item) => item.consistencyScore))
    : 0;

  let yearMessage =
    "Stable internal subjects are what give you room to attack harder ones.";
  if (currentYear === "year10") {
    yearMessage =
      "In Year 10, internals are mostly about proving subject-fit and building habits that survive into senior years.";
  } else if (currentYear === "year11") {
    yearMessage =
      "In Year 11, internals tell you whether your subject stack is sustainable before Year 12 pressure peaks.";
  }

  return {
    items,
    mostVolatile,
    highestImpact,
    weakestAverage,
    stableCore,
    overallAverage: Number(overallAverage.toFixed(1)),
    overallConsistency: Number(overallConsistency.toFixed(1)),
    yearMessage,
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

function getYearBlueprint(config: JurisdictionConfig, year: YearLevel) {
  return config.yearBlueprints.find((item) => item.year === year) ?? config.yearBlueprints[0];
}

function getYearSensitiveSubjects(
  config: JurisdictionConfig,
  year: YearLevel,
  studyGoal: StudyGoal
) {
  return config.subjects.filter((subject) => {
    const yearOk = subject.stageAvailability?.includes(year);
    if (!yearOk) return false;

    if (year === "year10") {
      return (
        subject.recommendedYear10 ||
        YEAR10_MED_FOUNDATIONS.includes(subject.area as (typeof YEAR10_MED_FOUNDATIONS)[number]) ||
        subject.pathwayTags?.includes("compulsory")
      );
    }

    if (studyGoal === "pathway-only") return true;
    if (studyGoal === "high-atar") {
      return subject.tier !== "tier3" || subject.scaling !== "low";
    }
    if (studyGoal === "ib-medicine") {
      return config.key === "ib" ? true : subject.recommendedForMed || subject.tier === "tier1";
    }

    return subject.recommendedForMed || subject.tier !== "tier3";
  });
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
              className="mt-4 inline-flex items-center rounded-xl bg-black px-4 py-2 text-white"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      ) : null}
    </section>
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

function InsightCard({ insight }: { insight: StrategyInsight }) {
  const tone =
    insight.tone === "good"
      ? "border-emerald-200 bg-emerald-50"
      : insight.tone === "warn"
        ? "border-amber-200 bg-amber-50"
        : "border-slate-200 bg-slate-50";

  return (
    <div className={cx("rounded-2xl border p-4", tone)}>
      <p className="text-sm font-bold text-slate-950">{insight.title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-600">{insight.body}</p>
    </div>
  );
}

function StrategyRail({
  config,
  currentYear,
  studyGoal,
}: {
  config: JurisdictionConfig;
  currentYear: YearLevel;
  studyGoal: StudyGoal;
}) {
  const yearTag = yearMeta(currentYear);
  const moderation = moderationMeta(config.kernel.moderationModel);

  return (
    <SoftCard className="p-6 sm:p-7">
      <div className="flex flex-wrap gap-2">
        <Pill className={yearTag.tone}>{yearTag.label}</Pill>
        <Pill className={moderation.tone}>{moderation.label}</Pill>
        <Pill className="border-slate-200 bg-slate-50 text-slate-600">
          {GOAL_OPTIONS.find((item) => item.value === studyGoal)?.label}
        </Pill>
      </div>

      <div className="mt-4 space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-950">System tone</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {config.systemTone}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-bold text-slate-950">This year matters because</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {currentYear === "year10"
              ? config.year10Hint
              : currentYear === "year11"
                ? config.year11Hint
                : config.year12Hint}
          </p>
        </div>
      </div>
    </SoftCard>
  );
}

export default function StudyEngineClient({
  isPremium,
}: {
  isPremium: boolean;
}) {
  const [activeTab, setActiveTab] = useState<EngineTab>("overview");
  const [jurisdiction, setJurisdiction] = useState<JurisdictionKey>("qce");
  const [currentYear, setCurrentYear] = useState<YearLevel>("year11");
  const [studyGoal, setStudyGoal] = useState<StudyGoal>("medicine");
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
  const currentBlueprint = getYearBlueprint(config, currentYear);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (parsed.jurisdiction) setJurisdiction(parsed.jurisdiction);
      if (parsed.currentYear) setCurrentYear(parsed.currentYear);
      if (parsed.studyGoal) setStudyGoal(parsed.studyGoal);
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
        currentYear,
        studyGoal,
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
    currentYear,
    studyGoal,
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
    setStudyGoal(config.defaultStudyGoal);
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
  }, [jurisdiction, config.defaultStudyGoal, config.examWeightingDefault]);

  const visibleSubjectsForYear = useMemo(() => {
    return config.subjects.filter((subject) =>
      subject.stageAvailability?.includes(currentYear)
    );
  }, [config.subjects, currentYear]);

  const selectedLibrarySubject =
    config.subjects.find((subject) => subject.id === selectedLibrarySubjectId) ||
    visibleSubjectsForYear[0] ||
    config.subjects[0];

  const filteredSubjects = useMemo(() => {
    const searched = visibleSubjectsForYear.filter((subject) => {
      const matchesSearch =
        !subjectSearch.trim() ||
        subject.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
        subject.area.toLowerCase().includes(subjectSearch.toLowerCase()) ||
        (subject.note ?? "").toLowerCase().includes(subjectSearch.toLowerCase());

      const matchesArea = areaFilter === "all" ? true : subject.area === areaFilter;
      const matchesScaling =
        scalingFilter === "all" ? true : subject.scaling === scalingFilter;
      const matchesRecommended = recommendedOnly
        ? subject.recommendedForMed || subject.pathwayTags?.includes("compulsory")
        : true;

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
      if (subjectSort === "external") {
        return (
          (b.externalWeight ?? config.examWeightingDefault) -
          (a.externalWeight ?? config.examWeightingDefault)
        );
      }
      if (subjectSort === "balanced") {
        const aWeight = a.externalWeight ?? config.examWeightingDefault;
        const bWeight = b.externalWeight ?? config.examWeightingDefault;
        return Math.abs(40 - aWeight) - Math.abs(40 - bWeight);
      }
      return Number(Boolean(b.recommendedForMed)) - Number(Boolean(a.recommendedForMed));
    });
  }, [
    visibleSubjectsForYear,
    subjectSearch,
    areaFilter,
    scalingFilter,
    recommendedOnly,
    subjectSort,
    config.examWeightingDefault,
  ]);

  const yearSensitiveSubjects = useMemo(
    () => getYearSensitiveSubjects(config, currentYear, studyGoal),
    [config, currentYear, studyGoal]
  );

  const stateEngine = useMemo(
    () => computeStateEngine(config, selectedSubjects, currentYear, studyGoal),
    [config, selectedSubjects, currentYear, studyGoal]
  );

  const internalDiagnostics = useMemo(
    () => computeInternals(internalRows, config.subjects, currentYear),
    [internalRows, config.subjects, currentYear]
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
      description="Access the full subject strategy engine, year-level planner, internals tracker, and external sensitivity tools."
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
              State-aware planning from Year 10 to 12
            </Pill>
            <Pill className="border-sky-200 bg-sky-50 text-sky-700">
              <Layers3 className="mr-2 h-3.5 w-3.5" />
              Internals, externals, moderation and pathway logic
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
                    A state-aware strategy engine for subject choice, year-level planning,
                    internal stability, and external sensitivity — built properly for how
                    Australia actually works.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                  <InfoStat
                    label="Subjects loaded"
                    value={String(visibleSubjectsForYear.length)}
                  />
                  <InfoStat
                    label="Med-relevant"
                    value={String(
                      visibleSubjectsForYear.filter((s) => s.recommendedForMed).length
                    )}
                  />
                  <InfoStat
                    label="Default external"
                    value={`${config.examWeightingDefault}%`}
                  />
                  <InfoStat
                    label="Pathway mode"
                    value={
                      config.pathwayMode === "atar-academic"
                        ? "ATAR"
                        : config.pathwayMode === "school-based"
                          ? "School"
                          : config.pathwayMode === "multi-year"
                            ? "Multi-year"
                            : config.pathwayMode === "ib-diploma"
                              ? "IB"
                              : "Applied"
                    }
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr]">
                <SoftCard className="p-5">
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

                <SoftCard className="p-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Current year
                  </label>
                  <div className="relative">
                    <select
                      value={currentYear}
                      onChange={(event) =>
                        setCurrentYear(event.target.value as YearLevel)
                      }
                      className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-900 outline-none transition focus:border-violet-300"
                    >
                      {YEAR_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </SoftCard>

                <SoftCard className="p-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Study goal
                  </label>
                  <div className="relative">
                    <select
                      value={studyGoal}
                      onChange={(event) =>
                        setStudyGoal(event.target.value as StudyGoal)
                      }
                      className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-900 outline-none transition focus:border-violet-300"
                    >
                      {GOAL_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </SoftCard>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-2">
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
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

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-sm font-bold text-slate-950">
                              Internal model
                            </p>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                              {config.kernel.internalSummary}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-sm font-bold text-slate-950">
                              External model
                            </p>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                              {config.kernel.externalSummary}
                            </p>
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
                          {yearSensitiveSubjects.map((item) => {
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
                                      {item.pathwayTags?.includes("compulsory") ? (
                                        <Pill className="border-sky-200 bg-sky-50 text-sky-700">
                                          Compulsory
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
                                      {item.externalWeight ?? config.examWeightingDefault}
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

                  {activeTab === "pathway" ? (
                    <>
                      <SoftCard className="p-6 sm:p-7">
                        <SectionTitle
                          icon={Route}
                          eyebrow="Pathway architecture"
                          title="How this system actually behaves"
                          body="This is the bit most generic study tools miss. Your state is not just subjects and marks — it is a specific assessment machine."
                        />

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                          <MetricCard
                            title="Year 10 role"
                            value="Planning"
                            note={config.kernel.year10Role}
                            tone="border-sky-200 bg-sky-50"
                          />
                          <MetricCard
                            title="Year 11 role"
                            value="Build"
                            note={config.kernel.year11Role}
                            tone="border-amber-200 bg-amber-50"
                          />
                          <MetricCard
                            title="Year 12 role"
                            value="Execution"
                            note={config.kernel.year12Role}
                            tone="border-violet-200 bg-violet-50"
                          />
                          <MetricCard
                            title="ATAR logic"
                            value={config.admissionsBody}
                            note={config.kernel.atarConstruction}
                            tone="border-emerald-200 bg-emerald-50"
                          />
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-sm font-bold text-slate-950">
                              Certificate logic
                            </p>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                              {config.kernel.certificateLogic}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-sm font-bold text-slate-950">
                              Moderation model
                            </p>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                              {moderationMeta(config.kernel.moderationModel).label}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm font-bold text-slate-950">
                            Special rules
                          </p>
                          <div className="mt-3 space-y-2">
                            {config.kernel.specialRules.map((rule) => (
                              <div
                                key={rule}
                                className="flex gap-3 text-sm leading-7 text-slate-700"
                              >
                                <Check className="mt-1.5 h-4 w-4 shrink-0 text-emerald-600" />
                                <span>{rule}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </SoftCard>
                    </>
                  ) : null}

                  {activeTab === "year-planner" ? (
                    <>
                      <SoftCard className="p-6 sm:p-7">
                        <SectionTitle
                          icon={CalendarDays}
                          eyebrow="Year planner"
                          title={currentBlueprint.title}
                          body={currentBlueprint.objective}
                        />

                        <div className="mt-5 grid gap-4 md:grid-cols-3">
                          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                            <p className="text-sm font-bold text-emerald-950">
                              Priorities
                            </p>
                            <div className="mt-3 space-y-2">
                              {currentBlueprint.priorities.map((item) => (
                                <div
                                  key={item}
                                  className="flex gap-3 text-sm leading-7 text-emerald-950"
                                >
                                  <Check className="mt-1.5 h-4 w-4 shrink-0 text-emerald-700" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                            <p className="text-sm font-bold text-rose-950">
                              Avoid
                            </p>
                            <div className="mt-3 space-y-2">
                              {currentBlueprint.avoid.map((item) => (
                                <div
                                  key={item}
                                  className="flex gap-3 text-sm leading-7 text-rose-950"
                                >
                                  <CircleAlert className="mt-1.5 h-4 w-4 shrink-0 text-rose-700" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                            <p className="text-sm font-bold text-sky-950">
                              Metrics to watch
                            </p>
                            <div className="mt-3 space-y-2">
                              {currentBlueprint.metrics.map((item) => (
                                <div
                                  key={item}
                                  className="flex gap-3 text-sm leading-7 text-sky-950"
                                >
                                  <Gauge className="mt-1.5 h-4 w-4 shrink-0 text-sky-700" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                          <p className="text-sm font-bold text-amber-950">
                            Planner note
                          </p>
                          <p className="mt-2 text-sm leading-7 text-amber-950">
                            {currentBlueprint.callout}
                          </p>
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
                          body="Use this to compare scaling posture, med relevance, year-level fit and the kind of assessment load each subject usually creates."
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
                              {AREA_OPTIONS.map((option) => (
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
                              <option value="external">External load</option>
                              <option value="balanced">Balance</option>
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
                                    <Pill className={yearMeta(currentYear).tone}>
                                      {yearMeta(currentYear).short}
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
                          body="Use four task slots so this works cleanly across states. Leave any unused slot blank."
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
                                  {visibleSubjectsForYear.map((item) => (
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
                              max="80"
                              value={examWeight}
                              onChange={(e) => setExamWeight(e.target.value)}
                              className="w-full"
                            />
                            <div className="mt-1 flex justify-between text-xs text-slate-500">
                              <span>0% internal-heavy</span>
                              <span>80% exam-heavy</span>
                            </div>
                          </div>
                        </div>
                      </SoftCard>
                    </>
                  ) : null}
                </div>

                <div className="space-y-6">
                  <StrategyRail
                    config={config}
                    currentYear={currentYear}
                    studyGoal={studyGoal}
                  />

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
                          <Microscope className="h-4 w-4" />
                          <h3 className="text-sm font-bold">Strategy signals</h3>
                        </div>

                        <div className="space-y-3">
                          {stateEngine.insights.map((insight) => (
                            <InsightCard key={insight.title} insight={insight} />
                          ))}
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

                  {activeTab === "pathway" ? (
                    <>
                      <SoftCard className="p-6 sm:p-7">
                        <h3 className="text-sm font-bold text-slate-950">
                          Kernel summary
                        </h3>
                        <div className="mt-4 grid gap-3">
                          <MetricCard
                            title="Default internal"
                            value={`${config.kernel.defaultInternalWeight}%`}
                            note="Base engine assumption"
                            tone="border-sky-200 bg-sky-50"
                          />
                          <MetricCard
                            title="Default external"
                            value={`${config.kernel.defaultExternalWeight}%`}
                            note="Base engine assumption"
                            tone="border-violet-200 bg-violet-50"
                          />
                          <MetricCard
                            title="Pathway mode"
                            value={config.pathwayMode}
                            note="Determines the UI logic"
                            tone="border-emerald-200 bg-emerald-50"
                          />
                        </div>
                      </SoftCard>
                    </>
                  ) : null}

                  {activeTab === "year-planner" ? (
                    <>
                      <SoftCard className="p-6 sm:p-7">
                        <p className="text-sm font-semibold text-slate-950">
                          Year-specific focus
                        </p>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {currentYear === "year10"
                            ? config.year10Hint
                            : currentYear === "year11"
                              ? config.year11Hint
                              : config.year12Hint}
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
                              visibleSubjectsForYear.filter((s) => s.scaling === "veryHigh")
                                .length
                            )}
                            note="Top upside band"
                            tone="border-violet-200 bg-violet-50"
                          />
                          <MetricCard
                            title="High scaling"
                            value={String(
                              visibleSubjectsForYear.filter((s) => s.scaling === "high")
                                .length
                            )}
                            note="Strong upside band"
                            tone="border-emerald-200 bg-emerald-50"
                          />
                          <MetricCard
                            title="Med-relevant"
                            value={String(
                              visibleSubjectsForYear.filter((s) => s.recommendedForMed)
                                .length
                            )}
                            note="Useful in medicine-facing planning"
                            tone="border-sky-200 bg-sky-50"
                          />
                          <MetricCard
                            title="Languages"
                            value={String(
                              visibleSubjectsForYear.filter((s) => s.area === "Languages")
                                .length
                            )}
                            note="Potential upside plays"
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
                            title="Consistency score"
                            value={`${internalDiagnostics.overallConsistency}%`}
                            note="How stable the current set looks"
                            tone="border-emerald-200 bg-emerald-50"
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
                          {internalDiagnostics.yearMessage}
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