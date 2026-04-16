import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { CategoryTabs } from '@/components/category-tabs';

// 파일 전체를 모듈 객체로 가져옵니다.
import * as NewsModule from '@/components/news-feed';
import * as FooterModule from '@/components/footer';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // [추가] 카테고리 상태 관리: 초기값은 'all'
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getComponent = (module: any) => {
    if (!module) return null;
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
          {/* [수정] 현재 선택된 카테고리와 변경 함수를 전달합니다 */}
          <CategoryTabs 
            selectedCategory={selectedCategory} 
            onCategoryChange={setSelectedCategory} 
          />
        </section>

        <section>
          {/* [수정] NewsFeed에 현재 선택된 카테고리를 전달합니다 */}
          {NewsFeed ? (
            <NewsFeed selectedCategory={selectedCategory} />
          ) : (
            <div className="py-10 text-center">뉴스를 불러올 수 없습니다.</div>
          )}
        </section>
      </main>

      {Footer && <Footer />}
    </div>
  );
}

declare global { interface Window { Pi: any; } }
