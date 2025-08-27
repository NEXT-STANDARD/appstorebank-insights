import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import StructuredData from '@/components/StructuredData'
import GoogleAnalyticsWrapper from '@/components/GoogleAnalyticsWrapper'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://insights.appstorebank.com'),
  title: {
    default: 'AppStoreBank Insights - アプリストア自由化・第三者アプリストア専門メディア',
    template: '%s | AppStoreBank Insights'
  },
  description: 'アプリストア自由化、第三者アプリストア参入の最新情報。2025年12月スマホ新法施行に向けた市場分析・技術解説・法規制情報を専門家が提供。',
  keywords: [
    'アプリストア自由化',
    '第三者アプリストア',
    'スマホ新法',
    'アプリストア競争',
    'アプリストア比較',
    'アプリストアレビュー',
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
    title: 'AppStoreBank Insights - アプリストア業界の専門メディア',
    description: 'アプリストア業界の最新トレンド、市場分析、法規制解説を提供',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://insights.appstorebank.com',
    siteName: 'AppStoreBank Insights',
    images: [
      {
        url: '/api/og?title=アプリストア業界の専門メディア&category=業界洞察',
        width: 1200,
        height: 630,
        alt: 'AppStoreBank Insights - アプリストア業界の専門メディア',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AppStoreBank Insights - アプリストア業界の専門メディア',
    description: 'アプリストア業界の最新トレンド、市場分析、法規制解説を提供',
    images: ['/api/og?title=アプリストア業界の専門メディア&category=業界洞察'],
    creator: '@AppStoreBank',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
        {/* Google Analytics */}
        <GoogleAnalyticsWrapper />
        
        <StructuredData type="website" />
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}