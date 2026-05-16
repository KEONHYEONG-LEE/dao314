"use client";

import { useState, useRef, useEffect } from "react";
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

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // [개선] 실시간 가장 핫한 소식을 담을 스테이트 (초기에는 멋진 기본 문구를 보여줌)
  const [tickerStats, setTickerStats] = useState<string[]>([
    "🔥 실시간 글로벌 파이 뉴스룸 헤드라인 동기화 중...",
    "🖥️ 글로벌 활성 노드 및 KYC 마이그레이션 모니터링 가동"
  ]);

  // --- [신규] 실시간 가장 핫한 소식(주요 뉴스) API 자동 연동 로직 ---
  useEffect(() => {
    const loadHotNewsForTicker = async () => {
      try {
        // 실시간 가장 핫한 '주요뉴스(all)' 카테고리의 최신 데이터를 호출
        const response = await fetch("/api/fetch-news?category=all");
        const allNews = await response.json();
        
        if (allNews && allNews.length > 0) {
          // 뉴스 본문 HTML 태그 정제용 임시 함수
          const cleanText = (text: string) => text.replace(/<\/?[^>]+(>|$)/g, "").trim();
          
          // 상위 가장 최신 뉴스 5개의 제목 추출 후 전광판 포맷으로 가공
          const hotHeadlines = allNews.slice(0, 5).map((item: any, idx: number) => {
            return `🔥 [HOT ISSUE ${idx + 1}] ${cleanText(item.title)}`;
          });
          
          setTickerStats(hotHeadlines);
        }
      } catch (error) {
        console.error("전광판 실시간 뉴스 연동 실패:", error);
      }
    };

    loadHotNewsForTicker();
    
    // 10분마다 자동으로 실시간 가장 핫한 뉴스 다시 갱신 (백그라운드 실시간 동기화)
    const interval = setInterval(loadHotNewsForTicker, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // --- 스와이프 로직 ---
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

      {/* 2. [디자인 리뉴얼] 세련되고 시인성 높은 사이버 펑크 스타일 전광판 */}
      <div 
        className="w-full bg-gradient-to-r from-slate-950 via-[#131c31] to-slate-950 border-b border-amber-500/20 py-2.5 overflow-hidden sticky top-[60px] z-[55] backdrop-blur-md shadow-lg shadow-black/40 notranslate" 
        translate="no"
      >
        <div className="flex whitespace-nowrap gap-16 text-[12px] font-semibold text-amber-400 tracking-wider compliance-marquee">
          {/* 무한 루프 롤링 레이아웃 */}
          <div className="flex gap-16 shrink-0 justify-around min-w-full">
            {tickerStats.map((stat, idx) => (
              <span key={`stat-1-${idx}`} className="hover:text-white transition-colors">{stat}</span>
            ))}
          </div>
          <div className="flex gap-16 shrink-0 justify-around min-w-full">
            {tickerStats.map((stat, idx) => (
              <span key={`stat-2-${idx}`} className="hover:text-white transition-colors">{stat}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 카테고리 가로 스크롤 탭 바 */}
      <div className="sticky top-[92px] z-50 bg-[#0f172a]/95 backdrop-blur-sm">
        <CategoryTabs 
          selectedCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
      </div>

      {/* 4. 메인 뉴스 피드 리스트 */}
      <div className="max-w-3xl mx-auto px-4 transition-opacity duration-300 mt-4">
        <NewsFeed selectedCategory={activeCategory} />
      </div>

      {/* 전광판 애니메이션 주입 */}
      <span dangerouslySetInnerHTML={{ __html: `
        <style>
          @keyframes gpnrMarquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
          }
          .compliance-marquee {
            animation: gpnrMarquee 40s linear infinite !important;
          }
          .compliance-marquee:active, .compliance-marquee:hover {
            animation-play-state: paused !important;
          }
        </style>
      `}} />
    </main>
  );
}
