import Link from 'next/link'
import { getLatest, type NewsItem } from '@/lib/news-data'
import { relativeTimeBn, toBn } from '@/lib/bn'
import { NewsImage } from './news-image'

export function MostReadSidebar() {
  // Sort by views descending, take top 7
  const sorted = [...getLatest(50)].sort((a, b) => b.views - a.views).slice(0, 7)

  return (
    <div className='rounded-lg bg-card p-4 news-shadow'>
      <div className='section-header mb-0'>
        <h2>সবচেয়ে পঠিত</h2>
      </div>

      <div className='mt-3'>
        {sorted.map((item, i) => (
          <MostReadItem key={item.id} item={item} rank={i + 1} />
        ))}
      </div>
    </div>
  )
}

function MostReadItem({ item, rank }: { item: NewsItem; rank: number }) {
  return (
    <Link
      href={`/news/${item.id}`}
      className='group flex gap-3 border-b border-border/30 py-3 first:pt-1 last:border-0'
    >
      {/* Rank number */}
      <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand/10 text-sm font-extrabold text-brand'>
        {toBn(String(rank))}
      </span>
      <div className='flex min-w-0 flex-1 flex-col justify-center'>
        <h4 className='line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-brand'>
          {item.title}
        </h4>
        <span className='mt-1 text-[10px] text-muted-foreground'>
          {relativeTimeBn(new Date(item.publishedAt))}
        </span>
      </div>
    </Link>
  )
}