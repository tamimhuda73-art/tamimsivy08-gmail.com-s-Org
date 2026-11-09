import React from 'react';
import { 
  Building, 
  FileText, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Sparkles, 
  Compass, 
  Bookmark, 
  Plus, 
  ArrowRight, 
  Check, 
  Clock, 
  Star, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sliders,
  Calendar,
  CheckCircle2,
  Circle,
  HelpCircle,
  Rocket,
  Edit2,
  FolderOpen,
  Search
} from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { UsaSubSection, CollegeCategory } from '../../types/usaApp';
import { EditableDate } from './EditableDate';

interface UsaDashboardViewProps {
  onOpenSettings: () => void;
}

export const UsaDashboardView: React.FC<UsaDashboardViewProps> = ({ onOpenSettings }) => {
  const { 
    settings,
    targetDate,
    updateTargetDate,
    setActiveSubSection,
    setSelectedCollegeTab,
    setSelectedUniversityId,
    universities,
    mainEssays,
    supplementalNotebooks,
    storyBank,
    satArchive,
    hscArchive,
    sscArchive,
    englishTestRecords,
    bangladeshAdmissionEntries,
    recommendationNotebooks,
    sopDocuments,
    ecaActivities,
    passionProjectIdeas,
    activePassionProjects,
    strategyDecisions,
    researchVaultItems 
  } = useUsaApp();

  const unarchivedUniversities = universities.filter(u => !u.isArchived);
  const reachCount = unarchivedUniversities.filter(u => u.category === 'reach').length;
  const targetCount = unarchivedUniversities.filter(u => u.category === 'target').length;
  const safetyCount = unarchivedUniversities.filter(u => u.category === 'safety').length;

  const totalMainDrafts = mainEssays.reduce((acc, e) => acc + (e.drafts?.length || 0), 0);
  const totalSuppQuestions = Object.values(supplementalNotebooks).reduce(
    (acc, nb) => acc + (nb.questions?.length || 0), 0
  );

  const latestSatRecord = satArchive.records[0] || {
    totalScore: 1520,
    readingWritingScore: 760,
    mathScore: 760,
    testDate: '2025-08-24'
  };

  const latestEnglish = englishTestRecords[0] || {
    overallScore: '8.0',
    testDate: '2025-06-15'
  };

  // Compute dynamic days left until targetDate
  const daysLeft = React.useMemo(() => {
    try {
      const target = new Date(targetDate);
      if (isNaN(target.getTime())) return 361;
      const now = new Date();
      const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    } catch {
      return 361;
    }
  }, [targetDate]);

  return (
    <div className="space-y-6 text-[#292724]">
      {/* 1. Collegiate Architectural Hero Header matching image_3e89fc27.png */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#29231E] via-[#3B302A] to-[#4A3B31] text-[#F8F6F2] p-6 sm:p-8 shadow-sm">
        {/* Subtle architectural background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#D8C5AE_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-black/40 border border-white/10 text-[10px] font-mono font-bold text-[#D8C5AE] rounded-md uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-[#D8C5AE]" />
                {settings.applicationCycle}
              </span>
              <span className="text-white/40 font-mono text-xs">·</span>
              <span className="text-xs font-mono text-[#D8C5AE]">
                International Applicant from Bangladesh
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
              USA University Application
            </h1>
            <p className="text-xs sm:text-sm text-[#D8C5AE] font-serif italic">
              A well-planned application is the first step towards your dream.
            </p>
          </div>

          {/* Inspirational Quote Card on right */}
          <div className="bg-black/35 backdrop-blur-xs border border-white/10 rounded-xl p-4 lg:max-w-xs text-right self-start lg:self-auto space-y-1">
            <p className="text-xs sm:text-sm font-serif italic text-[#F8F6F2] leading-relaxed">
              “Dream big. Plan better. Achieve more.”
            </p>
            <span className="text-[10px] font-mono tracking-widest text-[#D8C5AE] uppercase block">
              — COMEBACK
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top 4 High-Level Metric Cards matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: College Research Progress */}
        <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-stone-600 mb-2">
              <Building className="w-4 h-4 text-[#59483D]" />
              <span className="text-xs font-mono font-semibold text-stone-700">
                College Research Progress
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-serif font-bold text-stone-900 tracking-tight">
                35%
              </span>
              <span className="text-xs font-mono font-bold text-stone-500">
                {unarchivedUniversities.length} / 10
              </span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden mt-3">
              <div className="bg-[#59483D] h-full rounded-full" style={{ width: '35%' }} />
            </div>
          </div>
          <div className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1 pt-1 border-t border-stone-100">
            <span>↑ +5% vs last week</span>
          </div>
        </div>

        {/* Card 2: Essays Progress */}
        <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-stone-600 mb-2">
              <FileText className="w-4 h-4 text-[#59483D]" />
              <span className="text-xs font-mono font-semibold text-stone-700">
                Essays Progress
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-serif font-bold text-stone-900 tracking-tight">
                60%
              </span>
              <span className="text-xs font-mono font-bold text-stone-500">
                {mainEssays.length + totalSuppQuestions} / 5
              </span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden mt-3">
              <div className="bg-[#3B302A] h-full rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
          <div className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1 pt-1 border-t border-stone-100">
            <span>↑ +10% vs last week</span>
          </div>
        </div>

        {/* Card 3: Application Readiness */}
        <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-stone-600">
                <CheckCircle2 className="w-4 h-4 text-[#59483D]" />
                <span className="text-xs font-mono font-semibold text-stone-700">
                  Application Readiness
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800">
                On Track
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-serif font-bold text-stone-900 tracking-tight">
                45%
              </span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden mt-3">
              <div className="bg-emerald-800 h-full rounded-full" style={{ width: '45%' }} />
            </div>
          </div>
          <div className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1 pt-1 border-t border-stone-100">
            <span>↑ +5% vs last month</span>
          </div>
        </div>

        {/* Card 4: Target Date (Editable Date!) */}
        <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-3 flex flex-col justify-between ring-1 ring-[#D8C5AE]/60">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-stone-600">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-mono font-semibold text-stone-700">
                  Target Date
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EFE7DC] text-[#3B302A]">
                ~ {daysLeft} days left
              </span>
            </div>

            <div className="mt-2">
              <EditableDate 
                value={targetDate}
                onSave={(newDate) => updateTargetDate(newDate)}
                displayMode="button"
                className="text-sm font-serif font-bold"
                label="Application Early Target Date"
              />
            </div>
          </div>

          <div className="text-[11px] font-mono text-stone-500 pt-1 border-t border-stone-100 flex items-center justify-between">
            <span>Round: Early Action / REA</span>
            <span className="text-amber-800 font-semibold">Priority Focus</span>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard 4-Column Grid matching image_3e89fc27.png */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Widget 1: College List */}
        <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-stone-400 transition-all">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-serif font-bold text-stone-900">College List</h3>
              </div>
              <button
                onClick={() => setActiveSubSection('colleges')}
                className="text-[11px] font-mono text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
              >
                View All →
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 py-2">
              <button 
                onClick={() => { setSelectedCollegeTab('reach'); setActiveSubSection('colleges'); }}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-50 text-amber-900 hover:bg-amber-100 cursor-pointer"
              >
                Reach {reachCount}
              </button>
              <button 
                onClick={() => { setSelectedCollegeTab('target'); setActiveSubSection('colleges'); }}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-stone-100 text-stone-800 hover:bg-stone-200 cursor-pointer"
              >
                Target {targetCount}
              </button>
              <button 
                onClick={() => { setSelectedCollegeTab('safety'); setActiveSubSection('colleges'); }}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-emerald-50 text-emerald-900 hover:bg-emerald-100 cursor-pointer"
              >
                Safety {safetyCount}
              </button>
            </div>

            {/* University Preview Items */}
            <div className="space-y-2 mt-2">
              {unarchivedUniversities.slice(0, 3).map(univ => (
                <div
                  key={univ.id}
                  onClick={() => {
                    setSelectedUniversityId(univ.id);
                    setActiveSubSection('colleges');
                  }}
                  className="p-2.5 rounded-xl bg-stone-50 hover:bg-[#F2ECE4] border border-stone-100 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#3B302A] text-[#EFE7DC] font-serif font-bold flex items-center justify-center text-xs shrink-0">
                      {univ.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-serif font-bold text-stone-900 truncate">
                        {univ.name}
                      </h4>
                      <p className="text-[10px] font-mono text-stone-500">
                        {univ.city}, {univ.state || univ.country}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Widget 2: Essays */}
        <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-stone-400 transition-all">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-serif font-bold text-stone-900">Essays</h3>
              </div>
              <button
                onClick={() => setActiveSubSection('essays')}
                className="text-[11px] font-mono text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2.5 mt-2">
              {/* Main Essay Item */}
              <div 
                onClick={() => setActiveSubSection('essays')}
                className="p-3 rounded-xl bg-stone-50 hover:bg-[#F2ECE4] border border-stone-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-stone-900">Main Essay</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EFE7DC] text-[#3B302A]">
                    Draft 2
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 font-sans mt-1">
                  Personal Growth & Ambition
                </p>
              </div>

              {/* Supplemental Essays Item */}
              <div 
                onClick={() => setActiveSubSection('essays')}
                className="p-3 rounded-xl bg-stone-50 hover:bg-[#F2ECE4] border border-stone-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-stone-900">Supplemental Essays</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-900">
                    In Progress
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 font-sans mt-1">
                  3 Universities
                </p>
              </div>

              {/* Story Bank Item */}
              <div 
                onClick={() => setActiveSubSection('essays')}
                className="p-3 rounded-xl bg-stone-50 hover:bg-[#F2ECE4] border border-stone-100 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-serif font-bold text-stone-900">Story Bank</span>
                  <p className="text-[11px] text-stone-600 font-sans mt-0.5">
                    {storyBank.length} Stories
                  </p>
                </div>
                <span className="text-[11px] font-mono text-stone-500 font-bold">
                  Updated ›
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 3: Academics */}
        <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-stone-400 transition-all">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-serif font-bold text-stone-900">Academics</h3>
              </div>
              <button
                onClick={() => setActiveSubSection('academics')}
                className="text-[11px] font-mono text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2 mt-2 text-xs font-mono">
              <div className="p-2 rounded-lg bg-stone-50 flex items-center justify-between">
                <span className="text-stone-600">SAT</span>
                <span className="font-bold text-stone-900">{latestSatRecord.totalScore} / 1600</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-50 flex items-center justify-between">
                <span className="text-stone-600">HSC</span>
                <span className="font-bold text-stone-900">GPA {hscArchive.hscTargetGpa}</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-50 flex items-center justify-between">
                <span className="text-stone-600">SSC</span>
                <span className="font-bold text-amber-800">Golden GPA {sscArchive.gpa}</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-50 flex items-center justify-between">
                <span className="text-stone-600">IELTS</span>
                <span className="font-bold text-stone-900">{latestEnglish.overallScore} / 9.0</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-50 flex items-center justify-between">
                <span className="text-stone-600">BD Tests</span>
                <span className="font-bold text-stone-700">In Progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 4: Core Missions */}
        <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-stone-400 transition-all">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-serif font-bold text-stone-900">Missions</h3>
              </div>
              <span className="text-[11px] font-mono text-stone-500 font-bold">5 Core</span>
            </div>

            <div className="space-y-2 mt-2 text-xs font-mono">
              {[
                { title: 'SAT 1550+', status: 'On Track', color: 'bg-emerald-50 text-emerald-800' },
                { title: 'HSC GPA 5.00', status: 'On Track', color: 'bg-emerald-50 text-emerald-800' },
                { title: 'IELTS 8.0+', status: 'Completed', color: 'bg-emerald-50 text-emerald-800' },
                { title: 'CRACK DU IBA', status: 'Pending', color: 'bg-stone-100 text-stone-700' },
                { title: 'APPLY TO USA', status: 'In Progress', color: 'bg-amber-50 text-amber-900' }
              ].map((m, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-stone-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Circle className="w-2.5 h-2.5 text-[#3B302A]" />
                    <span className="font-semibold text-stone-900">{m.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.color}`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Secondary Row: LORs & SOP, ECAs & Achievements, Passion Projects, Research Vault */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* LORs & SOP Card */}
        <div 
          onClick={() => setActiveSubSection('lors')}
          className="bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-3 cursor-pointer hover:border-stone-400 transition-all"
        >
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="text-sm font-serif font-bold text-stone-900">LORs & SOP</h3>
            <span className="text-[11px] font-mono text-stone-600">View All →</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div className="p-2.5 bg-stone-50 rounded-xl">
              <span className="text-[10px] text-stone-500 uppercase block">LORs</span>
              <span className="text-base font-bold text-stone-900">{recommendationNotebooks.length} Notebooks</span>
            </div>
            <div className="p-2.5 bg-stone-50 rounded-xl">
              <span className="text-[10px] text-stone-500 uppercase block">SOP</span>
              <span className="text-base font-bold text-stone-900">{sopDocuments.length} Drafts</span>
            </div>
          </div>
        </div>

        {/* ECAs & Achievements Card */}
        <div 
          onClick={() => setActiveSubSection('ecas')}
          className="bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-3 cursor-pointer hover:border-stone-400 transition-all"
        >
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="text-sm font-serif font-bold text-stone-900">ECAs & Achievements</h3>
            <span className="text-[11px] font-mono text-stone-600">View All →</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div className="p-2.5 bg-stone-50 rounded-xl">
              <span className="text-[10px] text-stone-500 uppercase block">Activities</span>
              <span className="text-base font-bold text-stone-900">{ecaActivities.length} Logged</span>
            </div>
            <div className="p-2.5 bg-stone-50 rounded-xl">
              <span className="text-[10px] text-stone-500 uppercase block">Honors</span>
              <span className="text-base font-bold text-amber-800">5 Major</span>
            </div>
          </div>
        </div>

        {/* Passion Projects Card */}
        <div 
          onClick={() => setActiveSubSection('projects')}
          className="bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-3 cursor-pointer hover:border-stone-400 transition-all"
        >
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="text-sm font-serif font-bold text-stone-900">Passion Projects</h3>
            <span className="text-[11px] font-mono text-stone-600">View All →</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div className="p-2.5 bg-stone-50 rounded-xl">
              <span className="text-[10px] text-stone-500 uppercase block">Idea Bank</span>
              <span className="text-base font-bold text-stone-900">{passionProjectIdeas.length} Ideas</span>
            </div>
            <div className="p-2.5 bg-stone-50 rounded-xl">
              <span className="text-[10px] text-stone-500 uppercase block">Active</span>
              <span className="text-base font-bold text-emerald-800">{activePassionProjects.length} Projects</span>
            </div>
          </div>
        </div>

        {/* Research Vault Card */}
        <div 
          onClick={() => setActiveSubSection('vault')}
          className="bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-3 cursor-pointer hover:border-stone-400 transition-all"
        >
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="text-sm font-serif font-bold text-stone-900">Research Vault</h3>
            <span className="text-[11px] font-mono text-stone-600">View All →</span>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl text-xs font-mono pt-1">
            <span className="text-[10px] text-stone-500 uppercase block">Total Resources</span>
            <span className="text-base font-bold text-stone-900">{researchVaultItems.length} Verified Entries</span>
            <span className="text-[11px] text-stone-500 block mt-0.5">Links, PDFs, Notes & more</span>
          </div>
        </div>
      </div>

      {/* 5. Strategy, Quick Actions, and Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Application Strategy (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#3B302A]" />
              <h3 className="text-sm font-serif font-bold text-stone-900">Application Strategy</h3>
            </div>
            <button 
              onClick={() => setActiveSubSection('strategy')}
              className="text-[11px] font-mono text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div 
              onClick={() => setActiveSubSection('strategy')}
              className="p-2.5 rounded-xl bg-stone-50 hover:bg-[#F2ECE4] border border-stone-100 flex items-center justify-between cursor-pointer"
            >
              <span className="text-stone-800 font-semibold">ED vs EA vs RD Guide</span>
              <span className="px-2 py-0.5 bg-[#EFE7DC] text-[#3B302A] rounded text-[10px] font-bold">Read</span>
            </div>
            <div 
              onClick={() => setActiveSubSection('strategy')}
              className="p-2.5 rounded-xl bg-stone-50 hover:bg-[#F2ECE4] border border-stone-100 flex items-center justify-between cursor-pointer"
            >
              <span className="text-stone-800 font-semibold">University Decision Planner</span>
              <span className="px-2 py-0.5 bg-[#EFE7DC] text-[#3B302A] rounded text-[10px] font-bold">Plan</span>
            </div>
            <div 
              onClick={() => setActiveSubSection('strategy')}
              className="p-2.5 rounded-xl bg-stone-50 hover:bg-[#F2ECE4] border border-stone-100 flex items-center justify-between cursor-pointer"
            >
              <span className="text-stone-800 font-semibold">Application Calendar</span>
              <span className="px-2 py-0.5 bg-[#EFE7DC] text-[#3B302A] rounded text-[10px] font-bold">View</span>
            </div>
          </div>
        </div>

        {/* Quick Actions (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-3">
          <div className="pb-2 border-b border-stone-100">
            <h3 className="text-sm font-serif font-bold text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-700" />
              Quick Actions
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              onClick={() => setActiveSubSection('colleges')}
              className="p-2.5 rounded-xl bg-stone-50 hover:bg-[#F2ECE4] border border-stone-200 text-stone-800 font-semibold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-stone-600" />
              <span>Research College</span>
            </button>
            <button
              onClick={() => setActiveSubSection('essays')}
              className="p-2.5 rounded-xl bg-stone-50 hover:bg-[#F2ECE4] border border-stone-200 text-stone-800 font-semibold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-stone-600" />
              <span>Write Essay</span>
            </button>
            <button
              onClick={() => setActiveSubSection('ecas')}
              className="p-2.5 rounded-xl bg-stone-50 hover:bg-[#F2ECE4] border border-stone-200 text-stone-800 font-semibold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-stone-600" />
              <span>Add ECA</span>
            </button>
            <button
              onClick={() => setActiveSubSection('academics')}
              className="p-2.5 rounded-xl bg-stone-50 hover:bg-[#F2ECE4] border border-stone-200 text-stone-800 font-semibold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-stone-600" />
              <span>Log Academics</span>
            </button>
          </div>
        </div>

        {/* Recent Activity Timeline (4 cols) with editable timestamps */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="text-sm font-serif font-bold text-stone-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-stone-700" />
              Recent Activity
            </h3>
            <span className="text-[11px] font-mono text-stone-500">Live Log</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-start gap-2 p-2 rounded-lg bg-stone-50 border border-stone-100">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3B302A] mt-1.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-stone-900 block truncate">
                  Updated Stanford research notes
                </span>
                <EditableDate 
                  value="2 hours ago"
                  onSave={() => {}}
                  displayMode="compact"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-lg bg-stone-50 border border-stone-100">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3B302A] mt-1.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-stone-900 block truncate">
                  Created a new essay draft (Draft 2)
                </span>
                <EditableDate 
                  value="4 hours ago"
                  onSave={() => {}}
                  displayMode="compact"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-lg bg-stone-50 border border-stone-100">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3B302A] mt-1.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-stone-900 block truncate">
                  Added a passion project idea
                </span>
                <EditableDate 
                  value="1 day ago"
                  onSave={() => {}}
                  displayMode="compact"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Bottom Inspirational Quote matching screenshot */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF7F2] via-white to-[#FAF7F2] border border-[#EAE4DC] flex items-center justify-center text-center">
        <p className="text-xs sm:text-sm font-serif italic text-stone-700">
          “A great future starts with the right choice.”
        </p>
      </div>
    </div>
  );
};
