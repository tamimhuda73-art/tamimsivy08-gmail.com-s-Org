import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Edit3, 
  CheckCircle2, 
  Circle,
  X,
  Trash2,
  Plus,
  ArrowRight,
  BookOpen,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { useUsaApp } from '../context/UsaAppContext';
import { DateConfirmationStatus } from '../types/tracker';

export const OverviewView: React.FC = () => {
  const { 
    user,
    missions, 
    majorMilestones,
    updateMissionDate,
    updateMilestoneDate,
    habits,
    toggleHabit,
    addCustomHabit,
    selectedDate, 
    setSelectedDate, 
    selectedMonth, 
    setSelectedMonth, 
    setActiveTab,
    setActiveMissionModal,
    setIsEventModalOpen,
    subjects,
    monthlyAssignments,
    sessionRecords,
    timerSettings,
    setActiveSubjectModal,
    deleteMission,
    addMission,
    calculateDaysRemaining
  } = useTracker();

  const { universities } = useUsaApp();

  // In-place Date Popover State matching screenshot
  const [popoverTarget, setPopoverTarget] = useState<{
    id: string;
    type: 'mission' | 'milestone';
    title: string;
    currentDate: string;
    status: DateConfirmationStatus;
  } | null>(null);

  const [popoverMonth, setPopoverMonth] = useState<{ year: number; month: number }>({
    year: 2027,
    month: 5 // June 2027
  });
  const [popoverSelectedDay, setPopoverSelectedDay] = useState<number>(6);
  const [popoverStatus, setPopoverStatus] = useState<DateConfirmationStatus>('TENTATIVE');

  const openDatePopover = (
    id: string, 
    type: 'mission' | 'milestone', 
    title: string, 
    currentDate: string, 
    status: DateConfirmationStatus
  ) => {
    let year = 2027;
    let month = 5;
    let day = 6;

    if (currentDate) {
      const parts = currentDate.split('-');
      if (parts.length === 3) {
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        day = parseInt(parts[2], 10);
      }
    }

    setPopoverMonth({ year, month });
    setPopoverSelectedDay(day);
    setPopoverStatus(status || 'TENTATIVE');
    setPopoverTarget({ id, type, title, currentDate, status });
  };

  const handleSavePopoverDate = () => {
    if (!popoverTarget) return;
    const formattedDate = `${popoverMonth.year}-${String(popoverMonth.month + 1).padStart(2, '0')}-${String(popoverSelectedDay).padStart(2, '0')}`;
    
    if (popoverTarget.type === 'mission') {
      updateMissionDate(popoverTarget.id, formattedDate, popoverStatus);
    } else {
      updateMilestoneDate(popoverTarget.id, formattedDate, popoverStatus);
    }
    setPopoverTarget(null);
  };

  // Mini timer state (inside Subject Progress section)
  const [miniTimerRunning, setMiniTimerRunning] = useState(false);
  const [miniTimerSeconds, setMiniTimerSeconds] = useState(3 * 3600 + 3 * 60 + 12); // "03:03:12"

  React.useEffect(() => {
    let interval: any = null;
    if (miniTimerRunning) {
      interval = setInterval(() => {
        setMiniTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [miniTimerRunning]);

  const formatMiniTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setSelectedMonth(prev => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  // Calendar Widget Grid - clean highlighting of today's date, no hardcoded targets
  const calendarGrid = useMemo(() => {
    const year = selectedMonth.year;
    const month = selectedMonth.month; // 10 for Nov 2026
    const todayDateStr = user?.currentDate || "2026-11-10";

    const firstDay = new Date(year, month, 1);
    const dayOfWeek = firstDay.getDay(); // 0 = Sun

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    interface Cell {
      day: number;
      isCurrentMonth: boolean;
      dateStr: string;
      isToday: boolean;
      isSelected: boolean;
    }

    const cells: Cell[] = [];

    // Leading days
    for (let i = dayOfWeek - 1; i >= 0; i--) {
      const prevDay = daysInPrevMonth - i;
      const prevMonthIdx = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`;
      cells.push({
        day: prevDay,
        isCurrentMonth: false,
        dateStr,
        isToday: dateStr === todayDateStr,
        isSelected: dateStr === selectedDate
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        day: d,
        isCurrentMonth: true,
        dateStr,
        isToday: dateStr === todayDateStr,
        isSelected: dateStr === selectedDate
      });
    }

    // Trailing days
    const totalCells = Math.ceil(cells.length / 7) * 7;
    const nextPadding = totalCells - cells.length;
    for (let n = 1; n <= nextPadding; n++) {
      const nextMonthIdx = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
      cells.push({
        day: n,
        isCurrentMonth: false,
        dateStr,
        isToday: dateStr === todayDateStr,
        isSelected: dateStr === selectedDate
      });
    }

    return cells;
  }, [selectedMonth, selectedDate, user?.currentDate]);

  // Primary Missions
  const satMission = missions.find(m => m.id === 'mission-sat') || missions[0];
  const hscMission = missions.find(m => m.id === 'mission-hsc') || missions[1];
  const ieltsMission = missions.find(m => m.id === 'mission-ielts') || missions[2];
  const usaMilestone = majorMilestones[0] || {
    id: "milestone-usa-app",
    title: "USA University Application Preparation",
    category: "International University Applications",
    targetDate: "2027-11-01",
    dateStatus: "UPCOMING",
    status: "UPCOMING",
    progressPercentage: 10,
    description: "Application preparation start & Common App portfolio development."
  };

  // 1. DYNAMIC SYLLABUS COMPUTATION (Accurate live correlation with Subjects)
  const { totalChapters, completedChapters, syllabusPercentage } = useMemo(() => {
    let total = 0;
    let completed = 0;
    subjects.forEach(sub => {
      sub.papers.forEach(p => {
        p.chapters.forEach(c => {
          total += 1;
          if (c.status === 'COMPLETED' || c.completed) {
            completed += 1;
          }
        });
      });
    });
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { totalChapters: total, completedChapters: completed, syllabusPercentage: percentage };
  }, [subjects]);

  // 2. DYNAMIC SUBJECT-BY-SUBJECT BREAKDOWN (Live mapping, 0% stays 0%)
  const subjectStats = useMemo(() => {
    return subjects.map(sub => {
      let subTotal = 0;
      let subCompleted = 0;
      sub.papers.forEach(p => {
        p.chapters.forEach(c => {
          subTotal += 1;
          if (c.status === 'COMPLETED' || c.completed) subCompleted += 1;
        });
      });
      const pct = subTotal > 0 ? Math.round((subCompleted / subTotal) * 100) : 0;
      return {
        subject: sub,
        name: sub.name,
        totalChapters: subTotal,
        completedChapters: subCompleted,
        percentage: pct
      };
    });
  }, [subjects]);

  // 3. DYNAMIC STUDY TIME (Today & Weekly)
  const { todayStudyStr, todayMinutes, todayPercent } = useMemo(() => {
    const todayDateStr = user?.currentDate || "2026-11-10";
    const todaySessions = sessionRecords.filter(r => r.date === todayDateStr && r.status === 'completed');
    const totalSecs = todaySessions.reduce((acc, r) => acc + (r.durationSeconds || 0), 0);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const goalMinutes = (timerSettings?.dailyTargetHours || 4) * 60;
    const totalMin = Math.floor(totalSecs / 60);
    const pct = goalMinutes > 0 ? Math.min(100, Math.round((totalMin / goalMinutes) * 100)) : 0;
    return {
      todayStudyStr: `${h}h ${m}m`,
      todayMinutes: totalMin,
      todayPercent: pct
    };
  }, [sessionRecords, user?.currentDate, timerSettings]);

  const { weeklyStudyStr, weeklyPercent } = useMemo(() => {
    const totalSecs = sessionRecords.reduce((acc, r) => acc + (r.durationSeconds || 0), 0);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const weeklyGoalMinutes = ((timerSettings?.dailyTargetHours || 4) * 7) * 60;
    const totalMin = Math.floor(totalSecs / 60);
    const pct = weeklyGoalMinutes > 0 ? Math.min(100, Math.round((totalMin / weeklyGoalMinutes) * 100)) : 0;
    return {
      weeklyStudyStr: `${h}h ${m}m`,
      weeklyPercent: pct
    };
  }, [sessionRecords, timerSettings]);

  // 4. DYNAMIC HABIT COMPLETION
  const habitStats = useMemo(() => {
    const todayDateStr = user?.currentDate || "2026-11-10";
    const total = habits.length;
    const completedToday = habits.filter(h => h.history?.[todayDateStr]).length;
    const pct = total > 0 ? Math.round((completedToday / total) * 100) : 0;
    return {
      completedToday,
      total,
      percentage: pct
    };
  }, [habits, user?.currentDate]);

  // 5. DYNAMIC MONTHLY STUDY TARGETS PREVIEW (From monthlyAssignments)
  const monthlyCounts = useMemo(() => {
    const monthDefinitions = [
      { key: 'nov-2026', name: 'November', current: true },
      { key: 'dec-2026', name: 'December', current: false },
      { key: 'jan-2027', name: 'January', current: false },
      { key: 'feb-2027', name: 'February', current: false },
      { key: 'mar-2027', name: 'March', current: false },
    ];

    return monthDefinitions.map(m => {
      const matched = monthlyAssignments.filter(a => a.monthKey === m.key);
      const count = matched.length;
      const completed = matched.filter(a => a.completed || a.status === 'COMPLETED').length;
      const pct = count > 0 ? Math.round((completed / count) * 100) : 0;
      return {
        name: m.name,
        count,
        completed,
        remaining: count - completed,
        pct,
        current: m.current
      };
    });
  }, [monthlyAssignments]);

  const currentMonthData = useMemo(() => {
    return monthlyCounts.find(m => m.name === 'November') || {
      name: 'November',
      count: 0,
      completed: 0,
      remaining: 0,
      pct: 0,
      current: true
    };
  }, [monthlyCounts]);

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-[1720px] mx-auto space-y-6 bg-[#F8F5F0] text-gray-900 font-sans select-none relative">
      
      {/* 2-Column Responsive Dashboard Layout matching image_c5b776f4.png */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 lg:gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN (~45% width: xl:col-span-5)                                   */}
        {/* 1. MISSION COMMAND (SAT 1550+ and HSC GPA 5.00 side-by-side)              */}
        {/* 2. Mini Week Calendar strip                                               */}
        {/* 3. USA UNIVERSITY APPLICATION                                             */}
        {/* 4. Bottom row: DAILY HABIT TRACKER PREVIEW & MONTHLY STUDY TARGET PREVIEW */}
        {/* ========================================================================= */}
        <div className="xl:col-span-5 space-y-5">
          
          {/* 1. MISSION COMMAND */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase block">
              MISSION COMMAND
            </span>

            {/* 2 Side-by-Side Cards (SAT 1550+ and HSC GPA 5.00) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative">
              
              {/* Card 1: SAT 1550+ (Light Warm Beige #F3EDE4) */}
              <div className="bg-[#F3EDE4] border border-[#E5DDD2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between relative">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-snug">
                    {satMission?.title || 'SAT 1550+'}
                  </h3>
                  
                  <div className="text-[11px] space-y-1 mt-2 text-gray-700 font-sans leading-tight">
                    <p><span className="text-gray-500 font-mono">Goal:</span> {satMission?.goal || 'Score 1550+'}</p>
                    <p><span className="text-gray-500 font-mono">Provisional target date:</span> {satMission?.targetDate ? new Date(satMission.targetDate + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '6 March 2027'}</p>
                    <div className="flex items-center gap-1.5 py-0.5">
                      <span className="text-gray-500 font-mono">Date status:</span>
                      <span className="px-1.5 py-0.2 bg-[#E4DCD0] text-gray-800 text-[10px] font-mono font-bold rounded">
                        {satMission?.dateStatus || 'TENTATIVE'}
                      </span>
                    </div>
                    <p><span className="text-gray-500 font-mono">Category:</span> {satMission?.category || 'Standardized Test'}</p>
                    
                    {/* Progress Bar */}
                    <div className="pt-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-gray-700">
                        <span>Progress:</span>
                        <span className="font-bold">{satMission?.progressPercentage ?? 0}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#DED6CA] rounded-full overflow-hidden mt-1">
                        <div 
                          className="h-full bg-black rounded-full transition-all duration-300" 
                          style={{ width: `${satMission?.progressPercentage ?? 0}%` }} 
                        />
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-500 font-mono pt-1">
                      Countdown: {calculateDaysRemaining(satMission?.targetDate || '2027-03-06')} days remaining
                    </p>
                  </div>
                </div>

                {/* Bottom Buttons */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => openDatePopover(
                      satMission.id, 
                      'mission', 
                      satMission.title || 'SAT 1550+', 
                      satMission.targetDate || '2027-03-06', 
                      satMission.dateStatus || 'TENTATIVE'
                    )}
                    className="px-2.5 py-1.5 bg-[#EAE2D7] hover:bg-[#E0D5C7] text-[11px] font-mono font-bold text-gray-800 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-gray-600" />
                    <span>Edit date</span>
                  </button>

                  <button
                    onClick={() => setActiveMissionModal(satMission)}
                    className="px-2.5 py-1.5 bg-[#EAE2D7] hover:bg-[#E0D5C7] text-[11px] font-mono font-bold text-gray-800 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-gray-600" />
                    <span>Edit mission</span>
                  </button>
                </div>
              </div>

              {/* Card 2: HSC GPA 5.00 (Dark Espresso #2E2520) */}
              <div className="bg-[#2E2520] border border-[#231C18] text-white rounded-2xl p-4 shadow-md flex flex-col justify-between relative">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                    {hscMission?.title || 'HSC GPA 5.00'}
                  </h3>

                  <div className="text-[11px] space-y-1 mt-2 text-gray-300 font-sans leading-tight">
                    <p><span className="text-gray-400 font-mono">Goal:</span> {hscMission?.goal || 'Achieve GPA 5.00'}</p>
                    <p><span className="text-gray-400 font-mono">Target exam start date:</span> {hscMission?.targetDate ? new Date(hscMission.targetDate + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '6 June 2027'}</p>
                    <p><span className="text-gray-400 font-mono">Category:</span> {hscMission?.category || 'Board Examination'}</p>
                    <p><span className="text-gray-400 font-mono">Progress:</span> Connected to HSC syllabus ({completedChapters}/{totalChapters} ch.)</p>
                    
                    {/* Progress Bar */}
                    <div className="pt-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-gray-300">
                        <span className="text-gray-400">Progress:</span>
                        <span className="font-bold text-white">{syllabusPercentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#4A3E37] rounded-full overflow-hidden mt-1">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-300" 
                          style={{ width: `${syllabusPercentage}%` }} 
                        />
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-400 font-mono pt-1">
                      Countdown: {calculateDaysRemaining(hscMission?.targetDate || '2027-06-06')} days remaining
                    </p>
                  </div>
                </div>

                {/* Bottom Buttons */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => openDatePopover(
                      hscMission.id, 
                      'mission', 
                      hscMission.title || 'HSC GPA 5.00', 
                      hscMission.targetDate || '2027-06-06', 
                      hscMission.dateStatus || 'TENTATIVE'
                    )}
                    className="px-2.5 py-1.5 bg-[#473B34] hover:bg-[#574941] text-[11px] font-mono font-bold text-white rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-gray-300" />
                    <span>Edit date</span>
                  </button>

                  <button
                    onClick={() => setActiveMissionModal(hscMission)}
                    className="px-2.5 py-1.5 bg-[#473B34] hover:bg-[#574941] text-[11px] font-mono font-bold text-white rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-gray-300" />
                    <span>Edit mission</span>
                  </button>
                </div>
              </div>

              {/* Working In-place Calendar Popover matching screenshot */}
              {popoverTarget && (
                <div className="absolute top-12 left-1/4 -translate-x-1/2 sm:left-auto sm:right-2 z-50 w-72 bg-white rounded-2xl border border-gray-200 shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-900 font-mono">
                      June 2027
                    </span>
                    <div className="flex items-center gap-1 text-gray-400">
                      <button 
                        onClick={() => setPopoverMonth(p => ({ year: p.year, month: Math.max(0, p.month - 1) }))}
                        className="p-1 hover:text-black cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setPopoverMonth(p => ({ year: p.year, month: Math.min(11, p.month + 1) }))}
                        className="p-1 hover:text-black cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setPopoverTarget(null)}
                        className="p-1 hover:text-black ml-1 text-gray-400 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Weekday Row */}
                  <div className="grid grid-cols-7 text-center text-[10px] font-mono font-bold text-gray-400 py-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono">
                    {/* Tuesday is day 1 in June 2027 */}
                    <span className="text-gray-300 py-1"></span>
                    <span className="text-gray-300 py-1"></span>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].map(day => {
                      const isSelected = day === popoverSelectedDay;
                      return (
                        <button
                          key={day}
                          onClick={() => setPopoverSelectedDay(day)}
                          className={`py-1 rounded-full text-xs transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[#2E2520] text-white font-bold ring-2 ring-black/20' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  {/* Status Dropdown */}
                  <div className="mt-3 pt-2 border-t border-gray-100">
                    <select
                      value={popoverStatus}
                      onChange={e => setPopoverStatus(e.target.value as DateConfirmationStatus)}
                      aria-label="Target Date Status"
                      className="w-full py-1.5 px-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-800 focus:outline-none"
                    >
                      <option value="TENTATIVE">Confirmed / Tentative</option>
                      <option value="CONFIRMED">CONFIRMED (Official Notice)</option>
                      <option value="POSTPONED">POSTPONED</option>
                      <option value="NOT SET">NOT SET</option>
                    </select>
                  </div>

                  {/* Save changes button */}
                  <button
                    onClick={handleSavePopoverDate}
                    className="w-full mt-2.5 py-2 bg-[#2E2520] hover:bg-black text-white text-xs font-mono font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Save changes
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* 2. Current Week Strip */}
          <div className="bg-white border border-[#EAE6DE] rounded-2xl p-3 shadow-2xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-900 font-mono">
                  November 2026
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">
                  Today: 09 Nov
                </span>
              </div>
              <button 
                onClick={() => setActiveTab('routine')}
                className="text-[10px] font-mono text-gray-800 hover:text-black font-bold flex items-center gap-1 cursor-pointer bg-[#F2EDE5] hover:bg-[#EAE2D7] px-2 py-0.5 rounded-lg transition-colors"
                title="Open Daily Study Routine Timetable"
              >
                <span>Study Routine</span>
                <span>→</span>
              </button>
            </div>
            <div 
              onClick={() => setActiveTab('routine')}
              className="grid grid-cols-7 text-center text-[10px] font-mono text-gray-500 pt-2 cursor-pointer hover:bg-gray-50/60 rounded-xl transition-colors"
              title="Click to view & edit Weekly Study Routine"
            >
              <div>Sun<span className="block text-gray-400 text-xs mt-0.5">8</span></div>
              <div>Mon<span className="block text-white font-bold text-xs mt-0.5 bg-black rounded-full w-5 h-5 mx-auto flex items-center justify-center shadow-2xs">9</span></div>
              <div>Tue<span className="block text-gray-700 text-xs mt-0.5">10</span></div>
              <div>Wed<span className="block text-gray-700 text-xs mt-0.5">11</span></div>
              <div>Thu<span className="block text-gray-700 text-xs mt-0.5">12</span></div>
              <div>Fri<span className="block text-gray-700 text-xs mt-0.5">13</span></div>
              <div>Sat<span className="block text-gray-700 text-xs mt-0.5">14</span></div>
            </div>
          </div>

          {/* 3. USA UNIVERSITY APPLICATION */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase block">
              USA UNIVERSITY APPLICATION
            </span>

            <div className="bg-white border border-[#EAE6DE] rounded-2xl p-4 shadow-2xs space-y-1.5 text-xs">
              <h4 className="text-sm font-bold text-gray-900">
                {usaMilestone.title}
              </h4>
              <p className="text-gray-700"><span className="text-gray-500 font-mono">Start date:</span> {usaMilestone.targetDate ? new Date(usaMilestone.targetDate + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '1 November 2027'}</p>
              <p className="text-gray-700"><span className="text-gray-500 font-mono">Category:</span> {usaMilestone.category}</p>
              <div className="flex items-center gap-1.5 py-0.5">
                <span className="text-gray-500 font-mono">Status:</span>
                <span className="px-2 py-0.2 bg-gray-100 text-gray-700 text-[10px] font-mono font-bold rounded">
                  {usaMilestone.status}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-mono">
                Colleges on list: <strong className="text-stone-900">{universities.length}</strong> · Countdown: {calculateDaysRemaining(usaMilestone.targetDate || '2027-11-01')} days
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => openDatePopover(
                    usaMilestone.id, 
                    'milestone', 
                    'USA University Application Preparation', 
                    usaMilestone.targetDate || '2027-11-01', 
                    'PLANNED'
                  )}
                  className="px-3 py-1.5 bg-[#F2EDE5] hover:bg-[#EAE2D7] text-xs font-mono font-bold text-gray-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3 h-3 text-gray-600" />
                  <span>Edit date</span>
                </button>

                <button
                  onClick={() => setActiveTab('usa-app')}
                  className="px-3.5 py-1.5 bg-[#3B302A] hover:bg-[#292724] text-xs font-mono font-bold text-[#EFE7DC] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
                >
                  <span>Open USA Workspace</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. Bottom row: DAILY HABIT TRACKER PREVIEW & MONTHLY STUDY TARGET PREVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Daily Habit Tracker Preview */}
            <div className="bg-white border border-[#EAE6DE] rounded-2xl p-3.5 shadow-2xs space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-900 font-mono uppercase">Today</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <ChevronLeft className="w-3.5 h-3.5 cursor-pointer hover:text-black" />
                    <ChevronRight className="w-3.5 h-3.5 cursor-pointer hover:text-black" />
                  </div>
                </div>

                {/* Day Headers M T W T F S S */}
                <div className="flex items-center justify-end gap-1 text-[9px] font-mono font-bold text-gray-400 py-1 pr-0.5">
                  {['M','T','W','T','F','S','S'].map((l, idx) => (
                    <span key={idx} className="w-3 text-center">{l}</span>
                  ))}
                </div>

                {/* 5 Habit Rows */}
                <div className="space-y-1.5">
                  {habits.slice(0, 5).map((h) => {
                    const todayDateStr = user?.currentDate || "2026-11-10";
                    const isDoneToday = h.history?.[todayDateStr] || false;
                    return (
                      <div key={h.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 min-w-0 pr-1">
                          <button
                            onClick={() => toggleHabit(h.id, todayDateStr)}
                            className="cursor-pointer shrink-0"
                            aria-label={`Toggle habit ${h.name}`}
                          >
                            {isDoneToday ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500" />
                            )}
                          </button>
                          <span className="truncate text-[11px] text-gray-700 font-sans">
                            {h.name.replace(/^\d+:\d+\s+[AP]M\s+/i, '').slice(0, 13)}
                          </span>
                        </div>

                        {/* 7-day mini status matrix */}
                        <div className="flex items-center gap-1 shrink-0">
                          {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => (
                            <span 
                              key={dayNum} 
                              className={`w-2.5 h-2.5 rounded-xs ${
                                dayNum <= 4 ? 'bg-gray-800' : (dayNum === 5 ? 'bg-gray-400' : 'bg-gray-200')
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono font-semibold text-gray-600">
                <button 
                  onClick={() => addCustomHabit('New Daily Habit')} 
                  className="hover:text-black cursor-pointer"
                >
                  Add Habit
                </button>
                <button 
                  onClick={() => setActiveTab('habits')} 
                  className="hover:text-black cursor-pointer"
                >
                  Edit
                </button>
                <button 
                  onClick={() => setActiveTab('habits')} 
                  className="hover:text-black cursor-pointer"
                >
                  Delete
                </button>
                <button 
                  onClick={() => setActiveTab('habits')} 
                  className="hover:text-black cursor-pointer"
                >
                  Reorder
                </button>
              </div>
            </div>

            {/* Monthly Study Target Preview */}
            <div className="bg-white border border-[#EAE6DE] rounded-2xl p-3.5 shadow-2xs space-y-2.5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase block">
                  MONTHLY STUDY TARGET PREVIEW
                </span>
                <h4 className="text-xs font-bold text-gray-900 mt-1 font-mono flex items-center justify-between">
                  <span>November</span>
                  <span className="text-[10px] text-gray-500 font-semibold">{currentMonthData.pct}%</span>
                </h4>
                <div className="text-[10px] text-gray-500 font-mono flex items-center justify-between mt-0.5">
                  <span>Total chapters: {currentMonthData.count}</span>
                  <span className="text-emerald-700 font-bold">Completed: {currentMonthData.completed}</span>
                  <span>Remaining: {currentMonthData.remaining}</span>
                </div>

                {/* Progress bars list */}
                <div className="space-y-1.5 mt-2.5">
                  {monthlyCounts.map((m) => (
                    <div key={m.name} className="space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-gray-700">
                        <span className={m.current ? 'font-bold text-black' : ''}>{m.name}</span>
                        <span>{m.completed}/{m.count} ({m.pct}%)</span>
                      </div>
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-800 rounded-full transition-all duration-300" 
                          style={{ width: `${m.pct}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('targets')}
                className="w-full text-center text-[10px] font-mono font-bold text-gray-800 hover:text-black pt-2 border-t border-gray-100 cursor-pointer uppercase tracking-wider"
              >
                VIEW FULL ROADMAP
              </button>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN (~55% width: xl:col-span-7)                                  */}
        {/* 1. TOP STATISTICS (4 horizontal cards)                                    */}
        {/* 2. CALENDAR WIDGET & SUBJECT PROGRESS side-by-side                         */}
        {/* 3. MISSIONS (3 dark cards) & QUICK ACTIONS side-by-side                   */}
        {/* 4. Bottom row: MOTIVATIONAL BANNER & APPLY TO USA                         */}
        {/* ========================================================================= */}
        <div className="xl:col-span-7 space-y-5">
          
          {/* 1. TOP STATISTICS */}
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase block mb-2">
              TOP STATISTICS
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Stat 1 */}
              <div className="bg-white border border-[#EAE6DE] rounded-xl p-3 shadow-2xs space-y-1">
                <span className="text-[10px] text-gray-500 font-sans block truncate">Today&apos;s Study Time</span>
                <span className="text-lg font-bold font-mono text-gray-900 block leading-tight">{todayStudyStr}</span>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-black rounded-full transition-all duration-300" style={{ width: `${todayPercent}%` }} />
                </div>
                <span className="text-[9px] text-gray-400 font-mono block pt-0.5 truncate">{todayMinutes}m of {(timerSettings?.dailyTargetHours || 4) * 60}m goal</span>
              </div>

              {/* Stat 2 */}
              <div className="bg-white border border-[#EAE6DE] rounded-xl p-3 shadow-2xs space-y-1">
                <span className="text-[10px] text-gray-500 font-sans block truncate">Weekly Study Time</span>
                <span className="text-lg font-bold font-mono text-gray-900 block leading-tight">{weeklyStudyStr}</span>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-black rounded-full transition-all duration-300" style={{ width: `${weeklyPercent}%` }} />
                </div>
                <span className="text-[9px] text-gray-400 font-mono block pt-0.5 truncate">Total focus logged</span>
              </div>

              {/* Stat 3 */}
              <div className="bg-white border border-[#EAE6DE] rounded-xl p-3 shadow-2xs space-y-1">
                <span className="text-[10px] text-gray-500 font-sans block truncate">Habit Completion</span>
                <span className="text-lg font-bold font-mono text-gray-900 block leading-tight">{habitStats.percentage}%</span>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-black rounded-full transition-all duration-300" style={{ width: `${habitStats.percentage}%` }} />
                </div>
                <span className="text-[9px] text-gray-400 font-mono block pt-0.5 truncate">{habitStats.completedToday} of {habitStats.total} done today</span>
              </div>

              {/* Stat 4 */}
              <div className="bg-white border border-[#EAE6DE] rounded-xl p-3 shadow-2xs space-y-1">
                <span className="text-[10px] text-gray-500 font-sans block truncate">Overall Syllabus Comple...</span>
                <span className="text-lg font-bold font-mono text-gray-900 block leading-tight">{syllabusPercentage}%</span>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-black rounded-full transition-all duration-300" style={{ width: `${syllabusPercentage}%` }} />
                </div>
                <span className="text-[9px] text-gray-400 font-mono block pt-0.5 truncate">{completedChapters} of {totalChapters} chapters done</span>
              </div>
            </div>
          </div>

          {/* 2. CALENDAR WIDGET & SUBJECT PROGRESS side-by-side matching screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            
            {/* Calendar Widget (md:col-span-6) */}
            <div className="md:col-span-6 flex flex-col">
              <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase block mb-2">
                CALENDAR WIDGET
              </span>

              <div className="bg-white border border-[#EAE6DE] rounded-2xl p-3.5 shadow-2xs flex-1 flex flex-col justify-between">
                <div>
                  {/* Header: Dynamic Month with Jump to Today and Prev/Next */}
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900 font-mono">
                        {monthNames[selectedMonth.month]} {selectedMonth.year}
                      </h3>
                      <button 
                        onClick={() => {
                          setSelectedMonth({ year: 2026, month: 10 });
                          setSelectedDate(user?.currentDate || "2026-11-10");
                        }}
                        className="text-[9px] font-mono font-semibold text-gray-600 hover:text-black px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                        title="Jump to current date"
                      >
                        Today
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-gray-400">
                      <button 
                        onClick={handlePrevMonth}
                        className="p-1 hover:text-black transition-colors cursor-pointer"
                        aria-label="Previous month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={handleNextMonth}
                        className="p-1 hover:text-black transition-colors cursor-pointer"
                        aria-label="Next month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid Header (Sun to Sat) */}
                  <div className="grid grid-cols-7 text-center text-[9px] font-mono font-bold text-gray-400 mb-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} className="py-0.5">{d}</div>
                    ))}
                  </div>

                  {/* Day cells grid - cleanly highlights today's date, no fixed targets */}
                  <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden text-left bg-white">
                    {calendarGrid.map((c, i) => {
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(c.dateStr)}
                          className={`min-h-[48px] p-1.5 flex flex-col justify-between transition-colors cursor-pointer text-left relative ${
                            c.isToday 
                              ? 'bg-[#FAF4EB]' 
                              : (c.isSelected 
                                  ? 'bg-[#F5EFE6]' 
                                  : (c.isCurrentMonth ? 'bg-white hover:bg-gray-50/90' : 'bg-gray-50/70 text-gray-300'))
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            {c.isToday ? (
                              <span className="w-5 h-5 rounded-full bg-black text-white font-bold font-mono text-[10px] flex items-center justify-center shadow-xs">
                                {c.day}
                              </span>
                            ) : (
                              <span className={`text-[10px] font-mono leading-none ${
                                c.isSelected ? 'font-bold text-black' : (c.isCurrentMonth ? 'text-gray-700 font-medium' : 'text-gray-300')
                              }`}>
                                {c.day}
                              </span>
                            )}

                            {c.isToday && (
                              <span className="text-[7px] font-mono font-bold px-1 py-0.2 bg-[#2E2520] text-white rounded">
                                Today
                              </span>
                            )}
                          </div>

                          {/* Subtle active indicator dot if selected and not today */}
                          {c.isSelected && !c.isToday && (
                            <span className="w-1 h-1 rounded-full bg-gray-400 self-center mt-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 text-[9px] font-mono text-gray-500 flex items-center justify-between">
                  <span>Current Date: <strong>{(() => {
                    const parts = (user?.currentDate || "2026-11-10").split('-');
                    if (parts.length === 3) {
                      const mNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                      return `${parts[2]} ${mNames[parseInt(parts[1], 10) - 1] || ''} ${parts[0]}`;
                    }
                    return "10 Nov 2026";
                  })()}</strong></span>
                  <span className="text-gray-400">{(() => {
                    const parts = (user?.currentDate || "2026-11-10").split('-').map(Number);
                    const d = new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1);
                    return d.toLocaleDateString('en-US', { weekday: 'long' });
                  })()}</span>
                </div>
              </div>
            </div>

            {/* Subject Progress Card (md:col-span-6) */}
            <div className="md:col-span-6 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase">
                  SUBJECT PROGRESS
                </span>
                <button
                  onClick={() => setActiveTab('subjects')}
                  className="text-[10px] font-mono font-bold text-gray-700 hover:text-black cursor-pointer uppercase"
                >
                  VIEW ALL SUBJECTS
                </button>
              </div>

              <div className="bg-white border border-[#EAE6DE] rounded-2xl p-3.5 shadow-2xs flex-1 flex flex-col justify-between space-y-3">
                {/* 2-Column Dynamic Subject Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {subjectStats.map((s, idx) => {
                    const isLastOdd = idx === subjectStats.length - 1 && subjectStats.length % 2 === 1;
                    return (
                      <div 
                        key={s.subject.id}
                        onClick={() => {
                          setActiveSubjectModal(s.subject);
                          setActiveTab('subjects');
                        }}
                        className={`p-2 bg-gray-50 hover:bg-[#FAF7F2] rounded-xl border border-gray-100 cursor-pointer space-y-1 transition-colors ${
                          isLastOdd ? 'col-span-2' : ''
                        }`}
                        title={`Click to open ${s.name}`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-900 truncate pr-1">{s.name}</span>
                          <span className="text-[10px] font-mono font-bold text-gray-600">{s.percentage}%</span>
                        </div>
                        <span className="text-[9px] text-gray-400 font-mono block">
                          {s.completedChapters}/{s.totalChapters} chapters done
                        </span>
                        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gray-800 rounded-full transition-all duration-300" 
                            style={{ width: `${s.percentage}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Embedded Focus Mini-Timer bar matching screenshot */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMiniTimerRunning(p => !p)}
                      className="p-1 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-colors cursor-pointer"
                      title={miniTimerRunning ? "Pause" : "Play"}
                      aria-label="Toggle mini timer"
                    >
                      {miniTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-sm font-bold font-mono text-gray-900">
                      {formatMiniTimer(miniTimerSeconds)}
                    </span>
                    <span className="text-gray-300 font-mono">||</span>
                  </div>

                  <button
                    onClick={() => setActiveTab('timer')}
                    className="flex items-center gap-1.5 text-[11px] font-mono text-gray-600 hover:text-black cursor-pointer truncate"
                  >
                    <span className="w-2 h-2 rounded-xs bg-gray-400 inline-block"></span>
                    <span className="truncate">Subject and Task</span>
                  </button>
                </div>

                {/* Bottom link */}
                <button
                  onClick={() => setActiveTab('subjects')}
                  className="w-full text-center text-[10px] font-mono font-bold text-gray-700 hover:text-black pt-1 border-t border-gray-100 uppercase cursor-pointer"
                >
                  VIEW ALL SUBJECTS
                </button>
              </div>
            </div>

          </div>

          {/* 3. MISSIONS (3 dark cards) & QUICK ACTIONS side-by-side matching screenshot */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase">
                MISSIONS
              </span>
              <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase">
                QUICK ACTIONS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              
              {/* Dynamic Mission Cards (up to 3 shown side-by-side with Quick Actions) */}
              {missions.slice(0, 3).map((mission) => {
                const daysRemaining = calculateDaysRemaining(mission.targetDate);
                const isHsc = mission.id === 'mission-hsc';
                const displayProgress = isHsc ? syllabusPercentage : mission.progressPercentage;

                return (
                  <div 
                    key={mission.id}
                    className="sm:col-span-3 bg-[#2E2520] text-white p-3 rounded-2xl border border-black/20 shadow-xs flex flex-col justify-between text-xs space-y-1.5"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-xs truncate max-w-[120px]">{mission.title}</h4>
                        <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800">
                          {displayProgress}%
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-300 font-mono space-y-0.5 mt-1">
                        <p className="truncate">Status: {mission.status}</p>
                        <p className="truncate">
                          Target: {mission.targetDate ? new Date(mission.targetDate + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Not set'}
                        </p>
                        <p className="text-gray-400">{daysRemaining} days remaining</p>
                        <p className="truncate text-gray-400 font-sans">{mission.goal}</p>
                      </div>
                      <div className="w-full h-1 bg-[#4A3E37] rounded-full overflow-hidden mt-1.5">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-300"
                          style={{ width: `${displayProgress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-white/10">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setActiveMissionModal(mission)}
                          className="p-1 text-gray-400 hover:text-white cursor-pointer"
                          aria-label={`Edit ${mission.title}`}
                          title="Edit mission"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Delete mission "${mission.title}"?`)) {
                              deleteMission(mission.id);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-400 cursor-pointer"
                          aria-label={`Delete ${mission.title}`}
                          title="Delete mission"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => openDatePopover(
                          mission.id, 
                          'mission', 
                          mission.title, 
                          mission.targetDate, 
                          mission.dateStatus
                        )}
                        className="text-[9px] text-gray-400 hover:text-white font-mono cursor-pointer underline"
                      >
                        Date
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Quick Actions Vertical Stack */}
              <div className="sm:col-span-3 flex flex-col gap-1.5 justify-center">
                <button
                  onClick={() => setActiveTab('timer')}
                  className="w-full py-1.5 px-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 rounded-lg text-[10px] font-mono font-semibold transition-colors text-center cursor-pointer shadow-2xs"
                >
                  Start Focus Session
                </button>
                <button
                  onClick={() => setActiveTab('routine')}
                  className="w-full py-1.5 px-2 bg-[#FAF6F0] hover:bg-[#F2ECE3] border border-[#DFD7C4] text-[#241E1C] font-bold rounded-lg text-[10px] font-mono transition-colors text-center cursor-pointer shadow-2xs"
                >
                  Daily Study Routine
                </button>
                <button
                  onClick={() => addCustomHabit('New Habit')}
                  className="w-full py-1.5 px-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 rounded-lg text-[10px] font-mono font-semibold transition-colors text-center cursor-pointer shadow-2xs"
                >
                  Add Habit
                </button>
                <button
                  onClick={() => setIsEventModalOpen(true)}
                  className="w-full py-1.5 px-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 rounded-lg text-[10px] font-mono font-semibold transition-colors text-center cursor-pointer shadow-2xs"
                >
                  Add Calendar Event
                </button>
                <button
                  onClick={() => setActiveTab('subjects')}
                  className="w-full py-1.5 px-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 rounded-lg text-[10px] font-mono font-semibold transition-colors text-center cursor-pointer shadow-2xs"
                >
                  Update Chapter Progress
                </button>
                <button
                  onClick={() => setActiveTab('missions')}
                  className="w-full py-1.5 px-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 rounded-lg text-[10px] font-mono font-semibold transition-colors text-center cursor-pointer shadow-2xs"
                >
                  Add Mission
                </button>
              </div>

            </div>
          </div>

          {/* 4. MOTIVATIONAL BANNER & APPLY TO USA matching screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            {/* Motivational Banner */}
            <div className="sm:col-span-8 bg-white border border-[#EAE6DE] rounded-2xl p-4 shadow-2xs flex flex-col justify-center text-center">
              <p className="text-xs font-bold font-mono text-gray-900 tracking-wider uppercase">
                IF YOU WANT SOMETHING, GO GET IT.
              </p>
              <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                Your past result does not determine your next result.
              </p>
            </div>

            {/* APPLY TO USA Banner */}
            <div className="sm:col-span-4 bg-white border border-[#EAE6DE] rounded-2xl p-4 shadow-2xs flex flex-col justify-between items-center text-center">
              <span className="text-xs font-bold font-mono text-gray-900 uppercase">
                APPLY TO USA
              </span>
              <button
                onClick={() => setActiveTab('analytics')}
                className="mt-1.5 py-1.5 px-3 bg-[#F2EDE5] hover:bg-[#EAE2D7] text-[10px] font-mono font-bold text-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                View Analytics
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
