import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'ko';
  const category = searchParams.get('category') || 'all';

  // 17개 전체 카테고리 정의
  const categories = [
    'mainnet', 'commerce', 'social', 'education', 'health', 'travel', 
    'utilities', 'career', 'entertainment', 'games', 'finance', 
    'music', 'sports', 'defi', 'dapp', 'nft'
  ];

  // [엔진] 뉴스 데이터 자동 생성기 (매 시간 새로운 소식을 흉내냅니다)
  const generateNewsData = (cat: string, count: number) => {
    return Array.from({ length: count }).map((_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - i); // 시간별로 업데이트된 것처럼 보이게 함
      
      return {
        id: `news-${cat}-${date.getTime()}-${i}`,
        category: cat.charAt(0).toUpperCase() + cat.slice(1),
        title: lang === 'ko' 
          ? `[GPNR 독점] ${cat.toUpperCase()} 분야 Pi Network 실시간 리포트 #${i + 1}`
          : `[GPNR Exclusive] Real-time Pi Network Report on ${cat.toUpperCase()} #${i + 1}`,
        description: lang === 'ko'
          ? `${cat} 카테고리의 새로운 Pi 생태계 변화가 감지되었습니다. 글로벌 파이오니어들의 활동이 급증하고 있습니다.`
          : `New Pi ecosystem shifts detected in ${cat}. Activity among global Pioneers is surging.`,
        content: `본 기사는 GPNR의 AI 분석 엔진이 매 시간 수집하는 글로벌 데이터를 바탕으로 작성되었습니다. ${cat} 분야의 Pi 결제, 노드 상태, 그리고 커뮤니티 반응을 종합했을 때, 현재 생태계는 매우 긍정적인 신호를 보이고 있습니다...`,
        author: "GPNR AI Journalist",
        date: date.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US'),
        // 카테고리별로 랜덤 이미지를 배정하여 시각적 다양성 확보
        image: `https://picsum.photos/seed/${cat}${i}/800/600`,
        url: "https://minepi.com"
      };
    });
  };

  // 모든 카테고리에 대해 각각 10개씩 뉴스 생성 (총 160~170개)
  let allNews: any[] = [];
  categories.forEach(cat => {
    allNews = [...allNews, ...generateNewsData(cat, 10)];
  });

  // 카테고리 필터링 로직
  const filteredNews = category === 'all' 
    ? allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // 최신순 정렬
    : allNews.filter(item => item.category.toLowerCase() === category.toLowerCase());

  // 최종 뉴스 데이터 반환
  return NextResponse.json(filteredNews);
}
