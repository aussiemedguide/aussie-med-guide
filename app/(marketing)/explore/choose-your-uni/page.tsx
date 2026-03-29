"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  GraduationCap,
  FlaskConical,
  Stethoscope,
  ChevronDown,
  CheckCircle2,
  RotateCcw,
  Heart,
  Clock3,
  MapPin,
  Award,
  School,
  BookOpen,
  Trees,
  Users,
  ExternalLink,
  Info,
  Wand2,
} from "lucide-react";

type PathwayKey = "undergrad" | "postgrad" | "biomed";
type ProfileTab = "entry" | "interview" | "accommodation" | "rural";
type TacKey = "vtac" | "satac" | "qtac" | "uac" | "tisc" | "direct";

type Uni = {
  id: string;
  name: string;
  shortName: string;
  pathway: PathwayKey[];
  tac: TacKey;
  state: string;
  rank: number;
  duration: string;
  places: number;
  scholarships: string;
  location: string;
  noUcat?: boolean;
  program: string;
  code?: string;
  officialUrl: string;
  metroAtar?: string;
  ruralAtar?: string;
  intlAtar?: string;
  metroUcat?: string;
  ruralUcat?: string;
  intlUcat?: string;
  application: string;
  interview: string;
  ruralInfo: string;
  accommodation: string;
  vibe: {
    structure: number;
    independence: number;
    prestige: number;
    rural: number;
    city: number;
    research: number;
    support: number;
    flexibility: number;
  };
};

type QuizQuestion = {
  id: string;
  text: string;
  answers: {
    text: string;
    delta: Record<string, number>;
  }[];
};

const tacMeta: Record<TacKey, { label: string; pill: string; soft: string; border: string }> = {
  vtac: { label: "VTAC", pill: "bg-blue-600 text-white", soft: "bg-blue-50 text-blue-700", border: "border-blue-300" },
  satac: { label: "SATAC", pill: "bg-emerald-600 text-white", soft: "bg-emerald-50 text-emerald-700", border: "border-emerald-300" },
  qtac: { label: "QTAC", pill: "bg-rose-600 text-white", soft: "bg-rose-50 text-rose-700", border: "border-rose-300" },
  uac: { label: "UAC", pill: "bg-cyan-600 text-white", soft: "bg-cyan-50 text-cyan-700", border: "border-cyan-300" },
  tisc: { label: "TISC", pill: "bg-violet-600 text-white", soft: "bg-violet-50 text-violet-700", border: "border-violet-300" },
  direct: { label: "Direct", pill: "bg-slate-600 text-white", soft: "bg-slate-50 text-slate-700", border: "border-slate-300" },
};

