"use client"; 

import { useState } from "react";
import { 
  Share2, Heart, EyeOff, Bookmark, ChevronDown, 
  Users, Youtube, Sparkles, X, ExternalLink, Calendar 
} from "lucide-react"; 

const cn = (...classes: any[]) => classes.filter(Boolean).join(" "); 

export default function NewsCard({ category, title, content, date, source, image, url }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  // HTML 태그를 제거한 순수 텍스트 (AI 요약용)
  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").trim();
  };

  const handleSummarize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    setSummary("GPNR AI가 분석 중입니다...");
    
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: stripHtml(content), lang: "ko" }),
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
      {/* 뉴스 카드 목록 영역 */}
      <div onClick={() => setIsOpen(true)} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 cursor-pointer">
        <div className="p-4 border-b border-gray-50 flex justify-between">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">
            {category || 'Pi Network'}
          </span>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          {/* 목록에서도 태그 안보이게 처리 */}
          <p className="text-sm text-gray-500 line-clamp-2">{stripHtml(content)}</p>
        </div>
      </div> 

      {/* 뉴스 상세 모달 (이미지 17488.jpg 부분) */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-end sm:items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-3xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 p-2 bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button> 

            {image && <img src={image} alt="news" className="w-full h-52 object-cover rounded-2xl mb-6 mt-4" />}
            
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            
            {/* ★ 핵심 수정 부분: HTML 태그를 실제 요소로 변환해서 출력 ★ */}
            <div 
              className="text-gray-700 leading-relaxed mb-8 text-[16px]"
              dangerouslySetInnerHTML={{ __html: content }} 
            />

            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 mb-8">
              <button onClick={handleSummarize} disabled={isLoading} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold mb-4 flex items-center justify-center gap-2">
                <Sparkles className={isLoading ? "animate-spin" : ""} />
                {isLoading ? "분석 중..." : "GPNR AI 핵심 내용 요약하기"}
              </button> 
              {summary && <div className="text-sm text-indigo-900">{summary}</div>}
            </div> 
          </div>
        </div>
      )}
    </>
  );
}
