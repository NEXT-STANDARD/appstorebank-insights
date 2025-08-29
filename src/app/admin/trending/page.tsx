'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, TrendingUp, Calendar, Newspaper, FileText, Edit2, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'

interface TrendingTopic {
  id: string
  title: string
  description: string
  trending_type: string
  view_count: number
  is_active: boolean
}

interface NewsTickerItem {
  id: string
  title: string
  type: string
  priority: number
  is_active: boolean
}

interface TimelineEvent {
  id: string
  title: string
  description: string
  event_date: string
  event_type: string
  is_milestone: boolean
  is_active: boolean
}

interface WeeklyReport {
  id: string
  title: string
  description: string
  week_start: string
  week_end: string
  is_published: boolean
}

export default function TrendingManagementPage() {
  const [topics, setTopics] = useState<TrendingTopic[]>([])
  const [news, setNews] = useState<NewsTickerItem[]>([])
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [reports, setReports] = useState<WeeklyReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load trending topics
      const { data: topicsData } = await supabase
        .from('trending_topics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (topicsData) setTopics(topicsData)

      // Load news ticker items
      const { data: newsData } = await supabase
        .from('news_ticker_items')
        .select('*')
        .order('priority', { ascending: false })
        .limit(10)
      
      if (newsData) setNews(newsData)

      // Load timeline events
      const { data: eventsData } = await supabase
        .from('timeline_events')
        .select('*')
        .order('event_date', { ascending: true })
        .limit(10)
      
      if (eventsData) setEvents(eventsData)

      // Load weekly reports
      const { data: reportsData } = await supabase
        .from('weekly_reports')
        .select('*')
        .order('week_start', { ascending: false })
        .limit(10)
      
      if (reportsData) setReports(reportsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (table: string, id: string, name: string) => {
    if (!confirm(`「${name}」を削除してもよろしいですか？`)) return

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error
      
      alert('削除しました')
      loadData()
    } catch (error) {
      console.error('Error deleting:', error)
      alert('削除に失敗しました')
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">トレンド管理</h1>
        <p className="text-gray-600">注目トピック、ニュースティッカー、イベントタイムラインを管理します。</p>
      </div>

      {/* 注目トピック管理 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900">注目トピック</h2>
            </div>
            <Link
              href="/admin/trending/topics/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>新規作成</span>
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">読み込み中...</div>
          ) : topics.length > 0 ? (
            <div className="space-y-3">
              {topics.map((topic) => (
                <div key={topic.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        topic.trending_type === 'hot' ? 'bg-red-100 text-red-600' :
                        topic.trending_type === 'rising' ? 'bg-orange-100 text-orange-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {topic.trending_type === 'hot' ? '🔥 人気' :
                         topic.trending_type === 'rising' ? '📈 上昇' :
                         '✨ 新着'}
                      </span>
                      {!topic.is_active && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">非公開</span>
                      )}
                    </div>
                    <h3 className="font-semibold">{topic.title}</h3>
                    <p className="text-sm text-gray-600">{topic.description}</p>
                    <p className="text-xs text-gray-500 mt-1">閲覧数: {topic.view_count.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/trending/topics/${topic.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete('trending_topics', topic.id, topic.title)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>まだトピックがありません。</p>
              <p className="text-sm mt-2">新規作成から追加してください。</p>
            </div>
          )}
        </div>
      </div>

      {/* ニュースティッカー管理 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Newspaper className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">ニュースティッカー</h2>
            </div>
            <Link
              href="/admin/trending/news/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>新規作成</span>
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">読み込み中...</div>
          ) : news.length > 0 ? (
            <div className="space-y-3">
              {news.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="w-4 h-4">
                      {item.type === 'regulation' ? '⚖️' :
                       item.type === 'market' ? '📊' :
                       item.type === 'announcement' ? '📢' :
                       '🔄'}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {item.type === 'regulation' ? '法規制' :
                       item.type === 'market' ? '市場' :
                       item.type === 'announcement' ? '発表' :
                       '更新'}
                    </span>
                    <span className="text-sm">{item.title}</span>
                    {!item.is_active && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">非公開</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">優先度: {item.priority}</span>
                    <Link
                      href={`/admin/trending/news/${item.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete('news_ticker_items', item.id, item.title)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>ニュースティッカーの項目を管理できます。</p>
              <p className="text-sm mt-2">自動ローテーション表示の設定も可能です。</p>
            </div>
          )}
        </div>
      </div>

      {/* イベントタイムライン管理 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-900">イベントタイムライン</h2>
            </div>
            <Link
              href="/admin/trending/events/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>新規作成</span>
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">読み込み中...</div>
          ) : events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className={`flex items-start space-x-3 p-3 border-l-4 ${
                  event.event_type === 'regulation' ? 'border-red-500 bg-red-50' :
                  event.event_type === 'market' ? 'border-blue-500 bg-blue-50' :
                  event.event_type === 'technology' ? 'border-green-500 bg-green-50' :
                  'border-gray-500 bg-gray-50'
                } rounded-lg`}>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs text-gray-600">
                        {new Date(event.event_date).toLocaleDateString('ja-JP')}
                      </span>
                      {getDaysRemaining(event.event_date) > 0 && (
                        <span className="text-xs text-blue-600 font-semibold">
                          残り{getDaysRemaining(event.event_date)}日
                        </span>
                      )}
                      {event.is_milestone && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                          重要
                        </span>
                      )}
                      {!event.is_active && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">非公開</span>
                      )}
                    </div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/trending/events/${event.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete('timeline_events', event.id, event.title)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>重要な業界イベントの日程を管理できます。</p>
              <p className="text-sm mt-2">自動的に残り日数が計算されます。</p>
            </div>
          )}
        </div>
      </div>

      {/* 週間レポート管理 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900">週間トレンドレポート</h2>
            </div>
            <Link
              href="/admin/trending/reports/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>新規作成</span>
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">読み込み中...</div>
          ) : reports.length > 0 ? (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs text-gray-600">
                        {new Date(report.week_start).toLocaleDateString('ja-JP')} - {new Date(report.week_end).toLocaleDateString('ja-JP')}
                      </span>
                      {report.is_published ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">公開中</span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">下書き</span>
                      )}
                    </div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/trending/reports/${report.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete('weekly_reports', report.id, report.title)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>週間トレンドレポートを作成・管理できます。</p>
              <p className="text-sm mt-2">人気記事をまとめた特別レポートを配信しましょう。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}