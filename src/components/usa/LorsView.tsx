import React, { useState, useEffect } from 'react';
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
  Square,
  Building
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
    setActiveSubSection,
    universities
  } = useUsaApp();

  const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null);

  useEffect(() => {
    if (recommendationNotebooks.length > 0 && (!selectedNotebookId || !recommendationNotebooks.some(n => n.id === selectedNotebookId))) {
      setSelectedNotebookId(recommendationNotebooks[0].id);
    } else if (recommendationNotebooks.length === 0) {
      setSelectedNotebookId(null);
    }
  }, [recommendationNotebooks, selectedNotebookId]);

  // Guidelines checklist state
  const [guidelines, setGuidelines] = useState([
    { id: 'g1', text: 'Share a brag sheet with specific projects & awards', checked: false },
    { id: 'g2', text: 'Provide 2-3 specific classroom anecdotes to illustrate character', checked: false },
    { id: 'g3', text: 'Ask referees at least 4-6 weeks before early deadlines', checked: false },
    { id: 'g4', text: 'Confirm counselor and teacher Common App email invites', checked: false },
  ]);

  const toggleGuideline = (id: string) => {
    setGuidelines(prev => prev.map(g => g.id === id ? { ...g, checked: !g.checked } : g));
  };

  const [newLorModal, setNewLorModal] = useState(false);
  const [newTeacherForm, setNewTeacherForm] = useState({
    name: '',
    role: '',
    subject: '',
    institution: '',
    contextNotes: ''
  });

  // Active LOR
  const activeNotebook = recommendationNotebooks.find(n => n.id === selectedNotebookId);
  const [currentDraftText, setCurrentDraftText] = useState(activeNotebook?.currentDraft || '');

  useEffect(() => {
    if (activeNotebook) {
      setCurrentDraftText(activeNotebook.currentDraft || '');
    } else {
      setCurrentDraftText('');
    }
  }, [activeNotebook]);

  const handleCreateLor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherForm.name.trim()) return;
    const newId = addRecommendationNotebook({
      teacherName: newTeacherForm.name.trim(),
      position: newTeacherForm.role.trim() || 'Teacher',
      subject: newTeacherForm.subject.trim() || 'Academics',
      institution: newTeacherForm.institution.trim() || 'High School',
      relationshipDuration: '2 years',
      classesTaught: '',
      academicStrengths: '',
      personalObservations: '',
      relevantExperiences: '',
      projectsAndAchievements: '',
      leadershipExamples: '',
      specificAnecdotes: '',
      contextNotes: newTeacherForm.contextNotes.trim(),
      attachedDocuments: [],
      currentDraft: ''
    });
    setSelectedNotebookId(newId);
    setNewLorModal(false);
    setNewTeacherForm({ name: '', role: '', subject: '', institution: '', contextNotes: '' });
  };

  const exportAllLors = () => {
    let doc = `# LETTERS OF RECOMMENDATION DOSSIERS\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
    if (recommendationNotebooks.length === 0) {
      doc += `No recommenders logged yet.\n`;
    } else {
      recommendationNotebooks.forEach(nb => {
        doc += `## Recommender: ${nb.teacherName} (${nb.position}, ${nb.subject})\n`;
        doc += `Institution: ${nb.institution || 'N/A'}\n`;
        doc += `Anecdotes & Brag Sheet:\n${nb.specificAnecdotes || '(None added)'}\n\n`;
        doc += `Draft Recommendation / Points:\n${nb.currentDraft || '(Empty draft)'}\n\n---\n\n`;
      });
    }
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
            onClick={() => setActiveSubSection('dashboard')}
            className="hover:text-stone-900 cursor-pointer font-medium"
          >
            USA Application
          </button>
          <span>&gt;</span>
          <span className="text-stone-700 font-medium">Letters of Recommendation (LORs)</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif tracking-tight">
          Letters of Recommendation
        </h1>
        <p className="text-sm text-stone-600 font-serif italic mt-0.5">
          Organize referees, prepare teacher brag sheets, and track recommendation submissions.
        </p>
      </div>

      {/* Hero Banner with Stats (Dynamic) */}
      <div className="bg-[#3B302A] text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#29231E]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 max-w-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-6 h-6 text-[#D8C5AE]" />
            </div>
            <div>
              <p className="font-serif italic text-stone-200 text-sm sm:text-base leading-snug">
                &ldquo;A great letter speaks not just of your grades, but of your character, intellectual vitality, and collaborative spirit.&rdquo;
              </p>
              <span className="text-[11px] font-mono tracking-widest text-[#D8C5AE] uppercase mt-1 block">
                &mdash; COMEBACK
              </span>
            </div>
          </div>

          {/* Metric Pills */}
          <div className="flex flex-wrap items-center gap-6 lg:gap-8 border-t lg:border-t-0 lg:border-l border-white/15 pt-4 lg:pt-0 lg:pl-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <FileText className="w-5 h-5 text-[#D8C5AE]" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">
                  {recommendationNotebooks.length}
                </span>
                <span className="text-[11px] text-stone-300 font-sans">Total Referees</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <UserCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-mono tracking-tight block">
                  {Math.min(3, recommendationNotebooks.length)} / 3
                </span>
                <span className="text-[11px] text-stone-300 font-sans">Common App Slots</span>
              </div>
            </div>

            <button
              onClick={() => setNewLorModal(true)}
              className="px-4 py-2 bg-[#D8C5AE] hover:bg-white text-stone-900 font-mono text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              + Add Recommender
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recommender Notebooks List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  Recommenders ({recommendationNotebooks.length})
                </h3>
              </div>
              <button 
                onClick={() => setNewLorModal(true)}
                className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>+ Add</span>
              </button>
            </div>

            {recommendationNotebooks.length === 0 ? (
              <div className="py-8 text-center space-y-2 border border-dashed border-stone-300 rounded-xl p-4">
                <FileText className="w-8 h-8 text-stone-300 mx-auto" />
                <h4 className="text-xs font-serif font-bold text-stone-800">No recommenders added</h4>
                <p className="text-[11px] text-stone-500 font-sans">
                  Add 2 academic subject teachers (e.g. Math, Physics, Humanities) and 1 school counselor.
                </p>
                <button
                  onClick={() => setNewLorModal(true)}
                  className="px-3.5 py-1.5 bg-[#3B302A] text-white rounded-lg text-xs font-mono font-bold hover:bg-stone-900 cursor-pointer"
                >
                  + Add Recommender
                </button>
              </div>
            ) : (
              <div className="space-y-2 mt-3">
                {recommendationNotebooks.map(nb => {
                  const isSelected = selectedNotebookId === nb.id;
                  const initials = nb.teacherName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'TR';
                  return (
                    <div
                      key={nb.id}
                      onClick={() => setSelectedNotebookId(nb.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-[#3B302A] shadow-xs ring-1 ring-[#3B302A]'
                          : 'bg-white/70 hover:bg-white border-[#EAE4DC]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center font-bold text-stone-700 text-xs shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold font-serif text-stone-900 truncate">
                              {nb.teacherName}
                            </h4>
                            <p className="text-[10px] font-sans text-stone-500 truncate">
                              {nb.subject} &bull; {nb.position}
                            </p>
                          </div>
                        </div>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Remove ${nb.teacherName} from your LOR list?`)) {
                              deleteRecommendationNotebook(nb.id);
                            }
                          }}
                          className="text-stone-300 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] font-mono text-stone-500">
                        <span>Institution: {nb.institution || 'School'}</span>
                        <span className="text-[#3B302A] font-bold">
                          {nb.currentDraft?.trim() ? `${nb.currentDraft.trim().split(/\s+/).length} words` : 'No draft'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add New LOR Button */}
          <button
            onClick={() => setNewLorModal(true)}
            className="w-full py-3 border border-dashed border-stone-300 rounded-xl hover:border-stone-500 hover:bg-[#F4EFEA] transition-colors flex items-center justify-center gap-2 text-xs font-mono text-stone-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <div className="text-left">
              <span className="font-bold block">Add New Recommender</span>
              <span className="text-[10px] text-stone-500">Create brag sheet &amp; draft studio</span>
            </div>
          </button>
        </div>

        {/* Right Column: LOR Writing Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {!activeNotebook ? (
            <div className="bg-[#FAF8F5] border border-dashed border-[#EAE4DC] rounded-2xl p-12 text-center space-y-3">
              <FileCheck2 className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-base font-serif font-bold text-stone-800">
                No Recommender Selected
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Select a recommender from the list or add a new teacher to draft brag sheets and organize submission notes.
              </p>
              <button
                onClick={() => setNewLorModal(true)}
                className="px-5 py-2 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-bold hover:bg-stone-900 cursor-pointer"
              >
                + Add Recommender
              </button>
            </div>
          ) : (
            <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE4DC]">
                <div>
                  <h2 className="text-base font-bold font-serif text-stone-900">
                    {activeNotebook.teacherName} &mdash; Brag Sheet &amp; Draft
                  </h2>
                  <p className="text-xs text-stone-500 font-sans">
                    {activeNotebook.position} &bull; {activeNotebook.subject} &bull; {activeNotebook.institution}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      updateRecommendationNotebook(activeNotebook.id, { currentDraft: currentDraftText });
                      saveRecommendationDraft(activeNotebook.id, 'Saved snapshot');
                    }}
                    className="px-4 py-1.5 bg-[#3B302A] hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
                  >
                    Save Draft
                  </button>
                </div>
              </div>

              {/* Correlated College List selector */}
              {universities.length > 0 && (
                <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs font-mono flex items-center justify-between">
                  <span className="text-stone-600 font-semibold flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-stone-500" />
                    Target Colleges for this LOR:
                  </span>
                  <span className="text-[#3B302A] font-bold">
                    All {universities.length} Colleges on List
                  </span>
                </div>
              )}

              {/* Key Anecdotes & Accomplishments input */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 text-xs">
                <span className="font-bold text-stone-800 font-mono block">
                  Specific Class Anecdotes &amp; Brag Points for Teacher:
                </span>
                <textarea
                  rows={2}
                  value={activeNotebook.specificAnecdotes || ''}
                  onChange={(e) => updateRecommendationNotebook(activeNotebook.id, { specificAnecdotes: e.target.value })}
                  placeholder="e.g. Led independent research on kinetic dynamics; stayed after class to mentor peers in calculus..."
                  className="w-full p-2 bg-white border border-stone-200 rounded text-stone-800 font-sans focus:outline-none"
                />
              </div>

              {/* Lined Notebook Writing Canvas */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-stone-700 block">
                  Recommendation Letter Draft / Outline Points:
                </span>
                <div className="min-h-[240px] p-4 bg-white rounded-xl border border-stone-200">
                  <textarea
                    rows={10}
                    value={currentDraftText}
                    onChange={(e) => {
                      setCurrentDraftText(e.target.value);
                      updateRecommendationNotebook(activeNotebook.id, { currentDraft: e.target.value });
                    }}
                    className="w-full h-full bg-transparent font-serif text-sm text-stone-800 leading-relaxed border-none focus:outline-none resize-y"
                    placeholder="Write key recommendation points or draft letter context here...&#10;Focus on intellectual humility, classroom engagement, and unique impact."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-stone-500 pt-2 border-t border-[#EAE4DC]">
                <span>
                  {currentDraftText.trim() ? currentDraftText.trim().split(/\s+/).length : 0} words &bull; {currentDraftText.length} characters
                </span>
                <span className="text-[11px] text-stone-400">Autosaves</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Grid: Guidelines & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Guidelines */}
        <div className="lg:col-span-6 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3B302A]" />
              <h3 className="text-sm font-bold font-serif text-stone-900">
                LOR Guidelines &amp; Strategy Checklist
              </h3>
            </div>
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

        {/* Quick Actions */}
        <div className="lg:col-span-6 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-[#3B302A]" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  Export &amp; Preparation
                </h3>
              </div>
            </div>

            <p className="text-xs text-stone-600 font-sans mt-2">
              Generate a formatted briefing document containing all referee notes and brag sheets to email to your recommending teachers.
            </p>
          </div>

          <button
            onClick={exportAllLors}
            className="w-full py-2.5 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-medium hover:bg-stone-900 cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Referees Dossier (.md)</span>
          </button>
        </div>
      </div>

      {/* CREATE LOR MODAL */}
      {newLorModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-bold font-serif text-stone-900">Add Recommender Notebook</h3>
            <form onSubmit={handleCreateLor} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono font-medium text-stone-700 mb-1">Teacher / Mentor Name *</label>
                <input
                  type="text"
                  required
                  value={newTeacherForm.name}
                  onChange={(e) => setNewTeacherForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Dr. Jane Smith"
                  className="w-full px-3 py-2 border border-stone-300 bg-white rounded-xl text-stone-900"
                />
              </div>

              <div>
                <label className="block font-mono font-medium text-stone-700 mb-1">Subject / Discipline *</label>
                <input
                  type="text"
                  required
                  value={newTeacherForm.subject}
                  onChange={(e) => setNewTeacherForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="e.g. Higher Mathematics / Physics / Counselor"
                  className="w-full px-3 py-2 border border-stone-300 bg-white rounded-xl text-stone-900"
                />
              </div>

              <div>
                <label className="block font-mono font-medium text-stone-700 mb-1">Position / Title</label>
                <input
                  type="text"
                  value={newTeacherForm.role}
                  onChange={(e) => setNewTeacherForm(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g. Senior Faculty / Lab Head"
                  className="w-full px-3 py-2 border border-stone-300 bg-white rounded-xl text-stone-900"
                />
              </div>

              <div>
                <label className="block font-mono font-medium text-stone-700 mb-1">Institution</label>
                <input
                  type="text"
                  value={newTeacherForm.institution}
                  onChange={(e) => setNewTeacherForm(prev => ({ ...prev, institution: e.target.value }))}
                  placeholder="e.g. High School or Research Institute"
                  className="w-full px-3 py-2 border border-stone-300 bg-white rounded-xl text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setNewLorModal(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3B302A] text-white rounded-xl font-mono font-medium cursor-pointer"
                >
                  Create Notebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
