import { 
  UniversityProfile, 
  StrategyEducationalGuide, 
  UsaAppSettings, 
  SatAcademicArchive, 
  HscAcademicArchive,
  SscAcademicArchive,
  EnglishTestRecord,
  BangladeshAdmissionNotebookEntry,
  RecommendationNotebook,
  SopDocument,
  EcaActivityEntry,
  ActivePassionProject,
  PassionProjectIdea,
  ResearchVaultItem,
  MainEssay,
  StoryBankEntry,
  ApplicationRound
} from '../types/usaApp';

export const COMMON_APP_PROMPTS: { id: string; label: string; prompt: string }[] = [
  {
    id: 'ca-1',
    label: 'Prompt 1: Background & Identity',
    prompt: 'Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.'
  },
  {
    id: 'ca-2',
    label: 'Prompt 2: Obstacle & Resilience',
    prompt: 'The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?'
  },
  {
    id: 'ca-3',
    label: 'Prompt 3: Questioning Beliefs',
    prompt: 'Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?'
  },
  {
    id: 'ca-4',
    label: 'Prompt 4: Gratitude & Kindness',
    prompt: 'Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?'
  },
  {
    id: 'ca-5',
    label: 'Prompt 5: Personal Growth',
    prompt: 'Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.'
  },
  {
    id: 'ca-6',
    label: 'Prompt 6: Captivating Topic',
    prompt: 'Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?'
  },
  {
    id: 'ca-7',
    label: 'Prompt 7: Topic of Choice',
    prompt: 'Share an essay on any topic of your choice. It can be one you\'ve already written, one that responds to a different prompt, or one of your own design.'
  }
];

export const INITIAL_USA_SETTINGS: UsaAppSettings = {
  applicationCycle: 'FALL 2028',
  motivationalHeadline: 'Your American Dream, Planned.',
  motivationalSubtitle: 'Research. Prepare. Write. Apply.',
  widgetOrder: [
    'colleges',
    'essays',
    'academics',
    'lors',
    'sop',
    'ecas',
    'projects',
    'strategy',
    'vault'
  ],
  visibleWidgets: {
    colleges: true,
    essays: true,
    academics: true,
    lors: true,
    sop: true,
    ecas: true,
    projects: true,
    strategy: true,
    vault: true
  },
  customTags: ['High Priority', 'Need-Blind', 'Full-Ride Target', 'STEM Designated', 'Common App', 'Top Choice']
};

// 1. Academics - Clean initial archives ready for user to fill
export const INITIAL_SAT_ARCHIVE: SatAcademicArchive = {
  targetTotalScore: 1550,
  targetRwScore: 750,
  targetMathScore: 800,
  records: [],
  generalNotes: ''
};

export const INITIAL_HSC_ARCHIVE: HscAcademicArchive = {
  sscSchoolName: '',
  sscBoard: '',
  sscPassingYear: '',
  sscGpa: '',
  sscGroup: '',
  hscCollegeName: '',
  hscBoard: '',
  hscPassingYear: '',
  hscExamDate: '',
  hscResultDate: '',
  hscTargetGpa: '',
  hscSubjectMarks: [],
  transcriptDocumentUrls: [],
  academicAchievements: '',
  generalNotes: ''
};

export const INITIAL_SSC_ARCHIVE: SscAcademicArchive = {
  schoolName: '',
  board: '',
  rollNumber: '',
  registrationNumber: '',
  session: '',
  group: '',
  passingYear: '',
  examStartDate: '',
  examEndDate: '',
  resultPublishDate: '',
  gpa: '',
  goldenAplus: false,
  totalSubjects: 0,
  subjectMarks: [],
  certificateDocumentUrl: '',
  academicAchievements: '',
  generalNotes: ''
};

export const INITIAL_ENGLISH_TEST_RECORDS: EnglishTestRecord[] = [];

export const INITIAL_BANGLADESH_ADMISSION_ENTRIES: BangladeshAdmissionNotebookEntry[] = [];

// 2. Colleges - Empty list ready for user to add or import from directory
export const INITIAL_UNIVERSITIES: UniversityProfile[] = [];

// 3. Essays & Story Bank - Empty list ready for user to create
export const INITIAL_MAIN_ESSAYS: MainEssay[] = [];
export const INITIAL_STORY_BANK: StoryBankEntry[] = [];

