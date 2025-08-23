'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import BlogHero from '@/components/BlogHero'
import ArticleCard from '@/components/ArticleCard'
import CategoryFilter from '@/components/CategoryFilter'
import BlogSidebar from '@/components/BlogSidebar'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'

const mockArticles = [
  {
    title: "2025年のアプリストア規制：開発者が知るべき新ルール",
    excerpt: "EU Digital Markets Act、米国の独占禁止法、そして日本のスマホ新法。世界各国で進むアプリストア規制の最新動向を詳しく解説します。",
    category: "法規制",
    publishedAt: "2025-01-18",
    readingTime: "8",
    slug: "app-store-regulation-2025-developer-guide",
    tags: ["DMA", "独占禁止法", "スマホ新法"]
  },
  {
    title: "サードパーティアプリストアのセキュリティ課題と対策",
    excerpt: "複数のアプリストアが競合する時代に、ユーザーと開発者が直面するセキュリティリスクとその対策について技術的な観点から分析します。",
    category: "技術解説",
    publishedAt: "2025-01-15",
    readingTime: "12",
    slug: "third-party-app-store-security",
    tags: ["セキュリティ", "サイドローディング", "技術"]
  },
  {
    title: "App Store手数料30%の終焉？市場競争がもたらす変化",
    excerpt: "アプリストア間の競争激化により、開発者向け手数料体系はどう変わるのか。収益分配モデルの進化を市場分析の視点で予測します。",
    category: "市場分析",
    publishedAt: "2025-01-12",
    readingTime: "10",
    slug: "app-store-commission-competition-analysis",
    tags: ["手数料", "競争", "市場分析"]
  },
  {
    title: "韓国・インドの事例に学ぶ：アプリストア開放の実践",
    excerpt: "すでにアプリストア開放を実施している韓国とインドの事例から、日本が学ぶべき成功要因と課題を詳しく分析します。",
    category: "グローバルトレンド",
    publishedAt: "2025-01-10",
    readingTime: "15",
    slug: "korea-india-app-store-liberalization-case-study",
    tags: ["韓国", "インド", "事例研究"]
  },
  {
    title: "開発者必見：複数アプリストア対応の技術的要件",
    excerpt: "複数のアプリストアへの配信に必要な技術的準備、APIの差異、配信フローの違いについて実践的なガイドを提供します。",
    category: "技術解説",
    publishedAt: "2025-01-08",
    readingTime: "18",
    slug: "multi-app-store-technical-requirements",
    tags: ["API", "配信", "開発"]
  },
  {
    title: "Epic vs Apple判決の影響：ゲーム業界の新たな展望",
    excerpt: "Epic Games対Appleの法廷闘争が業界に与えた影響と、ゲーム開発者にとっての新たなビジネス機会について分析します。",
    category: "市場分析",
    publishedAt: "2025-01-05",
    readingTime: "13",
    slug: "epic-apple-verdict-gaming-industry-impact",
    tags: ["Epic", "Apple", "ゲーム業界"]
  }
]

const categories = ['すべて', '市場分析', 'グローバルトレンド', '法規制', '技術解説', 'ニュース']

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('すべて')
  
  // カテゴリによる記事フィルタリング
  const filteredArticles = activeCategory === 'すべて' 
    ? mockArticles 
    : mockArticles.filter(article => article.category === activeCategory)
  return (
    <>
      <Header />
      <main className="flex-1">
        <BlogHero />
        
        {/* Main Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3 space-y-8">
                <CategoryFilter 
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  articles={mockArticles}
                />
                
                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.slug} {...article} />
                  ))}
                </div>

                {/* No results */}
                {filteredArticles.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-medium text-neutral-800 mb-2">
                      {activeCategory}の記事はまだありません
                    </h3>
                    <p className="text-neutral-600">
                      他のカテゴリをお試しください
                    </p>
                  </div>
                )}

                {/* Load More */}
                <div className="text-center">
                  <button className="inline-flex items-center px-8 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium rounded-lg transition-colors">
                    さらに記事を読み込む
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <BlogSidebar />
              </div>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </>
  )
}