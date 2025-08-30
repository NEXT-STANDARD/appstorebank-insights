'use client'

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, ExternalLink, Calendar, RefreshCw, FileText, Database, AlertCircle } from 'lucide-react'

interface FactCheckItem {
  id: string
  component: string
  section: string
  factType: 'statistic' | 'date' | 'percentage' | 'legal' | 'company_info' | 'market_data'
  claim: string
  currentValue: string
  source: string
  sourceUrl: string
  lastVerified: string
  nextReview: string
  status: 'verified' | 'needs_update' | 'outdated' | 'unverified'
  confidence: 'high' | 'medium' | 'low'
  notes?: string
  priority: 'critical' | 'high' | 'medium' | 'low'
}

// 現在のコンポーネントから抽出した要ファクトチェック項目
const factCheckData: FactCheckItem[] = [
  // 業界統計サマリー関連
  {
    id: 'global-downloads-2024',
    component: 'IndustryStatsSummary',
    section: '市場概況',
    factType: 'statistic',
    claim: 'グローバルダウンロード数',
    currentValue: '2,550億',
    source: 'App Annie',
    sourceUrl: 'https://www.data.ai/',
    lastVerified: '2024-11-01',
    nextReview: '2024-12-01',
    status: 'verified',
    confidence: 'high',
    priority: 'high'
  },
  {
    id: 'japan-market-size',
    component: 'IndustryStatsSummary', 
    section: '市場概況',
    factType: 'market_data',
    claim: 'アプリ市場規模',
    currentValue: '¥12.8兆',
    source: 'MMD研究所',
    sourceUrl: 'https://mmdlabo.jp/',
    lastVerified: '2024-10-15',
    nextReview: '2024-12-15',
    status: 'needs_update',
    confidence: 'medium',
    priority: 'critical'
  },
  {
    id: 'active-developers-count',
    component: 'IndustryStatsSummary',
    section: '市場概況', 
    factType: 'statistic',
    claim: 'アクティブ開発者数',
    currentValue: '340万人',
    source: 'Developer Economics',
    sourceUrl: 'https://developereconomics.com/',
    lastVerified: '2024-09-20',
    nextReview: '2025-01-20',
    status: 'verified',
    confidence: 'high',
    priority: 'medium'
  },
  // スマホ新法関連
  {
    id: 'smartphone-law-date',
    component: 'FAQ/CaseStudy',
    section: '法規制',
    factType: 'date',
    claim: 'スマホ新法成立日',
    currentValue: '2024年6月12日',
    source: '官報',
    sourceUrl: 'https://www.gov.jp/',
    lastVerified: '2024-06-12',
    nextReview: '2025-06-12',
    status: 'verified',
    confidence: 'high',
    priority: 'critical'
  },
  {
    id: 'smartphone-law-enforcement',
    component: 'FAQ/CaseStudy',
    section: '法規制',
    factType: 'date',
    claim: 'スマホ新法施行予定',
    currentValue: '2025年12月まで',
    source: '経済産業省',
    sourceUrl: 'https://www.meti.go.jp/',
    lastVerified: '2024-11-01',
    nextReview: '2025-01-01',
    status: 'verified',
    confidence: 'high',
    priority: 'critical'
  },
  // アプリストア手数料
  {
    id: 'app-store-commission',
    component: 'FAQ/AppStoreComparison',
    section: '手数料',
    factType: 'percentage',
    claim: 'App Store標準手数料',
    currentValue: '30%',
    source: 'Apple Developer',
    sourceUrl: 'https://developer.apple.com/',
    lastVerified: '2024-11-15',
    nextReview: '2025-02-15',
    status: 'verified',
    confidence: 'high',
    priority: 'high'
  },
  {
    id: 'google-play-commission',
    component: 'FAQ/AppStoreComparison', 
    section: '手数料',
    factType: 'percentage',
    claim: 'Google Play標準手数料',
    currentValue: '30%',
    source: 'Google Play Console',
    sourceUrl: 'https://play.google.com/console/',
    lastVerified: '2024-11-15',
    nextReview: '2025-02-15',
    status: 'verified',
    confidence: 'high',
    priority: 'high'
  },
  {
    id: 'epic-games-commission',
    component: 'FAQ/AppStoreComparison',
    section: '手数料',
    factType: 'percentage', 
    claim: 'Epic Games Store手数料',
    currentValue: '12%',
    source: 'Epic Games',
    sourceUrl: 'https://store.epicgames.com/',
    lastVerified: '2024-11-10',
    nextReview: '2025-01-10',
    status: 'verified',
    confidence: 'high',
    priority: 'medium'
  },
  // DMA関連
  {
    id: 'dma-enforcement-date',
    component: 'FAQ/CaseStudy',
    section: '法規制',
    factType: 'date',
    claim: 'DMA施行日',
    currentValue: '2024年3月',
    source: 'European Commission',
    sourceUrl: 'https://ec.europa.eu/',
    lastVerified: '2024-03-01',
    nextReview: '2025-03-01', 
    status: 'verified',
    confidence: 'high',
    priority: 'high'
  },
  // 市場データ
  {
    id: 'ios-market-share-japan',
    component: 'IndustryStatsSummary',
    section: '日本市場特性',
    factType: 'percentage',
    claim: 'iOS市場シェア',
    currentValue: '68.2%',
    source: 'StatCounter',
    sourceUrl: 'https://gs.statcounter.com/',
    lastVerified: '2024-10-01',
    nextReview: '2024-12-01',
    status: 'needs_update',
    confidence: 'medium',
    priority: 'high'
  }
]

