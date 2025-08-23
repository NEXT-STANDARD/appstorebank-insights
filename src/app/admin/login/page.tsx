'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn, getCurrentUser } from '@/lib/auth'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true
    
    // 既にログイン済みの場合はダッシュボードにリダイレクト
    const checkExistingAuth = async () => {
      try {
        const { user, error } = await getCurrentUser()
        
        if (!isMounted) return
        
        // エラーがない場合かつユーザーが存在し、管理者権限がある場合
        if (!error && user && (user.profile?.user_role === 'admin' || user.profile?.user_role === 'developer' || user.profile?.user_role === 'verified_dev')) {
          router.push('/admin')
        }
      } catch (error) {
        // ログインページではエラーを静黙に処理（ユーザーが未ログインなのは正常）
        console.debug('Auth check - user not logged in:', error)
      }
    }
    
    checkExistingAuth()

    return () => {
      isMounted = false
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { user, error: signInError } = await signIn(email, password)

    if (signInError) {
      setError('メールアドレスまたはパスワードが正しくありません。')
      setIsLoading(false)
      return
    }

    if (user) {
      // プロファイル情報を取得して権限を確認
      const { user: currentUser } = await getCurrentUser()
      
      if (!currentUser || (currentUser.profile?.user_role !== 'admin' && currentUser.profile?.user_role !== 'developer' && currentUser.profile?.user_role !== 'verified_dev')) {
        setError('管理者権限がありません。')
        setIsLoading(false)
        return
      }

      router.push('/admin')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-light-gradient flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-gradient text-white font-bold text-2xl px-4 py-2 rounded-xl shadow-lg">
              AppStoreBank
            </div>
          </div>
          <h2 className="text-3xl font-bold text-neutral-800">管理者ログイン</h2>
          <p className="mt-2 text-neutral-600">
            記事の投稿・編集を行うにはログインしてください
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:opacity-50"
                placeholder="admin@appstorebank.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                isLoading || !email || !password
                  ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  : 'bg-primary-gradient text-white hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>ログイン中...</span>
                </div>
              ) : (
                'ログイン'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/admin/forgot-password"
              className="text-primary-600 hover:text-primary-700 text-sm transition-colors"
            >
              パスワードをお忘れですか？
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary-600 text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>サイトに戻る</span>
          </Link>
        </div>
      </div>
    </div>
  )
}