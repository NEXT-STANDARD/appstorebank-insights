// 管理者ユーザー作成用ユーティリティ
// このスクリプトは開発時のみ使用してください

import { supabase } from './supabase'

export async function createAdminUser(adminData: {
  email: string
  password: string
  name: string
}) {
  try {
    console.log('Creating admin user via API...')

    // API Routeを通してユーザーを作成
    const response = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    })

    const result = await response.json()

    if (!response.ok) {
      return { success: false, error: result.error || 'User creation failed' }
    }

    console.log('Admin user created successfully')
    return { success: true, user: result.user }

  } catch (error: any) {
    console.error('Setup error:', error)
    return { success: false, error: error.message }
  }
}

// 使用例：
// createAdminUser({
//   email: 'admin@appstorebank.com',
//   password: 'your_secure_password',
//   name: '管理者'
// })