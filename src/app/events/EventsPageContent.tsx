'use client'

import { useState } from 'react'
import { Calendar, Clock, Filter, AlertCircle, TrendingUp, Megaphone, FileText, ArrowLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  type: 'law' | 'launch' | 'deadline' | 'conference' | 'announcement' | 'market'
  link?: string
  isCompleted?: boolean
  details?: string[]
}

// 全イベントデータ（実際はSupabaseから取得予定）
const allEvents: TimelineEvent[] = [
  {
    id: '1',
    date: '2024-06-10',
    title: '改正スマートフォン法案成立',
    description: 'アプリストア自由化を規定する法案が国会で成立',
    type: 'law',
    isCompleted: true,
    details: [
      'アプリストア事業者への規制強化',
      'サードパーティストアの参入要件明確化',
      '手数料率の上限設定'
    ]
  },
  {
    id: '2',
    date: '2024-09-01',
    title: 'デジタル市場競争会議',
    description: '第3回会合で新ガイドライン案を議論',
    type: 'conference',
    link: '/articles/digital-market-conference',
    isCompleted: false
  },
  {
    id: '3',
    date: '2024-10-15',
    title: 'アプリストア事業者向け説明会',
    description: '公正取引委員会主催の規制説明会',
    type: 'conference',
    isCompleted: false,
    details: [
      '参加対象：アプリストア事業者、アプリ開発者',
      '会場：東京国際フォーラム',
      'オンライン配信あり'
    ]
  },
  {
    id: '4',
    date: '2024-11-01',
    title: 'パブリックコメント募集開始',
    description: 'アプリストア規制ガイドラインへの意見募集',
    type: 'deadline',
    isCompleted: false
  },
  {
    id: '5',
    date: '2024-12-15',
    title: 'パブリックコメント募集締切',
    description: 'ガイドライン案への意見募集期限',
    type: 'deadline',
    isCompleted: false
  },
  {
    id: '6',
    date: '2025-01-01',
    title: 'サードパーティ決済義務化',
    description: 'アプリ内での代替決済手段の提供開始',
    type: 'law',
    isCompleted: false,
    details: [
      '対象：年間売上10億円以上のアプリストア',
      '決済手数料の上限：15%',
      '既存決済との併用必須'
    ]
  },
  {
    id: '7',
    date: '2025-03-01',
    title: '事業者登録受付開始',
    description: '第三者アプリストア事業者の登録申請開始',
    type: 'announcement',
    isCompleted: false
  },
  {
    id: '8',
    date: '2025-06-01',
    title: '楽天アプリストア正式オープン',
    description: '国内初の大手代替アプリストア',
    type: 'launch',
    isCompleted: false,
    details: [
      '初期登録アプリ数：10,000本以上',
      '手数料率：15%（初年度10%）',
      '楽天ポイント連携'
    ]
  },
  {
    id: '9',
    date: '2025-09-01',
    title: 'ドコモアプリマーケット拡張',
    description: 'dマーケットを第三者アプリストアとして拡張',
    type: 'launch',
    isCompleted: false
  },
  {
    id: '10',
    date: '2025-12-18',
    title: 'スマートフォン新法完全施行',
    description: 'アプリストア自由化の完全実施',
    type: 'law',
    link: '/articles/smartphone-law-implementation',
    isCompleted: false,
    details: [
      'すべての規制項目が発効',
      '違反への罰則適用開始',
      '年次報告書の提出義務化'
    ]
  },
  {
    id: '11',
    date: '2026-03-31',
    title: '初年度実施状況報告',
    description: 'アプリストア自由化の効果検証レポート公表',
    type: 'announcement',
    isCompleted: false
  }
]