// 4. LORs - Empty list ready for user to add recommenders
export const INITIAL_LORS: RecommendationNotebook[] = [];

// 5. SOPs - Empty list ready for user to craft
export const INITIAL_SOPS: SopDocument[] = [];

// 6. ECAs & Achievements - Empty list ready for user to log
export const INITIAL_ECAS: EcaActivityEntry[] = [];

// 7. Passion Projects - Empty list ready for user to develop
export const INITIAL_ACTIVE_PROJECTS: ActivePassionProject[] = [];
export const INITIAL_PROJECT_IDEAS: PassionProjectIdea[] = [];

// 8. Research Vault - Empty list ready for user to bookmark
export const INITIAL_RESEARCH_VAULT_ITEMS: ResearchVaultItem[] = [];

// Strategy Reference Guides (Standard reference on application rounds rules)
export const EDUCATIONAL_STRATEGY_GUIDES: StrategyEducationalGuide[] = [
  {
    id: 'strat-ed',
    roundType: 'ED',
    title: 'Early Decision (ED / ED II)',
    whatItMeans: 'A binding commitment. You may apply to only ONE university under Early Decision. If admitted, you agree to immediately withdraw all other applications and enroll.',
    bindingOrNonBinding: 'Binding (Must Attend if Accepted)',
    restrictionsAndRules: 'You, your counselor, and your parent/guardian must sign the Early Decision Agreement. You cannot hold multiple active ED applications simultaneously. ED II operates with the same binding rule but has a later deadline (usually January 1–15).',
    typicalTimeline: 'ED I Deadline: Nov 1–15. Decision Notification: Mid-December. ED II Deadline: Jan 1–15. Decision Notification: Mid-February.',
    financialAidConsiderations: 'CRITICAL FOR INTERNATIONAL STUDENTS: If you require significant need-based aid, verify whether the institution meets 100% of demonstrated need for international students in ED. If an accepted financial aid package is genuinely insufficient after appeal, you may theoretically be released from the agreement, but it carries risk.',
    internationalApplicantConsiderations: 'Check if the university is Need-Blind or Need-Aware for international applicants in the ED round. For Need-Aware schools, requesting full aid in ED still involves financial evaluation alongside admissions.',
    importantExceptions: 'You may usually apply to non-binding rolling or non-restrictive public Early Action programs alongside ED, provided an EA acceptance does not conflict with ED enrollment.',
    howToEvaluate: 'Only use ED on your clear #1 dream university where you would happily attend regardless of all other factors and where the financial parameters are verified in advance.'
  },
  {
    id: 'strat-ea',
    roundType: 'EA',
    title: 'Early Action (EA)',
    whatItMeans: 'A non-binding early application round. You submit your application early and receive your admission decision early, but you have until May 1 (National College Decision Day) to decide.',
    bindingOrNonBinding: 'Non-Binding (Can Choose Later)',
    restrictionsAndRules: 'Standard EA has no restrictions on where else you can apply. You can apply to multiple EA schools at the same time.',
    typicalTimeline: 'Deadline: Usually Nov 1 or Nov 15. Decision: Late December to January.',
    financialAidConsiderations: 'You receive your financial aid offer without commitment, allowing you to compare financial packages across multiple universities before May 1.',
    internationalApplicantConsiderations: 'Many public flagship universities (e.g., Purdue, Georgia Tech, UIUC, UMich, UNC) require applying Early Action to be considered for institutional merit scholarships and honors colleges.',
    importantExceptions: 'Distinguish between standard non-restrictive EA and Single-Choice / Restrictive EA (REA).',
    howToEvaluate: 'Apply EA to any non-binding school on your list that offers it, especially if scholarship consideration depends on it.'
  },
  {
    id: 'strat-rea',
    roundType: 'REA',
    title: 'Restrictive Early Action / Single-Choice EA (REA / SCEA)',
    whatItMeans: 'A non-binding but restrictive early round offered by a small group of selective institutions (e.g., Harvard, Princeton, Yale, Stanford, Notre Dame).',
    bindingOrNonBinding: 'Single-Choice Restrictive (Non-Binding)',
    restrictionsAndRules: 'You are NOT required to enroll if admitted (unlike ED). However, you agree NOT to apply to any other private institution in the US under Early Decision or Early Action. Exceptions typically allow applying to public universities with non-binding rolling deadlines and international institutions outside the US.',
    typicalTimeline: 'Deadline: November 1. Decision Notification: Mid-December. Reply Deadline: May 1.',
    financialAidConsiderations: 'Because these schools are 100% need-blind and meet full demonstrated need for international students (Harvard, Princeton, Yale, MIT, Amherst, Dartmouth, Bowdoin), you receive their full institutional need package without a binding lock-in.',
    internationalApplicantConsiderations: 'Extremely competitive. International acceptance rates in REA are typically under 4%. Your application essays and profile must be polished by November 1.',
    importantExceptions: 'Always read each university\'s specific REA policy page carefully; some permit public EA schools (like Georgia Tech) while others place strict stipulations.',
    howToEvaluate: 'Consider REA if your top-choice university offers it, meets 100% need, and your application is at peak readiness by late October.'
  },
  {
    id: 'strat-rd',
    roundType: 'RD',
    title: 'Regular Decision (RD)',
    whatItMeans: 'The primary application round with standard deadlines. Completely non-binding. You can apply to as many universities as your time, Common App slots (up to 20), and budget allow.',
    bindingOrNonBinding: 'Non-Binding (Can Choose Later)',
    restrictionsAndRules: 'Common App allows a maximum of 20 universities. Coalition App or direct institutional portals can be used for additional institutions beyond 20 if needed.',
    typicalTimeline: 'Deadlines: January 1 to February 1. Decision Releases: Mid-March to early April ("Ivy Day"). Reply Deadline: May 1.',
    financialAidConsiderations: 'All financial aid awards (CSS Profile, ISFAA, tax returns, bank statements) arrive in March/April, giving you complete freedom to negotiate and compare attendance costs.',
    internationalApplicantConsiderations: 'This is where the majority of your Target and Safety applications will be reviewed. Ensures you have maximal time to submit final semester HSC marks and updated SAT scores.',
    importantExceptions: 'Some universities have specific priority deadlines in December for international merit aid even if the RD application deadline is January.',
    howToEvaluate: 'Build a balanced, thoughtful list across Reach, Target, and Safety tiers so that you have multiple compelling options in April.'
  }
];

