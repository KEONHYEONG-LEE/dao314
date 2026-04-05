"use client";

import { useState, useEffect } from "react";

interface NewsItem {
  title: string;
  description: string;
  source: string;
  image?: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GitHub Pages에 있는 실제 데이터를 가져옵니다.
    const fetchNews = async () => {
      try {
        const response = await fetch("https://keonhyeong-lee.github.io/data/news.json");
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("뉴스 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-blue-900 text-white p-6 text-center shadow-md">
        <h1 className="text-3xl font-bold">GPNR Global News</h1>
      </header>

      {/* 뉴스 리스트 영역 */}
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {loading ? (
          <div className="text-center py-10 text-gray-500">뉴스를 불러오는 중입니다...</div>
        ) : news.length > 0 ? (
          news.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row border">
              {item.image && (
                <div className="md:w-1/3">
                  <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
                </div>
              )}
              <div className="p-5 flex-1">
                <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded mb-2 font-bold">
                  {item.source}
                </span>
                <h2 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">표시할 뉴스가 없습니다.</div>
        )}
      </main>
    </div>
  );
}
