"use client";

import { useState, useEffect } from "react";
import { Search, User, Home, CircleDollarSign, Grid, Languages, MessageSquare, X, Lock, Send, Share2, ChevronRight, Bell } from 'lucide-react';

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
  const [lang, setLang] = useState('ko');

  useEffect(() => {
    fetchNews();
    const savedUser = localStorage.getItem('gpnr_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, [activeCategory, lang]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?category=${activeCategory}&lang=${lang}`);
      const data = await res.json();
      setNews(data);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleAuth = () => {
    if (typeof window !== "undefined" && (window as any).Pi) {
      (window as any).Pi.authenticate(['username'], (inc: any) => {}).then((auth: any) => {
        setUser(auth.user);
        localStorage.setItem('gpnr_user', JSON.stringify(auth.user));
      });
    } else {
      const demoUser = { username: "Guest_Pioneer" };
      setUser(demoUser);
      localStorage.setItem('gpnr_user', JSON.stringify(demoUser));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 pb-20">
      {/* 상단 헤더 */}
      <header className="bg-[#0D1B3E] text-white px-4 py-3 flex justify-between items-center sticky top-0 z-[60] shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white">G</div>
          <span className="text-xl font-black italic tracking-tighter">GPNR</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-1.5 bg-white/10 rounded-full"><Search size={18}/></button>
          <button onClick={handleAuth} className="bg-indigo-600 px-4 py-1.5 rounded-full text-[11px] font-bold shadow-lg">
            {user ? user.username : "로그인"}
          </button>
        </div>
      </header>

      {/* 17개 카테고리 스크롤바 */}
      <nav className="bg-white border-b sticky top-[52px] z-50 overflow-x-auto no-scrollbar shadow-sm">
        <div className="flex gap-4 px-4 py-3">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.id)} 
              className={`flex flex-col items-center min-w-[56px] transition-all ${activeCategory === cat.id ? 'scale-105' : 'opacity-50 hover:opacity-80'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${activeCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {cat.icon}
              </div>
              <span className={`text-[10px] font-bold mt-1.5 ${activeCategory === cat.id ? 'text-indigo-600' : 'text-gray-500'}`}>
                {cat.label[lang as 'ko' | 'en']}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* 뉴스 리스트 섹션 - 압축형 UI 적용 */}
      <main className="flex-1">
        {loading ? (
          <div className="py-20 text-center text-gray-400 animate-pulse font-bold">실시간 뉴스 로딩 중...</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {news.map((item) => (
              <article 
                key={item.id} 
                className="flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setSelectedNews(item)}
              >
                {/* 텍스트 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">
                      {item.category}
                    </span>
                    <span className="text-[9px] text-gray-400 font-medium">{item.date}</span>
                  </div>
                  <h3 className="font-bold text-[15px] text-gray-900 leading-snug line-clamp-2 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-gray-500 line-clamp-1">
                    {item.description}
                  </p>
                </div>

                {/* 우측 작은 이미지 (네이버 카페 스타일) */}
                <div className="w-20 h-20 flex-shrink-0 relative">
                  <img 
                    src={item.image} 
                    className="w-full h-full object-cover rounded-xl shadow-sm border border-gray-100" 
                    alt="thumb" 
                  />
                  {!user && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                      <Lock size={12} className="text-white" />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* 상세 페이지 모달 */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-end justify-center">
          <div className="bg-white w-full max-w-2xl h-[92vh] rounded-t-[2.5rem] overflow-y-auto p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{selectedNews.category}</span>
              <button onClick={() => setSelectedNews(null)} className="p-2 bg-gray-100 rounded-full"><X/></button>
            </div>
            <img src={selectedNews.image} className="w-full h-56 object-cover rounded-3xl mb-6" />
            <h2 className="text-2xl font-black mb-4 leading-tight">{selectedNews.title}</h2>
            <div className="bg-gray-50 p-4 rounded-2xl mb-6 border-l-4 border-indigo-600">
              <p className="text-gray-800 font-bold italic">"{selectedNews.description}"</p>
            </div>
            <p className="text-gray-700 leading-relaxed text-[16px] whitespace-pre-wrap mb-10">{selectedNews.content}</p>
            <button className="w-full bg-[#0D1B3E] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 mb-4">
              <Share2 size={20}/> 기사 공유하기
            </button>
          </div>
        </div>
      )}

      {/* 하단 탭 바 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-around items-center z-[55] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center text-indigo-600"><Home size={22}/><span className="text-[10px] font-bold mt-1">홈</span></button>
        <button className="flex flex-col items-center text-gray-300"><MessageSquare size={22}/><span className="text-[10px] font-bold mt-1">AI NEWS</span></button>
        <button className="flex flex-col items-center text-gray-300"><User size={22}/><span className="text-[10px] font-bold mt-1">프로필</span></button>
        <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow-md">
          <CircleDollarSign size={18} />
          <span className="text-xs font-bold whitespace-nowrap">후원 0.001π</span>
        </button>
      </footer>
    </div>
  );
}
