import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  Clock, 
  Tag, 
  Check, 
  X, 
  Play, 
  Edit3, 
  Copy, 
  Repeat, 
  AlertCircle, 
  CheckCircle2, 
  Circle,
  Bell,
  BookOpen,
  Filter
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { CalendarEvent, EventCategory, EventPriority } from '../types/tracker';

const categoryColors: Record<EventCategory, { bg: string; text: string; border: string; dot: string }> = {
  'Study Session': { bg: 'bg-[#EFE7DC]', text: 'text-[#3B302A]', border: 'border-[#D8C5AE]', dot: 'bg-[#3B302A]' },
  'Examination': { bg: 'bg-black text-white', text: 'text-white', border: 'border-black', dot: 'bg-amber-500' },
  'Assignment': { bg: 'bg-[#F8F6F2]', text: 'text-[#59483D]', border: 'border-[#D8C5AE]', dot: 'bg-[#59483D]' },
  'Academic Deadline': { bg: 'bg-red-50', text: 'text-red-900', border: 'border-red-200', dot: 'bg-red-600' },
  'Personal': { bg: 'bg-stone-100', text: 'text-stone-800', border: 'border-stone-300', dot: 'bg-stone-500' },
  'Reminder': { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-200', dot: 'bg-amber-600' },
  'Other': { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200', dot: 'bg-gray-400' }
};

export const CalendarView: React.FC = () => {
  const { 
    events, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    duplicateEvent, 
    toggleEventCompleted,
    launchTimerFromEvent,
    selectedDate, 
    setSelectedDate, 
    selectedMonth, 
    setSelectedMonth,
    subjects,
    user
  } = useTracker();

  // Calendar View Mode: Month, Week, Day
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Event modal states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState(selectedDate);
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formEndTime, setFormEndTime] = useState('10:30');
  const [formCategory, setFormCategory] = useState<EventCategory>('Study Session');
  const [formPriority, setFormPriority] = useState<EventPriority>('Medium');
  const [formDescription, setFormDescription] = useState('');
  const [formSubjectId, setFormSubjectId] = useState('');
  const [formIsRecurring, setFormIsRecurring] = useState(false);
  const [formRecurrenceRule, setFormRecurrenceRule] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [formReminder, setFormReminder] = useState<number>(15);

  // Filter Category
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Timezone-safe local date formatting helpers
  const formatLocalDate = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const parseLocalDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  };

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === 'month') {
      setSelectedMonth(prev => {
        if (prev.month === 0) return { year: prev.year - 1, month: 11 };
        return { year: prev.year, month: prev.month - 1 };
      });
    } else if (viewMode === 'day') {
      const cur = parseLocalDate(selectedDate);
      cur.setDate(cur.getDate() - 1);
      setSelectedDate(formatLocalDate(cur));
    } else if (viewMode === 'week') {
      const cur = parseLocalDate(selectedDate);
      cur.setDate(cur.getDate() - 7);
      setSelectedDate(formatLocalDate(cur));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setSelectedMonth(prev => {
        if (prev.month === 11) return { year: prev.year + 1, month: 0 };
        return { year: prev.year, month: prev.month + 1 };
      });
    } else if (viewMode === 'day') {
      const cur = parseLocalDate(selectedDate);
      cur.setDate(cur.getDate() + 1);
      setSelectedDate(formatLocalDate(cur));
    } else if (viewMode === 'week') {
      const cur = parseLocalDate(selectedDate);
      cur.setDate(cur.getDate() + 7);
      setSelectedDate(formatLocalDate(cur));
    }
  };

  const handleToday = () => {
    setSelectedDate(user.currentDate);
    const d = parseLocalDate(user.currentDate);
    setSelectedMonth({ year: d.getFullYear(), month: d.getMonth() });
  };

  // Monthly Grid Generation
  const calendarGrid = useMemo(() => {
    const year = selectedMonth.year;
    const month = selectedMonth.month;

    const firstDay = new Date(year, month, 1);
    const dayOfWeek = firstDay.getDay();
    const startOffset = (dayOfWeek + 6) % 7; // Monday as day 0

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: {
      day: number;
      dateStr: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      dayEvents: CalendarEvent[];
    }[] = [];

    // Prev month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = month === 0 ? 11 : month - 1;
      const prevY = month === 0 ? year - 1 : year;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvs = events.filter(e => e.date === dateStr);

      cells.push({
        day: d,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === user.currentDate,
        dayEvents: dayEvs
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvs = events.filter(e => e.date === dateStr);

      cells.push({
        day: d,
        dateStr,
        isCurrentMonth: true,
        isToday: dateStr === user.currentDate,
        dayEvents: dayEvs
      });
    }

    // Next month padding to fill complete weeks
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nextM = month === 11 ? 0 : month + 1;
      const nextY = month === 11 ? year + 1 : year;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvs = events.filter(e => e.date === dateStr);

      cells.push({
        day: d,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === user.currentDate,
        dayEvents: dayEvs
      });
    }

    return cells;
  }, [selectedMonth, events, user.currentDate]);

  // Weekly Grid Generation
  const weekDays = useMemo(() => {
    const sel = parseLocalDate(selectedDate);
    const dayOfWeek = sel.getDay();
    const startOffset = (dayOfWeek + 6) % 7; // Monday offset
    const monday = new Date(sel);
    monday.setDate(monday.getDate() - startOffset);

    const days: { label: string; dateStr: string; dayNum: number; isToday: boolean; dayEvents: CalendarEvent[] }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      const dateStr = formatLocalDate(d);
      const dayEvs = events.filter(e => e.date === dateStr);
      days.push({
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateStr,
        dayNum: d.getDate(),
        isToday: dateStr === user.currentDate,
        dayEvents: dayEvs
      });
    }
    return days;
  }, [selectedDate, events, user.currentDate]);

  // Upcoming Events Panel Data
  const upcomingChronological = useMemo(() => {
    const ref = parseLocalDate(user.currentDate);
    return [...events]
      .filter(e => parseLocalDate(e.date) >= ref)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [events, user.currentDate]);

  // Open modal for new event
  const openNewEventModal = (dateStr?: string) => {
    setEditingEventId(null);
    setFormTitle('');
    setFormDate(dateStr || selectedDate);
    setFormStartTime('09:00');
    setFormEndTime('10:30');
    setFormCategory('Study Session');
    setFormPriority('Medium');
    setFormDescription('');
    setFormSubjectId(subjects[0]?.id || '');
    setFormIsRecurring(false);
    setFormReminder(15);
    setIsEventModalOpen(true);
  };

  // Open modal for editing event
  const openEditEventModal = (ev: CalendarEvent) => {
    setEditingEventId(ev.id);
    setFormTitle(ev.title);
    setFormDate(ev.date);
    setFormStartTime(ev.startTime || '09:00');
    setFormEndTime(ev.endTime || '10:30');
    setFormCategory(ev.category || 'Study Session');
    setFormPriority(ev.priority || 'Medium');
    setFormDescription(ev.description || '');
    setFormSubjectId(ev.subjectId || '');
    setFormIsRecurring(!!ev.isRecurring);
    setFormRecurrenceRule(ev.recurrenceRule === 'daily' || ev.recurrenceRule === 'monthly' ? ev.recurrenceRule : 'weekly');
    setFormReminder(ev.reminderMinutes || 15);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingEventId) {
      updateEvent(editingEventId, {
        title: formTitle.trim(),
        date: formDate,
        startTime: formStartTime,
        endTime: formEndTime,
        category: formCategory,
        priority: formPriority,
        description: formDescription,
        subjectId: formSubjectId,
        isRecurring: formIsRecurring,
        recurrenceRule: formIsRecurring ? formRecurrenceRule : 'none',
        reminderMinutes: formReminder
      });
    } else {
      addEvent({
        title: formTitle.trim(),
        date: formDate,
        startTime: formStartTime,
        endTime: formEndTime,
        category: formCategory,
        priority: formPriority,
        description: formDescription,
        subjectId: formSubjectId,
        completed: false,
        color: formCategory === 'Examination' ? 'black' : 'blue',
        isRecurring: formIsRecurring,
        recurrenceRule: formIsRecurring ? formRecurrenceRule : 'none',
        reminderMinutes: formReminder
      });
    }

    setIsEventModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1520px] mx-auto space-y-8 bg-[#F8F6F2] min-h-screen">
      
      {/* 1. HEADER & CONTROLS */}
      <div className="bg-white rounded-2xl border border-[#D8C5AE]/60 p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#59483D]" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
              ACADEMIC TIMETABLE & MILESTONE CALENDAR
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#292724] font-serif mt-0.5">
            ACADEMIC CALENDAR
          </h1>
          <p className="text-xs sm:text-sm font-medium tracking-wide text-[#59483D]">
            MANAGE EXAMINATIONS, DEADLINES, TASKS, AND FOCUS SCHEDULES
          </p>
        </div>

        {/* View Mode & Date Navigation Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Toggles: Month / Week / Day */}
          <div className="bg-[#F8F6F2] p-1 rounded-xl border border-[#D8C5AE]/60 flex items-center gap-1">
            {(['month', 'week', 'day'] as const).map(vm => (
              <button
                key={vm}
                onClick={() => setViewMode(vm)}
                className={`
                  px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer uppercase
                  ${viewMode === vm 
                    ? 'bg-[#3B302A] text-white shadow-xs' 
                    : 'text-[#59483D] hover:bg-[#EFE7DC]'}
                `}
              >
                {vm}
              </button>
            ))}
          </div>

          {/* Today Button */}
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-mono font-bold text-[#3B302A] bg-white border border-[#D8C5AE] rounded-xl hover:bg-[#EFE7DC] transition-colors"
          >
            Today
          </button>

          {/* Month / Period Switcher */}
          <div className="flex items-center gap-1 bg-[#F8F6F2] border border-[#D8C5AE]/60 rounded-xl px-2 py-1">
            <button
              onClick={handlePrev}
              className="p-1 text-[#59483D] hover:text-[#292724] rounded hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-mono font-bold text-[#292724] min-w-[120px] text-center">
              {viewMode === 'month' 
                ? `${monthNames[selectedMonth.month]} ${selectedMonth.year}`
                : viewMode === 'week'
                  ? `Week of ${selectedDate}`
                  : selectedDate}
            </span>
            <button
              onClick={handleNext}
              className="p-1 text-[#59483D] hover:text-[#292724] rounded hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Add Event Button */}
          <button
            onClick={() => openNewEventModal()}
            className="px-4 py-2 text-xs font-mono font-bold text-white bg-[#3B302A] hover:bg-[#59483D] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN CALENDAR GRID + UPCOMING SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 8 or 9 Cols: The Calendar View */}
        <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-[#D8C5AE]/80 p-5 sm:p-6 shadow-xs space-y-4">
          
          {/* MONTHLY VIEW */}
          {viewMode === 'month' && (
            <div className="border border-[#D8C5AE]/50 rounded-xl overflow-hidden">
              {/* Day Headers (Monday First) */}
              <div className="grid grid-cols-7 border-b border-[#EFE7DC] bg-[#F8F6F2]">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                  <div key={day} className="py-2.5 text-center text-[10px] font-mono font-bold text-[#59483D] tracking-wider">
                    {day}
                  </div>
                ))}
              </div>

              {/* 42 Date Cells */}
              <div className="grid grid-cols-7 divide-x divide-y divide-[#EFE7DC]">
                {calendarGrid.map((cell, idx) => {
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDate(cell.dateStr)}
                      className={`
                        min-h-[96px] p-2 flex flex-col justify-between transition-colors relative cursor-pointer
                        ${!cell.isCurrentMonth ? 'bg-[#F8F6F2]/40 text-[#A99A8C]' : 'bg-white hover:bg-[#F8F6F2]/60 text-[#292724]'}
                        ${cell.dateStr === selectedDate ? 'ring-2 ring-[#3B302A] ring-inset' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`
                          text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center
                          ${cell.isToday ? 'bg-[#3B302A] text-white shadow-xs' : 'text-[#292724]'}
                        `}>
                          {cell.day}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openNewEventModal(cell.dateStr);
                          }}
                          className="opacity-0 hover:opacity-100 p-0.5 text-[#A99A8C] hover:text-[#3B302A]"
                          title="Add event on this date"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Event Chips */}
                      <div className="space-y-1 my-1 max-h-16 overflow-y-auto">
                        {cell.dayEvents.map(ev => {
                          const style = categoryColors[ev.category] || categoryColors['Other'];
                          return (
                            <div
                              key={ev.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditEventModal(ev);
                              }}
                              className={`
                                px-1.5 py-0.5 rounded text-[9px] font-mono truncate border flex items-center gap-1
                                ${style.bg} ${style.text} ${style.border}
                              `}
                              title={`${ev.title} (${ev.category})`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />
                              <span className="truncate">{ev.title}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-[9px] font-mono text-[#A99A8C]">
                        {cell.dayEvents.length > 0 && `${cell.dayEvents.length} items`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* WEEKLY VIEW */}
          {viewMode === 'week' && (
            <div className="space-y-3">
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((wd, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(wd.dateStr)}
                    className={`
                      p-3 rounded-xl border text-center transition-all cursor-pointer
                      ${wd.dateStr === selectedDate 
                        ? 'bg-[#3B302A] text-white border-[#3B302A] shadow-xs' 
                        : wd.isToday 
                          ? 'bg-[#EFE7DC] border-[#D8C5AE] text-[#292724]' 
                          : 'bg-[#F8F6F2] border-[#D8C5AE]/60 text-[#59483D] hover:bg-[#EFE7DC]'}
                    `}
                  >
                    <span className="text-[10px] font-mono uppercase block">{wd.label}</span>
                    <span className="text-lg font-bold font-mono block mt-0.5">{wd.dayNum}</span>
                    <span className="text-[9px] font-mono opacity-80">{wd.dayEvents.length} events</span>
                  </div>
                ))}
              </div>

              {/* Selected Day Agenda inside Weekly */}
              <div className="bg-[#F8F6F2] rounded-xl p-4 border border-[#D8C5AE]/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#292724]">
                    AGENDA FOR {selectedDate}
                  </span>
                  <button
                    onClick={() => openNewEventModal(selectedDate)}
                    className="px-2.5 py-1 text-xs font-mono text-[#3B302A] bg-white border border-[#D8C5AE] rounded-lg hover:bg-[#EFE7DC]"
                  >
                    + Add Task
                  </button>
                </div>

                {events.filter(e => e.date === selectedDate).length === 0 ? (
                  <p className="text-xs font-mono text-[#A99A8C] py-4 text-center">
                    No events scheduled for this day.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {events.filter(e => e.date === selectedDate).map(ev => {
                      const style = categoryColors[ev.category] || categoryColors['Other'];
                      return (
                        <div
                          key={ev.id}
                          className="bg-white p-3 rounded-xl border border-[#D8C5AE]/70 flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleEventCompleted(ev.id)}
                              className="text-[#3B302A]"
                            >
                              {ev.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5 text-[#A99A8C]" />}
                            </button>
                            <div>
                              <span className={`text-xs font-bold block ${ev.completed ? 'line-through text-[#A99A8C]' : 'text-[#292724]'}`}>
                                {ev.title}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] font-mono text-[#59483D] mt-0.5">
                                <span>{ev.startTime}–{ev.endTime}</span>
                                <span>•</span>
                                <span className={`px-1.5 py-0.2 rounded border ${style.bg} ${style.text} ${style.border}`}>
                                  {ev.category}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {ev.category === 'Study Session' && (
                              <button
                                onClick={() => launchTimerFromEvent(ev)}
                                className="px-2.5 py-1 text-[10px] font-mono font-bold bg-[#3B302A] text-white rounded-lg flex items-center gap-1 hover:bg-[#59483D]"
                                title="Launch in Focus Timer"
                              >
                                <Play className="w-3 h-3 fill-white" />
                                <span>Start Timer</span>
                              </button>
                            )}
                            <button
                              onClick={() => openEditEventModal(ev)}
                              className="p-1.5 text-[#A99A8C] hover:text-[#292724] rounded hover:bg-[#F8F6F2]"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DAILY VIEW */}
          {viewMode === 'day' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#F8F6F2] p-4 rounded-xl border border-[#D8C5AE]/70">
                <div>
                  <span className="text-[10px] font-mono text-[#A99A8C] uppercase block">Selected Date</span>
                  <h3 className="text-lg font-bold font-mono text-[#292724]">{selectedDate}</h3>
                </div>
                <button
                  onClick={() => openNewEventModal(selectedDate)}
                  className="px-3 py-1.5 text-xs font-mono font-bold text-white bg-[#3B302A] rounded-xl"
                >
                  + Add Event
                </button>
              </div>

              {/* Day Time Schedule Slots */}
              <div className="divide-y divide-[#EFE7DC] border border-[#D8C5AE]/50 rounded-xl overflow-hidden">
                {['03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((timeSlot) => {
                  const slotEvents = events.filter(e => e.date === selectedDate && (e.startTime?.startsWith(timeSlot.split(':')[0]) || false));

                  return (
                    <div key={timeSlot} className="flex items-start gap-4 p-3 hover:bg-[#F8F6F2]/40">
                      <span className="w-16 font-mono text-xs font-bold text-[#59483D] shrink-0 pt-1">
                        {timeSlot}
                      </span>
                      <div className="flex-1 space-y-2">
                        {slotEvents.length === 0 ? (
                          <span className="text-[11px] font-mono text-[#A99A8C] italic block pt-1">Free study block</span>
                        ) : (
                          slotEvents.map(ev => (
                            <div
                              key={ev.id}
                              className="p-3 rounded-xl border border-[#D8C5AE] bg-white flex items-center justify-between shadow-2xs"
                            >
                              <div>
                                <span className="text-xs font-bold text-[#292724]">{ev.title}</span>
                                <div className="text-[10px] font-mono text-[#59483D] mt-0.5">
                                  {ev.startTime}–{ev.endTime} • {ev.category} • Priority: {ev.priority}
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {ev.category === 'Study Session' && (
                                  <button
                                    onClick={() => launchTimerFromEvent(ev)}
                                    className="px-2.5 py-1 text-[10px] font-mono font-bold bg-[#3B302A] text-white rounded-lg flex items-center gap-1"
                                  >
                                    <Play className="w-3 h-3 fill-white" />
                                    <span>Focus</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => openEditEventModal(ev)}
                                  className="p-1.5 text-[#A99A8C] hover:text-[#292724]"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right 4 or 3 Cols: Dedicated Upcoming Events Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-[#D8C5AE]/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DC]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#59483D]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#292724]">
                  UPCOMING CHRONOLOGY
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#A99A8C]">Next 7–30 Days</span>
            </div>

            {upcomingChronological.length === 0 ? (
              <p className="text-xs font-mono text-[#A99A8C] py-6 text-center">
                No upcoming events recorded.
              </p>
            ) : (
              <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                {upcomingChronological.map(ev => {
                  const style = categoryColors[ev.category] || categoryColors['Other'];

                  return (
                    <div
                      key={ev.id}
                      className="p-3 rounded-xl border border-[#D8C5AE]/70 bg-[#F8F6F2]/60 hover:bg-[#F8F6F2] transition-colors space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-[#292724] leading-snug">
                          {ev.title}
                        </span>
                        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border shrink-0 ${style.bg} ${style.text} ${style.border}`}>
                          {ev.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-[#59483D]">
                        <span>{ev.date}</span>
                        {ev.startTime && <span>{ev.startTime}</span>}
                      </div>

                      {ev.description && (
                        <p className="text-[11px] text-[#59483D] line-clamp-1 italic">
                          {ev.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-[#D8C5AE]/40 text-[10px] font-mono">
                        <span className={`font-semibold ${ev.priority === 'High' ? 'text-red-700' : 'text-[#A99A8C]'}`}>
                          {ev.priority} Priority
                        </span>

                        <div className="flex items-center gap-1">
                          {ev.category === 'Study Session' && (
                            <button
                              onClick={() => launchTimerFromEvent(ev)}
                              className="px-2 py-0.5 bg-[#3B302A] text-white rounded text-[9px] font-bold flex items-center gap-1 hover:bg-[#59483D]"
                            >
                              <Play className="w-2.5 h-2.5 fill-white" />
                              <span>Timer</span>
                            </button>
                          )}
                          <button
                            onClick={() => openEditEventModal(ev)}
                            className="p-1 text-[#A99A8C] hover:text-[#292724]"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => duplicateEvent(ev.id)}
                            className="p-1 text-[#A99A8C] hover:text-[#292724]"
                            title="Duplicate Event"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteEvent(ev.id)}
                            className="p-1 text-[#A99A8C] hover:text-red-700"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. EVENT CREATION & EDIT MODAL */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div 
            className="bg-white w-full max-w-lg rounded-2xl border border-[#D8C5AE] shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DC]">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                  CALENDAR EVENT PROTOCOL
                </span>
                <h3 className="text-lg font-bold text-[#292724] mt-0.5">
                  {editingEventId ? 'Edit Event' : 'Schedule New Event'}
                </h3>
              </div>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="p-1 text-[#A99A8C] hover:text-[#292724]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3.5">
              <div>
                <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Physics 1st CQ Board Solve, College Exam..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as EventCategory)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
                  >
                    <option value="Study Session">Study Session</option>
                    <option value="Examination">Examination</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Academic Deadline">Academic Deadline</option>
                    <option value="Personal">Personal</option>
                    <option value="Reminder">Reminder</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as EventPriority)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Optional Connected Subject */}
              <div>
                <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                  Connect to Subject (Optional)
                </label>
                <select
                  value={formSubjectId}
                  onChange={(e) => setFormSubjectId(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
                >
                  <option value="">— None / Non-Academic —</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                  Description / Preparation Target
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Additional syllabus notes, problem set numbers, venue..."
                  className="w-full px-3 py-1.5 text-xs bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#EFE7DC]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsRecurring}
                    onChange={(e) => setFormIsRecurring(e.target.checked)}
                    className="rounded text-[#3B302A]"
                  />
                  <span className="text-xs font-mono text-[#59483D]">Recurring Event</span>
                </label>

                {formIsRecurring && (
                  <select
                    value={formRecurrenceRule}
                    onChange={(e) => setFormRecurrenceRule(e.target.value as any)}
                    className="text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] px-2 py-1 rounded-lg"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EFE7DC]">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-mono text-[#59483D] hover:bg-[#EFE7DC] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formTitle.trim()}
                  className="px-4 py-1.5 text-xs font-mono font-bold text-white bg-[#3B302A] hover:bg-[#59483D] disabled:opacity-40 rounded-xl"
                >
                  {editingEventId ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
