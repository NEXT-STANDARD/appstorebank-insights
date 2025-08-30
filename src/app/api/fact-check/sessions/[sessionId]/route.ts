import { NextRequest, NextResponse } from 'next/server'
import { completeFactCheckSession } from '@/lib/fact-check'
import { getCurrentUserServer } from '@/lib/auth-server'

// セッション完了
export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { user, error: authError } = await getCurrentUserServer()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId } = params

    await completeFactCheckSession(sessionId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing fact check session:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}