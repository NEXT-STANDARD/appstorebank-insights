// サムネイル生成とOGP画像のユーティリティ

export interface ThumbnailOptions {
  title: string
  category: string
  date?: string
  size?: 'og' | 'twitter' | 'thumbnail'
}

// OGP画像のURLを生成
export function generateOGImageUrl(options: ThumbnailOptions): string {
  const { title, category, date } = options
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3004'
  
  const params = new URLSearchParams()
  params.set('title', title)
  params.set('category', category)
  if (date) {
    params.set('date', new Date(date).toLocaleDateString('ja-JP'))
  }
  
  return `${baseUrl}/api/og?${params.toString()}`
}

// カテゴリに応じたデフォルトサムネイル画像を生成
export function getCategoryThumbnail(category: string): string {
  const categoryMap = {
    '市場分析': '📊',
    'グローバルトレンド': '🌏', 
    '法規制': '⚖️',
    '技術解説': '🔧',
    'ニュース': '📰'
  }
  
  const icon = categoryMap[category as keyof typeof categoryMap] || '📋'
  
  // SVGサムネイルを生成
  const svg = `
    <svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f8faff;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#e6f2ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fff0f5;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill="url(#grad)"/>
      <text x="200" y="120" text-anchor="middle" font-size="60" opacity="0.3">${icon}</text>
      <text x="200" y="180" text-anchor="middle" font-size="14" fill="#64748b" font-family="system-ui">${category}</text>
    </svg>
  `
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

// 記事のメタデータを生成
export function generateArticleMetadata(options: ThumbnailOptions & { 
  excerpt?: string
  author?: string 
  tags?: string[]
}) {
  const { title, category, date, excerpt, author = 'AppStoreBank編集部', tags = [] } = options
  const ogImage = generateOGImageUrl(options)
  
  return {
    title,
    description: excerpt || `${category}に関する専門的な分析記事です。`,
    openGraph: {
      title,
      description: excerpt,
      type: 'article',
      publishedTime: date,
      authors: [author],
      tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      siteName: 'AppStoreBank Insights',
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: excerpt,
      images: [ogImage],
      creator: '@AppStoreBank',
    },
    alternates: {
      canonical: `/articles/${options.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')}`,
    },
  }
}

// カテゴリページのメタデータを生成
export function generateCategoryMetadata(category: string) {
  const categoryDescriptions = {
    '市場分析': 'アプリストア市場の詳細な分析、トレンド予測、競合分析をお届けします。',
    'グローバルトレンド': '世界各国のアプリストア規制動向、国際比較、事例研究をご紹介します。',
    '法規制': 'スマホ新法、DMA、独占禁止法など、アプリストア関連の法規制を詳しく解説します。',
    '技術解説': 'アプリストア構築技術、セキュリティ、APIなど技術的な側面を深く掘り下げます。',
    'ニュース': 'アプリストア業界の最新ニュース、企業動向、市場の変化をタイムリーにお伝えします。'
  }
  
  const ogImage = generateOGImageUrl({ 
    title: `${category}の記事一覧`, 
    category,
    date: new Date().toISOString()
  })
  
  return {
    title: `${category} | AppStoreBank Insights`,
    description: categoryDescriptions[category as keyof typeof categoryDescriptions] || `${category}に関する記事一覧です。`,
    openGraph: {
      title: `${category} | AppStoreBank Insights`,
      description: categoryDescriptions[category as keyof typeof categoryDescriptions],
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${category}の記事一覧`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category} | AppStoreBank Insights`,
      description: categoryDescriptions[category as keyof typeof categoryDescriptions],
      images: [ogImage],
    },
  }
}