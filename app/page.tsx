"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    Pi: any;
  }
}

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{username: string, uid: string} | null>(null);

  useEffect(() => {
    // 뉴스 로드 로직 (기존 유지)
    fetch("/data/news.json").then(res => res.json()).then(data => {
      setNews(data);
      setLoading(false);
    });

    // Pi SDK 초기화
    if (typeof window !== "undefined" && window.Pi) {
      window.Pi.init({ version: "1.5", sandbox: true }); // 현재 샌드박스 테스트 중이므로 true
    }
  }, []);

  // 핵심: 로그인 후 결제 진행
  const handleSupportClick = async () => {
    if (typeof window !== "undefined" && window.Pi) {
      try {
        // 1. 로그인 확인 및 사용자 인증
        const auth = await window.Pi.authenticate(['payments', 'username'], (payment: any) => {
          console.log("결제 대기 중...", payment);
        });
        
        setUser({ username: auth.user.username, uid: auth.user.uid });
        console.log("로그인 성공:", auth.user.username);

        // 2. 로그인 성공 시 바로 결제창 호출
        await startPayment();
        
      } catch (err) {
        console.error("인증 실패:", err);
        alert("파이 네트워크 로그인이 필요합니다.");
      }
    }
  };

  const startPayment = async () => {
    try {
      await window.Pi.createPayment({
        amount: 0.001,
        memo: "GPNR 뉴스 후원",
        metadata: { paymentType: "donation" },
      }, {
        onReadyForServerApproval: (paymentId: string) => console.log("승인 대기:", paymentId),
        onReadyForServerCompletion: (paymentId: string, txid: string) => alert("후원 완료! TXID: " + txid),
        onCancel: (paymentId: string) => console.log("취소됨"),
        onError: (error: Error) => alert("결제 에러 발생"),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* 기존 뉴스 UI 생략 (제티님 기존 코드 그대로 유지) */}
      
      {/* 하단 버튼: 이제 이 버튼을 누르면 로그인을 먼저 시도합니다 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center shadow-lg">
        <div className="text-sm font-bold text-gray-700">
          {user ? `${user.username}님 환영합니다` : "GPNR Support"}
        </div>
        <button 
          onClick={handleSupportClick}
          className="bg-purple-600 text-white px-6 py-2 rounded-full font-bold shadow-md"
        >
          Support 0.001 Pi
        </button>
      </div>
    </div>
  );
}
