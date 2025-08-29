import { getArticleBySlug, incrementViewCount, getCategoryDisplayName, loadCategoryMapping } from '@/lib/articles'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import ShareButtons from '@/components/ShareButtons'
import StructuredData from '@/components/StructuredData'
import Breadcrumb, { getArticleBreadcrumb } from '@/components/Breadcrumb'
import { ScrollToTopButtonWithProgress } from '@/components/ScrollToTopButton'
import TableOfContents from '@/components/TableOfContents'
// import MobileTableOfContents from '@/components/MobileTableOfContents' // Hidden to avoid hamburger menu conflict
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ArticleContent from '@/components/ArticleContent'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  
  if (!resolvedParams.slug) {
    return {
      title: 'Article Not Found | AppStoreBank Insights',
    }
  }
  
  const { article } = await getArticleBySlug(resolvedParams.slug)
  
  if (!article) {
    return {
      title: '記事が見つかりません',
    }
  }

  // カテゴリマッピングを読み込み
  await loadCategoryMapping()

  const ogImage = article.cover_image_url || `/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(getCategoryDisplayName(article.category))}`

  return {
    title: article.title,
    description: article.excerpt || article.subtitle || article.title,
    keywords: article.tags,
    authors: [{ name: article.author?.display_name || 'AppStoreBank編集部' }],
    openGraph: {
      title: article.title,
      description: article.excerpt || article.subtitle || article.title,
      type: 'article',
      publishedTime: article.published_at || article.created_at,
      modifiedTime: article.updated_at || article.published_at || article.created_at,
      authors: [article.author?.display_name || 'AppStoreBank編集部'],
      tags: article.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ],
      siteName: 'AppStoreBank Insights',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.subtitle || article.title,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://insights.appstorebank.com/articles/${article.slug}`,
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  if (!resolvedParams.slug) {
    notFound()
  }
  
  const { article, error } = await getArticleBySlug(resolvedParams.slug)

  if (error || !article) {
    notFound()
  }

  // カテゴリマッピングを読み込み
  await loadCategoryMapping()

  // 閲覧数をインクリメント（非同期で実行）
  incrementViewCount(article.id)

  return (
    <div className="min-h-screen bg-white">
      <StructuredData type="article" article={article} />
      <Header />

      {/* Article Hero */}
      {article.cover_image_url && (
        <div className="relative h-96 w-full">
          <img
            src={article.cover_image_url}
            alt={`${article.title} - ${getCategoryDisplayName(article.category)}の記事のカバー画像`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                  {getCategoryDisplayName(article.category)}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {article.title}
              </h1>
              {article.subtitle && (
                <p className="text-xl text-white/90">
                  {article.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb items={getArticleBreadcrumb(article.category, article.title)} />
      </div>

      {/* Article Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Article */}
          <article className="lg:col-span-8">
        {/* Article Meta (if no hero image) */}
        {!article.cover_image_url && (
          <>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                {getCategoryDisplayName(article.category)}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="text-xl text-neutral-600 mb-8">
                {article.subtitle}
              </p>
            )}
          </>
        )}

        {/* Author and Date */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-neutral-200">
          <div className="flex items-center space-x-4">
            {article.author?.avatar_url ? (
              <img
                src={article.author.avatar_url}
                alt={`${article.author.display_name || 'AppStoreBank編集部'}のプロフィール画像`}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-semibold">
                  {article.author?.display_name?.charAt(0) || 'A'}
                </span>
              </div>
            )}
            <div>
              <p className="text-neutral-900 font-medium">
                {article.author?.display_name || 'AppStoreBank編集部'}
              </p>
              <p className="text-sm text-neutral-500">
                {new Date(article.published_at || article.created_at).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className="text-sm text-neutral-500">
            {article.reading_time || 5}分で読めます
          </div>
        </div>

        {/* Premium Badge */}
        {article.is_premium && (
          <div className="mb-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-yellow-800 font-medium">プレミアム記事</span>
            </div>
          </div>
        )}

        {/* Article Content */}
        <ArticleContent 
          content={article.content}
          isPremium={article.is_premium || false}
          articleTitle={article.title}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* External Sources */}
        {article.external_sources && article.external_sources.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">参考・引用元</h3>
            <div className="space-y-2">
              {article.external_sources.map((source, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-neutral-500 mr-2">[{index + 1}]</span>
                  <a 
                    href={source} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline text-sm break-all"
                  >
                    {source}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share Buttons */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <ShareButtons title={article.title} slug={article.slug} />
        </div>
          </article>

          {/* Sidebar with Table of Contents */}
          <aside className="hidden lg:block lg:col-span-4">
            <TableOfContents content={article.content} />
          </aside>
        </div>
      </div>

      {/* Mobile Table of Contents - Hidden to avoid UI conflict with header hamburger menu */}
      {/* <MobileTableOfContents content={article.content} /> */}
      
      {/* Footer */}
      <Footer />
      
      {/* Scroll to Top Button */}
      <ScrollToTopButtonWithProgress />
    </div>
  )
}