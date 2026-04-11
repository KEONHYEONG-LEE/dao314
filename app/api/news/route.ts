import { NextResponse } from 'next/server';

// [5번 로직] 검색 대상 설정
const SEARCH_SOURCES = [
  "CNN", "KBS News", "CoinMarketCap", "Binance News", "TradingView", 
  "Pi Network Official YouTube", "PI NEWS UPDATES", "PI News World"
];

// [6번 로직] 17개 카테고리 정의
const CATEGORIES = [
  "Mainnet", "Global Community", "Commerce", "Social", "Education", 
  "Health", "Travel", "Utilities", "Career", "Entertainment", 
  "Games", "Finance", "Music", "Sports", "DeFi", "dApp", "NFT"
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'ko';
  const category = searchParams.get('category') || 'all';

  try {
    // 1. [3번/5번 로직] 매시간 검색된 최신 뉴스 가져오기 (DB 또는 캐시에서 호출)
    // 실제 구현 시: 여기서 외부 API(ex: NewsAPI, Perplexity 등)를 호출하여 
    // "Pi Network" 관련 최신글을 1시간 단위로 긁어온 데이터를 리턴합니다.
    
    let newsData = await getLatestNewsFromDB(); 

    // 2. [4번 로직] 5개 언어 대응 (현재 요청된 언어로 번역된 데이터 필터링)
    // AI가 미리 번역해둔 데이터를 가져온다고 가정합니다.

    // 3. [6번 로직] 카테고리 필터링 및 최대 10개 제한
    let filteredNews = category === 'all' 
      ? newsData 
      : newsData.filter((item: any) => item.category.toLowerCase() === category.toLowerCase());

    // 최신순 정렬 및 카테고리별 최대 10개만 유지
    const sortedNews = filteredNews
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return NextResponse.json(sortedNews);

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

/**
 * [3번/5번 핵심] AI에게 뉴스 검색 및 분류를 시키는 가상 함수
 * 실제로는 Vercel KV나 Supabase 같은 DB에 저장된 내용을 불러오게 됩니다.
 */
async function getLatestNewsFromDB() {
  // 이 부분에 AI(Gemini/GPT)가 매시간 실행되어 
  // 17개 카테고리로 분류해둔 결과물을 가져오는 로직이 들어갑니다.
  // 임시로 구조화된 데이터를 리턴합니다.
  return [
    {
      id: "news_123",
      category: "Mainnet",
      title: "Pi Network Mainnet Migration Status Update",
      description: "Latest node sync completed successfully across global servers...",
      author: "Binance News",
      date: new Date().toISOString(), // [3번] 최신순 배치를 위해 현재 시간 사용
      image: "https://example.com/image.jpg",
      url: "https://example.com/news/123"
    },
    // ... 더 많은 데이터
  ];
}
