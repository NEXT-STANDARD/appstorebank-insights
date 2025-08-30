// クライアントサイド用のファクトチェックAPI関数

export interface FactCheckSession {
  id: string
  execution_date: string
  executor_id: string
  total_items: number
  completed_items: number
  updated_items: number
  failed_items: number
  execution_notes?: string
  status: 'in_progress' | 'completed' | 'cancelled'
  started_at: string
  completed_at?: string
}

export interface FactCheckHistory {
  id: string
  session_id: string
  item_id: string
  previous_value?: string
  new_value?: string
  verification_status: 'verified' | 'updated' | 'failed' | 'skipped'
  verification_notes?: string
  confidence_level?: 'high' | 'medium' | 'low'
  checked_at: string
  checker_id: string
}

// セッション管理
export async function createFactCheckSessionClient(totalItems: number): Promise<FactCheckSession> {
  const response = await fetch('/api/fact-check/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ totalItems }),
  })

  if (!response.ok) {
    throw new Error('Failed to create fact check session')
  }

  const { session } = await response.json()
  return session
}

export async function updateFactCheckSessionClient(
  sessionId: string, 
  updates: Partial<FactCheckSession>
): Promise<FactCheckSession> {
  const response = await fetch('/api/fact-check/sessions', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ sessionId, updates }),
  })

  if (!response.ok) {
    throw new Error('Failed to update fact check session')
  }

  const { session } = await response.json()
  return session
}

export async function completeFactCheckSessionClient(sessionId: string): Promise<void> {
  const response = await fetch(`/api/fact-check/sessions/${sessionId}`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to complete fact check session')
  }
}

// 履歴管理
export async function recordFactCheckHistoryClient(
  sessionId: string,
  itemId: string,
  verificationStatus: FactCheckHistory['verification_status'],
  previousValue?: string,
  newValue?: string,
  notes?: string,
  confidenceLevel?: 'high' | 'medium' | 'low'
): Promise<FactCheckHistory> {
  const response = await fetch('/api/fact-check/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      sessionId,
      itemId,
      verificationStatus,
      previousValue,
      newValue,
      notes,
      confidenceLevel,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to record fact check history')
  }

  const { history } = await response.json()
  return history
}

export async function getFactCheckHistoryClient(
  itemId?: string,
  limit: number = 50,
  offset: number = 0
): Promise<any[]> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  })
  
  if (itemId) {
    params.append('itemId', itemId)
  }

  const response = await fetch(`/api/fact-check/history?${params}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch fact check history')
  }

  const { history } = await response.json()
  return history
}

// レポート関数
export async function getRecentSessionsClient(limit: number = 10): Promise<FactCheckSession[]> {
  const response = await fetch(`/api/fact-check/reports?type=sessions&limit=${limit}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch recent sessions')
  }

  const { sessions } = await response.json()
  return sessions
}

export async function getFactCheckSummaryClient(): Promise<any[]> {
  const response = await fetch('/api/fact-check/reports?type=summary', {
    credentials: 'include',
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('API Error:', response.status, errorText)
    throw new Error(`Failed to fetch fact check summary: ${response.status} ${errorText}`)
  }

  const { summary } = await response.json()
  return summary
}

export async function getSessionReportClient(sessionId: string): Promise<any> {
  const response = await fetch(`/api/fact-check/reports?type=session-report&sessionId=${sessionId}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch session report')
  }

  const { report } = await response.json()
  return report
}

export async function searchFactCheckHistoryClient(
  searchTerm?: string,
  status?: string,
  dateFrom?: string,
  dateTo?: string,
  limit: number = 50
): Promise<any[]> {
  const params = new URLSearchParams({ 
    type: 'search',
    limit: limit.toString() 
  })
  
  if (searchTerm) params.append('search', searchTerm)
  if (status) params.append('status', status)
  if (dateFrom) params.append('dateFrom', dateFrom)
  if (dateTo) params.append('dateTo', dateTo)

  const response = await fetch(`/api/fact-check/reports?${params}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to search fact check history')
  }

  const { results } = await response.json()
  return results
}