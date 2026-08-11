'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, Search, Radio } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { NEWS_CATEGORIES, getCategorySlug } from '@/lib/news-data'
import { cn } from '@/lib/utils'
import { LOGO_URL } from '@/lib/brand'
import { usePathname } from 'next/navigation'
import {
  SearchDropdown,
  SearchDropdownDesktop,
} from './search-dropdown'

function Logo({ className }: { className?: string }) {
  return (
    <Link href='/' className={cn('inline-flex items-center', className)} aria-label='The Bengal Desk Home'>
      <Image
        src={LOGO_URL}
        alt='The Bengal Desk Logo'
        width={220}
        height={64}
        priority
        className='h-auto w-[130px] object-contain sm:w-[160px]'
      />
    </Link>
  )
}

export function Header() {
  const [open, setOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <header className='sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-md'>
      <div className='mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:h-16 sm:px-6'>
        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='h-10 w-10 lg:hidden'
              aria-label='মেনু খুলুন'
            >
              <Menu className='h-5 w-5' />
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-[280px] p-0'>
            <div className='flex h-14 items-center border-b px-4'>
              <Image
                src={LOGO_URL}
                alt='The Bengal Desk Logo'
                width={180}
                height={52}
                className='h-auto w-[130px] object-contain'
              />
            </div>
            <nav className='flex flex-col p-2'>
              <Link
                href='/'
                className='flex items-center gap-2.5 rounded-md px-3 py-2.5 font-semibold text-foreground hover:bg-muted'
                onClick={() => setOpen(false)}
              >
                <Radio className='h-4 w-4 text-brand' />
                প্রচ্ছদ
              </Link>
              {NEWS_CATEGORIES.map((c) => (
                <SheetClose asChild key={c.label}>
                  <Link
                    href={getCategorySlug(c.label)}
                    className={cn(
                      'flex items-center gap-2.5 rounded-md px-3 py-2.5 font-medium transition-colors hover:bg-muted',
                      pathname === getCategorySlug(c.label)
                        ? 'bg-brand/10 text-brand font-semibold'
                        : 'text-foreground/90'
                    )}
                  >
                    <span className={cn('h-2 w-2 rounded-full', c.color)} />
                    {c.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo — centered on mobile, left on desktop */}
        <Logo className='absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0' />

        {/* Desktop nav — with hover underline */}
        <nav className='ml-4 hidden items-center gap-0 lg:flex'>
          <Link
            href='/'
            className={cn(
              'nav-link-hover px-3 py-4 text-sm font-semibold transition-colors',
              pathname === '/' ? 'text-brand' : 'text-foreground/80 hover:text-foreground'
            )}
          >
            প্রচ্ছদ
          </Link>
          {NEWS_CATEGORIES.slice(0, 8).map((c) => {
            const href = getCategorySlug(c.label)
            return (
              <Link
                key={c.label}
                href={href}
                className={cn(
                  'nav-link-hover px-3 py-4 text-sm font-medium transition-colors',
                  pathname === href
                    ? 'text-brand font-semibold'
                    : 'text-foreground/80 hover:text-foreground'
                )}
              >
                {c.label}
              </Link>
            )
          })}
        </nav>

        {/* Search — mobile icon, desktop input */}
        <div className='relative ml-auto flex items-center gap-1'>
          {/* Desktop search trigger */}
          <button
            type='button'
            className='relative hidden h-9 w-44 items-center gap-2 rounded-full border border-border/60 bg-muted/50 pl-3 pr-3 text-sm text-muted-foreground transition-all hover:bg-muted focus-visible:w-56 focus-visible:bg-background focus-visible:border-brand/40 focus-visible:outline-none md:w-52 sm:flex'
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label='খবর খুঁজুন'
          >
            <Search className='h-4 w-4 shrink-0' />
            <span className='flex-1 text-left'>খবর খুঁজুন...</span>
          </button>
          {/* Mobile search button */}
          <Button
            variant='ghost'
            size='icon'
            className='h-10 w-10 sm:hidden'
            aria-label='খুঁজুন'
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className='h-5 w-5' />
          </Button>

          {/* Desktop dropdown */}
          <SearchDropdownDesktop
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
          />
        </div>
      </div>

      {/* Mobile full-screen search overlay */}
      <SearchDropdown
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </header>
  )
}
