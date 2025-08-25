import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'アプリストア一覧・比較 2025年版 | 第三者アプリストアまとめ',
  description: '2025年12月スマホ新法施行後に利用可能な第三者アプリストア一覧。Google Play、App Store以外の選択肢を比較・まとめ。手数料、機能、対応デバイスを詳しく解説。',
  keywords: [
    'アプリストア一覧',
    'アプリストアまとめ',
    'アプリストア比較',
    '第三者アプリストア',
    'サードパーティアプリストア',
    'アプリストア手数料',
    'アプリストア選び方',
    'スマホ新法',
    'アプリストア自由化'
  ],
  openGraph: {
    title: 'アプリストア一覧・比較 2025年版 | 第三者アプリストアまとめ',
    description: '日本で利用可能なすべてのアプリストアを網羅。手数料、機能、特徴を徹底比較。',
    type: 'website',
  }
}

// 仮のデータ（将来的にはSupabaseから取得）
const appStores = [
  {
    id: '1',
    name: 'Google Play Store',
    company: 'Google',
    logo: '🟢',
    status: 'available',
    commission: '15-30%',
    features: ['広大なアプリ数', 'Google決済統合', 'ファミリーリンク'],
    devices: ['Android'],
    url: 'https://play.google.com',
    description: '世界最大のAndroidアプリストア。300万以上のアプリを提供。',
    launchDate: '2008年10月',
    isThirdParty: false
  },
  {
    id: '2', 
    name: 'App Store',
    company: 'Apple',
    logo: '🔵',
    status: 'available',
    commission: '15-30%',
    features: ['厳格な審査', 'Apple決済', 'ファミリー共有'],
    devices: ['iOS', 'iPadOS'],
    url: 'https://apps.apple.com',
    description: 'iOSデバイス専用の公式アプリストア。高品質なアプリを厳選。',
    launchDate: '2008年7月',
    isThirdParty: false
  },
  {
    id: '3',
    name: 'Amazon Appstore',
    company: 'Amazon',
    logo: '🟠',
    status: 'coming_soon',
    commission: '20-30%',
    features: ['Amazonコイン', 'Fire TV対応', 'テスト配信'],
    devices: ['Android', 'Fire OS'],
    url: 'https://www.amazon.com/appstore',
    description: 'Amazon独自のアプリストア。2025年12月日本展開予定。',
    launchDate: '2025年12月予定',
    isThirdParty: true
  },
  {
    id: '4',
    name: 'Samsung Galaxy Store',
    company: 'Samsung',
    logo: '🔷',
    status: 'coming_soon',
    commission: '30%',
    features: ['Galaxy限定機能', 'ウォッチアプリ', 'テーマストア'],
    devices: ['Samsung Galaxy'],
    url: 'https://galaxystore.samsung.com',
    description: 'Galaxy端末向け最適化アプリを提供。日本展開準備中。',
    launchDate: '2025年12月予定',
    isThirdParty: true
  },
  {
    id: '5',
    name: 'Epic Games Store',
    company: 'Epic Games',
    logo: '⚫',
    status: 'planning',
    commission: '12%',
    features: ['低手数料', 'クリエイター支援', 'Unreal Engine統合'],
    devices: ['Android', 'iOS（予定）'],
    url: 'https://store.epicgames.com',
    description: 'ゲーム特化型ストア。業界最低水準の手数料で話題。',
    launchDate: '2026年予定',
    isThirdParty: true
  },
  {
    id: '6',
    name: 'Microsoft Store',
    company: 'Microsoft',
    logo: '🟦',
    status: 'planning',
    commission: '12-15%',
    features: ['Xbox統合', 'PWA対応', 'エンタープライズ向け'],
    devices: ['Android', 'Windows'],
    url: 'https://apps.microsoft.com',
    description: 'Microsoft 365やXboxとの連携が特徴。モバイル展開検討中。',
    launchDate: '未定',
    isThirdParty: true
  }
]

const statusColors = {
  available: 'bg-green-100 text-green-800',
  coming_soon: 'bg-yellow-100 text-yellow-800',
  planning: 'bg-gray-100 text-gray-800'
}

