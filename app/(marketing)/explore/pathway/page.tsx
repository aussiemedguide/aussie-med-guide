"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  GraduationCap,
  Brain,
  Users,
  CircleHelp,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Clock3,
  Target,
  MessageSquare,
  ShieldCheck,
  XCircle,
  BookOpen,
  Search,
  ExternalLink,
  Info,
  Trophy,
} from "lucide-react";

type TabKey = "atar" | "ucat" | "interview" | "confusion";

type LinkItem = {
  label: string;
  href: string;
};

type Myth = {
  title: string;
  why: string;
  reality: string[];
  matters: string;
};

type GlossaryItem = {
  term: string;
  definition: string;
  why: string;
};

const tabs: { key: TabKey; label: string; icon: any }[] = [
  { key: "atar", label: "ATAR", icon: GraduationCap },
  { key: "ucat", label: "UCAT", icon: Brain },
  { key: "interview", label: "Interview", icon: Users },
  { key: "confusion", label: "Clearing Confusion", icon: CircleHelp },
];

const universityFormats = [
  {
    label: "MMI",
    count: "17 unis",
    tone: "border-emerald-300 bg-emerald-50 text-emerald-950",
    schools: [
      "Adelaide",
      "ANU",
      "Bond",
      "CDU",
      "Curtin",
      "Deakin",
      "Macquarie",
      "Monash",
      "UQ",
      "UWA",
      "Melbourne",
      "Newcastle/UNE",
      "Notre Dame",
      "Wollongong",
      "WSU",
      "CSU/WSU",
      "UniSQ",
    ],
  },
  {
    label: "Panel",
    count: "3 unis",
    tone: "border-sky-300 bg-sky-50 text-sky-950",
    schools: ["Flinders", "JCU", "UNSW"],
  },
  {
    label: "Group / Written",
    count: "1 uni",
    tone: "border-violet-300 bg-violet-50 text-violet-950",
    schools: ["Sydney"],
  },
  {
    label: "No Interview",
    count: "2 unis",
    tone: "border-amber-300 bg-amber-50 text-amber-950",
    schools: ["Griffith", "Tasmania"],
  },
];

const myths: Myth[] = [
  {
    title: "You need a 99.95 to do medicine",
    why: "People hear the most extreme score examples and assume they apply everywhere.",
    reality: [
      "Different universities use different thresholds, quotas, and adjustment systems.",
      "Published lowest ATAR and actually competitive ATAR are not always the same thing.",
      "Rural, access, bonded, and pathway categories can shift what is realistic.",
    ],
    matters: "The right question is not ‘what is the highest score I heard online?’ It is ‘what score is competitive for my category and target universities?’",
  },
  {
    title: "Ranking matters most",
    why: "Rankings are easy to compare and sound prestigious.",
    reality: [
      "In Australia, accredited medical schools meet the same national standards.",
      "Employers do not rank you by university prestige in the way many school students imagine.",
      "Clinical placements, support, location, and your own wellbeing often matter more than ranking.",
    ],
    matters: "What actually matters is fit: clinical exposure, student support, cost of living, and whether you can perform well there.",
  },
  {
    title: "Rural entry is cheating",
    why: "Some students misunderstand rural pathways as unfair shortcuts.",
    reality: [
      "Rural pathways exist because workforce distribution is a real national problem.",
      "They recognise different lived contexts and are built into policy intentionally.",
      "They still require strong students. They are not free passes.",
    ],
    matters: "If you are eligible, it is a legitimate pathway. If you are not, your job is strategy, not bitterness.",
  },
  {
    title: "If you fail UCAT once, it is over",
    why: "The test feels huge, so one weak score can feel final.",
    reality: [
      "Many students improve substantially on a later attempt.",
      "Some pathways use graduate entry later, where UCAT is irrelevant.",
      "A weak UCAT changes the route, not your ability to become a doctor.",
    ],
    matters: "Medicine rewards rerouting. One score is a moment, not a life sentence.",
  },
];

