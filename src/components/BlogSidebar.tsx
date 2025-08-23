'use client'

import { useState } from 'react'
import Link from 'next/link'

interface RecentArticle {
  title: string
  slug: string
  publishedAt: string
  category: string
}

interface PopularTag {
  name: string
  count: number
}

interface BlogSidebarProps {
  recentArticles?: RecentArticle[]
  popularTags?: PopularTag[]
}

const mockRecentArticles: RecentArticle[] = [
  {
    title: "2025年のアプリストア市場予測：新たな競争の時代",
    slug: "app-store-market-forecast-2025",
    publishedAt: "2025-01-15",
    category: "市場分析"
  },
  {
    title: "EU Digital Markets Actの最新動向と日本への影響",
    slug: "eu-dma-impact-japan",
    publishedAt: "2025-01-12",
    category: "法規制"
  },
  {
    title: "サイドローディング実装のセキュリティ課題",
    slug: "sideloading-security-challenges",
    publishedAt: "2025-01-10",
    category: "技術解説"
  }
]

const mockPopularTags: PopularTag[] = [
  { name: "スマホ新法", count: 45 },
  { name: "アプリストア", count: 38 },
  { name: "DMA", count: 32 },
  { name: "サイドローディング", count: 28 },
  { name: "セキュリティ", count: 25 },
  { name: "競争政策", count: 22 }
]

export default function BlogSidebar({ 
  recentArticles = mockRecentArticles,
  popularTags = mockPopularTags 
}: BlogSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

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
        <div className="space-y-4">
          {recentArticles.map((article) => (
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
                    <span>{new Date(article.publishedAt).toLocaleDateString('ja-JP')}</span>
                    <span>•</span>
                    <span className="text-primary-600">{article.category}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <Link 
          href="/articles"
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
              href={`/tags/${encodeURIComponent(tag.name)}`}
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
          href="/newsletter"
          className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary-gradient text-white font-medium rounded-lg hover:shadow-md transition-all"
        >
          購読する
        </Link>
      </div>
    </aside>
  )
}