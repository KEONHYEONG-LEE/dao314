"use client";
import { useState, useEffect } from "react";
import { CategoryTabs } from "../components/category-tabs";

export default function Home() {
  // 1. 상태 정의 (초기값 빈 배열)
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [articleStatus, setArticleStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean }>>({});

  useEffect(() => {
    // 구글 번역 UI 숨기기 로직
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
    
    // 로컬 스토리지에서 읽음/별표/하트 상태 불러오기
    const savedStatus = localStorage.getItem('gpnr_article_status');
    if (savedStatus) setArticleStatus(JSON.parse(savedStatus));

    // 뉴스 데이터 페칭
    const fetchNews = async () => {
      setLoading(true);
      try {
        const query = activeCategory === 'all' ? '' : `?category=${activeCategory.toUpperCase()}`;
        const res = await fetch(`/api/fetch-news${query}`);
        const data = await res.json();
        // API 응답이 배열인지 확인 후 안전하게 설정
        setNews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    return () => clearInterval(interval);
  }, [activeCategory]);

  // 상태 토글 핸들러
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
          <div className="flex justify-center py-20 text-slate-500 animate-pulse">
            뉴스를 불러오는 중입니다...
          </div>
        ) : (news && news.length > 0) ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item, index) => (
              <a 
                key={item.id || index} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`block p-5 rounded-2xl border border-slate-800 transition-all hover:border-slate-600 ${
                  articleStatus[item.url]?.read 
                    ? 'bg-slate-800/40 opacity-60' 
                    : 'bg-[#1e293b] shadow-lg shadow-black/20'
                }`}
              >
                {/* 이미지 표시 */}
                {item.imageUrl && (
                  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl bg-slate-700">
                    <img 
                      src={item.imageUrl} 
                      alt="" 
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-orange-400 uppercase">{item.category}</span>
                  <span className="text-[10px] text-slate-500">{item.source}</span>
                </div>

                <h2 className="text-lg font-bold mb-3 text-white leading-tight">
                  {item.title}
                </h2>

                <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                  {item.content}
                </p>

                {/* 버튼 영역 */}
                <div className="flex gap-4 text-2xl bg-black/20 w-fit px-4 py-2 rounded-xl border border-white/5 mt-auto">
                  <button onClick={(e) => toggleStatus(item.url, 'read', e)} title="Read">
                    {articleStatus[item.url]?.read ? '📖' : '📕'}
                  </button>
                  <button onClick={(e) => toggleStatus(item.url, 'star', e)} title="Star">
                    {articleStatus[item.url]?.star ? '⭐' : '☆'}
                  </button>
                  <button onClick={(e) => toggleStatus(item.url, 'heart', e)} title="Heart">
                    {articleStatus[item.url]?.heart ? '❤️' : '🤍'}
                  </button>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            표시할 뉴스가 없습니다.
          </div>
        )}
      </div>
    </main>
  );
}
