'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, AlertCircle, TrendingUp, FileText, Megaphone } from 'lucide-react'

export default function NewNewsTickerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    type: 'regulation' as 'regulation' | 'market' | 'announcement' | 'update',
    text: '',
    link: '',
    priority_order: 0,
    is_active: true,
    expires_at: ''
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
      console.log('Creating news ticker item:', formData)
      
      // 仮の成功処理
      setTimeout(() => {
        router.push('/admin/trending')
      }, 1000)
      
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'regulation':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'market':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-blue-500" />
      case 'update':
        return <FileText className="w-4 h-4 text-purple-500" />
      default:
        return null
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
        return ''
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
        <h1 className="text-2xl font-bold text-gray-900">ニュースティッカー新規作成</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <option value="regulation">⚖️ 法規制</option>
              <option value="market">📊 市場動向</option>
              <option value="announcement">📢 発表</option>
              <option value="update">📄 更新</option>
            </select>
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

          {/* テキスト */}
          <div className="md:col-span-2">
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
              テキスト *
            </label>
            <textarea
              id="text"
              name="text"
              required
              rows={3}
              value={formData.text}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="🎌 スマートフォン新法が2025年4月より施行開始"
            />
            <p className="text-xs text-gray-500 mt-1">絵文字を含めて魅力的なニュースとして記載してください</p>
          </div>

          {/* リンク */}
          <div className="md:col-span-2">
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

          {/* 有効期限 */}
          <div>
            <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700 mb-2">
              有効期限
            </label>
            <input
              type="datetime-local"
              id="expires_at"
              name="expires_at"
              value={formData.expires_at}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">設定しない場合は無期限で表示されます</p>
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
        {formData.text && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">プレビュー</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-y border-gray-200 p-3 rounded">
              <div className="flex items-center">
                <div className="flex items-center space-x-2 mr-4">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
                    速報
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(formData.type)}
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {getTypeLabel(formData.type)}
                    </span>
                    <span className="text-sm text-gray-800">{formData.text}</span>
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
      </form>
    </div>
  )
}