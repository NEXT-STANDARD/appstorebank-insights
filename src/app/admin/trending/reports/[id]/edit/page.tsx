'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-client'

export default function EditWeeklyReportPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [report, setReport] = useState({
    title: '',
    description: '',
    week_start: '',
    week_end: '',
    highlights: [] as string[],
    key_metrics: {} as Record<string, any>,
    link: '',
    is_published: false
  })
  const [newHighlight, setNewHighlight] = useState('')

  useEffect(() => {
    loadReport()
  }, [params.id])

  const loadReport = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_reports')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      if (data) {
        setReport({
          ...data,
          week_start: data.week_start ? new Date(data.week_start).toISOString().split('T')[0] : '',
          week_end: data.week_end ? new Date(data.week_end).toISOString().split('T')[0] : '',
          highlights: data.highlights || [],
          key_metrics: data.key_metrics || {}
        })
      }
    } catch (error) {
      console.error('Error loading report:', error)
      alert('レポートの読み込みに失敗しました')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('weekly_reports')
        .update({
          ...report,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)

      if (error) throw error

      alert('レポートを更新しました')
      router.push('/admin/trending')
    } catch (error) {
      console.error('Error updating report:', error)
      alert('更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('このレポートを削除してもよろしいですか？')) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('weekly_reports')
        .delete()
        .eq('id', params.id)

      if (error) throw error

      alert('レポートを削除しました')
      router.push('/admin/trending')
    } catch (error) {
      console.error('Error deleting report:', error)
      alert('削除に失敗しました')
    } finally {
      setDeleting(false)
    }
  }

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setReport({
        ...report,
        highlights: [...report.highlights, newHighlight.trim()]
      })
      setNewHighlight('')
    }
  }

  const removeHighlight = (index: number) => {
    setReport({
      ...report,
      highlights: report.highlights.filter((_, i) => i !== index)
    })
  }

  const updateMetric = (key: string, value: string) => {
    setReport({
      ...report,
      key_metrics: {
        ...report.key_metrics,
        [key]: value
      }
    })
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
            <h1 className="text-2xl font-bold">週間レポート編集</h1>
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
                value={report.title}
                onChange={(e) => setReport({ ...report, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2025年第1週のトレンドレポート"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                説明
              </label>
              <textarea
                value={report.description}
                onChange={(e) => setReport({ ...report, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="今週の主要なトレンドと市場動向をまとめました"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  週の開始日
                </label>
                <input
                  type="date"
                  value={report.week_start}
                  onChange={(e) => setReport({ ...report, week_start: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  週の終了日
                </label>
                <input
                  type="date"
                  value={report.week_end}
                  onChange={(e) => setReport({ ...report, week_end: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ハイライト
              </label>
              <div className="space-y-2">
                {report.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                      {highlight}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      削除
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="新しいハイライトを追加"
                  />
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    追加
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                主要メトリクス
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    最も読まれた記事数
                  </label>
                  <input
                    type="text"
                    value={report.key_metrics.top_articles || ''}
                    onChange={(e) => updateMetric('top_articles', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    総閲覧数
                  </label>
                  <input
                    type="text"
                    value={report.key_metrics.total_views || ''}
                    onChange={(e) => updateMetric('total_views', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    新規記事数
                  </label>
                  <input
                    type="text"
                    value={report.key_metrics.new_articles || ''}
                    onChange={(e) => updateMetric('new_articles', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    エンゲージメント率
                  </label>
                  <input
                    type="text"
                    value={report.key_metrics.engagement_rate || ''}
                    onChange={(e) => updateMetric('engagement_rate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="15%"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                レポートリンク（オプション）
              </label>
              <input
                type="text"
                value={report.link || ''}
                onChange={(e) => setReport({ ...report, link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="/reports/2025-week-1"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={report.is_published}
                  onChange={(e) => setReport({ ...report, is_published: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">公開済み</span>
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

        {report.title && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">プレビュー</h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  {report.week_start && report.week_end && (
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(report.week_start).toLocaleDateString('ja-JP')} - {new Date(report.week_end).toLocaleDateString('ja-JP')}
                    </p>
                  )}
                </div>
                {report.is_published && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                    公開中
                  </span>
                )}
              </div>
              
              {report.highlights.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">ハイライト:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {report.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Object.keys(report.key_metrics).length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(report.key_metrics).map(([key, value]) => (
                    <div key={key} className="bg-white/50 rounded p-2">
                      <p className="text-xs text-gray-500">{key}</p>
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}