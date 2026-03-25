import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 빌드 시 lint 에러가 있어도 배포를 진행하고 싶다면 true로 설정 (선택 사항)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
