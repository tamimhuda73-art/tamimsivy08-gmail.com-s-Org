import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  UsaSubSection,
  CollegeCategory,
  UniversityProfile,
  MainEssay,
  EssayDraftVersion,
  StoryBankEntry,
  SupplementalQuestion,
  UniversitySupplementalNotebook,
  SatAcademicArchive,
  SatScoreRecord,
  HscAcademicArchive,
  SscAcademicArchive,
  SscSubjectMark,
  EnglishTestRecord,
  BangladeshAdmissionNotebookEntry,
  RecommendationNotebook,
  LorNotebookDraft,
  SopDocument,
  SopDraftVersion,
  EcaActivityEntry,
  PassionProjectIdea,
  ActivePassionProject,
  ProjectMilestone,
  ProjectDevLogEntry,
  UniversityStrategyDecision,
  ResearchVaultItem,
  UsaAppSettings
} from '../types/usaApp';
import { 
  INITIAL_USA_SETTINGS,
  INITIAL_SAT_ARCHIVE,
  INITIAL_HSC_ARCHIVE,
  INITIAL_SSC_ARCHIVE,
  INITIAL_ENGLISH_TEST_RECORDS,
  INITIAL_BANGLADESH_ADMISSION_ENTRIES,
  INITIAL_UNIVERSITIES,
  INITIAL_MAIN_ESSAYS,
  INITIAL_STORY_BANK,
  INITIAL_LORS,
  INITIAL_SOPS,
  INITIAL_ECAS,
  INITIAL_ACTIVE_PROJECTS,
  INITIAL_PROJECT_IDEAS,
  INITIAL_RESEARCH_VAULT_ITEMS
} from '../data/initialUsaData';

interface UsaAppContextType {
  activeSubSection: UsaSubSection;
  setActiveSubSection: (section: UsaSubSection) => void;
  selectedUniversityId: string | null;
  setSelectedUniversityId: (id: string | null) => void;
  selectedCollegeTab: CollegeCategory;
  setSelectedCollegeTab: (tab: CollegeCategory) => void;
  settings: UsaAppSettings;
  updateSettings: (updates: Partial<UsaAppSettings>) => void;

  // 1. Universities (College List)
  universities: UniversityProfile[];
  addUniversity: (univ: any) => string;
  updateUniversity: (id: string, updates: Partial<UniversityProfile>) => void;
  deleteUniversity: (id: string) => void;
  archiveUniversity: (id: string) => void;
  toggleFavoriteUniversity: (id: string) => void;
  moveUniversityCategory: (id: string, newCategory: CollegeCategory) => void;
  getUniversityById: (id: string) => UniversityProfile | undefined;

  // 2. Essays & Writing Studio
  mainEssays: MainEssay[];
  activeMainEssayId: string | null;
  setActiveMainEssayId: (id: string | null) => void;
  createMainEssay: (title: string, promptChoice: string, customPrompt?: string) => string;
  updateMainEssay: (id: string, updates: Partial<MainEssay>) => void;
  deleteMainEssay: (id: string) => void;
  saveNewMainEssayDraft: (essayId: string, notes?: string) => void;
  restoreMainEssayDraft: (essayId: string, versionNumber: number) => void;

