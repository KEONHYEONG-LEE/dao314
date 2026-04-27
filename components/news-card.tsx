"use client";

import { useState, useEffect } from "react";
import { Star, Heart, BookOpen, ExternalLink } from "lucide-react";

export default function NewsCard({ title, date, source, imageUrl, url }: any) {
  const [translatedTitle, setTranslatedTitle] = useState(title);

  // 날짜 포맷팅: 2026-04-27T10:00:00Z -> 2026.04.27 형식으로 변환
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Just Now";
    try {
      const d = new Date(dateStr);
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
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
      className="flex gap-4 p-4 mb-3 rounded-2xl bg-[#1e263e]/60 border border-white/[0.05] hover:bg-[#2a3454] active:scale-[0.98] transition-all cursor-pointer group shadow-lg"
    >
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="text-[15px] font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
            {translatedTitle}
          </h3>
          
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-blue-400 font-extrabold uppercase tracking-wider">
              {source || "GPNR"}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">{formatDate(date)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 px-3 py-1.5 bg-black/30 rounded-lg w-fit border border-white/5">
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <Star className="w-3.5 h-3.5 text-slate-400" />
          <Heart className="w-3.5 h-3.5 text-slate-400" />
          {url && <ExternalLink className="w-3 h-3 text-blue-500/80 ml-1" />}
        </div>
      </div>

      {imageUrl ? (
        <div className="w-[85px] h-[85px] flex-shrink-0 relative overflow-hidden rounded-xl border border-white/[0.1]">
          <img 
            src={imageUrl} 
            alt="news" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
          />
        </div>
      ) : (
        <div className="w-[85px] h-[85px] flex-shrink-0 bg-slate-800/40 rounded-xl border border-dashed border-white/10 flex items-center justify-center">
          <span className="text-[10px] text-slate-600">No Image</span>
        </div>
      )}
    </div>
  );
}
