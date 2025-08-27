'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCategoryById, updateCategory } from '@/lib/categories'
import type { Category } from '@/lib/categories'

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [category, setCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sort_order: 0,
    is_active: true
  })

  useEffect(() => {
    loadCategory()
  }, [id])

  const loadCategory = async () => {
    const { category: data, error } = await getCategoryById(id)
    
    if (error) {
      console.error('Error loading category:', error)
      alert('カテゴリの読み込みに失敗しました')
      router.push('/admin/categories')
      return
    }
    
    if (data) {
      setCategory(data)
      setFormData({
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        sort_order: data.sort_order || 0,
        is_active: data.is_active !== false
      })
    }
    
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.slug) {
      alert('カテゴリ名とスラッグは必須です')
      return
    }
    
    setIsSaving(true)

    const { category: updated, error } = await updateCategory(id, {
      name: formData.name,
      slug: formData.slug,
      description: formData.description || null,
      sort_order: formData.sort_order,
      is_active: formData.is_active
    })

    if (error) {
      alert('カテゴリの更新に失敗しました: ' + error.message)
    } else if (updated) {
      alert('カテゴリを更新しました')
      router.push('/admin/categories')
    }
    
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">カテゴリが見つかりません</p>
        <Link href="/admin/categories" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          カテゴリ一覧に戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">カテゴリ編集</h1>
        <Link
          href="/admin/categories"
          className="text-neutral-600 hover:text-neutral-800"
        >
          戻る
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 space-y-6">
          {/* カテゴリ名 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              カテゴリ名（表示名） *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="例：企業ニュース"
            />
            <p className="mt-1 text-sm text-neutral-500">
              サイトに表示される名前です
            </p>
          </div>

          {/* スラッグ */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              スラッグ（URL用） *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => {
                const slug = e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9-_]/g, '')
                setFormData({ ...formData, slug })
              }}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="例：enterprise-news"
            />
            <p className="mt-1 text-sm text-neutral-500">
              URLやデータベースで使用される識別子です（英数字、ハイフン、アンダースコアのみ）
            </p>
          </div>

          {/* 説明 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              説明
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="このカテゴリの説明を入力..."
            />
          </div>

          {/* 並び順 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              並び順
            </label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="0"
            />
            <p className="mt-1 text-sm text-neutral-500">
              数字が小さいほど上に表示されます
            </p>
          </div>

          {/* 有効/無効 */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <span className="text-sm font-medium text-neutral-700">
                有効にする
              </span>
            </label>
            <p className="mt-1 text-sm text-neutral-500 ml-7">
              無効にすると、記事作成時に選択できなくなります
            </p>
          </div>
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/categories"
            className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {isSaving ? '更新中...' : 'カテゴリを更新'}
          </button>
        </div>
      </form>
    </div>
  )
}