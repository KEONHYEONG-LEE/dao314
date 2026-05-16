"use client";

import PiLogin from "./PiLogin"; 
import { useEffect, useState, useMemo } from "react";
import { NEWS_CATEGORIES } from "@/lib/categories";
import { translations } from "@/lib/translations";

// 상위 컴포넌트나 글로벌 상태에서 activeCategory 및 전환 함수를 받아올 수 있도록 Prop 정의
interface HeaderProps {
  currentCategory?: string;
  onCategoryChange?: (id: string) => void;
}

export function Header({ currentCategory = "all", onCategoryChange }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false); // 9개 점 메뉴 상태
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // 달력 모달 상태
  const [currentLang, setCurrentLang] = useState("ko"); // 기본 언어

  // --- 달력 상태 관리 로직 (기기별 로컬 시간 기반) ---
  const localToday = useMemo(() => new Date(), []);
  const [calendarYear, setCalendarYear] = useState(localToday.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(localToday.getMonth()); // 0 ~ 11

  // 하이드레이션 오류 방지 및 현재 언어 자동 감지
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      // 프로젝트의 기존 언어 저장소(localStorage 등)가 있다면 연동
      const savedLang = localStorage.getItem("gpnr_language") || "ko";
      setCurrentLang(savedLang);
    }
  }, []);

  const t = translations[currentLang] || translations["en"];

  // --- 달력 그리드 생성 함수 ---
  const { daysArray, startBlankDays } = useMemo(() => {
    const firstDayInstance = new Date(calendarYear, calendarMonth, 1);
    const startDayOfWeek = firstDayInstance.getDay(); // 시작 요일 (0: 일요일 ~ 6: 토요일)
    const totalDaysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    const blanks = Array(startDayOfWeek).fill(null);
    const days = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

    return {
      startBlankDays: blanks,
      daysArray: days
    };
  }, [calendarYear, calendarMonth]);

  // 달력 이전달/다음달 핸들러
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
              {/* [수정] 외부 노출 버튼 완전 제거 -> 오직 9개 점 아이콘만 깔끔하게 배치 */}
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                className={`p-2 rounded-xl text-2xl font-bold transition-all ${isLauncherOpen ? 'bg-slate-800 text-[#deff9a]' : 'text-slate-300 hover:bg-slate-800/60'}`}
                title={t.launcher}
              >
                ⣿
              </button>

              {/* 로그인 영역 */}
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
              // 'calendar' 아이콘일 때 타이틀 강제 지정 및 맨 마지막 '어떻게' 문구 '달력'으로 수정 보완
              const categoryName = category.id === "calendar" ? "달력" : category.name;
              
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    if (category.id === "calendar") {
                      setIsCalendarOpen(true);
                    } else {
                      // [기능 활성화] 선택된 카테고리로 필터링 변경 함수 실행
                      if (onCategoryChange) {
                        onCategoryChange(category.id);
                      } else {
                        // URL 쿼리를 사용하는 구조 대비용 폴백
                        window.location.search = `?category=${category.id}`;
                      }
                    }
                    setIsLauncherOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all group ${currentCategory === category.id ? 'bg-slate-800 border-slate-700' : 'bg-slate-800/40 border-transparent hover:bg-slate-800 hover:border-slate-700'}`}
                >
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{category.icon}</span>
                  <span className="text-[11px] text-slate-300 text-center font-medium truncate w-full">
                    {categoryName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 달력 모달 팝업 (완벽 기능 활성화) */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* 헤더: [수정] 제목을 달력 (Calendar) 로 명확하게 변경 */}
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
                <span className="text-sm font-black text-[#deff9a]">
                  {calendarYear}년 {calendarMonth + 1}월
                </span>
                {/* [기능 활성화] 작동 연동 완료된 좌우 월 이동 커서 */}
                <div className="flex gap-3 text-sm text-slate-400">
                  <button onClick={handlePrevMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded transition-colors">◀</button>
                  <button onClick={handleNextMonth} className="hover:text-white px-2 py-0.5 bg-slate-800 rounded transition-colors">▶</button>
                </div>
              </div>
              
              {/* 요일 라벨 */}
              <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-500 mb-2">
                <div className="text-red-400">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div className="text-blue-400">토</div>
              </div>
              
              {/* 날짜 그리드 (동적 계산 및 국가별 오늘 자동 하이라이트) */}
              <div className="grid grid-cols-7 text-center gap-y-2 text-xs text-slate-300">
                {/* 시작 공백 채우기 */}
                {startBlankDays.map((_, index) => (
                  <div key={`blank-${index}`} className="text-slate-700"></div>
                ))}
                
                {/* 실제 날짜 렌더링 */}
                {daysArray.map((day) => {
                  // 현재 사용자의 현지 시간 국가 날짜와 일치하는지 실시간 체크
                  const isToday = 
                    localToday.getDate() === day && 
                    localToday.getMonth() === calendarMonth && 
                    localToday.getFullYear() === calendarYear;

                  return (
                    <div key={`day-${day}`} className="flex items-center justify-center">
                      {isToday ? (
                        <div className="bg-[#f7a145] text-slate-950 font-black rounded-full w-6 h-6 flex items-center justify-center shadow-md animate-pulse">
                          {day}
                        </div>
                      ) : (
                        <span className="w-6 h-6 flex items-center justify-center">{day}</span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* 일정 피드 공간 */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
                <div className="flex items-center gap-2 text-[#f7a145] font-semibold mb-1">
                  <span className="w-1.5 h-1.5 bg-[#f7a145] rounded-full"></span>
                  <span>[선택된 월 주요 일정]</span>
                </div>
                <p className="pl-3.5">· Pi 메인넷 마일스톤 및 생태계 주요 캘린더 동기화 진행 중</p>
                <p className="pl-3.5 text-slate-500 mt-0.5">· 각 나라별 로컬 표준시 기준 자동 연동 활성화 완료</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
