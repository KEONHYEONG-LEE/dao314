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

  return (
    <>
      {/* 본체 헤더 영역 (notranslate 추가로 로고 직역 방지) */}
      <header className="sticky top-0 z-[60] w-full bg-[#0f172a]/90 border-b border-slate-800 backdrop-blur-xl transition-colors notranslate">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-[60px] items-center justify-between">
            {/* 로고 (선명하고 밝은 파이 보라색 그라데이션 적용) */}
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tighter bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(168,85,247,0.55)]">
                GPNR
              </span>
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
        <div className="fixed top-[65px] right-4 z-[70] w-[320px] max-h-
