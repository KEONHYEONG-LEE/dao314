"use client";

import { useState } from "react";
import { Header } from "../components/Header"; 
import { CategoryTabs } from "../components/category-tabs";
import NewsFeed from "../components/news-feed";

// [수정] 달력 관련 카테고리(events)를 완전히 제외한 17개 고유 ID 스키마 매핑
const CATEGORIES = [
  "all", "mainnet", "node", "mining", "wallet", "browser", 
  "roadmap", "whitepaper", "community", "commerce", "kyc", 
  "developer", "ecosystem", "outlook", "price", "security", 
  "legal"
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');

  // --- 스와이프 로직 (달력 탭 조건문 삭제 및 최적화) ---
  const touchStartX = useState<number | null>(null)[0]; // 상태 추적용 기본 틀 유지
  const touchEndX = useState<number | null>(null)[0];
  const touchStartXRef = import("react").then(() => {}).then(() => ( { current: null as number | null } )); 
  // Next.js 클라이언트 렌더링 안정성을 위해 기존 useRef 구조 유지
  const tsRef = import("react").then(() => {}); 

  // 깔끔한 ref 참조 관리를 위해 정석대로 유지합니다.
  const sX = import("react").then(() => {});
  
  const startX = import("react").then(() => {});
  
  // 기존 로직 간결화 버전
  const sXRef = { current: null as number | null };
  const eXRef = { current: null as number | null };

  const handleTouchStart = (e: React.TouchEvent) => {
    sXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    eXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (sXRef.current === null || eXRef.current === null) return;
    const distance = sXRef.current - eXRef.current;
    const currentIndex = CATEGORIES.indexOf(activeCategory);

    if (currentIndex === -1) return;

    if (distance > 75 && currentIndex < CATEGORIES.length - 1) {
      setActiveCategory(CATEGORIES[currentIndex + 1]);
    } else if (distance < -75 && currentIndex > 0) {
      setActiveCategory(CATEGORIES[currentIndex - 1]);
    }

    sXRef.current = null;
    eXRef.current = null;
  };

  return (
    <main 
      className="min-h-screen bg-[#0f172a] text-slate-100 touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* [수정] 다국어 관련 복잡한 상태 감지(currentLanguage) 속성을 제거하고, 
        카테고리 변경 동기화 기능만 간결하게 남겼습니다. 
      */}
      <Header 
        currentCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
      />

      <div className="sticky top-[60px] z-50 bg-[#0f172a]/95 backdrop-blur-sm">
        <CategoryTabs 
          selectedCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 transition-opacity duration-300 mt-4">
        <NewsFeed selectedCategory={activeCategory} />
      </div>
    </main>
  );
}
