'use client'

import { TrendingUp, Eye, MessageCircle, Flame, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getTrendingTopics } from '@/lib/trending'
import type { TrendingTopic } from '@/lib/trending'

export default function TrendingTopics() {
  const [topics, setTopics] = useState<TrendingTopic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const { topics: data, error } = await getTrendingTopics()
        if (!error && data) {
          setTopics(data)
        }
      } catch (error) {
        console.error('Error loading trending topics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTopics()
  }, [])
  
  const getTrendingIcon = (trending: string) => {
    switch (trending) {
      case 'hot':
        return <Flame className="w-4 h-4 text-red-500" />
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-orange-500" />
      case 'new':
        return <ArrowUpRight className="w-4 h-4 text-green-500" />
      default:
        return null
    }
  }

  const getTrendingLabel = (trending: string) => {
    switch (trending) {
      case 'hot':
        return '人気急上昇'
      case 'rising':
        return 'トレンド'
      case 'new':
        return '新着注目'
      default:
        return ''
    }
  }

  const formatViewCount = (count: number) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900">今注目のトピック</h2>
        </div>
        <Link 
          href="/trending" 
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <span>もっと見る</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4 p-3">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <Link
              key={topic.id}
              href={topic.link}
              className="group block"
            >
              <div className="flex space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                {/* Ranking Number */}
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8">
                  <span className={`text-lg font-bold ${
                    index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-gray-400' :
                    index === 2 ? 'text-orange-600' :
                    'text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {getTrendingIcon(topic.trending_type)}
                    <span className="text-xs font-medium text-gray-500">
                      {getTrendingLabel(topic.trending_type)}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {topic.category}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {topic.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {topic.description}
                  </p>

                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Eye className="w-3 h-3" />
                      <span>{formatViewCount(topic.view_count)}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <MessageCircle className="w-3 h-3" />
                      <span>{topic.comment_count}</span>
                    </div>
                  </div>
                </div>

                {/* Thumbnail */}
                {topic.image_url && (
                  <div className="flex-shrink-0 hidden sm:block">
                    <img
                      src={topic.image_url}
                      alt={topic.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              週間トレンドレポート
            </p>
            <p className="text-xs text-gray-600 mt-1">
              今週最も読まれた記事をまとめてチェック
            </p>
          </div>
          <Link
            href="/weekly-report"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            レポートを見る
          </Link>
        </div>
      </div>
    </div>
  )
}