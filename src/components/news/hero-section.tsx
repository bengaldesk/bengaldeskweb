'use client'
import { LeadStoryCard } from './lead-story-card'
import { getFeatured, getLatest } from '@/lib/posts'

export function HeroSection() {
  const latestAll = getLatest(20)
  const [hero, ...latestRest] = latestAll
  const featured = getFeatured().filter((item) => item.id !== hero?.id)
  const leftItems = featured.slice(0, 3)
  const shownIds = new Set([hero?.id, ...leftItems.map((i) => i.id)].filter(Boolean))
  const subItems = latestRest.filter((i) => !shownIds.has(i.id)).slice(0, 8)

  return (
    <section>
      <div className='h-[3px] w-full bg-brand' />
      <div className='mx-auto max-w-7xl py-4 sm:px-6 lg:py-6 lg:px-4'>
        {hero && (
          <LeadStoryCard
            item={hero}
            subItems={subItems}
            showDesktopSidebars
            leftItems={leftItems}
          />
        )}
      </div>
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='border-b border-border/40' />
      </div>
    </section>
  )
}
