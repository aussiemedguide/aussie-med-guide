"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Trophy,
  Sparkles,
  Info,
  ChevronDown,
  MapPin,
  Users,
  CheckCircle2,
  Search,
  ShieldCheck,
  Wand2,
  GraduationCap,
} from "lucide-react";

type TacKey = "all" | "vtac" | "satac" | "qtac" | "uac" | "tisc" | "direct";

type School = {
  rank: number;
  short: string;
  full: string;
  state: string;
  places: number;
  tac: Exclude<TacKey, "all">;
  noUcat?: boolean;
  note?: string;
  scoreBand: "gold" | "silver" | "bronze" | "standard";
};

type TacMeta = {
  label: string;
  active: string;
  inactive: string;
  badge: string;
};

const tacMeta: Record<TacKey, TacMeta> = {
  all: {
    label: "All Systems",
    active: "border-slate-900 bg-slate-900 text-white shadow-sm",
    inactive: "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
    badge: "bg-slate-700 text-white",
  },
  vtac: {
    label: "VTAC",
    active: "border-transparent bg-blue-600 text-white shadow-sm",
    inactive: "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100",
    badge: "bg-blue-600 text-white",
  },
  satac: {
    label: "SATAC",
    active: "border-transparent bg-emerald-600 text-white shadow-sm",
    inactive: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100",
    badge: "bg-emerald-600 text-white",
  },
  qtac: {
    label: "QTAC",
    active: "border-transparent bg-rose-600 text-white shadow-sm",
    inactive: "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100",
    badge: "bg-rose-600 text-white",
  },
  uac: {
    label: "UAC",
    active: "border-transparent bg-cyan-600 text-white shadow-sm",
    inactive: "border-cyan-200 bg-cyan-50 text-cyan-700 hover:border-cyan-300 hover:bg-cyan-100",
    badge: "bg-cyan-600 text-white",
  },
  tisc: {
    label: "TISC",
    active: "border-transparent bg-violet-600 text-white shadow-sm",
    inactive: "border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-300 hover:bg-violet-100",
    badge: "bg-violet-600 text-white",
  },
  direct: {
    label: "Direct",
    active: "border-transparent bg-slate-500 text-white shadow-sm",
    inactive: "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100",
    badge: "bg-slate-500 text-white",
  },
};

