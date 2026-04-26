"use client"; 

import { useState, useEffect } from "react";
import NewsCard from "./news-card"; 
// 1. 우리가 만든 실데이터 가져오기
import { NEWS_DATA } from "@/lib/news-data"; 

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<any[]>([]); 

  useEffect(() => {
    // 2. NEWS_DATA를 화면 구조에 맞게 변환 (데이터 누락 방지)
    const formattedNews = NEWS_DATA.map(item => ({
      id: item.id,
      category: item.category.toLowerCase(),
      // 제목: 한국어 우선, 없으면 영어
      title: (item.title as any).ko || (item.title as any).en || "No Title", 
      // 내용: 한국어 우선, 없으면 영어
      content: (item.content as any).ko || (item.content as any).en || "", 
      author: item.author || "GPNR News",
      date: item.date ? item.date.split('T')[0] : "Just now", 
      image: item.imageUrl, 
      // *** 중요: url이 정확히 매핑되는지 확인 ***
      url: item.url 
    })); 

    // 3. 카테고리 필터링 로직
    const filtered = formattedNews.filter(
      item => selectedCategory === "all" || item.category === selectedCategory
    );
    
    setNews(filtered);
  }, [selectedCategory]); 

  return (
    <section className="mt-8 px-4 pb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold capitalize text-slate-100">
          {selectedCategory === 'all' ? '최신 뉴스' : `${selectedCategory} 소식`}
        </h2>
        <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full">
          TOTAL {news.length}
        </span>
      </div>

      <div className="flex flex-col gap-2"> {/* 간격을 더 콤팩트하게 조정 */}
        {news.length > 0 ? (
          news.map((item) => (
            <NewsCard 
              key={item.id} 
              category={item.category}
              title={item.title}
              content={item.content}
              date={item.date}
              source={item.author}
              image={item.image}
              // NewsCard로 url을 확실하게 전달합니다.
              url={item.url}
            />
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500 font-medium">해당 카테고리의 뉴스가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}
