import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  AlertCircle, 
  History, 
  Save, 
  Trash2,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { DateConfirmationStatus } from '../../types/tracker';

export const DateManagementModal: React.FC = () => {
  const { 
    activeDateModal, 
    setActiveDateModal, 
    updateMissionDate, 
    updateMilestoneDate,
    getCountdownDetails,
    missions,
    majorMilestones
  } = useTracker();

  const [dateInput, setDateInput] = useState<string>('');
  const [statusInput, setStatusInput] = useState<DateConfirmationStatus>('TENTATIVE');
  const [noteInput, setNoteInput] = useState<string>('');

  useEffect(() => {
    if (activeDateModal) {
      setDateInput(activeDateModal.currentDate || '');
      setStatusInput(activeDateModal.currentStatus || (activeDateModal.currentDate ? 'TENTATIVE' : 'NOT SET'));
      setNoteInput('');
    }
  }, [activeDateModal]);

  if (!activeDateModal) return null;

  // Retrieve latest history from context
  const currentItem = activeDateModal.type === 'mission'
    ? missions.find(m => m.id === activeDateModal.id)
    : majorMilestones.find(m => m.id === activeDateModal.id);

  const history = currentItem?.dateHistory || activeDateModal.history || [];

  // Live countdown preview based on current form values
  const countdownPreview = getCountdownDetails(dateInput, statusInput);

  const handleClearDate = () => {
    setDateInput('');
    setStatusInput('NOT SET');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeDateModal.type === 'mission') {
      updateMissionDate(activeDateModal.id, dateInput, statusInput, noteInput);
    } else {
      updateMilestoneDate(activeDateModal.id, dateInput, statusInput, noteInput);
    }
    setActiveDateModal(null);
  };

  const statusOptions: { value: DateConfirmationStatus; label: string; desc: string; badgeClass: string }[] = [
    { 
      value: 'TENTATIVE', 
      label: 'Tentative', 
      desc: 'Provisional date, subject to official schedule release',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200' 
    },
    { 
      value: 'CONFIRMED', 
      label: 'Confirmed', 
      desc: 'Official examination / milestone date finalized',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200' 
    },
    { 
      value: 'PLANNED', 
      label: 'Planned', 
      desc: 'Personal academic timeline target',
      badgeClass: 'bg-blue-50 text-blue-800 border-blue-200' 
    },
    { 
      value: 'NOT SET', 
      label: 'Date Not Set', 
      desc: 'No date configured; countdown is hidden',
      badgeClass: 'bg-gray-100 text-gray-600 border-gray-200' 
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setActiveDateModal(null)}
    >
      <div 
        className="bg-white w-full max-w-xl rounded-2xl border border-gray-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gradient-to-b from-[#FAFAFB] to-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#8A7968] uppercase bg-[#EFE7DC]/60 px-2 py-0.5 rounded">
                DATE MANAGEMENT SYSTEM
              </span>
              <span className="text-[10px] font-mono text-gray-400 uppercase">
                {activeDateModal.category}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1.5 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-700" />
              <span>{activeDateModal.title}</span>
            </h2>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              Admin & Owner Date Configuration Console
            </p>
          </div>

          <button
            onClick={() => setActiveDateModal(null)}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6">
          
          {/* Live Preview Card */}
          <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#D8C5AE]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-[#8A7968] uppercase font-bold tracking-wider block">
                LIVE COUNTDOWN PREVIEW
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-[#3B302A] font-mono tracking-tight">
                  {countdownPreview.displayCountdown}
                </span>
              </div>
              <p className="text-xs text-gray-600 font-mono mt-0.5">
                Target: {countdownPreview.formattedDate}
              </p>
            </div>

            <div className="self-start sm:self-center">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-mono border ${
                statusInput === 'CONFIRMED' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : statusInput === 'TENTATIVE'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : statusInput === 'PLANNED'
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}>
                {statusInput}
              </span>
            </div>
          </div>

          {/* Date Picker Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
                Target Date
              </label>
              {dateInput && (
                <button
                  type="button"
                  onClick={handleClearDate}
                  className="text-xs text-rose-600 hover:text-rose-800 font-mono font-medium flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Date (Set Not Set)</span>
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type="date"
                value={dateInput}
                onChange={(e) => {
                  setDateInput(e.target.value);
                  if (e.target.value && statusInput === 'NOT SET') {
                    setStatusInput('TENTATIVE');
                  }
                }}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>
            <p className="text-[11px] text-gray-500 font-mono">
              E.g., SAT can be set to 2027-03-06, 2027-03-01, or any official session date.
            </p>
          </div>

          {/* Date Confirmation Status Options */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
              Date Confirmation Status
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {statusOptions.map((opt) => {
                const isSelected = statusInput === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setStatusInput(opt.value);
                      if (opt.value === 'NOT SET') {
                        setDateInput('');
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'border-black bg-gray-900 text-white shadow-xs' 
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono tracking-wide">{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-[10px] mt-1 leading-relaxed ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
              Change Log / Schedule Notes <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. Changed per updated official College Board / Board test center bulletin."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-sans"
            />
          </div>

          {/* Date Change History */}
          <div className="border-t border-gray-100 pt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-gray-500 uppercase flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>Date Change History</span>
              </span>
              <span className="text-[10px] font-mono text-gray-400">
                {history.length} {history.length === 1 ? 'record' : 'records'}
              </span>
            </div>

            {history.length === 0 ? (
              <p className="text-[11px] text-gray-400 font-mono italic py-1">
                No previous changes logged yet.
              </p>
            ) : (
              <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                {history.slice().reverse().map((h) => (
                  <div key={h.id} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-gray-800">
                        {h.newDate ? h.newDate : 'DATE CLEARED'} ({h.status})
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {new Date(h.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {h.previousDate && (
                      <span className="text-[10px] text-gray-500 font-mono">
                        Prior: {h.previousDate}
                      </span>
                    )}
                    {h.note && (
                      <span className="text-[11px] text-gray-600 italic">
                        &ldquo;{h.note}&rdquo;
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-100 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveDateModal(null)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Date Changes</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
