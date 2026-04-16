import { NextApiRequest, NextApiResponse } from 'next';

function cleanText(text: string) {
  if (!text) return "";
  return text
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lang = 'ko', category = 'all' } = req.query;

  try {
    const searchQuery = category === 'all' ? 'Pi Network' : `Pi Network ${category}`;
    // Google RSS를 활용해 최신 뉴스를 긁어옵니다.
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery as string)}&hl=${lang === 'ko' ? 'ko' : 'en'}&gl=${lang === 'ko' ? 'KR' : 'US'}&ceid=${lang === 'ko' ? 'KR:ko' : 'US:en'}`;

    const response = await fetch(rssUrl);
    const xmlData = await response.text();
    
    const items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    const realNews = items.slice(0, 15).map((item, index) => {
      const titleRaw = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      let rawDesc = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
      
      rawDesc = rawDesc.replace("<![CDATA[", "").replace("]]>", "");
      
      const titleParts = titleRaw.split(' - ');
      const source = titleParts.length > 1 ? titleParts.pop() : "GPNR News";
      const title = titleParts.join(' - ');
      const content = cleanText(rawDesc);

      return {
        id: `news-${index}`,
        category: (category as string).toUpperCase(),
        title: title,
        content: content && content.length > 10 ? content : `${title} - 원문 링크를 참조하세요.`,
        source: source,
        date: new Date(pubDate).toLocaleDateString(),
        image: `https://picsum.photos/seed/${encodeURIComponent(title)}/400/300`, // 뉴스별 랜덤 이미지
        url: link
      };
    });

    res.status(200).json(realNews);
  } catch (error) {
    console.error("RSS Fetch Error:", error);
    res.status(500).json({ error: "Fail to fetch news" });
  }
}
