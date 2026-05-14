"use client";

import React, { useState, useEffect } from "react";
import { Globe, ChevronUp } from "lucide-react";

export function FloatingLanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("ko");

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame, .skiptranslate, #goog-gt-tt { display: none !important; }
      body { top: 0 !important; position: static !important; }
    `;
    document.head.appendChild(style);

    // 쿠키를 확인해서 현재 언어 상태를 유지합니다.
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const googTrans = getCookie('googtrans');
    if (googTrans?.includes('/en/ko')) {
      setCurrentLang("ko");
    } else {
      setCurrentLang("en");
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    if (langCode === 'en') {
      // 1. 영어 선택 시: 번역 쿠키를 삭제하고 페이지를 새로고침하여 원본(영어)을 보여줍니다.
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
      window.location.reload(); 
    } else {
      // 2. 한국어 선택 시: 구글 번역 기능을 실행합니다.
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (combo) {
        combo.value = langCode;
        combo.dispatchEvent(new Event("change"));
        setCurrentLang(langCode);
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-5 z-[9999] flex flex-col items-end">
      {isOpen && (
        <div className="mb-2 w-32 overflow-hidden rounded-xl border border-white/10 bg-slate-900/90 p-1 shadow-2xl backdrop-blur-md">
          {[
            { code: 'en', label: 'English' },
            { code: 'ko', label: '한국어' }
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full rounded-lg px-4 py-2 text-left text-sm font-semibold transition-colors ${
                currentLang === lang.code ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-transform active:scale-95"
      >
        <Globe size={18} />
        <span>{currentLang === 'ko' ? '한국어' : 'English'}</span>
        <ChevronUp size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
