import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { ArrowLeft, ChevronRight, Users, Target, Globe, BookOpen, Shield, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About - AppStoreBank Insightsについて',
  description: 'AppStoreBank Insightsは、アプリストア自由化と第三者アプリストア市場の専門メディアです。2025年12月のスマホ新法施行に向けた最新情報を提供します。',
  openGraph: {
    title: 'About - AppStoreBank Insightsについて',
    description: 'アプリストア自由化と第三者アプリストア市場の専門メディア',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://insights.appstorebank.com/about',
    siteName: 'AppStoreBank Insights',
  },
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* パンくずリスト */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  ホーム
                </Link>
              </li>
              <li className="text-gray-400">
                <ChevronRight className="w-4 h-4" />
              </li>
              <li className="text-gray-900 font-medium">About</li>
            </ol>
          </nav>

          {/* ヘッダーセクション */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                AppStoreBank Insights
              </h1>
              <p className="text-xl text-blue-100">
                アプリストア自由化時代の羅針盤
              </p>
            </div>
            
            <div className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  AppStoreBank Insightsは、2025年12月18日に施行される「スマートフォン新法」により実現する
                  アプリストア自由化に向けて、業界関係者に必要な情報を提供する専門メディアです。
                </p>
              </div>
            </div>
          </div>

          {/* ミッション */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">ミッション</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                アプリストア市場の民主化を促進し、開発者と消費者により多くの選択肢を提供することで、
                モバイルエコシステム全体の健全な発展に貢献します。
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-4">
                <Globe className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">ビジョン</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                日本のアプリストア市場における最も信頼される情報源となり、
                グローバル市場との架け橋として業界の発展を支援します。
              </p>
            </div>
          </div>

          {/* 提供する価値 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">提供する価値</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">専門的な分析</h3>
                <p className="text-gray-600 text-sm">
                  法規制の詳細解説から市場動向まで、専門家による深い洞察を提供
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">最新の市場情報</h3>
                <p className="text-gray-600 text-sm">
                  国内外のアプリストア市場の最新動向をリアルタイムでキャッチアップ
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">信頼性の高い情報</h3>
                <p className="text-gray-600 text-sm">
                  公式発表や一次情報に基づく正確で信頼性の高いコンテンツ
                </p>
              </div>
            </div>
          </div>

          {/* 対象読者 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">対象読者</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">主要ターゲット</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>アプリ開発者・開発企業</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>アプリストア事業者</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>投資家・アナリスト</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>規制当局関係者</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">セカンダリターゲット</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>テクノロジー企業の経営層</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>法務・コンプライアンス担当者</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>メディア・ジャーナリスト</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>アプリビジネス関係者</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* カバーする領域 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">カバーする領域</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">市場分析</h3>
                <p className="text-sm text-gray-600">
                  市場規模、シェア、成長率などの定量的分析
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">法規制</h3>
                <p className="text-sm text-gray-600">
                  スマホ新法の詳細解説と影響分析
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">技術動向</h3>
                <p className="text-sm text-gray-600">
                  アプリ配信技術の最新トレンド
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">グローバル</h3>
                <p className="text-sm text-gray-600">
                  海外市場の動向と日本への影響
                </p>
              </div>
            </div>
          </div>

          {/* コンタクト */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">お問い合わせ</h2>
            <p className="text-gray-700 mb-6">
              取材のご依頼、情報提供、その他お問い合わせは以下よりお願いいたします。
            </p>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-900">編集部：</span>
                <span className="text-blue-600">editor@appstorebank.com</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">広告掲載：</span>
                <span className="text-blue-600">ads@appstorebank.com</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">一般問い合わせ：</span>
                <span className="text-blue-600">info@appstorebank.com</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  )
}