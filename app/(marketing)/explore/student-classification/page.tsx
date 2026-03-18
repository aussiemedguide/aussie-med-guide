"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  Trees,
  Building2,
  Globe,
  Search,
  HeartPulse,
  Brain,
  Bone,
  Stethoscope,
  Baby,
  ShieldAlert,
  Syringe,
  Eye,
  ScanSearch,
  BadgePlus,
  Activity,
  ExternalLink,
  ChevronDown,
  GraduationCap,
  Plane,
  BadgeInfo,
  Compass,
  MapPinned,
} from "lucide-react";

type TabKey = "categories" | "careers";

type LinkItem = {
  label: string;
  href: string;
};

type StudentCategory = {
  id: string;
  title: string;
  icon: any;
  eyebrow: string;
  accent: string;
  border: string;
  soft: string;
  gradient: string;
  definition: string;
  bulletsA: string[];
  bulletsBTitle: string;
  bulletsB: string[];
  noteTitle: string;
  note: string;
  links: LinkItem[];
};

type Career = {
  id: string;
  title: string;
  icon: any;
  accent: string;
  bg: string;
  description: string;
  training: string;
  subspecialties: { name: string; detail: string }[];
  links: LinkItem[];
};

const tabs: { key: TabKey; label: string }[] = [
  { key: "categories", label: "Student Categories" },
  { key: "careers", label: "Medical Careers" },
];