const universities: Uni[] = [
  {
    id: "adelaide",
    name: "University of Adelaide",
    shortName: "Adelaide",
    pathway: ["undergrad"],
    tac: "satac",
    state: "SA",
    rank: 8,
    duration: "6 years",
    places: 160,
    scholarships: "5 scholarships",
    location: "North Terrace (Adelaide)",
    program: "Bachelor of Medical Studies / Doctor of Medicine",
    officialUrl: "https://www.adelaide.edu.au/degree-finder/mbbs_mbbs.html",
    metroAtar: "99.80",
    ruralAtar: "97.00",
    intlAtar: "99.70",
    metroUcat: "2400",
    ruralUcat: "2100",
    intlUcat: "2400",
    application: "Apply via SATAC. UCAT ANZ required. Interview by invitation.",
    interview: "MMI, 6 stations, roughly 10 minutes each. Strong emphasis on communication, ethics, teamwork, and calm thinking.",
    ruralInfo: "Rural Background Entry pathway via SATAC. Need 5+ years rural residence or equivalent evidence patterns.",
    accommodation: "Strong central-city location with multiple nearby college options including St Mark’s, St Ann’s, Lincoln, and Aquinas.",
    vibe: { structure: 8, independence: 6, prestige: 8, rural: 6, city: 9, research: 8, support: 7, flexibility: 5 },
  },
  {
    id: "anu",
    name: "Australian National University",
    shortName: "ANU",
    pathway: ["undergrad"],
    tac: "uac",
    state: "ACT",
    rank: 3,
    duration: "6 years",
    places: 90,
    scholarships: "4 scholarships",
    location: "Canberra",
    program: "Bachelor of Health Science / Doctor of Medicine and Surgery",
    officialUrl: "https://science.anu.edu.au/study/medicine-health/doctor-medicine-and-surgery",
    metroAtar: "99.00",
    ruralAtar: "97.00",
    intlAtar: "99.00",
    metroUcat: "2400",
    ruralUcat: "2100",
    intlUcat: "2400",
    application: "Apply through UAC. UCAT required for undergraduate pathway. Interview by shortlist.",
    interview: "MMI-style assessment centred on reasoning, communication, professionalism, and insight.",
    ruralInfo: "Regional and rural placements across ACT and nearby NSW give it more rural exposure than people assume.",
    accommodation: "Canberra gives a quieter, more contained student-city experience with easier logistics than Sydney or Melbourne.",
    vibe: { structure: 8, independence: 7, prestige: 9, rural: 6, city: 6, research: 9, support: 7, flexibility: 6 },
  },
  {
    id: "bond",
    name: "Bond University",
    shortName: "Bond",
    pathway: ["undergrad"],
    tac: "direct",
    state: "QLD",
    rank: 15,
    duration: "4.8 years",
    places: 120,
    scholarships: "3+ scholarships",
    location: "Gold Coast",
    noUcat: true,
    program: "Bachelor of Medical Studies / Doctor of Medicine",
    officialUrl: "https://bond.edu.au/program/doctor-medicine",
    metroAtar: "98.50",
    ruralAtar: "96.50",
    intlAtar: "98.00",
    application: "Direct application to Bond. Psychometric test and interview.",
    interview: "Interview-heavy and profile-heavy. More about fit, maturity, and communication than UCAT mechanics.",
    ruralInfo: "No classic TAC rural route in the public-university sense, but context still matters.",
    accommodation: "Private university feel with a more contained campus lifestyle and Gold Coast setting.",
    vibe: { structure: 8, independence: 5, prestige: 6, rural: 2, city: 8, research: 5, support: 8, flexibility: 7 },
  },
  {
    id: "cdu",
    name: "Charles Darwin University",
    shortName: "CDU",
    pathway: ["undergrad"],
    tac: "satac",
    state: "NT",
    rank: 19,
    duration: "6 years",
    places: 60,
    scholarships: "3 scholarships",
    location: "Darwin",
    program: "Bachelor of Clinical Sciences / Doctor of Medicine",
    officialUrl: "https://www.cdu.edu.au/study/course/bachelor-clinical-sciences-doctor-medicine",
    metroAtar: "99.50",
    ruralAtar: "96.50",
    intlAtar: "98.00",
    application: "Apply via SATAC with school-specific requirements and mission-based selection elements.",
    interview: "Mission-fit, communication, and community orientation matter strongly.",
    ruralInfo: "Strong northern, remote, and underserved-community orientation. One of the clearest mission-based pathways.",
    accommodation: "Smaller-city lifestyle with strong northern Australia identity and different pace to metro campuses.",
    vibe: { structure: 6, independence: 8, prestige: 4, rural: 10, city: 2, research: 4, support: 7, flexibility: 7 },
  },
  {
    id: "curtin",
    name: "Curtin University",
    shortName: "Curtin",
    pathway: ["undergrad"],
    tac: "tisc",
    state: "WA",
    rank: 14,
    duration: "5 years",
    places: 110,
    scholarships: "4 scholarships",
    location: "Perth (Bentley)",
    program: "Bachelor of Medicine, Bachelor of Surgery",
    officialUrl: "https://www.curtin.edu.au/study/offering/course-ug-bachelor-of-medicine-bachelor-of-surgery--b-mbbs/",
    metroAtar: "98.50",
    ruralAtar: "96.50",
    intlAtar: "98.30",
    metroUcat: "2400",
    ruralUcat: "2100",
    intlUcat: "2400",
    application: "Apply via TISC. UCAT required, with extra requirements depending on cycle.",
    interview: "MMI-based selection with strong academic and aptitude pressure.",
    ruralInfo: "Regional WA placements and broad state footprint add a useful rural dimension.",
    accommodation: "Bentley / Perth-based lifestyle, often appealing to WA students wanting city access without east-coast relocation.",
    vibe: { structure: 8, independence: 6, prestige: 6, rural: 5, city: 7, research: 6, support: 6, flexibility: 5 },
  },
  {
    id: "griffith",
    name: "Griffith University",
    shortName: "Griffith",
    pathway: ["undergrad"],
    tac: "qtac",
    state: "QLD",
    rank: 13,
    duration: "6 years total (2+4)",
    places: 190,
    scholarships: "3 scholarships",
    location: "Gold Coast",
    noUcat: true,
    program: "Doctor of Medicine (Provisional Entry)",
    officialUrl: "https://www.griffith.edu.au/study/degrees/doctor-of-medicine-5099",
    metroAtar: "99.90",
    ruralAtar: "97.00",
    intlAtar: "99.90",
    application: "Apply via QTAC and Griffith’s provisional-entry rules. No standard interview in the simplified model shown.",
    interview: "Often perceived as more academically driven at the early stage because of its route structure.",
    ruralInfo: "Regional and Logan-linked contexts can matter, but the pathway logic is what most students need to understand first.",
    accommodation: "Gold Coast location suits students wanting a lifestyle-heavy environment with a strong Queensland cohort feel.",
    vibe: { structure: 8, independence: 5, prestige: 6, rural: 4, city: 8, research: 6, support: 6, flexibility: 6 },
  },
  {
    id: "jcu",
    name: "James Cook University",
    shortName: "JCU",
    pathway: ["undergrad"],
    tac: "qtac",
    state: "QLD",
    rank: 12,
    duration: "6 years",
    places: 180,
    scholarships: "5 scholarships",
    location: "Townsville, Cairns",
    noUcat: true,
    program: "Bachelor of Medicine, Bachelor of Surgery",
    officialUrl: "https://www.jcu.edu.au/courses/bachelor-of-medicine-bachelor-of-surgery",
    metroAtar: "99.00",
    ruralAtar: "93.00",
    intlAtar: "98.50",
    application: "Apply via QTAC and JCU’s own selection framework. No UCAT in the standard model shown here.",
    interview: "Panel-style selection with strong emphasis on mission fit, communication, and rural/remote alignment.",
    ruralInfo: "One of the strongest rural and northern-health identities in Australia.",
    accommodation: "Townsville and Cairns create a very different lifestyle from the big capitals. Great for students who like practical, community-centred environments.",
    vibe: { structure: 6, independence: 8, prestige: 5, rural: 10, city: 2, research: 5, support: 8, flexibility: 7 },
  },
  {
    id: "monash",
    name: "Monash University",
    shortName: "Monash",
    pathway: ["undergrad", "biomed"],
    tac: "vtac",
    state: "VIC",
    rank: 2,
    duration: "5 years",
    places: 300,
    scholarships: "6 scholarships",
    location: "Clayton",
    program: "Bachelor of Medical Science and Doctor of Medicine",
    officialUrl: "https://www.monash.edu/medicine/som/direct-entry/domestic",
    metroAtar: "99.50",
    ruralAtar: "96.00",
    intlAtar: "99.00",
    metroUcat: "2580",
    ruralUcat: "2050",
    intlUcat: "2580",
    application: "Apply through VTAC and Monash direct-entry requirements. UCAT required for domestic undergraduate route.",
    interview: "MMI with emphasis on communication, ethics, and problem-solving.",
    ruralInfo: "Regional placements and associated sites broaden the program beyond Clayton.",
    accommodation: "Large Melbourne university ecosystem with strong student resources, but a bigger campus can feel more independent.",
    vibe: { structure: 8, independence: 7, prestige: 9, rural: 5, city: 8, research: 8, support: 7, flexibility: 6 },
  },
  {
    id: "newcastle-une",
    name: "University of Newcastle / UNE Joint Medical Program",
    shortName: "Newcastle/UNE",
    pathway: ["undergrad"],
    tac: "uac",
    state: "NSW",
    rank: 7,
    duration: "5 years",
    places: 200,
    scholarships: "5 scholarships",
    location: "Newcastle, Armidale (UNE)",
    program: "Bachelor of Medical Science / Doctor of Medicine",
    officialUrl: "https://www.newcastle.edu.au/joint-medical-program",
    metroAtar: "99.00",
    ruralAtar: "96.00",
    intlAtar: "99.00",
    metroUcat: "2500",
    ruralUcat: "2100",
    intlUcat: "2500",
    application: "Apply through UAC plus JMP-specific steps and timelines.",
    interview: "Hybrid-style interview process with strong weight on suitability, communication, and reflection.",
    ruralInfo: "A major strength is its regional footprint across northern NSW and the UNE link.",
    accommodation: "Newcastle gives a coastal city feel, while Armidale adds a regional academic layer.",
    vibe: { structure: 7, independence: 7, prestige: 7, rural: 8, city: 5, research: 6, support: 7, flexibility: 7 },
  },
  {
    id: "unsw",
    name: "UNSW Sydney",
    shortName: "UNSW",
    pathway: ["undergrad"],
    tac: "uac",
    state: "NSW",
    rank: 6,
    duration: "6 years",
    places: 280,
    scholarships: "6 scholarships",
    location: "Kensington (Sydney)",
    program: "Bachelor of Medical Studies / Doctor of Medicine",
    officialUrl: "https://www.unsw.edu.au/medicine-health/study-with-us/undergraduate/bachelor-of-medical-studies-doctor-of-medicine",
    metroAtar: "99.50",
    ruralAtar: "97.00",
    intlAtar: "99.50",
    metroUcat: "2650",
    ruralUcat: "2300",
    intlUcat: "2650",
    application: "Apply through UAC plus UNSW’s own medicine process. UCAT and interview both matter heavily.",
    interview: "Panel-style selection with strong emphasis on maturity, insight, and communication.",
    ruralInfo: "Regional NSW links help, but the overall identity remains strongly metro and high-pressure.",
    accommodation: "Sydney lifestyle, high living cost, fast pace, and big-city energy. Great if that suits you, draining if it doesn’t.",
    vibe: { structure: 8, independence: 8, prestige: 8, rural: 4, city: 10, research: 8, support: 6, flexibility: 5 },
  },
  {
    id: "tasmania",
    name: "University of Tasmania",
    shortName: "Tasmania",
    pathway: ["undergrad"],
    tac: "uac",
    state: "TAS",
    rank: 9,
    duration: "5 years",
    places: 120,
    scholarships: "4 scholarships",
    location: "Hobart",
    program: "Bachelor of Medical Science / Doctor of Medicine",
    officialUrl: "https://www.utas.edu.au/courses/health/courses/h3x-bachelor-of-medical-science-and-doctor-of-medicine",
    metroAtar: "99.90",
    ruralAtar: "96.00",
    intlAtar: "99.90",
    application: "UAC-linked process with UTAS-specific criteria and timing.",
    interview: "Often discussed as a non-standard interview school in comparison sets. Mission and academic fit matter.",
    ruralInfo: "Distributed Tasmanian training network gives real regional immersion.",
    accommodation: "Smaller city, quieter pace, and a more close-knit environment than mainland capitals.",
    vibe: { structure: 7, independence: 6, prestige: 6, rural: 8, city: 3, research: 5, support: 8, flexibility: 7 },
  },
  {
    id: "wsu",
    name: "Western Sydney University",
    shortName: "WSU",
    pathway: ["undergrad"],
    tac: "uac",
    state: "NSW",
    rank: 20,
    duration: "5 years",
    places: 140,
    scholarships: "4 scholarships",
    location: "Campbelltown",
    program: "Bachelor of Medical Research / Doctor of Medicine",
    officialUrl: "https://www.westernsydney.edu.au/future/study/how-to-apply/md-applicants",
    metroAtar: "99.00",
    ruralAtar: "95.00",
    intlAtar: "99.00",
    metroUcat: "2400",
    ruralUcat: "2100",
    intlUcat: "2400",
    application: "Apply via UAC with WSU-specific medicine steps. Interview and category positioning matter strongly.",
    interview: "MMI with emphasis on community orientation, reasoning, and reflection.",
    ruralInfo: "Western and regional NSW partnerships add broader access pathways and location diversity.",
    accommodation: "Western Sydney feel with easier access to broader NSW regions than inner-city schools.",
    vibe: { structure: 7, independence: 7, prestige: 5, rural: 6, city: 7, research: 5, support: 8, flexibility: 7 },
  },
  {
    id: "deakin",
    name: "Deakin University",
    shortName: "Deakin",
    pathway: ["postgrad", "biomed"],
    tac: "vtac",
    state: "VIC",
    rank: 11,
    duration: "4 years",
    places: 150,
    scholarships: "3 scholarships",
    location: "Geelong (Waurn Ponds)",
    noUcat: true,
    program: "Doctor of Medicine",
    officialUrl: "https://www.deakin.edu.au/course/doctor-medicine",
    application: "Graduate-entry process with GPA, admissions testing, and interview structures outside undergraduate UCAT logic.",
    interview: "MMI with emphasis on values, insight, and communication.",
    ruralInfo: "Regional Victorian footprint is one of Deakin’s biggest strategic strengths.",
    accommodation: "Geelong offers a more manageable regional-city feel with links into Melbourne if needed.",
    vibe: { structure: 7, independence: 7, prestige: 6, rural: 8, city: 4, research: 6, support: 8, flexibility: 8 },
  },
  {
    id: "flinders",
    name: "Flinders University",
    shortName: "Flinders",
    pathway: ["postgrad", "biomed"],
    tac: "satac",
    state: "SA",
    rank: 10,
    duration: "4 years",
    places: 130,
    scholarships: "4 scholarships",
    location: "Bedford Park (Adelaide)",
    noUcat: true,
    program: "Doctor of Medicine",
    officialUrl: "https://www.flinders.edu.au/study/courses/postgraduate-doctor-medicine",
    application: "Graduate-entry route. Undergraduate assumptions do not transfer neatly here.",
    interview: "Panel-based assessment with strong maturity and communication focus.",
    ruralInfo: "Longstanding regional and NT links make rural exposure a meaningful part of the story.",
    accommodation: "Adelaide gives lower cost-of-living than Sydney/Melbourne and a calmer pace.",
    vibe: { structure: 7, independence: 7, prestige: 6, rural: 7, city: 5, research: 6, support: 7, flexibility: 8 },
  },
  {
    id: "macquarie",
    name: "Macquarie University",
    shortName: "Macquarie",
    pathway: ["postgrad", "biomed"],
    tac: "uac",
    state: "NSW",
    rank: 16,
    duration: "4 years",
    places: 80,
    scholarships: "3 scholarships",
    location: "North Ryde (Sydney)",
    noUcat: true,
    program: "Doctor of Medicine",
    officialUrl: "https://www.mq.edu.au/faculty-of-medicine-health-and-human-sciences/departments-and-schools/macquarie-medical-school/study/doctor-of-medicine",
    application: "Graduate-entry MD with interview and broader profile considerations.",
    interview: "MMI, smaller-cohort feel, strong emphasis on fit and reflection.",
    ruralInfo: "Less rural-centred than mission-driven schools, but placement geography still matters.",
    accommodation: "Sydney setting with a more contained campus district than central-city universities.",
    vibe: { structure: 7, independence: 8, prestige: 5, rural: 3, city: 8, research: 6, support: 7, flexibility: 8 },
  },
  {
    id: "sydney-postgrad",
    name: "University of Sydney",
    shortName: "Sydney",
    pathway: ["postgrad", "biomed"],
    tac: "uac",
    state: "NSW",
    rank: 1,
    duration: "4 years",
    places: 280,
    scholarships: "10 scholarships",
    location: "Camperdown (Sydney)",
    noUcat: true,
    program: "Doctor of Medicine",
    officialUrl: "https://www.sydney.edu.au/courses/courses/pc/doctor-of-medicine.html",
    application: "Graduate-entry MD process with GPA/GAMSAT-style logic rather than UCAT logic.",
    interview: "Group discussion and written assessment style. Distinct from classic MMI-heavy schools.",
    ruralInfo: "Dubbo and rural NSW placements broaden the profile meaningfully.",
    accommodation: "Big-city life, high living cost, very strong prestige signal, but a fast pace too.",
    vibe: { structure: 8, independence: 9, prestige: 10, rural: 5, city: 10, research: 10, support: 6, flexibility: 7 },
  },
  {
    id: "melbourne-postgrad",
    name: "University of Melbourne",
    shortName: "Melbourne",
    pathway: ["postgrad", "biomed"],
    tac: "vtac",
    state: "VIC",
    rank: 1,
    duration: "4 years",
    places: 350,
    scholarships: "8 scholarships",
    location: "Parkville (Melbourne)",
    noUcat: true,
    program: "Doctor of Medicine",
    officialUrl: "https://study.unimelb.edu.au/find/courses/graduate/doctor-of-medicine/",
    application: "Graduate-entry doctor of medicine route. Research prestige is high, but entry structure is totally different from undergraduate medicine.",
    interview: "MMI with strong emphasis on reflection, communication, ethics, and professionalism.",
    ruralInfo: "Regional Victorian placements and rural clinical school options are meaningful advantages.",
    accommodation: "Central Melbourne lifestyle with huge student ecosystem, strong academic culture, and lots of opportunities.",
    vibe: { structure: 8, independence: 8, prestige: 10, rural: 5, city: 9, research: 10, support: 7, flexibility: 8 },
  },
  {
    id: "uq-postgrad",
    name: "University of Queensland",
    shortName: "UQ",
    pathway: ["postgrad"],
    tac: "qtac",
    state: "QLD",
    rank: 4,
    duration: "4 years",
    places: 490,
    scholarships: "8 scholarships",
    location: "Herston / St Lucia",
    noUcat: true,
    program: "Doctor of Medicine",
    officialUrl: "https://study.uq.edu.au/study-options/programs/doctor-medicine-5740",
    application: "Graduate-entry and provisional-entry structures sit inside the broader UQ ecosystem. Users need to separate them clearly.",
    interview: "MMI-style assessment with communication and reasoning focus.",
    ruralInfo: "Queensland regional training breadth is a major structural strength.",
    accommodation: "Brisbane has a strong balance of city life without quite the same pressure as Sydney/Melbourne.",
    vibe: { structure: 8, independence: 7, prestige: 8, rural: 6, city: 8, research: 8, support: 7, flexibility: 8 },
  },
  {
    id: "notre-dame-postgrad",
    name: "University of Notre Dame Australia",
    shortName: "Notre Dame",
    pathway: ["postgrad"],
    tac: "direct",
    state: "WA/NSW",
    rank: 17,
    duration: "4 years",
    places: 180,
    scholarships: "4 scholarships",
    location: "Fremantle / Sydney",
    noUcat: true,
    program: "Doctor of Medicine",
    officialUrl: "https://www.notredame.edu.au/programs/school-of-medicine/doctor-of-medicine",
    application: "Direct process with campus-specific details. Portfolio and interview feel more central than some score-driven schools.",
    interview: "MMI with strong values, motivation, and communication weighting.",
    ruralInfo: "Rural WA and NSW placement exposure available depending on campus and structure.",
    accommodation: "Campus choice changes the lifestyle dramatically: Fremantle is very different to Sydney.",
    vibe: { structure: 7, independence: 7, prestige: 5, rural: 6, city: 6, research: 5, support: 8, flexibility: 8 },
  },
  {
    id: "wollongong-postgrad",
    name: "University of Wollongong",
    shortName: "Wollongong",
    pathway: ["postgrad", "biomed"],
    tac: "uac",
    state: "NSW",
    rank: 18,
    duration: "4 years",
    places: 80,
    scholarships: "3 scholarships",
    location: "Wollongong",
    noUcat: true,
    program: "Doctor of Medicine",
    officialUrl: "https://www.uow.edu.au/study/doctor-of-medicine/",
    application: "Graduate-entry pathway with holistic profile emphasis.",
    interview: "MMI with a fit-and-reflection flavour rather than pure prestige filtering.",
    ruralInfo: "Southern NSW exposure and regional context make it attractive for students wanting less metro intensity.",
    accommodation: "Coastal regional-city feel with a calmer pace than Sydney.",
    vibe: { structure: 7, independence: 7, prestige: 5, rural: 7, city: 4, research: 5, support: 8, flexibility: 8 },
  },
  {
    id: "uwa-postgrad",
    name: "University of Western Australia",
    shortName: "UWA",
    pathway: ["postgrad"],
    tac: "tisc",
    state: "WA",
    rank: 5,
    duration: "4 years",
    places: 240,
    scholarships: "5 scholarships",
    location: "Crawley (Perth)",
    noUcat: true,
    program: "Doctor of Medicine",
    officialUrl: "https://www.uwa.edu.au/study/courses/doctor-of-medicine",
    application: "Graduate-entry style comparison for this section, even though UWA is often discussed across multiple structures.",
    interview: "MMI with strong communication and professional behaviour components.",
    ruralInfo: "Regional WA placements are a real program strength.",
    accommodation: "Perth lifestyle, broad state footprint, and strong balance between prestige and livability.",
    vibe: { structure: 8, independence: 7, prestige: 8, rural: 6, city: 7, research: 8, support: 7, flexibility: 7 },
  },
];

