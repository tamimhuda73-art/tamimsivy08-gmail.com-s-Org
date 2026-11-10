import React from 'react';
import { 
  Bell, 
  Search,
  Menu,
  ChevronsRight,
  Plus,
  Sparkles
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { useUsaApp } from '../context/UsaAppContext';

interface TopBarProps {
  onToggleMobileMenu: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleMobileMenu }) => {
  const { 
    user, 
    isNotificationsOpen, 
    setIsNotificationsOpen,
    isProfileDrawerOpen,
    setIsProfileDrawerOpen,
    sidebarCollapsed,
    toggleSidebar,
    toggleRightSidebar,
    events
  } = useTracker();

  const { openAiDrawer } = useUsaApp();

  const formattedToday = React.useMemo(() => {
    try {
      const parts = (user.currentDate || "2026-11-10").split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        const localDate = new Date(y, m, d);
        return localDate.toLocaleDateString('en-US', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }).toUpperCase();
      }
    } catch {
      // fallback
    }
    return "TUESDAY, 10 NOVEMBER 2026";
  }, [user.currentDate]);

  return (
    <header className="px-6 sm:px-8 pt-6 pb-4 bg-[#F8F5F0] border-b border-[#EAE6DE]/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left zone: Date pill, Greeting headline, Subtitle */}
      <div>
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={onToggleMobileMenu}
            className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-[#EAE2D7] lg:hidden cursor-pointer"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop expand sidebar button when collapsed */}
          {sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-[#EAE2D7] border border-[#EAE6DE] rounded-lg text-xs font-mono font-semibold text-gray-800 transition-colors cursor-pointer shadow-2xs"
              title="Expand sidebar"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
              <span>Expand Sidebar</span>
            </button>
          )}

          {/* Date pill matching screenshot */}
          <div className="px-3 py-1 bg-[#EFE9DF] border border-[#E2DDD3] text-[11px] font-mono font-bold text-gray-700 rounded-lg uppercase tracking-wider select-none">
            {formattedToday}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2 leading-tight">
          Good morning. Let&apos;s make this count.
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-sans mt-0.5">
          Every focused session brings the comeback closer.
        </p>
      </div>

      {/* Right zone: Search bar, Notification Bell, User Avatar */}
      <div className="flex items-center gap-3 self-end md:self-center">
        {/* Search input matching screenshot */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="pl-8 pr-4 py-2 bg-white/80 border border-[#EAE6DE] rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black w-44 sm:w-56 font-sans transition-all"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-gray-500 hover:text-gray-900 bg-white/80 hover:bg-white border border-[#EAE6DE] rounded-xl transition-colors relative cursor-pointer"
            title="Notifications & Upcoming Events"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {events.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-gray-200 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-900 font-mono uppercase tracking-wider">
                  Target Alerts & Deadlines
                </span>
                <span className="text-[11px] font-mono text-gray-400">
                  {events.length} active
                </span>
              </div>
              <div className="py-2 divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {events.map((ev) => (
                  <div key={ev.id} className="py-2.5 flex flex-col gap-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-800 line-clamp-1">{ev.title}</span>
                      <span className="text-[10px] font-mono text-amber-700 font-medium px-1.5 py-0.5 bg-amber-50 rounded">
                        {ev.date}
                      </span>
                    </div>
                    {ev.time && <span className="text-[11px] text-gray-400">{ev.time}</span>}
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-gray-100 text-center">
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-xs font-semibold text-gray-600 hover:text-black py-1 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admissions AI Assistant Button */}
        <button
          onClick={() => openAiDrawer()}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-stone-900 to-amber-950 hover:from-black hover:to-stone-900 text-white text-xs font-bold font-mono tracking-wider transition-all cursor-pointer shadow-xs shrink-0"
          title="Open Admissions AI Instructor (Fall 2028)"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span className="hidden sm:inline">Ask AI</span>
          <span className="text-[10px] bg-amber-400/20 text-amber-200 px-1 py-0.2 rounded font-mono">2028</span>
        </button>

        {/* + Quick-add button matching reference */}
        <button
          onClick={toggleRightSidebar}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold font-mono tracking-wider transition-all cursor-pointer shadow-xs shrink-0"
          title="Toggle Quick Add & Tools"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Quick-add</span>
        </button>

        {/* User Profile Avatar with Online Dot */}
        <button
          onClick={() => setIsProfileDrawerOpen(!isProfileDrawerOpen)}
          className="relative w-9 h-9 rounded-full bg-stone-800 text-white text-xs font-bold flex items-center justify-center hover:ring-2 hover:ring-stone-400 transition-all cursor-pointer shadow-xs select-none"
          title={`Profile: ${user.name}`}
          aria-label="User Profile"
        >
          <span>{user.initials || "TA"}</span>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
};