const studentCategories: StudentCategory[] = [
  {
    id: "rural",
    title: "Rural Students",
    icon: Trees,
    eyebrow: "Talk about this first",
    accent: "text-emerald-800",
    border: "border-emerald-300",
    soft: "bg-emerald-50",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    definition:
      "Students classified as MM2–MM7 under the Modified Monash Model. This includes regional cities, rural towns, remote communities, and very remote areas. Eligibility depends on where you have lived during your schooling years and how each university defines evidence.",
    bulletsA: [
      "Usually requires 5+ consecutive or 10+ cumulative years in a rural area, though exact rules differ by university.",
      "Some universities assess only primary and secondary schooling years. Others can count additional periods.",
      "A rural pathway can lower cut-offs, open reserved places, and widen scholarship access.",
      "This category can be strategically huge, so evidence must be sorted early rather than in panic later.",
    ],
    bulletsBTitle: "Evidence usually needed",
    bulletsB: [
      "Statutory declaration from parent or guardian",
      "School reports with rural addresses",
      "Utility bills, lease records, or council rates notices",
      "Medicare, Centrelink, or other government documentation",
      "Some schools may ask for GP, community, or school confirmation letters",
    ],
    noteTitle: "Why this matters",
    note:
      "Rural status is not just a label. It can materially change competitiveness. Families who may qualify should verify it first, because it affects how realistic certain schools become.",
    links: [
      { label: "Modified Monash Model map", href: "https://www.health.gov.au/resources/apps-and-tools/health-workforce-locator/app" },
      { label: "Rural clinical training", href: "https://www.health.gov.au/our-work/rhmt" },
      { label: "National Rural Health Alliance", href: "https://www.ruralhealth.org.au/" },
    ],
  },
  {
    id: "metro",
    title: "Metropolitan Students",
    icon: Building2,
    eyebrow: "Largest competition pool",
    accent: "text-sky-800",
    border: "border-sky-300",
    soft: "bg-sky-50",
    gradient: "from-sky-500 via-indigo-500 to-violet-500",
    definition:
      "Students who have lived in major cities and metropolitan or large regional centres, often falling into MM1 classification. This is the most common applicant group and usually the most competitive pathway into medicine.",
    bulletsA: [
      "Typically the biggest applicant pool competing for limited places.",
      "Often faces the highest ATAR and UCAT pressure because the pool is so dense.",
      "Success usually depends on maximizing academics, test performance, and school selection strategy.",
      "A strong interstate lens can matter because competitiveness varies across universities and systems.",
    ],
    bulletsBTitle: "Key considerations",
    bulletsB: [
      "Maximise both ATAR and UCAT rather than relying on one score to rescue the other",
      "Think beyond only undergraduate entry — graduate pathways can be part of the long-term map",
      "Understand each state’s system and scaling rules before making assumptions",
      "Preference ordering matters more than many families realise",
    ],
    noteTitle: "Strategic angle",
    note:
      "Metropolitan students often assume all medical schools are equally realistic if the student is high-achieving. They are not. Good strategy is not just work harder. It is target better.",
    links: [
      { label: "UCAT ANZ", href: "https://www.ucat.edu.au/" },
      { label: "Study medicine in Australia", href: "https://medicaldeans.org.au/" },
      { label: "Admissions centre guide hub", href: "https://www.uac.edu.au/undergraduate" },
    ],
  },
  {
    id: "international",
    title: "International Students",
    icon: Globe,
    eyebrow: "Different fee system, different strategy",
    accent: "text-fuchsia-800",
    border: "border-fuchsia-300",
    soft: "bg-fuchsia-50",
    gradient: "from-fuchsia-500 via-violet-500 to-indigo-500",
    definition:
      "Students who are not Australian or New Zealand citizens and not Australian permanent residents, or who otherwise apply under international admissions rules. This usually means full-fee tuition, separate caps, and different admissions processes.",
    bulletsA: [
      "Usually pay full international tuition, often far above domestic costs.",
      "Seat numbers are smaller and sometimes processed through different admissions channels.",
      "English proficiency requirements may apply depending on schooling background and university rules.",
      "Qualifications often need to be converted or individually assessed against Australian equivalents.",
    ],
    bulletsBTitle: "Application considerations",
    bulletsB: [
      "Some schools use ISAT, some UCAT ANZ, some interviews, and some internal processes",
      "Tuition planning matters just as much as admissions strategy",
      "Onshore and offshore applicants can face different practical realities",
      "Always verify visa, eligibility, and internship implications early",
    ],
    noteTitle: "Reality check",
    note:
      "International students should not just ask “can I get in?” They should also ask “what does the full path cost, and what does post-graduation look like?” That is the real strategic frame.",
    links: [
      { label: "Study Australia", href: "https://www.studyaustralia.gov.au/" },
      { label: "Student visa information", href: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500" },
      { label: "Medical Deans school list", href: "https://medicaldeans.org.au/data/" },
    ],
  },
];

const careers: Career[] = [
  {
    id: "cardiology",
    title: "Cardiology",
    icon: HeartPulse,
    accent: "text-rose-600",
    bg: "bg-rose-50",
    description: "Diagnosis and treatment of heart and cardiovascular system disorders.",
    training: "6–7 years",
    subspecialties: [
      { name: "Interventional Cardiology", detail: "Angioplasty, stenting, and catheter-based procedures." },
      { name: "Electrophysiology", detail: "Heart rhythm disorders and pacemaker management." },
      { name: "Heart Failure & Transplant", detail: "Advanced failure management and transplant pathways." },
    ],
    links: [{ label: "Explore Cardiology", href: "https://litfl.com/ecg-library/" }],
  },
  {
    id: "gastro",
    title: "Gastroenterology",
    icon: Activity,
    accent: "text-amber-600",
    bg: "bg-amber-50",
    description: "Digestive system disorders involving the stomach, intestines, liver, and pancreas.",
    training: "6 years",
    subspecialties: [
      { name: "Hepatology", detail: "Liver disease, cirrhosis, and hepatitis-related care." },
      { name: "Inflammatory Bowel Disease", detail: "Long-term Crohn disease and ulcerative colitis management." },
      { name: "Therapeutic Endoscopy", detail: "Advanced endoscopic procedures and interventions." },
    ],
    links: [{ label: "Explore Gastroenterology", href: "https://www.giejournal.org/" }],
  },
  {
    id: "neurology",
    title: "Neurology",
    icon: Brain,
    accent: "text-violet-600",
    bg: "bg-violet-50",
    description: "Nervous system disorders involving the brain, spinal cord, and peripheral nerves.",
    training: "6 years",
    subspecialties: [
      { name: "Stroke Medicine", detail: "Acute stroke treatment and rehabilitation planning." },
      { name: "Epilepsy", detail: "Seizure disorders and long-term medication management." },
      { name: "Movement Disorders", detail: "Parkinson disease and related neurological conditions." },
    ],
    links: [{ label: "Explore Neurology", href: "https://neuroanatomy.ca/" }],
  },
  {
    id: "ortho",
    title: "Orthopaedic Surgery",
    icon: Bone,
    accent: "text-slate-700",
    bg: "bg-slate-100",
    description: "Musculoskeletal care involving bones, joints, ligaments, and tendons.",
    training: "8–9 years",
    subspecialties: [
      { name: "Joint Replacement", detail: "Hip and knee arthroplasty procedures." },
      { name: "Sports Medicine", detail: "Athletic injuries and arthroscopic surgery." },
      { name: "Spine Surgery", detail: "Surgical intervention for spinal disorders." },
    ],
    links: [{ label: "Explore Orthopaedics", href: "https://www.orthobullets.com/" }],
  },
  {
    id: "paeds",
    title: "Paediatrics",
    icon: Baby,
    accent: "text-blue-600",
    bg: "bg-blue-50",
    description: "Medical care for infants, children, and adolescents.",
    training: "6 years",
    subspecialties: [
      { name: "Neonatology", detail: "Premature and critically unwell newborn care." },
      { name: "Paediatric Cardiology", detail: "Heart conditions in babies and children." },
      { name: "Paediatric Emergency", detail: "Acute emergency care for young patients." },
    ],
    links: [{ label: "Explore Paediatrics", href: "https://dontforgetthebubbles.com" }],
  },
  {
    id: "psych",
    title: "Psychiatry",
    icon: Brain,
    accent: "text-indigo-600",
    bg: "bg-indigo-50",
    description: "Mental health care involving mood, behaviour, emotion, and severe psychiatric illness.",
    training: "5–6 years",
    subspecialties: [
      { name: "Child & Adolescent Psychiatry", detail: "Assessment and treatment for younger patients." },
      { name: "Forensic Psychiatry", detail: "Interface between psychiatry and the legal system." },
      { name: "Addiction Medicine", detail: "Substance use disorders and dependency treatment." },
    ],
    links: [{ label: "Explore Psychiatry", href: "https://psychscenehub.com/" }],
  },
  {
    id: "surgery",
    title: "General Surgery",
    icon: Stethoscope,
    accent: "text-rose-500",
    bg: "bg-rose-50",
    description: "Operative treatment of abdominal organs and many related surgical conditions.",
    training: "8 years",
    subspecialties: [
      { name: "Colorectal Surgery", detail: "Colon, rectum, and anus procedures." },
      { name: "Upper GI Surgery", detail: "Oesophagus, stomach, and small bowel surgery." },
      { name: "Breast & Endocrine Surgery", detail: "Breast, thyroid, and endocrine-focused procedures." },
    ],
    links: [{ label: "Explore General Surgery", href: "https://teachmesurgery.com/" }],
  },
  {
    id: "emergency",
    title: "Emergency Medicine",
    icon: ShieldAlert,
    accent: "text-orange-500",
    bg: "bg-orange-50",
    description: "Acute care for emergency and critical conditions across all age groups.",
    training: "5–6 years",
    subspecialties: [
      { name: "Paediatric Emergency", detail: "Emergency care tailored to children." },
      { name: "Toxicology", detail: "Poisoning and overdose management." },
      { name: "Retrieval Medicine", detail: "Pre-hospital and inter-hospital transfer medicine." },
    ],
    links: [{ label: "Explore Emergency Medicine", href: "https://litfl.com/" }],
  },
  {
    id: "anaesthetics",
    title: "Anaesthetics",
    icon: Syringe,
    accent: "text-cyan-600",
    bg: "bg-cyan-50",
    description: "Perioperative care, anaesthesia, pain management, and critical care support.",
    training: "5 years",
    subspecialties: [
      { name: "Cardiac Anaesthesia", detail: "Anaesthesia for major heart surgery." },
      { name: "Pain Medicine", detail: "Chronic and procedural pain management." },
      { name: "Intensive Care", detail: "Overlap with critical care environments and support." },
    ],
    links: [{ label: "Explore Anaesthetics", href: "https://derangedphysiology.com/" }],
  },
  {
    id: "ophthal",
    title: "Ophthalmology",
    icon: Eye,
    accent: "text-teal-600",
    bg: "bg-teal-50",
    description: "Eye disease, vision disorders, and ocular surgery.",
    training: "6 years",
    subspecialties: [
      { name: "Retinal Surgery", detail: "Vitreoretinal surgery and medical retina." },
      { name: "Cataract Surgery", detail: "Lens replacement and refractive procedures." },
      { name: "Oculoplastics", detail: "Eyelid and orbital surgery." },
    ],
    links: [{ label: "Explore Ophthalmology", href: "https://eyewiki.aao.org/" }],
  },
  {
    id: "derm",
    title: "Dermatology",
    icon: Sparkles,
    accent: "text-pink-600",
    bg: "bg-pink-50",
    description: "Skin, hair, and nail disorders including both medical and procedural care.",
    training: "4 years",
    subspecialties: [
      { name: "Skin Cancer Surgery", detail: "Melanoma and non-melanoma skin cancer treatment." },
      { name: "Paediatric Dermatology", detail: "Skin conditions in infants and children." },
      { name: "Immunology / Allergy Overlap", detail: "Immune-mediated skin conditions and inflammation." },
    ],
    links: [{ label: "Explore Dermatology", href: "https://dermnetnz.org/" }],
  },
  {
    id: "radiology",
    title: "Radiology",
    icon: ScanSearch,
    accent: "text-violet-600",
    bg: "bg-violet-50",
    description: "Medical imaging and image-guided diagnosis or intervention.",
    training: "5 years",
    subspecialties: [
      { name: "Interventional Radiology", detail: "Minimally invasive image-guided procedures." },
      { name: "Neuroradiology", detail: "Brain and spine imaging." },
      { name: "Musculoskeletal Radiology", detail: "Imaging of bones, joints, and sports injury patterns." },
    ],
    links: [{ label: "Explore Radiology", href: "https://radiopaedia.org/" }],
  },
  {
    id: "gp",
    title: "General Practice",
    icon: BadgePlus,
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
    description: "Community-based primary care treating a wide range of acute and chronic conditions.",
    training: "3–4 years",
    subspecialties: [
      { name: "Rural Generalist", detail: "Extended rural or remote practice with broader procedural scope." },
      { name: "Sports Medicine", detail: "Musculoskeletal and sports-focused primary care." },
      { name: "Addiction Medicine Overlap", detail: "Substance use and dependence management in the community." },
    ],
    links: [{ label: "Explore General Practice", href: "https://www.gpnotebook.com/" }],
  },
  {
    id: "oncology",
    title: "Oncology",
    icon: Activity,
    accent: "text-rose-600",
    bg: "bg-rose-50",
    description: "Cancer diagnosis and treatment including systemic therapy and multidisciplinary care.",
    training: "6 years",
    subspecialties: [
      { name: "Medical Oncology", detail: "Cancer treatment using systemic therapies and chemotherapy." },
      { name: "Radiation Oncology", detail: "Use of radiation to treat malignant disease." },
      { name: "Haematology", detail: "Blood cancers and related disorders." },
    ],
    links: [{ label: "Explore Oncology", href: "https://www.cancer.gov/" }],
  },
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

function SoftCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-[26px] border border-slate-200 bg-white/85 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur", className)}>
      {children}
    </div>
  );
}

