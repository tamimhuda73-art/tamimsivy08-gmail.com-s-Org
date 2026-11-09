import { 
  UserProfile, 
  Mission, 
  MajorMilestone,
  SubjectProgress, 
  CountdownTarget, 
  CalendarEvent, 
  DailyHabit,
  StudyRoutineData,
  TimerSettings,
  FocusSessionRecord
} from '../types/tracker';

export const INITIAL_USER: UserProfile = {
  name: "Tamim",
  initials: "TA",
  email: "tamim@study.app",
  currentDate: "2026-11-09",
  useRealCurrentDate: false,
  quote: "Consistency is not perfection. It is simply showing up every day."
};

export const INITIAL_COUNTDOWNS: CountdownTarget[] = [
  {
    id: "countdown-sat",
    category: "STANDARDIZED TEST",
    title: "SAT",
    targetDate: "2027-03-06",
    targetLabel: "PROVISIONAL TARGET: 6 MARCH 2027 (TENTATIVE)",
    badgeLeft: "COUNTDOWN ACTIVE",
    badgeRight: "PREPARATION PHASE"
  },
  {
    id: "countdown-hsc",
    category: "BOARD EXAMINATION",
    title: "HSC 2027",
    targetDate: "2027-06-06",
    targetLabel: "TARGET EXAM START: 6 JUNE 2027 (TENTATIVE)",
    badgeLeft: "COUNTDOWN ACTIVE",
    badgeRight: "SYLLABUS TARGET"
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: "mission-sat",
    order: 1,
    title: "SAT 1550+",
    code: "SAT 1550+",
    goal: "Score 1550+",
    category: "Standardized Test",
    targetDate: "2027-03-06",
    dateStatus: "TENTATIVE",
    progressPercentage: 0,
    status: "Not Started",
    subtext: "Not Started",
    targetDescription: "Goal: 1550+ (Math: 800, RW: 750+)",
    targetScore: "1550+ (Math: 800, RW: 750+)",
    currentScore: "Diagnostic: 1420",
    deadline: "2027-03-06",
    colorAccent: "beige",
    milestones: [
      { id: "m-sat-1", title: "Khan Academy Math Level 4 Mastery", completed: false },
      { id: "m-sat-2", title: "College Board Official Practice Tests 1–4", completed: false },
      { id: "m-sat-3", title: "Erica Meltzer Reading & Writing Rules Drill", completed: false },
      { id: "m-sat-4", title: "Desmos Graphing Calculator Advanced Speed Tricks", completed: false },
      { id: "m-sat-5", title: "Timed Mock Exam Simulation with Score >1530", completed: false }
    ],
    notes: "Provisional target date: 6 March 2027 (editable to March 1, 2027 or any date)."
  },
  {
    id: "mission-hsc",
    order: 2,
    title: "HSC GPA 5.00",
    code: "HSC GPA 5",
    goal: "Achieve GPA 5.00",
    category: "Board Examination",
    targetDate: "2027-06-06",
    dateStatus: "TENTATIVE",
    progressPercentage: 0,
    status: "Not Started",
    subtext: "Not Started",
    targetDescription: "Goal: GPA 5.00 (Golden)",
    targetScore: "GPA 5.00 (Golden)",
    currentScore: "In Progress",
    deadline: "2027-06-06",
    colorAccent: "brown",
    milestones: [
      { id: "m-hsc-1", title: "Complete 100% 1st Paper Syllabus by Dec 2026", completed: false },
      { id: "m-hsc-2", title: "Solve Past 5-Year Board Creative Questions (CQ)", completed: false },
      { id: "m-hsc-3", title: "Solve Past 5-Year Board MCQ Question Bank", completed: false },
      { id: "m-hsc-4", title: "Pre-Test Exam Preparation (Target: 85%+ in all subjects)", completed: false },
      { id: "m-hsc-5", title: "Final Test Exam Top 5 Percentile Ranking", completed: false }
    ],
    notes: "Target examination start date: 6 June 2027 (Tentative, editable per official schedule)."
  },
  {
    id: "mission-ielts",
    order: 3,
    title: "IELTS 7.5–8.0",
    code: "IELTS 7.5-8.0",
    goal: "Achieve an IELTS band score of 7.5–8.0",
    category: "English Proficiency",
    targetDate: "",
    dateStatus: "NOT SET",
    progressPercentage: 0,
    status: "Not Started",
    subtext: "Not Started",
    targetDescription: "Goal: Band 7.5–8.0 (Min 7.5 each)",
    targetScore: "Band 7.5–8.0",
    currentScore: "Diagnostic: 7.0",
    deadline: "",
    colorAccent: "taupe",
    milestones: [
      { id: "m-ielts-1", title: "Cambridge IELTS Books 15-18 Listening (Band 8.5 target)", completed: false },
      { id: "m-ielts-2", title: "Academic Reading Speed Strategies (Band 8.5 target)", completed: false },
      { id: "m-ielts-3", title: "Writing Task 1 & Task 2 Template & Vocabulary Masterclass", completed: false },
      { id: "m-ielts-4", title: "Mock Speaking Interviews with native feedback", completed: false }
    ],
    notes: "Target date: NOT SET. Hidden until a date is configured."
  },
  {
    id: "mission-duiba",
    order: 4,
    title: "CRACK DU IBA",
    code: "CRACK DU IBA",
    goal: "Secure admission to DU IBA",
    category: "University Admission",
    targetDate: "",
    dateStatus: "NOT SET",
    progressPercentage: 0,
    status: "Not Started",
    subtext: "Not Started",
    targetDescription: "Goal: Top 30 Merit List",
    targetScore: "Top 30 Merit List",
    currentScore: "Preparation",
    deadline: "",
    colorAccent: "espresso",
    milestones: [
      { id: "m-iba-1", title: "Quantitative Math Section: High School Algebra & Geometry", completed: false },
      { id: "m-iba-2", title: "Verbal English: GRE Big Book & Vocabulary Flashcards", completed: false },
      { id: "m-iba-3", title: "Analytical Ability & Critical Reasoning Puzzles", completed: false },
      { id: "m-iba-4", title: "Past 15 Years IBA BBA Admission Question Solve", completed: false },
      { id: "m-iba-5", title: "10 Timed Full-Length IBA Mock Tests", completed: false }
    ],
    notes: "Target date: NOT SET. Hidden until a date is configured."
  }
];

