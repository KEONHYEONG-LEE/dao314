"use client";

import { useState } from "react";
import { Zap, ArrowRight, Star, Heart, Check, ExternalLink, BookOpen } from "lucide-react";
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
      {/* 헤더 섹션 생략... */}

      <div className="flex flex-col">
        {NEWS_DATA.map((news) => (
          <div key={news.id} className="border-b border-white/[0.08]">
            <article
              onClick={() => handleToggleExpand(news.id)}
              className={`flex gap-4 py-4 px-2 transition-all cursor-pointer group items-center ${
                expandedId === news.id ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
              }`}
            >
              {/* 리스트 아이템 UI (기존과 동일) ... */}
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
                {/* 메타데이터 영역... */}
              </div>
              {/* 이미지 영역... */}
            </article>

            {/* 개선된 상세 본문 영역 */}
            <div 
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                expandedId === news.id ? 'max-h-[2000px] opacity-100 bg-slate-900/40' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-5 border-t border-white/[0.05]">
                {/* 1. 상세 읽기 모드 강조 아이콘 */}
                <div className="flex items-center gap-2 mb-4 text-blue-400">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-widest">Detail View</span>
                </div>

                {/* 2. 본문 내용: 실제 데이터가 길게 들어와야 합니다 */}
                <div className="text-slate-300 text-[14.5px] leading-[1.8] mb-6 whitespace-pre-wrap">
                  {/* 제비님, 이 부분에 news.fullContent 같은 더 긴 데이터를 매핑해야 합니다 */}
                  {news.content && news.content.length > news.title.length 
                    ? news.content 
                    : `${news.content}\n\n(상세 기사 전문을 불러오는 중입니다. 파이 네트워크의 최신 동향을 GPNR에서 확인하세요...)`}
                </div>

                {/* 3. 하단 액션 버튼 */}
                <div className="flex items-center justify-between border-t border-white/[0.05] pt-4">
                  <button className="flex items-center gap-2 text-[12px] text-slate-400 hover:text-white">
                    <Heart className="w-4 h-4" />
                    저장하기
                  </button>
                  <a 
                    href={news.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12px] text-orange-400 font-medium hover:bg-orange-400/10 px-3 py-1.5 rounded-full transition-colors border border-orange-400/20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" />
                    출처에서 보기
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
