import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable Next.js 16 cache components feature
  cacheComponents: true,
  // Configure Turbopack root directory
  turbopack: {
    root: __dirname,
  },
  // Configure image domains for Strapi
  images: {
    // Disable image optimization for localhost in development
    ...(process.env.NODE_ENV === 'development' && {
      unoptimized: true,
    }),
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.strapi.io',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.strapiapp.com',
      },
    ],
  },
  // Disable static export to enable server-side features like authentication
  // output: 'export',
  // trailingSlash: true,
}

export default nextConfig
