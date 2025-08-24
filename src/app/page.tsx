'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import BlogHero from '@/components/BlogHero'
import ArticleCard from '@/components/ArticleCard'
import CategoryFilter from '@/components/CategoryFilter'
import BlogSidebar from '@/components/BlogSidebar'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'
import { getPublishedArticles, getCategoryDisplayName } from '@/lib/articles'
import type { Article } from '@/lib/articles'

// カテゴリマッピング
const categoryKeys = ['market_analysis', 'global_trends', 'law_regulation', 'tech_deep_dive'] as const
const categories = ['すべて', ...categoryKeys.map(key => getCategoryDisplayName(key))]

function HomePageContent() {
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('すべて')
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // URLパラメーターからカテゴリを取得してフィルタを設定
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam && categoryKeys.includes(categoryParam as any)) {
      const displayName = getCategoryDisplayName(categoryParam as any)
      setActiveCategory(displayName)
    }
  }, [searchParams])

  // 記事データの取得
  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async (pageNum = 1, reset = true) => {
    try {
      setIsLoading(pageNum === 1)
      const { articles: newArticles, hasMore: moreArticles } = await getPublishedArticles({ 
        limit: 12,
        offset: (pageNum - 1) * 12
      })
      
      if (reset) {
        setArticles(newArticles)
      } else {
        setArticles(prev => [...prev, ...newArticles])
      }
      
      setHasMore(moreArticles)
      setPage(pageNum)
    } catch (error) {
      console.error('Error loading articles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      loadArticles(page + 1, false)
    }
  }

  // カテゴリによる記事フィルタリング
  const filteredArticles = activeCategory === 'すべて' 
    ? articles 
    : articles.filter(article => getCategoryDisplayName(article.category) === activeCategory)
  return (
    <>
      <Header />
      <main className="flex-1">
        <BlogHero />
        
        {/* Main Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3 space-y-8">
                <CategoryFilter 
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  articles={articles}
                />
                
                {/* Loading State */}
                {isLoading && page === 1 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 animate-pulse">
                        <div className="h-4 bg-neutral-200 rounded mb-4"></div>
                        <div className="h-6 bg-neutral-200 rounded mb-2"></div>
                        <div className="h-4 bg-neutral-200 rounded w-3/4 mb-4"></div>
                        <div className="flex justify-between">
                          <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                          <div className="h-4 bg-neutral-200 rounded w-1/6"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredArticles.map((article) => (
                      <ArticleCard 
                        key={article.slug} 
                        title={article.title}
                        excerpt={article.excerpt || ''}
                        category={getCategoryDisplayName(article.category)}
                        publishedAt={article.published_at || article.created_at}
                        readingTime={article.reading_time?.toString() || '5'}
                        slug={article.slug}
                        tags={article.tags || []}
                        coverImageUrl={article.cover_image_url}
                      />
                    ))}
                  </div>
                )}

                {/* No results */}
                {!isLoading && filteredArticles.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-medium text-neutral-800 mb-2">
                      {activeCategory}の記事はまだありません
                    </h3>
                    <p className="text-neutral-600">
                      他のカテゴリをお試しください
                    </p>
                  </div>
                )}

                {/* Load More */}
                {!isLoading && hasMore && activeCategory === 'すべて' && (
                  <div className="text-center">
                    <button 
                      onClick={loadMore}
                      disabled={isLoading}
                      className="inline-flex items-center px-8 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? '読み込み中...' : 'さらに記事を読み込む'}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <BlogSidebar />
              </div>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  )
}