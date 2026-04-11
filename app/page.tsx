"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Youtube, User, Home, Heart, CircleDollarSign, Grid, Languages, MessageSquare, ChevronDown, X, Lock, Send } from 'lucide-react';

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
  // zh, es, vi 등 나머지 언어 생략 (기존 데이터 유지)
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

// 이 함수가 'export default' 되어야 Vercel 에러가 나지 않습니다.
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
      setNews(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
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

      await (window as any).Pi.createPayment({
        amount: 0.001, memo: "Support GPNR", metadata: { type: "support_gpnr" },
      }, {
        onReadyForServerApproval: (id: string) => console.log(id),
        onReadyForServerCompletion: (id: string, txid: string) => alert("Success!"),
        onCancel: (id: string) => console.log(id),
        onError: (error: any) => {
          if (error.type === 'app_not_verified') alert(currentT.verified_error);
          else alert(error.message);
        },
      });
    } catch (err: any) { alert(err.message); }
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
    } catch (err) { console.error(err); } finally { setIsTyping(false); }
  };

  const currentT = translations[lang] || translations['en'];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-gray-900 font-sans">
      {/* --- HEADER --- */}
      <header className="bg-[#0D1B3E] text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-extrabold text-sm">G</div>
          <h1 className="text-lg font-bold tracking-tight">GPNR</h1>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md text-[10px] uppercase border border-white/20">
            <Languages size={14} /> {lang} <ChevronDown size={12} />
          </button>
          {showLangMenu && (
            <div className="absolute top-14 right-16 bg-white text-gray-800 rounded-lg shadow-xl py-1 z-[60] border text-xs">
              {['ko', 'en', 'zh', 'es', 'vi'].map(l => (
                <button key={l} onClick={() => {setLang(l as any); setShowLangMenu(false);}} className="block w-full text-left px-4 py-2 hover:bg-gray-100">{l.toUpperCase()}</button>
              ))}
            </div>
          )}
          <button onClick={handleAuthAndPayment} className="bg-indigo-600 px-3 py-1 rounded-md text-xs font-semibold">
            {user ? user.username : currentT.login}
          </button>
        </div>
      </header>

      {/* --- CATEGORIES --- */}
      <div className="bg-white p-4 border-b sticky top-[60px] z-40">
        <div className="flex overflow-x-auto gap-4 no-scrollbar">
          {CATEGORIES.map(item => (
            <div key={item.id} onClick={() => setActiveCategory(item.id)} className={`flex flex-col items-center min-w-[60px] cursor-pointer ${activeCategory === item.id ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${activeCategory === item.id ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold mt-1">{item.label[lang as keyof typeof item.label] || item.label.en}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- NEWS LIST --- */}
      <main className="p-4 space-y-5 pb-28">
        {loading ? <div className="text-center py-20 text-gray-400">Loading...</div> : (
          news.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border overflow-hidden relative" onClick={() => user ? setSelectedNews(item) : confirm(currentT.login_msg) && handleAuthAndPayment()}>
              {!user && <div className="absolute top-2 right-2 bg-black/20 p-1 rounded-full"><Lock size={12} className="text-white" /></div>}
              <img src={item.image} className="h-44 w-full object-cover" alt="news" />
              <div className="p-4">
                <h3 className="font-bold text-base line-clamp-2">{item.title}</h3>
                <p className="text-gray-500 text-[11px] mt-1 line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))
        )}
      </main>

      {/* --- 8번 강화 상세 페이지 모달 --- */}
      {selectedNews && user && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-t-[2.5rem] sm:rounded-3xl relative no-scrollbar">
            <div className="sticky top-0 bg-white/90 p-5 flex justify-between items-center border-b z-10">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{selectedNews.category}</span>
              <button onClick={() => setSelectedNews(null)}><X size={24} className="text-gray-400" /></button>
            </div>
            <div className="p-6">
              <img src={selectedNews.image} className="w-full h-72 object-cover rounded-[2rem] shadow-xl mb-6" alt="detail" />
              <h2 className="text-2xl font-black mb-6 leading-tight">{selectedNews.title}</h2>
              <div className="bg-indigo-50/50 border-l-4 border-indigo-500 p-5 rounded-r-2xl mb-8">
                <p className="text-xs font-bold text-indigo-600 mb-1 uppercase">AI Quick Summary</p>
                <p className="text-indigo-900 font-medium">{selectedNews.description}</p>
              </div>
              <p className="text-gray-700 leading-relaxed mb-10">{selectedNews.content || "상세 기사 분석 중..."}</p>
              
              <div className="flex flex-col gap-3">
                <button onClick={() => { setIsChatOpen(true); setChatHistory([]); }} className="w-full bg-white text-indigo-600 border-2 border-indigo-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-sm">
                  <MessageSquare size={20} /> {currentT.ai_assistant}와 심층 토론하기
                </button>
                <button onClick={() => window.open(selectedNews.url, '_blank')} className="w-full bg-[#0D1B3E] text-white py-4 rounded-2xl font-black shadow-lg">
                  {currentT.read_more}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- AI 채팅창 --- */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex items-end justify-center">
          <div className="bg-white w-full max-w-md h-[70vh] rounded-t-3xl shadow-2xl flex flex-col">
            <div className="bg-[#0D1B3E] p-4 text-white flex justify-between items-center">
              <span className="font-bold">🤖 GPNR AI 도우미</span>
              <button onClick={() => setIsChatOpen(false)}><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-800'}`}>{msg.text}</div>
                </div>
              ))}
              {isTyping && <div className="text-xs text-gray-400 animate-pulse">분석 중...</div>}
            </div>
            <div className="p-4 border-t flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && askAI()} className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm outline-none" placeholder="뉴스에 대해 물어보세요..." />
              <button onClick={askAI} className="bg-indigo-600 text-white p-2 rounded-xl"><Send size={20} /></button>
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 border-t flex justify-around py-3 z-50">
        <div className="flex flex-col items-center text-indigo-700 font-bold"><Home size={22} /><span className="text-[10px]">Home</span></div>
        <div className="flex flex-col items-center text-gray-400 opacity-50"><MessageSquare size={22} /><span className="text-[10px]">{currentT.ai_assistant}</span></div>
        <div className="flex flex-col items-center text-gray-400 opacity-50"><User size={22} /><span className="text-[10px]">{currentT.profile}</span></div>
        <button onClick={handleAuthAndPayment} className="flex flex-col items-center bg-indigo-50 px-4 py-1.5 rounded-2xl border border-indigo-100">
          <CircleDollarSign size={20} className="text-indigo-600" />
          <span className="text-[9px] font-black text-indigo-700">{currentT.support}</span>
        </button>
      </footer>
    </div>
  );
}
