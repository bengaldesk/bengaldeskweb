'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { toBn } from '@/lib/bn'

interface ReactionItem {
  emoji: string
  label: string
  key: string
}

const REACTIONS: ReactionItem[] = [
  { emoji: '\u2764\uFE0F', label: 'ভালোবাসি', key: 'love' },
  { emoji: '\uD83D\uDC4F', label: 'অভিনন্দন', key: 'clap' },
  { emoji: '\uD83D\uDE22', label: 'দুঃখিত', key: 'sad' },
  { emoji: '\uD83D\uDE21', label: 'রাগান্বিত', key: 'angry' },
  { emoji: '\uD83D\uDC4D', label: 'সমর্থন', key: 'like' },
]

interface ReactionBarProps {
  articleId: string
  className?: string
}

export function ReactionBar({ articleId, className }: ReactionBarProps) {
  const storageKey = `barta-reactions-${articleId}`

  const [counts, setCounts] = React.useState<Record<string, number>>({})
  const [activeReaction, setActiveReaction] = React.useState<string | null>(null)

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) return
      const data = JSON.parse(raw) as { counts: Record<string, number>; active: string | null }
      if (data.counts) setCounts(data.counts)
      if (data.active) setActiveReaction(data.active)
    } catch {
      // ignore
    }
  }, [storageKey])

  const handleReact = (key: string) => {
    const newCounts = { ...counts }
    let newActive = activeReaction

    if (activeReaction === key) {
      // Remove reaction
      newCounts[key] = Math.max(0, (newCounts[key] || 0) - 1)
      if (newCounts[key] === 0) delete newCounts[key]
      newActive = null
    } else {
      // Remove old reaction
      if (activeReaction && newCounts[activeReaction]) {
        newCounts[activeReaction] = Math.max(0, newCounts[activeReaction] - 1)
        if (newCounts[activeReaction] === 0) delete newCounts[activeReaction]
      }
      // Add new reaction
      newCounts[key] = (newCounts[key] || 0) + 1
      newActive = key
    }

    setCounts(newCounts)
    setActiveReaction(newActive)
    window.localStorage.setItem(storageKey, JSON.stringify({ counts: newCounts, active: newActive }))
  }

  const totalReactions = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {totalReactions > 0 && (
        <span className='text-[11px] text-muted-foreground'>{toBn(totalReactions)} জন প্রতিক্রিয়া</span>
      )}

      <div className='flex items-center gap-1'>
        {REACTIONS.map((reaction) => {
          const count = counts[reaction.key] || 0
          const isActive = activeReaction === reaction.key

          return (
            <button
              key={reaction.key}
              onClick={() => handleReact(reaction.key)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-sm transition-all duration-200',
                'hover:scale-105 active:scale-95',
                isActive
                  ? 'border-brand/40 bg-brand/10 shadow-sm'
                  : 'border-border/60 bg-card hover:border-border'
              )}
              aria-label={reaction.label}
              title={reaction.label}
            >
              <span className={cn('text-base leading-none', isActive && 'scale-110')}>{reaction.emoji}</span>
              {count > 0 && (
                <span className={cn(
                  'text-[11px] font-medium leading-none',
                  isActive ? 'text-brand' : 'text-muted-foreground'
                )}>
                  {toBn(count)}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
