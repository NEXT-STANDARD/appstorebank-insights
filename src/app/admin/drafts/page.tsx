'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getDraftArticles, Article, getCategoryDisplayName } from '@/lib/articles'

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDrafts()
  }, [])

  const loadDrafts = async () => {
    try {
      const { articles } = await getDraftArticles()
      setDrafts(articles)
    } catch (error) {
      console.error('Error loading drafts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">下書き記事</h1>
        <Link
          href="/admin/articles/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          新規記事作成
        </Link>
      </div>

      {/* Drafts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : drafts.length > 0 ? (
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
                    最終更新
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {drafts.map((draft) => (
                  <tr key={draft.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-neutral-900">
                          {draft.title}
                        </div>
                        {draft.subtitle && (
                          <div className="text-sm text-neutral-500">
                            {draft.subtitle}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-600">
                        {getCategoryDisplayName(draft.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {new Date(draft.updated_at).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/articles/${draft.id}/edit`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          編集
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-500">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-neutral-800 mb-2">
              下書きがありません
            </h3>
            <p className="text-neutral-600 mb-4">
              新しい記事を作成して下書きとして保存してください
            </p>
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              新規記事作成
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}