'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, X, AlertCircle, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'

interface AppStore {
  id: string
  name: string
  slug: string
  company: string
  logo_emoji: string
  status: 'available' | 'coming_soon' | 'planning' | 'discontinued'
  commission_rate: string
  small_business_rate?: string
  features: string[]
  supported_devices: string[]
  website_url: string
  description: string
  launch_date: string
  is_third_party: boolean
  is_featured: boolean
}

export default function AppStoreComparison() {
  const [appStores, setAppStores] = useState<AppStore[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    loadAppStores()
  }, [])

  const loadAppStores = async () => {
    try {
      const { data, error } = await supabase
        .from('app_stores')
        .select('*')
        .order('display_order', { ascending: true })
        .limit(showAll ? 10 : 4)

      if (error) throw error
      if (data) setAppStores(data)
    } catch (error) {
      console.error('Error loading app stores:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAppStores()
  }, [showAll])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'coming_soon':
        return 'bg-blue-100 text-blue-800'
      case 'planning':
        return 'bg-yellow-100 text-yellow-800'
      case 'discontinued':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return '利用可能'
      case 'coming_soon':
        return '準備中'
      case 'planning':
        return '計画中'
      case 'discontinued':
        return '終了'
      default:
        return '不明'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Check className="w-4 h-4" />
      case 'coming_soon':
        return <AlertCircle className="w-4 h-4" />
      case 'planning':
        return <AlertCircle className="w-4 h-4" />
      case 'discontinued':
        return <X className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">アプリストア比較</h2>
          <p className="text-sm text-gray-600 mt-1">主要なアプリストアの特徴を比較できます</p>
        </div>
        <Link 
          href="/app-store-comparison" 
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <span>詳細比較</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* デスクトップ版テーブル */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">アプリストア</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">ステータス</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">手数料率</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">対応デバイス</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">主な特徴</th>
              </tr>
            </thead>
            <tbody>
              {appStores.map((store) => (
                <tr key={store.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{store.logo_emoji}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{store.name}</div>
                        <div className="text-sm text-gray-500">{store.company}</div>
                        {store.is_featured && (
                          <Star className="w-4 h-4 text-yellow-500 inline" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(store.status)}`}>
                      {getStatusIcon(store.status)}
                      <span>{getStatusLabel(store.status)}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="font-semibold text-gray-900">{store.commission_rate}</div>
                    {store.small_business_rate && (
                      <div className="text-xs text-gray-500">小規模: {store.small_business_rate}</div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {store.supported_devices.map((device, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {device}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {store.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                      {store.features.length > 2 && (
                        <span className="text-xs text-gray-500">+{store.features.length - 2}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* モバイル版カード */}
      <div className="lg:hidden space-y-4">
        {appStores.map((store) => (
          <div key={store.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3 mb-3">
              <span className="text-2xl">{store.logo_emoji}</span>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">{store.name}</h3>
                  {store.is_featured && (
                    <Star className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
                <p className="text-sm text-gray-500">{store.company}</p>
                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(store.status)}`}>
                  {getStatusIcon(store.status)}
                  <span>{getStatusLabel(store.status)}</span>
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">手数料率:</span>
                <div className="font-semibold text-gray-900">{store.commission_rate}</div>
                {store.small_business_rate && (
                  <div className="text-xs text-gray-500">小規模: {store.small_business_rate}</div>
                )}
              </div>
              <div>
                <span className="font-medium text-gray-700">対応デバイス:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {store.supported_devices.map((device, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {device}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <span className="font-medium text-gray-700 text-sm">主な特徴:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {store.features.slice(0, 3).map((feature, index) => (
                  <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
                {store.features.length > 3 && (
                  <span className="text-xs text-gray-500">+{store.features.length - 3}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* フッター */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
          <div className="text-sm text-gray-600">
            <span className="font-medium">注:</span> 手数料率は変動する場合があります。最新情報は各ストアの公式サイトをご確認ください。
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {showAll ? '主要ストアのみ表示' : 'すべて表示'}
            </button>
            <Link
              href="/app-store-comparison"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              詳細比較を見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}