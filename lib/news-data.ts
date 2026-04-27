// 1. 인터페이스 정의 (첫 글자 export는 소문자로!)
export interface NewsItem {
  id: string;
  date: string;
  author: string;
  title: string;      
  content: string;    
  category: string;
  imageUrl?: string;  
  source?: string;
  url?: string;       
}

// 2. 실제 데이터 (이미지와 링크가 확실한 샘플로 교체)
export const NEWS_DATA: NewsItem[] = [
  {
    id: "1",
    date: "Sat, 25 Apr 2026", // 날짜도 최신으로 업데이트!
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
    date: "Sat, 25 Apr 2026",
    author: "GPNR Reporter",
    title: "Pi Network Enforces New PiRC1 Rules",
    content: "Shaping Real Utility Standards for the ecosystem.",
    category: "COMMUNITY",
    imageUrl: "https://cryptopotato.com/wp-content/uploads/2024/01/Pi-Network-Roadmap.jpg", 
    source: "Coinmania",
    url: "https://minepi.com/blog/pirc1-standards/" // 예시 실제 주소
  }
];
