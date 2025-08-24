import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SponsorsPage() {
  const sponsors = [
    {
      id: 1,
      name: "TechFlow Solutions",
      description: "アプリ開発を効率化する次世代プラットフォーム",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
      website: "#",
      category: "開発ツール"
    },
    {
      id: 2,
      name: "CloudStore Enterprise",
      description: "企業向けアプリストア構築サービス",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
      website: "#",
      category: "インフラ"
    },
    {
      id: 3,
      name: "AppAnalytics Pro",
      description: "高度なアプリ分析とユーザー行動解析",
      logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
      website: "#",
      category: "分析ツール"
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">
            スポンサー・パートナー企業
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            AppStoreBank Insightsを支援していただいているパートナー企業をご紹介します。
            これらの企業は、アプリエコシステムの発展に貢献する優れたソリューションを提供しています。
          </p>
        </div>

        {/* Trust Badge */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-12">
          <div className="flex items-center justify-center space-x-4 text-sm text-neutral-600">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>厳選されたパートナー</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>品質保証済み</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
              </svg>
              <span>開発者支援</span>
            </div>
          </div>
        </div>

        {/* Sponsors Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              {/* Logo */}
              <div className="aspect-[2/1] overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                    {sponsor.category}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-neutral-800 mb-3">
                  {sponsor.name}
                </h3>

                {/* Description */}
                <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                  {sponsor.description}
                </p>

                {/* CTA */}
                <a
                  href={sponsor.website}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors group"
                >
                  詳しく見る
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl shadow-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            パートナーシップにご興味がある企業様へ
          </h2>
          <p className="text-xl mb-6 text-white/90">
            AppStoreBank Insightsと一緒に、アプリエコシステムの未来を創りませんか？
          </p>
          <a
            href="mailto:partnerships@appstorebank.com"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-neutral-50 transition-colors"
          >
            パートナーシップについて相談する
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}