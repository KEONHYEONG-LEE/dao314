"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, Zap, Database } from "lucide-react";

// 18개 카테고리로 확장하기 위한 데이터 구조 샘플 (GPNR 테마)
const categories = [
  {
    name: "MAINNET",
    icon: <Zap className="w-4 h-4 text-yellow-500" />,
    articles: [
      {
        id: "m1",
        title: "Pi Network 메인넷 전환 가속화: 노드 활성도 역대 최고치 기록",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop",
        date: "오늘",
      },
      {
        id: "m2",
        title: "프로토콜 22 업데이트 요약 및 보안 강화 안내",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?w=400&h=300&fit=crop",
        date: "어제",
      },
    ],
  },
  {
    name: "ECOSYSTEM",
    icon: <Globe className="w-4 h-4 text-blue-500" />,
    articles: [
      {
        id: "e1",
        title: "글로벌 상거래 앱 통합: 파이 코인 결제 매장 20% 증가",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
        date: "오늘",
      },
      {
        id: "e2",
        title: "신규 dApp 경진대회 우승작 발표",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
        date: "어제",
      },
    ],
  },
  {
    name: "NODE",
    icon: <Database className="w-4 h-4 text-purple-500" />,
    articles: [
      {
        id: "n1",
        title: "노드 설정 최적화 가이드: 동기화 속도 2배 높이는 법",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?w=400&h=300&fit=crop",
        date: "오늘",
      },
      {
        id: "n2",
        title: "포트 개방 및 방화벽 설정 오류 해결 방법",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop",
        date: "어제",
      },
    ],
  },
];

export function CategoryNews() {
  return (
    <section className="py-8 px-4 bg-[#0f172a]"> {/* 다크 배경색 적용 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {categories.map((category) => (
          <div key={category.name} className="flex flex-col">
            {/* 섹션 헤더 */}
            <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                {category.icon}
                <h2 className="text-sm font-black text-slate-100 tracking-widest uppercase">
                  {category.name}
                </h2>
              </div>
              <Link
                href={`/category/${category.name.toLowerCase()}`}
                className="flex items-center gap-1 text-[11px] font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase"
              >
                더보기
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* 뉴스 리스트 */}
            <div className="space-y-6">
              {category.articles.map((article, index) => (
                <Link key={article.id} href={`/news/${article.id}`} className="group block">
                  <article className="flex gap-4 items-start">
                    {/* 이미지 영역 */}
                    <div className="relative w-24 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-slate-800 shadow-lg">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* 텍스트 영역 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-semibold text-slate-200 leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {article.date}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span className="text-[10px] font-bold text-blue-600 uppercase italic">
                          GPNR Official
                        </span>
                      </div>
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
