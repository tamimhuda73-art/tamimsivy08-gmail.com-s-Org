import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  NavTab, 
  Mission, 
  SubjectProgress, 
  SubjectPaper,
  Chapter,
  ChapterStatus,
  CountdownTarget, 
  CalendarEvent, 
  DailyHabit, 
  UserProfile,
  StudyRoutineData,
  RoutineCellContent,
  RoutineTimeBlock,
  TimerSettings,
  FocusSessionRecord,
  ActiveTimerState,
  TimerMode,
  MonthlyAssignment,
  RevisionChapterRecord,
  MajorMilestone,
  DateConfirmationStatus,
  DateHistoryEntry,
  CountdownDetails
} from '../types/tracker';
import { 
  INITIAL_USER, 
  INITIAL_MISSIONS, 
  INITIAL_MAJOR_MILESTONES,
  INITIAL_SUBJECTS, 
  INITIAL_COUNTDOWNS, 
  INITIAL_EVENTS, 
  INITIAL_HABITS,
  INITIAL_STUDY_ROUTINE,
  INITIAL_TIMER_SETTINGS,
  INITIAL_FOCUS_SESSIONS
} from '../data/initialData';
import { 
  INITIAL_MONTHLY_ASSIGNMENTS, 
  generateInitialRevisionRecords 
} from '../data/hscTargetsData';

export interface ActiveDateModalData {
  type: 'mission' | 'milestone';
  id: string;
  title: string;
  category: string;
  currentDate: string;
  currentStatus: DateConfirmationStatus;
  history?: DateHistoryEntry[];
}

interface TrackerContextType {
  user: UserProfile;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (c: boolean) => void;
  toggleSidebar: () => void;
  rightSidebarOpen: boolean;
  setRightSidebarOpen: (o: boolean) => void;
  toggleRightSidebar: () => void;
  missions: Mission[];
  reorderMissions: (dragIndex: number, hoverIndex: number) => void;
  updateMissionDate: (id: string, newDate: string, dateStatus: DateConfirmationStatus, note?: string) => void;
  majorMilestones: MajorMilestone[];
  updateMajorMilestone: (id: string, updates: Partial<MajorMilestone>) => void;
  addMajorMilestone: (m: Omit<MajorMilestone, 'id'>) => void;
  deleteMajorMilestone: (id: string) => void;
  toggleMajorMilestoneVisibility: (id: string) => void;
  updateMilestoneDate: (id: string, newDate: string, dateStatus: DateConfirmationStatus, note?: string) => void;
  subjects: SubjectProgress[];
  countdowns: CountdownTarget[];
  events: CalendarEvent[];
  habits: DailyHabit[];
  studyRoutine: StudyRoutineData;
  academicSession: string;
  setAcademicSession: (session: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedMonth: { year: number; month: number };
  setSelectedMonth: React.Dispatch<React.SetStateAction<{ year: number; month: number }>>;
  
  // Modals & Drawers
  activeMissionModal: Mission | null;
  setActiveMissionModal: (m: Mission | null) => void;
  activeSubjectModal: SubjectProgress | null;
  setActiveSubjectModal: (s: SubjectProgress | null) => void;
  activeDateModal: ActiveDateModalData | null;
  setActiveDateModal: (d: ActiveDateModalData | null) => void;
  isEventModalOpen: boolean;
  setIsEventModalOpen: (open: boolean) => void;
  isProfileDrawerOpen: boolean;
  setIsProfileDrawerOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  // Actions: Subject & Paper & Chapter Management
  addSubject: (name: string, hasPapers?: boolean) => void;
  renameSubject: (id: string, name: string) => void;
  deleteSubject: (id: string) => void;
  reorderSubject: (id: string, direction: 'up' | 'down') => void;
  addPaper: (subjectId: string, name: string) => void;
  renamePaper: (subjectId: string, paperId: string, name: string) => void;
  deletePaper: (subjectId: string, paperId: string) => void;
  addChapterToPaper: (subjectId: string, paperId: string, name: string) => void;
  renameChapterInPaper: (subjectId: string, paperId: string, chapterId: string, name: string) => void;
  deleteChapterFromPaper: (subjectId: string, paperId: string, chapterId: string) => void;
  reorderChapterInPaper: (subjectId: string, paperId: string, chapterId: string, direction: 'up' | 'down') => void;
  toggleChapterInPaper: (subjectId: string, paperId: string, chapterId: string) => void;
  updateChapterDetailsInPaper: (subjectId: string, paperId: string, chapterId: string, updates: Partial<Chapter>) => void;
  setAllChaptersInPaper: (subjectId: string, paperId: string, completed: boolean) => void;
  // Compatibility wrappers
  addChapter: (subjectId: string, name: string) => void;
  renameChapter: (subjectId: string, chapterId: string, name: string) => void;
  deleteChapter: (subjectId: string, chapterId: string) => void;
  reorderChapter: (subjectId: string, chapterId: string, direction: 'up' | 'down') => void;
  toggleChapter: (subjectId: string, chapterId: string) => void;
  updateChapterDetails: (subjectId: string, chapterId: string, updates: Partial<Chapter>) => void;
  setAllChaptersStatus: (subjectId: string, completed: boolean) => void;

  // Actions: Missions & Countdowns
  addMission: (mission: Omit<Mission, 'id'>) => void;
  deleteMission: (id: string) => void;
  updateMission: (id: string, updates: Partial<Mission>) => void;
  toggleMilestone: (missionId: string, milestoneId: string) => void;
  updateCountdown: (id: string, updates: Partial<CountdownTarget>) => void;

  // Actions: Calendar Events
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  duplicateEvent: (id: string) => void;
  toggleEventCompleted: (id: string) => void;
  launchTimerFromEvent: (event: CalendarEvent) => void;

  // Actions: Daily Habits
  toggleHabit: (habitId: string, date: string) => void;
  addCustomHabit: (name: string) => void;
  renameHabit: (id: string, newName: string) => void;
  deleteHabit: (id: string) => void;
  reorderHabit: (id: string, direction: 'up' | 'down') => void;

  // Actions: Study Routine Timetable
  updateRoutineCell: (blockId: string, day: string, updates: Partial<RoutineCellContent>) => void;
  updateTimeBlock: (blockId: string, updates: Partial<RoutineTimeBlock>) => void;
  addRoutineBlock: () => void;
  deleteRoutineBlock: (blockId: string) => void;
  updateRoutineMetadata: (updates: Partial<StudyRoutineData>) => void;
  resetRoutineToPDF: () => void;

  // Focus Timer (Part 04)
  timerSettings: TimerSettings;
  updateTimerSettings: (updates: Partial<TimerSettings>) => void;
  sessionRecords: FocusSessionRecord[];
  addSessionRecord: (rec: Omit<FocusSessionRecord, 'id'>) => void;
  updateSessionRecord: (id: string, updates: Partial<FocusSessionRecord>) => void;
  deleteSessionRecord: (id: string) => void;
  resetSessionRecords: () => void;
  activeTimerState: ActiveTimerState;
  setActiveTimerState: React.Dispatch<React.SetStateAction<ActiveTimerState>>;

  // HSC 2027 Month-wise Study Targets (Part 07)
  monthlyAssignments: MonthlyAssignment[];
  updateMonthlyAssignment: (id: string, updates: Partial<MonthlyAssignment>) => void;
  toggleMonthlyAssignment: (id: string) => void;
  cycleMonthlyAssignmentStatus: (id: string) => void;
  addMonthlyAssignment: (asg: Omit<MonthlyAssignment, 'id'>) => void;
  deleteMonthlyAssignment: (id: string) => void;
  moveMonthlyAssignment: (id: string, targetMonthKey: string, targetMonthName: string) => void;
  revisionRecords: RevisionChapterRecord[];
  toggleRevisionRecord: (id: string) => void;
  updateRevisionRecord: (id: string, updates: Partial<RevisionChapterRecord>) => void;
  resetRoadmapProgress: () => void;

  // General Helpers
  calculateDaysRemaining: (targetDateStr: string) => number;
  getCountdownDetails: (targetDateStr: string, dateStatus?: DateConfirmationStatus) => CountdownDetails;
  resetToDefaults: () => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonStr: string) => boolean;
  isAutosaved: boolean;
  lastSavedTime: string;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

const STORAGE_KEY = 'comeback_tracker_data_v4';

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [subjects, setSubjects] = useState<SubjectProgress[]>(INITIAL_SUBJECTS);
  const [countdowns, setCountdowns] = useState<CountdownTarget[]>(INITIAL_COUNTDOWNS);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [habits, setHabits] = useState<DailyHabit[]>(INITIAL_HABITS);
  const [studyRoutine, setStudyRoutine] = useState<StudyRoutineData>(INITIAL_STUDY_ROUTINE);
  const [academicSession, setAcademicSession] = useState<string>("Academic Session 2026–2027");

