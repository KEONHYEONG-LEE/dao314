"use client";

import React, { useState, useEffect } from "react";
import { Globe, ChevronUp } from "lucide-react";

export function FloatingLanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("ko");

  useEffect(() => {
    // 구글 번역 바 숨기기 및 레이아웃 고정
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame, .skiptranslate, #goog-gt-tt { 
        display: none !important; 
      }
      body { top: 0 !important; position: static !important; }
    `;
    document.head.appendChild(style);

    // 최초 로드 시 한국어 적용 시도
    const timer = setTimeout(() => {
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (combo) {
        combo.value = "ko";
        combo.dispatchEvent(new Event("change"));
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event("change"));
      setCurrentLang(langCode);
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-5 z-[9999] flex flex-col items-end">
      {isOpen && (
        <div className="mb-2 w-32 overflow-hidden rounded-xl border border-white/10 bg-slate-900/90 p-1 shadow-2xl backdrop-blur-md">
          {['en', 'ko'].map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`w-full rounded-lg px-4 py-2 text-left text-sm font-semibold transition-colors ${
                currentLang === lang ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {lang === 'ko' ? '한국어' : 'English'}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-transform active:scale-95"
      >
        <Globe size={18} />
        <span>언어</span>
        <ChevronUp size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
