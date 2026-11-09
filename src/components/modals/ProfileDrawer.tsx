import React from 'react';
import { X, RotateCcw, ShieldCheck, Mail, Calendar, Sparkles } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';

export const ProfileDrawer: React.FC = () => {
  const { 
    user, 
    isProfileDrawerOpen, 
    setIsProfileDrawerOpen, 
    resetToDefaults, 
    missions, 
    countdowns, 
    calculateDaysRemaining 
  } = useTracker();

  if (!isProfileDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-150">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
        onClick={() => setIsProfileDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gray-200/90 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black text-white text-sm font-bold flex items-center justify-center shadow-xs">
                {user.initials}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">{user.name}</h3>
                <p className="text-xs text-gray-500 font-mono flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsProfileDrawerOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Status Card */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                  ACTIVE TIMELINE STATE
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Tracking Active
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Reference Day: <strong>{user.currentDate}</strong> (Screenshot Mode)</span>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                Calculations for SAT (125 Days) and HSC (204 Days) synchronize from this academic benchmark.
              </p>
            </div>

            {/* Target Countdowns Summary */}
            <div>
              <h4 className="text-xs font-mono font-bold text-gray-800 tracking-wider uppercase mb-3">
                Key Exam Deadlines
              </h4>
              <div className="space-y-2">
                {countdowns.map((c) => (
                  <div key={c.id} className="p-3 bg-white border border-gray-100 rounded-xl shadow-2xs flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">{c.title}</span>
                      <span className="text-[10px] font-mono text-gray-400">{c.targetLabel}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-mono font-bold text-gray-900">{calculateDaysRemaining(c.targetDate)}</span>
                      <span className="text-[10px] font-mono text-gray-400 block uppercase">Days Left</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Missions Overview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono font-bold text-gray-800 tracking-wider uppercase">
                  5 Comeback Goals
                </h4>
                <span className="text-xs text-gray-400 font-mono">
                  {missions.filter(m => m.progressPercentage === 100).length}/5 Achieved
                </span>
              </div>
              <div className="space-y-2">
                {missions.map(m => (
                  <div key={m.id} className="p-2.5 bg-gray-50/60 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800">{m.title}</span>
                    <span className="font-mono font-bold text-gray-600">{m.progressPercentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Defaults button */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  if (window.confirm("Reset all data back to the exact initial screenshot state?")) {
                    resetToDefaults();
                    setIsProfileDrawerOpen(false);
                  }
                }}
                className="w-full px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Screenshot Baseline</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Comeback Protocol
            </span>
            <button
              onClick={() => setIsProfileDrawerOpen(false)}
              className="text-xs font-bold text-gray-900 hover:underline cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
