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
    const addScript = () => {
      if (typeof window !== "undefined" && !document.getElementById("google-translate-script")) {
        const s = document.createElement("script");
        s.id = "google-translate-script";
        s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        s.async = true;
        document.body.appendChild(s);
      }
    };

    (window as any).googleTranslateElementInit = () => {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: "ko,en", autoDisplay: false },
          "google_translate_element"
        );
      }
    };

    addScript();
  }, []);

  const handleLanguageChange = (langCode: string) => {
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event("change"));
    }
    setCurrentLang(langCode);
    setIsOpen(false);
  };

  return (
    <>
      {/* 구글 번역 숨김 박스 - display: none으로 상단 공간 차지 방지 */}
      <div id="google_translate_element" style={{ display: 'none', visibility: 'hidden' }}></div>

      {/* 플로팅 버튼 - 위치 및 간격 미세 조정 */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
        
        {/* 드롭다운 메뉴 - 사이즈 축소 */}
        {isOpen && (
          <div style={{ 
            backgroundColor: 'var(--popover)', 
            border: '1px solid var(--border)', 
            borderRadius: '10px', 
            padding: '6px', 
            width: '100px', 
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            marginBottom: '4px' 
          }}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 10px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  borderRadius: '6px',
                  color: currentLang === lang.code ? '#2563eb' : 'inherit',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}

        {/* 메인 버튼 - 높이 48px -> 36px로 축소, 폰트 및 아이콘 사이즈 하향 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            height: '36px',
            padding: '0 14px',
            borderRadius: '9999px',
            backgroundColor: '#2563eb',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            border: 'none',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          <Globe size={16} />
          <span>Language</span>
          <ChevronUp size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
      </div>
    </>
  );
}
