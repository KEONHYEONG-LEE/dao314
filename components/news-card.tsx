"use client"; 

import { useState, useEffect } from "react";
import { 
  Share2, X, ExternalLink
} from "lucide-react"; 

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
      {/* 뉴스 카드 목록 영역: 다크 테마 적용 */}
      <div 
        onClick={() => setIsOpen(true)} 
        className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-lg overflow-hidden mb-6 cursor-pointer hover:border-blue-500/50 transition-all group"
      >
        <div className="p-4 border-b border-slate-800/50 flex justify-between items-center">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 uppercase border border-blue-500/20">
            {category || 'Mainnet'}
          </span>
          {isTranslating && <span className="text-[10px] text-slate-500 animate-pulse">Translating...</span>}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2 leading-tight text-slate-100 group-hover:text-blue-400 transition-colors tracking-tight">
            {translatedTitle}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {stripHtml(translatedContent)}
          </p>
        </div>
      </div> 

      {/* 뉴스 상세 모달: 다크 테마 적용 */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-end sm:items-center justify-center backdrop-blur-md p-0 sm:p-4">
          <div className="bg-[#0f172a] w-full max-w-lg rounded-t-[2rem] sm:rounded-3xl max-h-[95vh] overflow-y-auto relative border-t sm:border border-slate-800">
            <div className="sticky top-0 right-0 p-4 flex justify-end z-10">
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-full hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="px-6 pb-10">
              {displayImage ? (
                <img 
                  src={displayImage} 
                  alt="news" 
                  className="w-full h-56 object-cover rounded-2xl mb-6 shadow-xl border border-slate-800"
                  onError={(e: any) => e.target.style.display = 'none'} 
                />
              ) : (
                <div className="w-full h-1 bg-slate-800 rounded-full mb-6" />
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
                <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white text-sm transition-colors shadow-lg shadow-blue-900/20">
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
