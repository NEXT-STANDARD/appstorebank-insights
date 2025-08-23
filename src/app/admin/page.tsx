'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPublishedArticles, getDraftArticles, Article } from '@/lib/articles'
import { getCurrentUser } from '@/lib/auth'

interface DashboardStats {
  totalArticles: number
  draftArticles: number
  totalViews: number
  avgReadingTime: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    draftArticles: 0,
    totalViews: 0,
    avgReadingTime: 0
  })
  const [recentArticles, setRecentArticles] = useState<Article[]>([])
  const [recentDrafts, setRecentDrafts] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    
    try {
      // ユーザー情報を取得
      const { user } = await getCurrentUser()
      setCurrentUser(user)

      // 公開記事を取得
      const { articles: publishedArticles } = await getPublishedArticles({ limit: 5 })
      setRecentArticles(publishedArticles)

      // 下書き記事を取得
      const { articles: draftArticles } = await getDraftArticles()
      setRecentDrafts(draftArticles.slice(0, 5))

      // 統計情報を計算（view_countとreading_timeは現在のテーブルにないためダミー値）
      const totalViews = 0 // publishedArticles.length * 100  // ダミー値
      const avgReadingTime = 5 // 固定値（分）

      setStats({
        totalArticles: publishedArticles.length,
        draftArticles: draftArticles.length,
        totalViews,
        avgReadingTime: Math.round(avgReadingTime)
      })

    } catch (error) {
      console.error('Error loading dashboard data:', error)
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
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-800">ダッシュボード</h1>
        <p className="text-neutral-600 mt-2">
          おかえりなさい、{currentUser?.profile?.name || currentUser?.email}さん
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-neutral-600">公開記事</p>
              <p className="text-2xl font-bold text-neutral-800">{stats.totalArticles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-neutral-600">下書き</p>
              <p className="text-2xl font-bold text-neutral-800">{stats.draftArticles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-neutral-600">総閲覧数</p>
              <p className="text-2xl font-bold text-neutral-800">{stats.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-neutral-600">平均読了時間</p>
              <p className="text-2xl font-bold text-neutral-800">{stats.avgReadingTime}分</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Articles */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-800">最近の公開記事</h2>
              <Link
                href="/admin/articles"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                すべて見る
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentArticles.length > 0 ? (
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <div key={article.id} className="flex items-start space-x-3 p-3 hover:bg-neutral-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-neutral-800 line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-neutral-500">
                        <span>{new Date(article.published_at || '').toLocaleDateString('ja-JP')}</span>
                        <span>•</span>
                        <span>{article.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-8">公開記事がありません</p>
            )}
          </div>
        </div>

        {/* Recent Drafts */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-800">最近の下書き</h2>
              <Link
                href="/admin/drafts"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                すべて見る
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentDrafts.length > 0 ? (
              <div className="space-y-4">
                {recentDrafts.map((article) => (
                  <div key={article.id} className="flex items-start space-x-3 p-3 hover:bg-neutral-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-neutral-800 line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-neutral-500">
                        <span>更新: {new Date(article.updated_at).toLocaleDateString('ja-JP')}</span>
                        <span>•</span>
                        <span>{article.reading_time || 0}分</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-8">下書きがありません</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">クイックアクション</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/articles/new"
            className="flex items-center space-x-3 p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <div className="p-2 bg-primary-100 rounded-lg">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-neutral-800">新規記事作成</p>
              <p className="text-sm text-neutral-600">新しい記事を書く</p>
            </div>
          </Link>

          <Link
            href="/admin/articles"
            className="flex items-center space-x-3 p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <div className="p-2 bg-primary-100 rounded-lg">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-neutral-800">記事管理</p>
              <p className="text-sm text-neutral-600">記事の編集・削除</p>
            </div>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-3 p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <div className="p-2 bg-primary-100 rounded-lg">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-neutral-800">サイトプレビュー</p>
              <p className="text-sm text-neutral-600">公開サイトを確認</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}