"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Sparkles,
  Users,
  FileText,
  Target,
  GraduationCap,
  ChevronDown,
  CheckCircle2,
  ShieldCheck,
  Wand2,
  TrendingUp,
  Filter,
} from "lucide-react";

type YearKey = "2025" | "2024" | "2023" | "2022";

type YearStats = {
  atarStudents: number;
  ucatCandidates: number;
  medApplicants: number;
  offersMade: number;
  metroOffers: number;
  metroApplicants: number;
  ruralOffers: number;
  ruralApplicants: number;
  internationalOffers: number;
  internationalApplicants: number;
};

const yearlyData: Record<YearKey, YearStats> = {
  "2025": {
    atarStudents: 204000,
    ucatCandidates: 16950,
    medApplicants: 9200,
    offersMade: 3850,
    metroOffers: 2420,
    metroApplicants: 6270,
    ruralOffers: 1130,
    ruralApplicants: 2000,
    internationalOffers: 300,
    internationalApplicants: 930,
  },
  "2024": {
    atarStudents: 201000,
    ucatCandidates: 15240,
    medApplicants: 8700,
    offersMade: 3800,
    metroOffers: 2400,
    metroApplicants: 6000,
    ruralOffers: 1100,
    ruralApplicants: 1925,
    internationalOffers: 300,
    internationalApplicants: 775,
  },
  "2023": {
    atarStudents: 198000,
    ucatCandidates: 14800,
    medApplicants: 8300,
    offersMade: 3750,
    metroOffers: 2350,
    metroApplicants: 5620,
    ruralOffers: 1100,
    ruralApplicants: 1890,
    internationalOffers: 300,
    internationalApplicants: 790,
  },
  "2022": {
    atarStudents: 195000,
    ucatCandidates: 13900,
    medApplicants: 7900,
    offersMade: 3700,
    metroOffers: 2300,
    metroApplicants: 5360,
    ruralOffers: 1100,
    ruralApplicants: 1850,
    internationalOffers: 300,
    internationalApplicants: 690,
  },
};

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function formatNumber(value: number) {
  return value.toLocaleString("en-AU");
}

function percent(numerator: number, denominator: number) {
  return ((numerator / denominator) * 100).toFixed(1);
}

function SoftCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-[26px] border border-slate-200 bg-white/85 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur", className)}>
      {children}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  iconTone,
}: {
  icon: any;
  label: string;
  value: string;
  iconTone: string;
}) {
  return (
    <SoftCard className="p-5 transition hover:-translate-y-0.5">
      <div className="flex flex-col items-center text-center">
        <div className={cx("mb-3 flex h-12 w-12 items-center justify-center rounded-2xl", iconTone)}>
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-3xl font-black tracking-tight text-slate-950">{value}</p>
        <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
      </div>
    </SoftCard>
  );
}

