"use client";

import { useState, useEffect } from "react";
import { Grid, X, Share2, ExternalLink, Sparkles, ChevronDown, Users, Calendar, Loader2 } from 'lucide-react'; 

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lang, setLang] = useState('ko');
  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  // --- [안전한 데이터 정제 함수] ---
  const safeClean = (item: any) => {
    // 1. 내용(content)이 없으면 제목이나 요약을 대신 사용
    let rawContent = item.content || item.description || item.excerpt || "";
    
    // 2. 이미지 추출 (없으면 기본 이미지)
    const imgMatch = rawContent.match(/<img[^>]+src="([^">]+)"/);
    const extractedImg = imgMatch ? imgMatch[1] : item.image;
    
    // 3. HTML 태그 제거 (매우 안전한 방식)
    const cleanText = rawContent
      .replace(/<[^>]*>?/gm, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();

    return {
      ...item,
      title: item.title || "No Title",
      content: cleanText || "내용 없음", // 내용이 비어있지 않게 보장
      image: extractedImg || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800"
    };
  };

  useEffect(() => { fetchNews(); }, [activeCategory, lang]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/fetch-news?category=${activeCategory}&lang=${lang}`);
      const data = await res.json();
      
      // 데이터가 넘어오면 무조건 map으로 돌려서 보여줌
      if (data && Array.isArray(data)) {
        const processed = data.map(item => safeClean(item));
        setNews(processed);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error("뉴스 로드 실패:", error);
      setNews([]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20 font-sans">
      {/* 헤더 및 카테고리 네비게이션은 기존과 동일하게 유지 */}
      
      <main className="divide-y divide-gray-100 px-2">
        {loading ? (
          <div className="p-20 text-center text-gray-400 font-bold">데이터 동기화 중...</div>
        ) : news.length > 0 ? (
          news.map((item, idx) => (
            <article key={item.id || idx} className="flex items-center gap-4 p-4 active:bg-gray-50" onClick={() => setSelectedNews(item)}>
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 mb-1.5 items-center">
                  <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">
                    {item.category || activeCategory}
                  </span>
                </div>
                <h3 className="font-bold text-[15px] leading-snug line-clamp-2 text-gray-900">{item.title}</h3>
                <p className="text-[10px] text-indigo-400 mt-1.5 font-bold">Source: {item.source || "GPNR"}</p>
              </div>
              <img src={item.image} className="w-20 h-20 object-cover rounded-xl border border-gray-100 shadow-sm" alt="thumb" />
            </article>
          ))
        ) : (
          <div className="p-20 text-center text-gray-400">뉴스가 없습니다. 카테고리를 변경해 보세요.</div>
        )}
      </main>

      {/* 상세 모달 부분도 selectedNews.content를 그대로 보여주면 됨 */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-white w-full max-w-2xl h-[92vh] rounded-t-[2.5rem] overflow-y-auto p-6">
            <div className="flex justify-end mb-4">
              <button onClick={() => setSelectedNews(null)} className="p-2 bg-gray-100 rounded-full"><X/></button>
            </div>
            <img src={selectedNews.image} className="w-full h-56 object-cover rounded-[2rem] mb-6 shadow-xl" alt="cover" />
            <h2 className="text-xl font-black mb-6 leading-tight text-gray-900">{selectedNews.title}</h2> 
            <div className="text-gray-700 leading-relaxed mb-10 text-[16px] whitespace-pre-wrap border-l-4 border-indigo-100 pl-4">
              {selectedNews.content}
            </div> 
            {/* 요약 버튼은 나중에 구현되도록 놔두거나 삭제 */}
          </div>
        </div>
      )}
    </div>
  );
}
