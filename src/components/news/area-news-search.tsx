'use client'

import * as React from 'react'
import Link from 'next/link'
import { MapPin, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  NEWS_AREAS,
  categoryColor,
  getAreaByNewsId,
  getLatest,
} from '@/lib/news-data'
import { relativeTimeBn } from '@/lib/bn'
import { cn } from '@/lib/utils'
import { SectionHeader } from './section-header'

const ALL_AREAS = 'সব এলাকা'

export function AreaNewsSearch() {
  const [selectedArea, setSelectedArea] = React.useState<string>(ALL_AREAS)
  const [keyword, setKeyword] = React.useState('')

  const results = React.useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    return getLatest().filter((item) => {
      const area = getAreaByNewsId(item.id)
      const areaOk = selectedArea === ALL_AREAS || area === selectedArea

      const keywordOk =
        normalizedKeyword.length === 0 ||
        item.title.toLowerCase().includes(normalizedKeyword) ||
        item.excerpt.toLowerCase().includes(normalizedKeyword)

      return areaOk && keywordOk
    })
  }, [selectedArea, keyword])

  return (
    <section className='py-6 sm:py-8'>
      <SectionHeader title='এলাকাভিত্তিক নিউজ অনুসন্ধান' />

      <div className='rounded-xl border border-border/60 bg-secondary/25 p-4 sm:p-5'>
        <div className='grid gap-3 md:grid-cols-[220px_1fr]'>
          <div>
            <label htmlFor='area-select' className='mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              এলাকা নির্বাচন করুন
            </label>
            <div className='relative'>
              <MapPin className='pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <select
                id='area-select'
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className='h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50'
              >
                <option value={ALL_AREAS}>{ALL_AREAS}</option>
                {NEWS_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              কীওয়ার্ড
            </label>
            <div className='relative'>
              <Search className='pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder='শিরোনাম বা সারাংশ দিয়ে খুঁজুন...'
                className='pl-8'
              />
            </div>
          </div>
        </div>

        <p className='mt-3 text-xs text-muted-foreground'>
          ফলাফল: <span className='font-semibold text-foreground'>{results.length}</span> টি সংবাদ
        </p>

        <div className='mt-4 space-y-3'>
          {results.length === 0 ? (
            <p className='rounded-md border border-dashed border-border px-4 py-5 text-sm text-muted-foreground'>
              নির্বাচিত ফিল্টারে কোনো সংবাদ পাওয়া যায়নি।
            </p>
          ) : (
            results.slice(0, 8).map((item) => {
              const area = getAreaByNewsId(item.id)

              return (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className='group block rounded-md border border-border/60 bg-background p-4 transition-colors hover:border-brand/40 hover:bg-secondary/40'
                >
                  <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold'>
                    <span className='inline-flex items-center gap-1.5 text-muted-foreground'>
                      <MapPin className='h-3.5 w-3.5' />
                      {area}
                    </span>
                    <span className='text-muted-foreground'>•</span>
                    <span className='inline-flex items-center gap-1.5'>
                      <span className={cn('inline-block h-1.5 w-1.5 rounded-full', categoryColor(item.category))} />
                      <span className='text-muted-foreground'>{item.category}</span>
                    </span>
                  </div>

                  <h3 className='mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-brand sm:text-[15px]'>
                    {item.title}
                  </h3>

                  <p className='mt-1 line-clamp-2 text-sm text-muted-foreground'>{item.excerpt}</p>

                  <p className='mt-1.5 text-xs text-muted-foreground'>
                    {relativeTimeBn(new Date(item.publishedAt))}
                  </p>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
