'use client'
import { useEffect, useRef, useState } from 'react'
import { LeadStoryCard } from './lead-story-card'
import { getFeatured, getLatest } from '@/lib/posts'

export function HeroSection() {
  const latestAll = getLatest(20)
  const [hero, ...latestRest] = latestAll
  const featured = getFeatured().filter((item) => item.id !== hero?.id)
  const leftItems = featured.slice(0, 3)
  const shownIds = new Set([hero?.id, ...leftItems.map((i) => i.id)].filter(Boolean))
  const subItems = latestRest.filter((i) => !shownIds.has(i.id)).slice(0, 8)

  // Auto-hide hero on mobile scroll
  const sectionRef = useRef<HTMLElement>(null)
  const [heroHidden, setHeroHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      // Hide when scrolled down past 120px, show when scrolled back up
      if (y > 120 && y > lastScrollY.current) {
        setHeroHidden(true)
      }
      if (y <= 120 || y < lastScrollY.current) {
        setHeroHidden(false)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className='lg:transition-none transition-[transform,opacity] duration-300 ease-in-out'
      style={heroHidden ? { transform: 'translateY(-100%)', opacity: 0, maxHeight: 0, overflow: 'hidden' } : undefined}
    >
      <div className='h-[3px] w-full bg-brand' />
      <div className='mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:py-6'>
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
