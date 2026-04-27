export interface NewsItem {
  id: string;
  date: string;
  author: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string; // 컴포넌트에서 이 이름을 사용할 것입니다.
  source?: string;
  url?: string;      // 하이퍼링크의 핵심 재료입니다.
}

export const NEWS_DATA: NewsItem[] = [
  {
    id: "1",
    date: "Fri, 24 Apr 2026",
    author: "GPNR Reporter",
    title: "Pi Network Mainnet Upgrade to Protocol 22",
    content: "Critical Deadline for Node Operators Approaches...",
    category: "MAINNET",
    imageUrl: "https://cryptopotato.com/wp-content/uploads/2024/03/PiNetwork.jpg", 
    source: "MEXC",
    url: "https://www.google.com/search?q=Pi+Network+Protocol+22" // 테스트용 실제 주소
  },
  // ... 나머지 데이터도 동일한 필드명 유지
];
