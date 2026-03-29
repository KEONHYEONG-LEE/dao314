import { useState, useEffect } from "react";
import NewsCard from "./news-card";

// 1. 뉴스 데이터의 형식을 정의합니다.
interface NewsItem {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
}

export default function NewsFeed({ selectedCategory = "All" }) {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    // 2. 여기서 나중에 진짜 API(뉴스 불러오기)를 연결할 거예요.
    // 지금은 로직만 짜둘게요.
    const fetchNews = async () => {
      // 실제 API 호출 코드 들어갈 자리
      // const response = await fetch('뉴스서버주소');
      // const data = await response.json();
      
      // 임시 데이터 (나중에 진짜 데이터로 대체)
      const allNews: NewsItem[] = []; 

      // 3. 카테고리 필터링 + 최신순 10개 자르기 로직
      const filteredNews = allNews
        .filter(item => selectedCategory === "All" || item.category === selectedCategory)
        .slice(0, 10); // 딱 10개만!

      setNews(filteredNews);
    };

    fetchNews();
  }, [selectedCategory]);

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-6">
        {selectedCategory} News
      </h2>
      <div className="space-y-6">
        {news.length > 0 ? (
          news.map((item) => (
            <NewsCard key={item.id} {...item} />
          ))
        ) : (
          <p className="text-gray-500">최신 뉴스를 불러오는 중이거나 해당 카테고리에 뉴스가 없습니다.</p>
        )}
      </div>
    </section>
  );
}
