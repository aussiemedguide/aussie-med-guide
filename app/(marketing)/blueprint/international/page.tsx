"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Globe,
  GraduationCap,
  School,
  BadgeCheck,
  ExternalLink,
  AlertTriangle,
  Wallet,
  FileText,
  BookOpen,
  Plane,
  ArrowRight,
  CalendarDays,
  Shield,
  Info,
  CheckCircle2,
  CircleDollarSign,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TabKey = "who" | "isat" | "school" | "graduate" | "qualifications";

type LinkItem = {
  label: string;
  href: string;
};

type SchoolCard = {
  name: string;
  state: string;
  pathway: string;
  badge: string;
  badgeTone: string;
  summary: string;
  bullets: string[];
  links: LinkItem[];
  spotlight?: string;
};

type GraduateCard = {
  name: string;
  requirement: string;
  summary: string;
  links: LinkItem[];
};

const tabs: { key: TabKey; label: string }[] = [
  { key: "who", label: "Who Are You?" },
  { key: "isat", label: "ISAT Hub" },
  { key: "school", label: "School Leaver Entry" },
  { key: "graduate", label: "Graduate Entry" },
  { key: "qualifications", label: "Qualifications" },
];

const isatWindows = [
  { window: "19–30 January 2026", note: "29–30 resits only" },
  { window: "27 April–8 May 2026", note: "7–8 resits only" },
  { window: "27 July–7 August 2026", note: "6–7 resits only" },
  { window: "26 October–6 November 2026", note: "5–6 resits only" },
];

