"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Globe, Moon, Sun, ChevronDown, User } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", name: "EN" },
  { code: "ko", name: "KO" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 실제 연동 필요
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
    setCurrentLang(lang);
    setIsLangOpen(false);
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) { combo.value = lang.code; combo.dispatchEvent(new Event('change')); }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div id="google_translate_element" className="hidden"></div>
      
      <div className="mx-auto max-w-7xl px-3">
        <div className="flex h-16 items-center justify-between gap-1">
          
          {/* Logo - 공간 부족 시 글자 숨김 */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-1">
            <Globe className="h-7 w-7 text-blue-600" />
            <span className="text-lg font-bold tracking-tight hidden sm:block">GPNR</span>
          </Link>

          {/* 우측 정렬 영역 (아이콘 간격 최소화) */}
          <div className="flex items-center gap-1">
            
            {/* 1. 번역 버튼 (Support 좌측 배치) */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center justify-center h-9 w-9 rounded-md border border-border bg-secondary/30"
              >
                <Globe className="h-4 w-4" />
                <ChevronDown className={cn("h-3 w-3 transition-transform ml-0.5 opacity-50", isLangOpen && "rotate-180")} />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-popover border border-border rounded-md shadow-xl z-50 py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang)}
                      className="w-full text-center px-3 py-2 text-xs font-bold hover:bg-accent"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Support 버튼 (위아래 2단 구성, 폭 최소화) */}
            <button className="flex-shrink-0 flex flex-col items-center justify-center min-w-[58px] h-9 bg-orange-500 text-white rounded-md hover:bg-orange-600 leading-none">
              <span className="text-[8px] font-bold">Support</span>
              <span className="text-[10px] font-black underline decoration-white/20">0.001π</span>
            </button>

            {/* 3. 로그인 아이콘 (아이디 제거, 오직 아이콘과 상태 불빛만) */}
            <div className="relative flex-shrink-0 flex items-center justify-center h-9 w-9 bg-secondary/50 rounded-md border border-border">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className={cn(
                "absolute top-1.5 right-1.5 h-2 w-2 rounded-full border border-background shadow-sm",
                isLoggedIn ? "bg-green-500" : "bg-gray-400"
              )} />
            </div>

            {/* 테마 토글 및 모바일 메뉴 */}
            <div className="flex items-center gap-0.5 ml-0.5">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-secondary"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden h-9 w-9 flex items-center justify-center">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
