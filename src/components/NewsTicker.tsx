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

// 実際のデータはSupabaseから取得予定
// 現在はデータが登録されていない状態
const newsData: NewsItem[] = []

export default function NewsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [news] = useState<NewsItem[]>(newsData)

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

  // データがない場合のメッセージを表示
  if (news.length === 0) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                現在、ニュース速報は登録されていません。最新情報が入り次第、こちらに表示されます。
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

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