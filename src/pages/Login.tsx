import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, User, Globe } from 'lucide-react';
import Hls from 'hls.js';
import { useLang } from '../i18n/LangContext';
import type { Lang } from '../i18n/translations';

const langOptions: { value: Lang; label: string; flag: string }[] = [
  { value: 'ko', label: '한국어', flag: '🇰🇷' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'ja', label: '日本語', flag: '🇯🇵' },
];

export default function Login() {
  const { t, lang, setLang } = useLang();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [typed, setTyped] = useState('');
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const headline = t('platformName');

  useEffect(() => {
    let i = 0;
    setTyped('');
    const timer = setInterval(() => {
      setTyped(headline.slice(0, i));
      i++;
      if (i > headline.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [headline]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const src = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8';
    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: false });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.play().catch(() => {});
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    if (username === 'admin' && password === 'admin') {
      navigate('/dashboard');
    } else {
      setError(t('accessDenied'));
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#070b0f' }}>

      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.25 }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(7,11,15,0.95) 0%, rgba(7,11,15,0.6) 50%, rgba(7,11,15,0.95) 100%)' }} />
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(7,11,15,1) 0%, transparent 60%)' }} />

      {/* Grid lines */}
      <div className="grid-line hidden md:block" style={{ left: '25%' }} />
      <div className="grid-line hidden md:block" style={{ left: '50%' }} />
      <div className="grid-line hidden md:block" style={{ left: '75%' }} />

      {/* Central glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ zIndex: 1 }}>
        <svg width="900" height="300" viewBox="0 0 900 300">
          <defs>
            <filter id="blur-glow">
              <feGaussianBlur stdDeviation="25" />
            </filter>
          </defs>
          <ellipse cx="450" cy="100" rx="350" ry="80"
            fill="rgba(0,180,140,0.15)" filter="url(#blur-glow)" />
        </svg>
      </div>

      {/* Scan line */}
      <div className="scanline" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-5xl px-8 flex flex-col lg:flex-row gap-12 items-center">
        {/* Left: Hero text */}
        <div className="flex-1 text-left hidden lg:block">
          <div className="flex items-center gap-2 mb-6">
            <Globe size={14} className="text-[#00d4ff]" />
            <span className="text-[11px] font-bold tracking-widest text-[#00d4ff]">DATEWORLD PLATFORM</span>
          </div>

          {/* Liquid glass card */}
          <div className="liquid-glass rounded-xl p-5 mb-8 w-48 -translate-y-12 inline-block">
            <div className="text-[10px] tracking-widest text-[#00d4ff] mb-2">[ 2026 ]</div>
            <div className="text-[13px] font-semibold text-white leading-tight mb-2">
              Trusted by <span style={{ fontFamily: 'Instrument Serif', fontStyle: 'italic', color: '#00d4ff' }}>Military</span> Organizations
            </div>
            <div className="text-[10px]" style={{ color: '#8899aa' }}>
              30+ Nations · 4,200+ Systems Tracked
            </div>
          </div>

          <h1 className="text-5xl font-black uppercase tracking-tight text-white leading-none mb-4"
            style={{ fontFamily: 'Inter', maxWidth: '520px' }}>
            {typed}
            <span className="animate-blink text-[#00d4ff]">_</span>
          </h1>
          <p className="text-sm leading-relaxed max-w-md" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {t('platformDesc')}
          </p>

          <div className="flex gap-4 mt-6 text-[11px]">
            {[
              { v: '12,400+', l: 'Assets Tracked' },
              { v: '30+', l: 'Nations' },
              { v: '99.98%', l: 'Uptime' },
            ].map(({ v, l }) => (
              <div key={l} className="text-center">
                <div className="text-[#00d4ff] font-bold text-xl">{v}</div>
                <div style={{ color: '#8899aa' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Login card */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="liquid-glass rounded-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4"
                style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)' }}>
                <Shield size={24} className="text-[#00d4ff]" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-widest mb-1">{t('loginTitle')}</h2>
              <p className="text-[11px] tracking-widest" style={{ color: '#8899aa' }}>
                {t('loginSub')}
              </p>
              <div className="mt-3 px-3 py-1 rounded-full inline-block text-[10px] font-bold tracking-widest"
                style={{ background: 'rgba(255,204,0,0.1)', border: '1px solid rgba(255,204,0,0.3)', color: '#ffcc00' }}>
                ⬛ {t('classifiedOnly')}
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold tracking-wider mb-2 text-[#8899aa]">
                  {t('userId')}
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8899aa]" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder={t('userId')}
                    className="w-full pl-9 pr-4 py-3 rounded-lg text-[13px] outline-none placeholder-[#445566] text-white"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      fontFamily: 'Courier New, monospace',
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-wider mb-2 text-[#8899aa]">
                  {t('authCode')}
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8899aa]" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={t('authCode')}
                    className="w-full pl-9 pr-10 py-3 rounded-lg text-[13px] outline-none placeholder-[#445566] text-white"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      fontFamily: 'Courier New, monospace',
                    }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8899aa] hover:text-white transition-colors">
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-lg text-[12px] font-semibold tracking-wide"
                  style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: '#ff4444' }}>
                  ⚠ {error}
                </div>
              )}

              <div className="text-[10px] text-center" style={{ color: '#8899aa' }}>
                Demo: <span className="text-[#00d4ff] font-mono">admin / admin</span>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-lg font-bold text-[13px] tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: loading ? 'rgba(0,212,255,0.3)' : 'rgba(0,212,255,0.9)',
                  color: '#070b0f',
                  border: loading ? '1px solid rgba(0,212,255,0.3)' : '1px solid #00d4ff',
                }}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#070b0f] border-t-transparent rounded-full animate-spin" />
                    {t('authenticating')}
                  </>
                ) : t('authenticate')}
              </button>
            </form>

            {/* Lang selector on login */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {langOptions.map(opt => (
                <button key={opt.value} onClick={() => setLang(opt.value)}
                  className="flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-all"
                  style={{
                    background: lang === opt.value ? 'rgba(0,212,255,0.1)' : 'transparent',
                    color: lang === opt.value ? '#00d4ff' : '#445566',
                    border: lang === opt.value ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent',
                  }}>
                  {opt.flag} {opt.label}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t text-center text-[10px] tracking-wider whitespace-pre-line"
              style={{ borderColor: 'rgba(255,255,255,0.06)', color: '#445566' }}>
              {t('unauthorizedWarning')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
