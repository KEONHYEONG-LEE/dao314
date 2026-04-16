import React, { useEffect, useState } from 'react';
// 깃허브 파일명(이미지 17393.jpg)과 100% 일치하도록 수정했습니다.
import Header from '@/components/Header'; // 대문자 H
import CategoryTabs from '@/components/category-tabs'; // 소문자 + 하이픈
import NewsFeed from '@/components/news-feed'; // 소문자 + 하이픈
import Footer from '@/components/footer'; // 소문자 f

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
      {/* 컴포넌트 이름도 파일명에 맞춰 정확히 호출합니다. */}
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
