"use client";

import React, { useState, useEffect } from 'react';
import { Globe, User } from "lucide-react";
import { cn } from "@/lib/utils";

const PiLogin = () => {
  const [piId, setPiId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

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
  };

  return (
    <div className="flex items-center gap-1.5 flex-nowrap">
      
      {/* [1순위] 번역 아이콘: 무조건 가장 왼쪽 */}
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
  );
};

export default PiLogin;
