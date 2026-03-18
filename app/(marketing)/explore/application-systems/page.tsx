"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  CircleHelp,
  ArrowRight,
  ExternalLink,
  Info,
  ChevronRight,
  ShieldCheck,
  Wand2,
  ListOrdered,
} from "lucide-react";

type SystemKey = "vtac" | "uac" | "qtac" | "satac" | "tisc";

type LinkItem = {
  label: string;
  href: string;
};

type SystemCard = {
  key: SystemKey;
  short: string;
  full: string;
  region: string;
  accent: string;
  soft: string;
  border: string;
  glow: string;
  summary: string;
  whatItDoes: string;
  preferenceTitle: string;
  preferences: string[];
  mistakes: string[];
  notHandled: string[];
  critical: string;
  links: LinkItem[];
};

const systems: SystemCard[] = [
  {
    key: "vtac",
    short: "VTAC",
    full: "VTAC (Victoria)",
    region: "Victoria",
    accent: "from-blue-600 via-indigo-600 to-sky-500",
    soft: "bg-blue-50",
    border: "border-blue-300",
    glow: "shadow-blue-200/60",
    summary: "How Victoria's admissions centre actually works — and why preference order matters.",
    whatItDoes:
      "VTAC processes undergraduate applications for Victorian universities. It collects your preferences, lets you change their order, and then helps route you toward the highest preference you are eligible for in each offer round.",
    preferenceTitle: "How preferences work (critical)",
    preferences: [
      "You can list up to 8 course preferences.",
      "Offers are made to your highest eligible preference, not your most realistic one unless you ordered it there.",
      "If you are eligible for multiple courses, VTAC still only offers the highest preference available to you in that round.",
      "Preference order is strategic. Never put a ‘backup’ above a course you would actually rather take.",
    ],
    mistakes: [
      "Listing preferences alphabetically instead of in true order of desire.",
      "Putting a ‘safe’ option first because you think you can decline it later without consequence.",
      "Forgetting that you usually receive one offer per round, not a bundle of options.",
      "Missing separate scholarship, SEAS, or supplemental deadlines.",
    ],
    notHandled: [
      "University interview assessment itself",
      "Some rural or access evidence submitted directly to institutions",
      "UCAT registration and testing",
      "Every med-school specific supplemental process",
    ],
    critical:
      "Preferences are strategic, not decorative. The list order determines which offer you receive. VTAC is not asking ‘what might you accept?’ It is asking ‘what do you want most, in order?’",
    links: [
      { label: "VTAC home", href: "https://vtac.edu.au/" },
      { label: "Change of preference", href: "https://vtac.edu.au/courses/cop" },
      { label: "Course applications", href: "https://vtac.edu.au/courses" },
    ],
  },
  {
    key: "uac",
    short: "UAC",
    full: "UAC (NSW/ACT)",
    region: "NSW / ACT",
    accent: "from-emerald-600 via-teal-600 to-green-500",
    soft: "bg-emerald-50",
    border: "border-emerald-300",
    glow: "shadow-emerald-200/60",
    summary: "How UAC preferences and medicine timelines really work for NSW and ACT applicants.",
    whatItDoes:
      "UAC processes applications for NSW and ACT universities. It lets applicants rank course preferences, manage documents, and receive offers based on the highest preference for which they are eligible in a given round.",
    preferenceTitle: "How preferences work (critical)",
    preferences: [
      "Undergraduate domestic applicants can list up to 5 course preferences, while some other applicant groups can list more.",
      "Your first preference should be the course you most want, not the one you think is safest.",
      "You are considered in order down your list until the system finds the highest eligible option available to you.",
      "Changing preferences later can matter, but deadlines and earlier med-specific processes still bite if missed.",
    ],
    mistakes: [
      "Not understanding that medicine interview systems may sit partly outside the generic UAC flow.",
      "Treating Greater Western Sydney or access pathways as if they are automatic.",
      "Assuming all NSW medicine schools use the same selection steps.",
      "Forgetting that some supplemental processes live with the university, not UAC.",
    ],
    notHandled: [
      "Every university-specific interview workflow",
      "All access scheme evidence in identical ways",
      "Direct school-specific portfolio or supplemental requirements",
      "UCAT registration and sitting",
    ],
    critical:
      "UAC does not rescue a bad preference order. The safest list is the one that reflects your real priorities while still respecting actual competitiveness and deadlines.",
    links: [
      { label: "UAC home", href: "https://www.uac.edu.au/" },
      { label: "Selecting preferences", href: "https://www.uac.edu.au/future-applicants/how-to-apply-for-uni/selecting-your-course-preferences" },
      { label: "Medicine key dates", href: "https://www.uac.edu.au/current-applicants/undergraduate-applications-and-offers/medicine-key-dates" },
    ],
  },
  {
    key: "qtac",
    short: "QTAC",
    full: "QTAC (Queensland)",
    region: "Queensland",
    accent: "from-rose-600 via-red-500 to-orange-500",
    soft: "bg-rose-50",
    border: "border-rose-300",
    glow: "shadow-rose-200/60",
    summary: "Queensland preferences, selection rank logic, and the common traps students miss.",
    whatItDoes:
      "QTAC manages tertiary application services in Queensland. It handles your course preferences and uses your ATAR or selection rank in the context of the courses on your list to determine the highest eligible offer you can receive.",
    preferenceTitle: "How preferences work (critical)",
    preferences: [
      "Your preferences are a wish list and should be ordered by what you genuinely most want.",
      "QTAC lines up your list against your selection rank and the courses’ requirements.",
      "Adding more sensible preferences can improve your chances of receiving an offer.",
      "Some medicine-related pathways and direct-entry structures still involve school-specific rules beyond QTAC alone.",
    ],
    mistakes: [
      "Assuming every Queensland medicine route behaves identically inside QTAC.",
      "Ignoring separate rural, interview, or direct-entry nuances depending on university.",
      "Forgetting that Bond or school-specific direct processes may sit partly outside the usual assumption set.",
      "Not checking current key dates before late preference changes.",
    ],
    notHandled: [
      "Every direct university-specific step",
      "All medicine interview scheduling details",
      "UCAT registration and testing",
      "Every institution-specific eligibility nuance",
    ],
    critical:
      "QTAC helps order and process your possibilities. It does not decide your dream list for you. A weak preference list can quietly waste a strong rank.",
    links: [
      { label: "QTAC home", href: "https://www.qtac.edu.au/" },
      { label: "Application services", href: "https://www.qtac.edu.au/application-services/" },
      { label: "Key info and dates", href: "https://www.qtac.edu.au/key-info/" },
    ],
  },
  {
    key: "satac",
    short: "SATAC",
    full: "SATAC (South Australia/NT)",
    region: "South Australia / NT",
    accent: "from-amber-600 via-orange-500 to-yellow-500",
    soft: "bg-amber-50",
    border: "border-amber-300",
    glow: "shadow-amber-200/60",
    summary: "SATAC preference logic, SA/NT quirks, and how to avoid missing important side processes.",
    whatItDoes:
      "SATAC processes applications for SA and many NT tertiary pathways. It handles application submission, supporting documents in many cases, preference order, and offer management across participating institutions.",
    preferenceTitle: "How preferences work (critical)",
    preferences: [
      "Undergraduate and postgraduate applicants can list up to 6 preferences in one application.",
      "Offers go to the highest eligible preference available to you in the round.",
      "SATAC can involve both undergraduate and some postgraduate pathways, so details matter.",
      "Preference changes still need to respect closing dates and institution-specific requirements.",
    ],
    mistakes: [
      "Thinking Adelaide and Flinders medicine processes are identical just because SATAC is involved.",
      "Missing supplemental portfolio or institution-specific steps for some programs.",
      "Assuming SATAC alone covers every med-admissions requirement.",
      "Changing preferences too late and assuming nothing strategic changed.",
    ],
    notHandled: [
      "All interview invitations and university-run assessments",
      "Every school-specific portfolio or supplemental form",
      "UCAT registration and testing",
      "All direct institutional follow-up requirements",
    ],
    critical:
      "SATAC should absolutely light up when clicked — and so should your understanding that preference order still decides your best available offer. It is not a passive form. It is a ranking engine.",
    links: [
      { label: "SATAC home", href: "https://www.satac.edu.au/" },
      { label: "How to apply", href: "https://www.satac.edu.au/how-to-apply" },
      { label: "Offers and enrolment", href: "https://www.satac.edu.au/offers-and-enrolment" },
    ],
  },
  {
    key: "tisc",
    short: "TISC",
    full: "TISC (Western Australia)",
    region: "Western Australia",
    accent: "from-violet-600 via-purple-600 to-fuchsia-500",
    soft: "bg-violet-50",
    border: "border-violet-300",
    glow: "shadow-violet-200/60",
    summary: "How WA preferences work, why one offer still rules, and where students get tripped up.",
    whatItDoes:
      "TISC runs the joint WA university application system for participating institutions. It lets you choose and change preferences, and in offer rounds you receive the highest preference for which you are eligible and a place is available.",
    preferenceTitle: "How preferences work (critical)",
    preferences: [
      "You can choose up to 6 course preferences.",
      "Order matters. Your first preference should be what you most want to study.",
      "You are considered equally for lower preferences if you miss a higher one, but you still only receive the highest available offer.",
      "Changing preferences is possible before deadlines, and accepting an early offer does not necessarily lock you in.",
    ],
    mistakes: [
      "Treating WA medicine-related pathways as interchangeable when institutional differences still matter.",
      "Not checking earlier deadlines for highly competitive pathways.",
      "Confusing direct university early-offer language with the final TISC all-preference logic.",
      "Ignoring experience-based or alternate-entry details where relevant.",
    ],
    notHandled: [
      "Universities’ own eligibility decisions",
      "Every interview or supplemental assessment",
      "UCAT registration and testing",
      "All school-specific extra requirements beyond the central application",
    ],
    critical:
      "TISC is built to get you the highest preference possible, not to guess your priorities. If your list is wrong, the system can work perfectly and still give you the wrong outcome for you.",
    links: [
      { label: "TISC home", href: "https://www.tisc.edu.au/" },
      { label: "Choosing preferences", href: "https://www.tisc.edu.au/static/guide/university-admissions-preferences.tisc" },
      { label: "Offers guide", href: "https://www.tisc.edu.au/static/guide/admission-offers.tisc" },
    ],
  },
];

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function iconShadow(key: SystemKey) {
  switch (key) {
    case "vtac":
      return "shadow-blue-200";
    case "uac":
      return "shadow-emerald-200";
    case "qtac":
      return "shadow-rose-200";
    case "satac":
      return "shadow-amber-200";
    case "tisc":
      return "shadow-violet-200";
    default:
      return "shadow-blue-200";
  }
}

