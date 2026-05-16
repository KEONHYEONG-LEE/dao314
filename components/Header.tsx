"use client";

import PiLogin from "./PiLogin"; 
import { useEffect, useState, useMemo } from "react";
import { NEWS_CATEGORIES } from "@/lib/categories";
import { translations } from "@/lib/translations";

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

  // 기기별 로컬 오늘 날짜 감지
  const localToday = useMemo(() => new Date(), []);
  
  // 달력 클릭 제어를 위한 독립적인 연도/월 상태 관리
  const [calendarYear, setCalendarYear] = useState(localToday.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(localToday.getMonth()); // 0 = 1월, 11 = 12월

  useEffect(() => {
    setMounted(true);
  }, []);

  // 전역 언어 상태에 맞춘 번역본 맵핑
  const t = useMemo(() => {
    return translations[currentLanguage] || translations["en"];
  }, [currentLanguage]);

  // 달력 모달이 열릴 때마다 항상 사용자의 '오늘 날짜 기준' 월로 초기화되도록 보장
  useEffect(() => {
    if (isCalendarOpen) {
      setCalendarYear(localToday.getFullYear());
      setCalendarMonth(localToday.getMonth());
    }
  }, [isCalendarOpen, localToday]);

  // 달력 동적 날짜 배열 연산 (calendarYear와 calendarMonth의 변화를 실시간 감시)
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

  // 월 변경 시 연도와 월 텍스트가 강제 리렌더링되며 함께 순환하도록 상태 제어
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
            
            {/* 우측 컨트롤 영역 */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                className={`p-2 rounded-xl text-2xl font-bold transition-all ${isLauncherOpen ? 'bg-slate-800 text-[#deff9a]' : 'text-slate-300 hover:bg-slate-800/60'}`}
                title={t.launcher || "Launcher"}
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
        <div className="fixed top-[65px] right-4 z-[70] w-[320px] max-h-[80vh] overflow-y-auto bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="grid gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            {NEWS_CATEGORIES.map((category) => {
              const isSelected = currentCategory === category.id;
              
              // 달력 항목 명칭을 강제 패치하고, 나머지 언어는 카테고리 텍스트 번역 매핑 보완 가능
              const displayCategoryName = category.id === "calendar" ? (t.calendar || "달력") : category.name;
              
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    if (category.id === "calendar") {
                      setIsCalendarOpen(true);
                    } else {
                      if (onCategoryChange) {
                        onCategoryChange(category.id);
                      } else {
                        window.location.search = `?category=${category.id}`;
                      }
                    }
                    setIsLauncherOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all group ${isSelected ? 'bg-slate-800 border-slate-600 font-bold' : 'bg-slate-800/40 border-transparent hover:bg-slate-800 hover:border-slate-700'}`}
                >
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{category.icon}</span>
                  <span className="text-[11px] text-slate-300 text-center font-medium truncate w-full">
                    {displayCategoryName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 달력 모달 팝업 */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* 헤더: 제목을 달력 (Calendar) 로 고정 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📅</span> {t.calendar || "달력"} (Calendar)
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
                <span className="text-sm font-black text-[#deff9a]">
                  {calendarYear}년 {calendarMonth + 1}월
                </span>
                <div className="flex gap-3 text-sm text-slate-400">
                  <button onClick={handlePrevMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded transition-colors">◀</button>
                  <button onClick={handleNextMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded transition-colors">▶</button>
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
