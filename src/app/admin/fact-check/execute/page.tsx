'use client'

import { useState, useEffect } from 'react'
import { Check, X, AlertCircle, ExternalLink, Calendar, Clock, Save, FileText, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react'
import { 
  createFactCheckSessionClient, 
  updateFactCheckSessionClient, 
  completeFactCheckSessionClient,
  recordFactCheckHistoryClient
} from '@/lib/fact-check-client'

interface ChecklistItem {
  id: string
  claim: string
  currentValue: string
  sourceUrl: string
  source: string
  component: string
  priority: 'critical' | 'high'
  status: 'pending' | 'checking' | 'verified' | 'updated' | 'failed'
  newValue?: string
  notes?: string
  checkedAt?: string
}

// Critical項目（毎月確認）
const criticalItems: ChecklistItem[] = [
  {
    id: 'smartphone-law-enforcement',
    claim: 'スマホ新法施行予定',
    currentValue: '2025年12月まで',
    sourceUrl: 'https://www.meti.go.jp/',
    source: '経済産業省',
    component: 'FAQ/CaseStudy',
    priority: 'critical',
    status: 'pending'
  },
  {
    id: 'japan-market-size',
    claim: '日本アプリ市場規模',
    currentValue: '¥12.8兆',
    sourceUrl: 'https://mmdlabo.jp/',
    source: 'MMD研究所',
    component: 'IndustryStatsSummary',
    priority: 'critical',
    status: 'pending'
  }
]

// 今月確認が必要なHigh Priority項目
const highPriorityDueItems: ChecklistItem[] = [
  {
    id: 'ios-market-share-japan',
    claim: 'iOS市場シェア（日本）',
    currentValue: '68.2%',
    sourceUrl: 'https://gs.statcounter.com/',
    source: 'StatCounter',
    component: 'IndustryStatsSummary',
    priority: 'high',
    status: 'pending'
  },
  {
    id: 'global-downloads-2024',
    claim: 'グローバルダウンロード数',
    currentValue: '2,550億',
    sourceUrl: 'https://www.data.ai/',
    source: 'App Annie',
    component: 'IndustryStatsSummary',
    priority: 'high',
    status: 'pending'
  }
]

export default function FactCheckExecutePage() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([...criticalItems, ...highPriorityDueItems])
  const [currentDate] = useState(new Date().toLocaleDateString('ja-JP'))
  const [executionNotes, setExecutionNotes] = useState('')
  const [showSummary, setShowSummary] = useState(false)
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // セッション初期化
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // 新しいファクトチェックセッションを作成
        const session = await createFactCheckSessionClient(checklist.length)
        setCurrentSession(session)
        
      } catch (error) {
        console.error('Error initializing session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeSession()
  }, [])

  const updateItemStatus = async (id: string, status: ChecklistItem['status'], newValue?: string, notes?: string) => {
    if (!currentSession) {
      console.error('Session not available')
      return
    }

    try {
      // データベースに記録
      const item = checklist.find(item => item.id === id)
      if (item) {
        await recordFactCheckHistoryClient(
          currentSession.id,
          id,
          status,
          item.currentValue,
          newValue || item.currentValue,
          notes,
          status === 'verified' ? 'high' : status === 'updated' ? 'medium' : 'low'
        )
      }

      // ローカル状態更新
      setChecklist(prev => prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              status, 
              newValue, 
              notes,
              checkedAt: status === 'verified' || status === 'updated' ? new Date().toISOString() : item.checkedAt
            }
          : item
      ))

    } catch (error) {
      console.error('Error updating item status:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'updated': return <RefreshCw className="w-5 h-5 text-blue-600" />
      case 'checking': return <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />
      case 'failed': return <X className="w-5 h-5 text-red-600" />
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified': return '確認済み（変更なし）'
      case 'updated': return '更新済み'
      case 'checking': return '確認中...'
      case 'failed': return '確認失敗'
      default: return '未確認'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50'
      case 'updated': return 'text-blue-600 bg-blue-50'
      case 'checking': return 'text-yellow-600 bg-yellow-50'
      case 'failed': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const completedCount = checklist.filter(item => 
    item.status === 'verified' || item.status === 'updated'
  ).length

  const updatedCount = checklist.filter(item => item.status === 'updated').length
  const failedCount = checklist.filter(item => item.status === 'failed').length

  const progress = (completedCount / checklist.length) * 100

  const generateReport = async () => {
    if (!currentSession) {
      console.error('No active session')
      return
    }

    try {
      // セッション完了処理
      await updateFactCheckSessionClient(currentSession.id, {
        execution_notes: executionNotes,
        status: 'completed' as const
      })

      await completeFactCheckSessionClient(currentSession.id)

      const report = {
        sessionId: currentSession.id,
        date: currentDate,
        totalItems: checklist.length,
        completed: completedCount,
        updated: updatedCount,
        failed: failedCount,
        items: checklist.map(item => ({
          id: item.id,
          claim: item.claim,
          oldValue: item.currentValue,
          newValue: item.newValue || item.currentValue,
          status: item.status,
          notes: item.notes,
          checkedAt: item.checkedAt
        })),
        executionNotes
      }
      
      console.log('ファクトチェックレポート:', report)
      setShowSummary(true)

    } catch (error) {
      console.error('Error generating report:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">セッションを初期化中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
              <span>月次ファクトチェック実行</span>
            </h1>
            <p className="text-gray-600 mt-2">
              {currentDate} - Critical及び期限の来た項目を確認
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{Math.round(progress)}%</div>
            <div className="text-sm text-gray-600">完了</div>
          </div>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>{completedCount}/{checklist.length} 項目完了</span>
          {updatedCount > 0 && <span className="text-blue-600">{updatedCount}件更新</span>}
          {failedCount > 0 && <span className="text-red-600">{failedCount}件失敗</span>}
        </div>
      </div>

      {/* チェックリスト */}
      <div className="space-y-4 mb-8">
        {checklist.map((item, index) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="text-gray-400 font-bold text-lg mt-1">
                  {index + 1}.
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(item.status)}
                    <h3 className="text-lg font-semibold text-gray-900">{item.claim}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.priority === 'critical' 
                        ? 'bg-red-100 text-red-700 border border-red-200' 
                        : 'bg-orange-100 text-orange-700 border border-orange-200'
                    }`}>
                      {item.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid gap-3 md:grid-cols-2 text-sm mb-4">
                    <div>
                      <span className="text-gray-600">現在の値: </span>
                      <span className="font-semibold">{item.currentValue}</span>
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
                      <span className="text-gray-600">コンポーネント: </span>
                      <span className="font-semibold">{item.component}</span>
                    </div>
                    {item.checkedAt && (
                      <div>
                        <span className="text-gray-600">確認時刻: </span>
                        <span className="font-semibold">
                          {new Date(item.checkedAt).toLocaleTimeString('ja-JP')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 確認フォーム */}
                  {item.status === 'pending' || item.status === 'checking' ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            新しい値（変更がある場合）
                          </label>
                          <input
                            type="text"
                            placeholder={item.currentValue}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onChange={(e) => {
                              // 一時的に値を保存（実際の更新は確認ボタンで）
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            備考・メモ
                          </label>
                          <input
                            type="text"
                            placeholder="確認時の注記"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={() => updateItemStatus(item.id, 'checking')}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          確認開始
                        </button>
                        <button
                          onClick={() => updateItemStatus(item.id, 'verified')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          変更なし
                        </button>
                        <button
                          onClick={() => {
                            const input = document.querySelector(`#new-value-${item.id}`) as HTMLInputElement
                            const notes = document.querySelector(`#notes-${item.id}`) as HTMLInputElement
                            updateItemStatus(item.id, 'updated', input?.value || item.currentValue, notes?.value)
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          更新あり
                        </button>
                        <button
                          onClick={() => updateItemStatus(item.id, 'failed', undefined, 'ソースにアクセスできない')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          確認失敗
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`rounded-lg p-4 ${getStatusColor(item.status)}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium mb-1">{getStatusText(item.status)}</div>
                          {item.newValue && item.newValue !== item.currentValue && (
                            <div className="text-sm">
                              <span className="text-gray-600">新しい値: </span>
                              <span className="font-semibold">{item.newValue}</span>
                            </div>
                          )}
                          {item.notes && (
                            <div className="text-sm mt-1">
                              <span className="text-gray-600">備考: </span>
                              <span>{item.notes}</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => updateItemStatus(item.id, 'pending')}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          再確認
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 実行メモ */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>実行メモ</span>
        </h3>
        <textarea
          value={executionNotes}
          onChange={(e) => setExecutionNotes(e.target.value)}
          placeholder="全体的な所見、特記事項、次回への申し送り事項など"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
        />
      </div>

      {/* アクションボタン */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>次回確認予定: {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('ja-JP')}</span>
          </span>
        </div>
        
        <div className="flex space-x-4">
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            下書き保存
          </button>
          <button 
            onClick={generateReport}
            disabled={completedCount !== checklist.length}
            className={`px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 ${
              completedCount === checklist.length
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-5 h-5" />
            <span>確認完了・レポート生成</span>
          </button>
        </div>
      </div>

      {/* サマリーモーダル */}
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">月次ファクトチェック完了</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">確認日</span>
                <span className="font-semibold">{currentDate}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{completedCount}</div>
                  <div className="text-sm text-green-600">確認完了</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{updatedCount}</div>
                  <div className="text-sm text-blue-600">更新</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">{failedCount}</div>
                  <div className="text-sm text-red-600">失敗</div>
                </div>
              </div>

              {updatedCount > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">更新が必要な項目</h4>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    {checklist.filter(item => item.status === 'updated').map(item => (
                      <li key={item.id}>
                        • {item.claim}: {item.currentValue} → {item.newValue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {executionNotes && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">実行メモ</h4>
                  <p className="text-sm text-gray-600">{executionNotes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowSummary(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                閉じる
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                レポートをダウンロード
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}