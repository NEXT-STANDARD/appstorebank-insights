import { NextRequest, NextResponse } from 'next/server'
import { searchArticles } from '@/lib/articles'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    if (!query || query.trim().length === 0) {
      return NextResponse.json({ articles: [] })
    }
    
    const { articles, error } = await searchArticles(query.trim(), limit)
    
    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }
    
    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Search API Error:', error)
    return NextResponse.json(
      { error: 'Failed to search articles' },
      { status: 500 }
    )
  }
}