"use client"; 

import { useState, useEffect } from "react";

export interface NewsItem {
  id: string;
  category: string;
  title: string;      
  imageUrl?: string;  
  image?: string;       
  urlToImage?: string;  
  url: string;
  source: string;
  date: string;
  content?: string; 
}

const CATEGORY_MAP: Record<string, string> = {
  ALL: "주요이슈", MAINNET: "메인넷", COMMUNITY: "커뮤니티", COMMERCE: "커머스",
  NODE: "노드", MINING: "채굴", WALLET: "지갑", BROWSER: "브라우저",
  KYC: "KYC", DEVELOPER: "개발자", ECOSYSTEM: "생태계", LISTING: "전망시세",
  PRICE: "가격", SECURITY: "보안", EVENT: "주요행사", ROADMAP: "로드맵",
  WHITEPAPER: "백서", LEGAL: "관련법규"
};

const stripHtml = (html: string) => {
  if (!html) return "";
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return (doc.body.textContent || "").replace(/<\/?[^>]+(>|$)/g, "").trim();
  } catch (e) {
    return html.replace(/<\/?[^>]+(>|$)/g, "").trim();
  }
};

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<NewsItem[]>([]); 
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean }>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('gpnr_status');
    if (saved) setStatus(JSON.parse(saved));

    const fetchLatestNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/fetch-news?category=${selectedCategory}`); 
        const allData = await response.json();
        setNews(allData || []);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestNews();
  }, [selectedCategory]); 

  const toggleStatus = (id: string, type: 'read' | 'star' | 'heart', e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const newStatus = { ...status, [id]: { ...(status[id] || {read:false, star:false, heart:false}), [type]: !(status[id]?.[type]) } };
    setStatus(newStatus);
    localStorage.setItem('gpnr_status', JSON.stringify(newStatus));
  };

  return (
    <section className={`pb-24 space-y-3 mt-4 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
      {news.length > 0 ? (
        news.map((item) => {
          return (
            <div key={item.id} className="block bg-[#1e293b] rounded-xl border border-slate-700/50 shadow-md overflow-hidden">
              <div 
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} 
                className="p-4 cursor-pointer active:bg-slate-800 transition-colors"
              >
                {/* 🚀 우측 사진 컴포넌트 구조를 완전히 도려내고 100% 세로형 풀 텍스트 배치로 전환 */}
                <div className="w-full flex flex-col justify-between">
                  <div>
                    {/* 카테고리 태그 */}
                    <span className="text-[10px] font-bold text-amber-500 uppercase notranslate" translate="no">
                      {CATEGORY_MAP[item.category.toUpperCase()] || item.category}
                    </span>
                    
                    {/* 뉴스 제목 - 우측 제약이 없어졌으므로 가로 전체 영역을 활용해 막힘없이 표출 */}
                    <h3 className="text-[15px] font-semibold text-slate-100 leading-snug mt-1 break-words">
                      {stripHtml(item.title)}
                    </h3>
                  </div>
                  
                  {/* 하단 메타 정보 & 아이콘 영역 */}
                  <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-400 w-full">
                    <span className="truncate max-w-[140px]">{item.source}</span>
                    <span>•</span>
                    <span>{item.date ? new Date(item.date).toLocaleDateString() : ""}</span>
                    
                    {/* 체크, 별, 하트 액션 버튼 우측 정렬 유지 */}
                    <div className="flex items-center gap-3 ml-auto text-sm">
                      <button onClick={(e)=>toggleStatus(item.id,'read',e)}>
                        {status[item.id]?.read ? <span className="text-green-500">✔️</span> : "○"}
                      </button>
                      <button onClick={(e)=>toggleStatus(item.id,'star',e)} className={status[item.id]?.star ? "text-yellow-400":"text-slate-500"}>★</button>
                      <button onClick={(e)=>toggleStatus(item.id,'heart',e)} className={status[item.id]?.heart ? "text-red-500":"text-slate-500"}>♥</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 아코디언 상세 내용 본문 영역 */}
              <div className={`transition-all duration-300 ease-in-out ${expandedId === item.id ? 'max-h-[2000px] opacity-100 border-t border-slate-700/50' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-4 bg-slate-900/50">
                  <div className="text-slate
