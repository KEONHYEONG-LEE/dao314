import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'ko';
  const category = searchParams.get('category') || 'all';

  // 테스트를 위한 확실한 데이터셋
  const allNews = [
    {
      id: "1",
      category: "Mainnet",
      title: lang === 'ko' ? "파이 네트워크 메인넷 마이그레이션 현황" : "Pi Network Mainnet Migration Status",
      description: lang === 'ko' ? "전 세계 노드 동기화가 성공적으로 완료되었습니다." : "Latest node sync completed successfully across global servers.",
      content: "여기에 상세한 기사 본문 내용이 들어갑니다. 메인넷 전환을 위한 최종 단계가 진행 중입니다.",
      author: "GPNR Reporter",
      date: "2026-04-11",
      // Unsplash 이미지를 사용하여 깨지지 않게 설정
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
      url: "https://minepi.com"
    }
  ];

  const filteredNews = category === 'all' 
    ? allNews 
    : allNews.filter(item => item.category.toLowerCase() === category.toLowerCase());

  return NextResponse.json(filteredNews);
}
