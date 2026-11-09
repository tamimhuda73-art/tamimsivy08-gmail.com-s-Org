import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Layers, 
  Atom, 
  FlaskConical, 
  Dna, 
  Cpu, 
  FileText, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCheck, 
  BarChart3, 
  PieChart, 
  MoveUp, 
  MoveDown, 
  Sparkles, 
  Check, 
  X, 
  FileCheck2, 
  BookmarkCheck, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { Chapter, ChapterStatus, SubjectPaper, SubjectProgress } from '../types/tracker';

const getSubjectIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('physics')) return <Atom className="w-5 h-5 text-[#3B302A]" />;
  if (lower.includes('math')) return <BarChart3 className="w-5 h-5 text-[#3B302A]" />;
  if (lower.includes('chemistry')) return <FlaskConical className="w-5 h-5 text-[#3B302A]" />;
  if (lower.includes('biology')) return <Dna className="w-5 h-5 text-[#3B302A]" />;
  if (lower.includes('ict') || lower.includes('computer')) return <Cpu className="w-5 h-5 text-[#3B302A]" />;
  return <BookOpen className="w-5 h-5 text-[#3B302A]" />;
};

export const SubjectsView: React.FC = () => {
  const { 
    subjects, 
    academicSession, 
    setAcademicSession,
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
    setAllChaptersInPaper
  } = useTracker();

  // Active selections
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [selectedPaperId, setSelectedPaperId] = useState<string>('');

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED'>('ALL');
  const [sortBy, setSortBy] = useState<'DEFAULT' | 'NAME' | 'HIGHEST' | 'LOWEST' | 'MOST_CH' | 'LEAST_CH'>('DEFAULT');
  const [searchQuery, setSearchQuery] = useState('');

  // Inline academic session editing
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [sessionInput, setSessionInput] = useState(academicSession);

  // New subject modal
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectHasPapers, setNewSubjectHasPapers] = useState(true);

  // Inline rename states
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [editingSubjectName, setEditingSubjectName] = useState('');

  const [editingPaperId, setEditingPaperId] = useState<string | null>(null);
  const [editingPaperName, setEditingPaperName] = useState('');

  // New paper modal/inline
  const [isAddingPaper, setIsAddingPaper] = useState(false);
  const [newPaperTitle, setNewPaperTitle] = useState('');

  // Chapter editing
  const [newChapterName, setNewChapterName] = useState('');
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editingChapterName, setEditingChapterName] = useState('');
  const [expandedNotesChapterId, setExpandedNotesChapterId] = useState<string | null>(null);

  // Active Subject
  const activeSubject = useMemo(() => {
    return subjects.find(s => s.id === selectedSubjectId) || subjects[0] || null;
  }, [subjects, selectedSubjectId]);

  // Active Paper inside Active Subject
  const activePaper = useMemo(() => {
    if (!activeSubject || !activeSubject.papers || activeSubject.papers.length === 0) return null;
    return activeSubject.papers.find(p => p.id === selectedPaperId) || activeSubject.papers[0];
  }, [activeSubject, selectedPaperId]);

  // Overall Syllabus Statistics
  const overallStats = useMemo(() => {
    let totalChapters = 0;
    let completedChapters = 0;
    let inProgressChapters = 0;
    let notStartedChapters = 0;

    subjects.forEach(s => {
      const allChapters = (s.papers || []).flatMap(p => p.chapters || []);
      totalChapters += allChapters.length;
      allChapters.forEach(ch => {
        if (ch.status === 'COMPLETED' || ch.completed) {
          completedChapters++;
        } else if (ch.status === 'IN PROGRESS') {
          inProgressChapters++;
        } else {
          notStartedChapters++;
        }
      });
    });

    const remainingChapters = Math.max(0, totalChapters - completedChapters);
    const overallPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

    let highestSubj = subjects[0] || null;
    let lowestSubj = subjects[0] || null;
    let maxPct = -1;
    let minPct = 101;

    subjects.forEach(s => {
      const allChapters = (s.papers || []).flatMap(p => p.chapters || []);
      const count = allChapters.length;
      const comp = allChapters.filter(c => c.completed || c.status === 'COMPLETED').length;
      const pct = count > 0 ? Math.round((comp / count) * 100) : 0;
      if (pct > maxPct) {
        maxPct = pct;
        highestSubj = s;
      }
      if (pct < minPct) {
        minPct = pct;
        lowestSubj = s;
      }
    });

    return {
      totalSubjects: subjects.length,
      totalChapters,
      completedChapters,
      inProgressChapters,
      notStartedChapters,
      remainingChapters,
      overallPercentage,
      highestSubj,
      highestPct: Math.max(0, maxPct),
      lowestSubj,
      lowestPct: minPct === 101 ? 0 : minPct
    };
  }, [subjects]);

  // Filtered and Sorted Subjects
  const processedSubjects = useMemo(() => {
    let list = [...subjects];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) ||
        (s.papers || []).some(p => 
          p.name.toLowerCase().includes(q) ||
          p.chapters.some(ch => ch.name.toLowerCase().includes(q))
        )
      );
    }

    if (filterStatus !== 'ALL') {
      list = list.filter(s => {
        const allChapters = (s.papers || []).flatMap(p => p.chapters || []);
        const count = allChapters.length;
        const comp = allChapters.filter(c => c.completed || c.status === 'COMPLETED').length;
        const inProg = allChapters.filter(c => c.status === 'IN PROGRESS').length;
        const pct = count > 0 ? Math.round((comp / count) * 100) : 0;

        if (filterStatus === 'COMPLETED') return pct === 100 && count > 0;
        if (filterStatus === 'IN_PROGRESS') return (pct > 0 && pct < 100) || inProg > 0;
        if (filterStatus === 'NOT_STARTED') return pct === 0 && inProg === 0;
        return true;
      });
    }

    if (sortBy === 'NAME') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'HIGHEST') {
      list.sort((a, b) => {
        const pctA = a.totalChapters ? (a.completedChapters / a.totalChapters) : 0;
        const pctB = b.totalChapters ? (b.completedChapters / b.totalChapters) : 0;
        return pctB - pctA;
      });
    } else if (sortBy === 'LOWEST') {
      list.sort((a, b) => {
        const pctA = a.totalChapters ? (a.completedChapters / a.totalChapters) : 0;
        const pctB = b.totalChapters ? (b.completedChapters / b.totalChapters) : 0;
        return pctA - pctB;
      });
    } else if (sortBy === 'MOST_CH') {
      list.sort((a, b) => b.totalChapters - a.totalChapters);
    } else if (sortBy === 'LEAST_CH') {
      list.sort((a, b) => a.totalChapters - b.totalChapters);
    }

    return list;
  }, [subjects, searchQuery, filterStatus, sortBy]);

  const handleSaveSession = () => {
    if (sessionInput.trim()) {
      setAcademicSession(sessionInput.trim());
    }
    setIsEditingSession(false);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      addSubject(newSubjectName.trim(), newSubjectHasPapers);
      setNewSubjectName('');
      setIsAddSubjectModalOpen(false);
    }
  };

  const handleAddPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubject || !newPaperTitle.trim()) return;
    addPaper(activeSubject.id, newPaperTitle.trim());
    setNewPaperTitle('');
    setIsAddingPaper(false);
  };

  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubject || !activePaper || !newChapterName.trim()) return;
    addChapterToPaper(activeSubject.id, activePaper.id, newChapterName.trim());
    setNewChapterName('');
  };

  const cycleChapterStatus = (chapter: Chapter) => {
    if (!activeSubject || !activePaper) return;
    let nextStatus: ChapterStatus = 'IN PROGRESS';
    if (chapter.status === 'IN PROGRESS') {
      nextStatus = 'COMPLETED';
    } else if (chapter.status === 'COMPLETED' || chapter.completed) {
      nextStatus = 'NOT STARTED';
    } else {
      nextStatus = 'IN PROGRESS';
    }
    updateChapterDetailsInPaper(activeSubject.id, activePaper.id, chapter.id, {
      status: nextStatus,
      completed: nextStatus === 'COMPLETED'
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1520px] mx-auto space-y-8 bg-[#F8F6F2] min-h-screen">
      
      {/* 1. SECTION HEADER */}
      <div className="bg-white rounded-2xl border border-[#D8C5AE]/60 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#EFE7DC]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#59483D]" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                ACADEMIC CURRICULUM ROADMAP
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#292724] font-serif">
              SUBJECT PROGRESS
            </h1>
            
            <p className="text-xs sm:text-sm font-medium tracking-wide text-[#59483D]">
              MASTER EVERY CHAPTER. TRACK EVERY MILESTONE.
            </p>

            {/* Editable Academic Session */}
            <div className="pt-2 flex items-center gap-2">
              {isEditingSession ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={sessionInput}
                    onChange={(e) => setSessionInput(e.target.value)}
                    className="px-2.5 py-1 text-xs font-mono bg-[#F8F6F2] border border-[#59483D] rounded-md text-[#292724] focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveSession}
                    className="p-1 rounded bg-[#3B302A] text-white hover:bg-[#59483D]"
                    title="Save"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setSessionInput(academicSession);
                      setIsEditingSession(false);
                    }}
                    className="p-1 rounded bg-[#EFE7DC] text-[#59483D]"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSessionInput(academicSession);
                    setIsEditingSession(true);
                  }}
                  className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EFE7DC]/60 hover:bg-[#EFE7DC] text-[11px] font-mono text-[#59483D] transition-colors cursor-pointer border border-[#D8C5AE]/40"
                  title="Click to edit session"
                >
                  <CalendarIcon className="w-3 h-3 text-[#59483D]" />
                  <span>{academicSession}</span>
                  <Edit3 className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100 ml-1" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Header Metric Counter Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#F8F6F2] border border-[#D8C5AE]/60 rounded-xl px-4 py-3 text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A99A8C] block">
                Total Syllabus
              </span>
              <span className="text-xl font-bold font-mono text-[#292724]">
                {overallStats.overallPercentage}%
              </span>
              <span className="text-[10px] font-mono text-[#59483D] block mt-0.5">
                Completed
              </span>
            </div>

            <div className="bg-[#F8F6F2] border border-[#D8C5AE]/60 rounded-xl px-4 py-3 text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A99A8C] block">
                Total Subjects
              </span>
              <span className="text-xl font-bold font-mono text-[#292724]">
                {overallStats.totalSubjects}
              </span>
              <span className="text-[10px] font-mono text-[#59483D] block mt-0.5">
                Disciplines
              </span>
            </div>

            <div className="bg-[#F8F6F2] border border-[#D8C5AE]/60 rounded-xl px-4 py-3 text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A99A8C] block">
                Chapters Done
              </span>
              <span className="text-xl font-bold font-mono text-[#3B302A]">
                {overallStats.completedChapters}
              </span>
              <span className="text-[10px] font-mono text-[#59483D] block mt-0.5">
                of {overallStats.totalChapters} Total
              </span>
            </div>

            <div className="bg-[#F8F6F2] border border-[#D8C5AE]/60 rounded-xl px-4 py-3 text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A99A8C] block">
                Remaining
              </span>
              <span className="text-xl font-bold font-mono text-[#59483D]">
                {overallStats.remainingChapters}
              </span>
              <span className="text-[10px] font-mono text-[#A99A8C] block mt-0.5">
                To Complete
              </span>
            </div>
          </div>
        </div>

        {/* Global Progress Strip */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#59483D] font-semibold flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-[#3B302A]" />
              SYLLABUS PROGRESSION
            </span>
            <span className="text-[#292724] font-bold">
              {overallStats.completedChapters} / {overallStats.totalChapters} Chapters ({overallStats.overallPercentage}%)
            </span>
          </div>

          <div className="w-full h-3 bg-[#EFE7DC] rounded-full overflow-hidden p-0.5 border border-[#D8C5AE]/50">
            <div 
              className="h-full bg-gradient-to-r from-[#59483D] to-[#3B302A] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallStats.overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. OVERALL ACADEMIC PROGRESS SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase text-[#A99A8C] tracking-wider">
              SYLLABUS STATUS
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#EFE7DC] flex items-center justify-center p-1.5 text-[#3B302A]">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold font-mono text-[#292724]">
              {overallStats.overallPercentage}%
            </div>
            <p className="text-xs text-[#59483D] mt-1">
              {overallStats.completedChapters} of {overallStats.totalChapters} chapters completely mastered
            </p>
          </div>
          <div className="text-[11px] font-mono text-[#A99A8C] border-t border-[#EFE7DC] pt-2 flex items-center justify-between">
            <span>Remaining Work</span>
            <span className="font-bold text-[#59483D]">{overallStats.remainingChapters} Ch</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase text-[#A99A8C] tracking-wider">
              CHAPTER BREAKDOWN
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#EFE7DC] flex items-center justify-center p-1.5 text-[#3B302A]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#59483D] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#3B302A]" /> Completed
              </span>
              <span className="font-mono font-bold text-[#292724]">{overallStats.completedChapters}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#59483D] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D8C5AE]" /> In Progress
              </span>
              <span className="font-mono font-bold text-[#292724]">{overallStats.inProgressChapters}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#59483D] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EFE7DC]" /> Not Started
              </span>
              <span className="font-mono font-bold text-[#292724]">{overallStats.notStartedChapters}</span>
            </div>
          </div>
          <div className="text-[11px] font-mono text-[#A99A8C] border-t border-[#EFE7DC] pt-2 flex items-center justify-between">
            <span>Total Units</span>
            <span className="font-bold text-[#292724]">{overallStats.totalChapters} Ch</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase text-[#A99A8C] tracking-wider">
              TOP PERFORMING
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#EFE7DC] flex items-center justify-center p-1.5 text-[#3B302A]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-xl font-bold text-[#292724] truncate">
              {overallStats.highestSubj ? overallStats.highestSubj.name : '—'}
            </div>
            <div className="text-2xl font-extrabold font-mono text-[#3B302A] mt-0.5">
              {overallStats.highestPct}%
            </div>
            <p className="text-xs text-[#59483D]">
              Highest completion rate achieved
            </p>
          </div>
          <div className="text-[11px] font-mono text-[#A99A8C] border-t border-[#EFE7DC] pt-2 flex items-center justify-between">
            <span>Status</span>
            <span className="font-semibold text-[#3B302A]">Leading Momentum</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase text-[#A99A8C] tracking-wider">
              PRIORITY FOCUS
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#EFE7DC] flex items-center justify-center p-1.5 text-[#59483D]">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-xl font-bold text-[#292724] truncate">
              {overallStats.lowestSubj ? overallStats.lowestSubj.name : '—'}
            </div>
            <div className="text-2xl font-extrabold font-mono text-[#59483D] mt-0.5">
              {overallStats.lowestPct}%
            </div>
            <p className="text-xs text-[#59483D]">
              Requires immediate study allocation
            </p>
          </div>
          <div className="text-[11px] font-mono text-[#A99A8C] border-t border-[#EFE7DC] pt-2 flex items-center justify-between">
            <span>Action</span>
            <span className="font-semibold text-[#59483D]">Target Revision</span>
          </div>
        </div>
      </div>

      {/* 3. CONTROLS, SEARCH, FILTER, AND + ADD SUBJECT */}
      <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A99A8C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search subject, paper or chapter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE]/60 rounded-lg text-[#292724] placeholder-[#A99A8C] focus:outline-none focus:ring-1 focus:ring-[#3B302A]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A99A8C] hover:text-[#292724]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'COMPLETED', 'IN_PROGRESS', 'NOT_STARTED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`
                px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap
                ${filterStatus === tab 
                  ? 'bg-[#3B302A] text-white shadow-xs' 
                  : 'bg-[#F8F6F2] text-[#59483D] hover:bg-[#EFE7DC] border border-[#D8C5AE]/40'}
              `}
            >
              {tab === 'ALL' && 'All Subjects'}
              {tab === 'COMPLETED' && 'Completed'}
              {tab === 'IN_PROGRESS' && 'In Progress'}
              {tab === 'NOT_STARTED' && 'Not Started'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-mono bg-[#F8F6F2] text-[#59483D] border border-[#D8C5AE]/60 px-3 py-2 rounded-lg cursor-pointer focus:outline-none"
          >
            <option value="DEFAULT">Default Order</option>
            <option value="NAME">Alphabetical (A–Z)</option>
            <option value="HIGHEST">Highest Completion</option>
            <option value="LOWEST">Lowest Completion</option>
            <option value="MOST_CH">Most Chapters</option>
            <option value="LEAST_CH">Least Chapters</option>
          </select>

          <button
            onClick={() => setIsAddSubjectModalOpen(true)}
            className="px-3.5 py-2 text-xs font-mono font-bold text-white bg-[#3B302A] hover:bg-[#59483D] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* 4. MAIN WORKSPACE: SUBJECT CARDS + SUB-SECTIONS (PAPERS) & CHAPTER MANAGEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (5 cols): Subjects List with Paper Breakdowns */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#59483D]">
              DISCIPLINES ({processedSubjects.length})
            </span>
            <span className="text-[10px] font-mono text-[#A99A8C]">
              Select to manage papers & chapters
            </span>
          </div>

          {processedSubjects.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-8 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-[#A99A8C] mx-auto opacity-40" />
              <p className="text-sm font-semibold text-[#292724]">No subjects match the filter</p>
              <p className="text-xs text-[#59483D] font-mono">Try adjusting your search query</p>
            </div>
          ) : (
            processedSubjects.map((subj) => {
              const isSelected = activeSubject?.id === subj.id;
              const allChapters = (subj.papers || []).flatMap(p => p.chapters || []);
              const count = allChapters.length;
              const completedCount = allChapters.filter(ch => ch.completed || ch.status === 'COMPLETED').length;
              const inProgressCount = allChapters.filter(ch => ch.status === 'IN PROGRESS').length;
              const remainingCount = Math.max(0, count - completedCount);
              const pct = count > 0 ? Math.round((completedCount / count) * 100) : 0;

              return (
                <div
                  key={subj.id}
                  onClick={() => {
                    setSelectedSubjectId(subj.id);
                    if (subj.papers && subj.papers[0]) {
                      setSelectedPaperId(subj.papers[0].id);
                    }
                  }}
                  className={`
                    p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative group
                    ${isSelected 
                      ? 'bg-white border-[#3B302A] ring-2 ring-[#3B302A]/20 shadow-md' 
                      : 'bg-white/80 border-[#D8C5AE]/60 hover:bg-white hover:border-[#59483D]/60 shadow-2xs'}
                  `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border
                        ${isSelected ? 'bg-[#EFE7DC] border-[#D8C5AE]' : 'bg-[#F8F6F2] border-[#D8C5AE]/40'}
                      `}>
                        {getSubjectIcon(subj.name)}
                      </div>

                      <div className="min-w-0">
                        {editingSubjectId === subj.id ? (
                          <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editingSubjectName}
                              onChange={e => setEditingSubjectName(e.target.value)}
                              className="px-2 py-0.5 text-sm font-bold bg-[#F8F6F2] border border-[#3B302A] rounded text-[#292724] focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                if (editingSubjectName.trim()) {
                                  renameSubject(subj.id, editingSubjectName.trim());
                                }
                                setEditingSubjectId(null);
                              }}
                              className="p-1 rounded bg-[#3B302A] text-white"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setEditingSubjectId(null)}
                              className="p-1 rounded bg-[#EFE7DC] text-[#59483D]"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-[#292724] truncate">
                              {subj.name}
                            </h3>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingSubjectId(subj.id);
                                setEditingSubjectName(subj.name);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-[#A99A8C] hover:text-[#3B302A] transition-opacity"
                              title="Rename Subject"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-[#59483D]">
                          <span>{completedCount}/{count} Chapters</span>
                          <span>•</span>
                          <span>{remainingCount} Remaining</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-bold font-mono text-[#292724]">
                        {pct}%
                      </div>
                      <span className={`
                        text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded
                        ${pct === 100 
                          ? 'bg-[#59483D] text-white' 
                          : pct > 0 
                            ? 'bg-[#EFE7DC] text-[#3B302A]' 
                            : 'bg-[#F8F6F2] text-[#A99A8C]'}
                      `}>
                        {pct === 100 ? 'Mastered' : pct > 0 ? 'Active' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div className="mt-3.5 space-y-1">
                    <div className="w-full h-2 bg-[#EFE7DC] rounded-full overflow-hidden p-0.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${isSelected ? 'bg-[#3B302A]' : 'bg-[#59483D]'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Sub-sections / Papers Quick Breakdown Badges */}
                  <div className="mt-3 pt-2.5 border-t border-[#EFE7DC] space-y-1.5">
                    <div className="flex flex-wrap gap-1.5">
                      {(subj.papers || []).map((paper) => {
                        const pChs = paper.chapters || [];
                        const pComp = pChs.filter(c => c.completed || c.status === 'COMPLETED').length;
                        const pPct = pChs.length > 0 ? Math.round((pComp / pChs.length) * 100) : 0;
                        return (
                          <div 
                            key={paper.id}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F8F6F2] border border-[#D8C5AE]/40 text-[10px] font-mono text-[#59483D]"
                          >
                            <span className="font-semibold">{paper.name}:</span>
                            <span className="text-[#292724] font-bold">{pComp}/{pChs.length} ({pPct}%)</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-[#A99A8C]">
                      <span>{subj.papers?.length || 1} Sub-sections</span>
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => reorderSubject(subj.id, 'up')}
                          className="p-1 text-[#A99A8C] hover:text-[#292724] rounded hover:bg-[#EFE7DC]"
                          title="Move Up"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => reorderSubject(subj.id, 'down')}
                          className="p-1 text-[#A99A8C] hover:text-[#292724] rounded hover:bg-[#EFE7DC]"
                          title="Move Down"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${subj.name}" and all its papers/chapters?`)) {
                              deleteSubject(subj.id);
                            }
                          }}
                          className="p-1 text-[#A99A8C] hover:text-red-700 rounded hover:bg-red-50"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column (7 cols): Sub-sections (Papers) Tabs & Dedicated Chapter Manager */}
        <div className="lg:col-span-7 space-y-6">
          {activeSubject ? (
            <div className="bg-white rounded-2xl border border-[#D8C5AE]/80 p-5 sm:p-7 shadow-xs space-y-6">
              
              {/* Subject Title & Sub-sections Bar */}
              <div className="space-y-4 pb-5 border-b border-[#EFE7DC]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                      ACTIVE CURRICULUM SUBJECT
                    </span>
                    <h2 className="text-2xl font-bold font-serif text-[#292724] mt-0.5">
                      {activeSubject.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-[#EFE7DC] text-[#3B302A] px-2.5 py-1 rounded-full border border-[#D8C5AE]/60">
                      {activeSubject.completedChapters}/{activeSubject.totalChapters} Total Chapters Mastered
                    </span>
                  </div>
                </div>

                {/* Sub-section / Paper Tabs */}
                <div className="bg-[#F8F6F2] p-1.5 rounded-xl border border-[#D8C5AE]/60 flex flex-wrap items-center gap-1.5">
                  {(activeSubject.papers || []).map((paper) => {
                    const isPaperActive = activePaper?.id === paper.id;
                    const pChs = paper.chapters || [];
                    const pComp = pChs.filter(c => c.completed || c.status === 'COMPLETED').length;
                    const pPct = pChs.length > 0 ? Math.round((pComp / pChs.length) * 100) : 0;

                    return (
                      <button
                        key={paper.id}
                        onClick={() => setSelectedPaperId(paper.id)}
                        className={`
                          flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer
                          ${isPaperActive 
                            ? 'bg-[#3B302A] text-white shadow-xs' 
                            : 'bg-white/80 text-[#59483D] hover:bg-white hover:text-[#292724] border border-[#D8C5AE]/40'}
                        `}
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>{paper.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded ${isPaperActive ? 'bg-[#59483D] text-white' : 'bg-[#EFE7DC] text-[#3B302A]'}`}>
                          {pComp}/{pChs.length} ({pPct}%)
                        </span>
                      </button>
                    );
                  })}

                  {/* Add Paper Control */}
                  {isAddingPaper ? (
                    <div className="flex items-center gap-1.5 pl-1">
                      <input
                        type="text"
                        placeholder="Paper Name..."
                        value={newPaperTitle}
                        onChange={(e) => setNewPaperTitle(e.target.value)}
                        className="px-2 py-1 text-xs font-mono bg-white border border-[#3B302A] rounded text-[#292724] focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={handleAddPaper}
                        className="p-1 rounded bg-[#3B302A] text-white"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setIsAddingPaper(false)}
                        className="p-1 rounded bg-[#EFE7DC] text-[#59483D]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingPaper(true)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-[#59483D] hover:bg-[#EFE7DC] flex items-center gap-1 border border-dashed border-[#D8C5AE]"
                      title="Add another Paper / Sub-section"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Sub-section</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Active Paper Workspace Details */}
              {activePaper ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8F6F2] p-3.5 rounded-xl border border-[#D8C5AE]/60">
                    <div className="min-w-0">
                      {editingPaperId === activePaper.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editingPaperName}
                            onChange={(e) => setEditingPaperName(e.target.value)}
                            className="px-2 py-0.5 text-xs font-bold font-mono bg-white border border-[#3B302A] rounded text-[#292724] focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              if (editingPaperName.trim()) {
                                renamePaper(activeSubject.id, activePaper.id, editingPaperName.trim());
                              }
                              setEditingPaperId(null);
                            }}
                            className="p-1 rounded bg-[#3B302A] text-white"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setEditingPaperId(null)}
                            className="p-1 rounded bg-[#EFE7DC] text-[#59483D]"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold font-mono text-[#292724]">
                            {activePaper.name}
                          </h3>
                          <button
                            onClick={() => {
                              setEditingPaperId(activePaper.id);
                              setEditingPaperName(activePaper.name);
                            }}
                            className="text-[#A99A8C] hover:text-[#3B302A]"
                            title="Rename this paper"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <p className="text-[11px] font-mono text-[#59483D] mt-0.5">
                        {activePaper.completedChapters} of {activePaper.chapters.length} chapters completed in this sub-section
                      </p>
                    </div>

                    {/* Bulk Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setAllChaptersInPaper(activeSubject.id, activePaper.id, true)}
                        className="px-2.5 py-1 text-xs font-mono font-semibold text-[#3B302A] bg-white border border-[#D8C5AE] rounded-lg hover:bg-[#EFE7DC] transition-colors flex items-center gap-1"
                      >
                        <CheckCheck className="w-3 h-3 text-[#3B302A]" />
                        <span>Done All</span>
                      </button>

                      <button
                        onClick={() => setAllChaptersInPaper(activeSubject.id, activePaper.id, false)}
                        className="px-2.5 py-1 text-xs font-mono font-semibold text-[#A99A8C] bg-white border border-[#D8C5AE]/50 rounded-lg hover:bg-[#EFE7DC] transition-colors"
                      >
                        Reset
                      </button>

                      {activeSubject.papers.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete sub-section "${activePaper.name}" and its chapters?`)) {
                              deletePaper(activeSubject.id, activePaper.id);
                            }
                          }}
                          className="p-1 text-[#A99A8C] hover:text-red-700 rounded hover:bg-red-50 ml-1"
                          title="Delete Paper"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Add New Chapter to this Paper */}
                  <form onSubmit={handleAddChapter} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Add new chapter to ${activePaper.name}...`}
                      value={newChapterName}
                      onChange={(e) => setNewChapterName(e.target.value)}
                      className="flex-1 px-4 py-2 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE]/70 rounded-xl text-[#292724] placeholder-[#A99A8C] focus:outline-none focus:ring-1 focus:ring-[#3B302A]"
                    />
                    <button
                      type="submit"
                      disabled={!newChapterName.trim()}
                      className="px-4 py-2 text-xs font-mono font-bold text-white bg-[#3B302A] hover:bg-[#59483D] disabled:opacity-40 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Chapter</span>
                    </button>
                  </form>

                  {/* Chapters List */}
                  <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                    {activePaper.chapters.length === 0 ? (
                      <div className="py-12 text-center border-2 border-dashed border-[#D8C5AE]/60 rounded-xl bg-[#F8F6F2]/50 p-6 space-y-2">
                        <BookOpen className="w-8 h-8 text-[#A99A8C] mx-auto opacity-50" />
                        <p className="text-sm font-semibold text-[#292724]">No chapters in {activePaper.name} yet</p>
                        <p className="text-xs text-[#59483D] font-mono">
                          Use the input above to add your syllabus chapters.
                        </p>
                      </div>
                    ) : (
                      activePaper.chapters.map((ch, idx) => {
                        const isCompleted = ch.status === 'COMPLETED' || ch.completed;
                        const isInProgress = ch.status === 'IN PROGRESS';
                        const isNotesExpanded = expandedNotesChapterId === ch.id;

                        return (
                          <div
                            key={ch.id}
                            className={`
                              p-3.5 sm:p-4 rounded-xl border transition-all
                              ${isCompleted 
                                ? 'bg-[#EFE7DC]/40 border-[#D8C5AE]' 
                                : isInProgress 
                                  ? 'bg-[#F8F6F2] border-[#D8C5AE]/90 ring-1 ring-[#D8C5AE]/50' 
                                  : 'bg-white border-[#D8C5AE]/50 hover:border-[#D8C5AE]'}
                            `}
                          >
                            <div className="flex items-start justify-between gap-3">
                              
                              <div className="flex items-start gap-3 min-w-0 flex-1">
                                <button
                                  type="button"
                                  onClick={() => toggleChapterInPaper(activeSubject.id, activePaper.id, ch.id)}
                                  className="mt-0.5 cursor-pointer text-[#3B302A] hover:opacity-80 transition-opacity"
                                  title="Toggle completion"
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-[#3B302A] fill-[#EFE7DC]" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-[#A99A8C] hover:text-[#59483D]" />
                                  )}
                                </button>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold text-[#A99A8C]">
                                      CH {String(ch.chapterNumber || idx + 1).padStart(2, '0')}
                                    </span>
                                    
                                    <button
                                      type="button"
                                      onClick={() => cycleChapterStatus(ch)}
                                      className={`
                                        px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded cursor-pointer transition-colors border
                                        ${isCompleted 
                                          ? 'bg-[#3B302A] text-white border-[#3B302A]' 
                                          : isInProgress 
                                            ? 'bg-[#D8C5AE] text-[#292724] border-[#D8C5AE]' 
                                            : 'bg-[#F8F6F2] text-[#A99A8C] border-[#D8C5AE]/50'}
                                      `}
                                      title="Click to cycle status: NOT STARTED → IN PROGRESS → COMPLETED"
                                    >
                                      {isCompleted ? 'COMPLETED' : isInProgress ? 'IN PROGRESS' : 'NOT STARTED'}
                                    </button>

                                    {ch.completionDate && (
                                      <span className="text-[10px] font-mono text-[#59483D] hidden sm:inline-flex items-center gap-1">
                                        <Clock className="w-2.5 h-2.5" />
                                        {ch.completionDate}
                                      </span>
                                    )}
                                  </div>

                                  {editingChapterId === ch.id ? (
                                    <div className="flex items-center gap-1.5 mt-1">
                                      <input
                                        type="text"
                                        value={editingChapterName}
                                        onChange={(e) => setEditingChapterName(e.target.value)}
                                        className="px-2 py-1 text-xs font-mono bg-[#F8F6F2] border border-[#3B302A] rounded text-[#292724] w-full focus:outline-none"
                                        autoFocus
                                      />
                                      <button
                                        onClick={() => {
                                          if (editingChapterName.trim()) {
                                            renameChapterInPaper(activeSubject.id, activePaper.id, ch.id, editingChapterName.trim());
                                          }
                                          setEditingChapterId(null);
                                        }}
                                        className="p-1 rounded bg-[#3B302A] text-white"
                                      >
                                        <Check className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => setEditingChapterId(null)}
                                        className="p-1 rounded bg-[#EFE7DC] text-[#59483D]"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <p className={`text-sm mt-1 font-semibold leading-snug ${isCompleted ? 'text-[#59483D] line-through' : 'text-[#292724]'}`}>
                                      {ch.name}
                                    </p>
                                  )}

                                  {ch.notes && !isNotesExpanded && (
                                    <p className="text-[11px] text-[#59483D] italic mt-1 line-clamp-1">
                                      Note: {ch.notes}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => setExpandedNotesChapterId(isNotesExpanded ? null : ch.id)}
                                  className={`p-1.5 rounded transition-colors text-xs font-mono ${isNotesExpanded ? 'bg-[#3B302A] text-white' : 'text-[#A99A8C] hover:text-[#292724] hover:bg-[#EFE7DC]'}`}
                                  title="Notes & Date details"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => reorderChapterInPaper(activeSubject.id, activePaper.id, ch.id, 'up')}
                                  className="p-1 text-[#A99A8C] hover:text-[#292724] rounded hover:bg-[#EFE7DC]"
                                  title="Move Up"
                                >
                                  <MoveUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => reorderChapterInPaper(activeSubject.id, activePaper.id, ch.id, 'down')}
                                  className="p-1 text-[#A99A8C] hover:text-[#292724] rounded hover:bg-[#EFE7DC]"
                                  title="Move Down"
                                >
                                  <MoveDown className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => deleteChapterFromPaper(activeSubject.id, activePaper.id, ch.id)}
                                  className="p-1 text-[#A99A8C] hover:text-red-700 rounded hover:bg-red-50"
                                  title="Delete Chapter"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Expanded Details Form */}
                            {isNotesExpanded && (
                              <div className="mt-3 pt-3 border-t border-[#D8C5AE]/60 space-y-3 bg-[#F8F6F2]/70 p-3 rounded-lg">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#59483D] block mb-1">
                                      Completion Date
                                    </label>
                                    <input
                                      type="date"
                                      value={ch.completionDate || ''}
                                      onChange={(e) => updateChapterDetailsInPaper(activeSubject.id, activePaper.id, ch.id, { completionDate: e.target.value })}
                                      className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-[#D8C5AE] rounded-md text-[#292724] focus:outline-none"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#59483D] block mb-1">
                                      Status State
                                    </label>
                                    <select
                                      value={ch.status}
                                      onChange={(e) => {
                                        const next = e.target.value as ChapterStatus;
                                        updateChapterDetailsInPaper(activeSubject.id, activePaper.id, ch.id, {
                                          status: next,
                                          completed: next === 'COMPLETED'
                                        });
                                      }}
                                      className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-[#D8C5AE] rounded-md text-[#292724] focus:outline-none"
                                    >
                                      <option value="NOT STARTED">NOT STARTED (Muted Grey)</option>
                                      <option value="IN PROGRESS">IN PROGRESS (Warm Beige)</option>
                                      <option value="COMPLETED">COMPLETED (Deep Brown)</option>
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#59483D] block mb-1">
                                    Personal Notes & Key Formulas
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={ch.notes || ''}
                                    onChange={(e) => updateChapterDetailsInPaper(activeSubject.id, activePaper.id, ch.id, { notes: e.target.value })}
                                    placeholder="Add revision notes, formulas or weak subtopics..."
                                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D8C5AE] rounded-md text-[#292724] focus:outline-none"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#D8C5AE]/70 p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-[#A99A8C] mx-auto opacity-40" />
              <h3 className="text-lg font-bold text-[#292724]">No Subject Selected</h3>
              <p className="text-xs text-[#59483D] font-mono">Select a subject from the left column to view its sub-sections.</p>
            </div>
          )}
        </div>
      </div>

      {/* 5. VISUAL ANALYTICS: TWO ANALYTICS CHARTS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#59483D]" />
          <h2 className="text-lg font-bold font-serif text-[#292724]">
            SYLLABUS ANALYTICS & BREAKDOWN
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Chart 1: SUBJECT & PAPER COMPLETION COMPARISON */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#D8C5AE]/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EFE7DC]">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                    COMPARATIVE BENCHMARK
                  </span>
                  <h3 className="text-base font-bold text-[#292724] mt-0.5">
                    SUBJECT & SUB-SECTION PROGRESS
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold text-[#A99A8C]">
                  0–100% Scale
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {subjects.map(s => {
                  const count = s.totalChapters;
                  const completed = s.completedChapters;
                  const pct = count > 0 ? Math.round((completed / count) * 100) : 0;

                  return (
                    <div key={s.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-semibold text-[#292724] w-36 truncate">
                          {s.name}
                        </span>
                        <div className="flex items-center gap-2 text-[#59483D]">
                          <span>{completed}/{count} Ch</span>
                          <span className="font-bold text-[#292724] w-12 text-right">{pct}%</span>
                        </div>
                      </div>

                      <div className="w-full h-3 bg-[#EFE7DC] rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: pct >= 80 ? '#3B302A' : pct >= 40 ? '#59483D' : '#D8C5AE'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[#EFE7DC] flex justify-between text-[10px] font-mono text-[#A99A8C]">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Chart 2: CHAPTER COMPLETION DISTRIBUTION */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#D8C5AE]/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EFE7DC]">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                    SYLLABUS COMPOSITION
                  </span>
                  <h3 className="text-base font-bold text-[#292724] mt-0.5">
                    CHAPTER DISTRIBUTION
                  </h3>
                </div>
                <PieChart className="w-4 h-4 text-[#59483D]" />
              </div>

              <div className="py-6 flex flex-col items-center justify-center">
                {(() => {
                  const total = overallStats.totalChapters || 1;
                  const cDone = overallStats.completedChapters;
                  const cProg = overallStats.inProgressChapters;
                  const cNot = overallStats.notStartedChapters;

                  const C = 439.82;
                  const strokeWidth = 24;
                  
                  const pDone = cDone / total;
                  const pProg = cProg / total;
                  const pNot = cNot / total;

                  const dashDone = pDone * C;
                  const dashProg = pProg * C;
                  const dashNot = pNot * C;

                  const offsetProg = -(dashDone);
                  const offsetNot = -(dashDone + dashProg);

                  return (
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
                        <circle
                          cx="90"
                          cy="90"
                          r="70"
                          stroke="#EFE7DC"
                          strokeWidth={strokeWidth}
                          fill="none"
                        />
                        {cDone > 0 && (
                          <circle
                            cx="90"
                            cy="90"
                            r="70"
                            stroke="#59483D"
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={`${dashDone} ${C}`}
                            strokeDashoffset={0}
                            className="transition-all duration-700 ease-out"
                          />
                        )}
                        {cProg > 0 && (
                          <circle
                            cx="90"
                            cy="90"
                            r="70"
                            stroke="#D8C5AE"
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={`${dashProg} ${C}`}
                            strokeDashoffset={offsetProg}
                            className="transition-all duration-700 ease-out"
                          />
                        )}
                        {cNot > 0 && (
                          <circle
                            cx="90"
                            cy="90"
                            r="70"
                            stroke="#A99A8C"
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={`${dashNot} ${C}`}
                            strokeDashoffset={offsetNot}
                            className="transition-all duration-700 ease-out"
                          />
                        )}
                      </svg>

                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-extrabold font-mono text-[#292724]">
                          {overallStats.overallPercentage}%
                        </span>
                        <span className="text-[10px] font-mono uppercase text-[#A99A8C]">
                          Mastery
                        </span>
                        <span className="text-[10px] font-mono text-[#59483D]">
                          {overallStats.completedChapters}/{overallStats.totalChapters} Ch
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-[#EFE7DC] pt-4 text-center">
                <div className="bg-[#F8F6F2] p-2 rounded-lg border border-[#D8C5AE]/40">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#59483D]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#59483D]" />
                    <span>Done</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-[#292724] mt-0.5">
                    {overallStats.completedChapters}
                  </div>
                </div>

                <div className="bg-[#F8F6F2] p-2 rounded-lg border border-[#D8C5AE]/40">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#59483D]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D8C5AE]" />
                    <span>Progress</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-[#292724] mt-0.5">
                    {overallStats.inProgressChapters}
                  </div>
                </div>

                <div className="bg-[#F8F6F2] p-2 rounded-lg border border-[#D8C5AE]/40">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#59483D]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A99A8C]" />
                    <span>Pending</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-[#292724] mt-0.5">
                    {overallStats.notStartedChapters}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-[10px] font-mono text-[#A99A8C]">
                Calculated live across all subjects and sub-sections
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. MODAL: ADD NEW SUBJECT */}
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div 
            className="bg-white w-full max-w-md rounded-2xl border border-[#D8C5AE] shadow-xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DC]">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                  CURRICULUM CONFIGURATION
                </span>
                <h3 className="text-lg font-bold text-[#292724] mt-0.5">
                  Add New Subject
                </h3>
              </div>
              <button
                onClick={() => setIsAddSubjectModalOpen(false)}
                className="p-1.5 text-[#A99A8C] hover:text-[#292724] rounded-lg hover:bg-[#F8F6F2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Higher Mathematics, English Literature..."
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-lg text-[#292724] focus:outline-none focus:ring-1 focus:ring-[#3B302A]"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasPapersCheck"
                  checked={newSubjectHasPapers}
                  onChange={(e) => setNewSubjectHasPapers(e.target.checked)}
                  className="rounded text-[#3B302A]"
                />
                <label htmlFor="hasPapersCheck" className="text-xs font-mono text-[#59483D] cursor-pointer">
                  Includes 2 Sub-sections (1st Paper & 2nd Paper)
                </label>
              </div>

              <div className="text-[11px] font-mono text-[#A99A8C]">
                Uncheck if this is a single-paper subject like ICT.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EFE7DC]">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-mono text-[#59483D] hover:bg-[#EFE7DC] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newSubjectName.trim()}
                  className="px-4 py-1.5 text-xs font-mono font-bold text-white bg-[#3B302A] hover:bg-[#59483D] disabled:opacity-40 rounded-lg cursor-pointer"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
