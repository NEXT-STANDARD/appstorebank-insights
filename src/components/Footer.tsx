import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-primary-gradient text-white font-bold text-lg px-3 py-1 rounded-lg">
                AppStoreBank
              </div>
              <span className="text-white/60">Insights</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-md">
              アプリストア業界の専門的な洞察とトレンド分析を提供する情報プラットフォーム。
              開発者とビジネスリーダーのための価値ある情報をお届けします。
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">コンテンツ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/reports" className="text-white/70 hover:text-white transition-colors">
                  市場分析レポート
                </Link>
              </li>
              <li>
                <Link href="/global" className="text-white/70 hover:text-white transition-colors">
                  グローバルトレンド
                </Link>
              </li>
              <li>
                <Link href="/law" className="text-white/70 hover:text-white transition-colors">
                  法規制解説
                </Link>
              </li>
              <li>
                <Link href="/tech" className="text-white/70 hover:text-white transition-colors">
                  技術深層解説
                </Link>
              </li>
            </ul>
          </div>

          {/* Other Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">AppStoreBank</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://appstorebank.com" className="text-white/70 hover:text-white transition-colors">
                  メインサイト
                </Link>
              </li>
              <li>
                <Link href="https://developer.appstorebank.com" className="text-white/70 hover:text-white transition-colors">
                  開発者ポータル
                </Link>
              </li>
              <li>
                <Link href="https://api.appstorebank.com" className="text-white/70 hover:text-white transition-colors">
                  API サービス
                </Link>
              </li>
              <li>
                <Link href="/newsletter" className="text-white/70 hover:text-white transition-colors">
                  ニュースレター
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2025 AppStoreBank. All rights reserved.
          </p>
          <p className="text-white/40 text-xs mt-2 md:mt-0">
            すべての開発者に選択肢を 🚀
          </p>
        </div>
      </div>
    </footer>
  )
}