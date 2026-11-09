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
  Star
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
    setActiveTab
  } = useUsaApp();

  const [activeSubTab, setActiveSubTab] = useState<EssaySubTab>('main');

  // Modals
  const [newEssayModal, setNewEssayModal] = useState(false);
  const [newEssayTitle, setNewEssayTitle] = useState('');
  const [selectedPromptId, setSelectedPromptId] = useState('ca-1');
  const [customPromptText, setCustomPromptText] = useState('');

  const [compareDraftsModal, setCompareDraftsModal] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [newStoryModal, setNewStoryModal] = useState(false);
  const [editingStory, setEditingStory] = useState<StoryBankEntry | null>(null);

  // Active University for Supplemental Notebook view
  const [activeSuppUnivId, setActiveSuppUnivId] = useState<string | null>(null);
  const [newSuppQuestionModal, setNewSuppQuestionModal] = useState(false);

  // Active Main Essay
  const activeMainEssay = mainEssays.find(e => e.id === activeMainEssayId) || mainEssays[0];

  // Checklist items state for interactive essay rubric
  const [checklist, setChecklist] = useState<{ id: string; label: string; checked: boolean }[]>([
    { id: 'c1', label: 'Show personal struggle or challenge', checked: true },
    { id: 'c2', label: 'Highlight growth and learning', checked: true },
    { id: 'c3', label: 'Connect to future goals', checked: false }
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  // Draft dates state for in-place editing
  const [draftDates, setDraftDates] = useState<Record<string, string>>({
    'draft-1': 'Nov 9, 2026 • 1:24 PM',
    'draft-2': 'Nov 8, 2026 • 9:17 PM',
    'draft-3': 'Nov 7, 2026 • 8:33 PM',
    'draft-4': 'Nov 6, 2026 • 7:12 PM',
  });

  // Story edit dates state for in-place editing
  const [storyDates, setStoryDates] = useState<Record<string, string>>({
    'story-1': '2 days ago',
    'story-2': '5 days ago',
    'story-3': '1 week ago',
  });

  const handleCreateMainEssay = (e: React.FormEvent) => {
    e.preventDefault();
    const promptObj = COMMON_APP_PROMPTS.find(p => p.id === selectedPromptId);
    const promptChoice = promptObj ? promptObj.label : 'Custom Prompt';
    createMainEssay(newEssayTitle, promptChoice, selectedPromptId === 'custom' ? customPromptText : promptObj?.prompt);
    setNewEssayTitle('');
    setCustomPromptText('');
    setNewEssayModal(false);
  };

  const exportAllEssays = () => {
    let doc = `# ESSAYS ARCHIVE — USA FALL 2028 ADMISSION\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
    mainEssays.forEach((essay, idx) => {
      doc += `## Main Essay ${idx + 1}: ${essay.title}\n`;
      doc += `Prompt: ${essay.promptChoice}\n`;
      doc += `Stage: ${essay.currentDraftStage} | Word Count: ${essay.wordCount}\n\n`;
      doc += `${essay.currentContent.replace(/<[^>]*>/g, ' ').trim()}\n\n---\n\n`;
    });
    const blob = new Blob([doc], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `All_USA_Essays_${new Date().toISOString().slice(0, 10)}.md`;
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
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif tracking-tight">
          Essays
        </h1>
        <p className="text-sm text-stone-600 font-serif italic mt-0.5">
          Craft your story. Make it unforgettable.
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
          <span>Main Essay</span>
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
          <span>Supplemental Essays</span>
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
          <span>Story Bank</span>
        </button>
      </div>

      {/* MAIN ESSAY WORKSPACE (Matches image_34c4daac.png exactly) */}
      {activeSubTab === 'main' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left / Center: Main Essay Editor & Lower Cards (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main Essay Card */}
            <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-6 shadow-2xs space-y-4">
              
              {/* Header Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE4DC]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#3B302A]" />
                  <h2 className="text-base font-bold font-serif text-stone-900">
                    Main Essay
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-stone-600">
                    Word Count: <strong className="text-stone-900 font-bold">{activeMainEssay?.wordCount || 842}</strong>
                  </span>
                  <span className="text-stone-300">|</span>
                  <span className="text-xs font-mono text-stone-500">
                    Last Saved: 2m ago
                  </span>
                  <button
                    onClick={() => saveNewMainEssayDraft(activeMainEssay?.id || 'main-1', 'Saved snapshot')}
                    className="px-3.5 py-1.5 bg-[#3B302A] hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
                  >
                    Save
                  </button>
                  <button className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded-lg cursor-pointer">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded-lg cursor-pointer">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#F4EFEA] rounded-xl border border-[#E2DBD1] text-stone-700">
                <select className="px-2 py-1 bg-white border border-[#E2DBD1] rounded-lg text-xs font-serif text-stone-800 cursor-pointer">
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                  <option>Normal text</option>
                </select>

                <div className="h-4 w-[1px] bg-stone-300 mx-1" />

                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer" title="Bold">
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer" title="Italic">
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer" title="Underline">
                  <Underline className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer" title="Strikethrough">
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>

                <div className="h-4 w-[1px] bg-stone-300 mx-1" />

                <button className="p-1.5 hover:bg-white rounded-lg text-amber-600 cursor-pointer" title="Highlight">
                  <Highlighter className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-serif font-bold text-stone-800 px-1 cursor-pointer">A ▾</span>

                <div className="h-4 w-[1px] bg-stone-300 mx-1" />

                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer" title="Bullet List">
                  <List className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer" title="Numbered List">
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>

                <div className="h-4 w-[1px] bg-stone-300 mx-1" />

                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer" title="Link">
                  <Link className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer" title="Image">
                  <ImageIcon className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer" title="Table">
                  <Table className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer" title="Quote">
                  <Quote className="w-3.5 h-3.5" />
                </button>

                <div className="h-4 w-[1px] bg-stone-300 mx-1" />

                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer" title="Undo">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer" title="Redo">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer" title="Search">
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Essay Content Area */}
              <div className="space-y-4 pt-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900">
                  {activeMainEssay?.title || 'My Journey: A Story of Growth'}
                </h1>

                {/* Callout Quote Box */}
                <div className="p-4 bg-[#F2EDE4] rounded-xl border-l-4 border-[#3B302A] text-stone-800 font-serif italic text-sm sm:text-base leading-relaxed">
                  &ldquo;The hardest battles often build the strongest versions of ourselves.&rdquo;
                </div>

                {/* Editable Main Text */}
                <textarea
                  rows={6}
                  value={activeMainEssay?.currentContent.replace(/<[^>]*>/g, ' ') || `Growing up, I always believed in the power of knowledge, curiosity, and hard work. From a young age, I have been fascinated by how ideas can change lives — whether through science, technology, or human connection. This curiosity has shaped my academic journey and continues to drive my dreams.`}
                  onChange={(e) => {
                    if (activeMainEssay) {
                      updateMainEssay(activeMainEssay.id, { currentContent: e.target.value });
                    }
                  }}
                  className="w-full bg-transparent text-sm sm:text-base font-serif text-stone-800 leading-relaxed border-none focus:outline-none resize-y"
                  placeholder="Draft your essay here..."
                />

                {/* Rubric Checklist */}
                <div className="pt-2 border-t border-[#EAE4DC] space-y-2">
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
              </div>

              {/* Footer word count & info */}
              <div className="flex items-center justify-between pt-3 border-t border-[#EAE4DC] text-xs font-mono text-stone-500">
                <select className="bg-transparent border-none text-stone-700 cursor-pointer focus:outline-none">
                  <option>Normal Text</option>
                  <option>Large Text</option>
                </select>
                <span>{activeMainEssay?.wordCount || 842} words &bull; 4,723 characters</span>
              </div>
            </div>

            {/* Two Side-by-Side Lower Cards: Story Bank & Draft History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Lower: Story Bank */}
              <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#3B302A]" />
                      <h3 className="text-sm font-bold font-serif text-stone-900">
                        Story Bank
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveSubTab('storybank')}
                      className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-[#EAE4DC] mt-2">
                    {/* Story 1 */}
                    <div className="py-3 flex items-start gap-3 hover:bg-[#F4EFEA]/50 rounded-xl p-2 transition-colors cursor-pointer">
                      <div className="w-16 h-12 rounded-lg bg-stone-300 overflow-hidden shrink-0">
                        <img 
                          src="/assets/aistudio/image_c5b776f4.png" 
                          alt="Story thumbnail" 
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold font-serif text-stone-900 line-clamp-1">
                          The Night I Didn&apos;t Give Up
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-mono bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded">Growth</span>
                          <span className="text-[10px] font-mono bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded">Leadership</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-stone-500">
                          <span>Last edited:</span>
                          <EditableDate
                            value={storyDates['story-1']}
                            onChange={(val) => setStoryDates(prev => ({ ...prev, 'story-1': val }))}
                            className="text-stone-700 font-semibold"
                          />
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400 self-center" />
                    </div>

                    {/* Story 2 */}
                    <div className="py-3 flex items-start gap-3 hover:bg-[#F4EFEA]/50 rounded-xl p-2 transition-colors cursor-pointer">
                      <div className="w-16 h-12 rounded-lg bg-stone-300 overflow-hidden shrink-0">
                        <img 
                          src="/assets/aistudio/image_73eb3f74.png" 
                          alt="Story thumbnail" 
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold font-serif text-stone-900 line-clamp-1">
                          A Lesson from Failure
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-mono bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded">Resilience</span>
                          <span className="text-[10px] font-mono bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded">Learning</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-stone-500">
                          <span>Last edited:</span>
                          <EditableDate
                            value={storyDates['story-2']}
                            onChange={(val) => setStoryDates(prev => ({ ...prev, 'story-2': val }))}
                            className="text-stone-700 font-semibold"
                          />
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400 self-center" />
                    </div>

                    {/* Story 3 */}
                    <div className="py-3 flex items-start gap-3 hover:bg-[#F4EFEA]/50 rounded-xl p-2 transition-colors cursor-pointer">
                      <div className="w-16 h-12 rounded-lg bg-stone-300 overflow-hidden shrink-0">
                        <img 
                          src="/assets/aistudio/image_1bccb426.png" 
                          alt="Story thumbnail" 
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold font-serif text-stone-900 line-clamp-1">
                          Small Actions, Big Impact
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-mono bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded">Community</span>
                          <span className="text-[10px] font-mono bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded">Empathy</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-stone-500">
                          <span>Last edited:</span>
                          <EditableDate
                            value={storyDates['story-3']}
                            onChange={(val) => setStoryDates(prev => ({ ...prev, 'story-3': val }))}
                            className="text-stone-700 font-semibold"
                          />
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400 self-center" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Lower: Draft History */}
              <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-[#3B302A]" />
                      <h3 className="text-sm font-bold font-serif text-stone-900">
                        Draft History
                      </h3>
                    </div>
                    <button
                      onClick={() => setCompareDraftsModal(true)}
                      className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-[#E2DBD1] rounded-lg text-xs font-mono text-stone-800 font-medium cursor-pointer"
                    >
                      Compare Drafts
                    </button>
                  </div>

                  {/* Vertical Timeline */}
                  <div className="mt-3 relative pl-5 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-stone-300">
                    
                    {/* Draft 1: Final Draft */}
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-stone-800 ring-2 ring-[#FAF8F5]" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold font-serif text-stone-900">Final Draft</span>
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        </div>
                        <EditableDate
                          value={draftDates['draft-1']}
                          onChange={(val) => setDraftDates(prev => ({ ...prev, 'draft-1': val }))}
                          className="text-[10px] font-mono text-stone-500"
                        />
                      </div>
                      <p className="text-[11px] text-stone-600 font-sans mt-0.5">
                        Polished and ready to submit. &bull; 842 words
                      </p>
                    </div>

                    {/* Draft 2: Improved Draft */}
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-stone-400 ring-2 ring-[#FAF8F5]" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-serif text-stone-900">Improved Draft</span>
                        <EditableDate
                          value={draftDates['draft-2']}
                          onChange={(val) => setDraftDates(prev => ({ ...prev, 'draft-2': val }))}
                          className="text-[10px] font-mono text-stone-500"
                        />
                      </div>
                      <p className="text-[11px] text-stone-600 font-sans mt-0.5">
                        Better flow and stronger conclusion. &bull; 821 words
                      </p>
                    </div>

                    {/* Draft 3: Second Draft */}
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-stone-400 ring-2 ring-[#FAF8F5]" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-serif text-stone-900">Second Draft</span>
                        <EditableDate
                          value={draftDates['draft-3']}
                          onChange={(val) => setDraftDates(prev => ({ ...prev, 'draft-3': val }))}
                          className="text-[10px] font-mono text-stone-500"
                        />
                      </div>
                      <p className="text-[11px] text-stone-600 font-sans mt-0.5">
                        More personal and focused. &bull; 797 words
                      </p>
                    </div>

                    {/* Draft 4: First Draft */}
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-stone-400 ring-2 ring-[#FAF8F5]" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-serif text-stone-900">First Draft</span>
                        <EditableDate
                          value={draftDates['draft-4']}
                          onChange={(val) => setDraftDates(prev => ({ ...prev, 'draft-4': val }))}
                          className="text-[10px] font-mono text-stone-500"
                        />
                      </div>
                      <p className="text-[11px] text-stone-600 font-sans mt-0.5">
                        Rough draft after brainstorming. &bull; 743 words
                      </p>
                    </div>

                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Supplemental Essays, Quick Actions, Essay Stats (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Supplemental Essays List Card */}
            <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#3B302A]" />
                  <h3 className="text-sm font-bold font-serif text-stone-900">
                    Supplemental Essays
                  </h3>
                </div>
                <button
                  onClick={() => setActiveSubTab('supplemental')}
                  className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-[#EAE4DC]">
                {/* Stanford */}
                <div 
                  onClick={() => { setActiveSubTab('supplemental'); setActiveSuppUnivId('univ-stanford'); }}
                  className="py-3 flex items-center justify-between hover:bg-[#F4EFEA]/50 rounded-xl p-2 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center font-serif font-black text-rose-800 text-sm shadow-2xs">
                      S
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-serif text-stone-900">Stanford University</h4>
                      <p className="text-[10px] font-mono text-stone-500">Stanford, CA, USA</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-stone-700 bg-stone-200/60 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    3 drafts <ChevronRight className="w-3 h-3 text-stone-400" />
                  </span>
                </div>

                {/* Harvard */}
                <div 
                  onClick={() => { setActiveSubTab('supplemental'); setActiveSuppUnivId('univ-harvard'); }}
                  className="py-3 flex items-center justify-between hover:bg-[#F4EFEA]/50 rounded-xl p-2 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center font-serif font-black text-red-900 text-sm shadow-2xs">
                      H
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-serif text-stone-900">Harvard University</h4>
                      <p className="text-[10px] font-mono text-stone-500">Cambridge, MA, USA</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-stone-700 bg-stone-200/60 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    2 drafts <ChevronRight className="w-3 h-3 text-stone-400" />
                  </span>
                </div>

                {/* UC Berkeley */}
                <div 
                  onClick={() => { setActiveSubTab('supplemental'); setActiveSuppUnivId('univ-berkeley'); }}
                  className="py-3 flex items-center justify-between hover:bg-[#F4EFEA]/50 rounded-xl p-2 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-serif font-black text-blue-900 text-xs shadow-2xs">
                      Cal
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-serif text-stone-900">UC Berkeley</h4>
                      <p className="text-[10px] font-mono text-stone-500">Berkeley, CA, USA</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-stone-700 bg-stone-200/60 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    1 draft <ChevronRight className="w-3 h-3 text-stone-400" />
                  </span>
                </div>

                {/* MIT */}
                <div 
                  onClick={() => { setActiveSubTab('supplemental'); setActiveSuppUnivId('univ-mit'); }}
                  className="py-3 flex items-center justify-between hover:bg-[#F4EFEA]/50 rounded-xl p-2 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-center font-mono font-black text-stone-900 text-xs shadow-2xs">
                      MIT
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-serif text-stone-900">MIT</h4>
                      <p className="text-[10px] font-mono text-stone-500">Cambridge, MA, USA</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-stone-700 bg-stone-200/60 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    2 drafts <ChevronRight className="w-3 h-3 text-stone-400" />
                  </span>
                </div>

                {/* Columbia */}
                <div 
                  onClick={() => { setActiveSubTab('supplemental'); setActiveSuppUnivId('univ-columbia'); }}
                  className="py-3 flex items-center justify-between hover:bg-[#F4EFEA]/50 rounded-xl p-2 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center font-serif font-black text-sky-900 text-sm shadow-2xs">
                      C
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-serif text-stone-900">Columbia University</h4>
                      <p className="text-[10px] font-mono text-stone-500">New York, NY, USA</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-stone-700 bg-stone-200/60 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    1 draft <ChevronRight className="w-3 h-3 text-stone-400" />
                  </span>
                </div>
              </div>
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
                  <span>New Essay</span>
                </button>

                <button
                  onClick={() => { setNewStoryModal(true); setEditingStory(null); }}
                  className="w-full py-2.5 px-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-800 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-[#E2DBD1]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-stone-600" />
                  <span>Add Story</span>
                </button>

                <button
                  onClick={() => alert('Templates include: Personal Growth, Intellectual Passion, Challenge Overcome, and Community Leadership.')}
                  className="w-full py-2.5 px-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-800 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-[#E2DBD1]"
                >
                  <Columns className="w-3.5 h-3.5 text-stone-600" />
                  <span>Browse Templates</span>
                </button>

                <button
                  onClick={() => alert('College Essay Guy Framework: Connect every anecdote to core values, show not just tell, and answer "So What?".')}
                  className="w-full py-2.5 px-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-800 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-[#E2DBD1]"
                >
                  <Bookmark className="w-3.5 h-3.5 text-stone-600" />
                  <span>View Essay Guide</span>
                </button>

                <button
                  onClick={exportAllEssays}
                  className="w-full py-2.5 px-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-800 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-[#E2DBD1]"
                >
                  <Download className="w-3.5 h-3.5 text-stone-600" />
                  <span>Export Essays</span>
                </button>
              </div>
            </div>

            {/* Essay Stats Card */}
            <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#EAE4DC]">
                <FileText className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  Essay Stats
                </h3>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-stone-700">
                  <span>Total Essays</span>
                  <strong className="text-stone-900 text-sm font-bold">12</strong>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span>Drafts</span>
                  <strong className="text-stone-900 text-sm font-bold">28</strong>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span>Finalized</span>
                  <strong className="text-emerald-800 text-sm font-bold">6</strong>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUPPLEMENTAL ESSAYS SUB-TAB */}
      {activeSubTab === 'supplemental' && (
        <div className="space-y-4">
          {!activeSuppUnivId ? (
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
                      <span>Open Supplementals</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
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
                      className="px-3.5 py-1.5 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-medium"
                    >
                      + Add Prompt
                    </button>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-6 space-y-4">
                    <h2 className="text-xl font-bold font-serif text-stone-900">
                      {currentUniv.name} &mdash; Supplemental Notebook
                    </h2>
                    {suppNotebook.questions.map((q, idx) => (
                      <div key={q.id} className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-stone-900">Prompt #{idx + 1} ({q.wordLimit} words)</span>
                          <span className="text-stone-500">{q.currentDraftStage}</span>
                        </div>
                        <p className="text-sm font-serif italic text-stone-800">&ldquo;{q.questionText}&rdquo;</p>
                        <textarea
                          rows={3}
                          value={q.currentAnswer}
                          onChange={(e) => updateSupplementalQuestion(currentUniv.id, q.id, { currentAnswer: e.target.value })}
                          placeholder="Draft your supplemental answer here..."
                          className="w-full text-xs font-serif p-2 bg-[#FAF8F5] border border-stone-200 rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* STORY BANK SUB-TAB */}
      {activeSubTab === 'storybank' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-600 font-sans">
              Archive of meaningful personal narratives, pivotal moments, and leadership stories.
            </p>
            <button
              onClick={() => { setNewStoryModal(true); setEditingStory(null); }}
              className="px-4 py-2 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-medium cursor-pointer"
            >
              + Add Story
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storyBank.map(story => (
              <div key={story.id} className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-serif text-stone-900">{story.storyTitle}</h3>
                  <button onClick={() => deleteStoryBankEntry(story.id)} className="text-stone-300 hover:text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
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
                  <span>{story.relatedEca ? `ECA: ${story.relatedEca}` : 'General Story'}</span>
                  <span>Updated: {story.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE ESSAY MODAL */}
      {newEssayModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-bold font-serif text-stone-900">Create New Main Essay</h3>
            <form onSubmit={handleCreateMainEssay} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                  Essay Working Title *
                </label>
                <input
                  type="text"
                  required
                  value={newEssayTitle}
                  onChange={(e) => setNewEssayTitle(e.target.value)}
                  placeholder="e.g. The Radio Repair Shop / Beyond The Blackboard"
                  className="w-full px-3.5 py-2 border border-stone-300 bg-white rounded-xl text-xs font-sans text-stone-900"
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

      {/* DRAFT COMPARE MODAL */}
      {compareDraftsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl border border-stone-200 shadow-2xl max-w-4xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-lg font-bold font-serif text-stone-900">Compare Draft Versions</h3>
              <button onClick={() => setCompareDraftsModal(false)} className="text-stone-400 hover:text-stone-900 text-sm">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                <div className="text-xs font-mono font-bold text-stone-900">Current Final Draft (842 words)</div>
                <div className="text-xs font-serif text-stone-700 leading-relaxed max-h-80 overflow-y-auto">
                  {activeMainEssay?.currentContent.replace(/<[^>]*>/g, ' ') || 'Growing up, I always believed in the power of knowledge, curiosity, and hard work...'}
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                <div className="text-xs font-mono font-bold text-stone-900">Earlier Draft (743 words)</div>
                <div className="text-xs font-serif text-stone-600 leading-relaxed max-h-80 overflow-y-auto">
                  Growing up in Dhaka, I spent hours taking apart old transistor radios, marveling at how copper circuits carried voices across distances...
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
