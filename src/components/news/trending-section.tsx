'use client'

import * as React from 'react'
import Link from 'next/link'
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { getTrending, categoryColor } from '@/lib/news-data'
import { relativeTimeBn } from '@/lib/bn'
import { cn } from '@/lib/utils'
import { NewsImage } from './news-image'

export function TrendingSection() {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const items = getTrending(10)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 320
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  if (items.length === 0) return null

  return (
    <section className='py-6 sm:py-8'>
      {/* Header */}
      <div className='flex items-end justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <span className='mb-0.5 h-6 w-1 rounded-full shrink-0 bg-brand' aria-hidden='true' />
          <div className='flex items-center gap-2'>
            <h2 className='font-display text-lg tracking-tight text-foreground sm:text-xl'>
              ট্রেন্ডিং
            </h2>
            <span className='live-dot' />
          </div>
        </div>
        <div className='hidden items-center gap-1 sm:flex'>
          <button
            type='button'
            onClick={() => scroll('left')}
            className='flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground transition-colors hover:bg-brand hover:text-brand-foreground hover:border-brand'
            aria-label='আগে'
          >
            <ChevronLeft className='h-4 w-4' />
          </button>
          <button
            type='button'
            onClick={() => scroll('right')}
            className='flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground transition-colors hover:bg-brand hover:text-brand-foreground hover:border-brand'
            aria-label='পরে'
          >
            <ChevronRight className='h-4 w-4' />
          </button>
        </div>
      </div>

      {/* Horizontal scroll container */
      }
      <div
        ref={scrollRef}
        className='-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0'
      >
        {items.map((item, i) => (
          <Link
            key={item.id}
            href={`/news/${item.id}`}
            className='group flex w-[260px] shrink-0 flex-col overflow-hidden rounded-xl bg-card news-card-hover sm:w-[280px]'
          >
            <div className='relative aspect-[16/10] w-full overflow-hidden bg-muted'>
              <NewsImage
                src={item.image}
                alt={item.title}
                sizes='280px'
                className='img-zoom'
              />
              {/* Trending rank badge */
              }
              <span className='absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-[12px] font-bold text-brand-foreground shadow-sm'>
                {i + 1}
              </span>
              {/* Category pill */
              }
              <span
                className={cn(
                  'absolute right-2.5 top-2.5 rounded-full px-2 py-0.5 text-[10px] font-bold text-white',
                  categoryColor(item.category)
                )}
              >
                {item.category}
              </span>
            </div>
            <div className='flex flex-1 flex-col justify-between p-3'>
              <h3 className='line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-brand'>
                {item.title}
              </h3>
              <div className='mt-2 flex items-center justify-between text-[10px] text-muted-foreground'>
                <span>{item.author}</span>
                <span>{relativeTimeBn(new Date(item.publishedAt))}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
