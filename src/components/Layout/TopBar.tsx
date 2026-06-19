import { useState, useEffect } from 'react';
import { Bell, User, Radio } from 'lucide-react';
import { useLang } from '../../i18n/LangContext';
import type { Lang } from '../../i18n/translations';

const langOptions: { value: Lang; label: string; short: string }[] = [
  { value: 'ko', label: '한국어', short: 'KR' },
  { value: 'en', label: 'English', short: 'EN' },
  { value: 'ja', label: '日本語', short: 'JA' },
];

export default function TopBar() {
  const [time, setTime] = useState(new Date());
  const { t, lang, setLang } = useLang();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = time.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' UTC';

  return (
    <header className="h-[52px] flex items-center justify-between px-5 flex-shrink-0"
      style={{
        background: 'rgba(8,13,22,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}>

      {/* ── Left: system status ──────────────────────────────────────────── */}
      <div className="flex items-center gap-5">
        {/* Online indicator */}
        <div className="flex items-center gap-2">
          <div className="status-dot status-operational" />
          <span className="text-[11px] font-medium" style={{ color: 'rgba(136,153,170,0.7)', fontFamily: "'Space Grotesk', sans-serif" }}>
            {t('systemStatus')}
          </span>
          <span className="text-[11px] font-semibold" style={{ color: '#00e887' }}>{t('nominal')}</span>
        </div>

        {/* Divider */}
        <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Link status */}
        <div className="flex items-center gap-1.5">
          <Radio size={11} style={{ color: '#00d4ff' }} />
          <span className="text-[11px] font-medium" style={{ color: 'rgba(136,153,170,0.7)' }}>LINK</span>
          <span className="text-[11px] font-semibold" style={{ color: '#00d4ff' }}>SECURE</span>
        </div>

        {/* Divider */}
        <div className="w-px h-4 hidden md:block" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Clock */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-[11px]" style={{ color: 'rgba(136,153,170,0.5)', fontFamily: "'Space Mono', monospace" }}>
            {dateStr}
          </span>
          <span className="text-[11px] font-bold" style={{ color: 'rgba(136,153,170,0.8)', fontFamily: "'Space Mono', monospace" }}>
            {timeStr}
          </span>
        </div>
      </div>

      {/* ── Right: controls ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">

        {/* Language selector */}
        <div className="flex items-center rounded-lg overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {langOptions.map((opt, i) => (
            <button key={opt.value} onClick={() => setLang(opt.value)} title={opt.label}
              className="relative px-3 py-1.5 text-[11px] font-semibold transition-all duration-150"
              style={{
                background: lang === opt.value ? 'rgba(0,212,255,0.12)' : 'transparent',
                color: lang === opt.value ? '#00d4ff' : 'rgba(136,153,170,0.65)',
                borderRight: i < langOptions.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: '0.04em',
              }}>
              {opt.short}
            </button>
          ))}
        </div>

        {/* Notification bell */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-[rgba(255,255,255,0.06)]"
          style={{ color: 'rgba(136,153,170,0.7)' }}>
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: '#ff4d5e', boxShadow: '0 0 4px #ff4d5e' }} />
        </button>

        {/* User badge */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.04)]"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <User size={13} style={{ color: '#00d4ff' }} />
          </div>
          <div className="hidden sm:block">
            <div className="text-[11.5px] font-semibold text-white leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ADMIN
            </div>
            <div className="text-[9px] font-bold tracking-widest mt-0.5" style={{ color: 'rgba(245,200,66,0.7)', fontFamily: "'Space Mono', monospace" }}>
              TOP SECRET
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
