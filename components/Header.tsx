"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Globe, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import PiLogin from "./PiLogin"; 

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const addScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const s = document.createElement("script");
        s.id = "google-translate-script";
        s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        s.async = true;
        document.body.appendChild(s);
      }
    };
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({ 
        pageLanguage: 'en', 
        includedLanguages: 'ko,en', 
        autoDisplay: false 
      }, 'google_translate_element');
    };
    addScript();
  }, []);

  return (
    // 1. 상단에 불필요한 공간이 생기지 않도록 header의 위치를 엄격히 고정
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      
      {/* 2. 구글 번역 엘리먼트가 공간을 차지하지 않도록 완전히 숨김 (중요) */}
      <div id="google_translate_element" style={{ display: 'none', position: 'absolute', top: '-9999px' }}></div>
      
      {/* 3. '두번째, 세번째 줄'처럼 보이는 중복 요소를 제거하기 위해 내부 구조를 딱 한 줄(h-16)로 제한 */}
      <div className="mx-auto max-w-7xl px-3">
        <div className="flex h-16 items-center justify-between">
          
          {/* [좌측] 로고 영역 */}
          <Link href="/" className="flex items-center gap-1 min-w-fit">
            <Globe className="h-6 w-6 text-blue-600" />
            <span className="text-base font-extrabold hidden xs:block">GPNR</span>
          </Link>

          {/* [우측] 액션 버튼 그룹 */}
          <div className="flex items-center gap-1 ml-auto">
            
            {/* PiLogin 내부에 중복된 로고나 바가 있는지 확인이 필요합니다. 
                일단 현재 헤더에서는 딱 필요한 버튼들만 노출합니다. */}
            <PiLogin />

            {/* 테마 토글 */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              className="h-9 w-9 ml-1 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* 모바일 메뉴 */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-md"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