const undergradQuestions: QuizQuestion[] = [
  {
    id: "study_style",
    text: "Your ideal study style is...",
    answers: [
      { text: "Clear schedules, lectures, and defined expectations", delta: { structure: 3, support: 2 } },
      { text: "A mix of guidance and independence", delta: { flexibility: 2, support: 1, independence: 1 } },
      { text: "Mostly self-directed, learn-by-doing", delta: { independence: 3, flexibility: 2 } },
    ],
  },
  {
    id: "where_live",
    text: "What kind of place do you think you would thrive in?",
    answers: [
      { text: "Big city, lots happening, high energy", delta: { city: 3, prestige: 1 } },
      { text: "Mid-sized city with some balance", delta: { support: 2, flexibility: 2 } },
      { text: "Regional or quieter environment", delta: { rural: 3, support: 1 } },
    ],
  },
  {
    id: "why_med",
    text: "Which part of medicine appeals to you most right now?",
    answers: [
      { text: "Human connection and community impact", delta: { rural: 2, support: 2 } },
      { text: "Academic challenge and high performance", delta: { prestige: 2, structure: 2 } },
      { text: "Exploring pathways and keeping options open", delta: { flexibility: 3, independence: 1 } },
    ],
  },
  {
    id: "pressure",
    text: "How do you feel about highly competitive, intense environments?",
    answers: [
      { text: "I like them. They motivate me.", delta: { prestige: 3, city: 1 } },
      { text: "I can handle them, but balance matters.", delta: { support: 2, structure: 1 } },
      { text: "I prefer calmer environments where I can breathe.", delta: { rural: 2, support: 2, city: -1 } },
    ],
  },
  {
    id: "research",
    text: "How important is big-name research reputation to you?",
    answers: [
      { text: "Very important", delta: { research: 3, prestige: 2 } },
      { text: "Nice, but not the main thing", delta: { flexibility: 1, support: 1 } },
      { text: "Not a big priority compared to fit", delta: { support: 2, rural: 1 } },
    ],
  },
  {
    id: "resources",
    text: "What kind of support do you think you’ll need at uni?",
    answers: [
      { text: "A lot of structure and support at first", delta: { support: 3, structure: 2 } },
      { text: "Some support, but I also want independence", delta: { support: 1, independence: 1, flexibility: 1 } },
      { text: "I’m confident being independent quickly", delta: { independence: 3, city: 1 } },
    ],
  },
  {
    id: "future",
    text: "Which statement sounds most like you?",
    answers: [
      { text: "I want the clearest direct route into medicine.", delta: { structure: 3, prestige: 1 } },
      { text: "I want a uni I’ll genuinely enjoy living in.", delta: { support: 2, city: 1, rural: 1 } },
      { text: "I’m okay with a less traditional path if it suits me better.", delta: { flexibility: 3, independence: 1 } },
    ],
  },
  {
    id: "identity",
    text: "What kind of uni identity appeals to you most?",
    answers: [
      { text: "Prestigious and high-profile", delta: { prestige: 3, research: 2 } },
      { text: "Grounded, supportive, and practical", delta: { support: 3, rural: 1 } },
      { text: "Mission-driven and different from the default", delta: { rural: 2, flexibility: 2 } },
    ],
  },
];

