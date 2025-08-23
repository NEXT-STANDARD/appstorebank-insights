'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="glass-header">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="https://appstorebank.com" className="flex items-center space-x-3">
              <div className="bg-primary-gradient text-white font-bold text-xl px-3 py-1 rounded-lg">
                AppStoreBank
              </div>
            </Link>
            <span className="text-white/60 text-sm">Insights</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="nav-link">
              ホーム
            </Link>
            <Link href="/reports" className="nav-link">
              市場分析
            </Link>
            <Link href="/global" className="nav-link">
              グローバル
            </Link>
            <Link href="/law" className="nav-link">
              法規制
            </Link>
            <Link href="/tech" className="nav-link">
              技術
            </Link>
            <Link href="/newsletter" className="nav-link">
              ニュースレター
            </Link>
          </div>

          {/* Right side links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="https://developer.appstorebank.com" 
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Developer
            </Link>
            <Link 
              href="https://api.appstorebank.com" 
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              API
            </Link>
            <Link 
              href="https://appstorebank.com" 
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              ← メインサイト
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white/70 hover:text-white focus:outline-none focus:text-white"
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
          <div className="md:hidden bg-white/10 backdrop-blur-sm rounded-xl mt-2 p-4 space-y-3">
            <Link href="/" className="block nav-link">ホーム</Link>
            <Link href="/reports" className="block nav-link">市場分析</Link>
            <Link href="/global" className="block nav-link">グローバル</Link>
            <Link href="/law" className="block nav-link">法規制</Link>
            <Link href="/tech" className="block nav-link">技術</Link>
            <Link href="/newsletter" className="block nav-link">ニュースレター</Link>
            <div className="pt-3 border-t border-white/20 space-y-2">
              <Link href="https://developer.appstorebank.com" className="block text-white/70 hover:text-white text-sm">
                Developer Portal
              </Link>
              <Link href="https://api.appstorebank.com" className="block text-white/70 hover:text-white text-sm">
                API Services
              </Link>
              <Link href="https://appstorebank.com" className="block text-white/70 hover:text-white text-sm">
                ← メインサイト
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}