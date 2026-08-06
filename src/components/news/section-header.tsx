import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  href?: string
  className?: string
}

export function SectionHeader({ title, href, className }: SectionHeaderProps) {
  return (
    <div className={cn('section-header', className)}>
      <h2>{title}</h2>
      {href && (
        <Link href={href} className='read-more inline-flex items-center gap-1'>
          আরও পড়ুন
          <ChevronRight className='h-3 w-3' />
        </Link>
      )}
    </div>
  )
}