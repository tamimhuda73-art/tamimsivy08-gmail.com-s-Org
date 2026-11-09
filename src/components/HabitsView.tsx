import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Check, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Edit2, 
  Sparkles,
  Trophy,
  Flame,
  Calendar as CalendarIcon,
  X
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { DailyHabit } from '../types/tracker';

export const HabitsView: React.FC = () => {
  const { 
    habits, 
    toggleHabit, 
    addCustomHabit, 
    renameHabit, 
    deleteHabit, 
    reorderHabit,
    selectedMonth, 
    setSelectedMonth 
  } = useTracker();

  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editingHabitName, setEditingHabitName] = useState('');

  // Month & Year logic
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = selectedMonth.year;
  const month = selectedMonth.month; // 0-indexed

  // Days in selected month (e.g. 30 for Nov 2026)
  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const monthLabel = `${monthNames[month]} ${year}`;

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

  // 5 Weekly Groups definition (01-07, 08-14, 15-21, 22-28, 29-31)
  const weeklyGroups = useMemo(() => {
    const w1 = [1, 2, 3, 4, 5, 6, 7];
    const w2 = [8, 9, 10, 11, 12, 13, 14];
    const w3 = [15, 16, 17, 18, 19, 20, 21];
    const w4 = [22, 23, 24, 25, 26, 27, 28];
    const w5: number[] = [];
    for (let d = 29; d <= daysInMonth; d++) {
      w5.push(d);
    }

    return [
      { id: 'w1', label: 'WEEK 01', range: '01–07', days: w1 },
      { id: 'w2', label: 'WEEK 02', range: '08–14', days: w2 },
      { id: 'w3', label: 'WEEK 03', range: '15–21', days: w3 },
      { id: 'w4', label: 'WEEK 04', range: '22–28', days: w4 },
      { id: 'w5', label: 'WEEK 05', range: `29–${daysInMonth}`, days: w5 },
    ];
  }, [daysInMonth]);

  // All days array (1..daysInMonth)
  const allDays = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);

  // Format date key: YYYY-MM-DD
  const getDateKey = (dayNum: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
  };

  // Dynamic habit calculations
  // For each habit: count of checked days in this month
  const habitMonthStats = useMemo(() => {
    return habits.map(h => {
      let completedInMonth = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        const dKey = getDateKey(d);
        if (h.history[dKey]) completedInMonth++;
      }
      const pct = daysInMonth > 0 ? Math.round((completedInMonth / daysInMonth) * 100) : 0;
      return {
        habitId: h.id,
        completedInMonth,
        percentage: pct
      };
    });
  }, [habits, daysInMonth, year, month]);

  // Overall Monthly Metrics
  const monthlyMetrics = useMemo(() => {
    const totalPossibleSlots = habits.length * daysInMonth;
    let totalCompleted = 0;

    habits.forEach(h => {
      for (let d = 1; d <= daysInMonth; d++) {
        const dKey = getDateKey(d);
        if (h.history[dKey]) totalCompleted++;
      }
    });

    const totalIncomplete = Math.max(0, totalPossibleSlots - totalCompleted);
    const overallRate = totalPossibleSlots > 0 ? Math.round((totalCompleted / totalPossibleSlots) * 100) : 0;

    // Best-performing habit
    let bestHabitName = "None";
    let maxCompleted = -1;
    habits.forEach((h, idx) => {
      const stats = habitMonthStats[idx];
      if (stats && stats.completedInMonth > maxCompleted) {
        maxCompleted = stats.completedInMonth;
        bestHabitName = h.name;
      }
    });
    if (habits.length === 0 || maxCompleted === 0) bestHabitName = "No activity yet";

    // Most consistent day
    let bestDayNum = 1;
    let maxDayCompleted = -1;
    for (let d = 1; d <= daysInMonth; d++) {
      const dKey = getDateKey(d);
      let dayCount = 0;
      habits.forEach(h => {
        if (h.history[dKey]) dayCount++;
      });
      if (dayCount > maxDayCompleted) {
        maxDayCompleted = dayCount;
        bestDayNum = d;
      }
    }
    const mostConsistentDayLabel = maxDayCompleted > 0 ? `Day ${String(bestDayNum).padStart(2, '0')} (${maxDayCompleted} habits)` : "Pending";

    // Consistency rating
    let consistencyRating = "Building Momentum";
    if (overallRate >= 80) consistencyRating = "Exceptional Discipline";
    else if (overallRate >= 60) consistencyRating = "High Consistency";
    else if (overallRate >= 40) consistencyRating = "Solid Rhythm";

    return {
      totalPossibleSlots,
      totalCompleted,
      totalIncomplete,
      overallRate,
      bestHabitName,
      mostConsistentDayLabel,
      consistencyRating
    };
  }, [habits, daysInMonth, habitMonthStats, year, month]);

  // Daily summary (for each day column 1..daysInMonth)
  const dailySummaries = useMemo(() => {
    return allDays.map(d => {
      const dKey = getDateKey(d);
      let completed = 0;
      habits.forEach(h => {
        if (h.history[dKey]) completed++;
      });
      const incomplete = Math.max(0, habits.length - completed);
      const pct = habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0;
      return {
        day: d,
        dateKey: dKey,
        completed,
        incomplete,
        percentage: pct
      };
    });
  }, [allDays, habits, year, month]);

  // Weekly analytics
  const weeklyAnalytics = useMemo(() => {
    return weeklyGroups.map(group => {
      let completed = 0;
      const totalAvailable = group.days.length * habits.length;

      group.days.forEach(d => {
        const dKey = getDateKey(d);
        habits.forEach(h => {
          if (h.history[dKey]) completed++;
        });
      });

      const incomplete = Math.max(0, totalAvailable - completed);
      const pct = totalAvailable > 0 ? Math.round((completed / totalAvailable) * 100) : 0;

      return {
        ...group,
        totalAvailable,
        completed,
        incomplete,
        percentage: pct
      };
    });
  }, [weeklyGroups, habits, year, month]);

  const handleStartRename = (habit: DailyHabit) => {
    setEditingHabitId(habit.id);
    setEditingHabitName(habit.name);
  };

  const handleSaveRename = (habitId: string) => {
    if (editingHabitName.trim()) {
      renameHabit(habitId, editingHabitName.trim());
    }
    setEditingHabitId(null);
  };

  const handleAddHabitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addCustomHabit(newHabitName.trim());
    setNewHabitName('');
    setIsAddingHabit(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-7 antialiased text-[#1C1917]">
      
      {/* ========================================================= */}
      {/* 2. SECTION HEADER */}
      {/* ========================================================= */}
      <div className="bg-[#FAF7F2] border border-[#E5DFC8] rounded-2xl p-6 sm:p-7 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div>
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#8C827A] uppercase block mb-1">
              BUILD CONSISTENCY. TRACK EVERY DAY.
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#241E1C] tracking-tight">
              DAILY HABIT TRACKER
            </h1>
          </div>

          {/* Month/Year selector & Global Metrics */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            {/* Month & Year Navigation Control */}
            <div className="flex items-center border border-[#DFD8CA] rounded-xl bg-white overflow-hidden shadow-2xs">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-[#F5F2EB] text-[#241E1C] transition-colors border-r border-[#DFD8CA] cursor-pointer"
                title="Previous month"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="px-4 py-2 text-xs font-mono font-bold text-[#241E1C] flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5 text-[#8C827A]" />
                <span>{monthLabel}</span>
              </div>

              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-[#F5F2EB] text-[#241E1C] transition-colors border-l border-[#DFD8CA] cursor-pointer"
                title="Next month"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Total Habits Badge */}
            <div className="px-4 py-2 bg-white border border-[#DFD8CA] rounded-xl shadow-2xs">
              <span className="text-[10px] font-mono text-[#8C827A] uppercase block">Total Habits</span>
              <span className="text-xs font-mono font-bold text-[#241E1C]">{habits.length} Created</span>
            </div>

            {/* Monthly Completion Rate Badge */}
            <div className="px-4 py-2 bg-white border border-[#DFD8CA] rounded-xl shadow-2xs">
              <span className="text-[10px] font-mono text-[#8C827A] uppercase block">Monthly Execution</span>
              <span className="text-xs font-mono font-bold text-[#241E1C]">{monthlyMetrics.overallRate}%</span>
            </div>

            {/* Overall Consistency Indicator */}
            <div className="px-4 py-2 bg-[#241E1C] text-white rounded-xl shadow-2xs flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#DFD8CA]" />
              <div>
                <span className="text-[9px] font-mono text-[#A59B91] uppercase block">Consistency Status</span>
                <span className="text-xs font-mono font-bold text-white tracking-wide">
                  {monthlyMetrics.consistencyRating}
                </span>
              </div>
            </div>

            {/* + ADD HABIT Control Button */}
            <button
              onClick={() => setIsAddingHabit(true)}
              className="px-4 py-2 bg-[#2D2522] hover:bg-[#1A1513] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer font-mono"
            >
              <Plus className="w-4 h-4" />
              <span>ADD HABIT</span>
            </button>
          </div>
        </div>

        {/* Quick Add Habit Bar when expanded */}
        {isAddingHabit && (
          <form onSubmit={handleAddHabitSubmit} className="mt-5 pt-5 border-t border-[#DFD8CA] flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Enter new habit name (e.g. 4h Deep Work, Morning Meditation, 50 Math Problems)..."
              value={newHabitName}
              onChange={e => setNewHabitName(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs bg-white border border-[#DFD8CA] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#241E1C]"
              autoFocus
            />
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#241E1C] text-white text-xs font-bold rounded-xl hover:bg-black transition-colors cursor-pointer"
              >
                Save Habit
              </button>
              <button
                type="button"
                onClick={() => setIsAddingHabit(false)}
                className="px-3 py-2.5 bg-white border border-[#DFD8CA] text-xs font-semibold text-[#8C827A] hover:text-[#241E1C] rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN HABIT TRACKING GRID */}
      {/* ========================================================= */}
      <div className="bg-white border border-[#E5DFC8] rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1280px]">
            {/* Table Header: Week Groups row */}
            <thead>
              <tr className="bg-[#F7F4EE] border-b border-[#E5DFC8] text-[10px] font-mono uppercase text-[#736B63]">
                {/* Number & Name header spans */}
                <th className="py-2.5 px-3 w-12 text-center border-r border-[#E5DFC8] sticky left-0 bg-[#F7F4EE] z-20">
                  NO
                </th>
                <th className="py-2.5 px-4 w-64 border-r border-[#E5DFC8] sticky left-12 bg-[#F7F4EE] z-20">
                  HABIT NAME
                </th>

                {/* 5 Weekly Groups Spanning their respective days */}
                {weeklyGroups.map((group, gIdx) => (
                  <th 
                    key={group.id} 
                    colSpan={group.days.length} 
                    className={`py-2 text-center border-r border-[#DFD8CA] tracking-wider font-bold ${gIdx % 2 === 0 ? 'bg-[#EFEAE1]/70' : 'bg-[#F7F4EE]'}`}
                  >
                    <span className="text-[#2D2522]">{group.label}</span>
                    <span className="text-[#8C827A] font-normal ml-1.5 font-mono">({group.range})</span>
                  </th>
                ))}

                {/* Individual Progress header */}
                <th className="py-2.5 px-4 w-48 text-right font-bold text-[#2D2522]">
                  PROGRESS
                </th>
              </tr>

              {/* Day numbers sub-header (01..31) */}
              <tr className="bg-[#FAF7F2] border-b border-[#E5DFC8] text-[10px] font-mono text-[#8C827A]">
                <th className="py-2 px-3 text-center border-r border-[#E5DFC8] sticky left-0 bg-[#FAF7F2] z-20">
                  #
                </th>
                <th className="py-2 px-4 border-r border-[#E5DFC8] sticky left-12 bg-[#FAF7F2] z-20">
                  <span className="text-[10px] font-semibold text-[#8C827A] uppercase">
                    Daily Actions
                  </span>
                </th>

                {weeklyGroups.map((group) => 
                  group.days.map((dayNum) => (
                    <th 
                      key={dayNum} 
                      className="py-1.5 px-1 text-center w-8 border-r border-[#EFEAE1] font-semibold"
                    >
                      {String(dayNum).padStart(2, '0')}
                    </th>
                  ))
                )}

                <th className="py-2 px-4 text-right">
                  RATE
                </th>
              </tr>
            </thead>

            {/* Table Body: Habit Rows */}
            <tbody className="divide-y divide-[#EFEAE1]">
              {habits.length === 0 ? (
                <tr>
                  <td colSpan={2 + daysInMonth + 1} className="py-16 text-center text-xs font-mono text-[#8C827A]">
                    <div className="flex flex-col items-center gap-3">
                      <Sparkles className="w-6 h-6 text-[#A59B91]" />
                      <p className="text-sm font-semibold text-[#241E1C]">No habits configured yet.</p>
                      <p className="text-xs text-[#8C827A]">Click &quot;ADD HABIT&quot; above to create your custom daily comeback routines.</p>
                      <button
                        onClick={() => setIsAddingHabit(true)}
                        className="mt-2 px-4 py-2 bg-[#241E1C] text-white text-xs font-semibold rounded-xl"
                      >
                        Create First Habit
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                habits.map((habit, index) => {
                  const stats = habitMonthStats[index] || { completedInMonth: 0, percentage: 0 };
                  const isEditing = editingHabitId === habit.id;

                  return (
                    <tr 
                      key={habit.id} 
                      className="hover:bg-[#FAF7F2]/80 transition-colors group"
                    >
                      {/* Habit Number */}
                      <td className="py-3 px-3 text-center font-mono text-xs font-bold text-[#8C827A] border-r border-[#E5DFC8] sticky left-0 bg-white group-hover:bg-[#FAF7F2]/80 z-10">
                        {String(index + 1).padStart(2, '0')}
                      </td>

                      {/* Sticky Habit Name & Edit Controls */}
                      <td className="py-3 px-4 border-r border-[#E5DFC8] sticky left-12 bg-white group-hover:bg-[#FAF7F2]/80 z-10 min-w-[240px]">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={editingHabitName}
                              onChange={e => setEditingHabitName(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleSaveRename(habit.id);
                                if (e.key === 'Escape') setEditingHabitId(null);
                              }}
                              className="px-2 py-1 text-xs font-semibold bg-white border border-[#241E1C] rounded-md focus:outline-hidden flex-1"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveRename(habit.id)}
                              className="p-1 text-xs bg-[#241E1C] text-white rounded cursor-pointer"
                              title="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingHabitId(null)}
                              className="p-1 text-xs text-[#8C827A] hover:text-[#241E1C] cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span 
                              onClick={() => handleStartRename(habit)}
                              className="text-xs sm:text-sm font-bold text-[#241E1C] cursor-pointer hover:underline truncate"
                              title="Click to rename"
                            >
                              {habit.name}
                            </span>

                            {/* Action tools: move up/down, edit, delete */}
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity ml-2">
                              <button
                                onClick={() => reorderHabit(habit.id, 'up')}
                                disabled={index === 0}
                                className="p-1 text-[#8C827A] hover:text-[#241E1C] disabled:opacity-20 cursor-pointer"
                                title="Move up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => reorderHabit(habit.id, 'down')}
                                disabled={index === habits.length - 1}
                                className="p-1 text-[#8C827A] hover:text-[#241E1C] disabled:opacity-20 cursor-pointer"
                                title="Move down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleStartRename(habit)}
                                className="p-1 text-[#8C827A] hover:text-[#241E1C] cursor-pointer"
                                title="Rename habit"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete habit "${habit.name}"?`)) {
                                    deleteHabit(habit.id);
                                  }
                                }}
                                className="p-1 text-[#8C827A] hover:text-red-700 cursor-pointer"
                                title="Delete habit"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Day cells 01..31 */}
                      {weeklyGroups.map((group) => 
                        group.days.map((dayNum) => {
                          const dateKey = getDateKey(dayNum);
                          const isChecked = !!habit.history[dateKey];

                          return (
                            <td 
                              key={dayNum} 
                              className="py-2 px-1 text-center border-r border-[#EFEAE1]"
                            >
                              <button
                                onClick={() => toggleHabit(habit.id, dateKey)}
                                className={`
                                  w-6 h-6 sm:w-7 sm:h-7 mx-auto rounded-md flex items-center justify-center transition-all cursor-pointer
                                  ${isChecked 
                                    ? 'bg-[#241E1C] text-[#FAF7F2] shadow-2xs ring-1 ring-[#241E1C]' 
                                    : 'bg-[#F7F4EE] hover:bg-[#EFEAE1] text-transparent hover:text-[#8C827A]/40 border border-[#E5DFC8]'}
                                `}
                                title={`${habit.name} on ${dateKey}`}
                                aria-label={`${habit.name} day ${dayNum}`}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[2.8]" />
                              </button>
                            </td>
                          );
                        })
                      )}

                      {/* 5. Individual Habit Progress */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-[#8C827A]">
                              {stats.completedInMonth}/{daysInMonth}
                            </span>
                            <span className="text-xs font-mono font-bold text-[#241E1C]">
                              {stats.percentage}%
                            </span>
                          </div>
                          
                          <div className="w-28 h-1.5 bg-[#EFEAE1] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#241E1C] rounded-full transition-all duration-300"
                              style={{ width: `${stats.percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}

              {/* ========================================================= */}
              {/* 6. DAILY SUMMARY ROWS (Aligned directly under day columns) */}
              {/* ========================================================= */}
              {habits.length > 0 && (
                <>
                  {/* Daily Completed Row */}
                  <tr className="bg-[#FAF7F2] text-[10px] font-mono border-t border-[#DFD8CA] text-[#736B63]">
                    <td className="py-2 px-3 text-center border-r border-[#E5DFC8] sticky left-0 bg-[#FAF7F2] z-10 font-bold">
                      ✓
                    </td>
                    <td className="py-2 px-4 border-r border-[#E5DFC8] sticky left-12 bg-[#FAF7F2] z-10 font-bold text-[#241E1C] uppercase tracking-wider">
                      Daily Completed
                    </td>
                    {dailySummaries.map((ds) => (
                      <td key={ds.day} className="py-2 px-1 text-center border-r border-[#EFEAE1] font-bold text-[#241E1C]">
                        {ds.completed}
                      </td>
                    ))}
                    <td className="py-2 px-4 text-right font-bold text-[#241E1C]">
                      {monthlyMetrics.totalCompleted}
                    </td>
                  </tr>

                  {/* Daily Incomplete Row */}
                  <tr className="bg-[#FAF7F2] text-[10px] font-mono text-[#8C827A]">
                    <td className="py-2 px-3 text-center border-r border-[#E5DFC8] sticky left-0 bg-[#FAF7F2] z-10">
                      ✗
                    </td>
                    <td className="py-2 px-4 border-r border-[#E5DFC8] sticky left-12 bg-[#FAF7F2] z-10 uppercase tracking-wider">
                      Daily Incomplete
                    </td>
                    {dailySummaries.map((ds) => (
                      <td key={ds.day} className="py-2 px-1 text-center border-r border-[#EFEAE1]">
                        {ds.incomplete}
                      </td>
                    ))}
                    <td className="py-2 px-4 text-right">
                      {monthlyMetrics.totalIncomplete}
                    </td>
                  </tr>

                  {/* Daily Completion Rate Row */}
                  <tr className="bg-[#EFEAE1]/60 text-[10px] font-mono border-b border-[#DFD8CA] text-[#241E1C]">
                    <td className="py-2 px-3 text-center border-r border-[#E5DFC8] sticky left-0 bg-[#EFEAE1]/80 z-10 font-bold">
                      %
                    </td>
                    <td className="py-2 px-4 border-r border-[#E5DFC8] sticky left-12 bg-[#EFEAE1]/80 z-10 font-bold uppercase tracking-wider">
                      Daily Rate
                    </td>
                    {dailySummaries.map((ds) => (
                      <td key={ds.day} className="py-2 px-1 text-center border-r border-[#DFD8CA] font-bold">
                        {ds.percentage}%
                      </td>
                    ))}
                    <td className="py-2 px-4 text-right font-bold">
                      {monthlyMetrics.overallRate}%
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 7. WEEKLY ANALYTICS (Five compact cards) */}
      {/* ========================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-[#241E1C] tracking-widest uppercase">
            WEEKLY PROGRESS BREAKDOWN
          </h3>
          <span className="text-[11px] font-mono text-[#8C827A]">5 Calendar Segments</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {weeklyAnalytics.map((w) => (
            <div 
              key={w.id} 
              className="bg-white border border-[#E5DFC8] rounded-2xl p-4 shadow-2xs space-y-2.5 hover:border-[#241E1C] transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#241E1C] font-mono block">{w.label}</span>
                  <span className="text-[10px] font-mono text-[#8C827A]">Days {w.range}</span>
                </div>
                <span className="text-base font-extrabold font-mono text-[#241E1C]">
                  {w.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#EFEAE1] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#241E1C] rounded-full transition-all duration-300"
                  style={{ width: `${w.percentage}%` }}
                />
              </div>

              {/* Completed vs Incomplete stats */}
              <div className="pt-2 border-t border-[#FAF7F2] flex items-center justify-between text-[10px] font-mono text-[#8C827A]">
                <span>Completed: <strong>{w.completed}</strong></span>
                <span>Missed: <strong>{w.incomplete}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 8. MONTHLY PERFORMANCE & 9. VISUAL ANALYTICS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 8. MONTHLY PERFORMANCE SUMMARY (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E5DFC8] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFEAE1]">
            <h3 className="text-xs font-mono font-bold text-[#241E1C] tracking-widest uppercase">
              MONTHLY PERFORMANCE AUDIT
            </h3>
            <span className="text-[11px] font-mono text-[#8C827A]">{monthLabel}</span>
          </div>

          <div className="space-y-3.5">
            {/* Total entries grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#FAF7F2] border border-[#E5DFC8] rounded-xl">
                <span className="text-[10px] font-mono text-[#8C827A] uppercase block">Total Habits Logged</span>
                <span className="text-2xl font-extrabold font-mono text-[#241E1C]">
                  {monthlyMetrics.totalCompleted}
                </span>
                <span className="text-[10px] font-mono text-[#8C827A] block mt-0.5">Checked Days</span>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] border border-[#E5DFC8] rounded-xl">
                <span className="text-[10px] font-mono text-[#8C827A] uppercase block">Incomplete Entries</span>
                <span className="text-2xl font-extrabold font-mono text-[#736B63]">
                  {monthlyMetrics.totalIncomplete}
                </span>
                <span className="text-[10px] font-mono text-[#8C827A] block mt-0.5">Missed Slots</span>
              </div>
            </div>

            {/* Overall Rate Bar */}
            <div className="p-4 bg-[#FAF7F2] border border-[#E5DFC8] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#241E1C] uppercase font-mono">Overall Completion Rate</span>
                <span className="text-sm font-mono font-extrabold text-[#241E1C]">{monthlyMetrics.overallRate}%</span>
              </div>
              <div className="w-full h-2 bg-[#EFEAE1] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#241E1C] rounded-full transition-all duration-300"
                  style={{ width: `${monthlyMetrics.overallRate}%` }}
                />
              </div>
            </div>

            {/* Best performing habit */}
            <div className="p-3.5 border border-[#E5DFC8] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-4 h-4 text-[#8C827A]" />
                <div>
                  <span className="text-[10px] font-mono text-[#8C827A] uppercase block">Top Consistent Habit</span>
                  <span className="text-xs font-bold text-[#241E1C]">{monthlyMetrics.bestHabitName}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FAF7F2] rounded text-[#241E1C] font-semibold">
                Leader
              </span>
            </div>

            {/* Most consistent day */}
            <div className="p-3.5 border border-[#E5DFC8] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CalendarIcon className="w-4 h-4 text-[#8C827A]" />
                <div>
                  <span className="text-[10px] font-mono text-[#8C827A] uppercase block">Peak Consistency Day</span>
                  <span className="text-xs font-bold text-[#241E1C]">{monthlyMetrics.mostConsistentDayLabel}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FAF7F2] rounded text-[#241E1C] font-semibold">
                Peak
              </span>
            </div>
          </div>
        </div>

        {/* 9. VISUAL ANALYTICS (7 cols): Two Charts */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Chart 1: DAILY CONSISTENCY TREND (8 cols on md) */}
          <div className="md:col-span-7 bg-white border border-[#E5DFC8] rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFEAE1]">
              <div>
                <span className="text-[10px] font-mono text-[#8C827A] uppercase block">Visual Analytics</span>
                <h4 className="text-xs font-mono font-bold text-[#241E1C] uppercase tracking-wider">
                  DAILY CONSISTENCY TREND
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#8C827A]">Days 01–{daysInMonth}</span>
            </div>

            {/* Vertical Bar Chart */}
            <div className="my-4">
              <div className="h-44 flex items-end gap-1 sm:gap-1.5 pt-4 pb-2 border-b border-[#EFEAE1]">
                {dailySummaries.map((ds) => {
                  const maxPossible = Math.max(1, habits.length);
                  const barHeightPct = Math.round((ds.completed / maxPossible) * 100);

                  return (
                    <div 
                      key={ds.day}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative"
                    >
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-[#241E1C] text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow-sm transition-opacity pointer-events-none whitespace-nowrap z-30">
                        Day {ds.day}: {ds.completed}/{habits.length}
                      </div>

                      <div 
                        className="w-full bg-[#EFEAE1] group-hover:bg-[#DFD8CA] rounded-t-sm transition-all"
                        style={{ height: '100%' }}
                      >
                        <div 
                          className="w-full bg-[#241E1C] rounded-t-sm transition-all duration-300"
                          style={{ height: `${barHeightPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-axis labels: show every 5 days */}
              <div className="flex justify-between text-[9px] font-mono text-[#8C827A] pt-1">
                <span>01</span>
                <span>07</span>
                <span>14</span>
                <span>21</span>
                <span>28</span>
                <span>{daysInMonth}</span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-[#8C827A] flex items-center justify-between pt-2 border-t border-[#FAF7F2]">
              <span>X: Calendar Days</span>
              <span>Y: Completed Habits</span>
            </div>
          </div>

          {/* Chart 2: MONTHLY COMPLETION RATIO (5 cols on md) */}
          <div className="md:col-span-5 bg-white border border-[#E5DFC8] rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
            <div className="pb-3 border-b border-[#EFEAE1]">
              <span className="text-[10px] font-mono text-[#8C827A] uppercase block">Ratio Breakdown</span>
              <h4 className="text-xs font-mono font-bold text-[#241E1C] uppercase tracking-wider">
                MONTHLY COMPLETION RATIO
              </h4>
            </div>

            {/* Minimalist SVG Doughnut Chart */}
            <div className="my-4 flex flex-col items-center justify-center relative">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring (Incomplete / Taupe) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#EFEAE1"
                  strokeWidth="12"
                />
                {/* Foreground Ring (Completed / Espresso Brown) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#241E1C"
                  strokeWidth="12"
                  strokeDasharray={`${(monthlyMetrics.overallRate / 100) * 251.2} 251.2`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              </svg>

              {/* Center Metrics in Doughnut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold font-mono text-[#241E1C] leading-none">
                  {monthlyMetrics.overallRate}%
                </span>
                <span className="text-[9px] font-mono text-[#8C827A] uppercase tracking-wider mt-0.5">
                  Executed
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 pt-2 border-t border-[#FAF7F2] text-[10px] font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#241E1C]" />
                  <span className="text-[#241E1C] font-semibold">Completed</span>
                </div>
                <span className="font-bold text-[#241E1C]">{monthlyMetrics.totalCompleted} ({monthlyMetrics.overallRate}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EFEAE1]" />
                  <span className="text-[#8C827A]">Incomplete</span>
                </div>
                <span className="font-bold text-[#8C827A]">{monthlyMetrics.totalIncomplete} ({100 - monthlyMetrics.overallRate}%)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
