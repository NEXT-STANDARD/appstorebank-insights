'use client'

import { useState } from 'react'
import { ChevronRight, RotateCcw, Target, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react'

interface FlowStep {
  id: string
  question: string
  description: string
  icon: string
  options: FlowOption[]
}

interface FlowOption {
  id: string
  text: string
  icon: string
  nextStep?: string
  result?: FlowResult
}

interface FlowResult {
  storeSlug: string
  storeName: string
  logo: string
  confidence: number
  reasons: string[]
  alternatives: string[]
}

const flowSteps: Record<string, FlowStep> = {
  start: {
    id: 'start',
    question: 'どのタイプのアプリを開発していますか？',
    description: 'アプリの種類によって最適なストアが決まります',
    icon: '📱',
    options: [
      { id: 'game', text: 'ゲーム・エンターテイメント', icon: '🎮', nextStep: 'game-type' },
      { id: 'business', text: 'ビジネス・生産性', icon: '💼', nextStep: 'business-type' },
      { id: 'social', text: 'SNS・コミュニケーション', icon: '💬', nextStep: 'social-type' },
      { id: 'utility', text: 'ツール・ユーティリティ', icon: '🔧', nextStep: 'utility-type' }
    ]
  },
  'game-type': {
    id: 'game-type',
    question: '最も重視する要素は？',
    description: 'ゲームアプリの成功要因を選んでください',
    icon: '🎯',
    options: [
      { 
        id: 'low-fee', 
        text: '低い手数料率', 
        icon: '💰',
        result: {
          storeSlug: 'epic-games-store',
          storeName: 'Epic Games Store',
          logo: '⚫',
          confidence: 95,
          reasons: ['業界最低12%の手数料', 'ゲーム特化プラットフォーム', 'Unreal Engine連携'],
          alternatives: ['Steam (PC)', 'App Store', 'Google Play']
        }
      },
      { 
        id: 'user-base', 
        text: '多くのユーザー', 
        icon: '👥',
        result: {
          storeSlug: 'google-play',
          storeName: 'Google Play Store',
          logo: '🟢',
          confidence: 92,
          reasons: ['世界最大のユーザー基盤', '多様なデバイス対応', 'グローバルリーチ'],
          alternatives: ['App Store', 'Samsung Galaxy Store']
        }
      },
      { 
        id: 'quality', 
        text: '高品質なユーザー', 
        icon: '⭐',
        result: {
          storeSlug: 'app-store',
          storeName: 'App Store',
          logo: '🔵',
          confidence: 98,
          reasons: ['収益性の高いユーザー層', '厳格な品質管理', 'プレミアム市場'],
          alternatives: ['Google Play', 'Amazon Appstore']
        }
      }
    ]
  },
  'business-type': {
    id: 'business-type',
    question: 'ターゲット企業の規模は？',
    description: 'エンタープライズ向けかSME向けかで最適解が変わります',
    icon: '🏢',
    options: [
      { 
        id: 'enterprise', 
        text: '大企業・エンタープライズ', 
        icon: '🏬',
        result: {
          storeSlug: 'microsoft-store',
          storeName: 'Microsoft Store',
          logo: '🟦',
          confidence: 90,
          reasons: ['エンタープライズ特化', 'Microsoft 365連携', '強力なセキュリティ'],
          alternatives: ['App Store (Business)', 'Google Workspace']
        }
      },
      { 
        id: 'sme', 
        text: '中小企業・個人事業主', 
        icon: '🏪',
        result: {
          storeSlug: 'google-play',
          storeName: 'Google Play Store',
          logo: '🟢',
          confidence: 88,
          reasons: ['中小企業への浸透率', 'Google Workspace連携', 'コスト効率'],
          alternatives: ['App Store', 'Microsoft Store']
        }
      },
      { 
        id: 'startup', 
        text: 'スタートアップ・新規事業', 
        icon: '🚀',
        result: {
          storeSlug: 'app-store',
          storeName: 'App Store',
          logo: '🔵',
          confidence: 85,
          reasons: ['早期収益化の可能性', '投資家への訴求力', 'ブランド価値向上'],
          alternatives: ['Google Play', 'Epic Games Store']
        }
      }
    ]
  },
  'social-type': {
    id: 'social-type',
    question: '主な収益モデルは？',
    description: 'SNSアプリの収益化方法によって最適なストアが変わります',
    icon: '💎',
    options: [
      { 
        id: 'subscription', 
        text: 'サブスクリプション', 
        icon: '🔄',
        result: {
          storeSlug: 'app-store',
          storeName: 'App Store',
          logo: '🔵',
          confidence: 94,
          reasons: ['サブスク決済の最適化', '高いコンバージョン率', '継続課金に強い'],
          alternatives: ['Google Play', 'Amazon Appstore']
        }
      },
      { 
        id: 'freemium', 
        text: 'フリーミアム・課金', 
        icon: '💳',
        result: {
          storeSlug: 'google-play',
          storeName: 'Google Play Store',
          logo: '🟢',
          confidence: 91,
          reasons: ['柔軟な課金システム', '多様な決済方法', 'グローバル展開'],
          alternatives: ['App Store', 'Samsung Galaxy Store']
        }
      },
      { 
        id: 'ad-revenue', 
        text: '広告収益メイン', 
        icon: '📢',
        result: {
          storeSlug: 'google-play',
          storeName: 'Google Play Store',
          logo: '🟢',
          confidence: 89,
          reasons: ['Google Ads連携', '広告最適化ツール', '大規模ユーザー基盤'],
          alternatives: ['App Store', 'Amazon Appstore']
        }
      }
    ]
  },
  'utility-type': {
    id: 'utility-type',
    question: 'どのプラットフォームを重視しますか？',
    description: 'ツールアプリはプラットフォーム連携が重要です',
    icon: '🔗',
    options: [
      { 
        id: 'cross-platform', 
        text: 'クロスプラットフォーム', 
        icon: '🌐',
        result: {
          storeSlug: 'google-play',
          storeName: 'Google Play Store',
          logo: '🟢',
          confidence: 87,
          reasons: ['多様なデバイス対応', 'PWA対応', 'オープンエコシステム'],
          alternatives: ['Microsoft Store', 'Samsung Galaxy Store']
        }
      },
      { 
        id: 'ios-focused', 
        text: 'iOS・Appleエコシステム', 
        icon: '🍎',
        result: {
          storeSlug: 'app-store',
          storeName: 'App Store',
          logo: '🔵',
          confidence: 96,
          reasons: ['Apple製品間連携', 'Shortcutsアプリ統合', 'プレミアムユーザー'],
          alternatives: ['Google Play', 'Microsoft Store']
        }
      },
      { 
        id: 'windows-focused', 
        text: 'Windows・デスクトップ連携', 
        icon: '🪟',
        result: {
          storeSlug: 'microsoft-store',
          storeName: 'Microsoft Store',
          logo: '🟦',
          confidence: 93,
          reasons: ['Windows統合', 'Office連携', 'デスクトップアプリ展開'],
          alternatives: ['Google Play', 'App Store']
        }
      }
    ]
  }
}

export default function AppStoreFlowchart() {
  const [currentStep, setCurrentStep] = useState<string>('start')
  const [path, setPath] = useState<string[]>(['start'])
  const [result, setResult] = useState<FlowResult | null>(null)

  const handleOptionClick = (option: FlowOption) => {
    if (option.result) {
      setResult(option.result)
    } else if (option.nextStep) {
      setCurrentStep(option.nextStep)
      setPath(prev => [...prev, option.nextStep!])
    }
  }

  const resetFlow = () => {
    setCurrentStep('start')
    setPath(['start'])
    setResult(null)
  }

  const goBack = () => {
    if (path.length > 1) {
      const newPath = path.slice(0, -1)
      setPath(newPath)
      setCurrentStep(newPath[newPath.length - 1])
      setResult(null)
    }
  }

  const currentStepData = flowSteps[currentStep]

  // 結果画面
  if (result) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-sm border border-green-200 p-8">
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">おすすめのアプリストア</h2>
          <p className="text-gray-600">あなたのアプリに最適なストアが見つかりました！</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{result.logo}</span>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{result.storeName}</h3>
                <p className="text-green-600 font-semibold">適合度: {result.confidence}%</p>
              </div>
            </div>
            <div className="text-green-500">
              <Target className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span>推奨理由</span>
              </h4>
              <div className="grid gap-3">
                {result.reasons.map((reason, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {result.alternatives.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">代替案</h4>
                <div className="flex flex-wrap gap-2">
                  {result.alternatives.map((alt, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetFlow}
            className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>もう一度診断</span>
          </button>
          <a
            href="/app-store-comparison"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>詳細比較を見る</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    )
  }

  // フローチャート画面
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <span className="text-2xl">🧭</span>
            <span>アプリストア選択ガイド</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            質問に答えて最適なアプリストアを見つけましょう
          </p>
        </div>
        {path.length > 1 && (
          <button
            onClick={goBack}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span>←</span>
            <span>戻る</span>
          </button>
        )}
      </div>

      {/* パンくずナビ */}
      <div className="flex items-center space-x-2 mb-8 text-sm text-gray-500">
        {path.map((stepId, index) => (
          <div key={stepId} className="flex items-center space-x-2">
            {index > 0 && <ChevronRight className="w-4 h-4" />}
            <span className={index === path.length - 1 ? 'text-blue-600 font-medium' : ''}>
              {stepId === 'start' ? 'スタート' : flowSteps[stepId]?.question.slice(0, 10) + '...'}
            </span>
          </div>
        ))}
      </div>

      {/* 現在の質問 */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-3xl">{currentStepData.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{currentStepData.question}</h3>
            <p className="text-gray-600">{currentStepData.description}</p>
          </div>
        </div>
      </div>

      {/* 選択肢 */}
      <div className="grid gap-4 md:grid-cols-2">
        {currentStepData.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option)}
            className="text-left p-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                {option.icon}
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-700">
                  {option.text}
                </h4>
                {option.result && (
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      推奨: {option.result.storeName}
                    </span>
                    <span className="text-xs text-green-600">
                      {option.result.confidence}%適合
                    </span>
                  </div>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </button>
        ))}
      </div>

      {/* フッター */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          💡 より詳しい診断をご希望の場合は、
          <button className="text-blue-600 hover:text-blue-700 font-medium ml-1">
            詳細診断ツール
          </button>
          をお試しください
        </p>
      </div>
    </div>
  )
}