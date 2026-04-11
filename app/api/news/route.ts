import { NextResponse } from 'next/server';

// HTML 태그 제거 및 텍스트 정리 함수
function cleanText(text: string) {
  return text
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '') // 스크립트 제거
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')   // 스타일 제거
    .replace(/<[^>]*>?/gm, '')                          // 나머지 태그 제거
    .replace(/&[a-z0-9#]+;/gi, '')                      // 엔티티 제거
    .replace(/\s+/g, ' ')                               // 연속 공백 정리
    .trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'ko';
  const category = searchParams.get('category') || 'all';

  const categoryList = ['MAINNET', 'COMMERCE', 'COMMUNITY', 'SOCIAL', 'EDUCATION', 'HEALTH', 'TRAVEL', 'UTILITIES', 'CAREER', 'ENTERTAIN', 'GAMES', 'FINANCE', 'MUSIC', 'SPORTS', 'DEFI', 'DAPP', 'NFT'];

  try {
    const searchQuery = category === 'all' ? 'Pi Network' : `Pi Network ${category}`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=${lang === 'ko' ? 'ko' : 'en-US'}`;

    const response = await fetch(rssUrl, { next: { revalidate: 3600 } });
    const xmlData = await response.text();
    const items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    // 비동기 처리를 위해 Promise.all 사용
    const realNews = await Promise.all(items.slice(0, 10).map(async (item, index) => {
      const title = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      const rawDesc = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
      
      let fullContent = cleanText(rawDesc);

      // [추가된 로직] 실제 원문 링크에서 본문 긁어오기 시도
      try {
        const articleRes = await fetch(link, { signal: AbortSignal.timeout(3000) }); // 3초 타임아웃
        const articleHtml = await articleRes.text();
        
        // 간단한 본문 추출: <p> 태그 내용들을 모음 (정교한 크롤링은 별도 라이브러리 필요)
        const pMatch = articleHtml.match(/<p>([\s\S]*?)<\/p>/g);
        if (pMatch) {
          const extractedText = pMatch
            .map(p => cleanText(p))
            .filter(text => text.length > 20) // 너무 짧은 문장 제외
            .slice(0, 10) // 상위 10개 문단만
            .join('\n\n');
          
          if (extractedText.length > fullContent.length) {
            fullContent = extractedText;
          }
        }
      } catch (e) {
        console.log("상세 본문 추출 실패, RSS 요약 유지");
      }

      const displayCategory = category === 'all' 
        ? categoryList[index % categoryList.length] 
        : category.toUpperCase();

      return {
        id: `news-${index}-${category}`,
        category: displayCategory,
        title: title.split(' - ')[0],
        content: fullContent || "상세 내용을 가져올 수 없습니다. 원문 보기 버튼을 이용해 주세요.",
        source: title.split(' - ')[1] || "GPNR News", // author를 source로 이름 변경 (page.tsx와 맞춤)
        date: new Date(pubDate).toLocaleDateString(),
        image: `https://picsum.photos/seed/${index}${category}/800/600`,
        url: link,
        aiSummary: `본 기사는 ${displayCategory} 관련 소식으로, 주요 내용은 다음과 같습니다... (AI 분석 결과 대기 중)` // AI 요약용 필드 미리 확보
      };
    }));

    return NextResponse.json(realNews);
  } catch (error) {
    return NextResponse.json({ error: "Fail" }, { status: 500 });
  }
}
