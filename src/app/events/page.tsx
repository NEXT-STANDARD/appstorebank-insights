import { Metadata } from 'next'
import EventsPageContent from './EventsPageContent'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTopButton from '@/components/ScrollToTopButton'

export const metadata: Metadata = {
  title: '重要日程・イベントカレンダー | AppStoreBank Insights',
  description: 'アプリストア自由化に関する重要日程、法規制施行スケジュール、業界イベント、カンファレンス情報をタイムライン形式で掲載。',
  openGraph: {
    title: '重要日程・イベントカレンダー | AppStoreBank Insights',
    description: 'アプリストア自由化に関する重要日程、法規制施行スケジュール、業界イベント、カンファレンス情報をタイムライン形式で掲載。',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://insights.appstorebank.com/events',
    siteName: 'AppStoreBank Insights',
  },
}

export default function EventsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <EventsPageContent />
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  )
}