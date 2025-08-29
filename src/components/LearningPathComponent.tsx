'use client'

import { useState } from 'react'
import { BookOpen, CheckCircle2, Lock, ArrowRight, Trophy, Clock, Star, Target } from 'lucide-react'

interface LearningModule {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  topics: string[]
  isCompleted: boolean
  isLocked: boolean
  completionRate: number
  icon: string
  category: string
}

interface LearningPath {
  id: string
  title: string
  description: string
  totalDuration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  completionRate: number
  modules: LearningModule[]
  prerequisites?: string[]
  learningGoals: string[]
  icon: string
  color: string
}

const learningPaths: LearningPath[] = [
  {
    id: 'basics',
    title: 'アプリストア自由化の基礎',
    description: '初心者向けの包括的な学習コース。法律から技術まで、基本的な概念をステップバイステップで学習できます。',
    totalDuration: '2時間30分',
    difficulty: 'beginner',
    completionRate: 75,
    icon: '📚',
    color: 'green',
    learningGoals: [
      'アプリストア自由化の基本概念を理解する',
      '日本のスマホ新法の内容を把握する',
      '開発者への影響を理解する',
      'セキュリティリスクと対策を学ぶ'
    ],
    modules: [
      {
        id: 'intro',
        title: 'アプリストア自由化とは？',
        description: 'アプリストア自由化の基本概念、背景、目的について学習します',
        duration: '20分',
        difficulty: 'beginner',
        topics: ['デジタル市場', '競争政策', '消費者選択'],
        isCompleted: true,
        isLocked: false,
        completionRate: 100,
        icon: '🎯',
        category: '基礎概念'
      },
      {
        id: 'japan-law',
        title: '日本のスマートフォン新法',
        description: '2024年成立のスマホ新法の詳細と施行スケジュールを解説',
        duration: '25分',
        difficulty: 'beginner',
        topics: ['法規制', '施行スケジュール', '対象企業'],
        isCompleted: true,
        isLocked: false,
        completionRate: 100,
        icon: '⚖️',
        category: '法規制'
      },
      {
        id: 'global-comparison',
        title: '国際的な動向比較',
        description: '欧州DMA、米国の動向と日本の取り組みを比較分析',
        duration: '30分',
        difficulty: 'beginner',
        topics: ['DMA', '国際比較', 'ゲートキーパー規制'],
        isCompleted: false,
        isLocked: false,
        completionRate: 60,
        icon: '🌍',
        category: '国際動向'
      },
      {
        id: 'security-basics',
        title: 'セキュリティの基本',
        description: 'サイドローディングのセキュリティリスクと基本的な対策',
        duration: '35分',
        difficulty: 'beginner',
        topics: ['セキュリティリスク', 'マルウェア対策', 'ベストプラクティス'],
        isCompleted: false,
        isLocked: false,
        completionRate: 0,
        icon: '🔒',
        category: 'セキュリティ'
      },
      {
        id: 'user-perspective',
        title: 'ユーザーへの影響',
        description: 'エンドユーザーにとってのメリット・デメリットを整理',
        duration: '20分',
        difficulty: 'beginner',
        topics: ['ユーザー体験', 'メリット', 'デメリット'],
        isCompleted: false,
        isLocked: true,
        completionRate: 0,
        icon: '👤',
        category: 'ユーザー視点'
      }
    ]
  },
  {
    id: 'developer',
    title: '開発者向け実践ガイド',
    description: 'アプリ開発者のための実践的な内容。技術的な準備から戦略まで、開発現場で必要な知識を習得できます。',
    totalDuration: '4時間15分',
    difficulty: 'intermediate',
    completionRate: 30,
    icon: '⚡',
    color: 'blue',
    prerequisites: ['アプリストア自由化の基礎'],
    learningGoals: [
      '複数ストア対応の技術的準備を理解する',
      '収益最適化戦略を策定できる',
      'セキュリティ実装のベストプラクティスを学ぶ',
      'マーケティング戦略を立案できる'
    ],
    modules: [
      {
        id: 'multi-store-tech',
        title: '複数ストア対応技術',
        description: '異なるアプリストアへの対応に必要な技術的な準備',
        duration: '45分',
        difficulty: 'intermediate',
        topics: ['パッケージ形式', 'コード署名', '配信システム'],
        isCompleted: true,
        isLocked: false,
        completionRate: 100,
        icon: '⚙️',
        category: '技術実装'
      },
      {
        id: 'revenue-optimization',
        title: '収益モデル最適化',
        description: '各ストアの手数料体系を理解し、最適な収益戦略を構築',
        duration: '50分',
        difficulty: 'intermediate',
        topics: ['手数料比較', '収益モデル', 'KPI設計'],
        isCompleted: false,
        isLocked: false,
        completionRate: 40,
        icon: '💰',
        category: 'ビジネス戦略'
      },
      {
        id: 'security-implementation',
        title: 'セキュリティ実装',
        description: 'サイドローディング環境でのセキュリティ強化実装',
        duration: '60分',
        difficulty: 'intermediate',
        topics: ['暗号化', '認証', '不正検知'],
        isCompleted: false,
        isLocked: false,
        completionRate: 0,
        icon: '🛡️',
        category: 'セキュリティ'
      },
      {
        id: 'aso-strategies',
        title: 'ASO戦略と実装',
        description: '各ストアでのApp Store最適化の具体的手法',
        duration: '40分',
        difficulty: 'intermediate',
        topics: ['キーワード最適化', 'メタデータ', '競合分析'],
        isCompleted: false,
        isLocked: true,
        completionRate: 0,
        icon: '📈',
        category: 'マーケティング'
      },
      {
        id: 'analytics-monitoring',
        title: '分析・監視システム',
        description: '複数ストアでの成果測定とモニタリング体制構築',
        duration: '40分',
        difficulty: 'intermediate',
        topics: ['アナリティクス', 'ダッシュボード', 'レポーティング'],
        isCompleted: false,
        isLocked: true,
        completionRate: 0,
        icon: '📊',
        category: '分析・監視'
      }
    ]
  },
  {
    id: 'enterprise',
    title: '企業・組織での活用戦略',
    description: '企業や組織でアプリストア自由化を活用するための戦略的な学習コース。管理職やIT責任者向けの内容です。',
    totalDuration: '3時間45分',
    difficulty: 'advanced',
    completionRate: 15,
    icon: '🏢',
    color: 'purple',
    prerequisites: ['アプリストア自由化の基礎', '開発者向け実践ガイド'],
    learningGoals: [
      '企業レベルでの戦略的活用方法を理解する',
      'リスク管理体制を構築できる',
      '社内ポリシーを策定できる',
      'ROI最大化の施策を立案できる'
    ],
    modules: [
      {
        id: 'enterprise-strategy',
        title: '企業戦略とアプリストア',
        description: '企業レベルでのアプリストア活用戦略の立案',
        duration: '50分',
        difficulty: 'advanced',
        topics: ['戦略立案', 'ステークホルダー', 'ROI計算'],
        isCompleted: true,
        isLocked: false,
        completionRate: 100,
        icon: '🎯',
        category: '戦略立案'
      },
      {
        id: 'risk-management',
        title: 'エンタープライズリスク管理',
        description: '企業環境でのリスク評価と管理体制構築',
        duration: '55分',
        difficulty: 'advanced',
        topics: ['リスク評価', 'ガバナンス', 'コンプライアンス'],
        isCompleted: false,
        isLocked: false,
        completionRate: 25,
        icon: '🛡️',
        category: 'リスク管理'
      },
      {
        id: 'policy-framework',
        title: '社内ポリシー策定',
        description: 'アプリストア利用に関する社内ポリシーの策定',
        duration: '45分',
        difficulty: 'advanced',
        topics: ['ポリシー策定', 'ガイドライン', '運用ルール'],
        isCompleted: false,
        isLocked: true,
        completionRate: 0,
        icon: '📋',
        category: 'ポリシー'
      },
      {
        id: 'change-management',
        title: '変革管理とトレーニング',
        description: '組織変革管理と従業員トレーニング計画',
        duration: '40分',
        difficulty: 'advanced',
        topics: ['変革管理', 'トレーニング', 'コミュニケーション'],
        isCompleted: false,
        isLocked: true,
        completionRate: 0,
        icon: '🔄',
        category: '変革管理'
      },
      {
        id: 'future-roadmap',
        title: '将来ロードマップ策定',
        description: '中長期的なロードマップと継続的改善計画',
        duration: '35分',
        difficulty: 'advanced',
        topics: ['ロードマップ', '継続改善', 'イノベーション'],
        isCompleted: false,
        isLocked: true,
        completionRate: 0,
        icon: '🚀',
        category: '将来計画'
      }
    ]
  }
]

