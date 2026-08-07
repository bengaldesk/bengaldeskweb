import Link from 'next/link'
import { NewsImage } from '@/components/news/news-image'
import { type NewsCategory, categoryColor } from '@/lib/news-data'
import { relativeTimeBn } from '@/lib/bn'
import { cn } from '@/lib/utils'

interface RelatedArticle {
  id: string
  title: string
  excerpt?: string
  image: string
  category: NewsCategory
  publishedAt: string
}

interface RelatedArticlesProps {
  articles: RelatedArticle[]
  heading?: string
  className?: string
}

/**
 * RelatedArticles — 3-4 card grid reusing homepage card typography.
 * Visual consistency with homepage news cards.
 */
export function RelatedArticles({
  articles,
  heading = 'সম্পর্কিত খবর',
  className,
}: RelatedArticlesProps) {
  if (articles.length === 0) return null

  return (
    <section className={cn('related-articles-section mt-10', className)}>
      <div className='section-header mb-6'>
        <h2>{heading}</h2>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {articles.map((item) => (
          <RelatedCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

/* ─── Individual Related Card ─── */
function RelatedCard({ item }: { item: RelatedArticle }) {
  const catColor = categoryColor(item.category)

  return (
    <Link
      href={`/news/${item.id}`}
      className='group flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-200 hover:border-brand/30 hover:shadow-md news-card-hover'
    >
      {/* Image */}
      <div className='relative aspect-[16/10] w-full overflow-hidden bg-muted'>
        <NewsImage
          src={item.image}
          alt={item.title}
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          className='img-zoom object-cover'
        />
        {/* Category badge */}
        <span
          className={cn(
            'absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white',
            catColor
          )}
        >
          {item.category}
        </span>
      </div>

      {/* Content */}
      <div className='flex flex-1 flex-col p-4'>
        <h3 className='card-headline line-clamp-2 text-[15px] leading-snug'>
          {item.title}
        </h3>
        {item.excerpt && (
          <p className='card-dek mt-2 line-clamp-2'>
            {item.excerpt}
          </p>
        )}
        <span className='mt-auto pt-3 text-[11px] text-muted-foreground'>
          {relativeTimeBn(new Date(item.publishedAt))}
        </span>
      </div>
    </Link>
  )
}