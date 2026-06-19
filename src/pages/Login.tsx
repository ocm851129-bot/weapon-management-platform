import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Eye, EyeOff, Lock, User, Globe2,
  MapPin, BarChart3, MessageSquare, Flag, ChevronRight, Menu, X,
} from 'lucide-react';
import Hls from 'hls.js';
import { useLang } from '../i18n/LangContext';
import type { Lang } from '../i18n/translations';

const langOptions: { value: Lang; label: string; short: string }[] = [
  { value: 'ko', label: '한국어', short: 'KR' },
  { value: 'en', label: 'English', short: 'EN' },
  { value: 'ja', label: '日本語', short: 'JA' },
];

const features = [
  {
    icon: Shield,
    titleKo: '무기체계 목록',
    titleEn: 'Weapon Inventory',
    titleJa: '武器体系リスト',
    descKo: '149개 무기체계 실시간 현황 관리 및 PDF 도시에 다운로드',
    descEn: '149 weapon systems tracked with real-time status and PDF export',
    descJa: '149の武器体系をリアルタイムで追跡・管理',
    color: '#00d4ff',
  },
  {
    icon: MapPin,
    titleKo: '글로벌 배치 지도',
    titleEn: 'Global Deployment Map',
    titleJa: 'グローバル配備マップ',
    descKo: '21개국 무기체계 실시간 위치 및 배치 현황 지도 시각화',
    descEn: 'Interactive map showing real-time deployment across 21 nations',
    descJa: '21カ国の配備状況をリアルタイムで地図表示',
    color: '#00e887',
  },
  {
    icon: Flag,
    titleKo: '국가별 전력 분석',
    titleEn: 'Arsenal by Nation',
    titleJa: '国別戦力分析',
    descKo: '21개국 전력 현황 비교 분석 및 카테고리별 무기 목록',
    descEn: 'Compare national arsenals and weapon categories across 21 nations',
    descJa: '21カ国の軍事力を比較分析',
    color: '#a78bfa',
  },
  {
    icon: MessageSquare,
    titleKo: '밀리터리 커뮤니티',
    titleEn: 'Military Community',
    titleJa: 'ミリタリーコミュニティ',
    descKo: '전문가 군사 분석·무기체계 토론·글로벌 방산 정보 공유',
    descEn: 'Expert analysis, weapon debates, and global defense intelligence',
    descJa: '専門軍事分析・兵器討論・防衛情報共有',
    color: '#f5c842',
  },
  {
    icon: BarChart3,
    titleKo: '전략 분석통계',
    titleEn: 'Strategic Analytics',
    titleJa: '戦略分析・統計',
    descKo: '운용 가능률·카테고리 분포·정비 비용 심층 통계 분석',
    descEn: 'Operational rates, category distribution, maintenance cost analytics',
    descJa: '稼働率・カテゴリ分布・整備費用の詳細統計',
    color: '#ff6b6b',
  },
];

const stats = [
  { valueKo: '149개', valueEn: '149', valueJa: '149', labelKo: '무기체계', labelEn: 'Weapon Systems', labelJa: '武器体系' },
  { valueKo: '21개국', valueEn: '21', valueJa: '21', labelKo: '등록 국가', labelEn: 'Nations', labelJa: 'カ国' },
  { valueKo: '11.5M+', valueEn: '11.5M+', valueJa: '11.5M+', labelKo: '총 보유 수량', labelEn: 'Total Units', labelJa: '総ユニット数' },
  { valueKo: '99.98%', valueEn: '99.98%', valueJa: '99.98%', labelKo: '시스템 가동률', labelEn: 'Uptime', labelJa: '稼働率' },
];

