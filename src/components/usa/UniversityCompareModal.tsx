import React, { useState } from 'react';
import { X, Check, ExternalLink, Columns } from 'lucide-react';
import { useUsaApp } from '../../context/UsaAppContext';
import { UniversityProfile } from '../../types/usaApp';

interface UniversityCompareModalProps {
  onClose: () => void;
}

export const UniversityCompareModal: React.FC<UniversityCompareModalProps> = ({ onClose }) => {
  const { universities } = useUsaApp();
  const [selectedIds, setSelectedIds] = useState<string[]>(
    universities.slice(0, 3).map(u => u.id)
  );

  const selectedUniversities = selectedIds
    .map(id => universities.find(u => u.id === id))
    .filter(Boolean) as UniversityProfile[];

  const toggleSelectUniversity = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(item => item !== id));
    } else {
      if (selectedIds.length >= 3) {
        setSelectedIds(prev => [prev[1], prev[2], id]);
      } else {
        setSelectedIds(prev => [...prev, id]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-[#FAF8F5] border border-[#EAE6DE] rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#EAE6DE] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Columns className="w-4 h-4 text-stone-700" />
              <h2 className="text-xl font-bold font-serif text-stone-900">
                Compare Universities Side-by-Side
              </h2>
            </div>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              Select 2 to 3 saved universities to compare admission requirements, financial aid policies, and deadlines.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* University Selector Badges */}
        <div className="px-6 py-3 bg-[#F2EDE4] border-b border-[#EAE6DE] flex flex-wrap items-center gap-2 shrink-0">
          <span className="text-xs font-mono font-semibold text-stone-700 mr-2">
            Select to compare (max 3):
          </span>
          {universities.map(u => {
            const isSelected = selectedIds.includes(u.id);
            return (
              <button
                key={u.id}
                onClick={() => toggleSelectUniversity(u.id)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected 
                    ? 'bg-stone-900 text-white shadow-xs' 
                    : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                <span>{u.name}</span>
              </button>
            );
          })}
        </div>

        {/* Comparison Table Viewport */}
        <div className="flex-1 p-6 overflow-y-auto">
          {selectedUniversities.length < 2 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-stone-500 font-sans">
                Please select at least 2 universities above to generate a side-by-side comparison.
              </p>
            </div>
          ) : (
            <div className="border border-stone-200 rounded-2xl bg-white overflow-hidden shadow-2xs">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-stone-200 divide-x divide-stone-200">
                    <th className="p-3.5 w-44 font-mono font-bold text-stone-600 uppercase text-[11px]">
                      Parameter
                    </th>
                    {selectedUniversities.map(u => (
                      <th key={u.id} className="p-3.5 font-serif font-bold text-stone-900 text-base">
                        <div className="flex items-center justify-between">
                          <span>{u.name}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            u.category === 'reach' ? 'bg-amber-100 text-amber-900' :
                            u.category === 'target' ? 'bg-stone-200 text-stone-900' :
                            'bg-emerald-100 text-emerald-900'
                          }`}>
                            {u.category}
                          </span>
                        </div>
                        <div className="text-[11px] font-sans font-normal text-stone-500 mt-1">
                          {u.city}, {u.state ? `${u.state}, ` : ''}{u.country}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr className="divide-x divide-stone-100">
                    <td className="p-3.5 font-mono text-stone-500 bg-[#FAF8F5]/60 font-semibold">University Type</td>
                    {selectedUniversities.map(u => (
                      <td key={u.id} className="p-3.5 font-sans text-stone-800">{u.universityType}</td>
                    ))}
                  </tr>
                  <tr className="divide-x divide-stone-100">
                    <td className="p-3.5 font-mono text-stone-500 bg-[#FAF8F5]/60 font-semibold">Intended Major</td>
                    {selectedUniversities.map(u => (
                      <td key={u.id} className="p-3.5 font-sans font-medium text-stone-900">{u.intendedMajor || 'Not specified'}</td>
                    ))}
                  </tr>
                  <tr className="divide-x divide-stone-100">
                    <td className="p-3.5 font-mono text-stone-500 bg-[#FAF8F5]/60 font-semibold">SAT Policy</td>
                    {selectedUniversities.map(u => (
                      <td key={u.id} className="p-3.5 font-mono font-semibold text-stone-900">{u.satPolicy}</td>
                    ))}
                  </tr>
                  <tr className="divide-x divide-stone-100">
                    <td className="p-3.5 font-mono text-stone-500 bg-[#FAF8F5]/60 font-semibold">International Aid</td>
                    {selectedUniversities.map(u => (
                      <td key={u.id} className="p-3.5 font-sans">
                        <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          u.needBasedAidInternational === 'Need-Blind' ? 'bg-emerald-100 text-emerald-800' :
                          u.needBasedAidInternational === 'Need-Aware' ? 'bg-amber-100 text-amber-900' :
                          'bg-stone-100 text-stone-700'
                        }`}>
                          {u.needBasedAidInternational}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="divide-x divide-stone-100">
                    <td className="p-3.5 font-mono text-stone-500 bg-[#FAF8F5]/60 font-semibold">CSS Profile</td>
                    {selectedUniversities.map(u => (
                      <td key={u.id} className="p-3.5 font-sans text-stone-800">
                        {u.cssProfileRequired ? 'Required' : 'Not Required'}
                        {u.cssProfileDeadline && <span className="block text-[11px] font-mono text-stone-500 mt-0.5">Deadline: {u.cssProfileDeadline}</span>}
                      </td>
                    ))}
                  </tr>
                  <tr className="divide-x divide-stone-100">
                    <td className="p-3.5 font-mono text-stone-500 bg-[#FAF8F5]/60 font-semibold">Acceptance Rate</td>
                    {selectedUniversities.map(u => (
                      <td key={u.id} className="p-3.5 font-mono font-bold text-stone-900">{u.acceptanceRate || 'Unrecorded'}</td>
                    ))}
                  </tr>
                  <tr className="divide-x divide-stone-100">
                    <td className="p-3.5 font-mono text-stone-500 bg-[#FAF8F5]/60 font-semibold">SAT 25th–75th</td>
                    {selectedUniversities.map(u => (
                      <td key={u.id} className="p-3.5 font-mono text-stone-800">
                        {u.sat25thPercentile && u.sat75thPercentile ? `${u.sat25thPercentile} – ${u.sat75thPercentile}` : 'Unrecorded'}
                      </td>
                    ))}
                  </tr>
                  <tr className="divide-x divide-stone-100">
                    <td className="p-3.5 font-mono text-stone-500 bg-[#FAF8F5]/60 font-semibold">Total Cost / Year</td>
                    {selectedUniversities.map(u => (
                      <td key={u.id} className="p-3.5 font-mono font-bold text-stone-900">{u.totalEstimatedCostUSD || 'Unrecorded'}</td>
                    ))}
                  </tr>
                  <tr className="divide-x divide-stone-100">
                    <td className="p-3.5 font-mono text-stone-500 bg-[#FAF8F5]/60 font-semibold">Intended Round</td>
                    {selectedUniversities.map(u => (
                      <td key={u.id} className="p-3.5 font-mono font-bold text-stone-900">{u.intendedRound}</td>
                    ))}
                  </tr>
                  <tr className="divide-x divide-stone-100">
                    <td className="p-3.5 font-mono text-stone-500 bg-[#FAF8F5]/60 font-semibold">Deadlines</td>
                    {selectedUniversities.map(u => (
                      <td key={u.id} className="p-3.5 font-mono text-[11px] text-stone-700 space-y-0.5">
                        {u.edDeadline && <div>ED: {u.edDeadline}</div>}
                        {u.eaDeadline && <div>EA: {u.eaDeadline}</div>}
                        {u.rdDeadline && <div>RD: {u.rdDeadline}</div>}
                      </td>
                    ))}
                  </tr>
                  <tr className="divide-x divide-stone-100">
                    <td className="p-3.5 font-mono text-stone-500 bg-[#FAF8F5]/60 font-semibold">Official Website</td>
                    {selectedUniversities.map(u => (
                      <td key={u.id} className="p-3.5 font-sans">
                        {u.officialWebsite ? (
                          <a href={u.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-stone-700 underline inline-flex items-center gap-1 font-mono text-[11px]">
                            Visit portal <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : 'None'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#F2EDE4] border-t border-[#EAE6DE] flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-mono cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
