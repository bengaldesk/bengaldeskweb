import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { categoryColor, type NewsCategory } from '@/lib/posts'

interface SectionHeaderProps {
  title: string
  href?: string
  className?: string
  /** Category name to automatically color the bottom border accent */
  category?: NewsCategory
  /** Optional icon element before the title */
  icon?: React.ReactNode
}

export function SectionHeader({ title, href, className, category, icon }: SectionHeaderProps) {
  const accentColor = category ? categoryColor(category) : undefined

  return (
    <div
      className={cn(
        'group flex items-end justify-between pb-2.5 mb-4',
        className
      )}
    >
      {/* Title with optional icon and colored accent bar */}
      <div className='flex items-center gap-2'>
        {/* Vertical color accent bar */}
        <span
          className={cn(
            'mb-0.5 h-6 w-1 rounded-full shrink-0 transition-colors',
            accentColor || 'bg-brand'
          )}
          aria-hidden='true'
        />
        <h2 className='font-display text-h3 font-bold text-foreground'>
          {icon}
          {title}
        </h2>
      </div>

      {/* Read more link */}
      {href && (
        <Link
          href={href}
          className='inline-flex items-center gap-1 text-xs font-semibold text-brand transition-opacity hover:opacity-75 whitespace-nowrap'
        >
          আরও পড়ুন
          <ChevronRight className='h-3 w-3 transition-transform group-hover:translate-x-0.5' />
        </Link>
      )}
    </div>
  )
}
