'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * ReadingProgressBar — thin fixed bar at top of viewport.
 * Fills as user scrolls through the article body.
 * Uses requestAnimationFrame for smooth, jank-free updates.
 */
export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return

      rafRef.current = requestAnimationFrame(() => {
        const articleEl = document.getElementById('article-content')
        if (!articleEl) {
          rafRef.current = 0
          return
        }

        const rect = articleEl.getBoundingClientRect()
        const articleTop = rect.top + window.scrollY
        const articleHeight = rect.height
        const scrollY = window.scrollY
        const viewportHeight = window.innerHeight

        // Calculate progress: 0% when article top reaches viewport top,
        // 100% when article bottom reaches viewport bottom
        const start = articleTop - viewportHeight * 0.3
        const end = articleTop + articleHeight - viewportHeight * 0.7
        const scrolled = scrollY - start
        const total = end - start

        if (total <= 0) {
          setProgress(0)
        } else if (scrolled >= total) {
          setProgress(100)
        } else if (scrolled > 0) {
          setProgress(Math.min(100, Math.max(0, (scrolled / total) * 100)))
        }

        rafRef.current = 0
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      className='reading-progress-bar'
      role='progressbar'
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label='পড়ার অগ্রগতি'
      style={{ width: `${progress}%` }}
    />
  )
}
