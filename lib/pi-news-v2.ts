import { NewsItem } from "./types";

export const NEWS_DATA: NewsItem[] = [
  {
    id: "1",
    category: "ECONOMY",
    title: { 
      ko: "파이 네트워크 오픈 메인넷 전환 준비 완료", 
      en: "Pi Network Ready for Open Mainnet Transition" 
    },
    author: "GPNR Reporter",
    publishedAt: "2026-05-10T01:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000",
    sourceUrl: "https://minepi.com",
    tags: ["PiNetwork", "Mainnet", "Crypto"],
    // [중요] 여기가 전문입니다. 이 데이터가 있어야 UI에 나타납니다.
    content: {
      ko: "파이 네트워크(Pi Network)가 드디어 오픈 메인넷으로의 전환을 위한 최종 단계에 진입했습니다. 이번 업데이트에는 GCV(Global Consensus Value) 트렌드를 반영한 생태계 확장 계획과 노드 운영자들을 위한 최적화 패치가 포함되었습니다.\n\n특히 한국 사용자들의 높은 참여율을 바탕으로 한 P2P 거래 활성화 방안이 논의되고 있으며, 보안 강화를 위한 새로운 지갑 프로토콜도 도입될 예정입니다.",
      en: "Pi Network has finally entered the final stage for transition to the Open Mainnet. This update includes ecosystem expansion plans reflecting GCV trends..."
    }
  },
  {
    id: "2",
    category: "TECH",
    title: { 
      ko: "삼성물산 하이테크 품질 관리 자동화 도입", 
      en: "Samsung C&T Introduces Quality Management Automation" 
    },
    author: "Z-News",
    publishedAt: "2026-05-09T15:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000",
    sourceUrl: "https://www.samsungcnt.com",
    tags: ["Construction", "Quality", "Automation"],
    content: {
      ko: "평택 캠퍼스를 중심으로 삼성물산 하이테크 품질팀은 건설 현장의 안전과 품질을 혁신하기 위한 인공지능 기반 모니터링 시스템을 본격 가동합니다. 이번 시스템은 ISO 9001 기준을 완벽히 준수하며 용접 및 배관 작업의 정밀도를 실시간으로 분석합니다.",
      en: "Samsung C&T High-tech Quality Team is launching an AI-based monitoring system..."
    }
  }
];

