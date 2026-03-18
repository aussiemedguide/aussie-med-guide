"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";''
import {
  ArrowUpRight,
  Award,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Crown,
  Edit3,
  Flame,
  Gift,
  GraduationCap,
  House,
  MapPinned,
  Plus,
  Save,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  X,
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
  yearLevel: string;
  state: string;
  category: string;
  pathway: string;
  atar: number;
  ucat: number;
  interviewScore: number;
  targetUnis: string[];
};

type CommandClientProps = {
  userId: string;
  isPremium: boolean;
  initialProfile: Profile;
  initialCustomDates: DashboardEvent[];
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

function daysUntil(date: string) {
  const now = new Date();
  const target = new Date(date);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
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

function SectionCard({
  title,
  description,
  icon,
  action,
  children,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          {icon ? (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              {icon}
            </div>
          ) : null}
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
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
    <div className={cn("rounded-3xl border p-5 shadow-sm", tone)}>
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
              <h3 className="text-base font-semibold text-slate-950">{title}</h3>
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
          Upgrade to unlock this part of Command. Your core profile and dashboard
          stay usable on the free plan.
        </p>
        <a
          href="/pricing"
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Upgrade to Pro
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

export default function CommandClient({
  userId,
  isPremium,
  initialProfile,
  initialCustomDates,
}: CommandClientProps) {
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [customDates, setCustomDates] =
    useState<DashboardEvent[]>(initialCustomDates);
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

  const allEvents = useMemo(() => {
    return [...BASE_EVENTS, ...customDates].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }, [customDates]);

  const upcoming = useMemo(() => {
    return allEvents.filter((event) => daysUntil(event.date) >= 0).slice(0, 6);
  }, [allEvents]);

  const readinessBand = useMemo(() => {
    const atarScore = Math.min(100, profile.atar);
    const ucatScore = Math.min(100, (profile.ucat / 3600) * 100);
    const interviewScore = Math.min(100, (profile.interviewScore / 5) * 100);
    return Math.round(atarScore * 0.4 + ucatScore * 0.35 + interviewScore * 0.25);
  }, [profile]);

  const priorityActions = useMemo(() => {
    const actions = [];

    if (profile.ucat < 2500) {
      actions.push({
        title: "Lift UCAT competitiveness",
        text: "Your current score leaves room to improve. Schedule more timed drills and review weak subtests weekly.",
        tone: "border-violet-200 bg-violet-50 text-violet-900",
      });
    }

    if (profile.interviewScore < 3) {
      actions.push({
        title: "Build interview consistency",
        text: "You need more structured interview reps. Use Train regularly and aim to log feedback over time.",
        tone: "border-emerald-200 bg-emerald-50 text-emerald-900",
      });
    }

    if (profile.targetUnis.length < 3) {
      actions.push({
        title: "Shortlist target universities",
        text: "Build a clearer shortlist so Command can surface better planning and strategic next steps.",
        tone: "border-blue-200 bg-blue-50 text-blue-900",
      });
    }

    return actions.slice(0, 3);
  }, [profile]);

  const weeklyProgress = useMemo(() => {
    return {
      interview: Math.min(100, profile.interviewScore * 20),
      ucat: Math.min(100, (profile.ucat / 3200) * 100),
    };
  }, [profile]);

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

    const { error } = await supabase.from("command_profiles").upsert({
      user_id: userId,
      display_name: profile.name,
      year_level: profile.yearLevel,
      state: profile.state,
      category: profile.category,
      pathway: profile.pathway,
      atar: profile.atar,
      ucat: profile.ucat,
      interview_score: profile.interviewScore,
      target_unis: profile.targetUnis,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setProfileMessage("Failed to save profile.");
    } else {
      setProfileMessage("Profile saved.");
      setShowEdit(false);
    }

    setIsSavingProfile(false);
  }

  async function addCustomDate() {
    if (!draftDate.title || !draftDate.date) return;

    setEventMessage("");

    const payload = {
      user_id: userId,
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

    setEventMessage("Custom date added.");
  }

  async function removeCustomDate(id: string) {
    const existing = customDates.find((event) => event.id === id);
    if (!existing) return;

    setCustomDates((current) => current.filter((event) => event.id !== id));

    const { error } = await supabase
      .from("command_events")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

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
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                Personal Command Centre
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
                ⌘ COMMAND
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                Build your profile once, keep your planning in one place, and
                unlock deeper tracking automatically when you move onto a paid
                plan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                {isPremium ? "Pro active" : "Free plan"}
              </div>
              {!isPremium ? (
                <a
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white"
                >
                  <Crown className="h-4 w-4" />
                  Unlock Pro
                </a>
              ) : null}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-bold text-white">
                  {(profile.name || "U")[0]}
                </div>
                <div>
                  <div className="text-base font-semibold text-slate-950">
                    {profile.name || "Your profile"}
                  </div>
                  <div className="text-sm text-slate-500">
                    {profile.yearLevel} • {profile.state} • {profile.category}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowEdit((value) => !value)}
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
              >
                <Edit3 className="h-4 w-4" />
                {showEdit ? "Close editor" : "Edit profile"}
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Pathway
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-950">
                  {profile.pathway}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Target unis
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-950">
                  {profile.targetUnis.length}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Readiness
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-950">
                  {readinessBand}/100
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-center gap-2 text-slate-950">
              <Target className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold">What Command does</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p>
                Free users can build a real profile, save custom dates, and use
                Command as their planning base.
              </p>
              <p>
                Paid users unlock target-university tracking, weekly progress,
                streaks, priority actions, scholarships, accommodation, and
                experiences.
              </p>
            </div>
          </div>
        </section>

        {showEdit ? (
          <SectionCard
            title="Edit your Command profile"
            description="This is saved to your account so your dashboard feels personal from the start."
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
              <label className="space-y-2 md:col-span-3">
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
                Target universities
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Save these now. They become much more powerful once Pro is
                unlocked.
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

        <SectionCard
          title="Application readiness"
          description="A quick snapshot of where you currently stand."
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
        >
          <div className="grid gap-4 lg:grid-cols-4">
            <StatCard
              title="ATAR"
              value={String(profile.atar)}
              caption="Current estimate"
              tone="border-blue-200 bg-blue-50 text-blue-950"
            />
            <StatCard
              title="UCAT"
              value={String(profile.ucat)}
              caption="Best score so far"
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
          </div>
        </SectionCard>

        <div className="grid gap-4 xl:grid-cols-2">
          <SectionCard
            title="Key dates calendar"
            description="Save personal checkpoints alongside core med admissions dates."
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
                    className={cn("rounded-2xl border p-4", EVENT_STYLES[event.type])}
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
                    className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
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

          <SectionCard
            title="Core planning view"
            description="A simple place to keep your direction clear even on the free plan."
            icon={<TrendingUp className="h-5 w-5 text-violet-600" />}
          >
            <div className="grid gap-4 sm:grid-cols-2">
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
                    profile.targetUnis.slice(0, 6).map((uni) => (
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
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ProCard
            title="Target universities"
            description="Competitiveness tracking against your shortlist."
            icon={<Target className="h-5 w-5" />}
            unlocked={isPremium}
          >
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-950">
              <div className="text-sm font-semibold">Shortlisted universities</div>
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
                  <span className="font-medium text-slate-700">UCAT momentum</span>
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
            title="Streak tracker"
            description="Stay consistent and keep your momentum visible."
            icon={<Flame className="h-5 w-5" />}
            unlocked={isPremium}
          >
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                <div className="text-xl font-bold">1-week streak</div>
              </div>
              <p className="mt-2 text-sm">
                Keep showing up. Command will reward consistency over intensity.
              </p>
            </div>
          </ProCard>

          <ProCard
            title="Priority actions"
            description="The highest-value next steps based on your profile."
            icon={<Sparkles className="h-5 w-5" />}
            unlocked={isPremium}
          >
            <div className="space-y-3">
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
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  No urgent actions right now.
                </div>
              )}
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
                Start building your funding plan in one place.
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
        </div>
      </div>
    </main>
  );
}