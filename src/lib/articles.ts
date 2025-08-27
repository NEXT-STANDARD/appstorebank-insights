import { supabase } from './supabase'

// Supabaseが利用できない場合のフォールバック
const isSupabaseAvailable = () => supabase !== null

// 記事の型定義（Supabaseテーブル構造に合わせる）
export interface Article {
  id: string
  slug: string
  title: string
  subtitle?: string
  content: string // MDX content
  excerpt?: string
  category: string
  tags?: string[]
  status: 'draft' | 'published' | 'archived'
  is_premium: boolean
  is_featured?: boolean
  technical_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  author_id?: string
  published_at?: string
  created_at: string
  updated_at: string
  cover_image_url?: string
  reading_time?: number
  external_sources?: string[] // 外部ソースのURLリスト
  author?: {
    id: string
    display_name: string
    avatar_url?: string
  }
}

// カテゴリのマッピング
export const categoryMapping = {
  'market_analysis': '市場分析',
  'global_trends': 'グローバルトレンド', 
  'law_regulation': '法規制',
  'tech_deep_dive': '技術解説'
} as const

export const categoryMappingReverse = {
  '市場分析': 'market_analysis',
  'グローバルトレンド': 'global_trends',
  '法規制': 'law_regulation',
  '技術解説': 'tech_deep_dive'
} as const

