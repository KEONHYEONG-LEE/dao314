"use client";

import { useState, useEffect } from "react";
import PiLogin from "../components/PiLogin";

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [articleStatus, setArticleStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean }>>({});

  useEffect(() => {
    const savedStatus = localStorage.getItem('gpnr_article_status');
    if (savedStatus) setArticleStatus(JSON.parse(savedStatus));
    // ... fetchNews 로직은 기존과 동일하므로 생략 (기존 코드 유지)
  }, [activeCategory]);

  const toggleStatus = (id: string, type: 'read' | 'star' | 'heart', e: React.MouseEvent) => {
    e.preventDefault();
    const newStatus = {
      ...articleStatus,
      [id]: { ...articleStatus[id], [type]: !articleStatus[id]?.[type] }
    };
    setArticleStatus(newStatus);
    localStorage.setItem('gpnr_article_status', JSON.stringify(newStatus));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="bg-[#0D1B3E] text-white px-4 py-2 sticky top-0 z-50 shadow-md flex justify-between items-center h-[56px]">
        <span className="text-xl font-black tracking-tighter">GPNR</span>
        <PiLogin />
      </header>

      {/* 카테고리 네비게이션 */}
      <nav className="flex gap-2 p-3 overflow-x-auto bg-white border-b no-scrollbar sticky top-[56px] z-40">
        {/* ... 카테고리 버튼 맵핑 (기존 코드 유지) */}
      </nav>

      <main className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-20 text-center text-gray-400 text-sm">Loading News...</div>
        ) : (
          news.map((item, idx) => {
            const status = articleStatus[item.url] || { read: false, star: false, heart: false };
            return (
              <div key={idx} className="bg-white">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex gap-4 p-4 pb-1 transition-colors">
                  <div className="flex-1">
                    <h3 className={`font-bold text-[15px] line-clamp-2 leading-tight ${status.read ? 'text-gray-400' : 'text-gray-900'}`}>
                      {/* 3. 중요/좋음 아이콘 제목 앞 자동 추가 */}
                      {status.star && <span className="mr-1">⭐</span>}
                      {status.heart && <span className="mr-1">❤️</span>}
                      {item.title}
                    </h3>
                    {/* 4. 출처와 아이콘 줄 간격 밀착 */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-indigo-500">{item.source}</span>
                      <span className="text-[10px] text-gray-300">{item.date}</span>
                    </div>
                  </div>
                  {item.imageUrl && (
                    <img src={item.imageUrl} className="w-20 h-20 object-cover rounded-xl bg-gray-50 flex-shrink-0" alt="" />
                  )}
                </a>

                {/* 2. 단어 없이 아이콘만 살림 */}
                <div className="flex gap-5 px-4 pb-3">
                  <button onClick={(e) => toggleStatus(item.url, 'read', e)} className="text-lg">
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
            )
          })
        )}
      </main>
    </div>
  );
}
