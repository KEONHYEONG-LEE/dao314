import { NextResponse } from 'next/server';

/**
 * GPNR 뉴스 엔진 핵심 로직 (3, 5, 6번 요구사항 반영)
 * 1. 17개 카테고리 분류 체계 확립
 * 2. 5개 언어별 최적화된 필드 매핑
 * 3. 최신순 정렬 및 카테고리별 상위 10개 제한
 */

// 17개 공식 카테고리 정의 (대소문자 구분 방지용)
const VALID_CATEGORIES = [
  'Mainnet', 'Global Community', 'Commerce', 'Social', 'Education', 
  'Health', 'Travel', 'Utilities', 'Career', 'Entertainment', 
  'Games', 'Finance', 'Music', 'Sports', 'DeFi', 'dApp', 'NFT'
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';
  const lang = searchParams.get('lang') || 'ko';

  try {
    /**
     * [FUTURE-PROOF LOGIC]
     * 실제 운영 단계에서는 아래 rawNewsData 대신 DB(예: MongoDB, Firebase)에서
     * 크론잡(Cron Job)을 통해 1시간마다 업데이트된 데이터를 fetch해 옵니다.
     */

    // 17개 카테고리를 골고루 포함한 최신 뉴스 시뮬레이션 데이터
    const rawNewsData = [
      {
        id: 'n1',
        category: 'Mainnet',
        titles: {
          ko: '[메인넷] 오픈 메인넷 전환 및 프로토콜 21.2 업데이트',
          en: '[Mainnet] Transition to Open Mainnet & Protocol 21.2 Update',
          zh: '[主网] 开放主网转换和协议 21.2 更新',
          es: '[Mainnet] Transición a Mainnet abierta y actualización del Protocolo 21.2',
          vi: '[Mainnet] Chuyển đổi sang Mainnet mở và cập nhật Giao thức 21.2'
        },
        descriptions: {
          ko: '파이 네트워크가 드디어 오픈 메인넷 시대를 맞이하여 기술적 보안 감사를 모두 통과했습니다.',
          en: 'Pi Network has officially entered the Open Mainnet era after passing all technical security audits.'
        },
        author: 'Pi News Official',
        timestamp: new Date().getTime(), // 방금 전
        url: 'https://minepi.com'
      },
      {
        id: 'n2',
        category: 'Commerce',
        titles: {
          ko: '[커머스] 전 세계 1,000개 이상의 매장에서 파이 결제 수용',
          en: '[Commerce] Over 1,000 stores worldwide now accept Pi payments',
          zh: '[商业] 全球 1,000 多家商店现已接受派币付款',
          es: '[Comercio] Más de 1.000 tiendas en todo el mundo ya aceptan pagos con Pi',
          vi: '[Thương mại] Hơn 1.000 cửa hàng trên toàn thế giới hiện chấp nhận thanh toán bằng Pi'
        },
        descriptions: {
          ko: '온오프라인 커머스 생태계가 확장되면서 파이의 실질적 가치가 증명되고 있습니다.',
          en: 'As the online and offline commerce ecosystem expands, the real-world value of Pi is being proven.'
        },
        author: 'CNN Business',
        timestamp: new Date().getTime() - (30 * 60 * 1000), // 30분 전
        url: 'https://edition.cnn.com'
      },
      {
        id: 'n3',
        category: 'Finance',
        titles: {
          ko: '[금융] 주요 거래소 Pi 코인 리스팅 및 GCV 합의 가격 동향',
          en: '[Finance] Major Exchange Pi Coin Listing & GCV Price Trends',
          zh: '[金融] 主要交易所派币上市及 GCV 价格趋势',
          es: '[Finanzas] Listado de Pi Coin en los principales exchanges y tendencias de precios de GCV',
          vi: '[Tài chính] Niêm yết Pi Coin trên các sàn giao dịch lớn và xu hướng giá GCV'
        },
        descriptions: {
          ko: '글로벌 금융 시장에서 파이 네트워크의 자산 가치에 대한 분석 보고서가 발행되었습니다.',
          en: 'Analysis reports on the asset value of Pi Network in global financial markets have been published.'
        },
        author: 'Bloomberg Crypto',
        timestamp: new Date().getTime() - (3600 * 1000), // 1시간 전
        url: 'https://bloomberg.com'
      }
      // (여기에 나머지 14개 카테고리 데이터가 AI 서칭을 통해 추가됩니다)
    ];

    // 1. 카테고리 필터링 (3, 5번 요구사항)
    let filtered = category.toLowerCase() === 'all' 
      ? rawNewsData 
      : rawNewsData.filter(n => n.category.replace(/\s+/g, '').toLowerCase() === category.replace(/\s+/g, '').toLowerCase());

    // 2. 최신순 정렬 (최상단 배치)
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    // 3. 최대 10개 제한 (6번 요구사항)
    const finalNews = filtered.slice(0, 10).map(news => {
      // 5개 언어 대응 로직 (없을 경우 기본값 영어)
      const currentTitle = news.titles[lang as keyof typeof news.titles] || news.titles['en'];
      const currentDesc = news.descriptions[lang as keyof typeof news.descriptions] || news.descriptions['en'];

      return {
        id: news.id,
        title: currentTitle,
        description: currentDesc,
        category: news.category,
        author: news.author,
        // 시간 포맷을 언어별로 최적화
        date: new Intl.RelativeTimeFormat(lang === 'ko' ? 'ko' : 'en', { numeric: 'auto' }).format(
          -Math.round((new Date().getTime() - news.timestamp) / (1000 * 60 * 60)), 'hour'
        ),
        url: news.url,
        image: `https://picsum.photos/seed/${news.id}/800/400` // 데이터에 이미지가 없을 경우 생성
      };
    });

    return NextResponse.json(finalNews);

  } catch (error) {
    console.error("GPNR News Engine Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
