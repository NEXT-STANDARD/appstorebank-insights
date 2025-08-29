'use client'

import { useState, useEffect } from 'react'
import { Check, X, AlertCircle, Star, Filter, ArrowUpDown, ExternalLink, Download, Info } from 'lucide-react'
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
  subscription_rate_year1?: string
  subscription_rate_year2?: string
  features: string[]
  supported_devices: string[]
  website_url: string
  description: string
  launch_date: string
  is_third_party: boolean
  is_featured: boolean
}

type FilterType = 'all' | 'available' | 'coming_soon' | 'third_party'
type SortType = 'name' | 'commission' | 'launch_date' | 'status'

export default function AppStoreComparisonPage() {
  const [appStores, setAppStores] = useState<AppStore[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('name')
  const [selectedStores, setSelectedStores] = useState<string[]>([])

  useEffect(() => {
    loadAppStores()
  }, [])

  const loadAppStores = async () => {
    try {
      const { data, error } = await supabase
        .from('app_stores')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      if (data) setAppStores(data)
    } catch (error) {
      console.error('Error loading app stores:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStores = appStores.filter(store => {
    switch (filter) {
      case 'available':
        return store.status === 'available'
      case 'coming_soon':
        return store.status === 'coming_soon'
      case 'third_party':
        return store.is_third_party
      default:
        return true
    }
  })

  const sortedStores = [...filteredStores].sort((a, b) => {
    switch (sort) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'commission':
        const aRate = parseInt(a.commission_rate.replace(/[^\d]/g, ''))
        const bRate = parseInt(b.commission_rate.replace(/[^\d]/g, ''))
        return aRate - bRate
      case 'launch_date':
        return new Date(a.launch_date).getTime() - new Date(b.launch_date).getTime()
      case 'status':
        const statusOrder = { 'available': 0, 'coming_soon': 1, 'planning': 2, 'discontinued': 3 }
        return statusOrder[a.status] - statusOrder[b.status]
      default:
        return 0
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'coming_soon':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'planning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'discontinued':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
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

  const toggleStoreSelection = (storeId: string) => {
    setSelectedStores(prev => 
      prev.includes(storeId) 
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            アプリストア詳細比較
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            主要アプリストアの手数料、機能、対応デバイスを詳細比較
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
            <div className="flex items-center space-x-2 text-blue-800">
              <Info className="w-5 h-5" />
              <span className="font-semibold">2025年12月スマートフォン新法施行に向けた最新情報</span>
            </div>
          </div>
        </div>

        {/* フィルターとソート */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">フィルター:</span>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as FilterType)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">すべて</option>
                  <option value="available">利用可能</option>
                  <option value="coming_soon">準備中</option>
                  <option value="third_party">第三者ストア</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">ソート:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortType)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">名前順</option>
                  <option value="commission">手数料順</option>
                  <option value="launch_date">リリース日順</option>
                  <option value="status">ステータス順</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {sortedStores.length}件のアプリストア
              </span>
              {selectedStores.length > 0 && (
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  <Download className="w-4 h-4" />
                  <span>比較表をダウンロード ({selectedStores.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 比較表 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 w-8">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStores(sortedStores.map(s => s.id))
                        } else {
                          setSelectedStores([])
                        }
                      }}
                    />
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-48">アプリストア</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 min-w-24">ステータス</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 min-w-32">手数料率</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 min-w-40">対応デバイス</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-64">主な特徴</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 min-w-32">リリース日</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 min-w-24">詳細</th>
                </tr>
              </thead>
              <tbody>
                {sortedStores.map((store, index) => (
                  <tr 
                    key={store.id} 
                    className={`border-t border-gray-200 hover:bg-gray-50 ${
                      selectedStores.includes(store.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedStores.includes(store.id)}
                        onChange={() => toggleStoreSelection(store.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl">{store.logo_emoji}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">{store.name}</span>
                            {store.is_featured && (
                              <Star className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{store.company}</div>
                          <div className="text-xs text-gray-600 mt-1 max-w-xs">
                            {store.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(store.status)}`}>
                        {getStatusIcon(store.status)}
                        <span>{getStatusLabel(store.status)}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="font-semibold text-gray-900">{store.commission_rate}</div>
                      {store.small_business_rate && (
                        <div className="text-xs text-gray-500 mt-1">小規模: {store.small_business_rate}</div>
                      )}
                      {store.subscription_rate_year1 && (
                        <div className="text-xs text-blue-600 mt-1">
                          サブスク1年目: {store.subscription_rate_year1}
                        </div>
                      )}
                      {store.subscription_rate_year2 && (
                        <div className="text-xs text-blue-600">
                          サブスク2年目: {store.subscription_rate_year2}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap justify-center gap-1">
                        {store.supported_devices.map((device, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {device}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {store.features.map((feature, idx) => (
                          <span key={idx} className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mr-1 mb-1">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="text-sm font-medium text-gray-900">{store.launch_date}</div>
                      {store.is_third_party && (
                        <div className="text-xs text-purple-600 mt-1">第三者ストア</div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <a
                        href={store.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">ご注意ください</h3>
          <ul className="text-sm text-yellow-700 space-y-2">
            <li>• 手数料率は変動する場合があります。最新情報は各ストアの公式サイトでご確認ください。</li>
            <li>• 「準備中」「計画中」のストアは予定であり、変更される可能性があります。</li>
            <li>• スマートフォン新法の施行により、2025年12月以降に第三者アプリストアが本格的に利用可能になる予定です。</li>
            <li>• 小規模事業者向けの優遇税率は、年間売上高や条件により適用されます。</li>
          </ul>
        </div>

        {/* 関連記事への誘導 */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            アプリストア選びでお困りですか？
          </h3>
          <p className="text-gray-600 mb-6">
            あなたのアプリに最適なストアを見つけるための診断ツールをご利用ください。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              アプリストア診断を受ける
            </button>
            <a
              href="/articles?category=market_analysis"
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              市場分析記事を読む
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}