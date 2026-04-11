import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'ko';
  const category = searchParams.get('category') || 'all';

  // 실제 운영 시에는 여기서 외부 뉴스 RSS나 API를 호출하여 데이터를 갱신합니다.
  const allNews = [
    {
      id: "pi-mainnet-001",
      category: "Mainnet",
      title: lang === 'ko' ? "파이 네트워크 메인넷 마이그레이션 가속화" : "Pi Network Mainnet Migration Accelerating",
      description: lang === 'ko' ? "전 세계 노드 동기화와 지갑 마이그레이션이 새로운 국면에 접어들었습니다." : "Global node sync and wallet migrations have reached a new milestone.",
      content: "파이 코어 팀은 최근 메인넷 전환을 위한 인프라 최적화를 완료했습니다. 현재 수백만 명의 파이오니어가 마이그레이션을 대기 중이며...",
      author: "GPNR Global News",
      date: "2026-04-11 23:00",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800",
      url: "https://minepi.com"
    },
    {
      id: "pi-commerce-001",
      category: "Commerce",
      title: lang === 'ko' ? "파이 상거래 결제 매장 급증" : "Pi Commerce Payments Surging Globally",
      description: lang === 'ko' ? "오프라인 매장에서의 파이 코인 결제 채택률이 지난달 대비 40% 증가했습니다." : "Adoption of Pi payments in physical stores increased by 40% since last month.",
      content: "전 세계 다양한 국가의 소매점에서 파이 코인을 결제 수단으로 수용하고 있습니다. 특히 유틸리티 기반의 생태계가 확장되면서...",
      author: "GPNR Reporter",
      date: "2026-04-11 22:30",
      image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=800",
      url: "https://minepi.com"
    }
    // 추가적인 뉴스 데이터들을 여기에 배치하거나 외부 API를 연결하세요.
  ];

  const filteredNews = category === 'all' 
    ? allNews 
    : allNews.filter(item => item.category.toLowerCase() === category.toLowerCase());

  return NextResponse.json(filteredNews);
}