// Discovery Directory of US Universities (Available for searching & 1-click adding)
export interface UniversityDiscoveryItem {
  id: string;
  name: string;
  country: string;
  state: string;
  city: string;
  universityType: 'Private Nonprofit' | 'Public State' | 'Liberal Arts College' | 'Specialized / Tech' | 'Other';
  officialWebsite: string;
  commonAppAvailable: boolean;
  satPolicy: 'Required' | 'Test-Optional' | 'Test-Blind / Test-Free' | 'Recommended' | 'Flexible';
  internationalAidPolicy: 'Need-Blind' | 'Need-Aware' | 'None' | 'Limited / Competitive';
  undergraduatePrograms: string;
  typicalRounds: ApplicationRound[];
  suggestedTier: 'reach' | 'target' | 'safety';
  overview: string;
}

export const DISCOVERY_UNIVERSITIES: UniversityDiscoveryItem[] = [
  {
    id: 'disc-mit',
    name: 'Massachusetts Institute of Technology (MIT)',
    country: 'United States',
    state: 'Massachusetts',
    city: 'Cambridge',
    universityType: 'Private Nonprofit',
    officialWebsite: 'https://mitadmissions.org',
    commonAppAvailable: false,
    satPolicy: 'Required',
    internationalAidPolicy: 'Need-Blind',
    undergraduatePrograms: 'Computer Science, Artificial Intelligence, Electrical Engineering, Mechanical Engineering, Physics, Mathematics, Aerospace',
    typicalRounds: ['EA', 'RD'],
    suggestedTier: 'reach',
    overview: 'World-leading STEM and research powerhouse. 100% Need-Blind for all international students and meets 100% of demonstrated financial need with zero loans. Mandatory SAT/ACT submission.'
  },
  {
    id: 'disc-harvard',
    name: 'Harvard University',
    country: 'United States',
    state: 'Massachusetts',
    city: 'Cambridge',
    universityType: 'Private Nonprofit',
    officialWebsite: 'https://college.harvard.edu',
    commonAppAvailable: true,
    satPolicy: 'Required',
    internationalAidPolicy: 'Need-Blind',
    undergraduatePrograms: 'Computer Science, Applied Mathematics, Economics, Government, Molecular Biology, Engineering Sciences',
    typicalRounds: ['REA', 'RD'],
    suggestedTier: 'reach',
    overview: 'Premier Ivy League institution. 100% Need-Blind for international applicants, meets 100% demonstrated need with grant-based aid. Standardized testing reinstated.'
  },
  {
    id: 'disc-stanford',
    name: 'Stanford University',
    country: 'United States',
    state: 'California',
    city: 'Stanford',
    universityType: 'Private Nonprofit',
    officialWebsite: 'https://admission.stanford.edu',
    commonAppAvailable: true,
    satPolicy: 'Required',
    internationalAidPolicy: 'Need-Aware',
    undergraduatePrograms: 'Computer Science, Symbolic Systems, Electrical Engineering, Bioengineering, Economics, Management Science & Engineering',
    typicalRounds: ['REA', 'RD'],
    suggestedTier: 'reach',
    overview: 'Epicenter of Silicon Valley entrepreneurship, technological breakthrough, and multidisciplinary research. Meets 100% demonstrated need for admitted students; need-aware for international students.'
  },
  {
    id: 'disc-princeton',
    name: 'Princeton University',
    country: 'United States',
    state: 'New Jersey',
    city: 'Princeton',
    universityType: 'Private Nonprofit',
    officialWebsite: 'https://admission.princeton.edu',
    commonAppAvailable: true,
    satPolicy: 'Test-Optional',
    internationalAidPolicy: 'Need-Blind',
    undergraduatePrograms: 'Computer Science, Operations Research & Financial Engineering, Mathematics, Physics, Public Policy',
    typicalRounds: ['SCEA', 'RD'],
    suggestedTier: 'reach',
    overview: 'Renowned for undergraduate focus, independent senior thesis, and one of the world\'s most generous no-loan need-blind financial aid programs for international students.'
  },
  {
    id: 'disc-yale',
    name: 'Yale University',
    country: 'United States',
    state: 'Connecticut',
    city: 'New Haven',
    universityType: 'Private Nonprofit',
    officialWebsite: 'https://admissions.yale.edu',
    commonAppAvailable: true,
    satPolicy: 'Flexible',
    internationalAidPolicy: 'Need-Blind',
    undergraduatePrograms: 'Computer Science, Ethics, Politics & Economics, Molecular Biophysics, Global Affairs',
    typicalRounds: ['SCEA', 'RD'],
    suggestedTier: 'reach',
    overview: 'Historic Ivy League institution with 100% Need-Blind admissions for international students and residential college system.'
  },
  {
    id: 'disc-caltech',
    name: 'California Institute of Technology (Caltech)',
    country: 'United States',
    state: 'California',
    city: 'Pasadena',
    universityType: 'Private Nonprofit',
    officialWebsite: 'https://www.admissions.caltech.edu',
    commonAppAvailable: true,
    satPolicy: 'Test-Blind / Test-Free',
    internationalAidPolicy: 'Need-Aware',
    undergraduatePrograms: 'Computer Science, Applied Physics, Aerospace, Mathematics, Chemical Engineering',
    typicalRounds: ['REA', 'RD'],
    suggestedTier: 'reach',
    overview: 'World-renowned science and engineering institute with 3:1 student-to-faculty ratio and JPL NASA affiliation.'
  },
  {
    id: 'disc-berkeley',
    name: 'University of California, Berkeley (UC Berkeley)',
    country: 'United States',
    state: 'California',
    city: 'Berkeley',
    universityType: 'Public State',
    officialWebsite: 'https://admissions.berkeley.edu',
    commonAppAvailable: false,
    satPolicy: 'Test-Blind / Test-Free',
    internationalAidPolicy: 'None',
    undergraduatePrograms: 'Electrical Engineering & Computer Science (EECS), Data Science, Economics, Chemistry',
    typicalRounds: ['RD'],
    suggestedTier: 'target',
    overview: 'World-leading public research institution with unmatched engineering and scientific prestige. Completely test-free.'
  },
  {
    id: 'disc-columbia',
    name: 'Columbia University',
    country: 'United States',
    state: 'New York',
    city: 'New York',
    universityType: 'Private Nonprofit',
    officialWebsite: 'https://undergrad.admissions.columbia.edu',
    commonAppAvailable: true,
    satPolicy: 'Test-Optional',
    internationalAidPolicy: 'Need-Aware',
    undergraduatePrograms: 'Computer Science, Financial Economics, Applied Mathematics, Biomedical Engineering',
    typicalRounds: ['ED', 'RD'],
    suggestedTier: 'target',
    overview: 'Historic Ivy League university in Manhattan with renowned Core Curriculum and engineering faculty.'
  },
  {
    id: 'disc-ucla',
    name: 'University of California, Los Angeles (UCLA)',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    universityType: 'Public State',
    officialWebsite: 'https://admission.ucla.edu',
    commonAppAvailable: false,
    satPolicy: 'Test-Blind / Test-Free',
    internationalAidPolicy: 'None',
    undergraduatePrograms: 'Computer Science, Business Economics, Psychobiology, Film, Engineering',
    typicalRounds: ['RD'],
    suggestedTier: 'target',
    overview: 'Premier public university in Southern California with world-class faculty, research, and campus life.'
  },
  {
    id: 'disc-gatech',
    name: 'Georgia Institute of Technology (Georgia Tech)',
    country: 'United States',
    state: 'Georgia',
    city: 'Atlanta',
    universityType: 'Public State',
    officialWebsite: 'https://admission.gatech.edu',
    commonAppAvailable: true,
    satPolicy: 'Required',
    internationalAidPolicy: 'Limited / Competitive',
    undergraduatePrograms: 'Computer Science, Industrial Engineering, Aerospace, Electrical Engineering',
    typicalRounds: ['EA', 'RD'],
    suggestedTier: 'target',
    overview: 'Top-tier public polytechnic research university with industry co-ops and cutting-edge robotics & AI.'
  },
  {
    id: 'disc-purdue',
    name: 'Purdue University',
    country: 'United States',
    state: 'Indiana',
    city: 'West Lafayette',
    universityType: 'Public State',
    officialWebsite: 'https://www.purdue.edu/admissions',
    commonAppAvailable: true,
    satPolicy: 'Required',
    internationalAidPolicy: 'None',
    undergraduatePrograms: 'Computer Science, Aeronautical Engineering, Mechanical Engineering, Data Science',
    typicalRounds: ['EA', 'RD'],
    suggestedTier: 'safety',
    overview: 'Leading public research institution with renowned engineering and computer science programs. Early Action recommended.'
  },
  {
    id: 'disc-utaustin',
    name: 'University of Texas at Austin (UT Austin)',
    country: 'United States',
    state: 'Texas',
    city: 'Austin',
    universityType: 'Public State',
    officialWebsite: 'https://admissions.utexas.edu',
    commonAppAvailable: true,
    satPolicy: 'Required',
    internationalAidPolicy: 'Limited / Competitive',
    undergraduatePrograms: 'Computer Science (Turing Scholars), Cockrell Engineering, McCombs Business',
    typicalRounds: ['EA', 'RD'],
    suggestedTier: 'target',
    overview: 'Flagship Texas public research university in the Silicon Hills tech hub of Austin.'
  },
  {
    id: 'disc-amherst',
    name: 'Amherst College',
    country: 'United States',
    state: 'Massachusetts',
    city: 'Amherst',
    universityType: 'Liberal Arts College',
    officialWebsite: 'https://www.amherst.edu/admission',
    commonAppAvailable: true,
    satPolicy: 'Test-Optional',
    internationalAidPolicy: 'Need-Blind',
    undergraduatePrograms: 'Mathematics, Economics, Computer Science, Neuroscience, English',
    typicalRounds: ['ED', 'RD'],
    suggestedTier: 'reach',
    overview: 'Elite undergraduate liberal arts college. 100% Need-Blind for all international students, meeting full demonstrated need with zero loans.'
  },
  {
    id: 'disc-williams',
    name: 'Williams College',
    country: 'United States',
    state: 'Massachusetts',
    city: 'Williamstown',
    universityType: 'Liberal Arts College',
    officialWebsite: 'https://admission.williams.edu',
    commonAppAvailable: true,
    satPolicy: 'Test-Optional',
    internationalAidPolicy: 'Need-Blind',
    undergraduatePrograms: 'Economics, Mathematics, Computer Science, Biology, Art History',
    typicalRounds: ['ED', 'RD'],
    suggestedTier: 'reach',
    overview: 'Premier liberal arts college with Oxford-style tutorial system and an all-grant no-loan need-blind aid policy for all international students.'
  }
];
