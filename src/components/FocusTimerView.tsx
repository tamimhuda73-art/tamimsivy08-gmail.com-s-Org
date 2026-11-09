import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Maximize2, 
  Minimize2, 
  Sliders, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon, 
  BookOpen, 
  Layers, 
  Flame, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { TimerMode, FocusSessionRecord } from '../types/tracker';

export const FocusTimerView: React.FC = () => {
  const { 
    subjects, 
    timerSettings, 
    updateTimerSettings, 
    sessionRecords, 
    addSessionRecord, 
    updateSessionRecord, 
    deleteSessionRecord,
    activeTimerState,
    setActiveTimerState,
    toggleChapterInPaper,
    user
  } = useTracker();

  // Local active timer controls
  const [mode, setMode] = useState<TimerMode>(activeTimerState.mode || 'focus');
  const [timeLeft, setTimeLeft] = useState<number>(activeTimerState.timeLeft || timerSettings.focusDurationMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(activeTimerState.isRunning || false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Selected Subject, Paper & Chapter
  const [selectedSubjId, setSelectedSubjId] = useState<string>(activeTimerState.selectedSubjectId || subjects[0]?.id || '');
  const [selectedPaperId, setSelectedPaperId] = useState<string>(activeTimerState.selectedPaperId || subjects[0]?.papers[0]?.id || '');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(activeTimerState.selectedChapterId || '');
  const [customTask, setCustomTask] = useState<string>(activeTimerState.customTaskName || 'Core Syllabus Deep Work');
  const [sessionLabel, setSessionLabel] = useState<string>(activeTimerState.sessionLabel || 'Focus Session');

  // Session start timestamp tracker
  const sessionStartTimeRef = useRef<Date | null>(null);
  const initialDurationRef = useRef<number>(timerSettings.focusDurationMinutes * 60);

  // Editing historical session records
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editDurationMin, setEditDurationMin] = useState<number>(50);
  const [editNotes, setEditNotes] = useState<string>('');

  // Active Subject & Paper
  const activeSubject = useMemo(() => {
    return subjects.find(s => s.id === selectedSubjId) || subjects[0] || null;
  }, [subjects, selectedSubjId]);

  const activePaper = useMemo(() => {
    if (!activeSubject) return null;
    return activeSubject.papers.find(p => p.id === selectedPaperId) || activeSubject.papers[0] || null;
  }, [activeSubject, selectedPaperId]);

  // Audio tone generator (Web Audio API)
  const playChime = () => {
    if (!timerSettings.soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // Audio fallback
    }
  };

  // Get duration in seconds for a given mode
  const getModeDurationSeconds = (m: TimerMode): number => {
    switch (m) {
      case 'focus':
        return timerSettings.focusDurationMinutes * 60;
      case 'short_break':
        return timerSettings.shortBreakMinutes * 60;
      case 'long_break':
        return timerSettings.longBreakMinutes * 60;
      case 'custom':
        return activeTimerState.initialDuration || 45 * 60;
      default:
        return 50 * 60;
    }
  };

  // Switch mode
  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    const duration = getModeDurationSeconds(newMode);
    setTimeLeft(duration);
    initialDurationRef.current = duration;
    sessionStartTimeRef.current = null;
  };

  // Main countdown timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  // Handle Session Completion
  const handleSessionComplete = () => {
    setIsRunning(false);
    playChime();

    const endTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const startTimeStr = sessionStartTimeRef.current 
      ? sessionStartTimeRef.current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      : endTimeStr;

    const actualDurationSec = initialDurationRef.current;

    // Only log focus sessions to productivity history
    if (mode === 'focus' || mode === 'custom') {
      const selectedChapter = activePaper?.chapters.find(c => c.id === selectedChapterId);

      addSessionRecord({
        date: user.currentDate,
        startTime: startTimeStr,
        endTime: endTimeStr,
        durationSeconds: actualDurationSec,
        mode,
        subjectId: activeSubject?.id,
        subjectName: activeSubject?.name,
        paperId: activePaper?.id,
        paperName: activePaper?.name,
        chapterId: selectedChapter?.id,
        chapterName: selectedChapter?.name,
        taskName: customTask,
        sessionLabel,
        status: 'completed',
        notes: `Completed planned session on ${activeSubject?.name || 'Study'} (${activePaper?.name || ''}).`
      });

      // Update cycle count
      const nextCycle = activeTimerState.cycleCount + 1;
      const shouldLongBreak = nextCycle % timerSettings.longBreakInterval === 0;

      setActiveTimerState(prev => ({
        ...prev,
        sessionsCompletedToday: prev.sessionsCompletedToday + 1,
        cycleCount: nextCycle
      }));

      // Auto transitions if enabled
      if (timerSettings.autoTransition) {
        if (shouldLongBreak) {
          switchMode('long_break');
          if (timerSettings.autoStartBreaks) setIsRunning(true);
        } else {
          switchMode('short_break');
          if (timerSettings.autoStartBreaks) setIsRunning(true);
        }
      }
    } else {
      // Break finished -> transition back to focus
      if (timerSettings.autoTransition) {
        switchMode('focus');
      }
    }
  };

  // Start / Pause
  const handleStart = () => {
    if (!sessionStartTimeRef.current) {
      sessionStartTimeRef.current = new Date();
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    const duration = getModeDurationSeconds(mode);
    setTimeLeft(duration);
    sessionStartTimeRef.current = null;
  };

  // Skip / Interrupt Session
  const handleSkip = () => {
    if (isRunning && (mode === 'focus' || mode === 'custom')) {
      const spentSec = initialDurationRef.current - timeLeft;
      if (spentSec >= 120) { // Log if more than 2 minutes elapsed
        const now = new Date();
        const endTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const startTimeStr = sessionStartTimeRef.current
          ? sessionStartTimeRef.current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
          : endTimeStr;

        addSessionRecord({
          date: user.currentDate,
          startTime: startTimeStr,
          endTime: endTimeStr,
          durationSeconds: spentSec,
          mode,
          subjectId: activeSubject?.id,
          subjectName: activeSubject?.name,
          paperId: activePaper?.id,
          paperName: activePaper?.name,
          chapterName: activePaper?.chapters.find(c => c.id === selectedChapterId)?.name,
          taskName: customTask,
          sessionLabel,
          status: 'interrupted',
          notes: 'Session manually interrupted.'
        });
      }
    }

    handleReset();
    if (mode === 'focus') {
      switchMode('short_break');
    } else {
      switchMode('focus');
    }
  };

  // Focus Statistics Calculations
  const stats = useMemo(() => {
    const todayRecords = sessionRecords.filter(r => r.date === user.currentDate);
    const todayFocusSec = todayRecords.reduce((acc, r) => acc + r.durationSeconds, 0);
    const todayHours = (todayFocusSec / 3600).toFixed(1);

    const completed = sessionRecords.filter(r => r.status === 'completed');
    const interrupted = sessionRecords.filter(r => r.status === 'interrupted');
    const totalSessions = sessionRecords.length;

    const totalSeconds = sessionRecords.reduce((acc, r) => acc + r.durationSeconds, 0);
    const avgMin = totalSessions > 0 ? Math.round(totalSeconds / totalSessions / 60) : 0;

    // Weekly calculation (last 7 days)
    const sevenDaysAgo = new Date(`${user.currentDate}T00:00:00`);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklySec = sessionRecords
      .filter(r => new Date(`${r.date}T00:00:00`) >= sevenDaysAgo)
      .reduce((acc, r) => acc + r.durationSeconds, 0);
    const weeklyHours = (weeklySec / 3600).toFixed(1);

    // Monthly calculation (current month)
    const currentMonthPrefix = user.currentDate.substring(0, 7);
    const monthlySec = sessionRecords
      .filter(r => r.date.startsWith(currentMonthPrefix))
      .reduce((acc, r) => acc + r.durationSeconds, 0);
    const monthlyHours = (monthlySec / 3600).toFixed(1);

    return {
      todayHours,
      todaySessions: todayRecords.length,
      totalSessions,
      completedCount: completed.length,
      interruptedCount: interrupted.length,
      avgMin,
      weeklyHours,
      monthlyHours
    };
  }, [sessionRecords, user.currentDate]);

  // Circular progress calculations
  const totalDuration = getModeDurationSeconds(mode);
  const progressRatio = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-[1520px] mx-auto space-y-8 bg-[#F8F6F2] min-h-screen ${isFullScreen ? 'fixed inset-0 z-50 overflow-y-auto bg-[#292724] text-[#F8F6F2] p-6' : ''}`}>
      
      {/* 1. HEADER & CONTROLS */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${isFullScreen ? 'border-white/10' : 'border-[#EFE7DC]'}`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#59483D]" />
            <span className={`text-[11px] font-mono font-bold tracking-widest uppercase ${isFullScreen ? 'text-[#D8C5AE]' : 'text-[#59483D]'}`}>
              HIGH-IMPACT STUDY ENGINE
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight font-serif mt-0.5 ${isFullScreen ? 'text-white' : 'text-[#292724]'}`}>
            FOCUS TIMER
          </h1>
          <p className={`text-xs font-mono tracking-wide ${isFullScreen ? 'text-[#D8C5AE]' : 'text-[#59483D]'}`}>
            POMODORO PRECISION • CONNECTED TO SYLLABUS ROADMAP
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => updateTimerSettings({ soundEnabled: !timerSettings.soundEnabled })}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              timerSettings.soundEnabled 
                ? (isFullScreen ? 'bg-white/10 border-white/20 text-[#D8C5AE]' : 'bg-[#EFE7DC] border-[#D8C5AE] text-[#3B302A]') 
                : (isFullScreen ? 'bg-transparent border-white/10 text-gray-500' : 'bg-white border-[#D8C5AE]/40 text-[#A99A8C]')
            }`}
            title={timerSettings.soundEnabled ? "Mute Chime" : "Enable Chime"}
          >
            {timerSettings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Settings Modal Toggle */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`px-3 py-2 rounded-xl border text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isFullScreen ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-white border-[#D8C5AE]/80 text-[#3B302A] hover:bg-[#EFE7DC]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>

          {/* Full-Screen Mode Toggle */}
          <button
            onClick={() => setIsFullScreen(prev => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              isFullScreen 
                ? 'bg-[#EFE7DC] text-[#292724] hover:bg-white' 
                : 'bg-[#3B302A] text-white hover:bg-[#59483D]'
            }`}
            title="Toggle Immersive Full-Screen"
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullScreen ? 'Exit Focus' : 'Immersive Mode'}</span>
          </button>
        </div>
      </div>

      {/* 2. MODE SELECTOR TABS */}
      <div className="flex items-center justify-center">
        <div className={`p-1.5 rounded-2xl border flex items-center gap-1.5 max-w-md w-full justify-center ${
          isFullScreen ? 'bg-white/5 border-white/10' : 'bg-white border-[#D8C5AE]/80 shadow-xs'
        }`}>
          {(['focus', 'short_break', 'long_break'] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`
                flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer text-center
                ${mode === m 
                  ? (isFullScreen ? 'bg-[#D8C5AE] text-[#292724] shadow-xs' : 'bg-[#3B302A] text-white shadow-xs') 
                  : (isFullScreen ? 'text-gray-400 hover:text-white' : 'text-[#59483D] hover:bg-[#F8F6F2]')}
              `}
            >
              {m === 'focus' && `Focus (${timerSettings.focusDurationMinutes}m)`}
              {m === 'short_break' && `Short Break (${timerSettings.shortBreakMinutes}m)`}
              {m === 'long_break' && `Long Break (${timerSettings.longBreakMinutes}m)`}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CENTRAL TIMER DISPLAY WITH CIRCULAR PROGRESS */}
      <div className={`rounded-3xl border p-8 sm:p-12 text-center relative overflow-hidden transition-all ${
        isFullScreen 
          ? 'bg-transparent border-transparent' 
          : 'bg-white border-[#D8C5AE]/80 shadow-sm'
      }`}>
        
        {/* Circular SVG Ring */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 300 300">
            {/* Background Track */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke={isFullScreen ? '#3B302A' : '#EFE7DC'}
              strokeWidth="12"
              fill="none"
            />
            {/* Active Progress Arc */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke={isFullScreen ? '#D8C5AE' : '#3B302A'}
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Central Countdown Digits */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-6xl sm:text-7xl font-extrabold font-mono tracking-tighter ${
              isFullScreen ? 'text-white' : 'text-[#292724]'
            }`}>
              {timeFormatted}
            </span>

            <span className={`text-xs font-mono font-bold uppercase tracking-widest mt-2 ${
              isFullScreen ? 'text-[#D8C5AE]' : 'text-[#59483D]'
            }`}>
              {mode === 'focus' ? 'DEEP WORK' : mode === 'short_break' ? 'REFRESH BREATH' : 'EXTENDED RECOVERY'}
            </span>

            {/* Active Subject / Task Tag */}
            {activeSubject && (
              <span className={`text-[11px] font-mono mt-1 px-3 py-0.5 rounded-full border truncate max-w-[200px] ${
                isFullScreen ? 'bg-white/10 border-white/20 text-gray-300' : 'bg-[#F8F6F2] border-[#D8C5AE]/60 text-[#59483D]'
              }`}>
                {activeSubject.name} • {activePaper?.name || 'Curriculum'}
              </span>
            )}
          </div>
        </div>

        {/* Primary Timer Controls: Start, Pause, Resume, Reset, Skip */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={handleReset}
            className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
              isFullScreen ? 'border-white/20 text-gray-400 hover:text-white hover:bg-white/10' : 'border-[#D8C5AE] text-[#59483D] hover:bg-[#EFE7DC]'
            }`}
            title="Reset Session"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-8 py-3.5 rounded-2xl bg-[#3B302A] hover:bg-[#59483D] text-white font-mono font-bold text-base flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-102"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{timeLeft < totalDuration ? 'Resume' : 'Start Focus'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-8 py-3.5 rounded-2xl bg-[#59483D] hover:bg-[#3B302A] text-white font-mono font-bold text-base flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Pause className="w-5 h-5 fill-white" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleSkip}
            className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
              isFullScreen ? 'border-white/20 text-gray-400 hover:text-white hover:bg-white/10' : 'border-[#D8C5AE] text-[#59483D] hover:bg-[#EFE7DC]'
            }`}
            title="Skip to next session"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 4. SUBJECT & TASK SELECTION (CONNECTED TO SUBJECT PROGRESS) */}
      <div className={`p-6 rounded-2xl border ${isFullScreen ? 'bg-white/5 border-white/10' : 'bg-white border-[#D8C5AE]/80 shadow-xs'} space-y-4`}>
        <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DC]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#59483D]" />
            <h3 className={`text-sm font-bold font-mono uppercase tracking-wider ${isFullScreen ? 'text-white' : 'text-[#292724]'}`}>
              ACTIVE SYLLABUS & TASK ASSIGNMENT
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#A99A8C]">
            Directly linked to Subject Progress
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Subject Selector */}
          <div>
            <label className={`text-[10px] font-mono uppercase tracking-wider block mb-1.5 ${isFullScreen ? 'text-gray-400' : 'text-[#59483D]'}`}>
              1. Select Subject
            </label>
            <select
              value={selectedSubjId}
              onChange={(e) => {
                const sId = e.target.value;
                setSelectedSubjId(sId);
                const subj = subjects.find(s => s.id === sId);
                if (subj && subj.papers[0]) {
                  setSelectedPaperId(subj.papers[0].id);
                  if (subj.papers[0].chapters[0]) {
                    setSelectedChapterId(subj.papers[0].chapters[0].id);
                  }
                }
              }}
              className="w-full px-3 py-2 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.completedChapters}/{s.totalChapters} Ch)
                </option>
              ))}
            </select>
          </div>

          {/* Paper / Sub-section Selector */}
          <div>
            <label className={`text-[10px] font-mono uppercase tracking-wider block mb-1.5 ${isFullScreen ? 'text-gray-400' : 'text-[#59483D]'}`}>
              2. Select Sub-section (Paper)
            </label>
            <select
              value={selectedPaperId}
              onChange={(e) => {
                const pId = e.target.value;
                setSelectedPaperId(pId);
                const paper = activeSubject?.papers.find(p => p.id === pId);
                if (paper && paper.chapters[0]) {
                  setSelectedChapterId(paper.chapters[0].id);
                }
              }}
              className="w-full px-3 py-2 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
            >
              {(activeSubject?.papers || []).map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.completedChapters}/{p.chapters.length} Ch)
                </option>
              ))}
            </select>
          </div>

          {/* Chapter Selector */}
          <div>
            <label className={`text-[10px] font-mono uppercase tracking-wider block mb-1.5 ${isFullScreen ? 'text-gray-400' : 'text-[#59483D]'}`}>
              3. Select Chapter (Optional)
            </label>
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
            >
              <option value="">— General Study / Practice —</option>
              {(activePaper?.chapters || []).map(ch => (
                <option key={ch.id} value={ch.id}>
                  CH {String(ch.chapterNumber).padStart(2, '0')}: {ch.name} {ch.completed ? '✓' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Task Description & Session Label */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className={`text-[10px] font-mono uppercase tracking-wider block mb-1.5 ${isFullScreen ? 'text-gray-400' : 'text-[#59483D]'}`}>
              Task Objective
            </label>
            <input
              type="text"
              value={customTask}
              onChange={(e) => setCustomTask(e.target.value)}
              placeholder="e.g. Solve Past 5 Years Board CQs, Memorize formulas..."
              className="w-full px-3 py-2 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
            />
          </div>

          <div>
            <label className={`text-[10px] font-mono uppercase tracking-wider block mb-1.5 ${isFullScreen ? 'text-gray-400' : 'text-[#59483D]'}`}>
              Session Label
            </label>
            <input
              type="text"
              value={sessionLabel}
              onChange={(e) => setSessionLabel(e.target.value)}
              placeholder="e.g. Morning Deep Work 01"
              className="w-full px-3 py-2 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-xl text-[#292724] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 5. FOCUS STATISTICS (TODAY, WEEKLY, MONTHLY, COMPLETED/INTERRUPTED) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-4 text-center">
          <span className="text-[10px] font-mono text-[#A99A8C] uppercase block">Today Focus</span>
          <span className="text-xl font-bold font-mono text-[#292724] block mt-0.5">{stats.todayHours} hrs</span>
          <span className="text-[9px] font-mono text-[#59483D]">Target: {timerSettings.dailyTargetHours} hrs</span>
        </div>

        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-4 text-center">
          <span className="text-[10px] font-mono text-[#A99A8C] uppercase block">Today Sessions</span>
          <span className="text-xl font-bold font-mono text-[#3B302A] block mt-0.5">{stats.todaySessions}</span>
          <span className="text-[9px] font-mono text-[#59483D]">Daily Goal: {timerSettings.dailyTargetSessions}</span>
        </div>

        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-4 text-center">
          <span className="text-[10px] font-mono text-[#A99A8C] uppercase block">Completed</span>
          <span className="text-xl font-bold font-mono text-emerald-800 block mt-0.5">{stats.completedCount}</span>
          <span className="text-[9px] font-mono text-[#A99A8C]">Full Duration</span>
        </div>

        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-4 text-center">
          <span className="text-[10px] font-mono text-[#A99A8C] uppercase block">Interrupted</span>
          <span className="text-xl font-bold font-mono text-amber-800 block mt-0.5">{stats.interruptedCount}</span>
          <span className="text-[9px] font-mono text-[#A99A8C]">Early Exit</span>
        </div>

        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-4 text-center">
          <span className="text-[10px] font-mono text-[#A99A8C] uppercase block">Avg Duration</span>
          <span className="text-xl font-bold font-mono text-[#292724] block mt-0.5">{stats.avgMin} min</span>
          <span className="text-[9px] font-mono text-[#A99A8C]">Per Session</span>
        </div>

        <div className="bg-white rounded-xl border border-[#D8C5AE]/70 p-4 text-center">
          <span className="text-[10px] font-mono text-[#A99A8C] uppercase block">This Week</span>
          <span className="text-xl font-bold font-mono text-[#59483D] block mt-0.5">{stats.weeklyHours} hrs</span>
          <span className="text-[9px] font-mono text-[#A99A8C]">Month: {stats.monthlyHours}h</span>
        </div>
      </div>

      {/* 6. SESSION LOGGING & RECORD MANAGEMENT TABLE */}
      <div className="bg-white rounded-2xl border border-[#D8C5AE]/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DC]">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
              STUDY AUDIT TRAIL
            </span>
            <h3 className="text-base font-bold text-[#292724] mt-0.5">
              SESSION RECORDS & MANUAL CORRECTIONS
            </h3>
          </div>
          <span className="text-xs font-mono text-[#A99A8C]">
            {sessionRecords.length} Recorded Sessions
          </span>
        </div>

        {sessionRecords.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-[#A99A8C]">
            No study sessions logged yet. Hit "Start Focus" to log your first session.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-[#EFE7DC] text-[#A99A8C] text-[10px] uppercase">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Subject & Paper</th>
                  <th className="py-2.5 px-3">Chapter / Task</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE7DC]">
                {sessionRecords.map((rec) => {
                  const durationMin = Math.round(rec.durationSeconds / 60);

                  return (
                    <tr key={rec.id} className="hover:bg-[#F8F6F2]/70 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-[#292724] whitespace-nowrap">
                        {rec.date}
                      </td>
                      <td className="py-2.5 px-3 text-[#59483D] whitespace-nowrap">
                        {rec.startTime}–{rec.endTime}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-[#3B302A] whitespace-nowrap">
                        {editingSessionId === rec.id ? (
                          <input
                            type="number"
                            min="1"
                            max="300"
                            value={editDurationMin}
                            onChange={(e) => setEditDurationMin(Number(e.target.value))}
                            className="w-16 px-1.5 py-0.5 text-xs bg-white border border-[#3B302A] rounded"
                          />
                        ) : (
                          `${durationMin}m`
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-[#292724]">
                        <span className="font-semibold block">{rec.subjectName || 'Study'}</span>
                        <span className="text-[10px] text-[#A99A8C]">{rec.paperName || 'General'}</span>
                      </td>
                      <td className="py-2.5 px-3 text-[#59483D] max-w-xs truncate">
                        {rec.taskName || rec.chapterName || 'Self-study'}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          rec.status === 'completed' ? 'bg-[#EFE7DC] text-[#3B302A]' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        {editingSessionId === rec.id ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                updateSessionRecord(rec.id, { durationSeconds: editDurationMin * 60, notes: editNotes });
                                setEditingSessionId(null);
                              }}
                              className="p-1 text-white bg-[#3B302A] rounded hover:bg-[#59483D]"
                              title="Save Changes"
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
                                setEditNotes(rec.notes || '');
                              }}
                              className="p-1 text-[#A99A8C] hover:text-[#292724] rounded hover:bg-[#EFE7DC]"
                              title="Edit duration"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Delete this session record?")) {
                                  deleteSessionRecord(rec.id);
                                }
                              }}
                              className="p-1 text-[#A99A8C] hover:text-red-700 rounded hover:bg-red-50"
                              title="Delete record"
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
        )}
      </div>

      {/* 7. SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div 
            className="bg-white w-full max-w-lg rounded-2xl border border-[#D8C5AE] shadow-xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DC]">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                  ADMINISTRATOR CONFIGURATION
                </span>
                <h3 className="text-lg font-bold text-[#292724] mt-0.5">
                  Focus Timer Settings
                </h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 text-[#A99A8C] hover:text-[#292724]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                    Focus Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={timerSettings.focusDurationMinutes}
                    onChange={(e) => updateTimerSettings({ focusDurationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-lg text-[#292724]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                    Short Break (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={timerSettings.shortBreakMinutes}
                    onChange={(e) => updateTimerSettings({ shortBreakMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-lg text-[#292724]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                    Long Break (Minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="90"
                    value={timerSettings.longBreakMinutes}
                    onChange={(e) => updateTimerSettings({ longBreakMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-lg text-[#292724]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                    Long Break Interval
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={timerSettings.longBreakInterval}
                    onChange={(e) => updateTimerSettings({ longBreakInterval: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-lg text-[#292724]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                    Daily Focus Target (Hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="18"
                    value={timerSettings.dailyTargetHours}
                    onChange={(e) => updateTimerSettings({ dailyTargetHours: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-lg text-[#292724]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold text-[#59483D] block mb-1">
                    Daily Session Target
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={timerSettings.dailyTargetSessions}
                    onChange={(e) => updateTimerSettings({ dailyTargetSessions: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE] rounded-lg text-[#292724]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#EFE7DC] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timerSettings.autoStartBreaks}
                    onChange={(e) => updateTimerSettings({ autoStartBreaks: e.target.checked })}
                    className="rounded text-[#3B302A]"
                  />
                  <span className="text-xs font-mono text-[#59483D]">Auto-start break countdown</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timerSettings.autoTransition}
                    onChange={(e) => updateTimerSettings({ autoTransition: e.target.checked })}
                    className="rounded text-[#3B302A]"
                  />
                  <span className="text-xs font-mono text-[#59483D]">Auto-transition between focus and breaks</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#EFE7DC]">
              <button
                onClick={() => {
                  setTimeLeft(getModeDurationSeconds(mode));
                  setIsSettingsOpen(false);
                }}
                className="px-4 py-2 bg-[#3B302A] hover:bg-[#59483D] text-white text-xs font-mono font-bold rounded-xl"
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
