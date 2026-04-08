"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Youtube, User, Home, Heart, CircleDollarSign, Grid } from 'lucide-react';

declare global {
  interface Window {
    Pi: any;
  }
}

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{username: string, uid: string} | null>(null);

  useEffect(() => {
    fetch("/data/news.json")
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    if (typeof window !== "undefined" && window.Pi) {
      window.Pi.init({ version: "1.5", sandbox: true }); 
    }
  }, []);

  const handleSupportClick = async () => {
    if (typeof window !== "undefined" && window.Pi) {
      try {
        const auth = await window.Pi.authenticate(['payments', 'username'], (payment: any) => {
          console.log("미완료 결제 발견:", payment);
        });
        setUser({ username: auth.user.username, uid: auth.user.uid });

        await window.Pi.createPayment({
          amount: 0.001,
          memo: "GPNR 뉴스 후원 테스트",
          metadata: { paymentType: "donation" },
        }, {
          onReadyForServerApproval: (paymentId: string) => console.log("승인 대기:", paymentId),
          onReadyForServerCompletion: (paymentId: string, txid: string) => alert("후원이 완료되었습니다!"),
          onCancel: (paymentId: string) => console.log("취소"),
          onError: (error: Error) => alert("에러: " + error.message),
        });
      } catch (err: any) {
        alert("오류: " + (err.message || "다시 시도해 주세요."));
      }
    } else {
      alert("파이 브라우저 환경이 아닙니다.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-gray-900 font-sans">
      
      {/* 1. 상단 헤더 (GPNR 로고) */}
      <header className="bg-[#0D1B3E] text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-extrabold text-sm shadow-inner">G</div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight">GPNR</h1>
            <span className="text-[9px] font-light opacity-60">Global Pi News Room</span>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative cursor-pointer"><Bell size={20} /><span className="absolute -top-1 -right-1 bg-red-500 text-[8px] w-3 h-3 rounded-full flex items-center justify-center">2</span></div>
          <Youtube size={22} className="text-red-600 cursor-pointer" />
          <button className="bg-indigo-600 px-3 py-1 rounded-md text-xs font-semibold hover:bg-indigo-700 transition-colors">
            {user ? "Profile" : "Login"}
          </button>
        </div>
      </header>

      {/* 2. 검색 & 카테고리 영역 (4번 사진의 핵심 메뉴) */}
      <div className="bg-white p-4 border-b shadow-sm">
        <div className="relative mb-5">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Global Pi news..." 
            className="w-full bg-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-300" 
          />
        </div>
        
        <div className="flex justify-between overflow-x-auto gap-4 no-scrollbar pb-1">
          {[
            { label: 'See All', icon: <Grid size={20}/> },
            { label: 'Mainnet', icon: '🌐' },
            { label: 'Community', icon: '👥' },
            { label: 'Commerce', icon: '🛒' },
            { label: 'Social', icon: '💬' },
            { label: 'Education', icon: '📚' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center min-w-[55px] gap-1.5 cursor-pointer active:scale-95 transition-transform">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm text-indigo-600">
                {item.icon}
              </div>
              <span className="text-[11px] text-gray-500 font-bold whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 뉴스 피드 (카드형 레이아웃) */}
      <main className="p-4 space-y-5 pb-28">
        <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] tracking-widest uppercase">
          <span className="animate-pulse">↗ TRENDING</span>
          <p className="text-gray-500 truncate font-medium normal-case">Pi Network Ecosystem Growth 2026...</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">Loading News...</div>
        ) : (
          news.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:bg-gray-50 transition-colors">
              {/* 이미지 경로가 있을 경우 표시 (없으면 가상 이미지) */}
              <div className="h-44 bg-gray-200 relative">
                <img 
                  src={item.image || `https://picsum.photos/seed/${idx}/400/200`} 
                  alt="news" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-indigo-600/90 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                  Official
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-base leading-snug mb-2 text-gray-800 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-[11px] line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-4 flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-50 pt-3">
                  <div className="flex items-center gap-1.5 font-medium">
                    <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center text-[8px]">π</div>
                    {item.author || "Pi News"}
                  </div>
                  <span>{item.date || "2026-04-08"}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* 4. 하단 탭 바 (4번 사진의 Support & Navigation 통합) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t flex justify-around py-3 px-2 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col items-center text-indigo-700 font-bold">
          <Home size={22} /><span className="text-[9px] mt-1">Home</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <Heart size={22} /><span className="text-[9px] mt-1">Fav</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <User size={22} /><span className="text-[9px] mt-1">Profile</span>
        </div>
        {/* Support 버튼을 탭 바 우측에 세련되게 배치 */}
        <button 
          onClick={handleSupportClick}
          className="flex flex-col items-center bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100 active:bg-indigo-100 transition-colors"
        >
          <CircleDollarSign size={22} className="text-indigo-600" />
          <span className="text-[9px] mt-1 font-bold text-indigo-700">Tip 0.001π</span>
        </button>
      </footer>
    </div>
  );
}
