"use client";

import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import Link from "next/link";
import {
  Award,
  BookmarkPlus,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Clock3,
  BadgeDollarSign,
  School,
  Search,
  ExternalLink,
  Filter,
  MapPin,
  Wallet,
  Tags,
  Lock,
} from "lucide-react";

type ScholarshipItem = {
  id: string;
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  status: "Interested" | "Applying" | "Submitted";
  notes?: string;
};

type UniversityScholarship = {
  id: string;
  title: string;
  uni: string;
  amount: string;
  deadline: string;
  type: "Merit" | "Equity" | "Rural" | "Faculty" | "Government" | "International";
  summary: string;
  eligibility: string;
  href: string;
  source: string;
  recurring?: boolean;
  featured?: boolean;
};

type CollegeScholarship = {
  id: string;
  title: string;
  type: string;
  amount: string;
  description: string;
  eligibility: string;
  tone: string;
};

const trackerStorageKey = "amg-scholarship-tracker";

const universityScholarships: UniversityScholarship[] = [
  {
    id: "u1",
    title: "AMA Indigenous Medical Scholarship",
    uni: "National",
    amount: "$11,000/year",
    deadline: "31 January each year",
    type: "Equity",
    summary:
      "For Aboriginal and Torres Strait Islander students enrolled in an Australian medical degree.",
    eligibility: "Indigenous students",
    href: "https://www.flinders.edu.au/scholarships/ama--indigenous-medical-scholarship",
    source: "Official scholarship page",
    recurring: true,
    featured: true,
  },
  {
    id: "u2",
    title: "Medical Rural Bonded Scholarship (MRBS)",
    uni: "National",
    amount: "$15,000/year",
    deadline: "Closed to new enrolments",
    type: "Rural",
    summary:
      "Government scholarship tied to rural service obligations after graduation.",
    eligibility: "Rural service commitment",
    href: "https://www.health.gov.au/our-work/medical-rural-bonded-scholarship-scheme",
    source: "Department of Health",
    recurring: true,
    featured: true,
  },
  {
    id: "u3",
    title: "Australian Rotary Health Rural Scholarships",
    uni: "National",
    amount: "$5,000",
    deadline: "July–August (varies yearly)",
    type: "Rural",
    summary: "Supporting rural and remote medical students.",
    eligibility: "Rural background",
    href: "https://australianrotaryhealth.org.au/category/current-funding/rural-medicine-scholarship-program/",
    source: "Australian Rotary Health",
    recurring: false,
    featured: true,
  },
  {
    id: "u4",
    title: "NSW Tertiary Health Study Subsidy",
    uni: "National",
    amount: "$4,000/year",
    deadline: "June–July (varies yearly)",
    type: "Government",
    summary:
      "$4,000 per year over multiple years in exchange for NSW Health service commitment.",
    eligibility: "NSW students with service commitment",
    href: "https://www.health.nsw.gov.au/studysubsidies",
    source: "NSW Health",
    recurring: true,
    featured: true,
  },
  {
    id: "u5",
    title: "Adelaide University Scholarships",
    uni: "Adelaide",
    amount: "$5,000/year",
    deadline: "Check scholarship portal",
    type: "Merit",
    summary: "Merit, equity, and rural background scholarships.",
    eligibility: "Various",
    href: "https://scholarships.adelaide.edu.au/",
    source: "Adelaide scholarships portal",
    recurring: true,
  },
  {
    id: "u6",
    title: `Bill Nicholes "Willigobung" Scholarship`,
    uni: "ANU",
    amount: "$8,000/year",
    deadline: "Early Dec – Early Jan",
    type: "Rural",
    summary: "For medical students from rural backgrounds.",
    eligibility: "Rural background",
    href: "https://study.anu.edu.au/scholarships/find-scholarship/bill-nicholes-willigobung-scholarship-medicine",
    source: "ANU scholarship page",
    recurring: true,
  },
  {
    id: "u7",
    title: "Peter Sharp Scholarship",
    uni: "ANU",
    amount: "$6,000/year",
    deadline: "Feb/Mar or Oct/Nov rounds",
    type: "Merit",
    summary: "Support for ANU medical students in the Indigenous health stream.",
    eligibility: "Academic excellence / Indigenous Health Stream",
    href: "https://study.anu.edu.au/scholarships/find-scholarship/peter-sharp-scholarship",
    source: "ANU scholarship page",
    recurring: true,
  },
  {
    id: "u8",
    title: "Global University Award",
    uni: "Bond",
    amount: "$20,000",
    deadline: "July–August (varies)",
    type: "Merit",
    summary: "Merit-based support for students at Bond.",
    eligibility: "High achievers",
    href: "https://bond.edu.au/entry-to-bond/scholarships",
    source: "Bond scholarships page",
    recurring: false,
  },
  {
    id: "u9",
    title: "Monash PSA Insurance Medical Science Honours Scholarship",
    uni: "Monash",
    amount: "$8,000",
    deadline: "See annual round",
    type: "Merit",
    summary: "For Bachelor of Medical Science (Honours) students.",
    eligibility: "Honours students",
    href: "https://www.monash.edu/study/fees-scholarships/scholarships/find-a-scholarship/monash-psa-insurance-medical-science-honours-scholarship-6228",
    source: "Monash scholarship page",
    recurring: false,
  },
  {
    id: "u10",
    title: "Medical Student Financial Aid Scholarships",
    uni: "UQ",
    amount: "$7,000/year",
    deadline: "Late Feb – March / July rounds vary by scheme",
    type: "Equity",
    summary:
      "Multiple named awards for MD students experiencing financial hardship.",
    eligibility: "Financial hardship",
    href: "https://scholarships.uq.edu.au/scholarships/medical-student-financial-aid-scholarships",
    source: "UQ scholarship scheme page",
    recurring: true,
  },
  {
    id: "u11",
    title: "Dr Katherine Bau & Brothers Scholarship",
    uni: "Sydney",
    amount: "$45,000/year",
    deadline: "TBC",
    type: "Merit",
    summary: "Major scholarship for Doctor of Medicine students in financial need.",
    eligibility: "Doctor of Medicine + financial need",
    href: "https://www.sydney.edu.au/scholarships/c/dr-katherine-bau-and-brothers-scholarship.html",
    source: "Sydney scholarship page",
    recurring: true,
  },
  {
    id: "u12",
    title: "Bill & Melia Hutchinson Scholarship",
    uni: "Sydney",
    amount: "$8,500/year",
    deadline: "Via UAC / check annual round",
    type: "Equity",
    summary: "For undergraduate medicine and health students via UAC pathway.",
    eligibility: "Low-SES / UAC applicants",
    href: "https://www.sydney.edu.au/scholarships/b/bill-melia-hutchinson-scholarship.html",
    source: "Sydney scholarship page",
    recurring: true,
  },
  {
    id: "u13",
    title: "Melbourne Medical School Scholarships",
    uni: "Melbourne",
    amount: "$5,000/year",
    deadline: "May–July / varies",
    type: "Merit",
    summary: "Travel, placement support, bursaries, and research-linked support.",
    eligibility: "Various",
    href: "https://scholarships.unimelb.edu.au/awards/melbourne-medical-school-postgraduate-scholarship",
    source: "UniMelb scholarship page",
    recurring: true,
  },
  {
    id: "u14",
    title: "Betty Josephine Fyffe Rural Medical Excellence Scholarship",
    uni: "Newcastle/UNE",
    amount: "$10,000/year",
    deadline: "Check university portal",
    type: "Rural",
    summary: "Major scholarship for rural medical students.",
    eligibility: "Rural background",
    href: "https://www.newcastle.edu.au/scholarships/betty-josephine-fyffe-rural-health-scholarships",
    source: "Newcastle scholarship page",
    recurring: false,
  },
  {
    id: "u15",
    title: "JCU Medicine Scholarships",
    uni: "JCU",
    amount: "$6,000/year",
    deadline: "March–April / varies",
    type: "Rural",
    summary: "Rural, equity, and Indigenous scholarships within JCU medicine pathways.",
    eligibility: "Various",
    href: "https://www.jcu.edu.au/scholarships",
    source: "JCU scholarships page",
    recurring: true,
  },
  {
    id: "u16",
    title: "UWA Medical Merit / Indigenous Scholarship",
    uni: "UWA",
    amount: "$5,000/year",
    deadline: "July–August / varies by scholarship",
    type: "Merit",
    summary: "Official UWA medicine-related merit, Indigenous, and pathway scholarships.",
    eligibility: "Various",
    href: "https://www.uwa.edu.au/study/scholarship-listing/g-and-i-hester-indigenous-pathway-scholarship-in-medicine-f513181",
    source: "UWA scholarship page",
    recurring: true,
  },
  {
    id: "u17",
    title: "Lesley Shorne Memorial Scholarship",
    uni: "Flinders",
    amount: "$5,000",
    deadline: "March–April",
    type: "Merit",
    summary: "Supports a mature-age woman in the Doctor of Medicine.",
    eligibility: "Mature-age woman in MD",
    href: "https://www.flinders.edu.au/scholarships/lesley-shorne-memorial-scholarship-",
    source: "Flinders scholarship page",
    recurring: false,
  },
];

