'use client'

import { useState } from 'react'
import { FileText, Calendar, TrendingUp, Users, DollarSign, AlertCircle, CheckCircle2, ExternalLink, Filter } from 'lucide-react'

interface CaseStudy {
  id: string
  title: string
  summary: string
  category: string
  region: string
  timeframe: string
  company?: string
  outcome: string
  keyMetrics?: Array<{
    label: string
    value: string
    trend?: 'up' | 'down' | 'neutral'
  }>
  challenges: string[]
  solutions: string[]
  lessons: string[]
  industry: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  externalLinks?: Array<{
    title: string
    url: string
    type: 'article' | 'report' | 'official'
  }>
  lastUpdated: string
  icon: string
  status: 'success' | 'mixed' | 'ongoing' | 'failed'
}

const caseStudies: CaseStudy[] = [
  {
    id: 'epic-fortnite',
    title: 'Epic Games vs Apple: Fortnite訴訟とその後',
    summary: 'Epic GamesがAppleの30%手数料に異議を唱え、独自決済システムを実装した結果、App Storeから排除された事例。デジタル市場の競争について議論のきっかけとなった。',
    category: '法廷闘争',
    region: '米国',
    timeframe: '2020年8月 - 2024年現在',
    company: 'Epic Games',
    outcome: '部分的勝利：Appleは外部決済リンクを許可する判決',
    keyMetrics: [
      { label: 'Fortniteの日間売上損失', value: '$1.2M', trend: 'down' },
      { label: '訴訟費用', value: '$100M+', trend: 'down' },
      { label: 'Epic Games Store成長率', value: '+340%', trend: 'up' },
      { label: '開発者手数料', value: '12%', trend: 'up' }
    ],
    challenges: [
      'App Storeの独占的地位による高額手数料',
      'サイドローディング制限による選択肢の欠如',
      'Appleのガイドライン変更による突然の排除',
      '数千万のiOSユーザーへのアクセス喪失'
    ],
    solutions: [
      '独自のEpic Games Storeプラットフォーム開発',
      '法的措置による市場開放の推進',
      '他のプラットフォームでの収益最大化',
      '業界全体への問題提起とロビー活動'
    ],
    lessons: [
      'プラットフォーム依存リスクの重要性',
      '法的手段の効果と限界の理解',
      '独自プラットフォーム構築の戦略的価値',
      'ユーザーコミュニティの支援の重要性'
    ],
    industry: 'ゲーム',
    difficulty: 'advanced',
    tags: ['訴訟', '手数料', '競争政策', 'プラットフォーム戦略'],
    externalLinks: [
      { title: '裁判所判決文', url: '#', type: 'official' },
      { title: 'Epic Games公式声明', url: '#', type: 'article' },
      { title: '市場分析レポート', url: '#', type: 'report' }
    ],
    lastUpdated: '2024-11-30',
    icon: '⚖️',
    status: 'mixed'
  },
  {
    id: 'eu-dma-implementation',
    title: '欧州DMA施行：Appleの対応と市場反応',
    summary: '2024年3月に施行された欧州デジタル市場法により、AppleがEU地域でサイドローディングとサードパーティストアを許可。その実装方法と市場への影響を分析。',
    category: '規制対応',
    region: '欧州（EU）',
    timeframe: '2024年3月 - 現在',
    company: 'Apple Inc.',
    outcome: 'DMAコンプライアンス達成、新たな手数料体系導入',
    keyMetrics: [
      { label: '第三者ストア申請数', value: '12社', trend: 'up' },
      { label: 'Core Technology Fee対象アプリ', value: '0.7%', trend: 'neutral' },
      { label: '外部決済採用率', value: '3.2%', trend: 'up' },
      { label: '開発者満足度', value: '45%', trend: 'down' }
    ],
    challenges: [
      '100万ユーロの銀行信用状という高いハードル',
      '複雑な新料金体系（CTF）による開発者の混乱',
      'セキュリティとユーザビリティのバランス',
      '既存ビジネスモデルの大幅な変更'
    ],
    solutions: [
      'Notarizationプロセスによるセキュリティ確保',
      'Alternative App Marketplace Entitlementの導入',
      '段階的なロールアウトによるリスク軽減',
      '詳細な開発者向けドキュメント提供'
    ],
    lessons: [
      '規制遵守と収益維持の両立の困難',
      '高いハードルによるサードパーティ参入制限',
      '複雑な料金体系の開発者への負担',
      '政策立案者と企業の継続的な対話の必要性'
    ],
    industry: 'プラットフォーム',
    difficulty: 'advanced',
    tags: ['DMA', '規制遵守', 'サイドローディング', '手数料改革'],
    externalLinks: [
      { title: 'Apple DMA対応詳細', url: '#', type: 'official' },
      { title: 'EU委員会評価', url: '#', type: 'report' },
      { title: '開発者反応調査', url: '#', type: 'article' }
    ],
    lastUpdated: '2024-11-28',
    icon: '🇪🇺',
    status: 'ongoing'
  },
  {
    id: 'samsung-galaxy-store',
    title: 'Samsung Galaxy Store：独自アプリストア戦略',
    summary: 'SamsungがGalaxyデバイスでGoogle Playと並行して展開するGalaxy Storeの戦略と成果。ハードウェアメーカーによるアプリストア運営の事例。',
    category: '独自ストア',
    region: 'グローバル',
    timeframe: '2009年 - 現在',
    company: 'Samsung Electronics',
    outcome: 'Galaxyエコシステムとの統合により一定の成功',
    keyMetrics: [
      { label: '月間アクティブユーザー', value: '400M', trend: 'up' },
      { label: 'アプリ数', value: '150万', trend: 'up' },
      { label: 'Galaxy Store専用アプリ', value: '15%', trend: 'up' },
      { label: '年間ダウンロード数', value: '63億', trend: 'up' }
    ],
    challenges: [
      'Google Playとの競合とユーザーの認知不足',
      'アプリ開発者の参加促進',
      '地域別の需要と文化差への対応',
      'セキュリティとクオリティ管理'
    ],
    solutions: [
      'Galaxy専用機能との深い統合',
      '地域特化アプリとコンテンツの充実',
      '開発者向けインセンティブプログラム',
      'Samsung Pay、Knox等との連携強化'
    ],
    lessons: [
      'ハードウェア統合の競争優位性',
      '地域特化戦略の有効性',
      '段階的な市場浸透の重要性',
      'エコシステム全体での価値提供'
    ],
    industry: 'モバイル・ハードウェア',
    difficulty: 'intermediate',
    tags: ['独自ストア', 'ハードウェア連携', 'エコシステム', 'グローバル展開'],
    externalLinks: [
      { title: 'Galaxy Store開発者ガイド', url: '#', type: 'official' },
      { title: '市場シェア分析', url: '#', type: 'report' },
      { title: 'Samsung戦略インタビュー', url: '#', type: 'article' }
    ],
    lastUpdated: '2024-11-25',
    icon: '🌌',
    status: 'success'
  },
  {
    id: 'china-android-fragmentation',
    title: '中国のAndroidアプリストア分散化',
    summary: 'Google Play Servicesが利用できない中国市場で、複数のサードパーティアプリストアが並存している状況。分散化されたアプリ配布の実例。',
    category: '市場分析',
    region: '中国',
    timeframe: '2010年 - 現在',
    company: '複数（Huawei、Xiaomi、Tencent等）',
    outcome: '多様化したアプリストア生態系の形成',
    keyMetrics: [
      { label: '主要ストア数', value: '20+', trend: 'neutral' },
      { label: '市場シェア首位', value: 'Huawei 25%', trend: 'up' },
      { label: '開発者対応ストア数', value: '平均8社', trend: 'neutral' },
      { label: 'ユーザー選択肢', value: '非常に高い', trend: 'up' }
    ],
    challenges: [
      '複数ストアでの同時展開によるコスト増',
      '各ストアの審査基準と要件の違い',
      'フラグメンテーションによる開発複雑化',
      'セキュリティとマルウェアの管理'
    ],
    solutions: [
      'ストア毎の最適化とローカライゼーション',
      '統合開発・配布ツールの活用',
      '段階的ロールアウト戦略',
      '地域パートナーシップの構築'
    ],
    lessons: [
      'プラットフォーム多様化への適応力',
      'ローカル市場理解の重要性',
      '分散リスク管理の有効性',
      '政府規制への柔軟な対応'
    ],
    industry: 'モバイル・プラットフォーム',
    difficulty: 'intermediate',
    tags: ['市場分散化', 'ローカライゼーション', '中国市場', '政府規制'],
    externalLinks: [
      { title: '中国アプリ市場レポート', url: '#', type: 'report' },
      { title: '主要ストア比較', url: '#', type: 'article' },
      { title: '開発者向けガイド', url: '#', type: 'official' }
    ],
    lastUpdated: '2024-11-20',
    icon: '🏪',
    status: 'success'
  },
  {
    id: 'japan-fintech-regulation',
    title: '日本FinTechアプリの規制対応事例',
    summary: '日本の金融系アプリが、銀行法・資金決済法等の厳格な規制の下で、複数プラットフォーム展開を実現した事例。金融業界特有の課題と解決策。',
    category: 'コンプライアンス',
    region: '日本',
    timeframe: '2018年 - 現在',
    company: '複数のFintech企業',
    outcome: '規制遵守しながらの多角的サービス展開',
    keyMetrics: [
      { label: 'KYC完了率', value: '94%', trend: 'up' },
      { label: '規制対応コスト', value: '売上の12%', trend: 'down' },
      { label: 'セキュリティ事件', value: '0件', trend: 'neutral' },
      { label: 'ユーザー満足度', value: '87%', trend: 'up' }
    ],
    challenges: [
      '金融庁の厳格な審査と継続監督',
      'Know Your Customer (KYC) の実装複雑化',
      'セキュリティ基準への継続的な適合',
      '複数プラットフォームでの一貫した規制対応'
    ],
    solutions: [
      '包括的なコンプライアンス管理システム',
      'RegTech（規制技術）の積極活用',
      '金融機関との戦略的パートナーシップ',
      '継続的な監査と改善プロセス'
    ],
    lessons: [
      '規制産業での新技術導入の慎重さ',
      'コンプライアンス投資の重要性',
      '信頼構築の長期的価値',
      'イノベーションと規制のバランス'
    ],
    industry: 'FinTech・金融',
    difficulty: 'advanced',
    tags: ['金融規制', 'コンプライアンス', 'セキュリティ', 'KYC'],
    externalLinks: [
      { title: '金融庁ガイドライン', url: '#', type: 'official' },
      { title: 'FinTech市場動向', url: '#', type: 'report' },
      { title: '成功事例分析', url: '#', type: 'article' }
    ],
    lastUpdated: '2024-11-18',
    icon: '💳',
    status: 'success'
  },
  {
    id: 'indie-developer-multi-store',
    title: '個人開発者の複数ストア展開成功例',
    summary: '限られたリソースの個人開発者が、戦略的に複数のアプリストアを活用して収益を最大化した事例。小規模開発者向けのベストプラクティス。',
    category: '個人開発',
    region: 'グローバル',
    timeframe: '2022年 - 現在',
    company: '個人開発者（匿名）',
    outcome: '収益300%増加、ユーザーベース拡大',
    keyMetrics: [
      { label: '月間収益', value: '$2,500', trend: 'up' },
      { label: 'ストア展開数', value: '5ストア', trend: 'up' },
      { label: '開発工数増加', value: '20%', trend: 'down' },
      { label: 'ユーザー獲得コスト', value: '-45%', trend: 'up' }
    ],
    challenges: [
      '限られた開発リソースでの複数ストア対応',
      '各ストアの異なる審査基準への対応',
      'マーケティング予算の制約',
      'サポート体制の構築'
    ],
    solutions: [
      'クロスプラットフォーム開発フレームワークの活用',
      'ストア別の最適化とA/Bテスト実施',
      'SNSとコミュニティを活用した無料マーケティング',
      '自動化ツールによる運用効率化'
    ],
    lessons: [
      '小規模でも戦略的アプローチで成功可能',
      'ツール選択と自動化の重要性',
      'コミュニティエンゲージメントの価値',
      'データ駆動による意思決定'
    ],
    industry: 'インディーゲーム・アプリ',
    difficulty: 'beginner',
    tags: ['個人開発', '収益最適化', 'クロスプラットフォーム', 'マーケティング'],
    externalLinks: [
      { title: '開発者ブログ', url: '#', type: 'article' },
      { title: '収益分析レポート', url: '#', type: 'report' },
      { title: 'ツール比較ガイド', url: '#', type: 'official' }
    ],
    lastUpdated: '2024-11-15',
    icon: '🎮',
    status: 'success'
  }
]

