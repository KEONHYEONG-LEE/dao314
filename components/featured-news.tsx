"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, TrendingUp, Star, Heart, Check } from "lucide-react";

// 초기 데이터 (생략 - 기존과 동일)
const initialFeaturedArticle = { /* ... */ };
const initialSecondaryArticles = [ /* ... */ ];

export function FeaturedNews() {
  const [featured, setFeatured] = useState(initialFeaturedArticle);
  const [secondary, setSecondary] = useState(initialSecondaryArticles);
  const [isTranslating, setIsTranslating] = useState(false);

  // 번역 로직 (생략 - 기존과 동일)
  useEffect(() => { /* ... */ }, []);

  return (
    <section className="py-6 px-1">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-bold text-white tracking-tight uppercase">Featured</h2>
        </div>
        <Link href="/featured" className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-400 transition-colors">
          전체보기 <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* [메인 기사] 텍스트 가독성 강화 */}
        <Link href={`/news/${featured.id}`} className="lg:col-span-2 group">
          <article className="relative h-[300px] lg:h-full rounded-2xl overflow-hidden shadow-2xl border border-white/5">
            <Image src={featured.image} alt="Featured" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block px-2 py-0.5 mb-3 text-[10px] font-bold bg-orange-600 text-white rounded uppercase tracking-tighter">
                {featured.category}
              </span>
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-blue-300 transition-colors">
                {isTranslating ? "번역 중..." : featured.title}
              </h3>
              <div className="flex items-center gap-4 text-[11px] text-slate-300 font-medium">
                <span className="text-blue-400">GPNR Focus</span>
                <span>{featured.date}</span>
              </div>
            </div>
          </article>
        </Link>

        {/* [서브 기사들] 텍스트 좌측 / 이미지 우측 + 아이콘 바 */}
        <div className="flex flex-col">
          {secondary.map((article, idx) => (
            <Link key={article.id} href={`/news/${article.id}`} className={`group block ${idx !== 0 ? "mt-1" : ""}`}>
              <article className="flex gap-4 py-4 items-center border-b border-white/[0.05] group-last:border-0">
                {/* 1. 텍스트 영역 (좌측) */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-orange-500 font-bold mb-1 block uppercase tracking-wider">
                    {article.category}
                  </span>
                  <h4 className="text-[14px] font-semibold text-slate-200 leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
                    {isTranslating ? "..." : article.title}
                  </h4>
                  
                  {/* 하단 메타바 (출처/날짜/아이콘) */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="text-blue-400 font-bold">GPNR</span>
                      <span>{article.date.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-auto border-l border-white/[0.1] pl-2">
                      <Check className="w-3 h-3 text-slate-500" />
                      <Star className="w-3 h-3 text-slate-500" />
                      <Heart className="w-3 h-3 text-slate-500" />
                    </div>
                  </div>
                </div>

                {/* 2. 이미지 영역 (우측으로 이동 및 소형화) */}
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-white/5 bg-slate-800">
                  <Image src={article.image} alt="Thumbnail" fill className="object-cover transition-opacity group-hover:opacity-80" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
