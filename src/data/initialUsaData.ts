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

export const INITIAL_SAT_ARCHIVE: SatAcademicArchive = {
  targetTotalScore: 1550,
  targetRwScore: 760,
  targetMathScore: 790,
  records: [
    {
      id: 'sat-rec-1',
      testType: 'Official SAT',
      testDate: '2025-08-24',
      readingWritingScore: 760,
      mathScore: 760,
      totalScore: 1520,
      preparationNotes: 'Official Digital SAT (August 2025 administration). Top 1% percentile nationally.',
      weakAreas: 'Time management on Module 2 Math geometry problems.',
      improvementObservations: 'Math can easily reach 790-800 with targeted practice on Desmos graphing shortcuts.',
      createdAt: '2025-08-24'
    },
    {
      id: 'sat-rec-2',
      testType: 'Practice Test',
      testDate: '2025-08-10',
      readingWritingScore: 740,
      mathScore: 740,
      totalScore: 1480,
      preparationNotes: 'College Board Bluebook Official Practice Test #3',
      weakAreas: 'Vocabulary-in-context nuances and transition words.',
      improvementObservations: 'Pacing solid; need more practice with complex punctuation questions.',
      createdAt: '2025-08-10'
    }
  ],
  generalNotes: 'Targeting Digital SAT 1550+ for competitive US STEM & engineering programs.'
};

export const INITIAL_HSC_ARCHIVE: HscAcademicArchive = {
  sscSchoolName: 'Ideal School & College, Motijheel, Dhaka',
  sscBoard: 'Dhaka',
  sscPassingYear: '2024',
  sscGpa: '5.00',
  sscGroup: 'Science',
  hscCollegeName: 'Notre Dame College, Dhaka',
  hscBoard: 'Dhaka',
  hscPassingYear: '2026',
  hscExamDate: '2026-06-30',
  hscResultDate: '2026-10-15',
  hscTargetGpa: '5.00',
  hscSubjectMarks: [
    { id: 'hsc-phy', subjectName: 'Physics (1st & 2nd Paper)', totalMarks: '192', grade: 'A+', gpaPoint: '5.00' },
    { id: 'hsc-chem', subjectName: 'Chemistry (1st & 2nd Paper)', totalMarks: '190', grade: 'A+', gpaPoint: '5.00' },
    { id: 'hsc-math', subjectName: 'Higher Mathematics (1st & 2nd Paper)', totalMarks: '196', grade: 'A+', gpaPoint: '5.00' },
    { id: 'hsc-bio', subjectName: 'Biology (1st & 2nd Paper)', totalMarks: '188', grade: 'A+', gpaPoint: '5.00' },
    { id: 'hsc-ban', subjectName: 'Bangla (1st & 2nd Paper)', totalMarks: '178', grade: 'A+', gpaPoint: '5.00' },
    { id: 'hsc-eng', subjectName: 'English (1st & 2nd Paper)', totalMarks: '184', grade: 'A+', gpaPoint: '5.00' },
    { id: 'hsc-ict', subjectName: 'Information & Communication Technology', totalMarks: '49', grade: 'A+', gpaPoint: '5.00' }
  ],
  transcriptDocumentUrls: [
    { id: 'doc-hsc-1', name: 'HSC_College_Test_Exam_Transcript.pdf', url: '#', uploadDate: '2026-10-20' }
  ],
  academicAchievements: 'College Merit List Top 10; College Physics Olympiad 1st Runner-Up',
  generalNotes: 'National Curriculum & Textbook Board (NCTB) English Version Science stream at Notre Dame College.'
};

// Dedicated Secondary School Certificate (SSC) Archive with authentic NCTB Science group data
export const INITIAL_SSC_ARCHIVE: SscAcademicArchive = {
  schoolName: 'Ideal School & College, Motijheel, Dhaka',
  board: 'Dhaka',
  rollNumber: '128495',
  registrationNumber: '2014892019',
  session: '2022-2023',
  group: 'Science',
  passingYear: '2024',
  examStartDate: '2024-02-15',
  examEndDate: '2024-03-12',
  resultPublishDate: '2024-05-12',
  gpa: '5.00',
  goldenAplus: true,
  totalSubjects: 10,
  subjectMarks: [
    { id: 'ssc-ban', subjectCode: '101-102', subjectName: 'Bangla (1st & 2nd Paper)', theoryMarks: '88', mcqMarks: '28', totalMarks: '184', grade: 'A+', gradePoint: '5.00' },
    { id: 'ssc-eng', subjectCode: '107-108', subjectName: 'English (1st & 2nd Paper)', theoryMarks: '94', totalMarks: '188', grade: 'A+', gradePoint: '5.00' },
    { id: 'ssc-mat', subjectCode: '109', subjectName: 'Mathematics', theoryMarks: '68', mcqMarks: '29', totalMarks: '97', grade: 'A+', gradePoint: '5.00' },
    { id: 'ssc-hmat', subjectCode: '126', subjectName: 'Higher Mathematics', theoryMarks: '48', mcqMarks: '24', practicalMarks: '25', totalMarks: '97', grade: 'A+', gradePoint: '5.00' },
    { id: 'ssc-phy', subjectCode: '174', subjectName: 'Physics', theoryMarks: '47', mcqMarks: '24', practicalMarks: '25', totalMarks: '96', grade: 'A+', gradePoint: '5.00' },
    { id: 'ssc-chem', subjectCode: '176', subjectName: 'Chemistry', theoryMarks: '46', mcqMarks: '24', practicalMarks: '25', totalMarks: '95', grade: 'A+', gradePoint: '5.00' },
    { id: 'ssc-bio', subjectCode: '178', subjectName: 'Biology', theoryMarks: '45', mcqMarks: '23', practicalMarks: '25', totalMarks: '93', grade: 'A+', gradePoint: '5.00' },
    { id: 'ssc-bgs', subjectCode: '150', subjectName: 'Bangladesh & Global Studies', theoryMarks: '63', mcqMarks: '26', totalMarks: '89', grade: 'A+', gradePoint: '5.00' },
    { id: 'ssc-rel', subjectCode: '111', subjectName: 'Islam & Moral Education', theoryMarks: '64', mcqMarks: '28', totalMarks: '92', grade: 'A+', gradePoint: '5.00' },
    { id: 'ssc-ict', subjectCode: '154', subjectName: 'Information & Communication Tech', theoryMarks: '24', practicalMarks: '25', totalMarks: '49', grade: 'A+', gradePoint: '5.00' }
  ],
  certificateDocumentUrl: '#',
  academicAchievements: 'Dhaka Board Top 1% Merit Scholar | National Science Olympiad Finalist',
  generalNotes: 'Secured Golden GPA 5.00 across all 10 subjects. Verified by Board of Intermediate and Secondary Education, Dhaka.'
};

export const INITIAL_ENGLISH_TEST_RECORDS: EnglishTestRecord[] = [
  {
    id: 'ielts-rec-1',
    testType: 'IELTS Academic',
    testDate: '2025-06-15',
    overallScore: '8.0',
    readingScore: '8.0',
    writingScore: '7.5',
    listeningScore: '8.5',
    speakingScore: '8.0',
    targetScore: '8.5',
    notes: 'British Council Dhaka. Meets and exceeds top US college undergraduate requirements (CEFR C1 level).',
    createdAt: '2025-06-15'
  }
];

export const INITIAL_BANGLADESH_ADMISSION_ENTRIES: BangladeshAdmissionNotebookEntry[] = [
  {
    id: 'bd-buet',
    targetInstitution: 'BUET (Bangladesh University of Engineering & Tech)',
    preparationNotes: 'Daily problem solving on higher-order differential calculus, rotational dynamics, and organic stoichiometry.',
    importantDates: 'Preliminary: Nov 2026 | Written: Dec 2026',
    examExperience: 'Mock Model Test Score: 82/100 (Merit position: 142).',
    resultsOrExpectations: 'Targeting Top 200 merit position in CSE / EEE.',
    reflections: 'Strong focus on non-calculator mental arithmetic and speed.',
    updatedAt: '2026-11-03'
  },
  {
    id: 'bd-du',
    targetInstitution: 'University of Dhaka (Ka Unit - Science)',
    preparationNotes: 'Question bank practice from 2018-2025. Memorizing chemical kinetics and inorganic trends.',
    importantDates: 'Exam: Jan 2027',
    examExperience: 'Mock test series in progress.',
    resultsOrExpectations: 'Targeting Department of Computer Science & Engineering (CSE).',
    reflections: 'Negative marking caution: avoid guessing in MCQ.',
    updatedAt: '2026-11-01'
  },
  {
    id: 'bd-iba',
    targetInstitution: 'IBA, University of Dhaka (BBA)',
    preparationNotes: 'Analytical puzzle solving, English vocabulary, and critical reading.',
    importantDates: 'Exam: Feb 2027',
    examExperience: 'Diagnostic test score: 68/100.',
    resultsOrExpectations: 'Targeting Top 50 merit list.',
    reflections: 'Essay writing section requires concise arguments within 20 minutes.',
    updatedAt: '2026-10-25'
  }
];

