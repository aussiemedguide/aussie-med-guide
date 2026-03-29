export type ArenaBossId =
  | "warm_up_clinician"
  | "time_pressure_registrar"
  | "ethics_examiner"
  | "panel_gauntlet"
  | "deans_circuit";

export type ArenaMode = "mmi" | "panel";

export type MomentumState =
  | "cold"
  | "warming_up"
  | "active"
  | "locked_in"
  | "elite";

export type ArenaPressure = "low" | "moderate" | "high" | "intense" | "extreme";

export type ArenaTheme =
  | "motivation"
  | "communication"
  | "teamwork"
  | "compassion"
  | "prioritisation"
  | "resilience"
  | "stress"
  | "ethics"
  | "confidentiality"
  | "fairness"
  | "professionalism"
  | "leadership"
  | "reflection"
  | "rural"
  | "health_equity";

export type QuestionDifficulty =
  | "foundational"
  | "intermediate"
  | "advanced"
  | "elite";

export type EvidenceExpectation = "optional" | "preferred" | "required";
export type ReasoningDemand = "light" | "moderate" | "high";
export type ArenaPromptType = "personal" | "ethical" | "situational" | "systems";
export type FollowUpStyle = "supportive" | "probing" | "pressured" | "adversarial";

export type ArenaCategory =
  | "clarity"
  | "reasoning"
  | "empathy"
  | "structure"
  | "professionalism";

export type ArenaQuestion = {
  id: string;
  theme: ArenaTheme;
  prompt: string;
  promptType: ArenaPromptType;
  difficulty: QuestionDifficulty;
  evidenceExpectation: EvidenceExpectation;
  reasoningDemand: ReasoningDemand;
  ambiguity: 1 | 2 | 3 | 4 | 5;
  interviewerAngle: string;
  followUps: string[];
  tags?: string[];
};

export type ArenaQuestionSelectionRule = {
  minByTheme?: Partial<Record<ArenaTheme, number>>;
  minByPromptType?: Partial<Record<ArenaPromptType, number>>;
  minHighAmbiguity?: number;
  minRequiredEvidence?: number;
  minHighReasoning?: number;
};

export type ArenaBoss = {
  id: ArenaBossId;
  level: number;
  name: string;
  title: string;
  roleplayIntro: string;
  evaluatorStyle: string;
  unlockVitals: number;
  requiresMomentum?: MomentumState;
  rewardVitals: number;
  mode: ArenaMode;
  timeLimitSeconds: number;
  questionCount: number;
  difficultyLabel: string;
  questionThemes: ArenaTheme[];
  pressureLabel: ArenaPressure;
  minPassOverall: number;
  minCategoryScore: number;
  followUpCount: number;
  followUpStyle: FollowUpStyle;
  recommendedWordsMin: number;
  recommendedWordsMax: number;
  antiFluffTolerance: number;
  antiRepetitionTolerance: number;
  sessionRules: ArenaQuestionSelectionRule;
  priorityWeights: {
    clarity: number;
    reasoning: number;
    empathy: number;
    structure: number;
    professionalism: number;
  };
  bossPenalties: {
    longAnswerPenaltyMultiplier: number;
    lowSpecificityPenaltyMultiplier: number;
    lowBalancePenaltyMultiplier: number;
    lowEvidencePenaltyMultiplier: number;
    weakProfessionalismPenaltyMultiplier: number;
  };
};

export type ArenaSessionPayload = {
  boss: ArenaBoss;
  questions: ArenaQuestion[];
  introScript: string;
};

export type ArenaScoreBreakdown = {
  clarity: number; // 0-25
  reasoning: number; // 0-25
  empathy: number; // 0-25
  structure: number; // 0-25
  professionalism: number; // 0-25
  overall: number; // 0-100
};

export type ArenaResult = "won" | "lost" | "completed";

export type ArenaStationOutcome = {
  questionId: string;
  questionPrompt: string;
  theme: ArenaTheme;
  passed: boolean;
  verdict: "strong" | "pass" | "borderline" | "fail";
  breakdown: ArenaScoreBreakdown;
  feedback: string;
  topWeaknesses: ArenaCategory[];
  followUpPressure: number;
  penaltiesApplied: string[];
};

export type ArenaSessionOutcome = {
  breakdown: ArenaScoreBreakdown;
  result: ArenaResult;
  pass: boolean;
  feedback: string;
  vitalsAwarded: number;
  bossRewardAwarded: number;
  totalVitalsAwarded: number;
  averageOverall: number;
  stationOutcomes: ArenaStationOutcome[];
  failedStations: number;
  strongStations: number;
  sessionFlags: string[];
};

export type ArenaRubricPromptSet = {
  system: string;
  user: string;
};

const MOMENTUM_ORDER: MomentumState[] = [
  "cold",
  "warming_up",
  "active",
  "locked_in",
  "elite",
];

