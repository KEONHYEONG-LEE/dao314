"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, Zap, Database, Star, Heart, Check } from "lucide-react";

const categories = [
  // ... (데이터 구조는 기존과 동일하게 유지)
  {
    name: "MAINNET",
    icon: <Zap className="w-4 h-4 text-yellow-500" />,
    articles: [
      {
        id: "m1",
        title: "Pi Network 메인넷 전환 가속화: 노드 활성도 역대 최고치 기록",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop",
        date: "2026.04.29",
        source: "GPNR Editor"
      },
      {
        id: "m2",
        title: "프로토콜 22 업데이트 요약 및 보안 강화 안내",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?w=400&h=300&fit=crop",
        date: "2026.04.28",
        source: "GPNR Official"
      },
    ],
  },
  // ... 다른 카테고리 생략
];

export function CategoryNews() {
  return (
    <section className="py-6 px-4 bg-[#0f172a]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div key={category.name} className="flex flex-col">
            {/* 섹션 헤더 */}
            <div className="flex items-center justify-between mb-4 border-b border-white/[0.08] pb-2">
              <div className="flex items-center gap-2">
                {category.icon}
                <h2 className="text-xs font-black text-slate-100 tracking-widest uppercase">
                  {category.name}
                </h2>
              </div>
              <Link
                href={`/category/${category.name.toLowerCase()}`}
                className="flex items-center gap-1 text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase"
              >
                더보기
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* 뉴스 리스트 */}
            <div className="flex flex-col">
              {category.articles.map((article) => (
                <Link key={article.id} href={`/news/${article.id}`} className="group block border-b border-white/[0.05] last:border-0">
                  <article className="flex gap-4 py-4 items-center">
                    
                    {/* [수정 1] 텍스트 영역을 좌측으로 (flex-1) */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-semibold text-slate-200 leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
                        {article.title}
                      </h3>
                      
                      {/* [수정 4] 하단 한 줄 정보 (출처/날짜/아이콘) */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 whitespace-nowrap">
                          <span className="text-blue-500 font-bold">GPNR</span>
                          <span>{article.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-auto border-l border-white/[0.1] pl-2">
                          <Check className="w-3 h-3 text-slate-500" />
                          <Star className="w-3 h-3 text-slate-500" />
                          <Heart className="w-3 h-3 text-slate-500" />
                        </div>
                      </div>
                    </div>

                    {/* [수정 2] 이미지 영역을 우측으로 배치 및 사이즈 축소 (w-16 h-16) */}
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-white/[0.05]">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