export const INITIAL_UNIVERSITIES: UniversityProfile[] = [
  {
    id: 'univ-stanford',
    name: 'Stanford University',
    category: 'reach',
    isFavorite: true,
    isArchived: false,
    createdAt: '2026-09-01',
    updatedAt: '2026-11-08',
    country: 'United States',
    state: 'California',
    city: 'Stanford',
    officialWebsite: 'https://www.stanford.edu',
    universityType: 'Private Nonprofit',
    campusSetting: 'Suburban',
    undergraduateEnrollment: '7,761',
    admissionRate: '4.3%',
    satMiddle50: '1470–1570',
    actMiddle50: '33–35',
    applicationDeadlines: {
      reaDeadline: '2027-11-01',
      rdDeadline: '2028-01-01',
      finaidDeadline: '2027-11-15'
    },
    commonAppMember: true,
    applicationFee: '$90 (Waiver available)',
    tuitionAndFees: '$65,000+',
    totalCostOfAttendance: '$87,000',
    financialAidPolicy: 'Need-Aware for International Students; meets 100% of demonstrated need.',
    applicationStrategy: 'Top choice for Computer Science and Entrepreneurship. Consider REA if profile is completely ready.',
    notes: 'Top choice for CS and Entrepreneurship. Consider ED/REA if possible.',
    researchSources: [
      {
        id: 'src-stan-1',
        title: 'Stanford Common Data Set 2024-25',
        url: 'https://ucomm.stanford.edu/cds/',
        dateResearched: '2026-09-15',
        lastVerifiedDate: '2026-10-25',
        sourceType: 'Common Data Set',
        notes: 'Verified 4.3% acceptance rate and need-aware policy for international citizens.'
      }
    ],
    verifiedStats: [
      {
        id: 'stat-stan-1',
        metricLabel: 'Acceptance Rate',
        metricValue: '4.3%',
        sourceTitle: 'Stanford Class Profile 2028',
        sourceUrl: 'https://admission.stanford.edu',
        verificationDate: '2026-10-25'
      },
      {
        id: 'stat-stan-2',
        metricLabel: 'SAT 25th-75th Percentile',
        metricValue: '1470–1570',
        sourceTitle: 'Common Data Set C9',
        sourceUrl: 'https://ucomm.stanford.edu/cds/',
        verificationDate: '2026-10-25'
      }
    ],
    aboutStanford: 'Stanford University is a world-renowned institution known for innovation, entrepreneurship, and academic excellence situated in Silicon Valley.',
    whyStanford: [
      'World-leading undergraduate research opportunities in AI and Robotics',
      'Unmatched Silicon Valley entrepreneurial ecosystem and venture access',
      'Interdisciplinary freedom with the symbolic systems and CS curriculum',
      'Vibrant residential collegiate culture with 4-year guaranteed housing'
    ],
    acceptanceRate: '4.3%',
    satRange: '1470–1570',
    annualTuition: '$65,000+',
    researchProgress: 100,
    applicationRounds: { ed: 'Possible', ea: 'Yes', rd: 'Yes', deadline: 'Jan 1, 2028' },
    relatedResources: [
      { id: 'res-st-1', name: 'Stanford Guide.pdf', type: 'pdf' },
      { id: 'res-st-2', name: 'FAQ.pdf', type: 'pdf' },
      { id: 'res-st-3', name: 'My Research.docx', type: 'doc' }
    ]
  },
  {
    id: 'univ-harvard',
    name: 'Harvard University',
    category: 'reach',
    isFavorite: true,
    isArchived: false,
    createdAt: '2026-09-01',
    updatedAt: '2026-11-08',
    country: 'United States',
    state: 'Massachusetts',
    city: 'Cambridge',
    officialWebsite: 'https://college.harvard.edu',
    universityType: 'Private Nonprofit',
    campusSetting: 'Urban',
    undergraduateEnrollment: '7,165',
    admissionRate: '3.4%',
    satMiddle50: '1500–1580',
    actMiddle50: '34–36',
    applicationDeadlines: {
      reaDeadline: '2027-11-01',
      rdDeadline: '2028-01-01',
      finaidDeadline: '2028-02-01'
    },
    commonAppMember: true,
    applicationFee: '$85 (Waiver available)',
    tuitionAndFees: '$60,000+',
    totalCostOfAttendance: '$85,000',
    financialAidPolicy: '100% Need-Blind for all international students. Meets 100% demonstrated need with zero loans.',
    applicationStrategy: '100% Need-Blind policy makes Harvard the most viable financial aid option. Test score submission mandatory.',
    notes: 'Exceptional undergraduate research and global alumni community. Need-blind grant policy covers 100% need.',
    researchSources: [],
    verifiedStats: [],
    aboutStanford: 'Harvard University is America\'s oldest institution of higher learning, dedicated to excellence in teaching, learning, and research.',
    whyStanford: [
      '100% Need-Blind financial aid for international applicants',
      'House system creating tight-knit residential communities',
      'Unrivaled access to faculty pioneers and global leadership networks'
    ],
    acceptanceRate: '3.4%',
    satRange: '1500–1580',
    annualTuition: '$60,000+',
    researchProgress: 80,
    applicationRounds: { ed: 'No', ea: 'Yes (REA)', rd: 'Yes', deadline: 'Jan 1, 2028' },
    relatedResources: [
      { id: 'res-hv-1', name: 'Harvard Financial Aid Guide.pdf', type: 'pdf' }
    ]
  },
  {
    id: 'univ-mit',
    name: 'Massachusetts Institute of Technology (MIT)',
    category: 'reach',
    isFavorite: false,
    isArchived: false,
    createdAt: '2026-09-05',
    updatedAt: '2026-11-07',
    country: 'United States',
    state: 'Massachusetts',
    city: 'Cambridge',
    officialWebsite: 'https://mitadmissions.org',
    universityType: 'Private Nonprofit',
    campusSetting: 'Urban',
    undergraduateEnrollment: '4,638',
    admissionRate: '4.0%',
    satMiddle50: '1520–1580',
    actMiddle50: '35–36',
    applicationDeadlines: {
      eaDeadline: '2027-11-01',
      rdDeadline: '2028-01-05',
      finaidDeadline: '2028-02-15'
    },
    commonAppMember: false,
    applicationFee: '$75',
    tuitionAndFees: '$62,000+',
    totalCostOfAttendance: '$85,500',
    financialAidPolicy: 'Need-Blind for international applicants; meets 100% of demonstrated need without loans.',
    applicationStrategy: 'Uses separate MyMIT application portal. SAT Math score must ideally be 780-800.',
    notes: 'Requires separate application portal (not on Common App). UROP research program is exceptional.',
    researchSources: [],
    verifiedStats: [],
    aboutStanford: 'World-leading polytechnic research institution driving technological breakthroughs.',
    whyStanford: [
      'Undergraduate Research Opportunities Program (UROP) for 90%+ students',
      'Need-Blind admissions for international students with zero loans',
      'Uncompromising STEM rigor and collaborative nerd culture'
    ],
    acceptanceRate: '4.0%',
    satRange: '1520–1580',
    annualTuition: '$62,000+',
    researchProgress: 60,
    applicationRounds: { ed: 'No', ea: 'Yes', rd: 'Yes', deadline: 'Jan 5, 2028' },
    relatedResources: []
  },
  {
    id: 'univ-berkeley',
    name: 'University of California, Berkeley (UC Berkeley)',
    category: 'target',
    isFavorite: false,
    isArchived: false,
    createdAt: '2026-09-10',
    updatedAt: '2026-11-05',
    country: 'United States',
    state: 'California',
    city: 'Berkeley',
    officialWebsite: 'https://admissions.berkeley.edu',
    universityType: 'Public State',
    campusSetting: 'Urban',
    undergraduateEnrollment: '32,831',
    admissionRate: '11.4%',
    satMiddle50: 'Test-Blind',
    actMiddle50: 'Test-Blind',
    applicationDeadlines: {
      rdDeadline: '2027-11-30',
      finaidDeadline: '2028-03-02'
    },
    commonAppMember: false,
    applicationFee: '$80 (UC Portal)',
    tuitionAndFees: '$48,000 (Out-of-state/intl)',
    totalCostOfAttendance: '$76,000',
    financialAidPolicy: 'No institutional need-based financial aid for international students.',
    applicationStrategy: 'UC Application deadline is November 30. Completely test-blind.',
    notes: 'World-class CS/EECS program. High out-of-state tuition; require external scholarship.',
    researchSources: [],
    verifiedStats: [],
    aboutStanford: 'The premier public research university in the world, renowned for Nobel laureates and free speech movement.',
    whyStanford: [
      'Top-3 Computer Science and Electrical Engineering worldwide',
      'Proximity to San Francisco tech and AI startup ecosystem'
    ],
    acceptanceRate: '11.4%',
    satRange: 'Test-Blind',
    annualTuition: '$48,000+',
    researchProgress: 70,
    applicationRounds: { ed: 'No', ea: 'No', rd: 'Yes', deadline: 'Nov 30, 2027' },
    relatedResources: []
  },
  {
    id: 'univ-columbia',
    name: 'Columbia University',
    category: 'target',
    isFavorite: false,
    isArchived: false,
    createdAt: '2026-09-12',
    updatedAt: '2026-11-04',
    country: 'United States',
    state: 'New York',
    city: 'New York',
    officialWebsite: 'https://undergrad.admissions.columbia.edu',
    universityType: 'Private Nonprofit',
    campusSetting: 'Urban',
    undergraduateEnrollment: '6,600',
    admissionRate: '3.9%',
    satMiddle50: '1490–1560',
    actMiddle50: '34–35',
    applicationDeadlines: {
      edDeadline: '2027-11-01',
      rdDeadline: '2028-01-01',
      finaidDeadline: '2028-02-15'
    },
    commonAppMember: true,
    applicationFee: '$85',
    tuitionAndFees: '$68,000+',
    totalCostOfAttendance: '$89,000',
    financialAidPolicy: 'Need-aware for international students; meets 100% of demonstrated need.',
    applicationStrategy: 'Core Curriculum fosters intellectual depth. Strong NYC internship network.',
    notes: 'Located in Manhattan; Fu Foundation School of Engineering & Applied Science.',
    researchSources: [],
    verifiedStats: [],
    aboutStanford: 'Ivy League research university located in Upper Manhattan with the legendary Core Curriculum.',
    whyStanford: [
      'Rigorous Core Curriculum giving profound analytical foundations',
      'Unfiltered access to New York City industry and research'
    ],
    acceptanceRate: '3.9%',
    satRange: '1490–1560',
    annualTuition: '$68,000+',
    researchProgress: 65,
    applicationRounds: { ed: 'Yes', ea: 'No', rd: 'Yes', deadline: 'Jan 1, 2028' },
    relatedResources: []
  },
  {
    id: 'univ-ucla',
    name: 'University of California, Los Angeles (UCLA)',
    category: 'safety',
    isFavorite: false,
    isArchived: false,
    createdAt: '2026-09-15',
    updatedAt: '2026-11-02',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    officialWebsite: 'https://admission.ucla.edu',
    universityType: 'Public State',
    campusSetting: 'Urban',
    undergraduateEnrollment: '32,121',
    admissionRate: '9.0%',
    satMiddle50: 'Test-Blind',
    actMiddle50: 'Test-Blind',
    applicationDeadlines: {
      rdDeadline: '2027-11-30',
      finaidDeadline: '2028-03-02'
    },
    commonAppMember: false,
    applicationFee: '$80',
    tuitionAndFees: '$47,000 (Non-resident)',
    totalCostOfAttendance: '$74,000',
    financialAidPolicy: 'No need-based institutional financial aid for international undergraduates.',
    applicationStrategy: 'Apply via UC Portal by November 30.',
    notes: 'Top tier public university with vibrant campus life, athletics, and academic strength.',
    researchSources: [],
    verifiedStats: [],
    aboutStanford: 'Premier public university in Southern California known for high academic rankings and dynamic student body.',
    whyStanford: [
      'Top-tier Engineering and Computer Science programs',
      'Vibrant Westwood campus and global alumni network'
    ],
    acceptanceRate: '9.0%',
    satRange: 'Test-Blind',
    annualTuition: '$47,000+',
    researchProgress: 90,
    applicationRounds: { ed: 'No', ea: 'No', rd: 'Yes', deadline: 'Nov 30, 2027' },
    relatedResources: []
  }
];

