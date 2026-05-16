"use client";

import PiLogin from "./PiLogin"; 
import { useEffect, useState, useMemo, useCallback } from "react";
import { NEWS_CATEGORIES } from "@/lib/categories";

interface GpnrHeaderProps {
  currentCategory?: string;                     // 현재 메인 화면에 선택된 카테고리 ID
  onCategoryChange?: (categoryId: string) => void; // 메인 카테고리를 변경하는 실체 함수
  currentLanguage?: string;                     // 전역 번역 상태 코드
}

export function GpnrHeader({ 
  currentCategory = "all", 
  onCategoryChange,
  currentLanguage = "ko" 
}: GpnrHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false); 
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); 

  // 현지 국가 기준 표준시 오늘 날짜 감지
  const localToday = useMemo(() => new Date(), []);
  
  // 달력 조작을 위한 연도/월 상태 관리
  const [calendarYear, setCalendarYear] = useState(localToday.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(localToday.getMonth()); // 0 = 1월

  useEffect(() => {
    setMounted(true);
  }, []);

  // [버그 수정] 달력 데이터 연산 로직 - calendarYear, calendarMonth 변경 시 완벽히 재연산
  const { daysArray, startBlankDays } = useMemo(() => {
    const firstDayInstance = new Date(calendarYear, calendarMonth, 1);
    const startDayOfWeek = firstDayInstance.getDay(); 
    const totalDaysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    const blanks = Array(startDayOfWeek).fill(null);
    const days = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

    return {
      startBlankDays: blanks,
      daysArray: days
    };
  }, [calendarYear, calendarMonth]);

  // [수정] 좌측 상단 월 이름이 같이 바뀌도록 보장하는 핸들러
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarYear(prev => prev - 1);
      setCalendarMonth(11);
    } else {
      setCalendarMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarYear(prev => prev + 1);
      setCalendarMonth(0);
    } else {
      setCalendarMonth(prev => prev + 1);
    }
  };

  // [파이 SDK 연동] 후원 처리 함수 추가 
  const handleDonation = useCallback(async () => {
    if (typeof window !== "undefined" && (window as any).Pi) {
      try {
        await (window as any).Pi.createPayment({
          amount: 0.001,
          memo: "GPNR 서비스 후원",
          metadata: { type: "one-time-donation", app: "GPNR" }
        }, {
          onReadyForServerApproval: (paymentId: string) => {
            fetch('/api/payments/approve', { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId }) 
            });
          },
          onReadyForServerCompletion: (paymentId: string, txid: string) => {
            fetch('/api/payments/complete', { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid }) 
            });
            alert("0.001 Pi 후원이 완료되었습니다. 감사합니다!");
          },
          onCancel: (paymentId: string) => console.log("후원 취소됨"),
          onError: (error: Error) => console.error("결제 오류:", error),
        });
      } catch (err) {
        console.error("Pi SDK 결제 실행 실패:", err);
      }
    } else {
      alert("Pi Browser에서 접속하거나 SDK 로딩을 확인해주세요.");
    }
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* 본체 헤더 영역 (단일 컴포넌트로 두 줄 겹침 현상 원천 차단) */}
      <header className="sticky top-0 z-[60] w-full bg-[#0f172a]/80 border-b border-slate-800 backdrop-blur-xl transition-colors">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-[60px] items-center justify-between">
            {/* 로고 영역 */}
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-2xl tracking-tighter">GPNR</span>
              <span className="hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest ml-2">
                Global Pi Newsroom
              </span>
            </div>
            
            {/* 우측 컨트롤 영역 */}
            <div className="flex items-center gap-3">
              {/* [요청 반영] 후원하기 파이 버튼 탑재 */}
              <button 
                onClick={handleDonation} 
                className="flex items-center gap-1 bg-[#f7a145]/20 text-[#f7a145] px-2.5 py-1 rounded-full border border-[#f7a145]/30 hover:bg-[#f7a145]/30 transition-colors text-xs font-bold"
              >
                <span>π</span>
                <span>0.001</span>
              </button>

              {/* 9개 점 앱 런처 아이콘 */}
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                className={`p-2 rounded-xl text-2xl font-bold transition-all ${isLauncherOpen ? 'bg-slate-800 text-[#deff9a]' : 'text-slate-300 hover:bg-slate-800/60'}`}
              >
                ⣿
              </button>

              {/* 로그인 버튼 */}
              <div className="flex items-center">
                <PiLogin />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 9개 점 (Grid Launcher) 드롭다운 메뉴 */}
      {isLauncherOpen && (
        <div className="
