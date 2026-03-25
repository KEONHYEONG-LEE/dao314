"use client";

import { useState } from "react";
import { NewsCard, NewsItem } from "@/components/news-card";
import { SourceFilter } from "@/components/source-filter";

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "[CNN] Crypto Market & Pi Impact",
    summary: "글로벌 금융 시장에서 파이 네트워크의 잠재적 영향력을 분석합니다.",
    source: "CNN",
    sourceType: "official",
    category: "analysis",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d",
    timestamp: "방금 전",
    url: "#",
  },
];

export default function Home() {
  const [selectedSource, setSelectedSource] = useState("all");

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="bg-primary p-6 text-white text-center shadow-lg mb-6">
        <h1 className="text-3xl font-bold">GPNR Global News</h1>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-8">
        {/* ⭐ 이 코드가 들어가야 드디어 이번 주에 만든 필터가 화면에 나옵니다! */}
        <SourceFilter 
          selectedSource={selectedSource} 
          onSourceChange={setSelectedSource} 
        />

        <div className="grid gap-6">
          {mockNews
            .filter(news => selectedSource === "all" || news.sourceType === selectedSource)
            .map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
        </div>
      </div>
    </main>
  );
}
