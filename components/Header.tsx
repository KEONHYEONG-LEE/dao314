"use client";

import { useEffect } from "react";
import PiLogin from "./PiLogin"; 

export function Header() {
  useEffect(() => {
    const addScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const s = document.createElement("script");
        s.id = "google-translate-script";
        s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        s.async = true;
        document.body.appendChild(s);
      }
    };
    
    // @ts-ignore
    window.googleTranslateElementInit = () => {
      // @ts-ignore
      new window.google.translate.TranslateElement({ 
        pageLanguage: 'en', 
        includedLanguages: 'ko,en', 
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false 
      }, 'google_translate_element');
    };
    addScript();
  }, []);

  return (
    /* 1. 상단 두 번째 줄 중복 삭제: 
         기존에 이 헤더 하단에 추가적인 nav나 div가 있었다면 제거하고 
         딱 로고와 로그인 버튼이 있는 56px 높이의 바만 남깁니다.
    */
    <header className="sticky top-0 z-50 w-full bg-[#0f172a] border-b border-slate-800 notranslate">
      {/* 번역 위젯 위치 수정: opacity 0으로 완전히 숨기되, 
         나중에 FloatingLanguageSwitcher에서 이 위젯을 호출하게 됩니다. 
      */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-[56px] items-center justify-between">
          {/* 좌측 로고 */}
          <div className="text-white font-black text-xl tracking-tighter">GPNR</div>
          
          {/* 우측 로그인 영역 */}
          <div className="flex items-center gap-2">
            <PiLogin />
          </div>
        </div>
      </div>
    </header>
  );
}
