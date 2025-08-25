'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const router = useRouter()

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) {
      setShowSearchResults(false)
      return
    }
    
    setIsSearching(true)
    try {
      const response = await fetch(`/api/search/articles?q=${encodeURIComponent(searchQuery.trim())}&limit=5`)
      const data = await response.json()
      
      if (response.ok) {
        setSearchResults(data.articles || [])
        setShowSearchResults(true)
      } else {
        console.error('Search error:', data.error)
      }
    } catch (error) {
      console.error('Search request failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    // 入力が空になったら検索結果を非表示
    if (!value.trim()) {
      setShowSearchResults(false)
    }
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
              onChange={handleInputChange}
              placeholder="キーワードで検索..."
              className="w-full px-4 py-2 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-neutral-400 hover:text-primary-600 disabled:opacity-50"
            >
              {isSearching ? (
                <div className="animate-spin w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </div>
        </form>
        
        {/* Search Results */}
        {showSearchResults && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <h4 className="text-sm font-medium text-neutral-700 mb-3">検索結果</h4>
            {searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map((article) => (
                  <div key={article.slug} className="group">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="block text-sm text-neutral-600 hover:text-primary-600 transition-colors line-clamp-2"
                    >
                      {article.title}
                    </Link>
                    <div className="text-xs text-neutral-400 mt-1">
                      {getCategoryDisplayName(article.category)}
                    </div>
                  </div>
                ))}
                {searchResults.length === 5 && (
                  <div className="text-xs text-neutral-500 italic">
                    さらに結果があります...
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">結果が見つかりませんでした</p>
            )}
          </div>
        )}
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

    </aside>
  )
}