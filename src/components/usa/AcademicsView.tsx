import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Plus, 
  Trash2, 
  FileText, 
  ExternalLink, 
  Check, 
  Calendar, 
  TrendingUp, 
  FileCheck,
  Headphones,
  Calculator,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  Sparkles,
  Edit2,
  Share2
} from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { 
  SatScoreRecord, 
  EnglishTestRecord, 
  BangladeshAdmissionNotebookEntry,
  HscSubjectMark,
  SscSubjectMark
} from '../../types/usaApp';
import { EditableDate } from './EditableDate';

type AcademicSubTab = 'overview' | 'sat' | 'hsc' | 'ssc' | 'english' | 'bd-admission';

export const AcademicsView: React.FC = () => {
  const { 
    satArchive, 
    updateSatArchive, 
    addSatScoreRecord, 
    deleteSatScoreRecord,
    hscArchive, 
    updateHscArchive,
    sscArchive,
    updateSscArchive,
    updateSscSubject,
    addSscSubject,
    deleteSscSubject,
    englishTestRecords, 
    addEnglishTestRecord, 
    deleteEnglishTestRecord,
    updateEnglishTestRecord,
    bangladeshAdmissionEntries, 
    addBangladeshAdmissionEntry, 
    updateBangladeshAdmissionEntry, 
    deleteBangladeshAdmissionEntry 
  } = useUsaApp();

  const [activeTab, setActiveTab] = useState<AcademicSubTab>('overview');

  // SAT Modal
  const [newSatModal, setNewSatModal] = useState(false);
  const [satForm, setSatForm] = useState({
    testType: 'Practice Test' as const,
    testDate: '2025-08-24',
    readingWritingScore: 760,
    mathScore: 760,
    scoreReportUrl: '',
    scoreReportFileName: '',
    preparationNotes: '',
    weakAreas: '',
    improvementObservations: ''
  });

  // English Test Modal
  const [newEnglishModal, setNewEnglishModal] = useState(false);
  const [englishForm, setEnglishForm] = useState({
    testType: 'IELTS Academic' as const,
    testDate: '2025-06-15',
    overallScore: '8.0',
    readingScore: '8.0',
    listeningScore: '8.5',
    writingScore: '7.5',
    speakingScore: '8.0',
    targetScore: '8.5',
    scoreReportUrl: '',
    scoreReportFileName: '',
    notes: ''
  });

  // Bangladesh Admission Test Entry Modal
  const [newBdModal, setNewBdModal] = useState(false);
  const [bdForm, setBdForm] = useState({
    targetInstitution: '',
    preparationNotes: '',
    importantDates: '',
    examExperience: '',
    resultsOrExpectations: '',
    reflections: ''
  });

  // SSC Subject Modal
  const [newSscSubjectModal, setNewSscSubjectModal] = useState(false);
  const [sscSubForm, setSscSubForm] = useState({
    subjectCode: '',
    subjectName: '',
    theoryMarks: '85',
    practicalMarks: '',
    mcqMarks: '25',
    totalMarks: '90',
    grade: 'A+',
    gradePoint: '5.00'
  });

  // Handling SAT submit
  const handleSaveSat = (e: React.FormEvent) => {
    e.preventDefault();
    const rw = Number(satForm.readingWritingScore) || 0;
    const math = Number(satForm.mathScore) || 0;
    addSatScoreRecord({
      testType: satForm.testType,
      testDate: satForm.testDate,
      readingWritingScore: rw,
      mathScore: math,
      totalScore: rw + math,
      scoreReportUrl: satForm.scoreReportUrl.trim() || undefined,
      scoreReportFileName: satForm.scoreReportFileName.trim() || undefined,
      preparationNotes: satForm.preparationNotes.trim(),
      weakAreas: satForm.weakAreas.trim(),
      improvementObservations: satForm.improvementObservations.trim()
    });
    setNewSatModal(false);
  };

  // Handling English test submit
  const handleSaveEnglish = (e: React.FormEvent) => {
    e.preventDefault();
    addEnglishTestRecord({
      testType: englishForm.testType,
      testDate: englishForm.testDate,
      overallScore: englishForm.overallScore.trim(),
      readingScore: englishForm.readingScore.trim(),
      writingScore: englishForm.writingScore.trim(),
      listeningScore: englishForm.listeningScore.trim(),
      speakingScore: englishForm.speakingScore.trim(),
      targetScore: englishForm.targetScore.trim(),
      scoreReportUrl: englishForm.scoreReportUrl.trim() || undefined,
      scoreReportFileName: englishForm.scoreReportFileName.trim() || undefined,
      notes: englishForm.notes.trim()
    });
    setNewEnglishModal(false);
  };

  // Handling BD admission submit
  const handleSaveBd = (e: React.FormEvent) => {
    e.preventDefault();
    addBangladeshAdmissionEntry({
      targetInstitution: bdForm.targetInstitution.trim(),
      preparationNotes: bdForm.preparationNotes.trim(),
      importantDates: bdForm.importantDates.trim(),
      examExperience: bdForm.examExperience.trim(),
      resultsOrExpectations: bdForm.resultsOrExpectations.trim(),
      reflections: bdForm.reflections.trim()
    });
    setNewBdModal(false);
    setBdForm({
      targetInstitution: '',
      preparationNotes: '',
      importantDates: '',
      examExperience: '',
      resultsOrExpectations: '',
      reflections: ''
    });
  };

  // Handling SSC Subject submit
  const handleSaveSscSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sscSubForm.subjectName.trim()) return;
    addSscSubject({
      subjectCode: sscSubForm.subjectCode.trim() || 'N/A',
      subjectName: sscSubForm.subjectName.trim(),
      theoryMarks: sscSubForm.theoryMarks.trim() || undefined,
      practicalMarks: sscSubForm.practicalMarks.trim() || undefined,
      mcqMarks: sscSubForm.mcqMarks.trim() || undefined,
      totalMarks: sscSubForm.totalMarks.trim() || undefined,
      grade: sscSubForm.grade.trim() || 'A+',
      gradePoint: sscSubForm.gradePoint.trim() || '5.00'
    });
    setNewSscSubjectModal(false);
    setSscSubForm({
      subjectCode: '',
      subjectName: '',
      theoryMarks: '85',
      practicalMarks: '',
      mcqMarks: '25',
      totalMarks: '90',
      grade: 'A+',
      gradePoint: '5.00'
    });
  };

  const latestSat = satArchive.records[0] || {
    totalScore: 1520,
    readingWritingScore: 760,
    mathScore: 760,
    testDate: '2025-08-24'
  };

  const latestIelts = englishTestRecords[0] || {
    overallScore: '8.0',
    readingScore: '8.0',
    writingScore: '7.5',
    listeningScore: '8.5',
    speakingScore: '8.0',
    testDate: '2025-06-15'
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1720px] mx-auto space-y-6 text-[#292724]">
      {/* Collegiate Heritage Banner matching screenshots */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#29231E] via-[#3B302A] to-[#4E3F35] text-[#F8F6F2] p-6 lg:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#D8C5AE] mb-1">
              <span>USA Application</span>
              <span>›</span>
              <span className="text-white font-semibold">Academics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
              Academics
            </h1>
            <p className="text-[#D8C5AE] text-sm mt-1 font-serif italic">
              Track your academic journey. Achieve higher.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-black/25 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10">
            <span className="text-xs font-mono text-[#D8C5AE]">CYCLE:</span>
            <span className="text-xs font-mono font-bold text-white">FALL 2028 ADMISSION</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs matching image_d5a94083.png */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#EAE4DC]">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'sat', label: 'SAT', icon: Calculator },
          { id: 'hsc', label: 'HSC', icon: BookOpen },
          { id: 'ssc', label: 'SSC', icon: GraduationCap },
          { id: 'english', label: 'IELTS / TOEFL', icon: Headphones },
          { id: 'bd-admission', label: 'Bangladesh Admission Tests', icon: Award }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AcademicSubTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#3B302A] text-white shadow-xs'
                  : 'bg-white hover:bg-[#F2ECE4] text-[#59483D] border border-[#EAE4DC]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D8C5AE]' : 'text-[#7D6E63]'}`} />
              <span>{tab.label}</span>
              {tab.id === 'ssc' && (
                <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-[#EFE7DC] text-[#3B302A] font-mono">
                  Golden A+
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW (Matching image_d5a94083.png)                             */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 5 Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 1. SAT Card */}
            <div className="bg-white rounded-2xl border border-[#EAE4DC] p-4.5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#3B302A]">
                    <Calculator className="w-3.5 h-3.5 text-[#59483D]" />
                    SAT
                  </span>
                  <button 
                    onClick={() => setActiveTab('sat')}
                    className="text-[11px] font-mono text-[#59483D] hover:text-black font-semibold cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>

                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
                    {latestSat.totalScore}
                  </span>
                  <span className="text-xs font-mono text-stone-500">/ 1600</span>
                  <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EFE7DC] text-[#3B302A]">
                    Top 1%
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-[11px] font-mono text-stone-600">
                  <div className="flex justify-between">
                    <span>Reading & Writing</span>
                    <span className="font-bold text-stone-900">{latestSat.readingWritingScore}</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-[#59483D] h-full rounded-full"
                      style={{ width: `${(latestSat.readingWritingScore / 800) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>Math</span>
                    <span className="font-bold text-stone-900">{latestSat.mathScore}</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-[#3B302A] h-full rounded-full"
                      style={{ width: `${(latestSat.mathScore / 800) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 text-[11px] font-mono text-stone-500 flex items-center justify-between">
                <span>Test Date:</span>
                <EditableDate 
                  value={latestSat.testDate}
                  onSave={(newDate) => {
                    if (satArchive.records[0]) {
                      const updated = [...satArchive.records];
                      updated[0] = { ...updated[0], testDate: newDate };
                      updateSatArchive({ records: updated });
                    }
                  }}
                  displayMode="badge"
                />
              </div>
            </div>

            {/* 2. HSC Card */}
            <div className="bg-white rounded-2xl border border-[#EAE4DC] p-4.5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#3B302A]">
                    <BookOpen className="w-3.5 h-3.5 text-[#59483D]" />
                    HSC
                  </span>
                  <button 
                    onClick={() => setActiveTab('hsc')}
                    className="text-[11px] font-mono text-[#59483D] hover:text-black font-semibold cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>

                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
                    {hscArchive.hscTargetGpa}
                  </span>
                  <span className="text-xs font-mono text-stone-500">/ 5.00</span>
                  <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EFE7DC] text-[#3B302A]">
                    GPA
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-[11px] font-mono text-stone-600">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Result Year:</span>
                    <EditableDate 
                      value={hscArchive.hscPassingYear}
                      onSave={(newYear) => updateHscArchive({ hscPassingYear: newYear })}
                      displayMode="compact"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Board:</span>
                    <span className="font-semibold text-stone-800">{hscArchive.hscBoard}</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden mt-2">
                    <div className="bg-[#3B302A] h-full rounded-full w-full" />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 text-[11px] font-mono text-stone-500 flex items-center justify-between">
                <span>Exam Date:</span>
                <EditableDate 
                  value={hscArchive.hscExamDate || '2026-06-30'}
                  onSave={(newDate) => updateHscArchive({ hscExamDate: newDate })}
                  displayMode="compact"
                />
              </div>
            </div>

            {/* 3. SSC Card (Separate and Dedicated!) */}
            <div className="bg-white rounded-2xl border border-[#D8C5AE] p-4.5 shadow-2xs space-y-3 flex flex-col justify-between ring-1 ring-[#D8C5AE]/50">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#3B302A]">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                    SSC
                  </span>
                  <button 
                    onClick={() => setActiveTab('ssc')}
                    className="text-[11px] font-mono text-[#59483D] hover:text-black font-semibold cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>

                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
                    {sscArchive.gpa}
                  </span>
                  <span className="text-xs font-mono text-stone-500">/ 5.00</span>
                  <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900">
                    Golden A+
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-[11px] font-mono text-stone-600">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Passing Year:</span>
                    <EditableDate 
                      value={sscArchive.passingYear}
                      onSave={(newYear) => updateSscArchive({ passingYear: newYear })}
                      displayMode="compact"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Board:</span>
                    <span className="font-semibold text-stone-800">{sscArchive.board}</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden mt-2">
                    <div className="bg-amber-700 h-full rounded-full w-full" />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 text-[11px] font-mono text-stone-500 flex items-center justify-between">
                <span>Result Date:</span>
                <EditableDate 
                  value={sscArchive.resultPublishDate}
                  onSave={(newDate) => updateSscArchive({ resultPublishDate: newDate })}
                  displayMode="compact"
                />
              </div>
            </div>

            {/* 4. IELTS / TOEFL Card */}
            <div className="bg-white rounded-2xl border border-[#EAE4DC] p-4.5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#3B302A]">
                    <Headphones className="w-3.5 h-3.5 text-[#59483D]" />
                    IELTS / TOEFL
                  </span>
                  <button 
                    onClick={() => setActiveTab('english')}
                    className="text-[11px] font-mono text-[#59483D] hover:text-black font-semibold cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>

                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
                    {latestIelts.overallScore}
                  </span>
                  <span className="text-xs font-mono text-stone-500">/ 9.0</span>
                  <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EFE7DC] text-[#3B302A]">
                    Target Achieved
                  </span>
                </div>

                <div className="mt-2.5 text-[10px] font-mono text-stone-600 flex items-center justify-between">
                  <span>L: <b className="text-stone-900">{latestIelts.listeningScore}</b></span>
                  <span>R: <b className="text-stone-900">{latestIelts.readingScore}</b></span>
                  <span>W: <b className="text-stone-900">{latestIelts.writingScore}</b></span>
                  <span>S: <b className="text-stone-900">{latestIelts.speakingScore}</b></span>
                </div>

                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden mt-2">
                  <div className="bg-[#59483D] h-full rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 text-[11px] font-mono text-stone-500 flex items-center justify-between">
                <span>Test Date:</span>
                <EditableDate 
                  value={latestIelts.testDate}
                  onSave={(newDate) => {
                    if (englishTestRecords[0]) {
                      updateEnglishTestRecord(englishTestRecords[0].id, { testDate: newDate });
                    }
                  }}
                  displayMode="badge"
                />
              </div>
            </div>

            {/* 5. Bangladesh Admission Tests Card */}
            <div className="bg-white rounded-2xl border border-[#EAE4DC] p-4.5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#3B302A]">
                    <Award className="w-3.5 h-3.5 text-[#59483D]" />
                    BD Admission Tests
                  </span>
                  <button 
                    onClick={() => setActiveTab('bd-admission')}
                    className="text-[11px] font-mono text-[#59483D] hover:text-black font-semibold cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>

                <div className="mt-3">
                  <span className="text-xl font-serif font-bold text-amber-800">
                    Pending / Active
                  </span>
                  <p className="text-[11px] text-stone-500 font-serif mt-1">
                    BUET, DU Ka Unit & IBA
                  </p>
                </div>

                <div className="mt-2 space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-stone-600">
                    <span>BUET Prep:</span>
                    <span className="font-semibold text-stone-900">In Progress</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>DU Science:</span>
                    <span className="font-semibold text-stone-900">Jan 2027</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setNewBdModal(true)}
                className="w-full py-1.5 bg-[#F2ECE4] hover:bg-[#EAE2D7] text-stone-800 text-xs font-mono font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>+ Add Result</span>
              </button>
            </div>
          </div>

          {/* Performance Overview & Academic Records Grid matching screenshot */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Performance Overview Graph (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#3B302A]" />
                  <h3 className="text-sm font-bold font-serif text-stone-900">
                    Performance Overview
                  </h3>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-stone-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3B302A]" />
                    Your Score
                  </span>
                  <span className="flex items-center gap-1.5 text-stone-400">
                    <span className="w-2.5 h-0.5 border-t border-dashed border-stone-400" />
                    Target
                  </span>
                  <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[11px]">
                    All Time
                  </span>
                </div>
              </div>

              {/* Styled Metric Trend Line */}
              <div className="h-44 relative flex items-end justify-between px-6 pb-6 pt-4 border-b border-stone-100">
                {/* Horizontal reference lines */}
                <div className="absolute inset-x-6 top-8 border-b border-dashed border-stone-200" />
                <div className="absolute inset-x-6 top-20 border-b border-dashed border-stone-200" />
                <div className="absolute inset-x-6 top-32 border-b border-dashed border-stone-100" />

                {/* SVG Curve Line */}
                <svg className="absolute inset-x-6 inset-y-4 w-[calc(100%-3rem)] h-32 overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 120">
                  {/* Dashed Target line */}
                  <line x1="0" y1="50" x2="500" y2="50" stroke="#C5B8A8" strokeWidth="1.5" strokeDasharray="4 4" />
                  {/* Gradient Area */}
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B302A" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#3B302A" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,70 L 125,30 L 250,15 L 375,45 L 500,25 L 500,120 L 0,120 Z" fill="url(#scoreGrad)" />
                  <path d="M 0,70 L 125,30 L 250,15 L 375,45 L 500,25" fill="none" stroke="#3B302A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Points */}
                  <circle cx="0" cy="70" r="4.5" fill="#3B302A" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="125" cy="30" r="4.5" fill="#3B302A" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="250" cy="15" r="4.5" fill="#3B302A" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="375" cy="45" r="4.5" fill="#3B302A" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="500" cy="25" r="4.5" fill="#3B302A" stroke="#FFFFFF" strokeWidth="2" />
                </svg>

                {/* Point Labels */}
                <div className="relative z-10 w-full flex justify-between text-[11px] font-mono text-stone-600 pt-3">
                  <span>SAT (1520)</span>
                  <span>HSC (5.00)</span>
                  <span>SSC (5.00)</span>
                  <span>IELTS (8.0)</span>
                  <span>BAdT (82)</span>
                </div>
              </div>

              {/* Study Progress Meters Row */}
              <div className="pt-2">
                <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider block mb-3">
                  Curriculum & Exam Preparedness
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  {[
                    { label: 'SAT Prep', pct: 95, color: '#3B302A' },
                    { label: 'HSC Track', pct: 100, color: '#59483D' },
                    { label: 'SSC Record', pct: 100, color: '#B45309' },
                    { label: 'IELTS Band', pct: 80, color: '#78350F' },
                    { label: 'Admission Test', pct: 60, color: '#57534E' }
                  ].map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex flex-col items-center">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={m.color}
                            strokeWidth="3"
                            strokeDasharray={`${m.pct}, 100`}
                          />
                        </svg>
                        <span className="absolute text-[11px] font-mono font-bold text-stone-900">
                          {m.pct}%
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-stone-600 mt-1.5 font-medium">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Academic Records & Quick Actions (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              {/* Academic Records List */}
              <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h3 className="text-sm font-bold font-serif text-stone-900 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-[#3B302A]" />
                    Academic Records
                  </h3>
                  <span className="text-[11px] font-mono text-stone-500">Live Entries</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  {/* Item 1 */}
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-900">SAT Official Test</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <span>Score: 1520 |</span>
                        <EditableDate 
                          value="2025-08-24"
                          onSave={() => {}}
                          displayMode="compact"
                        />
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded text-[10px] font-bold">
                      Completed
                    </span>
                  </div>

                  {/* Item 2 */}
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-900">SSC Board Result</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <span>GPA: 5.00 |</span>
                        <EditableDate 
                          value={sscArchive.resultPublishDate}
                          onSave={(newDate) => updateSscArchive({ resultPublishDate: newDate })}
                          displayMode="compact"
                        />
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded text-[10px] font-bold">
                      Golden A+
                    </span>
                  </div>

                  {/* Item 3 */}
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-900">HSC College Track</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <span>Target GPA: 5.00 |</span>
                        <EditableDate 
                          value={hscArchive.hscPassingYear}
                          onSave={(newYear) => updateHscArchive({ hscPassingYear: newYear })}
                          displayMode="compact"
                        />
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded text-[10px] font-bold">
                      On Track
                    </span>
                  </div>

                  {/* Item 4 */}
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-900">IELTS Official Test</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <span>Score: 8.0 |</span>
                        <EditableDate 
                          value={latestIelts.testDate}
                          onSave={() => {}}
                          displayMode="compact"
                        />
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded text-[10px] font-bold">
                      Completed
                    </span>
                  </div>

                  {/* Item 5 */}
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-900">BUET Mock Screening</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <span>Result: 82/100 |</span>
                        <EditableDate 
                          value="2026-11-03"
                          onSave={() => {}}
                          displayMode="compact"
                        />
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded text-[10px] font-bold">
                      Noted
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Buttons */}
              <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-2">
                <span className="text-xs font-mono font-bold text-stone-900 uppercase block mb-1">
                  Quick Actions
                </span>
                <button
                  onClick={() => setNewSatModal(true)}
                  className="w-full py-2 px-3 bg-stone-50 hover:bg-[#F2ECE4] text-stone-800 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 border border-stone-200 transition-colors cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5 text-stone-600" />
                  <span>Add SAT Test Record</span>
                </button>
                <button
                  onClick={() => setNewEnglishModal(true)}
                  className="w-full py-2 px-3 bg-stone-50 hover:bg-[#F2ECE4] text-stone-800 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 border border-stone-200 transition-colors cursor-pointer"
                >
                  <Headphones className="w-3.5 h-3.5 text-stone-600" />
                  <span>Add IELTS / TOEFL Result</span>
                </button>
                <button
                  onClick={() => setNewBdModal(true)}
                  className="w-full py-2 px-3 bg-stone-50 hover:bg-[#F2ECE4] text-stone-800 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 border border-stone-200 transition-colors cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5 text-stone-600" />
                  <span>Add BD Admission Test Entry</span>
                </button>
              </div>

              {/* Aesthetic Quote Card matching screenshot */}
              <div className="rounded-2xl p-4 bg-gradient-to-br from-[#3B302A] to-[#241E1A] text-white shadow-2xs space-y-2 border border-stone-800">
                <p className="text-sm font-serif italic text-[#EFE7DC] leading-relaxed">
                  “Discipline in the present designs the freedom of the future.”
                </p>
                <span className="text-[10px] font-mono tracking-widest text-[#D8C5AE] uppercase block">
                  — COMEBACK STUDY TRACKER
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SAT ARCHIVE                                                        */}
      {/* ========================================================================= */}
      {activeTab === 'sat' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#EAE4DC] p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Digital SAT Academic Archive
                </h2>
                <p className="text-xs font-mono text-stone-500 mt-0.5">
                  Target: 1550+ | Superscore Section Optimization
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setNewSatModal(true)}
                  className="px-4 py-2 bg-[#3B302A] hover:bg-[#292724] text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add SAT Score Record</span>
                </button>
              </div>
            </div>

            {/* SAT Target Targets Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[11px] font-mono text-stone-500 uppercase block">Target Total</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    value={satArchive.targetTotalScore}
                    onChange={(e) => updateSatArchive({ targetTotalScore: Number(e.target.value) || 0 })}
                    className="w-24 text-2xl font-serif font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-300"
                  />
                  <span className="text-xs font-mono text-stone-400">/ 1600</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[11px] font-mono text-stone-500 uppercase block">Target Reading & Writing</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    value={satArchive.targetRwScore}
                    onChange={(e) => updateSatArchive({ targetRwScore: Number(e.target.value) || 0 })}
                    className="w-20 text-2xl font-serif font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-300"
                  />
                  <span className="text-xs font-mono text-stone-400">/ 800</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[11px] font-mono text-stone-500 uppercase block">Target Math</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    value={satArchive.targetMathScore}
                    onChange={(e) => updateSatArchive({ targetMathScore: Number(e.target.value) || 0 })}
                    className="w-20 text-2xl font-serif font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-300"
                  />
                  <span className="text-xs font-mono text-stone-400">/ 800</span>
                </div>
              </div>
            </div>

            {/* Test History List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold font-mono text-stone-900 uppercase">
                Test Records History ({satArchive.records.length})
              </h3>

              {satArchive.records.map(record => (
                <div key={record.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded bg-[#3B302A] text-white text-xs font-mono font-bold">
                        {record.testType}
                      </span>
                      <span className="text-xl font-serif font-bold text-stone-900">
                        {record.totalScore}
                      </span>
                      <span className="text-xs font-mono text-stone-500">
                        (RW: {record.readingWritingScore} + Math: {record.mathScore})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-xs font-mono text-stone-600 flex items-center gap-1">
                        <span>Date:</span>
                        <EditableDate 
                          value={record.testDate}
                          onSave={(newDate) => {
                            const updated = satArchive.records.map(r => r.id === record.id ? { ...r, testDate: newDate } : r);
                            updateSatArchive({ records: updated });
                          }}
                          displayMode="badge"
                        />
                      </div>
                      <button
                        onClick={() => deleteSatScoreRecord(record.id)}
                        className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {record.preparationNotes && (
                    <p className="text-xs text-stone-700 font-sans">
                      <b className="font-mono text-stone-900">Notes:</b> {record.preparationNotes}
                    </p>
                  )}
                  {record.weakAreas && (
                    <p className="text-xs text-stone-700 font-sans">
                      <b className="font-mono text-stone-900">Weak Areas:</b> {record.weakAreas}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HSC (HIGHER SECONDARY CERTIFICATE)                                 */}
      {/* ========================================================================= */}
      {activeTab === 'hsc' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#EAE4DC] p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Higher Secondary Certificate (HSC)
                </h2>
                <p className="text-xs font-mono text-stone-500 mt-0.5">
                  Notre Dame College, Dhaka | National Curriculum (English/Bangla Version Science)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#EFE7DC] text-[#3B302A] rounded-lg text-xs font-mono font-bold">
                  Target: GPA 5.00
                </span>
              </div>
            </div>

            {/* Institution Info & Dates (All Editable!) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono">
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">College Name</span>
                <input
                  type="text"
                  value={hscArchive.hscCollegeName}
                  onChange={(e) => updateHscArchive({ hscCollegeName: e.target.value })}
                  className="font-bold text-stone-900 bg-white border border-stone-200 rounded px-2 py-1 w-full mt-1"
                />
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Education Board</span>
                <input
                  type="text"
                  value={hscArchive.hscBoard}
                  onChange={(e) => updateHscArchive({ hscBoard: e.target.value })}
                  className="font-bold text-stone-900 bg-white border border-stone-200 rounded px-2 py-1 w-full mt-1"
                />
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Passing / Exam Year</span>
                <div className="mt-1">
                  <EditableDate 
                    value={hscArchive.hscPassingYear}
                    onSave={(newYear) => updateHscArchive({ hscPassingYear: newYear })}
                    displayMode="button"
                  />
                </div>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Exam Date Target</span>
                <div className="mt-1">
                  <EditableDate 
                    value={hscArchive.hscExamDate || '2026-06-30'}
                    onSave={(newDate) => updateHscArchive({ hscExamDate: newDate })}
                    displayMode="badge"
                  />
                </div>
              </div>
            </div>

            {/* Subject Breakdown Table */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold font-mono text-stone-900 uppercase">
                Subject Marks & Letter Grade Breakdown
              </h3>
              <div className="overflow-x-auto border border-stone-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-700">
                    <tr>
                      <th className="py-2.5 px-3">Subject Name</th>
                      <th className="py-2.5 px-3">Total Marks</th>
                      <th className="py-2.5 px-3">Grade</th>
                      <th className="py-2.5 px-3">Grade Point</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {hscArchive.hscSubjectMarks.map(sub => (
                      <tr key={sub.id} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3 font-semibold text-stone-900">{sub.subjectName}</td>
                        <td className="py-2.5 px-3">{sub.totalMarks || '—'}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">
                            {sub.grade || 'A+'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold">{sub.gpaPoint || '5.00'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SSC (SECONDARY SCHOOL CERTIFICATE) - DEDICATED SEPARATE VIEW       */}
      {/* ========================================================================= */}
      {activeTab === 'ssc' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#D8C5AE] p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-serif font-bold text-stone-900">
                    Secondary School Certificate (SSC) Archive
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    Golden GPA 5.00
                  </span>
                </div>
                <p className="text-xs font-mono text-stone-500 mt-1">
                  Official Academic Transcript Verified by Board of Intermediate and Secondary Education, Dhaka
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNewSscSubjectModal(true)}
                  className="px-3 py-1.5 bg-[#3B302A] hover:bg-[#292724] text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Subject Mark</span>
                </button>
              </div>
            </div>

            {/* Candidate & Registration Dossier Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-amber-50/40 border border-amber-200/60 text-xs font-mono">
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">School Name</span>
                <input
                  type="text"
                  value={sscArchive.schoolName}
                  onChange={(e) => updateSscArchive({ schoolName: e.target.value })}
                  className="font-bold text-stone-900 bg-white border border-stone-200 rounded px-2 py-1 w-full mt-1"
                />
              </div>

              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Education Board</span>
                <input
                  type="text"
                  value={sscArchive.board}
                  onChange={(e) => updateSscArchive({ board: e.target.value })}
                  className="font-bold text-stone-900 bg-white border border-stone-200 rounded px-2 py-1 w-full mt-1"
                />
              </div>

              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Roll & Reg Number</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={sscArchive.rollNumber}
                    placeholder="Roll"
                    onChange={(e) => updateSscArchive({ rollNumber: e.target.value })}
                    className="font-bold text-stone-900 bg-white border border-stone-200 rounded px-2 py-1 w-1/2"
                  />
                  <input
                    type="text"
                    value={sscArchive.registrationNumber}
                    placeholder="Reg"
                    onChange={(e) => updateSscArchive({ registrationNumber: e.target.value })}
                    className="font-bold text-stone-900 bg-white border border-stone-200 rounded px-2 py-1 w-1/2"
                  />
                </div>
              </div>

              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Group & Session</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={sscArchive.group}
                    onChange={(e) => updateSscArchive({ group: e.target.value })}
                    className="font-bold text-stone-900 bg-white border border-stone-200 rounded px-2 py-1 w-1/2"
                  />
                  <input
                    type="text"
                    value={sscArchive.session}
                    onChange={(e) => updateSscArchive({ session: e.target.value })}
                    className="font-bold text-stone-900 bg-white border border-stone-200 rounded px-2 py-1 w-1/2"
                  />
                </div>
              </div>
            </div>

            {/* Editable Dates Dossier Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Passing Year</span>
                  <span className="text-sm font-bold text-stone-900">{sscArchive.passingYear}</span>
                </div>
                <EditableDate 
                  value={sscArchive.passingYear}
                  onSave={(newYear) => updateSscArchive({ passingYear: newYear })}
                  displayMode="button"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Examination Window</span>
                  <span className="text-sm font-bold text-stone-900">
                    {sscArchive.examStartDate} to {sscArchive.examEndDate}
                  </span>
                </div>
                <EditableDate 
                  value={sscArchive.examStartDate}
                  onSave={(newDate) => updateSscArchive({ examStartDate: newDate })}
                  displayMode="badge"
                  label="Exam Start Date"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Result Publish Date</span>
                  <span className="text-sm font-bold text-stone-900">{sscArchive.resultPublishDate}</span>
                </div>
                <EditableDate 
                  value={sscArchive.resultPublishDate}
                  onSave={(newDate) => updateSscArchive({ resultPublishDate: newDate })}
                  displayMode="badge"
                  label="Result Date"
                />
              </div>
            </div>

            {/* Official Subject-Wise Marksheet Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-mono text-stone-900 uppercase">
                  NCTB Official Subject-Wise Marks & Grades ({sscArchive.subjectMarks.length} Subjects)
                </h3>
                <span className="text-xs font-mono text-emerald-700 font-bold">
                  All 10 Subjects Grade Point: 5.00
                </span>
              </div>

              <div className="overflow-x-auto border border-stone-200 rounded-xl shadow-2xs">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-700">
                    <tr>
                      <th className="py-2.5 px-3">Code</th>
                      <th className="py-2.5 px-3">Subject Name</th>
                      <th className="py-2.5 px-3">Theory</th>
                      <th className="py-2.5 px-3">MCQ</th>
                      <th className="py-2.5 px-3">Practical</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3">Grade</th>
                      <th className="py-2.5 px-3">Point</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {sscArchive.subjectMarks.map(sub => (
                      <tr key={sub.id} className="hover:bg-amber-50/20">
                        <td className="py-2.5 px-3 text-stone-500 font-semibold">{sub.subjectCode}</td>
                        <td className="py-2.5 px-3 font-semibold text-stone-900">{sub.subjectName}</td>
                        <td className="py-2.5 px-3">{sub.theoryMarks || '—'}</td>
                        <td className="py-2.5 px-3">{sub.mcqMarks || '—'}</td>
                        <td className="py-2.5 px-3">{sub.practicalMarks || '—'}</td>
                        <td className="py-2.5 px-3 font-bold text-stone-900">{sub.totalMarks || '—'}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
                            {sub.grade}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-emerald-800">{sub.gradePoint}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => deleteSscSubject(sub.id)}
                            className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                            title="Delete subject"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Achievements & Academic Honors */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="text-xs font-mono font-bold text-stone-900 uppercase block">
                Academic Achievements & Board Honors
              </span>
              <textarea
                value={sscArchive.academicAchievements}
                onChange={(e) => updateSscArchive({ academicAchievements: e.target.value })}
                rows={2}
                className="w-full p-2.5 bg-white border border-stone-200 rounded-lg text-xs font-sans text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
                placeholder="List any board talentpool scholarships, science fair awards, or Olympiad milestones..."
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: IELTS / TOEFL                                                      */}
      {/* ========================================================================= */}
      {activeTab === 'english' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#EAE4DC] p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  English Language Proficiency Tests
                </h2>
                <p className="text-xs font-mono text-stone-500 mt-0.5">
                  IELTS Academic / TOEFL iBT / Duolingo English Test
                </p>
              </div>

              <button
                onClick={() => setNewEnglishModal(true)}
                className="px-4 py-2 bg-[#3B302A] hover:bg-[#292724] text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add English Test Result</span>
              </button>
            </div>

            {/* Records */}
            <div className="space-y-3">
              {englishTestRecords.map(rec => (
                <div key={rec.id} className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded bg-[#3B302A] text-white text-xs font-mono font-bold">
                        {rec.testType}
                      </span>
                      <span className="text-2xl font-serif font-bold text-stone-900">
                        {rec.overallScore}
                      </span>
                      <span className="text-xs font-mono text-stone-500">
                        (Target: {rec.targetScore})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-xs font-mono text-stone-600 flex items-center gap-1">
                        <span>Test Date:</span>
                        <EditableDate 
                          value={rec.testDate}
                          onSave={(newDate) => updateEnglishTestRecord(rec.id, { testDate: newDate })}
                          displayMode="badge"
                        />
                      </div>
                      <button
                        onClick={() => deleteEnglishTestRecord(rec.id)}
                        className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
                    <div className="p-2.5 bg-white rounded border border-stone-200">
                      <span className="text-stone-500 block">Listening</span>
                      <span className="text-sm font-bold text-stone-900">{rec.listeningScore}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded border border-stone-200">
                      <span className="text-stone-500 block">Reading</span>
                      <span className="text-sm font-bold text-stone-900">{rec.readingScore}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded border border-stone-200">
                      <span className="text-stone-500 block">Writing</span>
                      <span className="text-sm font-bold text-stone-900">{rec.writingScore}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded border border-stone-200">
                      <span className="text-stone-500 block">Speaking</span>
                      <span className="text-sm font-bold text-stone-900">{rec.speakingScore}</span>
                    </div>
                  </div>

                  {rec.notes && (
                    <p className="text-xs text-stone-600 font-sans pt-1">
                      <b className="font-mono text-stone-900">Notes:</b> {rec.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: BANGLADESH ADMISSION TESTS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'bd-admission' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#EAE4DC] p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Bangladesh Domestic University Admission Prep
                </h2>
                <p className="text-xs font-mono text-stone-500 mt-0.5">
                  BUET · Dhaka University · IBA DU · Medical College Admission
                </p>
              </div>

              <button
                onClick={() => setNewBdModal(true)}
                className="px-4 py-2 bg-[#3B302A] hover:bg-[#292724] text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Institution Entry</span>
              </button>
            </div>

            <div className="space-y-4">
              {bangladeshAdmissionEntries.map(entry => (
                <div key={entry.id} className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
                    <h3 className="text-base font-serif font-bold text-stone-900">
                      {entry.targetInstitution}
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="text-xs font-mono text-stone-600 flex items-center gap-1">
                        <span>Updated:</span>
                        <EditableDate 
                          value={entry.updatedAt}
                          onSave={(newDate) => updateBangladeshAdmissionEntry(entry.id, { updatedAt: newDate })}
                          displayMode="badge"
                        />
                      </div>
                      <button
                        onClick={() => deleteBangladeshAdmissionEntry(entry.id)}
                        className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    <div>
                      <span className="font-mono font-bold text-stone-900 block mb-1">
                        Preparation Notes & Focus Areas:
                      </span>
                      <p className="text-stone-700 bg-white p-3 rounded border border-stone-200">
                        {entry.preparationNotes || 'No notes added yet.'}
                      </p>
                    </div>

                    <div>
                      <span className="font-mono font-bold text-stone-900 block mb-1">
                        Exam Experience & Mock Scores:
                      </span>
                      <p className="text-stone-700 bg-white p-3 rounded border border-stone-200">
                        {entry.examExperience || 'Mock test logs pending.'}
                      </p>
                    </div>
                  </div>

                  {entry.importantDates && (
                    <div className="text-xs font-mono text-stone-600 bg-amber-50 p-2.5 rounded border border-amber-200 flex items-center justify-between">
                      <span className="font-bold text-amber-900">Important Dates:</span>
                      <span>{entry.importantDates}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD SAT RECORD                                                   */}
      {/* ========================================================================= */}
      {newSatModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Add SAT Score Record
            </h3>
            <form onSubmit={handleSaveSat} className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-500 mb-1">Test Type</label>
                  <select
                    value={satForm.testType}
                    onChange={(e) => setSatForm({ ...satForm, testType: e.target.value as any })}
                    className="w-full p-2 border border-stone-200 rounded-lg bg-stone-50"
                  >
                    <option value="Official SAT">Official SAT</option>
                    <option value="Practice Test">Practice Test</option>
                    <option value="Bluebook Practice">Bluebook Practice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">Test Date</label>
                  <input
                    type="date"
                    value={satForm.testDate}
                    onChange={(e) => setSatForm({ ...satForm, testDate: e.target.value })}
                    className="w-full p-2 border border-stone-200 rounded-lg bg-stone-50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-500 mb-1">Reading & Writing Score (200-800)</label>
                  <input
                    type="number"
                    min="200"
                    max="800"
                    value={satForm.readingWritingScore}
                    onChange={(e) => setSatForm({ ...satForm, readingWritingScore: Number(e.target.value) })}
                    className="w-full p-2 border border-stone-200 rounded-lg font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">Math Score (200-800)</label>
                  <input
                    type="number"
                    min="200"
                    max="800"
                    value={satForm.mathScore}
                    onChange={(e) => setSatForm({ ...satForm, mathScore: Number(e.target.value) })}
                    className="w-full p-2 border border-stone-200 rounded-lg font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-500 mb-1">Preparation & Test Day Notes</label>
                <textarea
                  value={satForm.preparationNotes}
                  onChange={(e) => setSatForm({ ...satForm, preparationNotes: e.target.value })}
                  rows={2}
                  className="w-full p-2 border border-stone-200 rounded-lg"
                  placeholder="Test center conditions, pacing, modules breakdown..."
                />
              </div>

              <div>
                <label className="block text-stone-500 mb-1">Weak Areas & Mistake Analysis</label>
                <textarea
                  value={satForm.weakAreas}
                  onChange={(e) => setSatForm({ ...satForm, weakAreas: e.target.value })}
                  rows={2}
                  className="w-full p-2 border border-stone-200 rounded-lg"
                  placeholder="Specific topics to review..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setNewSatModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3B302A] hover:bg-[#292724] text-white rounded-lg font-bold cursor-pointer"
                >
                  Save SAT Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD ENGLISH TEST RECORD                                          */}
      {/* ========================================================================= */}
      {newEnglishModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Add English Language Test Record
            </h3>
            <form onSubmit={handleSaveEnglish} className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-500 mb-1">Test Type</label>
                  <select
                    value={englishForm.testType}
                    onChange={(e) => setEnglishForm({ ...englishForm, testType: e.target.value as any })}
                    className="w-full p-2 border border-stone-200 rounded-lg bg-stone-50"
                  >
                    <option value="IELTS Academic">IELTS Academic</option>
                    <option value="TOEFL iBT">TOEFL iBT</option>
                    <option value="Duolingo English Test">Duolingo English Test</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">Test Date</label>
                  <input
                    type="date"
                    value={englishForm.testDate}
                    onChange={(e) => setEnglishForm({ ...englishForm, testDate: e.target.value })}
                    className="w-full p-2 border border-stone-200 rounded-lg bg-stone-50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-500 mb-1">Overall Band / Score</label>
                  <input
                    type="text"
                    value={englishForm.overallScore}
                    onChange={(e) => setEnglishForm({ ...englishForm, overallScore: e.target.value })}
                    className="w-full p-2 border border-stone-200 rounded-lg font-bold"
                    placeholder="e.g. 8.0 or 110"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">Target Score</label>
                  <input
                    type="text"
                    value={englishForm.targetScore}
                    onChange={(e) => setEnglishForm({ ...englishForm, targetScore: e.target.value })}
                    className="w-full p-2 border border-stone-200 rounded-lg"
                    placeholder="e.g. 8.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1">Listening</label>
                  <input
                    type="text"
                    value={englishForm.listeningScore}
                    onChange={(e) => setEnglishForm({ ...englishForm, listeningScore: e.target.value })}
                    className="w-full p-1.5 border border-stone-200 rounded"
                    placeholder="8.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1">Reading</label>
                  <input
                    type="text"
                    value={englishForm.readingScore}
                    onChange={(e) => setEnglishForm({ ...englishForm, readingScore: e.target.value })}
                    className="w-full p-1.5 border border-stone-200 rounded"
                    placeholder="8.0"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1">Writing</label>
                  <input
                    type="text"
                    value={englishForm.writingScore}
                    onChange={(e) => setEnglishForm({ ...englishForm, writingScore: e.target.value })}
                    className="w-full p-1.5 border border-stone-200 rounded"
                    placeholder="7.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1">Speaking</label>
                  <input
                    type="text"
                    value={englishForm.speakingScore}
                    onChange={(e) => setEnglishForm({ ...englishForm, speakingScore: e.target.value })}
                    className="w-full p-1.5 border border-stone-200 rounded"
                    placeholder="8.0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-500 mb-1">Notes</label>
                <textarea
                  value={englishForm.notes}
                  onChange={(e) => setEnglishForm({ ...englishForm, notes: e.target.value })}
                  rows={2}
                  className="w-full p-2 border border-stone-200 rounded-lg"
                  placeholder="Test center details, TRF number..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setNewEnglishModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3B302A] hover:bg-[#292724] text-white rounded-lg font-bold cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD BD ADMISSION TEST                                            */}
      {/* ========================================================================= */}
      {newBdModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Add Bangladesh Admission Test Entry
            </h3>
            <form onSubmit={handleSaveBd} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-stone-500 mb-1">Target Institution & Unit</label>
                <input
                  type="text"
                  value={bdForm.targetInstitution}
                  onChange={(e) => setBdForm({ ...bdForm, targetInstitution: e.target.value })}
                  className="w-full p-2 border border-stone-200 rounded-lg font-bold text-stone-900"
                  placeholder="e.g. BUET (Engineering), Dhaka University (Ka Unit), IBA DU"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-500 mb-1">Important Dates</label>
                <input
                  type="text"
                  value={bdForm.importantDates}
                  onChange={(e) => setBdForm({ ...bdForm, importantDates: e.target.value })}
                  className="w-full p-2 border border-stone-200 rounded-lg"
                  placeholder="e.g. Preliminary: Nov 2026 | Written: Dec 2026"
                />
              </div>

              <div>
                <label className="block text-stone-500 mb-1">Preparation Notes</label>
                <textarea
                  value={bdForm.preparationNotes}
                  onChange={(e) => setBdForm({ ...bdForm, preparationNotes: e.target.value })}
                  rows={2}
                  className="w-full p-2 border border-stone-200 rounded-lg font-sans"
                  placeholder="Chapters, concept books, problem sets..."
                />
              </div>

              <div>
                <label className="block text-stone-500 mb-1">Mock Results / Expectations</label>
                <input
                  type="text"
                  value={bdForm.resultsOrExpectations}
                  onChange={(e) => setBdForm({ ...bdForm, resultsOrExpectations: e.target.value })}
                  className="w-full p-2 border border-stone-200 rounded-lg"
                  placeholder="e.g. Score: 82/100, Target: Top 200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setNewBdModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3B302A] hover:bg-[#292724] text-white rounded-lg font-bold cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD SSC CUSTOM SUBJECT                                           */}
      {/* ========================================================================= */}
      {newSscSubjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Add SSC Subject Mark
            </h3>
            <form onSubmit={handleSaveSscSubject} className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-500 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={sscSubForm.subjectCode}
                    onChange={(e) => setSscSubForm({ ...sscSubForm, subjectCode: e.target.value })}
                    className="w-full p-2 border border-stone-200 rounded-lg"
                    placeholder="e.g. 109, 126"
                  />
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">Subject Name</label>
                  <input
                    type="text"
                    value={sscSubForm.subjectName}
                    onChange={(e) => setSscSubForm({ ...sscSubForm, subjectName: e.target.value })}
                    className="w-full p-2 border border-stone-200 rounded-lg font-bold"
                    placeholder="e.g. Higher Mathematics"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1">Theory</label>
                  <input
                    type="text"
                    value={sscSubForm.theoryMarks}
                    onChange={(e) => setSscSubForm({ ...sscSubForm, theoryMarks: e.target.value })}
                    className="w-full p-1.5 border border-stone-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1">MCQ</label>
                  <input
                    type="text"
                    value={sscSubForm.mcqMarks}
                    onChange={(e) => setSscSubForm({ ...sscSubForm, mcqMarks: e.target.value })}
                    className="w-full p-1.5 border border-stone-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1">Practical</label>
                  <input
                    type="text"
                    value={sscSubForm.practicalMarks}
                    onChange={(e) => setSscSubForm({ ...sscSubForm, practicalMarks: e.target.value })}
                    className="w-full p-1.5 border border-stone-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1">Total</label>
                  <input
                    type="text"
                    value={sscSubForm.totalMarks}
                    onChange={(e) => setSscSubForm({ ...sscSubForm, totalMarks: e.target.value })}
                    className="w-full p-1.5 border border-stone-200 rounded font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-500 mb-1">Grade</label>
                  <select
                    value={sscSubForm.grade}
                    onChange={(e) => setSscSubForm({ ...sscSubForm, grade: e.target.value })}
                    className="w-full p-2 border border-stone-200 rounded-lg bg-stone-50 font-bold"
                  >
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">Grade Point</label>
                  <input
                    type="text"
                    value={sscSubForm.gradePoint}
                    onChange={(e) => setSscSubForm({ ...sscSubForm, gradePoint: e.target.value })}
                    className="w-full p-2 border border-stone-200 rounded-lg font-bold"
                    placeholder="5.00"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setNewSscSubjectModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3B302A] hover:bg-[#292724] text-white rounded-lg font-bold cursor-pointer"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
