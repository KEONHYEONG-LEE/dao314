import React, { useEffect, useState } from 'react';
// 컴포넌트들을 중괄호 { }로 감싸서 Named Export 방식으로 불러옵니다.
import { Header } from '@/components/Header'; 
import { CategoryTabs } from '@/components/category-tabs'; 
import { NewsFeed } from '@/components/news-feed'; 
import { Footer } from '@/components/footer'; 

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Pi Network 인증 및 로그인
  const handlePiLogin = async () => {
    if (typeof window !== 'undefined' && window.Pi) {
      try {
        const scopes = ['username', 'payments'];
        const auth = await window.Pi.authenticate(scopes, (payment: any) => {
          console.log("미결제 건 발견:", payment);
        });
        setIsLoggedIn(true);
        console.log(`Pioneer ${auth.user.username} 로그인됨`);
      } catch (err) {
        console.error("인증 실패:", err);
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
          <NewsFeed />
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
