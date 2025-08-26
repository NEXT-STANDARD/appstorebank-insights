import { Metadata } from 'next'
import { Suspense } from 'react'
import Header from '@/components/Header'
import BlogHero from '@/components/BlogHero'
import Footer from '@/components/Footer'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { getPublishedArticles } from '@/lib/articles'
import HomePageContent from './HomePageContent'

// Generate dynamic metadata with featured article OGP
export async function generateMetadata(): Promise<Metadata> {
  try {
    // 注目記事を取得
    const { articles } = await getPublishedArticles({ featured: true, limit: 1 })
    const featuredArticle = articles.length > 0 ? articles[0] : null
    
    // 注目記事がある場合はそのOGP画像を使用、なければデフォルト
    const ogImage = featuredArticle?.cover_image_url || 
      `/api/og?title=${encodeURIComponent('アプリストア業界の専門メディア')}&category=${encodeURIComponent('業界洞察')}`
    
    const title = featuredArticle 
      ? `${featuredArticle.title} | AppStoreBank Insights`
      : 'AppStoreBank Insights - アプリストア自由化・第三者アプリストア専門メディア'
    
    const description = featuredArticle?.excerpt || featuredArticle?.subtitle || 
      'アプリストア自由化、第三者アプリストア参入の最新情報。2025年12月スマホ新法施行に向けた市場分析・技術解説・法規制情報を専門家が提供。'

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        locale: 'ja_JP',
        url: 'https://insights.appstorebank.com',
        siteName: 'AppStoreBank Insights',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    // フォールバック
    return {
      title: 'AppStoreBank Insights - アプリストア自由化・第三者アプリストア専門メディア',
      description: 'アプリストア自由化、第三者アプリストア参入の最新情報。2025年12月スマホ新法施行に向けた市場分析・技術解説・法規制情報を専門家が提供。',
    }
  }
}

export default function HomePage() {
  return (
    <>
      <Header />
      <BlogHero />
      <Suspense fallback={<div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>}>
        <HomePageContent />
      </Suspense>
      <Footer />
      <ScrollToTopButton />
    </>
  )
}