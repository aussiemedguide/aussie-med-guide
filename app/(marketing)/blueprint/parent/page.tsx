"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Shield,
  HeartHandshake,
  Wallet,
  Map,
  Heart,
  ChevronDown,
  AlertTriangle,
  Siren,
  CircleAlert,
  CheckCircle2,
  Sparkles,
  CalendarDays,
  ArrowRight,
  Route,
  GraduationCap,
  FileText,
  Home,
  Trophy,
  ClipboardCheck,
  School,
  Stethoscope,
  BedDouble,
  ScrollText,
  BookOpen,
  Target,
  Lightbulb,
} from "lucide-react";

type TabKey = "overview" | "safeguard" | "financial" | "planb" | "support";
type RiskLevel = "critical" | "high" | "medium";

type TimelineStep = {
  id: string;
  title: string;
  subtitle?: string;
  type: "decision" | "milestone" | "preparation";
  color: string;
  chips?: string[];
  body: string;
};

type SafeguardItem = {
  title: string;
  severity: RiskLevel;
  description: string;
  action: string;
};

type FinancialCard = {
  title: string;
  tone: string;
  annual: string;
  total: string;
  note: string;
};

type PlanCard = {
  title: string;
  duration: string;
  body: string;
  availability: string;
  highlight: string;
  tone: string;
};

type BlueprintChip = {
  label: string;
  icon: ComponentType<{ className?: string }>;
};

type BlueprintNode = {
  id: string;
  title: string;
  subtitle?: string;
  tone: string;
  detail?: string;
};

const tabs: { key: TabKey; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { key: "overview", label: "Overview", icon: Shield },
  { key: "safeguard", label: "Safeguard", icon: CircleAlert },
  { key: "financial", label: "Financial", icon: Wallet },
  { key: "planb", label: "Plan B", icon: Map },
  { key: "support", label: "Support", icon: Heart },
];

const heroBubbles: { icon: ComponentType<{ className?: string }>; label: string }[] = [
  { icon: Wallet, label: "Cost clarity" },
  { icon: CalendarDays, label: "Timeline planning" },
  { icon: Shield, label: "Application safeguard" },
  { icon: HeartHandshake, label: "Support framework" },
];

const blueprintTopRail: BlueprintChip[] = [
  { label: "#TAC apply", icon: FileText },
  { label: "Accom. apply", icon: BedDouble },
  { label: "Scholarships apply", icon: Trophy },
];

const blueprintMainFlow: BlueprintNode[] = [
  {
    id: "yr10-11",
    title: "Yr 10–11",
    subtitle: "Early prep",
    tone: "border-emerald-300 bg-linear-to-br from-emerald-500 to-green-500 text-white",
    detail: "Subject choices, habits, foundations",
  },
  {
    id: "yr12",
    title: "Yr 12",
    subtitle: "Application year",
    tone: "border-rose-300 bg-linear-to-br from-rose-500 to-red-500 text-white",
    detail: "Everything tightens here",
  },
  {
    id: "ucat",
    title: "UCAT",
    subtitle: "Apply + sit exam",
    tone: "border-sky-300 bg-linear-to-br from-sky-700 to-cyan-600 text-white",
    detail: "One test. Big leverage.",
  },
  {
    id: "exams",
    title: "Yr 12 Exams",
    subtitle: "Final assessments",
    tone: "border-cyan-300 bg-linear-to-br from-cyan-500 to-sky-500 text-white",
    detail: "State-specific structure matters",
  },
  {
    id: "atar",
    title: "ATAR Release",
    subtitle: "Checkpoint",
    tone: "border-orange-300 bg-linear-to-br from-orange-500 to-amber-500 text-white",
    detail: "Changes shortlist strategy",
  },
  {
    id: "offer1",
    title: "Offer 1",
    subtitle: "Main round",
    tone: "border-lime-300 bg-linear-to-br from-lime-500 to-green-500 text-white",
    detail: "Best-case first movement",
  },
  {
    id: "offer2",
    title: "Offer 2",
    subtitle: "Reallocation",
    tone: "border-green-300 bg-linear-to-br from-green-500 to-emerald-500 text-white",
    detail: "The process can keep moving",
  },
  {
    id: "offer3",
    title: "Offer 3",
    subtitle: "Late movement",
    tone: "border-green-300 bg-linear-to-br from-green-500 to-emerald-600 text-white",
    detail: "Not over until it is over",
  },
  {
    id: "join",
    title: "Join Uni",
    subtitle: "Enrol + relocate",
    tone: "border-indigo-300 bg-linear-to-br from-indigo-600 to-blue-700 text-white",
    detail: "Paperwork starts fast",
  },
];

