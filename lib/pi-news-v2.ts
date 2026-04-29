/**
 * GPNR (Global Pi Newsroom) 최신 데이터 파일
 * 최종 수정일: 2026-04-30
 * 수정 사항: 17개 카테고리 확장 및 카테고리별 대표 뉴스 데이터 추가
 */

export interface NewsItem {
  id: string;
  category: string;
  title: string;      
  imageUrl?: string;  
  sourceUrl: string;   
  sourceName: string;   
  publishedAt: string;  
  isRead?: boolean;     
  isImportant?: boolean; 
  isLiked?: boolean;    
}

export const NEWS_DATA: NewsItem[] = [
  // 1. 메인넷 (MAINNET)
  {
    id: "gpnr-2026-001",
    category: "메인넷",
    title: "파이 네트워크 메인넷 프로토콜 22 업그레이드 완료",
    sourceName: "크립토포테이토",
    publishedAt: "2026.04.27", 
    imageUrl: "https://cryptopotato.com/wp-content/uploads/2024/03/PiNetwork.jpg", 
    sourceUrl: "https://cryptopotato.com",
    isRead: true, isImportant: true, isLiked: false
  },
  // 2. 지역 사회 (COMMUNITY)
  {
    id: "gpnr-2026-002",
    category: "지역 사회",
    title: "새로운 PiRC1 커뮤니티 거버넌스 규칙 시행",
    sourceName: "마인피 블로그",
    publishedAt: "2026.04.27",
    imageUrl: "https://cryptopotato.com/wp-content/uploads/2024/01/Pi-Network-Roadmap.jpg", 
    sourceUrl: "https://minepi.com",
    isRead: false, isImportant: false, isLiked: true
  },
  // 3. 소식 (NEWS)
  {
    id: "gpnr-2026-003",
    category: "소식",
    title: "파이 네트워크, 컨센서스 2026 공식 후원사 참여",
    sourceName: "GPNR 데스크",
    publishedAt: "2026.04.27",
    imageUrl: "https://picsum.photos/id/1/800/400",
    sourceUrl: "https://pinetwork.com",
    isRead: true, isImportant: true, isLiked: true
  },
  // 4. 상업 (COMMERCE)
  {
    id: "gpnr-2026-004",
    category: "상업",
    title: "전 세계 5만 개 오프라인 매장 파이 결제 도입",
    sourceName: "파이 커머스",
    publishedAt: "2026.04.28",
    imageUrl: "https://picsum.photos/id/20/800/400",
    sourceUrl: "https://pinetwork.com",
    isRead: false, isImportant: true, isLiked: true
  },
  // 5. 마디 (NODE)
  {
    id: "gpnr-2026-005",
    category: "마디",
    title: "파이 노드 0.5.0 버전 업데이트: 안정성 향상",
    sourceName: "파이 코어팀",
    publishedAt: "2026.04.29",
    imageUrl: "https://picsum.photos/id/48/800/400",
    sourceUrl: "https://minepi.com",
    isRead: false, isImportant: false, isLiked: false
  },
  // 6. 채광 (MINING)
  {
    id: "gpnr-2026-006",
    category: "채광",
    title: "5월 기본 채굴률 조정 안내 (반감기 적용)",
    sourceName: "마인피 앱",
    publishedAt: "2026.04.30",
    imageUrl: "https://picsum.photos/id/60/800/400",
    sourceUrl: "https://minepi.com",
    isRead: true, isImportant: true, isLiked: false
  },
  // 7. 생태계 (ECOSYSTEM)
  {
    id: "gpnr-2026-007",
    category: "생태계",
    title: "파이 앱 인큐베이터 프로그램 선정 앱 발표",
    sourceName: "파이 브라우저",
    publishedAt: "2026.04.25",
    imageUrl: "https://picsum.photos/id/160/800/400",
    sourceUrl: "https://minepi.com",
    isRead: false, isImportant: false, isLiked: false
  },
  // 8. 지갑 (WALLET)
  {
    id: "gpnr-2026-008",
    category: "지갑",
    title: "파이 월렛 멀티시그 기능 베타 테스트 시작",
    sourceName: "GPNR 데스크",
    publishedAt: "2026.04.26",
    imageUrl: "https://picsum.photos/id/180/800/400",
    sourceUrl: "https://pinetwork.com",
    isRead: false, isImportant: true, isLiked: false
  },
  // 9. KYC
  {
    id: "gpnr-2026-009",
    category: "KYC",
    title: "대규모 KYC 검증 속도 개선 및 인공지능 알고리즘 강화",
    sourceName: "파이 지원팀",
    publishedAt: "2026.04.24",
    imageUrl: "https://picsum.photos/id/201/800/400",
    sourceUrl: "https://minepi.com",
    isRead: true, isImportant: false, isLiked: false
  },
  // 10. 기술 (TECH)
  {
    id: "gpnr-2026-010",
    category: "기술",
    title: "파이 SDK V3 공개: 개발자 접근성 대폭 강화",
    sourceName: "개발자 포털",
    publishedAt: "2026.04.23",
    imageUrl: "https://picsum.photos/id/250/800/400",
    sourceUrl: "https://pinetwork.com",
    isRead: false, isImportant: true, isLiked: true
  },
  // 11. 보안 (SECURITY)
  {
    id: "gpnr-2026-011",
    category: "보안",
    title: "비밀 구절 피싱 방지를 위한 공식 보안 가이드 배포",
    sourceName: "보안 데스크",
    publishedAt: "2026.04.22",
    imageUrl: "https://picsum.photos/id/281/800/400",
    sourceUrl: "https://minepi.com",
    isRead: true, isImportant: true, isLiked: false
  },
  // 12. 거래소 (EXCHANGE)
  {
    id: "gpnr-2026-012",
    category: "거래소",
    title: "주요 글로벌 거래소의 Pi IOU 상장 현황 보고서",
    sourceName: "코인마켓캡 뉴스",
    publishedAt: "2026.04.21",
    imageUrl: "https://picsum.photos/id/300/800/400",
    sourceUrl: "https://coinmarketcap.com",
    isRead: false, isImportant: false, isLiked: false
  },
  // 13. 이벤트 (EVENT)
  {
    id: "gpnr-2026-013",
    category: "이벤트",
    title: "2026 파이데이(Pi Day) 글로벌 챌린지 결과 발표",
    sourceName: "이벤트 팀",
    publishedAt: "2026.04.20",
    imageUrl: "https://picsum.photos/id/350/800/400",
    sourceUrl: "https://minepi.com",
    isRead: true, isImportant: false, isLiked: true
  },
  // 14. 파트너십 (PARTNERSHIP)
  {
    id: "gpnr-2026-014",
    category: "파트너십",
    title: "글로벌 전자상거래 기업과 파이 결제 연동 파트너십 체결",
    sourceName: "로이터 통신",
    publishedAt: "2026.04.19",
    imageUrl: "https://picsum.photos/id/400/800/400",
    sourceUrl: "https://reuters.com",
    isRead: false, isImportant: true, isLiked: true
  },
  // 15. 법률/정책 (LEGAL)
  {
    id: "gpnr-2026-015",
    category: "법률/정책",
    title: "가상자산 법안(MiCA) 준수를 위한 파이 네트워크의 대응",
    sourceName: "법률 데스크",
    publishedAt: "2026.04.18",
    imageUrl: "https://picsum.photos/id/450/800/400",
    sourceUrl: "https://minepi.com",
    isRead: false, isImportant: false, isLiked: false
  },
  // 16. 교육 (EDUCATION)
  {
    id: "gpnr-2026-016",
    category: "교육",
    title: "초보자를 위한 파이 코인 활용 및 보관 가이드 V2",
    sourceName: "파이 아카데미",
    publishedAt: "2026.04.17",
    imageUrl: "https://picsum.photos/id/500/800/400",
    sourceUrl: "https://pinetwork.com",
    isRead: true, isImportant: false, isLiked: true
  },
  // 17. 기타 (OTHERS)
  {
    id: "gpnr-2026-017",
    category: "기타",
    title: "전 세계 파이 개척자 수 6천만 명 돌파 기념 통계",
    sourceName: "GPNR 데스크",
    publishedAt: "2026.04.16",
    imageUrl: "https://picsum.photos/id/550/800/400",
    sourceUrl: "https://pinetwork.com",
    isRead: false, isImportant: false, isLiked: true
  }
];
