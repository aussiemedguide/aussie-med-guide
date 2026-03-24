"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useScribe } from "@elevenlabs/react";
import PulseOrb from "@/components/train/PulseOrb";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  GraduationCap,
  LineChart,
  Lock,
  Plus,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  Users,
  Wand2,
} from "lucide-react";

type TrainClientProps = {
  isPremium: boolean;
  userId: string;
};

type TrainTab = "readiness" | "ucat" | "atar" | "interview";
type InterviewTab = "practice" | "stories" | "progress";
type InterviewMode = "MMI" | "Panel";
type StateKey = "NSW_ACT" | "QLD" | "VIC" | "WA" | "SA_NT" | "TAS";

type UcatAttempt = {
  id: string;
  date: string;
  label: string;
  total: number;
  vr: number;
  dm: number;
  qr: number;
  ar: number;
  sjt: number;
};

type StoryItem = {
  id: string;
  title: string;
  category: string;
  situation: string;
  action: string;
  result: string;
  tags: string;
};

type PracticeAttempt = {
  id: string;
  createdAt: string;
  mode: string;
  title: string;
  prompt: string;
  response: string;
  clarity: number;
  reasoning: number;
  empathy: number;
  structure: number;
  professionalism: number;
  overall: number;
  feedback: string;
  improvements: string[];
};

type InterviewPrompt = {
  title: string;
  scenario: string;
  questions: string[];
  theme: string;
};

type PanelPrompt = {
  title: string;
  prompt: string;
  theme: string;
};

type AtarSubject = {
  id: string;
  name: string;
};

type InterviewAttemptRow = {
  id: string;
  created_at: string;
  mode: string;
  title: string;
  prompt: string;
  response: string;
  clarity: number;
  reasoning: number;
  empathy: number;
  structure: number;
  professionalism: number;
  overall: number;
  feedback: string;
  improvements: string[] | null;
};

const ucatStorageKey = "amg-train-ucat";
const storyStorageKey = "amg-train-stories";

const subjectOptions = [
  "English",
  "English Advanced / Extension",
  "Mathematical Methods",
  "Specialist Mathematics",
  "General Mathematics",
  "Chemistry",
  "Biology",
  "Physics",
  "Literature",
  "Legal Studies",
  "Economics",
  "History",
  "Languages",
  "Psychology",
];

const stateConfigs: Record<
  StateKey,
  {
    label: string;
    short: string;
    summary: string;
    links: { label: string; href: string }[];
    bullets: string[];
  }
> = {
  NSW_ACT: {
    label: "NSW / ACT",
    short: "UAC / ACT BSSS",
    summary:
      "Scaled marks drive the ranking, and the aggregate includes best 2 units of English plus the next best 8 units.",
    links: [
      {
        label: "UAC: How your ATAR is calculated",
        href: "https://www.uac.edu.au/future-applicants/atar/how-your-atar-is-calculated",
      },
      {
        label: "UAC: ATAR overview",
        href: "https://www.uac.edu.au/future-applicants/atar",
      },
    ],
    bullets: [
      "English is structurally important because it is forced into the aggregate.",
      "Cohort strength matters heavily.",
      "Use scaling reports as context, not as a subject-picking shortcut.",
    ],
  },
  QLD: {
    label: "Queensland",
    short: "QTAC / QCAA",
    summary:
      "Queensland ATAR is based on scaled results and eligibility depends on specific subject combinations, including an English requirement.",
    links: [
      {
        label: "QTAC: ATAR overview",
        href: "https://www.qtac.edu.au/atar/",
      },
      {
        label: "QTAC: 2024 ATAR Report",
        href: "https://www.qtac.edu.au/wp-content/staticfiles/ATAR_Report_2024.pdf",
      },
    ],
    bullets: [
      "Eligibility combination matters, not just raw subject performance.",
      "Inter-subject scaling changes yearly.",
      "Strong performance usually beats chasing scale myths.",
    ],
  },
  VIC: {
    label: "Victoria",
    short: "VTAC / VCAA",
    summary:
      "VTAC scales VCE study scores to make subjects comparable and notes extra rules for mathematics and languages.",
    links: [
      {
        label: "VTAC: ATAR and scaling",
        href: "https://vtac.edu.au/help/atar-scaling",
      },
      {
        label: "VTAC: Results and the ATAR",
        href: "https://vtac.edu.au/atar",
      },
    ],
    bullets: [
      "Mathematics and languages can have additional scaling rules.",
      "Competitive cohorts can help, but weak performance still hurts.",
      "Think in terms of study-score strength, not subject reputation.",
    ],
  },
  WA: {
    label: "Western Australia",
    short: "TISC / SCSA",
    summary:
      "WA calculates a TEA from the best four scaled WACE scores, then converts that to an ATAR.",
    links: [
      {
        label: "TISC: Scaling statistics",
        href: "https://www.tisc.edu.au/static/statistics/scaling/scaling-index.tisc",
      },
      {
        label: "TISC: ATAR overview",
        href: "https://www.tisc.edu.au/static/guide/atar-about.tisc",
      },
    ],
    bullets: [
      "Best four scaled scores matter most.",
      "Weak fifth and sixth subjects matter less than in some other systems.",
      "Optimise for where you score best.",
    ],
  },
  SA_NT: {
    label: "South Australia / Northern Territory",
    short: "SATAC / SACE / NTCET",
    summary:
      "SATAC scales SACE and NTCET results, but subject-level detail is not publicly shown the way many students expect.",
    links: [
      {
        label: "SATAC: Scaling",
        href: "https://www.satac.edu.au/scaling",
      },
      {
        label: "SATAC: Scaling FAQ",
        href: "https://www.satac.edu.au/frequently-asked-questions-about-scaling",
      },
    ],
    bullets: [
      "Do not pick subjects purely on scaling rumours.",
      "Optimise for fit, prerequisites, and strength.",
      "Public subject-by-subject scaling detail is limited.",
    ],
  },
  TAS: {
    label: "Tasmania",
    short: "TASC / UTAS",
    summary:
      "Tasmania scales Level 3 and 4 courses, then converts the TE Score to an ATAR. Scaling changes year to year.",
    links: [
      {
        label: "TASC: Course scaling",
        href: "https://www.tasc.tas.gov.au/students/university/course-scaling/",
      },
      {
        label: "TASC: TE Score and ATAR calculation",
        href: "https://www.tasc.tas.gov.au/students/university/focus-on-te-score-and-atar-calculation/",
      },
    ],
    bullets: [
      "Use annual scaling data as context only.",
      "Do not treat one year as a stable predictor.",
      "Focus on strong Level 3 and 4 course performance.",
    ],
  },
};

const mmiPrompts: InterviewPrompt[] = [
  {
    title: "Academic Integrity and Friendship",
    theme: "Ethics",
    scenario:
      "Three months into first year medicine, your close friend is found to have plagiarised a medical ethics assignment. The faculty is investigating and the friendship is under strain.",
    questions: [
      "Why might a student plagiarise in the first place?",
      "If you discovered it before staff did, would you report it?",
      "What would be a proportionate consequence?",
      "Who should take responsibility here?",
      "Should universities be stricter about plagiarism?",
    ],
  },
  {
    title: "Bonded Medical Program",
    theme: "Rural health",
    scenario:
      "A friend has been offered a bonded medical place that requires return-of-service in rural or remote areas after graduation. They are unsure whether accepting such a commitment at 18 is fair.",
    questions: [
      "Do you think bonded medical places are an effective rural workforce strategy?",
      "Why is it important to reduce the rural health gap?",
      "What alternatives could improve rural doctor supply?",
      "Why might graduates hesitate to work rurally?",
      "Would you personally consider rural work, and why?",
    ],
  },
  {
    title: "Captaincy and Fair Selection",
    theme: "Leadership",
    scenario:
      "You are captain of a school sports team. Your best friend underperforms at trials and does not meet first-team standard, but rejecting them may damage the friendship.",
    questions: [
      "What would you do?",
      "What makes a team selection process fair?",
      "Is it ethical to give a friend special treatment?",
      "Would a white lie ever be justified here?",
      "What would your peers say about your leadership style?",
    ],
  },
  {
    title: "Exam Cheating",
    theme: "Ethics",
    scenario:
      "During an important assessment, you notice a friend using notes from their pocket. Afterwards, they casually discuss the exam as though nothing happened.",
    questions: [
      "Would you report the cheating?",
      "Why might they have cheated?",
      "Does your approach change if they claim they misunderstood the rules?",
      "Tell us about a time you had to make a stressful decision.",
      "What did you learn from that decision?",
    ],
  },
];

