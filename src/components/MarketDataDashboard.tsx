'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Users, Smartphone, BarChart3, PieChart, Activity, Globe } from 'lucide-react'

interface MarketData {
  appStoreMarketShare: { name: string; share: number; color: string }[]
  commissionRates: { name: string; standard: number; smallBusiness?: number; color: string }[]
  userStats: { metric: string; value: string; change: string; trend: 'up' | 'down' | 'neutral' }[]
  timelineData: { date: string; value: number; event?: string }[]
}

const marketData: MarketData = {
  appStoreMarketShare: [
    { name: 'Google Play', share: 71.8, color: '#4CAF50' },
    { name: 'App Store', share: 28.2, color: '#2196F3' },
    { name: '第三者ストア', share: 0.8, color: '#FF9800' },
    { name: '予想シェア（2026年）', share: 5.2, color: '#9C27B0' }
  ],
  commissionRates: [
    { name: 'Epic Games', standard: 12, color: '#000000' },
    { name: 'Microsoft', standard: 15, color: '#0078D4' },
    { name: 'App Store', standard: 30, smallBusiness: 15, color: '#007AFF' },
    { name: 'Google Play', standard: 30, smallBusiness: 15, color: '#4CAF50' },
    { name: 'Amazon', standard: 30, color: '#FF9900' },
    { name: 'Samsung', standard: 30, color: '#1428A0' }
  ],
  userStats: [
    { metric: 'アプリダウンロード数（年間）', value: '255億', change: '+12.3%', trend: 'up' },
    { metric: 'アプリ内課金市場規模', value: '¥1.2兆', change: '+18.7%', trend: 'up' },
    { metric: '開発者登録数', value: '340万', change: '+8.9%', trend: 'up' },
    { metric: '平均アプリ収益（月間）', value: '¥52万', change: '-3.2%', trend: 'down' }
  ],
  timelineData: [
    { date: '2022-01', value: 85, event: 'DMA法案発表' },
    { date: '2022-06', value: 88 },
    { date: '2022-12', value: 92, event: 'スマホ新法可決' },
    { date: '2023-06', value: 95 },
    { date: '2023-12', value: 98, event: 'Epic Store発表' },
    { date: '2024-06', value: 100 },
    { date: '2024-12', value: 105, event: '第三者ストア解禁' },
    { date: '2025-06', value: 112 },
    { date: '2025-12', value: 125, event: '完全施行予定' }
  ]
}

