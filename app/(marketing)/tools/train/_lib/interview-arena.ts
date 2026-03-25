export type ArenaBossId =
  | "warm_up_clinician"
  | "time_pressure_registrar"
  | "ethics_examiner"
  | "panel_gauntlet"
  | "deans_circuit";

export type ArenaMode = "mmi" | "panel";

export type ArenaBoss = {
  id: ArenaBossId;
  level: number;
  name: string;
  title: string;
  roleplayIntro: string;
  unlockVitals: number;
  requiresMomentum?: "cold" | "warming_up" | "active" | "locked_in" | "elite";
  rewardVitals: number;
  mode: ArenaMode;
  timeLimitSeconds: number;
  questionCount: number;
  difficultyLabel: string;
  questionThemes: string[];
};

export type ArenaQuestion = {
  id: string;
  prompt: string;
  followUps: string[];
  theme: string;
};

export type ArenaSessionPayload = {
  boss: ArenaBoss;
  questions: ArenaQuestion[];
  introScript: string;
};

export type ArenaScoreBreakdown = {
  clarity: number;
  reasoning: number;
  empathy: number;
  structure: number;
  professionalism: number;
  overall: number;
};

export type ArenaResult =
  | "won"
  | "lost"
  | "completed";

export const ARENA_BOSSES: ArenaBoss[] = [
  {
    id: "warm_up_clinician",
    level: 1,
    name: "Dr Maya Chen",
    title: "Warm-Up Clinician",
    roleplayIntro:
      "I’m Dr Maya Chen. I’m warm but observant. I want clear thinking, genuine empathy, and calm communication.",
    unlockVitals: 0,
    rewardVitals: 75,
    mode: "mmi",
    timeLimitSeconds: 300,
    questionCount: 2,
    difficultyLabel: "Foundational",
    questionThemes: ["motivation", "communication", "teamwork", "compassion"],
  },
  {
    id: "time_pressure_registrar",
    level: 2,
    name: "Dr Leo Hart",
    title: "Time Pressure Registrar",
    roleplayIntro:
      "I’m Dr Leo Hart. I interrupt more, push faster, and want concise answers under pressure.",
    unlockVitals: 150,
    rewardVitals: 100,
    mode: "mmi",
    timeLimitSeconds: 220,
    questionCount: 2,
    difficultyLabel: "Pressured",
    questionThemes: ["prioritisation", "resilience", "communication", "stress"],
  },
  {
    id: "ethics_examiner",
    level: 3,
    name: "Prof Anika Shah",
    title: "Ethics Examiner",
    roleplayIntro:
      "I’m Professor Anika Shah. I care less about perfect answers and more about balanced, ethical reasoning.",
    unlockVitals: 325,
    rewardVitals: 125,
    mode: "mmi",
    timeLimitSeconds: 360,
    questionCount: 2,
    difficultyLabel: "Analytical",
    questionThemes: ["ethics", "confidentiality", "fairness", "professionalism"],
  },
  {
    id: "panel_gauntlet",
    level: 4,
    name: "Admissions Panel",
    title: "Panel Gauntlet",
    roleplayIntro:
      "We are the Admissions Panel. Expect multiple angles, tougher follow-ups, and shifting pressure.",
    unlockVitals: 550,
    rewardVitals: 140,
    mode: "panel",
    timeLimitSeconds: 480,
    questionCount: 3,
    difficultyLabel: "Advanced",
    questionThemes: ["motivation", "ethics", "teamwork", "leadership", "reflection"],
  },
  {
    id: "deans_circuit",
    level: 5,
    name: "The Champion",
    title: "Dean’s Circuit",
    roleplayIntro:
      "I’m the final champion. This is a full interview circuit: ethics, motivation, professionalism, health systems, and composure.",
    unlockVitals: 900,
    requiresMomentum: "active",
    rewardVitals: 150,
    mode: "panel",
    timeLimitSeconds: 600,
    questionCount: 4,
    difficultyLabel: "Champion",
    questionThemes: [
      "motivation",
      "ethics",
      "rural",
      "health equity",
      "professionalism",
      "reflection",
    ],
  },
];

