// ... (상단 CATEGORY_IMAGE_IDS 및 cleanText 함수는 유지)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category = 'all' } = req.query;
  const currentCat = (category as string).toUpperCase();

  try {
    const searchQuery = currentCat === 'ALL' ? 'Pi Network' : `Pi Network ${currentCat}`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=en-US&gl=US&ceid=US:en`;
    const response = await fetch(rssUrl);
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
        id: `google-${index}`,
        title: titleParts.join(' - '),
        url: link,           // 'url'로 통일
        source: sourceName,  // 'source'로 통일
        date: pubDate,       // 'date'로 통일
        category: currentCat,
        imageUrl: `https://picsum.photos/id/${idPool[index % idPool.length]}/400/300`
      };
    });

    return res.status(200).json(googleNews.slice(0, 20));
  } catch (error) {
    return res.status(500).json({ error: "Failed" });
  }
}
