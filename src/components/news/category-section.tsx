import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getByCategory, categoryColor, type NewsCategory } from '@/lib/news-data'
import { relativeTimeBn } from '@/lib/bn'
import { NewsImage } from './news-image'

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

  return (
    <section className={cn('mx-auto max-w-7xl px-4 py-10 sm:px-6', className)}>
      {/* Section header — The Hind style */}
      <div className='flex items-end justify-between pb-2.5 border-b-2 border-brand mb-6'>
        <h2 className='text-xl font-bold text-foreground'>
          {category}
        </h2>
      </div>

      {/* Lead story — big image + text below */}
      <Link
        href={`/news/${lead.id}`}
        className='group block mb-6'
      >
        <div className='relative aspect-[16/10] w-full overflow-hidden rounded-none bg-muted'>
          <NewsImage
            src={lead.image}
            alt={lead.title}
            sizes='(max-width: 1024px) 100vw, 100vw'
            className='img-zoom'
          />
        </div>
        <div className='mt-3'>
          <span className='flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider'>
            <span className={cn('inline-block h-1.5 w-1.5 rounded-full', categoryColor(lead.category))} />
            <span className='text-muted-foreground'>{lead.category}</span>
          </span>
          <h3 className='font-display mt-1.5 text-xl leading-snug tracking-tight transition-colors group-hover:text-brand sm:text-2xl'>
            {lead.title}
          </h3>
          <p className='mt-1.5 line-clamp-2 text-sm text-muted-foreground'>
            {lead.excerpt}
          </p>
          <span className='mt-1 inline-block text-[11px] text-muted-foreground'>
            {relativeTimeBn(new Date(lead.publishedAt))}
          </span>
        </div>
      </Link>

      {/* Remaining items — horizontal cards with border-b separators */}
      <div>
        {rest.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.id}`}
            className='group flex gap-4 border-b border-border/40 py-4 first:pt-0 last:border-0'
          >
            <div className='relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-none bg-muted sm:h-24 sm:w-24'>
              <NewsImage
                src={item.image}
                alt={item.title}
                sizes='96px'
                className='img-zoom'
              />
            </div>
            <div className='flex min-w-0 flex-col justify-center'>
              <span className='flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider'>
                <span className={cn('inline-block h-1.5 w-1.5 rounded-full', categoryColor(item.category))} />
                <span className='text-muted-foreground'>{item.category}</span>
              </span>
              <h3 className='mt-1 line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-brand sm:text-[15px]'>
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
