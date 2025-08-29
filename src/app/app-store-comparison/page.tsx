import { Metadata } from 'next'
import AppStoreComparisonPage from './AppStoreComparisonPage'

export const metadata: Metadata = {
  title: 'アプリストア詳細比較 | AppStoreBank Insights',
  description: '主要アプリストアの手数料、機能、対応デバイスを詳細比較。開発者向けの選び方ガイド付き。',
  openGraph: {
    title: 'アプリストア詳細比較 | AppStoreBank Insights',
    description: '主要アプリストアの手数料、機能、対応デバイスを詳細比較。開発者向けの選び方ガイド付き。',
    type: 'article',
  },
}

export default function Page() {
  return <AppStoreComparisonPage />
}