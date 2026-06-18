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
    // 최상단 빈 태그(<></>) 대신 notranslate 클래스를 가진 div로 전체를 감싸서, 
    // 나중에 이 내부에 추가될 어떤 메뉴나 하위 컴포넌트(PiLogin 등)도 구글 번역이 건드리지 못하게 원천 차단합니다.
    <div className="notranslate" translate="no">
      {/* 본체 헤더 영역 */}
      <header className="sticky top-0 z-[60] w-full bg-[#0f172a]/90 border-b border-slate-800 backdrop-blur-xl transition-colors">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-[60px] items-center justify-between">
            
            {/* 로고 영역 */}
            <div className="flex items-center gap-2">
              <span 
                className="font-black text-2xl tracking-tighter text-purple-500 drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)]"
              >
                GPNR
              </span>
              <span 
                className="hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest ml-2"
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
    </div>
  );
}
