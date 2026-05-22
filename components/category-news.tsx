"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Star, Heart, Check, ThumbsUp, Eye, Shield, Wallet, Landmark, Key, Users, ShoppingBag, FileText, Map, Compass, TrendingUp, Monitor, HelpCircle } from "lucide-react";

// 17개 고유 카테고리별 아이콘 및 원본 데이터 스키마 구성
const categories = [
  {
    name: "MAINNET",
    id: "mainnet",
    icon: <Zap className="w-4 h-4 text-yellow-500" />,
    articles: [
      { id: "m1", title: "Pi Network 메인넷 전환 가속화: 노드 활성도 역대 최고치 기록", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop", date: "2026.04.29", source: "GPNR Editor" },
      { id: "m2", title: "프로토콜 22 업데이트 요약 및 보안 강화 안내", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?w=400&h=300&fit=crop", date: "2026.04.28", source: "GPNR Official" },
    ],
  },
  {
    name: "NODE",
    id: "node",
    icon: <Monitor className="w-4 h-4 text-blue-500" />,
    articles: [
      { id: "n1", title: "글로벌 파이 노드 안정성 향상을 위한 최적화 가이드", image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=400&h=300&fit=crop", date: "2026.04.27", source: "GPNR Tech" }
    ]
  },
  {
    name: "MINING",
    id: "mining",
    icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
    articles: [
      { id: "mi1", title: "반감기 이후 기본 채굴률 변동 추이 분석 보고서", image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400&h=300&fit=crop", date: "2026.04.26", source: "GPNR Analytics" }
    ]
  },
  {
    name: "WALLET",
    id: "wallet",
    icon: <Wallet className="w-4 h-4 text-purple-500" />,
    articles: [
      { id: "w1", title: "파이 지갑 보안 설정 강화: 비밀구절 관리 주의사항", image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400&h=300&fit=crop", date: "2026.04.25", source: "GPNR Security" }
    ]
  },
  {
    name: "BROWSER",
    id: "browser",
    icon: <Compass className="w-4 h-4 text-cyan-500" />,
    articles: [
      { id: "b1", title: "Pi Browser 생태계 앱 연동 인터페이스 대규모 리뉴얼 예고", image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=300&fit=crop", date: "2026.04.24", source: "GPNR Dev" }
    ]
  },
  {
    name: "ROADMAP",
    id: "roadmap",
    icon: <Map className="w-4 h-4 text-orange-500" />,
    articles: [
      { id: "r1", title: "V2 로드맵 최종 단계 점검: 오픈메인넷 조건 충족 현황", image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop", date: "2026.04.23", source: "GPNR Center" }
    ]
  },
  {
    name: "WHITEPAPER",
    id: "whitepaper",
    icon: <FileText className="w-4 h-4 text-gray-400" />,
    articles: [
      { id: "wh1", title: "백서 개정안에 담긴 토큰 이코노미 핵심 메커니즘 해석", image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=300&fit=crop", date: "2026.04.22", source: "GPNR Editor" }
    ]
  },
  {
    name: "COMMUNITY",
    id: "community",
    icon: <Users className="w-4 h-4 text-indigo-400" />,
    articles: [
      { id: "c1", title: "글로벌 파이어니어 5500만 명 돌파 기념 커뮤니티 이벤트 개최", image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop", date: "2026.04.21", source: "GPNR News" }
    ]
  },
  {
    name: "COMMERCE",
    id: "commerce",
    icon: <ShoppingBag className="w-4 h-4 text-pink-500" />,
    articles: [
      { id: "co1", title: "온·오프라인 파이 결제 매장 확산 추세와 GCV 동향", image: "https://images.unsplash.com/photo-1472851294608-062f824d296e?w=400&h=300&fit=crop", date: "2026.04.20", source: "GPNR Biz" }
    ]
  },
  {
    name: "KYC",
    id: "kyc",
    icon: <Key className="w-4 h-4 text-teal-500" />,
    articles: [
      { id: "k1", title: "KYC 인증 지연 해소를 위한 AI 알고리즘 고도화 패치 완료", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop", date: "2026.04.19", source: "GPNR Tech" }
    ]
  },
  {
    name: "DEVELOPER",
    id: "developer",
    icon: <FileText className="w-4 h-4 text-blue-400" />,
    articles: [
      { id: "d1", title: "해커톤 우수 수상작들의 메인넷 API 마이그레이션 가이드", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop", date: "2026.04.18", source: "GPNR Dev" }
    ]
  },
  {
    name: "ECOSYSTEM",
    id: "ecosystem",
    icon: <HelpCircle className="w-4 h-4 text-lime-500" />,
    articles: [
      { id: "e1", title: "유틸리티 기반 대형 DApp 생태계 공식 온보딩 일정 공개", image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=300&fit=crop", date: "2026.04.17", source: "GPNR Official" }
    ]
  },
  {
    name: "OUTLOOK",
    id: "outlook",
    icon: <TrendingUp className="w-4 h-4 text-violet-500" />,
    articles: [
      { id: "ou1", title: "2026년 하반기 가상자산 시장 규제 변화와 파이의 전망", image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=300&fit=crop", date: "2026.04.16", source: "GPNR Economy" }
    ]
  },
  {
    name: "PRICE",
    id: "price",
    icon: <Landmark className="w-4 h-4 text-amber-600" />,
    articles: [
      { id: "p1", title: "각국 커뮤니티별 GCV 합의 가격대 모니터링 분석", image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400&h=300&fit=crop", date: "2026.04.15", source: "GPNR Market" }
    ]
  },
  {
    name: "SECURITY",
    id: "security",
    icon: <Shield className="w-4 h-4 text-red-500" />,
    articles: [
      { id: "s1", title: "피싱 사이트 및 가짜 파이 코인 거래소 사기 근절 방지 대책", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop", date: "2026.04.14", source: "GPNR Security" }
    ]
  },
  {
    name: "LEGAL",
    id: "legal",
    icon: <Landmark className="w-4 h-4 text-slate-400" />,
    articles: [
      { id: "l1", title: "미국 SEC 가상자산 프레임워크 변경이 웹3 생태계에 미치는 영향", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop", date: "2026.04.13", source: "GPNR Legal" }
    ]
  }
];

export function CategoryNews({ selectedCategory = "all" }: { selectedCategory?: string }) {
  // 투표 상태 관리
  const [votes, setVotes] = useState<{ [key: string]: 'up' | 'watch' | null }>({});
  
  // 초기 투표 카운트 초기화 상태
  const [counts, setCounts] = useState<{ [key: string]: { up: number; watch: number } }>({
    m1: { up: 142, watch: 12 },
    m2: { up: 85, watch: 5 },
    n1: { up: 64, watch: 3 },
    mi1: { up: 95, watch: 8 },
    w1: { up: 112, watch: 14 },
    b1: { up: 53, watch: 4 },
    r1: { up: 245, watch: 19 },
    wh1: { up: 76, watch: 2 },
    c1: { up: 320, watch: 25 },
    co1: { up: 189, watch: 11 },
    k1: { up: 210, watch: 34 },
    d1: { up: 88, watch: 6 },
    e1: { up: 145, watch: 9 },
    ou1: { up: 176, watch: 15 },
    p1: { up: 430, watch: 52 },
    s1: { up: 98, watch: 1 },
    l1: { up: 72, watch: 8 }
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
    e.preventDefault(); 
    e.stopPropagation();

    const currentVote = votes[articleId];
    let newVote: 'up' | 'watch' | null = type;

    if (currentVote === type) {
      newVote = null;
    }

    const updatedVotes = { ...votes, [articleId]: newVote };
    setVotes(updatedVotes);
    localStorage.setItem("gpnr_news_votes", JSON.stringify(updatedVotes));

    setCounts((prev) => {
      const articleCount = prev[articleId] || { up: 10, watch: 2 };
      let upDiff = 0;
      let watchDiff = 0;

      if (currentVote === type) {
        if (type === 'up') upDiff = -1;
        if (type === 'watch') watchDiff = -1;
      } else {
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

  // [핵심 로직] 상단 탭 선택 상태에 맞춰 카테고리 필터링
  const filteredCategories = selectedCategory === "all"
    ? categories
    : categories.filter(cat => cat.id === selectedCategory);

  return (
    <section className="py-2 px-1 bg-[#0f172a]">
      <div className="grid grid-cols-1 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.name} className="flex flex-col">
            {/* 섹션 헤더 */}
            <div className="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-2">
              <div className="flex items-center gap-2">
                {category.icon}
                <h2 className="text-xs font-black text-slate-100 tracking-widest uppercase">
                  {category.name}
                </h2>
              </div>
            </div>

            {/* 뉴스 리스트 */}
            <div className="flex flex-col">
              {category.articles.map((article) => {
                const userVote = votes[article.id];
                const articleCount = counts[article.id] || { up: 0, watch: 0 };

                return (
                  <Link key={article.id} href={`/news/${article.id}`} className="group block border-b border-white/[0.05] last:border-0">
                    <article className="flex gap-4 py-4 items-center">
                      
                      {/* 텍스트 영역 (좌측 배치) */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[14px] font-semibold text-slate-200 leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
                          {article.title}
                        </h3>
                        
                        {/* 하단 정보 및 한 줄 투표 기능 */}
                        <div className="flex items-center justify-between gap-2 mt-3">
                          {/* 출처 & 날짜 */}
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 whitespace-nowrap">
                            <span className="text-blue-500 font-bold">{article.source}</span>
                            <span>{article.date}</span>
                          </div>
                          
                          {/* 뉴스별 한 줄 투표 버튼 탭 */}
                          <div className="flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-full border border-white/[0.05]">
                            {/* 기대돼요 버튼 */}
                            <button
                              onClick={(e) => handleVote(e, article.id, 'up')}
                              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all duration-200 ${
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
                              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all duration-200 ${
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

                      {/* 이미지 영역 (우측 축소 배치) */}
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-white/[0.05]">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
