/**
 * GPNR (Global Pi Newsroom) 최신 데이터 파일
 * 최종 수정일: 2026-04-27 (Vercel 캐시 갱신용)
 */

export interface NewsItem {
  id: string;
  category: string;
  title: string;      
  content: string;    
  author: string;
  publishedAt: string; // 시간 표시용 (필수)
  imageUrl?: string;  
  sourceUrl: string;   // 하이퍼링크용 (필수)
  tags: string[];
}

export const NEWS_DATA: NewsItem[] = [
  {
    id: "gpnr-2026-001",
    category: "MAINNET",
    title: "Pi Network Mainnet Upgrade to Protocol 22",
    content: "Critical Deadline for Node Operators Approaches. Ensure your software is updated for the upcoming mainnet transition.",
    author: "GPNR Editor",
    publishedAt: "2026-04-27T10:00:00Z", 
    imageUrl: "https://cryptopotato.com/wp-content/uploads/2024/03/PiNetwork.jpg", 
    sourceUrl: "https://www.google.com/search?q=Pi+Network+Protocol+22",
    tags: ["MAINNET", "PROTOCOL"]
  },
  {
    id: "gpnr-2026-002",
    category: "COMMUNITY",
    title: "Pi Network Enforces New PiRC1 Rules",
    content: "Shaping Real Utility Standards for the ecosystem. New guidelines for decentralized applications have been released.",
    author: "GPNR Reporter",
    publishedAt: "2026-04-27T14:30:00Z",
    imageUrl: "https://cryptopotato.com/wp-content/uploads/2024/01/Pi-Network-Roadmap.jpg", 
    sourceUrl: "https://minepi.com/blog/pirc1-standards/",
    tags: ["COMMUNITY", "UTILITY"]
  },
  {
    id: "gpnr-2026-003",
    category: "NEWS",
    title: "Pi Network to Sponsor Consensus 2026",
    content: "Major Strategy Update Speculation grows as the ecosystem expands its global presence.",
    author: "GPNR News Desk",
    publishedAt: "2026-04-27T18:00:00Z",
    imageUrl: "https://picsum.photos/id/1/800/400",
    sourceUrl: "https://pinetwork.com",
    tags: ["STRATEGY", "EVENT"]
  }
];
