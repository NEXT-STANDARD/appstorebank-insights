import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import Link from 'next/link'

// Hardcoded app store data
interface AppStoreDetails {
  slug: string
  name: string
  company: string
  logoEmoji: string
  status: 'available' | 'coming_soon' | 'planning'
  commissionRate: string
  smallBusinessRate?: string
  subscriptionRate?: string
  launchDate?: string
  description: string
  features: string[]
  benefits: string[]
  developerResources: {
    title: string
    description: string
    link?: string
  }[]
  submissionProcess: {
    title: string
    description: string
  }[]
  supportedDevices: string[]
  websiteUrl: string
  developerPortalUrl?: string
  minimumRequirements?: string[]
  reviewTime?: string
  countries: string[]
  paymentMethods?: string[]
}

const APP_STORES: Record<string, AppStoreDetails> = {
  'google-play': {
    slug: 'google-play',
    name: 'Google Play Store',
    company: 'Google LLC',
    logoEmoji: '🏪',
    status: 'available',
    commissionRate: '30%（基本手数料）',
    smallBusinessRate: '15%（年間売上$100万以下）',
    subscriptionRate: '15%（2年目以降）',
    launchDate: '2008年10月',
    description: 'Androidデバイス向けの世界最大級のアプリ配信プラットフォーム。200以上の国と地域でサービスを展開し、25億人以上のユーザーが利用しています。',
    features: [
      'Google Play Console',
      'アプリ署名管理',
      'A/Bテスト機能',
      'リアルタイム分析',
      'クラッシュレポート',
      'ユーザーレビュー管理',
      '段階的リリース',
      'プリオーダー機能'
    ],
    benefits: [
      '世界最大のAndroidユーザーベース',
      '豊富な分析ツール',
      '自動アップデート機能',
      '多言語・多通貨対応',
      'Google広告との連携',
      'Firebase統合'
    ],
    developerResources: [
      {
        title: 'Google Play Console',
        description: 'アプリの公開、管理、分析を行う総合ダッシュボード',
        link: 'https://play.google.com/console'
      },
      {
        title: 'Android Developers',
        description: '開発ガイド、API リファレンス、ベストプラクティス',
        link: 'https://developer.android.com'
      },
      {
        title: 'Play Academy',
        description: 'アプリビジネス成功のための無料オンライン学習プラットフォーム',
        link: 'https://playacademy.exceedlms.com'
      },
      {
        title: 'Google Play ポリシーセンター',
        description: 'アプリ審査ガイドラインと違反対応について',
        link: 'https://support.google.com/googleplay/android-developer/topic/9858052'
      }
    ],
    submissionProcess: [
      {
        title: '1. Google Play Console アカウント作成',
        description: '開発者登録料$25（一回限り）を支払い、アカウントを作成します。'
      },
      {
        title: '2. アプリの準備',
        description: 'APKまたはAABファイルを用意し、アプリの詳細情報を準備します。'
      },
      {
        title: '3. ストア掲載情報の入力',
        description: 'アプリ名、説明文、スクリーンショット、アイコンなどを設定します。'
      },
      {
        title: '4. 価格設定とリリース範囲',
        description: '価格（無料/有料）と配信する国・地域を選択します。'
      },
      {
        title: '5. 審査とリリース',
        description: 'Googleの審査を受け、承認後に自動的にストアに公開されます。'
      }
    ],
    supportedDevices: ['Android スマートフォン', 'Android タブレット', 'Wear OS', 'Android TV', 'Chrome OS'],
    websiteUrl: 'https://play.google.com',
    developerPortalUrl: 'https://play.google.com/console',
    minimumRequirements: [
      'Android 4.4 (API level 19) 以上をサポート',
      'Google Play services への対応',
      'アプリ署名の設定'
    ],
    reviewTime: '平均1-3日（初回は最大7日）',
    countries: ['世界200以上の国と地域'],
    paymentMethods: ['Google Pay', 'クレジットカード', 'デビットカード', 'キャリア決済', 'ギフトカード']
  },

  'app-store': {
    slug: 'app-store',
    name: 'Apple App Store',
    company: 'Apple Inc.',
    logoEmoji: '🍎',
    status: 'available',
    commissionRate: '30%（基本手数料）',
    smallBusinessRate: '15%（年間売上$100万以下）',
    subscriptionRate: '15%（2年目以降）',
    launchDate: '2008年7月',
    description: 'iPhone、iPad、Mac、Apple Watch、Apple TV向けのアプリを配信するApple公式プラットフォーム。高品質なアプリとセキュリティで知られ、世界175以上の国と地域でサービスを展開しています。',
    features: [
      'App Store Connect',
      'TestFlight ベータ版テスト',
      'App Analytics',
      'App Store 最適化ツール',
      'アプリ内購入管理',
      'ファミリー共有対応',
      'Sign in with Apple',
      'StoreKit 統合'
    ],
    benefits: [
      'プレミアムユーザーベース',
      '高いアプリ収益性',
      'プライバシー重視の環境',
      'Apple エコシステム統合',
      '厳格な品質管理',
      'グローバル決済システム'
    ],
    developerResources: [
      {
        title: 'App Store Connect',
        description: 'アプリの提出、管理、分析を行うApple公式ツール',
        link: 'https://appstoreconnect.apple.com'
      },
      {
        title: 'Apple Developer Documentation',
        description: 'iOS、iPadOS、macOS開発の包括的ガイド',
        link: 'https://developer.apple.com/documentation'
      },
      {
        title: 'Human Interface Guidelines',
        description: 'Appleプラットフォーム向けUIデザインガイドライン',
        link: 'https://developer.apple.com/design/human-interface-guidelines'
      },
      {
        title: 'App Store Review Guidelines',
        description: 'アプリ審査の詳細なガイドラインと要件',
        link: 'https://developer.apple.com/app-store/review/guidelines'
      }
    ],
    submissionProcess: [
      {
        title: '1. Apple Developer Program 登録',
        description: '年会費$99を支払い、開発者アカウントを作成します。'
      },
      {
        title: '2. アプリの開発とテスト',
        description: 'Xcodeを使用してアプリを開発し、TestFlightでベータテストを実施します。'
      },
      {
        title: '3. App Store Connect でアプリ情報入力',
        description: 'アプリの詳細情報、スクリーンショット、説明文などを入力します。'
      },
      {
        title: '4. アプリバイナリのアップロード',
        description: 'XcodeまたはTransporter を使用してアプリファイルをアップロードします。'
      },
      {
        title: '5. 審査とリリース',
        description: 'Appleの厳格な審査を経て、承認後にApp Store に公開されます。'
      }
    ],
    supportedDevices: ['iPhone', 'iPad', 'Mac', 'Apple Watch', 'Apple TV'],
    websiteUrl: 'https://www.apple.com/app-store',
    developerPortalUrl: 'https://developer.apple.com',
    minimumRequirements: [
      'iOS 12.0 以上をサポート（推奨）',
      '64ビットアーキテクチャ対応',
      'App Transport Security (ATS) 準拠'
    ],
    reviewTime: '平均24-48時間（複雑な場合は最大7日）',
    countries: ['世界175以上の国と地域'],
    paymentMethods: ['Apple Pay', 'クレジットカード', 'App Store ギフトカード', 'キャリア決済（一部地域）']
  },

  'samsung-galaxy-store': {
    slug: 'samsung-galaxy-store',
    name: 'Samsung Galaxy Store',
    company: 'Samsung Electronics',
    logoEmoji: '📱',
    status: 'available',
    commissionRate: '30%（基本手数料）',
    smallBusinessRate: '20%（年間売上$100万以下）',
    launchDate: '2009年9月',
    description: 'Samsung Galaxy デバイス専用のアプリストア。One UI との高度な統合により、Galaxy ユーザーに最適化されたアプリ体験を提供します。',
    features: [
      'Samsung Developer Console',
      'Galaxy 専用機能統合',
      'S Pen 最適化アプリ',
      'Galaxy Watch アプリ',
      'DeX モード対応',
      'One UI テーマ',
      'Bixby 統合',
      'Samsung Pay 統合'
    ],
    benefits: [
      'Galaxy デバイス最適化',
      '競合の少ないマーケット',
      'Samsung 独自機能活用',
      '韓国・東南アジア市場強み',
      'デバイス連携機能',
      'プリインストール機会'
    ],
    developerResources: [
      {
        title: 'Samsung Developers',
        description: 'Galaxy デバイス向け開発の総合ポータル',
        link: 'https://developer.samsung.com'
      },
      {
        title: 'Galaxy Store Developer Console',
        description: 'アプリの公開と管理を行う開発者向けダッシュボード'
      },
      {
        title: 'One UI デザインガイド',
        description: 'Samsung One UI に最適化されたデザインガイドライン'
      },
      {
        title: 'Galaxy SDK',
        description: 'S Pen、DeX、Multi Window などの Galaxy 独自機能を活用するためのSDK'
      }
    ],
    submissionProcess: [
      {
        title: '1. Samsung Developer アカウント作成',
        description: '無料でSamsung Developers にアカウントを登録します。'
      },
      {
        title: '2. Galaxy Store 開発者登録',
        description: 'Galaxy Store でのアプリ配信のために開発者として登録します。'
      },
      {
        title: '3. アプリのテストと最適化',
        description: 'Galaxy デバイスでの動作確認と One UI との互換性をテストします。'
      },
      {
        title: '4. ストア情報の入力',
        description: 'アプリ説明、スクリーンショット、評価情報などを入力します。'
      },
      {
        title: '5. 審査とリリース',
        description: 'Samsung の審査を経て、Galaxy Store に公開されます。'
      }
    ],
    supportedDevices: ['Galaxy スマートフォン', 'Galaxy タブレット', 'Galaxy Watch', 'Galaxy Buds'],
    websiteUrl: 'https://www.samsung.com/us/support/mobile-devices/galaxy-store',
    developerPortalUrl: 'https://developer.samsung.com',
    minimumRequirements: [
      'Android 6.0 以上',
      'One UI 互換性',
      'Galaxy デバイス最適化推奨'
    ],
    reviewTime: '平均3-5営業日',
    countries: ['190以上の国と地域（Galaxy デバイス販売地域）'],
    paymentMethods: ['Samsung Pay', 'Google Pay', 'クレジットカード', 'キャリア決済']
  },

  'amazon-appstore': {
    slug: 'amazon-appstore',
    name: 'Amazon Appstore',
    company: 'Amazon.com, Inc.',
    logoEmoji: '📦',
    status: 'available',
    commissionRate: '30%（基本手数料）',
    smallBusinessRate: '20%（年間売上$100万以下）',
    launchDate: '2011年3月',
    description: 'Amazon が運営するAndroid アプリストア。Fire TV、Fire タブレットへのアクセスに加え、2025年からは日本の第三者アプリストアとしても展開予定です。',
    features: [
      'Amazon Developer Console',
      'Fire デバイス最適化',
      'Alexa スキル統合',
      'Amazon IAP (In-App Purchases)',
      'Fire TV アプリサポート',
      'Amazon Analytics',
      'A/Bテスト機能',
      'デベロッパーサポート'
    ],
    benefits: [
      'Amazon エコシステム統合',
      'Fire デバイス市場独占',
      '競合の少ないマーケット',
      'Amazon Prime 会員へのリーチ',
      'Alexa 連携機会',
      'グローバル配信基盤'
    ],
    developerResources: [
      {
        title: 'Amazon Developer Portal',
        description: 'Amazon Appstore とAlexa スキル開発の総合ポータル',
        link: 'https://developer.amazon.com'
      },
      {
        title: 'Amazon Appstore SDK',
        description: 'Amazon 独自の決済システムとサービス統合のためのSDK'
      },
      {
        title: 'Fire デバイス開発ガイド',
        description: 'Fire TV、Fire タブレット向け最適化ガイド'
      },
      {
        title: 'Alexa Skills Kit',
        description: 'アプリとAlexa の連携を実現するためのツールキット'
      }
    ],
    submissionProcess: [
      {
        title: '1. Amazon Developer アカウント作成',
        description: '無料でAmazon Developer Portal にアカウントを登録します。'
      },
      {
        title: '2. アプリのテスト',
        description: 'Android デバイスと Fire デバイスでの動作確認を行います。'
      },
      {
        title: '3. Amazon IAP の統合',
        description: 'アプリ内課金がある場合、Amazon の決済システムを統合します。'
      },
      {
        title: '4. アプリ情報の入力',
        description: 'Amazon Developer Console でアプリの詳細情報を入力します。'
      },
      {
        title: '5. 審査とリリース',
        description: 'Amazon の審査を経て、Appstore に公開されます。'
      }
    ],
    supportedDevices: ['Android スマートフォン', 'Fire タブレット', 'Fire TV', 'Echo デバイス（一部）'],
    websiteUrl: 'https://www.amazon.com/mobile-apps',
    developerPortalUrl: 'https://developer.amazon.com',
    minimumRequirements: [
      'Android 4.4 以上',
      'Amazon DRM の実装（有料アプリの場合）',
      'Fire OS 互換性（Fire デバイス向け）'
    ],
    reviewTime: '平均1-2週間',
    countries: ['米国、日本、英国、ドイツ、フランス、イタリア、スペイン、インド、オーストラリア、ブラジル、メキシコ、カナダ'],
    paymentMethods: ['Amazon Pay', 'クレジットカード', 'Amazon ギフトカード', 'キャリア決済（一部地域）']
  }
}