const categories = ['すべて', '法廷闘争', '規制対応', '独自ストア', '市場分析', 'コンプライアンス', '個人開発']
const regions = ['すべて', '米国', '欧州（EU）', 'グローバル', '中国', '日本']
const industries = ['すべて', 'ゲーム', 'プラットフォーム', 'モバイル・ハードウェア', 'モバイル・プラットフォーム', 'FinTech・金融', 'インディーゲーム・アプリ']
const statuses = ['すべて', 'success', 'mixed', 'ongoing', 'failed']

export default function CaseStudyComponent() {
  const [selectedCategory, setSelectedCategory] = useState('すべて')
  const [selectedRegion, setSelectedRegion] = useState('すべて')
  const [selectedIndustry, setSelectedIndustry] = useState('すべて')
  const [selectedStatus, setSelectedStatus] = useState('すべて')
  const [expandedCase, setExpandedCase] = useState<string | null>(null)

  const filteredCases = caseStudies.filter(caseStudy => {
    return (
      (selectedCategory === 'すべて' || caseStudy.category === selectedCategory) &&
      (selectedRegion === 'すべて' || caseStudy.region === selectedRegion) &&
      (selectedIndustry === 'すべて' || caseStudy.industry === selectedIndustry) &&
      (selectedStatus === 'すべて' || caseStudy.status === selectedStatus)
    )
  })

  const toggleCase = (caseId: string) => {
    setExpandedCase(expandedCase === caseId ? null : caseId)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return '成功'
      case 'mixed': return '部分的成功'
      case 'ongoing': return '進行中'
      case 'failed': return '失敗'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'mixed': return 'text-yellow-600 bg-yellow-100'
      case 'ongoing': return 'text-blue-600 bg-blue-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '初級'
      case 'intermediate': return '中級'
      case 'advanced': return '上級'
      default: return difficulty
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>ケーススタディ</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">実際の事例から学ぶアプリストア自由化</p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredCases.length}件の事例
        </div>
      </div>

      {/* フィルター */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>カテゴリ: {category}</option>
            ))}
          </select>
        </div>

        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {regions.map(region => (
            <option key={region} value={region}>地域: {region}</option>
          ))}
        </select>

        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {industries.map(industry => (
            <option key={industry} value={industry}>業界: {industry}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              結果: {status === 'すべて' ? status : getStatusLabel(status)}
            </option>
          ))}
        </select>
      </div>

      {/* ケーススタディ一覧 */}
      <div className="space-y-6">
        {filteredCases.length > 0 ? (
          filteredCases.map((caseStudy) => (
            <div
              key={caseStudy.id}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <span className="text-4xl">{caseStudy.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{caseStudy.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{caseStudy.summary}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className={`px-3 py-1 rounded-full ${getStatusColor(caseStudy.status)}`}>
                          {getStatusLabel(caseStudy.status)}
                        </span>
                        <span className={`px-3 py-1 rounded-full ${getDifficultyColor(caseStudy.difficulty)}`}>
                          {getDifficultyLabel(caseStudy.difficulty)}
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                          {caseStudy.category}
                        </span>
                        <span className="flex items-center space-x-1 text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{caseStudy.timeframe}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleCase(caseStudy.id)}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {expandedCase === caseStudy.id ? '詳細を閉じる' : '詳細を見る'}
                    </span>
                  </button>
                </div>

                {/* 基本情報の概要 */}
                <div className="grid gap-4 md:grid-cols-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-600 mb-1">対象地域</div>
                    <div className="font-semibold">{caseStudy.region}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-600 mb-1">業界</div>
                    <div className="font-semibold">{caseStudy.industry}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-600 mb-1">結果</div>
                    <div className="font-semibold text-sm">{caseStudy.outcome}</div>
                  </div>
                </div>
              </div>

              {/* 展開された詳細情報 */}
              {expandedCase === caseStudy.id && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-6 space-y-8">
                    {/* 主要指標 */}
                    {caseStudy.keyMetrics && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5" />
                          <span>主要指標</span>
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          {caseStudy.keyMetrics.map((metric, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xl font-bold text-gray-900">{metric.value}</span>
                                {metric.trend && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    metric.trend === 'up' ? 'text-green-600 bg-green-100' :
                                    metric.trend === 'down' ? 'text-red-600 bg-red-100' :
                                    'text-gray-600 bg-gray-100'
                                  }`}>
                                    {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 課題・解決策・教訓 */}
                    <div className="grid gap-8 lg:grid-cols-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                          <span>課題</span>
                        </h4>
                        <div className="space-y-3">
                          {caseStudy.challenges.map((challenge, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="text-sm text-gray-700">{challenge}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span>解決策</span>
                        </h4>
                        <div className="space-y-3">
                          {caseStudy.solutions.map((solution, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="text-sm text-gray-700">{solution}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                          <Users className="w-5 h-5 text-blue-500" />
                          <span>教訓</span>
                        </h4>
                        <div className="space-y-3">
                          {caseStudy.lessons.map((lesson, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="text-sm text-gray-700">{lesson}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* タグと外部リンク */}
                    <div className="flex flex-col space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">関連タグ</h4>
                        <div className="flex flex-wrap gap-2">
                          {caseStudy.tags.map((tag, index) => (
                            <span key={index} className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {caseStudy.externalLinks && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">参考資料</h4>
                          <div className="flex flex-wrap gap-3">
                            {caseStudy.externalLinks.map((link, index) => (
                              <a
                                key={index}
                                href={link.url}
                                className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>{link.title}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  link.type === 'official' ? 'bg-blue-100 text-blue-600' :
                                  link.type === 'report' ? 'bg-green-100 text-green-600' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {link.type === 'official' ? '公式' : link.type === 'report' ? 'レポート' : '記事'}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">該当するケーススタディがありませんでした</p>
            <p className="text-sm text-gray-400 mt-1">別のフィルター条件でお試しください</p>
          </div>
        )}
      </div>

      {/* フッター */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div className="text-sm text-gray-500">
          事例総数: {caseStudies.length}件 | 最終更新: {new Date().toLocaleDateString('ja-JP')}
        </div>
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <button className="text-blue-600 hover:text-blue-700">
            新しい事例を提案
          </button>
          <button className="text-blue-600 hover:text-blue-700">
            分析レポート
          </button>
        </div>
      </div>
    </div>
  )
}