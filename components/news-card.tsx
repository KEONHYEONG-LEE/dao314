"use client";

import { useState, useEffect } from "react";
import { Star, Heart, Check, ExternalLink } from "lucide-react"; // BookOpen 대신 Check(V) 아이콘 사용

export default function NewsCard({ title, date, source, imageUrl, url }: any) {
  const [translatedTitle, setTranslatedTitle] = useState(title);

  // 날짜 포맷팅: 두 번째 이미지 스타일 (Sat, 25 Apr 2026...)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toUTCString().replace("GMT", "GMT"); // 이미지와 유사한 포맷
    } catch (e) {
      return dateStr;
    }
  };

  useEffect(() => {
    const handleTranslation = async () => {
      const targetLang = localStorage.getItem("gpnr-language");
      if (targetLang === "ko" && title) {
        try {
          const res = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(title)}`
          );
          const data = await res.json();
          if (data && data[0] && data[0][0]) {
            setTranslatedTitle(data[0][0][0]);
          }
        } catch (e) {
          setTranslatedTitle(title);
        }
      } else {
        setTranslatedTitle(title);
      }
    };
    handleTranslation();
  }, [title]);

  const handleCardClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      // 수정 포인트: 배경색 제거(bg-transparent), 그림자 제거, 하단 구분선 추가(border-b)
      className="flex gap-4 py-5 px-1 border-b border-white/[0.1] hover:bg-white/[0.03] transition-all cursor-pointer group"
    >
      <div className="flex-1 flex flex-col min-w-0">
        {/* 상단: 아이콘 + 제목 */}
        <div className="flex items-start gap-1 mb-1">
          <span className="text-yellow-500 text-xs mt-1">⭐❤️</span>
          <h3 className="text-[16px] font-medium text-slate-200 leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
            {translatedTitle}
          </h3>
        </div>
        
        {/* 중단: 출처 및 날짜 */}
        <div className="flex items-center gap-2 text-[12px] mb-3">
          <span className="text-blue-500 font-bold">
            {source || "GPNR"}
          </span>
          <span className="text-slate-500">{formatDate(date)}</span>
        </div>

        {/* 하단: 액션 아이콘들 (두 번째 이미지처럼 심플하게) */}
        <div className="flex items-center gap-5 mt-auto">
          <Check className="w-5 h-5 text-slate-500 hover:text-blue-400" />
          <Star className="w-5 h-5 text-yellow-600/80 hover:text-yellow-500" />
          <Heart className="w-5 h-5 text-red-600/80 hover:text-red-500" />
        </div>
      </div>

      {/* 오른쪽 이미지 영역 */}
      {imageUrl && (
        <div className="w-[90px] h-[90px] flex-shrink-0 relative overflow-hidden rounded-xl">
          <img 
            src={imageUrl} 
            alt="news" 
            className="w-full h-full object-cover" 
          />
        </div>
      )}
    </div>
  );
}
