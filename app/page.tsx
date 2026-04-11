"use client";

import { useState, useEffect } from "react";
import { Search, User, Home, CircleDollarSign, Grid, X, Lock, Share2, ExternalLink, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: { ko: '전체', en: 'See All' }, icon: <Grid size={18}/> },
  { id: 'mainnet', label: { ko: '메인넷', en: 'Mainnet' }, icon: '🌐' },
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
  { id: 'music', label: { ko: '음악', en: 'Music' }, icon: '🎵' },
  { id: 'sports', label: { ko: '스포츠', en: 'Sports' }, icon: '🏆' },
  { id: 'defi', label: { ko: '디파이', en: 'DeFi' }, icon: '🏦' },
  { id: 'dapp', label: { ko: '디앱', en: 'dApp' }, icon: '📱' },
  { id: 'nft', label: { ko: 'NFT', en: 'NFT' }, icon: '🖼️' },
];

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{username: string} | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    fetchNews();
    const savedUser = localStorage.getItem('gpnr_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, [activeCategory]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?category=${activeCategory}&lang=ko`);
      const data = await res.json();
      setNews(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // AI 요약 기능 (시뮬레이션 - 향후 실제 LLM API 연결 가능)
  const handleAISummary = async () => {
    setSummarizing(true);
    setSummary("");
    // 실제로는 여기서 OpenAI나 Gemini API를 호출합니다.
    setTimeout(() => {
      const mockSummary = `[GPNR AI 요약]\n1. 해당 기사는 Pi Network의 최신 ${selectedNews.category} 동향을 다루고 있습니다.\n2. 주요 골자는 글로벌 유저 참여도 증가와 기술적 마이그레이션의 진척입니다.\n3. 전문가들은 이번 업데이트가 생태계 확장에 긍정적인 영향을 줄 것으로 분석합니다.`;
      setSummary(mockSummary);
      setSummarizing(false);
    }, 1500);
  };

  const handleAuth = () => {
    if (typeof window !== "undefined" && (window as any).Pi) {
      (window as any).Pi.authenticate(['username'], (inc: any) => {}).then((auth: any) => {
        setUser(auth.user);
        localStorage.setItem('gpnr_user', JSON.stringify(auth.user));
      });
    } else {
      setUser({ username: "Guest_Pioneer" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      {/* 헤더 */}
      <header className="bg-[#0D1B3E] text-white px-4 py-3 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">G</div>
          <span className="text-xl font-black italic">GPNR</span>
        </div>
        <button onClick={handleAuth} className="bg-indigo-600 px-4 py-1.5 rounded-full text-[11px] font-bold">
          {user ? user.username : "로그인"}
        </button>
      </header>

      {/* 카테고리 */}
      <nav className="bg-white border-b sticky top-[52px] z-50 overflow-x-auto no-scrollbar py-3">
        <div className="flex gap-4 px-4">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex flex-col items-center min-w-[56px] ${activeCategory === cat.id ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${activeCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>{cat.icon}</div>
              <span className="text-[10px] font-bold mt-1">{cat.label.ko}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* 리스트 */}
      <main className="divide-y divide-gray-100">
        {loading ? <div className="p-20 text-center text-gray-400 font-bold">뉴스를 불러오는 중...</div> :
          news.map((item) => (
            <article key={item.id} className="flex items-center gap-4 p-4 active:bg-gray-50" onClick={() => { setSelectedNews(item); setSummary(""); }}>
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 mb-1 items-center">
                  <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">{item.category}</span>
                  <span className="text-[9px] text-gray-400">{item.date}</span>
                </div>
                <h3 className="font-bold text-[15px] leading-snug line-clamp-2">{item.title}</h3>
              </div>
              <img src={item.image} className="w-20 h-20 object-cover rounded-xl border" alt="thumb" />
            </article>
          ))
        }
      </main>

      {/* 상세 모달 (원문 이동 & AI 요약) */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-end justify-center">
          <div className="bg-white w-full max-w-2xl h-[92vh] rounded-t-[2.5rem] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{selectedNews.category}</span>
              <button onClick={() => setSelectedNews(null)} className="p-2 bg-gray-100 rounded-full"><X/></button>
            </div>
            
            <img src={selectedNews.image} className="w-full h-52 object-cover rounded-3xl mb-6" />
            <h2 className="text-xl font-black mb-4">{selectedNews.title}</h2>

            {/* AI 요약 섹션 */}
            <div className="mb-6">
              <button 
                onClick={handleAISummary}
                disabled={summarizing}
                className="w-full bg-indigo-50 text-indigo-600 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 border border-indigo-100 hover:bg-indigo-100 transition-all"
              >
                <Sparkles size={18} className={summarizing ? "animate-spin" : ""} />
                {summarizing ? "AI가 기사를 읽고 있습니다..." : "AI 한국어 요약하기"}
              </button>
              
              {summary && (
                <div className="mt-4 bg-gray-50 p-5 rounded-2xl border-l-4 border-indigo-500 animate-in fade-in duration-500">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">{summary}</p>
                </div>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-sm">{selectedNews.content}</p>

            {/* 하단 액션 버튼 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <a 
                href={selectedNews.url} 
                target="_blank" 
                className="bg-gray-100 text-gray-900 py-4 rounded-2xl font-black flex items-center justify-center gap-2 text-sm"
              >
                <ExternalLink size={18}/> 원문 읽기
              </a>
              <button className="bg-[#0D1B3E] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 text-sm">
                <Share2 size={18}/> 공유하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-around items-center z-[55]">
        <button className="flex flex-col items-center text-indigo-600"><Home size={22}/><span className="text-[10px] font-bold mt-1">홈</span></button>
        <button className="flex flex-col items-center text-gray-300"><Search size={22}/><span className="text-[10px] font-bold mt-1">검색</span></button>
        <button className="flex flex-col items-center text-gray-300"><User size={22}/><span className="text-[10px] font-bold mt-1">프로필</span></button>
        <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow-md">
          <CircleDollarSign size={18} /><span className="text-xs font-bold">후원</span>
        </button>
      </footer>
    </div>
  );
}
