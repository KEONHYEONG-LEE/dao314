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
    // [완전 박멸 보안관] 구글 번역기가 화면을 밀어내는 모든 시도를 차단
    const purgeGoogleBar = () => {
      if (typeof document === "undefined") return;

      // 1. body의 top 마진 강제 리셋
      if (document.body && document.body.style.top !== "0px") {
        document.body.style.top = "0px !important";
        document.body.style.setProperty("top", "0px", "important");
      }

      // 2. html 태그에 강제로 붙는 패딩/마진 제거
      const html = document.documentElement;
      if (html.style.paddingTop !== "0px" || html.classList.contains('translated-ltr')) {
        html.style.setProperty("padding-top", "0px", "important");
        html.style.setProperty("margin-top", "0px", "important");
      }

      // 3. 상단에 생성된 구글 번역 iframe 및 관련 요소 즉각 삭제
      const googleElements = document.querySelectorAll(
        '.goog-te-banner-frame, .goog-te-banner, .skiptranslate, iframe[id*="goog"]'
      );
      googleElements.forEach(el => {
        if (el && el.parentNode) {
          (el as HTMLElement).style.display = 'none'; // 일단 숨기고
          el.remove(); // 아예 제거
        }
      });
    };

    // 처음 5초 동안은 구글이 나타날 확률이 높으므로 아주 빠르게(100ms) 감시
    const fastInterval = setInterval(purgeGoogleBar, 100);
    
    // 그 이후에도 혹시 모르니 1초마다 계속 체크
    const slowInterval = setInterval(purgeGoogleBar, 1000);

    purgeGoogleBar(); // 즉시 실행

    return () => {
      clearInterval(fastInterval);
      clearInterval(slowInterval);
    };
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
