import React, { useState } from 'react';
import { TrackerProvider, useTracker } from './context/TrackerContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { OverviewView } from './components/OverviewView';
import { CalendarView } from './components/CalendarView';
import { MissionsView } from './components/MissionsView';
import { SubjectsView } from './components/SubjectsView';
import { HabitsView } from './components/HabitsView';
import { FocusTimerView } from './components/FocusTimerView';
import { StudyRoutineView } from './components/StudyRoutineView';
import { HscTargetsView } from './components/HscTargetsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { MissionModal } from './components/modals/MissionModal';
import { SubjectModal } from './components/modals/SubjectModal';
import { ProfileDrawer } from './components/modals/ProfileDrawer';
import { DateManagementModal } from './components/modals/DateManagementModal';
import { RightSidebar } from './components/RightSidebar';

const MainLayout: React.FC = () => {
  const { activeTab } = useTracker();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-gray-900 flex flex-col lg:flex-row antialiased selection:bg-black selection:text-white">
      {/* Left Navigation Sidebar */}
      <Sidebar 
        mobileOpen={mobileMenuOpen} 
        onCloseMobile={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Header */}
        <TopBar onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)} />

        {/* View Routing */}
        <main className="flex-1 pb-12">
          {activeTab === 'overview' && <OverviewView />}
          {activeTab === 'targets' && <HscTargetsView />}
          {activeTab === 'timer' && <FocusTimerView />}
          {activeTab === 'routine' && <StudyRoutineView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'missions' && <MissionsView />}
          {activeTab === 'subjects' && <SubjectsView />}
          {activeTab === 'habits' && <HabitsView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Right Quick Panel matching screenshot */}
      <RightSidebar />

      {/* Global Interactive Modals & Drawers */}
      <MissionModal />
      <SubjectModal />
      <ProfileDrawer />
      <DateManagementModal />
    </div>
  );
};

export default function App() {
  return (
    <TrackerProvider>
      <MainLayout />
    </TrackerProvider>
  );
}
