// USA University Application Knowledge Base Types (Fall 2028 Cycle)

export type UsaSubSection = 
  | 'dashboard'
  | 'colleges'
  | 'essays'
  | 'academics'
  | 'lors'
  | 'sop'
  | 'ecas'
  | 'projects'
  | 'strategy'
  | 'vault'
  | 'admissions-ai';

export type CollegeCategory = 'reach' | 'target' | 'safety';

export type ApplicationRound = 'ED' | 'ED2' | 'EA' | 'REA' | 'SCEA' | 'RD' | 'Rolling';

export type RequirementStatus = 'Required' | 'Optional' | 'Recommended' | 'Not Accepted' | 'Considered';

export type DecisionStatus = 'Considering' | 'Decided' | 'Submitted' | 'Deferred' | 'Accepted' | 'Waitlisted' | 'Rejected';

// 1. Research Source Entry
export interface ResearchSource {
  id: string;
  title: string;
  url: string;
  dateResearched: string; // YYYY-MM-DD
  lastVerifiedDate: string; // YYYY-MM-DD
  sourceType: 'Official Admissions' | 'Common Data Set' | 'Financial Aid Office' | 'Student Forum' | 'Faculty Page' | 'Other';
  notes: string;
}

// 2. Admission Statistic Entry with Verification
export interface AdmissionStatEntry {
  id: string;
  metricLabel: string;
  metricValue: string;
  sourceTitle: string;
  sourceUrl: string;
  verificationDate: string;
  notes?: string;
}

// 3. College / University Profile
export interface UniversityProfile {
  id: string;
  name: string;
  category: CollegeCategory;
  isFavorite?: boolean;
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;

  // Tab 1: Overview
  country: string;
  state: string;
  city: string;
  officialWebsite: string;
  universityType: 'Private Nonprofit' | 'Public State' | 'Liberal Arts College' | 'Specialized / Tech' | 'Other';
  campusInformation: string;
  campusSetting?: string;
  admissionRate?: string;
  satMiddle50?: string;
  actMiddle50?: string;
  tuitionAndFees?: string;
  researchProgress?: number;
  admissionRequirementsSummary?: string;
  commonAppMember?: boolean;
  applicationDeadlines?: Record<string, string>;
  researchSources?: any[];
  verifiedStats?: any[];
  applicationFee?: string;
  totalCostOfAttendance?: string;
  financialAidPolicy?: string;
  applicationStrategy?: string;
  notes?: string;
  aboutStanford?: string;
  whyStanford?: string[];
  undergraduatePrograms: string;
  intendedMajor: string;
  personalInterestNotes: string;
  whyISelectedThisUniversity: string;

  // Tab 2: Admission Requirements
  satPolicy: 'Required' | 'Test-Optional' | 'Test-Blind / Test-Free' | 'Recommended' | 'Flexible';
  satNotes?: string;
  actPolicy: 'Required' | 'Test-Optional' | 'Test-Blind' | 'Recommended' | 'Flexible';
  gpaExpectations: string;
  curriculumRequirements: string;
  englishProficiencyRequirements: string;
  ieltsMinScore: string;
  toeflMinScore: string;
  duolingoMinScore: string;
  applicationPlatform: string; // e.g. "Common App, Coalition"
  commonAppAvailable: boolean;
  supplementalRequirements: string;
  recommendationRequirements: string;
  transcriptRequirements: string;
  additionalDocuments: string;
  internationalStudentRequirements: string;

  // Tab 3: Admission Statistics
  acceptanceRate?: string;
  overallApplicantCount?: string;
  internationalApplicantStats?: string;
  sat25thPercentile?: string;
  sat75thPercentile?: string;
  act25thPercentile?: string;
  act75thPercentile?: string;
  academicProfileInfo?: string;
  internationalEnrollmentPct?: string;
  undergraduateEnrollment?: string;
  statsSources: AdmissionStatEntry[];

  // Tab 4: Financial Aid & Scholarships
  internationalAidAvailable: boolean;
  needBasedAidInternational: 'Need-Blind' | 'Need-Aware' | 'None' | 'Limited / Competitive';
  meritScholarshipsAvailable: boolean;
  fullRideOpportunities: string;
  tuitionFeesUSD: string;
  housingExpensesUSD: string;
  totalEstimatedCostUSD: string;
  applicationFeeUSD: string;
  feeWaiverAvailable: boolean;
  feeWaiverDetails?: string;
  cssProfileRequired: boolean;
  cssProfileDeadline?: string;
  financialDocumentationRequired: string;
  scholarshipDeadlines: string;
  personalAidNotes: string;

