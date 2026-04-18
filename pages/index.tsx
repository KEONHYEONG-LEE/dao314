"use client";

import { useState, useEffect } from "react";
import { Grid, X, Share2, ExternalLink, Sparkles, ChevronDown, Users, Eye, Calendar, Loader2 } from 'lucide-react'; 

const CATEGORIES = [
  { id: 'all', label: { ko: '전체', en: 'All' }, icon: <Grid size={18}/> },
  { id: 'mainnet', label: { ko: '메인넷', en: 'Mainnet' }, icon: '🌐' },
  { id: 'community', label: { ko: '커뮤니티', en: 'Community' }, icon: <Users size={18}/> }, 
  { id: 'commerce', label: { ko: '커머스', en: 'Commerce' }, icon: '🛒' },
  { id: 'social', label: { ko: '소셜', en: 'Social' }, icon: '💬' },
  { id: 'education', label: { ko: '교육', en: 'Education' }, icon: '📚' },
  { id: 'utilities', label: { ko: '유틸리티', en: '🛠️' }, icon: '🛠️' },
];

const LANGUAGES = [
  { code: 'ko', label: '한국어' }, { code: 'en', label: 'English' }
];

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lang, setLang] = useState('ko');
  const [langMenu, setLangMenu] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  // --- [추가된 유틸리티 함수] ---
  const cleanContent = (html: string) => {
    if (!html) return "";
    // 1. 이미지 태그에서 URL 추출
    const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
    const extractedImg = imgMatch ? imgMatch[1] : null;
    
    // 2. HTML 태그 제거 및 텍스트 정제
    const text = html
      .replace(/<[^>]*>?/gm, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .trim();
      
    return { text, extractedImg };
  };

  useEffect(() => { fetchNews(); }, [activeCategory, lang]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/fetch-news?category=${activeCategory}&lang=${lang}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        // [핵심 수정] 데이터를 가져올 때 태그를 제거하고 이미지를 추출합니다.
        const cleanedData = data.map(item => {
          const { text, extractedImg } = cleanContent(item.content);
          return {
            ...item,
            content: text, // 태그 제거된 텍스트로 교체
            image: item.image || extractedImg || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800" // 이미지 없으면 추출본, 그것도 없으면 기본값
          };
        });
        setNews(cleanedData);
      } else {
        setNews([]);
      }
    } catch (error) {
      setNews([]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20 font-sans">
      {/* 헤더 생략 (동일) */}
      <header className="bg-[#0D1B3E] text-white px-4 py-3 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white">G</div>
          <span className="text-xl font-black italic tracking-tighter">GPNR</span>
        </div>
        <button onClick={() => setLangMenu(!langMenu)} className="bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold">
          {LANGUAGES.find(l => l.code === lang)?.label}
        </button>
      </header>

      {/* 카테고리 탭 */}
      <nav className="bg-white border-b sticky top-[52px] z-50 overflow-x-auto no-scrollbar py-3 shadow-sm">
        <div className="flex gap-4 px-4">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} 
              className={`flex flex-col items-center min-w-[56px] ${activeCategory === cat.id ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${activeCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>
                {cat.icon}
              </div>
              <span className="text-[10px] font-bold mt-1 uppercase">{cat.id}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* 리스트 영역 */}
      <main className="divide-y divide-gray-100 px-2">
        {loading ? (
          <div className="p-20 text-center animate-pulse text-gray-400 font-bold">데이터 동기화 중...</div>
        ) : (
          news.map((item) => (
            <article key={item.id} className="flex items-center gap-4 p-4 active:bg-gray-50 cursor-pointer" onClick={() => setSelectedNews(item)}>
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 mb-1.5 items-center">
                  <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">{item.category}</span>
                </div>
                <h3 className="font-bold text-[15px] leading-snug line-clamp-2 text-gray-900">{item.title}</h3>
                <p className="text-[10px] text-indigo-400 mt-1.5 font-bold">Source: {item.source}</p>
              </div>
              {/* 이미지 출력 */}
              <img src={item.image} className="w-20 h-20 object-cover rounded-xl border border-gray-100 shadow-sm" alt="thumb" />
            </article>
          ))
        )}
      </main>

      {/* 상세 모달 */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-white w-full max-w-2xl h-[92vh] rounded-t-[2.5rem] overflow-y-auto p-6 animate-in slide-in-from-bottom">
            <div className="flex justify-end mb-4">
              <button onClick={() => setSelectedNews(null)} className="p-2 bg-gray-100 rounded-full"><X/></button>
            </div>
            
            {/* 1. 사진 해결: 추출된 이미지 사용 */}
            <img src={selectedNews.image} className="w-full h-56 object-cover rounded-[2rem] mb-6 shadow-xl" alt="cover" />
            
            <h2 className="text-xl font-black mb-6 leading-tight text-gray-900">{selectedNews.title}</h2> 
            
            {/* 2. a href 제거 해결: 정제된 텍스트 출력 */}
            <div className="text-gray-700 leading-relaxed mb-10 text-[16px] whitespace-pre-wrap border-l-4 border-indigo-100 pl-4">
              {selectedNews.content}
            </div> 

            {/* 3. AI 요약 버튼: 작동 안 하면 삭제 가능 (일단 유지) */}
            <div className="mb-10 bg-indigo-50 p-1 rounded-[2rem]">
              <button className="w-full bg-indigo-600 text-white py-4 rounded-[1.8rem] font-bold flex items-center justify-center gap-2">
                <Sparkles size={18} /> GPNR AI 핵심 내용 요약하기
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <a href={selectedNews.url} target="_blank" className="bg-gray-50 text-center py-4 rounded-2xl font-black text-xs">원문 기사 사이트</a>
              <button className="bg-[#0D1B3E] text-white py-4 rounded-2xl font-black text-xs">소식 공유하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
