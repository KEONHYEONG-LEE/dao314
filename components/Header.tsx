"use client";

import { useState, useEffect } from "react";
import { Globe, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import PiLogin from "./PiLogin"; 

export function Header() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // 1. 구글 번역 스크립트 추가
    const addScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const s = document.createElement("script");
        s.id = "google-translate-script";
        s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        s.async = true;
        document.body.appendChild(s);
      }
    };
    
    // 2. 번역 초기화 및 자동 실행 로직
    // @ts-ignore
    window.googleTranslateElementInit = () => {
      // @ts-ignore
      new window.google.translate.TranslateElement({ 
        pageLanguage: 'en', 
        includedLanguages: 'ko,en', 
        autoDisplay: true 
      }, 'google_translate_element');

      // 강제로 한국어 번역 실행 (약간의 지연 필요)
      setTimeout(() => {
        const translateCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (translateCombo) {
          translateCombo.value = 'ko';
          translateCombo.dispatchEvent(new Event('change'));
        }
      }, 1000);
    };

    addScript();
  }, []);

  return (
    // 배경색을 투명하게 하거나 높이를 최소화하여 '흰색 바' 느낌을 제거합니다.
    <header className="fixed top-0 z-50 w-full bg-transparent notranslate">
      
      {/* 구글 번역 엘리먼트 (숨김 처리) */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-[50px] items-center justify-end gap-2">
          
          {/* [좌측 GPNR 로고 제거] - 눈에 거슬리는 흰색 바의 주범을 삭제했습니다. */}

          {/* [우측] 필수 기능만 배치 (번역 아이콘이 포함된 PiLogin + 테마) */}
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md p-1 rounded-full border border-border shadow-sm">
            
            <PiLogin />

            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
              title="테마 변경"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
