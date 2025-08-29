'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, Target, Users, Smartphone, DollarSign, Globe, Zap, CheckCircle } from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  description: string
  type: 'single' | 'multiple'
  options: QuizOption[]
}

interface QuizOption {
  id: string
  text: string
  icon: string
  description: string
  scores: Record<string, number> // app store slug -> score
}

interface QuizResult {
  storeSlug: string
  storeName: string
  score: number
  logo: string
  reasons: string[]
  pros: string[]
  cons: string[]
  suitability: number // 0-100
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'app-type',
    question: 'どのようなアプリを開発していますか？',
    description: 'アプリの種類によって最適なストアが変わります',
    type: 'single',
    options: [
      {
        id: 'game',
        text: 'ゲーム',
        icon: '🎮',
        description: '娯楽性重視のゲームアプリ',
        scores: {
          'app-store': 9,
          'google-play': 8,
          'epic-games-store': 10,
          'amazon-appstore': 7,
          'samsung-galaxy-store': 6,
          'microsoft-store': 5
        }
      },
      {
        id: 'business',
        text: 'ビジネス・生産性',
        icon: '💼',
        description: '業務効率化やビジネスツール',
        scores: {
          'app-store': 8,
          'google-play': 9,
          'epic-games-store': 3,
          'amazon-appstore': 8,
          'samsung-galaxy-store': 7,
          'microsoft-store': 10
        }
      },
      {
        id: 'social',
        text: 'SNS・コミュニケーション',
        icon: '💬',
        description: 'ソーシャルネットワーキングアプリ',
        scores: {
          'app-store': 9,
          'google-play': 9,
          'epic-games-store': 4,
          'amazon-appstore': 6,
          'samsung-galaxy-store': 7,
          'microsoft-store': 6
        }
      },
      {
        id: 'ecommerce',
        text: 'EC・ショッピング',
        icon: '🛒',
        description: 'オンラインショッピング関連',
        scores: {
          'app-store': 8,
          'google-play': 8,
          'epic-games-store': 2,
          'amazon-appstore': 10,
          'samsung-galaxy-store': 6,
          'microsoft-store': 7
        }
      },
      {
        id: 'utility',
        text: 'ユーティリティ・ツール',
        icon: '🔧',
        description: '実用的なツールアプリ',
        scores: {
          'app-store': 7,
          'google-play': 9,
          'epic-games-store': 3,
          'amazon-appstore': 7,
          'samsung-galaxy-store': 8,
          'microsoft-store': 8
        }
      }
    ]
  },
  {
    id: 'target-audience',
    question: '主なターゲットユーザーは？',
    description: 'ユーザー層によって効果的なストアが異なります',
    type: 'single',
    options: [
      {
        id: 'teens',
        text: '10代・学生',
        icon: '🎓',
        description: 'Z世代がメインターゲット',
        scores: {
          'app-store': 9,
          'google-play': 8,
          'epic-games-store': 8,
          'amazon-appstore': 5,
          'samsung-galaxy-store': 7,
          'microsoft-store': 4
        }
      },
      {
        id: 'young-adults',
        text: '20-30代社会人',
        icon: '👔',
        description: 'ミレニアル世代中心',
        scores: {
          'app-store': 8,
          'google-play': 9,
          'epic-games-store': 7,
          'amazon-appstore': 8,
          'samsung-galaxy-store': 7,
          'microsoft-store': 8
        }
      },
      {
        id: 'middle-aged',
        text: '40-50代',
        icon: '👨‍💼',
        description: 'ビジネス層・ファミリー層',
        scores: {
          'app-store': 7,
          'google-play': 8,
          'epic-games-store': 5,
          'amazon-appstore': 9,
          'samsung-galaxy-store': 8,
          'microsoft-store': 9
        }
      },
      {
        id: 'seniors',
        text: '60代以上',
        icon: '👴',
        description: 'シニア世代向け',
        scores: {
          'app-store': 6,
          'google-play': 7,
          'epic-games-store': 3,
          'amazon-appstore': 8,
          'samsung-galaxy-store': 7,
          'microsoft-store': 8
        }
      }
    ]
  },
  {
    id: 'business-size',
    question: '開発チームの規模は？',
    description: '事業規模により手数料優遇や支援内容が変わります',
    type: 'single',
    options: [
      {
        id: 'individual',
        text: '個人開発者',
        icon: '👤',
        description: '一人または小規模チーム',
        scores: {
          'app-store': 7,
          'google-play': 8,
          'epic-games-store': 9,
          'amazon-appstore': 7,
          'samsung-galaxy-store': 8,
          'microsoft-store': 8
        }
      },
      {
        id: 'startup',
        text: 'スタートアップ',
        icon: '🚀',
        description: '5-20人程度のベンチャー',
        scores: {
          'app-store': 8,
          'google-play': 8,
          'epic-games-store': 10,
          'amazon-appstore': 8,
          'samsung-galaxy-store': 7,
          'microsoft-store': 9
        }
      },
      {
        id: 'sme',
        text: '中小企業',
        icon: '🏢',
        description: '50人未満の企業',
        scores: {
          'app-store': 8,
          'google-play': 9,
          'epic-games-store': 8,
          'amazon-appstore': 9,
          'samsung-galaxy-store': 8,
          'microsoft-store': 9
        }
      },
      {
        id: 'enterprise',
        text: '大企業',
        icon: '🏬',
        description: '100人以上の大規模組織',
        scores: {
          'app-store': 9,
          'google-play': 9,
          'epic-games-store': 6,
          'amazon-appstore': 8,
          'samsung-galaxy-store': 7,
          'microsoft-store': 10
        }
      }
    ]
  },
  {
    id: 'revenue-model',
    question: '収益化の方法は？',
    description: '手数料体系や決済方法に影響します',
    type: 'multiple',
    options: [
      {
        id: 'free',
        text: '完全無料',
        icon: '🆓',
        description: '広告収益のみ',
        scores: {
          'app-store': 6,
          'google-play': 8,
          'epic-games-store': 8,
          'amazon-appstore': 7,
          'samsung-galaxy-store': 7,
          'microsoft-store': 7
        }
      },
      {
        id: 'paid',
        text: '有料アプリ',
        icon: '💰',
        description: '一括購入型',
        scores: {
          'app-store': 8,
          'google-play': 7,
          'epic-games-store': 10,
          'amazon-appstore': 7,
          'samsung-galaxy-store': 6,
          'microsoft-store': 8
        }
      },
      {
        id: 'freemium',
        text: 'フリーミアム',
        icon: '⭐',
        description: 'アプリ内課金あり',
        scores: {
          'app-store': 9,
          'google-play': 9,
          'epic-games-store': 9,
          'amazon-appstore': 8,
          'samsung-galaxy-store': 7,
          'microsoft-store': 7
        }
      },
      {
        id: 'subscription',
        text: 'サブスクリプション',
        icon: '🔄',
        description: '月額・年額課金',
        scores: {
          'app-store': 10,
          'google-play': 8,
          'epic-games-store': 7,
          'amazon-appstore': 9,
          'samsung-galaxy-store': 6,
          'microsoft-store': 9
        }
      }
    ]
  },
  {
    id: 'priority',
    question: '最も重視する要素は？',
    description: 'あなたにとって最も大切な要素を選んでください',
    type: 'single',
    options: [
      {
        id: 'low-commission',
        text: '低い手数料率',
        icon: '💸',
        description: 'コストを最小限に抑えたい',
        scores: {
          'app-store': 6,
          'google-play': 7,
          'epic-games-store': 10,
          'amazon-appstore': 6,
          'samsung-galaxy-store': 5,
          'microsoft-store': 8
        }
      },
      {
        id: 'user-base',
        text: '多くのユーザー',
        icon: '👥',
        description: 'リーチできるユーザー数重視',
        scores: {
          'app-store': 9,
          'google-play': 10,
          'epic-games-store': 5,
          'amazon-appstore': 7,
          'samsung-galaxy-store': 6,
          'microsoft-store': 6
        }
      },
      {
        id: 'quality',
        text: '高品質なユーザー',
        icon: '⭐',
        description: '購買意欲の高いユーザー',
        scores: {
          'app-store': 10,
          'google-play': 7,
          'epic-games-store': 6,
          'amazon-appstore': 8,
          'samsung-galaxy-store': 7,
          'microsoft-store': 8
        }
      },
      {
        id: 'features',
        text: '豊富な機能・サポート',
        icon: '🛠️',
        description: '開発支援ツールや分析機能',
        scores: {
          'app-store': 9,
          'google-play': 9,
          'epic-games-store': 8,
          'amazon-appstore': 7,
          'samsung-galaxy-store': 6,
          'microsoft-store': 9
        }
      }
    ]
  }
]

