"use client";

import { useState } from "react";
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

// 선택 가능한 언어 (기능 중심)
const languages = [
  { code: "en", name: "English" },
  { code: "ko", name: "Korean (Auto-Translate)" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false); 
  const [currentLang, setCurrentLang] = useState(languages[0]); // 기본은 영어
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold tracking-tight">GPNR</span>
          </Link>

          {/* Desktop Navigation - 영문 이름 유지 */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            
            {/* 언어 선택 드롭다운 (번역 트리거) */}
            <div className="relative mr-1">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 h-9 px-2.5 rounded-md hover:bg-secondary transition-colors text-xs font-semibold border border-transparent hover:border-border"
              >
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="hidden sm:inline uppercase">{currentLang.code}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform text-muted-foreground", isLangOpen && "rotate-180")} />
              </button>

              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setIsLangOpen(false)} />
                  <div className="absolute right-0 mt-2 w-44 bg-popover border border-border rounded-md shadow-lg z-[60] py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang);
                          setIsLangOpen(false);
                          // 로컬 스토리지 등에 저장하여 기사 컴포넌트가 이를 감지하게 함
                          localStorage.setItem("gpnr-language", lang.code);
                          window.dispatchEvent(new Event("languageChange"));
                        }}
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

            <button className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-secondary transition-colors">
              <Search className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
    </header>
  );
}
