"use client";

import PiLogin from "./PiLogin"; 
import { useEffect, useState, useMemo } from "react";
import { NEWS_CATEGORIES } from "@/lib/categories";

// GPNR 기존 시스템의 Props 스키마와 완벽 연동
interface HeaderProps {
  currentCategory?: string;                     // 현재 메인 화면에 선택된 카테고리 ID
  onCategoryChange?: (categoryId: string) => void; // 메인 카테고리를 변경하는 실체 함수
  currentLanguage?: string;                     // FloatingLanguageSwitcher 등에서 사용하는 전역 언어 상태
}

export function Header({ 
  currentCategory = "all", 
  onCategoryChange,
  currentLanguage = "ko" 
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false); 
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); 

  // --- [수정] 3-2) 달력 넘길 때 연도와 월이 실시간으로 변하도록 초기값 설정 ---
  const localToday = useMemo(() => new Date(), []);
  const [calendarYear, setCalendarYear] = useState(localToday.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(localToday.getMonth()); // 0 = 1월, 4 = 5월

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- 달력 동적 날짜 배열 연산 로직 ---
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

  // [수정] 3-2) 월 변경 시 내부 State를 정확히 갱신하여 타이틀과 숫자가 동시 변환되도록 처리
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

  if (!mounted) return null;

  return (
    <>
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
            
            {/* 우측 컨트롤 영역 (노출 버튼 완전 제거 및 9개 점 고정) */}
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

      {/* 9개 점 (Grid Launcher) 드롭다운 메뉴 */}
      {isLauncherOpen && (
        <div className="fixed top-[65px] right-4 z-[70] w-[320px] max-h-[80vh] overflow-y-auto bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            {/* [수정] 2번: lib/categories.ts의 정확한 순서와 한글 명칭을 그대로 실시간 매핑 */}
            {NEWS_CATEGORIES.map((category) => {
              const isSelected = currentCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    if (category.id === "calendar") {
                      setIsCalendarOpen(true);
                    } else {
                      // [기능 활성화] 상위 메인 피드 컨테이너의 탭 교체 함수와 다이렉트 맵핑 실행
                      if (onCategoryChange) {
                        onCategoryChange(category.id);
                      } else {
                        // fallback용 URL 강제 쿼리 이동
                        window.location.href = `/?category=${category.id}`;
                      }
                    }
                    setIsLauncherOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all group ${isSelected ? 'bg-slate-800 border-slate-600 font-bold' : 'bg-slate-800/40 border-transparent hover:bg-slate-800 hover:border-slate-700'}`}
                >
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{category.icon}</span>
                  <span className="text-[11px] text-slate-300 text-center font-medium truncate w-full">
                    {category.name}
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
            {/* 헤더: [수정] 3-1) 제목을 '달력 (Calendar)'으로 완벽 변경 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📅</span> 달력 (Calendar)
              </h3>
              <button 
                onClick={() => setIsCalendarOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-sm px-2 py-1 rounded hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            
            {/* 달력 바디 */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                {/* [수정] 3-2) 변환된 연도와 월이 레이블에 연동되어 반영 */}
                <span className="text-sm font-black text-[#deff9a]">
                  {calendarYear}년 {calendarMonth + 1}월
                </span>
                <div className="flex gap-3 text-sm text-slate-400">
                  <button onClick={handlePrevMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded">◀</button>
                  <button onClick={handleNextMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded">▶</button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-500 mb-2">
                <div className="text-red-400">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div className="text-blue-400">토</div>
              </div>
              
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
