"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Monitor, TrendingUp, Wallet, Compass, Map, FileText, Users, ShoppingBag, Key, HelpCircle, Shield, Landmark } from "lucide-react";

// 17개 고유 카테고리별 아이콘 정의
const categoryIcons: { [key: string]: React.ReactNode } = {
  mainnet: <Zap className="w-4 h-4 text-yellow-500" />,
  node: <Monitor className="w-4 h-4 text-blue-500" />,
  mining: <TrendingUp className="w-4 h-4 text-emerald-500" />,
  wallet: <Wallet className="w-4 h-4 text-purple-500" />,
  browser: <Compass className="w-4 h-4 text-cyan-500" />,
  roadmap: <Map className="w-4 h-4 text-orange-500" />,
  whitepaper: <FileText className="w-4 h-4 text-gray-400" />,
  community: <Users className="w-4 h-4 text-indigo-400" />,
  commerce: <ShoppingBag className="w-4 h-4 text-pink-500" />,
  kyc: <Key className="w-4 h-4 text-teal-500" />,
  developer: <FileText className="w-4 h-4 text-blue-400" />,
  ecosystem: <HelpCircle className="w-4 h-4 text-lime-500" />,
  outlook: <TrendingUp className="w-4 h-4 text-violet-500" />,
  price: <Landmark className="w-4 h-4 text-amber-600" />,
  security: <Shield className="w-4 h-4 text-red-500" />,
  legal: <Landmark className="w-4 h-4 text-slate-400" />,
  all: <Compass className="w-4 h-4 text-slate-400" />
};

interface Article {
  id: string;
  title: string;
  url: string;
  source: string;
  date: string;
  category: string;
  content: string;
  imageUrl: string;
}

export function CategoryNews({ selectedCategory = "all" }: { selectedCategory?: string }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 구글 RSS 실시간 뉴스 데이터만 순수하게 페치
  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        const res = await fetch(`/api/fetch-news?category=${selectedCategory}`);
        if (res.ok) {
          const data = await res.json();
          setArticles(data);
        }
      } catch (err) {
        console.error("뉴스 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [selectedCategory]);

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-xs tracking-wide">최신 파이 생태계 뉴스를 불러오는 중...</div>;
  }

  return (
    <section className="py-2 px-1 bg-[#0f172a]">
      <div className="flex flex-col">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-2">
          <div className="flex items-center gap-2">
            {categoryIcons[selectedCategory.toLowerCase()] || categoryIcons["all"]}
            <h2 className="text-xs font-black text-slate-100 tracking-widest uppercase">
              {selectedCategory === "all" ? "REALTIME NEWSROOM" : selectedCategory}
            </h2>
          </div>
        </div>

        {/* 실시간 구글 뉴스 리스트 출력 */}
        <div className="flex flex-col">
          {articles.map((article) => (
            <a 
              key={article.id} 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block border-b border-white/[0.05] last:border-0"
            >
              <article className="flex gap-4 py-4 items-center">
                
                {/* 텍스트 컨텐츠 영역 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-semibold text-slate-200 leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-[12px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                    {article.content}
                  </p>
                  
                  {/* 하단 메타 정보 (출처 및 날짜) */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 whitespace-nowrap mt-3">
                    <span className="text-blue-500 font-bold">{article.source}</span>
                    <span>{new Date(article.date).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>

                {/* 우측 썸네일 이미지 영역 */}
                <div