// 公開記事一覧を取得
export async function getPublishedArticles(options: {
  category?: string
  limit?: number
  offset?: number
  page?: number
  featured?: boolean
} = {}) {
  const { category, limit = 10, offset, page, featured = false } = options
  
  // pageが指定されている場合、offsetを計算
  const calculatedOffset = page ? (page - 1) * limit : (offset || 0)
  
  if (!isSupabaseAvailable()) {
    return { articles: [], hasMore: false }
  }
  
  // 1つ多く取得してhasMoreを判定
  let query = supabase!
    .from('articles')
    .select(`
      *,
      profiles!articles_author_id_fkey (
        id,
        display_name,
        avatar_url
      )
    `)
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .range(calculatedOffset, calculatedOffset + limit)  // 1つ多く取得

  if (category && category !== 'すべて') {
    console.log('Filtering by category:', category)
    query = query.eq('category', category)
  }

  if (featured) {
    query = query.eq('is_featured', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching articles:', error)
    return { articles: [], error, hasMore: false }
  }

  const allArticles: Article[] = data?.map(article => ({
    ...article,
    author: article.profiles ? {
      id: article.profiles.id,
      display_name: article.profiles.display_name,
      avatar_url: article.profiles.avatar_url
    } : undefined
  })) || []

  // hasMoreの判定
  const hasMore = allArticles.length > limit
  const articles = hasMore ? allArticles.slice(0, limit) : allArticles

  return { articles, error: null, hasMore }
}

// カテゴリ別記事数を取得
export async function getCategoryCount(category?: string): Promise<number> {
  if (!isSupabaseAvailable()) {
    return 0
  }

  let query = supabase!
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published')
    .not('published_at', 'is', null)

  if (category && category !== 'すべて') {
    query = query.eq('category', category)
  }

  const { count, error } = await query

  if (error) {
    console.error('Error fetching category count:', error)
    return 0
  }

  return count || 0
}

// 全カテゴリの記事数を取得
export async function getAllCategoryCounts(): Promise<Record<string, number>> {
  if (!isSupabaseAvailable()) {
    return {}
  }

  try {
    // まずカテゴリマッピングを読み込み
    await loadCategoryMapping()
    
    // 公開済みの全記事を取得してカテゴリをカウント
    const { data, error } = await supabase!
      .from('articles')
      .select('category')
      .eq('status', 'published')
    
    if (error || !data) return {}
    
    const counts: Record<string, number> = {}
    const categoryCount: Record<string, number> = {}
    
    // すべてのカテゴリをカウント（カスタムカテゴリも含む）
    data.forEach(article => {
      const category = article.category || 'market_analysis'
      categoryCount[category] = (categoryCount[category] || 0) + 1
    })
    
    // 全記事数
    counts['すべて'] = data.length
    
    // 各カテゴリの表示名に変換
    Object.entries(categoryCount).forEach(([key, count]) => {
      const displayName = getCategoryDisplayName(key)
      console.log(`Converting category ${key} to display name: ${displayName}`)
      counts[displayName] = count
    })
    
    console.log('Final category counts:', counts)
    return counts
  } catch (error) {
    console.error('Error fetching all category counts:', error)
    return {}
  }
}

// 単一記事を取得
export async function getArticleBySlug(slug: string) {
  if (!slug) {
    return { article: null, error: 'No slug provided' }
  }

  if (!isSupabaseAvailable()) {
    return { article: null, error: 'Supabase not available' }
  }
  
  const { data, error } = await supabase!
    .from('articles')
    .select(`
      *,
      profiles!articles_author_id_fkey (
        id,
        display_name,
        avatar_url
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // 記事が見つからない場合（ログを出さない）
      return { article: null, error: 'Article not found' }
    }
    console.error('Error fetching article:', error)
    return { article: null, error }
  }

  const article: Article = {
    ...data,
    author: data.profiles ? {
      id: data.profiles.id,
      display_name: data.profiles.display_name,
      avatar_url: data.profiles.avatar_url
    } : undefined
  }

  return { article, error: null }
}

// 記事の閲覧数を増加
export async function incrementViewCount(articleId: string) {
  if (!isSupabaseAvailable()) {
    console.warn('Supabase not available, skipping view count increment')
    return
  }
  
  const { error } = await supabase!.rpc('increment_view_count', {
    article_id: articleId
  })

  if (error) {
    console.error('Error incrementing view count:', error)
  }
}

// 記事を作成（管理者用）
export async function createArticle(articleData: {
  title: string
  subtitle?: string
  slug: string
  content: string
  excerpt?: string
  category: string
  status?: string
  is_premium?: boolean
  author_id?: string
  published_at?: string
  tags?: string[]
  cover_image_url?: string
}) {
  if (!isSupabaseAvailable()) {
    return { article: null, error: 'Supabase not available' }
  }
  
  const { data, error } = await supabase!
    .from('articles')
    .insert({
      slug: articleData.slug,
      title: articleData.title,
      subtitle: articleData.subtitle,
      content: articleData.content,
      excerpt: articleData.excerpt,
      category: articleData.category,
      status: articleData.status || 'draft',
      is_premium: articleData.is_premium || false,
      author_id: articleData.author_id,
      published_at: articleData.published_at || null,
      tags: articleData.tags || [],
      cover_image_url: articleData.cover_image_url
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating article:', error)
    return { article: null, error }
  }

  return { article: data, error: null }
}

// 記事を更新（管理者用）
export async function updateArticle(articleId: string, updates: Partial<{
  title: string
  content: string
  excerpt: string
  category: keyof typeof categoryMappingReverse
  is_premium: boolean
  published_at: string
  tags: string[]
  thumbnail_url: string
}>) {
  const updateData: any = { ...updates }
  
  if (updates.title) {
    updateData.slug = generateSlug(updates.title)
  }
  
  if (updates.content) {
    updateData.reading_time = calculateReadingTime(updates.content)
  }
  
  if (updates.category) {
    updateData.category = categoryMappingReverse[updates.category]
  }

  if (!isSupabaseAvailable()) {
    return { article: null, error: 'Supabase not available' }
  }

  const { data, error } = await supabase!
    .from('articles')
    .update(updateData)
    .eq('id', articleId)
    .select()
    .single()

  if (error) {
    console.error('Error updating article:', error)
    return { article: null, error }
  }

  return { article: data, error: null }
}

// 記事を削除（管理者用）
export async function deleteArticle(articleId: string) {
  if (!isSupabaseAvailable()) {
    return { error: 'Supabase not available' }
  }
  
  const { error } = await supabase!
    .from('articles')
    .delete()
    .eq('id', articleId)

  if (error) {
    console.error('Error deleting article:', error)
    return { error }
  }

  return { error: null }
}

// 下書き記事一覧を取得（管理者用）
export async function getDraftArticles(authorId?: string) {
  if (!isSupabaseAvailable()) {
    return { articles: [], error: 'Supabase not available' }
  }
  
  let query = supabase!
    .from('articles')
    .select(`
      *,
      profiles!articles_author_id_fkey (
        id,
        display_name,
        avatar_url
      )
    `)
    .eq('status', 'draft')
    .order('updated_at', { ascending: false })

  if (authorId) {
    query = query.eq('author_id', authorId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching draft articles:', error)
    return { articles: [], error }
  }

  const articles: Article[] = data?.map(article => ({
    ...article,
    author: article.profiles ? {
      id: article.profiles.id,
      display_name: article.profiles.display_name,
      avatar_url: article.profiles.avatar_url
    } : undefined
  })) || []

  return { articles, error: null }
}

// ユーティリティ関数

// タイトルからスラッグを生成
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 特殊文字を除去
    .replace(/[\s_-]+/g, '-') // スペースをハイフンに
    .replace(/^-+|-+$/g, '') // 先頭と末尾のハイフンを除去
    + '-' + Date.now().toString(36) // 重複回避のためタイムスタンプ追加
}

// 読了時間を計算（日本語対応）
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 400 // 日本語の平均読書速度
  const wordCount = content.length / 2 // 日本語は1文字0.5語として計算
  return Math.ceil(wordCount / wordsPerMinute)
}

// カテゴリキャッシュ
let categoryCache: { [slug: string]: string } = {}
let cacheExpiry = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5分

// カテゴリを日本語に変換
export function getCategoryDisplayName(category: string): string {
  // まず既定のマッピングを確認
  const defaultName = categoryMapping[category as keyof typeof categoryMapping]
  if (defaultName) return defaultName
  
  // キャッシュから確認（有効期限チェックを緩和）
  if (categoryCache[category]) {
    console.log(`Using cached name for ${category}: ${categoryCache[category]}`)
    return categoryCache[category]
  }
  
  console.log(`No mapping found for category: ${category}, using fallback`)
  // フォールバック：カテゴリ名をそのまま返す（ハイフンをスペースに変換）
  return category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// カテゴリキャッシュを更新
export function updateCategoryCache(categories: { slug: string, name: string }[]) {
  categories.forEach(cat => {
    categoryCache[cat.slug] = cat.name
  })
  cacheExpiry = Date.now() + CACHE_DURATION
}

// データベースからカテゴリマッピングを取得してキャッシュを更新
export async function loadCategoryMapping() {
  if (!isSupabaseAvailable()) return
  
  try {
    const { data, error } = await supabase!
      .from('categories')
      .select('slug, name')
      .eq('is_active', true)
    
    if (!error && data) {
      console.log('Loading category mapping from database:', data)
      updateCategoryCache(data)
      console.log('Updated category cache:', categoryCache)
    } else if (error) {
      console.error('Error loading category mapping:', error)
    }
  } catch (e) {
    console.error('Failed to load category mapping:', e)
  }
}

// 記事を検索
export async function searchArticles(query: string, limit: number = 10) {
  if (!isSupabaseAvailable()) {
    return { articles: [], error: 'Supabase not available' }
  }
  
  const { data, error } = await supabase!
    .from('articles')
    .select(`
      *,
      profiles!articles_author_id_fkey (
        id,
        display_name,
        avatar_url
      )
    `)
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error searching articles:', error)
    return { articles: [], error }
  }

  const articles: Article[] = data?.map(article => ({
    ...article,
    author: article.profiles ? {
      id: article.profiles.id,
      display_name: article.profiles.display_name,
      avatar_url: article.profiles.avatar_url
    } : undefined
  })) || []

  return { articles, error: null }
}