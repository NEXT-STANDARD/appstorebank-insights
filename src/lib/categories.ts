import { supabase } from './supabase'

// カテゴリの型定義
export interface Category {
  id: string
  slug: string
  name: string
  description?: string | null
  sort_order?: number
  is_active?: boolean
  created_at?: string
}

// アクティブなカテゴリ一覧を取得
export async function getActiveCategories(): Promise<{ categories: Category[], error: any }> {
  if (!supabase) {
    return { categories: [], error: 'Supabase not initialized' }
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  return {
    categories: data || [],
    error
  }
}

// 全カテゴリ一覧を取得（管理画面用）
export async function getAllCategories(): Promise<{ categories: Category[], error: any }> {
  if (!supabase) {
    return { categories: [], error: 'Supabase not initialized' }
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  return {
    categories: data || [],
    error
  }
}

// カテゴリを作成
export async function createCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<{ category: Category | null, error: any }> {
  if (!supabase) {
    return { category: null, error: 'Supabase not initialized' }
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single()

  return {
    category: data,
    error
  }
}

// カテゴリを更新
export async function updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'created_at'>>): Promise<{ category: Category | null, error: any }> {
  if (!supabase) {
    return { category: null, error: 'Supabase not initialized' }
  }

  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return {
    category: data,
    error
  }
}

// カテゴリを削除（実際には無効化）
export async function deleteCategory(id: string): Promise<{ success: boolean, error: any }> {
  const { error } = await updateCategory(id, { is_active: false })
  
  return {
    success: !error,
    error
  }
}

// 単一のカテゴリを取得
export async function getCategoryById(id: string): Promise<{ category: Category | null, error: any }> {
  if (!supabase) {
    return { category: null, error: 'Supabase not initialized' }
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  return {
    category: data,
    error
  }
}

// スラッグからカテゴリを取得
export async function getCategoryBySlug(slug: string): Promise<{ category: Category | null, error: any }> {
  if (!supabase) {
    return { category: null, error: 'Supabase not initialized' }
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  return {
    category: data,
    error
  }
}