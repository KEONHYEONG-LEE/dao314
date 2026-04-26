"use client";

import { useState, useEffect } from "react";
import { Share2, X, ExternalLink, Bookmark, Heart } from "lucide-react";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export default function NewsCard({ category, title, content, date, source, image, url }: any) {
  // 모달을 사용하지 않으므로 isOpen 상태는 제거하거나 유지하되, 클릭 이벤트만 수정합니다.
  const [translatedTitle, setTranslatedTitle] = useState(title);
  const [translatedContent, setTranslatedContent] = useState(content);
  const [isTranslating, setIsTranslating] = useState(false);

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>?/gm, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .trim();
  };

  useEffect(() => {
    const handleTranslation = async () => {
      const targetLang = localStorage.getItem("gpnr-language");
      if (targetLang === "ko") {
        setIsTranslating(true);
        try {
          const cleanText = stripHtml(content);
          const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(title)}`);
          const data = await res.json();
          setTranslatedTitle(data[0][0][0]);

          const resContent = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(cleanText.substring(0, 1000))}`);
          const dataContent = await resContent.json();
          setTranslatedContent(dataContent[0].map((x: any) => x[0]).join(""));
        } catch (error) {
          console.error("Translation failed", error);
        } finally {
          setIsTranslating(false);
        }
      } else {
        setTranslatedTitle(title);
        setTranslatedContent(content);
      }
    };

    handleTranslation();
    window.addEventListener("languageChange", handleTranslation);
    return () => window.removeEventListener("languageChange", handleTranslation);
  }, [title, content]);

  const displayImage = image || (content?.match(/<img[^>]+src="([^">]+)"/) ? content.match(/<img[^>]+src="([^">]+)"/)[1] : null);

  // 클릭 시 원문으로 바로 이동하는 함수
  const handleCardClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn("이 뉴스에는 연결할 URL이 없습니다.");
    }
  };

  return (
    <>
      {/* 뉴스 리스트 아이템: 클릭 시 바로 url 이동으로 변경 */}
      <div
        onClick={handleCardClick}
        className="flex gap-4 p-4 border-b border-white/[0.03] hover:bg-slate-800/40 transition-all cursor-pointer group active:bg-slate-800/60"
      >
        {/* 좌측 텍스트 영역 */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* 제목 클릭 시 강조 효과 유지 */}
            <h3 className="text-[14px] font-bold text-slate-100 leading-[1.4] line-clamp-2 group-hover:text-blue-400 transition-colors mb-2 tracking-tight">
              {translatedTitle}
            </h3>
            
            <div className="flex items-center gap-2 text-[11px] font-medium">
              <span className="text-blue-500 font-bold uppercase tracking-tighter">
                {source || "GPNR News"}
              </span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-500 italic">
                {date || "Just now"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-5 mt-3">
             <div className="flex gap-4">
                {/* 북마크/하트 클릭 시 부모의 onClick(페이지 이동)이 발생하지 않도록 stopPropagation 추가 */}
                <button 
                  onClick={(e) => e.stopPropagation()} 
                  className="text-slate-600 hover:text-white transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={(e) => e.stopPropagation()} 
                  className="text-slate-600 hover:text-red-500 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5" />
                </button>
             </div>
            {isTranslating && (
              <span className="text-[10px] text-blue-500/80 animate-pulse font-bold tracking-tighter">
                TRANSLATING...
              </span>
            )}
          </div>
        </div>

        {/* 우측 이미지 영역 */}
        {displayImage && (
          <div className="w-[85px] h-[85px] flex-shrink-0 relative overflow-hidden rounded-2xl border border-white/[0.05] shadow-lg">
            <img
              src={displayImage}
              alt="news"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e: any) => e.target.style.display = 'none'}
            />
          </div>
        )}
      </div>
    </>
  );
}
