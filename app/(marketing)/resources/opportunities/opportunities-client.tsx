"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import SignOutButton from "@/components/auth/sign-out-button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Heart,
  Search,
  Filter,
  MapPin,
  ExternalLink,
  Plus,
  Award,
  AlertTriangle,
  Trash2,
  Star,
  Lock,
} from "lucide-react";

type Opportunity = {
  id: string;
  title: string;
  state: string;
  focus: string;
  stage: string;
  summary: string;
  href: string;
  official: boolean;
};

type Experience = {
  id: string;
  title: string;
  organization: string;
  category: string;
  status: string;
  startDate: string;
  endDate: string;
  totalHours: string;
  description: string;
  reflection: string;
};

const opportunities: Opportunity[] = [
  {
    id: "nysf-year-12",
    title: "National Youth Science Forum (NYSF) – Year 12 Program",
    state: "National",
    focus: "All",
    stage: "Year 11 (entering Year 12)",
    summary:
      "Prestigious STEM residential program; strong for med/science narrative.",
    href: "https://www.nysf.edu.au/programs/year-12-program/",
    official: true,
  },
  {
    id: "nrhsn",
    title: "National Rural Health Student Network (NRHSN)",
    state: "National",
    focus: "Rural/Regional",
    stage: "High school to uni",
    summary:
      "National rural health network with clubs, events, and pathway exposure.",
    href: "https://nrhsn.org.au/",
    official: true,
  },
  {
    id: "lime-pathways",
    title: "LIME Network – Indigenous Pathways Into Medicine",
    state: "National",
    focus: "First Nations",
    stage: "High school to applicants",
    summary:
      "Central resource to compare Indigenous pathways into medicine.",
    href: "https://limenetwork.net.au/students/pathways/",
    official: true,
  },
  {
    id: "iaha-academy",
    title: "IAHA – Aboriginal & Torres Strait Islander Health Academy",
    state: "National",
    focus: "First Nations",
    stage: "Years 7–12",
    summary:
      "Health pathway initiative supporting Aboriginal and Torres Strait Islander students.",
    href: "https://iaha.com.au/careers-and-pathways/",
    official: true,
  },
  {
    id: "aime-unisa",
    title: "AIME (via UniSA) – mentoring program",
    state: "National",
    focus: "First Nations",
    stage: "Years 7–12",
    summary:
      "Mentoring model supporting school engagement and transition to uni.",
    href: "https://study.unisa.edu.au/community/australian-indigenous-mentoring-experience-aime/",
    official: true,
  },
  {
    id: "road-to-rural",
    title: "Road to Rural – High school to rural GP pathway",
    state: "National",
    focus: "Rural/Regional",
    stage: "High school",
    summary: "Interactive rural medicine pathway planning resource.",
    href: "https://roadtorural.com.au/high-school/",
    official: true,
  },
  {
    id: "sparq-ed",
    title: "SPARQ-ed (TRI) – biomedical research programs",
    state: "QLD",
    focus: "All",
    stage: "Years 8–12",
    summary:
      "Hands-on biomedical research exposure for Queensland school students.",
    href: "https://www.tri.edu.au/get-involved/sparq-ed",
    official: true,
  },
  {
    id: "uq-rural-clinical-school",
    title: "UQ Rural Clinical School – High School Engagement",
    state: "QLD",
    focus: "Rural/Regional",
    stage: "Years 10–12",
    summary:
      "Taster events and rural pathway guidance through UQ Rural Clinical School.",
    href: "https://medical-school.uq.edu.au/rural-clinical-school",
    official: false,
  },
  {
    id: "uq-high-school-activities",
    title: "UQ – High school activities (tours/workshops)",
    state: "QLD",
    focus: "All",
    stage: "High school",
    summary:
      "Try-the-campus activities, workshops, and outreach sessions.",
    href: "https://study.uq.edu.au/events/high-school-students",
    official: false,
  },
  {
    id: "uq-young-changemakers",
    title: "UQ Biomedical Sciences – Young ChangeMakers",
    state: "QLD",
    focus: "All",
    stage: "Year 11",
    summary:
      "Short extension-style experience with science and leadership emphasis.",
    href: "https://study.uq.edu.au/",
    official: false,
  },
  {
    id: "mater-health-adventure",
    title: "Mater Education – High School Health Adventure",
    state: "QLD",
    focus: "All",
    stage: "High school",
    summary:
      "Hands-on CPR, life support, and clinical scenario exposure.",
    href: "https://www.matereducation.qld.edu.au/",
    official: false,
  },
  {
    id: "qld-deadly-start",
    title: "Queensland Health – Deadly Start traineeships",
    state: "QLD",
    focus: "First Nations",
    stage: "Final years high school",
    summary:
      "Culturally supported traineeship pathway with qualifications and experience.",
    href: "https://www.careers.health.qld.gov.au/",
    official: false,
  },
  {
    id: "uq-atsi-careers-hub",
    title:
      "Queensland Health – Aboriginal and Torres Strait Islander careers hub",
    state: "QLD",
    focus: "First Nations",
    stage: "High school to graduates",
    summary:
      "Central Queensland Health careers and pathway information for First Nations students.",
    href: "https://www.careers.health.qld.gov.au/",
    official: false,
  },
  {
    id: "uq-provisional-entry",
    title: "UQ – Aboriginal & Torres Strait Islander MD Provisional Entry",
    state: "QLD",
    focus: "First Nations",
    stage: "School leavers",
    summary:
      "Defined pathway with interview/MMI; UCAT encouraged but not always central.",
    href: "https://medical-school.uq.edu.au/study/doctor-medicine/aboriginal-and-torres-strait-islander-applicants",
    official: false,
  },
  {
    id: "qimr-work-experience",
    title: "QIMR Berghofer – High School Work Experience",
    state: "QLD",
    focus: "All",
    stage: "Years 11–12",
    summary:
      "Research lab exposure and biomedical science work experience.",
    href: "https://www.qimrberghofer.edu.au/",
    official: false,
  },
  {
    id: "qimr-education-overview",
    title: "QIMR Berghofer – Education programs overview",
    state: "QLD",
    focus: "All",
    stage: "Years 10–12",
    summary:
      "Central page for school-facing research education programs.",
    href: "https://www.qimrberghofer.edu.au/education/",
    official: false,
  },
  {
    id: "uq-rural-subquota",
    title: "UQ – Rural Background Sub-quota (MD pathway)",
    state: "QLD",
    focus: "Rural/Regional",
    stage: "Applicants",
    summary:
      "Key rural pathway and documentation guidance for eligible applicants.",
    href: "https://medical-school.uq.edu.au/study/doctor-medicine/rural-background-applicants",
    official: false,
  },
  {
    id: "unisq-head-start",
    title: "UniSQ – Head Start",
    state: "QLD",
    focus: "All",
    stage: "High school",
    summary: "Study university courses while still at school.",
    href: "https://www.unisq.edu.au/study/school/head-start",
    official: false,
  },
  {
    id: "unisq-school-engagement",
    title: "UniSQ – School engagement",
    state: "QLD",
    focus: "All",
    stage: "High school",
    summary: "On-campus and in-school engagement options.",
    href: "https://www.unisq.edu.au/study/school",
    official: false,
  },
  {
    id: "bond-first-nations-scholarship",
    title: "Bond University – First Nations Medical Scholarship Program",
    state: "QLD",
    focus: "First Nations",
    stage: "Applicants",
    summary:
      "Scholarship-linked pathway into Bond medical studies.",
    href: "https://bond.edu.au/indigenous",
    official: false,
  },
  {
    id: "unisc-indigenous-pathway",
    title: "UniSC – Indigenous Health Admissions Pathway",
    state: "QLD",
    focus: "First Nations",
    stage: "Applicants",
    summary:
      "Prioritised pathway support into selected competitive health programs.",
    href: "https://www.usc.edu.au/about/indigenous-engagement",
    official: false,
  },
  {
    id: "ruralmeded-aspire2health",
    title: "RuralMedEd – Aspire2Health",
    state: "QLD/NSW",
    focus: "Rural/Regional",
    stage: "Rural high school",
    summary:
      "Interactive, hands-on rural health careers exposure.",
    href: "https://ruralmeded.org.au/",
    official: false,
  },
  {
    id: "usyd-med-health-outreach",
    title:
      "University of Sydney – Medicine & Health High School Outreach",
    state: "NSW",
    focus: "All",
    stage: "High school",
    summary:
      "Practical outreach experiences exploring medicine and health.",
    href: "https://www.sydney.edu.au/medicine-health/engage-with-us/community-engagement.html",
    official: false,
  },
  {
    id: "usyd-access-programs",
    title:
      "University of Sydney – High school outreach & access programs",
    state: "NSW",
    focus: "Equity/Regional",
    stage: "High school",
    summary:
      "Broader access programs and support for underrepresented students.",
    href: "https://www.sydney.edu.au/study/applying/admission-pathways.html",
    official: false,
  },
  {
    id: "unsw-gateway",
    title: "UNSW – Gateway Program",
    state: "NSW",
    focus: "Low-SES/Regional/First Nations",
    stage: "Years 10–12",
    summary:
      "Workshops, on-campus days, and admissions pathway support.",
    href: "https://www.unsw.edu.au/study/how-to-apply/undergraduate/admission-pathways/gateway-admission-pathway",
    official: false,
  },
  {
    id: "unsw-indigenous-pathways",
    title: "UNSW Indigenous – Indigenous Pathways",
    state: "NSW",
    focus: "First Nations",
    stage: "Prospective students",
    summary:
      "Alternative entry and preparation pathways for Indigenous students.",
    href: "https://www.unsw.edu.au/medicine-health/our-schools/population-health/our-research/lowitja-institute/indigenous-pathways-planning",
    official: false,
  },
  {
    id: "uow-rural-entry-md",
    title: "University of Wollongong – Rural Entry Pathway (MD)",
    state: "NSW",
    focus: "Rural/Regional",
    stage: "Applicants",
    summary:
      "Eligibility tied to rural schooling classification for MD entry.",
    href: "https://www.uow.edu.au/science-medicine-health/schools-entities/gsm/admission-information/rural-admissions/",
    official: false,
  },
  {
    id: "vccri-work-experience",
    title: "Victor Chang Cardiac Research Institute – Work Experience",
    state: "NSW",
    focus: "All",
    stage: "High school (STEMM)",
    summary:
      "Lab exposure alongside scientists and researchers.",
    href: "https://www.victorchang.edu.au/",
    official: false,
  },
  {
    id: "cmri-stem-cell-academy",
    title:
      "Children’s Medical Research Institute (CMRI) – Stem Cell Academy",
    state: "NSW",
    focus: "All",
    stage: "Years 10–12",
    summary:
      "Short immersive program for high-school students interested in medical research.",
    href: "https://www.cmri.org.au/",
    official: false,
  },
  {
    id: "notre-dame-indigenous-pathway",
    title: "Notre Dame – Indigenous Pathway to Medicine",
    state: "NSW/WA",
    focus: "First Nations",
    stage: "Applicants",
    summary:
      "Indigenous admissions pathway to Notre Dame medicine.",
    href: "https://www.notredame.edu.au/study/pathways/indigenous-entry-pathway",
    official: false,
  },
  {
    id: "rdn-osp",
    title: "RDN – Outreach Student Placement Program",
    state: "NSW/ACT",
    focus: "Regional",
    stage: "Year 12 completed",
    summary:
      "Post-school placement-style exposure relevant to health pathways.",
    href: "https://www.nswrdn.com.au/",
    official: false,
  },
  {
    id: "monash-health-work-experience",
    title: "Monash Health – Work Experience Program",
    state: "VIC",
    focus: "All",
    stage: "Year 10",
    summary:
      "Structured week-long placement across departments.",
    href: "https://monashhealth.org/careers/work-experience/",
    official: true,
  },
  {
    id: "monash-gukwonderuk",
    title: "Monash University – Hands on Health (Gukwonderuk)",
    state: "VIC",
    focus: "First Nations",
    stage: "Primary + secondary",
    summary:
      "Culturally safe health careers exposure for Aboriginal and Torres Strait Islander youth.",
    href: "https://www.monash.edu/medicine/sphpm/womens/indigenous-health/gukwonderuk",
    official: false,
  },
  {
    id: "monash-rural-med-toring",
    title: "Monash Rural Health – Med-Toring (Mildura)",
    state: "VIC",
    focus: "Rural/Regional",
    stage: "Secondary",
    summary:
      "Test-drive health careers with rural health teams.",
    href: "https://www.monash.edu/medicine/srh",
    official: false,
  },
  {
    id: "unimelb-high-school-programs",
    title: "University of Melbourne – High school programs",
    state: "VIC",
    focus: "All",
    stage: "Year 12 + high school",
    summary:
      "Extension-style and outreach offerings for students.",
    href: "https://study.unimelb.edu.au/connect-with-us/high-school-programs",
    official: false,
  },
  {
    id: "murrup-barak-outreach",
    title: "University of Melbourne – Murrup Barak Outreach",
    state: "VIC",
    focus: "First Nations",
    stage: "Years 9–12",
    summary:
      "Guidance, camps, outreach, and pathway support.",
    href: "https://murrupbarak.unimelb.edu.au/home/outreach",
    official: false,
  },
  {
    id: "yagilaith-camp",
    title: "University of Melbourne – Yagilaith (Murrup Barak camp)",
    state: "VIC",
    focus: "First Nations",
    stage: "Years 11–12",
    summary:
      "Immersive university experience with broad exposure and support.",
    href: "https://murrupbarak.unimelb.edu.au/home/outreach/yagilaith",
    official: false,
  },
  {
    id: "wehi-work-experience",
    title: "WEHI – Secondary School Work Experience Program",
    state: "VIC",
    focus: "All",
    stage: "Secondary school",
    summary:
      "Five-day biomedical research work experience program.",
    href: "https://www.wehi.edu.au/education/work-experience/",
    official: false,
  },
  {
    id: "florey-work-experience",
    title: "The Florey – Work Experience Program",
    state: "VIC",
    focus: "All",
    stage: "High school (15+)",
    summary:
      "Immersive lab exposure plus neuroscience careers insight.",
    href: "https://florey.edu.au/",
    official: false,
  },
  {
    id: "gtac-sire",
    title: "GTAC – Science Immersion Research Experience (SIRE)",
    state: "VIC",
    focus: "All",
    stage: "Students",
    summary:
      "Research-grade equipment and institute visits for science immersion.",
    href: "https://www.gtac.edu.au/",
    official: false,
  },
  {
    id: "monash-discovery-work-experience",
    title:
      "Monash University Discovery Institute – Work experience",
    state: "VIC",
    focus: "All",
    stage: "Secondary (15+)",
    summary:
      "Week-long laboratory placement after selection process.",
    href: "https://www.monash.edu/discovery-institute/engage/schools-and-community-outreach/work-experience-for-secondary-students",
    official: true,
  },
  {
    id: "monash-beyond-the-bedside",
    title: "Monash Health – Beyond the bedside (STEM in healthcare)",
    state: "VIC",
    focus: "First Nations focus",
    stage: "Secondary",
    summary: "STEM-in-healthcare style workshop exposure.",
    href: "https://monashhealth.org/careers/",
    official: false,
  },
  {
    id: "deakin-health-voices",
    title:
      "Deakin Institute for Health Transformation – Health Voices Victoria",
    state: "VIC",
    focus: "All",
    stage: "Community/Students",
    summary:
      "Community-engagement initiative useful for public health perspective.",
    href: "https://iht.deakin.edu.au/our-research/health-voices-victoria/",
    official: false,
  },
  {
    id: "uoa-health-academy",
    title: "University of Adelaide – Health Academy",
    state: "SA",
    focus: "All",
    stage: "Years 8–12",
    summary:
      "Workshops, activities, newsletters, and school engagement.",
    href: "https://www.adelaide.edu.au/health/health-academy",
    official: false,
  },
  {
    id: "sahmri-work-experience",
    title: "SAHMRI – Work Experience Program",
    state: "SA",
    focus: "All",
    stage: "Secondary school",
    summary:
      "Selective program introducing careers in medical research.",
    href: "https://www.sahmri.org/education-outreach",
    official: false,
  },
  {
    id: "flinders-sarmp",
    title:
      "Flinders University – South Australia Rural Medical Program (SARM Program)",
    state: "SA",
    focus: "Rural + First Nations",
    stage: "Applicants",
    summary:
      "Priority admissions pathway for rural South Australia and some equity groups.",
    href: "https://www.flinders.edu.au/flinders-rural-and-remote-health-sa/sarmp",
    official: false,
  },
  {
    id: "uwa-rural-high-school-medical",
    title: "UWA – Rural High School Medical Program",
    state: "WA",
    focus: "Rural/Regional",
    stage: "Regional/rural secondary",
    summary:
      "Tailored direct and alternate pathways for rural students.",
    href: "https://www.uwa.edu.au/rcswa/current-and-future-medical-students/rural-high-school-program",
    official: false,
  },
  {
    id: "rdwa-student-programs",
    title: "Rural Doctors Workforce Agency (RDWA) – Student programs",
    state: "WA",
    focus: "Rural/Regional",
    stage: "High school + uni",
    summary:
      "Overview of multiple rural health initiatives and pathway support.",
    href: "https://www.ruraldoc.com.au/",
    official: false,
  },
  {
    id: "curtin-rising-scholar",
    title: "Curtin University – Rising Scholar Program",
    state: "WA",
    focus: "All",
    stage: "Years 10–12",
    summary:
      "Do a Curtin unit while still at school.",
    href: "https://www.curtin.edu.au/engage/outreach-offerings/curtin-rising-scholar-program/",
    official: false,
  },
  {
    id: "utas-hap",
    title: "UTAS – High Achiever Program (HAP)",
    state: "TAS",
    focus: "All",
    stage: "Years 11–12",
    summary:
      "Complete university units and build academic track record while at school.",
    href: "https://www.utas.edu.au/study/pathways-to-university/high-achiever-program",
    official: false,
  },
  {
    id: "utas-rural-clinical-engagement",
    title: "UTAS – Rural Clinical School community engagement",
    state: "TAS",
    focus: "Rural/Regional",
    stage: "High school",
    summary:
      "Rural clinical school engagement and careers exposure.",
    href: "https://www.utas.edu.au/rural-clinical-school/community-engagement",
    official: false,
  },
  {
    id: "ntmp",
    title: "Northern Territory Medical Program (NTMP)",
    state: "NT",
    focus: "All",
    stage: "School leavers",
    summary: "Official NT medical program overview.",
    href: "https://www.cdu.edu.au/medicine",
    official: false,
  },
  {
    id: "anu-tjabal",
    title: "ANU – Tjabal Indigenous Higher Education Centre",
    state: "ACT",
    focus: "First Nations",
    stage: "Prospective + current",
    summary:
      "Includes outreach programs, scholarships, and support.",
    href: "https://www.anu.edu.au/students/contacts/tjabal-indigenous-higher-education-centre",
    official: false,
  },
];

