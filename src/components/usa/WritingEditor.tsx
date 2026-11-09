import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Highlighter, 
  Maximize2, 
  Minimize2, 
  Save, 
  History, 
  Search, 
  Download, 
  Type, 
  RotateCcw,
  Check,
  AlertCircle
} from 'lucide-react';

interface WritingEditorProps {
  title?: string;
  content: string;
  onChange: (newContent: string) => void;
  onSaveDraft?: (notes?: string) => void;
  wordLimit?: number;
  placeholder?: string;
  draftCount?: number;
  onOpenHistory?: () => void;
  statusBadge?: string;
  readOnly?: boolean;
}

export const WritingEditor: React.FC<WritingEditorProps> = ({
  title,
  content,
  onChange,
  onSaveDraft,
  wordLimit,
  placeholder = 'Begin writing your thoughts, research, or essay drafts...',
  draftCount = 0,
  onOpenHistory,
  statusBadge,
  readOnly = false
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSerif, setFontSerif] = useState(true);
  const [draftNoteModal, setDraftNoteModal] = useState(false);
  const [draftNote, setDraftNote] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Sync content with contentEditable when prop changes from outside (e.g. restoring draft)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || '';
    }
  }, [content]);

  // Handle typing inside editor
  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  // Text formatting commands
  const applyFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Plain text calculations for metrics
  const getPlainText = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content || '';
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const plainText = getPlainText();
  const words = plainText.trim() ? plainText.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const charCount = plainText.length;
  const readingTimeMin = Math.ceil(wordCount / 200) || 1;

  const handleManualSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(draftNote.trim() || undefined);
      setDraftNote('');
      setDraftNoteModal(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const exportAsTxt = () => {
    const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || 'document'}-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isOverLimit = wordLimit ? wordCount > wordLimit : false;

  return (
    <div className={`flex flex-col bg-[#FAF8F5] border border-[#EAE6DE] rounded-2xl shadow-2xs transition-all ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-[#FAF8F5] p-6 sm:p-12 overflow-y-auto' : ''
    }`}>
      {/* Top Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-[#EAE6DE] bg-[#F4EFEA]/80 rounded-t-2xl">
        {/* Formatting Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => applyFormat('bold')}
            disabled={readOnly}
            className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
            title="Bold (Ctrl+B)"
            aria-label="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('italic')}
            disabled={readOnly}
            className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
            title="Italic (Ctrl+I)"
            aria-label="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('underline')}
            disabled={readOnly}
            className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
            title="Underline (Ctrl+U)"
            aria-label="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('strikeThrough')}
            disabled={readOnly}
            className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
            title="Strikethrough"
            aria-label="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-stone-300 mx-1" />

          <button
            type="button"
            onClick={() => applyFormat('formatBlock', '<h1>')}
            disabled={readOnly}
            className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
            title="Heading 1"
            aria-label="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('formatBlock', '<h2>')}
            disabled={readOnly}
            className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
            title="Heading 2"
            aria-label="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('formatBlock', '<h3>')}
            disabled={readOnly}
            className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
            title="Heading 3"
            aria-label="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-stone-300 mx-1" />

          <button
            type="button"
            onClick={() => applyFormat('insertUnorderedList')}
            disabled={readOnly}
            className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
            title="Bullet List"
            aria-label="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('insertOrderedList')}
            disabled={readOnly}
            className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
            title="Numbered List"
            aria-label="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('formatBlock', '<blockquote>')}
            disabled={readOnly}
            className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
            title="Quote"
            aria-label="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('hiliteColor', '#FCE7C8')}
            disabled={readOnly}
            className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
            title="Highlight in Warm Beige"
            aria-label="Highlight"
          >
            <Highlighter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('removeFormat')}
            disabled={readOnly}
            className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
            title="Clear Formatting"
            aria-label="Clear formatting"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Right Tools: Typography font switch, Search, History, Save Draft, Fullscreen */}
        <div className="flex items-center gap-2">
          {statusBadge && (
            <span className="text-[11px] font-mono text-stone-600 bg-stone-200/70 px-2 py-0.5 rounded-md">
              {statusBadge}
            </span>
          )}

          <button
            type="button"
            onClick={() => setFontSerif(!fontSerif)}
            className={`px-2 py-1 text-xs font-mono rounded-md border transition-colors cursor-pointer ${
              fontSerif 
                ? 'bg-[#EAE2D7] border-stone-400 text-stone-900 font-bold' 
                : 'bg-white/80 border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
            title="Toggle Serif / Sans Notebook Typography"
          >
            <Type className="w-3.5 h-3.5 inline mr-1" />
            {fontSerif ? 'Serif' : 'Sans'}
          </button>

          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
            title="Find in document"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={exportAsTxt}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
            title="Export as Text (.txt)"
            aria-label="Export"
          >
            <Download className="w-4 h-4" />
          </button>

          {onOpenHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="flex items-center gap-1 px-2 py-1 text-xs font-mono text-stone-700 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
              title="View Draft Version History"
            >
              <History className="w-3.5 h-3.5" />
              <span>{draftCount} {draftCount === 1 ? 'Draft' : 'Drafts'}</span>
            </button>
          )}

          {onSaveDraft && !readOnly && (
            <button
              type="button"
              onClick={() => setDraftNoteModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-mono font-medium transition-all cursor-pointer shadow-2xs"
              title="Save a snapshot draft version"
            >
              {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saveSuccess ? 'Saved' : 'Save Version'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Full Screen' : 'Distraction-free Full Screen'}
            aria-label="Toggle full screen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* In-Editor Search Bar */}
      {showSearch && (
        <div className="px-5 py-2 bg-stone-100 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-3.5 h-3.5 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within this notebook..."
            className="flex-1 bg-white border border-stone-300 rounded-md px-2.5 py-1 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-600"
          />
          {searchQuery && (
            <span className="text-[11px] font-mono text-stone-500">
              {plainText.toLowerCase().split(searchQuery.toLowerCase()).length - 1} matches
            </span>
          )}
          <button
            onClick={() => { setShowSearch(false); setSearchQuery(''); }}
            className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
          >
            Done
          </button>
        </div>
      )}

      {/* Editor Main Writing Surface */}
      <div className={`p-6 sm:p-10 flex-1 overflow-y-auto ${isFullscreen ? 'max-w-3xl mx-auto w-full' : 'min-h-[360px]'}`}>
        <div
          ref={editorRef}
          contentEditable={!readOnly}
          onInput={handleInput}
          data-placeholder={placeholder}
          className={`outline-none min-h-[300px] text-stone-900 leading-relaxed transition-all selection:bg-amber-100 selection:text-stone-900 ${
            fontSerif ? 'font-serif text-lg leading-[1.8]' : 'font-sans text-base leading-[1.7]'
          }`}
          style={{ whiteSpace: 'pre-wrap' }}
        />
      </div>

      {/* Word Count & Tabular Metrics Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-[#F4EFEA]/80 border-t border-[#EAE6DE] rounded-b-2xl text-xs font-mono text-stone-600 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-stone-800 tabular-nums">{wordCount}</span>
            <span>{wordCount === 1 ? 'word' : 'words'}</span>
          </div>
          <span className="text-stone-300">·</span>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-stone-800 tabular-nums">{charCount}</span>
            <span>characters</span>
          </div>
          <span className="text-stone-300">·</span>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-stone-800 tabular-nums">~{readingTimeMin}</span>
            <span>min read</span>
          </div>
        </div>

        {/* Word Limit Tracker (e.g. for Common App 650 words or Supplemental 250 words) */}
        {wordLimit && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span>Limit:</span>
              <span className={`font-semibold tabular-nums ${isOverLimit ? 'text-rose-600 font-bold' : 'text-stone-800'}`}>
                {wordCount} / {wordLimit} words
              </span>
              {isOverLimit && (
                <span className="flex items-center gap-1 text-[11px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                  <AlertCircle className="w-3 h-3" />
                  +{wordCount - wordLimit} over
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="w-24 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  isOverLimit ? 'bg-rose-500' : (wordCount / wordLimit > 0.85 ? 'bg-amber-500' : 'bg-stone-800')
                }`}
                style={{ width: `${Math.min(100, Math.round((wordCount / wordLimit) * 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Snapshot Note Modal */}
      {draftNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Save New Draft Version
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              This preserves the exact current state of your text without overwriting prior versions.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                Version Note / Revision Goal (Optional)
              </label>
              <input
                type="text"
                value={draftNote}
                onChange={(e) => setDraftNote(e.target.value)}
                placeholder="e.g. Expanded the conclusion, refined opening paragraph"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-black font-sans"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setDraftNoteModal(false)}
                className="px-3.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleManualSaveDraft}
                className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer"
              >
                Create Snapshot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
