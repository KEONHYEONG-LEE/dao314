import { NewsItem } from "./types";

// raw 데이터 정의 (기존 데이터 구조 유지)
const rawNewsData: NewsItem[] = [
  {
    id: "1",
    category: "ECONOMY",
    title: { 
      ko: "파이 네트워크 오픈 메인넷 전환 준비 완료", 
      en: "Pi Network Ready for Open Mainnet Transition" 
    },
    author: "GPNR Reporter",
    publishedAt: "2026-05-10T01:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800",
    sourceUrl: "https://minepi.com",
    tags: ["PiNetwork", "Mainnet", "Crypto"],
    content: {
      ko: "파이 네트워크(Pi Network)가 오픈 메인넷 전환을 위한 최종 점검 단계에 진입했습니다. 이번 업데이트에는 글로벌 커뮤니티의 생태계 확장 계획과 노드 운영 환경 최적화 패치가 포함되었습니다. 특히 보안을 강화한 새로운 지갑 프로토콜 연동 및 안정적인 P2P 거래 활성화 방안이 함께 논의되고 있습니다.",
      en: "Pi Network has entered the final stage for transition to the Open Mainnet. This update includes ecosystem expansion plans and node optimization patches."
    },
    readCount: 0,
    starCount: 0,
    likeCount: 0
  },
  {
    id: "2",
    category: "TECH",
    title: { 
      ko: "글로벌 파이 생태계 앱 연동 및 인터페이스 개선", 
      en: "Global Pi Ecosystem App Integration and Interface Improvements" 
    },
    author: "GPNR Tech",
    publishedAt: "2026-05-09T15:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800",
    sourceUrl: "https://minepi.com",
    tags: ["Ecosystem", "PiBrowser", "Tech"],
    content: {
      ko: "파이 브라우저(Pi Browser) 인터페이스 리뉴얼과 함께 주요 유틸리티 앱들의 메인넷 API 마이그레이션이 가속화되고 있습니다. 사용자 경험을 극대화하기 위한 로딩 속도 최적화 및 다국어 지원 모듈이 추가되어 글로벌 파이오니어들의 접근성이 한층 향상되었습니다.",
      en: "The migration of utility apps to the mainnet API is accelerating along with the Pi Browser interface renewal."
    },
    readCount: 0,
    starCount: 0,
    likeCount: 0
  }
];

// ---------------------------------------------------------------------------
// 🚨 핵심 검증 및 정렬 안전 처리 로직
// ---------------------------------------------------------------------------

// 이미지 URL 유효성 검사 (http://, https://, / 로 시작하지 않거나 텍스트가 들어온 경우 차단)
const isValidUrl = (url?: string) => {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
};

// 뉴스 데이터를 최신순 정렬 및 imageUrl 안전 처리 후 export
export const NEWS_DATA: NewsItem[] = [...rawNewsData]
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  .map((item) => ({
    ...item,
    // imageUrl이 유효한 이미지 링크가 아닐 경우 undefined로 처리하여 텍스트 출력을 방지
    imageUrl: isValidUrl(item.imageUrl) ? item.imageUrl : undefined,
  }));
