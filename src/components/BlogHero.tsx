import Link from 'next/link'
import Image from 'next/image'

interface FeaturedArticle {
  title: string
  excerpt: string
  category: string
  publishedAt: string
  readingTime: string
  slug: string
  thumbnail?: string
  author: {
    name: string
    avatar?: string
  }
}

interface BlogHeroProps {
  featuredArticle?: FeaturedArticle
}

const mockFeaturedArticle: FeaturedArticle = {
  title: "アプリストア新時代：日本のスマートフォン市場に起こる革命的変化",
  excerpt: "2025年、日本でもついにアプリストアの競争が本格化します。スマートフォン利用者が複数のアプリストアから選択できるようになることで、開発者、ユーザー、そして業界全体にどのような変化をもたらすのか。専門家の視点から詳しく解説します。",
  category: "市場分析",
  publishedAt: "2025-01-20",
  readingTime: "12",
  slug: "smartphone-market-revolution-japan-2025",
  thumbnail: "/images/featured-article.jpg",
  author: {
    name: "AppStoreBank編集部",
    avatar: "/images/appstorebank-avatar.png"
  }
}

export default function BlogHero({ featuredArticle = mockFeaturedArticle }: BlogHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            AppStoreBank Insights
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            アプリストア業界の最新動向、市場分析、技術解説をお届けする専門メディア
          </p>
        </div>

        {/* Featured Article */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
          <div className="md:flex">
            {/* Image */}
            <div className="md:w-1/2">
              <div className="aspect-[16/10] md:aspect-auto md:h-full relative overflow-hidden">
                {featuredArticle.thumbnail ? (
                  <Image
                    src={featuredArticle.thumbnail}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <div className="text-8xl opacity-30">📊</div>
                  </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg shadow-lg">
                    注目記事
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center space-x-2 text-sm text-primary-600 font-medium mb-3">
                <span className="px-3 py-1 bg-primary-100 rounded-full">{featuredArticle.category}</span>
                <span>•</span>
                <span>{new Date(featuredArticle.publishedAt).toLocaleDateString('ja-JP')}</span>
                <span>•</span>
                <span>{featuredArticle.readingTime}分で読める</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4 leading-tight">
                <Link href={`/articles/${featuredArticle.slug}`} className="hover:text-primary-600 transition-colors">
                  {featuredArticle.title}
                </Link>
              </h2>

              <p className="text-neutral-600 text-lg leading-relaxed mb-6 line-clamp-4">
                {featuredArticle.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {featuredArticle.author.avatar ? (
                    <Image
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">
                        {featuredArticle.author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{featuredArticle.author.name}</p>
                    <p className="text-xs text-neutral-500">編集部</p>
                  </div>
                </div>

                <Link
                  href={`/articles/${featuredArticle.slug}`}
                  className="inline-flex items-center px-6 py-3 bg-primary-gradient text-white font-medium rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                >
                  続きを読む
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">120+</div>
            <div className="text-neutral-600 text-sm">分析記事</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary-600">25+</div>
            <div className="text-neutral-600 text-sm">専門解説</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-mint">10k+</div>
            <div className="text-neutral-600 text-sm">月間読者</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-peach">95%</div>
            <div className="text-neutral-600 text-sm">満足度</div>
          </div>
        </div>
      </div>
    </section>
  )
}