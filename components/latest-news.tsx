"use client";

import { useState } from "react";
import { Zap, ArrowRight, Star, Heart, Check, ExternalLink } from "lucide-react";
import { NEWS_DATA } from "@/lib/pi-news-v2";

export function LatestNews() {
  // 현재 확장(풀다운)된 뉴스 ID 상태 관리
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 날짜 포맷팅 함수 (2026.04.29)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  // 뉴스 클릭 시 토글 함수
  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
          <div key={news.id} className="border-b border-white/[0.08]">
            <article
              onClick={() => handleToggleExpand(news.id)}
              className={`flex gap-4 py-4 px-2 transition-all cursor-pointer group items-center ${
                expandedId === news.id ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
              }`}
            >
              {/* 1. 좌측 텍스트 영역 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] text-orange-500 font-bold uppercase tracking-wider">
                    {news.category}
                  </span>
                </div>
                
                <h3 className={`text-[15px] font-semibold leading-[1.4] mb-2 line-clamp-2 transition-colors ${
                  expandedId === news.id ? "text-blue-400" : "text-slate-200 group-hover:text-blue-400"
                }`}>
                  {news.title}
                </h3>

                {/* 2. 하단 메타데이터 */}
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

              {/* 3. 우측 이미지 영역 */}
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

            {/* 풀다운 상세 본문 영역 */}
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                expandedId === news.id ? 'max-h-[800px] opacity-100 bg-black/20' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-4 pt-2">
                <div className="text-slate-300 text-[13.5px] leading-relaxed mb-4">
                  {/* 데이터에 content 필드가 있을 경우 출력 */}
                  {news.content || "상세 뉴스 내용을 준비 중입니다."}
                </div>
                <a 
                  href={news.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[12px] text-orange-400 font-medium hover:text-orange-300 transition-colors"
                  onClick={(e) => e.stopPropagation()} // 부모 클릭 이벤트 전파 방지
                >
                  <ExternalLink className="w-3 h-3" />
                  원문 기사 보기
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
