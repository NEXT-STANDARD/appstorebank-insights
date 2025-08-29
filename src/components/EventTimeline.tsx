'use client'

import { Calendar, Flag, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  type: 'law' | 'launch' | 'deadline' | 'conference'
  link?: string
  isCompleted?: boolean
}

// サンプルデータ（実際はSupabaseから取得）
const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    date: '2024-09-01',
    title: 'デジタル市場競争会議',
    description: '第3回会合で新ガイドライン案を議論',
    type: 'conference',
    link: '/articles/digital-market-conference',
    isCompleted: false
  },
  {
    id: '2',
    date: '2024-10-15',
    title: 'アプリストア事業者向け説明会',
    description: '公正取引委員会主催の規制説明会',
    type: 'conference',
    isCompleted: false
  },
  {
    id: '3',
    date: '2025-01-01',
    title: 'サードパーティ決済義務化',
    description: 'アプリ内での代替決済手段の提供開始',
    type: 'law',
    isCompleted: false
  },
  {
    id: '4',
    date: '2025-04-01',
    title: 'スマートフォン新法施行',
    description: 'アプリストア自由化の完全実施',
    type: 'law',
    link: '/articles/smartphone-law-implementation',
    isCompleted: false
  },
  {
    id: '5',
    date: '2025-06-01',
    title: '楽天アプリストア正式オープン',
    description: '国内初の大手代替アプリストア',
    type: 'launch',
    isCompleted: false
  }
]

export default function EventTimeline() {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const formatted = date.toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric'
    })

    if (diffDays === 0) return `${formatted} (今日)`
    if (diffDays === 1) return `${formatted} (明日)`
    if (diffDays > 0 && diffDays <= 7) return `${formatted} (${diffDays}日後)`
    if (diffDays > 0 && diffDays <= 30) return `${formatted} (${Math.ceil(diffDays / 7)}週間後)`
    if (diffDays > 30) return `${formatted} (${Math.ceil(diffDays / 30)}ヶ月後)`
    return formatted
  }

  // 今後のイベントのみを表示（過去30日以内のものも含む）
  const upcomingEvents = timelineEvents.filter(event => {
    const eventDate = new Date(event.date)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return eventDate >= thirtyDaysAgo
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">重要日程</h2>
        </div>
        <Link 
          href="/events" 
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <span>すべて見る</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {upcomingEvents.slice(0, 5).map((event, index) => (
          <div 
            key={event.id}
            className={`relative flex items-start space-x-3 p-3 rounded-lg border-l-4 transition-all hover:shadow-md ${getEventColor(event.type)}`}
          >
            <div className="flex-shrink-0 text-2xl">
              {getEventIcon(event.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-xs font-medium text-gray-600">
                  {formatDate(event.date)}
                </span>
              </div>
              
              {event.link ? (
                <Link 
                  href={event.link}
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {event.title}
                </Link>
              ) : (
                <h3 className="font-semibold text-gray-900">
                  {event.title}
                </h3>
              )}
              
              <p className="text-sm text-gray-600 mt-1">
                {event.description}
              </p>
            </div>

            {index === 0 && (
              <div className="absolute -top-2 -right-2">
                <Flag className="w-4 h-4 text-red-500 animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          アプリストア自由化まで残り
          <span className="font-bold text-blue-600 mx-1">
            {Math.ceil((new Date('2025-04-01').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
          </span>
          日
        </p>
      </div>
    </div>
  )
}