  storyBank: StoryBankEntry[];
  addStoryBankEntry: (entry: Omit<StoryBankEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStoryBankEntry: (id: string, updates: Partial<StoryBankEntry>) => void;
  deleteStoryBankEntry: (id: string) => void;

  supplementalNotebooks: Record<string, UniversitySupplementalNotebook>;
  getSupplementalNotebook: (universityId: string) => UniversitySupplementalNotebook;
  updateSupplementalNotes: (universityId: string, updates: { researchNotes?: string; generalStrategy?: string }) => void;
  addSupplementalQuestion: (universityId: string, question: Omit<SupplementalQuestion, 'id' | 'universityId' | 'drafts' | 'createdAt' | 'updatedAt'>) => void;
  updateSupplementalQuestion: (universityId: string, questionId: string, updates: Partial<SupplementalQuestion>) => void;
  deleteSupplementalQuestion: (universityId: string, questionId: string) => void;
  saveSupplementalQuestionDraft: (universityId: string, questionId: string, notes?: string) => void;
  restoreSupplementalQuestionDraft: (universityId: string, questionId: string, versionNumber: number) => void;

  // 3. Academics
  satArchive: SatAcademicArchive;
  updateSatArchive: (updates: Partial<SatAcademicArchive>) => void;
  addSatScoreRecord: (record: Omit<SatScoreRecord, 'id' | 'createdAt'>) => void;
  deleteSatScoreRecord: (id: string) => void;

  hscArchive: HscAcademicArchive;
  updateHscArchive: (updates: Partial<HscAcademicArchive>) => void;

  sscArchive: SscAcademicArchive;
  updateSscArchive: (updates: Partial<SscAcademicArchive>) => void;
  updateSscSubject: (subjectId: string, updates: Partial<SscSubjectMark>) => void;
  addSscSubject: (subject: Omit<SscSubjectMark, 'id'>) => void;
  deleteSscSubject: (subjectId: string) => void;

  targetDate: string;
  updateTargetDate: (newDate: string) => void;

  englishTestRecords: EnglishTestRecord[];
  addEnglishTestRecord: (rec: Omit<EnglishTestRecord, 'id' | 'createdAt'>) => void;
  updateEnglishTestRecord: (id: string, updates: Partial<EnglishTestRecord>) => void;
  deleteEnglishTestRecord: (id: string) => void;

  bangladeshAdmissionEntries: BangladeshAdmissionNotebookEntry[];
  addBangladeshAdmissionEntry: (entry: Omit<BangladeshAdmissionNotebookEntry, 'id' | 'updatedAt'>) => void;
  updateBangladeshAdmissionEntry: (id: string, updates: Partial<BangladeshAdmissionNotebookEntry>) => void;
  deleteBangladeshAdmissionEntry: (id: string) => void;

  // 4. LORs
  recommendationNotebooks: RecommendationNotebook[];
  addRecommendationNotebook: (rec: Omit<RecommendationNotebook, 'id' | 'drafts' | 'createdAt' | 'updatedAt'>) => string;
  updateRecommendationNotebook: (id: string, updates: Partial<RecommendationNotebook>) => void;
  deleteRecommendationNotebook: (id: string) => void;
  saveRecommendationDraft: (notebookId: string, notes?: string) => void;
  restoreRecommendationDraft: (notebookId: string, versionNumber: number) => void;

  // 5. SOP
  sopDocuments: SopDocument[];
  addSopDocument: (sop: Omit<SopDocument, 'id' | 'drafts' | 'createdAt' | 'updatedAt'>) => string;
  updateSopDocument: (id: string, updates: Partial<SopDocument>) => void;
  deleteSopDocument: (id: string) => void;
  saveSopDraft: (docId: string, notes?: string) => void;
  restoreSopDraft: (docId: string, versionNumber: number) => void;

  // 6. ECAs & Achievements
  ecaActivities: EcaActivityEntry[];
  addEcaActivity: (act: Omit<EcaActivityEntry, 'id' | 'order' | 'createdAt' | 'updatedAt'>) => void;
  updateEcaActivity: (id: string, updates: Partial<EcaActivityEntry>) => void;
  deleteEcaActivity: (id: string) => void;
  reorderEcaActivities: (dragIndex: number, hoverIndex: number) => void;

  // 7. Passion Projects
  passionProjectIdeas: PassionProjectIdea[];
  addPassionProjectIdea: (idea: Omit<PassionProjectIdea, 'id' | 'isPromotedToActive' | 'createdAt' | 'updatedAt'>) => string;
  updatePassionProjectIdea: (id: string, updates: Partial<PassionProjectIdea>) => void;
  deletePassionProjectIdea: (id: string) => void;
  promoteIdeaToActiveProject: (ideaId: string) => string;

  activePassionProjects: ActivePassionProject[];
  addActivePassionProject: (proj: Omit<ActivePassionProject, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateActivePassionProject: (id: string, updates: Partial<ActivePassionProject>) => void;
  deleteActivePassionProject: (id: string) => void;
  addProjectMilestone: (projectId: string, milestone: Omit<ProjectMilestone, 'id'>) => void;
  toggleProjectMilestone: (projectId: string, milestoneId: string) => void;
  deleteProjectMilestone: (projectId: string, milestoneId: string) => void;
  addProjectDevLog: (projectId: string, log: Omit<ProjectDevLogEntry, 'id'>) => void;

  // 8. Application Strategy
  strategyDecisions: UniversityStrategyDecision[];
  updateStrategyDecision: (universityId: string, updates: Partial<UniversityStrategyDecision>) => void;

  // 9. Research Vault
  researchVaultItems: ResearchVaultItem[];
  addResearchVaultItem: (item: Omit<ResearchVaultItem, 'id' | 'dateAdded'>) => void;
  updateResearchVaultItem: (id: string, updates: Partial<ResearchVaultItem>) => void;
  deleteResearchVaultItem: (id: string) => void;

  // Search & Global state
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  isAutosaved: boolean;
  lastSavedText: string;
  exportUsaDataJSON: () => void;
  importUsaDataJSON: (jsonStr: string) => boolean;
  setActiveTab: (tab: string) => void;
}

const STORAGE_KEY_USA = 'comeback_usa_application_v1';

const UsaAppContext = createContext<UsaAppContextType | undefined>(undefined);

export const UsaAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSubSection, setActiveSubSection] = useState<UsaSubSection>('dashboard');
  const [selectedUniversityId, setSelectedUniversityId] = useState<string | null>(null);
  const [selectedCollegeTab, setSelectedCollegeTab] = useState<CollegeCategory>('reach');
  const [settings, setSettings] = useState<UsaAppSettings>(INITIAL_USA_SETTINGS);

  const [targetDate, setTargetDate] = useState<string>('Nov 1, 2027');
  const [universities, setUniversities] = useState<UniversityProfile[]>(INITIAL_UNIVERSITIES);
  const [mainEssays, setMainEssays] = useState<MainEssay[]>(INITIAL_MAIN_ESSAYS);
  const [activeMainEssayId, setActiveMainEssayId] = useState<string | null>('essay-main-1');
  const [storyBank, setStoryBank] = useState<StoryBankEntry[]>(INITIAL_STORY_BANK);
  const [supplementalNotebooks, setSupplementalNotebooks] = useState<Record<string, UniversitySupplementalNotebook>>({});

  const [satArchive, setSatArchive] = useState<SatAcademicArchive>(INITIAL_SAT_ARCHIVE);
  const [hscArchive, setHscArchive] = useState<HscAcademicArchive>(INITIAL_HSC_ARCHIVE);
  const [sscArchive, setSscArchive] = useState<SscAcademicArchive>(INITIAL_SSC_ARCHIVE);
  const [englishTestRecords, setEnglishTestRecords] = useState<EnglishTestRecord[]>(INITIAL_ENGLISH_TEST_RECORDS);
  const [bangladeshAdmissionEntries, setBangladeshAdmissionEntries] = useState<BangladeshAdmissionNotebookEntry[]>(INITIAL_BANGLADESH_ADMISSION_ENTRIES);

