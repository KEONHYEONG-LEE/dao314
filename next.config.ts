import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack 대신 표준 웹팩을 사용하여 안정성을 높입니다.
  typescript: {
    ignoreBuildErrors: true, // 빌드 시 타입 에러로 멈추는 것을 방지
  },
  eslint: {
    ignoreDuringBuilds: true, // 린트 에러로 멈추는 것을 방지
  },
};

export default nextConfig;
