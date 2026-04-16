import React, { useEffect, useState } from 'react';
// 깃허브 파일명과 대소문자를 완벽하게 일치시켰습니다.
import Header from '../components/Header';
import CategoryTabs from '../components/category-tabs';
import NewsFeed from '../components/news-feed';
import Footer from '../components/footer';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Pi Network 인증 로직
  const handlePiLogin = async () => {
    if (typeof window !== 'undefined' && window.Pi) {
      try {
        const scopes = ['username', 'payments'];
        await window.Pi.authenticate(scopes, (payment: any) => {
          console.log("Incomplete payment found:", payment);
        });
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Pi Auth failed:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* 깃허브에 있는 파일명 그대로 컴포넌트 호출 */}
      <Header onLogin={handlePiLogin} isLoggedIn={isLoggedIn} />
      
      <main className="container mx-auto px-4 py-6">
        <section className="mb-8">
          <CategoryTabs />
        </section>

        <section>
          <NewsFeed />
        </section>
      </main>

      <Footer />
    </div>
  );
}

// 타입 정의
declare global {
  interface Window {
    Pi: any;
  }
}
