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
      // 1. 경로를 처음 성공했던 /api/fetch-news 로 정확히 맞춤
      const res = await fetch(`/api/fetch-news?category=${activeCategory}&lang=${lang}`);
      const data = await res.json();
      
      // 2. 데이터가 배열이기만 하면 일단 무조건 받음
      if (Array.isArray(data)) {
        setNews(data);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      setNews([]);
    }
    setLoading(false);
  };

  // 3. [핵심] 화면에 그릴 때만 태그를 지워주는 안전장치
  const renderCleanContent = (content: any) => {
    if (!content) return "";
    const text = typeof content === 'string' ? content : (content.ko || content.en || "");
    return text.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").trim();
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20 font-sans">
      {/* 헤더 부분 */}
      <header className="bg-[#0D1B3E] text-white px-4 py-3 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">G</div>
          <span className="text-xl font-black italic tracking-tighter">GPNR</span>
        </div>
      </header>

      {/* 카테고리 (가장 안정적인 텍스트 버튼 스타일) */}
      <nav className="bg-white border-b sticky top-[52px] z-50 overflow-x-auto py-3">
        <div className="flex gap-4 px-4">
          {['all', 'mainnet', 'community', 'commerce'].map(id => (
            <button key={id} onClick={() => setActiveCategory(id)} 
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === id ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>
              {id.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      {/* 기사 리스트 (무조건 나오게 하는 구조) */}
      <main className="divide-y divide-gray-100 px-2">
        {loading ? (
          <div className="p-20 text-center text-gray-400 font-bold">데이터 로딩 중...</div>
        ) : news.length > 0 ? (
          news.map((item, idx) => (
            <article key={idx} className="flex items-center gap-4 p-4 active:bg-gray-50" onClick={() => setSelectedNews(item)}>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[15px] leading-snug line-clamp-2 text-gray-900">
                  {typeof item.title === 'string' ? item.title : (item.title?.ko || item.title?.en || "제목 없음")}
                </h3>
                <p className="text-[10px] text-gray-400 mt-1">{item.source || "GPNR News"}</p>
              </div>
              <img src={item.image || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200"} 
                className="w-16 h-16 object-cover rounded-xl border border-gray-100" alt="thumb" />
            </article>
          ))
        ) : (
          <div className="p-20 text-center text-gray-400">등록된 기사가 없습니다.</div>
        )}
      </main>

      {/* 상세 모달 (깔끔하게 텍스트만 출력) */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-end justify-center">
          <div className="bg-white w-full max-w-2xl h-[90vh] rounded-t-[2.5rem] overflow-y-auto p-6">
            <div className="flex justify-end mb-4">
              <button onClick={() => setSelectedNews(null)} className="p-2 bg-gray-100 rounded-full font-bold">닫기</button>
            </div>
            <img src={selectedNews.image} className="w-full h-52 object-cover rounded-2xl mb-6" />
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              {typeof selectedNews.title === 'string' ? selectedNews.title : (selectedNews.title?.ko || selectedNews.title?.en)}
            </h2> 
            <div className="text-gray-700 leading-relaxed mb-10 text-[16px] whitespace-pre-wrap">
              {renderCleanContent(selectedNews.content)}
            </div> 
          </div>
        </div>
      )}
    </div>
  );
}
