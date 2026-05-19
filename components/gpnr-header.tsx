// @ts-nocheck
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

  const localToday = useMemo(() => new Date(), []);
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [calendarMonth, setCalendarMonth] = useState<number>(4);

  useEffect(() => {
    setMounted(true);
    setCalendarYear(localToday.getFullYear());
    setCalendarMonth(localToday.getMonth());
  }, [localToday]);

  const { daysArray, startBlankDays } = useMemo(() => {
    const firstDayInstance = new Date(calendarYear, calendarMonth, 1);
    const startDayOfWeek = firstDayInstance.getDay(); 
    const totalDaysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    return {
      startBlankDays: Array(startDayOfWeek).fill(null),
      daysArray: Array.from({ length: totalDaysInMonth }, (_, i) => i + 1)
    };
  }, [calendarYear, calendarMonth]);

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

  const handleDonation = useCallback(async () => {
    if (typeof window !== "undefined" && (window as any).Pi) {
      try {
        await (window as any).Pi.createPayment({
          amount: 0.001,
          memo: "GPNR 서비스 후원",
          metadata: { type: "one-time-donation", app: "GPNR" }
        }, {
          onReadyForServerApproval: (paymentId: string) => {
            fetch('/api/payments/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId }) });
          },
          onReadyForServerCompletion: (paymentId: string, txid: string) => {
            fetch('/api/payments/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId, txid }) });
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
      {/* 상단 헤더 높이를 h-[44px]로 완전 슬림하게 줄이고 패딩 최적화 */}
      <header className="sticky top-0 z-[60] w-full bg-[#0f172a]/80 border-b border-slate-800 backdrop-blur-xl transition-colors notranslate">
        <div className="mx-auto max-w-7xl px-3">
          <div className="flex h-[44px] items-center justify-between">
            
            {/* 로고 영역 (원래 주황/빨강 조명 효과 100% 유지) */}
            <div className="flex items-center gap-2">
              <span 
                className="font-black text-lg tracking-tighter" 
                style={{ animation: 'gpnr-lighting 14s steps(1) infinite' }}
              >
                GPNR
                <style>{`
                  @keyframes gpnr-lighting {
                    0%, 100% { color: #6b0b8c; text-shadow: 0 0 12px rgba(107, 11, 140, 0.5); }
                    14.2% { color: #ef4444; text-shadow: none; }
                    28.4% { color: #f59e0b; text-shadow: none; }
                    42.6% { color: #eab308; text-shadow: none; }
                    56.8% { color: #22c55e; text-shadow: none; }
                    71.0% { color: #3b82f6; text-shadow: none; }
                    85.2% { color: #a855f7; text-shadow: none; }
                  }
                `}</style>
              </span>
            </div>
            
            {/* 우측 컨트롤러 영역 */}
            <div className="flex items-center gap-2">
              {/* 후원하기 버튼 컴팩트화 */}
              <button 
                onClick={handleDonation} 
                className="flex items-center gap-0.5 bg-[#f7a145]/20 text-[#f7a145] px-2 py-0.5 rounded-full border border-[#f7a145]/30 hover:bg-[#f7a145]/30 transition-colors text-[10px] font-bold"
              >
                <span>π</span>
                <span>0.001</span>
              </button>

              {/* 메뉴 버튼: 9개 점을 90도 돌린 형태인 '☰' 기호로 직접 교체하여 완벽하게 가로 정렬 */}
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                className={`px-2 py-1 rounded-lg text-lg font-bold transition-all ${isLauncherOpen ? 'bg-slate-800 text-[#deff9a]' : 'text-slate-300 hover:bg-slate-800/60'}`}
              >
                ☰
              </button>

              {/* 로그인 영역 */}
              <div className="flex items-center scale-90 origin-right">
                <PiLogin />
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* 2. 9개 점 드롭다운 메뉴 (기존 위치 최적화) */}
      {isLauncherOpen && (
        <div className="fixed top-[49px] right-4 z-[70] w-[320px] max-h-[80vh] overflow-y-auto bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="grid gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            {FIXED_LAUNCHER_ITEMS.map((item) => {
              const isSelected = currentCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "calendar") { setIsCalendarOpen(true); } 
                    else { if (onCategoryChange) onCategoryChange(item.id); }
                    setIsLauncherOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all group ${isSelected ? 'bg-slate-800 border-slate-600 font-bold' : 'bg-slate-800/40 border-transparent hover:bg-slate-800 hover:border-slate-700'}`}
                >
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="text-[11px] text-slate-300 text-center font-medium truncate w-full whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. 달력 모달 팝업 (기존 기능 유지) */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📅</span> <span>달력 (Calendar)</span>
              </h3>
              <button onClick={() => setIsCalendarOpen(false)} className="text-slate-400 hover:text-white font-bold text-sm px-2 py-1 rounded hover:bg-slate-800">✕</button>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm font-black text-[#deff9a] flex items-center gap-1"><span>{calendarYear}</span>년 <span>{calendarMonth + 1}</span>월</div>
                <div className="flex gap-3 text-sm text-slate-400">
                  <button onClick={handlePrevMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded transition-colors">◀</button>
                  <button onClick={handleNextMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded transition-colors">▶</button>
                </div>
              </div>
              <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-500 mb-2">
                <div className="text-red-400">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div className="text-blue-400">토</div>
              </div>
              <div className="grid grid-cols-7 text-center gap-y-2 text-xs text-slate-300">
                {startBlankDays.map((_, index) => <div key={`blank-${index}`} className="text-slate-700"></div>)}
                {daysArray.map((day) => {
                  const isToday = localToday.getDate() === day && localToday.getMonth() === calendarMonth && localToday.getFullYear() === calendarYear;
                  return (
                    <div key={`day-${day}`} className="flex items-center justify-center">
                      {isToday ? <div className="bg-[#f7a145] text-slate-950 font-black rounded-full w-6 h-6 flex items-center justify-center shadow-md">{day}</div> : <span className="w-6 h-6 flex items-center justify-center">{day}</span>}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
                <div className="flex items-center gap-2 text-[#f7a145] font-semibold mb-1"><span className="w-1.5 h-1.5 bg-[#f7a145] rounded-full"></span><span>[안내]</span></div>
                <p className="pl-3.5">· 파이 네트워크 글로벌 에코시스템 뉴스 카운트다운 연동 중</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
