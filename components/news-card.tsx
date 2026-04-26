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
          // 제목 번역
          const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(title)}`);
          const data = await res.json();
          setTranslatedTitle(data[0][0][0]);

          // 본문 번역
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
      {/* 뉴스 리스트 아이템: 세 번째/네 번째 사진 스타일 */}
      <div
        onClick={() => setIsOpen(true)}
        className="flex gap-4 p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer group"
      >
        {/* 좌측 텍스트 영역 */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-slate-100 leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors mb-1">
              {translatedTitle}
            </h3>
            <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
              <span className="text-blue-500">{source || "GPNR News"}</span>
              <span>•</span>
              <span>{date || "Just now"}</span>
            </div>
          </div>
          
          {/* 아이콘 버튼 영역 */}
          <div className="flex gap-4 mt-3">
            <button className="text-slate-500 hover:text-white transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="text-slate-500 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            {isTranslating && <span className="text-[10px] text-blue-500 animate-pulse">번역 중...</span>}
          </div>
        </div>

        {/* 우측 이미지 영역 */}
        {displayImage && (
          <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
            <img
              src={displayImage}
              alt="news"
              className="w-full h-full object-cover rounded-xl border border-slate-800"
              onError={(e: any) => e.target.style.display = 'none'}
            />
          </div>
        )}
      </div>

      {/* 뉴스 상세 모달 (기존 기능 유지) */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-end sm:items-center justify-center backdrop-blur-md p-0 sm:p-4">
          <div className="bg-[#0f172a] w-full max-w-lg rounded-t-[2rem] sm:rounded-3xl max-h-[95vh] overflow-y-auto relative border-t sm:border border-slate-800 shadow-2xl">
            <div className="sticky top-0 right-0 p-4 flex justify-end z-10">
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="p-2 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-full hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="px-6 pb-10">
              {displayImage && (
                <img
                  src={displayImage}
                  alt="news"
                  className="w-full h-56 object-cover rounded-2xl mb-6 shadow-xl border border-slate-800"
                />
              )}
              
              <h2 className="text-2xl font-bold mb-6 leading-tight text-white tracking-tight">{translatedTitle}</h2>
              
              <div className="text-slate-300 leading-relaxed mb-8 text-[16px] break-words whitespace-pre-wrap font-medium">
                {isTranslating ? "번역 중입니다..." : stripHtml(translatedContent)}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => window.open(url, '_blank')}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-4 rounded-xl font-bold text-slate-200 text-sm transition-colors border border-slate-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  Source
                </button>
                <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white text-sm transition-colors shadow-lg">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
