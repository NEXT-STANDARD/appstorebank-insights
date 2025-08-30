import { NextRequest, NextResponse } from 'next/server'
import { getRecentSessions, getFactCheckSummary, getSessionReport, searchFactCheckHistory } from '@/lib/fact-check'
import { getCurrentUserServer } from '@/lib/auth-server'

// レポートデータ取得
export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await getCurrentUserServer()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'sessions'
    const sessionId = searchParams.get('sessionId')
    const searchTerm = searchParams.get('search')
    const status = searchParams.get('status')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const limit = parseInt(searchParams.get('limit') || '20')

    switch (type) {
      case 'sessions':
        const sessions = await getRecentSessions(limit)
        return NextResponse.json({ sessions })

      case 'summary':
        const summary = await getFactCheckSummary()
        return NextResponse.json({ summary })

      case 'session-report':
        if (!sessionId) {
          return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
        }
        const report = await getSessionReport(sessionId)
        return NextResponse.json({ report })

      case 'search':
        const results = await searchFactCheckHistory(
          searchTerm || undefined,
          status || undefined,
          dateFrom || undefined,
          dateTo || undefined,
          limit
        )
        return NextResponse.json({ results })

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error fetching report data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}