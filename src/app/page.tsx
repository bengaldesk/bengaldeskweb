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
import { MostReadSidebar } from '@/components/news/most-read-sidebar'
import { BottomNav } from '@/components/news/bottom-nav'

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col bg-page-bg'>
      <TopBar />
      <Header />
      <BreakingNewsTicker />

      <main className='flex-1 pb-safe'>
        <h1 className='sr-only'>বার্তা — বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ</h1>
        <HeroSection />
        <AdBox className='my-6' />

        {/* Content + Sidebar layout (desktop) */}
        <div className='mx-auto max-w-7xl px-4 sm:px-6'>
          <div className='lg:grid lg:grid-cols-12 lg:gap-8'>
            {/* Main content area */}
            <div className='lg:col-span-8 xl:col-span-9'>
              <LatestNews />
              <AreaNewsSearch />
              <CategorySection category='রাজনীতি' />
              <AdBox className='my-6' />
              <CategorySection category='খেলা' />
              <CategorySection category='প্রযুক্তি' />
              <AdBox className='my-6' />
              <VideoSection />
              <OpinionSection />
              <PollSection />
              <Newsletter />
            </div>

            {/* Right sidebar (desktop only) */}
            <aside className='mt-8 hidden lg:col-span-4 lg:mt-0 xl:col-span-3 lg:block'>
              <div className='sticky top-20 space-y-6'>
                <MostReadSidebar />
                <AdBox format='rectangle' />
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
