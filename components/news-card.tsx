"use client";

import { useState, useEffect } from "react";
import { Star, Heart, Check } from "lucide-react";

export default function NewsCard({ title, date, source, imageUrl, url, category }: any) {
  const [translatedTitle, setTranslatedTitle] = useState(title);

  // 날짜 포맷팅: 간단하게 (2026.04.29) 형태로 출력하거나 원하는 포맷으로 변경 가능
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
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
      className="flex gap-4 py-4 px-2 border-b border-white/[0.08] hover:bg-white/[0.03] transition-all cursor-pointer group items-center"
    >
      {/* 1. 좌측 텍스트 영역 (flex-1로 넓게 차지) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 카테고리 표시 (그대로 유지) */}
        {category && (
          <span className="text-[11px] text-orange-500 font-bold mb-1 uppercase tracking-wider">
            {category}
          </span>
        )}
        
        {/* 제목: 2줄 제한으로 세련되게 */}
        <h3 className="text-[15px] font-semibold text-slate-200 leading-[1.4] mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {translatedTitle}
        </h3>
        
        {/* 하단 메타데이터 한 줄 구성 (출처/날짜/체크/별/하트) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 whitespace-nowrap">
            <span className="text-blue-400 font-medium">{source || "GPNR"}</span>
            <span>{formatDate(date)}</span>
          </div>
          
          <div className="flex items-center gap-3 ml-auto border-l border-white/[0.1] pl-3">
            <Check className="w-3.5 h-3.5 text-slate-500" />
            <Star className="w-3.5 h-3.5 text-slate-500" />
            <Heart className="w-3.5 h-3.5 text-slate-500"
