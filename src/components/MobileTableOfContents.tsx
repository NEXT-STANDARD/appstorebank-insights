'use client'

import { useState } from 'react'
import TableOfContents from './TableOfContents'

interface MobileTableOfContentsProps {
  content: string
}

export default function MobileTableOfContents({ content }: MobileTableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* フローティングボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-20 right-4 z-40 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
        aria-label="目次を開く"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* モバイル用オーバーレイ */}
      {isOpen && (
        <>
          {/* 背景オーバーレイ */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* スライドインパネル */}
          <div className={`lg:hidden fixed right-0 top-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-800">目次</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="閉じる"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 目次コンテンツ */}
            <div className="overflow-y-auto h-full pb-20">
              <div onClick={() => setIsOpen(false)}>
                <TableOfContents content={content} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}