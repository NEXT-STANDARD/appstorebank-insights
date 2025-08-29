import { Metadata } from 'next'
import Link from 'next/link'
import { Plus, TrendingUp } from 'lucide-react'
import { getTrendingTopics, getNewsTickerItems, getTimelineEvents } from '@/lib/trending'

export const metadata: Metadata = {
  title: 'トレンド管理 | AppStoreBank Insights Admin',
  description: '注目トピック、ニュースティッカー、イベントタイムラインの管理',
}

export default async function TrendingManagementPage() {
  // データベースからデータを取得（実装後）
  // const trendingTopics = await getTrendingTopics()
  // const newsItems = await getNewsTickerItems()
  // const timelineEvents = await getTimelineEvents()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">トレンド管理</h1>
        <p className="text-gray-600">注目トピック、ニュースティッカー、イベントタイムラインを管理します。</p>
      </div>

      {/* 注目トピック管理 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900">注目トピック</h2>
            </div>
            <Link
              href="/admin/trending/topics/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>新規作成</span>
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">HOT</span>
                    <span className="text-sm text-gray-500">市場分析</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">アプリ手数料17%時代の収益モデル</h3>
                  <p className="text-sm text-gray-600 mt-1">手数料引き下げによる開発者への影響と新たなビジネスチャンスを解説</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>👁 15.2K</span>
                    <span>💬 89</span>
                    <span>順序: 1</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">編集</button>
                  <button className="text-red-600 hover:text-red-800 text-sm">削除</button>
                </div>
              </div>
            </div>
            
            <div className="text-center py-8 text-gray-500">
              <p>管理画面からトレンド記事を管理できます。</p>
              <p className="text-sm mt-2">現在はサンプルデータを表示しています。</p>
            </div>
          </div>
        </div>
      </div>

      {/* ニュースティッカー管理 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">ニュースティッカー</h2>
            <Link
              href="/admin/trending/news/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>新規作成</span>
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="w-4 h-4 text-red-500">⚖️</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">法規制</span>
                <span className="text-sm">🎌 スマートフォン新法が2025年4月より施行開始</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">順序: 1</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm">編集</button>
              </div>
            </div>
            
            <div className="text-center py-8 text-gray-500">
              <p>ニュースティッカーの項目を管理できます。</p>
              <p className="text-sm mt-2">自動ローテーション表示の設定も可能です。</p>
            </div>
          </div>
        </div>
      </div>

      {/* イベントタイムライン管理 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">イベントタイムライン</h2>
            <Link
              href="/admin/trending/events/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>新規作成</span>
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 border-l-4 border-red-500 bg-red-50 rounded-lg">
              <span className="text-2xl">⚖️</span>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs text-gray-600">2025-04-01</span>
                  <span className="text-xs text-red-600 font-semibold">残り214日</span>
                </div>
                <h3 className="font-semibold">スマートフォン新法施行</h3>
                <p className="text-sm text-gray-600">アプリストア自由化の完全実施</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm">編集</button>
            </div>
            
            <div className="text-center py-8 text-gray-500">
              <p>重要な業界イベントの日程を管理できます。</p>
              <p className="text-sm mt-2">自動的に残り日数が計算されます。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 週間レポート管理 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">週間トレンドレポート</h2>
            <Link
              href="/admin/trending/reports/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>新規作成</span>
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <p>週間トレンドレポートを作成・管理できます。</p>
            <p className="text-sm mt-2">人気記事をまとめた特別レポートを配信しましょう。</p>
          </div>
        </div>
      </div>
    </div>
  )
}