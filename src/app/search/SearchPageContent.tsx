'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import { searchArticles, getCategoryDisplayName, getAllCategoryCounts, loadCategoryMapping, getCategorySlugFromDisplayName } from '@/lib/articles'
import type { Article } from '@/lib/articles'
import { ArrowLeft, ChevronRight, Filter, Calendar, Clock, Search, FileSearch, TrendingUp } from 'lucide-react'

export default function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('すべて')
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [availableCategories, setAvailableCategories] = useState<string[]>(['すべて'])
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'popular'>('relevance')
  const [hasSearched, setHasSearched] = useState(false)

  // URLパラメーターから検索クエリを取得
  useEffect(() => {
    const queryParam = searchParams.get('q')
    if (queryParam) {
      setSearchTerm(queryParam)
      performSearch(queryParam, 'すべて', 'relevance')
      setHasSearched(true)
    }
  }, [searchParams])

  // カテゴリ数を読み込み
  useEffect(() => {
    const loadCategoryCounts = async () => {
      await loadCategoryMapping()
      const counts = await getAllCategoryCounts()
      setCategoryCounts(counts)
      const categories = Object.keys(counts).filter(cat => cat !== 'すべて' && counts[cat] > 0)
      setAvailableCategories(['すべて', ...categories])
    }
    loadCategoryCounts()
  }, [])

  // 検索実行
  const performSearch = async (query: string, categoryFilter: string = activeCategory, sort: string = sortBy) => {
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const { articles: searchResults } = await searchArticles(query.trim(), 50)
      
      let filteredResults = searchResults

      // カテゴリフィルター適用
      if (categoryFilter !== 'すべて') {
        const categorySlug = getCategorySlugFromDisplayName(categoryFilter) || categoryFilter
        filteredResults = searchResults.filter(article => article.category === categorySlug)
      }

      // ソート適用
      if (sort === 'date') {
        filteredResults = filteredResults.sort((a, b) => 
          new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime()
        )
      } else if (sort === 'popular') {
        filteredResults = filteredResults.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      }
      // relevance sort is already handled by the search function

      setArticles(filteredResults)
    } catch (error) {
      console.error('検索に失敗しました:', error)
      setArticles([])
    }
    setIsLoading(false)
  }

  // 検索フォーム送信
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  // カテゴリ変更
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    if (hasSearched && searchTerm) {
      performSearch(searchTerm, category, sortBy)
    }
  }

  // ソート変更
  const handleSortChange = (sort: 'relevance' | 'date' | 'popular') => {
    setSortBy(sort)
    if (hasSearched && searchTerm) {
      performSearch(searchTerm, activeCategory, sort)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* パンくずリスト */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              ホーム
            </Link>
          </li>
          <li className="text-gray-400">
            <ChevronRight className="w-4 h-4" />
          </li>
          <li className="text-gray-900 font-medium">記事検索</li>
        </ol>
      </nav>

      {/* ヘッダーセクション */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">記事検索</h1>
            <p className="text-gray-600">アプリストア自由化に関する記事を検索</p>
          </div>
          <div className="text-center">
            <FileSearch className="w-12 h-12 text-blue-600 mb-2 mx-auto" />
            <div className="text-sm text-gray-500">検索機能</div>
          </div>
        </div>

        {/* 検索バー */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="記事のタイトルや内容を検索..."
              className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              検索
            </button>
          </div>
        </form>

        {/* 検索結果情報とフィルター */}
        {hasSearched && (
          <>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <p className="text-gray-700">
                  <span className="font-semibold">"{searchTerm}"</span> の検索結果: 
                  <span className="font-semibold text-blue-600 ml-1">{articles.length}件</span>
                </p>
              </div>
            </div>

            {/* フィルターとソート */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">ソート:</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSortChange('relevance')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'relevance'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Search className="w-4 h-4 inline mr-1" />
                    関連度
                  </button>
                  <button
                    onClick={() => handleSortChange('date')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'date'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Calendar className="w-4 h-4 inline mr-1" />
                    新着順
                  </button>
                  <button
                    onClick={() => handleSortChange('popular')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'popular'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    人気順
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                {activeCategory !== 'すべて' && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full mr-2">
                    {activeCategory}
                  </span>
                )}
                {articles.length}件表示中
              </div>
            </div>
          </>
        )}
      </div>

      {/* カテゴリフィルター */}
      {hasSearched && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">カテゴリで絞り込み</h2>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
                {categoryCounts[category] !== undefined && (
                  <span className="ml-2 opacity-75">({categoryCounts[category]})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 検索結果 */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : hasSearched ? (
        articles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                featured={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <FileSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">検索結果が見つかりません</h3>
            <p className="text-gray-500 mb-6">
              "{searchTerm}" に関連する記事が見つかりませんでした。
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>検索のヒント:</p>
              <ul className="list-disc list-inside space-y-1 max-w-md mx-auto">
                <li>別のキーワードで検索してみる</li>
                <li>より一般的な用語を使用する</li>
                <li>スペルを確認する</li>
                <li>カテゴリフィルターを「すべて」に変更する</li>
              </ul>
            </div>
            <div className="mt-8">
              <Link
                href="/articles"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                すべての記事を見る
              </Link>
            </div>
          </div>
        )
      ) : (
        // 初期状態（検索前）
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <FileSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">記事を検索</h3>
          <p className="text-gray-500 mb-6">
            上の検索バーにキーワードを入力して記事を検索できます。
          </p>
          <div className="space-y-2 text-sm text-gray-600 mb-8">
            <p>検索対象:</p>
            <ul className="list-disc list-inside space-y-1 max-w-md mx-auto">
              <li>記事タイトル</li>
              <li>記事の内容</li>
              <li>記事の概要</li>
              <li>サブタイトル</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/articles"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              すべての記事を見る
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ホームページに戻る
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}