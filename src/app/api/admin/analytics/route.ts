import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserServer } from '@/lib/auth-server'
import {
  getGA4Overview,
  getGA4TopPages,
  getGA4TrafficSources,
  getGA4TimeSeries,
  formatDuration,
  formatBounceRate,
  formatGA4Date,
  GAMetrics,
  GAPageMetrics,
  GATrafficSource,
  GATimeSeriesData,
} from '@/lib/google-analytics'

export async function GET(request: NextRequest) {
  try {
    // 管理者権限チェック
    const { user, error } = await getCurrentUserServer()
    if (!user || error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 管理者権限をチェック（profile.user_roleがadminかどうか）
    if (user.profile?.user_role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7days' // 7days, 30days, 90days
    const reportType = searchParams.get('type') || 'overview' // overview, pages, sources, timeseries

    // GA4プロパティIDを環境変数から取得
    const propertyId = process.env.GA4_PROPERTY_ID
    if (!propertyId) {
      return NextResponse.json({ 
        error: 'Google Analytics not configured',
        message: 'GA4_PROPERTY_ID environment variable not set'
      }, { status: 500 })
    }

    // 期間を設定
    let startDate: string
    switch (period) {
      case '30days':
        startDate = '30daysAgo'
        break
      case '90days':
        startDate = '90daysAgo'
        break
      case '7days':
      default:
        startDate = '7daysAgo'
        break
    }

    let data: any = null

    switch (reportType) {
      case 'overview': {
        const overview = await getGA4Overview(propertyId, startDate, 'today')
        if (overview) {
          data = {
            ...overview,
            formattedBounceRate: formatBounceRate(overview.bounceRate),
            formattedAverageSessionDuration: formatDuration(overview.averageSessionDuration),
          }
        }
        break
      }

      case 'pages': {
        const pages = await getGA4TopPages(propertyId, startDate, 'today', 20)
        data = pages.map(page => ({
          ...page,
          formattedAverageTimeOnPage: formatDuration(page.averageTimeOnPage),
          formattedBounceRate: formatBounceRate(page.bounceRate),
          shortPath: page.path.length > 50 ? page.path.substring(0, 50) + '...' : page.path,
          shortTitle: page.title.length > 60 ? page.title.substring(0, 60) + '...' : page.title,
        }))
        break
      }

      case 'sources': {
        const sources = await getGA4TrafficSources(propertyId, startDate, 'today', 15)
        data = sources.map(source => ({
          ...source,
          formattedBounceRate: formatBounceRate(source.bounceRate),
          displaySource: source.source === '(direct)' ? 'ダイレクト' :
                        source.source === '(not set)' ? '不明' : source.source,
          displayMedium: source.medium === '(none)' ? 'なし' :
                        source.medium === 'organic' ? 'オーガニック検索' :
                        source.medium === 'referral' ? 'リファラー' :
                        source.medium === 'social' ? 'ソーシャル' : source.medium,
        }))
        break
      }

      case 'timeseries': {
        const timeSeries = await getGA4TimeSeries(propertyId, startDate, 'today')
        data = timeSeries.map(item => ({
          ...item,
          formattedDate: formatGA4Date(item.date),
          // 7日移動平均を計算（データポイントが多い場合）
        }))
        break
      }

      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
      period,
      reportType,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json({
      error: 'Failed to fetch analytics data',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

// Analytics APIの設定情報を取得するエンドポイント
export async function POST(request: NextRequest) {
  try {
    // 管理者権限チェック
    const { user, error } = await getCurrentUserServer()
    if (!user || error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.profile?.user_role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { action } = body

    if (action === 'test_connection') {
      const propertyId = process.env.GA4_PROPERTY_ID
      if (!propertyId) {
        return NextResponse.json({ 
          connected: false,
          error: 'GA4_PROPERTY_ID not configured'
        })
      }

      // テスト用に簡単なデータを取得してみる
      const testData = await getGA4Overview(propertyId, 'yesterday', 'today')
      
      return NextResponse.json({
        connected: testData !== null,
        propertyId: propertyId,
        message: testData ? 'Google Analytics connection successful' : 'Unable to fetch data from Google Analytics'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Analytics API POST Error:', error)
    return NextResponse.json({
      error: 'Failed to test analytics connection',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}