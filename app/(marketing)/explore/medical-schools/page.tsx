"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  MapPinned,
  GitCompareArrows,
  EyeOff,
  ExternalLink,
  MapPin,
  Users,
  Clock3,
  GraduationCap,
  Award,
  ChevronDown,
  ChevronRight,
  X,
  BookOpen,
  Info,
  Stethoscope,
  Trees,
  Building2,
  CheckCircle2,
  Sparkles,
  Filter,
  School,
  BadgeInfo,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

const DynamicMap = dynamic(() => import("./medical-schools-map"), { ssr: false });

type TacKey = "vtac" | "satac" | "qtac" | "uac" | "tisc" | "direct";
type StateKey = "VIC" | "NSW" | "QLD" | "SA" | "WA" | "ACT" | "NT" | "TAS" | "WA/NSW";
type SizeKey = "small" | "medium" | "large";
type DetailTab = "overview" | "entry" | "interview" | "rural";

type SchoolData = {
  id: string;
  name: string;
  shortName: string;
  university: string;
  state: StateKey;
  tac: TacKey;
  noUcat?: boolean;
  ranking: number;
  places: number;
  scholarships: number;
  duration: string;
  program: string;
  code: string;
  model: string;
  competitiveness: string;
  intakeSummary: string;
  campus: string;
  ruralLocations?: string;
  colleges?: string[];
  lat: number;
  lng: number;
  officialUrl: string;
  metroAtar?: string;
  metroUcat?: string;
  ruralAtar?: string;
  ruralUcat?: string;
  intlAtar?: string;
  intlUcat?: string;
  interviewFormat: string;
  stations?: string;
  stationTime?: string;
  interviewAreas: string[];
  overviewNote: string;
  entryProcess: string;
  ruralInfo: string;
  ruralEligibility: string[];
  biomedPathway?: boolean;
  compareInsights: string[];
  status?: "active" | "planned";
  badge?: string;
};

const tacMeta: Record<TacKey, { label: string; pill: string; soft: string; border: string }> = {
  vtac: { label: "VTAC", pill: "bg-blue-600 text-white", soft: "bg-blue-50 text-blue-700", border: "border-blue-300" },
  satac: { label: "SATAC", pill: "bg-emerald-600 text-white", soft: "bg-emerald-50 text-emerald-700", border: "border-emerald-300" },
  qtac: { label: "QTAC", pill: "bg-rose-600 text-white", soft: "bg-rose-50 text-rose-700", border: "border-rose-300" },
  uac: { label: "UAC", pill: "bg-cyan-600 text-white", soft: "bg-cyan-50 text-cyan-700", border: "border-cyan-300" },
  tisc: { label: "TISC", pill: "bg-violet-600 text-white", soft: "bg-violet-50 text-violet-700", border: "border-violet-300" },
  direct: { label: "Direct", pill: "bg-slate-600 text-white", soft: "bg-slate-50 text-slate-700", border: "border-slate-300" },
};

