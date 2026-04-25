"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, Globe, Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Politics", href: "/politics" },
  { name: "Economy", href: "/economy" },
  { name: "Tech", href: "/tech" },
  { name: "Sports", href: "/sports" },
  { name: "Culture", href: "/culture" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "ko", name: "Korean" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false); 
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const { theme, setTheme } = useTheme();

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
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'ko,en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
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
      {/* 번역 위젯은 레이아웃에 영향을 주지 않도록 절대 좌표로 숨김 */}
      <div id="google_translate_element" className="absolute opacity-0 pointer-events-none"></div>
      
      <style jsx global>{`
        .goog-te-banner-frame.skiptranslate, .goog-te-gadget-icon { display: none !important; }
        body { top: 0px !important; }
        .goog-tooltip { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; border: none !important; }
      `}</style>

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold tracking-tight">GPNR</span>
          </Link>

          {/* Actions - 순서 조정: 언어 선택 -> Support -> Login */}
          <div className="flex items-center gap-3">
            
            {/* 1. 언어 선택 드롭다운 (Support 좌측 배치) */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 h-9 px-2 rounded-md hover:bg-secondary transition-colors text-xs font-semibold border border-border"
              >
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="uppercase">{currentLang.code}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", isLangOpen && "rotate-180")} />
              </button>

              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setIsLangOpen(false)} />
                  <div className="absolute right-0 mt-2 w-32 bg-popover border border-border rounded-md shadow-lg z-[60] py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang)}
                        className={cn(
                          "w-full text-left px-3 py-2 text-xs hover:bg-accent transition-colors",
                          currentLang.code === lang.code ? "font-bold text-blue-600" : "text-foreground"
                        )}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* 2. Support 버튼 */}
            <button className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-md text-xs font-bold hover:bg-orange-600 transition-colors">
              Support <span className="text-[10px]">0.001π</span>
            </button>

            {/* 3. 기타 아이콘들 */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden h-9 w-9 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
