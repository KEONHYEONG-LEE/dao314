/**
 * GPNR (Global Pi Newsroom) 글로벌 설정 파일
 */

export const APP_CONFIG = {
  info: {
    name: "GPNR",
    fullName: "Global Pi Newsroom",
    version: "1.0.0",
    description: "Pi Network의 글로벌 뉴스 및 GCV 트렌드를 17개 카테고리로 제공합니다.",
  },

  messages: {
    welcomeTitle: "Welcome to GPNR",
    welcomeSubtitle: "Global Pi Newsroom에 오신 것을 환영합니다.",
    loadingText: "데이터를 불러오는 중입니다...",
    errorText: "네트워크 연결 상태를 확인해 주세요.",
  },

  theme: {
    primaryColor: "#673AB7",
    secondaryColor: "#FFA000",
    backgroundColor: "#FFFFFF",
    textColor: "#212121",
  },

  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://globalpinews4312.pinet.com",
    timeout: 5000,
    endpoints: {
      // [참고] 위에서 수정한 파일명이 fetch-news.ts이므로 실제 경로에 맞게 체크하세요.
      news: "/api/fetch-news", 
      gcv: "/api/gcv-trends",
      community: "/api/dao-community",
    },
  },

  categories: [
    "General", "GCV", "Tech", "Market", "Community", "Ecosystem", "Nodes"
  ],

  links: {
    github: "https://github.com/KEONHYEONG-LEE/dao314",
    domain: "https://globalpinews4312.pinet.com",
    supportEmail: "support@e-life365.pi",
  },
};

export type AppConfig = typeof APP_CONFIG;
