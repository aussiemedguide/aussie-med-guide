"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  HeartHandshake,
  LineChart,
  Sparkles,
  Target,
  UserRoundCheck,
  Compass,
  Lock,
} from "lucide-react";

type TabKey = "bonded" | "preference" | "interview" | "insights" | "scenario";
type StudentStatus = "metropolitan" | "rural" | "international";
type InterviewBand = "weak" | "average" | "strong" | "exceptional";
type BondedOpenness = "avoid" | "open" | "prefer";
type RiskTolerance = 0 | 1 | 2 | 3 | 4;
type FactorKey = "atar" | "ucat" | "interview" | "rural" | "mission" | "bonded" | "portfolio";
type BandKey = "strong" | "competitive" | "possible" | "unlikely";
type TacSystem = "UAC" | "QTAC" | "VTAC" | "TISC" | "SATAC" | "Direct";
type UniKey =
  | "adelaide"
  | "anu"
  | "bond"
  | "cdu"
  | "csu_wsu"
  | "curtin"
  | "deakin"
  | "griffith"
  | "jcu"
  | "macquarie"
  | "monash"
  | "newcastle_une"
  | "notre_dame"
  | "uq"
  | "uwa"
  | "unsw"
  | "utas"
  | "wollongong"
  | "western_sydney";

type UniversityRule = {
  key: UniKey;
  name: string;
  tac: TacSystem;
  pathway: string;
  state: string;
  usesUcat: boolean;
  hasInterview: boolean;
  missionHeavy?: boolean;
  portfolioHeavy?: boolean;
  bondedFriendly?: boolean;
  ruralFriendly?: boolean;
  directEntryLike?: boolean;
  weights: Record<FactorKey, number>;
  baseline: {
    atar: number;
    ucat: number;
    interview: number;
  };
  floors?: {
    atar?: number;
    ucat?: number;
  };
  ruralBoost?: {
    atar?: number;
    ucat?: number;
    interview?: number;
  };
  bondedBoost?: {
    atar?: number;
    ucat?: number;
    interview?: number;
  };
  notes: string;
};

type Profile = {
  atar: number;
  ucat: number;
  status: StudentStatus;
  interview: InterviewBand;
  bonded: BondedOpenness;
  riskTolerance: RiskTolerance;
  preferences: UniKey[];
};

type EvaluatedUniversity = UniversityRule & {
  score: number;
  band: BandKey;
  confidence: "higher" | "medium" | "lower";
  gap: {
    atar: number;
    ucat: number;
    interview: number;
  };
  effectiveCutoffs: {
    atar: number;
    ucat: number;
    interview: number;
  };
  reasons: string[];
  leverage: string[];
  limitingFactor: string;
};

type PreferenceGoal = "safe" | "normal" | "aggressive";

type InsightsRun = {
  strong: EvaluatedUniversity[];
  competitive: EvaluatedUniversity[];
  possible: EvaluatedUniversity[];
  unlikely: EvaluatedUniversity[];
};

type StrategyMeta = {
  strong: number;
  competitive: number;
  possible: number;
  unlikely: number;
  selectedIncluded: number;
  averageScore: number;
};

const TAB_ORDER: { key: TabKey; label: string; icon: typeof Compass }[] = [
  { key: "bonded", label: "Bonded", icon: HeartHandshake },
  { key: "preference", label: "Preference", icon: Target },
  { key: "interview", label: "Interview", icon: UserRoundCheck },
  { key: "insights", label: "Insights", icon: BarChart3 },
  { key: "scenario", label: "Scenario", icon: Sparkles },
];

const INTERVIEW_VALUE: Record<InterviewBand, number> = {
  weak: 0.42,
  average: 0.58,
  strong: 0.76,
  exceptional: 0.9,
};

const INTERVIEW_LABEL: Record<InterviewBand, string> = {
  weak: "Weak",
  average: "Average",
  strong: "Strong",
  exceptional: "Exceptional",
};

const STATUS_LABEL: Record<StudentStatus, string> = {
  metropolitan: "City",
  rural: "Rural",
  international: "International",
};

const BONDED_LABEL: Record<BondedOpenness, string> = {
  avoid: "Avoid bonded",
  open: "Open to bonded",
  prefer: "Prefer bonded if it improves odds",
};

const BAND_STYLES: Record<BandKey, string> = {
  strong: "border-emerald-300 bg-emerald-50 text-emerald-900",
  competitive: "border-blue-300 bg-blue-50 text-blue-900",
  possible: "border-amber-300 bg-amber-50 text-amber-900",
  unlikely: "border-rose-300 bg-rose-50 text-rose-900",
};

const TAG_STYLES: Record<BandKey, string> = {
  strong: "bg-emerald-600 text-white",
  competitive: "bg-blue-600 text-white",
  possible: "bg-amber-500 text-black",
  unlikely: "bg-rose-600 text-white",
};