const categories = [
  "Clinical Exposure",
  "Leadership",
  "Community Service",
  "Research",
  "Volunteer Work",
  "Work Experience",
];

const stateOptions = [
  "All",
  ...Array.from(new Set(opportunities.map((o) => o.state))),
];
const focusOptions = [
  "All",
  ...Array.from(new Set(opportunities.map((o) => o.focus))),
];

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function focusTone(focus: string) {
  if (focus.includes("First Nations")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (focus.includes("Rural")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (focus.includes("Equity") || focus.includes("Low-SES")) {
    return "border-violet-200 bg-violet-50 text-violet-700";
  }
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function createEmptyExperience(): Experience {
  return {
    id: crypto.randomUUID(),
    title: "",
    organization: "",
    category: "Clinical Exposure",
    status: "Ongoing",
    startDate: "",
    endDate: "",
    totalHours: "",
    description: "",
    reflection: "",
  };
}

function StatTile({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <div>
        <p className="text-3xl font-black tracking-tight text-slate-950">
          {value}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function SectionIntro({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
            {title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
        {icon}
      </div>
      <p className="mt-4 text-lg font-semibold text-slate-700">{title}</p>
      <p className="mt-1 max-w-md text-sm text-slate-400">{text}</p>
    </div>
  );
}

function LockedOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-white/72 backdrop-blur-[2px]">
      <div className="mx-4 max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-[0_12px_35px_rgba(15,23,42,0.10)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
          <Lock className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-xl font-black tracking-tight text-slate-950">
          Upgrade to unlock Opportunities
        </h3>

        <p className="mt-2 text-sm leading-7 text-slate-600">
          Browse the full opportunities database, track experiences, and build
          a much stronger portfolio with Pro.
        </p>

        <Link
          href="/info/pricing"
          className="mt-5 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Upgrade to Pro
        </Link>
      </div>
    </div>
  );
}

export default function OpportunitiesClient({
  isPremium,
}: {
  isPremium: boolean;
}) {
  const [tab, setTab] = useState<"tracker" | "browse">("tracker");
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [focusFilter, setFocusFilter] = useState("All");
  const [officialOnly, setOfficialOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<Experience>(createEmptyExperience());
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const filtered = useMemo(() => {
    return opportunities.filter((opportunity) => {
      const q = query.trim().toLowerCase();

      const matchesQuery =
        q.length === 0 ||
        opportunity.title.toLowerCase().includes(q) ||
        opportunity.summary.toLowerCase().includes(q) ||
        opportunity.stage.toLowerCase().includes(q) ||
        opportunity.focus.toLowerCase().includes(q) ||
        opportunity.state.toLowerCase().includes(q);

      const matchesState =
        stateFilter === "All" || opportunity.state === stateFilter;
      const matchesFocus =
        focusFilter === "All" || opportunity.focus === focusFilter;
      const matchesOfficial = !officialOnly || opportunity.official;

      return (
        matchesQuery &&
        matchesState &&
        matchesFocus &&
        matchesOfficial
      );
    });
  }, [query, stateFilter, focusFilter, officialOnly]);

  const visibleOpportunities = isPremium ? filtered : filtered.slice(0, 8);

  const coveredCategories = new Set(
    experiences.map((item) => item.category)
  );
  const missingCategories = categories.filter(
    (category) => !coveredCategories.has(category)
  );

  const officialCount = opportunities.filter((item) => item.official).length;
  const statesCovered = stateOptions.length - 1;

  const totalHours = experiences.reduce((sum, item) => {
    const parsed = Number(item.totalHours);
    return Number.isFinite(parsed) ? sum + parsed : sum;
  }, 0);

  const handleSaveExperience = () => {
    if (!draft.title.trim()) return;

    setExperiences((current) => [draft, ...current]);
    setDraft(createEmptyExperience());
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setExperiences((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const handleResetFilters = () => {
    setQuery("");
    setStateFilter("All");
    setFocusFilter("All");
    setOfficialOnly(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
            <div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    Explore
                  </p>
                  <h1 className="mt-1 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    Opportunities
                  </h1>
                </div>
              </div>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                Discover programs, work experience, outreach pathways, and
                portfolio-building opportunities across Australia. Track what
                you’ve done, see what’s missing, and make smarter next moves for
                your med journey.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-950">
                    Cleaner browsing
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Search fast without scanning noisy cards.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-950">
                    Stronger tracking
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Log experiences and build interview examples early.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-950">
                    Better filtering
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    State, focus, and official-link views in one place.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:gap-4">
              <StatTile
                value={`${opportunities.length}`}
                label="Opportunities"
              />
              <StatTile value={`${officialCount}`} label="Official sources" />
              <StatTile value={`${statesCovered}`} label="States covered" />
            </div>
          </div>
        </div>

        <div className="relative mt-6">
          {!isPremium ? <LockedOverlay /> : null}

          <div
            className={
              !isPremium ? "pointer-events-none select-none opacity-45" : ""
            }
          >
            <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
              <div className="grid gap-2 md:grid-cols-2">
                <button
                  onClick={() => setTab("tracker")}
                  className={cx(
                    "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    tab === "tracker"
                      ? "bg-slate-950 text-white"
                      : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  )}
                >
                  My Experience Tracker
                </button>
                <button
                  onClick={() => setTab("browse")}
                  className={cx(
                    "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    tab === "browse"
                      ? "bg-slate-950 text-white"
                      : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  )}
                >
                  Browse Opportunities
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {tab === "tracker" ? (
                <motion.div
                  key="tracker"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
                >
                  <div className="space-y-6">
                    <SectionIntro
                      icon={<Heart className="h-5 w-5" />}
                      title="Track early. Reflect properly."
                      text="Good experiences are not enough on their own. What matters is keeping a clear record of what you did, what you learned, and how it shaped your motivation for medicine."
                    />

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <Award className="h-5 w-5" />
                          </div>
                          <div>
                            <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                              Experience Tracker
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                              Save experiences, hours, reflections, and examples
                              for interviews.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setShowForm((current) => !current)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          <Plus className="h-4 w-4" />
                          {showForm ? "Hide Form" : "Add Experience"}
                        </button>
                      </div>

                      <AnimatePresence initial={false}>
                        {showForm ? (
                          <motion.div
                            key="form"
                            initial={{ opacity: 0, height: 0, y: -8 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                              <div className="grid gap-4 md:grid-cols-2">
                                <label className="block">
                                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                                    Title *
                                  </span>
                                  <input
                                    value={draft.title}
                                    onChange={(e) =>
                                      setDraft({
                                        ...draft,
                                        title: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300"
                                    placeholder="e.g. Hospital volunteer"
                                  />
                                </label>

                                <label className="block">
                                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                                    Organization
                                  </span>
                                  <input
                                    value={draft.organization}
                                    onChange={(e) =>
                                      setDraft({
                                        ...draft,
                                        organization: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300"
                                    placeholder="e.g. Royal Melbourne Hospital"
                                  />
                                </label>

                                <label className="block">
                                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                                    Category *
                                  </span>
                                  <select
                                    value={draft.category}
                                    onChange={(e) =>
                                      setDraft({
                                        ...draft,
                                        category: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300"
                                  >
                                    {categories.map((category) => (
                                      <option key={category}>{category}</option>
                                    ))}
                                  </select>
                                </label>

                                <label className="block">
                                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                                    Status
                                  </span>
                                  <select
                                    value={draft.status}
                                    onChange={(e) =>
                                      setDraft({
                                        ...draft,
                                        status: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300"
                                  >
                                    <option>Ongoing</option>
                                    <option>Completed</option>
                                    <option>Planned</option>
                                  </select>
                                </label>

                                <label className="block">
                                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                                    Start Date
                                  </span>
                                  <input
                                    type="date"
                                    value={draft.startDate}
                                    onChange={(e) =>
                                      setDraft({
                                        ...draft,
                                        startDate: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300"
                                  />
                                </label>

                                <label className="block">
                                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                                    End Date
                                  </span>
                                  <input
                                    type="date"
                                    value={draft.endDate}
                                    onChange={(e) =>
                                      setDraft({
                                        ...draft,
                                        endDate: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300"
                                  />
                                </label>
                              </div>

                              <label className="mt-4 block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">
                                  Total Hours
                                </span>
                                <input
                                  value={draft.totalHours}
                                  onChange={(e) =>
                                    setDraft({
                                      ...draft,
                                      totalHours: e.target.value,
                                    })
                                  }
                                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300"
                                  placeholder="e.g. 24"
                                />
                              </label>

                              <label className="mt-4 block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">
                                  Description
                                </span>
                                <textarea
                                  value={draft.description}
                                  onChange={(e) =>
                                    setDraft({
                                      ...draft,
                                      description: e.target.value,
                                    })
                                  }
                                  className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300"
                                  placeholder="What did you do?"
                                />
                              </label>

                              <label className="mt-4 block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">
                                  Reflection & Learnings
                                </span>
                                <textarea
                                  value={draft.reflection}
                                  onChange={(e) =>
                                    setDraft({
                                      ...draft,
                                      reflection: e.target.value,
                                    })
                                  }
                                  className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300"
                                  placeholder="What did you learn? How did it impact you?"
                                />
                              </label>

                              <div className="mt-5 flex flex-wrap gap-3">
                                <button
                                  onClick={handleSaveExperience}
                                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                  Save Experience
                                </button>
                                <button
                                  onClick={() => {
                                    setShowForm(false);
                                    setDraft(createEmptyExperience());
                                  }}
                                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>

                      <div className="mt-6">
                        {experiences.length === 0 ? (
                          <EmptyState
                            icon={<Award className="h-6 w-6" />}
                            title="No experiences tracked yet"
                            text="Add your first experience and start building a much better interview bank."
                          />
                        ) : (
                          <div className="space-y-4">
                            {experiences.map((item) => (
                              <div
                                key={item.id}
                                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                              >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <h3 className="text-lg font-black tracking-tight text-slate-950">
                                        {item.title}
                                      </h3>
                                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                                        {item.category}
                                      </span>
                                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                        {item.status}
                                      </span>
                                    </div>

                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                                      <span>
                                        {item.organization ||
                                          "Organization not set"}
                                      </span>
                                      {item.totalHours ? (
                                        <span>{item.totalHours} hours</span>
                                      ) : null}
                                      {item.startDate ? (
                                        <span>Started {item.startDate}</span>
                                      ) : null}
                                      {item.endDate ? (
                                        <span>Ended {item.endDate}</span>
                                      ) : null}
                                    </div>

                                    <p className="mt-4 text-sm leading-7 text-slate-700">
                                      {item.description ||
                                        "No description added yet."}
                                    </p>

                                    {item.reflection ? (
                                      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                          Reflection
                                        </p>
                                        <p className="mt-2 text-sm leading-7 text-slate-700">
                                          {item.reflection}
                                        </p>
                                      </div>
                                    ) : null}
                                  </div>

                                  <button
                                    onClick={() => handleDelete(item.id)}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-black tracking-tight text-slate-950">
                        Portfolio Snapshot
                      </h3>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm text-slate-500">
                            Experiences tracked
                          </p>
                          <p className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                            {experiences.length}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm text-slate-500">
                            Logged hours
                          </p>
                          <p className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                            {totalHours}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 xl:col-span-1">
                          <p className="text-sm text-slate-500">
                            Categories covered
                          </p>
                          <p className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                            {coveredCategories.size} / {categories.length}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-amber-600">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-amber-950">
                            Gaps worth fixing
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-amber-900">
                            A stronger profile is usually broad, not
                            one-dimensional. Try filling the missing areas
                            below.
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {missingCategories.length > 0 ? (
                              missingCategories.map((category) => (
                                <span
                                  key={category}
                                  className="rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-700"
                                >
                                  {category}
                                </span>
                              ))
                            ) : (
                              <span className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                Nice spread so far
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-black tracking-tight text-slate-950">
                        What good entries look like
                      </h3>
                      <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                        <p>
                          <span className="font-semibold text-slate-950">
                            Description:
                          </span>{" "}
                          what you actually did, not just what the program was.
                        </p>
                        <p>
                          <span className="font-semibold text-slate-950">
                            Reflection:
                          </span>{" "}
                          what changed in your thinking, empathy, teamwork, or
                          motivation.
                        </p>
                        <p>
                          <span className="font-semibold text-slate-950">
                            Hours:
                          </span>{" "}
                          enough detail to show consistency and commitment.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="browse"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="mt-6 space-y-6"
                >
                  <SectionIntro
                    icon={<Search className="h-5 w-5" />}
                    title="Browse without the clutter"
                    text="This layout is meant to feel calmer and faster to scan. Filter what matters, then move straight into the strongest opportunities."
                  />

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
                      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <Search className="h-5 w-5 text-slate-400" />
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search programs, stages, focus, or state..."
                          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                        />
                      </label>

                      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <MapPin className="h-5 w-5 text-slate-400" />
                        <select
                          value={stateFilter}
                          onChange={(e) => setStateFilter(e.target.value)}
                          className="w-full bg-transparent text-sm outline-none"
                        >
                          {stateOptions.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </label>

                      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <Filter className="h-5 w-5 text-slate-400" />
                        <select
                          value={focusFilter}
                          onChange={(e) => setFocusFilter(e.target.value)}
                          className="w-full bg-transparent text-sm outline-none"
                        >
                          {focusOptions.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </label>

                      <button
                        onClick={handleResetFilters}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        Reset
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span>
                          Showing {visibleOpportunities.length} of{" "}
                          {filtered.length} opportunities
                        </span>
                        <span className="hidden text-slate-300 sm:inline">
                          •
                        </span>
                        <span>{officialCount} official-link options</span>
                      </div>

                      <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={officialOnly}
                          onChange={(e) => setOfficialOnly(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                        Official links only
                      </label>
                    </div>
                  </div>

                  {visibleOpportunities.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <EmptyState
                        icon={<Search className="h-6 w-6" />}
                        title="No matches found"
                        text="Try widening your filters or searching with fewer words."
                      />
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                      <div className="hidden border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 lg:grid lg:grid-cols-[1.5fr_0.8fr_0.9fr_0.9fr_0.5fr] lg:gap-4">
                        <span>Opportunity</span>
                        <span>State</span>
                        <span>Focus</span>
                        <span>Stage</span>
                        <span className="text-right">Link</span>
                      </div>

                      <div className="divide-y divide-slate-200">
                        {visibleOpportunities.map((opportunity) => (
                          <motion.div
                            key={opportunity.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.18 }}
                            className="px-5 py-5 sm:px-6"
                          >
                            <div className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr_0.9fr_0.9fr_0.5fr] lg:items-center lg:gap-4">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-base font-black tracking-tight text-slate-950 sm:text-lg">
                                    {opportunity.title}
                                  </h3>
                                  {opportunity.official ? (
                                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                      Official
                                    </span>
                                  ) : null}
                                </div>
                                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                                  {opportunity.summary}
                                </p>
                              </div>

                              <div className="text-sm text-slate-700">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-center lg:text-left">
                                  {opportunity.state}
                                </div>
                              </div>

                              <div className="text-sm">
                                <div
                                  className={cx(
                                    "rounded-2xl border px-3 py-2 text-center font-medium lg:text-left",
                                    focusTone(opportunity.focus)
                                  )}
                                >
                                  {opportunity.focus}
                                </div>
                              </div>

                              <div className="text-sm text-slate-700">
                                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                                  {opportunity.stage}
                                </div>
                              </div>

                              <div className="flex lg:justify-end">
                                <Link
                                  href={opportunity.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                >
                                  Visit
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {!isPremium && filtered.length > visibleOpportunities.length ? (
                        <div className="border-t border-slate-200 bg-slate-50 px-6 py-8 text-center">
                          <p className="text-sm font-medium text-slate-600">
                            Unlock the full opportunities database and tracker
                            with Pro.
                          </p>
                          <Link
                            href="/info/pricing"
                            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                          >
                            Upgrade to Pro
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  )}

                  <div className="rounded-3xl border border-amber-300 bg-amber-50 p-5 text-sm leading-7 text-amber-900 shadow-sm">
                    <span className="font-semibold">Disclaimer:</span> Program
                    details, eligibility, and availability may change. Always
                    verify current information on the official program or
                    university website.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}