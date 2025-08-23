'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import ImageSelector from '@/components/ImageSelector'
import { categoryImageKeywords } from '@/lib/unsplash'

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
    category: 'market_analysis' as keyof typeof categoryImageKeywords,
    tags: [] as string[],
    status: 'draft',
    is_premium: false,
    cover_image_url: ''
  })

  useEffect(() => {
    loadArticle()
  }, [articleId])

  const loadArticle = async () => {
    try {
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
          category: data.category || 'market_analysis',
          tags: data.tags || [],
          status: data.status || 'draft',
          is_premium: data.is_premium || false,
          cover_image_url: data.cover_image_url || ''
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
    setIsSaving(true)

    try {
      const { user } = await getCurrentUser()
      if (!user) {
        alert('ログインが必要です')
        router.push('/admin/login')
        return
      }

      const updateData: any = {
        ...formData,
        updated_at: new Date().toISOString()
      }

      // ステータスが公開に変更された場合、公開日時を設定
      if (formData.status === 'published' && article?.status !== 'published') {
        updateData.published_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', articleId)

      if (error) {
        alert('記事の更新に失敗しました: ' + error.message)
      } else {
        alert('記事を更新しました')
        router.push('/admin/articles')
      }
    } catch (error: any) {
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
    <div className="max-w-4xl mx-auto">
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
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as keyof typeof categoryImageKeywords })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="market_analysis">市場分析</option>
              <option value="global_trends">グローバルトレンド</option>
              <option value="law_regulation">法規制</option>
              <option value="tech_deep_dive">技術解説</option>
            </select>
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