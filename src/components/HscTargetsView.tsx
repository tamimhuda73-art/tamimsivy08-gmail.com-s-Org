import React, { useState, useMemo } from 'react';
import { 
  CalendarRange, 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  Layers, 
  Sparkles, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  RotateCcw, 
  ArrowRight, 
  FileSpreadsheet, 
  MoveRight, 
  AlertCircle,
  BookmarkCheck,
  CheckCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { MonthlyAssignment, RevisionChapterRecord } from '../types/tracker';
import { MONTH_SECTIONS } from '../data/hscTargetsData';

export const HscTargetsView: React.FC = () => {
  const { 
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
    user
  } = useTracker();

  // Active Month Tab: 'nov-2026' | 'dec-2026' | 'jan-2027' | 'feb-2027' | 'mar-2027' | 'rev-2027'
  const [activeMonthKey, setActiveMonthKey] = useState<string>('nov-2026');

  // Admin Edit Roadmap Mode toggle
  const [isAdminEditMode, setIsAdminEditMode] = useState<boolean>(false);

  // Reset confirmation modal
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  // New assignment modal / form state
  const [isAddAssignmentModalOpen, setIsAddAssignmentModalOpen] = useState<boolean>(false);
  const [newAsgMonthKey, setNewAsgMonthKey] = useState<string>('nov-2026');
  const [newAsgSubjectKey, setNewAsgSubjectKey] = useState<string>('Physics 1');
  const [newAsgChapterNum, setNewAsgChapterNum] = useState<number>(1);
  const [newAsgChapterName, setNewAsgChapterName] = useState<string>('');

  // Move assignment modal state
  const [movingAssignment, setMovingAssignment] = useState<MonthlyAssignment | null>(null);
  const [targetMoveMonthKey, setTargetMoveMonthKey] = useState<string>('dec-2026');

  // Inline editing of chapter names
  const [editingAsgId, setEditingAsgId] = useState<string | null>(null);
  const [editingChapterName, setEditingChapterName] = useState<string>('');

  // Expandable notes state
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);
  const [expandedRevisionNotesId, setExpandedRevisionNotesId] = useState<string | null>(null);

  // Overall Statistics across all 79 assignments
  const overallStats = useMemo(() => {
    const totalAssignments = monthlyAssignments.length;
    const completedAssignments = monthlyAssignments.filter(a => a.completed || a.status === 'COMPLETED').length;
    const inProgressAssignments = monthlyAssignments.filter(a => a.status === 'IN PROGRESS').length;
    const remainingAssignments = Math.max(0, totalAssignments - completedAssignments);
    const overallPercentage = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

    // Revision statistics (April–May)
    const totalRevisionChapters = revisionRecords.length;
    const completedRevision = revisionRecords.filter(r => r.revisionCompleted).length;
    const revisionPercentage = totalRevisionChapters > 0 ? Math.round((completedRevision / totalRevisionChapters) * 100) : 0;

    return {
      totalAssignments,
      completedAssignments,
      inProgressAssignments,
      remainingAssignments,
      overallPercentage,
      totalRevisionChapters,
      completedRevision,
      revisionPercentage
    };
  }, [monthlyAssignments, revisionRecords]);

  // Per-Month statistics helper
  const monthStatsMap = useMemo(() => {
    const map: Record<string, { total: number; completed: number; inProgress: number; percentage: number }> = {};
    MONTH_SECTIONS.forEach(ms => {
      if (ms.key === 'rev-2027') {
        const total = revisionRecords.length;
        const comp = revisionRecords.filter(r => r.revisionCompleted).length;
        map[ms.key] = {
          total,
          completed: comp,
          inProgress: 0,
          percentage: total > 0 ? Math.round((comp / total) * 100) : 0
        };
      } else {
        const asgs = monthlyAssignments.filter(a => a.monthKey === ms.key);
        const comp = asgs.filter(a => a.completed || a.status === 'COMPLETED').length;
        const inProg = asgs.filter(a => a.status === 'IN PROGRESS').length;
        map[ms.key] = {
          total: asgs.length,
          completed: comp,
          inProgress: inProg,
          percentage: asgs.length > 0 ? Math.round((comp / asgs.length) * 100) : 0
        };
      }
    });
    return map;
  }, [monthlyAssignments, revisionRecords]);

  // Current month active assignments grouped by Subject
  const currentMonthGrouped = useMemo(() => {
    const asgs = monthlyAssignments.filter(a => a.monthKey === activeMonthKey);
    const groups: Record<string, MonthlyAssignment[]> = {};
    asgs.forEach(a => {
      if (!groups[a.subjectKey]) groups[a.subjectKey] = [];
      groups[a.subjectKey].push(a);
    });
    return groups;
  }, [monthlyAssignments, activeMonthKey]);

  // Revision unique chapters grouped by Subject
  const revisionGrouped = useMemo(() => {
    const groups: Record<string, RevisionChapterRecord[]> = {};
    revisionRecords.forEach(r => {
      if (!groups[r.subjectKey]) groups[r.subjectKey] = [];
      groups[r.subjectKey].push(r);
    });
    return groups;
  }, [revisionRecords]);

  // Subject-wise comparative progress for Chart B
  const subjectProgressComparison = useMemo(() => {
    const map: Record<string, { total: number; completed: number }> = {};
    monthlyAssignments.forEach(a => {
      if (!map[a.subjectKey]) map[a.subjectKey] = { total: 0, completed: 0 };
      map[a.subjectKey].total++;
      if (a.completed || a.status === 'COMPLETED') map[a.subjectKey].completed++;
    });

    return Object.entries(map).map(([subjectKey, data]) => ({
      subjectKey,
      total: data.total,
      completed: data.completed,
      percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
    })).sort((a, b) => b.total - a.total);
  }, [monthlyAssignments]);

  // Handle adding new custom assignment
  const handleAddAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgChapterName.trim()) return;

    const monthName = MONTH_SECTIONS.find(m => m.key === newAsgMonthKey)?.name || 'Custom Month';

    addMonthlyAssignment({
      monthKey: newAsgMonthKey,
      monthName,
      subjectKey: newAsgSubjectKey,
      chapterNumber: Number(newAsgChapterNum) || 1,
      chapterName: newAsgChapterName.trim(),
      status: 'NOT STARTED',
      completed: false
    });

    setNewAsgChapterName('');
    setIsAddAssignmentModalOpen(false);
  };

  // Handle moving assignment between months
  const handleMoveSubmit = () => {
    if (!movingAssignment) return;
    const targetMonth = MONTH_SECTIONS.find(m => m.key === targetMoveMonthKey);
    if (!targetMonth) return;

    moveMonthlyAssignment(movingAssignment.id, targetMonth.key, targetMonth.name);
    setMovingAssignment(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1520px] mx-auto space-y-8 bg-[#F8F6F2] min-h-screen">
      
      {/* 1. MAIN HEADER & PROGRESSION BANNER */}
      <div className="bg-white rounded-2xl border border-[#D8C5AE]/60 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#EFE7DC]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#59483D]" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                EXACT SYLLABUS EXECUTION BLUEPRINT
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#292724] font-serif">
              HSC 2027 — MONTHLY STUDY TARGET
            </h1>
            
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#59483D] font-mono">
              79 CHAPTER ASSIGNMENTS. ONE MISSION. GPA 5.00.
            </p>
          </div>

          {/* Admin Control Bar */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            <button
              onClick={() => setIsAdminEditMode(prev => !prev)}
              className={`px-3.5 py-2 text-xs font-mono font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isAdminEditMode 
                  ? 'bg-[#3B302A] text-white border-[#3B302A]' 
                  : 'bg-white text-[#59483D] border-[#D8C5AE] hover:bg-[#EFE7DC]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isAdminEditMode ? 'Exit Admin Mode' : 'Edit Roadmap'}</span>
            </button>

            {isAdminEditMode && (
              <button
                onClick={() => setIsAddAssignmentModalOpen(true)}
                className="px-3.5 py-2 text-xs font-mono font-bold bg-[#59483D] text-white rounded-xl hover:bg-[#3B302A] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Target</span>
              </button>
            )}

            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="p-2 text-[#A99A8C] hover:text-red-700 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
              title="Reset Roadmap to Default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-[#F8F6F2] border border-[#D8C5AE]/60 rounded-xl p-3.5 text-center">
            <span className="text-[10px] font-mono uppercase text-[#A99A8C] tracking-wider block">
              Total Assignments
            </span>
            <span className="text-2xl font-black font-mono text-[#292724]">
              {overallStats.totalAssignments}
            </span>
            <span className="text-[10px] font-mono text-[#59483D] block mt-0.5">
              Across 5 Months
            </span>
          </div>

          <div className="bg-[#F8F6F2] border border-[#D8C5AE]/60 rounded-xl p-3.5 text-center">
            <span className="text-[10px] font-mono uppercase text-[#A99A8C] tracking-wider block">
              Completed
            </span>
            <span className="text-2xl font-black font-mono text-[#3B302A]">
              {overallStats.completedAssignments}
            </span>
            <span className="text-[10px] font-mono text-[#59483D] block mt-0.5">
              Verified Mastered
            </span>
          </div>

          <div className="bg-[#F8F6F2] border border-[#D8C5AE]/60 rounded-xl p-3.5 text-center">
            <span className="text-[10px] font-mono uppercase text-[#A99A8C] tracking-wider block">
              Remaining
            </span>
            <span className="text-2xl font-black font-mono text-[#59483D]">
              {overallStats.remainingAssignments}
            </span>
            <span className="text-[10px] font-mono text-[#A99A8C] block mt-0.5">
              Pending Chapters
            </span>
          </div>

          <div className="bg-[#F8F6F2] border border-[#D8C5AE]/60 rounded-xl p-3.5 text-center">
            <span className="text-[10px] font-mono uppercase text-[#A99A8C] tracking-wider block">
              Roadmap Progress
            </span>
            <span className="text-2xl font-black font-mono text-[#292724]">
              {overallStats.overallPercentage}%
            </span>
            <span className="text-[10px] font-mono text-[#59483D] block mt-0.5">
              Target: 100%
            </span>
          </div>

          <div className="bg-[#F8F6F2] border border-[#D8C5AE]/60 rounded-xl p-3.5 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono uppercase text-[#A99A8C] tracking-wider block">
              Full Revision (Apr–May)
            </span>
            <span className="text-2xl font-black font-mono text-[#59483D]">
              {overallStats.revisionPercentage}%
            </span>
            <span className="text-[10px] font-mono text-[#A99A8C] block mt-0.5">
              {overallStats.completedRevision}/{overallStats.totalRevisionChapters} Ch
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#59483D] font-bold flex items-center gap-1.5">
              <BookmarkCheck className="w-4 h-4 text-[#3B302A]" />
              SYLLABUS ASSIGNMENT COMPLETION PROGRESSION
            </span>
            <span className="text-[#292724] font-bold">
              {overallStats.completedAssignments} / {overallStats.totalAssignments} ({overallStats.overallPercentage}%)
            </span>
          </div>
          <div className="w-full h-3 bg-[#EFE7DC] rounded-full overflow-hidden p-0.5 border border-[#D8C5AE]/60">
            <div 
              className="h-full bg-gradient-to-r from-[#59483D] to-[#3B302A] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallStats.overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. MONTHLY TIMELINE / NAVIGATION CARDS (6 SECTIONS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#59483D]">
            6-PHASE HSC 2027 ROADMAP TIMELINE
          </span>
          <span className="text-[10px] font-mono text-[#A99A8C]">
            Select phase to inspect & update chapter tasks
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {MONTH_SECTIONS.map((ms) => {
            const isSelected = activeMonthKey === ms.key;
            const stats = monthStatsMap[ms.key] || { total: ms.targetCount, completed: 0, percentage: 0 };
            const isCurrentMonthHighlight = ms.key === 'nov-2026';

            return (
              <button
                key={ms.key}
                onClick={() => setActiveMonthKey(ms.key)}
                className={`
                  p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between min-h-[120px]
                  ${isSelected 
                    ? 'bg-[#3B302A] text-white border-[#3B302A] shadow-md ring-2 ring-[#3B302A]/20' 
                    : isCurrentMonthHighlight
                      ? 'bg-white border-[#59483D] text-[#292724] hover:bg-[#F8F6F2] shadow-xs'
                      : 'bg-white/80 border-[#D8C5AE]/70 text-[#292724] hover:bg-white'}
                `}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isSelected ? 'text-[#D8C5AE]' : 'text-[#59483D]'}`}>
                      {ms.key === 'rev-2027' ? 'FINAL PHASE' : 'PHASE'}
                    </span>
                    {isCurrentMonthHighlight && !isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" title="Current Month" />
                    )}
                  </div>
                  
                  <h3 className={`text-sm font-bold font-serif mt-0.5 leading-tight ${isSelected ? 'text-white' : 'text-[#292724]'}`}>
                    {ms.name}
                  </h3>
                </div>

                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className={isSelected ? 'text-[#D8C5AE]' : 'text-[#59483D]'}>
                      {stats.completed}/{stats.total} Ch
                    </span>
                    <span className={`font-bold ${isSelected ? 'text-white' : 'text-[#292724]'}`}>
                      {stats.percentage}%
                    </span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isSelected ? 'bg-white/20' : 'bg-[#EFE7DC]'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${isSelected ? 'bg-[#D8C5AE]' : 'bg-[#3B302A]'}`}
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE MONTH TARGET WORKSPACE OR APRIL–MAY REVISION TRACKER */}
      {activeMonthKey === 'rev-2027' ? (
        /* ==================================================== */
        /* APRIL–MAY 2027 — DEDICATED FULL SYLLABUS REVISION    */
        /* ==================================================== */
        <div className="bg-white rounded-2xl border border-[#D8C5AE]/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EFE7DC]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#59483D]" />
                <span className="text-[11px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                  DEDICATED REVISION SYSTEM (APRIL–MAY 2027)
                </span>
              </div>
              <h2 className="text-2xl font-bold font-serif text-[#292724] mt-0.5">
                Full Syllabus Board CQ & MCQ Revision
              </h2>
              <p className="text-xs font-mono text-[#59483D] mt-0.5">
                Every unique chapter assigned across the November–March roadmap. Tracked completely independently.
              </p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black font-mono text-[#3B302A]">
                {overallStats.completedRevision} / {overallStats.totalRevisionChapters}
              </span>
              <span className="text-[10px] font-mono text-[#A99A8C] block">
                Unique Chapters Mastered ({overallStats.revisionPercentage}%)
              </span>
            </div>
          </div>

          {/* Grouped by Subject & Paper */}
          <div className="space-y-6">
            {Object.entries(revisionGrouped).map(([subjectKey, recs]) => {
              const compCount = recs.filter(r => r.revisionCompleted).length;
              const pct = Math.round((compCount / recs.length) * 100);

              return (
                <div key={subjectKey} className="border border-[#D8C5AE]/60 rounded-xl overflow-hidden bg-[#F8F6F2]/30">
                  <div className="bg-[#F8F6F2] px-4 py-3 border-b border-[#D8C5AE]/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#59483D]" />
                      <h3 className="text-sm font-bold font-mono text-[#292724] uppercase">
                        {subjectKey}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#3B302A]">
                      {compCount} of {recs.length} Revised ({pct}%)
                    </span>
                  </div>

                  <div className="divide-y divide-[#EFE7DC] bg-white">
                    {recs.map((rec) => {
                      const isNotesOpen = expandedRevisionNotesId === rec.id;

                      return (
                        <div key={rec.id} className="p-3.5 hover:bg-[#F8F6F2]/50 transition-colors">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <button
                                type="button"
                                onClick={() => toggleRevisionRecord(rec.id)}
                                className="cursor-pointer text-[#3B302A] hover:opacity-80"
                                title="Toggle Revision Complete"
                              >
                                {rec.revisionCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-[#3B302A] fill-[#EFE7DC]" />
                                ) : (
                                  <Circle className="w-5 h-5 text-[#A99A8C] hover:text-[#59483D]" />
                                )}
                              </button>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono font-bold text-[#A99A8C]">
                                    CH {String(rec.chapterNumber).padStart(2, '0')}
                                  </span>
                                  <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border ${
                                    rec.revisionCompleted ? 'bg-[#3B302A] text-white border-[#3B302A]' : 'bg-[#F8F6F2] text-[#A99A8C] border-[#D8C5AE]/50'
                                  }`}>
                                    {rec.revisionCompleted ? 'REVISED' : 'PENDING REVISION'}
                                  </span>
                                  {rec.revisionDate && (
                                    <span className="text-[9px] font-mono text-[#59483D] flex items-center gap-1">
                                      <Clock className="w-2.5 h-2.5" />
                                      {rec.revisionDate}
                                    </span>
                                  )}
                                </div>

                                <p className={`text-xs mt-0.5 font-semibold ${rec.revisionCompleted ? 'line-through text-[#A99A8C]' : 'text-[#292724]'}`}>
                                  {rec.chapterName}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => setExpandedRevisionNotesId(isNotesOpen ? null : rec.id)}
                              className={`p-1.5 rounded text-xs font-mono ${isNotesOpen ? 'bg-[#3B302A] text-white' : 'text-[#A99A8C] hover:text-[#292724] hover:bg-[#EFE7DC]'}`}
                              title="Revision Notes"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {isNotesOpen && (
                            <div className="mt-3 pt-3 border-t border-[#D8C5AE]/60 bg-[#F8F6F2]/70 p-3 rounded-lg space-y-2">
                              <label className="text-[10px] font-mono uppercase text-[#59483D] block">
                                Revision Notes & Key CQ Formulas
                              </label>
                              <textarea
                                rows={2}
                                value={rec.notes || ''}
                                onChange={(e) => updateRevisionRecord(rec.id, { notes: e.target.value })}
                                placeholder="Add revision notes, tricky formulas, board CQ shortcuts..."
                                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D8C5AE] rounded-md text-[#292724] focus:outline-none"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ==================================================== */
        /* MONTHLY STUDY TARGET INTERFACE (NOV 2026 – MAR 2027) */
        /* ==================================================== */
        <div className="bg-white rounded-2xl border border-[#D8C5AE]/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EFE7DC]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#59483D]" />
                <span className="text-[11px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                  MONTHLY TARGET EXECUTION
                </span>
              </div>
              <h2 className="text-2xl font-bold font-serif text-[#292724] mt-0.5">
                {MONTH_SECTIONS.find(m => m.key === activeMonthKey)?.name}
              </h2>
              <p className="text-xs font-mono text-[#59483D] mt-0.5">
                {MONTH_SECTIONS.find(m => m.key === activeMonthKey)?.subtext}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-[#3B302A]">
                  {monthStatsMap[activeMonthKey]?.completed || 0} / {monthStatsMap[activeMonthKey]?.total || 0}
                </span>
                <span className="text-[10px] font-mono text-[#A99A8C] block">
                  Assignments Mastered ({monthStatsMap[activeMonthKey]?.percentage || 0}%)
                </span>
              </div>
            </div>
          </div>

          {/* Grouped by Subject & Paper inside the Active Month */}
          <div className="space-y-6">
            {Object.keys(currentMonthGrouped).length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-[#A99A8C] border-2 border-dashed border-[#D8C5AE] rounded-xl">
                No assignments registered in this month. Use "Edit Roadmap" to add chapters.
              </div>
            ) : (
              Object.entries(currentMonthGrouped).map(([subjectKey, asgs]) => {
                const compCount = asgs.filter(a => a.completed || a.status === 'COMPLETED').length;
                const totalCount = asgs.length;
                const pct = totalCount > 0 ? Math.round((compCount / totalCount) * 100) : 0;

                return (
                  <div key={subjectKey} className="border border-[#D8C5AE]/70 rounded-xl overflow-hidden bg-white shadow-2xs">
                    {/* Subject Header inside Month */}
                    <div className="bg-[#F8F6F2] px-4 py-3 border-b border-[#D8C5AE]/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#59483D]" />
                        <h3 className="text-sm font-bold font-mono text-[#292724] uppercase">
                          {subjectKey}
                        </h3>
                        <span className="text-xs font-mono text-[#A99A8C]">
                          — {totalCount} {totalCount === 1 ? 'assignment' : 'assignments'}
                        </span>
                      </div>

                      <div className="text-xs font-mono font-bold text-[#3B302A]">
                        {compCount} / {totalCount} completed ({pct}%)
                      </div>
                    </div>

                    {/* Chapter Rows */}
                    <div className="divide-y divide-[#EFE7DC]">
                      {asgs.map((asg) => {
                        const isDone = asg.completed || asg.status === 'COMPLETED';
                        const isInProg = asg.status === 'IN PROGRESS';
                        const isNotesOpen = expandedNotesId === asg.id;

                        return (
                          <div key={asg.id} className="p-3.5 hover:bg-[#F8F6F2]/40 transition-colors">
                            <div className="flex items-center justify-between gap-3">
                              
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <button
                                  type="button"
                                  onClick={() => toggleMonthlyAssignment(asg.id)}
                                  className="cursor-pointer text-[#3B302A] hover:opacity-80"
                                  title="Toggle Completed"
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="w-5 h-5 text-[#3B302A] fill-[#EFE7DC]" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-[#A99A8C] hover:text-[#59483D]" />
                                  )}
                                </button>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold text-[#A99A8C]">
                                      CH {String(asg.chapterNumber).padStart(2, '0')}
                                    </span>
                                    
                                    {/* 3 Status Selector Pill */}
                                    <button
                                      type="button"
                                      onClick={() => cycleMonthlyAssignmentStatus(asg.id)}
                                      className={`
                                        text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border cursor-pointer transition-colors
                                        ${isDone 
                                          ? 'bg-[#3B302A] text-white border-[#3B302A]' 
                                          : isInProg 
                                            ? 'bg-[#D8C5AE] text-[#292724] border-[#D8C5AE]' 
                                            : 'bg-[#F8F6F2] text-[#A99A8C] border-[#D8C5AE]/50'}
                                      `}
                                      title="Click to cycle: NOT STARTED → IN PROGRESS → COMPLETED"
                                    >
                                      {isDone ? 'COMPLETED' : isInProg ? 'IN PROGRESS' : 'NOT STARTED'}
                                    </button>

                                    {asg.completionDate && (
                                      <span className="text-[9px] font-mono text-[#59483D] flex items-center gap-1">
                                        <Clock className="w-2.5 h-2.5" />
                                        {asg.completionDate}
                                      </span>
                                    )}
                                  </div>

                                  {editingAsgId === asg.id ? (
                                    <div className="flex items-center gap-1.5 mt-1">
                                      <input
                                        type="text"
                                        value={editingChapterName}
                                        onChange={(e) => setEditingChapterName(e.target.value)}
                                        className="px-2 py-0.5 text-xs font-mono bg-[#F8F6F2] border border-[#3B302A] rounded text-[#292724] w-full"
                                        autoFocus
                                      />
                                      <button
                                        onClick={() => {
                                          if (editingChapterName.trim()) {
                                            updateMonthlyAssignment(asg.id, { chapterName: editingChapterName.trim() });
                                          }
                                          setEditingAsgId(null);
                                        }}
                                        className="p-1 rounded bg-[#3B302A] text-white"
                                      >
                                        <Check className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => setEditingAsgId(null)}
                                        className="p-1 rounded bg-[#EFE7DC] text-[#59483D]"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <p className={`text-xs mt-0.5 font-semibold leading-snug ${isDone ? 'line-through text-[#A99A8C]' : 'text-[#292724]'}`}>
                                      {asg.chapterName}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => setExpandedNotesId(isNotesOpen ? null : asg.id)}
                                  className={`p-1.5 rounded text-xs font-mono ${isNotesOpen ? 'bg-[#3B302A] text-white' : 'text-[#A99A8C] hover:text-[#292724] hover:bg-[#EFE7DC]'}`}
                                  title="Notes & Completion Date"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                {isAdminEditMode && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditingAsgId(asg.id);
                                        setEditingChapterName(asg.chapterName);
                                      }}
                                      className="p-1 text-[#A99A8C] hover:text-[#292724] rounded hover:bg-[#EFE7DC]"
                                      title="Rename Chapter"
                                    >
                                      <FileSpreadsheet className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setMovingAssignment(asg);
                                        setTargetMoveMonthKey(asg.monthKey === 'nov-2026' ? 'dec-2026' : 'nov-2026');
                                      }}
                                      className="p-1 text-[#A99A8C] hover:text-[#292724] rounded hover:bg-[#EFE7DC]"
                                      title="Move to another month"
                                    >
                                      <MoveRight className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm(`Delete assignment "${asg.chapterName}"?`)) {
                                          deleteMonthlyAssignment(asg.id);
                                        }
                                      }}
                                      className="p-1 text-[#A99A8C] hover:text-red-700 rounded hover:bg-red-50"
                                      title="Delete Assignment"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Expanded Details / Notes Drawer */}
                            {isNotesOpen && (
                              <div className="mt-3 pt-3 border-t border-[#D8C5AE]/60 bg-[#F8F6F2]/70 p-3 rounded-lg space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[10px] font-mono uppercase text-[#59483D] block mb-1">
                                      Completion Date
                                    </label>
                                    <input
                                      type="date"
                                      value={asg.completionDate || ''}
                                      onChange={(e) => updateMonthlyAssignment(asg.id, { completionDate: e.target.value })}
                                      className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-[#D8C5AE] rounded-md text-[#292724] focus:outline-none"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-mono uppercase text-[#59483D] block mb-1">
                                      Status
                                    </label>
                                    <select
                                      value={asg.status}
                                      onChange={(e) => {
                                        const s = e.target.value as any;
                                        updateMonthlyAssignment(asg.id, { status: s, completed: s === 'COMPLETED' });
                                      }}
                                      className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-[#D8C5AE] rounded-md text-[#292724] focus:outline-none"
                                    >
                                      <option value="NOT STARTED">NOT STARTED</option>
                                      <option value="IN PROGRESS">IN PROGRESS</option>
                                      <option value="COMPLETED">COMPLETED</option>
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-[10px] font-mono uppercase text-[#59483D] block mb-1">
                                    Personal Study & CQ Mastery Notes
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={asg.notes || ''}
                                    onChange={(e) => updateMonthlyAssignment(asg.id, { notes: e.target.value })}
                                    placeholder="Add chapter specific formulas, question bank targets..."
                                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D8C5AE] rounded-md text-[#292724] focus:outline-none"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 4. INTEGRATED HSC ROADMAP ANALYTICS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#59483D]" />
          <h2 className="text-lg font-bold font-serif text-[#292724]">
            HSC 2027 ROADMAP ANALYTICS
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Chart A: MONTHLY TARGET PROGRESS (Nov–Mar Comparison) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#D8C5AE]/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DC]">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                    PHASE COMPARISON
                  </span>
                  <h3 className="text-base font-bold text-[#292724] mt-0.5">
                    MONTHLY TARGET PROGRESS
                  </h3>
                </div>
                <BarChart3 className="w-4 h-4 text-[#59483D]" />
              </div>

              <div className="mt-6 space-y-4">
                {MONTH_SECTIONS.filter(m => m.key !== 'rev-2027').map(ms => {
                  const s = monthStatsMap[ms.key] || { total: ms.targetCount, completed: 0, percentage: 0 };

                  return (
                    <div key={ms.key} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-semibold text-[#292724]">{ms.name}</span>
                        <span className="font-bold text-[#3B302A]">
                          {s.completed} / {s.total} Ch ({s.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-[#EFE7DC] rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-[#59483D] to-[#3B302A] rounded-full transition-all duration-500"
                          style={{ width: `${s.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#EFE7DC] flex justify-between text-[10px] font-mono text-[#A99A8C]">
              <span>Nov: 17 • Dec: 20</span>
              <span>Jan: 16 • Feb: 15</span>
              <span>Mar: 11 (Total 79)</span>
            </div>
          </div>

          {/* Chart B: SUBJECT-WISE PROGRESS (Horizontal Bar Chart) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#D8C5AE]/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DC]">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                    SUBJECT BREAKDOWN
                  </span>
                  <h3 className="text-base font-bold text-[#292724] mt-0.5">
                    SUBJECT-WISE PROGRESS
                  </h3>
                </div>
                <Layers className="w-4 h-4 text-[#59483D]" />
              </div>

              <div className="mt-6 space-y-3 max-h-64 overflow-y-auto pr-1">
                {subjectProgressComparison.map(s => (
                  <div key={s.subjectKey} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-[#292724] truncate max-w-[120px]">{s.subjectKey}</span>
                      <span className="font-bold text-[#3B302A]">{s.completed}/{s.total} ({s.percentage}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#EFE7DC] rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-[#3B302A] rounded-full transition-all duration-500"
                        style={{ width: `${s.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#EFE7DC] text-[10px] font-mono text-[#A99A8C] text-center">
              Covers both Paper 1 & Paper 2 targets
            </div>
          </div>

          {/* Chart C: REVISION COMPLETION (Doughnut Chart) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#D8C5AE]/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DC]">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                    FINAL SPRINT
                  </span>
                  <h3 className="text-base font-bold text-[#292724] mt-0.5">
                    REVISION COMPLETION
                  </h3>
                </div>
                <PieChart className="w-4 h-4 text-[#59483D]" />
              </div>

              <div className="py-6 flex flex-col items-center justify-center">
                {(() => {
                  const total = overallStats.totalRevisionChapters || 1;
                  const done = overallStats.completedRevision;
                  const pending = total - done;
                  const C = 376.99; // 2 * PI * 60
                  const doneDash = (done / total) * C;

                  return (
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="60" stroke="#EFE7DC" strokeWidth="18" fill="none" />
                        {done > 0 && (
                          <circle
                            cx="80"
                            cy="80"
                            r="60"
                            stroke="#3B302A"
                            strokeWidth="18"
                            fill="none"
                            strokeDasharray={`${doneDash} ${C}`}
                            strokeDashoffset={0}
                            className="transition-all duration-700 ease-out"
                          />
                        )}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-bold font-mono text-[#292724]">
                          {overallStats.revisionPercentage}%
                        </span>
                        <span className="text-[9px] font-mono uppercase text-[#A99A8C]">
                          Revised
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono border-t border-[#EFE7DC] pt-3">
                <div className="bg-[#F8F6F2] p-2 rounded-lg">
                  <span className="text-[10px] text-[#59483D] block">Revised</span>
                  <span className="font-bold text-[#292724]">{overallStats.completedRevision} Ch</span>
                </div>
                <div className="bg-[#F8F6F2] p-2 rounded-lg">
                  <span className="text-[10px] text-[#59483D] block">Pending</span>
                  <span className="font-bold text-[#59483D]">
                    {overallStats.totalRevisionChapters - overallStats.completedRevision} Ch
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 5. MODAL: ADD CUSTOM MONTHLY TARGET ASSIGNMENT */}
      {isAddAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div 
            className="bg-white w-full max-w-md rounded-2xl border border-[#D8C5AE] shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DC]">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                  ROADMAP MANAGEMENT
                </span>
                <h3 className="text-lg font-bold text-[#292724] mt-0.5">
                  Add Target Assignment
                </h3>
              </div>
              <button
                onClick={() => setIsAddAssignmentModalOpen(false)}
                className="p-1 text-[#A99A8C] hover:text-[#292724]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAssignmentSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                  Target Month
                </label>
                <select
                  value={newAsgMonthKey}
                  onChange={(e) => setNewAsgMonthKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
                >
                  {MONTH_SECTIONS.filter(m => m.key !== 'rev-2027').map(m => (
                    <option key={m.key} value={m.key}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                    Subject & Paper
                  </label>
                  <select
                    value={newAsgSubjectKey}
                    onChange={(e) => setNewAsgSubjectKey(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
                  >
                    <option value="Physics 1">Physics 1</option>
                    <option value="Physics 2">Physics 2</option>
                    <option value="Chemistry 1">Chemistry 1</option>
                    <option value="Chemistry 2">Chemistry 2</option>
                    <option value="Higher Mathematics 1">Higher Mathematics 1</option>
                    <option value="Higher Mathematics 2">Higher Mathematics 2</option>
                    <option value="Biology 1">Biology 1 (Botany)</option>
                    <option value="Biology 2">Biology 2 (Zoology)</option>
                    <option value="ICT">ICT</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                    Chapter Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={newAsgChapterNum}
                    onChange={(e) => setNewAsgChapterNum(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                  Chapter Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vector Analysis, Thermodynamics..."
                  value={newAsgChapterName}
                  onChange={(e) => setNewAsgChapterName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EFE7DC]">
                <button
                  type="button"
                  onClick={() => setIsAddAssignmentModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-mono text-[#59483D] hover:bg-[#EFE7DC] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newAsgChapterName.trim()}
                  className="px-4 py-1.5 text-xs font-mono font-bold bg-[#3B302A] text-white rounded-xl hover:bg-[#59483D] disabled:opacity-40"
                >
                  Add to Roadmap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: MOVE ASSIGNMENT BETWEEN MONTHS */}
      {movingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div 
            className="bg-white w-full max-w-sm rounded-2xl border border-[#D8C5AE] shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#EFE7DC]">
              <h3 className="text-sm font-bold font-mono text-[#292724]">
                Move Assignment
              </h3>
              <button
                onClick={() => setMovingAssignment(null)}
                className="p-1 text-[#A99A8C] hover:text-[#292724]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-mono text-[#59483D]">
              Move <span className="font-bold text-[#292724]">{movingAssignment.subjectKey} — Ch {movingAssignment.chapterNumber}: {movingAssignment.chapterName}</span> from <span className="font-bold">{movingAssignment.monthName}</span> to:
            </p>

            <select
              value={targetMoveMonthKey}
              onChange={(e) => setTargetMoveMonthKey(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
            >
              {MONTH_SECTIONS.filter(m => m.key !== 'rev-2027').map(m => (
                <option key={m.key} value={m.key}>{m.name}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EFE7DC]">
              <button
                onClick={() => setMovingAssignment(null)}
                className="px-3 py-1.5 text-xs font-mono text-[#59483D] hover:bg-[#EFE7DC] rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleMoveSubmit}
                className="px-4 py-1.5 text-xs font-mono font-bold bg-[#3B302A] text-white rounded-xl hover:bg-[#59483D]"
              >
                Confirm Move
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: RESET ROADMAP PROGRESS CONFIRMATION */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl border border-red-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-gray-900">
                Reset Monthly Roadmap Progress
              </h3>
            </div>
            <p className="text-xs text-[#59483D] font-mono leading-relaxed">
              Are you sure you want to reset all 79 monthly assignments and April–May revision marks back to the original roadmap defaults? Any custom moved chapters and completion marks will be reset.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 text-xs font-mono text-[#59483D] hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetRoadmapProgress();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-mono font-bold bg-red-700 text-white rounded-lg hover:bg-red-800"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
