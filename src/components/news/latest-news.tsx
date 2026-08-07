import Link from 'next/link'
import { getLatest, getFeatured, categoryColor, type NewsCategory } from '@/lib/news-data'
import { relativeTimeBn } from '@/lib/bn'
import { NewsImage } from './news-image'
import { cn } from '@/lib/utils'
import { SectionHeader } from './section-header'

export function LatestNews() {
  const featuredIds = new Set(getFeatured().map((n) => n.id))
  const latest = getLatest()
    .filter((n) => !featuredIds.has(n.id))
    .slice(0, 6)

  return (
    <section className='py-6 sm:py-8'>
      <SectionHeader title='সর্বশেষ খবর' href='/' />

      {/* Mobile: list view with thumbnails */}
      <div className='lg:hidden'>
        {latest.map((item, i) => (
          <Link
            key={item.id}
            href={`/news/${item.id}`}
            className={cn(
              'group flex gap-3',
              i === 0 ? 'pt-0' : 'pt-3 border-t border-border/40'
            )}
          >
            <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted'>
              <NewsImage
                src={item.image}
                alt={item.title}
                sizes='80px'
                className='img-zoom'
              />
            </div>
            <div className='flex min-w-0 flex-col justify-center'>
              <span className='flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider'>
                <span className={cn('inline-block h-1.5 w-1.5 rounded-full', categoryColor(item.category))} />
                <span className='text-muted-foreground'>{item.category}</span>
              </span>
              <h3 className='mt-1 line-clamp-2 text-[14px] font-semibold leading-snug transition-colors group-hover:text-brand'>
                {item.title}
              </h3>
              <span className='mt-1 text-[11px] text-muted-foreground'>
                {relativeTimeBn(new Date(item.publishedAt))}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: 3-column grid */}
      <div className='hidden lg:grid lg:grid-cols-3 lg:gap-5'>
        {latest.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.id}`}
            className='group block rounded-lg overflow-hidden bg-card news-card-hover'
          >
            <div className='relative aspect-[16/10] w-full overflow-hidden bg-muted'>
              <NewsImage
                src={item.image}
                alt={item.title}
                sizes='(max-width: 1280px) 33vw, 400px'
                className='img-zoom'
              />
            </div>
            <div className='p-3.5'>
              <span className='flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider'>
                <span className={cn('inline-block h-1.5 w-1.5 rounded-full', categoryColor(item.category))} />
                <span className='text-muted-foreground'>{item.category}</span>
              </span>
              <h3 className='mt-1.5 line-clamp-2 text-[15px] font-semibold leading-snug transition-colors group-hover:text-brand'>
                {item.title}
              </h3>
              <span className='mt-1.5 inline-block text-[11px] text-muted-foreground'>
                {relativeTimeBn(new Date(item.publishedAt))}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
