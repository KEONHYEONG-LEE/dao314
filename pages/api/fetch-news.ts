import { NextApiRequest, NextApiResponse } from 'next';

const CATEGORY_IMAGE_IDS: { [key: string]: number[] } = {
  ALL: [1, 10, 16], MAINNET: [0, 201, 160], COMMUNITY: [129, 238, 447],
  COMMERCE: [2, 3, 4], NODE: [48, 160, 532], MINING: [180, 192, 225],
  WALLET: [431, 442, 555], BROWSER: [367, 370, 396], KYC: [558, 628, 984],
  DEVELOPER: [4, 5, 6], ECOSYSTEM: [10, 11, 12], LISTING: [20, 26, 39],
  PRICE: [513, 520, 521], SECURITY: [445, 529, 611], EVENT: [68, 69, 70],
  ROADMAP: [141, 142, 145], WHITEPAPER: [24, 25, 26], LEGAL: [175, 176, 177]
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category = 'all' } = req.query;
  const currentCat = (category as string).toUpperCase();

  try {
    // 검색 쿼리를 더 정교하게 수정 (Pi Network와 해당 카테고리 조합)
    const searchQuery = currentCat === 'ALL' ? 'Pi Network crypto' : `Pi Network ${currentCat}`;
    // 한글 뉴스도 포함될 수 있도록 hl=ko-KR 옵션을 고려할 수 있으나, 현재는 en-US 유지
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=en-US&gl=US&ceid=US:en`;
    
    const response = await fetch(rssUrl);
    if (!response.ok) throw new Error("Google News Fetch Failed");

    const xmlData = await response.text();
    const items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    const googleNews = items.map((item, index) => {
      const titleRaw = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      
      const titleParts = titleRaw.split(' - ');
      const sourceName = titleParts.length > 1 ? titleParts.pop() : "GPNR News";
      const idPool = CATEGORY_IMAGE_IDS[currentCat] || CATEGORY_IMAGE_IDS["ALL"];
      
      return {
        id: `google-${currentCat}-${index}`, // ID에 카테고리 포함하여 고유성 확보
        title: titleParts.join(' - '),
        url: link,
        source: sourceName,
        date: pubDate,
        category: currentCat,
        imageUrl: `https://picsum.photos/id/${idPool[index % idPool.length]}/400/300`
      };
    });

    // 최신순 정렬
    googleNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 캐시 설정 (Vercel/Browser 캐시 5분) - 잦은 API 호출 방지
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    
    return res.status(200).json(googleNews.slice(0, 20));
  } catch (error) {
    console.error("News API Error:", error);
    return res.status(500).json({ error: "Failed to fetch news" });
  }
}
