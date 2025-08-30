'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import ImageSelector from '@/components/ImageSelector'
import { categoryImageKeywords } from '@/lib/unsplash'
import { getActiveCategories } from '@/lib/categories'
import type { Category } from '@/lib/categories'
import Link from 'next/link'

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
  author_id?: string
  published_at?: string
  cover_image_url?: string
  external_sources?: string[]
  is_featured?: boolean
}

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showImageSelector, setShowImageSelector] = useState(false)
  const [article, setArticle] = useState<Article | null>(null)
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
    cover_image_url: '',
    external_sources: [] as string[]
  })
  const [newSourceUrl, setNewSourceUrl] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    loadArticle()
    loadCategories()
  }, [articleId])

  // 記事とカテゴリが両方読み込まれた後、カテゴリの妥当性をチェック
  useEffect(() => {
    if (categories.length > 0 && article && formData.category) {
      const categoryExists = categories.find(cat => cat.slug === formData.category)
      if (!categoryExists) {
        console.warn(`Category "${formData.category}" not found in active categories, setting to first available category`)
        setFormData(prev => ({ ...prev, category: categories[0].slug }))
      }
    }
    // 記事は読み込まれたがカテゴリが空の場合（初期化エラー）
    else if (categories.length > 0 && article && !formData.category) {
      console.warn(`No category set for article, setting to first available category`)
      setFormData(prev => ({ ...prev, category: categories[0].slug }))
    }
  }, [categories, article, formData.category])

  const loadCategories = async () => {
    const { categories: data, error } = await getActiveCategories()
    if (error) {
      console.error('Error loading categories:', error)
    } else {
      setCategories(data)
      
      // 記事データの読み込みとカテゴリの初期化は、記事データが読み込まれた後に行う
      // ここでは自動選択はしない
    }
  }

  const loadArticle = async () => {
    try {
      if (!supabase) return
      
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single()

      if (error) {
        console.error('Error loading article:', error)
        alert('記事の読み込みに失敗しました')
        router.push('/admin/articles')
        return
      }

      if (data) {
        setArticle(data)
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          slug: data.slug || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          category: data.category || '',
          tags: data.tags || [],
          status: data.status || 'draft',
          is_premium: data.is_premium || false,
          is_featured: data.is_featured || false,
          cover_image_url: data.cover_image_url || '',
          external_sources: data.external_sources || []
        })
      }
    } catch (error) {
      console.error('Error:', error)
      alert('エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

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
    
    // 選択されたカテゴリが有効かチェック
    const selectedCategory = categories.find(cat => cat.slug === formData.category)
    if (!selectedCategory) {
      alert('選択されたカテゴリが見つかりません。カテゴリを選び直してください。')
      return
    }

    
    setIsSaving(true)

    try {
      const { user } = await getCurrentUser()
      if (!user) {
        alert('ログインが必要です')
        router.push('/admin/login')
        return
      }

      // 更新データを準備
      const updateData: any = {
        title: formData.title.trim(),
        subtitle: formData.subtitle?.trim() || null,
        slug: formData.slug.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt?.trim() || null,
        category: formData.category,
        tags: formData.tags || [],
        status: formData.status,
        is_premium: formData.is_premium,
        is_featured: formData.is_featured,
        cover_image_url: formData.cover_image_url || null,
        external_sources: formData.external_sources || [],
        updated_at: new Date().toISOString()
      }

      // ステータスが公開に変更された場合、公開日時を設定
      if (formData.status === 'published' && article?.status !== 'published') {
        updateData.published_at = new Date().toISOString()
      }

      if (!supabase) {
        alert('データベース接続エラー')
        return
      }
      
      const { error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', articleId)

      if (error) {
        console.error('Supabase update error:', error)
        alert('記事の更新に失敗しました: ' + error.message)
      } else {
        alert('記事を更新しました')
        router.push('/admin/articles')
      }
    } catch (error: any) {
      console.error('Update error:', error)
      alert('エラーが発生しました: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('この記事を削除してもよろしいですか？この操作は取り消せません。')) {
      return
    }

    setIsSaving(true)
    try {
      if (!supabase) return
      
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId)

      if (error) {
        alert('記事の削除に失敗しました: ' + error.message)
      } else {
        alert('記事を削除しました')
        router.push('/admin/articles')
      }
    } catch (error: any) {
      alert('エラーが発生しました: ' + error.message)
    } finally {
      setIsSaving(false)
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">記事が見つかりません</p>
      </div>
    )
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">記事編集</h1>
        <button
          onClick={handleDelete}
          disabled={isSaving}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          削除
        </button>
      </div>

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
              <div className="space-y-2">
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
                {/* 既存のカテゴリが見つからない場合の警告 */}
                {formData.category && !categories.find(cat => cat.slug === formData.category) && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm text-yellow-800 font-medium">
                          現在のカテゴリ「{formData.category}」が見つかりません
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                          上記のカテゴリから選択し直してください
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
              rows={20}
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
                <option value="archived">アーカイブ</option>
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
            disabled={isSaving}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? '更新中...' : '記事を更新'}
          </button>
        </div>
      </form>
    </div>
  )
}