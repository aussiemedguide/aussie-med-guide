"use client";

import React, { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import SignOutButton from "@/components/auth/sign-out-button";
import dynamic from "next/dynamic";
import {
  BedDouble,
  Building2,
  CircleHelp,
  ExternalLink,
  Filter,
  Info,
  Landmark,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Scale,
  ChevronDown,
  ChevronUp,
  Wand2,
  BookOpen,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  SlidersHorizontal,
  Trash2,
  Lock,
} from "lucide-react";
import type { AccommodationCollege } from "./AccommodationMap";

const AccommodationMap = dynamic<{
  colleges: AccommodationCollege[];
  onSelectCollege?: (id: string) => void;
}>(() => import("./AccommodationMap"), {
  ssr: false,
});

type MainTab = "compare" | "browse" | "interview";

type AccommodationType =
  | "Traditional Residential"
  | "Faith-Affiliated"
  | "Large Flagship"
  | "Womens College"
  | "University Hall"
  | "University Residence"
  | "Graduate Residence"
  | "Private Residence";

type PriceFilter =
  | "Name (A-Z)"
  | "Lowest Price"
  | "Highest Price"
  | "Under $350"
  | "$350-$500"
  | "$500-$650"
  | "$650+";

type CompareItem = {
  id: string;
  name: string;
  university: string;
  weeklyPrice: number;
  type: string;
  catered: boolean;
  contract: string;
  distanceToCampus: string;
  vibe: string;
  notes?: string;
  website?: string;
  source: "dataset" | "custom";
};

type PrivateProvider = {
  name: string;
  description: string;
  price: string;
  city: string;
  website: string;
};

const WEBSITE_BY_ID: Record<string, string> = {
  "aquinas-adelaide": "https://www.aquinas.edu.au/",
  "lincoln-adelaide": "https://lincoln.edu.au/",
  "stanns-adelaide": "https://stannscollege.edu.au/",
  "stmarks-adelaide": "https://stmarkscollege.com.au/",

  "bruce-anu":
    "https://study.anu.edu.au/accommodation/our-residences/bruce-hall-main-wing",
  "burgmann-anu": "https://burgmann.anu.edu.au/",
  "johnxxiii-anu": "https://www.johnxxiii.anu.edu.au/",
  "fenner-anu":
    "https://study.anu.edu.au/accommodation/our-residences/fenner-hall",
  "ursula-anu":
    "https://study.anu.edu.au/accommodation/our-residences/ursula-hall-main-wing",
  "wright-anu":
    "https://study.anu.edu.au/accommodation/our-residences/wright-hall",

  "barton-deakin":
    "https://accommodation.deakin.edu.au/geelong-waurn-ponds-campus-shared-units-barton",
  "hopkins-deakin":
    "https://accommodation.deakin.edu.au/geelong-waurn-ponds-campus-accommodation",

  "christ-tas": "https://www.christcollegehobart.com/",
  "janefranklin-tas": "https://jane.edu.au/",

  "griffith-village":
    "https://campuslivingvillages.com/australia/gold-coast/griffith-university-village/",
  "unisquare-griffith": "https://www.unisquaregc.com/apartments/",

  "deirdre-flinders": "https://www.flinders.edu.au/living/deirdre-jordan-village",
  "matthew-flinders": "https://www.flinders.edu.au/living/university-hall",

  "johnflynn-jcu": "https://www.johnflynn.org.au/",

  "duchesne-uq": "https://duchesne.uq.edu.au/",
  "emmanuel-uq": "https://www.emmanuel.uq.edu.au/",
  "grace-uq": "https://www.grace.uq.edu.au/",
  "ihouse-uq": "https://internationalhouse.uq.edu.au/",
  "kings-uq": "https://www.kings.uq.edu.au/",
  "saints-uq": "https://my.uq.edu.au/student-support/accommodation/uq-residential-colleges",
  "stjohns-uq": "https://www.stjohns.uq.edu.au/",
  "stleos-uq": "https://www.stleos.uq.edu.au/",
  "union-uq": "https://www.unioncollegeuq.com.au/",
  "womens-uq": "https://www.womens.uq.edu.au/",

  "graduate-melb": "https://www.graduatehouse.com.au/live-here/",
  "ihouse-melb": "https://study.unimelb.edu.au/accommodation/international-house",
  "janetclarke-melb": "https://jch.unimelb.edu.au/",
  "ormond-melb": "https://ormond.unimelb.edu.au/",
  "queens-melb": "https://queens.unimelb.edu.au/",
  "stmarys-melb": "https://www.stmarys.unimelb.edu.au/",
  "trinity-melb": "https://www.trinity.unimelb.edu.au/residential-college",
  "unicollege-melb": "https://www.unicol.unimelb.edu.au/",

  "mannix-monash": "https://mannix.monash.edu/",
  "unilodge-clayton":
    "https://www.monash.edu/accommodation/students/on-campus-accommodation/on-campus-options/clayton-residential-village",

  "marywhite-newc":
    "https://www.une.edu.au/campus-life/une-accommodation/colleges/mary-white",
  "student-village-newc":
    "https://www.newcastle.edu.au/campus-life/accommodation/on-campus-accommodation",

  "portlodge-notredame":
    "https://www.notredame.edu.au/students/student-life/accommodation",

  "basser-unsw": "https://www.unsw.edu.au/accommodation/colleges/basser-college",
  "goldstein-unsw":
    "https://www.unsw.edu.au/accommodation/colleges/goldstein-college",
  "warrane-unsw": "https://warrane.unsw.edu.au/",

  "ihouse-syd": "https://www.sydney.edu.au/international-house/home.html",
  "santasophia-syd": "https://www.sanctasophiacollege.edu.au/",
  "standrews-syd": "https://www.standrewscollege.edu.au/",
  "stjohns-syd": "https://www.stjohnscollege.edu.au/",
  "stpauls-syd": "https://www.stpauls.edu.au/",
  "womens-syd": "https://www.thewomenscollege.com.au/",
  "wesley-syd": "https://www.wesleycollege-usyd.edu.au/",

  "kurrajong-curtin":
    "https://www.curtin.edu.au/study/campus-life/accommodation/",
  "stcatherines-curtin": "https://www.stcats.com.au/curtin-campus",
  "stcatherines-uwa": "https://www.stcats.com.au/uwa-campus",
  "stgeorges-uwa": "https://stgc.uwa.edu.au/",
  "stthomasmore-uwa": "https://www.stmc.uwa.edu.au/",
  "trinityres-uwa": "https://trc.uwa.edu.au/",
  "unihall-uwa": "https://www.uwa.edu.au/life-at-uwa/accommodation/live-at-uwa",

  "wsu-residences":
    "https://www.westernsydney.edu.au/accommodation/live-on-campus",
};

const collegesRaw: Omit<AccommodationCollege, "website">[] = [
  {
    id: "aquinas-adelaide",
    name: "Aquinas College",
    university: "Adelaide",
    city: "Adelaide",
    state: "SA",
    type: "Faith-Affiliated",
    weeklyPrice: 470,
    lat: -34.9212,
    lng: 138.6068,
    summary: "Dominican tradition with pastoral care and a strong community focus.",
    interviewAngle: ["community", "service", "values", "contribution"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Semester or annual",
    vibe: "Warm, grounded, values-based",
    tags: ["faith", "community", "support"],
  },
  {
    id: "lincoln-adelaide",
    name: "Lincoln College",
    university: "Adelaide",
    city: "Adelaide",
    state: "SA",
    type: "Traditional Residential",
    weeklyPrice: 450,
    lat: -34.9198,
    lng: 138.6062,
    summary: "Historic college with strong traditions, meals included, and lively student culture.",
    interviewAngle: ["tradition", "community", "academic balance", "leadership"],
    catered: true,
    distanceToCampus: "Walking distance",
    contract: "40-week",
    vibe: "Traditional, social, structured",
    tags: ["tradition", "catered", "community"],
  },
  {
    id: "stanns-adelaide",
    name: "St Ann's College",
    university: "Adelaide",
    city: "Adelaide",
    state: "SA",
    type: "Traditional Residential",
    weeklyPrice: 480,
    lat: -34.9204,
    lng: 138.6081,
    summary: "Faith-affiliated college with pastoral care, meals, and strong community values.",
    interviewAngle: ["values", "service", "community", "personal fit"],
    catered: true,
    distanceToCampus: "Walking distance",
    contract: "40-week",
    vibe: "Supportive, values-based, social",
    tags: ["faith", "catered", "community"],
  },
  {
    id: "stmarks-adelaide",
    name: "St Mark's College",
    university: "Adelaide",
    city: "Adelaide",
    state: "SA",
    type: "Traditional Residential",
    weeklyPrice: 630,
    lat: -34.922,
    lng: 138.609,
    summary: "Strong community with formal dinners, sport, and broad academic support.",
    interviewAngle: ["leadership", "balance", "community", "participation"],
    catered: true,
    distanceToCampus: "Walking distance",
    contract: "40-week",
    vibe: "Prestigious, active, polished",
    tags: ["tradition", "sport", "academic"],
  },
  {
    id: "bruce-anu",
    name: "Bruce Hall",
    university: "ANU",
    city: "Canberra",
    state: "ACT",
    type: "University Hall",
    weeklyPrice: 575,
    lat: -35.2774,
    lng: 149.1187,
    summary: "Catered residential hall with a relaxed Canberra vibe and strong community.",
    interviewAngle: ["community", "independence", "contribution", "hall culture"],
    catered: true,
    distanceToCampus: "On campus",
    contract: "Semester or annual",
    vibe: "Balanced, friendly, established",
    tags: ["hall", "community", "catered"],
  },
  {
    id: "burgmann-anu",
    name: "Burgmann College",
    university: "ANU",
    city: "Canberra",
    state: "ACT",
    type: "Traditional Residential",
    weeklyPrice: 580,
    lat: -35.2759,
    lng: 149.1209,
    summary: "Diverse community with strong academic support and a college culture emphasis.",
    interviewAngle: [
      "adaptability",
      "community contribution",
      "academic balance",
      "social maturity",
    ],
    catered: true,
    distanceToCampus: "On campus",
    contract: "Annual",
    vibe: "Structured, social, academically serious",
    tags: ["college", "community", "academic"],
  },
  {
    id: "johnxxiii-anu",
    name: "John XXIII College",
    university: "ANU",
    city: "Canberra",
    state: "ACT",
    type: "Faith-Affiliated",
    weeklyPrice: 590,
    lat: -35.2771,
    lng: 149.1217,
    summary: "Catholic college with pastoral care, meals included, and a strong collegiate feel.",
    interviewAngle: ["service", "community", "values", "fit"],
    catered: true,
    distanceToCampus: "On campus",
    contract: "Annual",
    vibe: "Pastoral, warm, values-driven",
    tags: ["faith", "pastoral", "catered"],
  },
  {
    id: "fenner-anu",
    name: "Fenner Hall",
    university: "ANU",
    city: "Canberra",
    state: "ACT",
    type: "University Hall",
    weeklyPrice: 380,
    lat: -35.2792,
    lng: 149.1213,
    summary: "Self-catered hall with modern facilities and more independence.",
    interviewAngle: ["independence", "time management", "community", "self-direction"],
    catered: false,
    distanceToCampus: "On campus",
    contract: "Semester",
    vibe: "Independent, modern, balanced",
    tags: ["self-catered", "independence", "modern"],
  },
  {
    id: "ursula-anu",
    name: "Ursula Hall",
    university: "ANU",
    city: "Canberra",
    state: "ACT",
    type: "University Hall",
    weeklyPrice: 500,
    lat: -35.2784,
    lng: 149.1193,
    summary: "Catered hall with a friendly and inclusive atmosphere.",
    interviewAngle: ["inclusion", "community", "belonging", "contribution"],
    catered: true,
    distanceToCampus: "On campus",
    contract: "Semester or annual",
    vibe: "Friendly, inclusive, supportive",
    tags: ["inclusive", "hall", "catered"],
  },
  {
    id: "wright-anu",
    name: "Wright Hall",
    university: "ANU",
    city: "Canberra",
    state: "ACT",
    type: "University Hall",
    weeklyPrice: 520,
    lat: -35.2766,
    lng: 149.1173,
    summary: "Flexible hall with a good balance of structure and freedom.",
    interviewAngle: ["balance", "initiative", "community", "maturity"],
    catered: true,
    distanceToCampus: "On campus",
    contract: "Semester",
    vibe: "Fresh, balanced, social",
    tags: ["hall", "balance", "community"],
  },
  {
    id: "barton-deakin",
    name: "Barton College",
    university: "Deakin",
    city: "Geelong",
    state: "VIC",
    type: "University Hall",
    weeklyPrice: 315,
    lat: -38.1972,
    lng: 144.2985,
    summary: "Supportive community on the Geelong campus with on-campus convenience.",
    interviewAngle: ["fit", "community", "independence", "campus life"],
    catered: false,
    distanceToCampus: "On campus",
    contract: "Semester",
    vibe: "Convenient, relaxed, practical",
    tags: ["affordable", "campus", "residence"],
  },
  {
    id: "hopkins-deakin",
    name: "Hopkins Hall",
    university: "Deakin",
    city: "Geelong",
    state: "VIC",
    type: "University Hall",
    weeklyPrice: 315,
    lat: -38.1961,
    lng: 144.2995,
    summary: "Modern university hall with community events and self-catered living.",
    interviewAngle: ["independence", "community", "practicality", "study-life balance"],
    catered: false,
    distanceToCampus: "On campus",
    contract: "Semester",
    vibe: "Modern, practical, easy-going",
    tags: ["affordable", "self-catered", "modern"],
  },
  {
    id: "christ-tas",
    name: "Christ College",
    university: "Tasmania",
    city: "Hobart",
    state: "TAS",
    type: "Faith-Affiliated",
    weeklyPrice: 360,
    lat: -42.8821,
    lng: 147.3257,
    summary: "Anglican college with pastoral care and a close-knit community.",
    interviewAngle: ["community", "service", "personal values", "support"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Close-knit, grounded, pastoral",
    tags: ["faith", "community", "support"],
  },
  {
    id: "janefranklin-tas",
    name: "Jane Franklin Hall",
    university: "Tasmania",
    city: "Hobart",
    state: "TAS",
    type: "Traditional Residential",
    weeklyPrice: 380,
    lat: -42.8804,
    lng: 147.3273,
    summary: "Historic college with strong traditions and a loyal residential community.",
    interviewAngle: ["tradition", "community contribution", "fit", "resilience"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Traditional, warm, sociable",
    tags: ["historic", "college", "community"],
  },
  {
    id: "griffith-village",
    name: "Griffith University Village",
    university: "Griffith",
    city: "Gold Coast",
    state: "QLD",
    type: "University Residence",
    weeklyPrice: 300,
    lat: -27.9632,
    lng: 153.3839,
    summary: "Apartment-style student living on the Gold Coast campus.",
    interviewAngle: ["independence", "self-management", "campus living", "community"],
    catered: false,
    distanceToCampus: "On campus",
    contract: "Trimester",
    vibe: "Independent, campus-based, practical",
    tags: ["affordable", "apartment", "student village"],
  },
  {
    id: "unisquare-griffith",
    name: "University Square",
    university: "Griffith",
    city: "Gold Coast",
    state: "QLD",
    type: "Private Residence",
    weeklyPrice: 320,
    lat: -27.9619,
    lng: 153.3811,
    summary: "Modern apartments near campus with self-catered flexibility.",
    interviewAngle: ["independence", "budgeting", "practical living", "study routine"],
    catered: false,
    distanceToCampus: "Near campus",
    contract: "Flexible",
    vibe: "Independent, private, modern",
    tags: ["private", "apartment", "flexible"],
  },
  {
    id: "deirdre-flinders",
    name: "Deirdre Jordan Village",
    university: "Flinders",
    city: "Adelaide",
    state: "SA",
    type: "University Residence",
    weeklyPrice: 290,
    lat: -35.0208,
    lng: 138.5695,
    summary: "Modern accommodation with an independent living style.",
    interviewAngle: ["independence", "self-management", "community", "practical fit"],
    catered: false,
    distanceToCampus: "On campus",
    contract: "Semester",
    vibe: "Independent, simple, practical",
    tags: ["affordable", "residence", "independent"],
  },
  {
    id: "matthew-flinders",
    name: "Matthew Flinders Hall",
    university: "Flinders",
    city: "Adelaide",
    state: "SA",
    type: "University Hall",
    weeklyPrice: 310,
    lat: -35.0202,
    lng: 138.5702,
    summary: "Community-focused hall with good support services.",
    interviewAngle: ["community", "fit", "support", "routine"],
    catered: true,
    distanceToCampus: "On campus",
    contract: "Semester",
    vibe: "Supportive, campus-based, grounded",
    tags: ["hall", "support", "community"],
  },
  {
    id: "johnflynn-jcu",
    name: "John Flynn College",
    university: "JCU",
    city: "Townsville",
    state: "QLD",
    type: "Traditional Residential",
    weeklyPrice: 350,
    lat: -19.3247,
    lng: 146.7581,
    summary: "Strong academic support and easy access to peers doing medicine and health.",
    interviewAngle: ["community", "academic culture", "contribution", "peer support"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Strong med culture, supportive, connected",
    tags: ["medicine", "support", "college"],
  },
  {
    id: "duchesne-uq",
    name: "Duchesne College",
    university: "UQ",
    city: "Brisbane",
    state: "QLD",
    type: "Womens College",
    weeklyPrice: 600,
    lat: -27.4978,
    lng: 153.0121,
    summary: "Empowering women’s college with leadership opportunities and strong support.",
    interviewAngle: ["leadership", "confidence", "community", "women's environment"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Supportive, ambitious, empowering",
    tags: ["women", "leadership", "community"],
  },
  {
    id: "emmanuel-uq",
    name: "Emmanuel College",
    university: "UQ",
    city: "Brisbane",
    state: "QLD",
    type: "Large Flagship",
    weeklyPrice: 650,
    lat: -27.4971,
    lng: 153.0117,
    summary: "Big reputation with strong academic and leadership opportunities.",
    interviewAngle: ["leadership", "initiative", "contribution", "big community fit"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Prestigious, energetic, high-involvement",
    tags: ["flagship", "leadership", "network"],
  },
  {
    id: "grace-uq",
    name: "Grace College",
    university: "UQ",
    city: "Brisbane",
    state: "QLD",
    type: "Womens College",
    weeklyPrice: 607,
    lat: -27.4972,
    lng: 153.0141,
    summary: "Strong peer support, safe environment, and high academic focus.",
    interviewAngle: ["peer support", "fit", "women's college", "study culture"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Academic, supportive, close-knit",
    tags: ["women", "academic", "support"],
  },
  {
    id: "ihouse-uq",
    name: "International House",
    university: "UQ",
    city: "Brisbane",
    state: "QLD",
    type: "Traditional Residential",
    weeklyPrice: 509,
    lat: -27.4963,
    lng: 153.0129,
    summary: "Diverse international community with cultural events and broad networks.",
    interviewAngle: ["diversity", "cross-cultural fit", "community", "inclusion"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "International, open-minded, social",
    tags: ["international", "diversity", "community"],
  },
  {
    id: "kings-uq",
    name: "King's College",
    university: "UQ",
    city: "Brisbane",
    state: "QLD",
    type: "Large Flagship",
    weeklyPrice: 609,
    lat: -27.4985,
    lng: 153.0128,
    summary: "Large flagship college with excellent facilities and strong networks.",
    interviewAngle: ["leadership", "participation", "contribution", "fit in a large college"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Big, connected, highly involved",
    tags: ["flagship", "network", "community"],
  },
  {
    id: "saints-uq",
    name: "Saints College",
    university: "UQ",
    city: "Brisbane",
    state: "QLD",
    type: "Traditional Residential",
    weeklyPrice: 330,
    lat: -27.4957,
    lng: 153.0112,
    summary: "Community-oriented college with strong bonds and Catholic tradition.",
    interviewAngle: ["community", "values", "contribution", "fit"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Warm, social, tradition-minded",
    tags: ["community", "faith", "college"],
  },
  {
    id: "stjohns-uq",
    name: "St John's College",
    university: "UQ",
    city: "Brisbane",
    state: "QLD",
    type: "Traditional Residential",
    weeklyPrice: 625,
    lat: -27.4974,
    lng: 153.0106,
    summary: "Historic college with strong traditions and broad student involvement.",
    interviewAngle: ["tradition", "community", "leadership", "fit"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Historic, involved, confident",
    tags: ["historic", "tradition", "community"],
  },
  {
    id: "stleos-uq",
    name: "St Leo's College",
    university: "UQ",
    city: "Brisbane",
    state: "QLD",
    type: "Faith-Affiliated",
    weeklyPrice: 750,
    lat: -27.4981,
    lng: 153.0137,
    summary: "Catholic college with pastoral care, premium rooms, and a strong residential identity.",
    interviewAngle: ["values", "community", "fit", "contribution"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Pastoral, polished, residential",
    tags: ["faith", "premium", "community"],
  },
  {
    id: "union-uq",
    name: "Union College",
    university: "UQ",
    city: "Brisbane",
    state: "QLD",
    type: "Traditional Residential",
    weeklyPrice: 650,
    lat: -27.4979,
    lng: 153.0153,
    summary: "Strong community with formal dinners and a broad traditional college culture.",
    interviewAngle: ["community", "leadership", "participation", "tradition"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Traditional, involved, polished",
    tags: ["tradition", "formal", "community"],
  },
  {
    id: "womens-uq",
    name: "Women's College",
    university: "UQ",
    city: "Brisbane",
    state: "QLD",
    type: "Womens College",
    weeklyPrice: 610,
    lat: -27.4968,
    lng: 153.0149,
    summary: "Very strong peer support with a sharp academic focus.",
    interviewAngle: [
      "supportive environment",
      "ambition",
      "women's community",
      "contribution",
    ],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "High-performing, supportive, empowering",
    tags: ["women", "academic", "support"],
  },
  {
    id: "graduate-melb",
    name: "Graduate House",
    university: "Melbourne",
    city: "Melbourne",
    state: "VIC",
    type: "Graduate Residence",
    weeklyPrice: 450,
    lat: -37.7978,
    lng: 144.9604,
    summary: "Quiet, academic-focused accommodation for postgraduate students.",
    interviewAngle: ["maturity", "independence", "academic focus", "community"],
    catered: false,
    distanceToCampus: "Near campus",
    contract: "Flexible",
    vibe: "Quiet, academic, mature",
    tags: ["postgrad", "quiet", "independent"],
  },
  {
    id: "ihouse-melb",
    name: "International House",
    university: "Melbourne",
    city: "Melbourne",
    state: "VIC",
    type: "Traditional Residential",
    weeklyPrice: 580,
    lat: -37.7962,
    lng: 144.9624,
    summary: "Diverse international community close to campus.",
    interviewAngle: ["diversity", "inclusion", "cross-cultural contribution", "fit"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "International, open, connected",
    tags: ["international", "community", "diversity"],
  },
  {
    id: "janetclarke-melb",
    name: "Janet Clarke Hall",
    university: "Melbourne",
    city: "Melbourne",
    state: "VIC",
    type: "Womens College",
    weeklyPrice: 650,
    lat: -37.7954,
    lng: 144.9603,
    summary: "Supportive women’s college with a strong academic focus.",
    interviewAngle: ["women's environment", "ambition", "leadership", "fit"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Academic, warm, empowering",
    tags: ["women", "academic", "leadership"],
  },
  {
    id: "ormond-melb",
    name: "Ormond College",
    university: "Melbourne",
    city: "Melbourne",
    state: "VIC",
    type: "Large Flagship",
    weeklyPrice: 750,
    lat: -37.7967,
    lng: 144.9611,
    summary: "High-energy flagship college with premium facilities and broad prestige.",
    interviewAngle: [
      "leadership",
      "initiative",
      "big-college contribution",
      "academic-social balance",
    ],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Prestigious, big, highly active",
    tags: ["flagship", "prestige", "leadership"],
  },
  {
    id: "queens-melb",
    name: "Queen's College",
    university: "Melbourne",
    city: "Melbourne",
    state: "VIC",
    type: "Traditional Residential",
    weeklyPrice: 680,
    lat: -37.7971,
    lng: 144.9591,
    summary: "Diverse community with strong traditions and college pride.",
    interviewAngle: ["tradition", "contribution", "community", "leadership"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Traditional, proud, connected",
    tags: ["tradition", "community", "college"],
  },
  {
    id: "stmarys-melb",
    name: "St Mary's College",
    university: "Melbourne",
    city: "Melbourne",
    state: "VIC",
    type: "Womens College",
    weeklyPrice: 620,
    lat: -37.7976,
    lng: 144.9584,
    summary: "Catholic women’s college with a strong and supportive community focus.",
    interviewAngle: ["values", "women's community", "contribution", "fit"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Pastoral, supportive, close-knit",
    tags: ["women", "faith", "community"],
  },
  {
    id: "trinity-melb",
    name: "Trinity College",
    university: "Melbourne",
    city: "Melbourne",
    state: "VIC",
    type: "Large Flagship",
    weeklyPrice: 740,
    lat: -37.796,
    lng: 144.963,
    summary: "Prestigious college with strong facilities, academics, and broad networks.",
    interviewAngle: ["leadership", "fit", "contribution", "academic ambition"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Prestigious, polished, ambitious",
    tags: ["flagship", "academic", "network"],
  },
  {
    id: "unicollege-melb",
    name: "University College",
    university: "Melbourne",
    city: "Melbourne",
    state: "VIC",
    type: "Traditional Residential",
    weeklyPrice: 600,
    lat: -37.7958,
    lng: 144.9575,
    summary: "Inclusive community with good support and a broad residential mix.",
    interviewAngle: ["community", "fit", "inclusion", "balance"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Inclusive, balanced, supportive",
    tags: ["inclusive", "community", "support"],
  },
  {
    id: "mannix-monash",
    name: "Mannix College",
    university: "Monash",
    city: "Melbourne",
    state: "VIC",
    type: "Large Flagship",
    weeklyPrice: 550,
    lat: -37.9123,
    lng: 145.1339,
    summary: "Large Monash college with strong networks, events, and leadership opportunities.",
    interviewAngle: ["leadership", "contribution", "community", "fit"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Big, social, connected",
    tags: ["monash", "flagship", "network"],
  },
  {
    id: "unilodge-clayton",
    name: "UniLodge Clayton",
    university: "Monash",
    city: "Melbourne",
    state: "VIC",
    type: "Private Residence",
    weeklyPrice: 450,
    lat: -37.9111,
    lng: 145.1348,
    summary: "Modern apartments near Clayton campus with self-catered flexibility.",
    interviewAngle: ["independence", "budgeting", "self-management", "study routine"],
    catered: false,
    distanceToCampus: "Near campus",
    contract: "Flexible",
    vibe: "Modern, independent, practical",
    tags: ["private", "monash", "independent"],
  },
  {
    id: "marywhite-newc",
    name: "Mary White College",
    university: "Newcastle/UNE",
    city: "Armidale",
    state: "NSW",
    type: "Traditional Residential",
    weeklyPrice: 380,
    lat: -30.4867,
    lng: 151.6421,
    summary: "Strong community for JMP students in Armidale.",
    interviewAngle: ["community", "medicine cohort", "fit", "rural adaptation"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Close-knit, med-aware, supportive",
    tags: ["jmp", "rural", "community"],
  },
  {
    id: "student-village-newc",
    name: "Student Village Newcastle",
    university: "Newcastle/UNE",
    city: "Newcastle",
    state: "NSW",
    type: "University Residence",
    weeklyPrice: 320,
    lat: -32.8926,
    lng: 151.7041,
    summary: "Modern student accommodation near Newcastle campus.",
    interviewAngle: ["independence", "practical fit", "budgeting", "student living"],
    catered: false,
    distanceToCampus: "Near campus",
    contract: "Semester",
    vibe: "Practical, modern, affordable",
    tags: ["affordable", "residence", "modern"],
  },
  {
    id: "portlodge-notredame",
    name: "Port Lodge",
    university: "Notre Dame",
    city: "Perth",
    state: "WA",
    type: "University Residence",
    weeklyPrice: 350,
    lat: -32.0561,
    lng: 115.7478,
    summary: "Accommodation in Fremantle near campus with a more independent setup.",
    interviewAngle: ["independence", "fit", "practicality", "self-direction"],
    catered: false,
    distanceToCampus: "Near campus",
    contract: "Semester",
    vibe: "Simple, flexible, practical",
    tags: ["fremantle", "independent", "residence"],
  },
  {
    id: "basser-unsw",
    name: "Basser College",
    university: "UNSW",
    city: "Sydney",
    state: "NSW",
    type: "University Hall",
    weeklyPrice: 430,
    lat: -33.9177,
    lng: 151.2321,
    summary: "Good balance of independence and support in the Kensington precinct.",
    interviewAngle: ["balance", "community", "independence", "support"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Semester",
    vibe: "Balanced, practical, social",
    tags: ["unsw", "hall", "support"],
  },
  {
    id: "goldstein-unsw",
    name: "Goldstein College",
    university: "UNSW",
    city: "Sydney",
    state: "NSW",
    type: "University Hall",
    weeklyPrice: 450,
    lat: -33.9184,
    lng: 151.2312,
    summary: "Modern facilities with events and a strong social calendar.",
    interviewAngle: ["community", "contribution", "social maturity", "fit"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Semester",
    vibe: "Modern, social, active",
    tags: ["modern", "hall", "events"],
  },
  {
    id: "warrane-unsw",
    name: "Warrane College",
    university: "UNSW",
    city: "Sydney",
    state: "NSW",
    type: "Traditional Residential",
    weeklyPrice: 550,
    lat: -33.9189,
    lng: 151.2303,
    summary: "Traditional college with strong community and residential culture.",
    interviewAngle: ["community", "values", "contribution", "fit"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Traditional, values-driven, involved",
    tags: ["college", "tradition", "community"],
  },
  {
    id: "ihouse-syd",
    name: "International House",
    university: "Sydney",
    city: "Sydney",
    state: "NSW",
    type: "Traditional Residential",
    weeklyPrice: 550,
    lat: -33.8888,
    lng: 151.1881,
    summary: "Diverse international community with a strong cultural exchange atmosphere.",
    interviewAngle: ["diversity", "inclusion", "cross-cultural curiosity", "community"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "International, open, collaborative",
    tags: ["international", "diversity", "community"],
  },
  {
    id: "santasophia-syd",
    name: "Santa Sophia College",
    university: "Sydney",
    city: "Sydney",
    state: "NSW",
    type: "Womens College",
    weeklyPrice: 600,
    lat: -33.8881,
    lng: 151.1864,
    summary: "Catholic women’s college with a supportive and close community.",
    interviewAngle: ["fit", "women's environment", "values", "contribution"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Supportive, pastoral, warm",
    tags: ["women", "faith", "support"],
  },
  {
    id: "standrews-syd",
    name: "St Andrew's College",
    university: "Sydney",
    city: "Sydney",
    state: "NSW",
    type: "Large Flagship",
    weeklyPrice: 700,
    lat: -33.8884,
    lng: 151.1869,
    summary: "Prestigious college with excellent networks and premium pricing.",
    interviewAngle: [
      "leadership",
      "contribution",
      "fit in a high-involvement culture",
      "academic-social balance",
    ],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Prestigious, active, polished",
    tags: ["flagship", "network", "prestige"],
  },
  {
    id: "stjohns-syd",
    name: "St John's College",
    university: "Sydney",
    city: "Sydney",
    state: "NSW",
    type: "Traditional Residential",
    weeklyPrice: 650,
    lat: -33.8894,
    lng: 151.1872,
    summary: "Catholic college with strong traditions and residential identity.",
    interviewAngle: ["tradition", "values", "community", "fit"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Traditional, values-based, cohesive",
    tags: ["faith", "tradition", "community"],
  },
  {
    id: "stpauls-syd",
    name: "St Paul's College",
    university: "Sydney",
    city: "Sydney",
    state: "NSW",
    type: "Traditional Residential",
    weeklyPrice: 680,
    lat: -33.889,
    lng: 151.1859,
    summary: "Historic college with strong community and broad student involvement.",
    interviewAngle: ["tradition", "community", "leadership", "contribution"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Historic, involved, prestigious",
    tags: ["historic", "community", "college"],
  },
  {
    id: "womens-syd",
    name: "The Women's College",
    university: "Sydney",
    city: "Sydney",
    state: "NSW",
    type: "Womens College",
    weeklyPrice: 620,
    lat: -33.8876,
    lng: 151.1877,
    summary: "Empowering environment with strong peer support and personal development focus.",
    interviewAngle: ["women's leadership", "fit", "supportive community", "contribution"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Empowering, high-support, ambitious",
    tags: ["women", "leadership", "support"],
  },
  {
    id: "wesley-syd",
    name: "Wesley College",
    university: "Sydney",
    city: "Sydney",
    state: "NSW",
    type: "Traditional Residential",
    weeklyPrice: 640,
    lat: -33.8885,
    lng: 151.1889,
    summary: "Uniting Church college with academic focus and a values-informed environment.",
    interviewAngle: ["values", "community", "fit", "academic support"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Thoughtful, values-based, academic",
    tags: ["faith", "academic", "community"],
  },
  {
    id: "kurrajong-curtin",
    name: "Kurrajong Village",
    university: "Curtin",
    city: "Perth",
    state: "WA",
    type: "University Residence",
    weeklyPrice: 300,
    lat: -32.0061,
    lng: 115.8947,
    summary: "Independent living with flexible contracts and self-catered setup.",
    interviewAngle: ["independence", "budgeting", "practicality", "self-management"],
    catered: false,
    distanceToCampus: "On campus",
    contract: "Flexible",
    vibe: "Independent, flexible, affordable",
    tags: ["affordable", "flexible", "residence"],
  },
  {
    id: "stcatherines-curtin",
    name: "St Catherine's College",
    university: "Curtin",
    city: "Perth",
    state: "WA",
    type: "Traditional Residential",
    weeklyPrice: 610,
    lat: -31.9994,
    lng: 115.8955,
    summary: "Traditional college with community focus and meals included.",
    interviewAngle: ["community", "fit", "contribution", "college values"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Traditional, supportive, residential",
    tags: ["community", "catered", "college"],
  },
  {
    id: "stcatherines-uwa",
    name: "St Catherine's College",
    university: "UWA",
    city: "Perth",
    state: "WA",
    type: "Traditional Residential",
    weeklyPrice: 675,
    lat: -31.9817,
    lng: 115.8172,
    summary: "Strong community with academic support and meals included.",
    interviewAngle: ["community", "academic support", "contribution", "fit"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Academic, strong community, polished",
    tags: ["academic", "catered", "community"],
  },
  {
    id: "stgeorges-uwa",
    name: "St George's College",
    university: "UWA",
    city: "Perth",
    state: "WA",
    type: "Traditional Residential",
    weeklyPrice: 699,
    lat: -31.9811,
    lng: 115.8164,
    summary: "Historic college with excellent facilities and a strong residential identity.",
    interviewAngle: ["tradition", "leadership", "community", "fit"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Historic, high-involvement, prestigious",
    tags: ["historic", "college", "leadership"],
  },
  {
    id: "stthomasmore-uwa",
    name: "St Thomas More College",
    university: "UWA",
    city: "Perth",
    state: "WA",
    type: "Faith-Affiliated",
    weeklyPrice: 625,
    lat: -31.9805,
    lng: 115.8186,
    summary: "Catholic college with pastoral care and a full-board style experience.",
    interviewAngle: ["values", "service", "community", "fit"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Pastoral, grounded, supportive",
    tags: ["faith", "catholic", "community"],
  },
  {
    id: "trinityres-uwa",
    name: "Trinity Residential College",
    university: "UWA",
    city: "Perth",
    state: "WA",
    type: "Traditional Residential",
    weeklyPrice: 597,
    lat: -31.9794,
    lng: 115.8177,
    summary: "Diverse community with strong support services and residential structure.",
    interviewAngle: ["community", "fit", "support", "contribution"],
    catered: true,
    distanceToCampus: "Near campus",
    contract: "Annual",
    vibe: "Diverse, supportive, structured",
    tags: ["support", "community", "residential"],
  },
  {
    id: "unihall-uwa",
    name: "University Hall",
    university: "UWA",
    city: "Perth",
    state: "WA",
    type: "University Hall",
    weeklyPrice: 540,
    lat: -31.9808,
    lng: 115.8144,
    summary: "More independent university living with good facilities.",
    interviewAngle: ["independence", "fit", "community", "practicality"],
    catered: false,
    distanceToCampus: "Near campus",
    contract: "Semester",
    vibe: "Independent, modern, balanced",
    tags: ["hall", "independence", "modern"],
  },
  {
    id: "wsu-residences",
    name: "WSU Student Residences",
    university: "WSU",
    city: "Sydney",
    state: "NSW",
    type: "University Residence",
    weeklyPrice: 300,
    lat: -33.7741,
    lng: 150.9717,
    summary: "Modern accommodation across WSU campuses with a practical setup.",
    interviewAngle: ["practicality", "independence", "budgeting", "fit"],
    catered: false,
    distanceToCampus: "On campus",
    contract: "Semester",
    vibe: "Practical, budget-aware, modern",
    tags: ["affordable", "campus", "residence"],
  },
];

const colleges: AccommodationCollege[] = collegesRaw.map((college) => ({
  ...college,
  website: WEBSITE_BY_ID[college.id] ?? "",
}));

const privateProviders: PrivateProvider[] = [
  {
    name: "UniLodge",
    description: "Purpose-built student housing across Australia",
    price: "$400-550/week",
    city: "Australia",
    website: "https://www.unilodge.com.au/",
  },
  {
    name: "Iglu",
    description: "Modern student living in Sydney, Melbourne, Brisbane",
    price: "",
    city: "Sydney, Melbourne, Brisbane",
    website: "https://iglu.com.au/",
  },
  {
    name: "Scape",
    description: "Premium student accommodation in major cities",
    price: "",
    city: "Major cities",
    website: "https://www.scape.com.au/",
  },
  {
    name: "Student One",
    description: "Brisbane student accommodation",
    price: "$350-450/week",
    city: "Brisbane",
    website: "https://studentone.com/",
  },
  {
    name: "Urbanest",
    description: "Student accommodation in Sydney and Melbourne",
    price: "",
    city: "Sydney and Melbourne",
    website: "https://www.urbanest.com.au/",
  },
];

const accommodationTypeDescriptions: {
  title: AccommodationType;
  description: string;
  tone: string;
}[] = [
  {
    title: "Traditional Residential",
    description:
      "Strong community, catered meals, formal dinners, college sport. Very social with busy calendar.",
    tone: "border-blue-200 bg-blue-50 text-blue-700",
  },
  {
    title: "Faith-Affiliated",
    description:
      "Pastoral care, values-based community, wellbeing focus. Supportive and grounded.",
    tone: "border-violet-200 bg-violet-50 text-violet-700",
  },
  {
    title: "Large Flagship",
    description:
      "Huge networks, big events, prestige. Excellent academic and leadership opportunities.",
    tone: "border-amber-200 bg-amber-50 text-amber-700",
  },
  {
    title: "Womens College",
    description:
      "Strong peer support, safe environment, high academic focus, leadership without intimidation.",
    tone: "border-pink-200 bg-pink-50 text-pink-700",
  },
  {
    title: "University Hall",
    description:
      "Community-driven, good mix of academic and social life. Balanced structure and freedom.",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    title: "University Residence",
    description:
      "Cheaper than colleges, more independence, flexible contracts. Apartment-style living.",
    tone: "border-slate-200 bg-slate-50 text-slate-700",
  },
];

const interviewSections = [
  {
    id: "assessing",
    title: "What Colleges Are Actually Assessing",
    tone: "border-blue-200 bg-blue-50",
    icon: CircleHelp,
    points: [
      "Whether you will contribute positively to the culture of the college",
      "Whether you can balance study, independence, and community life",
      "Whether you understand what that particular college values",
      "Whether you come across as genuine, reflective, and socially mature",
    ],
  },
  {
    id: "core",
    title: "Core Interview Tips",
    tone: "border-emerald-200 bg-emerald-50",
    icon: Sparkles,
    points: [
      "Research the college properly, not just the name and price",
      "Have 2-3 specific reasons why that college suits you",
      "Show how you would contribute, not just what you want to gain",
      "Use examples from school, volunteering, leadership, tutoring, sport, or work",
    ],
  },
  {
    id: "common",
    title: "Common Questions",
    tone: "border-violet-200 bg-violet-50",
    icon: MessageSquare,
    points: [
      "Why do you want to live at this college?",
      "What would you contribute to the community?",
      "How do you handle living with other people?",
      "How would you balance study and involvement?",
    ],
  },
  {
    id: "avoid",
    title: "What NOT to Do",
    tone: "border-rose-200 bg-rose-50",
    icon: ShieldAlert,
    points: [
      "Do not sound like you only want the social side",
      "Do not give generic answers that could fit any college",
      "Do not pretend to be extroverted or hyper-confident if that is not you",
      "Do not forget to connect your personality to their community",
    ],
  },
  {
    id: "strong",
    title: "What Makes a Strong Candidate",
    tone: "border-emerald-200 bg-emerald-50",
    icon: CheckCircle2,
    points: [
      "Self-awareness",
      "Specific reasons for fit",
      "Community-mindedness",
      "Academic seriousness",
      "Genuine warmth and maturity",
    ],
  },
  {
    id: "prep",
    title: "Simple Preparation Strategy",
    tone: "border-blue-200 bg-blue-50",
    icon: BookOpen,
    points: [
      "Research the college website and values",
      "Write 5 short stories from your life that show character",
      "Practice linking those stories to college living",
      "Prepare one honest answer about why that exact college suits you",
    ],
  },
];

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function badgeTone(type: AccommodationType) {
  if (type === "Faith-Affiliated") return "border-violet-200 bg-violet-50 text-violet-700";
  if (type === "Large Flagship") return "border-amber-200 bg-amber-50 text-amber-700";
  if (type === "Womens College") return "border-pink-200 bg-pink-50 text-pink-700";
  if (type === "University Hall") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (type === "University Residence") return "border-slate-200 bg-slate-50 text-slate-700";
  if (type === "Graduate Residence") return "border-indigo-200 bg-indigo-50 text-indigo-700";
  if (type === "Private Residence") return "border-cyan-200 bg-cyan-50 text-cyan-700";
  return "border-blue-200 bg-blue-50 text-blue-700";
}

function filterByPrice(college: AccommodationCollege, priceFilter: PriceFilter) {
  const price = college.weeklyPrice;
  if (priceFilter === "Under $350") return price < 350;
  if (priceFilter === "$350-$500") return price >= 350 && price <= 500;
  if (priceFilter === "$500-$650") return price > 500 && price <= 650;
  if (priceFilter === "$650+") return price > 650;
  return true;
}

function generateQuestions(college: AccommodationCollege) {
  const emphasis = college.interviewAngle[0] || "community";
  const secondary = college.interviewAngle[1] || "fit";
  const third = college.interviewAngle[2] || "contribution";

  const typeQuestionBank: Record<AccommodationType, string[]> = {
    "Traditional Residential": [
      `How would you contribute to a strong residential college culture at ${college.name}?`,
      `What appeals to you about a more traditional college environment?`,
      `How would you balance social traditions with academic pressure?`,
      `What kind of community member do you think thrives in a college like this?`,
      `How would you handle living closely with people from very different backgrounds?`,
    ],
    "Faith-Affiliated": [
      `What attracts you to the values-based environment at ${college.name}?`,
      `How do support, service, and community show up in your life already?`,
      `What do you think respectful contribution looks like in a faith-affiliated college?`,
      `How would you fit into a pastoral and community-oriented environment?`,
      `How do your personal values shape the way you live with others?`,
    ],
    "Large Flagship": [
      `Why do you think you would suit a larger and more high-involvement college like ${college.name}?`,
      `How would you make yourself known and contribute in a bigger community?`,
      `What leadership or initiative would you bring here?`,
      `How would you balance visibility, involvement, and your academic priorities?`,
      `What kind of impact would you want to have in your first year?`,
    ],
    "Womens College": [
      `What appeals to you about a women-focused residential environment?`,
      `How would you contribute to a strong and supportive peer culture at ${college.name}?`,
      `What does leadership look like to you in a close academic community?`,
      `How do you support other people when they are under pressure?`,
      `Why does this environment suit the way you learn and live?`,
    ],
    "University Hall": [
      `What appeals to you about hall life over a more traditional college model?`,
      `How would you build community while still maintaining your independence?`,
      `What would you contribute to a hall environment like ${college.name}?`,
      `How do you manage your time when you have more freedom?`,
      `What kind of residential culture helps you perform best academically?`,
    ],
    "University Residence": [
      `Why do you think a more independent residence style suits you?`,
      `How would you stay socially connected while living in a more independent setup?`,
      `What habits would help you succeed in self-managed accommodation?`,
      `How do you approach budgeting, cooking, and daily structure?`,
      `What would make you a reliable and respectful resident?`,
    ],
    "Graduate Residence": [
      `Why does a quieter, more mature residential environment suit you?`,
      `How would you contribute to an academically focused community?`,
      `What kind of independence do you think postgraduate living requires?`,
      `How would you balance autonomy with connection?`,
      `Why are you drawn to a residence like ${college.name}?`,
    ],
    "Private Residence": [
      `What are the main advantages and trade-offs of choosing private student housing?`,
      `How would you stay organised and disciplined in a more independent environment?`,
      `How do you judge whether private accommodation is worth the cost?`,
      `What matters most to you in a self-catered residence?`,
      `How would you build routine and community without a college structure?`,
    ],
  };

  const base = [
    `Tell us about a time you had to show ${emphasis} in a group setting.`,
    `Why do you think ${college.name} is a good fit for you specifically?`,
    `What would you contribute to the ${college.university} accommodation community?`,
    `How would you balance medicine or a heavy study load with residential life?`,
    `What does ${secondary} mean to you in the context of student living?`,
    `Describe a situation where you had to adapt socially and still stay focused.`,
    `What do you think good community contribution looks like in student accommodation?`,
    `How would you support another resident who was struggling academically or socially?`,
    `What would your friends say you bring to a shared living environment?`,
    `How would you approach your first month at ${college.name}?`,
    `What does ${third} look like in practice for you?`,
  ];

  const merged = [...typeQuestionBank[college.type], ...base];

  return merged.slice(0, 5);
}

export default function AccommodationClient({
  isPremium,
}: {
  isPremium: boolean;
}) {
  // This must come from a server-side Clerk + subscription check
  const hasAccommodationAccess = isPremium;

  const [activeTab, setActiveTab] = useState<MainTab>("browse");
  const [search, setSearch] = useState("");
  const [selectedUni, setSelectedUni] = useState("All Universities");
  const [selectedType, setSelectedType] = useState("All Types");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("Name (A-Z)");
  const [mapSelectedId, setMapSelectedId] = useState<string | null>(null);

  const [typesOpen, setTypesOpen] = useState(true);

  const [interviewOpen, setInterviewOpen] = useState<Record<string, boolean>>({
    assessing: false,
    core: false,
    common: false,
    avoid: false,
    strong: false,
    prep: false,
  });

  const [selectedInterviewCollegeId, setSelectedInterviewCollegeId] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);

  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);
  const [compareSelectId, setCompareSelectId] = useState("");
  const [customCollege, setCustomCollege] = useState({
    name: "",
    university: "",
    weeklyPrice: "",
    type: "Custom Residence",
    catered: false,
    contract: "",
    distanceToCampus: "",
    vibe: "",
    notes: "",
  });

  const universities = useMemo(() => {
    return ["All Universities", ...Array.from(new Set(colleges.map((c) => c.university)))];
  }, []);

  const types = useMemo(() => {
    return ["All Types", ...Array.from(new Set(colleges.map((c) => c.type)))];
  }, []);

  const filteredColleges = useMemo(() => {
    let output = colleges.filter((college) => {
      const matchesSearch =
        search.trim() === "" ||
        college.name.toLowerCase().includes(search.toLowerCase()) ||
        college.university.toLowerCase().includes(search.toLowerCase()) ||
        college.city.toLowerCase().includes(search.toLowerCase()) ||
        college.tags.join(" ").toLowerCase().includes(search.toLowerCase());

      const matchesUni =
        selectedUni === "All Universities" || college.university === selectedUni;

      const matchesType =
        selectedType === "All Types" || college.type === selectedType;

      const matchesPrice = filterByPrice(college, priceFilter);

      return matchesSearch && matchesUni && matchesType && matchesPrice;
    });

    if (priceFilter === "Lowest Price") {
      output = [...output].sort((a, b) => a.weeklyPrice - b.weeklyPrice);
    } else if (priceFilter === "Highest Price") {
      output = [...output].sort((a, b) => b.weeklyPrice - a.weeklyPrice);
    } else {
      output = [...output].sort((a, b) => a.name.localeCompare(b.name));
    }

    return output;
  }, [search, selectedUni, selectedType, priceFilter]);

  const selectedInterviewCollege = useMemo(
    () => colleges.find((c) => c.id === selectedInterviewCollegeId) || null,
    [selectedInterviewCollegeId]
  );

  const compareSummary = useMemo(() => {
    if (compareItems.length === 0) return null;

    const total = compareItems.reduce((sum, item) => sum + item.weeklyPrice, 0);
    const avg = Math.round(total / compareItems.length);
    const cheapest = [...compareItems].sort((a, b) => a.weeklyPrice - b.weeklyPrice)[0];
    const priciest = [...compareItems].sort((a, b) => b.weeklyPrice - a.weeklyPrice)[0];

    return {
      total,
      avg,
      cheapest,
      priciest,
    };
  }, [compareItems]);

  const previewStats = useMemo(() => {
    return {
      options: colleges.length,
      universities: new Set(colleges.map((c) => c.university)).size,
      cities: new Set(colleges.map((c) => c.city)).size,
      privateProviders: privateProviders.length,
    };
  }, []);

  function addCollegeToCompare(college: AccommodationCollege) {
  if (!hasAccommodationAccess) return;

  setCompareItems((prev) => [
    ...prev,
    {
      id: `${college.id}-${makeId()}`,
      name: college.name,
      university: college.university,
      weeklyPrice: college.weeklyPrice,
      type: college.type,
      catered: college.catered,
      contract: college.contract,
      distanceToCampus: college.distanceToCampus,
      vibe: college.vibe,
      notes: college.summary,
      website: college.website,
      source: "dataset",
    },
  ]);
}

  function addSelectedCollegeToCompare() {
  if (!hasAccommodationAccess) return;
  if (!compareSelectId) return;

  const found = colleges.find((c) => c.id === compareSelectId);
  if (!found) return;

  addCollegeToCompare(found);
  setCompareSelectId("");
}

  function addCustomCollege() {
  if (!hasAccommodationAccess) return;
  if (!customCollege.name || !customCollege.university || !customCollege.weeklyPrice) return;

  setCompareItems((prev) => [
    ...prev,
    {
      id: `custom-${makeId()}`,
      name: customCollege.name,
      university: customCollege.university,
      weeklyPrice: Number(customCollege.weeklyPrice),
      type: customCollege.type,
      catered: customCollege.catered,
      contract: customCollege.contract || "Custom",
      distanceToCampus: customCollege.distanceToCampus || "Custom",
      vibe: customCollege.vibe || "Custom",
      notes: customCollege.notes,
      website: "",
      source: "custom",
    },
  ]);

  setCustomCollege({
    name: "",
    university: "",
    weeklyPrice: "",
    type: "Custom Residence",
    catered: false,
    contract: "",
    distanceToCampus: "",
    vibe: "",
    notes: "",
  });
}

  function removeCompareItem(id: string) {
    setCompareItems((prev) => prev.filter((item) => item.id !== id));
  }

  function generatePracticeQuestions() {
  if (!hasAccommodationAccess) return;
  if (!selectedInterviewCollege) return;

  setGeneratedQuestions(generateQuestions(selectedInterviewCollege));
}
  return (
    <main className="min-h-screen bg-[#eef3f8] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm">
            <span className="text-violet-600">Explore</span>
            <span>•</span>
            <span>Accommodation</span>
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="h-1 w-full rounded-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-sky-500" />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
                  <BedDouble className="h-7 w-7" />
                </div>

                <div>
                  <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
                    Student Accommodation
                  </h1>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                    Colleges, housing options, interview preparation, and side-by-side comparison
                    for Australian university accommodation.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <FeaturePreviewCard
                  title="Map and browse"
                  text="Explore accommodation visually and filter faster."
                />
                <FeaturePreviewCard
                  title="Compare properly"
                  text="Save options side-by-side and test your own numbers."
                />
                <FeaturePreviewCard
                  title="Interview prep"
                  text="Practice college interview questions with targeted prompts."
                />
                <MetricCard
                  value={String(previewStats.options)}
                  label="Options"
                  hint="accommodation entries"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Sparkles className="h-4 w-4 text-violet-500" />
                Accommodation strategy
              </div>

              <div className="mt-4 space-y-3">
                <StrategyCard
                  title="Compare more than price"
                  text="Cost matters, but so do culture, catering, contract length, and distance."
                />
                <StrategyCard
                  title="Know your fit"
                  text="Some students thrive in structured college life. Others do better with independence."
                />
                <StrategyCard
                  title="Interview with specifics"
                  text="The strongest answers show why that exact college suits you and how you would contribute."
                />
              </div>
            </div>
          </div>

          <div className="mt-8 inline-flex rounded-2xl border border-slate-200 bg-slate-100 p-1 shadow-sm">
            <TabButton
              active={activeTab === "compare"}
              label="Compare & Save"
              icon={Scale}
              onClick={() => setActiveTab("compare")}
            />
            <TabButton
              active={activeTab === "browse"}
              label="Browse Colleges"
              icon={Building2}
              onClick={() => setActiveTab("browse")}
            />
            <TabButton
              active={activeTab === "interview"}
              label="Interview Tips"
              icon={MessageSquare}
             onClick={() => setActiveTab("interview")}
            />
          </div>
        </section>

        <FeatureGate
          locked={!hasAccommodationAccess}
          title="Upgrade to unlock Accommodation"
          description="Browse the full accommodation database, compare colleges properly, and practice interview questions with Pro."
          ctaHref="/info/pricing"
          ctaLabel="Upgrade to Pro"
          previewLabel="Accommodation"
        >
          <div className="mt-6">
            {activeTab === "browse" && (
              <div className="space-y-6">
                <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
                        Accommodation Map
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Click markers to see college details
                      </p>
                    </div>
                  </div>

                  <AccommodationMap
                    colleges={filteredColleges}
                    onSelectCollege={(id) => {
                      setMapSelectedId(id);
                    }}
                  />

                  {mapSelectedId ? (
                    <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      {(() => {
                        const selected = colleges.find((c) => c.id === mapSelectedId);
                        if (!selected) return null;

                        return (
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-xl font-bold text-slate-950">
                                  {selected.name}
                                </h3>
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                                  {selected.university}
                                </span>
                                <span
                                  className={cn(
                                    "rounded-full border px-3 py-1 text-xs font-semibold",
                                    badgeTone(selected.type)
                                  )}
                                >
                                  {selected.type}
                                </span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {selected.summary}
                              </p>
                            </div>

                            <div className="text-left lg:text-right">
                              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                From
                              </p>
                              <p className="text-2xl font-black tracking-[-0.04em] text-emerald-600">
                                ${selected.weeklyPrice}
                              </p>
                              <p className="text-sm text-slate-500">/week</p>

                              {selected.website ? (
                                <a
                                  href={selected.website}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Visit website
                                </a>
                              ) : null}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : null}
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white/80 shadow-sm">
                  <button
                    onClick={() => setTypesOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Info className="h-4 w-4" />
                      </div>
                      <span className="text-base font-bold text-slate-900">
                        Understanding accommodation types
                      </span>
                    </div>

                    {typesOpen ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </button>

                  {typesOpen && (
                    <div className="grid gap-4 px-5 pb-5 md:grid-cols-2 xl:grid-cols-3">
                      {accommodationTypeDescriptions.map((item) => (
                        <div
                          key={item.title}
                          className={cn("rounded-3xl border p-4", item.tone)}
                        >
                          <h3 className="text-base font-bold">{item.title}</h3>
                          <p className="mt-2 text-sm leading-6">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <div className="grid gap-3 xl:grid-cols-4">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search colleges..."
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-sky-300"
                      />
                    </div>

                    <div className="relative">
                      <Landmark className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <select
                        value={selectedUni}
                        onChange={(e) => setSelectedUni(e.target.value)}
                        className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-sky-300"
                      >
                        {universities.map((uni) => (
                          <option key={uni} value={uni}>
                            {uni}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-sky-300"
                      >
                        {types.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <select
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value as PriceFilter)}
                        className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-sky-300"
                      >
                        <option>Name (A-Z)</option>
                        <option>Lowest Price</option>
                        <option>Highest Price</option>
                        <option>Under $350</option>
                        <option>$350-$500</option>
                        <option>$500-$650</option>
                        <option>$650+</option>
                      </select>
                    </div>
                  </div>
                </section>

                <p className="px-1 text-sm text-slate-500">
                  Showing {filteredColleges.length} accommodation options
                </p>

                <div className="grid gap-4">
                  {filteredColleges.map((college) => (
                    <div
                      key={college.id}
                      className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[0_8px_24px_rgba(15,23,42,0.045)]"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-4xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
                              {college.name}
                            </h3>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                              {college.university}
                            </span>
                          </div>

                          <div
                            className={cn(
                              "mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
                              badgeTone(college.type)
                            )}
                          >
                            {college.type}
                          </div>

                          <p className="mt-4 text-sm leading-6 text-slate-600">
                            {college.summary}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <MiniPill label={college.city} />
                            <MiniPill label={college.catered ? "Catered" : "Self-catered"} />
                            <MiniPill label={college.contract} />
                            <MiniPill label={college.distanceToCampus} />
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="text-right">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                              From
                            </p>
                            <p className="text-3xl font-black tracking-[-0.04em] text-emerald-600">
                              ${college.weeklyPrice}
                            </p>
                            <p className="text-sm text-slate-500">/week</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {college.website ? (
                              <a
                                href={college.website}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Open ${college.name} website`}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            ) : (
                              <button
                                disabled
                                aria-label={`No website available for ${college.name}`}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </button>
                            )}

                            <button
                              onClick={() => addCollegeToCompare(college)}
                              aria-label={`Add ${college.name} to compare`}
                              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                  <h2 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
                    Private Student Accommodation
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Purpose-built student housing across Australia
                  </p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {privateProviders.map((provider) => (
                      <a
                        key={provider.name}
                        href={provider.website}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-bold text-slate-950">
                              {provider.name}
                            </h3>
                            <p className="mt-2 text-xs leading-5 text-slate-500">
                              {provider.description}
                              {provider.price ? ` (${provider.price})` : ""}
                            </p>
                          </div>
                          <ExternalLink className="mt-1 h-4 w-4 text-slate-400" />
                        </div>
                        <p className="mt-3 text-xs text-slate-500">{provider.city}</p>
                      </a>
                    ))}
                  </div>
                </section>

                <section className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-emerald-900">Key Takeaway</h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-800">
                    Colleges trade cost for community and support. Residences trade structure
                    for independence. Consider what matters most to you: social life, academic
                    support, or flexibility.
                  </p>
                </section>

                <section className="rounded-3xl border border-amber-300 bg-amber-50/70 p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-amber-900">Disclaimer</h3>
                  <p className="mt-2 text-sm leading-6 text-amber-800">
                    Prices shown are the lowest possible price per week for basic accommodation.
                    Rates vary by semester, room type, and meal options. Always check official
                    college websites for current rates and availability.
                  </p>
                </section>

                <section className="rounded-3xl border border-sky-200 bg-sky-50/70 p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-sky-900">Note</h3>
                  <p className="mt-2 text-sm leading-6 text-sky-800">
                    Some links go straight to an individual college page, while others go to the
                    university&apos;s official accommodation hub if that is the most stable official
                    entry point. University of Sydney International House currently still has an
                    official page, but its availability may change.
                  </p>
                </section>
              </div>
            )}

            {activeTab === "interview" && (
              <div className="space-y-6">
                <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                  <h2 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
                    College Interview Tips
                  </h2>
                  <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
                    These are common interview tips for colleges. Always do your own research for
                    each accommodation in particular and why you really want to stay there.
                  </p>

                  <div className="mt-5 space-y-3">
                    {interviewSections.map((section) => {
                      const Icon = section.icon;
                      const open = interviewOpen[section.id];

                      return (
                        <div key={section.id} className={cn("rounded-2xl border p-4", section.tone)}>
                          <button
                            onClick={() =>
                              setInterviewOpen((prev) => ({
                                ...prev,
                                [section.id]: !prev[section.id],
                              }))
                            }
                            className="flex w-full items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4" />
                              <span className="text-sm font-semibold text-slate-800">
                                {section.title}
                              </span>
                            </div>

                            <span className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                              {open ? "Hide" : "Show"}
                            </span>
                          </button>

                          {open && (
                            <ul className="mt-4 space-y-2 pl-1 text-sm leading-6 text-slate-700">
                              {section.points.map((point) => (
                                <li key={point}>• {point}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    <span className="font-semibold">Remember:</span> Always research each
                    specific college thoroughly and be prepared to explain why you want to stay
                    there and what unique contributions you would make to their community.
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                      <Wand2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
                        College Interview Question Generator
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Generate tailored interview practice questions for specific colleges
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Select College
                    </label>
                    <select
                      value={selectedInterviewCollegeId}
                      onChange={(e) => setSelectedInterviewCollegeId(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-sky-300"
                    >
                      <option value="">Choose a college...</option>
                      {colleges
                        .filter((c) => !["Private Residence", "Graduate Residence"].includes(c.type))
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((college) => (
                          <option key={college.id} value={college.id}>
                            {college.name} ({college.university})
                          </option>
                        ))}
                    </select>
                  </div>

                  <button
                    onClick={generatePracticeQuestions}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-500 to-pink-500 px-4 py-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  >
                    <Wand2 className="h-4 w-4" />
                    Generate Practice Questions
                  </button>

                  {generatedQuestions.length > 0 && selectedInterviewCollege ? (
                    <div className="mt-6">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-xl font-bold text-slate-950">
                          Practice Questions
                        </h3>
                        <span className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                          {selectedInterviewCollege.name}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {generatedQuestions.map((question, index) => (
                          <div
                            key={`${question}-${index}`}
                            className="rounded-2xl border border-violet-200 bg-violet-50/50 px-4 py-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
                                {index + 1}
                              </div>
                              <p className="text-sm leading-6 text-slate-700">{question}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={generatePracticeQuestions}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Sparkles className="h-4 w-4" />
                        Generate New Questions
                      </button>

                      <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                        Practice answering these questions out loud. Focus on being genuine,
                        specific, and showing how you&apos;d contribute to the college community.
                      </div>
                    </div>
                  ) : null}
                </section>

                <section className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-emerald-900">Remember</h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-800">
                    Always research each specific college thoroughly and be prepared to explain
                    why you want to stay there and what unique contributions you would make to
                    their community.
                  </p>
                </section>
              </div>
            )}

            {activeTab === "compare" && (
              <div className="space-y-6">
                <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                      <Scale className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
                        Compare Colleges
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Compare as many colleges side-by-side as you want
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
                    <select
                      value={compareSelectId}
                      onChange={(e) => setCompareSelectId(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-sky-300"
                    >
                      <option value="">Select college to compare</option>
                      {colleges.map((college) => (
                        <option key={college.id} value={college.id}>
                          {college.name} ({college.university})
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={addSelectedCollegeToCompare}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>
                  </div>

                  <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-lg font-bold text-slate-950">Add Your Own Custom College</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Play around with your own numbers and compare intra-college options
                    </p>

                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <Input
                        label="College name"
                        value={customCollege.name}
                        onChange={(value) =>
                          setCustomCollege((prev) => ({ ...prev, name: value }))
                        }
                        placeholder="eg. My Custom College"
                      />
                      <Input
                        label="University"
                        value={customCollege.university}
                        onChange={(value) =>
                          setCustomCollege((prev) => ({ ...prev, university: value }))
                        }
                        placeholder="eg. Monash"
                      />
                      <Input
                        label="Weekly price"
                        value={customCollege.weeklyPrice}
                        onChange={(value) =>
                          setCustomCollege((prev) => ({ ...prev, weeklyPrice: value }))
                        }
                        placeholder="eg. 520"
                      />
                      <Input
                        label="Type"
                        value={customCollege.type}
                        onChange={(value) =>
                          setCustomCollege((prev) => ({ ...prev, type: value }))
                        }
                        placeholder="eg. Private Residence"
                      />
                      <Input
                        label="Contract"
                        value={customCollege.contract}
                        onChange={(value) =>
                          setCustomCollege((prev) => ({ ...prev, contract: value }))
                        }
                        placeholder="eg. 40-week"
                      />
                      <Input
                        label="Distance"
                        value={customCollege.distanceToCampus}
                        onChange={(value) =>
                          setCustomCollege((prev) => ({ ...prev, distanceToCampus: value }))
                        }
                        placeholder="eg. 10 min walk"
                      />
                      <Input
                        label="Vibe"
                        value={customCollege.vibe}
                        onChange={(value) =>
                          setCustomCollege((prev) => ({ ...prev, vibe: value }))
                        }
                        placeholder="eg. Quiet and independent"
                      />
                      <div className="flex items-end">
                        <label className="flex h-12 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={customCollege.catered}
                            onChange={(e) =>
                              setCustomCollege((prev) => ({
                                ...prev,
                                catered: e.target.checked,
                              }))
                            }
                          />
                          Catered
                        </label>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Notes
                      </label>
                      <textarea
                        value={customCollege.notes}
                        onChange={(e) =>
                          setCustomCollege((prev) => ({ ...prev, notes: e.target.value }))
                        }
                        rows={3}
                        placeholder="Any extra stats or notes..."
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-300"
                      />
                    </div>

                    <button
                      onClick={addCustomCollege}
                      className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-violet-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                    >
                      <Plus className="h-4 w-4" />
                      Add Custom College
                    </button>
                  </div>

                  {compareItems.length === 0 ? (
                    <div className="mt-6 flex min-h-70 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                        <Scale className="h-8 w-8" />
                      </div>
                      <p className="mt-5 text-lg font-semibold text-slate-700">
                        No colleges selected
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        Add colleges to compare them
                      </p>
                    </div>
                  ) : (
                    <>
                      {compareSummary ? (
                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                          <StatCard
                            label="Average Price"
                            value={`$${compareSummary.avg}/week`}
                            icon={Sparkles}
                          />
                          <StatCard
                            label="Cheapest"
                            value={`${compareSummary.cheapest.name} • $${compareSummary.cheapest.weeklyPrice}`}
                            icon={CheckCircle2}
                          />
                          <StatCard
                            label="Highest"
                            value={`${compareSummary.priciest.name} • $${compareSummary.priciest.weeklyPrice}`}
                            icon={ShieldAlert}
                          />
                        </div>
                      ) : null}

                      <div className="mt-6 grid gap-4 xl:grid-cols-2">
                        {compareItems.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="text-lg font-bold text-slate-950">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-slate-500">{item.university}</p>

                                <div
                                  className={cn(
                                    "mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
                                    badgeTone(item.type as AccommodationType)
                                  )}
                                >
                                  {item.type}
                                </div>

                                <div className="mt-3 space-y-1 text-sm text-slate-600">
                                  <p>💰 ${item.weeklyPrice}/week</p>
                                  <p>🍽 {item.catered ? "Catered" : "Self-catered"}</p>
                                  <p>📄 {item.contract}</p>
                                  <p>📍 {item.distanceToCampus}</p>
                                  <p>🎯 {item.vibe}</p>
                                </div>

                                {item.notes ? (
                                  <p className="mt-3 text-sm text-slate-500">{item.notes}</p>
                                ) : null}

                                {item.website ? (
                                  <a
                                    href={item.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    Open website
                                  </a>
                                ) : null}
                              </div>

                              <button
                                onClick={() => removeCompareItem(item.id)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </section>
              </div>
            )}
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
      >
        {children}
      </div>

      {locked ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
          <div className="max-w-md rounded-3xl border bg-white p-6 text-center shadow-xl">
            <Lock className="mx-auto mb-3 h-6 w-6" />
            <p className="text-xs uppercase tracking-widest text-slate-500">
              {previewLabel}
            </p>
            <h3 className="mt-2 text-xl font-bold">{title}</h3>
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

function FeaturePreviewCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-4">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
}

function MetricCard({
  value,
  label,
  hint,
}: {
  value: string;
  label: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
      {hint ? <p className="text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

function StrategyCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-3">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
}

function TabButton({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: any;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-xl px-4 py-2 text-sm",
        active ? "bg-white shadow" : "text-slate-500"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function MiniPill({ label }: { label: string }) {
  return <span className="rounded-full border px-3 py-1 text-xs">{label}</span>;
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-slate-500">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-400" />
        <p className="text-sm text-slate-500">{label}</p>
      </div>
      <p className="mt-2 font-bold">{value}</p>
    </div>
  );
}