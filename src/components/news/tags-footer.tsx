import Link from 'next/link'
import { type NewsCategory, getCategorySlug, categoryColor } from '@/lib/posts'
import { cn } from '@/lib/utils'

interface TagsFooterProps {
  category: NewsCategory
  tags?: string[]
}

/**
 * TagsFooter — editorial-style tag section at end of article body.
 * Thin rule, uppercase label, category badge + keyword pills.
 */
export function TagsFooter({ category, tags }: TagsFooterProps) {
  const catColor = categoryColor(category)

  return (
    <div className='flex flex-wrap items-center gap-2.5 border-t border-border/40 pt-5'>
      <span className='text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground'>
        বিষয়শ্রেণী
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
        <span
          key={tag}
          className='rounded-full bg-muted px-3.5 py-1.5 text-xs font-medium text-text-secondary'
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
