import Link from 'next/link'
import { useState } from 'react'
import { getCategoryDisplayName, type Article } from '@/lib/articles'
import TechnicalLevel from './TechnicalLevel'

interface ArticleCardProps {
  article: Article
  featured?: boolean
}

const categoryColors = {
  '市場分析': 'bg-blue-100 text-blue-800',
  'グローバルトレンド': 'bg-green-100 text-green-800',
  '法規制': 'bg-red-100 text-red-800',
  '技術解説': 'bg-purple-100 text-purple-800',
  'ニュース': 'bg-yellow-100 text-yellow-800',
  'テクノロジー / アプリ市場': 'bg-indigo-100 text-indigo-800',
} as const

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false)
  
  const categoryDisplayName = getCategoryDisplayName(article.category)
  const categoryStyle = categoryColors[categoryDisplayName as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'
  
  const imageUrl = article.cover_image_url
  const shouldShowImage = imageUrl && !imageError && isValidImageUrl(imageUrl)
  
  // 日付フォーマット関数
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return new Date().toLocaleDateString('ja-JP')
      }
      return date.toLocaleDateString('ja-JP')
    } catch {
      return new Date().toLocaleDateString('ja-JP')
    }
  }
  
  // 読書時間の計算（デフォルト5分）
  const readingTime = article.reading_time || 5
  
  // 画像URLの妥当性をチェック
  function isValidImageUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url)
      return parsedUrl.protocol === 'https:' && 
             (parsedUrl.hostname === 'images.unsplash.com' || 
              parsedUrl.hostname === 'unsplash.com' ||
              parsedUrl.hostname.includes('supabase.co'))
    } catch {
      return false
    }
  }

  return (
    <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Thumbnail */}
      <Link href={`/articles/${article.slug}`} className="block">
        <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
          {shouldShowImage ? (
            <img
              src={imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
              <div className="text-6xl opacity-30">
                {categoryDisplayName === '市場分析' && '📊'}
                {categoryDisplayName === 'グローバルトレンド' && '🌏'}
                {categoryDisplayName === '法規制' && '⚖️'}
                {categoryDisplayName === '技術解説' && '🔧'}
                {categoryDisplayName === 'ニュース' && '📰'}
                {categoryDisplayName === 'テクノロジー / アプリ市場' && '💻'}
                {!['市場分析', 'グローバルトレンド', '法規制', '技術解説', 'ニュース', 'テクノロジー / アプリ市場'].includes(categoryDisplayName) && '📄'}
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        {/* Category & Meta */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${categoryStyle}`}>
              {categoryDisplayName}
            </span>
            {article.technical_level && article.category === 'tech_deep_dive' && (
              <TechnicalLevel level={article.technical_level} size="sm" showLabel={false} />
            )}
          </div>
          <div className="flex items-center space-x-3 text-sm text-neutral-500">
            <span>{formatDate(article.published_at || article.created_at)}</span>
            <span>•</span>
            <span>{readingTime}分</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-neutral-800 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
          <Link href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-neutral-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.excerpt || article.subtitle || `${article.title}についての詳細記事です。`}
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Read More */}
        <Link
          href={`/articles/${article.slug}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors group"
        >
          続きを読む
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  )
}