"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  ClipboardList,
  Compass,
  ExternalLink,
  FileText,
  GraduationCap,
  House,
  Info,
  Landmark,
  ListChecks,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Users,
  MapPinned,
  Clock3,
  AlertTriangle,
  Lock,
} from "lucide-react";

type HubTab = "navigator" | "rural" | "contingency" | "financial";
type PathwayKey = "undergrad" | "provisional" | "postgrad";
type RuralTab = "requirements" | "tracker";

type TrackerItem = {
  id: string;
  uni: string;
  title: string;
  portal: string;
  href: string;
  notes?: string;
  done: boolean;
};

type ExtraCost = {
  id: string;
  label: string;
  amount: number;
};

type LivingOption =
  | "Residential college ($350/wk)"
  | "Private sharehouse ($260/wk)"
  | "Studio / 1-bed ($420/wk)"
  | "At home ($120/wk)";

type CourseDuration =
  | "4 years (standard undergrad)"
  | "5 years"
  | "6 years"
  | "7 years (postgrad style path)";

const trackerStorageKey = "amg-strategy-rural-tracker";

const pathwayCards = [
  {
    key: "undergrad" as const,
    title: "Undergraduate Entry",
    summary: "Direct entry from Year 12 into a 5-6 year medical program.",
    duration: "5-6 years",
    tone: "blue",
  },
  {
    key: "provisional" as const,
    title: "Provisional Entry",
    summary:
      "Guaranteed or reserved medical school entry after completing a designated undergraduate degree.",
    duration: "3-4 years undergrad + 4 years medicine = 7-8 years",
    tone: "violet",
  },
  {
    key: "postgrad" as const,
    title: "Postgraduate Entry",
    summary:
      "Enter medicine after completing any bachelor's degree via GAMSAT-style graduate selection.",
    duration: "3+ years undergrad + 4 years medicine = 7+ years",
    tone: "green",
  },
];

const pathwayDetails: Record<
  PathwayKey,
  {
    title: string;
    advantages: string[];
    disadvantages: string[];
    idealFor: string;
  }
> = {
  undergrad: {
    title: "Undergraduate Entry - Detailed Breakdown",
    advantages: [
      "Fastest pathway to becoming a doctor",
      "Direct entry means earlier career start",
      "Younger cohort experience",
      "No need for additional degree first",
    ],
    disadvantages: [
      "Extremely competitive at Year 12",
      "Limited life experience before medicine",
      "High pressure on ATAR performance",
      "Fewer fallback pathways if unsuccessful",
    ],
    idealFor:
      "Students with exceptional Year 12 results who are certain about medicine early on.",
  },
  provisional: {
    title: "Provisional Entry - Detailed Breakdown",
    advantages: [
      "Reduces uncertainty if you secure the linked pathway",
      "Allows transition time before medicine",
      "Gives a broader first degree experience",
      "Can soften pure Year 12 pressure compared with direct med",
    ],
    disadvantages: [
      "Longer overall pathway",
      "Must maintain required academic standard",
      "Places and pathway rules vary heavily by university",
      "Less flexible than a fully open undergrad if you change direction",
    ],
    idealFor:
      "Students who want medicine certainty but still want an undergraduate phase first.",
  },
  postgrad: {
    title: "Postgraduate Entry - Detailed Breakdown",
    advantages: [
      "Most flexible first-degree choice",
      "More mature entry route",
      "More fallback careers if medicine does not happen immediately",
      "Can build strong portfolio, research, and life experience",
    ],
    disadvantages: [
      "Longest common route",
      "High GPA pressure across university",
      "GAMSAT adds another major hurdle",
      "Can become expensive over time",
    ],
    idealFor:
      "Students who value flexibility, maturity, and multiple career contingencies.",
  },
};

