'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, BookOpen, Filter, ExternalLink, Lightbulb, Tag } from 'lucide-react'

interface GlossaryTerm {
  id: string
  term: string
  reading?: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  definition: string
  context: string
  examples: string[]
  relatedTerms: string[]
  externalLinks?: { title: string; url: string }[]
  tags: string[]
}

const glossaryData: GlossaryTerm[] = [
  {
    id: 'app-store-optimization',
    term: 'ASO',
    reading: 'エーエスオー',
    category: 'マーケティング',
    difficulty: 'beginner',
    definition: 'App Store Optimization（アプリストア最適化）の略。アプリストア内でアプリが発見されやすくするための最適化手法。',
    context: 'アプリの可視性向上とダウンロード数増加を目的として行われる重要な施策です。',
    examples: [
      'キーワードを意識したアプリタイトルの設定',
      'アプリアイコンの最適化',
      'スクリーンショットの改善',
      '説明文での関連キーワード活用'
    ],
    relatedTerms: ['キーワード最適化', 'コンバージョン率', 'アプリランキング'],
    externalLinks: [
      { title: 'Apple ASO ガイドライン', url: 'https://developer.apple.com/app-store/product-page/' }
    ],
    tags: ['マーケティング', '最適化', 'SEO', 'ダウンロード']
  },
  {
    id: 'commission-rate',
    term: '手数料率',
    reading: 'てすうりょうりつ',
    category: '収益・課金',
    difficulty: 'beginner',
    definition: 'アプリストアが開発者から徴収する、アプリ売上に対する手数料の割合。',
    context: 'アプリの収益性に直接影響するため、ストア選択時の重要な判断材料となります。',
    examples: [
      'Apple App Store: 30%（小規模事業者は15%）',
      'Google Play: 30%（小規模事業者は15%）',
      'Epic Games Store: 12%',
      'Microsoft Store: 15%（ゲームは30%）'
    ],
    relatedTerms: ['小規模事業者プログラム', '売上分配', 'デベロッパー収益'],
    tags: ['手数料', '収益', 'ビジネスモデル', 'コスト']
  },
  {
    id: 'third-party-app-store',
    term: '第三者アプリストア',
    reading: 'だいさんしゃアプリストア',
    category: '法規制・政策',
    difficulty: 'intermediate',
    definition: 'プラットフォーマー（Apple、Google）以外の企業が運営するアプリストア。代替アプリストアとも呼ばれる。',
    context: '2025年12月のスマートフォン新法完全施行により、日本でも本格的な展開が始まる予定です。',
    examples: [
      'Epic Games Store',
      'Amazon Appstore',
      'Samsung Galaxy Store',
      'Microsoft Store（モバイル版）'
    ],
    relatedTerms: ['スマートフォン新法', 'サイドローディング', 'アプリストア自由化'],
    externalLinks: [
      { title: 'スマートフォン新法について', url: 'https://www.soumu.go.jp/menu_news/s-news/01kiban18_01000174.html' }
    ],
    tags: ['法規制', '新法', '競争', '選択肢']
  },
  {
    id: 'sideloading',
    term: 'サイドローディング',
    reading: 'サイドローディング',
    category: '技術・インフラ',
    difficulty: 'intermediate',
    definition: '公式アプリストア以外の方法でアプリをデバイスにインストールする行為。',
    context: 'セキュリティリスクがある反面、開発者にとってはストア手数料を回避できるメリットがあります。',
    examples: [
      'APKファイルの直接インストール（Android）',
      'TestFlightでのベータ配信（iOS）',
      'エンタープライズ配信（iOS）',
      'Web経由でのアプリインストール'
    ],
    relatedTerms: ['APK', 'TestFlight', 'エンタープライズ配信'],
    tags: ['技術', 'インストール', 'セキュリティ', '配信方法']
  },
  {
    id: 'in-app-purchase',
    term: 'アプリ内課金',
    reading: 'アプリないかきん',
    category: '収益・課金',
    difficulty: 'beginner',
    definition: 'アプリをダウンロードした後に、アプリ内で追加コンテンツやサービスを購入すること。',
    context: 'フリーミアムモデルの主要収益源として、多くのアプリで採用されています。',
    examples: [
      'ゲーム内通貨の購入',
      'プレミアム機能のアンロック',
      'アバターやスキンの購入',
      '広告除去オプション'
    ],
    relatedTerms: ['フリーミアム', 'サブスクリプション', 'マイクロトランザクション'],
    tags: ['課金', '収益化', 'ゲーム', 'マネタイズ']
  },
  {
    id: 'freemium',
    term: 'フリーミアム',
    reading: 'フリーミアム',
    category: 'ビジネスモデル',
    difficulty: 'beginner',
    definition: '基本機能は無料で提供し、高度な機能や追加コンテンツを有料で提供するビジネスモデル。',
    context: 'ユーザー獲得のハードルを下げつつ、収益化も図れる効果的な戦略として広く採用されています。',
    examples: [
      'Spotify（無料版→プレミアム版）',
      'Dropbox（無料ストレージ→有料拡張）',
      'ゲームアプリ（基本無料→アイテム課金）'
    ],
    relatedTerms: ['アプリ内課金', 'サブスクリプション', 'ユーザー獲得コスト'],
    tags: ['ビジネスモデル', 'マネタイズ', '無料', '有料']
  },
  {
    id: 'retention-rate',
    term: '継続率',
    reading: 'けいぞくりつ',
    category: 'アナリティクス',
    difficulty: 'intermediate',
    definition: 'アプリをダウンロードしたユーザーが、特定期間後も継続して利用している割合。',
    context: 'アプリの成功指標として最重要視される数値の一つで、収益性と直結します。',
    examples: [
      '1日後継続率: 25-30%が一般的',
      '7日後継続率: 10-15%が一般的',
      '30日後継続率: 5-10%が一般的'
    ],
    relatedTerms: ['LTV', 'DAU', 'エンゲージメント率'],
    tags: ['KPI', '分析', 'ユーザー行動', '成功指標']
  },
  {
    id: 'ltv',
    term: 'LTV',
    reading: 'エルティーブイ',
    category: 'アナリティクス',
    difficulty: 'advanced',
    definition: 'Life Time Value（顧客生涯価値）の略。一人のユーザーがアプリ利用期間中に生み出す総収益。',
    context: 'ユーザー獲得コスト（CAC）と比較することで、マーケティング投資の効果を測定できます。',
    examples: [
      'ゲームアプリ: 平均¥1,200-¥3,000',
      'サブスクアプリ: 年間契約額×継続年数',
      'ECアプリ: 平均注文額×注文頻度×利用期間'
    ],
    relatedTerms: ['CAC', '継続率', 'ARPU'],
    tags: ['KPI', '収益分析', 'ROI', 'マーケティング']
  }
]

