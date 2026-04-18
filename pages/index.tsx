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
        // 1. API 요청 시 카테고리 쿼리를 제거하거나 기본값으로 시도해 봅니다.
        // 데이터가 안 나온다면 api 경로에 문제가 있거나 쿼리 형식이 바뀐 것입니다.
        const res = await fetch(`/api/fetch-news?category=${activeCategory}`);
        
        if (!res.ok) throw new Error("Network response was not ok");
        
        const data = await res.json();
        
        // 2. 데이터 구조가 { news: [...] } 형태일 경우를 대비한 안전 로직
        const articles = Array.isArray(data) ? data : (data.news || []);
        setNews(articles);

      } catch (error) {
        console.error("Fetch error:", error);
        setNews([]);
      }
      setLoading(false);
    };
    fetchNews();
  }, [activeCategory]);

  const cleanBody = (item: any) => {
    const text = item.content || item.description || item.body || ""; // body 필드 추가 확인
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
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>

      <main className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-20 text-center text-gray-400">데이터를 불러오는 중...</div>
        ) : news && news.length > 0 ? (
          news.map((item, idx) => (
            <article key={item.id || idx} className="flex gap-4 p-4 cursor-pointer active:bg-gray-50" onClick={() => setSelectedNews(item)}>
              <div className="flex-1">
                {/* 제목(title) 외에 다른 필드명(subject 등)이 있는지 확인 필요 */}
                <h3 className="font-bold text-[15px] line-clamp-2 text-gray-900">{item.title || item.subject || "No Title"}</h3>
                <div className="flex gap-2 mt-1">
                  <p className="text-[10px] text-indigo-500 font-semibold">{item.category?.toUpperCase() || activeCategory.toUpperCase()}</p>
                  <p className="text-[10px] text-gray-400">{item.source || "GPNR"}</p>
                </div>
              </div>
              {(item.image || item.thumbnail) && (
                <img src={item.image || item.thumbnail} className="w-20 h-20 object-cover rounded-xl bg-gray-100" alt="" />
              )}
            </article>
          ))
        ) : (
          <div className="p-20 text-center">
            <p className="text-gray-400 mb-4">등록된 기사가 없습니다.</p>
            <button 
              onClick={() => setActiveCategory('all')}
              className="text-xs text-indigo-600 underline">
              전체 보기로 돌아가기
            </button>
          </div>
        )}
      </main>

      {selectedNews && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto p-6">
          <div className="flex justify-end mb-4">
            <button onClick={() => setSelectedNews(null)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
          </div>
          {(selectedNews.image || selectedNews.thumbnail) && (
            <img src={selectedNews.image || selectedNews.thumbnail} className="w-full h-48 object-cover rounded-2xl mb-4" />
          )}
          <h2 className="text-xl font-bold mb-4">{selectedNews.title || selectedNews.subject}</h2>
          <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-[14px]">
            {cleanBody(selectedNews)}
          </div>
        </div>
      )}
    </div>
  );
}
