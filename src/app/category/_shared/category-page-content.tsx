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
import { Home, ChevronRight, Clock, Eye } from 'lucide-react'
import { relativeTimeBn, toBn } from '@/lib/bn'

export function CategoryPageContent({ category }: { category: NewsCategory }) {
  const allNews = getByCategory(category)
  const color = categoryColor(category)
  const otherCategories = NEWS_CATEGORIES.filter((c) => c.label !== category)

  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <TopBar />
      <Header />
      <BreakingNewsTicker />

      <nav aria-label='Breadcrumb' className='mx-auto max-w-7xl px-4 pt-4 sm:px-6'>
        <ol className='flex items-center gap-1.5 text-sm text-muted-foreground'>
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

      <div className='border-b border-border'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6'>
          <div className='scrollbar-hide -mx-4 flex items-center gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0'>
            {NEWS_CATEGORIES.map((c) => {
              const isActive = c.label === category
              return (
                <Link
                  key={c.label}
                  href={`/category/${CATEGORY_SLUG_MAP[c.label]}`}
                  className={`shrink-0 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? `${c.color} text-white` : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                >
                  {c.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <main className='flex-1'>
        <h1 className='sr-only'>{category} — বার্তা</h1>

        <div className='mx-auto max-w-7xl px-4 pt-6 sm:px-6'>
          <div className='flex items-center gap-3 pb-3 border-b-2 border-brand'>
            <span className={`inline-block h-4 w-1.5 rounded-full ${color}`} />
            <h2 className='text-2xl font-bold text-foreground sm:text-3xl'>{category}</h2>
            <span className='text-sm text-muted-foreground'>({toBn(String(allNews.length))} টি সংবাদ)</span>
          </div>
        </div>

        <div className='mx-auto max-w-7xl px-4 pt-6 sm:px-6'>
          {allNews.length > 0 ? (
            <div className='divide-y divide-border/40'>
              {allNews.map((item) => (
                <Link key={item.id} href={`/news/${item.id}`} className='group flex gap-3 border-b border-border/40 py-3 transition-colors'>
                  <div className='relative aspect-square h-20 w-20 shrink-0 overflow-hidden bg-muted sm:h-24 sm:w-24'>
                    <img src={item.image} alt={item.title} className='h-full w-full object-cover' />
                  </div>
                  <div className='flex min-w-0 flex-col justify-center'>
                    <h3 className='line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-brand sm:text-[15px]'>{item.title}</h3>
                    <div className='mt-1 flex flex-wrap items-center gap-x-3 text-[11px] text-muted-foreground'>
                      <span className='inline-flex items-center gap-1'><Clock className='h-3 w-3' />{relativeTimeBn(new Date(item.publishedAt))}</span>
                      <span className='inline-flex items-center gap-1'><Eye className='h-3 w-3' />{toBn(item.views.toLocaleString('en-US'))}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className='py-12 text-center text-muted-foreground'>
              <p className='text-lg'>এই বিভাগে এখনো কোনো খবর প্রকাশিত হয়নি</p>
              <Link href='/' className='mt-2 inline-block text-sm font-medium text-brand hover:underline'>প্রচ্ছদে ফিরে যান</Link>
            </div>
          )}
        </div>

        <div className='mx-auto max-w-7xl px-4 pb-12 pt-8'>
          <div className='mb-3 pb-2.5 border-b-2 border-brand'>
            <h2 className='text-xl font-bold text-foreground'>অন্যান্য বিভাগ</h2>
          </div>
          <div className='flex flex-wrap gap-2'>
            {otherCategories.map((c) => (
              <Link
                key={c.label}
                href={`/category/${CATEGORY_SLUG_MAP[c.label]}`}
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 ${c.color}`}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}
