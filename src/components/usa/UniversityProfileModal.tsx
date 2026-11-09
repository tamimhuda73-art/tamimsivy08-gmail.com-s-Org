import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  ExternalLink, 
  Bookmark, 
  Star, 
  Archive, 
  Trash2, 
  Download, 
  Calendar, 
  DollarSign, 
  Award, 
  FileText, 
  GraduationCap, 
  Compass, 
  BookOpen, 
  Link2, 
  Plus, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { 
  UniversityProfile, 
  CollegeCategory, 
  ApplicationRound, 
  ResearchSource, 
  AdmissionStatEntry 
} from '../../types/usaApp';
import { WritingEditor } from './WritingEditor';

interface UniversityProfileModalProps {
  universityId: string;
  onClose: () => void;
}

type ProfileTab = 
  | 'overview' 
  | 'requirements' 
  | 'statistics' 
  | 'finaid' 
  | 'culture' 
  | 'strategy' 
  | 'notes' 
  | 'sources';

export const UniversityProfileModal: React.FC<UniversityProfileModalProps> = ({
  universityId,
  onClose
}) => {
  const { 
    getUniversityById, 
    updateUniversity, 
    deleteUniversity, 
    archiveUniversity, 
    toggleFavoriteUniversity,
    moveUniversityCategory 
  } = useUsaApp();

  const university = getUniversityById(universityId);
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newSourceModal, setNewSourceModal] = useState(false);
  const [newStatModal, setNewStatModal] = useState(false);

  // New Source state
  const [newSource, setNewSource] = useState<Omit<ResearchSource, 'id'>>({
    title: '',
    url: '',
    dateResearched: new Date().toISOString().split('T')[0],
    lastVerifiedDate: new Date().toISOString().split('T')[0],
    sourceType: 'Official Admissions',
    notes: ''
  });

  // New Stat state
  const [newStat, setNewStat] = useState<Omit<AdmissionStatEntry, 'id'>>({
    metricLabel: '',
    metricValue: '',
    sourceTitle: '',
    sourceUrl: '',
    verificationDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  if (!university) {
    return null;
  }

  const handleFieldChange = (field: keyof UniversityProfile, value: any) => {
    updateUniversity(university.id, { [field]: value });
  };

  const handleAddSource = () => {
    if (!newSource.title.trim()) return;
    const entry: ResearchSource = {
      ...newSource,
      id: `src-${Date.now()}`
    };
    updateUniversity(university.id, {
      sources: [entry, ...(university.sources || [])]
    });
    setNewSource({
      title: '',
      url: '',
      dateResearched: new Date().toISOString().split('T')[0],
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      sourceType: 'Official Admissions',
      notes: ''
    });
    setNewSourceModal(false);
  };

  const handleDeleteSource = (sourceId: string) => {
    updateUniversity(university.id, {
      sources: (university.sources || []).filter(s => s.id !== sourceId)
    });
  };

  const handleAddStat = () => {
    if (!newStat.metricLabel.trim()) return;
    const entry: AdmissionStatEntry = {
      ...newStat,
      id: `stat-${Date.now()}`
    };
    updateUniversity(university.id, {
      statsSources: [entry, ...(university.statsSources || [])]
    });
    setNewStat({
      metricLabel: '',
      metricValue: '',
      sourceTitle: '',
      sourceUrl: '',
      verificationDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setNewStatModal(false);
  };

  const handleDeleteStat = (statId: string) => {
    updateUniversity(university.id, {
      statsSources: (university.statsSources || []).filter(s => s.id !== statId)
    });
  };

  const exportMarkdown = () => {
    const md = `# ${university.name} — Comprehensive Research Dossier
**Category**: ${university.category.toUpperCase()} | **Location**: ${university.city}, ${university.state}, ${university.country}
**Type**: ${university.universityType} | **Website**: ${university.officialWebsite}

---

## 1. Overview & Major
- **Intended Major**: ${university.intendedMajor || 'Not specified'}
- **Undergraduate Programs**: ${university.undergraduatePrograms || 'N/A'}
- **Why Selected**: ${university.whyISelectedThisUniversity || 'N/A'}
- **Personal Interest Notes**: ${university.personalInterestNotes || 'N/A'}

---

## 2. Admission Requirements
- **Testing Policy (SAT)**: ${university.satPolicy} ${university.satNotes ? `(${university.satNotes})` : ''}
- **Testing Policy (ACT)**: ${university.actPolicy}
- **GPA Expectation**: ${university.gpaExpectations || 'N/A'}
- **English Proficiency**: ${university.englishProficiencyRequirements || 'N/A'} (IELTS: ${university.ieltsMinScore || 'N/A'}, TOEFL: ${university.toeflMinScore || 'N/A'}, Duolingo: ${university.duolingoMinScore || 'N/A'})
- **Application Platform**: ${university.applicationPlatform || 'Common App'}
- **Supplemental Requirements**: ${university.supplementalRequirements || 'N/A'}
- **International Student Requirements**: ${university.internationalStudentRequirements || 'N/A'}

---

## 3. Financial Aid & International Policy
- **Need-Based Aid for International Students**: ${university.needBasedAidInternational}
- **International Aid Available**: ${university.internationalAidAvailable ? 'Yes' : 'No'}
- **CSS Profile Required**: ${university.cssProfileRequired ? 'Yes' : 'No'} (Deadline: ${university.cssProfileDeadline || 'N/A'})
- **Tuition**: ${university.tuitionFeesUSD || 'N/A'} | **Housing**: ${university.housingExpensesUSD || 'N/A'} | **Total Cost**: ${university.totalEstimatedCostUSD || 'N/A'}
- **Personal Financial Aid Notes**: ${university.personalAidNotes || 'N/A'}

---

## 4. University Culture & Preferences
${university.valuedStudentTraits ? `### Valued Student Traits\n${university.valuedStudentTraits}\n` : ''}
${university.academicCulture ? `### Academic Culture\n${university.academicCulture}\n` : ''}
${university.researchOpportunities ? `### Research Opportunities\n${university.researchOpportunities}\n` : ''}
${university.personalObservations ? `### Personal Observations\n${university.personalObservations}\n` : ''}

---

## 5. Application Strategy
- **Intended Round**: ${university.intendedRound}
- **Deadlines**: ED: ${university.edDeadline || 'N/A'} | EA: ${university.eaDeadline || 'N/A'} | RD: ${university.rdDeadline || 'N/A'}
- **Decision Notes**: ${university.decisionNotes || 'N/A'}

---

## 6. Personal Notes
${university.personalNotesMarkdown || 'No notes added yet.'}
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${university.name.replace(/\s+/g, '_')}_Research.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { id: ProfileTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: '1. Overview', icon: Compass },
    { id: 'requirements', label: '2. Requirements', icon: GraduationCap },
    { id: 'statistics', label: '3. Admission Stats', icon: Award },
    { id: 'finaid', label: '4. Financial Aid', icon: DollarSign },
    { id: 'culture', label: '5. Culture & Values', icon: BookOpen },
    { id: 'strategy', label: '6. Strategy & Rounds', icon: Calendar },
    { id: 'notes', label: '7. Personal Notebook', icon: FileText },
    { id: 'sources', label: '8. Research Sources', icon: Link2 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 overflow-hidden">
      <div className="bg-[#FAF8F5] border border-[#EAE6DE] rounded-2xl shadow-2xl max-w-5xl w-full h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-white border-b border-[#EAE6DE] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                university.category === 'reach' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                university.category === 'target' ? 'bg-stone-200 text-stone-900 border border-stone-300' :
                'bg-emerald-100 text-emerald-900 border border-emerald-200'
              }`}>
                {university.category.toUpperCase()}
              </span>

              <span className="text-xs text-stone-500 font-sans">
                {university.city}, {university.state ? `${university.state}, ` : ''}{university.country}
              </span>

              {university.isArchived && (
                <span className="text-[10px] font-mono bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">
                  Archived
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-serif mt-1">
              {university.name}
            </h2>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Category Selector */}
            <select
              value={university.category}
              onChange={(e) => moveUniversityCategory(university.id, e.target.value as CollegeCategory)}
              className="text-xs font-mono bg-[#F2EDE4] border border-[#E0D8CB] rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none cursor-pointer"
            >
              <option value="reach">Move to Reach</option>
              <option value="target">Move to Target</option>
              <option value="safety">Move to Safety</option>
            </select>

            <button
              onClick={() => toggleFavoriteUniversity(university.id)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                university.isFavorite 
                  ? 'bg-amber-50 border-amber-300 text-amber-600' 
                  : 'bg-white border-stone-200 text-stone-400 hover:text-stone-700'
              }`}
              title="Toggle Favorite"
            >
              <Star className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={exportMarkdown}
              className="p-2 bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 rounded-lg transition-colors cursor-pointer"
              title="Export Research as Markdown (.md)"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => archiveUniversity(university.id)}
              className="p-2 bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 rounded-lg transition-colors cursor-pointer"
              title={university.isArchived ? 'Unarchive University' : 'Archive University'}
            >
              <Archive className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 bg-white hover:bg-rose-50 border border-stone-200 text-stone-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
              title="Delete University"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 8 Notebook Navigation Tabs */}
        <div className="px-6 bg-[#F2EDE4] border-b border-[#EAE6DE] flex items-center gap-1 overflow-x-auto shrink-0 select-none">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-mono font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  isActive 
                    ? 'border-stone-900 text-stone-900 bg-[#FAF8F5] rounded-t-lg' 
                    : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Viewport */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-[#FAF8F5]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    Official Website
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={university.officialWebsite}
                      onChange={(e) => handleFieldChange('officialWebsite', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600"
                    />
                    {university.officialWebsite && (
                      <a 
                        href={university.officialWebsite} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-white border border-stone-300 rounded-xl text-stone-600 hover:text-stone-900"
                        title="Visit official website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    University Type
                  </label>
                  <select
                    value={university.universityType}
                    onChange={(e) => handleFieldChange('universityType', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 cursor-pointer"
                  >
                    <option value="Private Nonprofit">Private Nonprofit</option>
                    <option value="Public State">Public State</option>
                    <option value="Liberal Arts College">Liberal Arts College (LAC)</option>
                    <option value="Specialized / Tech">Specialized STEM / Tech Institute</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    Intended Major / Academic Concentration
                  </label>
                  <input
                    type="text"
                    value={university.intendedMajor}
                    onChange={(e) => handleFieldChange('intendedMajor', e.target.value)}
                    placeholder="e.g. Computer Science, Electrical Engineering, Applied Physics"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    Campus Setting & Location
                  </label>
                  <input
                    type="text"
                    value={university.campusInformation}
                    onChange={(e) => handleFieldChange('campusInformation', e.target.value)}
                    placeholder="e.g. Urban, Suburban, College Town, 150-acre campus"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                  Notable Undergraduate Programs, Labs & Institutes
                </label>
                <textarea
                  rows={3}
                  value={university.undergraduatePrograms}
                  onChange={(e) => handleFieldChange('undergraduatePrograms', e.target.value)}
                  placeholder="Record specific majors, interdisciplinary tracks, research institutes, or undergraduate opportunities..."
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                  Why I Selected This University (Personal Academic Fit)
                </label>
                <textarea
                  rows={4}
                  value={university.whyISelectedThisUniversity}
                  onChange={(e) => handleFieldChange('whyISelectedThisUniversity', e.target.value)}
                  placeholder="What specifically makes this university stand out for your goals? (Professors, curriculum, community, research labs)..."
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                  Personal Interest Notes
                </label>
                <textarea
                  rows={3}
                  value={university.personalInterestNotes}
                  onChange={(e) => handleFieldChange('personalInterestNotes', e.target.value)}
                  placeholder="Additional personal thoughts, conversations with current students or alumni, etc..."
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ADMISSION REQUIREMENTS */}
          {activeTab === 'requirements' && (
            <div className="space-y-6 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    SAT Policy for Fall 2028
                  </label>
                  <select
                    value={university.satPolicy}
                    onChange={(e) => handleFieldChange('satPolicy', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 cursor-pointer"
                  >
                    <option value="Required">Required (Mandatory)</option>
                    <option value="Test-Optional">Test-Optional</option>
                    <option value="Test-Blind / Test-Free">Test-Blind / Test-Free</option>
                    <option value="Recommended">Recommended</option>
                    <option value="Flexible">Flexible (SAT, ACT, AP, or IB)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    ACT Policy
                  </label>
                  <select
                    value={university.actPolicy}
                    onChange={(e) => handleFieldChange('actPolicy', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 cursor-pointer"
                  >
                    <option value="Required">Required</option>
                    <option value="Test-Optional">Test-Optional</option>
                    <option value="Test-Blind">Test-Blind</option>
                    <option value="Recommended">Recommended</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    Application Platform & Common App
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={university.applicationPlatform}
                      onChange={(e) => handleFieldChange('applicationPlatform', e.target.value)}
                      placeholder="e.g. Common App, Coalition, Institutional Portal"
                      className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600"
                    />
                    <label className="flex items-center gap-1.5 text-xs text-stone-700 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={university.commonAppAvailable}
                        onChange={(e) => handleFieldChange('commonAppAvailable', e.target.checked)}
                        className="rounded"
                      />
                      <span>Common App</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    GPA Expectation & High School Rigor
                  </label>
                  <input
                    type="text"
                    value={university.gpaExpectations}
                    onChange={(e) => handleFieldChange('gpaExpectations', e.target.value)}
                    placeholder="e.g. Unweighted 3.9+, Top 5-10% of class, HSC GPA 5.00"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600"
                  />
                </div>
              </div>

              {/* English Proficiency Subsection */}
              <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-3">
                <h4 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-wider">
                  English Language Proficiency Requirements (International)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 mb-1">IELTS Minimum / Recommended</label>
                    <input
                      type="text"
                      value={university.ieltsMinScore}
                      onChange={(e) => handleFieldChange('ieltsMinScore', e.target.value)}
                      placeholder="e.g. 7.0 or 7.5"
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 mb-1">TOEFL iBT Minimum</label>
                    <input
                      type="text"
                      value={university.toeflMinScore}
                      onChange={(e) => handleFieldChange('toeflMinScore', e.target.value)}
                      placeholder="e.g. 100+"
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 mb-1">Duolingo (DET) Minimum</label>
                    <input
                      type="text"
                      value={university.duolingoMinScore}
                      onChange={(e) => handleFieldChange('duolingoMinScore', e.target.value)}
                      placeholder="e.g. 125 - 130"
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-stone-600 mb-1">Waiver Policy & Details</label>
                  <input
                    type="text"
                    value={university.englishProficiencyRequirements}
                    onChange={(e) => handleFieldChange('englishProficiencyRequirements', e.target.value)}
                    placeholder="e.g. Waived if SAT Reading is 650+ or English medium school for 4+ years"
                    className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    Recommendation Requirements (LORs)
                  </label>
                  <textarea
                    rows={2}
                    value={university.recommendationRequirements}
                    onChange={(e) => handleFieldChange('recommendationRequirements', e.target.value)}
                    placeholder="e.g. 1 Counselor Recommendation + 2 Teacher Evaluations (1 STEM, 1 Humanities)"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    Transcript & Curriculum Requirements (SSC / HSC)
                  </label>
                  <textarea
                    rows={2}
                    value={university.transcriptRequirements}
                    onChange={(e) => handleFieldChange('transcriptRequirements', e.target.value)}
                    placeholder="e.g. Official translated transcripts for 9th-12th grades, SSC certificate, HSC test exams"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                  International Student Specific Admission Requirements & Notes
                </label>
                <textarea
                  rows={3}
                  value={university.internationalStudentRequirements}
                  onChange={(e) => handleFieldChange('internationalStudentRequirements', e.target.value)}
                  placeholder="Record any specific requirements for international applicants from Bangladesh (e.g. credential evaluations, passport copy, initialview interview)..."
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 3: ADMISSION STATISTICS */}
          {activeTab === 'statistics' && (
            <div className="space-y-6 max-w-4xl">
              <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-stone-700 leading-relaxed">
                <strong>Source Verification Requirement:</strong> Every recorded admission statistic must include a verifiable source URL, source title (e.g., Common Data Set 2024–2025 or Class Profile), and verification date. Never rely on unverified rumors.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-stone-200 rounded-xl">
                  <span className="text-[11px] font-mono text-stone-500 uppercase">Overall Acceptance Rate</span>
                  <input
                    type="text"
                    value={university.acceptanceRate || ''}
                    onChange={(e) => handleFieldChange('acceptanceRate', e.target.value)}
                    placeholder="e.g. 4.8%"
                    className="w-full text-lg font-bold font-mono text-stone-900 bg-transparent border-b border-stone-200 py-1 focus:outline-none focus:border-stone-800"
                  />
                </div>

                <div className="p-4 bg-white border border-stone-200 rounded-xl">
                  <span className="text-[11px] font-mono text-stone-500 uppercase">SAT 25th – 75th Percentile</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={university.sat25thPercentile || ''}
                      onChange={(e) => handleFieldChange('sat25thPercentile', e.target.value)}
                      placeholder="1500"
                      className="w-20 text-base font-bold font-mono text-stone-900 bg-transparent border-b border-stone-200 py-1 focus:outline-none focus:border-stone-800"
                    />
                    <span className="text-stone-400">–</span>
                    <input
                      type="text"
                      value={university.sat75thPercentile || ''}
                      onChange={(e) => handleFieldChange('sat75thPercentile', e.target.value)}
                      placeholder="1570"
                      className="w-20 text-base font-bold font-mono text-stone-900 bg-transparent border-b border-stone-200 py-1 focus:outline-none focus:border-stone-800"
                    />
                  </div>
                </div>

                <div className="p-4 bg-white border border-stone-200 rounded-xl">
                  <span className="text-[11px] font-mono text-stone-500 uppercase">International Enrollment %</span>
                  <input
                    type="text"
                    value={university.internationalEnrollmentPct || ''}
                    onChange={(e) => handleFieldChange('internationalEnrollmentPct', e.target.value)}
                    placeholder="e.g. 11.2%"
                    className="w-full text-lg font-bold font-mono text-stone-900 bg-transparent border-b border-stone-200 py-1 focus:outline-none focus:border-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    Applicant Volume & Demographics
                  </label>
                  <textarea
                    rows={3}
                    value={university.overallApplicantCount || ''}
                    onChange={(e) => handleFieldChange('overallApplicantCount', e.target.value)}
                    placeholder="e.g. Total applicants: 54,000 | Admitted: 2,100 | Yield rate: 82%"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    International Applicant Specific Statistics
                  </label>
                  <textarea
                    rows={3}
                    value={university.internationalApplicantStats || ''}
                    onChange={(e) => handleFieldChange('internationalApplicantStats', e.target.value)}
                    placeholder="e.g. ~140 international students admitted per class, 100+ countries represented"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600"
                  />
                </div>
              </div>

              {/* Verified Statistics Log Table */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-wider">
                    Verified Statistical Records ({university.statsSources?.length || 0})
                  </h4>
                  <button
                    onClick={() => setNewStatModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-mono transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Verified Stat</span>
                  </button>
                </div>

                {(!university.statsSources || university.statsSources.length === 0) ? (
                  <div className="p-6 bg-white border border-dashed border-stone-300 rounded-xl text-center">
                    <p className="text-xs text-stone-500 font-sans">
                      No custom verified statistics added yet. Click &quot;Add Verified Stat&quot; to log data from Common Data Set (CDS) or official admissions releases.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl bg-white overflow-hidden">
                    {university.statsSources.map(stat => (
                      <div key={stat.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-stone-900">{stat.metricLabel}:</span>
                            <span className="text-xs font-mono text-emerald-800 font-semibold px-2 py-0.5 bg-emerald-50 rounded">
                              {stat.metricValue}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500 font-sans mt-1">
                            <span>Source: {stat.sourceTitle}</span>
                            {stat.sourceUrl && (
                              <a href={stat.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-stone-700 underline inline-flex items-center gap-0.5">
                                link <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                            <span className="ml-2">· Verified: {stat.verificationDate}</span>
                          </div>
                          {stat.notes && <p className="text-[11px] text-stone-600 mt-1 italic">{stat.notes}</p>}
                        </div>

                        <button
                          onClick={() => handleDeleteStat(stat.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer self-end sm:self-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: FINANCIAL AID & SCHOLARSHIPS */}
          {activeTab === 'finaid' && (
            <div className="space-y-6 max-w-4xl">
              <div className="p-4 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-700 leading-relaxed">
                <strong>International Aid Policy:</strong> US universities apply very different financial aid policies to international applicants than to domestic citizens. Record the exact policy and required documents (CSS Profile / ISFAA / Tax documentation) verified from the university&apos;s international financial aid office.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    International Need-Based Financial Aid Policy
                  </label>
                  <select
                    value={university.needBasedAidInternational}
                    onChange={(e) => handleFieldChange('needBasedAidInternational', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 cursor-pointer"
                  >
                    <option value="Need-Blind">Need-Blind (Aid request does NOT hurt admission chances)</option>
                    <option value="Need-Aware">Need-Aware (Financial need IS evaluated during admission)</option>
                    <option value="Limited / Competitive">Limited / Highly Competitive Need Aid</option>
                    <option value="None">None (No institutional need-based aid for international)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    CSS Profile & Financial Deadlines
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={university.cssProfileDeadline || ''}
                      onChange={(e) => handleFieldChange('cssProfileDeadline', e.target.value)}
                      placeholder="e.g. November 15 (ED) / February 1 (RD)"
                      className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600"
                    />
                    <label className="flex items-center gap-1.5 text-xs text-stone-700 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={university.cssProfileRequired}
                        onChange={(e) => handleFieldChange('cssProfileRequired', e.target.checked)}
                        className="rounded"
                      />
                      <span>CSS Profile</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Attendance Costs Breakdown */}
              <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-3">
                <h4 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-wider">
                  Cost of Attendance (Estimated USD / Year)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 mb-1">Tuition & Fees</label>
                    <input
                      type="text"
                      value={university.tuitionFeesUSD}
                      onChange={(e) => handleFieldChange('tuitionFeesUSD', e.target.value)}
                      placeholder="e.g. $64,000"
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 mb-1">Housing & Food</label>
                    <input
                      type="text"
                      value={university.housingExpensesUSD}
                      onChange={(e) => handleFieldChange('housingExpensesUSD', e.target.value)}
                      placeholder="e.g. $19,500"
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 mb-1">Total Estimated Cost</label>
                    <input
                      type="text"
                      value={university.totalEstimatedCostUSD}
                      onChange={(e) => handleFieldChange('totalEstimatedCostUSD', e.target.value)}
                      placeholder="e.g. $88,000"
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-stone-300 rounded-lg text-xs font-bold text-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 mb-1">Application Fee & Waiver</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={university.applicationFeeUSD}
                        onChange={(e) => handleFieldChange('applicationFeeUSD', e.target.value)}
                        placeholder="e.g. $85"
                        className="w-24 px-3 py-1.5 bg-[#FAF8F5] border border-stone-300 rounded-lg text-xs"
                      />
                      <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={university.feeWaiverAvailable}
                          onChange={(e) => handleFieldChange('feeWaiverAvailable', e.target.checked)}
                          className="rounded"
                        />
                        <span>Fee Waiver Eligible</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 mb-1">Merit / Full-Ride Opportunities</label>
                    <input
                      type="text"
                      value={university.fullRideOpportunities}
                      onChange={(e) => handleFieldChange('fullRideOpportunities', e.target.value)}
                      placeholder="e.g. Stamps, Robertson, Trustee, Presidential Scholarship"
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                  Required Financial Documentation (Certificates, Tax Documents, Bank Statements)
                </label>
                <textarea
                  rows={2}
                  value={university.financialDocumentationRequired}
                  onChange={(e) => handleFieldChange('financialDocumentationRequired', e.target.value)}
                  placeholder="e.g. Parents' bank statements, employer salary certificates, tax returns (NOC/TIN), ISFAA / COF form..."
                  className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                  Personal Financial Aid Strategy Notes & Calculation
                </label>
                <textarea
                  rows={4}
                  value={university.personalAidNotes}
                  onChange={(e) => handleFieldChange('personalAidNotes', e.target.value)}
                  placeholder="Record your Expected Family Contribution (EFC) considerations, target scholarship programs, and net price calculations for this institution..."
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 5: CULTURE & PREFERENCES */}
          {activeTab === 'culture' && (
            <div className="space-y-6 max-w-4xl">
              <div className="p-4 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-700 leading-relaxed">
                <strong>Open Culture & Values Notebook:</strong> Admissions committees look for institutional fit. Record what this university genuinely values—collaborative spirit, theoretical rigor, entrepreneurial drive, civic action—supported by your research from student interviews, faculty papers, and official mission statements.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    What Type of Students This University Values
                  </label>
                  <textarea
                    rows={4}
                    value={university.valuedStudentTraits}
                    onChange={(e) => handleFieldChange('valuedStudentTraits', e.target.value)}
                    placeholder="e.g. Intellectual playfulness, resilience, collaborative problem-solving, hands-on building, global consciousness..."
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    Academic Culture & Pedagogical Philosophy
                  </label>
                  <textarea
                    rows={4}
                    value={university.academicCulture}
                    onChange={(e) => handleFieldChange('academicCulture', e.target.value)}
                    placeholder="e.g. Theory-heavy vs applied, open curriculum vs core curriculum, seminar-based discussions, honor code..."
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    Research Opportunities for Undergraduates (UROP, Labs)
                  </label>
                  <textarea
                    rows={4}
                    value={university.researchOpportunities}
                    onChange={(e) => handleFieldChange('researchOpportunities', e.target.value)}
                    placeholder="e.g. UROP program funding, first-year lab placement, professor-to-student ratios in CS/Physics labs..."
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    Entrepreneurship, Innovation & Makerspaces
                  </label>
                  <textarea
                    rows={4}
                    value={university.entrepreneurshipCulture}
                    onChange={(e) => handleFieldChange('entrepreneurshipCulture', e.target.value)}
                    placeholder="e.g. Incubators, venture funds, hackathons, open machine shops, student startup culture..."
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 leading-relaxed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                  Unique University Characteristics & Personal Observations
                </label>
                <textarea
                  rows={4}
                  value={university.uniqueCharacteristics}
                  onChange={(e) => handleFieldChange('uniqueCharacteristics', e.target.value)}
                  placeholder="Record distinct traditions, campus vibes, student clubs, residential house system, or distinctive programs that excite you..."
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 6: APPLICATION STRATEGY */}
          {activeTab === 'strategy' && (
            <div className="space-y-6 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    Intended Application Round for Fall 2028
                  </label>
                  <select
                    value={university.intendedRound}
                    onChange={(e) => handleFieldChange('intendedRound', e.target.value as ApplicationRound)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 cursor-pointer font-bold"
                  >
                    <option value="ED">Early Decision (Binding)</option>
                    <option value="ED2">Early Decision II (Binding)</option>
                    <option value="EA">Early Action (Non-Binding)</option>
                    <option value="REA">Restrictive Early Action (Single-Choice)</option>
                    <option value="RD">Regular Decision</option>
                    <option value="Rolling">Rolling Admission</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    Available Rounds at this Institution
                  </label>
                  <div className="flex flex-wrap items-center gap-3 py-2 text-xs">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={university.edAvailable}
                        onChange={(e) => handleFieldChange('edAvailable', e.target.checked)}
                      />
                      <span>ED</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={university.eaAvailable}
                        onChange={(e) => handleFieldChange('eaAvailable', e.target.checked)}
                      />
                      <span>EA</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={university.reaAvailable}
                        onChange={(e) => handleFieldChange('reaAvailable', e.target.checked)}
                      />
                      <span>REA</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={university.rdAvailable}
                        onChange={(e) => handleFieldChange('rdAvailable', e.target.checked)}
                      />
                      <span>RD</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    Early Round Deadline (ED / EA / REA)
                  </label>
                  <input
                    type="date"
                    value={university.edDeadline || university.eaDeadline || ''}
                    onChange={(e) => handleFieldChange('edDeadline', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                    Regular Decision Deadline (RD)
                  </label>
                  <input
                    type="date"
                    value={university.rdDeadline || ''}
                    onChange={(e) => handleFieldChange('rdDeadline', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                  Personal Strategic Rationale & Round Choice
                </label>
                <textarea
                  rows={4}
                  value={university.personalStrategyReasons}
                  onChange={(e) => handleFieldChange('personalStrategyReasons', e.target.value)}
                  placeholder="Explain why you chose this specific round (e.g. balancing financial aid risk, readiness of SAT scores, EA merit scholarship requirement)..."
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                  Decision Notes & Status
                </label>
                <textarea
                  rows={3}
                  value={university.decisionNotes}
                  onChange={(e) => handleFieldChange('decisionNotes', e.target.value)}
                  placeholder="Track application submission dates, portal confirmation, checklist completion, or admission results..."
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-1 focus:ring-stone-600 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 7: PERSONAL NOTES (RICH-TEXT WRITING ENGINE) */}
          {activeTab === 'notes' && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif">
                    Unrestricted Research Notebook
                  </h3>
                  <p className="text-xs text-stone-500 font-sans">
                    Use this dedicated notebook to write anything you discover during your university research.
                  </p>
                </div>
              </div>

              <WritingEditor
                title={`${university.name} Notes`}
                content={university.personalNotesMarkdown}
                onChange={(html) => handleFieldChange('personalNotesMarkdown', html)}
                placeholder="Write freeform notes, professor research citations, summer program possibilities, course requirements..."
              />
            </div>
          )}

          {/* TAB 8: RESEARCH SOURCES */}
          {activeTab === 'sources' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif">
                    Research Sources & Official Citations ({university.sources?.length || 0})
                  </h3>
                  <p className="text-xs text-stone-500 font-sans">
                    Log and track official sources, Common Data Set links, and international financial aid pages.
                  </p>
                </div>

                <button
                  onClick={() => setNewSourceModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-mono transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Source</span>
                </button>
              </div>

              {(!university.sources || university.sources.length === 0) ? (
                <div className="p-8 bg-white border border-dashed border-stone-300 rounded-2xl text-center">
                  <Link2 className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs text-stone-600 font-sans font-medium">
                    No research sources logged yet for {university.name}.
                  </p>
                  <p className="text-[11px] text-stone-400 font-sans mt-0.5">
                    Add official admissions URLs, CDS reports, and financial aid guidelines to verify your records.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {university.sources.map(src => (
                    <div key={src.id} className="p-4 bg-white border border-stone-200 rounded-xl flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                            {src.sourceType}
                          </span>
                          <span className="text-xs font-bold text-stone-900 font-sans">{src.title}</span>
                        </div>

                        {src.url && (
                          <a 
                            href={src.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-stone-600 hover:text-stone-900 underline inline-flex items-center gap-1 font-mono break-all"
                          >
                            <span>{src.url}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        )}

                        <div className="text-[11px] text-stone-500 font-mono">
                          <span>Researched: {src.dateResearched}</span>
                          <span className="mx-1.5">·</span>
                          <span>Verified: {src.lastVerifiedDate}</span>
                        </div>

                        {src.notes && (
                          <p className="text-xs text-stone-600 font-sans mt-1 bg-[#FAF8F5] p-2 rounded-lg">
                            {src.notes}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteSource(src.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Delete Source"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Status Bar */}
        <div className="px-6 py-3 bg-[#F2EDE4] border-t border-[#EAE6DE] flex items-center justify-between text-xs font-mono text-stone-600 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Autosaved to workspace</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Last updated: {new Date(university.updatedAt).toLocaleDateString()}</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              Done & Save
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center border border-stone-200 shadow-2xl">
            <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Delete University Profile?
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Are you sure you want to delete <strong>{university.name}</strong> and all associated research notes? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-1.5 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteUniversity(university.id);
                  onClose();
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono rounded-xl"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Source Modal */}
      {newSourceModal && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-stone-900 font-serif">Add Research Source</h3>
            <div>
              <label className="block text-xs font-mono text-stone-700 mb-1">Source Title *</label>
              <input
                type="text"
                value={newSource.title}
                onChange={(e) => setNewSource({ ...newSource, title: e.target.value })}
                placeholder="e.g. Stanford CDS 2024-2025 Section C"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-stone-700 mb-1">URL / Link</label>
              <input
                type="url"
                value={newSource.url}
                onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">Source Type</label>
                <select
                  value={newSource.sourceType}
                  onChange={(e) => setNewSource({ ...newSource, sourceType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
                >
                  <option value="Official Admissions">Official Admissions</option>
                  <option value="Common Data Set">Common Data Set (CDS)</option>
                  <option value="Financial Aid Office">Financial Aid Office</option>
                  <option value="Student Forum">Student / Alumni Interview</option>
                  <option value="Faculty Page">Faculty / Department Page</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">Verification Date</label>
                <input
                  type="date"
                  value={newSource.lastVerifiedDate}
                  onChange={(e) => setNewSource({ ...newSource, lastVerifiedDate: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-stone-700 mb-1">Source Notes</label>
              <textarea
                rows={2}
                value={newSource.notes}
                onChange={(e) => setNewSource({ ...newSource, notes: e.target.value })}
                placeholder="Key takeaways or quotes from this source..."
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setNewSourceModal(false)}
                className="px-3.5 py-1.5 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSource}
                className="px-4 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-mono font-medium"
              >
                Save Source
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Stat Modal */}
      {newStatModal && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-stone-900 font-serif">Add Verified Admission Stat</h3>
            <div>
              <label className="block text-xs font-mono text-stone-700 mb-1">Metric Label *</label>
              <input
                type="text"
                value={newStat.metricLabel}
                onChange={(e) => setNewStat({ ...newStat, metricLabel: e.target.value })}
                placeholder="e.g. Regular Decision Acceptance Rate, SAT Math 75th"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-stone-700 mb-1">Metric Value *</label>
              <input
                type="text"
                value={newStat.metricValue}
                onChange={(e) => setNewStat({ ...newStat, metricValue: e.target.value })}
                placeholder="e.g. 3.2% or 790-800"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">Source Title</label>
                <input
                  type="text"
                  value={newStat.sourceTitle}
                  onChange={(e) => setNewStat({ ...newStat, sourceTitle: e.target.value })}
                  placeholder="e.g. Harvard Gazette 2024"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">Verification Date</label>
                <input
                  type="date"
                  value={newStat.verificationDate}
                  onChange={(e) => setNewStat({ ...newStat, verificationDate: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-stone-700 mb-1">Source URL</label>
              <input
                type="url"
                value={newStat.sourceUrl}
                onChange={(e) => setNewStat({ ...newStat, sourceUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setNewStatModal(false)}
                className="px-3.5 py-1.5 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStat}
                className="px-4 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-mono font-medium"
              >
                Save Stat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
