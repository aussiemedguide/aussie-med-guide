"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Sparkles,
  CheckCircle2,
  Info,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Trophy,
  ChevronRight,
  Wand2,
  CalendarRange,
} from "lucide-react";

type MainTab = "ucat" | "offers" | "tips";
type YearTab = "year10" | "year11" | "year12";
type TacKey = "vtac" | "satac" | "qtac" | "uac" | "tisc";

type LinkItem = { label: string; href: string };

type EventItem = {
  title: string;
  date: string;
  note?: string;
  tone: string;
};

type OfferRoundGroup = {
  key: TacKey;
  label: string;
  pill: string;
  border: string;
  soft: string;
  rounds: { name: string; date: string; note?: string }[];
};

type TimelineBlock = {
  label: string;
  badge: string;
  tone: string;
  points: string[];
};

const tacPills: { key: TacKey; label: string; active: string }[] = [
  { key: "vtac", label: "VTAC", active: "from-blue-600 to-indigo-600" },
  { key: "satac", label: "SATAC", active: "from-emerald-600 to-teal-600" },
  { key: "qtac", label: "QTAC", active: "from-rose-600 to-orange-500" },
  { key: "uac", label: "UAC", active: "from-cyan-600 to-teal-500" },
  { key: "tisc", label: "TISC", active: "from-violet-600 to-fuchsia-500" },
];

const ucatLinks: LinkItem[] = [
  { label: "Registration & booking", href: "https://www.ucat.edu.au/register/booking-your-test/" },
  { label: "Test cycle dates", href: "https://www.ucat.edu.au/about-ucat-anz/ucat-anz-test-cycle/" },
  { label: "Essentials guide", href: "https://www.ucat.edu.au/media/1589/ucat-anz-essentials-guide-2026.pdf" },
];

const ucatEvents: EventItem[] = [
  { title: "Concession scheme opens", date: "16 Feb 2026", tone: "border-slate-200 bg-slate-50" },
  { title: "Access arrangements open", date: "16 Feb 2026", tone: "border-slate-200 bg-slate-50" },
  { title: "UCAT ANZ booking opens", date: "3 Mar 2026", tone: "border-slate-200 bg-slate-50" },
  { title: "Concession deadline", date: "11 May 2026", tone: "border-rose-300 bg-rose-50" },
  { title: "Access arrangements deadline", date: "15 May 2026", tone: "border-rose-300 bg-rose-50" },
  { title: "Booking deadline", date: "15 May 2026", tone: "border-rose-300 bg-rose-50" },
  { title: "Late booking deadline", date: "29 May 2026", tone: "border-rose-300 bg-rose-50" },
  { title: "Final late booking deadline", date: "5 Jun 2026", tone: "border-rose-300 bg-rose-50" },
  { title: "Testing period", date: "1 Jul – 5 Aug 2026", tone: "border-violet-300 bg-violet-50" },
  {
    title: "Optimal testing window",
    date: "Term 2/3 holidays",
    note: "Between IA2 and IA3 for many students to reduce stress.",
    tone: "border-amber-300 bg-amber-50",
  },
  { title: "Results released", date: "Early Sep 2026", tone: "border-emerald-300 bg-emerald-50" },
];

