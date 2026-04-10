import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'ko';
  const category = searchParams.get('category') || 'all';

  // 뉴스 데이터를 카테고리별로 골고루 추가했습니다.
  const allNews = [
    {
      id: 1,
      category: 'mainnet',
      title: lang === 'ko' ? '[메인넷] 오픈 메인넷 전환 및 보안 업데이트 완료' : '[Mainnet] Open Mainnet Transition and Security Update Completed',
      description: lang === 'ko' ? '파이 네트워크가 오픈 메인넷 준비를 위한 최종 보안 노드 업데이트를 성공적으로 마쳤습니다.' : 'Pi Network has successfully completed the final security node update in preparation for the Open Mainnet.',
      author: 'Official Pi',
      date: '2026-04-10',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=400&h=200&auto=format&fit=crop',
      url: 'https://minepi.com/blog/'
    },
    {
      id: 2,
      category: 'commerce',
      title: lang === 'ko' ? '글로벌 파이 결제 매장 5만 개 돌파' : 'Global Pi Payment Merchants Exceed 50,000',
      description: lang === 'ko' ? '전 세계적으로 파이 코인을 결제 수단으로 인정하는 오프라인 매장이 급증하고 있습니다.' : 'Offline stores accepting Pi coin as a payment method are rapidly increasing worldwide.',
      author: 'Pi Commerce News',
      date: '2026-04-09',
      image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=400&h=200&auto=format&fit=crop',
      url: 'https://minepi.com/block-explorer/'
    },
    {
      id: 3,
      category: 'community',
      title: lang === 'ko' ? '[커뮤니티] 2026 파이 해커톤 우승작 발표' : '[Community] 2026 Pi Hackathon Winners Announced',
      description: lang === 'ko' ? '혁신적인 Web3 솔루션을 제시한 이번 해커톤의 우승팀들이 공개되었습니다.' : 'The winners of this year\'s hackathon, featuring innovative Web3 solutions, have been revealed.',
      author: 'Pi Network Dev',
      date: '2026-04-08',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=400&h=200&auto=format&fit=crop',
      url: 'https://minepi.com/news/'
    },
    {
      id: 4,
      category: 'social',
      title: lang === 'ko' ? '[소셜] 파이 챗(Pi Chat) 대규모 기능 개선' : '[Social] Major Enhancements to Pi Chat',
      description: lang === 'ko' ? '사용자 편의성을 높이기 위한 새로운 인터페이스와 보안 기능이 추가되었습니다.' : 'New interface and security features have been added to improve user convenience.',
      author: 'GPNR Social',
      date: '2026-04-07',
      image: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?q=80&w=400&h=200&auto=format&fit=crop',
      url: 'https://minepi.com/pi-chat/'
    }
  ];

  // 전체보기일 때는 모든 뉴스를, 특정 카테고리일 때는 해당 뉴스만 필터링합니다.
  const filteredNews = category === 'all' 
    ? allNews 
    : allNews.filter(item => item.category === category);

  return NextResponse.json(filteredNews);
}
