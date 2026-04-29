"use client"; 

import { useState, useEffect } from "react";
import NewsCard from "./news-card"; 
import { NEWS_DATA, NewsItem } from "@/lib/pi-news-v2"; 

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<NewsItem[]>([]); 

  useEffect(() => {
    // 1. 카테고리 필터링
    const filtered = NEWS_DATA.filter((item: NewsItem) => {
      // 카테고리 값이 없을 경우를 대비해 '모두' 또는 'all' 처리
      if (!selectedCategory || selectedCategory.toLowerCase() === "all" || selectedCategory === "모두") return true;
      return item.category.toLowerCase() === selectedCategory.toLowerCase();
    });
    
    // 2. 최신순 정렬 (publishedAt 기준)
    const sorted = [...filtered].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    ); 
    
    setNews(sorted);
  }, [selectedCategory]); 

  return (
    <section className="mt-2 px-3 pb-24"> {/* 상단 여백 조정 및 하단 여백 확보 */}
      <div className="flex flex-col">
        {news.length > 0 ? (
          news.map((item) => (
            <NewsCard 
              key={item.id} 
              category={item.category} // 추가: 카테고리 정보 전달
              title={item.title}
              date={item.publishedAt} 
              source={item.author} // author를 출처로 사용
              imageUrl={item.imageUrl}
              url={item.sourceUrl} 
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
