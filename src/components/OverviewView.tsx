import React, { useMemo, useState } from 'react';
import { Edit3 } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { DateConfirmationStatus } from '../types/tracker';

export const OverviewView: React.FC = () => {
  const {
    user,
    missions,
    majorMilestones,
    updateMissionDate,
    updateMilestoneDate,
    habits,
    subjects,
    monthlyAssignments,
    sessionRecords,
    timerSettings,
    setActiveTab,
    setActiveMissionModal,
  } = useTracker();

  const satMission = missions.find(m => m.id === 'mission-sat') || missions[0];
  const hscMission = missions.find(m => m.id === 'mission-hsc') || missions[1];
  const ieltsMission = missions.find(m => m.id === 'mission-ielts') || missions[2];
  const usaMilestone = majorMilestones[0];

  const subjectPct = (subj?: typeof subjects[0]) => {
    if (!subj || !subj.totalChapters) return 0;
    return Math.round((subj.completedChapters / subj.totalChapters) * 100);
  };

  const overallSyllabusPct = useMemo(() => {
    const total = subjects.reduce((a, s) => a + (s.totalChapters || 0), 0);
    const done = subjects.reduce((a, s) => a + (s.completedChapters || 0), 0);
    return total === 0 ? 0 : Math.round((done / total) * 100);
  }, [subjects]);

  const satPct = satMission?.progressPercentage ?? 0;
  const hscPct = hscMission?.progressPercentage ?? overallSyllabusPct;
  const usaPct = usaMilestone?.progressPercentage ?? 0;

  const todayKey = user?.currentDate || new Date().toISOString().slice(0, 10);
  const habitsDone = habits.filter(h => h.history?.[todayKey]).length;
  const habitsPct = habits.length === 0 ? 0 : Math.round((habitsDone / habits.length) * 100);

  const todayStudySeconds = useMemo(
    () => (sessionRecords || []).filter(r => r.date === todayKey && r.status === 'completed').reduce((a, r) => a + (r.durationSeconds || 0), 0),
    [sessionRecords, todayKey]
  );
  const dailyTargetSecs = ((timerSettings as any)?.dailyTargetHours || 4) * 3600;
  const todayStudyPct = dailyTargetSecs === 0 ? 0 : Math.min(100, Math.round((todayStudySeconds / dailyTargetSecs) * 100));
  const formatStudy = (secs: number) => `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m`;

  const monthOrder = [
    { key: 'nov-2026', name: 'November' },
    { key: 'dec-2026', name: 'December' },
    { key: 'jan-2027', name: 'January' },
    { key: 'feb-2027', name: 'February' },
    { key: 'mar-2027', name: 'March' },
  ];
  const monthlyCounts = monthOrder.map(({ key, name }) => {
    const items = monthlyAssignments.filter(a => a.monthKey === key);
    const count = items.length;
    const done = items.filter(a => a.completed || a.status === 'COMPLETED').length;
    const pct = count === 0 ? 0 : Math.round((done / count) * 100);
    return { name, count, pct };
  });

  const [popoverTarget, setPopoverTarget] = useState<{
    id: string; type: 'mission' | 'milestone'; title: string; currentDate: string; status: DateConfirmationStatus;
  } | null>(null);
  const [popoverDate, setPopoverDate] = useState('');
  const [popoverStatus, setPopoverStatus] = useState<DateConfirmationStatus>('TENTATIVE');

  const openDatePopover = (id: string, type: 'mission' | 'milestone', title: string, currentDate: string, status: DateConfirmationStatus) => {
    setPopoverDate(currentDate || '');
    setPopoverStatus(status || 'TENTATIVE');
    setPopoverTarget({ id, type, title, currentDate, status });
  };

  const handleSavePopoverDate = () => {
    if (!popoverTarget) return;
    if (popoverTarget.type === 'mission') updateMissionDate(popoverTarget.id, popoverDate, popoverStatus);
    else updateMilestoneDate(popoverTarget.id, popoverDate, popoverStatus);
    setPopoverTarget(null);
  };

  return (
    <div className="p-4 sm:p-5 lg:p-6 max-w-[1720px] mx-auto space-y-6 bg-[#F8F5F0] text-gray-900 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview Dashboard</h1>
          <p className="text-sm text-gray-500 font-mono mt-1">All percentages are live — correlated with Subjects, Missions, Habits & Timer.</p>
        </div>
        <span className="text-xs font-mono text-gray-500">{todayKey}</span>
      </div>

      <section className="space-y-2">
        <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase">Mission Command</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { m: satMission, pct: satPct, label: 'SAT 1550+', bg: 'bg-[#F3EDE4]', bar: 'bg-black', track: 'bg-[#DED6CA]' },
            { m: hscMission, pct: hscPct, label: 'HSC GPA 5.00', bg: 'bg-[#2E2520] text-white', bar: 'bg-white', track: 'bg-[#4A3E37]' },
            { m: ieltsMission, pct: ieltsMission?.progressPercentage ?? 0, label: ieltsMission?.title || 'IELTS', bg: 'bg-white', bar: 'bg-black', track: 'bg-gray-200' },
          ].map(({ m, pct, label, bg, bar, track }) => (
            <div key={m?.id || label} className={`${bg} border border-[#E5DDD2] rounded-2xl p-4 shadow-2xs space-y-2`}>
              <h3 className="text-lg font-bold tracking-tight">{m?.title || label}</h3>
              <p className="text-[11px] font-mono opacity-80">Status: {m?.status || 'Not Started'} · Date: {m?.targetDate || 'NOT SET'} ({m?.dateStatus || '—'})</p>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span>Progress</span>
                <span className="font-bold">{pct}%</span>
              </div>
              <div className={`w-full h-1.5 ${track} rounded-full overflow-hidden`}>
                <div className={`h-full ${bar} rounded-full`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => m && openDatePopover(m.id, 'mission', m.title, m.targetDate || '', m.dateStatus || 'TENTATIVE')}
                  className="px-2.5 py-1.5 text-[11px] font-mono font-bold rounded-lg bg-black/10 hover:bg-black/20 cursor-pointer flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit date
                </button>
                <button
                  onClick={() => m && setActiveMissionModal(m)}
                  className="px-2.5 py-1.5 text-[11px] font-mono font-bold rounded-lg bg-black/10 hover:bg-black/20 cursor-pointer"
                >
                  Edit mission
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {usaMilestone && (
        <section className="bg-white border border-[#EAE6DE] rounded-2xl p-4 space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase">Major Milestone</span>
          <h3 className="text-lg font-bold">{usaMilestone.title}</h3>
          <p className="text-[11px] font-mono text-gray-600">Target: {usaMilestone.targetDate || 'NOT SET'} · {usaMilestone.dateStatus}</p>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span>Progress</span>
            <span className="font-bold">{usaPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-black rounded-full" style={{ width: `${usaPct}%` }} />
          </div>
          <button
            onClick={() => openDatePopover(usaMilestone.id, 'milestone', usaMilestone.title, usaMilestone.targetDate || '', usaMilestone.dateStatus || 'PLANNED')}
            className="px-2.5 py-1.5 text-[11px] font-mono font-bold rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer inline-flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" /> Edit date
          </button>
        </section>
      )}

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Today's Study Time", value: formatStudy(todayStudySeconds), pct: todayStudyPct },
          { label: 'Habit Completion', value: `${habitsPct}%`, pct: habitsPct },
          { label: 'Overall Syllabus', value: `${overallSyllabusPct}%`, pct: overallSyllabusPct },
          { label: 'Subjects tracked', value: String(subjects.length), pct: overallSyllabusPct },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#EAE6DE] rounded-2xl p-3 space-y-1">
            <span className="text-[10px] text-gray-500 font-sans block truncate">{s.label}</span>
            <span className="text-lg font-bold font-mono text-gray-900 block leading-tight">{s.value}</span>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-black rounded-full" style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase">Subject Progress</span>
          <button onClick={() => setActiveTab('subjects')} className="text-[10px] font-mono font-bold text-gray-700 hover:text-black cursor-pointer uppercase">View all subjects</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {subjects.length === 0 && (
            <div className="col-span-2 text-[11px] text-gray-500 font-mono p-3 bg-white rounded-xl border">No subjects yet — add them in Subjects.</div>
          )}
          {subjects.map(subj => {
            const pct = subjectPct(subj);
            return (
              <div key={subj.id} onClick={() => setActiveTab('subjects')} className="p-3 bg-white hover:bg-[#FAF7F2] rounded-xl border border-gray-100 cursor-pointer space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900 truncate">{subj.name}</span>
                  <span className="text-[10px] font-mono font-bold text-gray-600">{pct}%</span>
                </div>
                <span className="text-[9px] text-gray-400 font-mono block">{subj.completedChapters}/{subj.totalChapters} chapters</span>
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-800 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase">Monthly Study Targets</span>
          <button onClick={() => setActiveTab('targets')} className="text-[10px] font-mono font-bold text-gray-700 hover:text-black cursor-pointer uppercase">Open targets</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {monthlyCounts.map(m => (
            <div key={m.name} className="bg-white border border-[#EAE6DE] rounded-xl p-3 space-y-1">
              <span className="text-xs font-bold">{m.name}</span>
              <p className="text-[10px] font-mono text-gray-500">{m.count} assignments</p>
              <div className="flex justify-between text-[10px] font-mono"><span>Done</span><span className="font-bold">{m.pct}%</span></div>
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-black rounded-full" style={{ width: `${m.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {popoverTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-3 shadow-xl">
            <h3 className="font-bold text-lg">Edit date — {popoverTarget.title}</h3>
            <label className="block text-xs font-mono text-gray-500">Date (YYYY-MM-DD)</label>
            <input type="date" value={popoverDate} onChange={e => setPopoverDate(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
            <label className="block text-xs font-mono text-gray-500">Status</label>
            <select value={popoverStatus} onChange={e => setPopoverStatus(e.target.value as DateConfirmationStatus)} className="w-full border rounded-lg px-3 py-2 text-sm font-mono">
              {['CONFIRMED', 'TENTATIVE', 'PLANNED', 'NOT SET'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="flex gap-2 pt-2">
              <button onClick={handleSavePopoverDate} className="flex-1 bg-black text-white rounded-lg py-2 text-sm font-bold cursor-pointer">Save</button>
              <button onClick={() => setPopoverTarget(null)} className="flex-1 bg-gray-100 rounded-lg py-2 text-sm font-bold cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