const blueprintInterviewFlow: BlueprintNode[] = [
  {
    id: "mmi1",
    title: "1st Round Interviews",
    subtitle: "Invite-based",
    tone: "border-fuchsia-300 bg-linear-to-br from-fuchsia-600 to-violet-600 text-white",
    detail: "Main interview movement",
  },
  {
    id: "mmi2",
    title: "2nd Round Interviews",
    subtitle: "Extra movement",
    tone: "border-fuchsia-300 bg-linear-to-br from-fuchsia-600 to-violet-600 text-white",
    detail: "More doors can open",
  },
  {
    id: "mmi3",
    title: "3rd Round Interviews",
    subtitle: "Late invites",
    tone: "border-fuchsia-300 bg-linear-to-br from-fuchsia-600 to-violet-600 text-white",
    detail: "Still alive",
  },
  {
    id: "other",
    title: "Other Pathways",
    subtitle: "Gap year / graduate / allied health",
    tone: "border-indigo-200 bg-linear-to-br from-indigo-50 to-slate-100 text-slate-950",
    detail: "Re-route, not failure",
  },
];

const timelineSteps: TimelineStep[] = [
  {
    id: "classification",
    title: "Student Classification",
    subtitle: "Decision",
    type: "decision",
    color: "from-slate-900 via-indigo-950 to-slate-950",
    chips: ["Australian School Leaver", "Graduate", "Postgrad", "International Student"],
    body: "Before anything else, identify the student’s classification. Whether they are domestic, international, school leaver, or graduate changes how they apply and which rules matter.",
  },
  {
    id: "year10-11",
    title: "Year 10–11 Preparation",
    subtitle: "Preparation",
    type: "preparation",
    color: "from-sky-500 to-cyan-500",
    chips: ["Subjects", "UCAT Awareness", "Academic Foundations"],
    body: "Choosing the right subjects, maintaining strong academic performance, and understanding the system early can prevent avoidable problems later.",
  },
  {
    id: "ucat-prep",
    title: "UCAT Preparation",
    subtitle: "Milestone",
    type: "milestone",
    color: "from-violet-500 to-fuchsia-500",
    chips: ["6-Month Timeline", "Mock Tests", "Question Banks"],
    body: "The UCAT usually cannot be left to the last minute. Most students need time to plan, practise consistently, and become comfortable with the time pressure.",
  },
  {
    id: "ucat-exam",
    title: "UCAT Exam",
    subtitle: "Milestone",
    type: "milestone",
    color: "from-violet-600 to-purple-500",
    chips: ["Aug–Sep", "2 Hours", "5 Sections"],
    body: "This is a single high-pressure sitting. Knowing what the UCAT is — and what it is not — helps families stay calm and realistic.",
  },
  {
    id: "ucat-score",
    title: "UCAT Score Released",
    subtitle: "Decision",
    type: "decision",
    color: "from-amber-400 to-orange-400",
    chips: ["Competitive", "Borderline", "Re-route strategy"],
    body: "This is a major strategy point. A strong score opens more doors. A weaker one changes the plan, not the student’s value.",
  },
  {
    id: "year12",
    title: "Year 12 Exams",
    subtitle: "Preparation",
    type: "preparation",
    color: "from-cyan-500 to-sky-500",
    chips: ["State-Specific Structure", "Internal + External", "Study Engine"],
    body: "Families often over-focus on one number. What matters is the actual state system, subject mix, scaling, and how the student performs across their assessments.",
  },
  {
    id: "atar",
    title: "ATAR Released",
    subtitle: "Decision",
    type: "decision",
    color: "from-emerald-500 to-teal-500",
    chips: ["Competitive", "Borderline", "Below Threshold"],
    body: "This is where the shortlist gets more real. But offers still depend on interview structure, category, pathway, and school-specific rules.",
  },
  {
    id: "interview-invite",
    title: "Interview Invite",
    subtitle: "Milestone",
    type: "milestone",
    color: "from-teal-500 to-emerald-500",
    chips: ["Aug–Oct", "Not Guaranteed", "Invite-Based"],
    body: "An interview invite means the file is still alive. It is a major milestone, but not the finish line.",
  },
  {
    id: "interview-prep",
    title: "Interview Preparation",
    subtitle: "Preparation",
    type: "preparation",
    color: "from-sky-500 to-indigo-500",
    chips: ["MMI Format", "Ethical Reasoning", "Communication"],
    body: "Students usually do better when families support routine, sleep, and confidence rather than turning the home into a pressure cooker.",
  },
  {
    id: "offer-rounds",
    title: "Offer Rounds",
    subtitle: "Decision",
    type: "decision",
    color: "from-slate-700 to-slate-900",
    chips: ["Offer", "Waitlist", "No Offer"],
    body: "This is where panic often spikes. Waitlists and re-routing are part of the process, not proof of failure.",
  },
  {
    id: "enrolment",
    title: "Enrolment + Accommodation",
    subtitle: "Preparation",
    type: "preparation",
    color: "from-indigo-500 to-violet-500",
    chips: ["HECS / Finance", "College Applications", "December Deadlines"],
    body: "Once the offer lands, the process often moves quickly into paperwork, accommodation, enrolment, finance, and relocation planning.",
  },
  {
    id: "start",
    title: "Start Medical School",
    subtitle: "Milestone",
    type: "milestone",
    color: "from-emerald-600 to-green-500",
    body: "You made it. The next chapter begins.",
  },
];

