'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { BarChart3, Users, Eye, Clock, TrendingUp, Globe, MousePointer, Zap, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'

interface AnalyticsData {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  totalViews: number
  featuredArticles: number
  premiumArticles: number
}

interface GAOverviewData {
  totalUsers: number
  newUsers: number
  sessions: number
  bounceRate: number
  averageSessionDuration: number
  pageViews: number
  formattedBounceRate: string
  formattedAverageSessionDuration: string
}

interface GAPageData {
  path: string
  title: string
  views: number
  shortPath: string
  shortTitle: string
  formattedAverageTimeOnPage: string
}

interface GASourceData {
  source: string
  medium: string
  users: number
  sessions: number
  displaySource: string
  displayMedium: string
  formattedBounceRate: string
}

interface GATimeSeriesData {
  date: string
  users: number
  sessions: number
  pageViews: number
  formattedDate: string
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [gaOverview, setGAOverview] = useState<GAOverviewData | null>(null)
  const [gaPages, setGAPages] = useState<GAPageData[]>([])
  const [gaSources, setGASources] = useState<GASourceData[]>([])
  const [gaTimeSeries, setGATimeSeries] = useState<GATimeSeriesData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [gaLoading, setGALoading] = useState(false)
  const [gaError, setGAError] = useState<string | null>(null)
  const [gaConnected, setGAConnected] = useState<boolean | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('7days')
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'sources' | 'trends'>('overview')

  useEffect(() => {
    loadAnalytics()
    testGAConnection()
  }, [])

  useEffect(() => {
    if (gaConnected) {
      loadGAData()
    }
  }, [selectedPeriod, gaConnected])