const postgradQuestions: QuizQuestion[] = [
  {
    id: "postgrad_1",
    text: "What matters most in a postgrad med option?",
    answers: [
      { text: "Prestige and research environment", delta: { prestige: 3, research: 3 } },
      { text: "Strong support and sustainable lifestyle", delta: { support: 3, flexibility: 2 } },
      { text: "Regional footprint and practical training", delta: { rural: 3, support: 1 } },
    ],
  },
  {
    id: "postgrad_2",
    text: "How do you feel about the pace of a graduate-entry MD?",
    answers: [
      { text: "I want intensity and challenge", delta: { structure: 2, prestige: 2 } },
      { text: "I want challenge, but with support", delta: { support: 2, structure: 1 } },
      { text: "I need a place I can actually breathe", delta: { flexibility: 2, rural: 1 } },
    ],
  },
  {
    id: "postgrad_3",
    text: "What kind of city or setting suits you now?",
    answers: [
      { text: "Major capital city", delta: { city: 3, research: 1 } },
      { text: "Balanced city or regional city", delta: { support: 2, flexibility: 2 } },
      { text: "Strong regional identity", delta: { rural: 3 } },
    ],
  },
  {
    id: "postgrad_4",
    text: "What kind of program culture do you want?",
    answers: [
      { text: "Elite, high-output, research-rich", delta: { prestige: 3, research: 2 } },
      { text: "Student-friendly and grounded", delta: { support: 3 } },
      { text: "Mission-focused and values-driven", delta: { rural: 2, flexibility: 2 } },
    ],
  },
  {
    id: "postgrad_5",
    text: "What is your biggest need personally?",
    answers: [
      { text: "Recognition and opportunities", delta: { prestige: 2, research: 2 } },
      { text: "Balance and survivability", delta: { support: 2, flexibility: 2 } },
      { text: "Meaningful placement exposure", delta: { rural: 2, support: 1 } },
    ],
  },
];

