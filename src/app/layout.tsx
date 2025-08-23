import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AppStoreBank Insights - 業界洞察メディア',
    template: '%s | AppStoreBank Insights'
  },
  description: 'アプリストア業界の専門的な洞察とトレンド分析。市場分析、グローバルトレンド、法規制解説、技術深層解説を提供。',
  keywords: [
    'アプリストア',
    '市場分析', 
    '業界トレンド',
    'スマホ新法',
    'アプリ市場',
    'インサイト'
  ],
  authors: [{ name: 'AppStoreBank' }],
  creator: 'AppStoreBank',
  openGraph: {
    title: 'AppStoreBank Insights - 業界洞察メディア',
    description: 'アプリストア業界の専門的な洞察とトレンド分析',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://insights.appstorebank.com',
    siteName: 'AppStoreBank Insights',
    images: [
      {
        url: '/api/og?title=AppStoreBank Insights&category=業界洞察メディア',
        width: 1200,
        height: 630,
        alt: 'AppStoreBank Insights - 業界洞察メディア',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AppStoreBank Insights',
    description: 'アプリストア業界の専門的な洞察とトレンド分析',
    images: ['/api/og?title=AppStoreBank Insights&category=業界洞察メディア'],
    creator: '@AppStoreBank',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Consoleなどの認証は後で追加
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen bg-light-gradient" suppressHydrationWarning>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}