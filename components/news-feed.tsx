"use client"; 

import { useState, useEffect } from "react";
import { NEWS_DATA, NewsItem } from "@/lib/pi-news-v2"; 

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<NewsItem[]>([]); 
  const [status, setStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean }>>({});

  useEffect(() => {
    const saved = localStorage.getItem('gpnr_status');
    if (saved) setStatus(JSON.parse(saved));

    const filtered = NEWS_DATA.filter((item: NewsItem) => {
      if (!selectedCategory || selectedCategory.toLowerCase() === "all") return true;
      return item.category.toLowerCase() === selectedCategory.toLowerCase();
    });
    
    setNews([...filtered].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
  }, [selectedCategory]); 

  const toggle = (id: string, type: 'read' | 'star' | 'heart', e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const newStatus = { ...status, [id]: { ...(status[id] || {read:false, star:false, heart:false}), [type]: !(status[id]?.[type]) } };
    setStatus(newStatus);
    localStorage.setItem('gpnr_status', JSON.stringify(newStatus));
  };

  return (
    <section className="px-4 pb-24 space-y-3 mt-4">
      {news.length > 0 ? news.map((item) => (
        <a key={item.id} href={item.sourceUrl} target="_blank" rel="noopener noreferrer" 
           className="block bg-[#1e293b] rounded-xl p-4 border border-slate-700/50 shadow-md">
          <div className="flex gap-4">
            {/* 1. 좌측 텍스트 영역 */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase">{item.category}</span>
                <h3 className="text-[15px] font-semibold text-slate-100 line-clamp-2 leading-snug mt-1">{item.title}</h3>
              </div>
              {/* 4. 하단 메타바: 출처/날짜/읽음/중요/좋아요 */}
              <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-400">
                <span className="truncate max-w-[60px]">{item.sourceName || "GPNR"}</span>
                <span>{item.publishedAt.substring(0, 10).replace(/-/g, '.')}</span>
                <div className="flex items-center gap-3 ml-auto text-sm">
                  <button onClick={(e)=>toggle(item.id,'read',e)}>{status[item.id]?.read ? "●":"○"}</button>
                  <button onClick={(e)=>toggle(item.id,'star',e)} className={status[item.id]?.star ? "text-yellow-400":"text-slate-500"}>★</button>
                  <button onClick={(e)=>toggle(item.id,'heart',e)} className={status[item.id]?.heart ? "text-red-500":"text-slate-500"}>♥</button>
                </div>
              </div>
            </div>
            {/* 2. 우측 이미지 (사이즈 반으로 줄임) */}
            {item.imageUrl && (
              <div className="w-20 h-20 flex-shrink-0">
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover rounded-lg bg-slate-800" />
              </div>
            )}
          </div>
        </a>
      )) : <div className="text-center py-20 text-slate-500 text-sm">뉴스가 없습니다.</div>}
    </section>
  );
}
