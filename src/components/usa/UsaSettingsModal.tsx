import React, { useState } from 'react';
import { X, Save, Download, Upload, Sliders, Check } from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';

interface UsaSettingsModalProps {
  onClose: () => void;
}

export const UsaSettingsModal: React.FC<UsaSettingsModalProps> = ({ onClose }) => {
  const { 
    settings, 
    updateSettings, 
    exportUsaDataJSON, 
    importUsaDataJSON 
  } = useUsaApp();

  const [cycle, setCycle] = useState(settings.applicationCycle);
  const [headline, setHeadline] = useState(settings.motivationalHeadline);
  const [subtitle, setSubtitle] = useState(settings.motivationalSubtitle);
  const [visibleWidgets, setVisibleWidgets] = useState(settings.visibleWidgets);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleSave = () => {
    updateSettings({
      applicationCycle: cycle.trim() || 'FALL 2028',
      motivationalHeadline: headline.trim(),
      motivationalSubtitle: subtitle.trim(),
      visibleWidgets
    });
    onClose();
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const ok = importUsaDataJSON(importJsonText);
    if (ok) {
      setImportSuccess(true);
      setImportError(false);
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setImportError(true);
      setImportSuccess(false);
    }
  };

  const toggleWidget = (key: string) => {
    setVisibleWidgets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-stone-700" />
            <h3 className="text-xl font-bold font-serif text-stone-900">
              USA Application Customization & Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cycle & Motivational Text */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
              Admissions Target Cycle *
            </label>
            <input
              type="text"
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
              placeholder="FALL 2028"
              className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs font-mono font-bold text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
              Dashboard Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs font-serif text-stone-900 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
              Dashboard Subtitle
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs font-sans text-stone-700"
            />
          </div>
        </div>

        {/* Dashboard Sections Visibility */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <label className="block text-xs font-mono font-bold text-stone-900 uppercase">
            Visible Dashboard Workspaces
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {Object.entries(visibleWidgets).map(([key, val]) => (
              <label key={key} className="flex items-center gap-2 p-2 bg-[#FAF8F5] rounded-xl border border-stone-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={val}
                  onChange={() => toggleWidget(key)}
                  className="rounded"
                />
                <span className="capitalize">{key}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Backup & Restore */}
        <div className="pt-2 border-t border-stone-100 space-y-3">
          <label className="block text-xs font-mono font-bold text-stone-900 uppercase">
            Workspace Backup & Migration
          </label>
          
          <button
            onClick={exportUsaDataJSON}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#FAF8F5] hover:bg-stone-100 border border-stone-300 text-stone-800 rounded-xl text-xs font-mono font-medium cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Complete USA Knowledge Base JSON</span>
          </button>

          <div className="pt-2">
            <textarea
              rows={2}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste exported backup JSON here to restore..."
              className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-mono text-stone-800"
            />
            {importError && (
              <p className="text-xs text-rose-600 mt-1">Invalid backup JSON format.</p>
            )}
            {importSuccess && (
              <p className="text-xs text-emerald-600 mt-1">Workspace restored successfully!</p>
            )}
            <button
              onClick={handleImport}
              disabled={!importJsonText.trim()}
              className="mt-2 px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-mono rounded-lg disabled:opacity-30 cursor-pointer"
            >
              Restore from JSON
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-mono font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
