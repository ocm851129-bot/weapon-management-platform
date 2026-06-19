import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Shield, Map, Wrench, BarChart3,
  Settings, LogOut, AlertTriangle, Globe, Flag, MessageSquare
} from 'lucide-react';
import { useLang } from '../../i18n/LangContext';

export default function Sidebar() {
  const { t } = useLang();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { path: '/inventory', icon: Shield, label: t('inventory') },
    { path: '/map', icon: Map, label: t('globalMap') },
    { path: '/countries', icon: Flag, label: t('countries') },
    { path: '/maintenance', icon: Wrench, label: t('maintenance') },
    { path: '/analytics', icon: BarChart3, label: t('analytics') },
    { path: '/community', icon: MessageSquare, label: t('community') },
  ];

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col h-screen sticky top-0"
      style={{ background: 'rgba(7,11,15,0.98)', borderRight: '1px solid rgba(0,212,255,0.1)' }}>
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center rounded"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)' }}>
            <Globe size={20} className="text-[#00d4ff]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-widest">DATEWORLD</div>
            <div className="text-[10px] tracking-wider" style={{ color: '#8899aa' }}>WMS v2.0</div>
          </div>
        </div>
      </div>

      {/* Classification Banner */}
      <div className="mx-3 mt-4 px-3 py-1.5 rounded text-center text-[10px] font-bold tracking-widest"
        style={{ background: 'rgba(255,204,0,0.1)', border: '1px solid rgba(255,204,0,0.3)', color: '#ffcc00' }}>
        ⬛ {t('classifiedAccessOnly')}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200 group ${
                isActive
                  ? 'bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.25)]'
                  : 'hover:bg-[rgba(255,255,255,0.04)] border border-transparent'
              }`
            }>
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-[#00d4ff]' : 'text-[#8899aa] group-hover:text-white'} />
                <span className={`text-[12px] font-semibold ${isActive ? 'text-[#00d4ff]' : 'text-[#8899aa] group-hover:text-white'}`}>
                  {label}
                </span>
                {isActive && <div className="ml-auto w-1 h-4 rounded-full bg-[#00d4ff]" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Alert */}
      <div className="mx-3 mb-3 p-3 rounded" style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)' }}>
        <div className="flex items-center gap-2 text-[#ff4444] text-[11px] font-semibold">
          <AlertTriangle size={14} />
          2 {t('systemsOffline')}
        </div>
        <div className="text-[10px] mt-1" style={{ color: '#8899aa' }}>Patriot PAC-3, F/A-18 Super Hornet</div>
      </div>

      {/* Bottom */}
      <div className="p-3 border-t space-y-1" style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
        <NavLink to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded text-[12px] font-semibold text-[#8899aa] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-all">
          <Settings size={15} /> {t('settings')}
        </NavLink>
        <NavLink to="/"
          className="flex items-center gap-3 px-3 py-2 rounded text-[12px] font-semibold text-[#8899aa] hover:text-[#ff4444] hover:bg-[rgba(255,68,68,0.04)] transition-all">
          <LogOut size={15} /> {t('logout')}
        </NavLink>
      </div>
    </aside>
  );
}
