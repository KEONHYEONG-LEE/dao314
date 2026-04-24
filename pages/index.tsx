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
    // fetchNews 로직은 기존 파일 내용을 그대로 유지하세요.
  }, [activeCategory]);

  const toggleStatus = (url: string, type: 'read' | 'star' | 'heart', e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const current = articleStatus[url] || { read: false, star: false, heart: false };
    const newStatus = { ...articleStatus, [url]: { ...current, [type]: !current[type] } };
    setArticleStatus(newStatus);
    localStorage.setItem('gpnr_article_status', JSON.stringify(newStatus));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 헤더: 타이틀과 버튼 위치 고정 */}
      <header className="bg-[#0D1B3E] text-white px-4 py-2 sticky top-0 z-50 shadow-md flex justify-between items-center h-[56px]">
        <span className="text-xl font-black tracking-tighter flex-shrink-0">GPNR</span>
        <PiLogin />
      </header>

      {/* 카테고리 (생략 - 기존 코드 유지) */}

      <main className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-20 text-center text-gray-400 text-sm">Loading News...</div>
        ) : (
          news.map((item, idx) => {
            const status = articleStatus[item.url] || { read: false, star: false, heart: false };
            return (
              <div key={idx} className="bg-white">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex gap-4 p-4 pb-0 transition-colors">
                  <div className="flex-1">
                    <h3 className={`font-bold text-[15px] line-clamp-2 leading-tight ${status.read ? 'text-gray-400' : 'text-gray-900'}`}>
                      {status.star && <span className="mr-1">⭐</span>}
                      {status.heart && <span className="mr-1">❤️</span>}
                      {item.title}
                    </h3>
                    {/* 출처와 날짜 줄 - 마진 제거 */}
                    <div className="flex items-center gap-2 mt-1 mb-0">
                      <span className="text-[10px] font-bold text-indigo-500">{item.source}</span>
                      <span className="text-[10px] text-gray-300">{item.date}</span>
                    </div>
                  </div>
                  {item.imageUrl && (
                    <img src={item.imageUrl} className="w-16 h-16 object-cover rounded-xl bg-gray-50 flex-shrink-0 mt-1" alt="" />
                  )}
                </a>

                {/* 아이콘 영역: 윗줄과 다닥다닥 붙임 (pt-0, mt-0) */}
                <div className="flex gap-6 px-4 pt-0 pb-3 mt-0">
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
            );
          })
        )}
      </main>
    </div>
  );
}
