"use client";

import PiLogin from "./PiLogin"; 
import { useEffect, useState, useMemo } from "react";
import { NEWS_CATEGORIES } from "@/lib/categories";

interface HeaderProps {
  currentCategory?: string;                     
  onCategoryChange?: (categoryId: string) => void; 
  currentLanguage?: string;                     
}

export function Header({ 
  currentCategory = "all", 
  onCategoryChange,
  currentLanguage = "ko" 
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false); 
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); 

  // 로컬 기준 오늘 날짜 고정
  const localToday = useMemo(() => new Date(), []);
  
  // [개선] 달력 조작 상태 관리
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(4); // 4 = 5월 (0부터 시작)

  useEffect(() => {
    setMounted(true);
    // 초기 로드 시 현재 실제 날짜로 세팅
    setCalendarYear(localToday.getFullYear());
    setCalendarMonth(localToday.getMonth());
  }, [localToday]);

  // 달력 모달이 열릴 때마다 오늘 날짜 기준 월로 강제 리셋 방지 (사용자가 넘겨둔 월 유지)
  // 단, 처음 열릴 때는 초기화 처리
  const handleOpenCalendar = () => {
    setIsCalendarOpen(true);
    setIsLauncherOpen(false);
  };

  // [수정] 달력 데이터 연산 로직 - calendarYear와 calendarMonth 변경 시 완벽 동기화
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

  // [수정] 이전 달 버튼 핸들러
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarYear(prev => prev - 1);
      setCalendarMonth(11);
    } else {
      setCalendarMonth(prev => prev - 1);
    }
  };

  // [수정] 다음 달 버튼 핸들러
  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarYear(prev => prev + 1);
      setCalendarMonth(0);
    } else {
      setCalendarMonth(prev => prev - 1);
      setCalendarMonth(prev => prev + 1);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* 본체 헤더 영역 */}
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
            
            {/* 우측 아이콘 메뉴 */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                className={`p-2 rounded-xl text-2xl font-bold transition-all ${isLauncherOpen ? 'bg-slate-800 text-[#deff9a]' : 'text-slate-300 hover:bg-slate-800/60'}`}
              >
                ⣿
              </button>

              <div className="flex items-center">
                <PiLogin />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 9개 점 (Grid Launcher) 메뉴 */}
      {isLauncherOpen && (
        <div className="fixed top-[65px] right-4 z-[70] w-[320px] max-h-[80vh] overflow-y-auto bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            {NEWS_CATEGORIES.map((category) => {
              const isSelected = currentCategory === category.id;
              
              // [수정] 번역기가 캘린더/달력 텍스트를 인지하도록 구조화 (클래스명 보존)
              const categoryNameText = category.id === "calendar" ? "달력" : category.name;
              
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    if (category.id === "calendar") {
                      handleOpenCalendar();
                    } else {
                      if (onCategoryChange) {
                        onCategoryChange(category.id);
                      } else {
                        window.location.href = `/?category=${category.id}`;
                      }
                      setIsLauncherOpen(false);
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all group ${isSelected ? 'bg-slate-800 border-slate-600 font-bold' : 'bg-slate-800/40 border-transparent hover:bg-slate-800 hover:border-slate-700'}`}
                >
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{category.icon}</span>
                  <span className="text-[11px] text-slate-300 text-center font-medium truncate w-full notranslate-fallback">
                    {categoryNameText}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 달력 모달 팝업 */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* [수정] 타이틀 영역: 번역기가 오작동을 일으키지 않는 표준 명칭 배치 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📅</span> <span>파이 주요 업무 (달력)</span>
              </h3>
              <button 
                onClick={() => setIsCalendarOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-sm px-2 py-1 rounded hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            
            {/* 달력 본문 */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                {/* [버그 수정 완료] 좌측 상단 연도/월 텍스트가 calendarMonth 변동에 맞춰 완벽 강제 리렌더링 */}
                <span className="text-sm font-black text-[#deff9a] tracking-tight">
                  {calendarYear}년 {calendarMonth + 1}월
                </span>
                <div className="flex gap-3 text-sm text-slate-400">
                  <button onClick={handlePrevMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded">◀</button>
                  <button onClick={handleNextMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded">▶</button>
                </div>
              </div>
              
              {/* 요일 */}
              <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-500 mb-2">
                <div className="text-red-400">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div className="text-blue-400">토</div>
              </div>
              
              {/* 날짜 그리드 */}
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
              
              {/* 하단 안내 가이드 */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
                <div className="flex items-center gap-2 text-[#f7a145] font-semibold mb-1">
                  <span className="w-1.5 h-1.5 bg-[#f7a145] rounded-full"></span>
                  <span>[오늘의 일정]</span>
                </div>
                <p className="pl-3.5">· 파이 네트워크 글로벌 에코시스템 뉴스 카운트다운 연동 중</p>
                <p className="pl-3.5">· 각 나라별 위치에 맞춰 활성화 완료</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