export const ARENA_BOSSES: ArenaBoss[] = [
  {
    id: "warm_up_clinician",
    level: 1,
    name: "Dr Maya Chen",
    title: "Warm-Up Clinician",
    roleplayIntro:
      "I’m Dr Maya Chen. I’m calm and fair, but I still expect substance. I reward clear thinking, honest reflection, and answers that sound human rather than rehearsed.",
    evaluatorStyle:
      "Warm but standards-based. Rewards structure, sincerity, relevance, and basic composure. More forgiving of nerves than vagueness.",
    unlockVitals: 0,
    rewardVitals: 30,
    mode: "mmi",
    timeLimitSeconds: 130,
    questionCount: 4,
    difficultyLabel: "Foundational",
    pressureLabel: "low",
    minPassOverall: 66,
    minCategoryScore: 12,
    followUpCount: 1,
    followUpStyle: "supportive",
    recommendedWordsMin: 95,
    recommendedWordsMax: 165,
    antiFluffTolerance: 0.9,
    antiRepetitionTolerance: 0.95,
    questionThemes: [
      "motivation",
      "communication",
      "teamwork",
      "compassion",
      "reflection",
    ],
    sessionRules: {
      minByPromptType: { personal: 2, situational: 1 },
      minByTheme: { motivation: 1, communication: 1 },
      minRequiredEvidence: 2,
      minHighReasoning: 1,
      minHighAmbiguity: 0,
    },
    priorityWeights: {
      clarity: 1.2,
      reasoning: 1,
      empathy: 1,
      structure: 1.2,
      professionalism: 0.9,
    },
    bossPenalties: {
      longAnswerPenaltyMultiplier: 0.8,
      lowSpecificityPenaltyMultiplier: 0.9,
      lowBalancePenaltyMultiplier: 0.75,
      lowEvidencePenaltyMultiplier: 0.95,
      weakProfessionalismPenaltyMultiplier: 0.85,
    },
  },
  {
    id: "time_pressure_registrar",
    level: 2,
    name: "Dr Leo Hart",
    title: "Time Pressure Registrar",
    roleplayIntro:
      "I’m Dr Leo Hart. I interrupt weak logic, punish rambling, and care whether you can stay composed when time is tight. Good instincts are useless if they arrive too slowly.",
    evaluatorStyle:
      "Fast, sharp, impatient with fluff. Rewards concise prioritisation, directness, and usable decision-making under time pressure.",
    unlockVitals: 160,
    rewardVitals: 45,
    mode: "mmi",
    timeLimitSeconds: 90,
    questionCount: 5,
    difficultyLabel: "Pressured",
    pressureLabel: "high",
    minPassOverall: 71,
    minCategoryScore: 13,
    followUpCount: 2,
    followUpStyle: "pressured",
    recommendedWordsMin: 80,
    recommendedWordsMax: 135,
    antiFluffTolerance: 0.6,
    antiRepetitionTolerance: 0.7,
    questionThemes: [
      "prioritisation",
      "stress",
      "resilience",
      "communication",
      "professionalism",
    ],
    sessionRules: {
      minByPromptType: { situational: 2, personal: 1, ethical: 1 },
      minByTheme: { prioritisation: 1, stress: 1, professionalism: 1 },
      minRequiredEvidence: 1,
      minHighReasoning: 2,
      minHighAmbiguity: 1,
    },
    priorityWeights: {
      clarity: 1.25,
      reasoning: 1.12,
      empathy: 0.85,
      structure: 1.16,
      professionalism: 1.02,
    },
    bossPenalties: {
      longAnswerPenaltyMultiplier: 1.45,
      lowSpecificityPenaltyMultiplier: 1.05,
      lowBalancePenaltyMultiplier: 1,
      lowEvidencePenaltyMultiplier: 0.9,
      weakProfessionalismPenaltyMultiplier: 1.05,
    },
  },
  {
    id: "ethics_examiner",
    level: 3,
    name: "Prof Anika Shah",
    title: "Ethics Examiner",
    roleplayIntro:
      "I’m Professor Anika Shah. I’m not interested in simplistic moral slogans. I want balanced judgement, recognition of tension, and answers that stay practical under ambiguity.",
    evaluatorStyle:
      "Analytical, sceptical of black-and-white thinking. Rewards defensible reasoning, patient-centred nuance, and explicit trade-off analysis.",
    unlockVitals: 390,
    rewardVitals: 65,
    mode: "mmi",
    timeLimitSeconds: 155,
    questionCount: 6,
    difficultyLabel: "Analytical",
    pressureLabel: "moderate",
    minPassOverall: 75,
    minCategoryScore: 14,
    followUpCount: 2,
    followUpStyle: "probing",
    recommendedWordsMin: 115,
    recommendedWordsMax: 190,
    antiFluffTolerance: 0.55,
    antiRepetitionTolerance: 0.6,
    questionThemes: [
      "ethics",
      "confidentiality",
      "fairness",
      "professionalism",
      "health_equity",
    ],
    sessionRules: {
      minByPromptType: { ethical: 3, systems: 1 },
      minByTheme: { ethics: 2, confidentiality: 1, fairness: 1 },
      minRequiredEvidence: 1,
      minHighReasoning: 4,
      minHighAmbiguity: 3,
    },
    priorityWeights: {
      clarity: 0.96,
      reasoning: 1.36,
      empathy: 1,
      structure: 1,
      professionalism: 1.22,
    },
    bossPenalties: {
      longAnswerPenaltyMultiplier: 1,
      lowSpecificityPenaltyMultiplier: 1.15,
      lowBalancePenaltyMultiplier: 1.45,
      lowEvidencePenaltyMultiplier: 1.1,
      weakProfessionalismPenaltyMultiplier: 1.2,
    },
  },
  {
    id: "panel_gauntlet",
    level: 4,
    name: "Admissions Panel",
    title: "Panel Gauntlet",
    roleplayIntro:
      "We are the Admissions Panel. We care less about polished language and more about whether your examples are real, your reflection is honest, and your judgement holds up when themes change quickly.",
    evaluatorStyle:
      "Demanding and evidence-heavy. Rewards specificity, adaptability, self-awareness, and consistency across mixed question types.",
    unlockVitals: 720,
    rewardVitals: 85,
    mode: "panel",
    timeLimitSeconds: 120,
    questionCount: 8,
    difficultyLabel: "Advanced",
    pressureLabel: "intense",
    minPassOverall: 78,
    minCategoryScore: 15,
    followUpCount: 2,
    followUpStyle: "probing",
    recommendedWordsMin: 90,
    recommendedWordsMax: 160,
    antiFluffTolerance: 0.45,
    antiRepetitionTolerance: 0.5,
    questionThemes: [
      "motivation",
      "ethics",
      "teamwork",
      "leadership",
      "reflection",
      "communication",
      "professionalism",
      "fairness",
    ],
    sessionRules: {
      minByPromptType: { personal: 2, ethical: 2, situational: 2 },
      minByTheme: { motivation: 1, teamwork: 1, leadership: 1, reflection: 1 },
      minRequiredEvidence: 3,
      minHighReasoning: 4,
      minHighAmbiguity: 2,
    },
    priorityWeights: {
      clarity: 1,
      reasoning: 1.22,
      empathy: 0.96,
      structure: 1,
      professionalism: 1.12,
    },
    bossPenalties: {
      longAnswerPenaltyMultiplier: 1.1,
      lowSpecificityPenaltyMultiplier: 1.3,
      lowBalancePenaltyMultiplier: 1.15,
      lowEvidencePenaltyMultiplier: 1.35,
      weakProfessionalismPenaltyMultiplier: 1.15,
    },
  },
  {
    id: "deans_circuit",
    level: 5,
    name: "The Champion",
    title: "Dean’s Circuit",
    roleplayIntro:
      "Welcome to the Dean’s Circuit. This is for candidates who want to prove they are interview-ready, not just well-rehearsed. Weak examples, shallow ethics, and generic ambition get exposed quickly here.",
    evaluatorStyle:
      "Elite standard. Rewards composure, trade-off reasoning, practical judgement, maturity, relevance, and consistency. Punishes genericity hard.",
    unlockVitals: 1120,
    requiresMomentum: "active",
    rewardVitals: 110,
    mode: "panel",
    timeLimitSeconds: 105,
    questionCount: 10,
    difficultyLabel: "Champion",
    pressureLabel: "extreme",
    minPassOverall: 82,
    minCategoryScore: 16,
    followUpCount: 3,
    followUpStyle: "adversarial",
    recommendedWordsMin: 85,
    recommendedWordsMax: 150,
    antiFluffTolerance: 0.3,
    antiRepetitionTolerance: 0.35,
    questionThemes: [
      "motivation",
      "ethics",
      "rural",
      "health_equity",
      "professionalism",
      "reflection",
      "communication",
      "leadership",
      "confidentiality",
      "fairness",
    ],
    sessionRules: {
      minByPromptType: { personal: 2, ethical: 3, systems: 2, situational: 2 },
      minByTheme: {
        ethics: 2,
        professionalism: 1,
        reflection: 1,
        rural: 1,
        health_equity: 1,
      },
      minRequiredEvidence: 3,
      minHighReasoning: 6,
      minHighAmbiguity: 5,
    },
    priorityWeights: {
      clarity: 0.96,
      reasoning: 1.32,
      empathy: 1,
      structure: 0.96,
      professionalism: 1.22,
    },
    bossPenalties: {
      longAnswerPenaltyMultiplier: 1.2,
      lowSpecificityPenaltyMultiplier: 1.45,
      lowBalancePenaltyMultiplier: 1.35,
      lowEvidencePenaltyMultiplier: 1.45,
      weakProfessionalismPenaltyMultiplier: 1.3,
    },
  },
];

