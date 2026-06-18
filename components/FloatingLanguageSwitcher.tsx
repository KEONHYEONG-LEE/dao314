"use client";

import React, { useState, useEffect } from "react";
import { Globe, ChevronUp } from "lucide-react";

// 1. 지원할 다국어 리스트 정의 (앱 속도에 전혀 영향 없음)
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "zh-CN", label: "简体中文" },
  { code: "es", label: "Español" },
  { code: "vi", label: "Tiếng Việt" },
];

export function FloatingLanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    // 초기 언어 설정 확인 (로컬 스토리지 우선)
    const savedLang = localStorage.getItem("gpnr_lang") || "en";
    setCurrentLang(savedLang);

    // 2. 구글 기본 UI 배너 강제 숨기기 & 특정 클래스 번역 방지 스타일 추가
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame, .skiptranslate, #goog-gt-tt, .goog-te-balloon-frame { 
        display: none !important; 
        visibility: hidden !important;
      }
      body { top: 0 !important; position: static !important; }
    `;
    document.head.appendChild(style);

    // 초기 로드 시 영어가 아닌 다른 다국어라면 구글 엔진 작동 유도
    if (savedLang !== "en") {
      const timer = setTimeout(() => {
        const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (combo) {
          combo.value = savedLang;
          combo.dispatchEvent(new Event("change"));
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    localStorage.setItem("gpnr_lang", langCode);
    
    if (langCode === 'en') {
      // 영어 선택 시: 구글 번역 쿠키 초기화 후 새로고침 (원본 유지)
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
      window.location.href = window.location.pathname;
    } else {
      // 선택한 다국어로 번역 엔진 작동
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (combo) {
        combo.value = langCode;
        combo.dispatchEvent(new Event("change"));
        setCurrentLang(langCode);
      } else {
        window.location.reload();
      }
    }
    setIsOpen(false);
  };

  // 현재 선택된 언어의 표시용 텍스트 찾기
  const currentLabel = LANGUAGES.find(l => l.code === currentLang)?.label || "English";

  return (
    <div className="fixed bottom-6 right-5 z-[9999] flex flex-col items-end">
      {isOpen && (
        <div className="mb-2 max-h-60 w-36 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/90 p-1 shadow-2xl backdrop-blur-md">
          {LANGUAGES.map((lang) => (
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
        <span>{currentLabel}</span>
        <ChevronUp size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
