"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, Globe, Moon, Sun, ChevronDown, User } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", name: "English" },
  { code: "ko", name: "Korean" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 (실제 로직에 연결 필요)
  const { theme, setTheme } = useTheme();

  // 구글 번역 초기화 로직 (유지)
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }
    };
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en', includedLanguages: 'ko,en', autoDisplay: false
      }, 'google_translate_element');
    };
    addGoogleTranslateScript();
  }, []);

  const handleLanguageChange = (lang: typeof languages[0]) => {
    setCurrentLang(lang);
    setIsLangOpen(false);
    const translateCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (translateCombo) {
      translateCombo.value = lang.code;
      translateCombo.dispatchEvent(new Event('change'));
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div id="google_translate_element" className="hidden"></div>
      <style jsx global>{`
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        body { top: 0px !important; }
      `}</style>

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Globe className="h-7 w-7 text-blue-600" />
            <span className="text-lg font-bold tracking-tight">GPNR</span>
          </Link>

          {/* Actions 영역 */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* 3. 번역 아이콘 (Support 좌측) */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center justify-center h-9 w-10 rounded-md border border-border bg-secondary/30 hover:bg-secondary transition-colors"
              >
                <Globe className="h-4 w-4" />
                <ChevronDown className="h-3 w-3 opacity-50" />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-popover border border-border rounded-md shadow-xl z-50 py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-accent"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Support 버튼 (2단 구성) */}
            <button className="flex flex-col items-center justify-center px-2 h-9 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors leading-tight">
              <span className="text-[9px] font-bold">Support</span>
              <span className="text-[10px] font-black underline decoration-white/50">0.001π</span>
            </button>

            {/* 1. 로그인 아이콘 (인디케이터 포함, 아이디 제거) */}
            <div className="relative flex items-center justify-center h-9 w-9 bg-secondary/50 rounded-md border border-border">
              <User className="h-5 w-5 text-muted-foreground" />
              {/* 상태 표시 불빛 */}
              <span className={cn(
                "absolute top-1.5 right-1.5 h-2 w-2 rounded-full border border-background",
                isLoggedIn ? "bg-green-500" : "bg-gray-400"
              )} />
            </div>

            {/* 테마 및 메뉴 */}
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
    </header>
  );
}