const appStoreData = {
  'app-store': {
    name: 'App Store',
    logo: '🔵',
    reasons: ['高品質なユーザー層', 'プレミアム志向', '強力な分析ツール'],
    pros: ['収益性が高い', '厳格な品質管理', 'プライバシー重視'],
    cons: ['審査が厳しい', '手数料30%', '開発者向け年会費$99']
  },
  'google-play': {
    name: 'Google Play Store',
    logo: '🟢',
    reasons: ['世界最大のユーザー基盤', '多様なデバイス対応', 'オープンな環境'],
    pros: ['グローバルリーチ', '柔軟な配信方法', '豊富な開発ツール'],
    cons: ['競合が多い', '審査基準の変動', 'セキュリティリスク']
  },
  'epic-games-store': {
    name: 'Epic Games Store',
    logo: '⚫',
    reasons: ['業界最低の手数料12%', 'クリエイター支援', 'Unreal Engine連携'],
    pros: ['低コスト運営', 'ゲーム特化', '開発者支援充実'],
    cons: ['限定的なユーザー基盤', '主にPC向け', '日本展開未定']
  },
  'amazon-appstore': {
    name: 'Amazon Appstore',
    logo: '🟠',
    reasons: ['Amazonエコシステム', 'プライム会員へのリーチ', 'Fire端末対応'],
    pros: ['購買力の高いユーザー', 'クロスプラットフォーム', 'Amazonサービス連携'],
    cons: ['限定的なリーチ', '2025年12月まで利用不可', 'Apple/Google比で少ないユーザー']
  },
  'samsung-galaxy-store': {
    name: 'Samsung Galaxy Store',
    logo: '🔷',
    reasons: ['Galaxy端末特化', 'ハードウェア連携', 'アジア市場強み'],
    pros: ['デバイス最適化', 'Samsung Pay連携', '限定機能アクセス'],
    cons: ['Galaxy限定', '2025年12月まで利用不可', '限定的なグローバル展開']
  },
  'microsoft-store': {
    name: 'Microsoft Store',
    logo: '🟦',
    reasons: ['エンタープライズ向け', 'Windows連携', 'Xbox統合'],
    pros: ['ビジネス利用に最適', 'Microsoft 365連携', 'セキュリティ重視'],
    cons: ['モバイル展開未定', '一般消費者リーチが限定的', '競合が少ない分野のみ']
  }
}

