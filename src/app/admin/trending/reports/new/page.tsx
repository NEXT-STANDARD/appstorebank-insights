'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, FileText, Calendar } from 'lucide-react'

export default function NewWeeklyReportPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    week_start_date: '',
    week_end_date: '',
    report_content: '',
    cover_image_url: '',
    is_published: false,
    is_featured: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  // 週の開始日から終了日を自動計算
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = new Date(e.target.value)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6) // 6日後が終了日（7日間）
    
    setFormData(prev => ({
      ...prev,
      week_start_date: e.target.value,
      week_end_date: endDate.toISOString().split('T')[0]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // TODO: API実装後に置き換え
      console.log('Creating weekly report:', formData)
      
      // 仮の成功処理
      setTimeout(() => {
        router.push('/admin/trending')
      }, 1000)
      
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
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
        <h1 className="text-2xl font-bold text-gray-900">週間レポート新規作成</h1>
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
              レポートタイトル *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="第1週 アプリストア動向レポート"
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
              placeholder="今週最も読まれた記事をまとめた特別レポート"
            />
          </div>

          {/* 週開始日 */}
          <div>
            <label htmlFor="week_start_date" className="block text-sm font-medium text-gray-700 mb-2">
              週開始日（月曜日） *
            </label>
            <input
              type="date"
              id="week_start_date"
              name="week_start_date"
              required
              value={formData.week_start_date}
              onChange={handleStartDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 週終了日 */}
          <div>
            <label htmlFor="week_end_date" className="block text-sm font-medium text-gray-700 mb-2">
              週終了日（日曜日） *
            </label>
            <input
              type="date"
              id="week_end_date"
              name="week_end_date"
              required
              value={formData.week_end_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">開始日から自動計算されます</p>
          </div>

          {/* カバー画像 */}
          <div className="md:col-span-2">
            <label htmlFor="cover_image_url" className="block text-sm font-medium text-gray-700 mb-2">
              カバー画像URL
            </label>
            <input
              type="url"
              id="cover_image_url"
              name="cover_image_url"
              value={formData.cover_image_url}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          {/* レポート内容 */}
          <div className="md:col-span-2">
            <label htmlFor="report_content" className="block text-sm font-medium text-gray-700 mb-2">
              レポート内容
            </label>
            <textarea
              id="report_content"
              name="report_content"
              rows={8}
              value={formData.report_content}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="この週の主要な記事、統計情報、まとめなどを記載してください..."
            />
          </div>

          {/* 公開フラグ */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">公開する</span>
            </label>
          </div>

          {/* 注目フラグ */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">トップページに表示</span>
            </label>
          </div>
        </div>

        {/* プレビュー */}
        {formData.title && formData.week_start_date && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">プレビュー</h3>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-gray-500">
                      {formatDateForDisplay(formData.week_start_date)} - {formatDateForDisplay(formData.week_end_date)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    {formData.title}
                  </p>
                  {formData.description && (
                    <p className="text-xs text-gray-600">
                      {formData.description}
                    </p>
                  )}
                </div>
                <div className="ml-4">
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium"
                  >
                    レポートを見る
                  </button>
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