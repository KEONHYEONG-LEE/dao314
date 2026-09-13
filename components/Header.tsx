"use client";

import { useState, useEffect } from "react";
import { usePiNetworkAuthentication } from "../hooks/use-pi-network-authentication";

// Pi SDK window 객체 타입 확장
declare global {
  interface Window {
    Pi?: any;
  }
}

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
  const [isPaying, setIsPaying] = useState(false); // 결제 진행 중 상태
  
  const { user, isAuthenticated, logout } = usePiNetworkAuthentication();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pi SDK 0.01 Pi 후원 결제 로직
  const handleDonate = async () => {
    if (isPaying) return;

    if (!window.Pi) {
      alert("Pi Browser 환경에서만 후원이 가능합니다.");
      return;
    }

    try {
      setIsPaying(true);

      const paymentData = {
        amount: 0.01,
        memo: "GPNR App Development Support",
        metadata: { type: "donation", appId: "gpnr" }
      };

      const callbacks = {
        onReadyForServerApproval: (paymentId: string) => {
          console.log("Payment Approval Required:", paymentId);
          // 서버 승인 로직이 필요한 경우 백엔드 API 호출, 없을 경우 클라이언트 단 완료 처리 진행
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log("Payment Complete:", paymentId, txid);
          alert("0.01 Pi 후원이 성공적으로 완료되었습니다! 감사합니다.");
          setIsPaying(false);
        },
        onCancel: (paymentId: string) => {
          console.log("Payment Cancelled:", paymentId);
          setIsPaying(false);
        },
        onError: (error: Error, payment?: any) => {
          console.error("Payment Error:", error);
          alert("후원 중 오류가 발생했습니다. 다시 시도해 주세요.");
          setIsPaying(false);
        }
      };

      await window.Pi.createPayment(paymentData, callbacks);
    } catch (error) {
      console.error("Donate Error:", error);
      alert("Pi 결제창을 불러오는 중 문제가 발생했습니다.");
      setIsPaying(false);
    }
  };

  if (!mounted) {
    return (
      <header className="w-full h-[60px] bg-[#0f172a]/90 border-b border-slate-800"></header>
    );
  }

  const displayId = user?.username
    ? user.username.length > 15
      ? `${user.username.substring(0, 6)}...${user.username.substring(user.username.length - 6)}`
      : user.username
    : "";

  return (
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
            
            {/* 우측 상단 유저 상태, 후원 버튼 및 메뉴 */}
            <div className="flex items-center gap-2.5">
              
              {/* 0.01 Pi 후원 버튼 */}
              <button
                onClick={handleDonate}
                disabled={isPaying}
                className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg shadow-purple-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="text-amber-300 font-bold">π</span>
                <span>{isPaying ? "진행중..." : "0.01 Pi 후원"}</span>
              </button>

              {/* 인증 상태 표시 */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-mono text-purple-300 font-medium">
                    {displayId}
                  </span>
                </div>
              ) : (
                <div className="text-xs text-amber-400/90 bg-amber-950/30 border border-amber-800/40 px-2.5 py-1 rounded-lg">
                  🔑 ID 미인증
                </div>
              )}

              {/* 드롭다운 토글 버튼 */}
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                title="메뉴 열기"
                className={`p-2 rounded-xl text-lg font-bold transition-all ${
                  isLauncherOpen ? 'bg-slate-800 text-purple-400' : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <span className="block w-5 h-5 text-center leading-none">⋮⋮⋮</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 런처 메뉴 드롭다운 */}
      {isLauncherOpen && (
        <div className="absolute right-4 top-[65px] z-50 w-72 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2">
          <div className="text-xs text-slate-400 font-medium mb-1">연동된 KYC ID / 지갑 주소</div>
          <div className="text-xs font-bold font-mono text-slate-200 break-all select-all bg-slate-950 p-2.5 rounded-xl border border-slate-800/50 mb-3">
            {user?.username ? user.username : "등록된 ID가 없습니다."}
          </div>
          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                setIsLauncherOpen(false);
              }}
              className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs rounded-xl transition-colors"
            >
              KYC ID 해제 및 다시 입력하기
            </button>
          )}
        </div>
      )}
    </div>
  );
}
