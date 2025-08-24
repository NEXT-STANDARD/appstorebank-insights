'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-neutral-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="https://appstorebank.com" className="flex items-center space-x-3">
              <div className="bg-primary-gradient text-white font-bold text-xl px-3 py-1 rounded-lg shadow-md">
                AppStoreBank
              </div>
            </Link>
            <span className="text-neutral-600 text-sm font-medium">Insights</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-neutral-700 hover:text-primary-600 font-medium text-sm transition-colors">
              ホーム
            </Link>
            <Link href="/?category=market_analysis" className="text-neutral-700 hover:text-primary-600 font-medium text-sm transition-colors">
              市場分析
            </Link>
            <Link href="/?category=global_trends" className="text-neutral-700 hover:text-primary-600 font-medium text-sm transition-colors">
              グローバル
            </Link>
            <Link href="/?category=law_regulation" className="text-neutral-700 hover:text-primary-600 font-medium text-sm transition-colors">
              法規制
            </Link>
            <Link href="/?category=tech_deep_dive" className="text-neutral-700 hover:text-primary-600 font-medium text-sm transition-colors">
              技術
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
            <Link 
              href="https://appstorebank.com" 
              className="text-neutral-600 hover:text-primary-600 text-sm transition-colors"
            >
              ← メインサイト
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
            <Link href="/" className="block text-neutral-700 hover:text-primary-600 font-medium py-2 transition-colors">ホーム</Link>
            <Link href="/?category=market_analysis" className="block text-neutral-700 hover:text-primary-600 font-medium py-2 transition-colors">市場分析</Link>
            <Link href="/?category=global_trends" className="block text-neutral-700 hover:text-primary-600 font-medium py-2 transition-colors">グローバル</Link>
            <Link href="/?category=law_regulation" className="block text-neutral-700 hover:text-primary-600 font-medium py-2 transition-colors">法規制</Link>
            <Link href="/?category=tech_deep_dive" className="block text-neutral-700 hover:text-primary-600 font-medium py-2 transition-colors">技術</Link>
            <Link href="#newsletter" className="block text-neutral-700 hover:text-primary-600 font-medium py-2 transition-colors">ニュースレター</Link>
            <div className="pt-3 border-t border-neutral-200 space-y-2">
              <Link href="https://developer.appstorebank.com" className="block text-neutral-600 hover:text-primary-600 text-sm py-1 transition-colors">
                Developer Portal
              </Link>
              <Link href="https://api.appstorebank.com" className="block text-neutral-600 hover:text-primary-600 text-sm py-1 transition-colors">
                API Services
              </Link>
              <Link href="https://appstorebank.com" className="block text-neutral-600 hover:text-primary-600 text-sm py-1 transition-colors">
                ← メインサイト
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}