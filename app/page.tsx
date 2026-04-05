"use client";

import { useState, useEffect } from "react";

// 글로벌 Pi 객체 타입 선언
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
    // 뉴스 로드
    fetch("/data/news.json")
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Pi SDK 초기화
    if (typeof window !== "undefined" && window.Pi) {
      // 10단계 통과 전 개발 모드에서는 sandbox: true 설정을 사용합니다.
      window.Pi.init({ version: "1.5", sandbox: true }); 
    }
  }, []);

  // 로그인 및 결제 통합 함수
  const handleSupportClick = async () => {
    if (typeof window !== "undefined" && window.Pi) {
      try {
        // 1. 파이 로그인 인증 시도
        const auth = await window.Pi.authenticate(['payments', 'username'], (payment: any) => {
          console.log("미완료 결제 발견:", payment);
        });
        
        setUser({ username: auth.user.username, uid: auth.user.uid });

        // 2. 인증 성공 시 결제창 생성 (테스트넷 결제)
        await window.Pi.createPayment({
          amount: 0.001,
          memo: "GPNR 뉴스 후원 테스트",
          metadata: { paymentType: "donation" },
        }, {
          onReadyForServerApproval: (paymentId: string) => {
            console.log("승인 대기 중:", paymentId);
          },
          onReadyForServerCompletion: (paymentId: string, txid: string) => {
            alert("후원이 완료되었습니다!");
          },
          onCancel: (paymentId: string) => console.log("결제 취소:", paymentId),
          onError: (error: Error) => alert("결제 에러: " + error.message),
        });
        
      } catch (err: any) {
        alert("오류 발생: " + (err.message || "다시 시도해 주세요."));
      }
    } else {
      alert("파이 브라우저 환경이 아닙니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24 font-sans">
      <header className="bg-blue-900 text-white p-6 text-center shadow-md">
        <h1 className="text-2xl font-bold">GPNR Global News</h1>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {loading ? (
          <p className="text-center py-10">뉴스 로딩 중...</p>
        ) : (
          news.map((item: any, idx: number) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow border">
              <h2 className="font-bold text-lg">{item.title}</h2>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center z-50">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-bold">GPNR Support</span>
          <span className="font-medium text-gray-700">
            {user ? `${user.username}님` : "로그인 전"}
          </span>
        </div>
        <button 
          onClick={handleSupportClick}
          className="bg-purple-700 text-white px-8 py-3 rounded-full font-bold shadow-lg active:bg-purple-800"
        >
          Support 0.001 Pi
        </button>
      </footer>
    </div>
  );
}
