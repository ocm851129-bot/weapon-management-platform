import { useState, useMemo } from 'react';
import { weaponSystems, categoryColors, statusColors, countryFlags } from '../data/mockData';
import type { WeaponSystem, WeaponCategory, StatusType } from '../types';
import { Search, Filter, ChevronDown, ChevronUp, Info, X, Camera, FileDown, Loader } from 'lucide-react';
import { useLang } from '../i18n/LangContext';
import { exportWeaponPDF } from '../utils/exportPDF';

const categories: WeaponCategory[] = ['Aircraft', 'Naval', 'Ground', 'Missile', 'Cyber', 'Space'];
const statuses: StatusType[] = ['operational', 'maintenance', 'inactive', 'reserve'];

function StatusLabel({ status, t }: { status: StatusType; t: (k: any) => string }) {
  const map: Record<StatusType, string> = {
    operational: t('statusOperational'),
    maintenance: t('statusMaintenance'),
    inactive: t('statusInactive'),
    reserve: t('statusReserve'),
  };
  return <>{map[status]}</>;
}

export default function Inventory() {
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<WeaponCategory | ''>('');
  const [statusFilter, setStatusFilter] = useState<StatusType | ''>('');
  const [sort, setSort] = useState<{ key: keyof WeaponSystem; dir: 'asc' | 'desc' }>({ key: 'name', dir: 'asc' });
  const [selected, setSelected] = useState<WeaponSystem | null>(null);
  const [imgError, setImgError] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const filtered = useMemo(() => {
    let list = [...weaponSystems];
    if (search) list = list.filter(w =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.country.toLowerCase().includes(search.toLowerCase()) ||
      w.designation.toLowerCase().includes(search.toLowerCase())
    );
    if (catFilter) list = list.filter(w => w.category === catFilter);
    if (statusFilter) list = list.filter(w => w.status === statusFilter);
    list.sort((a, b) => {
      const cmp = String(a[sort.key]).localeCompare(String(b[sort.key]), undefined, { numeric: true });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [search, catFilter, statusFilter, sort]);

  const toggleSort = (key: keyof WeaponSystem) => {
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
  };

  const SortIcon = ({ k }: { k: keyof WeaponSystem }) => {
    if (sort.key !== k) return null;
    return sort.dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  const handleSelect = (w: WeaponSystem) => {
    setSelected(w);
    setImgError(false);
  };

  const handleExportPDF = async (w: WeaponSystem, e: React.MouseEvent) => {
    e.stopPropagation();
    setPdfLoading(true);
    try {
      await exportWeaponPDF(w);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">{t('weaponsInventory')}</h1>
          <p className="text-[12px] mt-1" style={{ color: '#8899aa' }}>
            {filtered.length} / {weaponSystems.length} {t('systemsDisplayed')}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8899aa]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-[12px] outline-none placeholder-[#445566] text-white"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-[#8899aa]" />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value as WeaponCategory | '')}
            className="px-3 py-2 rounded-lg text-[12px] outline-none text-white"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <option value="">{t('allCategories')}</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as StatusType | '')}
            className="px-3 py-2 rounded-lg text-[12px] outline-none text-white"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <option value="">{t('allStatuses')}</option>
            {statuses.map(s => (
              <option key={s} value={s}>
                <StatusLabel status={s} t={t} />
              </option>
            ))}
          </select>
        </div>
        {(catFilter || statusFilter || search) && (
          <button onClick={() => { setSearch(''); setCatFilter(''); setStatusFilter(''); }}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-[12px] text-[#ff4444] hover:bg-[rgba(255,68,68,0.08)] transition-colors">
            <X size={13} /> {t('clear')}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left cursor-pointer hover:text-white" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1">{t('weaponSystem')} <SortIcon k="name" /></div>
                </th>
                <th className="text-left">{t('category')}</th>
                <th className="text-left cursor-pointer hover:text-white" onClick={() => toggleSort('country')}>
                  <div className="flex items-center gap-1">{t('nation')} <SortIcon k="country" /></div>
                </th>
                <th className="text-left">{t('status')}</th>
                <th className="text-right cursor-pointer hover:text-white" onClick={() => toggleSort('quantity')}>
                  <div className="flex items-center gap-1 justify-end">{t('units')} <SortIcon k="quantity" /></div>
                </th>
                <th className="text-left">{t('classification')}</th>
                <th className="text-left cursor-pointer hover:text-white" onClick={() => toggleSort('nextMaintenance')}>
                  <div className="flex items-center gap-1">{t('nextService')} <SortIcon k="nextMaintenance" /></div>
                </th>
                <th className="text-center">{t('detail')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w.id} className="cursor-pointer" onClick={() => handleSelect(w)}>
                  <td>
                    <div className="flex items-center gap-2">
                      {w.image && (
                        <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0"
                          style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={w.image} alt={w.name}
                            className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-white">{w.name}</div>
                        <div className="text-[11px]" style={{ color: '#445566' }}>{w.designation} · {w.manufacturer}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold"
                      style={{ background: `${categoryColors[w.category]}15`, color: categoryColors[w.category] }}>
                      {w.category}
                    </span>
                  </td>
                  <td>
                    <span className="text-[13px]">{countryFlags[w.countryCode] ?? ''}</span>{' '}
                    <span className="text-[12px]">{w.country}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <span className={`status-dot status-${w.status}`} />
                      <span className="text-[12px] font-semibold" style={{ color: statusColors[w.status] }}>
                        <StatusLabel status={w.status} t={t} />
                      </span>
                    </div>
                  </td>
                  <td className="text-right font-mono text-[13px] text-white">{w.quantity.toLocaleString()}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider"
                      style={{
                        background: w.classification === 'TOP SECRET' ? 'rgba(255,68,68,0.1)'
                          : w.classification === 'SECRET' ? 'rgba(255,136,0,0.1)'
                          : w.classification === 'CONFIDENTIAL' ? 'rgba(255,204,0,0.1)'
                          : 'rgba(0,212,255,0.1)',
                        color: w.classification === 'TOP SECRET' ? '#ff4444'
                          : w.classification === 'SECRET' ? '#ff8800'
                          : w.classification === 'CONFIDENTIAL' ? '#ffcc00'
                          : '#00d4ff',
                        border: `1px solid ${
                          w.classification === 'TOP SECRET' ? 'rgba(255,68,68,0.3)'
                          : w.classification === 'SECRET' ? 'rgba(255,136,0,0.3)'
                          : w.classification === 'CONFIDENTIAL' ? 'rgba(255,204,0,0.3)'
                          : 'rgba(0,212,255,0.3)'}`,
                      }}>
                      {w.classification}
                    </span>
                  </td>
                  <td className="text-[12px]" style={{ color: '#8899aa' }}>{w.nextMaintenance}</td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={e => { e.stopPropagation(); handleSelect(w); }}
                        className="p-1.5 rounded hover:bg-[rgba(0,212,255,0.1)] transition-colors text-[#8899aa] hover:text-[#00d4ff]"
                        title="상세 보기">
                        <Info size={14} />
                      </button>
                      <button onClick={e => handleExportPDF(w, e)}
                        className="p-1.5 rounded hover:bg-[rgba(0,212,255,0.1)] transition-colors text-[#8899aa] hover:text-[#00d4ff]"
                        title="PDF 다운로드" disabled={pdfLoading}>
                        <FileDown size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(7,11,15,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelected(null)}>
          <div className="liquid-glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn"
            onClick={e => e.stopPropagation()}>

            {/* Photo Header */}
            {selected.image && !imgError ? (
              <div className="relative h-52 rounded-t-2xl overflow-hidden">
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(7,11,15,1) 0%, rgba(7,11,15,0.3) 60%, transparent 100%)' }} />
                <div className="absolute bottom-4 left-6">
                  <div className="text-[11px] font-bold tracking-widest text-[#00d4ff] mb-1">{selected.id}</div>
                  <h2 className="text-2xl font-black text-white drop-shadow-lg">{selected.name}</h2>
                </div>
                <button onClick={() => setSelected(null)}
                  className="absolute top-3 right-3 p-2 rounded-lg text-white hover:bg-[rgba(255,255,255,0.2)] transition-colors"
                  style={{ background: 'rgba(7,11,15,0.5)', backdropFilter: 'blur(4px)' }}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-start justify-between p-6 pb-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Camera size={14} className="text-[#445566]" />
                    <span className="text-[11px]" style={{ color: '#445566' }}>{t('noPhoto')}</span>
                  </div>
                  <div className="text-[11px] font-bold tracking-widest text-[#00d4ff] mb-1">{selected.id}</div>
                  <h2 className="text-xl font-black text-white">{selected.name}</h2>
                </div>
                <button onClick={() => setSelected(null)}
                  className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-[#8899aa] hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="p-6">
              {/* Sub-header info */}
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span className="text-[12px]" style={{ color: '#8899aa' }}>
                  {selected.designation} · {selected.manufacturer} · {selected.yearIntroduced}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold"
                  style={{ background: `${categoryColors[selected.category]}15`, color: categoryColors[selected.category] }}>
                  {selected.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`status-dot status-${selected.status}`} />
                  <span className="text-[12px] font-semibold" style={{ color: statusColors[selected.status] }}>
                    <StatusLabel status={selected.status} t={t} />
                  </span>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-2 mb-5 text-[12px]">
                {[
                  { l: t('country'), v: `${countryFlags[selected.countryCode] ?? ''} ${selected.country}` },
                  { l: t('quantity'), v: selected.quantity.toLocaleString() },
                  { l: t('location'), v: selected.locationName },
                  { l: t('classification'), v: selected.classification },
                  { l: t('lastMaintenance'), v: selected.lastMaintenance },
                  { l: t('nextMaintenance'), v: selected.nextMaintenance },
                ].map(({ l, v }) => (
                  <div key={l} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="text-[10px] tracking-wider mb-1" style={{ color: '#8899aa' }}>{l.toUpperCase()}</div>
                    <div className="text-white font-semibold">{v}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="p-3 rounded-lg mb-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-[10px] tracking-wider mb-2" style={{ color: '#8899aa' }}>{t('description').toUpperCase()}</div>
                <p className="text-white text-[13px] leading-relaxed">{selected.description}</p>
              </div>

              {/* Tech Specs */}
              <div>
                <div className="text-[10px] tracking-wider mb-3" style={{ color: '#8899aa' }}>{t('techSpecs').toUpperCase()}</div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selected.specs).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between px-3 py-2 rounded"
                      style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
                      <span className="text-[11px]" style={{ color: '#8899aa' }}>{k}</span>
                      <span className="text-[12px] font-mono text-[#00d4ff]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PDF Download Button */}
              <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={e => handleExportPDF(selected, e)}
                  disabled={pdfLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[13px] tracking-widest uppercase transition-all duration-200"
                  style={{
                    background: pdfLoading ? 'rgba(0,212,255,0.15)' : 'rgba(0,212,255,0.12)',
                    border: '1px solid rgba(0,212,255,0.35)',
                    color: '#00d4ff',
                    cursor: pdfLoading ? 'not-allowed' : 'pointer',
                  }}>
                  {pdfLoading
                    ? <><Loader size={15} className="animate-spin" /> PDF 생성 중...</>
                    : <><FileDown size={15} /> PDF 다운로드 · {selected.id}</>}
                </button>
                <p className="text-center text-[10px] mt-2" style={{ color: '#445566' }}>
                  {selected.classification} · DATEWORLD WMS · Authorized Personnel Only
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
