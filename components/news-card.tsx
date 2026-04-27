"use client";

import { useState, useEffect } from "react";
import { Star, Heart, BookOpen } from "lucide-react";

// props 타입을 NewsItem 구조에 맞게 수정 (imageUrl 사용)
export default function NewsCard({ title, date, source, imageUrl, url }: any) {
  const [translatedTitle, setTranslatedTitle] = useState(title);
  const [isTranslating, setIsTranslating] = useState(false);

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

  const handleCardClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex gap-4 p-4 mb-3 rounded-2xl bg-[#1e263e]/60 border border-white/[0.05] hover:bg-[#2a3454] transition-all cursor-pointer group active:scale-[0.98]"
    >
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="text-[15px] font-bold text-white leading-[1.5] line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
            {translatedTitle}
          </h3>
          
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-blue-400 font-bold uppercase tracking-tight">
              {source || "GPNR News"}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">{date}</span>
            {isTranslating && (
              <span className="ml-2 text-[10px] text-blue-500 animate-pulse font-bold">
                번역중...
              </span>
            )}
          </div>
        </div>
        
        {/* 아이콘 영역 (6~7번 이미지 스타일) */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-3 px-3 py-1.5 bg-black/30 rounded-lg">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <Star className="w-3.5 h-3.5 text-slate-400" />
            <Heart className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* 우측 이미지: imageUrl로 변경 */}
      {imageUrl && (
        <div className="w-[85px] h-[85px] flex-shrink-0 relative overflow-hidden rounded-xl border border-white/[0.1]">
          <img
            src={imageUrl}
            alt="news"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}
    </div>
  );
}
