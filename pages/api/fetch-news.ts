import { NextApiRequest, NextApiResponse } from 'next';

// 1. 카테고리별 대표 이미지 풀 (Unsplash의 키워드 활용)
const CATEGORY_IMAGES: { [key: string]: string[] } = {
  ALL: ["business", "news", "technology"],
  MAINNET: ["network", "server", "blockchain"],
  COMMUNITY: ["people", "meeting", "shaking-hands"],
  COMMERCE: ["shopping", "ecommerce", "market"],
  NODE: ["datacenter", "connection", "nodes"],
  MINING: ["cryptocurrency-mining", "hardware", "cpu"],
  WALLET: ["digital-wallet", "finance", "savings"],
  BROWSER: ["web-browser", "internet", "surfing"],
  KYC: ["identity", "security-check", "verification"],
  DEVELOPER: ["coding", "software", "programming"],
  ECOSYSTEM: ["nature-connection", "growth", "collaboration"],
  LISTING: ["stock-market", "exchange", "trading"],
  PRICE: ["chart", "bitcoin-price", "financial-growth"],
  SECURITY: ["cyber-security", "lock", "protection"],
  EVENT: ["conference", "stage", "celebration"],
  ROADMAP: ["strategy", "planning", "highway"],
  WHITEPAPER: ["document", "study", "research"],
  LEGAL: ["law", "hammer", "compliance"]
};

function cleanText(text: string) {
  if (!text) return "";
  return text
    .replace(/<[^>]*>?/gm, '')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category = 'all' } = req.query;
  const currentCat = (category as string).toUpperCase();

  try {
    const searchQuery = currentCat === 'ALL' ? 'Pi Network' : `Pi Network ${currentCat}`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=en-US&gl=US&ceid=US:en`;

    const response = await fetch(rssUrl);
    const xmlData = await response.text();
    const items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    const newsData = items.map((item, index) => {
      const titleRaw = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      let rawDesc = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
      rawDesc = rawDesc.replace("<![CDATA[", "").replace("]]>", "");
      
      const titleParts = titleRaw.split(' - ');
      const source = titleParts.length > 1 ? titleParts.pop() : "GPNR News";
      const cleanTitle = titleParts.join(' - ');

      // 2. 해당 카테고리의 이미지 풀에서 랜덤 선택
      const imagePool = CATEGORY_IMAGES[currentCat] || CATEGORY_IMAGES["ALL"];
      const randomKeyword = imagePool[Math.floor(Math.random() * imagePool.length)];
      
      return {
        id: `news-${index}`,
        title: cleanTitle,
        content: cleanText(rawDesc),
        source: source,
        date: pubDate,
        displayDate: new Date(pubDate).toLocaleDateString('en-US'),
        url: link,
        category: currentCat,
        // 키워드 기반으로 연관성 있는 이미지 호출
        imageUrl: `https://source.unsplash.com/featured/400x300?${randomKeyword}`
      };
    });

    const sortedNews = newsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return res.status(200).json(sortedNews.slice(0, 15));

  } catch (error) {
    return res.status(500).json({ error: "Failed to process news" });
  }
}