const biomedQuestions: QuizQuestion[] = [
  {
    id: "biomed_1",
    text: "Why does the biomed pathway appeal to you?",
    answers: [
      { text: "I want more time to build my GPA and confidence", delta: { support: 3, structure: 1 } },
      { text: "I want a backup degree if medicine doesn’t work out", delta: { flexibility: 3 } },
      { text: "I like the science side and research angle", delta: { research: 3, prestige: 1 } },
    ],
  },
  {
    id: "biomed_2",
    text: "What environment would help you perform best first?",
    answers: [
      { text: "A big, resource-rich university", delta: { city: 2, research: 2, prestige: 1 } },
      { text: "A supportive campus where I won’t get lost", delta: { support: 3 } },
      { text: "A place with strong regional identity", delta: { rural: 3 } },
    ],
  },
  {
    id: "biomed_3",
    text: "How do you see the biomed pathway?",
    answers: [
      { text: "A strategic second route into medicine", delta: { structure: 2, flexibility: 2 } },
      { text: "A chance to grow before high-stakes med entry", delta: { support: 2, flexibility: 2 } },
      { text: "A science degree I would genuinely enjoy anyway", delta: { research: 2, independence: 2 } },
    ],
  },
  {
    id: "biomed_4",
    text: "Which trade-off sounds most worth it?",
    answers: [
      { text: "Longer timeline, but more security", delta: { flexibility: 3, support: 1 } },
      { text: "Competitive city environment with more opportunity", delta: { city: 2, prestige: 2 } },
      { text: "A steadier environment with less chaos", delta: { support: 3, rural: 1 } },
    ],
  },
  {
    id: "biomed_5",
    text: "What matters most in your first degree experience?",
    answers: [
      { text: "Good science teaching and pathways", delta: { structure: 2, research: 2 } },
      { text: "Student support and fit", delta: { support: 3 } },
      { text: "Flexibility and future options", delta: { flexibility: 3, independence: 1 } },
    ],
  },
];

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function pathwayLabel(pathway: PathwayKey) {
  if (pathway === "undergrad") return "Undergrad";
  if (pathway === "postgrad") return "Postgrad";
  return "Biomed";
}