const ruralUniversities = [
  {
    uni: "Adelaide",
    portal: "SATAC",
    title: "Rural Background Entry Pathway",
    requirement:
      "Rural background pathway information and proving rural origin guidance.",
    process:
      "Use the official rural background entry pathway page and follow application instructions through the admissions process.",
    evidence: ["Statutory declaration", "Residential evidence", "School history"],
    href: "https://health.adelaide.edu.au/adelaide-rural-clinical-school/study-experience",
    formTag: "SATAC",
  },
  {
    uni: "ANU",
    portal: "GEMSAS / ANU",
    title: "Rural Background Criteria",
    requirement:
      "Rural background is generally based on MM2-MM7 for 5 consecutive or 10 cumulative years.",
    process:
      "Declare rurality in the ANU application process and provide supporting evidence.",
    evidence: ["Rural criteria form/guide", "Residential proof", "Supporting evidence"],
    href: "https://science.anu.edu.au/study/how-apply/doctor-medicine-and-surgery-guidelines",
    formTag: "GEMSAS",
  },
  {
    uni: "Curtin",
    portal: "TISC",
    title: "Rural Entry Pathway",
    requirement:
      "Additional application form required for rural background entry.",
    process:
      "Submit the Curtin rural entry form directly as instructed alongside TISC application.",
    evidence: ["Rural entry form", "Address history", "School records"],
    href: "https://www.curtin.edu.au/study/offering/course-ug-bachelor-of-medicine-bachelor-of-surgery--b-mbbs/",
    formTag: "TISC",
  },
  {
    uni: "Deakin",
    portal: "GEMSAS",
    title: "Rural Training Stream",
    requirement:
      "Rural Training Stream applies through GEMSAS with written application and priority rules.",
    process:
      "Apply through GEMSAS and follow Deakin's Rural Training Stream instructions.",
    evidence: ["Residential history", "Supporting documents"],
    href: "https://www.deakin.edu.au/faculty-of-health/school-of-medicine/study-with-us/rural-training-stream",
    formTag: "GEMSAS",
  },
  {
    uni: "Flinders",
    portal: "GEMSAS / SATAC",
    title: "South Australia Rural Medical (SARM) Program",
    requirement:
      "Rural entry page outlines eligibility and required supporting documents.",
    process:
      "Apply through the relevant admissions process and submit rural evidence as instructed.",
    evidence: ["Statutory declaration", "Address proof", "School records"],
    href: "https://www.flinders.edu.au/study/courses/postgraduate-doctor-medicine/rural-entry",
    formTag: "GEMSAS",
  },
  {
    uni: "Griffith",
    portal: "QTAC / GEMSAS",
    title: "Rural Priority Access Scheme",
    requirement:
      "Priority places are reserved for eligible rural applicants.",
    process:
      "Use Griffith's rural priority access scheme page and linked admissions instructions.",
    evidence: ["Residential evidence", "Declaration / supporting evidence"],
    href: "https://www.griffith.edu.au/apply/admission-pathways/rural-priority-access-scheme",
    formTag: "QTAC",
  },
  {
    uni: "JCU",
    portal: "QTAC / JCU",
    title: "Medicine Admissions / Rural Focus",
    requirement:
      "JCU medicine has strong rural and regional focus; check official admissions material for current rural pathway details.",
    process:
      "Use JCU's medicine admissions information and current scholarship/admissions pages.",
    evidence: ["Rural background documentation"],
    href: "https://www.jcu.edu.au/courses-and-study/courses/bachelor-of-medicine-bachelor-of-surgery",
    formTag: "QTAC",
  },
  {
    uni: "Macquarie",
    portal: "GEMSAS",
    title: "Macquarie MD Admissions",
    requirement:
      "Use Macquarie MD admissions guide and current admissions pages; pathway details sit within official MD admissions information.",
    process:
      "Apply through GEMSAS and review the official MQ admissions guide.",
    evidence: ["Rural documentation if applicable", "Admissions guide requirements"],
    href: "https://www.mq.edu.au/faculty-of-medicine-health-and-human-sciences/macquarie-md/admission-key-dates-policies-and-compliance",
    formTag: "GEMSAS",
  },
  {
    uni: "Monash",
    portal: "VTAC / Monash",
    title: "Dean's Rural List (DRL)",
    requirement:
      "Special consideration pathway increasing interview chances for rural applicants.",
    process:
      "Follow Monash DRL process and supporting document guide when invited or required.",
    evidence: ["DRL evidence", "Supporting document guide", "Address history"],
    href: "https://www.monash.edu/medicine/som/direct-entry/domestic/drl",
    formTag: "VTAC",
  },
  {
    uni: "Melbourne",
    portal: "VTAC / GEMSAS",
    title: "Rural Medicine / Rural Pathway",
    requirement:
      "University of Melbourne offers rural-focused information and pathway guidance.",
    process:
      "Use the official rural medicine page and current admissions guide for submission details.",
    evidence: ["Rural evidence", "Supporting documentation"],
    href: "https://mdhs.unimelb.edu.au/study/meet-us/student-life/rural-medicine",
    formTag: "VTAC/GEMSAS",
  },
  {
    uni: "Newcastle/UNE",
    portal: "UAC / GEMSAS",
    title: "Rural and Remote Admissions Scheme (RRAS)",
    requirement:
      "RRAS aims to increase admission of students from rural and remote locations.",
    process:
      "Follow RRAS and rural/remote status assessment instructions through official Newcastle pages.",
    evidence: ["Rural documentation", "Residential proof", "Community evidence if required"],
    href: "https://www.newcastle.edu.au/joint-medical-program/how-to-apply/entry-support-schemes/accordion-entry-support-schemes/rural-and-remote-admissions-scheme",
    formTag: "UAC",
  },
  {
    uni: "UNSW",
    portal: "UAC / MAP",
    title: "Rural Entry Admission Pathway (REAP)",
    requirement:
      "UNSW REAP is the official rural entry pathway for eligible applicants.",
    process:
      "Use UNSW special entry schemes page and REAP information for eligibility and application steps.",
    evidence: ["Statutory declaration / rural evidence", "Address and schooling history"],
    href: "https://www.unsw.edu.au/medicine-health/study-with-us/undergraduate/applying-to-medicine/special-entry-schemes",
    formTag: "UAC/MAP",
  },
  {
    uni: "UQ",
    portal: "QTAC / GEMSAS",
    title: "Rural Background / Admissions Info",
    requirement:
      "Use UQ medicine admissions and current official application instructions; rural background evidence may be required depending on scheme.",
    process:
      "Follow UQ medicine admissions and official guides.",
    evidence: ["Rural cover / supporting evidence"],
    href: "https://study.uq.edu.au/study-options/programs/doctor-medicine-5501",
    formTag: "QTAC/GEMSAS",
  },
  {
    uni: "Sydney",
    portal: "UAC / GEMSAS",
    title: "Doctor of Medicine Rural / Dubbo Stream",
    requirement:
      "Sydney's Doctor of Medicine includes Dubbo Stream and facilitated pathways for rural applicants.",
    process:
      "Use Sydney's Dubbo Stream page and current domestic admissions guide for rural pathway details.",
    evidence: ["Rural evidence", "Documentation"],
    href: "https://www.sydney.edu.au/medicine-health/study-medicine-and-health/postgraduate-courses/doctor-of-medicine/dubbo-stream.html",
    formTag: "UAC/GEMSAS",
  },
  {
    uni: "Tasmania",
    portal: "GEMSAS / UTAS",
    title: "Tasmanian Medicine Admissions",
    requirement:
      "Use current UTAS medicine admissions information; quotas and pathway rules vary by intake.",
    process:
      "Follow official UTAS course page and current admissions instructions.",
    evidence: ["Residential proof if applicable"],
    href: "https://www.utas.edu.au/courses/health/courses/h3x-bachelor-of-medical-science-and-doctor-of-medicine",
    formTag: "GEMSAS",
  },
  {
    uni: "WSU",
    portal: "UAC",
    title: "Rural Entry Admission Scheme (REAS)",
    requirement:
      "Western Sydney offers a minimum number of rural places through REAS.",
    process:
      "Apply via the official REAS process and upload required confirmation forms where required.",
    evidence: ["Rural evidence", "Address history", "Community confirmation"],
    href: "https://www.westernsydney.edu.au/future/study/application-pathways/rural-entry-admission-scheme",
    formTag: "UAC",
  },
  {
    uni: "UWA",
    portal: "TISC",
    title: "Rural Eligibility Form",
    requirement:
      "UWA requires its rural eligibility form to be submitted by the medicine closing date.",
    process:
      "Submit UWA rural eligibility form through TISC as instructed.",
    evidence: ["Rural eligibility form", "Address proof", "School records"],
    href: "https://www.uwa.edu.au/study/courses/doctor-of-medicine",
    formTag: "TISC",
  },
  {
    uni: "Wollongong",
    portal: "GEMSAS",
    title: "UOW Medicine / Rural Preference Info",
    requirement:
      "Use UOW's medicine admissions page and current GEMSAS guide for rural submissions and pathways.",
    process:
      "Apply through GEMSAS and follow current UOW documentation requirements.",
    evidence: ["Rural documents", "Supporting evidence"],
    href: "https://www.uow.edu.au/hsmd/medicine/study/doctor-of-medicine/",
    formTag: "GEMSAS",
  },
  {
    uni: "Notre Dame",
    portal: "GEMSAS",
    title: "Medicine Admissions / Rural Policy",
    requirement:
      "Use Notre Dame medicine admissions information and current GEMSAS instructions for rural evidence requirements.",
    process:
      "Apply through GEMSAS and check the official admissions page.",
    evidence: ["Rural background evidence"],
    href: "https://www.notredame.edu.au/programs/sydney/school-of-medicine/postgraduate/doctor-of-medicine",
    formTag: "GEMSAS",
  },
];

