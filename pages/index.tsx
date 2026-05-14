"use client";

import { useState, useEffect, useRef } from "react";
import { CategoryTabs } from "../components/category-tabs";
import NewsFeed from "../components/news-feed";

const CATEGORIES = [
  "all", "mainnet", "community", "commerce", "node", "mining", 
  "wallet", "browser", "kyc", "developer", "ecosystem", "listing", 
  "price", "security", "event", "roadmap", "whitepaper", "legal"
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    // [수정됨] 구글 번역 UI만 숨기고 기능은 유지하는 로직
    const hideGoogleBar = () => {
      if (typeof document === "undefined") return;

      // 1. 화면 밀림 방지 (body와 html 위치 고정)
      if (document.body.style.top !== "0px") {
        document.body.style.top = "0px";
      }
      const html = document.documentElement;
      html.style.setProperty("padding-top", "0px", "important");
      html.style.setProperty("margin-top", "0px", "important");

      // 2. 구글 번역 UI 요소들을 '삭제(remove)'하지 않고 '숨기기(display:none)'만 수행
      const googleElements = document.querySelectorAll<HTMLElement>(
        '.goog-te-banner-frame, .goog-te-banner, .skiptranslate, iframe[id*="goog"]'
      );
      
      googleElements.forEach(el => {
        // 하단 커스텀 버튼은 제외하고 나머지 구글 기본 UI만 타겟팅
        if (!el.classList.contains('fixed')) {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.height = '0';
        }
      });
    };

    // 초기 로딩 시와 이후 주기적으로 체크 (번역 엔진 유지)
    const interval = setInterval(hideGoogleBar, 500);
    hideGoogleBar();

    return () => clearInterval(interval);
  }, []);

  // --- 스와이프 로직 ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const currentIndex = CATEGORIES.indexOf(activeCategory);

    if (distance > 75 && currentIndex < CATEGORIES.length - 1) {
      setActiveCategory(CATEGORIES[currentIndex + 1]);
    } else if (distance < -75 && currentIndex > 0) {
      setActiveCategory(CATEGORIES[currentIndex - 1]);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <main 
      className="min-h-screen bg-[#0f172a] text-slate-100 touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-sm">
        <CategoryTabs 
          selectedCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 transition-opacity duration-300">
        <NewsFeed selectedCategory={activeCategory} />
      </div>
    </main>
  );
}
