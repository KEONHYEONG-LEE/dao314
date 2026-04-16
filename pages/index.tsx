import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import CategoryTabs from '@/components/category-tabs';
import NewsFeed from '@/components/news-feed';
import Footer from '@/components/footer';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 1. Pi Network 인증 로직
  const handlePiLogin = async () => {
    try {
      const scopes = ['username', 'payments'];
      const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      setIsLoggedIn(true);
      console.log(`Hello, ${auth.user.username}`);
    } catch (err) {
      console.error("Pi Auth failed:", err);
    }
  };

  const onIncompletePaymentFound = (payment: any) => {
    console.log("미결제 건 발견:", payment);
    // 필요 시 결제 취소/완료 로직 추가
  };

  // 2. 결제 버튼 로직 (0.001 Pi)
  const handlePayment = async () => {
    if (!isLoggedIn) return alert("먼저 로그인해 주세요.");
    
    try {
      const payment = await window.Pi.createPayment({
        amount: 0.001,
        memo: "Support GPNR",
        metadata: { type: "support" },
      }, {
        onReadyForServerApproval: (paymentId) => { console.log("결제 대기 중:", paymentId); },
        onReadyForServerCompletion: (paymentId, txid) => { console.log("완료 처리 중:", txid); },
        onCancel: (paymentId) => { console.log("결제 취소"); },
        onError: (error, payment) => { alert("Vercel 환경이나 개발자 모드 승인을 확인하세요."); }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLogin={handlePiLogin} isLoggedIn={isLoggedIn} />
      
      <main className="container mx-auto px-4 py-6">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">GPNR Real-time News</h2>
          {/* 17개 카테고리 탭 (components 내 정의됨) */}
          <CategoryTabs />
        </section>

        <section>
          {/* 뉴스 리스트 상단에 결제 버튼 배치 */}
          <div className="flex justify-end mb-4">
            <button 
              onClick={handlePayment}
              className="bg-primary text-white px-4 py-2 rounded-lg font-bold shadow-lg"
            >
              Support 0.001π
            </button>
          </div>
          <NewsFeed />
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Pi SDK 타입 정의 에러 방지용
declare global {
  interface Window {
    Pi: any;
  }
}
