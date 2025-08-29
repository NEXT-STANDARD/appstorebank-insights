'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp, MessageCircleQuestion, Tag, Book, AlertCircle } from 'lucide-react'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  relatedTerms?: string[]
  lastUpdated: string
  isPopular?: boolean
}

const faqData: FAQ[] = [
  {
    id: 'what-is-app-store-liberalization',
    question: 'アプリストア自由化とは何ですか？',
    answer: 'アプリストア自由化とは、これまでAppleのApp StoreやGoogle Play Storeなどの大手プラットフォームが独占的に提供していたアプリ配布・決済システムを開放し、第三者による代替アプリストアやサイドローディング（直接インストール）を可能にする取り組みです。\n\n日本では2024年6月12日にスマートフォン新法（特定ソフトウェア指定法）が成立し、2025年12月までに施行される予定です。これにより、iPhone・Android端末ともに、純正以外のアプリストアからのアプリインストールが可能になります。',
    category: '法規制・政策',
    tags: ['スマホ新法', '競争政策', 'デジタル市場', '規制緩和'],
    difficulty: 'beginner',
    relatedTerms: ['サイドローディング', 'DMA', 'ゲートキーパー規制'],
    lastUpdated: '2024-12-01',
    isPopular: true
  },
  {
    id: 'app-store-commission-rates',
    question: '各アプリストアの手数料率はどのくらいですか？',
    answer: '主要アプリストアの手数料率は以下の通りです：\n\n**Apple App Store:**\n- 標準: 30%\n- Small Business Program（年収$100万以下）: 15%\n- サブスクリプション（1年経過後）: 15%\n\n**Google Play Store:**\n- 標準: 30%\n- Play Media Experience Program: 15%\n- サブスクリプション（1年経過後）: 15%\n- 年収$100万以下の開発者: 15%\n\n**第三者ストア（予想）:**\n- Epic Games Store: 12%\n- Amazon Appstore: 30%（Amazonデバイス）、70%（他社デバイス）\n- Samsung Galaxy Store: 30%\n\n※手数料率は変更される可能性があり、各ストアの最新情報を確認することをお勧めします。',
    category: 'ビジネスモデル',
    tags: ['手数料', '収益化', 'App Store', 'Google Play', 'コスト'],
    difficulty: 'intermediate',
    relatedTerms: ['レベニューシェア', 'Small Business Program'],
    lastUpdated: '2024-11-25'
  },
  {
    id: 'sideloading-security-risks',
    question: 'サイドローディングにはセキュリティリスクがありますか？',
    answer: 'サイドローディングには以下のようなセキュリティリスクが存在します：\n\n**主なリスク:**\n- マルウェアやウイルスを含むアプリのインストール\n- 個人情報の不正収集\n- フィッシング攻撃やソーシャルエンジニアリング\n- デバイスの脆弱性を悪用した攻撃\n\n**対策方法:**\n- 信頼できるソースからのみアプリをダウンロード\n- アプリの権限要求を慎重に確認\n- 定期的なセキュリティアップデート\n- ウイルス対策ソフトの活用\n- レビューや評価の確認\n\n**企業での対応:**\n- Mobile Device Management (MDM) による管理\n- アプリホワイトリストの作成\n- 従業員への教育・研修\n\nただし、適切な対策を講じることで、これらのリスクは大幅に軽減することができます。',
    category: 'セキュリティ',
    tags: ['セキュリティ', 'リスク管理', 'MDM', 'マルウェア'],
    difficulty: 'intermediate',
    relatedTerms: ['サイドローディング', 'モバイルセキュリティ'],
    lastUpdated: '2024-11-20',
    isPopular: true
  },
  {
    id: 'alternative-app-stores-japan',
    question: '日本で利用可能になる第三者アプリストアはありますか？',
    answer: '2025年12月のスマホ新法施行後、日本でも複数の第三者アプリストアが利用可能になる予定です：\n\n**確定・検討中のストア:**\n- Epic Games Store（ゲーム特化）\n- Amazon Appstore\n- Samsung Galaxy Store（Android）\n- F-Droid（オープンソース、Android）\n\n**日本企業による新規参入の可能性:**\n- 楽天（楽天市場との連携）\n- Yahoo/LINEグループ\n- メルカリ\n- DeNA\n\n**企業向け専用ストア:**\n- Microsoft Intune Company Portal\n- VMware Workspace ONE\n- 各企業の独自エンタープライズストア\n\n多くの企業が日本市場への参入を検討しており、法施行後は選択肢が大幅に増加することが予想されます。特にゲーム、エンタープライズ、特定業界向けの専門ストアの登場が期待されています。',
    category: '市場動向',
    tags: ['第三者ストア', '日本市場', '競合他社', '新規参入'],
    difficulty: 'beginner',
    relatedTerms: ['Epic Games Store', 'スマホ新法'],
    lastUpdated: '2024-11-30'
  },
  {
    id: 'dma-vs-smartphone-law',
    question: '欧州DMAと日本のスマホ新法の違いは何ですか？',
    answer: '欧州のデジタル市場法（DMA）と日本のスマートフォン新法には以下のような違いがあります：\n\n**欧州DMA（2024年3月施行）:**\n- 対象: 「ゲートキーパー」指定企業（Apple、Google、Meta等）\n- 範囲: アプリストア、検索エンジン、SNS、メッセージング等\n- 制裁: 売上高の10-20%の制裁金\n- サイドローディング: 即座に義務化\n\n**日本スマホ新法（2025年12月施行予定）:**\n- 対象: 「特定ソフトウェア」指定事業者\n- 範囲: 主にモバイルOS・アプリストア\n- 制裁: 是正命令、事業者名公表\n- サイドローディング: 段階的導入\n\n**主な相違点:**\n- **施行時期**: DMA が先行、日本は約2年遅れ\n- **対象範囲**: DMA がより包括的\n- **制裁措置**: DMA の方が重い金銭的制裁\n- **実施方法**: 日本は対話重視、欧州は強制力重視\n\nただし、基本的な目的（市場競争促進、消費者選択肢拡大）は共通しています。',
    category: '法規制・政策',
    tags: ['DMA', 'スマホ新法', '国際比較', 'ゲートキーパー規制'],
    difficulty: 'advanced',
    relatedTerms: ['ゲートキーパー規制', 'DMA', 'デジタル市場法'],
    lastUpdated: '2024-11-28'
  },
  {
    id: 'developer-preparation-checklist',
    question: '開発者は何を準備すべきですか？',
    answer: 'アプリストア自由化に向けて、開発者は以下の準備を進めることをお勧めします：\n\n**1. 技術的準備**\n- アプリの複数ストア対応\n- 異なる決済システムへの対応\n- セキュリティ強化とコード署名\n- アプリパッケージ形式の多様化対応\n\n**2. ビジネス戦略**\n- 各ストアの手数料率比較・分析\n- ターゲットユーザーに適したストア選択\n- マーケティング戦略の再検討\n- 収益モデルの最適化\n\n**3. 法的・コンプライアンス**\n- 各国の法規制への対応\n- プライバシーポリシーの更新\n- 年齢制限・コンテンツレーティング\n- 消費者保護法への対応\n\n**4. 運用体制**\n- 複数ストア管理体制の構築\n- カスタマーサポート体制\n- アップデート・メンテナンス計画\n- 分析・レポート体制\n\n詳細なチェックリストは当サイトの「開発者向けチェックリスト」をご活用ください。',
    category: '開発・技術',
    tags: ['開発者', 'チェックリスト', '準備', 'コンプライアンス'],
    difficulty: 'intermediate',
    relatedTerms: ['開発者向けチェックリスト', 'コンプライアンス'],
    lastUpdated: '2024-11-22',
    isPopular: true
  },
  {
    id: 'app-discovery-methods',
    question: '第三者ストアでアプリを見つけてもらうにはどうすればいいですか？',
    answer: '第三者アプリストアでの App Discovery（アプリ発見）を向上させる方法：\n\n**ASO（App Store最適化）**\n- キーワード最適化とローカライゼーション\n- 魅力的なアプリタイトルと説明文\n- 高品質なスクリーンショットと動画\n- 定期的なアップデートとレビュー対応\n\n**マーケティング施策**\n- ソーシャルメディアでのプロモーション\n- インフルエンサーマーケティング\n- プレスリリースとメディア露出\n- クロスプロモーション（他のアプリとの相互紹介）\n\n**ストア固有の対策**\n- 各ストアのフィーチャード枠への応募\n- ストア独自の推薦システムの活用\n- カテゴリー最適化\n- レビュー・評価の積極的な獲得\n\n**データ分析**\n- ユーザー獲得経路の分析\n- 各ストアでの成果測定\n- A/Bテストによる最適化\n- 競合分析と差別化\n\n多様なストアの特性を理解し、それぞれに最適化したアプローチが重要です。',
    category: 'マーケティング',
    tags: ['ASO', 'マーケティング', '集客', 'プロモーション'],
    difficulty: 'intermediate',
    relatedTerms: ['ASO', 'App Discovery'],
    lastUpdated: '2024-11-18'
  },
  {
    id: 'ios-sideloading-requirements',
    question: 'iOSでサイドローディングするための要件は何ですか？',
    answer: 'iOS 17.4以降（EU地域）およびスマホ新法施行後の日本でのiOSサイドローディング要件：\n\n**技術的要件**\n- iOS 17.4以降のバージョン\n- Apple Developer Program登録（年額99ドル）\n- Notarization（公証）プロセスの完了\n- 適切なコード署名とEntitlements\n\n**第三者アプリストア要件**\n- Apple の Marketplace Web Distribution 承認\n- 100万ユーロの銀行信用状または保険\n- ストア運営者の身元確認\n- Appleのマーケットプレイス審査通過\n\n**開発者側の準備**\n- Alternative App Marketplace Entitlement申請\n- App の Notarization 対応\n- 新しいインストール・アップデート仕組みへの対応\n- Core Technology Fee（CTF）の考慮（EU地域）\n\n**ユーザー側の操作**\n- 設定でサイドローディングを有効化\n- 各種セキュリティ警告への同意\n- 信頼できないソース許可\n\n詳細な技術仕様は随時更新されるため、Apple Developer documentationの確認が必要です。',
    category: '開発・技術',
    tags: ['iOS', 'サイドローディング', 'Apple', '技術要件'],
    difficulty: 'advanced',
    relatedTerms: ['サイドローディング', 'Notarization'],
    lastUpdated: '2024-11-15'
  }
]