export const INITIAL_MAJOR_MILESTONES: MajorMilestone[] = [
  {
    id: "milestone-usa-app",
    title: "USA UNIVERSITY APPLICATION",
    subtitle: "International University Applications",
    category: "International University Applications",
    targetDate: "2027-11-01",
    dateStatus: "PLANNED",
    status: "UPCOMING",
    progressPercentage: 0,
    description: "Application preparation start & Common App portfolio development for US universities.",
    isVisible: true,
    notes: "Undergraduate degree in the United States with full scholarship and merit aid support."
  }
];

// Helper to flatten chapters for backward compatibility
const buildSubjectRollup = (
  id: string,
  name: string,
  category: 'core' | 'paper' | 'elective',
  hasPapers: boolean,
  papers: { name: string; paperNumber: number; chapters: { name: string }[] }[]
): SubjectProgress => {
  const builtPapers = papers.map((p, pIdx) => {
    const chs = p.chapters.map((ch, cIdx) => ({
      id: `${id}-p${pIdx + 1}-ch${cIdx + 1}`,
      chapterNumber: cIdx + 1,
      name: ch.name,
      completed: false,
      status: 'NOT STARTED' as const
    }));
    return {
      id: `${id}-paper-${pIdx + 1}`,
      name: p.name,
      paperNumber: p.paperNumber,
      totalChapters: chs.length,
      completedChapters: 0,
      chapters: chs
    };
  });

  const allChapters = builtPapers.flatMap(p => p.chapters);

  return {
    id,
    name,
    category,
    hasPapers,
    papers: builtPapers,
    totalChapters: allChapters.length,
    completedChapters: 0,
    chapters: allChapters
  };
};

