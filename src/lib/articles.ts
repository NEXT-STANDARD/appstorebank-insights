import { supabase } from './supabase'

// 記事の型定義（Supabaseテーブル構造に合わせる）
export interface Article {
  id: string
  slug: string
  title: string
  subtitle?: string
  content: string // MDX content
  excerpt?: string
  category: 'market_analysis' | 'global_trends' | 'law_regulation' | 'tech_deep_dive'
  tags?: string[]
  status: 'draft' | 'published' | 'archived'
  is_premium: boolean
  author_id?: string
  published_at?: string
  created_at: string
  updated_at: string
  cover_image_url?: string
  reading_time?: number
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
} = {}) {
  const { category, limit = 10, offset = 0 } = options
  
  // 1つ多く取得してhasMoreを判定
  let query = supabase
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
    .range(offset, offset + limit)  // 1つ多く取得

  if (category && category !== 'すべて') {
    const dbCategory = categoryMappingReverse[category as keyof typeof categoryMappingReverse]
    if (dbCategory) {
      query = query.eq('category', dbCategory)
    }
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

// 単一記事を取得
export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
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
  const { error } = await supabase.rpc('increment_view_count', {
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
  const { data, error } = await supabase
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

  const { data, error } = await supabase
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
  const { error } = await supabase
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
  let query = supabase
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

// カテゴリを日本語に変換
export function getCategoryDisplayName(category: string): string {
  return categoryMapping[category as keyof typeof categoryMapping] || category
}