"use client";

import React, { useState, useRef, useEffect } from "react";
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
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 280;
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
        
        {/* Left Side Shadow & Arrow */}
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 flex items-center justify-start bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none">
            <button
              onClick={() => scroll("left")}
              className="pointer-events-auto ml-2 w-8 h-8 flex items-center justify-center bg-slate-800/90 border border-slate-700/50 rounded-full text-white shadow-xl hover:bg-slate-700 transition-all active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Categories Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-2 py-4 px-1 overflow-x-auto no-scrollbar scroll-smooth scrollbar-hide"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-5 py-2 rounded-full text-[11px] font-black tracking-widest whitespace-nowrap transition-all duration-300 border uppercase ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  : "bg-slate-800/40 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Right Side Shadow & Arrow */}
        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 flex items-center justify-end bg-gradient-to-l from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none">
            <button
              onClick={() => scroll("right")}
              className="pointer-events-auto mr-2 w-8 h-8 flex items-center justify-center bg-slate-800/90 border border-slate-700/50 rounded-full text-white shadow-xl hover:bg-slate-700 transition-all active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
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