const panelQuestions: PanelPrompt[] = [
  {
    title: "Motivation",
    prompt: "Why do you want to study medicine rather than another healthcare profession?",
    theme: "Motivation",
  },
  {
    title: "Insight",
    prompt: "What do you think will be the most challenging aspect of being a doctor?",
    theme: "Insight",
  },
  {
    title: "Personal Reflection",
    prompt: "Describe a time you faced failure or disappointment and what you learned.",
    theme: "Reflection",
  },
  {
    title: "Teamwork",
    prompt: "Tell us about a time you worked effectively in a team.",
    theme: "Teamwork",
  },
  {
    title: "Stress Management",
    prompt: "How do you manage stress and pressure when expectations are high?",
    theme: "Resilience",
  },
  {
    title: "Ethics",
    prompt: "A patient refuses a treatment you believe could save their life. How would you approach the situation?",
    theme: "Ethics",
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function avg(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function formatDate(date: string) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getReadinessBand(score: number) {
  if (score >= 80) return "High Readiness";
  if (score >= 60) return "Moderate Readiness";
  if (score >= 40) return "Developing";
  return "Early Stage";
}

function getScoreTone(value: number) {
  if (value >= 80) return "emerald";
  if (value >= 65) return "blue";
  if (value >= 50) return "amber";
  return "rose";
}

function getSubjectImpact(state: StateKey, subject: string) {
  const s = subject.toLowerCase();

  if (state === "NSW_ACT") {
    if (s.includes("english")) {
      return {
        tag: "Structural",
        text: "English is forced into the aggregate, so weak English performance directly hurts your rank.",
      };
    }
    if (s.includes("methods") || s.includes("specialist") || s.includes("physics")) {
      return {
        tag: "Competitive cohort",
        text: "These can sit in stronger cohorts, but they only help if you personally score strongly.",
      };
    }
    return {
      tag: "Cohort-based",
      text: "Scaling depends on who studies the subject and how those students perform elsewhere.",
    };
  }

  if (state === "QLD") {
    if (s.includes("english")) {
      return {
        tag: "Eligibility",
        text: "An English subject is part of ATAR eligibility, so it matters structurally as well as academically.",
      };
    }
    return {
      tag: "Scaled annually",
      text: "QTAC recalculates inter-subject scaling each year, so treat this as a live system rather than a fixed ladder.",
    };
  }

  if (state === "VIC") {
    if (s.includes("methods") || s.includes("specialist") || s.includes("languages")) {
      return {
        tag: "Extra rules",
        text: "VTAC specifically notes additional scaling rules for mathematics and languages.",
      };
    }
    return {
      tag: "Study-score scaling",
      text: "Your study score is scaled against cohort competitiveness across studies.",
    };
  }

  if (state === "WA") {
    return {
      tag: "Best four focus",
      text: "This subject mainly matters if it ends up among your best four scaled scores feeding the TEA.",
    };
  }

  if (state === "SA_NT") {
    return {
      tag: "Non-public detail",
      text: "SATAC does not publicly release the subject-level scaling detail students often look for, so optimise for fit and strength.",
    };
  }

  return {
    tag: "Year-sensitive",
    text: "TASC scaling changes year to year, so use annual scaling sheets as context only, not prediction.",
  };
}

function mapDbAttempt(row: InterviewAttemptRow): PracticeAttempt {
  return {
    id: row.id,
    createdAt: row.created_at,
    mode: row.mode,
    title: row.title,
    prompt: row.prompt,
    response: row.response,
    clarity: row.clarity,
    reasoning: row.reasoning,
    empathy: row.empathy,
    structure: row.structure,
    professionalism: row.professionalism,
    overall: row.overall,
    feedback: row.feedback,
    improvements: row.improvements ?? [],
  };
}

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function responseEnergyLabel(words: number) {
  if (words >= 260) return "Strong depth";
  if (words >= 160) return "Good coverage";
  if (words >= 80) return "Developing";
  return "Needs depth";
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-3xl border border-slate-200 bg-white shadow-sm", className)}>
      {children}
    </section>
  );
}

function SoftBadge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "emerald" | "blue" | "amber" | "rose" | "violet";
}) {
  const styles: Record<string, string> = {
    slate: "border-slate-200 bg-white text-slate-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        styles[tone]
      )}
    >
      {children}
    </span>
  );
}

