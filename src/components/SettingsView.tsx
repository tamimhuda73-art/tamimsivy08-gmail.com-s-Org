import React, { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  AlertCircle,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';

export const SettingsView: React.FC = () => {
  const { 
    user, 
    countdowns, 
    updateCountdown, 
    resetToDefaults, 
    exportDataJSON, 
    importDataJSON 
  } = useTracker();

  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const satCountdown = countdowns.find(c => c.title.toLowerCase().includes('sat')) || countdowns[0];
  const hscCountdown = countdowns.find(c => c.title.toLowerCase().includes('hsc')) || countdowns[1];

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    const success = importDataJSON(importText.trim());
    if (success) {
      setImportStatus('Data successfully imported!');
      setImportText('');
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setImportStatus('Invalid JSON data format. Please check the backup file.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1520px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <span className="text-[11px] font-mono font-semibold tracking-wider text-gray-400 uppercase">
          SYSTEM CONFIGURATION & EXAM TARGETS
        </span>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
          Settings & Preferences
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exam Countdown Settings */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Calendar className="w-4 h-4 text-gray-700" />
            <h3 className="text-sm font-bold text-gray-900 font-mono uppercase tracking-wider">
              Countdown Target Deadlines
            </h3>
          </div>

          {satCountdown && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-800 block">
                SAT Target Exam Date
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={satCountdown.targetDate}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    updateCountdown(satCountdown.id, {
                      targetDate: newDate,
                      targetLabel: `TARGET: ${newDate}`
                    });
                  }}
                  className="px-3 py-2 text-xs font-mono border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-black"
                />
                <input
                  type="text"
                  value={satCountdown.targetLabel}
                  onChange={(e) => updateCountdown(satCountdown.id, { targetLabel: e.target.value })}
                  placeholder="Target label..."
                  className="px-3 py-2 text-xs font-mono border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
          )}

          {hscCountdown && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-800 block">
                HSC 2027 Examination Date
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={hscCountdown.targetDate}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    updateCountdown(hscCountdown.id, {
                      targetDate: newDate,
                      targetLabel: `NEXT HSC EXAMINATION (${newDate})`
                    });
                  }}
                  className="px-3 py-2 text-xs font-mono border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-black"
                />
                <input
                  type="text"
                  value={hscCountdown.targetLabel}
                  onChange={(e) => updateCountdown(hscCountdown.id, { targetLabel: e.target.value })}
                  placeholder="Target label..."
                  className="px-3 py-2 text-xs font-mono border border-gray-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
          )}

          <div className="p-3 bg-gray-50 rounded-xl text-[11px] font-mono text-gray-500">
            Current calculation benchmark: <strong>{user.currentDate}</strong> (Monday, 09 November 2026).
          </div>
        </div>

        {/* Data Backup & Restore */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Download className="w-4 h-4 text-gray-700" />
            <h3 className="text-sm font-bold text-gray-900 font-mono uppercase tracking-wider">
              Data Management & Backup
            </h3>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-gray-600 leading-relaxed">
              Export all your progress, customized milestones, syllabus chapters, and habits into a JSON file for safe offline keeping.
            </p>

            <button
              onClick={exportDataJSON}
              className="px-4 py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 cursor-pointer font-mono"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Backup JSON</span>
            </button>
          </div>

          <form onSubmit={handleImportSubmit} className="pt-4 border-t border-gray-100 space-y-3">
            <label className="text-xs font-semibold text-gray-800 block">
              Restore from Backup JSON
            </label>
            <textarea
              rows={3}
              placeholder="Paste JSON backup contents here..."
              value={importText}
              onChange={e => setImportText(e.target.value)}
              className="w-full p-2.5 text-xs font-mono bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-black"
            />
            {importStatus && (
              <div className="text-xs font-mono text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                {importStatus}
              </div>
            )}
            <button
              type="submit"
              disabled={!importText.trim()}
              className="px-4 py-2 bg-gray-100 text-gray-800 disabled:opacity-50 hover:bg-gray-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer font-mono"
            >
              Restore Data
            </button>
          </form>

          {/* Reset Baseline */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-900 block">Reset to Screenshot Baseline</span>
              <span className="text-[11px] text-gray-400">Restore the exact initial dashboard state</span>
            </div>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset to the exact initial screenshot baseline?")) {
                  resetToDefaults();
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-red-200 font-mono"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
