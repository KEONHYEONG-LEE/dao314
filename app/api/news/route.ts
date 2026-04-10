import { NextResponse } from 'next/server';

// 3 & 5 & 6번 요구사항 반영: 뉴스 검색 및 17개 카테고리 분류 로직
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';
  const lang = searchParams.get('lang') || 'ko';

  try {
    /**
     * [구현 로직 설계]
     * 1. 매시간(Cron Job) 서버에서 CNN, KBS, Pi News 등을 검색.
     * 2. AI(Gemini 등)를 사용하여 기사를 17개 카테고리로 매칭.
     * 3. DB(예: Vercel KV, MongoDB)에서 최신순으로 가져옴.
     */

    // 아래는 검색 로직을 시뮬레이션한 최신 뉴스 데이터셋입니다.
    const rawNewsData = [
      {
        id: 'p1',
        category: 'Mainnet',
        titles: {
          ko: '파이 네트워크, 오픈 메인넷 보안 감사 완료',
          en: 'Pi Network Completes Open Mainnet Security Audit',
          zh: 'Pi Network 完成开放主网安全审计',
          es: 'Pi Network completa la auditoría de seguridad de Mainnet',
          vi: 'Pi Network hoàn thành kiểm toán bảo mật Mainnet'
        },
        descriptions: {
          ko: '글로벌 보안 기업과의 협력을 통해 오픈 메인넷의 안전성이 입증되었습니다.',
          en: 'Safety of the open mainnet has been proven through collaboration with global security firms.'
        },
        author: 'CNN Business',
        timestamp: new Date().getTime(),
        url: 'https://edition.cnn.com/crypto'
      },
      {
        id: 'p2',
        category: 'Finance',
        titles: {
          ko: '파이 코인, 주요 거래소 상장 및 GCV 추세 분석',
          en: 'Pi Coin Exchange Listing and GCV Trend Analysis',
          zh: '派币交易所上市及 GCV 趋势分析',
          es: 'Listado de Pi Coin en exchanges y análisis de GCV',
          vi: 'Niêm yết Pi Coin trên sàn giao dịch và phân tích xu hướng GCV'
        },
        descriptions: {
          ko: '최근 거래소 상장 소식과 함께 글로벌 합의 가격(GCV)에 대한 논의가 활발합니다.',
          en: 'Discussions on GCV are active following recent exchange listing news.'
        },
        author: 'CoinMarketCap',
        timestamp: new Date().getTime() - 3600000, // 1시간 전
        url: 'https://coinmarketcap.com'
      }
      // ... 실제 운영 시 이 배열은 매시간 AI 검색 결과로 채워집니다.
    ];

    // 1. 카테고리 필터링
    let filtered = category === 'all' 
      ? rawNewsData 
      : rawNewsData.filter(n => n.category.toLowerCase() === category.toLowerCase());

    // 2. 최신순 정렬 (최신 소식 최상단)
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    // 3. 최대 10개 제한 (6번 요구사항)
    const finalNews = filtered.slice(0, 10).map(news => ({
      id: news.id,
      title: news.titles[lang as keyof typeof news.titles] || news.titles['en'],
      description: news.descriptions[lang as keyof typeof news.descriptions] || news.descriptions['en'],
      category: news.category,
      author: news.author,
      date: new Date(news.timestamp).toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US'),
      url: news.url
    }));

    return NextResponse.json(finalNews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
