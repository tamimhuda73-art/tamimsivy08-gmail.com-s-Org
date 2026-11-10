import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Trophy,
  Users,
  Heart,
  Briefcase,
  Rocket,
  Palette,
  Activity,
  Star,
  FlaskConical,
  GraduationCap,
  Crown,
  Plus, 
  Trash2, 
  Download, 
  Clock, 
  Calendar, 
  Check, 
  ChevronRight,
  Maximize2,
  UploadCloud,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link,
  Table,
  Quote,
  Undo2,
  Redo2,
  CheckCircle2,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { EcaActivityEntry, EcaCategory } from '../../types/usaApp';
import { EditableDate } from './EditableDate';

export const EcasView: React.FC = () => {
  const { 
    ecaActivities, 
    addEcaActivity, 
    updateEcaActivity, 
    deleteEcaActivity,
    addStoryBankEntry,
    setActiveTab
  } = useUsaApp();

  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    ecaActivities.length > 0 ? ecaActivities[0].id : null
  );

  const [activeFormTab, setActiveFormTab] = useState<'overview' | 'achievements' | 'responsibilities' | 'impact' | 'reflection'>('overview');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [storyBankToast, setStoryBankToast] = useState<string | null>(null);

  // New activity form state
  const [newForm, setNewForm] = useState({
    activityName: '',
    organization: '',
    category: 'Leadership' as EcaCategory,
    positionOrRole: '',
    startDate: 'Jan 2025',
    endDate: 'Present',
    hoursPerWeek: 3,
    weeksPerYear: 36,
    responsibilities: '',
    achievements: '',
    personalGrowth: ''
  });

  const selectedActivity = ecaActivities.find(a => a.id === selectedActivityId) || ecaActivities[0] || null;

  // Editable fields for the selected activity
  const [currentEdit, setCurrentEdit] = useState({
    activityName: '',
    organization: '',
    category: 'Leadership' as EcaCategory,
    positionOrRole: '',
    startDate: '',
    endDate: '',
    hoursPerWeek: 0,
    weeksPerYear: 0,
    responsibilities: '',
    achievements: '',
    personalGrowth: ''
  });

  // Sync edit state when selected activity changes
  React.useEffect(() => {
    if (selectedActivity) {
      setCurrentEdit({
        activityName: selectedActivity.activityName || '',
        organization: selectedActivity.organization || '',
        category: selectedActivity.category || 'Leadership',
        positionOrRole: selectedActivity.positionOrRole || '',
        startDate: selectedActivity.startDate || '2025',
        endDate: selectedActivity.endDate || 'Present',
        hoursPerWeek: selectedActivity.hoursPerWeek || 0,
        weeksPerYear: selectedActivity.weeksPerYear || 0,
        responsibilities: selectedActivity.responsibilities || '',
        achievements: selectedActivity.achievements || '',
        personalGrowth: selectedActivity.personalGrowth || ''
      });
    }
  }, [selectedActivity?.id]);

  // Dynamic calculations
  const totalActivitiesCount = ecaActivities.length;
  const totalAchievementsCount = ecaActivities.filter(a => !!a.achievements?.trim()).length;

  // Breakdown counts
  const academicCount = ecaActivities.filter(a => 
    a.category === 'Academic Competitions' || a.category === 'Olympiads' || a.category === 'Research'
  ).length;

  const leadershipCount = ecaActivities.filter(a => 
    a.category === 'Leadership' || a.category === 'Entrepreneurship'
  ).length;

  const communityCount = ecaActivities.filter(a => 
    a.category === 'Community Service' || a.category === 'Volunteering'
  ).length;

  const otherCount = ecaActivities.filter(a => 
    a.category === 'Sports' || a.category === 'Arts & Creative' || a.category === 'Internships' || a.category === 'Other Activities'
  ).length;

  // Filtered list
  const filteredActivities = useMemo(() => {
    if (selectedCategoryFilter === 'all') return ecaActivities;
    return ecaActivities.filter(a => a.category === selectedCategoryFilter);
  }, [ecaActivities, selectedCategoryFilter]);

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.activityName.trim()) return;

    addEcaActivity({
      activityName: newForm.activityName.trim(),
      organization: newForm.organization.trim(),
      category: newForm.category,
      positionOrRole: newForm.positionOrRole.trim() || 'Member',
      startDate: newForm.startDate,
      endDate: newForm.endDate,
      isOngoing: newForm.endDate.toLowerCase().includes('present'),
      hoursPerWeek: Number(newForm.hoursPerWeek) || 0,
      weeksPerYear: Number(newForm.weeksPerYear) || 0,
      yearsInvolved: ['11', '12'],
      responsibilities: newForm.responsibilities.trim(),
      achievements: newForm.achievements.trim(),
      leadershipDetails: '',
      communityImpact: '',
      personalGrowth: newForm.personalGrowth.trim(),
      skillsDeveloped: '',
      measurableOutcomes: '',
      evidenceLinks: [],
      personalReflections: '',
      unrestrictedNotes: ''
    });

    setNewForm({
      activityName: '',
      organization: '',
      category: 'Leadership',
      positionOrRole: '',
      startDate: 'Jan 2025',
      endDate: 'Present',
      hoursPerWeek: 3,
      weeksPerYear: 36,
      responsibilities: '',
      achievements: '',
      personalGrowth: ''
    });
    setNewModalOpen(false);
  };

  const handleSaveSelected = () => {
    if (!selectedActivity) return;
    updateEcaActivity(selectedActivity.id, {
      activityName: currentEdit.activityName,
      organization: currentEdit.organization,
      category: currentEdit.category,
      positionOrRole: currentEdit.positionOrRole,
      startDate: currentEdit.startDate,
      endDate: currentEdit.endDate,
      hoursPerWeek: Number(currentEdit.hoursPerWeek) || 0,
      weeksPerYear: Number(currentEdit.weeksPerYear) || 0,
      responsibilities: currentEdit.responsibilities,
      achievements: currentEdit.achievements,
      personalGrowth: currentEdit.personalGrowth
    });
    setStoryBankToast('Activity details updated successfully.');
    setTimeout(() => setStoryBankToast(null), 3000);
  };

  const handleSendToStoryBank = (activity: EcaActivityEntry) => {
    addStoryBankEntry({
      storyTitle: `${activity.activityName} (${activity.positionOrRole || 'Leadership'})`,
      experience: activity.responsibilities || `Involved with ${activity.organization} as ${activity.positionOrRole}.`,
      personalSignificance: activity.personalGrowth || activity.achievements || 'Significant milestone in extracurricular dedication.',
      challenge: 'Balancing rigorous academics with initiative milestones.',
      learning: activity.skillsDeveloped || 'Collaborative leadership, resilience, and accountability.',
      personalGrowth: activity.personalGrowth || 'Developed deep commitment to community and intellectual growth.',
      possibleEssayConnection: 'Common App Activity Reflection or Supplemental Essay',
      relatedEca: activity.activityName
    });

    setStoryBankToast(`Added "${activity.activityName}" to your Essay Story Bank!`);
    setTimeout(() => setStoryBankToast(null), 3500);
  };

  const exportEcaResume = () => {
    let doc = `# EXTRACURRICULAR PROFILE & COMMON APP ACTIVITIES\nGenerated: ${new Date().toLocaleDateString()}\nTotal Activities: ${ecaActivities.length}\n\n`;
    ecaActivities.forEach((act, idx) => {
      doc += `### ${idx + 1}. ${act.activityName} (${act.positionOrRole})\n`;
      doc += `Organization: ${act.organization} | Category: ${act.category}\n`;
      doc += `Timing: ${act.startDate} to ${act.endDate} | ${act.hoursPerWeek} hrs/week, ${act.weeksPerYear} wks/year\n`;
      if (act.responsibilities) doc += `Responsibilities: ${act.responsibilities}\n`;
      if (act.achievements) doc += `Honors / Achievements: ${act.achievements}\n`;
      doc += `\n---\n\n`;
    });
    const blob = new Blob([doc], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ECA_Dossier_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {storyBankToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#3B302A] text-white px-4 py-2.5 rounded-xl text-xs font-mono shadow-xl border border-stone-700 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{storyBankToast}</span>
        </div>
      )}

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
          <span className="text-stone-700 font-medium">ECAs &amp; Achievements</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif tracking-tight">
          ECAs &amp; Achievements
        </h1>
        <p className="text-sm text-stone-600 font-serif italic mt-0.5">
          Showcase your activities. Highlight your impact.
        </p>
      </div>

      {/* Hero Banner with Dynamic Stats */}
      <div className="bg-[#3B302A] text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#29231E]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 max-w-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 text-[#D8C5AE]" />
            </div>
            <div>
              <p className="font-serif italic text-stone-200 text-sm sm:text-base leading-snug">
                &ldquo;Your achievements today build your opportunities tomorrow. Common App allows 10 strategic activities.&rdquo;
              </p>
              <span className="text-[11px] font-mono tracking-widest text-[#D8C5AE] uppercase mt-1 block">
                &mdash; COMEBACK
              </span>
            </div>
          </div>

          {/* 3 Metric Pills */}
          <div className="flex flex-wrap items-center gap-6 lg:gap-8 border-t lg:border-t-0 lg:border-l border-white/15 pt-4 lg:pt-0 lg:pl-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Briefcase className="w-5 h-5 text-[#D8C5AE]" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">
                  {totalActivitiesCount} / 10
                </span>
                <span className="text-[11px] text-stone-300 font-sans">Common App Spots</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Star className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">
                  {totalAchievementsCount}
                </span>
                <span className="text-[11px] text-stone-300 font-sans">Key Achievements</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Clock className="w-5 h-5 text-[#D8C5AE]" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">
                  {ecaActivities.reduce((acc, a) => acc + (a.hoursPerWeek || 0), 0)}
                </span>
                <span className="text-[11px] text-stone-300 font-sans">Total Hrs/Week</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Overview meters, Categories, Activities List */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Overview with 4 Circular Arc Meters */}
          <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  Category Distribution
                </h3>
              </div>
              <span className="text-xs font-mono text-stone-500">
                {totalActivitiesCount} Logged
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {/* Meter 1: Academic */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#EAE4DC" strokeWidth="3" />
                    <circle 
                      cx="18" cy="18" r="14" fill="none" stroke="#3B302A" strokeWidth="3" 
                      strokeDasharray="88" 
                      strokeDashoffset={88 - (Math.min(academicCount, 5) / 5) * 88} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <GraduationCap className="w-4 h-4 text-stone-800 absolute" />
                </div>
                <span className="text-base font-bold font-mono text-stone-900 mt-1">{academicCount}</span>
                <span className="text-[9px] font-sans text-stone-500 leading-tight">Academic</span>
              </div>

              {/* Meter 2: Leadership */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#EAE4DC" strokeWidth="3" />
                    <circle 
                      cx="18" cy="18" r="14" fill="none" stroke="#3B302A" strokeWidth="3" 
                      strokeDasharray="88" 
                      strokeDashoffset={88 - (Math.min(leadershipCount, 5) / 5) * 88} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <Users className="w-4 h-4 text-stone-800 absolute" />
                </div>
                <span className="text-base font-bold font-mono text-stone-900 mt-1">{leadershipCount}</span>
                <span className="text-[9px] font-sans text-stone-500 leading-tight">Leadership</span>
              </div>

              {/* Meter 3: Community */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#EAE4DC" strokeWidth="3" />
                    <circle 
                      cx="18" cy="18" r="14" fill="none" stroke="#3B302A" strokeWidth="3" 
                      strokeDasharray="88" 
                      strokeDashoffset={88 - (Math.min(communityCount, 5) / 5) * 88} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <Heart className="w-4 h-4 text-stone-800 absolute" />
                </div>
                <span className="text-base font-bold font-mono text-stone-900 mt-1">{communityCount}</span>
                <span className="text-[9px] font-sans text-stone-500 leading-tight">Community</span>
              </div>

              {/* Meter 4: Other */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#EAE4DC" strokeWidth="3" />
                    <circle 
                      cx="18" cy="18" r="14" fill="none" stroke="#3B302A" strokeWidth="3" 
                      strokeDasharray="88" 
                      strokeDashoffset={88 - (Math.min(otherCount, 5) / 5) * 88} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <Sparkles className="w-4 h-4 text-stone-800 absolute" />
                </div>
                <span className="text-base font-bold font-mono text-stone-900 mt-1">{otherCount}</span>
                <span className="text-[9px] font-sans text-stone-500 leading-tight">Other</span>
              </div>
            </div>
          </div>

          {/* Card 2: Categories Filter Grid */}
          <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  Filter by Category
                </h3>
              </div>
              {selectedCategoryFilter !== 'all' && (
                <button 
                  onClick={() => setSelectedCategoryFilter('all')}
                  className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
                >
                  Clear Filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Competitions', category: 'Academic Competitions', icon: Trophy },
                { label: 'Research', category: 'Research', icon: FlaskConical },
                { label: 'Volunteering', category: 'Volunteering', icon: Heart },
                { label: 'Leadership', category: 'Leadership', icon: Crown },
                { label: 'Sports', category: 'Sports', icon: Activity },
                { label: 'Arts', category: 'Arts & Creative', icon: Palette },
                { label: 'Internships', category: 'Internships', icon: Briefcase },
                { label: 'Entrepreneurship', category: 'Entrepreneurship', icon: Rocket },
                { label: 'Community', category: 'Community Service', icon: Users, colSpan: true },
                { label: 'Other', category: 'Other Activities', icon: Star, colSpan: true },
              ].map(item => {
                const isSelected = selectedCategoryFilter === item.category;
                const count = ecaActivities.filter(a => a.category === item.category).length;
                const Icon = item.icon;
                return (
                  <button 
                    key={item.label}
                    onClick={() => setSelectedCategoryFilter(isSelected ? 'all' : item.category)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      item.colSpan ? 'col-span-2' : ''
                    } ${
                      isSelected ? 'bg-[#3B302A] text-white border-[#3B302A]' : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] border-[#E2DBD1] text-stone-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 mb-1" />
                    <span className="text-[10px] font-sans leading-tight">{item.label} ({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 3: Activities List */}
          <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  Activities ({filteredActivities.length})
                </h3>
              </div>
              <button 
                onClick={() => setNewModalOpen(true)}
                className="text-xs font-mono text-stone-800 hover:text-black font-semibold inline-flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded border border-[#E2DBD1]"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>

            {filteredActivities.length === 0 ? (
              <div className="text-center py-8 px-2 space-y-2">
                <p className="text-xs text-stone-500 font-sans">
                  {selectedCategoryFilter !== 'all' ? `No activities in "${selectedCategoryFilter}" yet.` : 'No activities logged yet.'}
                </p>
                <button
                  onClick={() => setNewModalOpen(true)}
                  className="px-3 py-1.5 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-medium"
                >
                  + Log First Activity
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredActivities.map((act) => {
                  const isSelected = selectedActivity?.id === act.id;
                  return (
                    <div
                      key={act.id}
                      onClick={() => setSelectedActivityId(act.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-white border-[#3B302A] shadow-xs ring-1 ring-[#3B302A]' 
                          : 'bg-white/70 hover:bg-white border-[#EAE4DC]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold font-serif text-stone-900 truncate">
                            {act.activityName}
                          </h4>
                          <p className="text-[10px] text-stone-600 font-sans mt-0.5 truncate">
                            {act.positionOrRole} &bull; {act.organization || act.category}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-stone-500">
                            <span>{act.startDate} - {act.endDate}</span>
                            <span>&bull;</span>
                            <span>{act.hoursPerWeek}h/wk</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendToStoryBank(act);
                            }}
                            title="Send to Essay Story Bank"
                            className="p-1 text-stone-400 hover:text-amber-700 bg-stone-50 hover:bg-amber-50 rounded border border-stone-200"
                          >
                            <BookOpen className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete activity "${act.activityName}"?`)) {
                                deleteEcaActivity(act.id);
                                if (selectedActivityId === act.id) setSelectedActivityId(null);
                              }
                            }}
                            title="Delete activity"
                            className="p-1 text-stone-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (7 cols): Activity Details Form */}
        <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-6 shadow-2xs space-y-5">
          {selectedActivity ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE4DC]">
                <div className="flex items-center gap-2 min-w-0">
                  <Award className="w-4 h-4 text-[#3B302A] shrink-0" />
                  <div className="min-w-0">
                    <h2 className="text-base font-bold font-serif text-stone-900 truncate">
                      {currentEdit.activityName || 'Activity Dossier'}
                    </h2>
                    <span className="text-[10px] font-mono text-stone-500">
                      {currentEdit.positionOrRole} &bull; {currentEdit.organization}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleSendToStoryBank(selectedActivity)}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer"
                    title="Export this activity as an entry in your Essay Story Bank"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Send to Story Bank</span>
                  </button>

                  <button
                    onClick={handleSaveSelected}
                    className="px-4 py-1.5 bg-[#3B302A] hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={exportEcaResume}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded-lg cursor-pointer"
                    title="Export all activities as markdown"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Left Tabs */}
                <div className="md:col-span-3 space-y-1">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'achievements', label: 'Achievements' },
                    { id: 'responsibilities', label: 'Responsibilities' },
                    { id: 'reflection', label: 'Reflection' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setActiveFormTab(t.id as any)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                        activeFormTab === t.id
                          ? 'bg-[#3B302A] text-white font-bold shadow-2xs'
                          : 'text-stone-700 hover:bg-[#F4EFEA]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Form Fields */}
                <div className="md:col-span-9 space-y-4">
                  {/* Name & Organization */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-serif font-semibold text-stone-800 mb-1">
                        Activity Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={currentEdit.activityName}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, activityName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#E2DBD1] rounded-xl text-xs font-sans text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-serif font-semibold text-stone-800 mb-1">
                        Organization / Sponsor <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={currentEdit.organization}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, organization: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#E2DBD1] rounded-xl text-xs font-sans text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Category, Position, Start Date, End Date */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-serif font-semibold text-stone-800 mb-1">
                        Category
                      </label>
                      <select
                        value={currentEdit.category}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, category: e.target.value as any })}
                        className="w-full px-2 py-1.5 bg-white border border-[#E2DBD1] rounded-xl text-xs text-stone-800 cursor-pointer"
                      >
                        <option value="Leadership">Leadership</option>
                        <option value="Academic Competitions">Academic Competitions</option>
                        <option value="Research">Research</option>
                        <option value="Community Service">Community Service</option>
                        <option value="Volunteering">Volunteering</option>
                        <option value="Sports">Sports</option>
                        <option value="Arts & Creative">Arts & Creative</option>
                        <option value="Internships">Internships</option>
                        <option value="Entrepreneurship">Entrepreneurship</option>
                        <option value="Other Activities">Other Activities</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-serif font-semibold text-stone-800 mb-1">
                        Position / Role
                      </label>
                      <input
                        type="text"
                        value={currentEdit.positionOrRole}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, positionOrRole: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white border border-[#E2DBD1] rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-serif font-semibold text-stone-800 mb-1">
                        Start Date
                      </label>
                      <input
                        type="text"
                        value={currentEdit.startDate}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, startDate: e.target.value })}
                        placeholder="e.g. Jan 2025"
                        className="w-full px-2 py-1.5 bg-white border border-[#E2DBD1] rounded-xl text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-serif font-semibold text-stone-800 mb-1">
                        End Date
                      </label>
                      <input
                        type="text"
                        value={currentEdit.endDate}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, endDate: e.target.value })}
                        placeholder="e.g. Present"
                        className="w-full px-2 py-1.5 bg-white border border-[#E2DBD1] rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Hours & Weeks */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-serif font-semibold text-stone-800 mb-1">
                        Hours per Week
                      </label>
                      <input
                        type="number"
                        value={currentEdit.hoursPerWeek}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, hoursPerWeek: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 bg-white border border-[#E2DBD1] rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-serif font-semibold text-stone-800 mb-1">
                        Weeks per Year
                      </label>
                      <input
                        type="number"
                        value={currentEdit.weeksPerYear}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, weeksPerYear: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 bg-white border border-[#E2DBD1] rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Dynamic Tab Body */}
                  {activeFormTab === 'overview' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-serif font-semibold text-stone-800">
                          Description &amp; Key Responsibilities (Common App 150-char limit target)
                        </label>
                        <span className="text-[10px] font-mono text-stone-500">
                          {currentEdit.responsibilities.length} chars
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={currentEdit.responsibilities}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, responsibilities: e.target.value })}
                        placeholder="Lead with active verbs, specify your measurable scope and key responsibilities..."
                        className="w-full px-3 py-2 bg-white border border-[#E2DBD1] rounded-xl text-xs font-serif text-stone-800 leading-relaxed focus:outline-none"
                      />
                    </div>
                  )}

                  {activeFormTab === 'achievements' && (
                    <div>
                      <label className="block text-xs font-serif font-semibold text-stone-800 mb-1">
                        Honors, Awards &amp; Measurable Achievements
                      </label>
                      <textarea
                        rows={4}
                        value={currentEdit.achievements}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, achievements: e.target.value })}
                        placeholder="List specific awards, state/national recognition, growth metrics (e.g. raised $2,000, 150 members)..."
                        className="w-full px-3 py-2 bg-white border border-[#E2DBD1] rounded-xl text-xs font-serif text-stone-800 leading-relaxed focus:outline-none"
                      />
                    </div>
                  )}

                  {activeFormTab === 'responsibilities' && (
                    <div>
                      <label className="block text-xs font-serif font-semibold text-stone-800 mb-1">
                        Detailed Responsibilities &amp; Operations
                      </label>
                      <textarea
                        rows={4}
                        value={currentEdit.responsibilities}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, responsibilities: e.target.value })}
                        placeholder="Detailed day-to-day duties, committee assignments, teams managed..."
                        className="w-full px-3 py-2 bg-white border border-[#E2DBD1] rounded-xl text-xs font-serif text-stone-800 leading-relaxed focus:outline-none"
                      />
                    </div>
                  )}

                  {activeFormTab === 'reflection' && (
                    <div>
                      <label className="block text-xs font-serif font-semibold text-stone-800 mb-1">
                        Personal Reflection &amp; Character Growth
                      </label>
                      <textarea
                        rows={4}
                        value={currentEdit.personalGrowth}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, personalGrowth: e.target.value })}
                        placeholder="What did this activity teach you about yourself, leadership, teamwork, or resilience?"
                        className="w-full px-3 py-2 bg-white border border-[#E2DBD1] rounded-xl text-xs font-serif text-stone-800 leading-relaxed focus:outline-none"
                      />
                    </div>
                  )}

                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E2DBD1] flex items-center justify-center mx-auto text-stone-400">
                <Trophy className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold font-serif text-stone-900">
                No Activity Selected
              </h3>
              <p className="text-xs text-stone-500 font-sans max-w-sm mx-auto">
                Log your extracurricular activities, Olympiads, and leadership positions to build your Common App dossier.
              </p>
              <button
                onClick={() => setNewModalOpen(true)}
                className="px-4 py-2 bg-[#3B302A] hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer"
              >
                + Add Activity
              </button>
            </div>
          )}
        </div>

      </div>

      {/* NEW ACTIVITY MODAL */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-bold font-serif text-stone-900">
              Log Extracurricular Activity
            </h3>
            <form onSubmit={handleCreateActivity} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">
                  Activity Name *
                </label>
                <input
                  type="text"
                  required
                  value={newForm.activityName}
                  onChange={(e) => setNewForm({ ...newForm, activityName: e.target.value })}
                  placeholder="e.g. Bangladesh Math Olympiad, Model United Nations"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-stone-700 mb-1">
                    Role / Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={newForm.positionOrRole}
                    onChange={(e) => setNewForm({ ...newForm, positionOrRole: e.target.value })}
                    placeholder="e.g. President, Finalist, Lead Researcher"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-stone-700 mb-1">
                    Organization / Club
                  </label>
                  <input
                    type="text"
                    value={newForm.organization}
                    onChange={(e) => setNewForm({ ...newForm, organization: e.target.value })}
                    placeholder="e.g. School Science Club"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newForm.category}
                    onChange={(e) => setNewForm({ ...newForm, category: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-xs"
                  >
                    <option value="Leadership">Leadership</option>
                    <option value="Academic Competitions">Academic Competitions</option>
                    <option value="Research">Research</option>
                    <option value="Community Service">Community Service</option>
                    <option value="Volunteering">Volunteering</option>
                    <option value="Sports">Sports</option>
                    <option value="Arts & Creative">Arts & Creative</option>
                    <option value="Internships">Internships</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Other Activities">Other Activities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-stone-700 mb-1">
                    Hours / Wk
                  </label>
                  <input
                    type="number"
                    value={newForm.hoursPerWeek}
                    onChange={(e) => setNewForm({ ...newForm, hoursPerWeek: Number(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-stone-700 mb-1">
                    Weeks / Yr
                  </label>
                  <input
                    type="number"
                    value={newForm.weeksPerYear}
                    onChange={(e) => setNewForm({ ...newForm, weeksPerYear: Number(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">
                  Description / Responsibilities (150 chars target)
                </label>
                <textarea
                  rows={2}
                  value={newForm.responsibilities}
                  onChange={(e) => setNewForm({ ...newForm, responsibilities: e.target.value })}
                  placeholder="Action-oriented summary of what you did and your impact..."
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">
                  Key Achievements / Honors
                </label>
                <input
                  type="text"
                  value={newForm.achievements}
                  onChange={(e) => setNewForm({ ...newForm, achievements: e.target.value })}
                  placeholder="e.g. 1st Place National, Best Delegate award"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-medium"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