const collegeScholarships: CollegeScholarship[] = [
  {
    id: "c1",
    title: "Academic Merit Scholarships",
    type: "Merit",
    amount: "$1,000 - 6,000",
    description:
      "Based on ATAR, GPA, and academic excellence. Offered by many traditional colleges.",
    eligibility: "High achievers",
    tone: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "c2",
    title: "Equity / Financial Hardship Scholarships",
    type: "Equity",
    amount: "$1,000 - 10,000",
    description:
      "Based on financial need, Centrelink status, low-SES background. Common but under-applied for.",
    eligibility: "Financial need",
    tone: "bg-violet-50 text-violet-700 border-violet-200",
  },
  {
    id: "c3",
    title: "Rural / Regional Scholarships",
    type: "Rural",
    amount: "$2,000 - 8,000",
    description:
      "For rural or regional students. Many metro colleges quietly offer these.",
    eligibility: "Rural background",
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "c4",
    title: "Medical / Health Faculty Scholarships",
    type: "Faculty",
    amount: "$1,500 - 5,000",
    description:
      "Specifically for students enrolled in medicine or health sciences.",
    eligibility: "Health students",
    tone: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    id: "c5",
    title: "Leadership Scholarships",
    type: "Leadership",
    amount: "$2,000 - 8,000",
    description:
      "Based on school leadership, community service, volunteering, and initiative.",
    eligibility: "Leadership evidence",
    tone: "bg-pink-50 text-pink-700 border-pink-200",
  },
  {
    id: "c6",
    title: "Sport & Cultural Scholarships",
    type: "Other",
    amount: "$1,000 - 5,000",
    description:
      "For sport, music, debating, theatre, and arts. Often paired with college representation.",
    eligibility: "Sporting/cultural",
    tone: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    id: "c7",
    title: "Diversity & Inclusion Scholarships",
    type: "Equity",
    amount: "$1,000 - 6,000",
    description:
      "For Indigenous, LGBTQIA+, first-in-family, and other underrepresented student groups depending on the college.",
    eligibility: "Various backgrounds",
    tone: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "c8",
    title: "International Student Scholarships",
    type: "International",
    amount: "$2,000 - 10,000",
    description:
      "Often offered by larger flagship colleges and international student programs.",
    eligibility: "International students",
    tone: "bg-amber-50 text-amber-700 border-amber-200",
  },
];

