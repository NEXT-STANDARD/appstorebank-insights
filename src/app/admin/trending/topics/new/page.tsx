'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, TrendingUp, Flame, ArrowUpRight, Image as ImageIcon } from 'lucide-react'
import { createTrendingTopic } from '@/lib/trending'
import ImageSelector from '@/components/ImageSelector'

export default function NewTrendingTopicPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showImageSelector, setShowImageSelector] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    view_count: 0,
    comment_count: 0,
    trending_type: 'new' as 'hot' | 'rising' | 'new',
    priority_order: 0,
    is_active: true,
    image_url: '',
    link: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              value
    }))
  }

  const handleImageSelect = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image_url: imageUrl
    }))
    setShowImageSelector(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { topic, error } = await createTrendingTopic(formData)
      
      if (error) {
        throw new Error(error.message || 'トピックの作成に失敗しました')
      }

      router.push('/admin/trending')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getTrendingIcon = (type: string) => {
    switch (type) {
      case 'hot':
        return <Flame className="w-4 h-4 text-red-500" />
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-orange-500" />
      case 'new':
        return <ArrowUpRight className="w-4 h-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/trending"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>戻る</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">注目トピック新規作成</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* タイトル */}
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              タイトル *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="注目トピックのタイトルを入力"
            />
          </div>

          {/* 説明 */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              説明
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="トピックの詳細な説明を入力"
            />
          </div>

          {/* カテゴリ */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリ *
            </label>
            <input
              type="text"
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="市場分析、技術解説など"
            />
          </div>

          {/* トレンドタイプ */}
          <div>
            <label htmlFor="trending_type" className="block text-sm font-medium text-gray-700 mb-2">
              トレンドタイプ *
            </label>
            <select
              id="trending_type"
              name="trending_type"
              required
              value={formData.trending_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="new">🆕 新着注目</option>
              <option value="rising">📈 トレンド</option>
              <option value="hot">🔥 人気急上昇</option>
            </select>
          </div>

          {/* 閲覧数 */}
          <div>
            <label htmlFor="view_count" className="block text-sm font-medium text-gray-700 mb-2">
              閲覧数
            </label>
            <input
              type="number"
              id="view_count"
              name="view_count"
              min="0"
              value={formData.view_count}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* コメント数 */}
          <div>
            <label htmlFor="comment_count" className="block text-sm font-medium text-gray-700 mb-2">
              コメント数
            </label>
            <input
              type="number"
              id="comment_count"
              name="comment_count"
              min="0"
              value={formData.comment_count}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 表示順序 */}
          <div>
            <label htmlFor="priority_order" className="block text-sm font-medium text-gray-700 mb-2">
              表示順序
            </label>
            <input
              type="number"
              id="priority_order"
              name="priority_order"
              min="0"
              value={formData.priority_order}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">小さい数字ほど上位に表示されます</p>
          </div>

          {/* リンク */}
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
              リンクURL *
            </label>
            <input
              type="url"
              id="link"
              name="link"
              required
              value={formData.link}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="/articles/article-slug または https://..."
            />
          </div>

          {/* 画像選択 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カバー画像
            </label>
            
            {formData.image_url ? (
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={formData.image_url}
                    alt="選択された画像"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 text-xs"
                  >
                    ×
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowImageSelector(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>画像を変更</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">画像を選択してください</p>
                  <button
                    type="button"
                    onClick={() => setShowImageSelector(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Unsplashから検索
                  </button>
                </div>
                <div className="text-center text-sm text-gray-500">または</div>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="画像URLを直接入力"
                />
              </div>
            )}
          </div>

          {/* アクティブ */}
          <div className="md:col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">アクティブ（表示する）</span>
            </label>
          </div>
        </div>

        {/* プレビュー */}
        {formData.title && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">プレビュー</h3>
            <div className="flex space-x-4 p-3 bg-white rounded-lg border">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8">
                <span className="text-lg font-bold text-yellow-500">1</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  {getTrendingIcon(formData.trending_type)}
                  <span className="text-xs font-medium text-gray-500">
                    {formData.trending_type === 'hot' ? '人気急上昇' :
                     formData.trending_type === 'rising' ? 'トレンド' : '新着注目'}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{formData.category}</span>
                </div>
                <h4 className="font-semibold text-gray-900">{formData.title}</h4>
                {formData.description && (
                  <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <span>👁</span>
                    <span>{formData.view_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <span>💬</span>
                    <span>{formData.comment_count}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 送信ボタン */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            href="/admin/trending"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? '作成中...' : '作成'}</span>
          </button>
        </div>
        
        {/* 画像選択モーダル */}
        {showImageSelector && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowImageSelector(false)}></div>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">画像を選択</h3>
                    <button
                      onClick={() => setShowImageSelector(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <span className="sr-only">閉じる</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <ImageSelector
                    onImageSelect={handleImageSelect}
                    selectedImage={formData.image_url}
                    category="market_analysis"
                    initialKeywords={formData.category || formData.title}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}