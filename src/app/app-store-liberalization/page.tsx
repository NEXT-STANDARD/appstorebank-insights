import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'アプリストア自由化とは？2025年スマホ新法で何が変わる？完全解説 | AppStoreBank Insights',
  description: '2025年12月18日施行のスマホ新法により、日本でもアプリストア自由化が始まります。第三者アプリストアの参入、開発者への影響、ユーザーメリットを詳しく解説。',
  keywords: [
    'アプリストア自由化',
    'スマホ新法', 
    '第三者アプリストア',
    'アプリストア競争',
    'DMA',
    'デジタル市場',
    '2025年',
    '12月18日'
  ],
  openGraph: {
    title: 'アプリストア自由化完全ガイド - 2025年スマホ新法の全て',
    description: '日本のアプリストア市場が大きく変わる2025年12月18日。開発者・ユーザー双方への影響を専門家が徹底解説',
    type: 'article',
    images: [
      {
        url: '/api/og?title=アプリストア自由化完全ガイド&category=市場分析',
        width: 1200,
        height: 630,
      }
    ],
  },
  alternates: {
    canonical: 'https://insights.appstorebank.com/app-store-liberalization',
  }
}

export default function AppStoreLiberalizationPage() {
  const timeline = [
    { date: '2024年4月', event: 'スマホソフトウェア競争促進法案国会提出' },
    { date: '2024年6月', event: 'スマホ新法成立' },
    { date: '2025年6月', event: '対象企業指定（Apple、Google、iTunes株式会社）' },
    { date: '2025年12月18日', event: 'スマホ新法全面施行開始' },
    { date: '2026年以降', event: '第三者アプリストア本格参入期' },
  ]

  const benefits = [
    {
      title: '開発者の手数料負担軽減',
      description: 'Apple・Google以外の選択肢により、手数料競争が激化。現在の30%から大幅な削減が期待される。',
      impact: '高'
    },
    {
      title: '審査プロセスの多様化',
      description: '各アプリストアが独自の審査基準を設定。開発者により適したプラットフォームを選択可能。',
      impact: '中'
    },
    {
      title: '決済システムの選択の自由',
      description: '外部決済システムの利用が可能になり、決済手数料の最適化が実現。',
      impact: '高'
    },
    {
      title: 'イノベーションの促進',
      description: '競争により新しいサービスや機能の開発が加速。ユーザー体験の向上が期待。',
      impact: '中'
    },
  ]

  const challenges = [
    {
      title: 'セキュリティリスクの増大',
      description: 'アプリストアの数が増えることで、悪意のあるアプリの流通リスクが高まる可能性。',
      solution: '厳格な審査システムと継続的なモニタリング体制の構築'
    },
    {
      title: 'ユーザーの混乱',
      description: '複数のアプリストアから選択する必要があり、初期は混乱が生じる可能性。',
      solution: '分かりやすい比較情報とガイドラインの提供'
    },
    {
      title: '開発・維持コストの増加',
      description: '複数プラットフォームへの対応により、開発者の負担が一時的に増加。',
      solution: 'クロスプラットフォーム対応ツールの活用と段階的移行'
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              アプリストア自由化とは？
            </h1>
            <p className="text-xl text-neutral-700 mb-8 max-w-3xl mx-auto">
              2025年12月18日施行の「スマホソフトウェア競争促進法」により、日本のアプリストア市場が大きく変わります。
              第三者アプリストアの参入で何が変わるのか、専門家が詳しく解説します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#timeline"
                className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                実施スケジュールを見る
              </Link>
              <Link
                href="#impact"
                className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
              >
                影響を詳しく知る
              </Link>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">アプリストア自由化とは</h2>
              
              <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                <strong>アプリストア自由化</strong>とは、現在Apple App StoreやGoogle Play Storeが独占している
                モバイルアプリの配信市場に、第三者企業のアプリストアが参入できるようになる制度変更のことです。
              </p>

              <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                日本では2025年12月18日に「スマホソフトウェア競争促進法」が施行され、
                一定規模以上のプラットフォーム事業者（Apple、Google、iTunes株式会社）に対して、
                外部アプリストアからのアプリインストールを認める義務が課されます。
              </p>

              <div className="bg-primary-50 border-l-4 border-primary-600 p-6 my-8">
                <h3 className="text-lg font-bold text-primary-900 mb-2">🎯 なぜ今、自由化が必要なのか？</h3>
                <p className="text-primary-800">
                  現在のモバイルアプリ市場は、Apple・Googleの2社による寡占状態にあります。
                  これにより、高額な手数料（最大30%）や厳格な審査制度が課され、
                  開発者の選択肢が限られているのが現状です。自由化により、
                  競争促進とイノベーションの加速が期待されています。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section id="timeline" className="py-16 bg-neutral-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">実施スケジュール</h2>
            
            <div className="relative">
              {/* タイムライン線 */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-300"></div>
              
              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-start mb-8 last:mb-0">
                  {/* タイムライン点 */}
                  <div className="absolute left-6 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-sm"></div>
                  
                  <div className="ml-16">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                      <div className="text-sm font-medium text-primary-600 mb-1">{item.date}</div>
                      <div className="text-lg font-semibold text-neutral-900">{item.event}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="impact" className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">期待される効果・メリット</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-neutral-900">{benefit.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      benefit.impact === '高' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      インパクト: {benefit.impact}
                    </span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Challenges */}
        <section className="py-16 bg-neutral-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">課題と対策</h2>
            
            <div className="space-y-8">
              {challenges.map((challenge, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
                  <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    {challenge.title}
                  </h3>
                  <p className="text-neutral-600 mb-4 ml-11">{challenge.description}</p>
                  <div className="ml-11 bg-green-50 border-l-4 border-green-400 p-4">
                    <h4 className="font-semibold text-green-800 mb-2">💡 対策案</h4>
                    <p className="text-green-700">{challenge.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              アプリストア市場の最新動向を追跡
            </h2>
            <p className="text-xl text-white/90 mb-8">
              変化が激しいアプリストア業界の情報を、専門家が分析してお届けします
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Link 
                href="/?category=law_regulation" 
                className="bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/20 transition-colors"
              >
                <h3 className="text-white font-bold mb-2">法規制情報</h3>
                <p className="text-white/80 text-sm">最新の法令・規制動向</p>
              </Link>
              
              <Link 
                href="/?category=tech_deep_dive" 
                className="bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/20 transition-colors"
              >
                <h3 className="text-white font-bold mb-2">技術解説</h3>
                <p className="text-white/80 text-sm">実装レベルの詳細解説</p>
              </Link>
              
              <Link 
                href="/?category=market_analysis" 
                className="bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/20 transition-colors"
              >
                <h3 className="text-white font-bold mb-2">市場分析</h3>
                <p className="text-white/80 text-sm">データに基づく市場予測</p>
              </Link>
            </div>

            <Link
              href="/#newsletter"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-neutral-50 transition-colors"
            >
              ニュースレターで最新情報を受け取る
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}