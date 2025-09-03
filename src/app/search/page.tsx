import { Metadata } from 'next'
import { Suspense } from 'react'
import SearchPageContent from './SearchPageContent'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTopButton from '@/components/ScrollToTopButton'

export const metadata: Metadata = {
  title: '記事検索 | AppStoreBank Insights',
  description: 'アプリストア自由化に関する記事を検索できます。タイトル、内容、カテゴリから関連記事をお探しください。',
  openGraph: {
    title: '記事検索 | AppStoreBank Insights',
    description: 'アプリストア自由化に関する記事を検索できます',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://insights.appstorebank.com/search',
    siteName: 'AppStoreBank Insights',
  },
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Suspense fallback={<div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
          <SearchPageContent />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  )
}