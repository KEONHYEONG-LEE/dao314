"use client";

import { useState, useRef } from "react";
import { Header } from "../components/Header"; 
import { CategoryTabs } from "../components/category-tabs";
import NewsFeed from "../components/news-feed";

// 달력 관련 카테고리(events)를 완전히 제외한 17개 고유 ID 스키마 매핑
const CATEGORIES = [
  "all", "mainnet", "node", "mining", "wallet", "browser", 
  "roadmap", "whitepaper", "community", "commerce", "kyc", 
  "developer", "ecosystem", "outlook", "price", "security", 
  "legal"
];

// 실시간 파이 생태계 데이터 (흐르는 배너용 데이터)
const PI_STATS = [
  "🔥 오픈 메인넷 카운트다운 진행 중",
  "🖥️ 글로벌 활성 노드 수: 250,000+ 돌파",
  "🆔 KYC 마이그레이션 누적 1,200만 명 통과",
  "👛 파이 지갑 총 생성 수: 3,500만 개 이상",
  "🛒 글로벌 GCV 커머스 생태계 결제 매장 확대 중",
  "🛡️ 파이 네트워크 V24 코어 보안 프로토콜 업데이트 완료"
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');

  // --- 스와이프 로직 최적화 ---
  const sXRef = useRef<number | null>(null);
  const eXRef = useRef<number | null>(null);

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
      {/* 1. 글로벌 상단 헤더 */}
      <Header 
        currentCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
      />

      {/* 2. 실시간 글로벌 파이 통계 전광판 (Tailwind 애니메이션 대체 연동) */}
      <div className="w-full bg-blue-950/40 border-b border-blue-900/40 py-1.5 overflow-hidden sticky top-[60px] z-[55] backdrop-blur-md notranslate" translate="no">
        <div className="flex whitespace-nowrap gap-12 text-[11px] font-bold text-blue-300/90 tracking-wide compliance-marquee">
          {/* 무한 루프 롤링 구현 레이아웃 */}
          <div className="flex gap-12 shrink-0 justify-around min-w-full">
            {PI_STATS.map((stat, idx) => (
              <span key={`stat-1-${idx}`}>{stat}</span>
            ))}
          </div>
          <div className="flex gap-12 shrink-0 justify-around min-w-full">
            {PI_STATS.map((stat, idx) => (
              <span key={`stat-2-${idx}`}>{stat}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 카테고리 가로 스크롤 탭 바 */}
      <div className="sticky top-[88px] z-50 bg-[#0f172a]/95 backdrop-blur-sm">
        <CategoryTabs 
          selectedCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
      </div>

      {/* 4. 메인 뉴스 피드 리스트 */}
      <div className="max-w-3xl mx-auto px-4 transition-opacity duration-300 mt-4">
        <NewsFeed selectedCategory={activeCategory} />
      </div>

      {/* 빌드 에러를 일으키던 <style jsx> 태그를 제거하고 안전한 표준 인라인 인젝션으로 대체 */}
      <span dangerouslySetInnerHTML={{ __html: `
        <style>
          @keyframes gpnrMarquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
          }
          .compliance-marquee {
            animation: gpnrMarquee 35s linear infinite !important;
          }
          .compliance-marquee:active, .compliance-marquee:hover {
            animation-play-state: paused !important;
          }
        </style>
      `}} />
    </main>
  );
}
