import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // 프론트엔드(page.tsx)에서 보낸 카테고리와 언어 설정을 읽어옵니다.
  const category = searchParams.get('category') || 'all';
  const lang = searchParams.get('lang') || 'ko';

  try {
    /**
     * [GPNR 뉴스 데이터셋]
     * 나중에는 여기서 외부 뉴스(CNN, Pi News 등)를 긁어오게 되지만,
     * 지금은 앱의 모든 카테고리가 잘 작동하는지 확인하기 위한 '지능형 샘플'을 구성합니다.
     */
    const rawNewsData = [
      {
        id: 'n1',
        category: 'Mainnet',
        titles: {
          ko: '[메인넷] 오픈 메인넷 전환 및 보안 업데이트 완료',
          en: '[Mainnet] Transition to Open Mainnet & Security Update',
          zh: '[主网] 开放主网转换和安全更新完成',
          es: '[Mainnet] Transición a Mainnet abierta y actualización de seguridad',
          vi: '[Mainnet] Chuyển đổi sang Mainnet mở và cập nhật bảo mật'
        },
        descriptions: {
          ko: '파이 네트워크가 공식적으로 오픈 메인넷 시대를 열며 보안 감사를 통과했습니다.',
          en: 'Pi Network has officially entered the Open Mainnet era after passing security audits.'
        },
        author: 'Official Pi',
        timestamp: new Date().getTime(), // 방금 전
        url: 'https://minepi.com'
      },
      {
        id: 'n2',
        category: 'Commerce',
        titles: {
          ko: '[커머스] 전 세계 파이 결제 매장 1,000개 돌파',
          en: '[Commerce] Pi Payment Stores Exceed 1,000 Worldwide',
          zh: '[商业] 全球派币付款商店突破 1,000 家',
          es: '[Comercio] Las tiendas con pago Pi superan las 1.000 en todo el mundo',
          vi: '[Thương mại] Cửa hàng thanh toán Pi vượt quá 1.000 trên toàn thế giới'
        },
        descriptions: {
          ko: '오프라인 매장에서의 파이 사용이 가속화되며 실질 가치가 증명되고 있습니다.',
          en: 'Practical value is being proven as Pi usage in offline stores accelerates.'
        },
        author: 'GPNR Global',
        timestamp: new Date().getTime() - (1000 * 60 * 60), // 1시간 전
        url: 'https://pinetwork.com'
      },
      // ... 추가 데이터는 실제 AI 크롤링 시 자동으로 채워집니다.
    ];

    // 1. 카테고리 필터링 (공백 제거 후 비교하여 정확도 향상)
    let filtered = category.toLowerCase() === 'all' 
      ? rawNewsData 
      : rawNewsData.filter(n => n.category.toLowerCase() === category.toLowerCase());

    // 2. 최신순 정렬 (timestamp 기준)
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    // 3. 상위 10개만 추출 (요구사항 6번)
    const finalNews = filtered.slice(0, 10).map(news => ({
      id: news.id,
      // 언어 설정에 맞는 제목과 설명을 선택 (없으면 영어로 표시)
      title: news.titles[lang as keyof typeof news.titles] || news.titles['en'],
      description: news.descriptions[lang as keyof typeof news.descriptions] || news.descriptions['en'],
      category: news.category,
      author: news.author,
      // 언어별 상대적 시간 표시 (예: 1시간 전)
      date: new Intl.RelativeTimeFormat(lang === 'ko' ? 'ko' : 'en', { numeric: 'auto' }).format(
        -Math.round((new Date().getTime() - news.timestamp) / (1000 * 60 * 60)), 'hour'
      ),
      url: news.url,
      image: `https://picsum.photos/seed/${news.id}/800/400`
    }));

    return NextResponse.json(finalNews);

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
