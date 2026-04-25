"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Globe, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import PiLogin from "./PiLogin"; 

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // 구글 번역 초기화 로직 (유지)
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      {/* 구글 번역용 숨김 엘리먼트 */}
      <div id="google_translate_element" className="hidden invisible"></div>
      
      <div className="mx-auto max-w-7xl px-3">
        <div className="flex h-16 items-center justify-between">
          
          {/* [좌측] 로고 영역 */}
          <Link href="/" className="flex items-center gap-1 min-w-fit">
            <Globe className="h-6 w-6 text-blue-600" />
            <span className="text-base font-extrabold hidden xs:block">GPNR</span>
          </Link>

          {/* [우측] 액션 버튼 그룹 */}
          <div className="flex items-center gap-1 ml-auto">
            
            {/* 1. 번역 + 후원 + 로그인 뭉치 (PiLogin.tsx에서 한꺼번에 처리) */}
            <PiLogin />

            {/* 2. 테마 토글 */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              className="h-9 w-9 ml-1 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* 3. 모바일 메뉴 (md 사이즈 미만에서만 표시) */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-md"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>
        </div>
      </div>
      
      {/* 모바일 메뉴 펼침 영역 (필요시) */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-2">
          {/* 메뉴 내용 추가 가능 */}
        </div>
      )}
    </header>
  );
}
