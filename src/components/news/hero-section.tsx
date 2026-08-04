'use client'

import Link from 'next/link'
import { Clock, ChevronRight } from 'lucide-react'
import { getFeatured, getLatest, type NewsItem, type NewsCategory } from '@/lib/news-data'
import { relativeTimeBn, toBn } from '@/lib/bn'
import { categoryColor } from '@/lib/news-data'
import { NewsImage } from './news-image'
import { AdBox } from './ad-box'
import { cn } from '@/lib/utils'

/* ══════════════════════════════════════════════════════════
   THE-HIND-STYLE 3-COLUMN EDITORIAL HERO
   Left sidebar · Center hero · Right sidebar
   ══════════════════════════════════════════════════════════ */

/* ─── Category pill (small, uppercase, no bg) ─── */
function CatLabel({ category }: { category: NewsCategory }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand">
      <span className={cn('inline-block h-1.5 w-1.5 rounded-full', categoryColor(category))} />
      {category}
    </span>
  )
}

/* ─── Top accent line ─── */
function AccentLine() {
  return <div className="h-[3px] w-full bg-gradient-to-r from-brand via-brand/70 to-brand/20" />
}

/* ─── LEFT SIDEBAR: Vertical stack of horizontal cards ─── */
function LeftSidebarCard({ item, isFirst }: { item: NewsItem; isFirst?: boolean }) {
  return (
    <Link
      href={`/news/${item.id}`}
      className={cn(
        'group flex gap-3.5',
        isFirst ? 'pt-0' : 'pt-5 border-t border-border/40'
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted sm:h-[88px] sm:w-[88px]">
        <NewsImage
          src={item.image}
          alt={item.title}
          sizes="96px"
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* Text */}
      <div className="flex min-w-0 flex-col justify-center">
        <CatLabel category={item.category} />
        <h3 className="mt-1.5 line-clamp-2 text-[13px] font-bold leading-snug text-foreground transition-colors group-hover:text-brand sm:text-sm">
          {item.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {relativeTimeBn(new Date(item.publishedAt))}
        </div>
      </div>
    </Link>
  )
}

/* ─── CENTER: Big hero article ─── */
function CenterHero({ item }: { item: NewsItem }) {
  return (
    <Link href={`/news/${item.id}`} className="group block">
      {/* Big image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-muted md:aspect-[16/9]">
        <NewsImage
          src={item.image}
          alt={item.title}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="transition-transform duration-600 ease-out group-hover:scale-[1.03]"
        />
        {/* Subtle bottom gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Trending badge on image */}
        {item.trending && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-brand/90 px-2.5 py-1 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white">
              ট্রেন্ডিং
            </span>
          </div>
        )}
      </div>

      {/* Text below image */}
      <div className="mt-4">
        <CatLabel category={item.category} />
        <h2 className="font-display mt-2 text-balance text-xl leading-tight text-foreground transition-colors group-hover:text-brand sm:text-2xl md:text-[1.75rem] md:leading-[1.25]">
          {item.title}
        </h2>
        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {item.excerpt}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground/80">{item.author}</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {relativeTimeBn(new Date(item.publishedAt))}
          </span>
          <span className="hidden sm:inline">
            <span className="h-1 w-1 rounded-full bg-border" />
            {' '}{toBn(item.readTime)} মিনিট পড়ুন
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ─── CENTER: Secondary article (highlighted card) ─── */
function CenterSecondary({ item }: { item: NewsItem }) {
  return (
    <Link href={`/news/${item.id}`} className="group flex gap-4 rounded-lg bg-secondary/60 p-3.5 transition-colors hover:bg-secondary sm:gap-5 sm:p-4">
      {/* Image */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted sm:h-28 sm:w-28">
        <NewsImage
          src={item.image}
          alt={item.title}
          sizes="128px"
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      {/* Text */}
      <div className="flex min-w-0 flex-col justify-center">
        <CatLabel category={item.category} />
        <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-brand sm:text-[15px]">
          {item.title}
        </h3>
        <p className="mt-1 hidden line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:block">
          {item.excerpt}
        </p>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {relativeTimeBn(new Date(item.publishedAt))}
          <span className="h-1 w-1 rounded-full bg-border" />
          {item.author}
        </div>
      </div>
    </Link>
  )
}

/* ─── RIGHT SIDEBAR: Latest posts list ─── */
function LatestSidebarItem({ item, isFirst }: { item: NewsItem; isFirst?: boolean }) {
  return (
    <Link
      href={`/news/${item.id}`}
      className={cn(
        'group flex gap-3',
        isFirst ? 'pt-0' : 'pt-4 border-t border-border/30'
      )}
    >
      {/* Small square thumbnail */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-muted">
        <NewsImage
          src={item.image}
          alt={item.title}
          sizes="64px"
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      {/* Text */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <h4 className="line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-brand">
          {item.title}
        </h4>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Clock className="h-2.5 w-2.5" />
          {relativeTimeBn(new Date(item.publishedAt))}
        </div>
      </div>
    </Link>
  )
}

/* ─── Sidebar section heading ─── */
function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="pb-3 text-xs font-extrabold uppercase tracking-[0.15em] text-foreground border-b-2 border-brand">
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

  // Secondary highlighted article: pick first latest item not shown in hero/left.
  const shownIds = new Set([hero?.id, ...leftItems.map((i) => i.id)].filter(Boolean))
  const secondaryHero = latestRest.find((i) => !shownIds.has(i.id))

  // Right sidebar: latest items excluding everything above
  const sidebarIds = new Set([
    hero?.id,
    ...leftItems.map((i) => i.id),
    secondaryHero?.id,
  ].filter(Boolean))
  const sidebarItems = latestRest.filter((i) => !sidebarIds.has(i.id)).slice(0, 6)

  return (
    <section>
      {/* Top accent line */}
      <AccentLine />

      {/* ── 3-Column Editorial Grid ── */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">

          {/* ─── LEFT SIDEBAR (3 cols) ─── */}
          <aside className="lg:col-span-3">
            <SidebarHeading>সদ্য পাওয়া</SidebarHeading>
            <div className="mt-4 flex flex-col">
              {leftItems.map((item, i) => (
                <LeftSidebarCard key={item.id} item={item} isFirst={i === 0} />
              ))}
            </div>
          </aside>

          {/* ─── CENTER HERO (6 cols) ─── */}
          <div className="lg:col-span-6">
            {hero && <CenterHero item={hero} />}

            {/* Secondary highlighted article */}
            {secondaryHero && (
              <div className="mt-6">
                <CenterSecondary item={secondaryHero} />
              </div>
            )}
          </div>

          {/* ─── RIGHT SIDEBAR (3 cols) ─── */}
          <aside className="lg:col-span-3">
            <SidebarHeading>সর্বশেষ</SidebarHeading>
            <div className="mt-4 flex flex-col">
              {sidebarItems.map((item, i) => (
                <LatestSidebarItem key={item.id} item={item} isFirst={i === 0} />
              ))}
            </div>
            <Link
              href="/"
              className="mt-4 flex items-center justify-center gap-1 rounded-md border border-brand/30 py-2 text-xs font-bold uppercase tracking-wider text-brand transition-colors hover:bg-brand hover:text-brand-foreground"
            >
              আরও খবর
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>

            <AdBox format="rectangle" className="mt-8" />
          </aside>

        </div>
      </div>

      {/* Bottom separator */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="border-b border-border/40" />
      </div>
    </section>
  )
}