function ExternalButton({ href, label }: LinkItem) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white/80 px-3 py-2 text-sm font-medium text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50"
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
        "rounded-3xl border border-slate-200 bg-white/85 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

function CoolDisclaimer() {
  return (
    <div className="rounded-3xl border border-emerald-300 bg-linear-to-r from-emerald-50 via-white to-teal-50 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
          <ShieldCheck className="h-5 w-5 text-emerald-700" />
        </div>
        <div>
          <h3 className="text-lg font-black tracking-tight text-slate-950">
            Critical understanding
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            Preferences are strategic, not just a list. Every TAC is designed to give you the
            highest eligible preference available in that round. You do not “try” multiple schools
            at once and pick later. The list order quietly decides the outcome.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
            <Wand2 className="h-4 w-4" />
            Build the order like a strategy, not a scrapbook
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationSystemsPage() {
  const [activeSystem, setActiveSystem] = useState<SystemKey>("vtac");

  const active = useMemo(
    () => systems.find((system) => system.key === activeSystem) ?? systems[0],
    [activeSystem]
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_right,rgba(168,85,247,0.08),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f6f7fb_42%,#f8fafc_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
            Explore · Application Systems
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            <Sparkles className="h-3.5 w-3.5" />
            Preference order actually matters
          </span>
        </div>

        <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-violet-500" />
          <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-sky-100 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-violet-100 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-4xl">
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className={cx(
                      "flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br text-white shadow-lg transition-all duration-300",
                      active.accent,
                      iconShadow(active.key)
                    )}
                  >
                    <FileText className="h-7 w-7" />
                  </div>

                  <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    Understanding TAC Systems
                  </h1>
                </div>

                <p className="text-sm leading-7 text-slate-600 sm:text-base">
                  How Australia’s admissions centres actually work — and why preference order
                  matters more than most students realise.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-2 shadow-inner">
              <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                {systems.map((system) => {
                  const isActive = system.key === activeSystem;

                  return (
                    <button
                      key={system.key}
                      onClick={() => setActiveSystem(system.key)}
                      className={cx(
                        "relative overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold transition-all",
                        isActive
                          ? "text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]"
                          : "bg-white/60 text-slate-700 hover:bg-white hover:text-slate-950"
                      )}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="tac-active-pill"
                          className={cx("absolute inset-0 bg-linear-to-r", system.accent)}
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      ) : null}

                      <span className="relative z-10">{system.full}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="mt-6 space-y-5"
              >
                <SoftCard className={cx("overflow-hidden border-2", active.border)}>
                  <div className={cx("bg-linear-to-r px-6 py-6 text-white", active.accent)}>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90">
                          <ListOrdered className="h-3.5 w-3.5" />
                          Preference engine
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">{active.short}</h2>
                        <p className="mt-1 text-sm text-white/90">{active.region}</p>
                      </div>

                      <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                        {active.summary}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <section>
                      <div className="mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <h3 className="text-xl font-black tracking-tight text-slate-950">
                          What {active.short} actually does
                        </h3>
                      </div>
                      <p className="text-sm leading-7 text-slate-700">{active.whatItDoes}</p>
                    </section>

                    <div className="mt-5 rounded-[22px] border border-sky-300 bg-sky-50 p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-sky-700" />
                        <h3 className="text-lg font-black tracking-tight text-sky-950">
                          {active.preferenceTitle}
                        </h3>
                      </div>
                      <ul className="space-y-2 text-sm leading-7 text-slate-700">
                        {active.preferences.map((item) => (
                          <li key={item} className="flex gap-2">
                            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-sky-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 rounded-[22px] border border-rose-300 bg-rose-50 p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-rose-700" />
                        <h3 className="text-lg font-black tracking-tight text-rose-950">
                          Common mistakes (avoid these)
                        </h3>
                      </div>
                      <ul className="space-y-2 text-sm leading-7 text-slate-700">
                        {active.mistakes.map((item) => (
                          <li key={item} className="flex gap-2">
                            <CircleHelp className="mt-1 h-4 w-4 shrink-0 text-rose-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 rounded-[22px] border border-amber-300 bg-amber-50 p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <Info className="h-4 w-4 text-amber-700" />
                        <h3 className="text-lg font-black tracking-tight text-amber-950">
                          What {active.short} does not handle
                        </h3>
                      </div>
                      <ul className="space-y-2 text-sm leading-7 text-slate-700">
                        {active.notHandled.map((item) => (
                          <li key={item} className="flex gap-2">
                            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-amber-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={cx("mt-5 rounded-[22px] border p-5", active.border, active.soft)}>
                      <h3 className="text-lg font-black tracking-tight text-slate-950">
                        Critical understanding
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-700">{active.critical}</p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {active.links.map((link) => (
                        <ExternalButton key={link.href} {...link} />
                      ))}
                    </div>
                  </div>
                </SoftCard>

                <CoolDisclaimer />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}