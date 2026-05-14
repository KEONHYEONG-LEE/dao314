"use client";

import React, { useState, useEffect } from "react";
import { Globe, ChevronUp } from "lucide-react";

export function FloatingLanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("ko");

  useEffect(() => {
    // 1. 번역 UI 숨기기 스타일
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame, .skiptranslate, #goog-gt-tt, .goog-te-balloon-frame { 
        display: none !important; 
        visibility: hidden !important;
      }
      body { top: 0 !important; position: static !important; }
    `;
    document.head.appendChild(style);

    // 2. 현재 상태 확인 (쿠키 기반)
    const isKorean = document.cookie.includes('/en/ko');
    setCurrentLang(isKorean ? "ko" : "en");
  }, []);

  const handleLanguageChange = (langCode: string) => {
    if (langCode === 'en') {
      // [영어 선택 시]: 쿠키를 만료시키고, 구글 번역 매개변수를 제거한 상태로 페이지를 새로고침합니다.
      // 모바일 크롬에서 가장 확실하게 번역을 끄는 방법입니다.
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
      
      // URL 뒤에 강제로 파라미터를 붙여 브라우저가 새 페이지로 인식하게 합니다.
      const url = new URL(window.location.href);
      url.searchParams.set('translate', 'off');
      window.location.href = url.toString();
    } else {
      // [한국어 선택 시]: 구글 번역 콤보박스를 직접 조작
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (combo) {
        combo.value = "ko";
        combo.dispatchEvent(new Event("change"));
        setCurrentLang("ko");
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-5 z-[9999] flex flex-col items-end">
      {isOpen && (
        <div className="mb-2 w-32 overflow-hidden rounded-xl border border-white/10 bg-slate-900/90 p-1 shadow-2xl backdrop-blur-md">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`w-full rounded-lg px-4 py-2 text-left text-sm font-semibold transition-colors ${
              currentLang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange('ko')}
            className={`w-full rounded-lg px-4 py-2 text-left text-sm font-semibold transition-colors ${
              currentLang === 'ko' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            한국어
          </button>
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
