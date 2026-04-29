"use client";

import { Zap, ArrowRight, Star, Heart, Check } from "lucide-react";
import { NEWS_DATA } from "@/lib/pi-news-v2";

export function LatestNews() {
  const handleLinkClick = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // 날짜 포맷팅 함수 (2026.04.29)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <section className="py-6 px-1">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">최신 뉴스</h2>
        </div>
        <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-400 transition-colors">
          전체보기
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="flex flex-col">
        {NEWS_DATA.map((news) => (
          <article
            key={news.id}
            onClick={() => handleLinkClick(news.sourceUrl)}
            className="flex gap-4 py-4 border-b border-white/[0.08] hover:bg-white/[0.03] transition-all cursor-pointer group items-center"
          >
            {/* 1. 좌측 텍스트 영역 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] text-orange-500 font-bold uppercase tracking-wider">
                  {news.category}
                </span>
              </div>
              
              <h3 className="text-[15px] font-semibold text-slate-200 leading-[1.4] mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                {news.title}
              </h3>

              {/* 2. 하단 메타데이터 한 줄 구성 (출처/날짜/아이콘들) */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 whitespace-nowrap">
                  <span className="text-blue-400 font-medium">{news.author || "GPNR"}</span>
                  <span>{formatDate(news.publishedAt)}</span>
                </div>
                
                <div className="flex items-center gap-3 ml-auto border-l border-white/[0.1] pl-3">
                  <Check className="w-3.5 h-3.5 text-slate-500" />
                  <Star className="w-3.5 h-3.5 text-slate-500" />
                  <Heart className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>
            </div>

            {/* 3. 우측 이미지 영역 (반으로 줄인 사이즈) */}
            {news.imageUrl && (
              <div className="w-[65px] h-[65px] flex-shrink-0 relative overflow-hidden rounded-lg bg-slate-800">
                <img 
                  src={news.imageUrl} 
                  alt="news" 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
