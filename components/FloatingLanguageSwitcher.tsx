"use client";

import React, { useState, useEffect } from "react";
import { Globe, ChevronUp } from "lucide-react";

export function FloatingLanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("ko");

  useEffect(() => {
    // 1. 초기 스타일 주입 (상단 바 공간 차단 및 기본 UI 숨김)
    const style = document.createElement("style");
    style.innerHTML = `
      /* 구글 번역 바와 관련된 모든 요소를 투명화하고 상호작용 차단 */
      .goog-te-banner-frame, .goog-te-banner, .skiptranslate, 
      iframe.goog-te-menu-frame, #goog-gt-tt, .VIpgJd-Zvi9m-OR9h3-zh99gd { 
        display: none !important; 
        visibility: hidden !important; 
        height: 0 !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
      /* 구글이 body를 아래로 밀어버리는 현상 방어 */
      body { top: 0 !important; position: static !important; }
      html { padding-top: 0 !important; }
    `;
    document.head.appendChild(style);

    // 2. 실시간 감시자(MutationObserver) 작동
    // 구글 스크립트가 동적으로 버튼을 생성하면 즉시 감지해서 삭제(remove)합니다.
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        const targets = document.querySelectorAll(
          '.goog-te-banner-frame, .skiptranslate, [class*="goog-te"], [id*="goog-gt"], [class*="VIpgJd"]'
        );
        targets.forEach(el => {
          // 우측 하단 우리가 만든 버튼은 제외하고 구글이 만든 것만 삭제
          if (!el.contains(document.querySelector('.fixed.bottom-6'))) {
            el.remove(); 
          }
        });
        
        // body의 top 값이 변하면 즉시 0으로 리셋
        if (document.body.style.top !== '0px' && document.body.style.top !== '') {
          document.body.style.top = '0px';
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 3. 자동 번역 로직 (한국어 고정)
    const autoTranslate = () => {
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (combo) {
        if (combo.value !== 'ko') {
          combo.value = 'ko';
          combo.dispatchEvent(new Event("change"));
        }
      } else {
        setTimeout(autoTranslate, 1000);
      }
    };
    autoTranslate();

    return () => observer.disconnect(); // 언마운트 시 감시 종료
  }, []);

  const handleLanguageChange = (langCode: string) => {
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event("change"));
      setCurrentLang(langCode);
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-5 z-[9999] flex flex-col items-end">
      {isOpen && (
        <div className="mb-2 w-32 overflow-hidden rounded-xl border border-white/10 bg-slate-900/90 p-1 shadow-2xl backdrop-blur-md">
          {['en', 'ko'].map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`w-full rounded-lg px-4 py-2 text-left text-sm font-semibold transition-colors ${
                currentLang === lang ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {lang === 'ko' ? '한국어' : 'English'}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-transform active:scale-95"
      >
        <Globe size={18} />
        <span>언어</span>
        <ChevronUp size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