const QUESTION_BANK: ArenaQuestion[] = [
  {
    id: "motivation_1",
    theme: "motivation",
    prompt:
      "Why do you want to study medicine, and what has shaped that motivation over time?",
    promptType: "personal",
    difficulty: "foundational",
    evidenceExpectation: "required",
    reasoningDemand: "moderate",
    ambiguity: 2,
    interviewerAngle:
      "Tests authenticity, maturity, and whether the answer goes beyond childhood idealism.",
    followUps: [
      "What is the strongest real-world evidence that this motivation has deepened rather than stayed superficial?",
      "What have you seen that makes medicine look difficult as well as meaningful?",
      "Why should an interviewer believe this is informed commitment rather than admiration from a distance?",
    ],
    tags: ["motivation", "authenticity", "insight"],
  },
  {
    id: "motivation_2",
    theme: "motivation",
    prompt:
      "Why medicine specifically, rather than another profession that also helps people?",
    promptType: "personal",
    difficulty: "intermediate",
    evidenceExpectation: "required",
    reasoningDemand: "high",
    ambiguity: 3,
    interviewerAngle:
      "Separates broad helping intentions from profession-specific understanding.",
    followUps: [
      "What is distinctive about the medical role that genuinely appeals to you?",
      "How would you avoid sounding like you think doctors are more valuable than other health professionals?",
    ],
    tags: ["motivation", "career-fit", "professional-insight"],
  },
  {
    id: "motivation_3",
    theme: "motivation",
    prompt:
      "Tell me about a moment when your understanding of medicine became more realistic and less idealised.",
    promptType: "personal",
    difficulty: "advanced",
    evidenceExpectation: "required",
    reasoningDemand: "moderate",
    ambiguity: 3,
    interviewerAngle: "Rewards insight and humility.",
    followUps: [
      "What changed in your behaviour or preparation after that moment?",
      "Why is that lesson important for someone applying now?",
    ],
    tags: ["motivation", "reflection", "maturity"],
  },
  {
    id: "communication_1",
    theme: "communication",
    prompt:
      "Describe how you would explain a complex health issue to a worried family member with no medical background.",
    promptType: "situational",
    difficulty: "foundational",
    evidenceExpectation: "preferred",
    reasoningDemand: "moderate",
    ambiguity: 2,
    interviewerAngle: "Tests clarity, empathy, and adjustment to audience.",
    followUps: [
      "How would you know your explanation had actually landed?",
      "What would you do if emotion was stopping them from processing information?",
    ],
    tags: ["communication", "health-literacy", "empathy"],
  },
  {
    id: "communication_2",
    theme: "communication",
    prompt:
      "Tell me about a time communication broke down in a team. What did you learn from your role in it?",
    promptType: "personal",
    difficulty: "intermediate",
    evidenceExpectation: "required",
    reasoningDemand: "moderate",
    ambiguity: 2,
    interviewerAngle: "Looks for ownership rather than blame.",
    followUps: [
      "What did you do poorly in that situation?",
      "How would someone else involved describe your communication at the time?",
    ],
    tags: ["communication", "ownership", "team-dynamics"],
  },
  {
    id: "communication_3",
    theme: "communication",
    prompt:
      "How would you respond if someone completely misunderstood your intentions in a high-stakes setting?",
    promptType: "situational",
    difficulty: "advanced",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 3,
    interviewerAngle:
      "Tests emotional control, repair, and judgement under pressure.",
    followUps: [
      "What would make the situation worse?",
      "How do you balance defending yourself with listening properly?",
    ],
    tags: ["communication", "repair", "pressure"],
  },
  {
    id: "teamwork_1",
    theme: "teamwork",
    prompt:
      "Tell me about a time you had to work with someone difficult. What did you actually do?",
    promptType: "personal",
    difficulty: "foundational",
    evidenceExpectation: "required",
    reasoningDemand: "moderate",
    ambiguity: 2,
    interviewerAngle:
      "Tests practicality, emotional maturity, and anti-drama instincts.",
    followUps: [
      "What did you contribute to the tension, even unintentionally?",
      "How did you protect the team outcome while handling that person?",
    ],
    tags: ["teamwork", "conflict", "ownership"],
  },
  {
    id: "teamwork_2",
    theme: "teamwork",
    prompt:
      "How do you contribute when you are not the strongest or most experienced person in the room?",
    promptType: "personal",
    difficulty: "intermediate",
    evidenceExpectation: "required",
    reasoningDemand: "moderate",
    ambiguity: 2,
    interviewerAngle: "Looks for humility and usefulness.",
    followUps: [
      "How do you avoid becoming passive in that situation?",
      "What does being useful look like if you are not leading?",
    ],
    tags: ["teamwork", "humility", "usefulness"],
  },
  {
    id: "teamwork_3",
    theme: "teamwork",
    prompt:
      "Tell me about a team that was underperforming. How did you help shift it, if at all?",
    promptType: "personal",
    difficulty: "advanced",
    evidenceExpectation: "required",
    reasoningDemand: "high",
    ambiguity: 3,
    interviewerAngle: "Tests influence, realism, and results.",
    followUps: [
      "What made the team underperform in the first place?",
      "What would you do differently if you had to do it again?",
    ],
    tags: ["teamwork", "leadership", "results"],
  },
  {
    id: "compassion_1",
    theme: "compassion",
    prompt:
      "What does compassion actually look like in a clinical setting beyond just being nice?",
    promptType: "situational",
    difficulty: "foundational",
    evidenceExpectation: "preferred",
    reasoningDemand: "moderate",
    ambiguity: 2,
    interviewerAngle:
      "Looks for practical empathy rather than sentimental language.",
    followUps: [
      "Can compassion ever be ineffective if it is not paired with judgement?",
      "How do you make someone feel heard without overpromising?",
    ],
    tags: ["compassion", "practical-empathy", "judgement"],
  },
  {
    id: "compassion_2",
    theme: "compassion",
    prompt:
      "Tell me about a time you noticed someone needed support before they asked for it.",
    promptType: "personal",
    difficulty: "intermediate",
    evidenceExpectation: "required",
    reasoningDemand: "moderate",
    ambiguity: 2,
    interviewerAngle: "Tests awareness, action, and boundaries.",
    followUps: [
      "How did you make sure your help was actually welcome?",
      "What would overstepping have looked like there?",
    ],
    tags: ["compassion", "awareness", "boundaries"],
  },
  {
    id: "prioritisation_1",
    theme: "prioritisation",
    prompt:
      "You are overwhelmed with competing responsibilities. How do you prioritise well when everything feels important?",
    promptType: "situational",
    difficulty: "intermediate",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 3,
    interviewerAngle: "Tests triage thinking and decisiveness.",
    followUps: [
      "What exactly would you sacrifice first?",
      "How would you explain your priorities to others affected by them?",
    ],
    tags: ["prioritisation", "triage", "decision-making"],
  },
  {
    id: "prioritisation_2",
    theme: "prioritisation",
    prompt:
      "What would you do if two important commitments collided at the same time and both mattered to other people?",
    promptType: "situational",
    difficulty: "advanced",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 4,
    interviewerAngle: "Tests judgement, communication, and consequences.",
    followUps: [
      "How do you choose between urgent and important?",
      "What would make your decision defensible rather than convenient?",
    ],
    tags: ["prioritisation", "conflict", "trade-offs"],
  },
  {
    id: "resilience_1",
    theme: "resilience",
    prompt:
      "Tell me about a setback that genuinely changed how you approach challenge.",
    promptType: "personal",
    difficulty: "intermediate",
    evidenceExpectation: "required",
    reasoningDemand: "moderate",
    ambiguity: 2,
    interviewerAngle: "Looks for behavioural change, not motivational speech.",
    followUps: [
      "What changed in your behaviour afterwards, not just your mindset?",
      "How did you stop that setback from becoming an excuse?",
    ],
    tags: ["resilience", "behaviour-change", "reflection"],
  },
  {
    id: "resilience_2",
    theme: "resilience",
    prompt:
      "How do you recover when your performance disappoints you but you still need to keep functioning?",
    promptType: "personal",
    difficulty: "advanced",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 3,
    interviewerAngle: "Tests self-regulation and realism.",
    followUps: [
      "What does unhealthy recovery look like?",
      "How do you prevent resilience from becoming denial?",
    ],
    tags: ["resilience", "self-regulation", "pressure"],
  },
  {
    id: "stress_1",
    theme: "stress",
    prompt:
      "What are your early signs that pressure is building too much, and what do you do about them?",
    promptType: "personal",
    difficulty: "intermediate",
    evidenceExpectation: "required",
    reasoningDemand: "moderate",
    ambiguity: 2,
    interviewerAngle: "Looks for self-awareness and responsible coping.",
    followUps: [
      "How do the people around you know stress is affecting you?",
      "What happens if you ignore those signs for too long?",
    ],
    tags: ["stress", "self-awareness", "coping"],
  },
  {
    id: "stress_2",
    theme: "stress",
    prompt:
      "How do you maintain standards when you are mentally tired or emotionally stretched?",
    promptType: "personal",
    difficulty: "advanced",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 3,
    interviewerAngle: "Tests discipline and safeguards under fatigue.",
    followUps: [
      "What shortcuts become tempting in that state?",
      "How do you stop pressure from making you abrupt with others?",
    ],
    tags: ["stress", "fatigue", "standards"],
  },
  {
    id: "ethics_1",
    theme: "ethics",
    prompt:
      "A patient refuses treatment that could save their life. How would you approach this?",
    promptType: "ethical",
    difficulty: "intermediate",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 4,
    interviewerAngle:
      "Tests autonomy, capacity, communication, and respect.",
    followUps: [
      "What values are in tension here?",
      "What would change if you were concerned the patient lacked decision-making capacity?",
      "How do you remain respectful without becoming passive?",
    ],
    tags: ["ethics", "autonomy", "capacity", "respect"],
  },
  {
    id: "ethics_2",
    theme: "ethics",
    prompt:
      "A colleague makes a questionable decision that may not be illegal but feels wrong. What would you do?",
    promptType: "ethical",
    difficulty: "advanced",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 4,
    interviewerAngle:
      "Tests courage, escalation judgement, and professionalism.",
    followUps: [
      "When would direct conversation be appropriate, and when would escalation matter more?",
      "How do you avoid both overreacting and doing nothing?",
    ],
    tags: ["ethics", "escalation", "courage", "judgement"],
  },
  {
    id: "ethics_3",
    theme: "ethics",
    prompt:
      "Should doctors ever withhold information if they believe it will protect the patient from distress?",
    promptType: "ethical",
    difficulty: "advanced",
    evidenceExpectation: "optional",
    reasoningDemand: "high",
    ambiguity: 5,
    interviewerAngle: "Tests honesty, paternalism, and nuance.",
    followUps: [
      "What are the risks of taking a protective instinct too far?",
      "How would you keep the approach patient-centred rather than doctor-centred?",
    ],
    tags: ["ethics", "paternalism", "honesty", "nuance"],
  },
  {
    id: "confidentiality_1",
    theme: "confidentiality",
    prompt:
      "A friend asks you about someone you know was treated at a hospital. How do you respond?",
    promptType: "ethical",
    difficulty: "foundational",
    evidenceExpectation: "optional",
    reasoningDemand: "moderate",
    ambiguity: 2,
    interviewerAngle: "Tests firmness, professionalism, and trust.",
    followUps: [
      "How would you set that boundary without sounding cold?",
      "Why does confidentiality matter beyond just following policy?",
    ],
    tags: ["confidentiality", "boundaries", "trust"],
  },
  {
    id: "confidentiality_2",
    theme: "confidentiality",
    prompt: "When, if ever, can confidentiality be broken?",
    promptType: "ethical",
    difficulty: "advanced",
    evidenceExpectation: "optional",
    reasoningDemand: "high",
    ambiguity: 4,
    interviewerAngle:
      "Tests boundaries, safety, and ethical justification.",
    followUps: [
      "How would you explain that exception to a distressed patient or family member?",
      "What is the danger of breaking confidentiality too casually?",
    ],
    tags: ["confidentiality", "exceptions", "safety"],
  },
  {
    id: "confidentiality_3",
    theme: "confidentiality",
    prompt:
      "How would you manage tension between patient confidentiality and strong family pressure for information?",
    promptType: "ethical",
    difficulty: "advanced",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 4,
    interviewerAngle:
      "Tests empathy without boundary collapse.",
    followUps: [
      "How do you support the family without breaching trust?",
      "What makes this boundary emotionally hard but still important?",
    ],
    tags: ["confidentiality", "family-pressure", "boundaries"],
  },
  {
    id: "fairness_1",
    theme: "fairness",
    prompt: "How should scarce healthcare resources be allocated fairly?",
    promptType: "systems",
    difficulty: "advanced",
    evidenceExpectation: "optional",
    reasoningDemand: "high",
    ambiguity: 5,
    interviewerAngle:
      "Tests principles, trade-offs, and practicality.",
    followUps: [
      "Who loses out in the system you are proposing?",
      "Is equal treatment always fair when patients start from very different circumstances?",
    ],
    tags: ["fairness", "resource-allocation", "trade-offs"],
  },
  {
    id: "fairness_2",
    theme: "fairness",
    prompt:
      "What does fairness mean when two patients both need urgent care but only one can be treated first?",
    promptType: "ethical",
    difficulty: "advanced",
    evidenceExpectation: "optional",
    reasoningDemand: "high",
    ambiguity: 5,
    interviewerAngle:
      "Tests prioritisation, objectivity, and emotional realism.",
    followUps: [
      "What should not influence that decision?",
      "How do you stop fairness from becoming a vague slogan?",
    ],
    tags: ["fairness", "urgency", "prioritisation"],
  },
  {
    id: "professionalism_1",
    theme: "professionalism",
    prompt:
      "How would you respond if you made a small but real mistake in a clinical setting?",
    promptType: "ethical",
    difficulty: "intermediate",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 3,
    interviewerAngle:
      "Tests honesty, safety, escalation, and accountability.",
    followUps: [
      "What would make the situation worse after the initial mistake?",
      "Why does professionalism matter for patient trust, not just reputation?",
    ],
    tags: ["professionalism", "mistakes", "accountability"],
  },
  {
    id: "professionalism_2",
    theme: "professionalism",
    prompt:
      "What should professionalism look like when no one senior is watching?",
    promptType: "personal",
    difficulty: "intermediate",
    evidenceExpectation: "preferred",
    reasoningDemand: "moderate",
    ambiguity: 2,
    interviewerAngle: "Tests integrity and internal standards.",
    followUps: [
      "What are subtle ways professionalism can slip?",
      "How do you avoid confusing confidence with arrogance?",
    ],
    tags: ["professionalism", "integrity", "standards"],
  },
  {
    id: "professionalism_3",
    theme: "professionalism",
    prompt:
      "What should a medical student do after witnessing unprofessional behaviour from someone senior?",
    promptType: "ethical",
    difficulty: "advanced",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 4,
    interviewerAngle:
      "Tests judgement, hierarchy awareness, and courage.",
    followUps: [
      "How do you balance accountability with not escalating recklessly?",
      "What options exist before formal escalation?",
    ],
    tags: ["professionalism", "hierarchy", "escalation"],
  },
  {
    id: "leadership_1",
    theme: "leadership",
    prompt:
      "Tell me about a time you influenced a group without formal authority.",
    promptType: "personal",
    difficulty: "intermediate",
    evidenceExpectation: "required",
    reasoningDemand: "moderate",
    ambiguity: 2,
    interviewerAngle: "Looks for influence without ego.",
    followUps: [
      "Why did people respond to your approach?",
      "How did you stop it from becoming about you?",
    ],
    tags: ["leadership", "influence", "ego-control"],
  },
  {
    id: "leadership_2",
    theme: "leadership",
    prompt:
      "How do you lead when the team is losing confidence or morale is low?",
    promptType: "situational",
    difficulty: "advanced",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 3,
    interviewerAngle:
      "Tests stabilising leadership and tone.",
    followUps: [
      "What should you say, and what should you avoid saying?",
      "How do you balance reassurance with honesty?",
    ],
    tags: ["leadership", "morale", "stability"],
  },
  {
    id: "reflection_1",
    theme: "reflection",
    prompt:
      "Tell me about feedback you did not want to hear but genuinely needed.",
    promptType: "personal",
    difficulty: "intermediate",
    evidenceExpectation: "required",
    reasoningDemand: "moderate",
    ambiguity: 2,
    interviewerAngle: "Tests humility and adaptation.",
    followUps: [
      "What made that feedback uncomfortable?",
      "What actual behavioural change followed from it?",
    ],
    tags: ["reflection", "feedback", "humility"],
  },
  {
    id: "reflection_2",
    theme: "reflection",
    prompt:
      "How do you know whether you are actually improving rather than just staying busy?",
    promptType: "personal",
    difficulty: "advanced",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 3,
    interviewerAngle:
      "Tests quality of reflection and self-honesty.",
    followUps: [
      "What evidence would prove you were just spinning your wheels?",
      "How would someone else notice your improvement?",
    ],
    tags: ["reflection", "growth", "self-honesty"],
  },
  {
    id: "reflection_3",
    theme: "reflection",
    prompt:
      "What is one belief you have changed because of experience, and why did that shift matter?",
    promptType: "personal",
    difficulty: "advanced",
    evidenceExpectation: "required",
    reasoningDemand: "high",
    ambiguity: 3,
    interviewerAngle:
      "Tests depth, flexibility, and insight.",
    followUps: [
      "What triggered that shift in the first place?",
      "How has that belief change affected your decisions since then?",
    ],
    tags: ["reflection", "belief-change", "insight"],
  },
  {
    id: "rural_1",
    theme: "rural",
    prompt:
      "What are the real challenges of healthcare delivery in rural communities?",
    promptType: "systems",
    difficulty: "advanced",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 4,
    interviewerAngle:
      "Tests realism and whether the candidate avoids romanticising rural practice.",
    followUps: [
      "What assumptions should city-based students avoid making?",
      "How can continuity of care differ in rural settings?",
    ],
    tags: ["rural", "systems", "realism"],
  },
  {
    id: "rural_2",
    theme: "rural",
    prompt:
      "How would you approach building trust in a community very different from your own?",
    promptType: "situational",
    difficulty: "advanced",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 4,
    interviewerAngle:
      "Tests humility, listening, and anti-saviour instincts.",
    followUps: [
      "What would damage trust early?",
      "What does respect look like in practice rather than in theory?",
    ],
    tags: ["rural", "trust", "humility"],
  },
  {
    id: "rural_3",
    theme: "rural",
    prompt:
      "Why might rural medicine appeal to some doctors and not others?",
    promptType: "systems",
    difficulty: "intermediate",
    evidenceExpectation: "optional",
    reasoningDemand: "moderate",
    ambiguity: 3,
    interviewerAngle: "Tests nuance and realistic fit.",
    followUps: [
      "How do you answer that without stereotyping rural communities?",
      "What tensions or trade-offs matter here?",
    ],
    tags: ["rural", "fit", "nuance"],
  },
  {
    id: "health_equity_1",
    theme: "health_equity",
    prompt:
      "What does health equity mean in practical terms, not just as a concept?",
    promptType: "systems",
    difficulty: "advanced",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 4,
    interviewerAngle:
      "Tests whether the candidate can make equity concrete.",
    followUps: [
      "How do you talk about inequity without sounding abstract or performative?",
      "What would practical improvement look like for one patient?",
    ],
    tags: ["health-equity", "practicality", "systems"],
  },
  {
    id: "health_equity_2",
    theme: "health_equity",
    prompt:
      "Why do some communities experience worse outcomes even within the same health system?",
    promptType: "systems",
    difficulty: "advanced",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 4,
    interviewerAngle:
      "Tests systems thinking and patient-centredness.",
    followUps: [
      "What factors are easy to ignore if you oversimplify this issue?",
      "How should future doctors respond without sounding performative?",
    ],
    tags: ["health-equity", "systems-thinking", "patient-centred"],
  },
  {
    id: "health_equity_3",
    theme: "health_equity",
    prompt:
      "What can a medical student or junior doctor realistically do about inequity without pretending they can fix the whole system?",
    promptType: "systems",
    difficulty: "elite",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 5,
    interviewerAngle:
      "Tests realism, humility, and action orientation.",
    followUps: [
      "What is one meaningful action and one common empty gesture?",
      "How do you stay practical while still caring about the bigger system?",
    ],
    tags: ["health-equity", "realism", "action"],
  },
  {
    id: "ethics_4",
    theme: "ethics",
    prompt:
      "A patient asks for something legal that you believe may still be harmful. How do you respond?",
    promptType: "ethical",
    difficulty: "advanced",
    evidenceExpectation: "optional",
    reasoningDemand: "high",
    ambiguity: 5,
    interviewerAngle:
      "Tests tension between autonomy, harm, and respectful care.",
    followUps: [
      "How do you avoid becoming paternalistic?",
      "What would a patient-centred refusal or redirection look like?",
    ],
    tags: ["ethics", "harm", "autonomy"],
  },
  {
    id: "fairness_3",
    theme: "fairness",
    prompt:
      "Is treating everyone the same always fair in healthcare?",
    promptType: "systems",
    difficulty: "advanced",
    evidenceExpectation: "optional",
    reasoningDemand: "high",
    ambiguity: 5,
    interviewerAngle:
      "Tests difference between equality and equity.",
    followUps: [
      "Where can equal treatment create unfair outcomes?",
      "How do you stop this discussion from becoming vague ideology?",
    ],
    tags: ["fairness", "equity", "systems"],
  },
  {
    id: "leadership_3",
    theme: "leadership",
    prompt:
      "What kind of leader do you become under pressure, and what are the risks of that style?",
    promptType: "personal",
    difficulty: "advanced",
    evidenceExpectation: "required",
    reasoningDemand: "high",
    ambiguity: 3,
    interviewerAngle:
      "Tests self-awareness under strain.",
    followUps: [
      "What would your teammates say is your pressure weakness?",
      "How have you worked to manage that?",
    ],
    tags: ["leadership", "pressure", "self-awareness"],
  },
  {
    id: "professionalism_4",
    theme: "professionalism",
    prompt:
      "What is the line between confidence and arrogance in medicine?",
    promptType: "personal",
    difficulty: "advanced",
    evidenceExpectation: "preferred",
    reasoningDemand: "high",
    ambiguity: 4,
    interviewerAngle:
      "Tests humility, insight, and interpersonal judgement.",
    followUps: [
      "Why is arrogance especially dangerous in healthcare?",
      "What does confident but safe behaviour look like in practice?",
    ],
    tags: ["professionalism", "confidence", "arrogance"],
  },
];

