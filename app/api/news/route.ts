import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'ko';
  const category = searchParams.get('category') || 'all';

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
      
      // HTML 태그 제거 및 본문 추출
      const cleanDesc = rawDesc.replace(/<[^>]*>?/gm, '');

      return {
        id: `real-${index}`,
        category: category === 'all' ? 'LIVE' : category.toUpperCase(),
        title: title.split(' - ')[0],
        // 상세 페이지에서 보여줄 충분한 양의 본문 데이터
        content: cleanDesc + "\n\n이 기사는 실시간 뉴스 피드를 통해 수집된 상세 정보를 포함하고 있습니다. GPNR AI는 파이오니어들이 생태계의 흐름을 정확히 파악할 수 있도록 원문의 핵심 내용을 그대로 전달합니다.",
        author: title.split(' - ')[1] || "GPNR News",
        date: new Date(pubDate).toLocaleString(),
        image: `https://picsum.photos/seed/${index}${category}/800/600`,
        url: link
      };
    });

    return NextResponse.json(realNews);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
