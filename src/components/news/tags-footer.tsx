import Link from 'next/link'
import { type NewsCategory, getCategorySlug, categoryColor } from '@/lib/news-data'
import { cn } from '@/lib/utils'

interface TagsFooterProps {
  category: NewsCategory
  tags?: string[]
}

/**
 * TagsFooter — pill-style tag chips at end of article body.
 * Always shows the category tag; optionally shows additional keyword tags.
 */
export function TagsFooter({ category, tags }: TagsFooterProps) {
  const catColor = categoryColor(category)

  return (
    <div className='flex flex-wrap items-center gap-2 border-t border-border/40 pt-6'>
      <span className='text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground'>
        সম্পর্কিত ট্যাগ
      </span>
      <Link
        href={getCategorySlug(category)}
        className={cn(
          'rounded-full px-3.5 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:opacity-90 hover:shadow-sm',
          catColor
        )}
      >
        {category}
      </Link>
      {tags?.map((tag) => (
        <Link
          key={tag}
          href={`/tag/${encodeURIComponent(tag)}`}
          className='rounded-full bg-muted px-3.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-border-custom hover:text-text-primary'
        >
          {tag}
        </Link>
      ))}
    </div>
  )
}
