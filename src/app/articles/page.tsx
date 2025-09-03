import { Metadata } from 'next'
import { Suspense } from 'react'
import ArticlesPageContent from './ArticlesPageContent'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTopButton from '@/components/ScrollToTopButton'

export const metadata: Metadata = {
  title: '記事一覧 | AppStoreBank Insights',
  description: 'アプリストア自由化に関する最新記事、市場分析、法規制情報、技術解説など、すべての記事を一覧でご覧いただけます。',
  openGraph: {
    title: '記事一覧 | AppStoreBank Insights',
    description: 'アプリストア自由化に関する最新記事、市場分析、法規制情報、技術解説',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://insights.appstorebank.com/articles',
    siteName: 'AppStoreBank Insights',
  },
}

export default function ArticlesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Suspense fallback={<div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
          <ArticlesPageContent />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  )
}