  // Focus Timer States (Part 04)
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(INITIAL_TIMER_SETTINGS);
  const [sessionRecords, setSessionRecords] = useState<FocusSessionRecord[]>(INITIAL_FOCUS_SESSIONS);
  const [activeTimerState, setActiveTimerState] = useState<ActiveTimerState>({
    mode: 'focus',
    timeLeft: 50 * 60,
    initialDuration: 50 * 60,
    isRunning: false,
    sessionsCompletedToday: 0,
    cycleCount: 0,
    selectedSubjectId: INITIAL_SUBJECTS[0]?.id,
    selectedPaperId: INITIAL_SUBJECTS[0]?.papers[0]?.id,
    customTaskName: "Past Board Question Solve",
    sessionLabel: "Deep Work Session"
  });

  // HSC 2027 Month-wise Study Targets States (Part 07)
  const [monthlyAssignments, setMonthlyAssignments] = useState<MonthlyAssignment[]>(INITIAL_MONTHLY_ASSIGNMENTS);
  const [revisionRecords, setRevisionRecords] = useState<RevisionChapterRecord[]>(generateInitialRevisionRecords());

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const toggleSidebar = useCallback(() => setSidebarCollapsed(prev => !prev), []);
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(false);
  const toggleRightSidebar = useCallback(() => setRightSidebarOpen(prev => !prev), []);
  const [majorMilestones, setMajorMilestones] = useState<MajorMilestone[]>(INITIAL_MAJOR_MILESTONES);
  const [activeDateModal, setActiveDateModal] = useState<ActiveDateModalData | null>(null);

  // Calendar Reference State
  const [selectedDate, setSelectedDate] = useState<string>("2026-11-10");
  const [selectedMonth, setSelectedMonth] = useState<{ year: number; month: number }>({
    year: 2026,
    month: 10 // November (0-indexed 10)
  });

  // Modals
  const [activeMissionModal, setActiveMissionModal] = useState<Mission | null>(null);
  const [activeSubjectModal, setActiveSubjectModal] = useState<SubjectProgress | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [isAutosaved, setIsAutosaved] = useState(true);
  const [lastSavedTime, setLastSavedTime] = useState("Just now");

