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
        className='h-auto w-[120px] object-contain sm:w-[150px] lg:w-[180px]'
      />
    </Link>
  )
}

export function Header() {
  const [open, setOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <header className='sticky top-0 z-40 bg-background/95 backdrop-blur-md'>
      <div className='border-b border-border/50'>
        <div className='mx-auto flex h-13 max-w-7xl items-center gap-2 px-4 sm:h-14 sm:px-6'>
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
              <div className='flex h-13 items-center border-b px-4'>
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

          <Logo className='absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0' />

          <div className='relative ml-auto flex items-center gap-1'>
            <button
              type='button'
              className='relative hidden h-9 w-44 items-center gap-2 rounded-full border border-border/60 bg-muted/50 pl-3 pr-3 text-sm text-muted-foreground transition-all hover:bg-muted focus-visible:w-56 focus-visible:bg-background focus-visible:border-brand/40 focus-visible:outline-none lg:flex xl:w-52'
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label='খবর খুঁজুন'
            >
              <Search className='h-4 w-4 shrink-0' />
              <span className='flex-1 text-left'>খবর খুঁজুন...</span>
            </button>
            <Button
              variant='ghost'
              size='icon'
              className='h-10 w-10 lg:hidden'
              aria-label='খুঁজুন'
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className='h-5 w-5' />
            </Button>
            <SearchDropdownDesktop
              isOpen={searchOpen}
              onClose={() => setSearchOpen(false)}
            />
          </div>
        </div>
      </div>

      <nav className='border-b border-border/40 bg-background/90 backdrop-blur-sm' aria-label='ক্যাটাগরি নেভিগেশন'>
        <div className='mx-auto flex max-w-7xl items-center gap-0 overflow-x-auto px-4 sm:px-6 scrollbar-hide'>
          {NEWS_CATEGORIES.map((c) => {
            const href = getCategorySlug(c.label)
            return (
              <Link
                key={c.label}
                href={href}
                className={cn(
                  'shrink-0 whitespace-nowrap border-b-2 px-3 py-2.5 text-[12px] font-semibold tracking-wide transition-colors sm:px-4 sm:text-[13px]',
                  pathname === href
                    ? 'border-brand text-brand'
                    : 'border-transparent text-foreground/70 hover:text-foreground'
                )}
              >
                {c.label}
              </Link>
            )
          })}
        </div>
      </nav>

      <SearchDropdown
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </header>
  )
}
