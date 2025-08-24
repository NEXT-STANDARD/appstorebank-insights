'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [scrollProgress, setScrollProgress] = useState(0)
  const pathname = usePathname()

  // コンテンツから見出しを抽出
  useEffect(() => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm
    const items: TocItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      // IDを生成（日本語対応）
      const id = text
        .toLowerCase()
        .replace(/[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\s-]/g, '')
        .replace(/\s+/g, '-')
      
      items.push({ id, text, level })
    }

    setTocItems(items)
  }, [content])

  // スクロール位置を追跡してアクティブな見出しを更新
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100 // オフセット調整

      // すべての見出し要素を取得
      const headingElements = tocItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(item => item.element)

      // 現在のスクロール位置に最も近い見出しを見つける
      let currentActiveId = ''
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const { id, element } = headingElements[i]
        if (element && element.offsetTop <= scrollPosition) {
          currentActiveId = id
          break
        }
      }

      // 最初の見出しより上にいる場合
      if (!currentActiveId && headingElements.length > 0) {
        currentActiveId = headingElements[0].id
      }

      setActiveId(currentActiveId)

      // スクロール進捗を計算
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(100, Math.round((window.scrollY / scrollHeight) * 100))
      setScrollProgress(progress)
    }

    // 見出しにIDを付与
    const addIdsToHeadings = () => {
      const article = document.querySelector('article')
      if (!article) return

      const headings = article.querySelectorAll('h1, h2, h3')
      headings.forEach((heading) => {
        const text = heading.textContent || ''
        const id = text
          .toLowerCase()
          .replace(/[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\s-]/g, '')
          .replace(/\s+/g, '-')
        
        heading.id = id
      })
    }

    // 初期化
    setTimeout(() => {
      addIdsToHeadings()
      handleScroll()
    }, 100)

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [tocItems, pathname])

  // 見出しクリックでスムーズスクロール
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // ヘッダーの高さ分オフセット
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
    }
  }

  if (tocItems.length === 0) {
    return null
  }

  return (
    <div className="sticky top-24">
      <nav className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-sm font-bold text-neutral-800 mb-4 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          目次
        </h3>
        
        <ul className="space-y-2">
          {tocItems.map((item) => {
            const isActive = activeId === item.id
            const paddingLeft = (item.level - 1) * 12
            
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`
                    block py-1.5 text-sm transition-all duration-200 hover:text-primary-600
                    ${isActive 
                      ? 'text-primary-600 font-medium border-l-2 border-primary-600 -ml-px pl-3' 
                      : 'text-neutral-600 hover:pl-1'
                    }
                  `}
                  style={{ 
                    paddingLeft: isActive ? `${paddingLeft + 12}px` : `${paddingLeft}px` 
                  }}
                >
                  {item.text}
                </a>
              </li>
            )
          })}
        </ul>

        {/* プログレスバー */}
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
            <span>読了進捗</span>
            <span className="font-medium text-primary-600">{scrollProgress}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${scrollProgress}%` 
              }}
            />
          </div>
        </div>
      </nav>
    </div>
  )
}