  // Load from localStorage on mount (supports seamless migration from v3 to v4)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('comeback_tracker_data_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user) {
          if (parsed.user.currentDate === '2026-11-09') {
            parsed.user.currentDate = '2026-11-10';
          }
          setUser(parsed.user);
        }
        if (parsed.sidebarCollapsed !== undefined) setSidebarCollapsed(parsed.sidebarCollapsed);
        
        // Missions & Milestones migration
        if (parsed.missions && Array.isArray(parsed.missions)) {
          // If 5 missions were stored, the 5th was USA. Migrate USA to majorMilestones and keep exactly 4 primary missions
          if (parsed.missions.length === 5 && !parsed.majorMilestones) {
            const fourMissions = INITIAL_MISSIONS.map(initM => {
              const matched = parsed.missions.find((pm: Mission) => pm.id === initM.id);
              if (matched) {
                return {
                  ...initM,
                  progressPercentage: matched.progressPercentage ?? initM.progressPercentage,
                  status: matched.status ?? initM.status,
                  milestones: matched.milestones?.length ? matched.milestones : initM.milestones
                };
              }
              return initM;
            });
            setMissions(fourMissions);
            setMajorMilestones(INITIAL_MAJOR_MILESTONES);
          } else if (parsed.missions.length === 4) {
            setMissions(parsed.missions);
          } else {
            setMissions(INITIAL_MISSIONS);
          }
        }

        if (parsed.majorMilestones && Array.isArray(parsed.majorMilestones)) {
          setMajorMilestones(parsed.majorMilestones);
        }

        if (parsed.subjects && parsed.subjects[0]?.papers) setSubjects(parsed.subjects);
        if (parsed.countdowns) setCountdowns(parsed.countdowns);
        if (parsed.events) setEvents(parsed.events);
        if (parsed.habits) setHabits(parsed.habits);
        if (parsed.academicSession) setAcademicSession(parsed.academicSession);
        if (parsed.studyRoutine && parsed.studyRoutine.headline === "SHOW UP. STUDY DEEP. REPEAT.") {
          setStudyRoutine(parsed.studyRoutine);
        } else {
          setStudyRoutine(INITIAL_STUDY_ROUTINE);
        }
        if (parsed.timerSettings) setTimerSettings(parsed.timerSettings);
        if (parsed.sessionRecords) setSessionRecords(parsed.sessionRecords);
        if (parsed.monthlyAssignments && parsed.monthlyAssignments.length >= 70) {
          setMonthlyAssignments(parsed.monthlyAssignments);
        }
        if (parsed.revisionRecords && parsed.revisionRecords.length > 0) {
          setRevisionRecords(parsed.revisionRecords);
        }
      }
    } catch (e) {
      console.warn("Failed to load saved tracker data:", e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const data = { 
      user, 
      sidebarCollapsed,
      missions, 
      majorMilestones,
      subjects, 
      countdowns, 
      events, 
      habits, 
      studyRoutine, 
      academicSession,
      timerSettings,
      sessionRecords,
      monthlyAssignments,
      revisionRecords
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setIsAutosaved(false);
    
    const timer = setTimeout(() => {
      setIsAutosaved(true);
      const now = new Date();
      setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 400);

    return () => clearTimeout(timer);
  }, [user, missions, subjects, countdowns, events, habits, studyRoutine, academicSession, timerSettings, sessionRecords, monthlyAssignments, revisionRecords]);

  // Recalculate subject aggregate stats helper
  const syncSubjectRollup = (subj: SubjectProgress): SubjectProgress => {
    const papers = subj.papers || [];
    const updatedPapers = papers.map(p => {
      const chs = p.chapters || [];
      const comp = chs.filter(c => c.completed || c.status === 'COMPLETED').length;
      return {
        ...p,
        totalChapters: chs.length,
        completedChapters: comp
      };
    });
    const allChs = updatedPapers.flatMap(p => p.chapters);
    const totalComp = allChs.filter(c => c.completed || c.status === 'COMPLETED').length;
    return {
      ...subj,
      papers: updatedPapers,
      totalChapters: allChs.length,
      completedChapters: totalComp,
      chapters: allChs
    };
  };

  // Sync completion to underlying syllabus in Subject Progress module
  const syncAssignmentToSyllabus = useCallback((asg: MonthlyAssignment, isCompleted: boolean) => {
    const sKey = asg.subjectKey.toLowerCase();
    setSubjects(prev => prev.map(s => {
      const sName = s.name.toLowerCase();
      // Match subject
      const isMatch = sName.includes('physics') && sKey.includes('physics')
        || sName.includes('chem') && sKey.includes('chem')
        || sName.includes('math') && sKey.includes('math')
        || sName.includes('bio') && sKey.includes('bio')
        || sName.includes('ict') && sKey.includes('ict');

      if (!isMatch) return s;

      // Match paper
      const paperNum = sKey.includes('2') ? 2 : 1;
      const updatedPapers = s.papers.map(p => {
        if (s.hasPapers && p.paperNumber !== paperNum) return p;
        // Match chapter number
        const updatedChapters = p.chapters.map(c => {
          if (c.chapterNumber !== asg.chapterNumber) return c;
          const nextStatus: ChapterStatus = isCompleted ? 'COMPLETED' : 'NOT STARTED';
          return {
            ...c,
            completed: isCompleted,
            status: nextStatus,
            completionDate: isCompleted ? (asg.completionDate || new Date().toISOString().split('T')[0]) : undefined
          };
        });
        return { ...p, chapters: updatedChapters };
      });

      return syncSubjectRollup({ ...s, papers: updatedPapers });
    }));
  }, []);

  // Sync completion from underlying Subject chapters back to Monthly Assignments
  const syncChapterToAssignments = useCallback((subjectName: string, paperNum: number, chapterNum: number, isCompleted: boolean) => {
    setMonthlyAssignments(prev => prev.map(a => {
      const sKey = a.subjectKey.toLowerCase();
      const sName = subjectName.toLowerCase();
      const isMatch = (sName.includes('physics') && sKey.includes('physics'))
        || (sName.includes('chem') && sKey.includes('chem'))
        || (sName.includes('math') && sKey.includes('math'))
        || (sName.includes('bio') && sKey.includes('bio'))
        || (sName.includes('ict') && sKey.includes('ict'));
      if (!isMatch) return a;
      const aPaper = sKey.includes('2') ? 2 : 1;
      if (aPaper !== paperNum) return a;
      if (a.chapterNumber !== chapterNum) return a;
      return {
        ...a,
        completed: isCompleted,
        status: isCompleted ? 'COMPLETED' : 'NOT STARTED',
        completionDate: isCompleted ? (a.completionDate || new Date().toISOString().split('T')[0]) : undefined
      };
    }));
  }, []);

  // SUBJECT & PAPER & CHAPTER ACTIONS
  const addSubject = useCallback((name: string, hasPapers: boolean = true) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newId = `subj-${Date.now()}`;
    const initialPapers: SubjectPaper[] = hasPapers ? [
      {
        id: `${newId}-paper-1`,
        name: `${trimmed} 1st Paper`,
        paperNumber: 1,
        totalChapters: 0,
        completedChapters: 0,
        chapters: []
      },
      {
        id: `${newId}-paper-2`,
        name: `${trimmed} 2nd Paper`,
        paperNumber: 2,
        totalChapters: 0,
        completedChapters: 0,
        chapters: []
      }
    ] : [
      {
        id: `${newId}-paper-1`,
        name: trimmed,
        paperNumber: 1,
        totalChapters: 0,
        completedChapters: 0,
        chapters: []
      }
    ];

    const newSubj: SubjectProgress = {
      id: newId,
      name: trimmed,
      hasPapers,
      category: 'core',
      papers: initialPapers,
      totalChapters: 0,
      completedChapters: 0,
      chapters: []
    };
    setSubjects(prev => [...prev, newSubj]);
  }, []);

  const renameSubject = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, name: trimmed } : s));
  }, []);

  const deleteSubject = useCallback((id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  }, []);

  const reorderSubject = useCallback((id: string, direction: 'up' | 'down') => {
    setSubjects(prev => {
      const index = prev.findIndex(s => s.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(newIndex, 0, item);
      return copy;
    });
  }, []);

  const addPaper = useCallback((subjectId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      const paperNumber = (s.papers?.length || 0) + 1;
      const newPaper: SubjectPaper = {
        id: `${subjectId}-paper-${Date.now()}`,
        name: trimmed,
        paperNumber,
        totalChapters: 0,
        completedChapters: 0,
        chapters: []
      };
      const updated = {
        ...s,
        papers: [...(s.papers || []), newPaper]
      };
      return syncSubjectRollup(updated);
    }));
  }, []);

  const renamePaper = useCallback((subjectId: string, paperId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      const updatedPapers = s.papers.map(p => p.id === paperId ? { ...p, name: trimmed } : p);
      return syncSubjectRollup({ ...s, papers: updatedPapers });
    }));
  }, []);

  const deletePaper = useCallback((subjectId: string, paperId: string) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      const updatedPapers = s.papers.filter(p => p.id !== paperId);
      return syncSubjectRollup({ ...s, papers: updatedPapers });
    }));
  }, []);

  const addChapterToPaper = useCallback((subjectId: string, paperId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      const targetPaper = s.papers.find(p => p.id === paperId) || s.papers[0];
      if (!targetPaper) return s;

      const newChapter: Chapter = {
        id: `ch-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        chapterNumber: targetPaper.chapters.length + 1,
        name: trimmed,
        completed: false,
        status: 'NOT STARTED'
      };

      const updatedPapers = s.papers.map(p => {
        if (p.id !== targetPaper.id) return p;
        return {
          ...p,
          chapters: [...p.chapters, newChapter]
        };
      });

      return syncSubjectRollup({ ...s, papers: updatedPapers });
    }));
  }, []);

  const renameChapterInPaper = useCallback((subjectId: string, paperId: string, chapterId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      const updatedPapers = s.papers.map(p => {
        if (p.id !== paperId && p.chapters.every(c => c.id !== chapterId)) return p;
        return {
          ...p,
          chapters: p.chapters.map(c => c.id === chapterId ? { ...c, name: trimmed } : c)
        };
      });
      return syncSubjectRollup({ ...s, papers: updatedPapers });
    }));
  }, []);

  const deleteChapterFromPaper = useCallback((subjectId: string, paperId: string, chapterId: string) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      const updatedPapers = s.papers.map(p => {
        if (p.id !== paperId && p.chapters.every(c => c.id !== chapterId)) return p;
        const filtered = p.chapters
          .filter(c => c.id !== chapterId)
          .map((c, idx) => ({ ...c, chapterNumber: idx + 1 }));
        return { ...p, chapters: filtered };
      });
      return syncSubjectRollup({ ...s, papers: updatedPapers });
    }));
  }, []);

  const reorderChapterInPaper = useCallback((subjectId: string, paperId: string, chapterId: string, direction: 'up' | 'down') => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      const updatedPapers = s.papers.map(p => {
        if (p.id !== paperId && p.chapters.every(c => c.id !== chapterId)) return p;
        const index = p.chapters.findIndex(c => c.id === chapterId);
        if (index === -1) return p;
        if (direction === 'up' && index === 0) return p;
        if (direction === 'down' && index === p.chapters.length - 1) return p;
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const copy = [...p.chapters];
        const [item] = copy.splice(index, 1);
        copy.splice(newIndex, 0, item);
        const renumbered = copy.map((c, idx) => ({ ...c, chapterNumber: idx + 1 }));
        return { ...p, chapters: renumbered };
      });
      return syncSubjectRollup({ ...s, papers: updatedPapers });
    }));
  }, []);

  const toggleChapterInPaper = useCallback((subjectId: string, paperId: string, chapterId: string) => {
    let changedSubjName = '';
    let changedPaperNum = 1;
    let changedChapterNum = 0;
    let nextDone = false;

    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      changedSubjName = s.name;
      const updatedPapers = s.papers.map(p => {
        if (p.id !== paperId && p.chapters.every(c => c.id !== chapterId)) return p;
        changedPaperNum = p.paperNumber;
        return {
          ...p,
          chapters: p.chapters.map(c => {
            if (c.id !== chapterId) return c;
            nextDone = !c.completed;
            changedChapterNum = c.chapterNumber;
            return {
              ...c,
              completed: nextDone,
              status: (nextDone ? 'COMPLETED' : 'NOT STARTED') as ChapterStatus,
              completionDate: nextDone ? new Date().toISOString().split('T')[0] : undefined
            };
          })
        };
      });
      return syncSubjectRollup({ ...s, papers: updatedPapers });
    }));

    if (changedSubjName && changedChapterNum > 0) {
      syncChapterToAssignments(changedSubjName, changedPaperNum, changedChapterNum, nextDone);
    }
  }, [syncChapterToAssignments]);

  const updateChapterDetailsInPaper = useCallback((subjectId: string, paperId: string, chapterId: string, updates: Partial<Chapter>) => {
    let changedSubjName = '';
    let changedPaperNum = 1;
    let changedChapterNum = 0;
    let isStatusUpdate = false;
    let finalCompleted = false;

    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      changedSubjName = s.name;
      const updatedPapers = s.papers.map(p => {
        if (p.id !== paperId && p.chapters.every(c => c.id !== chapterId)) return p;
        changedPaperNum = p.paperNumber;
        return {
          ...p,
          chapters: p.chapters.map(c => {
            if (c.id !== chapterId) return c;
            changedChapterNum = c.chapterNumber;
            const updated = { ...c, ...updates };
            if (updates.status) {
              isStatusUpdate = true;
              if (updates.status === 'COMPLETED') {
                updated.completed = true;
                finalCompleted = true;
                if (!updated.completionDate) updated.completionDate = new Date().toISOString().split('T')[0];
              } else if (updates.status === 'IN PROGRESS') {
                updated.completed = false;
                finalCompleted = false;
              } else if (updates.status === 'NOT STARTED') {
                updated.completed = false;
                finalCompleted = false;
                updated.completionDate = undefined;
              }
            }
            if (updates.completed !== undefined) {
              isStatusUpdate = true;
              updated.completed = updates.completed;
              finalCompleted = updates.completed;
              updated.status = (updates.completed ? 'COMPLETED' : 'NOT STARTED') as ChapterStatus;
              if (updates.completed && !updated.completionDate) {
                updated.completionDate = new Date().toISOString().split('T')[0];
              }
            }
            return updated;
          })
        };
      });
      return syncSubjectRollup({ ...s, papers: updatedPapers });
    }));

    if (isStatusUpdate && changedSubjName && changedChapterNum > 0) {
      syncChapterToAssignments(changedSubjName, changedPaperNum, changedChapterNum, finalCompleted);
    }
  }, [syncChapterToAssignments]);

  const setAllChaptersInPaper = useCallback((subjectId: string, paperId: string, completed: boolean) => {
    let targetSubjName = '';
    let targetPaperNum = 1;
    let chaptersCount = 0;

    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      targetSubjName = s.name;
      const updatedPapers = s.papers.map(p => {
        if (p.id !== paperId) return p;
        targetPaperNum = p.paperNumber;
        chaptersCount = p.chapters.length;
        return {
          ...p,
          chapters: p.chapters.map(c => ({
            ...c,
            completed,
            status: (completed ? 'COMPLETED' : 'NOT STARTED') as ChapterStatus,
            completionDate: completed ? new Date().toISOString().split('T')[0] : undefined
          }))
        };
      });
      return syncSubjectRollup({ ...s, papers: updatedPapers });
    }));

    if (targetSubjName && chaptersCount > 0) {
      for (let chNum = 1; chNum <= chaptersCount; chNum++) {
        syncChapterToAssignments(targetSubjName, targetPaperNum, chNum, completed);
      }
    }
  }, [syncChapterToAssignments]);

  // Backward-compatible wrappers for Subject-level actions
  const addChapter = useCallback((subjectId: string, name: string) => {
    const s = subjects.find(sub => sub.id === subjectId);
    const paperId = s?.papers[0]?.id || '';
    addChapterToPaper(subjectId, paperId, name);
  }, [subjects, addChapterToPaper]);

  const renameChapter = useCallback((subjectId: string, chapterId: string, name: string) => {
    const s = subjects.find(sub => sub.id === subjectId);
    const paper = s?.papers.find(p => p.chapters.some(c => c.id === chapterId)) || s?.papers[0];
    if (paper) renameChapterInPaper(subjectId, paper.id, chapterId, name);
  }, [subjects, renameChapterInPaper]);

  const deleteChapter = useCallback((subjectId: string, chapterId: string) => {
    const s = subjects.find(sub => sub.id === subjectId);
    const paper = s?.papers.find(p => p.chapters.some(c => c.id === chapterId)) || s?.papers[0];
    if (paper) deleteChapterFromPaper(subjectId, paper.id, chapterId);
  }, [subjects, deleteChapterFromPaper]);

  const reorderChapter = useCallback((subjectId: string, chapterId: string, direction: 'up' | 'down') => {
    const s = subjects.find(sub => sub.id === subjectId);
    const paper = s?.papers.find(p => p.chapters.some(c => c.id === chapterId)) || s?.papers[0];
    if (paper) reorderChapterInPaper(subjectId, paper.id, chapterId, direction);
  }, [subjects, reorderChapterInPaper]);

  const toggleChapter = useCallback((subjectId: string, chapterId: string) => {
    const s = subjects.find(sub => sub.id === subjectId);
    const paper = s?.papers.find(p => p.chapters.some(c => c.id === chapterId)) || s?.papers[0];
    if (paper) toggleChapterInPaper(subjectId, paper.id, chapterId);
  }, [subjects, toggleChapterInPaper]);

  const updateChapterDetails = useCallback((subjectId: string, chapterId: string, updates: Partial<Chapter>) => {
    const s = subjects.find(sub => sub.id === subjectId);
    const paper = s?.papers.find(p => p.chapters.some(c => c.id === chapterId)) || s?.papers[0];
    if (paper) updateChapterDetailsInPaper(subjectId, paper.id, chapterId, updates);
  }, [subjects, updateChapterDetailsInPaper]);

  const setAllChaptersStatus = useCallback((subjectId: string, completed: boolean) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      const updatedPapers = s.papers.map(p => ({
        ...p,
        chapters: p.chapters.map(c => ({
          ...c,
          completed,
          status: (completed ? 'COMPLETED' : 'NOT STARTED') as ChapterStatus,
          completionDate: completed ? new Date().toISOString().split('T')[0] : undefined
        }))
      }));
      return syncSubjectRollup({ ...s, papers: updatedPapers });
    }));
  }, []);

  // MISSIONS & MILESTONES
  const addMission = useCallback((mission: Omit<Mission, 'id'>) => {
    const newId = `mission-${Date.now()}`;
    const newMission: Mission = {
      ...mission,
      id: newId,
      order: missions.length + 1
    };
    setMissions(prev => [...prev, newMission]);
  }, [missions.length]);

  const deleteMission = useCallback((id: string) => {
    setMissions(prev => prev.filter(m => m.id !== id));
    setCountdowns(prev => prev.filter(c => c.id !== `countdown-${id.replace('mission-', '')}`));
  }, []);

  const updateMission = useCallback((id: string, updates: Partial<Mission>) => {
    setMissions(prev => prev.map(m => {
      if (m.id !== id) return m;
      const updated = { ...m, ...updates };
      if (updated.progressPercentage === 0) {
        updated.status = 'Not Started';
        updated.subtext = 'Not Started';
      } else if (updated.progressPercentage === 100) {
        updated.status = 'Achieved';
        updated.subtext = 'Goal Achieved';
      } else {
        updated.status = 'In Progress';
        updated.subtext = `${updated.progressPercentage}% Completed`;
      }
      return updated;
    }));
  }, []);

  const reorderMissions = useCallback((dragIndex: number, hoverIndex: number) => {
    setMissions(prev => {
      const list = [...prev];
      const [removed] = list.splice(dragIndex, 1);
      list.splice(hoverIndex, 0, removed);
      return list.map((m, idx) => ({ ...m, order: idx + 1 }));
    });
  }, []);

  const updateMissionDate = useCallback((id: string, newDate: string, dateStatus: DateConfirmationStatus, note?: string) => {
    const timestamp = new Date().toISOString();
    
    setMissions(prev => prev.map(m => {
      if (m.id !== id) return m;
      const history: DateHistoryEntry[] = [
        ...(m.dateHistory || []),
        {
          id: `dh-${Date.now()}`,
          previousDate: m.targetDate || '',
          newDate,
          status: dateStatus,
          timestamp,
          note: note?.trim() || undefined
        }
      ];
      return {
        ...m,
        targetDate: newDate,
        deadline: newDate,
        dateStatus,
        dateHistory: history
      };
    }));

    // Automatically update dashboard countdown target
    setCountdowns(prev => prev.map(c => {
      if (id === 'mission-sat' && c.id === 'countdown-sat') {
        return {
          ...c,
          targetDate: newDate || '2027-03-06',
          targetLabel: newDate ? `PROVISIONAL TARGET: ${newDate} (${dateStatus})` : 'TARGET DATE NOT SET'
        };
      }
      if (id === 'mission-hsc' && c.id === 'countdown-hsc') {
        return {
          ...c,
          targetDate: newDate || '2027-06-06',
          targetLabel: newDate ? `TARGET EXAM START: ${newDate} (${dateStatus})` : 'TARGET DATE NOT SET'
        };
      }
      return c;
    }));

    // Automatically sync with calendar events (no duplicates)
    setEvents(prev => {
      const eventId = `ev-mission-${id}`;
      const existingIndex = prev.findIndex(e => e.id === eventId || (id === 'mission-sat' && e.id === 'ev-sat-target') || (id === 'mission-hsc' && e.id === 'ev-hsc-target'));

      if (!newDate || dateStatus === 'NOT SET') {
        if (existingIndex >= 0) {
          return prev.filter((_, idx) => idx !== existingIndex);
        }
        return prev;
      }

      const targetMission = missions.find(m => m.id === id);
      const title = targetMission ? `${targetMission.title} (${dateStatus})` : `Target Date: ${newDate}`;

      if (existingIndex >= 0) {
        return prev.map((e, idx) => idx === existingIndex ? {
          ...e,
          date: newDate,
          title
        } : e);
      } else {
        const newEvent: CalendarEvent = {
          id: eventId,
          date: newDate,
          title,
          startTime: '09:00',
          endTime: '12:00',
          description: `Mission Target Examination (${dateStatus})`,
          category: 'Examination',
          priority: 'High',
          completed: false,
          color: id === 'mission-sat' ? 'amber' : (id === 'mission-hsc' ? 'black' : 'purple'),
          reminderMinutes: 60
        };
        return [...prev, newEvent];
      }
    });
  }, [missions]);

  const updateMajorMilestone = useCallback((id: string, updates: Partial<MajorMilestone>) => {
    setMajorMilestones(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const addMajorMilestone = useCallback((milestone: Omit<MajorMilestone, 'id'>) => {
    const newMilestone: MajorMilestone = {
      ...milestone,
      id: `milestone-${Date.now()}`
    };
    setMajorMilestones(prev => [...prev, newMilestone]);
  }, []);

  const deleteMajorMilestone = useCallback((id: string) => {
    setMajorMilestones(prev => prev.filter(m => m.id !== id));
  }, []);

  const toggleMajorMilestoneVisibility = useCallback((id: string) => {
    setMajorMilestones(prev => prev.map(m => m.id === id ? { ...m, isVisible: !m.isVisible } : m));
  }, []);

  const updateMilestoneDate = useCallback((id: string, newDate: string, dateStatus: DateConfirmationStatus, note?: string) => {
    const timestamp = new Date().toISOString();
    setMajorMilestones(prev => prev.map(m => {
      if (m.id !== id) return m;
      const history: DateHistoryEntry[] = [
        ...(m.dateHistory || []),
        {
          id: `dh-${Date.now()}`,
          previousDate: m.targetDate || '',
          newDate,
          status: dateStatus,
          timestamp,
          note: note?.trim() || undefined
        }
      ];
      return {
        ...m,
        targetDate: newDate,
        dateStatus,
        dateHistory: history
      };
    }));

    // Sync calendar event for milestone
    setEvents(prev => {
      const eventId = `ev-milestone-${id}`;
      const existingIndex = prev.findIndex(e => e.id === eventId || (id === 'milestone-usa-app' && e.id === 'ev-usa-target'));
      if (!newDate || dateStatus === 'NOT SET') {
        if (existingIndex >= 0) return prev.filter((_, idx) => idx !== existingIndex);
        return prev;
      }
      if (existingIndex >= 0) {
        return prev.map((e, idx) => idx === existingIndex ? { ...e, date: newDate } : e);
      } else {
        const newEvent: CalendarEvent = {
          id: eventId,
          date: newDate,
          title: "USA University Application Start",
          startTime: '09:00',
          endTime: '10:00',
          description: "Application preparation start",
          category: 'Academic Deadline',
          priority: 'High',
          completed: false,
          color: 'blue'
        };
        return [...prev, newEvent];
      }
    });
  }, []);

  const toggleMilestone = useCallback((missionId: string, milestoneId: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id !== missionId) return m;
      const newMilestones = m.milestones.map(ms => 
        ms.id === milestoneId ? { ...ms, completed: !ms.completed } : ms
      );
      const completedCount = newMilestones.filter(ms => ms.completed).length;
      const newPct = Math.round((completedCount / newMilestones.length) * 100);
      const newStatus: Mission['status'] = newPct === 100 ? 'Achieved' : (newPct > 0 ? 'In Progress' : 'Not Started');
      const newSubtext = newPct === 0 ? 'Not Started' : (newPct === 100 ? 'Mastered' : `${newPct}% Target Progress`);

      return {
        ...m,
        milestones: newMilestones,
        progressPercentage: newPct,
        status: newStatus,
        subtext: newSubtext
      };
    }));
  }, []);

  const updateCountdown = useCallback((id: string, updates: Partial<CountdownTarget>) => {
    setCountdowns(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  // CALENDAR
  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `ev-${Date.now()}`
    };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const duplicateEvent = useCallback((id: string) => {
    setEvents(prev => {
      const existing = prev.find(e => e.id === id);
      if (!existing) return prev;
      const dup: CalendarEvent = {
        ...existing,
        id: `ev-${Date.now()}`,
        title: `${existing.title} (Copy)`
      };
      return [...prev, dup];
    });
  }, []);

  const toggleEventCompleted = useCallback((id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, completed: !e.completed } : e));
  }, []);

  const launchTimerFromEvent = useCallback((event: CalendarEvent) => {
    setActiveTimerState(prev => ({
      ...prev,
      selectedSubjectId: event.subjectId || prev.selectedSubjectId,
      selectedPaperId: event.paperId || prev.selectedPaperId,
      customTaskName: event.title,
      sessionLabel: event.category || "Scheduled Study Session"
    }));
    setActiveTab('timer');
  }, []);

  // HABITS
  const toggleHabit = useCallback((habitId: string, date: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const currentVal = !!h.history[date];
      const newHistory = { ...h.history, [date]: !currentVal };
      
      let streak = 0;
      const [y, m, d] = date.split('-').map(Number);
      const checkDate = new Date(y, (m || 1) - 1, d || 1);
      while (true) {
        const cYear = checkDate.getFullYear();
        const cMonth = String(checkDate.getMonth() + 1).padStart(2, '0');
        const cDay = String(checkDate.getDate()).padStart(2, '0');
        const dateStr = `${cYear}-${cMonth}-${cDay}`;
        if (newHistory[dateStr]) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      return {
        ...h,
        history: newHistory,
        streak,
        bestStreak: Math.max(h.bestStreak, streak)
      };
    }));
  }, []);

  const addCustomHabit = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newHabit: DailyHabit = {
      id: `hab-${Date.now()}`,
      name: trimmed,
      category: 'study',
      streak: 0,
      bestStreak: 0,
      history: {}
    };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  const renameHabit = useCallback((id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setHabits(prev => prev.map(h => h.id === id ? { ...h, name: trimmed } : h));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const reorderHabit = useCallback((id: string, direction: 'up' | 'down') => {
    setHabits(prev => {
      const index = prev.findIndex(h => h.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(newIndex, 0, item);
      return copy;
    });
  }, []);

  // ROUTINE
  const updateRoutineCell = useCallback((blockId: string, day: string, updates: Partial<RoutineCellContent>) => {
    setStudyRoutine(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => {
        if (b.id !== blockId) return b;
        const currentCell = b.cells[day] || { subject: "" };
        return {
          ...b,
          cells: { ...b.cells, [day]: { ...currentCell, ...updates } }
        };
      })
    }));
  }, []);

  const updateTimeBlock = useCallback((blockId: string, updates: Partial<RoutineTimeBlock>) => {
    setStudyRoutine(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === blockId ? { ...b, ...updates } : b)
    }));
  }, []);

  const addRoutineBlock = useCallback(() => {
    const newBlock: RoutineTimeBlock = {
      id: `block-${Date.now()}`,
      timeRange: "00:00–00:00",
      period: "CUSTOM",
      label: "NEW SESSION",
      cells: {
        "Saturday": { subject: "STUDY", colorTheme: "ivory" },
        "Sunday": { subject: "STUDY", colorTheme: "ivory" },
        "Monday": { subject: "STUDY", colorTheme: "ivory" },
        "Tuesday": { subject: "STUDY", colorTheme: "ivory" },
        "Wednesday": { subject: "STUDY", colorTheme: "ivory" },
        "Thursday": { subject: "STUDY", colorTheme: "ivory" },
        "Friday": { subject: "RECAP", colorTheme: "beige" }
      }
    };
    setStudyRoutine(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
  }, []);

  const deleteRoutineBlock = useCallback((blockId: string) => {
    setStudyRoutine(prev => ({ ...prev, blocks: prev.blocks.filter(b => b.id !== blockId) }));
  }, []);

  const updateRoutineMetadata = useCallback((updates: Partial<StudyRoutineData>) => {
    setStudyRoutine(prev => ({ ...prev, ...updates }));
  }, []);

  const resetRoutineToPDF = useCallback(() => {
    setStudyRoutine(INITIAL_STUDY_ROUTINE);
  }, []);

  // FOCUS TIMER (PART 04)
  const updateTimerSettings = useCallback((updates: Partial<TimerSettings>) => {
    setTimerSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const addSessionRecord = useCallback((rec: Omit<FocusSessionRecord, 'id'>) => {
    const newRecord: FocusSessionRecord = {
      ...rec,
      id: `sess-${Date.now()}`
    };
    setSessionRecords(prev => [newRecord, ...prev]);
  }, []);

  const updateSessionRecord = useCallback((id: string, updates: Partial<FocusSessionRecord>) => {
    setSessionRecords(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteSessionRecord = useCallback((id: string) => {
    setSessionRecords(prev => prev.filter(s => s.id !== id));
  }, []);

  const resetSessionRecords = useCallback(() => {
    setSessionRecords([]);
  }, []);

  // HSC 2027 MONTH-WISE STUDY TARGETS (PART 07)
  const updateMonthlyAssignment = useCallback((id: string, updates: Partial<MonthlyAssignment>) => {
    setMonthlyAssignments(prev => prev.map(asg => {
      if (asg.id !== id) return asg;
      const updated = { ...asg, ...updates };
      if (updates.completed !== undefined) {
        updated.completed = updates.completed;
        updated.status = updates.completed ? 'COMPLETED' : 'NOT STARTED';
        if (updates.completed && !updated.completionDate) {
          updated.completionDate = new Date().toISOString().split('T')[0];
        }
        syncAssignmentToSyllabus(updated, updates.completed);
      }
      return updated;
    }));
  }, [syncAssignmentToSyllabus]);

  const toggleMonthlyAssignment = useCallback((id: string) => {
    setMonthlyAssignments(prev => prev.map(asg => {
      if (asg.id !== id) return asg;
      const nextDone = !asg.completed;
      const updated: MonthlyAssignment = {
        ...asg,
        completed: nextDone,
        status: nextDone ? 'COMPLETED' : 'NOT STARTED',
        completionDate: nextDone ? new Date().toISOString().split('T')[0] : undefined
      };
      syncAssignmentToSyllabus(updated, nextDone);
      return updated;
    }));
  }, [syncAssignmentToSyllabus]);

  const cycleMonthlyAssignmentStatus = useCallback((id: string) => {
    setMonthlyAssignments(prev => prev.map(asg => {
      if (asg.id !== id) return asg;
      let nextStatus: 'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED' = 'IN PROGRESS';
      if (asg.status === 'IN PROGRESS') {
        nextStatus = 'COMPLETED';
      } else if (asg.status === 'COMPLETED' || asg.completed) {
        nextStatus = 'NOT STARTED';
      } else {
        nextStatus = 'IN PROGRESS';
      }
      const isDone = nextStatus === 'COMPLETED';
      const updated: MonthlyAssignment = {
        ...asg,
        status: nextStatus,
        completed: isDone,
        completionDate: isDone ? (asg.completionDate || new Date().toISOString().split('T')[0]) : undefined
      };
      syncAssignmentToSyllabus(updated, isDone);
      return updated;
    }));
  }, [syncAssignmentToSyllabus]);

  const addMonthlyAssignment = useCallback((asg: Omit<MonthlyAssignment, 'id'>) => {
    const newAsg: MonthlyAssignment = {
      ...asg,
      id: `asg-custom-${Date.now()}`
    };
    setMonthlyAssignments(prev => [...prev, newAsg]);
  }, []);

  const deleteMonthlyAssignment = useCallback((id: string) => {
    setMonthlyAssignments(prev => prev.filter(asg => asg.id !== id));
  }, []);

  const moveMonthlyAssignment = useCallback((id: string, targetMonthKey: string, targetMonthName: string) => {
    setMonthlyAssignments(prev => prev.map(asg => {
      if (asg.id !== id) return asg;
      return {
        ...asg,
        monthKey: targetMonthKey,
        monthName: targetMonthName
      };
    }));
  }, []);

  // Revision Actions (April–May)
  const toggleRevisionRecord = useCallback((id: string) => {
    setRevisionRecords(prev => prev.map(rec => {
      if (rec.id !== id) return rec;
      const nextDone = !rec.revisionCompleted;
      return {
        ...rec,
        revisionCompleted: nextDone,
        revisionDate: nextDone ? new Date().toISOString().split('T')[0] : undefined
      };
    }));
  }, []);

  const updateRevisionRecord = useCallback((id: string, updates: Partial<RevisionChapterRecord>) => {
    setRevisionRecords(prev => prev.map(rec => rec.id === id ? { ...rec, ...updates } : rec));
  }, []);

  const resetRoadmapProgress = useCallback(() => {
    setMonthlyAssignments(INITIAL_MONTHLY_ASSIGNMENTS);
    setRevisionRecords(generateInitialRevisionRecords());
  }, []);

  // CALCULATION & SYSTEM
  const calculateDaysRemaining = useCallback((targetDateStr: string): number => {
    if (!targetDateStr) return 0;
    const baseDate = new Date(`${user.currentDate}T00:00:00`);
    const targetDate = new Date(`${targetDateStr}T00:00:00`);
    const diffTime = targetDate.getTime() - baseDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, [user.currentDate]);

  const getCountdownDetails = useCallback((targetDateStr: string, dateStatus: DateConfirmationStatus = 'CONFIRMED'): CountdownDetails => {
    if (!targetDateStr || dateStatus === 'NOT SET') {
      return {
        days: 0,
        hours: 0,
        isToday: false,
        isPast: false,
        isUnset: true,
        formattedDate: 'DATE NOT SET',
        displayCountdown: 'DATE NOT SET'
      };
    }

    const parts = targetDateStr.split('-');
    let formattedDate = targetDateStr;
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      formattedDate = `${day} ${monthNames[month] || ''} ${year}`;
    }

    const baseDate = new Date(`${user.currentDate}T00:00:00`);
    const targetDate = new Date(`${targetDateStr}T00:00:00`);
    const diffTime = targetDate.getTime() - baseDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return {
        days: 0,
        hours: 0,
        isToday: true,
        isPast: false,
        isUnset: false,
        formattedDate,
        displayCountdown: 'TODAY'
      };
    } else if (diffDays < 0) {
      return {
        days: 0,
        hours: 0,
        isToday: false,
        isPast: true,
        isUnset: false,
        formattedDate,
        displayCountdown: 'CONCLUDED'
      };
    } else {
      return {
        days: diffDays,
        hours: diffDays * 24,
        isToday: false,
        isPast: false,
        isUnset: false,
        formattedDate,
        displayCountdown: `${diffDays} DAYS REMAINING`
      };
    }
  }, [user.currentDate]);

  const resetToDefaults = useCallback(() => {
    setUser(INITIAL_USER);
    setSidebarCollapsed(false);
    setMissions(INITIAL_MISSIONS);
    setMajorMilestones(INITIAL_MAJOR_MILESTONES);
    setSubjects(INITIAL_SUBJECTS);
    setCountdowns(INITIAL_COUNTDOWNS);
    setEvents(INITIAL_EVENTS);
    setHabits(INITIAL_HABITS);
    setStudyRoutine(INITIAL_STUDY_ROUTINE);
    setTimerSettings(INITIAL_TIMER_SETTINGS);
    setSessionRecords(INITIAL_FOCUS_SESSIONS);
    setMonthlyAssignments(INITIAL_MONTHLY_ASSIGNMENTS);
    setRevisionRecords(generateInitialRevisionRecords());
    setSelectedDate("2026-11-10");
    setSelectedMonth({ year: 2026, month: 10 });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('comeback_tracker_data_v3');
  }, []);

  const exportDataJSON = useCallback(() => {
    const data = { 
      user, 
      sidebarCollapsed,
      missions, 
      majorMilestones,
      subjects, 
      countdowns, 
      events, 
      habits, 
      studyRoutine, 
      timerSettings,
      sessionRecords,
      monthlyAssignments,
      revisionRecords,
      exportedAt: new Date().toISOString() 
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comeback-tracker-full-backup-${user.currentDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [user, sidebarCollapsed, missions, majorMilestones, subjects, countdowns, events, habits, studyRoutine, timerSettings, sessionRecords, monthlyAssignments, revisionRecords]);

  const importDataJSON = useCallback((jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.missions && parsed.subjects) {
        if (parsed.user) setUser(parsed.user);
        if (parsed.sidebarCollapsed !== undefined) setSidebarCollapsed(parsed.sidebarCollapsed);
        if (parsed.missions) setMissions(parsed.missions);
        if (parsed.majorMilestones) setMajorMilestones(parsed.majorMilestones);
        if (parsed.subjects) setSubjects(parsed.subjects);
        if (parsed.countdowns) setCountdowns(parsed.countdowns);
        if (parsed.events) setEvents(parsed.events);
        if (parsed.habits) setHabits(parsed.habits);
        if (parsed.studyRoutine) setStudyRoutine(parsed.studyRoutine);
        if (parsed.timerSettings) setTimerSettings(parsed.timerSettings);
        if (parsed.sessionRecords) setSessionRecords(parsed.sessionRecords);
        if (parsed.monthlyAssignments) setMonthlyAssignments(parsed.monthlyAssignments);
        if (parsed.revisionRecords) setRevisionRecords(parsed.revisionRecords);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo(() => ({
    user,
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,
    rightSidebarOpen,
    setRightSidebarOpen,
    toggleRightSidebar,
    missions,
    reorderMissions,
    updateMissionDate,
    majorMilestones,
    updateMajorMilestone,
    addMajorMilestone,
    deleteMajorMilestone,
    toggleMajorMilestoneVisibility,
    updateMilestoneDate,
    subjects,
    countdowns,
    events,
    habits,
    studyRoutine,
    academicSession,
    setAcademicSession,
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,
    activeMissionModal,
    setActiveMissionModal,
    activeSubjectModal,
    setActiveSubjectModal,
    activeDateModal,
    setActiveDateModal,
    isEventModalOpen,
    setIsEventModalOpen,
    isProfileDrawerOpen,
    setIsProfileDrawerOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    // Subjects & Papers
    addSubject,
    renameSubject,
    deleteSubject,
    reorderSubject,
    addPaper,
    renamePaper,
    deletePaper,
    addChapterToPaper,
    renameChapterInPaper,
    deleteChapterFromPaper,
    reorderChapterInPaper,
    toggleChapterInPaper,
    updateChapterDetailsInPaper,
    setAllChaptersInPaper,
    addChapter,
    renameChapter,
    deleteChapter,
    reorderChapter,
    toggleChapter,
    updateChapterDetails,
    setAllChaptersStatus,
    // Missions & Countdowns
    addMission,
    deleteMission,
    updateMission,
    toggleMilestone,
    updateCountdown,
    // Events
    addEvent,
    updateEvent,
    deleteEvent,
    duplicateEvent,
    toggleEventCompleted,
    launchTimerFromEvent,
    // Habits
    toggleHabit,
    addCustomHabit,
    renameHabit,
    deleteHabit,
    reorderHabit,
    // Routine
    updateRoutineCell,
    updateTimeBlock,
    addRoutineBlock,
    deleteRoutineBlock,
    updateRoutineMetadata,
    resetRoutineToPDF,
    // Focus Timer
    timerSettings,
    updateTimerSettings,
    sessionRecords,
    addSessionRecord,
    updateSessionRecord,
    deleteSessionRecord,
    resetSessionRecords,
    activeTimerState,
    setActiveTimerState,
    // HSC 2027 Month-wise Study Targets (Part 07)
    monthlyAssignments,
    updateMonthlyAssignment,
    toggleMonthlyAssignment,
    cycleMonthlyAssignmentStatus,
    addMonthlyAssignment,
    deleteMonthlyAssignment,
    moveMonthlyAssignment,
    revisionRecords,
    toggleRevisionRecord,
    updateRevisionRecord,
    resetRoadmapProgress,
    // System
    calculateDaysRemaining,
    getCountdownDetails,
    resetToDefaults,
    exportDataJSON,
    importDataJSON,
    isAutosaved,
    lastSavedTime
  }), [
    user,
    activeTab,
    sidebarCollapsed,
    toggleSidebar,
    rightSidebarOpen,
    toggleRightSidebar,
    missions,
    reorderMissions,
    updateMissionDate,
    majorMilestones,
    updateMajorMilestone,
    addMajorMilestone,
    deleteMajorMilestone,
    toggleMajorMilestoneVisibility,
    updateMilestoneDate,
    subjects,
    countdowns,
    events,
    habits,
    studyRoutine,
    academicSession,
    selectedDate,
    selectedMonth,
    activeMissionModal,
    activeSubjectModal,
    activeDateModal,
    isEventModalOpen,
    isProfileDrawerOpen,
    isNotificationsOpen,
    addSubject,
    renameSubject,
    deleteSubject,
    reorderSubject,
    addPaper,
    renamePaper,
    deletePaper,
    addChapterToPaper,
    renameChapterInPaper,
    deleteChapterFromPaper,
    reorderChapterInPaper,
    toggleChapterInPaper,
    updateChapterDetailsInPaper,
    setAllChaptersInPaper,
    addChapter,
    renameChapter,
    deleteChapter,
    reorderChapter,
    toggleChapter,
    updateChapterDetails,
    setAllChaptersStatus,
    addMission,
    deleteMission,
    updateMission,
    toggleMilestone,
    updateCountdown,
    addEvent,
    updateEvent,
    deleteEvent,
    duplicateEvent,
    toggleEventCompleted,
    launchTimerFromEvent,
    toggleHabit,
    addCustomHabit,
    renameHabit,
    deleteHabit,
    reorderHabit,
    updateRoutineCell,
    updateTimeBlock,
    addRoutineBlock,
    deleteRoutineBlock,
    updateRoutineMetadata,
    resetRoutineToPDF,
    timerSettings,
    updateTimerSettings,
    sessionRecords,
    addSessionRecord,
    updateSessionRecord,
    deleteSessionRecord,
    resetSessionRecords,
    activeTimerState,
    monthlyAssignments,
    updateMonthlyAssignment,
    toggleMonthlyAssignment,
    cycleMonthlyAssignmentStatus,
    addMonthlyAssignment,
    deleteMonthlyAssignment,
    moveMonthlyAssignment,
    revisionRecords,
    toggleRevisionRecord,
    updateRevisionRecord,
    resetRoadmapProgress,
    calculateDaysRemaining,
    getCountdownDetails,
    resetToDefaults,
    exportDataJSON,
    importDataJSON,
    isAutosaved,
    lastSavedTime
  ]);

  return (
    <TrackerContext.Provider value={value}>
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = () => {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
};
