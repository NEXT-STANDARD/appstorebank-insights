import Header from '@/components/Header'
import Hero from '@/components/Hero'
import FeaturedArticles from '@/components/FeaturedArticles'
import CategorySection from '@/components/CategorySection'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedArticles />
        <CategorySection />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}

export const revalidate = 3600 // 1時間ごとに再生成