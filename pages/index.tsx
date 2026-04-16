import React, { useEffect, useState } from 'react';
// 모든 컴포넌트를 중괄호 { }를 사용하는 Named Import 방식으로 통일합니다.
import { Header } from '@/components/Header';
import { CategoryTabs } from '@/components/category-tabs';
import { NewsFeed } from '@/components/news-feed'; // 중괄호 추가
import { Footer } from '@/components/footer';     // 중괄호 추가

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handlePiLogin = async () => {
    if (typeof window !== 'undefined' && window.Pi) {
      try {
        await window.Pi.authenticate(['username', 'payments'], (payment: any) => {
          console.log("Incomplete payment:", payment);
        });
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Pi Auth failed", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header onLogin={handlePiLogin} isLoggedIn={isLoggedIn} />
      
      <main className="container mx-auto px-4 py-6">
        <section className="mb-8">
          <CategoryTabs />
        </section>

        <section>
          {/* NewsFeed가 제대로 로드되지 않았을 때를 대비한 메시지 */}
          {NewsFeed ? <NewsFeed /> : <p className="text-center">뉴스를 불러올 수 없습니다.</p>}
        </section>
      </main>

      <Footer />
    </div>
  );
}

declare global {
  interface Window {
    Pi: any;
  }
}
