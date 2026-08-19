'use client'

import * as React from 'react'
import { Facebook, Twitter, Youtube, Instagram, CloudSun, MapPin } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

const SOCIALS = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'X', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
]

export function TopBar() {
  return (
    <div className='hidden border-b border-border/60 bg-card sm:block'>
      <div className='mx-auto flex h-8 max-w-7xl items-center justify-between gap-3 px-4 text-[11px] sm:h-9 sm:px-6 sm:text-xs'>
        {/* Left — location & weather */}
        <div className='flex min-w-0 items-center gap-2.5 text-muted-foreground'>
          <span className='hidden items-center gap-1 sm:inline-flex'>
            <MapPin className='h-3 w-3 text-brand' />
            ঢাকা
          </span>
          <span className='hidden items-center gap-1 md:inline-flex'>
            <CloudSun className='h-3.5 w-3.5 text-amber-500' />
            ৩২°সে
          </span>
        </div>

        {/* Right — socials & theme toggle (hidden on mobile) */}
        <div className='hidden items-center gap-1 sm:flex'>
          <span className='mr-1 text-muted-foreground'>ফলো করুন:</span>
          {SOCIALS.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className='inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-brand hover:text-white hover:scale-105'
            >
              <Icon className='h-[14px] w-[14px]' />
            </a>
          ))}
          <span className='mx-1 h-4 w-px bg-border' />
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