const schoolLeaverPrograms: SchoolCard[] = [
  {
    name: "Monash University",
    state: "VIC",
    pathway: "BMedSc / Doctor of Medicine",
    badge: "ISAT",
    badgeTone: "from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200",
    summary: "Minimum 170 overall + 165 in each section.",
    bullets: [
      "Must have completed Year 12 or equivalent within 2 years.",
      "Must not have commenced tertiary study.",
      "Selection uses academics, ISAT and interview.",
    ],
    links: [
      { label: "Entry Requirements", href: "https://www.monash.edu/medicine/som/direct-entry/international/entry-requirements" },
      { label: "Applications & Fees", href: "https://www.monash.edu/medicine/som/direct-entry/international/applications-fees" },
      { label: "Course Overview", href: "https://www.monash.edu/medicine/som/direct-entry/international" },
    ],
    spotlight:
      "Monash is one of the clearest direct-entry options for offshore internationals and has a large established international cohort at Clayton.",
  },
  {
    name: "UNSW Sydney",
    state: "NSW",
    pathway: "Bachelor of Medical Studies / Doctor of Medicine",
    badge: "ISAT or UCAT ANZ",
    badgeTone: "from-sky-100 to-indigo-100 text-sky-800 border-sky-200",
    summary: "Submit only one. ISAT must be completed by the required deadline.",
    bullets: [
      "International applicants apply through the UNSW Medicine Application Portal.",
      "Offers are based on final academics, admission test and interview.",
      "Predicted results do not lead directly to offers.",
    ],
    links: [
      { label: "International Applicants", href: "https://www.unsw.edu.au/medicine-health/study-with-us/undergraduate/applying-to-medicine/international-applicants" },
    ],
  },
  {
    name: "University of Western Australia",
    state: "WA",
    pathway: "Assured Pathway to Doctor of Medicine",
    badge: "ISAT",
    badgeTone: "from-emerald-100 to-lime-100 text-emerald-800 border-emerald-200",
    summary: "Required for international school leavers applying to the assured pathway.",
    bullets: [
      "Direct international school-leaver route available.",
      "Selection includes ATAR or equivalent, ISAT and interview.",
      "Usually paired with a UWA undergraduate assured pathway structure.",
    ],
    links: [
      { label: "Doctor of Medicine", href: "https://www.uwa.edu.au/study/courses/doctor-of-MEDICINE" },
      { label: "Assured Pathways", href: "https://www.uwa.edu.au/study/explore-courses/assured-pathways" },
    ],
  },
  {
    name: "University of Queensland",
    state: "QLD",
    pathway: "MD Provisional Entry",
    badge: "UCAT ANZ only",
    badgeTone: "from-fuchsia-100 to-violet-100 text-fuchsia-800 border-fuchsia-200",
    summary: "ISAT is not accepted for the provisional entry pathway.",
    bullets: [
      "School leaver pathway funnels into the MD later.",
      "Requires strong academics, UCAT ANZ and interview.",
      "Useful if you specifically want UQ and are targeting UCAT rather than ISAT.",
    ],
    links: [
      { label: "MD Provisional Entry", href: "https://study.uq.edu.au/admissions/doctor-medicine/provisional-entry" },
      { label: "Entry Requirements", href: "https://study.uq.edu.au/admissions/doctor-medicine/provisional-entry/entry-requirements" },
      { label: "Doctor of Medicine", href: "https://study.uq.edu.au/study-options/programs/doctor-medicine-5740" },
    ],
  },
  {
    name: "University of Adelaide",
    state: "SA",
    pathway: "Bachelor of Medical Studies / Doctor of Medicine",
    badge: "UCAT ANZ",
    badgeTone: "from-fuchsia-100 to-pink-100 text-fuchsia-800 border-fuchsia-200",
    summary: "UCAT ANZ required for international merit ranking.",
    bullets: [
      "Interview is the first ranking level.",
      "UCAT ANZ is the second ranking level.",
      "Academic performance is threshold plus tie-separation support.",
    ],
    links: [
      { label: "International Ranking Info", href: "https://future.ask.adelaide.edu.au/app/answers/detail/a_id/2115/~/medicine-merit-ranking-process-for-international-applicants" },
    ],
  },
  {
    name: "Curtin University",
    state: "WA",
    pathway: "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
    badge: "UCAT ANZ + Casper",
    badgeTone: "from-fuchsia-100 to-rose-100 text-fuchsia-800 border-fuchsia-200",
    summary: "Both are required in the year of application.",
    bullets: [
      "Casper is separate to UCAT and must also be completed.",
      "Good to plan timelines early because both tests have different booking cycles.",
      "Curtin does not use GAMSAT for this undergraduate route.",
    ],
    links: [
      { label: "MBBS Course Page", href: "https://www.curtin.edu.au/study/offering/course-ug-bachelor-of-medicine-bachelor-of-surgery--b-mbbs/" },
      { label: "International Students", href: "https://www.curtin.edu.au/study/international-students/" },
    ],
  },
  {
    name: "Newcastle / UNE Joint Medical Program",
    state: "NSW",
    pathway: "Joint Medical Program (JMP)",
    badge: "UCAT ANZ",
    badgeTone: "from-fuchsia-100 to-violet-100 text-fuchsia-800 border-fuchsia-200",
    summary: "Threshold changes yearly and is set by the JMP.",
    bullets: [
      "International applicants are eligible both onshore and offshore.",
      "Requires UCAT ANZ, direct JMP application, and usually UAC involvement depending on category.",
      "International closing dates can be earlier than domestic ones.",
    ],
    links: [
      { label: "International Applicants", href: "https://www.newcastle.edu.au/joint-medical-program/international-applicants" },
      { label: "How to Apply", href: "https://www.newcastle.edu.au/joint-medical-program/how-to-apply" },
      { label: "Key Dates", href: "https://www.newcastle.edu.au/joint-medical-program/how-to-apply/key-dates" },
    ],
  },
  {
    name: "University of Tasmania",
    state: "TAS",
    pathway: "Bachelor of Medical Science and Doctor of Medicine",
    badge: "UCAT ANZ",
    badgeTone: "from-fuchsia-100 to-violet-100 text-fuchsia-800 border-fuchsia-200",
    summary: "Required for all applicants including internationals.",
    bullets: [
      "UTAS does not conduct interviews for the medicine program.",
      "Always confirm current international application mechanics directly with the university.",
      "Good option for students wanting a non-interview selection model.",
    ],
    links: [
      { label: "Course Page", href: "https://www.utas.edu.au/courses/health/courses/h3x-bachelor-of-medical-science-and-doctor-of-medicine" },
    ],
  },
  {
    name: "Western Sydney University",
    state: "NSW",
    pathway: "Bachelor of Medical Research / Doctor of Medicine",
    badge: "UCAT ANZ",
    badgeTone: "from-fuchsia-100 to-violet-100 text-fuchsia-800 border-fuchsia-200",
    summary: "UCAT ANZ required; thresholds are not published in advance.",
    bullets: [
      "Check international eligibility carefully because pathways differ.",
      "Thresholds are set annually based on applicant performance.",
      "Important dates and applicant FAQs are especially useful here.",
    ],
    links: [
      { label: "MD Applicants", href: "https://www.westernsydney.edu.au/future/study/how-to-apply/md-applicants" },
      { label: "General Applicants", href: "https://www.westernsydney.edu.au/future/study/how-to-apply/md-applicants/general-applicants" },
      { label: "Important Dates", href: "https://www.westernsydney.edu.au/future/study/how-to-apply/md-applicants/important-dates-and-deadlines" },
      { label: "FAQ", href: "https://www.westernsydney.edu.au/future/study/how-to-apply/md-applicants/frequently-asked-questions" },
    ],
  },
  {
    name: "University of Notre Dame",
    state: "WA / NSW",
    pathway: "Assured Pathway to Medicine",
    badge: "UCAT ANZ or ISAT",
    badgeTone: "from-emerald-100 to-cyan-100 text-emerald-800 border-emerald-200",
    summary: "Notre Dame is one of the few with flexibility across ISAT and UCAT style pathways.",
    bullets: [
      "Good strategic flexibility if you want more than one test route.",
      "Always confirm campus-specific and pathway-specific international rules.",
      "Pathway details can differ between undergraduate and graduate-style structures.",
    ],
    links: [
      { label: "International Pathways to Medicine", href: "https://www.notredame.edu.au/study/international-students/international-pathways-medicine" },
    ],
  },
  {
    name: "Bond University",
    state: "QLD",
    pathway: "Bachelor of Medical Studies / Doctor of Medicine",
    badge: "No UCAT / No ISAT",
    badgeTone: "from-slate-100 to-zinc-100 text-slate-700 border-slate-200",
    summary: "Uses internal psychometric testing plus interview-based selection.",
    bullets: [
      "Private university fee structure is usually much higher.",
      "Strong option for applicants wanting a non-UCAT, non-ISAT route.",
      "Selection is heavily interview and profile driven.",
    ],
    links: [
      { label: "Medicine Program", href: "https://bond.edu.au/program/doctor-medicine" },
      { label: "Entry Requirements", href: "https://bond.edu.au/program/doctor-medicine#entry-requirements" },
    ],
  },
  {
    name: "James Cook University",
    state: "QLD",
    pathway: "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
    badge: "No UCAT",
    badgeTone: "from-slate-100 to-zinc-100 text-slate-700 border-slate-200",
    summary: "Interview plus holistic review, with strong rural and regional emphasis.",
    bullets: [
      "Known for focus on northern, rural and remote health.",
      "No UCAT requirement for this medicine pathway.",
      "Profile quality and fit matter a lot.",
    ],
    links: [
      { label: "Medicine and Surgery", href: "https://www.jcu.edu.au/courses/bachelor-of-medicine-bachelor-of-surgery" },
      { label: "International Students", href: "https://www.jcu.edu.au/applying-to-jcu/international/coursework/capped-courses" },
    ],
  },
];