export default function Login() {
  const { t, lang, setLang } = useLang();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

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
    await new Promise(r => setTimeout(r, 1200));
    if (username === 'admin' && password === 'admin') {
      navigate('/dashboard');
    } else {
      setError(t('accessDenied'));
      setLoading(false);
    }
  };

  const txt = (ko: string, en: string, ja: string) => lang === 'ko' ? ko : lang === 'en' ? en : ja;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#07101e', fontFamily: "'Space Grotesk', 'Noto Sans KR', sans-serif" }}>

      {/* ── Top Navigation Bar ─────────────────────────────────────────────── */}
      <header className="relative z-50 flex items-center justify-between px-8 h-[64px] flex-shrink-0"
        style={{ background: 'rgba(5,9,18,0.95)', borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}>
            <Globe2 size={16} style={{ color: '#00d4ff' }} />
          </div>
          <div>
            <div className="text-[13px] font-bold tracking-[0.1em] text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              DATEWORLD
            </div>
            <div className="text-[9px] tracking-widest" style={{ color: 'rgba(0,212,255,0.5)', fontFamily: "'Space Mono', monospace" }}>
              WMS v2.0
            </div>
          </div>
        </div>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            [txt('플랫폼', 'Platform', 'プラットフォーム'), '#'],
            [txt('무기체계', 'Weapons', '武器体系'), '#'],
            [txt('국가별 전력', 'Nations', '国別戦力'), '#'],
            [txt('커뮤니티', 'Community', 'コミュニティ'), '#'],
            [txt('회사 소개', 'About', '会社概要'), '#'],
          ].map(([label]) => (
            <button key={label}
              className="px-4 py-2 rounded-lg text-[12.5px] font-medium transition-all hover:bg-white/5 hover:text-white"
              style={{ color: 'rgba(200,215,230,0.65)' }}>
              {label}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Lang */}
          <div className="hidden sm:flex items-center rounded-lg overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {langOptions.map((opt, i) => (
              <button key={opt.value} onClick={() => setLang(opt.value)}
                className="px-3 py-1.5 text-[11px] font-semibold transition-all"
                style={{
                  background: lang === opt.value ? 'rgba(0,212,255,0.15)' : 'transparent',
                  color: lang === opt.value ? '#00d4ff' : 'rgba(136,153,170,0.6)',
                  borderRight: i < langOptions.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: '0.04em',
                }}>
                {opt.short}
              </button>
            ))}
          </div>

          {/* Classification badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest"
            style={{ background: 'rgba(245,200,66,0.08)', border: '1px solid rgba(245,200,66,0.2)', color: '#f5c842' }}>
            ⬛ {txt('기밀', 'CLASSIFIED', '機密')}
          </div>

          {/* Mobile menu */}
          <button className="md:hidden p-2 rounded-lg hover:bg-white/05"
            style={{ color: '#8899aa' }}
            onClick={() => setMobileMenuOpen(v => !v)}>
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      <section className="relative flex-1 flex flex-col lg:flex-row min-h-0" style={{ minHeight: 'calc(100vh - 64px - 200px)' }}>

        {/* Video BG */}
        <video ref={videoRef} autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: 0.18 }} />

        {/* Gradient overlays */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(105deg, rgba(7,16,30,0.97) 0%, rgba(7,16,30,0.75) 55%, rgba(7,16,30,0.92) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #07101e, transparent)' }} />

        {/* Accent glow */}
        <div className="absolute top-0 right-0 pointer-events-none"
          style={{ width: 600, height: 600, background: 'radial-gradient(circle at 70% 20%, rgba(0,212,255,0.07) 0%, transparent 60%)' }} />

        {/* Left: Hero text */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-12 lg:py-0">

          {/* Top label */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-px" style={{ background: '#00d4ff' }} />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: '#00d4ff', fontFamily: "'Space Mono', monospace" }}>
              {txt('전세계 무기체계 관리 플랫폼', 'Global Weapon Management Platform', 'グローバル兵器管理プラットフォーム')}
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-black leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', color: '#f0f5ff', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}>
            {lang === 'ko' ? (
              <>전세계 무기체계<br /><span style={{ color: '#00d4ff' }}>실시간 가시성</span></>
            ) : lang === 'en' ? (
              <><span style={{ color: '#00d4ff' }}>Real-Time</span><br />Weapon Visibility</>
            ) : (
              <>兵器体系の<br /><span style={{ color: '#00d4ff' }}>リアルタイム可視化</span></>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-[14px] leading-relaxed mb-10 max-w-md"
            style={{ color: 'rgba(180,200,220,0.7)', fontFamily: "'Space Grotesk', 'Noto Sans KR', sans-serif" }}>
            {txt(
              '인벤토리·준비태세·정비·전략 분석을 하나의 통합 지휘 인터페이스로.',
              'Inventory, readiness, maintenance, and strategic analytics in one unified command interface.',
              'インベントリ・即応性・整備・戦略分析を一つの統合指揮インターフェースで。',
            )}
          </p>

          {/* Stats strip */}
          <div className="flex items-center gap-8 flex-wrap">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[22px] font-black leading-none" style={{ color: '#00d4ff', fontFamily: "'Space Mono', monospace" }}>
                  {lang === 'ko' ? s.valueKo : lang === 'en' ? s.valueEn : s.valueJa}
                </span>
                <span className="text-[11px] mt-1 font-medium" style={{ color: 'rgba(136,153,170,0.8)' }}>
                  {lang === 'ko' ? s.labelKo : lang === 'en' ? s.labelEn : s.labelJa}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Login card */}
        <div className="relative z-10 flex items-center justify-center px-8 lg:px-16 py-10 lg:py-0 lg:w-[480px] flex-shrink-0">
          <div className="w-full max-w-sm">

            {/* Card */}
            <div className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(8,16,30,0.92)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset',
              }}>

              {/* Card top accent bar */}
              <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, #00d4ff 40%, #0066cc 100%)' }} />

              <div className="p-8">
                {/* Card header */}
                <div className="mb-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                      <Shield size={18} style={{ color: '#00d4ff' }} />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-white">{t('loginTitle')}</div>
                      <div className="text-[11px]" style={{ color: 'rgba(136,153,170,0.7)' }}>{t('loginSub')}</div>
                    </div>
                  </div>

                  <div className="px-3 py-2 rounded-lg text-[10px] font-bold tracking-widest text-center"
                    style={{ background: 'rgba(245,200,66,0.07)', border: '1px solid rgba(245,200,66,0.18)', color: '#f5c842' }}>
                    ⬛ {t('classifiedOnly')}
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="block text-[10.5px] font-semibold tracking-[0.12em] uppercase mb-2"
                      style={{ color: 'rgba(136,153,170,0.8)' }}>
                      {t('userId')}
                    </label>
                    <div className="relative">
                      <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(136,153,170,0.5)' }} />
                      <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                        placeholder="user.id"
                        className="w-full pl-9 pr-4 py-3 rounded-xl text-[13px] outline-none transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.09)',
                          color: '#e8f0f8',
                          fontFamily: "'Space Mono', monospace",
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'; e.currentTarget.style.background = 'rgba(0,212,255,0.04)'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[10.5px] font-semibold tracking-[0.12em] uppercase mb-2"
                      style={{ color: 'rgba(136,153,170,0.8)' }}>
                      {t('authCode')}
                    </label>
                    <div className="relative">
                      <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(136,153,170,0.5)' }} />
                      <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-3 rounded-xl text-[13px] outline-none transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.09)',
                          color: '#e8f0f8',
                          fontFamily: "'Space Mono', monospace",
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'; e.currentTarget.style.background = 'rgba(0,212,255,0.04)'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      />
                      <button type="button" onClick={() => setShowPass(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color: 'rgba(136,153,170,0.5)' }}>
                        {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>

                  {/* Demo hint */}
                  <div className="text-[10.5px] text-center" style={{ color: 'rgba(100,120,140,0.7)' }}>
                    Demo &nbsp;
                    <span style={{ color: '#00d4ff', fontFamily: "'Space Mono', monospace" }}>admin</span>
                    &nbsp;/&nbsp;
                    <span style={{ color: '#00d4ff', fontFamily: "'Space Mono', monospace" }}>admin</span>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="px-4 py-2.5 rounded-xl text-[12px] font-semibold"
                      style={{ background: 'rgba(255,77,94,0.08)', border: '1px solid rgba(255,77,94,0.25)', color: '#ff4d5e' }}>
                      ⚠ {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-[13px] tracking-[0.08em] uppercase transition-all duration-200 flex items-center justify-center gap-2.5 group"
                    style={{
                      background: loading
                        ? 'rgba(0,212,255,0.15)'
                        : 'linear-gradient(135deg, #00b4d8 0%, #0096c7 100%)',
                      color: loading ? 'rgba(0,212,255,0.5)' : '#fff',
                      border: loading ? '1px solid rgba(0,212,255,0.2)' : '1px solid rgba(0,212,255,0.4)',
                      boxShadow: loading ? 'none' : '0 4px 20px rgba(0,150,199,0.3)',
                    }}>
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
                        {t('authenticating')}
                      </>
                    ) : (
                      <>
                        {t('authenticate')}
                        <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                {/* Warning */}
                <div className="mt-5 pt-5 border-t text-center text-[10px] leading-relaxed whitespace-pre-line tracking-wide"
                  style={{ borderColor: 'rgba(255,255,255,0.06)', color: 'rgba(100,115,130,0.7)' }}>
                  {t('unauthorizedWarning')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Cards Strip ─────────────────────────────────────────────── */}
      <section className="relative z-10 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(5,9,18,0.98)' }}>

        {/* Section label */}
        <div className="flex items-center gap-4 px-8 md:px-16 pt-8 pb-6">
          <div className="w-5 h-px" style={{ background: 'rgba(0,212,255,0.5)' }} />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(0,212,255,0.6)', fontFamily: "'Space Mono', monospace" }}>
            {txt('플랫폼 핵심 기능', 'Platform Capabilities', 'プラットフォーム機能')}
          </span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {features.map(({ icon: Icon, titleKo, titleEn, titleJa, descKo, descEn, descJa, color }) => {
            const title = lang === 'ko' ? titleKo : lang === 'en' ? titleEn : titleJa;
            const desc = lang === 'ko' ? descKo : lang === 'en' ? descEn : descJa;
            return (
              <div key={titleEn}
                className="group px-6 py-7 transition-all duration-200 cursor-pointer relative overflow-hidden"
                style={{ background: 'rgba(7,12,22,0.98)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Hover bg */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)` }} />
                {/* Top border on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-200 group-hover:scale-110"
                    style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <h3 className="text-[12.5px] font-bold text-white mb-2 leading-snug"
                    style={{ fontFamily: "'Space Grotesk', 'Noto Sans KR', sans-serif" }}>
                    {title}
                  </h3>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(136,153,170,0.7)' }}>
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer bar */}
        <div className="flex items-center justify-between px-8 md:px-16 py-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-[10px]" style={{ color: 'rgba(100,115,130,0.6)', fontFamily: "'Space Mono', monospace" }}>
            © 2026 DATEWORLD WMS · OSINT-based · Authorized Personnel Only
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00e887', boxShadow: '0 0 4px #00e887' }} />
            <span className="text-[10px] font-medium" style={{ color: 'rgba(0,232,135,0.7)', fontFamily: "'Space Grotesk', sans-serif" }}>
              {txt('시스템 정상', 'All Systems Operational', '全システム正常')}
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}
