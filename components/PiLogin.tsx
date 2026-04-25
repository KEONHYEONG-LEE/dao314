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

    // 스타일 주입 시 발생할 수 있는 에러 방지
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.innerHTML = `
        .goog-te-banner-frame.skiptranslate, .goog-te-gadget-simple, .goog-te-balloon-frame, #goog-gt-tt { display: none !important; }
        body { top: 0px !important; }
        .goog-text-highlight { background: none !important; box-shadow: none !important; }
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

      setTimeout(() => {
        const banner = document.querySelector('.goog-te-banner-frame') as HTMLElement;
        if (banner) banner.style.display = 'none';
        document.body.style.top = '0px';
      }, 100);
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

        <button 
          onClick={handleLoginClick}
          className={cn(
            "flex items-center justify-center h-8 w-8 rounded-full border transition-all active:scale-95 shadow-sm",
            isLoggedIn ? "bg-slate-900 border-slate-700" : "bg-blue-600 border-blue-500"
          )}
        >
          <User className={cn("h-4 w-4", isLoggedIn ? "text-blue-400" : "text-white")} />
        </button>
      </div>

      {/* 2. 하단 Language 플로팅 버튼 */}
      <div className="fixed bottom-8 right-6 z-[1000] flex flex-col items-end gap-3 notranslate">
        {isBottomLangOpen && (
          <div className="mb-2 w-28 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <button 
              onClick={() => handleLanguageChange('en')} 
              className="w-full px-4 py-3 text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between group text-slate-900 dark:text-white"
            >
              <span>English</span>
              <span className="text-[10px] opacity-50 group-hover:opacity-100 uppercase">en</span>
            </button>
            <button 
              onClick={() => handleLanguageChange('ko')} 
              className="w-full px-4 py-3 text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between group text-slate-900 dark:text-white"
            >
              <span>한국어</span>
              <span className="text-[10px] opacity-50 group-hover:opacity-100 uppercase">ko</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setIsBottomLangOpen(!isBottomLangOpen)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all active:scale-90 border",
            isBottomLangOpen 
              ? "bg-slate-900 border-slate-700 text-white" 
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          )}
        >
          <Languages className="h-4 w-4" />
          <span className="text-xs font-extrabold tracking-tight">
            {isBottomLangOpen ? "CLOSE" : "LANG"}
          </span>
          <ChevronUp className={cn("h-3 w-3 opacity-50 transition-transform", isBottomLangOpen && "rotate-180")} />
        </button>
      </div>
    </Fragment>
  );
};

export default PiLogin;
