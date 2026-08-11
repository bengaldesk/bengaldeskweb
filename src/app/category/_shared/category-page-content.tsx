import Link from 'next/link'
import {
  getByCategory,
  NEWS_CATEGORIES,
  categoryColor,
  CATEGORY_SLUG_MAP,
  type NewsCategory,
} from '@/lib/news-data'
import { TopBar } from '@/components/news/top-bar'
import { Header } from '@/components/news/header'
import { BreakingNewsTicker } from '@/components/news/breaking-ticker'
import { Newsletter } from '@/components/news/newsletter'
import { Footer } from '@/components/news/footer'
import { BottomNav } from '@/components/news/bottom-nav'
import { LeadStoryCard } from '@/components/news/lead-story-card'
import { Home, ChevronRight, Clock } from 'lucide-react'
import { relativeTimeBn, toBn } from '@/lib/bn'
import { NewsImage } from '@/components/news/news-image'
import { cn } from '@/lib/utils'

export function CategoryPageContent({ category }: { category: NewsCategory }) {
  const allNews = getByCategory(category)
  const color = categoryColor(category)
  const otherCategories = NEWS_CATEGORIES.filter((c) => c.label !== category)

  // Featured lead story + rest
  const [lead, ...rest] = allNews.length > 0
    ? [allNews[0], ...allNews.slice(1)]
    : [null, ...allNews]

  return (
    <div className='flex min-h-screen flex-col bg-page-bg'>
      <TopBar />
      <Header />
      <BreakingNewsTicker />

      {/* Breadcrumb */}
      <nav aria-label='Breadcrumb' className='bg-card'>
        <ol className='mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3 text-sm text-muted-foreground sm:px-6'>
          <li>
            <Link href='/' className='inline-flex items-center gap-1 transition-colors hover:text-brand'>
              <Home className='h-3.5 w-3.5' />
              প্রচ্ছদ
            </Link>
          </li>
          <li><ChevronRight className='h-3.5 w-3.5' /></li>
          <li><span className='font-semibold text-foreground'>{category}</span></li>
        </ol>
      </nav>

      {/* Category tabs */}
      <div className='border-b border-border bg-card'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6'>
          <div className='scrollbar-hide -mx-4 flex items-center gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0'>
            {NEWS_CATEGORIES.map((c) => {
              const isActive = c.label === category
              return (
                <Link
                  key={c.label}
                  href={`/category/${CATEGORY_SLUG_MAP[c.label]}`}
                  className={cn(
                    'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? `${c.color} text-white`
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {c.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <main className='flex-1 pb-safe'>
        <h1 className='sr-only'>{category} — The Bengal Desk</h1>

        <div className='mx-auto max-w-7xl px-4 pt-6 sm:px-6'>
          {/* Category title */}
          <div className='section-header'>
            <h2 className='flex items-center gap-3'>
              <span className={cn('inline-block h-4 w-1.5 rounded-full', color)} />
              {category}
              <span className='text-sm font-normal text-muted-foreground'>({toBn(String(allNews.length))} টি সংবাদ)</span>
            </h2>
          </div>

          {/* Featured lead story */}
          {lead && (
            <div className='mt-4'>
              <LeadStoryCard
                item={lead}
                subItems={rest.slice(0, 3)}
              />
            </div>
          )}

          {/* Rest of the news — 2-col grid on mobile, 3-col on desktop */}
          {rest.length > 3 && (
            <div className='mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3'>
              {rest.slice(3).map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className='group block rounded-lg overflow-hidden bg-card news-card-hover'
                >
                  <div className='relative aspect-[16/10] w-full overflow-hidden bg-muted'>
                    <NewsImage
                      src={item.image}
                      alt={item.title}
                      sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px'
                      className='img-zoom'
                    />
                  </div>
                  <div className='p-3'>
                    <h3 className='line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-brand sm:text-sm'>
                      {item.title}
                    </h3>
                    <div className='mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground'>
                      <span className='inline-flex items-center gap-1'><Clock className='h-2.5 w-2.5' />{relativeTimeBn(new Date(item.publishedAt))}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty state */}
          {allNews.length === 0 && (
            <div className='py-16 text-center'>
              <p className='text-lg text-muted-foreground'>এই বিভাগে এখনো কোনো খবর প্রকাশিত হয়নি</p>
              <Link href='/' className='mt-2 inline-block text-sm font-medium text-brand hover:underline'>
                প্রচ্ছদে ফিরে যান
              </Link>
            </div>
          )}

          {/* Other categories */}
          <div className='mt-10'>
            <div className='section-header'>
              <h2>অন্যান্য বিভাগ</h2>
            </div>
            <div className='flex flex-wrap gap-2'>
              {otherCategories.map((c) => (
                <Link
                  key={c.label}
                  href={`/category/${CATEGORY_SLUG_MAP[c.label]}`}
                  className={cn(
                    'inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90',
                    c.color
                  )}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>

          <Newsletter />
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
