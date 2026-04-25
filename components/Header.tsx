"use client";

import { useEffect } from "react";
import PiLogin from "./PiLogin"; 

export function Header() {
  useEffect(() => {
    // 1. 구글 번역 스크립트 로드
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
        autoDisplay: false 
      }, 'google_translate_element');
    };
    addScript();
  }, []);

  return (
    // 상단 네이비 바 유지, 배경 투명화는 삭제하여 깔끔하게 정리
    <header className="sticky top-0 z-50 w-full bg-[#0f172a] border-b border-slate-800 notranslate">
      {/* 구글 위젯은 여기에 숨겨둡니다 */}
      <div id="google_translate_element" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}></div>
      
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-[56px] items-center justify-between">
          {/* 좌측 로고 */}
          <div className="text-white font-black text-xl tracking-tighter">GPNR</div>
          
          {/* 우측 로그인 영역 (하나만 렌더링) */}
          <div className="flex items-center">
            <PiLogin />
          </div>
        </div>
      </div>
    </header>
  );
}
