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
    // 1. 구글 UI 강제 숨기기 (더 강력한 선택자 추가)
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame, .VIpgJd-Zvi9m-OR9h3-zh99gd, .goog-te-banner { 
        display: none !important; 
        visibility: hidden !important; 
      }
      #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
      body { top: 0 !important; position: static !important; }
    `;
    document.head.appendChild(style);

    // 2. 브라우저가 강제로 top 값을 수정할 경우 실시간 원복 스크립트
    const fixBodyLayout = () => {
      if (document.body.style.top !== '0px') {
        document.body.style.top = '0px';
      }
    };

    const interval = setInterval(fixBodyLayout, 500);

    return () => {
      document.head.removeChild(style);
      clearInterval(interval);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 70;
    const isRightSwipe = distance < -70;
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

      <div className="max-w-3xl mx-auto transition-opacity duration-300">
        <NewsFeed selectedCategory={activeCategory} />
      </div>
    </main>
  );
}