export const INITIAL_MAIN_ESSAYS: MainEssay[] = [
  {
    id: 'essay-main-1',
    title: 'My Journey: A Story of Growth',
    promptChoice: 'Common App Prompt #1: Background & Identity',
    customPromptText: 'Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it.',
    currentDraftStage: 'Draft in Progress',
    currentContent: `“The hardest battles often build the strongest versions of ourselves.”\n\nGrowing up, I always believed in the power of knowledge, curiosity, and hard work. From a young age, I have been fascinated by how ideas can change lives — whether through science, technology, or human connection. This curiosity has shaped my academic journey and continues to drive my dreams.\n\nWhen I first faced academic setback during the transition to higher secondary education, it felt like an insurmountable wall. The syllabus was vast, expectations were towering, and self-doubt crept in. However, that failure became my greatest turning point. I stopped studying for marks and started studying for deep, genuine comprehension. I built strict daily study systems, analyzed every mistake in physics and mathematics, and turned vulnerability into resilience.\n\nToday, as I prepare to step onto the global stage in American higher education, that quiet discipline remains my foundation. I seek not just to earn a degree, but to build solutions that uplift communities back home in Bangladesh and across the world.`,
    wordCount: 842,
    characterCount: 4723,
    createdAt: '2026-11-06',
    lastEditedDate: '2026-11-09',
    personalNotes: 'Focus on personal vulnerability and resilience. Ensure the voice is authentic and introspective.',
    drafts: [
      {
        id: 'draft-4',
        versionNumber: 4,
        title: 'Final Draft',
        content: `“The hardest battles often build the strongest versions of ourselves.”\n\nGrowing up, I always believed in the power of knowledge, curiosity, and hard work. From a young age, I have been fascinated by how ideas can change lives — whether through science, technology, or human connection. This curiosity has shaped my academic journey and continues to drive my dreams.\n\nWhen I first faced academic setback during the transition to higher secondary education, it felt like an insurmountable wall. The syllabus was vast, expectations were towering, and self-doubt crept in. However, that failure became my greatest turning point. I stopped studying for marks and started studying for deep, genuine comprehension. I built strict daily study systems, analyzed every mistake in physics and mathematics, and turned vulnerability into resilience.\n\nToday, as I prepare to step onto the global stage in American higher education, that quiet discipline remains my foundation. I seek not just to earn a degree, but to build solutions that uplift communities back home in Bangladesh and across the world.`,
        wordCount: 842,
        characterCount: 4723,
        createdAt: '2026-11-09',
        notes: 'Polished and ready to submit. Seamless conclusion and strong imagery.'
      },
      {
        id: 'draft-3',
        versionNumber: 3,
        title: 'Improved Draft',
        content: `Growing up in Dhaka, I was always captivated by the way mathematics and science could decode the chaotic world around me. Yet my journey was far from linear. In 11th grade, academic burnout almost broke my resolve...`,
        wordCount: 821,
        characterCount: 4560,
        createdAt: '2026-11-08',
        notes: 'Better flow and stronger conclusion paragraph.'
      },
      {
        id: 'draft-2',
        versionNumber: 2,
        title: 'Second Draft',
        content: `I remember staring at the blank page after my first term examinations. The marks did not reflect the hours I poured in. That night, I made a pact with myself...`,
        wordCount: 797,
        characterCount: 4390,
        createdAt: '2026-11-07',
        notes: 'More personal and focused on the turning point.'
      },
      {
        id: 'draft-1',
        versionNumber: 1,
        title: 'First Draft',
        content: `My story began in a small classroom in Motijheel where science felt like magic...`,
        wordCount: 743,
        characterCount: 4120,
        createdAt: '2026-11-06',
        notes: 'Rough draft after initial brainstorming session.'
      }
    ]
  }
];

