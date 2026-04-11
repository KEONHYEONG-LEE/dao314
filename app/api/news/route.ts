import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'ko';
  const category = searchParams.get('category') || 'all';

  // 실제 표시될 17개 카테고리 리스트 (태그용)
  const categoryList = ['MAINNET', 'COMMERCE', 'COMMUNITY', 'SOCIAL', 'EDUCATION', 'HEALTH', 'TRAVEL', 'UTILITIES', 'CAREER', 'ENTERTAIN', 'GAMES', 'FINANCE', 'MUSIC', 'SPORTS', 'DEFI', 'DAPP', 'NFT'];

  try {
    const searchQuery = category === 'all' ? 'Pi Network' : `Pi Network ${category}`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=${lang === 'ko' ? 'ko' : 'en-US'}`;

    const response = await fetch(rssUrl, { next: { revalidate: 3600 } });
    const xmlData = await response.text();
    const items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    const realNews = items.map((item, index) => {
      const title = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      const rawDesc = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
      
      const cleanDesc = rawDesc
        .replace(/<[^>]*>?/gm, '')
        .replace(/&[a-z0-9#]+;/gi, '')
        .replace(/(http|https):\/\/[^\s]+/g, '')
        .trim();

      // [수정 포인트 1] category가 'all'인 경우, 17개 카테고리 중 하나를 매칭 (인덱스 활용)
      // 특정 단어가 제목에 있으면 그 카테고리를 우선 배정하는 로직 추가 가능
      const displayCategory = category === 'all' 
        ? categoryList[index % categoryList.length] 
        : category.toUpperCase();

      return {
        id: `news-${index}-${category}`,
        category: displayCategory, // 이제 'ALL' 대신 구체적인 카테고리명이 찍힙니다.
        title: title.split(' - ')[0],
        content: cleanDesc || "상세 내용을 가져오는 중입니다.",
        author: title.split(' - ')[1] || "GPNR News",
        date: new Date(pubDate).toLocaleDateString(),
        image: `https://picsum.photos/seed/${index}${category}/800/600`,
        url: link
      };
    });

    return NextResponse.json(realNews);
  } catch (error) {
    return NextResponse.json({ error: "Fail" }, { status: 500 });
  }
}
