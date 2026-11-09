import React from 'react';
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
  ChevronsLeft
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { NavTab } from '../types/tracker';

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
        fixed top-0 bottom-0 left-0 z-50 w-60 bg-[#FAF8F5] border-r border-[#EAE6DE] flex flex-col justify-between
        transition-all duration-300 ease-in-out lg:static shrink-0 select-none
        ${sidebarCollapsed ? 'lg:hidden -translate-x-full' : 'lg:translate-x-0'}
        ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'}
      `}>
        <div className="flex flex-col">
          {/* Logo & Brand Header */}
          <div className="h-20 px-5 flex items-center justify-between border-b border-[#EAE6DE]/70">
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

          {/* Navigation Section */}
          <div className="px-3 py-4">
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
                        ? 'bg-[#EAE2D7] text-gray-900 shadow-2xs' 
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
            </nav>
          </div>
        </div>

        {/* Bottom Section: Settings, Admin Controls, Profile */}
        <div className="p-3 border-t border-[#EAE6DE]/70 space-y-1">
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
