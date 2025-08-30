import { getSupabaseAdmin } from './supabase'

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

export interface FactCheckItem {
  id: string
  component: string
  section: string
  fact_type: 'statistic' | 'date' | 'percentage' | 'legal' | 'company_info' | 'market_data'
  claim: string
  source: string
  source_url: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  confidence: 'high' | 'medium' | 'low'
  is_active: boolean
  review_frequency_days: number
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

export interface FactCheckSchedule {
  id: string
  claim: string
  priority: string
  review_frequency_days: number
  next_review_date: string
  last_checked_at?: string
  total_checks: number
  update_count: number
}

// セッション管理
export async function createFactCheckSession(executorId: string, totalItems: number) {
  const supabase = getSupabaseAdmin()
  
  const { data, error } = await supabase
    .from('fact_check_sessions')
    .insert({
      execution_date: new Date().toISOString().split('T')[0],
      executor_id: executorId,
      total_items: totalItems,
      status: 'in_progress'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating fact check session:', error)
    throw error
  }

  return data as FactCheckSession
}

export async function updateFactCheckSession(
  sessionId: string, 
  updates: Partial<FactCheckSession>
) {
  const supabase = getSupabaseAdmin()
  
  const { data, error } = await supabase
    .from('fact_check_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single()

  if (error) {
    console.error('Error updating fact check session:', error)
    throw error
  }

  return data as FactCheckSession
}

export async function completeFactCheckSession(sessionId: string) {
  const supabase = getSupabaseAdmin()
  
  const { error } = await supabase
    .rpc('complete_fact_check_session', { session_uuid: sessionId })

  if (error) {
    console.error('Error completing fact check session:', error)
    throw error
  }
}

// 項目管理
export async function getFactCheckItems(priority?: string) {
  const supabase = getSupabaseAdmin()
  
  let query = supabase
    .from('fact_check_items')
    .select('*')
    .eq('is_active', true)

  if (priority) {
    query = query.eq('priority', priority)
  }

  const { data, error } = await query.order('priority', { ascending: true })

  if (error) {
    console.error('Error fetching fact check items:', error)
    throw error
  }

  return data as FactCheckItem[]
}

export async function getFactCheckSchedule() {
  const supabase = getSupabaseAdmin()
  
  const { data, error } = await supabase
    .from('fact_check_schedule')
    .select('*')
    .order('next_review_date', { ascending: true })

  if (error) {
    console.error('Error fetching fact check schedule:', error)
    throw error
  }

  return data as FactCheckSchedule[]
}

// 履歴管理
export async function recordFactCheckHistory(
  sessionId: string,
  itemId: string,
  checkerId: string,
  verificationStatus: FactCheckHistory['verification_status'],
  previousValue?: string,
  newValue?: string,
  notes?: string,
  confidenceLevel?: 'high' | 'medium' | 'low'
) {
  const supabase = getSupabaseAdmin()
  
  const { data, error } = await supabase
    .from('fact_check_history')
    .insert({
      session_id: sessionId,
      item_id: itemId,
      previous_value: previousValue,
      new_value: newValue,
      verification_status: verificationStatus,
      verification_notes: notes,
      confidence_level: confidenceLevel,
      checker_id: checkerId
    })
    .select()
    .single()

  if (error) {
    console.error('Error recording fact check history:', error)
    throw error
  }

  return data as FactCheckHistory
}

export async function getFactCheckHistory(
  itemId?: string,
  limit: number = 50,
  offset: number = 0
) {
  const supabase = getSupabaseAdmin()
  
  let query = supabase
    .from('fact_check_history')
    .select(`
      *,
      fact_check_items!inner(claim, component, section),
      fact_check_sessions!inner(execution_date)
    `)
    .order('checked_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (itemId) {
    query = query.eq('item_id', itemId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching fact check history:', error)
    throw error
  }

  return data
}

export async function getRecentSessions(limit: number = 10) {
  const supabase = getSupabaseAdmin()
  
  const { data, error } = await supabase
    .from('fact_check_sessions')
    .select('*')
    .order('execution_date', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent sessions:', error)
    throw error
  }

  return data as FactCheckSession[]
}

// 統計情報
export async function getFactCheckSummary() {
  const supabase = getSupabaseAdmin()
  
  const { data, error } = await supabase
    .from('fact_check_summary')
    .select('*')
    .order('month', { ascending: false })
    .limit(12)

  if (error) {
    console.error('Error fetching fact check summary:', error)
    throw error
  }

  return data
}

export async function getFactCheckStats() {
  const supabase = getSupabaseAdmin()
  
  // 基本統計
  const { data: totalItems } = await supabase
    .from('fact_check_items')
    .select('id', { count: 'exact' })
    .eq('is_active', true)

  const { data: recentHistory } = await supabase
    .from('fact_check_history')
    .select('verification_status', { count: 'exact' })
    .gte('checked_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

  // 期限切れ項目
  const { data: overdueItems } = await supabase
    .from('fact_check_schedule')
    .select('*', { count: 'exact' })
    .lt('next_review_date', new Date().toISOString())

  return {
    totalItems: totalItems?.length || 0,
    recentChecks: recentHistory?.length || 0,
    overdueItems: overdueItems?.length || 0
  }
}

// 検索・フィルタリング
export async function searchFactCheckHistory(
  searchTerm?: string,
  status?: string,
  dateFrom?: string,
  dateTo?: string,
  limit: number = 50
) {
  const supabase = getSupabaseAdmin()
  
  let query = supabase
    .from('fact_check_history')
    .select(`
      *,
      fact_check_items!inner(claim, component, section),
      fact_check_sessions!inner(execution_date)
    `)

  if (status) {
    query = query.eq('verification_status', status)
  }

  if (dateFrom) {
    query = query.gte('checked_at', dateFrom)
  }

  if (dateTo) {
    query = query.lte('checked_at', dateTo)
  }

  if (searchTerm) {
    query = query.or(`verification_notes.ilike.%${searchTerm}%,fact_check_items.claim.ilike.%${searchTerm}%`)
  }

  const { data, error } = await query
    .order('checked_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error searching fact check history:', error)
    throw error
  }

  return data
}

// レポート生成用データ取得
export async function getSessionReport(sessionId: string) {
  const supabase = getSupabaseAdmin()
  
  // セッション情報
  const { data: session, error: sessionError } = await supabase
    .from('fact_check_sessions')
    .select('*')
    .eq('id', sessionId)
    .single()

  if (sessionError) throw sessionError

  // セッション内の履歴
  const { data: history, error: historyError } = await supabase
    .from('fact_check_history')
    .select(`
      *,
      fact_check_items!inner(claim, component, section, source)
    `)
    .eq('session_id', sessionId)
    .order('checked_at', { ascending: true })

  if (historyError) throw historyError

  return {
    session: session as FactCheckSession,
    history: history
  }
}

// 項目の値更新（実際のコンポーネント値も更新する場合の準備）
export async function updateFactValue(itemId: string, newValue: string) {
  // この関数は実際のコンポーネントファイルの値も更新する必要がある
  // 実装は後で行う（ファイルの直接編集が必要なため）
  console.log(`Item ${itemId} should be updated to: ${newValue}`)
  
  // TODO: 実際のコンポーネントファイルの値を更新
  // - IndustryStatsSummary.tsx
  // - FAQComponent.tsx
  // - CaseStudyComponent.tsx
  // など、該当するファイルの値を書き換える
}