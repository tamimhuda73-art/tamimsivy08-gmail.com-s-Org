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
  Star
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
    setActiveTab
  } = useUsaApp();

  const [selectedDocId, setSelectedDocId] = useState<string>('sop-1');

  // Dates state for editable dates
  const [lastEditedBannerDate, setLastEditedBannerDate] = useState('Nov 1, 2027');
  const [sopDates, setSopDates] = useState<Record<string, string>>({
    'sop-1': 'Nov 1, 2027',
    'sop-2': 'Oct 28, 2027',
    'sop-3': 'Oct 25, 2027',
  });

  const [draftHistoryDates, setDraftHistoryDates] = useState<Record<string, string>>({
    'hist-1': 'Nov 1, 2027',
    'hist-2': 'Oct 30, 2027',
    'hist-3': 'Oct 25, 2027',
  });

  // Guidelines state
  const [guidelines, setGuidelines] = useState([
    { id: 'sg-1', text: 'Be authentic and personal', checked: true },
    { id: 'sg-2', text: 'Highlight your unique journey', checked: true },
    { id: 'sg-3', text: 'Connect past experiences to future goals', checked: true },
    { id: 'sg-4', text: 'Show your fit with the university', checked: true },
    { id: 'sg-5', text: 'Keep your tone genuine and hopeful', checked: true },
  ]);

  const toggleGuideline = (id: string) => {
    setGuidelines(prev => prev.map(g => g.id === id ? { ...g, checked: !g.checked } : g));
  };

  const activeDoc = sopDocuments.find(d => d.id === selectedDocId) || sopDocuments[0];
  const [currentText, setCurrentText] = useState(activeDoc?.currentDraft || '');

  const exportCurrentSop = () => {
    if (!activeDoc) return;
    const plainText = currentText.replace(/<[^>]*>/g, ' ').trim();
    const doc = `STATEMENT OF PURPOSE: ${activeDoc.title}\nTarget: ${activeDoc.targetUniversityOrProgram}\nLast Edited: ${sopDates[activeDoc.id] || lastEditedBannerDate}\n\n${plainText}\n`;
    const blob = new Blob([doc], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOP_${activeDoc.title.replace(/\s+/g, '_')}.txt`;
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
          <span className="text-stone-700 font-medium">SOP</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif tracking-tight">
          SOP
        </h1>
        <p className="text-sm text-stone-600 font-serif italic mt-0.5">
          Show the real you. Share your purpose.
        </p>
      </div>

      {/* Top Banner with Stats (Matches image_43a6a210.png) */}
      <div className="bg-[#3B302A] text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#29231E]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 max-w-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-[#D8C5AE]" />
            </div>
            <div>
              <p className="font-serif italic text-stone-200 text-sm sm:text-base leading-snug">
                &ldquo;Your Statement of Purpose is your chance to tell the world not just what you&apos;ve done, but why it matters.&rdquo;
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
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">3</span>
                <span className="text-[11px] text-stone-300 font-sans">SOP Drafts</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">1</span>
                <span className="text-[11px] text-stone-300 font-sans">Finalized</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[11px] text-stone-300 font-sans block">Last Edited</span>
                <EditableDate
                  value={lastEditedBannerDate}
                  onChange={setLastEditedBannerDate}
                  className="text-sm sm:text-base font-bold font-mono tracking-tight text-white hover:text-stone-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Row: My SOPs (Left) + SOP Writing Canvas (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: My SOPs List (4 cols) */}
        <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#3B302A]" />
              <h3 className="text-sm font-bold font-serif text-stone-900">
                My SOPs
              </h3>
            </div>
            <button 
              onClick={() => alert('SOP Catalog includes Common Statement, Engineering Focus, and University Honors Statements.')}
              className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 mt-2">
            {/* General SOP */}
            <div
              onClick={() => setSelectedDocId('sop-1')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedDocId === 'sop-1'
                  ? 'bg-white border-[#3B302A] shadow-xs ring-1 ring-[#3B302A]'
                  : 'bg-white/70 hover:bg-white border-[#EAE4DC]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-10 rounded-lg bg-stone-300 overflow-hidden shrink-0">
                  <img 
                    src="/assets/aistudio/image_73eb3f74.png" 
                    alt="Campus" 
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-serif text-stone-900">General SOP</h4>
                    <span className="text-[10px] font-mono font-bold text-stone-700 bg-stone-200 px-2 py-0.5 rounded-full">
                      Final Draft
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 font-sans mt-0.5">For overall applications</p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-stone-500">
                    <span>Last edited:</span>
                    <EditableDate
                      value={sopDates['sop-1']}
                      onChange={(val) => setSopDates(prev => ({ ...prev, 'sop-1': val }))}
                      className="text-stone-700 font-semibold"
                    />
                    <span>&bull; 1.2k words</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stanford SOP */}
            <div
              onClick={() => setSelectedDocId('sop-2')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedDocId === 'sop-2'
                  ? 'bg-white border-[#3B302A] shadow-xs ring-1 ring-[#3B302A]'
                  : 'bg-white/70 hover:bg-white border-[#EAE4DC]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-10 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center font-serif font-black text-rose-800 text-sm shrink-0">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-serif text-stone-900">Stanford SOP</h4>
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      In Progress
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 font-sans mt-0.5">For Stanford University</p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-stone-500">
                    <span>Last edited:</span>
                    <EditableDate
                      value={sopDates['sop-2']}
                      onChange={(val) => setSopDates(prev => ({ ...prev, 'sop-2': val }))}
                      className="text-stone-700 font-semibold"
                    />
                    <span>&bull; 1.1k words</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MIT SOP */}
            <div
              onClick={() => setSelectedDocId('sop-3')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedDocId === 'sop-3'
                  ? 'bg-white border-[#3B302A] shadow-xs ring-1 ring-[#3B302A]'
                  : 'bg-white/70 hover:bg-white border-[#EAE4DC]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-10 rounded-lg bg-stone-100 border border-stone-300 flex items-center justify-center font-mono font-black text-stone-900 text-xs shrink-0">
                  MIT
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-serif text-stone-900">MIT SOP</h4>
                    <span className="text-[10px] font-mono font-bold text-stone-600 bg-stone-200 px-2 py-0.5 rounded-full">
                      Draft
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 font-sans mt-0.5">For MIT</p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-stone-500">
                    <span>Last edited:</span>
                    <EditableDate
                      value={sopDates['sop-3']}
                      onChange={(val) => setSopDates(prev => ({ ...prev, 'sop-3': val }))}
                      className="text-stone-700 font-semibold"
                    />
                    <span>&bull; 980 words</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: SOP Writing Workspace (8 cols) */}
        <div className="lg:col-span-8 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE4DC]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#3B302A]" />
              <div className="flex items-center gap-1.5 font-serif font-bold text-base text-stone-900 cursor-pointer">
                <span>{activeDoc?.title || 'General SOP'}</span>
                <span className="text-xs text-stone-500">▾</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (activeDoc) {
                    updateSopDocument(activeDoc.id, { currentDraft: currentText });
                    saveSopDraft(activeDoc.id, 'Saved SOP snapshot');
                  }
                }}
                className="px-3.5 py-1.5 bg-[#3B302A] hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
              >
                Save
              </button>
              <button
                onClick={exportCurrentSop}
                className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-[#E2DBD1] text-stone-800 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
              <button className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-[#E2DBD1] text-stone-800 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full Screen</span>
              </button>
              <button className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded-lg cursor-pointer">
                <MoreHorizontal className="w-4 h-4" />
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

          {/* Writing Canvas */}
          <div className="min-h-[260px] p-4 bg-white rounded-xl border border-stone-200">
            <textarea
              rows={9}
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              className="w-full h-full bg-transparent font-serif text-sm text-stone-800 leading-relaxed border-none focus:outline-none resize-none"
              placeholder="Start writing your Statement of Purpose...&#10;Let your story shine."
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-stone-500 pt-2 border-t border-[#EAE4DC]">
            <span>
              {currentText.trim() ? currentText.trim().split(/\s+/).length : 0} words &bull; {currentText.length} characters
            </span>
            <span className="text-[11px] text-stone-400">Ready</span>
          </div>
        </div>

      </div>

      {/* Bottom Grid: 3 Cards matching image_43a6a210.png */}
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
              <button 
                onClick={() => alert('All past drafts are preserved for easy recovery.')}
                className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 relative pl-5 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-stone-300">
              {/* Final Draft */}
              <div className="relative">
                <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-stone-800 ring-2 ring-[#FAF8F5]" />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold font-serif text-stone-900">Final Draft</span>
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500">
                      <EditableDate
                        value={draftHistoryDates['hist-1']}
                        onChange={(val) => setDraftHistoryDates(prev => ({ ...prev, 'hist-1': val }))}
                        className="text-stone-600 font-semibold"
                      />
                      <span>&bull; 1.2k words</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Restored Final Draft version')}
                    className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-xs font-mono text-stone-800 cursor-pointer"
                  >
                    Restore
                  </button>
                </div>
              </div>

              {/* Improved Draft */}
              <div className="relative">
                <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-stone-400 ring-2 ring-[#FAF8F5]" />
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold font-serif text-stone-900 block">Improved Draft</span>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500">
                      <EditableDate
                        value={draftHistoryDates['hist-2']}
                        onChange={(val) => setDraftHistoryDates(prev => ({ ...prev, 'hist-2': val }))}
                        className="text-stone-600 font-semibold"
                      />
                      <span>&bull; 1.1k words</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Restored Improved Draft version')}
                    className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-xs font-mono text-stone-800 cursor-pointer"
                  >
                    Restore
                  </button>
                </div>
              </div>

              {/* First Draft */}
              <div className="relative">
                <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-stone-400 ring-2 ring-[#FAF8F5]" />
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold font-serif text-stone-900 block">First Draft</span>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500">
                      <EditableDate
                        value={draftHistoryDates['hist-3']}
                        onChange={(val) => setDraftHistoryDates(prev => ({ ...prev, 'hist-3': val }))}
                        className="text-stone-600 font-semibold"
                      />
                      <span>&bull; 980 words</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Restored First Draft version')}
                    className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-xs font-mono text-stone-800 cursor-pointer"
                  >
                    Restore
                  </button>
                </div>
              </div>
            </div>
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

          {/* Quill illustration */}
          <div className="pt-2 flex justify-end">
            <div className="w-24 h-16 opacity-80">
              <img 
                src="/assets/aistudio/image_c5b776f4.png" 
                alt="Quill pen" 
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Quote card with campus photo background (4 cols) */}
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

    </div>
  );
};
