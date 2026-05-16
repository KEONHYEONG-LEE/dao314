"use client";

import PiLogin from "./PiLogin"; 
import { useEffect, useState, useMemo, useCallback } from "react";

interface GpnrHeaderProps {
  currentCategory?: string;                     
  onCategoryChange?: (categoryId: string) => void; 
  currentLanguage?: string;                     
}

export function GpnrHeader({ 
  currentCategory = "all", 
  onCategoryChange,
  currentLanguage = "ko" 
}: GpnrHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false); 
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); 

  // 로컬 기준 오늘 날짜 인스턴스 고정
  const localToday = useMemo(() => new Date(), []);
  
  // [수정] 달력 연도와 월을 개별 상태로 분리하여 화면 강제 동기화 리렌더링 보장
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(4); // 4 = 5월

  useEffect(() => {
    setMounted(true);
    setCalendarYear(localToday.getFullYear());
    setCalendarMonth(localToday.getMonth());
  }, [localToday]);

  // 달력 동적 일자 그리드 연산 (연, 월 바뀔 때 무조건 재계산)
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

  // [수정] 달력 좌우 커서 클릭 시 '월'과 '일자 그리드'가 동시 변환되도록 원천 제어
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarYear(calendarYear - 1);
      setCalendarMonth(11);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
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

  if (!mounted) return null;

  // [구글 번역 완벽 대응] 번역기가 100% 긁어갈 수 있도록 메인 카테고리와 완벽 결합된 정적 리스트 선언
  const FIXED_LAUNCHER_ITEMS = [
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
    { id: "calendar", icon: "📅", label: "달력" } // 마지막 고정 탭
  ];

  return (
    <>
      {/* 1. 상단 단일 헤더 (두 줄 겹침 완벽 제거) */}
      <header className="sticky top-0 z-[60] w-full bg-[#0f172a]/80 border-b border-slate-800 backdrop-blur-xl transition-colors">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-[60px] items-center justify-between">
            {/* 로고 */}
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-2xl tracking-tighter">GPNR</span>
              <span className="hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest ml-2">
                Global Pi Newsroom
              </span>
            </div>
            
            {/* 우측 단일 레이아웃 컨트롤러 */}
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

      {/* 2. 9개 점 (Grid Launcher) 드롭다운 메뉴 (구글 자동 번역 100% 보장 구조) */}
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
                      // [기능 원천 복구] 클릭 시 메인 화면의 카테고리를 강제 스위칭
                      if (onCategoryChange) {
                        onCategoryChange(item.id);
                      }
                    }
                    setIsLauncherOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all group ${isSelected ? 'bg-slate-800 border-slate-600 font-bold' : 'bg-slate-800/40 border-transparent hover:bg-slate-800 hover:border-slate-700'}`}
                >
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{item.icon}</span>
                  {/* 정적 텍스트로 박아두어 구글 번역기가 17개국어로 즉시 변환하도록 마크업 */}
                  <span className="text-[11px] text-slate-300 text-center font-medium truncate w-full whitespace-nowrap">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. 달력 모달 팝업 (좌측 상단 연도/월 자동 연동 완전 해결) */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* 상단 바 타이틀 명칭 고정 */}
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
            
            {/* 달력 본체 내부 */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                {/* [버그 수정 완료] 좌측 상단 년/월이 다음달 버튼 클릭 시 무조건 동시 리렌더링되는 마크업 구조 */}
                <div className="text-sm font-black text-[#deff9a] flex items-center gap-1">
                  <span>{calendarYear}</span>년 <span>{calendarMonth + 1}</span>월
                </div>
                {/* 작동 연동 완료된 스위칭 핸들러 */}
                <div className="flex gap-3 text-sm text-slate-400">
                  <button onClick={handlePrevMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded transition-colors">◀</button>
                  <button onClick={handleNextMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded transition-colors">▶</button>
                </div>
              </div>
              
              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-500 mb-2">
                <div className="text-red-400">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div className="text-blue-400">토</div>
              </div>
              
              {/* 일자 출력 데이터 영역 */}
              <div className="grid grid-cols-7 text-center gap-y-2 text-xs text-slate-300">
                {startBlankDays.map((_, index) => (
                  <div key={`blank-${index}`} className="text-slate-700"></div>
                ))}
                
                {daysArray.map((day) => {
                  const isToday = 
                    localToday.getDate() === day && 
                    localToday.getMonth() === calendarMonth && 
                    localToday.getFullYear() === calendarYear;

                  return (
                    <div key={`day-${day}`} className="flex items-center justify-center">
                      {isToday ? (
                        <div className="bg-[#f7a145] text-slate-950 font-black rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                          {day}
                        </div>
                      ) : (
                        <span className="w-6 h-6 flex items-center justify-center">{day}</span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* 하단 캘린더 안내 영역 */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
                <div className="flex items-center gap-2 text-[#f7a145] font-semibold mb-1">
                  <span className="w-1.5 h-1.5 bg-[#f7a145] rounded-full"></span>
                  <span>[안내]</span>
                </div>
                <p className="pl-3.5">· 파이 네트워크 글로벌 에코시스템 뉴스 카운트다운 연동 중</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
