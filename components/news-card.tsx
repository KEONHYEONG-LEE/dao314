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

export default function NewsCard({ category, title, content, date, source, image }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const cleanContent = stripHtml(content);

  const handleSummarize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    setSummary("GPNR AI가 분석 중입니다...");
    
    // --- [업그레이드] 언어 감지 로직 추가 ---
    const headerElement = document.querySelector('header');
    const headerText = headerElement?.innerText || "";
    
    let currentLang = "ko"; // 기본값
    if (headerText.includes('English')) currentLang = "en";
    else if (headerText.includes('中国') || headerText.includes('中文')) currentLang = "zh";
    else if (headerText.includes('日本語')) currentLang = "ja";
    else if (headerText.includes('Tiếng Việt')) currentLang = "vi";
    // --------------------------------------

    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // lang: "ko" 대신 판별된 currentLang을 보냅니다.
        body: JSON.stringify({ content: cleanContent, lang: currentLang }),
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
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md"
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-blue-600">
              {category && category !== 'ALL' ? category : 'Pi Network'}
            </span>
          </div>
          <div className="flex gap-3 text-gray-300">
            <EyeOff className="w-4 h-4 hover:text-gray-500 transition-colors" />
            <Bookmark className="w-4 h-4 hover:text-gray-500 transition-colors" />
            <Heart className="w-4 h-4 hover:text-red-400 transition-colors" />
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">{title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{cleanContent}</p>
          
          {image && (
            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
              <img src={image} alt="news" className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
            </div>
          )}
          
          <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-50 pt-3">
            <div className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-600" />
              <span className="font-medium text-gray-600">{source || "GPNR News"}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{date}</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-3xl max-h-[92vh] overflow-y-auto p-6 relative shadow-2xl animate-in fade-in slide-in-from-bottom-10">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />
            
            <button 
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
              className="absolute right-4 top-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="mb-4">
              <Badge category={category} />
              <h2 className="text-2xl font-bold mt-2 leading-tight">{title}</h2>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <CalendarIcon /> {date} • {source || "GPNR News"}
              </p>
            </div>
            
            <div className="text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap text-[15px]">
              {cleanContent}
            </div>

            <div className="sticky bottom-0 bg-white pt-2 pb-4">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-100 shadow-inner">
                <button 
                  onClick={handleSummarize}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold mb-4 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  <Sparkles className={cn("w-5 h-5", isLoading && "animate-spin")} />
                  {isLoading ? "AI가 번역 및 요약 중..." : "GPNR AI 핵심 내용 요약하기"}
                </button>

                {summary && (
                  <div className="bg-white/90 rounded-xl p-4 text-sm text-indigo-900 border border-indigo-50 shadow-sm animate-in zoom-in-95 duration-300">
                    <p className="font-bold mb-2 flex items-center gap-1.5 text-indigo-600">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI 분석 리포트
                    </p>
                    <p className="leading-relaxed whitespace-pre-line">{summary}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// 헬퍼 컴포넌트들
function Badge({ category }: { category: string }) {
  return (
    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
      {category && category !== 'ALL' ? category : 'Pi Network'}
    </span>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
