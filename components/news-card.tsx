"use client";

import { useState, useEffect } from "react";
import { Bookmark, Heart } from "lucide-react";

export default function NewsCard({ title, content, date, source, image, url }: any) {
  const [translatedTitle, setTranslatedTitle] = useState(title);
  const [isTranslating, setIsTranslating] = useState(false);

  // 1. 한국어 번역 로직 유지
  useEffect(() => {
    const handleTranslation = async () => {
      const targetLang = localStorage.getItem("gpnr-language");
      if (targetLang === "ko") {
        setIsTranslating(true);
        try {
          const res = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(title)}`
          );
          const data = await res.json();
          setTranslatedTitle(data[0][0][0]);
        } catch (error) {
          console.error("Translation failed", error);
        } finally {
          setIsTranslating(false);
        }
      } else {
        setTranslatedTitle(title);
      }
    };

    handleTranslation();
    window.addEventListener("languageChange", handleTranslation);
    return () => window.removeEventListener("languageChange", handleTranslation);
  }, [title]);

  // 2. 클릭 시 원문으로 바로 이동하는 함수
  const handleCardClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex gap-4 p-4 border-b border-white/[0.03] hover:bg-slate-800/40 transition-all cursor-pointer group active:bg-slate-800/60"
    >
      {/* 좌측 텍스트 영역 */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* 번역된 제목 출력 및 클릭 효과 */}
          <h3 className="text-[14px] font-bold text-slate-100 leading-[1.4] line-clamp-2 group-hover:text-blue-400 transition-colors mb-2 tracking-tight">
            {translatedTitle}
          </h3>
          
          <div className="flex items-center gap-2 text-[11px] font-medium">
            <span className="text-blue-500 font-bold uppercase tracking-tighter">
              {source || "GPNR News"}
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-500 italic">{date}</span>
            {isTranslating && (
              <span className="ml-2 text-[10px] text-blue-500/80 animate-pulse font-bold tracking-tighter">
                TRANSLATING...
              </span>
            )}
          </div>
        </div>
        
        {/* 하단 버튼 영역 */}
        <div className="flex items-center gap-5 mt-3">
          <div className="flex gap-4">
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
        </div>
      </div>

      {/* 우측 이미지 영역 */}
      {image && (
        <div className="w-[85px] h-[85px] flex-shrink-0 relative overflow-hidden rounded-2xl border border-white/[0.05] shadow-lg">
          <img
            src={image}
            alt="news"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
    </div>
  );
}
