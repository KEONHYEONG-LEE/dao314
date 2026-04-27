/**
 * GPNR (Global Pi Newsroom) 데이터 타입 정의 파일
 * 다국어(KO/EN) 지원 및 하이퍼링크 유실 방지를 위한 규격 수정
 */

export interface NewsItem {
  id: string;
  category: string;
  // 번역된 텍스트를 담을 수 있도록 구조 변경
  title: string | { ko: string; en: string }; 
  content: string | { ko: string; en: string };
  author: string;
  publishedAt: string; // 기사 작성 시간
  imageUrl?: string;
  sourceUrl: string;   // 출처 링크 (필수 항목으로 변경하여 누락 방지)
  tags: string[];
}

// 나머지 UserProfile, ChatMessage 등은 기존과 동일하게 유지하셔도 됩니다.
