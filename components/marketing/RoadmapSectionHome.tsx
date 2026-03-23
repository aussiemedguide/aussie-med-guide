"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, ShieldCheck, Target } from "lucide-react";

type RoadmapStageKey = "year10_11" | "year12" | "gap" | "grad";

type RoadmapSection = {
  title: string;
  badge: string;
  tone: string;
  items: string[];
};

type StageData = {
  label: string;
  shortLabel: string;
  chip: string;
  dot: string;
  panelTone: string;
  focus: string;
  objective: string;
  actions: { label: string; href: string }[];
  priorities: string[];
  sections: RoadmapSection[];
  mistakes: string[];
  needle: string;
};

const roadmapData: Record<RoadmapStageKey, StageData> = {
  year10_11: {
    label: "Year 10 or 11",
    shortLabel: "Year 10 or 11",
    chip: "bg-emerald-600 text-white",
    dot: "bg-emerald-400",
    panelTone: "border-emerald-300 bg-emerald-50",
    focus: "Foundation + Optionality",
    objective: "Build academic trajectory and explore medicine realistically.",
    actions: [
      { label: "Choose Subjects Strategically", href: "/explore/pathway" },
      { label: "Understand Pathways Early", href: "/explore/choose-your-uni" },
      {
        label: "Check Student Classification",
        href: "/explore/student-classification",
      },
    ],
    priorities: [
      "Choose prerequisite subjects early. Chemistry is non-negotiable in most states.",
      "Select Maths that keeps science pathways open.",
      "Build study systems, not cramming habits.",
    ],
    sections: [
      {
        title: "Academics",
        badge: "High",
        tone: "border-amber-300 bg-amber-50 text-amber-900",
        items: [
          "Choose prerequisite subjects early. Chemistry is non-negotiable in most states.",
          "Select Maths that keeps science pathways open.",
          "Track academic performance trends, not just one-off scores.",
          "Build study systems, not cramming habits.",
        ],
      },
      {
        title: "Explore the Field",
        badge: "Medium",
        tone: "border-blue-300 bg-blue-50 text-blue-900",
        items: [
          "Shadow a doctor if possible.",
          "Volunteer casually. Do not over-engineer it.",
          "Read about rural pathways vs metro pathways.",
          "This is the awareness stage, not the performance stage.",
        ],
      },
      {
        title: "Skill Development",
        badge: "Medium",
        tone: "border-violet-300 bg-violet-50 text-violet-900",
        items: [
          "Start developing communication skills.",
          "Public speaking and team participation matter.",
          "Take on leadership roles where natural.",
          "Interview performance starts years earlier than people think.",
        ],
      },
      {
        title: "Mental Framework",
        badge: "Important",
        tone: "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-900",
        items: [
          "Parents and students should ask: is this intrinsic motivation or external pressure?",
          "Medicine is a long-term commitment. Burnout risk starts early.",
          "There is no rush. Foundation is everything.",
        ],
      },
    ],
    mistakes: [
      "Over-scheduling extracurriculars to ‘tick boxes’ before Year 12",
      "Choosing subjects based on what friends are doing",
      "Ignoring ATAR ceiling of your subject combination",
      "Assuming rural pathways are a last resort",
    ],
    needle:
      "Subject selection and study habit formation. These compound over two years.",
  },
  year12: {
    label: "Year 12",
    shortLabel: "Year 12",
    chip: "bg-rose-600 text-white",
    dot: "bg-rose-400",
    panelTone: "border-rose-300 bg-rose-50",
    focus: "Execution + Performance",
    objective: "Maximise ATAR, UCAT, and interview readiness.",
    actions: [
      { label: "Build UCAT Strategy", href: "/explore/offers-selection" },
      { label: "Check Competitiveness", href: "/explore/statistics" },
      { label: "Plan Preferences", href: "/explore/application-systems" },
    ],
    priorities: [
      "Protect your core subjects. Avoid spreading yourself thin.",
      "Run a structured UCAT weekly prep schedule with timed drills.",
      "Start interview preparation before offers arrive.",
    ],
    sections: [
      {
        title: "ATAR Strategy",
        badge: "Critical",
        tone: "border-rose-300 bg-rose-50 text-rose-900",
        items: [
          "Protect your core subjects.",
          "Avoid spreading yourself thin.",
          "Prioritise exam technique over content volume.",
          "Internal assessment marks are controllable. Own them.",
        ],
      },
      {
        title: "UCAT Plan",
        badge: "Critical",
        tone: "border-orange-300 bg-orange-50 text-orange-900",
        items: [
          "Structured weekly prep schedule with timed drills.",
          "Performance review cycles, not just passive practice.",
          "Simulate exam conditions 6 to 8 weeks before test day.",
          "Track percentile trajectory, not raw score obsession.",
        ],
      },
      {
        title: "Interview Preparation",
        badge: "High",
        tone: "border-amber-300 bg-amber-50 text-amber-900",
        items: [
          "Start before offers arrive.",
          "Understand MMI structure and station types.",
          "Practise ethical reasoning with structure.",
          "Develop response frameworks, not scripted answers.",
        ],
      },
      {
        title: "Application Strategy",
        badge: "High",
        tone: "border-yellow-300 bg-yellow-50 text-yellow-900",
        items: [
          "Choose schools strategically, not emotionally.",
          "Understand weighting differences between schools.",
          "Apply interstate if your scores are competitive.",
          "Understand preference ordering before preferences open.",
        ],
      },
      {
        title: "Emotional Regulation",
        badge: "Do Not Skip",
        tone: "border-pink-300 bg-pink-50 text-pink-900",
        items: [
          "Year 12 burnout is common and real.",
          "Implement weekly reset routines.",
          "Protect sleep. Non-negotiable.",
          "High performers often fail due to emotional collapse, not academics.",
        ],
      },
    ],
    mistakes: [
      "Peaking UCAT prep too early and losing consistency",
      "Choosing preference order based on prestige, not personal fit",
      "Neglecting interview preparation until after offers",
      "Sacrificing sleep for study volume",
    ],
    needle:
      "UCAT percentile trajectory and interview readiness. These are the controllable variables.",
  },
  gap: {
    label: "Gap Year",
    shortLabel: "Gap Year",
    chip: "bg-blue-600 text-white",
    dot: "bg-blue-400",
    panelTone: "border-blue-300 bg-blue-50",
    focus: "Optimisation + Recalibration",
    objective: "Increase competitiveness intentionally. Not reactively.",
    actions: [
      { label: "Re-Application Strategy", href: "/explore/medical-schools" },
      { label: "Model Score Improvements", href: "/explore/statistics" },
      { label: "Strengthen Portfolio", href: "/resources/opportunities" },
    ],
    priorities: [
      "Identify your weakest variable honestly: ATAR, UCAT, or interview?",
      "Analyse previous UCAT percentile breakdown by subtest.",
      "Strengthen the one thing that would change your outcome.",
    ],
    sections: [
      {
        title: "Performance Audit",
        badge: "Start Here",
        tone: "border-emerald-300 bg-emerald-50 text-emerald-900",
        items: [
          "Be honest about where the gap actually was.",
          "Was it ATAR? UCAT? Interview? Strategy selection?",
          "Identify the weakest variable with data, not gut feeling.",
          "One honest hour of audit beats weeks of unfocused prep.",
        ],
      },
      {
        title: "UCAT Retake Strategy",
        badge: "High",
        tone: "border-amber-300 bg-amber-50 text-amber-900",
        items: [
          "Analyse previous percentile breakdown by subtest.",
          "Focus on the weakest subtest, not overall score.",
          "Simulate pressure conditions from Week 1.",
          "Avoid repeating the same study approach and expecting different results.",
        ],
      },
      {
        title: "Experience Enhancement",
        badge: "Medium",
        tone: "border-blue-300 bg-blue-50 text-blue-900",
        items: [
          "Clinical volunteering in a health setting.",
          "Health-related employment if available.",
          "Research assistant roles at a university.",
          "Depth over certificate stacking.",
        ],
      },
      {
        title: "Strategic School Re-ranking",
        badge: "Important",
        tone: "border-violet-300 bg-violet-50 text-violet-900",
        items: [
          "Consider interstate applications.",
          "Rural quota advantages if eligible.",
          "Schools with interview-heavy weighting if that is your strength.",
          "Optimisation, not repetition of the same plan.",
        ],
      },
    ],
    mistakes: [
      "Doing the same preparation and expecting different results",
      "Not identifying which variable actually cost the offer",
      "Passively drifting through the gap year without a structured plan",
      "Underestimating interstate options",
    ],
    needle:
      "Diagnosing the actual bottleneck. Everything else depends on this.",
  },
  grad: {
    label: "Graduate Applicant",
    shortLabel: "Graduate Applicant",
    chip: "bg-violet-600 text-white",
    dot: "bg-violet-400",
    panelTone: "border-violet-300 bg-violet-50",
    focus: "Strategic Positioning",
    objective:
      "Maximise GPA, GAMSAT, and portfolio positioning for the right schools.",
    actions: [
      { label: "Compare Entry Requirements", href: "/explore/choose-your-uni" },
      { label: "Understand Selection Models", href: "/explore/pathway" },
      { label: "Interview Preparation", href: "/explore/pathway" },
    ],
    priorities: [
      "Understand weighted vs unweighted GPA. Final year subjects matter heavily.",
      "Treat GAMSAT as a long-term build. Section 3 science competence is critical.",
      "Apply where your strengths align with school weighting models.",
    ],
    sections: [
      {
        title: "GPA Protection",
        badge: "Critical",
        tone: "border-rose-300 bg-rose-50 text-rose-900",
        items: [
          "Understand weighted vs unweighted GPA calculations.",
          "Final year subjects carry the most weight at most schools.",
          "Avoid tanking GPA with an overloaded semester.",
          "One strong year can recalibrate your competitive position.",
        ],
      },
      {
        title: "GAMSAT Strategy",
        badge: "Critical",
        tone: "border-orange-300 bg-orange-50 text-orange-900",
        items: [
          "Treat as a long-term build, not a cramming exercise.",
          "Section 3 science competence is non-negotiable.",
          "Structured review cycles with full-length simulations.",
          "Section 2 writing can be trained more quickly than Section 3.",
        ],
      },
      {
        title: "School Weighting Analysis",
        badge: "High",
        tone: "border-amber-300 bg-amber-50 text-amber-900",
        items: [
          "Compare GPA-heavy schools vs GAMSAT-heavy schools.",
          "Identify portfolio and interview-weighted schools.",
          "Apply where your specific strengths align.",
          "Do not apply everywhere. Apply strategically.",
        ],
      },
      {
        title: "Financial Planning",
        badge: "Important",
        tone: "border-violet-300 bg-violet-50 text-violet-900",
        items: [
          "Graduate entry often requires relocation.",
          "Understand HECS-HELP strategy across programs.",
          "Full-fee vs CSP place analysis at each school.",
          "Bonded Medical Program implications if applicable.",
        ],
      },
      {
        title: "Interview Maturity",
        badge: "High",
        tone: "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-900",
        items: [
          "Graduate applicants are assessed differently to school leavers.",
          "Depth of insight and life reflection is expected.",
          "Ethical nuance and emotional intelligence are assessed.",
          "Your lived experiences are assets. Use them deliberately.",
        ],
      },
    ],
    mistakes: [
      "Applying to every school without analysing weighting models",
      "Underestimating GAMSAT Section 3 preparation time",
      "Not understanding how GPA is calculated at specific schools",
      "Treating graduate entry as a consolation pathway rather than a distinct strategic choice",
    ],
    needle:
      "School selection aligned to your strength profile. GPA and GAMSAT both matter, but which one matters more depends on where you apply.",
  },
};

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function RoadmapPanel({ stage }: { stage: StageData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="space-y-4"
    >
      <div className={cx("rounded-3xl border p-4 sm:p-5", stage.panelTone)}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <span
              className={cx(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] shadow-sm",
                stage.chip
              )}
            >
              {stage.shortLabel}
            </span>
            <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Focus: {stage.focus}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Objective: {stage.objective}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {stage.actions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                {action.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-5 border-t border-slate-200/80 pt-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Top 3 Priorities
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-700">
            {stage.priorities.map((priority) => (
              <li key={priority}>{priority}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {stage.sections.map((section) => (
          <div
            key={section.title}
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <h4 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                {section.title}
              </h4>
              <span
                className={cx(
                  "w-fit rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em]",
                  section.tone
                )}
              >
                {section.badge}
              </span>
            </div>

            <ul className="space-y-2 text-sm leading-7 text-slate-700">
              {section.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-amber-300 bg-amber-50 p-4 sm:p-5">
        <h4 className="inline-flex items-center gap-2 text-lg font-black tracking-tight text-amber-950 sm:text-xl">
          <ShieldCheck className="h-5 w-5" />
          Common Mistakes at This Stage
        </h4>
        <ul className="mt-3 space-y-2 text-sm leading-7 text-amber-900">
          {stage.mistakes.map((mistake) => (
            <li key={mistake} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
              <span>{mistake}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-emerald-300 bg-emerald-50 p-4 sm:p-5">
        <h4 className="inline-flex items-center gap-2 text-lg font-black tracking-tight text-emerald-950 sm:text-xl">
          <Target className="h-5 w-5" />
          What Moves the Needle Most
        </h4>
        <p className="mt-2 text-sm leading-7 text-emerald-900">
          {stage.needle}
        </p>
      </div>
    </motion.div>
  );
}

export default function RoadmapSectionHome() {
  const [activeStage, setActiveStage] =
    useState<RoadmapStageKey>("year10_11");
  const [expanded, setExpanded] = useState(false);

  const currentStage = useMemo(() => roadmapData[activeStage], [activeStage]);

  const stageButtons: {
    key: RoadmapStageKey;
    label: string;
    dot: string;
    activeTone: string;
  }[] = [
    {
      key: "year10_11",
      label: "Year 10 or 11",
      dot: "bg-emerald-400",
      activeTone:
        "from-emerald-500 to-teal-500 text-white border-emerald-400",
    },
    {
      key: "year12",
      label: "Year 12",
      dot: "bg-rose-400",
      activeTone:
        "from-rose-500 to-orange-500 text-white border-rose-400",
    },
    {
      key: "gap",
      label: "Gap Year",
      dot: "bg-blue-400",
      activeTone:
        "from-blue-500 to-indigo-500 text-white border-blue-400",
    },
    {
      key: "grad",
      label: "Graduate Applicant",
      dot: "bg-violet-400",
      activeTone:
        "from-violet-500 to-purple-500 text-white border-violet-400",
    },
  ];

  return (
    <section className="mb-10 sm:mb-12">
      <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-linear-to-b from-emerald-50/65 to-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-6">
        <button
          onClick={() => setExpanded((value) => !value)}
          className="flex w-full items-start justify-between gap-3 text-left sm:gap-4"
        >
          <div className="mx-auto max-w-4xl flex-1 text-center">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:px-4 sm:py-2 sm:text-sm">
              Your Roadmap
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Where are you in your journey?
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              Select your current stage to see a structured roadmap, priorities,
              and what actually moves the needle.
            </p>
          </div>

          <div className="rounded-full border border-slate-200 bg-white p-2 shadow-sm">
            <ChevronDown
              className={cx(
                "h-5 w-5 text-slate-500 transition",
                expanded ? "rotate-180" : "rotate-0"
              )}
            />
          </div>
        </button>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {stageButtons.map((stage) => {
            const isActive = activeStage === stage.key;

            return (
              <button
                key={stage.key}
                onClick={() => {
                  setActiveStage(stage.key);
                  setExpanded(true);
                }}
                className={cx(
                  "rounded-2xl border px-4 py-4 text-left shadow-sm transition duration-200 sm:px-5 sm:py-5",
                  isActive
                    ? `bg-linear-to-br ${stage.activeTone}`
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cx(
                      "h-3.5 w-3.5 shrink-0 rounded-full shadow-sm sm:h-4 sm:w-4",
                      stage.dot
                    )}
                  />
                  <span className="text-lg font-black tracking-tight sm:text-xl">
                    {stage.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-6">
                <RoadmapPanel stage={currentStage} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}