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
    // 1. 페이지 로드 시 구글 번역기가 준비되었는지 확인하고 한국어로 자동 전환 시도
    const autoTranslateToKo = () => {
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (combo) {
        // 이미 한국어가 아니라면 한국어로 변경
        if (combo.value !== 'ko') {
          combo.value = 'ko';
          combo.dispatchEvent(new Event("change"));
          setCurrentLang("ko");
        }
      } else {
        // 아직 로드가 안 되었다면 잠시 후 다시 시도 (최대 5초간)
        setTimeout(autoTranslateToKo, 500);
      }
    };

    autoTranslateToKo();
  }, []);

  const handleLanguageChange = (langCode: string) => {
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event("change"));
      setCurrentLang(langCode);
    } else {
      alert("번역 시스템이 준비 중입니다. 잠시 후 다시 시도해 주세요.");
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* 구글 번역 위젯이 렌더링될 실제 위치 (보이지 않게 숨김) */}
      <div id="google_translate_element" style={{ display: 'none', visibility: 'hidden' }}></div>

      <div style={{ 
        position: 'fixed', 
        bottom: '24px', 
        right: '20px', 
        zIndex: 9999, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-end' 
      }}>
        
        {isOpen && (
          <div style={{ 
            backgroundColor: '#1e293b', 
            border: '1px solid #334155', 
            borderRadius: '12px', 
            padding: '4px', 
            width: '120px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            marginBottom: '8px'
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
                  display: 'block'
                }}
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}

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
          <span>{currentLang === 'ko' ? '한국어' : 'Language'}</span>
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
