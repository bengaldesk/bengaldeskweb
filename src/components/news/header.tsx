'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu, Search, Radio } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { NEWS_CATEGORIES } from '@/lib/news-data'

function Logo() {
  return (
    <Link href="/" className="flex items-baseline gap-1.5" aria-label="বার্তা হোম">
      <span className="relative">
        <span className="text-3xl font-extrabold tracking-tight text-brand sm:text-4xl">
          বার্তা
        </span>
        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-brand" />
      </span>
      <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:inline">
        News
      </span>
    </Link>
  )
}

export function Header() {
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="মেনু খুলুন"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <div className="flex h-16 items-center border-b px-5">
              <span className="text-2xl font-extrabold text-brand">বার্তা</span>
            </div>
            <nav className="flex flex-col p-2">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-md px-3 py-2.5 font-semibold text-foreground hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                <Radio className="h-4 w-4 text-brand" />
                প্রচ্ছদ
              </Link>
              {NEWS_CATEGORIES.map((c) => (
                <SheetClose asChild key={c.label}>
                  <Link
                    href="/"
                    className="flex items-center gap-2.5 rounded-md px-3 py-2.5 font-medium text-foreground/90 hover:bg-muted"
                  >
                    <span className={`h-2 w-2 rounded-full ${c.color}`} />
                    {c.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Logo />

        {/* Desktop nav */}
        <nav className="ml-4 hidden flex-1 items-center gap-0.5 lg:flex">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-semibold text-brand hover:bg-brand/10"
          >
            প্রচ্ছদ
          </Link>
          {NEWS_CATEGORIES.map((c) => (
            <Link
              key={c.label}
              href="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="খবর খুঁজুন..."
              className="h-9 w-44 pl-8 md:w-56"
              aria-label="খবর খুঁজুন"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            aria-label="খুঁজুন"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
