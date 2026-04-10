import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';

  // 3 & 5 & 6번 요구사항: 
  // 실제 서비스 시에는 여기서 외부 API(뉴스 크롤러)를 매시간 호출하거나 
  // DB에 저장된 최신 데이터를 카테고리별로 상위 10개만 가져옵니다.

  // 예시 데이터 구조 (최신순 정렬됨)
  const allNews = [
    { 
      id: 'n1', 
      title: '[Mainnet] 오픈 메인넷 전환 공식 가동', 
      description: '2026년 4월, 파이 네트워크가 공식적으로 오픈 메인넷 시대를 열었습니다...',
      category: 'Mainnet', 
      author: 'Official Pi', 
      date: '1시간 전',
      url: 'https://minepi.com/news1'
    },
    { 
      id: 'n2', 
      title: '[Commerce] 베트남 전통시장 파이 결제 도입', 
      description: '베트남 하노이 지역 상권을 중심으로 파이 결제가 일상화되고 있습니다...',
      category: 'Commerce', 
      author: 'Global News', 
      date: '2시간 전',
      url: 'https://pi-news.world/commerce-vn'
    },
    // ... 추가 뉴스 데이터 10개씩
  ];

  // 카테고리 필터링 로직
  const filteredNews = category === 'all' 
    ? allNews 
    : allNews.filter(n => n.category.toLowerCase() === category.toLowerCase());

  // 최상단 10개만 반환
  return NextResponse.json(filteredNews.slice(0, 10));
}
