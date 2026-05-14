"use client";

import React, { useState, useEffect } from "react";
import { Globe, ChevronUp } from "lucide-react";

export function FloatingLanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("ko");

  useEffect(() => {
    // 1. 구글 번역 UI 숨기기 및 레이아웃 고정 스타일 주입
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame, .skiptranslate, #goog-gt-tt, .goog-te-balloon-frame { 
        display: none !important; 
        visibility: hidden !important;
      }
      body { top: 0 !important; position: static !important; }
    `;
    document.head.appendChild(style);

    // 2. 최초 로드 시 엔진 상태 확인 및 한국어 동기화
    const syncInitialLanguage = () => {
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (combo) {
        // 엔진은 한국어인데 UI가 영어면 한국어로 강제 설정
        if (currentLang === "ko" && combo.value !== "ko") {
          combo.value = "ko";
          combo.dispatchEvent(new Event("change"));
        }
      } else {
        setTimeout(syncInitialLanguage, 500);
      }
    };

    syncInitialLanguage();
  }, [currentLang]);

  const handleLanguageChange = (langCode: string) => {
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    
    if (combo) {
      // 언어 변경 실행
      combo.value = langCode;
      combo.dispatchEvent(new Event("change"));
      
      // 상태 업데이트
      setCurrentLang(langCode);
      
      // 영어를 선택했을 경우 '원본 보기'가 확실히 작동하도록 추가 처리
      if (langCode === 'en') {
        const iframe = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          const restoreBtn = iframe.contentWindow.document.getElementById(':1.restore') as HTMLElement;
          if (restoreBtn) restoreBtn.click();
        }
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