export default function LearningPathComponent() {
  const [selectedPath, setSelectedPath] = useState<string>('basics')
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  const currentPath = learningPaths.find(path => path.id === selectedPath) || learningPaths[0]

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }

  const getColorClasses = (color: string) => {
    const colors = {
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' }
    }
    return colors[color as keyof typeof colors] || colors.green
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
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>学習パス</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">段階的に学習できる体系化されたコンテンツ</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Trophy className="w-4 h-4" />
          <span>進捗: {Math.round(currentPath.completionRate)}%</span>
        </div>
      </div>

      {/* 学習パス選択 */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {learningPaths.map((path) => {
          const colorClasses = getColorClasses(path.color)
          const isSelected = selectedPath === path.id
          
          return (
            <button
              key={path.id}
              onClick={() => setSelectedPath(path.id)}
              className={`text-left p-6 border-2 rounded-xl transition-all ${
                isSelected 
                  ? `${colorClasses.border} ${colorClasses.bg}` 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-4">
                <span className="text-3xl">{path.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-lg mb-2 ${isSelected ? colorClasses.text : 'text-gray-900'}`}>
                    {path.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {path.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded-full ${getDifficultyColor(path.difficulty)}`}>
                        {getDifficultyLabel(path.difficulty)}
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{path.totalDuration}</span>
                      </span>
                    </div>
                    <div className="text-xs font-medium text-gray-600">
                      {Math.round(path.completionRate)}%完了
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${colorClasses.text.replace('text-', 'bg-')}`}
                        style={{ width: `${path.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* 選択された学習パス詳細 */}
      <div className={`rounded-xl p-6 mb-8 ${getColorClasses(currentPath.color).bg} ${getColorClasses(currentPath.color).border} border`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentPath.title}</h3>
            <p className="text-gray-700 mb-4">{currentPath.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>総学習時間: {currentPath.totalDuration}</span>
              </span>
              <span className={`px-3 py-1 rounded-full ${getDifficultyColor(currentPath.difficulty)}`}>
                {getDifficultyLabel(currentPath.difficulty)}
              </span>
              {currentPath.prerequisites && (
                <span className="text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                  前提知識あり
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-2">{currentPath.icon}</div>
            <div className="text-sm text-gray-600">
              {Math.round(currentPath.completionRate)}%完了
            </div>
          </div>
        </div>

        {/* 学習目標 */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>学習目標</span>
          </h4>
          <div className="grid gap-2 md:grid-cols-2">
            {currentPath.learningGoals.map((goal, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                <span>{goal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 前提条件 */}
        {currentPath.prerequisites && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">前提条件</h4>
            <div className="flex flex-wrap gap-2">
              {currentPath.prerequisites.map((prerequisite, index) => (
                <span key={index} className="bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full">
                  {prerequisite}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* モジュール一覧 */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">学習モジュール</h4>
        {currentPath.modules.map((module, index) => (
          <div
            key={module.id}
            className={`border rounded-lg transition-all ${
              module.isLocked 
                ? 'border-gray-200 bg-gray-50' 
                : 'border-gray-200 hover:shadow-md'
            }`}
          >
            <button
              onClick={() => !module.isLocked && toggleModule(module.id)}
              disabled={module.isLocked}
              className="w-full p-6 text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white border border-gray-200">
                  {module.isLocked ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : module.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <span className="text-xl">{module.icon}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h5 className={`font-semibold ${module.isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                      {index + 1}. {module.title}
                    </h5>
                    {module.isCompleted && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        完了
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mb-3 ${module.isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                    {module.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {module.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full ${getDifficultyColor(module.difficulty)}`}>
                        {getDifficultyLabel(module.difficulty)}
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{module.duration}</span>
                      </span>
                    </div>
                    {!module.isLocked && (
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  
                  {module.completionRate > 0 && module.completionRate < 100 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>進捗</span>
                        <span>{module.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${module.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </button>

            {expandedModules.has(module.id) && !module.isLocked && (
              <div className="px-6 pb-6 border-t border-gray-200">
                <div className="pt-4">
                  <h6 className="font-medium text-gray-800 mb-3">学習内容</h6>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {module.topics.map((topic, topicIndex) => (
                      <span key={topicIndex} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <button 
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      disabled={module.isLocked}
                    >
                      {module.isCompleted ? '復習する' : module.completionRate > 0 ? '続きから学習' : '学習を開始'}
                    </button>
                    {module.isCompleted && (
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <Star className="w-4 h-4" />
                        <span>学習完了</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* フッター */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div className="text-sm text-gray-500">
          全{learningPaths.length}コース | 総学習時間: 約10時間30分
        </div>
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <button className="text-blue-600 hover:text-blue-700">
            学習履歴
          </button>
          <button className="text-blue-600 hover:text-blue-700">
            証明書発行
          </button>
        </div>
      </div>
    </div>
  )
}