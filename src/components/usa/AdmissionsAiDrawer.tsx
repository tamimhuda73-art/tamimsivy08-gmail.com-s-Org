import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  ExternalLink, 
  Bookmark, 
  Check, 
  Maximize2, 
  Trash2, 
  Plus, 
  Compass, 
  Search, 
  BookOpen, 
  CheckCircle2, 
  Info,
  RefreshCw,
  Copy,
  AlertCircle
} from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { AdmissionsInstructorMode, AdmissionsMessage } from '../../types/usaApp';

export const AdmissionsAiDrawer: React.FC = () => {
  const {
    isAiDrawerOpen,
    closeAiDrawer,
    aiInstructorMode,
    setAiInstructorMode,
    aiContextPackage,
    clearAiContextPackage,
    conversations,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    deleteConversation,
    sendAiMessage,
    isAiLoading,
    aiError,
    clearAiError,
    saveAiInsightToVault,
    setActiveSubSection,
    selectedUniversityId,
    universities,
    activeMainEssayId,
    mainEssays
  } = useUsaApp();

  const [inputMessage, setInputMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedVaultId, setSavedVaultId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];

  useEffect(() => {
    if (isAiDrawerOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isAiDrawerOpen, activeConversation?.messages, isAiLoading]);

  if (!isAiDrawerOpen) return null;

  const currentUniv = selectedUniversityId ? universities.find(u => u.id === selectedUniversityId) : null;
  const currentEssay = activeMainEssayId ? mainEssays.find(e => e.id === activeMainEssayId) : null;

  const modes: { id: AdmissionsInstructorMode; label: string; icon: string; desc: string }[] = [
    { id: 'teach-me', label: 'Teach Me', icon: '🎓', desc: 'Holistic principles, testing, fundamentals' },
    { id: 'research-for-me', label: 'Research', icon: '🔍', desc: 'Live web grounding & policy verification' },
    { id: 'review-my-work', label: 'Review', icon: '✍️', desc: 'Critical feedback on essays & profile' },
    { id: 'plan-with-me', label: 'Plan', icon: '🧭', desc: 'Fall 2028 milestones & round strategy' },
    { id: 'explain-detail', label: 'Deep Detail', icon: '🔬', desc: 'CSS Profile, ISFAA, F-1 Visa, SSC/HSC' }
  ];

  const quickPrompts = [
    ...(currentUniv ? [
      `What are the verified Fall 2028 international financial aid policies for ${currentUniv.name}?`,
      `Evaluate my profile fit for ${currentUniv.name} (${currentUniv.intendedMajor || 'Major'})`,
      `Does ${currentUniv.name} accept the CSS Profile or ISFAA for Bangladeshi applicants?`
    ] : [
      'What are the 100% full-ride need-blind universities for international students in Fall 2028?',
      'How do top US colleges evaluate Bangladesh SSC & HSC GPA within national context?',
      'Review my Common App Personal Essay strategy and brainstorming hooks',
      'Explain ED vs EA vs RD advantages and binding rules for international applicants'
    ])
  ];

  const handleSend = () => {
    if (!inputMessage.trim() || isAiLoading) return;
    const msg = inputMessage;
    setInputMessage('');
    sendAiMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToVault = (msg: AdmissionsMessage) => {
    const titleSnippet = msg.content.split('\n')[0].replace(/[#*`_]/g, '').slice(0, 60);
    const sourceUrl = msg.citations && msg.citations.length > 0 ? msg.citations[0].uri : '';
    saveAiInsightToVault(
      titleSnippet || 'Verified Admissions Intelligence Fact',
      msg.content,
      'University Research',
      sourceUrl
    );
    setSavedVaultId(msg.id);
    setTimeout(() => setSavedVaultId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div 
        onClick={closeAiDrawer}
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* Drawer Container */}
      <aside className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-xl sm:max-w-2xl bg-[#FAF8F5] border-l border-stone-200 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 bg-white/95 backdrop-blur-xs flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-stone-900 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold font-serif text-stone-900 tracking-tight">
                    Admissions Intelligence
                  </h2>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
                    Fall 2028
                  </span>
                </div>
                <p className="text-[11px] font-mono text-stone-500">
                  Personal USA Admissions Instructor & Researcher
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  closeAiDrawer();
                  setActiveSubSection('admissions-ai');
                }}
                className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                title="Expand to Full Workspace"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => createConversation()}
                className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                title="Start New Session"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={closeAiDrawer}
                className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer ml-1"
                title="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mode Selector Ribbon */}
          <div className="px-4 py-2 bg-[#F3EFEA] border-b border-stone-200/80 overflow-x-auto shrink-0 flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase text-stone-400 font-bold mr-1 shrink-0">
              Mode:
            </span>
            {modes.map(m => {
              const isActive = aiInstructorMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setAiInstructorMode(m.id)}
                  title={m.desc}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-stone-900 text-white shadow-2xs font-bold' 
                      : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200/60'
                  }`}
                >
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Attached Context Chips Bar */}
          {(currentUniv || currentEssay || aiContextPackage) && (
            <div className="px-4 py-1.5 bg-amber-50/70 border-b border-amber-200/50 flex flex-wrap items-center gap-1.5 text-xs font-mono text-amber-900">
              <span className="text-[10px] uppercase font-bold text-amber-700">Active Context:</span>
              
              {currentUniv && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-amber-200 text-[11px] shadow-2xs">
                  🏛️ {currentUniv.name}
                </span>
              )}

              {currentEssay && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-amber-200 text-[11px] shadow-2xs">
                  📝 {currentEssay.title}
                </span>
              )}

              {aiContextPackage?.selectedUniversityName && !currentUniv && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-amber-200 text-[11px] shadow-2xs">
                  🏛️ {aiContextPackage.selectedUniversityName}
                </span>
              )}

              <button
                onClick={clearAiContextPackage}
                className="text-[10px] text-amber-700 hover:text-amber-950 underline ml-auto cursor-pointer"
                title="Clear attached custom context"
              >
                Clear
              </button>
            </div>
          )}

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 select-text">
            {activeConversation?.messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={msg.id || index}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[10px] font-mono font-bold text-stone-400 uppercase">
                      {isUser ? 'You' : 'Admissions Instructor'}
                    </span>
                    {msg.mode && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-stone-200 text-stone-600 uppercase">
                        {msg.mode}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-stone-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div 
                    className={`p-3.5 sm:p-4 rounded-2xl max-w-[90%] sm:max-w-[85%] text-xs sm:text-sm leading-relaxed ${
                      isUser 
                        ? 'bg-stone-900 text-white rounded-tr-xs shadow-2xs' 
                        : 'bg-white border border-stone-200 text-stone-900 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {/* Render message body */}
                    <div className="prose prose-stone prose-xs sm:prose-sm max-w-none space-y-2 whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>

                    {/* Grounding Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-stone-100 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-900">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                          <span>Verified Live Sources (Fall 2028 Grounding):</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          {msg.citations.map((cite, cIdx) => (
                            <a
                              key={cite.id || cIdx}
                              href={cite.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between gap-2 p-1.5 bg-[#FAF8F5] hover:bg-[#F2ECE3] border border-stone-200 rounded-lg text-xs text-stone-800 transition-colors group"
                            >
                              <span className="font-mono text-[11px] truncate">{cite.title}</span>
                              <ExternalLink className="w-3 h-3 text-stone-400 group-hover:text-stone-800 shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assistant Action Ribbon */}
                    {!isUser && (
                      <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono text-stone-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="inline-flex items-center gap-1 hover:text-stone-900 cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleSaveToVault(msg)}
                            className="inline-flex items-center gap-1 hover:text-stone-900 cursor-pointer ml-2"
                            title="Save verified note directly to Research Vault"
                          >
                            {savedVaultId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-purple-600" />
                                <span className="text-purple-700">Saved to Vault</span>
                              </>
                            ) : (
                              <>
                                <Bookmark className="w-3 h-3" />
                                <span>Save to Vault</span>
                              </>
                            )}
                          </button>
                        </div>

                        <span className="text-[10px] text-stone-400">
                          {msg.searchQueries && msg.searchQueries.length > 0 ? '✓ Live Grounded' : 'Official Policy'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isAiLoading && (
              <div className="flex flex-col items-start space-y-1.5 animate-pulse">
                <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">
                  Researching official admissions records...
                </span>
                <div className="p-3.5 bg-white border border-stone-200 rounded-2xl rounded-tl-xs text-xs text-stone-600 shadow-2xs flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span>Cross-referencing Fall 2028 policies, CDS, and financial aid rules...</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {aiError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Query encountered an issue</p>
                  <p className="text-[11px] text-rose-700 mt-0.5">{aiError}</p>
                </div>
                <button 
                  onClick={clearAiError} 
                  className="text-xs text-rose-600 hover:text-rose-900 cursor-pointer font-mono"
                >
                  ✕
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="px-4 py-2 border-t border-stone-200/80 bg-[#FAF8F5] overflow-x-auto shrink-0 flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-stone-400 uppercase font-bold shrink-0">
              Suggested:
            </span>
            {quickPrompts.slice(0, 3).map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => sendAiMessage(prompt)}
                disabled={isAiLoading}
                className="text-[11px] font-sans px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-stone-700 whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
              >
                {prompt.length > 40 ? prompt.slice(0, 40) + '...' : prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-white border-t border-stone-200 shrink-0">
            <div className="relative flex items-end gap-2 bg-[#FAF8F5] border border-stone-300 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-stone-800 focus-within:border-stone-800 transition-all">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask Admissions Instructor (${aiInstructorMode.toUpperCase()})...`}
                rows={2}
                disabled={isAiLoading}
                className="w-full bg-transparent text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none resize-none font-sans px-1"
              />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim() || isAiLoading}
                className="p-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-40 disabled:hover:bg-stone-900 transition-all cursor-pointer shrink-0 shadow-2xs"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-stone-400 px-1">
              <span>Shift + Enter for new line</span>
              <span>Gemini 3.8 Flash • Google Search Grounding</span>
            </div>
          </div>

        </div>
      </aside>
    </div>
  );
};
