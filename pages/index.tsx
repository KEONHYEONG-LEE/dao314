import { useState, useEffect, useRef } from "react";
import { CategoryTabs } from "../components/category-tabs";
import NewsFeed from "../components/news-feed";

// 프로젝트에서 사용하는 실제 카테고리 리스트로 순서를 맞추세요.
const CATEGORIES = ['all', 'economy', 'tech', 'world', 'science'];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    // 구글 번역 UI 숨기기
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame { display: none !important; }
      #goog-gt-tt { display: none !important; visibility: hidden !important; }
      body { top: 0 !important; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // 좌우 스와이프 로직
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 70;  // 왼쪽으로 밀기 -> 다음 카테고리
    const isRightSwipe = distance < -70; // 오른쪽으로 밀기 -> 이전 카테고리

    const currentIndex = CATEGORIES.indexOf(activeCategory);

    if (isLeftSwipe && currentIndex < CATEGORIES.length - 1) {
      setActiveCategory(CATEGORIES[currentIndex + 1]);
    } else if (isRightSwipe && currentIndex > 0) {
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
      <div className="max-w-3xl mx-auto px-4">
        <NewsFeed selectedCategory={activeCategory} />
      </div>
    </main>
  );
}
