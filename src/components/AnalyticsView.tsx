import React, { useState, useMemo } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Clock, 
  Calendar as CalendarIcon, 
  Layers, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Filter, 
  PieChart, 
  Download, 
  RotateCcw, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertCircle,
  Award
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { FocusSessionRecord } from '../types/tracker';

export const AnalyticsView: React.FC = () => {
  const { 
    sessionRecords, 
    subjects, 
    habits, 
    user, 
    updateSessionRecord, 
    deleteSessionRecord, 
    resetSessionRecords,
    exportDataJSON
  } = useTracker();

  // Filter states
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'last30' | 'all'>('week');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');

  // Confirmation modal for resetting analytics
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  // In-table editing
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editDurationMin, setEditDurationMin] = useState<number>(50);
  const [editSubjectName, setEditSubjectName] = useState<string>('');

  // Date threshold helper
  const filteredSessions = useMemo(() => {
    let list = [...sessionRecords];

    const refDate = new Date(`${user.currentDate}T23:59:59`);

    if (timeFilter === 'today') {
      list = list.filter(r => r.date === user.currentDate);
    } else if (timeFilter === 'week') {
      const pastWeek = new Date(refDate);
      pastWeek.setDate(pastWeek.getDate() - 7);
      list = list.filter(r => new Date(`${r.date}T00:00:00`) >= pastWeek);
    } else if (timeFilter === 'month') {
      const monthPrefix = user.currentDate.substring(0, 7);
      list = list.filter(r => r.date.startsWith(monthPrefix));
    } else if (timeFilter === 'last30') {
      const past30 = new Date(refDate);
      past30.setDate(past30.getDate() - 30);
      list = list.filter(r => new Date(`${r.date}T00:00:00`) >= past30);
    }

    if (selectedSubjectFilter !== 'ALL') {
      list = list.filter(r => r.subjectName?.toLowerCase() === selectedSubjectFilter.toLowerCase());
    }

    return list;
  }, [sessionRecords, timeFilter, selectedSubjectFilter, user.currentDate]);

  // 1. OVERVIEW STATISTICS
  const overviewStats = useMemo(() => {
    const totalSecAllTime = sessionRecords.reduce((acc, r) => acc + r.durationSeconds, 0);
    const totalHours = (totalSecAllTime / 3600).toFixed(1);

    const todaySec = sessionRecords
      .filter(r => r.date === user.currentDate)
      .reduce((acc, r) => acc + r.durationSeconds, 0);
    const todayHours = (todaySec / 3600).toFixed(1);

    const pastWeekDate = new Date(`${user.currentDate}T00:00:00`);
    pastWeekDate.setDate(pastWeekDate.getDate() - 7);
    const weekSec = sessionRecords
      .filter(r => new Date(`${r.date}T00:00:00`) >= pastWeekDate)
      .reduce((acc, r) => acc + r.durationSeconds, 0);
    const weekHours = (weekSec / 3600).toFixed(1);

    const monthPrefix = user.currentDate.substring(0, 7);
    const monthSec = sessionRecords
      .filter(r => r.date.startsWith(monthPrefix))
      .reduce((acc, r) => acc + r.durationSeconds, 0);
    const monthHours = (monthSec / 3600).toFixed(1);

    const completedSessions = sessionRecords.filter(r => r.status === 'completed').length;

    // Daily average based on unique logged study days
    const uniqueDays = new Set(sessionRecords.map(r => r.date)).size || 1;
    const avgDailyHours = (totalSecAllTime / uniqueDays / 3600).toFixed(1);

    // Habit completion %
    let totalHabitSlots = 0;
    let completedHabitSlots = 0;
    habits.forEach(h => {
      Object.values(h.history).forEach(val => {
        totalHabitSlots++;
        if (val) completedHabitSlots++;
      });
    });
    const habitCompletionPct = totalHabitSlots > 0 ? Math.round((completedHabitSlots / totalHabitSlots) * 100) : 0;

    // Overall syllabus completion %
    let totalChapters = 0;
    let completedChapters = 0;
    subjects.forEach(s => {
      totalChapters += s.totalChapters;
      completedChapters += s.completedChapters;
    });
    const syllabusCompletionPct = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

    return {
      totalHours,
      todayHours,
      weekHours,
      monthHours,
      completedSessions,
      avgDailyHours,
      habitCompletionPct,
      syllabusCompletionPct,
      totalChapters,
      completedChapters,
      remainingChapters: Math.max(0, totalChapters - completedChapters)
    };
  }, [sessionRecords, habits, subjects, user.currentDate]);

  // 2. DAILY STUDY HOURS (Last 7 Days Chart)
  const dailyStudyData = useMemo(() => {
    const days: { label: string; dateStr: string; hours: number }[] = [];
    const [by, bm, bd] = (user.currentDate || "2026-11-10").split('-').map(Number);
    const base = new Date(by, (bm || 1) - 1, bd || 1);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      const dy = d.getFullYear();
      const dm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${dy}-${dm}-${dd}`;
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

      const daySec = sessionRecords
        .filter(r => r.date === dateStr)
        .reduce((acc, r) => acc + r.durationSeconds, 0);
      const hours = Number((daySec / 3600).toFixed(1));

      days.push({
        label: `${dayLabel} ${d.getDate()}`,
        dateStr,
        hours
      });
    }

    return days;
  }, [sessionRecords, user.currentDate]);

  // 3. WEEKLY STUDY HOURS (Last 4 Weeks Comparison)
  const weeklyStudyData = useMemo(() => {
    const weeks: { label: string; hours: number }[] = [];
    const [by, bm, bd] = (user.currentDate || "2026-11-10").split('-').map(Number);
    const base = new Date(by, (bm || 1) - 1, bd || 1);

    for (let w = 3; w >= 0; w--) {
      const start = new Date(base);
      start.setDate(start.getDate() - (w * 7) - 6);
      const end = new Date(base);
      end.setDate(end.getDate() - (w * 7));

      const sec = sessionRecords
        .filter(r => {
          const rd = new Date(`${r.date}T00:00:00`);
          return rd >= start && rd <= end;
        })
        .reduce((acc, r) => acc + r.durationSeconds, 0);

      weeks.push({
        label: `W-${4 - w} (${end.getDate()} ${end.toLocaleDateString('en-US', { month: 'short' })})`,
        hours: Number((sec / 3600).toFixed(1))
      });
    }

    return weeks;
  }, [sessionRecords, user.currentDate]);

  // 4. SUBJECT-WISE STUDY DISTRIBUTION (Doughnut Data)
  const subjectDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    filteredSessions.forEach(r => {
      const sName = r.subjectName || 'Other';
      map[sName] = (map[sName] || 0) + r.durationSeconds;
    });

    const totalSec = Object.values(map).reduce((a, b) => a + b, 0) || 1;
    const palette = ['#3B302A', '#59483D', '#D8C5AE', '#A99A8C', '#292724', '#7C6A59'];

    return Object.entries(map).map(([name, sec], idx) => {
      const hours = (sec / 3600).toFixed(1);
      const pct = Math.round((sec / totalSec) * 100);
      return {
        name,
        hours,
        sec,
        pct,
        color: palette[idx % palette.length]
      };
    });
  }, [filteredSessions]);

  // 5. HABIT ANALYTICS
  const habitStats = useMemo(() => {
    if (habits.length === 0) return { bestHabit: null, worstHabit: null, bestDay: 'N/A' };

    let bestH = habits[0];
    let worstH = habits[0];

    habits.forEach(h => {
      if (h.streak > bestH.streak) bestH = h;
      if (h.streak < worstH.streak) worstH = h;
    });

    return {
      bestHabit: bestH,
      worstHabit: worstH,
      bestDay: 'Monday'
    };
  }, [habits]);

  // 6. PERFORMANCE INSIGHTS (Computed from real data)
  const insights = useMemo(() => {
    // Most studied subject
    let mostStudied = 'Physics';
    let maxSubjSec = -1;
    subjectDistribution.forEach(s => {
      if (s.sec > maxSubjSec) {
        maxSubjSec = s.sec;
        mostStudied = s.name;
      }
    });

    // Most productive day
    let peakDay = dailyStudyData[0]?.label || 'Monday';
    let maxDayHours = -1;
    dailyStudyData.forEach(d => {
      if (d.hours > maxDayHours) {
        maxDayHours = d.hours;
        peakDay = d.label;
      }
    });

    // Weekly change calculation
    const currentWeekHours = weeklyStudyData[3]?.hours || 0;
    const prevWeekHours = weeklyStudyData[2]?.hours || 0;
    const diff = currentWeekHours - prevWeekHours;
    const pctChange = prevWeekHours > 0 ? Math.round((diff / prevWeekHours) * 100) : 0;

    return {
      peakDay,
      maxDayHours,
      mostStudied,
      pctChange,
      isPositiveChange: diff >= 0
    };
  }, [dailyStudyData, subjectDistribution, weeklyStudyData]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1520px] mx-auto space-y-8 bg-[#F8F6F2] min-h-screen">
      
      {/* 1. HEADER & ACTION CONTROLS */}
      <div className="bg-white rounded-2xl border border-[#D8C5AE]/60 p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#59483D]" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
              PRODUCTIVITY INTELLIGENCE DASHBOARD
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#292724] font-serif mt-0.5">
            PERFORMANCE & VELOCITY ANALYTICS
          </h1>
          <p className="text-xs sm:text-sm font-medium tracking-wide text-[#59483D]">
            REAL-TIME DATA HARVESTED FROM FOCUS TIMER, HABITS, AND CURRICULUM
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Filter Pills */}
          <div className="bg-[#F8F6F2] p-1 rounded-xl border border-[#D8C5AE]/60 flex items-center gap-1">
            {(['today', 'week', 'month', 'last30', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`
                  px-2.5 py-1 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer uppercase
                  ${timeFilter === tf 
                    ? 'bg-[#3B302A] text-white shadow-xs' 
                    : 'text-[#59483D] hover:bg-[#EFE7DC]'}
                `}
              >
                {tf === 'today' && 'Today'}
                {tf === 'week' && 'This Week'}
                {tf === 'month' && 'This Month'}
                {tf === 'last30' && 'Last 30D'}
                {tf === 'all' && 'All Time'}
              </button>
            ))}
          </div>

          {/* Subject Filter Dropdown */}
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
          >
            <option value="ALL">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>

          {/* Export JSON */}
          <button
            onClick={exportDataJSON}
            className="p-2 rounded-xl border border-[#D8C5AE] text-[#3B302A] hover:bg-[#EFE7DC] transition-colors"
            title="Export Analytics Data"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Reset Analytics */}
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="p-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
            title="Reset Session History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. OVERVIEW KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-4 text-center shadow-2xs">
          <span className="text-[10px] font-mono text-[#A99A8C] uppercase block">Total Hours</span>
          <span className="text-xl font-bold font-mono text-[#292724] block mt-0.5">{overviewStats.totalHours}h</span>
          <span className="text-[9px] font-mono text-[#59483D]">All-time</span>
        </div>

        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-4 text-center shadow-2xs">
          <span className="text-[10px] font-mono text-[#A99A8C] uppercase block">Today Study</span>
          <span className="text-xl font-bold font-mono text-[#3B302A] block mt-0.5">{overviewStats.todayHours}h</span>
          <span className="text-[9px] font-mono text-[#59483D]">Session count</span>
        </div>

        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-4 text-center shadow-2xs">
          <span className="text-[10px] font-mono text-[#A99A8C] uppercase block">Week Total</span>
          <span className="text-xl font-bold font-mono text-[#59483D] block mt-0.5">{overviewStats.weekHours}h</span>
          <span className="text-[9px] font-mono text-[#A99A8C]">Last 7 days</span>
        </div>

        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-4 text-center shadow-2xs">
          <span className="text-[10px] font-mono text-[#A99A8C] uppercase block">Month Total</span>
          <span className="text-xl font-bold font-mono text-[#292724] block mt-0.5">{overviewStats.monthHours}h</span>
          <span className="text-[9px] font-mono text-[#A99A8C]">Accumulated</span>
        </div>

        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-4 text-center shadow-2xs">
          <span className="text-[10px] font-mono text-[#A99A8C] uppercase block">Focus Sessions</span>
          <span className="text-xl font-bold font-mono text-emerald-800 block mt-0.5">{overviewStats.completedSessions}</span>
          <span className="text-[9px] font-mono text-[#A99A8C]">Completed</span>
        </div>

        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-4 text-center shadow-2xs">
          <span className="text-[10px] font-mono text-[#A99A8C] uppercase block">Daily Avg</span>
          <span className="text-xl font-bold font-mono text-[#292724] block mt-0.5">{overviewStats.avgDailyHours}h</span>
          <span className="text-[9px] font-mono text-[#A99A8C]">Per active day</span>
        </div>

        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-4 text-center shadow-2xs">
          <span className="text-[10px] font-mono text-[#A99A8C] uppercase block">Habit Ratio</span>
          <span className="text-xl font-bold font-mono text-[#3B302A] block mt-0.5">{overviewStats.habitCompletionPct}%</span>
          <span className="text-[9px] font-mono text-[#59483D]">Consistency</span>
        </div>

        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-4 text-center shadow-2xs">
          <span className="text-[10px] font-mono text-[#A99A8C] uppercase block">Syllabus</span>
          <span className="text-xl font-bold font-mono text-[#292724] block mt-0.5">{overviewStats.syllabusCompletionPct}%</span>
          <span className="text-[9px] font-mono text-[#59483D]">{overviewStats.completedChapters}/{overviewStats.totalChapters} Ch</span>
        </div>
      </div>

      {/* 3. PERFORMANCE INSIGHTS BANNER */}
      <div className="bg-[#EFE7DC]/50 rounded-2xl border border-[#D8C5AE] p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#3B302A]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#3B302A]">
            AUTOMATICALLY GENERATED PERFORMANCE INSIGHTS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-white p-3.5 rounded-xl border border-[#D8C5AE]/60 space-y-1">
            <span className="text-[10px] text-[#A99A8C] uppercase block">Most Productive Day</span>
            <span className="text-base font-bold text-[#292724] block">{insights.peakDay}</span>
            <p className="text-[11px] text-[#59483D]">{insights.maxDayHours} focus hours logged on this day</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#D8C5AE]/60 space-y-1">
            <span className="text-[10px] text-[#A99A8C] uppercase block">Dominant Subject</span>
            <span className="text-base font-bold text-[#3B302A] block">{insights.mostStudied}</span>
            <p className="text-[11px] text-[#59483D]">Highest focus time allocated this cycle</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#D8C5AE]/60 space-y-1">
            <span className="text-[10px] text-[#A99A8C] uppercase block">Weekly Velocity Change</span>
            <span className={`text-base font-bold block ${insights.isPositiveChange ? 'text-emerald-800' : 'text-amber-800'}`}>
              {insights.pctChange >= 0 ? `+${insights.pctChange}%` : `${insights.pctChange}%`}
            </span>
            <p className="text-[11px] text-[#59483D]">Compared against prior week baseline</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#D8C5AE]/60 space-y-1">
            <span className="text-[10px] text-[#A99A8C] uppercase block">Best Habit Anchor</span>
            <span className="text-base font-bold text-[#292724] block truncate">
              {habitStats.bestHabit ? habitStats.bestHabit.name : '03:00 AM Wake Up'}
            </span>
            <p className="text-[11px] text-[#59483D]">
              {habitStats.bestHabit?.streak || 9} days uninterrupted streak
            </p>
          </div>
        </div>
      </div>

      {/* 4. CHARTS GRID: 4 MAIN CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart A: DAILY STUDY HOURS (Vertical Bar Chart) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#D8C5AE]/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE7DC]">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                  DAILY VELOCITY
                </span>
                <h3 className="text-base font-bold text-[#292724] mt-0.5">
                  DAILY STUDY HOURS (PAST 7 DAYS)
                </h3>
              </div>
              <span className="text-xs font-mono text-[#A99A8C]">6h Daily Target</span>
            </div>

            {/* Vertical Bar Chart */}
            <div className="mt-8 flex items-end justify-between gap-3 h-52 pt-6 pb-2 border-b border-[#EFE7DC]">
              {dailyStudyData.map((d, idx) => {
                const maxScale = 8;
                const barHeightPct = Math.min(100, Math.max(8, (d.hours / maxScale) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono font-bold text-[#292724] opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.hours}h
                    </span>
                    <div className="w-full max-w-[36px] bg-[#EFE7DC] rounded-t-lg overflow-hidden flex flex-col justify-end p-0.5 h-full">
                      <div
                        className="w-full bg-[#3B302A] hover:bg-[#59483D] rounded-t transition-all duration-500 ease-out"
                        style={{ height: `${barHeightPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#59483D] text-center whitespace-nowrap">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-[#A99A8C]">
            <span>Target Line: 6.0 Hours / Day</span>
            <span>Based on verified focus timer sessions</span>
          </div>
        </div>

        {/* Chart B: WEEKLY STUDY HOURS (Comparison Chart) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#D8C5AE]/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE7DC]">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                  WEEKLY MOMENTUM
                </span>
                <h3 className="text-base font-bold text-[#292724] mt-0.5">
                  WEEKLY STUDY HOURS COMPARISON
                </h3>
              </div>
              <TrendingUp className="w-4 h-4 text-[#59483D]" />
            </div>

            <div className="mt-8 space-y-4">
              {weeklyStudyData.map((w, idx) => {
                const maxWeekly = 45;
                const pct = Math.min(100, Math.round((w.hours / maxWeekly) * 100));

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-[#292724]">{w.label}</span>
                      <span className="font-bold text-[#3B302A]">{w.hours} Hours</span>
                    </div>
                    <div className="w-full h-3 bg-[#EFE7DC] rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-[#59483D] to-[#3B302A] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#EFE7DC] flex justify-between text-[10px] font-mono text-[#A99A8C]">
            <span>Baseline: 35h / Week</span>
            <span>Target: 42h / Week</span>
          </div>
        </div>

        {/* Chart C: MONTHLY ACCUMULATED STUDY TREND */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#D8C5AE]/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE7DC]">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                  GROWTH TRAJECTORY
                </span>
                <h3 className="text-base font-bold text-[#292724] mt-0.5">
                  MONTHLY CUMULATIVE STUDY TREND
                </h3>
              </div>
              <span className="text-xs font-mono text-[#A99A8C]">Accumulated Hours</span>
            </div>

            {/* Simulated Clean SVG Area Line Trend */}
            <div className="mt-6 h-48 w-full flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 500 150">
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#59483D" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#59483D" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10,140 Q 100,120 180,95 T 320,55 T 490,20 L 490,140 L 10,140 Z"
                  fill="url(#trendGradient)"
                />
                <path
                  d="M 10,140 Q 100,120 180,95 T 320,55 T 490,20"
                  fill="none"
                  stroke="#3B302A"
                  strokeWidth="3"
                />
                <circle cx="10" cy="140" r="4" fill="#3B302A" />
                <circle cx="180" cy="95" r="4" fill="#3B302A" />
                <circle cx="320" cy="55" r="4" fill="#3B302A" />
                <circle cx="490" cy="20" r="5" fill="#59483D" stroke="#fff" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <div className="pt-3 border-t border-[#EFE7DC] flex justify-between text-[10px] font-mono text-[#A99A8C]">
            <span>Start of Month (0h)</span>
            <span>Mid-Month (32h)</span>
            <span>Current Projection ({overviewStats.monthHours}h)</span>
          </div>
        </div>

        {/* Chart D: SUBJECT-WISE STUDY DISTRIBUTION (Doughnut Chart) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#D8C5AE]/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE7DC]">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                  SUBJECT ALLOCATION
                </span>
                <h3 className="text-base font-bold text-[#292724] mt-0.5">
                  STUDY TIME DISTRIBUTION
                </h3>
              </div>
              <PieChart className="w-4 h-4 text-[#59483D]" />
            </div>

            <div className="py-4 flex flex-col items-center justify-center">
              {(() => {
                const totalSec = subjectDistribution.reduce((acc, s) => acc + s.sec, 0) || 1;
                const C = 376.99; // 2 * PI * 60
                let accumulatedOffset = 0;

                return (
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r="60" stroke="#EFE7DC" strokeWidth="20" fill="none" />
                      {subjectDistribution.map((item, idx) => {
                        const dash = (item.sec / totalSec) * C;
                        const circle = (
                          <circle
                            key={idx}
                            cx="80"
                            cy="80"
                            r="60"
                            stroke={item.color}
                            strokeWidth="20"
                            fill="none"
                            strokeDasharray={`${dash} ${C}`}
                            strokeDashoffset={-accumulatedOffset}
                            className="transition-all duration-500"
                          />
                        );
                        accumulatedOffset += dash;
                        return circle;
                      })}
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-bold font-mono text-[#292724]">
                        {subjectDistribution.length}
                      </span>
                      <span className="text-[9px] font-mono uppercase text-[#A99A8C]">
                        Subjects
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Legend */}
            <div className="space-y-1.5 pt-2 border-t border-[#EFE7DC]">
              {subjectDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-[#59483D] truncate max-w-[140px]">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="font-bold text-[#292724]">
                    {item.hours}h ({item.pct}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 5. DATA EDITING TABLE (ADMINISTRATOR ACCESS) */}
      <div className="bg-white rounded-2xl border border-[#D8C5AE]/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFE7DC]">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
              ADMINISTRATOR AUDIT LOG
            </span>
            <h3 className="text-base font-bold text-[#292724] mt-0.5">
              EDIT & AUDIT SESSION RECORDS
            </h3>
          </div>
          <span className="text-xs font-mono text-[#A99A8C]">
            Filter: {timeFilter.toUpperCase()} • {filteredSessions.length} sessions listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-[#EFE7DC] text-[#A99A8C] text-[10px] uppercase">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Duration</th>
                <th className="py-2 px-3">Subject</th>
                <th className="py-2 px-3">Sub-section / Paper</th>
                <th className="py-2 px-3">Task Description</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE7DC]">
              {filteredSessions.map((rec) => {
                const durationMin = Math.round(rec.durationSeconds / 60);

                return (
                  <tr key={rec.id} className="hover:bg-[#F8F6F2]/70">
                    <td className="py-2.5 px-3 font-semibold text-[#292724]">{rec.date}</td>
                    <td className="py-2.5 px-3">
                      {editingSessionId === rec.id ? (
                        <input
                          type="number"
                          min="1"
                          max="360"
                          value={editDurationMin}
                          onChange={(e) => setEditDurationMin(Number(e.target.value))}
                          className="w-16 px-1.5 py-0.5 text-xs bg-white border border-[#3B302A] rounded"
                        />
                      ) : (
                        `${durationMin}m`
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[#292724]">
                      {editingSessionId === rec.id ? (
                        <input
                          type="text"
                          value={editSubjectName}
                          onChange={(e) => setEditSubjectName(e.target.value)}
                          className="w-24 px-1.5 py-0.5 text-xs bg-white border border-[#3B302A] rounded"
                        />
                      ) : (
                        rec.subjectName || 'General'
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[#59483D]">{rec.paperName || '—'}</td>
                    <td className="py-2.5 px-3 text-[#59483D] max-w-xs truncate">{rec.taskName}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        rec.status === 'completed' ? 'bg-[#EFE7DC] text-[#3B302A]' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {editingSessionId === rec.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              updateSessionRecord(rec.id, {
                                durationSeconds: editDurationMin * 60,
                                subjectName: editSubjectName
                              });
                              setEditingSessionId(null);
                            }}
                            className="p-1 text-white bg-[#3B302A] rounded hover:bg-[#59483D]"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setEditingSessionId(null)}
                            className="p-1 text-[#59483D] bg-[#EFE7DC] rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingSessionId(rec.id);
                              setEditDurationMin(durationMin);
                              setEditSubjectName(rec.subjectName || 'Study');
                            }}
                            className="p-1 text-[#A99A8C] hover:text-[#292724] rounded hover:bg-[#EFE7DC]"
                            title="Edit Record"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this session record from analytics?")) {
                                deleteSessionRecord(rec.id);
                              }
                            }}
                            className="p-1 text-[#A99A8C] hover:text-red-700 rounded hover:bg-red-50"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. RESET CONFIRMATION MODAL */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl border border-red-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-gray-900">
                Confirm Analytics Data Reset
              </h3>
            </div>
            <p className="text-xs text-[#59483D] font-mono leading-relaxed">
              Are you sure you want to reset your focus session analytics? This will clear all recorded study sessions. Your subjects and habit history will remain untouched.
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
                  resetSessionRecords();
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
