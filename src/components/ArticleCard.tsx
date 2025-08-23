import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

interface ArticleCardProps {
  title: string
  excerpt: string
  category: string
  publishedAt: string
  readingTime: string
  slug: string
  thumbnail?: string
  coverImageUrl?: string
  tags?: string[]
}

const categoryColors = {
  '市場分析': 'bg-blue-100 text-blue-800',
  'グローバルトレンド': 'bg-green-100 text-green-800',
  '法規制': 'bg-red-100 text-red-800',
  '技術解説': 'bg-purple-100 text-purple-800',
  'ニュース': 'bg-yellow-100 text-yellow-800',
} as const

export default function ArticleCard({
  title,
  excerpt,
  category,
  publishedAt,
  readingTime,
  slug,
  thumbnail,
  coverImageUrl,
  tags = []
}: ArticleCardProps) {
  const categoryStyle = categoryColors[category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'
  const [imageError, setImageError] = useState(false)
  
  const imageUrl = coverImageUrl || thumbnail
  const shouldShowImage = imageUrl && !imageError && isValidImageUrl(imageUrl)
  
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
      <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
        {shouldShowImage ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
            <div className="text-6xl opacity-30">
              {category === '市場分析' && '📊'}
              {category === 'グローバルトレンド' && '🌏'}
              {category === '法規制' && '⚖️'}
              {category === '技術解説' && '🔧'}
              {category === 'ニュース' && '📰'}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category & Meta */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${categoryStyle}`}>
            {category}
          </span>
          <div className="flex items-center space-x-3 text-sm text-neutral-500">
            <span>{new Date(publishedAt).toLocaleDateString('ja-JP')}</span>
            <span>•</span>
            <span>{readingTime}分</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-neutral-800 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
          <Link href={`/articles/${slug}`}>
            {title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-neutral-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {excerpt}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag) => (
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
          href={`/articles/${slug}`}
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