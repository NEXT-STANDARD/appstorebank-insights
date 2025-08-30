'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, signOut } from '@/lib/auth'
import type { ExtendedUser } from '@/lib/auth'
import { User, Mail, Calendar, Shield, LogOut, Settings, ChevronRight } from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { user: currentUser, error } = await getCurrentUser()
      if (!error && currentUser) {
        setUser(currentUser)
      } else {
        // 未ログインの場合はログインページへリダイレクト
        router.push('/login')
      }
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const displayName = user.profile?.display_name || user.email?.split('@')[0] || 'ユーザー'
  const userRole = user.profile?.user_role || 'end_user'
  const isAdmin = userRole === 'admin'
  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('ja-JP') : '不明'

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                <p className="text-gray-500 flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-1" />
                  {user.email}
                </p>
              </div>
            </div>
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Shield className="w-4 h-4 mr-2" />
                管理画面
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 左側 - アカウント情報 */}
          <div className="md:col-span-2 space-y-6">
            {/* 基本情報 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">アカウント情報</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">ユーザー名</label>
                  <p className="text-gray-900 font-medium">{displayName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">メールアドレス</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">アカウントタイプ</label>
                  <p className="text-gray-900">
                    {userRole === 'admin' && '管理者'}
                    {userRole === 'developer' && '開発者'}
                    {userRole === 'verified_dev' && '認証済み開発者'}
                    {userRole === 'pro_subscriber' && 'Proサブスクライバー'}
                    {userRole === 'enterprise' && 'エンタープライズ'}
                    {userRole === 'end_user' && '一般ユーザー'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">登録日</label>
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {joinDate}
                  </p>
                </div>
              </div>
            </div>

            {/* サブスクリプション情報 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">サブスクリプション</h2>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">無料プラン</p>
                      <p className="text-sm text-gray-500">基本機能を利用可能</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      アクティブ
                    </span>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                  プレミアムプランにアップグレード
                </button>
              </div>
            </div>
          </div>

          {/* 右側 - クイックリンク */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">クイックリンク</h2>
              <div className="space-y-2">
                <Link
                  href="/account/settings"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 mr-3 text-gray-600" />
                    <span className="text-gray-900">アカウント設定</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                
                <Link
                  href="/articles"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3 text-gray-600" />
                    <span className="text-gray-900">記事一覧</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-between w-full p-3 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <LogOut className="w-5 h-5 mr-3 text-red-600" />
                    <span className="text-red-600">ログアウト</span>
                  </div>
                </button>
              </div>
            </div>

            {/* お知らせ */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">お知らせ</h2>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900 font-medium">新機能リリース</p>
                  <p className="text-xs text-blue-700 mt-1">ファクトチェック機能が追加されました</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900 font-medium">メンテナンス予定</p>
                  <p className="text-xs text-gray-700 mt-1">定期メンテナンスの予定はありません</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}