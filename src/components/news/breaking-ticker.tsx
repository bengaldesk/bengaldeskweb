'use client'

import * as React from 'react'
import { Zap } from 'lucide-react'
import { BREAKING_NEWS } from '@/lib/news-data'

export function BreakingNewsTicker() {
  // Duplicate the list so the marquee loops seamlessly (translateX -50%).
  const items = [...BREAKING_NEWS, ...BREAKING_NEWS]
  const duration = Math.max(28, BREAKING_NEWS.length * 6)

  return (
    <div className="border-b border-border/70 bg-background">
      <div className="mx-auto flex max-w-7xl items-stretch px-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-1.5 bg-brand px-3 py-2 text-white">
          <Zap className="h-4 w-4 ticker-dot" />
          <span className="text-xs font-bold uppercase tracking-wide sm:text-sm">
            ব্রেকিং
          </span>
        </div>
        <div className="marquee-pause relative flex-1 overflow-hidden">
          {/* fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-background to-transparent" />
          <div
            className="marquee-track py-2"
            style={{ ['--marquee-duration' as string]: `${duration}s` }}
          >
            {items.map((news, i) => (
              <span
                key={i}
                className="inline-flex items-center px-4 text-sm text-foreground/90"
              >
                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-brand/60" />
                {news}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
