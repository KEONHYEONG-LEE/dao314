"use client";

import { Bookmark, Heart } from "lucide-react";

export default function NewsCard({ title, date, source, image, url }: any) {
  
  // 클릭 시 바로 원문 이동 함수
  const handleLink = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleLink}
      className="flex gap-4 p-4 border-b border-white/[0.03] hover:bg-slate-800/40 transition-all cursor-pointer group active:bg-slate-800/60"
    >
      {/* 좌측 텍스트 영역 */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* 제목 클릭 시 강조 효과 */}
          <h3 className="text-[14px] font-bold text-slate-100 leading-[1.4] line-clamp-2 group-hover:text-blue-400 transition-colors mb-2 tracking-tight">
            {title}
          </h3>
          
          <div className="flex items-center gap-2 text-[11px] font-medium">
            <span className="text-blue-500 font-bold uppercase tracking-tighter">
              {source || "GPNR News"}
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-500 italic">{date}</span>
          </div>
        </div>
        
        {/* 아이콘 버튼 영역 */}
        <div className="flex items-center gap-5 mt-3">
          <div className="flex gap-4">
            <button onClick={(e) => e.stopPropagation()} className="text-slate-600 hover:text-white transition-colors">
              <Bookmark className="w-3.5 h-3.5" />
            </button>
            <button onClick={(e) => e.stopPropagation()} className="text-slate-600 hover:text-red-500 transition-colors">
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
