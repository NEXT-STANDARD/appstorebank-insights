import { NextRequest, NextResponse } from 'next/server'
import { getAppStoreByIdAdmin, updateAppStore, deleteAppStore } from '@/lib/app-stores'

// GET - 特定のアプリストア取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { appStore, error } = await getAppStoreByIdAdmin(id)
    
    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }
    
    return NextResponse.json({ appStore })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch app store' },
      { status: 500 }
    )
  }
}

// PUT - アプリストア更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const { appStore, error } = await updateAppStore(id, body)
    
    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }
    
    return NextResponse.json({ appStore })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to update app store' },
      { status: 500 }
    )
  }
}

// DELETE - アプリストア削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { success, error } = await deleteAppStore(id)
    
    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }
    
    return NextResponse.json({ success })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete app store' },
      { status: 500 }
    )
  }
}