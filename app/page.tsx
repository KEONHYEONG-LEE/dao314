"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Youtube, User, Home, Heart, CircleDollarSign, Grid, Languages, MessageSquare } from 'lucide-react';

// 17개 카테고리 정의
const CATEGORIES = [
  { id: 'all', label: { ko: '전체', en: 'See All' }, icon: <Grid size={18}/> },
  { id: 'mainnet', label: { ko: '메인넷', en: 'Mainnet' }, icon: '🌐' },
  { id: 'community', label: { ko: '커뮤니티', en: 'Global Community' }, icon: '👥' },
  { id: 'commerce', label: { ko: '커머스', en: 'Commerce' }, icon: '🛒' },
  { id: 'social', label: { ko: '소셜', en: 'Social' }, icon: '💬' },
  { id: 'education', label: { ko: '교육', en: 'Education' }, icon: '📚' },
  { id: 'health', label: { ko: '건강', en: 'Health' }, icon: '🏥' },
  { id: 'travel', label: { ko: '여행', en: 'Travel' }, icon: '✈️' },
  { id: 'utilities', label: { ko: '유틸리티', en: 'Utilities' }, icon: '🛠️' },
  { id: 'career', label: { ko: '커리어', en: 'Career' }, icon: '💼' },
  { id: 'entertainment', label: { ko: '엔터테인먼트', en: 'Entertainment' }, icon: '🎬' },
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
  const [lang, setLang] = useState<'en'|'ko'|'zh'|'es'|'vi'>('ko'); // 4번 요구사항: 5개 언어
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchNews();
    if (typeof window !== "undefined" && window.Pi) {
      window.Pi.init({ version: "1.5", sandbox: true });
    }
  }, [activeCategory]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?category=${activeCategory}`);
      const data = await res.json();
      setNews(data);
    } catch (err) {
      console.error("News fetch error");
    } finally {
      setLoading(false);
    }
  };

  // 1 & 2번 요구사항: 결제 로직 보완 및 에러 핸들링
  const handleSupportClick = async () => {
    if (typeof window === "undefined" || !window.Pi) {
      alert("Please open in Pi Browser.");
      return;
    }

    try {
      // 1. 인증 확인 및 미결제 건 처리
      const auth = await window.Pi.authenticate(['payments', 'username'], (incompletePayment: any) => {
        console.log("Incomplete payment found:", incompletePayment);
        // 여기서 서버에 미결제 건 완료/취소 요청 로직 추가 가능
      });
      setUser({ username: auth.user.username, uid: auth.user.uid });

      // 2. 결제 생성
      await window.Pi.createPayment({
        amount: 0.001,
        memo: "Support GPNR",
        metadata: { type: "support_gpnr" },
      }, {
        onReadyForServerApproval: (id: string) => console.log("Wait for approval:", id),
        onReadyForServerCompletion: (id: string, txid: string) => alert("Successfully Supported!"),
        onCancel: (id: string) => console.log("Cancelled"),
        onError: (error: any) => {
          // 2번 요구사항: App Not Verified 대응
          if (error.type === 'app_not_verified') {
            alert("⚠️ Pi Browser의 개발자 모드에서 도메인 승인이 필요합니다.");
          } else {
            alert("Error: " + error.message);
          }
        },
      });
    } catch (err: any) {
      alert("Auth Failed: " + err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-gray-900 font-sans">
      
      {/* 상단 헤더 */}
      <header className="bg-[#0D1B3E] text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-extrabold text-sm">G</div>
          <div>
            <h1 className="text-lg font-bold">GPNR</h1>
            <span className="text-[9px] opacity-60">Global Pi News Room</span>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <Languages size={20} className="cursor-pointer" onClick={() => { /* 언어 변경 로직 */ }} />
          <button onClick={handleSupportClick} className="bg-indigo-600 px-3 py-1 rounded-md text-xs font-semibold">
            {user ? user.username : "Login"}
          </button>
        </div>
      </header>

      {/* 4 & 5번 요구사항: 17개 카테고리 영역 */}
      <div className="bg-white p-4 border-b shadow-sm sticky top-[60px] z-40">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input type="text" placeholder="Search Pi news..." className="w-full bg-gray-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none" />
        </div>
        
        <div className="flex overflow-x-auto gap-4 no-scrollbar pb-1">
          {CATEGORIES.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setActiveCategory(item.id)}
              className={`flex flex-col items-center min-w-[60px] gap-1.5 cursor-pointer transition-all ${activeCategory === item.id ? 'scale-110' : 'opacity-60'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${activeCategory === item.id ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold whitespace-nowrap">{item.label[lang === 'ko' ? 'ko' : 'en']}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 뉴스 피드: 0번 요구사항 (로그인 전/후 차별화) */}
      <main className="p-4 space-y-5 pb-28">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading News...</div>
        ) : (
          news.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
              onClick={() => {
                if(!user) alert("로그인 후 상세 뉴스를 확인하실 수 있습니다.");
                else window.open(item.url, '_blank'); // 8번 상세페이지 이동
              }}
            >
              <div className="h-44 bg-gray-200 relative">
                <img src={item.image || `https://picsum.photos/seed/${item.id}/400/200`} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded font-bold">{item.category}</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-base mb-2 line-clamp-2">{item.title}</h3>
                {/* 0번 요구사항: 로그인한 유저에게만 상세 설명 노출 */}
                <p className={`text-gray-500 text-[11px] leading-relaxed ${!user && 'blur-[2px] select-none'}`}>
                  {user ? item.description : "로그인 후 자세한 소식을 확인하세요. Please login to read full details."}
                </p>
                <div className="mt-4 flex justify-between items-center text-[10px] text-gray-400">
                  <span>{item.author}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* 하단 탭 바 (7번 AI 비서 포함) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t flex justify-around py-3 z-50">
        <div className="flex flex-col items-center text-indigo-700"><Home size={22} /><span className="text-[9px] mt-1">Home</span></div>
        <div className="flex flex-col items-center text-gray-400"><MessageSquare size={22} /><span className="text-[9px] mt-1">AI Chat</span></div>
        <div className="flex flex-col items-center text-gray-400"><User size={22} /><span className="text-[9px] mt-1">Profile</span></div>
        <button onClick={handleSupportClick} className="flex flex-col items-center bg-indigo-50 px-4 py-1 rounded-xl border border-indigo-100">
          <CircleDollarSign size={22} className="text-indigo-600" />
          <span className="text-[9px] mt-1 font-bold text-indigo-700">Support</span>
        </button>
      </footer>
    </div>
  );
}
