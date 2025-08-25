'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, signOut, ExtendedUser } from '@/lib/auth'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // 認証が不要なページ
  const noAuthPages = ['/admin/login', '/admin/logout']
  const isNoAuthPage = noAuthPages.includes(pathname)

  useEffect(() => {
    let isMounted = true
    
    // 認証不要ページの場合は認証チェックをスキップ
    if (isNoAuthPage) {
      setIsLoading(false)
      return
    }
    
    const checkAuth = async () => {
      try {
        const { user: currentUser, error } = await getCurrentUser()
        
        if (!isMounted) return
        
        // エラーがある場合やユーザーが存在しない場合
        if (error || !currentUser) {
          setIsLoading(false)
          router.push('/admin/login')
          return
        }

        // 管理者権限がない場合
        if (currentUser.profile?.user_role !== 'admin' && currentUser.profile?.user_role !== 'developer' && currentUser.profile?.user_role !== 'verified_dev') {
          setIsLoading(false)
          router.push('/admin/login')
          return
        }

        // 成功時
        setUser(currentUser)
        setIsLoading(false)
      } catch (error) {
        console.error('Auth check error:', error)
        if (isMounted) {
          setIsLoading(false)
          router.push('/admin/login')
        }
      }
    }
    
    checkAuth()

    return () => {
      isMounted = false
    }
  }, [router, pathname, isNoAuthPage])

  const handleSignOut = async () => {
    await signOut()
    router.push('/admin/login')
  }

  // 認証不要ページの場合はレイアウトなしで表示
  if (isNoAuthPage) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center hover:opacity-90 transition-opacity">
                <img src="/logo.png" alt="App Store Bank" className="h-8 w-auto" />
                <span className="ml-3 text-neutral-600 font-medium">Admin</span>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-600">
                {user.profile?.display_name || user.email}
              </span>
              <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                {user.profile?.user_role}
              </span>
              <button
                onClick={handleSignOut}
                className="text-neutral-600 hover:text-neutral-800 text-sm transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm border-r border-neutral-200 min-h-screen">
          <div className="p-6">
            <ul className="space-y-3">
              <li>
                <Link
                  href="/admin"
                  className="flex items-center space-x-3 px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 5 4-4 4 4m-4-4v18" />
                  </svg>
                  <span>ダッシュボード</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/articles"
                  className="flex items-center space-x-3 px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>記事管理</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/articles/new"
                  className="flex items-center space-x-3 px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>新規記事</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/drafts"
                  className="flex items-center space-x-3 px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>下書き</span>
                </Link>
              </li>
              {user.profile?.user_role === 'admin' && (
                <>
                  <li>
                    <Link
                      href="/admin/app-stores"
                      className="flex items-center space-x-3 px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>アプリストア管理</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/users"
                      className="flex items-center space-x-3 px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <span>ユーザー管理</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/analytics"
                      className="flex items-center space-x-3 px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>分析</span>
                    </Link>
                  </li>
                  <li className="mt-4 pt-3 border-t border-neutral-200">
                    <Link
                      href="/"
                      className="flex items-center space-x-3 px-4 py-2 text-neutral-600 hover:text-primary-600 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span>サイトを見る</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}