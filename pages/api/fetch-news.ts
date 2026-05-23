import { NextApiRequest, NextApiResponse } from 'next';

const CATEGORY_IMAGE_IDS: { [key: string]: number[] } = {
  ALL: [1, 10, 16], MAINNET: [0, 201, 160], COMMUNITY: [129, 238, 447],
  COMMERCE: [2, 3, 4], NODE: [48, 160, 532], MINING: [180, 192, 225],
  WALLET: [431, 442, 555], BROWSER: [367, 370, 396], KYC: [558, 628, 984],
  DEVELOPER: [4, 5, 6], ECOSYSTEM: [10, 11, 12], LISTING: [20, 26, 39],
  PRICE: [513, 520, 521], SECURITY: [445, 529, 611], EVENT: [68, 69, 70],
  ROADMAP: [141, 142, 145], WHITEPAPER: [24, 25, 26], LEGAL: [175, 176, 177]
};

// [핵심 추가] 실시간 기사별 피드백 카운트를 영구 저장할 전역 인메모리 저장소
// (추후 배포 환경에서 유실을 막으려면 Vercel KV 나 Postgres DB 로 전환하기 전까지 브릿지 역할을 수행합니다)
type FeedbackStore = {
  [articleId: string]: {
    readCount: number;
    starCount: number;
    likeCount: number;
  }
};

// Next.js 개발 환경 핫 리로드 시 유실 방지 처리
const globalRef = global as unknown as { feedbackStore: FeedbackStore };
if (!globalRef.feedbackStore) {
  globalRef.feedbackStore = {};
}
const feedbackStore = globalRef.feedbackStore;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 사용자가 피드백(읽음/중요/좋음)을 보낸 경우 (POST 요청 처리)
  if (req.method === 'POST') {
    const { articleId, actionType } = req.body; // actionType: 'read' | 'star' | 'like'

    if (!articleId || !['read', 'star', 'like'].includes(actionType)) {
      return res.status(400).json({ error: "잘못된 데이터 요청입니다." });
    }

    // 저장소에 기사 아이디가 없으면 초기화
    if (!feedbackStore[articleId]) {
      feedbackStore[articleId] = { readCount: 0, starCount: 0, likeCount: 0 };
    }

    // 클라이언트의 로컬 토글 상태와 동기화하기 위해 값 제어 (기본값 분기 처리 가능)
    // 여기서는 기본적으로 요청이 들어올 때마다 1씩 증가 처리 (혹은 취소 시 감산 로직 연동 가능)
    if (actionType === 'read') feedbackStore[articleId].readCount += 1;
    if (actionType === 'star') feedbackStore[articleId].starCount += 1;
    if (actionType === 'like') feedbackStore[articleId].likeCount += 1;

    return res.status(200).json({ 
      success: true, 
      articleId, 
      counts: feedbackStore[articleId] 
    });
  }

  // 기사 데이터를 조회하는 경우 (GET 요청 처리)
  if (req.method === 'GET') {
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

        // 전역 피드백 저장소에서 현재 기사의 누적 카운팅 정보를 연동 (없으면 임의의 초기 시드값 제공 가능)
        const savedFeedback = feedbackStore[generatedId] || {
          readCount: Math.floor(Math.random() * 50) + 10,  // 초기 휑한 느낌을 방지하기 위한 기본 시드값 생성
          starCount: Math.floor(Math.random() * 10) + 2,
          likeCount: Math.floor(Math.random() * 30) + 5
        };

        // 실시간 조회할 때도 값이 날아가지 않도록 역매핑 보존
        if (!feedbackStore[generatedId]) {
          feedbackStore[generatedId] = savedFeedback;
        }
        
        return {
          id: generatedId,
          title: titleParts.join(' - '),
          url: link,
          source: sourceName,
          date: pubDate,
          category: currentCat,
          content: cleanDesc || `${titleParts.join(' - ')}에 대한 자세한 내용을 확인하려면 아래 출처 링크를 클릭하세요.`,
          imageUrl: `https://picsum.photos/id/${idPool[index % idPool.length]}/400/300`,
          
          //
