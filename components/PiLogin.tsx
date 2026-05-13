"use client";

import React, { useState, useEffect, Fragment } from 'react';
import { User, ChevronUp, Languages } from "lucide-react"; 
import { cn } from "@/lib/utils";

const PiLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBottomLangOpen, setIsBottomLangOpen] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 Pi ID 확인
    const savedId = localStorage.getItem('pi_user_id');
    if (savedId) setIsLoggedIn(true);

    // 구글 번역 UI 강제 숨김 스타일 추가
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

  // [수정] 후원 기능 로직
  const handleSupport = () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용해 주세요."); // 미로그인 시 팝업 알림
      return;
    }
    // 로그인 상태일 때 실행할 후원 로직
    alert("0.001 Pi 후원이 진행됩니다.");
  };

  // [수정] 로그인 처리 로직
  const handleLogin = () => {
    if (isLoggedIn) {
      if (confirm("로그아웃 하시겠습니까?")) {
        localStorage.removeItem('pi_user_id');
        setIsLoggedIn(false);
        window.location.reload(); // 상태 초기화를 위한 새로고침
      }
      return;
    }

    const id = prompt("Pi ID (56자)를 입력해주세요:");
    if (id && id.length >= 56) {
      localStorage.setItem('pi_user_id', id);
      setIsLoggedIn(true);
      alert("로그인되었습니다.");
    } else if (id) {
      alert("올바른 Pi ID 형식이 아닙니다.");
    }
  };

  const handleLanguageChange = (code: string) => {
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
        {/* 후원 버튼: handleSupport 함수로 권한 체크 */}
        <button 
          onClick={handleSupport}
          className={cn(
            "px-2.5 h-8 flex items-center rounded-full border transition-all",
            isLoggedIn 
              ? "bg-amber-100/10 text-amber-400 border-amber-500/50" 
              : "bg-slate-800 text-slate-500 border-slate-700 opacity-60"
          )}
        >
          <span className="text-[10px] font-bold uppercase">π 0.001</span>
        </button>

        {/* 로그인 버튼: 아이콘 색상으로 상태 표시 */}
        <button 
          onClick={handleLogin}
          className={cn(
            "flex items-center justify-center h-9 w-9 rounded-full border transition-all",
            isLoggedIn ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/20" : "bg-[#1e293b] border-slate-700"
          )}
        >
          <User className={cn("h-4 w-4", isLoggedIn ? "text-white" : "text-slate-400")} />
        </button>
      </div>

      {/* 2. 우측 하단 플로팅 언어 버튼 */}
      <div className="fixed bottom-10 right-6 z-[9999] flex flex-col items-end gap-3 notranslate">
        {isBottomLangOpen && (
          <div className="mb-2 w-32 bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
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