export default function MarketDataDashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'commission' | 'timeline'>('overview')
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})

  // アニメーション効果
  useEffect(() => {
    const animateCounters = () => {
      marketData.userStats.forEach((stat, index) => {
        const targetValue = parseFloat(stat.value.replace(/[^\d.]/g, ''))
        let currentValue = 0
        const increment = targetValue / 50
        
        const timer = setInterval(() => {
          currentValue += increment
          if (currentValue >= targetValue) {
            currentValue = targetValue
            clearInterval(timer)
          }
          setAnimatedValues(prev => ({
            ...prev,
            [`stat-${index}`]: currentValue
          }))
        }, 30)
      })
    }

    animateCounters()
  }, [])

  const formatValue = (value: number, originalValue: string): string => {
    if (originalValue.includes('億')) {
      return `${Math.round(value)}億`
    } else if (originalValue.includes('兆')) {
      return `¥${(value / 1000).toFixed(1)}兆`
    } else if (originalValue.includes('万')) {
      if (value >= 1000) {
        return `${Math.round(value / 10000)}万`
      }
      return `¥${Math.round(value)}万`
    }
    return Math.round(value).toString()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>市場データダッシュボード</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">アプリストア業界の最新統計とトレンド</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Activity className="w-4 h-4" />
          <span>リアルタイム更新</span>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
        <button
          onClick={() => setSelectedTab('overview')}
          className={`flex-1 text-sm font-medium py-2 px-4 rounded-md transition-colors ${
            selectedTab === 'overview'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          市場概要
        </button>
        <button
          onClick={() => setSelectedTab('commission')}
          className={`flex-1 text-sm font-medium py-2 px-4 rounded-md transition-colors ${
            selectedTab === 'commission'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          手数料比較
        </button>
        <button
          onClick={() => setSelectedTab('timeline')}
          className={`flex-1 text-sm font-medium py-2 px-4 rounded-md transition-colors ${
            selectedTab === 'timeline'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          市場動向
        </button>
      </div>

      {/* 市場概要タブ */}
      {selectedTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI指標 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketData.userStats.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white rounded-lg">
                    {index === 0 && <Smartphone className="w-5 h-5 text-blue-600" />}
                    {index === 1 && <DollarSign className="w-5 h-5 text-green-600" />}
                    {index === 2 && <Users className="w-5 h-5 text-purple-600" />}
                    {index === 3 && <TrendingUp className="w-5 h-5 text-orange-600" />}
                  </div>
                  <div className={`flex items-center space-x-1 text-xs font-semibold ${
                    stat.trend === 'up' ? 'text-green-600' :
                    stat.trend === 'down' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    <span>{stat.change}</span>
                    {stat.trend === 'up' && '📈'}
                    {stat.trend === 'down' && '📉'}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {animatedValues[`stat-${index}`] 
                    ? formatValue(animatedValues[`stat-${index}`], stat.value)
                    : stat.value
                  }
                </div>
                <div className="text-sm text-gray-600">{stat.metric}</div>
              </div>
            ))}
          </div>

          {/* 市場シェア円グラフ（シンプル版） */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              <span>アプリストア市場シェア（2024年）</span>
            </h3>
            <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
              {/* シンプルな視覚的表示 */}
              <div className="flex-1">
                <div className="space-y-4">
                  {marketData.appStoreMarketShare.map((store, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: store.color }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">{store.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-1000"
                            style={{ 
                              backgroundColor: store.color,
                              width: `${store.share}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 min-w-[3rem]">
                          {store.share}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 予測データ */}
              <div className="bg-white rounded-lg p-4 border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center space-x-1">
                  <span>🔮</span>
                  <span>2026年予測</span>
                </h4>
                <p className="text-sm text-yellow-700">
                  第三者アプリストアが<br/>
                  <strong>5.2%</strong>のシェア獲得予想
                </p>
                <p className="text-xs text-yellow-600 mt-2">
                  ※ スマホ新法完全施行後
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 手数料比較タブ */}
      {selectedTab === 'commission' && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">手数料率比較</h3>
            <div className="space-y-4">
              {marketData.commissionRates
                .sort((a, b) => a.standard - b.standard)
                .map((store, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: store.color }}
                      ></div>
                      <span className="font-semibold text-gray-900">{store.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {store.standard}%
                      </div>
                      {store.smallBusiness && (
                        <div className="text-sm text-green-600">
                          小規模: {store.smallBusiness}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-1000"
                      style={{ 
                        backgroundColor: store.color,
                        width: `${(store.standard / 30) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 注意書き */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>💡 ポイント:</strong> Epic Games Storeの12%が業界最低。
                Apple・Googleも小規模事業者向けに15%の優遇税率を提供。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 市場動向タブ */}
      {selectedTab === 'timeline' && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span>アプリストア自由化タイムライン</span>
            </h3>
            
            {/* シンプルなタイムライン表示 */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>
              <div className="space-y-6">
                {marketData.timelineData.map((item, index) => (
                  <div key={index} className="relative flex items-center space-x-4">
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                      item.event 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border-2 border-blue-300'
                    }`}>
                      {item.event && <span className="text-xs">📅</span>}
                    </div>
                    <div className="flex-1 bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600">{item.date}</div>
                          {item.event && (
                            <div className="font-semibold text-gray-900 mt-1">{item.event}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {item.value}
                          </div>
                          <div className="text-xs text-gray-500">市場指数</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">🎯 次のマイルストーン</h4>
              <p className="text-sm text-blue-700">
                <strong>2025年12月18日</strong> - スマートフォン新法完全施行
              </p>
              <p className="text-xs text-blue-600 mt-2">
                第三者アプリストアの本格展開が始まります
              </p>
            </div>
          </div>
        </div>
      )}

      {/* フッター */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          データ出典: App Annie, Sensor Tower, 総務省統計
        </div>
        <div className="text-xs text-gray-400">
          最終更新: {new Date().toLocaleDateString('ja-JP')}
        </div>
      </div>
    </div>
  )
}