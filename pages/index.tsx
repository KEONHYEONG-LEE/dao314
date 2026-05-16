"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "../components/Header"; // [추가] 업그레이드한 헤더 컴포넌트 임포트
import { CategoryTabs } from "../components/category-tabs";
import NewsFeed from "../components/news-feed";

// [수정] lib/categories.ts의 18개 고유 ID 스키마와 완벽 매핑 (outlook, events로 통일)
const CATEGORIES = [
  "all", "mainnet", "node", "mining", "wallet", "browser", 
  "roadmap", "whitepaper", "community", "commerce", "kyc", 
  "developer", "ecosystem", "outlook", "price", "security", 
  "events", "legal"
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentLanguage, setCurrentLanguage] = useState('ko'); // [추가] 다국어 상태 관리
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    // 구글 번역 UI 숨기기 및 현재 선택된 언어 실시간 감지 로직
    const handleGoogleTranslationSystem = () => {
      if (typeof document === "undefined") return;

      // 1. 화면 밀림 방지
      if (document.body.style.top !== "0px") {
        document.body.style.top = "0px";
      }
      const html = document.documentElement;
      html.style.setProperty("padding-top", "0px", "important");
      html.style.setProperty("margin-top", "0px", "important");

      // 2. 구글 번역 기본 툴바 숨기기
      const googleElements = document.querySelectorAll<HTMLElement>(
        '.goog-te-banner-frame, .goog-te-banner, .skiptranslate, iframe[id*="goog"]'
      );
      googleElements.forEach(el => {
        if (!el.classList.contains('fixed')) {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.height = '0';
        }
      });

      // 3. [다국어 활성화 해결] 쿠키(googtrans) 분석을 통해 번역기가 선택한 현재 언어 코드를 헤더에 동기화
      const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
      if (match && match[1]) {
        // 예: /ko/en -> en 추출
        const parts = match[1].split('/');
        const langCode = parts[parts.length - 1]?.toLowerCase();
        if (langCode && langCode !== currentLanguage) {
          // zh-CN, zh-TW 호환 처리 및 기본 매핑
          if (langCode === 'zh-cn') setCurrentLanguage('zh_cn');
          else if (langCode === 'zh-tw') setCurrentLanguage('zh_tw');
          else setCurrentLanguage(langCode);
        }
      }
    };

    const interval = setInterval(handleGoogleTranslationSystem, 500);
    handleGoogleTranslationSystem();

    return () => clearInterval(interval);
  }, [currentLanguage]);

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

    // 달력 등의 특수 탭일 때는 스와이프 제외
    if (currentIndex === -1) return;

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
      {/* [완벽 결합] 최상단 헤더에 실시간 상태값과 변경 핸들러를 주입하여 동기화 완료 */}
      <Header 
        currentCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
        currentLanguage={currentLanguage}
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
