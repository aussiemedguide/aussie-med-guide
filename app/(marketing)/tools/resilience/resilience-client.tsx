"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import SignOutButton from "@/components/auth/sign-out-button";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookHeart,
  Brain,
  CheckCircle2,
  ChevronRight,
  Heart,
  Home,
  Info,
  MapPinned,
  Moon,
  Shield,
  Sparkles,
  Users,
  Lock,
} from "lucide-react";

type ResilienceTab =
  | "burnout"
  | "environment"
  | "reflection"
  | "week"
  | "parents"
  | "support"
  | "plan";

type ReflectionAnswer = 0 | 1 | 2;

type ReflectionQuestion = {
  id: string;
  title: string;
  options: {
    label: string;
    score: ReflectionAnswer;
  }[];
};

type StressBand = {
  title: string;
  subtitle: string;
  scoreLabel: string;
  description: string;
  actions: string[];
  tone: "green" | "amber" | "rose";
};

const storageKey = "amg-resilience-reflection";

const reflectionQuestions: ReflectionQuestion[] = [
  {
    id: "social",
    title: "1. What social environment do you thrive in?",
    options: [
      { label: "Large: I like anonymity and broad networks", score: 2 },
      { label: "Medium: a balance of community and space", score: 1 },
      { label: "Small: I want to know everyone around me", score: 0 },
    ],
  },
  {
    id: "pressure",
    title: "2. How do you respond to high-stakes, high-pressure exams?",
    options: [
      { label: "I thrive: pressure sharpens my focus", score: 2 },
      { label: "I manage: I need solid preparation to feel okay", score: 1 },
      { label: "I struggle: I need structured support systems around me", score: 0 },
    ],
  },
  {
    id: "competition",
    title: "3. How do you handle sustained competitive pressure over months or years?",
    options: [
      { label: "I welcome it: it drives me forward", score: 2 },
      { label: "I can handle it with good routines and support", score: 1 },
      { label: "It builds up: I need regular decompression and structure", score: 0 },
    ],
  },
  {
    id: "relocation",
    title: "4. How comfortable are you with frequent relocation for clinical placements?",
    options: [
      { label: "Very comfortable — I like moving around", score: 2 },
      { label: "Somewhat — I can adapt if necessary", score: 1 },
      { label: "Prefer stability — frequent moves would be draining", score: 0 },
    ],
  },
  {
    id: "finance",
    title: "5. How significant is financial stress as a concern for your wellbeing?",
    options: [
      { label: "Low — I have financial support or stability", score: 2 },
      { label: "Moderate — I will need to manage carefully", score: 1 },
      { label: "High — financial pressure is a real ongoing stressor", score: 0 },
    ],
  },
];

const environmentCards = [
  {
    title: "Large metro program",
    tone: "blue" as const,
    environment: "More anonymity, larger cohort, diverse social scene",
    risk: "Lower community support — high performers can feel invisible",
    best: "Suits self-directed, independent learners",
  },
  {
    title: "Small rural program (JCU, CDU)",
    tone: "green" as const,
    environment: "Tight community, everyone knows you, mission-driven cohort",
    risk: "Geographic isolation, limited social variety, demanding placement travel",
    best: "Suits purpose-driven students comfortable with rural life",
  },
  {
    title: "Interview-heavy culture (MMI schools)",
    tone: "violet" as const,
    environment: "More collaborative, holistic admission culture",
    risk: "Less purely score-based certainty — can feel values-heavy and personal",
    best: "Suits students who want peers selected for character, not just scores",
  },
  {
    title: "Travel-heavy clinical placements",
    tone: "indigo" as const,
    environment: "Rich clinical exposure, variety of settings",
    risk: "Physical and logistical fatigue compounds academic stress",
    best: "Suits adaptable students with strong routines and planning skills",
  },
];

const parentLensItems = [
  {
    title: "Avoid comparison language",
    text: `Phrases like "your cousin got in" or "why can't you be more like X" are actively harmful. Each student's path is unique.`,
  },
  {
    title: "Encourage sleep and routine",
    text: "Sleep is not a luxury in medicine. A parent who protects their student's sleep schedule is reducing burnout risk directly.",
  },
  {
    title: "Normalise struggle",
    text: "Medicine is hard. Telling a student they should be coping better amplifies shame. Normalise difficulty.",
  },
  {
    title: "Help with admin tasks",
    text: "Chasing placement logistics, accommodation, and deadline reminders is genuinely helpful. Handle the admin when possible.",
  },
  {
    title: "Avoid constant performance pressure",
    text: "Asking about scores every few days is pressure, not support. Ask how they are feeling, not how they are ranking.",
  },
];