const QUESTION_BANK: Record<string, string[]> = {
  motivation: [
    "Why do you want to study medicine, and what has shaped that motivation over time?",
    "What do you think people misunderstand most about becoming a doctor?",
    "What personal qualities make you suited to medicine beyond just academic strength?",
  ],
  communication: [
    "Describe how you would explain a complex health issue to a worried family member with no medical background.",
    "Tell me about a time communication broke down in a team. What did you learn?",
    "How would you handle speaking with someone who is emotional, angry, or shut down?",
  ],
  teamwork: [
    "Tell me about a time you had to work with someone difficult. What did you do?",
    "What makes a strong team in a high-pressure environment?",
    "How do you contribute when you are not the strongest person in the room?",
  ],
  compassion: [
    "What does compassion actually look like in a clinical setting?",
    "How do you balance empathy with the need to stay objective?",
    "Tell me about a time you noticed someone needed support before they asked for it.",
  ],
  prioritisation: [
    "You are overwhelmed with competing responsibilities. How do you prioritise well?",
    "Tell me about a time you had too much on your plate. What gave, and why?",
    "How do you make decisions under pressure when everything feels important?",
  ],
  resilience: [
    "Tell me about a setback that genuinely changed how you approach challenge.",
    "How do you recover when your performance disappoints you?",
    "What is the difference between pushing through and reflecting properly?",
  ],
  stress: [
    "How do you stop stress from affecting the people around you?",
    "What are your early signs that pressure is building too much?",
    "How do you maintain standards when you are mentally tired?",
  ],
  ethics: [
    "A patient refuses treatment that could save their life. How would you approach this?",
    "A colleague makes a questionable decision that may not be illegal but feels wrong. What would you do?",
    "Should doctors ever withhold information if they think it will protect the patient?",
  ],
  confidentiality: [
    "A friend asks you about someone you know was treated at a hospital. How do you respond?",
    "When, if ever, can confidentiality be broken?",
    "How would you manage tension between confidentiality and family pressure for information?",
  ],
  fairness: [
    "How should scarce healthcare resources be allocated fairly?",
    "What does fairness mean when two patients both need urgent care?",
    "How do you balance equal treatment with individual needs?",
  ],
  professionalism: [
    "What should professionalism look like when no one senior is watching?",
    "How would you respond if you made a small but real mistake in a clinical setting?",
    "What is the line between confidence and arrogance in medicine?",
  ],
  leadership: [
    "Tell me about a time you influenced a group without formal authority.",
    "What kind of leader do you become under pressure?",
    "How do you lead when the team is losing confidence?",
  ],
  reflection: [
    "Tell me about feedback you did not want to hear but needed.",
    "How do you know whether you are actually improving or just staying busy?",
    "What is one belief you have changed because of experience?",
  ],
  rural: [
    "Why might rural medicine appeal to some doctors and not others?",
    "What are the real challenges of healthcare delivery in rural communities?",
    "How would you approach building trust in a community very different from your own?",
  ],
  "health equity": [
    "What does health equity mean in practical terms, not just as a concept?",
    "Why do some communities experience worse outcomes even with the same health system?",
    "How should future doctors respond to unequal access to care?",
  ],
};

const FOLLOW_UPS: Record<string, string[]> = {
  motivation: [
    "What is the strongest piece of evidence for that answer from your own life?",
    "How do you know this is not just an idealised version of the profession?",
  ],
  communication: [
    "How would you adjust that approach for someone with low health literacy?",
    "What would you do if your explanation clearly was not landing?",
  ],
  teamwork: [
    "What would your teammate say you did poorly in that situation?",
    "How did your behaviour affect the group dynamic?",
  ],
  compassion: [
    "How do you avoid compassion becoming performative?",
    "What if empathy slows decision-making in a crisis?",
  ],
  prioritisation: [
    "What exactly would you sacrifice first?",
    "How do you communicate your priorities to others under pressure?",
  ],
  resilience: [
    "What did you do immediately after that setback?",
    "What changed in your behaviour afterwards, not just your mindset?",
  ],
  stress: [
    "What are the consequences if you manage stress badly in medicine?",
    "How do you prevent stress from turning into avoidance?",
  ],
  ethics: [
    "What values are in tension here?",
    "What would make your approach ethically defensible?",
  ],
  confidentiality: [
    "What exceptions matter here?",
    "How would you explain that boundary to a distressed family member?",
  ],
  fairness: [
    "Is equality always fairness?",
    "What trade-offs are you accepting with that answer?",
  ],
  professionalism: [
    "Who should you involve when professionalism slips?",
    "Why does that matter for patient trust?",
  ],
  leadership: [
    "How did the group respond to your approach?",
    "What would you change if you led that situation again?",
  ],
  reflection: [
    "What is the actual behavioural change that came from that reflection?",
    "How do you avoid shallow reflection?",
  ],
  rural: [
    "What assumptions should you be careful not to make?",
    "How would continuity of care differ there?",
  ],
  "health equity": [
    "What is one actionable thing a medical student or junior doctor could do?",
    "How do you talk about inequity without sounding abstract?",
  ],
};

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function takeRandom<T>(items: T[], count: number): T[] {
  return shuffle(items).slice(0, count);
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
  momentumState: "cold" | "warming_up" | "active" | "locked_in" | "elite";
}) {
  const vitalsPass = params.vitalsTotal >= params.boss.unlockVitals;
  const momentumPass = params.boss.requiresMomentum
    ? ["cold", "warming_up", "active", "locked_in", "elite"].indexOf(
        params.momentumState
      ) >=
      ["cold", "warming_up", "active", "locked_in", "elite"].indexOf(
        params.boss.requiresMomentum
      )
    : true;

  return vitalsPass && momentumPass;
}