const schools: SchoolData[] = [
  {
    id: "adelaide",
    name: "University of Adelaide",
    shortName: "Adelaide",
    university: "University of Adelaide",
    state: "SA",
    tac: "satac",
    ranking: 8,
    places: 160,
    scholarships: 5,
    duration: "6 years",
    program: "Bachelor of Medical Studies / Doctor of Medicine",
    code: "334811",
    model: "Balanced (ATAR + UCAT + Interview)",
    competitiveness: "High",
    intakeSummary: "Medium (~150–160)",
    campus: "North Terrace (Adelaide)",
    colleges: ["St Mark's College", "St Ann's College", "Lincoln College", "Aquinas College"],
    lat: -34.9205,
    lng: 138.6076,
    officialUrl: "https://health.adelaide.edu.au/medicine/",
    metroAtar: "99.80",
    metroUcat: "2400",
    ruralAtar: "97.00",
    ruralUcat: "2100",
    intlAtar: "99.70",
    intlUcat: "2400",
    interviewFormat: "MMI",
    stations: "6",
    stationTime: "10 min/station",
    interviewAreas: ["Communication skills", "Ethical reasoning", "Problem solving and critical thinking", "Teamwork and collaboration", "Motivation for medicine", "Professionalism and empathy"],
    overviewNote: "Adelaide offers a 6-year undergraduate medical program with strong clinical exposure.",
    entryProcess: "Apply via SATAC. UCAT ANZ required. Interview by invitation.",
    ruralInfo: "Rural Background Entry pathway via SATAC. Need 5+ years rural residence.",
    ruralEligibility: ["Lived in MM2-MM7 area for 5+ consecutive years OR 10+ cumulative years", "Check postcode on a health workforce locator", "Statutory declaration often required"],
    compareInsights: ["UCAT matters moderately in selection", "Interview-focused with six-station MMI", "Rural advantage through reduced rural thresholds"],
  },
  {
    id: "anu",
    name: "Australian National University",
    shortName: "ANU",
    university: "Australian National University",
    state: "ACT",
    tac: "uac",
    ranking: 3,
    places: 90,
    scholarships: 4,
    duration: "6 years",
    program: "Bachelor of Health Science / Doctor of Medicine and Surgery",
    code: "180500",
    model: "Balanced",
    competitiveness: "Very High",
    intakeSummary: "Small (~90)",
    campus: "Canberra",
    ruralLocations: "Rural placements across ACT/NSW",
    lat: -35.2777,
    lng: 149.1185,
    officialUrl: "https://science.anu.edu.au/study/masters/doctor-medicine-surgery-mchd",
    metroAtar: "99.00",
    metroUcat: "2400",
    ruralAtar: "97.00",
    ruralUcat: "2100",
    intlAtar: "99.00",
    intlUcat: "2400",
    interviewFormat: "MMI",
    stations: "6",
    stationTime: "8–10 min/station",
    interviewAreas: ["Reasoning", "Communication", "Professional behaviour", "Motivation", "Reflection", "Teamwork"],
    overviewNote: "ANU combines a health science pathway with a later doctor of medicine and surgery structure.",
    entryProcess: "Apply through UAC. UCAT required for undergraduate pathway. Interview by shortlist.",
    ruralInfo: "ANU recognises rural pathways and placements strongly across ACT and nearby NSW regions.",
    ruralEligibility: ["Rural criteria checked against official definitions and evidence", "Reduced thresholds can apply for rural applicants", "Placements often extend into regional areas"],
    compareInsights: ["Rural advantage of roughly 2 ATAR points in the mock data", "Smaller cohort than many metro-heavy schools", "Strong Canberra base with regional exposure"],
  },
  {
    id: "bond",
    name: "Bond University",
    shortName: "Bond",
    university: "Bond University",
    state: "QLD",
    tac: "direct",
    noUcat: true,
    ranking: 15,
    places: 120,
    scholarships: 3,
    duration: "4.8 years",
    program: "Bachelor of Medical Studies / Doctor of Medicine",
    code: "MD001",
    model: "Holistic (interview-heavy, no UCAT)",
    competitiveness: "High",
    intakeSummary: "Medium (~100–120)",
    campus: "Gold Coast",
    lat: -28.0780,
    lng: 153.3826,
    officialUrl: "https://bond.edu.au/program/medical-program-bachelor-of-medical-studies-doctor-of-medicine",
    metroAtar: "98.50",
    ruralAtar: "96.50",
    intlAtar: "98.00",
    interviewFormat: "MMI",
    stations: "4",
    stationTime: "Varies",
    interviewAreas: ["Motivation", "Communication", "Professional fit", "Ethics"],
    overviewNote: "Bond runs a private accelerated-style medicine pathway with multiple intakes and no UCAT requirement.",
    entryProcess: "Apply directly to Bond. Internal selection process with interview focus.",
    ruralInfo: "No dedicated TAC rural pathway in the same way as public schools, but context can still matter.",
    ruralEligibility: ["Check Bond's current admissions framework directly", "No standard TAC rural threshold published in the same way", "Private tuition structure changes the decision-making lens"],
    compareInsights: ["No UCAT route can suit certain students", "Private fee model changes affordability dramatically", "Interview maturity matters heavily"],
  },
  {
    id: "cdu",
    name: "Charles Darwin University",
    shortName: "CDU",
    university: "Charles Darwin University",
    state: "NT",
    tac: "satac",
    ranking: 19,
    places: 60,
    scholarships: 3,
    duration: "6 years",
    program: "Bachelor of Clinical Sciences / Doctor of Medicine",
    code: "YBLCS1",
    model: "Mission-based / rural-focused",
    competitiveness: "Moderate–High",
    intakeSummary: "Very Small (~60)",
    campus: "Darwin",
    ruralLocations: "Alice Springs, Katherine",
    lat: -12.4634,
    lng: 130.8456,
    officialUrl: "https://www.cdu.edu.au/study/course/bachelor-clinical-science-medicinedoctor-medicine-smed01",
    metroAtar: "99.50",
    ruralAtar: "96.50",
    intlAtar: "98.00",
    interviewFormat: "MMI",
    stations: "6",
    stationTime: "Varies",
    interviewAreas: ["Rural commitment", "Communication", "Community focus", "Reflection"],
    overviewNote: "CDU's pathway is strongly mission-based with a northern and remote-health orientation.",
    entryProcess: "Apply via SATAC with school-specific requirements. UCAT pathway assumptions vary by stream and cycle.",
    ruralInfo: "Remote and regional commitment is central to the program identity.",
    ruralEligibility: ["Rural and remote background evidence may strengthen alignment", "Mission-based selection matters", "Northern Territory health context is central"],
    compareInsights: ["Very small cohort changes competitive feel", "Mission-fit matters more than prestige", "Rural and remote intent is a real selection theme"],
  },
  {
    id: "curtin",
    name: "Curtin University",
    shortName: "Curtin",
    university: "Curtin University",
    state: "WA",
    tac: "tisc",
    ranking: 14,
    places: 110,
    scholarships: 4,
    duration: "5 years",
    program: "Bachelor of Medicine, Bachelor of Surgery",
    code: "M-BBBS",
    model: "ATAR + UCAT heavy early filter",
    competitiveness: "Very High",
    intakeSummary: "Small (~60–110)",
    campus: "Perth (Bentley)",
    ruralLocations: "Kalgoorlie, rural WA placements",
    lat: -32.0054,
    lng: 115.8940,
    officialUrl: "https://www.curtin.edu.au/study/offering/course-ug-bachelor-of-medicine-bachelor-of-surgery--b-mbbs/",
    metroAtar: "98.50",
    metroUcat: "2400",
    ruralAtar: "96.50",
    ruralUcat: "2100",
    intlAtar: "98.30",
    intlUcat: "2400",
    interviewFormat: "MMI",
    stations: "8",
    stationTime: "7–8 min/station",
    interviewAreas: ["Communication", "Ethics", "Problem-solving", "Rural awareness", "Motivation"],
    overviewNote: "Curtin is one of WA's key undergraduate medicine routes and sits inside the TISC ecosystem.",
    entryProcess: "Apply via TISC. UCAT required, with additional requirements depending on cycle.",
    ruralInfo: "Regional WA placements and rural connections matter in the broader program structure.",
    ruralEligibility: ["Rural bonus or pathway details vary by cycle", "Check WA-specific evidence requirements", "Regional placement opportunities are part of the appeal"],
    compareInsights: ["WA-based students often compare Curtin directly with UWA", "UCAT pressure is usually significant", "Small intake amplifies competition"],
  },
  {
    id: "deakin",
    name: "Deakin University",
    shortName: "Deakin",
    university: "Deakin University",
    state: "VIC",
    tac: "vtac",
    noUcat: true,
    ranking: 11,
    places: 150,
    scholarships: 3,
    duration: "4 years (graduate)",
    program: "Doctor of Medicine",
    code: "D302",
    model: "GPA + Portfolio + Interview",
    competitiveness: "Moderate",
    intakeSummary: "Medium (~130–150)",
    campus: "Geelong (Waurn Ponds)",
    ruralLocations: "Warrnambool, Ballarat",
    lat: -38.1971,
    lng: 144.2980,
    officialUrl: "https://www.deakin.edu.au/course/doctor-medicine",
    interviewFormat: "MMI",
    stations: "6",
    stationTime: "Varies",
    interviewAreas: ["Reflection", "Communication", "Professional behaviour", "Values"],
    overviewNote: "Deakin is a graduate-entry MD and does not sit inside the standard UCAT school-leaver lane.",
    entryProcess: "Graduate-entry process with GPA and admissions test considerations outside the undergraduate UCAT route.",
    ruralInfo: "Regional Victorian footprint is one of Deakin's structural strengths.",
    ruralEligibility: ["Regional background can matter strategically", "Graduate-entry rules differ from school leaver medicine", "Always separate undergraduate and graduate assumptions"],
    biomedPathway: true,
    compareInsights: ["Not a direct school-leaver comparison for most users", "Regional Victorian training footprint is meaningful", "Graduate-entry structure changes the whole strategy"],
  },
  {
    id: "flinders",
    name: "Flinders University",
    shortName: "Flinders",
    university: "Flinders University",
    state: "SA",
    tac: "satac",
    ranking: 10,
    places: 130,
    scholarships: 4,
    duration: "4 years (graduate)",
    program: "Doctor of Medicine",
    code: "MDOC",
    model: "GPA + GAMSAT / Interview",
    competitiveness: "Moderate",
    intakeSummary: "Medium (~120–130)",
    campus: "Bedford Park (Adelaide)",
    ruralLocations: "Northern Territory, Riverland, Darwin",
    lat: -35.0215,
    lng: 138.5711,
    officialUrl: "https://www.flinders.edu.au/study/courses/postgraduate-doctor-medicine",
    interviewFormat: "Panel",
    stations: "Panel",
    stationTime: "Varies",
    interviewAreas: ["Insight", "Professional maturity", "Motivation", "Communication"],
    overviewNote: "Flinders is graduate-entry and often discussed separately from undergraduate SATAC medicine pathways.",
    entryProcess: "Apply via graduate-entry route. Undergraduate assumptions do not map directly here.",
    ruralInfo: "Flinders has longstanding regional and NT-oriented training links.",
    ruralEligibility: ["Rural and regional commitment is part of the broader identity", "Graduate-entry rural schemes may differ from school-leaver models", "Check current Flinders substreams carefully"],
    biomedPathway: true,
    compareInsights: ["Graduate-entry model changes comparison logic", "Regional and NT links are a strength", "Interview structure differs from MMI-heavy schools"],
  },
  {
    id: "griffith",
    name: "Griffith University",
    shortName: "Griffith",
    university: "Griffith University",
    state: "QLD",
    tac: "qtac",
    noUcat: true,
    ranking: 13,
    places: 190,
    scholarships: 3,
    duration: "6 years total (2+4)",
    program: "Doctor of Medicine (Provisional Entry)",
    code: "1532",
    model: "ATAR-heavy initial ranking",
    competitiveness: "Very High",
    intakeSummary: "Medium (~100–150)",
    campus: "Gold Coast",
    ruralLocations: "Logan, rural Queensland placements",
    lat: -28.0780,
    lng: 153.3826,
    officialUrl: "https://www.griffith.edu.au/study/degrees/doctor-of-medicine-5099",
    metroAtar: "99.90",
    ruralAtar: "97.00",
    intlAtar: "99.90",
    interviewFormat: "No Interview",
    stations: "None",
    stationTime: "N/A",
    interviewAreas: [],
    overviewNote: "Griffith's provisional structure creates a different feel from standard single-degree undergraduate entry.",
    entryProcess: "Apply via QTAC and school-specific provisional-entry rules. No standard interview in the mock design shown.",
    ruralInfo: "Queensland regional and Logan-related pathways can matter strategically.",
    ruralEligibility: ["Rural subquotas and eligibility still need evidence", "No-UCAT and no-interview features shift the weight onto academics", "Always verify the current Griffith rule set"],
    compareInsights: ["No UCAT changes the applicant pool", "High ATAR pressure increases academic intensity", "Provisional entry means structure matters"],
  },
  {
    id: "jcu",
    name: "James Cook University",
    shortName: "JCU",
    university: "James Cook University",
    state: "QLD",
    tac: "qtac",
    noUcat: true,
    ranking: 12,
    places: 180,
    scholarships: 5,
    duration: "6 years",
    program: "Bachelor of Medicine, Bachelor of Surgery",
    code: "317012",
    model: "Strongly holistic / rural mission",
    competitiveness: "Moderate",
    intakeSummary: "Medium (~180)",
    campus: "Townsville, Cairns",
    ruralLocations: "Mackay, Mt Isa, Thursday Island, rural QLD",
    lat: -19.3200,
    lng: 146.7644,
    officialUrl: "https://www.jcu.edu.au/courses/bachelor-of-medicine-bachelor-of-surgery",
    metroAtar: "99.00",
    ruralAtar: "93.00",
    intlAtar: "98.50",
    interviewFormat: "Panel",
    stations: "Panel",
    stationTime: "Varies",
    interviewAreas: ["Rural and remote fit", "Communication", "Commitment to underserved communities", "Motivation"],
    overviewNote: "JCU has one of the clearest rural and northern-health missions in the country.",
    entryProcess: "Apply via QTAC and JCU's own selection framework. No UCAT in the standard model shown here.",
    ruralInfo: "Rural and regional alignment is central, not decorative.",
    ruralEligibility: ["Rural commitment is taken seriously", "Thresholds can be meaningfully different for rural applicants", "Mission fit matters heavily"],
    compareInsights: ["Best fit differs from best rank", "No UCAT changes the preparation profile", "North Queensland identity is core to the program"],
  },
  {
    id: "macquarie",
    name: "Macquarie University",
    shortName: "Macquarie",
    university: "Macquarie University",
    state: "NSW",
    tac: "uac",
    noUcat: true,
    ranking: 16,
    places: 80,
    scholarships: 3,
    duration: "4 years (graduate)",
    program: "Doctor of Medicine (Graduate Entry)",
    code: "MD001",
    model: "GPA + Interview",
    competitiveness: "High",
    intakeSummary: "Small (~80)",
    campus: "North Ryde (Sydney)",
    lat: -33.7730,
    lng: 151.1120,
    officialUrl: "https://www.mq.edu.au/faculty-of-medicine-health-and-human-sciences/departments-and-schools/macquarie-medical-school",
    interviewFormat: "MMI",
    stations: "4",
    stationTime: "Varies",
    interviewAreas: ["Communication", "Insight", "Professional suitability", "Reflection"],
    overviewNote: "Macquarie is a graduate-entry option and should be compared separately from school-leaver UCAT pathways.",
    entryProcess: "Graduate-entry admissions route. Undergraduate UCAT filters do not apply in the same way.",
    ruralInfo: "Macquarie is less rural-centred than some mission-based programs, but placement geography still matters.",
    ruralEligibility: ["Graduate-entry lens first", "Check any current regional experience elements", "Do not confuse with UAC undergraduate medicine schools"],
    biomedPathway: true,
    compareInsights: ["Small cohort intensifies graduate-entry competition", "No UCAT for undergrad comparison because it is graduate-entry", "Sydney location is a major differentiator"],
  },
  {
    id: "monash",
    name: "Monash University",
    shortName: "Monash",
    university: "Monash University",
    state: "VIC",
    tac: "vtac",
    ranking: 2,
    places: 300,
    scholarships: 6,
    duration: "5 years",
    program: "Bachelor of Medical Science and Doctor of Medicine",
    code: "M6011",
    model: "ATAR + UCAT heavy",
    competitiveness: "Extremely High",
    intakeSummary: "Large (~300)",
    campus: "Clayton",
    ruralLocations: "Gippsland, Mildura, Bendigo (partner)",
    lat: -37.9105,
    lng: 145.1361,
    officialUrl: "https://www.monash.edu/medicine/som/direct-entry/domestic",
    metroAtar: "99.50",
    metroUcat: "2580",
    ruralAtar: "96.00",
    ruralUcat: "2050",
    intlAtar: "99.00",
    intlUcat: "2580",
    interviewFormat: "MMI",
    stations: "6",
    stationTime: "Varies",
    interviewAreas: ["Ethics", "Communication", "Problem-solving", "Empathy", "Professional behaviour"],
    overviewNote: "Monash is one of the most visible direct-entry medicine pathways in Australia and is heavily benchmarked by school students.",
    entryProcess: "Apply through VTAC and Monash direct-entry requirements. UCAT required for domestic undergraduate route.",
    ruralInfo: "Monash supports regional training exposure through associated campuses and placements.",
    ruralEligibility: ["Rural thresholds are lower than metro in the mock design", "Regional placements and pathways matter", "Monash remains highly competitive even with larger intake"],
    biomedPathway: true,
    compareInsights: ["Big intake does not mean easy entry", "UCAT tends to carry real weight", "One of the clearest benchmark schools for direct-entry competition"],
  },
  {
    id: "melbourne",
    name: "University of Melbourne",
    shortName: "Melbourne",
    university: "University of Melbourne",
    state: "VIC",
    tac: "vtac",
    noUcat: true,
    ranking: 1,
    places: 350,
    scholarships: 8,
    duration: "4 years (after bachelor degree)",
    program: "Doctor of Medicine",
    code: "MD-001",
    model: "GPA + GAMSAT heavy",
    competitiveness: "Moderate–High",
    intakeSummary: "Very Large (~350)",
    campus: "Parkville (Melbourne)",
    ruralLocations: "Shepparton, Bendigo, Ballarat, rural Victoria",
    lat: -37.7982,
    lng: 144.9600,
    officialUrl: "https://study.unimelb.edu.au/find/courses/graduate/doctor-of-medicine/",
    metroAtar: "99.90",
    ruralAtar: "99.90",
    intlAtar: "99.90",
    interviewFormat: "MMI",
    stations: "8",
    stationTime: "Varies",
    interviewAreas: ["Reasoning", "Reflection", "Ethics", "Communication", "Professional suitability"],
    overviewNote: "Melbourne is graduate-entry and sits at the top of most research ranking tables, but not the undergraduate UCAT lane.",
    entryProcess: "Graduate-entry doctor of medicine route. Undergraduate ATAR/UCAT assumptions do not directly apply.",
    ruralInfo: "Rural and regional clinical school options form part of Melbourne's training spread.",
    ruralEligibility: ["Graduate-entry comparisons only", "Regional placements are available", "Research reputation is high, but entry strategy is different"],
    biomedPathway: true,
    compareInsights: ["Research prestige is strongest here", "Graduate-entry structure changes the prep pathway entirely", "Large cohort but still elite competition"],
  },
  {
    id: "newcastle-une",
    name: "University of Newcastle / UNE Joint Medical Program",
    shortName: "Newcastle/UNE",
    university: "University of Newcastle / UNE Joint Medical Program",
    state: "NSW",
    tac: "uac",
    ranking: 7,
    places: 200,
    scholarships: 5,
    duration: "5 years",
    program: "Bachelor of Medical Science / Doctor of Medicine",
    code: "232315",
    model: "UCAT + Interview focused",
    competitiveness: "High",
    intakeSummary: "Medium (~170–200)",
    campus: "Newcastle, Armidale (UNE)",
    ruralLocations: "Tamworth, Port Macquarie, Taree, Manning, Coffs Harbour",
    lat: -32.8920,
    lng: 151.7040,
    officialUrl: "https://www.newcastle.edu.au/joint-medical-program",
    metroAtar: "99.00",
    metroUcat: "2500",
    ruralAtar: "96.00",
    ruralUcat: "2100",
    intlAtar: "99.00",
    intlUcat: "2500",
    interviewFormat: "MSA / MMI hybrid",
    stations: "2 parts (6 stations)",
    stationTime: "Varies",
    interviewAreas: ["Problem solving", "Communication", "Suitability", "Rural context", "Values"],
    overviewNote: "The JMP has a distinctive shared structure between Newcastle and UNE with strong regional placement reach.",
    entryProcess: "Apply through UAC plus JMP-specific processes and timelines. UCAT required for the undergraduate stream.",
    ruralInfo: "Regional footprint across northern NSW is a major structural strength.",
    ruralEligibility: ["Rural and regional pathways are strategically important here", "Evidence and subquota rules matter", "JMP is one of the strongest regional-linked pathways in NSW"],
    compareInsights: ["Regional placement depth is a differentiator", "UCAT and interview both matter materially", "Armidale link changes the identity of the program"],
  },
  {
    id: "notre-dame",
    name: "University of Notre Dame Australia",
    shortName: "Notre Dame",
    university: "University of Notre Dame Australia",
    state: "WA/NSW",
    tac: "direct",
    ranking: 17,
    places: 180,
    scholarships: 4,
    duration: "4 years",
    program: "Doctor of Medicine",
    code: "MD-ND",
    model: "Portfolio + Interview heavy",
    competitiveness: "Moderate–High",
    intakeSummary: "Medium (~120–180)",
    campus: "Fremantle (Perth), Sydney",
    ruralLocations: "Rural WA, Rural NSW",
    lat: -32.0569,
    lng: 115.7439,
    officialUrl: "https://www.notredame.edu.au/programs/school-of-medicine/postgraduate/doctor-of-medicine-nsw",
    metroAtar: "99.00",
    metroUcat: "2400",
    ruralAtar: "96.50",
    ruralUcat: "2100",
    intlAtar: "99.00",
    intlUcat: "2400",
    interviewFormat: "MMI",
    stations: "7",
    stationTime: "Varies",
    interviewAreas: ["Values", "Communication", "Motivation", "Ethics", "Service orientation"],
    overviewNote: "Notre Dame is often chosen by students who value an interview- and portfolio-heavy profile rather than purely score-heavy selection.",
    entryProcess: "Direct university process with school-specific requirements. Check campus-specific details carefully.",
    ruralInfo: "Notre Dame spans WA and NSW contexts, with rural exposure options in both states.",
    ruralEligibility: ["Rural background can strengthen competitiveness", "Campus selection matters strategically", "Portfolio-style fit can matter more than users expect"],
    compareInsights: ["More values-and-fit driven than some score-heavy schools", "Campus choice changes context", "Direct process differs from TAC-heavy schools"],
  },
  {
  id: "uq",
  name: "University of Queensland",
  shortName: "UQ",
  university: "University of Queensland",
  state: "QLD",
  tac: "qtac",
  ranking: 4,
  places: 490,
  scholarships: 8,
  duration: "6 years (new direct pathway) + other UQ MD routes",
  program: "Bachelor of Medical Science / Doctor of Medicine + UQ MD pathways",
  code: "2260 / new 2027 pathway",
  model: "Two-lane system (new 6-year direct pathway + existing provisional/graduate options)",
  competitiveness: "High",
  intakeSummary: "Very Large UQ medicine ecosystem",
  campus: "Herston (MD), with broader UQ pathway links including St Lucia",
  ruralLocations: "Toowoomba, Bundaberg, Rockhampton, Hervey Bay",
  lat: -27.4975,
  lng: 153.0137,
  officialUrl: "https://study.uq.edu.au/stories/uqs-new-pathway-doctor-medicine",
  metroAtar: "95.00+",
  metroUcat: "UCAT required",
  ruralAtar: "Check pathway-specific thresholds",
  ruralUcat: "UCAT required",
  intlAtar: "N/A",
  intlUcat: "N/A",
  interviewFormat: "MMI",
  stations: "MMI",
  stationTime: "Varies",
  interviewAreas: [
    "Communication",
    "Ethical reasoning",
    "Reflection",
    "Suitability for medicine",
    "Teamwork",
  ],
  overviewNote:
    "UQ just added a brand-new 6-year Bachelor of Medical Science / Doctor of Medicine pathway starting in 2027, which means students can become doctors at least 1 year earlier than other UQ medicine routes. So UQ now has a proper two-lane vibe: the shiny new fast-track school-leaver route, plus its existing provisional and graduate-entry MD options.",
  entryProcess:
    "For the new 6-year pathway, applicants need an adjusted ATAR of 95+ (or equivalent), English, Mathematical Methods, and UCAT ANZ. UCAT is used to rank applicants for MMI invitations, and final selection is based on ATAR, UCAT and MMI performance.",
  ruralInfo:
    "UQ still keeps its strong distributed Queensland footprint, with regional pathway options and training links across areas like Central Queensland–Wide Bay and Darling Downs–South West, on top of the broader UQ MD network.",
  ruralEligibility: [
    "UQ now has multiple medicine lanes, so always separate the new 6-year direct pathway from provisional and graduate-entry options",
    "Regional and rural Queensland pathways remain a real strategic advantage",
    "Check official UQ pathway-specific eligibility rules instead of assuming one UQ rule covers everything",
  ],
  biomedPathway: true,
  compareInsights: [
    "Big update: UQ now has a true 6-year direct medicine pathway from 2027",
    "This route is faster than other UQ medicine pathways by at least 1 year",
    "UQ is no longer just a 'graduate/provisional maze' — it now has a cleaner school-leaver option too",
  ],
},
  {
    id: "uwa",
    name: "University of Western Australia",
    shortName: "UWA",
    university: "University of Western Australia",
    state: "WA",
    tac: "tisc",
    ranking: 5,
    places: 240,
    scholarships: 5,
    duration: "6 years",
    program: "Doctor of Medicine",
    code: "MD-BM",
    model: "ATAR + UCAT + Interview",
    competitiveness: "Very High",
    intakeSummary: "Large (~240)",
    campus: "Crawley (Perth)",
    ruralLocations: "Albany, Bunbury, Broome, Kalgoorlie",
    lat: -31.9800,
    lng: 115.8170,
    officialUrl: "https://www.uwa.edu.au/study/courses/doctor-of-medicine",
    metroAtar: "99.70",
    metroUcat: "2400",
    ruralAtar: "97.00",
    ruralUcat: "2100",
    intlAtar: "99.70",
    intlUcat: "2400",
    interviewFormat: "MMI",
    stations: "8",
    stationTime: "Varies",
    interviewAreas: ["Communication", "Ethics", "Reasoning", "Professional behaviour", "Motivation"],
    overviewNote: "UWA remains one of WA's flagship medicine options and is often directly compared with Curtin.",
    entryProcess: "Apply via TISC and UWA-specific medicine steps. UCAT required for school-leaver pathways.",
    ruralInfo: "Regional WA placements are a meaningful part of the training experience.",
    ruralEligibility: ["Rural categories can materially change competitiveness", "WA-specific evidence matters", "Placement geography is a genuine selling point"],
    compareInsights: ["Research prestige and WA footprint both strong", "Common direct competitor to Curtin", "Large WA-based cohort with distributed placements"],
  },
  {
    id: "sydney",
    name: "University of Sydney",
    shortName: "Sydney",
    university: "University of Sydney",
    state: "NSW",
    tac: "uac",
    noUcat: true,
    ranking: 1,
    places: 280,
    scholarships: 10,
    duration: "4 years (with bachelor degree)",
    program: "Doctor of Medicine",
    code: "511100",
    model: "GPA + GAMSAT heavy",
    competitiveness: "Moderate–High",
    intakeSummary: "Large (~300)",
    campus: "Camperdown (Sydney)",
    ruralLocations: "Dubbo, Orange, Broken Hill, Lismore",
    lat: -33.8886,
    lng: 151.1873,
    officialUrl: "https://www.sydney.edu.au/courses/courses/pc/doctor-of-medicine.html",
    metroAtar: "99.95",
    ruralAtar: "99.95",
    intlAtar: "99.95",
    interviewFormat: "Group discussion + written assessment",
    stations: "Group / Written",
    stationTime: "Varies",
    interviewAreas: ["Communication", "Reasoning", "Professional judgement", "Reflection"],
    overviewNote: "Sydney is one of the highest-profile graduate-entry medicine programs in the country and ranks near the very top on research metrics.",
    entryProcess: "Graduate-entry MD process. UCAT does not drive this pathway in the way school-leaver applicants often assume.",
    ruralInfo: "Dubbo and broader rural NSW training exposure make Sydney more geographically distributed than some users realise.",
    ruralEligibility: ["Graduate-entry comparisons only", "Rural training sites are a real structural advantage", "Research prestige does not equal easier or harder internship outcomes"],
    biomedPathway: true,
    compareInsights: ["Top research reputation", "Distinctive interview format differs from classic MMI schools", "Graduate-entry route changes the comparison frame"],
  },
  {
    id: "unsw",
    name: "UNSW Sydney",
    shortName: "UNSW",
    university: "UNSW Sydney",
    state: "NSW",
    tac: "uac",
    ranking: 6,
    places: 280,
    scholarships: 6,
    duration: "6 years",
    program: "Bachelor of Medical Studies / Doctor of Medicine",
    code: "3801",
    model: "ATAR + UCAT + Interview",
    competitiveness: "Extremely High",
    intakeSummary: "Large (~280)",
    campus: "Kensington (Sydney)",
    ruralLocations: "Port Macquarie, Wagga Wagga, Albury, Coffs Harbour",
    lat: -33.9173,
    lng: 151.2313,
    officialUrl: "https://www.unsw.edu.au/study/undergraduate/bachelor-of-medical-studies-doctor-of-medicine",
    metroAtar: "99.50",
    metroUcat: "2650",
    ruralAtar: "97.00",
    ruralUcat: "2300",
    intlAtar: "99.50",
    intlUcat: "2650",
    interviewFormat: "Panel",
    stations: "Panel",
    stationTime: "Varies",
    interviewAreas: ["Insight", "Communication", "Professional maturity", "Suitability"],
    overviewNote: "UNSW is one of the most competitive undergraduate medicine options in the country and often sits near the top of applicant target lists.",
    entryProcess: "Apply through UAC plus UNSW's own medicine process. UCAT and interview both matter strongly.",
    ruralInfo: "Regional NSW links help broaden exposure beyond central Sydney.",
    ruralEligibility: ["Rural thresholds are materially lower than metro in the mock structure", "Interview remains important", "UNSW and Sydney should never be assumed to follow the same process"],
    compareInsights: ["Very strong direct-entry prestige", "Panel format changes prep strategy compared with MMI-heavy schools", "Sydney location keeps demand intense"],
  },
  {
    id: "tasmania",
    name: "University of Tasmania",
    shortName: "Tasmania",
    university: "University of Tasmania",
    state: "TAS",
    tac: "uac",
    ranking: 9,
    places: 120,
    scholarships: 4,
    duration: "5 years",
    program: "Bachelor of Medical Science / Doctor of Medicine",
    code: "M3A",
    model: "Academic + mission-based",
    competitiveness: "High",
    intakeSummary: "Medium (~120)",
    campus: "Hobart",
    ruralLocations: "Launceston, Burnie, rural Tasmania",
    lat: -42.8821,
    lng: 147.3272,
    officialUrl: "https://www.utas.edu.au/courses/health/courses/h3x-bachelor-of-medical-science-and-doctor-of-medicine",
    metroAtar: "99.90",
    ruralAtar: "96.00",
    intlAtar: "99.90",
    interviewFormat: "No Interview",
    stations: "None",
    stationTime: "N/A",
    interviewAreas: [],
    overviewNote: "UTAS stands out because it is one of the better-known medicine programs without a standard interview in many applicant summaries.",
    entryProcess: "UAC-linked process with UTAS-specific criteria. UCAT assumptions differ depending on stream and cycle.",
    ruralInfo: "Tasmania's distributed training network makes rural and regional exposure especially relevant.",
    ruralEligibility: ["Mission-based alignment matters", "Regional Tasmanian placements are a feature", "No-interview profile changes prep priorities"],
    compareInsights: ["No-interview structure changes the game", "Strong regional Tasmania identity", "Medium intake with distinct mission profile"],
  },
  {
    id: "wollongong",
    name: "University of Wollongong",
    shortName: "Wollongong",
    university: "University of Wollongong",
    state: "NSW",
    tac: "uac",
    noUcat: true,
    ranking: 18,
    places: 80,
    scholarships: 3,
    duration: "4 years (graduate)",
    program: "Doctor of Medicine (Graduate Entry)",
    code: "MD-UOW",
    model: "Portfolio-heavy holistic",
    competitiveness: "Moderate",
    intakeSummary: "Small (~70–80)",
    campus: "Wollongong",
    ruralLocations: "Shoalhaven, Southern NSW",
    lat: -34.4050,
    lng: 150.8780,
    officialUrl: "https://www.uow.edu.au/study/doctor-of-medicine/",
    interviewFormat: "MMI",
    stations: "8",
    stationTime: "Varies",
    interviewAreas: ["Communication", "Values", "Reflection", "Portfolio alignment"],
    overviewNote: "UOW is a graduate-entry school known for a more holistic framing than many score-led comparisons suggest.",
    entryProcess: "Graduate-entry pathway. Portfolio and broader fit matter alongside academics.",
    ruralInfo: "Southern NSW and Shoalhaven links broaden the regional story.",
    ruralEligibility: ["Graduate-entry lens first", "Rural and regional service themes still matter", "Do not compare directly to school-leaver UCAT programs"],
    biomedPathway: true,
    compareInsights: ["Holistic feel changes who it suits", "Small cohort with graduate-entry intensity", "Southern NSW footprint is useful context"],
  },
  {
    id: "wsu",
    name: "Western Sydney University",
    shortName: "WSU",
    university: "Western Sydney University",
    state: "NSW",
    tac: "uac",
    ranking: 22,
    places: 140,
    scholarships: 4,
    duration: "5 years",
    program: "Bachelor of Medical Research / Doctor of Medicine",
    code: "3708",
    model: "UCAT + Interview + Equity weighting",
    competitiveness: "High",
    intakeSummary: "Medium (~120–140)",
    campus: "Campbelltown",
    ruralLocations: "Bathurst, Orange, Dubbo, Wagga Wagga (with CSU)",
    lat: -33.9892,
    lng: 150.8920,
    officialUrl: "https://www.westernsydney.edu.au/future/study/how-to-apply/md-applicants",
    metroAtar: "99.00",
    metroUcat: "2400",
    ruralAtar: "95.00",
    ruralUcat: "2100",
    intlAtar: "99.00",
    intlUcat: "2400",
    interviewFormat: "MMI",
    stations: "10",
    stationTime: "Varies",
    interviewAreas: ["Communication", "Reasoning", "Suitability", "Reflection", "Community orientation"],
    overviewNote: "WSU often becomes strategically attractive because of its broader equity and mission framing alongside strong Sydney demand.",
    entryProcess: "Apply via UAC with WSU-specific medicine steps. Interview and category positioning matter strongly.",
    ruralInfo: "Western and regional NSW partnerships give WSU a broader footprint than the city label implies.",
    ruralEligibility: ["Rural and equity pathways can materially affect competitiveness", "CSU-linked settings matter for some users", "Interview prep is central"],
    compareInsights: ["Mission and equity weighting can shift competitiveness", "Sydney demand remains strong", "Partnership footprint matters"],
  },
  {
    id: "csu-wsu",
    name: "Charles Sturt University / WSU Joint Program",
    shortName: "CSU/WSU",
    university: "Charles Sturt University (Joint MD with WSU)",
    state: "NSW",
    tac: "uac",
    ranking: 21,
    places: 40,
    scholarships: 2,
    duration: "5 years",
    program: "Bachelor of Clinical Science (Medicine) / Doctor of Medicine",
    code: "CSU-MD",
    model: "Rural bonded focus",
    competitiveness: "Moderate",
    intakeSummary: "Very Small (~40)",
    campus: "Bathurst, Orange, Wagga Wagga",
    ruralLocations: "Dubbo, Bathurst, Orange",
    lat: -33.4190,
    lng: 149.5770,
    officialUrl: "https://study.csu.edu.au/courses/medicine",
    metroAtar: "95.50",
    metroUcat: "2650",
    ruralAtar: "91.50",
    ruralUcat: "2500",
    interviewFormat: "MMI / Panel",
    stations: "Varies",
    stationTime: "Varies",
    interviewAreas: ["Rural commitment", "Communication", "Mission fit", "Suitability"],
    overviewNote: "This joint pathway is one of the clearest examples of a rural-focused program that should not be understood through metro-school assumptions.",
    entryProcess: "Apply via UAC with program-specific conditions and category rules.",
    ruralInfo: "Rural background and rural service focus are central, not peripheral.",
    ruralEligibility: ["Eligibility can be heavily category-driven", "Very small intake amplifies the effect of mission fit", "Regional location is part of the value proposition"],
    compareInsights: ["One of the most rural-focused pathways in the list", "Tiny intake changes the feel dramatically", "Direct comparison with inner-city schools can be misleading"],
  },
  {
    id: "unisq",
    name: "University of Southern Queensland",
    shortName: "UniSQ",
    university: "University of Southern Queensland",
    state: "QLD",
    tac: "qtac",
    ranking: 23,
    places: 30,
    scholarships: 2,
    duration: "3 years then UQ MD (7 years total)",
    program: "Bachelor of Biomedical Sciences (Medicine Pathway)",
    code: "SCM5",
    model: "Pathway feeder model",
    competitiveness: "High",
    intakeSummary: "Very Small (~30)",
    campus: "Toowoomba",
    ruralLocations: "Toowoomba, Darling Downs (UQ pathway)",
    lat: -27.5606,
    lng: 151.9507,
    officialUrl: "https://www.unisq.edu.au/study/degrees/bachelor-of-biomedical-sciences-medicine-pathway",
    metroAtar: "95.00",
    metroUcat: "2400",
    ruralAtar: "95.00",
    ruralUcat: "2100",
    intlAtar: "95.00",
    intlUcat: "2400",
    interviewFormat: "MMI",
    stations: "MMI",
    stationTime: "Varies",
    interviewAreas: ["Suitability", "Communication", "Pathway understanding", "Rural commitment"],
    overviewNote: "UniSQ's medicine pathway should be understood as a feeder structure, not the same thing as a standard standalone six-year undergraduate medicine school.",
    entryProcess: "Apply through QTAC and pathway-specific rules. Understand the feeder nature clearly before comparing it to direct-entry schools.",
    ruralInfo: "Toowoomba and Darling Downs context make the regional framing important.",
    ruralEligibility: ["Regional relevance is part of the appeal", "Very limited seats mean small differences matter", "Pathway structure changes the decision lens"],
    biomedPathway: true,
    compareInsights: ["Tiny intake but unusual pathway value", "Best compared with feeder/provisional models", "Regional identity is central"],
  },
  {
     id: "CQU",
  name: "CQUniversity Medicine Pathway",
  shortName: "CQU → UQ Medicine",
  university: "CQUniversity Australia",
  state: "QLD",
  tac: "qtac",
  ranking: 20,
  places: 40,
  scholarships: 0,
  duration: "7 years (3y CQU + 4y UQ MD)",
  program: "Bachelor of Medical Science (Pathway to Medicine) → UQ Doctor of Medicine",
  code: "CM17",
  model: "Regional medical pathway",
  competitiveness: "Moderate",
  intakeSummary: "Small (~40 per year)",
  campus: "Rockhampton (primary campus)",
  lat: -23.3781,
  lng: 150.5057,
  officialUrl: "https://www.cqu.edu.au/courses/700125/bachelor-of-medical-science-pathway-to-medicine",
  interviewFormat: "Not required for CQU entry",
  stations: "N/A",
  stationTime: "N/A",
  interviewAreas: [],
  overviewNote:
    "CQUniversity offers a regional medicine pathway where students complete a Bachelor of Medical Science at CQU before progressing into the University of Queensland Doctor of Medicine program.",
  entryProcess:
    "Students apply through QTAC into the Bachelor of Medical Science (Pathway to Medicine). Progression to the UQ MD requires meeting academic and progression requirements during the CQU degree.",
  ruralInfo:
    "This pathway is designed to increase the number of doctors trained in regional Queensland and prioritises regional healthcare exposure.",
  ruralEligibility: [
    "Primarily aimed at students willing to train in regional Queensland",
    "Clinical training occurs in Central Queensland and Wide Bay regions",
    "Some preference may be given to regional applicants",
  ],
  compareInsights: [
    "Not a standalone medical school — MD awarded by UQ",
    "Lower entry barrier compared to direct undergraduate medicine",
    "Designed to build regional workforce pipelines",
  ],
   },
  {
    id: "qut",
    name: "Queensland University of Technology",
    shortName: "QUT Medicine",
    university: "Queensland University of Technology",
    state: "QLD",
    tac: "qtac",
    ranking: 24,
    places: 48,
    scholarships: 0,
    duration: "5 years (planned)",
    program: "Undergraduate medical program (planned)",
    code: "TBC",
    model: "Pending accreditation",
    competitiveness: "TBC",
    intakeSummary: "Small (~48 per year expected)",
    campus: "Brisbane",
    lat: -27.4778,
    lng: 153.0281,
    officialUrl: "https://www.qut.edu.au/insights/health/qut-medical-programyour-questions-answered",
    metroAtar: "N/A",
    ruralAtar: "N/A",
    intlAtar: "N/A",
    interviewFormat: "TBC",
    stations: "TBC",
    stationTime: "TBC",
    interviewAreas: ["To be confirmed"],
    overviewNote:
      "QUT has announced a new undergraduate medical program planned to begin in 2028, subject to accreditation.",
    entryProcess:
      "Admissions details are not yet finalised publicly. Do not rely on unofficial cutoffs or rumours.",
    ruralInfo:
      "QUT has signalled a focus on community-based care, workforce shortages, and broader Queensland health needs.",
    ruralEligibility: [
      "Final eligibility details have not yet been published",
      "Check official QUT medicine updates regularly",
      "Do not treat provisional reports as final rules",
    ],
    compareInsights: [
      "Brand-new pathway means details may still change",
      "Likely to attract strong demand once applications open",
      "Best treated as a coming-soon entry for now",
    ],
    status: "planned",
    badge: "Coming Soon",
  },
];

