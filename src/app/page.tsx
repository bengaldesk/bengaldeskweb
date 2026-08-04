import { TopBar } from '@/components/news/top-bar'
import { Header } from '@/components/news/header'
import { BreakingNewsTicker } from '@/components/news/breaking-ticker'
import { HeroSection } from '@/components/news/hero-section'
import { LatestNews } from '@/components/news/latest-news'
import { CategorySection } from '@/components/news/category-section'
import { AreaNewsSearch } from '@/components/news/area-news-search'
import { VideoSection } from '@/components/news/video-section'
import { OpinionSection } from '@/components/news/opinion-section'
import { Newsletter } from '@/components/news/newsletter'
import { PollSection } from '@/components/news/poll-section'
import { Footer } from '@/components/news/footer'
import { AdBox } from '@/components/news/ad-box'

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <TopBar />
      <Header />
      <BreakingNewsTicker />

      <main className='flex-1'>
        <h1 className='sr-only'>বার্তা — বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ</h1>
        <HeroSection />
        <AdBox className="my-10" />
        <LatestNews />
        <AreaNewsSearch />
        <CategorySection category='রাজনীতি' />
        <AdBox className="my-10" />
        <CategorySection category='খেলা' />
        <CategorySection category='প্রযুক্তি' />
        <AdBox className="my-10" />
        <VideoSection />
         <OpinionSection />
        <PollSection />
        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}
