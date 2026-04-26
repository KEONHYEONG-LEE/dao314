"use client";

import { useState, useEffect } from "react";
import { Share2, X, ExternalLink, Bookmark, Heart } from "lucide-react";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export default function NewsCard({ category, title, content, date, source, image, url }: any) {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <>
      {/* 뉴스 리스트 아이템: 텍스트 사이즈 축소 및 레이아웃 최적화 */}
      <div
        onClick={() => setIsOpen(true)}
        className="flex gap-4 p-4 border-b border-white/[0.03] hover:bg-slate-800/40 transition-all cursor-pointer group active:bg-slate-800/60"
      >
        {/* 좌측 텍스트 영역 */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* 제목: 두 번째 사진처럼 14px로 축소하여 콤팩트하게 변경 */}
            <h3 className="text-[14px] font-bold text-slate-100 leading-[1.4] line-clamp-2 group-hover:text-blue-400 transition-colors mb-2 tracking-tight">
              {translatedTitle}
            </h3>
            
            {/* 출처 및 시간: 세 번째/네 번째 사진 스타일 */}
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
          
          {/* 아이콘 버튼 영역 */}
          <div className="flex items-center gap-5 mt-3">
             <div className="flex gap-4">
                <button className="text-slate-600 hover:text-white transition-colors">
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
                <button className="text-slate-600 hover:text-red-500 transition-colors">
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

        {/* 우측 이미지 영역: 둥근 모서리 강조 및 고정 크기 */}
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

      {/* 뉴스 상세 모달 (기존 디자인 강화) */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-end sm:items-center justify-center backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-[#0f172a] w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2rem] max-h-[92vh] overflow-y-auto relative border-t border-white/10 sm:border shadow-2xl shadow-black">
            {/* 모달 닫기 버튼 */}
            <div className="sticky top-0 right-0 p-5 flex justify-end z-20 pointer-events-none">
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="pointer-events-auto p-2.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full hover:bg-black/60 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="px-6 pb-12 -mt-10">
              {displayImage && (
                <div className="w-full h-60 overflow-hidden rounded-[1.5rem] mb-6 border border-white/5 shadow-2xl">
                  <img
                    src={displayImage}
                    alt="news"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 bg-blue-600/20 text-blue-400 text-[10px] font-black rounded-md uppercase tracking-wider">
                  {source || "GPNR"}
                </span>
                <span className="text-slate-500 text-[11px] font-medium">{date}</span>
              </div>

              <h2 className="text-[22px] font-black mb-6 leading-[1.3] text-white tracking-tighter">
                {translatedTitle}
              </h2>
              
              <div className="text-slate-400 leading-[1.6] mb-10 text-[15px] break-words whitespace-pre-wrap font-medium">
                {isTranslating ? "내용을 번역하고 있습니다..." : stripHtml(translatedContent)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => window.open(url, '_blank')}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-bold text-slate-200 text-[13px] transition-all active:scale-95 border border-white/5"
                >
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                  원문보기
                </button>
                <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold text-white text-[13px] transition-all active:scale-95 shadow-lg shadow-blue-600/20">
                  <Share2 className="w-4 h-4" />
                  공유하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
