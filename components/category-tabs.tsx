"use client"; 

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; 

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
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }; 

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }; 

  return (
    /* bg-slate-900로 변경하여 메인 배경과 통일, 상단 고정 */
    <div className="sticky top-0 z-40 bg-[#0f172a] border-b border-white/5">
      <div className="mx-auto max-w-7xl px-2 relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center bg-slate-800/80 border border-white/10 rounded-full backdrop-blur-md"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
        )} 

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-2 py-3 px-2 overflow-x-auto no-scrollbar notranslate"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-900/20"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div> 

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center bg-slate-800/80 border border-white/10 rounded-full backdrop-blur-md"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
