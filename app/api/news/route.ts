import { NextResponse } from 'next/server';

function cleanText(text: string) {
  if (!text) return "";
  return text
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
    .replace(/<[^>]*>?/gm, '') // HTML 태그 제거
    .replace(/&[a-z0-9#]+;/gi, ' ') // 엔티티를 공백으로 치환
    .replace(/\s+/g, ' ') // 연속 공백 제거
    .trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'ko';
  const category = searchParams.get('category') || 'all';

  try {
    const searchQuery = category === 'all' ? 'Pi Network' : `Pi Network ${category}`;
    // Google RSS는 hl과 gl 파라미터가 정확해야 깨끗한 본문을 줍니다.
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=${lang === 'ko' ? 'ko' : 'en'}&gl=${lang === 'ko' ? 'KR' : 'US'}&ceid=${lang === 'ko' ? 'KR:ko' : 'US:en'}`;

    const response = await fetch(rssUrl, { next: { revalidate: 3600 } });
    const xmlData = await response.text();
    
    // CDATA 섹션 처리 추가 (RSS 본문이 보통 <![CDATA[ ]]> 안에 들어있음)
    const items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    const realNews = await Promise.all(items.slice(0, 15).map(async (item, index) => {
      const titleRaw = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      let rawDesc = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
      
      // CDATA 제거 로직 추가
      rawDesc = rawDesc.replace("<![CDATA[", "").replace("]]>", "");
      
      const titleParts = titleRaw.split(' - ');
      const source = titleParts.length > 1 ? titleParts.pop() : "GPNR News";
      const title = titleParts.join(' - ');

      // 본문 정제
      const content = cleanText(rawDesc);

      return {
        id: `news-${index}`,
        category: category.toUpperCase(),
        title: title,
        // 중요: 본문이 비어있으면 제목이라도 요약할 수 있게 제목을 넣어줌
        content: content && content.length > 10 ? content : `${title} - 상세 내용은 원문 링크를 참조하세요.`,
        source: source,
        date: new Date(pubDate).toLocaleDateString(),
        image: `https://picsum.photos/seed/${encodeURIComponent(title)}/800/600`,
        url: link
      };
    }));

    return NextResponse.json(realNews);
  } catch (error) {
    console.error("RSS Fetch Error:", error);
    return NextResponse.json({ error: "Fail" }, { status: 500 });
  }
}