const GENERIC_PHRASES = [
  "i have always wanted to help people",
  "medicine combines science and helping people",
  "i am passionate about helping others",
  "since i was young",
  "i work well under pressure",
  "communication is key",
  "teamwork is important",
  "i would stay calm",
  "i would remain professional",
  "it is important to be empathetic",
  "i would listen to the patient",
  "do the right thing",
  "i want to make a difference",
  "i am a people person",
  "medicine is my dream",
];

const STRUCTURE_MARKERS = [
  /\bfirst\b/i,
  /\bsecond\b/i,
  /\bthird\b/i,
  /\bfinally\b/i,
  /\boverall\b/i,
  /\bto begin with\b/i,
  /\bmy approach would be\b/i,
  /\bi would first\b/i,
  /\bnext\b/i,
  /\bthen\b/i,
  /\bafter that\b/i,
  /\bin summary\b/i,
];

const REASONING_MARKERS = [
  /\bbecause\b/i,
  /\btherefore\b/i,
  /\bso that\b/i,
  /\bthis matters because\b/i,
  /\bthe reason\b/i,
  /\btrade[- ]?off\b/i,
  /\brisk\b/i,
  /\bbenefit\b/i,
  /\bconsequence\b/i,
  /\bweigh\b/i,
  /\bbalance\b/i,
  /\bcompeting\b/i,
  /\btension\b/i,
  /\bcapacity\b/i,
  /\bautonomy\b/i,
  /\bsafety\b/i,
  /\bproportionate\b/i,
  /\bdefensible\b/i,
];

