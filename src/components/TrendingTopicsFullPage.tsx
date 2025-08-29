'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getTrendingTopics } from '@/lib/trending'
import type { TrendingTopic } from '@/lib/trending'
import { TrendingUp, Eye, MessageCircle, Flame, ArrowUpRight, Filter } from 'lucide-react'

export default function TrendingTopicsFullPage() {
  const [topics, setTopics] = useState<TrendingTopic[]>([])
  const [filteredTopics, setFilteredTopics] = useState<TrendingTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'hot' | 'rising' | 'new'>('all')

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const { topics: data, error } = await getTrendingTopics()
        if (!error && data) {
          setTopics(data)
          setFilteredTopics(data)
        }
      } catch (error) {
        console.error('Error loading trending topics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTopics()
  }, [])

  useEffect(() => {
    if (filter === 'all') {
      setFilteredTopics(topics)
    } else {
      setFilteredTopics(topics.filter(topic => topic.trending_type === filter))
    }
  }, [filter, topics])

  const getTrendingIcon = (trending: string) => {
    switch (trending) {
      case 'hot':
        return <Flame className="w-5 h-5 text-red-500" />
      case 'rising':
        return <TrendingUp className="w-5 h-5 text-orange-500" />
      case 'new':
        return <ArrowUpRight className="w-5 h-5 text-green-500" />
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

  const getFilterCount = (type: 'all' | 'hot' | 'rising' | 'new') => {
    if (type === 'all') return topics.length
    return topics.filter(topic => topic.trending_type === type).length
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* フィルタースケルトン */}
        <div className="flex space-x-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
          ))}
        </div>
        
        {/* コンテンツスケルトン */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* フィルター */}
      <div className="flex items-center space-x-4 border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-2 text-gray-700">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">フィルター:</span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            すべて ({getFilterCount('all')})
          </button>
          <button
            onClick={() => setFilter('hot')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
              filter === 'hot'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>人気急上昇 ({getFilterCount('hot')})</span>
          </button>
          <button
            onClick={() => setFilter('rising')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
              filter === 'rising'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>トレンド ({getFilterCount('rising')})</span>
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
              filter === 'new'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>新着注目 ({getFilterCount('new')})</span>
          </button>
        </div>
      </div>

      {/* トピック一覧 */}
      {filteredTopics.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTopics.map((topic, index) => (
            <Link
              key={topic.id}
              href={topic.link}
              className="group block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              {/* 画像 */}
              {topic.image_url && (
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={topic.image_url}
                    alt={topic.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}

              <div className="p-6">
                {/* ランキング & トレンドタイプ */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                      index === 2 ? 'text-orange-600' :
                      'text-gray-500'
                    }`}>
                      #{index + 1}
                    </span>
                    {getTrendingIcon(topic.trending_type)}
                    <span className="text-xs font-medium text-gray-500">
                      {getTrendingLabel(topic.trending_type)}
                    </span>
                  </div>
                  
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {topic.category}
                  </span>
                </div>

                {/* タイトル */}
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                  {topic.title}
                </h3>

                {/* 説明 */}
                {topic.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {topic.description}
                  </p>
                )}

                {/* 統計 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{formatViewCount(topic.view_count)}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <MessageCircle className="w-4 h-4" />
                      <span>{topic.comment_count}</span>
                    </div>
                  </div>
                  
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <TrendingUp className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600 mb-2">該当するトレンド記事がありません</p>
          <p className="text-sm text-gray-500">別のフィルターを試してみてください</p>
        </div>
      )}

      {/* 週間レポートセクション */}
      <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-gray-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">週間トレンドレポート</h2>
          <p className="text-gray-600 mb-6">
            今週最も注目された記事をまとめた特別レポートを毎週配信しています。<br />
            業界の動向を見逃さないために、ぜひご登録ください。
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/weekly-report"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              最新レポートを見る
            </Link>
            <Link
              href="/signup"
              className="bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              無料会員登録
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}