function TopTab({
  active,
  icon: Icon,
  title,
  text,
  onClick,
}: {
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-3xl border p-4 text-left transition",
        active
          ? "border-emerald-300 bg-emerald-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl",
            active ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-700"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
        </div>
      </div>
    </button>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{hint}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function ProgressBar({
  label,
  value,
  tone = "emerald",
}: {
  label: string;
  value: number;
  tone?: "blue" | "violet" | "emerald" | "amber";
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-slate-900">{Math.round(value)}/100</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div
          className={cn(
            "h-2 rounded-full transition-all",
            tone === "blue" && "bg-blue-600",
            tone === "violet" && "bg-violet-600",
            tone === "emerald" && "bg-emerald-600",
            tone === "amber" && "bg-amber-500"
          )}
          style={{ width: `${Math.max(4, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

function PracticeMetricTile({
  label,
  value,
  sub,
  tone = "slate",
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "slate" | "emerald" | "blue" | "amber" | "rose" | "violet";
}) {
  const tones: Record<string, string> = {
    slate: "border-slate-200 bg-white",
    emerald: "border-emerald-200 bg-emerald-50",
    blue: "border-blue-200 bg-blue-50",
    amber: "border-amber-200 bg-amber-50",
    rose: "border-rose-200 bg-rose-50",
    violet: "border-violet-200 bg-violet-50",
  };

  return (
    <div className={cn("rounded-2xl border p-4", tones[tone])}>
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">{value}</div>
      <div className="mt-1 text-xs text-slate-600">{sub}</div>
    </div>
  );
}

function InterviewModeButton({
  active,
  label,
  description,
  onClick,
}: {
  active: boolean;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-3xl border p-4 text-left transition",
        active
          ? "border-emerald-300 bg-emerald-50 shadow-sm"
          : "border-slate-200 bg-white hover:bg-slate-50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">{label}</div>
          <div className="mt-1 text-sm leading-6 text-slate-600">{description}</div>
        </div>
        {active ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        ) : null}
      </div>
    </button>
  );
}

function StudioPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm", className)}>
      {children}
    </div>
  );
}

function ScoreChip({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const score = Math.round(value * 20);
  const tone = getScoreTone(score);

  const toneClasses =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : tone === "amber"
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <div className={cn("rounded-2xl border px-3 py-3", toneClasses)}>
      <div className="text-[11px] font-bold uppercase tracking-[0.16em]">{label}</div>
      <div className="mt-1 text-lg font-black">{score}</div>
    </div>
  );
}

function PremiumLockedTrainPreview() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="pointer-events-none absolute inset-0 z-10 backdrop-blur-md" />
      <div className="pointer-events-none absolute inset-0 z-20 bg-white/60" />

      <div className="relative z-0 p-6 sm:p-8">
        <div className="grid gap-3 md:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="h-5 w-24 rounded-full bg-slate-200" />
              <div className="mt-4 h-5 w-40 rounded bg-slate-200" />
              <div className="mt-2 h-4 w-full rounded bg-slate-100" />
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="h-6 w-56 rounded bg-slate-200" />
            <div className="mt-5 h-56 rounded-3xl bg-slate-100" />
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="h-6 w-40 rounded bg-slate-200" />
              <div className="mt-4 space-y-3">
                <div className="h-12 rounded-2xl bg-slate-100" />
                <div className="h-12 rounded-2xl bg-slate-100" />
                <div className="h-12 rounded-2xl bg-slate-100" />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="h-6 w-44 rounded bg-slate-200" />
              <div className="mt-4 h-24 rounded-2xl bg-slate-100" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-30 flex items-center justify-center p-6">
        <div className="max-w-xl rounded-3xl border border-amber-200 bg-white/95 p-6 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-amber-100 text-amber-700">
            <Lock className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-2xl font-bold text-slate-950">Train is a Pro feature</h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Unlock the full preparation suite: readiness tracking, UCAT logging, ATAR risk
            management, interview practice, and structured story-bank tools.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            The interview system saves evaluated attempts so users can track genuine improvement over
            time, not just practise once and lose everything.
          </p>

          <a
            href="/info/pricing"
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Unlock Train Pro
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default function TrainClient({ isPremium, userId }: TrainClientProps) {
  const { getToken } = useAuth();
  const supabase = useMemo(() => createClient(getToken), [getToken]);

  const [activeTab, setActiveTab] = useState<TrainTab>("readiness");
  const [interviewTab, setInterviewTab] = useState<InterviewTab>("practice");
  const [selectedState, setSelectedState] = useState<StateKey>("NSW_ACT");
  const [selectedSubjects, setSelectedSubjects] = useState<AtarSubject[]>([
    { id: makeId(), name: "English" },
    { id: makeId(), name: "Mathematical Methods" },
    { id: makeId(), name: "Chemistry" },
    { id: makeId(), name: "Biology" },
    { id: makeId(), name: "Physics" },
  ]);

  const [ucatAttempts, setUcatAttempts] = useState<UcatAttempt[]>([]);
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [practiceHistory, setPracticeHistory] = useState<PracticeAttempt[]>([]);
  const [isLoadingPractice, setIsLoadingPractice] = useState(false);

  const [ucatForm, setUcatForm] = useState<UcatAttempt>({
    id: "",
    date: new Date().toISOString().slice(0, 10),
    label: "Mock",
    total: 2800,
    vr: 650,
    dm: 700,
    qr: 700,
    ar: 750,
    sjt: 600,
  });

  const [atarSelfReadiness, setAtarSelfReadiness] = useState(72);
  const [applicationReadiness, setApplicationReadiness] = useState(55);

  const [interviewMode, setInterviewMode] = useState<InterviewMode>("MMI");
  const [currentPrompt, setCurrentPrompt] = useState<InterviewPrompt | null>(null);
  const [currentPanelPrompt, setCurrentPanelPrompt] = useState<PanelPrompt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentResponses, setCurrentResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [latestFeedback, setLatestFeedback] = useState<PracticeAttempt | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isRunningTimer, setIsRunningTimer] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const [storyForm, setStoryForm] = useState({
    title: "",
    category: "Leadership",
    situation: "",
    action: "",
    result: "",
    tags: "",
  });

  const pulseVoiceIdMmi =
  process.env.NEXT_PUBLIC_PULSE_VOICE_ID_MMI || "JBFqnCBsd6RMkjVDRZzb";

  const pulseVoiceIdPanel =
  process.env.NEXT_PUBLIC_PULSE_VOICE_ID_PANEL || "JBFqnCBsd6RMkjVDRZzb";

  const [pulseMode, setPulseMode] = useState<"idle" | "speaking" | "listening" | "processing">("idle");
  const [voiceModeEnabled, setVoiceModeEnabled] = useState(true);
  const [autoPlayQuestion, setAutoPlayQuestion] = useState(true);
  
  const currentVoiceId =
  interviewMode === "MMI" ? pulseVoiceIdMmi : pulseVoiceIdPanel;
  
  const currentVoiceProfile = interviewMode === "MMI" ? "mmi" : "panel";
  
  const currentQuestionText =
  interviewMode === "MMI"
    ? currentPrompt?.questions[currentQuestionIndex] || ""
    : currentPanelPrompt?.prompt || "";
    
  const audioRef = useRef<HTMLAudioElement | null>(null);
const committedTranscriptRef = useRef("");

const scribe = useScribe({
  modelId: "scribe_v2_realtime",
  onPartialTranscript: (data) => {
    setPulseMode("listening");

    const partialText =
      typeof data === "string"
        ? data
        : typeof data?.text === "string"
          ? data.text
          : "";

    setCurrentResponse(
      [committedTranscriptRef.current, partialText].filter(Boolean).join(" ").trim()
    );
  },
  onCommittedTranscript: (data) => {
    const committedText =
      typeof data === "string"
        ? data
        : typeof data?.text === "string"
          ? data.text
          : "";

    committedTranscriptRef.current = [
      committedTranscriptRef.current,
      committedText,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    setCurrentResponse(committedTranscriptRef.current);
  },
});

async function speakCurrentQuestion() {
  if (!voiceModeEnabled || !currentQuestionText || !currentVoiceId) return;

  setPulseMode("speaking");

  try {
    const res = await fetch("/api/train/voice/question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: currentQuestionText,
        voiceId: currentVoiceId,
        profile: currentVoiceProfile,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to load question audio");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audioRef.current = audio;

    audio.onended = () => {
      setPulseMode("idle");
      URL.revokeObjectURL(url);
    };

    await audio.play();
  } catch (error) {
    console.error(error);
    setPulseMode("idle");
  }
}

async function startVoiceAnswer() {
  try {
    committedTranscriptRef.current = currentResponse.trim();
    setPulseMode("listening");

    const tokenRes = await fetch("/api/train/voice/scribe-token", {
      method: "GET",
    });

    if (!tokenRes.ok) {
      throw new Error("Failed to get scribe token");
    }

    const tokenPayload = (await tokenRes.json()) as { token: string };

    await scribe.connect({
      token: tokenPayload.token,
      microphone: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
  } catch (error) {
    console.error(error);
    setPulseMode("idle");
  }
}

function stopVoiceAnswer() {
  scribe.disconnect();
  setPulseMode("idle");
}

function clearVoiceTranscript() {
  committedTranscriptRef.current = "";
  setCurrentResponse("");
}

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ucatStorageKey);
      if (raw) {
        setUcatAttempts(JSON.parse(raw) as UcatAttempt[]);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(ucatStorageKey, JSON.stringify(ucatAttempts));
    } catch {}
  }, [ucatAttempts]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storyStorageKey);
      if (raw) {
        setStories(JSON.parse(raw) as StoryItem[]);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(storyStorageKey, JSON.stringify(stories));
    } catch {}
  }, [stories]);

  useEffect(() => {
    if (!isPremium || !userId) return;

    let cancelled = false;

    async function loadPracticeHistory() {
      setIsLoadingPractice(true);

      const { data, error } = await supabase
        .from("interview_attempts")
        .select(
          "id, created_at, mode, title, prompt, response, clarity, reasoning, empathy, structure, professionalism, overall, feedback, improvements"
        )
        .eq("clerk_user_id", userId)
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (!error && data) {
        setPracticeHistory((data as unknown as InterviewAttemptRow[]).map(mapDbAttempt));
      }

      setIsLoadingPractice(false);
    }

    loadPracticeHistory();

    return () => {
      cancelled = true;
    };
  }, [isPremium, supabase, userId]);

  useEffect(() => {
    if (!isRunningTimer) return;

    const id = window.setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(id);
  }, [isRunningTimer]);

  const latestUcat = ucatAttempts[0] ?? null;
  const averageUcat = Math.round(avg(ucatAttempts.map((x) => x.total)));

  const weakSubtest = useMemo(() => {
    if (!latestUcat) return "None yet";
    const pairs = [
      ["VR", latestUcat.vr],
      ["DM", latestUcat.dm],
      ["QR", latestUcat.qr],
      ["AR", latestUcat.ar],
    ] as const;

    return [...pairs].sort((a, b) => a[1] - b[1])[0][0];
  }, [latestUcat]);

  const interviewAverage = useMemo(() => {
    return avg(practiceHistory.map((x) => x.overall)) * 20;
  }, [practiceHistory]);

  const ucatReadiness = useMemo(() => {
    if (!latestUcat) return 35;
    return Math.max(25, Math.min(100, Math.round((latestUcat.total / 3600) * 100)));
  }, [latestUcat]);

  const storyBankScore = useMemo(() => {
    return Math.min(100, stories.length * 10 + 20);
  }, [stories]);

  const overallReadiness = useMemo(() => {
    const score =
      atarSelfReadiness * 0.25 +
      ucatReadiness * 0.3 +
      interviewAverage * 0.25 +
      applicationReadiness * 0.1 +
      storyBankScore * 0.1;

    return Math.round(score);
  }, [atarSelfReadiness, ucatReadiness, interviewAverage, applicationReadiness, storyBankScore]);

  const readinessFocus = useMemo(() => {
    const items = [
      { key: "ATAR", value: atarSelfReadiness },
      { key: "UCAT", value: ucatReadiness },
      { key: "Interview", value: interviewAverage },
      { key: "Application", value: applicationReadiness },
      { key: "Story Bank", value: storyBankScore },
    ];

    return [...items].sort((a, b) => a.value - b.value)[0];
  }, [atarSelfReadiness, ucatReadiness, interviewAverage, applicationReadiness, storyBankScore]);

  const progressAverages = useMemo(() => {
    return {
      clarity: avg(practiceHistory.map((x) => x.clarity)),
      reasoning: avg(practiceHistory.map((x) => x.reasoning)),
      empathy: avg(practiceHistory.map((x) => x.empathy)),
      structure: avg(practiceHistory.map((x) => x.structure)),
      professionalism: avg(practiceHistory.map((x) => x.professionalism)),
      overall: avg(practiceHistory.map((x) => x.overall)),
    };
  }, [practiceHistory]);

  const stateInfo = stateConfigs[selectedState];

  const responseWords = useMemo(() => wordCount(currentResponse), [currentResponse]);
  const responseCharacters = currentResponse.length;

  const sessionTheme = currentPrompt?.theme || currentPanelPrompt?.theme || "Practice";
  const sessionTitle = currentPrompt?.title || currentPanelPrompt?.title || "No session loaded";
  const currentQuestionCount = currentPrompt?.questions.length ?? 1;
  const sessionProgress =
    interviewMode === "MMI" && currentPrompt
      ? ((currentQuestionIndex + 1) / currentPrompt.questions.length) * 100
      : currentPanelPrompt
        ? 100
        : 0;

  const personalBest = useMemo(() => {
    if (!practiceHistory.length) return 0;
    return Math.max(...practiceHistory.map((item) => item.overall * 20));
  }, [practiceHistory]);

  const recentMomentum = useMemo(() => {
    if (practiceHistory.length < 2) return 0;
    const latest = practiceHistory[0].overall * 20;
    const previous = practiceHistory[1].overall * 20;
    return Math.round(latest - previous);
  }, [practiceHistory]);

  function addSubject() {
    setSelectedSubjects((prev) => [...prev, { id: makeId(), name: "English" }]);
  }

  function updateSubject(id: string, name: string) {
    setSelectedSubjects((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name } : item))
    );
  }

  function removeSubject(id: string) {
    setSelectedSubjects((prev) => prev.filter((item) => item.id !== id));
  }

  function addUcatResult() {
    const newAttempt: UcatAttempt = {
      ...ucatForm,
      id: makeId(),
    };

    setUcatAttempts((prev) => [newAttempt, ...prev]);
  }

  function removeUcatResult(id: string) {
    setUcatAttempts((prev) => prev.filter((item) => item.id !== id));
  }

  function resetCurrentDraft() {
    setCurrentResponse("");
    setCurrentResponses([]);
    setCurrentQuestionIndex(0);
  }

  function generateNewPrompt() {
    setLatestFeedback(null);
    setCurrentResponse("");
    setCurrentResponses([]);
    setCurrentQuestionIndex(0);
    setTimerSeconds(0);
    setIsRunningTimer(true);

    if (interviewMode === "MMI") {
      const random = mmiPrompts[Math.floor(Math.random() * mmiPrompts.length)];
      setCurrentPrompt(random);
      setCurrentPanelPrompt(null);
    } else {
      const random = panelQuestions[Math.floor(Math.random() * panelQuestions.length)];
      setCurrentPanelPrompt(random);
      setCurrentPrompt(null);
    }
  }

  async function evaluateWithBackend(fullText: string) {
    if (!(currentPrompt || currentPanelPrompt)) return;
    if (!isPremium || !userId) return;

    setIsEvaluating(true);

    try {
      const title =
        interviewMode === "MMI"
          ? currentPrompt?.title || "MMI Practice"
          : currentPanelPrompt?.title || "Panel Practice";

      const prompt =
        interviewMode === "MMI"
          ? `${currentPrompt?.scenario || ""}\n\n${currentPrompt?.questions.join("\n")}`
          : currentPanelPrompt?.prompt || "";

      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: interviewMode,
          title,
          prompt,
          response: fullText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Evaluation failed");
      }

      const insertPayload = {
        clerk_user_id: userId,
        mode: interviewMode,
        title,
        prompt,
        response: fullText,
        clarity: data.scores.clarity,
        reasoning: data.scores.reasoning,
        empathy: data.scores.empathy,
        structure: data.scores.structure,
        professionalism: data.scores.professionalism,
        overall: data.scores.overall,
        feedback: data.feedback,
        improvements: data.improvements || [],
      };

      const { data: inserted, error: insertError } = await supabase
        .from("interview_attempts")
        .insert(insertPayload)
        .select(
          "id, created_at, mode, title, prompt, response, clarity, reasoning, empathy, structure, professionalism, overall, feedback, improvements"
        )
        .single();

      if (insertError || !inserted) {
        throw new Error(insertError?.message || "Failed to save attempt");
      }

      const item = mapDbAttempt(inserted as unknown as InterviewAttemptRow);
      setPracticeHistory((prev) => [item, ...prev]);
      setLatestFeedback(item);
      setInterviewTab("progress");
    } catch (error) {
      console.error(error);
      alert("Failed to evaluate and save response.");
    } finally {
      setIsEvaluating(false);
    }
  }

  function saveCurrentQuestionResponseAndAdvance() {
    if (!currentPrompt) return;
    if (!currentResponse.trim()) return;

    const updated = [...currentResponses];
    updated[currentQuestionIndex] = currentResponse.trim();

    if (currentQuestionIndex < currentPrompt.questions.length - 1) {
      setCurrentResponses(updated);
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentResponse("");
    } else {
      const fullText = updated
        .map(
          (answer, index) =>
            `Q${index + 1}: ${currentPrompt.questions[index]}\nA${index + 1}: ${answer}`
        )
        .join("\n\n");

      setCurrentResponses(updated);
      setIsRunningTimer(false);
      evaluateWithBackend(fullText);
    }
  }

  function submitPanelAttempt() {
    if (!(currentPrompt || currentPanelPrompt)) return;
    if (!currentResponse.trim()) return;
    setIsRunningTimer(false);
    evaluateWithBackend(currentResponse.trim());
  }

  function saveStory() {
    if (!storyForm.title || !storyForm.situation || !storyForm.action || !storyForm.result) return;

    const item: StoryItem = {
      id: makeId(),
      ...storyForm,
    };

    setStories((prev) => [item, ...prev]);
    setStoryForm({
      title: "",
      category: "Leadership",
      situation: "",
      action: "",
      result: "",
      tags: "",
    });
  }

  async function deletePracticeAttempt(id: string) {
    const existing = practiceHistory.find((x) => x.id === id);
    setPracticeHistory((prev) => prev.filter((x) => x.id !== id));

    const { error } = await supabase
      .from("interview_attempts")
      .delete()
      .eq("id", id)
      .eq("clerk_user_id", userId);

    if (error && existing) {
      setPracticeHistory((prev) => [existing, ...prev]);
      alert("Failed to delete attempt.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-700 shadow-sm">
            <span className="text-emerald-500">Train</span>
            <span>•</span>
            <span>{isPremium ? "Pro unlocked" : "Pro feature"}</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <Sparkles className="h-4 w-4" />
            Build skills and track measurable progress
          </div>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-400 via-sky-500 to-violet-400" />
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-14 left-8 h-44 w-44 rounded-full bg-violet-100/50 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200">
                <Target className="h-7 w-7" />
              </div>

              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                  Train
                </h1>
                <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                  Build skills and track measurable progress with a cleaner, more dynamic preparation
                  suite for UCAT, ATAR strategy, and interview development.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <PracticeMetricTile
                label="Overall readiness"
                value={`${overallReadiness}`}
                sub={getReadinessBand(overallReadiness)}
                tone="emerald"
              />
              <PracticeMetricTile
                label="Interview average"
                value={`${Math.round(interviewAverage)}`}
                sub={`${practiceHistory.length} saved attempts`}
                tone="blue"
              />
              <PracticeMetricTile
                label="Personal best"
                value={`${Math.round(personalBest)}`}
                sub={
                  recentMomentum === 0
                    ? "No momentum yet"
                    : `${recentMomentum > 0 ? "+" : ""}${recentMomentum} vs previous`
                }
                tone="violet"
              />
            </div>
          </div>
        </section>

        {!isPremium ? (
          <div className="mt-6">
            <PremiumLockedTrainPreview />
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-3 md:grid-cols-4">
              <TopTab
                active={activeTab === "readiness"}
                icon={Target}
                title="Overall Readiness Score"
                text="Composite score across academics, UCAT, application confidence, and interview work."
                onClick={() => setActiveTab("readiness")}
              />
              <TopTab
                active={activeTab === "ucat"}
                icon={Brain}
                title="UCAT Performance Hub"
                text="Track mocks, compare totals, and find your weakest subtest quickly."
                onClick={() => setActiveTab("ucat")}
              />
              <TopTab
                active={activeTab === "atar"}
                icon={GraduationCap}
                title="ATAR Risk Management"
                text="See how state systems and subject choices might shape your academic risk."
                onClick={() => setActiveTab("atar")}
              />
              <TopTab
                active={activeTab === "interview"}
                icon={Users}
                title="Interview Practice System"
                text="Generate prompts, record responses, and review rubric-based feedback."
                onClick={() => setActiveTab("interview")}
              />
            </div>

            <div className="mt-6 space-y-6">
              {activeTab === "readiness" && (
                <>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                      label="Overall readiness"
                      value={`${overallReadiness}`}
                      hint={getReadinessBand(overallReadiness)}
                      icon={Target}
                    />
                    <StatCard
                      label="Average UCAT"
                      value={averageUcat ? `${averageUcat}` : "—"}
                      hint={latestUcat ? `Latest: ${latestUcat.total}` : "No mocks logged yet"}
                      icon={Brain}
                    />
                    <StatCard
                      label="Interview average"
                      value={`${Math.round(interviewAverage)}`}
                      hint={`${practiceHistory.length} saved attempts`}
                      icon={Users}
                    />
                    <StatCard
                      label="Story bank"
                      value={`${stories.length}`}
                      hint="Examples ready for interviews"
                      icon={Wand2}
                    />
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <Card className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                            Composite readiness
                          </p>
                          <h2 className="mt-2 text-2xl font-bold text-slate-950">
                            {getReadinessBand(overallReadiness)}
                          </h2>
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                            This blends your self-rated academic readiness, UCAT performance,
                            interview history, application confidence, and story-bank depth.
                          </p>
                        </div>

                        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right">
                          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                            Current score
                          </p>
                          <p className="mt-1 text-3xl font-bold text-emerald-700">
                            {overallReadiness}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-5">
                        <ProgressBar label="ATAR readiness" value={atarSelfReadiness} tone="blue" />
                        <ProgressBar label="UCAT readiness" value={ucatReadiness} tone="violet" />
                        <ProgressBar
                          label="Interview readiness"
                          value={interviewAverage}
                          tone="emerald"
                        />
                        <ProgressBar
                          label="Application readiness"
                          value={applicationReadiness}
                          tone="amber"
                        />
                        <ProgressBar label="Story bank strength" value={storyBankScore} />
                      </div>
                    </Card>

                    <div className="space-y-6">
                      <Card className="p-6">
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                          Priority focus
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-slate-950">
                          Improve your {readinessFocus.key}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          This is currently your lowest-scoring pillar, so improving it will lift
                          your overall readiness fastest.
                        </p>
                        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                          <p className="text-sm font-medium text-slate-700">
                            Current score:{" "}
                            <span className="font-bold text-slate-950">
                              {Math.round(readinessFocus.value)}/100
                            </span>
                          </p>
                        </div>
                      </Card>

                      <Card className="p-6">
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                          Adjust confidence inputs
                        </p>

                        <div className="mt-5 space-y-5">
                          <div>
                            <div className="mb-2 flex items-center justify-between">
                              <label className="text-sm font-medium text-slate-700">
                                ATAR self-readiness
                              </label>
                              <span className="text-sm font-semibold text-slate-900">
                                {atarSelfReadiness}/100
                              </span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={atarSelfReadiness}
                              onChange={(e) => setAtarSelfReadiness(Number(e.target.value))}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <div className="mb-2 flex items-center justify-between">
                              <label className="text-sm font-medium text-slate-700">
                                Application readiness
                              </label>
                              <span className="text-sm font-semibold text-slate-900">
                                {applicationReadiness}/100
                              </span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={applicationReadiness}
                              onChange={(e) => setApplicationReadiness(Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "ucat" && (
                <>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                      label="Latest total"
                      value={latestUcat ? `${latestUcat.total}` : "—"}
                      hint={latestUcat ? formatDate(latestUcat.date) : "No attempt added yet"}
                      icon={Brain}
                    />
                    <StatCard
                      label="Average total"
                      value={averageUcat ? `${averageUcat}` : "—"}
                      hint={`${ucatAttempts.length} recorded attempts`}
                      icon={LineChart}
                    />
                    <StatCard
                      label="Weakest subtest"
                      value={weakSubtest}
                      hint="Based on your latest logged mock"
                      icon={CircleAlert}
                    />
                    <StatCard
                      label="Readiness score"
                      value={`${ucatReadiness}`}
                      hint="Converted from your latest total"
                      icon={Target}
                    />
                  </div>
                  <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <Card className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                            Add new result
                          </p>
                          <h3 className="mt-2 text-xl font-bold text-slate-950">
                            Log a UCAT mock
                          </h3>
                        </div>

                        <div className="rounded-2xl bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700">
                          Track trends, not one-off highs
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Date
                          </label>
                          <input
                            type="date"
                            value={ucatForm.date}
                            onChange={(e) =>
                              setUcatForm((prev) => ({ ...prev, date: e.target.value }))
                            }
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Label
                          </label>
                          <input
                            type="text"
                            value={ucatForm.label}
                            onChange={(e) =>
                              setUcatForm((prev) => ({ ...prev, label: e.target.value }))
                            }
                            placeholder="Mock, official, timed practice"
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                          />
                        </div>

                        {[
                          ["Total", "total"],
                          ["VR", "vr"],
                          ["DM", "dm"],
                          ["QR", "qr"],
                          ["AR", "ar"],
                          ["SJT", "sjt"],
                        ].map(([label, key]) => (
                          <div key={key}>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              {label}
                            </label>
                            <input
                              type="number"
                              value={ucatForm[key as keyof UcatAttempt] as number}
                              onChange={(e) =>
                                setUcatForm((prev) => ({
                                  ...prev,
                                  [key]: Number(e.target.value),
                                }))
                              }
                              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                            />
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={addUcatResult}
                        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                      >
                        <Plus className="h-4 w-4" />
                        Save result
                      </button>
                    </Card>

                    <Card className="p-6">
                      <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                        Result history
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-slate-950">
                        Your recorded mocks
                      </h3>

                      <div className="mt-5 space-y-3">
                        {ucatAttempts.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-600">
                            No UCAT attempts yet. Add your first mock to start tracking progress.
                          </div>
                        ) : (
                          ucatAttempts.map((attempt) => (
                            <div
                              key={attempt.id}
                              className="rounded-2xl border border-slate-200 p-4"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {attempt.label || "UCAT Attempt"}
                                  </p>
                                  <p className="mt-1 text-sm text-slate-500">
                                    {formatDate(attempt.date)}
                                  </p>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="rounded-2xl bg-violet-50 px-3 py-2 text-sm font-bold text-violet-700">
                                    {attempt.total}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeUcatResult(attempt.id)}
                                    className="rounded-2xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs sm:text-sm">
                                {[
                                  ["VR", attempt.vr],
                                  ["DM", attempt.dm],
                                  ["QR", attempt.qr],
                                  ["AR", attempt.ar],
                                  ["SJT", attempt.sjt],
                                ].map(([name, value]) => (
                                  <div key={name} className="rounded-2xl bg-slate-50 p-3">
                                    <p className="font-medium text-slate-500">{name}</p>
                                    <p className="mt-1 font-bold text-slate-900">{value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </Card>
                  </div>
                </>
              )}

              {activeTab === "atar" && (
                <>
                  <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <Card className="p-6">
                      <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                        State system
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-slate-950">
                        ATAR risk management
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Different states structure scaling and aggregation differently. This is a
                        strategy view, not a predictor.
                      </p>

                      <div className="mt-5 grid gap-2 sm:grid-cols-2">
                        {(Object.keys(stateConfigs) as StateKey[]).map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setSelectedState(key)}
                            className={cn(
                              "rounded-2xl border px-4 py-3 text-left transition",
                              selectedState === key
                                ? "border-emerald-300 bg-emerald-50"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                            )}
                          >
                            <p className="font-semibold text-slate-900">{stateConfigs[key].label}</p>
                            <p className="mt-1 text-sm text-slate-500">{stateConfigs[key].short}</p>
                          </button>
                        ))}
                      </div>

                      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <p className="text-sm font-semibold text-slate-900">{stateInfo.label}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{stateInfo.summary}</p>

                        <ul className="mt-4 space-y-2">
                          {stateInfo.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-2 text-sm text-slate-700">
                              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-5 space-y-2">
                          {stateInfo.links.map((link) => (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                              <span>{link.label}</span>
                              <ArrowRight className="h-4 w-4" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                            Subject mix
                          </p>
                          <h3 className="mt-2 text-xl font-bold text-slate-950">
                            Evaluate your subject profile
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={addSubject}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Plus className="h-4 w-4" />
                          Add subject
                        </button>
                      </div>

                      <div className="mt-5 space-y-4">
                        {selectedSubjects.map((subject) => {
                          const impact = getSubjectImpact(selectedState, subject.name);

                          return (
                            <div key={subject.id} className="rounded-3xl border border-slate-200 p-4">
                              <div className="flex flex-wrap items-start gap-3">
                                <div className="min-w-0 flex-1">
                                  <select
                                    value={subject.name}
                                    onChange={(e) => updateSubject(subject.id, e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                                  >
                                    {subjectOptions.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {selectedSubjects.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeSubject(subject.id)}
                                    className="rounded-2xl border border-slate-200 p-3 text-slate-500 hover:bg-slate-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>

                              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                                <div className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                                  {impact.tag}
                                </div>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{impact.text}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </div>
                </>
              )}

              {activeTab === "interview" && (
                <>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setInterviewTab("practice")}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-semibold transition",
                        interviewTab === "practice"
                          ? "bg-slate-900 text-white"
                          : "border border-slate-200 bg-white text-slate-700"
                      )}
                    >
                      Practice
                    </button>
                    <button
                      type="button"
                      onClick={() => setInterviewTab("stories")}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-semibold transition",
                        interviewTab === "stories"
                          ? "bg-slate-900 text-white"
                          : "border border-slate-200 bg-white text-slate-700"
                      )}
                    >
                      Story bank
                    </button>
                    <button
                      type="button"
                      onClick={() => setInterviewTab("progress")}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-semibold transition",
                        interviewTab === "progress"
                          ? "bg-slate-900 text-white"
                          : "border border-slate-200 bg-white text-slate-700"
                      )}
                    >
                      Progress
                    </button>
                  </div>

                  {interviewTab === "practice" && (
                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <PracticeMetricTile
                          label="Mode"
                          value={interviewMode}
                          sub="Choose MMI or Panel"
                          tone="emerald"
                        />
                        <PracticeMetricTile
                          label="Session timer"
                          value={formatTime(timerSeconds)}
                          sub={isRunningTimer ? "Timer running" : "Timer paused"}
                          tone={isRunningTimer ? "blue" : "slate"}
                        />
                        <PracticeMetricTile
                          label="Response words"
                          value={`${responseWords}`}
                          sub={responseEnergyLabel(responseWords)}
                          tone={responseWords >= 160 ? "violet" : "amber"}
                        />
                        <PracticeMetricTile
                          label="Characters"
                          value={`${responseCharacters}`}
                          sub="Live response length"
                          tone="slate"
                        />
                      </div>

                      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                        <StudioPanel className="overflow-hidden">
                          <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                                  Practice setup
                                </p>
                                <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                                  Interview studio
                                </h3>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                                  Start a timed station, draft your answer, then save a scored attempt so
                                  you can actually track progress over time.
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <SoftBadge tone="emerald">{sessionTheme}</SoftBadge>
                                <SoftBadge tone="blue">
                                  {interviewMode === "MMI"
                                    ? "Multi-question flow"
                                    : "Single-answer flow"}
                                </SoftBadge>
                                {(currentPrompt || currentPanelPrompt) ? (
                                  <SoftBadge tone="violet">Pulse ready</SoftBadge>
                                ) : null}
                              </div>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                              <InterviewModeButton
                                active={interviewMode === "MMI"}
                                label="MMI mode"
                                description="Work through one scenario with multiple follow-up questions."
                                onClick={() => setInterviewMode("MMI")}
                              />
                              <InterviewModeButton
                                active={interviewMode === "Panel"}
                                label="Panel mode"
                                description="Practise a single classic interview question with depth."
                                onClick={() => setInterviewMode("Panel")}
                              />
                            </div>

                            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                              <button
                                type="button"
                                onClick={generateNewPrompt}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                              >
                                <Wand2 className="h-4 w-4" />
                                Generate new prompt
                              </button>

                              <button
                                type="button"
                                onClick={() => setIsRunningTimer((prev) => !prev)}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                              >
                                <Clock3 className="h-4 w-4" />
                                {isRunningTimer ? "Pause timer" : "Resume timer"}
                              </button>
                            </div>

                            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    Session progress
                                  </p>
                                  <p className="mt-2 text-xl font-black tracking-tight text-slate-950">
                                    {sessionTitle}
                                  </p>
                                </div>

                                <div className="text-right">
                                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    Timer
                                  </p>
                                  <p className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                                    {formatTime(timerSeconds)}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-5">
                                <div className="mb-2 flex items-center justify-between text-sm">
                                  <span className="font-medium text-slate-700">
                                    {interviewMode === "MMI"
                                      ? `Question ${currentQuestionIndex + 1} of ${currentQuestionCount}`
                                      : "Single response session"}
                                  </span>
                                  <span className="font-semibold text-slate-900">
                                    {Math.round(sessionProgress)}%
                                  </span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-200">
                                  <div
                                    className="h-2 rounded-full bg-linear-to-r from-emerald-500 via-sky-500 to-violet-500 transition-all"
                                    style={{
                                      width: `${Math.max(0, Math.min(100, sessionProgress))}%`,
                                    }}
                                  />
                                </div>
                              </div>

                              {interviewMode === "MMI" && currentPrompt && (
                                <div className="mt-5 rounded-3xl border border-emerald-200 bg-white p-5">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <SoftBadge tone="emerald">{currentPrompt.theme}</SoftBadge>
                                    <SoftBadge tone="slate">MMI station</SoftBadge>
                                  </div>

                                  <h4 className="mt-3 text-xl font-black tracking-tight text-slate-950">
                                    {currentPrompt.title}
                                  </h4>

                                  <p className="mt-3 text-sm leading-7 text-slate-700">
                                    {currentPrompt.scenario}
                                  </p>

                                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                      Current question
                                    </p>
                                    <p className="mt-2 text-base font-semibold leading-7 text-slate-900">
                                      {currentPrompt.questions[currentQuestionIndex]}
                                    </p>
                                  </div>

                                  {currentResponses.length > 0 && (
                                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                        Saved in this station
                                      </p>
                                      <div className="mt-3 flex flex-wrap gap-2">
                                        {currentResponses.map((_, index) => (
                                          <SoftBadge key={index} tone="blue">
                                            Q{index + 1} saved
                                          </SoftBadge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {interviewMode === "Panel" && currentPanelPrompt && (
                                <div className="mt-5 rounded-3xl border border-blue-200 bg-white p-5">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <SoftBadge tone="blue">{currentPanelPrompt.theme}</SoftBadge>
                                    <SoftBadge tone="slate">Panel question</SoftBadge>
                                  </div>

                                  <h4 className="mt-3 text-xl font-black tracking-tight text-slate-950">
                                    {currentPanelPrompt.title}
                                  </h4>

                                  <p className="mt-3 text-sm leading-7 text-slate-700">
                                    {currentPanelPrompt.prompt}
                                  </p>
                                </div>
                              )}

                              {(currentPrompt || currentPanelPrompt) && (
                                <div className="mt-5">
                                  <TrainVoicePanel
                                    question={
                                      interviewMode === "MMI"
                                        ? currentPrompt?.questions[currentQuestionIndex] || ""
                                        : currentPanelPrompt?.prompt || ""
                                    }
                                    selectedVoiceId={
                                      interviewMode === "MMI" ? pulseVoiceIdMmi : pulseVoiceIdPanel
                                    }
                                    profile={interviewMode === "MMI" ? "mmi" : "panel"}
                                    onTranscriptFinalized={handleVoiceTranscriptFinalized}
                                  />
                                </div>
                              )}

                              {!currentPrompt && !currentPanelPrompt && (
                                <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center">
                                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                                    <Sparkles className="h-5 w-5" />
                                  </div>
                                  <p className="mt-4 text-lg font-semibold text-slate-900">
                                    No station loaded yet
                                  </p>
                                  <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Generate a new prompt to start a proper interview practice session.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </StudioPanel>

                        <StudioPanel className="overflow-hidden">
                          <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                                  Response workspace
                                </p>
                                <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                                  Build your answer live
                                </h3>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                                  Write or dictate your answer, then save the station and turn it into a scored attempt.
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <SoftBadge tone={responseWords >= 160 ? "emerald" : "amber"}>
                                  {responseEnergyLabel(responseWords)}
                                </SoftBadge>
                                <SoftBadge tone={isEvaluating ? "violet" : "slate"}>
                                  {isEvaluating ? "Evaluating" : "Ready"}
                                </SoftBadge>
                              </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                              <PracticeMetricTile
                                label="Word count"
                                value={`${responseWords}`}
                                sub="Live depth indicator"
                                tone={responseWords >= 160 ? "emerald" : "amber"}
                              />
                              <PracticeMetricTile
                                label="Characters"
                                value={`${responseCharacters}`}
                                sub="Current answer size"
                                tone="blue"
                              />
                              <PracticeMetricTile
                                label="Voice mode"
                                value="Pulse"
                                sub="Use the voice panel on the left"
                                tone="violet"
                              />
                            </div>

                            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-3">
                              <textarea
                                value={currentResponse}
                                onChange={(e) => setCurrentResponse(e.target.value)}
                                placeholder="Write or dictate your response here..."
                                className="min-h-80 w-full rounded-[22px] border border-slate-200 bg-white px-4 py-4 text-sm leading-7 outline-none focus:border-slate-400"
                              />
                            </div>

                            <div className="flex flex-wrap gap-3">
                              {interviewMode === "MMI" ? (
                                <button
                                  type="button"
                                  disabled={!currentPrompt || isEvaluating}
                                  onClick={saveCurrentQuestionResponseAndAdvance}
                                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                                >
                                  {isEvaluating
                                    ? "Evaluating..."
                                    : currentPrompt &&
                                        currentQuestionIndex === currentPrompt.questions.length - 1
                                      ? "Finish and evaluate"
                                      : "Save and next"}
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled={!currentPanelPrompt || isEvaluating}
                                  onClick={submitPanelAttempt}
                                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                                >
                                  {isEvaluating ? "Evaluating..." : "Submit and evaluate"}
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={resetCurrentDraft}
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                              >
                                Reset draft
                              </button>
                            </div>

                            {latestFeedback && (
                              <div className="rounded-[28px] border border-emerald-200 bg-emerald-50/70 p-5">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                  <div>
                                    <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                                      Latest feedback
                                    </p>
                                    <h4 className="mt-2 text-xl font-black tracking-tight text-slate-950">
                                      {latestFeedback.title}
                                    </h4>
                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">
                                      {latestFeedback.feedback}
                                    </p>
                                  </div>

                                  <div className="rounded-3xl border border-emerald-200 bg-white px-4 py-3 text-right">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                                      Overall
                                    </p>
                                    <p className="mt-1 text-3xl font-black tracking-tight text-emerald-700">
                                      {Math.round(latestFeedback.overall * 20)}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                                  <ScoreChip label="Clarity" value={latestFeedback.clarity} />
                                  <ScoreChip label="Reasoning" value={latestFeedback.reasoning} />
                                  <ScoreChip label="Empathy" value={latestFeedback.empathy} />
                                  <ScoreChip label="Structure" value={latestFeedback.structure} />
                                  <ScoreChip
                                    label="Professionalism"
                                    value={latestFeedback.professionalism}
                                  />
                                  <ScoreChip label="Overall" value={latestFeedback.overall} />
                                </div>

                                {latestFeedback.improvements.length > 0 && (
                                  <div className="mt-5 rounded-2xl border border-white/70 bg-white/80 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                      Next improvements
                                    </p>
                                    <ul className="mt-3 space-y-2">
                                      {latestFeedback.improvements.map((item) => (
                                        <li key={item} className="flex gap-2 text-sm text-slate-700">
                                          <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                                          <span>{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </StudioPanel>
                      </div>
                    </div>
                  )}

                  {interviewTab === "stories" && (
                    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                      <Card className="p-6">
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                          Story bank builder
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-slate-950">
                          Save your best examples
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Build a library of leadership, teamwork, resilience, empathy, and ethics examples you can adapt in interviews.
                        </p>

                        <div className="mt-5 space-y-4">
                          <input
                            type="text"
                            value={storyForm.title}
                            onChange={(e) =>
                              setStoryForm((prev) => ({ ...prev, title: e.target.value }))
                            }
                            placeholder="Story title"
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                          />

                          <input
                            type="text"
                            value={storyForm.category}
                            onChange={(e) =>
                              setStoryForm((prev) => ({ ...prev, category: e.target.value }))
                            }
                            placeholder="Category"
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                          />

                          <textarea
                            value={storyForm.situation}
                            onChange={(e) =>
                              setStoryForm((prev) => ({ ...prev, situation: e.target.value }))
                            }
                            placeholder="Situation"
                            className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                          />

                          <textarea
                            value={storyForm.action}
                            onChange={(e) =>
                              setStoryForm((prev) => ({ ...prev, action: e.target.value }))
                            }
                            placeholder="Action"
                            className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                          />

                          <textarea
                            value={storyForm.result}
                            onChange={(e) =>
                              setStoryForm((prev) => ({ ...prev, result: e.target.value }))
                            }
                            placeholder="Result"
                            className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                          />

                          <input
                            type="text"
                            value={storyForm.tags}
                            onChange={(e) =>
                              setStoryForm((prev) => ({ ...prev, tags: e.target.value }))
                            }
                            placeholder="Tags, comma separated"
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                          />

                          <button
                            type="button"
                            onClick={saveStory}
                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                          >
                            <Plus className="h-4 w-4" />
                            Save story
                          </button>
                        </div>
                      </Card>

                      <Card className="p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                              Saved examples
                            </p>
                            <h3 className="mt-2 text-xl font-bold text-slate-950">
                              Your story bank
                            </h3>
                          </div>

                          <SoftBadge tone="violet">{stories.length} saved</SoftBadge>
                        </div>

                        <div className="mt-5 space-y-4">
                          {stories.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-600">
                              No stories saved yet. Start building examples for teamwork,
                              leadership, empathy, conflict, and resilience.
                            </div>
                          ) : (
                            stories.map((story) => (
                              <div key={story.id} className="rounded-3xl border border-slate-200 p-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <p className="text-lg font-bold text-slate-950">{story.title}</p>
                                    <p className="mt-1 text-sm text-slate-500">{story.category}</p>
                                  </div>
                                  {story.tags && (
                                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                      {story.tags}
                                    </div>
                                  )}
                                </div>

                                <div className="mt-4 grid gap-3 md:grid-cols-3">
                                  <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                      Situation
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-700">
                                      {story.situation}
                                    </p>
                                  </div>
                                  <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                      Action
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-700">
                                      {story.action}
                                    </p>
                                  </div>
                                  <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                      Result
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-700">
                                      {story.result}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </Card>
                    </div>
                  )}

                  {interviewTab === "progress" && (
                    <>
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                          label="Saved attempts"
                          value={`${practiceHistory.length}`}
                          hint={isLoadingPractice ? "Loading history..." : "Across all interview modes"}
                          icon={Users}
                        />
                        <StatCard
                          label="Clarity"
                          value={`${Math.round(progressAverages.clarity * 20)}`}
                          hint="Average rubric score"
                          icon={Target}
                        />
                        <StatCard
                          label="Reasoning"
                          value={`${Math.round(progressAverages.reasoning * 20)}`}
                          hint="Average rubric score"
                          icon={Brain}
                        />
                        <StatCard
                          label="Overall"
                          value={`${Math.round(progressAverages.overall * 20)}`}
                          hint="Average across saved attempts"
                          icon={Trophy}
                        />
                      </div>

                      <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
                        <Card className="p-6">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                                Rubric trends
                              </p>
                              <h3 className="mt-2 text-xl font-bold text-slate-950">
                                Performance averages
                              </h3>
                            </div>
                            <SoftBadge tone="emerald">
                              Best {Math.round(personalBest)}/100
                            </SoftBadge>
                          </div>

                          <div className="mt-6 space-y-5">
                            <ProgressBar label="Clarity" value={progressAverages.clarity * 20} />
                            <ProgressBar
                              label="Reasoning"
                              value={progressAverages.reasoning * 20}
                              tone="blue"
                            />
                            <ProgressBar
                              label="Empathy"
                              value={progressAverages.empathy * 20}
                              tone="violet"
                            />
                            <ProgressBar
                              label="Structure"
                              value={progressAverages.structure * 20}
                              tone="amber"
                            />
                            <ProgressBar
                              label="Professionalism"
                              value={progressAverages.professionalism * 20}
                              tone="emerald"
                            />
                            <ProgressBar
                              label="Overall"
                              value={progressAverages.overall * 20}
                              tone="blue"
                            />
                          </div>

                          <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                Personal best
                              </p>
                              <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                                {Math.round(personalBest)}/100
                              </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                Recent momentum
                              </p>
                              <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                                {recentMomentum > 0 ? "+" : ""}
                                {recentMomentum}
                              </p>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-6">
                          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                            Attempt history
                          </p>
                          <h3 className="mt-2 text-xl font-bold text-slate-950">
                            Saved evaluations
                          </h3>

                          <div className="mt-5 space-y-4">
                            {isLoadingPractice ? (
                              <div className="rounded-2xl border border-slate-200 p-5 text-sm text-slate-600">
                                Loading practice history...
                              </div>
                            ) : practiceHistory.length === 0 ? (
                              <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-600">
                                No saved interview attempts yet. Complete a practice submission to
                                build your progress history.
                              </div>
                            ) : (
                              practiceHistory.map((attempt) => (
                                <div key={attempt.id} className="rounded-3xl border border-slate-200 p-5">
                                  <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-sm font-semibold text-slate-900">
                                          {attempt.title}
                                        </p>
                                        <SoftBadge tone={attempt.mode === "MMI" ? "emerald" : "blue"}>
                                          {attempt.mode}
                                        </SoftBadge>
                                      </div>
                                      <p className="mt-1 text-sm text-slate-500">
                                        {formatDate(attempt.createdAt)}
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                                        {Math.round(attempt.overall * 20)}/100
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => deletePracticeAttempt(attempt.id)}
                                        className="rounded-2xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>

                                  <p className="mt-4 text-sm leading-7 text-slate-700">
                                    {attempt.feedback}
                                  </p>

                                  {attempt.improvements.length > 0 && (
                                    <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Improvement points
                                      </p>
                                      <ul className="mt-3 space-y-2">
                                        {attempt.improvements.map((item) => (
                                          <li key={item} className="flex gap-2 text-sm text-slate-700">
                                            <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                                            <span>{item}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
                                    {[
                                      ["Clarity", attempt.clarity],
                                      ["Reasoning", attempt.reasoning],
                                      ["Empathy", attempt.empathy],
                                      ["Structure", attempt.structure],
                                      ["Professionalism", attempt.professionalism],
                                      ["Overall", attempt.overall],
                                    ].map(([label, value]) => (
                                      <div key={label} className="rounded-2xl bg-slate-50 p-3 text-center">
                                        <p className="text-xs font-medium text-slate-500">{label}</p>
                                        <p className="mt-1 text-sm font-bold text-slate-900">
                                          {Math.round(Number(value) * 20)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>

                                  <details className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                                    <summary className="cursor-pointer text-sm font-semibold text-slate-800">
                                      View saved response
                                    </summary>
                                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                                      {attempt.response}
                                    </p>
                                  </details>
                                </div>
                              ))
                            )}
                          </div>
                        </Card>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}