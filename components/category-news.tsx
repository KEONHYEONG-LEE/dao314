"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Star, Heart, Check, ThumbsUp, Eye } from "lucide-react";

const categories = [
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
  // 투표 상태 관리 (key: articleId, value: 'up' | 'watch' | null)
  const [votes, setVotes] = useState<{ [key: string]: 'up' | 'watch' | null }>({});
  
  // 가상의 투표수 카운트 (실제 서버 연동 전까지 유저 피드백용 애니메이션)
  const [counts, setCounts] = useState<{ [key: string]: { up: number; watch: number } }>({
    m1: { up: 142, watch: 12 },
    m2: { up: 85, watch: 5 },
  });

  // 컴포넌트 마운트 시 기존 투표 기록 불러오기
  useEffect(() => {
    const savedVotes = localStorage.getItem("gpnr_news_votes");
    if (savedVotes) {
      setVotes(JSON.parse(savedVotes));
    }
  }, []);

  // 투표 핸들러
  const handleVote = (e: React.MouseEvent, articleId: string, type: 'up' | 'watch') => {
    e.preventDefault(); // 중요: 링크 이동 막기
    e.stopPropagation();

    const currentVote = votes[articleId];
    let newVote: 'up' | 'watch' | null = type;

    // 이미 같은 걸 눌렀다면 취소 처리
    if (currentVote === type) {
      newVote = null;
    }

    const updatedVotes = { ...votes, [articleId]: newVote };
    setVotes(updatedVotes);
    localStorage.setItem("gpnr_news_votes", JSON.stringify(updatedVotes));

    // 화면단 투표수 실시간 가상 변경
    setCounts((prev) => {
      const articleCount = prev[articleId] || { up: 10, watch: 2 };
      let upDiff = 0;
      let watchDiff = 0;

      if (currentVote === type) {
        // 취소
        if (type === 'up') upDiff = -1;
        if (type === 'watch') watchDiff = -1;
      } else {
        // 새로 투표하거나 변경
        if (currentVote === 'up') upDiff = -1;
        if (currentVote === 'watch') watchDiff = -1;
        if (type === 'up') upDiff = 1;
        if (type === 'watch') watchDiff = 1;
      }

      return {
        ...prev,
        [articleId]: {
          up: Math.max(0, articleCount.up + upDiff),
          watch: Math.max(0, articleCount.watch + watchDiff),
        },
      };
    });
  };

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
              {category.articles.map((article) => {
                const userVote = votes[article.id];
                const articleCount = counts[article.id] || { up: 0, watch: 0 };

                return (
                  <Link key={article.id} href={`/news/${article.id}`} className="group block border-b border-white/[0.05] last:border-0">
                    <article className="flex gap-4 py-4 items-center">
                      
                      {/* 텍스트 영역 (좌측) */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[14px] font-semibold text-slate-200 leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
                          {article.title}
                        </h3>
                        
                        {/* 하단 정보 및 한 줄 투표 기능 */}
                        <div className="flex items-center justify-between gap-2 mt-3">
                          {/* 출처 & 날짜 */}
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 whitespace-nowrap">
                            <span className="text-blue-500 font-bold">GPNR</span>
                            <span>{article.date}</span>
                          </div>
                          
                          {/* [신규 추가] 3번 아이디어: 뉴스별 한 줄 투표 버튼 탭 */}
                          <div className="flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-full border border-white/[0.05]">
                            {/* 기대돼요 버튼 */}
                            <button
                              onClick={(e) => handleVote(e, article.id, 'up')}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-all duration-200 ${
                                userVote === 'up'
                                  ? 'bg-purple-600/30 text-purple-400 border border-purple-500/50 scale-105'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                              }`}
                              title="기대돼요"
                            >
                              <ThumbsUp className={`w-2.5 h-2.5 ${userVote === 'up' ? 'fill-purple-400' : ''}`} />
                              <span>{articleCount.up}</span>
                            </button>

                            {/* 지켜봐야 해요 버튼 */}
                            <button
                              onClick={(e) => handleVote(e, article.id, 'watch')}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-all duration-200 ${
                                userVote === 'watch'
                                  ? 'bg-amber-600/30 text-amber-400 border border-amber-500/50 scale-105'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                              }`}
                              title="지켜봐야 해요"
                            >
                              <Eye className="w-2.5 h-2.5" />
                              <span>{articleCount.watch}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 이미지 영역 (우측) */}
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
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
