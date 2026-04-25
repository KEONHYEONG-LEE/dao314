"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Globe, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import PiLogin from "./PiLogin"; 

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // 구글 번역 초기화 로직 (유지하되, 화면에는 절대 나타나지 않도록 처리)
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
        autoDisplay: false // 자동 표시 방지
      }, 'google_translate_element');
    };
    addScript();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      {/* 1. 구글 번역용 엘리먼트를 완전히 숨김 처리하여 상단 한 줄(google 단어 줄) 제거 */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      
      <div className="mx-auto max-w-7xl px-3">
        {/* 이미지에서 헤더가 2줄로 보였던 것은 <PiLogin /> 내부와 
           이곳의 구조가 겹쳤기 때문일 수 있습니다. 
           최대한 간결하게 한 줄(h-16)로 유지합니다.
        */}
        <div className="flex h-16 items-center justify-between">
          
          {/* [좌측] 로고 영역 */}
          <Link href="/" className="flex items-center gap-1 min-w-fit">
            <Globe className="h-6 w-6 text-blue-600" />
            <span className="text-base font-extrabold hidden xs:block">GPNR</span>
          </Link>

          {/* [우측] 액션 버튼 그룹 */}
          <div className="flex items-center gap-1 ml-auto">
            
            {/* 1. 번역 + 후원 + 로그인 (PiLogin 컴포넌트) */}
            <PiLogin />

            {/* 2. 테마 토글 */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              className="h-9 w-9 ml-1 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* 3. 모바일 메뉴 버튼 */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-md"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>
        </div>
      </div>
      
      {/* 모바일 메뉴 펼침 영역 */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-2">
          {/* 필요한 경우 여기에 메뉴 항목 추가 */}
        </div>
      )}
    </header>
  );
}
