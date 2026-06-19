import { useState, useEffect } from 'react';
import { Bell, User, Wifi, Activity } from 'lucide-react';
import { useLang } from '../../i18n/LangContext';
import type { Lang } from '../../i18n/translations';

const langOptions: { value: Lang; label: string; flag: string }[] = [
  { value: 'ko', label: '한국어', flag: '🇰🇷' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'ja', label: '日本語', flag: '🇯🇵' },
];

export default function TopBar() {
  const [time, setTime] = useState(new Date());
  const { t, lang, setLang } = useLang();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) =>
    d.toUTCString().replace('GMT', 'UTC').slice(0, -4);

  return (
    <header className="h-14 flex items-center justify-between px-6 flex-shrink-0"
      style={{
        background: 'rgba(7,11,15,0.9)',
        borderBottom: '1px solid rgba(0,212,255,0.1)',
        backdropFilter: 'blur(12px)',
      }}>
      {/* Left: status */}
      <div className="flex items-center gap-6 text-[11px]">
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-[#00ff88]" />
          <span style={{ color: '#8899aa' }}>{t('systemStatus')}</span>
          <span className="text-[#00ff88] font-bold">{t('nominal')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Wifi size={12} className="text-[#00d4ff]" />
          <span style={{ color: '#8899aa' }}>{t('link')}</span>
          <span className="text-[#00d4ff] font-bold">{t('secure')}</span>
        </div>
        <div className="font-mono text-[11px] hidden md:block" style={{ color: '#8899aa' }}>
          {formatTime(time)}
        </div>
      </div>

      {/* Right: lang selector + user */}
      <div className="flex items-center gap-3">
        {/* Language Selector */}
        <div className="flex items-center gap-1 p-1 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {langOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setLang(opt.value)}
              title={opt.label}
              className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-all"
              style={{
                background: lang === opt.value ? 'rgba(0,212,255,0.15)' : 'transparent',
                color: lang === opt.value ? '#00d4ff' : '#8899aa',
                border: lang === opt.value ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent',
              }}>
              <span>{opt.flag}</span>
              <span className="hidden sm:inline">{opt.value.toUpperCase()}</span>
            </button>
          ))}
        </div>

        <button className="relative p-2 rounded hover:bg-[rgba(255,255,255,0.06)] transition-colors"
          style={{ color: '#8899aa' }}>
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ff4444]" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded"
          style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,212,255,0.2)' }}>
            <User size={12} className="text-[#00d4ff]" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-white">ADMIN</div>
            <div className="text-[10px]" style={{ color: '#8899aa' }}>TOP SECRET</div>
          </div>
        </div>
      </div>
    </header>
  );
}
