'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-client'

export default function EditNewsTickerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [news, setNews] = useState({
    title: '',
    link: '',
    type: 'regulation' as 'regulation' | 'market' | 'announcement' | 'update',
    is_active: true,
    priority: 0
  })

  useEffect(() => {
    loadNews()
  }, [params.id])

  const loadNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news_ticker_items')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      if (data) {
        setNews(data)
      }
    } catch (error) {
      console.error('Error loading news:', error)
      alert('ニュースの読み込みに失敗しました')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('news_ticker_items')
        .update({
          ...news,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)

      if (error) throw error

      alert('ニュースを更新しました')
      router.push('/admin/trending')
    } catch (error) {
      console.error('Error updating news:', error)
      alert('更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('このニュースを削除してもよろしいですか？')) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('news_ticker_items')
        .delete()
        .eq('id', params.id)

      if (error) throw error

      alert('ニュースを削除しました')
      router.push('/admin/trending')
    } catch (error) {
      console.error('Error deleting news:', error)
      alert('削除に失敗しました')
    } finally {
      setDeleting(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'regulation':
        return '⚖️'
      case 'market':
        return '📊'
      case 'announcement':
        return '📢'
      case 'update':
        return '🔄'
      default:
        return '📰'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'regulation':
        return '法規制'
      case 'market':
        return '市場動向'
      case 'announcement':
        return '発表'
      case 'update':
        return '更新'
      default:
        return 'ニュース'
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
            <h1 className="text-2xl font-bold">ニュースティッカー編集</h1>
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
                value={news.title}
                onChange={(e) => setNews({ ...news, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="スマートフォン新法が2025年4月より施行開始"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                リンク
              </label>
              <input
                type="text"
                value={news.link}
                onChange={(e) => setNews({ ...news, link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="/articles/smartphone-law-2025"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タイプ
                </label>
                <select
                  value={news.type}
                  onChange={(e) => setNews({ ...news, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="regulation">⚖️ 法規制</option>
                  <option value="market">📊 市場動向</option>
                  <option value="announcement">📢 発表</option>
                  <option value="update">🔄 更新</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  優先度
                </label>
                <input
                  type="number"
                  value={news.priority}
                  onChange={(e) => setNews({ ...news, priority: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="100"
                  placeholder="0-100 (高いほど優先)"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={news.is_active}
                  onChange={(e) => setNews({ ...news, is_active: e.target.checked })}
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

        {news.title && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">プレビュー</h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getTypeIcon(news.type)}</span>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {getTypeLabel(news.type)}
                </span>
                <span className="text-sm text-gray-800">{news.title}</span>
                {news.priority > 50 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded animate-pulse">
                    優先
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}