const UNIVERSITY_RULES: UniversityRule[] = [
  {
    key: "bond",
    name: "Bond University",
    tac: "Direct",
    pathway: "Private program · interview-centred",
    state: "QLD",
    usesUcat: false,
    hasInterview: true,
    missionHeavy: false,
    portfolioHeavy: true,
    weights: { atar: 0.22, ucat: 0, interview: 0.54, rural: 0, mission: 0.08, bonded: 0, portfolio: 0.16 },
    baseline: { atar: 97.2, ucat: 0, interview: 0.72 },
    floors: { atar: 92 },
    notes: "Bond is best treated as interview + overall fit heavy rather than UCAT driven.",
  },
  {
    key: "jcu",
    name: "JCU",
    tac: "QTAC",
    pathway: "Mission-driven regional medicine",
    state: "QLD",
    usesUcat: false,
    hasInterview: true,
    missionHeavy: true,
    ruralFriendly: true,
    weights: { atar: 0.36, ucat: 0, interview: 0.36, rural: 0.14, mission: 0.14, bonded: 0, portfolio: 0 },
    baseline: { atar: 97.1, ucat: 0, interview: 0.68 },
    floors: { atar: 94 },
    ruralBoost: { atar: 1.4, interview: 0.05 },
    notes: "JCU is modelled as mission aligned and rural sensitive, with no UCAT input.",
  },
  {
    key: "griffith",
    name: "Griffith University",
    tac: "QTAC",
    pathway: "ATAR-dominant provisional pathway",
    state: "QLD",
    usesUcat: false,
    hasInterview: false,
    directEntryLike: true,
    weights: { atar: 0.82, ucat: 0, interview: 0, rural: 0.08, mission: 0.1, bonded: 0, portfolio: 0 },
    baseline: { atar: 99.88, ucat: 0, interview: 0 },
    floors: { atar: 99.0 },
    ruralBoost: { atar: 0.45 },
    notes: "Griffith is treated as an academic gatekeeper pathway with very high ATAR pressure.",
  },
  {
    key: "monash",
    name: "Monash University",
    tac: "VTAC",
    pathway: "Direct entry medicine",
    state: "VIC",
    usesUcat: true,
    hasInterview: true,
    directEntryLike: true,
    bondedFriendly: true,
    ruralFriendly: true,
    weights: { atar: 0.34, ucat: 0.4, interview: 0.22, rural: 0.02, mission: 0.02, bonded: 0, portfolio: 0 },
    baseline: { atar: 99.15, ucat: 3120, interview: 0.7 },
    floors: { atar: 95.0, ucat: 2500 },
    ruralBoost: { atar: 1.0, ucat: 160 },
    bondedBoost: { atar: 0.2, ucat: 30 },
    notes: "Monash remains heavily academic and UCAT selective, with pathway sensitivity for rural applicants.",
  },
  {
    key: "unsw",
    name: "UNSW",
    tac: "UAC",
    pathway: "ATAR + UCAT + interview composite",
    state: "NSW",
    usesUcat: true,
    hasInterview: true,
    directEntryLike: true,
    weights: { atar: 0.32, ucat: 0.34, interview: 0.3, rural: 0.02, mission: 0.02, bonded: 0, portfolio: 0 },
    baseline: { atar: 99.45, ucat: 3080, interview: 0.71 },
    floors: { atar: 96.0, ucat: 2550 },
    ruralBoost: { atar: 0.6, ucat: 110 },
    notes: "UNSW is best modelled as balanced across academics, UCAT and interview once threshold-competitive.",
  },
  {
    key: "uq",
    name: "University of Queensland",
    tac: "QTAC",
    pathway: "Provisional MD pathway",
    state: "QLD",
    usesUcat: true,
    hasInterview: true,
    directEntryLike: true,
    weights: { atar: 0.34, ucat: 0.34, interview: 0.3, rural: 0.02, mission: 0, bonded: 0, portfolio: 0 },
    baseline: { atar: 99.2, ucat: 3110, interview: 0.72 },
    floors: { atar: 95.0, ucat: 2670 },
    ruralBoost: { atar: 0.9, ucat: 180 },
    notes: "UQ is modelled as balanced, but with a very demanding UCAT baseline for standard provisional applicants.",
  },
  {
    key: "newcastle_une",
    name: "Newcastle / UNE",
    tac: "UAC",
    pathway: "JMP · UCAT and interview focused",
    state: "NSW",
    usesUcat: true,
    hasInterview: true,
    missionHeavy: true,
    ruralFriendly: true,
    weights: { atar: 0.1, ucat: 0.5, interview: 0.28, rural: 0.06, mission: 0.06, bonded: 0, portfolio: 0 },
    baseline: { atar: 94.5, ucat: 2510, interview: 0.7 },
    floors: { atar: 94.0, ucat: 2400 },
    ruralBoost: { ucat: 180, interview: 0.04 },
    notes: "Newcastle / UNE is modelled as UCAT-centric early, then interview decisive later.",
  },
  {
    key: "western_sydney",
    name: "Western Sydney University",
    tac: "UAC",
    pathway: "UCAT + interview + equity weighting",
    state: "NSW",
    usesUcat: true,
    hasInterview: true,
    missionHeavy: true,
    ruralFriendly: true,
    bondedFriendly: true,
    weights: { atar: 0.18, ucat: 0.36, interview: 0.28, rural: 0.08, mission: 0.1, bonded: 0, portfolio: 0 },
    baseline: { atar: 95.0, ucat: 2900, interview: 0.7 },
    floors: { atar: 93.5, ucat: 2400 },
    ruralBoost: { atar: 0.8, ucat: 130 },
    bondedBoost: { atar: 0.3, ucat: 40 },
    notes: "WSU is treated as more pathway-sensitive than pure prestige-score models.",
  },
  {
    key: "csu_wsu",
    name: "CSU / WSU Joint Program",
    tac: "UAC",
    pathway: "Rural bonded-leaning pathway",
    state: "NSW",
    usesUcat: true,
    hasInterview: true,
    missionHeavy: true,
    ruralFriendly: true,
    bondedFriendly: true,
    weights: { atar: 0.16, ucat: 0.28, interview: 0.26, rural: 0.16, mission: 0.14, bonded: 0, portfolio: 0 },
    baseline: { atar: 94.0, ucat: 2550, interview: 0.67 },
    floors: { atar: 91.5, ucat: 2300 },
    ruralBoost: { atar: 1.2, ucat: 180, interview: 0.04 },
    bondedBoost: { atar: 0.5, ucat: 60, interview: 0.02 },
    notes: "This model deliberately rewards rural fit and openness to workforce-targeted pathways.",
  },
  {
    key: "wollongong",
    name: "University of Wollongong",
    tac: "Direct",
    pathway: "Portfolio-heavy medicine pathway",
    state: "NSW",
    usesUcat: true,
    hasInterview: true,
    missionHeavy: true,
    portfolioHeavy: true,
    weights: { atar: 0.14, ucat: 0.22, interview: 0.28, rural: 0.1, mission: 0.12, bonded: 0, portfolio: 0.14 },
    baseline: { atar: 94.0, ucat: 2850, interview: 0.72 },
    floors: { atar: 91.0, ucat: 2400 },
    ruralBoost: { atar: 1.0, ucat: 100, interview: 0.03 },
    notes: "Wollongong is treated as a fit and context-sensitive pathway rather than a raw-score race.",
  },
  {
    key: "macquarie",
    name: "Macquarie University",
    tac: "UAC",
    pathway: "Balanced composite pathway",
    state: "NSW",
    usesUcat: true,
    hasInterview: true,
    weights: { atar: 0.33, ucat: 0.33, interview: 0.34, rural: 0, mission: 0, bonded: 0, portfolio: 0 },
    baseline: { atar: 98.2, ucat: 2920, interview: 0.71 },
    floors: { atar: 95.0, ucat: 2450 },
    notes: "Macquarie is modelled as one of the cleaner balanced-score programs.",
  },
  {
    key: "deakin",
    name: "Deakin University",
    tac: "VTAC",
    pathway: "GPA-style weighting adapted for school leaver planning",
    state: "VIC",
    usesUcat: true,
    hasInterview: true,
    missionHeavy: true,
    ruralFriendly: true,
    bondedFriendly: true,
    weights: { atar: 0.28, ucat: 0.32, interview: 0.28, rural: 0.06, mission: 0.06, bonded: 0, portfolio: 0 },
    baseline: { atar: 97.7, ucat: 2850, interview: 0.7 },
    floors: { atar: 94.0, ucat: 2400 },
    ruralBoost: { atar: 0.8, ucat: 100 },
    notes: "Useful as a planning proxy even though actual graduate-style criteria are more nuanced than school-leaver direct entry models.",
  },
  {
    key: "uwa",
    name: "UWA",
    tac: "TISC",
    pathway: "Assured or direct-style medicine planning model",
    state: "WA",
    usesUcat: true,
    hasInterview: true,
    weights: { atar: 0.34, ucat: 0.33, interview: 0.33, rural: 0, mission: 0, bonded: 0, portfolio: 0 },
    baseline: { atar: 98.8, ucat: 2870, interview: 0.7 },
    floors: { atar: 95.0, ucat: 2400 },
    ruralBoost: { atar: 0.5, ucat: 80 },
    notes: "UWA is modelled as a traditional high-achieving balanced pathway.",
  },
  {
    key: "curtin",
    name: "Curtin University",
    tac: "TISC",
    pathway: "WA direct entry medicine",
    state: "WA",
    usesUcat: true,
    hasInterview: true,
    directEntryLike: true,
    ruralFriendly: true,
    bondedFriendly: true,
    weights: { atar: 0.36, ucat: 0.36, interview: 0.24, rural: 0.04, mission: 0, bonded: 0, portfolio: 0 },
    baseline: { atar: 97.2, ucat: 2800, interview: 0.69 },
    floors: { atar: 95.0, ucat: 2350 },
    ruralBoost: { atar: 0.7, ucat: 100 },
    notes: "Curtin is treated as a more classical academic + UCAT gatekeeper model.",
  },
  {
    key: "adelaide",
    name: "University of Adelaide",
    tac: "SATAC",
    pathway: "ATAR + UCAT + interview composite",
    state: "SA",
    usesUcat: true,
    hasInterview: true,
    directEntryLike: true,
    weights: { atar: 0.33, ucat: 0.33, interview: 0.34, rural: 0, mission: 0, bonded: 0, portfolio: 0 },
    baseline: { atar: 99.0, ucat: 2940, interview: 0.72 },
    floors: { atar: 95.0, ucat: 2400 },
    ruralBoost: { atar: 0.5, ucat: 90 },
    notes: "Adelaide is modelled as a balanced but still very demanding program for standard applicants.",
  },
  {
    key: "utas",
    name: "University of Tasmania",
    tac: "SATAC",
    pathway: "Academic + mission-based medicine planning",
    state: "TAS",
    usesUcat: true,
    hasInterview: true,
    missionHeavy: true,
    ruralFriendly: true,
    weights: { atar: 0.28, ucat: 0.26, interview: 0.26, rural: 0.1, mission: 0.1, bonded: 0, portfolio: 0 },
    baseline: { atar: 95.5, ucat: 2550, interview: 0.68 },
    floors: { atar: 92.0, ucat: 2300 },
    ruralBoost: { atar: 1.0, ucat: 120 },
    notes: "Tasmania is treated as more accessible than the pure top-score metropolitan options.",
  },
  {
    key: "anu",
    name: "ANU",
    tac: "UAC",
    pathway: "High academic pathway",
    state: "ACT",
    usesUcat: true,
    hasInterview: true,
    weights: { atar: 0.33, ucat: 0.33, interview: 0.34, rural: 0, mission: 0, bonded: 0, portfolio: 0 },
    baseline: { atar: 99.0, ucat: 2850, interview: 0.71 },
    floors: { atar: 95.0, ucat: 2400 },
    notes: "ANU is kept in the model as a strong academic target rather than a low-threshold option.",
  },
  {
    key: "notre_dame",
    name: "Notre Dame",
    tac: "Direct",
    pathway: "Portfolio + interview heavy pathway",
    state: "NSW/WA",
    usesUcat: true,
    hasInterview: true,
    missionHeavy: true,
    portfolioHeavy: true,
    weights: { atar: 0.18, ucat: 0.24, interview: 0.28, rural: 0.08, mission: 0.1, bonded: 0, portfolio: 0.12 },
    baseline: { atar: 94.5, ucat: 2550, interview: 0.71 },
    floors: { atar: 90.0, ucat: 2300 },
    ruralBoost: { atar: 0.8, ucat: 120, interview: 0.03 },
    notes: "Notre Dame is better evaluated through fit and interview potential than raw percentile chasing.",
  },
  {
    key: "cdu",
    name: "CDU",
    tac: "SATAC",
    pathway: "Mission-based Northern Territory pathway",
    state: "NT",
    usesUcat: true,
    hasInterview: true,
    missionHeavy: true,
    ruralFriendly: true,
    bondedFriendly: true,
    weights: { atar: 0.16, ucat: 0.24, interview: 0.24, rural: 0.18, mission: 0.18, bonded: 0, portfolio: 0 },
    baseline: { atar: 91.0, ucat: 2350, interview: 0.66 },
    floors: { atar: 85.0, ucat: 2100 },
    ruralBoost: { atar: 1.3, ucat: 180, interview: 0.05 },
    bondedBoost: { atar: 0.5, ucat: 60, interview: 0.02 },
    notes: "CDU is intentionally path-sensitive and should not be compared like a metro prestige race.",
  },
];

