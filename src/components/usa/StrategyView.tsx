import React, { useState } from 'react';
import { 
  Compass, 
  Calendar, 
  BookOpen, 
  Check, 
  AlertCircle, 
  ChevronRight, 
  CheckSquare,
  Square,
  Sparkles,
  FileText,
  Clock,
  Layers,
  Edit2
} from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { EditableDate } from './EditableDate';

export const StrategyView: React.FC = () => {
  const { 
    universities, 
    setActiveTab,
    setSelectedUniversityId 
  } = useUsaApp();

  const [activeStrategyTab, setActiveStrategyTab] = useState<'hub' | 'planning' | 'timeline' | 'checklist' | 'tips'>('hub');

  // Dates state for editable timeline dates
  const [timelineDates, setTimelineDates] = useState<Record<string, string>>({
    'ea': 'Dec 1, 2026',
    'rd': 'Jan 1, 2027',
    'fa': 'Feb 1, 2027',
  });

  // Strategy checklist
  const [checklist, setChecklist] = useState([
    { id: 'sc-1', label: 'Finalize College List', checked: true },
    { id: 'sc-2', label: 'Prepare Essays & SOP', checked: true },
    { id: 'sc-3', label: 'Get Strong LORs', checked: true },
    { id: 'sc-4', label: 'Submit Applications', checked: false },
  ]);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb & Title */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-sans mb-1">
          <span>&lt;</span>
          <button 
            onClick={() => setActiveTab('usa-dashboard')}
            className="hover:text-stone-900 cursor-pointer font-medium"
          >
            USA Application
          </button>
          <span>&gt;</span>
          <span className="text-stone-700 font-medium">Application Strategy</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif tracking-tight">
          Application Strategy
        </h1>
        <p className="text-sm text-stone-600 font-serif italic mt-0.5">
          Plan smarter. Apply better.
        </p>
      </div>

      {/* Tabs Row (Matches image_a549d58d.png) */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveStrategyTab('hub')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
            activeStrategyTab === 'hub'
              ? 'bg-[#3B302A] text-white shadow-xs'
              : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-700 border border-[#E2DBD1]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Strategy Hub</span>
        </button>

        <button
          onClick={() => setActiveStrategyTab('planning')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
            activeStrategyTab === 'planning'
              ? 'bg-[#3B302A] text-white shadow-xs'
              : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-700 border border-[#E2DBD1]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>College Planning</span>
        </button>

        <button
          onClick={() => setActiveStrategyTab('timeline')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
            activeStrategyTab === 'timeline'
              ? 'bg-[#3B302A] text-white shadow-xs'
              : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-700 border border-[#E2DBD1]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Application Timeline</span>
        </button>

        <button
          onClick={() => setActiveStrategyTab('checklist')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
            activeStrategyTab === 'checklist'
              ? 'bg-[#3B302A] text-white shadow-xs'
              : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-700 border border-[#E2DBD1]'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Checklist</span>
        </button>

        <button
          onClick={() => setActiveStrategyTab('tips')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
            activeStrategyTab === 'tips'
              ? 'bg-[#3B302A] text-white shadow-xs'
              : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-700 border border-[#E2DBD1]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tips &amp; Resources</span>
        </button>
      </div>

      {/* Top Split Row: Strategy Overview (Left) + College List Priority (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Strategy Overview (5 cols) */}
        <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  My Strategy Overview
                </h3>
              </div>
              <button 
                onClick={() => alert('Edit application strategy plan')}
                className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Edit Plan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-6 mt-4">
              {/* Circular Meter (75% Plan Complete) */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#EAE4DC" strokeWidth="3" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#29231E" strokeWidth="3.5" strokeDasharray="88" strokeDashoffset="22" strokeLinecap="round" />
                  </svg>
                  <div className="text-center absolute">
                    <span className="text-2xl font-extrabold font-mono text-stone-900 tracking-tight block">75%</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-stone-600 font-semibold mt-1">Plan Complete</span>
              </div>

              {/* Checklist items */}
              <div className="space-y-2.5 flex-1">
                {checklist.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className="flex items-center gap-2.5 text-xs text-stone-700 font-sans cursor-pointer hover:text-stone-900 select-none"
                  >
                    {item.checked ? (
                      <div className="w-4 h-4 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-stone-400 shrink-0" />
                    )}
                    <span className={item.checked ? 'text-stone-900 font-medium' : 'text-stone-600'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* My College List Table (7 cols) */}
        <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#3B302A]" />
              <h3 className="text-sm font-bold font-serif text-stone-900">
                My College List
              </h3>
            </div>
            <button 
              onClick={() => setActiveTab('usa-colleges')}
              className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <table className="w-full text-xs font-sans">
            <thead>
              <tr className="text-stone-500 font-mono text-[11px] border-b border-[#EAE4DC] text-left">
                <th className="pb-2 font-normal">University</th>
                <th className="pb-2 font-normal">Type</th>
                <th className="pb-2 font-normal">Status</th>
                <th className="pb-2 font-normal text-right">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4DC]">
              {/* Harvard */}
              <tr className="hover:bg-[#F4EFEA]/60 transition-colors">
                <td className="py-2.5 flex items-center gap-2 font-serif font-bold text-stone-900">
                  <div className="w-5 h-5 rounded bg-red-100 text-red-900 font-mono text-[10px] font-bold flex items-center justify-center">H</div>
                  <span>Harvard University</span>
                </td>
                <td className="py-2.5 font-mono text-stone-700">Reach</td>
                <td className="py-2.5">
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                    On Track
                  </span>
                </td>
                <td className="py-2.5 font-mono font-bold text-stone-900 text-right">1</td>
              </tr>

              {/* Stanford */}
              <tr className="hover:bg-[#F4EFEA]/60 transition-colors">
                <td className="py-2.5 flex items-center gap-2 font-serif font-bold text-stone-900">
                  <div className="w-5 h-5 rounded bg-rose-100 text-rose-900 font-serif text-[10px] font-bold flex items-center justify-center">S</div>
                  <span>Stanford University</span>
                </td>
                <td className="py-2.5 font-mono text-stone-700">Reach</td>
                <td className="py-2.5">
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                    On Track
                  </span>
                </td>
                <td className="py-2.5 font-mono font-bold text-stone-900 text-right">2</td>
              </tr>

              {/* UC Berkeley */}
              <tr className="hover:bg-[#F4EFEA]/60 transition-colors">
                <td className="py-2.5 flex items-center gap-2 font-serif font-bold text-stone-900">
                  <div className="w-5 h-5 rounded bg-blue-100 text-blue-900 font-serif text-[10px] font-bold flex items-center justify-center">Cal</div>
                  <span>UC Berkeley</span>
                </td>
                <td className="py-2.5 font-mono text-stone-700">Target</td>
                <td className="py-2.5">
                  <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-semibold">
                    In Progress
                  </span>
                </td>
                <td className="py-2.5 font-mono font-bold text-stone-900 text-right">3</td>
              </tr>

              {/* UCLA */}
              <tr className="hover:bg-[#F4EFEA]/60 transition-colors">
                <td className="py-2.5 flex items-center gap-2 font-serif font-bold text-stone-900">
                  <div className="w-5 h-5 rounded bg-sky-100 text-sky-900 font-mono text-[9px] font-bold flex items-center justify-center">UCLA</div>
                  <span>UCLA</span>
                </td>
                <td className="py-2.5 font-mono text-stone-700">Target</td>
                <td className="py-2.5">
                  <span className="text-[10px] font-mono text-stone-600 bg-stone-200 px-2 py-0.5 rounded-full font-semibold">
                    Not Started
                  </span>
                </td>
                <td className="py-2.5 font-mono font-bold text-stone-900 text-right">4</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* Bottom Split Row: Application Timeline + Quick Actions + Quote */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Application Timeline (4.5 cols) */}
        <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3B302A]" />
              <h3 className="text-sm font-bold font-serif text-stone-900">
                Application Timeline
              </h3>
            </div>
            <button 
              onClick={() => setActiveStrategyTab('timeline')}
              className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View Calendar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 pt-1 relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-stone-300">
            {/* Event 1: Early Action */}
            <div className="relative">
              <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-stone-700 ring-2 ring-[#FAF8F5]" />
              <div className="flex items-center gap-3">
                <EditableDate
                  value={timelineDates['ea']}
                  onChange={(val) => setTimelineDates(prev => ({ ...prev, 'ea': val }))}
                  className="text-xs font-mono font-semibold text-stone-700"
                />
                <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                  EA
                </span>
                <span className="text-xs font-serif font-bold text-stone-900">
                  Early Action Deadline
                </span>
              </div>
            </div>

            {/* Event 2: Regular Decision */}
            <div className="relative">
              <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-stone-700 ring-2 ring-[#FAF8F5]" />
              <div className="flex items-center gap-3">
                <EditableDate
                  value={timelineDates['rd']}
                  onChange={(val) => setTimelineDates(prev => ({ ...prev, 'rd': val }))}
                  className="text-xs font-mono font-semibold text-stone-700"
                />
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                  RD
                </span>
                <span className="text-xs font-serif font-bold text-stone-900">
                  Regular Decision Deadline
                </span>
              </div>
            </div>

            {/* Event 3: Financial Aid */}
            <div className="relative">
              <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-stone-700 ring-2 ring-[#FAF8F5]" />
              <div className="flex items-center gap-3">
                <EditableDate
                  value={timelineDates['fa']}
                  onChange={(val) => setTimelineDates(prev => ({ ...prev, 'fa': val }))}
                  className="text-xs font-mono font-semibold text-stone-700"
                />
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                  FA
                </span>
                <span className="text-xs font-serif font-bold text-stone-900">
                  Financial Aid Deadline
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions (3.5 cols) */}
        <div className="lg:col-span-3 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EAE4DC]">
            <Sparkles className="w-4 h-4 text-[#3B302A]" />
            <h3 className="text-sm font-bold font-serif text-stone-900">
              Quick Actions
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button 
              onClick={() => setActiveTab('usa-colleges')}
              className="p-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] border border-[#E2DBD1] rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <FileText className="w-4 h-4 text-stone-700 mb-1" />
              <span className="text-xs font-serif font-bold text-stone-900">Plan Colleges</span>
            </button>

            <button 
              onClick={() => alert('Update strategy checklist')}
              className="p-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] border border-[#E2DBD1] rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <Edit2 className="w-4 h-4 text-stone-700 mb-1" />
              <span className="text-xs font-serif font-bold text-stone-900">Update Checklist</span>
            </button>

            <button 
              onClick={() => alert('Strategy Tips: Apply ED to your top choice if need-blind for internationals; stack EA options without restrictive rules.')}
              className="p-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] border border-[#E2DBD1] rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <Sparkles className="w-4 h-4 text-stone-700 mb-1" />
              <span className="text-xs font-serif font-bold text-stone-900">View Tips</span>
            </button>

            <button 
              onClick={() => setActiveTab('usa-vault')}
              className="p-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] border border-[#E2DBD1] rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <BookOpen className="w-4 h-4 text-stone-700 mb-1" />
              <span className="text-xs font-serif font-bold text-stone-900">Open Resources</span>
            </button>
          </div>
        </div>

        {/* Campus Quote Card (4 cols) */}
        <div className="lg:col-span-4 bg-[#3B302A] text-white rounded-2xl p-5 shadow-xs border border-[#29231E] relative overflow-hidden flex flex-col justify-end min-h-[140px]">
          <div className="relative z-10 space-y-2">
            <span className="text-2xl font-serif text-[#D8C5AE] leading-none block">&ldquo;</span>
            <p className="font-serif italic text-stone-200 text-sm leading-snug">
              A well-planned application turns your efforts into opportunities.
            </p>
            <span className="text-[10px] font-mono tracking-widest text-[#D8C5AE] uppercase block">
              &mdash; COMEBACK
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