const stateForms = [
  {
    state: "Victoria",
    title: "Victoria statutory declarations",
    subtitle: "Official stat dec information and forms",
    href: "https://www.justice.vic.gov.au/statdecs",
  },
  {
    state: "NSW",
    title: "NSW statutory declaration forms",
    subtitle: "Official NSW forms and witness guidance",
    href: "https://dcj.nsw.gov.au/legal-and-justice/legal-assistance-and-representation/justice-of-the-peace/finding-a-jp/nsw-statutory-declaration-forms.html",
  },
  {
    state: "Queensland",
    title: "Queensland statutory declaration form",
    subtitle: "Official form and updated Oaths Act guidance",
    href: "https://www.qld.gov.au/law/legal-mediation-and-justice-of-the-peace/making-important-legal-documents/statutory-declarations/download-form",
  },
  {
    state: "Western Australia",
    title: "Authorised witnesses for stat decs",
    subtitle: "Witness categories and WA guidance",
    href: "https://www.wa.gov.au/government/publications/authorised-witnesses-statutory-declarations",
  },
  {
    state: "Western Australia",
    title: "UWA rural eligibility form (PDF)",
    subtitle: "University-specific rural eligibility form",
    href: "https://www.uwa.edu.au/seek-wisdom/-/media/project/uwa/uwa/seek-wisdom/hms/uwa_admissions-rural-eligibility-form_v01.pdf",
  },
  {
    state: "Victoria",
    title: "Monash DRL supporting document guide (PDF)",
    subtitle: "Dean's Rural List evidence guide",
    href: "https://www.monash.edu/__data/assets/pdf_file/0009/3987702/DRL-Supporting-Document-Guide.pdf",
  },
  {
    state: "NSW",
    title: "WSU community member confirmation form (PDF)",
    subtitle: "REAS supporting confirmation form",
    href: "https://www.westernsydney.edu.au/content/dam/digital/pdf/M1053MedicineREASCommunityMemberForm.pdf",
  },
  {
    state: "Australia",
    title: "Health Workforce Locator",
    subtitle: "Check your current MM classification",
    href: "https://www.health.gov.au/resources/apps-and-tools/health-workforce-locator",
  },
];

const statDecUniHighlights = [
  { uni: "JCU", note: "SD + postcode evidence" },
  { uni: "UQ", note: "SD or official letter + MMM verification" },
  { uni: "Monash", note: "DRL evidence guide / supporting docs" },
  { uni: "UNSW", note: "SD + address history for REAP-style evidence" },
  { uni: "Adelaide", note: "SD often used with rural history evidence" },
  { uni: "Tasmania", note: "SD + evidence where requested" },
  { uni: "UNE/Newcastle", note: "SD + supporting rural documentation" },
  { uni: "ANU", note: "SD or postcode/rural evidence depending on process" },
];

const checklistItems = [
  {
    title: "1. Residential History Table",
    text: "Prepare from date, to date, address, postcode, MM classification, and matching evidence type for every rural address.",
  },
  {
    title: "2. School History Table",
    text: "Prepare school name, years attended, town/suburb, postcode, and whether each school supports your rural timeline.",
  },
  {
    title: "3. Supporting Evidence Folder",
    text: "Collect school letters, utility bills, lease or council documents, bank statements, and any family address evidence.",
  },
  {
    title: "4. University Submission Checklist",
    text: "Track which universities need a separate form, which accept GEMSAS declaration only, and which have extra PDFs or portals.",
  },
];

const contingencyTabs = [
  {
    key: "interview",
    label: "If You Don't Get an Interview",
    reasons: [
      "ATAR below threshold",
      "UCAT not competitive",
      "Portfolio not strong enough",
      "Application issues",
    ],
    next: [
      { title: "Analyse Metrics", text: "Review where you fell short - was it ATAR, UCAT, or both?" },
      { title: "Consider Gap Year", text: "Use the year to strengthen weak areas and reapply." },
      { title: "Biomed Pathway", text: "Enrol in biomed to access postgrad medicine later." },
      { title: "Interstate Options", text: "Check if other states have lower thresholds or different pathways." },
    ],
  },
  {
    key: "offer",
    label: "If You Don't Get an Offer",
    reasons: [
      "Interview performance",
      "Preference order issues",
      "High competition in your category",
      "Late round changes",
    ],
    next: [
      { title: "Request Feedback", text: "Some universities provide interview feedback." },
      { title: "Gap Year + Reapply", text: "Work on interview skills and reapply next year." },
      { title: "Accept Biomed Offer", text: "Take biomed place and aim for postgrad entry." },
      { title: "Alternative Health Degrees", text: "Nursing, paramedicine, allied health as pathways." },
    ],
  },
  {
    key: "postgrad",
    label: "Postgrad Pathway Builder",
    reasons: [
      "Didn't get undergrad place",
      "Prefer graduate entry",
      "Want broader undergrad experience",
      "More mature entry route",
    ],
    next: [
      { title: "Choose Strategic Undergrad", text: "Biomed, health sciences, or science degrees." },
      { title: "Maintain High GPA", text: "Aim for 6.5+ to stay competitive." },
      { title: "Prepare for GAMSAT", text: "Start prep early, especially if non-science background." },
      { title: "Build Experience", text: "Healthcare volunteering, research, leadership." },
    ],
  },
] as const;

const postgradDegrees = [
  {
    title: "Biomedical Science",
    gpa: "Target GPA: 6.5-7.0",
    pros: ["Direct medicine pathway", "Relevant content", "Medicine prereqs"],
    cons: ["Competitive GPA needed", "Limited career options"],
  },
  {
    title: "Health Sciences",
    gpa: "Target GPA: 6.0-6.5",
    pros: ["Broad health exposure", "Multiple career paths", "Good backup"],
    cons: ["Less competitive than biomed", "May need science prereqs"],
  },
  {
    title: "Science (General)",
    gpa: "Target GPA: 6.5+",
    pros: ["Flexible majors", "Research opportunities", "Strong GPA possible"],
    cons: ["Less direct pathway", "Need GAMSAT prep"],
  },
  {
    title: "Non-Science Degree",
    gpa: "Target GPA: 6.5-7.0",
    pros: ["Follow your interests", "Unique perspective", "Demonstrates breadth"],
    cons: ["GAMSAT more challenging", "Need science catch-up"],
  },
];

const gapYearActivities = [
  { title: "UCAT Intensive Prep", text: "Dedicate focused time to improve score", priority: "High" },
  { title: "Interview Coaching", text: "Professional coaching for MMI/Panel", priority: "High" },
  { title: "Healthcare Work", text: "Hospital, aged care, disability support", priority: "Medium" },
  { title: "Volunteering", text: "Ambulance, St John, community health", priority: "Medium" },
  { title: "Research Assistant", text: "University or hospital research projects", priority: "Medium" },
  { title: "Course Completion", text: "Certificate IV or prerequisites", priority: "Low" },
];

const livingDefaults: Record<
  LivingOption,
  { accommodation: number; food: number; transport: number; books: number; personal: number }
> = {
  "Residential college ($350/wk)": {
    accommodation: 18200,
    food: 1800,
    transport: 1800,
    books: 800,
    personal: 2800,
  },
  "Private sharehouse ($260/wk)": {
    accommodation: 13520,
    food: 4200,
    transport: 2200,
    books: 800,
    personal: 3200,
  },
  "Studio / 1-bed ($420/wk)": {
    accommodation: 21840,
    food: 4200,
    transport: 2200,
    books: 800,
    personal: 3600,
  },
  "At home ($120/wk)": {
    accommodation: 6240,
    food: 2600,
    transport: 2400,
    books: 800,
    personal: 2200,
  },
};

