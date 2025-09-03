'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import { getPublishedArticles, getCategoryDisplayName, getAllCategoryCounts, loadCategoryMapping, getCategorySlugFromDisplayName } from '@/lib/articles'
import type { Article } from '@/lib/articles'
import { ArrowLeft, ChevronRight, Filter, Calendar, Clock, Tag, TrendingUp, Search } from 'lucide-react'

export default function ArticlesPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [activeCategory, setActiveCategory] = useState('すべて')
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [availableCategories, setAvailableCategories] = useState<string[]>(['すべて'])
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'featured'>('latest')
  const [searchTerm, setSearchTerm] = useState('')

  // URLパラメーターからカテゴリを取得
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      const displayName = getCategoryDisplayName(categoryParam as any)
      setActiveCategory(displayName)
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

  // 記事を読み込む
  const loadArticles = async (categoryFilter: string, pageNum: number = 1, reset: boolean = true) => {
    setIsLoading(true)
    try {
      let category: string | undefined = undefined
      
      if (categoryFilter !== 'すべて') {
        category = getCategorySlugFromDisplayName(categoryFilter) || categoryFilter
      }

      const options: any = {
        page: pageNum,
        limit: 12
      }

      if (category) {
        options.category = category
      }

      if (sortBy === 'featured') {
        options.featured = true
      } else if (sortBy === 'popular') {
        options.sortBy = 'views'
      }

      const { articles: newArticles, hasMore: moreAvailable } = await getPublishedArticles(options)

      if (reset) {
        setArticles(newArticles)
      } else {
        setArticles(prev => [...prev, ...newArticles])
      }
      setHasMore(moreAvailable)
    } catch (error) {
      console.error('記事の読み込みに失敗しました:', error)
    }
    setIsLoading(false)
  }

  // 初期読み込み
  useEffect(() => {
    setPage(1)
    loadArticles(activeCategory, 1, true)
  }, [activeCategory, sortBy])

  // カテゴリ変更
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setPage(1)
  }

  // もっと読む
  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadArticles(activeCategory, nextPage, false)
  }

  // 検索実行
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  // 統計情報
  const totalArticles = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)
  const featuredCount = articles.filter(a => a.is_featured).length

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
          <li className="text-gray-900 font-medium">記事一覧</li>
        </ol>
      </nav>

      {/* ヘッダーセクション */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">記事一覧</h1>
            <p className="text-gray-600">アプリストア自由化に関する最新情報と専門的な分析</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{totalArticles}</div>
            <div className="text-sm text-gray-500">記事</div>
          </div>
        </div>

        {/* 検索バー */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="記事を検索..."
              className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              検索
            </button>
          </div>
        </form>

        {/* フィルターとソート */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">ソート:</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSortBy('latest')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'latest'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-1" />
                最新
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'popular'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-1" />
                人気
              </button>
              <button
                onClick={() => setSortBy('featured')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'featured'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Tag className="w-4 h-4 inline mr-1" />
                注目
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
      </div>

      {/* カテゴリフィルター */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">カテゴリ</h2>
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

      {/* 記事グリッド */}
      {isLoading && articles.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : articles.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                featured={false}
              />
            ))}
          </div>

          {/* もっと見るボタン */}
          {hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                ) : null}
                {isLoading ? '読み込み中...' : 'もっと見る'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500">記事がありません</p>
        </div>
      )}
    </div>
  )
}