const schools: School[] = [
  { rank: 1, short: "Sydney", full: "University of Sydney", state: "NSW", places: 280, tac: "uac", noUcat: true, scoreBand: "gold" },
  { rank: 1, short: "Melbourne", full: "University of Melbourne", state: "VIC", places: 350, tac: "vtac", noUcat: true, scoreBand: "gold" },
  { rank: 2, short: "Monash", full: "Monash University", state: "VIC", places: 300, tac: "vtac", scoreBand: "silver" },
  { rank: 3, short: "ANU", full: "Australian National University", state: "ACT", places: 90, tac: "uac", scoreBand: "gold" },
  { rank: 4, short: "UQ", full: "University of Queensland", state: "QLD", places: 490, tac: "qtac", scoreBand: "standard" },
  { rank: 5, short: "UWA", full: "University of Western Australia", state: "WA", places: 240, tac: "tisc", scoreBand: "standard" },
  { rank: 6, short: "UNSW", full: "UNSW Sydney", state: "NSW", places: 280, tac: "uac", scoreBand: "standard" },
  { rank: 7, short: "Newcastle/UNE", full: "University of Newcastle / UNE Joint Medical Program", state: "NSW", places: 200, tac: "uac", scoreBand: "standard" },
  { rank: 8, short: "Adelaide", full: "University of Adelaide", state: "SA", places: 160, tac: "satac", scoreBand: "standard" },
  { rank: 9, short: "Tasmania", full: "University of Tasmania", state: "TAS", places: 120, tac: "uac", scoreBand: "standard" },
  { rank: 10, short: "Flinders", full: "Flinders University", state: "SA", places: 130, tac: "satac", scoreBand: "standard" },
  { rank: 11, short: "Deakin", full: "Deakin University", state: "VIC", places: 150, tac: "vtac", noUcat: true, scoreBand: "standard" },
  { rank: 12, short: "JCU", full: "James Cook University", state: "QLD", places: 180, tac: "qtac", noUcat: true, scoreBand: "standard" },
  { rank: 13, short: "Griffith", full: "Griffith University", state: "QLD", places: 190, tac: "qtac", noUcat: true, scoreBand: "standard" },
  { rank: 14, short: "Curtin", full: "Curtin University", state: "WA", places: 110, tac: "tisc", scoreBand: "standard" },
  { rank: 15, short: "Bond", full: "Bond University", state: "QLD", places: 120, tac: "direct", noUcat: true, note: "Private direct-entry pathway", scoreBand: "standard" },
  { rank: 16, short: "Macquarie", full: "Macquarie University", state: "NSW", places: 80, tac: "uac", noUcat: true, scoreBand: "standard" },
  { rank: 17, short: "Notre Dame", full: "University of Notre Dame Australia", state: "WA/NSW", places: 180, tac: "direct", scoreBand: "standard" },
  { rank: 18, short: "Wollongong", full: "University of Wollongong", state: "NSW", places: 80, tac: "uac", noUcat: true, scoreBand: "standard" },
  { rank: 19, short: "CDU", full: "Charles Darwin University", state: "NT", places: 60, tac: "satac", scoreBand: "standard" },
  { rank: 20, short: "CQU --> UQ", full: "Central Queensland University", state: "QLD", places: 40, tac: "qtac", scoreBand: "standard" },
  { rank: 21, short: "WSU", full: "Western Sydney University", state: "NSW", places: 140, tac: "uac", scoreBand: "standard" },
  { rank: 22, short: "CSU/WSU", full: "Charles Sturt University (Joint MD with WSU)", state: "NSW", places: 40, tac: "uac", scoreBand: "standard" },
  { rank: 23, short: "UniSQ", full: "University of Southern Queensland", state: "QLD", places: 30, tac: "qtac", scoreBand: "standard" },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
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
        "rounded-3xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

function rankAccent(school: School) {
  if (school.scoreBand === "gold") {
    return "border-amber-200 bg-linear-to-r from-amber-50 via-white to-yellow-50";
  }
  if (school.scoreBand === "silver") {
    return "border-blue-200 bg-linear-to-r from-blue-50 via-white to-indigo-50";
  }
  if (school.scoreBand === "bronze") {
    return "border-orange-200 bg-linear-to-r from-orange-50 via-white to-amber-50";
  }
  return "border-slate-200 bg-white";
}

function MedalIcon({ school }: { school: School }) {
  if (school.rank <= 3) {
    return (
      <Trophy
        className={cx(
          "h-5 w-5",
          school.rank === 1
            ? "text-amber-500"
            : school.rank === 2
              ? "text-slate-400"
              : "text-orange-500"
        )}
      />
    );
  }

  return (
    <span className="text-xl font-black tracking-tight text-slate-300">
      #{school.rank}
    </span>
  );
}

export default function MedicalSchoolRankingsPage() {
  const [infoOpen, setInfoOpen] = useState(true);
  const [selectedTac, setSelectedTac] = useState<TacKey>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return schools.filter((school) => {
      const tacMatch = selectedTac === "all" ? true : school.tac === selectedTac;
      const searchMatch = !q
        ? true
        : `${school.short} ${school.full} ${school.state} ${school.tac}`
            .toLowerCase()
            .includes(q);

      return tacMatch && searchMatch;
    });
  }, [selectedTac, query]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-700">
            Compare
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <Sparkles className="h-3.5 w-3.5" />
            Research prestige is not entry strategy
          </span>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-amber-500 via-orange-500 to-yellow-500" />
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-100/60 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-sky-100/60 blur-3xl" />

          <div className="relative z-10 space-y-6">
            <div className="max-w-4xl">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500 to-orange-500 text-white shadow-sm">
                  <Trophy className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                  Medical School Rankings
                </h1>
              </div>
              <p className="text-sm leading-7 text-slate-600 sm:text-base">
                Australian medical schools ranked by research reputation, with
                TAC colour-coding and filters so students can compare systems
                without confusing prestige for admissions reality.
              </p>
            </div>

            <SoftCard className="overflow-hidden">
              <button
                onClick={() => setInfoOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <Info className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-950">
                      What do these rankings actually mean?
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Why research rankings are not the same thing as admissions
                      value or student experience.
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={cx(
                    "h-5 w-5 text-slate-500 transition",
                    infoOpen ? "rotate-180" : "rotate-0"
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {infoOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden px-5 pb-5"
                  >
                    <div className="rounded-3xl border border-sky-200 bg-sky-50 p-5">
                      <h3 className="font-bold text-sky-950">
                        How Australian medical schools are ranked
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-700">
                        Australian medical schools are not ranked by the
                        government for entry purposes. Public rankings usually
                        come from external organisations like QS, Times Higher
                        Education, or ARWU, and they are mostly research-focused
                        rather than teaching- or admissions-focused.
                      </p>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <h3 className="font-bold text-slate-950">
                          Common ranking systems
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm text-slate-700">
                          <li>QS World University Rankings</li>
                          <li>Times Higher Education (THE)</li>
                          <li>Academic Ranking of World Universities (ARWU/Shanghai)</li>
                        </ul>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <h3 className="font-bold text-slate-950">
                          What rankings usually measure
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm text-slate-700">
                          <li>Academic reputation</li>
                          <li>Research output and citations</li>
                          <li>Faculty quality and grants</li>
                          <li>International outlook</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-5">
                      <h3 className="font-bold text-amber-950">
                        What rankings do not measure well
                      </h3>
                      <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                        <p>Teaching quality</p>
                        <p>Clinical placement quality</p>
                        <p>Internship success rates</p>
                        <p>Rural exposure</p>
                        <p>Student support</p>
                        <p>How hard entry is this year</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                      <h3 className="font-bold text-emerald-950">
                        The bottom line
                      </h3>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        <li className="flex gap-2">
                          <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-600" />
                          All Australian medical degrees are AHPRA-accredited.
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-600" />
                          Internship allocation is state-based, not ranking-based.
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-600" />
                          Hospitals do not hire based on QS or THE rank.
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-600" />
                          Once you are a doctor, no one asks where you studied in
                          the way school students imagine.
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-600" />
                          A lower-ranked school can still produce excellent doctors.
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </SoftCard>

            <SoftCard className="p-5">
              <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-950">
                    Filter rankings by TAC
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Switch between all systems and each individual TAC.
                  </p>
                </div>

                <div className="relative w-full max-w-sm">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search universities..."
                    className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(Object.keys(tacMeta) as TacKey[]).map((key) => {
                  const isActive = selectedTac === key;
                  const meta = tacMeta[key];

                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedTac(key)}
                      className={cx(
                        "rounded-full border px-4 py-2 text-sm font-semibold transition",
                        isActive ? meta.active : meta.inactive
                      )}
                    >
                      {key === "all"
                        ? `${meta.label} (${schools.length} Unis)`
                        : meta.label}
                    </button>
                  );
                })}
              </div>
            </SoftCard>

            <div>
              <p className="mb-4 text-sm font-medium text-slate-500">
                Showing {filtered.length}{" "}
                {filtered.length === 1 ? "university" : "universities"}
              </p>

              <div className="space-y-4">
                {filtered.map((school) => (
                  <motion.div key={school.short} layout>
                    <SoftCard
                      className={cx(
                        "border-2 p-5 transition hover:-translate-y-0.5",
                        rankAccent(school)
                      )}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                            <MedalIcon school={school} />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-2xl font-black tracking-tight text-slate-950">
                                {school.short}
                              </h3>

                              <span
                                className={cx(
                                  "rounded-full px-3 py-1 text-xs font-bold shadow-sm",
                                  tacMeta[school.tac].badge
                                )}
                              >
                                {tacMeta[school.tac].label}
                              </span>

                              {school.noUcat ? (
                                <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                                  No UCAT
                                </span>
                              ) : null}
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                              {school.full}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {school.state}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <Users className="h-4 w-4" />
                                {school.places} places
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <GraduationCap className="h-4 w-4" />
                                Research rank #{school.rank}
                              </span>
                            </div>

                            {school.note ? (
                              <p className="mt-3 rounded-2xl bg-white/80 px-3 py-2 text-sm text-slate-600">
                                {school.note}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </SoftCard>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-linear-to-r from-amber-50 via-white to-orange-50 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-amber-700" />
                </div>

                <div>
                  <h3 className="text-lg font-black tracking-tight text-slate-950">
                    Cool disclaimer, not a boring one
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    Rankings are useful for understanding research reputation,
                    but they are a weak tool for deciding where you should
                    apply. Always cross-check with official university websites
                    for course structure, entry pathways, student support,
                    location, and actual admissions strategy.
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm">
                    <Wand2 className="h-4 w-4" />
                    Prestige is a signal. Fit is the decision.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}