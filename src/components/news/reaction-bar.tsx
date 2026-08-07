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
  { emoji: '❤️', label: 'ভালোবাসি', key: 'love' },
  { emoji: '👏', label: 'অভিনন্দন', key: 'clap' },
  { emoji: '😮', label: 'অবাক', key: 'wow' },
  { emoji: '😢', label: 'দুঃখিত', key: 'sad' },
  { emoji: '😡', label: 'রাগান্বিত', key: 'angry' },
  { emoji: '👍', label: 'সমর্থন', key: 'like' },
]

interface ReactionBarProps {
  articleId: string
  className?: string
}

export function ReactionBar({ articleId, className }: ReactionBarProps) {
  const storageKey = `barta-reactions-${articleId}`

  const [counts, setCounts] = React.useState<Record<string, number>>({})
  const [activeReaction, setActiveReaction] = React.useState<string | null>(null)
  const [showPopup, setShowPopup] = React.useState(false)
  const [justReacted, setJustReacted] = React.useState<string | null>(null)
  const popupRef = React.useRef<HTMLDivElement>(null)

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

  // Close popup on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowPopup(false)
      }
    }
    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showPopup])

  const handleReact = (key: string) => {
    const newCounts = { ...counts }
    let newActive = activeReaction

    if (activeReaction === key) {
      newCounts[key] = Math.max(0, (newCounts[key] || 0) - 1)
      if (newCounts[key] === 0) delete newCounts[key]
      newActive = null
    } else {
      if (activeReaction && newCounts[activeReaction]) {
        newCounts[activeReaction] = Math.max(0, newCounts[activeReaction] - 1)
        if (newCounts[activeReaction] === 0) delete newCounts[activeReaction]
      }
      newCounts[key] = (newCounts[key] || 0) + 1
      newActive = key
    }

    setCounts(newCounts)
    setActiveReaction(newActive)
    setJustReacted(key)
    setTimeout(() => setJustReacted(null), 350)
    window.localStorage.setItem(storageKey, JSON.stringify({ counts: newCounts, active: newActive }))
    setShowPopup(false)
  }

  const totalReactions = Object.values(counts).reduce((a, b) => a + b, 0)
  const activeEmoji = REACTIONS.find((r) => r.key === activeReaction)?.emoji

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Main reaction trigger button */}
      <div className='relative' ref={popupRef}>
        <button
          onClick={() => setShowPopup(!showPopup)}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200',
            'hover:shadow-md active:scale-[0.98]',
            activeReaction
              ? 'border-brand/30 bg-brand/5 text-brand'
              : 'border-border/60 bg-card text-muted-foreground hover:border-border'
          )}
        >
          {activeEmoji ? (
            <span className={cn('text-lg leading-none', justReacted === activeReaction && 'reaction-pop')}>
              {activeEmoji}
            </span>
          ) : (
            <span className='text-lg leading-none'>👍</span>
          )}
          <span className='text-[13px]'>{totalReactions > 0 ? toBn(totalReactions) : 'প্রতিক্রিয়া'}</span>
        </button>

        {/* Popup with all reactions */}
        {showPopup && (
          <div className='absolute left-0 top-full z-50 mt-2 flex items-center gap-1 rounded-2xl border border-border/60 bg-card px-3 py-2.5 shadow-lg'>
            {REACTIONS.map((reaction) => {
              const isActive = activeReaction === reaction.key
              return (
                <button
                  key={reaction.key}
                  onClick={() => handleReact(reaction.key)}
                  className={cn(
                    'relative flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-2 transition-all duration-200',
                    'hover:bg-muted hover:scale-110 active:scale-95',
                    isActive && 'bg-brand/5'
                  )}
                  aria-label={reaction.label}
                  title={reaction.label}
                >
                  <span
                    className={cn(
                      'text-2xl leading-none transition-transform',
                      justReacted === reaction.key && 'reaction-pop',
                      isActive && 'scale-110'
                    )}
                  >
                    {reaction.emoji}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] leading-none font-medium',
                      isActive ? 'text-brand' : 'text-muted-foreground'
                    )}
                  >
                    {reaction.label}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Individual reaction chips if there are reactions */}
      {totalReactions > 0 && (
        <div className='flex items-center gap-1.5'>
          {Object.entries(counts).map(([key, count]) => {
            const reaction = REACTIONS.find((r) => r.key === key)
            if (!reaction) return null
            const isActive = activeReaction === key
            return (
              <button
                key={key}
                onClick={() => handleReact(key)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-sm transition-all duration-200',
                  'hover:scale-105 active:scale-95',
                  isActive
                    ? 'border-brand/40 bg-brand/10'
                    : 'border-border/60 bg-card hover:border-border'
                )}
                aria-label={reaction.label}
                title={reaction.label}
              >
                <span className={cn('text-base leading-none', isActive && 'scale-110')}>
                  {reaction.emoji}
                </span>
                <span
                  className={cn(
                    'text-[11px] font-medium leading-none',
                    isActive ? 'text-brand' : 'text-muted-foreground'
                  )}
                >
                  {toBn(count)}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
