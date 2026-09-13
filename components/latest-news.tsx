"use client";

import { useState, useEffect } from "react";
import { ExternalLink, ChevronDown, ChevronUp, Lock, Bookmark, Heart, Share2 } from "lucide-react";
import { NEWS_DATA } from "@/lib/pi-news-v2";

export function LatestNews() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  // 북마크 및 좋아요 상태 관리 (로컬스토리지 연동)
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [likes, setLikes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkLogin = () => {
      const savedId = localStorage.getItem('pi_user_id');
      setIsLoggedIn(!!savedId);
    };
    
    // 북마크/좋아요 로컬 데이터 로드
    const savedBookmarks = JSON.parse(localStorage.getItem('gpnr_bookmarks') || '{}');
    const savedLikes = JSON.parse(localStorage.getItem('gpnr_likes') || '{}');
    setBookmarks(savedBookmarks);
    setLikes(savedLikes);

    checkLogin();
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  const getText = (field: any) => {
    if (!field) return ""; 
    if (typeof field === "string") return field;
    return field.ko || field.en || ""; 
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const isValidUrl = (url?: string) => {
    if (!url || typeof url !== "string") return false;
    return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // 언론사 도메인 기반 Favicon 추출 (Fallback용)
  const getFaviconUrl = (sourceUrl?: string) => {
    if (!sourceUrl) return "https://minepi.com/favicon.ico";
    try {
      const domain = new URL(sourceUrl).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return "https://minepi.com/favicon.ico";
    }
  };

  const handleToggleExpand = (id: string) => {
    if (!isLoggedIn) {
      alert("로그인 후 이용해 주세요.");
      return;
    }
    setExpandedId(expandedId === id ? null : id);
  };

  const handleExternalClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert("로그인 후 이용해 주세요.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // 북마크 토글
  const handleToggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = { ...bookmarks, [id]: !bookmarks[id] };
    setBookmarks(updated);
    localStorage.setItem('gpnr_bookmarks', JSON.stringify(updated));
  };

  // 좋아요 토글
  const handleToggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = { ...likes, [id]: !likes[id] };
    setLikes(updated);
    localStorage.setItem('gpnr_likes', JSON.stringify(updated));
  };

  // 공유하기 (클립보드 복사)
  const handleShare = (e: React.MouseEvent, news: any) => {
    e.stopPropagation();
    const shareUrl = news.sourceUrl || window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      alert("기사 링크가 클립보드에 복사되었습니다.");
    }
  };

  return (
    <section className="py-6 px-1 bg-[#0a0a0a]">
      <div className="flex flex-col">
        {NEWS_DATA.map((news) => {
          const hasValidImage = isValidUrl(news.imageUrl) && !imageErrors[news.id];
          const faviconUrl = getFaviconUrl(news.sourceUrl);

          return (
            <div key={news.id} className="border-b border-white/[0.08]">
              <article
                onClick={() => handleToggleExpand(news.id)}
                className={`flex gap-4 py-5 px-3 transition-all cursor-pointer items-center justify-between ${
                  expandedId === news.id ? "bg-white/[0.07]" : "hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded font-bold uppercase">
                      {news.category}
                    </span>
                    {!isLoggedIn && <Lock className="w-3 h-3 text-slate-500" />}
                  </div>
                  <h3 className={`text-[15px] font-semibold leading-[1.5] mb-2 transition-colors ${
                    expandedId === news.id ? "text-blue-400" : "text-slate-200"
                  } ${expandedId !== news.id ? "line-clamp-2" : ""}`}>
                    {getText(news.title)}
                  </h3>
                  
                  <div className="text-[11px] text-slate-500 flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      {/* 언론사 Favicon */}
                      <img src={faviconUrl} alt="" className="w-3.5 h-3.5 rounded-full" />
                      <span className="text-blue-400 font-medium">{news.author}</span>
                      <span>•</span>
                      <span>{formatDate(news.publishedAt)}</span>
                    </div>

                    {/* 아이콘 버튼 그룹 (북마크 / 좋아요 / 펼침) */}
                    <div className="flex items-center gap-3">
                      <button onClick={(e) => handleToggleBookmark(e, news.id)} className="hover:text-amber-400">
                        <Bookmark className={`w-3.5 h-3.5 ${bookmarks[news.id] ? "fill-amber-400 text-amber-400" : "text-slate-500"}`} />
                      </button>
                      <button onClick={(e) => handleToggleLike(e, news.id)} className="hover:text-rose-500">
                        <Heart className={`w-3.5 h-3.5 ${likes[news.id] ? "fill-rose-500 text-rose-500" : "text-slate-500"}`} />
                      </button>
                      {expandedId === news.id ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                    </div>
                  </div>
                </div>
                
                {/* 썸네일 영역 (이미지가 없거나 오류 발생 시 Favicon Fallback) */}
                {expandedId !== news.id && (
                  <div className="w-[70px] h-[70px] rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 relative flex items-center justify-center">
                    {hasValidImage ? (
                      <img 
                        src={news.imageUrl} 
                        alt="" 
                        onError={() => handleImageError(news.id)}
                        className="w-full h-full object-cover block" 
                      />
                    ) : (
                      <img src={faviconUrl} alt="" className="w-8 h-8 opacity-60" />
                    )}
                  </div>
                )}
              </article>

              {/* 요약본 및 상세 펼침 영역 */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                expandedId === news.id && isLoggedIn ? 'max-h-[5000px] opacity-100 border-t border-white/[0.05]' : 'max-h-0 opacity-0'
              }`}>
                <div className="p-5 bg-white/[0.02]">
                  {hasValidImage && (
                    <div className="w-full h-48 rounded-xl overflow-hidden mb-5 bg-slate-800">
                      <img 
                        src={news.imageUrl} 
                        alt="" 
                        onError={() => handleImageError(news.id)}
                        className="w-full h-full object-cover block" 
                      />
                    </div>
                  )}

                  <div className="text-slate-300 text-[14px] leading-[1.8] whitespace-pre-wrap break-words">
                    {getText(news.content)}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/[0.05] flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => handleExternalClick(e, news.sourceUrl)}
                        className="text-[13px] text-blue-400 flex items-center gap-1.5 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> 
                        <span>원문 출처 이동</span>
                      </button>

                      <button 
                        onClick={(e) => handleShare(e, news)}
                        className="text-[13px] text-slate-400 flex items-center gap-1.5 hover:text-slate-200 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" /> 
                        <span>공유</span>
                      </button>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(null);
                      }}
                      className="text-[12px] text-slate-500 hover:text-slate-300"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