  const [recommendationNotebooks, setRecommendationNotebooks] = useState<RecommendationNotebook[]>(INITIAL_LORS);
  const [sopDocuments, setSopDocuments] = useState<SopDocument[]>(INITIAL_SOPS);
  const [ecaActivities, setEcaActivities] = useState<EcaActivityEntry[]>(INITIAL_ECAS);
  const [passionProjectIdeas, setPassionProjectIdeas] = useState<PassionProjectIdea[]>(INITIAL_PROJECT_IDEAS);
  const [activePassionProjects, setActivePassionProjects] = useState<ActivePassionProject[]>(INITIAL_ACTIVE_PROJECTS);
  const [strategyDecisions, setStrategyDecisions] = useState<UniversityStrategyDecision[]>([]);
  const [researchVaultItems, setResearchVaultItems] = useState<ResearchVaultItem[]>(INITIAL_RESEARCH_VAULT_ITEMS);

  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isAutosaved, setIsAutosaved] = useState(true);
  const [lastSavedText, setLastSavedText] = useState('Just now');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.targetDate) setTargetDate(parsed.targetDate);
        if (parsed.universities && parsed.universities.length > 0) setUniversities(parsed.universities);
        if (parsed.mainEssays && parsed.mainEssays.length > 0) setMainEssays(parsed.mainEssays);
        if (parsed.storyBank && parsed.storyBank.length > 0) setStoryBank(parsed.storyBank);
        if (parsed.supplementalNotebooks && Object.keys(parsed.supplementalNotebooks).length > 0) setSupplementalNotebooks(parsed.supplementalNotebooks);
        if (parsed.satArchive) setSatArchive(parsed.satArchive);
        if (parsed.hscArchive) setHscArchive(parsed.hscArchive);
        if (parsed.sscArchive) setSscArchive(parsed.sscArchive);
        if (parsed.englishTestRecords && parsed.englishTestRecords.length > 0) setEnglishTestRecords(parsed.englishTestRecords);
        if (parsed.bangladeshAdmissionEntries && parsed.bangladeshAdmissionEntries.length > 0) setBangladeshAdmissionEntries(parsed.bangladeshAdmissionEntries);
        if (parsed.recommendationNotebooks && parsed.recommendationNotebooks.length > 0) setRecommendationNotebooks(parsed.recommendationNotebooks);
        if (parsed.sopDocuments && parsed.sopDocuments.length > 0) setSopDocuments(parsed.sopDocuments);
        if (parsed.ecaActivities && parsed.ecaActivities.length > 0) setEcaActivities(parsed.ecaActivities);
        if (parsed.passionProjectIdeas && parsed.passionProjectIdeas.length > 0) setPassionProjectIdeas(parsed.passionProjectIdeas);
        if (parsed.activePassionProjects && parsed.activePassionProjects.length > 0) setActivePassionProjects(parsed.activePassionProjects);
        if (parsed.strategyDecisions && parsed.strategyDecisions.length > 0) setStrategyDecisions(parsed.strategyDecisions);
        if (parsed.researchVaultItems && parsed.researchVaultItems.length > 0) setResearchVaultItems(parsed.researchVaultItems);
      }
    } catch (e) {
      console.warn('Failed to load USA Application data:', e);
    }
  }, []);

  // Save to localStorage with debounce
  useEffect(() => {
    const data = {
      settings,
      targetDate,
      universities,
      mainEssays,
      storyBank,
      supplementalNotebooks,
      satArchive,
      hscArchive,
      sscArchive,
      englishTestRecords,
      bangladeshAdmissionEntries,
      recommendationNotebooks,
      sopDocuments,
      ecaActivities,
      passionProjectIdeas,
      activePassionProjects,
      strategyDecisions,
      researchVaultItems
    };
    localStorage.setItem(STORAGE_KEY_USA, JSON.stringify(data));
    setIsAutosaved(false);

    const timer = setTimeout(() => {
      setIsAutosaved(true);
      const now = new Date();
      setLastSavedText(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 400);

    return () => clearTimeout(timer);
  }, [
    settings,
    targetDate,
    universities,
    mainEssays,
    storyBank,
    supplementalNotebooks,
    satArchive,
    hscArchive,
    sscArchive,
    englishTestRecords,
    bangladeshAdmissionEntries,
    recommendationNotebooks,
    sopDocuments,
    ecaActivities,
    passionProjectIdeas,
    activePassionProjects,
    strategyDecisions,
    researchVaultItems
  ]);

  const updateSettings = useCallback((updates: Partial<UsaAppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // 1. UNIVERSITY ACTIONS
  const addUniversity = useCallback((univ: any): string => {
    const newId = `univ-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newProfile: UniversityProfile = {
      campusInformation: '',
      undergraduatePrograms: 'Computer Science, Engineering',
      intendedMajor: 'Computer Science',
      personalInterestNotes: '',
      whyISelectedThisUniversity: '',
      satPolicy: 'Test-Optional',
      actPolicy: 'Test-Optional',
      gpaExpectations: '3.8+',
      curriculumRequirements: 'HSC / High School Diploma',
      englishProficiencyRequirements: 'IELTS 7.5+ or TOEFL 100+',
      ieltsMinScore: '7.5',
      toeflMinScore: '100',
      duolingoMinScore: '130',
      applicationPlatform: 'Common App',
      commonAppAvailable: true,
      supplementalRequirements: '',
      recommendationRequirements: '2 Teacher LORs + 1 Counselor',
      transcriptRequirements: 'Official 9-12 transcripts + HSC/SSC',
      additionalDocuments: '',
      internationalStudentRequirements: 'Bank Statement + Passport Copy',
      statsSources: [],
      internationalAidAvailable: true,
      needBasedAidInternational: 'Need-Aware',
      meritScholarshipsAvailable: true,
      fullRideOpportunities: '',
      tuitionFeesUSD: '$55,000',
      housingExpensesUSD: '$18,000',
      totalEstimatedCostUSD: '$78,000',
      applicationFeeUSD: '$80',
      feeWaiverAvailable: true,
      cssProfileRequired: true,
      financialDocumentationRequired: 'CSS Profile + ISFAA',
      scholarshipDeadlines: 'Nov 1, 2027',
      personalAidNotes: '',
      valuedStudentTraits: 'Intellectual vitality, leadership, impact',
      academicCulture: 'Collaborative, research-intensive',
      researchOpportunities: 'Undergraduate Research Opportunities Program (UROP)',
      entrepreneurshipCulture: 'Incubators, startup grants',
      leadershipOpportunities: 'Student clubs, community service',
      communityInvolvement: 'Active campus organizations',
      intellectualCuriosity: 'Cross-disciplinary exploration',
      innovationCulture: 'Makerspaces, hackathons',
      campusEnvironment: 'Vibrant collegiate community',
      uniqueCharacteristics: '',
      personalObservations: '',
      edAvailable: true,
      eaAvailable: false,
      reaAvailable: false,
      rdAvailable: true,
      intendedRound: 'RD',
      personalStrategyReasons: '',
      decisionNotes: '',
      ...univ,
      id: newId,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    setUniversities(prev => [newProfile, ...prev]);

    // Also initialize a Strategy Decision entry for this university
    setStrategyDecisions(prev => {
      if (prev.some(d => d.universityId === newId)) return prev;
      return [
        ...prev,
        {
          universityId: newId,
          universityName: newProfile.name,
          availableRounds: ['RD'],
          preferredRound: 'RD',
          intendedRound: 'RD',
          deadlineDate: newProfile.rdDeadline || '',
          reasons: '',
          financialAidConsiderations: newProfile.needBasedAidInternational || '',
          decisionStatus: 'Considering',
          relatedNotes: ''
        }
      ];
    });

    return newId;
  }, []);

  const updateUniversity = useCallback((id: string, updates: Partial<UniversityProfile>) => {
    const timestamp = new Date().toISOString();
    setUniversities(prev => prev.map(u => {
      if (u.id !== id) return u;
      return { ...u, ...updates, updatedAt: timestamp };
    }));
  }, []);

  const deleteUniversity = useCallback((id: string) => {
    setUniversities(prev => prev.filter(u => u.id !== id));
    setStrategyDecisions(prev => prev.filter(d => d.universityId !== id));
    if (selectedUniversityId === id) setSelectedUniversityId(null);
  }, [selectedUniversityId]);

  const archiveUniversity = useCallback((id: string) => {
    setUniversities(prev => prev.map(u => u.id === id ? { ...u, isArchived: !u.isArchived } : u));
  }, []);

  const toggleFavoriteUniversity = useCallback((id: string) => {
    setUniversities(prev => prev.map(u => u.id === id ? { ...u, isFavorite: !u.isFavorite } : u));
  }, []);

  const moveUniversityCategory = useCallback((id: string, newCategory: CollegeCategory) => {
    setUniversities(prev => prev.map(u => u.id === id ? { ...u, category: newCategory, updatedAt: new Date().toISOString() } : u));
  }, []);

  const getUniversityById = useCallback((id: string) => {
    return universities.find(u => u.id === id);
  }, [universities]);

  // 2. ESSAYS & WRITING STUDIO
  const createMainEssay = useCallback((title: string, promptChoice: string, customPrompt?: string): string => {
    const newId = `essay-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newEssay: MainEssay = {
      id: newId,
      title: title.trim() || 'Untitled Main Essay',
      promptChoice,
      customPromptText: customPrompt,
      currentDraftStage: 'First Draft',
      currentContent: '',
      wordCount: 0,
      characterCount: 0,
      createdAt: timestamp,
      lastEditedDate: timestamp,
      personalNotes: '',
      drafts: []
    };
    setMainEssays(prev => [newEssay, ...prev]);
    setActiveMainEssayId(newId);
    return newId;
  }, []);

  const updateMainEssay = useCallback((id: string, updates: Partial<MainEssay>) => {
    const timestamp = new Date().toISOString();
    setMainEssays(prev => prev.map(e => {
      if (e.id !== id) return e;
      const updated = { ...e, ...updates, lastEditedDate: timestamp };
      if (updates.currentContent !== undefined) {
        const plainText = updates.currentContent.replace(/<[^>]*>/g, ' ').trim();
        updated.wordCount = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
        updated.characterCount = plainText.length;
      }
      return updated;
    }));
  }, []);

  const deleteMainEssay = useCallback((id: string) => {
    setMainEssays(prev => prev.filter(e => e.id !== id));
    if (activeMainEssayId === id) setActiveMainEssayId(null);
  }, [activeMainEssayId]);

  const saveNewMainEssayDraft = useCallback((essayId: string, notes?: string) => {
    const essay = mainEssays.find(e => e.id === essayId);
    if (!essay) return;
    const versionNumber = essay.drafts.length + 1;
    const newDraft: EssayDraftVersion = {
      id: `draft-${Date.now()}`,
      versionNumber,
      draftStage: essay.currentDraftStage,
      title: `Draft #${versionNumber} (${essay.currentDraftStage})`,
      content: essay.currentContent,
      wordCount: essay.wordCount,
      characterCount: essay.characterCount,
      createdAt: new Date().toISOString(),
      notes
    };
    setMainEssays(prev => prev.map(e => {
      if (e.id !== essayId) return e;
      return {
        ...e,
        drafts: [newDraft, ...e.drafts],
        lastEditedDate: new Date().toISOString()
      };
    }));
  }, [mainEssays]);

  const restoreMainEssayDraft = useCallback((essayId: string, versionNumber: number) => {
    setMainEssays(prev => prev.map(e => {
      if (e.id !== essayId) return e;
      const draft = e.drafts.find(d => d.versionNumber === versionNumber);
      if (!draft) return e;
      return {
        ...e,
        currentContent: draft.content,
        currentDraftStage: draft.draftStage || 'First Draft',
        wordCount: draft.wordCount,
        characterCount: draft.characterCount,
        lastEditedDate: new Date().toISOString()
      };
    }));
  }, []);

  // STORY BANK
  const addStoryBankEntry = useCallback((entry: Omit<StoryBankEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString();
    const newEntry: StoryBankEntry = {
      ...entry,
      id: `story-${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    setStoryBank(prev => [newEntry, ...prev]);
  }, []);

  const updateStoryBankEntry = useCallback((id: string, updates: Partial<StoryBankEntry>) => {
    const timestamp = new Date().toISOString();
    setStoryBank(prev => prev.map(s => s.id === id ? { ...s, ...updates, updatedAt: timestamp } : s));
  }, []);

  const deleteStoryBankEntry = useCallback((id: string) => {
    setStoryBank(prev => prev.filter(s => s.id !== id));
  }, []);

  // SUPPLEMENTAL ESSAYS BY UNIVERSITY
  const getSupplementalNotebook = useCallback((universityId: string): UniversitySupplementalNotebook => {
    if (supplementalNotebooks[universityId]) {
      return supplementalNotebooks[universityId];
    }
    return {
      universityId,
      researchNotes: '',
      generalStrategy: '',
      questions: []
    };
  }, [supplementalNotebooks]);

  const updateSupplementalNotes = useCallback((universityId: string, updates: { researchNotes?: string; generalStrategy?: string }) => {
    setSupplementalNotebooks(prev => {
      const existing = prev[universityId] || {
        universityId,
        researchNotes: '',
        generalStrategy: '',
        questions: []
      };
      return {
        ...prev,
        [universityId]: { ...existing, ...updates }
      };
    });
  }, []);

  const addSupplementalQuestion = useCallback((universityId: string, question: Omit<SupplementalQuestion, 'id' | 'universityId' | 'drafts' | 'createdAt' | 'updatedAt'>) => {
    const newId = `supp-q-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newQ: SupplementalQuestion = {
      ...question,
      id: newId,
      universityId,
      drafts: [],
      createdAt: timestamp,
      updatedAt: timestamp
    };
    setSupplementalNotebooks(prev => {
      const existing = prev[universityId] || {
        universityId,
        researchNotes: '',
        generalStrategy: '',
        questions: []
      };
      return {
        ...prev,
        [universityId]: {
          ...existing,
          questions: [...existing.questions, newQ]
        }
      };
    });
  }, []);

  const updateSupplementalQuestion = useCallback((universityId: string, questionId: string, updates: Partial<SupplementalQuestion>) => {
    const timestamp = new Date().toISOString();
    setSupplementalNotebooks(prev => {
      const existing = prev[universityId];
      if (!existing) return prev;
      return {
        ...prev,
        [universityId]: {
          ...existing,
          questions: existing.questions.map(q => q.id === questionId ? { ...q, ...updates, updatedAt: timestamp } : q)
        }
      };
    });
  }, []);

  const deleteSupplementalQuestion = useCallback((universityId: string, questionId: string) => {
    setSupplementalNotebooks(prev => {
      const existing = prev[universityId];
      if (!existing) return prev;
      return {
        ...prev,
        [universityId]: {
          ...existing,
          questions: existing.questions.filter(q => q.id !== questionId)
        }
      };
    });
  }, []);

  const saveSupplementalQuestionDraft = useCallback((universityId: string, questionId: string, notes?: string) => {
    setSupplementalNotebooks(prev => {
      const nb = prev[universityId];
      if (!nb) return prev;
      const question = nb.questions.find(q => q.id === questionId);
      if (!question) return prev;

      const versionNumber = question.drafts.length + 1;
      const plainText = question.currentAnswer.replace(/<[^>]*>/g, ' ').trim();
      const wordCount = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
      const characterCount = plainText.length;

      const newDraft: EssayDraftVersion = {
        id: `supp-draft-${Date.now()}`,
        versionNumber,
        draftStage: question.currentDraftStage,
        title: `Draft #${versionNumber} (${question.currentDraftStage})`,
        content: question.currentAnswer,
        wordCount,
        characterCount,
        createdAt: new Date().toISOString(),
        notes
      };

      return {
        ...prev,
        [universityId]: {
          ...nb,
          questions: nb.questions.map(q => q.id === questionId ? {
            ...q,
            drafts: [newDraft, ...q.drafts],
            updatedAt: new Date().toISOString()
          } : q)
        }
      };
    });
  }, []);

  const restoreSupplementalQuestionDraft = useCallback((universityId: string, questionId: string, versionNumber: number) => {
    setSupplementalNotebooks(prev => {
      const nb = prev[universityId];
      if (!nb) return prev;
      const question = nb.questions.find(q => q.id === questionId);
      if (!question) return prev;
      const draft = question.drafts.find(d => d.versionNumber === versionNumber);
      if (!draft) return prev;

      return {
        ...prev,
        [universityId]: {
          ...nb,
          questions: nb.questions.map(q => q.id === questionId ? {
            ...q,
            currentAnswer: draft.content,
            currentDraftStage: draft.draftStage || 'First Draft',
            updatedAt: new Date().toISOString()
          } : q)
        }
      };
    });
  }, []);

  // 3. ACADEMICS
  const updateSatArchive = useCallback((updates: Partial<SatAcademicArchive>) => {
    setSatArchive(prev => ({ ...prev, ...updates }));
  }, []);

  const addSatScoreRecord = useCallback((record: Omit<SatScoreRecord, 'id' | 'createdAt'>) => {
    const newRecord: SatScoreRecord = {
      ...record,
      id: `sat-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setSatArchive(prev => ({
      ...prev,
      records: [newRecord, ...prev.records]
    }));
  }, []);

  const deleteSatScoreRecord = useCallback((id: string) => {
    setSatArchive(prev => ({
      ...prev,
      records: prev.records.filter(r => r.id !== id)
    }));
  }, []);

  const updateHscArchive = useCallback((updates: Partial<HscAcademicArchive>) => {
    setHscArchive(prev => ({ ...prev, ...updates }));
  }, []);

  const updateSscArchive = useCallback((updates: Partial<SscAcademicArchive>) => {
    setSscArchive(prev => ({ ...prev, ...updates }));
  }, []);

  const updateSscSubject = useCallback((subjectId: string, updates: Partial<SscSubjectMark>) => {
    setSscArchive(prev => ({
      ...prev,
      subjectMarks: prev.subjectMarks.map(s => s.id === subjectId ? { ...s, ...updates } : s)
    }));
  }, []);

  const addSscSubject = useCallback((subject: Omit<SscSubjectMark, 'id'>) => {
    const newSubject: SscSubjectMark = {
      ...subject,
      id: `ssc-sub-${Date.now()}`
    };
    setSscArchive(prev => ({
      ...prev,
      subjectMarks: [...prev.subjectMarks, newSubject]
    }));
  }, []);

  const deleteSscSubject = useCallback((subjectId: string) => {
    setSscArchive(prev => ({
      ...prev,
      subjectMarks: prev.subjectMarks.filter(s => s.id !== subjectId)
    }));
  }, []);

  const updateTargetDate = useCallback((newDate: string) => {
    setTargetDate(newDate);
  }, []);

  const addEnglishTestRecord = useCallback((rec: Omit<EnglishTestRecord, 'id' | 'createdAt'>) => {
    const newRec: EnglishTestRecord = {
      ...rec,
      id: `eng-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setEnglishTestRecords(prev => [newRec, ...prev]);
  }, []);

  const updateEnglishTestRecord = useCallback((id: string, updates: Partial<EnglishTestRecord>) => {
    setEnglishTestRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, []);

  const deleteEnglishTestRecord = useCallback((id: string) => {
    setEnglishTestRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  const addBangladeshAdmissionEntry = useCallback((entry: Omit<BangladeshAdmissionNotebookEntry, 'id' | 'updatedAt'>) => {
    const newEntry: BangladeshAdmissionNotebookEntry = {
      ...entry,
      id: `bd-adm-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    setBangladeshAdmissionEntries(prev => [newEntry, ...prev]);
  }, []);

  const updateBangladeshAdmissionEntry = useCallback((id: string, updates: Partial<BangladeshAdmissionNotebookEntry>) => {
    setBangladeshAdmissionEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e));
  }, []);

  const deleteBangladeshAdmissionEntry = useCallback((id: string) => {
    setBangladeshAdmissionEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  // 4. LORs
  const addRecommendationNotebook = useCallback((rec: Omit<RecommendationNotebook, 'id' | 'drafts' | 'createdAt' | 'updatedAt'>): string => {
    const newId = `lor-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newNb: RecommendationNotebook = {
      ...rec,
      id: newId,
      drafts: [],
      createdAt: timestamp,
      updatedAt: timestamp
    };
    setRecommendationNotebooks(prev => [newNb, ...prev]);
    return newId;
  }, []);

  const updateRecommendationNotebook = useCallback((id: string, updates: Partial<RecommendationNotebook>) => {
    const timestamp = new Date().toISOString();
    setRecommendationNotebooks(prev => prev.map(r => r.id === id ? { ...r, ...updates, updatedAt: timestamp } : r));
  }, []);

  const deleteRecommendationNotebook = useCallback((id: string) => {
    setRecommendationNotebooks(prev => prev.filter(r => r.id !== id));
  }, []);

  const saveRecommendationDraft = useCallback((notebookId: string, notes?: string) => {
    setRecommendationNotebooks(prev => prev.map(nb => {
      if (nb.id !== notebookId) return nb;
      const versionNumber = nb.drafts.length + 1;
      const newDraft: LorNotebookDraft = {
        id: `lor-draft-${Date.now()}`,
        versionNumber,
        title: `Recommendation Draft #${versionNumber}`,
        draftStatus: 'Draft in Progress',
        content: nb.currentDraft,
        createdAt: new Date().toISOString(),
        notes
      };
      return {
        ...nb,
        drafts: [newDraft, ...nb.drafts],
        updatedAt: new Date().toISOString()
      };
    }));
  }, []);

  const restoreRecommendationDraft = useCallback((notebookId: string, versionNumber: number) => {
    setRecommendationNotebooks(prev => prev.map(nb => {
      if (nb.id !== notebookId) return nb;
      const d = nb.drafts.find(dr => dr.versionNumber === versionNumber);
      if (!d) return nb;
      return {
        ...nb,
        currentDraft: d.content,
        updatedAt: new Date().toISOString()
      };
    }));
  }, []);

  // 5. SOP
  const addSopDocument = useCallback((sop: Omit<SopDocument, 'id' | 'drafts' | 'createdAt' | 'updatedAt'>): string => {
    const newId = `sop-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newDoc: SopDocument = {
      ...sop,
      id: newId,
      drafts: [],
      createdAt: timestamp,
      updatedAt: timestamp
    };
    setSopDocuments(prev => [newDoc, ...prev]);
    return newId;
  }, []);

  const updateSopDocument = useCallback((id: string, updates: Partial<SopDocument>) => {
    const timestamp = new Date().toISOString();
    setSopDocuments(prev => prev.map(s => s.id === id ? { ...s, ...updates, updatedAt: timestamp } : s));
  }, []);

  const deleteSopDocument = useCallback((id: string) => {
    setSopDocuments(prev => prev.filter(s => s.id !== id));
  }, []);

  const saveSopDraft = useCallback((docId: string, notes?: string) => {
    setSopDocuments(prev => prev.map(doc => {
      if (doc.id !== docId) return doc;
      const versionNumber = doc.drafts.length + 1;
      const newDraft: SopDraftVersion = {
        id: `sop-draft-${Date.now()}`,
        versionNumber,
        title: `SOP Draft #${versionNumber}`,
        content: doc.currentDraft,
        createdAt: new Date().toISOString(),
        notes
      };
      return {
        ...doc,
        drafts: [newDraft, ...doc.drafts],
        updatedAt: new Date().toISOString()
      };
    }));
  }, []);

  const restoreSopDraft = useCallback((docId: string, versionNumber: number) => {
    setSopDocuments(prev => prev.map(doc => {
      if (doc.id !== docId) return doc;
      const d = doc.drafts.find(dr => dr.versionNumber === versionNumber);
      if (!d) return doc;
      return {
        ...doc,
        currentDraft: d.content,
        updatedAt: new Date().toISOString()
      };
    }));
  }, []);

  // 6. ECAs & ACHIEVEMENTS
  const addEcaActivity = useCallback((act: Omit<EcaActivityEntry, 'id' | 'order' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString();
    setEcaActivities(prev => {
      const newEntry: EcaActivityEntry = {
        ...act,
        id: `eca-${Date.now()}`,
        order: prev.length + 1,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      return [...prev, newEntry];
    });
  }, []);

  const updateEcaActivity = useCallback((id: string, updates: Partial<EcaActivityEntry>) => {
    const timestamp = new Date().toISOString();
    setEcaActivities(prev => prev.map(a => a.id === id ? { ...a, ...updates, updatedAt: timestamp } : a));
  }, []);

  const deleteEcaActivity = useCallback((id: string) => {
    setEcaActivities(prev => {
      const filtered = prev.filter(a => a.id !== id);
      return filtered.map((a, idx) => ({ ...a, order: idx + 1 }));
    });
  }, []);

  const reorderEcaActivities = useCallback((dragIndex: number, hoverIndex: number) => {
    setEcaActivities(prev => {
      const copy = [...prev];
      const [moved] = copy.splice(dragIndex, 1);
      copy.splice(hoverIndex, 0, moved);
      return copy.map((a, idx) => ({ ...a, order: idx + 1 }));
    });
  }, []);

  // 7. PASSION PROJECTS
  const addPassionProjectIdea = useCallback((idea: Omit<PassionProjectIdea, 'id' | 'isPromotedToActive' | 'createdAt' | 'updatedAt'>): string => {
    const newId = `idea-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newIdea: PassionProjectIdea = {
      ...idea,
      id: newId,
      isPromotedToActive: false,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    setPassionProjectIdeas(prev => [newIdea, ...prev]);
    return newId;
  }, []);

  const updatePassionProjectIdea = useCallback((id: string, updates: Partial<PassionProjectIdea>) => {
    const timestamp = new Date().toISOString();
    setPassionProjectIdeas(prev => prev.map(i => i.id === id ? { ...i, ...updates, updatedAt: timestamp } : i));
  }, []);

  const deletePassionProjectIdea = useCallback((id: string) => {
    setPassionProjectIdeas(prev => prev.filter(i => i.id !== id));
  }, []);

  const promoteIdeaToActiveProject = useCallback((ideaId: string): string => {
    const idea = passionProjectIdeas.find(i => i.id === ideaId);
    if (!idea) return '';
    const newProjId = `proj-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newActiveProject: ActivePassionProject = {
      id: newProjId,
      fromIdeaId: ideaId,
      projectTitle: idea.projectTitle,
      status: 'In Planning',
      overview: idea.ideaDescription,
      research: idea.researchNotes,
      planning: `Target Audience: ${idea.targetAudience}\nRequired Resources: ${idea.requiredResources}\nSkills: ${idea.skillsRequired}`,
      objectives: idea.expectedOutcomes,
      milestones: [
        { id: `ms-1`, title: 'Define project scope & preliminary research', completed: false },
        { id: `ms-2`, title: 'Build minimum viable demonstration or prototype', completed: false },
        { id: `ms-3`, title: 'Field trial / community release / outreach', completed: false }
      ],
      tasks: [],
      devLog: [
        {
          id: `log-init`,
          date: timestamp.split('T')[0],
          title: 'Project Initialized from Idea Bank',
          summary: `Promoted from idea: "${idea.projectTitle}". Motivation: ${idea.whyIPursueIt}`
        }
      ],
      weeklyProgressNotes: '',
      challengesAndSolutions: idea.challengesAnticipated,
      results: '',
      impact: idea.possibleImpact,
      evidenceAndDocLinks: [],
      finalReflection: '',
      createdAt: timestamp,
      updatedAt: timestamp
    };

    setActivePassionProjects(prev => [newActiveProject, ...prev]);
    setPassionProjectIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, isPromotedToActive: true, promotedProjectId: newProjId } : i));

    return newProjId;
  }, [passionProjectIdeas]);

  const addActivePassionProject = useCallback((proj: Omit<ActivePassionProject, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const newId = `proj-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newProj: ActivePassionProject = {
      ...proj,
      id: newId,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    setActivePassionProjects(prev => [newProj, ...prev]);
    return newId;
  }, []);

  const updateActivePassionProject = useCallback((id: string, updates: Partial<ActivePassionProject>) => {
    const timestamp = new Date().toISOString();
    setActivePassionProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: timestamp } : p));
  }, []);

  const deleteActivePassionProject = useCallback((id: string) => {
    setActivePassionProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  const addProjectMilestone = useCallback((projectId: string, milestone: Omit<ProjectMilestone, 'id'>) => {
    setActivePassionProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const newMs: ProjectMilestone = {
        ...milestone,
        id: `ms-${Date.now()}`
      };
      return {
        ...p,
        milestones: [...p.milestones, newMs],
        updatedAt: new Date().toISOString()
      };
    }));
  }, []);

  const toggleProjectMilestone = useCallback((projectId: string, milestoneId: string) => {
    setActivePassionProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        milestones: p.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m),
        updatedAt: new Date().toISOString()
      };
    }));
  }, []);

  const deleteProjectMilestone = useCallback((projectId: string, milestoneId: string) => {
    setActivePassionProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        milestones: p.milestones.filter(m => m.id !== milestoneId),
        updatedAt: new Date().toISOString()
      };
    }));
  }, []);

  const addProjectDevLog = useCallback((projectId: string, log: Omit<ProjectDevLogEntry, 'id'>) => {
    setActivePassionProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const newLog: ProjectDevLogEntry = {
        ...log,
        id: `log-${Date.now()}`
      };
      return {
        ...p,
        devLog: [newLog, ...p.devLog],
        updatedAt: new Date().toISOString()
      };
    }));
  }, []);

  // 8. APPLICATION STRATEGY
  const updateStrategyDecision = useCallback((universityId: string, updates: Partial<UniversityStrategyDecision>) => {
    setStrategyDecisions(prev => {
      const index = prev.findIndex(d => d.universityId === universityId);
      if (index === -1) {
        const univ = universities.find(u => u.id === universityId);
        const newD: UniversityStrategyDecision = {
          universityId,
          universityName: univ?.name || 'University',
          availableRounds: ['RD'],
          preferredRound: 'RD',
          intendedRound: 'RD',
          deadlineDate: univ?.rdDeadline || '',
          reasons: '',
          financialAidConsiderations: '',
          decisionStatus: 'Considering',
          relatedNotes: '',
          ...updates
        };
        return [...prev, newD];
      }
      return prev.map(d => d.universityId === universityId ? { ...d, ...updates } : d);
    });
  }, [universities]);

  // 9. RESEARCH VAULT
  const addResearchVaultItem = useCallback((item: Omit<ResearchVaultItem, 'id' | 'dateAdded'>) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const newItem: ResearchVaultItem = {
      ...item,
      id: `vault-${Date.now()}`,
      dateAdded: timestamp,
      lastVerifiedDate: item.lastVerifiedDate || timestamp
    };
    setResearchVaultItems(prev => [newItem, ...prev]);
  }, []);

  const updateResearchVaultItem = useCallback((id: string, updates: Partial<ResearchVaultItem>) => {
    setResearchVaultItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  }, []);

  const deleteResearchVaultItem = useCallback((id: string) => {
    setResearchVaultItems(prev => prev.filter(i => i.id !== id));
  }, []);

  // EXPORT / IMPORT
  const exportUsaDataJSON = useCallback(() => {
    const payload = {
      settings,
      universities,
      mainEssays,
      storyBank,
      supplementalNotebooks,
      satArchive,
      hscArchive,
      englishTestRecords,
      bangladeshAdmissionEntries,
      recommendationNotebooks,
      sopDocuments,
      ecaActivities,
      passionProjectIdeas,
      activePassionProjects,
      strategyDecisions,
      researchVaultItems,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comeback-usa-application-fall2028-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [
    settings,
    universities,
    mainEssays,
    storyBank,
    supplementalNotebooks,
    satArchive,
    hscArchive,
    englishTestRecords,
    bangladeshAdmissionEntries,
    recommendationNotebooks,
    sopDocuments,
    ecaActivities,
    passionProjectIdeas,
    activePassionProjects,
    strategyDecisions,
    researchVaultItems
  ]);

  const importUsaDataJSON = useCallback((jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.settings) setSettings(parsed.settings);
      if (Array.isArray(parsed.universities)) setUniversities(parsed.universities);
      if (Array.isArray(parsed.mainEssays)) setMainEssays(parsed.mainEssays);
      if (Array.isArray(parsed.storyBank)) setStoryBank(parsed.storyBank);
      if (parsed.supplementalNotebooks) setSupplementalNotebooks(parsed.supplementalNotebooks);
      if (parsed.satArchive) setSatArchive(parsed.satArchive);
      if (parsed.hscArchive) setHscArchive(parsed.hscArchive);
      if (Array.isArray(parsed.englishTestRecords)) setEnglishTestRecords(parsed.englishTestRecords);
      if (Array.isArray(parsed.bangladeshAdmissionEntries)) setBangladeshAdmissionEntries(parsed.bangladeshAdmissionEntries);
      if (Array.isArray(parsed.recommendationNotebooks)) setRecommendationNotebooks(parsed.recommendationNotebooks);
      if (Array.isArray(parsed.sopDocuments)) setSopDocuments(parsed.sopDocuments);
      if (Array.isArray(parsed.ecaActivities)) setEcaActivities(parsed.ecaActivities);
      if (Array.isArray(parsed.passionProjectIdeas)) setPassionProjectIdeas(parsed.passionProjectIdeas);
      if (Array.isArray(parsed.activePassionProjects)) setActivePassionProjects(parsed.activePassionProjects);
      if (Array.isArray(parsed.strategyDecisions)) setStrategyDecisions(parsed.strategyDecisions);
      if (Array.isArray(parsed.researchVaultItems)) setResearchVaultItems(parsed.researchVaultItems);
      return true;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo(() => ({
    activeSubSection,
    setActiveSubSection,
    selectedUniversityId,
    setSelectedUniversityId,
    selectedCollegeTab,
    setSelectedCollegeTab,
    settings,
    updateSettings,
    universities,
    addUniversity,
    updateUniversity,
    deleteUniversity,
    archiveUniversity,
    toggleFavoriteUniversity,
    moveUniversityCategory,
    getUniversityById,
    mainEssays,
    activeMainEssayId,
    setActiveMainEssayId,
    createMainEssay,
    updateMainEssay,
    deleteMainEssay,
    saveNewMainEssayDraft,
    restoreMainEssayDraft,
    storyBank,
    addStoryBankEntry,
    updateStoryBankEntry,
    deleteStoryBankEntry,
    supplementalNotebooks,
    getSupplementalNotebook,
    updateSupplementalNotes,
    addSupplementalQuestion,
    updateSupplementalQuestion,
    deleteSupplementalQuestion,
    saveSupplementalQuestionDraft,
    restoreSupplementalQuestionDraft,
    satArchive,
    updateSatArchive,
    addSatScoreRecord,
    deleteSatScoreRecord,
    hscArchive,
    updateHscArchive,
    sscArchive,
    updateSscArchive,
    updateSscSubject,
    addSscSubject,
    deleteSscSubject,
    targetDate,
    updateTargetDate,
    setActiveTab: (tab: string) => {
      const clean = tab.replace('usa-', '');
      setActiveSubSection(clean as any);
    },
    englishTestRecords,
    addEnglishTestRecord,
    updateEnglishTestRecord,
    deleteEnglishTestRecord,
    bangladeshAdmissionEntries,
    addBangladeshAdmissionEntry,
    updateBangladeshAdmissionEntry,
    deleteBangladeshAdmissionEntry,
    recommendationNotebooks,
    addRecommendationNotebook,
    updateRecommendationNotebook,
    deleteRecommendationNotebook,
    saveRecommendationDraft,
    restoreRecommendationDraft,
    sopDocuments,
    addSopDocument,
    updateSopDocument,
    deleteSopDocument,
    saveSopDraft,
    restoreSopDraft,
    ecaActivities,
    addEcaActivity,
    updateEcaActivity,
    deleteEcaActivity,
    reorderEcaActivities,
    passionProjectIdeas,
    addPassionProjectIdea,
    updatePassionProjectIdea,
    deletePassionProjectIdea,
    promoteIdeaToActiveProject,
    activePassionProjects,
    addActivePassionProject,
    updateActivePassionProject,
    deleteActivePassionProject,
    addProjectMilestone,
    toggleProjectMilestone,
    deleteProjectMilestone,
    addProjectDevLog,
    strategyDecisions,
    updateStrategyDecision,
    researchVaultItems,
    addResearchVaultItem,
    updateResearchVaultItem,
    deleteResearchVaultItem,
    globalSearchQuery,
    setGlobalSearchQuery,
    isAutosaved,
    lastSavedText,
    exportUsaDataJSON,
    importUsaDataJSON
  }), [
    activeSubSection,
    selectedUniversityId,
    selectedCollegeTab,
    settings,
    updateSettings,
    universities,
    addUniversity,
    updateUniversity,
    deleteUniversity,
    archiveUniversity,
    toggleFavoriteUniversity,
    moveUniversityCategory,
    getUniversityById,
    mainEssays,
    activeMainEssayId,
    createMainEssay,
    updateMainEssay,
    deleteMainEssay,
    saveNewMainEssayDraft,
    restoreMainEssayDraft,
    storyBank,
    addStoryBankEntry,
    updateStoryBankEntry,
    deleteStoryBankEntry,
    supplementalNotebooks,
    getSupplementalNotebook,
    updateSupplementalNotes,
    addSupplementalQuestion,
    updateSupplementalQuestion,
    deleteSupplementalQuestion,
    saveSupplementalQuestionDraft,
    restoreSupplementalQuestionDraft,
    satArchive,
    updateSatArchive,
    addSatScoreRecord,
    deleteSatScoreRecord,
    hscArchive,
    updateHscArchive,
    sscArchive,
    updateSscArchive,
    updateSscSubject,
    addSscSubject,
    deleteSscSubject,
    targetDate,
    updateTargetDate,
    englishTestRecords,
    addEnglishTestRecord,
    updateEnglishTestRecord,
    deleteEnglishTestRecord,
    bangladeshAdmissionEntries,
    addBangladeshAdmissionEntry,
    updateBangladeshAdmissionEntry,
    deleteBangladeshAdmissionEntry,
    recommendationNotebooks,
    addRecommendationNotebook,
    updateRecommendationNotebook,
    deleteRecommendationNotebook,
    saveRecommendationDraft,
    restoreRecommendationDraft,
    sopDocuments,
    addSopDocument,
    updateSopDocument,
    deleteSopDocument,
    saveSopDraft,
    restoreSopDraft,
    ecaActivities,
    addEcaActivity,
    updateEcaActivity,
    deleteEcaActivity,
    reorderEcaActivities,
    passionProjectIdeas,
    addPassionProjectIdea,
    updatePassionProjectIdea,
    deletePassionProjectIdea,
    promoteIdeaToActiveProject,
    activePassionProjects,
    addActivePassionProject,
    updateActivePassionProject,
    deleteActivePassionProject,
    addProjectMilestone,
    toggleProjectMilestone,
    deleteProjectMilestone,
    addProjectDevLog,
    strategyDecisions,
    updateStrategyDecision,
    researchVaultItems,
    addResearchVaultItem,
    updateResearchVaultItem,
    deleteResearchVaultItem,
    globalSearchQuery,
    isAutosaved,
    lastSavedText,
    exportUsaDataJSON,
    importUsaDataJSON
  ]);

  return (
    <UsaAppContext.Provider value={value}>
      {children}
    </UsaAppContext.Provider>
  );
};

export const useUsaApp = () => {
  const context = useContext(UsaAppContext);
  if (!context) {
    throw new Error('useUsaApp must be used within a UsaAppProvider');
  }
  return context;
};
