"use client";

import { useState, useEffect } from "react";
import PiLogin from "../components/PiLogin";

const CATEGORIES = [
  'all', 'mainnet', 'community', 'commerce', 'node', 'mining', 'wallet', 
  'browser', 'kyc', 'developer', 'ecosystem', 'listing', 'price', 
  'security', 'event', 'roadmap', 'whitepaper', 'legal'
];

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [articleStatus, setArticleStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean }>>({});

  // 1. 기사 데이터 불러오기 로직 (핵심 부분)
  useEffect(() => {
    // 로컬스토리지 상태 불러오기
    const savedStatus = localStorage.getItem('gpnr_article_status');
    if (savedStatus) setArticleStatus(JSON.parse(savedStatus));

    const fetchNews = async () => {
      setLoading(true);
      try {
        const query = activeCategory === 'all' ? '' : `?category=${activeCategory.toUpperCase()}`;
        const res = await fetch(`/api/fetch-news${query}`);
        const data = await res.json();
        
        // 데이터 구조 확인 및 설정
        const articles = Array.isArray(data) ? data : (data.articles || []);
        setNews(articles);
      } catch (error) {
        console.error("Fetch error:", error);
        setNews([]);
      }
      setLoading(false);
    };

    fetchNews();
  }, [activeCategory]);

  // 2. 식별 아이콘 상태 토글
  const toggleStatus = (url: string, type: 'read' | 'star' | 'heart', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const current = articleStatus[url] || { read: false, star: false, heart: false };
    const newStatus = {
      ...articleStatus,
      [url]: { ...current, [type]: !current[type] }
    };
    setArticleStatus(newStatus);
    localStorage.setItem('gpnr_article_status', JSON.stringify(newStatus));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 헤더: 로그인 아이콘 포함 */}
      <header className="bg-[#0D1B3E] text-white px-4 py-2 sticky top-0 z-50 shadow-md flex justify-between items-center h-[56px]">
        <span className="text-xl font-black tracking-tighter">GPNR</span>
        <PiLogin />
      </header>

      {/* 카테고리 네비게이션: 다시 추가됨 */}
      <nav className="flex gap-2 p-3 overflow-x-auto bg-white border-b no-scrollbar sticky top-[56px] z-40">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex-shrink-0 border ${
              activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-100'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* 뉴스 리스트 메인 */}
      <main className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-20 text-center text-gray-400 text-sm italic">Loading News...</div>
        ) : news.length > 0 ? (
          news.map((item, idx) => {
            const status = articleStatus[item.url] || { read: false, star: false, heart: false };
            return (
              <div key={idx} className="bg-white border-b border-gray-50 last:border-0">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`flex gap-4 p-4 pb-1 active:bg-gray-50 transition-colors ${status.read ? 'opacity-50' : ''}`}
                >
                  <div className="flex-1">
                    <h3 className={`font-bold text-[15px] line-clamp-2 leading-tight text-gray-900`}>
                      {/* 제목 앞에 아이콘 자동 추가 */}
                      {status.star && <span className="mr-1">⭐</span>}
                      {status.heart && <span className="mr-1">❤️</span>}
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-bold text-indigo-500">{item.source}</span>
                      <span className="text-[10px] text-gray-300">{item.date}</span>
                    </div>
                  </div>
                  {item.imageUrl && (
                    <img src={item.imageUrl} className="w-20 h-20 object-cover rounded-xl bg-gray-50 flex-shrink-0" alt="" />
                  )}
                </a>

                {/* 하단 식별 버튼 (아이콘만 표시) */}
                <div className="flex gap-6 px-4 pb-3 mt-1">
                  <button onClick={(e) => toggleStatus(item.url, 'read', e)} className="text-lg grayscale-0">
                    {status.read ? '✔️' : '📖'}
                  </button>
                  <button onClick={(e) => toggleStatus(item.url, 'star', e)} className="text-lg">
                    {status.star ? '🌟' : '☆'}
                  </button>
                  <button onClick={(e) => toggleStatus(item.url, 'heart', e)} className="text-lg">
                    {status.heart ? '❤️' : '♡'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-20 text-center text-gray-400 text-sm">No news found in this category.</div>
        )}
      </main>
    </div>
  );
}
