import { NextRequest, NextResponse } from 'next/server'
import { createFactCheckSession, updateFactCheckSession, completeFactCheckSession } from '@/lib/fact-check'
import { getCurrentUserServer } from '@/lib/auth-server'

// セッション作成
export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getCurrentUserServer()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { totalItems } = body

    const session = await createFactCheckSession(user.id, totalItems)
    
    return NextResponse.json({ session })
  } catch (error) {
    console.error('Error creating fact check session:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// セッション更新
export async function PUT(request: NextRequest) {
  try {
    const { user, error: authError } = await getCurrentUserServer()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId, updates } = body

    const session = await updateFactCheckSession(sessionId, updates)
    
    return NextResponse.json({ session })
  } catch (error) {
    console.error('Error updating fact check session:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}