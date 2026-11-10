import React, { useState } from 'react';
import { 
  FileText, 
  BookOpen, 
  Sparkles, 
  Plus, 
  Trash2, 
  History, 
  Columns, 
  ChevronRight, 
  ExternalLink, 
  Calendar, 
  Check, 
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  Maximize2,
  MoreHorizontal,
  Bookmark,
  Share2,
  Download,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  List,
  ListOrdered,
  Link,
  Image as ImageIcon,
  Table,
  Quote,
  Undo2,
  Redo2,
  Search,
  CheckSquare,
  Square,
  Star,
  Building
} from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { 
  MainEssay, 
  EssayWritingStatus, 
  StoryBankEntry, 
  SupplementalQuestion,
  EssayDraftVersion
} from '../../types/usaApp';
import { COMMON_APP_PROMPTS } from '../../data/initialUsaData';
import { EditableDate } from './EditableDate';

type EssaySubTab = 'main' | 'supplemental' | 'storybank';

export const EssaysView: React.FC = () => {
  const { 
    mainEssays, 
    activeMainEssayId, 
    setActiveMainEssayId, 
    createMainEssay, 
    updateMainEssay, 
    deleteMainEssay, 
    saveNewMainEssayDraft, 
    restoreMainEssayDraft,
    storyBank,
    addStoryBankEntry,
    updateStoryBankEntry,
    deleteStoryBankEntry,
    universities,
    getSupplementalNotebook,
    updateSupplementalNotes,
    addSupplementalQuestion,
    updateSupplementalQuestion,
    deleteSupplementalQuestion,
    saveSupplementalQuestionDraft,
    restoreSupplementalQuestionDraft,
    setSelectedUniversityId,
    setActiveTab,
    setActiveSubSection,
    ecaActivities,
    activePassionProjects
  } = useUsaApp();

  const [activeSubTab, setActiveSubTab] = useState<EssaySubTab>('main');

  // Modals
  const [newEssayModal, setNewEssayModal] = useState(false);
  const [newEssayTitle, setNewEssayTitle] = useState('');
  const [selectedPromptId, setSelectedPromptId] = useState('ca-1');
  const [customPromptText, setCustomPromptText] = useState('');

  const [compareDraftsModal, setCompareDraftsModal] = useState(false);
  const [newStoryModal, setNewStoryModal] = useState(false);
  const [editingStory, setEditingStory] = useState<StoryBankEntry | null>(null);

  // Active University for Supplemental Notebook view
  const [activeSuppUnivId, setActiveSuppUnivId] = useState<string | null>(null);
  const [newSuppQuestionModal, setNewSuppQuestionModal] = useState(false);
  const [suppQuestionForm, setSuppQuestionForm] = useState({
    questionText: '',
    wordLimit: 250,
    currentAnswer: '',
    currentDraftStage: 'First Draft' as const
  });

  // Story Form State with correlation from ECAs/Projects
  const [storyForm, setStoryForm] = useState({
    storyTitle: '',
    experience: '',
    personalSignificance: '',
    challenge: '',
    learning: '',
    personalGrowth: '',
    possibleEssayConnection: '',
    relatedEca: ''
  });

  // Active Main Essay
  const activeMainEssay = mainEssays.find(e => e.id === activeMainEssayId) || mainEssays[0];

  // Checklist items state for interactive essay rubric
  const [checklist, setChecklist] = useState<{ id: string; label: string; checked: boolean }[]>([
    { id: 'c1', label: 'Show personal struggle or challenge', checked: false },
    { id: 'c2', label: 'Highlight genuine growth and learning', checked: false },
    { id: 'c3', label: 'Connect to future goals and core values', checked: false }
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleCreateMainEssay = (e: React.FormEvent) => {
    e.preventDefault();
    const promptObj = COMMON_APP_PROMPTS.find(p => p.id === selectedPromptId);
    const promptChoice = promptObj ? promptObj.label : 'Custom Prompt';
    createMainEssay(newEssayTitle, promptChoice, selectedPromptId === 'custom' ? customPromptText : promptObj?.prompt);
    setNewEssayTitle('');
    setCustomPromptText('');
    setNewEssayModal(false);
  };

  const handleQuickCreateFromPrompt = (promptId: string) => {
    const promptObj = COMMON_APP_PROMPTS.find(p => p.id === promptId);
    if (!promptObj) return;
    createMainEssay(promptObj.label, promptObj.label, promptObj.prompt);
  };

  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyForm.storyTitle.trim()) return;
    if (editingStory) {
      updateStoryBankEntry(editingStory.id, storyForm);
    } else {
      addStoryBankEntry(storyForm);
    }
    setNewStoryModal(false);
    setEditingStory(null);
    setStoryForm({
      storyTitle: '',
      experience: '',
      personalSignificance: '',
      challenge: '',
      learning: '',
      personalGrowth: '',
      possibleEssayConnection: '',
      relatedEca: ''
    });
  };

  const handleImportEcaToStory = (ecaId: string) => {
    const eca = ecaActivities.find(a => a.id === ecaId);
    if (!eca) return;
    setStoryForm({
      storyTitle: `${eca.activityName} Leadership Experience`,
      experience: eca.responsibilities || eca.positionOrRole,
      personalSignificance: eca.communityImpact || 'Significant commitment to community leadership.',
      challenge: eca.personalReflections || '',
      learning: eca.skillsDeveloped || '',
      personalGrowth: eca.personalGrowth || '',
      possibleEssayConnection: `Extracurricular leadership & impact in ${eca.category}`,
      relatedEca: eca.activityName
    });
  };

  const handleImportProjectToStory = (projId: string) => {
    const proj = activePassionProjects.find(p => p.id === projId);
    if (!proj) return;
    setStoryForm({
      storyTitle: `Building ${proj.projectTitle}`,
      experience: proj.overview,
      personalSignificance: proj.impact || 'Initiative in self-directed problem solving.',
      challenge: proj.challengesAndSolutions || '',
      learning: proj.finalReflection || '',
      personalGrowth: proj.impact || '',
      possibleEssayConnection: `Intellectual curiosity and initiative in building ${proj.projectTitle}`,
      relatedEca: proj.projectTitle
    });
  };

  const handleAddSuppQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSuppUnivId || !suppQuestionForm.questionText.trim()) return;
    addSupplementalQuestion(activeSuppUnivId, {
      applicationCycle: 'Fall 2028',
      isPastQuestion: false,
      questionText: suppQuestionForm.questionText.trim(),
      wordLimit: Number(suppQuestionForm.wordLimit) || 250,
      brainstormingNotes: '',
      mainIdea: '',
      outline: '',
      currentAnswer: suppQuestionForm.currentAnswer,
      currentDraftStage: suppQuestionForm.currentDraftStage
    });
    setNewSuppQuestionModal(false);
    setSuppQuestionForm({
      questionText: '',
      wordLimit: 250,
      currentAnswer: '',
      currentDraftStage: 'First Draft'
    });
  };

  const exportAllEssays = () => {
    let doc = `# ESSAYS ARCHIVE — USA FALL ADMISSION\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
    if (mainEssays.length === 0) {
      doc += `No main essays drafted yet.\n\n`;
    } else {
      mainEssays.forEach((essay, idx) => {
        doc += `## Main Essay ${idx + 1}: ${essay.title}\n`;
        doc += `Prompt: ${essay.promptChoice}\n`;
        doc += `Stage: ${essay.currentDraftStage} | Word Count: ${essay.wordCount}\n\n`;
        doc += `${essay.currentContent.replace(/<[^>]*>/g, ' ').trim()}\n\n---\n\n`;
      });
    }

    doc += `## Supplemental Essays by University\n\n`;
    universities.forEach(u => {
      const nb = getSupplementalNotebook(u.id);
      if (nb.questions.length > 0) {
        doc += `### ${u.name}\n`;
        nb.questions.forEach((q, qIdx) => {
          doc += `Prompt #${qIdx + 1} (${q.wordLimit} words): ${q.questionText}\n`;
          doc += `Answer:\n${q.currentAnswer || '(Not answered yet)'}\n\n`;
        });
      }
    });

    const blob = new Blob([doc], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `All_USA_Essays_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalSuppQuestions = Object.values(getSupplementalNotebook ? universities.reduce((acc, u) => {
    const nb = getSupplementalNotebook(u.id);
    return acc + (nb?.questions?.length || 0);
  }, 0) : 0);

  const totalDraftCount = mainEssays.reduce((acc, e) => acc + (e.drafts?.length || 0), 0);
  const finalizedCount = mainEssays.filter(e => e.currentDraftStage === 'Final Draft').length;

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb & Title */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-sans mb-1">
          <span>&lt;</span>
          <button 
            onClick={() => setActiveSubSection('dashboard')}
            className="hover:text-stone-900 cursor-pointer font-medium"
          >
            USA Application
          </button>
          <span>&gt;</span>
          <span className="text-stone-700 font-medium">Essays &amp; Writing Studio</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif tracking-tight">
          Essays
        </h1>
        <p className="text-sm text-stone-600 font-serif italic mt-0.5">
          Craft your personal narrative. Write. Revise. Polish.
        </p>
      </div>

      {/* Sub-Tabs: Main Essay, Supplemental Essays, Story Bank */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => { setActiveSubTab('main'); setActiveSuppUnivId(null); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
            activeSubTab === 'main'
              ? 'bg-[#3B302A] text-white shadow-xs'
              : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-700 border border-[#E2DBD1]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Main Essay ({mainEssays.length})</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('supplemental'); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
            activeSubTab === 'supplemental'
              ? 'bg-[#3B302A] text-white shadow-xs'
              : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-700 border border-[#E2DBD1]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Supplemental Essays ({universities.length} Colleges)</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('storybank'); setActiveSuppUnivId(null); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
            activeSubTab === 'storybank'
              ? 'bg-[#3B302A] text-white shadow-xs'
              : 'bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-700 border border-[#E2DBD1]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Story Bank ({storyBank.length})</span>
        </button>
      </div>

      {/* MAIN ESSAY WORKSPACE */}
      {activeSubTab === 'main' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left / Center: Main Essay Editor & Lower Cards (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {!activeMainEssay ? (
              /* CLEAN EMPTY STATE: No Main Essay Yet */
              <div className="bg-[#FAF8F5] border border-dashed border-[#EAE4DC] rounded-2xl p-8 shadow-2xs space-y-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-500 mx-auto">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h2 className="text-xl font-bold font-serif text-stone-900">
                    No Main Essay Drafted Yet
                  </h2>
                  <p className="text-xs text-stone-600 font-sans leading-relaxed">
                    The Common Application personal essay is a 650-word story that showcases your personal identity, resilience, intellectual curiosity, or growth to admissions committees.
                  </p>
                </div>

                <button
                  onClick={() => setNewEssayModal(true)}
                  className="px-6 py-2.5 bg-[#3B302A] hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Start Your Main Essay</span>
                </button>

                {/* Quick Start from Official Common App Prompts */}
                <div className="pt-4 border-t border-stone-200 text-left space-y-3">
                  <span className="text-[11px] font-mono font-bold text-stone-500 uppercase tracking-wider block text-center">
                    Or select an official Common App Prompt to begin immediately:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {COMMON_APP_PROMPTS.slice(0, 4).map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleQuickCreateFromPrompt(p.id)}
                        className="p-3 rounded-xl bg-white border border-stone-200 hover:border-stone-400 hover:bg-stone-50 cursor-pointer transition-all space-y-1"
                      >
                        <span className="text-xs font-bold font-serif text-stone-900 block">
                          {p.label}
                        </span>
                        <p className="text-[10px] text-stone-500 line-clamp-2 font-sans">
                          {p.prompt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* ACTIVE ESSAY STUDIO */
              <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-6 shadow-2xs space-y-4">
                
                {/* Header Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE4DC]">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#3B302A]" />
                      <h2 className="text-base font-bold font-serif text-stone-900">
                        {activeMainEssay.title}
                      </h2>
                    </div>
                    <span className="text-[11px] font-mono text-stone-500 block mt-0.5">
                      {activeMainEssay.promptChoice}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-stone-600">
                      Word Count: <strong className="text-stone-900 font-bold">{activeMainEssay.wordCount}</strong> / 650
                    </span>
                    <span className="text-stone-300">|</span>
                    <button
                      onClick={() => saveNewMainEssayDraft(activeMainEssay.id, 'Manual snapshot')}
                      className="px-3.5 py-1.5 bg-[#3B302A] hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
                    >
                      Save Snapshot
                    </button>
                    <button 
                      onClick={() => setNewEssayModal(true)}
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-mono font-medium cursor-pointer"
                      title="Create Another Main Essay Version"
                    >
                      + New
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Delete this essay draft?')) {
                          deleteMainEssay(activeMainEssay.id);
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg cursor-pointer"
                      title="Delete Essay"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Essay Prompt Callout */}
                {activeMainEssay.customPromptText && (
                  <div className="p-3.5 bg-[#F2EDE4] rounded-xl border-l-4 border-[#3B302A] text-stone-800 font-serif italic text-xs sm:text-sm leading-relaxed">
                    &ldquo;{activeMainEssay.customPromptText}&rdquo;
                  </div>
                )}

                {/* Editable Main Text */}
                <div className="min-h-[280px] p-4 bg-white rounded-xl border border-stone-200">
                  <textarea
                    rows={12}
                    value={activeMainEssay.currentContent}
                    onChange={(e) => {
                      updateMainEssay(activeMainEssay.id, { currentContent: e.target.value });
                    }}
                    className="w-full h-full bg-transparent text-sm font-serif text-stone-800 leading-relaxed border-none focus:outline-none resize-y"
                    placeholder="Write your story here... Focus on specific sensory details, authentic vulnerability, and key insights."
                  />
                </div>

                {/* Rubric Checklist */}
                <div className="pt-2 border-t border-[#EAE4DC] space-y-2">
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider block">
                    Self-Review Checklist
                  </span>
                  {checklist.map(item => (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className="flex items-center gap-2.5 text-xs text-stone-700 font-sans cursor-pointer hover:text-stone-900 select-none"
                    >
                      {item.checked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-400 shrink-0" />
                      )}
                      <span className={item.checked ? 'text-stone-900 font-medium' : 'text-stone-600'}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer word count */}
                <div className="flex items-center justify-between pt-3 border-t border-[#EAE4DC] text-xs font-mono text-stone-500">
                  <span className="text-stone-700 font-semibold">
                    Stage: {activeMainEssay.currentDraftStage}
                  </span>
                  <span>{activeMainEssay.wordCount} words &bull; {activeMainEssay.characterCount} characters</span>
                </div>
              </div>
            )}

            {/* Lower Row: Story Bank & Draft History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Lower: Story Bank */}
              <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#3B302A]" />
                      <h3 className="text-sm font-bold font-serif text-stone-900">
                        Story Bank ({storyBank.length})
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveSubTab('storybank')}
                      className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Manage All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {storyBank.length === 0 ? (
                    <div className="py-6 text-center space-y-2">
                      <Sparkles className="w-6 h-6 text-stone-300 mx-auto" />
                      <p className="text-xs font-serif text-stone-600">No stories in bank yet</p>
                      <button
                        onClick={() => { setNewStoryModal(true); setEditingStory(null); }}
                        className="px-3 py-1.5 bg-[#3B302A] text-white rounded-lg text-[10px] font-mono font-bold hover:bg-stone-900 cursor-pointer"
                      >
                        + Add Story
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#EAE4DC] mt-2">
                      {storyBank.slice(0, 3).map(story => (
                        <div key={story.id} className="py-2.5 flex items-start gap-3 hover:bg-[#F4EFEA]/50 rounded-xl p-2 transition-colors cursor-pointer">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold font-serif text-stone-900 truncate">
                              {story.storyTitle}
                            </h4>
                            <p className="text-[11px] text-stone-600 font-sans line-clamp-1 mt-0.5">
                              {story.experience}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Lower: Draft History */}
              <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-[#3B302A]" />
                      <h3 className="text-sm font-bold font-serif text-stone-900">
                        Draft History ({activeMainEssay?.drafts?.length || 0})
                      </h3>
                    </div>
                  </div>

                  {(!activeMainEssay || activeMainEssay.drafts.length === 0) ? (
                    <div className="py-6 text-center space-y-2">
                      <History className="w-6 h-6 text-stone-300 mx-auto" />
                      <p className="text-xs font-serif text-stone-600">No draft snapshots saved yet</p>
                      <p className="text-[10px] font-mono text-stone-400">Click &ldquo;Save Snapshot&rdquo; above to preserve versions</p>
                    </div>
                  ) : (
                    <div className="mt-3 relative pl-5 space-y-3 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-stone-300">
                      {activeMainEssay.drafts.map((d, i) => (
                        <div key={d.id} className="relative">
                          <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-stone-800 ring-2 ring-[#FAF8F5]" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold font-serif text-stone-900">{d.title}</span>
                            <button
                              onClick={() => restoreMainEssayDraft(activeMainEssay.id, d.versionNumber)}
                              className="text-[10px] font-mono text-amber-800 hover:underline cursor-pointer"
                            >
                              Restore
                            </button>
                          </div>
                          <p className="text-[11px] text-stone-600 font-sans mt-0.5">
                            {d.wordCount} words &bull; {d.notes || 'Snapshot'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Right Column (4 cols): Supplemental Notebooks Link, Quick Actions, Stats */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Supplemental Essays by University (Correlated with College List) */}
            <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
                <div>
                  <h3 className="text-sm font-bold font-serif text-stone-900">
                    College Supplementals
                  </h3>
                  <span className="text-[10px] font-mono text-stone-500">
                    {universities.length} Universities on List
                  </span>
                </div>
                <button
                  onClick={() => setActiveSubTab('supplemental')}
                  className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {universities.length === 0 ? (
                <div className="py-6 text-center space-y-2 border border-dashed border-stone-200 rounded-xl p-3">
                  <Building className="w-6 h-6 text-stone-300 mx-auto" />
                  <p className="text-xs font-serif font-semibold text-stone-700">No colleges added yet</p>
                  <p className="text-[10px] font-sans text-stone-500">Add colleges to link prompts</p>
                  <button
                    onClick={() => setActiveSubSection('colleges')}
                    className="px-3 py-1.5 bg-[#3B302A] text-white rounded-lg text-[10px] font-mono font-bold hover:bg-stone-900 cursor-pointer"
                  >
                    + Add College
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#EAE4DC]">
                  {universities.slice(0, 4).map(u => {
                    const nb = getSupplementalNotebook(u.id);
                    return (
                      <div 
                        key={u.id}
                        onClick={() => { setActiveSubTab('supplemental'); setActiveSuppUnivId(u.id); }}
                        className="py-2.5 flex items-center justify-between hover:bg-[#F4EFEA]/50 rounded-xl p-2 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-[#3B302A] text-white flex items-center justify-center font-serif font-bold text-xs shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold font-serif text-stone-900 truncate">
                              {u.name}
                            </h4>
                            <p className="text-[10px] font-mono text-stone-500">
                              {nb.questions.length} {nb.questions.length === 1 ? 'Prompt' : 'Prompts'}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2 pb-2 border-b border-[#EAE4DC]">
                <Sparkles className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  Quick Actions
                </h3>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setNewEssayModal(true)}
                  className="w-full py-2.5 px-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-800 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-[#E2DBD1]"
                >
                  <FileText className="w-3.5 h-3.5 text-stone-600" />
                  <span>+ New Essay</span>
                </button>

                <button
                  onClick={() => { setNewStoryModal(true); setEditingStory(null); }}
                  className="w-full py-2.5 px-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-800 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-[#E2DBD1]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-stone-600" />
                  <span>+ Add Story Entry</span>
                </button>

                <button
                  onClick={exportAllEssays}
                  className="w-full py-2.5 px-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-800 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-[#E2DBD1]"
                >
                  <Download className="w-3.5 h-3.5 text-stone-600" />
                  <span>Export All Essays</span>
                </button>
              </div>
            </div>

            {/* Essay Stats Card (Dynamic) */}
            <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#EAE4DC]">
                <FileText className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  Essay Stats
                </h3>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-stone-700">
                  <span>Main Essays</span>
                  <strong className="text-stone-900 text-sm font-bold">{mainEssays.length}</strong>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span>Saved Draft Versions</span>
                  <strong className="text-stone-900 text-sm font-bold">{totalDraftCount}</strong>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span>Story Bank Ideas</span>
                  <strong className="text-stone-900 text-sm font-bold">{storyBank.length}</strong>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUPPLEMENTAL ESSAYS SUB-TAB (Correlated with College List) */}
      {activeSubTab === 'supplemental' && (
        <div className="space-y-4">
          {!activeSuppUnivId ? (
            universities.length === 0 ? (
              <div className="p-12 bg-[#FAF8F5] border border-dashed border-[#EAE4DC] rounded-2xl text-center space-y-3">
                <Building className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="text-base font-serif font-bold text-stone-800">
                  No Colleges in Your List Yet
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Supplemental essay questions are specific to each university. Add universities to your College List first to write and organize their required prompts.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveSubSection('colleges')}
                    className="px-5 py-2 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-bold hover:bg-stone-900 cursor-pointer"
                  >
                    Go to College List →
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {universities.map(u => {
                  const nb = getSupplementalNotebook(u.id);
                  return (
                    <div
                      key={u.id}
                      onClick={() => setActiveSuppUnivId(u.id)}
                      className="bg-[#FAF8F5] border border-[#EAE4DC] hover:border-stone-400 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                            u.category === 'reach' ? 'bg-amber-100 text-amber-900' :
                            u.category === 'target' ? 'bg-stone-200 text-stone-900' :
                            'bg-emerald-100 text-emerald-900'
                          }`}>
                            {u.category}
                          </span>
                          <span className="text-[11px] font-mono text-stone-500 font-bold">
                            {nb.questions.length} {nb.questions.length === 1 ? 'Prompt' : 'Prompts'}
                          </span>
                        </div>

                        <h3 className="text-base font-bold font-serif text-stone-900 mt-2">
                          {u.name}
                        </h3>
                        <p className="text-xs text-stone-500 font-sans mt-0.5">
                          {u.city}, {u.state ? `${u.state}, ` : ''}{u.country}
                        </p>
                      </div>

                      <div className="pt-4 mt-3 border-t border-stone-200 flex items-center justify-between text-xs font-mono font-semibold text-stone-800">
                        <span>Open Prompts ({nb.questions.length})</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            (() => {
              const currentUniv = universities.find(u => u.id === activeSuppUnivId);
              if (!currentUniv) return null;
              const suppNotebook = getSupplementalNotebook(currentUniv.id);
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setActiveSuppUnivId(null)}
                      className="flex items-center gap-1.5 text-xs font-mono font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to All Universities</span>
                    </button>
                    <button
                      onClick={() => setNewSuppQuestionModal(true)}
                      className="px-3.5 py-1.5 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-medium cursor-pointer"
                    >
                      + Add Prompt Question
                    </button>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-6 space-y-4">
                    <h2 className="text-xl font-bold font-serif text-stone-900">
                      {currentUniv.name} &mdash; Supplemental Notebook
                    </h2>

                    {suppNotebook.questions.length === 0 ? (
                      <div className="py-8 text-center space-y-2 border border-dashed border-stone-300 rounded-xl">
                        <FileText className="w-8 h-8 text-stone-300 mx-auto" />
                        <p className="text-xs font-serif font-semibold text-stone-700">No prompt questions added yet for {currentUniv.name}</p>
                        <button
                          onClick={() => setNewSuppQuestionModal(true)}
                          className="px-4 py-1.5 bg-[#3B302A] text-white rounded-lg text-xs font-mono cursor-pointer"
                        >
                          + Add Prompt
                        </button>
                      </div>
                    ) : (
                      suppNotebook.questions.map((q, idx) => (
                        <div key={q.id} className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="font-bold text-stone-900">Prompt #{idx + 1} ({q.wordLimit} words limit)</span>
                            <button
                              onClick={() => deleteSupplementalQuestion(currentUniv.id, q.id)}
                              className="text-stone-300 hover:text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-sm font-serif italic text-stone-800">&ldquo;{q.questionText}&rdquo;</p>
                          <textarea
                            rows={4}
                            value={q.currentAnswer}
                            onChange={(e) => updateSupplementalQuestion(currentUniv.id, q.id, { currentAnswer: e.target.value })}
                            placeholder="Draft your supplemental answer here..."
                            className="w-full text-xs font-serif p-2.5 bg-[#FAF8F5] border border-stone-200 rounded-lg focus:outline-none"
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* STORY BANK SUB-TAB (Correlated with ECAs & Passion Projects) */}
      {activeSubTab === 'storybank' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EAE4DC]">
            <div>
              <h3 className="text-sm font-serif font-bold text-stone-900">Personal Story Bank</h3>
              <p className="text-xs text-stone-600 font-sans mt-0.5">
                Brainstorm key moments, resilience stories, and leadership breakthroughs. Connect them to your essays.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingStory(null);
                setStoryForm({
                  storyTitle: '',
                  experience: '',
                  personalSignificance: '',
                  challenge: '',
                  learning: '',
                  personalGrowth: '',
                  possibleEssayConnection: '',
                  relatedEca: ''
                });
                setNewStoryModal(true);
              }}
              className="px-4 py-2 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-medium cursor-pointer shrink-0"
            >
              + Add Story
            </button>
          </div>

          {storyBank.length === 0 ? (
            <div className="py-12 bg-[#FAF8F5] border border-dashed border-[#EAE4DC] rounded-2xl text-center space-y-3">
              <Sparkles className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-base font-serif font-bold text-stone-800">
                Your Story Bank is Empty
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Save key memories, scientific breakthroughs, community leadership trials, or failures. You can even import directly from your logged ECAs and Passion Projects!
              </p>
              <button
                onClick={() => {
                  setEditingStory(null);
                  setNewStoryModal(true);
                }}
                className="px-5 py-2 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-bold hover:bg-stone-900 cursor-pointer"
              >
                + Add First Story
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {storyBank.map(story => (
                <div key={story.id} className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-serif text-stone-900">{story.storyTitle}</h3>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => {
                          setEditingStory(story);
                          setStoryForm({
                            storyTitle: story.storyTitle,
                            experience: story.experience,
                            personalSignificance: story.personalSignificance || '',
                            challenge: story.challenge || '',
                            learning: story.learning || '',
                            personalGrowth: story.personalGrowth || '',
                            possibleEssayConnection: story.possibleEssayConnection || '',
                            relatedEca: story.relatedEca || ''
                          });
                          setNewStoryModal(true);
                        }}
                        className="text-stone-400 hover:text-stone-800 text-xs font-mono"
                      >
                        Edit
                      </button>
                      <button onClick={() => deleteStoryBankEntry(story.id)} className="text-stone-300 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-stone-700 font-sans leading-relaxed"><strong>Experience:</strong> {story.experience}</p>
                  {story.challenge && <p className="text-xs text-stone-700 font-sans"><strong>Challenge:</strong> {story.challenge}</p>}
                  {story.learning && <p className="text-xs text-stone-700 font-sans"><strong>Learning:</strong> {story.learning}</p>}
                  {story.possibleEssayConnection && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                      <strong>Essay Connection:</strong> {story.possibleEssayConnection}
                    </div>
                  )}
                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] font-mono text-stone-500">
                    <span>{story.relatedEca ? `Linked: ${story.relatedEca}` : 'General Story'}</span>
                    <span>Updated: {story.updatedAt?.split('T')[0] || 'Recently'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE ESSAY MODAL */}
      {newEssayModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-bold font-serif text-stone-900">Create Main Essay Studio</h3>
            <form onSubmit={handleCreateMainEssay} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                  Essay Title *
                </label>
                <input
                  type="text"
                  required
                  value={newEssayTitle}
                  onChange={(e) => setNewEssayTitle(e.target.value)}
                  placeholder="e.g. Beyond The Equations / Resilience on the Mat"
                  className="w-full px-3.5 py-2 border border-stone-300 bg-white rounded-xl text-xs font-sans text-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                  Common App Prompt Choice
                </label>
                <select
                  value={selectedPromptId}
                  onChange={(e) => setSelectedPromptId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 bg-white rounded-xl text-xs font-sans text-stone-900 cursor-pointer"
                >
                  {COMMON_APP_PROMPTS.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                  <option value="custom">Custom Prompt / Topic of Choice</option>
                </select>
              </div>

              {selectedPromptId === 'custom' && (
                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    Custom Prompt Text
                  </label>
                  <textarea
                    rows={2}
                    value={customPromptText}
                    onChange={(e) => setCustomPromptText(e.target.value)}
                    placeholder="Enter custom prompt question..."
                    className="w-full px-3 py-2 border border-stone-300 bg-white rounded-xl text-xs font-sans text-stone-900"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setNewEssayModal(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-medium cursor-pointer"
                >
                  Create Studio Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE/EDIT STORY MODAL (WITH ECA & PROJECT CORRELATION) */}
      {newStoryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-serif text-stone-900">
              {editingStory ? 'Edit Story Bank Entry' : 'Add Story Bank Entry'}
            </h3>

            {/* Section Correlation Quick Buttons */}
            {!editingStory && (ecaActivities.length > 0 || activePassionProjects.length > 0) && (
              <div className="p-3 bg-[#F2EDE4] rounded-xl space-y-2 text-xs font-mono">
                <span className="text-[10px] uppercase font-bold text-stone-600 block">
                  Quick Correlate from logged activities or projects:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ecaActivities.map(a => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => handleImportEcaToStory(a.id)}
                      className="px-2 py-1 bg-white border border-stone-300 rounded text-[11px] text-stone-800 hover:bg-stone-100 cursor-pointer"
                    >
                      ECA: {a.activityName}
                    </button>
                  ))}
                  {activePassionProjects.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleImportProjectToStory(p.id)}
                      className="px-2 py-1 bg-white border border-stone-300 rounded text-[11px] text-stone-800 hover:bg-stone-100 cursor-pointer"
                    >
                      Project: {p.projectTitle}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveStory} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono font-medium text-stone-700 mb-1">Story Title *</label>
                <input
                  type="text"
                  required
                  value={storyForm.storyTitle}
                  onChange={(e) => setStoryForm(prev => ({ ...prev, storyTitle: e.target.value }))}
                  placeholder="e.g. The Night the Robotics Sensor Failed"
                  className="w-full px-3 py-2 border border-stone-300 bg-white rounded-xl text-stone-900"
                />
              </div>

              <div>
                <label className="block font-mono font-medium text-stone-700 mb-1">Core Experience *</label>
                <textarea
                  rows={2}
                  required
                  value={storyForm.experience}
                  onChange={(e) => setStoryForm(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="What happened? Set the scene..."
                  className="w-full px-3 py-2 border border-stone-300 bg-white rounded-xl text-stone-900"
                />
              </div>

              <div>
                <label className="block font-mono font-medium text-stone-700 mb-1">Obstacle or Challenge</label>
                <textarea
                  rows={2}
                  value={storyForm.challenge}
                  onChange={(e) => setStoryForm(prev => ({ ...prev, challenge: e.target.value }))}
                  placeholder="What was difficult or unexpected?"
                  className="w-full px-3 py-2 border border-stone-300 bg-white rounded-xl text-stone-900"
                />
              </div>

              <div>
                <label className="block font-mono font-medium text-stone-700 mb-1">Key Learning / Growth</label>
                <textarea
                  rows={2}
                  value={storyForm.learning}
                  onChange={(e) => setStoryForm(prev => ({ ...prev, learning: e.target.value }))}
                  placeholder="How did this change your perspective or behavior?"
                  className="w-full px-3 py-2 border border-stone-300 bg-white rounded-xl text-stone-900"
                />
              </div>

              <div>
                <label className="block font-mono font-medium text-stone-700 mb-1">Possible Essay Connection</label>
                <input
                  type="text"
                  value={storyForm.possibleEssayConnection}
                  onChange={(e) => setStoryForm(prev => ({ ...prev, possibleEssayConnection: e.target.value }))}
                  placeholder="e.g. Common App Prompt #2 or Stanford Roommate Letter"
                  className="w-full px-3 py-2 border border-stone-300 bg-white rounded-xl text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setNewStoryModal(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3B302A] text-white rounded-xl font-mono font-medium cursor-pointer"
                >
                  Save Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SUPPLEMENTAL QUESTION MODAL */}
      {newSuppQuestionModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-bold font-serif text-stone-900">Add Supplemental Prompt</h3>
            <form onSubmit={handleAddSuppQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono font-medium text-stone-700 mb-1">Prompt Question Text *</label>
                <textarea
                  rows={3}
                  required
                  value={suppQuestionForm.questionText}
                  onChange={(e) => setSuppQuestionForm(prev => ({ ...prev, questionText: e.target.value }))}
                  placeholder="e.g. Why do you wish to study at this university? (250 words)"
                  className="w-full px-3 py-2 border border-stone-300 bg-white rounded-xl text-stone-900"
                />
              </div>

              <div>
                <label className="block font-mono font-medium text-stone-700 mb-1">Word Limit</label>
                <input
                  type="number"
                  value={suppQuestionForm.wordLimit}
                  onChange={(e) => setSuppQuestionForm(prev => ({ ...prev, wordLimit: Number(e.target.value) || 250 }))}
                  className="w-full px-3 py-2 border border-stone-300 bg-white rounded-xl text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setNewSuppQuestionModal(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3B302A] text-white rounded-xl font-mono font-medium cursor-pointer"
                >
                  Add Prompt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
