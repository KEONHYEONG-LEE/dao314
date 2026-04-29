"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 사용자 요청에 따른 18개 카테고리 한글화 적용
const categories = [
  { id: "all", label: "주요이슈" },
  { id: "mainnet", label: "메인넷" },
  { id: "community", label: "커뮤니티" },
  { id: "commerce", label: "커머스" },
  { id: "node", label: "노드" },
  { id: "mining", label: "채굴" },
  { id: "wallet", label: "지갑" },
  { id: "browser", label: "브라우저" },
  { id: "kyc", label: "KYC" },
  { id: "developer", label: "개발자" },
  { id: "ecosystem", label: "생태계" },
  { id: "listing", label: "전망시세" },
  { id: "price", label: "가격" },
  { id: "security", label: "보안" },
  { id: "event", label: "주요행사" },
  { id: "roadmap", label: "로드맵" },
  { id: "whitepaper", label: "백서" },
  { id: "legal", label: "관련법규" }
];

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // 스크롤 감지 및 화살표 표시 제어
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // 화살표 클릭 시 스크롤 이동
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 240;
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
    <div className="sticky top-[56px] z-40 bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/[0.05] shadow-2xl">
      <div className="mx-auto max-w-7xl relative px-2">
        
        {/* 왼쪽 화살표 및 그라데이션 커버 */}
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-14 z-10 flex items-center justify-start bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none">
            <button
              onClick={() => scroll("left")}
              className="pointer-events-auto ml-1 w-7 h-7 flex items-center justify-center bg-slate-800/90 border border-slate-700/50 rounded-full text-white shadow-xl hover:bg-slate-700 transition-all active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 카테고리 버튼 컨테이너 */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-1.5 py-3.5 px-1 overflow-x-auto no-scrollbar scroll-smooth scrollbar-hide"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-tighter whitespace-nowrap transition-all duration-300 border ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white border-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                  : "bg-slate-800/40 text-slate-400 border-white/[0.05] hover:border-slate-600 hover:text-slate-200 hover:bg-slate-800/80"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* 오른쪽 화살표 및 그라데이션 커버 */}
        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-14 z-10 flex items-center justify-end bg-gradient-to-l from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none">
            <button
              onClick={() => scroll("right")}
              className="pointer-events-auto mr-1 w-7 h-7 flex items-center justify-center bg-slate-800/90 border border-slate-700/50 rounded-full text-white shadow-xl hover:bg-slate-700 transition-all active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
