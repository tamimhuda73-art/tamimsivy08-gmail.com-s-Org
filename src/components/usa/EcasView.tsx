import React, { useState } from 'react';
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
  Image as ImageIcon,
  Table,
  Quote,
  Undo2,
  Redo2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { EditableDate } from './EditableDate';

export const EcasView: React.FC = () => {
  const { 
    ecaActivities, 
    addEcaActivity, 
    updateEcaActivity, 
    deleteEcaActivity,
    setActiveTab
  } = useUsaApp();

  // Selected Activity form state (matching screenshot)
  const [activeFormTab, setActiveFormTab] = useState<'overview' | 'achievements' | 'responsibilities' | 'evidence' | 'reflection' | 'goals'>('overview');

  const [activityName, setActivityName] = useState('Model United Nations (MUN)');
  const [organization, setOrganization] = useState('DPS MUN');
  const [category, setCategory] = useState('Leadership');
  const [positionRole, setPositionRole] = useState('Delegate');
  const [startDate, setStartDate] = useState('Jan 2025');
  const [endDate, setEndDate] = useState('Present');
  const [hoursPerWeek, setHoursPerWeek] = useState('2-3');
  const [weeksPerYear, setWeeksPerYear] = useState('30+');
  const [yearsInvolved, setYearsInvolved] = useState('1+');
  const [description, setDescription] = useState('Represented France in the UN General Assembly committee on renewable energy and climate mitigation. Authored draft resolution with 18 co-sponsors; awarded Honorable Mention for bilateral diplomacy and parliamentary procedures.');

  // Editable timeline dates
  const [timelineDates, setTimelineDates] = useState<Record<string, string>>({
    't1': '2025 - Present',
    't2': '2024',
    't3': '2023 - 2024',
  });

  const exportEcaResume = () => {
    let doc = `# EXTRACURRICULAR PROFILE & ACHIEVEMENTS\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
    doc += `## Activity: ${activityName} (${positionRole})\n`;
    doc += `Organization: ${organization} | Category: ${category}\n`;
    doc += `Timing: ${startDate} to ${endDate} | ${hoursPerWeek} hrs/week, ${weeksPerYear} weeks/year (${yearsInvolved})\n\n`;
    doc += `Description:\n${description}\n\n`;
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

      {/* Hero Banner with Stats (Matches image_f979b0d2.png) */}
      <div className="bg-[#3B302A] text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#29231E]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 max-w-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 text-[#D8C5AE]" />
            </div>
            <div>
              <p className="font-serif italic text-stone-200 text-sm sm:text-base leading-snug">
                &ldquo;Your achievements today build your opportunities tomorrow.&rdquo;
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
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">12</span>
                <span className="text-[11px] text-stone-300 font-sans">Total Activities</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Star className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">8</span>
                <span className="text-[11px] text-stone-300 font-sans">Achievements</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Clock className="w-5 h-5 text-[#D8C5AE]" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">4</span>
                <span className="text-[11px] text-stone-300 font-sans">Years of Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Grid (Matches image_f979b0d2.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Overview meters, Categories, Recent Activities */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Overview with 4 Circular Arc Meters */}
          <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  Overview
                </h3>
              </div>
              <button 
                onClick={() => alert('Full activity categories breakdown')}
                className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {/* Meter 1: Academic */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#EAE4DC" strokeWidth="3" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#3B302A" strokeWidth="3" strokeDasharray="88" strokeDashoffset="35" strokeLinecap="round" />
                  </svg>
                  <GraduationCap className="w-4 h-4 text-stone-800 absolute" />
                </div>
                <span className="text-base font-bold font-mono text-stone-900 mt-1">6</span>
                <span className="text-[9px] font-sans text-stone-500 leading-tight">Academic Activities</span>
              </div>

              {/* Meter 2: Leadership */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#EAE4DC" strokeWidth="3" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#3B302A" strokeWidth="3" strokeDasharray="88" strokeDashoffset="48" strokeLinecap="round" />
                  </svg>
                  <Users className="w-4 h-4 text-stone-800 absolute" />
                </div>
                <span className="text-base font-bold font-mono text-stone-900 mt-1">4</span>
                <span className="text-[9px] font-sans text-stone-500 leading-tight">Leadership Roles</span>
              </div>

              {/* Meter 3: Community */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#EAE4DC" strokeWidth="3" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#3B302A" strokeWidth="3" strokeDasharray="88" strokeDashoffset="40" strokeLinecap="round" />
                  </svg>
                  <Heart className="w-4 h-4 text-stone-800 absolute" />
                </div>
                <span className="text-base font-bold font-mono text-stone-900 mt-1">5</span>
                <span className="text-[9px] font-sans text-stone-500 leading-tight">Community Service</span>
              </div>

              {/* Meter 4: Other */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#EAE4DC" strokeWidth="3" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#3B302A" strokeWidth="3" strokeDasharray="88" strokeDashoffset="58" strokeLinecap="round" />
                  </svg>
                  <Sparkles className="w-4 h-4 text-stone-800 absolute" />
                </div>
                <span className="text-base font-bold font-mono text-stone-900 mt-1">3</span>
                <span className="text-[9px] font-sans text-stone-500 leading-tight">Other Activities</span>
              </div>
            </div>
          </div>

          {/* Card 2: Categories (10 items grid matching screenshot) */}
          <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  Categories
                </h3>
              </div>
              <button 
                onClick={() => alert('View all categories')}
                className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {/* 1. Academic Competitions */}
              <button 
                onClick={() => setCategory('Academic Competitions')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  category === 'Academic Competitions' ? 'bg-[#3B302A] text-white border-[#3B302A]' : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] border-[#E2DBD1] text-stone-800'
                }`}
              >
                <Trophy className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-sans leading-tight">Academic Competitions</span>
              </button>

              {/* 2. Research */}
              <button 
                onClick={() => setCategory('Research')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  category === 'Research' ? 'bg-[#3B302A] text-white border-[#3B302A]' : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] border-[#E2DBD1] text-stone-800'
                }`}
              >
                <FlaskConical className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-sans leading-tight">Research</span>
              </button>

              {/* 3. Volunteering */}
              <button 
                onClick={() => setCategory('Volunteering')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  category === 'Volunteering' ? 'bg-[#3B302A] text-white border-[#3B302A]' : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] border-[#E2DBD1] text-stone-800'
                }`}
              >
                <Heart className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-sans leading-tight">Volunteering</span>
              </button>

              {/* 4. Leadership */}
              <button 
                onClick={() => setCategory('Leadership')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  category === 'Leadership' ? 'bg-[#3B302A] text-white border-[#3B302A]' : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] border-[#E2DBD1] text-stone-800'
                }`}
              >
                <Crown className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-sans leading-tight">Leadership</span>
              </button>

              {/* 5. Sports */}
              <button 
                onClick={() => setCategory('Sports')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  category === 'Sports' ? 'bg-[#3B302A] text-white border-[#3B302A]' : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] border-[#E2DBD1] text-stone-800'
                }`}
              >
                <Activity className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-sans leading-tight">Sports</span>
              </button>

              {/* 6. Arts */}
              <button 
                onClick={() => setCategory('Arts')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  category === 'Arts' ? 'bg-[#3B302A] text-white border-[#3B302A]' : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] border-[#E2DBD1] text-stone-800'
                }`}
              >
                <Palette className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-sans leading-tight">Arts</span>
              </button>

              {/* 7. Internships */}
              <button 
                onClick={() => setCategory('Internships')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  category === 'Internships' ? 'bg-[#3B302A] text-white border-[#3B302A]' : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] border-[#E2DBD1] text-stone-800'
                }`}
              >
                <Briefcase className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-sans leading-tight">Internships</span>
              </button>

              {/* 8. Entrepreneurship */}
              <button 
                onClick={() => setCategory('Entrepreneurship')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  category === 'Entrepreneurship' ? 'bg-[#3B302A] text-white border-[#3B302A]' : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] border-[#E2DBD1] text-stone-800'
                }`}
              >
                <Rocket className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-sans leading-tight">Entrepreneurship</span>
              </button>

              {/* 9. Community Service */}
              <button 
                onClick={() => setCategory('Community Service')}
                className={`col-span-2 p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  category === 'Community Service' ? 'bg-[#3B302A] text-white border-[#3B302A]' : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] border-[#E2DBD1] text-stone-800'
                }`}
              >
                <Users className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-sans leading-tight">Community Service</span>
              </button>

              {/* 10. Other Activities */}
              <button 
                onClick={() => setCategory('Other Activities')}
                className={`col-span-2 p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  category === 'Other Activities' ? 'bg-[#3B302A] text-white border-[#3B302A]' : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] border-[#E2DBD1] text-stone-800'
                }`}
              >
                <Star className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-sans leading-tight">Other Activities</span>
              </button>
            </div>
          </div>

          {/* Card 3: Recent Activities */}
          <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  Recent Activities
                </h3>
              </div>
              <button 
                onClick={() => alert('View all logged activities')}
                className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-stone-300">
              {/* Item 1 */}
              <div className="relative">
                <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-stone-700 ring-2 ring-[#FAF8F5]" />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold font-serif text-stone-900">Model United Nations (MUN)</h4>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500">
                      <span>Leadership &bull;</span>
                      <EditableDate
                        value={timelineDates['t1']}
                        onChange={(val) => setTimelineDates(prev => ({ ...prev, 't1': val }))}
                        className="text-stone-700 font-semibold"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500">Updated: 2 days ago</span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="relative">
                <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-stone-700 ring-2 ring-[#FAF8F5]" />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold font-serif text-stone-900">Bangladesh Math Olympiad</h4>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500">
                      <span>Competition &bull;</span>
                      <EditableDate
                        value={timelineDates['t2']}
                        onChange={(val) => setTimelineDates(prev => ({ ...prev, 't2': val }))}
                        className="text-stone-700 font-semibold"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500">Updated: 1 week ago</span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="relative">
                <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-stone-700 ring-2 ring-[#FAF8F5]" />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold font-serif text-stone-900">Volunteer at Local NGO</h4>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500">
                      <span>Community Service &bull;</span>
                      <EditableDate
                        value={timelineDates['t3']}
                        onChange={(val) => setTimelineDates(prev => ({ ...prev, 't3': val }))}
                        className="text-stone-700 font-semibold"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500">Updated: 2 weeks ago</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (7 cols): Activity Details Form */}
        <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE4DC]">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#3B302A]" />
              <h2 className="text-base font-bold font-serif text-stone-900">
                Activity Details
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Activity details saved successfully!')}
                className="px-4 py-1.5 bg-[#3B302A] hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
              >
                Save
              </button>
              <button
                onClick={exportEcaResume}
                className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded-lg cursor-pointer"
                title="Export"
              >
                <Maximize2 className="w-4 h-4" />
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
                { id: 'evidence', label: 'Evidence' },
                { id: 'reflection', label: 'Personal Reflection' },
                { id: 'goals', label: 'Related Goals' },
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
              
              {/* Photos row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="h-32 rounded-xl bg-stone-200 border border-stone-300 overflow-hidden relative">
                  <img 
                    src="/assets/aistudio/image_c5b776f4.png" 
                    alt="Trophy" 
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                </div>
                <div 
                  onClick={() => alert('Upload image dialog')}
                  className="h-32 rounded-xl border border-dashed border-stone-300 hover:border-stone-500 bg-[#F4EFEA] flex flex-col items-center justify-center text-center p-3 cursor-pointer transition-colors"
                >
                  <UploadCloud className="w-6 h-6 text-stone-500 mb-1" />
                  <span className="text-xs font-serif font-bold text-stone-900 block">Upload Image</span>
                  <span className="text-[10px] font-mono text-stone-400">PNG, JPG up to 5MB</span>
                </div>
              </div>

              {/* Name & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif font-semibold text-stone-800 mb-1">
                    Activity Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E2DBD1] rounded-xl text-xs font-sans text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-semibold text-stone-800 mb-1">
                    Organization <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E2DBD1] rounded-xl text-xs font-sans text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category, Position, Start Date, End Date */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[11px] font-serif font-semibold text-stone-800 mb-1">
                    Category <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-[#E2DBD1] rounded-xl text-xs text-stone-800 cursor-pointer"
                  >
                    <option>Leadership</option>
                    <option>Academic Competitions</option>
                    <option>Research</option>
                    <option>Community Service</option>
                    <option>Sports</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-serif font-semibold text-stone-800 mb-1">
                    Position / Role <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={positionRole}
                    onChange={(e) => setPositionRole(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-[#E2DBD1] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-serif font-semibold text-stone-800 mb-1">
                    Start Date <span className="text-rose-600">*</span>
                  </label>
                  <div className="px-2 py-1.5 bg-white border border-[#E2DBD1] rounded-xl flex items-center justify-between text-xs">
                    <EditableDate value={startDate} onChange={setStartDate} className="text-stone-800 font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-serif font-semibold text-stone-800 mb-1">
                    End Date
                  </label>
                  <div className="px-2 py-1.5 bg-white border border-[#E2DBD1] rounded-xl flex items-center justify-between text-xs">
                    <EditableDate value={endDate} onChange={setEndDate} className="text-stone-800 font-mono" />
                  </div>
                </div>
              </div>

              {/* Hours / Weeks / Years */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-serif font-semibold text-stone-800 mb-1">
                    Hours per Week
                  </label>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#E2DBD1] rounded-xl text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="text"
                      value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-serif font-semibold text-stone-800 mb-1">
                    Weeks per Year
                  </label>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#E2DBD1] rounded-xl text-xs font-mono">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="text"
                      value={weeksPerYear}
                      onChange={(e) => setWeeksPerYear(e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-serif font-semibold text-stone-800 mb-1">
                    Years Involved
                  </label>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#E2DBD1] rounded-xl text-xs font-mono">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="text"
                      value={yearsInvolved}
                      onChange={(e) => setYearsInvolved(e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Description & Rich Toolbar */}
              <div>
                <label className="block text-xs font-serif font-semibold text-stone-800 mb-1">
                  Description <span className="text-rose-600">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-1 p-1.5 bg-[#F4EFEA] rounded-t-xl border border-[#E2DBD1] text-stone-700">
                  <button className="p-1 hover:bg-white rounded text-stone-800"><Bold className="w-3 h-3" /></button>
                  <button className="p-1 hover:bg-white rounded text-stone-800"><Italic className="w-3 h-3" /></button>
                  <button className="p-1 hover:bg-white rounded text-stone-800"><Underline className="w-3 h-3" /></button>
                  <button className="p-1 hover:bg-white rounded text-stone-800"><Strikethrough className="w-3 h-3" /></button>
                  <div className="h-3 w-[1px] bg-stone-300 mx-1" />
                  <button className="p-1 hover:bg-white rounded text-stone-800"><List className="w-3 h-3" /></button>
                  <button className="p-1 hover:bg-white rounded text-stone-800"><ListOrdered className="w-3 h-3" /></button>
                  <button className="p-1 hover:bg-white rounded text-stone-800"><Link className="w-3 h-3" /></button>
                  <button className="p-1 hover:bg-white rounded text-stone-800"><ImageIcon className="w-3 h-3" /></button>
                  <button className="p-1 hover:bg-white rounded text-stone-800"><Table className="w-3 h-3" /></button>
                  <button className="p-1 hover:bg-white rounded text-stone-800"><Quote className="w-3 h-3" /></button>
                  <button className="p-1 hover:bg-white rounded text-stone-800"><Undo2 className="w-3 h-3" /></button>
                  <button className="p-1 hover:bg-white rounded text-stone-800"><Redo2 className="w-3 h-3" /></button>
                </div>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write about your responsibilities, achievements, and impact..."
                  className="w-full px-3 py-2 bg-white border-x border-b border-[#E2DBD1] rounded-b-xl text-xs font-serif text-stone-800 leading-relaxed focus:outline-none"
                />
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
