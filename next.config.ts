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
```

Once you save the changes, your hosting service (Vercel) will automatically notice the update and start rebuilding your app. You don't need to press any extra buttons for now.

After it finishes rebuilding (you'll see a green "Ready" status), you can head over to the Pi Browser and go to the **Verify Domain** section to continue.

You're doing great—just one small update and you'll be on your way!

Current Version
Any changes to your app