export const INITIAL_STORY_BANK: StoryBankEntry[] = [
  {
    id: 'story-1',
    storyTitle: 'The Night I Didn\'t Give Up',
    experience: 'Working through advanced physics rotational dynamics until 3 AM after failing a diagnostic mock test.',
    personalSignificance: 'Proved to myself that tenacity outperforms temporary setbacks.',
    challenge: 'Overcoming the feeling of being academically outpaced.',
    learning: 'Discipline is a muscle built when motivation is exhausted.',
    personalGrowth: 'Developed a systematic error log method now used across all subjects.',
    possibleEssayConnection: 'Common App Prompt #2 or MIT supplemental prompt on adversity.',
    createdAt: '2026-11-02',
    updatedAt: '2026-11-07'
  },
  {
    id: 'story-2',
    storyTitle: 'A Lesson from Failure',
    experience: 'Organizing the first inter-school math olympiad camp where tech logistics crashed.',
    personalSignificance: 'Learned the difference between solitary competence and collaborative leadership.',
    challenge: '50 students waiting while projector and question portal failed.',
    learning: 'Stay calm, delegate clearly, and have physical paper backups.',
    personalGrowth: 'Gained real composure under crisis.',
    possibleEssayConnection: 'Leadership or problem-solving prompt.',
    createdAt: '2026-10-28',
    updatedAt: '2026-11-04'
  },
  {
    id: 'story-3',
    storyTitle: 'Small Actions, Big Impact',
    experience: 'Tutoring underprivileged children at a local community center every Friday afternoon.',
    personalSignificance: 'Witnessed the transformative power of patient, dedicated guidance.',
    challenge: 'Overcoming language and attention barriers.',
    learning: 'Empathy requires active listening rather than prescriptive instruction.',
    personalGrowth: 'Deepened my commitment to educational equity through technology.',
    possibleEssayConnection: 'Community service essay or Stanford letter to future roommate.',
    createdAt: '2026-10-20',
    updatedAt: '2026-11-02'
  }
];

export const INITIAL_LORS: RecommendationNotebook[] = [
  {
    id: 'lor-1',
    teacherName: 'Dr. Rahman',
    subject: 'Mathematics',
    position: 'University Teacher / Senior Faculty',
    institution: 'University of Dhaka / Higher Secondary Faculty',
    relationshipDuration: '2 years (11th & 12th grade)',
    classesTaught: 'Advanced Calculus, Coordinate Geometry & Differential Equations',
    academicStrengths: 'Top 1% mathematical insight, elegant problem-solving proofs, insatiable curiosity.',
    personalObservations: 'Extremely humble, regularly helps peers understand challenging mathematical concepts after class.',
    relevantExperiences: 'Led the school math team to national round of Bangladesh Math Olympiad.',
    projectsAndAchievements: 'Authored an independent study on applications of calculus in kinetic modeling.',
    leadershipExamples: 'Organized weekend problem-solving circles for high school juniors.',
    specificAnecdotes: 'When solving a complex Putnam-style integration problem, found an alternative geometrical proof that surprised the entire faculty.',
    contextNotes: 'Brag sheet delivered. Dr. Rahman confirmed submission via Common App counselor portal.',
    attachedDocuments: [
      { id: 'lor-doc-1', name: 'My Academic Resume.pdf', url: '#' },
      { id: 'lor-doc-2', name: 'Awards & Certificates.pdf', url: '#' },
      { id: 'lor-doc-3', name: 'LOR Context Notes.docx', url: '#' }
    ],
    currentDraft: `To the Admissions Committee,\n\nIt is my absolute privilege to write in support of this outstanding young scholar. In my twenty-three years of teaching higher mathematics, rarely have I encountered a student with such profound mathematical maturity and genuine intellectual humility...`,
    drafts: [
      {
        id: 'lor-d-1',
        versionNumber: 1,
        title: 'Final Completed Letter',
        draftStatus: 'Final Approved',
        content: `To the Admissions Committee,\n\nIt is my absolute privilege to write in support of this outstanding young scholar. In my twenty-three years of teaching higher mathematics, rarely have I encountered a student with such profound mathematical maturity and genuine intellectual humility...`,
        createdAt: '2026-11-08'
      }
    ],
    createdAt: '2026-10-15',
    updatedAt: '2026-11-08'
  },
  {
    id: 'lor-2',
    teacherName: 'Ms. Khan',
    subject: 'Physics',
    position: 'Senior School Teacher / Lab Head',
    institution: 'Notre Dame College',
    relationshipDuration: '2 years',
    classesTaught: 'Physics Paper 1 & 2 (Mechanics, Thermodynamics, Optics, Nuclear Physics)',
    academicStrengths: 'Exceptional experimental accuracy and conceptual clarity in physics fundamentals.',
    personalObservations: 'Meticulous lab notebook maintainer and natural laboratory leader.',
    relevantExperiences: 'Investigated thermal conductivity variations in locally recycled composite materials.',
    projectsAndAchievements: '1st place in Inter-College Science Fair (Physics stream).',
    leadershipExamples: 'Served as head student lab demonstrator.',
    specificAnecdotes: 'Troubleshot a malfunctioning optical bench setup during college practical examination under time pressure.',
    contextNotes: 'Ms. Khan agreed to submit before November 15.',
    attachedDocuments: [],
    currentDraft: `Dear Admissions Officer,\n\nI enthusiastically recommend this remarkable student for undergraduate admission in your STEM program. In our physics laboratory, their rigor and analytical precision were unmatched...`,
    drafts: [
      {
        id: 'lor-d-2',
        versionNumber: 1,
        title: 'Completed Recommendation',
        draftStatus: 'Final Approved',
        content: `Dear Admissions Officer,\n\nI enthusiastically recommend this remarkable student for undergraduate admission in your STEM program. In our physics laboratory, their rigor and analytical precision were unmatched...`,
        createdAt: '2026-11-05'
      }
    ],
    createdAt: '2026-10-18',
    updatedAt: '2026-11-05'
  },
  {
    id: 'lor-3',
    teacherName: 'Mr. Ahmed',
    subject: 'Computer Science',
    position: 'Mentor / Tech Lead',
    institution: 'National Youth Tech Academy',
    relationshipDuration: '1.5 years',
    classesTaught: 'Data Structures, Python, Web Engineering',
    academicStrengths: 'Fast algorithmic comprehension and clean software engineering architecture.',
    personalObservations: 'Driven by social impact and open-source contribution.',
    relevantExperiences: 'Supervised the AI Study Assistant passion project.',
    projectsAndAchievements: 'Built an open-source study planner repository with 150+ stars on GitHub.',
    leadershipExamples: 'Mentored 12 younger high school students in introductory coding.',
    specificAnecdotes: 'Diagnosed an async race condition in a student portal project and walked teammates through the debugging process.',
    contextNotes: 'Draft currently in progress. Target submission early December.',
    attachedDocuments: [],
    currentDraft: `It gives me great satisfaction to recommend this student. Over eighteen months of mentoring, I watched them transform from a curious beginner into an inventive software builder...`,
    drafts: [],
    createdAt: '2026-10-22',
    updatedAt: '2026-11-03'
  },
  {
    id: 'lor-4',
    teacherName: 'Prof. Islam',
    subject: 'Research & Applied Sciences',
    position: 'Adjunct Professor',
    institution: 'Institute of Scientific Research, Dhaka',
    relationshipDuration: '1 year',
    classesTaught: 'Research Methodology',
    academicStrengths: 'High critical reading skills and academic literature synthesis.',
    personalObservations: 'Independent, self-motivated, and tenacious.',
    relevantExperiences: 'Literature review co-author for environmental telemetry project.',
    projectsAndAchievements: 'Co-authored draft manuscript on low-cost air quality sensors.',
    leadershipExamples: 'Coordinated field data collection across 5 sampling sites.',
    specificAnecdotes: 'Spent an entire weekend recalibrating MQ-135 sensors to eliminate humidity bias in monsoon data.',
    contextNotes: 'Initial draft outline prepared.',
    attachedDocuments: [],
    currentDraft: `I am writing to express my strongest recommendation for this highly capable young researcher...`,
    drafts: [],
    createdAt: '2026-10-25',
    updatedAt: '2026-10-28'
  }
];

