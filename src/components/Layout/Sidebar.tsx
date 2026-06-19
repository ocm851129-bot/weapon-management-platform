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
    { path: '/inventory',  icon: Shield,          label: t('inventory') },
    { path: '/map',        icon: Map,             label: t('globalMap') },
    { path: '/countries',  icon: Flag,            label: t('countries') },
    { path: '/community',  icon: MessageSquare,   label: t('community') },
    { path: '/maintenance',icon: Wrench,          label: t('maintenance') },
    { path: '/analytics',  icon: BarChart3,       label: t('analytics') },
  ];

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col h-screen sticky top-0"
      style={{
        background: 'linear-gradient(180deg, #080d16 0%, #070b12 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}>

      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)' }}>
            <Globe size={17} style={{ color: '#00d4ff' }} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00e887]"
              style={{ boxShadow: '0 0 6px #00e887' }} />
          </div>
          <div>
            <div className="text-white font-bold text-[13px] tracking-[0.12em]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              DATEWORLD
            </div>
            <div className="text-[10px] tracking-widest" style={{ color: 'rgba(0,212,255,0.5)', fontFamily: "'Space Mono', monospace" }}>
              WMS v2.0
            </div>
          </div>
        </div>
      </div>

      {/* ── Classification Badge ─────────────────────────────────────────── */}
      <div className="mx-4 mt-4 px-3 py-2 rounded-lg text-center"
        style={{ background: 'rgba(245,200,66,0.06)', border: '1px solid rgba(245,200,66,0.18)' }}>
        <span className="text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: '#f5c842' }}>
          ⬛ {t('classifiedAccessOnly')}
        </span>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="section-label px-2 mb-3">Navigation</div>
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                isActive
                  ? 'bg-[rgba(0,212,255,0.08)]'
                  : 'hover:bg-[rgba(255,255,255,0.04)]'
              }`
            }>
            {({ isActive }) => (
              <>
                <Icon size={15}
                  style={{ color: isActive ? '#00d4ff' : 'rgba(136,153,170,0.7)', transition: 'color 0.15s' }}
                  className="group-hover:!text-white flex-shrink-0" />
                <span className="text-[12.5px] font-medium tracking-[-0.01em] flex-1"
                  style={{
                    color: isActive ? '#e8f4ff' : 'rgba(136,153,170,0.85)',
                    fontFamily: "'Space Grotesk', 'Noto Sans KR', sans-serif",
                    transition: 'color 0.15s',
                  }}>
                  {label}
                </span>
                {isActive && (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00d4ff' }} />
                    <div className="nav-active-dot" />
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Alert ────────────────────────────────────────────────────────── */}
      <div className="mx-3 mb-3 px-3 py-2.5 rounded-xl"
        style={{ background: 'rgba(255,77,94,0.06)', border: '1px solid rgba(255,77,94,0.15)' }}>
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={12} style={{ color: '#ff4d5e' }} />
          <span className="text-[11px] font-semibold" style={{ color: '#ff4d5e' }}>
            2 {t('systemsOffline')}
          </span>
        </div>
        <div className="text-[10px] leading-relaxed" style={{ color: 'rgba(136,153,170,0.7)' }}>
          Patriot PAC-3 · F/A-18C
        </div>
      </div>

      {/* ── Bottom ───────────────────────────────────────────────────────── */}
      <div className="px-3 pb-4 border-t pt-3 space-y-0.5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <NavLink to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-[rgba(255,255,255,0.04)] group">
          <Settings size={14} style={{ color: 'rgba(136,153,170,0.6)' }} className="group-hover:!text-white" />
          <span className="text-[12px] font-medium" style={{ color: 'rgba(136,153,170,0.7)', fontFamily: "'Space Grotesk', sans-serif" }}>
            {t('settings')}
          </span>
        </NavLink>
        <NavLink to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-[rgba(255,77,94,0.06)] group">
          <LogOut size={14} style={{ color: 'rgba(136,153,170,0.6)' }} className="group-hover:!text-[#ff4d5e]" />
          <span className="text-[12px] font-medium" style={{ color: 'rgba(136,153,170,0.7)', fontFamily: "'Space Grotesk', sans-serif" }}
            >
            {t('logout')}
          </span>
        </NavLink>
      </div>
    </aside>
  );
}
