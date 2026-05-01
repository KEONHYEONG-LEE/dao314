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
    const searchQuery = currentCat === 'ALL' ? 'Pi Network' : `Pi Network ${currentCat}`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=en-US&gl=US&ceid=US:en`;
    const response = await fetch(rssUrl);
    const xmlData = await response.text();
    const items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    let googleNews = items.map((item, index) => {
      const titleRaw = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      const titleParts = titleRaw.split(' - ');
      const sourceName = titleParts.length > 1 ? titleParts.pop() : "GPNR News";
      const idPool = CATEGORY_IMAGE_IDS[currentCat] || CATEGORY_IMAGE_IDS["ALL"];
      
      return {
        id: `google-${index}`,
        title: titleParts.join(' - '),
        url: link,
        source: sourceName,
        date: pubDate, // 원본 날짜 문자열
        category: currentCat,
        imageUrl: `https://picsum.photos/id/${idPool[index % idPool.length]}/400/300`
      };
    });

    // --- 최신순 정렬 로직 추가 ---
    googleNews.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    // -------------------------

    return res.status(200).json(googleNews.slice(0, 20));
  } catch (error) {
    return res.status(500).json({ error: "Failed" });
  }
}
