'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
// API経由でデータ取得
import type { AppStore } from '@/lib/app-stores'
import { statusMapping, statusColors } from '@/lib/app-stores'

export default function AdminAppStoresPage() {
  const [appStores, setAppStores] = useState<AppStore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    loadAppStores()
  }, [])

  const loadAppStores = async () => {
    try {
      const response = await fetch('/api/admin/app-stores')
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Failed to load app stores')
      } else {
        setAppStores(data.appStores || [])
      }
    } catch (err) {
      setError('Failed to load app stores')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除してもよろしいですか？この操作は取り消せません。`)) {
      return
    }

    setDeleteLoading(id)
    try {
      const response = await fetch(`/api/admin/app-stores/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      
      if (!response.ok) {
        alert(`削除に失敗しました: ${data.error}`)
      } else {
        setAppStores(prev => prev.filter(store => store.id !== id))
        alert('アプリストアを削除しました')
      }
    } catch (err) {
      console.error('Error deleting app store:', err)
      alert('削除中にエラーが発生しました')
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index <= 0) return

    const newAppStores = [...appStores]
    const temp = newAppStores[index]
    newAppStores[index] = newAppStores[index - 1]
    newAppStores[index - 1] = temp

    // 表示順序を更新
    const updates = newAppStores.map((store, idx) => ({
      id: store.id,
      display_order: idx + 1
    }))

    try {
      const response = await fetch('/api/admin/app-stores', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates })
      })
      const data = await response.json()
      
      if (!response.ok) {
        alert(`順序更新に失敗しました: ${data.error}`)
        return
      }
      
      setAppStores(newAppStores)
    } catch (err) {
      console.error('Error updating order:', err)
      alert('順序更新中にエラーが発生しました')
    }
  }

  const handleMoveDown = async (index: number) => {
    if (index >= appStores.length - 1) return

    const newAppStores = [...appStores]
    const temp = newAppStores[index]
    newAppStores[index] = newAppStores[index + 1]
    newAppStores[index + 1] = temp

    // 表示順序を更新
    const updates = newAppStores.map((store, idx) => ({
      id: store.id,
      display_order: idx + 1
    }))

    try {
      const response = await fetch('/api/admin/app-stores', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates })
      })
      const data = await response.json()
      
      if (!response.ok) {
        alert(`順序更新に失敗しました: ${data.error}`)
        return
      }
      
      setAppStores(newAppStores)
    } catch (err) {
      console.error('Error updating order:', err)
      alert('順序更新中にエラーが発生しました')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">アプリストア管理</h1>
              <p className="mt-1 text-sm text-neutral-600">
                アプリストア情報の追加・編集・削除を行えます
              </p>
            </div>
            <Link
              href="/admin/app-stores/new"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium transition-colors"
            >
              新しいアプリストアを追加
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="text-red-800 text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* App Stores List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-neutral-200 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-neutral-900">
                登録済みアプリストア ({appStores.length}件)
              </h3>
              <div className="text-sm text-neutral-500">
                ドラッグまたは矢印ボタンで順序変更が可能です
              </div>
            </div>
          </div>
          
          {appStores.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <div className="text-neutral-500">
                アプリストアが登録されていません
              </div>
              <Link
                href="/admin/app-stores/new"
                className="mt-2 inline-flex items-center text-primary-600 hover:text-primary-700"
              >
                最初のアプリストアを追加する →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {appStores.map((store, index) => (
                <div key={store.id} className="px-4 py-4 sm:px-6 hover:bg-neutral-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Logo */}
                      <div className="flex-shrink-0">
                        {store.logo_emoji ? (
                          <span className="text-2xl">{store.logo_emoji}</span>
                        ) : store.logo_url ? (
                          <img src={store.logo_url} alt={store.name} className="w-8 h-8 rounded" />
                        ) : (
                          <div className="w-8 h-8 bg-neutral-200 rounded flex items-center justify-center">
                            <span className="text-xs text-neutral-500">📱</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {store.name}
                          </p>
                          <span className={`px-2 py-1 text-xs rounded-full ${statusColors[store.status]}`}>
                            {statusMapping[store.status]}
                          </span>
                          {store.is_featured && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              注目
                            </span>
                          )}
                          {!store.is_third_party && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              公式
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-xs text-neutral-500">
                          <span>{store.company}</span>
                          {store.commission_rate && <span>手数料: {store.commission_rate}</span>}
                          <span>順序: {store.display_order}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {/* Order Controls */}
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="上に移動"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === appStores.length - 1}
                          className="p-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="下に移動"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      {/* Edit Button */}
                      <Link
                        href={`/admin/app-stores/${store.id}/edit`}
                        className="text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50"
                        title="編集"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(store.id, store.name)}
                        disabled={deleteLoading === store.id}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
                        title="削除"
                      >
                        {deleteLoading === store.id ? (
                          <div className="animate-spin w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  {store.description && (
                    <div className="mt-2 pl-12">
                      <p className="text-sm text-neutral-600">{store.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-neutral-500">
            アプリストア情報は公開ページで即座に反映されます
          </div>
          <Link
            href="/app-stores"
            target="_blank"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            公開ページを確認 →
          </Link>
        </div>
      </div>
    </div>
  )
}