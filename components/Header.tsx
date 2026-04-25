"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Globe, Moon, Sun, ChevronDown, User } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const languages = [{ code: "en", name: "EN" }, { code: "ko", name: "KO" }];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 실제 로그인 상태 변수와 연동
  const { theme, setTheme } = useTheme();

  // 구글 번역 초기화
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
      new window.google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: 'ko,en', autoDisplay: false }, 'google_translate_element');
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
      
      <div className="mx-auto max-w-7xl px-2">
        <div className="flex h-16 items-center justify-between gap-1">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-1">
            <Globe className="h-6 w-6 text-blue-600" />
            <span className="text-base font-bold hidden xs:block">GPNR</span>
          </Link>

          {/* 우측 액션 영역 */}
          <div className="flex items-center gap-1.5">
            
            {/* 1. 번역 아이콘 (Support 좌측) */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center justify-center h-8 w-8 rounded-md border border-border bg-secondary/20"
              >
                <Globe className="h-4 w-4" />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-20 bg-popover border border-border rounded-md shadow-2xl z-50 py-1">
                  {languages.map((lang) => (
                    <button key={lang.code} onClick={() => handleLanguageChange(lang)} className="w-full text-center px-2 py-1.5 text-[10px] font-bold hover:bg-accent">{lang.name}</button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Support 버튼 (2단 배치, 폭 고정) */}
            <button className="flex-shrink-0 flex flex-col items-center justify-center w-[58px] h-8 bg-[#f6ad55] text-white rounded-md leading-none">
              <span className="text-[8px] font-bold uppercase">Support</span>
              <span className="text-[10px] font-black tracking-tighter">0.001π</span>
            </button>

            {/* 3. 로그인 상태 아이콘 (텍스트 강제 차단 버전) */}
            <div className="relative flex-shrink-0 flex items-center justify-center h-8 w-8 bg-slate-800 rounded-md border border-slate-700 overflow-hidden">
              {/* 외부에서 주입되는 텍스트가 있다면 보이지 않도록 내부 요소를 고정 */}
              <User className="h-4 w-4 text-white z-10" />
              
              {/* 상태 표시등: 오직 이 원의 색상으로만 구분 */}
              <span className={cn(
                "absolute top-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-slate-800 z-20",
                isLoggedIn ? "bg-green-500 shadow-[0_0_4px_#22c55e]" : "bg-gray-500"
              )} />

              {/* 만약 다른 곳에서 아이디를 넣으려 해도 절대 안 보이게 하는 가림막 */}
              <span className="absolute inset-0 bg-transparent text-[0px] leading-[0] opacity-0 pointer-events-none">Hide Text</span>
            </div>

            {/* 테마 토글 */}
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-md hover:bg-secondary">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* 모바일 메뉴 */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden h-8 w-8 flex-shrink-0 flex items-center justify-center">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
