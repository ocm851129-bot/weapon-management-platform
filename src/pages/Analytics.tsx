import { weaponSystems, maintenanceRecords, categoryColors, statusColors } from '../data/mockData';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1b2e', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', padding: '10px 14px' }}>
      <div className="text-white text-[12px] font-semibold mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="text-[11px]" style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</div>
      ))}
    </div>
  );
};

const readinessData = [
  { subject: 'Air Power', score: 78 },
  { subject: 'Naval', score: 85 },
  { subject: 'Ground', score: 72 },
  { subject: 'Missiles', score: 90 },
  { subject: 'Cyber', score: 60 },
  { subject: 'Space', score: 45 },
];

const yearData = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map(y => ({
  year: y,
  additions: Math.floor(Math.random() * 5) + 1,
  decommissioned: Math.floor(Math.random() * 2),
}));

const maintCostData = maintenanceRecords.map(r => ({
  name: r.weaponName.split(' ').slice(0, 2).join(' '),
  cost: r.cost,
  hours: r.duration,
}));

export default function Analytics() {
  const catDist = Object.entries(
    weaponSystems.reduce((acc, w) => {
      acc[w.category] = (acc[w.category] || 0) + w.quantity;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value, color: categoryColors[name] }));

  const statusDist = Object.entries(
    weaponSystems.reduce((acc, w) => {
      acc[w.status] = (acc[w.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value, color: statusColors[name] }));

  const totalUnits = weaponSystems.reduce((a, w) => a + w.quantity, 0);
  const operationalUnits = weaponSystems.filter(w => w.status === 'operational').reduce((a, w) => a + w.quantity, 0);

  return (
    <div className="p-6 animate-fadeIn space-y-5">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">STRATEGIC ANALYTICS</h1>
        <p className="text-[12px] mt-1" style={{ color: '#8899aa' }}>
          Comprehensive analysis of global weapon system data
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL UNITS', value: totalUnits.toLocaleString(), sub: `${weaponSystems.length} system types`, color: '#00d4ff' },
          { label: 'OPERATIONAL RATE', value: `${Math.round(operationalUnits / totalUnits * 100)}%`, sub: `${operationalUnits.toLocaleString()} units`, color: '#00ff88' },
          { label: 'AVG SERVICE INTERVAL', value: '6.2 mo', sub: 'Across all systems', color: '#ffcc00' },
          { label: 'TOTAL MAINT. COST', value: `$${(maintenanceRecords.reduce((a, r) => a + r.cost, 0) / 1000000).toFixed(1)}M`, sub: 'YTD 2026', color: '#aa44ff' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="glass rounded-xl p-5 text-center">
            <div className="text-2xl font-black" style={{ color }}>{value}</div>
            <div className="text-[11px] font-bold tracking-wider mt-1" style={{ color: '#8899aa' }}>{label}</div>
            <div className="text-[11px] mt-1" style={{ color: '#445566' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Radar */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-[13px] font-bold text-white tracking-wider mb-4">READINESS BY DOMAIN</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={readinessData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#8899aa', fontSize: 11 }} />
              <Radar name="Score" dataKey="score" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-[13px] font-bold text-white tracking-wider mb-4">STATUS DISTRIBUTION</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusDist} cx="50%" cy="50%" outerRadius={60} dataKey="value" paddingAngle={3}>
                {statusDist.map(e => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{
                background: '#0d1b2e', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', fontSize: '12px'
              }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {statusDist.map(s => (
              <div key={s.name} className="flex items-center gap-1.5 text-[11px]">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <span className="capitalize" style={{ color: '#8899aa' }}>{s.name}</span>
                <span className="ml-auto text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category distribution */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-[13px] font-bold text-white tracking-wider mb-4">UNITS BY CATEGORY</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={catDist} layout="vertical" barSize={12}>
              <XAxis type="number" tick={{ fill: '#8899aa', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#8899aa', fontSize: 10 }} axisLine={false} tickLine={false} width={65} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Units" radius={[0, 2, 2, 0]}>
                {catDist.map(e => <Cell key={e.name} fill={e.color} fillOpacity={0.8} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Year additions */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-[13px] font-bold text-white tracking-wider mb-4">FLEET CHANGES (YoY)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={yearData}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="year" tick={{ fill: '#8899aa', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8899aa', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="additions" stroke="#00ff88" strokeWidth={2} dot={{ fill: '#00ff88', r: 3 }} name="New Systems" />
              <Line type="monotone" dataKey="decommissioned" stroke="#ff4444" strokeWidth={2} dot={{ fill: '#ff4444', r: 3 }} name="Decommissioned" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance cost */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-[13px] font-bold text-white tracking-wider mb-4">MAINTENANCE COST ANALYSIS</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={maintCostData} barSize={16}>
              <XAxis dataKey="name" tick={{ fill: '#8899aa', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8899aa', fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cost" name="Cost ($)" fill="#aa44ff" fillOpacity={0.8} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top systems table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
          <h3 className="text-[13px] font-bold text-white tracking-wider">SYSTEMS BY UNIT COUNT</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">SYSTEM</th>
                <th className="text-left">CATEGORY</th>
                <th className="text-left">COUNTRY</th>
                <th className="text-right">UNITS</th>
                <th className="text-left w-48">SHARE OF TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {[...weaponSystems].sort((a, b) => b.quantity - a.quantity).map(w => (
                <tr key={w.id}>
                  <td>
                    <div className="font-semibold text-white">{w.name}</div>
                    <div className="text-[11px]" style={{ color: '#445566' }}>{w.designation}</div>
                  </td>
                  <td>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold"
                      style={{ background: `${categoryColors[w.category]}15`, color: categoryColors[w.category] }}>
                      {w.category}
                    </span>
                  </td>
                  <td className="text-[12px]">{w.country}</td>
                  <td className="text-right font-mono text-[13px] text-white">{w.quantity.toLocaleString()}</td>
                  <td>
                    <div className="progress-bar w-full">
                      <div className="progress-fill"
                        style={{
                          width: `${(w.quantity / totalUnits * 100).toFixed(1)}%`,
                          background: categoryColors[w.category],
                        }} />
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: '#445566' }}>
                      {(w.quantity / totalUnits * 100).toFixed(1)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
