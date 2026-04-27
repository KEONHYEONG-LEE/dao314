"use client";

import { useState, useEffect } from "react";
import { Star, Heart, BookOpen } from "lucide-react";

export default function NewsCard({ title, date, source, imageUrl, url }: any) {
  const [translatedTitle, setTranslatedTitle] = useState(title);

  // 번역 로직 (데이터 구조 변경에 맞춰 단순화)
  useEffect(() => {
    const handleTranslation = async () => {
      const targetLang = localStorage.getItem("gpnr-language");
      if (targetLang === "ko" && title) {
        try {
          const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(title)}`);
          const data = await res.json();
          setTranslatedTitle(data[0][0][0]);
        } catch (e) { setTranslatedTitle(title); }
      } else { setTranslatedTitle(title); }
    };
    handleTranslation();
  }, [title]);

  const handleCardClick = () => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex gap-4 p-4 mb-2 rounded-2xl bg-[#1e263e]/60 border border-white/[0.05] hover:bg-[#2a3454] transition-all cursor-pointer group"
    >
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="text-[15px] font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
            {translatedTitle}
          </h3>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-blue-400 font-bold uppercase">{source}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">{date}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3 px-2 py-1 bg-black/20 rounded-lg w-fit">
          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
          <Star className="w-3.5 h-3.5 text-slate-500" />
          <Heart className="w-3.5 h-3.5 text-slate-500" />
        </div>
      </div>

      {/* 우측 이미지 영역 (imageUrl 사용) */}
      {imageUrl && (
        <div className="w-[80px] h-[80px] flex-shrink-0 relative overflow-hidden rounded-xl border border-white/[0.1]">
          <img src={imageUrl} alt="news" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        </div>
      )}
    </div>
  );
}