const PREFERENCE_GOAL_LABEL: Record<PreferenceGoal, string> = {
  safe: "Safe",
  normal: "Normal",
  aggressive: "Aggressive",
};

const PREFERENCE_GOAL_COPY: Record<PreferenceGoal, string> = {
  safe: "Maximises probability of receiving an offer within this TAC.",
  normal: "Best overall mix of reach, realism, and backup options within this TAC.",
  aggressive: "Higher upside ordering within this TAC, with more ambitious reaches near the top.",
};

const TAC_OPTIONS: TacSystem[] = ["QTAC", "UAC", "VTAC", "TISC", "SATAC", "Direct"];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normaliseATAR(atar: number) {
  return clamp((atar - 80) / 20, 0, 1);
}

function normaliseUCAT(ucat: number) {
  return clamp((ucat - 2100) / 1100, 0, 1);
}

function deriveInterviewNumeric(interview: InterviewBand) {
  return INTERVIEW_VALUE[interview];
}

function safeRound(value: number, dp = 1) {
  const factor = 10 ** dp;
  return Math.round(value * factor) / factor;
}

function bandOrder(band: BandKey) {
  return band === "strong" ? 3 : band === "competitive" ? 2 : band === "possible" ? 1 : 0;
}

function bandLabel(band: BandKey) {
  return band === "strong"
    ? "Strong"
    : band === "competitive"
      ? "Competitive"
      : band === "possible"
        ? "Possible"
        : "Below threshold";
}

function getEffectiveBaseline(rule: UniversityRule, profile: Profile) {
  let atar = rule.baseline.atar;
  let ucat = rule.baseline.ucat;
  let interview = rule.baseline.interview;

  if (profile.status === "rural") {
    atar -= rule.ruralBoost?.atar ?? 0;
    ucat -= rule.ruralBoost?.ucat ?? 0;
    interview -= rule.ruralBoost?.interview ?? 0;
  }

  if (profile.status === "international") {
    atar -= (rule.ruralBoost?.atar ?? 0.8) + 0.8;
    ucat -= (rule.ruralBoost?.ucat ?? 100) + 90;
    interview -= (rule.ruralBoost?.interview ?? 0.03) + 0.03;
  }

  if (profile.bonded !== "avoid" && rule.bondedFriendly) {
    atar -= rule.bondedBoost?.atar ?? 0.25;
    ucat -= rule.bondedBoost?.ucat ?? 40;
    interview -= rule.bondedBoost?.interview ?? 0.01;
  }

  return {
    atar: clamp(atar, 80, 99.95),
    ucat: clamp(ucat, 0, 3600),
    interview: clamp(interview, 0.3, 0.95),
  };
}

function getPortfolioFit(rule: UniversityRule, profile: Profile) {
  let fit = 0.56;

  if (rule.portfolioHeavy) fit += 0.08;
  if (rule.missionHeavy) fit += profile.status === "metropolitan" ? 0 : 0.06;
  if (profile.bonded === "prefer" && rule.bondedFriendly) fit += 0.04;

  return clamp(fit, 0.4, 0.9);
}

function evaluateUniversity(rule: UniversityRule, profile: Profile): EvaluatedUniversity {
  const effective = getEffectiveBaseline(rule, profile);
  const interviewValue = deriveInterviewNumeric(profile.interview);
  const portfolioFit = getPortfolioFit(rule, profile);

  const userATAR = normaliseATAR(profile.atar);
  const userUCAT = rule.usesUcat ? normaliseUCAT(profile.ucat) : 0;
  const userInterview = rule.hasInterview ? interviewValue : 0;

  const targetATAR = normaliseATAR(effective.atar);
  const targetUCAT = rule.usesUcat ? normaliseUCAT(effective.ucat) : 0;
  const targetInterview = rule.hasInterview ? effective.interview : 0;

  const factorScores = {
    atar: rule.weights.atar > 0 ? clamp(0.5 + (userATAR - targetATAR) * 2.4, 0, 1) : 0,
    ucat: rule.weights.ucat > 0 ? clamp(0.5 + (userUCAT - targetUCAT) * 2.2, 0, 1) : 0,
    interview: rule.weights.interview > 0 ? clamp(0.5 + (userInterview - targetInterview) * 2.3, 0, 1) : 0,
    rural: rule.weights.rural > 0 ? (profile.status === "metropolitan" ? 0.45 : 0.82) : 0,
    mission: rule.weights.mission > 0 ? (profile.status === "metropolitan" ? 0.52 : 0.78) : 0,
    bonded: rule.weights.bonded > 0
      ? profile.bonded === "avoid"
        ? 0.35
        : profile.bonded === "open"
          ? 0.65
          : 0.82
      : 0,
    portfolio: rule.weights.portfolio > 0 ? portfolioFit : 0,
  };

  let score =
    factorScores.atar * rule.weights.atar +
    factorScores.ucat * rule.weights.ucat +
    factorScores.interview * rule.weights.interview +
    factorScores.rural * rule.weights.rural +
    factorScores.mission * rule.weights.mission +
    factorScores.bonded * rule.weights.bonded +
    factorScores.portfolio * rule.weights.portfolio;

  if (rule.floors?.atar && profile.atar < rule.floors.atar) score -= 0.08;
  if (rule.floors?.ucat && rule.usesUcat && profile.ucat < rule.floors.ucat) score -= 0.1;
  if (rule.hasInterview && interviewValue < 0.5) score -= 0.04;

  if (profile.preferences.includes(rule.key)) score += 0.02;
  if (profile.riskTolerance >= 3 && (rule.portfolioHeavy || rule.missionHeavy)) score += 0.01;
  if (profile.bonded === "avoid" && rule.bondedFriendly) score -= 0.015;

  score = clamp(score, 0, 1);

  const gap = {
    atar: safeRound(effective.atar - profile.atar, 2),
    ucat: Math.round(effective.ucat - profile.ucat),
    interview: safeRound(effective.interview - interviewValue, 2),
  };

  const factors = [
    { key: "ATAR", value: gap.atar, enabled: rule.weights.atar > 0 },
    { key: "UCAT", value: gap.ucat / 500, enabled: rule.weights.ucat > 0 },
    { key: "Interview", value: gap.interview * 2.2, enabled: rule.weights.interview > 0 },
  ].filter((item) => item.enabled);

  factors.sort((a, b) => b.value - a.value);
  const limitingFactor =
    factors[0]?.value > 0 ? factors[0].key : rule.missionHeavy ? "Mission fit" : "No major red flag";

  let band: BandKey = "unlikely";
  if (score >= 0.76) band = "strong";
  else if (score >= 0.61) band = "competitive";
  else if (score >= 0.48) band = "possible";

  const confidence =
    rule.portfolioHeavy || rule.missionHeavy
      ? "medium"
      : rule.usesUcat && rule.hasInterview
        ? "higher"
        : "lower";

  const reasons: string[] = [];
  const leverage: string[] = [];

  if (rule.weights.atar > 0) {
    if (gap.atar <= 0) reasons.push("ATAR is at or above this model's effective planning line.");
    else leverage.push(`Improve ATAR by about ${safeRound(Math.max(0.05, gap.atar), 2)} to materially strengthen this target.`);
  }

  if (rule.usesUcat) {
    if (gap.ucat <= 0) reasons.push("UCAT sits in or above the useful range for this pathway.");
    else leverage.push(`A UCAT lift of roughly ${Math.max(10, gap.ucat)} would move this profile more clearly into range.`);
  }

  if (rule.hasInterview) {
    if (gap.interview <= 0) reasons.push("Current interview band is competitive for this pathway.");
    else leverage.push("Interview performance is a key swing factor here.");
  }

  if (rule.ruralFriendly && profile.status !== "metropolitan") reasons.push("This pathway rewards rural or context-based eligibility.");
  if (rule.bondedFriendly && profile.bonded !== "avoid") reasons.push("Openness to bonded places improves strategic flexibility here.");
  if (rule.portfolioHeavy) reasons.push("Raw numbers matter less here than fit, story and interview performance.");
  if (rule.missionHeavy) reasons.push("Mission alignment matters more here than prestige-chasing.");

  return {
    ...rule,
    score,
    band,
    confidence,
    gap,
    effectiveCutoffs: effective,
    reasons: reasons.slice(0, 3),
    leverage: leverage.slice(0, 3),
    limitingFactor,
  };
}

