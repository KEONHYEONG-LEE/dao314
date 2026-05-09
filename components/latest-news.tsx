"use client";

import { useState } from "react";
import { Zap, ArrowRight, Star, Heart, Check, ExternalLink } from "lucide-react";
import { NEWS_DATA } from "@/lib/pi-news-v2";

export function LatestNews() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
      {/* 상단 타이틀 영역 */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">최신 뉴스</h2>
        </div>
      </div>

      <div className="flex flex-col">
        {NEWS_DATA.map((news) => (
          <div key={news.id} className="border-b border-white/[0.08]">
            <article
              onClick={() => handleToggleExpand(news.id)}
              className={`flex gap-4 py-4 px-2 transition-all cursor-pointer group items-center ${
                expandedId === news.id ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] text-orange-500 font-bold uppercase tracking-wider">
                    {news.category}
                  </span>
                </div>
                
                <h3 className={`text-[15px] font-semibold leading-[1.4] mb-2 line-clamp-2 transition-colors ${
                  expandedId === news.id ? "text-blue-400" : "text-slate-200"
                }`}>
                  {news.title}
                </h3>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="text-blue-400 font-medium">{news.author || "GPNR"}</span>
                    <span>{formatDate(news.publishedAt)}</span>
                  </div>
                </div>
              </div>

              {news.imageUrl && (
                <div className="w-[65px] h-[65px] flex-shrink-0 relative overflow-hidden rounded-lg bg-slate-800">
                  <img src={news.imageUrl} alt="news" className="w-full h-full object-cover" />
                </div>
              )}
            </article>

            {/* [수정 포인트] 클릭 시 나타나는 원문 기사 영역 */}
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                expandedId === news.id ? 'max-h-[2000px] opacity-100 bg-white/[0.02]' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-4 pt-2 border-t border-white/[0.05]">
                {/* 제목 중복 없이 바로 전문(content) 출력 */}
                <div className="text-slate-300 text-[14px] leading-relaxed mb-6 whitespace-pre-wrap">
                  {news.content || "기사 전문을 불러오는 중입니다..."}
                </div>
                
                <a 
                  href={news.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[12px] text-blue-400 font-medium hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3" />
                  원문 기사 사이트에서 보기
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