export default function StudentClassificationPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("categories");
  const [openId, setOpenId] = useState<string>("rural");
  const [search, setSearch] = useState("");

  const filteredCareers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return careers;
    return careers.filter((career) => {
      const haystack = [
        career.title,
        career.description,
        career.training,
        ...career.subspecialties.map((s) => `${s.name} ${s.detail}`),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [search]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_right,rgba(168,85,247,0.08),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f6f7fb_42%,#f8fafc_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
            Explore · Student Classification
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            <Sparkles className="h-3.5 w-3.5" />
            Strategy first, labels second
          </span>
        </div>

        <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 via-sky-500 to-violet-500" />
          <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-sky-100 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-violet-100 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-4xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 to-sky-600 text-white shadow-lg shadow-sky-200">
                    <MapPinned className="h-6 w-6" />
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Understanding Student Classification</h1>
                </div>
                <p className="text-sm leading-7 text-slate-600 sm:text-base">
                  How universities categorise applicants, how that changes competitiveness, and what it actually means for your medical admissions strategy.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-2 shadow-inner">
              <div className="grid grid-cols-2 gap-2">
                {tabs.map((tab) => {
                  const isActive = tab.key === activeTab;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={cx(
                        "relative overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold transition",
                        isActive ? "bg-white text-slate-950 shadow-[0_8px_24px_rgba(15,23,42,0.08)]" : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="classification-tab-pill"
                          className="absolute inset-0 rounded-2xl border border-slate-200 bg-white"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
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
                className="mt-6"
              >
                {activeTab === "categories" ? (
                  <div className="space-y-5">
                    <SoftCard className="border-emerald-200 bg-linear-to-r from-emerald-50 via-white to-sky-50 p-5">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h2 className="text-xl font-black tracking-tight text-slate-950">The order matters</h2>
                          <p className="mt-1 text-sm leading-7 text-slate-700">
                            Start with rural, then metropolitan, then international. That order gives the clearest strategic picture because rural status can materially reshape competitiveness.
                          </p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                          <Compass className="h-4 w-4" />
                          Strategy sequence locked
                        </div>
                      </div>
                    </SoftCard>

                    <div className="space-y-4">
                      {studentCategories.map((category, index) => {
                        const Icon = category.icon;
                        const isOpen = openId === category.id;
                        return (
                          <SoftCard key={category.id} className={cx("overflow-hidden border-2", category.border)}>
                            <button
                              onClick={() => setOpenId(isOpen ? "" : category.id)}
                              className="w-full text-left"
                            >
                              <div className={cx("bg-linear-to-r px-5 py-5 text-white", category.gradient)}>
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                                      <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                      <div className="mb-2 flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90">
                                          {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
                                          {category.eyebrow}
                                        </span>
                                      </div>
                                      <h3 className="text-2xl font-black tracking-tight">{category.title}</h3>
                                    </div>
                                  </div>
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                                    <ChevronDown className={cx("h-5 w-5 transition", isOpen ? "rotate-180" : "rotate-0")} />
                                  </div>
                                </div>
                              </div>
                            </button>

                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.22 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-6">
                                    <div className="grid gap-6 xl:grid-cols-2">
                                      <div>
                                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Definition</p>
                                        <p className="text-sm leading-7 text-slate-700">{category.definition}</p>

                                        <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Core features</p>
                                        <ul className="space-y-2 text-sm leading-7 text-slate-700">
                                          {category.bulletsA.map((item) => (
                                            <li key={item} className="flex gap-2"><span className={cx("mt-2 h-2 w-2 rounded-full", category.soft)} />{item}</li>
                                          ))}
                                        </ul>
                                      </div>

                                      <div>
                                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{category.bulletsBTitle}</p>
                                        <ul className="space-y-2 text-sm leading-7 text-slate-700">
                                          {category.bulletsB.map((item) => (
                                            <li key={item} className="flex gap-2"><span className={cx("mt-2 h-2 w-2 rounded-full", category.soft)} />{item}</li>
                                          ))}
                                        </ul>

                                        <div className={cx("mt-6 rounded-[22px] border p-4", category.border, category.soft)}>
                                          <p className={cx("font-bold", category.accent)}>{category.noteTitle}</p>
                                          <p className="mt-2 text-sm leading-7 text-slate-700">{category.note}</p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-3">
                                      {category.links.map((link) => (
                                        <ExternalButton key={link.href} {...link} />
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </SoftCard>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search specialties or subspecialties..."
                        className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                      />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-2">
                      {filteredCareers.map((career) => {
                        const Icon = career.icon;
                        return (
                          <SoftCard key={career.id} className="p-6">
                            <div className="flex items-start gap-4">
                              <div className={cx("flex h-12 w-12 items-center justify-center rounded-2xl", career.bg)}>
                                <Icon className={cx("h-5 w-5", career.accent)} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-xl font-black tracking-tight text-slate-950">{career.title}</h3>
                                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                    Training: {career.training}
                                  </span>
                                </div>
                                <p className="mt-3 text-sm leading-7 text-slate-700">{career.description}</p>
                              </div>
                            </div>

                            <div className="mt-5">
                              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Subspecialties</p>
                              <div className="space-y-2">
                                {career.subspecialties.map((sub) => (
                                  <div key={sub.name} className="rounded-[18px] bg-slate-50 px-4 py-3">
                                    <p className="font-semibold text-slate-900">{sub.name}</p>
                                    <p className="mt-1 text-sm text-slate-600">{sub.detail}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                              {career.links.map((link) => (
                                <ExternalButton key={link.href} {...link} />
                              ))}
                            </div>
                          </SoftCard>
                        );
                      })}
                    </div>

                    {filteredCareers.length === 0 && (
                      <SoftCard className="p-8 text-center">
                        <p className="text-lg font-bold text-slate-950">No specialties matched that search.</p>
                        <p className="mt-2 text-sm text-slate-600">Try broader words like surgery, children, eye, brain, or emergency.</p>
                      </SoftCard>
                    )}

                    <div className="rounded-[28px] border border-amber-300 bg-linear-to-r from-amber-50 via-white to-orange-50 p-5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                          <BadgeInfo className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-slate-950">Important note — but make it cooler</h3>
                          <p className="mt-2 text-sm leading-7 text-slate-700">
                            No specialty exists in isolation. Every path still runs through medical school, internship, and later specialty training. Some careers look glamorous from the outside, but the better question is whether the work, patients, pace, and lifestyle actually fit the person. Choose a field for the day-to-day reality, not just the headline.
                          </p>
                          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm">
                            <GraduationCap className="h-4 w-4" />
                            Interest beats prestige in the long run
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
