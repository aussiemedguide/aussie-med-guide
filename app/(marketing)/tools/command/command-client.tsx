"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { SignOutButton, useSession } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Crown,
  Edit3,
  Flame,
  Gift,
  GraduationCap,
  HeartPulse,
  House,
  Lock,
  MapPinned,
  Plus,
  Save,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Target,
  Trophy,
  TrendingUp,
  UserRound,
  Wallet,
  Wrench,
  X,
  Orbit,
  Stars,
  Activity,
  Flag,
  BadgeCheck,
} from "lucide-react";

type EventType =
  | "ucat"
  | "applications"
  | "rural"
  | "interviews"
  | "offers"
  | "personal";

type DashboardEvent = {
  id: string;
  title: string;
  date: string;
  type: EventType;
  notes?: string;
  source: "system" | "custom";
};

type Profile = {
  name: string;
  email: string;
  yearLevel: string;
  state: string;
  category: string;
  pathway: string;
  atar: number;
  ucat: number;
  interviewScore: number;
  targetUnis: string[];
  avatar: string;
};

type SiteSettings = {
  commandLastUpdatedAt: string | null;
  scheduledDowntimeStartAt: string | null;
  scheduledDowntimeEndAt: string | null;
  maintenanceMode: boolean;
  maintenanceMessage: string;
};

