import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  ExternalLink, 
  Bookmark, 
  Check, 
  Plus, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  GraduationCap, 
  Building, 
  FileText, 
  Award, 
  Compass, 
  HelpCircle,
  Clock,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { AdmissionsInstructorMode, AdmissionsMessage } from '../../types/usaApp';

export const AdmissionsAiView: React.FC = () => {
  const {
    aiInstructorMode,
    setAiInstructorMode,
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
    universities,
    mainEssays,
    ecaActivities,
    sscArchive,
    hscArchive,
    satArchive,
    selectedUniversityId,
    setSelectedUniversityId,
    setActiveSubSection
  } = useUsaApp();

  const [inputMessage, setInputMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedVaultId, setSavedVaultId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isAiLoading]);

  const modes: { id: AdmissionsInstructorMode; label: string; icon: string; desc: string }[] = [
    { id: 'teach-me', label: 'Teach Me', icon: '🎓', desc: 'Holistic principles, testing, fundamentals' },
    { id: 'research-for-me', label: 'Research', icon: '🔍', desc: 'Live web grounding & official policy verification' },
    { id: 'review-my-work', label: 'Review', icon: '✍️', desc: 'Critical feedback on essays & student profile' },
    { id: 'plan-with-me', label: 'Plan', icon: '🧭', desc: 'Fall 2028 milestones & round strategy (ED vs EA vs RD)' },
    { id: 'explain-detail', label: 'Deep Detail', icon: '🔬', desc: 'CSS Profile, ISFAA, F-1 Visa, SSC/HSC context' }
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

  const researchCategories = [
    {
      title: 'Financial Aid & Full Rides',
      icon: '💵',
      queries: [
        'Which US universities offer full-ride need-blind aid to international students in Fall 2028?',
        'Explain the exact difference between CSS Profile and ISFAA for Bangladeshi applicants.',
        'What are the full tuition vs full cost merit scholarships available at top LACs?'
      ]
    },
    {
      title: 'Bangladesh SSC/HSC Evaluation',
      icon: '🇧🇩',
      queries: [
        'How do US admissions officers view Dhaka Board SSC GPA 5.00 and Golden A+?',
        'Does having a 4th subject in HSC Science hurt or help US holistic admissions?',
        'How should I explain the gap between HSC exams and Fall 2028 US entry?'
      ]
    },
    {
      title: 'Common App & Essays',
      icon: '📝',
      queries: [
        'What makes a standout Common App 650-word Personal Statement for an international STEM applicant?',
        'How should I brainstorm and structure my "Why This University" supplemental essays?',
        'Review my story bank hooks to see which connects strongest with US admissions'
      ]
    },
    {
      title: 'Admissions Rounds Strategy',
      icon: '🧭',
      queries: [
        'Should an international student needing significant financial aid apply Early Decision (ED)?',
        'Compare Restrictive Early Action (REA) at Stanford/Harvard vs Early Action (EA) at MIT',
        'How many reach, target, and safety colleges should be on my Fall 2028 list?'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-[#EAE6DE] rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xs shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-serif text-stone-900 tracking-tight">
                Admissions Intelligence Workspace
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase">
                Fall 2028 Target Cycle
              </span>
            </div>
            <p className="text-xs text-stone-600 font-sans mt-0.5">
              Personal research instructor, evidence-grounded policy verifier, and holistic application strategist.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-stone-700 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Search Grounded: Gemini 3.8 Flash</span>
          </div>
          <button
            onClick={() => createConversation()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Session</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Sessions Sidebar, Center Chat, Right Profile & Fast Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sessions List (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-[#EAE6DE] rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
                Research Sessions
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                {conversations.length} saved
              </span>
            </div>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {conversations.map(conv => {
                const isActive = conv.id === activeConversation?.id;
                return (
                  <div
                    key={conv.id}
                    className={`w-full group p-2.5 rounded-xl text-left transition-all border flex items-center justify-between gap-2 cursor-pointer ${
                      isActive 
                        ? 'bg-[#EAE2D7] border-stone-300 shadow-2xs text-stone-900 font-semibold' 
                        : 'bg-[#FAF8F5] border-stone-200 hover:bg-white text-stone-700'
                    }`}
                    onClick={() => setActiveConversationId(conv.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-serif truncate">{conv.title}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-mono text-stone-500">
                        <span>{conv.mode}</span>
                        <span>•</span>
                        <span>{conv.messages.length} msgs</span>
                      </div>
                    </div>
                    {conversations.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 rounded transition-opacity"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="bg-[#FAF8F5] border border-stone-200 rounded-2xl p-4 space-y-2.5 text-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
              Target Student Context
            </span>
            <div className="space-y-1.5 font-mono text-[11px] text-stone-700">
              <div className="flex justify-between">
                <span className="text-stone-500">Board:</span>
                <span className="font-bold">{sscArchive.board} Board (Science)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">SSC GPA:</span>
                <span className="font-bold">{sscArchive.gpa} (Golden A+)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Target SAT:</span>
                <span className="font-bold">{satArchive.targetTotalScore}+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Colleges List:</span>
                <span className="font-bold">{universities.length} universities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Interactive Chat Canvas (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col h-[750px] bg-white border border-[#EAE6DE] rounded-2xl shadow-2xs overflow-hidden">
          
          {/* Mode Switcher */}
          <div className="px-4 py-2.5 bg-[#FAF8F5] border-b border-stone-200 overflow-x-auto flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono uppercase text-stone-400 font-bold mr-1 shrink-0">
              Instructor Mode:
            </span>
            {modes.map(m => {
              const isActive = aiInstructorMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setAiInstructorMode(m.id)}
                  title={m.desc}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-stone-900 text-white shadow-2xs font-bold' 
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 select-text">
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
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 uppercase">
                        {msg.mode}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-stone-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div 
                    className={`p-4 rounded-2xl max-w-[90%] text-xs sm:text-sm leading-relaxed ${
                      isUser 
                        ? 'bg-stone-900 text-white rounded-tr-xs shadow-2xs' 
                        : 'bg-[#FAF8F5] border border-stone-200 text-stone-900 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <div className="prose prose-stone prose-xs sm:prose-sm max-w-none space-y-2 whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>

                    {/* Verified Grounding Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-stone-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-900">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                          <span>Official Fall 2028 Grounded Sources:</span>
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                          {msg.citations.map((cite, cIdx) => (
                            <a
                              key={cite.id || cIdx}
                              href={cite.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between gap-2 p-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 transition-colors group"
                            >
                              <span className="font-mono text-[11px] truncate">{cite.title}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-800 shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions Ribbon */}
                    {!isUser && (
                      <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] font-mono text-stone-500">
                        <div className="flex items-center gap-3">
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
                            className="inline-flex items-center gap-1 hover:text-stone-900 cursor-pointer"
                            title="Save verified insight to Research Vault"
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
                          {msg.searchQueries && msg.searchQueries.length > 0 ? '✓ Live Search Grounded' : 'Verified Admissions Fact'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isAiLoading && (
              <div className="flex flex-col items-start space-y-1.5 animate-pulse">
                <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">
                  Researching official admissions records...
                </span>
                <div className="p-4 bg-[#FAF8F5] border border-stone-200 rounded-2xl rounded-tl-xs text-xs text-stone-600 shadow-2xs flex items-center gap-2.5">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                  <span>Checking verified university sources and Common Data Set policies...</span>
                </div>
              </div>
            )}

            {aiError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Query encountered an error</p>
                  <p className="text-[11px] text-rose-700 mt-0.5">{aiError}</p>
                </div>
                <button onClick={clearAiError} className="text-xs text-rose-600 font-mono">✕</button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-4 bg-white border-t border-stone-200 shrink-0">
            <div className="relative flex items-end gap-2 bg-[#FAF8F5] border border-stone-300 rounded-2xl p-2.5 focus-within:ring-2 focus-within:ring-stone-800 focus-within:border-stone-800 transition-all">
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
                className="p-2.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-40 disabled:hover:bg-stone-900 transition-all cursor-pointer shrink-0 shadow-2xs"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-stone-400 px-1">
              <span>Press Enter to send (Shift + Enter for new line)</span>
              <span>Gemini 3.8 Flash • Google Search Grounding</span>
            </div>
          </div>

        </div>

        {/* Right Column: Research Topics & Fast Launch Prompts (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-[#EAE6DE] rounded-2xl p-4 shadow-2xs space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 block pb-1 border-b border-stone-100">
              Curated Research Starters
            </span>

            <div className="space-y-3">
              {researchCategories.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-stone-800">
                    <span>{cat.icon}</span>
                    <span>{cat.title}</span>
                  </div>
                  <div className="space-y-1">
                    {cat.queries.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => sendAiMessage(q)}
                        disabled={isAiLoading}
                        className="w-full p-2 bg-[#FAF8F5] hover:bg-[#F2ECE3] border border-stone-200/80 rounded-xl text-left text-[11px] text-stone-700 font-sans leading-tight transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
