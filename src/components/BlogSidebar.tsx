'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPublishedArticles, getCategoryDisplayName } from '@/lib/articles'
import type { Article } from '@/lib/articles'

interface PopularTag {
  name: string
  count: number
}

interface BlogSidebarProps {
  // プロップスは不要（内部で実データを取得）
}

export default function BlogSidebar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [recentArticles, setRecentArticles] = useState<Article[]>([])
  const [popularTags, setPopularTags] = useState<PopularTag[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 実際のデータを取得
  useEffect(() => {
    const loadSidebarData = async () => {
      try {
        // 最新記事3件を取得
        const { articles } = await getPublishedArticles({ limit: 3 })
        setRecentArticles(articles)

        // タグの集計（実装簡略化のため、記事からタグを集計）
        const tagCounts: { [key: string]: number } = {}
        articles.forEach(article => {
          article.tags?.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1
          })
        })

        // 人気タグトップ6を作成
        const sortedTags = Object.entries(tagCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 6)
          .map(([name, count]) => ({ name, count }))

        // タグが少ない場合はデフォルトタグを追加
        if (sortedTags.length < 6) {
          const defaultTags = [
            { name: "アプリストア", count: 15 },
            { name: "スマホ新法", count: 12 },
            { name: "セキュリティ", count: 8 },
            { name: "DMA", count: 6 },
            { name: "競争政策", count: 5 },
            { name: "サイドローディング", count: 4 }
          ]
          
          const combinedTags = [...sortedTags]
          for (const defaultTag of defaultTags) {
            if (combinedTags.length >= 6) break
            if (!combinedTags.some(tag => tag.name === defaultTag.name)) {
              combinedTags.push(defaultTag)
            }
          }
          setPopularTags(combinedTags.slice(0, 6))
        } else {
          setPopularTags(sortedTags)
        }
      } catch (error) {
        console.error('Failed to load sidebar data:', error)
        // エラー時はデフォルトデータを表示
        setPopularTags([
          { name: "アプリストア", count: 15 },
          { name: "スマホ新法", count: 12 },
          { name: "セキュリティ", count: 8 },
          { name: "DMA", count: 6 },
          { name: "競争政策", count: 5 },
          { name: "サイドローディング", count: 4 }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadSidebarData()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 検索機能実装
    console.log('Search:', searchQuery)
  }

  return (
    <aside className="space-y-8">
      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-bold text-neutral-800 mb-4">記事を検索</h3>
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="キーワードで検索..."
              className="w-full px-4 py-2 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-neutral-400 hover:text-primary-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-bold text-neutral-800 mb-4">最新記事</h3>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recentArticles.length > 0 ? (
              recentArticles.map((article) => (
                <article key={article.slug} className="group">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-neutral-800 group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
                        <Link href={`/articles/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-neutral-500">
                        <span>{new Date(article.published_at || article.created_at).toLocaleDateString('ja-JP')}</span>
                        <span>•</span>
                        <span className="text-primary-600">{getCategoryDisplayName(article.category)}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-neutral-500 text-sm">記事を読み込み中...</p>
            )}
          </div>
        )}
        <Link 
          href="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium mt-4 group"
        >
          すべての記事を見る
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Popular Tags */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-bold text-neutral-800 mb-4">人気のタグ</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag.name}
              href="/"
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-neutral-100 hover:bg-primary-100 hover:text-primary-700 text-neutral-700 text-sm rounded-lg transition-colors"
            >
              <span>#{tag.name}</span>
              <span className="text-xs text-neutral-500">({tag.count})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-200">
        <h3 className="text-lg font-bold text-neutral-800 mb-2">ニュースレター</h3>
        <p className="text-neutral-600 text-sm mb-4">
          最新の記事とアプリストア業界のトレンドをお届けします。
        </p>
        <Link
          href="#newsletter"
          className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary-gradient text-white font-medium rounded-lg hover:shadow-md transition-all"
        >
          購読する
        </Link>
      </div>
    </aside>
  )
}