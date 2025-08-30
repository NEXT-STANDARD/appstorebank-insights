'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-client'

export default function EditTimelineEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [eventId, setEventId] = useState<string>('')
  const [event, setEvent] = useState({
    title: '',
    description: '',
    event_date: '',
    event_type: 'regulation' as 'regulation' | 'market' | 'technology' | 'general',
    link: '',
    is_milestone: false,
    is_active: true
  })

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setEventId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (eventId) {
      loadEvent()
    }
  }, [eventId])

  const loadEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .eq('id', eventId)
        .single()

      if (error) throw error
      if (data) {
        setEvent({
          ...data,
          event_date: data.event_date ? new Date(data.event_date).toISOString().split('T')[0] : ''
        })
      }
    } catch (error) {
      console.error('Error loading event:', error)
      alert('イベントの読み込みに失敗しました')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('timeline_events')
        .update({
          ...event,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)

      if (error) throw error

      alert('イベントを更新しました')
      router.push('/admin/trending')
    } catch (error) {
      console.error('Error updating event:', error)
      alert('更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('このイベントを削除してもよろしいですか？')) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('timeline_events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      alert('イベントを削除しました')
      router.push('/admin/trending')
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('削除に失敗しました')
    } finally {
      setDeleting(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'regulation':
        return 'bg-red-500'
      case 'market':
        return 'bg-blue-500'
      case 'technology':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'regulation':
        return '法規制'
      case 'market':
        return '市場'
      case 'technology':
        return '技術'
      case 'general':
        return '一般'
      default:
        return ''
    }
  }

  const getDaysRemaining = (date: string) => {
    const eventDate = new Date(date)
    const today = new Date()
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
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
            <h1 className="text-2xl font-bold">タイムラインイベント編集</h1>
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
                value={event.title}
                onChange={(e) => setEvent({ ...event, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="スマートフォン新法施行"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                説明
              </label>
              <textarea
                value={event.description}
                onChange={(e) => setEvent({ ...event, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="アプリストア開放を義務付ける新法が施行"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  イベント日
                </label>
                <input
                  type="date"
                  value={event.event_date}
                  onChange={(e) => setEvent({ ...event, event_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  イベントタイプ
                </label>
                <select
                  value={event.event_type}
                  onChange={(e) => setEvent({ ...event, event_type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="regulation">法規制</option>
                  <option value="market">市場</option>
                  <option value="technology">技術</option>
                  <option value="general">一般</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                リンク（オプション）
              </label>
              <input
                type="text"
                value={event.link || ''}
                onChange={(e) => setEvent({ ...event, link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="/articles/example"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={event.is_milestone}
                  onChange={(e) => setEvent({ ...event, is_milestone: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">重要なマイルストーン</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={event.is_active}
                  onChange={(e) => setEvent({ ...event, is_active: e.target.checked })}
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

        {event.title && event.event_date && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">プレビュー</h2>
            <div className="border-l-4 border-gray-300 pl-4">
              <div className="flex items-start">
                <div className={`w-3 h-3 ${getTypeColor(event.event_type)} rounded-full -ml-6 mt-1`}></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    {event.is_milestone && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        重要
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{new Date(event.event_date).toLocaleDateString('ja-JP')}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded">
                      {getTypeLabel(event.event_type)}
                    </span>
                    {getDaysRemaining(event.event_date) > 0 && (
                      <span className="text-blue-600 font-medium">
                        残り {getDaysRemaining(event.event_date)} 日
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}