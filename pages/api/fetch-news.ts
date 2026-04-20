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
  const { category = 'all' } = req.query;

  try {
    const searchQuery = category === 'all' ? 'Pi Network' : `Pi Network ${category}`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery as string)}&hl=en-US&gl=US&ceid=US:en`;

    const response = await fetch(rssUrl);
    if (!response.ok) throw new Error('Failed to fetch RSS');
    
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

      return {
        id: `news-${index}`,
        title: cleanTitle,
        content: cleanText(rawDesc),
        source: source,
        date: pubDate, // 정렬을 위해 원본 날짜 데이터 유지
        displayDate: new Date(pubDate).toLocaleDateString('en-US'), // 화면 표시용
        url: link,
        category: (category as string).toUpperCase(),
        imageUrl: `https://picsum.photos/seed/${encodeURIComponent(cleanTitle)}/400/300`
      };
    });

    // 3. 최신 날짜순 정렬 (정렬 로직 추가)
    const sortedNews = newsData.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // 최종적으로 15개만 반환
    return res.status(200).json(sortedNews.slice(0, 15));

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Failed to process news" });
  }
}
