"use client";

import { useState } from "react";
import { 
  Share2, 
  Heart, 
  EyeOff, 
  Bookmark, 
  ChevronDown, 
  Users,
  Youtube,
  Sparkles,
  X,
  ExternalLink
} from "lucide-react";

// 뉴스 본문에서 불필요한 HTML 태그를 완벽히 제거하는 함수
const stripHtml = (html: string) => {
  if (!html) return "";
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>?/gm, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export default function NewsCard({ category, title, content, date, source, image, url }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 깨끗하게 정제된 본문 데이터
  const cleanContent = stripHtml(content);

  const handleSummarize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    setSummary("GPNR AI가 분석 중입니다...");
    
    // 현재 헤더의 언어 설정을 감지
    const headerElement = document.querySelector('header');
    const headerText = headerElement?.innerText || "";
    
    let currentLang = "ko";
    if (headerText.includes('English')) currentLang = "en";
    else if (headerText.includes('中国') || headerText.includes('中文')) currentLang = "zh";
    else if (headerText.includes('日本語')) currentLang = "ja";
    else if (headerText.includes('Tiếng Việt')) currentLang = "vi";

    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: cleanContent, lang: currentLang }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setSummary("요약 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 뉴스 카드 목록 UI */}
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 cursor-pointer active:scale-[0.98] transition-all"
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
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

      {/* 뉴스 상세 및 AI 요약 레이어 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 p-2 bg-gray-100 rounded-full z-10">
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {image && <img src={image} alt="news" className="w-full h-48 object-cover rounded-2xl mb-4 mt-2" />}
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            
            <div className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap text-[15px]">
              {cleanContent}
            </div>

            {/* AI 요약 섹션 */}
            <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100 mb-6">
              <button 
                onClick={handleSummarize}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold mb-4 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70"
              >
                <Sparkles className="w-4 h-4" />
                {isLoading ? "분석 중..." : "GPNR AI 핵심 내용 요약하기"}
              </button>

              {summary && (
                <div className="bg-white/80 rounded-xl p-4 text-sm text-indigo-900 border border-indigo-100 animate-in fade-in zoom-in-95">
                  <p className="font-bold mb-2 flex items-center gap-1.5 underline decoration-indigo-200 underline-offset-4">
                    ✨ AI 분석 리포트
                  </p>
                  <p className="leading-relaxed">{summary}</p>
                </div>
              )}
            </div>

            {/* 하단 액션 버튼 영역 */}
            <div className="flex gap-3 mb-2">
              <a 
                href={url || "#"} 
                target="_blank" 
                className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-700 py-3 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> 원문 기사 사이트
              </a>
              <button className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors">
                <Share2 className="w-4 h-4" /> 소식 공유하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