export default function EventsPageContent() {
  const [filterType, setFilterType] = useState<string>('all')
  const [showPastEvents, setShowPastEvents] = useState(false)

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
      case 'announcement':
        return '📢'
      case 'market':
        return '📊'
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
      case 'announcement':
        return 'border-green-500 bg-green-50'
      case 'market':
        return 'border-indigo-500 bg-indigo-50'
      default:
        return 'border-gray-500 bg-gray-50'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'law':
        return '法規制'
      case 'launch':
        return 'サービス開始'
      case 'deadline':
        return '締切'
      case 'conference':
        return 'カンファレンス'
      case 'announcement':
        return '発表'
      case 'market':
        return '市場動向'
      default:
        return 'その他'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const formatted = date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    })

    if (diffDays === 0) return `${formatted} (今日)`
    if (diffDays === 1) return `${formatted} (明日)`
    if (diffDays === -1) return `${formatted} (昨日)`
    if (diffDays > 0 && diffDays <= 7) return `${formatted} (${diffDays}日後)`
    if (diffDays < 0 && diffDays >= -7) return `${formatted} (${Math.abs(diffDays)}日前)`
    if (diffDays > 7 && diffDays <= 30) return `${formatted} (${Math.ceil(diffDays / 7)}週間後)`
    if (diffDays > 30) return `${formatted} (${Math.ceil(diffDays / 30)}ヶ月後)`
    if (diffDays < -30) return `${formatted} (${Math.abs(Math.ceil(diffDays / 30))}ヶ月前)`
    return formatted
  }

  // フィルタリングとソート
  const filteredEvents = allEvents
    .filter(event => {
      const eventDate = new Date(event.date)
      const now = new Date()
      const isPast = eventDate < now

      if (!showPastEvents && isPast) return false
      if (filterType === 'all') return true
      return event.type === filterType
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const upcomingCount = allEvents.filter(event => new Date(event.date) >= new Date()).length
  const pastCount = allEvents.filter(event => new Date(event.date) < new Date()).length

  // カウントダウン計算
  const targetDate = new Date('2025-12-18')
  const today = new Date()
  const daysRemaining = Math.max(0, Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* パンくずリスト */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              ホーム
            </Link>
          </li>
          <li className="text-gray-400">
            <ChevronRight className="w-4 h-4" />
          </li>
          <li className="text-gray-900 font-medium">重要日程</li>
        </ol>
      </nav>

      {/* ヘッダー */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">重要日程・イベントカレンダー</h1>
            <p className="text-gray-600">アプリストア自由化に関する重要な日程と業界イベント</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">{daysRemaining}</div>
            <div className="text-sm text-gray-500">日後</div>
            <div className="text-xs text-gray-400 mt-1">新法施行まで</div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">今後のイベント</p>
                <p className="text-2xl font-bold text-blue-900">{upcomingCount}件</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">過去のイベント</p>
                <p className="text-2xl font-bold text-gray-900">{pastCount}件</p>
              </div>
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">次の重要日程</p>
                <p className="text-lg font-bold text-red-900">
                  {filteredEvents.find(e => new Date(e.date) >= new Date())?.title.substring(0, 10) || 'なし'}...
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* フィルター */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">フィルター</h2>
          </div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPastEvents}
              onChange={(e) => setShowPastEvents(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">過去のイベントを表示</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            すべて
          </button>
          {['law', 'launch', 'deadline', 'conference', 'announcement', 'market'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                filterType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{getEventIcon(type)}</span>
              <span>{getTypeLabel(type)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* タイムライン */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        
        <div className="space-y-8">
          {filteredEvents.map((event, index) => {
            const isPast = new Date(event.date) < new Date()
            
            return (
              <div key={event.id} className="relative flex items-start">
                {/* タイムラインドット */}
                <div className={`absolute left-6 w-4 h-4 rounded-full border-4 ${
                  isPast 
                    ? 'bg-gray-400 border-gray-200' 
                    : 'bg-white border-blue-600'
                } z-10`}></div>
                
                {/* イベントカード */}
                <div className={`ml-16 flex-1 ${isPast ? 'opacity-60' : ''}`}>
                  <div className={`p-6 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-shadow ${getEventColor(event.type)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{getEventIcon(event.type)}</span>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              isPast ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {getTypeLabel(event.type)}
                            </span>
                            <span className="text-sm text-gray-500">{formatDate(event.date)}</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {event.link ? (
                              <Link href={event.link} className="hover:text-blue-600 transition-colors">
                                {event.title}
                              </Link>
                            ) : (
                              event.title
                            )}
                          </h3>
                        </div>
                      </div>
                      {event.isCompleted && (
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                          完了
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-3">{event.description}</p>
                    
                    {event.details && (
                      <div className="bg-white bg-opacity-60 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">詳細情報：</h4>
                        <ul className="space-y-1">
                          {event.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                              <ChevronRight className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* データがない場合 */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">該当するイベントはありません</p>
        </div>
      )}
    </div>
  )
}