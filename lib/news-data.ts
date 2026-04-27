export interface NewsItem {
  id: string;
  date: string;
  author: string;
  title: string;      // 이제 단일 문자열입니다.
  content: string;    // 이제 단일 문자열입니다.
  category: string;
  imageUrl?: string;  // image -> imageUrl로 통일
  source?: string;
  url?: string;       // 하이퍼링크 주소
}

export const NEWS_DATA: NewsItem[] = [
  {
    id: "1",
    date: "Fri, 24 Apr 2026",
    author: "GPNR Reporter",
    title: "Pi Network Mainnet Upgrade to Protocol 22",
    content: "Critical Deadline for Node Operators Approaches. Ensure your software is updated.",
    category: "MAINNET",
    imageUrl: "https://cryptopotato.com/wp-content/uploads/2024/03/PiNetwork.jpg", 
    source: "MEXC",
    url: "https://www.google.com/search?q=Pi+Network+Protocol+22" 
  },
  {
    id: "2",
    date: "Fri, 24 Apr 2026",
    author: "GPNR Reporter",
    title: "Pi Network Enforces New PiRC1 Rules",
    content: "Shaping Real Utility Standards for the ecosystem.",
    category: "COMMUNITY",
    imageUrl: "https://example.com/image2.jpg", 
    source: "Coinmania",
    url: "https://www.google.com"
  }
];
