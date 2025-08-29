'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Calendar } from 'lucide-react'

export default function NewTimelineEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    description: '',
    type: 'law' as 'law' | 'launch' | 'deadline' | 'conference',
    link: '',
    is_completed: false,
    is_active: true,
    priority_order: 0
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // TODO: API実装後に置き換え
      console.log('Creating timeline event:', formData)
      
      // 仮の成功処理
      setTimeout(() => {
        router.push('/admin/trending')
      }, 1000)
      
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'law':
        return '⚖️'
      case 'launch':
        return '🚀'
      case 'deadline':
        return '⏰'
      case 'conference':
        return '🎯'
      default:
        return '📌'
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'law':
        return 'border-red-500 bg-red-50'
      case 'launch':
        return 'border-blue-500 bg-blue-50'
      case 'deadline':
        return 'border-yellow-500 bg-yellow-50'
      case 'conference':
        return 'border-purple-500 bg-purple-50'
      default:
        return 'border-gray-500 bg-gray-50'
    }
  }

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateDaysFromNow = (dateString: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return '今日'
    if (diffDays === 1) return '明日'
    if (diffDays > 0) return `${diffDays}日後`
    if (diffDays === -1) return '昨日'
    if (diffDays < 0) return `${Math.abs(diffDays)}日前`
    return null
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
        <h1 className="text-2xl font-bold text-gray-900">イベントタイムライン新規作成</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 日付 */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              日付 *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* タイプ */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              タイプ *
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="law">⚖️ 法規制</option>
              <option value="launch">🚀 新サービス開始</option>
              <option value="deadline">⏰ 締切・期限</option>
              <option value="conference">🎯 会議・イベント</option>
            </select>
          </div>

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
              placeholder="スマートフォン新法施行"
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
              placeholder="アプリストア自由化の完全実施"
            />
          </div>

          {/* リンク */}
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
              リンクURL
            </label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="/articles/article-slug または https://..."
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
            <p className="text-xs text-gray-500 mt-1">同じ日の中での表示順序</p>
          </div>

          {/* 完了フラグ */}
          <div>
            <label className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                name="is_completed"
                checked={formData.is_completed}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">完了済み</span>
            </label>
          </div>

          {/* アクティブ */}
          <div>
            <label className="flex items-center space-x-2 mt-6">
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
        {formData.title && formData.date && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">プレビュー</h3>
            <div className={`flex items-start space-x-3 p-3 rounded-lg border-l-4 ${getEventColor(formData.type)}`}>
              <div className="flex-shrink-0 text-2xl">
                {getEventIcon(formData.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-600">
                    {formatDateForDisplay(formData.date)}
                  </span>
                  {calculateDaysFromNow(formData.date) && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs font-semibold text-blue-600">
                        {calculateDaysFromNow(formData.date)}
                      </span>
                    </>
                  )}
                </div>
                
                <h4 className="font-semibold text-gray-900">{formData.title}</h4>
                
                {formData.description && (
                  <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
                )}
                
                {formData.is_completed && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    完了済み
                  </span>
                )}
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
      </form>
    </div>
  )
}