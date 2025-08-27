'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ArticleCard from '@/components/ArticleCard'
import CategoryFilter from '@/components/CategoryFilter'
import BlogSidebar from '@/components/BlogSidebar'
import { getPublishedArticles, getCategoryDisplayName, getAllCategoryCounts } from '@/lib/articles'
import type { Article } from '@/lib/articles'

// カテゴリマッピング
const defaultCategoryKeys = ['market_analysis', 'global_trends', 'law_regulation', 'tech_deep_dive'] as const

export default function HomePageContent() {
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('すべて')
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [availableCategories, setAvailableCategories] = useState<string[]>(['すべて'])

  // URLパラメーターからカテゴリを取得してフィルタを設定
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      const displayName = getCategoryDisplayName(categoryParam as any)
      setActiveCategory(displayName)
    }
  }, [searchParams])

  // 記事を読み込む
  const loadArticles = async (categoryFilter: string, pageNum: number = 1, reset: boolean = true) => {
    setIsLoading(true)
    try {
      let category: string | undefined = undefined
      
      if (categoryFilter !== 'すべて') {
        // カテゴリ表示名から内部IDを取得（カスタムカテゴリも含む）
        // まずデフォルトカテゴリから探す
        category = defaultCategoryKeys.find(key => getCategoryDisplayName(key) === categoryFilter)
        // 見つからない場合はカスタムカテゴリとして扱う
        if (!category) {
          // カスタムカテゴリの場合は表示名と内部名が同じ場合が多い
          category = categoryFilter
        }
      }
      
      console.log('Loading articles with filter:', { 
        categoryFilter, 
        category
      })

      const { articles: newArticles, hasMore: moreAvailable } = await getPublishedArticles({
        category,
        page: pageNum,
        limit: 6
      })
      
      console.log('Loaded articles:', newArticles.length, 'articles for category:', category)

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

  // カテゴリ数を読み込み
  useEffect(() => {
    const loadCategoryCounts = async () => {
      const counts = await getAllCategoryCounts()
      console.log('Loaded category counts:', counts)
      setCategoryCounts(counts)
      // カテゴリリストを動的に生成
      const categories = Object.keys(counts).filter(cat => cat !== 'すべて' && counts[cat] > 0)
      setAvailableCategories(['すべて', ...categories])
    }
    loadCategoryCounts()
  }, [])

  // 初期読み込み
  useEffect(() => {
    setPage(1)
    loadArticles(activeCategory, 1, true)
  }, [activeCategory])

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

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* メインコンテンツ */}
        <div className="lg:col-span-8">
          {/* カテゴリフィルター */}
          <CategoryFilter
            categories={availableCategories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            articles={articles}
            categoryCounts={categoryCounts}
          />

          {/* 記事一覧 */}
          <div className="mt-8">
            {isLoading && articles.length === 0 ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : articles.length > 0 ? (
              <>
                <div className="grid gap-6 md:grid-cols-2">
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
                      className="inline-flex items-center px-6 py-3 border border-neutral-300 shadow-sm text-base font-medium rounded-lg text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                      ) : null}
                      {isLoading ? '読み込み中...' : 'もっと見る'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-500">記事がありません</p>
              </div>
            )}
          </div>
        </div>

        {/* サイドバー */}
        <div className="mt-12 lg:mt-0 lg:col-span-4">
          <BlogSidebar />
        </div>
      </div>
    </main>
  )
}