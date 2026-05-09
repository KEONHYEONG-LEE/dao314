"use client"; 

import { useState, useEffect } from "react";

export interface NewsItem {
  id: string;
  category: string;
  title: string;      
  imageUrl?: string;  
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
 * HTML 태그를 제거하고 순수 텍스트만 추출하는 함수
 */
const stripHtml = (html: string) => {
  if (!html) return "";
  // 1. HTML 태그 제거
  let cleanText = html.replace(/<\/?[^>]+(>|$)/g, "");
  // 2. 특수 문자 엔티티 변환 (&quot;, &lt; 등)
  const doc = new DOMParser().parseFromString(cleanText, 'text/html');
  return doc.body.textContent || cleanText;
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

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className={`pb-24 space-y-3 mt-4 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
      {news.length > 0 ? (
        news.map((item) => (
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
                    {/* 제목도 HTML 태그가 섞여 들어올 수 있으므로 처리 */}
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
                {item.imageUrl && (
                  <div className="w-20 h-20 flex-shrink-0">
                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover rounded-lg bg-slate-800" />
                  </div>
                )}
              </div>
            </div>

            <div 
              className={`transition-all duration-300 ease-in-out ${expandedId === item.id ? 'max-h-[2000px] opacity-100 border-t border-slate-700/50' : 'max-h-0 opacity-0 overflow-hidden'}`}
            >
              <div className="p-4 bg-slate-900/50">
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                  {/* stripHtml 함수를 적용하여 태그 없이 텍스트만 출력 */}
                  {item.content ? stripHtml(item.content) : "상세 내용을 불러올 수 없습니다."}
                </div>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[12px] text-amber-500 font-medium hover:underline"
                >
                  출처에서 원문 보기 →
                </a>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-20 text-slate-500 text-sm">
          {loading ? "뉴스를 불러오는 중입니다..." : "해당 카테고리의 뉴스가 없습니다."}
        </div>
      )}
    </section>
  );
}
