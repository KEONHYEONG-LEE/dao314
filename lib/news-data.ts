// lib/news-data.ts 수정안

export interface NewsItem {
  id: string;
  date: string;
  author: string;
  // 여러 언어를 지원하도록 구조를 명확히 합니다.
  title: {
    en: string;
    ko: string; // 한국어 제목 필드 추가
  };
  content: {
    en: string;
    ko: string; // 한국어 내용 필드 추가
  };
  category: string;
  imageUrl?: string; // 스크린샷에 이미지가 있으니 추가해두면 좋습니다.
  source?: string;
}

export const NEWS_DATA: NewsItem[] = [];
