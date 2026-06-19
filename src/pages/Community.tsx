import { useState, useMemo } from 'react';
import {
  MessageSquare, ThumbsUp, Eye, TrendingUp, Search, Plus,
  Pin, Flame, Users, Tag, Send, X, Shield
} from 'lucide-react';
import { useLang } from '../i18n/LangContext';
import {
  communityPosts, communityComments, communityCategories,
  trendingTags, onlineMembers,
  type CommunityPost, type CommunityComment,
} from '../data/communityData';

const CLS_COLOR: Record<string, string> = {
  UNCLASSIFIED: '#00d4ff',
  CONFIDENTIAL: '#ffcc00',
  SECRET: '#ff8800',
};
const CLS_BG: Record<string, string> = {
  UNCLASSIFIED: 'rgba(0,212,255,0.12)',
  CONFIDENTIAL: 'rgba(255,204,0,0.12)',
  SECRET: 'rgba(255,136,0,0.12)',
};

function timeSince(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date('2026-06-19');
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return '오늘';
  if (diff === 1) return '1일 전';
  if (diff < 7) return `${diff}일 전`;
  if (diff < 30) return `${Math.floor(diff / 7)}주 전`;
  return `${Math.floor(diff / 30)}개월 전`;
}

function getCategoryColor(catId: string) {
  return communityCategories.find(c => c.id === catId)?.color ?? '#8899aa';
}

function getCategoryLabel(catId: string, lang: string) {
  const c = communityCategories.find(x => x.id === catId);
  if (!c) return catId;
  return lang === 'en' ? c.labelEn : lang === 'ja' ? c.labelJa : c.label;
}