const safeguardItems: SafeguardItem[] = [
  {
    title: "Missing UCAT / ISAT registration deadlines",
    severity: "critical",
    description:
      "Students can lose an entire cycle by missing the admissions test booking window. This is one of the few mistakes that can shut doors immediately.",
    action:
      "Set calendar reminders before registrations open. Do not rely on school reminders. Lock in target tests and booking months early.",
  },
  {
    title: "Sitting the wrong test for the target school",
    severity: "critical",
    description:
      "Not all universities accept the same test. Some require UCAT ANZ only, some ISAT only, and some vary by category.",
    action:
      "Map every target university to its test requirements before booking anything. Build the school list around the correct test pathway.",
  },
  {
    title: "Misunderstanding student classification",
    severity: "critical",
    description:
      "Domestic vs international, school leaver vs graduate, bonded vs unbonded. If classification is wrong, the whole strategy can drift off course.",
    action:
      "Clarify category first. Treat this as step one before discussing scores, thresholds, or odds.",
  },
  {
    title: "Wrong preference order",
    severity: "high",
    description:
      "Many families underestimate how important preference ordering is. A competitive school ranked too low can mean missed opportunities.",
    action:
      "Research competitiveness and fit, then list schools where the student is realistically strongest at the right place in the order.",
  },
  {
    title: "Choosing bonded without understanding the obligation",
    severity: "high",
    description:
      "A bonded medical place can carry a long return-of-service obligation that affects later flexibility.",
    action:
      "Read the bonded place documentation carefully as a family before preferencing it. Do not treat it like a normal offer with no trade-offs.",
  },
  {
    title: "Assuming school leaver entry stays open indefinitely",
    severity: "medium",
    description:
      "Some direct-entry pathways have strict recency rules after Year 12. Delaying without a plan can permanently close them.",
    action:
      "Check how long school leaver eligibility lasts for each university before taking a gap year or changing course.",
  },
];

const financialCards: FinancialCard[] = [
  {
    title: "Commonwealth Supported Place (CSP)",
    tone: "border-emerald-300 bg-gradient-to-br from-emerald-50 to-white",
    annual: "~$13.6K/yr",
    total: "~$81K over 6 years",
    note: "Medicine sits in the highest student contribution band. HECS-HELP can usually defer the contribution, so many eligible students do not pay tuition upfront.",
  },
  {
    title: "Bonded Medical Program (BMP)",
    tone: "border-amber-300 bg-gradient-to-br from-amber-50 to-white",
    annual: "~$13.6K/yr",
    total: "~$81K over 6 years + service obligation",
    note: "Tuition is generally similar to a CSP. The major difference is the bonded obligation and return-of-service requirement later on.",
  },
  {
    title: "Domestic Full Fee (selected programs)",
    tone: "border-sky-300 bg-gradient-to-br from-sky-50 to-white",
    annual: "Provider-specific",
    total: "~$200K to $470K+ total",
    note: "This varies widely by university and pathway. Some private routes are far more expensive than a CSP and can exceed loan support.",
  },
  {
    title: "International Student Tuition",
    tone: "border-fuchsia-300 bg-gradient-to-br from-fuchsia-50 to-white",
    annual: "~$70K–$95K/yr",
    total: "~$400K–$570K total",
    note: "This is tuition only. OSHC, visa costs, flights, relocation, and living expenses sit on top.",
  },
];

