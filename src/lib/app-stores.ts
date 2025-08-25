import { supabase, getSupabaseAdmin } from './supabase'

// アプリストアの型定義
export interface AppStore {
  id: string
  name: string
  slug: string
  company: string
  logo_emoji?: string
  logo_url?: string
  status: 'available' | 'coming_soon' | 'planning' | 'discontinued'
  commission_rate?: string
  small_business_rate?: string
  subscription_rate_year1?: string
  subscription_rate_year2?: string
  features: string[]
  supported_devices: string[]
  website_url?: string
  description?: string
  launch_date?: string
  is_third_party: boolean
  is_featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

// ステータスの表示名マッピング
export const statusMapping = {
  'available': '利用可能',
  'coming_soon': '準備中',
  'planning': '計画中',
  'discontinued': '終了'
} as const

export const statusColors = {
  'available': 'bg-green-100 text-green-800',
  'coming_soon': 'bg-yellow-100 text-yellow-800',
  'planning': 'bg-gray-100 text-gray-800',
  'discontinued': 'bg-red-100 text-red-800'
} as const

// すべてのアプリストアを取得（公開用）
export async function getAllAppStores(): Promise<{ appStores: AppStore[]; error: string | null }> {
  if (!supabase) {
    return { appStores: [], error: 'Supabase not available' }
  }

  try {
    const { data, error } = await supabase
      .from('app_stores')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching app stores:', error)
      return { appStores: [], error: error.message }
    }

    return { appStores: data as AppStore[], error: null }
  } catch (err) {
    console.error('Error in getAllAppStores:', err)
    return { appStores: [], error: 'Failed to fetch app stores' }
  }
}

// ステータス別アプリストア取得
export async function getAppStoresByStatus(status: AppStore['status']): Promise<{ appStores: AppStore[]; error: string | null }> {
  if (!supabase) {
    return { appStores: [], error: 'Supabase not available' }
  }

  try {
    const { data, error } = await supabase
      .from('app_stores')
      .select('*')
      .eq('status', status)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching app stores by status:', error)
      return { appStores: [], error: error.message }
    }

    return { appStores: data as AppStore[], error: null }
  } catch (err) {
    console.error('Error in getAppStoresByStatus:', err)
    return { appStores: [], error: 'Failed to fetch app stores' }
  }
}

// 特定のアプリストアを取得
export async function getAppStoreBySlug(slug: string): Promise<{ appStore: AppStore | null; error: string | null }> {
  if (!supabase) {
    return { appStore: null, error: 'Supabase not available' }
  }

  try {
    const { data, error } = await supabase
      .from('app_stores')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { appStore: null, error: 'App store not found' }
      }
      console.error('Error fetching app store:', error)
      return { appStore: null, error: error.message }
    }

    return { appStore: data as AppStore, error: null }
  } catch (err) {
    console.error('Error in getAppStoreBySlug:', err)
    return { appStore: null, error: 'Failed to fetch app store' }
  }
}

// アプリストア作成（管理者用）
export async function createAppStore(appStoreData: Omit<AppStore, 'id' | 'created_at' | 'updated_at'>): Promise<{ appStore: AppStore | null; error: string | null }> {
  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    return { appStore: null, error: 'Admin access not available' }
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('app_stores')
      .insert([appStoreData])
      .select()
      .single()

    if (error) {
      console.error('Error creating app store:', error)
      return { appStore: null, error: error.message }
    }

    return { appStore: data as AppStore, error: null }
  } catch (err) {
    console.error('Error in createAppStore:', err)
    return { appStore: null, error: 'Failed to create app store' }
  }
}

// アプリストア更新（管理者用）
export async function updateAppStore(id: string, appStoreData: Partial<Omit<AppStore, 'id' | 'created_at' | 'updated_at'>>): Promise<{ appStore: AppStore | null; error: string | null }> {
  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    return { appStore: null, error: 'Admin access not available' }
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('app_stores')
      .update(appStoreData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating app store:', error)
      return { appStore: null, error: error.message }
    }

    return { appStore: data as AppStore, error: null }
  } catch (err) {
    console.error('Error in updateAppStore:', err)
    return { appStore: null, error: 'Failed to update app store' }
  }
}

// アプリストア削除（管理者用）
export async function deleteAppStore(id: string): Promise<{ success: boolean; error: string | null }> {
  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    return { success: false, error: 'Admin access not available' }
  }

  try {
    const { error } = await supabaseAdmin
      .from('app_stores')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting app store:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error('Error in deleteAppStore:', err)
    return { success: false, error: 'Failed to delete app store' }
  }
}

// 管理者用：すべてのアプリストア取得（削除済みも含む）
export async function getAllAppStoresAdmin(): Promise<{ appStores: AppStore[]; error: string | null }> {
  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    return { appStores: [], error: 'Admin access not available' }
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('app_stores')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching app stores (admin):', error)
      return { appStores: [], error: error.message }
    }

    return { appStores: data as AppStore[], error: null }
  } catch (err) {
    console.error('Error in getAllAppStoresAdmin:', err)
    return { appStores: [], error: 'Failed to fetch app stores' }
  }
}

// アプリストアID取得（管理者用）
export async function getAppStoreByIdAdmin(id: string): Promise<{ appStore: AppStore | null; error: string | null }> {
  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    return { appStore: null, error: 'Admin access not available' }
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('app_stores')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { appStore: null, error: 'App store not found' }
      }
      console.error('Error fetching app store (admin):', error)
      return { appStore: null, error: error.message }
    }

    return { appStore: data as AppStore, error: null }
  } catch (err) {
    console.error('Error in getAppStoreByIdAdmin:', err)
    return { appStore: null, error: 'Failed to fetch app store' }
  }
}

// 表示順序更新（管理者用）
export async function updateAppStoreOrder(updates: { id: string; display_order: number }[]): Promise<{ success: boolean; error: string | null }> {
  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    return { success: false, error: 'Admin access not available' }
  }

  try {
    // バッチ更新
    for (const update of updates) {
      const { error } = await supabaseAdmin
        .from('app_stores')
        .update({ display_order: update.display_order })
        .eq('id', update.id)

      if (error) {
        console.error('Error updating display order:', error)
        return { success: false, error: error.message }
      }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error('Error in updateAppStoreOrder:', err)
    return { success: false, error: 'Failed to update display order' }
  }
}