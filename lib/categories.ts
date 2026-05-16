// lib/categories.ts

export interface Category {
  id: string;
  name: string;
  icon: string;
  group: 'core' | 'ecosystem' | 'market_legal'; // 사용하지 않는 utility 그룹 배제
}

export const NEWS_CATEGORIES: Category[] = [
  // 1. 코어 네트워크 (Core Network) - 구글 번역 오작동 방지 라벨 지정
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
  { id: "ecosystem", name: "부동산", icon: "🌱", group: "ecosystem" }, // [통일] UI 일관성을 위해 부동산으로 매핑 고정

  // 3. 마켓 및 보안 (Market & Legal)
  { id: "outlook", name: "전망시세", icon: "📊", group: "market_legal" },
  { id: "price", name: "가격", icon: "🪙", group: "market_legal" },
  { id: "security", name: "보안", icon: "🛡️", group: "market_legal" },
  { id: "legal", name: "관련법규", icon: "⚖️", group: "market_legal" }
];