export const INITIAL_SOPS: SopDocument[] = [
  {
    id: 'sop-general',
    title: 'General SOP',
    targetUniversityOrProgram: 'For overall applications & scholarship committees',
    purpose: 'Comprehensive statement of purpose detailing academic background, passion for computer science, and vision for educational technology in South Asia.',
    academicBackground: 'Ranked in top 1% across national board examinations (SSC Golden GPA 5.00, HSC Science track at Notre Dame College). Rigorous foundations in higher mathematics and physics.',
    personalMotivation: 'Witnessing how educational disparity restricts brilliant minds in developing nations like Bangladesh, and realizing scalable software can democratize elite learning.',
    academicInterests: 'Computer Science, Human-Computer Interaction, Machine Learning for Education, Distributed Systems.',
    futureGoals: 'To spearhead software products and research initiatives that bridge technological barriers for underserved students across emerging economies.',
    relevantExperiences: 'Developing the AI Study Assistant, conducting physics research, and tutoring high school students in STEM.',
    researchInterests: 'Adaptive learning algorithms, lightweight offline NLP models for low-bandwidth environments.',
    currentDraft: `Statement of Purpose\n\nCuriosity has always been my compass. Growing up in Dhaka, where vibrant cultural resilience contrasts with systemic resource limitations, I realized early on that technology is the ultimate equalizer.\n\nMy academic journey through the rigorous Bangladeshi national science curriculum provided me with an uncompromising grounding in calculus, physics, and analytical thinking. Achieving a Golden GPA 5.00 in SSC and maintaining top ranks at Notre Dame College reinforced my belief that deep mastery comes from relentless daily discipline.\n\nIn American undergraduate education, I seek an environment where interdisciplinary exploration meets world-class engineering rigor. I intend to immerse myself in computer science and applied machine learning, collaborating with faculty who push the boundaries of what software can achieve for human flourishing.\n\nUpon graduation, my long-term ambition is to launch technology enterprises and open-source infrastructure tailored for South Asia, ensuring that where a child is born never dictates the limits of what they can learn.`,
    drafts: [
      {
        id: 'sop-d-1',
        versionNumber: 3,
        title: 'Final Draft',
        content: `Statement of Purpose\n\nCuriosity has always been my compass. Growing up in Dhaka, where vibrant cultural resilience contrasts with systemic resource limitations, I realized early on that technology is the ultimate equalizer...`,
        createdAt: '2027-11-01',
        notes: 'Finalized and polished for submission.'
      },
      {
        id: 'sop-d-2',
        versionNumber: 2,
        title: 'Improved Draft',
        content: `Curiosity has been my driving force. Through my high school studies in Dhaka...`,
        createdAt: '2027-10-30',
        notes: 'Enhanced flow and academic positioning.'
      },
      {
        id: 'sop-d-3',
        versionNumber: 1,
        title: 'First Draft',
        content: `I am applying to study Computer Science because I love solving problems...`,
        createdAt: '2027-10-25',
        notes: 'Initial brainstorming version.'
      }
    ],
    finalVersionNotes: 'Ready for use across general applications and scholarship portfolios.',
    personalNotes: 'Emphasize both academic rigor and social mission.',
    createdAt: '2026-10-10',
    updatedAt: '2027-11-01'
  },
  {
    id: 'sop-stanford',
    title: 'Stanford SOP',
    targetUniversityOrProgram: 'For Stanford University (School of Engineering)',
    purpose: 'Tailored statement connecting personal background with Stanford\'s entrepreneurial culture and AI research centers.',
    academicBackground: 'Top 1% STEM scholar, SAT 1520+, Physics & Math olympiad finalist.',
    personalMotivation: 'Merging technical depth with Silicon Valley innovation to solve grand challenges.',
    academicInterests: 'Computer Science, Artificial Intelligence, Symbolic Systems.',
    futureGoals: 'Launch an AI educational technology venture in collaboration with Stanford accelerators.',
    relevantExperiences: 'Building full-stack software prototypes and conducting lab telemetry research.',
    researchInterests: 'Stanford HAI (Human-Centered AI) and Stanford Artificial Intelligence Laboratory (SAIL).',
    currentDraft: `Stanford Statement of Purpose\n\nStanford stands at the unique intersection of rigorous technological inquiry and audacious human ambition. For a student from Bangladesh who believes code can reshape opportunity, there is no more electrifying community.\n\nI want to work with professors at Stanford HAI exploring how machine learning can personalize pedagogy for low-resource languages...`,
    drafts: [],
    finalVersionNotes: 'In progress. Needs further specificity on 2 faculty members.',
    personalNotes: 'Mention HAI and D-School collaboration.',
    createdAt: '2026-10-15',
    updatedAt: '2027-10-28'
  },
  {
    id: 'sop-mit',
    title: 'MIT SOP',
    targetUniversityOrProgram: 'For MIT (Course 6-3: Computer Science & Engineering)',
    purpose: 'Deeply technical essay focusing on hands-on making, mens et manus philosophy, and computational research.',
    academicBackground: 'Mathematics and Physics mastery, algorithm design, hardware tinkering.',
    personalMotivation: 'The joy of building things that work and solving hard mathematical bottlenecks.',
    academicInterests: 'Computer Science, Operating Systems, Computational Theory.',
    futureGoals: 'Lead research in scalable distributed systems and open computational platforms.',
    relevantExperiences: 'Independent algorithms research and sensor telemetry calibration.',
    researchInterests: 'CSAIL (Computer Science and Artificial Intelligence Laboratory).',
    currentDraft: `MIT Statement of Purpose\n\n"Mind and Hand" is not merely a motto; it has been the defining principle of my upbringing. Whether soldering low-cost air quality monitors or writing algorithms to parse study schedules, I learn best when my hands are dirty with creation...`,
    drafts: [],
    finalVersionNotes: 'Draft version. Expanding on UROP ambitions.',
    personalNotes: 'Focus on mens et manus ethos.',
    createdAt: '2026-10-20',
    updatedAt: '2027-10-25'
  }
];

