import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Globe, 
  Filter, 
  Columns, 
  Star, 
  ExternalLink, 
  MapPin, 
  GraduationCap, 
  DollarSign, 
  Check, 
  ChevronRight, 
  BookOpen,
  ArrowUpDown,
  X,
  FileText,
  SlidersHorizontal,
  ChevronLeft,
  Building
} from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { 
  CollegeCategory, 
  UniversityProfile, 
  ApplicationRound 
} from '../../types/usaApp';
import { DISCOVERY_UNIVERSITIES, UniversityDiscoveryItem } from '../../data/initialUsaData';
import { UniversityProfileModal } from './UniversityProfileModal';
import { UniversityCompareModal } from './UniversityCompareModal';
import { EditableDate } from './EditableDate';

export const CollegeListView: React.FC = () => {
  const { 
    universities, 
    addUniversity, 
    updateUniversity,
    selectedCollegeTab, 
    setSelectedCollegeTab, 
    selectedUniversityId, 
    setSelectedUniversityId,
    moveUniversityCategory,
    toggleFavoriteUniversity,
    satArchive,
    supplementalNotebooks,
    researchVaultItems,
    setActiveSubSection
  } = useUsaApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAidPolicy, setFilterAidPolicy] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'deadline' | 'updated'>('name');

  // Modals
  const [isDiscoveryModalOpen, setIsDiscoveryModalOpen] = useState(false);
  const [isAddCustomModalOpen, setIsAddCustomModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isFullProfileModalOpen, setIsFullProfileModalOpen] = useState(false);

  // New Custom University State
  const [customForm, setCustomForm] = useState({
    name: '',
    category: selectedCollegeTab as CollegeCategory,
    country: 'United States',
    state: '',
    city: '',
    officialWebsite: '',
    universityType: 'Private Nonprofit' as const,
    intendedMajor: '',
    satPolicy: 'Required' as const,
    needBasedAidInternational: 'Need-Aware' as const,
    tuitionFeesUSD: '',
    intendedRound: 'RD' as ApplicationRound,
    whyISelectedThisUniversity: ''
  });

  // Discovery Directory Search & Filters
  const [discoverySearch, setDiscoverySearch] = useState('');
  const [discoveryTierFilter, setDiscoveryTierFilter] = useState<'all' | 'reach' | 'target' | 'safety'>('all');
  const [discoveryAidFilter, setDiscoveryAidFilter] = useState<'all' | 'Need-Blind' | 'Need-Aware'>('all');

  // Counts by category
  const counts = useMemo(() => {
    const unarchived = universities.filter(u => !u.isArchived);
    return {
      reach: unarchived.filter(u => u.category === 'reach').length,
      target: unarchived.filter(u => u.category === 'target').length,
      safety: unarchived.filter(u => u.category === 'safety').length,
      total: unarchived.length
    };
  }, [universities]);

  // Filtered saved universities
  const filteredUniversities = useMemo(() => {
    return universities.filter(u => {
      if (u.isArchived) return false;
      if (u.category !== selectedCollegeTab) return false;
      
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesLoc = `${u.city} ${u.state} ${u.country}`.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc) return false;
      }

      if (filterType !== 'all' && u.universityType !== filterType) return false;
      if (filterAidPolicy !== 'all' && u.needBasedAidInternational !== filterAidPolicy) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (a.rdDeadline || '').localeCompare(b.rdDeadline || '');
    });
  }, [universities, selectedCollegeTab, searchQuery, filterType, filterAidPolicy, sortBy]);

  // Selected University for the Right Dossier Panel
  const selectedUniv = useMemo(() => {
    if (selectedUniversityId) {
      const found = universities.find(u => u.id === selectedUniversityId);
      if (found) return found;
    }
    return filteredUniversities[0] || universities[0];
  }, [universities, selectedUniversityId, filteredUniversities]);

  // Filtered Discovery Directory
  const filteredDiscovery = useMemo(() => {
    return DISCOVERY_UNIVERSITIES.filter(item => {
      const q = discoverySearch.toLowerCase().trim();
      if (q) {
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesLoc = `${item.city} ${item.state} ${item.country}`.toLowerCase().includes(q);
        const matchesMajor = item.undergraduatePrograms.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc && !matchesMajor) return false;
      }
      if (discoveryTierFilter !== 'all' && item.suggestedTier !== discoveryTierFilter) return false;
      if (discoveryAidFilter !== 'all' && item.internationalAidPolicy !== discoveryAidFilter) return false;
      return true;
    });
  }, [discoverySearch, discoveryTierFilter, discoveryAidFilter]);

  const handleAddFromDiscovery = (item: UniversityDiscoveryItem, tier: CollegeCategory) => {
    if (universities.some(u => u.name.toLowerCase() === item.name.toLowerCase())) return;
    const newId = addUniversity({
      name: item.name,
      category: tier,
      isFavorite: false,
      isArchived: false,
      country: item.country,
      state: item.state,
      city: item.city,
      officialWebsite: item.officialWebsite,
      universityType: item.universityType,
      commonAppMember: item.commonAppAvailable,
      satPolicy: item.satPolicy,
      needBasedAidInternational: item.internationalAidPolicy as any,
      intendedRound: item.typicalRounds[0] || 'RD',
      admissionRequirementsSummary: item.overview,
      whyISelectedThisUniversity: item.undergraduatePrograms,
      applicationDeadlines: { rdDeadline: '2028-01-01' },
      researchSources: [
        {
          id: `src-${Date.now()}`,
          title: `${item.name} Official Admissions Portal`,
          url: item.officialWebsite,
          dateResearched: new Date().toISOString().split('T')[0],
          lastVerifiedDate: new Date().toISOString().split('T')[0],
          sourceType: 'Official Admissions',
          notes: 'Added from Worldwide Discovery Directory.'
        }
      ],
      verifiedStats: []
    });
    setSelectedUniversityId(newId);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customForm.name.trim()) return;
    const newId = addUniversity({
      name: customForm.name.trim(),
      category: customForm.category,
      isFavorite: false,
      isArchived: false,
      country: customForm.country.trim(),
      state: customForm.state.trim(),
      city: customForm.city.trim(),
      officialWebsite: customForm.officialWebsite.trim(),
      universityType: customForm.universityType,
      intendedMajor: customForm.intendedMajor.trim(),
      satPolicy: customForm.satPolicy,
      needBasedAidInternational: customForm.needBasedAidInternational,
      tuitionFeesUSD: customForm.tuitionFeesUSD.trim(),
      intendedRound: customForm.intendedRound,
      whyISelectedThisUniversity: customForm.whyISelectedThisUniversity.trim(),
      applicationDeadlines: { rdDeadline: '2028-01-01' },
      researchSources: [],
      verifiedStats: []
    });
    setIsAddCustomModalOpen(false);
    setSelectedUniversityId(newId);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1720px] mx-auto space-y-6 text-[#292724]">
      {/* 1. Collegiate Architectural Banner matching image_839a375d.png */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#29231E] via-[#3B302A] to-[#4A3B31] text-[#F8F6F2] p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#D8C5AE] mb-1">
              <span>USA Application</span>
              <span>›</span>
              <span className="text-white font-semibold">College List</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
              College List
            </h1>
            <p className="text-[#D8C5AE] text-sm mt-1 font-serif italic">
              Find the right fit. Build your dream list.
            </p>
          </div>

          <div className="bg-black/35 backdrop-blur-xs border border-white/10 rounded-xl p-4 text-right self-start md:self-auto">
            <p className="text-sm font-serif italic text-white leading-relaxed">
              “Dream big. Plan smart.”
            </p>
            <span className="text-[10px] font-mono tracking-widest text-[#D8C5AE] uppercase block">
              — COMEBACK
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Controls Bar: Reach, Target, Safety & Add University */}
      <div className="bg-white rounded-2xl border border-[#EAE4DC] p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Category Tabs */}
          <button
            onClick={() => setSelectedCollegeTab('reach')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedCollegeTab === 'reach'
                ? 'bg-[#3B302A] text-white shadow-xs'
                : 'bg-stone-50 hover:bg-[#F2ECE4] text-stone-700 border border-stone-200'
            }`}
          >
            <span>Reach ({counts.reach})</span>
          </button>

          <button
            onClick={() => setSelectedCollegeTab('target')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedCollegeTab === 'target'
                ? 'bg-[#3B302A] text-white shadow-xs'
                : 'bg-stone-50 hover:bg-[#F2ECE4] text-stone-700 border border-stone-200'
            }`}
          >
            <span>Target ({counts.target})</span>
          </button>

          <button
            onClick={() => setSelectedCollegeTab('safety')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedCollegeTab === 'safety'
                ? 'bg-[#3B302A] text-white shadow-xs'
                : 'bg-stone-50 hover:bg-[#F2ECE4] text-stone-700 border border-stone-200'
            }`}
          >
            <span>Safety ({counts.safety})</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCompareModalOpen(true)}
            disabled={universities.length < 2}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Compare ({universities.length})</span>
          </button>

          <button
            onClick={() => setIsDiscoveryModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-stone-600" />
            <span>Directory</span>
          </button>

          <button
            onClick={() => setIsAddCustomModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3B302A] hover:bg-[#292724] text-white rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add University</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Country, Type, Tuition, Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search colleges..."
              className="pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 w-48 sm:w-56"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 cursor-pointer"
          >
            <option value="all">Type: All</option>
            <option value="Private Nonprofit">Private</option>
            <option value="Public State">Public</option>
          </select>

          <select
            value={filterAidPolicy}
            onChange={(e) => setFilterAidPolicy(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 cursor-pointer"
          >
            <option value="all">Aid: All</option>
            <option value="Need-Blind">Need-Blind</option>
            <option value="Need-Aware">Need-Aware</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 cursor-pointer"
          >
            <option value="name">Name A-Z</option>
            <option value="deadline">Deadline</option>
          </select>
        </div>
      </div>

      {/* 3. Main 2-Column Split matching image_839a375d.png */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: University Cards Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredUniversities.length === 0 && (
              <div className="sm:col-span-2 p-8 bg-white border border-dashed border-stone-300 rounded-2xl text-center space-y-3">
                <Building className="w-8 h-8 text-stone-300 mx-auto" />
                <h4 className="text-sm font-serif font-bold text-stone-900">
                  No {selectedCollegeTab.toUpperCase()} universities added yet
                </h4>
                <p className="text-xs font-sans text-stone-500 max-w-sm mx-auto">
                  Pick from our Directory of verified colleges or add custom universities to build your {selectedCollegeTab} tier.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => setIsDiscoveryModalOpen(true)}
                    className="px-4 py-2 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-bold hover:bg-stone-900 cursor-pointer shadow-xs"
                  >
                    Browse Directory
                  </button>
                  <button
                    onClick={() => setIsAddCustomModalOpen(true)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-mono font-bold cursor-pointer"
                  >
                    + Add Custom College
                  </button>
                </div>
              </div>
            )}

            {filteredUniversities.map(univ => {
              const isSelected = selectedUniv?.id === univ.id;
              const progressPct = univ.researchProgress || 70;
              return (
                <div
                  key={univ.id}
                  onClick={() => setSelectedUniversityId(univ.id)}
                  className={`bg-white rounded-2xl border p-4.5 shadow-2xs space-y-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#3B302A] ring-2 ring-[#3B302A]/20 bg-stone-50/50'
                      : 'border-[#EAE4DC] hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#3B302A] text-white flex items-center justify-center font-serif font-bold text-base shadow-xs shrink-0">
                        {univ.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-serif font-bold text-stone-900 leading-tight">
                          {univ.name}
                        </h3>
                        <p className="text-[11px] font-sans text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{univ.city}, {univ.state || univ.country}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteUniversity(univ.id);
                      }}
                      className="p-1 text-stone-300 hover:text-amber-500 transition-colors cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${univ.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* Pills */}
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                      univ.category === 'reach' ? 'bg-amber-100 text-amber-900' :
                      univ.category === 'target' ? 'bg-stone-200 text-stone-800' :
                      'bg-emerald-100 text-emerald-900'
                    }`}>
                      {univ.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {univ.universityType === 'Public State' ? 'Public' : 'Private'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      Top {univ.category === 'reach' ? '5' : univ.category === 'target' ? '15' : '20'}
                    </span>
                  </div>

                  {/* Research Progress Bar */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[10px] font-mono text-stone-500 mb-1">
                      <span>Research & Readiness</span>
                      <span className="font-bold text-stone-900">{progressPct}%</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-[#3B302A] h-full rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* "+ Add a New University" Card */}
            <div
              onClick={() => setIsAddCustomModalOpen(true)}
              className="bg-stone-50/60 hover:bg-[#F2ECE4] border border-dashed border-stone-300 rounded-2xl p-6 flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-600 group-hover:text-stone-900">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-serif font-bold text-stone-900">
                    Add a New University
                  </h4>
                  <p className="text-[11px] font-sans text-stone-500">
                    Manually add a university to your list.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 transition-colors" />
            </div>
          </div>

          {/* Simple Pagination */}
          <div className="flex items-center justify-center gap-1.5 pt-2 text-xs font-mono">
            <button className="p-1 rounded text-stone-400 hover:text-stone-900 cursor-pointer">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2.5 py-1 rounded bg-[#3B302A] text-white font-bold">1</span>
            <span className="px-2.5 py-1 rounded hover:bg-stone-100 text-stone-700 cursor-pointer">2</span>
            <span className="px-2.5 py-1 rounded hover:bg-stone-100 text-stone-700 cursor-pointer">3</span>
            <span className="text-stone-400">···</span>
            <button className="p-1 rounded text-stone-400 hover:text-stone-900 cursor-pointer">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Selected University Dossier Panel matching image_839a375d.png (5 cols) */}
        {!selectedUniv ? (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-dashed border-[#EAE4DC] p-8 shadow-2xs text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
              <Building className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-serif font-bold text-stone-800">
                No College Selected
              </h3>
              <p className="text-xs text-stone-500 font-sans max-w-sm mx-auto">
                Add universities from the Discovery Directory or add custom institutions to view detailed admission guidelines, financial aid policies, and test requirements.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setIsDiscoveryModalOpen(true)}
                className="px-4 py-2 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-bold hover:bg-stone-900 cursor-pointer shadow-xs"
              >
                Browse Directory
              </button>
              <button
                onClick={() => setIsAddCustomModalOpen(true)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-mono font-bold cursor-pointer"
              >
                + Add Custom
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-2xs space-y-4 sticky top-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#3B302A] text-white flex items-center justify-center font-serif font-bold text-lg shadow-xs shrink-0">
                  {selectedUniv.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-stone-900 leading-tight">
                    {selectedUniv.name}
                  </h3>
                  <p className="text-xs font-sans text-stone-500 mt-0.5">
                    {selectedUniv.city}, {selectedUniv.state || selectedUniv.country}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsFullProfileModalOpen(true)}
                  className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F2ECE4] border border-[#EAE4DC] text-stone-800 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Open in Full View</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Sub-nav tabs */}
            <div className="flex items-center gap-3 text-xs font-mono border-b border-stone-100 pb-2 text-stone-600">
              <span className="font-bold text-[#3B302A] border-b-2 border-[#3B302A] pb-1 cursor-pointer">
                Overview
              </span>
              <span 
                onClick={() => setIsFullProfileModalOpen(true)}
                className="hover:text-stone-900 cursor-pointer"
              >
                Requirements
              </span>
              <span 
                onClick={() => setIsFullProfileModalOpen(true)}
                className="hover:text-stone-900 cursor-pointer"
              >
                Statistics
              </span>
              <span 
                onClick={() => setIsFullProfileModalOpen(true)}
                className="hover:text-stone-900 cursor-pointer"
              >
                Financial Aid
              </span>
              <span 
                onClick={() => setIsFullProfileModalOpen(true)}
                className="hover:text-stone-900 cursor-pointer"
              >
                Culture
              </span>
            </div>

            {/* Correlation Alert: Test Policy Fit */}
            {satArchive.records.length > 0 && (
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Your Latest SAT</span>
                  <span className="font-bold text-stone-900">{satArchive.records[0].totalScore} / 1600</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">College Range / Policy</span>
                  <span className="font-semibold text-[#3B302A]">
                    {selectedUniv.satMiddle50 || selectedUniv.satPolicy || 'Test-Optional'}
                  </span>
                </div>
              </div>
            )}

            {/* About & Why */}
            <div className="space-y-3 text-xs font-sans">
              <div>
                <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">
                  About {selectedUniv.name}
                </h4>
                <p className="text-stone-600 leading-relaxed">
                  {selectedUniv.admissionRequirementsSummary || 
                   `${selectedUniv.name} is a premier institution known for academic excellence, innovation, and vibrant undergraduate research.`}
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">
                  Why {selectedUniv.name}?
                </h4>
                <ul className="space-y-1 text-stone-600">
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-700">✓</span>
                    <span>Strong undergraduate research opportunities</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-700">✓</span>
                    <span>Vibrant campus culture & entrepreneurial ecosystem</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-700">✓</span>
                    <span>Interdisciplinary engineering & STEM freedom</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Info Box */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100 space-y-2 text-xs font-mono">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Quick Info
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-stone-500 block">Website:</span>
                  <a 
                    href={selectedUniv.officialWebsite || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-semibold text-blue-700 hover:underline truncate block"
                  >
                    {(selectedUniv.officialWebsite || 'Official site').replace('https://', '')}
                  </a>
                </div>
                <div>
                  <span className="text-stone-500 block">Location:</span>
                  <span className="font-semibold text-stone-900 truncate block">
                    {selectedUniv.city || 'US'}, {selectedUniv.state || selectedUniv.country}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Type:</span>
                  <span className="font-semibold text-stone-900">
                    {selectedUniv.universityType}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Aid for Intl:</span>
                  <span className="font-semibold text-stone-900">
                    {selectedUniv.needBasedAidInternational || 'Need-Aware'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section Correlation 1: Supplemental Essays Link */}
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE4DC] flex items-center justify-between text-xs font-mono">
              <div>
                <span className="font-bold text-stone-800 block">Supplemental Essays</span>
                <span className="text-[10px] text-stone-500">
                  {supplementalNotebooks[selectedUniv.id]?.questions?.length || 0} questions configured
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedUniversityId(selectedUniv.id);
                  setActiveSubSection('essays');
                }}
                className="px-2.5 py-1 bg-[#3B302A] text-white rounded-lg text-[10px] font-bold hover:bg-stone-900 cursor-pointer"
              >
                Write Essays →
              </button>
            </div>

            {/* Section Correlation 2: Linked Research Vault Items */}
            {researchVaultItems.filter(r => r.relatedUniversityId === selectedUniv.id).length > 0 && (
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs font-mono">
                <span className="text-[10px] font-bold uppercase text-stone-500 block">
                  Linked Research Vault Items ({researchVaultItems.filter(r => r.relatedUniversityId === selectedUniv.id).length})
                </span>
                <div className="space-y-1">
                  {researchVaultItems.filter(r => r.relatedUniversityId === selectedUniv.id).map(item => (
                    <div key={item.id} className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-800 truncate">• {item.title}</span>
                      <button 
                        onClick={() => setActiveSubSection('vault')}
                        className="text-amber-800 hover:underline shrink-0 text-[10px]"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* My Notes Box */}
            <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-stone-700 font-mono">
                <span className="font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#3B302A]" />
                  My Notes
                </span>
                <span className="text-[10px] text-stone-400">Autosaves</span>
              </div>
              <textarea
                value={selectedUniv.whyISelectedThisUniversity || ''}
                onChange={(e) => updateUniversity(selectedUniv.id, { whyISelectedThisUniversity: e.target.value })}
                rows={2}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded text-xs font-sans text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
                placeholder="Personal thoughts, professor interests, or strategy..."
              />
            </div>

            {/* Application Strategy Box with EDITABLE DEADLINE */}
            <div className="p-3.5 bg-amber-50/50 border border-amber-200/70 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-800" />
                  Application Strategy
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-900">
                  {selectedUniv.category}
                </span>
              </div>

              <div className="text-[11px] text-stone-700 space-y-1">
                <div>Intended Round: <strong>{selectedUniv.intendedRound || 'RD'}</strong></div>
                <div className="flex items-center gap-2 pt-1 border-t border-amber-200/50">
                  <span className="font-bold text-stone-900">Deadline:</span>
                  <EditableDate 
                    value={selectedUniv.rdDeadline || '2028-01-01'}
                    onSave={(newDate) => updateUniversity(selectedUniv.id, { rdDeadline: newDate })}
                    displayMode="badge"
                    label="Application Submission Deadline"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {/* 1. Full 8-Tab University Dossier Modal */}
      {isFullProfileModalOpen && selectedUniv && (
        <UniversityProfileModal
          universityId={selectedUniv.id}
          onClose={() => setIsFullProfileModalOpen(false)}
        />
      )}

      {/* 2. Side-by-side Comparison Modal */}
      {isCompareModalOpen && (
        <UniversityCompareModal onClose={() => setIsCompareModalOpen(false)} />
      )}

      {/* 3. Worldwide Discovery Directory Modal */}
      {isDiscoveryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-[#FAF8F5] border border-[#EAE6DE] rounded-2xl shadow-2xl max-w-5xl w-full h-[88vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
            <div className="px-6 py-4 bg-white border-b border-[#EAE6DE] flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Worldwide University Discovery Directory
                </h3>
                <p className="text-xs text-stone-500 font-sans mt-0.5">
                  Verified testing & international financial aid policies. Click to add directly to your list.
                </p>
              </div>
              <button
                onClick={() => setIsDiscoveryModalOpen(false)}
                className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-3 bg-[#F2EDE4] border-b border-[#EAE6DE] flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={discoverySearch}
                  onChange={(e) => setDiscoverySearch(e.target.value)}
                  placeholder="Search directory by name, state, programs..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={discoveryTierFilter}
                  onChange={(e) => setDiscoveryTierFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-700 cursor-pointer"
                >
                  <option value="all">All Tiers</option>
                  <option value="reach">Reach</option>
                  <option value="target">Target</option>
                  <option value="safety">Safety</option>
                </select>

                <select
                  value={discoveryAidFilter}
                  onChange={(e) => setDiscoveryAidFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-700 cursor-pointer"
                >
                  <option value="all">All Aid</option>
                  <option value="Need-Blind">Need-Blind</option>
                  <option value="Need-Aware">Need-Aware</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {filteredDiscovery.map(item => {
                const isAdded = universities.some(u => u.name.toLowerCase() === item.name.toLowerCase());
                return (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-xl border border-stone-200 hover:border-stone-400 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          item.suggestedTier === 'reach' ? 'bg-amber-100 text-amber-900' :
                          item.suggestedTier === 'target' ? 'bg-stone-200 text-stone-800' :
                          'bg-emerald-100 text-emerald-900'
                        }`}>
                          {item.suggestedTier}
                        </span>
                        <h4 className="text-base font-serif font-bold text-stone-900">{item.name}</h4>
                      </div>
                      <p className="text-xs font-sans text-stone-600 line-clamp-2">{item.overview}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-stone-500 pt-1">
                        <span>SAT: <b className="text-stone-800">{item.satPolicy}</b></span>
                        <span>·</span>
                        <span>Aid: <b className="text-stone-800">{item.internationalAidPolicy}</b></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isAdded ? (
                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-mono font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAddFromDiscovery(item, item.suggestedTier)}
                          className="px-3.5 py-1.5 bg-[#3B302A] hover:bg-[#292724] text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to List</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. Add Custom University Modal */}
      {isAddCustomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-white border border-stone-200 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Add Custom University
              </h3>
              <button
                onClick={() => setIsAddCustomModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustom} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-stone-500 mb-1">University Name</label>
                <input
                  type="text"
                  value={customForm.name}
                  onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                  placeholder="e.g. Dartmouth College"
                  className="w-full p-2 border border-stone-200 rounded-lg font-bold text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-500 mb-1">Category Tier</label>
                  <select
                    value={customForm.category}
                    onChange={(e) => setCustomForm({ ...customForm, category: e.target.value as any })}
                    className="w-full p-2 border border-stone-200 rounded-lg bg-stone-50"
                  >
                    <option value="reach">Reach</option>
                    <option value="target">Target</option>
                    <option value="safety">Safety</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">Institution Type</label>
                  <select
                    value={customForm.universityType}
                    onChange={(e) => setCustomForm({ ...customForm, universityType: e.target.value as any })}
                    className="w-full p-2 border border-stone-200 rounded-lg bg-stone-50"
                  >
                    <option value="Private Nonprofit">Private Nonprofit</option>
                    <option value="Public State">Public State</option>
                    <option value="Liberal Arts College">Liberal Arts College</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-500 mb-1">City, State</label>
                  <input
                    type="text"
                    value={customForm.city}
                    onChange={(e) => setCustomForm({ ...customForm, city: e.target.value })}
                    placeholder="Hanover, NH"
                    className="w-full p-2 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">Official Website</label>
                  <input
                    type="url"
                    value={customForm.officialWebsite}
                    onChange={(e) => setCustomForm({ ...customForm, officialWebsite: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddCustomModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3B302A] hover:bg-[#292724] text-white rounded-lg font-bold cursor-pointer"
                >
                  Add to My List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
