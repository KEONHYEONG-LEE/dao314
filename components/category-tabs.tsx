"use client"; 

import { useState, useRef, useEffect } from "react";
// 아이콘 로딩 에러 방지를 위해 기본 텍스트 화살표로 대체하거나 최적화
import { ChevronLeft, ChevronRight } from "lucide-react"; 

const categories = [
  { id: "all", label: "All" },
  { id: "mainnet", label: "Mainnet" },
  { id: "community", label: "Global Community" },
  { id: "commerce", label: "Commerce" },
  { id: "social", label: "Social" },
  { id: "education", label: "Education" },
  { id: "health", label: "Health" },
  { id: "travel", label: "Travel" },
  { id: "utilities", label: "Utilities" },
  { id: "career", label: "Career" },
  { id: "entertainment", label: "Entertainment" },
  { id: "games", label: "Games" },
  { id: "finance", label: "Finance" },
  { id: "music", label: "Music" },
  { id: "sports", label: "Sports" },
  { id: "defi", label: "DeFi" },
  { id: "dapp", label: "dApp" },
  { id: "nft", label: "NFT" },
]; 

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
} 

export function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true); 

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }; 

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 150;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }; 

  return (
    // Pi Browser 호환성을 위해 sticky와 blur 제거, 단순 배경색 적용
    <div className="z-40 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-2 relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 text-black" />
          </button>
        )} 

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-2 py-3 overflow-x-auto scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }} // 모바일 스크롤 부드럽게
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div> 

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-sm"
          >
            <ChevronRight className="w-4 h-4 text-black" />
          </button>
        )}
      </div>
    </div>
  );
}
