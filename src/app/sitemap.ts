import { MetadataRoute } from 'next'
import { getPublishedArticles } from '@/lib/articles'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://insights.appstorebank.com'

  // 静的ページ
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/#categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // 記事ページ
  const { articles } = await getPublishedArticles()
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.updated_at || article.published_at || article.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // カテゴリページ（将来実装予定）
  const categories = ['market_analysis', 'global_trends', 'law_regulation', 'tech_deep_dive']
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/categories/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...articlePages,
    ...categoryPages,
  ]
}