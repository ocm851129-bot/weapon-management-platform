import { useState, useMemo } from 'react';
import { Globe2, ChevronRight, FileDown, Loader, Search, Filter, Shield, Plane, Anchor, Target, Cpu, Radio, Satellite } from 'lucide-react';
import { useLang } from '../i18n/LangContext';
import { weaponSystems, countryFlags } from '../data/mockData';
import type { WeaponSystem, WeaponCategory } from '../types';
import { exportWeaponPDF } from '../utils/exportPDF';

const CATEGORY_ICONS: Record<WeaponCategory | 'Drone', React.ElementType> = {
  Aircraft: Plane,
  Naval: Anchor,
  Ground: Shield,
  Missile: Target,
  Cyber: Cpu,
  Space: Satellite,
  Drone: Radio,
};

const CATEGORY_COLORS: Record<string, string> = {
  Aircraft: '#00d4ff',
  Naval: '#0088ff',
  Ground: '#00ff88',
  Missile: '#ff4444',
  Cyber: '#ff00ff',
  Space: '#aa88ff',
  Drone: '#ffaa00',
};

const STATUS_COLORS: Record<string, string> = {
  operational: '#00ff88',
  maintenance: '#ffcc00',
  inactive: '#ff4444',
  reserve: '#8899aa',
};

const STATUS_KO: Record<string, string> = {
  operational: '운용 중',
  maintenance: '정비 중',
  inactive: '비활성',
  reserve: '예비',
};

const COUNTRY_NAMES_KO: Record<string, string> = {
  US: '미국',
  KR: '대한민국',
  DE: '독일',
  GB: '영국',
  RU: '러시아',
  CN: '중국',
  AU: '호주',
  FR: '프랑스',
  TR: '튀르키예',
  IN: '인도',
  IL: '이스라엘',
  JP: '일본',
  SE: '스웨덴',
  IT: '이탈리아',
  ES: '스페인',
  NO: '노르웨이',
  PK: '파키스탄',
  KP: '북한',
  TW: '대만',
  BR: '브라질',
  IR: '이란',
  AT: '오스트리아',
  PL: '폴란드',
  NL: '네덜란드',
  CA: '캐나다',
};

const COUNTRY_NAMES_EN: Record<string, string> = {
  US: 'United States', KR: 'South Korea', DE: 'Germany', GB: 'United Kingdom',
  RU: 'Russia', CN: 'China', AU: 'Australia', FR: 'France', TR: 'Turkey',
  IN: 'India', IL: 'Israel', JP: 'Japan', SE: 'Sweden', IT: 'Italy',
  ES: 'Spain', NO: 'Norway', PK: 'Pakistan', KP: 'North Korea', TW: 'Taiwan',
  BR: 'Brazil', IR: 'Iran', AT: 'Austria', PL: 'Poland', NL: 'Netherlands', CA: 'Canada',
};

const COUNTRY_NAMES_JA: Record<string, string> = {
  US: 'アメリカ', KR: '韓国', DE: 'ドイツ', GB: 'イギリス',
  RU: 'ロシア', CN: '中国', AU: 'オーストラリア', FR: 'フランス', TR: 'トルコ',
  IN: 'インド', IL: 'イスラエル', JP: '日本', SE: 'スウェーデン', IT: 'イタリア',
  ES: 'スペイン', NO: 'ノルウェー', PK: 'パキスタン', KP: '北朝鮮', TW: '台湾',
  BR: 'ブラジル', IR: 'イラン', AT: 'オーストリア', PL: 'ポーランド', NL: 'オランダ', CA: 'カナダ',
};

function StatBadge({ color, count, label }: { color: string; count: number; label: string }) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
      style={{ background: `${color}15`, border: `1px solid ${color}40`, color }}>
      {count} {label}
    </div>
  );
}

interface CountrySummary {
  code: string;
  name: string;
  flag: string;
  weapons: WeaponSystem[];
  totalUnits: number;
  byCategory: Record<string, number>;
  operationalPct: number;
}

