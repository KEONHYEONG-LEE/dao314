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
    // [보안관 로직] 구글 번역기가 상단 여백(top: 40px 등)을 강제로 주입하는지 감시
    const fixLayout = () => {
      if (typeof document !== "undefined" && document.body) {
        if (document.body.style.top !== "0px") {
          document.body.style.top = "0px";
        }
      }
    };

    // 0.5초마다 체크하여 상단 바가 끼어들 틈을 주지 않음
    const interval = setInterval(fixLayout, 500);
    fixLayout(); // 초기 실행

    return () => clearInterval(interval);
  }, []);

  // --- 스와이프 로직 (변화 없음) ---
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
