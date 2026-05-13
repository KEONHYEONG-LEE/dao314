"use client";

import React, { useState, useEffect, Fragment } from 'react';
import { User, ChevronUp, Languages, Loader2 } from "lucide-react"; 
import { cn } from "@/lib/utils";

const PiLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBottomLangOpen, setIsBottomLangOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initPi = () => {
      if (typeof window !== 'undefined' && window.Pi) {
        window.Pi.init({ version: "2.0", sandbox: true });
        console.log("Pi SDK Initialized");
      } else {
        setTimeout(initPi, 500);
      }
    };
    initPi();

    const savedId = localStorage.getItem('pi_user_id');
    if (savedId) setIsLoggedIn(true);

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

  const handleSupport = async () => {
    if (!window.Pi) {
      alert("Pi 브라우저에서 접속하거나 SDK 로딩을 기다려주세요.");
      return;
    }

    if (!isLoggedIn) {
      alert("로그인 후 이용해 주세요.");
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
          alert("결제 승인 단계입니다. 잠시만 기다려주세요.");
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          alert("성공적으로 0.001 Test Pi를 후원했습니다!");
          setLoading(false);
        },
        onCancel: (paymentId: string) => {
          setLoading(false);
        },
        onError: (error: Error, payment?: any) => {
          alert(`에러: ${error.message}`);
          setLoading(false);
        },
      });
    } catch (err) {
      alert("결제창을 열 수 없습니다.");
      setLoading(false);
    }
  };

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
      if (window.Pi?.authenticate) {
        const auth = await window.Pi.authenticate(['payments'], (payment: any) => {});
        localStorage.setItem('pi_user_id', auth.user.uid);
        setIsLoggedIn(true);
        alert(`${auth.user.username}님, 환영합니다!`);
      } else {
        throw new Error("SDK not ready");
      }
    } catch (err) {
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
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <span className="text-[10px] font-bold uppercase">π 0.001</span>}
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
