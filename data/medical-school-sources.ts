import type { MedicalSchoolSourceSeed } from "@/lib/medical-schools/types/medical-schools";

export const medicalSchoolSources: MedicalSchoolSourceSeed[] = [
  // =========================================================
  // SYSTEM-WIDE
  // =========================================================
  {
    schoolSlug: "ucat",
    schoolName: "UCAT ANZ",
    sourceType: "admissions",
    url: "https://www.ucat.edu.au/",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "ucat",
    schoolName: "UCAT ANZ",
    sourceType: "admissions",
    url: "https://www.ucat.edu.au/about-ucat-anz/ucat-anz-test-cycle/",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "ucat",
    schoolName: "UCAT ANZ",
    sourceType: "news",
    url: "https://www.ucat.edu.au/news/",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "gemsas",
    schoolName: "GEMSAS",
    sourceType: "admissions",
    url: "https://gemsas.edu.au/",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "gemsas",
    schoolName: "GEMSAS",
    sourceType: "admissions",
    url: "https://gemsas.edu.au/guides/medicine",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "uac",
    schoolName: "UAC",
    sourceType: "news",
    url: "https://www.uac.edu.au/media-centre/news",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "qtac",
    schoolName: "QTAC",
    sourceType: "news",
    url: "https://www.qtac.edu.au/media-centre/",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "vtac",
    schoolName: "VTAC",
    sourceType: "news",
    url: "https://vtac.edu.au/mediacentre",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "satac",
    schoolName: "SATAC",
    sourceType: "news",
    url: "https://www.satac.edu.au/news_items",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "tisc",
    schoolName: "TISC",
    sourceType: "news",
    url: "https://www.tisc.edu.au/static/misc/news.tisc",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "ahpra",
    schoolName: "AHPRA",
    sourceType: "news",
    url: "https://www.ahpra.gov.au/News.aspx",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // UQ
  // =========================================================
  {
    schoolSlug: "uq",
    schoolName: "The University of Queensland",
    sourceType: "course",
    url: "https://study.uq.edu.au/study-options/programs/doctor-medicine-5740",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "uq",
    schoolName: "The University of Queensland",
    sourceType: "admissions",
    url: "https://study.uq.edu.au/admissions/doctor-medicine",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "uq",
    schoolName: "The University of Queensland",
    sourceType: "pathway",
    url: "https://study.uq.edu.au/admissions/doctor-medicine/provisional-entry",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "uq",
    schoolName: "The University of Queensland",
    sourceType: "news",
    url: "https://study.uq.edu.au/stories/uqs-new-pathway-doctor-medicine",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // UNSW
  // =========================================================
  {
    schoolSlug: "unsw",
    schoolName: "UNSW Sydney",
    sourceType: "course",
    url: "https://www.unsw.edu.au/study/undergraduate/bachelor-of-medical-studies-doctor-of-medicine",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "unsw",
    schoolName: "UNSW Sydney",
    sourceType: "admissions",
    url: "https://www.unsw.edu.au/medicine-health/study-with-us/undergraduate/applying-to-medicine/local-applicants",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "unsw",
    schoolName: "UNSW Sydney",
    sourceType: "pathway",
    url: "https://www.unsw.edu.au/medicine-health/study-with-us/undergraduate/applying-to-medicine/special-entry-schemes",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // MONASH
  // =========================================================
  {
    schoolSlug: "monash",
    schoolName: "Monash University",
    sourceType: "course",
    url: "https://www.monash.edu/study/courses/find-a-course/medical-science-and-medicine-direct-entry-m6011",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // MELBOURNE
  // =========================================================
  {
    schoolSlug: "melbourne",
    schoolName: "University of Melbourne",
    sourceType: "course",
    url: "https://study.unimelb.edu.au/find/courses/graduate/doctor-of-medicine/",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "melbourne",
    schoolName: "University of Melbourne",
    sourceType: "admissions",
    url: "https://study.unimelb.edu.au/find/courses/graduate/doctor-of-medicine/entry-requirements/",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "melbourne",
    schoolName: "University of Melbourne",
    sourceType: "admissions",
    url: "https://study.unimelb.edu.au/find/courses/graduate/doctor-of-medicine/how-to-apply/",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // NEWCASTLE / UNE JMP
  // =========================================================
  {
    schoolSlug: "newcastle-une",
    schoolName: "University of Newcastle / UNE Joint Medical Program",
    sourceType: "admissions",
    url: "https://www.newcastle.edu.au/joint-medical-program/how-to-apply",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "newcastle-une",
    schoolName: "University of Newcastle / UNE Joint Medical Program",
    sourceType: "pathway",
    url: "https://www.newcastle.edu.au/joint-medical-program/how-to-apply/entry-support-schemes",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // BOND
  // =========================================================
  {
    schoolSlug: "bond",
    schoolName: "Bond University",
    sourceType: "course",
    url: "https://bond.edu.au/program/medical-program-bachelor-of-medical-studies-doctor-of-medicine",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "bond",
    schoolName: "Bond University",
    sourceType: "admissions",
    url: "https://bond.edu.au/program/medical-program/medical-program-important-dates-deadlines",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // UOW
  // =========================================================
  {
    schoolSlug: "wollongong",
    schoolName: "University of Wollongong",
    sourceType: "admissions",
    url: "https://www.uow.edu.au/study/doctor-of-medicine/domestic-applicants/",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // WSU
  // =========================================================
  {
    schoolSlug: "wsu",
    schoolName: "Western Sydney University",
    sourceType: "admissions",
    url: "https://www.westernsydney.edu.au/future/study/how-to-apply/md-applicants/important-dates-and-deadlines",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // UWA
  // =========================================================
  {
    schoolSlug: "uwa",
    schoolName: "University of Western Australia",
    sourceType: "course",
    url: "https://www.uwa.edu.au/study/courses/doctor-of-MEDICINE",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // JCU
  // =========================================================
  {
    schoolSlug: "jcu",
    schoolName: "James Cook University",
    sourceType: "admissions",
    url: "https://www.jcu.edu.au/applying-to-jcu/domestic/undergraduate-applications/medicine-dentistry-and-veterinary-science",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // GRIFFITH
  // =========================================================
  {
    schoolSlug: "griffith",
    schoolName: "Griffith University",
    sourceType: "pathway",
    url: "https://www.griffith.edu.au/griffith-health/medicine-pathway",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // CQU -> UQ
  // =========================================================
  {
    schoolSlug: "cqu-uq",
    schoolName: "CQUniversity Australia -> UQ Medicine Pathway",
    sourceType: "pathway",
    url: "https://www.cqu.edu.au/courses/700125/bachelor-of-medical-science-pathway-to-medicine",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // UniSQ -> UQ
  // =========================================================
  {
    schoolSlug: "unisq",
    schoolName: "University of Southern Queensland",
    sourceType: "pathway",
    url: "https://www.unisq.edu.au/study/degrees-and-courses/bachelor-of-biomedical-sciences-medicine-pathway",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // QUT MEDICINE
  // =========================================================
  {
    schoolSlug: "qut-medicine",
    schoolName: "QUT Medicine",
    sourceType: "school",
    url: "https://www.qut.edu.au/about/faculty-of-health/school-of-medicine",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "qut-medicine",
    schoolName: "QUT Medicine",
    sourceType: "news",
    url: "https://www.qut.edu.au/insights/health/qut-medical-programyour-questions-answered",
    checkFrequencyHours: 48,
  },
    // =========================================================
  // ADELAIDE
  // =========================================================
  {
    schoolSlug: "adelaide",
    schoolName: "University of Adelaide",
    sourceType: "admissions",
    url: "https://health.adelaide.edu.au/study-with-us/admission-and-application-guides",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "adelaide",
    schoolName: "University of Adelaide",
    sourceType: "school",
    url: "https://health.adelaide.edu.au/medicine/",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "adelaide",
    schoolName: "University of Adelaide",
    sourceType: "admissions",
    url: "https://future.ask.adelaide.edu.au/app/answers/detail/a_id/2731/~/medicine%2C-dentistry-and-oral-health-admissions-guides",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // ANU
  // =========================================================
  {
    schoolSlug: "anu",
    schoolName: "Australian National University",
    sourceType: "course",
    url: "https://programsandcourses.anu.edu.au/program/8950xmchd",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "anu",
    schoolName: "Australian National University",
    sourceType: "admissions",
    url: "https://science.anu.edu.au/study/how-apply/doctor-medicine-and-surgery-guidelines",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "anu",
    schoolName: "Australian National University",
    sourceType: "pathway",
    url: "https://science.anu.edu.au/study/how-apply/doctor-medicine-and-surgery-bhlth",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // BOND
  // =========================================================
  {
    schoolSlug: "bond",
    schoolName: "Bond University",
    sourceType: "admissions",
    url: "https://bond.edu.au/medical-program-entry-requirements",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "bond",
    schoolName: "Bond University",
    sourceType: "admissions",
    url: "https://bond.edu.au/program/medical-program/medical-program-frequently-asked-questions",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // CDU
  // =========================================================
  {
    schoolSlug: "cdu",
    schoolName: "Charles Darwin University",
    sourceType: "course",
    url: "https://www.cdu.edu.au/study/medicine",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "cdu",
    schoolName: "Charles Darwin University",
    sourceType: "school",
    url: "https://www.cdu.edu.au/health/cdu-menzies-medical-program",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "cdu",
    schoolName: "Charles Darwin University",
    sourceType: "admissions",
    url: "https://www.cdu.edu.au/health/cdu-menzies-medical-program/medical-program-details",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // CURTIN
  // =========================================================
  {
    schoolSlug: "curtin",
    schoolName: "Curtin University",
    sourceType: "school",
    url: "https://www.curtin.edu.au/about/learning-teaching/health-sciences/curtin-medical-school/",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // DEAKIN
  // =========================================================
  {
    schoolSlug: "deakin",
    schoolName: "Deakin University",
    sourceType: "course",
    url: "https://www.deakin.edu.au/course/doctor-medicine",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "deakin",
    schoolName: "Deakin University",
    sourceType: "school",
    url: "https://www.deakin.edu.au/faculty-of-health/school-of-medicine",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "deakin",
    schoolName: "Deakin University",
    sourceType: "school",
    url: "https://www.deakin.edu.au/study/find-a-course/medicine",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // FLINDERS
  // =========================================================
  {
    schoolSlug: "flinders",
    schoolName: "Flinders University",
    sourceType: "course",
    url: "https://www.flinders.edu.au/study/courses/postgraduate-doctor-medicine",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "flinders",
    schoolName: "Flinders University",
    sourceType: "pathway",
    url: "https://www.flinders.edu.au/study/courses/bachelor-clinical-sciences-doctor-medicine",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "flinders",
    schoolName: "Flinders University",
    sourceType: "admissions",
    url: "https://www.flinders.edu.au/content/dam/documents/study/domestic/apply/md-admissions-guide.pdf",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // GRIFFITH
  // =========================================================
  {
    schoolSlug: "griffith",
    schoolName: "Griffith University",
    sourceType: "course",
    url: "https://www.griffith.edu.au/study/degrees/doctor-of-medicine-5099",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "griffith",
    schoolName: "Griffith University",
    sourceType: "pathway",
    url: "https://www.griffith.edu.au/study/degrees/bachelor-of-medical-science-1280",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "griffith",
    schoolName: "Griffith University",
    sourceType: "pathway",
    url: "https://www.griffith.edu.au/gumurrii/apply-to-study",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // JCU
  // =========================================================
  {
    schoolSlug: "jcu",
    schoolName: "James Cook University",
    sourceType: "course",
    url: "https://www.jcu.edu.au/courses/bachelor-of-medicine-bachelor-of-surgery",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "jcu",
    schoolName: "James Cook University",
    sourceType: "admissions",
    url: "https://www.jcu.edu.au/applying-to-jcu/domestic/undergraduate-applications/medicine-dentistry-and-veterinary-science/faqs",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "jcu",
    schoolName: "James Cook University",
    sourceType: "admissions",
    url: "https://selection.jcu.edu.au/",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // MACQUARIE
  // =========================================================
  {
    schoolSlug: "macquarie",
    schoolName: "Macquarie University",
    sourceType: "course",
    url: "https://www.mq.edu.au/study/find-a-course/courses/doctor-of-medicine",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "macquarie",
    schoolName: "Macquarie University",
    sourceType: "school",
    url: "https://www.mq.edu.au/faculty-of-medicine-health-and-human-sciences/macquarie-md",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "macquarie",
    schoolName: "Macquarie University",
    sourceType: "school",
    url: "https://www.mq.edu.au/faculty-of-medicine-health-and-human-sciences/macquarie-md/about-the-macquarie-md",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // MONASH
  // =========================================================
  {
    schoolSlug: "monash",
    schoolName: "Monash University",
    sourceType: "admissions",
    url: "https://www.monash.edu/medicine/som/direct-entry/international/applications-fees",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // SYDNEY
  // =========================================================
  {
    schoolSlug: "sydney",
    schoolName: "University of Sydney",
    sourceType: "course",
    url: "https://www.sydney.edu.au/courses/courses/pc/doctor-of-medicine0.html",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "sydney",
    schoolName: "University of Sydney",
    sourceType: "school",
    url: "https://www.sydney.edu.au/medicine-health/study-medicine-and-health/postgraduate-courses/doctor-of-medicine.html",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "sydney",
    schoolName: "University of Sydney",
    sourceType: "pathway",
    url: "https://www.sydney.edu.au/courses/courses/uc/bachelor-of-science-and-doctor-of-medicine.html",
    checkFrequencyHours: 48,
  },

  // =========================================================
  // TASMANIA
  // =========================================================
  {
    schoolSlug: "tasmania",
    schoolName: "University of Tasmania",
    sourceType: "course",
    url: "https://www.utas.edu.au/courses/health/courses/h3x-bachelor-of-medical-science-and-doctor-of-medicine",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "tasmania",
    schoolName: "University of Tasmania",
    sourceType: "school",
    url: "https://www.utas.edu.au/study/undergraduate/medicine",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "tasmania",
    schoolName: "University of Tasmania",
    sourceType: "admissions",
    url: "https://www.utas.edu.au/study/apply/admission-requirements",
    checkFrequencyHours: 48,
  },
  {
    schoolSlug: "tasmania",
    schoolName: "University of Tasmania",
    sourceType: "school",
    url: "https://www.utas.edu.au/about/academic-structure/medicine",
    checkFrequencyHours: 48,
  },
];