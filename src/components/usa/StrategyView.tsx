import React, { useState, useMemo } from 'react';
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
  Edit2,
  Plus,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { EditableDate } from './EditableDate';

export const StrategyView: React.FC = () => {
  const { 
    universities, 
    updateUniversity,
    deleteUniversity,
    mainEssays,
    sopDocuments,
    recommendationNotebooks,
    satArchive,
    englishTestRecords,
    setActiveTab,
    setSelectedUniversityId 
  } = useUsaApp();

  const [activeStrategyTab, setActiveStrategyTab] = useState<'hub' | 'planning' | 'timeline' | 'checklist' | 'tips'>('hub');

  // Dates state for editable timeline dates
  const [timelineDates, setTimelineDates] = useState<Record<string, string>>({
    'ea': 'Nov 1, 2027',
    'ed': 'Nov 1, 2027',
    'rd': 'Jan 1, 2028',
    'fa': 'Feb 1, 2028',
  });

  // Strategy checklist items
  const [checklist, setChecklist] = useState([
    { id: 'sc-1', label: 'Build Balanced College List (Reach, Target, Safety)', checked: false },
    { id: 'sc-2', label: 'Draft Common App Personal Statement & SOP', checked: false },
    { id: 'sc-3', label: 'Confirm Recommendation Teachers & LORs', checked: false },
    { id: 'sc-4', label: 'Complete Standardized Testing (SAT / IELTS)', checked: false },
    { id: 'sc-5', label: 'Prepare Financial Aid / CSS Profile Documents', checked: false }
  ]);

  const activeUniversities = useMemo(() => {
    return universities.filter(u => !u.isArchived);
  }, [universities]);

  // Compute dynamic readiness score based on real application progress across modules
  const dynamicPlanPct = useMemo(() => {
    let score = 0;
    // 1. College List (25%)
    if (activeUniversities.length >= 1) score += 15;
    if (activeUniversities.length >= 4) score += 10;

    // 2. Writing (25%)
    if (mainEssays.length > 0 || sopDocuments.length > 0) score += 15;
    if (mainEssays.some(e => e.currentContent.length > 150) || sopDocuments.some(s => s.currentDraft.length > 150)) score += 10;

    // 3. Letters of Recommendation (20%)
    if (recommendationNotebooks.length >= 1) score += 10;
    if (recommendationNotebooks.length >= 2) score += 10;

    // 4. Testing (15%)
    if (satArchive.records.length > 0 || englishTestRecords.length > 0) score += 15;

    // 5. Checklist (15%)
    const checkedCount = checklist.filter(c => c.checked).length;
    score += Math.round((checkedCount / checklist.length) * 15);

    return Math.min(score, 100);
  }, [activeUniversities, mainEssays, sopDocuments, recommendationNotebooks, satArchive, englishTestRecords, checklist]);

  // Auto-sync checklist items based on real state
  React.useEffect(() => {
    setChecklist(prev => [
      { ...prev[0], checked: activeUniversities.length >= 3 },
      { ...prev[1], checked: mainEssays.length > 0 || sopDocuments.length > 0 },
      { ...prev[2], checked: recommendationNotebooks.length >= 1 },
      { ...prev[3], checked: satArchive.records.length > 0 || englishTestRecords.length > 0 },
      { ...prev[4], checked: prev[4].checked }
    ]);
  }, [activeUniversities.length, mainEssays.length, sopDocuments.length, recommendationNotebooks.length, satArchive.records.length, englishTestRecords.length]);

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

      {/* Tabs Row */}
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
                  Strategy Readiness Meter
                </h3>
              </div>
              <span className="text-xs font-mono text-stone-500">
                Live Status
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
              {/* Circular Meter */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#EAE4DC" strokeWidth="3" />
                    <circle 
                      cx="18" cy="18" r="14" fill="none" stroke="#29231E" strokeWidth="3.5" 
                      strokeDasharray="88" 
                      strokeDashoffset={88 - (dynamicPlanPct / 100) * 88} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="text-center absolute">
                    <span className="text-2xl font-extrabold font-mono text-stone-900 tracking-tight block">
                      {dynamicPlanPct}%
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-stone-600 font-semibold mt-1">Plan Complete</span>
              </div>

              {/* Checklist items */}
              <div className="space-y-2.5 flex-1 w-full">
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
                My College List Strategy ({activeUniversities.length})
              </h3>
            </div>
            <button 
              onClick={() => setActiveTab('usa-colleges')}
              className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Colleges</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeUniversities.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E2DBD1] flex items-center justify-center mx-auto text-stone-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold font-serif text-stone-900">
                No Colleges in Your Strategy Yet
              </h4>
              <p className="text-xs text-stone-500 font-sans max-w-sm mx-auto">
                Add target, reach, or safety universities to populate your strategic application matrix.
              </p>
              <button
                onClick={() => setActiveTab('usa-colleges')}
                className="px-4 py-2 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-medium"
              >
                + Build College List
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-sans">
                <thead>
                  <tr className="text-stone-500 font-mono text-[11px] border-b border-[#EAE4DC] text-left">
                    <th className="pb-2 font-normal">University</th>
                    <th className="pb-2 font-normal">Tier</th>
                    <th className="pb-2 font-normal">Target Round</th>
                    <th className="pb-2 font-normal">Setting</th>
                    <th className="pb-2 font-normal text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4DC]">
                  {activeUniversities.map(uni => (
                    <tr key={uni.id} className="hover:bg-[#F4EFEA]/60 transition-colors">
                      <td className="py-2.5 flex items-center gap-2 font-serif font-bold text-stone-900">
                        <div className="w-6 h-6 rounded bg-[#3B302A] text-[#D8C5AE] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                          {uni.name.charAt(0)}
                        </div>
                        <span className="truncate max-w-[160px]">{uni.name}</span>
                      </td>
                      <td className="py-2.5 font-mono text-stone-700 capitalize">
                        <select
                          value={uni.category}
                          onChange={(e) => updateUniversity(uni.id, { category: e.target.value as any })}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border border-transparent cursor-pointer ${
                            uni.category === 'reach' 
                              ? 'bg-rose-100 text-rose-800' 
                              : uni.category === 'target' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          <option value="reach">Reach</option>
                          <option value="target">Target</option>
                          <option value="safety">Safety</option>
                        </select>
                      </td>
                      <td className="py-2.5">
                        <select
                          value={uni.intendedRound || 'RD'}
                          onChange={(e) => updateUniversity(uni.id, { intendedRound: e.target.value as any })}
                          className="bg-white border border-[#E2DBD1] rounded px-1.5 py-0.5 text-[11px] font-mono cursor-pointer"
                        >
                          <option value="ED">ED</option>
                          <option value="ED2">ED2</option>
                          <option value="EA">EA</option>
                          <option value="REA">REA</option>
                          <option value="SCEA">SCEA</option>
                          <option value="RD">RD</option>
                          <option value="Rolling">Rolling</option>
                        </select>
                      </td>
                      <td className="py-2.5 text-stone-600 font-mono text-[11px]">
                        {uni.city ? `${uni.city}, ${uni.state}` : (uni.campusSetting || 'USA')}
                      </td>
                      <td className="py-2.5 text-right font-mono flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUniversityId(uni.id);
                            setActiveTab('usa-colleges');
                          }}
                          className="text-[#3B302A] hover:underline font-bold text-[11px] cursor-pointer"
                        >
                          Dossier &rarr;
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${uni.name} from your college list?`)) {
                              deleteUniversity(uni.id);
                            }
                          }}
                          className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete university"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
                Application Timeline &amp; Deadlines
              </h3>
            </div>
            <span className="text-[11px] font-mono text-stone-500">
              Fall 2028 Cycle
            </span>
          </div>

          <div className="space-y-4 pt-1 relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-stone-300">
            {/* Event 1: Early Action / Early Decision */}
            <div className="relative">
              <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-stone-700 ring-2 ring-[#FAF8F5]" />
              <div className="flex items-center gap-3">
                <EditableDate
                  value={timelineDates['ea']}
                  onChange={(val) => setTimelineDates(prev => ({ ...prev, 'ea': val }))}
                  className="text-xs font-mono font-semibold text-stone-700"
                />
                <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                  EA / ED
                </span>
                <span className="text-xs font-serif font-bold text-stone-900">
                  Early Action &amp; Early Decision
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
                  CSS Profile &amp; ISFAA Financial Aid
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
              Quick Navigations
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button 
              onClick={() => setActiveTab('usa-colleges')}
              className="p-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] border border-[#E2DBD1] rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <BookOpen className="w-4 h-4 text-stone-700 mb-1" />
              <span className="text-xs font-serif font-bold text-stone-900">College List</span>
            </button>

            <button 
              onClick={() => setActiveTab('usa-essays')}
              className="p-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] border border-[#E2DBD1] rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <FileText className="w-4 h-4 text-stone-700 mb-1" />
              <span className="text-xs font-serif font-bold text-stone-900">Main Essays</span>
            </button>

            <button 
              onClick={() => setActiveTab('usa-lors')}
              className="p-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] border border-[#E2DBD1] rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <Edit2 className="w-4 h-4 text-stone-700 mb-1" />
              <span className="text-xs font-serif font-bold text-stone-900">LOR Notebook</span>
            </button>

            <button 
              onClick={() => setActiveTab('usa-vault')}
              className="p-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] border border-[#E2DBD1] rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <Compass className="w-4 h-4 text-stone-700 mb-1" />
              <span className="text-xs font-serif font-bold text-stone-900">Research Vault</span>
            </button>
          </div>
        </div>

        {/* Campus Quote Card (4 cols) */}
        <div className="lg:col-span-4 bg-[#3B302A] text-white rounded-2xl p-5 shadow-xs border border-[#29231E] relative overflow-hidden flex flex-col justify-end min-h-[140px]">
          <div className="relative z-10 space-y-2">
            <span className="text-2xl font-serif text-[#D8C5AE] leading-none block">&ldquo;</span>
            <p className="font-serif italic text-stone-200 text-sm leading-snug">
              A strategic application turns your authentic strengths into unstoppable momentum.
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