export const INITIAL_ECAS: EcaActivityEntry[] = [
  {
    id: 'eca-1',
    activityName: 'Model United Nations (MUN)',
    organization: 'DPS MUN & National MUN Circuit',
    category: 'Leadership',
    positionOrRole: 'Head Delegate / Committee Chair',
    startDate: 'Jan 2025',
    endDate: 'Present',
    isOngoing: true,
    hoursPerWeek: 3,
    weeksPerYear: 30,
    yearsInvolved: ['10', '11', '12'],
    responsibilities: 'Represented delegations across 6 national conferences. Chaired the UNEP committee for 65 delegates. Authored 3 comprehensive background study guides.',
    achievements: 'Awarded Best Delegate twice; Outstanding Delegate at National Youth MUN 2025.',
    leadershipDetails: 'Trained 25 novice delegates in parliamentary procedure, resolution drafting, and diplomatic negotiation.',
    communityImpact: 'Coordinated a charity resolution raising funds for winter blankets in northern Bangladesh.',
    personalGrowth: 'Transformed from a timid public speaker into an articulate negotiator capable of consensus building.',
    skillsDeveloped: 'Public speaking, diplomatic drafting, multilateral negotiation, geopolitical analysis.',
    measurableOutcomes: '65 delegates chaired, 4 working papers passed, 2 Best Delegate gavels.',
    evidenceLinks: [],
    personalReflections: 'MUN taught me that complex global challenges cannot be solved with rhetoric alone; they demand rigorous technical preparation.',
    unrestrictedNotes: 'Common App Activity #1. Highlight consensus building and leadership.',
    order: 1,
    createdAt: '2026-09-01',
    updatedAt: '2026-11-07'
  },
  {
    id: 'eca-2',
    activityName: 'Bangladesh Math Olympiad',
    organization: 'Bangladesh Mathematical Olympiad Committee (BdMO)',
    category: 'Academic Competitions',
    positionOrRole: 'Competitor / National Round Finalist',
    startDate: 'Jan 2024',
    endDate: 'Dec 2024',
    isOngoing: false,
    hoursPerWeek: 6,
    weeksPerYear: 24,
    yearsInvolved: ['9', '10', '11'],
    responsibilities: 'Solved advanced Euclidean geometry, number theory, combinatorics, and functional equations daily.',
    achievements: 'Regional Champion (Dhaka South) and National Round Finalist at Bangladesh National Math Olympiad.',
    leadershipDetails: 'Organized peer study circles at school to share problem-solving proofs and Olympiad techniques.',
    communityImpact: 'Mentored junior students who subsequently qualified for regional rounds.',
    personalGrowth: 'Embraced the beauty of mathematical proof and learned to persist through hours of unsolved problems.',
    skillsDeveloped: 'Combinatorial reasoning, geometric proof, Diophantine equations, number theory.',
    measurableOutcomes: 'Top 50 national ranking among 10,000+ regional participants.',
    evidenceLinks: [],
    personalReflections: 'Math Olympiad taught me that a problem is never truly unsolvable; one simply hasn\'t found the right coordinate system.',
    unrestrictedNotes: 'Common App Activity #2. Demonstrates deep intellectual curiosity.',
    order: 2,
    createdAt: '2026-09-02',
    updatedAt: '2026-11-02'
  },
  {
    id: 'eca-3',
    activityName: 'Volunteer at Local NGO',
    organization: 'Prerona Youth Foundation, Dhaka',
    category: 'Community Service',
    positionOrRole: 'Lead Educational Volunteer',
    startDate: 'Jun 2023',
    endDate: 'Dec 2024',
    isOngoing: false,
    hoursPerWeek: 4,
    weeksPerYear: 26,
    yearsInvolved: ['9', '10'],
    responsibilities: 'Taught basic mathematics, science, and English to 40+ underprivileged children weekly in urban slum communities.',
    achievements: 'Helped 15 students successfully transition into formal public primary and middle schools.',
    leadershipDetails: 'Managed a team of 8 student volunteers, curriculum design, and learning materials collection.',
    communityImpact: 'Collected and distributed over 300 textbooks and school stationery sets.',
    personalGrowth: 'Developed profound empathy and an unwavering drive to make quality education universally accessible.',
    skillsDeveloped: 'Curriculum development, youth mentoring, grassroots logistics, empathetic communication.',
    measurableOutcomes: '40+ children tutored, 15 enrolled in formal schooling, 300+ books distributed.',
    evidenceLinks: [],
    personalReflections: 'Seeing a child read their first complete sentence reinforced that education is the most powerful weapon of hope.',
    unrestrictedNotes: 'Common App Activity #3.',
    order: 3,
    createdAt: '2026-09-03',
    updatedAt: '2026-10-26'
  }
];

export const INITIAL_ACTIVE_PROJECTS: ActivePassionProject[] = [
  {
    id: 'proj-study-assistant',
    projectTitle: 'AI Study Assistant',
    status: 'Active Development',
    overview: 'A personal project to build an AI-powered study companion with features like personalized study plans, progress tracking, syllabus breakdown, and smart recommendations.',
    research: 'Surveyed 120 Bangladeshi HSC students regarding time management bottlenecks and exam anxiety.',
    planning: 'Designed modular microservice architecture combining React SPA, Node backend, and spaced repetition algorithms.',
    objectives: 'Empower self-studying students with structured daily study schedules and instant syllabus tracking.',
    milestones: [
      { id: 'm-1', title: 'Develop a working prototype', completed: true, targetDate: '2025-11-15' },
      { id: 'm-2', title: 'Test with real study data', completed: true, targetDate: '2025-11-30' },
      { id: 'm-3', title: 'Document the development process', completed: true, targetDate: '2025-12-10' },
      { id: 'm-4', title: 'Deploy public beta to 50 students', completed: false, targetDate: '2025-12-25' },
      { id: 'm-5', title: 'Gather user retention analytics', completed: false, targetDate: '2026-01-15' }
    ],
    tasks: [
      'Refine local storage state synchronization',
      'Optimize mobile responsive touch target sizing',
      'Add markdown export for student revision notes'
    ],
    devLog: [
      {
        id: 'log-1',
        date: '2025-11-03',
        title: 'Added new feature: study planner',
        summary: 'Implemented interactive timetable module and dynamic countdown calculations for target exams.'
      },
      {
        id: 'log-2',
        date: '2025-10-25',
        title: 'Database schema refinement',
        summary: 'Architected local-first caching strategy ensuring 100% offline usability.'
      }
    ],
    weeklyProgressNotes: 'Prototype is stable and achieving 70% completion milestone.',
    challengesAndSolutions: 'Handling complex syllabus subdivisions resolved via recursive tree data structures.',
    results: 'Beta version in active daily use by creator and test peers.',
    impact: 'Reduced daily schedule planning time from 30 minutes to 3 minutes.',
    evidenceAndDocLinks: [
      { id: 'ev-1', title: 'GitHub Repository', url: 'https://github.com/example/ai-study-companion' }
    ],
    finalReflection: 'Building software for one\'s own pain points produces the highest quality product iterations.',
    createdAt: '2025-11-01',
    updatedAt: '2025-11-03'
  },
  {
    id: 'proj-green-future',
    projectTitle: 'Green Future Initiative',
    status: 'In Planning',
    overview: 'Promoting environmental awareness, low-cost air quality tracking, and urban tree canopy mapping in Dhaka.',
    research: 'Studied Dhaka seasonal air quality index patterns using satellite and ground station APIs.',
    planning: 'Low-cost sensor deployment plan mapped across 5 city wards.',
    objectives: 'Raise public consciousness on PM2.5 levels and organize community tree planting drives.',
    milestones: [
      { id: 'm-gf-1', title: 'Research low-cost sensor components', completed: true, targetDate: '2026-01-10' },
      { id: 'm-gf-2', title: 'Assemble initial Arduino prototype', completed: true, targetDate: '2026-02-15' },
      { id: 'm-gf-3', title: 'Deploy sensor nodes', completed: false, targetDate: '2026-03-30' }
    ],
    tasks: ['Calibrate sensor temperature bias', 'Write community outreach brochure'],
    devLog: [],
    weeklyProgressNotes: 'Sensor housing 3D printed; currently undergoing calibration.',
    challengesAndSolutions: 'Sensor drift under high tropical humidity addressed with waterproof membrane.',
    results: 'Prototype reading verified against US Embassy Dhaka air station.',
    impact: 'Engaged 30 student volunteers in environmental monitoring.',
    evidenceAndDocLinks: [],
    finalReflection: 'Grassroots science democratizes environmental justice.',
    createdAt: '2026-01-05',
    updatedAt: '2026-02-15'
  },
  {
    id: 'proj-data-analytics',
    projectTitle: 'Data Analytics Project',
    status: 'In Planning',
    overview: 'Analyzing academic performance datasets to predict learning bottlenecks and improve retention curves.',
    research: 'Studied Ebbinghaus forgetting curve mathematical models.',
    planning: 'Data pipeline using Python pandas and Jupyter notebooks.',
    objectives: 'Produce actionable insights on optimal study-to-break intervals.',
    milestones: [
      { id: 'm-da-1', title: 'Gather anonymized study logs', completed: true, targetDate: '2026-02-01' },
      { id: 'm-da-2', title: 'Perform correlation analysis', completed: false, targetDate: '2026-03-01' }
    ],
    tasks: ['Clean tabular data', 'Build regression model'],
    devLog: [],
    weeklyProgressNotes: '20% progress on data cleaning phase.',
    challengesAndSolutions: 'Dealing with missing timestamp entries.',
    results: 'Preliminary findings show 50-minute blocks with 10-minute breaks maximize retention.',
    impact: 'Applied directly to improve Comeback Tracker routine timings.',
    evidenceAndDocLinks: [],
    finalReflection: 'Empirical data eliminates guesswork in habit formation.',
    createdAt: '2026-02-01',
    updatedAt: '2026-02-20'
  }
];

