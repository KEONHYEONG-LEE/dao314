"use client";

import { useState, useEffect } from "react";
import { Star, Heart, BookOpen, ExternalLink } from "lucide-react";

export default function NewsCard({ title, date, source, imageUrl, url }: any) {
  // 데이터가 없을 경우를 대비한 기본값 설정 (실속 방어 코드)
  const displaySource = source || "NEWS";
  const displayDate = date || "Just Now";
  const [translatedTitle, setTranslatedTitle] = useState(title);

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

  // 클릭 시 확실하게 새창으로 이동하게 하는 함수
  const handleCardClick = (e: React.MouseEvent) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.error("Link URL is missing for:", title);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex gap-4 p-4 mb-3 rounded-2xl bg-[#1e263e]/60 border border-white/[0.05] hover:bg-[#2a3454] active:scale-[0.98] transition-all cursor-pointer group shadow-lg"
    >
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* 제목 영역: 클릭감을 위해 hover 효과 강화 */}
          <h3 className="text-[15px] font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
            {translatedTitle}
          </h3>
          
          {/* 출처 및 시간: 데이터가 없어도 보이도록 수정 */}
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-blue-400 font-extrabold uppercase tracking-wider">
              {displaySource}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">{displayDate}</span>
          </div>
        </div>

        {/* 하단 아이콘 바 */}
        <div className="flex items-center gap-3 mt-3 px-3 py-1.5 bg-black/30 rounded-lg w-fit border border-white/5">
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <Star className="w-3.5 h-3.5 text-slate-400" />
          <Heart className="w-3.5 h-3.5 text-slate-400" />
          {url && <ExternalLink className="w-3 h-3 text-blue-500/50 ml-1" />}
        </div>
      </div>

      {/* 우측 이미지: 이미지가 없을 때 레이아웃 무너짐 방지 */}
      {imageUrl ? (
        <div className="w-[85px] h-[85px] flex-shrink-0 relative overflow-hidden rounded-xl border border-white/[0.1] shadow-inner">
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
