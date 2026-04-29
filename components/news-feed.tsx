"use client"; 

import { useState, useEffect } from "react";
import { NEWS_DATA, NewsItem } from "@/lib/pi-news-v2"; 

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<NewsItem[]>([]); 
  const [articleStatus, setArticleStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean }>>({});

  useEffect(() => {
    // 로컬 스토리지에서 상태 불러오기
    const savedStatus = localStorage.getItem('gpnr_article_status');
    if (savedStatus) setArticleStatus(JSON.parse(savedStatus));

    // 1. 카테고리 필터링
    const filtered = NEWS_DATA.filter((item: NewsItem) => {
      if (!selectedCategory || selectedCategory.toLowerCase() === "all" || selectedCategory === "모두") return true;
      return item.category.toLowerCase() === selectedCategory.toLowerCase();
    });
    
    // 2. 최신순 정렬
    const sorted = [...filtered].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    ); 
    
    setNews(sorted);
  }, [selectedCategory]); 

  // 읽음, 중요, 좋아요 토글 함수
  const toggleStatus = (id: string, type: 'read' | 'star' | 'heart', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const current = articleStatus[id] || { read: false, star: false, heart: false };
    const updatedStatus = {
      ...articleStatus,
      [id]: { ...current, [type]: !current[type] }
    };
    setArticleStatus(updatedStatus);
    localStorage.setItem('gpnr_article_status', JSON.stringify(updatedStatus));
  };

  return (
    <section className="mt-2 px-4 pb-24 max-w-3xl mx-auto">
      <div className="flex flex-col gap-3">
        {news.length > 0 ? (
          news.map((item) => {
            const status = articleStatus[item.id] || { read: false, star: false, heart: false };
            return (
              <a 
                key={item.id} 
                href={item.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-[#1e293b] rounded-xl p-4 shadow-md border border-slate-700/50 active:scale-[0.98] transition-transform"
              >
                <div className="flex gap-4">
                  {/* 1. 텍스트 영역 (좌측) */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      {/* 카테고리 (유지) */}
                      <span className="text-[10px] font-bold text-amber-500 tracking-wider uppercase mb-1 block">
                        {item.category}
                      </span>
                      {/* 제목 (유지) */}
                      <h3 className="text-[15px] font-semibold leading-snug text-slate-100 line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                    {/* 4. 하단 메타 정보 한 줄 배치 (출처/날짜/읽음/중요/좋아요) */}
                    <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400">
                      <span className="truncate max-w-[70px] font-medium text-slate-300">{item.author || "GPNR"}</span>
                      <span>{item.publishedAt.substring(0, 10).replace(/-/g, '.')}</span>
                      
                      <div className="flex items-center gap-3 ml-auto text-sm">
                        <button onClick={(e) => toggleStatus(item.id, 'read', e)} className={status.read ? "text-green-500" : "text-slate-500"}>
                          {status.read ? "●" : "○"}
                        </button>
                        <button onClick={(e) => toggleStatus(item.id, 'star', e)} className={status.star ? "text-yellow-400" : "text-slate-500"}>
                          ★
                        </button>
                        <button onClick={(e) => toggleStatus(item.id, 'heart', e)} className={status.heart ? "text-red-500" : "text-slate-500"}>
                          ♥
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 2. 이미지 영역 (우측, 사이즈 반으로 축소) */}
                  {item.imageUrl && (
                    <div className="w-20 h-20 flex-shrink-0">
                      <img 
                        src={item.imageUrl} 
                        alt="" 
                        className="w-full h-full object-cover rounded-lg bg-slate-800"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}
                </div>
              </a>
            );
          })
        ) : (
          <div className="text-center py-20 text-slate-500 text-sm">
            해당 카테고리에 뉴스가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
