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

  // 언어 변경 함수
  const handleLanguageChange = (code: string) => {
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
      combo.value = code;
      combo.dispatchEvent(new Event('change'));
    }
    setIsLangOpen(false);
  };

  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      
      {/* [추가] 1. 번역 아이콘 (Support 좌측 배치) */}
      <div className="relative">
        <button
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="flex items-center justify-center h-9 w-9 rounded-md border border-border bg-secondary/40 hover:bg-secondary transition-all"
        >
          <Globe className="h-4 w-4" />
        </button>

        {isLangOpen && (
          <div className="absolute right-0 mt-2 w-20 bg-popover border border-border rounded-md shadow-xl z-[100] py-1">
            <button onClick={() => handleLanguageChange('en')} className="w-full py-2 text-[11px] font-bold hover:bg-accent">EN</button>
            <button onClick={() => handleLanguageChange('ko')} className="w-full py-2 text-[11px] font-bold hover:bg-accent border-t border-border">KO</button>
          </div>
        )}
      </div>

      {/* 2. Support 버튼 (2단 구성) */}
      <button 
        onClick={() => alert("0.001 Pi 후원을 진행합니다.")}
        className="bg-[#f6ad55] text-white w-[58px] h-9 flex flex-col items-center justify-center rounded-md leading-none shadow-sm active:scale-95"
      >
        <span className="text-[8px] font-bold uppercase">Support</span>
        <span className="text-[10px] font-black tracking-tighter">0.001π</span>
      </button>

      {/* 3. 로그인 아이콘 (불빛 표시) */}
      <button 
        onClick={handleLoginClick}
        className={cn(
          "relative flex items-center justify-center h-9 w-9 rounded-md border transition-all active:scale-95 shadow-sm",
          isLoggedIn ?
