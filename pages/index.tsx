"use client";

import { useState, useEffect } from "react";
// 미리 만드신 PiLogin 컴포넌트를 불러옵니다. (경로가 components/PiLogin.tsx 기준)
import PiLogin from "../components/PiLogin";

// Pi SDK 타입 선언
declare global {
  interface Window {
    Pi: any;
  }
}

const CATEGORIES = [
  'all', 'mainnet', 'community', 'commerce', 'node', 'mining', 'wallet', 
  'browser', 'kyc', 'developer', 'ecosystem', 'listing', 'price', 
  'security', 'event', 'roadmap', 'whitepaper', 'legal'
];

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  // 4. 기사 식별 상태 (읽음, 중요, 하트) 저장용
  const [articleStatus, setArticleStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean }>>({});

  useEffect(() => {
    // 로컬스토리지에서 기존 식별 기록 불러오기
    const savedStatus = localStorage.getItem('gpnr_article_status');
    if (savedStatus) {
      setArticleStatus(JSON.parse(savedStatus));
    }

    const fetchNews = async () => {
      setLoading(true);
      try {
        const query = activeCategory === 'all' ? '' : `?category=${activeCategory.toUpperCase()}`;
        const res = await fetch(`/api/fetch-news${query}`);
        const data = await res.json();
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

  // 식별 아이콘 클릭 핸들러
  const toggleStatus = (id: string, type: 'read' | 'star' | 'heart', e: React.MouseEvent) => {
    e.preventDefault(); // 링크 클릭 방지
    const newStatus = {
      ...articleStatus,
      [id]: {
        ...articleStatus[id],
        [type]: !articleStatus[id]?.[type]
      }
    };
    setArticleStatus(newStatus);
    localStorage.setItem('gpnr_article_status', JSON.stringify(newStatus));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. 우측 상단 로그인 기능 추가 */}
      <header className="bg-[#0D1B3E] text-white px-4 py-3 sticky top-0 z-50 shadow-md flex justify-between items-center">
        <span className="text-xl font-black tracking-tighter">GPNR</span>
        <PiLogin />
      </header>

      {/* 카테고리 네비게이션 */}
      <nav className="flex gap-2 p-3 overflow-x-auto bg-white border-b no-scrollbar sticky top-[52px] z-40">
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

      <main className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-20 text-center text-gray-400 text-sm">Loading News...</div>
        ) : news.length > 0 ? (
          news.map((item, idx) => {
            const status = articleStatus[item.url] || { read: false, star: false, heart: false };
            return (
              <div key={idx} className="relative bg-white border-b border-gray-50">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`flex gap-4 p-4 active:bg-gray-50 transition-colors ${status.read ? 'opacity-60' : 'opacity-100'}`}
                >
                  <div className="flex-1">
                    <h3 className={`font-bold text-[15px] line-clamp-2 leading-snug ${status.star ? 'text-indigo-700' : 'text-gray-900'}`}>
                      {status.star && <span className="mr-1">⭐</span>}
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold text-indigo-500">{item.source}</span>
                      <span className="text-[10px] text-gray-300">{item.date}</span>
                    </div>
                  </div>
                  {item.imageUrl && (
                    <img src={item.imageUrl} className="w-20 h-20 object-cover rounded-xl bg-gray-50 flex-shrink-0" alt="" />
                  )}
                </a>

                {/* 4. 기사 식별 도구 (하단 배치) */}
                <div className="flex gap-4 px-4 pb-3 mt-[-8px]">
                  <button 
                    onClick={(e) => toggleStatus(item.url, 'read', e)}
                    className={`text-[12px] flex items-center gap-1 ${status.read ? 'text-gray-400' : 'text-gray-300'}`}
                  >
                    {status.read ? '✔️ 읽음' : '📖 읽음'}
                  </button>
                  <button 
                    onClick={(e) => toggleStatus(item.url, 'star', e)}
                    className={`text-[12px] flex items-center gap-1 ${status.star ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    {status.star ? '🌟 중요' : '☆ 중요'}
                  </button>
                  <button 
                    onClick={(e) => toggleStatus(item.url, 'heart', e)}
                    className={`text-[12px] flex items-center gap-1 ${status.heart ? 'text-red-500' : 'text-gray-300'}`}
                  >
                    {status.heart ? '❤️ 좋음' : '♡ 하트'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-20 text-center text-gray-400 text-sm">No news available.</div>
        )}
      </main>
    </div>
  );
}
