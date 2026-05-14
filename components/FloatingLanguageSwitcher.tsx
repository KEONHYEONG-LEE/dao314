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

    // 초기 실행 시 한국어 설정
    const timer = setTimeout(() => {
      handleLanguageChange("ko");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (combo) {
      if (langCode === 'en') {
        // 영어를 선택하면 번역을 초기화(원본 보기)하는 가장 확실한 방법입니다.
        const iframe = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          // 구글 번역 바 내부의 '원본 보기' 버튼을 강제로 클릭합니다.
          const restoreBtn = iframe.contentWindow.document.getElementById(':1.restore') as HTMLElement;
          if (restoreBtn) restoreBtn.click();
        }
        // 콤보박스 값도 기본값으로 되돌립니다.
        combo.value = ""; 
      } else {
        // 한국어 등 다른 언어 선택 시
        combo.value = langCode;
      }
      combo.dispatchEvent(new Event("change"));
      setCurrentLang(langCode);
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