export const INITIAL_SUBJECTS: SubjectProgress[] = [
  // 1. Physics (2 Sub-sections: 1st Paper & 2nd Paper)
  buildSubjectRollup("subj-physics", "Physics", "core", true, [
    {
      name: "Physics 1st Paper",
      paperNumber: 1,
      chapters: [
        { name: "Physical World & Measurement" },
        { name: "Vector Analysis & Calculus" },
        { name: "Dynamics & Newton's Laws" },
        { name: "Work, Energy & Power" },
        { name: "Circular Motion & Gravitation" },
        { name: "Structural Properties of Matter" },
        { name: "Periodic Motion & Simple Harmonic Oscillator" },
        { name: "Waves & Sound Mechanics" },
        { name: "Ideal Gases & Kinetic Theory" },
        { name: "Thermodynamics & Heat Engines" }
      ]
    },
    {
      name: "Physics 2nd Paper",
      paperNumber: 2,
      chapters: [
        { name: "Thermal Physics & Entropy" },
        { name: "Electrostatics & Gauss's Law" },
        { name: "Current Electricity & Circuits" },
        { name: "Magnetic Effects of Electric Current" },
        { name: "Electromagnetic Induction & Alternating Current" },
        { name: "Geometrical & Ray Optics" },
        { name: "Wave Optics & Interference" },
        { name: "Introduction to Modern Physics & Relativity" },
        { name: "Atomic Models & Nuclear Physics" },
        { name: "Semiconductor Physics & Electronics" },
        { name: "Astronomy & Astrophysics Fundamentals" }
      ]
    }
  ]),

  // 2. Mathematics (2 Sub-sections: Higher Math 1st Paper & 2nd Paper)
  buildSubjectRollup("subj-math", "Mathematics", "core", true, [
    {
      name: "Higher Math 1st Paper",
      paperNumber: 1,
      chapters: [
        { name: "Matrices & Determinants" },
        { name: "Vectors in 2D and 3D Plane" },
        { name: "Straight Lines & Coordinate Geometry" },
        { name: "Circles & Tangents" },
        { name: "Permutations & Combinations" },
        { name: "Trigonometric Ratios & Angles" },
        { name: "Functions & Function Graphs" },
        { name: "Differentiation & Derivative Applications" },
        { name: "Indefinite & Definite Integration" }
      ]
    },
    {
      name: "Higher Math 2nd Paper",
      paperNumber: 2,
      chapters: [
        { name: "Real Numbers & Inequalities" },
        { name: "Linear Programming Optimization" },
        { name: "Complex Numbers & De Moivre's Theorem" },
        { name: "Polynomials & Quadratic Equations" },
        { name: "Conic Sections (Parabola, Ellipse, Hyperbola)" },
        { name: "Inverse Trigonometric Functions" },
        { name: "Statics & Equilibrium of Forces" },
        { name: "Dynamics & Motion of Projectiles" }
      ]
    }
  ]),

  // 3. Chemistry (2 Sub-sections: 1st Paper & 2nd Paper)
  buildSubjectRollup("subj-chem", "Chemistry", "core", true, [
    {
      name: "Chemistry 1st Paper",
      paperNumber: 1,
      chapters: [
        { name: "Safe Use of Laboratory & Apparatus" },
        { name: "Qualitative Chemistry & Salt Analysis" },
        { name: "Periodic Properties & Chemical Bonding" },
        { name: "Chemical Changes & Thermodynamics" },
        { name: "Work-oriented Industrial Chemistry" }
      ]
    },
    {
      name: "Chemistry 2nd Paper",
      paperNumber: 2,
      chapters: [
        { name: "Environmental Chemistry & Atmospheric Gases" },
        { name: "Organic Chemistry Fundamentals & Hydrocarbons" },
        { name: "Quantitative Chemistry & Stoichiometry" },
        { name: "Electrochemistry & Redox Cells" },
        { name: "Economic & Industrial Chemical Processes" }
      ]
    }
  ]),

  // 4. Biology (2 Sub-sections: Botany & Zoology)
  buildSubjectRollup("subj-bio", "Biology", "core", true, [
    {
      name: "Biology 1st Paper (Botany)",
      paperNumber: 1,
      chapters: [
        { name: "Cell & Its Structure" },
        { name: "Cell Division (Mitosis & Meiosis)" },
        { name: "Cell Chemistry & Carbohydrates/Proteins" },
        { name: "Microorganisms (Virus & Bacteria)" },
        { name: "Algae & Fungi" },
        { name: "Bryophyta & Pteridophyta" },
        { name: "Gymnosperms & Angiosperms" },
        { name: "Tissue & Tissue Systems" },
        { name: "Plant Physiology & Photosynthesis/Respiration" },
        { name: "Plant Reproduction & Pollination" },
        { name: "Biotechnology & Tissue Culture" },
        { name: "Organism & Ecosystem Environment" }
      ]
    },
    {
      name: "Biology 2nd Paper (Zoology)",
      paperNumber: 2,
      chapters: [
        { name: "Animal Diversity & Classification" },
        { name: "Animal Identity (Hydra, Grasshopper, Rohu)" },
        { name: "Human Physiology: Digestion & Absorption" },
        { name: "Human Physiology: Blood & Circulation" },
        { name: "Human Physiology: Respiration & Gas Exchange" },
        { name: "Human Physiology: Excretion & Osmoregulation" },
        { name: "Human Physiology: Locomotion & Bone Mechanics" },
        { name: "Human Physiology: Coordination & Endocrine System" },
        { name: "Human Body Defense & Immunology" },
        { name: "Reproduction & Embryonic Development" },
        { name: "Genetics & Darwinian Evolution" },
        { name: "Animal Behavior & Sociobiology" }
      ]
    }
  ]),

  // 5. ICT (Single Section — "all like this except ict")
  buildSubjectRollup("subj-ict", "ICT", "core", false, [
    {
      name: "Information & Communication Technology",
      paperNumber: 1,
      chapters: [
        { name: "Information & Communication Technology: World & Bangladesh" },
        { name: "Communication Systems & Networking" },
        { name: "Number Systems & Digital Logic" },
        { name: "Web Design Fundamentals & HTML" },
        { name: "Programming Language (C Programming)" },
        { name: "Database Management System (DBMS)" }
      ]
    }
  ])
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "ev-sat-target",
    date: "2027-03-06",
    title: "Official SAT Examination (Tentative)",
    startTime: "08:00",
    endTime: "11:30",
    description: "Standardized testing session at approved test center.",
    category: "Examination",
    priority: "High",
    completed: false,
    color: "amber",
    reminderMinutes: 60
  },
  {
    id: "ev-hsc-target",
    date: "2027-06-06",
    title: "HSC Board Examination Commences (Tentative)",
    startTime: "10:00",
    endTime: "13:00",
    description: "First day of Board Examination with Physics & Bengali.",
    category: "Examination",
    priority: "High",
    completed: false,
    color: "black",
    reminderMinutes: 60
  },
  {
    id: "ev-usa-target",
    date: "2027-11-01",
    title: "USA University Application Start",
    startTime: "09:00",
    endTime: "10:00",
    description: "Official kickoff of Common App submissions and portfolio preparation.",
    category: "Academic Deadline",
    priority: "High",
    completed: false,
    color: "blue"
  },
  {
    id: "ev-routine-physics",
    date: "2026-11-09",
    title: "Physics 1st: Vector CQ Solve & Calculus",
    startTime: "03:10",
    endTime: "05:20",
    description: "Morning deep work session focused on past board question analysis.",
    category: "Study Session",
    priority: "High",
    completed: false,
    color: "blue",
    subjectId: "subj-physics",
    paperId: "subj-physics-paper-1"
  },
  {
    id: "ev-routine-sat",
    date: "2026-11-09",
    title: "SAT Reading & Writing: Practice Test Module 2",
    startTime: "06:30",
    endTime: "08:40",
    description: "Timed section drill with thorough error review.",
    category: "Study Session",
    priority: "High",
    completed: false,
    color: "amber"
  },
  {
    id: "ev-routine-chem",
    date: "2026-11-10",
    title: "Chemistry 1st: Periodic Properties CQ Drill",
    startTime: "10:00",
    endTime: "12:00",
    description: "Electronegativity and ionization energy trends mastery.",
    category: "Study Session",
    priority: "Medium",
    completed: false,
    color: "emerald",
    subjectId: "subj-chem",
    paperId: "subj-chem-paper-1"
  },
  {
    id: "ev-assignment-math",
    date: "2026-11-12",
    title: "Higher Math: Integration Problem Set Submission",
    startTime: "16:00",
    endTime: "18:00",
    description: "Weekly assignment problem set on standard integrals.",
    category: "Assignment",
    priority: "Medium",
    completed: false,
    color: "purple",
    subjectId: "subj-math"
  }
];

