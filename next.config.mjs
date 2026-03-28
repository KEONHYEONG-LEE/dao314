/** @type {import('next').NextConfig} */
const nextConfig = {
  // React 엄격 모드 활성화 (기존 설정 유지)
  reactStrictMode: true,

  // Pi Browser 환경 및 외부 API 호출을 위한 CORS 및 보안 헤더 설정
  async headers() {
    return [
      {
        // 모든 API 경로에 대해 CORS 허용
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },

  // 추가적인 환경 설정이 필요할 경우 이 아래에 작성하세요.
  // 예: 이미지 도메인 허용, 리다이렉트 등
};

export default nextConfig;
