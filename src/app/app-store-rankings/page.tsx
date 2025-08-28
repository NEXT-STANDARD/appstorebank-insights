import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getSupabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'アプリストアランキング | AppStoreBank Insights',
  description: 'アプリストア市場の競争力や利用者数、機能面での比較ランキングをお届けします。',
  keywords: ['アプリストア', 'ランキング', '比較', '市場シェア', 'AppStore', 'Google Play', 'Epic Games Store'],
  openGraph: {
    title: 'アプリストアランキング | AppStoreBank Insights',
    description: 'アプリストア市場の競争力や利用者数、機能面での比較ランキングをお届けします。',
    type: 'website',
    siteName: 'AppStoreBank Insights',
  },
  alternates: {
    canonical: 'https://insights.appstorebank.com/app-store-rankings',
  },
}

interface AppStore {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  website_url: string | null
  status: 'available' | 'coming_soon' | 'planning' | 'discontinued'
  commission_rate: string | null
  features: any
  launch_date: string | null
  company: string | null
  created_at: string
  updated_at: string
}

async function getAppStores(): Promise<AppStore[]> {
  const supabase = getSupabaseAdmin()
  
  if (!supabase) {
    console.error('Supabase client is not available')
    return []
  }

  const { data, error } = await supabase
    .from('app_stores')
    .select('*')
    .in('status', ['available', 'coming_soon'])
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching app stores:', error)
    return []
  }

  return data || []
}

// ランキング基準のスコア計算
function calculateRankingScore(appStore: AppStore): number {
  let score = 0
  
  // 基本スコア（利用可能性）
  if (appStore.status === 'available') score += 50
  else if (appStore.status === 'coming_soon') score += 30
  
  // 手数料の低さでスコア（低いほど高得点）
  if (appStore.commission_rate) {
    const rate = parseFloat(appStore.commission_rate.replace('%', ''))
    if (rate <= 15) score += 30
    else if (rate <= 30) score += 20
    else score += 10
  }
  
  // 機能の充実度
  if (appStore.features && typeof appStore.features === 'object') {
    const featureCount = Object.keys(appStore.features).length
    score += Math.min(featureCount * 2, 20)
  }
  
  return score
}

export default async function AppStoreRankingsPage() {
  const appStores = await getAppStores()
  
  // ランキングスコアでソート
  const rankedStores = appStores
    .map(store => ({
      ...store,
      rankingScore: calculateRankingScore(store)
    }))
    .sort((a, b) => b.rankingScore - a.rankingScore)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">利用可能</span>
      case 'coming_soon':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">近日公開</span>
      case 'planning':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">計画中</span>
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">不明</span>
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="flex items-center justify-center w-8 h-8 bg-yellow-500 text-white font-bold rounded-full">🥇</span>
    if (rank === 2) return <span className="flex items-center justify-center w-8 h-8 bg-gray-400 text-white font-bold rounded-full">🥈</span>
    if (rank === 3) return <span className="flex items-center justify-center w-8 h-8 bg-orange-600 text-white font-bold rounded-full">🥉</span>
    return <span className="flex items-center justify-center w-8 h-8 bg-neutral-200 text-neutral-700 font-bold rounded-full">{rank}</span>
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-neutral-900 mb-6">
              アプリストアランキング
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              競争力、手数料、機能面から総合的に評価したアプリストアのランキングです。開発者にとって最適なプラットフォーム選択の参考にご活用ください。
            </p>
          </div>
        </div>
      </div>

      {/* Rankings Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* ランキング説明 */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">ランキング評価基準</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <div className="font-medium">利用可能性（50点）</div>
              <div>現在利用可能かどうか</div>
            </div>
            <div>
              <div className="font-medium">手数料（30点）</div>
              <div>開発者への手数料の低さ</div>
            </div>
            <div>
              <div className="font-medium">機能充実度（20点）</div>
              <div>提供機能の豊富さ</div>
            </div>
          </div>
        </div>

        {/* ランキングリスト */}
        <div className="space-y-6">
          {rankedStores.map((store, index) => (
            <div
              key={store.id}
              className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                {/* ランク */}
                <div className="flex-shrink-0">
                  {getRankBadge(index + 1)}
                </div>

                {/* ロゴ */}
                <div className="flex-shrink-0">
                  {store.logo_url ? (
                    <img
                      src={store.logo_url}
                      alt={`${store.name} logo`}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🏪</span>
                    </div>
                  )}
                </div>

                {/* 情報 */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                        {store.name}
                        {store.company && (
                          <span className="text-sm text-neutral-500 font-normal ml-2">
                            by {store.company}
                          </span>
                        )}
                      </h3>
                      
                      {store.description && (
                        <p className="text-neutral-600 mb-3 leading-relaxed">
                          {store.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-sm">
                        {getStatusBadge(store.status)}
                        
                        {store.commission_rate && (
                          <span className="text-neutral-600">
                            手数料: <span className="font-semibold">{store.commission_rate}</span>
                          </span>
                        )}
                        
                        {store.launch_date && (
                          <span className="text-neutral-600">
                            開始: {new Date(store.launch_date).getFullYear()}年
                          </span>
                        )}
                      </div>
                    </div>

                    {/* スコア表示 */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        {store.rankingScore}
                      </div>
                      <div className="text-xs text-neutral-500">総合スコア</div>
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="mt-4 flex items-center space-x-3">
                    <Link
                      href={`/app-stores/${store.slug}`}
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      詳細を見る
                    </Link>
                    
                    {store.website_url && (
                      <a
                        href={store.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
                      >
                        公式サイト
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {rankedStores.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              アプリストアデータがありません
            </h3>
            <p className="text-neutral-600">
              現在ランキング表示可能なアプリストアがありません。
            </p>
          </div>
        )}

        {/* 注記 */}
        <div className="mt-12 bg-neutral-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-3">注記</h3>
          <div className="text-sm text-neutral-600 space-y-2">
            <p>• ランキングは当サイト独自の評価基準に基づいており、実際の利用状況や市場シェアとは異なる場合があります。</p>
            <p>• 各アプリストアの詳細情報や最新の手数料については、公式サイトでご確認ください。</p>
            <p>• 新しいアプリストアの情報は随時更新されます。</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}