export default function CountryWeapons() {
  const { lang } = useLang();
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [pdfLoading, setPdfLoading] = useState<string | null>(null);
  const [detailWeapon, setDetailWeapon] = useState<WeaponSystem | null>(null);

  const getCountryName = (code: string) => {
    if (lang === 'en') return COUNTRY_NAMES_EN[code] ?? code;
    if (lang === 'ja') return COUNTRY_NAMES_JA[code] ?? code;
    return COUNTRY_NAMES_KO[code] ?? code;
  };

  const countries = useMemo<CountrySummary[]>(() => {
    const map = new Map<string, WeaponSystem[]>();
    for (const w of weaponSystems) {
      const arr = map.get(w.countryCode) ?? [];
      arr.push(w);
      map.set(w.countryCode, arr);
    }
    return Array.from(map.entries())
      .map(([code, weapons]) => {
        const byCategory: Record<string, number> = {};
        let totalUnits = 0;
        let opCount = 0;
        for (const w of weapons) {
          byCategory[w.category] = (byCategory[w.category] ?? 0) + 1;
          totalUnits += w.quantity;
          if (w.status === 'operational') opCount++;
        }
        return {
          code,
          name: getCountryName(code),
          flag: countryFlags[code] ?? '🏳',
          weapons,
          totalUnits,
          byCategory,
          operationalPct: Math.round((opCount / weapons.length) * 100),
        };
      })
      .sort((a, b) => b.weapons.length - a.weapons.length);
  }, [lang]);

  const selectedCountry = countries.find(c => c.code === selectedCode);

  const filteredWeapons = useMemo(() => {
    if (!selectedCountry) return [];
    return selectedCountry.weapons.filter(w => {
      const matchCat = categoryFilter === 'ALL' || w.category === categoryFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || w.name.toLowerCase().includes(q) || w.designation.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [selectedCountry, categoryFilter, search]);

  const categories = useMemo(() => {
    if (!selectedCountry) return [];
    return Array.from(new Set(selectedCountry.weapons.map(w => w.category)));
  }, [selectedCountry]);

  const handleExportPDF = async (w: WeaponSystem, e: React.MouseEvent) => {
    e.stopPropagation();
    setPdfLoading(w.id);
    try { await exportWeaponPDF(w); } finally { setPdfLoading(null); }
  };

  const panelLabel = lang === 'en' ? 'COUNTRY ARSENAL REGISTRY' : lang === 'ja' ? '国別兵器レジストリ' : '국가별 무기체계 레지스트리';
  const selectLabel = lang === 'en' ? 'Select a country' : lang === 'ja' ? '国を選択してください' : '국가를 선택하세요';
  const backLabel = lang === 'en' ? '← Back' : lang === 'ja' ? '← 戻る' : '← 목록으로';
  const totalLabel = lang === 'en' ? 'Total Systems' : lang === 'ja' ? '総体系数' : '총 체계 수';
  const unitsLabel = lang === 'en' ? 'Total Units' : lang === 'ja' ? '総ユニット数' : '총 보유 수량';
  const opLabel = lang === 'en' ? 'Operational' : lang === 'ja' ? '稼働率' : '가동률';
  const allLabel = lang === 'en' ? 'All' : lang === 'ja' ? '全て' : '전체';
  const searchLabel = lang === 'en' ? 'Search weapons...' : lang === 'ja' ? '兵器を検索...' : '무기 검색...';

  return (
    <div className="flex h-full" style={{ background: '#070b0f' }}>
      {/* ── Left: Country List ─────────────────────────────────────────────── */}
      <div className="w-72 flex-shrink-0 flex flex-col h-full border-r overflow-hidden"
        style={{ borderColor: 'rgba(0,212,255,0.1)', background: 'rgba(7,11,15,0.98)' }}>
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Globe2 size={16} className="text-[#00d4ff]" />
            <span className="text-[11px] font-bold tracking-widest text-[#00d4ff] uppercase">{panelLabel}</span>
          </div>
          <div className="text-[11px]" style={{ color: '#8899aa' }}>
            {countries.length} {lang === 'en' ? 'Nations' : lang === 'ja' ? 'カ国' : '개국'} · {weaponSystems.length} {lang === 'en' ? 'Systems' : lang === 'ja' ? '体系' : '개 체계'}
          </div>
        </div>

        {/* Country Scroll List */}
        <div className="flex-1 overflow-y-auto py-2">
          {countries.map((c, idx) => {
            const isActive = c.code === selectedCode;
            return (
              <button key={c.code} onClick={() => { setSelectedCode(c.code); setCategoryFilter('ALL'); setSearch(''); }}
                className="w-full px-4 py-3 text-left transition-all duration-150 group border-b"
                style={{
                  background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                  borderColor: 'rgba(0,212,255,0.06)',
                  borderLeft: isActive ? '3px solid #00d4ff' : '3px solid transparent',
                }}>
                <div className="flex items-center gap-2.5">
                  {/* Rank */}
                  <span className="text-[10px] font-mono w-5 text-center flex-shrink-0"
                    style={{ color: idx < 3 ? '#ffcc00' : '#8899aa' }}>
                    {idx + 1}
                  </span>
                  {/* Flag */}
                  <span className="text-xl leading-none flex-shrink-0">{c.flag}</span>
                  {/* Name + stats */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-[12px] font-semibold truncate ${isActive ? 'text-[#00d4ff]' : 'text-white group-hover:text-[#00d4ff]'}`}>
                      {c.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px]" style={{ color: '#8899aa' }}>
                        {c.weapons.length} {lang === 'en' ? 'sys' : lang === 'ja' ? '体系' : '체계'}
                      </span>
                      <span className="text-[10px]" style={{ color: '#8899aa' }}>·</span>
                      <span className="text-[10px]" style={{ color: '#00ff88' }}>
                        {c.operationalPct}% {lang === 'en' ? 'OP' : lang === 'ja' ? '稼働' : '가동'}
                      </span>
                    </div>
                  </div>
                  {/* Chevron */}
                  <ChevronRight size={12} className={`flex-shrink-0 transition-transform ${isActive ? 'text-[#00d4ff] translate-x-0.5' : 'text-[#8899aa]'}`} />
                </div>
                {/* Category mini-bar */}
                {c.weapons.length > 0 && (
                  <div className="flex gap-0.5 mt-2 ml-7">
                    {Object.entries(c.byCategory).map(([cat, cnt]) => (
                      <div key={cat} title={`${cat}: ${cnt}`}
                        className="h-1 rounded-full flex-shrink-0"
                        style={{ width: `${Math.max(8, cnt * 4)}px`, background: CATEGORY_COLORS[cat] ?? '#8899aa', opacity: 0.7 }} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right: Weapon Detail Panel ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedCountry ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center">
            <Globe2 size={64} style={{ color: 'rgba(0,212,255,0.2)' }} />
            <p className="mt-4 text-[14px] font-semibold" style={{ color: '#8899aa' }}>{selectLabel}</p>
            <p className="mt-1 text-[11px]" style={{ color: 'rgba(136,153,170,0.6)' }}>
              {countries.length} {lang === 'en' ? 'nations available' : lang === 'ja' ? 'カ国利用可能' : '개국 선택 가능'}
            </p>
          </div>
        ) : (
          <>
            {/* Country Header */}
            <div className="p-5 border-b flex-shrink-0" style={{ borderColor: 'rgba(0,212,255,0.1)', background: 'rgba(0,212,255,0.03)' }}>
              <button onClick={() => setSelectedCode(null)}
                className="text-[11px] font-semibold mb-3 transition-colors hover:text-[#00d4ff]"
                style={{ color: '#8899aa' }}>{backLabel}</button>

              <div className="flex items-start gap-4">
                {/* Flag large */}
                <span className="text-5xl leading-none flex-shrink-0">{selectedCountry.flag}</span>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-white">{selectedCountry.name}</h1>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded"
                      style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}>
                      {selectedCountry.code}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="text-center">
                      <div className="text-xl font-bold text-[#00d4ff]">{selectedCountry.weapons.length}</div>
                      <div className="text-[10px]" style={{ color: '#8899aa' }}>{totalLabel}</div>
                    </div>
                    <div className="w-px h-8" style={{ background: 'rgba(0,212,255,0.2)' }} />
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">{selectedCountry.totalUnits.toLocaleString()}</div>
                      <div className="text-[10px]" style={{ color: '#8899aa' }}>{unitsLabel}</div>
                    </div>
                    <div className="w-px h-8" style={{ background: 'rgba(0,212,255,0.2)' }} />
                    <div className="text-center">
                      <div className="text-xl font-bold text-[#00ff88]">{selectedCountry.operationalPct}%</div>
                      <div className="text-[10px]" style={{ color: '#8899aa' }}>{opLabel}</div>
                    </div>
                    <div className="w-px h-8" style={{ background: 'rgba(0,212,255,0.2)' }} />
                    {/* Category pills */}
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(selectedCountry.byCategory).map(([cat, cnt]) => (
                        <StatBadge key={cat} color={CATEGORY_COLORS[cat] ?? '#8899aa'} count={cnt}
                          label={lang === 'en' ? cat : lang === 'ja' ?
                            ({ Aircraft: '航空機', Naval: '海軍', Ground: '地上', Missile: 'ミサイル', Cyber: 'サイバー', Space: '宇宙', Drone: 'ドローン' }[cat] ?? cat) :
                            ({ Aircraft: '항공기', Naval: '해군', Ground: '지상', Missile: '미사일', Cyber: '사이버', Space: '우주', Drone: '드론' }[cat] ?? cat)
                          } />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter bar */}
              <div className="flex items-center gap-3 mt-4">
                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8899aa]" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder={searchLabel}
                    className="w-full pl-8 pr-3 py-2 text-[12px] rounded-lg outline-none transition-colors"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,255,0.15)', color: '#fff' }} />
                </div>
                {/* Category filter */}
                <div className="flex items-center gap-1.5">
                  <Filter size={12} style={{ color: '#8899aa' }} />
                  <button onClick={() => setCategoryFilter('ALL')}
                    className="px-3 py-1.5 rounded text-[11px] font-semibold transition-all"
                    style={{
                      background: categoryFilter === 'ALL' ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)',
                      border: categoryFilter === 'ALL' ? '1px solid rgba(0,212,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      color: categoryFilter === 'ALL' ? '#00d4ff' : '#8899aa',
                    }}>{allLabel}</button>
                  {categories.map(cat => {
                    const Icon = CATEGORY_ICONS[cat as WeaponCategory] ?? Shield;
                    const color = CATEGORY_COLORS[cat] ?? '#8899aa';
                    const isActive = categoryFilter === cat;
                    return (
                      <button key={cat} onClick={() => setCategoryFilter(cat)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold transition-all"
                        style={{
                          background: isActive ? `${color}20` : 'rgba(255,255,255,0.04)',
                          border: isActive ? `1px solid ${color}60` : '1px solid rgba(255,255,255,0.08)',
                          color: isActive ? color : '#8899aa',
                        }}>
                        <Icon size={11} />
                        {lang === 'en' ? cat : lang === 'ja' ?
                          ({ Aircraft: '航空機', Naval: '海軍', Ground: '地上', Missile: 'ミサイル', Cyber: 'サイバー', Space: '宇宙', Drone: 'ドローン' }[cat] ?? cat) :
                          ({ Aircraft: '항공기', Naval: '해군', Ground: '지상', Missile: '미사일', Cyber: '사이버', Space: '우주', Drone: '드론' }[cat] ?? cat)
                        }
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Weapon Cards Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredWeapons.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-[13px]" style={{ color: '#8899aa' }}>
                    {lang === 'en' ? 'No weapons found.' : lang === 'ja' ? '兵器が見つかりません。' : '무기를 찾을 수 없습니다.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredWeapons.map(w => {
                    const color = CATEGORY_COLORS[w.category] ?? '#8899aa';
                    const Icon = CATEGORY_ICONS[w.category as WeaponCategory] ?? Shield;
                    const statusColor = STATUS_COLORS[w.status] ?? '#8899aa';
                    const isLoading = pdfLoading === w.id;
                    return (
                      <div key={w.id}
                        className="rounded-xl overflow-hidden transition-all duration-200 hover:translate-y-[-1px] cursor-pointer group"
                        style={{ background: 'rgba(14,22,30,0.9)', border: `1px solid rgba(0,212,255,0.1)`, boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
                        onClick={() => setDetailWeapon(w)}>
                        {/* Image */}
                        <div className="relative h-36 overflow-hidden"
                          style={{ background: 'rgba(7,11,15,0.8)' }}>
                          {w.image ? (
                            <img src={w.image} alt={w.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Icon size={36} style={{ color: `${color}40` }} />
                            </div>
                          )}
                          {/* Gradient overlay */}
                          <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(to top, rgba(7,11,15,0.95) 0%, rgba(7,11,15,0.3) 50%, transparent 100%)' }} />
                          {/* Category badge */}
                          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
                            style={{ background: `${color}20`, border: `1px solid ${color}50`, color }}>
                            <Icon size={9} /> {w.category}
                          </div>
                          {/* Classification badge */}
                          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold"
                            style={{
                              background: w.classification === 'TOP SECRET' ? 'rgba(255,68,68,0.2)' :
                                w.classification === 'SECRET' ? 'rgba(255,136,0,0.2)' :
                                  w.classification === 'CONFIDENTIAL' ? 'rgba(255,204,0,0.2)' : 'rgba(0,212,255,0.15)',
                              color: w.classification === 'TOP SECRET' ? '#ff4444' :
                                w.classification === 'SECRET' ? '#ff8800' :
                                  w.classification === 'CONFIDENTIAL' ? '#ffcc00' : '#00d4ff',
                              border: `1px solid currentColor`,
                            }}>
                            {w.classification === 'UNCLASSIFIED' ? 'UNCLS' : w.classification.replace(' ', '\n')}
                          </div>
                          {/* Status dot */}
                          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] font-semibold"
                            style={{ color: statusColor }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                            {lang === 'ko' ? STATUS_KO[w.status] : w.status.toUpperCase()}
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-3">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-bold text-white truncate">{w.name}</div>
                              <div className="text-[10px] font-mono mt-0.5" style={{ color: '#00d4ff' }}>{w.id} · {w.designation}</div>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <div className="text-[13px] font-bold" style={{ color: '#00ff88' }}>{w.quantity.toLocaleString()}</div>
                              <div className="text-[9px]" style={{ color: '#8899aa' }}>
                                {lang === 'en' ? 'units' : lang === 'ja' ? 'ユニット' : '보유'}
                              </div>
                            </div>
                          </div>

                          {/* Specs preview */}
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {Object.entries(w.specs).slice(0, 2).map(([k, v]) => (
                              <div key={k} className="text-[10px] px-1.5 py-0.5 rounded"
                                style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.1)', color: '#8899aa' }}>
                                <span style={{ color: '#00d4ff' }}>{k}</span> {v}
                              </div>
                            ))}
                          </div>

                          <div className="text-[10px] mt-2 line-clamp-2" style={{ color: 'rgba(136,153,170,0.8)' }}>
                            {w.description.slice(0, 80)}…
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setDetailWeapon(w)}
                              className="flex-1 py-1.5 rounded text-[11px] font-bold transition-all"
                              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                              {lang === 'en' ? 'Detail' : lang === 'ja' ? '詳細' : '상세 보기'}
                            </button>
                            <button onClick={e => handleExportPDF(w, e)} disabled={isLoading}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-bold transition-all"
                              style={{ background: isLoading ? 'rgba(0,212,255,0.04)' : 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', color: isLoading ? '#8899aa' : '#00d4ff' }}>
                              {isLoading ? <Loader size={11} className="animate-spin" /> : <FileDown size={11} />}
                              PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Detail Modal ──────────────────────────────────────────────────────── */}
      {detailWeapon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setDetailWeapon(null)}>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{ background: 'rgba(10,18,26,0.98)', border: '1px solid rgba(0,212,255,0.25)', boxShadow: '0 0 60px rgba(0,212,255,0.15)' }}
            onClick={e => e.stopPropagation()}>

            {/* Modal image */}
            {detailWeapon.image && (
              <div className="relative h-52 overflow-hidden rounded-t-2xl">
                <img src={detailWeapon.image} alt={detailWeapon.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,18,26,1) 0%, rgba(10,18,26,0.3) 60%, transparent 100%)' }} />
              </div>
            )}

            <div className="p-6">
              {/* Title */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{detailWeapon.name}</h2>
                  <p className="text-[12px] mt-1 font-mono" style={{ color: '#00d4ff' }}>
                    {detailWeapon.id} · {detailWeapon.designation} · {detailWeapon.manufacturer} · {detailWeapon.yearIntroduced}
                  </p>
                </div>
                <button onClick={() => setDetailWeapon(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-colors flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#8899aa' }}>×</button>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  [lang === 'en' ? 'Country' : lang === 'ja' ? '国家' : '국가', `${countryFlags[detailWeapon.countryCode] ?? ''} ${detailWeapon.country}`],
                  [lang === 'en' ? 'Status' : lang === 'ja' ? '状態' : '상태', detailWeapon.status.toUpperCase()],
                  [lang === 'en' ? 'Quantity' : lang === 'ja' ? '保有数' : '보유 수량', detailWeapon.quantity.toLocaleString()],
                  [lang === 'en' ? 'Classification' : lang === 'ja' ? '機密区分' : '비밀 등급', detailWeapon.classification],
                  [lang === 'en' ? 'Location' : lang === 'ja' ? '配備場所' : '배치 위치', detailWeapon.locationName],
                  [lang === 'en' ? 'Next Maint.' : lang === 'ja' ? '次回整備' : '다음 정비', detailWeapon.nextMaintenance],
                ].map(([k, v]) => (
                  <div key={k} className="px-3 py-2.5 rounded-lg" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
                    <div className="text-[10px] font-semibold mb-0.5" style={{ color: '#8899aa' }}>{k}</div>
                    <div className="text-[12px] font-bold text-white">{v}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
                <div className="text-[10px] font-bold mb-2 tracking-widest" style={{ color: '#00d4ff' }}>
                  {lang === 'en' ? 'SYSTEM OVERVIEW' : lang === 'ja' ? 'システム概要' : '시스템 개요'}
                </div>
                <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>{detailWeapon.description}</p>
              </div>

              {/* Specs */}
              <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid rgba(0,212,255,0.1)' }}>
                <div className="px-4 py-2" style={{ background: 'rgba(0,212,255,0.1)' }}>
                  <span className="text-[11px] font-bold tracking-widest" style={{ color: '#00d4ff' }}>
                    {lang === 'en' ? 'TECHNICAL SPECIFICATIONS' : lang === 'ja' ? '技術仕様' : '기술 제원'}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  {Object.entries(detailWeapon.specs).map(([k, v], i) => (
                    <div key={k} className="flex items-center justify-between px-4 py-2.5"
                      style={{ background: i % 2 === 0 ? 'rgba(10,18,26,0.8)' : 'rgba(14,22,30,0.8)', borderBottom: '1px solid rgba(0,212,255,0.06)' }}>
                      <span className="text-[11px]" style={{ color: '#8899aa' }}>{k}</span>
                      <span className="text-[11px] font-bold" style={{ color: '#00d4ff' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PDF Button */}
              <button onClick={e => handleExportPDF(detailWeapon, e)} disabled={pdfLoading === detailWeapon.id}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[13px] tracking-widest uppercase transition-all duration-200"
                style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.35)', color: '#00d4ff' }}>
                {pdfLoading === detailWeapon.id
                  ? <><Loader size={15} className="animate-spin" /> {lang === 'en' ? 'Generating PDF...' : lang === 'ja' ? 'PDF生成中...' : 'PDF 생성 중...'}</>
                  : <><FileDown size={15} /> PDF {lang === 'en' ? 'Download' : lang === 'ja' ? 'ダウンロード' : '다운로드'} · {detailWeapon.id}</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