  // Tab 5: Culture & Preferences (Open Research Notebook)
  valuedStudentTraits: string;
  academicCulture: string;
  researchOpportunities: string;
  entrepreneurshipCulture: string;
  leadershipOpportunities: string;
  communityInvolvement: string;
  intellectualCuriosity: string;
  innovationCulture: string;
  campusEnvironment: string;
  uniqueCharacteristics: string;
  personalObservations: string;

  // Tab 6: Application Strategy
  edAvailable: boolean;
  eaAvailable: boolean;
  reaAvailable: boolean;
  rdAvailable: boolean;
  internationalRestrictions?: string;
  edDeadline?: string;
  eaDeadline?: string;
  rdDeadline?: string;
  financialAidDeadline?: string;
  intendedRound: ApplicationRound;
  personalStrategyReasons: string;
  decisionNotes: string;

  // Tab 7: Personal Notes
  personalNotesMarkdown: string;

  // Tab 8: Research Sources
  sources: ResearchSource[];
}

// 4. Essays & Writing Studio Types
export type EssayWritingStatus = 
  | 'Brainstorming'
  | 'Outline'
  | 'First Draft'
  | 'Second Draft'
  | 'Improved Draft'
  | 'Final Draft'
  | 'Draft in Progress';

export interface EssayDraftVersion {
  id: string;
  versionNumber: number;
  draftStage?: EssayWritingStatus;
  title: string;
  content: string; // rich text or markdown
  wordCount: number;
  characterCount: number;
  createdAt: string;
  notes?: string;
}

export interface MainEssay {
  id: string;
  title: string;
  promptChoice: string; // e.g. "Common App Prompt #1"
  customPromptText?: string;
  currentDraftStage: EssayWritingStatus;
  currentContent: string;
  wordCount: number;
  characterCount: number;
  createdAt: string;
  lastEditedDate: string;
  personalNotes: string;
  drafts: EssayDraftVersion[];
}

