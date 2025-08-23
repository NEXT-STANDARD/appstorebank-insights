import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'AppStoreBank Insights'
    const category = searchParams.get('category') || '業界洞察'
    const date = searchParams.get('date') || new Date().toLocaleDateString('ja-JP')

    // カテゴリに応じたアイコンと色を設定
    const categoryConfig = {
      '市場分析': { icon: '📊', color: '#3399ff' },
      'グローバルトレンド': { icon: '🌏', color: '#10b981' },
      '法規制': { icon: '⚖️', color: '#ef4444' },
      '技術解説': { icon: '🔧', color: '#8b5cf6' },
      'ニュース': { icon: '📰', color: '#f59e0b' },
      'default': { icon: '📋', color: '#6b7280' }
    }

    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.default

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#f8faff',
            backgroundImage: 'linear-gradient(135deg, #f8faff 0%, #e6f2ff 50%, #fff0f5 100%)',
            padding: '60px 80px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #3399ff 0%, #66b3ff 100%)',
                color: 'white',
                fontSize: '28px',
                fontWeight: 'bold',
                padding: '16px 24px',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(51, 153, 255, 0.3)',
              }}
            >
              AppStoreBank
            </div>
            <div
              style={{
                color: '#64748b',
                fontSize: '24px',
                fontWeight: '600',
              }}
            >
              Insights
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              flex: 1,
              width: '100%',
            }}
          >
            {/* Category */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '32px' }}>{config.icon}</div>
              <div
                style={{
                  backgroundColor: `${config.color}20`,
                  color: config.color,
                  fontSize: '18px',
                  fontWeight: '600',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: `2px solid ${config.color}40`,
                }}
              >
                {category}
              </div>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: title.length > 60 ? '48px' : '56px',
                fontWeight: 'bold',
                color: '#1e293b',
                lineHeight: '1.2',
                margin: 0,
                letterSpacing: '-0.025em',
              }}
            >
              {title}
            </h1>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginTop: '40px',
            }}
          >
            <div
              style={{
                color: '#64748b',
                fontSize: '20px',
                fontWeight: '500',
              }}
            >
              {date} • 専門的な洞察とトレンド分析
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#64748b',
                fontSize: '18px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: config.color,
                }}
              />
              insights.appstorebank.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}