export const INITIAL_PROJECT_IDEAS: PassionProjectIdea[] = [
  {
    id: 'idea-1',
    projectTitle: 'Build an AI tool for students',
    problemBeingAddressed: 'High school students lack personalized feedback on essay structure and Olympiad problem derivations.',
    ideaDescription: 'A focused, lightweight AI web assistant designed for high school science and essay drafting.',
    whyIPursueIt: 'Every student deserves the mentorship of a dedicated tutor regardless of economic background.',
    targetAudience: 'High school students preparing for college admissions and Olympiads.',
    possibleImpact: 'Democratize elite academic feedback across Bangladesh and beyond.',
    requiredResources: 'Next.js, Python, open-source LLM APIs, cloud hosting.',
    skillsRequired: 'Full-stack engineering, prompt design, UI/UX.',
    researchNotes: 'Investigated student attention spans and feedback loops.',
    challengesAnticipated: 'Preventing AI hallucinations in complex mathematical formulas.',
    expectedOutcomes: 'Free web application used by 500+ active students.',
    personalNotes: 'Promote to active project when study assistant beta concludes.',
    isPromotedToActive: false,
    createdAt: '2026-09-10',
    updatedAt: '2026-10-15'
  },
  {
    id: 'idea-2',
    projectTitle: 'Climate Action Awareness App',
    problemBeingAddressed: 'Lack of local neighborhood-level awareness regarding heat island effects and urban waterlogging in Dhaka.',
    ideaDescription: 'A crowdsourced reporting and visualization tool for urban environmental hazards.',
    whyIPursueIt: 'Dhaka faces existential monsoon flooding and climate pressures that require civic action.',
    targetAudience: 'Youth, environmental NGOs, municipal volunteers.',
    possibleImpact: 'Enable rapid citizen response and data-backed civic advocacy.',
    requiredResources: 'Mapping APIs, mobile web app framework.',
    skillsRequired: 'GIS mapping, mobile UI design, community organizing.',
    researchNotes: 'Connected with local university climate researchers.',
    challengesAnticipated: 'Ensuring user data verification and spam prevention.',
    expectedOutcomes: 'Interactive live hazard map of Dhaka metropolitan areas.',
    personalNotes: 'Social impact project suitable for community leadership essays.',
    isPromotedToActive: false,
    createdAt: '2026-09-15',
    updatedAt: '2026-10-18'
  },
  {
    id: 'idea-3',
    projectTitle: 'Personal Knowledge Management App',
    problemBeingAddressed: 'Academic bookmarks, research papers, and study notes are scattered across multiple disparate tools.',
    ideaDescription: 'A single, unified minimalist knowledge base with bi-directional linking and source verification.',
    whyIPursueIt: 'To create the ultimate student workbench that saves hundreds of hours of research.',
    targetAudience: 'College applicants, researchers, self-taught scholars.',
    possibleImpact: 'Eliminates digital clutter and boosts learning velocity.',
    requiredResources: 'React, TypeScript, IndexedDB / LocalStorage.',
    skillsRequired: 'Information architecture, fast keyboard navigation design.',
    researchNotes: 'Studied Zettelkasten and evergreen notes methodologies.',
    challengesAnticipated: 'Keeping the interface lightning fast with thousands of entries.',
    expectedOutcomes: 'Clean desktop-optimized productivity app.',
    personalNotes: 'Directly inspires the Research Vault module in Comeback Tracker.',
    isPromotedToActive: false,
    createdAt: '2026-09-20',
    updatedAt: '2026-10-20'
  }
];

export const INITIAL_RESEARCH_VAULT_ITEMS: ResearchVaultItem[] = [
  {
    id: 'vault-1',
    title: 'Stanford University Common Data Set 2024-2025',
    description: 'Official university data report detailing admission rates, middle-50% test score ranges, and international financial aid policies.',
    category: 'University Research',
    sourceUrl: 'https://ucomm.stanford.edu/cds/',
    dateAdded: '2026-10-01',
    lastVerifiedDate: '2026-10-28',
    tags: ['Stanford', 'Common Data Set', 'Statistics', 'Verified'],
    relatedUniversityId: 'univ-stanford',
    personalNotes: 'Section C9 verifies SAT 25th-75th percentile (1470-1570). Section H6 notes need-aware policy for non-citizens.'
  },
  {
    id: 'vault-2',
    title: 'Harvard Financial Aid & International Student Policies',
    description: 'Guidelines on 100% need-blind admissions, zero-loan packages, and CSS Profile submission for Bangladeshi applicants.',
    category: 'Financial Aid',
    sourceUrl: 'https://college.harvard.edu/admissions/financial-aid',
    dateAdded: '2026-10-05',
    lastVerifiedDate: '2026-10-30',
    tags: ['Harvard', 'Need-Blind', 'Financial Aid', 'CSS Profile'],
    relatedUniversityId: 'univ-harvard',
    personalNotes: 'Requires parent tax returns or employer income certificates with official English translations.'
  },
  {
    id: 'vault-3',
    title: 'Digital SAT Concordance & Reading Practice Guide',
    description: 'Strategies for mastering high-difficulty inference questions and vocabulary in context on Module 2.',
    category: 'SAT',
    sourceUrl: 'https://satsuite.collegeboard.org',
    dateAdded: '2026-09-20',
    lastVerifiedDate: '2026-10-25',
    tags: ['SAT', 'RW', 'Strategy', 'Test Prep'],
    personalNotes: 'Focus on transition word relationships (contrast vs addition vs cause-and-effect).'
  },
  {
    id: 'vault-4',
    title: 'BUET Undergraduate Admission Syllabus & Model Tests',
    description: 'Official test pattern and previous 10 years question breakdown for Engineering & Architecture faculties.',
    category: 'Admission Requirements',
    sourceUrl: 'https://www.buet.ac.bd',
    dateAdded: '2026-09-15',
    lastVerifiedDate: '2026-10-22',
    tags: ['BUET', 'Engineering', 'Bangladesh Tests', 'Syllabus'],
    personalNotes: 'Physics and Higher Mathematics comprise 70% of total score weight.'
  }
];

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

