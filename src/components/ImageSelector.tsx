'use client'

import { useState, useEffect } from 'react'
import { searchImages, getImagesForCategory, trackDownload, UnsplashImage, categoryImageKeywords } from '@/lib/unsplash'

interface ImageSelectorProps {
  onImageSelect: (imageUrl: string) => void
  selectedImage?: string
  category?: keyof typeof categoryImageKeywords
  initialKeywords?: string
}

export default function ImageSelector({ 
  onImageSelect, 
  selectedImage, 
  category = 'market_analysis',
  initialKeywords = ''
}: ImageSelectorProps) {
  const [images, setImages] = useState<UnsplashImage[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(initialKeywords)
  const [error, setError] = useState<string | null>(null)

  // 初期画像の読み込み
  useEffect(() => {
    loadCategoryImages()
  }, [category])

  const loadCategoryImages = async () => {
    setLoading(true)
    setError(null)
    
    const result = await getImagesForCategory(category, searchQuery)
    
    if (result.error) {
      setError(result.error)
    } else {
      setImages(result.images)
    }
    
    setLoading(false)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await loadCategoryImages()
      return
    }

    setLoading(true)
    setError(null)
    
    const result = await searchImages(searchQuery, {
      perPage: 12,
      orientation: 'landscape'
    })
    
    if (result.error) {
      setError(result.error)
    } else {
      setImages(result.images)
    }
    
    setLoading(false)
  }

  const handleImageSelect = async (image: UnsplashImage) => {
    // Unsplash利用規約に従ってダウンロードを追跡
    await trackDownload(image.id)
    onImageSelect(image.urls.regular)
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="画像を検索..."
          className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? '検索中...' : '検索'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-video bg-neutral-200 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {images.map((image) => (
            <div
              key={image.id}
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === image.urls.regular
                  ? 'border-primary-500'
                  : 'border-transparent hover:border-neutral-300'
              }`}
              onClick={() => handleImageSelect(image)}
            >
              <img
                src={image.urls.thumb}
                alt={image.alt_description || 'Unsplash image'}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-2 text-white text-xs">
                  <p className="font-medium">{image.user.name}</p>
                </div>
              </div>
              {selectedImage === image.urls.regular && (
                <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !loading && !error && (
        <div className="text-center py-8 text-neutral-500">
          画像が見つかりませんでした
        </div>
      )}

      <div className="text-xs text-neutral-500">
        画像は <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Unsplash</a> より提供
      </div>
    </div>
  )
}