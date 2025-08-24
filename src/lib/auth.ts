import { supabase } from './supabase'

// Supabaseが利用できない場合のフォールバック
const isSupabaseAvailable = () => supabase !== null

import { User } from '@supabase/supabase-js'

// ユーザーの権限レベル（Supabaseテーブルの制約に合わせる）
export type UserRole = 'end_user' | 'developer' | 'verified_dev' | 'pro_subscriber' | 'enterprise' | 'admin'

// 拡張ユーザー情報
export interface ExtendedUser extends User {
  profile?: {
    display_name: string
    user_role: UserRole
    avatar_url?: string
  }
}

// 現在のユーザーを取得
export async function getCurrentUser(): Promise<{ user: ExtendedUser | null, error: any }> {
  try {
    if (!isSupabaseAvailable()) {
      return { user: null, error: 'Supabase not available' }
    }
    
    // セッションを確認
    const { data: { session }, error: sessionError } = await supabase!!.auth.getSession()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return { user: null, error: sessionError }
    }
    
    if (!session?.user) {
      return { user: null, error: null }
    }

    const user = session.user

    // プロファイル情報を取得
    const { data: profile, error: profileError } = await supabase!!
      .from('profiles')
      .select('display_name, user_role, avatar_url')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      // プロファイルが存在しない場合は、基本情報のみでユーザーを返す
      return { 
        user: { ...user, profile: undefined }, 
        error: profileError 
      }
    }

    const extendedUser: ExtendedUser = {
      ...user,
      profile: profile || undefined
    }

    return { user: extendedUser, error: null }
  } catch (error) {
    console.error('getCurrentUser error:', error)
    return { user: null, error }
  }
}

// 管理者かどうかチェック
export async function isAdmin(): Promise<boolean> {
  const { user } = await getCurrentUser()
  return user?.profile?.user_role === 'admin'
}

// エディター以上の権限かどうかチェック
export async function canEditArticles(): Promise<boolean> {
  const { user } = await getCurrentUser()
  return user?.profile?.user_role === 'admin' || user?.profile?.user_role === 'developer' || user?.profile?.user_role === 'verified_dev'
}

// ログイン
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase!.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Sign in error:', error)
    return { user: null, error }
  }

  return { user: data.user, error: null }
}

// ログイン（プロファイル情報付き）
export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase!.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Sign in error:', error)
    return { user: null, error }
  }

  if (!data.user) {
    return { user: null, error: new Error('ユーザー情報を取得できませんでした') }
  }

  // プロファイル情報を取得
  const { data: profile, error: profileError } = await supabase!
    .from('profiles')
    .select('display_name, user_role, avatar_url')
    .eq('id', data.user.id)
    .single()

  if (profileError) {
    console.error('Error fetching profile:', profileError)
    return { 
      user: { ...data.user, profile: undefined }, 
      error: profileError 
    }
  }

  const extendedUser: ExtendedUser = {
    ...data.user,
    profile: profile || undefined
  }

  return { user: extendedUser, error: null }
}

// ログアウト
export async function signOut() {
  const { error } = await supabase!.auth.signOut()
  
  if (error) {
    console.error('Sign out error:', error)
    return { error }
  }

  return { error: null }
}

// 管理者用ユーザー作成（サーバーサイドでのみ使用）
export async function createUser(userData: {
  email: string
  password: string
  name: string
  role: UserRole
}) {
  // この機能はServer ActionsやAPI Routesで実装する必要があります
  // Client Componentからは直接呼び出せません
  throw new Error('createUser must be called from server-side code')
}

// プロファイル更新
export async function updateProfile(userId: string, updates: {
  display_name?: string
  user_role?: UserRole
  avatar_url?: string
}) {
  const { data, error } = await supabase!
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return { profile: null, error }
  }

  return { profile: data, error: null }
}

// 権限チェック用のヘルパー関数
export function hasRole(user: ExtendedUser | null, allowedRoles: UserRole[]): boolean {
  if (!user || !user.profile) return false
  return allowedRoles.includes(user.profile.user_role)
}

// 認証状態の変更を監視
export function onAuthStateChange(callback: (user: ExtendedUser | null) => void) {
  if (!isSupabaseAvailable()) {
    return { data: { subscription: null } }
  }
  
  return supabase!.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const { user } = await getCurrentUser()
      callback(user)
    } else {
      callback(null)
    }
  })
}

// パスワードリセット
export async function resetPassword(email: string) {
  const { error } = await supabase!.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3004'}/admin/reset-password`,
  })

  if (error) {
    console.error('Password reset error:', error)
    return { error }
  }

  return { error: null }
}

// パスワード更新
export async function updatePassword(newPassword: string) {
  const { error } = await supabase!.auth.updateUser({
    password: newPassword
  })

  if (error) {
    console.error('Password update error:', error)
    return { error }
  }

  return { error: null }
}