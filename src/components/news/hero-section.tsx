'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Eye, TrendingUp, ChevronRight } from 'lucide-react'
import { getFeatured, getTrending, type NewsItem, type NewsCategory } from '@/lib/news-data'
import { relativeTimeBn, toBn } from '@/lib/bn'
import { categoryColor, NEWS_CATEGORIES } from '@/lib/news-data'
import { NewsImage } from './news-image'
import { cn } from '@/lib/utils'

/* ─── Helpers ─── */
const BN_NUM = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
const toBnNum = (n: number) =>
  String(n)
    .split('')
    .map((d) => BN_NUM[Number(d)])
    .join('')

/* ─── Accent Line ─── */
function AccentLine() {
  return <div className="h-[3px] w-full bg-gradient-to-r from-brand via-brand/80 to-brand/30" />
}

/* ─── Main Cinematic Hero ─── */
function CinematicHero({ item }: { item: NewsItem }) {
  return (
    <Link href={`/#${item.id}`} className="group relative block w-full">
      {/* Image container — tall & cinematic */}
      <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9] lg:aspect-[21/8]">
        <NewsImage
          src={item.image}
          alt={item.title}
          priority
          sizes="100vw"
          className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />

        {/* Multi-stop gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 md:pb-12 lg:pb-14">
            {/* Category + Live dot */}
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  'inline-flex items-center rounded-sm px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white',
                  categoryColor(item.category)
                )}
              >
                {item.category}
              </span>
              {item.trending && (
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
                  <TrendingUp className="h-3 w-3" />
                  ট্রেন্ডিং
                </span>
              )}
            </div>

            {/* Headline */}
            <h2 className="font-display mt-3 max-w-4xl text-balance text-2xl leading-tight text-white sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              {item.title}
            </h2>

            {/* Excerpt */}
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:mt-4 sm:text-base md:text-lg">
              {item.excerpt}
            </p>

            {/* Meta row */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/70 sm:mt-5 sm:text-sm">
              <span className="font-semibold text-white/90">{item.author}</span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {relativeTimeBn(new Date(item.publishedAt))}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {toBn(item.views.toLocaleString('en-US'))} ভিউ
              </span>
              <span className="hidden sm:inline-flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-white/40" />
                {toBn(item.readTime)} মিনিট পড়ুন
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ─── Grid Story Card (image + overlay) ─── */
function GridStoryCard({
  item,
  className,
}: {
  item: NewsItem
  className?: string
}) {
  return (
    <Link
      href={`/#${item.id}`}
      className={cn('group relative block overflow-hidden', className)}
    >
      <div className="relative aspect-[16/10] w-full sm:aspect-[4/3]">
        <NewsImage
          src={item.image}
          alt={item.title}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
        <span
          className={cn(
            'inline-block rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white',
            categoryColor(item.category)
          )}
        >
          {item.category}
        </span>
        <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-white sm:text-[15px]">
          {item.title}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-white/70">
          <Clock className="h-3 w-3" />
          {relativeTimeBn(new Date(item.publishedAt))}
          <span className="h-1 w-1 rounded-full bg-white/30" />
          {item.author}
        </div>
      </div>
    </Link>
  )
}

/* ─── Numbered Story Row ─── */
function NumberedStory({
  item,
  index,
}: {
  item: NewsItem
  index: number
}) {
  return (
    <Link
      href={`/#${item.id}`}
      className="group flex gap-3.5 border-b border-border/50 py-4 first:pt-0 last:border-0"
    >
      {/* Bengali numeral */}
      <span className="shrink-0 font-display text-2xl font-bold text-brand/25 transition-colors group-hover:text-brand/50 sm:text-3xl">
        {toBnNum(index)}
      </span>
      <div className="min-w-0 flex-1">
        <span
          className={cn(
            'inline-block rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white',
            categoryColor(item.category)
          )}
        >
          {item.category}
        </span>
        <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-brand sm:text-[15px]">
          {item.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {relativeTimeBn(new Date(item.publishedAt))}
          <span className="h-1 w-1 rounded-full bg-border" />
          <Eye className="h-3 w-3" />
          {toBn(item.views.toLocaleString('en-US'))}
        </div>
      </div>
    </Link>
  )
}

/* ─── Section Label ─── */
function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="h-5 w-1 rounded-full bg-brand" />
      <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70">
        {children}
      </h3>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN HERO SECTION — International Editorial Layout
   ══════════════════════════════════════════════════════════ */
export function HeroSection() {
  const featured = getFeatured()
  const [hero, ...secondary] = featured
  const gridItems = secondary.slice(0, 3)
  const trending = getTrending(5)

  // For the numbered list: deduplicate between secondary & trending stories
  const seen = new Set<string>()
  const numberedItems: NewsItem[] = []
  for (const item of [...secondary, ...trending]) {
    if (seen.has(item.id) || numberedItems.length >= 5) continue
    seen.add(item.id)
    numberedItems.push(item)
  }

  return (
    <section>
      {/* Top accent line */}
      <AccentLine />

      {/* ── Cinematic Full-Width Hero ── */}
      {hero && <CinematicHero item={hero} />}

      {/* ── Secondary Grid ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="border-b border-border/60 py-6 lg:py-8">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Left: Image grid */}
            <div className="lg:col-span-8">
              <SectionLabel className="mb-4">
                আরও খবর
              </SectionLabel>
              <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
                {gridItems.map((item) => (
                  <GridStoryCard
                    key={item.id}
                    item={item}
                    className="rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Right: Numbered trending list */}
            <div className="lg:col-span-4">
              <SectionLabel className="mb-4">
                সর্বাধিক পঠিত
              </SectionLabel>
              <div className="rounded-lg border border-border/50 bg-card/50 p-4 sm:p-5">
                {numberedItems.map((item, i) => (
                  <NumberedStory key={item.id} item={item} index={i + 1} />
                ))}
                <Link
                  href="/"
                  className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand/80"
                >
                  সব খবর দেখুন
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
