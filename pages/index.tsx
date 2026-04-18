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
        // 1. 카테고리가 'all'일 때는 쿼리 없이 전체를 호출해 봅니다 (가장 안전한 방법)
        const query = activeCategory === 'all' ? '' : `?category=${activeCategory}`;
        const res = await fetch(`/api/fetch-news${query}`);
        const data = await res.json();
        
        // 2. 데이터가 배열 형태가 아닐 경우를 대비한 융단폭격식 추출
        let articles = [];
        if (Array.isArray(data)) {
          articles = data;
        } else if (data && typeof data === 'object') {
          // data.news, data.articles, data.data 등 흔한 필드명 모두 체크
          articles = data.news || data.articles || data.data || data.items || [];
        }

        // 3. 만약 'all'이 아닌데 결과가 없다면 대문자로도 한 번 더 시도 (API 호환성)
        if (articles.length === 0 && activeCategory !== 'all') {
          const upperRes = await fetch(`/api/fetch-news?category=${activeCategory.toUpperCase()}`);
          const upperData = await upperRes.json();
          articles = Array.isArray(upperData) ? upperData : (upperData.news || []);
        }

        setNews(articles);
      } catch (error) {
        console.error("데이터 복구 실패:", error);
        setNews([]);
      }
      setLoading(false);
    };
    fetchNews();
  }, [activeCategory]);

  const cleanBody = (item: any) => {
    // 본문 내용이 들어있을 만한 모든 필드 체크
    const text = item.content || item.description || item.body || item.snippet || "";
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
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>

      <main className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-20 text-center text-gray-400">Loading News...</div>
        ) : news.length > 0 ? (
          news.map((item, idx) => (
            <article key={idx} className="flex gap-4 p-4 active:bg-gray-50" onClick={() => setSelectedNews(item)}>
              <div className="flex-1">
                {/* 영어 뉴스 필드명인 'title' 또는 'subject' 대응 */}
                <h3 className="font-bold text-[15px] line-clamp-2">{item.title || item.subject || "No Title"}</h3>
                <p className="text-[10px] text-gray-400 mt-1">{item.source || item.author || "GPNR"}</p>
              </div>
              {(item.image || item.urlToImage || item.thumbnail) && (
                <img src={item.image || item.urlToImage || item.thumbnail} className="w-20 h-20 object-cover rounded-xl bg-gray-50" alt="" />
              )}
            </article>
          ))
        ) : (
          <div className="p-20 text-center">
            <p className="text-gray-400 mb-2">뉴스를 불러올 수 없습니다.</p>
            <p className="text-[10px] text-gray-300">API 경로 또는 카테고리 설정을 확인하세요.</p>
          </div>
        )}
      </main>

      {selectedNews && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto p-6">
          <div className="flex justify-end mb-4">
            <button onClick={() => setSelectedNews(null)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
          </div>
          {(selectedNews.image || selectedNews.urlToImage) && (
            <img src={selectedNews.image || selectedNews.urlToImage} className="w-full h-48 object-cover rounded-2xl mb-4" />
          )}
          <h2 className="text-xl font-bold mb-4">{selectedNews.title}</h2>
          <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-[14px]">
            {cleanBody(selectedNews)}
          </div>
        </div>
      )}
    </div>
  );
}
