/**
 * GPNR (Global Pi Newsroom) 최신 데이터 파일
 * 최종 수정일: 2026-04-30 (레이아웃 개편 및 메타 데이터 추가)
 */

export interface NewsItem {
  id: string;
  category: string;
  title: string;      
  // content: string; // 카드 레이아웃에서 텍스트가 왼쪽으로 가면서 공간이 좁아지므로, 요약문은 일단 제외하거나 제목에 집중합니다.
  imageUrl?: string;  
  sourceUrl: string;   
  sourceName: string;   // 1. 출처 표시용 (추가)
  publishedAt: string;  // 2. 연도.날짜 표시용
  isRead?: boolean;     // 3. 읽음 표시 (체크)
  isImportant?: boolean; // 4. 중요 (별)
  isLiked?: boolean;    // 5. 좋아요 (하트)
  // tags: string[];    // 불필요한 파일/데이터 정리 차원에서 일단 제외
}

export const NEWS_DATA: NewsItem[] = [
  {
    id: "gpnr-2026-001",
    category: "MAINNET",
    title: "Pi Network Mainnet Upgrade to Protocol 22",
    sourceName: "CryptoPotato",
    publishedAt: "2026.04.27", 
    imageUrl: "https://cryptopotato.com/wp-content/uploads/2024/03/PiNetwork.jpg", 
    sourceUrl: "https://www.google.com/search?q=Pi+Network+Protocol+22",
    isRead: true,
    isImportant: true,
    isLiked: false
  },
  {
    id: "gpnr-2026-002",
    category: "COMMUNITY",
    title: "Pi Network Enforces New PiRC1 Rules",
    sourceName: "MinePi Blog",
    publishedAt: "2026.04.27",
    imageUrl: "https://cryptopotato.com/wp-content/uploads/2024/01/Pi-Network-Roadmap.jpg", 
    sourceUrl: "https://minepi.com/blog/pirc1-standards/",
    isRead: false,
    isImportant: false,
    isLiked: true
  },
  {
    id: "gpnr-2026-003",
    category: "NEWS",
    title: "Pi Network to Sponsor Consensus 2026",
    sourceName: "GPNR Desk",
    publishedAt: "2026.04.27",
    imageUrl: "https://picsum.photos/id/1/800/400",
    sourceUrl: "https://pinetwork.com",
    isRead: true,
    isImportant: true,
    isLiked: true
  }
];
