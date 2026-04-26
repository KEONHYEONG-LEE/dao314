"use client";

import PiLogin from "./PiLogin"; 

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f172a] border-b border-white/5 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-[60px] items-center justify-between">
          {/* 좌측 로고: 자간과 폰트 강조로 세련미 추가 */}
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-2xl tracking-tight italic">GPNR</span>
            <div className="h-4 w-[1px] bg-white/20 mx-1"></div>
            <span className="text-gray-400 text-[10px] uppercase tracking-widest font-medium hidden sm:block">
              Global Pi Newsroom
            </span>
          </div>
          
          {/* 우측 로그인 영역 */}
          <div className="flex items-center">
            <PiLogin />
          </div>
        </div>
      </div>
    </header>
  );
}
