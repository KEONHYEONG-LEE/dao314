"use client";

import React, { useState, useEffect, Fragment } from 'react';
import { User, ChevronUp, Languages } from "lucide-react"; 
import { cn } from "@/lib/utils";

const PiLogin = () => {
  const [piId, setPiId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBottomLangOpen, setIsBottomLangOpen] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem('pi_user_id');
    if (savedId) {
      setPiId(savedId);
      setIsLoggedIn(true);
    }

    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.innerHTML = `
        /* 구글 번역 기본 UI가 우리 버튼을 가리지 못하도록 완벽 차단 */
        .goog-te-banner-frame, .goog-te-gadget, #goog-gt-tt, .goog-te-balloon-frame, .skiptranslate { 
          display: none !important; 
          visibility: hidden !important; 
        }
        body { top: 0px !important; position: static !important; }
        /* 구글 자동 번역 툴팁 제거 */
        #goog-gt-tt { display: none !important; }
        .goog-text-highlight { background: transparent !important; box-shadow: none !important; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const handleLoginClick = () => {
    const savedId = localStorage.getItem('pi_user_id');
    const inputId = prompt(
      savedId ? `기존 ID: ${savedId.substring(0, 10)}...` : "Pi ID를 입력해주세요.", 
      savedId || ""
    );

    if (inputId) {
      setPiId(inputId);
      localStorage.setItem('pi_user_id', inputId);
      setIsLoggedIn(true);
    }
  };

  const handleLanguageChange = (code: string) => {
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
      combo.value = code;
      combo.dispatchEvent(new Event('change'));
    } else {
      console.error("번역 엔진 로드 대기 중...");
    }
    setIsBottomLangOpen(false);
  };

  return (
    <Fragment>
      {/* 1. 상단 액션 그룹 */}
      <div className="flex items-center gap-2 notranslate">
        <button 
          onClick={() => alert("0.001 Pi 후원을 진행합니다.")}
          className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2.5 h-8 flex items-center gap-1 rounded-full border border-amber-200 dark:border-amber-800/50 transition-all active:scale-95"
        >
          <span className="text-[10px] font-black italic">π</span>
          <span className="text-[10px] font-bold">0.001</span>
        </button>

        {/* [반전 수정] Off: 남색, On: 밝은 파랑 */}
        <button 
          onClick={handleLoginClick}
          className={cn(
            "flex items-center justify-center h-8 w-8 rounded-full border transition-all active:scale-95 shadow-sm",
            isLoggedIn 
              ? "bg-blue-400 border-blue-300" 
              : "bg-[#0f172a] border-slate-700" 
          )}
        >
          <User className={cn("h-4 w-4", isLoggedIn ? "text-white" : "text-slate-400")} />
        </button>
      </div>

      {/* 2. 하단 전용 번역 플로팅 버튼 (중복 UI 제거됨) */}
      <div className="fixed bottom-8 right-6 z-[9999] flex flex-col items-end gap-3 notranslate">
        {isBottomLangOpen && (
          <div className="mb-2 w-32 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <button 
              onClick={() => handleLanguageChange('en')} 
              className="w-full px-4 py-3 text-sm font-bold hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between group text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800"
            >
              <span>English</span>
              <span className="text-[10px] opacity-40">EN</span>
            </button>
            <button 
              onClick={() => handleLanguageChange('ko')} 
              className="w-full px-4 py-3 text-sm font-bold hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between group text-slate-900 dark:text-white"
            >
              <span>한국어</span>
              <span className="text-[10px] opacity-40">KO</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setIsBottomLangOpen(!isBottomLangOpen)}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl transition-all active:scale-90 border",
            isBottomLangOpen 
              ? "bg-slate-900 border-slate-700 text-white" 
              : "bg-blue-600 border-blue-500 text-white"
          )}
        >
          <Languages className="h-4 w-4" />
          <span className="text-xs font-black tracking-widest uppercase">
            {isBottomLangOpen ? "CLOSE" : "언어 / LANG"}
          </span>
          <ChevronUp className={cn("h-3 w-3 opacity-70 transition-transform", isBottomLangOpen && "rotate-180")} />
        </button>
      </div>
    </Fragment>
  );
};

export default PiLogin;