// Status display mapping
const statusColors: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  coming_soon: 'bg-yellow-100 text-yellow-800',
  planning: 'bg-gray-100 text-gray-800',
}

const statusLabels: Record<string, string> = {
  available: '利用可能',
  coming_soon: '準備中',
  planning: '計画中',
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const store = APP_STORES[resolvedParams.slug]
  
  if (!store) {
    return {
      title: 'アプリストアが見つかりません | AppStoreBank Insights',
      description: '指定されたアプリストアは見つかりませんでした。',
    }
  }

  return {
    title: `${store.name} 詳細ガイド | 手数料・機能・開発者向け情報まとめ`,
    description: store.description,
    keywords: [
      store.name,
      `${store.company} アプリストア`,
      'アプリ配信',
      'アプリストア 手数料',
      'アプリ開発者',
      'アプリ審査',
      'アプリ公開',
      store.slug
    ],
    openGraph: {
      title: `${store.name} 詳細ガイド`,
      description: store.description,
      type: 'website',
      siteName: 'AppStoreBank Insights',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${store.name} 詳細ガイド`,
      description: store.description,
    },
    alternates: {
      canonical: `https://insights.appstorebank.com/app-stores/${store.slug}`,
    },
  }
}

// Helper function to get breadcrumb items
function getAppStoreBreadcrumb(storeName: string) {
  return [
    { label: 'ホーム', href: '/' },
    { label: 'アプリストア一覧', href: '/app-stores' },
    { label: storeName }
  ]
}

