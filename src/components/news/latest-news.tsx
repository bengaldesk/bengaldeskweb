import Link from 'next/link'
import { getLatest, getFeatured, categoryColor, type NewsCategory } from '@/lib/news-data'
import { relativeTimeBn } from '@/lib/bn'
import { NewsImage } from './news-image'
import { cn } from '@/lib/utils'

export function LatestNews() {
  const featuredIds = new Set(getFeatured().map((n) => n.id))
  const latest = getLatest()
    .filter((n) => !featuredIds.has(n.id))
    .slice(0, 6)

  return (
    <section className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
      {/* Section header — inline The Hind style */}
      <div className='flex items-end justify-between pb-2.5 border-b-2 border-brand mb-5'>
        <h2 className='text-xl font-bold text-foreground'>
          সর্বশেষ খবর
        </h2>
      </div>

      {/* 3-column grid of horizontal cards */}
      <div className='grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3'>
        {latest.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.id}`}
            className='group flex gap-3 border-b border-border/40 py-4 first:pt-0 lg:border-b-0 lg:border-r lg:border-border/40 lg:py-0 lg:px-4 lg:first:pl-0 lg:last:pr-0'
          >
            {/* Square thumbnail */}
            <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-none bg-muted sm:h-[80px] sm:w-[80px]'>
              <NewsImage
                src={item.image}
                alt={item.title}
                sizes='80px'
                className='img-zoom'
              />
            </div>
            <div className='flex min-w-0 flex-col justify-center'>
              {/* Category dot + label */}
              <span className='flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider'>
                <span className={cn('inline-block h-1.5 w-1.5 rounded-full', categoryColor(item.category))} />
                <span className='text-muted-foreground'>{item.category}</span>
              </span>
              <h3 className='mt-1 line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-brand'>
                {item.title}
              </h3>
              <span className='mt-1 text-[11px] text-muted-foreground'>
                {relativeTimeBn(new Date(item.publishedAt))}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
