"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 18개 카테고리 (사용자님의 기획대로 유지)
const categories = [
  { id: "all", label: "ALL" },
  { id: "mainnet", label: "MAINNET" },
  { id: "community", label: "COMMUNITY" },
  { id: "commerce", label: "COMMERCE" },
  { id: "node", label: "NODE" },
  { id: "mining", label: "MINING" },
  { id: "wallet", label: "WALLET" },
  { id: "browser", label: "BROWSER" },
  { id: "kyc", label: "KYC" },
  { id: "developer", label: "DEVELOPER" },
  { id: "ecosystem", label: "ECOSYSTEM" },
  { id: "listing", label: "LISTING" },
  { id: "price", label: "PRICE" },
  { id: "security", label: "SECURITY" },
  { id: "event", label: "EVENT" },
  { id: "roadmap", label: "ROADMAP" },
  { id: "whitepaper", label: "WHITEPAPER" },
  { id: "legal", label: "LEGAL" }
];

export function CategoryTabs({
  selectedCategory,
  onCategoryChange
}: {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    // 상단 고정 위치 및 다크 배경 최적화 (backdrop-blur 추가)
    <div className="sticky top-[56px] z-40 bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      <div className="mx-auto max-w-7xl relative px-1">
        
        {/* 왼쪽 화살표 - 그라데이션 마감 처리 */}
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-12 z-10 flex items-center justify-start bg-gradient-to-r from-[#0f172a] to-transparent pointer-events-none">
            <button
              onClick={() => scroll("left")}
              className="pointer-events-auto ml-1 w-7 h-7 flex items-center justify-center bg-slate-800/90 border border-slate-700 rounded-full text-white shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 카테고리 버튼 리스트 */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-1.5 py-3.5 px-2 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-black tracking-tighter whitespace-nowrap transition-all duration-200 border ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/40"
                  : "bg-slate-800/40 text-slate-500 border-slate-800/60 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* 오른쪽 화살표 - 그라데이션 마감 처리 */}
        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-12 z-10 flex items-center justify-end bg-gradient-to-l from-[#0f172a] to-transparent pointer-events-none">
            <button
              onClick={() => scroll("right")}
              className="pointer-events-auto mr-1 w-7 h-7 flex items-center justify-center bg-slate-800/90 border border-slate-700 rounded-full text-white shadow-lg
