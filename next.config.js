/** @type {import('next').NextConfig} */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

const nextConfig = {
  // App Router は Next.js 13.4+ ではデフォルトで有効
  
  // MDX対応
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  
  // 画像最適化
  images: {
    domains: ['qczwbwhbxyrwasauxhwy.supabase.co'], // Supabase Storage
    formats: ['image/webp', 'image/avif'],
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
  
  // Headers設定（セキュリティ）
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
        ],
      },
    ]
  },
  
  // リダイレクト設定
  async redirects() {
    return [
      // 旧URLから新URLへのリダイレクト（将来用）
    ]
  },
}

module.exports = withMDX(nextConfig)