  const loadAnalytics = async () => {
    try {
      if (!supabase) return
      
      // 記事統計を取得
      const { data: articlesData } = await supabase
        .from('articles')
        .select('status, is_featured, is_premium')

      // 総閲覧数を取得（article_viewsテーブルから）
      const { count: totalViews } = await supabase
        .from('article_views')
        .select('*', { count: 'exact', head: true })

      if (articlesData) {
        const totalArticles = articlesData.length
        const publishedArticles = articlesData.filter(a => a.status === 'published').length
        const draftArticles = articlesData.filter(a => a.status === 'draft').length
        const featuredArticles = articlesData.filter(a => a.is_featured).length
        const premiumArticles = articlesData.filter(a => a.is_premium).length

        setAnalytics({
          totalArticles,
          publishedArticles,
          draftArticles,
          totalViews: totalViews || 0,
          featuredArticles,
          premiumArticles
        })
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const testGAConnection = async () => {
    try {
      const response = await fetch('/api/admin/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'test_connection' })
      })
      const data = await response.json()
      setGAConnected(data.connected)
      if (!data.connected) {
        setGAError(data.error || 'Google Analytics接続に失敗しました')
      }
    } catch (error) {
      console.error('GA connection test failed:', error)
      setGAConnected(false)
      setGAError('Google Analytics接続テストでエラーが発生しました')
    }
  }

  const loadGAData = async () => {
    setGALoading(true)
    setGAError(null)

    try {
      // Overview データ
      const overviewResponse = await fetch(`/api/admin/analytics?type=overview&period=${selectedPeriod}`, {
        credentials: 'include'
      })
      const overviewData = await overviewResponse.json()
      
      if (overviewData.success) {
        setGAOverview(overviewData.data)
      } else {
        setGAError(overviewData.error)
      }

      // Pages データ
      const pagesResponse = await fetch(`/api/admin/analytics?type=pages&period=${selectedPeriod}`, {
        credentials: 'include'
      })
      const pagesData = await pagesResponse.json()
      
      if (pagesData.success) {
        setGAPages(pagesData.data.slice(0, 10)) // Top 10のみ
      }

      // Traffic Sources データ
      const sourcesResponse = await fetch(`/api/admin/analytics?type=sources&period=${selectedPeriod}`, {
        credentials: 'include'
      })
      const sourcesData = await sourcesResponse.json()
      
      if (sourcesData.success) {
        setGASources(sourcesData.data.slice(0, 8)) // Top 8のみ
      }

      // Time Series データ
      const timeSeriesResponse = await fetch(`/api/admin/analytics?type=timeseries&period=${selectedPeriod}`, {
        credentials: 'include'
      })
      const timeSeriesData = await timeSeriesResponse.json()
      
      if (timeSeriesData.success) {
        setGATimeSeries(timeSeriesData.data)
      }

    } catch (error) {
      console.error('Error loading GA data:', error)
      setGAError('Google Analyticsデータの読み込みに失敗しました')
    } finally {
      setGALoading(false)
    }
  }

  const refreshGAData = () => {
    if (gaConnected) {
      loadGAData()
    }
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case '7days': return '過去7日間'
      case '30days': return '過去30日間'
      case '90days': return '過去90日間'
      default: return '過去7日間'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-neutral-900">アナリティクス</h1>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              <option value="7days">過去7日間</option>
              <option value="30days">過去30日間</option>
              <option value="90days">過去90日間</option>
            </select>
            <button
              onClick={refreshGAData}
              disabled={gaLoading || !gaConnected}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${gaLoading ? 'animate-spin' : ''}`} />
              <span>更新</span>
            </button>
          </div>
        </div>

        {/* Google Analytics接続状況 */}
        <div className={`p-4 rounded-lg border ${gaConnected 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-yellow-50 border-yellow-200 text-yellow-800'
        }`}>
          <div className="flex items-center space-x-3">
            {gaConnected ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <div>
              <p className="font-medium">
                {gaConnected 
                  ? `Google Analytics 4 接続済み - ${getPeriodLabel(selectedPeriod)}` 
                  : 'Google Analytics 4 未設定'
                }
              </p>
              {gaError && <p className="text-sm mt-1">{gaError}</p>}
            </div>
          </div>
        </div>

        {/* 内部統計（記事データ） */}
        {analytics && (
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">サイト統計</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-neutral-700">総記事数</h3>
                    <p className="text-2xl font-bold text-neutral-900">{analytics.totalArticles}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-neutral-700">公開記事</h3>
                    <p className="text-2xl font-bold text-neutral-900">{analytics.publishedArticles}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Eye className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-neutral-700">総閲覧数</h3>
                    <p className="text-2xl font-bold text-neutral-900">{analytics.totalViews.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Google Analytics データ */}
        {gaConnected && (
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Google Analytics 4 データ</h2>
            
            {/* GA概要データ */}
            {gaOverview && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-neutral-800 mb-4">アクセス概要</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-neutral-700">ユーザー数</h4>
                        <p className="text-2xl font-bold text-neutral-900">{formatNumber(gaOverview.totalUsers)}</p>
                        <p className="text-xs text-neutral-500">新規: {formatNumber(gaOverview.newUsers)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <MousePointer className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-neutral-700">セッション数</h4>
                        <p className="text-2xl font-bold text-neutral-900">{formatNumber(gaOverview.sessions)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Eye className="w-5 h-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-neutral-700">ページビュー</h4>
                        <p className="text-2xl font-bold text-neutral-900">{formatNumber(gaOverview.pageViews)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-orange-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-neutral-700">平均滞在時間</h4>
                        <p className="text-2xl font-bold text-neutral-900">{gaOverview.formattedAverageSessionDuration}</p>
                        <p className="text-xs text-neutral-500">直帰率: {gaOverview.formattedBounceRate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* タブ切り替え */}
            <div className="border-b border-neutral-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('pages')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'pages'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  人気ページ
                </button>
                <button
                  onClick={() => setActiveTab('sources')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'sources'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  トラフィック元
                </button>
              </nav>
            </div>

            {/* 人気ページ */}
            {activeTab === 'pages' && gaPages.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                <div className="px-6 py-4 border-b border-neutral-200">
                  <h3 className="text-lg font-medium text-neutral-900">人気ページ Top 10</h3>
                </div>
                <div className="divide-y divide-neutral-200">
                  {gaPages.map((page, index) => (
                    <div key={index} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {page.shortTitle || page.shortPath}
                          </p>
                          <p className="text-xs text-neutral-500 truncate">{page.shortPath}</p>
                        </div>
                        <div className="flex items-center space-x-4 ml-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-neutral-900">{formatNumber(page.views)}</p>
                            <p className="text-xs text-neutral-500">ページビュー</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-neutral-600">{page.formattedAverageTimeOnPage}</p>
                            <p className="text-xs text-neutral-500">平均滞在時間</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* トラフィック元 */}
            {activeTab === 'sources' && gaSources.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                <div className="px-6 py-4 border-b border-neutral-200">
                  <h3 className="text-lg font-medium text-neutral-900">トラフィック元 Top 8</h3>
                </div>
                <div className="divide-y divide-neutral-200">
                  {gaSources.map((source, index) => (
                    <div key={index} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900">
                            {source.displaySource}
                          </p>
                          <p className="text-xs text-neutral-500">{source.displayMedium}</p>
                        </div>
                        <div className="flex items-center space-x-6 ml-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-neutral-900">{formatNumber(source.users)}</p>
                            <p className="text-xs text-neutral-500">ユーザー</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-neutral-600">{formatNumber(source.sessions)}</p>
                            <p className="text-xs text-neutral-500">セッション</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-neutral-600">{source.formattedBounceRate}</p>
                            <p className="text-xs text-neutral-500">直帰率</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {gaLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-neutral-600">Google Analyticsデータを読み込み中...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}