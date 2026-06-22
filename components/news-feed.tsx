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
        news.map((item, index) => {
          // 🚀 [해결책 1] 주소 유실을 방지하기 위해 심플한 다이렉트 랜덤 인덱스 할당
          const imgIndex = (index % 5) + 1; 
          const fallbackUrl = `https://picsum.photos/id/${imgIndex + 10}/200/200`;

          return (
            <div key={item.id} className="block bg-[#1e293b] rounded-xl border border-slate-700/50 shadow-md overflow-hidden">
              <div onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="p-4 cursor-pointer active:bg-slate-800 transition-colors">
                <div className="flex gap-4 items-center justify-between">
                  
                  {/* 왼쪽 글자 영역 */}
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
                        <button onClick={(e)=>toggleStatus(item.id,'read',e)}>{status[item.id]?.read ? <span className="text-green-500">✔️</span> : "○"}</button>
                        <button onClick={(e)=>toggleStatus(item.id,'star',e)} className={status[item.id]?.star ? "text-yellow-400":"text-slate-500"}>★</button>
                        <button onClick={(e)=>toggleStatus(item.id,'heart',e)} className={status[item.id]?.heart ? "text-red-500":"text-slate-500"}>♥</button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 🚀 [해결책 2] 번역기 습격 및 외부 캐시 서버 차단을 우회하는 절대 방어존 생성 */}
                  {/* 정적 그라데이션 컬러 배경(bg-gradient-to-br)을 기저에 깔아두어, 외부 이미지가 터져도 박스가 절대 깨지지 않고 고급스러운 UI 유지 */}
                  <div 
                    className="w-20 h-20 flex-shrink-0 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 bg-cover bg-center border border-slate-600/40 shadow-inner translate-z-0"
                    style={{ backgroundImage: `url(${item.imageUrl || fallbackUrl})` }}
                    data-google-lang="no"
                    translate="no"
                  >
                    {/* 일반 <img> 태그를 숨겨놓아 브라우저가 정식 렌더링에 실패하더라도 캐시 엑박이 부모 박스를 망가뜨리지 못하게 격리 */}
                    <img 
                      src={item.imageUrl || fallbackUrl} 
                      alt="" 
                      className="hidden" 
                      onError={(e) => {
                        // 🛑 에러 발생 시 부모 박스의 배경 이미지를 제거하여 완벽하고 깔끔한 다크 그라데이션 박스로 대체
                        (e.currentTarget.parentElement as HTMLElement).style.backgroundImage = 'none';
                      }}
                    />
                  </div>

                </div>
              </div>

              <div className={`transition-all duration-300 ease-in-out ${expandedId === item.id ? 'max-h-[2000px] opacity-100 border-t border-slate-700/50' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-4 bg-slate-900/50">
                  <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                    {stripHtml(item.content || "") || `${stripHtml(item.title)}에 대한 자세한 내용을 확인하려면 아래 출처 링크를 클릭하세요.`}
                  </div>
                  <div className="flex justify-end">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-bold text-blue-400 hover:text-blue-300">
                      출처 기사 보기 →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-12 text-slate-500 text-sm">아직 등록된 실시간 뉴스가 없습니다.</div>
      )}
    </section>
  );
}
