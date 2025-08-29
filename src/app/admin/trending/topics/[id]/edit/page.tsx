'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import ImageSelector from '@/components/ImageSelector'
import { supabase } from '@/lib/supabase-client'

export default function EditTrendingTopicPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [topic, setTopic] = useState({
    title: '',
    description: '',
    link: '',
    category: '',
    trending_type: 'hot' as 'hot' | 'rising' | 'new',
    view_count: 0,
    comment_count: 0,
    image_url: '',
    is_active: true
  })
  const [showImageSelector, setShowImageSelector] = useState(false)

  useEffect(() => {
    loadTopic()
  }, [params.id])

  const loadTopic = async () => {
    try {
      const { data, error } = await supabase
        .from('trending_topics')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      if (data) {
        setTopic(data)
      }
    } catch (error) {
      console.error('Error loading topic:', error)
      alert('トピックの読み込みに失敗しました')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('trending_topics')
        .update({
          ...topic,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)

      if (error) throw error

      alert('トピックを更新しました')
      router.push('/admin/trending')
    } catch (error) {
      console.error('Error updating topic:', error)
      alert('更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('このトピックを削除してもよろしいですか？')) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('trending_topics')
        .delete()
        .eq('id', params.id)

      if (error) throw error

      alert('トピックを削除しました')
      router.push('/admin/trending')
    } catch (error) {
      console.error('Error deleting topic:', error)
      alert('削除に失敗しました')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link 
            href="/admin/trending"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            管理画面に戻る
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">トレンドトピック編集</h1>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{deleting ? '削除中...' : '削除'}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タイトル
              </label>
              <input
                type="text"
                value={topic.title}
                onChange={(e) => setTopic({ ...topic, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                説明
              </label>
              <textarea
                value={topic.description}
                onChange={(e) => setTopic({ ...topic, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                リンク
              </label>
              <input
                type="text"
                value={topic.link}
                onChange={(e) => setTopic({ ...topic, link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="/articles/example"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カテゴリ
                </label>
                <input
                  type="text"
                  value={topic.category}
                  onChange={(e) => setTopic({ ...topic, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="市場分析"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  トレンドタイプ
                </label>
                <select
                  value={topic.trending_type}
                  onChange={(e) => setTopic({ ...topic, trending_type: e.target.value as 'hot' | 'rising' | 'new' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="hot">🔥 人気急上昇</option>
                  <option value="rising">📈 トレンド</option>
                  <option value="new">✨ 新着注目</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  閲覧数
                </label>
                <input
                  type="number"
                  value={topic.view_count}
                  onChange={(e) => setTopic({ ...topic, view_count: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  コメント数
                </label>
                <input
                  type="number"
                  value={topic.comment_count}
                  onChange={(e) => setTopic({ ...topic, comment_count: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                画像URL
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={topic.image_url}
                  onChange={(e) => setTopic({ ...topic, image_url: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  onClick={() => setShowImageSelector(true)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  画像を検索
                </button>
              </div>
              {topic.image_url && (
                <div className="mt-2">
                  <img
                    src={topic.image_url}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={topic.is_active}
                  onChange={(e) => setTopic({ ...topic, is_active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">アクティブ</span>
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/trending"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '更新中...' : '更新'}
              </button>
            </div>
          </form>
        </div>

        {topic.title && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">プレビュー</h2>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      topic.trending_type === 'hot' ? 'bg-red-100 text-red-600' :
                      topic.trending_type === 'rising' ? 'bg-orange-100 text-orange-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {topic.trending_type === 'hot' ? '🔥 人気急上昇' :
                       topic.trending_type === 'rising' ? '📈 トレンド' :
                       '✨ 新着注目'}
                    </span>
                    <span className="text-xs text-gray-500">{topic.category}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>👁 {topic.view_count.toLocaleString()}</span>
                    <span>💬 {topic.comment_count}</span>
                  </div>
                </div>
                {topic.image_url && (
                  <img
                    src={topic.image_url}
                    alt={topic.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {showImageSelector && (
        <ImageSelector
          onSelect={(url) => {
            setTopic({ ...topic, image_url: url })
            setShowImageSelector(false)
          }}
          onClose={() => setShowImageSelector(false)}
        />
      )}
    </div>
  )
}