export default function AppStoreQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [showResults, setShowResults] = useState(false)
  const [isStarted, setIsStarted] = useState(false)

  const handleStart = () => {
    setIsStarted(true)
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
  }

  const handleAnswer = (questionId: string, optionId: string, isMultiple: boolean) => {
    if (isMultiple) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: prev[questionId] 
          ? (prev[questionId].includes(optionId) 
              ? prev[questionId].filter(id => id !== optionId)
              : [...prev[questionId], optionId])
          : [optionId]
      }))
    } else {
      setAnswers(prev => ({
        ...prev,
        [questionId]: [optionId]
      }))
    }
  }

  const calculateResults = (): QuizResult[] => {
    const storeScores: Record<string, number> = {}
    
    // 各質問の回答から点数を計算
    Object.entries(answers).forEach(([questionId, optionIds]) => {
      const question = quizQuestions.find(q => q.id === questionId)
      if (!question) return

      optionIds.forEach(optionId => {
        const option = question.options.find(o => o.id === optionId)
        if (!option) return

        Object.entries(option.scores).forEach(([storeSlug, score]) => {
          storeScores[storeSlug] = (storeScores[storeSlug] || 0) + score
        })
      })
    })

    // 最高スコアを100%として正規化
    const maxScore = Math.max(...Object.values(storeScores))
    
    return Object.entries(storeScores)
      .map(([storeSlug, score]) => ({
        storeSlug,
        storeName: appStoreData[storeSlug as keyof typeof appStoreData]?.name || storeSlug,
        score,
        logo: appStoreData[storeSlug as keyof typeof appStoreData]?.logo || '📱',
        reasons: appStoreData[storeSlug as keyof typeof appStoreData]?.reasons || [],
        pros: appStoreData[storeSlug as keyof typeof appStoreData]?.pros || [],
        cons: appStoreData[storeSlug as keyof typeof appStoreData]?.cons || [],
        suitability: Math.round((score / maxScore) * 100)
      }))
      .sort((a, b) => b.score - a.score)
  }

  const currentQuestionData = quizQuestions[currentQuestion]
  const isLastQuestion = currentQuestion === quizQuestions.length - 1
  const canProceed = answers[currentQuestionData?.id]?.length > 0

  const nextQuestion = () => {
    if (isLastQuestion) {
      setShowResults(true)
    } else {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    setCurrentQuestion(prev => Math.max(0, prev - 1))
  }

  const resetQuiz = () => {
    setIsStarted(false)
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
  }

  // 開始画面
  if (!isStarted) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-sm border border-blue-200 p-8">
        <div className="text-center">
          <div className="mb-6">
            <Target className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              あなたに最適なアプリストアは？
            </h2>
            <p className="text-gray-600 mb-6">
              5つの質問に答えて、あなたのアプリに最適なアプリストアを見つけましょう
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8 text-sm">
            <div className="flex items-center space-x-2 text-gray-700">
              <Smartphone className="w-5 h-5 text-blue-500" />
              <span>アプリの種類を分析</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Users className="w-5 h-5 text-green-500" />
              <span>ターゲット層を特定</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <DollarSign className="w-5 h-5 text-yellow-500" />
              <span>収益モデルを考慮</span>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            診断を始める
          </button>

          <p className="text-xs text-gray-500 mt-4">
            所要時間: 約2-3分 | 結果はブラウザに保存されません
          </p>
        </div>
      </div>
    )
  }

  // 結果画面
  if (showResults) {
    const results = calculateResults()
    const topResult = results[0]

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">診断結果</h2>
          <p className="text-gray-600">あなたのアプリに最適なアプリストアが見つかりました！</p>
        </div>

        {/* トップ推奨 */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">{topResult.logo}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{topResult.storeName}</h3>
                <p className="text-green-600 font-semibold">最適度: {topResult.suitability}%</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 mb-1">🏆</div>
              <div className="text-sm text-gray-600">最適</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">推奨理由</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {topResult.reasons.map((reason, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">メリット</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {topResult.pros.slice(0, 3).map((pro, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-blue-500">+</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {topResult.cons.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <h4 className="font-semibold text-yellow-800 mb-2">注意点</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {topResult.cons.slice(0, 2).map((con, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* その他の選択肢 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">その他の選択肢</h3>
          <div className="space-y-3">
            {results.slice(1, 4).map((result, index) => (
              <div key={result.storeSlug} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{result.logo}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{result.storeName}</h4>
                    <p className="text-sm text-gray-600">最適度: {result.suitability}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${result.suitability}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">#{index + 2}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetQuiz}
            className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>もう一度診断する</span>
          </button>
          <a
            href="/app-store-comparison"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>詳細比較を見る</span>
          </a>
        </div>
      </div>
    )
  }

  // 質問画面
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* プログレスバー */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            質問 {currentQuestion + 1} / {quizQuestions.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}% 完了
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 質問 */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {currentQuestionData.question}
        </h3>
        <p className="text-gray-600 mb-6">{currentQuestionData.description}</p>

        <div className="space-y-3">
          {currentQuestionData.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(currentQuestionData.id, option.id, currentQuestionData.type === 'multiple')}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                answers[currentQuestionData.id]?.includes(option.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{option.text}</h4>
                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                </div>
                {answers[currentQuestionData.id]?.includes(option.id) && (
                  <div className="ml-auto">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {currentQuestionData.type === 'multiple' && (
          <p className="text-sm text-gray-500 mt-3">
            💡 複数選択可能です
          </p>
        )}
      </div>

      {/* ナビゲーション */}
      <div className="flex justify-between">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            currentQuestion === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>前の質問</span>
        </button>

        <button
          onClick={nextQuestion}
          disabled={!canProceed}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
            canProceed
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>{isLastQuestion ? '結果を見る' : '次の質問'}</span>
          {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
          {isLastQuestion && <Zap className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}