export const INITIAL_HABITS: DailyHabit[] = [
  {
    id: "hab-wake",
    name: "03:00 AM WAKE UP & PRAYER",
    category: "mindset",
    streak: 9,
    bestStreak: 21,
    history: {
      "2026-11-01": true, "2026-11-02": true, "2026-11-03": true,
      "2026-11-04": true, "2026-11-05": true, "2026-11-06": true,
      "2026-11-07": true, "2026-11-08": true, "2026-11-09": true
    }
  },
  {
    id: "hab-deepwork",
    name: "4+ HOURS MORNING DEEP WORK",
    category: "study",
    streak: 8,
    bestStreak: 18,
    history: {
      "2026-11-01": true, "2026-11-02": true, "2026-11-03": true,
      "2026-11-04": true, "2026-11-05": true, "2026-11-06": true,
      "2026-11-07": true, "2026-11-08": true, "2026-11-09": false
    }
  },
  {
    id: "hab-sat",
    name: "DAILY SAT DESMOS & VOCAB DRILL",
    category: "study",
    streak: 6,
    bestStreak: 14,
    history: {
      "2026-11-03": true, "2026-11-04": true, "2026-11-05": true,
      "2026-11-06": true, "2026-11-07": true, "2026-11-08": true
    }
  },
  {
    id: "hab-cq",
    name: "SOLVE 10 BOARD CREATIVE QUESTIONS",
    category: "study",
    streak: 7,
    bestStreak: 15,
    history: {
      "2026-11-02": true, "2026-11-03": true, "2026-11-04": true,
      "2026-11-05": true, "2026-11-06": true, "2026-11-07": true,
      "2026-11-08": true
    }
  },
  {
    id: "hab-screen",
    name: "ZERO SOCIAL MEDIA BEFORE 6 PM",
    category: "mindset",
    streak: 9,
    bestStreak: 25,
    history: {
      "2026-11-01": true, "2026-11-02": true, "2026-11-03": true,
      "2026-11-04": true, "2026-11-05": true, "2026-11-06": true,
      "2026-11-07": true, "2026-11-08": true, "2026-11-09": true
    }
  },
  {
    id: "hab-sleep",
    name: "BEDTIME BY 9:30 PM",
    category: "health",
    streak: 8,
    bestStreak: 20,
    history: {
      "2026-11-01": true, "2026-11-02": true, "2026-11-03": true,
      "2026-11-04": true, "2026-11-05": true, "2026-11-06": true,
      "2026-11-07": true, "2026-11-08": true
    }
  }
];

