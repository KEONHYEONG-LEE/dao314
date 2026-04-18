export interface NewsItem {
  id: string;
  date: string;
  author: string;
  title: {
    en: string;
    ko: string;
  };
  content: {
    en: string;
    ko: string;
  };
  category: string;
  imageUrl?: string; // 여기에 사진 주소가 저장됩니다.
  source?: string;
  url?: string;
}

// 1. HTML 태그 내에서 첫 번째 이미지 URL을 추출하는 함수
const extractImageUrl = (content: string): string | undefined => {
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = content.match(imgRegex);
  return match ? match[1] : undefined;
};

// 2. HTML 태그 및 특수문자를 제거하여 깔끔한 텍스트로 만드는 함수
const cleanText = (html: string): string => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>?/gm, "") // 태그 제거
    .replace(/&nbsp;/g, " ")    // 공백 처리
    .replace(/&amp;/g, "&")     // 특수문자 처리
    .trim();
};

// 3. 실제 데이터를 생성하거나 가져오는 로직 (예시 데이터 포함)
export const NEWS_DATA: NewsItem[] = [
  {
    id: "1",
    date: new Date().toISOString(),
    author: "GPNR Reporter",
    title: {
      en: "Pi Network Mainnet Upgrade to Protocol 22",
      ko: "파이 네트워크 메인넷 프로토콜 22로 업그레이드"
    },
    content: {
      en: "Critical Deadline for Node Operators Approaches...",
      ko: "노드 운영자를 위한 중요한 마감 기한이 다가오고 있습니다..."
    },
    category: "MAINNET",
    // 만약 외부 RSS에서 데이터를 가져온다면 아래처럼 처리하세요
    imageUrl: "https://example.com/pi-image.jpg", 
    source: "MEXC",
    url: "https://news.google.com/..."
  }
];

/**
 * [팁] 만약 Google News RSS 등을 fetch로 가져오고 있다면, 
 * 데이터를 매핑할 때 아래와 같이 적용하세요:
 * * const newsItem = {
 * imageUrl: item.enclosure?.url || extractImageUrl(item.content),
 * content: {
 * ko: cleanText(item.content), // 이제 태그 없이 깨끗한 텍스트만 저장됩니다.
 * en: item.contentSnippet 
 * }
 * }
 */