function CoolDisclaimer() {
  return (
    <div className="rounded-[26px] border border-amber-300 bg-linear-to-r from-amber-50 via-white to-orange-50 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
          <ShieldCheck className="h-5 w-5 text-amber-700" />
        </div>
        <div>
          <h3 className="text-lg font-black tracking-tight text-slate-950">A smart disclaimer, not a scary one</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            These statistics are directional and designed to show trend lines, category differences, and selection pressure. They should support strategy, not replace official source checks. Always verify critical current-year figures with official admissions or testing sources before making decisions.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm">
            <Wand2 className="h-4 w-4" />
            Use trends for judgement. Use official sources for final action.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KeyStatisticsPage() {
  const [selectedYear, setSelectedYear] = useState<YearKey>("2025");
  const [insightOpen, setInsightOpen] = useState(true);

  const data = yearlyData[selectedYear];

  const overallRate = percent(data.offersMade, data.medApplicants);
  const metroRate = percent(data.metroOffers, data.metroApplicants);
  const ruralRate = percent(data.ruralOffers, data.ruralApplicants);
  const internationalRate = percent(data.internationalOffers, data.internationalApplicants);

  const strongestCategory = useMemo(() => {
    const values = [
      { label: "Metropolitan", value: Number(metroRate) },
      { label: "Rural", value: Number(ruralRate) },
      { label: "International", value: Number(internationalRate) },
    ];
    return values.sort((a, b) => b.value - a.value)[0];
  }, [metroRate, ruralRate, internationalRate]);

  const weakestCategory = useMemo(() => {
    const values = [
      { label: "Metropolitan", value: Number(metroRate) },
      { label: "Rural", value: Number(ruralRate) },
      { label: "International", value: Number(internationalRate) },
    ];
    return values.sort((a, b) => a.value - b.value)[0];
  }, [metroRate, ruralRate, internationalRate]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_24%),radial-gradient(circle_at_right,rgba(59,130,246,0.08),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f6f7fb_42%,#f8fafc_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
            Statistics
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Trends, pressure, and selection reality
          </span>
        </div>

        <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 via-teal-500 to-sky-500" />
          <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-emerald-100 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-sky-100 blur-3xl" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-4xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Key Statistics</h1>
                </div>
                <p className="text-sm leading-7 text-slate-600 sm:text-base">
                  Medicine entry data, trends, and category comparisons so users can see how competitive the landscape actually is.
                </p>
              </div>

              <div className="w-full max-w-45">
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  <Filter className="h-3.5 w-3.5" />
                  Filter by year
                </label>
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value as YearKey)}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                  >
                    {Object.keys(yearlyData).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Entry Statistics</h2>
              <p className="mt-1 text-sm text-slate-500">Admission data and trends for {selectedYear}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard icon={Users} label="ATAR Students" value={formatNumber(data.atarStudents)} iconTone="bg-blue-50 text-blue-600" />
              <MetricCard icon={FileText} label="UCAT Candidates" value={formatNumber(data.ucatCandidates)} iconTone="bg-violet-50 text-violet-600" />
              <MetricCard icon={Target} label="Med Applicants" value={formatNumber(data.medApplicants)} iconTone="bg-orange-50 text-orange-500" />
              <MetricCard icon={GraduationCap} label="Offers Made" value={formatNumber(data.offersMade)} iconTone="bg-emerald-50 text-emerald-600" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedYear}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <SoftCard className="p-5">
                  <h3 className="text-lg font-black tracking-tight text-slate-950">Success Rates by Category ({selectedYear})</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[22px] bg-slate-50 p-5 text-center">
                      <p className="text-sm font-medium text-slate-500">Overall</p>
                      <p className="mt-2 text-5xl font-black tracking-tight text-slate-950">{overallRate}%</p>
                      <p className="mt-2 text-xs font-medium text-slate-500">{data.offersMade} of {data.medApplicants}</p>
                    </div>
                    <div className="rounded-[22px] bg-blue-50 p-5 text-center">
                      <p className="text-sm font-medium text-blue-600">Metropolitan</p>
                      <p className="mt-2 text-5xl font-black tracking-tight text-blue-900">{metroRate}%</p>
                      <p className="mt-2 text-xs font-medium text-blue-600">{data.metroOffers} of {data.metroApplicants}</p>
                    </div>
                    <div className="rounded-[22px] bg-emerald-50 p-5 text-center">
                      <p className="text-sm font-medium text-emerald-600">Rural</p>
                      <p className="mt-2 text-5xl font-black tracking-tight text-emerald-900">{ruralRate}%</p>
                      <p className="mt-2 text-xs font-medium text-emerald-600">{data.ruralOffers} of {data.ruralApplicants}</p>
                    </div>
                    <div className="rounded-[22px] bg-violet-50 p-5 text-center">
                      <p className="text-sm font-medium text-violet-600">International</p>
                      <p className="mt-2 text-5xl font-black tracking-tight text-violet-900">{internationalRate}%</p>
                      <p className="mt-2 text-xs font-medium text-violet-600">{data.internationalOffers} of {data.internationalApplicants}</p>
                    </div>
                  </div>
                </SoftCard>

                <SoftCard className="p-5">
                  <h3 className="text-lg font-black tracking-tight text-slate-950">Applicants vs Offers ({selectedYear})</h3>
                  <div className="mt-5 space-y-6">
                    {[
                      {
                        label: "Metropolitan",
                        offers: data.metroOffers,
                        applicants: data.metroApplicants,
                        rate: Number(metroRate),
                        bar: "bg-gradient-to-r from-blue-500 to-blue-400",
                        text: "text-blue-700",
                      },
                      {
                        label: "Rural",
                        offers: data.ruralOffers,
                        applicants: data.ruralApplicants,
                        rate: Number(ruralRate),
                        bar: "bg-gradient-to-r from-emerald-500 to-teal-400",
                        text: "text-emerald-700",
                      },
                      {
                        label: "International",
                        offers: data.internationalOffers,
                        applicants: data.internationalApplicants,
                        rate: Number(internationalRate),
                        bar: "bg-gradient-to-r from-violet-500 to-fuchsia-400",
                        text: "text-violet-700",
                      },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                          <span className={cx("font-semibold", item.text)}>{item.label}</span>
                          <span className="text-slate-500">
                            {item.offers} offers / {item.applicants} applicants
                          </span>
                        </div>
                        <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                          <motion.div
                            className={cx("h-full rounded-full", item.bar)}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.rate}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </SoftCard>

                <SoftCard className="border-emerald-300 bg-linear-to-r from-emerald-50 via-white to-teal-50 p-5">
                  <button
                    onClick={() => setInsightOpen((v) => !v)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-emerald-700 shadow-sm">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black tracking-tight text-slate-950">Key Insight</h3>
                        <p className="mt-1 text-sm text-slate-500">What this year’s numbers are actually saying</p>
                      </div>
                    </div>
                    <ChevronDown className={cx("h-5 w-5 text-slate-500 transition", insightOpen ? "rotate-180" : "rotate-0")} />
                  </button>

                  <AnimatePresence initial={false}>
                    {insightOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                          <p>
                            <span className="font-semibold text-emerald-700">{strongestCategory.label}</span> has the strongest visible success rate at <span className="font-bold">{strongestCategory.value.toFixed(1)}%</span>, while <span className="font-semibold text-slate-700">{weakestCategory.label}</span> is lowest at <span className="font-bold">{weakestCategory.value.toFixed(1)}%</span>.
                          </p>
                          <p>
                            The gap between rural and metropolitan categories remains one of the clearest patterns in the data. That usually reflects dedicated rural pathways, reserved subquotas, and workforce strategy rather than a simple “one pool” admissions model.
                          </p>
                          <div className="rounded-[18px] bg-white/80 px-4 py-3 text-sm font-medium text-emerald-800 shadow-sm">
                            Read these numbers as evidence that category matters. Medicine selection is not one giant undifferentiated race.
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SoftCard>
              </motion.div>
            </AnimatePresence>

            <CoolDisclaimer />
          </div>
        </div>
      </div>
    </div>
  );
}
