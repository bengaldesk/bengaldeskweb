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
      <SectionHeader title={category} href={href} />

      {/* Mobile: 2-column grid with all items as cards */}
      <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:hidden'>
        {/* Lead story — larger card spanning 2 columns */}
        <Link
          href={`/news/${lead.id}`}
          className='group col-span-2 block rounded-lg overflow-hidden bg-card news-card-hover'
        >
          <div className='relative aspect-[16/9] w-full overflow-hidden bg-muted'>
            <NewsImage
              src={lead.image}
              alt={lead.title}
              sizes='100vw'
              className='img-zoom'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
            <div className='absolute inset-x-0 bottom-0 p-3'>
              <h3 className='line-clamp-2 text-sm font-bold leading-snug text-white sm:text-base'>
                {lead.title}
              </h3>
              <span className='mt-1 inline-block text-[10px] text-white/70'>
                {relativeTimeBn(new Date(lead.publishedAt))}
              </span>
            </div>
          </div>
        </Link>

        {/* Rest as grid cards */}
        {rest.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.id}`}
            className='group block rounded-lg overflow-hidden bg-card news-card-hover'
          >
            <div className='relative aspect-[16/10] w-full overflow-hidden bg-muted'>
              <NewsImage
                src={item.image}
                alt={item.title}
                sizes='(max-width: 640px) 50vw, 300px'
                className='img-zoom'
              />
            </div>
            <div className='p-2.5'>
              <h3 className='line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-brand'>
                {item.title}
              </h3>
              <span className='mt-1 inline-block text-[10px] text-muted-foreground'>
                {relativeTimeBn(new Date(item.publishedAt))}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: Featured + list layout */}
      <div className='hidden lg:grid lg:grid-cols-12 lg:gap-6'>
        {/* Lead — featured card (7 cols) */}
        <Link
          href={`/news/${lead.id}`}
          className='group lg:col-span-7 block rounded-lg overflow-hidden bg-card news-card-hover'
        >
          <div className='relative aspect-[16/10] w-full overflow-hidden bg-muted'>
            <NewsImage
              src={lead.image}
              alt={lead.title}
              sizes='(max-width: 1280px) 60vw, 600px'
              className='img-zoom'
            />
          </div>
          <div className='p-4'>
            <h3 className='font-display text-xl leading-snug tracking-tight transition-colors group-hover:text-brand'>
              {lead.title}
            </h3>
            <p className='mt-1.5 line-clamp-2 text-sm text-muted-foreground'>
              {lead.excerpt}
            </p>
            <span className='mt-1.5 inline-block text-[11px] text-muted-foreground'>
              {relativeTimeBn(new Date(lead.publishedAt))}
            </span>
          </div>
        </Link>

        {/* Rest — list (5 cols) */}
        <div className='lg:col-span-5 flex flex-col'>
          {rest.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className='group flex gap-3.5 border-b border-border/40 py-3.5 first:pt-0 last:border-0'
            >
              <div className='relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted'>
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
      </div>
    </section>
  )
}
