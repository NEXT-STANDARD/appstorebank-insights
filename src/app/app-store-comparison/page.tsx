import { Metadata } from 'next'
import AppStoreComparisonPage from './AppStoreComparisonPage'

export const metadata: Metadata = {
  title: 'アプリストア手数料比較 2024年最新版 | 個人・小規模開発者向け | AppStoreBank Insights',
  description: 'アプリストアの手数料を徹底比較！App Store 30%、Google Play 15%など主要ストアの手数料率・計算ツール・小規模事業者向け特典を詳しく解説。個人開発者が最も得するストア選びガイド。',
  keywords: 'アプリストア 手数料 比較,アプリストア 手数料 最安,アプリストア 手数料 まとめ,個人開発者 アプリストア,小規模事業者 アプリストア,アプリ 収益化 比較,アプリストア 手数料 計算',
  openGraph: {
    title: 'アプリストア手数料比較 2024年最新版 | 個人・小規模開発者向け',
    description: 'アプリストアの手数料を徹底比較！App Store 30%、Google Play 15%など主要ストアの手数料率・計算ツール・小規模事業者向け特典を詳しく解説。',
    type: 'article',
    images: [
      {
        url: '/images/app-store-comparison-og.png',
        width: 1200,
        height: 630,
        alt: 'アプリストア手数料比較チャート',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'アプリストア手数料比較 2024年最新版',
    description: 'App Store、Google Play等の手数料を徹底比較。個人開発者向け計算ツール付き。',
  },
  alternates: {
    canonical: '/app-store-comparison',
  },
}

export default function Page() {
  return <AppStoreComparisonPage />
}