import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Calendar, 
  Flame, 
  FileText, 
  Activity, 
  CheckCircle2, 
  Play, 
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';

export const RightSidebar: React.FC = () => {
  const { 
    missions, 
    majorMilestones, 
    events, 
    sessionRecords, 
    habits, 
    setActiveTab, 
    setIsEventModalOpen, 
    setActiveMissionModal,
    addCustomHabit,
    getCountdownDetails,
    rightSidebarOpen,
    toggleRightSidebar
  } = useTracker();

  // Accordion open/close states
  const [openSections, setOpenSections] = useState({
    focus: true,
    deadlines: true,
    summary: true,
    notes: true,
    activity: true
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Quick notes state with local storage persistence
  const [quickNotes, setQuickNotes] = useState<string>(() => {
    return localStorage.getItem('comeback_quick_notes') || 
      '• Revise Calculus integration formulas before mock test\n• Memorize Organic Chemistry reaction mechanisms (Aldol condensation)\n• Practice 1 reading module on Bluebook';
  });

  useEffect(() => {
    localStorage.setItem('comeback_quick_notes', quickNotes);
  }, [quickNotes]);

  // Quick-add dropdown state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const satMission = missions.find(m => m.id === 'mission-sat') || missions[0];
  const hscMission = missions.find(m => m.id === 'mission-hsc') || missions[1];
  const usaMilestone = majorMilestones[0];

  const satCountdown = getCountdownDetails(satMission?.targetDate || '2027-03-06', satMission?.dateStatus || 'TENTATIVE');
  const hscCountdown = getCountdownDetails(hscMission?.targetDate || '2027-06-06', hscMission?.dateStatus || 'TENTATIVE');
  const usaCountdown = getCountdownDetails(usaMilestone?.targetDate || '2027-11-01', usaMilestone?.dateStatus || 'PLANNED');

  return (
    <>
      {/* Mobile/Tablet Backdrop when drawer opened */}
      {rightSidebarOpen && (
        <div 
          onClick={toggleRightSidebar}
          className="fixed inset-0 bg-black/25 backdrop-blur-2xs z-40 2xl:hidden"
        />
      )}

      <aside className={`
        w-72 shrink-0 flex-col gap-4 p-4 border-l border-gray-200/80 bg-[#FAF8F5]/90 text-gray-900 overflow-y-auto max-h-screen
        transition-all duration-300 ease-in-out z-50
        ${rightSidebarOpen 
          ? 'fixed top-0 bottom-0 right-0 flex shadow-2xl bg-[#FAF8F5]' 
          : 'hidden 2xl:flex sticky top-0'}
      `}>
        
        {/* Top Action Bar with + Quick-add and Close button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <button
              onClick={() => setIsQuickAddOpen(prev => !prev)}
              className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Quick-add</span>
            </button>

        {/* Quick Add Menu */}
        {isQuickAddOpen && (
          <div className="absolute top-12 left-0 right-0 bg-white rounded-2xl border border-gray-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => { setActiveTab('timer'); setIsQuickAddOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
            >
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>Start Focus Session</span>
            </button>
            <button
              onClick={() => { setActiveTab('routine'); setIsQuickAddOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>Daily Study Routine</span>
            </button>
            <button
              onClick={() => { setIsEventModalOpen(true); setIsQuickAddOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <span>Add Calendar Event</span>
            </button>
            <button
              onClick={() => { addCustomHabit('New Daily Habit'); setActiveTab('habits'); setIsQuickAddOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Add Daily Habit</span>
            </button>
            <button
              onClick={() => { setActiveTab('missions'); setIsQuickAddOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Add Mission Target</span>
            </button>
          </div>
        )}
      </div>

      <button
        onClick={toggleRightSidebar}
        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors 2xl:hidden cursor-pointer"
        title="Close quick panel"
        aria-label="Close panel"
      >
        <X className="w-4 h-4" />
      </button>
    </div>

      {/* Accordion 1: Today's focus */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <button
          onClick={() => toggleSection('focus')}
          className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-gray-900 tracking-wider font-mono uppercase bg-white hover:bg-gray-50/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-gray-600" />
            <span>Today&apos;s focus</span>
          </div>
          {openSections.focus ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {openSections.focus && (
          <div className="p-4 pt-0 space-y-3 border-t border-gray-100">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100/90">
              <span className="text-[10px] font-mono text-gray-400 uppercase font-semibold block">CURRENT ACTIVE TASK</span>
              <p className="text-xs font-bold text-gray-900 mt-0.5">Physics 1st: Vector CQ Solve</p>
              <span className="text-[11px] font-mono text-gray-500">Pomodoro 50m • High Priority</span>
            </div>

            <button
              onClick={() => setActiveTab('timer')}
              className="w-full py-2 bg-[#2E2520] hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Resume Focus Timer</span>
            </button>
          </div>
        )}
      </div>

      {/* Accordion 2: Upcoming deadline */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <button
          onClick={() => toggleSection('deadlines')}
          className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-gray-900 tracking-wider font-mono uppercase bg-white hover:bg-gray-50/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-gray-600" />
            <span>Upcoming deadline</span>
          </div>
          {openSections.deadlines ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {openSections.deadlines && (
          <div className="p-4 pt-0 space-y-2.5 border-t border-gray-100">
            {/* SAT */}
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100">
              <div>
                <span className="font-bold text-gray-900 block">SAT 1550+</span>
                <span className="text-[10px] font-mono text-gray-400">{satCountdown.formattedDate}</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {satCountdown.days}d
              </span>
            </div>

            {/* HSC */}
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100">
              <div>
                <span className="font-bold text-gray-900 block">HSC 2027 Start</span>
                <span className="text-[10px] font-mono text-gray-400">{hscCountdown.formattedDate}</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                {hscCountdown.days}d
              </span>
            </div>

            {/* USA */}
            <div className="flex items-center justify-between text-xs py-1.5">
              <div>
                <span className="font-bold text-gray-900 block">USA App Kickoff</span>
                <span className="text-[10px] font-mono text-gray-400">{usaCountdown.formattedDate}</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {usaCountdown.days}d
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 3: Weekly study summary */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <button
          onClick={() => toggleSection('summary')}
          className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-gray-900 tracking-wider font-mono uppercase bg-white hover:bg-gray-50/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-gray-600" />
            <span>Weekly study summary</span>
          </div>
          {openSections.summary ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {openSections.summary && (
          <div className="p-4 pt-0 space-y-2 border-t border-gray-100 text-xs">
            <div className="flex items-baseline justify-between">
              <span className="text-gray-500 font-mono">Total Recorded:</span>
              <span className="font-extrabold text-gray-900 font-mono text-sm">24h 87m</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-gray-500 font-mono">Sessions Completed:</span>
              <span className="font-bold text-gray-800 font-mono">18 sessions</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-gray-500 font-mono">Pace Status:</span>
              <span className="text-emerald-700 font-semibold font-mono bg-emerald-50 px-2 py-0.5 rounded">On Track</span>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 4: Quick notes */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <button
          onClick={() => toggleSection('notes')}
          className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-gray-900 tracking-wider font-mono uppercase bg-white hover:bg-gray-50/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-gray-600" />
            <span>Quick notes</span>
          </div>
          {openSections.notes ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {openSections.notes && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <textarea
              rows={4}
              value={quickNotes}
              onChange={e => setQuickNotes(e.target.value)}
              placeholder="Jot down quick reminders, formula notes, or thoughts..."
              className="w-full p-2.5 text-xs font-mono text-gray-800 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black resize-none"
            />
            <span className="text-[10px] text-gray-400 font-mono block text-right mt-1">Autosaved</span>
          </div>
        )}
      </div>

      {/* Accordion 5: Recent activity */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <button
          onClick={() => toggleSection('activity')}
          className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-gray-900 tracking-wider font-mono uppercase bg-white hover:bg-gray-50/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-gray-600" />
            <span>Recent activity</span>
          </div>
          {openSections.activity ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {openSections.activity && (
          <div className="p-4 pt-0 space-y-2 border-t border-gray-100 text-[11px] font-mono">
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">Physics Vector Chapter Completed</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">03:00 AM Wake Up & Prayer logged</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-3 h-3 text-gray-400 shrink-0" />
              <span className="truncate">50m Deep Work Pomodoro logged</span>
            </div>
          </div>
        )}
      </div>

    </aside>
    </>
  );
};
