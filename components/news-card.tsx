"use client"; 

import { useState, useEffect } from "react";
import { 
  Share2, Heart, EyeOff, Bookmark, ChevronDown, 
  Users, Youtube, Sparkles, X, ExternalLink, Calendar 
} from "lucide-react"; 

const cn = (...classes: any[]) => classes.filter(Boolean).join(" "); 

export default function NewsCard({ category, title, content, date, source, image, url }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [translatedTitle, setTranslatedTitle] = useState(title);
  const [translatedContent, setTranslatedContent] = useState(content);
  const [isTranslating, setIsTranslating] = useState(false);

  // HTML 태그 제거 함수
  const stripHtml = (html: string) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>?/gm, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .trim();
  };

  // 자동 번역 로직
  useEffect(() => {
    const handleTranslation = async () => {
      const targetLang = localStorage.getItem("gpnr-language");
      
      // 한국어가 선택되었을 때만 번역 실행
      if (targetLang === "ko") {
        setIsTranslating(true);
        try {
          const cleanText = stripHtml(content);
          // 구글 번역 API를 우회 호출하는 무료 endpoint 예시 (기능 확인용)
          const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(title)}`);
          const data = await res.json();
          setTranslatedTitle(data[0][0][0]);

          const resContent = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(cleanText.substring(0, 1000))}`); // 1000자 제한
          const dataContent = await resContent.json();
          setTranslatedContent(dataContent[0].map((x: any) => x[0]).join(""));
        } catch (error) {
          console.error("Translation failed", error);
        } finally {
          setIsTranslating(false);
        }
      } else {
        // 영어일 때는 원래 텍스트로 복구
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
      {/* 뉴스 카드 목록 영역 */}
      <div onClick={() => setIsOpen(true)} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 cursor-pointer hover:shadow-md transition-shadow">
        <div className="p-4 border-b border-gray-50 flex justify-between">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 uppercase">
            {category || 'Mainnet'}
          </span>
          {isTranslating && <span className="text-[10px] text-gray-400 animate-pulse">Translating...</span>}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2 leading-tight">{translatedTitle}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{stripHtml(translatedContent)}</p>
        </div>
      </div> 

      {/* 뉴스 상세 모달 */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-end sm:items-center justify-center backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-3xl max-h-[95vh] overflow-y-auto relative">
            <div className="sticky top-0 right-0 p-4 flex justify-end z-10">
              <button onClick={() => setIsOpen(false)} className="p-2 bg-white/80 backdrop-blur shadow-md rounded-full">
                <X className="w-5 h-5 text-gray-800" />
              </button>
            </div>

            <div className="px-6 pb-10">
              {displayImage ? (
                <img 
                  src={displayImage} 
                  alt="news" 
                  className="w-full h-56 object-cover rounded-2xl mb-6 shadow-sm"
                  onError={(e: any) => e.target.style.display = 'none'} 
                />
              ) : (
                <div className="w-full h-1 bg-gray-50 mb-4" />
              )}
              
              <h2 className="text-2xl font-bold mb-4 leading-tight">{translatedTitle}</h2>
              
              <div className="text-gray-700 leading-relaxed mb-8 text-[16px] break-words whitespace-pre-wrap">
                {isTranslating ? "번역 중입니다..." : stripHtml(translatedContent)}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button 
                  onClick={() => window.open(url, '_blank')}
                  className="flex items-center justify-center gap-2 bg-gray-100 py-4 rounded-xl font-bold text-gray-700 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Original Source
                </button>
                <button className="flex items-center justify-center gap-2 bg-slate-900 py-4 rounded-xl font-bold text-white text-sm">
                  <Share2 className="w-4 h-4" />
                  Share News
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
