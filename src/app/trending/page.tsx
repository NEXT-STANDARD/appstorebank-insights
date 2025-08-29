import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TrendingTopicsFullPage from '@/components/TrendingTopicsFullPage'

export const metadata: Metadata = {
  title: 'トレンド記事一覧 | AppStoreBank Insights',
  description: 'アプリストア自由化に関する最新のトレンド記事。人気急上昇、注目トピック、新着記事をまとめてチェック。',
  keywords: ['アプリストア', '自由化', 'トレンド', '人気記事', '注目', '最新'],
  openGraph: {
    title: 'トレンド記事一覧 | AppStoreBank Insights',
    description: 'アプリストア自由化に関する最新のトレンド記事。人気急上昇、注目トピック、新着記事をまとめてチェック。',
    type: 'website',
  },
}

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">トレンド記事一覧</h1>
          <p className="text-gray-600">
            アプリストア自由化に関する最新のトレンド記事をまとめています。
            人気急上昇の記事から新着注目記事まで、今読むべき記事をチェックしましょう。
          </p>
        </div>

        <TrendingTopicsFullPage />
      </main>

      <Footer />
    </div>
  )
}