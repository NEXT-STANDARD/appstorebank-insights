'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { supabase } from '@/lib/supabase'
import { getCategoryDisplayName } from '@/lib/articles'
import ShareButtons from '@/components/ShareButtons'
import { ScrollToTopButtonWithProgress } from '@/components/ScrollToTopButton'

interface Article {
  id: string
  slug: string
  title: string
  subtitle?: string
  content: string
  excerpt?: string
  category: string
  tags?: string[]
  status: string
  is_premium: boolean
  is_featured?: boolean
  author_id?: string
  published_at?: string
  created_at: string
  updated_at: string
  cover_image_url?: string
  reading_time?: number
  author?: {
    id: string
    display_name: string
    avatar_url?: string
  }
}

export default function PreviewArticlePage() {
  const params = useParams()
  const articleId = params.id as string
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadArticle()
  }, [articleId])

  const loadArticle = async () => {
    try {
      if (!supabase) {
        console.error('Supabase client is not available')
        return
      }

      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          profiles!articles_author_id_fkey (
            id,
            display_name,
            avatar_url
          )
        `)
        .eq('id', articleId)
        .single()

      if (error) {
        console.error('Error loading article:', error)
      } else if (data) {
        setArticle({
          ...data,
          author: data.profiles
        })
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-neutral-600">記事を読み込み中...</div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-neutral-600">記事が見つかりません</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* プレビューヘッダー */}
      <div className="bg-yellow-50 border-b-2 border-yellow-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-yellow-800 font-medium">📝 プレビューモード</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              article.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : article.status === 'draft'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {article.status === 'published' ? '公開済み' : 
               article.status === 'draft' ? '下書き' : 'アーカイブ'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href={`/admin/articles/${article.id}/edit`}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              編集に戻る
            </Link>
            <Link 
              href="/admin/articles"
              className="text-neutral-600 hover:text-neutral-700 text-sm"
            >
              記事一覧
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-primary-gradient text-white font-bold text-lg px-3 py-1 rounded-lg">
                AppStoreBank
              </div>
              <span className="text-neutral-600 font-medium">Insights</span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-neutral-600 hover:text-neutral-900 text-sm">
                ホーム
              </Link>
              <Link href="/#categories" className="text-neutral-600 hover:text-neutral-900 text-sm">
                カテゴリ
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Article Hero */}
      {article.cover_image_url && (
        <div className="relative h-96 w-full">
          <img
            src={article.cover_image_url}
            alt={`${article.title} - プレビュー画像`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                  {getCategoryDisplayName(article.category)}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {article.title}
              </h1>
              {article.subtitle && (
                <p className="text-xl text-white/90">
                  {article.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Meta (if no hero image) */}
        {!article.cover_image_url && (
          <>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                {getCategoryDisplayName(article.category)}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="text-xl text-neutral-600 mb-8">
                {article.subtitle}
              </p>
            )}
          </>
        )}

        {/* Author and Date */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-neutral-200">
          <div className="flex items-center space-x-4">
            {article.author?.avatar_url ? (
              <img
                src={article.author.avatar_url}
                alt={`${article.author.display_name}のプロフィール画像`}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-semibold">
                  {article.author?.display_name?.charAt(0) || 'A'}
                </span>
              </div>
            )}
            <div>
              <p className="text-neutral-900 font-medium">
                {article.author?.display_name || 'AppStoreBank編集部'}
              </p>
              <p className="text-sm text-neutral-500">
                {new Date(article.published_at || article.created_at).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className="text-sm text-neutral-500">
            {article.reading_time || 5}分で読めます
          </div>
        </div>

        {/* Premium Badge */}
        {article.is_premium && (
          <div className="mb-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-yellow-800 font-medium">プレミアム記事</span>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-neutral-900 mt-8 mb-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-neutral-900 mt-8 mb-4">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold text-neutral-900 mt-6 mb-3">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-neutral-700 leading-relaxed mb-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 space-y-2 mb-4 text-neutral-700">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 space-y-2 mb-4 text-neutral-700">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary-500 pl-4 italic text-neutral-600 my-4">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-neutral-100 px-2 py-1 rounded text-sm font-mono">{children}</code>
              ),
              pre: ({ children }) => (
                <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto mb-4">
                  {children}
                </pre>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full divide-y divide-neutral-200">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-neutral-50">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="px-4 py-2 text-left text-sm font-semibold text-neutral-900 border border-neutral-200">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2 text-sm text-neutral-700 border border-neutral-200">
                  {children}
                </td>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-neutral-900">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic">{children}</em>
              ),
              hr: () => (
                <hr className="my-8 border-neutral-200" />
              ),
              a: ({ children, href }) => (
                <a 
                  href={href} 
                  className="text-primary-600 hover:text-primary-700 underline"
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {children}
                </a>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 AppStoreBank Insights. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Scroll to Top Button */}
      <ScrollToTopButtonWithProgress />
    </div>
  )
}