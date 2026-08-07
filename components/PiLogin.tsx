// @ts-nocheck
"use client";

import React, { useState, useEffect, Fragment } from 'react';
import { User, ChevronUp, Languages, Loader2, KeyRound, ShieldCheck, X } from "lucide-react"; 
import { cn } from "@/lib/utils";

// 중앙 공통 인증 훅 연결
import { usePiNetworkAuthentication } from "../hooks/use-pi-network-authentication";

const PiLogin = () => {
  // 공통 인증 훅 사용
  const { user, isAuthenticated, loginWithAddress, logout } = usePiNetworkAuthentication();
  const [isBottomLangOpen, setIsBottomLangOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [inputAddress, setInputAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 구글 번역/투명 래퍼 관련 스타일 주입 (기존 로직 100% 보존)
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

  // 후원하기 버튼 클릭 이벤트
  const handleSupport = async () => {
    if (typeof window === 'undefined' || !window.Pi) {
      alert("Pi 브라우저에서 접속하거나 SDK 로딩을 기다려주세요.");
      return;
    }

    if (!isAuthenticated) {
      alert("KYC/지갑 ID 인증 후 이용해 주세요.");
      setIsAuthModalOpen(true);
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      await window.Pi.createPayment({
        amount: 0.001,
        memo: "GPNR 프로젝트 후원",
        metadata: { orderId: `donation-${Date.now()}` },
      }, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log("결제 승인 대기:", paymentId);
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          alert("성공적으로 0.001 Test Pi를 후원했습니다!");
          setLoading(false);
        },
        onCancel: () => setLoading(false),
        onError: (error: Error) => {
          alert(`에러: ${error.message}`);
          setLoading(false);
        },
      });
    } catch (err) {
      alert("결제창을 열 수 없습니다.");
      setLoading(false);
    }
  };

  // 유저 아이콘 클릭 이벤트 (로그인 모달 열기 또는 해제)
  const handleLoginClick = () => {
    if (isAuthenticated) {
      if (confirm("연동된 KYC/지갑 ID를 해제하고 다시 입력하시겠습니까?")) {
        logout();
        setIsAuthModalOpen(true);
      }
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // 수동 인증 제출 처리
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAddress = inputAddress.trim();
    if (!cleanAddress) {
      alert("KYC인증 ID 또는 지갑주소를 입력해주세요.");
      return;
    }

    if (loginWithAddress) {
      loginWithAddress(cleanAddress);
    } else {
      // fallback 저장
      localStorage.setItem('walletAddress', cleanAddress);
      window.location.reload();
    }
    setIsAuthModalOpen(false);
    setInputAddress('');
  };

  // 언어 변경 처리
  const handleLanguageChange = (code: string) => {
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
      combo.value = code;
      combo.dispatchEvent(new Event('change'));
    }
    setIsBottomLangOpen(false);
  };

  const displayUsername = user?.username || "";

  return (
    <Fragment>
      {/* 우측 상단 후원 및 유저 프로필 영역 */}
      <div className="flex items-center gap-2 notranslate">
        <button 
          onClick={handleSupport}
          disabled={loading}
          className={cn(
            "px-2.5 h-8 flex items-center rounded-full border transition-all",
            isAuthenticated 
              ? "bg-amber-100/10 text-amber-400 border-amber-500/50 hover:bg-amber-500/20" 
              : "bg-slate-800 text-slate-500 border-slate-700 opacity-60"
          )}
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <span className="text-[10px] font-bold uppercase">π 0.001</span>}
        </button>

        <button 
          onClick={handleLoginClick}
          title={isAuthenticated && displayUsername ? `접속된 ID: ${displayUsername}` : "KYC ID 인증 필요"}
          className={cn(
            "flex items-center justify-center h-9 w-9 rounded-full border transition-all",
            isAuthenticated ? "bg-blue-600 border-blue-400 shadow-lg" : "bg-[#1e293b] border-slate-700"
          )}
        >
          <User className={cn("h-4 w-4", isAuthenticated ? "text-white" : "text-slate-400")} />
        </button>
      </div>

      {/* KYC 인증 ID / 지갑주소 입력 모달 (메인넷 동일 형태) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 notranslate">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
                <KeyRound className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">KYC인증ID 로그인</h3>
                <p className="text-xs text-slate-400">GPNR 글로벌 앱 관리 그룹</p>
              </div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                <p className="text-xs text-slate-300 mb-3 font-medium">자세한 내용을 보려면 로그인하십시오.</p>
                <label className="block text-[11px] font-bold text-indigo-300 mb-1.5 uppercase">KYC인증 ID / 지갑주소</label>
                <textarea
                  value={inputAddress}
                  onChange={(e) => setInputAddress(e.target.value)}
                  placeholder="예: GAC7XH... 또는 파이 KYC 입력"
                  className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>인증 확인 및 앱 표시하기</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 우측 하단 플로팅 언어 선택 토글 버튼 및 팝업 UI */}
      <div className="fixed bottom-10 right-6 z-[9999] flex flex-col items-end gap-3 notranslate">
        {isBottomLangOpen && (
          <div className="mb-2 w-32 bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl overflow-hidden">
            <button onClick={() => handleLanguageChange('en')} className="w-full px-4 py-3 text-sm font-bold text-white hover:bg-blue-600 flex justify-between">
              <span>English</span><span className="opacity-40">en</span>
            </button>
            <button onClick={() => handleLanguageChange('ko')} className="w-full px-4 py-3 text-sm font-bold text-white hover:bg-blue-600 flex justify-between">
              <span>한국어</span><span className="opacity-40">ko</span>
            </button>
          </div>
        )}
        <button
          onClick={() => setIsBottomLangOpen(!isBottomLangOpen)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 text-white border border-blue-400 shadow-blue-500/20 shadow-2xl"
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
