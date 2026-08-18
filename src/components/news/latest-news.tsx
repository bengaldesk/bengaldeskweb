import Link from 'next/link'
import { getLatest, getFeatured, categoryColor, type NewsCategory } from '@/lib/posts'
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
      <SectionHeader title='সর্বশেষ খবর' href='/category/national' />

      {/* Unified responsive layout — list on mobile, grid on desktop */}
      <div className='space-y-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:space-y-0'>
        {latest.map((item, i) => (
          <Link
            key={item.id}
            href={`/news/${item.id}`}
            className={cn(
              'group flex gap-3 border-b border-border/40 py-3.5 first:pt-0',
              'lg:block lg:py-0'
            )}
          >
            {/* Thumbnail */}
            <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted
              lg:aspect-[16/10] lg:h-auto lg:w-full lg:rounded-none'>
              <NewsImage
                src={item.image}
                alt={item.title}
                sizes='(max-width: 1024px) 80px, (max-width: 1280px) 33vw, 400px'
                className='img-zoom'
              />
            </div>
            {/* Text */}
            <div className='flex min-w-0 flex-col justify-center lg:p-3.5'>
              <span className='flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider'>
                <span className={cn('inline-block h-1.5 w-1.5 rounded-full', categoryColor(item.category))} />
                <span className='text-muted-foreground'>{item.category}</span>
              </span>
              <h3 className={cn(
                'mt-1 line-clamp-2 font-semibold leading-snug transition-colors group-hover:text-brand',
                'text-[14px] lg:mt-1.5 lg:text-[15px]'
              )}>
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