const planCards: PlanCard[] = [
  {
    title: "Graduate Entry (GPA + GAMSAT/MCAT)",
    duration: "3–4 years",
    body: "Complete an undergraduate degree, build a strong GPA, prepare for GAMSAT or MCAT, then apply to graduate-entry medicine.",
    availability:
      "Available through a range of universities depending on category and eligibility.",
    highlight: "Best long-term route for academically strong students who miss direct entry.",
    tone: "border-indigo-300 bg-gradient-to-br from-indigo-50 to-white text-indigo-950",
  },
  {
    title: "Strategic Gap Year",
    duration: "12 months",
    body: "Use the year deliberately: retake UCAT when eligible, strengthen interview skills, gain meaningful experience, and reapply with a sharper strategy.",
    availability:
      "Works where school leaver eligibility remains valid and timelines still align.",
    highlight: "Only powerful when it is planned, not passive.",
    tone: "border-teal-300 bg-gradient-to-br from-teal-50 to-white text-teal-950",
  },
  {
    title: "Allied Health → Medicine Bridge",
    duration: "2–4 years",
    body: "Nursing, physio, occupational therapy, biomedical science, or paramedicine can build maturity and strengthen a later application profile.",
    availability:
      "Best for students who would genuinely value the allied health path as well.",
    highlight: "Strong for students who thrive in clinical environments.",
    tone: "border-emerald-300 bg-gradient-to-br from-emerald-50 to-white text-emerald-950",
  },
  {
    title: "Biomed / Health Sciences + Provisional Routes",
    duration: "2–4 years",
    body: "Some universities offer structured internal progression or provisional pathways. These are real but highly competitive and university-specific.",
    availability:
      "Available only at selected universities and policies can change over time.",
    highlight: "Structured, but never automatic.",
    tone: "border-violet-300 bg-gradient-to-br from-violet-50 to-white text-violet-950",
  },
];

const supportDo = [
  "Encourage consistent sleep and daily routine.",
  "Help with admin tasks like deadlines, registrations, and forms.",
  "Normalise struggle. It is part of the process.",
  "Ask how they are feeling, not just what they scored.",
  "Celebrate effort and progress, not only outcomes.",
  "Research independently so family conversations stay informed.",
  "Create a calm environment during major exam periods.",
  "Help organise volunteering or exposure without overloading them.",
];

const supportAvoid = [
  "Comparison language like ‘your cousin got in’.",
  "Constant performance pressure and score-checking.",
  "Making medicine the only acceptable identity.",
  "Promising outcomes you cannot guarantee.",
  "Micromanaging every study block.",
  "Dismissing medicine as unreachable after one setback.",
  "Panicking visibly about results in front of them.",
  "Using random forum advice as settled fact.",
];

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function SoftCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-3xl border border-slate-200 bg-white/85 shadow-sm backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

function BlueprintCard({
  title,
  subtitle,
  tone,
  detail,
  className = "",
}: {
  title: string;
  subtitle?: string;
  tone: string;
  detail?: string;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex min-h-28 min-w-40 flex-col justify-center rounded-3xl border-2 px-4 py-4 shadow-sm",
        tone,
        className
      )}
    >
      <div className="text-base font-black tracking-tight">{title}</div>
      {subtitle ? <div className="mt-1 text-xs font-semibold opacity-90">{subtitle}</div> : null}
      {detail ? <div className="mt-2 text-[11px] leading-5 opacity-90">{detail}</div> : null}
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex min-w-8 items-center justify-center">
      <ArrowRight className="h-4 w-4 text-slate-400" />
    </div>
  );
}

