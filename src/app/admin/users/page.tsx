'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  display_name: string
  email?: string
  user_role: string
  avatar_url?: string
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading users:', error)
      } else {
        setUsers(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-red-100 text-red-800',
      developer: 'bg-blue-100 text-blue-800',
      verified_dev: 'bg-green-100 text-green-800',
      user: 'bg-gray-100 text-gray-800'
    }
    return styles[role as keyof typeof styles] || styles.user
  }

  const getRoleDisplay = (role: string) => {
    const displays = {
      admin: '管理者',
      developer: '開発者',
      verified_dev: '認証済み開発者',
      user: '一般ユーザー'
    }
    return displays[role as keyof typeof displays] || role
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">ユーザー管理</h1>
        <div className="text-sm text-neutral-600">
          総ユーザー数: {users.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    ユーザー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    ロール
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    登録日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.display_name}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                            <span className="text-primary-700 font-semibold text-sm">
                              {user.display_name?.charAt(0) || 'U'}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-neutral-900">
                            {user.display_name || 'Unknown User'}
                          </div>
                          {user.email && (
                            <div className="text-sm text-neutral-500">
                              {user.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadge(user.user_role)}`}>
                        {getRoleDisplay(user.user_role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {new Date(user.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-primary-600 hover:text-primary-700 text-sm"
                        disabled
                      >
                        編集（近日実装）
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-500">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-neutral-800 mb-2">
              ユーザーが見つかりません
            </h3>
            <p className="text-neutral-600">
              システムにユーザーが登録されていません
            </p>
          </div>
        )}
      </div>

      {/* 今後の実装予定 */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">近日実装予定の機能</h2>
        <ul className="space-y-2 text-neutral-600">
          <li>• ユーザーロール変更</li>
          <li>• ユーザー詳細情報編集</li>
          <li>• アカウント停止・有効化</li>
          <li>• ユーザー活動履歴</li>
        </ul>
      </div>
    </div>
  )
}