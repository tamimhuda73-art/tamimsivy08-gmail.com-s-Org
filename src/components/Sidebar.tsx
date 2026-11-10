import React, { useState } from 'react';
import { 
  Home,
  LayoutGrid, 
  Calendar as CalendarIcon, 
  CalendarRange,
  Target, 
  BookOpen,
  GraduationCap, 
  Flame, 
  Clock,
  Timer,
  BarChart2, 
  Settings,
  Shield,
  User,
  Sliders,
  ChevronsLeft,
  ChevronDown,
  ChevronRight,
  Compass,
  Sparkles
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { useUsaApp } from '../context/UsaAppContext';
import { NavTab } from '../types/tracker';
import { UsaSubSection } from '../types/usaApp';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { 
    activeTab, 
    setActiveTab, 
    sidebarCollapsed, 
    toggleSidebar,
    setIsProfileDrawerOpen 
  } = useTracker();

  const { activeSubSection, setActiveSubSection, openAiDrawer } = useUsaApp();
  const [usaMenuExpanded, setUsaMenuExpanded] = useState(true);

  const usaSubSections: { id: UsaSubSection; label: string }[] = [
    { id: 'dashboard', label: '1. Dashboard' },
    { id: 'colleges', label: '2. College List' },
    { id: 'essays', label: '3. Essays Studio' },
    { id: 'academics', label: '4. Academics' },
    { id: 'lors', label: '5. LORs' },
    { id: 'sop', label: '6. SOP' },
    { id: 'ecas', label: '7. ECAs & Achievements' },
    { id: 'projects', label: '8. Passion Projects' },
    { id: 'strategy', label: '9. Strategy & Rounds' },
    { id: 'vault', label: '10. Research Vault' },
    { id: 'admissions-ai', label: '11. Admissions AI ✨' },
  ];

  const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'routine', label: 'Study Routine', icon: CalendarRange },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'missions', label: 'Missions', icon: Target },
    { id: 'targets', label: 'Monthly Targets', icon: CalendarRange },
    { id: 'habits', label: 'Daily Habit Tracker', icon: Flame },
    { id: 'timer', label: 'Focus Timer', icon: Clock },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#FAF8F5] border-r border-[#EAE6DE] flex flex-col
        transition-all duration-300 ease-in-out shrink-0 select-none
        lg:sticky lg:top-0 lg:h-screen lg:z-30
        ${sidebarCollapsed ? 'lg:hidden -translate-x-full' : 'lg:translate-x-0'}
        ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'}
      `}>
        {/* Logo & Brand Header */}
        <div className="h-18 px-5 flex items-center justify-between border-b border-[#EAE6DE]/70 shrink-0">
          <div>
            <h1 className="font-extrabold text-gray-900 tracking-wider text-base leading-none">
              COMEBACK
            </h1>
            <p className="text-[10px] font-mono text-gray-400 font-semibold tracking-wider uppercase mt-1">
              STUDY TRACKER
            </p>
          </div>

          {/* Desktop Collapse Button matching << in screenshot */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-1.5 text-gray-400 hover:text-gray-900 hover:bg-[#EFECE6] rounded-lg transition-colors cursor-pointer"
            title="Collapse sidebar (Full screen mode)"
            aria-label="Collapse sidebar"
          >
            <ChevronsLeft className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Navigation Section: flex-1 fills all vertical space between top and bottom bar */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-1">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer
                    ${isActive 
                      ? 'bg-[#EAE2D7] text-gray-900 shadow-2xs font-bold' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-[#F2ECE3]'}
                  `}
                >
                  <Icon 
                    className={`w-4 h-4 transition-colors ${isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`} 
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />}
                </button>
              );
            })}

            {/* USA APPLICATION Primary Navigation Section */}
            <div className="pt-2">
              <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                Admissions Workspace
              </div>

              {/* Quick Admissions AI Trigger Button */}
              <button
                onClick={() => openAiDrawer()}
                className="w-full mb-1 flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-stone-900 to-amber-950 text-white text-xs font-mono font-bold hover:shadow-xs transition-all cursor-pointer shadow-2xs group"
                title="Open Admissions AI Assistant"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>Ask Admissions AI</span>
                </div>
                <span className="text-[9px] bg-amber-400/20 text-amber-200 px-1.5 py-0.5 rounded font-mono">
                  2028
                </span>
              </button>
              
              <button
                onClick={() => {
                  handleSelectTab('usa-app');
                  setUsaMenuExpanded(prev => activeTab === 'usa-app' ? !prev : true);
                }}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group cursor-pointer
                  ${activeTab === 'usa-app'
                    ? 'bg-stone-900 text-white shadow-xs' 
                    : 'text-stone-700 hover:text-stone-900 hover:bg-[#F2ECE3]'}
                `}
              >
                <Compass 
                  className={`w-4 h-4 transition-colors ${activeTab === 'usa-app' ? 'text-white' : 'text-stone-600'}`} 
                  strokeWidth={2}
                />
                <span className="flex-1 text-left tracking-tight">USA APPLICATION</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-extrabold ${
                  activeTab === 'usa-app' ? 'bg-stone-800 text-amber-200' : 'bg-stone-200 text-stone-700'
                }`}>
                  2028
                </span>
                {usaMenuExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                )}
              </button>

              {/* Subsections accordion */}
              {(activeTab === 'usa-app' || usaMenuExpanded) && (
                <div className="mt-1 ml-3 pl-3 border-l-2 border-stone-200 space-y-0.5 py-1 animate-in fade-in duration-150">
                  {usaSubSections.map(sub => {
                    const isSubActive = activeTab === 'usa-app' && activeSubSection === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          handleSelectTab('usa-app');
                          setActiveSubSection(sub.id);
                        }}
                        className={`
                          w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-colors text-left cursor-pointer
                          ${isSubActive 
                            ? 'bg-[#EAE2D7] text-stone-900 font-bold' 
                            : 'text-stone-600 hover:text-stone-900 hover:bg-[#F2ECE3]'}
                        `}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSubActive ? 'bg-stone-900' : 'bg-stone-300'}`} />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Bottom Section: Settings, Admin Controls, Profile (docked cleanly at the bottom) */}
        <div className="p-3 border-t border-[#EAE6DE]/70 space-y-1 shrink-0 bg-[#FAF8F5]">
          <button
            onClick={() => handleSelectTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'bg-[#EAE2D7] text-gray-900 font-semibold' : 'text-gray-600 hover:bg-[#F2ECE3] hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4 text-gray-500" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => handleSelectTab('targets')}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-[#F2ECE3] hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-gray-500" />
            <span>Admin Controls</span>
          </button>

          <button
            onClick={() => setIsProfileDrawerOpen(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-[#F2ECE3] hover:text-gray-900 transition-colors cursor-pointer"
          >
            <div className="w-4 h-4 rounded-full bg-gray-900 text-white text-[9px] font-bold flex items-center justify-center">
              T
            </div>
            <span>Profile/avatar</span>
          </button>
        </div>
      </aside>
    </>
  );
};