const offerRoundGroups: OfferRoundGroup[] = [
  {
    key: "vtac",
    label: "VTAC Offer Rounds 2026",
    pill: "bg-blue-600 text-white",
    border: "border-blue-300",
    soft: "bg-blue-50",
    rounds: [
      { name: "November Round", date: "18 Nov 2025", note: "Early offers" },
      { name: "December Round", date: "23 Dec 2025", note: "Major early offers" },
      { name: "January Round 1", date: "13 Jan 2026" },
      { name: "January Round 2", date: "27 Jan 2026" },
      { name: "February Round 1", date: "3 Feb 2026", note: "Main medicine offers" },
      { name: "February Round 2", date: "10 Feb 2026" },
      { name: "February Round 3", date: "17 Feb 2026" },
    ],
  },
  {
    key: "uac",
    label: "UAC Offer Rounds 2026",
    pill: "bg-emerald-600 text-white",
    border: "border-emerald-300",
    soft: "bg-emerald-50",
    rounds: [
      { name: "April Round 1", date: "17 Apr 2025" },
      { name: "May Round 1", date: "8 May 2025" },
      { name: "May Round 2", date: "22 May 2025" },
      { name: "December Round", date: "23 Dec 2025", note: "Major offers" },
      { name: "January Early", date: "9 Jan 2026" },
      { name: "January Main", date: "23 Jan 2026", note: "Main medicine offers" },
      { name: "January / February", date: "6 Feb 2026" },
    ],
  },
  {
    key: "qtac",
    label: "QTAC Offer Rounds 2026",
    pill: "bg-rose-600 text-white",
    border: "border-rose-300",
    soft: "bg-rose-50",
    rounds: [
      { name: "Early Offer", date: "14 Aug 2025" },
      { name: "October Round", date: "2 Oct 2025" },
      { name: "November Round", date: "21 Nov 2025" },
      { name: "Summer Round", date: "23 Dec 2025" },
      { name: "January Main", date: "15 Jan 2026", note: "Major medicine offers" },
      { name: "January 22", date: "22 Jan 2026" },
      { name: "January 29", date: "29 Jan 2026" },
      { name: "February 3", date: "3 Feb 2026" },
      { name: "February 5", date: "5 Feb 2026" },
      { name: "February 10", date: "10 Feb 2026" },
      { name: "February 12", date: "12 Feb 2026" },
    ],
  },
  {
    key: "satac",
    label: "SATAC Offer Rounds 2026",
    pill: "bg-teal-600 text-white",
    border: "border-teal-300",
    soft: "bg-teal-50",
    rounds: [
      { name: "December Round", date: "20 Dec 2025", note: "Early offers" },
      { name: "January Round 1", date: "17 Jan 2026", note: "Main medicine offers" },
      { name: "January Round 2", date: "31 Jan 2026" },
      { name: "February Round", date: "14 Feb 2026" },
    ],
  },
  {
    key: "tisc",
    label: "TISC Offer Rounds 2026",
    pill: "bg-violet-600 text-white",
    border: "border-violet-300",
    soft: "bg-violet-50",
    rounds: [
      { name: "December Round", date: "22 Dec 2025", note: "Main offers" },
      { name: "January Round 1", date: "13 Jan 2026", note: "Medicine offers" },
      { name: "January Round 2", date: "27 Jan 2026" },
      { name: "February Round", date: "10 Feb 2026" },
    ],
  },
];