const categories = ['すべて', '法規制・政策', 'ビジネスモデル', 'セキュリティ', '市場動向', '開発・技術', 'マーケティング']
const difficulties = ['すべて', 'beginner', 'intermediate', 'advanced']

export default function FAQComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('すべて')
  const [selectedDifficulty, setSelectedDifficulty] = useState('すべて')
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set())
  const [showOnlyPopular, setShowOnlyPopular] = useState(false)

  const filteredFAQs = useMemo(() => {
    return faqData.filter(faq => {
      const matchesSearch = searchTerm === '' || 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'すべて' || faq.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'すべて' || faq.difficulty === selectedDifficulty
      const matchesPopular = !showOnlyPopular || faq.isPopular

      return matchesSearch && matchesCategory && matchesDifficulty && matchesPopular
    })
  }, [searchTerm, selectedCategory, selectedDifficulty, showOnlyPopular])

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(faqId)) {
        newSet.delete(faqId)
      } else {
        newSet.add(faqId)
      }
      return newSet
    })
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
            <MessageCircleQuestion className="w-6 h-6 text-blue-600" />
            <span>よくある質問</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">アプリストア自由化に関する疑問を解決</p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredFAQs.length}件の質問
        </div>
      </div>

      {/* 検索・フィルター */}
      <div className="space-y-4 mb-8">
        {/* 検索バー */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="質問や回答内容から検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* フィルター */}
        <div className="flex flex-wrap gap-4">
          {/* カテゴリフィルター */}
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-gray-600" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* 難易度フィルター */}
          <div className="flex items-center space-x-2">
            <Book className="w-4 h-4 text-gray-600" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'すべて' ? difficulty : getDifficultyLabel(difficulty)}
                </option>
              ))}
            </select>
          </div>

          {/* 人気質問フィルター */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyPopular}
              onChange={(e) => setShowOnlyPopular(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">人気質問のみ</span>
          </label>
        </div>
      </div>

      {/* FAQ一覧 */}
      <div className="space-y-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-lg transition-all hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{faq.question}</h3>
                      {faq.isPopular && (
                        <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                          人気
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                        {faq.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(faq.difficulty)}`}>
                        {getDifficultyLabel(faq.difficulty)}
                      </span>
                      <span className="flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>更新: {faq.lastUpdated}</span>
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {expandedFAQs.has(faq.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </div>
              </button>

              {expandedFAQs.has(faq.id) && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-200 pt-4">
                    <div className="prose max-w-none text-gray-700 text-sm leading-relaxed">
                      {faq.answer.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 last:mb-0">
                          {paragraph.split('\n').map((line, lineIndex) => (
                            <span key={lineIndex}>
                              {line}
                              {lineIndex < paragraph.split('\n').length - 1 && <br />}
                            </span>
                          ))}
                        </p>
                      ))}
                    </div>

                    {/* タグ */}
                    {faq.tags.length > 0 && (
                      <div className="mt-4">
                        <div className="text-xs text-gray-600 mb-2">関連タグ:</div>
                        <div className="flex flex-wrap gap-2">
                          {faq.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 関連用語 */}
                    {faq.relatedTerms && faq.relatedTerms.length > 0 && (
                      <div className="mt-4">
                        <div className="text-xs text-gray-600 mb-2">関連用語:</div>
                        <div className="flex flex-wrap gap-2">
                          {faq.relatedTerms.map((term, index) => (
                            <button
                              key={index}
                              className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageCircleQuestion className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">該当する質問が見つかりませんでした</p>
            <p className="text-sm text-gray-400 mt-1">別のキーワードや条件でお試しください</p>
          </div>
        )}
      </div>

      {/* フッター */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div className="text-sm text-gray-500">
          質問総数: {faqData.length}件 | 最終更新: {new Date().toLocaleDateString('ja-JP')}
        </div>
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <button className="text-blue-600 hover:text-blue-700">
            質問を投稿する
          </button>
          <button className="text-blue-600 hover:text-blue-700">
            改善提案
          </button>
        </div>
      </div>
    </div>
  )
}