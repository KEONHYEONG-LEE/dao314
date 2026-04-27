"use client"; 

import { useState, useEffect } from "react";
import NewsCard from "./news-card"; 
import { NEWS_DATA } from "@/lib/news-data"; 

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<any[]>([]); 

  useEffect(() => {
    // 1. 데이터 매핑 로직 수정 (이미 바뀐 NewsItem 구조에 맞춤)
    const formattedNews = NEWS_DATA.map(item => ({
      id: item.id,
      category: item.category.toLowerCase(),
      // 중요: 이제 title과 content는 객체가 아니라 단일 문자열입니다.
      title: item.title || "No Title", 
      content: item.content || "", 
      source: item.source || item.author || "GPNR News", // source 우선 사용
      date: item.date ? item.date.split('T')[0] : "Just now", 
      imageUrl: item.imageUrl, // 필드명 통일
      url: item.url 
    })); 

    // 2. 카테고리 필터링 로직
    const filtered = formattedNews.filter(
      item => selectedCategory === "all" || item.category === selectedCategory
    );
    
    setNews(filtered);
  }, [selectedCategory]); 

  return (
    <section className="mt-8 px-4 pb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold capitalize text-slate-100 tracking-tight">
          {selectedCategory === 'all' ? '최신 뉴스' : `${selectedCategory} 소식`}
        </h2>
        <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 uppercase">
          TOTAL {news.length}
        </span>
      </div>

      <div className="flex flex-col gap-1"> {/* 6~7번 이미지처럼 촘촘한 간격 */}
        {news.length > 0 ? (
          news.map((item) => (
            <NewsCard 
              key={item.id} 
              title={item.title}
              date={item.date}
              source={item.source}
              imageUrl={item.imageUrl} // 필드명을 NewsCard와 일치시킴
              url={item.url}           // URL을 확실히 전달
            />
          ))
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <p className="text-slate-500 font-medium">해당 카테고리의 뉴스가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}
