'use client'

import { useState, useEffect } from 'react'
import { getPublishedArticles, Article, getCategoryDisplayName } from '@/lib/articles'
import { ensureArticleImages } from '@/lib/default-images'
import ArticleCard from './ArticleCard'

export default function FeaturedArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedArticles = async () => {
      try {
        const { articles: rawArticles } = await getPublishedArticles({ 
          limit: 6 
        })
        
        // デフォルト画像を設定
        const articlesWithImages = await ensureArticleImages(rawArticles)
        setArticles(articlesWithImages)
      } catch (error) {
        console.error('Failed to load articles:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedArticles()
  }, [])

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">注目記事</h2>
            <p className="text-white/70">最新の業界インサイトをお届け</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg animate-pulse">
                <div className="aspect-[16/9] bg-neutral-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-neutral-200 rounded w-20" />
                  <div className="h-6 bg-neutral-200 rounded" />
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">注目記事</h2>
          <p className="text-white/70">最新の業界インサイトをお届け</p>
        </div>
        
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                excerpt={article.excerpt || ''}
                category={getCategoryDisplayName(article.category)}
                publishedAt={new Date(article.published_at || article.created_at).toLocaleDateString('ja-JP')}
                readingTime={(article.reading_time || 5).toString()}
                slug={article.slug}
                thumbnail={article.cover_image_url}
                tags={article.tags}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-white/60">
            <p>記事を準備中です...</p>
          </div>
        )}
      </div>
    </section>
  )
}