import { weaponSystems, categoryColors, statusColors } from '../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Zap } from 'lucide-react';
import { useLang } from '../i18n/LangContext';

const stats = (() => {
  const s = { operational: 0, maintenance: 0, inactive: 0, reserve: 0 };
  weaponSystems.forEach(w => { s[w.status]++; });
  return s;
})();

const categoryData = Object.entries(
  weaponSystems.reduce((acc, w) => {
    acc[w.category] = (acc[w.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
).map(([name, value]) => ({ name, value, color: categoryColors[name] }));

const countryData = Object.entries(
  weaponSystems.reduce((acc, w) => {
    acc[w.country] = (acc[w.country] || 0) + w.quantity;
    return acc;
  }, {} as Record<string, number>)
).sort((a, b) => b[1] - a[1]).slice(0, 6)
  .map(([country, quantity]) => ({
    country: country.replace('United States', 'USA').replace('United Kingdom', 'UK').replace('South Korea', 'Korea'),
    quantity,
  }));

const trendData = [
  { month: 'Jan', operational: 62, maintenance: 8 },
  { month: 'Feb', operational: 65, maintenance: 6 },
  { month: 'Mar', operational: 63, maintenance: 9 },
  { month: 'Apr', operational: 68, maintenance: 7 },
  { month: 'May', operational: 70, maintenance: 8 },
  { month: 'Jun', operational: 72, maintenance: 10 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-[12px]">
      <div className="text-white font-semibold mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { t } = useLang();
  const total = weaponSystems.reduce((a, w) => a + w.quantity, 0);
  const countries = new Set(weaponSystems.map(w => w.country)).size;

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">{t('commandDashboard')}</h1>
          <p className="text-[12px] mt-1" style={{ color: '#8899aa' }}>{t('dashboardSub')}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)' }}>
          <div className="status-dot status-operational" />
          <span className="text-[12px] font-semibold text-[#00ff88]">{t('allNominal')}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('totalAssets'), value: total, sub: `${countries} nations`, color: '#00d4ff', icon: Shield },
          { label: t('operational'), value: stats.operational, sub: `${Math.round(stats.operational / weaponSystems.length * 100)}% readiness`, color: '#00ff88', icon: CheckCircle },
          { label: t('inMaintenance'), value: stats.maintenance, sub: '2 emergency', color: '#ffcc00', icon: AlertTriangle },
          { label: t('reserveInactive'), value: stats.reserve + stats.inactive, sub: `${stats.reserve} reserve, ${stats.inactive} inactive`, color: '#ff4444', icon: Zap },
        ].map(({ label, value, sub, color, icon: Icon }) => (
          <div key={label} className="glass rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <div className="text-2xl font-black text-white counter-value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
              <div className="text-[11px] font-semibold tracking-wider mt-0.5" style={{ color: '#8899aa' }}>{label}</div>
              <div className="text-[11px] mt-1" style={{ color }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[13px] font-bold text-white tracking-wider">{t('readinessTrend')}</h3>
              <p className="text-[11px]" style={{ color: '#8899aa' }}>{t('monthlyStatus')}</p>
            </div>
            <TrendingUp size={16} className="text-[#00d4ff]" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorOp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMaint" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffcc00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ffcc00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#8899aa', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8899aa', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="operational" stroke="#00ff88" fill="url(#colorOp)" strokeWidth={2} name={t('operational')} />
              <Area type="monotone" dataKey="maintenance" stroke="#ffcc00" fill="url(#colorMaint)" strokeWidth={2} name={t('inMaintenance')} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-xl p-5">
          <div className="mb-5">
            <h3 className="text-[13px] font-bold text-white tracking-wider">{t('byCategory')}</h3>
            <p className="text-[11px]" style={{ color: '#8899aa' }}>{t('systemTypeDist')}</p>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={60}
                dataKey="value" paddingAngle={3}>
                {categoryData.map(entry => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{
                background: '#0d1b2e', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', fontSize: '12px'
              }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-1">
            {categoryData.map(c => (
              <div key={c.name} className="flex items-center gap-1.5 text-[11px]">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                <span style={{ color: '#8899aa' }}>{c.name}</span>
                <span className="text-white ml-auto">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5">
          <div className="mb-5">
            <h3 className="text-[13px] font-bold text-white tracking-wider">{t('assetsByNation')}</h3>
            <p className="text-[11px]" style={{ color: '#8899aa' }}>{t('totalUnitCount')}</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={countryData} barSize={20}>
              <XAxis dataKey="country" tick={{ fill: '#8899aa', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8899aa', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="quantity" name={t('units')} fill="#00d4ff" radius={[2, 2, 0, 0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-xl p-5">
          <div className="mb-5">
            <h3 className="text-[13px] font-bold text-white tracking-wider">{t('recentAlerts')}</h3>
            <p className="text-[11px]" style={{ color: '#8899aa' }}>{t('systemEvents')}</p>
          </div>
          <div className="space-y-3">
            {[
              { type: 'warn', time: '06:42 UTC', msg: 'Patriot PAC-3 #4 scheduled maintenance started' },
              { type: 'error', time: '04:15 UTC', msg: 'F/A-18 Super Hornet engine fault detected' },
              { type: 'info', time: 'Yesterday', msg: 'F-35A Block 4 software update completed' },
              { type: 'info', time: 'Yesterday', msg: 'K2 Black Panther quarterly inspection passed' },
              { type: 'warn', time: '3 days ago', msg: 'Type 055 destroyer upgrade scheduled' },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  a.type === 'error' ? 'bg-[#ff4444]' : a.type === 'warn' ? 'bg-[#ffcc00]' : 'bg-[#00d4ff]'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-white leading-tight">{a.msg}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#445566' }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top systems table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
          <h3 className="text-[13px] font-bold text-white tracking-wider">{t('topSystems')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">{t('weaponSystem')}</th>
                <th className="text-left">{t('category')}</th>
                <th className="text-left">{t('nation')}</th>
                <th className="text-left">{t('status')}</th>
                <th className="text-right">{t('units')}</th>
                <th className="text-left">{t('nextService')}</th>
              </tr>
            </thead>
            <tbody>
              {weaponSystems.slice(0, 6).map(w => (
                <tr key={w.id}>
                  <td>
                    <div className="font-semibold text-white text-[13px]">{w.name}</div>
                    <div className="text-[11px]" style={{ color: '#445566' }}>{w.designation}</div>
                  </td>
                  <td>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold"
                      style={{ background: `${categoryColors[w.category]}15`, color: categoryColors[w.category] }}>
                      {w.category}
                    </span>
                  </td>
                  <td className="text-[12px]">{w.country}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <span className={`status-dot status-${w.status}`} />
                      <span className="text-[12px] font-semibold capitalize" style={{ color: statusColors[w.status] }}>
                        {w.status}
                      </span>
                    </div>
                  </td>
                  <td className="text-right font-mono text-[13px] text-white">{w.quantity.toLocaleString()}</td>
                  <td className="text-[12px]" style={{ color: '#8899aa' }}>{w.nextMaintenance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
