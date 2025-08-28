import { MetadataRoute } from 'next'
import { getPublishedArticles } from '@/lib/articles'
import { getSupabaseAdmin } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://insights.appstorebank.com'
  const supabase = getSupabaseAdmin()

  // 静的ページ
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/app-stores`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/app-store-rankings`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // 記事ページ
  const { articles } = await getPublishedArticles()
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.updated_at || article.published_at || article.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // カテゴリページ
  const categories = ['market_analysis', 'global_trends', 'law_regulation', 'tech_deep_dive']
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/articles/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // アプリストアページ
  const { data: appStores } = await supabase!
    .from('app_stores')
    .select('slug, updated_at')
    .in('status', ['available', 'coming_soon'])
    .order('updated_at', { ascending: false })

  const appStorePages = appStores?.map(store => ({
    url: `${baseUrl}/app-stores/${store.slug}`,
    lastModified: new Date(store.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  })) || []

  return [
    ...staticPages,
    ...categoryPages,
    ...articlePages,
    ...appStorePages,
  ]
}