const tips = [
  "Apply early. Some scholarships quietly close once strong applicants fill the round.",
  "Keep one folder with proof of income, rural documents, statements, and resumes.",
  "Search both university portals and external providers. Good money often sits outside the uni page.",
  "A lot of equity and college scholarships are under-applied for.",
  "Reuse strong personal statements, but always tailor the final version.",
];

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function safeId(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function parseDollarAmountToNumber(amount: string) {
  if (!amount) return 0;
  const cleaned = amount.replace(/,/g, "");
  const matches = cleaned.match(/\d+(\.\d+)?/g);
  if (!matches || matches.length === 0) return 0;
  return Number(matches[matches.length - 1]);
}

function formatCurrencyCompact(value: number) {
  if (value >= 1000) {
    return `$${value.toLocaleString()}`;
  }
  return `$${value}`;
}

function badgeToneForType(type: UniversityScholarship["type"]) {
  switch (type) {
    case "Merit":
      return "blue" as const;
    case "Equity":
      return "violet" as const;
    case "Rural":
      return "green" as const;
    case "Faculty":
      return "cyan" as const;
    case "Government":
      return "neutral" as const;
    case "International":
      return "amber" as const;
    default:
      return "neutral" as const;
  }
}

export default function ScholarshipsClient({
  isPremium,
}: {
  isPremium: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"tracker" | "university" | "college">("tracker");
  const [deadlineOpen, setDeadlineOpen] = useState(true);
  const [tipsOpen, setTipsOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tracker, setTracker] = useState<ScholarshipItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUni, setSelectedUni] = useState("All Universities");
  const [selectedType, setSelectedType] = useState("All Types");
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<ScholarshipItem>({
    id: "",
    name: "",
    provider: "",
    amount: "",
    deadline: "",
    status: "Interested",
    notes: "",
  });

  const hasScholarshipsAccess = isPremium;

  useEffect(() => {
    if (!hasScholarshipsAccess) return;

    const raw = localStorage.getItem(trackerStorageKey);
    if (raw) {
      setTracker(JSON.parse(raw));
    }
  }, [hasScholarshipsAccess]);

  useEffect(() => {
    if (!hasScholarshipsAccess) return;
    localStorage.setItem(trackerStorageKey, JSON.stringify(tracker));
  }, [tracker, hasScholarshipsAccess]);

  useEffect(() => {
    const initialOpen: Record<string, boolean> = {};
    universityScholarships.forEach((item) => {
      initialOpen[item.id] = item.featured ?? false;
    });
    setOpenCards(initialOpen);
  }, []);

  const universities = useMemo(() => {
    return ["All Universities", ...Array.from(new Set(universityScholarships.map((s) => s.uni)))];
  }, []);

  const scholarshipTypes = useMemo(() => {
    return ["All Types", ...Array.from(new Set(universityScholarships.map((s) => s.type)))];
  }, []);

  const filteredUniversityScholarships = useMemo(() => {
    return universityScholarships.filter((item) => {
      const q = search.trim().toLowerCase();

      const matchesSearch =
        q === "" ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.eligibility.toLowerCase().includes(q) ||
        item.uni.toLowerCase().includes(q);

      const matchesUni = selectedUni === "All Universities" || item.uni === selectedUni;
      const matchesType = selectedType === "All Types" || item.type === selectedType;

      return matchesSearch && matchesUni && matchesType;
    });
  }, [search, selectedUni, selectedType]);

  const stats = useMemo(() => {
    const total = tracker.length;
    const applying = tracker.filter((s) => s.status === "Applying").length;
    const submitted = tracker.filter((s) => s.status === "Submitted").length;
    const readySoon = tracker.filter((s) => s.status !== "Submitted").length;
    const potentialValue = tracker.reduce(
      (sum, item) => sum + parseDollarAmountToNumber(item.amount),
      0
    );

    return {
      total,
      applying,
      submitted,
      readySoon,
      potentialValue,
    };
  }, [tracker]);

  const featuredScholarships = useMemo(() => {
    return universityScholarships.filter((item) => item.featured).slice(0, 3);
  }, []);

  const previewStats = useMemo(() => {
    return {
      liveScholarships: universityScholarships.length,
    };
  }, []);

  const addScholarship = () => {
    if (!form.name.trim() || !form.provider.trim() || !form.deadline.trim()) return;

    const newItem: ScholarshipItem = {
      ...form,
      id: crypto.randomUUID(),
    };

    setTracker((prev) => [newItem, ...prev]);
    setForm({
      id: "",
      name: "",
      provider: "",
      amount: "",
      deadline: "",
      status: "Interested",
      notes: "",
    });
    setShowForm(false);
  };

  const deleteScholarship = (id: string) => {
    setTracker((prev) => prev.filter((item) => item.id !== id));
  };

  const updateStatus = (id: string, status: "Interested" | "Applying" | "Submitted") => {
    setTracker((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const toggleCard = (id: string) => {
    setOpenCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedUni("All Universities");
    setSelectedType("All Types");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
            <span className="text-amber-500">Explore</span>
            <span>•</span>
            <span>Scholarships</span>
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="h-1 w-full rounded-full bg-linear-to-r from-emerald-400 via-sky-500 to-violet-400" />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500 to-orange-500 text-white shadow-sm">
                  <Award className="h-7 w-7" />
                </div>

                <div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    Scholarships
                  </h1>
                  <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                    Find funding opportunities for your medical studies, track applications,
                    and organise scholarship strategy in one place.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <FeaturePreviewCard
                  title="Smarter search"
                  text="Filter university and college scholarship options quickly."
                />
                <FeaturePreviewCard
                  title="Personal tracker"
                  text="Save scholarships and move them through your pipeline."
                />
                <FeaturePreviewCard
                  title="Cleaner planning"
                  text="See strategy, deadlines, and stronger starting points in one place."
                />
                <MetricCard
                  icon={<Award className="h-5 w-5" />}
                  label="Scholarships"
                  value={String(previewStats.liveScholarships)}
                  hint="live opportunities"
                  tone="sky"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Scholarship strategy
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-950">Build a wider net</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Do not only target the obvious big-name awards. Good smaller scholarships stack.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-950">Track deadlines early</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    A lot of strong applicants lose money simply because they start too late.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-950">Reuse good material</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Keep one master bank for leadership, hardship, rural evidence, and service examples.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-100 p-1.5">
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
              <TabButton
                active={activeTab === "tracker"}
                onClick={() => setActiveTab("tracker")}
                label="My Tracker"
              />
              <TabButton
                active={activeTab === "university"}
                onClick={() => setActiveTab("university")}
                label="University Scholarships"
              />
              <TabButton
                active={activeTab === "college"}
                onClick={() => setActiveTab("college")}
                label="College Scholarships"
              />
            </div>
          </div>
        </section>

        <FeatureGate
          locked={!hasScholarshipsAccess}
          title="Upgrade to unlock Scholarships"
          description="Browse the full scholarship database, track applications, and build a stronger funding strategy with Pro."
          ctaHref="/info/pricing"
          ctaLabel="Upgrade to Pro"
          previewLabel="Scholarships"
        >
          <div className="mt-6 space-y-5">
            {activeTab === "tracker" && (
              <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <BookmarkPlus className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-950">
                          My Scholarship Tracker
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                          Save scholarships you want to pursue and move them through your pipeline.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowForm((prev) => !prev)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      <Plus className="h-4 w-4" />
                      {showForm ? "Hide Form" : "Add Scholarship"}
                    </button>
                  </div>

                  {showForm ? (
                    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          label="Scholarship name"
                          value={form.name}
                          onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
                          placeholder="eg. Chancellor’s Scholarship"
                        />
                        <Input
                          label="Provider"
                          value={form.provider}
                          onChange={(value) => setForm((prev) => ({ ...prev, provider: value }))}
                          placeholder="eg. Monash / college / external provider"
                        />
                        <Input
                          label="Amount"
                          value={form.amount}
                          onChange={(value) => setForm((prev) => ({ ...prev, amount: value }))}
                          placeholder="eg. $5,000"
                        />
                        <Input
                          label="Deadline"
                          value={form.deadline}
                          onChange={(value) => setForm((prev) => ({ ...prev, deadline: value }))}
                          placeholder="eg. 31 Jan"
                        />
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-[220px,1fr]">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Status
                          </label>
                          <select
                            value={form.status}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                status: e.target.value as ScholarshipItem["status"],
                              }))
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-sky-300"
                          >
                            <option>Interested</option>
                            <option>Applying</option>
                            <option>Submitted</option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Notes
                          </label>
                          <textarea
                            value={form.notes}
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, notes: e.target.value }))
                            }
                            placeholder="Anything important to remember..."
                            rows={4}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-sky-300"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          onClick={addScholarship}
                          className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Save scholarship
                        </button>
                        <button
                          onClick={() => setShowForm(false)}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {tracker.length === 0 ? (
                    <div className="mt-6 flex min-h-70 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                        <BookmarkPlus className="h-8 w-8" />
                      </div>
                      <p className="mt-5 text-lg font-semibold text-slate-700">
                        No scholarships tracked yet
                      </p>
                      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Add scholarships you want to apply for and build a cleaner application pipeline.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-6 grid gap-4">
                      {tracker.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-xl font-black tracking-tight text-slate-950">
                                  {item.name}
                                </h3>
                                <StatusPill status={item.status} />
                              </div>

                              <p className="mt-2 text-sm text-slate-600">{item.provider}</p>

                              <div className="mt-4 flex flex-wrap gap-3">
                                <MiniInfo
                                  icon={BadgeDollarSign}
                                  label={item.amount || "Amount not added"}
                                />
                                <MiniInfo
                                  icon={CalendarDays}
                                  label={`Deadline: ${item.deadline}`}
                                />
                              </div>

                              {item.notes ? (
                                <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600">
                                  {item.notes}
                                </div>
                              ) : null}
                            </div>

                            <div className="flex flex-wrap gap-2 lg:justify-end">
                              <SmallStatusButton
                                active={item.status === "Interested"}
                                label="Interested"
                                onClick={() => updateStatus(item.id, "Interested")}
                              />
                              <SmallStatusButton
                                active={item.status === "Applying"}
                                label="Applying"
                                onClick={() => updateStatus(item.id, "Applying")}
                              />
                              <SmallStatusButton
                                active={item.status === "Submitted"}
                                label="Submitted"
                                onClick={() => updateStatus(item.id, "Submitted")}
                              />
                              <button
                                onClick={() => deleteScholarship(item.id)}
                                className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                        <Wallet className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black tracking-tight text-slate-950">
                          Quick strategy board
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Better than bland counters. This tells you what to do next.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <ActionCard
                        title="Build your shortlist"
                        text={
                          stats.total === 0
                            ? "Start with 5 to 8 scholarships across merit, equity, rural, and external options."
                            : `You have ${stats.total} tracked. Keep widening the list before deadlines start compressing.`
                        }
                      />
                      <ActionCard
                        title="Push active applications"
                        text={
                          stats.applying === 0
                            ? "Nothing is currently marked as applying. Move your highest-priority scholarships into motion."
                            : `${stats.applying} scholarship${stats.applying === 1 ? "" : "s"} currently in progress. Finish essays and supporting documents first.`
                        }
                      />
                      <ActionCard
                        title="Potential value"
                        text={
                          stats.potentialValue === 0
                            ? "Start adding approximate values so you can see which applications deserve earlier attention."
                            : `Your tracked list currently covers about ${formatCurrencyCompact(stats.potentialValue)} in visible value.`
                        }
                      />
                    </div>
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black tracking-tight text-slate-950">
                          Strong scholarships to look at first
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Fast starting points if you want momentum.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {featuredScholarships.map((item) => (
                        <a
                          key={item.id}
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                              <p className="mt-1 text-sm text-slate-500">{item.uni}</p>
                            </div>
                            <ExternalLink className="mt-0.5 h-4 w-4 text-slate-400" />
                          </div>
                          <p className="mt-2 text-sm text-emerald-600">{item.amount}</p>
                        </a>
                      ))}
                    </div>
                  </section>
                </div>
              </section>
            )}

            {activeTab === "university" && (
              <>
                <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search scholarships..."
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-sky-300"
                      />
                    </div>

                    <div className="relative">
                      <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <select
                        value={selectedUni}
                        onChange={(e) => setSelectedUni(e.target.value)}
                        className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-sky-300"
                      >
                        {universities.map((uni) => (
                          <option key={uni} value={uni}>
                            {uni}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <Tags className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-sky-300"
                      >
                        {scholarshipTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={resetFilters}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Reset
                    </button>
                  </div>
                </section>

                <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-sm text-slate-500">
                  <p>Showing {filteredUniversityScholarships.length} scholarships</p>
                  <p>Open the important ones first, then only expand when needed.</p>
                </div>

                <div className="grid gap-4">
                  {filteredUniversityScholarships.map((item) => {
                    const isOpen = openCards[item.id];

                    return (
                      <div
                        key={item.id}
                        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                      >
                        <button
                          onClick={() => toggleCard(item.id)}
                          className="flex w-full items-start justify-between gap-4 p-5 text-left"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-[1.3rem] font-black tracking-tight text-slate-950">
                                {item.title}
                              </h3>
                              {item.featured ? <Badge tone="amber">Strong option</Badge> : null}
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <Badge tone="neutral">{item.uni}</Badge>
                              <Badge tone={badgeToneForType(item.type)}>{item.type}</Badge>
                              {item.recurring ? <Badge tone="green">Recurring</Badge> : null}
                            </div>

                            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                              {item.summary}
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Value
                            </p>
                            <p className="mt-1 text-3xl font-black tracking-tight text-emerald-600">
                              {item.amount}
                            </p>
                            <div className="mt-3 flex items-center justify-end gap-2 text-slate-400">
                              {isOpen ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </div>
                          </div>
                        </button>

                        {isOpen ? (
                          <div className="border-t border-slate-200 px-5 pb-5 pt-4">
                            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
                              <div>
                                <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                                  <MiniInfo icon={MapPin} label={item.eligibility} />
                                  <MiniInfo icon={CalendarDays} label={item.deadline} />
                                </div>

                                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Source
                                  </p>
                                  <p className="mt-2 text-sm text-slate-600">{item.source}</p>
                                </div>
                              </div>

                              <div className="flex items-start justify-end">
                                <a
                                  href={item.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                >
                                  Apply / View
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {activeTab === "college" && (
              <>
                <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-700">
                      <School className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-slate-950">
                        Residential College Scholarships
                      </h2>
                      <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-700">
                        Most residential colleges offer scholarships for incoming students.
                        Apply directly to colleges when you accept your university offer.
                        Many scholarships are under-applied for.
                      </p>
                    </div>
                  </div>
                </section>

                <div className="grid gap-4">
                  {collegeScholarships.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-3xl">
                          <h3 className="text-2xl font-black tracking-tight text-slate-950">
                            {item.title}
                          </h3>

                          <div
                            className={cn(
                              "mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
                              item.tone
                            )}
                          >
                            {item.type}
                          </div>

                          <p className="mt-4 text-sm leading-7 text-slate-600">
                            {item.description}
                          </p>

                          <p className="mt-3 text-sm">
                            <span className="font-semibold text-slate-700">Eligibility:</span>{" "}
                            <span className="text-slate-500">{item.eligibility}</span>
                          </p>
                        </div>

                        <div className="min-w-55 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:text-right">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Typical value
                          </p>
                          <p className="mt-2 text-2xl font-black tracking-tight text-emerald-600">
                            {item.amount}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <CollapsibleSection
              title="General scholarship deadline info"
              icon={<CalendarDays className="h-4 w-4" />}
              open={deadlineOpen}
              onToggle={() => setDeadlineOpen((prev) => !prev)}
            >
              <div className="rounded-2xl bg-slate-50 p-4">
                <h4 className="text-base font-bold text-slate-900">Most common windows</h4>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>• Main round: Feb–March</li>
                  <li>• Second round: July–August</li>
                  <li>• Indigenous / equity: often Nov–Jan or Sep–Feb</li>
                  <li>• AMA Indigenous: closes 31 January each year</li>
                </ul>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Always check the university scholarship portal for the current year before acting.
              </p>
            </CollapsibleSection>

            <CollapsibleSection
              title="Scholarship tips"
              icon={<Sparkles className="h-4 w-4" />}
              open={tipsOpen}
              onToggle={() => setTipsOpen((prev) => !prev)}
              tone="amber"
            >
              <ul className="space-y-2 text-sm text-amber-800">
                {tips.map((tip) => (
                  <li key={safeId(tip)}>• {tip}</li>
                ))}
              </ul>
            </CollapsibleSection>
          </div>
        </FeatureGate>
      </div>
    </main>
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
    <section className="relative mt-6">
      <div
        className={cn(
          "transition",
          locked ? "pointer-events-none select-none blur-md opacity-35" : ""
        )}
        aria-hidden={locked}
      >
        {children}
      </div>

      {locked ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
              <Lock className="h-6 w-6" />
            </div>

            <div className="mt-4 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              {previewLabel}
            </div>

            <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
              {title}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>

            <Link
              href={ctaHref}
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function FeaturePreviewCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

function CollapsibleSection({
  title,
  icon,
  open,
  onToggle,
  tone = "default",
  children,
}: {
  title: string;
  icon: ReactNode;
  open: boolean;
  onToggle: () => void;
  tone?: "default" | "amber";
  children: ReactNode;
}) {
  const toneClasses =
    tone === "amber" ? "border-amber-300 bg-amber-50/70" : "border-slate-200 bg-white";

  return (
    <section className={cn("rounded-3xl border shadow-sm", toneClasses)}>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl",
              tone === "amber" ? "bg-amber-100 text-amber-700" : "bg-blue-50 text-blue-600"
            )}
          >
            {icon}
          </div>
          <span className="text-base font-bold text-slate-900">{title}</span>
        </div>

        {open ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>

      {open ? <div className="px-5 pb-5">{children}</div> : null}
    </section>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl px-4 py-3 text-sm font-semibold transition",
        active
          ? "bg-white text-slate-950 shadow-sm"
          : "text-slate-500 hover:bg-white/60 hover:text-slate-800"
      )}
    >
      {label}
    </button>
  );
}

function MetricCard({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
  tone: "sky" | "amber" | "emerald" | "violet";
}) {
  const iconTone =
    tone === "sky"
      ? "bg-sky-500 text-white"
      : tone === "amber"
      ? "bg-amber-500 text-white"
      : tone === "emerald"
      ? "bg-emerald-500 text-white"
      : "bg-violet-500 text-white";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", iconTone)}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-2xl font-black tracking-tight text-slate-950">{value}</p>
          <p className="mt-1 text-sm text-slate-500">{hint}</p>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-sky-300"
      />
    </div>
  );
}

function MiniInfo({
  icon: Icon,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}

function StatusPill({
  status,
}: {
  status: "Interested" | "Applying" | "Submitted";
}) {
  const styles =
    status === "Interested"
      ? "border-slate-200 bg-slate-100 text-slate-700"
      : status === "Applying"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", styles)}>
      {status}
    </span>
  );
}

function SmallStatusButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl px-3 py-2 text-sm font-semibold transition",
        active
          ? "bg-slate-950 text-white"
          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      )}
    >
      {label}
    </button>
  );
}

function Badge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "neutral" | "blue" | "violet" | "green" | "amber" | "cyan";
}) {
  const styles =
    tone === "neutral"
      ? "border-slate-200 bg-slate-50 text-slate-700"
      : tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : tone === "violet"
      ? "border-violet-200 bg-violet-50 text-violet-700"
      : tone === "green"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "amber"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-cyan-200 bg-cyan-50 text-cyan-700";

  return (
    <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", styles)}>
      {children}
    </span>
  );
}