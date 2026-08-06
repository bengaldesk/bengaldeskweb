'use client'

import Link from 'next/link'
import { Clock, ChevronRight, Eye, TrendingUp } from 'lucide-react'
import { getFeatured, getLatest, type NewsItem, type NewsCategory } from '@/lib/news-data'
import { relativeTimeBn, toBn } from '@/lib/bn'
import { categoryColor } from '@/lib/news-data'
import { NewsImage } from './news-image'
import { cn } from '@/lib/utils'

/* ══════════════════════════════════════════════════════════
   PROTOM ALO STYLE HERO
   Mobile: Full-width hero card with overlay
   Desktop: 3-column layout (sidebar | hero | sidebar)
   ══════════════════════════════════════════════════════════ */

/* ─── Category pill ─── */
function CatLabel({ category }: { category: NewsCategory }) {
  return (
    <span className='flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand'>
      <span className={cn('inline-block h-1.5 w-1.5 rounded-full', categoryColor(category))} />
      {category}
    </span>
  )
}

/* ─── Top accent line ─── */
function AccentLine() {
  return <div className='h-[3px] w-full bg-brand' />
}

/* ─── MOBILE HERO: Full-width card with overlay ─── */
function MobileHero({ item }: { item: NewsItem }) {
  return (
    <Link href={`/news/${item.id}`} className='group block lg:hidden'>
      <div className='relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-muted'>
        <NewsImage
          src={item.image}
          alt={item.title}
          priority
          sizes='100vw'
          className='img-zoom'
        />
        {/* Dark gradient overlay for text readability */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent' />

        {/* Trending badge */}
        {item.trending && (
          <div className='absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-brand/90 px-2.5 py-1 backdrop-blur-sm'>
            <TrendingUp className='h-3 w-3 text-white' />
            <span className='text-[10px] font-bold uppercase tracking-wider text-white'>
              ট্রেন্ডিং
            </span>
          </div>
        )}

        {/* Text overlay at bottom */}
        <div className='absolute inset-x-0 bottom-0 p-4'>
          <CatLabel category={item.category} />
          <h2 className='font-display mt-1.5 line-clamp-3 text-lg font-bold leading-tight text-white sm:text-xl'>
            {item.title}
          </h2>
          <p className='mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/80'>
            {item.excerpt}
          </p>
          <div className='mt-2 flex items-center gap-3 text-[11px] text-white/70'>
            <span className='font-semibold text-white/90'>{item.author}</span>
            <span className='h-1 w-1 rounded-full bg-white/40' />
            <span className='inline-flex items-center gap-1'>
              <Clock className='h-3 w-3' />
              {relativeTimeBn(new Date(item.publishedAt))}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ─── DESKTOP: Left sidebar card ─── */
function LeftSidebarCard({ item, isFirst }: { item: NewsItem; isFirst?: boolean }) {
  return (
    <Link
      href={`/news/${item.id}`}
      className={cn(
        'group flex gap-3',
        isFirst ? 'pt-0' : 'pt-4 border-t border-border/40'
      )}
    >
      <div className='relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-md bg-muted'>
        <NewsImage
          src={item.image}
          alt={item.title}
          sizes='76px'
          className='img-zoom'
        />
      </div>
      <div className='flex min-w-0 flex-col justify-center'>
        <h3 className='line-clamp-2 text-[13px] font-bold leading-snug text-foreground transition-colors group-hover:text-brand'>
          {item.title}
        </h3>
        <div className='mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground'>
          <Clock className='h-3 w-3' />
          {relativeTimeBn(new Date(item.publishedAt))}
        </div>
      </div>
    </Link>
  )
}

/* ─── DESKTOP: Center hero ─── */
function DesktopHero({ item }: { item: NewsItem }) {
  return (
    <Link href={`/news/${item.id}`} className='group hidden lg:block'>
      <div className='relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted'>
        <NewsImage
          src={item.image}
          alt={item.title}
          priority
          sizes='(max-width: 1280px) 50vw, 640px'
          className='img-zoom'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
        {item.trending && (
          <div className='absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-brand/90 px-2.5 py-1 backdrop-blur-sm'>
            <TrendingUp className='h-3 w-3 text-white' />
            <span className='text-[10px] font-bold uppercase tracking-wider text-white'>ট্রেন্ডিং</span>
          </div>
        )}
      </div>
      <div className='mt-3'>
        <CatLabel category={item.category} />
        <h2 className='font-display mt-1.5 text-balance text-xl leading-tight text-foreground transition-colors group-hover:text-brand xl:text-2xl xl:leading-[1.25]'>
          {item.title}
        </h2>
        <p className='mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground'>
          {item.excerpt}
        </p>
        <div className='mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground'>
          <span className='font-semibold text-foreground/80'>{item.author}</span>
          <span className='h-1 w-1 rounded-full bg-border' />
          <span className='inline-flex items-center gap-1'><Clock className='h-3 w-3' />{relativeTimeBn(new Date(item.publishedAt))}</span>
          <span className='inline-flex items-center gap-1'><Eye className='h-3 w-3' />{toBn(item.views.toLocaleString('en-US'))}</span>
        </div>
      </div>
    </Link>
  )
}

/* ─── DESKTOP: Right sidebar item ─── */
function LatestSidebarItem({ item, isFirst }: { item: NewsItem; isFirst?: boolean }) {
  return (
    <Link
      href={`/news/${item.id}`}
      className={cn(
        'group flex gap-3',
        isFirst ? 'pt-0' : 'pt-3.5 border-t border-border/30'
      )}
    >
      <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded bg-muted'>
        <NewsImage src={item.image} alt={item.title} sizes='56px' className='img-zoom' />
      </div>
      <div className='flex min-w-0 flex-1 flex-col justify-center'>
        <h4 className='line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-brand'>
          {item.title}
        </h4>
        <div className='mt-1 text-[10px] text-muted-foreground'>
          {relativeTimeBn(new Date(item.publishedAt))}
        </div>
      </div>
    </Link>
  )
}

/* ─── Sidebar heading ─── */
function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className='pb-3 text-xs font-extrabold uppercase tracking-[0.15em] text-foreground border-b-2 border-brand'>
      {children}
    </h3>
  )
}

/* ══════════════════════════════════════════════════════════ */
export function HeroSection() {
  const latestAll = getLatest(20)
  const [hero, ...latestRest] = latestAll
  const featured = getFeatured().filter((item) => item.id !== hero?.id)
  const leftItems = featured.slice(0, 3)

  const shownIds = new Set([hero?.id, ...leftItems.map((i) => i.id)].filter(Boolean))
  const sidebarItems = latestRest.filter((i) => !shownIds.has(i.id)).slice(0, 6)

  return (
    <section>
      <AccentLine />

      {/* Mobile: full-width hero + quick list below */}
      <div className='lg:hidden'>
        <div className='mx-auto max-w-7xl px-4 pt-4 pb-2 sm:px-6'>
          {hero && <MobileHero item={hero} />}

          {/* Quick latest list below hero on mobile */}
          <div className='mt-4'>
            {sidebarItems.slice(0, 4).map((item, i) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className={cn(
                  'group flex gap-3',
                  i === 0 ? 'pt-0' : 'pt-3 border-t border-border/40'
                )}
              >
                <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted'>
                  <NewsImage src={item.image} alt={item.title} sizes='64px' className='img-zoom' />
                </div>
                <div className='flex min-w-0 flex-1 flex-col justify-center'>
                  <h4 className='line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-brand'>
                    {item.title}
                  </h4>
                  <span className='mt-1 text-[10px] text-muted-foreground'>
                    {relativeTimeBn(new Date(item.publishedAt))}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: 3-column editorial grid */}
      <div className='mx-auto hidden max-w-7xl px-4 py-6 lg:block sm:px-6 lg:py-8'>
        <div className='grid gap-6 lg:grid-cols-12 lg:gap-8'>
          {/* LEFT SIDEBAR */}
          <aside className='lg:col-span-3'>
            <SidebarHeading>সদ্য পাওয়া</SidebarHeading>
            <div className='mt-4 flex flex-col'>
              {leftItems.map((item, i) => (
                <LeftSidebarCard key={item.id} item={item} isFirst={i === 0} />
              ))}
            </div>
          </aside>

          {/* CENTER HERO */}
          <div className='lg:col-span-6'>
            {hero && <DesktopHero item={hero} />}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className='lg:col-span-3'>
            <SidebarHeading>সর্বশেষ</SidebarHeading>
            <div className='mt-4 flex flex-col'>
              {sidebarItems.map((item, i) => (
                <LatestSidebarItem key={item.id} item={item} isFirst={i === 0} />
              ))}
            </div>
            <Link
              href='/'
              className='mt-4 flex items-center justify-center gap-1 rounded-lg border border-brand/30 py-2 text-xs font-bold uppercase tracking-wider text-brand transition-colors hover:bg-brand hover:text-brand-foreground'
            >
              আরও খবর
              <ChevronRight className='h-3.5 w-3.5' />
            </Link>
          </aside>
        </div>
      </div>

      {/* Bottom separator */}
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='border-b border-border/40' />
      </div>
    </section>
  )
}