const glossary: GlossaryItem[] = [
  {
    term: "MM2–MM7 (Rural Classifications)",
    definition:
      "Australian areas are classified under the Modified Monash Model. MM1 is metropolitan, while MM2–MM7 cover increasingly regional, rural, and remote areas.",
    why: "This matters because rural classification can significantly change eligibility and competitiveness.",
  },
  {
    term: "CSP vs BMP",
    definition:
      "CSP means Commonwealth Supported Place. BMP means Bonded Medical Program. BMP usually carries a return-of-service style obligation later on.",
    why: "This matters because the same course can have very different future obligations depending on the funding pathway.",
  },
  {
    term: "Bonded vs Unbonded",
    definition:
      "Bonded places include future service requirements in areas of need. Unbonded places do not carry that extra service obligation.",
    why: "This matters because understanding bonding helps you plan long-term lifestyle and career flexibility.",
  },
  {
    term: "GAMSAT vs UCAT ANZ",
    definition:
      "UCAT ANZ is mainly for undergraduate medicine pathways. GAMSAT is mainly used for graduate-entry medicine. They test different things and sit at different points in the journey.",
    why: "This matters because their timing, purpose, and preparation styles are completely different.",
  },
  {
    term: "Conditional vs Provisional Offer",
    definition:
      "Conditional offers depend on meeting final requirements. Provisional structures usually mean a place later in medicine is linked to an earlier degree stage, but conditions still apply.",
    why: "This matters because students often mistake linked pathways for guaranteed outcomes.",
  },
  {
    term: "Domestic Intake Quota",
    definition:
      "Each Australian medical school has a fixed intake structure for domestic students, divided across categories, funding types, and obligations.",
    why: "This matters because quota systems explain why competition is never just about raw marks.",
  },
  {
    term: "Commonwealth Supported Place (CSP)",
    definition:
      "A subsidised place where the government covers part of the tuition cost and the student contributes the rest, often through HECS-HELP if eligible.",
    why: "This matters because cost can be dramatically different from full-fee pathways.",
  },
  {
    term: "International Full Fee Place",
    definition:
      "A place where the student pays the full tuition amount without Commonwealth subsidy. These are often much more expensive and sit in separate admissions pools.",
    why: "This matters because the financial strategy is as important as the admissions strategy.",
  },
];

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
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

function SoftCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-[26px] border border-slate-200 bg-white/85 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur", className)}>
      {children}
    </div>
  );
}

