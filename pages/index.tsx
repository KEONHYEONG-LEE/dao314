"use client";
import { useState, useEffect } from "react";

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
    // 1. 구글 번역 UI 정리 로직 (안내 문구 숨김 유지)
    const hideGoogleUI = () => {
      const banner = document.querySelector(".goog-te-banner-frame") as HTMLElement;
      if (banner) banner.style.display = "none";
      
      const tooltip = document.getElementById("goog-gt-tt") as HTMLElement;
      if (tooltip) {
        tooltip.style.display = "none";
        tooltip.style.visibility = "hidden";
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

    return () => clearInterval(interval);
  }, [activeCategory]);

  const toggleStatus = (url: string, type: 'read' | 'star' | 'heart', e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const current = articleStatus[url] || { read: false, star: false, heart: false };
    const newStatus = { ...articleStatus, [url]: { ...current, [type]: !current[type] } };
    setArticleStatus(newStatus);
    localStorage.setItem('gpnr_article_status', JSON.stringify(newStatus));
  };

  return (
    // 'notranslate' 클래스를 제거하여 번역이 가능하게 변경했습니다.
    <div className="flex flex-col min-h-screen bg-white">
      {/* [수정 사항] 
        _app.tsx에서 <Header />를 호출하므로, 
        중복되는 <header> 태그 전체를 삭제했습니다. 
      */}

      {/* 카테고리 네비게이션 - 상단 고정 위치 조정 (Header 높이 56px 고려) */}
      <nav className="flex gap-2 p-3 overflow-x-auto bg-white border-b no-scrollbar sticky top-0 z-40">
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
