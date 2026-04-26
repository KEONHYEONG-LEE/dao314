"use client";
import { useState, useEffect } from "react";
import { CategoryTabs } from "../components/category-tabs";

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [articleStatus, setArticleStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean }>>({});

  useEffect(() => {
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
    
    const savedStatus = localStorage.getItem('gpnr_article_status');
    if (savedStatus) setArticleStatus(JSON.parse(savedStatus));

    const fetchNews = async () => {
      setLoading(true);
      try {
        const query = activeCategory === 'all' ? '' : `?category=${activeCategory.toUpperCase()}`;
        const res = await fetch(`/api/fetch-news${query}`);
        const data = await res.json();
        setNews(Array.isArray(data) ? data : (data.articles || []));
      } catch (error) {
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
    // 메인 배경을 아주 어두운 네이비(#0f172a)로 고정
    <main className="min-h-screen bg-[#0f172a] text-slate-100">
      <CategoryTabs 
        selectedCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20 text-slate-500 animate-pulse">뉴스를 불러오는 중입니다...</div>
        ) : news.length > 0 ? (
          <div className="grid gap-4">
            {news.map((item, index) => (
              <div 
                key={index} 
                // 카드 배경을 #1e293b로 설정하고, 읽은 기사는 투명도를 줘서 구분
                className={`p-5 rounded-2xl border border-slate-800 transition-all ${
                  articleStatus[item.url]?.read 
                    ? 'bg-slate-800/40 opacity-50' 
                    : 'bg-[#1e293b] shadow-lg shadow-black/20'
                }`}
              >
                <h2 className="text-lg font-bold mb-4 text-white leading-tight">
                  {item.title}
                </h2>
                <div className="flex gap-6 text-2xl bg-black/20 w-fit px-4 py-2 rounded-xl border border-white/5">
                  <button onClick={(e) => toggleStatus(item.url, 'read', e)} className="hover:scale-110 transition-transform">
                    {articleStatus[item.url]?.read ? '📖' : '📕'}
                  </button>
                  <button onClick={(e) => toggleStatus(item.url, 'star', e)} className="hover:scale-110 transition-transform">
                    {articleStatus[item.url]?.star ? '⭐' : '☆'}
                  </button>
                  <button onClick={(e) => toggleStatus(item.url, 'heart', e)} className="hover:scale-110 transition-transform">
                    {articleStatus[item.url]?.heart ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">표시할 뉴스가 없습니다.</div>
        )}
      </div>
    </main>
  );
}
