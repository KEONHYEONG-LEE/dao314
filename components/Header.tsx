"use client";

import PiLogin from "./PiLogin"; 
import { useState, useEffect } from "react";
import { NEWS_CATEGORIES } from "@/lib/categories";

interface HeaderProps {
  currentCategory?: string;                     
  onCategoryChange?: (categoryId: string) => void; 
}

export function Header({ 
  currentCategory = "all", 
  onCategoryChange
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false); 

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // [수정] NEWS_CATEGORIES 배열에서 달력(calendar) 항목 필터링 제거
  const filteredCategories = NEWS_CATEGORIES.filter(
    (category) => category.id !== "calendar" && category.id !== "events"
  );

  return (
    <>
      {/* 본체 헤더 영역 (레이아웃 겹침 방지 및 z-index 최적화) */}
      <header className="sticky top-0 z-[60] w-full bg-[#0f172a]/90 border-b border-slate-800 backdrop-blur-xl transition-colors">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-[60px] items-center justify-between">
            {/* 로고 */}
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-2xl tracking-tighter">GPNR</span>
              <span className="hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest ml-2">
                Global Pi Newsroom
              </span>
            </div>
            
            {/* 우측 아이콘 메뉴 */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                className={`p-2 rounded-xl text-2xl font-bold transition-all ${isLauncherOpen ? 'bg-slate-800 text-[#deff9a]' : 'text-slate-300 hover:bg-slate-800/60'}`}
              >
                ⣿
              </button>

              <div className="flex items-center">
                <PiLogin />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 9개 점 (Grid Launcher) 메뉴 */}
      {isLauncherOpen && (
        <div className="fixed top-[65px] right-4 z-[70] w-[320px] max-h-[80vh] overflow-y-auto bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            {filteredCategories.map((category) => {
              const isSelected = currentCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    if (onCategoryChange) {
                      onCategoryChange(category.id);
                    } else {
                      window.location.href = `/?category=${category.id}`;
                    }
                    setIsLauncherOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all group ${isSelected ? 'bg-slate-800 border-slate-600 font-bold' : 'bg-slate-800/40 border-transparent hover:bg-slate-800 hover:border-slate-700'}`}
                >
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{category.icon}</span>
                  <span className="text-[11px] text-slate-300 text-center font-medium truncate w-full">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
