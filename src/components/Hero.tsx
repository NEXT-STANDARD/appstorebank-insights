export default function Hero() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-secondary-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-gradient rounded-2xl text-4xl">
            🔍
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance text-neutral-800">
          業界洞察メディア
        </h1>
        
        <p className="text-xl md:text-2xl text-neutral-600 mb-4 text-balance">
          アプリストア市場の深層分析とトレンド予測
        </p>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center px-6 py-3 bg-primary-gradient rounded-full text-sm font-semibold uppercase tracking-wider mb-8 shadow-lg text-white">
          Coming Soon
        </div>

        {/* Description */}
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          アプリストア業界の専門家による深い洞察、市場トレンド分析、そして開発者・ビジネスリーダーが知るべき重要な情報を提供します。スマホ新法の影響から、グローバル市場の動向まで、質の高いコンテンツをお届けします。
        </p>

        {/* Content Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="font-semibold text-lg mb-2 text-neutral-800">市場分析レポート</h3>
            <p className="text-neutral-600 text-sm">詳細なデータと専門的な分析による、アプリストア市場の現状と将来予測</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="text-3xl mb-4">🌏</div>
            <h3 className="font-semibold text-lg mb-2 text-neutral-800">グローバルトレンド</h3>
            <p className="text-neutral-600 text-sm">世界各国の規制動向、中国・欧州・米国の事例研究と日本への影響分析</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="text-3xl mb-4">⚖️</div>
            <h3 className="font-semibold text-lg mb-2 text-neutral-800">法規制解説</h3>
            <p className="text-neutral-600 text-sm">スマホ新法の詳細解説と、開発者・事業者への具体的な影響と対策</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="text-3xl mb-4">🔧</div>
            <h3 className="font-semibold text-lg mb-2 text-neutral-800">技術深層解説</h3>
            <p className="text-neutral-600 text-sm">アプリストア構築の技術的要件、セキュリティ対策、運営ノウハウ</p>
          </div>
        </div>
      </div>
    </section>
  )
}