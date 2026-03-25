export type InterviewBoss = {
  level: number;
  name: string;
  title: string;
  twist: string;
  unlockText: string;
  vitalsReward: number;
};

export const INTERVIEW_BOSSES: InterviewBoss[] = [
  {
    level: 1,
    name: "Dr Maya Chen",
    title: "Warm-Up Clinician",
    twist: "Supportive foundational station focused on clarity and empathy.",
    unlockText: "Available immediately.",
    vitalsReward: 75,
  },
  {
    level: 2,
    name: "Dr Leo Hart",
    title: "Time Pressure Registrar",
    twist: "Shorter response windows and brisk follow-ups.",
    unlockText: "Unlock after 3 interview sessions.",
    vitalsReward: 100,
  },
  {
    level: 3,
    name: "Prof Anika Shah",
    title: "Ethics Examiner",
    twist: "Ambiguous ethical scenarios with no perfect answer.",
    unlockText: "Unlock at 300 total vitals or 6 interview sessions.",
    vitalsReward: 125,
  },
  {
    level: 4,
    name: "Admissions Panel",
    title: "Panel Gauntlet",
    twist: "Multiple perspectives, follow-ups, and pressure shifts.",
    unlockText: "Unlock after beating Level 3 twice or reaching Locked In momentum.",
    vitalsReward: 140,
  },
  {
    level: 5,
    name: "The Dean’s Circuit",
    title: "Final Circuit",
    twist: "Rapid-fire mix of motivation, ethics, rural, and personal stations.",
    unlockText: "Unlock at 1000 vitals and strong momentum.",
    vitalsReward: 150,
  },
];