function ParentAdmissionsBlueprint() {
  return (
    <SoftCard className="overflow-hidden border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700">
            <Route className="h-3.5 w-3.5" />
            Visual admissions map
          </div>
          <h3 className="mt-3 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
            See the whole process before the panic starts
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            This turns the medicine admissions journey into one parent-friendly visual: the main
            route, the interview lane, and the admin tasks that quietly matter.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
          One-glance roadmap
        </div>
      </div>

      <div className="mt-6 hidden xl:block">
        <div className="overflow-x-auto pb-2">
          <div className="min-w-max rounded-3xl border border-slate-200 bg-linear-to-b from-sky-50 via-white to-violet-50 p-6">
            <div className="flex justify-center">
              <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-3xl border border-sky-200 bg-sky-50 px-4 py-3 shadow-sm">
                {blueprintTopRail.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      <Icon className="h-4 w-4 text-sky-600" />
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex items-center">
              {blueprintMainFlow.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <BlueprintCard
                    title={step.title}
                    subtitle={step.subtitle}
                    tone={step.tone}
                    detail={step.detail}
                  />
                  {index < blueprintMainFlow.length - 1 ? <FlowArrow /> : null}
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-4 gap-4">
              {blueprintInterviewFlow.map((step) => (
                <BlueprintCard
                  key={step.id}
                  title={step.title}
                  subtitle={step.subtitle}
                  tone={step.tone}
                  detail={step.detail}
                  className="min-w-0"
                />
              ))}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-slate-900">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                  <p className="text-sm font-black tracking-tight">Academic lane</p>
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Subject choices, Year 12 performance, state assessment systems, and final ATAR.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-slate-900">
                  <ClipboardCheck className="h-4 w-4 text-violet-600" />
                  <p className="text-sm font-black tracking-tight">Selection lane</p>
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  UCAT, interviews, and offer movement can all keep shifting later than families
                  expect.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-slate-900">
                  <HeartHandshake className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-black tracking-tight">Parent lane</p>
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  TAC, accommodation, scholarships, enrolment, money, and fallback plans all need
                  structure too.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 xl:hidden">
        <div className="space-y-4">
          <div className="rounded-3xl border border-sky-200 bg-sky-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
              Parent admin layer
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {blueprintTopRail.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    <Icon className="h-3.5 w-3.5 text-sky-600" />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            {blueprintMainFlow.map((step, index) => (
              <div key={step.id}>
                <BlueprintCard
                  title={step.title}
                  subtitle={step.subtitle}
                  tone={step.tone}
                  detail={step.detail}
                  className="min-w-0"
                />
                {index < blueprintMainFlow.length - 1 ? (
                  <div className="flex justify-center py-2">
                    <ArrowRight className="h-4 w-4 rotate-90 text-slate-400" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-fuchsia-200 bg-fuchsia-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-700">
              Interview lane
            </p>
            <div className="mt-3 space-y-3">
              {blueprintInterviewFlow.map((step) => (
                <BlueprintCard
                  key={step.id}
                  title={step.title}
                  subtitle={step.subtitle}
                  tone={step.tone}
                  detail={step.detail}
                  className="min-w-0"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SoftCard>
  );
}

export default function ParentBlueprintPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [openSteps, setOpenSteps] = useState<string[]>([
    "classification",
    "ucat-exam",
    "interview-invite",
  ]);

  const toggleStep = (id: string) => {
    setOpenSteps((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-sky-100 blur-3xl" />
        <div className="absolute left-0 top-40 h-80 w-80 rounded-full bg-violet-100 blur-3xl" />
        <div className="absolute bottom-0 right-20 h-72 w-72 rounded-full bg-emerald-100 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
            Blueprint
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            <Sparkles className="h-3.5 w-3.5" />
            Parent Blueprint
          </span>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-sky-500 via-indigo-500 to-violet-500" />
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-100 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-violet-100 blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-4xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-sky-600 to-indigo-600 text-white shadow-lg shadow-sky-200">
                    <HeartHandshake className="h-6 w-6" />
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    Parent Blueprint
                  </h1>
                </div>
                <p className="text-sm leading-7 text-slate-600 sm:text-base">
                  A structured guide for families navigating Australian medical school admissions.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto">
                {heroBubbles.map((item) => (
                  <div
                    key={item.label}
                    className="min-h-24 rounded-3xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm"
                  >
                    <item.icon className="mb-2 h-4 w-4 text-indigo-600" />
                    <p className="text-sm font-semibold leading-5 text-slate-700">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <SoftCard className="mt-6 border-sky-200 bg-linear-to-r from-indigo-50 via-sky-50 to-white p-5">
              <h2 className="text-lg font-bold text-slate-950">What Parents Actually Need</h2>
              <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-700">
                Not more noise. Not more panic. Structure, clarity, timing, and risk reduction.
                This page is built to answer the questions families actually lose sleep over.
              </p>
            </SoftCard>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50/90 p-2 shadow-inner">
              <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
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
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                      )}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="parent-tab-pill"
                          className="absolute inset-0 rounded-2xl border border-slate-200 bg-white"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      ) : null}
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
                className="mt-6"
              >
                {activeTab === "overview" ? (
                  <OverviewSection openSteps={openSteps} toggleStep={toggleStep} />
                ) : null}
                {activeTab === "safeguard" ? <SafeguardSection /> : null}
                {activeTab === "financial" ? <FinancialSection /> : null}
                {activeTab === "planb" ? <PlanBSection /> : null}
                {activeTab === "support" ? <SupportSection /> : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewSection({
  openSteps,
  toggleStep,
}: {
  openSteps: string[];
  toggleStep: (id: string) => void;
}) {
  const quickPanels = [
    {
      title: "What this fixes",
      body: "Parents often know effort matters, but not sequence. This shows the order, where the pressure points are, and what can still move later.",
      icon: Lightbulb,
      tone: "border-amber-200 bg-amber-50 text-amber-950",
    },
    {
      title: "What this prevents",
      body: "Deadline misses, wrong assumptions about interviews, false panic after one result, and messy last-minute accommodation or finance decisions.",
      icon: Shield,
      tone: "border-rose-200 bg-rose-50 text-rose-950",
    },
    {
      title: "What this unlocks",
      body: "Calmer conversations, smarter planning, and a family that supports the student without adding avoidable chaos.",
      icon: Target,
      tone: "border-emerald-200 bg-emerald-50 text-emerald-950",
    },
  ];

  return (
    <div className="space-y-5">
      <ParentAdmissionsBlueprint />

      <div className="grid gap-4 lg:grid-cols-3">
        {quickPanels.map((panel) => {
          const Icon = panel.icon;
          return (
            <SoftCard key={panel.title} className={cx("border p-5", panel.tone)}>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black tracking-tight">{panel.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-7">{panel.body}</p>
            </SoftCard>
          );
        })}
      </div>

      <SoftCard className="p-5">
        <h3 className="text-lg font-black tracking-tight text-slate-950">
          The full medicine admissions journey, step by step
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Click each stage for the real meaning behind it — not just the label.
        </p>
      </SoftCard>

      <div className="relative pl-6 sm:pl-10">
        <div className="absolute left-2.5 top-0 h-full w-px bg-linear-to-b from-slate-300 via-indigo-200 to-emerald-300 sm:left-3.5" />

        <div className="space-y-4">
          {timelineSteps.map((step, index) => {
            const isOpen = openSteps.includes(step.id);
            const badgeTone =
              step.type === "decision"
                ? "bg-amber-100 text-amber-800"
                : step.type === "milestone"
                  ? "bg-violet-100 text-violet-800"
                  : "bg-sky-100 text-sky-800";

            return (
              <div key={step.id} className="relative">
                <div className="absolute -left-1 top-7 h-3 w-3 rounded-full border-2 border-white bg-slate-400 shadow sm:left-0" />

                <motion.button
                  whileHover={{ y: -1 }}
                  onClick={() => toggleStep(step.id)}
                  className={cx(
                    "w-full overflow-hidden rounded-3xl border border-slate-200 text-left shadow-sm",
                    isOpen ? "ring-2 ring-slate-200" : ""
                  )}
                >
                  <div className={cx("bg-linear-to-r px-5 py-4 text-white", step.color)}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {step.subtitle ? (
                            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
                              {step.subtitle}
                            </span>
                          ) : null}
                        </div>
                        <h4 className="text-lg font-black tracking-tight sm:text-xl">
                          {step.title}
                        </h4>
                      </div>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                        <ChevronDown
                          className={cx("h-5 w-5 transition", isOpen ? "rotate-180" : "rotate-0")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white px-5 py-4">
                    {step.chips ? (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {step.chips.map((chip) => (
                          <span
                            key={chip}
                            className={cx("rounded-full px-3 py-1 text-xs font-medium", badgeTone)}
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm leading-7 text-slate-700">{step.body}</p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SafeguardSection() {
  const sorted = [...safeguardItems].sort(
    (a, b) => severityRank(a.severity) - severityRank(b.severity)
  );

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-3xl font-black tracking-tight text-slate-950">
          Application Safeguard Checklist
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          The mistakes that quietly cost families a year.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            label: "Critical",
            value: safeguardItems.filter((i) => i.severity === "critical").length,
            tone: "border-rose-200 bg-rose-50 text-rose-950",
          },
          {
            label: "High",
            value: safeguardItems.filter((i) => i.severity === "high").length,
            tone: "border-amber-200 bg-amber-50 text-amber-950",
          },
          {
            label: "Medium",
            value: safeguardItems.filter((i) => i.severity === "medium").length,
            tone: "border-sky-200 bg-sky-50 text-sky-950",
          },
        ].map((item) => (
          <div key={item.label} className={cx("rounded-3xl border p-5", item.tone)}>
            <p className="text-xs font-bold uppercase tracking-[0.18em]">{item.label} risks</p>
            <p className="mt-2 text-3xl font-black">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {sorted.map((item, index) => {
          const style = severityStyle(item.severity);
          const Icon = severityIcon(item.severity);

          return (
            <SoftCard key={item.title} className={cx("overflow-hidden border-2", style.wrapper)}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cx(
                        "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                        style.iconBg
                      )}
                    >
                      <Icon className={cx("h-5 w-5", style.iconText)} />
                    </div>
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black tracking-tight text-slate-950">
                          {index + 1}. {item.title}
                        </span>
                        <span
                          className={cx(
                            "rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em]",
                            style.badge
                          )}
                        >
                          {item.severity}
                        </span>
                      </div>
                      <p className="text-sm leading-7 text-slate-700">{item.description}</p>
                    </div>
                  </div>
                </div>

                <div
                  className={cx("mt-4 rounded-2xl px-4 py-3 text-sm font-medium", style.actionBox)}
                >
                  <span className="font-bold">Action:</span> {item.action}
                </div>
              </div>
            </SoftCard>
          );
        })}
      </div>
    </div>
  );
}

function FinancialSection() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-3xl font-black tracking-tight text-slate-950">
          Financial Clarity Dashboard
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Indicative ranges only. Real cost varies by city, pathway, living arrangement, and
          university.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {[
          {
            icon: Wallet,
            label: "Tuition",
            body: "Know whether you are looking at CSP, BMP, domestic full fee, or international fee before comparing anything.",
          },
          {
            icon: Home,
            label: "Living",
            body: "Rent, transport, food, and whether the student stays at home changes the real total more than families expect.",
          },
          {
            icon: ScrollText,
            label: "HELP loans",
            body: "Deferred payment support can reduce upfront pressure, but it does not erase long-term exposure.",
          },
          {
            icon: Trophy,
            label: "Scholarships",
            body: "These can matter, but they should be viewed as a bonus rather than the core financial plan.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <SoftCard key={item.label} className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
                <Icon className="h-5 w-5 text-indigo-600" />
              </div>
              <h4 className="mt-3 text-base font-black tracking-tight text-slate-950">
                {item.label}
              </h4>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.body}</p>
            </SoftCard>
          );
        })}
      </div>

      <div className="grid gap-4">
        {financialCards.map((card) => (
          <SoftCard key={card.title} className={cx("border-2 p-5", card.tone)}>
            <h4 className="text-lg font-black tracking-tight text-slate-950">{card.title}</h4>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-white/60 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Annual cost
                </p>
                <p className="mt-2 text-2xl font-black text-slate-950">{card.annual}</p>
              </div>
              <div className="rounded-2xl bg-white/60 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Total exposure
                </p>
                <p className="mt-2 text-2xl font-black text-slate-950">{card.total}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-700">{card.note}</p>
          </SoftCard>
        ))}
      </div>

      <SoftCard className="p-5">
        <h4 className="text-lg font-black tracking-tight text-slate-950">
          Living Cost Estimate (per year)
        </h4>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { label: "Budget", value: "~$25K–$30K" },
            { label: "Moderate", value: "~$30K–$38K" },
            { label: "Comfortable", value: "~$38K–$50K+" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center"
            >
              <p className="text-sm font-semibold text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{item.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Actual living costs vary by city, rent, transport, and whether the student lives at
          home, in share housing, or in managed accommodation.
        </p>
      </SoftCard>
    </div>
  );
}

function PlanBSection() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-3xl font-black tracking-tight text-slate-950">
          The “What If They Don’t Get In?” Plan
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Re-route the plan. Do not collapse the student.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Mindset reset",
            body: "No single cycle defines the ceiling of the student.",
            icon: Sparkles,
          },
          {
            title: "Strategy reset",
            body: "Different pathways reward different strengths and timelines.",
            icon: Route,
          },
          {
            title: "Identity reset",
            body: "Medicine can stay the goal without becoming the only identity.",
            icon: Heart,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <SoftCard key={item.title} className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
                <Icon className="h-5 w-5 text-indigo-600" />
              </div>
              <h4 className="mt-3 text-base font-black tracking-tight text-slate-950">
                {item.title}
              </h4>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.body}</p>
            </SoftCard>
          );
        })}
      </div>

      <div className="space-y-4">
        {planCards.map((card) => (
          <SoftCard key={card.title} className={cx("border-2 p-5", card.tone)}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h4 className="text-xl font-black tracking-tight">{card.title}</h4>
                <p className="mt-3 text-sm leading-7">{card.body}</p>
              </div>
              <span className="rounded-full border border-current/20 bg-white/60 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]">
                {card.duration}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-600">{card.availability}</p>
            <div className="mt-4 rounded-2xl bg-white/60 px-4 py-3 text-sm font-semibold">
              {card.highlight}
            </div>
          </SoftCard>
        ))}
      </div>
    </div>
  );
}

function SupportSection() {
  return (
    <div className="space-y-5">
      <SoftCard className="p-6">
        <h3 className="text-xl font-black tracking-tight text-slate-950">
          Parent Support Framework
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Support without suffocating. Calm without passivity.
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-300 bg-emerald-50 p-5">
            <h4 className="text-lg font-black tracking-tight text-emerald-950">
              ✓ Do These Things
            </h4>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-emerald-950">
              {supportDo.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-rose-300 bg-rose-50 p-5">
            <h4 className="text-lg font-black tracking-tight text-rose-950">✕ Avoid These</h4>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-rose-950">
              {supportAvoid.map((item) => (
                <li key={item} className="flex gap-2">
                  <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-rose-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: School,
              title: "School support",
              body: "Use counsellors, teachers, and subject coordinators early rather than only when something has already gone wrong.",
            },
            {
              icon: Stethoscope,
              title: "Health support",
              body: "Persistent stress, appetite change, or sleep disruption is a reason to check in properly, not just push harder.",
            },
            {
              icon: HeartHandshake,
              title: "Home support",
              body: "A calm house often helps more than another speech about competition.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
                  <Icon className="h-5 w-5 text-indigo-600" />
                </div>
                <h4 className="mt-3 text-base font-black tracking-tight text-slate-950">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-3xl border border-amber-300 bg-amber-50 p-5">
          <h4 className="text-lg font-black tracking-tight text-amber-950">
            Early Warning Signs — When to Check In
          </h4>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {[
              "Consistent sleep disruption",
              "Irritability around study",
              "Loss of motivation for 2+ weeks",
              "Withdrawing from social activities",
              "Anxiety before every assessment",
              "Avoidance of application tasks",
            ].map((item) => (
              <div key={item} className="flex gap-2 text-sm text-amber-950">
                <div className="mt-2 h-2 w-2 rounded-full bg-amber-500" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-sky-300 bg-sky-50 p-5 text-sm leading-7 text-sky-950">
          <p className="font-bold">When to intervene</p>
          <p className="mt-2">
            If distress stays consistent for 2+ weeks, open a calm conversation. Ask what they need
            rather than only telling them what to do. Encourage access to a school counsellor, GP,
            or university wellbeing support where appropriate. Intervention is care.
          </p>
        </div>
      </SoftCard>
    </div>
  );
}

function severityRank(level: RiskLevel) {
  if (level === "critical") return 0;
  if (level === "high") return 1;
  return 2;
}

function severityIcon(level: RiskLevel) {
  if (level === "critical") return Siren;
  if (level === "high") return AlertTriangle;
  return CircleAlert;
}

function severityStyle(level: RiskLevel) {
  if (level === "critical") {
    return {
      wrapper: "border-rose-300 bg-gradient-to-br from-rose-50 to-white",
      iconBg: "bg-rose-100",
      iconText: "text-rose-700",
      badge: "bg-rose-600 text-white",
      actionBox: "bg-rose-100 text-rose-950",
    };
  }

  if (level === "high") {
    return {
      wrapper: "border-amber-300 bg-gradient-to-br from-amber-50 to-white",
      iconBg: "bg-amber-100",
      iconText: "text-amber-700",
      badge: "bg-amber-500 text-white",
      actionBox: "bg-amber-100 text-amber-950",
    };
  }

  return {
    wrapper: "border-sky-300 bg-gradient-to-br from-sky-50 to-white",
    iconBg: "bg-sky-100",
    iconText: "text-sky-700",
    badge: "bg-sky-500 text-white",
    actionBox: "bg-sky-100 text-sky-950",
  };
}