const categories = [
  'すべて',
  'マーケティング',
  '収益・課金',
  '法規制・政策',
  '技術・インフラ',
  'ビジネスモデル',
  'アナリティクス'
]

const difficulties = [
  'すべて',
  'beginner',
  'intermediate', 
  'advanced'
]

const difficultyLabels = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級'
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
}

export default function GlossaryComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('すべて')
  const [selectedDifficulty, setSelectedDifficulty] = useState('すべて')
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null)

  const filteredTerms = useMemo(() => {
    return glossaryData.filter(term => {
      const matchesSearch = searchTerm === '' || 
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.reading?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'すべて' || term.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'すべて' || term.difficulty === selectedDifficulty

      return matchesSearch && matchesCategory && matchesDifficulty
    })
  }, [searchTerm, selectedCategory, selectedDifficulty])

  const toggleExpanded = (termId: string) => {
    setExpandedTerm(expandedTerm === termId ? null : termId)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>アプリストア用語集</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            アプリストア業界の専門用語をわかりやすく解説
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredTerms.length} / {glossaryData.length} 用語
        </div>
      </div>

      {/* 検索・フィルター */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* 検索ボックス */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="用語・読み方・説明文で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* カテゴリフィルター */}
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* 難易度フィルター */}
        <div>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'すべて' ? difficulty : difficultyLabels[difficulty as keyof typeof difficultyLabels]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 用語一覧 */}
      <div className="space-y-4">
        {filteredTerms.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">該当する用語が見つかりません</p>
            <p className="text-sm text-gray-400 mt-2">検索条件を変更してお試しください</p>
          </div>
        ) : (
          filteredTerms.map(term => (
            <div
              key={term.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              {/* 用語ヘッダー */}
              <button
                onClick={() => toggleExpanded(term.id)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{term.term}</h3>
                      {term.reading && (
                        <p className="text-sm text-gray-500">（{term.reading}）</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColors[term.difficulty]}`}>
                        {difficultyLabels[term.difficulty]}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {term.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-blue-600">
                    {expandedTerm === term.id ? '−' : '+'}
                  </div>
                </div>

                {/* 基本定義 */}
                <p className="text-gray-700 mb-3">{term.definition}</p>

                {/* タグ */}
                <div className="flex flex-wrap gap-2">
                  {term.tags.slice(0, 4).map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                  {term.tags.length > 4 && (
                    <span className="text-xs text-gray-400">+{term.tags.length - 4}</span>
                  )}
                </div>
              </button>

              {/* 詳細情報（展開時） */}
              {expandedTerm === term.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {/* コンテキスト */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      <span>詳細説明</span>
                    </h4>
                    <p className="text-gray-700">{term.context}</p>
                  </div>

                  {/* 具体例 */}
                  {term.examples.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">具体例</h4>
                      <ul className="space-y-2">
                        {term.examples.map((example, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span className="text-gray-700">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 関連用語 */}
                  {term.relatedTerms.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-gray-500" />
                        <span>関連用語</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {term.relatedTerms.map((relatedTerm, index) => (
                          <button
                            key={index}
                            onClick={() => setSearchTerm(relatedTerm)}
                            className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                          >
                            {relatedTerm}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 外部リンク */}
                  {term.externalLinks && term.externalLinks.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-3">参考リンク</h4>
                      <div className="space-y-2">
                        {term.externalLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span className="text-sm">{link.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 全タグ表示 */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">タグ</h4>
                    <div className="flex flex-wrap gap-2">
                      {term.tags.map((tag, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchTerm(tag)}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* フッター */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          💡 用語の追加リクエストや修正提案がありましたら、
          <button className="text-blue-600 hover:text-blue-700 font-medium ml-1">
            お問い合わせ
          </button>
          ください
        </p>
      </div>
    </div>
  )
}