export const INITIAL_STUDY_ROUTINE: StudyRoutineData = {
  kicker: "THE WEEKLY STUDY ROUTINE",
  headline: "SHOW UP. STUDY DEEP. REPEAT.",
  subtitle: "SATURDAY — FRIDAY / YOUR WEEK, CLEARLY PLANNED",
  badgeTop: "7 DAYS • 5 BLOCKS",
  badgeMiddle: "FRIDAY",
  badgeBottom: "WEEKLY REVIEW",
  subHeaderLeft: "YOUR WEEK AT A GLANCE",
  subHeaderRight: "ONE WEEK. ONE PLAN.",
  days: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  blocks: [
    {
      id: "b1",
      timeRange: "3:10–5:20",
      period: "AM",
      label: "EARLY STUDY",
      cells: {
        "Saturday": { subject: "BIOLOGY", colorTheme: "blue" },
        "Sunday": { subject: "BIOLOGY", colorTheme: "blue" },
        "Monday": { subject: "ICT", colorTheme: "blue" },
        "Tuesday": { subject: "ICT", colorTheme: "blue" },
        "Wednesday": { subject: "BIOLOGY", colorTheme: "blue" },
        "Thursday": { subject: "BIOLOGY", colorTheme: "blue" },
        "Friday": { subject: "ICT", colorTheme: "beige" }
      }
    },
    {
      id: "b2",
      timeRange: "6:00–10:00",
      period: "AM",
      label: "MORNING",
      cells: {
        "Saturday": { subject: "PHYSICS", colorTheme: "taupe" },
        "Sunday": { subject: "PHYSICS", colorTheme: "taupe" },
        "Monday": { subject: "PHYSICS", colorTheme: "taupe" },
        "Tuesday": { subject: "PHYSICS", colorTheme: "taupe" },
        "Wednesday": { subject: "PHYSICS", colorTheme: "taupe" },
        "Thursday": { subject: "PHYSICS", colorTheme: "taupe" },
        "Friday": { subject: "WEEK RECAP", subtext: "+ BIOLOGY", colorTheme: "beige" }
      }
    },
    {
      id: "b3",
      timeRange: "10:30–1:15",
      period: "SAT",
      label: "SAT SESSION",
      cells: {
        "Saturday": { subject: "SAT MATH", colorTheme: "cream" },
        "Sunday": { subject: "SAT MATH", colorTheme: "cream" },
        "Monday": { subject: "SAT ENGLISH", colorTheme: "cream" },
        "Tuesday": { subject: "SAT MATH", colorTheme: "cream" },
        "Wednesday": { subject: "SAT ENGLISH", colorTheme: "cream" },
        "Thursday": { subject: "SAT ENGLISH", colorTheme: "cream" },
        "Friday": { subject: "SAT MATH + ENGLISH", subtext: "PRACTICE", colorTheme: "beige" }
      }
    },
    {
      id: "b4",
      timeRange: "2:45–5:20",
      period: "PM",
      label: "AFTERNOON",
      cells: {
        "Saturday": { subject: "MATH", colorTheme: "ivory" },
        "Sunday": { subject: "MATH", colorTheme: "ivory" },
        "Monday": { subject: "MATH", colorTheme: "ivory" },
        "Tuesday": { subject: "MATH", colorTheme: "ivory" },
        "Wednesday": { subject: "MATH", colorTheme: "ivory" },
        "Thursday": { subject: "MATH", colorTheme: "ivory" },
        "Friday": { subject: "MATH", colorTheme: "beige" }
      }
    },
    {
      id: "b5",
      timeRange: "6:00–9:30",
      period: "PM",
      label: "EVENING",
      cells: {
        "Saturday": { subject: "VOCAB 30 MIN", subtext: "+ CHEMISTRY", colorTheme: "ivory" },
        "Sunday": { subject: "VOCAB 30 MIN", subtext: "+ CHEMISTRY", colorTheme: "ivory" },
        "Monday": { subject: "VOCAB 30 MIN", subtext: "+ CHEMISTRY", colorTheme: "ivory" },
        "Tuesday": { subject: "VOCAB 30 MIN", subtext: "+ CHEMISTRY", colorTheme: "ivory" },
        "Wednesday": { subject: "VOCAB 30 MIN", subtext: "+ CHEMISTRY", colorTheme: "ivory" },
        "Thursday": { subject: "VOCAB 30 MIN", subtext: "+ CHEMISTRY", colorTheme: "ivory" },
        "Friday": { subject: "REVIEW THE", subtext: "WHOLE WEEK", colorTheme: "beige" }
      }
    }
  ],
  footerPillars: [
    { id: "fp1", label: "EVERY DAY", detail: "VOCABULARY • 30 MIN" },
    { id: "fp2", label: "FRIDAY", detail: "RECAP + SAT MATH & ENGLISH" },
    { id: "fp3", label: "STAY SHARP", detail: "BREAKS + ENOUGH SLEEP" }
  ]
};

