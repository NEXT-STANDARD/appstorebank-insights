import { getSupabaseAdmin, supabase } from './supabase'

// 型定義
export interface TrendingTopic {
  id: string
  article_id?: string
  title: string
  description: string
  category: string
  view_count: number
  comment_count: number
  trending_type: 'hot' | 'rising' | 'new'
  priority_order: number
  is_active: boolean
  image_url?: string
  link: string
  created_at: string
  updated_at: string
}

export interface WeeklyReport {
  id: string
  title: string
  description: string
  week_start_date: string
  week_end_date: string
  report_content: any
  cover_image_url?: string
  is_published: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface NewsTickerItem {
  id: string
  type: 'regulation' | 'market' | 'announcement' | 'update'
  text: string
  link?: string
  priority_order: number
  is_active: boolean
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  type: 'law' | 'launch' | 'deadline' | 'conference'
  link?: string
  is_completed: boolean
  is_active: boolean
  priority_order: number
  created_at: string
  updated_at: string
}

// サンプルデータ（マイグレーション前の一時的な実装）
const sampleTrendingTopics: TrendingTopic[] = [
  {
    id: '1',
    title: 'アプリ手数料17%時代の収益モデル',
    description: '手数料引き下げによる開発者への影響と新たなビジネスチャンスを解説',
    category: '市場分析',
    view_count: 15234,
    comment_count: 89,
    trending_type: 'hot',
    priority_order: 1,
    is_active: true,
    link: '/articles/new-revenue-model',
    image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    created_at: '2024-08-28T00:00:00Z',
    updated_at: '2024-08-28T00:00:00Z'
  },
  {
    id: '2',
    title: '代替アプリストアへの移行ガイド',
    description: 'Google PlayやApp Storeから代替ストアへの移行手順と注意点',
    category: '技術解説',
    view_count: 8921,
    comment_count: 45,
    trending_type: 'rising',
    priority_order: 2,
    is_active: true,
    link: '/articles/migration-guide',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    created_at: '2024-08-27T00:00:00Z',
    updated_at: '2024-08-27T00:00:00Z'
  }
]

const sampleNewsItems: NewsTickerItem[] = [
  {
    id: '1',
    type: 'regulation',
    text: '🎌 スマートフォン新法が2025年4月より施行開始',
    link: '/articles/smartphone-law-2025',
    priority_order: 1,
    is_active: true,
    created_at: '2024-08-28T00:00:00Z',
    updated_at: '2024-08-28T00:00:00Z'
  },
  {
    id: '2',
    type: 'market',
    text: '📊 国内アプリストア市場規模が前年比15%成長',
    link: '/articles/market-growth-2024',
    priority_order: 2,
    is_active: true,
    created_at: '2024-08-27T00:00:00Z',
    updated_at: '2024-08-27T00:00:00Z'
  }
]

const sampleTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    date: '2025-04-01',
    title: 'スマートフォン新法施行',
    description: 'アプリストア自由化の完全実施',
    type: 'law',
    link: '/articles/smartphone-law-implementation',
    is_completed: false,
    is_active: true,
    priority_order: 1,
    created_at: '2024-08-28T00:00:00Z',
    updated_at: '2024-08-28T00:00:00Z'
  }
]

// 注目トピック取得（サーバーサイド用）
export async function getTrendingTopicsServer(): Promise<{ topics: TrendingTopic[], error: any }> {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return { topics: sampleTrendingTopics, error: null }
    }

    const { data, error } = await supabaseAdmin
      .from('trending_topics')
      .select('*')
      .eq('is_active', true)
      .order('priority_order', { ascending: true })

    if (error) {
      console.error('Error fetching trending topics:', error)
      return { topics: sampleTrendingTopics, error }
    }

    return { topics: data || [], error: null }
  } catch (error) {
    console.error('Error in getTrendingTopicsServer:', error)
    return { topics: sampleTrendingTopics, error }
  }
}

// 注目トピック取得（クライアントサイド用）
export async function getTrendingTopics(): Promise<{ topics: TrendingTopic[], error: any }> {
  try {
    if (!supabase) {
      return { topics: sampleTrendingTopics, error: null }
    }

    const { data, error } = await supabase
      .from('trending_topics')
      .select('*')
      .eq('is_active', true)
      .order('priority_order', { ascending: true })

    if (error) {
      console.error('Error fetching trending topics:', error)
      return { topics: sampleTrendingTopics, error }
    }

    return { topics: data || [], error: null }
  } catch (error) {
    console.error('Error in getTrendingTopics:', error)
    return { topics: sampleTrendingTopics, error }
  }
}

// ニュースティッカー取得
export async function getNewsTickerItems(): Promise<{ items: NewsTickerItem[], error: any }> {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return { items: sampleNewsItems, error: null }
    }

    const { data, error } = await supabase
      .from('news_ticker_items')
      .select('*')
      .eq('is_active', true)
      .order('priority_order', { ascending: true })

    if (error) {
      console.error('Error fetching news ticker items:', error)
      return { items: sampleNewsItems, error }
    }

    return { items: data || [], error: null }
  } catch (error) {
    console.error('Error in getNewsTickerItems:', error)
    return { items: sampleNewsItems, error }
  }
}

// タイムラインイベント取得
export async function getTimelineEvents(): Promise<{ events: TimelineEvent[], error: any }> {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return { events: sampleTimelineEvents, error: null }
    }

    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('is_active', true)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching timeline events:', error)
      return { events: sampleTimelineEvents, error }
    }

    return { events: data || [], error: null }
  } catch (error) {
    console.error('Error in getTimelineEvents:', error)
    return { events: sampleTimelineEvents, error }
  }
}

// 週間レポート取得
export async function getWeeklyReports(): Promise<{ reports: WeeklyReport[], error: any }> {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return { reports: [], error: null }
    }

    const { data, error } = await supabase
      .from('weekly_reports')
      .select('*')
      .eq('is_published', true)
      .order('week_start_date', { ascending: false })

    if (error) {
      console.error('Error fetching weekly reports:', error)
      return { reports: [], error }
    }

    return { reports: data || [], error: null }
  } catch (error) {
    console.error('Error in getWeeklyReports:', error)
    return { reports: [], error }
  }
}

// 注目トピック作成
export async function createTrendingTopic(data: Omit<TrendingTopic, 'id' | 'created_at' | 'updated_at'>): Promise<{ topic: TrendingTopic | null, error: any }> {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return { topic: null, error: 'Supabase not available' }
    }

    const { data: topic, error } = await supabase
      .from('trending_topics')
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error('Error creating trending topic:', error)
      return { topic: null, error }
    }

    return { topic, error: null }
  } catch (error) {
    console.error('Error in createTrendingTopic:', error)
    return { topic: null, error }
  }
}

// 注目トピック更新
export async function updateTrendingTopic(id: string, data: Partial<TrendingTopic>): Promise<{ topic: TrendingTopic | null, error: any }> {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return { topic: null, error: 'Supabase not available' }
    }

    const { data: topic, error } = await supabase
      .from('trending_topics')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating trending topic:', error)
      return { topic: null, error }
    }

    return { topic, error: null }
  } catch (error) {
    console.error('Error in updateTrendingTopic:', error)
    return { topic: null, error }
  }
}

// 注目トピック削除
export async function deleteTrendingTopic(id: string): Promise<{ error: any }> {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return { error: 'Supabase not available' }
    }

    const { error } = await supabase
      .from('trending_topics')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting trending topic:', error)
      return { error }
    }

    return { error: null }
  } catch (error) {
    console.error('Error in deleteTrendingTopic:', error)
    return { error }
  }
}