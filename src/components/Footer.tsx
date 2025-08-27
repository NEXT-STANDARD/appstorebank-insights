import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="App Store Bank" className="h-8 w-auto" />
              <span className="ml-3 text-neutral-600 font-medium">Insights</span>
            </div>
            <p className="text-neutral-600 text-sm leading-relaxed max-w-md">
              アプリストア業界の専門的な洞察とトレンド分析を提供する情報プラットフォーム。
              開発者とビジネスリーダーのための価値ある情報をお届けします。
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-neutral-800 mb-4">コンテンツ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/?category=market_analysis" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  市場分析レポート
                </Link>
              </li>
              <li>
                <Link href="/?category=global_trends" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  グローバルトレンド
                </Link>
              </li>
              <li>
                <Link href="/?category=law_regulation" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  法規制解説
                </Link>
              </li>
              <li>
                <Link href="https://developer.appstorebank.com" className="text-neutral-600 hover:text-primary-600 transition-colors" target="_blank" rel="noopener noreferrer">
                  技術解説 →
                </Link>
              </li>
            </ul>
          </div>

          {/* Other Services */}
          <div>
            <h3 className="font-semibold text-neutral-800 mb-4">AppStoreBank</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://appstorebank.com" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  メインサイト
                </Link>
              </li>
              <li>
                <Link href="https://developer.appstorebank.com" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors" target="_blank" rel="noopener noreferrer">
                  🔧 技術実装ガイド →
                </Link>
              </li>
              <li>
                <Link href="https://api.appstorebank.com" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  API サービス
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-600 text-sm">
              © 2025 AppStoreBank. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a
                href="https://twitter.com/AppStoreBank"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              <span className="text-neutral-500 text-xs">
                すべての開発者に選択肢を 🚀
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}