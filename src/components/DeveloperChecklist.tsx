'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronDown, ChevronRight, Download, RefreshCw, FileText, AlertTriangle, Info, ExternalLink } from 'lucide-react'

interface ChecklistItem {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: string
  completed: boolean
  links?: { title: string; url: string }[]
  tips?: string[]
}

interface ChecklistCategory {
  id: string
  title: string
  description: string
  icon: string
  items: ChecklistItem[]
}

const initialChecklist: ChecklistCategory[] = [
  {
    id: 'legal-compliance',
    title: '法務・コンプライアンス',
    description: 'アプリストア規約と法的要件への準拠',
    icon: '⚖️',
    items: [
      {
        id: 'app-store-policies',
        title: 'アプリストア規約の確認',
        description: '各ストアのデベロッパーガイドラインを熟読し、規約違反となる要素がないか確認',
        priority: 'high',
        category: '法務',
        completed: false,
        links: [
          { title: 'Apple App Store Review Guidelines', url: 'https://developer.apple.com/app-store/review/guidelines/' },
          { title: 'Google Play Policy Center', url: 'https://play.google.com/about/developer-policy/' }
        ]
      },
      {
        id: 'privacy-policy',
        title: 'プライバシーポリシーの作成',
        description: 'ユーザーデータの収集・利用について明記したプライバシーポリシーの準備',
        priority: 'high',
        category: '法務',
        completed: false,
        tips: ['日本の個人情報保護法に準拠', 'GDPR対応も考慮', 'アプリ内でアクセス可能にする']
      },
      {
        id: 'terms-of-service',
        title: '利用規約の整備',
        description: 'アプリの利用条件やユーザーの権利義務を定めた利用規約の作成',
        priority: 'high',
        category: '法務',
        completed: false
      },
      {
        id: 'age-rating',
        title: '年齢レーティングの設定',
        description: 'アプリの内容に応じた適切な年齢制限レーティングの申請',
        priority: 'medium',
        category: '法務',
        completed: false,
        tips: ['CERO（日本）、ESRB（北米）、PEGI（欧州）の基準確認']
      },
      {
        id: 'intellectual-property',
        title: '知的財産権の確認',
        description: '使用する画像、音声、フォント等の著作権・商標権侵害がないかチェック',
        priority: 'high',
        category: '法務',
        completed: false
      }
    ]
  },
  {
    id: 'technical-requirements',
    title: '技術的要件',
    description: 'アプリの品質とパフォーマンス基準',
    icon: '🔧',
    items: [
      {
        id: 'platform-compatibility',
        title: 'プラットフォーム対応確認',
        description: '対象OSバージョンでの動作確認と互換性テスト',
        priority: 'high',
        category: '技術',
        completed: false,
        tips: ['最新3バージョンでの動作確認推奨', 'デバイス固有機能の対応状況確認']
      },
      {
        id: 'security-measures',
        title: 'セキュリティ対策',
        description: 'データ暗号化、通信のHTTPS化、脆弱性対策の実装',
        priority: 'high',
        category: '技術',
        completed: false
      },
      {
        id: 'performance-optimization',
        title: 'パフォーマンス最適化',
        description: 'アプリサイズ、起動時間、メモリ使用量の最適化',
        priority: 'medium',
        category: '技術',
        completed: false,
        tips: ['アプリサイズは100MB以下推奨', '起動時間3秒以内目標']
      },
      {
        id: 'accessibility',
        title: 'アクセシビリティ対応',
        description: '障害を持つユーザーでも利用可能なUI/UXの実装',
        priority: 'medium',
        category: '技術',
        completed: false,
        links: [
          { title: 'iOS Accessibility', url: 'https://developer.apple.com/accessibility/' },
          { title: 'Android Accessibility', url: 'https://developer.android.com/guide/topics/ui/accessibility' }
        ]
      },
      {
        id: 'testing-coverage',
        title: '包括的テストの実施',
        description: 'ユニットテスト、統合テスト、UIテストの実施と品質保証',
        priority: 'high',
        category: '技術',
        completed: false
      }
    ]
  },
  {
    id: 'app-store-assets',
    title: 'ストア掲載素材',
    description: 'アプリストアでの見栄えを決める重要な要素',
    icon: '🎨',
    items: [
      {
        id: 'app-icon',
        title: 'アプリアイコンの準備',
        description: '各プラットフォームの仕様に合わせた高品質なアプリアイコンの作成',
        priority: 'high',
        category: '素材',
        completed: false,
        tips: ['1024x1024px（iOS）、512x512px（Android）', 'シンプルで認識しやすいデザイン']
      },
      {
        id: 'screenshots',
        title: 'スクリーンショット撮影',
        description: 'アプリの魅力を伝える効果的なスクリーンショットの準備',
        priority: 'high',
        category: '素材',
        completed: false,
        tips: ['各デバイスサイズ対応', '機能説明テキスト追加', '最低3枚、最大10枚']
      },
      {
        id: 'app-preview-video',
        title: 'プレビュー動画の作成',
        description: 'アプリの使用方法や魅力を紹介する短尺動画',
        priority: 'medium',
        category: '素材',
        completed: false,
        tips: ['15-30秒推奨', '音声なしでも理解できる内容']
      },
      {
        id: 'localization-assets',
        title: '多言語対応素材',
        description: 'ターゲット地域の言語に合わせたストア掲載情報の翻訳',
        priority: 'medium',
        category: '素材',
        completed: false
      }
    ]
  },
  {
    id: 'marketing-preparation',
    title: 'マーケティング準備',
    description: 'アプリの認知度向上とユーザー獲得戦略',
    icon: '📢',
    items: [
      {
        id: 'app-description',
        title: 'アプリ説明文の最適化',
        description: 'ASO（アプリストア最適化）を意識した魅力的な説明文の作成',
        priority: 'high',
        category: 'マーケティング',
        completed: false,
        tips: ['キーワード戦略', '最初の3行で興味を引く', '機能と利益を明確に']
      },
      {
        id: 'keyword-research',
        title: 'キーワード調査',
        description: 'ユーザーの検索行動を分析し、効果的なキーワードを選定',
        priority: 'medium',
        category: 'マーケティング',
        completed: false
      },
      {
        id: 'competitor-analysis',
        title: '競合アプリ分析',
        description: '同カテゴリの成功アプリの戦略分析と差別化ポイントの明確化',
        priority: 'medium',
        category: 'マーケティング',
        completed: false
      },
      {
        id: 'launch-strategy',
        title: 'ローンチ戦略の策定',
        description: 'リリース時期、プロモーション計画、PR活動の計画立案',
        priority: 'medium',
        category: 'マーケティング',
        completed: false
      }
    ]
  },
  {
    id: 'business-setup',
    title: '事業準備',
    description: 'アプリ収益化と継続運営のための基盤整備',
    icon: '💼',
    items: [
      {
        id: 'developer-account',
        title: 'デベロッパーアカウント登録',
        description: '各アプリストアのデベロッパープログラムへの登録と年会費支払い',
        priority: 'high',
        category: '事業',
        completed: false,
        tips: ['Apple: $99/年', 'Google: $25（一回のみ）', '法人アカウント推奨']
      },
      {
        id: 'tax-setup',
        title: '税務・会計設定',
        description: 'アプリ収益の税務処理と会計システムの整備',
        priority: 'high',
        category: '事業',
        completed: false
      },
      {
        id: 'analytics-setup',
        title: '分析ツール導入',
        description: 'ユーザー行動分析やアプリパフォーマンス測定ツールの設定',
        priority: 'medium',
        category: '事業',
        completed: false,
        links: [
          { title: 'Google Analytics for Firebase', url: 'https://firebase.google.com/products/analytics' },
          { title: 'App Store Connect Analytics', url: 'https://developer.apple.com/app-store-connect/analytics/' }
        ]
      },
      {
        id: 'support-system',
        title: 'ユーザーサポート体制',
        description: '問い合わせ対応、バグ報告受付、アップデート対応の仕組み構築',
        priority: 'medium',
        category: '事業',
        completed: false
      }
    ]
  }
]

