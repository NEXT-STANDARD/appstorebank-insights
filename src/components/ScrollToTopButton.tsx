'use client'

import { useState, useEffect } from 'react'

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  // スクロール位置を監視
  useEffect(() => {
    const toggleVisibility = () => {
      // 300px以上スクロールしたらボタンを表示
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    
    // クリーンアップ
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  // トップにスクロール
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ease-in-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        className="group bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-200"
        aria-label="トップに戻る"
      >
        <svg 
          className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 10l7-7m0 0l7 7m-7-7v18" 
          />
        </svg>
      </button>
      
      {/* ホバー時のツールチップ */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-neutral-800 text-white text-sm py-2 px-3 rounded-lg whitespace-nowrap">
          トップに戻る
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
        </div>
      </div>
    </div>
  )
}

// より高度なバージョン（プログレスバー付き）
export function ScrollToTopButtonWithProgress() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      
      // スクロール進捗を計算
      const progress = (scrollTop / documentHeight) * 100
      setScrollProgress(Math.min(progress, 100))
      
      // ボタンの表示・非表示
      setIsVisible(scrollTop > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ease-in-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="relative w-14 h-14">
        {/* プログレスリング - 背景 */}
        <svg 
          className="absolute inset-0 w-14 h-14 transform -rotate-90" 
          viewBox="0 0 56 56"
        >
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-primary-200"
          />
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 24}`}
            strokeDashoffset={`${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`}
            className="text-primary-600 transition-all duration-150 ease-out"
            strokeLinecap="round"
          />
        </svg>
        
        {/* ボタン - 中央に配置 */}
        <button
          onClick={scrollToTop}
          className="group absolute inset-1.5 bg-white hover:bg-primary-50 text-primary-600 hover:text-primary-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-200 flex items-center justify-center"
          aria-label="トップに戻る"
        >
          <svg 
            className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </button>
      </div>
    </div>
  )
}