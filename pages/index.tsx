"use client";

import { useState, useEffect } from "react";
import { X } from 'lucide-react'; 

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // API 경로와 쿼리 파라미터를 가장 기본형으로 복구
        const res = await fetch(`/api/fetch-news?category=${activeCategory}`);
        const data = await res.json();
        
        // 데이터가 배열이기만 하면 일단 무조건 받습니다.
        if (Array.isArray(data)) {
          setNews(data);
        } else {
          setNews([]);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setNews([]);
      }
      setLoading(false);
    };
    fetchNews();
  }, [activeCategory]);

  // 태그 제거는 상세 페이지에서 출력할 때만 안전하게 처리
  const cleanBody = (item: any) => {
    const text = item.content || item.description || "";
    return typeof text === 'string' ? text.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ") : "";
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      <header className="bg-[#0D1B3E] text-white px-4 py-3 sticky top-0 z-50">
        <span className="text-xl font-black">GPNR</span>
      </header>

      <nav className="flex gap-2 p-4 overflow-x-auto bg-white border-b">
        {['all', 'mainnet', 'community', 'commerce'].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>

      <main className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-20 text-center text-gray-400">로딩 중...</div>
        ) : news.length > 0 ? (
          news.map((item, idx) => (
            <article key={idx} className="flex gap-4 p-4" onClick={() => setSelectedNews(item)}>
              <div className="flex-1">
                <h3 className="font-bold text-[15px] line-clamp-2">{item.title || "No Title"}</h3>
                <p className="text-[10px] text-gray-400 mt-1">{item.source || "GPNR"}</p>
              </div>
              {item.image && (
                <img src={item.image} className="w-20 h-20 object-cover rounded-xl" alt="" />
              )}
            </article>
          ))
        ) : (
          <div className="p-20 text-center text-gray-400">뉴스를 찾을 수 없습니다.</div>
        )}
      </main>

      {selectedNews && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto p-6">
          <button onClick={() => setSelectedNews(null)} className="float-right p-2 bg-gray-100 rounded-full"><X/></button>
          <img src={selectedNews.image} className="w-full h-48 object-cover rounded-2xl mb-4" />
          <h2 className="text-xl font-bold mb-4">{selectedNews.title}</h2>
          <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {cleanBody(selectedNews)}
          </div>
        </div>
      )}
    </div>
  );
}
