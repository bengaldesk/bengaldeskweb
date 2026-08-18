'use client'

import Link from 'next/link'
import { Bookmark, Clock, ChevronRight } from 'lucide-react'
import { type NewsItem, categoryColor } from '@/lib/news-data'
import { relativeTimeBn } from '@/lib/bn'
import { NewsImage } from './news-image'
import { cn } from '@/lib/utils'

export interface LeadStoryCardProps {
  item: NewsItem
  subItems: NewsItem[]
  showDesktopSidebars?: boolean
  leftItems?: NewsItem[]
}

function CatLabel({ category }: { category: NewsItem['category'] }) {
  return (
    <span className='flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand'>
      <span className={cn('inline-block h-1.5 w-1.5 rounded-full', categoryColor(category))} />
      {category}
    </span>
  )
}

function HeroImageSection({ item }: { item: NewsItem }) {
  return (
    <Link href={`/news/${item.id}`} className='group block'>
      <div className='relative aspect-[16/10] w-full overflow-hidden bg-muted lg:aspect-[16/9]'>
        <NewsImage src={item.image} alt={item.title} priority sizes='(max-width: 1024px) 100vw, 640px' className='img-zoom' />
        <span className={cn('absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white', categoryColor(item.category))}>
          {item.category}
        </span>
        <button type='button' onClick={(e) => { e.preventDefault(); e.stopPropagation() }} className='absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/60 backdrop-blur-sm transition-colors hover:text-brand' aria-label='বুকমার্ক'>
          <Bookmark className='h-4 w-4 text-muted-foreground' />
        </button>
      </div>
      <div className='px-4 py-4 sm:px-5 sm:py-5'>
        <CatLabel category={item.category} />
        <h2 className='hero-headline line-clamp-4 transition-colors group-hover:text-brand'>{item.title}</h2>
        <div className='mt-2 flex items-center gap-3 meta-text'>
          <span className='font-semibold text-foreground/80'>{item.author}</span>
          <span className='h-1 w-1 rounded-full bg-border' />
          <span className='inline-flex items-center gap-1'><Clock className='h-3 w-3' />{relativeTimeBn(new Date(item.publishedAt))}</span>
        </div>
      </div>
    </Link>
  )
}

function SubItemRow({ item, isFirst }: { item: NewsItem; isFirst: boolean }) {
  return (
    <Link href={`/news/${item.id}`} className={cn('group flex items-center gap-3', !isFirst && 'border-t border-border/40 pt-3')}>
      <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted'>
        <NewsImage src={item.image} alt={item.title} sizes='56px' className='img-zoom' />
      </div>
      <div className='flex min-w-0 flex-1 flex-col justify-center'>
        <h3 className='line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-brand'>{item.title}</h3>
      </div>
      <span className='shrink-0 text-[10px] text-muted-foreground'>{relativeTimeBn(new Date(item.publishedAt))}</span>
    </Link>
  )
}

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className='pb-3 text-xs font-extrabold uppercase tracking-[0.15em] text-foreground border-b-2 border-brand'>{children}</h3>
  )
}

function SidebarItem({ item, isFirst, large }: { item: NewsItem; isFirst: boolean; large?: boolean }) {
  const size = large ? 'h-[76px] w-[76px]' : 'h-14 w-14'
  return (
    <Link href={`/news/${item.id}`} className={cn('group flex gap-3', isFirst ? 'pt-0' : 'pt-4 border-t border-border/40')}>
      <div className={cn('relative shrink-0 overflow-hidden rounded-md bg-muted', size)}>
        <NewsImage src={item.image} alt={item.title} sizes={large ? '76px' : '56px'} className='img-zoom' />
      </div>
      <div className='flex min-w-0 flex-col justify-center'>
        <h3 className={cn('line-clamp-2 font-bold leading-snug text-foreground transition-colors group-hover:text-brand', large ? 'text-[13px]' : 'text-[13px] font-semibold')}>
          {item.title}
        </h3>
        {!large && <div className='mt-1 text-[10px] text-muted-foreground'>{relativeTimeBn(new Date(item.publishedAt))}</div>}
        {large && (
          <div className='mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground'>
            <Clock className='h-3 w-3' />{relativeTimeBn(new Date(item.publishedAt))}
          </div>
        )}
      </div>
    </Link>
  )
}

export function LeadStoryCard({ item, subItems, showDesktopSidebars, leftItems }: LeadStoryCardProps) {
  const mobileSubItems = subItems.slice(0, 3)
  const rightSidebarItems = showDesktopSidebars ? subItems.slice(0, 6) : []

  return (
    <>
      <div className='lg:hidden'>
          <HeroImageSection item={item} />
          <div className='space-y-3 px-4 py-4'>
            {mobileSubItems.map((sub, i) => <SubItemRow key={sub.id} item={sub} isFirst={i === 0} />)}
          </div>
      </div>

      {showDesktopSidebars && leftItems ? (
        <div className='hidden lg:grid lg:grid-cols-12 lg:gap-6'>
          <aside className='lg:col-span-3'>
            <SidebarHeading>সদ্য পাওয়া</SidebarHeading>
            <div className='mt-4 flex flex-col'>
              {leftItems.map((li, i) => <SidebarItem key={li.id} item={li} isFirst={i === 0} large />)}
            </div>
          </aside>
          <div className='lg:col-span-6'>
              <HeroImageSection item={item} />
              <div className='space-y-3 px-4 py-4'>
                {mobileSubItems.map((sub, i) => <SubItemRow key={sub.id} item={sub} isFirst={i === 0} />)}
              </div>
          </div>
          <aside className='lg:col-span-3'>
            <SidebarHeading>সর্বশেষ</SidebarHeading>
            <div className='mt-4 flex flex-col'>
              {rightSidebarItems.map((ri, i) => <SidebarItem key={ri.id} item={ri} isFirst={i === 0} />)}
            </div>
            <Link href='/category/national' className='mt-4 flex items-center justify-center gap-1 rounded-lg border border-brand/30 py-2 text-xs font-bold uppercase tracking-wider text-brand transition-colors hover:bg-brand hover:text-brand-foreground'>
              আরও খবর
              <ChevronRight className='h-3.5 w-3.5' />
            </Link>
          </aside>
        </div>
      ) : (
        <div className='hidden lg:block'>
          <HeroImageSection item={item} />
          <div className='space-y-3 px-4 py-4'>
            {mobileSubItems.map((sub, i) => <SubItemRow key={sub.id} item={sub} isFirst={i === 0} />)}
          </div>
        </div>
      )}
    </>
  )
}
