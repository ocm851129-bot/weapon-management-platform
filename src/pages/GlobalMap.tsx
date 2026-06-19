import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { weaponSystems, categoryColors, statusColors, countryFlags } from '../data/mockData';
import type { WeaponSystem, WeaponCategory, StatusType } from '../types';
import { Layers, Target } from 'lucide-react';

const categories: WeaponCategory[] = ['Aircraft', 'Naval', 'Ground', 'Missile', 'Cyber', 'Space'];
const statuses: StatusType[] = ['operational', 'maintenance', 'inactive', 'reserve'];

export default function GlobalMap() {
  const [catFilter, setCatFilter] = useState<WeaponCategory | ''>('');
  const [statusFilter, setStatusFilter] = useState<StatusType | ''>('');

  const visible = weaponSystems.filter(w => {
    if (catFilter && w.category !== catFilter) return false;
    if (statusFilter && w.status !== statusFilter) return false;
    return true;
  });

  const getColor = (w: WeaponSystem) => catFilter ? categoryColors[w.category] : statusColors[w.status];

  return (
    <div className="p-6 animate-fadeIn flex flex-col gap-5" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">GLOBAL DEPLOYMENT MAP</h1>
          <p className="text-[12px] mt-1" style={{ color: '#8899aa' }}>
            Real-time weapon system positions — {visible.length} locations displayed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-[#8899aa]" />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value as WeaponCategory | '')}
            className="px-3 py-2 rounded-lg text-[12px] outline-none text-white"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Target size={14} className="text-[#8899aa]" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as StatusType | '')}
            className="px-3 py-2 rounded-lg text-[12px] outline-none text-white"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <option value="">All Statuses</option>
            {statuses.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap flex-shrink-0">
        {(catFilter
          ? Object.entries(categoryColors).map(([k, v]) => ({ label: k, color: v }))
          : Object.entries(statusColors).map(([k, v]) => ({ label: k, color: v }))
        ).map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5 text-[11px]">
            <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
            <span className="capitalize" style={{ color: '#8899aa' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="flex-1 rounded-xl overflow-hidden glass min-h-0">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          {visible.map(w => (
            <CircleMarker
              key={w.id}
              center={w.location}
              radius={Math.max(8, Math.min(20, w.quantity / 30))}
              pathOptions={{
                color: getColor(w),
                fillColor: getColor(w),
                fillOpacity: 0.7,
                weight: 2,
              }}>
              <Popup>
                <div style={{
                  background: '#0d1b2e',
                  color: '#e0e8f0',
                  padding: '12px',
                  borderRadius: '8px',
                  minWidth: '200px',
                  border: '1px solid rgba(0,212,255,0.2)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  <div style={{ color: '#00d4ff', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '4px' }}>
                    {w.id}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'white', marginBottom: '2px' }}>
                    {countryFlags[w.countryCode]} {w.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#8899aa', marginBottom: '8px' }}>{w.locationName}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '11px' }}>
                    <div>
                      <span style={{ color: '#8899aa' }}>Category: </span>
                      <span style={{ color: categoryColors[w.category] }}>{w.category}</span>
                    </div>
                    <div>
                      <span style={{ color: '#8899aa' }}>Units: </span>
                      <span style={{ color: 'white', fontWeight: 600 }}>{w.quantity}</span>
                    </div>
                    <div>
                      <span style={{ color: '#8899aa' }}>Status: </span>
                      <span style={{ color: statusColors[w.status], textTransform: 'capitalize' }}>{w.status}</span>
                    </div>
                    <div>
                      <span style={{ color: '#8899aa' }}>Intro: </span>
                      <span style={{ color: 'white' }}>{w.yearIntroduced}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
