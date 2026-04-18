import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// [수정] "gemini-pro"를 "gemini-1.5-flash"로 변경했습니다. (속도와 안정성이 훨씬 좋습니다)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery as string)}&hl=en-US&gl=US&ceid=US:en`;

    const response = await fetch(rssUrl);
    const xmlData = await response.text();
    const items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    const newsData = items.slice(0, 10).map((item, index) => {
      const titleRaw = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      let rawDesc = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
      rawDesc = rawDesc.replace("<![CDATA[", "").replace("]]>", "");
      
      const titleParts = titleRaw.split(' - ');
      const source = titleParts.length > 1 ? titleParts.pop() : "GPNR News";
      return {
        id: `news-${index}`,
        title: titleParts.join(' - '),
        content: cleanText(rawDesc),
        source: source,
        date: new Date(pubDate).toLocaleDateString(),
        url: link
      };
    });

    if (lang === 'ko' && newsData.length > 0) {
      const newsToTranslate = newsData.map(n => `Title: ${n.title}\nContent: ${n.content}`).join('\n\n---\n\n');
      const prompt = `Translate the following Pi Network news into professional Korean. Output only the translations separated by '---'. \n\n${newsToTranslate}`;
      
      // 최신 모델로 번역을 요청합니다.
      const result = await model.generateContent(prompt);
      const translatedText = result.response.text();
      const translatedParts = translatedText.split('---');

      const translatedNews = newsData.map((item, i) => {
        const translatedItem = translatedParts[i] || "";
        const lines = translatedItem.trim().split('\n');
        return {
          ...item,
          category: (category as string).toUpperCase(),
          title: lines[0]?.replace('Title: ', '').trim() || item.title,
          content: lines[1]?.replace('Content: ', '').trim() || item.content,
          image: `https://picsum.photos/seed/${encodeURIComponent(item.title)}/400/300`,
        };
      });
      return res.status(200).json(translatedNews);
    }

    const finalNews = newsData.map(item => ({
      ...item,
      category: (category as string).toUpperCase(),
      image: `https://picsum.photos/seed/${encodeURIComponent(item.title)}/400/300`,
    }));

    return res.status(200).json(finalNews);
  } catch (error) {
    console.error("Fetch/Translate Error:", error);
    return res.status(500).json({ error: "Fail to process news" });
  }
}
