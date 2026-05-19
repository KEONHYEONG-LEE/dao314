"use client";

import PiLogin from "./PiLogin"; 
import { useEffect, useState, useMemo, useCallback } from "react";

interface GpnrHeaderProps {
  currentCategory?: string;                     
  onCategoryChange?: (categoryId: string) => void; 
  currentLanguage?: string;                     
}

interface LauncherItem {
  id: string;
  icon: string;
  label: string;
}

export function GpnrHeader({ 
  currentCategory = "all", 
  onCategoryChange,
  currentLanguage = "ko" 
}: GpnrHeaderProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState<boolean>(false); 
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false); 

  // 로컬 기준 오늘 날짜 인스턴스 고정
  const localToday = useMemo(() => new Date(), []);
  
  // 달력 연도와 월 상태
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [calendarMonth, setCalendarMonth] = useState<number>(4); // 4 = 5월

  useEffect(() => {
    setMounted(true);
    setCalendarYear(localToday.getFullYear());
    setCalendarMonth(localToday.getMonth());
  }, [localToday]);

  // 달력 동적 일자 그리드 연산
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

  // 달력 핸들러
  const handlePrevMonth = (): void => {
    if (calendarMonth === 0) {
      setCalendarYear(calendarYear - 1);
      setCalendarMonth(11);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = (): void => {
    if (calendarMonth === 11) {
      setCalendarYear(calendarYear + 1);
      setCalendarMonth(0);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  // 파이 원타임 후원 결제 SDK 로직
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

  // 구글 번역 완벽 대응 정적 카테고리 리스트
  const FIXED_LAUNCHER_ITEMS: LauncherItem[] = [
    { id: "all", icon: "📱", label: "전체" },
    { id: "mainnet", icon: "⚡", label: "메인넷" },
    { id: "node", icon: "💻", label: "노드" },
    { id: "mining", icon: "⛏️", label: "마이닝" },
    { id: "wallet", icon: "👛", label: "지갑" },
    { id: "browser", icon: "🌐", label: "브라우저" },
    { id: "roadmap", icon: "🗺️", label: "로드맵" },
    { id: "whitepaper", icon: "📄", label: "백서" },
    { id: "community", icon: "👥", label: "커뮤니티" },
    { id: "commerce", icon: "🛒", label: "커머스" },
    { id: "kyc", icon: "🆔", label: "KYC" },
    { id: "developer", icon: "🛠️", label: "개발자" },
    { id: "ecosystem", icon: "🌱", label: "생태계" },
    { id: "outlook", icon: "🔮", label: "전망" },
    { id: "price", icon: "📈", label: "가격" },
    { id: "security", icon: "🛡️", label: "보안" },
    { id: "events", icon: "🎁", label: "이벤트" },
    { id: "legal", icon: "⚖️", label: "법률" },
    { id: "calendar", icon: "📅", label: "달력" }
  ];

  if (!mounted) return null;

  return (
    <>
      {/* 1. 상단 단일 헤더 */}
      <header className="sticky top-0 z-[60] w-full bg-[#0f172a]/80 border-b border-slate-800 backdrop-blur-xl transition-colors notranslate">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-[60px] items-center justify-between">
            {/* 로고 영역 (안전하고 직관적인 파이 보라색 테마 단색 적용) */}
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tighter text-[#e2b6ff] drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">
                GPNR
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest ml-2">
                Global Pi Newsroom
              </span>
            </div>
            
            {/* 우측 레이아웃 컨트롤러 */}
            <div className="flex items-center gap-3">
              {/* 후원하기 */}
              <button 
                onClick={handleDonation} 
                className="flex items-center gap-1 bg-[#f7a145]/20 text-[#f7a145] px-2.5 py-1 rounded-full border border-[#f7a145]/30 hover:bg-[#f7a145]/30 transition-colors text-xs font-bold"
              >
                <span>π</span>
                <span>0.001</span>
              </button>

              {/* 9개 점 앱 런처 버튼 */}
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                className={`p-2 rounded-xl text-2xl font-bold transition-all ${isLauncherOpen ? 'bg-slate-800 text-[#deff9a]' : 'text-slate-300 hover:bg-slate-800/60'}`}
              >
                ⣿
              </button>

              {/* 로그인 */}
              <div className="flex items-center">
                <PiLogin />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. 9개 점 드롭다운 메뉴 */}
      {isLauncherOpen && (
        <div className="fixed top-[65px] right-4 z-[70] w-[320px] max-h-[80vh] overflow-y-auto bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="grid gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            {FIXED_LAUNCHER_ITEMS.map((item) => {
              const isSelected = currentCategory === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "calendar") {
                      setIsCalendarOpen(true);
                    } else {
                      if (onCategoryChange) {
                        onCategoryChange(item.id);
                      }
                    }
                    setIsLauncherOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all group ${isSelected ? 'bg-slate-800 border-slate-600 font-bold' : 'bg-slate-800/40 border-transparent hover:bg-slate-800 hover:border-slate-700'}`}
                >
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="text-[11px] text-slate-300 text-center font-medium truncate w-full whitespace-nowrap">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. 달력 모달 팝업 */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📅</span> <span>달력 (Calendar)</span>
              </h3>
              <button 
                onClick={() => setIsCalendarOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-sm px-2 py-1 rounded hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm font-black text-[#deff9a] flex items-center gap-1">
                  <span>{calendarYear}</span>년 <span>{calendarMonth + 1}</span>월
                </div>
                <div className="flex gap-3 text-sm text-slate-400">
                  <button onClick={handlePrevMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded transition-colors">◀</button>
                  <button onClick={handleNextMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded transition-colors">▶</button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-500 mb-2">
                <div className="text-red-400">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div className="text-blue-400">토</div>
              </div>