const graduatePrograms: GraduateCard[] = [
  {
    name: "University of Melbourne",
    requirement: "GAMSAT / MCAT",
    summary: "International admissions use GPA plus GAMSAT or MCAT, with interview for shortlisted applicants.",
    links: [
      { label: "International Admissions Guide", href: "https://mdhs.unimelb.edu.au/__data/assets/pdf_file/0011/4859876/MD-DDS-DPT-OD_International-Admissions-Guide.pdf/_recache" },
    ],
  },
  {
    name: "University of Sydney",
    requirement: "GAMSAT or MCAT",
    summary: "International MD applicants can submit GAMSAT or MCAT and are assessed under the university's admissions guide.",
    links: [
      { label: "MD International Admissions Guide", href: "https://www.sydney.edu.au/content/dam/corporate/documents/faculty-of-medicine-and-health/md-dmd/md-international-admissions-guide.pdf" },
    ],
  },
  {
    name: "ANU",
    requirement: "GAMSAT or MCAT",
    summary: "Requires a completed or final-year bachelor degree. Interview weighting is very significant.",
    links: [
      { label: "International MChD", href: "https://science.anu.edu.au/study/how-apply/doctor-medicine-and-surgery-international" },
      { label: "Program Page", href: "https://programsandcourses.anu.edu.au/program/8950xmchd" },
    ],
  },
  {
    name: "Deakin University",
    requirement: "GAMSAT or MCAT",
    summary: "Interview invitations are based on a 50:50 combination of GPA and GAMSAT/MCAT.",
    links: [
      { label: "Doctor of Medicine for International Students", href: "https://www.deakin.edu.au/course/doctor-medicine-international" },
      { label: "Application Guide", href: "https://www.deakin.edu.au/faculty-of-health/school-of-medicine/study-with-us/doctor-of-medicine-application-guide-for-international-students" },
    ],
  },
  {
    name: "Flinders University",
    requirement: "GAMSAT or MCAT",
    summary: "Graduate-entry structure for internationals. Always verify current application cycle specifics directly with Flinders.",
    links: [
      { label: "Medicine Overview", href: "https://www.flinders.edu.au/study/courses/postgraduate-doctor-medicine" },
      { label: "International Students", href: "https://www.flinders.edu.au/international/apply/undergraduate-postgraduate-coursework" },
    ],
  },
  {
    name: "Macquarie University",
    requirement: "GAMSAT or MCAT",
    summary: "Onshore international applicants can submit GAMSAT; offshore applicants may submit MCAT or GAMSAT depending on residency status at application.",
    links: [
      { label: "MD Admissions Guide", href: "https://www.mq.edu.au/__data/assets/pdf_file/0003/1317603/MD-Macquarie-MD-International-Admissions-Guide-2026-Final.pdf" },
      { label: "Admissions, Policies & Key Dates", href: "https://www.mq.edu.au/faculty-of-medicine-health-and-human-sciences/macquarie-md/admission-key-dates-policies-and-compliance" },
    ],
  },
  {
    name: "University of Wollongong",
    requirement: "GAMSAT or MCAT + Casper + Interview",
    summary: "International applicants are additionally ranked for interview using Casper, then complete a live online MMI if invited.",
    links: [
      { label: "International Applicants", href: "https://www.uow.edu.au/study/doctor-of-medicine/international-applicants/" },
    ],
  },
];

