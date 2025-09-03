import { Metadata } from 'next'
import { redirect } from 'next/navigation'

// カテゴリページは/articlesページにリダイレクト
export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  return {
    title: `${params.category}の記事 | AppStoreBank Insights`,
    description: `${params.category}カテゴリの記事一覧`,
  }
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  // /articlesページにカテゴリパラメータ付きでリダイレクト
  redirect(`/articles?category=${params.category}`)
}