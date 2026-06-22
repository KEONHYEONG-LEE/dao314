import { NextApiRequest, NextApiResponse } from 'next';

// 구글 번역 및 레이아웃 깨짐을 방지하고 항상 정상 작동하는 카테고리별 고정 이미지 키워드 맵
const CATEGORY_KEYWORDS: { [key: string]: string } = {
  ALL: "crypto,blockchain", MAINNET: "server,network", COMMUNITY: "people,chat",
  COMMERCE: "shopping,business", NODE: "data,cloud", MINING: "hardware,mining",
  WALLET: "wallet,money", BROWSER: "web,safari", KYC: "security,id",
  DEVELOPER: "coding,developer", ECOSYSTEM: "nature,globe", LISTING: "chart,stock",
  PRICE: "finance,coin", SECURITY: "lock,cyber", EVENT: "conference,stage",
  ROADMAP: "timeline,map", WHITEPAPER: "document,book", LEGAL: "law,court"
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
      
      const generatedId = `google-${currentCat}-${index}`;
      
      // 해당 카테고리의 대표 키워드 추출 (없으면 crypto로 대체)
      const keyword = CATEGORY_KEYWORDS[currentCat] || CATEGORY_KEYWORDS["ALL"];
      
      return {
        id: generatedId,
        title: titleParts.join(' - '),
        url: link,
        source: sourceName,
        date: pubDate,
        category: currentCat,
        content: cleanDesc || `${titleParts.join(' - ')}에 대한 자세한 내용을 확인하려면 아래 출처 링크를 클릭하세요.`,
        // 🚀 깨지는 id 방식 대신, 절대 에러 나지 않는 random 파라미터 + 키워드 조합 방식으로 전면 수정
        imageUrl: `https://picsum.photos/400/300?sig=${currentCat.toLowerCase()}-${index}&q=${keyword}`
      };
    });

    return res.status(200).json(googleNews);

  } catch (error) {
    console.error("구글 RSS 뉴스 패치 실패:", error);
    return res.status(500).json({ error: "실시간 뉴스를 가져오는 도중 문제가 발생했습니다." });
  }
}
