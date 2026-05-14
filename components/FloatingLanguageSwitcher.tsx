"use client";

import React, { useState, useEffect } from "react";
import { Globe, ChevronUp } from "lucide-react";

export function FloatingLanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("ko");

  useEffect(() => {
    // 1. 스타일 주입: 구글 번역 UI는 숨기되, 기능은 유지
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame, .goog-te-banner, .skiptranslate, 
      iframe.goog-te-menu-frame, #goog-gt-tt, .VIpgJd-Zvi9m-OR9h3-zh99gd { 
        display: none !important; 
        visibility: hidden !important; 
      }
      body { top: 0 !important; position: static !important; }
      html { padding-top: 0 !important; }
    `;
    document.head.appendChild(style);

    // 2. 초기 로드 시 한국어로 설정 시도 (최대 5초간 반복 확인)
    let retryCount = 0;
    const initTranslate = () => {
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (combo) {
        if (combo.value !== 'ko') {
          combo.value = 'ko';
          combo.dispatchEvent(new Event("change"));
        }
      } else if (retryCount < 10) {
        retryCount++;
        setTimeout(initTranslate, 500);
      }
    };
    initTranslate();
  }, []);

  const handleLanguageChange = (langCode: string) => {
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event("change"));
      setCurrentLang(langCode);
    } else {
      // 콤보박스가 없으면 구글 스크립트를 다시 호출하거나 대기 (알림창 제거)
      console.log("Translation engine not ready yet.");
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-5 z-[9999] flex flex-col items-end">
      {isOpen && (
        <div className="mb-2 w-32 overflow-hidden rounded-xl border border-white/10 bg-slate-900/90 p-1 shadow-2xl backdrop-blur-md">
          {[
            { code: 'ko', label: '한국어' },
            { code: 'en', label: 'English' }
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
        <span>{currentLang === 'ko' ? '한국어' : 'Language'}</span>
        <ChevronUp size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
