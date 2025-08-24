'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-neutral-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <img src="/logo.png" alt="App Store Bank" className="h-10 w-auto" />
              <span className="ml-3 text-neutral-600 text-sm font-medium">Insights</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="flex items-center text-neutral-700 hover:text-primary-600 font-medium text-sm transition-colors">
                カテゴリ
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                  <Link href="/?category=market_analysis" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors">
                    📊 市場分析
                  </Link>
                  <Link href="/?category=global_trends" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors">
                    🌏 グローバルトレンド
                  </Link>
                  <Link href="/?category=law_regulation" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors">
                    ⚖️ 法規制
                  </Link>
                  <Link href="https://developer.appstorebank.com" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors" target="_blank" rel="noopener noreferrer">
                    🔧 技術解説 →
                  </Link>
                </div>
              )}
            </div>

            <Link href="/app-store-liberalization" className="text-neutral-700 hover:text-primary-600 font-medium text-sm transition-colors">
              自由化
            </Link>
            <Link href="/sponsors" className="text-neutral-700 hover:text-primary-600 font-medium text-sm transition-colors">
              スポンサー
            </Link>
            <Link href="#newsletter" className="text-neutral-700 hover:text-primary-600 font-medium text-sm transition-colors">
              ニュースレター
            </Link>
          </div>

          {/* Right side links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="https://developer.appstorebank.com" 
              className="text-neutral-600 hover:text-primary-600 text-sm transition-colors"
            >
              Developer
            </Link>
            <Link 
              href="https://api.appstorebank.com" 
              className="text-neutral-600 hover:text-primary-600 text-sm transition-colors"
            >
              API
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neutral-600 hover:text-primary-600 focus:outline-none focus:text-primary-600"
              aria-label="メニューを開く"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-sm rounded-xl mt-2 p-4 space-y-3 border border-neutral-200 shadow-lg">
            <div className="space-y-3">
              <div className="text-neutral-500 text-sm font-medium px-3">カテゴリ</div>
              <Link href="/?category=market_analysis" className="block text-neutral-700 hover:text-primary-600 font-medium py-2 px-3 transition-colors">
                📊 市場分析
              </Link>
              <Link href="/?category=global_trends" className="block text-neutral-700 hover:text-primary-600 font-medium py-2 px-3 transition-colors">
                🌏 グローバルトレンド
              </Link>
              <Link href="/?category=law_regulation" className="block text-neutral-700 hover:text-primary-600 font-medium py-2 px-3 transition-colors">
                ⚖️ 法規制
              </Link>
              <Link href="https://developer.appstorebank.com" className="block text-neutral-700 hover:text-primary-600 font-medium py-2 px-3 transition-colors" target="_blank" rel="noopener noreferrer">
                🔧 技術解説 →
              </Link>
            </div>
            <div className="pt-3 border-t border-neutral-200 space-y-3">
              <Link href="/app-store-liberalization" className="block text-neutral-700 hover:text-primary-600 font-medium py-2 transition-colors">自由化</Link>
              <Link href="/sponsors" className="block text-neutral-700 hover:text-primary-600 font-medium py-2 transition-colors">スポンサー</Link>
              <Link href="#newsletter" className="block text-neutral-700 hover:text-primary-600 font-medium py-2 transition-colors">ニュースレター</Link>
            </div>
            <div className="pt-3 border-t border-neutral-200 space-y-2">
              <Link href="https://developer.appstorebank.com" className="block text-neutral-600 hover:text-primary-600 text-sm py-1 transition-colors">
                Developer Portal
              </Link>
              <Link href="https://api.appstorebank.com" className="block text-neutral-600 hover:text-primary-600 text-sm py-1 transition-colors">
                API Services
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}