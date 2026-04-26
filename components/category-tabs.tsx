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

  useEffect(() => {
    handleScroll();
    // 창 크기 조절 시 화살표 상태 업데이트
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    <div className="sticky top-[60px] z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto max-w-7xl px-2 relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-slate-800/90 border border-slate-700 rounded-full shadow-xl hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
        )} 

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-2 py-4 px-2 overflow-x-auto no-scrollbar notranslate"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30"
                  : "bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div> 

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-slate-800/90 border border-slate-700 rounded-full shadow-xl hover:bg-slate-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
