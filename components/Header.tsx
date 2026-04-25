"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Globe, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import PiLogin from "./PiLogin"; // 수정된 PiLogin 컴포넌트 임포트

const languages = [{ code: "en", name: "EN" }, { code: "ko", name: "KO" }];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const { theme, setTheme } = useTheme();

  // 구글 번역 초기화 로직
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

  const handleLanguageChange = (lang: typeof languages[0]) => {
    setCurrentLang(lang);
    setIsLangOpen(false);
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) { 
      combo.value = lang.code; 
      combo.dispatchEvent(new Event('change')); 
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* 구글 번역용 숨김 엘리먼트 */}
      <div id="google_translate_element" className="hidden invisible"></div>
      
      <div className="mx-auto max-w-7xl px-2 sm:px-4">
        <div className="flex h-16 items-center justify-between gap-1">
          
          {/* 1. 로고 영역 */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-1">
            <Globe className="h-6 w-6 text-blue-600" />
            <span className="text-base font-bold hidden xs:block">GPNR</span>
          </Link>

          {/* 2. 우측 액션 그룹 (번역 + PiLogin + 테마) */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* [번역 버튼] - Support 버튼 좌측 배치 */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center justify-center h-9 w-9 rounded-md border border-border bg-secondary/30 hover:bg-secondary transition-colors"
              >
                <Globe className="h-4 w-4" />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-20 bg-popover border border-border rounded-md shadow-2xl z-50 py-1">
                  {languages.map((lang) => (
                    <button 
                      key={lang.code} 
                      onClick={() => handleLanguageChange(lang)} 
                      className="w-full text-center px-2 py-1.5 text-[10px] font-bold hover:bg-accent"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* [PiLogin 컴포넌트] - 이 안에 Support와 로그인 아이콘(불빛)이 다 들어있습니다 */}
            <PiLogin />

            {/* [테마 토글] */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              className="h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* [모바일 메뉴] */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-md hover:bg-secondary"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
