"use client";

import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

const PiLogin = () => {
  const [piId, setPiId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      {/* 1. Support 버튼 (2단 구성, 폭 축소) */}
      <button 
        onClick={() => alert("0.001 Pi 후원을 진행합니다.")}
        className="bg-[#f6ad55] text-white w-[58px] h-9 flex flex-col items-center justify-center rounded-md leading-none shadow-sm active:scale-95"
      >
        <span className="text-[8px] font-bold uppercase">Support</span>
        <span className="text-[10px] font-black tracking-tighter">0.001π</span>
      </button>

      {/* 2. 로그인 아이콘 (텍스트 제거, 불빛으로만 식별) */}
      <button 
        onClick={handleLoginClick}
        className={cn(
          "relative flex items-center justify-center h-9 w-9 rounded-md border transition-all active:scale-95 shadow-sm",
          isLoggedIn ? "bg-slate-800 border-slate-700" : "bg-[#4A69FF] border-blue-400"
        )}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        
        {/* 상태 표시 불빛 (녹색/회색) */}
        <span className={cn(
          "absolute top-1 right-1 h-2.5 w-2.5 rounded-full border-2",
          isLoggedIn 
            ? "bg-green-500 border-slate-800 shadow-[0_0_5px_#22c55e]" 
            : "bg-gray-400 border-blue-500"
        )} />
      </button>
    </div>
  );
};

export default PiLogin;

