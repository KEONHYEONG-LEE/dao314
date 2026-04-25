"use client";

import { useEffect } from "react";
import PiLogin from "./PiLogin"; 

export function Header() {
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
    
    // 2. 번역 초기화 로직
    // @ts-ignore
    window.googleTranslateElementInit = () => {
      // @ts-ignore
      new window.google.translate.TranslateElement({ 
        pageLanguage: 'en', 
        includedLanguages: 'ko,en', 
        autoDisplay: false 
      }, 'google_translate_element');
    };

    addScript();
  }, []);

  return (
    // '상단 흰색 바'가 보이지 않도록 배경을 transparent로 설정하고 shadow를 제거했습니다.
    <header className="fixed top-0 z-[60] w-full bg-transparent border-none notranslate">
      
      {/* 구글 번역 엘리먼트 (기능 유지를 위해 존재하되 완전히 숨김) */}
      <div id="google_translate_element" style={{ visibility: 'hidden', width: 0, height: 0, position: 'absolute' }}></div>
      
      <div className="mx-auto max-w-7xl px-4">
        {/* 우측 상단에 로그인/언어 버튼만 띄우기 위해 justify-end 설정 */}
        <div className="flex h-[60px] items-center justify-end gap-2">
          {/* PiLogin 컴포넌트 내부에 로그인 아이콘과 후원 버튼이 포함됩니다. */}
          <div className="p-1">
            <PiLogin />
          </div>
        </div>
      </div>
    </header>
  );
}
