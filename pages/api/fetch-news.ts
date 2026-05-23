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
  // GET 요청(뉴스 조회)만 순수하게 허용
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "허용되지 않는 요청 메서드입니다." });
  }

  const { category = 'all' } = req.query;
  const currentCat = (category as string).toUpperCase();

  try {
    const searchQuery = currentCat === 'ALL' ? 'Pi Network crypto' : `Pi Network ${currentCat}`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=en-US&gl=US&ceid=US:en`;
    
    const response = await fetch(rssUrl);
    if (!response.ok) throw new Error("Google News Fetch Failed");

    const xmlData = await response.text();
    const items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    const googleNews = items.map((item, index) => {
      const titleRaw = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      
      const descRaw = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
      const cleanDesc = descRaw.replace(/<[^>]*>?/gm, '').split('&nbsp;')[0];
      
      const titleParts = titleRaw.split(' - ');
      const sourceName = titleParts.length > 1 ? titleParts.pop() : "GPNR News";
      const idPool = CATEGORY_IMAGE_IDS[currentCat] || CATEGORY_IMAGE_IDS["ALL"];
      
      const generatedId = `google-${currentCat}-${index}`;
      
      return {
        id: generatedId,
        title: titleParts.join(' - '),
        url: link,
        source: sourceName,
        date: pubDate,
        category: currentCat,
        content: cleanDesc || `${titleParts.join(' - ')}에 대한 자세한 내용을 확인하려면 아래 출처 링크를 클릭하세요.`,
        imageUrl: `https://picsum.photos/id/${idPool[index % idPool.length]}/400/300`
      };
    });

    return res.status(200).json(googleNews);

  } catch (error) {
    console.error("구글 RSS 뉴스 패치 실패:", error);
    return res.status(500).json({ error: "실시간 뉴스를 가져오는 도중 문제가 발생했습니다." });
  }
}
