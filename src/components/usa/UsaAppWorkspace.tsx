import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Building, 
  FileText, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Sparkles, 
  Compass, 
  Bookmark, 
  Search,
  Sliders,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { UsaSubSection } from '../../types/usaApp';
import { UsaDashboardView } from './UsaDashboardView';
import { CollegeListView } from './CollegeListView';
import { EssaysView } from './EssaysView';
import { AcademicsView } from './AcademicsView';
import { LorsView } from './LorsView';
import { SopView } from './SopView';
import { EcasView } from './EcasView';
import { PassionProjectsView } from './PassionProjectsView';
import { StrategyView } from './StrategyView';
import { ResearchVaultView } from './ResearchVaultView';
import { UsaSettingsModal } from './UsaSettingsModal';

export const UsaAppWorkspace: React.FC = () => {
  const { 
    activeSubSection, 
    setActiveSubSection, 
    settings,
    globalSearchQuery,
    setGlobalSearchQuery,
    universities,
    mainEssays,
    ecaActivities,
    passionProjectIdeas,
    activePassionProjects,
    researchVaultItems,
    setSelectedUniversityId,
    setActiveMainEssayId
  } = useUsaApp();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navItems: { id: UsaSubSection; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'colleges', label: 'College List', icon: Building },
    { id: 'essays', label: 'Essays', icon: FileText },
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'lors', label: 'LORs', icon: Award },
    { id: 'sop', label: 'SOP', icon: Layers },
    { id: 'ecas', label: 'ECAs & Achievements', icon: Award },
    { id: 'projects', label: 'Passion Projects', icon: Sparkles },
    { id: 'strategy', label: 'Application Strategy', icon: Compass },
    { id: 'vault', label: 'Research Vault', icon: Bookmark },
  ];

  // Quick Global Search filter results when typing in header search
  const searchResults = React.useMemo(() => {
    const q = globalSearchQuery.toLowerCase().trim();
    if (!q) return null;

    const matchedUniversities = universities.filter(u => 
      u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q) || (u.intendedMajor || '').toLowerCase().includes(q)
    );

    const matchedEssays = mainEssays.filter(e => 
      e.title.toLowerCase().includes(q) || e.currentContent.toLowerCase().includes(q)
    );

    const matchedEcas = ecaActivities.filter(a => 
      a.activityName.toLowerCase().includes(q) || a.responsibilities.toLowerCase().includes(q)
    );

    const matchedProjects = [
      ...passionProjectIdeas.filter(p => p.projectTitle.toLowerCase().includes(q) || p.ideaDescription.toLowerCase().includes(q)),
      ...activePassionProjects.filter(p => p.projectTitle.toLowerCase().includes(q) || p.overview.toLowerCase().includes(q))
    ];

    const matchedVault = researchVaultItems.filter(v => 
      v.title.toLowerCase().includes(q) || (v.description || '').toLowerCase().includes(q) || v.tags.some(t => t.toLowerCase().includes(q))
    );

    return {
      universities: matchedUniversities,
      essays: matchedEssays,
      ecas: matchedEcas,
      projects: matchedProjects,
      vault: matchedVault,
      totalCount: matchedUniversities.length + matchedEssays.length + matchedEcas.length + matchedProjects.length + matchedVault.length
    };
  }, [globalSearchQuery, universities, mainEssays, ecaActivities, passionProjectIdeas, activePassionProjects, researchVaultItems]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Sub-Navigation Ribbon */}
      <div className="bg-white border border-[#EAE6DE] rounded-2xl px-3 py-2 shadow-2xs flex items-center justify-between gap-3 overflow-x-auto select-none">
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSubSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSubSection(item.id);
                  setGlobalSearchQuery('');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#EAE2D7] text-stone-900 font-bold shadow-2xs' 
                    : 'text-stone-600 hover:text-stone-900 hover:bg-[#F2ECE3]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-900' : 'text-stone-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global USA Knowledge Base Search Input */}
        <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-stone-200 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              placeholder="Search USA Application..."
              className="pl-8 pr-3 py-1.5 bg-[#FAF8F5] border border-stone-300 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-600 w-48 font-sans"
            />
            {globalSearchQuery && (
              <button
                onClick={() => setGlobalSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global Search Results Overlay (if searching) */}
      {searchResults && (
        <div className="bg-white border border-[#EAE6DE] rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold font-serif text-stone-900">
                Global Search Results: &quot;{globalSearchQuery}&quot;
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Found {searchResults.totalCount} matches across USA application archives
              </p>
            </div>
            <button
              onClick={() => setGlobalSearchQuery('')}
              className="text-xs font-mono text-stone-500 hover:text-stone-900 cursor-pointer"
            >
              Clear Search
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Universities */}
            {searchResults.universities.map(u => (
              <div 
                key={u.id}
                onClick={() => {
                  setSelectedUniversityId(u.id);
                  setActiveSubSection('colleges');
                  setGlobalSearchQuery('');
                }}
                className="p-3.5 bg-[#FAF8F5] hover:bg-white border border-stone-200 rounded-xl cursor-pointer transition-all"
              >
                <span className="text-[10px] font-mono font-bold text-amber-900 uppercase">College List</span>
                <h4 className="text-sm font-bold font-serif text-stone-900 mt-1">{u.name}</h4>
                <p className="text-xs text-stone-500 font-sans">{u.city}, {u.state ? `${u.state}, ` : ''}{u.country}</p>
              </div>
            ))}

            {/* Essays */}
            {searchResults.essays.map(e => (
              <div 
                key={e.id}
                onClick={() => {
                  setActiveMainEssayId(e.id);
                  setActiveSubSection('essays');
                  setGlobalSearchQuery('');
                }}
                className="p-3.5 bg-[#FAF8F5] hover:bg-white border border-stone-200 rounded-xl cursor-pointer transition-all"
              >
                <span className="text-[10px] font-mono font-bold text-stone-700 uppercase">Main Essay</span>
                <h4 className="text-sm font-bold font-serif text-stone-900 mt-1">{e.title}</h4>
                <p className="text-xs text-stone-500 font-sans line-clamp-1">{e.promptChoice}</p>
              </div>
            ))}

            {/* ECAs */}
            {searchResults.ecas.map(a => (
              <div 
                key={a.id}
                onClick={() => {
                  setActiveSubSection('ecas');
                  setGlobalSearchQuery('');
                }}
                className="p-3.5 bg-[#FAF8F5] hover:bg-white border border-stone-200 rounded-xl cursor-pointer transition-all"
              >
                <span className="text-[10px] font-mono font-bold text-emerald-900 uppercase">ECA</span>
                <h4 className="text-sm font-bold font-serif text-stone-900 mt-1">{a.activityName}</h4>
                <p className="text-xs text-stone-500 font-sans">{a.positionOrRole}</p>
              </div>
            ))}

            {/* Vault */}
            {searchResults.vault.map(v => (
              <div 
                key={v.id}
                onClick={() => {
                  setActiveSubSection('vault');
                  setGlobalSearchQuery('');
                }}
                className="p-3.5 bg-[#FAF8F5] hover:bg-white border border-stone-200 rounded-xl cursor-pointer transition-all"
              >
                <span className="text-[10px] font-mono font-bold text-purple-900 uppercase">Research Vault</span>
                <h4 className="text-sm font-bold font-serif text-stone-900 mt-1">{v.title}</h4>
                <p className="text-xs text-stone-500 font-sans line-clamp-1">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Viewport Router */}
      <main className="space-y-6">
        {activeSubSection === 'dashboard' && (
          <UsaDashboardView onOpenSettings={() => setIsSettingsOpen(true)} />
        )}
        {activeSubSection === 'colleges' && <CollegeListView />}
        {activeSubSection === 'essays' && <EssaysView />}
        {activeSubSection === 'academics' && <AcademicsView />}
        {activeSubSection === 'lors' && <LorsView />}
        {activeSubSection === 'sop' && <SopView />}
        {activeSubSection === 'ecas' && <EcasView />}
        {activeSubSection === 'projects' && <PassionProjectsView />}
        {activeSubSection === 'strategy' && <StrategyView />}
        {activeSubSection === 'vault' && <ResearchVaultView />}
      </main>

      {/* Global Settings Modal */}
      {isSettingsOpen && (
        <UsaSettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}

    </div>
  );
};
