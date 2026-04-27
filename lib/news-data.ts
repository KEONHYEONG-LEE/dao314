// 1. 인터페이스 정의 (lib/types.ts와 일치시킴)
export interface NewsItem {
  id: string;
  category: string;
  title: string;      
  content: string;    
  author: string;
  publishedAt: string; // date -> publishedAt으로 변경!
  imageUrl?: string;  
  sourceUrl: string;   // url -> sourceUrl으로 변경! (필수값)
  tags: string[];
}

// 2. 실제 데이터 (설계도 규격에 100% 맞춤)
export const NEWS_DATA: NewsItem[] = [
  {
    id: "1",
    category: "MAINNET",
    title: "Pi Network Mainnet Upgrade to Protocol 22",
    content: "Critical Deadline for Node Operators Approaches. Ensure your software is updated.",
    author: "GPNR Reporter",
    publishedAt: "2026-04-25T12:00:00Z", // 규격에 맞는 시간 형식
    imageUrl: "https://cryptopotato.com/wp-content/uploads/2024/03/PiNetwork.jpg", 
    sourceUrl: "https://www.google.com/search?q=Pi+Network+Protocol+22",
    tags: ["MAINNET", "UPGRADE"]
  },
  {
    id: "2",
    category: "COMMUNITY",
    title: "Pi Network Enforces New PiRC1 Rules",
    content: "Shaping Real Utility Standards for the ecosystem.",
    author: "GPNR Reporter",
    publishedAt: "2026-04-25T15:30:00Z",
    imageUrl: "https://cryptopotato.com/wp-content/uploads/2024/01/Pi-Network-Roadmap.jpg", 
    sourceUrl: "https://minepi.com/blog/pirc1-standards/",
    tags: ["COMMUNITY", "UTILITY"]
  }
];