const supportItems = [
  {
    title: "University Counselling Services",
    text: "Every Australian medical school offers free, confidential counselling. Not just crisis support — proactive wellbeing sessions are encouraged.",
  },
  {
    title: "Academic Advisors",
    text: "Dedicated academic advisors help with course planning, assessment issues, and navigating difficult periods without judgement.",
  },
  {
    title: "Faculty Support Programs",
    text: "Medical faculties often have dedicated student support officers who understand the specific pressures of medical training.",
  },
  {
    title: "Peer Mentoring",
    text: "Senior students in many programs formally mentor junior cohorts — someone who has been through exactly what you're facing.",
  },
  {
    title: "Rural Support Programs",
    text: "Students on rural placements often have dedicated wellbeing coordinators to address the unique isolation challenges of regional training.",
  },
];

const recoveryActions = [
  {
    title: "Sleep protection",
    text: "Treat sleep as the first line intervention, not the last. A stable bedtime beats random catch-up sleep.",
    icon: Moon,
    tone: "blue" as const,
  },
  {
    title: "Weekly decompression block",
    text: "Schedule one protected block every week with no academic output target. Recovery has to be deliberate.",
    icon: Brain,
    tone: "violet" as const,
  },
  {
    title: "Support-first planning",
    text: "Choose environments where help exists before you need it. Do not rely on future motivation alone.",
    icon: Shield,
    tone: "green" as const,
  },
  {
    title: "Identity beyond medicine",
    text: "Keep one non-medical part of your life alive. Burnout gets worse when your entire self-worth depends on one role.",
    icon: Heart,
    tone: "rose" as const,
  },
];

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function getStressBand(score: number): StressBand {
  if (score >= 8) {
    return {
      title: "Lower Environmental Stress Risk",
      subtitle: "Score:",
      scoreLabel: `${score}/10`,
      description:
        "Your responses suggest you are relatively adaptable across pressure, social scale, and logistical movement. That does not make you burnout-proof, but it means environment mismatch is less likely to be your biggest risk.",
      actions: [
        "Still choose a program with visible support systems",
        "Build routines early rather than reactively",
        "Protect sleep even when things seem manageable",
      ],
      tone: "green",
    };
  }

  if (score >= 4) {
    return {
      title: "Moderate Environmental Stress Risk",
      subtitle: "Score:",
      scoreLabel: `${score}/10`,
      description:
        "Your responses suggest you will manage well in the right environment, but some aspects of medical training may require active management. Program choice and structured routines will be important.",
      actions: [
        "Prioritise schools with strong pastoral care and student support",
        "Choose a program with a community feel if relocation was a concern",
        "Build your support network before you start, not after you need it",
      ],
      tone: "amber",
    };
  }

  return {
    title: "Higher Environmental Stress Risk",
    subtitle: "Score:",
    scoreLabel: `${score}/10`,
    description:
      "Your responses suggest that pressure, instability, or weak support structures may accumulate quickly if the environment is a poor fit. That is not a weakness — it means your choice of program matters even more.",
    actions: [
      "Actively favour supportive, community-oriented programs",
      "Plan finances, housing, and logistics early to reduce background stress",
      "Put formal support in place from day one",
    ],
    tone: "rose",
  };
}

