import { Metadata } from 'next'
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
        <SearchPageContent />
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  )
}