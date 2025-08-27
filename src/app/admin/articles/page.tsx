'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPublishedArticles, getDraftArticles, Article, getCategoryDisplayName, loadCategoryMapping } from '@/lib/articles'

export default function ArticlesManagementPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadArticles()
  }, [filter])
  
  // カテゴリマッピングを読み込み
  useEffect(() => {
    loadCategoryMapping()
  }, [])

  const loadArticles = async () => {
    setIsLoading(true)
    try {
      if (filter === 'published') {
        const { articles } = await getPublishedArticles({ limit: 100 })
        setArticles(articles)
      } else if (filter === 'draft') {
        const { articles } = await getDraftArticles()
        setArticles(articles)
      } else {
        // 両方取得
        const [published, drafts] = await Promise.all([
          getPublishedArticles({ limit: 100 }),
          getDraftArticles()
        ])
        setArticles([...published.articles, ...drafts.articles])
      }
    } catch (error) {
      console.error('Error loading articles:', error)
    }
    setIsLoading(false)
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || colors.draft
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">記事管理</h1>
        <Link
          href="/admin/articles/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          新規記事作成
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'published' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            公開済み
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'draft' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            下書き
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : articles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    タイトル
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    カテゴリ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    作成日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-neutral-900">
                          {article.title}
                        </div>
                        {article.subtitle && (
                          <div className="text-sm text-neutral-500">
                            {article.subtitle}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-600">
                        {getCategoryDisplayName(article.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(article.status)}`}>
                          {article.status === 'published' ? '公開済み' : article.status === 'draft' ? '下書き' : 'アーカイブ'}
                        </span>
                        {article.is_featured && (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            注目
                          </span>
                        )}
                        {article.is_premium && (
                          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                            Premium
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {new Date(article.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/preview/${article.id}`}
                          className="text-green-600 hover:text-green-700 text-sm"
                        >
                          プレビュー
                        </Link>
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="text-primary-600 hover:text-primary-700 text-sm"
                        >
                          編集
                        </Link>
                        {article.status === 'published' && (
                          <a
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-600 hover:text-neutral-700 text-sm"
                          >
                            表示
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-500">
            記事がありません
          </div>
        )}
      </div>
    </div>
  )
}