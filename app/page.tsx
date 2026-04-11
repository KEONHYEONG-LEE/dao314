"use client";

import { useState, useEffect } from "react";
// 필요한 아이콘들 모두 포함
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
  },
  // ... zh, es, vi는 기존 데이터 유지
};

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
  const [user, setUser] = useState<{username: string, uid: string} | null>(null);
  const [lang, setLang] = useState<'en'|'ko'|'zh'|'es'|'vi'>('ko');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  // AI 채팅 상태
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
      setNews(Array.isArray(data) ? data : []); // 데이터가 배열인지 확인
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
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-gray-900 font-sans pb-24">
      {/* HEADER */}
      <header className="bg-[#0D1B3E] text-white p-4 flex justify-between items-center sticky top-0 z-[60] shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center font-black text-lg shadow-inner">G</div>
          <h1 className="text-xl font-black tracking-tighter italic">GPNR</h1>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold border border-white/10 hover:bg-white/20 transition-all">
            <Languages size={14} /> {lang.toUpperCase()} <ChevronDown size={12} />
          </button>
          {showLangMenu && (
            <div className="absolute top-16 right-20 bg-white text-gray-800 rounded-2xl shadow-2xl py-2 z-[70] border border-gray-100 min-w-[100px] animate-in fade-in zoom-in-95">
              {['ko', 'en', 'zh', 'es', 'vi'].map(l => (
                <button key={l} onClick={() => {setLang(l as any); setShowLangMenu(false);}} className="block w-full text-left px-5 py-2 hover:bg-indigo-50 font-bold text-xs">{l.toUpperCase()}</button>
              ))}
            </div>
          )}
          <button onClick={handleAuthAndPayment} className="bg-indigo-500 hover:bg-indigo-600 px-4 py-1.5 rounded-full text-xs font-black shadow-md transition-all active:scale-95">
            {user ? user.username : currentT.login}
          </button>
        </div>
      </header>

      {/* CATEGORIES */}
      <nav className="bg-white/80 backdrop-blur-md p-4 border-b sticky top-[68px] z-50 overflow-hidden">
        <div className="flex overflow-x-auto gap-5 no-scrollbar pb-1">
          {CATEGORIES.map(item => (
            <button key={item.id} onClick={() => setActiveCategory(item.id)} className={`flex flex-col items-center min-w-[56px] transition-all ${activeCategory === item.id ? 'scale-110' : 'opacity-40 hover:opacity-70'}`}>
              <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-xl shadow-sm border-2 ${activeCategory === item.id ? 'bg-indigo-600 border-indigo-200 text-white shadow-indigo-200' : 'bg-white border-gray-50 text-indigo-600'}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-black mt-2 tracking-tighter ${activeCategory === item.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                {item.label[lang as keyof typeof item.label] || item.label.en}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* NEWS LIST */}
      <main className="p-5 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold animate-pulse text-sm uppercase tracking-widest">Fetching Pi News...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-bold">No News Found.</div>
        ) : (
          news.map((item, idx) => (
            <article key={item.id || idx} className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden relative group active:scale-[0.98] transition-all duration-300" onClick={() => user ? setSelectedNews(item) : confirm(currentT.login_msg) && handleAuthAndPayment()}>
              {!user && <div className="absolute top-4 right-4 z-10 bg-black/30 backdrop-blur-md p-2 rounded-full"><Lock size={14} className="text-white" /></div>}
              <div className="h-52 overflow-hidden bg-gray-100">
                <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="news" onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1611974717525-58a457242ce8?q=80&w=800")} />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter">{item.category}</span>
                  <span className="text-[10px] text-gray-300 font-medium">{item.date}</span>
                </div>
                <h3 className="font-black text-xl leading-tight mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{item.title}</h3>
                <p className="text-gray-500 text-xs line-clamp-2 font-medium leading-relaxed">{item.description}</p>
              </div>
            </article>
          ))
        )}
      </main>

      {/* 8번 강화 상세 페이지 모달 */}
      {selectedNews && user && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-end sm:items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-t-[3rem] sm:rounded-[3rem] relative no-scrollbar shadow-2xl animate-in slide-in-from-bottom-20 duration-500">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md p-6 flex justify-between items-center border-b z-10">
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">{selectedNews.category}</span>
              <button onClick={() => setSelectedNews(null)} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8">
              <img src={selectedNews.image} className="w-full h-80 object-cover rounded-[2.5rem] shadow-2xl mb-8" alt="detail" />
              <h2 className="text-3xl font-black mb-8 leading-[1.1] text-gray-900 tracking-tight">{selectedNews.title}</h2>
              <div className="bg-indigo-50 border-l-[6px] border-indigo-600 p-6 rounded-r-3xl mb-10 shadow-sm">
                <p className="text-xs font-black text-indigo-600 mb-2 uppercase tracking-widest">AI Quick Summary</p>
                <p className="text-lg text-indigo-900 font-bold leading-snug">{selectedNews.description}</p>
              </div>
              <div className="text-gray-700 leading-relaxed text-lg mb-12 space-y-6 font-medium">
                 {selectedNews.content || "상세 기사 분석이 진행 중입니다. 실시간 Pi Network 생태계 데이터를 확인하세요."}
              </div>
              <div className="flex flex-col gap-4 mb-10">
                <button onClick={() => { setIsChatOpen(true); setChatHistory([]); }} className="w-full bg-indigo-50 text-indigo-700 border-2 border-indigo-100 py-5 rounded-3xl font-black flex items-center justify-center gap-3 shadow-sm hover:bg-indigo-100 transition-all active:scale-95 text-lg">
                  <MessageSquare size={24} className="animate-bounce" /> {currentT.ai_assistant}와 심층 토론하기
                </button>
                <button onClick={() => window.open(selectedNews.url, '_blank')} className="w-full bg-[#0D1B3E] text-white py-5 rounded-3xl font-black shadow-xl hover:bg-black transition-all active:scale-95 text-lg flex items-center justify-center gap-2">
                  <Share2 size={20} /> {currentT.read_more}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI 채팅창 */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-end justify-center animate-in fade-in">
          <div className="bg-white w-full max-w-md h-[80vh] rounded-t-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
            <div className="bg-[#0D1B3E] p-6 text-white flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-inner font-black">🤖</div>
                <span className="font-black tracking-tight text-lg">GPNR AI Analyst</span>
              </div>
              <button onClick={() => setIsChatOpen(false)}><X size={28} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50/50">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                 Context: {selectedNews?.title.slice(0, 40)}...
              </div>
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-bold shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border-2 border-gray-50 text-gray-800 rounded-tl-none'}`}>{msg.text}</div>
                </div>
              ))}
              {isTyping && <div className="flex gap-1 ml-2"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div></div>}
            </div>
            <div className="p-6 bg-white border-t border-gray-100 flex gap-3 items-center">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && askAI()} className="flex-1 bg-gray-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100 transition-all" placeholder="뉴스에 대해 물어보세요..." />
              <button onClick={askAI} className="bg-indigo-600 text-white p-4 rounded-2xl shadow-indigo-200 shadow-lg hover:bg-indigo-700 transition-all active:scale-90"><Send size={22} /></button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 flex justify-around items-center py-4 px-2 z-[55] shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center text-indigo-600 group"><Home size={26} className="mb-1" /><span className="text-[10px] font-black uppercase tracking-tighter">Home</span></button>
        <button onClick={() => user ? setIsChatOpen(true) : handleAuthAndPayment()} className="flex flex-col items-center text-gray-300 hover:text-indigo-400 transition-colors"><MessageSquare size={26} className="mb-1" /><span className="text-[10px] font-black uppercase tracking-tighter">AI News</span></button>
        <button onClick={handleAuthAndPayment} className="flex flex-col items-center text-gray-300 hover:text-indigo-400 transition-colors"><User size={26} className="mb-1" /><span className="text-[10px] font-black uppercase tracking-tighter">Profile</span></button>
        <button onClick={handleAuthAndPayment} className="flex flex-col items-center bg-indigo-600 px-6 py-2.5 rounded-full shadow-lg shadow-indigo-100 active:scale-95 transition-all">
          <CircleDollarSign size={20} className="text-white mb-0.5" />
          <span className="text-[9px] font-black text-white leading-none tracking-tight">{currentT.support}</span>
        </button>
      </footer>
    </div>
  );
}
