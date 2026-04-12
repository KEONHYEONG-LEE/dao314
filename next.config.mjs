/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. App Router 기능을 강제로 비활성화 (Pages Router만 사용하도록 설정)
  experimental: {
    appDir: false,
  },
  
  // 2. 이미지 호스트 허용 설정
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'news.google.com' },
    ],
  },
  
  // 3. 기존 Pi Network 검증 로직 유지
  async rewrites() {
    return [
      {
        source: "/validation-key.txt",
        destination: "/api/pi-validation",
      },
      {
        source: "/.well-known/pi-domain-validation.txt",
        destination: "/api/pi-validation",
      },
    ];
  },
};

export default nextConfig;