const EMPATHY_MARKERS = [
  /\blisten\b/i,
  /\bunderstand\b/i,
  /\bconcern\b/i,
  /\bdistress(ed)?\b/i,
  /\bfeel\b/i,
  /\bheard\b/i,
  /\brespect\b/i,
  /\bsupport\b/i,
  /\bpatient-centred\b/i,
  /\bfamily\b/i,
  /\bvalidate\b/i,
  /\backnowledge\b/i,
];

const PROFESSIONALISM_MARKERS = [
  /\bsafe\b/i,
  /\bescalat(e|ing|ion)\b/i,
  /\bsupervisor\b/i,
  /\bconfidential\b/i,
  /\bboundar(y|ies)\b/i,
  /\bhonest\b/i,
  /\baccountab/i,
  /\bdocument\b/i,
  /\bpolicy\b/i,
  /\bappropriate\b/i,
  /\bteam\b/i,
  /\bduty\b/i,
  /\btransparent\b/i,
];

const BALANCE_MARKERS = [
  /\bon the one hand\b/i,
  /\bon the other hand\b/i,
  /\bhowever\b/i,
  /\bwhile\b/i,
  /\balthough\b/i,
  /\bat the same time\b/i,
  /\bbut\b/i,
  /\byet\b/i,
  /\balthough\b/i,
  /\bnevertheless\b/i,
];

const EXAMPLE_MARKERS = [
  /\bfor example\b/i,
  /\bfor instance\b/i,
  /\bone example\b/i,
  /\bin my experience\b/i,
  /\bwhen i\b/i,
  /\bi learned\b/i,
  /\bi realised\b/i,
  /\bi noticed\b/i,
  /\bi had to\b/i,
  /\bthere was a time\b/i,
  /\bin that moment\b/i,
];

const ACTION_MARKERS = [
  /\bi would\b/i,
  /\bmy first step\b/i,
  /\bthe first thing\b/i,
  /\bi would start by\b/i,
  /\bi would explain\b/i,
  /\bi would clarify\b/i,
  /\bi would check\b/i,
  /\bi would ask\b/i,
  /\bi would involve\b/i,
  /\bi would make sure\b/i,
];

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function hasAnyMatch(text: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(text));
}

function countMatches(text: string, patterns: RegExp[]) {
  return patterns.reduce((count, pattern) => count + (pattern.test(text) ? 1 : 0), 0);
}

function normaliseText(text: string) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function countWords(text: string) {
  return text.split(/\s+/).filter(Boolean).length;
}

function countSentences(text: string) {
  const matches = text.match(/[^.!?]+[.!?]*/g);
  return matches?.filter((s) => s.trim().length > 0).length ?? 0;
}

function uniqueWordsRatio(text: string) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return 0;
  return new Set(words).size / words.length;
}

function promptKeywordCoverage(prompt: string, response: string) {
  const stopwords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "to",
    "of",
    "in",
    "for",
    "with",
    "that",
    "this",
    "is",
    "are",
    "be",
    "do",
    "does",
    "would",
    "should",
    "how",
    "what",
    "why",
    "when",
    "if",
    "you",
    "your",
    "they",
    "their",
    "about",
    "than",
    "rather",
  ]);

  const promptWords = Array.from(
    new Set(
      prompt
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length >= 4 && !stopwords.has(word))
    )
  );

  if (!promptWords.length) return 1;

  const responseLower = response.toLowerCase();
  const matched = promptWords.filter((word) => responseLower.includes(word)).length;
  return matched / promptWords.length;
}

function getBossByQuestionDifficulty(question: ArenaQuestion, boss: ArenaBoss) {
  const targetLevelMap: Record<QuestionDifficulty, number[]> = {
    foundational: [1, 2],
    intermediate: [1, 2, 3],
    advanced: [2, 3, 4, 5],
    elite: [5],
  };

  return targetLevelMap[question.difficulty].includes(boss.level);
}

function matchesBossTheme(question: ArenaQuestion, boss: ArenaBoss) {
  return boss.questionThemes.includes(question.theme);
}
function countByTheme(questions: ArenaQuestion[]) {
  const counts: Partial<Record<ArenaTheme, number>> = {};
  for (const question of questions) {
    counts[question.theme] = (counts[question.theme] ?? 0) + 1;
  }
  return counts;
}

function countByPromptType(questions: ArenaQuestion[]) {
  const counts: Partial<Record<ArenaPromptType, number>> = {};
  for (const question of questions) {
    counts[question.promptType] = (counts[question.promptType] ?? 0) + 1;
  }
  return counts;
}

function countHighAmbiguity(questions: ArenaQuestion[]) {
  return questions.filter((question) => question.ambiguity >= 4).length;
}

function countRequiredEvidence(questions: ArenaQuestion[]) {
  return questions.filter(
    (question) => question.evidenceExpectation === "required"
  ).length;
}

function countHighReasoning(questions: ArenaQuestion[]) {
  return questions.filter((question) => question.reasoningDemand === "high").length;
}

function sessionRuleScore(
  selected: ArenaQuestion[],
  candidate: ArenaQuestion,
  boss: ArenaBoss
) {
  const next = [...selected, candidate];
  const rules = boss.sessionRules;

  let score = 0;

  const themeCounts = countByTheme(next);
  const typeCounts = countByPromptType(next);
  const highAmbiguity = countHighAmbiguity(next);
  const requiredEvidence = countRequiredEvidence(next);
  const highReasoning = countHighReasoning(next);

  if (rules.minByTheme) {
    for (const [theme, minRequired] of Object.entries(rules.minByTheme) as Array<
      [ArenaTheme, number]
    >) {
      const current = themeCounts[theme] ?? 0;
      if (current <= minRequired) score += 3;
    }
  }

  if (rules.minByPromptType) {
    for (const [type, minRequired] of Object.entries(
      rules.minByPromptType
    ) as Array<[ArenaPromptType, number]>) {
      const current = typeCounts[type] ?? 0;
      if (current <= minRequired) score += 3;
    }
  }

  if (rules.minHighAmbiguity && highAmbiguity <= rules.minHighAmbiguity) score += 2;
  if (rules.minRequiredEvidence && requiredEvidence <= rules.minRequiredEvidence) score += 2;
  if (rules.minHighReasoning && highReasoning <= rules.minHighReasoning) score += 2;

  const duplicateThemePenalty =
    (themeCounts[candidate.theme] ?? 0) > 1 ? Math.max(0, (themeCounts[candidate.theme] ?? 0) - 1) : 0;

  score -= duplicateThemePenalty * 1.25;

  return score;
}

function satisfiesSessionRules(questions: ArenaQuestion[], boss: ArenaBoss) {
  const rules = boss.sessionRules;
  const themeCounts = countByTheme(questions);
  const typeCounts = countByPromptType(questions);
  const highAmbiguity = countHighAmbiguity(questions);
  const requiredEvidence = countRequiredEvidence(questions);
  const highReasoning = countHighReasoning(questions);

  if (rules.minByTheme) {
    for (const [theme, minRequired] of Object.entries(rules.minByTheme) as Array<
      [ArenaTheme, number]
    >) {
      if ((themeCounts[theme] ?? 0) < minRequired) return false;
    }
  }

  if (rules.minByPromptType) {
    for (const [type, minRequired] of Object.entries(
      rules.minByPromptType
    ) as Array<[ArenaPromptType, number]>) {
      if ((typeCounts[type] ?? 0) < minRequired) return false;
    }
  }

  if (rules.minHighAmbiguity && highAmbiguity < rules.minHighAmbiguity) return false;
  if (rules.minRequiredEvidence && requiredEvidence < rules.minRequiredEvidence) return false;
  if (rules.minHighReasoning && highReasoning < rules.minHighReasoning) return false;

  return true;
}

