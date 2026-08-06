'use client'

import * as React from 'react'
import Link from 'next/link'
import { Home, Newspaper, Video, MessageSquare, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { icon: Home, label: 'হোম', href: '/' },
  { icon: Newspaper, label: 'সংবাদ', href: '/category/national' },
  { icon: Video, label: 'ভিডিও', href: '/#video' },
  { icon: MessageSquare, label: 'মতামত', href: '/category/opinion' },
  { icon: MoreHorizontal, label: 'আরও', href: '/#more' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className='fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background lg:hidden'
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label='প্রাথমিক নেভিগেশন'
    >
      <div className='flex h-14 items-center'>
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive =
            href === '/'
              ? pathname === '/'
              : pathname.startsWith(href.replace(/#.*$/, ''))

          return (
            <Link
              key={label}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors',
                isActive ? 'text-brand' : 'text-muted-foreground'
              )}
              style={{ WebkitTapHighlightColor: 'transparent' }}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className='h-5 w-5' strokeWidth={isActive ? 2.5 : 2} />
              <span className='text-[10px] font-medium leading-none'>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
