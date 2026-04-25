"use client";

import React, { useState, useEffect, Fragment } from 'react';
import { User, ChevronUp, Languages } from "lucide-react"; 
import { cn } from "@/lib/utils";

const PiLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBottomLangOpen, setIsBottomLangOpen] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem('pi_user_id');
    if (savedId) setIsLoggedIn(true);

    // 구글 기본 UI 강제 제거
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.innerHTML = `
        .goog-te-banner-frame, .goog-te-gadget, #goog-gt-tt, .goog-te-balloon-frame, .skiptranslate {
          display: none !important;
          visibility: hidden !important;
        }
        body { top: 0px !important; position: static !important; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const handleLanguageChange = (code: string) => {
    // 콤보박스를 찾아 이벤트를 발생시켜 번역 실행
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
      combo.value = code;
      combo.dispatchEvent(new Event('change'));
    } else {
      alert("번역 엔진 로딩 중입니다. 1~2초 후 다시 시도해주세요.");
    }
    setIsBottomLangOpen(false);
  };

  return (
    <Fragment>
      {/* 1. 상단 로그인/후원 영역 */}
      <div className="flex items-center gap-2 notranslate">
        <button 
          onClick={() => alert("0.001 Pi 후원")}
          className="bg-amber-100/10 text-amber-400 px-2.5 h-8 flex items-center rounded-full border border-amber-500/30"
        >
          <span className="text-[10px] font-bold uppercase">π 0.001</span>
        </button>

        <button 
          onClick={() => {
            const id = prompt("ID 입력:");
            if(id) { localStorage.setItem('pi_user_id', id); setIsLoggedIn(true); }
          }}
          className={cn(
            "flex items-center justify-center h-9 w-9 rounded-full border transition-all",
            isLoggedIn ? "bg-blue-500 border-blue-400" : "bg-[#1e293b] border-slate-700"
          )}
        >
          <User className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* 2. 우측 하단 플로팅 언어 버튼 (여기서만 렌더링) */}
      <div className="fixed bottom-10 right-6 z-[9999] flex flex-col items-end gap-3 notranslate">
        {isBottomLangOpen && (
          <div className="mb-2 w-32 bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl overflow-hidden">
            <button onClick={() => handleLanguageChange('en')} className="w-full px-4 py-3 text-sm font-bold text-white hover:bg-blue-600 transition-colors flex justify-between">
              <span>English</span><span className="opacity-40 uppercase">en</span>
            </button>
            <button onClick={() => handleLanguageChange('ko')} className="w-full px-4 py-3 text-sm font-bold text-white hover:bg-blue-600 transition-colors flex justify-between">
              <span>한국어</span><span className="opacity-40 uppercase">ko</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setIsBottomLangOpen(!isBottomLangOpen)}
          className="flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl bg-blue-600 hover:bg-blue-500 text-white border border-blue-400 transition-all active:scale-95 shadow-blue-500/20"
        >
          <Languages className="h-4 w-4" />
          <span className="text-xs font-black tracking-widest uppercase">언어/Lang</span>
          <ChevronUp className={cn("h-3 w-3 transition-transform", isBottomLangOpen && "rotate-180")} />
        </button>
      </div>
    </Fragment>
  );
};

export default PiLogin;
