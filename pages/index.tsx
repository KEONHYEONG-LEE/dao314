"use client";

import { useState, useEffect } from "react";
import { Grid, X, Share2, ExternalLink, Sparkles, ChevronDown, Users, Calendar, Loader2 } from 'lucide-react'; 

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lang, setLang] = useState('ko');
  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  // --- [무조건 데이터를 찾아내는 정제 함수] ---
  const ultraSafeClean = (item: any) => {
    // 1. 제목 찾기 (객체 형태든 문자열 형태든 다 뒤짐)
    const rawTitle = item.title?.ko || item.title?.en || item.title || "No Title";
    
    // 2. 내용 찾기 (HTML 태그 제거 포함)
    const rawContent = item.content?.ko || item.content?.en || item.content || item.description || "";
    const cleanText = rawContent
      .replace(/<[^>]*>?/gm, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .trim();

    // 3. 이미지 찾기
    const imgMatch = rawContent.match(/<img[^>]+src="([^">]+)"/);
    const finalImg = item.image || item.imageUrl || (imgMatch ? imgMatch[1] : "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800");

    return {
      ...item,
      title: rawTitle,
      content: cleanText || "Content preview unavailable",
      image: finalImg
    };
  };

  useEffect(() => { fetchNews(); }, [activeCategory, lang]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/fetch-news?category=${activeCategory}&lang=${lang}`);
      const data = await res.json();
      
      if (data && Array.isArray(data) && data.length > 0) {
        const processed = data.map(item => ultraSafeClean(item));
        setNews(processed);
      } else {
        // 데이터가 비어있으면 빈 배열 설정
        setNews([]);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      setNews([]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20 font-sans">
      {/* 상단 헤더 및 네비게이션은 기존 스타일 유지 */}
      
      <main className="divide-y divide-gray-100 px-2">
        {loading ? (
          <div className="p-20 text-center text-gray-400 font-bold animate-pulse">데이터 동기화 중...</div>
        ) : news.length > 0 ? (
          news.map((item, idx) => (
            <article key={item.id || idx} className="flex items-center gap-4 p-4 active:bg-gray-100" onClick={() => setSelectedNews(item)}>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase mb-1 inline-block">
                  {item.category || activeCategory}
                </span>
                <h3 className="font-bold text-[15px] leading-snug line-clamp-2 text-gray-900">{item.title}</h3>
                <p className="text-[10px] text-gray-400 mt-1">Source: {item.source || "GPNR"}</p>
              </div>
              <img src={item.image} className="w-20 h-20 object-cover rounded-xl border" alt="thumb" />
            </article>
          ))
        ) : (
          <div className="p-20 text-center text-gray-400 font-bold">
            뉴스를 찾을 수 없습니다. <br/> 카테고리나 언어를 변경해 보세요!
          </div>
        )}
      </main>

      {/* 상세 모달 */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-end justify-center">
          <div className="bg-white w-full max-w-2xl h-[90vh] rounded-t-[2rem] overflow-y-auto p-6">
            <button onClick={() => setSelectedNews(null)} className="float-right p-2 bg-gray-100 rounded-full"><X/></button>
            <img src={selectedNews.image} className="w-full h-52 object-cover rounded-2xl mb-4" />
            <h2 className="text-xl font-bold mb-4">{selectedNews.title}</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedNews.content}</div>
          </div>
        </div>
      )}
    </div>
  );
}
