import { cn } from '@/lib/utils'
import { getByCategory, type NewsCategory } from '@/lib/news-data'
import { NewsCard } from './news-card'
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

  return (
    <section className={cn('mx-auto max-w-7xl px-4 py-6 sm:px-6', className)}>
      <SectionHeader title={category} className="mb-5" />
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Lead story */}
        <div className="lg:col-span-6">
          <NewsCard item={lead} variant="feature" className="h-full" />
        </div>
        {/* List of the rest */}
        <div className="grid gap-0 lg:col-span-6 lg:grid-cols-2">
          {rest.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              variant="horizontal"
              className="border-b border-border/60 last:border-0 sm:[&:nth-last-child(-n+1)]:border-0 lg:[&:nth-child(odd)]:border-r lg:[&:nth-child(odd)]:border-border/60 lg:[&:nth-child(odd)]:pr-4 lg:[&:nth-child(even)]:pl-4"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
