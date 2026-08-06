import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, ChevronRight, Clock, Eye, ArrowLeft } from 'lucide-react'
import {
  getCategoryBySlug,
  getByCategory,
  getTrending,
  NEWS_CATEGORIES,
  categoryColor,
  ALL_CATEGORY_SLUGS,
  CATEGORY_SLUG_MAP,
  OPINIONS,
  type NewsCategory,
} from '@/lib/news-data'
import { TopBar } from '@/components/news/top-bar'
import { Header } from '@/components/news/header'
import { BreakingNewsTicker } from '@/components/news/breaking-ticker'
import { NewsCard } from '@/components/news/news-card'
import { TrendingSidebar } from '@/components/news/trending-sidebar'
import { CategoryBadge } from '@/components/news/category-badge'
import { Newsletter } from '@/components/news/newsletter'
import { Footer } from '@/components/news/footer'
import { AdBox } from '@/components/news/ad-box'
import { relativeTimeBn, toBn } from '@/lib/bn'

const SLUG_TO_BN = Object.fromEntries(
  Object.entries(CATEGORY_SLUG_MAP).map(([bn, en]) => [en, bn])
)

export function generateStaticParams() {
  return ALL_CATEGORY_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  return {
    title: `${category} — বার্তা`,
    description: `বার্তায় ${category} বিভাগের সর্বশেষ সংবাদ, বিশ্লেষণ ও বিশেষ প্রতিবেদন।`,
  }
}

function Breadcrumb({ category }: { category: NewsCategory }) {
  return (
    <nav aria-label='Breadcrumb' className='mx-auto max-w-7xl px-4 pt-4 sm:px-6'>
      <ol className='flex items-center gap-1.5 text-sm text-muted-foreground'>
        <li>
          <Link
            href='/'
            className='inline-flex items-center gap-1 transition-colors hover:text-brand'
          >
            <Home className='h-3.5 w-3.5' />
            প্রচ্ছদ
          </Link>
        </li>
        <li>
          <ChevronRight className='h-3.5 w-3.5' />
        </li>
        <li>
          <span className='font-semibold text-foreground'>{category}</span>
        </li>
      </ol>
    </nav>
  )
}

function CategoryHero({
  category,
  lead,
}: {
  category: NewsCategory
  lead: NonNullable<ReturnType<typeof getByCategory>>[number] | undefined
}) {
  if (!lead) return null
  return (
    <Link
      href={`/news/${lead.id}`}
      className='group relative block overflow-hidden bg-muted'
    >
      <div className='relative aspect-[16/7] w-full sm:aspect-[16/8] md:aspect-[21/9]'>
        <img
          src={lead.image}
          alt={lead.title}
          className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
        />
      </div>
      <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent' />
      <div className='absolute inset-x-0 bottom-0 p-5 sm:p-8 md:p-10'>
        <CategoryBadge category={lead.category} />
        <h1 className='mt-3 max-w-4xl font-display text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl'>
          {lead.title}
        </h1>
        <p className='mt-2.5 max-w-3xl line-clamp-2 text-sm text-white/80 sm:text-base md:line-clamp-3'>
          {lead.excerpt}
        </p>
        <div className='mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/80'>
          <span className='font-medium'>{lead.author}</span>
          <span className='inline-flex items-center gap-1'>
            <Clock className='h-3 w-3' />
            {relativeTimeBn(new Date(lead.publishedAt))}
          </span>
          <span className='inline-flex items-center gap-1'>
            <Eye className='h-3 w-3' />
            {toBn(lead.views.toLocaleString('en-US'))}
          </span>
          <span>{toBn(lead.readTime)} মিনিট পড়ুন</span>
        </div>
      </div>
    </Link>
  )
}

function CategoryNewsList({
  items,
}: {
  category: NewsCategory
  items: ReturnType<typeof getByCategory>
}) {
  if (items.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 py-16 text-center'>
        <p className='text-4xl'>📰</p>
        <p className='mt-3 text-lg font-semibold text-muted-foreground'>
          এই বিভাগে এখনো কোনো খবর প্রকাশিত হয়নি
        </p>
        <Link
          href='/'
          className='mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline'
        >
          <ArrowLeft className='h-4 w-4' />
          প্রচ্ছদে ফিরে যান
        </Link>
      </div>
    )
  }
  return (
    <div className='divide-y divide-border/40'>
      {items.map((item) => (
        <NewsCard key={item.id} item={item} variant='horizontal' />
      ))}
    </div>
  )
}

