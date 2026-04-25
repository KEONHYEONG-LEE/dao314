"use client";

import React, { useState, useEffect } from 'react';
import { Globe, User, ChevronDown } from "lucide-react"; 
import { cn } from "@/lib/utils";

const PiLogin = () => {
  const [piId, setPiId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isBottomLangOpen, setIsBottomLangOpen] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem('pi_user_id');
    if (savedId) {
      setPiId(savedId);
      setIsLoggedIn(true);
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
    }
    setIsLangOpen(false);
    setIsBottomLangOpen(false);
  };

  return (
    <>
      {/* 1. 상단 헤더 내부 버튼들: 중복을 피하기 위해 오직 필요한 버튼 3개만 깔끔하게 배치 */}
      <div className="flex items-center gap-1.5 flex-nowrap h-full">
        
        {/* 번역 아이콘 (헤더 전용) */}
        <div className="relative flex items-center">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center justify-center h-8 w-8 rounded-md bg-slate-100 dark:bg-slate-800 border border-border hover:bg-slate-200 transition-all flex-shrink-0"
          >
            <Globe className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </button>

          {isLangOpen && (
            <div className="absolute top-full left-0 mt-1 w-20 bg-background border border-border shadow-xl rounded-md z-[100] overflow-hidden notranslate">
              <button onClick={() => handleLanguageChange('en')} className="w-full py-2 text-[11px] font-bold hover:bg-accent border-b border-border">EN</button>
              <button onClick={() => handleLanguageChange('ko')} className="w-full py-2 text-[11px] font-bold hover:bg-accent">KO</button>
            </div>
          )}
        </div>

        {/* Support 버튼 */}
        <button 
          onClick={() => alert("0.001 Pi 후원을 진행합니다.")}
          className="bg-[#f6ad55] text-white w-[58px] h-8 flex flex-col items-center justify-center rounded-md leading-none shadow-sm active:scale-95 flex-shrink-0"
        >
          <span className="text-[7px] font-bold uppercase">Support</span>
          <span className="text-[10px] font-black tracking-tighter">0.001π</span>
        </button>

        {/* 로그인 아이콘 */}
        <button 
          onClick={handleLoginClick}
          className={cn(
            "relative flex items-center justify-center h-8 w-8 rounded-md border transition-all active:scale-95 shadow-sm flex-shrink-0",
            isLoggedIn ? "bg-slate-800 border-slate-700" : "bg-[#4A69FF] border-blue-400"
          )}
        >
          <User className="h-4 w-4 text-white" />
          <span className={cn(
            "absolute top-0.5 right-0.5 h-2 w-2 rounded-full border",
            isLoggedIn ? "bg-green-500 border-slate-800" : "bg-gray-400 border-blue-500"
          )} />
        </button>
      </div>

      {/* 2. 우측 하단 Language 플로팅 버튼: 헤더 영역 밖으로 완전히 분리 (고정 위치) */}
      <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end gap-2">
        {isBottomLangOpen && (
          <div className="w-24 bg-background border border-border shadow-2xl rounded-lg overflow-hidden notranslate">
            <button onClick={() => handleLanguageChange('en')} className="w-full px-4 py-2.5 text-xs font-semibold hover:bg-accent border-b border-border flex justify-between items-center">
              <span>EN</span>
            </button>
            <button onClick={() => handleLanguageChange('ko')} className="w-full px-4 py-2.5 text-xs font-semibold hover:bg-accent flex justify-between items-center">
              <span>KO</span>
            </button>
          </div>
        )}
        <button
          onClick={() => setIsBottomLangOpen(!isBottomLangOpen)}
          className="flex items-center gap-1.5 bg-[#4A69FF] hover:bg-blue-700 text-white px-3 py-1.5 rounded-full shadow-lg transition-all active:scale-90"
        >
          <Globe className="h-3.5 w-3.5" />
          <span className="text-xs font-bold tracking-tight">언어</span>
          <ChevronDown className={cn("h-3 w-3 transition-transform", isBottomLangOpen && "rotate-180")} />
        </button>
      </div>
    </>
  );
};

export default PiLogin;
