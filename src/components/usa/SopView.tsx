import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  History, 
  BookOpen, 
  Layers, 
  ExternalLink,
  ChevronRight,
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
  Sparkles,
  CheckSquare,
  Square,
  Star,
  Building
} from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { SopDocument } from '../../types/usaApp';
import { EditableDate } from './EditableDate';

export const SopView: React.FC = () => {
  const { 
    sopDocuments, 
    addSopDocument, 
    updateSopDocument, 
    deleteSopDocument,
    saveSopDraft,
    restoreSopDraft,
    universities,
    setActiveTab,
    setSelectedUniversityId
  } = useUsaApp();

  const [selectedDocId, setSelectedDocId] = useState<string | null>(
    sopDocuments.length > 0 ? sopDocuments[0].id : null
  );

  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newSopForm, setNewSopForm] = useState({
    title: '',
    targetUniversityOrProgram: '',
    targetWordCount: 1000
  });

  // Guidelines state
  const [guidelines, setGuidelines] = useState([
    { id: 'sg-1', text: 'Be authentic and personal', checked: true },
    { id: 'sg-2', text: 'Highlight your unique journey and intellectual curiosity', checked: true },
    { id: 'sg-3', text: 'Connect past experiences to future academic goals', checked: true },
    { id: 'sg-4', text: 'Show specific fit with the university and professors', checked: true },
    { id: 'sg-5', text: 'Keep your tone genuine, focused, and forward-looking', checked: true },
  ]);

  const toggleGuideline = (id: string) => {
    setGuidelines(prev => prev.map(g => g.id === id ? { ...g, checked: !g.checked } : g));
  };

  const activeDoc = sopDocuments.find(d => d.id === selectedDocId) || sopDocuments[0] || null;
  const [currentText, setCurrentText] = useState(activeDoc?.currentDraft || '');

  // Keep currentText in sync when active doc changes
  React.useEffect(() => {
    if (activeDoc) {
      setCurrentText(activeDoc.currentDraft || '');
    } else {
      setCurrentText('');
    }
  }, [activeDoc?.id]);

  const handleCreateSop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSopForm.title.trim()) return;

    addSopDocument({
      title: newSopForm.title.trim(),
      targetUniversityOrProgram: newSopForm.targetUniversityOrProgram.trim() || 'General Statement',
      purpose: '',
      academicBackground: '',
      personalMotivation: '',
      academicInterests: '',
      futureGoals: '',
      relevantExperiences: '',
      researchInterests: '',
      currentDraft: '',
      finalVersionNotes: 'Draft',
      personalNotes: ''
    });

    setNewSopForm({
      title: '',
      targetUniversityOrProgram: '',
      targetWordCount: 1000
    });
    setNewModalOpen(false);
  };

  const exportCurrentSop = () => {
    if (!activeDoc) return;
    const plainText = currentText.replace(/<[^>]*>/g, ' ').trim();
    const doc = `STATEMENT OF PURPOSE: ${activeDoc.title}\nTarget: ${activeDoc.targetUniversityOrProgram}\nLast Updated: ${activeDoc.updatedAt}\n\n${plainText}\n`;
    const blob = new Blob([doc], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOP_${activeDoc.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const finalizedCount = sopDocuments.filter(d => d.finalVersionNotes === 'Final Draft').length;
  const wordCount = currentText.trim() ? currentText.trim().split(/\s+/).length : 0;

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
          <span className="text-stone-700 font-medium">SOP</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif tracking-tight">
          SOP
        </h1>
        <p className="text-sm text-stone-600 font-serif italic mt-0.5">
          Show the real you. Share your purpose.
        </p>
      </div>

      {/* Top Banner with Stats */}
      <div className="bg-[#3B302A] text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#29231E]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 max-w-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-[#D8C5AE]" />
            </div>
            <div>
              <p className="font-serif italic text-stone-200 text-sm sm:text-base leading-snug">
                &ldquo;Your Statement of Purpose is your chance to tell the admissions committee not just what you&apos;ve done, but why it matters.&rdquo;
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
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">
                  {sopDocuments.length}
                </span>
                <span className="text-[11px] text-stone-300 font-sans">SOP Drafts</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">
                  {finalizedCount}
                </span>
                <span className="text-[11px] text-stone-300 font-sans">Finalized</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[11px] text-stone-300 font-sans block">Active Doc</span>
                <span className="text-xs font-bold font-mono tracking-tight text-white line-clamp-1">
                  {activeDoc ? activeDoc.title : 'None Selected'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Row: My SOPs (Left) + SOP Writing Canvas (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: My SOPs List (4 cols) */}
        <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  My SOPs ({sopDocuments.length})
                </h3>
              </div>
              <button 
                onClick={() => setNewModalOpen(true)}
                className="text-xs font-mono text-stone-800 hover:text-black font-semibold inline-flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded border border-[#E2DBD1]"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            </div>

            {sopDocuments.length === 0 ? (
              <div className="text-center py-10 px-4 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E2DBD1] flex items-center justify-center mx-auto text-stone-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-serif text-stone-800">No SOPs Created Yet</h4>
                  <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                    Create your General Statement or college-specific SOP to begin.
                  </p>
                </div>
                <button
                  onClick={() => setNewModalOpen(true)}
                  className="px-3.5 py-1.5 bg-[#3B302A] hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer"
                >
                  + Create First SOP
                </button>
              </div>
            ) : (
              <div className="space-y-2 mt-2">
                {sopDocuments.map(doc => {
                  const isSelected = activeDoc?.id === doc.id;
                  const docWords = doc.currentDraft.trim() ? doc.currentDraft.trim().split(/\s+/).length : 0;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-[#3B302A] shadow-xs ring-1 ring-[#3B302A]'
                          : 'bg-white/70 hover:bg-white border-[#EAE4DC]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold font-serif text-stone-900 truncate">
                              {doc.title}
                            </h4>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              doc.finalVersionNotes === 'Final Draft'
                                ? 'bg-emerald-100 text-emerald-800'
                                : doc.finalVersionNotes === 'In Review'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-200 text-stone-700'
                            }`}>
                              {doc.finalVersionNotes || 'Draft'}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500 font-sans mt-0.5 truncate">
                            Target: {doc.targetUniversityOrProgram}
                          </p>
                          <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-stone-500">
                            <span>{docWords} words</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Delete Statement of Purpose "${doc.title}"?`)) {
                                  deleteSopDocument(doc.id);
                                  if (selectedDocId === doc.id) {
                                    setSelectedDocId(null);
                                  }
                                }
                              }}
                              className="text-stone-300 hover:text-rose-600 p-0.5"
                              title="Delete SOP"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Correlation to College List */}
          {universities.length > 0 && (
            <div className="pt-3 border-t border-[#EAE4DC]">
              <span className="text-[10px] font-mono uppercase text-stone-500 font-bold block mb-1.5">
                Target Colleges From List
              </span>
              <div className="flex flex-wrap gap-1">
                {universities.slice(0, 4).map(uni => (
                  <button
                    key={uni.id}
                    onClick={() => {
                      setNewSopForm({
                        title: `${uni.name} Statement of Purpose`,
                        targetUniversityOrProgram: uni.name,
                        targetWordCount: 1000
                      });
                      setNewModalOpen(true);
                    }}
                    className="text-[10px] font-mono bg-white hover:bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-[#E2DBD1] cursor-pointer"
                  >
                    + {uni.name} SOP
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: SOP Writing Workspace (8 cols) */}
        <div className="lg:col-span-8 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-6 shadow-2xs space-y-4">
          {activeDoc ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE4DC]">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-[#3B302A] shrink-0" />
                  <div className="min-w-0">
                    <h2 className="font-serif font-bold text-base text-stone-900 truncate">
                      {activeDoc.title}
                    </h2>
                    <span className="text-[10px] font-mono text-stone-500">
                      Target: {activeDoc.targetUniversityOrProgram}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={activeDoc.finalVersionNotes || 'Draft'}
                    onChange={(e) => updateSopDocument(activeDoc.id, { finalVersionNotes: e.target.value })}
                    className="px-2 py-1.5 bg-white border border-[#E2DBD1] rounded-xl text-xs font-mono text-stone-800 cursor-pointer"
                  >
                    <option value="Draft">Draft</option>
                    <option value="In Review">In Review</option>
                    <option value="Final Draft">Final Draft</option>
                  </select>

                  <button
                    onClick={() => {
                      updateSopDocument(activeDoc.id, { currentDraft: currentText });
                      saveSopDraft(activeDoc.id, `Saved revision (${wordCount} words)`);
                    }}
                    className="px-3.5 py-1.5 bg-[#3B302A] hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={exportCurrentSop}
                    className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-[#E2DBD1] text-stone-800 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#F4EFEA] rounded-xl border border-[#E2DBD1] text-stone-700">
                <select className="px-2 py-1 bg-white border border-[#E2DBD1] rounded-lg text-xs font-serif text-stone-800 cursor-pointer">
                  <option>Normal</option>
                  <option>Section Title</option>
                </select>

                <div className="h-4 w-[1px] bg-stone-300 mx-1" />

                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><Bold className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><Italic className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><Underline className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><Strikethrough className="w-3.5 h-3.5" /></button>

                <div className="h-4 w-[1px] bg-stone-300 mx-1" />

                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><List className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><ListOrdered className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-white rounded-lg text-stone-800 cursor-pointer"><Quote className="w-3.5 h-3.5" /></button>
              </div>

              {/* Writing Canvas */}
              <div className="min-h-[280px] p-4 bg-white rounded-xl border border-stone-200">
                <textarea
                  rows={11}
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  className="w-full h-full bg-transparent font-serif text-sm text-stone-800 leading-relaxed border-none focus:outline-none resize-none"
                  placeholder="Start writing your Statement of Purpose... Explain your academic journey, motivation, unique research interests, and what you aim to achieve at your target institution."
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-stone-500 pt-2 border-t border-[#EAE4DC]">
                <span>
                  {wordCount} words &bull; {currentText.length} characters
                </span>
                <span className="text-[11px] text-stone-400">
                  {currentText.length > 0 ? 'Draft in progress' : 'Empty document'}
                </span>
              </div>
            </>
          ) : (
            <div className="py-20 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E2DBD1] flex items-center justify-center mx-auto text-stone-400">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold font-serif text-stone-900">
                No Statement of Purpose Selected
              </h3>
              <p className="text-xs text-stone-500 font-sans max-w-sm mx-auto">
                Create a new SOP document to start drafting, or select an existing one from the left menu.
              </p>
              <button
                onClick={() => setNewModalOpen(true)}
                className="px-4 py-2 bg-[#3B302A] hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer"
              >
                + Create Statement of Purpose
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Grid: Draft History + SOP Guidelines + Quote */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        
        {/* Card 1: Draft History (4 cols) */}
        <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  Draft History
                </h3>
              </div>
              <span className="text-xs font-mono text-stone-500">
                {activeDoc?.drafts.length || 0} Saved
              </span>
            </div>

            {activeDoc && activeDoc.drafts && activeDoc.drafts.length > 0 ? (
              <div className="mt-3 relative pl-5 space-y-3 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-stone-300">
                {activeDoc.drafts.map((draft, idx) => (
                  <div key={draft.id} className="relative">
                    <div className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full ${
                      idx === 0 ? 'bg-stone-800' : 'bg-stone-400'
                    } ring-2 ring-[#FAF8F5]`} />
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold font-serif text-stone-900 block">
                          {draft.title || `Revision ${draft.versionNumber}`}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500">
                          <span>{draft.createdAt}</span>
                          <span>&bull; {draft.content.trim() ? draft.content.trim().split(/\s+/).length : 0} words</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (confirm(`Restore revision v${draft.versionNumber}? Current unsaved text will be replaced.`)) {
                            restoreSopDraft(activeDoc.id, draft.versionNumber);
                            setCurrentText(draft.content);
                          }
                        }}
                        className="px-2 py-0.5 bg-white hover:bg-stone-100 border border-stone-200 rounded text-[11px] font-mono text-stone-800 cursor-pointer"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-stone-500 font-sans">
                {activeDoc ? 'No past drafts saved yet. Click "Save Draft" in the editor.' : 'Select an SOP to view version history.'}
              </div>
            )}
          </div>
        </div>

        {/* Card 2: SOP Guidelines & Tips (4 cols) */}
        <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-[#EAE4DC]">
              <Sparkles className="w-4 h-4 text-[#3B302A]" />
              <h3 className="text-sm font-bold font-serif text-stone-900">
                SOP Guidelines &amp; Tips
              </h3>
            </div>

            <div className="space-y-2 mt-3">
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

          <div className="pt-2 text-[11px] font-mono text-stone-500">
            Check off key benchmarks as you revise your statement.
          </div>
        </div>

        {/* Card 3: Quote card (4 cols) */}
        <div className="lg:col-span-4 bg-[#3B302A] text-white rounded-2xl p-6 shadow-xs border border-[#29231E] relative overflow-hidden flex flex-col justify-end min-h-[160px]">
          <div className="relative z-10 space-y-2">
            <span className="text-2xl font-serif text-[#D8C5AE] leading-none block">&ldquo;</span>
            <p className="font-serif italic text-stone-200 text-sm sm:text-base leading-snug">
              A powerful SOP doesn&apos;t just tell where you&apos;ve been, but where you&apos;re going.
            </p>
            <span className="text-[10px] font-mono tracking-widest text-[#D8C5AE] uppercase block">
              &mdash; COMEBACK
            </span>
          </div>
        </div>

      </div>

      {/* NEW SOP MODAL */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-bold font-serif text-stone-900">
              Create Statement of Purpose
            </h3>
            <form onSubmit={handleCreateSop} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">
                  SOP Title *
                </label>
                <input
                  type="text"
                  required
                  value={newSopForm.title}
                  onChange={(e) => setNewSopForm({ ...newSopForm, title: e.target.value })}
                  placeholder="e.g. General SOP, Stanford Engineering Statement"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">
                  Target University or Program
                </label>
                {universities.length > 0 ? (
                  <div className="space-y-1.5">
                    <select
                      value={newSopForm.targetUniversityOrProgram}
                      onChange={(e) => setNewSopForm({ ...newSopForm, targetUniversityOrProgram: e.target.value })}
                      className="w-full px-2.5 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                    >
                      <option value="">General Statement (All Applications)</option>
                      {universities.map(u => (
                        <option key={u.id} value={u.name}>{u.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={newSopForm.targetUniversityOrProgram}
                      onChange={(e) => setNewSopForm({ ...newSopForm, targetUniversityOrProgram: e.target.value })}
                      placeholder="Or type custom program name..."
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={newSopForm.targetUniversityOrProgram}
                    onChange={(e) => setNewSopForm({ ...newSopForm, targetUniversityOrProgram: e.target.value })}
                    placeholder="e.g. General Statement, Stanford University"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">
                  Target Word Count
                </label>
                <input
                  type="number"
                  value={newSopForm.targetWordCount}
                  onChange={(e) => setNewSopForm({ ...newSopForm, targetWordCount: Number(e.target.value) || 1000 })}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono"
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
                  Create SOP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
