"use client";

import React, { useState, useEffect } from 'react';
import { Globe, User, ChevronDown } from "lucide-react"; // ChevronDown 추가
import { cn } from "@/lib/utils";

const PiLogin = () => {
  const [piId, setPiId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isBottomLangOpen, setIsBottomLangOpen] = useState(false); // 하단 버튼용 상태 추가

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
      <div className="flex items-center gap-1.5 flex-nowrap">
        {/* [1순위] 헤더 번역 아이콘 */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center justify-center h-8 w-8 rounded-md bg-slate-100 dark:bg-slate-800 border border-border hover:bg-slate-200 transition-all flex-shrink-0"
          >
            <Globe className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </button>

          {isLangOpen && (
            <div className="absolute left-0 mt-2 w-20 bg-background border border-border shadow-xl rounded-md z-[100] overflow-hidden">
              <button onClick={() => handleLanguageChange('en')} className="w-full py-2 text-[11px] font-bold hover:bg-accent border-b border-border">EN</button>
              <button onClick={() => handleLanguageChange('ko')} className="w-full py-2 text-[11px] font-bold hover:bg-accent">KO</button>
            </div>
          )}
        </div>

        {/* [2순위] Support 버튼 */}
        <button 
          onClick={() => alert("0.001 Pi 후원을 진행합니다.")}
          className="bg-[#f6ad55] text-white w-[58px] h-8 flex flex-col items-center justify-center rounded-md leading-none shadow-sm active:scale-95 flex-shrink-0"
        >
          <span className="text-[7px] font-bold uppercase">Support</span>
          <span className="text-[10px] font-black tracking-tighter">0.001π</span>
        </button>

        {/* [3순위] 로그인 아이콘 */}
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

      {/* [수정사항] 우측 하단 Language 플로팅 버튼 - 사이즈 축소 버전 */}
      <div className="fixed bottom-6 right-6 z-[100]">
        {isBottomLangOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-24 bg-background border border-border shadow-2xl rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <button onClick={() => handleLanguageChange('en')} className="w-full px-4 py-2.5 text-xs font-semibold hover:bg-accent border-b border-border flex justify-between items-center">
              <span>English</span>
              <span className="text-[10px] opacity-50">EN</span>
            </button>
            <button onClick={() => handleLanguageChange('ko')} className="w-full px-4 py-2.5 text-xs font-semibold hover:bg-accent flex justify-between items-center">
              <span>한국어</span>
              <span className="text-[10px] opacity-50">KO</span>
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
