"use client";

import { useState, useEffect } from "react";
import { Search, User, Home, CircleDollarSign, Grid, Languages, MessageSquare, X, Lock, Send, Share2, ChevronRight } from 'lucide-react';

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
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAuth = () => {
    // Pi 브라우저가 아닐 경우의 테스트용 로직 포함
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
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 pb-24 font-sans">
      {/* HEADER */}
      <header className="bg-[#0D1B3E] text-white p-4 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">G</div>
          <span className="text-xl font-black italic">GPNR</span>
        </div>
        <button onClick={handleAuth} className="bg-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold">
          {user ? user.username : "로그인"}
        </button>
      </header>

      {/* 17개 카테고리 네비게이션 */}
      <nav className="bg-white border-b sticky top-[60px] z-50 overflow-x-auto no-scrollbar p-4">
        <div className="flex gap-6 items-center">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex flex-col items-center min-w-[50px] transition-all ${activeCategory === cat.id ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-gray-50 text-indigo-600'}`}>
                {cat.icon}
              </div>
              <span className={`text-[10px] font-black mt-2 ${activeCategory === cat.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                {cat.label[lang as 'ko' | 'en']}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* 뉴스 리스트 */}
      <main className="p-4 space-y-6">
        {loading ? (
          <div className="py-20 text-center font-bold text-gray-400">데이터를 가져오는 중...</div>
        ) : (
          news.map((item) => (
            <article key={item.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-all" onClick={() => setSelectedNews(item)}>
              <div className="h-48 relative">
                <img src={item.image} className="w-full h-full object-cover" alt="news" />
                <div className="absolute top-4 right-4 bg-black/30 p-2 rounded-full"><Lock size={12} className="text-white"/></div>
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-2 items-center">
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">{item.category}</span>
                  <span className="text-[10px] text-gray-300 font-medium">{item.date}</span>
                </div>
                <h3 className="font-black text-xl mb-2 leading-tight">{item.title}</h3>
                <p className="text-gray-500 text-xs line-clamp-2">{item.description}</p>
              </div>
            </article>
          ))
        )}
      </main>

      {/* 상세 페이지 모달 (이게 있어야 뉴스를 읽을 수 있습니다!) */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-end justify-center">
          <div className="bg-white w-full max-w-2xl h-[90vh] rounded-t-[3rem] overflow-y-auto p-8 animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{selectedNews.category}</span>
              <button onClick={() => setSelectedNews(null)} className="p-2 bg-gray-100 rounded-full"><X/></button>
            </div>
            <img src={selectedNews.image} className="w-full h-64 object-cover rounded-3xl mb-6 shadow-xl" />
            <h2 className="text-2xl font-black mb-4 leading-tight">{selectedNews.title}</h2>
            <div className="bg-indigo-50 p-4 rounded-2xl mb-6">
              <p className="text-indigo-900 font-bold italic">"{selectedNews.description}"</p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-10 text-lg">{selectedNews.content}</p>
            <button className="w-full bg-[#0D1B3E] text-white py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-2">
              <Share2 size={20}/> 기사 공유하기
            </button>
          </div>
        </div>
      )}

      {/* 하단 푸터 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-around items-center z-[55]">
        <button className="flex flex-col items-center text-indigo-600"><Home size={24}/><span className="text-[10px] font-black mt-1">홈</span></button>
        <button className="flex flex-col items-center text-gray-300"><MessageSquare size={24}/><span className="text-[10px] font-black mt-1">AI 도우미</span></button>
        <button className="flex flex-col items-center text-gray-300"><User size={24}/><span className="text-[10px] font-black mt-1">프로필</span></button>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg">
          <CircleDollarSign size={18} />
          <span className="text-xs font-black">후원 0.001π</span>
        </button>
      </footer>
    </div>
  );
}
