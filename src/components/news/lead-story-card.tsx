'use client'

import Link from 'next/link'
import { Bookmark, Clock, ChevronRight } from 'lucide-react'
import { type NewsItem, categoryColor } from '@/lib/news-data'
import { relativeTimeBn } from '@/lib/bn'
import { NewsImage } from './news-image'
import { cn } from '@/lib/utils'

export interface LeadStoryCardProps {
  /** The lead/hero news item */
  item: NewsItem
  /** List of news items to show below the hero image */
  subItems: NewsItem[]
  /** Whether to show the section header sidebar items on desktop (for homepage) */
  showDesktopSidebars?: boolean
  /** Left sidebar items for desktop (homepage only) */
  leftItems?: NewsItem[]
}

/* ─── Category dot + label ─── */
function CatLabel({ category }: { category: NewsItem['category'] }) {
  return (
    <span className='flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand'>
      <span className={cn('inline-block h-1.5 w-1.5 rounded-full', categoryColor(category))} />
      {category}
    </span>
  )
}

/* ─── Hero image section (mobile: 16/10, desktop: 16/9) ─── */
function HeroImageSection({ item }: { item: NewsItem }) {
  return (
    <Link href={`/news/${item.id}`} className='group block'>
      <div className='relative aspect-[16/10] w-full overflow-hidden bg-muted lg:aspect-[16/9]'>
        <NewsImage
          src={item.image}
          alt={item.title}
          priority
          sizes='(max-width: 1024px) 100vw, 640px'
          className='img-zoom'
        />
        {/* Subtle light gradient at the bottom for text readability */}
        <div className='absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent' />

        {/* Category pill badge — top-left */}
        <span
          className={cn(
            'absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white',
            categoryColor(item.category)
          )}
        >
          {item.category}
        </span>

        {/* Bookmark icon — top-right */}
        <button
          type='button'
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          className='absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/60 backdrop-blur-sm transition-colors hover:text-brand'
          aria-label='বুকমার্ক'
        >
          <Bookmark className='h-4 w-4 text-muted-foreground' />
        </button>

        {/* Text overlay at bottom */}
        <div className='absolute inset-x-0 bottom-0 p-4 sm:p-5'>
          <CatLabel category={item.category} />
          <h2 className='font-display mt-1.5 line-clamp-3 text-[1.1rem] font-bold leading-tight text-foreground sm:text-lg'>
            {item.title}
          </h2>
          <div className='mt-2 flex items-center gap-3 text-[11px] text-muted-foreground'>
            <span className='font-semibold text-foreground/80'>{item.author}</span>
            <span className='h-1 w-1 rounded-full bg-border' />
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

/* ─── Sub-item row (mobile: inside card, below hero) ─── */
function SubItemRow({ item, isFirst }: { item: NewsItem; isFirst: boolean }) {
  return (
    <Link
      href={`/news/${item.id}`}
      className={cn(
        'group flex items-center gap-3',
        !isFirst && 'border-t border-border/40 pt-3'
      )}
    >
      <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted'>
        <NewsImage src={item.image} alt={item.title} sizes='56px' className='img-zoom' />
      </div>
      <div className='flex min-w-0 flex-1 flex-col justify-center'>
        <h3 className='line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-brand'>
          {item.title}
        </h3>
      </div>
      <span className='shrink-0 text-[10px] text-muted-foreground'>
        {relativeTimeBn(new Date(item.publishedAt))}
      </span>
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

/* ─── Left sidebar item (76x76 thumbnail) ─── */
function LeftSidebarItem({ item, isFirst }: { item: NewsItem; isFirst: boolean }) {
  return (
    <Link
      href={`/news/${item.id}`}
      className={cn(
        'group flex gap-3',
        isFirst ? 'pt-0' : 'pt-4 border-t border-border/40'
      )}
    >
      <div className='relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-md bg-muted'>
        <NewsImage src={item.image} alt={item.title} sizes='76px' className='img-zoom' />
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

/* ─── Right sidebar item (56x56 thumbnail) ─── */
function RightSidebarItem({ item, isFirst }: { item: NewsItem; isFirst: boolean }) {
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

/* ══════════════════════════════════════════════════════════ */
export function LeadStoryCard({
  item,
  subItems,
  showDesktopSidebars,
  leftItems,
}: LeadStoryCardProps) {
  const mobileSubItems = subItems.slice(0, 5)

  // On desktop, some subItems go to the right sidebar
  const rightSidebarItems = showDesktopSidebars ? subItems.slice(0, 6) : []

  return (
    <>
      {/* ═══ MOBILE LAYOUT (always visible, hidden on lg) ═══ */}
      <div className='lg:hidden'>
        <div className='rounded-xl overflow-hidden bg-card news-shadow'>
          <HeroImageSection item={item} />

          {/* Sub-items list inside the same card */}
          <div className='space-y-3 px-4 py-4'>
            {mobileSubItems.map((sub, i) => (
              <SubItemRow key={sub.id} item={sub} isFirst={i === 0} />
            ))}
          </div>
        </div>
      </div>

      {/* ═══ DESKTOP LAYOUT (hidden on mobile, shown on lg) ═══ */}
      {showDesktopSidebars && leftItems ? (
        <div className='hidden lg:grid lg:grid-cols-12 lg:gap-6'>
          {/* LEFT SIDEBAR — সদ্য পাওয়া */}
          <aside className='lg:col-span-3'>
            <SidebarHeading>সদ্য পাওয়া</SidebarHeading>
            <div className='mt-4 flex flex-col'>
              {leftItems.map((li, i) => (
                <LeftSidebarItem key={li.id} item={li} isFirst={i === 0} />
              ))}
            </div>
          </aside>

          {/* CENTER — Lead story card */}
          <div className='lg:col-span-6'>
            <div className='rounded-xl overflow-hidden bg-card news-shadow news-card-hover'>
              <HeroImageSection item={item} />
              <div className='space-y-3 px-4 py-4'>
                {mobileSubItems.map((sub, i) => (
                  <SubItemRow key={sub.id} item={sub} isFirst={i === 0} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR — সর্বশেষ */}
          <aside className='lg:col-span-3'>
            <SidebarHeading>সর্বশেষ</SidebarHeading>
            <div className='mt-4 flex flex-col'>
              {rightSidebarItems.map((ri, i) => (
                <RightSidebarItem key={ri.id} item={ri} isFirst={i === 0} />
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
      ) : (
        /* Desktop without sidebars (category pages) */
        <div className='hidden lg:block'>
          <div className='rounded-xl overflow-hidden bg-card news-shadow news-card-hover'>
            <HeroImageSection item={item} />
            <div className='space-y-3 px-4 py-4'>
              {mobileSubItems.map((sub, i) => (
                <SubItemRow key={sub.id} item={sub} isFirst={i === 0} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
