"use client";

import PiLogin from "./PiLogin"; 
import { useState, useEffect } from "react";

interface HeaderProps {
  currentCategory?: string;                     
  onCategoryChange?: (categoryId: string) => void; 
}

export function Header({ 
  currentCategory = "all", 
  onCategoryChange
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false); 
  // 헤더단에서도 필요한 경우 유저 ID를 추적할 수 있도록 상태 공간 마련
  const [piUserId, setPiUserId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // 마운트 시점에 로컬스토리지에서 지갑 ID가 있는지 확인하여 헤더 상태와 동기화
    if (typeof window !== "undefined") {
      const savedId = localStorage.getItem('pi_user_id');
      if (savedId) setPiUserId(savedId);
    }
  }, []);

  // SSR 단계에서 레이아웃 튐(Layout Shift)을 방지하기 위해 최소한의 높이를 가진 투명 헤더 틀을 반환합니다.
  if (!mounted) {
    return (
      <header className="w-full h-[60px] bg-[#0f172a]/90 border-b border-slate-800"></header>
    );
  }

  return (
    // 최상단 빈 태그(<></>) 대신 notranslate 클래스를 가진 div로 전체를 감싸서, 
    // 나중에 이 내부에 추가될 어떤 메뉴나 하위 컴포넌트(PiLogin 등)도 구글 번역이 건드리지 못하게 원천 차단합니다.
    <div className="notranslate" translate="no">
      {/* 본체 헤더 영역 */}
      <header className="sticky top-0 z-[60] w-full bg-[#0f172a]/90 border-b border-slate-800 backdrop-blur-xl transition-colors">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-[60px] items-center justify-between">
            
            {/* 로고 영역 */}
            <div className="flex items-center gap-2">
              <span 
                className="font-black text-2xl tracking-tighter text-purple-500 drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)]"
              >
                GPNR
              </span>
              <span 
                className="hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest ml-2"
              >
                Global Pi Newsroom
              </span>
            </div>
            
            {/* 우측 아이콘 메뉴 및 로그인 */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                title="메뉴 열기"
                className={`p-2 rounded-xl text-lg font-bold transition-all ${
                  isLauncherOpen ? 'bg-slate-800 text-purple-400' : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <span className="block w-5 h-5 text-center leading-none">⋮⋮⋮</span>
              </button>
              
              {/* PiLogin 컴포넌트 호출 */}
              <PiLogin />
            </div>

          </div>
        </div>
      </header>

      {/* [옵션] 런처 메뉴(앱 토글러)가 켜졌을 때 유저 지갑 정보를 보여주거나 연동할 수 있는 영역 예시 */}
      {isLauncherOpen && (
        <div className="absolute right-4 top-[65px] z-50 w-64 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2">
          <div className="text-xs text-slate-400 font-medium mb-1">연동된 Pi 네트워크 정보</div>
          <div className="text-sm font-bold text-slate-200 truncate select-all bg-slate-950 p-2 rounded-xl border border-slate-800/50">
            {piUserId ? piUserId : "로그인이 필요합니다."}
          </div>
        </div>
      )}
    </div>
  );
}
