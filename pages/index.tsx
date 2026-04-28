"use client";
import { useState, useEffect } from "react";
import { CategoryTabs } from "../components/category-tabs";

export default function Home() {
  // 1. 상태 정의 (반드시 news라는 이름으로 선언)
  const [news, setNews] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [articleStatus, setArticleStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean }>>({});

  useEffect(() => {
    // 구글 번역 UI 숨기기
    const hideGoogleUI = () => {
      const banner = document.querySelector(".goog-te-banner-frame") as HTMLElement;
      if (banner) banner.style.display = "none";
      const tooltip = document.getElementById("goog-gt-tt") as HTMLElement;
      if (tooltip) {
        tooltip.style.setProperty("display", "none", "important");
        tooltip.style.setProperty("visibility", "hidden", "important");
      }
      document.body.style.top = "0px";
    };

    const interval = setInterval(hideGoogleUI, 500);
    
    // 로컬 상태 불러오기
    const savedStatus = localStorage.getItem('gpnr_article_status');
    if (savedStatus) setArticleStatus(JSON.parse(savedStatus));

    // 뉴스 데이터 가져오기
    const fetchNews = async () => {
      setLoading(true);
      try {
        const query = activeCategory === 'all' ? '' : `?category=${activeCategory.toUpperCase()}`;
        const res = await fetch(`/api/fetch-news${query}`);
        const data = await res.json();
        // news 상태를 항상 배열로 안전하게 설정
        setNews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch error:", error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    return () => clearInterval(interval);
  }, [activeCategory]);

  const toggleStatus = (url: string, type: 'read' | 'star' | 'heart', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const current = articleStatus[url] || { read: false, star: false, heart: false };
    const updatedStatus = {
      ...articleStatus,
      [url]: { ...current, [type]: !current[type] }
    };
    setArticleStatus(updatedStatus);
    localStorage.setItem('gpnr_article_status', JSON.stringify(updatedStatus));
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100">
      <CategoryTabs 
        selectedCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20 text-slate-500 animate-pulse">데이터를 불러오는 중입니다...</div>
        ) : (news && news.length > 0) ? ( // 2. news 변수 존재 여부 체크 (에러 방지 핵심)
          <div className="grid gap-6">
            {news.map((item, index) => (
              <a 
                key={item.id || index} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                // 모바일 가로형, PC 세로형 카드 레이아웃
                className={`block p-4 rounded-2xl border border-slate-800 transition-all hover:border-slate-600 flex flex-row sm:flex-col gap-4 ${
                  articleStatus[item.url]?.read ? 'bg-slate-800/40 opacity-60' : 'bg-[#1e293b] shadow-lg'
                }`}
              >
                {item.imageUrl && (
                  <div className="relative w-24 h-24 sm:w-full sm:h-48 flex-shrink-0 overflow-hidden rounded-xl bg-slate-700">
                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-orange-400 uppercase">{item.category}</span>
                    <span className="text-[9px] text-slate-500">{item.source}</span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold mb-2 text-white leading-tight line-clamp-2">
                    {item.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 mb-3">
                    {item.content}
                  </p>

                  <div className="flex gap-3 text-xl bg-black/20 w-fit px-3 py-1.5 rounded-lg border border-white/5 mt-auto">
                    <button onClick={(e) => toggleStatus(item.url, 'read', e)}>
                      {articleStatus[item.url]?.read ? '📖' : '📕'}
                    </button>
                    <button onClick={(e) => toggleStatus(item.url, 'star', e)}>
                      {articleStatus[item.url]?.star ? '⭐' : '☆'}
                    </button>
                    <button onClick={(e) => toggleStatus(item.url, 'heart', e)}>
                      {articleStatus[item.url]?.heart ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">표시할 뉴스가 없습니다.</div>
        )}
      </div>
    </main>
  );
}