const statusLabels = {
  available: '利用可能',
  coming_soon: '準備中',
  planning: '計画中'
}

export default function AppStoresPage() {
  const availableStores = appStores.filter(s => s.status === 'available')
  const comingSoonStores = appStores.filter(s => s.status === 'coming_soon')
  const planningStores = appStores.filter(s => s.status === 'planning')

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070')`,
              filter: 'brightness(0.4)'
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              アプリストア完全ガイド 2025
            </h1>
            <p className="text-xl text-white/90 max-w-3xl">
              スマホ新法施行で変わる日本のアプリ配信。
              第三者アプリストアを含む、すべての選択肢を徹底比較。
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-3xl font-bold">{appStores.length}</span>
                <span className="ml-2">ストア掲載中</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-3xl font-bold">{appStores.filter(s => s.isThirdParty).length}</span>
                <span className="ml-2">第三者ストア</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-3xl font-bold">2025.12</span>
                <span className="ml-2">法施行予定</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="py-8 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2">
              <Link href="#available" className="px-4 py-2 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors">
                ✅ 利用可能なストア
              </Link>
              <Link href="#coming-soon" className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full hover:bg-yellow-100 transition-colors">
                🔜 準備中のストア
              </Link>
              <Link href="#planning" className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
                📝 計画中のストア
              </Link>
              <Link href="#comparison" className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 transition-colors">
                📊 手数料比較
              </Link>
              <Link href="#faq" className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors">
                ❓ よくある質問
              </Link>
            </div>
          </div>
        </section>

        {/* Available Stores */}
        <section id="available" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">現在利用可能なアプリストア</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {availableStores.map(store => (
                <div key={store.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-4xl mr-3">{store.logo}</span>
                      <div>
                        <h3 className="text-xl font-bold">{store.name}</h3>
                        <p className="text-sm text-neutral-600">{store.company}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[store.status]}`}>
                      {statusLabels[store.status]}
                    </span>
                  </div>
                  <p className="text-neutral-700 mb-4">{store.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-2">手数料:</span>
                      <span className="text-neutral-600">{store.commission}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-2">対応:</span>
                      <span className="text-neutral-600">{store.devices.join(', ')}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {store.features.map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a href={store.url} target="_blank" rel="noopener noreferrer" 
                     className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
                    詳細を見る →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon Stores */}
        <section id="coming-soon" className="relative py-16">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=2074')`
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">🚀 2025年12月開始予定の第三者アプリストア</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {comingSoonStores.map(store => (
                <div key={store.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-yellow-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-4xl mr-3">{store.logo}</span>
                      <div>
                        <h3 className="text-xl font-bold">{store.name}</h3>
                        <p className="text-sm text-neutral-600">{store.company}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[store.status]}`}>
                      {statusLabels[store.status]}
                    </span>
                  </div>
                  <p className="text-neutral-700 mb-4">{store.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-2">手数料:</span>
                      <span className="text-neutral-600">{store.commission}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-2">開始予定:</span>
                      <span className="text-yellow-700 font-bold">{store.launchDate}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {store.features.map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Planning Stores */}
        <section id="planning" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">📋 参入検討中のアプリストア</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {planningStores.map(store => (
                <div key={store.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow opacity-75">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-4xl mr-3">{store.logo}</span>
                      <div>
                        <h3 className="text-xl font-bold">{store.name}</h3>
                        <p className="text-sm text-neutral-600">{store.company}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[store.status]}`}>
                      {statusLabels[store.status]}
                    </span>
                  </div>
                  <p className="text-neutral-700 mb-4">{store.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-2">予定手数料:</span>
                      <span className="text-neutral-600">{store.commission}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-2">開始時期:</span>
                      <span className="text-neutral-600">{store.launchDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section id="comparison" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">📊 アプリストア手数料比較表</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-neutral-100">
                    <th className="border border-neutral-300 px-4 py-3 text-left">ストア名</th>
                    <th className="border border-neutral-300 px-4 py-3 text-center">基本手数料</th>
                    <th className="border border-neutral-300 px-4 py-3 text-center">小規模事業者</th>
                    <th className="border border-neutral-300 px-4 py-3 text-center">サブスク（1年目）</th>
                    <th className="border border-neutral-300 px-4 py-3 text-center">サブスク（2年目〜）</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-neutral-300 px-4 py-3 font-medium">Google Play</td>
                    <td className="border border-neutral-300 px-4 py-3 text-center">30%</td>
                    <td className="border border-neutral-300 px-4 py-3 text-center">15%</td>
                    <td className="border border-neutral-300 px-4 py-3 text-center">30%</td>
                    <td className="border border-neutral-300 px-4 py-3 text-center">15%</td>
                  </tr>
                  <tr className="bg-neutral-50">
                    <td className="border border-neutral-300 px-4 py-3 font-medium">App Store</td>
                    <td className="border border-neutral-300 px-4 py-3 text-center">30%</td>
                    <td className="border border-neutral-300 px-4 py-3 text-center">15%</td>
                    <td className="border border-neutral-300 px-4 py-3 text-center">30%</td>
                    <td className="border border-neutral-300 px-4 py-3 text-center">15%</td>
                  </tr>
                  <tr>
                    <td className="border border-neutral-300 px-4 py-3 font-medium">Epic Games</td>
                    <td className="border border-neutral-300 px-4 py-3 text-center text-green-600 font-bold">12%</td>
                    <td className="border border-neutral-300 px-4 py-3 text-center text-green-600 font-bold">12%</td>
                    <td className="border border-neutral-300 px-4 py-3 text-center text-green-600 font-bold">12%</td>
                    <td className="border border-neutral-300 px-4 py-3 text-center text-green-600 font-bold">12%</td>
                  </tr>
                  <tr className="bg-neutral-50">
                    <td className="border border-neutral-300 px-4 py-3 font-medium">Microsoft Store</td>
                    <td className="border border-neutral-300 px-4 py-3 text-center">15%</td>
                    <td className="border border-neutral-300 px-4 py-3 text-center text-green-600 font-bold">12%</td>
                    <td className="border border-neutral-300 px-4 py-3 text-center">15%</td>
                    <td className="border border-neutral-300 px-4 py-3 text-center text-green-600 font-bold">12%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-neutral-600">
              ※ 小規模事業者：年間収益100万ドル未満の開発者
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">よくある質問</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">Q: 第三者アプリストアとは何ですか？</h3>
                <p className="text-neutral-700">
                  A: Google PlayやApp Store以外の企業が運営するアプリ配信プラットフォームです。
                  2025年12月のスマホ新法施行により、日本でも正式に利用可能になります。
                </p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">Q: 第三者アプリストアは安全ですか？</h3>
                <p className="text-neutral-700">
                  A: 各ストアが独自のセキュリティ対策を実施しています。
                  大手企業が運営するストアは、適切な審査プロセスとマルウェア対策を導入しています。
                </p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">Q: 開発者にとってのメリットは？</h3>
                <p className="text-neutral-700">
                  A: 手数料の削減、審査基準の多様化、独自の決済システムの利用など、
                  より柔軟な選択肢が得られます。Epic Gamesストアは12%という低手数料を実現しています。
                </p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">Q: いつから使えるようになりますか？</h3>
                <p className="text-neutral-700">
                  A: 2025年12月18日のスマホ新法施行と同時に、複数の第三者アプリストアが
                  日本市場に参入予定です。一部は既に準備を進めています。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 text-white">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=2070')`,
              filter: 'brightness(0.3)'
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              アプリストア自由化の最新情報をお届け
            </h2>
            <p className="text-xl mb-8 text-white/90">
              新しいアプリストアの参入情報、手数料の変更、機能アップデートなど
              開発者に必要な情報をいち早くお伝えします。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/app-store-liberalization" 
                    className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-neutral-100 transition-colors">
                アプリストア自由化について詳しく
              </Link>
              <Link href="/" 
                    className="bg-white/20 backdrop-blur-sm text-white border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white/30 transition-colors">
                最新記事を読む
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}