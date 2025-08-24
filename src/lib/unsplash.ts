import { createApi } from 'unsplash-js'

// Unsplash APIクライアント（アクセスキーは環境変数から取得）
export const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',
})

// 画像検索の結果型
export interface UnsplashImage {
  id: string
  urls: {
    regular: string
    small: string
    thumb: string
  }
  alt_description: string | null
  description: string | null
  user: {
    name: string
    username: string
  }
  links: {
    html: string
    download_location?: string
  }
}

// キーワードで画像を検索
export async function searchImages(
  query: string, 
  options: {
    page?: number
    perPage?: number
    orientation?: 'landscape' | 'portrait' | 'squarish'
  } = {}
): Promise<{ images: UnsplashImage[], total: number, error?: string }> {
  try {
    const { page = 1, perPage = 12, orientation = 'landscape' } = options
    
    const result = await unsplash.search.getPhotos({
      query,
      page,
      perPage,
      orientation,
    })

    if (result.errors) {
      return {
        images: [],
        total: 0,
        error: result.errors.join(', ')
      }
    }

    const images: UnsplashImage[] = result.response?.results?.map(photo => ({
      id: photo.id,
      urls: {
        regular: photo.urls.regular,
        small: photo.urls.small,
        thumb: photo.urls.thumb,
      },
      alt_description: photo.alt_description,
      description: photo.description,
      user: {
        name: photo.user.name,
        username: photo.user.username,
      },
      links: {
        html: photo.links.html,
        download_location: photo.links?.download_location
      }
    })) || []

    return {
      images,
      total: result.response?.total || 0,
      error: undefined
    }
  } catch (error) {
    console.error('Unsplash API error:', error)
    return {
      images: [],
      total: 0,
      error: 'Failed to search images'
    }
  }
}

// カテゴリに基づく推奨検索キーワード
export const categoryImageKeywords = {
  'market_analysis': 'business analytics charts data',
  'global_trends': 'global world technology trends',
  'law_regulation': 'law justice legal business',
  'tech_deep_dive': 'technology programming code software'
} as const

// カテゴリに基づいて画像を取得
export async function getImagesForCategory(
  category: keyof typeof categoryImageKeywords,
  additionalKeywords?: string
): Promise<{ images: UnsplashImage[], error?: string }> {
  const baseKeywords = categoryImageKeywords[category]
  const searchQuery = additionalKeywords 
    ? `${baseKeywords} ${additionalKeywords}`
    : baseKeywords

  const result = await searchImages(searchQuery, {
    perPage: 8,
    orientation: 'landscape'
  })

  return {
    images: result.images,
    error: result.error
  }
}

// ダウンロード追跡（Unsplash API利用規約による必要事項）
export async function trackDownload(downloadLocation: string): Promise<void> {
  try {
    if (!downloadLocation) {
      console.warn('No download location provided for tracking')
      return
    }
    await unsplash.photos.trackDownload({ downloadLocation })
  } catch (error) {
    console.error('Failed to track download:', error)
  }
}