'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, TrendingUp, FileText, Megaphone } from 'lucide-react'

interface NewsItem {
  id: string
  type: 'regulation' | 'market' | 'announcement' | 'update'
  text: string
  link?: string
  date: string
}

// サンプルデータ（実際はSupabaseから取得）
const sampleNews: NewsItem[] = [
  {
    id: '1',
    type: 'regulation',
    text: '🎌 スマートフォン新法が2025年4月より施行開始',
    link: '/articles/smartphone-law-2025',
    date: '2024-08-28'
  },
  {
    id: '2',
    type: 'market',
    text: '📊 国内アプリストア市場規模が前年比15%成長',
    link: '/articles/market-growth-2024',
    date: '2024-08-27'
  },
  {
    id: '3',
    type: 'announcement',
    text: '🚀 楽天が独自アプリストアの開設を発表',
    link: '/articles/rakuten-appstore-launch',
    date: '2024-08-26'
  },
  {
    id: '4',
    type: 'update',
    text: '⚡ Apple、日本向けApp Store手数料を17%に引き下げ',
    link: '/articles/apple-fee-reduction',
    date: '2024-08-25'
  },
  {
    id: '5',
    type: 'regulation',
    text: '⚖️ 公正取引委員会がデジタル市場の新ガイドライン公表',
    link: '/articles/jftc-guidelines',
    date: '2024-08-24'
  }
]

export default function NewsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [news] = useState<NewsItem[]>(sampleNews)

  useEffect(() => {
    if (isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [news.length, isHovered])

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

  if (news.length === 0) return null

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-3">
          <div className="flex items-center space-x-2 mr-4">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
              速報
            </span>
          </div>
          
          <div 
            className="flex-1 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-center space-x-3">
              {getTypeIcon(news[currentIndex].type)}
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {getTypeLabel(news[currentIndex].type)}
              </span>
              {news[currentIndex].link ? (
                <a 
                  href={news[currentIndex].link}
                  className="text-sm text-gray-800 hover:text-blue-600 transition-colors"
                >
                  {news[currentIndex].text}
                </a>
              ) : (
                <span className="text-sm text-gray-800">
                  {news[currentIndex].text}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1 ml-4">
            {news.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-blue-600 w-3' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`ニュース ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}