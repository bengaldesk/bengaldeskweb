import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getByCategory, categoryColor, getCategorySlug, type NewsCategory } from '@/lib/news-data'
import { relativeTimeBn } from '@/lib/bn'
import { NewsImage } from './news-image'
import { SectionHeader } from './section-header'

export function CategorySection({
  category,
  className,
}: {
  category: NewsCategory
  className?: string
}) {
  const items = getByCategory(category, 5)
  if (items.length === 0) return null

  const [lead, ...rest] = items
  const href = getCategorySlug(category)

  return (
    <section className={cn('py-6 sm:py-8', className)}>
      <SectionHeader title={category} href={href} category={category} />

      <div className='grid gap-4 sm:gap-5 lg:grid-cols-12 lg:gap-6'>
        {/* ═══ Lead story — single DOM, responsive layout ═══ */}
        <Link
          href={`/news/${lead.id}`}
          className='group col-span-2 block rounded-lg overflow-hidden bg-card news-card-hover lg:col-span-7'
        >
          {/* Image area */}
          <div className='relative aspect-[16/10] w-full overflow-hidden bg-muted'>
            <NewsImage
              src={lead.image}
              alt={lead.title}
              sizes='(max-width: 640px) 100vw, (max-width: 1280px) 60vw, 600px'
              className='img-zoom'
            />
            {/* Gradient overlay — mobile only */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent lg:hidden' />
          </div>

          {/* Text — overlaps image bottom on mobile, below image on desktop */}
          <div className='relative z-10 -mt-14 px-3 pb-3 sm:-mt-16 lg:mt-0 lg:px-4 lg:pb-4'>
            <h3 className='line-clamp-2 text-sm font-bold leading-snug text-white sm:text-base
              lg:mt-0 lg:text-xl lg:font-bold lg:text-foreground lg:leading-snug lg:tracking-tight
              lg:transition-colors group-hover:text-brand'>
              {lead.title}
            </h3>
            <span className='mt-1 inline-block text-[10px] text-white/70 lg:hidden'>
              {relativeTimeBn(new Date(lead.publishedAt))}
            </span>
          </div>

          {/* Desktop-only excerpt + time */}
          <div className='hidden px-4 pb-4 lg:block'>
            <p className='mt-1.5 line-clamp-2 text-sm text-muted-foreground'>
              {lead.excerpt}
            </p>
            <span className='mt-1.5 inline-block text-[11px] text-muted-foreground'>
              {relativeTimeBn(new Date(lead.publishedAt))}
            </span>
          </div>
        </Link>

        {/* ═══ Rest items — single DOM each, responsive column→row ═══ */}
        <div className='col-span-2 grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-5 lg:flex lg:flex-col lg:gap-0'>
          {rest.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className={cn(
                'group flex flex-col rounded-lg overflow-hidden bg-card news-card-hover',
                'lg:flex-row lg:items-center lg:gap-3.5 lg:rounded-none lg:overflow-visible lg:bg-transparent',
                'lg:border-b lg:border-border/40 lg:py-3.5 first:lg:pt-0 last:lg:border-0'
              )}
            >
              {/* Thumbnail — card image on mobile, square on desktop */}
              <div className='relative aspect-[16/10] w-full overflow-hidden bg-muted
                lg:aspect-square lg:h-20 lg:w-20 lg:shrink-0 lg:rounded-md'>
                <NewsImage
                  src={item.image}
                  alt={item.title}
                  sizes='(max-width: 640px) 50vw, (max-width: 1024px) 300px, 80px'
                  className='img-zoom'
                />
              </div>
              {/* Text */}
              <div className='flex min-w-0 flex-col justify-center p-2.5 lg:p-0'>
                <span className='hidden items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider lg:flex'>
                  <span className={cn('inline-block h-1.5 w-1.5 rounded-full', categoryColor(item.category))} />
                  <span className='text-muted-foreground'>{item.category}</span>
                </span>
                <h3 className='mt-0.5 line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-brand
                  lg:mt-1 lg:text-sm'>
                  {item.title}
                </h3>
                <span className='mt-1 inline-block text-[10px] text-muted-foreground lg:text-[11px]'>
                  {relativeTimeBn(new Date(item.publishedAt))}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
