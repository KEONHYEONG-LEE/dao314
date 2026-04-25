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

  useEffect(() => {
    // 1. 구글 번역 팝업 및 안내 문구 강제 차단 로직
    const hideGoogleUI = () => {
      // 구글 번역 툴바(상단 바) 제거
      const banner = document.querySelector(".goog-te-banner-frame") as HTMLElement;
      if (banner) banner.style.display = "none";
      
      // 구글 번역 팝업(원본 보기 등) 제거
      const tooltip = document.getElementById("goog-gt-tt") as HTMLElement;
      if (tooltip) {
        tooltip.style.display = "none";
        tooltip.style.visibility = "hidden";
      }

      document.body.style.top = "0px";
    };

    // 번역 안내 문구(2~3번째 줄) 발생을 막기 위한 메타 태그 삽입
    const meta = document.createElement('meta');
    meta.name = "google";
    meta.content = "notranslate"; // 페이지 전체 자동번역 팝업 방지 (필요시 사용)
    // 원치 않으시면 위 meta 라인은 주석 처리하셔도 됩니다.

    const interval = setInterval(hideGoogleUI, 500); // 0.5초마다 체크하여 팝업 차단

    const savedStatus = localStorage.getItem('gpnr_article_status');
    if (savedStatus) setArticleStatus(JSON.parse(savedStatus));

    const fetchNews = async () => {
      setLoading(true);
      try {
        const query = activeCategory === 'all' ? '' : `?category=${activeCategory.toUpperCase()}`;
        const res = await fetch(`/api/fetch-news${query}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setNews(Array.isArray(data) ? data : (data.articles || []));
      } catch (error) {
        console.error("Fetch error:", error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 제거
  }, [activeCategory]);

  const toggleStatus = (url: string, type: 'read' | 'star' | 'heart', e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const current = articleStatus[url] || { read: false, star: false, heart: false };
    const newStatus = { ...articleStatus, [url]: { ...current, [type]: !current[type] } };
    setArticleStatus(newStatus);
    localStorage.setItem('gpnr_article_status', JSON.stringify(newStatus));
  };

  return (
    // 'notranslate' 클래스를 추가하여 구글이 임의로 안내 UI를 붙이는 것을 방지합니다.
    <div className="flex flex-col min-h-screen bg-white notranslate">
      <header className="bg-[#0D1B3E] text-white px-4 py-2 sticky top-0 z-50 shadow-md flex justify-between items-center h-[56px]">
        <span className="text-xl font-black tracking-tighter">GPNR</span>
        <PiLogin />
      </header>

      <nav className="flex gap-2 p-3 overflow-x-auto bg-white border-b no-scrollbar sticky top-[56px] z-40">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex-shrink-0 border ${
              activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-100'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>

      <main className="divide-y divide-gray-50">
        {loading ? (
          <div className="p-20 text-center text-gray-400 text-sm font-medium animate-pulse">Loading GPNR News...</div>
        ) : news.length > 0 ? (
          news.map((item, idx) => {
            const status = articleStatus[item.url] || { read: false, star: false, heart: false };
            return (
              <div key={idx} className="bg-white">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex gap-4 p-4 pb-0">
                  <div className="flex-1">
                    <h3 className={`font-bold text-[15px] line-clamp-2 leading-snug ${status.read ? 'text-gray-300' : 'text-gray-900'}`}>
                      {status.star && <span className="mr-1">⭐</span>}
                      {status.heart && <span className="mr-1">❤️</span>}
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-indigo-500/80">{item.source}</span>
                      <span className="text-[10px] text-gray-300">{item.date}</span>
                    </div>
                  </div>
                  {item.imageUrl && (
                    <img src={item.imageUrl} className="w-16 h-16 object-cover rounded-xl bg-gray-50 flex-shrink-0 mt-0.5" alt="" />
                  )}
                </a>

                <div className="flex gap-7 px-4 pt-1 pb-3">
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
        ) : (
          <div className="p-20 text-center text-gray-400 text-sm">No news available.</div>
        )}
      </main>
    </div>
  );
}
