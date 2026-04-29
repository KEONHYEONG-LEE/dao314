"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

const breakingNewsRaw = [
  "BREAKING: Pi Network announces official open mainnet transition schedule",
  "BREAKING: Global Climate Summit reaches agreement on Carbon Neutral 2040",
  "BREAKING: US Fed decides to cut interest rates by 0.25%p",
  "BREAKING: WHO raises alert level for new infectious disease",
];

export function BreakingNews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translatedNews, setTranslatedNews] = useState<string[]>(breakingNewsRaw);

  useEffect(() => {
    const handleTranslation = async () => {
      const targetLang = localStorage.getItem("gpnr-language");
      
      if (targetLang === "ko") {
        try {
          const translations = await Promise.all(
            breakingNewsRaw.map(async (text) => {
              const res = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(text)}`
              );
              const data = await res.json();
              return data[0][0][0];
            })
          );
          setTranslatedNews(translations);
        } catch (error) {
          console.error("Breaking news translation failed", error);
        }
      } else {
        setTranslatedNews(breakingNewsRaw);
      }
    };

    handleTranslation();
    window.addEventListener("languageChange", handleTranslation);
    return () => window.removeEventListener("languageChange", handleTranslation);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % translatedNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [translatedNews.length]);

  return (
    // [수정] 배경색을 더 세련된 다크 레드/다크 블루 톤으로 변경
    <div className="bg-red-950/20 border-y border-white/[0.05] backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-2.5">
        <div className="flex items-center gap-3">
          {/* 좌측 강조 뱃지 */}
          <div className="flex items-center gap-1.5 flex-shrink-0 bg-red-600 px-2 py-0.5 rounded">
            <AlertCircle className="h-3 w-3 text-white animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-tighter">
              LIVE
            </span>
          </div>
          
          {/* 속보 텍스트 영역 */}
          <div className="relative overflow-hidden flex-1">
            <p className="text-[13px] font-semibold text-slate-200 truncate transition-all duration-500">
              {translatedNews[currentIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