function CoolDisclaimer({ tone = "amber" }: { tone?: "amber" | "indigo" | "emerald" }) {
  const styles = {
    amber: "border-amber-300 bg-gradient-to-r from-amber-50 via-white to-orange-50 text-amber-950",
    indigo: "border-indigo-300 bg-gradient-to-r from-indigo-50 via-white to-violet-50 text-indigo-950",
    emerald: "border-emerald-300 bg-gradient-to-r from-emerald-50 via-white to-teal-50 text-emerald-950",
  }[tone];

  return (
    <div className={cx("rounded-3xl border p-5 shadow-sm", styles)}>
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
          <Info className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-black tracking-tight">Reality check, not legal advice</h3>
          <p className="mt-2 text-sm leading-7">
            This page is built to reduce confusion, not replace official admissions documents. Universities change thresholds, quotas, interview formats, and wording. Use this page to think clearly, then verify the final details with official university and admissions-centre sources.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-current/15 bg-white/80 px-4 py-2 text-sm font-semibold shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            Strategy tool first. Source of truth second.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PathwayToMedicinePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("atar");
  const [openMyth, setOpenMyth] = useState<string>(myths[1].title);
  const [glossarySearch, setGlossarySearch] = useState("");

  const filteredGlossary = useMemo(() => {
    const q = glossarySearch.trim().toLowerCase();
    if (!q) return glossary;
    return glossary.filter((item) =>
      `${item.term} ${item.definition} ${item.why}`.toLowerCase().includes(q)
    );
  }, [glossarySearch]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_right,rgba(168,85,247,0.08),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f6f7fb_42%,#f8fafc_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
            Guide
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Map the pathway, kill the confusion
          </span>
        </div>

        <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 via-indigo-500 to-violet-500" />
          <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-sky-100 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-violet-100 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-4xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 to-sky-600 text-white shadow-lg shadow-sky-200">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Pathway to Medicine</h1>
                </div>
                <p className="text-sm leading-7 text-slate-600 sm:text-base">
                  Understanding ATAR, UCAT, interviews, and the myths that distort how students see medical school entry.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-2 shadow-inner">
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = tab.key === activeTab;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={cx(
                        "relative overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold transition",
                        isActive
                          ? "bg-white text-slate-950 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
                          : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="pathway-tab-pill"
                          className="absolute inset-0 rounded-2xl border border-slate-200 bg-white"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </span>
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
                {activeTab === "atar" && <ATARSection />}
                {activeTab === "ucat" && <UCATSection />}
                {activeTab === "interview" && <InterviewSection />}
                {activeTab === "confusion" && (
                  <ConfusionSection
                    openMyth={openMyth}
                    setOpenMyth={setOpenMyth}
                    glossarySearch={glossarySearch}
                    setGlossarySearch={setGlossarySearch}
                    filteredGlossary={filteredGlossary}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function ATARSection() {
  return (
    <div className="space-y-5">
      <SoftCard className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
            <GraduationCap className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">ATAR: Academic Profile and Benchmarks</h2>
        </div>

        <div className="rounded-[22px] border border-sky-300 bg-sky-50 p-5">
          <h3 className="text-lg font-bold text-sky-950">What this section covers</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            ATAR matters for medicine entry, but it is not used the same way everywhere. Some universities publish lowest ATAR offered or lowest selection rank, many use adjustment factors, and several run separate pathways for rural, access, and other categories.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {[
            "What ‘minimum’ really means vs what is actually competitive",
            "Why ATAR varies by state, system, and adjustments",
            "How ATAR interacts with UCAT and interview",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-[18px] bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {item}
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[22px] border border-amber-300 bg-amber-50 p-5">
          <h3 className="text-lg font-bold text-amber-950">Why “minimum” is misleading</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            A published lowest ATAR does not equal the typical student getting in. It can reflect category-specific pathways, adjustments, a particular round, or one edge-case offer. Raw ATAR numbers are almost never safe to compare 1:1 without context.
          </p>
        </div>

        <div className="mt-5 rounded-[22px] border border-emerald-300 bg-emerald-50 p-5">
          <h3 className="text-lg font-bold text-emerald-950">What this means in plain English</h3>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
            <li className="flex gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />Published minimum or lowest ATAR often signals eligibility or an edge-case offer, not the target.</li>
            <li className="flex gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />The real game is being competitive inside your category because medicine intake is quota-based and heavily oversubscribed.</li>
          </ul>
        </div>

        <div className="mt-5 rounded-[22px] border border-violet-300 bg-violet-50 p-5">
          <h3 className="text-lg font-bold text-violet-950">Personal tips</h3>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
            <li className="flex gap-2"><Lightbulb className="mt-1 h-4 w-4 text-violet-600" />Pick subjects you can score highly in, but still think strategically about scaling and prerequisites.</li>
            <li className="flex gap-2"><Lightbulb className="mt-1 h-4 w-4 text-violet-600" />Scaling helps strong marks. It does not rescue weak performance.</li>
            <li className="flex gap-2"><Lightbulb className="mt-1 h-4 w-4 text-violet-600" />Think of ATAR as your entry ticket, not your final identity.</li>
          </ul>
        </div>
      </SoftCard>

      <CoolDisclaimer tone="amber" />
    </div>
  );
}

function UCATSection() {
  return (
    <div className="space-y-5">
      <SoftCard className="border-violet-300 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <Brain className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">UCAT: What Scores Universities Want</h2>
        </div>

        <div className="rounded-[22px] border border-violet-300 bg-violet-50 p-5">
          <h3 className="text-lg font-bold text-violet-950">What this section covers</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            UCAT is often the main differentiator when thousands of applicants have similar ATARs. Most UCAT-using universities rely on it to rank and shortlist students for interview.
          </p>
          <p className="mt-3 text-sm font-semibold text-violet-900">
            Important: the current UCAT ANZ cognitive total runs from 900 to 2700, with SJT reported separately.
          </p>
        </div>

        <div className="mt-5 rounded-[22px] border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2 text-slate-950">
            <BarChart3 className="h-4 w-4 text-violet-600" />
            <h3 className="text-lg font-bold">Practical competitive bands</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Below competitive", value: "Below ~2000", tone: "bg-slate-100 text-slate-700" },
              { label: "Competitive", value: "~2100 to 2200+", tone: "bg-sky-100 text-sky-700" },
              { label: "Very competitive", value: "~2300+", tone: "bg-emerald-100 text-emerald-700" },
              { label: "Exceptional", value: "~2450+", tone: "bg-violet-100 text-violet-700" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-[18px] bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                <span className={cx("rounded-full px-3 py-1 text-xs font-bold", item.tone)}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-[22px] border border-amber-300 bg-amber-50 p-5">
          <h3 className="text-lg font-bold text-amber-950">Fixing a common confusion</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            Sometimes you will see legacy-style cut-offs, percentile references, or university wording that looks inconsistent with the current UCAT scale. When that happens, always check the university’s newest admissions page rather than relying on screenshots, forums, or older PDFs.
          </p>
        </div>

        <div className="mt-5 rounded-[22px] border border-violet-300 bg-violet-50 p-5">
          <h3 className="text-lg font-bold text-violet-950">Personal tips</h3>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
            <li className="flex gap-2"><Clock3 className="mt-1 h-4 w-4 text-violet-600" />Timing often costs more marks than lack of knowledge. Learn to move.</li>
            <li className="flex gap-2"><Target className="mt-1 h-4 w-4 text-violet-600" />Do not aim for the minimum. Aim for the score band that actually secures interview chances.</li>
          </ul>
        </div>
      </SoftCard>

      <CoolDisclaimer tone="indigo" />
    </div>
  );
}

function InterviewSection() {
  return (
    <div className="space-y-5">
      <SoftCard className="border-emerald-300 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Interview: Where Offers Are Won</h2>
        </div>

        <div className="rounded-[22px] border border-emerald-300 bg-emerald-50 p-5">
          <h3 className="text-lg font-bold text-emerald-950">What this section covers</h3>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            By interview stage, most candidates are already academically strong. The interview is used to assess how you think, communicate, reflect, and carry yourself under pressure.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[22px] border border-sky-300 bg-sky-50 p-5">
            <h3 className="text-lg font-bold text-sky-950">MMI (Multiple Mini Interview)</h3>
            <p className="mt-2 text-sm text-slate-700">Short, intense stations testing thinking and reasoning.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Ethical reasoning', 'Communication', 'Empathy', 'Teamwork', 'Problem-solving'].map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">{item}</span>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-sky-800">Key skill: clarity under pressure</div>
          </div>

          <div className="rounded-[22px] border border-violet-300 bg-violet-50 p-5">
            <h3 className="text-lg font-bold text-violet-950">Panel Interview</h3>
            <p className="mt-2 text-sm text-slate-700">Longer, more conversational format assessing maturity and insight.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Motivation', 'Communication style', 'Self-awareness', 'Professional maturity'].map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">{item}</span>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-violet-800">Key skill: reflection and maturity</div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-bold text-slate-950">What examiners listen for</h3>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
              <li>Clear answers to the actual question</li>
              <li>Logical reasoning and explanation</li>
              <li>Reflection on what was learned</li>
              <li>Empathy without performance</li>
            </ul>
          </div>
          <div className="rounded-[22px] border border-rose-300 bg-rose-50 p-5">
            <h3 className="text-lg font-bold text-rose-950">Common interview mistakes</h3>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
              <li>Over-rehearsed, robotic answers</li>
              <li>Medical jargon without substance</li>
              <li>Rambling without a clear point</li>
              <li>No reflection or self-awareness</li>
            </ul>
          </div>
        </div>

        <div className="mt-5 rounded-[22px] border border-emerald-300 bg-emerald-50 p-5">
          <h3 className="text-lg font-bold text-emerald-950">What medical schools consistently reward</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2 text-sm leading-7 text-slate-700">
            <div>
              <p>Clear communication</p>
              <p>Logical reasoning</p>
              <p>Empathy and professionalism</p>
              <p>Ability to reflect and improve</p>
            </div>
            <div>
              <p>Poor structure</p>
              <p>Lack of insight</p>
              <p>Over-rehearsal</p>
              <p>Inability to justify opinions</p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[22px] border border-violet-300 bg-violet-50 p-5">
          <h3 className="text-lg font-bold text-violet-950">Final advice</h3>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
            <li>Be structured, not scripted.</li>
            <li>Show reflection, not perfection.</li>
            <li>You do not need to be impressive. You need to be safe, thoughtful, and clear.</li>
            <li>Medical interviews do not select the smartest applicant. They select the most suitable future doctor.</li>
          </ul>
        </div>

        <div className="mt-5 rounded-[22px] bg-slate-900 px-6 py-5 text-center text-white shadow-xl">
          <p className="text-2xl font-black">A strong answer is: Clear, Structured, Justified, Reflective</p>
          <p className="mt-2 text-sm text-slate-300">A simple answer delivered clearly will often outperform a complex answer delivered poorly.</p>
        </div>

        <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
          <h3 className="text-xl font-black tracking-tight text-slate-950">Interview format by university</h3>
          <p className="mt-1 text-sm text-slate-500">Visual breakdown of common interview styles across Australian medical schools.</p>
          <div className="mt-4 space-y-3">
            {universityFormats.map((group) => (
              <div key={group.label} className={cx("rounded-[20px] border p-4", group.tone)}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="text-lg font-bold">{group.label}</h4>
                  <span className="rounded-full border border-current/15 bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]">{group.count}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.schools.map((school) => (
                    <span key={school} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">{school}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SoftCard>

      <CoolDisclaimer tone="emerald" />
    </div>
  );
}

function ConfusionSection({
  openMyth,
  setOpenMyth,
  glossarySearch,
  setGlossarySearch,
  filteredGlossary,
}: {
  openMyth: string;
  setOpenMyth: (value: string) => void;
  glossarySearch: string;
  setGlossarySearch: (value: string) => void;
  filteredGlossary: GlossaryItem[];
}) {
  return (
    <div className="space-y-5">
      <SoftCard className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">Common Myths (Explained Properly)</h2>
            <p className="mt-1 text-sm text-slate-500">Click to expand each myth and see the reality.</p>
          </div>
        </div>

        <div className="space-y-3">
          {myths.map((myth) => {
            const isOpen = openMyth === myth.title;
            return (
              <div key={myth.title} className="overflow-hidden rounded-[22px] border border-rose-300 bg-rose-50/60">
                <button
                  onClick={() => setOpenMyth(isOpen ? "" : myth.title)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    <span className="font-semibold text-slate-900">{myth.title}</span>
                  </div>
                  <ChevronDown className={cx("h-5 w-5 text-rose-600 transition", isOpen ? "rotate-180" : "rotate-0")} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <div className="rounded-[18px] bg-white p-4">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Why people believe this</p>
                          <p className="mt-2 text-sm leading-7 text-slate-700">{myth.why}</p>
                        </div>

                        <div className="mt-4 rounded-[18px] border border-emerald-300 bg-emerald-50 p-4">
                          <p className="font-bold text-emerald-950">Reality</p>
                          <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                            {myth.reality.map((item) => (
                              <li key={item} className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 text-emerald-600" />{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 rounded-[18px] border border-sky-300 bg-sky-50 p-4">
                          <p className="font-bold text-sky-950">What actually matters</p>
                          <p className="mt-2 text-sm leading-7 text-slate-700">{myth.matters}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </SoftCard>

      <SoftCard className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">Glossary</h2>
            <p className="mt-1 text-sm text-slate-500">Clear definitions with no jargon fog.</p>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={glossarySearch}
            onChange={(e) => setGlossarySearch(e.target.value)}
            placeholder="Search terms..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <div className="space-y-3">
          {filteredGlossary.map((item) => (
            <div key={item.term} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-bold text-slate-950">{item.term}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">{item.definition}</p>
              <div className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm text-indigo-700">{item.why}</div>
            </div>
          ))}
        </div>
      </SoftCard>

      <CoolDisclaimer tone="amber" />
    </div>
  );
}
