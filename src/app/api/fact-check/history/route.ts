import { NextRequest, NextResponse } from 'next/server'
import { recordFactCheckHistory, getFactCheckHistory } from '@/lib/fact-check'
import { getCurrentUserServer } from '@/lib/auth-server'

// 履歴記録
export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getCurrentUserServer()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId, itemId, verificationStatus, previousValue, newValue, notes, confidenceLevel } = body

    const history = await recordFactCheckHistory(
      sessionId,
      itemId,
      user.id,
      verificationStatus,
      previousValue,
      newValue,
      notes,
      confidenceLevel
    )
    
    return NextResponse.json({ history })
  } catch (error) {
    console.error('Error recording fact check history:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 履歴取得
export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await getCurrentUserServer()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const history = await getFactCheckHistory(itemId || undefined, limit, offset)
    
    return NextResponse.json({ history })
  } catch (error) {
    console.error('Error fetching fact check history:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}