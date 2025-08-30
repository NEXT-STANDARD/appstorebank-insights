'use client'

import { useState, useEffect } from 'react'
import { FileText, Download, Calendar, TrendingUp, CheckCircle, AlertCircle, RefreshCw, Search, Filter, Eye } from 'lucide-react'
import { getRecentSessionsClient, getFactCheckSummaryClient, getSessionReportClient, searchFactCheckHistoryClient } from '@/lib/fact-check-client'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface Session {
  id: string
  execution_date: string
  total_items: number
  completed_items: number
  updated_items: number
  failed_items: number
  execution_notes?: string
  status: string
  started_at: string
  completed_at?: string
}

export default function FactCheckReportsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [summary, setSummary] = useState<any[]>([])
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [sessionsData, summaryData] = await Promise.all([
        getRecentSessionsClient(20),
        getFactCheckSummaryClient()
      ])
      
      setSessions(sessionsData)
      setSummary(summaryData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      const results = await searchFactCheckHistoryClient(
        searchTerm || undefined,
        selectedStatus === 'all' ? undefined : selectedStatus,
        dateRange.from || undefined,
        dateRange.to || undefined,
        100
      )
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching:', error)
    }
  }

  const generatePDFReport = async (sessionId: string) => {
    try {
      const reportData = await getSessionReportClient(sessionId)
      const { session, history } = reportData

      const pdf = new jsPDF()
      
      // ヘッダー
      pdf.setFontSize(20)
      pdf.text('ファクトチェック実行レポート', 14, 20)
      
      pdf.setFontSize(12)
      pdf.text(`実行日: ${session.execution_date}`, 14, 35)
      pdf.text(`セッションID: ${session.id}`, 14, 45)
      pdf.text(`ステータス: ${session.status}`, 14, 55)
      
      // サマリー
      pdf.setFontSize(14)
      pdf.text('実行サマリー', 14, 70)
      
      const summaryData = [
        ['項目', '件数'],
        ['総項目数', session.total_items.toString()],
        ['完了項目数', session.completed_items.toString()],
        ['更新項目数', session.updated_items.toString()],
        ['失敗項目数', session.failed_items.toString()],
      ]
      
      ;(pdf as any).autoTable({
        startY: 75,
        head: [summaryData[0]],
        body: summaryData.slice(1),
        margin: { left: 14 },
        styles: { fontSize: 10 }
      })

      // 詳細履歴
      if (history.length > 0) {
        pdf.addPage()
        pdf.setFontSize(14)
        pdf.text('詳細履歴', 14, 20)
        
        const historyData = history.map((item: any) => [
          item.fact_check_items.claim,
          item.verification_status,
          item.previous_value || '',
          item.new_value || '',
          item.verification_notes || ''
        ])
        
        ;(pdf as any).autoTable({
          startY: 25,
          head: [['項目', 'ステータス', '旧値', '新値', '備考']],
          body: historyData,
          margin: { left: 14 },
          styles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 25 },
            2: { cellWidth: 30 },
            3: { cellWidth: 30 },
            4: { cellWidth: 50 }
          }
        })
      }

      // 実行メモ
      if (session.execution_notes) {
        pdf.addPage()
        pdf.setFontSize(14)
        pdf.text('実行メモ', 14, 20)
        
        pdf.setFontSize(10)
        const splitNotes = pdf.splitTextToSize(session.execution_notes, 180)
        pdf.text(splitNotes, 14, 30)
      }

      // ダウンロード
      pdf.save(`fact-check-report-${session.execution_date}.pdf`)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'updated': return <RefreshCw className="w-4 h-4 text-blue-600" />
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-600" />
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">レポートを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <FileText className="w-8 h-8 text-blue-600" />
          <span>ファクトチェックレポート</span>
        </h1>
        <p className="text-gray-600 mt-2">実行履歴とレポート生成</p>
      </div>

      {/* 統計サマリー */}
      {summary.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">月次統計</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">月</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">実行回数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">平均完了率</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新総数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">失敗総数</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {summary.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(item.month).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.total_sessions}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Math.round(item.avg_completion_rate)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.total_updates}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.total_failures}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* セッション履歴 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">実行セッション履歴</h2>
        <div className="bg-white rounded-lg border border-gray-200">
          {sessions.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {sessions.map((session) => (
                <div key={session.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {new Date(session.execution_date).toLocaleDateString('ja-JP')}
                        </h3>
                        <p className="text-sm text-gray-600">
                          開始: {new Date(session.started_at).toLocaleString('ja-JP')}
                          {session.completed_at && (
                            <span> | 完了: {new Date(session.completed_at).toLocaleString('ja-JP')}</span>
                          )}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedSession(selectedSession === session.id ? null : session.id)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" />
                        <span>詳細</span>
                      </button>
                      <button
                        onClick={() => generatePDFReport(session.id)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-gray-600 mb-1">総項目数</div>
                      <div className="font-semibold">{session.total_items}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-green-600 mb-1">完了</div>
                      <div className="font-semibold">{session.completed_items}</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-blue-600 mb-1">更新</div>
                      <div className="font-semibold">{session.updated_items}</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="text-red-600 mb-1">失敗</div>
                      <div className="font-semibold">{session.failed_items}</div>
                    </div>
                  </div>

                  {session.execution_notes && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>実行メモ:</strong> {session.execution_notes}
                      </p>
                    </div>
                  )}

                  {/* 詳細表示 */}
                  {selectedSession === session.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <SessionDetails sessionId={session.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">まだ実行セッションがありません</p>
            </div>
          )}
        </div>
      </div>

      {/* 検索・履歴 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">履歴検索</h2>
        
        {/* 検索フォーム */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">キーワード</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="項目名や備考を検索"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">すべて</option>
                <option value="verified">確認済み</option>
                <option value="updated">更新</option>
                <option value="failed">失敗</option>
                <option value="skipped">スキップ</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">開始日</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">終了日</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={handleSearch}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Search className="w-4 h-4" />
              <span>検索</span>
            </button>
          </div>
        </div>

        {/* 検索結果 */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="divide-y divide-gray-200">
              {searchResults.map((item, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getVerificationStatusIcon(item.verification_status)}
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.fact_check_items.claim}</h4>
                        <p className="text-sm text-gray-600">
                          {item.fact_check_items.component} - {item.fact_check_items.section}
                        </p>
                        {item.verification_notes && (
                          <p className="text-sm text-gray-700 mt-2">{item.verification_notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{new Date(item.checked_at).toLocaleDateString('ja-JP')}</div>
                      <div className="font-medium">{item.verification_status}</div>
                    </div>
                  </div>
                  
                  {(item.previous_value || item.new_value) && (
                    <div className="mt-3 pl-7 text-sm">
                      {item.previous_value && (
                        <div className="text-gray-600">旧値: {item.previous_value}</div>
                      )}
                      {item.new_value && (
                        <div className="text-gray-600">新値: {item.new_value}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// セッション詳細コンポーネント
function SessionDetails({ sessionId }: { sessionId: string }) {
  const [details, setDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const data = await getSessionReportClient(sessionId)
        setDetails(data)
      } catch (error) {
        console.error('Error loading session details:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDetails()
  }, [sessionId])

  if (loading) {
    return <div className="text-center py-4">読み込み中...</div>
  }

  if (!details) {
    return <div className="text-center py-4 text-red-600">詳細を読み込めませんでした</div>
  }

  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-4">確認項目詳細</h4>
      <div className="space-y-4">
        {details.history.map((item: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {item.verification_status === 'verified' && <CheckCircle className="w-4 h-4 text-green-600" />}
                {item.verification_status === 'updated' && <RefreshCw className="w-4 h-4 text-blue-600" />}
                {item.verification_status === 'failed' && <AlertCircle className="w-4 h-4 text-red-600" />}
                <h5 className="font-medium text-gray-900">{item.fact_check_items.claim}</h5>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(item.checked_at).toLocaleTimeString('ja-JP')}
              </span>
            </div>
            
            <div className="grid gap-2 text-sm">
              <div className="text-gray-600">
                <span className="font-medium">ソース:</span> {item.fact_check_items.source}
              </div>
              {item.previous_value && (
                <div className="text-gray-600">
                  <span className="font-medium">旧値:</span> {item.previous_value}
                </div>
              )}
              {item.new_value && item.new_value !== item.previous_value && (
                <div className="text-blue-600">
                  <span className="font-medium">新値:</span> {item.new_value}
                </div>
              )}
              {item.verification_notes && (
                <div className="text-gray-700">
                  <span className="font-medium">備考:</span> {item.verification_notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}