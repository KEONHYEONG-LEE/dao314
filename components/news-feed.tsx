"use client"; 

import { useState, useEffect } from "react";

export interface NewsItem {
  id: string;
  category: string;
  title: string;      
  imageUrl?: string;  
  url: string;        // API의 url 필드와 매칭
  sourceName: string; // API의 sourceName 필드와 매칭
  date: string;       // API의 date 필드와 매칭
}

const CATEGORY_MAP: Record<string, string> = {
  ALL: "주요이슈", MAINNET: "메인넷", COMMUNITY: "커뮤니티", COMMERCE: "커머스",
  NODE: "노드", MINING: "채굴", WALLET: "지갑", BROWSER: "브라우저",
  KYC: "KYC", DEVELOPER: "개발자", ECOSYSTEM: "생태계", LISTING: "전망시세",
  PRICE: "가격", SECURITY: "보안", EVENT: "주요행사", ROADMAP: "로드맵",
  WHITEPAPER: "백서", LEGAL: "관련법규"
};

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  const [news, setNews] = useState<NewsItem[]>([]); 
  const [status, setStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean }>>({});

  useEffect(() => {
    const saved = localStorage.getItem('gpnr_status');
    if (saved) setStatus(JSON.parse(saved));

    const fetchLatestNews = async () => {
      try {
        // 실제 파일명인 fetch-news로 경로를 정확히 수정했습니다.
        const response = await fetch(`/api/fetch-news?category=${selectedCategory}`); 
        const allData = await response.json();
        setNews(allData);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
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
        <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" 
           className="block bg-[#1e293b] rounded-xl p-4 border border-slate-700/50 shadow-md">
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase">
                  {CATEGORY_MAP[item.category.toUpperCase()] || item.category}
                </span>
                <h3 className="text-[15px] font-semibold text-slate-100 line-clamp-2 leading-snug mt-1">{item.title}</h3>
              </div>
              <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-400">
                <span className="truncate max-w-[60px]">{item.sourceName}</span>
                <span>{item.date ? new Date(item.date).toLocaleDateString() : ""}</span>
                <div className="flex items-center gap-3 ml-auto text-sm">
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
      )) : <div className="text-center py-20 text-slate-500 text-sm">뉴스를 불러오는 중입니다...</div>}
    </section>
  );
}
