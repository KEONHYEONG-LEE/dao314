"use client"; 

import { useState, useEffect } from "react";

export interface NewsItem {
  id: string;
  category: string;
  title: string;      
  imageUrl?: string;  
  image?: string;       // 백엔드 API 변경 대비 대체 변수 1
  urlToImage?: string;  // 백엔드 API 변경 대비 대체 변수 2
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

/**
 * 뉴스 본문에서 HTML 태그와 특수 엔티티(&lt; 등)를 완벽히 제거하는 함수
 */
const stripHtml = (html: string) => {
  if (!html) return "";
  
  try {
    // 1. HTML 엔티티(&lt;, &gt;, &nbsp; 등)를 실제 기호(<, >, 공백)로 변환
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const decodedText = doc.body.textContent || "";

    // 2. 변환된 텍스트에서 <a>, <font> 등 남아있는 모든 HTML 태그 제거
    return decodedText.replace(/<\/?[^>]+(>|$)/g, "").trim();
  } catch (e) {
    // 만약 브라우저 환경이 아닐 경우를 대비한 대체 정규식 처리
    return html
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ')
      .replace(/<\/?[^>]+(>|$)/g, "").trim();
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
        
        // 🚀 [디버깅 로그] 브라우저 개발자 도구(F12) 콘솔에서 데이터 키 구조를 확인하기 위함
        console.log("=== GPNR 받아온 뉴스 데이터 샘플 ===");
        if (allData && allData.length > 0) {
          console.log("첫 번째 뉴스 객체 전체 구조:", allData[0]);
        } else {
          console.log("받아온 뉴스 데이터 배열이 비어있습니다.");
        }

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

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className={`pb-24 space-y-3 mt-4 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
      {news.length > 0 ? (
        news.map((item) => {
          // 백엔드 데이터에서 가용한 이미지 주소 추출
          const validImageUrl = item.imageUrl || item.image || item.urlToImage;

          return (
            <div 
              key={item.id} 
              className="block bg-[#1e293b] rounded-xl border border-slate-700/50 shadow-md transition-all overflow-hidden"
            >
              <div 
                onClick={() => handleToggleExpand(item.id)}
                className="p-4 cursor-pointer active:bg-slate-800 transition-colors"
              >
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <span className="text-[10px] font-bold text-amber-500 uppercase notranslate" translate="no">
                        {CATEGORY_MAP[item.category.toUpperCase()] || item.category}
                      </span>
                      <h3 className="text-[15px] font-semibold text-slate-100 line-clamp-2 leading-snug mt-1">
                        {stripHtml(item.title)}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-400">
                      <span className="truncate max-w-[100px]">{item.source}</span>
                      <span>•</span>
                      <span>{item.date ? new Date(item.date).toLocaleDateString() : ""}</span>
                      <div className="flex items-center gap-3 ml-auto text-sm">
                        <button onClick={(e)=>toggleStatus(item.id,'read',e)}>
                          {status[item.id]?.read ? <span className="text-green-500">✔️</span> : "○"}
                        </button>
                        <button onClick={(e)=>toggleStatus(item.id,'star',e)} className={status[item.id]?.star ? "text-yellow-400":"text-slate-500"}>★</button>
                        <button onClick={(e)=>toggleStatus(item.id,'heart',e)} className={status[item.id]?.heart ? "text-red-500":"text-slate-500"}>♥</button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 이미지 주소가 존재할 때만 우측에 레이아웃을 렌더링 (구글 번역 버그 방지 속성 포함) */}
                  {validImageUrl && (
                    <div className="w-20 h-20 flex-shrink-0 notranslate" translate="no">
                      <img 
                        src={validImageUrl} 
                        alt="" 
                        className="w-full h-full object-cover rounded-lg bg-slate-800" 
                      />
                    </div>
                  )}
                </div>
              </div>

              <div 
                className={`transition-all duration-300 ease-in-out ${expandedId === item.id ? 'max-h-[2000px] opacity-100 border-t border-slate-700/50' : 'max-h-0 opacity-0 overflow-hidden'}`}
              >
                <div className="p-4 bg-slate-900/50">
                  <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                    {/* 정제된 원문 텍스트만 출력
