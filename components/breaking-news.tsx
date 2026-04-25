"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

// 실제 운영 시에는 외부 API에서 영문 속보 리스트를 가져온다고 가정합니다.
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
    <div className="bg-destructive/10 border-y border-destructive/20">
      <div className="mx-auto max-w-7xl px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <AlertCircle className="h-4 w-4 text-destructive animate-pulse" />
            <span className="text-xs font-bold text-destructive uppercase tracking-wider">
              BREAKING
            </span>
          </div>
          <div className="relative overflow-hidden flex-1">
            <p className="text-sm font-medium truncate">
              {translatedNews[currentIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
