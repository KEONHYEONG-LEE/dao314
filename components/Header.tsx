"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Globe, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import PiLogin from "./PiLogin"; 

const languages = [{ code: "en", name: "EN" }, { code: "ko", name: "KO" }];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
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

  const handleLanguageChange = (lang: typeof languages[0]) => {
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) { 
      combo.value = lang.code; 
      combo.dispatchEvent(new Event('change')); 
    }
    setIsLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div id="google_translate_element" className="hidden invisible"></div>
      
      <div className="mx-auto max-w-7xl px-3">
        <div className="flex h-16 items-center justify-between">
          
          {/* [좌측] 로고 영역 */}
          <Link href="/" className="flex items-center gap-1 min-w-fit">
            <Globe className="h-6 w-6 text-blue-600" />
            <span className="text-base font-extrabold hidden xs:block">GPNR</span>
          </Link>

          {/* [우측] 액션 버튼 그룹 */}
          <div className="flex items-center gap-1.5 ml-auto">
            
            {/* ★★★ 번역 아이콘 (여기가 핵심) ★★★ */}
            <div className="relative z-[70]">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center justify-center h-9 w-9 min-w-[36px] rounded-md border-2 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all"
                aria-label="Language Switcher"
              >
                <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-20 bg-popover border border-border rounded-md shadow-2xl py-1 animate-in fade-in zoom-in duration-200">
                  {languages.map((lang) => (
                    <button 
                      key={lang.code} 
                      onClick={() => handleLanguageChange(lang)} 
                      className="w-full text-center px-2 py-2.5 text-[11px] font-black hover:bg-accent border-b border-border last:border-0"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PiLogin 컴포넌트 (Support + 로그인 아이콘) */}
            <PiLogin />

            {/* 테마 토글 */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              className="h-9 w-9 flex items-center justify-center rounded-md border border-border hover:bg-secondary transition-colors"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* 모바일 메뉴 (필요시) */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden h-9 w-9 flex items-center justify-center rounded-md border border-border">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
