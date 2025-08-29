'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCurrentUser, signOut } from '@/lib/auth'
import type { ExtendedUser } from '@/lib/auth'
import { User, LogOut, Settings, Shield, ChevronDown } from 'lucide-react'

export default function UserMenu() {
  const router = useRouter()
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    // クリック外でドロップダウンを閉じる
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const checkUser = async () => {
    try {
      const { user: currentUser, error } = await getCurrentUser()
      if (!error && currentUser) {
        setUser(currentUser)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-9 w-20 bg-gray-200 rounded-lg"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-3">
        <Link
          href="/login"
          className="text-neutral-700 hover:text-primary-600 font-medium text-sm transition-colors"
        >
          ログイン
        </Link>
        <Link
          href="/signup"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
        >
          新規登録
        </Link>
      </div>
    )
  }

  const displayName = user.profile?.display_name || user.email?.split('@')[0] || 'ユーザー'
  const userRole = user.profile?.user_role || 'end_user'
  const isAdmin = userRole === 'admin'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 text-neutral-700 hover:text-primary-600 font-medium text-sm transition-colors p-2 rounded-lg hover:bg-gray-50"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:inline">{displayName}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/account"
              className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <User className="w-4 h-4 mr-2" />
              マイアカウント
            </Link>

            <Link
              href="/account/settings"
              className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Settings className="w-4 h-4 mr-2" />
              設定
            </Link>

            {isAdmin && (
              <>
                <div className="border-t border-gray-100 my-1"></div>
                <Link
                  href="/admin"
                  className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  管理画面
                </Link>
              </>
            )}
          </div>

          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </button>
          </div>
        </div>
      )}
    </div>
  )
}