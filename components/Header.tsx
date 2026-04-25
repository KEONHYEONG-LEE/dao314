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
    
    // @ts-ignore
    window.googleTranslateElementInit = () => {
      // @ts-ignore
      new window.google.translate.TranslateElement({ 
        pageLanguage: 'en', 
        includedLanguages: 'ko,en', 
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE, // 레이아웃 단순화
        autoDisplay: false 
      }, 'google_translate_element');
    };
    addScript();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur notranslate">
      
      {/* 구글 번역 엘리먼트가 화면에 절대 나타나지 않도록 처리 */}
      <div id="google_translate_element" style={{ visibility: 'hidden', width: 0, height: 0, position: 'absolute' }}></div>
      
      <div className="mx-auto max-w-7xl px-3">
        <div className="flex h-[56px] items-center justify-between">
          
          {/* [좌측] 로고 영역: 중복을 피하기 위해 텍스트 위주로 간결하게 설정 */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1 rounded-lg">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tighter">GPNR</span>
          </Link>

          {/* [우측] 액션 버튼 그룹 */}
          <div className="flex items-center gap-1">
            
            {/* PiLogin 컴포넌트: 언어 선택, 지원, 로그인 버튼이 들어있음 */}
            <PiLogin />

            {/* 테마 토글 버튼 (선택 사항: 아이콘이 많아 보이면 이 부분을 제거해도 좋습니다) */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* 모바일 메뉴 (필요 시) */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden h-8 w-8 flex items-center justify-center rounded-md ml-1"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
