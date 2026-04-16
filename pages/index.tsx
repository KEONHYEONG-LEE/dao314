import React, { useEffect, useState } from 'react';
// 1. 깃허브 실물 파일명과 대소문자를 100% 일치시켰습니다.
// 2. 'default export'가 없는 경우를 대비해 중괄호 { }를 사용한 Named Import로 통일합니다.
import { Header } from '@/components/Header';
import { CategoryTabs } from '@/components/category-tabs';
import { NewsFeed } from '@/components/news-feed';
import { Footer } from '@/components/footer';

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
      {/* 3. 컴포넌트가 undefined가 아닌지 확인하는 안전장치를 추가했습니다. */}
      {Header && <Header onLogin={handlePiLogin} isLoggedIn={isLoggedIn} />}
      
      <main className="container mx-auto px-4 py-6">
        <section className="mb-8">
          {CategoryTabs && <CategoryTabs />}
        </section>

        <section>
          {NewsFeed && <NewsFeed />}
        </section>
      </main>

      {Footer && <Footer />}
    </div>
  );
}

declare global {
  interface Window {
    Pi: any;
  }
}
