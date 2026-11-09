import React, { useState } from 'react';
import { 
  Lightbulb, 
  Rocket, 
  Plus, 
  Trash2, 
  Check, 
  Calendar, 
  ArrowRight, 
  CheckSquare, 
  Square, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  Laptop,
  Globe,
  Brain,
  Bookmark,
  Edit2,
  FolderArchive,
  MoreHorizontal,
  Download,
  Sparkles,
  FileText
} from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { EditableDate } from './EditableDate';

export const PassionProjectsView: React.FC = () => {
  const { 
    passionProjectIdeas, 
    activePassionProjects, 
    addPassionProjectIdea, 
    promoteIdeaToActiveProject,
    setActiveTab
  } = useUsaApp();

  const [selectedActiveProjectId, setSelectedActiveProjectId] = useState<string>('proj-1');
  const [detailTab, setDetailTab] = useState<'overview' | 'research' | 'tasks' | 'devlog' | 'results' | 'notes'>('overview');

  // Dates state for editable dates
  const [startDate, setStartDate] = useState('Nov 1, 2025');
  const [targetDate, setTargetDate] = useState('Dec 31, 2025');
  const [recentUpdateDate, setRecentUpdateDate] = useState('Nov 3, 2025 • 2:15 PM');

  // Goals checklist state
  const [goals, setGoals] = useState([
    { id: 'g1', text: 'Develop a working prototype', checked: true },
    { id: 'g2', text: 'Test with real study data', checked: true },
    { id: 'g3', text: 'Document the process', checked: true },
  ]);

  const toggleGoal = (id: string) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, checked: !g.checked } : g));
  };

  const exportProjectsReport = () => {
    let doc = `# PASSION PROJECTS & INDEPENDENT INITIATIVES\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
    doc += `## Project: AI Study Assistant\n`;
    doc += `Timeline: Started ${startDate} | Target ${targetDate} | Progress: 70%\n`;
    doc += `Overview: A personal project to build an AI-powered study assistant with features like personalized study plans, progress tracking, and smart recommendations.\n\n`;
    const blob = new Blob([doc], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Passion_Projects_${new Date().toISOString().slice(0, 10)}.md`;
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
          <span className="text-stone-700 font-medium">Passion Projects</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif tracking-tight">
          Passion Projects
        </h1>
        <p className="text-sm text-stone-600 font-serif italic mt-0.5">
          Turn ideas into impact. Build what you love.
        </p>
      </div>

      {/* Hero Banner with Stats (Matches image_dbcb27a3.png) */}
      <div className="bg-[#3B302A] text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#29231E]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 max-w-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Lightbulb className="w-6 h-6 text-[#D8C5AE]" />
            </div>
            <div>
              <p className="font-serif italic text-stone-200 text-sm sm:text-base leading-snug">
                &ldquo;Big ideas start with a single thought.&rdquo;
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
                <Brain className="w-5 h-5 text-[#D8C5AE]" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">24</span>
                <span className="text-[11px] text-stone-300 font-sans">Total Ideas</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Rocket className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">6</span>
                <span className="text-[11px] text-stone-300 font-sans">Active Projects</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">3</span>
                <span className="text-[11px] text-stone-300 font-sans">Completed Projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Split Row: Idea Bank (Left) + Active Projects (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Idea Bank (6 cols) */}
        <div className="lg:col-span-6 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#3B302A]" />
              <h3 className="text-sm font-bold font-serif text-stone-900">
                Idea Bank
              </h3>
            </div>
            <button 
              onClick={() => alert('Viewing all 24 project ideas')}
              className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => alert('Log new project idea dialog')}
            className="w-full py-2 bg-[#3B302A] hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Idea</span>
          </button>

          {/* 3 Idea Cards in a Row */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            {/* Idea 1 */}
            <div className="p-3 bg-[#F4EFEA] border border-[#E2DBD1] rounded-xl flex flex-col justify-between space-y-2 relative">
              <div className="flex items-start justify-between">
                <Laptop className="w-4 h-4 text-sky-800" />
                <Bookmark className="w-3.5 h-3.5 text-stone-400 cursor-pointer" />
              </div>
              <h4 className="text-xs font-bold font-serif text-stone-900 line-clamp-2">
                Build an AI tool for students
              </h4>
              <span className="text-[10px] font-mono text-sky-900 bg-sky-100 px-2 py-0.5 rounded-full inline-block self-start font-medium">
                Tech
              </span>
            </div>

            {/* Idea 2 */}
            <div className="p-3 bg-[#F4EFEA] border border-[#E2DBD1] rounded-xl flex flex-col justify-between space-y-2 relative">
              <div className="flex items-start justify-between">
                <Globe className="w-4 h-4 text-emerald-800" />
                <Bookmark className="w-3.5 h-3.5 text-stone-400 cursor-pointer" />
              </div>
              <h4 className="text-xs font-bold font-serif text-stone-900 line-clamp-2">
                Climate Action Awareness App
              </h4>
              <span className="text-[10px] font-mono text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full inline-block self-start font-medium">
                Social Impact
              </span>
            </div>

            {/* Idea 3 */}
            <div className="p-3 bg-[#F4EFEA] border border-[#E2DBD1] rounded-xl flex flex-col justify-between space-y-2 relative">
              <div className="flex items-start justify-between">
                <Brain className="w-4 h-4 text-amber-800" />
                <Bookmark className="w-3.5 h-3.5 text-stone-400 cursor-pointer" />
              </div>
              <h4 className="text-xs font-bold font-serif text-stone-900 line-clamp-2">
                Personal Knowledge Management App
              </h4>
              <span className="text-[10px] font-mono text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full inline-block self-start font-medium">
                Productivity
              </span>
            </div>
          </div>
        </div>

        {/* Active Projects List (6 cols) */}
        <div className="lg:col-span-6 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-[#3B302A]" />
              <h3 className="text-sm font-bold font-serif text-stone-900">
                Active Projects
              </h3>
            </div>
            <button 
              onClick={() => alert('View all 6 active projects')}
              className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Project 1: AI Study Assistant */}
            <div 
              onClick={() => setSelectedActiveProjectId('proj-1')}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                selectedActiveProjectId === 'proj-1'
                  ? 'bg-white border-[#3B302A] shadow-xs ring-1 ring-[#3B302A]'
                  : 'bg-white/70 hover:bg-white border-[#EAE4DC]'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-14 h-11 rounded-lg bg-stone-300 overflow-hidden shrink-0">
                  <img 
                    src="/assets/aistudio/image_c5b776f4.png" 
                    alt="Laptop" 
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold font-serif text-stone-900 line-clamp-1">AI Study Assistant</h4>
                  <p className="text-[10px] text-stone-500 font-sans line-clamp-1">Building a smart study companion</p>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-[#3B302A] h-full rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-bold text-stone-800">70%</span>
                <span className="text-[10px] font-mono font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  In Progress
                </span>
                <button className="text-stone-400 hover:text-stone-700">:</button>
              </div>
            </div>

            {/* Project 2: Green Future Initiative */}
            <div 
              onClick={() => setSelectedActiveProjectId('proj-2')}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                selectedActiveProjectId === 'proj-2'
                  ? 'bg-white border-[#3B302A] shadow-xs ring-1 ring-[#3B302A]'
                  : 'bg-white/70 hover:bg-white border-[#EAE4DC]'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-14 h-11 rounded-lg bg-stone-300 overflow-hidden shrink-0">
                  <img 
                    src="/assets/aistudio/image_73eb3f74.png" 
                    alt="Green globe" 
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold font-serif text-stone-900 line-clamp-1">Green Future Initiative</h4>
                  <p className="text-[10px] text-stone-500 font-sans line-clamp-1">Promoting environmental awareness</p>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-[#3B302A] h-full rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-bold text-stone-800">45%</span>
                <span className="text-[10px] font-mono font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  In Progress
                </span>
                <button className="text-stone-400 hover:text-stone-700">:</button>
              </div>
            </div>

            {/* Project 3: Data Analytics Project */}
            <div 
              onClick={() => setSelectedActiveProjectId('proj-3')}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                selectedActiveProjectId === 'proj-3'
                  ? 'bg-white border-[#3B302A] shadow-xs ring-1 ring-[#3B302A]'
                  : 'bg-white/70 hover:bg-white border-[#EAE4DC]'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-14 h-11 rounded-lg bg-stone-300 overflow-hidden shrink-0">
                  <img 
                    src="/assets/aistudio/image_1bccb426.png" 
                    alt="Analytics" 
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold font-serif text-stone-900 line-clamp-1">Data Analytics Project</h4>
                  <p className="text-[10px] text-stone-500 font-sans line-clamp-1">Analyzing academic performance</p>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-[#3B302A] h-full rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-bold text-stone-800">20%</span>
                <span className="text-[10px] font-mono font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  In Progress
                </span>
                <button className="text-stone-400 hover:text-stone-700">:</button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row: Project Details (Left) + Detail Tabs (Center) + Quick Actions & Quote (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Project Details Panel (4.5 cols) */}
        <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#3B302A]" />
              <h3 className="text-sm font-bold font-serif text-stone-900">
                Project Details
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-stone-600">
              <button className="hover:text-stone-900 flex items-center gap-1"><Edit2 className="w-3 h-3" /> Edit</button>
              <span>&bull;</span>
              <button className="hover:text-stone-900">Move to Active</button>
              <span>&bull;</span>
              <button className="hover:text-stone-900">Archive</button>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-xl bg-stone-300 overflow-hidden shrink-0">
              <img 
                src="/assets/aistudio/image_c5b776f4.png" 
                alt="Lightbulb on books" 
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-base font-bold font-serif text-stone-900">AI Study Assistant</h4>
                <Edit2 className="w-3.5 h-3.5 text-stone-400 cursor-pointer" />
              </div>
              <p className="text-xs text-stone-600 font-sans leading-relaxed">
                Building a smart study companion to help students plan, track and improve their studies efficiently.
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] font-mono bg-sky-100 text-sky-900 px-2 py-0.5 rounded-full font-medium">Tech</span>
                <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-medium">Productivity</span>
                <span className="text-[10px] font-mono bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full font-medium">AI</span>
              </div>
            </div>
          </div>

          {/* Dates & Status Grid */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-[#EAE4DC] text-xs font-mono">
            <div>
              <span className="text-stone-500 text-[10px] block">Started:</span>
              <EditableDate value={startDate} onChange={setStartDate} className="text-stone-800 font-bold" />
            </div>
            <div>
              <span className="text-stone-500 text-[10px] block">Current Progress:</span>
              <span className="text-stone-900 font-bold">70%</span>
            </div>
            <div>
              <span className="text-stone-500 text-[10px] block">Target:</span>
              <EditableDate value={targetDate} onChange={setTargetDate} className="text-stone-800 font-bold" />
            </div>
            <div>
              <span className="text-stone-500 text-[10px] block">Milestones:</span>
              <span className="text-stone-900 font-bold">3 / 5</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-stone-500 text-[10px]">Status:</span>
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                In Progress
              </span>
            </div>
          </div>

          {/* Project Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-stone-600">Overall Project Completion</span>
              <strong className="text-stone-900 text-sm">70%</strong>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div className="bg-[#3B302A] h-full rounded-full" style={{ width: '70%' }} />
            </div>
          </div>
        </div>

        {/* Center / Right: Tabbed Details & Updates (4 cols) */}
        <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-[#EAE4DC] pb-2 overflow-x-auto text-xs font-mono">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'research', label: 'Research' },
                { id: 'tasks', label: 'Tasks' },
                { id: 'devlog', label: 'Development Log' },
                { id: 'results', label: 'Results' },
                { id: 'notes', label: 'Notes' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setDetailTab(t.id as any)}
                  className={`pb-1 cursor-pointer transition-colors whitespace-nowrap ${
                    detailTab === t.id
                      ? 'border-b-2 border-[#3B302A] font-bold text-stone-900'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Overview Content */}
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold font-serif text-stone-900 mb-1">
                  Project Overview
                </h4>
                <p className="text-xs text-stone-700 font-sans leading-relaxed">
                  A personal project to build an AI-powered study assistant with features like personalized study plans, progress tracking, and smart recommendations.
                </p>
              </div>

              {/* Goals */}
              <div className="space-y-1.5 pt-1">
                <h5 className="text-[11px] font-mono uppercase text-stone-600 font-bold">Goals</h5>
                {goals.map(g => (
                  <div 
                    key={g.id}
                    onClick={() => toggleGoal(g.id)}
                    className="flex items-center gap-2 text-xs text-stone-700 font-sans cursor-pointer hover:text-stone-900"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{g.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="pt-3 border-t border-[#EAE4DC]">
            <div className="flex items-center justify-between pb-1.5">
              <span className="text-xs font-bold font-serif text-stone-900">Recent Updates</span>
              <button className="text-[11px] font-mono text-stone-500 hover:text-stone-900">View All &rarr;</button>
            </div>
            <div className="relative pl-3 before:content-[''] before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:bg-stone-400 rounded-full">
              <h5 className="text-xs font-semibold text-stone-900">Added new feature: study planner</h5>
              <div className="mt-0.5">
                <EditableDate
                  value={recentUpdateDate}
                  onChange={setRecentUpdateDate}
                  className="text-[10px] font-mono text-stone-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (3 cols): Quick Actions + Quote */}
        <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
          
          {/* Quick Actions */}
          <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 pb-2 border-b border-[#EAE4DC]">
              <Sparkles className="w-4 h-4 text-[#3B302A]" />
              <h3 className="text-sm font-bold font-serif text-stone-900">
                Quick Actions
              </h3>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => alert('Add new project dialog')}
                className="w-full py-2 px-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-800 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-[#E2DBD1]"
              >
                <Plus className="w-3.5 h-3.5 text-stone-600" />
                <span>Add New Project</span>
              </button>

              <button
                onClick={() => alert('Add project idea')}
                className="w-full py-2 px-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-800 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-[#E2DBD1]"
              >
                <Lightbulb className="w-3.5 h-3.5 text-stone-600" />
                <span>Add Idea</span>
              </button>

              <button
                onClick={() => alert('Project Templates: Open Source Tool, Scientific Research Study, Social Initiative')}
                className="w-full py-2 px-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-800 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-[#E2DBD1]"
              >
                <FileText className="w-3.5 h-3.5 text-stone-600" />
                <span>View Templates</span>
              </button>

              <button
                onClick={exportProjectsReport}
                className="w-full py-2 px-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-800 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-[#E2DBD1]"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                <span>Export Projects</span>
              </button>
            </div>
          </div>

          {/* Library Quote Card */}
          <div className="bg-[#3B302A] text-white rounded-2xl p-5 shadow-xs border border-[#29231E] relative overflow-hidden flex flex-col justify-end min-h-[140px]">
            <div className="relative z-10 space-y-2">
              <span className="text-2xl font-serif text-[#D8C5AE] leading-none block">&ldquo;</span>
              <p className="font-serif italic text-stone-200 text-sm leading-snug">
                Dream it. Plan it. Build it.
              </p>
              <span className="text-[10px] font-mono tracking-widest text-[#D8C5AE] uppercase block">
                &mdash; COMEBACK
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
