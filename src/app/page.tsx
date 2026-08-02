import { TopBar } from '@/components/news/top-bar'
import { Header } from '@/components/news/header'
import { BreakingNewsTicker } from '@/components/news/breaking-ticker'
import { HeroSection } from '@/components/news/hero-section'
import { LatestNews } from '@/components/news/latest-news'
import { CategorySection } from '@/components/news/category-section'
import { VideoSection } from '@/components/news/video-section'
import { OpinionSection } from '@/components/news/opinion-section'
import { Newsletter } from '@/components/news/newsletter'
import { Footer } from '@/components/news/footer'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar />
      <Header />
      <BreakingNewsTicker />

      <main className="flex-1">
        <h1 className="sr-only">বার্তা — বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ</h1>
        <HeroSection />
        <LatestNews />
        <CategorySection category="রাজনীতি" />
        <div className="bg-secondary/40">
          <CategorySection category="খেলা" className="bg-transparent" />
        </div>
        <CategorySection category="প্রযুক্তি" />
        <VideoSection />
        <OpinionSection />
        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}
