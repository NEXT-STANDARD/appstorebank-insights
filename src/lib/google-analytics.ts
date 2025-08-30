import { BetaAnalyticsDataClient } from '@google-analytics/data'

// サーバーサイド専用 - クライアントサイドでは使用しない
let analyticsDataClient: BetaAnalyticsDataClient | null = null

function getAnalyticsClient() {
  if (!analyticsDataClient) {
    // 環境変数またはサービスアカウントキーファイルからクレデンシャルを取得
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      analyticsDataClient = new BetaAnalyticsDataClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      })
    } else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      // JSON形式のサービスアカウントキー
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
      analyticsDataClient = new BetaAnalyticsDataClient({
        credentials,
      })
    } else {
      console.error('Google Analytics credentials not found')
      return null
    }
  }
  return analyticsDataClient
}

export interface GAMetrics {
  totalUsers: number
  newUsers: number
  sessions: number
  bounceRate: number
  averageSessionDuration: number
  pageViews: number
  uniquePageViews: number
  screenPageViews: number
}

export interface GAPageMetrics {
  path: string
  title: string
  views: number
  uniqueViews: number
  averageTimeOnPage: number
  bounceRate: number
}

export interface GATrafficSource {
  source: string
  medium: string
  users: number
  sessions: number
  bounceRate: number
}

export interface GATimeSeriesData {
  date: string
  users: number
  sessions: number
  pageViews: number
}

export async function getGA4Overview(
  propertyId: string,
  startDate: string = '7daysAgo',
  endDate: string = 'today'
): Promise<GAMetrics | null> {
  const client = getAnalyticsClient()
  if (!client) return null

  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      metrics: [
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
        { name: 'screenPageViews' },
      ],
    })

    const row = response.rows?.[0]
    if (!row) return null

    return {
      totalUsers: parseInt(row.metricValues?.[0]?.value || '0'),
      newUsers: parseInt(row.metricValues?.[1]?.value || '0'),
      sessions: parseInt(row.metricValues?.[2]?.value || '0'),
      bounceRate: parseFloat(row.metricValues?.[3]?.value || '0'),
      averageSessionDuration: parseFloat(row.metricValues?.[4]?.value || '0'),
      pageViews: parseInt(row.metricValues?.[5]?.value || '0'),
      uniquePageViews: parseInt(row.metricValues?.[5]?.value || '0'), // GA4では同じ値
      screenPageViews: parseInt(row.metricValues?.[5]?.value || '0'),
    }
  } catch (error) {
    console.error('Error fetching GA4 overview:', error)
    return null
  }
}

export async function getGA4TopPages(
  propertyId: string,
  startDate: string = '7daysAgo',
  endDate: string = 'today',
  limit: number = 10
): Promise<GAPageMetrics[]> {
  const client = getAnalyticsClient()
  if (!client) return []

  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [
        { name: 'pagePath' },
        { name: 'pageTitle' },
      ],
      metrics: [
        { name: 'screenPageViews' },
      ],
      orderBys: [
        {
          metric: {
            metricName: 'screenPageViews',
          },
          desc: true,
        },
      ],
      limit,
    })

    return response.rows?.map((row) => ({
      path: row.dimensionValues?.[0]?.value || '',
      title: row.dimensionValues?.[1]?.value || '',
      views: parseInt(row.metricValues?.[0]?.value || '0'),
      uniqueViews: parseInt(row.metricValues?.[0]?.value || '0'), // GA4では同じ値
      averageTimeOnPage: 0, // 簡略化のため一時的に0に設定
      bounceRate: 0, // 簡略化のため一時的に0に設定
    })) || []
  } catch (error) {
    console.error('Error fetching GA4 top pages:', error)
    return []
  }
}

export async function getGA4TrafficSources(
  propertyId: string,
  startDate: string = '7daysAgo',
  endDate: string = 'today',
  limit: number = 10
): Promise<GATrafficSource[]> {
  const client = getAnalyticsClient()
  if (!client) return []

  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [
        { name: 'sessionSource' },
        { name: 'sessionMedium' },
      ],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'bounceRate' },
      ],
      orderBys: [
        {
          metric: {
            metricName: 'totalUsers',
          },
          desc: true,
        },
      ],
      limit,
    })

    return response.rows?.map((row) => ({
      source: row.dimensionValues?.[0]?.value || '',
      medium: row.dimensionValues?.[1]?.value || '',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
      bounceRate: parseFloat(row.metricValues?.[2]?.value || '0'),
    })) || []
  } catch (error) {
    console.error('Error fetching GA4 traffic sources:', error)
    return []
  }
}

export async function getGA4TimeSeries(
  propertyId: string,
  startDate: string = '30daysAgo',
  endDate: string = 'today'
): Promise<GATimeSeriesData[]> {
  const client = getAnalyticsClient()
  if (!client) return []

  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [
        { name: 'date' },
      ],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
      orderBys: [
        {
          dimension: {
            dimensionName: 'date',
          },
          desc: false,
        },
      ],
    })

    return response.rows?.map((row) => ({
      date: row.dimensionValues?.[0]?.value || '',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
      pageViews: parseInt(row.metricValues?.[2]?.value || '0'),
    })) || []
  } catch (error) {
    console.error('Error fetching GA4 time series:', error)
    return []
  }
}

// ヘルパー関数
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function formatBounceRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`
}

export function formatGA4Date(dateString: string): string {
  // GA4の日付形式（YYYYMMDD）を読みやすい形式に変換
  const year = dateString.substring(0, 4)
  const month = dateString.substring(4, 6)
  const day = dateString.substring(6, 8)
  return `${year}/${month}/${day}`
}