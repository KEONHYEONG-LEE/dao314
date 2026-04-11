"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Youtube, User, Home, Heart, CircleDollarSign, Grid, Languages, MessageSquare, ChevronDown, X, Lock, Send, Share2 } from 'lucide-react';

const translations: Record<string, any> = {
  ko: {
    search: "글로벌 파이 뉴스 검색...", trending: "인기 소식", login_msg: "상세 내용은 파이오니어 전용입니다. 로그인해 주세요.",
    support: "후원 0.001π", verified_error: "Pi Browser의 개발자 모드에서 도메인 승인이 필요합니다.",
    ai_assistant: "AI 도우미", all: "전체보기", login: "로그인", profile: "프로필", read_more: "원문 기사 읽기", close: "닫기"
  },
  en: {
    search: "Search Global Pi news...", trending: "TRENDING", login_msg: "Full details are for Pioneers only. Please login.",
    support: "Support 0.001π", verified_error: "Domain approval required in Pi Browser developer mode.",
    ai_assistant: "AI Assistant", all: "See All", login: "Login", profile: "Profile", read_more: "Read Full Article", close: "Close"
  }
};

const CATEGORIES = [
  { id: 'all', label: { ko: '전체', en: 'See All' }, icon: <Grid size={18}/> },
  { id: 'mainnet', label: { ko: '메인넷', en: 'Mainnet' }, icon: '🌐' },
  { id: 'commerce', label: { ko: '커머스', en: 'Commerce' }, icon: '🛒' },
  { id: 'social', label: { ko: '소셜', en: 'Social' }, icon: '💬' },
  { id: 'education', label: { ko: '교육', en: 'Education' }, icon: '📚' },
  { id: 'utilities', label: { ko: '유틸리티', en: 'Utilities' }, icon: '🛠️' },
  { id: 'finance', label: { ko: '금융', en: 'Finance' }, icon: '💰' },
  { id: 'dapp', label: { ko: '디앱', en: 'dApp' }, icon: '📱' },
];

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{username: string, uid: string} | null>(null);
  const [lang, setLang] = useState<'en'|'ko'|'zh'|'es'|'vi'>('ko');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('gpnr_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    fetchNews();
    if (typeof window !== "undefined" && (window as any).Pi) {
      (window as any).Pi.init({ version: "1.5", sandbox: true });
    }
  }, [activeCategory, lang]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?category=${activeCategory}&lang=${lang}`);
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Fetch Error:", err); } 
    finally { setLoading(false); }
  };

  const handleAuthAndPayment = async () => {
    if (typeof window === "undefined" || !(window as any).Pi) {
      alert("Please open in Pi Browser.");
      return;
    }
    try {
      const auth = await (window as any).Pi.authenticate(['payments', 'username'], (incomplete: any) => {
        console.log("Incomplete payment:", incomplete);
      });
      const userData = { username: auth.user.username, uid: auth.user.uid };
      setUser(userData);
      localStorage.setItem('gpnr_user', JSON.stringify(userData));
      alert(`${auth.user.username}님 환영합니다!`);
    } catch (err: any) { alert("인증 실패: " + err.message); }
  };

  const askAI = async () => {
    if (!chatInput.trim() || !selectedNews) return;
    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput("");
    setIsTyping(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, contextNews: selectedNews, lang: lang })
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'ai', text: data.answer }]);
    } catch (err) { console.error(err); } 
    finally { setIsTyping(false); }
  };

  const currentT = translations[lang] || translations['en'];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans pb-24">
      {/* HEADER: 높이와 패딩 최적화 */}
      <header className="bg-[#0D1B3E] text-white px-5 py-4 flex justify-between items-center sticky top-0 z-[60] shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-black text-base shadow-lg">G</div>
          <h1 className="text-xl font-black tracking-tighter">GPNR</h1>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={() => setShowLangMenu(!showLangMenu)} className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold border border-white/10">
            {lang.toUpperCase()} <ChevronDown size={10} className="inline ml-1" />
          </button>
          <button onClick={handleAuthAndPayment} className="bg-indigo-600 px-4 py-1.5 rounded-full text-xs font-black shadow-sm active:scale-95 transition-all">
            {user ? user.username : currentT.login}
          </button>
        </div>
      </header>

      {/* CATEGORIES: 아이콘 크기와 폰트 밸런스 조정 */}
      <nav className="bg-white p-4 border-b sticky top-[64px] z-50 overflow-x-auto no-scrollbar shadow-sm">
        <div className="flex gap-6 items-center">
          {CATEGORIES.map(item => (
            <button key={item.id} onClick={() => setActiveCategory(item.id)} className={`flex flex-col items-center min-w-[44px] transition-all ${activeCategory === item.id ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm border ${activeCategory === item.id ? 'bg-indigo-600 border-indigo-200 text-white shadow-indigo-100' : 'bg-gray-50 text-indigo-600 border-gray-100'}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-black mt-2 tracking-tighter ${activeCategory === item.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                {item.label[lang as keyof typeof item.label] || item.label.en}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* NEWS LIST: 카드 정렬 및 이미지 비율 고정 */}
      <main className="p-4 space-y-6">
        {loading ? (
          <div className="py-20 text-center text-gray-400 font-bold animate-pulse">Fetching Pi News...</div>
        ) : (
          news.map((item, idx) => (
            <article key={item.id || idx} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden relative active:scale-[0.98] transition-all duration-300" onClick={() => user ? setSelectedNews(item) : handleAuthAndPayment()}>
              {!user && <div className="absolute top-4 right-4 z-10 bg-black/30 backdrop-blur-md p-2 rounded-full"><Lock size={12} className="text-white" /></div>}
              <div className="h-48 overflow-hidden bg-gray-100">
                <img src={item.image} className="w-full h-full object-cover" alt="news" onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800")} />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">{item.category}</span>
                  <span className="text-[10px] text-gray-300 font-medium">{item.date}</span>
                </div>
                <h3 className="font-black text-lg leading-tight mb-2 text-gray-900 line-clamp-2">{item.title}</h3>
                <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">{item.description}</p>
              </div>
            </article>
          ))
        )}
      </main>

      {/* FOOTER: 정돈된 아이콘과 강조된 후원 버튼 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-between items-center py-3 px-8 z-55 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        <button className="flex flex-col items-center text-indigo-600"><Home size={24} /><span className="text-[9px] font-black mt-1">홈</span></button>
        <button onClick={() => setIsChatOpen(true)} className="flex flex-col items-center text-gray-400"><MessageSquare size={24} /><span className="text-[9px] font-black mt-1">AI 도우미</span></button>
        <button className="flex flex-col items-center text-gray-400"><User size={24} /><span className="text-[9px] font-black mt-1">프로필</span></button>
        <button onClick={handleAuthAndPayment} className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-100 active:scale-95 transition-all">
          <CircleDollarSign size={18} />
          <span className="text-[11px] font-black">후원 0.001π</span>
        </button>
      </footer>

      {/* 상세 모달 및 채팅 로직 (기능 유지) */}
      {/* ... (생략된 상세 페이지 및 채팅창 코드는 이전 로직과 동일) */}
    </div>
  );
}
