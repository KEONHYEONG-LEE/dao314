"use client";

import { useState } from "react";
import { 
  Share2, 
  MessageSquare, 
  Heart, 
  EyeOff, 
  Bookmark, 
  ChevronDown, 
  Users,
  Youtube,
  Sparkles,
  X
} from "lucide-react";

export default function NewsCard({ title, content, date, source, image }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // AI 요약 요청 함수
  const handleSummarize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    setSummary("GPNR AI가 분석 중입니다...");
    
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, lang: "ko" }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setSummary("요약 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* --- 뉴스 카드 목록 UI --- */}
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-blue-600">Global Community</span>
          </div>
          <div className="flex gap-3 text-gray-300">
            <EyeOff className="w-4 h-4" />
            <Bookmark className="w-4 h-4" />
            <Heart className="w-4 h-4" />
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">{title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{content}</p>
          
          {image && (
            <img src={image} alt="news" className="w-full h-48 object-cover rounded-xl mb-4" />
          )}
          
          <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-50 pt-3">
            <div className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-600" />
              <span>{source || "Pi Network Community"}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{date}</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* --- 뉴스 상세 및 AI 요약 레이어 (모달) --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 p-2 bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mt-4 mb-4">{title}</h2>
            
            {/* 본문 내용 (태그 없이 깨끗하게 출력) */}
            <div className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
              {content}
            </div>

            {/* AI 요약 섹션 */}
            <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100 mb-6">
              <button 
                onClick={handleSummarize}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mb-4 shadow-lg shadow-indigo-200"
              >
                <Sparkles className="w-4 h-4" />
                {isLoading ? "분석 중..." : "GPNR AI 핵심 내용 요약하기"}
              </button>

              {summary && (
                <div className="bg-white/80 rounded-xl p-4 text-sm text-indigo-900 border border-indigo-100">
                  <p className="font-bold mb-2">✨ AI 분석 리포트</p>
                  <p className="leading-relaxed">{summary}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
