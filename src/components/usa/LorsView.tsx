import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  UserCheck, 
  Download, 
  History, 
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Info,
  Maximize2,
  MoreHorizontal,
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
  CheckCircle2,
  Clock,
  FileCheck2,
  Paperclip,
  CheckSquare,
  Square
} from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { RecommendationNotebook } from '../../types/usaApp';
import { EditableDate } from './EditableDate';

export const LorsView: React.FC = () => {
  const { 
    recommendationNotebooks, 
    addRecommendationNotebook, 
    updateRecommendationNotebook, 
    deleteRecommendationNotebook,
    saveRecommendationDraft,
    restoreRecommendationDraft,
    setActiveTab
  } = useUsaApp();

  const [selectedNotebookId, setSelectedNotebookId] = useState<string>('lor-1');

  // Teacher date state for editable dates
  const [lorDates, setLorDates] = useState<Record<string, string>>({
    'lor-1': 'Nov 8, 2026',
    'lor-2': 'Nov 5, 2026',
    'lor-3': 'Nov 3, 2026',
    'lor-4': 'Oct 28, 2026',
  });

  // Attachment dates state
  const [attachmentDates, setAttachmentDates] = useState<Record<string, string>>({
    'att-1': 'Nov 5, 2026',
    'att-2': 'Nov 3, 2026',
    'att-3': 'Oct 28, 2026',
  });

  // Guidelines checklist state
  const [guidelines, setGuidelines] = useState([
    { id: 'g1', text: 'Highlight your unique qualities', checked: true },
    { id: 'g2', text: 'Include specific examples', checked: true },
    { id: 'g3', text: 'Show your impact and contributions', checked: true },
    { id: 'g4', text: 'Keep a professional and sincere tone', checked: true },
    { id: 'g5', text: 'Tailor it to the university', checked: true },
  ]);

  const toggleGuideline = (id: string) => {
    setGuidelines(prev => prev.map(g => g.id === id ? { ...g, checked: !g.checked } : g));
  };

  const [newLorModal, setNewLorModal] = useState(false);
  const [newTeacherForm, setNewTeacherForm] = useState({
    name: '',
    role: '',
    subject: '',
    status: 'In Progress'
  });

  // Active LOR
  const activeNotebook = recommendationNotebooks.find(n => n.id === selectedNotebookId) || recommendationNotebooks[0];
  const [currentDraftText, setCurrentDraftText] = useState(activeNotebook?.currentDraft || '');

  const handleCreateLor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherForm.name.trim()) return;
    const newId = addRecommendationNotebook({
      teacherName: newTeacherForm.name,
      position: newTeacherForm.role || 'Teacher',
      subject: newTeacherForm.subject || 'Academics',
      institution: 'High School',
      relationshipDuration: '2 years',
      classesTaught: '',
      academicStrengths: '',
      personalObservations: '',
      relevantExperiences: '',
      projectsAndAchievements: '',
      leadershipExamples: '',
      specificAnecdotes: '',
      contextNotes: '',
      attachedDocuments: [],
      currentDraft: ''
    });
    setLorDates(prev => ({ ...prev, [newId]: 'Nov 9, 2026' }));
    setSelectedNotebookId(newId);
    setNewLorModal(false);
    setNewTeacherForm({ name: '', role: '', subject: '', status: 'In Progress' });
  };

  const exportAllLors = () => {
    let doc = `# LETTERS OF RECOMMENDATION DOSSIERS\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
    recommendationNotebooks.forEach(nb => {
      doc += `## Referee: ${nb.teacherName} (${nb.position}, ${nb.subject})\n`;
      doc += `Status: Updated ${lorDates[nb.id] || 'Recently'}\n\n`;
      doc += `Draft:\n${nb.currentDraft || '(Draft empty)'}\n\n---\n\n`;
    });
    const blob = new Blob([doc], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LOR_Preparation_${new Date().toISOString().slice(0, 10)}.md`;
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
          <span className="text-stone-700 font-medium">LORs</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif tracking-tight">
          LORs
        </h1>
        <p className="text-sm text-stone-600 font-serif italic mt-0.5">
          Strong recommendations. A stronger application.
        </p>
      </div>

      {/* Hero Banner with Stats (Matches image_9c701907.png) */}
      <div className="bg-[#3B302A] text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#29231E]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 max-w-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-6 h-6 text-[#D8C5AE]" />
            </div>
            <div>
              <p className="font-serif italic text-stone-200 text-sm sm:text-base leading-snug">
                &ldquo;A great letter speaks not just of your achievements, but of your character, curiosity, and impact.&rdquo;
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
                <FileText className="w-5 h-5 text-[#D8C5AE]" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">5 / 6</span>
                <span className="text-[11px] text-stone-300 font-sans">LORs Planned</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">2</span>
                <span className="text-[11px] text-stone-300 font-sans">Completed</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">4</span>
                <span className="text-[11px] text-stone-300 font-sans">In Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Row: My LORs (Left) + LOR Writing Workspace (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: My LORs List (4 cols) */}
        <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  My LORs
                </h3>
              </div>
              <button 
                onClick={() => setNewLorModal(true)}
                className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 mt-3">
              {/* Teacher 1: Dr. Rahman */}
              <div
                onClick={() => setSelectedNotebookId('lor-1')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedNotebookId === 'lor-1'
                    ? 'bg-white border-[#3B302A] shadow-xs ring-1 ring-[#3B302A]'
                    : 'bg-white/70 hover:bg-white border-[#EAE4DC]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center font-bold text-stone-700 text-xs shrink-0">
                      DR
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-serif text-stone-900">Dr. Rahman</h4>
                      <p className="text-[10px] font-sans text-stone-500">Mathematics &bull; University Teacher</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                      Completed
                    </span>
                    <button className="text-stone-400 hover:text-stone-700 ml-2">...</button>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-stone-100 flex items-center gap-1 text-[10px] font-mono text-stone-500">
                  <span>Updated:</span>
                  <EditableDate
                    value={lorDates['lor-1']}
                    onChange={(val) => setLorDates(prev => ({ ...prev, 'lor-1': val }))}
                    className="text-stone-700 font-semibold"
                  />
                </div>
              </div>

              {/* Teacher 2: Ms. Khan */}
              <div
                onClick={() => setSelectedNotebookId('lor-2')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedNotebookId === 'lor-2'
                    ? 'bg-white border-[#3B302A] shadow-xs ring-1 ring-[#3B302A]'
                    : 'bg-white/70 hover:bg-white border-[#EAE4DC]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center font-bold text-stone-700 text-xs shrink-0">
                      MK
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-serif text-stone-900">Ms. Khan</h4>
                      <p className="text-[10px] font-sans text-stone-500">Physics &bull; School Teacher</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                      Completed
                    </span>
                    <button className="text-stone-400 hover:text-stone-700 ml-2">...</button>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-stone-100 flex items-center gap-1 text-[10px] font-mono text-stone-500">
                  <span>Updated:</span>
                  <EditableDate
                    value={lorDates['lor-2']}
                    onChange={(val) => setLorDates(prev => ({ ...prev, 'lor-2': val }))}
                    className="text-stone-700 font-semibold"
                  />
                </div>
              </div>

              {/* Teacher 3: Mr. Ahmed */}
              <div
                onClick={() => setSelectedNotebookId('lor-3')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedNotebookId === 'lor-3'
                    ? 'bg-white border-[#3B302A] shadow-xs ring-1 ring-[#3B302A]'
                    : 'bg-white/70 hover:bg-white border-[#EAE4DC]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center font-bold text-stone-700 text-xs shrink-0">
                      MA
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-serif text-stone-900">Mr. Ahmed</h4>
                      <p className="text-[10px] font-sans text-stone-500">Computer Science &bull; Mentor</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-block">
                      In Progress
                    </span>
                    <button className="text-stone-400 hover:text-stone-700 ml-2">...</button>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-stone-100 flex items-center gap-1 text-[10px] font-mono text-stone-500">
                  <span>Updated:</span>
                  <EditableDate
                    value={lorDates['lor-3']}
                    onChange={(val) => setLorDates(prev => ({ ...prev, 'lor-3': val }))}
                    className="text-stone-700 font-semibold"
                  />
                </div>
              </div>

              {/* Teacher 4: Prof. Islam */}
              <div
                onClick={() => setSelectedNotebookId('lor-4')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedNotebookId === 'lor-4'
                    ? 'bg-white border-[#3B302A] shadow-xs ring-1 ring-[#3B302A]'
                    : 'bg-white/70 hover:bg-white border-[#EAE4DC]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center font-bold text-stone-700 text-xs shrink-0">
                      PI
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-serif text-stone-900">Prof. Islam</h4>
                      <p className="text-[10px] font-sans text-stone-500">Research &bull; Professor</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-stone-600 bg-stone-200 px-2 py-0.5 rounded-full inline-block">
                      Draft
                    </span>
                    <button className="text-stone-400 hover:text-stone-700 ml-2">...</button>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-stone-100 flex items-center gap-1 text-[10px] font-mono text-stone-500">
                  <span>Updated:</span>
                  <EditableDate
                    value={lorDates['lor-4']}
                    onChange={(val) => setLorDates(prev => ({ ...prev, 'lor-4': val }))}
                    className="text-stone-700 font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Add New LOR Button */}
          <button
            onClick={() => setNewLorModal(true)}
            className="w-full py-3 border border-dashed border-stone-300 rounded-xl hover:border-stone-500 hover:bg-[#F4EFEA] transition-colors flex items-center justify-center gap-2 text-xs font-mono text-stone-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <div className="text-left">
              <span className="font-bold block">Add New LOR</span>
              <span className="text-[10px] text-stone-500">Create a new recommendation notebook</span>
            </div>
          </button>
        </div>

        {/* Right Column: LOR Writing Workspace (8 cols) */}
        <div className="lg:col-span-8 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE4DC]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#3B302A]" />
              <h2 className="text-base font-bold font-serif text-stone-900">
                LOR Writing Workspace
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (activeNotebook) {
                    updateRecommendationNotebook(activeNotebook.id, { currentDraft: currentDraftText });
                    saveRecommendationDraft(activeNotebook.id, 'Saved draft');
                  }
                }}
                className="px-4 py-1.5 bg-[#3B302A] hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
              >
                Save
              </button>
              <button className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded-lg cursor-pointer">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Editor Format Toolbar */}
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#F4EFEA] rounded-xl border border-[#E2DBD1] text-stone-700">
            <select className="px-2 py-1 bg-white border border-[#E2DBD1] rounded-lg text-xs font-serif text-stone-800 cursor-pointer">
              <option>Normal</option>
              <option>Formal Letterhead</option>
            </select>

            <div className="h-4 w-[1px] bg-stone-300 mx-1" />

            <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><Bold className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><Italic className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><Underline className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><Strikethrough className="w-3.5 h-3.5" /></button>

            <div className="h-4 w-[1px] bg-stone-300 mx-1" />

            <span className="text-xs font-serif font-bold text-stone-800 px-1 cursor-pointer">A ▾</span>
            <button className="p-1.5 hover:bg-white rounded-lg text-amber-600 cursor-pointer"><Highlighter className="w-3.5 h-3.5" /></button>

            <div className="h-4 w-[1px] bg-stone-300 mx-1" />

            <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><List className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><ListOrdered className="w-3.5 h-3.5" /></button>

            <div className="h-4 w-[1px] bg-stone-300 mx-1" />

            <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><Link className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><ImageIcon className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><Table className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><Quote className="w-3.5 h-3.5" /></button>

            <div className="h-4 w-[1px] bg-stone-300 mx-1" />

            <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><Undo2 className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><Redo2 className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><MoreHorizontal className="w-3.5 h-3.5" /></button>
          </div>

          {/* Lined Notebook Writing Canvas */}
          <div className="min-h-[260px] p-4 bg-white rounded-xl border border-stone-200 relative">
            <textarea
              rows={9}
              value={currentDraftText}
              onChange={(e) => setCurrentDraftText(e.target.value)}
              className="w-full h-full bg-transparent font-serif text-sm text-stone-800 leading-relaxed border-none focus:outline-none resize-none"
              placeholder="Write your recommendation draft here...&#10;Add examples, highlight key points, and make it personalized."
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-stone-500 pt-2 border-t border-[#EAE4DC]">
            <span>
              {currentDraftText.trim() ? currentDraftText.trim().split(/\s+/).length : 0} words &bull; {currentDraftText.length} characters
            </span>
            <span className="text-[11px] text-stone-400">Autosaved</span>
          </div>
        </div>

      </div>

      {/* Bottom Grid: 3 Columns matching image_9c701907.png */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        
        {/* Card 1: LOR Guidelines & Tips (4 cols) */}
        <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  LOR Guidelines &amp; Tips
                </h3>
              </div>
              <button 
                onClick={() => alert('Guideline Details: Provide your teachers with a 1-page "Brag Sheet" including project titles, contest rankings, and why you value their subject.')}
                className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 mt-3">
              {guidelines.map(g => (
                <div 
                  key={g.id}
                  onClick={() => toggleGuideline(g.id)}
                  className="flex items-center gap-2.5 text-xs text-stone-700 font-sans cursor-pointer hover:text-stone-900 select-none"
                >
                  {g.checked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                  <span className={g.checked ? 'text-stone-900 font-medium' : 'text-stone-600'}>
                    {g.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quill Illustration */}
          <div className="pt-2 flex justify-end">
            <div className="w-24 h-16 opacity-80">
              <img 
                src="/assets/aistudio/image_c5b776f4.png" 
                alt="Quill pen and ink" 
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Document Attachments (4 cols) */}
        <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  Document Attachments
                </h3>
              </div>
              <button 
                onClick={() => alert('Attachments include official certificates, extracurricular resume, and annotated transcripts for referees.')}
                className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#EAE4DC] mt-2">
              {/* Attachment 1 */}
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    PDF
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-serif text-stone-900">My Academic Resume.pdf</h4>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500">
                      <span>Added:</span>
                      <EditableDate
                        value={attachmentDates['att-1']}
                        onChange={(val) => setAttachmentDates(prev => ({ ...prev, 'att-1': val }))}
                        className="text-stone-700 font-semibold"
                      />
                      <span>&bull; 245 KB</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => alert('Downloading My Academic Resume.pdf')}
                  className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded-lg cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Attachment 2 */}
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    PDF
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-serif text-stone-900">Awards &amp; Certificates.pdf</h4>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500">
                      <span>Added:</span>
                      <EditableDate
                        value={attachmentDates['att-2']}
                        onChange={(val) => setAttachmentDates(prev => ({ ...prev, 'att-2': val }))}
                        className="text-stone-700 font-semibold"
                      />
                      <span>&bull; 1.2 MB</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => alert('Downloading Awards & Certificates.pdf')}
                  className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded-lg cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Attachment 3 */}
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    DOC
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-serif text-stone-900">LOR Context Notes.docx</h4>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500">
                      <span>Added:</span>
                      <EditableDate
                        value={attachmentDates['att-3']}
                        onChange={(val) => setAttachmentDates(prev => ({ ...prev, 'att-3': val }))}
                        className="text-stone-700 font-semibold"
                      />
                      <span>&bull; 89 KB</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => alert('Downloading LOR Context Notes.docx')}
                  className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded-lg cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Attachment upload dialog')}
            className="w-full py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-mono text-stone-700 font-medium cursor-pointer"
          >
            + Upload Document
          </button>
        </div>

        {/* Card 3: Quick Actions & Campus Quote Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          
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
                onClick={() => setNewLorModal(true)}
                className="w-full py-2 px-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-800 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-[#E2DBD1]"
              >
                <Plus className="w-3.5 h-3.5 text-stone-600" />
                <span>Add New LOR</span>
              </button>

              <button
                onClick={() => alert('LOR Templates: Academic Excellence, Character & Humility, Peer Leadership, Independent Research.')}
                className="w-full py-2 px-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-800 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-[#E2DBD1]"
              >
                <FileText className="w-3.5 h-3.5 text-stone-600" />
                <span>View Templates</span>
              </button>

              <button
                onClick={exportAllLors}
                className="w-full py-2 px-3 bg-[#F4EFEA] hover:bg-[#EAE4DC] text-stone-800 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-[#E2DBD1]"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                <span>Export All LORs</span>
              </button>
            </div>
          </div>

          {/* Historic Campus Quote Card */}
          <div className="bg-[#3B302A] text-white rounded-2xl p-5 shadow-xs border border-[#29231E] relative overflow-hidden flex flex-col justify-end min-h-[140px]">
            <div className="relative z-10 space-y-2">
              <span className="text-2xl font-serif text-[#D8C5AE] leading-none block">&ldquo;</span>
              <p className="font-serif italic text-stone-200 text-sm leading-snug">
                Good recommendations open doors to greater opportunities.
              </p>
              <span className="text-[10px] font-mono tracking-widest text-[#D8C5AE] uppercase block">
                &mdash; COMEBACK
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* CREATE LOR MODAL */}
      {newLorModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-bold font-serif text-stone-900">Add New LOR Referee</h3>
            <form onSubmit={handleCreateLor} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">Teacher / Referee Name *</label>
                <input
                  type="text"
                  required
                  value={newTeacherForm.name}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, name: e.target.value })}
                  placeholder="e.g. Dr. Mahmudul Hasan"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">Subject / Department</label>
                <input
                  type="text"
                  value={newTeacherForm.subject}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, subject: e.target.value })}
                  placeholder="e.g. Chemistry / English"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={newTeacherForm.role}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, role: e.target.value })}
                  placeholder="e.g. Head of Department"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setNewLorModal(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-medium"
                >
                  Create LOR Notebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
