'use client'

import * as React from 'react'
import { Zap } from 'lucide-react'
import { BREAKING_NEWS } from '@/lib/news-data'

export function BreakingNewsTicker() {
  const items = [...BREAKING_NEWS, ...BREAKING_NEWS]
  const duration = Math.max(28, BREAKING_NEWS.length * 6)

  return (
    <div className='hidden border-b border-border/50 bg-background md:block'>
      <div className='mx-auto flex max-w-7xl items-stretch px-0 sm:px-6'>
        {/* Breaking badge */}
        <div className='flex shrink-0 items-center gap-1.5 bg-brand px-2.5 py-1.5 text-white sm:px-3 sm:py-2'>
          <Zap className='h-3.5 w-3.5 ticker-dot sm:h-4 sm:w-4' />
          <span className='text-[11px] font-bold uppercase tracking-wide sm:text-sm'>
            ব্রেকিং
          </span>
        </div>
        {/* Ticker track */}
        <div className='marquee-pause relative flex-1 overflow-hidden'>
          {/* fade edges */}
          <div className='pointer-events-none absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-background to-transparent sm:w-8' />
          <div className='pointer-events-none absolute right-0 top-0 z-10 h-full w-6 bg-gradient-to-l from-background to-transparent sm:w-8' />
          <div
            className='marquee-track py-1.5 sm:py-2'
            style={{ ['--marquee-duration' as string]: `${duration}s` }}
          >
            {items.map((news, i) => (
              <span
                key={i}
                className='inline-flex items-center px-3 text-[12px] text-foreground/90 sm:px-4 sm:text-sm'
              >
                <span className='mr-2 h-1 w-1 rounded-full bg-brand/60' />
                {news}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
