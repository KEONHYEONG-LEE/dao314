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

// 뉴스 본문에서 HTML 태그를 완전히 제거하는 안전한 함수
const stripHtml = (html: string) => {
  if (!html) return "";
  // 1. <style>, <script> 등 내용까지 지워야 하는 태그 처리
  // 2. 모든 HTML 태그 제거 및 엔티티(&nbsp; 등) 공백 처리
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>?/gm, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export default function NewsCard({ category, title, content, date, source, image }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 깨끗하게 정제된 본문 데이터
  const cleanContent = stripHtml(content);

  const handleSummarize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    setSummary("GPNR AI가 분석 중입니다...");
    
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: cleanContent, lang: "ko" }),
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
            {/* 'ALL' 대신 실제 데이터의 카테고리 표시 (값이 없으면 기본값 사용) */}
            <span className="text-xs font-bold text-blue-600">
              {category && category !== 'ALL' ? category : 'Pi Network'}
            </span>
          </div>
          <div className="flex gap-3 text-gray-300">
            <EyeOff className="w-4 h-4" />
            <Bookmark className="w-4 h-4" />
            <Heart className="w-4 h-4" />
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">{title}</h3>
          {/* 정제된 텍스트만 2줄로 표시 */}
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{cleanContent}</p>
          
          {image && (
            <img src={image} alt="news" className="w-full h-48 object-cover rounded-xl mb-4" />
          )}
          
          <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-50 pt-3">
            <div className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-600" />
              <span>{source || "GPNR News"}</span>
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
            
            {/* 상세 본문도 깨끗하게 출력 */}
            <div className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
              {cleanContent}
            </div>

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
