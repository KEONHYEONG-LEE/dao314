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
    const hideGoogleUI = () => {
      const banner = document.querySelector(".goog-te-banner-frame") as HTMLElement;
      if (banner) banner.style.display = "none";
      const tooltip = document.getElementById("goog-gt-tt") as HTMLElement;
      if (tooltip) { tooltip.style.display = "none"; tooltip.style.visibility = "hidden"; }
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
    e.preventDefault(); e.stopPropagation();
    const current = articleStatus[url] || { read: false, star: false, heart: false };
    const newStatus = { ...articleStatus, [url]: { ...current, [type]: !current[type] } };
    setArticleStatus(newStatus);
    localStorage.setItem('gpnr_article_status', JSON.stringify(newStatus));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <nav className="flex gap-2 p-3 overflow-x-auto bg-slate-900 border-b border-white/5 no-scrollbar sticky top-0 z-40">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex-shrink-0 border ${
              activeCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>

      <main className="divide-y divide-white/5">
        {loading ? (
          <div className="p-20 text-center text-slate-500 text-sm animate-pulse">Loading GPNR News...</div>
        ) : news.length > 0 ? (
          news.map((item, idx) => {
            const status = articleStatus[item.url] || { read: false, star: false, heart: false };
            return (
              <div key={idx} className="bg-slate-900">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex gap-4 p-4 pb-0">
                  <div className="flex-1">
                    <h3 className={`font-bold text-[15px] line-clamp-2 leading-snug ${status.read ? 'text-slate-600' : 'text-slate-100'}`}>
                      {status.star && <span className="mr-1">⭐</span>}
                      {status.heart && <span className="mr-1">❤️</span>}
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-blue-400">{item.source}</span>
                      <span className="text-[10px] text-slate-500">{item.date}</span>
                    </div>
                  </div>
                  {item.imageUrl && (
                    <img src={item.imageUrl} className="w-16 h-16 object-cover rounded-xl bg-slate-800 flex-shrink-0 mt-0.5" alt="" />
                  )}
                </a>
                <div className="flex gap-7 px-4 pt-1 pb-3">
                  <button onClick={(e) => toggleStatus(item.url, 'read', e)} className="text-lg opacity-80">{status.read ? '✔️' : '📖'}</button>
                  <button onClick={(e) => toggleStatus(item.url, 'star', e)} className="text-lg opacity-80">{status.star ? '🌟' : '☆'}</button>
                  <button onClick={(e) => toggleStatus(item.url, 'heart', e)} className="text-lg opacity-80">{status.heart ? '❤️' : '♡'}</button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-20 text-center text-slate-500 text-sm">No news available.</div>
        )}
      </main>
    </div>
  );
}
