import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'ko';
  const category = searchParams.get('category') || 'all';

  try {
    // 카테고리별 검색어 최적화
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
      
      // 기사 본문 정제: HTML 태그, 엔티티(&nbsp; 등), 링크 주소를 모두 제거
      const cleanDesc = rawDesc
        .replace(/<[^>]*>?/gm, '') // 태그 제거
        .replace(/&[a-z0-9#]+;/gi, '') // HTML 엔티티 제거
        .replace(/(http|https):\/\/[^\s]+/g, '') // 본문 내 URL 제거
        .trim();

      return {
        id: `news-${index}-${category}`,
        // 전부 LIVE가 아닌 선택된 카테고리 이름을 부여
        category: category.toUpperCase(),
        title: title.split(' - ')[0],
        content: cleanDesc || "상세 내용을 가져오는 중입니다. 원문 링크를 통해 더 자세한 내용을 확인하실 수 있습니다.",
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
