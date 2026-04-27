"use client"; 

import { useState, useEffect } from "react";
import NewsCard from "./news-card"; 
import { NEWS_DATA, NewsItem } from "@/lib/pi-news-v2"; 

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<NewsItem[]>([]); 

  useEffect(() => {
    // 1. 카테고리 필터링
    const filtered = NEWS_DATA.filter((item: NewsItem) => {
      if (selectedCategory.toLowerCase() === "all") return true;
      return item.category.toLowerCase() === selectedCategory.toLowerCase();
    });
    
    // 2. 최신순 정렬
    const sorted = [...filtered].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    ); 
    
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
              // 데이터의 publishedAt을 date로 전달
              date={item.publishedAt} 
              // 데이터의 author를 source로 전달
              source={item.author}
              imageUrl={item.imageUrl}
              // 데이터 파일에 따라 link일수도, sourceUrl일수도 있으므로 둘 다 체크
              url={item.sourceUrl || (item as any).link || (item as any).url} 
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
