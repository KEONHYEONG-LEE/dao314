"use client";

import { useState, useEffect } from "react";
// MessageSquare 아이콘 추가
import { Search, Bell, Youtube, User, Home, Heart, CircleDollarSign, Grid, Languages, MessageSquare, ChevronDown, X, Lock, Send } from 'lucide-react';

// ... (translations 및 CATEGORIES 기존 유지)

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{username: string, uid: string} | null>(null);
  const [lang, setLang] = useState<'en'|'ko'|'zh'|'es'|'vi'>('ko');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  // --- [7번 로직 추가] AI 채팅 관련 상태 ---
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

  const fetchNews = async () => { /* 기존 fetch 로직 */ };

  // [7번 로직 추가] AI에게 질문하기 함수
  const askAI = async () => {
    if (!chatInput.trim() || !selectedNews) return;

    const userMessage = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          contextNews: selectedNews, // 현재 클릭된 뉴스 정보 통째로 전달
          lang: lang // 현재 설정된 언어 전달
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setChatHistory(prev => [...prev, { role: 'ai', text: data.answer }]);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "AI 응답을 가져오는데 실패했습니다." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ... (handleAuthAndPayment 및 handleNewsClick 기존 유지)

  const currentT = translations[lang] || translations['en'];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-gray-900 font-sans">
      {/* Header, Search, Category ... 기존 유지 */}

      <main className="...">
        {/* 뉴스 리스트 렌더링 ... 기존 유지 */}
      </main>

      {/* [8번 뉴스 상세 모달 내부에 AI 버튼 추가] */}
      {selectedNews && user && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-[2.5rem] relative no-scrollbar">
            {/* ... 상세 내용 상단 생략 ... */}
            <div className="p-6">
               {/* 뉴스 본문 하단에 AI 어시스턴트 호출 버튼 */}
               <button 
                 onClick={() => { setIsChatOpen(true); setChatHistory([]); }}
                 className="flex items-center justify-center gap-2 w-full py-4 mb-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold border border-indigo-100 hover:bg-indigo-100 transition-all"
               >
                 <MessageSquare size={18} />
                 {currentT.ai_assistant}와 이 뉴스 논의하기
               </button>

               <button onClick={() => window.open(selectedNews.url, '_blank')} className="...">
                 {currentT.read_more}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* [7번 로직] AI 채팅 팝업 UI */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex items-end justify-center sm:items-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md h-[80vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
            <div className="bg-[#0D1B3E] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-xs">🤖</div>
                <span className="font-bold">GPNR AI 도우미</span>
              </div>
              <button onClick={() => setIsChatOpen(false)}><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              <div className="bg-white p-3 rounded-2xl shadow-sm border text-xs text-gray-500">
                 📌 주제: {selectedNews?.title}
              </div>
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-xs text-gray-400 animate-pulse ml-2">AI가 분석 중입니다...</div>}
            </div>

            <div className="p-4 bg-white border-t flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askAI()}
                placeholder="궁금한 점을 물어보세요..." 
                className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20"
              />
              <button onClick={askAI} className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer ... */}
    </div>
  );
}
