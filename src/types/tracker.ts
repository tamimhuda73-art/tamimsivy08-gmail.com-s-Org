export type NavTab = 
  | 'overview' 
  | 'targets'
  | 'timer'
  | 'routine'
  | 'calendar' 
  | 'missions' 
  | 'subjects' 
  | 'habits' 
  | 'analytics' 
  | 'settings';

export interface RoutineCellContent {
  subject: string;
  subtext?: string;
  colorTheme?: 'blue' | 'taupe' | 'cream' | 'ivory' | 'sage' | 'beige' | 'charcoal';
}

export interface RoutineTimeBlock {
  id: string;
  timeRange: string;
  period: string;
  label: string;
  cells: Record<string, RoutineCellContent>;
}

export interface StudyRoutineData {
  kicker: string;
  headline: string;
  subtitle: string;
  badgeTop: string;
  badgeMiddle: string;
  badgeBottom: string;
  subHeaderLeft: string;
  subHeaderRight: string;
  days: string[];
  blocks: RoutineTimeBlock[];
  footerPillars: {
    id: string;
    label: string;
    detail: string;
  }[];
}

export type DateConfirmationStatus = 'CONFIRMED' | 'TENTATIVE' | 'PLANNED' | 'NOT SET';

export interface DateHistoryEntry {
  id: string;
  previousDate: string;
  newDate: string;
  status: DateConfirmationStatus;
  timestamp: string;
  note?: string;
}

export interface CountdownDetails {
  days: number;
  hours: number;
  isToday: boolean;
  isPast: boolean;
  isUnset: boolean;
  formattedDate: string;
  displayCountdown: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Mission {
  id: string;
  order: number;
  title: string;
  code: string;
  goal: string;
  category: string;
  targetDate: string; // "YYYY-MM-DD" or empty "" for NOT SET
  dateStatus: DateConfirmationStatus;
  progressPercentage: number;
  status: 'Not Started' | 'In Progress' | 'On Track' | 'Achieved';
  subtext: string;
  targetDescription: string;
  targetScore: string;
  currentScore?: string;
  deadline: string;
  milestones: Milestone[];
  notes?: string;
  colorAccent: 'beige' | 'brown' | 'taupe' | 'espresso';
  dateHistory?: DateHistoryEntry[];
  progressMode?: 'auto' | 'manual';
}

export interface MajorMilestone {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  targetDate: string; // "YYYY-MM-DD" or empty "" for NOT SET
  dateStatus: DateConfirmationStatus;
  status: 'UPCOMING' | 'IN PROGRESS' | 'COMPLETED' | 'PLANNED';
  progressPercentage: number;
  description: string;
  isVisible: boolean;
  notes?: string;
  dateHistory?: DateHistoryEntry[];
}

export type ChapterStatus = 'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED' | 'not_started' | 'in_progress' | 'completed' | 'reading' | 'practice_done' | 'mastered';

export interface Chapter {
  id: string;
  chapterNumber: number;
  name: string;
  completed: boolean;
  status: ChapterStatus;
  completionDate?: string;
  notes?: string;
}

export interface SubjectPaper {
  id: string;
  name: string;
  paperNumber: number;
  totalChapters: number;
  completedChapters: number;
  chapters: Chapter[];
}

export interface SubjectProgress {
  id: string;
  name: string;
  category?: 'core' | 'paper' | 'elective';
  iconName?: string;
  hasPapers?: boolean;
  papers: SubjectPaper[];
  totalChapters: number;
  completedChapters: number;
  chapters: Chapter[];
}

export interface CountdownTarget {
  id: string;
  category: string;
  title: string;
  targetDate: string;
  targetLabel: string;
  badgeLeft: string;
  badgeRight: string;
}

export type EventCategory = 
  | 'Study Session' 
  | 'Examination' 
  | 'Assignment' 
  | 'Academic Deadline' 
  | 'Personal' 
  | 'Reminder' 
  | 'Other';

export type EventPriority = 'High' | 'Medium' | 'Low';

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  category: EventCategory;
  priority: EventPriority;
  completed: boolean;
  color: 'amber' | 'black' | 'blue' | 'emerald' | 'rose' | 'purple';
  subjectId?: string;
  paperId?: string;
  chapterId?: string;
  isRecurring?: boolean;
  recurrenceRule?: 'daily' | 'weekly' | 'monthly' | 'none';
  recurrenceGroupId?: string;
  reminderMinutes?: number;
}

export interface DailyHabit {
  id: string;
  name: string;
  category: 'study' | 'mindset' | 'health';
  streak: number;
  bestStreak: number;
  history: Record<string, boolean>;
}

export interface UserProfile {
  name: string;
  initials: string;
  email: string;
  currentDate: string;
  useRealCurrentDate: boolean;
  quote: string;
}

// Focus Timer Types (Part 04)
export type TimerMode = 'focus' | 'short_break' | 'long_break' | 'custom';

export interface TimerSettings {
  focusDurationMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoTransition: boolean;
  dailyTargetHours: number;
  dailyTargetSessions: number;
  soundEnabled: boolean;
}

export interface FocusSessionRecord {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  mode: TimerMode;
  subjectId?: string;
  subjectName?: string;
  paperId?: string;
  paperName?: string;
  chapterId?: string;
  chapterName?: string;
  taskName: string;
  sessionLabel?: string;
  status: 'completed' | 'interrupted';
  notes?: string;
}

export interface ActiveTimerState {
  mode: TimerMode;
  timeLeft: number;
  initialDuration: number;
  isRunning: boolean;
  startedAtTimestamp?: number;
  sessionsCompletedToday: number;
  cycleCount: number;
  selectedSubjectId?: string;
  selectedPaperId?: string;
  selectedChapterId?: string;
  customTaskName: string;
  sessionLabel: string;
}

// HSC 2027 Month-wise Study Targets Types (Part 07)
export interface MonthlyAssignment {
  id: string;
  monthKey: string; // 'nov-2026' | 'dec-2026' | 'jan-2027' | 'feb-2027' | 'mar-2027'
  monthName: string; // 'November 2026', 'December 2026', etc.
  subjectKey: string; // 'Physics 1', 'Physics 2', 'Chemistry 1', 'Chemistry 2', 'Higher Mathematics 1', 'Higher Mathematics 2', 'Biology 1', 'Biology 2', 'ICT'
  subjectId?: string;
  paperId?: string;
  chapterNumber: number;
  chapterName: string;
  status: 'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED';
  completed: boolean;
  completionDate?: string;
  notes?: string;
}

export interface MonthSectionData {
  key: string;
  name: string;
  targetCount: number;
  subtext: string;
}

export interface RevisionChapterRecord {
  id: string; // e.g. "Physics 1-Ch 2"
  subjectKey: string;
  chapterNumber: number;
  chapterName: string;
  revisionCompleted: boolean;
  revisionDate?: string;
  notes?: string;
}
