import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/.well-known/pi-domain-validation.txt",
        destination: "/api/validation",
      },
      {
        source: "/validation-key.txt",
        destination: "/api/validation",
      },
      {
        source: "/dao314/validation-key.txt",
        destination: "/api/validation",
      },
    ]
  },
}

export default nextConfig
