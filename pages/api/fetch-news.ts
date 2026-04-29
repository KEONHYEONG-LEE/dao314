import { NextApiRequest, NextApiResponse } from 'next';

// 1. 에러의 원인이었던 import 문을 삭제했습니다.

const CATEGORY_IMAGE_IDS: { [key: string]: number[] } = {
  ALL: [1, 10, 16], MAINNET: [0, 201, 160], COMMUNITY: [129, 238, 447],
  COMMERCE: [2, 3, 4], NODE: [48, 160, 532], MINING: [180, 192, 225],
  WALLET: [431, 442, 555], BROWSER: [367, 370, 396], KYC: [558, 628, 984],
  DEVELOPER: [4, 5, 6], ECOSYSTEM: [10, 11, 12], LISTING: [20, 26, 39],
  PRICE: [513, 520, 521], SECURITY: [445, 529, 611], EVENT: [68, 69, 70],
  ROADMAP: [141, 142, 145], WHITEPAPER: [24, 25, 26], LEGAL: [175, 176, 177]
};

function cleanText(text: string) {
  if (!text) return "";
  return text.replace(/<[^>]*>?/gm, '').replace(/&[a-z0-9#]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category = 'all' } = req.query;
  const currentCat = (category as string).toUpperCase();

  try {
    // 1. 구글 RSS 뉴스 페칭 (실시간 엔진)
    const searchQuery = currentCat === 'ALL' ? 'Pi Network' : `Pi Network ${currentCat}`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=en-US&gl=US&ceid=US:en`;
    const response = await fetch(rssUrl);
    const xmlData = await response.text();
    const items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    const googleNews = items.map((item, index) => {
      const titleRaw = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      let rawDesc = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
      rawDesc = rawDesc.replace("<![CDATA[", "").replace("]]>", "");
      const titleParts = titleRaw.split(' - ');
      const source = titleParts.length > 1 ? titleParts.pop() : "GPNR News";
      const idPool = CATEGORY_IMAGE_IDS[currentCat] || CATEGORY_IMAGE_IDS["ALL"];
      const selectedId = idPool[index % idPool.length];
      
      return {
        id: `google-${index}`,
        title: titleParts.join(' - '),
        content: cleanText(rawDesc),
        sourceName: source, // news-feed.tsx와 필드명 통일
        publishedAt: pubDate, // news-feed.tsx와 필드명 통일
        sourceUrl: link, // news-feed.tsx와 필드명 통일
        category: currentCat,
        imageUrl: `https://picsum.photos/id/${selectedId}/400/300`
      };
    });

    // 2. 수동 데이터 합치기 로직 제거 (삭제된 파일 참조 제거)

    // 3. 최신순 정렬 (이미 구글 뉴스가 최신순이지만 다시 한 번 확인)
    const sortedNews = googleNews.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return res.status(200).json(sortedNews.slice(0, 20));
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch news" });
  }
}
