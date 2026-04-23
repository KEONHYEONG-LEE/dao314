"use client";

import { useState, useEffect } from "react";

// Pi SDK 타입 선언 (TypeScript 에러 방지)
declare global {
  interface Window {
    Pi: any;
  }
}

// 17개 카테고리 정의
const CATEGORIES = [
  'all', 'mainnet', 'community', 'commerce', 'node', 'mining', 'wallet', 
  'browser', 'kyc', 'developer', 'ecosystem', 'listing', 'price', 
  'security', 'event', 'roadmap', 'whitepaper', 'legal'
];

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const query = activeCategory === 'all' ? '' : `?category=${activeCategory.toUpperCase()}`;
        const res = await fetch(`/api/fetch-news${query}`);
        const data = await res.json();
        
        const articles = Array.isArray(data) ? data : (data.articles || []);
        setNews(articles);
      } catch (error) {
        console.error("Fetch error:", error);
        setNews([]);
      }
      setLoading(false);
    };
    fetchNews();
  }, [activeCategory]);

  // --- Pi Network 결제 로직 시작 ---
  const handleSupportPayment = async () => {
    if (!window.Pi) {
      alert("Pi Browser에서 접속해 주세요.");
      return;
    }

    try {
      // 1. 인증 확인 및 미결제 건 처리 (onIncompletePaymentFound)
      const auth = await window.Pi.authenticate(['payments', 'username'], (payment: any) => {
        console.log("미결제 건 발견 및 처리:", payment);
        // 여기에 필요 시 서버에 미결제 건 완료를 요청하는 fetch 코드를 넣을 수 있습니다.
      });

      console.log("인증 완료 파이오니어:", auth.user.username);

      // 2. 결제 생성 (0.001 Pi, Support GPNR)
      window.Pi.createPayment({
        amount: 0.001,
        memo: "Support GPNR",
        metadata: { type: "donation" },
      }, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log("서버 승인 대기 중:", paymentId);
          // 백엔드 구현 시 여기서 fetch('/api/approve-payment', ...) 호출
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log("결제 완료 처리:", txid);
          alert("후원해주셔서 감사합니다, 파이오니어님!");
        },
        onCancel: (paymentId: string) => {
          console.log("사용자 결제 취소:", paymentId);
        },
        onError: (error: any, payment: any) => {
          console.error("결제 에러:", error);
          
          // 3. '확인되지 않음' 및 에러 우회 안내 로직
          if (error.type === "app_not_verified") {
            alert("⚠️ Pi Browser의 개발자 모드에서 도메인(dao314-rev3.vercel.app) 승인이 필요합니다.");
          } else if (error.type === "user_cancelled") {
            console.log("결제창이 닫혔습니다.");
          } else {
            alert("결제 시도 중 오류가 발생했습니다: " + error.message);
          }
        }
      });
    } catch (err) {
      console.error("인증 에러:", err);
      alert("Pi 인증에 실패했습니다.");
    }
  };
  // --- Pi Network 결제 로직 끝 ---

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24"> {/* 하단 버튼 공간을 위해 pb-24로 수정 */}
      <header className="bg-[#0D1B3E] text-white px-4 py-3 sticky top-0 z-50 shadow-md">
        <span className="text-xl font-black tracking-tighter">GPNR</span>
      </header>

      {/* 카테고리 네비게이션 */}
      <nav className="flex gap-2 p-3 overflow-x-auto bg-white border-b no-scrollbar sticky top-[48px] z-40">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex-shrink-0 border ${
              activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-100'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>

      <main className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-20 text-center text-gray-400 text-sm">Loading News...</div>
        ) : news.length > 0 ? (
          news.map((item, idx) => (
            <a 
              key={idx} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex gap-4 p-4 active:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-bold text-[15px] line-clamp-2 text-gray-900 leading-snug">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold text-indigo-500">{item.source}</span>
                  <span className="text-[10px] text-gray-300">{item.date}</span>
                </div>
              </div>
              {item.imageUrl && (
                <img src={item.imageUrl} className="w-20 h-20 object-cover rounded-xl bg-gray-50 flex-shrink-0" alt="" />
              )}
            </a>
          ))
        ) : (
          <div className="p-20 text-center text-gray-400 text-sm">No news available.</div>
        )}
      </main>

      {/* 하단 고정 후원 버튼 (GPNR 스타일 반영) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-50">
        <button
          onClick={handleSupportPayment}
          className="w-full bg-[#625afa] hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Support GPNR</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">0.001 π</span>
        </button>
      </div>
    </div>
  );
}