export default function ResilienceClient({
  isPremium,
}: {
  isPremium: boolean;
}) {
  const [activeTab, setActiveTab] = useState<ResilienceTab>("burnout");
  const [answers, setAnswers] = useState<Record<string, ReflectionAnswer | null>>({
    social: null,
    pressure: null,
    competition: null,
    relocation: null,
    finance: null,
  });
  const [generatedProfile, setGeneratedProfile] = useState(false);
  const [normalWeekOpen, setNormalWeekOpen] = useState(true);
  const [parentOpen, setParentOpen] = useState(true);
  const [supportOpen, setSupportOpen] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (parsed?.answers) setAnswers(parsed.answers);
      if (typeof parsed?.generatedProfile === "boolean") {
        setGeneratedProfile(parsed.generatedProfile);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        answers,
        generatedProfile,
      })
    );
  }, [answers, generatedProfile]);

  const reflectionScore = useMemo(
    () =>
      Object.values(answers).reduce<number>(
        (sum, value) => sum + (value ?? 0),
        0
      ),
    [answers]
  );

  const band = getStressBand(reflectionScore);

  const completedAnswers = Object.values(answers).filter(
    (x) => x !== null
  ).length;

  function setAnswer(questionId: string, score: ReflectionAnswer) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: score,
    }));
  }

  function generateProfile() {
    setGeneratedProfile(true);
  }

  function resetReflection() {
    setAnswers({
      social: null,
      pressure: null,
      competition: null,
      relocation: null,
      finance: null,
    });
    setGeneratedProfile(false);
  }

  return (
    <FeatureGate
      locked={!isPremium}
      title="Upgrade to unlock Resilience"
      description="Explore the full burnout and resilience toolkit, including the self-reflection tool, support systems, parent lens, and recovery planning."
      ctaHref="/info/pricing"
      ctaLabel="Upgrade to Pro"
      previewLabel="Resilience"
    >
      <main className="min-h-screen bg-[#eef3f8] text-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
              <span className="text-violet-500">Resilience</span>
              <span>•</span>
              <span>Burnout Function</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
              <Sparkles className="h-4 w-4" />
              Environment matters
            </div>
          </div>

          <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-violet-400 via-sky-500 to-emerald-400" />

            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-200/60">
                <Brain className="h-7 w-7" />
              </div>

              <div>
                <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
                  The Burnout Function™
                </h1>
                <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                  Not all medical schools feel the same. Environment matters.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-100/80 p-1.5">
              <div className="grid grid-cols-2 gap-1 md:grid-cols-4 xl:grid-cols-7">
                <TabButton
                  active={activeTab === "burnout"}
                  label="What is Burnout"
                  onClick={() => setActiveTab("burnout")}
                />
                <TabButton
                  active={activeTab === "environment"}
                  label="Environment and Uni"
                  onClick={() => setActiveTab("environment")}
                />
                <TabButton
                  active={activeTab === "reflection"}
                  label="Self-Reflection Tool"
                  onClick={() => setActiveTab("reflection")}
                />
                <TabButton
                  active={activeTab === "week"}
                  label="Normal Week"
                  onClick={() => setActiveTab("week")}
                />
                <TabButton
                  active={activeTab === "parents"}
                  label="Parent Lens"
                  onClick={() => setActiveTab("parents")}
                />
                <TabButton
                  active={activeTab === "support"}
                  label="Support Systems"
                  onClick={() => setActiveTab("support")}
                />
                <TabButton
                  active={activeTab === "plan"}
                  label="Recovery Plan"
                  onClick={() => setActiveTab("plan")}
                />
              </div>
            </div>
          </section>

          <div className="mt-6 space-y-6">
            {activeTab === "burnout" && (
              <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
                <h2 className="text-3xl font-bold tracking-[-0.03em] text-slate-950">
                  What Is Burnout in Medicine?
                </h2>

                <p className="mt-5 max-w-4xl text-base leading-8 text-slate-700">
                  Burnout is a well-documented occupational phenomenon in medicine. It is not weakness.
                  It is a predictable response to sustained high demands without adequate recovery or support.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <SoftCard
                    title="Emotional Exhaustion"
                    text="Feeling depleted, drained, unable to engage emotionally with patients or peers."
                    tone="violet"
                  />
                  <SoftCard
                    title="Cynicism"
                    text="Detachment from medicine, patients, or the meaning of your work."
                    tone="violet"
                  />
                  <SoftCard
                    title="Reduced Accomplishment"
                    text="Feeling like your efforts do not matter or produce meaningful results."
                    tone="violet"
                  />
                </div>

                <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-xl font-bold text-slate-950">Early Warning Signs</h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {[
                      "Sleep disruption",
                      "Persistent irritability",
                      "Avoidance of study or clinical work",
                      "Anxiety spikes before assessments",
                      "Loss of motivation lasting 2+ weeks",
                      "Feeling disconnected from your reasons for medicine",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3 text-sm text-slate-700">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeTab === "environment" && (
              <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
                <h2 className="text-3xl font-bold tracking-[-0.03em] text-slate-950">
                  Why University Choice Affects Burnout Risk
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Different environments suit different personalities. This is not about which is better —
                  it is about which fits you.
                </p>

                <div className="mt-6 space-y-4">
                  {environmentCards.map((card) => (
                    <EnvironmentCard key={card.title} {...card} />
                  ))}
                </div>
              </section>
            )}

            {activeTab === "reflection" && (
              <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
                <h2 className="text-3xl font-bold tracking-[-0.03em] text-slate-950">
                  Burnout Risk Self-Reflection Tool
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Not a medical diagnosis. A structured reflection to help you understand your environmental stress risk.
                </p>

                <div className="mt-6 space-y-4">
                  {reflectionQuestions.map((question) => (
                    <div
                      key={question.id}
                      className="rounded-3xl border border-violet-200 bg-violet-50/30 p-4"
                    >
                      <p className="text-sm font-semibold text-slate-900">{question.title}</p>
                      <div className="mt-4 space-y-3">
                        {question.options.map((option) => {
                          const selected = answers[question.id] === option.score;
                          return (
                            <button
                              key={option.label}
                              onClick={() => setAnswer(question.id, option.score)}
                              className={cn(
                                "flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left text-sm font-medium transition",
                                selected
                                  ? "border-violet-500 bg-linear-to-r from-violet-600 to-fuchsia-500 text-white shadow-sm"
                                  : "border-violet-200 bg-white text-violet-900 hover:bg-violet-50"
                              )}
                            >
                              <span>{option.label}</span>
                              {selected ? <CheckCircle2 className="h-4 w-4" /> : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={generateProfile}
                    disabled={completedAnswers !== reflectionQuestions.length}
                    className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Generate My Stress Risk Profile
                  </button>

                  <button
                    onClick={resetReflection}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
                  >
                    Reset
                  </button>
                </div>

                {generatedProfile ? (
                  <div
                    className={cn(
                      "mt-6 rounded-3xl border p-5 shadow-sm",
                      band.tone === "green" && "border-emerald-300 bg-emerald-50/70",
                      band.tone === "amber" && "border-amber-300 bg-amber-50/70",
                      band.tone === "rose" && "border-rose-300 bg-rose-50/70"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className={cn(
                          "mt-0.5 h-5 w-5 shrink-0",
                          band.tone === "green" && "text-emerald-700",
                          band.tone === "amber" && "text-amber-700",
                          band.tone === "rose" && "text-rose-700"
                        )}
                      />
                      <div>
                        <h3
                          className={cn(
                            "text-2xl font-bold",
                            band.tone === "green" && "text-emerald-900",
                            band.tone === "amber" && "text-amber-900",
                            band.tone === "rose" && "text-rose-900"
                          )}
                        >
                          {band.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {band.subtitle} {band.scoreLabel}
                        </p>
                        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
                          {band.description}
                        </p>

                        <div className="mt-5 rounded-2xl bg-white/60 p-4">
                          <div className="space-y-2">
                            {band.actions.map((item) => (
                              <div key={item} className="flex items-start gap-3 text-sm text-slate-700">
                                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </section>
            )}

            {activeTab === "week" && (
              <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
                <button
                  onClick={() => setNormalWeekOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-2xl text-left"
                >
                  <div>
                    <h2 className="text-3xl font-bold tracking-[-0.03em] text-slate-950">
                      What a “Normal Week” Actually Feels Like
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Grounding expectations reduces shock. Shock increases burnout risk.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                    {normalWeekOpen ? "Hide" : "Show"}
                  </div>
                </button>

                {normalWeekOpen ? (
                  <>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div className="rounded-3xl border border-blue-200 bg-blue-50/50 p-5">
                        <h3 className="text-xl font-bold text-blue-900">Pre-Clinical Years (Years 1–2)</h3>
                        <div className="mt-4 space-y-2 text-sm text-slate-700">
                          <p>• 15–25 contact hours per week</p>
                          <p>• 10–20 hours of self-directed study</p>
                          <p>• Skills laboratories and simulation sessions</p>
                          <p>• Group-based problem solving and PBL</p>
                          <p>• Assessment-heavy periods every 4–8 weeks</p>
                          <p>• Community placement exposure begins</p>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-5">
                        <h3 className="text-xl font-bold text-emerald-900">Clinical Years (Years 3–6)</h3>
                        <div className="mt-4 space-y-2 text-sm text-slate-700">
                          <p>• Early morning hospital rounds (6–7am starts)</p>
                          <p>• Long hospital days (8–10+ hours)</p>
                          <p>• Frequent relocation for placement rotations</p>
                          <p>• Emotional exposure to illness, death, and family grief</p>
                          <p>• OSCE and clinical assessment blocks</p>
                          <p>• Self-care becomes a deliberate practice, not a default</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-3xl border border-amber-300 bg-amber-50/70 p-5 shadow-sm">
                      <p className="text-sm leading-7 text-amber-900">
                        <span className="font-semibold">The core message:</span> Medicine is demanding by design.
                        Not because systems are broken, but because clinical training requires genuine depth of engagement.
                        Students who enter with accurate expectations are better equipped to manage without breaking.
                      </p>
                    </div>
                  </>
                ) : null}
              </section>
            )}

            {activeTab === "parents" && (
              <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
                <button
                  onClick={() => setParentOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-2xl text-left"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-rose-500" />
                      <h2 className="text-3xl font-bold tracking-[-0.03em] text-slate-950">
                        Parent Lens: How to Reduce Burnout Risk
                      </h2>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Parents have a measurable impact on student wellbeing during medical school.
                      This is a practical framework, not a guilt trip.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                    {parentOpen ? "Hide" : "Show"}
                  </div>
                </button>

                {parentOpen ? (
                  <div className="mt-6 grid gap-4 md:max-w-3xl">
                    {parentLensItems.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-5"
                      >
                        <p className="text-base font-bold text-emerald-900">✓ {item.title}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">{item.text}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            )}

            {activeTab === "support" && (
              <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
                <button
                  onClick={() => setSupportOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-2xl text-left"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-violet-600" />
                      <h2 className="text-3xl font-bold tracking-[-0.03em] text-slate-950">
                        Built-In Support Systems
                      </h2>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Every Australian medical school has these safety nets. Know they exist before you need them.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                    {supportOpen ? "Hide" : "Show"}
                  </div>
                </button>

                {supportOpen ? (
                  <>
                    <div className="mt-6 space-y-4">
                      {supportItems.map((item) => (
                        <div
                          key={item.title}
                          className="rounded-3xl border border-violet-200 bg-violet-50/40 p-5"
                        >
                          <p className="text-lg font-bold text-violet-900">{item.title}</p>
                          <p className="mt-2 text-sm leading-7 text-slate-700">{item.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-base font-semibold text-slate-900">Key insight:</p>
                      <p className="mt-2 text-sm leading-7 text-slate-700">
                        The students who access support services proactively — not just in crisis —
                        consistently report better outcomes. These systems are not for students who are
                        “failing.” They are for students who are being strategic about their wellbeing.
                      </p>
                    </div>
                  </>
                ) : null}
              </section>
            )}

            {activeTab === "plan" && (
              <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <BookHeart className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-3xl font-bold tracking-[-0.03em] text-slate-950">
                    Resilience Recovery Plan
                  </h2>
                </div>

                <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
                  This is the extra layer I would add. Burnout education is useful, but students also need a simple
                  practical model for what to actually do before things spiral.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {recoveryActions.map((item) => (
                    <RecoveryCard key={item.title} {...item} />
                  ))}
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-xl font-bold text-slate-950">My 5-Part Baseline</h3>
                    <div className="mt-4 space-y-3">
                      {[
                        "1. Sleep target: minimum realistic weekday sleep floor",
                        "2. Weekly check-in: one honest wellbeing check every Sunday",
                        "3. Support trigger: the exact point where I ask for help",
                        "4. Protected non-med block: one recurring activity unrelated to medicine",
                        "5. Placement logistics plan: housing, travel, finances mapped early",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3 text-sm text-slate-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-sky-200 bg-sky-50/60 p-5">
                    <h3 className="text-xl font-bold text-sky-900">Who this helps most</h3>
                    <div className="mt-4 space-y-3 text-sm text-slate-700">
                      <div className="flex items-start gap-3">
                        <Users className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                        <span>Students who know they can perform, but struggle with accumulation.</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPinned className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                        <span>Students worried about relocation, instability, or weak community fit.</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Home className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                        <span>Students whose family environment strongly affects their stress load.</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                        <span>Students who want to be strategic, not reactive, about wellbeing.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </FeatureGate>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl px-3 py-2 text-sm font-semibold transition",
        active
          ? "bg-violet-600 text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      )}
    >
      {label}
    </button>
  );
}

function SoftCard({
  title,
  text,
  tone,
}: {
  title: string;
  text: string;
  tone: "violet" | "blue" | "green";
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-5",
        tone === "violet" && "border-violet-200 bg-violet-50/40",
        tone === "blue" && "border-blue-200 bg-blue-50/40",
        tone === "green" && "border-emerald-200 bg-emerald-50/40"
      )}
    >
      <p
        className={cn(
          "text-xl font-bold",
          tone === "violet" && "text-violet-900",
          tone === "blue" && "text-blue-900",
          tone === "green" && "text-emerald-900"
        )}
      >
        {title}
      </p>
      <p className="mt-3 text-sm leading-7 text-slate-700">{text}</p>
    </div>
  );
}

function EnvironmentCard({
  title,
  tone,
  environment,
  risk,
  best,
}: {
  title: string;
  tone: "blue" | "green" | "violet" | "indigo";
  environment: string;
  risk: string;
  best: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-5",
        tone === "blue" && "border-blue-200 bg-blue-50/40",
        tone === "green" && "border-emerald-200 bg-emerald-50/40",
        tone === "violet" && "border-violet-200 bg-violet-50/40",
        tone === "indigo" && "border-indigo-200 bg-indigo-50/40"
      )}
    >
      <h3 className="text-xl font-bold text-slate-950">{title}</h3>

      <div className="mt-4 space-y-3">
        <LabelBlock label="Environment:" text={environment} tone="blue" />
        <LabelBlock label="Risk factor:" text={risk} tone="amber" />
        <LabelBlock label="Best fit:" text={best} tone="green" />
      </div>
    </div>
  );
}

function LabelBlock({
  label,
  text,
  tone,
}: {
  label: string;
  text: string;
  tone: "blue" | "amber" | "green";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm",
        tone === "blue" && "border-blue-200 bg-blue-100/60 text-blue-900",
        tone === "amber" && "border-amber-200 bg-amber-50 text-amber-900",
        tone === "green" && "border-emerald-200 bg-emerald-50 text-emerald-900"
      )}
    >
      <span className="font-semibold">{label}</span> {text}
    </div>
  );
}

function RecoveryCard({
  title,
  text,
  icon: Icon,
  tone,
}: {
  title: string;
  text: string;
  icon: ComponentType<{ className?: string }>;
  tone: "blue" | "violet" | "green" | "rose";
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-5 shadow-sm",
        tone === "blue" && "border-blue-200 bg-blue-50/50",
        tone === "violet" && "border-violet-200 bg-violet-50/50",
        tone === "green" && "border-emerald-200 bg-emerald-50/50",
        tone === "rose" && "border-rose-200 bg-rose-50/50"
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-2xl text-white",
          tone === "blue" && "bg-blue-600",
          tone === "violet" && "bg-violet-600",
          tone === "green" && "bg-emerald-600",
          tone === "rose" && "bg-rose-500"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-4 text-lg font-bold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-700">{text}</p>
    </div>
  );
}

function FeatureGate({
  locked,
  title,
  description,
  ctaHref,
  ctaLabel,
  previewLabel,
  children,
}: {
  locked: boolean;
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  previewLabel: string;
  children: ReactNode;
}) {
  return (
    <section className="relative">
      <div
        className={cn(
          "transition",
          locked ? "pointer-events-none select-none blur-md opacity-40" : ""
        )}
      >
        {children}
      </div>

      {locked ? (
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl">
            <Lock className="mx-auto mb-3 h-6 w-6 text-slate-700" />
            <p className="text-xs uppercase tracking-widest text-slate-500">
              {previewLabel}
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{description}</p>

            <Link
              href={ctaHref}
              className="mt-4 inline-block rounded-xl bg-black px-4 py-2 text-white"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}