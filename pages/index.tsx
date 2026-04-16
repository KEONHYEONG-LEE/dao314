import React, { useEffect, useState } from 'react';
// 파일명 대소문자 및 import 방식을 깃허브 구조에 맞춰 재정렬했습니다.
import { Header } from '@/components/Header'; // Header.tsx
import { CategoryTabs } from '@/components/category-tabs'; // category-tabs.tsx

// 아래 두 항목이 경고의 주범입니다. 일단 중괄호를 제거하고 시도해 봅니다.
import NewsFeed from '@/components/news-feed'; 
import Footer from '@/components/footer'; 

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
      {/* 컴포넌트가 존재할 때만 렌더링하도록 방어 코드를 넣었습니다. */}
      {Header && <Header onLogin={handlePiLogin} isLoggedIn={isLoggedIn} />}
      
      <main className="container mx-auto px-4 py-6">
        <section className="mb-8">
          {CategoryTabs && <CategoryTabs />}
        </section>

        <section>
          {NewsFeed ? <NewsFeed /> : <p className="text-center">뉴스를 불러오는 중...</p>}
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