function buildInsightsRun(list: EvaluatedUniversity[]): InsightsRun {
  return {
    strong: list.filter((u) => u.band === "strong").sort((a, b) => b.score - a.score),
    competitive: list.filter((u) => u.band === "competitive").sort((a, b) => b.score - a.score),
    possible: list.filter((u) => u.band === "possible").sort((a, b) => b.score - a.score),
    unlikely: list.filter((u) => u.band === "unlikely").sort((a, b) => b.score - a.score),
  };
}

function getTacScopedUniversities(list: EvaluatedUniversity[], selectedTac: TacSystem) {
  return list.filter((u) => u.tac === selectedTac);
}

function getPrestigeValue(uni: EvaluatedUniversity) {
  return uni.baseline.atar + uni.baseline.ucat / 1000 + (uni.directEntryLike ? 0.18 : 0) + (uni.state === "NSW" || uni.state === "QLD" || uni.state === "VIC" ? 0.04 : 0);
}

function getSelectionBoost(uni: EvaluatedUniversity, selectedTargets: UniKey[]) {
  return selectedTargets.includes(uni.key) ? 0.035 : 0;
}

function getSafetyPenalty(uni: EvaluatedUniversity) {
  if (uni.band === "unlikely") return 0.22;
  if (uni.band === "possible") return 0.08;
  return 0;
}

function getAggressiveUpside(uni: EvaluatedUniversity) {
  const prestige = getPrestigeValue(uni) / 120;
  const reachBonus = uni.band === "competitive" ? 0.08 : uni.band === "possible" ? 0.12 : uni.band === "strong" ? 0.02 : -0.14;
  return prestige + reachBonus;
}

function rankUniversitiesForGoal(
  list: EvaluatedUniversity[],
  goal: PreferenceGoal,
  selectedTargets: UniKey[],
) {
  return [...list].sort((a, b) => {
    const aSelectedBoost = getSelectionBoost(a, selectedTargets);
    const bSelectedBoost = getSelectionBoost(b, selectedTargets);

    const aPrestige = getPrestigeValue(a);
    const bPrestige = getPrestigeValue(b);

    const aSafeValue = a.score - getSafetyPenalty(a) + aSelectedBoost;
    const bSafeValue = b.score - getSafetyPenalty(b) + bSelectedBoost;

    const aNormalValue =
      a.score +
      aSelectedBoost +
      (a.band === "competitive" ? 0.06 : 0) +
      (a.band === "strong" ? 0.04 : 0) +
      (a.band === "possible" ? 0.01 : -0.18) +
      (a.missionHeavy || a.portfolioHeavy ? 0.01 : 0);

    const bNormalValue =
      b.score +
      bSelectedBoost +
      (b.band === "competitive" ? 0.06 : 0) +
      (b.band === "strong" ? 0.04 : 0) +
      (b.band === "possible" ? 0.01 : -0.18) +
      (b.missionHeavy || b.portfolioHeavy ? 0.01 : 0);

    const aAggressiveValue = a.score * 0.68 + getAggressiveUpside(a) + aSelectedBoost;
    const bAggressiveValue = b.score * 0.68 + getAggressiveUpside(b) + bSelectedBoost;

    if (goal === "safe") {
      if (aSafeValue !== bSafeValue) return bSafeValue - aSafeValue;
      if (bandOrder(a.band) !== bandOrder(b.band)) return bandOrder(b.band) - bandOrder(a.band);
      return b.score - a.score;
    }

    if (goal === "normal") {
      if (aNormalValue !== bNormalValue) return bNormalValue - aNormalValue;
      if (bandOrder(a.band) !== bandOrder(b.band)) return bandOrder(b.band) - bandOrder(a.band);
      return b.score - a.score;
    }

    if (aAggressiveValue !== bAggressiveValue) return bAggressiveValue - aAggressiveValue;
    if (aPrestige !== bPrestige) return bPrestige - aPrestige;
    return b.score - a.score;
  });
}

function composePreferenceList(
  tacScoped: EvaluatedUniversity[],
  goal: PreferenceGoal,
  selectedTargets: UniKey[],
) {
  const ranked = rankUniversitiesForGoal(tacScoped, goal, selectedTargets);

  if (goal === "safe") {
    const strong = ranked.filter((u) => u.band === "strong");
    const competitive = ranked.filter((u) => u.band === "competitive");
    const possible = ranked.filter((u) => u.band === "possible");
    const unlikely = ranked.filter((u) => u.band === "unlikely");
    return [...strong, ...competitive, ...possible, ...unlikely];
  }

  if (goal === "normal") {
    const strong = ranked.filter((u) => u.band === "strong");
    const competitive = ranked.filter((u) => u.band === "competitive");
    const possible = ranked.filter((u) => u.band === "possible");
    const unlikely = ranked.filter((u) => u.band === "unlikely");

    const mixed: EvaluatedUniversity[] = [];
    const used = new Set<UniKey>();

    const pushUnique = (uni?: EvaluatedUniversity) => {
      if (!uni || used.has(uni.key)) return;
      used.add(uni.key);
      mixed.push(uni);
    };

    competitive.slice(0, 2).forEach(pushUnique);
    strong.slice(0, 2).forEach(pushUnique);
    possible.slice(0, 1).forEach(pushUnique);

    [...ranked].forEach(pushUnique);
    unlikely.forEach(pushUnique);

    return mixed;
  }

  const viable = ranked.filter((u) => u.band !== "unlikely");
  const unlikely = ranked.filter((u) => u.band === "unlikely");
  return [...viable, ...unlikely];
}

function scorePreferences(
  list: EvaluatedUniversity[],
  selectedTac: TacSystem,
  goal: PreferenceGoal,
  selectedTargets: UniKey[],
) {
  const tacScoped = getTacScopedUniversities(list, selectedTac);
  return composePreferenceList(tacScoped, goal, selectedTargets);
}

function getStrategyMeta(items: EvaluatedUniversity[], selectedTargets: UniKey[]): StrategyMeta {
  return {
    strong: items.filter((u) => u.band === "strong").length,
    competitive: items.filter((u) => u.band === "competitive").length,
    possible: items.filter((u) => u.band === "possible").length,
    unlikely: items.filter((u) => u.band === "unlikely").length,
    selectedIncluded: items.filter((u) => selectedTargets.includes(u.key)).length,
    averageScore:
      items.reduce((sum, u) => sum + u.score, 0) / Math.max(1, items.length),
  };
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SectionTitle({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: typeof Compass;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
        <Icon className="h-4 w-4" />
        <span>{eyebrow}</span>
      </div>
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
        <p className="max-w-4xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
      </div>
    </div>
  );
}

function Slider({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-300 accent-violet-600"
    />
  );
}

function Pill({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "emerald" | "blue" | "amber" | "rose" | "violet" | "cyan";
}) {
  const styles: Record<string, string> = {
    slate: "border-slate-200 bg-white text-slate-700",
    emerald: "border-emerald-200 bg-emerald-100 text-emerald-800",
    blue: "border-blue-200 bg-blue-100 text-blue-800",
    amber: "border-amber-200 bg-amber-100 text-amber-900",
    rose: "border-rose-200 bg-rose-100 text-rose-800",
    violet: "border-violet-200 bg-violet-100 text-violet-800",
    cyan: "border-cyan-200 bg-cyan-100 text-cyan-800",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", styles[tone])}>
      {children}
    </span>
  );
}

function CompactMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-black tracking-tight text-slate-950">{value}</div>
    </div>
  );
}

