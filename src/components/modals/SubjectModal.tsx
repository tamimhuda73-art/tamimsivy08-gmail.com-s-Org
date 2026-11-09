import React, { useState, useMemo } from 'react';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  Search, 
  CheckCheck, 
  Plus, 
  Trash2, 
  Clock, 
  ExternalLink,
  BookOpen,
  FileSpreadsheet
} from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { Chapter, ChapterStatus } from '../../types/tracker';

export const SubjectModal: React.FC = () => {
  const { 
    activeSubjectModal, 
    setActiveSubjectModal, 
    subjects,
    addChapterToPaper,
    deleteChapterFromPaper,
    toggleChapterInPaper,
    updateChapterDetailsInPaper,
    setAllChaptersInPaper,
    setActiveTab
  } = useTracker();

  const [searchQuery, setSearchQuery] = useState('');
  const [newChapterName, setNewChapterName] = useState('');
  const [activePaperId, setActivePaperId] = useState<string>('');

  if (!activeSubjectModal) return null;

  const currentSubject = subjects.find(s => s.id === activeSubjectModal.id) || activeSubjectModal;
  const papers = currentSubject.papers || [];

  // Active paper
  const selectedPaper = papers.find(p => p.id === activePaperId) || papers[0] || null;

  const totalSubjectChapters = currentSubject.totalChapters || 0;
  const completedSubjectChapters = currentSubject.completedChapters || 0;
  const percentage = totalSubjectChapters > 0 ? Math.round((completedSubjectChapters / totalSubjectChapters) * 100) : 0;

  const displayedChapters = (selectedPaper ? selectedPaper.chapters : currentSubject.chapters || []).filter(ch => 
    ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `chapter ${ch.chapterNumber}`.includes(searchQuery.toLowerCase())
  );

  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChapterName.trim() && selectedPaper) {
      addChapterToPaper(currentSubject.id, selectedPaper.id, newChapterName.trim());
      setNewChapterName('');
    }
  };

  const cycleStatus = (ch: Chapter) => {
    if (!selectedPaper) return;
    let nextStatus: ChapterStatus = 'IN PROGRESS';
    if (ch.status === 'IN PROGRESS') {
      nextStatus = 'COMPLETED';
    } else if (ch.status === 'COMPLETED' || ch.completed) {
      nextStatus = 'NOT STARTED';
    } else {
      nextStatus = 'IN PROGRESS';
    }
    updateChapterDetailsInPaper(currentSubject.id, selectedPaper.id, ch.id, {
      status: nextStatus,
      completed: nextStatus === 'COMPLETED'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl border border-[#D8C5AE] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EFE7DC] flex items-start justify-between bg-[#F8F6F2]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#59483D]" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#59483D] uppercase">
                CURRICULUM SYLLABUS BREAKDOWN
              </span>
            </div>
            
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-2xl font-bold font-serif text-[#292724]">
                {currentSubject.name}
              </h2>
              <span className="text-xs font-mono font-bold bg-[#EFE7DC] text-[#3B302A] px-2.5 py-0.5 rounded-full border border-[#D8C5AE]/60">
                {completedSubjectChapters}/{totalSubjectChapters} Ch ({percentage}%)
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveSubjectModal(null)}
            className="p-1.5 text-[#A99A8C] hover:text-[#292724] hover:bg-[#EFE7DC] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Sub-sections Selector Tabs (if more than 1 paper) */}
        {papers.length > 1 && (
          <div className="px-5 py-2.5 bg-[#F8F6F2] border-b border-[#EFE7DC] flex items-center gap-2 overflow-x-auto">
            {papers.map((paper) => {
              const isSelected = (selectedPaper?.id === paper.id);
              const pCount = paper.chapters.length;
              const pDone = paper.chapters.filter(c => c.completed || c.status === 'COMPLETED').length;
              const pPct = pCount > 0 ? Math.round((pDone / pCount) * 100) : 0;

              return (
                <button
                  key={paper.id}
                  onClick={() => setActivePaperId(paper.id)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5
                    ${isSelected 
                      ? 'bg-[#3B302A] text-white shadow-xs' 
                      : 'bg-white text-[#59483D] border border-[#D8C5AE]/60 hover:bg-[#EFE7DC]'}
                  `}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>{paper.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-[#59483D] text-white' : 'bg-[#EFE7DC] text-[#3B302A]'}`}>
                    {pDone}/{pCount} ({pPct}%)
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Action Bar: Search, Quick Add, Bulk Actions */}
        <div className="px-5 py-3 bg-white border-b border-[#EFE7DC] space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#A99A8C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search chapters..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE]/70 rounded-lg text-[#292724] placeholder-[#A99A8C] focus:outline-none focus:ring-1 focus:ring-[#3B302A]"
              />
            </div>

            {selectedPaper && (
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setAllChaptersInPaper(currentSubject.id, selectedPaper.id, true)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-[#3B302A] bg-[#EFE7DC] border border-[#D8C5AE] rounded-lg hover:bg-[#D8C5AE] transition-colors flex items-center gap-1 cursor-pointer font-mono"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-[#3B302A]" />
                  <span>Done All</span>
                </button>
                <button
                  onClick={() => setAllChaptersInPaper(currentSubject.id, selectedPaper.id, false)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-[#A99A8C] bg-[#F8F6F2] border border-[#D8C5AE]/40 rounded-lg hover:bg-[#EFE7DC] transition-colors cursor-pointer font-mono"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* Quick Add Chapter to Active Paper */}
          {selectedPaper && (
            <form onSubmit={handleAddChapter} className="flex gap-2">
              <input
                type="text"
                placeholder={`Add new chapter to ${selectedPaper.name}...`}
                value={newChapterName}
                onChange={(e) => setNewChapterName(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs font-mono bg-[#F8F6F2] border border-[#D8C5AE]/60 rounded-lg text-[#292724] placeholder-[#A99A8C] focus:outline-none focus:ring-1 focus:ring-[#3B302A]"
              />
              <button
                type="submit"
                disabled={!newChapterName.trim()}
                className="px-3 py-1.5 text-xs font-mono font-bold text-white bg-[#3B302A] hover:bg-[#59483D] disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </form>
          )}
        </div>

        {/* Chapters List */}
        <div className="p-5 overflow-y-auto divide-y divide-[#EFE7DC] max-h-[50vh] bg-white">
          {displayedChapters.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#A99A8C] font-mono space-y-1">
              <BookOpen className="w-6 h-6 mx-auto opacity-40 text-[#59483D]" />
              <p>No chapters match your query.</p>
            </div>
          ) : (
            displayedChapters.map((ch, idx) => {
              const isDone = ch.completed || ch.status === 'COMPLETED';
              const isInProg = ch.status === 'IN PROGRESS';

              return (
                <div
                  key={ch.id}
                  className="py-2.5 px-2 flex items-center justify-between hover:bg-[#F8F6F2] rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => selectedPaper && toggleChapterInPaper(currentSubject.id, selectedPaper.id, ch.id)}
                      className="cursor-pointer text-[#3B302A]"
                      title="Toggle complete"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[#3B302A] fill-[#EFE7DC]" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#A99A8C] group-hover:text-[#59483D]" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#A99A8C]">
                          CH {String(ch.chapterNumber || idx + 1).padStart(2, '0')}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => cycleStatus(ch)}
                          className={`
                            text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border cursor-pointer
                            ${isDone 
                              ? 'bg-[#3B302A] text-white border-[#3B302A]' 
                              : isInProg 
                                ? 'bg-[#D8C5AE] text-[#292724] border-[#D8C5AE]' 
                                : 'bg-[#F8F6F2] text-[#A99A8C] border-[#D8C5AE]/40'}
                          `}
                          title="Click to cycle status"
                        >
                          {isDone ? 'COMPLETED' : isInProg ? 'IN PROGRESS' : 'NOT STARTED'}
                        </button>

                        {ch.completionDate && (
                          <span className="text-[9px] font-mono text-[#59483D] flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {ch.completionDate}
                          </span>
                        )}
                      </div>

                      <p className={`text-xs mt-0.5 font-medium leading-snug truncate ${isDone ? 'line-through text-[#A99A8C]' : 'text-[#292724]'}`}>
                        {ch.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {selectedPaper && (
                      <button
                        onClick={() => deleteChapterFromPaper(currentSubject.id, selectedPaper.id, ch.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#A99A8C] hover:text-red-700 rounded transition-opacity"
                        title="Delete chapter"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8F6F2] border-t border-[#EFE7DC] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              setActiveSubjectModal(null);
              setActiveTab('subjects');
            }}
            className="text-xs font-mono font-semibold text-[#59483D] hover:text-[#292724] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open in Full Subject Progress View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveSubjectModal(null)}
            className="px-4 py-1.5 bg-[#3B302A] text-white text-xs font-mono font-semibold rounded-lg hover:bg-[#59483D] transition-colors cursor-pointer w-full sm:w-auto"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
