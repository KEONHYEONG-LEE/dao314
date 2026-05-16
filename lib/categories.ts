// lib/categories.ts

export interface Category {
  id: string;
  name: string;
  icon: string;
  group: 'core' | 'ecosystem' | 'market_legal' | 'utility'; // 후속 그리드 UI 배치 및 색상 분할을 위한 그룹 지정
}

export const NEWS_CATEGORIES: Category[] = [
  // 1. 코어 네트워크 (Core Network)
  { id: "all", name: "주요뉴스", icon: "🔥", group: "core" }, 
  { id: "mainnet", name: "메인넷", icon: "🌐", group: "core" },
  { id: "node", name: "노드", icon: "🖥️", group: "core" },
  { id: "mining", name: "채굴", icon: "⚡", group: "core" },
  { id: "wallet", name: "지갑", icon: "👛", group: "core" },
  { id: "browser", name: "브라우저", icon: "🧭", group: "core" },
  { id: "roadmap", name: "로드맵", icon: "🎯", group: "core" },
  { id: "whitepaper", name: "백서", icon: "📜", group: "core" },

  // 2. 생태계 (Ecosystem)
  { id: "community", name: "커뮤니티", icon: "👥", group: "ecosystem" },
  { id: "commerce", name: "커머스", icon: "🛒", group: "ecosystem" },
  { id: "kyc", name: "KYC", icon: "🆔", group: "ecosystem" },
  { id: "developer", name: "개발자", icon: "👨‍💻", group: "ecosystem" },
  { id: "ecosystem", name: "생태계", icon: "🌱", group: "ecosystem" },

  // 3. 마켓 및 보안 (Market & Legal)
  { id: "outlook", name: "전망시세", icon: "📊", group: "market_legal" },
  { id: "price", name: "가격", icon: "🪙", group: "market_legal" },
  { id: "security", name: "보안", icon: "🛡️", group: "market_legal" },
  { id: "events", name: "주요행사", icon: "📢", group: "market_legal" },
  { id: "legal", name: "관련법규", icon: "⚖️", group: "market_legal" },

  // 4. 특수 내비게이션 (그리드 메뉴 전용)
  { id: "calendar", name: "달력", icon: "📅", group: "utility" }
];
