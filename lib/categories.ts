// lib/categories.ts

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const NEWS_CATEGORIES: Category[] = [
  { id: "all", name: "주요이슈", icon: "📱" }, // 모두 -> 주요이슈
  { id: "mainnet", name: "메인넷", icon: "🌐" },
  { id: "community", name: "커뮤니티", icon: "👥" }, // 지역사회 -> 커뮤니티
  { id: "commerce", name: "커머스", icon: "🛍️" }, // 상업 -> 커머스
  { id: "node", name: "노드", icon: "💻" }, // 마디 -> 노드
  { id: "mining", name: "채굴", icon: "⛏️" }, // 채광 -> 채굴
  { id: "outlook", name: "전망시세", icon: "📈" }, // 목록 -> 전망시세
  { id: "events", name: "주요행사", icon: "📅" }, // 이벤트 -> 주요행사
  { id: "legal", name: "관련법규", icon: "⚖️" }, // 합법적인 -> 관련법규
  { id: "technology", name: "기술", icon: "🛠️" },
  { id: "wallet", name: "지갑", icon: "👛" },
  { id: "app", name: "앱", icon: "📲" },
  { id: "exchange", name: "거래소", icon: "💱" },
  { id: "partnership", name: "파트너십", icon: "🤝" },
  { id: "kyc", name: "KYC", icon: "🆔" },
  { id: "security", name: "보안", icon: "🔒" },
  { id: "whitepaper", name: "백서", icon: "📄" },
  { id: "roadmap", name: "로드맵", icon: "🗺️" }
];
