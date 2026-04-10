import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'ko';
  const category = searchParams.get('category') || 'all';

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
    }
  ];

  const filteredNews = category === 'all' ? allNews : allNews.filter(item => item.category === category);
  return NextResponse.json(filteredNews);
}
