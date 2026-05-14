"use client";

import React, { useState, useEffect } from "react";
import { Globe, ChevronUp } from "lucide-react";

export function FloatingLanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    // 1. 초기 언어 설정 확인 (로컬 스토리지 우선)
    const savedLang = localStorage.getItem("gpnr_lang") || "ko";
    setCurrentLang(savedLang);

    // 2. 구글 번역 UI 숨기기 스타일
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame, .skiptranslate, #goog-gt-tt, .goog-te-balloon-frame { 
        display: none !important; 
        visibility: hidden !important;
      }
      body { top: 0 !important; position: static !important; }
    `;
    document.head.appendChild(style);

    // 3. 한국어일 때만 구글 엔진 작동 유도
    if (savedLang === "ko") {
      const timer = setTimeout(() => {
        const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (combo) {
          combo.value = "ko";
          combo.dispatchEvent(new Event("change"));
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    // 로컬 스토리지에 저장 (새로고침 후에도 유지하기 위함)
    localStorage.setItem("gpnr_lang", langCode);
    
    if (langCode === 'en') {
      // 영어 선택 시: 쿠키 삭제 후 페이지를 깨끗하게 새로고침
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
      window.location.href = window.location.pathname; // 쿼리 스트링 없이 깔끔하게 이동
    } else {
      // 한국어 선택 시: 엔진 작동
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (combo) {
        combo.value = "ko";
        combo.dispatchEvent(new Event("change"));
        setCurrentLang("ko");
      } else {
        // 엔진이 로드 전이면 새로고침하여 적용
        window.location.reload();
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
