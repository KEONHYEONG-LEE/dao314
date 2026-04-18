"use client";

import { useState, useEffect } from "react";
import { Grid, X, Share2, ExternalLink, Sparkles, ChevronDown, Users, Calendar, Loader2 } from 'lucide-react'; 

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lang, setLang] = useState('ko');
  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  useEffect(() => { fetchNews(); }, [activeCategory, lang]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/fetch-news?category=${activeCategory}&lang=${lang}`);
      const data = await res.json();
      
      // 데이터가 있으면 복잡한 가공 없이 그대로 설정
      if (data && Array.isArray(data)) {
        setNews(data);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setNews([]);
    }
    setLoading(false);
  };

  // 태그 제거 함수는 렌더링 시점에만 아주 조심스럽게 사용
  const getCleanText = (text: any) => {
    if (typeof text !== 'string') return "";
    return text.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").trim();
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20 font-sans">
      <header className="bg-[#0D1B3E] text-white px-4 py-3 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">G</div>
          <span className="text-xl font-black italic">GPNR</span>
        </div>
      </header>

      <nav className="bg-white border-b sticky top-[52px] z-50 overflow-x-auto py-3">
        <div className="flex gap-4 px-4">
          {['all', 'mainnet', 'community'].map(id => (
            <button key={id} onClick={() => setActiveCategory(id)} 
              className={`px-4 py-2 rounded-xl text-xs font-bold ${activeCategory === id ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>
              {id.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      <main className="divide-y divide-gray-100 px-2">
        {loading ? (
          <div className="p-20 text-center text-gray-400">데이터 로딩 중...</div>
        ) : news.length > 0 ? (
          news.map((item, idx) => (
            <article key={idx} className="flex items-center gap-4 p-4" onClick={() => setSelectedNews(item)}>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[15px] line-clamp-2">{item.title?.ko || item.title?.en || item.title || "제목 없음"}</h3>
                <p className="text-[10px] text-gray-400 mt-1">{item.source || "GPNR News"}</p>
              </div>
              <img src={item.image || item.imageUrl || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200"} 
                className="w-16 h-16 object-cover rounded-lg" alt="thumb" />
            </article>
          ))
        ) : (
          <div className="p-20 text-center text-gray-400">기사를 불러올 수 없습니다.</div>
        )}
      </main>

      {selectedNews && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-end">
          <div className="bg-white w-full h-[85vh] rounded-t-3xl p-6 overflow-y-auto">
            <button onClick={() => setSelectedNews(null)} className="float-right font-bold text-xl">X</button>
            <h2 className="text-xl font-bold mb-4 mt-6">{selectedNews.title?.ko || selectedNews.title?.en || selectedNews.title}</h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {getCleanText(selectedNews.content?.ko || selectedNews.content?.en || selectedNews.content)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
