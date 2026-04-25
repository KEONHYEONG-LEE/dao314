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
      {/* 구글 번역 숨김 박스 */}
      <div id="google_translate_element" style={{ display: 'none', visibility: 'hidden' }}></div>

      {/* 플로팅 버튼 - z-index를 최상위(9999)로 고정 */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
        
        {/* 드롭다운 메뉴 */}
        {isOpen && (
          <div style={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '12px', padding: '8px', width: '120px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  color: currentLang === lang.code ? '#2563eb' : 'inherit',
                  backgroundColor: 'transparent'
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
            height: '48px',
            padding: '0 20px',
            borderRadius: '9999px',
            backgroundColor: '#2563eb',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Globe size={20} />
          <span>Language</span>
          <ChevronUp size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
      </div>
    </>
  );
}
