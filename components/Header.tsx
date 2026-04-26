"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react"; // 아이콘 라이브러리 사용 가정
import PiLogin from "./PiLogin"; 
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 하이드레이션 오류 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-[60] w-full bg-background/80 border-b border-border backdrop-blur-xl transition-colors">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-[60px] items-center justify-between">
          {/* 로고 영역 */}
          <div className="flex items-center gap-2">
            <span className="text-foreground font-black text-2xl tracking-tighter">GPNR</span>
            <span className="hidden sm:block text-[10px] text-muted-foreground uppercase tracking-widest ml-2">Global Pi Newsroom</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* 테마 선택 토글 버튼 (White/Black) */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </button>

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
