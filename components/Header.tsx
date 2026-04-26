"use client";

import PiLogin from "./PiLogin"; 
import { useEffect, useState } from "react";

export function Header() {
  const [mounted, setMounted] = useState(false);

  // 하이드레이션 오류 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-[60] w-full bg-[#0f172a]/80 border-b border-slate-800 backdrop-blur-xl transition-colors">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-[60px] items-center justify-between">
          {/* 로고 영역 */}
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-2xl tracking-tighter">GPNR</span>
            <span className="hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest ml-2">
              Global Pi Newsroom
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* 테마 선택 토글 버튼 삭제 (다크 모드 고정) */}

            {/* 로그인 영역 */}
            <div className="flex items-center">
              <PiLogin />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
