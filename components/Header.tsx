"use client";

import PiLogin from "./PiLogin"; 
import { useEffect, useState, useCallback } from "react";
import { NEWS_CATEGORIES } from "@/lib/categories"; // 앞서 바꾼 카테고리 데이터 불러오기
import { translations } from "@/lib/translations"; // 앞서 바꾼 번역 데이터 불러오기

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false); // 9개 점 메뉴 상태
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // 달력 모달 상태
  const [currentLang, setCurrentLang] = useState("ko"); // 기본 언어 (상태에 맞게 조절 가능)

  // 하이드레이션 오류 방지
  useEffect(() => {
    setMounted(true);
    // 현재 글로벌로 선택된 언어가 있다면 가져오는 로직 연동 가능 (예: localStorage나 state)
    // const savedLang = localStorage.getItem("gpnr_lang") || "ko";
    // setCurrentLang(savedLang);
  }, []);

  // 후원 처리 함수 (기존 로직 유지)
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

  const t = translations[currentLang] || translations["en"];

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
            <div className="flex items-center gap-3">
              {/* 후원하기 버튼 */}
              <button 
                onClick={handleDonation} 
                className="flex items-center gap-1 bg-[#f7a145]/20 text-[#f7a145] px-3 py-1 rounded-full border border-[#f7a145]/30 hover:bg-[#f7a145]/30 transition-colors text-xs font-bold"
              >
                <span>π</span>
                <span>0.001</span>
              </button>

              {/* 달력(Calendar) 아이콘 버튼 */}
              <button
                onClick={() => {
                  setIsCalendarOpen(!isCalendarOpen);
                  setIsLauncherOpen(false); // 런처가 열려있다면 닫기
                }}
                className={`p-2 rounded-lg text-xl hover:bg-slate-800 transition-colors ${isCalendarOpen ? 'bg-slate-800' : ''}`}
                title={t.calendar}
              >
                📅
              </button>

              {/* 9개 점 앱 런처 아이콘 버튼 */}
              <button
                onClick={() => {
                  setIsLauncherOpen(!isLauncherOpen);
                  setIsCalendarOpen(false); // 달력이 열려있다면 닫기
                }}
                className={`p-2 rounded-lg text-xl font-bold tracking-tight hover:bg-slate-800 transition-colors ${isLauncherOpen ? 'bg-slate-800 text-[#deff9a]' : 'text-slate-300'}`}
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
          <div className="grid grid-columns-3 grid-flow-row gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            {NEWS_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  if (category.id === "calendar") {
                    setIsCalendarOpen(true);
                  } else {
                    // 원래 탭 전환 로직이나 필터 함수가 있다면 여기에 연동
                    console.log(`Selected category: ${category.id}`);
                  }
                  setIsLauncherOpen(false);
                }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all group"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{category.icon}</span>
                <span className="text-[11px] text-slate-300 text-center font-medium truncate w-full">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 샘플 스타일 캘린더 모달 팝업 */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📅</span> {t.calendar_title}
              </h3>
              <button 
                onClick={() => setIsCalendarOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-sm px-2 py-1 rounded hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            {/* 달력 바디 (샘플 2026년 5월 구조 시각화) */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-black text-[#deff9a]">2026년 5월</span>
                <div className="flex gap-2 text-xs text-slate-400">
                  <button className="hover:text-white">◀</button>
                  <button className="hover:text-white">▶</button>
                </div>
              </div>
              {/* 요일 */}
              <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-500 mb-2">
                <div className="text-red-400">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div className="text-blue-400">토</div>
              </div>
              {/* 날짜 데이터 샘플 레이아웃 (5월 15일 스승의날 강조 스타일) */}
              <div className="grid grid-cols-7 text-center gap-y-2 text-xs text-slate-300">
                {/* 1주차 공백 포함 예시 */}
                <div className="text-slate-600">26</div><div className="text-slate-600">27</div><div className="text-slate-600">28</div><div className="text-slate-600">29</div><div className="text-slate-600">30</div>
                <div className="font-bold">1</div><div className="text-blue-400 font-bold">2</div>
                <div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div className="text-blue-400">9</div>
                <div>10</div><div>11</div><div>12</div><div>13</div><div>14</div>
                {/* 15일 오늘 표시 알림 스키마 스타일 */}
                <div className="bg-[#f7a145] text-slate-950 font-black rounded-full w-5 h-5 flex items-center justify-center mx-auto shadow-md">15</div>
                <div className="text-blue-400">16</div>
                <div>17</div><div>18</div><div>19</div><div>20</div><div>21</div><div>22</div><div className="text-blue-400">23</div>
                <div>24</div><div>25</div><div>26</div><div>27</div><div>28</div><div>29</div><div className="text-blue-400">30</div>
                <div>31</div><div className="text-slate-600">1</div><div className="text-slate-600">2</div><div className="text-slate-600">3</div><div className="text-slate-600">4</div><div className="text-slate-600">5</div><div className="text-slate-600">6</div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
                <div className="flex items-center gap-2 text-[#f7a145] font-semibold mb-1">
                  <span className="w-1.5 h-1.5 bg-[#f7a145] rounded-full"></span>
                  <span>[오늘의 일정]</span>
                </div>
                <p className="pl-3.5">대한민국의 휴일 - 스승의 날 💐</p>
                <p className="pl-3.5 text-slate-500 mt-0.5">Pi 메인넷 마일스톤 카운트다운 진행 중</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
