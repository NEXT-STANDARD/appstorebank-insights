'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import PaywallOverlay from '@/components/PaywallOverlay'
import { getCurrentUser } from '@/lib/auth'

interface ArticleContentProps {
  content: string
  isPremium: boolean
  articleTitle: string
}

export default function ArticleContent({ content, isPremium, articleTitle }: ArticleContentProps) {
  const [showPaywall, setShowPaywall] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      if (!isPremium) {
        setIsChecking(false)
        return
      }

      try {
        const { user } = await getCurrentUser()
        const isLoggedIn = !!user
        setShowPaywall(isPremium && !isLoggedIn)
      } catch (error) {
        console.error('Error checking user access:', error)
        setShowPaywall(isPremium)
      } finally {
        setIsChecking(false)
      }
    }

    checkAccess()
  }, [isPremium])

  if (isChecking) {
    return (
      <div className="prose prose-lg max-w-none">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 mb-4"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`prose prose-lg max-w-none ${showPaywall ? 'relative' : ''}`}>
        <div className={showPaywall ? 'max-h-96 overflow-hidden relative' : ''}>
          {showPaywall && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white z-10" />
          )}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-neutral-900 mt-8 mb-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-neutral-900 mt-8 mb-4">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold text-neutral-900 mt-6 mb-3">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-neutral-700 leading-relaxed mb-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 space-y-2 mb-4 text-neutral-700">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 space-y-2 mb-4 text-neutral-700">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary-500 pl-4 italic text-neutral-600 my-4">
                  {children}
                </blockquote>
              ),
              code: ({ node, inline, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-lg text-sm mb-4"
                    showLineNumbers={true}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-neutral-100 px-2 py-1 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                )
              },
              a: ({ href, children }) => (
                <a href={href} className="text-primary-600 hover:text-primary-700 underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                <img src={src} alt={alt} className="rounded-lg shadow-md my-6" />
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-gray-50">{children}</thead>
              ),
              tbody: ({ children }) => (
                <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
              ),
              tr: ({ children }) => (
                <tr>{children}</tr>
              ),
              th: ({ children }) => (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {children}
                </td>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Paywall Overlay */}
      <PaywallOverlay isVisible={showPaywall} articleTitle={articleTitle} />
    </>
  )
}