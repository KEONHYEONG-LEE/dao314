"use client";

import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { NEWS_DATA } from "@/lib/pi-news-v2.ts";

export function LatestNews() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 다국어 및 문자열 데이터 통합 처리 (안정성 강화)
  const getText = (field: any) => {
    if (!field) return ""; 
    if (typeof field === "string") return field;
    // 사용자의 언어 설정에 맞게 ko 우선, 없으면 en 반환
    return field.ko || field.en || ""; 
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-6 px-1 bg-[#0a0a0a]"> {/* 배경색 명확히 지정 */}
      <div className="flex flex-col">
        {NEWS_DATA.map((news) => (
          <div key={news.id} className="border-b border-white/[0.08]">
            <article
              onClick={() => handleToggleExpand(news.id)}
              className={`flex gap-4 py-5 px-3 transition-all cursor-pointer items-center ${
                expandedId === news.id ? "bg-white/[0.07]" : "hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded font-bold uppercase">
                    {news.category}
                  </span>
                </div>
                <h3 className={`text-[15px] font-semibold leading-[1.5] mb-2 transition-colors ${
                  expandedId === news.id ? "text-blue-400" : "text-slate-200"
                } ${expandedId !== news.id && "line-clamp-2"}`}>
                  {getText(news.title)}
                </h3>
                <div className="text-[11px] text-slate-500 flex items-center gap-3">
                  <span className="text-blue-400 font-medium">{news.author}</span>
                  <span>{formatDate(news.publishedAt)}</span>
                  {expandedId === news.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </div>
              </div>
              
              {/* 이미지가 있고, 리스트 상태일 때만 작게 표시 */}
              {news.imageUrl && expandedId !== news.id && (
                <div className="w-[70px] h-[70px] rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                  <img src={news.imageUrl} alt="news" className="w-full h-full object-cover" />
                </div>
              )}
            </article>

            {/* 전문 보기 영역: 애니메이션과 여백 최적화 */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
              expandedId === news.id ? 'max-h-[5000px] opacity-100 border-t border-white/[0.05]' : 'max-h-0 opacity-0'
            }`}>
              <div className="p-5 bg-white/[0.02]">
                {/* 기사 상단 큰 이미지 (전문 보기 시 확장) */}
                {news.imageUrl && (
                  <div className="w-full h-48 rounded-xl overflow-hidden mb-5">
                    <img src={news.imageUrl} alt="full-content" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* [핵심] 전문 출력 영역 */}
                <div className="text-slate-300 text-[15px] underline-offset-4 leading-[1.9] whitespace-pre-wrap break-words">
                  {getText(news.content)}
                </div>
                
                <div className="mt-8 pt-4 border-t border-white/[0.05] flex justify-between items-center">
                  <a 
                    href={news.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[13px] text-blue-400 flex items-center gap-1.5 hover:text-blue-300 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> 
                    <span>원문 출처 이동</span>
                  </a>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(null);
                    }}
                    className="text-[12px] text-slate-500 hover:text-slate-300"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