function pathwayIcon(pathway: PathwayKey) {
  if (pathway === "undergrad") return GraduationCap;
  if (pathway === "postgrad") return Stethoscope;
  return FlaskConical;
}

function SoftCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-[26px] border border-slate-200 bg-white/85 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur", className)}>
      {children}
    </div>
  );
}

function pathwayBlurb(pathway: PathwayKey) {
  if (pathway === "undergrad") {
    return {
      title: "Undergraduate Direct Entry",
      text: "Start straight from high school. Usually 5 to 6 years long. Requires ATAR and often UCAT.",
      tone: "border-blue-300 bg-blue-50 text-blue-900",
    };
  }
  if (pathway === "postgrad") {
    return {
      title: "Graduate Entry Medicine",
      text: "Requires completion of a bachelor degree first. Usually 4 years. GAMSAT typically required.",
      tone: "border-violet-300 bg-violet-50 text-violet-900",
    };
  }
  return {
    title: "Biomedical Science Pathways",
    text: "Do a bachelor degree first, often Biomed or Health Science, then progress into the MD. Total 7 years is common.",
    tone: "border-emerald-300 bg-emerald-50 text-emerald-900",
  };
}

function getQuestions(pathway: PathwayKey) {
  if (pathway === "undergrad") return undergradQuestions;
  if (pathway === "postgrad") return postgradQuestions;
  return biomedQuestions;
}