const durationYears: Record<CourseDuration, number> = {
  "4 years (standard undergrad)": 4,
  "5 years": 5,
  "6 years": 6,
  "7 years (postgrad style path)": 7,
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function formatMoney(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

export default function StrategyHubClient({
  isPremium,
}: {
  isPremium: boolean;
}) {
  const [activeHubTab, setActiveHubTab] = useState<HubTab>("navigator");
  const [selectedPathway, setSelectedPathway] =
    useState<PathwayKey>("undergrad");
  const [ruralTab, setRuralTab] = useState<RuralTab>("requirements");
  const [search, setSearch] = useState("");
  const [tracker, setTracker] = useState<TrackerItem[]>([]);
  const [contingencyTab, setContingencyTab] = useState<
    "interview" | "offer" | "postgrad"
  >("interview");
  const [statDecGuideOpen, setStatDecGuideOpen] = useState(true);

  const [courseDuration, setCourseDuration] = useState<CourseDuration>(
    "4 years (standard undergrad)"
  );
  const [livingType, setLivingType] = useState<LivingOption>(
    "Residential college ($350/wk)"
  );
  const [food, setFood] = useState(
    livingDefaults["Residential college ($350/wk)"].food
  );
  const [transport, setTransport] = useState(
    livingDefaults["Residential college ($350/wk)"].transport
  );
  const [books, setBooks] = useState(
    livingDefaults["Residential college ($350/wk)"].books
  );
  const [personal, setPersonal] = useState(
    livingDefaults["Residential college ($350/wk)"].personal
  );
  const [accommodation, setAccommodation] = useState(
    livingDefaults["Residential college ($350/wk)"].accommodation
  );
  const [hecsDebt, setHecsDebt] = useState(72000);
  const [bondYears, setBondYears] = useState(6);
  const [extraLiving, setExtraLiving] = useState<ExtraCost[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(trackerStorageKey);
    if (raw) {
      setTracker(JSON.parse(raw));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(trackerStorageKey, JSON.stringify(tracker));
  }, [tracker]);

  useEffect(() => {
    const preset = livingDefaults[livingType];
    setAccommodation(preset.accommodation);
    setFood(preset.food);
    setTransport(preset.transport);
    setBooks(preset.books);
    setPersonal(preset.personal);
  }, [livingType]);

  const filteredRural = useMemo(() => {
    return ruralUniversities.filter((item) => {
      const q = search.toLowerCase();
      return (
        item.uni.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.portal.toLowerCase().includes(q)
      );
    });
  }, [search]);

  const selectedContingency =
    contingencyTabs.find((tab) => tab.key === contingencyTab)!;

  const years = durationYears[courseDuration];

  const totalInvestment = useMemo(() => {
    return (
      accommodation * years +
      (food +
        transport +
        books +
        personal +
        extraLiving.reduce((sum, item) => sum + item.amount, 0)) *
        years +
      hecsDebt
    );
  }, [accommodation, food, transport, books, personal, extraLiving, hecsDebt, years]);

  function addToTracker(item: (typeof ruralUniversities)[number]) {
    setTracker((prev) => {
      if (prev.some((x) => x.uni === item.uni)) return prev;
      return [
        ...prev,
        {
          id: makeId(),
          uni: item.uni,
          title: item.title,
          portal: item.portal,
          href: item.href,
          done: false,
        },
      ];
    });
  }

  function toggleTracker(id: string) {
    setTracker((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  }

  function removeTracker(id: string) {
    setTracker((prev) => prev.filter((item) => item.id !== id));
  }

  function addExtraLiving() {
    setExtraLiving((prev) => [...prev, { id: makeId(), label: "", amount: 0 }]);
  }

  function updateExtraLiving(
    id: string,
    field: "label" | "amount",
    value: string | number
  ) {
    setExtraLiving((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, [field]: field === "amount" ? Number(value) || 0 : value }
          : item
      )
    );
  }

  function removeExtraLiving(id: string) {
    setExtraLiving((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <FeatureGate
      locked={!isPremium}
      title="Upgrade to unlock Strategy Hub"
      description="Access the full strategy hub for pathway planning, rural and equity tools, contingency planning, and financial strategy."
      ctaHref="/upgrade"
      ctaLabel="Upgrade to Pro"
      previewLabel="Strategy Hub"
    >
      <main className="min-h-screen bg-[#eef3f8] text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
              <span className="text-violet-500">Strategy</span>
              <span>•</span>
              <span>Premium hub prototype</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
              <Sparkles className="h-4 w-4" />
              Structured long-term planning
            </div>
          </div>

          <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/75 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-violet-400 via-sky-500 to-emerald-400" />

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-200/60">
                    <Compass className="h-7 w-7" />
                  </div>

                  <div>
                    <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
                      Strategy Hub
                    </h1>
                    <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                      Make the right long-term decisions before investing time
                      and effort into preparation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-sm rounded-3xl border border-violet-200 bg-linear-to-br from-violet-50 via-white to-cyan-50 p-5 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-700">
                  <ShieldCheck className="h-4 w-4" />
                  Premium direction
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  This hub is designed to sit behind premium access while still
                  giving users a strong preview of the planning architecture.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-100/80 p-1.5">
              <div className="grid grid-cols-1 gap-1 md:grid-cols-4">
                <HubButton
                  active={activeHubTab === "navigator"}
                  label="Admission Navigator"
                  icon={Target}
                  onClick={() => setActiveHubTab("navigator")}
                />
                <HubButton
                  active={activeHubTab === "rural"}
                  label="Rural & Equity"
                  icon={Users}
                  onClick={() => setActiveHubTab("rural")}
                />
                <HubButton
                  active={activeHubTab === "contingency"}
                  label="Contingency Planning"
                  icon={CircleAlert}
                  onClick={() => setActiveHubTab("contingency")}
                />
                <HubButton
                  active={activeHubTab === "financial"}
                  label="Financial Strategy"
                  icon={BadgeDollarSign}
                  onClick={() => setActiveHubTab("financial")}
                />
              </div>
            </div>
          </section>

          <div className="mt-6 space-y-6">
            {activeHubTab === "navigator" && (
              <>
                <section className="rounded-3xl border border-violet-200 bg-violet-50/60 p-5 shadow-sm">
                  <h2 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
                    Why Strategy Matters
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    STRATEGY helps you make the right long-term decisions before
                    you start investing time and effort into preparation. It
                    provides the structural understanding of pathways, timelines,
                    eligibility, application systems, and financial realities so
                    that you are aligned with a clear direction.
                  </p>
                </section>

                <div className="grid gap-4 lg:grid-cols-3">
                  {pathwayCards.map((card) => (
                    <div
                      key={card.key}
                      className={cn(
                        "rounded-3xl border bg-white/80 p-5 shadow-sm",
                        card.tone === "blue" && "border-blue-200 bg-blue-50/40",
                        card.tone === "violet" && "border-violet-200 bg-violet-50/40",
                        card.tone === "green" && "border-emerald-200 bg-emerald-50/40"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-2xl text-white",
                          card.tone === "blue" &&
                            "bg-linear-to-br from-blue-500 to-indigo-500",
                          card.tone === "violet" &&
                            "bg-linear-to-br from-violet-500 to-fuchsia-500",
                          card.tone === "green" &&
                            "bg-linear-to-br from-emerald-500 to-teal-500"
                        )}
                      >
                        {card.key === "undergrad" ? (
                          <ArrowRight className="h-5 w-5" />
                        ) : card.key === "provisional" ? (
                          <ShieldCheck className="h-5 w-5" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5" />
                        )}
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-slate-950">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {card.summary}
                      </p>
                      <p className="mt-4 text-sm text-slate-500">
                        {card.duration}
                      </p>

                      <button
                        onClick={() => setSelectedPathway(card.key)}
                        className={cn(
                          "mt-5 inline-flex w-full items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                          selectedPathway === card.key
                            ? "border-blue-500 bg-blue-600 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        {selectedPathway === card.key
                          ? "Selected"
                          : "Select This Pathway"}
                      </button>
                    </div>
                  ))}
                </div>

                <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-950">
                    Detailed Comparison
                  </h3>

                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-2xl">
                      <thead>
                        <tr className="bg-slate-50 text-left text-sm">
                          <th className="px-4 py-3 font-semibold text-slate-700">
                            Factor
                          </th>
                          <th className="px-4 py-3 font-semibold text-blue-700">
                            Undergraduate
                          </th>
                          <th className="px-4 py-3 font-semibold text-violet-700">
                            Provisional
                          </th>
                          <th className="px-4 py-3 font-semibold text-emerald-700">
                            Postgraduate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-slate-700">
                        {[
                          ["Time to MD", "5-6 years", "7-8 years", "7-10+ years"],
                          ["ATAR Dependence", "Very High", "High", "Low"],
                          ["UCAT Dependence", "High", "High", "N/A"],
                          ["GPA Dependence", "N/A", "Moderate", "Very High"],
                          ["Flexibility if fail", "Low", "Moderate", "High"],
                          ["Total Duration", "5-6 years", "7-8 years", "7-10+ years"],
                          ["Risk Profile", "High", "Medium", "Low"],
                        ].map((row) => (
                          <tr key={row[0]} className="bg-white">
                            <td className="border-t border-slate-200 px-4 py-3">
                              {row[0]}
                            </td>
                            {row.slice(1).map((cell, index) => (
                              <td
                                key={`${row[0]}-${index}-${cell}`}
                                className="border-t border-slate-200 px-4 py-3"
                              >
                                <span
                                  className={cn(
                                    "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                                    cell === "Very High" &&
                                      "bg-rose-100 text-rose-700",
                                    cell === "High" &&
                                      "bg-orange-100 text-orange-700",
                                    cell === "Moderate" &&
                                      "bg-amber-100 text-amber-700",
                                    cell === "Low" &&
                                      "bg-emerald-100 text-emerald-700",
                                    cell === "N/A" &&
                                      "bg-slate-200 text-slate-600",
                                    !["Very High", "High", "Moderate", "Low", "N/A"].includes(
                                      cell
                                    ) && "bg-transparent px-0 py-0 text-slate-700"
                                  )}
                                >
                                  {cell}
                                </span>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="rounded-3xl border border-blue-200 bg-blue-50/60 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-blue-600" />
                    <h3 className="text-xl font-bold text-slate-950">
                      {pathwayDetails[selectedPathway].title}
                    </h3>
                  </div>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Advantages
                      </h4>
                      <div className="mt-3 space-y-2">
                        {pathwayDetails[selectedPathway].advantages.map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-2 text-sm text-blue-800"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Disadvantages
                      </h4>
                      <div className="mt-3 space-y-2">
                        {pathwayDetails[selectedPathway].disadvantages.map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-2 text-sm text-rose-700"
                          >
                            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-blue-200 bg-white/60 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Ideal For:
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {pathwayDetails[selectedPathway].idealFor}
                    </p>
                  </div>
                </section>

                <section className="rounded-3xl border border-blue-200 bg-blue-50/60 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-blue-600" />
                    <h3 className="text-xl font-bold text-slate-950">
                      Make Your Decision
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    Your pathway decision influences everything downstream: your
                    timeline, what you prioritise academically, your fallback
                    options, and your stress levels. Select the pathway that
                    best matches your current situation and risk tolerance.
                  </p>
                </section>
              </>
            )}

            {activeHubTab === "rural" && (
              <>
                <section className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-700" />
                    <h2 className="text-xl font-bold text-slate-950">
                      Rural Eligibility Requirements
                    </h2>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-emerald-900">
                    Most medicine schemes classify rural background using MM2-MM7
                    history rather than just where you live now. Students usually
                    need a defensible residential timeline, matching postcode
                    evidence, and at least one well-prepared statutory declaration
                    or equivalent supporting document set.
                  </p>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                  <div className="rounded-2xl border border-slate-200 bg-slate-100/80 p-1.5">
                    <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                      <HubButton
                        active={ruralTab === "requirements"}
                        label="Form Requirements"
                        icon={FileText}
                        onClick={() => setRuralTab("requirements")}
                      />
                      <HubButton
                        active={ruralTab === "tracker"}
                        label="My Tracker"
                        icon={ClipboardList}
                        onClick={() => setRuralTab("tracker")}
                      />
                    </div>
                  </div>

                  {ruralTab === "requirements" && (
                    <div className="mt-5 space-y-6">
                      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <button
                          onClick={() => setStatDecGuideOpen((prev) => !prev)}
                          className="flex w-full items-start justify-between gap-4 text-left"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-emerald-600" />
                              <h3 className="text-xl font-bold text-slate-950">
                                Statutory Declaration Guide
                              </h3>
                            </div>
                            <p className="mt-1 text-sm text-slate-500">
                              How to complete stat decs for rural applications
                            </p>
                          </div>

                          <div className="mt-1 rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500">
                            {statDecGuideOpen ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </button>

                        {statDecGuideOpen && (
                          <div className="mt-5 space-y-5">
                            <div>
                              <div className="mb-3 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <p className="text-sm font-bold text-slate-900">
                                  1. Know Which Unis Require It
                                </p>
                              </div>

                              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                {statDecUniHighlights.map((item) => (
                                  <div
                                    key={item.uni}
                                    className="rounded-2xl bg-slate-50 p-4"
                                  >
                                    <p className="text-sm font-bold text-slate-900">
                                      {item.uni}
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                      {item.note}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div className="mb-3 flex items-center gap-2">
                                <Info className="h-4 w-4 text-blue-600" />
                                <p className="text-sm font-bold text-slate-900">
                                  2. Use One Master SD Per State
                                </p>
                              </div>

                              <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
                                <p className="text-sm leading-6 text-blue-900">
                                  Instead of rewriting everything from scratch for
                                  each university, create one clean master statutory
                                  declaration with your full rural address history,
                                  dates, postcodes, and relationship to each
                                  address. Then adapt it only where a university
                                  asks for specific wording or a university-specific
                                  form.
                                </p>

                                <div className="mt-4 rounded-2xl border border-blue-200 bg-white/70 px-4 py-3">
                                  <p className="text-xs italic text-slate-500">
                                    “I, [Name], hereby declare that I lived at the
                                    following addresses in MM2-MM7 areas for the
                                    periods listed below...”
                                  </p>
                                </div>

                                <p className="mt-3 text-xs font-medium text-blue-700">
                                  Why this works: most unis want legal confirmation
                                  plus a clear rural timeline, not seven completely
                                  different life stories.
                                </p>
                              </div>
                            </div>

                            <div>
                              <div className="mb-3 flex items-center gap-2">
                                <ClipboardList className="h-4 w-4 text-violet-600" />
                                <p className="text-sm font-bold text-slate-900">
                                  3. Include Supporting Evidence
                                </p>
                              </div>

                              <div className="grid gap-3 md:grid-cols-3">
                                <div className="rounded-2xl bg-fuchsia-50 p-4">
                                  <p className="text-sm font-bold text-fuchsia-900">
                                    School Enrolment Letters
                                  </p>
                                  <p className="mt-1 text-xs leading-5 text-fuchsia-800">
                                    Primary and secondary schools
                                  </p>
                                </div>
                                <div className="rounded-2xl bg-violet-50 p-4">
                                  <p className="text-sm font-bold text-violet-900">
                                    Utility Bills / Rates
                                  </p>
                                  <p className="mt-1 text-xs leading-5 text-violet-800">
                                    Council rates, power, water, bank statements
                                  </p>
                                </div>
                                <div className="rounded-2xl bg-purple-50 p-4">
                                  <p className="text-sm font-bold text-purple-900">
                                    Parent / Guardian SD
                                  </p>
                                  <p className="mt-1 text-xs leading-5 text-purple-800">
                                    Especially useful if you were a minor
                                  </p>
                                </div>
                              </div>

                              <p className="mt-3 text-xs text-slate-500">
                                Tip: keep every file in one evidence folder so you
                                can reuse it across applications.
                              </p>
                            </div>

                            <div>
                              <div className="mb-3 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                <p className="text-sm font-bold text-slate-900">
                                  4. Check State-Specific Wording
                                </p>
                              </div>

                              <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-4">
                                <p className="text-sm leading-6 text-amber-900">
                                  Some states and institutions use slightly different
                                  statutory declaration wording, approved forms, or
                                  witness categories. Always use a university
                                  template if one is supplied, and do not assume one
                                  generic form is automatically accepted everywhere
                                  without checking.
                                </p>

                                <p className="mt-3 text-xs font-semibold text-amber-800">
                                  Pro tip: only modify your master SD if absolutely
                                  necessary.
                                </p>
                              </div>
                            </div>

                            <div>
                              <div className="mb-3 flex items-center gap-2">
                                <Clock3 className="h-4 w-4 text-teal-600" />
                                <p className="text-sm font-bold text-slate-900">
                                  5. Timing & Witnesses
                                </p>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl bg-emerald-50/70 p-4">
                                  <p className="text-sm font-bold text-emerald-900">
                                    Valid Witnesses
                                  </p>
                                  <div className="mt-2 space-y-1 text-sm text-emerald-900">
                                    <p>• JP (Justice of the Peace)</p>
                                    <p>• Solicitor / Lawyer</p>
                                    <p>• Police officer</p>
                                    <p>• Pharmacist / doctor in some jurisdictions</p>
                                    <p>• Teacher / principal in some jurisdictions</p>
                                  </div>
                                </div>

                                <div className="rounded-2xl bg-cyan-50/70 p-4">
                                  <p className="text-sm font-bold text-cyan-900">
                                    Timing Tips
                                  </p>
                                  <div className="mt-2 space-y-1 text-sm text-cyan-900">
                                    <p>• Do not sign too early</p>
                                    <p>• Some unis want SDs signed after applications open</p>
                                    <p>• Check each university's exact wording and timing</p>
                                    <p>• Batch one signing session for multiple applications</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="mb-3 flex items-center gap-2">
                                <ExternalLink className="h-4 w-4 text-emerald-600" />
                                <p className="text-sm font-bold text-slate-900">
                                  State Statutory Declaration Forms
                                </p>
                              </div>

                              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                {stateForms.map((item) => (
                                  <a
                                    key={`${item.state}-${item.title}`}
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div>
                                        <p className="text-sm font-bold text-slate-900">
                                          {item.state}
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-slate-700">
                                          {item.title}
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                          {item.subtitle}
                                        </p>
                                      </div>
                                      <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </section>

                      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                        <section className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm">
                          <div className="flex items-center gap-3">
                            <MapPinned className="h-5 w-5 text-emerald-700" />
                            <h3 className="text-lg font-bold text-slate-950">
                              Rural Eligibility Essentials
                            </h3>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl bg-white/70 p-4">
                              <p className="text-sm font-bold text-slate-900">
                                Core rule
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                Most schemes are based on MM2-MM7 residence for
                                either 5 consecutive years or 10 cumulative years.
                              </p>
                            </div>
                            <div className="rounded-2xl bg-white/70 p-4">
                              <p className="text-sm font-bold text-slate-900">
                                Best first step
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                Check every postcode in the Health Workforce
                                Locator before you prepare forms.
                              </p>
                            </div>
                            <div className="rounded-2xl bg-white/70 p-4">
                              <p className="text-sm font-bold text-slate-900">
                                What usually counts
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                Residential history, school history, and documents
                                that tie you or your family to each address.
                              </p>
                            </div>
                            <div className="rounded-2xl bg-white/70 p-4">
                              <p className="text-sm font-bold text-slate-900">
                                What students get wrong
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                Using current suburb only, missing dates,
                                mismatched postcodes, or leaving evidence
                                collection too late.
                              </p>
                            </div>
                          </div>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="flex items-center gap-3">
                            <Search className="h-5 w-5 text-sky-600" />
                            <h3 className="text-lg font-bold text-slate-950">
                              Search universities
                            </h3>
                          </div>

                          <div className="relative mt-4">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              placeholder="Search universities..."
                              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-sky-300"
                            />
                          </div>

                          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                            Search by university, portal, or rural pathway title.
                          </div>
                        </section>
                      </div>

                      <div className="grid gap-4">
                        {filteredRural.map((item) => (
                          <div
                            key={item.uni}
                            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                          >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div className="max-w-4xl">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
                                    {item.uni}
                                  </h3>
                                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                                    {item.formTag}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-slate-500">
                                  {item.title}
                                </p>

                                <div className="mt-4 grid gap-4 md:grid-cols-2">
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                      Requirements
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                      {item.requirement}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                      Process
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                      {item.process}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-4">
                                  <p className="text-sm font-semibold text-slate-900">
                                    Evidence Required
                                  </p>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {item.evidence.map((e) => (
                                      <span
                                        key={e}
                                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                                      >
                                        {e}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                                <a
                                  href={item.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                >
                                  Apply / View
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                                <button
                                  onClick={() => addToTracker(item)}
                                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                  <Plus className="h-4 w-4" />
                                  Track
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-950">
                          Rural Application Checklist
                        </h3>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          {checklistItems.map((item) => (
                            <div
                              key={item.title}
                              className="rounded-2xl bg-slate-50 p-4"
                            >
                              <p className="text-base font-bold text-slate-900">
                                {item.title}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {item.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm">
                        <h3 className="text-lg font-bold text-emerald-900">
                          Important Tips
                        </h3>
                        <div className="mt-3 space-y-2 text-sm text-emerald-900">
                          <p>• Always check each university’s admissions page each year because rural policy wording can shift.</p>
                          <p>• For graduate medicine, rural status is often declared via GEMSAS but not always handled identically by each school.</p>
                          <p>• For undergraduate entry, rural schemes may sit inside TAC portals, university forms, or separate evidence uploads.</p>
                          <p>• Use the Health Workforce Locator first, then build your residential timeline around those postcodes.</p>
                          <p>• Start collecting evidence early rather than waiting until deadlines are close.</p>
                        </div>
                      </section>

                      <section className="rounded-3xl border border-amber-300 bg-amber-50/70 p-5 shadow-sm">
                        <p className="text-sm leading-6 text-amber-900">
                          <span className="font-semibold">Disclaimer:</span>{" "}
                          Rural forms, witness rules, and exact evidence
                          requirements can change. Always verify the current
                          university source and official state form before
                          submitting.
                        </p>
                      </section>
                    </div>
                  )}

                  {ruralTab === "tracker" && (
                    <div className="mt-5 space-y-5">
                      {tracker.length === 0 ? (
                        <div className="flex min-h-70 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white text-center">
                          <ClipboardList className="h-10 w-10 text-slate-300" />
                          <p className="mt-4 text-lg font-semibold text-slate-700">
                            No forms tracked yet
                          </p>
                          <p className="mt-2 max-w-md text-sm text-slate-500">
                            Go to the Form Requirements tab and click Track on
                            universities you are applying to.
                          </p>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {tracker.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-xl font-bold text-slate-950">
                                      {item.uni}
                                    </h3>
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                                      {item.portal}
                                    </span>
                                  </div>
                                  <p className="mt-2 text-sm text-slate-600">
                                    {item.title}
                                  </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
                                  >
                                    Open
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                  <button
                                    onClick={() => toggleTracker(item.id)}
                                    className={cn(
                                      "rounded-xl px-4 py-3 text-sm font-semibold transition",
                                      item.done
                                        ? "bg-emerald-600 text-white"
                                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                    )}
                                  >
                                    {item.done ? "Completed" : "Mark done"}
                                  </button>
                                  <button
                                    onClick={() => removeTracker(item.id)}
                                    className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-950">
                          Tracker Companion Checklist
                        </h3>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          {[
                            "Residential history table completed",
                            "School history table completed",
                            "Postcodes checked in Health Workforce Locator",
                            "Master stat dec drafted",
                            "Witness booked",
                            "University-specific forms downloaded",
                            "Evidence folder renamed clearly",
                            "All deadlines added to calendar",
                          ].map((item) => (
                            <div
                              key={item}
                              className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-700"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  )}
                </section>
              </>
            )}
                        {activeHubTab === "contingency" && (
              <>
                <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                  <div className="mb-5 flex flex-wrap gap-3">
                    {contingencyTabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setContingencyTab(tab.key)}
                        className={cn(
                          "flex min-w-55 items-center gap-3 rounded-2xl border px-4 py-4 text-left transition",
                          contingencyTab === tab.key
                            ? "border-emerald-400 bg-emerald-50"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        )}
                      >
                        {tab.key === "interview" ? (
                          <CircleAlert className="h-4 w-4 text-slate-500" />
                        ) : tab.key === "offer" ? (
                          <Info className="h-4 w-4 text-slate-500" />
                        ) : (
                          <GraduationCap className="h-4 w-4 text-slate-500" />
                        )}
                        <span className="text-sm font-semibold text-slate-800">
                          {tab.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-5">
                    <div className="flex items-center gap-3">
                      <CircleAlert className="h-5 w-5 text-orange-500" />
                      <h2 className="text-xl font-bold text-slate-950">
                        {selectedContingency.label}
                      </h2>
                    </div>

                    <div className="mt-5">
                      <h3 className="text-lg font-bold text-slate-950">
                        Common Reasons
                      </h3>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {selectedContingency.reasons.map((reason) => (
                          <div
                            key={reason}
                            className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-700"
                          >
                            <span className="mr-2 text-orange-500">•</span>
                            {reason}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-slate-950">
                        What To Do Next
                      </h3>
                      <div className="mt-3 space-y-3">
                        {selectedContingency.next.map((step) => (
                          <div
                            key={step.title}
                            className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-4"
                          >
                            <p className="text-base font-semibold text-slate-900">
                              {step.title}
                            </p>
                            <p className="mt-1 text-sm text-slate-700">
                              {step.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-violet-600" />
                    <h3 className="text-xl font-bold text-slate-950">
                      Undergraduate Degree Options (for Postgrad Medicine)
                    </h3>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {postgradDegrees.map((degree) => (
                      <div
                        key={degree.title}
                        className="rounded-3xl border border-violet-200 bg-violet-50/40 p-5"
                      >
                        <h4 className="text-lg font-bold text-violet-900">
                          {degree.title}
                        </h4>
                        <div className="mt-2 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                          {degree.gpa}
                        </div>

                        <div className="mt-4">
                          <p className="text-sm font-semibold text-emerald-700">
                            Pros:
                          </p>
                          <div className="mt-2 space-y-1">
                            {degree.pros.map((item) => (
                              <div key={item} className="text-sm text-emerald-700">
                                ○ {item}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-sm font-semibold text-orange-600">
                            Cons:
                          </p>
                          <div className="mt-2 space-y-1">
                            {degree.cons.map((item) => (
                              <div key={item} className="text-sm text-orange-600">
                                ○ {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <ListChecks className="h-5 w-5 text-blue-600" />
                    <h3 className="text-xl font-bold text-slate-950">
                      Productive Gap Year Activities
                    </h3>
                  </div>

                  <div className="mt-5 space-y-3">
                    {gapYearActivities.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-blue-200 bg-blue-50/40 px-4 py-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-base font-semibold text-slate-900">
                              {item.title}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {item.text}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold",
                              item.priority === "High" &&
                                "bg-emerald-100 text-emerald-700",
                              item.priority === "Medium" &&
                                "bg-orange-100 text-orange-700",
                              item.priority === "Low" &&
                                "bg-slate-200 text-slate-600"
                            )}
                          >
                            {item.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-3xl border border-emerald-300 bg-emerald-50/70 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <ArrowRight className="h-5 w-5 text-emerald-700" />
                    <h3 className="text-xl font-bold text-slate-950">
                      Mindset Shift
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-emerald-900">
                    Not getting in on first attempt doesn&apos;t mean you won&apos;t
                    become a doctor. Many successful doctors took alternative
                    pathways. The key is having a clear plan, staying productive,
                    and continuing to build your application rather than waiting
                    passively.
                  </p>
                </section>
              </>
            )}

            {activeHubTab === "financial" && (
              <>
                <section className="rounded-3xl border border-blue-200 bg-blue-50/60 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-950">
                      HECS-HELP Overview
                    </h2>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    HECS-HELP is a loan scheme that covers tuition fees for
                    Commonwealth Supported Places. You don&apos;t pay upfront unless
                    you want to. Debt is indexed and repaid once income passes the
                    repayment threshold.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-white/70 p-4">
                      <p className="text-sm font-semibold text-slate-900">
                        Typical MD Debt
                      </p>
                      <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-blue-600">
                        $72,000
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        4 year undergraduate medicine
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/70 p-4">
                      <p className="text-sm font-semibold text-slate-900">
                        Repayment Start
                      </p>
                      <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-blue-600">
                        ~$54k
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Annual income threshold guide
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    Note: these are general planning numbers only. Always verify
                    current annual fee schedules and repayment thresholds.
                  </p>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <House className="h-5 w-5 text-violet-600" />
                    <h2 className="text-xl font-bold text-slate-950">
                      Living Cost Calculator
                    </h2>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <SelectRow
                      label="Course Duration"
                      value={courseDuration}
                      onChange={(value) => setCourseDuration(value as CourseDuration)}
                      options={[
                        "4 years (standard undergrad)",
                        "5 years",
                        "6 years",
                        "7 years (postgrad style path)",
                      ]}
                    />
                    <SelectRow
                      label="Accommodation Type"
                      value={livingType}
                      onChange={(value) => setLivingType(value as LivingOption)}
                      options={[
                        "Residential college ($350/wk)",
                        "Private sharehouse ($260/wk)",
                        "Studio / 1-bed ($420/wk)",
                        "At home ($120/wk)",
                      ]}
                    />
                  </div>

                  <div className="mt-5 rounded-3xl bg-slate-50 p-5">
                    <p className="text-base font-bold text-slate-950">
                      Annual Living Expenses Breakdown
                    </p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <MoneyInput
                        label="Accommodation"
                        value={accommodation}
                        onChange={setAccommodation}
                      />
                      <MoneyInput
                        label="Food"
                        value={food}
                        onChange={setFood}
                      />
                      <MoneyInput
                        label="Transport"
                        value={transport}
                        onChange={setTransport}
                      />
                      <MoneyInput
                        label="Books"
                        value={books}
                        onChange={setBooks}
                      />
                      <MoneyInput
                        label="Personal"
                        value={personal}
                        onChange={setPersonal}
                      />
                      <MoneyInput
                        label="HECS Debt"
                        value={hecsDebt}
                        onChange={setHecsDebt}
                      />
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Extra Living Costs
                          </p>
                          <p className="text-xs text-slate-500">
                            Parking, subscriptions, gym, placements, tech, misc.
                          </p>
                        </div>
                        <button
                          onClick={addExtraLiving}
                          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add item
                        </button>
                      </div>

                      {extraLiving.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                          No extra costs added yet
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {extraLiving.map((item) => (
                            <div
                              key={item.id}
                              className="grid gap-3 md:grid-cols-[1fr_180px_auto]"
                            >
                              <input
                                value={item.label}
                                onChange={(e) =>
                                  updateExtraLiving(
                                    item.id,
                                    "label",
                                    e.target.value
                                  )
                                }
                                placeholder="Extra cost name"
                                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-sky-300"
                              />
                              <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-white px-3">
                                <span className="mr-2 text-sm text-slate-400">
                                  $
                                </span>
                                <input
                                  type="number"
                                  value={item.amount}
                                  onChange={(e) =>
                                    updateExtraLiving(
                                      item.id,
                                      "amount",
                                      Number(e.target.value) || 0
                                    )
                                  }
                                  className="w-full bg-transparent text-sm text-slate-800 outline-none"
                                />
                              </div>
                              <button
                                onClick={() => removeExtraLiving(item.id)}
                                className="inline-flex h-12 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 text-rose-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 rounded-3xl border border-violet-200 bg-violet-50/40 p-5">
                      <h3 className="text-xl font-bold text-violet-900">
                        Total Cost Estimate ({years} years)
                      </h3>
                      <div className="mt-4 space-y-2 text-sm text-slate-700">
                        <div className="flex items-center justify-between">
                          <span>Accommodation</span>
                          <span>{formatMoney(accommodation * years)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Living Expenses</span>
                          <span>
                            {formatMoney(
                              (food +
                                transport +
                                books +
                                personal +
                                extraLiving.reduce(
                                  (sum, item) => sum + item.amount,
                                  0
                                )) *
                                years
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>HECS Debt</span>
                          <span>{formatMoney(hecsDebt)}</span>
                        </div>
                      </div>
                      <div className="mt-4 border-t border-violet-200 pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-violet-900">
                            TOTAL INVESTMENT
                          </span>
                          <span className="text-3xl font-black tracking-[-0.04em] text-violet-700">
                            {formatMoney(totalInvestment)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Landmark className="h-5 w-5 text-orange-600" />
                    <h2 className="text-xl font-bold text-slate-950">
                      Bonded vs Commonwealth Supported Places (CSP)
                    </h2>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-emerald-300 bg-emerald-50/60 p-5">
                      <h3 className="text-lg font-bold text-emerald-900">
                        Commonwealth Supported Place (CSP)
                      </h3>
                      <div className="mt-3 space-y-2 text-sm text-emerald-900">
                        <p>• No work obligation</p>
                        <p>• Full career flexibility</p>
                        <p>• Choose specialty freely</p>
                        <p>• Location freedom</p>
                      </div>
                      <div className="mt-4 rounded-2xl bg-white/60 p-4">
                        <p className="text-sm font-semibold text-slate-900">
                          Trade-off:
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          More competitive entry
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-amber-300 bg-amber-50/60 p-5">
                      <h3 className="text-lg font-bold text-amber-900">
                        Bonded Medical Place (BMP)
                      </h3>
                      <div className="mt-3 space-y-2 text-sm text-amber-900">
                        <p>• Work in designated areas</p>
                        <p>• Typically long return-of-service obligation</p>
                        <p>• Rural/regional focus</p>
                        <p>• May limit specialty choice or flexibility for a period</p>
                      </div>
                      <div className="mt-4 rounded-2xl bg-white/60 p-4">
                        <p className="text-sm font-semibold text-slate-900">
                          Trade-off:
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Easier entry, restricted career freedom
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-3xl bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-bold text-slate-950">
                          Bonded Obligation Timeline
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Obligation Period
                        </p>
                      </div>
                      <p className="text-3xl font-black tracking-[-0.04em] text-slate-950">
                        {bondYears} years
                      </p>
                    </div>

                    <input
                      type="range"
                      min={3}
                      max={12}
                      step={1}
                      value={bondYears}
                      onChange={(e) => setBondYears(Number(e.target.value))}
                      className="mt-4 w-full"
                    />

                    <div className="mt-4 space-y-1 text-xs text-slate-500">
                      <p>• Must work in designated areas during this period</p>
                      <p>• Starts after training according to current scheme rules</p>
                      <p>• Breaking bond may incur financial penalties depending on rules</p>
                      <p>• Career flexibility returns after completion</p>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-rose-300 bg-rose-50/60 p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                    <div>
                      <h3 className="text-lg font-bold text-rose-900">
                        Important Considerations
                      </h3>
                      <div className="mt-3 space-y-2 text-sm text-rose-900">
                        <p>• These are estimates - actual costs vary by location and lifestyle</p>
                        <p>• HECS debt is indexed annually</p>
                        <p>• Part-time work during med school is possible but difficult</p>
                        <p>• Consider opportunity cost of 4-6+ years of study</p>
                        <p>• Bonded places require serious commitment - understand obligations fully before accepting</p>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </main>
    </FeatureGate>
  );
}

function HubButton({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition",
        active
          ? "bg-white text-slate-950 shadow-sm"
          : "text-slate-500 hover:bg-white/60 hover:text-slate-800"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function SelectRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-sky-300"
      >
        {options.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}

function MoneyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-white px-3">
        <span className="mr-2 text-sm text-slate-400">$</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent text-sm text-slate-800 outline-none"
        />
      </div>
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