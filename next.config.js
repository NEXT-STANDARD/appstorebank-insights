/** @type {import('next').NextConfig} */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

const nextConfig = {
  // App Router は Next.js 13.4+ では標準
  
  // MDX対応
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  
  // 画像最適化
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qczwbwhbxyrwasauxhwy.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // TypeScript設定
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint設定
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // 環境変数
  env: {
    CUSTOM_KEY: 'appstorebank-insights',
  },
  
  // Headers設定（セキュリティ + SSL）
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https: https://www.google-analytics.com https://analytics.google.com;",
          },
        ],
      },
    ]
  },
  
  // リダイレクト設定（HTTPS強制）
  async redirects() {
    return [
      // HTTP to HTTPS redirect in production
      ...(process.env.NODE_ENV === 'production' 
        ? [
            {
              source: '/:path*',
              has: [
                {
                  type: 'header',
                  key: 'x-forwarded-proto',
                  value: 'http',
                },
              ],
              destination: 'https://insights.appstorebank.com/:path*',
              permanent: true,
            },
          ]
        : []),
    ]
  },
}

module.exports = withMDX(nextConfig)