type SubscriptionInfo = {
  planKey: "free" | "pro_monthly" | "pro_annual";
  status:
    | "free"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "incomplete"
    | "incomplete_expired";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

type MomentumState = "cold" | "warming_up" | "active" | "locked_in" | "elite";

type CommandProgress = {
  clerk_user_id: string;
  vitals_total: number;
  vitals_today: number;
  momentum_state: MomentumState;
  active_days_this_week: number;
  boss_level_unlocked: number;
  last_activity_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type VitalsEvent = {
  id: number;
  source: string;
  delta: number;
  reason: string;
  metadata: Record<string, unknown>;
  occurred_at: string;
  created_at: string;
};

type CommandClientProps = {
  userId: string;
  userEmail: string;
  subscription: SubscriptionInfo;
  initialProfile: Profile;
  initialCustomDates: DashboardEvent[];
  siteSettings: SiteSettings;
  initialCommandProgress: CommandProgress | null;
  initialVitalsEvents: VitalsEvent[];
};

type InterviewBoss = {
  level: number;
  name: string;
  title: string;
  twist: string;
  unlockText: string;
  vitalsReward: number;
};

type DailyMission = {
  id: string;
  label: string;
  completed: boolean;
  reward: number;
};

const ALL_UNIS = [
  "Adelaide",
  "ANU",
  "Bond",
  "CDU",
  "CSU/WSU",
  "Curtin",
  "Deakin",
  "Flinders",
  "Griffith",
  "JCU",
  "Macquarie",
  "Melbourne",
  "Monash",
  "Newcastle/UNE",
  "Notre Dame",
  "Sydney",
  "Tasmania",
  "UQ",
  "UNSW",
  "UniSQ",
  "UWA",
  "Wollongong",
  "WSU",
];

const BASE_EVENTS: DashboardEvent[] = [
  {
    id: "1",
    title: "UCAT Registration Opens",
    date: "2026-02-16",
    type: "ucat",
    source: "system",
  },
  {
    id: "2",
    title: "UCAT Booking Opens",
    date: "2026-03-03",
    type: "ucat",
    source: "system",
  },
  {
    id: "3",
    title: "UCAT Concession Deadline",
    date: "2026-05-11",
    type: "ucat",
    source: "system",
  },
  {
    id: "4",
    title: "UCAT Booking Deadline",
    date: "2026-05-15",
    type: "ucat",
    source: "system",
  },
  {
    id: "5",
    title: "UCAT Testing Period Begins",
    date: "2026-07-01",
    type: "ucat",
    source: "system",
  },
  {
    id: "6",
    title: "VTAC Applications Open",
    date: "2026-08-01",
    type: "applications",
    source: "system",
  },
  {
    id: "7",
    title: "UAC Applications Open",
    date: "2026-08-01",
    type: "applications",
    source: "system",
  },
  {
    id: "8",
    title: "Rural Forms Due",
    date: "2026-08-30",
    type: "rural",
    source: "system",
  },
  {
    id: "9",
    title: "UCAT Results Released",
    date: "2026-09-01",
    type: "ucat",
    source: "system",
  },
  {
    id: "10",
    title: "VTAC Preference Deadline",
    date: "2026-09-30",
    type: "applications",
    source: "system",
  },
  {
    id: "11",
    title: "UAC Preference Deadline",
    date: "2026-09-30",
    type: "applications",
    source: "system",
  },
  {
    id: "12",
    title: "Interview Invitations Start",
    date: "2026-10-15",
    type: "interviews",
    source: "system",
  },
  {
    id: "13",
    title: "Interview Season Begins",
    date: "2026-11-01",
    type: "interviews",
    source: "system",
  },
  {
    id: "14",
    title: "Main Offer Rounds Begin",
    date: "2027-01-15",
    type: "offers",
    source: "system",
  },
];

const EVENT_STYLES: Record<EventType, string> = {
  ucat: "border-violet-200 bg-violet-50 text-violet-900",
  applications: "border-blue-200 bg-blue-50 text-blue-900",
  rural: "border-emerald-200 bg-emerald-50 text-emerald-900",
  interviews: "border-amber-200 bg-amber-50 text-amber-900",
  offers: "border-teal-200 bg-teal-50 text-teal-900",
  personal: "border-slate-300 bg-slate-50 text-slate-900",
};

const AVATARS = [
  { id: "stethoscope", label: "Stethoscope", icon: Stethoscope },
  { id: "spark", label: "Spark", icon: Sparkles },
  { id: "target", label: "Target", icon: Target },
  { id: "heart", label: "Heart", icon: HeartPulse },
  { id: "grad", label: "Graduate", icon: GraduationCap },
  { id: "user", label: "Classic", icon: UserRound },
];

const MOTTOS = [
  "Consistency beats intensity when the goal is medicine.",
  "You do not need a perfect week. You need another solid day.",
  "Pressure feels smaller when your process is stronger.",
  "Confidence is usually built after the work, not before it.",
  "The students who stay calm usually stay in control.",
  "A good system will carry you when motivation disappears.",
  "Medicine is not won in one day. It is built in hundreds of them.",
  "Clarity first. Then effort. Then repetition.",
  "Momentum grows when your habits stop depending on mood.",
  "A strong applicant is usually just a consistent one.",
];

const INTERVIEW_BOSSES: InterviewBoss[] = [
  {
    level: 1,
    name: "Dr Maya Chen",
    title: "Warm-Up Clinician",
    twist: "Supportive foundational station focused on clarity and empathy.",
    unlockText: "Available immediately.",
    vitalsReward: 75,
  },
  {
    level: 2,
    name: "Dr Leo Hart",
    title: "Time Pressure Registrar",
    twist: "Shorter response windows and brisk follow-ups.",
    unlockText: "Unlock after 3 interview sessions.",
    vitalsReward: 100,
  },
  {
    level: 3,
    name: "Prof Anika Shah",
    title: "Ethics Examiner",
    twist: "Ambiguous ethical scenarios with no perfect answer.",
    unlockText: "Unlock at 300 total Vitals or 6 interview sessions.",
    vitalsReward: 125,
  },
  {
    level: 4,
    name: "Admissions Panel",
    title: "Panel Gauntlet",
    twist: "Multiple perspectives, follow-ups, and pressure shifts.",
    unlockText:
      "Unlock after beating Level 3 twice or reaching Locked In momentum.",
    vitalsReward: 140,
  },
  {
    level: 5,
    name: "The Dean’s Circuit",
    title: "Final Circuit",
    twist:
      "Rapid-fire mix of ethics, motivation, rural, and personal stations.",
    unlockText: "Unlock at 1000 Vitals and strong momentum.",
    vitalsReward: 150,
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function daysUntil(date: string) {
  const now = new Date();
  const target = new Date(date);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getMottoDayNumber() {
  const start = new Date("2026-01-01");
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
}

function getDailyMotto(name?: string) {
  const dayNumber = getMottoDayNumber();
  const motto = MOTTOS[(dayNumber - 1) % MOTTOS.length];

  return {
    dayNumber,
    text: name ? `${motto} ${name}, keep going.` : motto,
  };
}

function buildICS(events: DashboardEvent[]) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aussie Med Guide//Command Calendar//EN",
  ];

  events.forEach((event) => {
    const day = event.date.replace(/-/g, "");
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${event.id}@aussiemedguide`);
    lines.push(`DTSTAMP:${day}T000000Z`);
    lines.push(`DTSTART;VALUE=DATE:${day}`);
    lines.push(`SUMMARY:${event.title}`);
    lines.push(
      `DESCRIPTION:${event.notes ?? "Tracked from COMMAND dashboard"}`
    );
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function buildGoogleCalendarLink(events: DashboardEvent[]) {
  const first = events[0];
  if (!first) return "#";

  const start = first.date.replace(/-/g, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "Aussie Med Guide Timeline"
  )}&dates=${start}/${start}&details=${encodeURIComponent(
    "Use the downloaded ICS for full calendar import."
  )}`;
}

function formatRelativeUpdate(date: string | null) {
  if (!date) return "Not set";

  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Updated today";
  if (diffDays === 1) return "Updated yesterday";
  if (diffDays < 7) return `Updated ${diffDays} days ago`;

  return `Updated ${formatShortDate(date)}`;
}

function formatDowntimeLabel(start: string | null, end: string | null) {
  if (!start || !end) return "No scheduled downtime";

  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (now >= startDate && now <= endDate) return "Maintenance in progress";

  return `Downtime ${formatShortDate(start)}`;
}

function formatDowntimeDetail(start: string | null, end: string | null) {
  if (!start || !end) return "No scheduled downtime";

  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (now >= startDate && now <= endDate) {
    return `In progress until ${formatDateTime(end)}`;
  }

  return `${formatDateTime(start)} to ${formatDateTime(end)}`;
}

function getPlanLabel(planKey: SubscriptionInfo["planKey"]) {
  switch (planKey) {
    case "pro_monthly":
      return "Pro Monthly";
    case "pro_annual":
      return "Pro Annual";
    default:
      return "Free";
  }
}

function getPlanAccent(planKey: SubscriptionInfo["planKey"]) {
  switch (planKey) {
    case "pro_monthly":
    case "pro_annual":
      return "border-amber-200 bg-amber-50 text-amber-950";
    default:
      return "border-white/20 bg-white/12 text-white";
  }
}

function getBillingLabel(subscription: SubscriptionInfo) {
  if (subscription.planKey === "free") {
    return "Essential planning tools active";
  }

  if (subscription.status !== "active" && subscription.status !== "trialing") {
    return `Status: ${subscription.status.replace(/_/g, " ")}`;
  }

  if (subscription.currentPeriodEnd) {
    return subscription.cancelAtPeriodEnd
      ? `Ends on ${formatShortDate(subscription.currentPeriodEnd)}`
      : `Renews on ${formatShortDate(subscription.currentPeriodEnd)}`;
  }

  return "Billing active";
}

function getFocusLabel(profile: Profile) {
  if (profile.ucat < 2400) return "UCAT elevation";
  if (profile.interviewScore < 3.5) return "Interview structure";
  if (profile.targetUnis.length < 3) return "Shortlist clarity";
  return "Execution mode";
}

function getMomentumStateLabel(state: MomentumState) {
  switch (state) {
    case "elite":
      return "Elite Rhythm";
    case "locked_in":
      return "Locked In";
    case "active":
      return "Active";
    case "warming_up":
      return "Warming Up";
    default:
      return "Cold";
  }
}

function getLevelFromVitals(vitals: number) {
  if (vitals >= 1500) return 7;
  if (vitals >= 1100) return 6;
  if (vitals >= 800) return 5;
  if (vitals >= 550) return 4;
  if (vitals >= 325) return 3;
  if (vitals >= 150) return 2;
  return 1;
}

function getLevelLabel(level: number) {
  switch (level) {
    case 1:
      return "Starter";
    case 2:
      return "Builder";
    case 3:
      return "Contender";
    case 4:
      return "Interview Ready";
    case 5:
      return "Offer Hunter";
    case 6:
      return "Final Round";
    default:
      return "White Coat Track";
  }
}

function SectionCard({
  title,
  description,
  icon,
  action,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60",
        className
      )}
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          {icon ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
              {icon}
            </div>
          ) : null}
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function StatCard({
  title,
  value,
  caption,
  tone,
}: {
  title: string;
  value: string;
  caption: string;
  tone: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-5 shadow-sm shadow-slate-200/60 transition hover:-translate-y-0.5",
        tone
      )}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-3 text-4xl font-bold tracking-tight">{value}</div>
      <div className="mt-3 text-xs font-medium opacity-80">{caption}</div>
    </div>
  );
}

function ProCard({
  title,
  description,
  icon,
  unlocked,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  unlocked: boolean;
  children: ReactNode;
}) {
  if (unlocked) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-950">
                {title}
              </h3>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                Unlocked
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-950">{title}</h3>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-900">
              Pro
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm leading-6 text-slate-600">
          Upgrade to unlock this part of Command. Your core profile and account
          stay available on the free plan.
        </p>
        <Link
          href="/info/pricing"
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Upgrade to Pro
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function AvatarPreview({ avatar }: { avatar: string }) {
  const found = AVATARS.find((item) => item.id === avatar) ?? AVATARS[0];
  const Icon = found.icon;

  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-sm">
      <Icon className="h-8 w-8" />
    </div>
  );
}

function MetricPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

const EMPTY_COMMAND_PROGRESS: CommandProgress = {
  clerk_user_id: "",
  vitals_total: 0,
  vitals_today: 0,
  momentum_state: "cold",
  active_days_this_week: 0,
  boss_level_unlocked: 1,
  last_activity_at: null,
  created_at: null,
  updated_at: null,
};

export default function CommandClient({
  userId,
  userEmail,
  subscription,
  initialProfile,
  initialCustomDates,
  siteSettings,
  initialCommandProgress,
  initialVitalsEvents,
}: CommandClientProps) {
  const { session } = useSession();

  const supabase = useMemo(() => {
    return createClient(async () => {
      return (await session?.getToken()) ?? null;
    });
  }, [session]);

  const isPremium =
    (subscription.planKey === "pro_monthly" ||
      subscription.planKey === "pro_annual") &&
    (subscription.status === "active" || subscription.status === "trialing");

  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [customDates, setCustomDates] =
    useState<DashboardEvent[]>(initialCustomDates);
  const [commandProgress, setCommandProgress] = useState<CommandProgress>(
  initialCommandProgress ?? EMPTY_COMMAND_PROGRESS
);
const [vitalsEvents, setVitalsEvents] = useState<VitalsEvent[]>(
  initialVitalsEvents ?? []
);
  const [showEdit, setShowEdit] = useState(false);
const [isSavingProfile, setIsSavingProfile] = useState(false);
const [profileMessage, setProfileMessage] = useState("");
const [eventMessage, setEventMessage] = useState("");
const [draftDate, setDraftDate] = useState({
  title: "",
  date: "",
  type: "personal" as EventType,
  notes: "",
});

useEffect(() => {
  void refreshProgress();
}, []);

  const allEvents = useMemo(() => {
    return [...BASE_EVENTS, ...customDates].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }, [customDates]);

  const upcoming = useMemo(() => {
    return allEvents.filter((event) => daysUntil(event.date) >= 0).slice(0, 6);
  }, [allEvents]);

  const nextEvent = upcoming[0] ?? null;

  const readinessBand = useMemo(() => {
    const atarScore = Math.min(100, profile.atar);
    const ucatScore = Math.min(100, (profile.ucat / 2700) * 100);
    const interviewScore = Math.min(100, (profile.interviewScore / 5) * 100);

    return Math.round(
      atarScore * 0.4 + ucatScore * 0.35 + interviewScore * 0.25
    );
  }, [profile]);

  const priorityActions = useMemo(() => {
    const actions: Array<{
      title: string;
      text: string;
      tone: string;
    }> = [];

    if (profile.ucat < 1900) {
      actions.push({
        title: "Lift UCAT competitiveness",
        text: "Build more timed sets, review weak subtests, and lock in a repeatable weekly structure.",
        tone: "border-violet-200 bg-violet-50 text-violet-900",
      });
    }

    if (profile.interviewScore < 3.5) {
      actions.push({
        title: "Build interview consistency",
        text: "You need more structured reps. Focus on reflection quality, delivery, and timed MMI practice.",
        tone: "border-emerald-200 bg-emerald-50 text-emerald-900",
      });
    }

    if (profile.targetUnis.length < 3) {
      actions.push({
        title: "Shortlist target universities",
        text: "A clearer shortlist will make your planning, rural strategy, and timeline far more useful.",
        tone: "border-blue-200 bg-blue-50 text-blue-900",
      });
    }

    return actions.slice(0, 3);
  }, [profile]);

  const weeklyProgress = useMemo(() => {
    return {
      interview: Math.min(100, profile.interviewScore * 20),
      ucat: Math.min(100, (profile.ucat / 2700) * 100),
    };
  }, [profile]);

  const dailyMotto = useMemo(() => getDailyMotto(profile.name), [profile.name]);
  const focusLabel = useMemo(() => getFocusLabel(profile), [profile]);

  const vitalsTotal = commandProgress?.vitals_total ?? 0;
  const vitalsToday = commandProgress?.vitals_today ?? 0;
  const activeDaysThisWeek = commandProgress?.active_days_this_week ?? 0;
  const momentumState =
   (commandProgress?.momentum_state as MomentumState | undefined) ?? "cold";
  const momentumLabel = getMomentumStateLabel(momentumState);
  const unlockedBossLevel = commandProgress?.boss_level_unlocked ?? 1;

  const applicantLevel = useMemo(
    () => getLevelFromVitals(vitalsTotal),
    [vitalsTotal]
  );

  const applicantLevelLabel = useMemo(
    () => getLevelLabel(applicantLevel),
    [applicantLevel]
  );

  const currentBoss = useMemo(
    () =>
      INTERVIEW_BOSSES.find((boss) => boss.level === unlockedBossLevel) ??
      INTERVIEW_BOSSES[0],
    [unlockedBossLevel]
  );

  const nextBoss = useMemo(
    () =>
      INTERVIEW_BOSSES.find(
        (boss) => boss.level === unlockedBossLevel + 1
      ) ?? null,
    [unlockedBossLevel]
  );

  const dailyMissions = useMemo<DailyMission[]>(() => {
    return [
      {
        id: "interview",
        label: "Complete 1 interview rep",
        completed: profile.interviewScore >= 3.5,
        reward: 40,
      },
      {
        id: "timeline",
        label: "Add 1 planning action",
        completed: customDates.length > 0,
        reward: 5,
      },
      {
        id: "shortlist",
        label: "Save 3 target universities",
        completed: profile.targetUnis.length >= 3,
        reward: 10,
      },
    ];
  }, [profile.interviewScore, customDates.length, profile.targetUnis.length]);

  const missionsCompleted = useMemo(
    () => dailyMissions.filter((mission) => mission.completed).length,
    [dailyMissions]
  );

  const nextLevelTarget = useMemo(() => {
    const targets = [150, 325, 550, 800, 1100, 1500, 1900];
    return targets.find((target) => target > vitalsTotal) ?? vitalsTotal;
  }, [vitalsTotal]);

  const vitalsToNextLevel = Math.max(0, nextLevelTarget - vitalsTotal);

  async function refreshProgress() {
    try {
      const res = await fetch("/api/command/progress", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) return;

      if (data?.progress) {
        setCommandProgress(data.progress as CommandProgress);
      }

      if (Array.isArray(data?.events)) {
        setVitalsEvents(data.events as VitalsEvent[]);
      }
    } catch {
      // silent refresh fail
    }
  }

  async function awardVitals(input: {
    source:
      | "profile_save"
      | "custom_date_add"
      | "interview_attempt"
      | "arena_win"
      | "arena_completion"
      | "mission_bonus"
      | "manual_adjustment"
      | "consistency_decay";
    delta: number;
    reason: string;
    metadata?: Record<string, unknown>;
  }) {
    try {
      const res = await fetch("/api/command/award", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const data = await res.json();

      if (!res.ok) return false;

      if (data?.progress) {
        setCommandProgress(data.progress as CommandProgress);
      } else {
        await refreshProgress();
      }

      return true;
    } catch {
      return false;
    }
  }

  function toggleUni(name: string) {
    setProfile((current) => ({
      ...current,
      targetUnis: current.targetUnis.includes(name)
        ? current.targetUnis.filter((uni) => uni !== name)
        : [...current.targetUnis, name].slice(0, 10),
    }));
  }

  async function saveProfile() {
    setIsSavingProfile(true);
    setProfileMessage("");

    try {
      const res = await fetch("/api/command/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          yearLevel: profile.yearLevel,
          state: profile.state,
          category: profile.category,
          pathway: profile.pathway,
          atar: profile.atar,
          ucat: profile.ucat,
          interviewScore: profile.interviewScore,
          targetUnis: profile.targetUnis,
          avatar: profile.avatar,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileMessage(data?.error || "Failed to save profile.");
        return;
      }

      await awardVitals({
        source: "profile_save",
        delta: 10,
        reason: "Saved command profile",
        metadata: {
          targetUnisCount: profile.targetUnis.length,
          yearLevel: profile.yearLevel,
        },
      });

      setProfileMessage("Profile saved. +10 Vitals");
      setShowEdit(false);
    } catch {
      setProfileMessage("Failed to save profile.");
    } finally {
      setIsSavingProfile(false);
    }
  }
    async function addCustomDate() {
    if (!draftDate.title || !draftDate.date) return;

    setEventMessage("");

    const payload = {
      clerk_user_id: userId,
      title: draftDate.title,
      date: draftDate.date,
      type: draftDate.type,
      notes: draftDate.notes,
      source: "custom",
    };

    const { data, error } = await supabase
      .from("command_events")
      .insert(payload)
      .select("id, title, date, type, notes, source")
      .single();

    if (error || !data) {
      setEventMessage("Failed to save custom date.");
      return;
    }

    setCustomDates((current) => [
      ...current,
      {
        id: String(data.id),
        title: data.title,
        date: data.date,
        type: data.type as EventType,
        notes: data.notes ?? "",
        source: "custom",
      },
    ]);

    setDraftDate({
      title: "",
      date: "",
      type: "personal",
      notes: "",
    });

    await awardVitals({
      source: "custom_date_add",
      delta: 5,
      reason: "Added custom command date",
      metadata: {
        title: data.title,
        type: data.type,
      },
    });

    setEventMessage("Custom date added. +5 Vitals");
  }

  async function removeCustomDate(id: string) {
    const existing = customDates.find((event) => event.id === id);
    if (!existing) return;

    setCustomDates((current) => current.filter((event) => event.id !== id));

    const { error } = await supabase
      .from("command_events")
      .delete()
      .eq("id", id)
      .eq("clerk_user_id", userId);

    if (error) {
      setCustomDates((current) => [...current, existing]);
      setEventMessage("Failed to delete custom date.");
    }
  }

  function exportICS() {
    const ics = buildICS(allEvents);
    downloadTextFile(
      "amg-command-calendar.ics",
      ics,
      "text/calendar;charset=utf-8"
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {siteSettings.maintenanceMode ? (
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-4 shadow-sm shadow-amber-100/60">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-amber-950">
                  Scheduled maintenance mode is active
                </div>
                <p className="mt-1 text-sm leading-6 text-amber-900">
                  {siteSettings.maintenanceMessage}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="overflow-hidden rounded-3xl border border-emerald-300/70 bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white shadow-sm shadow-emerald-200/60 sm:p-8">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
                <Orbit className="h-3.5 w-3.5" />
                Personal Command Centre
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                ⌘ COMMAND
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
                Your premium control room for Australian med entry planning.
                Cleaner signals. Better structure. Sharper execution.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricPill
                  label="Plan"
                  value={getPlanLabel(subscription.planKey)}
                />
                <MetricPill
                  label="Vitals today"
                  value={`${vitalsToday} Vitals`}
                />
                <MetricPill
                  label="Level"
                  value={`Lv ${applicantLevel} · ${applicantLevelLabel}`}
                />
                <MetricPill
                  label="Boss"
                  value={`Level ${currentBoss.level} Arena`}
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    Focus signal
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {focusLabel}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    Momentum
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {momentumLabel}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    To next level
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {vitalsToNextLevel} Vitals
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <AvatarPreview avatar={profile.avatar} />
                <div className="min-w-0">
                  <div className="truncate text-lg font-semibold">
                    {profile.name || "Your account"}
                  </div>
                  <div className="truncate text-sm text-white/85">
                    {userEmail}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
                      Clerk connected
                    </div>
                    <div
                      className={cn(
                        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
                        getPlanAccent(subscription.planKey)
                      )}
                    >
                      {getPlanLabel(subscription.planKey)}
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-white/85">
                    {getBillingLabel(subscription)}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                <button
                  onClick={() => setShowEdit((value) => !value)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
                >
                  <Edit3 className="h-4 w-4" />
                  {showEdit ? "Close editor" : "Edit profile"}
                </button>

                {subscription.planKey === "free" ? (
                  <Link
                    href="/info/pricing"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-slate-900/25 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <Crown className="h-4 w-4" />
                    Unlock Pro
                  </Link>
                ) : (
                  <Link
                    href="/info/pricing"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-slate-900/25 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <Wallet className="h-4 w-4" />
                    Manage billing
                  </Link>
                )}

                <SignOutButton redirectUrl="/">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    Sign out
                  </button>
                </SignOutButton>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.9fr_1.15fr_0.95fr]">
          <SectionCard
            title="Manu’s Motto"
            description="A fresh daily reminder that changes every day."
            icon={<Stars className="h-5 w-5 text-emerald-600" />}
          >
            <div className="rounded-3xl border border-emerald-200 bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 p-5">
              <div className="inline-flex rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Day {dailyMotto.dayNumber}
              </div>
              <p className="mt-4 text-xl font-semibold leading-9 tracking-tight text-slate-950">
                {dailyMotto.text}
              </p>
            </div>
          </SectionCard>

          <SectionCard
            title="Next key date"
            description="Your closest upcoming milestone from the Command timeline."
            icon={<CalendarDays className="h-5 w-5 text-sky-600" />}
          >
            {nextEvent ? (
              <div
                className={cn(
                  "rounded-3xl border p-5 shadow-sm",
                  EVENT_STYLES[nextEvent.type]
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold">
                      {nextEvent.title}
                    </div>
                    <div className="mt-1 text-sm opacity-80">
                      {formatDate(nextEvent.date)}
                    </div>
                  </div>
                  <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-semibold">
                    {nextEvent.type}
                  </span>
                </div>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div className="text-4xl font-bold tracking-tight">
                    {daysUntil(nextEvent.date)} days
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em]">
                    Next milestone
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                No upcoming dates yet.
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Current focus"
            description="The clearest planning signal from your current profile."
            icon={<Flag className="h-5 w-5 text-violet-600" />}
          >
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Pathway
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-950">
                  {profile.pathway} from {profile.state}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Execution mode
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-950">
                  {focusLabel}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Billing
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-950">
                  {getBillingLabel(subscription)}
                </div>
              </div>
            </div>
          </SectionCard>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="ATAR"
            value={String(profile.atar)}
            caption="Current estimate"
            tone="border-blue-200 bg-blue-50 text-blue-950"
          />
          <StatCard
            title="UCAT"
            value={String(profile.ucat)}
            caption="Best score so far / 2700"
            tone="border-violet-200 bg-violet-50 text-violet-950"
          />
          <StatCard
            title="Interview"
            value={`${profile.interviewScore.toFixed(1)}/5`}
            caption="Current self-rating"
            tone="border-emerald-200 bg-emerald-50 text-emerald-950"
          />
          <StatCard
            title="Readiness"
            value={`${readinessBand}/100`}
            caption="Blended dashboard score"
            tone="border-slate-200 bg-slate-50 text-slate-950"
          />
        </section>

        {showEdit ? (
          <SectionCard
            title="Edit your Command profile"
            description="Saved to your account so your dashboard feels personal from the start."
            icon={<UserRound className="h-5 w-5" />}
            action={
              <button
                onClick={() => setShowEdit(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            }
          >
            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">
                  Display name
                </span>
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Email
                </span>
                <input
                  value={userEmail}
                  disabled
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Year level
                </span>
                <select
                  value={profile.yearLevel}
                  onChange={(e) =>
                    setProfile({ ...profile, yearLevel: e.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                >
                  <option>Year 10</option>
                  <option>Year 11</option>
                  <option>Year 12</option>
                  <option>Gap Year</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  State
                </span>
                <select
                  value={profile.state}
                  onChange={(e) =>
                    setProfile({ ...profile, state: e.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                >
                  <option>QLD</option>
                  <option>NSW</option>
                  <option>VIC</option>
                  <option>WA</option>
                  <option>SA</option>
                  <option>TAS</option>
                  <option>ACT</option>
                  <option>NT</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Category
                </span>
                <select
                  value={profile.category}
                  onChange={(e) =>
                    setProfile({ ...profile, category: e.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                >
                  <option>Metropolitan</option>
                  <option>Rural</option>
                  <option>Indigenous</option>
                </select>
              </label>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Pathway
                </span>
                <select
                  value={profile.pathway}
                  onChange={(e) =>
                    setProfile({ ...profile, pathway: e.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                >
                  <option>Undergraduate</option>
                  <option>Postgraduate</option>
                  <option>Both</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  ATAR estimate
                </span>
                <input
                  type="number"
                  value={profile.atar}
                  onChange={(e) =>
                    setProfile({ ...profile, atar: Number(e.target.value) })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Best UCAT
                </span>
                <input
                  type="number"
                  value={profile.ucat}
                  onChange={(e) =>
                    setProfile({ ...profile, ucat: Number(e.target.value) })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Interview score
                </span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={profile.interviewScore}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      interviewScore: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                />
              </label>
            </div>

            <div className="mt-8">
              <div className="text-base font-semibold text-slate-950">
                Choose your profile icon
              </div>
              <p className="mt-1 text-sm text-slate-500">
                A small but important personal touch for the Command page.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {AVATARS.map((avatar) => {
                  const Icon = avatar.icon;
                  const active = profile.avatar === avatar.id;

                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() =>
                        setProfile({ ...profile, avatar: avatar.id })
                      }
                      className={cn(
                        "rounded-3xl border p-4 text-left transition",
                        active
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                      )}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-800 shadow-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="mt-3 text-sm font-semibold text-slate-900">
                        {avatar.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <div className="text-base font-semibold text-slate-950">
                Target universities
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Save your shortlist so Command can personalise your planning.
              </p>

              <div className="mt-4 grid max-h-96 gap-3 overflow-auto pr-2 md:grid-cols-3">
                {ALL_UNIS.map((uni) => {
                  const selected = profile.targetUnis.includes(uni);

                  return (
                    <button
                      key={uni}
                      type="button"
                      onClick={() => toggleUni(uni)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition",
                        selected
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded border",
                          selected
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-slate-400"
                        )}
                      >
                        {selected ? (
                          <Check className="h-3.5 w-3.5 text-white" />
                        ) : null}
                      </span>
                      <span className="text-sm font-medium text-slate-900">
                        {uni}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 text-xs text-slate-500">
                {profile.targetUnis.length} universities selected
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={saveProfile}
                disabled={isSavingProfile}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {isSavingProfile ? "Saving..." : "Save profile"}
              </button>

              <button
                onClick={() => setShowEdit(false)}
                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
              >
                Cancel
              </button>

              {profileMessage ? (
                <span className="text-sm text-slate-500">{profileMessage}</span>
              ) : null}
            </div>
          </SectionCard>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <SectionCard
            title="Key dates calendar"
            description="Core med dates plus your own personal deadlines."
            icon={<CalendarDays className="h-5 w-5 text-sky-600" />}
            action={
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={exportICS}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  <CalendarDays className="h-4 w-4" />
                  Download .ics
                </button>
                <a
                  href={buildGoogleCalendarLink(allEvents)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Google Cal
                </a>
              </div>
            }
          >
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3">
                {upcoming.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "rounded-2xl border p-4 shadow-sm shadow-white/40",
                      EVENT_STYLES[event.type]
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold">{event.title}</div>
                        <div className="mt-1 text-sm opacity-80">
                          {formatDate(event.date)}
                        </div>
                      </div>
                      <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-semibold">
                        {event.type}
                      </span>
                    </div>
                    <div className="mt-2 text-xs font-medium opacity-80">
                      {daysUntil(event.date)} days
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-950">
                  <Plus className="h-5 w-5" />
                  <h3 className="text-base font-semibold">Add custom date</h3>
                </div>

                <div className="mt-4 space-y-3">
                  <input
                    value={draftDate.title}
                    onChange={(e) =>
                      setDraftDate({ ...draftDate, title: e.target.value })
                    }
                    placeholder="Event title"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  />
                  <input
                    type="date"
                    value={draftDate.date}
                    onChange={(e) =>
                      setDraftDate({ ...draftDate, date: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  />
                  <select
                    value={draftDate.type}
                    onChange={(e) =>
                      setDraftDate({
                        ...draftDate,
                        type: e.target.value as EventType,
                      })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  >
                    <option value="personal">Personal</option>
                    <option value="ucat">UCAT</option>
                    <option value="applications">Applications</option>
                    <option value="rural">Rural</option>
                    <option value="interviews">Interviews</option>
                    <option value="offers">Offers</option>
                  </select>
                  <textarea
                    value={draftDate.notes}
                    onChange={(e) =>
                      setDraftDate({ ...draftDate, notes: e.target.value })
                    }
                    placeholder="Optional notes"
                    className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  />
                  <button
                    onClick={addCustomDate}
                    className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                  >
                    Add to timeline
                  </button>
                  {eventMessage ? (
                    <div className="text-xs text-slate-500">{eventMessage}</div>
                  ) : null}
                </div>
              </div>
            </div>

            {customDates.length ? (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 text-base font-semibold text-slate-950">
                  Your saved custom dates
                </div>
                <div className="space-y-3">
                  {customDates
                    .slice()
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                      >
                        <div>
                          <div className="font-semibold text-slate-950">
                            {event.title}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            {formatDate(event.date)}
                          </div>
                          {event.notes ? (
                            <div className="mt-2 text-sm text-slate-600">
                              {event.notes}
                            </div>
                          ) : null}
                        </div>
                        <button
                          onClick={() => removeCustomDate(event.id)}
                          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ) : null}
          </SectionCard>

          <div className="space-y-4">
            <SectionCard
              title="Core planning view"
              description="Your direction, momentum, and next moves in one place."
              icon={<Activity className="h-5 w-5 text-violet-600" />}
            >
              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-slate-950">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold">Pathway focus</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    You are currently focused on the{" "}
                    <span className="font-semibold text-slate-950">
                      {profile.pathway}
                    </span>{" "}
                    route from{" "}
                    <span className="font-semibold text-slate-950">
                      {profile.state}
                    </span>
                    .
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-slate-950">
                    <MapPinned className="h-4 w-4 text-emerald-600" />
                    <span className="font-semibold">Current shortlist</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profile.targetUnis.length ? (
                      profile.targetUnis.slice(0, 8).map((uni) => (
                        <span
                          key={uni}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          {uni}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">
                        No target universities saved yet.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-slate-950">
                    <Clock3 className="h-4 w-4 text-amber-600" />
                    <span className="font-semibold">Priority actions</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {priorityActions.length ? (
                      priorityActions.map((action) => (
                        <div
                          key={action.title}
                          className={cn("rounded-2xl border p-4", action.tone)}
                        >
                          <div className="font-semibold">{action.title}</div>
                          <div className="mt-1 text-sm">{action.text}</div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                        No urgent actions right now.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="System status"
              description="Live trust signals for dashboard freshness and downtime."
              icon={<Wrench className="h-5 w-5 text-slate-700" />}
            >
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Last updated
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">
                    {formatRelativeUpdate(siteSettings.commandLastUpdatedAt)}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Scheduled downtime
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">
                    {formatDowntimeLabel(
                      siteSettings.scheduledDowntimeStartAt,
                      siteSettings.scheduledDowntimeEndAt
                    )}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {formatDowntimeDetail(
                      siteSettings.scheduledDowntimeStartAt,
                      siteSettings.scheduledDowntimeEndAt
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Readiness state
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-950">
                    <BadgeCheck className="h-4 w-4 text-emerald-600" />
                    {readinessBand >= 80
                      ? "Strong base"
                      : readinessBand >= 65
                        ? "Competitive build"
                        : "Early build phase"}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">
                <Sparkles className="h-3.5 w-3.5" />
                Pro command deck
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Premium planning that feels like forward motion
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                This is where Command becomes more than a dashboard. Track your
                momentum, sharpen your shortlist, and turn scattered planning
                into structured execution.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-200/60">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Status
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-950">
                  {isPremium ? "Unlocked" : "Locked"}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-200/60">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Focus
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-950">
                  {focusLabel}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-200/60">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Momentum
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-950">
                  {momentumLabel}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.25fr_0.95fr]">
            <div className="rounded-3xl border border-violet-200 bg-linear-to-br from-violet-50 via-white to-fuchsia-50 p-6 shadow-sm shadow-violet-100/60">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    Vitals system
                  </div>

                  <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                    Build Vitals. Protect Momentum.
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    Vitals are your progress currency across Command, Train,
                    roadmap actions, and planning behaviour. Momentum tracks how
                    consistently you are showing up.
                  </p>
                </div>

                <div className="grid min-w-56 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Vitals today
                    </div>
                    <div className="mt-1 text-base font-semibold text-violet-700">
                      {vitalsToday} Vitals
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Momentum
                    </div>
                    <div className="mt-1 text-base font-semibold text-slate-950">
                      {momentumLabel}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Trophy className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-[0.16em]">
                      Total vitals
                    </span>
                  </div>
                  <div className="mt-3 text-2xl font-semibold text-slate-950">
                    {vitalsTotal}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Your cumulative progress across Command and Train.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-[0.16em]">
                      Active days
                    </span>
                  </div>
                  <div className="mt-3 text-2xl font-semibold text-slate-950">
                    {activeDaysThisWeek} / 7
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Your weekly consistency state for Momentum.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Target className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-[0.16em]">
                      Applicant level
                    </span>
                  </div>
                  <div className="mt-3 text-2xl font-semibold text-slate-950">
                    Lv {applicantLevel}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {applicantLevelLabel} · {vitalsToNextLevel} Vitals to next
                    level.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <span>Momentum rhythm</span>
                  <span>{activeDaysThisWeek} / 7 active days</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/90">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-orange-400"
                    style={{ width: `${(activeDaysThisWeek / 7) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  <Lock className="h-3.5 w-3.5" />
                  Interview Arena
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
                  Boss battles and daily missions
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Train should feel like progression. Unlock tougher interview
                  bosses as your Vitals and Momentum improve.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">
                      Current boss
                    </div>
                    <div className="mt-1 text-lg font-semibold text-slate-950">
                      {currentBoss.name}
                    </div>
                    <div className="text-sm font-medium text-violet-700">
                      {currentBoss.title}
                    </div>
                  </div>
                  <div className="rounded-full border border-violet-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-700">
                    Level {currentBoss.level}
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {currentBoss.twist}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full border border-violet-200 bg-white px-3 py-1 text-violet-700">
                    Reward: +{currentBoss.vitalsReward} Vitals
                  </span>
                  <span className="rounded-full border border-violet-200 bg-white px-3 py-1 text-violet-700">
                    Unlocked
                  </span>
                </div>

                <Link
                  href="/tools/train"
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Enter Interview Arena
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {nextBoss ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Next boss
                  </div>
                  <div className="mt-1 text-base font-semibold text-slate-950">
                    {nextBoss.name} · {nextBoss.title}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {nextBoss.unlockText}
                  </p>
                </div>
              ) : null}

              <div className="mt-6">
                <div className="text-sm font-semibold text-slate-950">
                  Today’s missions
                </div>
                <div className="mt-3 space-y-3">
                  {dailyMissions.map((mission) => (
                    <div
                      key={mission.id}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-2xl border p-3",
                        mission.completed
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-slate-200 bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border",
                            mission.completed
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-slate-300 bg-white text-slate-400"
                          )}
                        >
                          {mission.completed ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : null}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {mission.label}
                          </div>
                          <div className="text-xs text-slate-500">
                            +{mission.reward} Vitals
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        {mission.completed ? "Done" : "Open"}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                      Daily bonus
                    </span>
                    <span className="text-sm font-semibold text-violet-700">
                      {missionsCompleted} / 3
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Complete all 3 missions to earn a bonus +20 Vitals.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!!vitalsEvents.length ? (
            <SectionCard
              title="Recent vitals activity"
              description="Your latest recorded progress events."
              icon={<Sparkles className="h-5 w-5 text-violet-600" />}
            >
              <div className="space-y-3">
                {vitalsEvents.slice(0, 6).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div>
                      <div className="font-semibold text-slate-950">
                        {event.reason}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {formatDateTime(event.occurred_at)}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        event.delta >= 0
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border border-rose-200 bg-rose-50 text-rose-700"
                      )}
                    >
                      {event.delta >= 0 ? `+${event.delta}` : event.delta} Vitals
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ProCard
              title="Target universities"
              description="Competitiveness tracking against your shortlist."
              icon={<Target className="h-5 w-5" />}
              unlocked={isPremium}
            >
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-950">
                <div className="text-sm font-semibold">
                  Shortlisted universities
                </div>
                <div className="mt-2 text-4xl font-bold">
                  {profile.targetUnis.length}
                </div>
                <p className="mt-2 text-sm">
                  Your shortlist is saved and ready for deeper comparison.
                </p>
              </div>
            </ProCard>

            <ProCard
              title="Weekly progress"
              description="See consistency across UCAT and interview prep."
              icon={<TrendingUp className="h-5 w-5" />}
              unlocked={isPremium}
            >
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      UCAT momentum
                    </span>
                    <span className="text-slate-500">
                      {Math.round(weeklyProgress.ucat)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-violet-600"
                      style={{ width: `${weeklyProgress.ucat}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      Interview consistency
                    </span>
                    <span className="text-slate-500">
                      {Math.round(weeklyProgress.interview)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-emerald-600"
                      style={{ width: `${weeklyProgress.interview}%` }}
                    />
                  </div>
                </div>
              </div>
            </ProCard>

            <ProCard
              title="Vitals"
              description="Your progress currency across planning, Train, and execution."
              icon={<Sparkles className="h-5 w-5" />}
              unlocked={isPremium}
            >
              <div className="rounded-2xl border border-violet-200 bg-linear-to-br from-violet-50 to-fuchsia-50 p-4 text-violet-950">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">Total Vitals</div>
                    <div className="mt-2 text-4xl font-bold">{vitalsTotal}</div>
                  </div>
                  <div className="rounded-2xl border border-violet-200 bg-white px-3 py-2 text-right">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Today
                    </div>
                    <div className="mt-1 text-sm font-semibold text-violet-700">
                      +{vitalsToday}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm">
                  Complete useful actions across Command and Train to keep
                  building progress.
                </p>
              </div>
            </ProCard>

            <ProCard
              title="Scholarships"
              description="Save and track scholarship opportunities."
              icon={<Award className="h-5 w-5" />}
              unlocked={isPremium}
            >
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    Saved scholarships
                  </span>
                  <span className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700">
                    0
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  Build your funding plan in one place.
                </p>
              </div>
            </ProCard>

            <ProCard
              title="Accommodation + experiences"
              description="Keep relocation planning and experiences organised."
              icon={<House className="h-5 w-5" />}
              unlocked={isPremium}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <House className="h-4 w-4 text-violet-600" />
                    Accommodation
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Save options, costs, and location preferences.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <Gift className="h-4 w-4 text-emerald-600" />
                    Experiences
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Track volunteering, leadership, and work experience.
                  </p>
                </div>
              </div>
            </ProCard>

            <ProCard
              title="Upgrade your edge"
              description="Unlock the full premium workflow across planning and execution."
              icon={<Crown className="h-5 w-5" />}
              unlocked={isPremium}
            >
              <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
                <div className="text-sm font-semibold text-violet-950">
                  Pro gives you more than access
                </div>
                <p className="mt-2 text-sm text-violet-800">
                  It turns Command into a sharper system for strategy, funding,
                  organisation, and momentum.
                </p>
                <Link
                  href="/info/pricing"
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  {isPremium ? "Manage plan" : "Unlock Pro"}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </ProCard>
          </div>
        </section>
      </div>
    </main>
  );
}