function ProfileStrip({
  atar,
  ucat,
  status,
  interview,
  bonded,
}: {
  atar: number;
  ucat: number;
  status: StudentStatus;
  interview: InterviewBand;
  bonded: BondedOpenness;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      <CompactMetric label="ATAR" value={atar.toFixed(2)} />
      <CompactMetric label="UCAT" value={String(ucat)} />
      <CompactMetric label="Status" value={STATUS_LABEL[status]} />
      <CompactMetric label="Interview" value={INTERVIEW_LABEL[interview]} />
      <CompactMetric label="Bonded" value={BONDED_LABEL[bonded]} />
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{hint}</div>
    </div>
  );
}

function UniversityInsightCard({ uni }: { uni: EvaluatedUniversity }) {
  return (
    <div className={cn("rounded-3xl border p-5 shadow-sm", BAND_STYLES[uni.band])}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black tracking-tight">{uni.name}</h3>
            <Pill tone="slate">{uni.tac}</Pill>
            <Pill tone="violet">{uni.state}</Pill>
          </div>
          <p className="mt-2 text-sm text-slate-600">{uni.pathway}</p>
        </div>
        <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-bold", TAG_STYLES[uni.band])}>
          {bandLabel(uni.band)}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white/70 p-3">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Effective planning line</div>
          <div className="mt-2 text-sm text-slate-700">
            ATAR {safeRound(uni.effectiveCutoffs.atar, 2)}
            {uni.usesUcat ? ` · UCAT ${Math.round(uni.effectiveCutoffs.ucat)}` : " · No UCAT weighting"}
            {uni.hasInterview ? ` · Interview ${Math.round(uni.effectiveCutoffs.interview * 100)}%` : ""}
          </div>
        </div>
        <div className="rounded-2xl bg-white/70 p-3">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Limiting factor</div>
          <div className="mt-2 text-sm font-semibold text-slate-900">{uni.limitingFactor}</div>
        </div>
        <div className="rounded-2xl bg-white/70 p-3">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Confidence</div>
          <div className="mt-2 text-sm font-semibold text-slate-900">{uni.confidence}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
          <div className="text-sm font-semibold text-slate-900">Why it landed here</div>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            {uni.reasons.length ? uni.reasons.map((reason) => <li key={reason}>• {reason}</li>) : <li>• This sits close to the current planning line.</li>}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
          <div className="text-sm font-semibold text-slate-900">Best next moves</div>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            {uni.leverage.length
              ? uni.leverage.map((item) => <li key={item}>• {item}</li>)
              : <li>• Focus on application quality and ordering rather than chasing tiny score changes.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StrategySummaryStrip({
  meta,
  tone,
}: {
  meta: StrategyMeta;
  tone: "rose" | "blue" | "emerald";
}) {
  const wrapper =
    tone === "rose"
      ? "border-rose-200 bg-rose-100/80"
      : tone === "blue"
        ? "border-blue-200 bg-blue-100/80"
        : "border-emerald-200 bg-emerald-100/80";

  return (
    <div className={cn("mt-4 grid grid-cols-2 gap-2 rounded-2xl border p-3 text-sm sm:grid-cols-4", wrapper)}>
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Strong + Competitive</div>
        <div className="mt-1 font-black text-slate-950">{meta.strong + meta.competitive}</div>
      </div>
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Possible</div>
        <div className="mt-1 font-black text-slate-950">{meta.possible}</div>
      </div>
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Selected Included</div>
        <div className="mt-1 font-black text-slate-950">{meta.selectedIncluded}</div>
      </div>
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Avg Score</div>
        <div className="mt-1 font-black text-slate-950">{safeRound(meta.averageScore * 100, 0)}%</div>
      </div>
    </div>
  );
}

function PreferenceCard({
  tone,
  title,
  subtitle,
  items,
  selectedTargets,
}: {
  tone: "rose" | "blue" | "emerald";
  title: string;
  subtitle: string;
  items: EvaluatedUniversity[];
  selectedTargets: UniKey[];
}) {
  const wrapper =
    tone === "rose"
      ? "border-rose-200 bg-rose-50"
      : tone === "blue"
        ? "border-blue-200 bg-blue-50"
        : "border-emerald-200 bg-emerald-50";

  const footer =
    tone === "rose"
      ? "bg-rose-100 text-rose-900"
      : tone === "blue"
        ? "bg-blue-100 text-blue-900"
        : "bg-emerald-100 text-emerald-900";

  const meta = getStrategyMeta(items, selectedTargets);

  return (
    <div className={cn("rounded-3xl border p-5 shadow-sm", wrapper)}>
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5" />
        <h3 className="text-2xl font-black tracking-tight">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-600">{subtitle}</p>

      <StrategySummaryStrip meta={meta} tone={tone} />

      <div className="mt-5 space-y-3">
        {items.slice(0, 6).map((uni, index) => {
          const isSelected = selectedTargets.includes(uni.key);

          return (
            <div
              key={uni.key}
              className={cn(
                "flex items-center justify-between rounded-2xl border px-4 py-3",
                isSelected
                  ? "border-violet-200 bg-violet-50/80"
                  : "border-white/70 bg-white/80"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700">
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-slate-950">{uni.name}</div>
                    {isSelected ? <Pill tone="violet">Selected</Pill> : null}
                  </div>
                  <div className="text-xs text-slate-500">{uni.tac} · {bandLabel(uni.band)}</div>
                </div>
              </div>
              <Pill tone={uni.band === "strong" ? "emerald" : uni.band === "competitive" ? "blue" : uni.band === "possible" ? "amber" : "rose"}>
                {bandLabel(uni.band)}
              </Pill>
            </div>
          );
        })}
      </div>

      <div className={cn("mt-4 rounded-2xl px-4 py-3 text-sm font-medium", footer)}>
        Strategy: {title === "Aggressive"
          ? "Pushes higher-upside TAC-specific reaches upward, while still keeping weaker options below viable ones."
          : title === "Normal"
            ? "Best all-round TAC order. Mixes realistic offers with selective upside."
            : "Prioritises safer TAC-specific options to maximise offer probability."}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: typeof Compass;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
        active
          ? "bg-slate-950 text-white shadow-sm"
          : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-300"
      >
        {children}
      </select>
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  placeholder?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="number"
        value={Number.isNaN(value) ? "" : value}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300"
      />
    </label>
  );
}

function InlineNote({
  title,
  text,
  tone = "blue",
}: {
  title: string;
  text: string;
  tone?: "blue" | "amber" | "emerald";
}) {
  const styles =
    tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-900"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-900"
        : "border-emerald-200 bg-emerald-50 text-emerald-900";

  return (
    <div className={cn("rounded-3xl border p-5 shadow-sm", styles)}>
      <div className="font-semibold">{title}</div>
      <p className="mt-2 text-sm leading-6">{text}</p>
    </div>
  );
}

function TargetSelectGrid({
  selectedTac,
  selectedTargets,
  onToggle,
}: {
  selectedTac: TacSystem;
  selectedTargets: UniKey[];
  onToggle: (key: UniKey) => void;
}) {
  const options = UNIVERSITY_RULES.filter((u) => u.tac === selectedTac);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((uni) => {
        const active = selectedTargets.includes(uni.key);
        return (
          <button
            key={uni.key}
            onClick={() => onToggle(uni.key)}
            className={cn(
              "rounded-full border px-3 py-2 text-sm font-medium transition",
              active
                ? "border-violet-300 bg-violet-100 text-violet-900"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            )}
          >
            {uni.name}
          </button>
        );
      })}
    </div>
  );
}

function InterviewPreviewCard({
  band,
  count,
  active,
  onClick,
}: {
  band: InterviewBand;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-3xl border p-4 text-left shadow-sm transition",
        active ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50"
      )}
    >
      <div className="text-sm font-semibold text-slate-900">{INTERVIEW_LABEL[band]}</div>
      <div className="mt-3 text-3xl font-black tracking-tight text-slate-950">{count}</div>
      <div className="mt-1 text-sm text-slate-500">strong + competitive targets</div>
    </button>
  );
}

function InsightsBandSection({
  title,
  description,
  items,
  tone,
}: {
  title: string;
  description: string;
  items: EvaluatedUniversity[];
  tone: BandKey;
}) {
  if (!items.length) return null;

  return (
    <section className={cn("rounded-3xl border p-6 shadow-sm", BAND_STYLES[tone])}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black tracking-tight">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">{items.length}</span>
      </div>

      <div className="grid gap-4">
        {items.map((uni) => (
          <UniversityInsightCard key={uni.key} uni={uni} />
        ))}
      </div>
    </section>
  );
}

export default function OptimiseClient({ isPremium }: { isPremium: boolean }) {
  const [tab, setTab] = useState<TabKey>("bonded");

  const [atar, setAtar] = useState(99.2);
  const [ucat, setUcat] = useState(2850);
  const [status, setStatus] = useState<StudentStatus>("metropolitan");
  const [interview, setInterview] = useState<InterviewBand>("average");
  const [bonded, setBonded] = useState<BondedOpenness>("open");
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>(2);

  const [selectedTac, setSelectedTac] = useState<TacSystem>("QTAC");
  const [preferenceGoal, setPreferenceGoal] =
    useState<PreferenceGoal>("normal");
  const [preferences, setPreferences] = useState<UniKey[]>([
    "uq",
    "jcu",
    "griffith",
    "bond",
  ]);

  const [scenarioATARDelta, setScenarioATARDelta] = useState(0);
  const [scenarioUCATDelta, setScenarioUCATDelta] = useState(0);
  const [scenarioInterview, setScenarioInterview] =
    useState<InterviewBand>("average");

  const [interviewRun, setInterviewRun] = useState(false);
  const [insightsRun, setInsightsRun] = useState(false);

  const baseProfile: Profile = {
    atar,
    ucat,
    status,
    interview,
    bonded,
    riskTolerance,
    preferences,
  };

  const scenarioProfile: Profile = {
    ...baseProfile,
    atar: clamp(atar + scenarioATARDelta, 80, 99.95),
    ucat: clamp(ucat + scenarioUCATDelta, 0, 3600),
    interview: scenarioInterview,
  };

  const evaluatedBase = useMemo(
    () => UNIVERSITY_RULES.map((rule) => evaluateUniversity(rule, baseProfile)),
    [atar, ucat, status, interview, bonded, riskTolerance, preferences]
  );

  const evaluatedScenario = useMemo(
    () =>
      UNIVERSITY_RULES.map((rule) =>
        evaluateUniversity(rule, scenarioProfile)
      ),
    [
      atar,
      ucat,
      status,
      bonded,
      riskTolerance,
      preferences,
      scenarioATARDelta,
      scenarioUCATDelta,
      scenarioInterview,
    ]
  );

  const tacScopedOptions = useMemo(() => {
    return getTacScopedUniversities(evaluatedBase, selectedTac);
  }, [evaluatedBase, selectedTac]);

  const preferenceScoped = useMemo(() => {
    return scorePreferences(
      evaluatedBase,
      selectedTac,
      preferenceGoal,
      preferences
    );
  }, [evaluatedBase, selectedTac, preferenceGoal, preferences]);

  const preferenceStrategies = useMemo(() => {
    return {
      safe: scorePreferences(
        evaluatedBase,
        selectedTac,
        "safe",
        preferences
      ),
      normal: scorePreferences(
        evaluatedBase,
        selectedTac,
        "normal",
        preferences
      ),
      aggressive: scorePreferences(
        evaluatedBase,
        selectedTac,
        "aggressive",
        preferences
      ),
    };
  }, [evaluatedBase, selectedTac, preferences]);

  const interviewSchools = useMemo(() => {
    return evaluatedBase
      .filter((u) => u.hasInterview)
      .sort((a, b) => b.weights.interview - a.weights.interview || b.score - a.score);
  }, [evaluatedBase]);

  const interviewBandPreview = useMemo(() => {
    return (["weak", "average", "strong", "exceptional"] as InterviewBand[]).map(
      (band) => {
        const previewProfile: Profile = { ...baseProfile, interview: band };
        const preview = UNIVERSITY_RULES.map((rule) =>
          evaluateUniversity(rule, previewProfile)
        );
        return {
          band,
          count: preview.filter(
            (u) => u.band === "strong" || u.band === "competitive"
          ).length,
        };
      }
    );
  }, [baseProfile]);

  const interviewGrouped = useMemo(() => {
    return buildInsightsRun(interviewSchools);
  }, [interviewSchools]);

  const insightsGrouped = useMemo(() => {
    return buildInsightsRun(evaluatedBase);
  }, [evaluatedBase]);

  const summary = useMemo(() => {
    const counts = {
      strong: evaluatedBase.filter((u) => u.band === "strong").length,
      competitive: evaluatedBase.filter((u) => u.band === "competitive").length,
      possible: evaluatedBase.filter((u) => u.band === "possible").length,
      unlikely: evaluatedBase.filter((u) => u.band === "unlikely").length,
    };

    const biggestLevers: string[] = [];

    const averageATARGap =
      evaluatedBase
        .filter((u) => u.weights.atar > 0)
        .reduce((sum, u) => sum + Math.max(0, u.gap.atar), 0) /
      Math.max(1, evaluatedBase.filter((u) => u.weights.atar > 0).length);

    const averageUCATGap =
      evaluatedBase
        .filter((u) => u.usesUcat)
        .reduce((sum, u) => sum + Math.max(0, u.gap.ucat), 0) /
      Math.max(1, evaluatedBase.filter((u) => u.usesUcat).length);

    if (averageUCATGap > 120) {
      biggestLevers.push(
        "UCAT improvements would shift more universities than very small ATAR gains."
      );
    }
    if (averageATARGap > 0.35) {
      biggestLevers.push(
        "ATAR is still excluding several academically filtered programs."
      );
    }
    if (interview === "weak" || interview === "average") {
      biggestLevers.push(
        "Interview performance is still the biggest swing factor for this profile."
      );
    }
    if (bonded === "avoid") {
      biggestLevers.push(
        "Avoiding bonded places reduces flexibility for some workforce-targeted pathways."
      );
    }

    return { counts, biggestLevers: biggestLevers.slice(0, 3) };
  }, [evaluatedBase, interview, bonded]);

  const scenarioShift = useMemo(() => {
    const movedUp = evaluatedScenario.filter((uni) => {
      const current = evaluatedBase.find((item) => item.key === uni.key);
      return current && bandOrder(uni.band) > bandOrder(current.band);
    });

    return movedUp.sort((a, b) => b.score - a.score);
  }, [evaluatedBase, evaluatedScenario]);

  function togglePreference(key: UniKey) {
    setPreferences((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key].slice(0, 10)
    );
  }

  return (
    <FeatureGate
      locked={!isPremium}
      title="Upgrade to unlock Optimise"
      description="Use the full strategy engine for bonded decisions, preference ordering, interview planning, competitiveness insights, and scenario testing."
      ctaHref="/upgrade"
      ctaLabel="Upgrade to Pro"
      previewLabel="Optimise"
    >
      <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionTitle
            icon={LineChart}
            eyebrow="OPTIMISE"
            title="Turn your performance into strategic decisions"
            description="This layer should feel like a decision engine, not a giant form. The profile stays compact, while each tab handles one real job: bonded choices, preference ordering, interview planning, competitiveness insights, and scenarios."
          />

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <Sparkles className="h-4 w-4" />
                  Cleaner optimise layer
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                  The profile is now a compact strip instead of a huge
                  core-profile box that keeps pushing the real output down.
                  Users see the decision layer first, then control the input
                  where it actually matters.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  label="Strong"
                  value={String(summary.counts.strong)}
                  hint="Best current fits"
                />
                <MetricCard
                  label="Competitive"
                  value={String(summary.counts.competitive)}
                  hint="Live with execution"
                />
                <MetricCard
                  label="Possible"
                  value={String(summary.counts.possible)}
                  hint="Good stretches"
                />
                <MetricCard
                  label="Status lens"
                  value={STATUS_LABEL[status]}
                  hint={BONDED_LABEL[bonded]}
                />
              </div>
            </div>

            <div className="mt-6">
              <ProfileStrip
                atar={atar}
                ucat={ucat}
                status={status}
                interview={interview}
                bonded={bonded}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-100 p-1.5">
              <div className="grid gap-1 md:grid-cols-5">
                {TAB_ORDER.map(({ key, label, icon: Icon }) => (
                  <TabButton
                    key={key}
                    active={tab === key}
                    onClick={() => setTab(key)}
                    label={label}
                    icon={Icon}
                  />
                ))}
              </div>
            </div>
          </div>

          {tab === "bonded" && (
            <section className="space-y-6">
              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-2">
                    <HeartHandshake className="h-5 w-5 text-emerald-600" />
                    <h2 className="text-2xl font-black tracking-tight text-slate-950">
                      Bonded strategy settings
                    </h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <NumberInput
                      label="Predicted ATAR"
                      value={atar}
                      onChange={setAtar}
                      min={80}
                      max={99.95}
                      step={0.05}
                    />
                    <NumberInput
                      label="UCAT total"
                      value={ucat}
                      onChange={setUcat}
                      min={0}
                      max={3600}
                      step={10}
                    />

                    <FilterSelect
                      label="Student status"
                      value={status}
                      onChange={(value) => setStatus(value as StudentStatus)}
                    >
                      <option value="metropolitan">Metropolitan</option>
                      <option value="rural">Rural</option>
                      <option value="international">International</option>
                    </FilterSelect>

                    <FilterSelect
                      label="Interview performance"
                      value={interview}
                      onChange={(value) => setInterview(value as InterviewBand)}
                    >
                      <option value="weak">Weak</option>
                      <option value="average">Average</option>
                      <option value="strong">Strong</option>
                      <option value="exceptional">Exceptional</option>
                    </FilterSelect>

                    <FilterSelect
                      label="Bonded openness"
                      value={bonded}
                      onChange={(value) => setBonded(value as BondedOpenness)}
                    >
                      <option value="avoid">Avoid bonded</option>
                      <option value="open">Open to bonded</option>
                      <option value="prefer">Prefer bonded if helpful</option>
                    </FilterSelect>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">
                          Risk tolerance
                        </span>
                        <span className="text-sm font-semibold text-violet-700">
                          {
                            [
                              "Safe",
                              "Measured",
                              "Balanced",
                              "Ambitious",
                              "Aggressive",
                            ][riskTolerance]
                          }
                        </span>
                      </div>
                      <Slider
                        value={riskTolerance}
                        min={0}
                        max={4}
                        step={1}
                        onChange={(value) =>
                          setRiskTolerance(value as RiskTolerance)
                        }
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Safe</span>
                        <span>Aggressive</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <InlineNote
                    title="When bonded actually helps"
                    text="Bonded places are only useful when they genuinely improve your strategic flexibility and still align with your values. They should not be treated like a panic button."
                    tone="amber"
                  />
                  <InlineNote
                    title="Current leverage"
                    text={
                      summary.biggestLevers.length
                        ? summary.biggestLevers[0]
                        : "This profile is fairly balanced. Preference ordering and interview execution matter most now."
                    }
                    tone="blue"
                  />
                  <InlineNote
                    title="Best use case"
                    text="Bonded tends to matter more for users who are near the planning line, open to regional service, and willing to optimise for outcome rather than pure prestige."
                    tone="emerald"
                  />
                </div>
              </div>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 text-xl font-black tracking-tight text-slate-950">
                  Best bonded-friendly targets for this user
                </div>
                <div className="grid gap-4">
                  {evaluatedBase
                    .filter((u) => u.bondedFriendly)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 6)
                    .map((uni) => (
                      <UniversityInsightCard key={uni.key} uni={uni} />
                    ))}
                </div>
              </section>
            </section>
          )}

          {tab === "preference" && (
            <section className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                  <Target className="h-5 w-5 text-violet-600" />
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">
                    Your preferences & constraints
                  </h2>
                </div>

                <div className="space-y-5">
                  <FilterSelect
                    label="Filter by TAC system"
                    value={selectedTac}
                    onChange={(value) => {
                      const nextTac = value as TacSystem;
                      setSelectedTac(nextTac);
                      setPreferences((current) =>
                        current.filter(
                          (key) =>
                            UNIVERSITY_RULES.find((u) => u.key === key)?.tac === nextTac
                        )
                      );
                    }}
                  >
                    {TAC_OPTIONS.map((tac) => (
                      <option key={tac} value={tac}>
                        {tac}
                      </option>
                    ))}
                  </FilterSelect>

                  <div>
                    <div className="mb-2 text-sm font-medium text-slate-700">
                      Target universities ({preferences.length}/10)
                    </div>
                    <TargetSelectGrid
                      selectedTac={selectedTac}
                      selectedTargets={preferences}
                      onToggle={togglePreference}
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      These act as preference boosts only. The optimiser still ranks all universities inside the selected TAC so the strategy stays realistic.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        Risk tolerance
                      </span>
                      <span className="text-sm font-semibold text-violet-700">
                        {
                          [
                            "Safe",
                            "Measured",
                            "Balanced",
                            "Ambitious",
                            "Aggressive",
                          ][riskTolerance]
                        }
                      </span>
                    </div>
                    <Slider
                      value={riskTolerance}
                      min={0}
                      max={4}
                      step={1}
                      onChange={(value) =>
                        setRiskTolerance(value as RiskTolerance)
                      }
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Safe (maximise offer chance)</span>
                      <span>Aggressive (reach for prestige)</span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FilterSelect
                      label="Student status"
                      value={status}
                      onChange={(value) => setStatus(value as StudentStatus)}
                    >
                      <option value="metropolitan">Metropolitan</option>
                      <option value="rural">Rural / Regional</option>
                      <option value="international">International</option>
                    </FilterSelect>

                    <FilterSelect
                      label="Bonded options"
                      value={bonded}
                      onChange={(value) => setBonded(value as BondedOpenness)}
                    >
                      <option value="avoid">Avoid bonded</option>
                      <option value="open">Open to bonded</option>
                      <option value="prefer">Prefer bonded if helpful</option>
                    </FilterSelect>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone="slate">Current TAC</Pill>
                      <Pill tone="violet">{selectedTac}</Pill>
                      <Pill tone="blue">{tacScopedOptions.length} options analysed</Pill>
                      <Pill tone="emerald">{preferences.filter((key) => UNIVERSITY_RULES.find((u) => u.key === key)?.tac === selectedTac).length} selected in this TAC</Pill>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                      The optimiser now builds Safe, Normal, and Aggressive lists strictly inside <span className="font-semibold text-slate-900">{selectedTac}</span>. No cross-TAC mixing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-3">
                <PreferenceCard
                  tone="rose"
                  title="Aggressive"
                  subtitle="Higher upside, higher risk, but only within this TAC."
                  items={preferenceStrategies.aggressive}
                  selectedTargets={preferences}
                />
                <PreferenceCard
                  tone="blue"
                  title="Normal"
                  subtitle="Best overall mix of realistic and selective options in this TAC."
                  items={preferenceStrategies.normal}
                  selectedTargets={preferences}
                />
                <PreferenceCard
                  tone="emerald"
                  title="Safe"
                  subtitle="Maximises probability of receiving an offer in this TAC."
                  items={preferenceStrategies.safe}
                  selectedTargets={preferences}
                />
              </div>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-600" />
                  <h3 className="text-xl font-black tracking-tight text-slate-950">
                    Live preview: {PREFERENCE_GOAL_LABEL[preferenceGoal]} order
                  </h3>
                </div>
                <p className="mb-5 text-sm text-slate-600">
                  {PREFERENCE_GOAL_COPY[preferenceGoal]}
                </p>

                <div className="mb-5 grid gap-2 sm:grid-cols-3">
                  {(["aggressive", "normal", "safe"] as PreferenceGoal[]).map((goal) => (
                    <button
                      key={goal}
                      onClick={() => setPreferenceGoal(goal)}
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                        preferenceGoal === goal
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      {PREFERENCE_GOAL_LABEL[goal]}
                    </button>
                  ))}
                </div>

                <div className="grid gap-3">
                  {preferenceScoped.slice(0, 8).map((uni, index) => {
                    const selected = preferences.includes(uni.key);

                    return (
                      <div
                        key={uni.key}
                        className={cn(
                          "flex items-center justify-between rounded-2xl border px-4 py-3",
                          selected ? "border-violet-200 bg-violet-50" : "border-slate-200 bg-slate-50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700">
                            {index + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-semibold text-slate-950">{uni.name}</div>
                              {selected ? <Pill tone="violet">Selected</Pill> : null}
                            </div>
                            <div className="text-xs text-slate-500">
                              {uni.pathway} · {bandLabel(uni.band)}
                            </div>
                          </div>
                        </div>
                        <Pill tone={uni.band === "strong" ? "emerald" : uni.band === "competitive" ? "blue" : uni.band === "possible" ? "amber" : "rose"}>
                          {bandLabel(uni.band)}
                        </Pill>
                      </div>
                    );
                  })}
                </div>
              </section>
            </section>
          )}

          {tab === "interview" && (
            <section className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <UserRoundCheck className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">
                    Interview predictor
                  </h2>
                </div>
                <p className="mb-5 text-sm leading-6 text-slate-600">
                  Enter your current numbers and pick your estimated interview
                  band. This model is not trying to fake precision. It shows
                  which pathways are interview-sensitive and where interview
                  execution could move the portfolio.
                </p>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    <FilterSelect
                      label="Student status"
                      value={status}
                      onChange={(value) => setStatus(value as StudentStatus)}
                    >
                      <option value="metropolitan">Metropolitan</option>
                      <option value="rural">Rural / Regional</option>
                      <option value="international">International</option>
                    </FilterSelect>

                    <NumberInput
                      label="Predicted ATAR"
                      value={atar}
                      onChange={setAtar}
                      min={80}
                      max={99.95}
                      step={0.05}
                      placeholder="30.00-99.95"
                    />
                    <NumberInput
                      label="UCAT total"
                      value={ucat}
                      onChange={setUcat}
                      min={0}
                      max={3600}
                      step={10}
                      placeholder="900-2700+"
                    />
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
                    <FilterSelect
                      label="Interview performance"
                      value={interview}
                      onChange={(value) => setInterview(value as InterviewBand)}
                    >
                      <option value="weak">Weak</option>
                      <option value="average">Average</option>
                      <option value="strong">Strong</option>
                      <option value="exceptional">Exceptional</option>
                    </FilterSelect>

                    <div className="flex items-end">
                      <button
                        onClick={() => setInterviewRun(true)}
                        className="w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 md:w-auto"
                      >
                        Calculate My Chances
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                    Disclaimer: This interview model is for planning only. It
                    estimates band movement and interview sensitivity. It is not
                    an official admissions prediction.
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  {interviewBandPreview.map((item) => (
                    <InterviewPreviewCard
                      key={item.band}
                      band={item.band}
                      count={item.count}
                      active={item.band === interview}
                      onClick={() => setInterview(item.band)}
                    />
                  ))}
                </div>
              </div>

              {interviewRun ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <MetricCard
                      label="Strong chance"
                      value={String(interviewGrouped.strong.length)}
                      hint="best interview-aligned schools"
                    />
                    <MetricCard
                      label="Competitive"
                      value={String(interviewGrouped.competitive.length)}
                      hint="live if execution goes well"
                    />
                    <MetricCard
                      label="Possible"
                      value={String(interviewGrouped.possible.length)}
                      hint="interview can still matter"
                    />
                    <MetricCard
                      label="Below threshold"
                      value={String(interviewGrouped.unlikely.length)}
                      hint="needs more than interview alone"
                    />
                  </div>

                  <InsightsBandSection
                    title="Strong chance"
                    description="These are interview-sensitive schools where your current profile already sits well."
                    items={interviewGrouped.strong}
                    tone="strong"
                  />
                  <InsightsBandSection
                    title="Competitive"
                    description="These are live options where the interview can genuinely swing the result."
                    items={interviewGrouped.competitive}
                    tone="competitive"
                  />
                  <InsightsBandSection
                    title="Possible"
                    description="These are stretches, but still worth understanding."
                    items={interviewGrouped.possible}
                    tone="possible"
                  />
                </div>
              ) : null}
            </section>
          )}

          {tab === "insights" && (
            <section className="space-y-6">
              <InlineNote
                title="What these competitiveness insights are"
                text="These insights give illustrative guidance only. They communicate competitiveness using bands and factor mix, not fake probability percentages."
                tone="blue"
              />

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">
                    Your metrics
                  </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <NumberInput
                    label="ATAR"
                    value={atar}
                    onChange={setAtar}
                    min={80}
                    max={99.95}
                    step={0.05}
                  />
                  <NumberInput
                    label="UCAT total"
                    value={ucat}
                    onChange={setUcat}
                    min={0}
                    max={3600}
                    step={10}
                  />
                  <FilterSelect
                    label="Interview performance"
                    value={interview}
                    onChange={(value) => setInterview(value as InterviewBand)}
                  >
                    <option value="weak">Weak</option>
                    <option value="average">Average</option>
                    <option value="strong">Strong</option>
                    <option value="exceptional">Exceptional</option>
                  </FilterSelect>
                  <FilterSelect
                    label="Student status"
                    value={status}
                    onChange={(value) => setStatus(value as StudentStatus)}
                  >
                    <option value="metropolitan">Metropolitan</option>
                    <option value="rural">Rural / Regional</option>
                    <option value="international">International</option>
                  </FilterSelect>
                </div>

                <button
                  onClick={() => setInsightsRun(true)}
                  className="mt-5 w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Calculate Probability Bands
                </button>
              </div>

              {insightsRun ? (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-3xl font-black tracking-tight text-slate-950">
                      Your competitiveness bands
                    </h3>
                    <Pill tone="slate">
                      {UNIVERSITY_RULES.length} universities analysed
                    </Pill>
                  </div>

                  <InsightsBandSection
                    title="Strong likelihood"
                    description="You meet or exceed the current weighted planning line for these pathways."
                    items={insightsGrouped.strong}
                    tone="strong"
                  />
                  <InsightsBandSection
                    title="Competitive"
                    description="These are realistic pathways if application execution goes well."
                    items={insightsGrouped.competitive}
                    tone="competitive"
                  />
                  <InsightsBandSection
                    title="Possible"
                    description="These are live stretches, not dead ends."
                    items={insightsGrouped.possible}
                    tone="possible"
                  />
                  <InsightsBandSection
                    title="Below threshold"
                    description="These currently need a more meaningful profile change."
                    items={insightsGrouped.unlikely}
                    tone="unlikely"
                  />
                </>
              ) : null}
            </section>
          )}

          {tab === "scenario" && (
            <section className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-600" />
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">
                    Scenario explorer
                  </h2>
                </div>
                <p className="mb-5 text-sm leading-6 text-slate-600">
                  This shows directional movement, not fake certainty. Use it
                  to test whether ATAR, UCAT, or interview gains actually change
                  the portfolio.
                </p>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        ATAR adjustment
                      </span>
                      <span className="text-sm font-bold text-violet-700">
                        {scenarioATARDelta >= 0 ? "+" : ""}
                        {safeRound(scenarioATARDelta, 2)}
                      </span>
                    </div>
                    <Slider
                      value={scenarioATARDelta}
                      min={-2}
                      max={2}
                      step={0.05}
                      onChange={setScenarioATARDelta}
                    />
                    <div className="text-xs text-slate-500">
                      Current {atar.toFixed(2)} → Simulated{" "}
                      {(atar + scenarioATARDelta).toFixed(2)}
                    </div>
                  </div>

                  <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        UCAT adjustment
                      </span>
                      <span className="text-sm font-bold text-violet-700">
                        {scenarioUCATDelta >= 0 ? "+" : ""}
                        {scenarioUCATDelta}
                      </span>
                    </div>
                    <Slider
                      value={scenarioUCATDelta}
                      min={-400}
                      max={400}
                      step={10}
                      onChange={setScenarioUCATDelta}
                    />
                    <div className="text-xs text-slate-500">
                      Current {ucat} → Simulated {ucat + scenarioUCATDelta}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <FilterSelect
                    label="Scenario interview performance"
                    value={scenarioInterview}
                    onChange={(value) =>
                      setScenarioInterview(value as InterviewBand)
                    }
                  >
                    <option value="weak">Weak</option>
                    <option value="average">Average</option>
                    <option value="strong">Strong</option>
                    <option value="exceptional">Exceptional</option>
                  </FilterSelect>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <MetricCard
                  label="Current strong + competitive"
                  value={String(
                    evaluatedBase.filter(
                      (u) => u.band === "strong" || u.band === "competitive"
                    ).length
                  )}
                  hint="baseline portfolio"
                />
                <MetricCard
                  label="Scenario strong + competitive"
                  value={String(
                    evaluatedScenario.filter(
                      (u) => u.band === "strong" || u.band === "competitive"
                    ).length
                  )}
                  hint="after simulated change"
                />
                <MetricCard
                  label="Universities improved"
                  value={String(scenarioShift.length)}
                  hint="moved into a higher band"
                />
                <MetricCard
                  label="Scenario interview"
                  value={INTERVIEW_LABEL[scenarioInterview]}
                  hint="often shifts more than expected"
                />
              </div>

              <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-emerald-950">
                  <ArrowRight className="h-5 w-5" />
                  <h3 className="text-xl font-black tracking-tight">
                    Most meaningful gains from this scenario
                  </h3>
                </div>

                <div className="grid gap-4">
                  {scenarioShift.length ? (
                    scenarioShift
                      .slice(0, 8)
                      .map((uni) => (
                        <UniversityInsightCard key={uni.key} uni={uni} />
                      ))
                  ) : (
                    <div className="rounded-2xl border border-emerald-200 bg-white/80 p-4 text-sm text-emerald-900">
                      This scenario does not materially change the portfolio.
                      That is useful too — it means your next lever is probably
                      somewhere else.
                    </div>
                  )}
                </div>
              </section>
            </section>
          )}
        </div>
      </main>
    </FeatureGate>
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
        className={cn(
          "transition",
          locked ? "pointer-events-none select-none blur-md opacity-40" : ""
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