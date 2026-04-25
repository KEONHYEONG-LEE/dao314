"use client";

import React, { useState, useEffect } from "react";
import { Globe, ChevronUp } from "lucide-react";

const languages = [
  { code: "en", name: "English" },
  { code: "ko", name: "한국어" },
];

export function FloatingLanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    // 이미 스크립트가 있다면 초기화 함수만 연결
    const initGoogleTranslate = () => {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: "ko,en", autoDisplay: false },
          "google_translate_element"
        );
      }
    };

    if (!(window as any).googleTranslateElementInit) {
      (window as any).googleTranslateElementInit = initGoogleTranslate;
    }

    const scriptId = "google-translate-script";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    // 구글 번역 콤보박스 찾기 및 값 변경
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event("change"));
      setCurrentLang(langCode);
    } else {
      console.warn("구글 번역 위젯이 아직 로드되지 않았습니다.");
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* 1. 구글 번역 숨김 요소: display none으로 공간 차지 0 */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      {/* 2. 플로팅 UI 컨테이너 */}
      <div style={{ 
        position: 'fixed', 
        bottom: '24px', 
        right: '20px', 
        zIndex: 9999, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-end' 
      }}>
        
        {/* 드롭다운 메뉴: 배경색 및 텍스트 겹침 방지 */}
        {isOpen && (
          <div style={{ 
            backgroundColor: '#1e293b', // 네이비 톤으로 통일
            border: '1px solid #334155', 
            borderRadius: '12px', 
            padding: '4px', 
            width: '120px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            marginBottom: '8px',
            overflow: 'hidden'
          }}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  color: currentLang === lang.code ? '#60a5fa' : '#f8fafc',
                  backgroundColor: currentLang === lang.code ? '#334155' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'block' // 텍스트 겹침 방지
                }}
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}

        {/* 메인 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: '40px',
            padding: '0 16px',
            borderRadius: '9999px',
            backgroundColor: '#2563eb',
            color: 'white',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
            border: 'none',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <Globe size={18} />
          <span>Language</span>
          <ChevronUp 
            size={16} 
            style={{ 
              transform: isOpen ? 'rotate(180deg)' : 'none', 
              transition: 'transform 0.3s ease' 
            }} 
          />
        </button>
      </div>
    </>
  );
}