const filterOptions = {
  tacs: ["all", "vtac", "satac", "qtac", "uac", "tisc", "direct"] as const,
  states: ["all", "VIC", "NSW", "QLD", "SA", "WA", "ACT", "NT", "TAS", "WA/NSW"] as const,
  ucat: ["all", "ucat", "no-ucat"] as const,
  sizes: ["all", "small", "medium", "large"] as const,
};

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function SoftCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-[26px] border border-slate-200 bg-white/85 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur", className)}>
      {children}
    </div>
  );
}

function sizeBucket(places: number): SizeKey {
  if (places < 100) return "small";
  if (places <= 200) return "medium";
  return "large";
}

function DetailTabs({ active, onChange }: { active: DetailTab; onChange: (tab: DetailTab) => void }) {
  const tabs: { key: DetailTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "entry", label: "Entry" },
    { key: "interview", label: "Interview" },
    { key: "rural", label: "Rural" },
  ];

  return (
    <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-1">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cx(
              "rounded-xl px-3 py-2 text-sm font-semibold transition",
              active === tab.key ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SchoolDetailPanel({ school, onClose }: { school: SchoolData; onClose: () => void }) {
  const [tab, setTab] = useState<DetailTab>("overview");

  return (
    <SoftCard className={cx("border-2 p-5", tacMeta[school.tac].border)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-3xl font-black tracking-tight text-slate-950">{school.name}</h2>
            <span className={cx("rounded-full px-3 py-1 text-xs font-bold shadow-sm", tacMeta[school.tac].pill)}>{tacMeta[school.tac].label}</span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">#{school.ranking} Ranking</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{school.state}</p>
        </div>
        <button onClick={onClose} className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4">
        <DetailTabs active={tab} onChange={setTab} />
      </div>

      <div className="mt-5 space-y-4">
        {tab === "overview" && (
          <>
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-950"><BookOpen className="h-4 w-4" /><span className="font-bold">{school.program}</span></div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" />{school.duration}</span>
                <span className="inline-flex items-center gap-1.5"><School className="h-4 w-4" />Code: {school.code}</span>
                <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" />{school.places} places</span>
                <span className="inline-flex items-center gap-1.5"><Award className="h-4 w-4" />{school.scholarships} scholarships</span>
              </div>
            </div>

            <div className="rounded-[20px] border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-950">
              <div className="flex items-start gap-2"><Info className="mt-0.5 h-4 w-4" /><p>{school.overviewNote}</p></div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                <p className="text-sm font-bold text-slate-950">Campuses</p>
                <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">{school.campus}</div>
                {school.colleges?.length ? (
                  <>
                    <p className="mt-4 text-sm font-bold text-slate-950">Nearby Colleges</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {school.colleges.map((college) => (
                        <span key={college} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{college}</span>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>

              <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                <p className="text-sm font-bold text-slate-950">Structural Overview</p>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p>Intake: {school.intakeSummary}</p>
                  <p>Model: {school.model}</p>
                  <p>Competitiveness: <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold">{school.competitiveness}</span></p>
                  {school.biomedPathway ? <p><span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700">Biomed Pathway</span></p> : null}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href={school.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                Learn More About {school.shortName}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}

        {tab === "entry" && (
          <>
            <div className="rounded-[20px] border border-blue-300 bg-blue-50 p-4 text-sm font-semibold text-blue-900">
              {school.noUcat ? "No UCAT required for the standard route shown here" : "UCAT ANZ required"}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {[
                { label: "Metropolitan", atar: school.metroAtar ?? "N/A", ucat: school.metroUcat ?? "N/A", tone: "bg-blue-50 border-blue-200 text-blue-900" },
                { label: "Rural", atar: school.ruralAtar ?? "N/A", ucat: school.ruralUcat ?? "N/A", tone: "bg-emerald-50 border-emerald-200 text-emerald-900" },
                { label: "International", atar: school.intlAtar ?? "N/A", ucat: school.intlUcat ?? "N/A", tone: "bg-violet-50 border-violet-200 text-violet-900" },
              ].map((item) => (
                <div key={item.label} className={cx("rounded-[20px] border p-4", item.tone)}>
                  <p className="font-semibold">{item.label}</p>
                  <p className="mt-3 text-sm">ATAR Required</p>
                  <p className="text-4xl font-black tracking-tight">{item.atar}</p>
                  <p className="mt-3 text-sm">UCAT Required</p>
                  <p className="text-2xl font-black tracking-tight">{item.ucat}</p>
                </div>
              ))}
            </div>
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-bold text-slate-950">Application Process</p>
              <p className="mt-2">{school.entryProcess}</p>
            </div>
          </>
        )}

        {tab === "interview" && (
          <>
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-950"><Stethoscope className="h-4 w-4" /><span className="font-bold">Interview Format</span></div>
              <div className="grid gap-3 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs font-medium text-slate-400">Format</p><p className="mt-1 font-semibold text-slate-950">{school.interviewFormat}</p></div>
                <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs font-medium text-slate-400">Stations</p><p className="mt-1 font-semibold text-slate-950">{school.stations ?? "TBC"}</p></div>
                <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs font-medium text-slate-400">Time</p><p className="mt-1 font-semibold text-slate-950">{school.stationTime ?? "TBC"}</p></div>
              </div>
            </div>
            <div className="rounded-[20px] border border-emerald-300 bg-emerald-50 p-4">
              <p className="font-bold text-emerald-950">Common Assessment Areas</p>
              <ul className="mt-3 space-y-2 text-sm text-emerald-950">
                {school.interviewAreas.length ? school.interviewAreas.map((area) => <li key={area}>{area}</li>) : <li>No standard interview areas listed for this route.</li>}
              </ul>
            </div>
          </>
        )}

        {tab === "rural" && (
          <>
            <div className="rounded-[20px] border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-950">
              <div className="flex items-start gap-2"><Trees className="mt-0.5 h-4 w-4" /><p>{school.ruralInfo}</p></div>
            </div>
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <p className="font-bold text-slate-950">General Rural Eligibility</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {school.ruralEligibility.map((item) => <li key={item}>{item}</li>)}
              </ul>
              {school.ruralLocations ? <p className="mt-4 text-sm text-emerald-700">Rural / regional locations: {school.ruralLocations}</p> : null}
            </div>
          </>
        )}
      </div>
    </SoftCard>
  );
}

function MiniCompareBar({ selected, onRemove, onCompare }: { selected: SchoolData[]; onRemove: (id: string) => void; onCompare: () => void }) {
  return (
    <div className="rounded-[22px] border border-emerald-300 bg-emerald-50 px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
          <GitCompareArrows className="h-4 w-4" />
          Select 2 universities to compare
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selected.map((school) => (
            <span key={school.id} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
              {school.shortName}
              <button onClick={() => onRemove(school.id)} className="rounded-full bg-white/20 px-1">×</button>
            </span>
          ))}
          <button
            onClick={onCompare}
            disabled={selected.length !== 2}
            className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Compare Now
          </button>
        </div>
      </div>
    </div>
  );
}

function CompareModal({ schools, onClose, onRemove }: { schools: SchoolData[]; onClose: () => void; onRemove: (id: string) => void }) {
  const [left, right] = schools;
  if (!left || !right) return null;

  const compareRows = [
    { section: "Rankings & Capacity", rows: [
      { label: "Ranking", left: left.ranking, right: right.ranking, lowerBetter: true },
      { label: "Total Places", left: left.places, right: right.places },
      { label: "Scholarships", left: left.scholarships, right: right.scholarships },
    ]},
    { section: "Metropolitan Entry", rows: [
      { label: "ATAR Required", left: left.metroAtar ?? "N/A", right: right.metroAtar ?? "N/A", lowerBetter: true },
      { label: "UCAT Required", left: left.metroUcat ?? "N/A", right: right.metroUcat ?? "N/A" },
    ]},
    { section: "Rural Entry", rows: [
      { label: "ATAR Required", left: left.ruralAtar ?? "N/A", right: right.ruralAtar ?? "N/A", lowerBetter: true },
      { label: "UCAT Required", left: left.ruralUcat ?? "N/A", right: right.ruralUcat ?? "N/A" },
    ]},
    { section: "Program Features", rows: [
      { label: "Duration", left: left.duration, right: right.duration },
      { label: "Interview Format", left: left.interviewFormat, right: right.interviewFormat },
      { label: "Competitiveness", left: left.competitiveness, right: right.competitiveness },
    ]},
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <SoftCard className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-black tracking-tight text-slate-950">University Comparison</h2>
            <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-4 px-5 py-5 text-center">
            {[left, right].map((school, index) => (
              <div key={school.id} className={index === 0 ? "order-1" : "order-3"}>
                <span className={cx("rounded-full px-3 py-1 text-xs font-bold shadow-sm", tacMeta[school.tac].pill)}>{tacMeta[school.tac].label}</span>
                <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{school.shortName}</h3>
                <p className="text-sm text-slate-500">{school.state}</p>
                <button onClick={() => onRemove(school.id)} className="mt-2 text-xs font-medium text-rose-500">Remove</button>
              </div>
            ))}
            <div className="order-2 flex items-center justify-center text-3xl font-black text-slate-300">VS</div>
          </div>

          <div className="space-y-6 px-5 pb-6">
            {compareRows.map((section) => (
              <div key={section.section} className="space-y-3 border-t border-slate-200 pt-5 first:border-t-0 first:pt-0">
                <h4 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">{section.section}</h4>
                {section.rows.map((row) => (
                  <div key={row.label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <CompareCell value={row.left} other={row.right} lowerBetter={row.lowerBetter} align="left" />
                    <div className="text-center text-sm font-medium text-slate-500">{row.label}</div>
                    <CompareCell value={row.right} other={row.left} lowerBetter={row.lowerBetter} align="right" />
                  </div>
                ))}
              </div>
            ))}

            <div className="grid gap-4 lg:grid-cols-2">
              {[left, right].map((school) => (
                <div key={school.id} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                  <p className="font-bold text-slate-950">Key Strategic Insights · {school.shortName}</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {school.compareInsights.map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </SoftCard>
      </div>
    </div>
  );
}

function CompareCell({ value, other, lowerBetter = false, align }: { value: any; other: any; lowerBetter?: boolean; align: "left" | "right" }) {
  const numeric = typeof value === "number" ? value : parseFloat(String(value));
  const otherNumeric = typeof other === "number" ? other : parseFloat(String(other));
  const comparable = !Number.isNaN(numeric) && !Number.isNaN(otherNumeric);
  const better = comparable ? (lowerBetter ? numeric < otherNumeric : numeric > otherNumeric) : false;
  const worse = comparable ? (lowerBetter ? numeric > otherNumeric : numeric < otherNumeric) : false;

  return (
    <div className={cx("rounded-xl px-4 py-3 text-sm font-semibold", better ? "bg-emerald-50 text-emerald-800" : worse ? "bg-rose-50 text-rose-800" : "bg-slate-50 text-slate-700", align === "left" ? "text-left" : "text-right")}>
      {String(value)} {better ? "↑" : worse ? "↓" : "—"}
    </div>
  );
}

export default function MedicalSchoolsPage() {
  const [showMap, setShowMap] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedTac, setSelectedTac] = useState<"all" | TacKey>("all");
  const [selectedState, setSelectedState] = useState<"all" | StateKey>("all");
  const [ucatFilter, setUcatFilter] = useState<"all" | "ucat" | "no-ucat">("all");
  const [sizeFilter, setSizeFilter] = useState<"all" | SizeKey>("all");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const detailRef = useRef<HTMLDivElement | null>(null);

  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const searchMatch = !search.trim() || `${school.name} ${school.shortName} ${school.university} ${school.state}`.toLowerCase().includes(search.toLowerCase());
      const tacMatch = selectedTac === "all" || school.tac === selectedTac;
      const stateMatch = selectedState === "all" || school.state === selectedState;
      const ucatMatch =
        ucatFilter === "all" ||
        (ucatFilter === "no-ucat" ? !!school.noUcat : !school.noUcat);
      const sizeMatch = sizeFilter === "all" || sizeBucket(school.places) === sizeFilter;
      return searchMatch && tacMatch && stateMatch && ucatMatch && sizeMatch;
    });
  }, [search, selectedTac, selectedState, ucatFilter, sizeFilter]);

  const selectedSchool = useMemo(() => schools.find((s) => s.id === selectedSchoolId) ?? null, [selectedSchoolId]);
  const compareSchools = useMemo(() => schools.filter((s) => compareIds.includes(s.id)), [compareIds]);

  useEffect(() => {
    if (selectedSchool && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedSchool]);

  const toggleCompare = (id: string) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((x) => x !== id);
      if (current.length >= 2) return current;
      return [...current, id];
    });
  };
return <> (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_24%),radial-gradient(circle_at_right,rgba(59,130,246,0.08),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f6f7fb_42%,#f8fafc_100%)] text-slate-900">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
          Universities
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <Sparkles className="h-3.5 w-3.5" />
          Compare all Australian medical programs
        </span>
      </div>

      <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-emerald-100 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-sky-100 blur-3xl" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Medical Schools
              </h1>
              <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                Interactive map, integrated filters, school detail views, and a compare tool for any two universities.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowMap((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <EyeOff className="h-4 w-4" />
                {showMap ? "Hide Map" : "Show Map"}
              </button>
              <button
                onClick={() => setCompareMode((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <GitCompareArrows className="h-4 w-4" />
                {compareMode ? "Exit Compare" : "Compare"}
              </button>
            </div>
          </div>

          {compareMode ? (
            <MiniCompareBar
              selected={compareSchools}
              onRemove={(id) => setCompareIds((c) => c.filter((x) => x !== id))}
              onCompare={() => setShowCompareModal(true)}
            />
          ) : null}

          {showMap ? (
            <SoftCard className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <MapPinned className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-black tracking-tight text-slate-950">
                  Interactive Map
                </h2>
              </div>
              <p className="mb-4 text-sm text-slate-500">
                Click markers to see university details
              </p>
              <DynamicMap
                schools={filteredSchools}
                tacMeta={tacMeta}
                onSelectSchool={(id: string) => setSelectedSchoolId(id)}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {(Object.keys(tacMeta) as TacKey[]).map((key) => (
                  <span
                    key={key}
                    className={cx(
                      "rounded-full px-3 py-1 text-xs font-bold shadow-sm",
                      tacMeta[key].pill
                    )}
                  >
                    {tacMeta[key].label}
                  </span>
                ))}
              </div>
            </SoftCard>
          ) : null}

          <SoftCard className="p-5">
            <div className="grid gap-3 lg:grid-cols-5">
              <div className="relative lg:col-span-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search universities..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <select
                value={selectedTac}
                onChange={(e) => setSelectedTac(e.target.value as any)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              >
                <option value="all">All TACs</option>
                {Object.entries(tacMeta).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value as any)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              >
                <option value="all">All States</option>
                {filterOptions.states
                  .filter((x) => x !== "all")
                  .map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
              </select>

              <select
                value={ucatFilter}
                onChange={(e) => setUcatFilter(e.target.value as any)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              >
                <option value="all">All</option>
                <option value="ucat">UCAT Required</option>
                <option value="no-ucat">No UCAT</option>
              </select>

              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value as any)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              >
                <option value="all">All Sizes</option>
                <option value="small">Small (&lt;100)</option>
                <option value="medium">Medium (100–200)</option>
                <option value="large">Large (200+)</option>
              </select>
            </div>
          </SoftCard>

          {selectedSchool ? (
            <div ref={detailRef}>
              <SchoolDetailPanel
                school={selectedSchool}
                onClose={() => setSelectedSchoolId(null)}
              />
            </div>
          ) : null}

          <div>
            <p className="mb-4 text-sm font-medium text-slate-500">
              Showing {filteredSchools.length} of {schools.length} universities
            </p>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredSchools.map((school) => (
                <SoftCard
                  key={school.id}
                  className={cx(
                    "border-2 p-5 transition hover:-translate-y-0.5",
                    tacMeta[school.tac].border
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-2xl font-black tracking-tight text-slate-950">
                          {school.shortName}
                        </h3>

                        <span
                          className={cx(
                            "rounded-full px-3 py-1 text-xs font-bold shadow-sm",
                            tacMeta[school.tac].pill
                          )}
                        >
                          {tacMeta[school.tac].label}
                        </span>

                        {school.noUcat ? (
                          <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                            No UCAT
                          </span>
                        ) : null}

                        {school.status === "planned" ? (
                          <span className="rounded-full border border-violet-300 bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                            {school.badge ?? "Coming Soon"}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-1 text-sm text-slate-500">{school.university}</p>
                    </div>

                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600">
                      #{school.ranking}
                    </span>
                  </div>

                  <div className="mt-4 rounded-[18px] bg-slate-50 p-4 text-sm text-slate-700">
                    <p className="font-medium text-slate-950">{school.program}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-4 w-4" />
                        {school.duration}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <School className="h-4 w-4" />
                        {school.code}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      {
                        label: "Metro",
                        value: school.metroAtar ?? "N/A",
                        tone: "bg-blue-50 text-blue-800",
                      },
                      {
                        label: "Rural",
                        value: school.ruralAtar ?? "N/A",
                        tone: "bg-emerald-50 text-emerald-800",
                      },
                      {
                        label: "Intl",
                        value: school.intlAtar ?? "N/A",
                        tone: "bg-violet-50 text-violet-800",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={cx("rounded-xl p-3 text-center", item.tone)}
                      >
                        <p className="text-xs font-medium">{item.label}</p>
                        <p className="mt-1 text-xl font-black">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-[18px] bg-slate-50 p-4 text-sm text-slate-700">
                    <p className="font-bold text-slate-950">Structural Overview</p>
                    <p className="mt-2">Intake: {school.intakeSummary}</p>
                    <p>Model: {school.model}</p>
                    <p className="mt-2">
                      <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold">
                        {school.competitiveness}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {school.places} places
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Award className="h-4 w-4" />
                      {school.scholarships} scholarships
                    </span>
                  </div>

                  <div className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-600">
                    <p className="inline-flex items-center gap-1.5">
                      <Stethoscope className="h-4 w-4" />
                      {school.interviewFormat}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {school.campus}
                    </p>
                    {school.ruralLocations ? (
                      <p className="mt-1 text-emerald-700">
                        Rural: {school.ruralLocations}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedSchoolId(school.id)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      {compareMode ? (
                        <button
                          onClick={() => toggleCompare(school.id)}
                          disabled={
                            !compareIds.includes(school.id) && compareIds.length >= 2
                          }
                          className={cx(
                            "rounded-xl px-3 py-2 text-xs font-bold transition",
                            compareIds.includes(school.id)
                              ? "bg-emerald-600 text-white"
                              : "border border-slate-200 bg-white text-slate-700",
                            !compareIds.includes(school.id) && compareIds.length >= 2
                              ? "cursor-not-allowed opacity-40"
                              : ""
                          )}
                        >
                          {compareIds.includes(school.id) ? "Selected" : "Compare"}
                        </button>
                      ) : null}

                      <Link
                        href={school.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm transition hover:bg-emerald-100"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </SoftCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {showCompareModal && compareSchools.length === 2 ? (
    <CompareModal
      schools={compareSchools}
      onClose={() => setShowCompareModal(false)}
      onRemove={(id) => {
        setCompareIds((current) => current.filter((x) => x !== id));
        setShowCompareModal(false);
      }}
    />
  ) : null}
</>
}