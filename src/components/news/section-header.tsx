import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

export function SectionHeader({
  title,
  className,
  actionLabel = 'সব খবর',
  onAction,
}: {
  title: string
  accentText?: string
  className?: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className={cn('', className)}>
      <div className='flex items-end justify-between pb-2.5 border-b-2 border-brand'>
        <h2 className='text-xl font-bold text-foreground'>
          {title}
        </h2>
        {onAction && (
          <button
            type='button'
            onClick={onAction}
            className='group inline-flex shrink-0 items-center gap-1 text-[11px] uppercase tracking-wider font-medium text-muted-foreground hover:text-brand transition-colors'
          >
            {actionLabel}
            <ArrowRight className='h-3 w-3 transition-transform group-hover:translate-x-0.5' />
          </button>
        )}
      </div>
    </div>
  )
}
