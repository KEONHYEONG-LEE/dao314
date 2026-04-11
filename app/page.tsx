"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Youtube, User, Home, Heart, CircleDollarSign, Grid, Languages, MessageSquare, ChevronDown, X, Lock } from 'lucide-react';

const translations: Record<string, any> = {
  ko: {
    search: "글로벌 파이 뉴스 검색...",
    trending: "인기 소식",
    login_msg: "상세 내용은 파이오니어 전용입니다. 로그인해 주세요.",
    support: "후원 0.001π",
    verified_error: "Pi Browser의 개발자 모드에서 도메인 승인이 필요합니다.",
    ai_assistant: "AI 도우미",
    all: "전체보기",
    login: "로그인",
    profile: "프로필",
    read_more: "원문 기사 읽기",
    close: "닫기"
  },
  // ... (다른 언어는 기존 유지)
};

// ... (CATEGORIES 상수 기존 유지)

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{username: string, uid: string} | null>(null);
  const [lang, setLang] = useState<'en'|'ko'|'zh'|'es'|'vi'>('ko');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('gpnr_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    fetchNews();
    if (typeof window !== "undefined" && (window as any).Pi) {
      (window as any).Pi.init({ version: "1.5", sandbox: true });
    }
  }, [activeCategory, lang]);

  const fetchNews = async () => { /* 기존 로직 유지 */ };

  // [1, 2번 로직 적용] 결제 및 로그인 통합 핸들러
  const handleAuthAndPayment = async () => {
    if (typeof window === "undefined" || !(window as any).Pi) {
      alert("Please open in Pi Browser.");
      return;
    }

    try {
      // 1. 인증 확인 (유저 지갑 상태 점검)
      const auth = await (window as any).Pi.authenticate(['payments', 'username'], (incompletePayment: any) => {
        // 미결제 건 처리 로직 추가
        console.log("Incomplete payment found, handling...", incompletePayment);
        // 필요 시 여기서 서버에 incompletePayment.identifier를 보내 처리를 완료하거나 취소 요청을 할 수 있습니다.
      });
      
      const userData = { username: auth.user.username, uid: auth.user.uid };
      setUser(userData);
      localStorage.setItem('gpnr_user', JSON.stringify(userData));

      // 2. 결제 생성 (인증 성공 후 실행)
      await (window as any).Pi.createPayment({
        amount: 0.001,
        memo: "Support GPNR",
        metadata: { type: "support_gpnr" },
      }, {
        onReadyForServerApproval: (id: string) => console.log("Approval ID:", id),
        onReadyForServerCompletion: (id: string, txid: string) => alert("결제가 완료되었습니다! 감사합니다."),
        onCancel: (id: string) => console.log("Payment Cancelled"),
        onError: (error: any) => {
          if (error.type === 'app_not_verified') {
            alert(currentT.verified_error); // [2번] 디버깅 문구 출력
          } else {
            alert("Error: " + error.message);
          }
        },
      });
    } catch (err: any) {
      alert("인증에 실패했습니다: " + err.message);
    }
  };

  // [0번 로직] 기사 클릭 시 제어
  const handleNewsClick = (item: any) => {
    if (!user) {
      // 로그인하지 않았으면 알림을 띄우고 결제(로그인) 유도
      if (confirm(currentT.login_msg)) {
        handleAuthAndPayment();
      }
    } else {
      setSelectedNews(item);
    }
  };

  const currentT = translations[lang] || translations['en'];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-gray-900 font-sans">
      {/* Header & Category ... 기존과 동일 (handleSupportClick -> handleAuthAndPayment로 변경) */}
      
      <main className="p-4 space-y-5 pb-28">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : (
          news.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer relative"
              onClick={() => handleNewsClick(item)} // 0번 기능 적용
            >
              {!user && ( // 로그인 안했을 때 요약본 위에 잠금 표시 살짝 노출 가능
                <div className="absolute top-2 right-2 z-10 bg-black/20 p-1 rounded-full backdrop-blur-md">
                   <Lock size={12} className="text-white" />
                </div>
              )}
              {/* 기사 썸네일 & 요약 내용 (기존과 동일) */}
              <div className="h-44 bg-gray-200">
                <img src={item.image} className={`w-full h-full object-cover ${!user ? 'grayscale-[0.5]' : ''}`} alt="news" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-base mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-gray-500 text-[11px] line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))
        )}
      </main>

      {/* 상세 페이지 모달 (user가 있을 때만 렌더링되거나 모달 내부에서 제어) */}
      {selectedNews && user && (
        <div className="fixed inset-0 z-[100] ..."> 
           {/* 기존 상세 페이지 코드 유지 */}
        </div>
      )}

      {/* Footer (handleSupportClick -> handleAuthAndPayment로 변경) */}
    </div>
  );
}
