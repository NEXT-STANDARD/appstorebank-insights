'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function FirstTimeVisitorGuide() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border-l-4 border-blue-500 my-8">
      <div className="relative p-6 lg:p-8">
        {/* 閉じるボタン */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-blue-400 hover:text-blue-600 transition-colors"
          aria-label="閉じる"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="pr-8">
          {/* ヘッダー */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">👋</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900">はじめての方へ</h2>
              <p className="text-blue-700 text-sm">AppStoreBank Insightsの使い方をご案内します</p>
            </div>
          </div>

          {/* コンテンツ */}
          <div className="space-y-6">
            {/* サイトの概要 */}
            <div className="bg-white/70 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">🏪 このサイトについて</h3>
              <p className="text-blue-800 text-sm leading-relaxed mb-3">
                アプリストア自由化・第三者アプリストア参入の専門メディアです。2025年12月スマホ新法施行に向けた最新情報を開発者・事業者向けに提供しています。
              </p>
            </div>

            {/* 主要コンテンツ */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/70 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg">📊</span>
                  <h4 className="font-semibold text-blue-900">市場分析</h4>
                </div>
                <p className="text-blue-800 text-sm mb-3">アプリストア業界の最新動向と詳細な市場分析レポート</p>
                <Link 
                  href="/?category=market_analysis"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                >
                  記事を見る →
                </Link>
              </div>

              <div className="bg-white/70 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg">⚖️</span>
                  <h4 className="font-semibold text-blue-900">法規制情報</h4>
                </div>
                <p className="text-blue-800 text-sm mb-3">スマホ新法をはじめとする規制動向の解説</p>
                <Link 
                  href="/?category=law_regulation"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                >
                  記事を見る →
                </Link>
              </div>
            </div>

            {/* おすすめアクション */}
            <div className="bg-white/70 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">🚀 まずはここから</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <Link
                  href="/app-store-liberalization"
                  className="flex items-center space-x-2 p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors text-sm"
                >
                  <span>📖</span>
                  <span className="text-blue-900 font-medium">アプリストア自由化とは</span>
                </Link>
                
                <Link
                  href="/app-store-rankings"
                  className="flex items-center space-x-2 p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors text-sm"
                >
                  <span>🏆</span>
                  <span className="text-blue-900 font-medium">アプリストアランキング</span>
                </Link>
                
                <Link
                  href="/app-stores"
                  className="flex items-center space-x-2 p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors text-sm"
                >
                  <span>🏪</span>
                  <span className="text-blue-900 font-medium">アプリストア一覧</span>
                </Link>
              </div>
            </div>

            {/* 最新情報をチェック */}
            <div className="bg-white/70 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">📡 最新情報をチェック</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <p className="text-blue-800 text-sm">
                  重要な業界ニュースを見逃したくない方は、定期的にチェックするか下記のリソースをご活用ください。
                </p>
                <div className="flex space-x-2">
                  <a
                    href="https://developer.appstorebank.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    Developer Portal
                  </a>
                  <a
                    href="https://api.appstorebank.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    API Services
                  </a>
                </div>
              </div>
            </div>

            {/* 注目情報 */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">重要なタイムライン</h3>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• <strong>2025年12月18日</strong>: スマホ新法完全施行予定</li>
                    <li>• 第三者アプリストアの参入準備期間が重要</li>
                    <li>• 開発者の対応準備が必要な時期</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}