'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'

export default function LogoutPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const { error } = await signOut()
        
        if (error) {
          setError(error.message)
        } else {
          // ログアウト成功後、ログインページにリダイレクト
          setTimeout(() => {
            router.push('/admin/login')
          }, 2000)
        }
      } catch (err: any) {
        setError(err.message || '予期しないエラーが発生しました')
      } finally {
        setIsLoading(false)
      }
    }

    handleLogout()
  }, [router])

  return (
    <div className="min-h-screen bg-light-gradient flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="App Store Bank" className="h-12 w-auto" />
          </div>

          {isLoading ? (
            <div>
              <h2 className="text-3xl font-bold text-neutral-800 mb-4">ログアウト中...</h2>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : error ? (
            <div>
              <h2 className="text-3xl font-bold text-neutral-800 mb-4">エラーが発生しました</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-4">
                {error}
              </div>
              <button
                onClick={() => router.push('/admin/login')}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                ログインページに戻る
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-neutral-800 mb-4">ログアウトしました</h2>
              <p className="text-neutral-600 mb-4">
                ありがとうございました。まもなくログインページにリダイレクトします...
              </p>
              <button
                onClick={() => router.push('/admin/login')}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                今すぐログインページに移動
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}