export default function DeveloperChecklist() {
  const [checklist, setChecklist] = useState<ChecklistCategory[]>(initialChecklist)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['legal-compliance']))
  const [selectedPriority, setSelectedPriority] = useState<string>('all')

  // ローカルストレージから進捗を読み込み
  useEffect(() => {
    const savedProgress = localStorage.getItem('developerChecklistProgress')
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress)
        setChecklist(prev => prev.map(category => ({
          ...category,
          items: category.items.map(item => ({
            ...item,
            completed: progress[item.id] || false
          }))
        })))
      } catch (error) {
        console.error('Failed to load checklist progress:', error)
      }
    }
  }, [])

  // 進捗をローカルストレージに保存
  const saveProgress = (newChecklist: ChecklistCategory[]) => {
    const progress: Record<string, boolean> = {}
    newChecklist.forEach(category => {
      category.items.forEach(item => {
        progress[item.id] = item.completed
      })
    })
    localStorage.setItem('developerChecklistProgress', JSON.stringify(progress))
  }

  const toggleItem = (categoryId: string, itemId: string) => {
    const newChecklist = checklist.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        }
      }
      return category
    })
    setChecklist(newChecklist)
    saveProgress(newChecklist)
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const resetProgress = () => {
    const resetChecklist = checklist.map(category => ({
      ...category,
      items: category.items.map(item => ({ ...item, completed: false }))
    }))
    setChecklist(resetChecklist)
    localStorage.removeItem('developerChecklistProgress')
  }

  const exportToPDF = () => {
    // 簡易的なテキストダウンロード（実際のPDF生成ライブラリに置き換え可能）
    let content = 'アプリストア登録前チェックリスト\n\n'
    
    checklist.forEach(category => {
      content += `## ${category.icon} ${category.title}\n`
      content += `${category.description}\n\n`
      
      category.items.forEach(item => {
        const status = item.completed ? '✅' : '⬜'
        const priority = item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟡' : '🟢'
        content += `${status} ${priority} ${item.title}\n`
        content += `   ${item.description}\n\n`
      })
      content += '\n'
    })

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'app-store-checklist.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filteredChecklist = checklist.map(category => ({
    ...category,
    items: selectedPriority === 'all' 
      ? category.items 
      : category.items.filter(item => item.priority === selectedPriority)
  }))

  const totalItems = checklist.reduce((sum, category) => sum + category.items.length, 0)
  const completedItems = checklist.reduce((sum, category) => 
    sum + category.items.filter(item => item.completed).length, 0
  )
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '高優先度'
      case 'medium': return '中優先度'
      case 'low': return '低優先度'
      default: return '通常'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">開発者向けチェックリスト</h2>
          <p className="text-sm text-gray-600 mt-1">アプリストア登録前の必須準備項目</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
            <div className="text-xs text-gray-500">{completedItems}/{totalItems} 完了</div>
          </div>
          <div className="w-16 h-16">
            <svg className="transform -rotate-90 w-16 h-16">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#e5e7eb"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#2563eb"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - completionPercentage / 100)}`}
                className="transition-all duration-300"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* コントロール */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 mb-6">
        <div className="flex items-center space-x-4">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">すべての優先度</option>
            <option value="high">高優先度のみ</option>
            <option value="medium">中優先度のみ</option>
            <option value="low">低優先度のみ</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={resetProgress}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>リセット</span>
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>エクスポート</span>
          </button>
        </div>
      </div>

      {/* 進捗バー */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* チェックリスト */}
      <div className="space-y-4">
        {filteredChecklist.map((category) => (
          <div key={category.id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{category.icon}</span>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {category.items.filter(item => item.completed).length}/{category.items.length}
                </span>
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {expandedCategories.has(category.id) && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="space-y-3">
                  {category.items.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => toggleItem(category.id, item.id)}
                          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                            item.completed
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {item.completed && <Check className="w-4 h-4" />}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className={`font-semibold ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {item.title}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(item.priority)}`}>
                              {getPriorityLabel(item.priority)}
                            </span>
                          </div>
                          
                          <p className={`text-sm mb-3 ${item.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.description}
                          </p>

                          {item.tips && (
                            <div className="mb-3">
                              <div className="flex items-center space-x-1 mb-2">
                                <Info className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-medium text-blue-700">ヒント</span>
                              </div>
                              <ul className="text-xs text-gray-600 space-y-1 ml-5">
                                {item.tips.map((tip, index) => (
                                  <li key={index} className="list-disc">{tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {item.links && (
                            <div className="flex flex-wrap gap-2">
                              {item.links.map((link, index) => (
                                <a
                                  key={index}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>{link.title}</span>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* フッター */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span>進捗はブラウザに自動保存されます</span>
          </div>
          <div className="text-sm text-gray-500">
            最終更新: {new Date().toLocaleDateString('ja-JP')}
          </div>
        </div>
      </div>
    </div>
  )
}