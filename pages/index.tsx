import React, { useEffect, useState } from 'react';
// 확실한 것들은 그대로 유지
import { Header } from '@/components/Header';
import { CategoryTabs } from '@/components/category-tabs';
import { Footer } from '@/components/footer';

// 문제의 NewsFeed 불러오기 방식 수정
// 만약 NewsFeed가 default export라면 아래줄이 작동합니다.
import NewsFeedDefault from '@/components/news-feed';
// 만약 NewsFeed가 named export라면 아래줄이 작동합니다.
import * as NewsFeedModule from '@/components/news-feed';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 실제 사용할 NewsFeed 컴포넌트 결정
  const ActualNewsFeed = NewsFeedDefault || (NewsFeedModule as any).NewsFeed || (NewsFeedModule as any).default;

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
          {/* NewsFeed가 어떤 방식으로 export 되었든 실행되도록 처리 */}
          {ActualNewsFeed ? <ActualNewsFeed /> : <p className="text-center">뉴스를 불러오는 중...</p>}
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
