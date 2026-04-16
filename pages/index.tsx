import React, { useEffect, useState } from 'react';
// 경로를 직접 지정하여 에러 방지
import Header from '../components/Header';
import CategoryTabs from '../components/category-tabs';
import NewsFeed from '../components/news-feed';
import Footer from '../components/footer';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handlePiLogin = async () => {
    try {
      const scopes = ['username', 'payments'];
      await window.Pi.authenticate(scopes, (payment: any) => {
        console.log("미결제:", payment);
      });
      setIsLoggedIn(true);
    } catch (err) {
      console.error("로그인 실패", err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header onLogin={handlePiLogin} isLoggedIn={isLoggedIn} />
      <main className="container mx-auto px-4 py-6">
        <CategoryTabs />
        <NewsFeed />
      </main>
      <Footer />
    </div>
  );
}

declare global { interface Window { Pi: any; } }