function CategoryNav({ activeCategory }: { activeCategory: NewsCategory }) {
  return (
    <div className='border-b border-border'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='scrollbar-hide -mx-4 flex items-center gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0'>
          {NEWS_CATEGORIES.map((c) => {
            const isActive = c.label === activeCategory
            const catSlug = CATEGORY_SLUG_MAP[c.label]
            return (
              <Link
                key={c.label}
                href={`/category/${catSlug}`}
                className={`shrink-0 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? `${c.color} text-white`
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {c.label}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function OpinionCard({ item }: { item: (typeof OPINIONS)[number]; category: NewsCategory }) {
  return (
    <div className='group rounded-lg border border-border/60 p-4 transition-colors hover:border-border hover:bg-muted/40'>
      <div className='flex items-start gap-3'>
        <img
          src={item.avatar}
          alt={item.author}
          className='h-12 w-12 shrink-0 rounded-full object-cover'
        />
        <div className='min-w-0'>
          <p className='text-xs font-medium text-muted-foreground'>
            {item.author} • {item.role}
          </p>
          <h3 className='mt-1 line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-brand'>
            {item.title}
          </h3>
          <p className='mt-1 line-clamp-2 text-xs text-muted-foreground'>{item.excerpt}</p>
          <p className='mt-1.5 text-[11px] text-muted-foreground'>
            {relativeTimeBn(new Date(item.publishedAt))}
          </p>
        </div>
      </div>
    </div>
  )
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const allNews = getByCategory(category)
  const lead = allNews[0]
  const rest = allNews.slice(1)
  const color = categoryColor(category)
  const otherCategories = NEWS_CATEGORIES.filter((c) => c.label !== category)
  const opinions = category === 'মতামত' ? OPINIONS : []

  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <TopBar />
      <Header />
      <BreakingNewsTicker />
      <Breadcrumb category={category} />
      <CategoryNav activeCategory={category} />

      <main className='flex-1'>
        <h1 className='sr-only'>{category} — বার্তা</h1>

        {/* Category title bar */}
        <div className='mx-auto max-w-7xl px-4 pt-6 sm:px-6'>
          <div className='flex items-center gap-3 pb-3 border-b-2 border-brand'>
            <span className={`inline-block h-4 w-1.5 rounded-full ${color}`} />
            <h2 className='text-2xl font-bold text-foreground sm:text-3xl'>{category}</h2>
            <span className='text-sm text-muted-foreground'>({toBn(allNews.length.toString())} টি সংবাদ)</span>
          </div>
        </div>

        {/* Hero: lead story */}
        <div className='mx-auto max-w-7xl px-4 pt-6 sm:px-6'>
          <CategoryHero category={category} lead={lead} />
        </div>

        {/* Ad */}
        <div className='mx-auto max-w-7xl px-4 sm:px-6'>
          <AdBox className='my-8' />
        </div>

        {/* Main content: news list + sidebar */}
        <div className='mx-auto max-w-7xl px-4 sm:px-6 pb-12'>
          <div className='grid gap-8 lg:grid-cols-3'>
            {/* News list — 2/3 width */}
            <div className='lg:col-span-2'>
              <div className='mb-4 flex items-end justify-between pb-2.5 border-b-2 border-brand'>
                <h2 className='text-xl font-bold text-foreground'>সর্বশেষ {category}</h2>
              </div>
              <CategoryNewsList category={category} items={rest} />

              {/* Opinion section for মতামত */}
              {opinions.length > 0 && (
                <>
                  <div className='mt-10 mb-4 flex items-end justify-between pb-2.5 border-b-2 border-brand'>
                    <h2 className='text-xl font-bold text-foreground'>কলাম ও মতামত</h2>
                  </div>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    {opinions.map((op) => (
                      <OpinionCard key={op.id} item={op} category={category} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar — 1/3 width */}
            <aside className='space-y-8'>
              {/* Other categories */}
              <div>
                <div className='mb-3 pb-2.5 border-b-2 border-brand'>
                  <h2 className='text-xl font-bold text-foreground'>অন্যান্য বিভাগ</h2>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {otherCategories.map((c) => (
                    <Link
                      key={c.label}
                      href={`/category/${CATEGORY_SLUG_MAP[c.label]}`}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 ${c.color}`}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
              <TrendingSidebar />
              <AdBox />
            </aside>
          </div>
        </div>

        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}
