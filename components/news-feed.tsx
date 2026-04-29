"use client"; 

import { useState, useEffect } from "react";

// 1. 기존의 고정된 NEWS_DATA 대신 실시간 API 호출을 위해 인터페이스만 남깁니다.
export interface NewsItem {
  id: string;
  category: string;
  title: string;      
  imageUrl?: string;  
  sourceUrl: string;   
  sourceName: string;   
  publishedAt: string;  
}

// 2. 카테고리 한글 변환 맵 (사용자님이 수정해주신 최신 버전)
const CATEGORY_MAP: Record<string, string> = {
  ALL: "주요이슈",
  MAINNET: "메인넷",
  COMMUNITY: "커뮤니티",
  COMMERCE: "커머스",
  NODE: "노드",
  MINING: "채굴",
  WALLET: "지갑",
  BROWSER: "브라우저",
  KYC: "KYC",
  DEVELOPER: "개발자",
  ECOSYSTEM: "생태계",
  LISTING: "전망시세",
  PRICE: "가격",
  SECURITY: "보안",
  EVENT: "주요행사",
  ROADMAP: "로드맵",
  WHITEPAPER: "백서",
  LEGAL: "관련법규"
};

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<NewsItem[]>([]); 
  const [status, setStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean }>>({});

  useEffect(() => {
    // 로컬 스토리지 상태 불러오기
    const saved = localStorage.getItem('gpnr_status');
    if (saved) setStatus(JSON.parse(saved));

    // 매 시간 실시간 소식을 불러오는 로직 복구
    const fetchLatestNews = async () => {
      try {
        // 기존에 작동하던 API 경로(예: /api/news)를 호출하여 실시간 데이터를 가져옵니다.
        const response = await fetch('/api/news'); 
        const allData: NewsItem[] = await response.json();

        // 카테고리 필터링 및 최신순 정렬
        const filtered = allData.filter((item) => {
          if (!selectedCategory || selectedCategory.toUpperCase() === "ALL") return true;
          return item.category.toUpperCase() === selectedCategory.toUpperCase();
        });
        
        setNews([...filtered].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
      } catch (error) {
        console.error("뉴스를 불러오는 데 실패했습니다:", error);
      }
    };

    fetchLatestNews();
  }, [selectedCategory]); 

  const toggle = (id: string, type: 'read' | 'star' | 'heart', e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const newStatus = { ...status, [id]: { ...(status[id] || {read:false, star:false, heart:false}), [type]: !(status[id]?.[type]) } };
    setStatus(newStatus);
    localStorage.setItem('gpnr_status', JSON.stringify(newStatus));
  };

  return (
    <section className="px-4 pb-24 space-y-3 mt-4">
      {news.length > 0 ? news.map((item) => (
        <a key={item.id} href={item.sourceUrl} target="_blank" rel="noopener noreferrer" 
           className="block bg-[#1e293b] rounded-xl p-4 border border-slate-700/50 shadow-md">
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                {/* 카테고리 이름을 맵핑 정보에 따라 한국어로 표시 */}
                <span className="text-[10px] font-bold text-amber-500 uppercase">
                  {CATEGORY_MAP[item.category.toUpperCase()] || item.category}
                </span>
                <h3 className="text-[15px] font-semibold text-slate-100 line-clamp-2 leading-snug mt-1">{item.title}</h3>
              </div>
              <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-400">
                <span className="truncate max-w-[60px]">{item.sourceName || "GPNR"}</span>
                <span>{item.publishedAt.substring(0, 10).replace(/-/g, '.')}</span>
                <div className="flex items-center gap-3 ml-auto text-sm">
                  {/* 읽음 표시: 원형 아이콘에서 ✔️ 표시로 변경 */}
                  <button onClick={(e)=>toggle(item.id,'read',e)}>
                    {status[item.id]?.read ? <span className="text-green-500">✔️</span> : "○"}
                  </button>
                  <button onClick={(e)=>toggle(item.id,'star',e)} className={status[item.id]?.star ? "text-yellow-400":"text-slate-500"}>★</button>
                  <button onClick={(e)=>toggle(item.id,'heart',e)} className={status[item.id]?.heart ? "text-red-500":"text-slate-500"}>♥</button>
                </div>
              </div>
            </div>
            {item.imageUrl && (
              <div className="w-20 h-20 flex-shrink-0">
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover rounded-lg bg-slate-800" />
              </div>
            )}
          </div>
        </a>
      )) : <div className="text-center py-20 text-slate-500 text-sm">뉴스가 없습니다.</div>}
    </section>
  );
}
