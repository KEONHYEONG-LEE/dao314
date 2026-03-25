"use client";

import { NewsCard, NewsItem } from "./news-card";
import { RefreshCw, TrendingUp } from "lucide-react";

// Mock news data
const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Pi Network 메인넷 Open Network 전환 공식 발표 - 2026년 상반기 예정",
    summary: "Pi Core Team이 오픈 네트워크로의 전환 일정을 공식 발표했습니다. 2026년 상반기 중 완전한 탈중앙화 네트워크로 전환될 예정입니다.",
    source: "Pi Network Official",
    sourceType: "official",
    category: "mainnet",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop",
    timestamp: "10분 전",
    url: "#",
    isBreaking: true,
    viewCount: 15420,
  },
  {
    id: "2",
    title: "바이낸스, Pi Network 상장 검토 중 - 내부 소식통",
    summary: "세계 최대 암호화폐 거래소 바이낸스가 Pi Network 상장을 내부적으로 검토하고 있다는 소식이 전해졌습니다.",
    source: "호알라TV",
    sourceType: "youtube",
    category: "exchange",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop",
    timestamp: "25분 전",
    url: "#",
    viewCount: 8932,
  },
  {
    id: "3",
    title: "KYC 인증률 90% 돌파 - 마이그레이션 가속화 전망",
    summary: "Pi Network의 글로벌 KYC 인증률이 90%를 돌파했습니다. 이에 따라 메인넷 마이그레이션이 더욱 가속화될 것으로 전망됩니다.",
    source: "Reuters",
    sourceType: "official",
    category: "kyc",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
    timestamp: "1시간 전",
    url: "#",
    viewCount: 6721,
  },
  {
    id: "4",
    title: "Pi Browser 대규모 업데이트 - 새로운 DApp 생태계 오픈",
    summary: "Pi Browser가 대규모 업데이트를 통해 100개 이상의 새로운 탈중앙화 앱을 지원하게 되었습니다.",
    source: "@PiCoreTeam",
    sourceType: "twitter",
    category: "ecosystem",
    image: "https://images.unsplash.com/photo-1618044619888-009e412ff12a?w=800&h=450&fit=crop",
    timestamp: "2시간 전",
    url: "#",
    viewCount: 5234,
  },
  {
    id: "5",
    title: "니콜라스 코코리스 CEO 인터뷰: '진정한 탈중앙화를 향해'",
    summary: "Pi Network 창립자 니콜라스 코코리스가 Forbes 인터뷰에서 프로젝트의 미래 비전을 공개했습니다.",
    source: "Bloomberg",
    sourceType: "official",
    category: "official",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=450&fit=crop",
    timestamp: "3시간 전",
    url: "#",
    viewCount: 12453,
  },
  {
    id: "6",
    title: "Pi Network 시세 분석: 기술적 관점에서 본 상승 가능성",
    summary: "암호화폐 전문 애널리스트들이 Pi Network의 기술적 분석을 통해 향후 가격 전망을 제시했습니다.",
    source: "코인투자",
    sourceType: "youtube",
    category: "analysis",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=450&fit=crop",
    timestamp: "4시간 전",
    url: "#",
    viewCount: 7891,
  },
  {
    id: "7",
    title: "삼성전자, Pi Network 결제 시스템 도입 검토",
    summary: "삼성전자가 삼성페이에 Pi Network 결제 시스템 도입을 내부적으로 검토하고 있다는 소식입니다.",
    source: "KBS",
    sourceType: "official",
    category: "partnership",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=450&fit=crop",
    timestamp: "5시간 전",
    url: "#",
    viewCount: 9876,
  },
  {
    id: "8",
    title: "Pi 채굴 보상률 변경 예고 - 이것만은 알아두세요",
    summary: "Pi Network가 향후 채굴 보상률 조정을 예고했습니다. 파이오니어들이 알아야 할 핵심 내용을 정리했습니다.",
    source: "Pi Korea",
    sourceType: "facebook",
    category: "mining",
    image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&h=450&fit=crop",
    timestamp: "6시간 전",
    url: "#",
    viewCount: 4532,
  },
];

interface NewsFeedProps {
  selectedCategory: string;
  selectedSource: string;
}

export function NewsFeed({ selectedCategory, selectedSource }: NewsFeedProps) {
  // Filter news based on selected category and source
  const filteredNews = mockNews.filter((news) => {
    const categoryMatch = selectedCategory === "all" || news.category === selectedCategory;
    const sourceMatch = selectedSource === "all" || news.sourceType === selectedSource;
    return categoryMatch && sourceMatch;
  });

  const featuredNews = filteredNews[0];
  const restNews = filteredNews.slice(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp className="w-5 h-5" />
            <h2 className="text-lg font-bold text-foreground">실시간 Pi 뉴스</h2>
          </div>
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
            {filteredNews.length}개의 뉴스
          </span>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg text-sm text-muted-foreground hover:bg-secondary/80 transition-colors">
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">새로고침</span>
        </button>
      </div>

      {/* Featured News */}
      {featuredNews && (
        <NewsCard news={featuredNews} variant="featured" />
      )}

      {/* News Grid */}
      {restNews.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {restNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-2xl border border-border">
          <p className="text-muted-foreground">
            선택한 필터에 해당하는 뉴스가 없습니다.
          </p>
        </div>
      )}

      {/* Load More */}
      {filteredNews.length > 0 && (
        <div className="flex justify-center pt-4">
          <button className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
            더 많은 뉴스 불러오기
          </button>
        </div>
      )}
    </div>
  );
}
