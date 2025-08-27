'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createArticle } from '@/lib/articles'
import { getCurrentUser } from '@/lib/auth'
import ImageSelector from '@/components/ImageSelector'
import { categoryImageKeywords } from '@/lib/unsplash'
import { getActiveCategories } from '@/lib/categories'
import type { Category } from '@/lib/categories'

export default function NewArticlePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [] as string[],
    status: 'draft',
    is_premium: false,
    is_featured: false,
    technical_level: 'intermediate' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    cover_image_url: '',
    external_sources: [] as string[]
  })
  const [showImageSelector, setShowImageSelector] = useState(false)
  const [newSourceUrl, setNewSourceUrl] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  // カテゴリを読み込み
  useEffect(() => {
    const loadCategories = async () => {
      const { categories: data, error } = await getActiveCategories()
      if (error) {
        console.error('Error loading categories:', error)
      } else {
        setCategories(data)
        // 最初のカテゴリを初期値に設定
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, category: data[0].slug }))
        }
      }
    }
    loadCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // バリデーション
    if (!formData.title || !formData.slug || !formData.content) {
      alert('タイトル、スラッグ、本文は必須です')
      return
    }
    
    if (!formData.category) {
      alert('カテゴリを選択してください')
      return
    }

    
    setIsLoading(true)

    try {
      const { user } = await getCurrentUser()
      if (!user) {
        alert('ログインが必要です')
        router.push('/admin/login')
        return
      }

      const { error } = await createArticle({
        ...formData,
        author_id: user.id,
        published_at: formData.status === 'published' ? new Date().toISOString() : undefined
      })

      if (error) {
        alert('記事の作成に失敗しました: ' + (typeof error === 'string' ? error : error.message))
      } else {
        alert('記事を作成しました')
        router.push('/admin/articles')
      }
    } catch (error: any) {
      alert('エラーが発生しました: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    setFormData({ ...formData, tags })
  }

  const addExternalSource = () => {
    if (newSourceUrl && newSourceUrl.trim()) {
      setFormData({ 
        ...formData, 
        external_sources: [...formData.external_sources, newSourceUrl.trim()] 
      })
      setNewSourceUrl('')
    }
  }

  const removeExternalSource = (index: number) => {
    setFormData({
      ...formData,
      external_sources: formData.external_sources.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">新規記事作成</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              タイトル *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => {
                setFormData({ 
                  ...formData, 
                  title: e.target.value,
                  slug: generateSlug(e.target.value)
                })
              }}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              サブタイトル
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              スラッグ (URL) *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="article-slug"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              カテゴリ *
            </label>
            {categories.length > 0 ? (
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-500">
                カテゴリを読み込み中...
              </div>
            )}
            <p className="mt-1 text-sm text-neutral-500">
              カテゴリは<Link href="/admin/categories" className="text-primary-600 hover:underline">カテゴリ管理</Link>で作成・編集できます
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              タグ（カンマ区切り）
            </label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="タグ1, タグ2, タグ3"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              概要
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              本文 (Markdown) *
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={15}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
              placeholder="# 見出し&#10;&#10;記事の内容..."
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              カバー画像
            </label>
            
            {/* Current Image Preview */}
            {formData.cover_image_url && (
              <div className="mb-4">
                <img 
                  src={formData.cover_image_url} 
                  alt="カバー画像プレビュー" 
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, cover_image_url: '' })}
                  className="mt-2 text-red-600 hover:text-red-700 text-sm"
                >
                  画像を削除
                </button>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowImageSelector(!showImageSelector)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {showImageSelector ? '画像選択を閉じる' : 'Unsplashから選択'}
                </button>
                <span className="text-neutral-500 text-sm flex items-center">または</span>
              </div>
              
              <input
                type="url"
                value={formData.cover_image_url}
                onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="画像URLを直接入力"
              />
            </div>

            {/* Unsplash Image Selector */}
            {showImageSelector && (
              <div className="mt-4 p-4 border border-neutral-200 rounded-lg bg-neutral-50">
                <ImageSelector
                  category={formData.category}
                  selectedImage={formData.cover_image_url}
                  initialKeywords={formData.title}
                  onImageSelect={(imageUrl) => {
                    setFormData({ ...formData, cover_image_url: imageUrl })
                    setShowImageSelector(false)
                  }}
                />
              </div>
            )}
          </div>

          {/* External Sources */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              参考・引用元（外部ソース）
            </label>
            <div className="space-y-3">
              {/* 追加済みのソース一覧 */}
              {formData.external_sources.length > 0 && (
                <div className="space-y-2 mb-3">
                  {formData.external_sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <a 
                        href={source} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 underline text-sm truncate flex-1 mr-2"
                      >
                        {source}
                      </a>
                      <button
                        type="button"
                        onClick={() => removeExternalSource(index)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* 新規ソース追加フォーム */}
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addExternalSource()
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/article"
                />
                <button
                  type="button"
                  onClick={addExternalSource}
                  className="px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700"
                >
                  追加
                </button>
              </div>
              <p className="text-xs text-neutral-500">
                ニュース記事やブログ、公式発表など、この記事の参考にした外部ソースのURLを追加できます
              </p>
            </div>
          </div>

          {/* Technical Level (for tech articles) */}
          {formData.category === 'tech_deep_dive' && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                技術難易度
              </label>
              <select
                value={formData.technical_level}
                onChange={(e) => setFormData({ ...formData, technical_level: e.target.value as any })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="beginner">初級 - 基礎知識があれば理解可能</option>
                <option value="intermediate">中級 - 実務経験が必要</option>
                <option value="advanced">上級 - 専門知識が必要</option>
                <option value="expert">エキスパート - 高度な専門知識が必要</option>
              </select>
            </div>
          )}

          {/* Status and Premium */}
          <div className="flex space-x-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                ステータス
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="draft">下書き</option>
                <option value="published">公開</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_premium"
                checked={formData.is_premium}
                onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="is_premium" className="ml-2 block text-sm text-neutral-700">
                プレミアム記事
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-neutral-700">
                注目記事として表示
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/articles')}
            className="px-6 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50"
            disabled={isLoading}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? '作成中...' : '記事を作成'}
          </button>
        </div>
      </form>
    </div>
  )
}