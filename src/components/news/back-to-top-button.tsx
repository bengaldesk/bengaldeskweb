'use client'

import { useEffect, useState, useCallback } from 'react'
import { ArrowUp } from 'lucide-react'

/**
 * BackToTopButton — appears after scrolling past 600px.
 * Smooth-scrolls to top on click.
 */
export function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      className='back-to-top-btn'
      aria-label='পৃষ্ঠার শীর্ষে ফিরুন'
      title='উপরে যান'
    >
      <ArrowUp className='h-5 w-5' />
    </button>
  )
}
