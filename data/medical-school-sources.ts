export type MedicalSchoolSource = {
  schoolSlug: string;
  schoolName: string;
  sourceType: "course" | "admissions" | "news" | "pathway" | "school";
  url: string;
  checkFrequencyHours: number;
};

export const medicalSchoolSources: MedicalSchoolSource[] = [
  // 1. Adelaide
  {
    schoolSlug: "adelaide",
    schoolName: "University of Adelaide",
    sourceType: "school",
    url: "https://health.adelaide.edu.au/medicine/",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "adelaide",
    schoolName: "University of Adelaide",
    sourceType: "course",
    url: "https://calendar.adelaide.edu.au/aprcw/2024/bms_bmedstud",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "adelaide",
    schoolName: "University of Adelaide",
    sourceType: "admissions",
    url: "https://future.ask.adelaide.edu.au/app/answers/detail/a_id/3425/~/2024-entry---preference-guide---i-want-to-be-a-doctor",
    checkFrequencyHours: 24,
  },

  // 2. ANU
  {
    schoolSlug: "anu",
    schoolName: "Australian National University",
    sourceType: "course",
    url: "https://programsandcourses.anu.edu.au/program/8950xmchd",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "anu",
    schoolName: "Australian National University",
    sourceType: "pathway",
    url: "https://science.anu.edu.au/study/how-apply/doctor-medicine-and-surgery-bhlth",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "anu",
    schoolName: "Australian National University",
    sourceType: "admissions",
    url: "https://science.anu.edu.au/study/how-apply/doctor-medicine-and-surgery-guidelines",
    checkFrequencyHours: 24,
  },

  // 3. Bond
  {
    schoolSlug: "bond",
    schoolName: "Bond University",
    sourceType: "course",
    url: "https://bond.edu.au/program/medical-program-bachelor-of-medical-studies-doctor-of-medicine",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "bond",
    schoolName: "Bond University",
    sourceType: "admissions",
    url: "https://bond.edu.au/medical-program-entry-requirements",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "bond",
    schoolName: "Bond University",
    sourceType: "news",
    url: "https://bond.edu.au/program/medical-program/medical-program-important-dates-deadlines",
    checkFrequencyHours: 24,
  },

  // 4. CDU
  {
    schoolSlug: "cdu",
    schoolName: "Charles Darwin University",
    sourceType: "course",
    url: "https://www.cdu.edu.au/study/medicine",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "cdu",
    schoolName: "Charles Darwin University",
    sourceType: "admissions",
    url: "https://www.cdu.edu.au/study/course/bachelor-clinical-science-medicinedoctor-medicine-smed01",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "cdu",
    schoolName: "Charles Darwin University",
    sourceType: "school",
    url: "https://www.cdu.edu.au/health/clinical-science",
    checkFrequencyHours: 24,
  },

  // 5. Curtin
  {
    schoolSlug: "curtin",
    schoolName: "Curtin University",
    sourceType: "course",
    url: "https://www.curtin.edu.au/study/offering/course-ug-bachelor-of-medicine-bachelor-of-surgery--b-mbbs/",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "curtin",
    schoolName: "Curtin University",
    sourceType: "school",
    url: "https://www.curtin.edu.au/about/learning-teaching/health-sciences/curtin-medical-school/",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "curtin",
    schoolName: "Curtin University",
    sourceType: "admissions",
    url: "https://www.curtin.edu.au/study/undergraduate/early-offers/",
    checkFrequencyHours: 24,
  },

  // 6. Deakin
  {
    schoolSlug: "deakin",
    schoolName: "Deakin University",
    sourceType: "course",
    url: "https://www.deakin.edu.au/course/doctor-medicine",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "deakin",
    schoolName: "Deakin University",
    sourceType: "school",
    url: "https://www.deakin.edu.au/faculty-of-health/school-of-medicine",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "deakin",
    schoolName: "Deakin University",
    sourceType: "course",
    url: "https://www.deakin.edu.au/study/find-a-course/medicine",
    checkFrequencyHours: 24,
  },

  // 7. Flinders
  {
    schoolSlug: "flinders",
    schoolName: "Flinders University",
    sourceType: "course",
    url: "https://www.flinders.edu.au/study/courses/postgraduate-doctor-medicine",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "flinders",
    schoolName: "Flinders University",
    sourceType: "pathway",
    url: "https://www.flinders.edu.au/study/courses/bachelor-clinical-sciences-doctor-medicine",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "flinders",
    schoolName: "Flinders University",
    sourceType: "admissions",
    url: "https://handbook.flinders.edu.au/courses/2026/md",
    checkFrequencyHours: 24,
  },

  // 8. Griffith
  {
    schoolSlug: "griffith",
    schoolName: "Griffith University",
    sourceType: "course",
    url: "https://www.griffith.edu.au/study/degrees/doctor-of-medicine-5099",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "griffith",
    schoolName: "Griffith University",
    sourceType: "pathway",
    url: "https://www.griffith.edu.au/study/degrees/bachelor-of-medical-science-1280",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "griffith",
    schoolName: "Griffith University",
    sourceType: "pathway",
    url: "https://www.griffith.edu.au/griffith-health/medicine-pathway",
    checkFrequencyHours: 24,
  },

  // 9. JCU
  {
    schoolSlug: "jcu",
    schoolName: "James Cook University",
    sourceType: "course",
    url: "https://www.jcu.edu.au/courses/bachelor-of-medicine-bachelor-of-surgery",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "jcu",
    schoolName: "James Cook University",
    sourceType: "school",
    url: "https://www.jcu.edu.au/courses/study/medicine",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "jcu",
    schoolName: "James Cook University",
    sourceType: "admissions",
    url: "https://handbook.jcu.edu.au/course/2025/72010",
    checkFrequencyHours: 24,
  },

  // 10. Macquarie
  {
    schoolSlug: "macquarie",
    schoolName: "Macquarie University",
    sourceType: "course",
    url: "https://www.mq.edu.au/study/find-a-course/courses/doctor-of-medicine",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "macquarie",
    schoolName: "Macquarie University",
    sourceType: "school",
    url: "https://www.mq.edu.au/faculty-of-medicine-health-and-human-sciences/macquarie-md",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "macquarie",
    schoolName: "Macquarie University",
    sourceType: "admissions",
    url: "https://www.mq.edu.au/faculty-of-medicine-health-and-human-sciences/macquarie-md/about-the-macquarie-md",
    checkFrequencyHours: 24,
  },

  // 11. Monash
  {
    schoolSlug: "monash",
    schoolName: "Monash University",
    sourceType: "course",
    url: "https://www.monash.edu/study/courses/find-a-course/medical-science-and-medicine-direct-entry-m6011",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "monash",
    schoolName: "Monash University",
    sourceType: "admissions",
    url: "https://www.monash.edu/medicine/som/direct-entry",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "monash",
    schoolName: "Monash University",
    sourceType: "pathway",
    url: "https://www.monash.edu/study/courses/find-a-course/medical-science-and-medicine-graduate-entry-m6018",
    checkFrequencyHours: 24,
  },

  // 12. Melbourne
  {
    schoolSlug: "melbourne",
    schoolName: "University of Melbourne",
    sourceType: "course",
    url: "https://study.unimelb.edu.au/find/courses/graduate/doctor-of-medicine/",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "melbourne",
    schoolName: "University of Melbourne",
    sourceType: "admissions",
    url: "https://study.unimelb.edu.au/find/courses/graduate/doctor-of-medicine/entry-requirements/",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "melbourne",
    schoolName: "University of Melbourne",
    sourceType: "admissions",
    url: "https://study.unimelb.edu.au/find/courses/graduate/doctor-of-medicine/how-to-apply/",
    checkFrequencyHours: 24,
  },

  // 13. Newcastle / UNE JMP
  {
    schoolSlug: "newcastle-une",
    schoolName: "University of Newcastle / UNE Joint Medical Program",
    sourceType: "course",
    url: "https://www.newcastle.edu.au/degrees/bachelor-of-medical-science-doctor-of-medicine-joint-medical-program",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "newcastle-une",
    schoolName: "University of Newcastle / UNE Joint Medical Program",
    sourceType: "admissions",
    url: "https://www.newcastle.edu.au/joint-medical-program/how-to-apply",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "newcastle-une",
    schoolName: "University of Newcastle / UNE Joint Medical Program",
    sourceType: "school",
    url: "https://www.newcastle.edu.au/joint-medical-program/about-the-jmp",
    checkFrequencyHours: 24,
  },

  // 14. Notre Dame
  {
    schoolSlug: "notre-dame",
    schoolName: "University of Notre Dame Australia",
    sourceType: "course",
    url: "https://www.notredame.edu.au/programs/school-of-medicine/postgraduate/doctor-of-medicine-wa",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "notre-dame",
    schoolName: "University of Notre Dame Australia",
    sourceType: "course",
    url: "https://www.notredame.edu.au/programs/school-of-medicine/postgraduate/doctor-of-medicine-nsw",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "notre-dame",
    schoolName: "University of Notre Dame Australia",
    sourceType: "pathway",
    url: "https://www.notredame.edu.au/study/applications-and-admissions/pathways/pathways-to-medicine",
    checkFrequencyHours: 24,
  },

  // 15. UQ
  {
    schoolSlug: "uq",
    schoolName: "University of Queensland",
    sourceType: "admissions",
    url: "https://study.uq.edu.au/admissions/doctor-medicine",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "uq",
    schoolName: "University of Queensland",
    sourceType: "course",
    url: "https://study.uq.edu.au/study-options/programs/doctor-medicine-5740",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "uq",
    schoolName: "University of Queensland",
    sourceType: "news",
    url: "https://study.uq.edu.au/stories/uqs-new-pathway-doctor-medicine",
    checkFrequencyHours: 12,
  },

  // 16. UWA
  {
    schoolSlug: "uwa",
    schoolName: "University of Western Australia",
    sourceType: "course",
    url: "https://www.uwa.edu.au/study/courses/doctor-of-MEDICINE",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "uwa",
    schoolName: "University of Western Australia",
    sourceType: "pathway",
    url: "https://www.uwa.edu.au/study/explore-courses/assured-pathways",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "uwa",
    schoolName: "University of Western Australia",
    sourceType: "admissions",
    url: "https://handbooks.uwa.edu.au/rules?code=90850",
    checkFrequencyHours: 24,
  },

  // 17. Sydney
  {
    schoolSlug: "sydney",
    schoolName: "University of Sydney",
    sourceType: "course",
    url: "https://www.sydney.edu.au/courses/courses/pc/doctor-of-medicine0.html",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "sydney",
    schoolName: "University of Sydney",
    sourceType: "school",
    url: "https://www.sydney.edu.au/medicine-health/study-medicine-and-health/postgraduate-courses/doctor-of-medicine.html",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "sydney",
    schoolName: "University of Sydney",
    sourceType: "pathway",
    url: "https://www.sydney.edu.au/medicine-health/study-medicine-and-health/study-areas/medicine-and-surgery/how-to-become-a-doctor.html",
    checkFrequencyHours: 24,
  },

  // 18. UNSW
  {
    schoolSlug: "unsw",
    schoolName: "UNSW Sydney",
    sourceType: "course",
    url: "https://www.unsw.edu.au/study/undergraduate/bachelor-of-medical-studies-doctor-of-medicine",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "unsw",
    schoolName: "UNSW Sydney",
    sourceType: "admissions",
    url: "https://www.unsw.edu.au/medicine-health/study-with-us/undergraduate/applying-to-medicine/local-applicants",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "unsw",
    schoolName: "UNSW Sydney",
    sourceType: "pathway",
    url: "https://www.unsw.edu.au/medicine-health/study-with-us/undergraduate/applying-to-medicine/special-entry-schemes",
    checkFrequencyHours: 24,
  },

  // 19. Tasmania
  {
    schoolSlug: "tasmania",
    schoolName: "University of Tasmania",
    sourceType: "course",
    url: "https://www.utas.edu.au/courses/health/courses/h3x-bachelor-of-medical-science-and-doctor-of-medicine",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "tasmania",
    schoolName: "University of Tasmania",
    sourceType: "school",
    url: "https://www.utas.edu.au/study/undergraduate/medicine",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "tasmania",
    schoolName: "University of Tasmania",
    sourceType: "admissions",
    url: "https://www.utas.edu.au/study/apply/admission-requirements",
    checkFrequencyHours: 24,
  },

  // 20. Wollongong
  {
    schoolSlug: "uow",
    schoolName: "University of Wollongong",
    sourceType: "course",
    url: "https://www.uow.edu.au/study/courses/doctor-of-medicine/",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "uow",
    schoolName: "University of Wollongong",
    sourceType: "admissions",
    url: "https://www.uow.edu.au/study/doctor-of-medicine/domestic-applicants/",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "uow",
    schoolName: "University of Wollongong",
    sourceType: "school",
    url: "https://www.uow.edu.au/science-medicine-health/graduate-school-of-medicine/",
    checkFrequencyHours: 24,
  },

  // 21. WSU
  {
    schoolSlug: "wsu",
    schoolName: "Western Sydney University",
    sourceType: "course",
    url: "https://www.westernsydney.edu.au/future/study/courses/undergraduate/doctor-of-medicine",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "wsu",
    schoolName: "Western Sydney University",
    sourceType: "school",
    url: "https://www.westernsydney.edu.au/schools/som",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "wsu",
    schoolName: "Western Sydney University",
    sourceType: "pathway",
    url: "https://www.westernsydney.edu.au/future/study/courses/undergraduate/bachelor-of-medical-research",
    checkFrequencyHours: 24,
  },

  // 22. CSU / WSU
  {
    schoolSlug: "csu-wsu",
    schoolName: "Charles Sturt University / Western Sydney University",
    sourceType: "course",
    url: "https://study.csu.edu.au/courses/bachelor-clinical-science-medicine-doctor-medicine",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "csu-wsu",
    schoolName: "Charles Sturt University / Western Sydney University",
    sourceType: "school",
    url: "https://science-health.csu.edu.au/schools/medicine",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "csu-wsu",
    schoolName: "Charles Sturt University / Western Sydney University",
    sourceType: "admissions",
    url: "https://handbook.csu.edu.au/course/2026/4921me01",
    checkFrequencyHours: 24,
  },

  // 23. UniSQ
  {
    schoolSlug: "unisq",
    schoolName: "University of Southern Queensland",
    sourceType: "course",
    url: "https://www.unisq.edu.au/study/degrees-and-courses/bachelor-of-biomedical-sciences-medicine-pathway",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "unisq",
    schoolName: "University of Southern Queensland",
    sourceType: "pathway",
    url: "https://www.unisq.edu.au/study/degrees-and-courses/major/medicine-pathway-bachelor-biomedical-sciences",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "unisq",
    schoolName: "University of Southern Queensland",
    sourceType: "news",
    url: "https://www.unisq.edu.au/news/2025/03/medicine-pathway-welcome",
    checkFrequencyHours: 24,
  },

  // 24. CQU -> UQ Medicine
  {
    schoolSlug: "cqu-uq",
    schoolName: "CQUniversity Australia -> UQ Doctor of Medicine",
    sourceType: "course",
    url: "https://www.cqu.edu.au/courses/700125/bachelor-of-medical-science-pathway-to-medicine",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "cqu-uq",
    schoolName: "CQUniversity Australia -> UQ Doctor of Medicine",
    sourceType: "pathway",
    url: "https://www.cqu.edu.au/study/medicine-pathways/regional-medical-pathway-in-detail",
    checkFrequencyHours: 24,
  },
  {
    schoolSlug: "cqu-uq",
    schoolName: "CQUniversity Australia -> UQ Doctor of Medicine",
    sourceType: "school",
    url: "https://www.cqu.edu.au/study/medicine-pathways",
    checkFrequencyHours: 24,
  },

  // 25. QUT Medicine
  {
    schoolSlug: "qut",
    schoolName: "Queensland University of Technology",
    sourceType: "school",
    url: "https://www.qut.edu.au/about/faculty-of-health/school-of-medicine",
    checkFrequencyHours: 12,
  },
  {
    schoolSlug: "qut",
    schoolName: "Queensland University of Technology",
    sourceType: "news",
    url: "https://www.qut.edu.au/insights/health/qut-medical-programyour-questions-answered",
    checkFrequencyHours: 12,
  },
  {
    schoolSlug: "qut",
    schoolName: "Queensland University of Technology",
    sourceType: "news",
    url: "https://www.qut.edu.au/news?id=199490",
    checkFrequencyHours: 12,
  },
];