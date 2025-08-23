import { getImagesForCategory, categoryImageKeywords } from './unsplash'

// デフォルト画像のキャッシュ
const imageCache = new Map<string, string>()

// カテゴリごとのデフォルト画像を取得
export async function getDefaultImageForCategory(
  category: keyof typeof categoryImageKeywords
): Promise<string> {
  // キャッシュをチェック
  const cacheKey = `default_${category}`
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!
  }

  try {
    const result = await getImagesForCategory(category)
    
    if (result.images.length > 0) {
      // ランダムに1つ選択
      const randomIndex = Math.floor(Math.random() * Math.min(result.images.length, 3))
      const imageUrl = result.images[randomIndex].urls.regular
      
      // キャッシュに保存
      imageCache.set(cacheKey, imageUrl)
      
      return imageUrl
    }
  } catch (error) {
    console.error('Failed to get default image:', error)
  }

  // フォールバック画像
  return getFallbackImage(category)
}

// フォールバック画像（Unsplash APIが利用できない場合）
function getFallbackImage(category: keyof typeof categoryImageKeywords): string {
  const fallbackImages = {
    'market_analysis': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    'global_trends': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80', 
    'law_regulation': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    'tech_deep_dive': 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=800&q=80'
  }
  
  return fallbackImages[category]
}

// 記事にデフォルト画像を設定（画像がない場合）
export async function ensureArticleImage(
  article: {
    category: string
    cover_image_url?: string
  }
): Promise<string> {
  if (article.cover_image_url) {
    return article.cover_image_url
  }

  const category = article.category as keyof typeof categoryImageKeywords
  return await getDefaultImageForCategory(category)
}

// 複数記事のデフォルト画像を一括設定
export async function ensureArticleImages<T extends { 
  category: string
  cover_image_url?: string 
}>(articles: T[]): Promise<(T & { cover_image_url: string })[]> {
  const articlesWithImages = await Promise.all(
    articles.map(async (article) => ({
      ...article,
      cover_image_url: await ensureArticleImage(article)
    }))
  )
  
  return articlesWithImages
}