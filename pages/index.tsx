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
        // API 경로를 단순화하여 호출합니다.
        const query = activeCategory === 'all' ? '' : `?category=${activeCategory.toUpperCase()}`;
        const res = await fetch(`/api/fetch-news${query}`);
        const data = await res.json();
        
        // 데이터 구조를 최대한 안전하게 받아옵니다.
        const articles = Array.isArray(data) ? data : (data.articles || data.news || []);
        setNews(articles);
      } catch (error) {
        console.error("Fetch error:", error);
        setNews([]);
      }
      setLoading(false);
    };
    fetchNews();
  }, [activeCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      <header className="bg-[#0D1B3E] text-white px-4 py-3 sticky top-0 z-50">
        <span className="text-xl font-black">GPNR</span>
      </header>

      {/* 카테고리 네비게이션 */}
      <nav className="flex gap-2 p-4 overflow-x-auto bg-white border-b no-scrollbar">
        {['all', 'mainnet', 'community', 'commerce'].map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
              activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* 뉴스 리스트 메인 */}
      <main className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-20 text-center text-gray-400 text-sm">Loading News...</div>
        ) : news.length > 0 ? (
          news.map((item, idx) => (
            <article key={idx} className="flex gap-4 p-4 active:bg-gray-50" onClick={() => setSelectedNews(item)}>
              <div className="flex-1">
                {/* news-data.ts에서 수정한 대로 item.title을 직접 가져옵니다. */}
                <h3 className="font-bold text-[15px] line-clamp-2 text-gray-900">{item.title}</h3>
                <p className="text-[10px] text-gray-400 mt-1">{item.source || item.author || "GPNR"}</p>
              </div>
              {item.imageUrl && (
                <img src={item.imageUrl} className="w-20 h-20 object-cover rounded-xl bg-gray-50" alt="" />
              )}
            </article>
          ))
        ) : (
          <div className="p-20 text-center">
            <p className="text-gray-400 text-sm">No news available.</p>
          </div>
        )}
      </main>

      {/* 뉴스 상세 팝업 */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto p-6">
          <div className="flex justify-end mb-4">
            <button onClick={() => setSelectedNews(null)} className="p-2 bg-gray-100 rounded-full">
              <X size={20} className="text-gray-600" />
            </button>
          </div>
          {selectedNews.imageUrl && (
            <img src={selectedNews.imageUrl} className="w-full h-48 object-cover rounded-2xl mb-6" alt="" />
          )}
          <h2 className="text-xl font-bold mb-4 text-gray-900">{selectedNews.title}</h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">
            {selectedNews.content}
          </div>
          {selectedNews.url && (
            <a 
              href={selectedNews.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-8 block w-full py-3 bg-gray-100 text-center rounded-xl text-sm font-bold text-gray-600"
            >
              Read Full Article
            </a>
          )}
        </div>
      )}
    </div>
  );
}
