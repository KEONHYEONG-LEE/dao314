"use client";

import { useState, useEffect } from "react";
import { Grid, X, Share2, ExternalLink, Sparkles, ChevronDown, Users, Eye, Calendar, Quote, Loader2 } from 'lucide-react'; 
import { Header } from '@/components/Header'; // 기존 헤더 유지 시 사용

const CATEGORIES = [
  { id: 'all', label: { ko: '전체', en: 'All' }, icon: <Grid size={18}/> },
  { id: 'mainnet', label: { ko: '메인넷', en: 'Mainnet' }, icon: '🌐' },
  { id: 'community', label: { ko: '커뮤니티', en: 'Community' }, icon: <Users size={18}/> }, 
  { id: 'commerce', label: { ko: '커머스', en: 'Commerce' }, icon: '🛒' },
  { id: 'social', label: { ko: '소셜', en: 'Social' }, icon: '💬' },
  { id: 'education', label: { ko: '교육', en: 'Education' }, icon: '📚' },
  { id: 'health', label: { ko: '건강', en: 'Health' }, icon: '🏥' },
  { id: 'travel', label: { ko: '여행', en: 'Travel' }, icon: '✈️' },
  { id: 'utilities', label: { ko: '유틸리티', en: 'Utilities' }, icon: '🛠️' },
  { id: 'career', label: { ko: '커리어', en: 'Career' }, icon: '💼' },
  { id: 'entertainment', label: { ko: '엔터', en: 'Entertain' }, icon: '🎬' },
  { id: 'games', label: { ko: '게임', en: 'Games' }, icon: '🎮' },
  { id: 'finance', label: { ko: '금융', en: 'Finance' }, icon: '💰' },
];

const LANGUAGES = [
  { code: 'ko', label: '한국어' }, { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' }, { code: 'ja', label: '日本語' }, { code: 'vi', label: 'Tiếng Việt' }
];

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lang, setLang] = useState('ko');
  const [langMenu, setLangMenu] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [aiSummary, setAiSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => { fetchNews(); }, [activeCategory, lang]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // API 경로를 /api/news에서 실제 파일 위치로 맞춤
      const res = await fetch(`/api/news?category=${activeCategory}&lang=${lang}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setNews(data);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setNews([]);
    }
    setLoading(false);
  };

  const handleGetSummary = async (content: string) => {
    if (!content || isSummarizing) return;
    setIsSummarizing(true);
    setAiSummary("");
    try {
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, lang })
      });
      const data = await res.json();
      setAiSummary(data.summary || "요약을 생성할 수 없습니다.");
    } catch (error) {
      setAiSummary("AI 서비스 연결에 실패했습니다.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20 font-sans">
      {/* 상단 헤더 */}
      <header className="bg-[#0D1B3E] text-white px-4 py-3 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white">G</div>
          <span className="text-xl font-black italic tracking-tighter">GPNR</span>
        </div>
        
        <div className="flex items-center gap-2 relative">
          <button onClick={() => setLangMenu(!langMenu)} className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold">
            {LANGUAGES.find(l => l.code === lang)?.label} <ChevronDown size={14}/>
          </button>
          {langMenu && (
            <div className="absolute top-10 right-0 bg-white text-gray-900 rounded-xl shadow-2xl border p-2 w-32">
              {LANGUAGES.map(l => (
                <button key={l.code} onClick={() => { setLang(l.code); setLangMenu(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${lang === l.code ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'}`}>
                  {l.label}
                </button>
              ))}
            </div>
          )}
          <div className="bg-indigo-600 px-4 py-1.5 rounded-full text-[11px] font-bold">Guest_Pioneer</div>
        </div>
      </header>

      {/* 카테고리 네비게이션 */}
      <nav className="bg-white border-b sticky top-[52px] z-50 overflow-x-auto no-scrollbar py-3 shadow-sm">
        <div className="flex gap-4 px-4">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} 
              className={`flex flex-col items-center min-w-[56px] transition-all ${activeCategory === cat.id ? 'opacity-100 scale-105' : 'opacity-40'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-100'}`}>
                {cat.icon}
              </div>
              <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{cat.id}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* 기사 리스트 */}
      <main className="divide-y divide-gray-100 px-2">
        {loading ? (
          <div className="p-20 text-center text-gray-400 font-bold animate-pulse">
            <Loader2 className="animate-spin mx-auto mb-2" />
            데이터 동기화 중...
          </div>
        ) : news.length > 0 ? (
          news.map((item) => (
            <article key={item.id} className="flex items-center gap-4 p-4 active:bg-gray-50 cursor-pointer" onClick={() => { setSelectedNews(item); setAiSummary(""); }}>
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 mb-1.5 items-center flex-wrap">
                  <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">{item.category}</span>
                  <span className="text-[9px] text-gray-400 flex items-center gap-1"><Calendar size={10}/>{item.date}</span>
                </div>
                <h3 className="font-bold text-[15px] leading-snug line-clamp-2 text-gray-900">{item.title}</h3>
                <p className="text-[10px] text-indigo-400 mt-1.5 font-bold">Source: {item.source}</p>
              </div>
              <img src={item.image} className="w-20 h-20 object-cover rounded-xl border border-gray-100 shadow-sm" alt="thumb" />
            </article>
          ))
        ) : (
          <div className="p-20 text-center text-gray-400">뉴스가 없습니다.</div>
        )}
      </main>

      {/* 상세 모달 (생략된 스타일 유지) */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-white w-full max-w-2xl h-[92vh] rounded-t-[2.5rem] overflow-y-auto p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full uppercase">{selectedNews.category}</span>
              <button onClick={() => setSelectedNews(null)} className="p-2 bg-gray-100 rounded-full"><X/></button>
            </div>
            <img src={selectedNews.image} className="w-full h-56 object-cover rounded-[2rem] mb-6 shadow-xl" alt="cover" />
            <h2 className="text-xl font-black mb-6 leading-tight text-gray-900">{selectedNews.title}</h2> 
            <div className="text-gray-700 leading-relaxed mb-10 text-[16px] whitespace-pre-wrap border-l-4 border-indigo-100 pl-4">
              {selectedNews.content}
            </div> 
            <div className="mb-10 bg-indigo-50 p-1 rounded-[2rem]">
              <button onClick={() => handleGetSummary(selectedNews.content)} disabled={isSummarizing}
                className="w-full bg-indigo-600 text-white py-4 rounded-[1.8rem] font-bold flex items-center justify-center gap-2">
                {isSummarizing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                요약하기
              </button>
              {aiSummary && <div className="p-5 text-sm text-indigo-900 bg-white/50 m-2 rounded-2xl border border-indigo-100">{aiSummary}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