function pickQuestionsForBoss(boss: ArenaBoss): ArenaQuestion[] {
  const eligible = QUESTION_BANK.filter(
    (question) =>
      matchesBossTheme(question, boss) && getBossByQuestionDifficulty(question, boss)
  );

  const pool = shuffle(eligible);
  let selected: ArenaQuestion[] = [];

  while (selected.length < boss.questionCount && pool.length > 0) {
    const ranked = pool
      .map((candidate) => ({
        candidate,
        score:
          sessionRuleScore(selected, candidate, boss) +
          (candidate.reasoningDemand === "high" ? 1.2 : 0) +
          (candidate.evidenceExpectation === "required" ? 1 : 0) +
          (candidate.ambiguity >= 4 ? 0.8 : 0),
      }))
      .sort((a, b) => b.score - a.score);

    const choice = ranked[0]?.candidate;
    if (!choice) break;

    selected.push(choice);

    const index = pool.findIndex((item) => item.id === choice.id);
    if (index >= 0) pool.splice(index, 1);
  }

  if (!satisfiesSessionRules(selected, boss)) {
    const fallback = shuffle(eligible).slice(0, boss.questionCount);
    if (satisfiesSessionRules(fallback, boss)) {
      selected = fallback;
    }
  }

  return selected.slice(0, boss.questionCount);
}

export function getBossByLevel(level: number): ArenaBoss | undefined {
  return ARENA_BOSSES.find((boss) => boss.level === level);
}

export function getBossById(id: ArenaBossId): ArenaBoss | undefined {
  return ARENA_BOSSES.find((boss) => boss.id === id);
}

export function isBossUnlocked(params: {
  boss: ArenaBoss;
  vitalsTotal: number;
  momentumState: MomentumState;
}) {
  const vitalsPass = params.vitalsTotal >= params.boss.unlockVitals;
  const momentumPass = params.boss.requiresMomentum
    ? MOMENTUM_ORDER.indexOf(params.momentumState) >=
      MOMENTUM_ORDER.indexOf(params.boss.requiresMomentum)
    : true;

  return vitalsPass && momentumPass;
}

export function buildArenaSession(boss: ArenaBoss): ArenaSessionPayload {
  const questions = pickQuestionsForBoss(boss).map((question) => ({
    ...question,
    followUps: question.followUps.slice(0, boss.followUpCount),
  }));

  const introScript = `${boss.roleplayIntro} You are entering ${boss.title}. This boss contains ${boss.questionCount} question${
    boss.questionCount > 1 ? "s" : ""
  }, uses a ${boss.pressureLabel} pressure setting with a ${
    boss.followUpStyle
  } follow-up style, and expects roughly ${boss.recommendedWordsMin}-${
    boss.recommendedWordsMax
  } words per answer. Passing requires an overall score of at least ${
    boss.minPassOverall
  } with no core category below ${boss.minCategoryScore}. ${boss.evaluatorStyle}`;

  return {
    boss,
    questions,
    introScript,
  };
}

export function getArenaRubricPrompt(params: {
  boss: ArenaBoss;
  question: ArenaQuestion;
  response: string;
}): ArenaRubricPromptSet {
  const { boss, question, response } = params;

  const system = `
You are a strict Australian medical interview evaluator.

Evaluate the candidate like a serious admissions interviewer, not a motivational coach.
Do not reward polished filler, generic empathy, or buzzwords.
Reward relevance, judgement, specificity, practical reasoning, honest reflection, and professionalism.
A strong answer must directly answer the question asked.
A weak answer often sounds smooth but avoids tension, lacks evidence, or stays vague.

Boss profile:
- Boss: ${boss.title}
- Style: ${boss.evaluatorStyle}
- Pressure: ${boss.pressureLabel}
- Follow-up style: ${boss.followUpStyle}
- Pass standard overall: ${boss.minPassOverall}
- Minimum category score: ${boss.minCategoryScore}

Return scores for:
- clarity (0-25)
- reasoning (0-25)
- empathy (0-25)
- structure (0-25)
- professionalism (0-25)
- overall (0-100)

Also return:
- pass (true/false)
- one concise paragraph of feedback
- three sharp improvements

Scoring principles:
- Clarity: Is the answer direct, understandable, and non-rambling?
- Reasoning: Does it identify trade-offs, justify choices, and show judgement?
- Empathy: Does it demonstrate respect, listening, and patient-awareness without becoming sentimental?
- Structure: Is the answer organised and easy to follow?
- Professionalism: Does it show safety, honesty, boundaries, accountability, and maturity?

Punish:
- generic motivation lines
- buzzword-heavy ethics
- vague teamwork answers
- sentimental but impractical empathy
- saying "I would stay calm" without showing how
- long answers that avoid the actual question
- repeated template language across answers
`.trim();

  const user = `
Question:
${question.prompt}

Question metadata:
- Theme: ${question.theme}
- Type: ${question.promptType}
- Difficulty: ${question.difficulty}
- Evidence expectation: ${question.evidenceExpectation}
- Reasoning demand: ${question.reasoningDemand}
- Ambiguity: ${question.ambiguity}/5
- Interviewer angle: ${question.interviewerAngle}

Candidate response:
${response}
`.trim();

  return { system, user };
}

export function buildArenaEvaluatorPrompt(params: {
  boss: ArenaBoss;
  question: ArenaQuestion;
  response: string;
}) {
  const rubric = getArenaRubricPrompt(params);
  return `${rubric.system}\n\n${rubric.user}`;
}

function computeLengthScore(wordCount: number, boss: ArenaBoss) {
  const min = boss.recommendedWordsMin;
  const max = boss.recommendedWordsMax;

  if (wordCount < Math.round(min * 0.45)) return -8;
  if (wordCount < Math.round(min * 0.65)) return -5;
  if (wordCount < min) return -2;
  if (wordCount <= max) return 3;
  if (wordCount <= Math.round(max * 1.15)) return 0;
  if (wordCount <= Math.round(max * 1.35)) return -3;
  return -6;
}

function computeSpecificityScore(response: string, question: ArenaQuestion) {
  let score = 0;
  const lower = response.toLowerCase();

  const hasExample = hasAnyMatch(response, EXAMPLE_MARKERS);
  const hasNumbers = /\b\d+\b/.test(response);
  const hasContrast = hasAnyMatch(response, BALANCE_MARKERS);
  const coverage = promptKeywordCoverage(question.prompt, response);

  if (hasExample) score += 3;
  if (hasNumbers) score += 1;
  if (hasContrast) score += 1;
  if (coverage >= 0.45) score += 2;
  else if (coverage >= 0.3) score += 1;
  else if (coverage < 0.18) score -= 3;

  if (question.evidenceExpectation === "required" && !hasExample) score -= 4;
  if (question.evidenceExpectation === "preferred" && !hasExample) score -= 2;

  if (
    question.promptType === "personal" &&
    !/\bi\b/i.test(response) &&
    !/\bmy\b/i.test(response)
  ) {
    score -= 3;
  }

  if (
    question.promptType !== "personal" &&
    lower.includes("i have always wanted to help people")
  ) {
    score -= 2;
  }

  return score;
}

function repeatedPhrasePenalty(text: string) {
  const lower = normaliseText(text);
  let penalty = 0;

  for (const phrase of GENERIC_PHRASES) {
    if (lower.includes(phrase)) penalty += 1;
  }

  const sentences = lower
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  for (const sentence of sentences) {
    if (sentence.length < 20) continue;
    if (seen.has(sentence)) penalty += 2;
    seen.add(sentence);
  }

  return penalty;
}

function sentenceLengthSpread(text: string) {
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (!sentences.length) return 0;

  const lengths = sentences.map((s) => countWords(s));
  return Math.max(...lengths) - Math.min(...lengths);
}

function computeFluffPenalty(response: string, boss: ArenaBoss) {
  const ratio = uniqueWordsRatio(response);
  const repetition = repeatedPhrasePenalty(response);
  const sentenceSpread = sentenceLengthSpread(response);

  let penalty = 0;

  if (ratio < 0.46) penalty += 2;
  if (ratio < 0.4) penalty += 2;

  penalty += repetition;

  if (sentenceSpread < 4) penalty += 1;

  return Math.round(penalty * (1 / boss.antiFluffTolerance) * 0.35);
}

function computeQuestionFitPenalty(question: ArenaQuestion, response: string) {
  const coverage = promptKeywordCoverage(question.prompt, response);
  let penalty = 0;

  if (coverage < 0.16) penalty += 4;
  else if (coverage < 0.24) penalty += 2;

  if (
    question.reasoningDemand === "high" &&
    !hasAnyMatch(response, REASONING_MARKERS)
  ) {
    penalty += 4;
  }

  if (question.promptType === "ethical" || question.promptType === "systems") {
    if (
      !hasAnyMatch(response, BALANCE_MARKERS) &&
      !hasAnyMatch(response, REASONING_MARKERS)
    ) {
      penalty += 3;
    }
  }

  return penalty;
}

function computeFollowUpPressure(question: ArenaQuestion, response: string, boss: ArenaBoss) {
  const hasBalance = hasAnyMatch(response, BALANCE_MARKERS);
  const hasReasoning = hasAnyMatch(response, REASONING_MARKERS);
  const hasExample = hasAnyMatch(response, EXAMPLE_MARKERS);
  const coverage = promptKeywordCoverage(question.prompt, response);

  let pressure = 0;

  if (question.followUps.length > 0) pressure += 1;
  if (question.reasoningDemand === "high" && !hasReasoning) pressure += 2;
  if (question.evidenceExpectation !== "optional" && !hasExample) pressure += 2;
  if (question.ambiguity >= 4 && !hasBalance) pressure += 2;
  if (coverage < 0.24) pressure += 2;
  if (boss.followUpStyle === "pressured") pressure += 1;
  if (boss.followUpStyle === "adversarial") pressure += 2;

  return clamp(pressure, 0, 8);
}

