import React, { useState } from 'react';
import { 
  Target, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Calendar as CalendarIcon, 
  ArrowUp, 
  ArrowDown, 
  Globe, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  Sparkles,
  Save
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { Mission, MajorMilestone, DateConfirmationStatus } from '../types/tracker';

export const MissionsView: React.FC = () => {
  const { 
    missions, 
    addMission,
    deleteMission,
    reorderMissions,
    majorMilestones,
    updateMajorMilestone,
    addMajorMilestone,
    deleteMajorMilestone,
    toggleMajorMilestoneVisibility,
    setActiveMissionModal, 
    setActiveDateModal,
    toggleMilestone,
    getCountdownDetails
  } = useTracker();

  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneCategory, setNewMilestoneCategory] = useState('Standardized Test');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    addMajorMilestone({
      title: newMilestoneTitle.trim(),
      category: newMilestoneCategory,
      targetDate: newMilestoneDate || '',
      dateStatus: newMilestoneDate ? 'PLANNED' : 'NOT SET',
      status: 'UPCOMING',
      progressPercentage: 0,
      description: newMilestoneDesc.trim() || 'Custom academic milestone target.',
      isVisible: true
    });

    setNewMilestoneTitle('');
    setNewMilestoneDate('');
    setNewMilestoneDesc('');
    setIsAddMilestoneOpen(false);
  };

  const handleCreateMission = () => {
    addMission({
      title: 'New Academic Target',
      code: 'TARGET',
      goal: 'Achieve Target Outcome',
      category: 'Academic Goal',
      targetDate: '2027-06-01',
      dateStatus: 'TENTATIVE',
      progressPercentage: 0,
      status: 'Not Started',
      subtext: 'Not Started',
      targetDescription: 'Target description and action plan.',
      targetScore: '100%',
      deadline: '2027-06-01',
      milestones: [
        { id: `ms-${Date.now()}-1`, title: 'Preparation and materials gathering', completed: false },
        { id: `ms-${Date.now()}-2`, title: 'Core practice tests and revision', completed: false }
      ],
      colorAccent: 'espresso',
      order: missions.length + 1
    });
  };

  const getAccentColors = (color: string) => {
    switch (color) {
      case 'beige':
        return { border: 'border-[#D8C5AE]', tag: 'bg-[#D8C5AE]/20 text-[#59483D]', bar: 'bg-[#C4AE95]' };
      case 'brown':
        return { border: 'border-[#59483D]', tag: 'bg-[#59483D]/10 text-[#3B302A]', bar: 'bg-[#59483D]' };
      case 'taupe':
        return { border: 'border-[#A99A8C]', tag: 'bg-[#A99A8C]/15 text-[#4A423B]', bar: 'bg-[#8F8073]' };
      case 'espresso':
      default:
        return { border: 'border-[#3B302A]', tag: 'bg-[#3B302A]/10 text-[#292724]', bar: 'bg-[#3B302A]' };
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1560px] mx-auto space-y-10 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200/70">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-[#8A7968] uppercase bg-[#EFE7DC]/60 px-2.5 py-0.5 rounded">
            TARGET DEFINITIONS & ROADMAP
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1.5">
            Comeback Missions & Major Milestones
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-0.5">
            Academic Goals • Major Milestones • Admin Date & Score Controls
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs font-mono text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            Average Target Progress: <strong className="text-gray-900">{Math.round(missions.reduce((acc, m) => acc + m.progressPercentage, 0) / Math.max(1, missions.length))}%</strong>
          </div>
          <button
            onClick={handleCreateMission}
            className="px-3.5 py-1.5 bg-[#3B302A] hover:bg-[#2E2520] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Mission</span>
          </button>
          <button
            onClick={() => setIsAddMilestoneOpen(true)}
            className="px-3.5 py-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Milestone</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: THE FOUR PRIMARY MISSIONS */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-gray-900 font-mono tracking-widest uppercase">
              THE 4 PRIMARY MISSIONS
            </h2>
            <span className="text-[11px] font-mono text-gray-400">
              Core Academic Priorities
            </span>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            Owner privileges active: Use reorder arrows or configure targets
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {missions.map((mission: Mission, index: number) => {
            const completedMilestones = mission.milestones.filter(m => m.completed).length;
            const colors = getAccentColors(mission.colorAccent || 'espresso');
            const countdown = getCountdownDetails(mission.targetDate, mission.dateStatus);

            return (
              <div
                key={mission.id}
                className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header with Reorder arrows */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase">
                        MISSION 0{index + 1}
                      </span>
                      {/* Reorder Buttons */}
                      <div className="flex items-center gap-0.5 ml-1">
                        <button
                          onClick={() => index > 0 && reorderMissions(index, index - 1)}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                          title="Move Left / Up"
                        >
                          <ArrowUp className="w-3 h-3 rotate-270 md:rotate-0" />
                        </button>
                        <button
                          onClick={() => index < missions.length - 1 && reorderMissions(index, index + 1)}
                          disabled={index === missions.length - 1}
                          className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                          title="Move Right / Down"
                        >
                          <ArrowDown className="w-3 h-3 rotate-270 md:rotate-0" />
                        </button>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      mission.dateStatus === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : mission.dateStatus === 'TENTATIVE'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : mission.dateStatus === 'PLANNED'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>
                      {mission.dateStatus === 'NOT SET' ? 'DATE NOT SET' : mission.dateStatus}
                    </span>
                  </div>

                  {/* Title & Goal */}
                  <div className="mt-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {mission.title}
                    </h3>
                    <p className="text-xs text-gray-600 font-mono mt-0.5">
                      {mission.goal}
                    </p>
                    <span className="text-[10px] font-mono text-gray-400 uppercase block mt-1">
                      {mission.category}
                    </span>
                  </div>

                  {/* Countdown Box */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-between min-h-[64px]">
                    {countdown.isUnset ? (
                      <div>
                        <span className="text-xs font-bold text-gray-400 font-mono uppercase">
                          DATE NOT SET
                        </span>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                          Configure date to enable countdown
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-gray-400 uppercase block">Remaining</span>
                          <span className="text-xl font-extrabold font-mono text-gray-900">{countdown.days} Days</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-gray-400 uppercase block">Target Date</span>
                          <span className="text-xs font-mono font-semibold text-gray-700">{countdown.formattedDate}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1 font-mono">
                      <span className="text-gray-500 font-medium">{mission.status}</span>
                      <span className="font-bold text-gray-900">{mission.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors.bar} rounded-full transition-all duration-300`}
                        style={{ width: `${mission.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Milestones preview */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                      <span>Key Milestones</span>
                      <span>{completedMilestones}/{mission.milestones.length}</span>
                    </div>

                    {mission.milestones.slice(0, 3).map((ms) => (
                      <button
                        key={ms.id}
                        onClick={() => toggleMilestone(mission.id, ms.id)}
                        className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 text-left transition-colors cursor-pointer group"
                      >
                        {ms.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-gray-300 shrink-0 group-hover:text-gray-500" />
                        )}
                        <span className={`text-xs ${ms.completed ? 'line-through text-gray-400' : 'text-gray-700'} truncate`}>
                          {ms.title}
                        </span>
                      </button>
                    ))}
                  </div>

                </div>

                {/* Footer buttons */}
                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2">
                  <button
                    onClick={() => setActiveDateModal({
                      type: 'mission',
                      id: mission.id,
                      title: mission.title,
                      category: mission.category,
                      currentDate: mission.targetDate,
                      currentStatus: mission.dateStatus,
                      history: mission.dateHistory
                    })}
                    className="flex-1 py-1.5 px-2 bg-gray-50 hover:bg-gray-100 border border-gray-200/80 rounded-lg text-xs font-mono font-medium text-gray-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
                    <span>Edit Date</span>
                  </button>

                  <button
                    onClick={() => setActiveMissionModal(mission)}
                    className="py-1.5 px-3 bg-black hover:bg-gray-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Configure</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete mission "${mission.title}"?`)) {
                        deleteMission(mission.id);
                      }
                    }}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-colors cursor-pointer"
                    title="Delete mission"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: MAJOR MILESTONES (USA APPLICATION & FUTURE) */}
      {/* ========================================================= */}
      <section className="space-y-4 pt-4 border-t border-gray-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-[#8A7968]" />
            <h2 className="text-xs font-bold text-gray-900 font-mono tracking-widest uppercase">
              MAJOR MILESTONES (SEPARATE ACADEMIC TARGETS)
            </h2>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {majorMilestones.length} Milestones Configured
          </span>
        </div>

        <div className="space-y-4">
          {majorMilestones.map((milestone: MajorMilestone) => {
            const countdown = getCountdownDetails(milestone.targetDate, milestone.dateStatus);

            return (
              <div 
                key={milestone.id}
                className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#8A7968] uppercase bg-[#EFE7DC]/60 px-2.5 py-0.5 rounded">
                      {milestone.category}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      milestone.dateStatus === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : milestone.dateStatus === 'TENTATIVE'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : milestone.dateStatus === 'PLANNED'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>
                      {milestone.dateStatus}
                    </span>
                    {!milestone.isVisible && (
                      <span className="text-[10px] font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        Hidden on Dashboard
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">
                    {milestone.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
                    {milestone.description}
                  </p>

                  {/* Progress slider */}
                  <div className="pt-2 max-w-md">
                    <div className="flex items-center justify-between text-xs font-mono mb-1 text-gray-600">
                      <span>Preparation Progress</span>
                      <span className="font-bold text-gray-900">{milestone.progressPercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={milestone.progressPercentage}
                      onChange={(e) => updateMajorMilestone(milestone.id, { progressPercentage: Number(e.target.value) })}
                      className="w-full accent-black cursor-pointer"
                    />
                  </div>
                </div>

                {/* Right Zone: Countdown & Admin Controls */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 bg-gray-50 p-4 rounded-xl border border-gray-200/80">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block lg:text-right">
                      COUNTDOWN STATUS
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-2xl font-extrabold font-mono text-gray-900 tabular-nums">
                        {countdown.isUnset ? 'NOT SET' : countdown.days}
                      </span>
                      {!countdown.isUnset && (
                        <span className="text-xs font-mono text-gray-500">Days Remaining</span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-gray-600 block lg:text-right mt-0.5">
                      Target: {countdown.formattedDate}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveDateModal({
                        type: 'milestone',
                        id: milestone.id,
                        title: milestone.title,
                        category: milestone.category,
                        currentDate: milestone.targetDate,
                        currentStatus: milestone.dateStatus,
                        history: milestone.dateHistory
                      })}
                      className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-mono font-medium text-gray-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
                      <span>Edit Date</span>
                    </button>

                    <button
                      onClick={() => toggleMajorMilestoneVisibility(milestone.id)}
                      className="p-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-600 hover:text-black transition-colors cursor-pointer"
                      title={milestone.isVisible ? "Hide on Overview Dashboard" : "Show on Overview Dashboard"}
                    >
                      {milestone.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                    </button>

                    {majorMilestones.length > 1 && (
                      <button
                        onClick={() => deleteMajorMilestone(milestone.id)}
                        className="p-1.5 bg-white hover:bg-rose-50 border border-gray-200 hover:border-rose-200 rounded-lg text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete milestone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* Modal: Add Custom Major Milestone */}
      {isAddMilestoneOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsAddMilestoneOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-lg rounded-2xl border border-gray-200 shadow-2xl p-6 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div>
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                ADD FUTURE MILESTONE
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-1">
                Create Academic Milestone
              </h3>
            </div>

            <form onSubmit={handleCreateMilestone} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold text-gray-700 uppercase block mb-1">
                  Milestone Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Canadian University Admission Round 1"
                  value={newMilestoneTitle}
                  onChange={e => setNewMilestoneTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-gray-700 uppercase block mb-1">
                    Category
                  </label>
                  <select
                    value={newMilestoneCategory}
                    onChange={e => setNewMilestoneCategory(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="International University Applications">International Applications</option>
                    <option value="Standardized Test">Standardized Test</option>
                    <option value="Board Examination">Board Examination</option>
                    <option value="University Admission">University Admission</option>
                    <option value="Academic Project">Academic Project</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-gray-700 uppercase block mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={newMilestoneDate}
                    onChange={e => setNewMilestoneDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-gray-700 uppercase block mb-1">
                  Description / Strategy Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Key deliverables, documentation deadlines, and requirements..."
                  value={newMilestoneDesc}
                  onChange={e => setNewMilestoneDesc(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddMilestoneOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