export const INITIAL_TIMER_SETTINGS: TimerSettings = {
  focusDurationMinutes: 50,
  shortBreakMinutes: 10,
  longBreakMinutes: 20,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoTransition: false,
  dailyTargetHours: 6,
  dailyTargetSessions: 8,
  soundEnabled: true
};

export const INITIAL_FOCUS_SESSIONS: FocusSessionRecord[] = [
  {
    id: "sess-1",
    date: "2026-11-09",
    startTime: "03:15",
    endTime: "04:05",
    durationSeconds: 3000,
    mode: "focus",
    subjectId: "subj-physics",
    subjectName: "Physics",
    paperId: "subj-physics-paper-1",
    paperName: "Physics 1st Paper",
    chapterName: "Vector Analysis & Calculus",
    taskName: "Solve Past Board CQs (2018–2024)",
    sessionLabel: "Deep Work Session 01",
    status: "completed",
    notes: "Mastered cross product and dot product dot matrix formulas."
  },
  {
    id: "sess-2",
    date: "2026-11-09",
    startTime: "04:15",
    endTime: "05:05",
    durationSeconds: 3000,
    mode: "focus",
    subjectId: "subj-physics",
    subjectName: "Physics",
    paperId: "subj-physics-paper-1",
    paperName: "Physics 1st Paper",
    chapterName: "Dynamics & Newton's Laws",
    taskName: "Friction & Pulley Problems",
    sessionLabel: "Deep Work Session 02",
    status: "completed",
    notes: "Solved 8 tricky inclination tension questions."
  },
  {
    id: "sess-3",
    date: "2026-11-08",
    startTime: "03:15",
    endTime: "04:05",
    durationSeconds: 3000,
    mode: "focus",
    subjectId: "subj-math",
    subjectName: "Mathematics",
    paperId: "subj-math-paper-1",
    paperName: "Higher Math 1st Paper",
    chapterName: "Matrices & Determinants",
    taskName: "Cramer's Rule & Inverse Matrix",
    sessionLabel: "Math Session 01",
    status: "completed"
  },
  {
    id: "sess-4",
    date: "2026-11-08",
    startTime: "06:30",
    endTime: "07:20",
    durationSeconds: 3000,
    mode: "focus",
    subjectId: "subj-chem",
    subjectName: "Chemistry",
    paperId: "subj-chem-paper-1",
    paperName: "Chemistry 1st Paper",
    chapterName: "Periodic Properties & Chemical Bonding",
    taskName: "Hybridization & VSEPR Theory",
    sessionLabel: "Chemistry Session 01",
    status: "completed"
  },
  {
    id: "sess-5",
    date: "2026-11-07",
    startTime: "03:15",
    endTime: "04:05",
    durationSeconds: 3000,
    mode: "focus",
    subjectId: "subj-physics",
    subjectName: "Physics",
    paperId: "subj-physics-paper-2",
    paperName: "Physics 2nd Paper",
    chapterName: "Thermodynamics & Heat Engines",
    taskName: "Carnot Engine Efficiency Derivation",
    sessionLabel: "Physics 2nd Deep Work",
    status: "completed"
  },
  {
    id: "sess-6",
    date: "2026-11-07",
    startTime: "06:30",
    endTime: "07:15",
    durationSeconds: 2700,
    mode: "focus",
    subjectId: "subj-bio",
    subjectName: "Biology",
    paperId: "subj-bio-paper-1",
    paperName: "Biology 1st Paper (Botany)",
    chapterName: "Cell & Its Structure",
    taskName: "Organelle Diagrams & Functions",
    sessionLabel: "Botany Session",
    status: "completed"
  },
  {
    id: "sess-7",
    date: "2026-11-06",
    startTime: "03:15",
    endTime: "04:05",
    durationSeconds: 3000,
    mode: "focus",
    subjectId: "subj-ict",
    subjectName: "ICT",
    paperId: "subj-ict-paper-1",
    paperName: "Information & Communication Technology",
    chapterName: "Number Systems & Digital Logic",
    taskName: "2's Complement & Logic Gates",
    sessionLabel: "ICT Session",
    status: "completed"
  },
  {
    id: "sess-8",
    date: "2026-11-05",
    startTime: "03:15",
    endTime: "04:05",
    durationSeconds: 3000,
    mode: "focus",
    subjectId: "subj-math",
    subjectName: "Mathematics",
    paperId: "subj-math-paper-2",
    paperName: "Higher Math 2nd Paper",
    chapterName: "Complex Numbers & De Moivre's Theorem",
    taskName: "Modulus Amplitude & Cube Roots of Unity",
    sessionLabel: "Higher Math 2nd",
    status: "completed"
  }
];