function weightScore(raw: number, weight: number, floor = 5, ceiling = 25) {
  const centred = raw - 15;
  const weighted = 15 + centred * weight;
  return clamp(Math.round(weighted), floor, ceiling);
}

function findTopWeaknesses(
  breakdown: Omit<ArenaScoreBreakdown, "overall">,
  count = 2
): ArenaCategory[] {
  return (Object.entries(breakdown) as Array<[ArenaCategory, number]>)
    .sort((a, b) => a[1] - b[1])
    .slice(0, count)
    .map(([category]) => category);
}

function getVerdict(overall: number, pass: boolean) {
  if (overall >= 88 && pass) return "strong" as const;
  if (pass) return "pass" as const;
  if (overall >= 70) return "borderline" as const;
  return "fail" as const;
}

function getStationPenaltyLabels(params: {
  longPenalty: boolean;
  lowSpecificityPenalty: boolean;
  lowBalancePenalty: boolean;
  lowEvidencePenalty: boolean;
  lowProfessionalismPenalty: boolean;
  repetitionPenalty: boolean;
  lowQuestionFitPenalty: boolean;
}) {
  const labels: string[] = [];

  if (params.longPenalty) labels.push("too-long");
  if (params.lowSpecificityPenalty) labels.push("low-specificity");
  if (params.lowBalancePenalty) labels.push("one-sided-reasoning");
  if (params.lowEvidencePenalty) labels.push("weak-evidence");
  if (params.lowProfessionalismPenalty) labels.push("weak-professionalism");
  if (params.repetitionPenalty) labels.push("template-language");
  if (params.lowQuestionFitPenalty) labels.push("weak-question-fit");

  return labels;
}

export function scoreArenaResponse(input: {
  response: string;
  boss: ArenaBoss;
  question?: ArenaQuestion;
  repeatedRunPenalty?: number;
}): {
  breakdown: ArenaScoreBreakdown;
  result: ArenaResult;
  pass: boolean;
  feedback: string;
  stationOutcome: ArenaStationOutcome;
} {
  const response = input.response.trim();
  const boss = input.boss;
  const repeatedRunPenalty = input.repeatedRunPenalty ?? 0;

  const question =
    input.question ??
    ({
      prompt: "",
      theme: "motivation",
      promptType: "personal",
      difficulty: "foundational",
      evidenceExpectation: "optional",
      reasoningDemand: "light",
      ambiguity: 1,
      interviewerAngle: "",
      followUps: [],
      id: "fallback",
    } as ArenaQuestion);

  const wordCount = countWords(response);
  const sentenceCount = countSentences(response);

  const hasStructure = hasAnyMatch(response, STRUCTURE_MARKERS);
  const structureHits = countMatches(response, STRUCTURE_MARKERS);
  const reasoningHits = countMatches(response, REASONING_MARKERS);
  const empathyHits = countMatches(response, EMPATHY_MARKERS);
  const professionalismHits = countMatches(response, PROFESSIONALISM_MARKERS);
  const hasExample = hasAnyMatch(response, EXAMPLE_MARKERS);
  const hasAction = hasAnyMatch(response, ACTION_MARKERS);
  const hasBalance = hasAnyMatch(response, BALANCE_MARKERS);

  const lengthScore = computeLengthScore(wordCount, boss);
  const specificityScore = computeSpecificityScore(response, question);
  const fluffPenalty = computeFluffPenalty(response, boss);
  const questionFitPenalty = computeQuestionFitPenalty(question, response);
  const followUpPressure = computeFollowUpPressure(question, response, boss);

  const longPenalty =
    wordCount > Math.round(boss.recommendedWordsMax * 1.15) &&
    boss.bossPenalties.longAnswerPenaltyMultiplier > 1;

  const lowSpecificityPenalty = specificityScore <= 0;
  const lowBalancePenalty =
    (question.reasoningDemand === "high" || question.promptType !== "personal") &&
    !hasBalance;
  const lowEvidencePenalty =
    question.evidenceExpectation !== "optional" && !hasExample;
  const lowProfessionalismPenalty =
    (question.promptType === "ethical" || question.theme === "professionalism") &&
    !hasAnyMatch(response, PROFESSIONALISM_MARKERS);
  const repetitionPenalty = repeatedRunPenalty > 0;
  const lowQuestionFitPenalty = questionFitPenalty >= 3;

  let clarity = 13;
  if (wordCount >= 55) clarity += 1;
  if (wordCount >= 85) clarity += 1;
  if (hasAction) clarity += 2;
  if (sentenceCount >= 3 && sentenceCount <= 8) clarity += 2;
  if (promptKeywordCoverage(question.prompt, response) >= 0.28) clarity += 2;
  clarity += lengthScore;
  clarity -= Math.min(5, fluffPenalty);
  clarity -= questionFitPenalty >= 4 ? 2 : 0;
  if (longPenalty) {
    clarity -= Math.round(2 * boss.bossPenalties.longAnswerPenaltyMultiplier);
  }

  let structure = 12;
  if (hasStructure) structure += 4;
  if (structureHits >= 2) structure += 2;
  if (hasAction) structure += 2;
  if (hasExample) structure += 1;
  if (wordCount < Math.round(boss.recommendedWordsMin * 0.6)) structure -= 3;
  if (!hasStructure && boss.level >= 3) structure -= 3;
  structure -= fluffPenalty >= 5 ? 2 : 0;
  structure -= Math.round(repeatedRunPenalty * 0.5);

  let reasoning = 11;
  reasoning += Math.min(5, reasoningHits);
  if (hasBalance) reasoning += 3;
  if (specificityScore > 0) reasoning += Math.min(3, specificityScore);
  if (question.reasoningDemand === "high" && hasBalance) reasoning += 2;
  if (question.promptType === "ethical" || question.promptType === "systems") {
    reasoning += hasBalance ? 2 : -2;
    reasoning += hasAction ? 1 : 0;
  }
  if (!hasAnyMatch(response, REASONING_MARKERS)) reasoning -= 4;
  reasoning -= questionFitPenalty;
  reasoning -= fluffPenalty >= 6 ? 2 : 0;
  if (lowBalancePenalty) {
    reasoning -= Math.round(2.5 * boss.bossPenalties.lowBalancePenaltyMultiplier);
  }
  if (lowSpecificityPenalty) {
    reasoning -= Math.round(1.5 * boss.bossPenalties.lowSpecificityPenaltyMultiplier);
  }

  let empathy = 11;
  empathy += Math.min(4, empathyHits);
  if (question.theme === "communication" || question.theme === "compassion") empathy += 2;
  if (
    question.theme === "ethics" ||
    question.theme === "confidentiality" ||
    question.theme === "health_equity"
  ) {
    empathy += hasBalance ? 1 : 0;
  }
  if (!hasAnyMatch(response, EMPATHY_MARKERS) && question.theme !== "prioritisation") {
    empathy -= 3;
  }
  if (response.toLowerCase().includes("just tell them")) empathy -= 3;
  empathy -= fluffPenalty >= 7 ? 1 : 0;

  let professionalism = 12;
  professionalism += Math.min(5, professionalismHits);
  if (hasAction) professionalism += 2;
  if (question.theme === "professionalism" || question.theme === "confidentiality") {
    professionalism += 2;
  }
  if (
    question.promptType === "ethical" &&
    !hasAnyMatch(response, PROFESSIONALISM_MARKERS)
  ) {
    professionalism -= 4;
  }
  if (response.toLowerCase().includes("i would not tell anyone")) professionalism -= 4;
  professionalism -= questionFitPenalty >= 4 ? 1 : 0;
  if (lowProfessionalismPenalty) {
    professionalism -= Math.round(
      2 * boss.bossPenalties.weakProfessionalismPenaltyMultiplier
    );
  }

  if (lowEvidencePenalty) {
    const evidencePenalty = Math.round(
      1.5 * boss.bossPenalties.lowEvidencePenaltyMultiplier
    );
    reasoning -= evidencePenalty;
    structure -= Math.round(evidencePenalty * 0.5);
  }

  if (repetitionPenalty) {
    clarity -= repeatedRunPenalty;
    reasoning -= repeatedRunPenalty;
    structure -= Math.round(repeatedRunPenalty * 0.8);
  }

  const rawBreakdown = {
    clarity,
    reasoning,
    empathy,
    structure,
    professionalism,
  };

  const weightedClarity = weightScore(clarity, boss.priorityWeights.clarity);
  const weightedReasoning = weightScore(reasoning, boss.priorityWeights.reasoning);
  const weightedEmpathy = weightScore(empathy, boss.priorityWeights.empathy);
  const weightedStructure = weightScore(structure, boss.priorityWeights.structure);
  const weightedProfessionalism = weightScore(
    professionalism,
    boss.priorityWeights.professionalism
  );

  const overallRaw =
    weightedClarity * 0.2 +
    weightedReasoning * 0.24 +
    weightedEmpathy * 0.17 +
    weightedStructure * 0.17 +
    weightedProfessionalism * 0.22;

  const followUpStressPenalty = followUpPressure >= 6 ? 2 : followUpPressure >= 4 ? 1 : 0;
  const overall = clamp(Math.round(overallRaw * 4) - followUpStressPenalty, 0, 100);
  const minCategory = Math.min(
    weightedClarity,
    weightedReasoning,
    weightedEmpathy,
    weightedStructure,
    weightedProfessionalism
  );
  const pass = overall >= boss.minPassOverall && minCategory >= boss.minCategoryScore;
  const result: ArenaResult = pass ? "won" : "lost";

  let feedback = "";

  if (overall >= 90 && minCategory >= boss.minCategoryScore + 4) {
    feedback =
      "Excellent answer. It was relevant, mature, and difficult to shake. The reasoning felt earned rather than rehearsed, and the judgement stayed practical.";
  } else if (overall >= 83 && minCategory >= boss.minCategoryScore) {
    feedback =
      "Strong answer. You showed solid control, visible reasoning, and enough specificity to sound credible. To push higher, tighten the sharpness of your example or trade-off analysis.";
  } else if (pass) {
    feedback =
      "Pass. You did enough to clear this station, but not comfortably. The answer works, though it still needs more precision, stronger evidence, or clearer prioritisation to feel genuinely interview-ready.";
  } else if (overall >= boss.minPassOverall - 5) {
    feedback =
      "Borderline. There are decent instincts here, but the answer is not strong enough yet for this boss. It likely needed either clearer structure, better judgement under tension, or more concrete evidence.";
  } else {
    feedback =
      "Not a pass. The answer currently feels too generic, underdeveloped, or weakly justified for this level. You need stronger relevance, clearer decision-making, and less filler.";
  }

  const topWeaknesses = findTopWeaknesses({
    clarity: weightedClarity,
    reasoning: weightedReasoning,
    empathy: weightedEmpathy,
    structure: weightedStructure,
    professionalism: weightedProfessionalism,
  });

  const stationOutcome: ArenaStationOutcome = {
    questionId: question.id,
    questionPrompt: question.prompt,
    theme: question.theme,
    passed: pass,
    verdict: getVerdict(overall, pass),
    breakdown: {
      clarity: weightedClarity,
      reasoning: weightedReasoning,
      empathy: weightedEmpathy,
      structure: weightedStructure,
      professionalism: weightedProfessionalism,
      overall,
    },
    feedback,
    topWeaknesses,
    followUpPressure,
    penaltiesApplied: getStationPenaltyLabels({
      longPenalty,
      lowSpecificityPenalty,
      lowBalancePenalty,
      lowEvidencePenalty,
      lowProfessionalismPenalty,
      repetitionPenalty,
      lowQuestionFitPenalty,
    }),
  };

  return {
    breakdown: stationOutcome.breakdown,
    result,
    pass,
    feedback,
    stationOutcome,
  };
}