export interface StoryBankEntry {
  id: string;
  storyTitle: string;
  experience: string;
  personalSignificance: string;
  challenge: string;
  learning: string;
  personalGrowth: string;
  possibleEssayConnection: string;
  relatedEca?: string;
  relatedProject?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplementalQuestion {
  id: string;
  universityId: string;
  applicationCycle: string; // e.g. "Fall 2028" or "Fall 2027"
  isPastQuestion: boolean;
  pastYear?: string;
  questionText: string;
  wordLimit: number;
  sourceUrl?: string;
  notes?: string;
  
  // Writing workspace
  brainstormingNotes: string;
  mainIdea: string;
  outline: string;
  currentAnswer: string;
  currentDraftStage: EssayWritingStatus;
  drafts: EssayDraftVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface UniversitySupplementalNotebook {
  universityId: string;
  researchNotes: string;
  generalStrategy: string;
  questions: SupplementalQuestion[];
}

// 5. Academics Types
export interface SatScoreRecord {
  id: string;
  testType: 'Official SAT' | 'Practice Test' | 'Bluebook Practice';
  testDate: string; // YYYY-MM-DD
  readingWritingScore: number;
  mathScore: number;
  totalScore: number;
  scoreReportUrl?: string;
  scoreReportFileName?: string;
  preparationNotes: string;
  weakAreas: string;
  improvementObservations: string;
  createdAt: string;
}

export interface SatAcademicArchive {
  targetTotalScore: number;
  targetRwScore: number;
  targetMathScore: number;
  records: SatScoreRecord[];
  generalNotes: string;
}

export interface HscSubjectMark {
  id: string;
  subjectName: string;
  firstPaperMarks?: string;
  secondPaperMarks?: string;
  practicalMarks?: string;
  totalMarks?: string;
  grade?: string;
  gpaPoint?: string;
}

export interface HscAcademicArchive {
  sscSchoolName: string;
  sscBoard: string;
  sscPassingYear: string;
  sscGpa: string;
  sscGroup: string;
  hscCollegeName: string;
  hscBoard: string;
  hscPassingYear: string;
  hscExamDate?: string;
  hscResultDate?: string;
  hscTargetGpa: string;
  hscSubjectMarks: HscSubjectMark[];
  transcriptDocumentUrls: { id: string; name: string; url: string; uploadDate: string }[];
  academicAchievements: string;
  generalNotes: string;
}

// Dedicated Secondary School Certificate (SSC) Archive
export interface SscSubjectMark {
  id: string;
  subjectCode: string;
  subjectName: string;
  theoryMarks?: string;
  practicalMarks?: string;
  mcqMarks?: string;
  totalMarks?: string;
  grade: string; // e.g. "A+", "A", "A-"
  gradePoint: string; // e.g. "5.00", "4.00"
}

export interface SscAcademicArchive {
  schoolName: string;
  board: string; // e.g. "Dhaka"
  rollNumber: string;
  registrationNumber: string;
  session: string;
  group: string; // "Science"
  passingYear: string; // e.g. "2024" (editable)
  examStartDate: string; // e.g. "2024-02-15" (editable)
  examEndDate: string; // e.g. "2024-03-12" (editable)
  resultPublishDate: string; // e.g. "2024-05-12" (editable)
  gpa: string; // "5.00"
  goldenAplus: boolean;
  totalSubjects: number;
  subjectMarks: SscSubjectMark[];
  certificateDocumentUrl?: string;
  academicAchievements: string;
  generalNotes: string;
}

export interface EnglishTestRecord {
  id: string;
  testType: 'IELTS Academic' | 'TOEFL iBT' | 'Duolingo English Test' | 'Other';
  testDate: string;
  overallScore: string;
  readingScore: string;
  writingScore: string;
  listeningScore: string;
  speakingScore: string;
  targetScore: string;
  scoreReportUrl?: string;
  scoreReportFileName?: string;
  notes: string;
  createdAt: string;
}

export interface BangladeshAdmissionNotebookEntry {
  id: string;
  targetInstitution: string; // e.g. "BUET", "Dhaka University (Ka Unit)", "Medical", "IBA DU"
  preparationNotes: string;
  importantDates: string;
  examExperience: string;
  resultsOrExpectations: string;
  reflections: string;
  updatedAt: string;
}

// 6. Letters of Recommendation (LORs)
export interface LorNotebookDraft {
  id: string;
  versionNumber: number;
  title: string;
  draftStatus: 'Brainstorming' | 'Draft in Progress' | 'Ready for Teacher Review' | 'Final Approved';
  content: string; // rich text
  createdAt: string;
  notes?: string;
}

export interface RecommendationNotebook {
  id: string;
  teacherName: string;
  subject: string;
  position: string;
  institution: string;
  relationshipDuration: string; // e.g. "2 years (11th & 12th grade)"
  classesTaught: string;
  academicStrengths: string;
  personalObservations: string;
  relevantExperiences: string;
  projectsAndAchievements: string;
  leadershipExamples: string;
  specificAnecdotes: string;
  contextNotes: string;
  attachedDocuments: { id: string; name: string; url: string }[];
  currentDraft: string;
  drafts: LorNotebookDraft[];
  createdAt: string;
  updatedAt: string;
}

// 7. Statement of Purpose (SOP)
export interface SopDraftVersion {
  id: string;
  versionNumber: number;
  title: string;
  content: string;
  createdAt: string;
  notes?: string;
}

export interface SopDocument {
  id: string;
  title: string;
  targetUniversityOrProgram: string;
  purpose: string;
  academicBackground: string;
  personalMotivation: string;
  academicInterests: string;
  futureGoals: string;
  relevantExperiences: string;
  researchInterests: string;
  currentDraft: string;
  drafts: SopDraftVersion[];
  finalVersionNotes: string;
  personalNotes: string;
  createdAt: string;
  updatedAt: string;
}

// 8. ECAs & Achievements
export type EcaCategory = 
  | 'Academic Competitions'
  | 'Olympiads'
  | 'Research'
  | 'Volunteering'
  | 'Leadership'
  | 'Entrepreneurship'
  | 'Sports'
  | 'Arts & Creative'
  | 'Community Service'
  | 'Internships'
  | 'Independent Learning'
  | 'Other Activities';

export interface EcaActivityEntry {
  id: string;
  activityName: string;
  organization: string;
  category: EcaCategory;
  positionOrRole: string;
  startDate: string;
  endDate: string;
  isOngoing: boolean;
  hoursPerWeek: number;
  weeksPerYear: number;
  yearsInvolved: string[]; // e.g. ["9", "10", "11", "12"]
  responsibilities: string;
  achievements: string;
  leadershipDetails: string;
  communityImpact: string;
  personalGrowth: string;
  skillsDeveloped: string;
  measurableOutcomes: string;
  evidenceLinks: { id: string; title: string; url: string }[];
  personalReflections: string;
  unrestrictedNotes: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// 9. Passion Projects
export interface PassionProjectIdea {
  id: string;
  projectTitle: string;
  problemBeingAddressed: string;
  ideaDescription: string;
  whyIPursueIt: string;
  targetAudience: string;
  possibleImpact: string;
  requiredResources: string;
  skillsRequired: string;
  researchNotes: string;
  challengesAnticipated: string;
  expectedOutcomes: string;
  personalNotes: string;
  isPromotedToActive: boolean;
  promotedProjectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
  targetDate?: string;
  notes?: string;
}

export interface ProjectDevLogEntry {
  id: string;
  date: string;
  title: string;
  summary: string;
  challengesFaced?: string;
  nextSteps?: string;
}

export interface ActivePassionProject {
  id: string;
  fromIdeaId?: string;
  projectTitle: string;
  status: 'In Planning' | 'Active Development' | 'Testing / Pilot' | 'Completed' | 'Paused';
  overview: string;
  research: string;
  planning: string;
  objectives: string;
  milestones: ProjectMilestone[];
  tasks: string[];
  devLog: ProjectDevLogEntry[];
  weeklyProgressNotes: string;
  challengesAndSolutions: string;
  results: string;
  impact: string;
  evidenceAndDocLinks: { id: string; title: string; url: string }[];
  finalReflection: string;
  createdAt: string;
  updatedAt: string;
}

// 10. Application Strategy
export interface UniversityStrategyDecision {
  universityId: string;
  universityName: string;
  availableRounds: ApplicationRound[];
  preferredRound: ApplicationRound;
  intendedRound: ApplicationRound;
  deadlineDate: string;
  reasons: string;
  financialAidConsiderations: string;
  decisionStatus: DecisionStatus;
  relatedNotes: string;
}

export interface StrategyEducationalGuide {
  id: string;
  roundType: 'ED' | 'EA' | 'REA' | 'RD';
  title: string;
  whatItMeans: string;
  bindingOrNonBinding: 'Binding (Must Attend if Accepted)' | 'Non-Binding (Can Choose Later)' | 'Single-Choice Restrictive (Non-Binding)';
  restrictionsAndRules: string;
  typicalTimeline: string;
  financialAidConsiderations: string;
  internationalApplicantConsiderations: string;
  importantExceptions: string;
  howToEvaluate: string;
}

// 11. Research Vault
export type VaultCategory = 
  | 'University Research'
  | 'Admission Requirements'
  | 'Financial Aid'
  | 'Scholarships'
  | 'International Students'
  | 'Essays'
  | 'SAT'
  | 'IELTS / TOEFL'
  | 'ECAs'
  | 'Passion Projects'
  | 'Application Strategy'
  | 'Visa Information';

export interface ResearchVaultItem {
  id: string;
  title: string;
  description: string;
  category: VaultCategory;
  sourceUrl: string;
  dateAdded: string;
  lastVerifiedDate: string;
  tags: string[];
  relatedUniversityId?: string;
  relatedEssayId?: string;
  attachmentName?: string;
  attachmentUrl?: string;
  personalNotes: string;
}

// 12. Workspace Customization Settings
export interface UsaAppSettings {
  applicationCycle: string; // e.g. "FALL 2028"
  motivationalHeadline: string;
  motivationalSubtitle: string;
  widgetOrder: string[];
  visibleWidgets: Record<string, boolean>;
  customTags: string[];
}

// 13. Admissions Intelligence Types (Fall 2028 Cycle)
export type AdmissionsInstructorMode = 
  | 'teach-me'          // Teach foundational principles & explain how holistic admissions work
  | 'research-for-me'   // Live grounding research on university policies, financial aid, requirements
  | 'review-my-work'    // Critical review of essays, ECAs, LOR plans, profile strengths/gaps
  | 'plan-with-me'      // Strategic timelines, university list balance, application rounds (ED/EA/RD)
  | 'explain-detail';   // Deep-dive analysis with context on Bangladesh SSC/HSC, ISFAA, F-1 visa

export interface AdmissionsCitation {
  id: string;
  title: string;
  uri: string;
  snippet?: string;
  sourceType?: 'Official Admissions' | 'Common Data Set' | 'Financial Aid Office' | 'Google Search' | 'Other';
  verificationStatus?: 'verified' | 'provisional' | 'historical';
}

export interface AdmissionsMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  mode?: AdmissionsInstructorMode;
  citations?: AdmissionsCitation[];
  searchQueries?: string[];
  isSearching?: boolean;
  error?: string;
}

export interface AdmissionsContextPackage {
  selectedUniversityId?: string;
  selectedUniversityName?: string;
  activeEssayId?: string;
  activeEssayTitle?: string;
  activeEssayPrompt?: string;
  activeEssaySnippet?: string;
  activeEcaId?: string;
  activeEcaName?: string;
  studentProfileSummary?: string;
  currentSection?: UsaSubSection;
  customNotes?: string;
}

export interface AdmissionsConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  mode: AdmissionsInstructorMode;
  messages: AdmissionsMessage[];
  contextSnapshot?: AdmissionsContextPackage;
}
