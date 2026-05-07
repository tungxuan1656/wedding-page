import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['tx-va-wedding.vercel.app', '100.116.7.43'],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
}

export default nextConfig
