'use client'

import { useState, useEffect } from 'react'
import { getPublishedArticles } from '@/lib/articles'
import { supabase } from '@/lib/supabase'

interface AnalyticsData {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  totalViews: number
  featuredArticles: number
  premiumArticles: number
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      // 記事統計を取得
      const { data: articlesData } = await supabase
        .from('articles')
        .select('status, view_count, is_featured, is_premium')

      if (articlesData) {
        const totalArticles = articlesData.length
        const publishedArticles = articlesData.filter(a => a.status === 'published').length
        const draftArticles = articlesData.filter(a => a.status === 'draft').length
        const totalViews = articlesData.reduce((sum, a) => sum + (a.view_count || 0), 0)
        const featuredArticles = articlesData.filter(a => a.is_featured).length
        const premiumArticles = articlesData.filter(a => a.is_premium).length

        setAnalytics({
          totalArticles,
          publishedArticles,
          draftArticles,
          totalViews,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-800">アナリティクス</h1>
      
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 記事統計 */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📝</span>
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
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">✅</span>
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
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">📄</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-700">下書き</h3>
                <p className="text-2xl font-bold text-neutral-900">{analytics.draftArticles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-lg">👁️</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-700">総閲覧数</h3>
                <p className="text-2xl font-bold text-neutral-900">{analytics.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-lg">⭐</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-700">注目記事</h3>
                <p className="text-2xl font-bold text-neutral-900">{analytics.featuredArticles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 text-lg">💎</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-700">Premium記事</h3>
                <p className="text-2xl font-bold text-neutral-900">{analytics.premiumArticles}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 近日実装予定の機能 */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">近日実装予定</h2>
        <ul className="space-y-2 text-neutral-600">
          <li>• 記事別閲覧数詳細</li>
          <li>• カテゴリ別パフォーマンス</li>
          <li>• 月次・週次統計</li>
          <li>• ユーザー行動分析</li>
        </ul>
      </div>
    </div>
  )
}