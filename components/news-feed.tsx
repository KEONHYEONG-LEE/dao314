"use client"; 

import { useState, useEffect } from "react";
import NewsCard from "./news-card"; 
import { NEWS_DATA, NewsItem } from "@/lib/pi-news-v2"; 

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<NewsItem[]>([]); 

  useEffect(() => {
    // 1. 카테고리 필터링 로직 최적화
    const filtered = NEWS_DATA.filter((item: NewsItem) => {
      if (selectedCategory.toLowerCase() === "all") return true;
      return item.category.toLowerCase() === selectedCategory.toLowerCase();
    });
    
    // 2. 최신순 정렬 (데이터에 date가 있으므로 최신 뉴스가 위로 오게)
    const sorted = [...filtered].reverse(); 
    
    setNews(sorted);
  }, [selectedCategory]); 

  return (
    <section className="mt-4 px-4 pb-20">
      <div className="flex flex-col gap-3">
        {news.length > 0 ? (
          news.map((item) => (
            <NewsCard 
              key={item.id} 
              title={item.title}
              date={item.date}
              source={item.source}
              imageUrl={item.imageUrl}
              url={item.url} // 이 url이 NewsCard로 확실히 전달되어야 클릭이 작동합니다!
            />
          ))
        ) : (
          <div className="text-center py-20 text-slate-500 text-sm">
            해당 카테고리에 뉴스가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
