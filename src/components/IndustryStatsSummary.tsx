'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Download, Smartphone, DollarSign, Globe, Users, Clock, Zap, Info } from 'lucide-react'

interface StatItem {
  id: string
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
  color: string
  description: string
  source: string
}

interface StatCategory {
  id: string
  title: string
  icon: React.ReactNode
  color: string
  stats: StatItem[]
}

const industryStats: StatCategory[] = [
  {
    id: 'market-overview',
    title: '市場概況',
    icon: <Globe className="w-5 h-5" />,
    color: 'blue',
    stats: [
      {
        id: 'global-downloads',
        title: 'グローバルダウンロード数',
        value: '2,550億',
        change: '+12.3%',
        trend: 'up',
        icon: <Download className="w-4 h-4" />,
        color: 'blue',
        description: '2024年アプリダウンロード総数（前年比）',
        source: 'App Annie'
      },
      {
        id: 'market-size',
        title: 'アプリ市場規模',
        value: '¥12.8兆',
        change: '+18.7%',
        trend: 'up',
        icon: <DollarSign className="w-4 h-4" />,
        color: 'green',
        description: '日本のモバイルアプリ市場規模',
        source: 'MMD研究所'
      },
      {
        id: 'active-developers',
        title: 'アクティブ開発者数',
        value: '340万人',
        change: '+8.9%',
        trend: 'up',
        icon: <Users className="w-4 h-4" />,
        color: 'purple',
        description: '世界のアプリ開発者登録数',
        source: 'Developer Economics'
      }
    ]
  },
  {
    id: 'user-behavior',
    title: 'ユーザー行動',
    icon: <Smartphone className="w-5 h-5" />,
    color: 'orange',
    stats: [
      {
        id: 'daily-usage',
        title: '平均利用時間',
        value: '4.8時間',
        change: '+15.2%',
        trend: 'up',
        icon: <Clock className="w-4 h-4" />,
        color: 'orange',
        description: '1日あたりのスマホアプリ利用時間',
        source: 'App Annie'
      },
      {
        id: 'session-length',
        title: '平均セッション時間',
        value: '23分',
        change: '+3.1%',
        trend: 'up',
        icon: <Zap className="w-4 h-4" />,
        color: 'yellow',
        description: 'アプリ1回あたりの平均利用時間',
        source: 'Flurry Analytics'
      },
      {
        id: 'retention-rate',
        title: '30日継続率',
        value: '24.3%',
        change: '-2.1%',
        trend: 'down',
        icon: <TrendingUp className="w-4 h-4" />,
        color: 'red',
        description: 'インストール後30日間の継続利用率',
        source: 'AppsFlyer'
      }
    ]
  }
]

const japanSpecificStats = [
  {
    title: 'スマホ新法関連',
    stats: [
      { label: '第三者ストア認知度', value: '23%', trend: 'up', change: '+8.4%' },
      { label: '開発者の関心度', value: '67%', trend: 'up', change: '+15.2%' },
      { label: '予想移行率', value: '12%', trend: 'neutral', change: '±0%' }
    ]
  },
  {
    title: '日本市場特性',
    stats: [
      { label: 'iOS市場シェア', value: '68.2%', trend: 'down', change: '-1.3%' },
      { label: 'アプリ内課金率', value: '15.7%', trend: 'up', change: '+4.2%' },
      { label: '平均課金額', value: '¥2,340', trend: 'up', change: '+7.8%' }
    ]
  }
]

