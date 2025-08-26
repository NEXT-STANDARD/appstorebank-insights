'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getPublishedArticles, getCategoryDisplayName } from '@/lib/articles'
import type { Article } from '@/lib/articles'

// BlogHeroコンポーネント - 実際のデータベースから最新記事を表示

export default function BlogHero() {
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedArticle = async () => {
      try {
        // 注目記事として表示設定された記事を取得
        const { articles } = await getPublishedArticles({ featured: true, limit: 1 })
        if (articles.length > 0) {
          setFeaturedArticle(articles[0])
        } else {
          // 注目記事がない場合は最新記事を表示
          const { articles: latestArticles } = await getPublishedArticles({ limit: 1 })
          if (latestArticles.length > 0) {
            setFeaturedArticle(latestArticles[0])
          }
        }
      } catch (error) {
        console.error('Failed to load featured article:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeaturedArticle()
  }, [])

  if (isLoading) {
    return (
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
            <div className="md:flex">
              <div className="md:w-1/2 h-64 md:h-80 bg-gray-200"></div>
              <div className="md:w-1/2 p-8 md:p-12 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!featuredArticle) {
    return (
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">記事を準備中です</h2>
            <p className="text-neutral-600">最新の業界インサイトを準備中です。しばらくお待ちください。</p>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            AppStoreBank Insights
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            アプリストア業界の最新動向、市場分析、技術解説をお届けする専門メディア
          </p>
        </div>

        {/* Featured Article */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
          <div className="md:flex">
            {/* Image */}
            <div className="md:w-1/2">
              <div className="aspect-[16/10] md:aspect-auto md:h-full relative overflow-hidden">
                <Link href={`/articles/${featuredArticle.slug}`} className="absolute inset-0 z-10">
                  <span className="sr-only">記事を読む</span>
                </Link>
                {featuredArticle.cover_image_url ? (
                  <Image
                    src={featuredArticle.cover_image_url}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <div className="text-8xl opacity-30">
                      {getCategoryDisplayName(featuredArticle.category) === '市場分析' && '📊'}
                      {getCategoryDisplayName(featuredArticle.category) === 'グローバルトレンド' && '🌏'}
                      {getCategoryDisplayName(featuredArticle.category) === '法規制' && '⚖️'}
                      {getCategoryDisplayName(featuredArticle.category) === '技術解説' && '🔧'}
                    </div>
                  </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-block px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg shadow-lg">
                    注目記事
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center space-x-2 text-sm text-primary-600 font-medium mb-3">
                <span className="px-3 py-1 bg-primary-100 rounded-full">{getCategoryDisplayName(featuredArticle.category)}</span>
                <span>•</span>
                <span>{new Date(featuredArticle.published_at || featuredArticle.created_at).toLocaleDateString('ja-JP')}</span>
                <span>•</span>
                <span>{featuredArticle.reading_time || 5}分で読める</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4 leading-tight">
                <Link href={`/articles/${featuredArticle.slug}`} className="hover:text-primary-600 transition-colors">
                  {featuredArticle.title}
                </Link>
              </h2>

              <p className="text-neutral-600 text-lg leading-relaxed mb-6 line-clamp-4">
                {featuredArticle.excerpt || featuredArticle.subtitle || '最新の業界インサイトをお届けします。'}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {featuredArticle.author?.avatar_url ? (
                    <Image
                      src={featuredArticle.author.avatar_url}
                      alt={featuredArticle.author.display_name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">
                        {featuredArticle.author?.display_name?.charAt(0) || 'A'}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{featuredArticle.author?.display_name || 'AppStoreBank編集部'}</p>
                    <p className="text-xs text-neutral-500">編集部</p>
                  </div>
                </div>

                <Link
                  href={`/articles/${featuredArticle.slug}`}
                  className="inline-flex items-center px-6 py-3 bg-primary-gradient text-white font-medium rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                >
                  続きを読む
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}