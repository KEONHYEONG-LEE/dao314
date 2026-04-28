import { NextApiRequest, NextApiResponse } from 'next';
import { NEWS_DATA } from '../../lib/pi-news-v2'; // 수동 데이터 불러오기

// ... CATEGORY_IMAGE_IDS 코드 생략 ...

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category = 'all' } = req.query;
  const currentCat = (category as string).toUpperCase();

  try {
    // 1. 구글 RSS 뉴스 가져오기
    const searchQuery = currentCat === 'ALL' ? 'Pi Network' : `Pi Network ${currentCat}`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=en-US&gl=US&ceid=US:en`;
    const response = await fetch(rssUrl);
    const xmlData = await response.text();
    const items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    const googleNews = items.map((item, index) => {
      // ... 기존의 googleNews 변환 로직 ...
      return {
        id: `news-${index}`,
        title: cleanTitle,
        content: cleanText(rawDesc),
        source: source,
        date: pubDate,
        url: link,
        category: currentCat,
        imageUrl: `https://picsum.photos/id/${selectedId}/400/300`
      };
    });

    // 2. 수동 데이터(NEWS_DATA)를 구글 뉴스 형식에 맞게 변환
    const manualNews = NEWS_DATA.filter(item => 
      currentCat === 'ALL' || item.category === currentCat
    ).map(item => ({
      id: item.id,
      title: `[GPNR] ${item.title}`, // 직접 쓴 뉴스임을 표시
      content: item.content,
      source: item.author,
      date: item.publishedAt,
      url: item.sourceUrl,
      category: item.category,
      imageUrl: item.imageUrl
    }));

    // 3. 두 데이터를 합치고 날짜순 정렬
    const combinedNews = [...manualNews, ...googleNews].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return res.status(200).json(combinedNews.slice(0, 20));

  } catch (error) {
    return res.status(500).json({ error: "Failed to process news" });
  }
}
