'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, updatePassword } from '@/lib/auth'
import { updateProfile } from '@/lib/auth'
import type { ExtendedUser } from '@/lib/auth'
import { ArrowLeft, User, Mail, Lock, Bell, Shield, Save } from 'lucide-react'

export default function AccountSettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [displayName, setDisplayName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    marketing: false
  })

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { user: currentUser, error } = await getCurrentUser()
      if (!error && currentUser) {
        setUser(currentUser)
        setDisplayName(currentUser.profile?.display_name || currentUser.email?.split('@')[0] || '')
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    if (!user) return
    
    setSaving(true)
    setMessage(null)
    
    try {
      const { error } = await updateProfile(user.id, {
        display_name: displayName
      })
      
      if (error) {
        setMessage({ type: 'error', text: 'プロフィールの更新に失敗しました' })
      } else {
        setMessage({ type: 'success', text: 'プロフィールを更新しました' })
        // ユーザー情報を再取得
        await checkUser()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'エラーが発生しました' })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'パスワードが一致しません' })
      return
    }
    
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'パスワードは6文字以上で入力してください' })
      return
    }
    
    setSaving(true)
    setMessage(null)
    
    try {
      const { error } = await updatePassword(newPassword)
      
      if (error) {
        setMessage({ type: 'error', text: 'パスワードの更新に失敗しました' })
      } else {
        setMessage({ type: 'success', text: 'パスワードを更新しました' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'エラーが発生しました' })
    } finally {
      setSaving(false)
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            アカウントに戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">アカウント設定</h1>
          <p className="text-gray-600 mt-2">プロフィールやセキュリティ設定を管理します</p>
        </div>

        {/* メッセージ表示 */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* プロフィール設定 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 mr-2 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">プロフィール</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  表示名
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="表示名を入力"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-900">{user.email}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">メールアドレスの変更はサポートにお問い合わせください</p>
              </div>
              
              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? '保存中...' : 'プロフィールを更新'}
              </button>
            </div>
          </div>

          {/* セキュリティ設定 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Lock className="w-5 h-5 mr-2 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">セキュリティ</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  新しいパスワード
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="新しいパスワード（6文字以上）"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  パスワードの確認
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="パスワードを再入力"
                />
              </div>
              
              <button
                onClick={handleUpdatePassword}
                disabled={saving || !newPassword || !confirmPassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <Lock className="w-4 h-4 mr-2" />
                {saving ? '更新中...' : 'パスワードを変更'}
              </button>
            </div>
          </div>

          {/* 通知設定 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 mr-2 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">通知設定</h2>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">メール通知</p>
                  <p className="text-sm text-gray-500">重要なお知らせをメールで受け取る</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">ブラウザ通知</p>
                  <p className="text-sm text-gray-500">ブラウザでプッシュ通知を受け取る</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.browser}
                  onChange={(e) => setNotifications({ ...notifications, browser: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">マーケティングメール</p>
                  <p className="text-sm text-gray-500">新機能やキャンペーン情報を受け取る</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.marketing}
                  onChange={(e) => setNotifications({ ...notifications, marketing: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* 危険ゾーン */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-red-100">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 mr-2 text-red-600" />
              <h2 className="text-lg font-semibold text-red-900">危険ゾーン</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-900 font-medium mb-2">アカウントの削除</p>
                <p className="text-sm text-gray-600 mb-3">
                  アカウントを削除すると、すべてのデータが完全に削除され、復元できません。
                </p>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  アカウントを削除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}