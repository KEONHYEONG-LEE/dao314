import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 여기에 설정 옵션을 추가하세요 */
  reactStrictMode: true,
  // Pi Browser 환경에서 발생할 수 있는 CORS나 보안 정책 대응을 위한 설정
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
        ],
      },
    ];
  },
};

export default nextConfig;