const qualificationButtons = [
  "A-levels (UK)",
  "International Baccalaureate (IB)",
  "Canadian Provincial Certificates",
  "Indian CBSE / ISC",
  "Singapore-Cambridge A-levels",
  "HKDSE",
  "New Zealand NCEA",
  "US High School + SAT/AP (where applicable)",
  "Other international Year 12 equivalents",
];

const assessLinks = [
  { label: "VIC: VTAC", href: "https://vtac.edu.au/evidence/osquals" },
  { label: "NSW / ACT: UAC", href: "https://www.uac.edu.au/future-applicants/admission-criteria/overseas-qualifications" },
  { label: "QLD: QTAC", href: "https://www.qtac.edu.au/international-qualifications/" },
  { label: "SA / NT: SATAC", href: "https://www.satac.edu.au/undergraduate-admission-pathways-year-12-qualifications" },
  { label: "WA: TISC", href: "https://www.tisc.edu.au/static/international.tisc" },
];

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function ExternalButton({ href, label }: LinkItem) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white/80 px-3 py-2 text-sm font-medium text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50"
    >
      <span>{label}</span>
      <ExternalLink className="h-4 w-4" />
    </Link>
  );
}

function SoftCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("rounded-3xl border border-slate-200 bg-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur", className)}>
      {children}
    </div>
  );
}

