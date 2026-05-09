"use client";

import { useState } from "react";
import { Zap, ArrowRight, Star, Heart, Check, ExternalLink } from "lucide-react";
import { NEWS_DATA } from "@/lib/pi-news-v2"; // 데이터 경로가 다를 경우 수정 필요

export function LatestNews() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 다국어 텍스트 처리 함수 (types.ts 규격 대응)
  const getText = (field: string | { ko: string; en: string }) => {
    if (typeof field === "string") return field;
    return field.ko || field.en; // 우선 한국어, 없으면 영어
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
    <section className="py-6 px-1">
      {/* 타이틀 생략... */}
      <div className="flex flex-col">
        {NEWS_DATA.map((news) => (
          <div key={news.id} className="border-b border-white/[0.08]">
            <article
              onClick={() => handleToggleExpand(news.id)}
              className={`flex gap-4 py-4 px-2 transition-all cursor-pointer items-center ${
                expandedId === news.id ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-orange-500 font-bold mb-1">{news.category}</div>
                <h3 className={`text-[15px] font-semibold leading-[1.4] mb-2 line-clamp-2 ${
                  expandedId === news.id ? "text-blue-400" : "text-slate-200"
                }`}>
                  {getText(news.title)}
                </h3>
                <div className="text-[11px] text-slate-500">
                  <span className="text-blue-400 mr-2">{news.author}</span>
                  {formatDate(news.publishedAt)}
                </div>
              </div>
              {news.imageUrl && (
                <div className="w-[65px] h-[65px] rounded-lg overflow-hidden bg-slate-800">
                  <img src={news.imageUrl} alt="news" className="w-full h-full object-cover" />
                </div>
              )}
            </article>

            {/* 전문 보기 영역 */}
            <div className={`transition-all duration-300 overflow-hidden ${
              expandedId === news.id ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="p-4 pt-2 bg-black/20">
                {/* [핵심] 제목 없이 바로 기사 전문 출력 */}
                <div className="text-slate-300 text-[14px] leading-[1.8] whitespace-pre-wrap mb-6">
                  {getText(news.content)}
                </div>
                
                <a 
                  href={news.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[12px] text-blue-400 flex items-center gap-1 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3" /> 원문 사이트에서 보기
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
