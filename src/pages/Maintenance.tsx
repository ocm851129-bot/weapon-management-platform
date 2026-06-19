import { useState } from 'react';
import { maintenanceRecords } from '../data/mockData';
import type { MaintenanceRecord } from '../types';
import { Wrench, Clock, DollarSign, CheckCircle, Loader, Calendar, ChevronRight } from 'lucide-react';

const statusConfig = {
  completed: { color: '#00ff88', bg: 'rgba(0,255,136,0.08)', label: 'COMPLETED', icon: CheckCircle },
  'in-progress': { color: '#ffcc00', bg: 'rgba(255,204,0,0.08)', label: 'IN PROGRESS', icon: Loader },
  scheduled: { color: '#00d4ff', bg: 'rgba(0,212,255,0.08)', label: 'SCHEDULED', icon: Calendar },
};

const typeColor: Record<MaintenanceRecord['type'], string> = {
  Scheduled: '#00d4ff',
  Emergency: '#ff4444',
  Upgrade: '#aa44ff',
  Inspection: '#00ff88',
};

function RecordCard({ r }: { r: MaintenanceRecord }) {
  const cfg = statusConfig[r.status];
  const Icon = cfg.icon;

  return (
    <div className="glass rounded-xl p-5 hover:border-[rgba(0,212,255,0.15)] transition-all animate-fadeIn">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded"
              style={{ background: `${typeColor[r.type]}15`, color: typeColor[r.type], border: `1px solid ${typeColor[r.type]}30` }}>
              {r.type.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono" style={{ color: '#445566' }}>{r.id}</span>
          </div>
          <h3 className="text-[15px] font-bold text-white">{r.weaponName}</h3>
          <p className="text-[12px] mt-0.5" style={{ color: '#8899aa' }}>{r.date} · Technician: {r.technician}</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0"
          style={{ background: cfg.bg, border: `1px solid ${cfg.color}20` }}>
          <Icon size={11} style={{ color: cfg.color }} />
          <span className="text-[10px] font-bold tracking-wider" style={{ color: cfg.color }}>{cfg.label}</span>
        </div>
      </div>

      <p className="text-[12px] mb-4 leading-relaxed" style={{ color: '#8899aa' }}>{r.notes}</p>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Clock, label: 'Duration', value: `${r.duration}h`, color: '#00d4ff' },
          { icon: DollarSign, label: 'Cost', value: `$${(r.cost / 1000).toFixed(0)}K`, color: '#00ff88' },
          { icon: Wrench, label: 'Status', value: r.status, color: cfg.color },
        ].map(({ icon: I, label, value, color }) => (
          <div key={label} className="text-center p-3 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <I size={14} style={{ color }} className="mx-auto mb-1" />
            <div className="text-[11px]" style={{ color: '#8899aa' }}>{label}</div>
            <div className="text-[13px] font-semibold capitalize" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Maintenance() {
  const [filter, setFilter] = useState<MaintenanceRecord['status'] | ''>('');

  const counts = {
    completed: maintenanceRecords.filter(r => r.status === 'completed').length,
    'in-progress': maintenanceRecords.filter(r => r.status === 'in-progress').length,
    scheduled: maintenanceRecords.filter(r => r.status === 'scheduled').length,
  };

  const totalCost = maintenanceRecords.reduce((a, r) => a + r.cost, 0);
  const totalHours = maintenanceRecords.reduce((a, r) => a + r.duration, 0);

  const filtered = filter ? maintenanceRecords.filter(r => r.status === filter) : maintenanceRecords;

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">MAINTENANCE MANAGEMENT</h1>
          <p className="text-[12px] mt-1" style={{ color: '#8899aa' }}>
            Scheduled, in-progress, and completed maintenance records
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'TOTAL RECORDS', value: maintenanceRecords.length, color: '#00d4ff', icon: Wrench },
          { label: 'IN PROGRESS', value: counts['in-progress'], color: '#ffcc00', icon: Loader },
          { label: 'TOTAL HOURS', value: `${totalHours}h`, color: '#00ff88', icon: Clock },
          { label: 'TOTAL COST', value: `$${(totalCost / 1000000).toFixed(1)}M`, color: '#aa44ff', icon: DollarSign },
        ].map(({ label, value, color, icon: I }) => (
          <div key={label} className="glass rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
              <I size={16} style={{ color }} />
            </div>
            <div>
              <div className="text-lg font-black text-white">{value}</div>
              <div className="text-[10px] font-semibold tracking-wider" style={{ color: '#8899aa' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {([
          { val: '', label: 'All', count: maintenanceRecords.length },
          { val: 'in-progress', label: 'In Progress', count: counts['in-progress'] },
          { val: 'scheduled', label: 'Scheduled', count: counts.scheduled },
          { val: 'completed', label: 'Completed', count: counts.completed },
        ] as { val: MaintenanceRecord['status'] | ''; label: string; count: number }[]).map(t => (
          <button key={t.val} onClick={() => setFilter(t.val)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all"
            style={{
              background: filter === t.val ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.04)',
              border: filter === t.val ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
              color: filter === t.val ? '#00d4ff' : '#8899aa',
            }}>
            {t.label}
            <span className="px-1.5 py-0.5 rounded text-[10px]"
              style={{ background: 'rgba(255,255,255,0.06)', color: filter === t.val ? '#00d4ff' : '#445566' }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(r => <RecordCard key={r.id} r={r} />)}
      </div>

      {/* Upcoming schedule */}
      <div className="mt-6 glass rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
          <h3 className="text-[13px] font-bold text-white tracking-wider">UPCOMING MAINTENANCE SCHEDULE</h3>
          <ChevronRight size={16} className="text-[#8899aa]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">SYSTEM</th>
                <th className="text-left">TYPE</th>
                <th className="text-left">DATE</th>
                <th className="text-right">EST. DURATION</th>
                <th className="text-right">EST. COST</th>
                <th className="text-left">TECHNICIAN</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceRecords
                .filter(r => r.status !== 'completed')
                .sort((a, b) => a.date.localeCompare(b.date))
                .map(r => (
                  <tr key={r.id}>
                    <td>
                      <div className="font-semibold text-white">{r.weaponName}</div>
                      <div className="text-[11px]" style={{ color: '#445566' }}>{r.id}</div>
                    </td>
                    <td>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold"
                        style={{ background: `${typeColor[r.type]}10`, color: typeColor[r.type] }}>
                        {r.type}
                      </span>
                    </td>
                    <td className="text-[12px] text-white">{r.date}</td>
                    <td className="text-right font-mono text-[12px] text-white">{r.duration}h</td>
                    <td className="text-right font-mono text-[12px]" style={{ color: '#00ff88' }}>
                      ${r.cost.toLocaleString()}
                    </td>
                    <td className="text-[12px]" style={{ color: '#8899aa' }}>{r.technician}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