function scoreUniversities(pathway: PathwayKey, answers: Record<string, number>) {
  const eligible = universities.filter((u) => u.pathway.includes(pathway));
  const keys = ["structure", "independence", "prestige", "rural", "city", "research", "support", "flexibility"] as const;

  const raw = eligible.map((uni) => {
    let score = 0;
    keys.forEach((key) => {
      score += (answers[key] ?? 0) * uni.vibe[key];
    });
    return { uni, score };
  });

  const max = Math.max(...raw.map((r) => r.score), 1);
  return raw
    .map((r) => ({ ...r, probability: Math.round((r.score / max) * 100) }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5);
}

function QuizCard({ pathway }: { pathway: PathwayKey }) {
  const questions = getQuestions(pathway);
  const [index, setIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const current = questions[index];

  const computedScores = useMemo(() => {
    const totals: Record<string, number> = {};

    questions.forEach((question) => {
      const selectedIndex = selectedAnswers[question.id];
      if (selectedIndex === undefined) return;

      const selected = question.answers[selectedIndex];
      if (!selected) return;

      Object.entries(selected.delta).forEach(([key, value]) => {
        totals[key] = (totals[key] ?? 0) + value;
      });
    });

    return totals;
  }, [questions, selectedAnswers]);

  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);
  const results = useMemo(
    () => scoreUniversities(pathway, computedScores),
    [pathway, computedScores]
  );

  function chooseAnswer(answerIndex: number) {
    const questionId = current.id;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));

    if (index === questions.length - 1) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  function goBack() {
    if (finished) {
      setFinished(false);
      setIndex(questions.length - 1);
      return;
    }

    if (index > 0) {
      setIndex((i) => i - 1);
    }
  }

  function restart() {
    setIndex(0);
    setSelectedAnswers({});
    setFinished(false);
  }

  return (
    <SoftCard className="p-6">
      <div className="mb-4">
        <h2 className="text-3xl font-black tracking-tight text-slate-950">
          What Med School is Best Suited to You?
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          This is the med-school version of a “what kind of Disney princess are you?” quiz, except it matches study style, lifestyle, resources, and pathway fit.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {(["undergrad", "biomed", "postgrad"] as PathwayKey[]).map((key) => (
          <span
            key={key}
            className={cx(
              "rounded-xl border px-4 py-2 text-sm font-semibold",
              key === pathway
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-white text-slate-700"
            )}
          >
            {pathwayLabel(key)}
          </span>
        ))}
      </div>

      {!finished ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium">
              Question {index + 1} of {questions.length}
            </span>
            <span>{progress}% complete</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-slate-900"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.25 }}
            />
          </div>

          <div>
            <h3 className="text-3xl font-black tracking-tight text-slate-950">
              {current.text}
            </h3>
          </div>

          <div className="space-y-3">
            {current.answers.map((answer, answerIndex) => {
              const isSelected = selectedAnswers[current.id] === answerIndex;

              return (
                <button
                  key={answer.text}
                  onClick={() => chooseAnswer(answerIndex)}
                  className={cx(
                    "w-full rounded-[18px] border px-5 py-5 text-left text-base font-medium shadow-sm transition",
                    isSelected
                      ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                      : "border-slate-200 bg-white text-slate-800 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
                  )}
                >
                  {answer.text}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 text-sm">
            <button
              onClick={goBack}
              disabled={index === 0}
              className="text-slate-500 transition hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            <button
              onClick={restart}
              className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800"
            >
              <RotateCcw className="h-4 w-4" />
              Restart
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-[26px] border border-emerald-300 bg-linear-to-b from-emerald-50 to-white p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-200">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="text-4xl font-black tracking-tight text-slate-950">
              Your University Matches
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Based on your preferences and study style ({pathwayLabel(pathway)})
            </p>
          </div>

          <div className="space-y-4">
            {results.map((result, i) => (
              <div
                key={result.uni.id}
                className={cx(
                  "rounded-[20px] border p-5",
                  i === 0
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-white"
                )}
              >
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {i === 0 ? (
                      <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                        Best Match
                      </span>
                    ) : null}
                    <h4 className="text-2xl font-black tracking-tight text-slate-950">
                      {result.uni.shortName}
                    </h4>
                    <span
                      className={cx(
                        "rounded-full px-3 py-1 text-xs font-bold shadow-sm",
                        tacMeta[result.uni.tac].pill
                      )}
                    >
                      {tacMeta[result.uni.tac].label}
                    </span>
                  </div>
                  <span className="text-xl font-black text-emerald-700">
                    {result.probability}%
                  </span>
                </div>

                <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    className="h-full rounded-full bg-slate-950"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.probability}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <p className="text-sm text-slate-500">{result.uni.name}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={goBack}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Back
            </button>

            <button
              onClick={restart}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Take Quiz Again
            </button>
          </div>

          <div className="rounded-[20px] border border-amber-300 bg-amber-50 px-5 py-4 text-center text-sm text-amber-900">
            Remember: this quiz is for guidance only. Consider entry requirements, location, finances, support, and your personal circumstances before choosing your uni.
          </div>
        </div>
      )}
    </SoftCard>
  );
}

function JourneyAccordion() {
  const items = [
    ["Birth to Primary School", "0 to 12 years", "Foundation years where curiosity and learning habits begin", "border-pink-300 bg-pink-50 text-pink-900"],
    ["High School", "13 to 18 years", "This is where the trajectory starts forming", "border-blue-300 bg-blue-50 text-blue-900"],
    ["Gap Year or Alternate Degree", "18 to 20 years", "Optional but common. Not everyone gets in first try.", "border-amber-300 bg-amber-50 text-amber-900"],
    ["Medical School", "18 to 26 years", "This is where the identity shift happens", "border-emerald-300 bg-emerald-50 text-emerald-900"],
    ["Internship (PGY1)", "22 to 27 years", "The hardest adjustment year", "border-violet-300 bg-violet-50 text-violet-900"],
    ["Residency (PGY2 to 3)", "Mid 20s", "The competence phase", "border-cyan-300 bg-cyan-50 text-cyan-900"],
    ["Training Pathways", "Late 20s to 30s", "Choosing your specialty direction", "border-indigo-300 bg-indigo-50 text-indigo-900"],
    ["Consultant or Fellow", "30s to 40s", "The ‘final form’", "border-rose-300 bg-rose-50 text-rose-900"],
  ] as const;

  const [open, setOpen] = useState(true);

  return (
    <SoftCard className="p-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <div>
          <h3 className="text-2xl font-black tracking-tight text-slate-950">
            The Medical Journey
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            What the path to becoming a doctor really looks like
          </p>
        </div>
        <ChevronDown
          className={cx(
            "h-5 w-5 text-slate-500 transition",
            open ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-5 space-y-3">
              {items.map(([title, age, desc, tone]) => (
                <div key={title} className={cx("rounded-[20px] border p-4", tone)}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-black tracking-tight">{title}</p>
                      <span className="mt-2 inline-block rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {age}
                      </span>
                      <p className="mt-3 text-sm">{desc}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[20px] border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-bold">The hidden truths most people do not say</p>
              <ul className="mt-2 space-y-1">
                <li>Many med students feel impostor syndrome.</li>
                <li>Comparison is constant and dangerous.</li>
                <li>The “perfect” timeline is a myth.</li>
                <li>Detours often make better doctors.</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SoftCard>
  );
}

export default function ChooseYourUniPage() {
  const [pathway, setPathway] = useState<PathwayKey>("undergrad");

  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => u.pathway.includes(pathway));
  }, [pathway]);

  const blurb = pathwayBlurb(pathway);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_24%),radial-gradient(circle_at_right,rgba(139,92,246,0.08),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f6f7fb_42%,#f8fafc_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
            Explore
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Find your best-fit university
          </span>
        </div>

        <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 via-teal-500 to-violet-500" />
          <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-emerald-100 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-violet-100 blur-3xl" />

          <div className="relative z-10 space-y-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Choose Your Uni
              </h1>
              <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                Find your best-fit university, match to your study style, and view all the core details for each med pathway in one spot.
              </p>
            </div>

            <SoftCard className="p-5">
              <div className="mb-4 flex items-center gap-2 text-slate-950">
                <School className="h-5 w-5 text-emerald-600" />
                <h2 className="text-2xl font-black tracking-tight">
                  Entry Pathways into Medicine
                </h2>
              </div>
              <p className="mb-4 text-sm text-slate-500">
                Understanding the different routes to medical school
              </p>

              <div className="mb-4 rounded-[18px] border border-slate-200 bg-slate-50 p-1">
                <div className="grid grid-cols-3 gap-1">
                  {(["undergrad", "postgrad", "biomed"] as PathwayKey[]).map((key) => {
                    const Icon = pathwayIcon(key);

                    return (
                      <button
                        key={key}
                        onClick={() => setPathway(key)}
                        className={cx(
                          "min-w-0 rounded-xl px-2 py-2 text-xs font-semibold transition sm:px-4 sm:py-3 sm:text-sm",
                          pathway === key
                            ? "bg-white text-slate-950 shadow-sm"
                            : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
                        )}
                      >
                        <span className="inline-flex min-w-0 items-center justify-center gap-1.5">
                          <Icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                          {pathwayLabel(key)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={cx("rounded-[20px] border p-4", blurb.tone)}>
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4" />
                  <div>
                    <p className="font-bold">{blurb.title}</p>
                    <p className="mt-1 text-sm">{blurb.text}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {filteredUniversities.map((uni) => (
                  <div
                    key={uni.id}
                    className="rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cx(
                          "rounded-full px-3 py-1 text-xs font-bold shadow-sm",
                          tacMeta[uni.tac].pill
                        )}
                      >
                        {tacMeta[uni.tac].label}
                      </span>
                      <span className="text-base font-semibold text-slate-900">
                        {uni.shortName}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold">
                        {uni.duration}
                      </span>
                      <span>
                        {pathway === "biomed"
                          ? "Biomed pathway"
                          : pathway === "postgrad"
                            ? "Postgrad"
                            : "Direct entry"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {pathway === "biomed" ? (
                <div className="mt-5 rounded-[20px] border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                  <p className="font-bold">Why choose the biomed pathway?</p>
                  <ul className="mt-2 space-y-1">
                    <li>More time to build GPA</li>
                    <li>Can sit GAMSAT multiple times</li>
                    <li>Backup degree if medicine does not work out</li>
                    <li>Often less UCAT pressure</li>
                  </ul>
                </div>
              ) : null}
            </SoftCard>

            <QuizCard pathway={pathway} />

            <JourneyAccordion />
          </div>
        </div>
      </div>
    </div>
  );
}
