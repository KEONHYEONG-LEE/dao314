import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'ko';
  const category = searchParams.get('category') || 'all';

  try {
    // 1. 구글 뉴스 RSS 피드 URL 설정 (검색어: Pi Network + 카테고리)
    const searchQuery = category === 'all' ? 'Pi Network' : `Pi Network ${category}`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=${lang === 'ko' ? 'ko' : 'en-US'}&gl=${lang === 'ko' ? 'KR' : 'US'}&ceid=${lang === 'ko' ? 'KR:ko' : 'US:en'}`;

    // 2. RSS 데이터 가져오기
    const response = await fetch(rssUrl, { next: { revalidate: 3600 } }); // 1시간마다 캐시 갱신
    const xmlData = await response.text();

    // 3. XML 파싱 (정규식을 사용한 간이 파싱 - 라이브러리 설치 없이 바로 작동 가능)
    const items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    const realNews = items.map((item, index) => {
      const title = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      const description = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
      
      // 날짜 포맷팅
      const dateObj = new Date(pubDate);
      const formattedDate = dateObj.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US');

      return {
        id: `real-${index}-${dateObj.getTime()}`,
        category: category === 'all' ? 'LIVE' : category.toUpperCase(),
        title: title.split(' - ')[0], // 매체 이름 제거
        description: description.replace(/<[^>]*>?/gm, '').slice(0, 100) + "...", // HTML 태그 제거
        content: `출처: ${title.split(' - ')[1] || 'Global News'}\n\n이 기사는 구글 뉴스 실시간 피드를 통해 수집되었습니다. 자세한 내용은 원문 링크를 참조하십시오.`,
        author: title.split(' - ')[1] || "GPNR Bot",
        date: formattedDate,
        image: `https://picsum.photos/seed/${index}${category}/800/600`, // 뉴스별 고유 랜덤 이미지
        url: link
      };
    });

    // 4. 만약 검색 결과가 너무 적으면 샘플 데이터와 병합 (앱이 비어 보이지 않게 처리)
    return NextResponse.json(realNews.length > 0 ? realNews : []);

  } catch (error) {
    console.error("RSS Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
