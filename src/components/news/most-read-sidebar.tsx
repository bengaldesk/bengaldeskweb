import Link from 'next/link'
import { getLatest, type NewsItem, categoryColor } from '@/lib/news-data'
import { relativeTimeBn, toBn } from '@/lib/bn'
import { cn } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'
import { SectionHeader } from './section-header'

export function MostReadSidebar() {
  // Sort by views descending, take top 7
  const sorted = [...getLatest(50)].sort((a, b) => b.views - a.views).slice(0, 7)
  const maxViews = sorted[0]?.views ?? 1

  return (
    <div className='rounded-lg bg-card p-4 news-shadow'>
      <SectionHeader icon={<TrendingUp className='h-4 w-4 text-brand' />} title='সবচেয়ে পঠিত' className='mb-2' />

      <div className='mt-3 max-h-[420px] overflow-y-auto scrollbar-thin'>
        {sorted.map((item, i) => (
          <MostReadItem key={item.id} item={item} rank={i + 1} maxViews={maxViews} isLast={i === sorted.length - 1} />
        ))}
      </div>
    </div>
  )
}

function MostReadItem({ item, rank, maxViews, isLast }: { item: NewsItem; rank: number; maxViews: number; isLast: boolean }) {
  const pct = Math.round((item.views / maxViews) * 100)

  return (
    <Link
      href={`/news/${item.id}`}
      className={cn(
        'group flex gap-3 py-3 first:pt-1',
        !isLast && 'border-b border-border/30',
      )}
    >
      {/* Rank number */}
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm font-extrabold',
          rank <= 3
            ? 'bg-brand text-brand-foreground'
            : 'bg-brand/10 text-brand',
        )}
      >
        {toBn(String(rank))}
      </span>
      <div className='flex min-w-0 flex-1 flex-col justify-center'>
        <span className='flex items-center gap-1.5 text-[10px] text-muted-foreground'>
          <span className={cn('h-1.5 w-1.5 rounded-full', categoryColor(item.category))} />
          {item.category}
        </span>
        <h4 className='line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-brand'>
          {item.title}
        </h4>
        {/* Popularity bar */}
        <div className='mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-brand/30'>
          <div
            className='h-full rounded-full bg-brand'
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className='mt-1 text-[10px] text-muted-foreground'>
          {relativeTimeBn(new Date(item.publishedAt))}
        </span>
      </div>
    </Link>
  )
}