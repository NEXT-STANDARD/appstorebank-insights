import { NextRequest, NextResponse } from 'next/server'
import { getAllAppStoresAdmin, createAppStore, updateAppStoreOrder } from '@/lib/app-stores'
import { getServerSession } from 'next-auth'

// GET - アプリストア一覧取得
export async function GET() {
  try {
    // 認証チェック（簡略化）
    // 本来はセッション確認が必要
    
    const { appStores, error } = await getAllAppStoresAdmin()
    
    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }
    
    return NextResponse.json({ appStores })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch app stores' },
      { status: 500 }
    )
  }
}

// POST - 新規アプリストア作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { appStore, error } = await createAppStore(body)
    
    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }
    
    return NextResponse.json({ appStore })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to create app store' },
      { status: 500 }
    )
  }
}

// PUT - 表示順序更新
export async function PUT(request: NextRequest) {
  try {
    const { updates } = await request.json()
    
    const { success, error } = await updateAppStoreOrder(updates)
    
    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }
    
    return NextResponse.json({ success })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}