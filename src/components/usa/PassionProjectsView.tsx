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
  ChevronRight, 
  Laptop, 
  Globe, 
  Brain, 
  Bookmark, 
  Edit2, 
  Download, 
  Sparkles, 
  FileText,
  Clock,
  BookOpen
} from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { EditableDate } from './EditableDate';

export const PassionProjectsView: React.FC = () => {
  const { 
    passionProjectIdeas, 
    activePassionProjects, 
    addPassionProjectIdea, 
    deletePassionProjectIdea,
    promoteIdeaToActiveProject,
    addActivePassionProject,
    updateActivePassionProject,
    deleteActivePassionProject,
    addProjectMilestone,
    toggleProjectMilestone,
    addStoryBankEntry,
    setActiveTab
  } = useUsaApp();

  const [selectedActiveProjectId, setSelectedActiveProjectId] = useState<string | null>(
    activePassionProjects.length > 0 ? activePassionProjects[0].id : null
  );
  const [detailTab, setDetailTab] = useState<'overview' | 'milestones' | 'devlog' | 'impact'>('overview');

  // Modal states
  const [newIdeaModalOpen, setNewIdeaModalOpen] = useState(false);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [newMilestoneText, setNewMilestoneText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Idea form
  const [ideaForm, setIdeaForm] = useState({
    projectTitle: '',
    ideaDescription: '',
    problemBeingAddressed: '',
    whyIPursueIt: '',
    targetAudience: '',
    possibleImpact: '',
    requiredResources: '',
    skillsRequired: '',
    researchNotes: '',
    challengesAnticipated: '',
    expectedOutcomes: '',
    personalNotes: ''
  });

  // New Project form
  const [projectForm, setProjectForm] = useState({
    projectTitle: '',
    status: 'Active Development' as const,
    overview: '',
    research: '',
    planning: '',
    objectives: '',
    weeklyProgressNotes: '',
    challengesAndSolutions: '',
    results: '',
    impact: '',
    finalReflection: ''
  });

  const activeProject = activePassionProjects.find(p => p.id === selectedActiveProjectId) || activePassionProjects[0] || null;

  const totalIdeasCount = passionProjectIdeas.length;
  const inProgressCount = activePassionProjects.filter(p => p.status !== 'Completed').length;
  const completedCount = activePassionProjects.filter(p => p.status === 'Completed').length;

  const handleCreateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaForm.projectTitle.trim()) return;

    addPassionProjectIdea({
      ...ideaForm,
      projectTitle: ideaForm.projectTitle.trim(),
      ideaDescription: ideaForm.ideaDescription.trim()
    });

    setIdeaForm({
      projectTitle: '',
      ideaDescription: '',
      problemBeingAddressed: '',
      whyIPursueIt: '',
      targetAudience: '',
      possibleImpact: '',
      requiredResources: '',
      skillsRequired: '',
      researchNotes: '',
      challengesAnticipated: '',
      expectedOutcomes: '',
      personalNotes: ''
    });
    setNewIdeaModalOpen(false);
    showToast('Project idea added to bank.');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.projectTitle.trim()) return;

    const newId = addActivePassionProject({
      ...projectForm,
      projectTitle: projectForm.projectTitle.trim(),
      overview: projectForm.overview.trim(),
      milestones: [
        { id: `m-${Date.now()}-1`, title: 'Define project scope & goals', completed: true },
        { id: `m-${Date.now()}-2`, title: 'Build working prototype / initial study', completed: false },
        { id: `m-${Date.now()}-3`, title: 'Publish results / community launch', completed: false }
      ],
      tasks: [],
      devLog: [
        { id: `log-${Date.now()}`, date: new Date().toLocaleDateString(), title: 'Project kicked off', summary: 'Outlined roadmap and initial milestones.' }
      ],
      evidenceAndDocLinks: []
    });

    setSelectedActiveProjectId(newId);
    setProjectForm({
      projectTitle: '',
      status: 'Active Development',
      overview: '',
      research: '',
      planning: '',
      objectives: '',
      weeklyProgressNotes: '',
      challengesAndSolutions: '',
      results: '',
      impact: '',
      finalReflection: ''
    });
    setNewProjectModalOpen(false);
    showToast('New active project started.');
  };

  const handlePromoteIdea = (ideaId: string) => {
    const newProjId = promoteIdeaToActiveProject(ideaId);
    setSelectedActiveProjectId(newProjId);
    showToast('Idea promoted to Active Projects!');
  };

  const handleSendProjectToStoryBank = (proj: typeof activeProject) => {
    if (!proj) return;
    addStoryBankEntry({
      storyTitle: `Passion Project: ${proj.projectTitle}`,
      experience: proj.overview || `Led independent initiative "${proj.projectTitle}".`,
      personalSignificance: proj.impact || 'Demonstrated self-directed inquiry and initiative outside school curriculum.',
      challenge: proj.challengesAndSolutions || 'Troubleshooting technical/logistical blockers independently.',
      learning: 'Independent research rigor, iterative problem solving, and intellectual vitality.',
      personalGrowth: proj.finalReflection || 'Discovered confidence in building solutions from scratch.',
      possibleEssayConnection: 'Common App Academic Passion or Problem Solved Essay',
      relatedProject: proj.projectTitle
    });
    showToast(`Added "${proj.projectTitle}" to Essay Story Bank!`);
  };

  const handleAddMilestone = () => {
    if (!activeProject || !newMilestoneText.trim()) return;
    addProjectMilestone(activeProject.id, {
      title: newMilestoneText.trim(),
      completed: false
    });
    setNewMilestoneText('');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const exportProjectsReport = () => {
    let doc = `# PASSION PROJECTS & INDEPENDENT INITIATIVES\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
    activePassionProjects.forEach((proj, idx) => {
      doc += `## ${idx + 1}. ${proj.projectTitle} [${proj.status}]\n`;
      doc += `Overview:\n${proj.overview || 'In progress'}\n\n`;
      if (proj.milestones.length > 0) {
        doc += `Milestones:\n`;
        proj.milestones.forEach(m => {
          doc += `- [${m.completed ? 'x' : ' '}] ${m.title}\n`;
        });
        doc += `\n`;
      }
      if (proj.impact) doc += `Impact: ${proj.impact}\n\n`;
      doc += `---\n\n`;
    });
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
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#3B302A] text-white px-4 py-2.5 rounded-xl text-xs font-mono shadow-xl border border-stone-700 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
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
          <span className="text-stone-700 font-medium">Passion Projects</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif tracking-tight">
          Passion Projects
        </h1>
        <p className="text-sm text-stone-600 font-serif italic mt-0.5">
          Turn ideas into impact. Build what you love.
        </p>
      </div>

      {/* Hero Banner with Dynamic Stats */}
      <div className="bg-[#3B302A] text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#29231E]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 max-w-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Lightbulb className="w-6 h-6 text-[#D8C5AE]" />
            </div>
            <div>
              <p className="font-serif italic text-stone-200 text-sm sm:text-base leading-snug">
                &ldquo;Independent initiatives prove curiosity and execution beyond classroom boundaries.&rdquo;
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
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">
                  {totalIdeasCount}
                </span>
                <span className="text-[11px] text-stone-300 font-sans">Project Ideas</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Rocket className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">
                  {inProgressCount}
                </span>
                <span className="text-[11px] text-stone-300 font-sans">Active In-Progress</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">
                  {completedCount}
                </span>
                <span className="text-[11px] text-stone-300 font-sans">Completed</span>
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
                Idea Bank ({passionProjectIdeas.length})
              </h3>
            </div>
            <button 
              onClick={() => setNewIdeaModalOpen(true)}
              className="text-xs font-mono text-stone-800 hover:text-black font-semibold inline-flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded border border-[#E2DBD1]"
            >
              <Plus className="w-3 h-3" />
              <span>New Idea</span>
            </button>
          </div>

          <button
            onClick={() => setNewIdeaModalOpen(true)}
            className="w-full py-2 bg-[#3B302A] hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add New Idea</span>
          </button>

          {passionProjectIdeas.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-xs text-stone-500 font-sans">
                No project ideas in your bank yet. Brainstorm potential apps, research papers, community initiatives, or podcasts.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {passionProjectIdeas.map(idea => (
                <div 
                  key={idea.id}
                  className="p-3.5 bg-white border border-[#E2DBD1] rounded-xl flex flex-col justify-between space-y-2 relative shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold font-serif text-stone-900 line-clamp-1">
                        {idea.projectTitle}
                      </h4>
                      <button
                        onClick={() => {
                          if (confirm(`Delete idea "${idea.projectTitle}"?`)) {
                            deletePassionProjectIdea(idea.id);
                          }
                        }}
                        className="text-stone-300 hover:text-rose-600 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    {idea.ideaDescription && (
                      <p className="text-[11px] text-stone-600 font-sans line-clamp-2">
                        {idea.ideaDescription}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => handlePromoteIdea(idea.id)}
                      className="text-[10px] font-mono text-[#3B302A] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Promote to Project</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => {
                        addStoryBankEntry({
                          storyTitle: `Idea: ${idea.projectTitle}`,
                          experience: idea.ideaDescription,
                          personalSignificance: idea.whyIPursueIt || 'Origin of an intellectual curiosity.',
                          challenge: idea.challengesAnticipated || '',
                          learning: 'Formulating hypotheses and project roadmaps.',
                          personalGrowth: '',
                          possibleEssayConnection: 'Essay Brainstorming Hook',
                          relatedProject: idea.projectTitle
                        });
                        showToast(`Saved idea to Story Bank!`);
                      }}
                      className="text-[10px] font-mono text-amber-800 hover:text-amber-950 font-semibold"
                    >
                      + Story Bank
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Projects List (6 cols) */}
        <div className="lg:col-span-6 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-[#3B302A]" />
              <h3 className="text-sm font-bold font-serif text-stone-900">
                Active Projects ({activePassionProjects.length})
              </h3>
            </div>
            <button 
              onClick={() => setNewProjectModalOpen(true)}
              className="text-xs font-mono text-stone-800 hover:text-black font-semibold inline-flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded border border-[#E2DBD1]"
            >
              <Plus className="w-3 h-3" />
              <span>Start Project</span>
            </button>
          </div>

          {activePassionProjects.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E2DBD1] flex items-center justify-center mx-auto text-stone-400">
                <Rocket className="w-6 h-6" />
              </div>
              <p className="text-xs text-stone-500 font-sans max-w-sm mx-auto">
                No active projects started yet. You can promote an idea from the Idea Bank or launch a fresh project now.
              </p>
              <button
                onClick={() => setNewProjectModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-medium"
              >
                + Launch First Project
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {activePassionProjects.map(proj => {
                const isSelected = activeProject?.id === proj.id;
                const completedMilestones = proj.milestones.filter(m => m.completed).length;
                const totalMilestones = proj.milestones.length;
                const pct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
                return (
                  <div 
                    key={proj.id}
                    onClick={() => setSelectedActiveProjectId(proj.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-white border-[#3B302A] shadow-xs ring-1 ring-[#3B302A]'
                        : 'bg-white/70 hover:bg-white border-[#EAE4DC]'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold font-serif text-stone-900 truncate">
                          {proj.projectTitle}
                        </h4>
                        <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                          proj.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 font-sans line-clamp-1 mt-0.5">
                        {proj.overview || 'In active planning/development phase'}
                      </p>
                      <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div className="bg-[#3B302A] h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono font-bold text-stone-800">{pct}%</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete project "${proj.projectTitle}"?`)) {
                            deleteActivePassionProject(proj.id);
                            if (selectedActiveProjectId === proj.id) setSelectedActiveProjectId(null);
                          }
                        }}
                        className="text-stone-300 hover:text-rose-600 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Bottom Row: Project Details & Milestones (when a project exists) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Project Details Panel (6 cols) */}
        <div className="lg:col-span-6 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-4">
          {activeProject ? (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
                <div className="flex items-center gap-2 min-w-0">
                  <Laptop className="w-4 h-4 text-[#3B302A] shrink-0" />
                  <h3 className="text-sm font-bold font-serif text-stone-900 truncate">
                    {activeProject.projectTitle}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={activeProject.status}
                    onChange={(e) => updateActivePassionProject(activeProject.id, { status: e.target.value as any })}
                    className="px-2 py-1 bg-white border border-[#E2DBD1] rounded-lg text-xs font-mono text-stone-800 cursor-pointer"
                  >
                    <option value="In Planning">In Planning</option>
                    <option value="Active Development">Active Development</option>
                    <option value="Testing / Pilot">Testing / Pilot</option>
                    <option value="Completed">Completed</option>
                    <option value="Paused">Paused</option>
                  </select>

                  <button
                    onClick={() => handleSendProjectToStoryBank(activeProject)}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-mono font-medium flex items-center gap-1 cursor-pointer"
                    title="Convert this project's lessons into an Essay Story"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Story Bank</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">Project Overview</label>
                <textarea
                  rows={3}
                  value={activeProject.overview}
                  onChange={(e) => updateActivePassionProject(activeProject.id, { overview: e.target.value })}
                  placeholder="Describe what you are building and why it matters..."
                  className="w-full p-2.5 bg-white border border-[#E2DBD1] rounded-xl text-xs font-serif text-stone-800 leading-relaxed focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">Impact &amp; Results</label>
                <textarea
                  rows={2}
                  value={activeProject.impact}
                  onChange={(e) => updateActivePassionProject(activeProject.id, { impact: e.target.value })}
                  placeholder="Community users, github stars, publications, or measurable changes..."
                  className="w-full p-2.5 bg-white border border-[#E2DBD1] rounded-xl text-xs font-serif text-stone-800 leading-relaxed focus:outline-none"
                />
              </div>
            </>
          ) : (
            <div className="py-16 text-center space-y-2">
              <p className="text-xs text-stone-500 font-sans">
                Select or start a passion project above to view its dossier.
              </p>
            </div>
          )}
        </div>

        {/* Milestones & Progress (6 cols) */}
        <div className="lg:col-span-6 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#3B302A]" />
              <h3 className="text-sm font-bold font-serif text-stone-900">
                Milestones &amp; Next Steps
              </h3>
            </div>
            {activeProject && (
              <span className="text-xs font-mono text-stone-500">
                {activeProject.milestones.filter(m => m.completed).length} / {activeProject.milestones.length} done
              </span>
            )}
          </div>

          {activeProject ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMilestoneText}
                  onChange={(e) => setNewMilestoneText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddMilestone(); }}
                  placeholder="Add next project milestone..."
                  className="flex-1 px-3 py-1.5 bg-white border border-[#E2DBD1] rounded-xl text-xs font-sans"
                />
                <button
                  onClick={handleAddMilestone}
                  className="px-3 py-1.5 bg-[#3B302A] text-white rounded-xl text-xs font-mono cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2 pt-1 max-h-56 overflow-y-auto">
                {activeProject.milestones.map(m => (
                  <div
                    key={m.id}
                    onClick={() => toggleProjectMilestone(activeProject.id, m.id)}
                    className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200 cursor-pointer hover:bg-stone-50"
                  >
                    <div className="flex items-center gap-2.5">
                      {m.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-400 shrink-0" />
                      )}
                      <span className={`text-xs ${m.completed ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                        {m.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-stone-500 font-sans">
              No active project selected.
            </div>
          )}
        </div>

      </div>

      {/* NEW IDEA MODAL */}
      {newIdeaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-bold font-serif text-stone-900">
              Add Project Idea
            </h3>
            <form onSubmit={handleCreateIdea} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">
                  Idea Title *
                </label>
                <input
                  type="text"
                  required
                  value={ideaForm.projectTitle}
                  onChange={(e) => setIdeaForm({ ...ideaForm, projectTitle: e.target.value })}
                  placeholder="e.g. Banglish NLP Spell Checker, Solar Cooker for Rural Areas"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">
                  Idea Summary
                </label>
                <textarea
                  rows={3}
                  value={ideaForm.ideaDescription}
                  onChange={(e) => setIdeaForm({ ...ideaForm, ideaDescription: e.target.value })}
                  placeholder="Briefly explain the problem, proposed solution, and intended audience..."
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setNewIdeaModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-medium"
                >
                  Save Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW PROJECT MODAL */}
      {newProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-bold font-serif text-stone-900">
              Start Active Passion Project
            </h3>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.projectTitle}
                  onChange={(e) => setProjectForm({ ...projectForm, projectTitle: e.target.value })}
                  placeholder="e.g. Bangladesh Climate Impact App"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">
                  Initial Overview
                </label>
                <textarea
                  rows={3}
                  value={projectForm.overview}
                  onChange={(e) => setProjectForm({ ...projectForm, overview: e.target.value })}
                  placeholder="What is the goal of this initiative and what do you hope to build?"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setNewProjectModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-medium"
                >
                  Launch Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