// Discovery Directory of Worldwide & US Universities
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
    overview: 'Premier Ivy League institution. 100% Need-Blind for international applicants, meets 100% demonstrated need with grant-based aid. Reinstated standardized testing requirement for Fall 2025 onwards.'
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
    undergraduatePrograms: 'Computer Science, Economics, Ethics, Politics & Economics, Molecular Biophysics & Biochemistry',
    typicalRounds: ['SCEA', 'RD'],
    suggestedTier: 'reach',
    overview: 'Residential college community, test-flexible policy (SAT, ACT, AP, or IB), 100% need-blind and full need met for all international undergraduates.'
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
    satPolicy: 'Required',
    internationalAidPolicy: 'Need-Aware',
    undergraduatePrograms: 'Physics, Computer Science, Mechanical Engineering, Applied Physics, Chemical Engineering',
    typicalRounds: ['REA', 'RD'],
    suggestedTier: 'reach',
    overview: 'Intensely rigorous scientific training with a small, elite cohort. Manages NASA Jet Propulsion Laboratory (JPL). Requires standardized test scores for upcoming cycles.'
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
    undergraduatePrograms: 'Computer Science, Financial Economics, Applied Physics, Biomedical Engineering, Core Curriculum',
    typicalRounds: ['ED', 'RD'],
    suggestedTier: 'reach',
    overview: 'Ivy League in Manhattan with the legendary Core Curriculum. Permanent test-optional policy. Meets 100% demonstrated financial need, need-aware for international students.'
  },
  {
    id: 'disc-dartmouth',
    name: 'Dartmouth College',
    country: 'United States',
    state: 'New Hampshire',
    city: 'Hanover',
    universityType: 'Private Nonprofit',
    officialWebsite: 'https://admissions.dartmouth.edu',
    commonAppAvailable: true,
    satPolicy: 'Required',
    internationalAidPolicy: 'Need-Blind',
    undergraduatePrograms: 'Computer Science, Quantitative Social Science, Engineering Sciences, Economics',
    typicalRounds: ['ED', 'RD'],
    suggestedTier: 'reach',
    overview: 'One of the few US institutions that is 100% Need-Blind for all international students. Reinstated SAT requirement.'
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
    undergraduatePrograms: 'Computer Science, Mathematics, Physics, Economics, Open Curriculum',
    typicalRounds: ['ED', 'RD'],
    suggestedTier: 'reach',
    overview: 'Top-ranked liberal arts college with an Open Curriculum (no distribution requirements). 100% Need-Blind for international applicants with zero-loan financial aid.'
  },
  {
    id: 'disc-williams',
    name: 'Williams College',
    country: 'United States',
    state: 'Massachusetts',
    city: 'Williamstown',
    universityType: 'Liberal Arts College',
    officialWebsite: 'https://www.williams.edu/admission-aid',
    commonAppAvailable: true,
    satPolicy: 'Test-Optional',
    internationalAidPolicy: 'Need-Aware',
    undergraduatePrograms: 'Mathematics, Computer Science, Physics, Economics, Oxford-style Tutorials',
    typicalRounds: ['ED', 'RD'],
    suggestedTier: 'reach',
    overview: 'Celebrated for Oxford-style undergraduate tutorials, high graduate school placement, and all-grant financial aid packages.'
  },
  {
    id: 'disc-cornell',
    name: 'Cornell University',
    country: 'United States',
    state: 'New York',
    city: 'Ithaca',
    universityType: 'Private Nonprofit',
    officialWebsite: 'https://admissions.cornell.edu',
    commonAppAvailable: true,
    satPolicy: 'Required',
    internationalAidPolicy: 'Need-Aware',
    undergraduatePrograms: 'Bowers College of Computing & Information Science, College of Engineering, Operations Research',
    typicalRounds: ['ED', 'RD'],
    suggestedTier: 'reach',
    overview: 'Ivy League university with premier engineering and computer science programs. Reinstated standardized testing requirement for Fall 2026 onwards.'
  },
  {
    id: 'disc-brown',
    name: 'Brown University',
    country: 'United States',
    state: 'Rhode Island',
    city: 'Providence',
    universityType: 'Private Nonprofit',
    officialWebsite: 'https://admission.brown.edu',
    commonAppAvailable: true,
    satPolicy: 'Required',
    internationalAidPolicy: 'Need-Blind',
    undergraduatePrograms: 'Computer Science, Applied Mathematics, Computational Biology, Open Curriculum',
    typicalRounds: ['ED', 'RD'],
    suggestedTier: 'reach',
    overview: 'Famed Open Curriculum allowing students to construct their own educational path. Officially Need-Blind for international applicants starting with the Class of 2029.'
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
    internationalAidPolicy: 'None',
    undergraduatePrograms: 'Computer Science, Aerospace Engineering, Industrial & Systems Engineering, Electrical Engineering',
    typicalRounds: ['EA', 'RD'],
    suggestedTier: 'target',
    overview: 'World-renowned public engineering powerhouse in Atlanta. SAT/ACT required by University System of Georgia. Minimal institutional need-based aid for international students.'
  },
  {
    id: 'disc-purdue',
    name: 'Purdue University',
    country: 'United States',
    state: 'Indiana',
    city: 'West Lafayette',
    universityType: 'Public State',
    officialWebsite: 'https://www.admissions.purdue.edu',
    commonAppAvailable: true,
    satPolicy: 'Required',
    internationalAidPolicy: 'None',
    undergraduatePrograms: 'Computer Science, Mechanical Engineering, Aviation/Aerospace, Data Science, Electrical Engineering',
    typicalRounds: ['EA', 'RD'],
    suggestedTier: 'target',
    overview: 'Top tier engineering and STEM education with frozen tuition for over a decade. Highly competitive for CS and First-Year Engineering. November 1 Early Action is crucial.'
  },
  {
    id: 'disc-umich',
    name: 'University of Michigan (UMich)',
    country: 'United States',
    state: 'Michigan',
    city: 'Ann Arbor',
    universityType: 'Public State',
    officialWebsite: 'https://admissions.umich.edu',
    commonAppAvailable: true,
    satPolicy: 'Test-Optional',
    internationalAidPolicy: 'None',
    undergraduatePrograms: 'Computer Science & Engineering, Ross School of Business, Industrial Operations, Robotics',
    typicalRounds: ['EA', 'RD'],
    suggestedTier: 'target',
    overview: 'One of America\'s premier public research universities. Advanced computing facilities and massive global alumni network.'
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
    undergraduatePrograms: 'Turing Scholars CS, Cockrell School of Engineering, McCombs Business, Physics',
    typicalRounds: ['EA', 'RD'],
    suggestedTier: 'target',
    overview: 'Top tier computer science and engineering programs located in Austin tech corridor. Reinstated standardized testing requirement.'
  },
  {
    id: 'disc-nyu',
    name: 'New York University (NYU)',
    country: 'United States',
    state: 'New York',
    city: 'New York',
    universityType: 'Private Nonprofit',
    officialWebsite: 'https://www.nyu.edu/admissions',
    commonAppAvailable: true,
    satPolicy: 'Test-Optional',
    internationalAidPolicy: 'Need-Aware',
    undergraduatePrograms: 'Tandon School of Engineering, Stern School of Business, Courant Institute Mathematics, Computer Science',
    typicalRounds: ['ED', 'ED2', 'RD'],
    suggestedTier: 'target',
    overview: 'Global university integrated into Greenwich Village and Brooklyn Tech Triangle. Meets 100% of demonstrated need for all admitted first-year undergraduates, including international.'
  },
  {
    id: 'disc-swarthmore',
    name: 'Swarthmore College',
    country: 'United States',
    state: 'Pennsylvania',
    city: 'Swarthmore',
    universityType: 'Liberal Arts College',
    officialWebsite: 'https://www.swarthmore.edu/admissions-aid',
    commonAppAvailable: true,
    satPolicy: 'Test-Optional',
    internationalAidPolicy: 'Need-Aware',
    undergraduatePrograms: 'Engineering (ABET accredited AB/BS), Computer Science, Economics, Honors Program',
    typicalRounds: ['ED', 'ED2', 'RD'],
    suggestedTier: 'reach',
    overview: 'Unique liberal arts college offering an ABET-accredited general engineering program and intellectual honors seminars.'
  },
  {
    id: 'disc-bowdoin',
    name: 'Bowdoin College',
    country: 'United States',
    state: 'Maine',
    city: 'Brunswick',
    universityType: 'Liberal Arts College',
    officialWebsite: 'https://www.bowdoin.edu/admissions',
    commonAppAvailable: true,
    satPolicy: 'Test-Optional',
    internationalAidPolicy: 'Need-Blind',
    undergraduatePrograms: 'Computer Science, Mathematics, Environmental Studies, Digital and Computational Studies',
    typicalRounds: ['ED', 'ED2', 'RD'],
    suggestedTier: 'reach',
    overview: '100% Need-Blind for all international students with all-grant, no-loan aid packages. Pioneers in test-optional admissions since 1969.'
  },
  {
    id: 'disc-drexel',
    name: 'Drexel University',
    country: 'United States',
    state: 'Pennsylvania',
    city: 'Philadelphia',
    universityType: 'Private Nonprofit',
    officialWebsite: 'https://drexel.edu/admissions',
    commonAppAvailable: true,
    satPolicy: 'Test-Optional',
    internationalAidPolicy: 'Limited / Competitive',
    undergraduatePrograms: 'Computer Science, Software Engineering, Co-op Program, Data Science',
    typicalRounds: ['EA', 'RD'],
    suggestedTier: 'safety',
    overview: 'Renowned for its cooperative education (Co-op) model offering up to 18 months of full-time paid professional industry work before graduation. Offers international merit scholarships.'
  },
  {
    id: 'disc-msu',
    name: 'Michigan State University (MSU)',
    country: 'United States',
    state: 'Michigan',
    city: 'East Lansing',
    universityType: 'Public State',
    officialWebsite: 'https://admissions.msu.edu',
    commonAppAvailable: true,
    satPolicy: 'Test-Optional',
    internationalAidPolicy: 'Limited / Competitive',
    undergraduatePrograms: 'Computer Science, Mechanical Engineering, Supply Chain Management, Packaging',
    typicalRounds: ['EA', 'RD', 'Rolling'],
    suggestedTier: 'safety',
    overview: 'Strong Big Ten research institution with rolling admission options and merit scholarships for high-achieving international applicants.'
  },
  {
    id: 'disc-arizona',
    name: 'University of Arizona',
    country: 'United States',
    state: 'Arizona',
    city: 'Tucson',
    universityType: 'Public State',
    officialWebsite: 'https://admissions.arizona.edu',
    commonAppAvailable: true,
    satPolicy: 'Test-Optional',
    internationalAidPolicy: 'Limited / Competitive',
    undergraduatePrograms: 'Computer Science, Optical Sciences, Astronomy, Space Systems Engineering',
    typicalRounds: ['Rolling'],
    suggestedTier: 'safety',
    overview: 'Top public research institution with transparent, tiered Global Wildcat merit tuition awards based on GPA and test scores.'
  }
];
