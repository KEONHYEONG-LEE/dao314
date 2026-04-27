"use client";

import { Zap, Clock, ArrowRight, ExternalLink } from "lucide-react";
import { NEWS_DATA } from "@/lib/news-data"; // 아까 수정한 진짜 데이터를 불러옵니다.

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    MAINNET: "bg-blue-500/10 text-blue-500",
    COMMUNITY: "bg-emerald-500/10 text-emerald-500",
    TECH: "bg-purple-500/10 text-purple-500",
    ECONOMY: "bg-amber-500/10 text-amber-500",
  };
  return colors[category] || "bg-slate-500/10 text-slate-400";
};

export function LatestNews() {
  // 클릭 시 외부 링크로 연결하는 함수
  const handleLinkClick = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          <h2 className="text-xl font-bold text-white">최신 뉴스</h2>
        </div>
        <button className="flex items-center gap-1 text-sm text-slate-400 hover:text-blue-400 transition-colors">
          더보기
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="bg-[#1e263e]/40 rounded-2xl border border-white/5 overflow-hidden">
        {NEWS_DATA.map((news, index) => (
          <article
            key={news.id}
            onClick={() => handleLinkClick(news.url)}
            className={`flex items-start gap-4 p-4 hover:bg-white/5 transition-all cursor-pointer group ${
              index !== NEWS_DATA.length - 1 ? "border-b border-white/5" : ""
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md tracking-tighter ${getCategoryColor(
                    news.category
                  )}`}
                >
                  {news.category}
                </span>
                <span className="text-[11px] text-blue-400 font-medium">
                  {news.source}
                </span>
              </div>
              <h3 className="text-[14px] font-semibold text-slate-200 line-clamp-1 group-hover:text-blue-400 transition-colors">
                {news.title}
              </h3>
            </div>
            
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <Clock className="h-3 w-3" />
                {news.date}
              </div>
              {news.url && <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-blue-500" />}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
