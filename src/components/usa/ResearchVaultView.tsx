import React, { useState, useMemo } from 'react';
import { 
  Bookmark, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Search, 
  FileText, 
  Link2, 
  Calendar,
  Building,
  GraduationCap,
  DollarSign,
  Trophy,
  Globe,
  Compass,
  PenTool,
  Calculator,
  Headphones,
  Award,
  Star,
  Plane,
  BookOpen,
  Folder,
  Clock,
  LayoutGrid,
  List as ListIcon,
  ChevronRight
} from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { ResearchVaultItem, VaultCategory } from '../../types/usaApp';
import { EditableDate } from './EditableDate';

export const ResearchVaultView: React.FC = () => {
  const { 
    researchVaultItems, 
    addResearchVaultItem, 
    deleteResearchVaultItem,
    universities,
    setSelectedUniversityId,
    setActiveTab
  } = useUsaApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [newModalOpen, setNewModalOpen] = useState(false);

  // Editable dates map
  const [itemDates, setItemDates] = useState<Record<string, string>>({
    'v-1': 'Nov 5, 2026',
    'v-2': 'Nov 2, 2026',
    'v-3': 'Oct 28, 2026',
    'v-4': 'Oct 22, 2026',
    'v-5': 'Oct 15, 2026',
    'v-6': 'Oct 10, 2026',
  });

  const [itemForm, setItemForm] = useState({
    title: '',
    description: '',
    category: 'University Research' as VaultCategory,
    sourceUrl: '',
    lastVerifiedDate: 'Nov 9, 2026',
    tagsText: 'Admissions, Fall 2028',
    personalNotes: ''
  });

  const categoriesConfig: { label: string; icon: React.ReactNode; categoryKey: string }[] = [
    { label: 'University Research', icon: <GraduationCap className="w-4 h-4" />, categoryKey: 'University Research' },
    { label: 'Admission Requirements', icon: <DollarSign className="w-4 h-4" />, categoryKey: 'Admission Requirements' },
    { label: 'Financial Aid & Scholarships', icon: <Trophy className="w-4 h-4" />, categoryKey: 'Financial Aid' },
    { label: 'International Students', icon: <Globe className="w-4 h-4" />, categoryKey: 'International Students' },
    { label: 'Application Strategy', icon: <Compass className="w-4 h-4" />, categoryKey: 'Application Strategy' },
    { label: 'Essays & Writing', icon: <PenTool className="w-4 h-4" />, categoryKey: 'Essays' },
    { label: 'SAT & Standardized Tests', icon: <Calculator className="w-4 h-4" />, categoryKey: 'SAT' },
    { label: 'IELTS / TOEFL', icon: <Headphones className="w-4 h-4" />, categoryKey: 'IELTS / TOEFL' },
    { label: 'ECAs & Achievements', icon: <Award className="w-4 h-4" />, categoryKey: 'ECAs' },
    { label: 'Passion Projects', icon: <Star className="w-4 h-4" />, categoryKey: 'Passion Projects' },
    { label: 'Visa & Immigration', icon: <Plane className="w-4 h-4" />, categoryKey: 'Visa Information' },
    { label: 'General Research', icon: <BookOpen className="w-4 h-4" />, categoryKey: 'Scholarships' },
  ];

  const filteredItems = useMemo(() => {
    return researchVaultItems.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        const matchesNotes = (item.personalNotes || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesNotes) return false;
      }
      return true;
    });
  }, [researchVaultItems, selectedCategory, searchQuery]);

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.title.trim()) return;

    const newId = `vault-${Date.now()}`;
    addResearchVaultItem({
      title: itemForm.title.trim(),
      description: itemForm.description.trim(),
      category: itemForm.category,
      sourceUrl: itemForm.sourceUrl.trim(),
      lastVerifiedDate: itemForm.lastVerifiedDate,
      tags: itemForm.tagsText.split(',').map(s => s.trim()).filter(Boolean),
      personalNotes: itemForm.personalNotes.trim()
    });

    setItemDates(prev => ({ ...prev, [newId]: itemForm.lastVerifiedDate }));
    setItemForm({
      title: '',
      description: '',
      category: 'University Research',
      sourceUrl: '',
      lastVerifiedDate: 'Nov 9, 2026',
      tagsText: '',
      personalNotes: ''
    });
    setNewModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-sans mb-1">
            <span>&lt;</span>
            <button 
              onClick={() => setActiveTab('usa-dashboard')}
              className="hover:text-stone-900 cursor-pointer font-medium uppercase tracking-wider text-[11px] font-mono"
            >
              USA APPLICATION / RESEARCH VAULT
            </button>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 font-serif tracking-tight">
            Research Vault
          </h1>
          <p className="text-sm text-stone-600 font-serif italic mt-0.5">
            Everything worth knowing, organized in one place.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search research..."
            className="w-full pl-8 pr-3 py-2 bg-white border border-[#E2DBD1] rounded-xl text-xs font-sans text-stone-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Top 4 Stat Cards (Matches image_bc55f446.png) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F4EFEA] border border-[#E2DBD1] flex items-center justify-center text-stone-700 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-stone-900 block leading-tight">
              {researchVaultItems.length}
            </span>
            <span className="text-xs text-stone-500 font-sans">Total Research Entries</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F4EFEA] border border-[#E2DBD1] flex items-center justify-center text-stone-700 shrink-0">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-stone-900 block leading-tight">
              14
            </span>
            <span className="text-xs text-stone-500 font-sans">Saved Documents</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F4EFEA] border border-[#E2DBD1] flex items-center justify-center text-stone-700 shrink-0">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-stone-900 block leading-tight">
              26
            </span>
            <span className="text-xs text-stone-500 font-sans">Saved Links</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F4EFEA] border border-[#E2DBD1] flex items-center justify-center text-stone-700 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-stone-900 block leading-tight">
              8
            </span>
            <span className="text-xs text-stone-500 font-sans">Recently Updated</span>
          </div>
        </div>
      </div>

      {/* Research Categories Grid (12 Items, 6 cols x 2 rows, matching image_bc55f446.png) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#3B302A]" />
            <h3 className="text-sm font-bold font-serif text-stone-900">
              Research Categories
            </h3>
          </div>
          <button 
            onClick={() => setSelectedCategory('all')}
            className="text-xs font-mono text-stone-600 hover:text-stone-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {categoriesConfig.map(cat => {
            const isSelected = selectedCategory === cat.categoryKey;
            const count = researchVaultItems.filter(i => i.category === cat.categoryKey).length;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.categoryKey)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-[#3B302A] text-white border-[#3B302A] shadow-xs'
                    : 'bg-[#FAF8F5] hover:bg-[#F4EFEA] border-[#EAE4DC] text-stone-800'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`p-1 rounded-lg ${isSelected ? 'text-[#D8C5AE]' : 'text-stone-700'}`}>
                    {cat.icon}
                  </div>
                  <span className="text-[11px] font-sans font-medium line-clamp-1">
                    {cat.label}
                  </span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* My Research Library */}
      <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE4DC]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#3B302A]" />
            <h3 className="text-base font-bold font-serif text-stone-900">
              My Research Library
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <select className="px-2.5 py-1.5 bg-white border border-[#E2DBD1] rounded-xl text-xs font-mono text-stone-800 cursor-pointer">
              <option>Sort: Newest First</option>
              <option>Sort: Title A-Z</option>
              <option>Sort: Category</option>
            </select>

            <div className="flex items-center bg-white border border-[#E2DBD1] rounded-xl p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg cursor-pointer ${viewMode === 'grid' ? 'bg-[#3B302A] text-white' : 'text-stone-600'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg cursor-pointer ${viewMode === 'list' ? 'bg-[#3B302A] text-white' : 'text-stone-600'}`}
              >
                <ListIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setNewModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3B302A] hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Research</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#F4EFEA] border border-[#E2DBD1] flex items-center justify-center mx-auto text-stone-400">
              <BookOpen className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold font-serif text-stone-900">
              Your Research Vault is Empty
            </h4>
            <p className="text-xs text-stone-500 font-sans max-w-sm mx-auto">
              Start saving your research, notes, and useful links to build your personal knowledge base.
            </p>
            <button
              onClick={() => setNewModalOpen(true)}
              className="px-4 py-2 bg-[#3B302A] text-white rounded-xl text-xs font-mono font-medium"
            >
              + Add Your First Research
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="p-4 bg-white border border-[#EAE4DC] rounded-xl hover:border-stone-400 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <button
                      onClick={() => deleteResearchVaultItem(item.id)}
                      className="text-stone-300 hover:text-rose-600 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold font-serif text-stone-900 line-clamp-1">
                    {item.title}
                  </h4>

                  {item.description && (
                    <p className="text-xs text-stone-600 font-sans line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {item.personalNotes && (
                    <div className="p-2 bg-[#FAF8F5] rounded-lg text-xs font-serif italic text-stone-700 border border-stone-200/60">
                      &ldquo;{item.personalNotes}&rdquo;
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono text-stone-500">
                  <div className="flex items-center gap-1">
                    <span>Verified:</span>
                    <EditableDate
                      value={itemDates[item.id] || item.lastVerifiedDate || 'Nov 9, 2026'}
                      onChange={(val) => setItemDates(prev => ({ ...prev, [item.id]: val }))}
                      className="text-stone-700 font-semibold"
                    />
                  </div>

                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3B302A] hover:underline font-bold inline-flex items-center gap-1"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NEW ITEM MODAL */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-bold font-serif text-stone-900">Add Research Resource</h3>
            <form onSubmit={handleSaveItem} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  placeholder="e.g. Stanford CS Curriculum & Core Track Requirements"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-stone-700 mb-1">Category</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-xs"
                  >
                    <option value="University Research">University Research</option>
                    <option value="Admission Requirements">Admission Requirements</option>
                    <option value="Financial Aid">Financial Aid</option>
                    <option value="International Students">International Students</option>
                    <option value="Application Strategy">Application Strategy</option>
                    <option value="Essays">Essays</option>
                    <option value="SAT">SAT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-700 mb-1">Verification Date</label>
                  <input
                    type="text"
                    value={itemForm.lastVerifiedDate}
                    onChange={(e) => setItemForm({ ...itemForm, lastVerifiedDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">Source URL</label>
                <input
                  type="url"
                  value={itemForm.sourceUrl}
                  onChange={(e) => setItemForm({ ...itemForm, sourceUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-700 mb-1">Description / Summary</label>
                <textarea
                  rows={2}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
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
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
