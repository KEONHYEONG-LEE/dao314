"use client";

import PiLogin from "./PiLogin"; 
import { useState, useEffect } from "react";

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
            
            {/* 로고 (구글 번역 오염 원천 차단 속성 추가) */}
            <div className="flex items-center gap-2">
              <span 
                translate="no" 
                className="notranslate font-black text-2xl tracking-tighter text-purple-500 drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)]"
              >
                GPNR
              </span>
              <span 
                translate="no"
                className="notranslate hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest ml-2"
              >
                Global Pi Newsroom
              </span>
            </div>
            
            {/* 우측 아이콘 메뉴 및 로그인 */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                className={`p-2 rounded-xl text-lg font-bold transition-all ${
                  isLauncherOpen ? 'bg-slate-800 text-purple-400' : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <span className="block w-5 h-5 text-center leading-none">⋮⋮⋮</span>
              </button>
              <PiLogin />
            </div>

          </div>
        </div>
      </header>
    </>
  );
}
