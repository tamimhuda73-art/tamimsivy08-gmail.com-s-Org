import React, { useState } from 'react';
import { X, CheckCircle2, Circle, Plus, Trash2, Calendar as CalendarIcon, Edit3 } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { Mission } from '../../types/tracker';

export const MissionModal: React.FC = () => {
  const { 
    activeMissionModal, 
    setActiveMissionModal, 
    updateMission, 
    deleteMission,
    toggleMilestone,
    setActiveDateModal
  } = useTracker();
  const [newMilestoneText, setNewMilestoneText] = useState('');

  if (!activeMissionModal) return null;

  const mission = activeMissionModal;

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneText.trim()) return;

    const newMilestone = {
      id: `ms-${Date.now()}`,
      title: newMilestoneText.trim(),
      completed: false
    };

    const updatedMilestones = [...mission.milestones, newMilestone];
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const newPct = Math.round((completedCount / updatedMilestones.length) * 100);

    updateMission(mission.id, {
      milestones: updatedMilestones,
      progressPercentage: newPct
    });

    setActiveMissionModal({
      ...mission,
      milestones: updatedMilestones,
      progressPercentage: newPct
    });

    setNewMilestoneText('');
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    const updated = mission.milestones.filter(m => m.id !== milestoneId);
    const completedCount = updated.filter(m => m.completed).length;
    const newPct = updated.length > 0 ? Math.round((completedCount / updated.length) * 100) : 0;

    updateMission(mission.id, {
      milestones: updated,
      progressPercentage: newPct
    });

    setActiveMissionModal({
      ...mission,
      milestones: updated,
      progressPercentage: newPct
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl border border-gray-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold tracking-wider text-gray-400 uppercase">
                MISSION TARGET CONFIGURATION
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold border border-gray-200">
                {mission.dateStatus || 'NOT SET'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1">
              {mission.title}
            </h2>
            <div className="flex items-center gap-3 mt-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveDateModal({
                    type: 'mission',
                    id: mission.id,
                    title: mission.title,
                    category: mission.category,
                    currentDate: mission.targetDate,
                    currentStatus: mission.dateStatus,
                    history: mission.dateHistory
                  });
                }}
                className="text-xs font-mono font-semibold text-gray-700 hover:text-black bg-gray-50 hover:bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
                <span>Date: {mission.targetDate ? mission.targetDate : 'DATE NOT SET'} (Edit)</span>
              </button>
            </div>
          </div>
          <button
            onClick={() => setActiveMissionModal(null)}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Progress Slider */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">Completion Progress</span>
              <span className="text-sm font-bold font-mono text-gray-900">{mission.progressPercentage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={mission.progressPercentage}
              onChange={(e) => {
                const val = Number(e.target.value);
                updateMission(mission.id, { progressPercentage: val });
                setActiveMissionModal({ ...mission, progressPercentage: val });
              }}
              className="w-full accent-black cursor-pointer"
            />
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-3">
              <div 
                className="h-full bg-black rounded-full transition-all"
                style={{ width: `${mission.progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Mission Title & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-gray-500 uppercase mb-1">
                Mission Title
              </label>
              <input
                type="text"
                value={mission.title}
                onChange={(e) => {
                  updateMission(mission.id, { title: e.target.value });
                  setActiveMissionModal({ ...mission, title: e.target.value });
                }}
                className="w-full px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-semibold text-gray-500 uppercase mb-1">
                Category
              </label>
              <input
                type="text"
                value={mission.category}
                onChange={(e) => {
                  updateMission(mission.id, { category: e.target.value });
                  setActiveMissionModal({ ...mission, category: e.target.value });
                }}
                className="w-full px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Target Score & Current Score */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-gray-500 uppercase mb-1">
                Target Score / Main Goal
              </label>
              <input
                type="text"
                value={mission.targetScore}
                onChange={(e) => {
                  updateMission(mission.id, { targetScore: e.target.value, goal: e.target.value });
                  setActiveMissionModal({ ...mission, targetScore: e.target.value, goal: e.target.value });
                }}
                className="w-full px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-semibold text-gray-500 uppercase mb-1">
                Current Standing
              </label>
              <input
                type="text"
                value={mission.currentScore || ''}
                onChange={(e) => {
                  updateMission(mission.id, { currentScore: e.target.value });
                  setActiveMissionModal({ ...mission, currentScore: e.target.value });
                }}
                className="w-full px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-black"
                placeholder="e.g. Diagnostic / In Progress"
              />
            </div>
          </div>

          {/* Milestones Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono font-bold tracking-wider text-gray-700 uppercase">
                Step-by-Step Milestones
              </h4>
              <span className="text-[11px] font-mono text-gray-400">
                {mission.milestones.filter(m => m.completed).length}/{mission.milestones.length} Done
              </span>
            </div>

            <div className="space-y-2">
              {mission.milestones.map((ms) => (
                <div
                  key={ms.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50/80 transition-colors group"
                >
                  <button
                    onClick={() => {
                      toggleMilestone(mission.id, ms.id);
                      const updated = mission.milestones.map(m => m.id === ms.id ? { ...m, completed: !m.completed } : m);
                      const completedCount = updated.filter(m => m.completed).length;
                      const newPct = Math.round((completedCount / updated.length) * 100);
                      setActiveMissionModal({
                        ...mission,
                        milestones: updated,
                        progressPercentage: newPct
                      });
                    }}
                    className="flex items-center gap-3 text-left cursor-pointer flex-1"
                  >
                    {ms.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-gray-500" />
                    )}
                    <span className={`text-xs ${ms.completed ? 'line-through text-gray-400 font-normal' : 'text-gray-800 font-medium'}`}>
                      {ms.title}
                    </span>
                  </button>

                  <button
                    onClick={() => handleDeleteMilestone(ms.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-opacity cursor-pointer"
                    title="Remove milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Milestone form */}
            <form onSubmit={handleAddMilestone} className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Add milestone step..."
                value={newMilestoneText}
                onChange={e => setNewMilestoneText(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-black"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Strategic Notes */}
          {mission.notes && (
            <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl text-xs text-amber-900 leading-relaxed">
              <span className="font-semibold block mb-0.5">Strategy Note:</span>
              {mission.notes}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete mission "${mission.title}"?`)) {
                deleteMission(mission.id);
                setActiveMissionModal(null);
              }
            }}
            className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Mission</span>
          </button>
          <button
            onClick={() => setActiveMissionModal(null)}
            className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