const yearTimelines: Record<YearTab, TimelineBlock[]> = {
  year10: [
    {
      label: "January – March",
      badge: "Year 10",
      tone: "sky",
      points: [
        "Reflect on what subjects you actually enjoy, not just what you are good at.",
        "Light research into what medicine and other health/STEM pathways actually involve.",
        "Build basic study routines around consistency, not cramming.",
      ],
    },
    {
      label: "April – June",
      badge: "Year 10",
      tone: "emerald",
      points: [
        "Focus on doing well in school because habits matter more than marks right now.",
        "Talk to older students, teachers, or a careers counsellor once.",
        "Start thinking about Year 11 subject selection, especially sciences and maths if considering med.",
      ],
    },
    {
      label: "June – July (Holidays)",
      badge: "Holidays",
      tone: "violet",
      points: [
        "Short exposure activities can help: hospital info sessions, first aid, STEM programs, volunteering.",
        "Read or watch realistic day-in-the-life content from doctors and medical students.",
      ],
    },
    {
      label: "July – September",
      badge: "Prep",
      tone: "amber",
      points: [
        "Finalise Year 11 subjects.",
        "If interested in med, Chemistry is strongly recommended and Maths Methods is often helpful.",
        "Keep building consistency in study without overdoing it.",
      ],
    },
    {
      label: "October – December",
      badge: "Reflection",
      tone: "rose",
      points: [
        "End-of-year exams: try your best, do not panic.",
        "Reflect on what worked and what did not.",
        "Optional: take on leadership, part-time work, or volunteering if it genuinely helps growth.",
      ],
    },
  ],
  year11: [
    {
      label: "January – March",
      badge: "Year 11",
      tone: "sky",
      points: [
        "Reset study systems for a new standard.",
        "Learn how ATAR is actually calculated in your state.",
        "Light UCAT awareness only: what it is and what it tests, not full prep yet.",
      ],
    },
    {
      label: "April – June",
      badge: "Build",
      tone: "emerald",
      points: [
        "Focus hard on Year 11 results because they build habits and confidence.",
        "Start very light reading-based skills like comprehension, timing, and logic puzzles.",
      ],
    },
    {
      label: "June – July (Holidays)",
      badge: "Optional",
      tone: "violet",
      points: [
        "Try a tiny amount of UCAT-style work just to understand the format.",
        "Do something non-academic too: sport, work, volunteering.",
        "Reflect on whether med still feels like the right fit.",
      ],
    },
    {
      label: "July – September",
      badge: "Awareness",
      tone: "amber",
      points: [
        "Maintain strong school performance.",
        "Begin informal UCAT familiarisation: timing awareness, question types, pace.",
        "Look into early-entry schemes, adjustment factors, and rural eligibility if relevant.",
      ],
    },
    {
      label: "October – November",
      badge: "Exams",
      tone: "rose",
      points: [
        "Year 11 exams matter, but they are not make-or-break.",
        "Post-exams: reflect honestly on workload tolerance and strengths.",
      ],
    },
    {
      label: "December (Big one)",
      badge: "Launch",
      tone: "slate",
      points: [
        "Ideal time to start UCAT prep lightly, no more than 30–60 minutes per day.",
        "Finalise Year 12 goals around academics, wellbeing, and balance.",
      ],
    },
  ],
  year12: [
    {
      label: "January – March",
      badge: "Term 1",
      tone: "sky",
      points: [
        "Research universities and entry requirements properly.",
        "Register for UCAT ANZ when registrations open.",
        "Start proper UCAT preparation.",
        "Begin gathering rural or access evidence if applicable.",
      ],
    },
    {
      label: "April – June",
      badge: "Term 2",
      tone: "emerald",
      points: [
        "Book your UCAT test date, ideally for the holidays.",
        "Increase UCAT practice intensity.",
        "Start TAC applications where relevant.",
        "Submit early med-specific forms if needed.",
      ],
    },
    {
      label: "June – July",
      badge: "Holidays",
      tone: "violet",
      points: [
        "Optimal window for many students to sit UCAT between IA2 and IA3 style pressure points.",
        "Reduce stress by testing before school intensity rises again.",
        "Recover properly before Term 3 if you sit early.",
      ],
    },
    {
      label: "July – September",
      badge: "Term 3",
      tone: "amber",
      points: [
        "Complete UCAT if not already done.",
        "Finalise TAC preferences strategically.",
        "Submit rural forms and evidence.",
        "Receive UCAT results in September.",
      ],
    },
    {
      label: "October – November",
      badge: "Term 4",
      tone: "rose",
      points: [
        "Final exams: focus on ATAR and school performance.",
        "Interview invitations often land around this period depending on school.",
        "Prepare for MMI or panel interviews.",
        "Use change-of-preference periods properly.",
      ],
    },
    {
      label: "December – February",
      badge: "Offers",
      tone: "slate",
      points: [
        "Early offers usually start in December.",
        "Main medicine offers often cluster in January.",
        "Accept your offer, plan relocation if needed, and get ready for uni.",
      ],
    },
  ],
};

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function getTimelineTone(tone: string) {
  const map: Record<
    string,
    {
      rail: string;
      dot: string;
      strip: string;
      ring: string;
      badge: string;
      card: string;
      bullet: string;
      text: string;
      muted: string;
    }
  > = {
    sky: {
      rail: "bg-sky-300",
      dot: "bg-sky-500",
      strip: "from-sky-500 to-cyan-500",
      ring: "ring-sky-100",
      badge: "bg-sky-50 text-sky-700 border-sky-200",
      card: "border-sky-200 bg-white",
      bullet: "bg-sky-500",
      text: "text-slate-950",
      muted: "text-slate-700",
    },
    emerald: {
      rail: "bg-emerald-300",
      dot: "bg-emerald-500",
      strip: "from-emerald-500 to-teal-500",
      ring: "ring-emerald-100",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      card: "border-emerald-200 bg-white",
      bullet: "bg-emerald-500",
      text: "text-slate-950",
      muted: "text-slate-700",
    },
    violet: {
      rail: "bg-violet-300",
      dot: "bg-violet-500",
      strip: "from-violet-500 to-fuchsia-500",
      ring: "ring-violet-100",
      badge: "bg-violet-50 text-violet-700 border-violet-200",
      card: "border-violet-200 bg-white",
      bullet: "bg-violet-500",
      text: "text-slate-950",
      muted: "text-slate-700",
    },
    amber: {
      rail: "bg-amber-300",
      dot: "bg-amber-500",
      strip: "from-amber-500 to-yellow-500",
      ring: "ring-amber-100",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      card: "border-amber-200 bg-white",
      bullet: "bg-amber-500",
      text: "text-slate-950",
      muted: "text-slate-700",
    },
    rose: {
      rail: "bg-rose-300",
      dot: "bg-rose-500",
      strip: "from-rose-500 to-pink-500",
      ring: "ring-rose-100",
      badge: "bg-rose-50 text-rose-700 border-rose-200",
      card: "border-rose-200 bg-white",
      bullet: "bg-rose-500",
      text: "text-slate-950",
      muted: "text-slate-700",
    },
    slate: {
      rail: "bg-slate-500",
      dot: "bg-slate-900",
      strip: "from-slate-800 to-slate-950",
      ring: "ring-slate-200",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      card: "border-slate-300 bg-slate-950",
      bullet: "bg-white",
      text: "text-white",
      muted: "text-slate-200",
    },
  };

  return map[tone] ?? map.sky;
}

