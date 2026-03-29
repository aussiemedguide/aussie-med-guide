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
  BadgeInfo,
  Compass,
  MapPinned,
  Orbit,
  Users,
  ArrowRight,
  Microscope,
  HeartHandshake,
  Pill,
  Siren,
  ClipboardList,
  Hospital,
  Home,
  RefreshCw,
} from "lucide-react";

type TabKey = "categories" | "careers";
type CareerExplorerMode = "body" | "disease";

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

type TimelineStep = {
  label: string;
  detail: string;
  icon: any;
};

type BodyNode = {
  id: string;
  label: string;
  shortLabel: string;
  icon: any;
  accent: string;
  glow: string;
  position: string;
  lineTo: { x2: number; y2: number }[];
  specialistPositions: Record<string, string>;
  description: string;
  exampleCondition: string;
  whyItMatters: string;
  specialists: string[];
  teamwork: string[];
  links: LinkItem[];
  timeline: TimelineStep[];
};

type DiseasePathway = {
  id: string;
  title: string;
  shortTitle: string;
  systemHint: string;
  accent: string;
  bg: string;
  icon: any;
  summary: string;
  bodyNodeId: string;
  specialists: string[];
  whatHappens: string[];
  patientJourneyTitle: string;
  timeline: TimelineStep[];
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
    soft: "bg-emerald-200",
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
      {
        label: "Modified Monash Model map",
        href: "https://www.health.gov.au/resources/apps-and-tools/health-workforce-locator/app",
      },
      {
        label: "Rural clinical training",
        href: "https://www.health.gov.au/our-work/rhmt",
      },
      {
        label: "National Rural Health Alliance",
        href: "https://www.ruralhealth.org.au/",
      },
    ],
  },
  {
    id: "metro",
    title: "Metropolitan Students",
    icon: Building2,
    eyebrow: "Largest competition pool",
    accent: "text-sky-800",
    border: "border-sky-300",
    soft: "bg-sky-200",
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
    soft: "bg-fuchsia-200",
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
      {
        label: "Student visa information",
        href: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
      },
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
    icon: Microscope,
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

const bodyNodes: BodyNode[] = [
  {
    id: "brain",
    label: "Brain & Mind",
    shortLabel: "Brain",
    icon: Brain,
    accent: "text-violet-700",
    glow: "from-violet-500 via-indigo-500 to-sky-500",
    position: "top-[11.5%] left-1/2 -translate-x-1/2",
    lineTo: [
      { x2: 108, y2: 132 },
      { x2: 184, y2: 88 },
      { x2: 376, y2: 88 },
      { x2: 452, y2: 132 },
      { x2: 468, y2: 214 },
    ],
    specialistPositions: {
      neurology: "top-[12%] left-[7%]",
      psych: "top-[5%] left-[24%]",
      radiology: "top-[5%] right-[24%]",
      emergency: "top-[12%] right-[7%]",
      gp: "top-[25%] right-[4%]",
    },
    description:
      "The brain does not just connect to neurology. It touches mental health, emergency care, imaging, rehabilitation, and long-term support.",
    exampleCondition: "Stroke, epilepsy, concussion, depression, Parkinson disease",
    whyItMatters:
      "A patient with a brain-related issue may move through emergency medicine, radiology, neurology, psychiatry, rehabilitation, and GP follow-up.",
    specialists: ["neurology", "psych", "radiology", "emergency", "gp"],
    teamwork: [
      "ED stabilises the patient first",
      "Radiology helps identify the cause fast",
      "Neurology leads disease-specific management",
      "Psychiatry may support cognition, behaviour, or mood overlap",
      "GP coordinates ongoing care after discharge",
    ],
    timeline: [
      {
        label: "First signs appear",
        detail: "A patient may notice weakness, seizures, confusion, headaches, or behaviour change.",
        icon: Siren,
      },
      {
        label: "Urgent triage",
        detail: "Emergency teams decide what is time-critical and what cannot wait.",
        icon: ClipboardList,
      },
      {
        label: "Imaging and diagnosis",
        detail: "CT, MRI, or other tests help reveal the underlying problem.",
        icon: ScanSearch,
      },
      {
        label: "Specialist treatment",
        detail: "Neurology or psychiatry directs the main disease-specific plan.",
        icon: Brain,
      },
      {
        label: "Recovery and follow-up",
        detail: "The patient often needs rehab, medication review, and GP continuity.",
        icon: RefreshCw,
      },
    ],
    links: [
      { label: "Explore Neurology", href: "https://neuroanatomy.ca/" },
      { label: "Explore Psychiatry", href: "https://psychscenehub.com/" },
      { label: "Explore Radiology", href: "https://radiopaedia.org/" },
    ],
  },
  {
    id: "eyes",
    label: "Eyes & Vision",
    shortLabel: "Eyes",
    icon: Eye,
    accent: "text-teal-700",
    glow: "from-teal-500 via-cyan-500 to-sky-500",
    position: "top-[19%] left-[66.5%] -translate-x-1/2",
    lineTo: [
      { x2: 470, y2: 112 },
      { x2: 476, y2: 196 },
      { x2: 388, y2: 74 },
      { x2: 398, y2: 304 },
      { x2: 312, y2: 86 },
    ],
    specialistPositions: {
      ophthal: "top-[9%] right-[4%]",
      emergency: "top-[22%] right-[4%]",
      gp: "top-[38%] right-[10%]",
      radiology: "top-[4%] right-[21%]",
      neurology: "top-[6%] left-[52%]",
    },
    description:
      "Vision problems can sit in the eye itself, in the nervous system, or in broader systemic disease.",
    exampleCondition: "Cataracts, retinal detachment, acute vision loss, diabetic eye disease",
    whyItMatters:
      "Eye care is not isolated. GPs, ophthalmologists, neurologists, endocrinology-linked care, and emergency doctors may all intersect.",
    specialists: ["ophthal", "gp", "neurology", "emergency", "radiology"],
    teamwork: [
      "GP or optometry may be first contact",
      "Ophthalmology manages eye-specific disease",
      "Emergency handles acute red flags",
      "Neurology may assess brain-related visual symptoms",
      "Imaging helps when deeper causes are suspected",
    ],
    timeline: [
      {
        label: "Symptoms begin",
        detail: "Blurred vision, pain, flashes, floaters, or sudden visual loss may appear.",
        icon: Eye,
      },
      {
        label: "First assessment",
        detail: "The first job is sorting routine from urgent vision-threatening pathology.",
        icon: ClipboardList,
      },
      {
        label: "Eye or brain?",
        detail: "Clinicians work out whether the issue is local eye disease or a wider neurological/systemic problem.",
        icon: Brain,
      },
      {
        label: "Targeted specialist care",
        detail: "Ophthalmology, neurology, radiology, or emergency teams may step in depending on the pattern.",
        icon: Hospital,
      },
      {
        label: "Long-term management",
        detail: "Follow-up may include monitoring, surgery, chronic disease control, and GP care.",
        icon: Home,
      },
    ],
    links: [
      { label: "Explore Ophthalmology", href: "https://eyewiki.aao.org/" },
      { label: "Explore Emergency Medicine", href: "https://litfl.com/" },
    ],
  },
  {
    id: "heart",
    label: "Heart & Circulation",
    shortLabel: "Heart",
    icon: HeartPulse,
    accent: "text-rose-700",
    glow: "from-rose-500 via-pink-500 to-orange-400",
    position: "top-[37.5%] left-[49%] -translate-x-1/2",
    lineTo: [
      { x2: 94, y2: 282 },
      { x2: 162, y2: 222 },
      { x2: 406, y2: 226 },
      { x2: 470, y2: 282 },
      { x2: 446, y2: 358 },
    ],
    specialistPositions: {
      cardiology: "top-[32%] left-[4%]",
      radiology: "top-[20%] left-[18%]",
      anaesthetics: "top-[20%] right-[16%]",
      emergency: "top-[32%] right-[4%]",
      gp: "top-[46%] right-[8%]",
    },
    description:
      "Heart disease often requires immediate, procedural, imaging, chronic, and preventive care all at once.",
    exampleCondition: "Heart attack, arrhythmia, heart failure, congenital disease",
    whyItMatters:
      "A cardiac patient might meet ambulance staff, ED, cardiology, radiology, anaesthetics, surgery, rehab teams, and a GP.",
    specialists: ["cardiology", "emergency", "anaesthetics", "radiology", "gp"],
    teamwork: [
      "Emergency teams handle the acute phase",
      "Cardiology leads diagnosis and definitive medical care",
      "Radiology and imaging guide decisions",
      "Anaesthetics supports perioperative or procedural care",
      "GP manages prevention and long-term follow-up",
    ],
    timeline: [
      {
        label: "Acute symptoms",
        detail: "Chest pain, collapse, shortness of breath, or palpitations trigger urgent attention.",
        icon: Siren,
      },
      {
        label: "Rapid assessment",
        detail: "ECG, blood tests, and early triage help determine how dangerous the situation is.",
        icon: ClipboardList,
      },
      {
        label: "Imaging and intervention planning",
        detail: "Cardiology and imaging teams work out what the heart and vessels are doing.",
        icon: ScanSearch,
      },
      {
        label: "Definitive treatment",
        detail: "The patient may receive medication, procedures, stents, surgery, or intensive monitoring.",
        icon: HeartPulse,
      },
      {
        label: "Secondary prevention",
        detail: "Recovery depends on rehab, medication adherence, lifestyle change, and GP follow-up.",
        icon: Home,
      },
    ],
    links: [
      { label: "Explore Cardiology", href: "https://litfl.com/ecg-library/" },
      { label: "Explore Radiology", href: "https://radiopaedia.org/" },
    ],
  },
  {
    id: "lungs",
    label: "Emergency Chest Care",
    shortLabel: "Chest",
    icon: ShieldAlert,
    accent: "text-orange-700",
    glow: "from-orange-500 via-amber-500 to-yellow-400",
    position: "top-[34%] left-[57%]",
    lineTo: [
      { x2: 166, y2: 228 },
      { x2: 94, y2: 294 },
      { x2: 470, y2: 294 },
      { x2: 404, y2: 222 },
      { x2: 432, y2: 366 },
    ],
    specialistPositions: {
      radiology: "top-[20%] left-[19%]",
      emergency: "top-[35%] left-[4%]",
      cardiology: "top-[20%] right-[18%]",
      anaesthetics: "top-[34%] right-[4%]",
      gp: "top-[48%] right-[10%]",
    },
    description:
      "Chest symptoms can be respiratory, cardiac, infectious, traumatic, or anxiety-related. The initial team often has to sort that out rapidly.",
    exampleCondition: "Shortness of breath, chest trauma, collapse, sepsis",
    whyItMatters:
      "Not every patient arrives with a neat diagnosis. Emergency medicine is often the gateway that pulls the wider system together.",
    specialists: ["emergency", "radiology", "cardiology", "anaesthetics", "gp"],
    teamwork: [
      "ED triages the immediate risk",
      "Imaging clarifies what is happening",
      "Cardiology joins if the cause is cardiac",
      "Anaesthetics supports unstable or critical patients",
      "GP continues care after the crisis",
    ],
    timeline: [
      {
        label: "Presentation",
        detail: "A patient presents with shortness of breath, collapse, pain, or worsening illness.",
        icon: Siren,
      },
      {
        label: "Stabilisation",
        detail: "Emergency clinicians prioritise airway, breathing, circulation, and immediate danger.",
        icon: ShieldAlert,
      },
      {
        label: "Sorting the cause",
        detail: "The team works out whether it is trauma, infection, cardiac disease, clot, or something else.",
        icon: ScanSearch,
      },
      {
        label: "Escalation if needed",
        detail: "Critical illness may involve anaesthetics, procedures, advanced monitoring, or ICU-style support.",
        icon: Syringe,
      },
      {
        label: "Discharge or onward care",
        detail: "Some patients go home with follow-up, while others move deeper into hospital care.",
        icon: Hospital,
      },
    ],
    links: [
      { label: "Explore Emergency Medicine", href: "https://litfl.com/" },
      { label: "Explore Anaesthetics", href: "https://derangedphysiology.com/" },
    ],
  },
  {
    id: "gut",
    label: "Gut, Liver & Digestion",
    shortLabel: "Gut",
    icon: Activity,
    accent: "text-amber-700",
    glow: "from-amber-500 via-orange-500 to-rose-400",
    position: "top-[50%] left-1/2 -translate-x-1/2",
    lineTo: [
      { x2: 94, y2: 414 },
      { x2: 160, y2: 346 },
      { x2: 406, y2: 346 },
      { x2: 470, y2: 414 },
      { x2: 454, y2: 500 },
    ],
    specialistPositions: {
      gastro: "top-[51%] left-[4%]",
      surgery: "top-[38%] left-[18%]",
      radiology: "top-[38%] right-[18%]",
      oncology: "top-[51%] right-[4%]",
      gp: "top-[66%] right-[8%]",
    },
    description:
      "Digestive disease spans chronic care, procedures, surgery, cancer pathways, nutrition, and community follow-up.",
    exampleCondition: "IBD, liver disease, bowel obstruction, GI bleeding, pancreatitis",
    whyItMatters:
      "Gut problems often move between gastroenterology, general surgery, oncology, radiology, and primary care.",
    specialists: ["gastro", "surgery", "oncology", "radiology", "gp"],
    teamwork: [
      "GP identifies symptoms early",
      "Gastroenterology investigates medically",
      "Radiology supports diagnosis and intervention",
      "Surgery steps in when anatomy or emergency changes matter",
      "Oncology joins when cancer pathways appear",
    ],
    timeline: [
      {
        label: "Symptoms emerge",
        detail: "Pain, bleeding, weight loss, jaundice, altered bowels, or vomiting may start the journey.",
        icon: ClipboardList,
      },
      {
        label: "Work-up begins",
        detail: "Bloods, scans, scopes, and history-taking help localise the problem.",
        icon: ScanSearch,
      },
      {
        label: "Medical or surgical?",
        detail: "Teams work out whether the condition is best managed medically, procedurally, or surgically.",
        icon: Stethoscope,
      },
      {
        label: "Escalation if serious",
        detail: "Cancer pathways, bleeding emergencies, or bowel obstruction can rapidly involve multiple teams.",
        icon: Hospital,
      },
      {
        label: "Chronic follow-up",
        detail: "Many digestive disorders need long-term monitoring, flare management, and GP coordination.",
        icon: Home,
      },
    ],
    links: [
      { label: "Explore Gastroenterology", href: "https://www.giejournal.org/" },
      { label: "Explore General Surgery", href: "https://teachmesurgery.com/" },
    ],
  },
  {
    id: "skin",
    label: "Skin & Surface Disease",
    shortLabel: "Skin",
    icon: Sparkles,
    accent: "text-pink-700",
    glow: "from-pink-500 via-rose-500 to-fuchsia-500",
    position: "top-[44%] left-[30%]",
    lineTo: [
      { x2: 74, y2: 358 },
      { x2: 114, y2: 448 },
      { x2: 194, y2: 516 },
      { x2: 82, y2: 528 },
    ],
    specialistPositions: {
      derm: "top-[39%] left-[4%]",
      oncology: "top-[53%] left-[4%]",
      paeds: "top-[66%] left-[14%]",
      gp: "top-[70%] left-[4%]",
    },
    description:
      "Skin can be cosmetic, but it can also be immune, infectious, oncological, paediatric, or systemic.",
    exampleCondition: "Melanoma, eczema, psoriasis, severe rash, acne, skin infection",
    whyItMatters:
      "Dermatology overlaps with oncology, paediatrics, immunology-style thinking, and GP care more than people expect.",
    specialists: ["derm", "oncology", "gp", "paeds"],
    teamwork: [
      "GP often identifies and refers",
      "Dermatology leads specialist skin care",
      "Oncology joins for skin cancer pathways",
      "Paediatrics may be involved in childhood skin disease",
    ],
    timeline: [
      {
        label: "Visible change",
        detail: "A rash, lesion, pigment change, infection, or chronic irritation appears.",
        icon: Sparkles,
      },
      {
        label: "Pattern recognition",
        detail: "Clinicians look for clues suggesting inflammation, infection, cancer, or systemic disease.",
        icon: ClipboardList,
      },
      {
        label: "Focused referral",
        detail: "The patient may move to dermatology, oncology, paediatrics, or back to GP-led management.",
        icon: ArrowRight,
      },
      {
        label: "Treatment phase",
        detail: "Management may involve creams, systemic meds, biopsy, excision, or monitoring.",
        icon: Pill,
      },
      {
        label: "Ongoing review",
        detail: "Some conditions settle quickly, while others need long-term follow-up and prevention.",
        icon: RefreshCw,
      },
    ],
    links: [
      { label: "Explore Dermatology", href: "https://dermnetnz.org/" },
      { label: "Explore Oncology", href: "https://www.cancer.gov/" },
    ],
  },
  {
    id: "bones",
    label: "Bones, Joints & Movement",
    shortLabel: "Bones",
    icon: Bone,
    accent: "text-slate-700",
    glow: "from-slate-500 via-slate-400 to-zinc-400",
    position: "top-[67%] left-[42%]",
    lineTo: [
      { x2: 96, y2: 546 },
      { x2: 160, y2: 620 },
      { x2: 404, y2: 620 },
      { x2: 468, y2: 546 },
      { x2: 446, y2: 690 },
    ],
    specialistPositions: {
      emergency: "top-[67%] left-[4%]",
      ortho: "top-[78%] left-[18%]",
      radiology: "top-[78%] right-[18%]",
      anaesthetics: "top-[67%] right-[4%]",
      gp: "top-[87%] right-[8%]",
    },
    description:
      "Movement problems bring together surgery, imaging, sports medicine, rehabilitation, pain care, and general practice.",
    exampleCondition: "Fracture, ACL tear, arthritis, spine injury, sports trauma",
    whyItMatters:
      "Musculoskeletal care is heavily team-based. One injury may involve emergency, radiology, orthopaedics, anaesthetics, rehab, and GP.",
    specialists: ["ortho", "radiology", "emergency", "anaesthetics", "gp"],
    teamwork: [
      "ED handles the first presentation",
      "Radiology defines the injury clearly",
      "Orthopaedics plans operative or non-operative care",
      "Anaesthetics supports procedures and pain control",
      "GP helps with long-term recovery and re-entry to daily life",
    ],
    timeline: [
      {
        label: "Injury or degeneration",
        detail: "The problem may be acute trauma, sport-related injury, chronic wear, or inflammatory disease.",
        icon: Bone,
      },
      {
        label: "Assessment and imaging",
        detail: "The team identifies severity, instability, and whether urgent action is needed.",
        icon: ScanSearch,
      },
      {
        label: "Procedure decision",
        detail: "Some patients need surgery, while others need rehab, bracing, pain control, or time.",
        icon: Stethoscope,
      },
      {
        label: "Operative support",
        detail: "Anaesthetics and theatre teams may become central if surgery is required.",
        icon: Syringe,
      },
      {
        label: "Rehabilitation",
        detail: "Recovery often takes longer than the diagnosis, which is why continuity matters.",
        icon: RefreshCw,
      },
    ],
    links: [
      { label: "Explore Orthopaedics", href: "https://www.orthobullets.com/" },
      { label: "Explore Radiology", href: "https://radiopaedia.org/" },
    ],
  },
  {
    id: "whole-person",
    label: "Whole Person Care",
    shortLabel: "Whole person",
    icon: HeartHandshake,
    accent: "text-emerald-700",
    glow: "from-emerald-500 via-teal-500 to-sky-500",
    position: "top-[82%] left-1/2 -translate-x-1/2",
    lineTo: [
      { x2: 112, y2: 690 },
      { x2: 188, y2: 736 },
      { x2: 376, y2: 736 },
      { x2: 452, y2: 690 },
      { x2: 470, y2: 610 },
    ],
    specialistPositions: {
      gp: "top-[88%] left-[6%]",
      paeds: "top-[91%] left-[24%]",
      psych: "top-[91%] right-[24%]",
      oncology: "top-[88%] right-[6%]",
      emergency: "top-[75%] right-[4%]",
    },
    description:
      "Not every patient fits into one organ system. A lot of medicine is coordination, continuity, and seeing the person rather than just the pathology.",
    exampleCondition: "Chronic disease, multimorbidity, cancer journey, child development, recovery after hospital",
    whyItMatters:
      "This is where students start to understand that medicine is not separate silos. It is a network built around patients.",
    specialists: ["gp", "paeds", "oncology", "psych", "emergency"],
    teamwork: [
      "GP anchors continuity",
      "Paediatrics leads child-centred care when relevant",
      "Oncology coordinates long cancer pathways",
      "Psychiatry supports mental health impacts",
      "Emergency may enter during acute deterioration",
    ],
    timeline: [
      {
        label: "Complex needs build up",
        detail: "Many patients do not have one issue. They have multiple conditions, medications, and priorities.",
        icon: Users,
      },
      {
        label: "Coordination becomes central",
        detail: "The challenge becomes not just treatment, but connecting the right teams at the right time.",
        icon: HeartHandshake,
      },
      {
        label: "Hospital and community meet",
        detail: "Care moves back and forth between inpatient, outpatient, and community settings.",
        icon: Hospital,
      },
      {
        label: "Mental and social dimensions matter",
        detail: "Psychological, family, developmental, or financial impacts often shape outcomes.",
        icon: Brain,
      },
      {
        label: "Continuity protects the patient",
        detail: "Good medicine is often about safe handover, review, follow-up, and long-term trust.",
        icon: Home,
      },
    ],
    links: [
      { label: "Explore General Practice", href: "https://www.gpnotebook.com/" },
      { label: "Explore Paediatrics", href: "https://dontforgetthebubbles.com" },
      { label: "Explore Psychiatry", href: "https://psychscenehub.com/" },
    ],
  },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ExternalButton({ href, label }: LinkItem) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm font-medium text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50"
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
    <div
      className={cx(
        "rounded-3xl border border-slate-200 bg-white/90 shadow-lg shadow-slate-200/60 backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

function TeamPill({
  career,
  isActive = false,
  onClick,
}: {
  career: Career;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const Icon = career.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold shadow-sm transition",
        isActive
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-slate-300"
      )}
    >
      <span
        className={cx(
          "flex h-8 w-8 items-center justify-center rounded-full",
          isActive ? "bg-white/15" : career.bg
        )}
      >
        <Icon className={cx("h-4 w-4", isActive ? "text-white" : career.accent)} />
      </span>
      <span>{career.title}</span>
    </button>
  );
}

function TimelineRail({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.label} className="relative flex gap-4">
            <div className="relative flex w-10 shrink-0 justify-center">
              <div className="z-10 flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <Icon className="h-4 w-4 text-slate-700" />
              </div>
              {!isLast && <div className="absolute top-10 h-[calc(100%+14px)] w-px bg-slate-200" />}
            </div>

            <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5">
              <p className="font-semibold text-slate-900">{step.label}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{step.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BodyNodeMobileSelector({
  activeNode,
  onSelectNode,
}: {
  activeNode: BodyNode;
  onSelectNode: (id: string) => void;
}) {
  return (
    <div className="sm:hidden">
      <div className="mb-3 rounded-2xl border border-slate-200 bg-white/92 p-3 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Select view
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-900">
          Tap a body area below to update the card
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {bodyNodes.map((node) => {
          const Icon = node.icon;
          const isActive = activeNode.id === node.id;

          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelectNode(node.id)}
              className={cx(
                "rounded-2xl border px-2 py-3 text-center shadow-sm transition",
                isActive
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700"
              )}
            >
              <div
                className={cx(
                  "mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full",
                  isActive ? "bg-white/15" : "bg-slate-100"
                )}
              >
                <Icon className={cx("h-4 w-4", isActive ? "text-white" : node.accent)} />
              </div>
              <span className="block text-[11px] font-bold uppercase tracking-[0.12em]">
                {node.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BodyIllustration({
  activeNode,
  onSelectNode,
}: {
  activeNode: BodyNode;
  onSelectNode: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <BodyNodeMobileSelector activeNode={activeNode} onSelectNode={onSelectNode} />

      <div className="relative mx-auto hidden aspect-4/5 w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-b from-slate-50 via-white to-slate-100 sm:block sm:max-w-180">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.10),transparent_26%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.08),transparent_24%)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/70 to-transparent" />

        <div className="absolute left-4 top-4 rounded-2xl border border-slate-200 bg-white/88 px-4 py-3 shadow-sm backdrop-blur">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Selected focus
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{activeNode.label}</p>
        </div>

        <div className="absolute right-4 top-4 rounded-2xl border border-slate-200 bg-white/88 px-4 py-3 shadow-sm backdrop-blur">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            View
          </p>
          <div className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
            <Orbit className="h-4 w-4" />
            Team-based map
          </div>
        </div>

        <div className="absolute left-1/2 top-[11%] h-24 w-24 -translate-x-1/2 rounded-full border border-slate-300 bg-white shadow-md" />
        <div className="absolute left-1/2 top-[22%] h-53 w-37.5 -translate-x-1/2 rounded-[84px] border border-slate-300 bg-white shadow-md" />
        <div className="absolute left-[31%] top-[25%] h-43.5 w-9 rounded-full border border-slate-300 bg-white shadow-sm" />
        <div className="absolute right-[31%] top-[25%] h-43.5 w-9 rounded-full border border-slate-300 bg-white shadow-sm" />
        <div className="absolute left-[39.5%] top-[49%] h-56.25 w-10 rounded-full border border-slate-300 bg-white shadow-sm" />
        <div className="absolute right-[39.5%] top-[49%] h-56.25 w-10 rounded-full border border-slate-300 bg-white shadow-sm" />

        <div className="absolute left-1/2 top-[25%] h-77.5 w-1 -translate-x-1/2 rounded-full bg-linear-to-b from-sky-300 via-violet-300 to-slate-300 opacity-70" />
        <div className="absolute left-1/2 top-[24%] h-70.5 w-38.5 -translate-x-1/2 rounded-[90px] border border-dashed border-slate-200" />
        <div className="absolute left-1/2 top-[58%] h-46.5 w-30.5 -translate-x-1/2 rounded-[64px] border border-dashed border-slate-200" />

        <div className="absolute left-1/2 top-[14%] h-28 w-28 -translate-x-1/2 rounded-full bg-violet-100 blur-3xl opacity-60" />
        <div className="absolute left-1/2 top-[37%] h-32 w-32 -translate-x-1/2 rounded-full bg-rose-100 blur-3xl opacity-55" />
        <div className="absolute left-1/2 top-[54%] h-36 w-36 -translate-x-1/2 rounded-full bg-amber-100 blur-3xl opacity-45" />
        <div className="absolute left-[18%] top-[56%] h-28 w-28 rounded-full bg-pink-100 blur-3xl opacity-35" />
        <div className="absolute right-[18%] top-[70%] h-28 w-28 rounded-full bg-cyan-100 blur-3xl opacity-30" />

        <div className="absolute left-[9%] top-[29%] hidden rounded-2xl border border-slate-200 bg-white/85 px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur md:block">
          Multiple teams,
          <br />
          one patient
        </div>

        <div className="absolute right-[9%] top-[58%] hidden rounded-2xl border border-slate-200 bg-white/85 px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur md:block">
          Click the body
          <br />
          to shift focus
        </div>

        {bodyNodes.map((node) => {
          const Icon = node.icon;
          const isActive = activeNode.id === node.id;

          return (
            <button
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              className={cx("absolute z-20 transition", node.position)}
              aria-label={node.label}
              type="button"
            >
              <motion.div
                animate={isActive ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className={cx(
                    "relative flex h-12 w-12 items-center justify-center rounded-full border text-white shadow-lg md:h-14 md:w-14",
                    isActive
                      ? "border-white bg-slate-900"
                      : "border-white/80 bg-slate-700 hover:bg-slate-900"
                  )}
                >
                  <span
                    className={cx(
                      "absolute inset-0 rounded-full bg-linear-to-r opacity-80 blur-md",
                      node.glow
                    )}
                  />
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 md:h-14 md:w-14">
                    <Icon className="h-4 w-4 md:h-5 md:w-5" />
                  </span>
                </div>

                <div
                  className={cx(
                    "rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] shadow-sm transition md:px-3 md:text-[11px] md:tracking-[0.18em]",
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white/95 text-slate-700"
                  )}
                >
                  {node.shortLabel}
                </div>
              </motion.div>
            </button>
          );
        })}

        <div className="absolute bottom-4 left-4 right-4 rounded-3xl border border-slate-200 bg-white/92 p-4 shadow-lg backdrop-blur">
          <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Orbit className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-950">
                  Click a body area to reveal the connected specialties
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  The goal is not isolated prestige. It is seeing how one real patient moves through a network of teams.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Focus now
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{activeNode.shortLabel}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Teams linked
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{activeNode.specialists.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/92 p-3 shadow-sm sm:hidden">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Focus now
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{activeNode.shortLabel}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Teams linked
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{activeNode.specialists.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeToggle({
  mode,
  setMode,
}: {
  mode: CareerExplorerMode;
  setMode: (mode: CareerExplorerMode) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-2 shadow-inner">
      <div className="grid grid-cols-2 gap-2">
        {[
          { key: "body", label: "Explore by Body" },
          { key: "disease", label: "Explore by Disease" },
        ].map((item) => {
          const isActive = item.key === mode;

          return (
            <button
              key={item.key}
              onClick={() => setMode(item.key as CareerExplorerMode)}
              className={cx(
                "relative overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold transition",
                isActive
                  ? "bg-white text-slate-950 shadow-lg shadow-slate-200/60"
                  : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
              )}
              type="button"
            >
              {isActive && (
                <motion.span
                  layoutId="career-mode-pill"
                  className="absolute inset-0 rounded-2xl border border-slate-200 bg-white"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
const diseasePathways: DiseasePathway[] = [
  {
    id: "stroke",
    title: "Stroke Pathway",
    shortTitle: "Stroke",
    systemHint: "Brain & Mind",
    accent: "text-violet-700",
    bg: "bg-violet-50",
    icon: Brain,
    summary:
      "Stroke is a strong example of time-critical, highly coordinated care. Minutes matter, and multiple teams move quickly together.",
    bodyNodeId: "brain",
    specialists: ["emergency", "radiology", "neurology", "anaesthetics", "gp"],
    whatHappens: [
      "Emergency clinicians recognise time-critical neurological red flags",
      "Radiology helps distinguish bleeding from blockage fast",
      "Neurology guides acute treatment decisions",
      "Anaesthetics may support airway, procedures, or critical care escalation",
      "GP and rehab-linked follow-up matter after discharge",
    ],
    patientJourneyTitle: "What a stroke journey can look like",
    timeline: [
      {
        label: "Sudden symptoms",
        detail: "Weakness, facial droop, speech problems, or collapse start abruptly.",
        icon: Siren,
      },
      {
        label: "Ambulance / ED arrival",
        detail: "The patient is triaged rapidly because treatment windows are tight.",
        icon: ShieldAlert,
      },
      {
        label: "Urgent brain imaging",
        detail: "CT or other imaging helps determine what type of stroke this is.",
        icon: ScanSearch,
      },
      {
        label: "Acute specialist management",
        detail: "The patient may receive clot-busting therapy, transfer, monitoring, or procedures.",
        icon: Brain,
      },
      {
        label: "Recovery and prevention",
        detail: "Rehab, medication, and long-term vascular prevention become central.",
        icon: RefreshCw,
      },
    ],
    links: [
      { label: "Explore Neurology", href: "https://neuroanatomy.ca/" },
      { label: "Explore Emergency Medicine", href: "https://litfl.com/" },
    ],
  },
  {
    id: "heart-attack",
    title: "Heart Attack Pathway",
    shortTitle: "Heart attack",
    systemHint: "Heart & Circulation",
    accent: "text-rose-700",
    bg: "bg-rose-50",
    icon: HeartPulse,
    summary:
      "A heart attack shows how emergency medicine, cardiology, imaging, and prevention link together in one patient journey.",
    bodyNodeId: "heart",
    specialists: ["emergency", "cardiology", "radiology", "anaesthetics", "gp"],
    whatHappens: [
      "Emergency teams stabilise and recognise the pattern early",
      "Cardiology directs definitive treatment and procedural decisions",
      "Imaging and ECG interpretation shape urgency",
      "Anaesthetics may support more unstable or procedural patients",
      "GP follow-up helps prevent the next event",
    ],
    patientJourneyTitle: "What a heart attack journey can look like",
    timeline: [
      {
        label: "Chest pain or collapse",
        detail: "The patient experiences red-flag symptoms that trigger urgent care.",
        icon: Siren,
      },
      {
        label: "Rapid ED assessment",
        detail: "ECG, monitoring, and blood tests begin straight away.",
        icon: ClipboardList,
      },
      {
        label: "Coronary diagnosis",
        detail: "The team works out whether there is ongoing heart muscle damage.",
        icon: HeartPulse,
      },
      {
        label: "Intervention",
        detail: "Some patients need urgent angiography, stenting, or higher-level monitoring.",
        icon: Hospital,
      },
      {
        label: "Rehab and prevention",
        detail: "Medication, exercise, risk-factor management, and GP continuity reduce recurrence.",
        icon: Home,
      },
    ],
    links: [
      { label: "Explore Cardiology", href: "https://litfl.com/ecg-library/" },
      { label: "Explore Radiology", href: "https://radiopaedia.org/" },
    ],
  },
  {
    id: "appendicitis",
    title: "Appendicitis Pathway",
    shortTitle: "Appendicitis",
    systemHint: "Gut, Liver & Digestion",
    accent: "text-amber-700",
    bg: "bg-amber-50",
    icon: Activity,
    summary:
      "Appendicitis is a clean example of how symptoms, imaging, surgery, anaesthetics, and recovery work together.",
    bodyNodeId: "gut",
    specialists: ["gp", "emergency", "radiology", "surgery", "anaesthetics"],
    whatHappens: [
      "A patient may start in the community or present directly to ED",
      "Emergency and imaging teams sort likely causes of abdominal pain",
      "General surgery decides whether operative management is needed",
      "Anaesthetics supports theatre and perioperative care",
      "Follow-up focuses on recovery and complication recognition",
    ],
    patientJourneyTitle: "What an appendicitis journey can look like",
    timeline: [
      {
        label: "Pain begins",
        detail: "Abdominal pain often starts vaguely and then localises.",
        icon: ClipboardList,
      },
      {
        label: "Assessment",
        detail: "Clinicians check tenderness, fever, blood tests, and the wider differential.",
        icon: Stethoscope,
      },
      {
        label: "Imaging if needed",
        detail: "Scans help confirm the diagnosis or exclude other causes.",
        icon: ScanSearch,
      },
      {
        label: "Surgery",
        detail: "The patient may head to theatre if the appendix is inflamed or perforated.",
        icon: Hospital,
      },
      {
        label: "Discharge and recovery",
        detail: "Pain control, wound care, and return precautions matter after the procedure.",
        icon: Home,
      },
    ],
    links: [
      { label: "Explore General Surgery", href: "https://teachmesurgery.com/" },
      { label: "Explore Anaesthetics", href: "https://derangedphysiology.com/" },
    ],
  },
  {
    id: "melanoma",
    title: "Melanoma Pathway",
    shortTitle: "Melanoma",
    systemHint: "Skin & Surface Disease",
    accent: "text-pink-700",
    bg: "bg-pink-50",
    icon: Sparkles,
    summary:
      "Melanoma shows that skin medicine can move from GP review to dermatology, surgery, oncology, and long-term surveillance.",
    bodyNodeId: "skin",
    specialists: ["gp", "derm", "surgery", "oncology"],
    whatHappens: [
      "A suspicious lesion is often first noticed in the community",
      "Dermatology helps define whether the lesion is benign or dangerous",
      "Surgery may remove or stage the lesion",
      "Oncology becomes relevant in more advanced disease",
      "Long-term surveillance matters even after treatment",
    ],
    patientJourneyTitle: "What a melanoma journey can look like",
    timeline: [
      {
        label: "Skin change noticed",
        detail: "A mole changes in colour, border, size, or behaviour.",
        icon: Sparkles,
      },
      {
        label: "Primary review",
        detail: "GP or skin-focused assessment raises suspicion and prompts referral or biopsy.",
        icon: BadgePlus,
      },
      {
        label: "Diagnostic confirmation",
        detail: "The lesion is examined more closely and pathology guides next steps.",
        icon: ClipboardList,
      },
      {
        label: "Definitive treatment",
        detail: "Excision, further surgery, staging, or oncology review may follow.",
        icon: Hospital,
      },
      {
        label: "Surveillance",
        detail: "Monitoring for recurrence or new lesions becomes part of the long-term plan.",
        icon: RefreshCw,
      },
    ],
    links: [
      { label: "Explore Dermatology", href: "https://dermnetnz.org/" },
      { label: "Explore Oncology", href: "https://www.cancer.gov/" },
    ],
  },
  {
    id: "acl-tear",
    title: "ACL Tear Pathway",
    shortTitle: "ACL tear",
    systemHint: "Bones, Joints & Movement",
    accent: "text-slate-700",
    bg: "bg-slate-100",
    icon: Bone,
    summary:
      "An ACL injury helps students see how sports trauma is not just surgery. It involves imaging, decision-making, rehab, and return-to-life planning.",
    bodyNodeId: "bones",
    specialists: ["gp", "emergency", "radiology", "ortho", "anaesthetics"],
    whatHappens: [
      "The first concern is ruling out major instability or associated injury",
      "Imaging helps define the ligament injury and related damage",
      "Orthopaedics or sports-focused clinicians guide management",
      "Some patients need reconstruction while others do not",
      "Recovery is often longer and more demanding than the injury moment itself",
    ],
    patientJourneyTitle: "What an ACL injury journey can look like",
    timeline: [
      {
        label: "Injury event",
        detail: "The patient twists, hears a pop, and develops swelling or instability.",
        icon: Bone,
      },
      {
        label: "Initial assessment",
        detail: "The team checks weight-bearing, pain, and whether there are urgent associated injuries.",
        icon: ClipboardList,
      },
      {
        label: "Imaging and diagnosis",
        detail: "MRI or other assessment clarifies the ligament damage and surrounding structures.",
        icon: ScanSearch,
      },
      {
        label: "Treatment plan",
        detail: "The patient may choose rehab-first care or surgery depending on goals and instability.",
        icon: Stethoscope,
      },
      {
        label: "Rehabilitation journey",
        detail: "Return to sport or function depends on disciplined rehab and review over time.",
        icon: RefreshCw,
      },
    ],
    links: [
      { label: "Explore Orthopaedics", href: "https://www.orthobullets.com/" },
      { label: "Explore Radiology", href: "https://radiopaedia.org/" },
    ],
  },
];

export default function StudentClassificationPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("categories");
  const [openId, setOpenId] = useState<string>("rural");
  const [search, setSearch] = useState("");
  const [careerMode, setCareerMode] = useState<CareerExplorerMode>("body");
  const [activeNodeId, setActiveNodeId] = useState<string>("heart");
  const [activeCareerId, setActiveCareerId] = useState<string>("cardiology");
  const [activeDiseaseId, setActiveDiseaseId] = useState<string>("stroke");

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

  const activeNode = bodyNodes.find((node) => node.id === activeNodeId) ?? bodyNodes[0];
  const activeDisease =
    diseasePathways.find((disease) => disease.id === activeDiseaseId) ?? diseasePathways[0];

  const linkedCareers = careers.filter((career) => activeNode.specialists.includes(career.id));
  const activeCareer =
    careers.find(
      (career) => career.id === activeCareerId && activeNode.specialists.includes(career.id)
    ) ??
    linkedCareers[0] ??
    null;

  const diseaseLinkedCareers = careers.filter((career) =>
    activeDisease.specialists.includes(career.id)
  );

  const handleSelectNode = (nodeId: string) => {
    setActiveNodeId(nodeId);
    const node = bodyNodes.find((item) => item.id === nodeId);
    if (node?.specialists?.[0]) {
      setActiveCareerId(node.specialists[0]);
    }
  };

  const handleSelectDisease = (diseaseId: string) => {
    setActiveDiseaseId(diseaseId);
    const disease = diseasePathways.find((item) => item.id === diseaseId);
    if (disease?.bodyNodeId) {
      setActiveNodeId(disease.bodyNodeId);
    }
  };

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

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-2xl shadow-slate-200/60 backdrop-blur sm:p-6 lg:p-8">
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
                  <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                    Understanding Student Classification
                  </h1>
                </div>
                <p className="text-sm leading-7 text-slate-600 sm:text-base">
                  How universities categorise applicants, how that changes competitiveness, and what it
                  actually means for your medical admissions strategy.
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
                        "relative overflow-hidden rounded-2xl px-3 py-3 text-sm font-semibold transition sm:px-4",
                        isActive
                          ? "bg-white text-slate-950 shadow-lg shadow-slate-200/60"
                          : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                      )}
                      type="button"
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
                          <h2 className="text-xl font-black tracking-tight text-slate-950">
                            The order matters
                          </h2>
                          <p className="mt-1 text-sm leading-7 text-slate-700">
                            Start with rural, then metropolitan, then international. That order gives the
                            clearest strategic picture because rural status can materially reshape
                            competitiveness.
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
                              type="button"
                            >
                              <div className={cx("bg-linear-to-r px-4 py-5 text-white sm:px-5", category.gradient)}>
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
                                      <h3 className="text-xl font-black tracking-tight sm:text-2xl">
                                        {category.title}
                                      </h3>
                                    </div>
                                  </div>
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                                    <ChevronDown
                                      className={cx("h-5 w-5 transition", isOpen ? "rotate-180" : "rotate-0")}
                                    />
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
                                  <div className="p-5 sm:p-6">
                                    <div className="grid gap-6 xl:grid-cols-2">
                                      <div>
                                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                          Definition
                                        </p>
                                        <p className="text-sm leading-7 text-slate-700">{category.definition}</p>

                                        <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                          Core features
                                        </p>
                                        <ul className="space-y-2 text-sm leading-7 text-slate-700">
                                          {category.bulletsA.map((item) => (
                                            <li key={item} className="flex gap-2">
                                              <span className={cx("mt-2 h-2 w-2 rounded-full", category.soft)} />
                                              {item}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      <div>
                                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                          {category.bulletsBTitle}
                                        </p>
                                        <ul className="space-y-2 text-sm leading-7 text-slate-700">
                                          {category.bulletsB.map((item) => (
                                            <li key={item} className="flex gap-2">
                                              <span className={cx("mt-2 h-2 w-2 rounded-full", category.soft)} />
                                              {item}
                                            </li>
                                          ))}
                                        </ul>

                                        <div
                                          className={cx(
                                            "mt-6 rounded-3xl border p-4",
                                            category.border,
                                            category.soft.replace("200", "50")
                                          )}
                                        >
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
                  <div className="space-y-6">
                    <ModeToggle mode={careerMode} setMode={setCareerMode} />

                    {careerMode === "body" ? (
                      <SoftCard className="overflow-hidden border-slate-200">
                        <div className="grid items-start gap-0 xl:grid-cols-[1.18fr_0.82fr]">
                          <div className="border-b border-slate-200 p-4 sm:p-5 xl:border-b-0 xl:border-r xl:p-6">
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                  Interactive body model
                                </p>
                                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                                  Explore medicine through the human body
                                </h2>
                                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                                  Click through major systems to see how real patient journeys stretch across
                                  teams, referrals, procedures, follow-up, and continuity.
                                </p>
                              </div>

                              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
                                <Users className="h-4 w-4" />
                                Team-based care
                              </div>
                            </div>

                            <BodyIllustration activeNode={activeNode} onSelectNode={handleSelectNode} />

                            <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
                              <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                                <div className="mb-3 flex items-center gap-2">
                                  <Orbit className="h-4 w-4 text-violet-600" />
                                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                    Connected specialties
                                  </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  {linkedCareers.map((career) => (
                                    <TeamPill
                                      key={career.id}
                                      career={career}
                                      isActive={activeCareer?.id === career.id}
                                      onClick={() => setActiveCareerId(career.id)}
                                    />
                                  ))}
                                </div>
                              </div>

                              <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-slate-50 p-4 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                  Quick read
                                </p>
                                <p className="mt-2 text-sm leading-7 text-slate-700">
                                  <span className="font-semibold text-slate-900">{activeNode.shortLabel}</span> is a
                                  good example of how medicine is rarely one-doctor care. It blends acute
                                  decisions, long-term management, and handover between settings.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 sm:p-5 xl:p-6">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={activeNode.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-5"
                              >
                                <div className="rounded-3xl border border-slate-200 bg-linear-to-r from-slate-50 via-white to-slate-50 p-5">
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                                      <activeNode.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                        Selected system
                                      </p>
                                      <h3 className="text-2xl font-black tracking-tight text-slate-950">
                                        {activeNode.label}
                                      </h3>
                                      <p className="mt-2 text-sm leading-7 text-slate-600">
                                        {activeNode.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid gap-4">
                                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                                      Example conditions
                                    </p>
                                    <p className="mt-2 text-sm leading-7 text-slate-700">
                                      {activeNode.exampleCondition}
                                    </p>
                                  </div>

                                  <div className="rounded-3xl border border-sky-200 bg-sky-50 p-4">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
                                      Why interconnectivity matters
                                    </p>
                                    <p className="mt-2 text-sm leading-7 text-slate-700">
                                      {activeNode.whyItMatters}
                                    </p>
                                  </div>
                                </div>

                                {activeCareer && (
                                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="mb-4 flex items-start gap-3">
                                      <div
                                        className={cx(
                                          "flex h-11 w-11 items-center justify-center rounded-2xl",
                                          activeCareer.bg
                                        )}
                                      >
                                        <activeCareer.icon
                                          className={cx("h-5 w-5", activeCareer.accent)}
                                        />
                                      </div>
                                      <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                          Spotlight specialty
                                        </p>
                                        <h4 className="text-xl font-black tracking-tight text-slate-950">
                                          {activeCareer.title}
                                        </h4>
                                        <p className="mt-1 text-sm text-slate-600">
                                          Training: {activeCareer.training}
                                        </p>
                                      </div>
                                    </div>

                                    <p className="text-sm leading-7 text-slate-700">
                                      {activeCareer.description}
                                    </p>

                                    <div className="mt-4 space-y-2">
                                      {activeCareer.subspecialties.map((sub) => (
                                        <div key={sub.name} className="rounded-2xl bg-slate-50 px-4 py-3">
                                          <p className="font-semibold text-slate-900">{sub.name}</p>
                                          <p className="mt-1 text-sm text-slate-600">{sub.detail}</p>
                                        </div>
                                      ))}
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-3">
                                      {activeCareer.links.map((link) => (
                                        <ExternalButton key={link.href} {...link} />
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                                  <div className="mb-3 flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4 text-emerald-600" />
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                      How the team works together
                                    </p>
                                  </div>

                                  <div className="space-y-2">
                                    {activeNode.teamwork.map((item) => (
                                      <div
                                        key={item}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                                      >
                                        {item}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                                  <div className="mb-3 flex items-center gap-2">
                                    <Hospital className="h-4 w-4 text-rose-600" />
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                      Example patient journey
                                    </p>
                                  </div>
                                  <TimelineRail steps={activeNode.timeline} />
                                </div>

                                <div className="flex flex-wrap gap-3 pt-1">
                                  {activeNode.links.map((link) => (
                                    <ExternalButton key={link.href} {...link} />
                                  ))}
                                </div>
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </div>
                      </SoftCard>
                    ) : (
                      <SoftCard className="overflow-hidden border-slate-200 p-4 sm:p-5">
                        <div className="grid gap-6 xl:grid-cols-[0.42fr_0.58fr]">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                              Disease pathways
                            </p>
                            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                              See how one illness brings teams together
                            </h2>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                              Students often see specialties as separate boxes. Disease mode shows the opposite:
                              real care moves across teams, settings, and time.
                            </p>

                            <div className="mt-5 space-y-3">
                              {diseasePathways.map((disease) => {
                                const Icon = disease.icon;
                                const isActive = activeDisease.id === disease.id;

                                return (
                                  <button
                                    key={disease.id}
                                    onClick={() => handleSelectDisease(disease.id)}
                                    className={cx(
                                      "w-full rounded-3xl border p-4 text-left transition",
                                      isActive
                                        ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300"
                                    )}
                                    type="button"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div
                                        className={cx(
                                          "flex h-11 w-11 items-center justify-center rounded-2xl",
                                          isActive ? "bg-white/15" : disease.bg
                                        )}
                                      >
                                        <Icon className={cx("h-5 w-5", isActive ? "text-white" : disease.accent)} />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <p className="font-black tracking-tight">{disease.title}</p>
                                          <span
                                            className={cx(
                                              "rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em]",
                                              isActive
                                                ? "bg-white/15 text-white/90"
                                                : "bg-slate-100 text-slate-600"
                                            )}
                                          >
                                            {disease.systemHint}
                                          </span>
                                        </div>
                                        <p
                                          className={cx(
                                            "mt-2 text-sm leading-6",
                                            isActive ? "text-white/80" : "text-slate-600"
                                          )}
                                        >
                                          {disease.summary}
                                        </p>
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={activeDisease.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-5"
                              >
                                <div className="rounded-3xl border border-slate-200 bg-linear-to-r from-slate-50 via-white to-slate-50 p-5">
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={cx(
                                        "flex h-12 w-12 items-center justify-center rounded-2xl",
                                        activeDisease.bg
                                      )}
                                    >
                                      <activeDisease.icon className={cx("h-5 w-5", activeDisease.accent)} />
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                        Selected pathway
                                      </p>
                                      <h3 className="text-2xl font-black tracking-tight text-slate-950">
                                        {activeDisease.title}
                                      </h3>
                                      <p className="mt-2 text-sm leading-7 text-slate-600">
                                        {activeDisease.summary}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <div className="mb-3 flex items-center gap-2">
                                    <Users className="h-4 w-4 text-sky-600" />
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                      Teams commonly involved
                                    </p>
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    {diseaseLinkedCareers.map((career) => (
                                      <TeamPill key={career.id} career={career} />
                                    ))}
                                  </div>
                                </div>

                                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                                  <div className="mb-3 flex items-center gap-2">
                                    <Orbit className="h-4 w-4 text-violet-600" />
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                      What usually happens
                                    </p>
                                  </div>

                                  <div className="space-y-2">
                                    {activeDisease.whatHappens.map((item) => (
                                      <div
                                        key={item}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                                      >
                                        {item}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
                                  <div className="mb-3 flex items-center gap-2">
                                    <Hospital className="h-4 w-4 text-amber-700" />
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                                      {activeDisease.patientJourneyTitle}
                                    </p>
                                  </div>

                                  <TimelineRail steps={activeDisease.timeline} />
                                </div>

                                <div className="flex flex-wrap gap-3">
                                  {activeDisease.links.map((link) => (
                                    <ExternalButton key={link.href} {...link} />
                                  ))}
                                </div>
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </div>
                      </SoftCard>
                    )}

                    <SoftCard className="p-4 sm:p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                          <Search className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                            Career library
                          </p>
                          <h3 className="text-xl font-black tracking-tight text-slate-950">
                            Browse specialties directly
                          </h3>
                        </div>
                      </div>

                      <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search specialties or subspecialties..."
                          className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                        />
                      </div>

                      <div className="mt-5 grid gap-5 md:grid-cols-2">
                        {filteredCareers.map((career) => {
                          const Icon = career.icon;

                          return (
                            <SoftCard key={career.id} className="p-5 sm:p-6">
                              <div className="flex items-start gap-4">
                                <div className={cx("flex h-12 w-12 items-center justify-center rounded-2xl", career.bg)}>
                                  <Icon className={cx("h-5 w-5", career.accent)} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-xl font-black tracking-tight text-slate-950">
                                      {career.title}
                                    </h3>
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                      Training: {career.training}
                                    </span>
                                  </div>
                                  <p className="mt-3 text-sm leading-7 text-slate-700">
                                    {career.description}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-5">
                                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                  Subspecialties
                                </p>
                                <div className="space-y-2">
                                  {career.subspecialties.map((sub) => (
                                    <div key={sub.name} className="rounded-2xl bg-slate-50 px-4 py-3">
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
                        <SoftCard className="mt-5 p-8 text-center">
                          <p className="text-lg font-bold text-slate-950">No specialties matched that search.</p>
                          <p className="mt-2 text-sm text-slate-600">
                            Try broader words like surgery, children, eye, brain, or emergency.
                          </p>
                        </SoftCard>
                      )}
                    </SoftCard>

                    <div className="rounded-3xl border border-amber-300 bg-linear-to-r from-amber-50 via-white to-orange-50 p-5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                          <BadgeInfo className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-slate-950">
                            This is the point students usually miss
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-slate-700">
                            No specialty exists in isolation. A patient is rarely just a heart, just a bone, or
                            just a scan. Medicine is built around teams, transitions, referrals, procedures,
                            follow-up, uncertainty, and continuity. The more students understand the network, the
                            smarter their curiosity becomes.
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