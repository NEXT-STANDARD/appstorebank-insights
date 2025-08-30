'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Lock, TrendingUp, Shield, Globe, Users } from 'lucide-react'

interface PaywallOverlayProps {
  isVisible: boolean
  articleTitle?: string
}

export default function PaywallOverlay({ isVisible, articleTitle }: PaywallOverlayProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // 記事の30%以上スクロールしたら表示
      if (scrollPosition > windowHeight * 0.3) {
        setScrolled(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isVisible])

  if (!isVisible || !scrolled) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-up">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            プレミアムコンテンツ
          </h2>
          
          {articleTitle && (
            <p className="text-sm text-gray-600 mb-4">
              「{articleTitle}」の続きを読むには<br />
              会員登録（無料）が必要です
            </p>
          )}
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                市場分析レポート
              </p>
              <p className="text-xs text-gray-600">
                アプリストア自由化の最新動向を詳しく解説
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                法規制の詳細解説
              </p>
              <p className="text-xs text-gray-600">
                スマートフォン新法の影響と対策
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Globe className="w-5 h-5 text-purple-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                グローバル事例
              </p>
              <p className="text-xs text-gray-600">
                世界各国の規制動向と成功事例
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Users className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                開発者コミュニティ
              </p>
              <p className="text-xs text-gray-600">
                AppStoreBankの全サービスへアクセス可能
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/signup"
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-center"
          >
            無料で会員登録
          </Link>

          <Link
            href="/login"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all text-center"
          >
            既にアカウントをお持ちの方
          </Link>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          登録は無料です。すべてのコンテンツを閲覧できます。
        </p>
      </div>
    </div>
  )
}