import React, { useEffect, useState } from 'react';
// 1. 표준 상대 경로 방식으로 변경 (대소문자 Header, category-tabs 등 철저히 준수)
import Header from '../components/Header';
import CategoryTabs from '../components/category-tabs';
import NewsFeed from '../components/news-feed';
import Footer from '../components/footer';

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
        <CategoryTabs />
        <NewsFeed />
      </main>
      <Footer />
    </div>
  );
}

declare global {
  interface Window { Pi: any; }
}