// ── Post Card ─────────────────────────────────────────────────────────────────
function PostCard({ post, onClick }: { post: CommunityPost; onClick: () => void }) {
  const { lang } = useLang();
  const catColor = getCategoryColor(post.category);
  const clsColor = CLS_COLOR[post.clearanceLevel] ?? '#8899aa';

  return (
    <div onClick={onClick}
      className="rounded-xl p-4 cursor-pointer transition-all duration-200 hover:translate-y-[-1px] group"
      style={{
        background: 'rgba(14,22,30,0.9)',
        border: post.pinned ? '1px solid rgba(255,204,0,0.3)' : '1px solid rgba(0,212,255,0.1)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      }}>
      {/* Top row */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {post.pinned && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: 'rgba(255,204,0,0.15)', border: '1px solid rgba(255,204,0,0.4)', color: '#ffcc00' }}>
            <Pin size={9} /> {lang === 'en' ? 'PINNED' : lang === 'ja' ? '固定' : '공지'}
          </span>
        )}
        {post.hot && !post.pinned && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: 'rgba(255,68,68,0.15)', border: '1px solid rgba(255,68,68,0.4)', color: '#ff4444' }}>
            <Flame size={9} /> HOT
          </span>
        )}
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ background: `${catColor}18`, border: `1px solid ${catColor}40`, color: catColor }}>
          {getCategoryLabel(post.category, lang)}
        </span>
        <span className="ml-auto text-[10px]" style={{ color: '#8899aa' }}>{timeSince(post.createdAt)}</span>
      </div>

      {/* Title */}
      <h3 className="text-[13px] font-bold text-white group-hover:text-[#00d4ff] transition-colors mb-1.5 line-clamp-2">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="text-[11px] leading-relaxed line-clamp-2 mb-3" style={{ color: 'rgba(136,153,170,0.85)' }}>
        {post.content.replace(/\*\*/g, '').replace(/\n/g, ' ').slice(0, 120)}…
      </p>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {post.tags.slice(0, 4).map(tag => (
            <span key={tag} className="px-1.5 py-0.5 rounded text-[10px]"
              style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', color: '#8899aa' }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom: author + stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
            style={{ background: `${clsColor}20`, border: `1px solid ${clsColor}40`, color: clsColor }}>
            {post.author.slice(0, 1)}
          </div>
          <div>
            <div className="text-[11px] font-bold" style={{ color: '#c0cdd8' }}>{post.author}</div>
            <div className="text-[9px]" style={{ color: '#8899aa' }}>{post.authorRank}</div>
          </div>
          <div className="px-1.5 py-0.5 rounded text-[9px] font-bold"
            style={{ background: CLS_BG[post.clearanceLevel], color: clsColor }}>
            {post.clearanceLevel === 'UNCLASSIFIED' ? 'UNCLS' : post.clearanceLevel}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px]" style={{ color: '#8899aa' }}>
            <Eye size={10} /> {post.views.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 text-[11px]" style={{ color: '#8899aa' }}>
            <MessageSquare size={10} /> {post.commentsCount}
          </span>
          <span className="flex items-center gap-1 text-[11px]" style={{ color: '#ff6680' }}>
            <ThumbsUp size={10} /> {post.likes}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Post Detail Modal ─────────────────────────────────────────────────────────
function PostDetailModal({
  post, comments, onClose,
}: {
  post: CommunityPost;
  comments: CommunityComment[];
  onClose: () => void;
}) {
  const { lang } = useLang();
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<CommunityComment[]>(comments);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const catColor = getCategoryColor(post.category);
  const clsColor = CLS_COLOR[post.clearanceLevel] ?? '#8899aa';

  const handleComment = () => {
    if (!commentText.trim()) return;
    const nc: CommunityComment = {
      id: `CC-NEW-${Date.now()}`,
      postId: post.id,
      author: 'ADMIN',
      authorRank: lang === 'en' ? 'Admin' : lang === 'ja' ? '管理者' : '관리자',
      content: commentText.trim(),
      likes: 0,
      createdAt: '2026-06-19',
    };
    setLocalComments(prev => [...prev, nc]);
    setCommentText('');
  };

  const contentLines = post.content.split('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden"
        style={{ background: 'rgba(10,18,26,0.99)', border: '1px solid rgba(0,212,255,0.25)', boxShadow: '0 0 60px rgba(0,212,255,0.12)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b flex-shrink-0" style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {post.pinned && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: 'rgba(255,204,0,0.15)', color: '#ffcc00', border: '1px solid rgba(255,204,0,0.4)' }}>
                    <Pin size={9} /> {lang === 'en' ? 'PINNED' : '공지'}
                  </span>
                )}
                {post.hot && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: 'rgba(255,68,68,0.15)', color: '#ff4444', border: '1px solid rgba(255,68,68,0.4)' }}>
                    <Flame size={9} /> HOT
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: `${catColor}18`, border: `1px solid ${catColor}40`, color: catColor }}>
                  {getCategoryLabel(post.category, lang)}
                </span>
                <span className="text-[10px]" style={{ color: '#8899aa' }}>{post.id} · {timeSince(post.createdAt)}</span>
              </div>
              <h2 className="text-[17px] font-bold text-white leading-snug">{post.title}</h2>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:bg-white/10"
              style={{ color: '#8899aa' }}>
              <X size={16} />
            </button>
          </div>

          {/* Author row */}
          <div className="flex items-center gap-3 mt-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px]"
              style={{ background: `${clsColor}20`, border: `1px solid ${clsColor}40`, color: clsColor }}>
              {post.author.slice(0, 1)}
            </div>
            <div>
              <div className="text-[12px] font-bold text-white">{post.author}</div>
              <div className="text-[10px]" style={{ color: '#8899aa' }}>{post.authorRank}</div>
            </div>
            <div className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold"
              style={{ background: CLS_BG[post.clearanceLevel], color: clsColor }}>
              {post.clearanceLevel}
            </div>
            <div className="ml-auto flex items-center gap-4">
              <span className="flex items-center gap-1 text-[11px]" style={{ color: '#8899aa' }}>
                <Eye size={11} /> {post.views.toLocaleString()}
              </span>
              <button onClick={() => { setLiked(p => !p); setLikeCount(c => c + (liked ? -1 : 1)); }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all"
                style={{
                  background: liked ? 'rgba(255,102,128,0.2)' : 'rgba(255,255,255,0.05)',
                  border: liked ? '1px solid rgba(255,102,128,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  color: liked ? '#ff6680' : '#8899aa',
                }}>
                <ThumbsUp size={11} /> {likeCount}
              </button>
            </div>
          </div>
        </div>

        {/* Content + Comments scroll */}
        <div className="flex-1 overflow-y-auto">
          {/* Post Content */}
          <div className="px-6 py-5">
            <div className="text-[12.5px] leading-relaxed space-y-2" style={{ color: 'rgba(220,230,240,0.9)' }}>
              {contentLines.map((line, i) => {
                if (!line.trim()) return <div key={i} className="h-1" />;
                const bold = line.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#00d4ff">$1</strong>');
                return (
                  <p key={i} dangerouslySetInnerHTML={{ __html: bold }} />
                );
              })}
            </div>
            {/* Tags */}
            <div className="flex gap-2 flex-wrap mt-4">
              {post.tags.map(tag => (
                <span key={tag} className="px-2 py-1 rounded text-[11px]"
                  style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', color: '#8899aa' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="border-t px-6 py-4" style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
            <div className="text-[12px] font-bold mb-4 flex items-center gap-2" style={{ color: '#00d4ff' }}>
              <MessageSquare size={13} />
              {lang === 'en' ? 'Comments' : lang === 'ja' ? 'コメント' : '댓글'} ({localComments.length})
            </div>
            <div className="space-y-3">
              {localComments.map(c => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}>
                    {c.author.slice(0, 1)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-white">{c.author}</span>
                      <span className="text-[10px]" style={{ color: '#8899aa' }}>{c.authorRank}</span>
                      <span className="text-[10px] ml-auto" style={{ color: '#8899aa' }}>{timeSince(c.createdAt)}</span>
                    </div>
                    <p className="text-[11.5px] leading-relaxed" style={{ color: 'rgba(200,215,225,0.9)' }}>{c.content}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ThumbsUp size={9} style={{ color: '#8899aa' }} />
                      <span className="text-[10px]" style={{ color: '#8899aa' }}>{c.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment input */}
            <div className="mt-4 flex gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff' }}>
                A
              </div>
              <div className="flex-1 flex gap-2">
                <input value={commentText} onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleComment(); } }}
                  placeholder={lang === 'en' ? 'Leave a comment...' : lang === 'ja' ? 'コメントを入力...' : '의견을 남겨주세요...'}
                  className="flex-1 px-3 py-2 rounded-lg text-[12px] outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', color: '#fff' }} />
                <button onClick={handleComment}
                  className="px-3 py-2 rounded-lg flex items-center gap-1.5 text-[11px] font-bold transition-all"
                  style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.35)', color: '#00d4ff' }}>
                  <Send size={11} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Write Post Modal ──────────────────────────────────────────────────────────
function WritePostModal({ onClose, onSubmit }: {
  onClose: () => void;
  onSubmit: (p: CommunityPost) => void;
}) {
  const { lang } = useLang();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('전략분석');
  const [tags, setTags] = useState('');
  const [cls, setCls] = useState<'UNCLASSIFIED' | 'CONFIDENTIAL' | 'SECRET'>('UNCLASSIFIED');

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    const newPost: CommunityPost = {
      id: `CP-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      author: 'ADMIN',
      authorRank: lang === 'en' ? 'Administrator' : lang === 'ja' ? '管理者' : '관리자',
      clearanceLevel: cls,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      likes: 0,
      commentsCount: 0,
      views: 1,
      createdAt: '2026-06-19',
      hot: false,
    };
    onSubmit(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="w-full max-w-xl rounded-2xl overflow-hidden"
        style={{ background: 'rgba(10,18,26,0.99)', border: '1px solid rgba(0,212,255,0.3)', boxShadow: '0 0 40px rgba(0,212,255,0.1)' }}
        onClick={e => e.stopPropagation()}>

        <div className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'rgba(0,212,255,0.15)', background: 'rgba(0,212,255,0.05)' }}>
          <span className="text-[13px] font-bold tracking-widest" style={{ color: '#00d4ff' }}>
            {lang === 'en' ? '// NEW POST //' : lang === 'ja' ? '// 新規投稿 //' : '// 글쓰기 //'}
          </span>
          <button onClick={onClose}><X size={16} style={{ color: '#8899aa' }} /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Category + Classification row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold mb-1.5 block tracking-widest" style={{ color: '#8899aa' }}>
                {lang === 'en' ? 'CATEGORY' : lang === 'ja' ? 'カテゴリー' : '카테고리'}
              </label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', color: '#fff' }}>
                {communityCategories.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id} style={{ background: '#0a121a' }}>
                    {lang === 'en' ? c.labelEn : lang === 'ja' ? c.labelJa : c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold mb-1.5 block tracking-widest" style={{ color: '#8899aa' }}>
                {lang === 'en' ? 'CLASSIFICATION' : lang === 'ja' ? '機密区分' : '보안 등급'}
              </label>
              <select value={cls} onChange={e => setCls(e.target.value as typeof cls)}
                className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', color: CLS_COLOR[cls] }}>
                <option value="UNCLASSIFIED" style={{ background: '#0a121a' }}>UNCLASSIFIED</option>
                <option value="CONFIDENTIAL" style={{ background: '#0a121a' }}>CONFIDENTIAL</option>
                <option value="SECRET" style={{ background: '#0a121a' }}>SECRET</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[10px] font-bold mb-1.5 block tracking-widest" style={{ color: '#8899aa' }}>
              {lang === 'en' ? 'TITLE' : lang === 'ja' ? 'タイトル' : '제목'}
            </label>
            <input value={title} onChange={e => setTitle(e.target.value)} maxLength={100}
              placeholder={lang === 'en' ? 'Enter title...' : lang === 'ja' ? 'タイトルを入力...' : '제목을 입력하세요...'}
              className="w-full px-3 py-2.5 rounded-lg text-[13px] font-semibold outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', color: '#fff' }} />
          </div>

          {/* Content */}
          <div>
            <label className="text-[10px] font-bold mb-1.5 block tracking-widest" style={{ color: '#8899aa' }}>
              {lang === 'en' ? 'CONTENT' : lang === 'ja' ? '内容' : '내용'}
            </label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={7}
              placeholder={lang === 'en' ? 'Enter content...' : lang === 'ja' ? '内容を入力...' : '내용을 입력하세요...'}
              className="w-full px-3 py-2.5 rounded-lg text-[12px] outline-none resize-none leading-relaxed"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', color: '#fff' }} />
          </div>

          {/* Tags */}
          <div>
            <label className="text-[10px] font-bold mb-1.5 block tracking-widest" style={{ color: '#8899aa' }}>
              {lang === 'en' ? 'TAGS (comma separated)' : lang === 'ja' ? 'タグ（カンマ区切り）' : '태그 (쉼표로 구분)'}
            </label>
            <input value={tags} onChange={e => setTags(e.target.value)}
              placeholder={lang === 'en' ? 'F-35, stealth, USAF' : lang === 'ja' ? 'F-35, ステルス' : 'F-35, 스텔스, 미공군'}
              className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', color: '#fff' }} />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-[12px] font-bold transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#8899aa' }}>
              {lang === 'en' ? 'Cancel' : lang === 'ja' ? 'キャンセル' : '취소'}
            </button>
            <button onClick={handleSubmit} disabled={!title.trim() || !content.trim()}
              className="flex-1 py-2.5 rounded-xl text-[12px] font-bold transition-all disabled:opacity-40"
              style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff' }}>
              {lang === 'en' ? 'Submit' : lang === 'ja' ? '投稿する' : '등록하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Community Page ───────────────────────────────────────────────────────
export default function Community() {
  const { lang } = useLang();
  const [posts, setPosts] = useState<CommunityPost[]>(communityPosts);
  const [selectedCat, setSelectedCat] = useState('all');
  const [sortBy, setSortBy] = useState<'hot' | 'latest'>('latest');
  const [search, setSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [showWrite, setShowWrite] = useState(false);

  const filteredPosts = useMemo(() => {
    let list = posts.filter(p => {
      const matchCat = selectedCat === 'all' || p.category === selectedCat;
      const q = search.toLowerCase();
      const matchSearch = !q || p.title.toLowerCase().includes(q)
        || p.content.toLowerCase().includes(q)
        || p.tags.some(t => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });

    const pinned = list.filter(p => p.pinned);
    const rest = list.filter(p => !p.pinned);

    if (sortBy === 'hot') rest.sort((a, b) => b.likes - a.likes);
    else rest.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return [...pinned, ...rest];
  }, [posts, selectedCat, sortBy, search]);

  const postComments = (postId: string) =>
    communityComments.filter(c => c.postId === postId);

  const totalViews = posts.reduce((s, p) => s + p.views, 0);
  const totalLikes = posts.reduce((s, p) => s + p.likes, 0);

  return (
    <div className="flex h-full" style={{ background: '#070b0f' }}>

      {/* ── Left Sidebar ───────────────────────────────────────────────────── */}
      <div className="w-56 flex-shrink-0 flex flex-col h-full border-r overflow-y-auto"
        style={{ borderColor: 'rgba(0,212,255,0.1)', background: 'rgba(7,11,15,0.98)' }}>

        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={14} className="text-[#00d4ff]" />
            <span className="text-[11px] font-bold tracking-widest text-[#00d4ff] uppercase">
              {lang === 'en' ? 'COMMUNITY' : lang === 'ja' ? 'コミュニティ' : '커뮤니티'}
            </span>
          </div>
          <div className="text-[10px]" style={{ color: '#8899aa' }}>
            {posts.length} {lang === 'en' ? 'posts' : lang === 'ja' ? '投稿' : '개 게시물'}
          </div>
        </div>

        {/* Stats mini */}
        <div className="p-3 border-b" style={{ borderColor: 'rgba(0,212,255,0.08)' }}>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: lang === 'en' ? 'Views' : '총 조회', val: (totalViews / 1000).toFixed(0) + 'K', color: '#00d4ff' },
              { label: lang === 'en' ? 'Likes' : '총 좋아요', val: totalLikes.toLocaleString(), color: '#ff6680' },
            ].map(s => (
              <div key={s.label} className="rounded-lg p-2 text-center"
                style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.08)' }}>
                <div className="text-[13px] font-bold" style={{ color: s.color }}>{s.val}</div>
                <div className="text-[9px]" style={{ color: '#8899aa' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="p-3 border-b" style={{ borderColor: 'rgba(0,212,255,0.08)' }}>
          <div className="text-[10px] font-bold mb-2 tracking-widest" style={{ color: '#8899aa' }}>
            {lang === 'en' ? 'CATEGORIES' : lang === 'ja' ? 'カテゴリー' : '카테고리'}
          </div>
          {communityCategories.map(cat => {
            const count = cat.id === 'all' ? posts.length : posts.filter(p => p.category === cat.id).length;
            const isActive = selectedCat === cat.id;
            return (
              <button key={cat.id} onClick={() => setSelectedCat(cat.id)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg mb-0.5 transition-all text-left group"
                style={{
                  background: isActive ? `${cat.color}15` : 'transparent',
                  border: isActive ? `1px solid ${cat.color}30` : '1px solid transparent',
                }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                  <span className="text-[11px] font-semibold"
                    style={{ color: isActive ? cat.color : '#8899aa' }}>
                    {lang === 'en' ? cat.labelEn : lang === 'ja' ? cat.labelJa : cat.label}
                  </span>
                </div>
                <span className="text-[10px] font-mono" style={{ color: isActive ? cat.color : '#8899aa' }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Online Members */}
        <div className="p-3 border-b" style={{ borderColor: 'rgba(0,212,255,0.08)' }}>
          <div className="text-[10px] font-bold mb-2 tracking-widest flex items-center gap-1.5" style={{ color: '#8899aa' }}>
            <Users size={10} />
            {lang === 'en' ? 'ONLINE' : '온라인'} ({onlineMembers.filter(m => m.status === 'online').length})
          </div>
          {onlineMembers.map(m => (
            <div key={m.name} className="flex items-center gap-2 py-1">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: m.status === 'online' ? '#00ff88' : '#8899aa' }} />
              <span className="text-[10px] font-semibold" style={{ color: m.status === 'online' ? '#c0cdd8' : '#8899aa' }}>
                {m.name}
              </span>
            </div>
          ))}
        </div>

        {/* Trending Tags */}
        <div className="p-3">
          <div className="text-[10px] font-bold mb-2 tracking-widest flex items-center gap-1.5" style={{ color: '#8899aa' }}>
            <TrendingUp size={10} />
            {lang === 'en' ? 'TRENDING' : '트렌딩'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {trendingTags.slice(0, 10).map(tag => (
              <button key={tag} onClick={() => setSearch(tag)}
                className="px-2 py-0.5 rounded text-[10px] transition-all hover:text-[#00d4ff]"
                style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)', color: '#8899aa' }}>
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Feed ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="px-5 py-4 border-b flex-shrink-0" style={{ borderColor: 'rgba(0,212,255,0.1)', background: 'rgba(0,212,255,0.02)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div>
              <h1 className="text-[16px] font-bold text-white">
                {lang === 'en' ? 'Military Community' : lang === 'ja' ? 'ミリタリーコミュニティ' : '밀리터리 커뮤니티'}
              </h1>
              <p className="text-[11px]" style={{ color: '#8899aa' }}>
                {lang === 'en' ? 'Expert Analysis · Weapon Debates · Global Defense Intel'
                  : lang === 'ja' ? '専門軍事分析 · 武器討論 · 防衛情報'
                    : '전문 군사 분석 · 무기체계 토론 · 글로벌 방산 정보'}
              </p>
            </div>
            <button onClick={() => setShowWrite(true)}
              className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all"
              style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff' }}>
              <Plus size={14} />
              {lang === 'en' ? 'New Post' : lang === 'ja' ? '投稿する' : '글쓰기'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8899aa]" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={lang === 'en' ? 'Search posts...' : lang === 'ja' ? '投稿を検索...' : '게시물 검색...'}
                className="w-full pl-8 pr-3 py-2 rounded-lg text-[12px] outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,255,0.15)', color: '#fff' }} />
            </div>
            {/* Sort */}
            <div className="flex gap-1">
              {([['latest', lang === 'en' ? 'Latest' : '최신'], ['hot', lang === 'en' ? 'Hot' : '인기']] as const).map(([key, label]) => (
                <button key={key} onClick={() => setSortBy(key)}
                  className="px-3 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5"
                  style={{
                    background: sortBy === key ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)',
                    border: sortBy === key ? '1px solid rgba(0,212,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    color: sortBy === key ? '#00d4ff' : '#8899aa',
                  }}>
                  {key === 'hot' ? <Flame size={11} /> : null}
                  {label}
                </button>
              ))}
            </div>
            <div className="text-[11px] ml-auto" style={{ color: '#8899aa' }}>
              {filteredPosts.length} {lang === 'en' ? 'posts' : '개'}
            </div>
          </div>
        </div>

        {/* Post List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <Shield size={32} style={{ color: 'rgba(0,212,255,0.2)' }} />
              <p className="text-[13px]" style={{ color: '#8899aa' }}>
                {lang === 'en' ? 'No posts found.' : lang === 'ja' ? '投稿が見つかりません。' : '게시물을 찾을 수 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-w-3xl">
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} onClick={() => setSelectedPost(post)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Hot Posts Right Panel ──────────────────────────────────────────── */}
      <div className="w-52 flex-shrink-0 border-l overflow-y-auto hidden xl:flex flex-col"
        style={{ borderColor: 'rgba(0,212,255,0.1)', background: 'rgba(7,11,15,0.98)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'rgba(0,212,255,0.08)' }}>
          <div className="flex items-center gap-2">
            <Flame size={13} style={{ color: '#ff4444' }} />
            <span className="text-[11px] font-bold tracking-widest" style={{ color: '#ff4444' }}>
              {lang === 'en' ? 'HOT POSTS' : '인기 게시물'}
            </span>
          </div>
        </div>
        <div className="p-3 space-y-2">
          {posts.filter(p => p.hot).slice(0, 8).map((p, i) => (
            <button key={p.id} onClick={() => setSelectedPost(p)}
              className="w-full text-left p-2.5 rounded-lg transition-all hover:bg-white/5 group"
              style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-start gap-2">
                <span className="text-[11px] font-mono font-bold flex-shrink-0 mt-0.5"
                  style={{ color: i < 3 ? '#ff4444' : '#8899aa' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-[11px] font-semibold group-hover:text-[#00d4ff] transition-colors line-clamp-2" style={{ color: '#c0cdd8' }}>
                    {p.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-0.5 text-[10px]" style={{ color: '#ff6680' }}>
                      <ThumbsUp size={8} /> {p.likes}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px]" style={{ color: '#8899aa' }}>
                      <Eye size={8} /> {p.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Tag cloud right panel */}
        <div className="p-3 border-t mt-auto" style={{ borderColor: 'rgba(0,212,255,0.08)' }}>
          <div className="text-[10px] font-bold mb-2 tracking-widest flex items-center gap-1" style={{ color: '#8899aa' }}>
            <Tag size={10} /> {lang === 'en' ? 'ALL TAGS' : '태그'}
          </div>
          <div className="flex flex-wrap gap-1">
            {trendingTags.map(tag => (
              <button key={tag} onClick={() => { setSearch(tag); }}
                className="px-1.5 py-0.5 rounded text-[9px] transition-all hover:text-[#00d4ff]"
                style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)', color: '#8899aa' }}>
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          comments={postComments(selectedPost.id)}
          onClose={() => setSelectedPost(null)}
        />
      )}
      {showWrite && (
        <WritePostModal
          onClose={() => setShowWrite(false)}
          onSubmit={p => setPosts(prev => [p, ...prev])}
        />
      )}
    </div>
  );
}
