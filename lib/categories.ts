// lib/categories.ts

// 타입을 파일 안에서 직접 정의해서 에러를 강제로 해결합니다.
export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const NEWS_CATEGORIES: Category[] = [
  { id: "all", name: "주요이슈", icon: "🔥" },
  { id: "mainnet", name: "메인넷", icon: "🌐" },
  { id: "community", name: "커뮤니티", icon: "👥" },
  { id: "commerce", name: "커머스", icon: "🛍️" },
  { id: "node", name: "노드", icon: "💻" },
  { id: "mining", name: "채굴", icon: "⛏️" },
  { id: "outlook", name: "전망시세", icon: "📈" },
  { id: "events", name: "주요행사", icon: "📅" },
  { id: "legal", name: "관련법규", icon: "⚖️" }
];
