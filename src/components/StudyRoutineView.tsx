import React, { useState } from 'react';
import { 
  Edit3, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Printer, 
  Eye, 
  Sparkles,
  Clock,
  Layers
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { RoutineCellContent, RoutineTimeBlock } from '../types/tracker';

export const StudyRoutineView: React.FC = () => {
  const { 
    studyRoutine, 
    updateRoutineCell, 
    updateTimeBlock, 
    addRoutineBlock, 
    deleteRoutineBlock, 
    updateRoutineMetadata,
    resetRoutineToPDF 
  } = useTracker();

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    blockId: string;
    day: string;
    subject: string;
    subtext: string;
    colorTheme: RoutineCellContent['colorTheme'];
  } | null>(null);

  const [editingBlockTime, setEditingBlockTime] = useState<{
    blockId: string;
    timeRange: string;
    period: string;
    label: string;
  } | null>(null);

  // Color theme mapping matching the PDF's muted, aesthetic palette
  const themeClasses: Record<string, { bg: string; text: string; border: string }> = {
    blue: {
      bg: 'bg-[#D3E1EC]',
      text: 'text-[#1E293B]',
      border: 'border-[#BDD1E2]'
    },
    taupe: {
      bg: 'bg-[#C7BEB1]',
      text: 'text-[#26201B]',
      border: 'border-[#B8ADA0]'
    },
    cream: {
      bg: 'bg-[#FAF4E8]',
      text: 'text-[#2D2522]',
      border: 'border-[#EDE4D5]'
    },
    ivory: {
      bg: 'bg-[#F4EFE6]',
      text: 'text-[#26201B]',
      border: 'border-[#E6DFD4]'
    },
    sage: {
      bg: 'bg-[#DFE6DB]',
      text: 'text-[#1C2A1E]',
      border: 'border-[#CFD9CA]'
    },
    beige: {
      bg: 'bg-[#ECE5D6]',
      text: 'text-[#241E1C]',
      border: 'border-[#DFD7C4]'
    },
    charcoal: {
      bg: 'bg-[#241E1C]',
      text: 'text-white',
      border: 'border-[#1A1513]'
    }
  };

  const handleCellClick = (blockId: string, day: string, cell?: RoutineCellContent) => {
    if (!isEditMode) return;
    setEditingCell({
      blockId,
      day,
      subject: cell?.subject || '',
      subtext: cell?.subtext || '',
      colorTheme: cell?.colorTheme || 'blue'
    });
  };

  const handleSaveCell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCell) return;
    updateRoutineCell(editingCell.blockId, editingCell.day, {
      subject: editingCell.subject.toUpperCase(),
      subtext: editingCell.subtext ? editingCell.subtext.toUpperCase() : undefined,
      colorTheme: editingCell.colorTheme
    });
    setEditingCell(null);
  };

  const handleSaveBlockTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlockTime) return;
    updateTimeBlock(editingBlockTime.blockId, {
      timeRange: editingBlockTime.timeRange,
      period: editingBlockTime.period,
      label: editingBlockTime.label.toUpperCase()
    });
    setEditingBlockTime(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 antialiased">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E5DFC8] rounded-2xl p-4 sm:px-6 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#241E1C] text-white flex items-center justify-center font-bold text-xs">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#241E1C] font-mono uppercase tracking-wider">
              WEEKLY TIMETABLE SCHEDULE
            </h2>
            <p className="text-[11px] text-[#8C827A] font-mono">
              7 Days • 5 Dedicated Focus Blocks • Fully Customizable
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Edit Mode Toggle */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`
              px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer
              ${isEditMode 
                ? 'bg-[#241E1C] text-white shadow-xs ring-2 ring-[#241E1C]/20' 
                : 'bg-[#F7F4EE] hover:bg-[#EFEAE1] text-[#241E1C] border border-[#DFD8CA]'}
            `}
          >
            {isEditMode ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditMode ? 'Done Editing' : 'Customize Routine'}</span>
          </button>

          {/* Add Block button (active in edit mode) */}
          {isEditMode && (
            <button
              onClick={addRoutineBlock}
              className="px-3.5 py-1.5 bg-[#241E1C] hover:bg-black text-white text-xs font-mono font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Block</span>
            </button>
          )}

          {/* Reset to PDF Baseline */}
          <button
            onClick={() => {
              if (window.confirm("Restore original schedule from the PDF template?")) {
                resetRoutineToPDF();
              }
            }}
            className="px-3 py-1.5 bg-white border border-[#DFD8CA] text-xs font-mono text-[#8C827A] hover:text-[#241E1C] hover:bg-[#FAF7F2] rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            title="Reset to PDF Schedule"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset to PDF</span>
          </button>

          {/* Print routine */}
          <button
            onClick={handlePrint}
            className="p-2 text-[#8C827A] hover:text-[#241E1C] hover:bg-[#F7F4EE] rounded-xl border border-[#DFD8CA] transition-colors cursor-pointer"
            title="Print Routine"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isEditMode && (
        <div className="bg-[#FAF7F2] border border-[#E5DFC8] rounded-xl p-3.5 text-xs text-[#736B63] flex items-center justify-between font-mono">
          <span>💡 <strong>Edit Mode Active:</strong> Click on any subject cell or time block to change texts, timings, and color themes.</span>
          <button 
            onClick={() => setIsEditMode(false)}
            className="text-xs font-bold text-[#241E1C] underline hover:no-underline cursor-pointer"
          >
            Save & Exit
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* THE MAIN PDF ROUTINE POSTER / CANVAS */}
      {/* ========================================================= */}
      <div className="bg-[#F7F5EE] border-4 border-[#241E1C] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl space-y-6 print:p-2 print:border-none print:shadow-none">
        
        {/* Main Banner Header */}
        <div className="bg-[#241E1C] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono tracking-widest text-[#A59B91] uppercase block">
              {studyRoutine.kicker}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase font-sans">
              {studyRoutine.headline}
            </h1>
            <p className="text-xs font-mono text-[#D7CEBF] tracking-wider uppercase">
              {studyRoutine.subtitle}
            </p>
          </div>

          {/* Right badge card */}
          <div className="bg-[#1C1816] border border-[#3D332F] rounded-xl p-4 text-center min-w-[160px] self-start md:self-auto shadow-inner">
            <span className="text-[10px] font-mono text-[#A59B91] uppercase tracking-wider block">
              {studyRoutine.badgeTop}
            </span>
            <span className="text-xl font-black text-white uppercase block my-0.5 tracking-wide">
              {studyRoutine.badgeMiddle}
            </span>
            <span className="text-[10px] font-mono text-[#D7CEBF] uppercase tracking-widest block">
              {studyRoutine.badgeBottom}
            </span>
          </div>
        </div>

        {/* Sub Header Bar */}
        <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#241E1C] px-1">
          <span>{studyRoutine.subHeaderLeft}</span>
          <span>{studyRoutine.subHeaderRight}</span>
        </div>

        {/* Timetable Table */}
        <div className="overflow-x-auto rounded-2xl border-2 border-[#241E1C] bg-[#241E1C] shadow-sm">
          <table className="w-full text-center border-collapse min-w-[960px]">
            {/* Header row: TIME + SATURDAY to FRIDAY */}
            <thead>
              <tr className="border-b-2 border-[#241E1C]">
                {/* Time header */}
                <th className="w-32 py-3 px-3 bg-[#A89F91] text-[#241E1C] font-mono font-bold text-xs uppercase tracking-wider border-r border-[#241E1C]">
                  TIME
                </th>

                {/* Day headers */}
                {studyRoutine.days.map((day, idx) => {
                  const isFriday = day.toLowerCase() === 'friday';
                  return (
                    <th 
                      key={day} 
                      className={`
                        py-3 px-2 font-mono font-extrabold text-xs uppercase tracking-wider border-r border-[#241E1C] last:border-r-0
                        ${isFriday ? 'bg-[#C5BAAB] text-[#241E1C]' : 'bg-[#2B2523] text-white'}
                      `}
                    >
                      {day}
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Time Blocks Body */}
            <tbody className="divide-y-2 divide-[#241E1C]">
              {studyRoutine.blocks.map((block) => (
                <tr key={block.id} className="bg-[#241E1C]">
                  {/* Time Block Cell */}
                  <td 
                    onClick={() => {
                      if (isEditMode) {
                        setEditingBlockTime({
                          blockId: block.id,
                          timeRange: block.timeRange,
                          period: block.period,
                          label: block.label
                        });
                      }
                    }}
                    className={`
                      p-3 bg-[#241E1C] text-white border-r border-[#3D332F] text-center select-none align-middle
                      ${isEditMode ? 'cursor-pointer hover:bg-[#332A26] transition-colors ring-inset hover:ring-1 hover:ring-white/40' : ''}
                    `}
                  >
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <span className="text-xs sm:text-sm font-extrabold font-mono tracking-tight text-white">
                        {block.timeRange}
                      </span>
                      <span className="text-[10px] font-mono text-[#D7CEBF] font-semibold">
                        {block.period}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#A59B91] mt-1">
                        {block.label}
                      </span>
                      {isEditMode && (
                        <div className="mt-2 flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingBlockTime({
                                blockId: block.id,
                                timeRange: block.timeRange,
                                period: block.period,
                                label: block.label
                              });
                            }}
                            className="p-1 text-[#A59B91] hover:text-white"
                            title="Edit time"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm("Delete this entire time block row?")) {
                                deleteRoutineBlock(block.id);
                              }
                            }}
                            className="p-1 text-[#A59B91] hover:text-red-400"
                            title="Delete block"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Day Columns for this block */}
                  {studyRoutine.days.map((day) => {
                    const cell = block.cells[day] || { subject: "FREE", colorTheme: "ivory" };
                    const theme = themeClasses[cell.colorTheme || 'blue'] || themeClasses.blue;

                    return (
                      <td 
                        key={day}
                        onClick={() => handleCellClick(block.id, day, cell)}
                        className={`
                          p-2.5 sm:p-3 border-r border-[#241E1C] last:border-r-0 align-middle transition-all
                          ${theme.bg} ${theme.text}
                          ${isEditMode ? 'cursor-pointer hover:opacity-90 hover:ring-2 hover:ring-[#241E1C] hover:z-10' : ''}
                        `}
                      >
                        <div className="min-h-[64px] flex flex-col items-center justify-center text-center px-1">
                          <span className="text-xs sm:text-sm font-extrabold tracking-tight leading-snug">
                            {cell.subject}
                          </span>
                          {cell.subtext && (
                            <span className="text-[10px] sm:text-[11px] font-bold font-mono tracking-tight opacity-90 mt-0.5">
                              {cell.subtext}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer 3 Pillars matching PDF */}
        <div className="bg-[#241E1C] text-white rounded-2xl p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#3D332F] gap-4 md:gap-0 shadow-sm">
          {studyRoutine.footerPillars.map((pillar) => (
            <div key={pillar.id} className="px-4 py-2 first:pl-2 last:pr-2 flex flex-col justify-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A59B91]">
                {pillar.label}
              </span>
              <span className="text-xs sm:text-sm font-extrabold font-mono text-white tracking-wide mt-0.5">
                {pillar.detail}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================= */}
      {/* MODAL: EDIT CELL CONTENT */}
      {/* ========================================================= */}
      {editingCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white w-full max-w-md rounded-2xl border border-gray-200 shadow-2xl p-6 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                  EDIT SUBJECT SLOT
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-0.5">
                  {editingCell.day} Session
                </h3>
              </div>
              <button
                onClick={() => setEditingCell(null)}
                className="p-1.5 text-gray-400 hover:text-black rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCell} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                  Primary Subject / Task
                </label>
                <input
                  type="text"
                  value={editingCell.subject}
                  onChange={e => setEditingCell({ ...editingCell, subject: e.target.value })}
                  placeholder="e.g. PHYSICS, BIOLOGY, SAT MATH..."
                  className="w-full px-3 py-2 text-sm font-bold border border-gray-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-black uppercase"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                  Subtext / Additional Topic (Optional)
                </label>
                <input
                  type="text"
                  value={editingCell.subtext}
                  onChange={e => setEditingCell({ ...editingCell, subtext: e.target.value })}
                  placeholder="e.g. + CHEMISTRY, PRACTICE, REVISION..."
                  className="w-full px-3 py-2 text-xs font-medium border border-gray-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-black uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-2">
                  Card Color Theme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'blue', label: 'Soft Blue', bg: 'bg-[#D3E1EC]', text: 'text-[#1E293B]' },
                    { id: 'taupe', label: 'Muted Taupe', bg: 'bg-[#C7BEB1]', text: 'text-[#26201B]' },
                    { id: 'cream', label: 'Light Cream', bg: 'bg-[#FAF4E8]', text: 'text-[#2D2522]' },
                    { id: 'ivory', label: 'Warm Ivory', bg: 'bg-[#F4EFE6]', text: 'text-[#26201B]' },
                    { id: 'sage', label: 'Pale Sage', bg: 'bg-[#DFE6DB]', text: 'text-[#1C2A1E]' },
                    { id: 'beige', label: 'Gold Beige', bg: 'bg-[#ECE5D6]', text: 'text-[#241E1C]' }
                  ].map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setEditingCell({ ...editingCell, colorTheme: color.id as any })}
                      className={`
                        p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between
                        ${color.bg} ${color.text}
                        ${editingCell.colorTheme === color.id ? 'ring-2 ring-black border-black' : 'border-gray-200/80'}
                      `}
                    >
                      <span>{color.label}</span>
                      {editingCell.colorTheme === color.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCell(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#241E1C] text-white text-xs font-bold rounded-xl hover:bg-black"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT TIME BLOCK ROW */}
      {/* ========================================================= */}
      {editingBlockTime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white w-full max-w-md rounded-2xl border border-gray-200 shadow-2xl p-6 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                  EDIT TIME BLOCK
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-0.5">
                  Schedule Timing & Header
                </h3>
              </div>
              <button
                onClick={() => setEditingBlockTime(null)}
                className="p-1.5 text-gray-400 hover:text-black rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlockTime} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                  Time Range (e.g. 3:10–5:20)
                </label>
                <input
                  type="text"
                  value={editingBlockTime.timeRange}
                  onChange={e => setEditingBlockTime({ ...editingBlockTime, timeRange: e.target.value })}
                  placeholder="e.g. 6:00–10:00"
                  className="w-full px-3 py-2 text-sm font-mono font-bold border border-gray-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-black"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                    Period
                  </label>
                  <input
                    type="text"
                    value={editingBlockTime.period}
                    onChange={e => setEditingBlockTime({ ...editingBlockTime, period: e.target.value })}
                    placeholder="e.g. AM / PM / SAT"
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-gray-200 rounded-xl uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                    Block Label
                  </label>
                  <input
                    type="text"
                    value={editingBlockTime.label}
                    onChange={e => setEditingBlockTime({ ...editingBlockTime, label: e.target.value })}
                    placeholder="e.g. MORNING"
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-gray-200 rounded-xl uppercase"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBlockTime(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#241E1C] text-white text-xs font-bold rounded-xl hover:bg-black"
                >
                  Save Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
