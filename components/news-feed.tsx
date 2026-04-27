"use client"; 

import { useState, useEffect } from "react";
import NewsCard from "./news-card"; 
import { NEWS_DATA } from "@/lib/news-data"; 

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<any[]>([]); 

  useEffect(() => {
    // NEWS_DATA가 단일 문자열 구조이므로 복잡한 (as any).ko 접근이 필요 없습니다.
    const filtered = NEWS_DATA.filter(
      item => selectedCategory === "all" || item.category.toLowerCase() === selectedCategory.toLowerCase()
    );
    setNews(filtered);
  }, [selectedCategory]); 

  return (
    <section className="mt-6 px-4 pb-10">
      <div className="flex flex-col gap-1">
        {news.map((item) => (
          <NewsCard 
            key={item.id} 
            title={item.title}
            date={item.date}
            source={item.source || item.author}
            imageUrl={item.imageUrl} // 필드명 일치 확인!
            url={item.url}           // URL 전달 확인!
          />
        ))}
      </div>
    </section>
  );
}
