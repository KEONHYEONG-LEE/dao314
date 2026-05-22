"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "../components/Header"; 
import { CategoryTabs } from "../components/category-tabs";
import NewsFeed from "../components/news-feed";

// [수정] "poll" 카테고리를 두 번째 자리에 명시적으로 추가 (총 18개 카테고리 스키마)
const CATEGORIES = [
  "all", "poll", "mainnet", "node", "mining", "wallet", "browser", 
  "roadmap", "whitepaper", "community", "commerce", "kyc", 
  "developer", "ecosystem", "outlook", "price", "security", 
  "legal"
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // 한국어 버전 전광판 기본 메시지 세팅
  const [tickerStats, setTickerStats] = useState<string[]>([
    "📢 실시간 글로벌 파이 뉴스룸 핫이슈 동기화 중입니다...",
    "📢 최신 생태계 핵심 소식 및 마이그레이션 모니터링 가동"
  ]);

  // --- 실시간 핫이슈 소식 API 자동 연동 로직 ---
  useEffect(() => {
    const loadHotNewsForTicker = async () => {
      try {
        const response = await fetch("/api/fetch-news?category=all");
        const allNews = await response.json();
        
        if (allNews && allNews.length > 0) {
          const cleanText = (text: string) => text.replace(/<\/?[^>]+(>|$)/g, "").trim();
          
          // 100% 우리말 포맷으로 헤드라인 넘버링 구성
          const hotHeadlines = allNews.slice(0, 5).map((item: any, idx: number) => {
            return `🔥 [실시간 핫이슈 ${idx + 1}] ${cleanText(item.title)}`;
          });
          
          setTickerStats(hotHeadlines);
        }
      } catch (error) {
        console.error("전광판 실시간 뉴스 연동 실패:", error);
      }
    };

    loadHotNewsForTicker();
    
    // 10분마다 데이터 자동 리로드
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

      {/* 2. 눈에 확 띄는 화이트 계열 백라이트 스타일 전광판 */}
      <div 
        className="w-full bg-gradient-to-r from-slate-100 via-white to-slate-100 border-b border-slate-300 py-2.5 overflow-hidden sticky top-[60px] z-[55] shadow-md shadow-black/20"
      >
        <div className="flex whitespace-nowrap gap-16 text-[12px] font-bold text-slate-900 tracking-wide compliance-marquee">
          {/* 무한 루프 롤링 레이아웃 */}
          <div className="flex gap-16 shrink-0 justify-around min-w-full">
            {tickerStats.map((stat, idx) => (
              <span key={`stat-1-${idx}`} className="hover:text-blue-600 transition-colors">{stat}</span>
            ))}
          </div>
          <div className="flex gap-16 shrink-0 justify-around min-w-full">
            {tickerStats.map((stat, idx) => (
              <span key={`stat-2-${idx}`} className="hover:text-blue-600 transition-colors">{stat}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 카테고리 가로 스크롤 탭 바 */}
      <div className="sticky top-[93px] z-50 bg-[#0f172a]/95 backdrop-blur-sm">
        <CategoryTabs 
          selectedCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
      </div>

      {/* 4. 메인 콘텐츠 영역 (NewsFeed 내부에서 activeCategory가 'poll'일 때 투표 UI를 띄워줌) */}
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