export default function InternationalBlueprintPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("who");

  const activeIndex = useMemo(
    () => tabs.findIndex((tab) => tab.key === activeTab),
    [activeTab]
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.10),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f6f7fb_40%,#f8fafc_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
            Blueprint
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" />
            International admissions map
          </span>
        </div>

        <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-500" />
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-100 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-cyan-100 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                      International Blueprint
                    </h1>
                  </div>
                </div>
                <p className="text-sm leading-7 text-slate-600 sm:text-base">
                  Everything international students need to navigate Australian medical school admissions.
                  From ISAT to direct entry to graduate pathways.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto">
                {[
                  { icon: Globe, label: "Onshore + offshore" },
                  { icon: FileText, label: "Official links" },
                  { icon: Wallet, label: "Cost reality" },
                  { icon: GraduationCap, label: "Pathway clarity" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
                    <item.icon className="mb-2 h-4 w-4 text-indigo-600" />
                    <p className="text-xs font-semibold text-slate-700">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
                     

            <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-2 shadow-inner">
              <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                {tabs.map((tab, index) => {
                  const isActive = tab.key === activeTab;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={cx(
                        "relative overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold transition",
                        isActive
                          ? "bg-white text-slate-950 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
                          : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="tab-pill"
                          className="absolute inset-0 rounded-2xl border border-slate-200 bg-white"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <span className="hidden sm:inline text-xs text-slate-400">0{index + 1}</span>
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
                className="space-y-6"
              >
                {activeTab === "who" && <WhoAreYouSection />}
                {activeTab === "isat" && <ISATHubSection />}
                {activeTab === "school" && <SchoolLeaverSection />}
                {activeTab === "graduate" && <GraduateEntrySection />}
                {activeTab === "qualifications" && <QualificationsSection />}
              </motion.div>
            </AnimatePresence>

            <div className="rounded-[28px] border border-emerald-200 bg-linear-to-r from-emerald-50 to-white p-5 shadow-sm">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Why This Matters: The Financial Gap</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    The distinction between domestic and international is not just administrative. It changes your costs, test strategy, and family planning entirely.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <SoftCard className="border-emerald-200 bg-linear-to-br from-emerald-50 to-white p-5">
                  <p className="text-sm font-bold text-emerald-800">Domestic student (Citizen / PR)</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    <li>CSP place may be available</li>
                    <li>HECS-HELP loan can defer payment</li>
                    <li className="pt-2 text-3xl font-black text-emerald-700">~$10,000–$12,000/year</li>
                  </ul>
                </SoftCard>
                <SoftCard className="border-rose-200 bg-linear-to-br from-rose-50 to-white p-5">
                  <p className="text-sm font-bold text-rose-800">International student</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    <li>Full-fee place</li>
                    <li>No HECS access</li>
                    <li>Upfront or private finance required</li>
                    <li className="pt-2 text-3xl font-black text-rose-700">~$70,000–$100,000/year</li>
                  </ul>
                </SoftCard>
              </div>

              <div className="mt-4 rounded-3xl bg-slate-950 px-6 py-5 text-center text-white shadow-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Total cost difference over 5–6 years</p>
                <p className="mt-2 text-4xl font-black text-emerald-400">$400,000+</p>
                <p className="mt-2 text-sm text-slate-300">This difference can change decision-making completely.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WhoAreYouSection() {
  return (
    <div className="space-y-6">
      <SoftCard className="overflow-hidden border-indigo-200 bg-linear-to-r from-slate-950 via-indigo-950 to-slate-900 p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Before you read anything else on this page</h3>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-200">
              “International student” means different things in different contexts. Your fee status, eligibility, and application strategy depend entirely on which category you fall into. This is the most important page to understand first.
            </p>
          </div>
        </div>
      </SoftCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <SoftCard className="border-sky-200 p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-700">
                <Plane className="h-3.5 w-3.5" /> Category 1
              </div>
              <h3 className="text-2xl font-black tracking-tight">Offshore International Students</h3>
              <p className="mt-1 text-sm text-slate-500">Living outside Australia at time of application</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Who this is</p>
              <ul className="space-y-2 text-sm leading-6 text-slate-700">
                {[
                  "Not an Australian citizen or permanent resident.",
                  "Living outside Australia when applying.",
                  "Often applying directly from high school abroad.",
                  "May sit UCAT ANZ or ISAT depending on the university.",
                  "Pay full international tuition fees.",
                  "Do not compete for CSP places.",
                ].map((item) => (
                  <li key={item} className="flex gap-2"><ArrowRight className="mt-1 h-4 w-4 text-sky-500" />{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Key considerations</p>
              <ul className="space-y-2 text-sm leading-6 text-slate-700">
                {[
                  "Student Visa (Subclass 500) usually required.",
                  "English requirements commonly include IELTS Academic 7.0–7.5 overall depending on school.",
                  "Application portals often differ from domestic applicants.",
                  "Very limited international spots per university.",
                  "Tuition is commonly around $70,000–$100,000 per year.",
                  "School-by-school caps and policies apply.",
                ].map((item) => (
                  <li key={item} className="flex gap-2"><ArrowRight className="mt-1 h-4 w-4 text-indigo-500" />{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 rounded-[22px] border border-sky-200 bg-sky-50/70 p-5">
            <h4 className="font-bold text-slate-900">Entry Requirements Snapshot</h4>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <p className="font-semibold text-slate-800">Undergraduate direct entry</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  <li>Academic equivalent of ATAR 95+ depending on school</li>
                  <li>Chemistry often mandatory</li>
                  <li>IELTS Academic 7.0–7.5 overall typical minimum</li>
                  <li>UCAT ANZ or ISAT depending on school</li>
                  <li>A-levels, IB, Singapore A-levels, SAT/AP and other equivalents assessed school-by-school</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-800">Graduate entry</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  <li>Completed bachelor degree</li>
                  <li>Competitive GPA, often roughly around 5.0–6.5+ on a 7-point scale depending on school</li>
                  <li>GAMSAT for many schools, with some accepting MCAT</li>
                  <li>Interview usually required</li>
                  <li>Academic equivalency reviewed individually</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 font-semibold text-slate-900">Visa: Student Visa (Subclass 500)</p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>CoE required</li>
                <li>Proof of financial capacity</li>
                <li>OSHC required</li>
                <li>Genuine student requirement</li>
                <li>Work-hour limits can apply during semester</li>
              </ul>
            </div>
            <div className="rounded-[20px] border border-rose-200 bg-rose-50 p-4">
              <p className="mb-2 font-semibold text-rose-900">Fee structure</p>
              <ul className="space-y-2 text-sm text-rose-800">
                <li>Undergraduate medicine: roughly AUD $70,000–$85,000/year</li>
                <li>Graduate medicine: roughly AUD $70,000–$100,000/year</li>
                <li>Living expenses: often $25,000–$35,000/year+</li>
                <li>Plus visa fees, OSHC, travel and relocation costs</li>
                <li className="font-semibold">No HECS. No government subsidy.</li>
              </ul>
            </div>
          </div>
        </SoftCard>

        <div className="space-y-6">
          <SoftCard className="border-violet-200 p-6">
            <div className="mb-4">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-700">
                <Globe className="h-3.5 w-3.5" /> Category 2
              </div>
              <h3 className="text-2xl font-black tracking-tight">Onshore International Students</h3>
              <p className="mt-1 text-sm text-slate-500">Living or studying in Australia, but not a citizen or PR</p>
            </div>

            <div className="rounded-[20px] border border-violet-200 bg-violet-50/70 p-4 text-sm text-violet-900">
              <p className="font-bold">Critical point: read this first</p>
              <p className="mt-2 leading-7">
                Even if a student completed Year 11 and 12 in Australia and received an ATAR, if they are not an Australian citizen or permanent resident, they are generally still classified as international for fee and quota purposes.
              </p>
            </div>

            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Who this is</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  {[
                    "Student visa holder in Australia.",
                    "May have completed VCE, HSC, QCE or equivalent locally.",
                    "May hold an Australian ATAR.",
                    "Still usually classified as international for fee purposes.",
                    "Competes in international applicant pools.",
                    "Seat numbers are usually smaller than domestic pools.",
                  ].map((item) => (
                    <li key={item} className="flex gap-2"><ArrowRight className="mt-1 h-4 w-4 text-violet-500" />{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">UCAT + applications</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  {[
                    "May sit the same UCAT ANZ as domestic students.",
                    "But they still compete inside the international pool.",
                    "Cut-offs can differ from domestic applicants.",
                    "Graduate onshore internationals often need GAMSAT or MCAT instead.",
                    "Always confirm whether the school distinguishes onshore from offshore rules.",
                  ].map((item) => (
                    <li key={item} className="flex gap-2"><ArrowRight className="mt-1 h-4 w-4 text-indigo-500" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </SoftCard>

          <SoftCard className="border-amber-200 p-6">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Special Cases & Common Confusions</h3>
                <p className="mt-1 text-sm text-slate-500">NZ citizens, PR timing, and visa transitions</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[20px] border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
                <p className="font-bold">NZ New Zealand citizens</p>
                <p className="mt-2 leading-7">
                  NZ citizens are not automatically treated the same as Australian citizens. Fee status and CSP eligibility can depend on visa subclass, residency duration, and university policy. Some may be eligible for CSP and HECS, while others may still be treated as international.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <p className="font-bold text-slate-900">PR timing is critical</p>
                  <p className="mt-2 leading-7">
                    If permanent residency is obtained before accepting an offer, domestic classification may become possible depending on the institution. If PR is granted after starting the degree, fee status often does not change mid-degree.
                  </p>
                </div>
                <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <p className="font-bold text-slate-900">Transitioning visa status</p>
                  <p className="mt-2 leading-7">
                    Moving from student visa to PR during the course may alter future eligibility in some systems, but internship allocation and fee treatment do not automatically reset. Policies are state-based and can change year to year.
                  </p>
                </div>
              </div>

              <div className="rounded-[20px] border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900">
                <p className="font-bold">Critical: internship allocation for international graduates</p>
                <p className="mt-2 leading-7">
                  International medical graduates are not guaranteed an internship in Australia. Priority usually goes to domestic CSP students first, then domestic full-fee students, with international graduates later. This is one of the biggest strategic and financial risks to understand before committing.
                </p>
              </div>
            </div>
          </SoftCard>
        </div>
      </div>
    </div>
  );
}

function ISATHubSection() {
  return (
    <div className="space-y-6">
      <SoftCard className="border-violet-200 bg-linear-to-br from-violet-50 to-white p-6">
        <div className="max-w-4xl">
          <h3 className="text-xl font-black tracking-tight text-slate-950">ISAT Overview</h3>
          <p className="mt-1 text-sm text-slate-500">International Student Admissions Test — developed by ACER</p>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            ISAT is a 3-hour online multiple-choice reasoning test. It focuses on critical reasoning and quantitative reasoning. There is no negative marking. For some Australian medical schools, it is the primary admission test used by international school-leavers.
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <ExternalButton href="https://isat.acer.org/" label="ISAT Homepage" />
          <ExternalButton href="https://isat.acer.org/registration" label="Registration & Windows" />
          <ExternalButton href="https://isat.acer.org/files/isat-candidate-information-booklet.pdf" label="Candidate Information Booklet" />
        </div>
      </SoftCard>

      <SoftCard className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">2026 ISAT Test Windows</h3>
            <p className="text-sm text-slate-500">Typical windows used for planning. Always verify before booking.</p>
          </div>
        </div>

        <div className="space-y-3">
          {isatWindows.map((item) => (
            <div
              key={item.window}
              className="flex flex-col justify-between gap-3 rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center"
            >
              <p className="font-semibold text-slate-900">{item.window}</p>
              <span className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                {item.note}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[20px] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <span className="font-bold">Resit rule:</span> You may only sit ISAT again after 12 months from your previous sitting. Plan your window carefully.
        </div>
      </SoftCard>
    </div>
  );
}

function SchoolLeaverSection() {
  return (
    <div className="space-y-6">
      <SoftCard className="border-emerald-200 bg-emerald-50/70 p-5 text-sm text-emerald-950">
        <p>
          <span className="font-bold">School leaver / direct entry programs</span> accept international Year 12 equivalents such as A-levels, IB and related qualifications. These are undergraduate entry programs where you apply directly from school.
        </p>
      </SoftCard>

      <div className="space-y-5">
        {schoolLeaverPrograms.map((program, index) => (
          <SoftCard key={program.name} className="overflow-hidden p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-black tracking-tight text-slate-950">
                    {index + 1}. {program.name}
                  </h3>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
                    {program.state}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{program.pathway}</p>
                <p className="mt-4 text-lg font-semibold text-slate-900">{program.summary}</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {program.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-indigo-500" />{bullet}</li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-3">
                  {program.links.map((link) => (
                    <ExternalButton key={link.href} {...link} />
                  ))}
                </div>
              </div>

              <div
                className={cx(
                  "w-fit rounded-full border bg-linear-to-r px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] shadow-sm",
                  program.badgeTone
                )}
              >
                {program.badge}
              </div>
            </div>

            {program.spotlight && (
              <div className="mt-5 rounded-[20px] border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
                <p className="font-bold">Spotlight fact</p>
                <p className="mt-2 leading-7">{program.spotlight}</p>
              </div>
            )}
          </SoftCard>
        ))}
      </div>
    </div>
  );
}

function GraduateEntrySection() {
  return (
    <div className="space-y-6">
      <SoftCard className="border-violet-200 bg-violet-50/70 p-5 text-sm text-violet-950">
        <p>
          <span className="font-bold">Graduate entry programs</span> do not use A-levels or Year 12 results. They require a completed bachelor degree, a competitive GPA, an admissions test such as GAMSAT or MCAT, and usually an interview.
        </p>
      </SoftCard>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {graduatePrograms.map((program) => (
          <SoftCard key={program.name} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-950">{program.name}</h3>
                <p className="mt-1 text-sm font-semibold text-indigo-700">{program.requirement}</p>
              </div>
              <div className="rounded-2xl bg-indigo-50 p-2 text-indigo-700">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-700">{program.summary}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {program.links.map((link) => (
                <ExternalButton key={link.href} {...link} />
              ))}
            </div>
          </SoftCard>
        ))}
      </div>

      <SoftCard className="p-6">
        <h3 className="text-lg font-black tracking-tight text-slate-950">Not included or often misunderstood</h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {[
            "CDU domestic-only pathways",
            "CSU / WSU rural bonded pathways that are restricted to domestic applicants",
            "Griffith provisional entry — verify international eligibility before applying",
            "UniSQ feeder pathways — verify international eligibility before applying",
          ].map((item) => (
            <li key={item} className="flex gap-2"><ArrowRight className="mt-1 h-4 w-4 text-slate-400" />{item}</li>
          ))}
        </ul>
      </SoftCard>
    </div>
  );
}

function QualificationsSection() {
  const [selected, setSelected] = useState("Canadian Provincial Certificates");

  return (
    <div className="space-y-6">
      <SoftCard className="p-6">
        <h3 className="text-xl font-black tracking-tight text-slate-950">Supported Qualifications</h3>
        <p className="mt-1 text-sm text-slate-500">
          Most Australian medical schools accept a range of international secondary credentials for direct entry, but each university assesses equivalence individually.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {qualificationButtons.map((item) => {
            const active = selected === item;
            return (
              <button
                key={item}
                onClick={() => setSelected(item)}
                className={cx(
                  "rounded-2xl border px-4 py-2 text-sm font-medium transition",
                  active
                    ? "border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                )}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-[20px] border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-bold">Important notice on equivalencies</p>
          <p className="mt-2 leading-7">
            This page does not calculate ATAR equivalencies for international qualifications. Each university and tertiary admissions centre may assess international credentials differently. Use the official admissions office or TAC for a formal assessment.
          </p>
        </div>

        <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <h4 className="text-lg font-bold text-slate-950">How to get your qualification assessed</h4>
          <div className="mt-4 flex flex-wrap gap-3">
            {assessLinks.map((link) => (
              <ExternalButton key={link.href} {...link} />
            ))}
          </div>
        </div>
      </SoftCard>
    </div>
  );
}