import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { CategoryTabs } from '@/components/category-tabs';

// 파일 전체를 모듈 객체로 가져옵니다. (이름 불일치 완전 방어)
import * as NewsModule from '@/components/news-feed';
import * as FooterModule from '@/components/footer';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 모듈 객체에서 컴포넌트를 찾는 함수
  const getComponent = (module: any) => {
    if (!module) return null;
    // 1. default export 확인, 2. 첫 번째로 발견되는 함수/객체 확인
    return module.default || Object.values(module).find(val => typeof val === 'function' || typeof val === 'object');
  };

  const NewsFeed = getComponent(NewsModule);
  const Footer = getComponent(FooterModule);

  const handlePiLogin = async () => {
    if (typeof window !== 'undefined' && window.Pi) {
      try {
        await window.Pi.authenticate(['username', 'payments'], (payment: any) => {
          console.log("미결제 발견:", payment);
        });
        setIsLoggedIn(true);
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
          {/* 찾은 컴포넌트가 있으면 실행, 없으면 메시지 표시 */}
          {NewsFeed ? <NewsFeed /> : <div className="py-10 text-center">뉴스를 불러올 수 없습니다.</div>}
        </section>
      </main>

      {Footer && <Footer />}
    </div>
  );
}

declare global { interface Window { Pi: any; } }