export default function FactCheckPage() {
  const [items, setItems] = useState<FactCheckItem[]>(factCheckData)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [selectedComponent, setSelectedComponent] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'nextReview' | 'lastVerified' | 'priority'>('nextReview')

  const filteredItems = items.filter(item => {
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority
    const matchesComponent = selectedComponent === 'all' || item.component === selectedComponent
    return matchesStatus && matchesPriority && matchesComponent
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    } else {
      return new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime()
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100'
      case 'needs_update': return 'text-yellow-600 bg-yellow-100'
      case 'outdated': return 'text-red-600 bg-red-100'
      case 'unverified': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200'
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-200'
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200'
      case 'low': return 'text-blue-700 bg-blue-100 border-blue-200'
      default: return 'text-gray-700 bg-gray-100 border-gray-200'
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-700 bg-green-50'
      case 'medium': return 'text-yellow-700 bg-yellow-50' 
      case 'low': return 'text-red-700 bg-red-50'
      default: return 'text-gray-700 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'needs_update': return <RefreshCw className="w-4 h-4 text-yellow-600" />
      case 'outdated': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'unverified': return <AlertCircle className="w-4 h-4 text-gray-600" />
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const isOverdue = (nextReview: string) => {
    return new Date(nextReview) < new Date()
  }

  const getStatsCount = (status: string) => {
    return items.filter(item => item.status === status).length
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <Shield className="w-8 h-8 text-blue-600" />
          <span>ファクトチェック管理</span>
        </h1>
        <p className="text-gray-600 mt-2">
          サイト内のデータ・統計・事実の正確性を管理し、定期的な検証を行います
        </p>
      </div>

      {/* 統計サマリー */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">検証済み</p>
              <p className="text-2xl font-bold text-green-900">{getStatsCount('verified')}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">要更新</p>
              <p className="text-2xl font-bold text-yellow-900">{getStatsCount('needs_update')}</p>
            </div>
            <RefreshCw className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">期限切れ</p>
              <p className="text-2xl font-bold text-red-900">{getStatsCount('outdated')}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">未検証</p>
              <p className="text-2xl font-bold text-gray-900">{getStatsCount('unverified')}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* フィルター */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">すべて</option>
              <option value="verified">検証済み</option>
              <option value="needs_update">要更新</option>
              <option value="outdated">期限切れ</option>
              <option value="unverified">未検証</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">優先度</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">すべて</option>
              <option value="critical">重要</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">コンポーネント</label>
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">すべて</option>
              <option value="IndustryStatsSummary">業界統計</option>
              <option value="FAQ/CaseStudy">FAQ/事例</option>
              <option value="FAQ/AppStoreComparison">比較表</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ソート</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="nextReview">次回確認日</option>
              <option value="lastVerified">最終確認日</option>
              <option value="priority">優先度</option>
            </select>
          </div>
        </div>
      </div>

      {/* ファクトチェック項目一覧 */}
      <div className="space-y-4">
        {sortedItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white border rounded-lg p-6 transition-all hover:shadow-md ${
              isOverdue(item.nextReview) ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getStatusIcon(item.status)}
                  <h3 className="text-lg font-semibold text-gray-900">{item.claim}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(item.priority)}`}>
                    {item.priority.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-sm">
                  <div>
                    <span className="text-gray-600">現在値: </span>
                    <span className="font-semibold">{item.currentValue}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">コンポーネント: </span>
                    <span className="font-semibold">{item.component}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">セクション: </span>
                    <span className="font-semibold">{item.section}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">データソース: </span>
                    <a 
                      href={item.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center space-x-1"
                    >
                      <span>{item.source}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div>
                    <span className="text-gray-600">最終確認: </span>
                    <span className="font-semibold">{item.lastVerified}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">次回確認: </span>
                    <span className={`font-semibold ${isOverdue(item.nextReview) ? 'text-red-600' : ''}`}>
                      {item.nextReview} {isOverdue(item.nextReview) && '(期限切れ)'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                  {item.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs ${getConfidenceColor(item.confidence)}`}>
                  信頼度: {item.confidence.toUpperCase()}
                </span>
              </div>
            </div>
            
            {item.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700"><strong>メモ:</strong> {item.notes}</p>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>{item.factType.replace('_', ' ')}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Database className="w-4 h-4" />
                  <span>ID: {item.id}</span>
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  今すぐ確認
                </button>
                <button className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  編集
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {sortedItems.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">該当するファクトチェック項目がありません</p>
        </div>
      )}
    </div>
  )
}