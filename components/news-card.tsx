"use client";

import { useState, useEffect } from "react";
import { Bookmark, Heart, Star, BookOpen } from "lucide-react";

export default function NewsCard({ title, date, source, image, url }: any) {
  const [translatedTitle, setTranslatedTitle] = useState(title);
  const [isTranslating, setIsTranslating] = useState(false);

  // 1. 한국어 번역 로직 (기존 로직 유지)
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

  // 2. 클릭 시 이동 함수 (e.stopPropagation이 없는 버튼 제외하고 카드 전체 클릭 가능)
  const handleCardClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn("URL이 없습니다. 데이터를 확인해주세요.");
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex gap-4 p-4 mb-3 rounded-2xl bg-[#1e263e]/50 border border-white/[0.05] hover:bg-[#2a3454] transition-all cursor-pointer group active:scale-[0.98]"
    >
      {/* 좌측 텍스트 영역 */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* 제목: 6~7번 이미지처럼 굵고 깔끔하게 */}
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
        
        {/* 하단 아이콘 영역: 6~7번 이미지의 아이콘 느낌 재현 */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-3 px-3 py-1.5 bg-black/20 rounded-lg">
            <button 
              onClick={(e) => { e.stopPropagation(); /* 북마크 로직 */ }} 
              className="text-slate-400 hover:text-red-400 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); /* 별점 로직 */ }} 
              className="text-slate-400 hover:text-yellow-400 transition-colors"
            >
              <Star className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); /* 좋아요 로직 */ }} 
              className="text-slate-400 hover:text-pink-500 transition-colors"
            >
              <Heart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 우측 이미지 영역: 6~7번 이미지처럼 둥근 사각형 */}
      {image && (
        <div className="w-[80px] h-[80px] flex-shrink-0 relative overflow-hidden rounded-xl border border-white/[0.1]">
          <img
            src={image}
            alt="news"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}
    </div>
  );
}