export function buildArenaSession(boss: ArenaBoss): ArenaSessionPayload {
  const chosenThemes = takeRandom(boss.questionThemes, boss.questionCount);

  const questions: ArenaQuestion[] = chosenThemes.map((theme, index) => {
    const prompts = QUESTION_BANK[theme] ?? [
      "Tell me how you would approach this station thoughtfully.",
    ];
    const followUps = FOLLOW_UPS[theme] ?? [
      "Can you justify that answer more clearly?",
    ];

    return {
      id: `${boss.id}-${index + 1}`,
      theme,
      prompt: takeRandom(prompts, 1)[0],
      followUps: takeRandom(followUps, Math.min(2, followUps.length)),
    };
  });

  const introScript = `${boss.roleplayIntro} You are entering ${boss.title}. You will face ${boss.questionCount} question${boss.questionCount > 1 ? "s" : ""}. Stay calm, structured, and human.`;

  return {
    boss,
    questions,
    introScript,
  };
}

export function scoreArenaResponse(input: {
  response: string;
  boss: ArenaBoss;
}): {
  breakdown: ArenaScoreBreakdown;
  result: ArenaResult;
  pass: boolean;
  feedback: string;
} {
  const response = input.response.trim();
  const wordCount = response.split(/\s+/).filter(Boolean).length;
  const hasStructure =
    /first|second|finally|overall|however|therefore|because|for example/i.test(
      response
    );
  const hasEmpathy =
    /patient|family|concern|empat|listen|understand|support|respect/i.test(
      response
    );
  const hasReasoning =
    /because|therefore|balance|consider|risk|benefit|option|trade[- ]?off/i.test(
      response
    );
  const hasProfessionalism =
    /professional|safe|appropriate|confidential|honest|escalate|reflect/i.test(
      response
    );

  const clarity = Math.min(20, Math.max(6, Math.round(wordCount / 12)));
  const structure = hasStructure ? 18 : 10;
  const empathy = hasEmpathy ? 18 : 9;
  const reasoning = hasReasoning ? 22 : 11;
  const professionalism = hasProfessionalism ? 18 : 10;

  let overall =
    clarity + structure + empathy + reasoning + professionalism;

  if (input.boss.level >= 4 && wordCount < 140) {
    overall -= 8;
  }

  if (input.boss.level <= 2 && wordCount >= 100 && hasStructure) {
    overall += 4;
  }

  overall = Math.max(0, Math.min(100, overall));

  const pass = overall >= 70;
  const result: ArenaResult = pass ? "won" : "lost";

  let feedback = "";

  if (overall >= 90) {
    feedback =
      "Excellent composure. Your answer showed structure, maturity, and balanced judgement. This is interview-ready communication.";
  } else if (overall >= 82) {
    feedback =
      "Strong answer. You communicated clearly and showed real reasoning. To level up further, make your examples more specific and your judgement even sharper.";
  } else if (overall >= 70) {
    feedback =
      "Pass. You showed a workable interview framework, but your answer could be tighter, more reflective, and more explicit in its reasoning.";
  } else if (overall >= 55) {
    feedback =
      "Borderline. There are good instincts here, but the answer needs clearer structure, stronger justification, and more polished delivery.";
  } else {
    feedback =
      "Not a pass yet. Slow down, structure your thinking, and make your reasoning visible. Right now the answer feels underdeveloped.";
  }

  return {
    breakdown: {
      clarity,
      structure,
      empathy,
      reasoning,
      professionalism,
      overall,
    },
    result,
    pass,
    feedback,
  };
}