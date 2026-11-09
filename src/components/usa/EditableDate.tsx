import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Edit2, Check, X, Clock } from 'lucide-react';

interface EditableDateProps {
  value: string;
  onSave?: (newDate: string) => void;
  onChange?: (newDate: string) => void;
  label?: string;
  className?: string;
  displayMode?: 'badge' | 'text' | 'compact' | 'pill' | 'button';
  prefix?: string;
  placeholder?: string;
  icon?: boolean;
}

export const EditableDate: React.FC<EditableDateProps> = ({
  value,
  onSave,
  onChange,
  label,
  className = '',
  displayMode = 'text',
  prefix = '',
  placeholder = 'Select date',
  icon = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value || '');
  const [calendarPickerValue, setCalendarPickerValue] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempValue(value || '');
    // Try to parse YYYY-MM-DD
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      setCalendarPickerValue(value);
    } else {
      setCalendarPickerValue('');
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (tempValue.trim()) {
      if (onSave) onSave(tempValue.trim());
      if (onChange) onChange(tempValue.trim());
    }
    setIsOpen(false);
  };

  const handleCalendarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCalendarPickerValue(val);
    if (val) {
      // Format to readable or standard
      try {
        const [y, m, d] = val.split('-');
        const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        const formatted = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        setTempValue(formatted);
      } catch {
        setTempValue(val);
      }
    }
  };

  const setPreset = (preset: string) => {
    setTempValue(preset);
  };

  return (
    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      {/* Trigger Display based on mode */}
      {displayMode === 'badge' && (
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className={`group inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#EFE7DC] hover:bg-[#E2D6C6] text-[#3B302A] transition-colors border border-[#D8C5AE]/60 cursor-pointer ${className}`}
          title="Click to edit date"
        >
          {icon && <Calendar className="w-3 h-3 text-[#59483D] opacity-75 group-hover:opacity-100" />}
          <span>{prefix}{value || placeholder}</span>
          <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#59483D]" />
        </button>
      )}

      {displayMode === 'pill' && (
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-white hover:bg-stone-50 text-stone-800 shadow-2xs border border-stone-200 transition-all cursor-pointer ${className}`}
          title="Click to edit date"
        >
          {icon && <Calendar className="w-3 h-3 text-stone-500" />}
          <span>{prefix}{value || placeholder}</span>
          <Edit2 className="w-2.5 h-2.5 text-stone-400 opacity-60 group-hover:opacity-100" />
        </button>
      )}

      {displayMode === 'button' && (
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#3B302A] hover:bg-[#292724] text-[#EFE7DC] transition-all cursor-pointer shadow-2xs ${className}`}
          title="Click to edit date"
        >
          {icon && <Calendar className="w-3.5 h-3.5 text-[#D8C5AE]" />}
          <span>{prefix}{value || placeholder}</span>
          <Edit2 className="w-3 h-3 opacity-70 group-hover:opacity-100" />
        </button>
      )}

      {displayMode === 'compact' && (
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className={`group inline-flex items-center gap-1 text-[11px] font-mono text-stone-600 hover:text-stone-900 transition-colors cursor-pointer ${className}`}
          title="Click to edit date"
        >
          {icon && <Calendar className="w-2.5 h-2.5 text-stone-400" />}
          <span className="underline decoration-dotted decoration-stone-300 underline-offset-2">{prefix}{value || placeholder}</span>
          <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-stone-500" />
        </button>
      )}

      {displayMode === 'text' && (
        <span
          onClick={() => setIsOpen(prev => !prev)}
          className={`group inline-flex items-center gap-1 text-inherit cursor-pointer hover:underline decoration-stone-300 underline-offset-2 ${className}`}
          title="Click to edit date"
        >
          {icon && <Calendar className="w-3 h-3 text-stone-400 group-hover:text-stone-700 transition-colors" />}
          <span>{prefix}{value || placeholder}</span>
          <Edit2 className="w-2.5 h-2.5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </span>
      )}

      {/* Popover Editor */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-50 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-stone-200 p-3.5 text-stone-800 text-xs animate-in fade-in duration-100 left-0 top-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-stone-100">
            <span className="font-semibold text-stone-900 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              {label || 'Edit Date'}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handleApply} className="space-y-3">
            {/* Quick calendar picker */}
            <div>
              <label className="block text-[10px] font-mono text-stone-500 uppercase tracking-wider mb-1">
                Calendar Picker
              </label>
              <input
                type="date"
                value={calendarPickerValue}
                onChange={handleCalendarPick}
                className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-xs font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400 bg-stone-50"
              />
            </div>

            {/* Custom text representation */}
            <div>
              <label className="block text-[10px] font-mono text-stone-500 uppercase tracking-wider mb-1">
                Custom Formatted Date
              </label>
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder="e.g. Nov 1, 2027 or 2025 – Present"
                className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#3B302A]"
                autoFocus
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="block text-[9px] font-mono text-stone-400 uppercase tracking-wider mb-1.5">
                Quick Presets
              </span>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const todayStr = new Date().toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                    setPreset(todayStr);
                  }}
                  className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[10px] font-mono cursor-pointer"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setPreset('Nov 1, 2027')}
                  className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[10px] font-mono cursor-pointer"
                >
                  Nov 1, 2027 (EA)
                </button>
                <button
                  type="button"
                  onClick={() => setPreset('Jan 1, 2028')}
                  className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[10px] font-mono cursor-pointer"
                >
                  Jan 1, 2028 (RD)
                </button>
                <button
                  type="button"
                  onClick={() => setPreset('Present')}
                  className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[10px] font-mono cursor-pointer"
                >
                  Present
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-100 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-[#3B302A] hover:bg-[#292724] text-[#EFE7DC] rounded-md text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Save Date</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