function ExternalButton({ href, label }: LinkItem) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-white/85 px-4 py-2.5 text-sm font-medium text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50"
    >
      <span>{label}</span>
      <ExternalLink className="h-4 w-4" />
    </Link>
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
        "rounded-3xl border border-slate-200 bg-white/88 shadow-sm backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

function CoolDisclaimer() {
  return (
    <div className="rounded-3xl border border-amber-300 bg-linear-to-r from-amber-50 via-white to-orange-50 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
          <ShieldCheck className="h-5 w-5 text-amber-700" />
        </div>
        <div>
          <h3 className="text-lg font-black tracking-tight text-slate-950">
            Live dates beat static screenshots
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            This page should help you think ahead, not make you trust stale screenshots. Dates,
            rounds, and deadlines can move. Always verify with the official TAC or UCAT source
            before acting, especially near closing dates.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm">
            <Wand2 className="h-4 w-4" />
            Use this as your dashboard, not your final legal notice
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineRoadmap({ activeYear }: { activeYear: YearTab }) {
  const blocks = yearTimelines[activeYear];

  return (
    <div className="relative pl-0 md:pl-8">
      <div className="absolute left-[1.1rem] top-1 hidden h-[calc(100%-2rem)] w-px bg-linear-to-b from-slate-200 via-slate-200 to-slate-100 md:block" />

      <div className="space-y-5">
        {blocks.map((block, index) => {
          const tone = getTimelineTone(block.tone);
          const isDark = block.tone === "slate";

          return (
            <div key={`${activeYear}-${block.label}`} className="relative">
              <div
                className={cx(
                  "absolute left-0 top-8 hidden h-9 w-9 items-center justify-center rounded-full border-4 border-white shadow-sm md:flex",
                  tone.dot,
                  tone.ring
                )}
              >
                <div className="h-2.5 w-2.5 rounded-full bg-white/90" />
              </div>

              <div className="md:pl-10">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, delay: index * 0.03 }}
                  className={cx(
                    "relative overflow-hidden rounded-3xl border shadow-sm",
                    tone.card
                  )}
                >
                  <div className={cx("h-1.5 w-full bg-linear-to-r", tone.strip)} />

                  <div className="p-6 sm:p-7">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={cx(
                            "inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] shadow-sm",
                            tone.badge
                          )}
                        >
                          {block.badge}
                        </span>
                        <h3
                          className={cx(
                            "text-2xl font-black tracking-tight",
                            tone.text
                          )}
                        >
                          {block.label}
                        </h3>
                      </div>

                      <span
                        className={cx(
                          "inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold",
                          isDark
                            ? "border-white/15 bg-white/10 text-slate-200"
                            : "border-slate-200 bg-slate-50 text-slate-500"
                        )}
                      >
                        Stage {index + 1}
                      </span>
                    </div>

                    <ul className="space-y-3.5">
                      {block.points.map((point) => (
                        <li
                          key={point}
                          className={cx(
                            "flex items-start gap-3 text-[15px] leading-7",
                            tone.muted
                          )}
                        >
                          <span
                            className={cx(
                              "mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full",
                              tone.bullet
                            )}
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OffersSelectionPage() {
  const [activeTab, setActiveTab] = useState<MainTab>("ucat");
  const [activeYear, setActiveYear] = useState<YearTab>("year11");

  const mainTabs: { key: MainTab; label: string }[] = [
    { key: "ucat", label: "UCAT 2026" },
    { key: "offers", label: "Offer Rounds" },
    { key: "tips", label: "Timeline Tips" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_right,rgba(168,85,247,0.08),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f6f7fb_42%,#f8fafc_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
            Selection Timeline
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Dates, rounds, and what to do when
          </span>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/82 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-emerald-500 to-violet-500" />
          <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-sky-100 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-violet-100 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-4xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 to-sky-600 text-white shadow-lg shadow-emerald-200">
                    <CalendarDays className="h-6 w-6" />
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    Offers & Selection
                  </h1>
                </div>
                <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                  Key dates for UCAT, applications, offer rounds, and what students should be
                  doing in Year 10, 11, and 12.
                </p>
              </div>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {tacPills.map((pill) => (
                <span
                  key={pill.key}
                  className={cx(
                    "rounded-full bg-linear-to-r px-4 py-2 text-sm font-bold text-white shadow-sm",
                    pill.active
                  )}
                >
                  {pill.label}
                </span>
              ))}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-2 shadow-inner">
              <div className="grid grid-cols-3 gap-2">
                {mainTabs.map((tab) => {
                  const isActive = tab.key === activeTab;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={cx(
                        "relative overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold transition",
                        isActive
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="offers-tab-pill"
                          className="absolute inset-0 rounded-2xl border border-slate-200 bg-white"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="mt-6 space-y-5"
              >
                {activeTab === "ucat" && (
                  <div className="space-y-5">
                    <SoftCard className="border-violet-300 p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-950">
                          What is the UCAT ANZ?
                        </h2>
                      </div>
                      <p className="text-sm leading-7 text-slate-700">
                        The UCAT ANZ is a computer-based admissions test used by many Australian
                        and New Zealand medical, dental, and clinical science programs. You sit it
                        in the year before your admissions cycle and use the score for applications
                        in that cycle.
                      </p>

                      <div className="mt-5 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-3xl border border-violet-300 bg-violet-50 p-5">
                          <h3 className="text-lg font-bold text-violet-950">Eligibility</h3>
                          <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                            <li>In your final year of secondary school or higher</li>
                            <li>Have completed secondary school</li>
                            <li>Commenced or completed an undergraduate degree</li>
                            <li className="font-medium text-violet-800">
                              You cannot sit UCAT ANZ more than once in the same year.
                            </li>
                          </ul>
                        </div>
                        <div className="rounded-3xl border border-sky-300 bg-sky-50 p-5">
                          <h3 className="text-lg font-bold text-sky-950">Registration process</h3>
                          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-700">
                            <li>Create a Pearson VUE account</li>
                            <li>Receive your UCAT ANZ ID</li>
                            <li>Book a test date and centre</li>
                            <li>Pay the registration fee</li>
                            <li>Apply for access arrangements if needed</li>
                          </ol>
                        </div>
                      </div>

                      <div className="mt-5 rounded-3xl border border-amber-300 bg-amber-50 p-5">
                        <h3 className="text-lg font-bold text-amber-950">Top tips</h3>
                        <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                          <li className="flex gap-2">
                            <Lightbulb className="mt-1 h-4 w-4 text-amber-600" />
                            Register early because test slots can fill fast, especially in regional
                            centres.
                          </li>
                          <li className="flex gap-2">
                            <Lightbulb className="mt-1 h-4 w-4 text-amber-600" />
                            Use the holidays as your ideal testing window where possible.
                          </li>
                          <li className="flex gap-2">
                            <Lightbulb className="mt-1 h-4 w-4 text-amber-600" />
                            Apply for concessions or access arrangements before booking if relevant.
                          </li>
                          <li className="flex gap-2">
                            <Lightbulb className="mt-1 h-4 w-4 text-amber-600" />
                            Keep your UCAT ANZ ID ready for university applications.
                          </li>
                        </ul>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        {ucatLinks.map((link) => (
                          <ExternalButton key={link.href} {...link} />
                        ))}
                      </div>
                    </SoftCard>

                    <SoftCard className="p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                          <CalendarRange className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-950">
                          UCAT ANZ 2026 Key Dates
                        </h2>
                      </div>

                      <div className="space-y-3">
                        {ucatEvents.map((event) => (
                          <div
                            key={event.title}
                            className={cx("rounded-3xl border px-4 py-4", event.tone)}
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="font-semibold text-slate-950">{event.title}</p>
                                {event.note ? (
                                  <p className="mt-1 text-sm text-slate-600">{event.note}</p>
                                ) : null}
                              </div>
                              <span className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
                                {event.date}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </SoftCard>

                    <CoolDisclaimer />
                  </div>
                )}

                {activeTab === "offers" && (
                  <div className="space-y-5">
                    {offerRoundGroups.map((group) => (
                      <SoftCard key={group.key} className={cx("border-2 p-6", group.border)}>
                        <div className="mb-4 flex items-center gap-3">
                          <span
                            className={cx(
                              "rounded-full px-3 py-1 text-xs font-bold shadow-sm",
                              group.pill
                            )}
                          >
                            {group.key.toUpperCase()}
                          </span>
                          <h2 className="text-2xl font-black tracking-tight text-slate-950">
                            {group.label}
                          </h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          {group.rounds.map((round) => (
                            <div
                              key={`${group.key}-${round.name}`}
                              className={cx("rounded-3xl border p-4", group.border, group.soft)}
                            >
                              <p className="font-semibold text-slate-950">{round.name}</p>
                              <p className="mt-1 text-lg font-black text-slate-950">{round.date}</p>
                              {round.note ? (
                                <p className="mt-1 text-sm text-slate-600">{round.note}</p>
                              ) : null}
                            </div>
                          ))}
                        </div>
                        <p className="mt-4 text-sm text-slate-500">
                          Note: most medicine offers typically cluster around January rounds.
                        </p>
                      </SoftCard>
                    ))}

                    <div className="rounded-3xl border border-amber-300 bg-amber-50 p-5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-amber-700">
                          <Info className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-amber-950">
                            How preferences can affect the apparent ATAR threshold
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-slate-700">
                            Preference order can change what offer you actually receive. Published
                            thresholds are often simplified snapshots, but actual offers can be
                            shaped by ranking, category, interview performance, and the order in
                            which you place courses.
                          </p>
                        </div>
                      </div>
                    </div>

                    <CoolDisclaimer />
                  </div>
                )}

                {activeTab === "tips" && (
                  <div className="space-y-5">
                    <SoftCard className="p-6">
                      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                              <Trophy className="h-5 w-5" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-950">
                              Medicine Application Timeline
                            </h2>
                          </div>
                          <p className="max-w-2xl text-sm leading-7 text-slate-600">
                            Know what matters in each year level, when to ramp up, and when to stay
                            calm instead of doing too much too early.
                          </p>
                        </div>
                      </div>

                      <div className="mb-6 flex flex-wrap gap-2">
                        {[
                          { key: "year10", label: "Year 10" },
                          { key: "year11", label: "Year 11" },
                          { key: "year12", label: "Year 12" },
                        ].map((tab) => {
                          const isActive = tab.key === activeYear;

                          return (
                            <button
                              key={tab.key}
                              onClick={() => setActiveYear(tab.key as YearTab)}
                              className={cx(
                                "rounded-2xl px-5 py-3 text-sm font-semibold transition",
                                isActive
                                  ? "bg-emerald-600 text-white shadow-sm"
                                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              )}
                            >
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>

                      <TimelineRoadmap activeYear={activeYear} />
                    </SoftCard>

                    <div className="rounded-3xl border border-emerald-300 bg-emerald-50 p-5 shadow-sm">
                      <h3 className="text-lg font-black tracking-tight text-emerald-950">
                        Key tips
                      </h3>
                      <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                        <li className="flex gap-2">
                          <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-600" />
                          Most medicine offers tend to cluster in January.
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-600" />
                          Keep your preferences up to date until the final change deadline.
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-600" />
                          Some universities do not require UCAT, so always verify school-by-school.
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-600" />
                          Rural pathways can run on earlier or separate evidence timelines.
                        </li>
                      </ul>
                    </div>

                    <CoolDisclaimer />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}