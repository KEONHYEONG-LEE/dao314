"use client";

import React, { useState, useEffect, Fragment } from 'react';
import { User, ChevronUp, Languages, Loader2 } from "lucide-react"; 
import { cn } from "@/lib/utils";

const PiLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBottomLangOpen, setIsBottomLangOpen] = useState(false);
  const [loading, setLoading] = useState(false); // 결제 진행 상태

  useEffect(() => {
    // 1. Pi SDK 초기화 (테스트넷 설정)
    if (typeof window !== 'undefined' && window.Pi) {
      window.Pi.init({ version: "2.0", sandbox: true }); // sandbox: true가 테스트넷입니다.
    }

    const savedId = localStorage.getItem('pi_user_id');
    if (savedId) setIsLoggedIn(true);

    // 구글 번역 UI 숨김 스타일
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

  // [수정] 실제 Pi 결제 로직 보완
  const handleSupport = async () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용해 주세요.");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      
      // Pi SDK 결제 생성
      const payment = await window.Pi.createPayment({
        amount: 0.001,
        memo: "GPNR 프로젝트 후원", // Pi 브라우저 결제창에 표시됨
        metadata: { orderId: `donation-${Date.now()}` },
      }, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log("결제 승인 대기:", paymentId);
          // 실제 운영 시 서버에 승인 요청을 보내야 하지만, 테스트 시에는 로그만 남깁니다.
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log("결제 완료 TXID:", txid);
          alert("성공적으로 0.001 Test Pi를 후원했습니다! 감사합니다.");
          setLoading(false);
        },
        onCancel: (paymentId: string) => {
          console.log("결제 취소:", paymentId);
          setLoading(false);
        },
        onError: (error: Error, payment?: any) => {
          console.error("결제 에러:", error);
          alert("결제 중 오류가 발생했습니다.");
          setLoading(false);
        },
      });
    } catch (err) {
      console.error("SDK 결제 호출 실패:", err);
      setLoading(false);
    }
  };

  // [수정] Pi SDK 로그인 연동 (기존 prompt 대체 권장)
  const handleLogin = async () => {
    if (isLoggedIn) {
      if (confirm("로그아웃 하시겠습니까?")) {
        localStorage.removeItem('pi_user_id');
        setIsLoggedIn(false);
        window.location.reload();
      }
      return;
    }

    try {
      // 실제 Pi SDK 로그인 호출
      const scopes = ['payments'];
      const auth = await window.Pi.authenticate(scopes, (payment: any) => {
        // 결제 불완전 처리 로직
      });
      
      localStorage.setItem('pi_user_id', auth.user.uid);
      setIsLoggedIn(true);
      alert(`${auth.user.username}님, 환영합니다!`);
    } catch (err) {
      // SDK 연동 실패 시 기존의 prompt 방식 유지 (백업용)
      const id = prompt("Pi ID를 입력해주세요:");
      if (id && id.length >= 20) {
        localStorage.setItem('pi_user_id', id);
        setIsLoggedIn(true);
      }
    }
  };

  const handleLanguageChange = (code: string) => {
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
      combo.value = code;
      combo.dispatchEvent(new Event('change'));
    }
    setIsBottomLangOpen(false);
  };

  return (
    <Fragment>
      <div className="flex items-center gap-2 notranslate">
        <button 
          onClick={handleSupport}
          disabled={loading}
          className={cn(
            "px-2.5 h-8 flex items-center rounded-full border transition-all",
            isLoggedIn 
              ? "bg-amber-100/10 text-amber-400 border-amber-500/50 hover:bg-amber-500/20" 
              : "bg-slate-800 text-slate-500 border-slate-700 opacity-60"
          )}
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
          ) : (
            <span className="text-[10px] font-bold uppercase">π 0.001</span>
          )}
        </button>

        <button 
          onClick={handleLogin}
          className={cn(
            "flex items-center justify-center h-9 w-9 rounded-full border transition-all",
            isLoggedIn ? "bg-blue-600 border-blue-400 shadow-lg" : "bg-[#1e293b] border-slate-700"
          )}
        >
          <User className={cn("h-4 w-4", isLoggedIn ? "text-white" : "text-slate-400")} />
        </button>
      </div>

      {/* 하단 언어 버튼 부분은 기존과 동일하므로 생략 */}
      {/* ... */}
    </Fragment>
  );
};

export default PiLogin;