export default function IndustryStatsSummary() {
  const [selectedCategory, setSelectedCategory] = useState('market-overview')
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // 数値アニメーション
    industryStats.forEach(category => {
      category.stats.forEach(stat => {
        const numericValue = parseFloat(stat.value.replace(/[^\d.]/g, ''))
        if (numericValue) {
          let current = 0
          const increment = numericValue / 60
          const timer = setInterval(() => {
            current += increment
            if (current >= numericValue) {
              current = numericValue
              clearInterval(timer)
            }
            setAnimatedValues(prev => ({
              ...prev,
              [stat.id]: current
            }))
          }, 16)
        }
      })
    })
  }, [])

  const formatAnimatedValue = (originalValue: string, animatedValue: number): string => {
    if (originalValue.includes('億')) {
      return `${Math.round(animatedValue)}億`
    } else if (originalValue.includes('兆')) {
      return `¥${(animatedValue / 1000).toFixed(1)}兆`
    } else if (originalValue.includes('万')) {
      return `${Math.round(animatedValue)}万人`
    } else if (originalValue.includes('時間')) {
      return `${animatedValue.toFixed(1)}時間`
    } else if (originalValue.includes('分')) {
      return `${Math.round(animatedValue)}分`
    } else if (originalValue.includes('%')) {
      return `${animatedValue.toFixed(1)}%`
    } else if (originalValue.includes('¥')) {
      return `¥${Math.round(animatedValue).toLocaleString()}`
    }
    return Math.round(animatedValue).toString()
  }

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
      red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' }
    }
    return colors[color as keyof typeof colors]?.[type] || colors.blue[type]
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      default: return '➖'
    }
  }

  const selectedCategoryData = industryStats.find(cat => cat.id === selectedCategory)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <span>業界統計サマリー</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">アプリストア業界の重要指標を一覧表示</p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Info className="w-4 h-4" />
          <span>{showDetails ? '簡易表示' : '詳細表示'}</span>
        </button>
      </div>

      {/* カテゴリタブ */}
      <div className="flex space-x-2 mb-8">
        {industryStats.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? `${getColorClasses(category.color, 'bg')} ${getColorClasses(category.color, 'text')} ${getColorClasses(category.color, 'border')} border`
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {category.icon}
            <span>{category.title}</span>
          </button>
        ))}
      </div>

      {/* メイン統計表示 */}
      {selectedCategoryData && (
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {selectedCategoryData.stats.map(stat => (
            <div
              key={stat.id}
              className={`${getColorClasses(stat.color, 'bg')} ${getColorClasses(stat.color, 'border')} border rounded-lg p-6 transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 bg-white rounded-lg ${getColorClasses(stat.color, 'text')}`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">{getTrendIcon(stat.trend)}</span>
                  <span className={`text-xs font-semibold ml-1 ${
                    stat.trend === 'up' ? 'text-green-600' :
                    stat.trend === 'down' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {animatedValues[stat.id] 
                    ? formatAnimatedValue(stat.value, animatedValues[stat.id])
                    : stat.value
                  }
                </div>
                <div className="text-sm font-medium text-gray-700">{stat.title}</div>
              </div>

              {showDetails && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">{stat.description}</p>
                  <p className="text-xs text-gray-500">出典: {stat.source}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 日本固有統計 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <span>🇯🇵</span>
          <span>日本市場特化データ</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {japanSpecificStats.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h4 className="font-semibold text-gray-800 mb-4">{section.title}</h4>
              <div className="space-y-3">
                {section.stats.map((stat, statIndex) => (
                  <div key={statIndex} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">{stat.value}</span>
                      <span className="text-xs">{getTrendIcon(stat.trend)}</span>
                      <span className={`text-xs font-medium ${
                        stat.trend === 'up' ? 'text-green-600' :
                        stat.trend === 'down' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>📊 注目ポイント:</strong> 
            スマートフォン新法施行により、2025年12月以降は第三者アプリストアの市場参入が本格化する見込みです。
            開発者の関心度は67%と高く、業界の変革期を迎えています。
          </p>
        </div>
      </div>

      {/* フッター */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div className="text-sm text-gray-500">
          データ更新頻度: 月次更新 | 出典: App Annie, MMD研究所, Developer Economics
        </div>
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <span>最終更新: {new Date().toLocaleDateString('ja-JP')}</span>
          <button className="text-blue-600 hover:text-blue-700">
            データソース詳細
          </button>
        </div>
      </div>
    </div>
  )
}