function buildCrossRunRepetitionMap(responses: string[]) {
  const joined = normaliseText(responses.join(" || "));
  const map = new Map<string, number>();

  for (const phrase of GENERIC_PHRASES) {
    const occurrences = joined.split(phrase).length - 1;
    if (occurrences > 1) map.set(phrase, occurrences);
  }

  return map;
}

function computeRepeatedRunPenalty(response: string, repetitionMap: Map<string, number>, boss: ArenaBoss) {
  const lower = normaliseText(response);
  let penalty = 0;

  for (const [phrase, count] of repetitionMap.entries()) {
    if (lower.includes(phrase)) {
      penalty += Math.max(0, count - 1);
    }
  }

  return Math.round(penalty * (1 / boss.antiRepetitionTolerance) * 0.5);
}

export function getVitalsRewardForResponse(overall: number) {
  if (overall >= 94) return 20;
  if (overall >= 90) return 17;
  if (overall >= 85) return 13;
  if (overall >= 80) return 9;
  if (overall >= 74) return 5;
  if (overall >= 68) return 2;
  return 0;
}

export function getMomentumShiftFromSession(overall: number): MomentumState | null {
  if (overall >= 91) return "elite";
  if (overall >= 83) return "locked_in";
  if (overall >= 75) return "active";
  if (overall >= 66) return "warming_up";
  return null;
}

export function scoreArenaSession(input: {
  boss: ArenaBoss;
  responses: string[];
  questions?: ArenaQuestion[];
}): ArenaSessionOutcome {
  const cleanedResponses = input.responses.map((item) => item.trim());
  const repetitionMap = buildCrossRunRepetitionMap(cleanedResponses);

  const scoredResponses = cleanedResponses.map((response, index) =>
    scoreArenaResponse({
      response,
      boss: input.boss,
      question: input.questions?.[index],
      repeatedRunPenalty: computeRepeatedRunPenalty(
        response,
        repetitionMap,
        input.boss
      ),
    })
  );

  if (!scoredResponses.length) {
    return {
      breakdown: {
        clarity: 0,
        reasoning: 0,
        empathy: 0,
        structure: 0,
        professionalism: 0,
        overall: 0,
      },
      result: "lost",
      pass: false,
      feedback:
        "No valid responses were submitted. You need to complete the stations to earn progress.",
      vitalsAwarded: 0,
      bossRewardAwarded: 0,
      totalVitalsAwarded: 0,
      averageOverall: 0,
      stationOutcomes: [],
      failedStations: 0,
      strongStations: 0,
      sessionFlags: ["empty-run"],
    };
  }

  const stationOutcomes = scoredResponses.map((item) => item.stationOutcome);

  const clarity = Math.round(
    average(stationOutcomes.map((item) => item.breakdown.clarity))
  );
  const reasoning = Math.round(
    average(stationOutcomes.map((item) => item.breakdown.reasoning))
  );
  const empathy = Math.round(
    average(stationOutcomes.map((item) => item.breakdown.empathy))
  );
  const structure = Math.round(
    average(stationOutcomes.map((item) => item.breakdown.structure))
  );
  const professionalism = Math.round(
    average(stationOutcomes.map((item) => item.breakdown.professionalism))
  );
  const overall = Math.round(
    average(stationOutcomes.map((item) => item.breakdown.overall))
  );

  const minCategory = Math.min(
    clarity,
    reasoning,
    empathy,
    structure,
    professionalism
  );

  const failedStations = stationOutcomes.filter((item) => !item.passed).length;
  const strongStations = stationOutcomes.filter(
    (item) => item.verdict === "strong"
  ).length;
  const borderlineStations = stationOutcomes.filter(
    (item) => item.verdict === "borderline"
  ).length;

  const sessionFlags: string[] = [];

  if (failedStations === 0) sessionFlags.push("clean-run");
  if (strongStations >= Math.ceil(input.boss.questionCount * 0.4)) {
    sessionFlags.push("dominant-run");
  }
  if (borderlineStations >= Math.ceil(input.boss.questionCount * 0.5)) {
    sessionFlags.push("fragile-run");
  }
  if (stationOutcomes.some((item) => item.followUpPressure >= 6)) {
    sessionFlags.push("pressure-exposed");
  }
  if (
    stationOutcomes.some((item) => item.penaltiesApplied.includes("template-language"))
  ) {
    sessionFlags.push("template-repetition");
  }

  const pass =
    overall >= input.boss.minPassOverall &&
    minCategory >= input.boss.minCategoryScore &&
    failedStations <= Math.floor(input.boss.questionCount * 0.34) &&
    borderlineStations < Math.ceil(input.boss.questionCount * 0.55);

  const vitalsAwarded = stationOutcomes.reduce(
    (sum, item) => sum + getVitalsRewardForResponse(item.breakdown.overall),
    0
  );

  const consistencyBonus =
    failedStations === 0 ? 12 : failedStations <= 1 ? 6 : 0;

  const dominanceBonus =
    strongStations >= Math.ceil(input.boss.questionCount * 0.5)
      ? 10
      : strongStations >= Math.ceil(input.boss.questionCount * 0.3)
        ? 5
        : 0;

  const bossRewardAwarded = pass
    ? input.boss.rewardVitals + consistencyBonus + dominanceBonus
    : 0;

  const totalVitalsAwarded = vitalsAwarded + bossRewardAwarded;

  let feedback = "";

  if (
    pass &&
    overall >= 90 &&
    minCategory >= input.boss.minCategoryScore + 3 &&
    strongStations >= Math.ceil(input.boss.questionCount * 0.4)
  ) {
    feedback =
      "Boss defeated convincingly. This run was composed, specific, and consistently well judged. It felt like an interview-ready performance rather than a collection of decent answers.";
  } else if (pass) {
    feedback =
      "Boss defeated. You earned progression, but not by much. The run had enough structure and judgement to clear the standard, though sharper examples and less repetition would make it feel more dominant.";
  } else if (overall >= input.boss.minPassOverall - 4) {
    feedback =
      "Close, but not enough. You were competitive in this arena, but the run lacked consistency. One or more categories stayed too weak, or too many stations felt borderline.";
  } else {
    feedback =
      "Boss not defeated. This run was below the standard required for progression. Tighten your answers, reduce generic phrasing, and make your reasoning more explicit and defensible.";
  }

  return {
    breakdown: {
      clarity,
      reasoning,
      empathy,
      structure,
      professionalism,
      overall,
    },
    result: pass ? "won" : "lost",
    pass,
    feedback,
    vitalsAwarded,
    bossRewardAwarded,
    totalVitalsAwarded,
    averageOverall: overall,
    stationOutcomes,
    failedStations,
    strongStations,
    sessionFlags,
  };
}