export default async function AppStoreDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const store = APP_STORES[resolvedParams.slug]
  
  if (!store) {
    notFound()
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070')`,
              filter: 'brightness(0.4)'
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="flex items-center mb-6">
              <span className="text-6xl mr-4">{store.logoEmoji}</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  {store.name}
                </h1>
                <p className="text-xl text-white/90 mt-2">
                  {store.company}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[store.status]}`}>
                {statusLabels[store.status]}
              </span>
              {store.launchDate && (
                <span className="text-white/80">
                  サービス開始: {store.launchDate}
                </span>
              )}
            </div>
            <p className="text-xl text-white/90 max-w-3xl">
              {store.description}
            </p>
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Breadcrumb items={getAppStoreBreadcrumb(store.name)} />
        </div>

        {/* Quick Stats */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-sm text-neutral-600 mb-1">基本手数料</h3>
                <p className="text-lg font-bold text-neutral-900">{store.commissionRate}</p>
              </div>
              {store.smallBusinessRate && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm text-neutral-600 mb-1">小規模事業者</h3>
                  <p className="text-lg font-bold text-green-600">{store.smallBusinessRate}</p>
                </div>
              )}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-sm text-neutral-600 mb-1">審査期間</h3>
                <p className="text-lg font-bold text-neutral-900">{store.reviewTime}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-sm text-neutral-600 mb-1">対応地域</h3>
                <p className="text-sm font-medium text-neutral-900">{store.countries[0]}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Commission Structure */}
              <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">💰 手数料・料金体系</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
                    <span className="font-medium">基本手数料</span>
                    <span className="font-bold text-lg">{store.commissionRate}</span>
                  </div>
                  {store.smallBusinessRate && (
                    <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
                      <span className="font-medium">小規模事業者割引</span>
                      <span className="font-bold text-lg text-green-600">{store.smallBusinessRate}</span>
                    </div>
                  )}
                  {store.subscriptionRate && (
                    <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
                      <span className="font-medium">サブスクリプション（2年目〜）</span>
                      <span className="font-bold text-lg text-blue-600">{store.subscriptionRate}</span>
                    </div>
                  )}
                </div>
                <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
                  <h3 className="font-semibold mb-2">対応決済方法</h3>
                  <div className="flex flex-wrap gap-2">
                    {store.paymentMethods?.map((method) => (
                      <span key={method} className="px-3 py-1 bg-white rounded-full text-sm border">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Features */}
              <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">⚡ 主要機能・特徴</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {store.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                      <span className="text-primary-600">✓</span>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Benefits */}
              <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">🎯 開発者向けメリット</h2>
                <div className="space-y-4">
                  {store.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-green-600 mt-1">●</span>
                      <p className="text-neutral-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Submission Process */}
              <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">📝 アプリ申請プロセス</h2>
                <div className="space-y-6">
                  {store.submissionProcess.map((step, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                        <p className="text-neutral-700">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Developer Resources */}
              <section className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6">🛠️ 開発者リソース</h2>
                <div className="grid gap-4">
                  {store.developerResources.map((resource, index) => (
                    <div key={index} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold mb-2">{resource.title}</h3>
                          <p className="text-neutral-700 text-sm">{resource.description}</p>
                        </div>
                        {resource.link && (
                          <a 
                            href={resource.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 font-medium text-sm ml-4 flex-shrink-0"
                          >
                            開く →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              {/* Quick Access */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">クイックアクセス</h3>
                <div className="space-y-3">
                  <a 
                    href={store.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    公式サイトへ
                  </a>
                  {store.developerPortalUrl && (
                    <a 
                      href={store.developerPortalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full bg-neutral-100 text-neutral-800 text-center py-3 rounded-lg font-medium hover:bg-neutral-200 transition-colors"
                    >
                      開発者ポータル
                    </a>
                  )}
                </div>
              </div>

              {/* Supported Devices */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">対応デバイス</h3>
                <div className="space-y-2">
                  {store.supportedDevices.map((device, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm">{device}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              {store.minimumRequirements && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h3 className="font-bold text-lg mb-4">最小要件</h3>
                  <div className="space-y-2">
                    {store.minimumRequirements.map((req, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-orange-600 mt-1">•</span>
                        <span className="text-sm text-neutral-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Links */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4">関連ページ</h3>
                <div className="space-y-2">
                  <Link href="/app-stores" className="block text-sm text-primary-600 hover:text-primary-700">
                    ← アプリストア一覧に戻る
                  </Link>
                  <Link href="/app-store-comparison" className="block text-sm text-primary-600 hover:text-primary-700">
                    アプリストア比較ページ
                  </Link>
                  <Link href="/app-store-liberalization" className="block text-sm text-primary-600 hover:text-primary-700">
                    アプリストア自由化について
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}